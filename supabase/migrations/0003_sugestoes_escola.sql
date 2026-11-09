-- Sugestões de escolas que não estão no cadastro (a lista inicial cobre ~441 de ~471 cursos do e-MEC).
create table public.sugestoes_escola (
  id bigserial primary key,
  usuario_id uuid references auth.users(id) on delete set null,
  texto text not null check (char_length(texto) between 3 and 160),
  uf char(2),
  status text not null default 'pendente' check (status in ('pendente','aprovada','recusada')),
  escola_criada text references public.escolas(id),
  criado_em timestamptz not null default now()
);
alter table public.sugestoes_escola enable row level security;
create policy sugestoes_proprias on public.sugestoes_escola for select using (auth.uid() = usuario_id);

create or replace function public.sugerir_escola(p_texto text, p_uf text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if (select count(*) from sugestoes_escola where usuario_id = auth.uid() and criado_em > now() - interval '1 day') >= 3 then
    raise exception 'limite de sugestões por dia';
  end if;
  insert into sugestoes_escola (usuario_id, texto, uf) values (auth.uid(), trim(p_texto), upper(p_uf));
end $$;
revoke all on function public.sugerir_escola(text, text) from public;
grant execute on function public.sugerir_escola(text, text) to authenticated;
