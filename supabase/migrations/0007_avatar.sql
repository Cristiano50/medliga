-- Avatar do jogador: montado só com peças prontas do app (sem foto). O servidor guarda os ids das peças escolhidas
-- e confere o formato. O desbloqueio dos itens (por nível e por conquista) é conferido no app, porque nível e
-- conquistas não existem no servidor: um cliente adulterado poderia exibir um item ainda bloqueado. É só cosmético
-- e não afeta XP nem ranking.

-- Formato aceito: objeto com "v": 1 e as 12 categorias, cada uma com um id curto (minúsculas, dígitos e hífen).
create or replace function public.avatar_valido(p jsonb)
returns boolean language sql immutable as $$
  select coalesce(
    jsonb_typeof(p) = 'object'
    and octet_length(p::text) <= 800
    and p->'v' = '1'::jsonb
    and (select count(*) from jsonb_object_keys(p)) = 13
    and not exists (
      select 1 from jsonb_each(p) e
      where e.key <> 'v'
        and (e.key not in ('pele','rosto','cabelo','corCabelo','cabeca','barba','oculos','roupa','corRoupa','acessorio','fundo','moldura')
             or jsonb_typeof(e.value) <> 'string'
             or (e.value #>> '{}') !~ '^[a-z0-9-]{1,24}$')),
    false)
$$;

alter table public.perfis add column avatar jsonb;
alter table public.perfis add constraint perfis_avatar_formato check (avatar is null or public.avatar_valido(avatar));

-- Grava (ou, com null, remove) o avatar do próprio usuário. Separada de salvar_perfil para não criar sobrecarga.
create or replace function public.salvar_avatar(p_avatar jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if p_avatar is not null and not avatar_valido(p_avatar) then raise exception 'avatar inválido'; end if;
  update perfis set avatar = p_avatar, atualizado_em = now() where id = auth.uid();
  if not found then raise exception 'perfil não encontrado'; end if;
end $$;

revoke all on function public.salvar_avatar(jsonb) from public;
grant execute on function public.salvar_avatar(jsonb) to authenticated;

-- Ranking individual com o avatar (muda o tipo de retorno: é preciso recriar a função e as permissões).
drop function public.ranking_alunos(date, text, int);
create function public.ranking_alunos(p_semana date, p_escola_id text default null, p_limite int default 100)
returns table (usuario_id uuid, nome text, escola_id text, xp_semana integer, verificado boolean, avatar jsonb)
language sql stable security definer set search_path = public as $$
  select x.usuario_id, p.nome, x.escola_id, x.xp, p.verificado, p.avatar
  from xp_semanal x join perfis p on p.id = x.usuario_id
  where x.semana = p_semana and x.xp > 0 and (p_escola_id is null or x.escola_id = p_escola_id)
  order by x.xp desc, x.usuario_id
  limit least(greatest(p_limite, 1), 500)
$$;
revoke all on function public.ranking_alunos(date, text, int) from public;
grant execute on function public.ranking_alunos(date, text, int) to authenticated, anon;

-- Duelo: devolve também o avatar do adversário (mesma função de 0006, com um campo a mais).
create or replace function public.entrar_duelo(p_codigo text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  d duelos;
  v_uid uuid := auth.uid();
  v_sou_criador boolean;
  v_meu jsonb;
  v_outro jsonb;
  v_adversario uuid;
begin
  if v_uid is null then raise exception 'não autenticado'; end if;
  select * into d from duelos where codigo = upper(p_codigo) for update;
  if not found then raise exception 'duelo não encontrado'; end if;
  if d.criador <> v_uid and d.oponente is null then
    if d.expira_em < now() then raise exception 'duelo expirado'; end if;
    update duelos set oponente = v_uid where codigo = d.codigo returning * into d;
  end if;
  if v_uid not in (d.criador, d.oponente) then raise exception 'duelo já tem dois participantes'; end if;
  v_sou_criador := d.criador = v_uid;
  v_meu := case when v_sou_criador then d.resultado_criador else d.resultado_oponente end;
  v_outro := case when v_sou_criador then d.resultado_oponente else d.resultado_criador end;
  v_adversario := case when v_sou_criador then d.oponente else d.criador end;
  return jsonb_build_object(
    'codigo', d.codigo,
    'disciplina', d.disciplina,
    'questoes', to_jsonb(d.questoes),
    'sou_criador', v_sou_criador,
    'adversario', (select nome from perfis where id = v_adversario),
    'adversario_avatar', (select avatar from perfis where id = v_adversario),
    'meu_resultado', v_meu,
    'resultado_adversario', case when v_meu is null then null else v_outro end, -- só depois de jogar
    'expira_em', d.expira_em
  );
end $$;
