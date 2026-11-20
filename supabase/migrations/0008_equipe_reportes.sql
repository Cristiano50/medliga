-- Fila de reportes para a equipe de conteúdo (v0.2).
-- Quem é da equipe: tabela `equipe`, preenchida pela própria equipe (service role / SQL), como `professores`.
-- A fila não mostra quem reportou (minimização, LGPD): só a questão, o motivo, o texto do reporte e a data.
-- Tratar um reporte só registra a situação dele; corrigir o conteúdo continua sendo feito no repositório, com a
-- revisão em etapas, e nada aqui marca conteúdo como conferido por médico.

create table public.equipe (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  papel text not null default 'revisor' check (papel in ('revisor', 'admin')),
  concedido_em timestamptz not null default now()
);
alter table public.equipe enable row level security;
create policy equipe_propria on public.equipe for select using (auth.uid() = usuario_id);

alter table public.reportes_conteudo
  add column tratado_por uuid references auth.users(id) on delete set null,
  add column tratado_em timestamptz,
  add column nota_equipe text check (char_length(nota_equipe) <= 1000);
create index reportes_status_idx on public.reportes_conteudo(status, criado_em);

create or replace function public.sou_equipe()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from equipe where usuario_id = auth.uid())
$$;

-- Total por situação (as abas da tela).
create or replace function public.contagem_reportes()
returns table (status text, total integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if not sou_equipe() then raise exception 'sem acesso à fila de reportes'; end if;
  return query
    select s.status, count(r.id)::int
    from (values ('aberto'), ('procedente'), ('improcedente'), ('corrigido')) as s(status)
    left join reportes_conteudo r on r.status = s.status
    group by s.status;
end $$;

-- Reportes de uma situação. Nos abertos, primeiro as questões com mais reportes e, dentro delas, os mais antigos;
-- nos tratados, os mais recentes. `reportes_da_questao` conta os reportes da questão na mesma situação.
create or replace function public.fila_reportes(p_status text default 'aberto', p_limite integer default 100)
returns table (
  id bigint, questao_id text, motivo text, texto text, versao_app text, status text, criado_em timestamptz,
  reportes_da_questao integer, nota_equipe text, tratado_em timestamptz
)
language plpgsql stable security definer set search_path = public as $$
begin
  if not sou_equipe() then raise exception 'sem acesso à fila de reportes'; end if;
  if p_status not in ('aberto', 'procedente', 'improcedente', 'corrigido') then raise exception 'situação inválida: %', p_status; end if;
  return query
    with doStatus as (
      select r.*, count(*) over (partition by r.questao_id)::int as n
      from reportes_conteudo r
      where r.status = p_status
    )
    select d.id, d.questao_id, d.motivo, d.texto, d.versao_app, d.status, d.criado_em, d.n, d.nota_equipe, d.tratado_em
    from doStatus d
    order by
      case when p_status = 'aberto' then d.n end desc nulls last,
      case when p_status = 'aberto' then d.questao_id end,
      case when p_status = 'aberto' then d.criado_em end,
      d.tratado_em desc nulls last,
      d.id
    limit least(greatest(coalesce(p_limite, 100), 1), 200);
end $$;

-- Muda a situação de um reporte (ou de todos os abertos da mesma questão) e devolve quantos mudaram.
-- Reabrir ('aberto') apaga quem tratou e quando; a nota fica.
create or replace function public.tratar_reporte(p_id bigint, p_status text, p_nota text default null, p_mesma_questao boolean default false)
returns integer
language plpgsql security definer set search_path = public as $$
declare
  v_questao text;
  v_n integer;
  v_nota text := left(nullif(btrim(coalesce(p_nota, '')), ''), 1000);
begin
  if not sou_equipe() then raise exception 'sem acesso à fila de reportes'; end if;
  if p_status not in ('aberto', 'procedente', 'improcedente', 'corrigido') then raise exception 'situação inválida: %', p_status; end if;
  select questao_id into v_questao from reportes_conteudo where id = p_id;
  if v_questao is null then raise exception 'reporte não encontrado'; end if;
  update reportes_conteudo r
     set status = p_status,
         nota_equipe = coalesce(v_nota, r.nota_equipe),
         tratado_por = case when p_status = 'aberto' then null else auth.uid() end,
         tratado_em = case when p_status = 'aberto' then null else now() end
   where r.id = p_id
      or (p_mesma_questao and r.questao_id = v_questao and r.status = 'aberto');
  get diagnostics v_n = row_count;
  return v_n;
end $$;

revoke all on function public.sou_equipe() from public;
revoke all on function public.contagem_reportes() from public;
revoke all on function public.fila_reportes(text, integer) from public;
revoke all on function public.tratar_reporte(bigint, text, text, boolean) from public;
grant execute on function public.sou_equipe() to authenticated;
grant execute on function public.contagem_reportes() to authenticated;
grant execute on function public.fila_reportes(text, integer) to authenticated;
grant execute on function public.tratar_reporte(bigint, text, text, boolean) to authenticated;
