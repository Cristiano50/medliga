-- MedLiga — funções de servidor (perfil, plano, registro de sessão com recálculo de XP, rankings).
-- As regras de XP espelham src/core/scoring.ts e src/games/minijogo.ts. Mudou lá, mude aqui (há teste para isso).

create or replace function public.semana_de(ts timestamptz)
returns date language sql immutable as $$
  select date_trunc('week', ts at time zone 'America/Sao_Paulo')::date
$$;

-- ---------------------------------------------------------------- perfil
create or replace function public.salvar_perfil(p_nome text, p_escola_id text, p_semestre int, p_curso text default 'medicina')
returns void language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_verificado boolean := false;
begin
  if v_uid is null then raise exception 'não autenticado'; end if;
  if p_escola_id is not null and not exists (select 1 from escolas where id = p_escola_id and ativa) then
    raise exception 'escola inválida';
  end if;
  select email into v_email from auth.users where id = v_uid;
  if p_escola_id is not null and v_email is not null then
    select exists (
      select 1 from escolas e, unnest(e.dominios_email) d
      where e.id = p_escola_id
        and (lower(split_part(v_email, '@', 2)) = lower(d) or lower(split_part(v_email, '@', 2)) like '%.' || lower(d))
    ) into v_verificado;
  end if;
  insert into perfis (id, nome, escola_id, semestre, curso, verificado)
  values (v_uid, trim(p_nome), p_escola_id, p_semestre, coalesce(p_curso, 'medicina'), v_verificado)
  on conflict (id) do update
    set nome = excluded.nome, escola_id = excluded.escola_id, semestre = excluded.semestre,
        curso = excluded.curso, verificado = excluded.verificado, atualizado_em = now();
end $$;

-- ---------------------------------------------------------------- plano
create or replace function public.plano_atual()
returns text language sql stable security definer set search_path = public as $$
  select case
    when exists (
      select 1 from perfis p join licencas_institucionais l on l.escola_id = p.escola_id
      where p.id = auth.uid() and l.valido_ate >= current_date
    ) then 'institucional'
    when exists (select 1 from assinaturas a where a.usuario_id = auth.uid() and a.valido_ate > now()) then 'premium'
    else 'gratuito'
  end
$$;

