-- MedLiga — esquema base (Supabase / PostgreSQL 15+)
-- Princípios:
--  * o cliente NUNCA grava diretamente em tabelas de pontuação: tudo passa por funções SECURITY DEFINER
--    que recalculam o XP no servidor (o XP enviado pelo app é ignorado);
--  * RLS ligado em todas as tabelas; leitura pública só via funções de ranking (sem expor e-mail);
--  * dados pessoais mínimos (LGPD): apelido, escola, semestre. E-mail fica só em auth.users.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- escolas
create table public.escolas (
  id text primary key,
  sigla text not null,
  nome text not null,
  cidade text not null,
  uf char(2) not null,
  natureza text not null check (natureza in ('publica-federal','publica-estadual','publica-municipal','privada','comunitaria')),
  dominios_email text[] not null default '{}',   -- para o selo "aluno verificado" (ex.: {'aluno.unb.br'})
  ativa boolean not null default true
);

-- ---------------------------------------------------------------- catálogo de questões (gerado do conteúdo)
-- Usado pelo servidor para recalcular o XP. Atualizado por scripts/gerar-seed.ts a cada versão do conteúdo.
create table public.questoes (
  id text primary key,
  disciplina text not null,
  topico_id text not null,
  tipo text not null,
  dificuldade smallint not null check (dificuldade between 1 and 5)
);

-- ---------------------------------------------------------------- perfis
create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null check (char_length(nome) between 2 and 40),
  escola_id text references public.escolas(id),
  semestre smallint check (semestre between 1 and 12),
  curso text not null default 'medicina',
  verificado boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index perfis_escola_idx on public.perfis(escola_id);

-- ---------------------------------------------------------------- planos e licenças
create table public.assinaturas (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  plano text not null check (plano in ('premium')),
  valido_ate timestamptz not null,
  origem text not null check (origem in ('google-play','app-store','web','cortesia')),
  referencia_externa text,
  atualizado_em timestamptz not null default now()
);

create table public.licencas_institucionais (
  id uuid primary key default gen_random_uuid(),
  escola_id text not null references public.escolas(id),
  descricao text,
  assentos integer,
  valido_ate date not null,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------- sessões e respostas
create table public.sessoes (
  id uuid primary key,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  modo text not null check (modo in ('estudo','plantao','revisao','identifique','linha-do-tempo','camadas')),
  disciplina text not null,
  inicio timestamptz not null,
  fim timestamptz not null,
  ranqueada boolean not null,
  semana date not null,
  escola_id text references public.escolas(id),
  xp_contabilizado integer not null default 0,
  recusada text,
  recebida_em timestamptz not null default now()
);
create index sessoes_usuario_idx on public.sessoes(usuario_id, recebida_em desc);

create table public.respostas (
  id bigserial primary key,
  sessao_id uuid not null references public.sessoes(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  questao_id text not null,
  topico_id text not null,
  correta boolean not null,
  tempo_ms integer not null,
  xp integer not null default 0,
  criado_em timestamptz not null
);
create index respostas_usuario_questao_idx on public.respostas(usuario_id, questao_id, criado_em desc);

-- Agregado semanal (fonte dos rankings). A escola fica "congelada" na semana em que o primeiro XP entrou.
create table public.xp_semanal (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  semana date not null,
  escola_id text references public.escolas(id),
  xp integer not null default 0,
  primary key (usuario_id, semana)
);
create index xp_semanal_ranking_idx on public.xp_semanal(semana, xp desc);
create index xp_semanal_escola_idx on public.xp_semanal(semana, escola_id, xp desc);

-- ---------------------------------------------------------------- RLS
alter table public.escolas enable row level security;
alter table public.questoes enable row level security;
alter table public.perfis enable row level security;
alter table public.assinaturas enable row level security;
alter table public.licencas_institucionais enable row level security;
alter table public.sessoes enable row level security;
alter table public.respostas enable row level security;
alter table public.xp_semanal enable row level security;

create policy escolas_leitura on public.escolas for select using (true);
create policy questoes_leitura on public.questoes for select using (true);
create policy perfis_proprio on public.perfis for select using (auth.uid() = id);
create policy assinaturas_propria on public.assinaturas for select using (auth.uid() = usuario_id);
create policy sessoes_proprias on public.sessoes for select using (auth.uid() = usuario_id);
create policy respostas_proprias on public.respostas for select using (auth.uid() = usuario_id);
create policy xp_proprio on public.xp_semanal for select using (auth.uid() = usuario_id);
-- Nenhuma política de insert/update/delete: escrita só pelas funções SECURITY DEFINER abaixo.
