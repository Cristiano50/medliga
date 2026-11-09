-- Reportes de erro de conteúdo enviados pelos jogadores (fila para a revisão).
create table public.reportes_conteudo (
  id bigserial primary key,
  id_local text not null,
  usuario_id uuid references auth.users(id) on delete set null,
  questao_id text not null,
  motivo text not null check (motivo in ('gabarito','explicacao','enunciado','portugues','outro')),
  texto text check (char_length(texto) <= 1000),
  versao_app text,
  status text not null default 'aberto' check (status in ('aberto','procedente','improcedente','corrigido')),
  criado_em timestamptz not null default now(),
  unique (usuario_id, id_local)
);
create index reportes_questao_idx on public.reportes_conteudo(questao_id, status);
alter table public.reportes_conteudo enable row level security;
create policy reportes_proprios on public.reportes_conteudo for select using (auth.uid() = usuario_id);

create or replace function public.reportar_conteudo(p_id_local text, p_questao_id text, p_motivo text, p_texto text, p_versao_app text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if (select count(*) from reportes_conteudo where usuario_id = auth.uid() and criado_em > now() - interval '1 day') >= 30 then
    raise exception 'limite de reportes por dia';
  end if;
  insert into reportes_conteudo (id_local, usuario_id, questao_id, motivo, texto, versao_app)
  values (p_id_local, auth.uid(), p_questao_id, p_motivo, left(p_texto, 1000), p_versao_app)
  on conflict (usuario_id, id_local) do nothing;
end $$;
revoke all on function public.reportar_conteudo(text, text, text, text, text) from public;
grant execute on function public.reportar_conteudo(text, text, text, text, text) to authenticated;