-- ---------------------------------------------------------------- registro de sessão
-- p_sessao: {id, modo, disciplina, inicio, fim, ranqueada}
-- p_respostas: [{questao_id, topico_id, correta, tempo_ms, criado_em}] na ordem em que foram respondidas.
create or replace function public.registrar_sessao(p_sessao jsonb, p_respostas jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid := (p_sessao->>'id')::uuid;
  v_modo text := p_sessao->>'modo';
  v_inicio timestamptz := (p_sessao->>'inicio')::timestamptz;
  v_fim timestamptz := (p_sessao->>'fim')::timestamptz;
  v_ranqueada boolean := coalesce((p_sessao->>'ranqueada')::boolean, true);
  v_semana date;
  v_escola text;
  v_existente record;
  v_resp record;
  v_dif smallint;
  v_base numeric;
  v_xp numeric;
  v_xp_total integer := 0;
  v_combo integer := 0;
  v_recentes integer;
  v_soma_tempo bigint;
  v_n integer;
  v_xp_hoje integer;
  v_recusa text := null;
  v_minijogo boolean;
  c_limite_diario constant integer := 2500;
  c_max_respostas constant integer := 60;
  c_tempo_min constant integer := 1000;          -- questões: abaixo disso é implausível ler e responder
  c_tempo_min_minijogo constant integer := 300;  -- minijogos: jogadas rápidas são legítimas
  c_limite_plantao constant integer := 15000;
begin
  if v_uid is null then raise exception 'não autenticado'; end if;

  -- Idempotência: reenvio da mesma sessão devolve o resultado anterior.
  select * into v_existente from sessoes where id = v_id;
  if found then
    if v_existente.usuario_id <> v_uid then raise exception 'sessão de outro usuário'; end if;
    return jsonb_build_object('xp_contabilizado', v_existente.xp_contabilizado, 'recusada', v_existente.recusada, 'repetida', true);
  end if;

  v_n := jsonb_array_length(coalesce(p_respostas, '[]'::jsonb));
  select coalesce(sum(greatest(0, (r->>'tempo_ms')::bigint)), 0) into v_soma_tempo from jsonb_array_elements(coalesce(p_respostas, '[]'::jsonb)) r;

  -- Plausibilidade (antifraude básico)
  if v_modo not in ('estudo','plantao','revisao','identifique','linha-do-tempo','camadas','duelo','microscopio','qual-tecido') then v_recusa := 'modo inválido';
  elsif v_fim < v_inicio then v_recusa := 'horários inconsistentes';
  elsif v_fim > now() + interval '5 minutes' then v_recusa := 'sessão no futuro';
  elsif v_inicio < now() - interval '8 days' then v_recusa := 'sessão antiga demais';
  elsif v_n > c_max_respostas then v_recusa := 'respostas demais';
  elsif v_soma_tempo > extract(epoch from (v_fim - v_inicio)) * 1000 + 60000 then v_recusa := 'tempo das respostas maior que a sessão';
  end if;

  select escola_id into v_escola from perfis where id = v_uid;
  v_semana := semana_de(v_fim);

  insert into sessoes (id, usuario_id, modo, disciplina, inicio, fim, ranqueada, semana, escola_id, recusada)
  values (v_id, v_uid, v_modo, coalesce(p_sessao->>'disciplina', 'embriologia'), v_inicio, v_fim, v_ranqueada, v_semana, v_escola, v_recusa);

  if v_recusa is not null then
    return jsonb_build_object('xp_contabilizado', 0, 'recusada', v_recusa);
  end if;

  for v_resp in
    select r->>'questao_id' as questao_id, r->>'topico_id' as topico_id, (r->>'correta')::boolean as correta,
           greatest(0, (r->>'tempo_ms')::int) as tempo_ms, coalesce((r->>'criado_em')::timestamptz, v_fim) as criado_em, ord
    from jsonb_array_elements(p_respostas) with ordinality as t(r, ord)
    order by ord
  loop
    v_xp := 0;
    -- jogadas de minijogos têm ':' no id (ex.: 'camadas:baco', 'lamina:osso:osteon'); questões nunca têm
    v_minijogo := position(':' in v_resp.questao_id) > 0;
    if v_resp.correta and v_resp.tempo_ms >= (case when v_minijogo then c_tempo_min_minijogo else c_tempo_min end) then
      if v_minijogo then
        -- minijogos: 4 XP por acerto com combo
        v_xp := 4 * (1 + least(0.5, v_combo * 0.1));
      else
        select dificuldade into v_dif from questoes where id = v_resp.questao_id;
        if found then
          v_base := (array[10, 12, 15, 18, 22])[v_dif];
          select count(*) into v_recentes from respostas
            where usuario_id = v_uid and questao_id = v_resp.questao_id and correta and criado_em > v_fim - interval '24 hours';
          v_xp := v_base
                  * (1 + least(0.5, v_combo * 0.1)
                       + case when v_modo = 'plantao' then 0.5 * greatest(0, 1 - v_resp.tempo_ms::numeric / c_limite_plantao) else 0 end)
                  * (array[1, 0.5, 0.2])[least(v_recentes, 2) + 1];
        end if;
      end if;
    end if;
    v_xp := round(v_xp);
    v_combo := case when v_resp.correta then v_combo + 1 else 0 end;
    insert into respostas (sessao_id, usuario_id, questao_id, topico_id, correta, tempo_ms, xp, criado_em)
    values (v_id, v_uid, v_resp.questao_id, coalesce(v_resp.topico_id, ''), v_resp.correta, v_resp.tempo_ms, v_xp::int, v_resp.criado_em);
    v_xp_total := v_xp_total + v_xp::int;
  end loop;

  -- Teto diário (dia de Brasília)
  select coalesce(sum(xp_contabilizado), 0) into v_xp_hoje from sessoes
   where usuario_id = v_uid and id <> v_id
     and (fim at time zone 'America/Sao_Paulo')::date = (v_fim at time zone 'America/Sao_Paulo')::date;
  v_xp_total := greatest(0, least(v_xp_total, c_limite_diario - v_xp_hoje));
  if not v_ranqueada then v_xp_total := 0; end if;

  update sessoes set xp_contabilizado = v_xp_total where id = v_id;
  if v_xp_total > 0 then
    insert into xp_semanal (usuario_id, semana, escola_id, xp) values (v_uid, v_semana, v_escola, v_xp_total)
    on conflict (usuario_id, semana) do update set xp = xp_semanal.xp + excluded.xp;
  end if;
  return jsonb_build_object('xp_contabilizado', v_xp_total, 'recusada', null);
end $$;

-- ---------------------------------------------------------------- rankings
create or replace function public.ranking_alunos(p_semana date, p_escola_id text default null, p_limite int default 100)
returns table (usuario_id uuid, nome text, escola_id text, xp_semana integer, verificado boolean)
language sql stable security definer set search_path = public as $$
  select x.usuario_id, p.nome, x.escola_id, x.xp, p.verificado
  from xp_semanal x join perfis p on p.id = x.usuario_id
  where x.semana = p_semana and x.xp > 0 and (p_escola_id is null or x.escola_id = p_escola_id)
  order by x.xp desc, x.usuario_id
  limit least(greatest(p_limite, 1), 500)
$$;

create or replace function public.ranking_escolas(p_semana date, p_limite int default 100)
returns table (escola_id text, pontos integer, contribuintes integer, membros_ativos integer)
language sql stable security definer set search_path = public as $$
  with ordenado as (
    select x.escola_id, x.xp, row_number() over (partition by x.escola_id order by x.xp desc) as pos
    from xp_semanal x
    where x.semana = p_semana and x.escola_id is not null and x.xp > 0
  )
  select escola_id,
         sum(xp) filter (where pos <= 20)::int as pontos,
         count(*) filter (where pos <= 20)::int as contribuintes,
         count(*)::int as membros_ativos
  from ordenado
  group by escola_id
  order by pontos desc, membros_ativos desc
  limit least(greatest(p_limite, 1), 500)
$$;

-- ---------------------------------------------------------------- LGPD: exclusão da própria conta
create or replace function public.excluir_minha_conta()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  delete from auth.users where id = auth.uid(); -- cascata apaga perfil, sessões, respostas e XP
end $$;

-- ---------------------------------------------------------------- permissões
revoke all on function public.salvar_perfil(text, text, int, text) from public;
revoke all on function public.plano_atual() from public;
revoke all on function public.registrar_sessao(jsonb, jsonb) from public;
revoke all on function public.excluir_minha_conta() from public;
revoke all on function public.ranking_alunos(date, text, int) from public;
revoke all on function public.ranking_escolas(date, int) from public;
grant execute on function public.salvar_perfil(text, text, int, text) to authenticated;
grant execute on function public.plano_atual() to authenticated;
grant execute on function public.registrar_sessao(jsonb, jsonb) to authenticated;
grant execute on function public.excluir_minha_conta() to authenticated;
grant execute on function public.ranking_alunos(date, text, int) to authenticated, anon;
grant execute on function public.ranking_escolas(date, int) to authenticated, anon;
