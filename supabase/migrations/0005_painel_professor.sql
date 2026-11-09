-- Painel do professor (plano institucional): desempenho AGREGADO da turma por tópico.
-- Sem dados individuais (LGPD): só contagens e percentuais, e só quando há pelo menos 5 alunos no recorte.
create table public.professores (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  escola_id text not null references public.escolas(id),
  concedido_em timestamptz not null default now(),
  primary key (usuario_id, escola_id)
);
alter table public.professores enable row level security;
create policy professor_proprio on public.professores for select using (auth.uid() = usuario_id);
-- Concessão feita pela equipe (service role / SQL), após conferir o vínculo com a escola.

create or replace function public.minhas_escolas_professor()
returns table (escola_id text, licenca_ativa boolean)
language sql stable security definer set search_path = public as $$
  select p.escola_id,
         exists (select 1 from licencas_institucionais l where l.escola_id = p.escola_id and l.valido_ate >= current_date)
  from professores p where p.usuario_id = auth.uid()
$$;

create or replace function public.painel_escola(p_escola_id text, p_desde date default (current_date - 28))
returns table (topico_id text, alunos integer, respostas integer, acerto numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from professores where usuario_id = auth.uid() and escola_id = p_escola_id) then
    raise exception 'sem acesso ao painel desta escola';
  end if;
  if not exists (select 1 from licencas_institucionais where escola_id = p_escola_id and valido_ate >= current_date) then
    raise exception 'licença institucional inativa';
  end if;
  return query
    select r.topico_id,
           count(distinct r.usuario_id)::int,
           count(*)::int,
           round(100.0 * avg(case when r.correta then 1 else 0 end), 1)
    from respostas r
    join sessoes s on s.id = r.sessao_id
    where s.escola_id = p_escola_id and r.criado_em >= p_desde and r.questao_id !~ '^(camadas|linha|identifique):'
    group by r.topico_id
    having count(distinct r.usuario_id) >= 5
    order by r.topico_id;
end $$;

revoke all on function public.minhas_escolas_professor() from public;
revoke all on function public.painel_escola(text, date) from public;
grant execute on function public.minhas_escolas_professor() to authenticated;
grant execute on function public.painel_escola(text, date) to authenticated;
