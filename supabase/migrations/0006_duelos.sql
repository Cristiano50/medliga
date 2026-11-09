-- Duelos assíncronos: um aluno cria um desafio com 10 questões; o colega entra pelo código e responde as mesmas.
-- Vence quem acerta mais; empate → menor tempo total. O XP de cada partida entra pelo registrar_sessao (modo 'duelo').

alter table public.sessoes drop constraint if exists sessoes_modo_check;
alter table public.sessoes add constraint sessoes_modo_check
  check (modo in ('estudo','plantao','revisao','identifique','linha-do-tempo','camadas','duelo'));

create table public.duelos (
  codigo text primary key check (codigo ~ '^[A-Z2-9]{6}$'),
  criador uuid not null references auth.users(id) on delete cascade,
  oponente uuid references auth.users(id) on delete set null,
  disciplina text not null,
  questoes text[] not null check (array_length(questoes, 1) between 5 and 20),
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null default now() + interval '48 hours',
  resultado_criador jsonb,   -- {acertos, total, tempo_ms}
  resultado_oponente jsonb
);
create index duelos_criador_idx on public.duelos(criador, criado_em desc);
create index duelos_oponente_idx on public.duelos(oponente, criado_em desc);
alter table public.duelos enable row level security;
create policy duelos_participantes on public.duelos for select using (auth.uid() in (criador, oponente));

create or replace function public.criar_duelo(p_disciplina text, p_questoes text[])
returns text language plpgsql security definer set search_path = public as $$
declare
  v_codigo text;
  v_alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- sem 0/O/1/I para evitar confusão
  v_tentativa int := 0;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if (select count(*) from duelos where criador = auth.uid() and criado_em > now() - interval '1 day') >= 30 then
    raise exception 'limite de duelos por dia';
  end if;
  if exists (select 1 from unnest(p_questoes) q where not exists (select 1 from questoes where id = q)) then
    raise exception 'questão inexistente no catálogo';
  end if;
  loop
    v_codigo := '';
    for i in 1..6 loop
      v_codigo := v_codigo || substr(v_alfabeto, 1 + floor(random() * length(v_alfabeto))::int, 1);
    end loop;
    begin
      insert into duelos (codigo, criador, disciplina, questoes) values (v_codigo, auth.uid(), p_disciplina, p_questoes);
      return v_codigo;
    exception when unique_violation then
      v_tentativa := v_tentativa + 1;
      if v_tentativa > 5 then raise; end if;
    end;
  end loop;
end $$;

-- Entra no duelo (ou relê o próprio). Devolve as questões e o estado, sem revelar o resultado do outro antes de jogar.
create or replace function public.entrar_duelo(p_codigo text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  d duelos;
  v_uid uuid := auth.uid();
  v_sou_criador boolean;
  v_meu jsonb;
  v_outro jsonb;
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
  return jsonb_build_object(
    'codigo', d.codigo,
    'disciplina', d.disciplina,
    'questoes', to_jsonb(d.questoes),
    'sou_criador', v_sou_criador,
    'adversario', (select nome from perfis where id = case when v_sou_criador then d.oponente else d.criador end),
    'meu_resultado', v_meu,
    'resultado_adversario', case when v_meu is null then null else v_outro end, -- só depois de jogar
    'expira_em', d.expira_em
  );
end $$;

create or replace function public.registrar_resultado_duelo(p_codigo text, p_acertos int, p_total int, p_tempo_ms int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  d duelos;
  v_uid uuid := auth.uid();
  v_res jsonb := jsonb_build_object('acertos', p_acertos, 'total', p_total, 'tempo_ms', p_tempo_ms);
begin
  if v_uid is null then raise exception 'não autenticado'; end if;
  select * into d from duelos where codigo = upper(p_codigo) for update;
  if not found then raise exception 'duelo não encontrado'; end if;
  if p_total <> array_length(d.questoes, 1) or p_acertos < 0 or p_acertos > p_total or p_tempo_ms < p_total * 1000 then
    raise exception 'resultado inválido';
  end if;
  if v_uid = d.criador then
    if d.resultado_criador is not null then raise exception 'resultado já registrado'; end if;
    update duelos set resultado_criador = v_res where codigo = d.codigo;
  elsif v_uid = d.oponente then
    if d.resultado_oponente is not null then raise exception 'resultado já registrado'; end if;
    update duelos set resultado_oponente = v_res where codigo = d.codigo;
  else
    raise exception 'você não participa deste duelo';
  end if;
  return entrar_duelo(d.codigo);
end $$;

revoke all on function public.criar_duelo(text, text[]) from public;
revoke all on function public.entrar_duelo(text) from public;
revoke all on function public.registrar_resultado_duelo(text, int, int, int) from public;
grant execute on function public.criar_duelo(text, text[]) to authenticated;
grant execute on function public.entrar_duelo(text) to authenticated;
grant execute on function public.registrar_resultado_duelo(text, int, int, int) to authenticated;
