-- Testes das funções do servidor. Uso: psql -v ON_ERROR_STOP=1 -f supabase/tests/teste_funcoes.sql
-- Cada bloco levanta exceção se o resultado não for o esperado.
\set QUIET on
insert into auth.users values ('00000000-0000-0000-0000-00000000000a', 'ana@aluno.unb.br'), ('00000000-0000-0000-0000-00000000000b', 'beto@gmail.com'), ('00000000-0000-0000-0000-00000000000c', 'caio@gmail.com');
update escolas set dominios_email = '{aluno.unb.br}' where id = 'unb';
insert into questoes values ('t-q1', 'embriologia', 't', 'multipla', 1), ('t-q2', 'embriologia', 't', 'multipla', 5), ('t-q3', 'embriologia', 't', 'vf', 3) on conflict do nothing;

set role authenticated;

-- 1) perfil + verificação por domínio
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select salvar_perfil('Ana S.', 'unb', 1);
do $$ begin
  if not (select verificado from perfis where id = auth.uid()) then raise exception 'FALHOU: e-mail institucional deveria verificar'; end if;
  if plano_atual() <> 'gratuito' then raise exception 'FALHOU: plano padrão'; end if;
end $$;

-- 2) XP recalculado no servidor: dif 1 (10) + dif 5 com combo 1 (22*1.1=24.2→24) + erro (0) = 34
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000001','modo','estudo','disciplina','embriologia','inicio', (now() - interval '5 minutes')::text,'fim', now()::text,'ranqueada', true),
    jsonb_build_array(
      jsonb_build_object('questao_id','t-q1','topico_id','t','correta',true,'tempo_ms',5000),
      jsonb_build_object('questao_id','t-q2','topico_id','t','correta',true,'tempo_ms',5000),
      jsonb_build_object('questao_id','t-q3','topico_id','t','correta',false,'tempo_ms',5000)));
  if (r->>'xp_contabilizado')::int <> 34 then raise exception 'FALHOU: esperado 34 XP, veio %', r; end if;
end $$;

-- 3) idempotência: reenviar a mesma sessão não soma de novo
do $$
declare r jsonb;
begin
  r := registrar_sessao(jsonb_build_object('id','10000000-0000-0000-0000-000000000001','modo','estudo','inicio', now()::text,'fim', now()::text), '[]'::jsonb);
  if not (r->>'repetida')::boolean then raise exception 'FALHOU: deveria marcar repetida'; end if;
  if (select xp from xp_semanal where usuario_id = auth.uid()) <> 34 then raise exception 'FALHOU: XP semanal duplicado'; end if;
end $$;

-- 4) retorno decrescente: acertar t-q1 de novo em 24 h vale 50% (10*0.5=5); resposta rápida demais vale 0
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000002','modo','estudo','inicio', (now() - interval '2 minutes')::text,'fim', now()::text),
    jsonb_build_array(
      jsonb_build_object('questao_id','t-q1','topico_id','t','correta',true,'tempo_ms',4000),
      jsonb_build_object('questao_id','t-q3','topico_id','t','correta',true,'tempo_ms',200)));
  if (r->>'xp_contabilizado')::int <> 5 then raise exception 'FALHOU: esperado 5, veio %', r; end if;
end $$;

-- 5) plantão: bônus de velocidade (dif 3 = 15; tempo 0 → +50% → 22.5 → 23 (round half away))
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000003','modo','plantao','inicio', (now() - interval '1 minute')::text,'fim', now()::text),
    jsonb_build_array(jsonb_build_object('questao_id','t-q3','topico_id','t','correta',true,'tempo_ms',1000)));
  -- t-q3 ainda não tinha acerto contabilizado? teve (tempo 200, correta=true) → conta como acerto recente → fator 0,5
  -- base 15 * (1 + 0.5*(1-1000/15000)) * 0.5 = 15 * 1.4667 * 0.5 = 11
  if (r->>'xp_contabilizado')::int <> 11 then raise exception 'FALHOU: esperado 11, veio %', r; end if;
end $$;

-- 6) sessão implausível: tempo das respostas maior que a duração
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000004','modo','estudo','inicio', (now() - interval '10 seconds')::text,'fim', now()::text),
    jsonb_build_array(jsonb_build_object('questao_id','t-q2','topico_id','t','correta',true,'tempo_ms',600000)));
  if r->>'recusada' is null then raise exception 'FALHOU: deveria recusar'; end if;
end $$;

-- 7) minijogo: 3 acertos seguidos = 4 + 4.4→4 + 4.8→5 = 13
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000005','modo','camadas','inicio', (now() - interval '1 minute')::text,'fim', now()::text),
    jsonb_build_array(
      jsonb_build_object('questao_id','camadas:retina','topico_id','x','correta',true,'tempo_ms',2000),
      jsonb_build_object('questao_id','camadas:baco','topico_id','x','correta',true,'tempo_ms',2000),
      jsonb_build_object('questao_id','camadas:timo','topico_id','x','correta',true,'tempo_ms',2000)));
  if (r->>'xp_contabilizado')::int <> 13 then raise exception 'FALHOU: esperado 13, veio %', r; end if;
end $$;

-- 8) outros alunos e ranking entre escolas (soma dos 20 melhores)
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select salvar_perfil('Beto', 'escs', 2);
do $$ begin
  if (select verificado from perfis where id = auth.uid()) then raise exception 'FALHOU: gmail não verifica'; end if;
  perform registrar_sessao(
    jsonb_build_object('id','20000000-0000-0000-0000-000000000001','modo','estudo','inicio', (now() - interval '1 minute')::text,'fim', now()::text),
    jsonb_build_array(jsonb_build_object('questao_id','t-q2','topico_id','t','correta',true,'tempo_ms',3000)));
end $$;

-- 9) não é possível escrever direto nas tabelas
do $$ begin
  begin
    insert into xp_semanal values (auth.uid(), current_date, 'escs', 999999);
    raise exception 'FALHOU: insert direto deveria ser negado';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 10) leitura de rankings
do $$
declare n int; topo text;
begin
  select count(*) into n from ranking_alunos(semana_de(now()));
  if n <> 2 then raise exception 'FALHOU: ranking deveria ter 2 alunos, tem %', n; end if;
  select escola_id into topo from ranking_escolas(semana_de(now())) limit 1;
  if topo <> 'unb' then raise exception 'FALHOU: UnB deveria liderar (Ana 63 XP > Beto 22 XP), veio %', topo; end if;
  select count(*) into n from ranking_alunos(semana_de(now()), 'escs');
  if n <> 1 then raise exception 'FALHOU: ranking interno da ESCS deveria ter 1 aluno'; end if;
end $$;

-- 11) usuário sem login não registra sessão
set request.jwt.claim.sub = '';
do $$ begin
  begin
    perform registrar_sessao('{"id":"30000000-0000-0000-0000-000000000001","modo":"estudo","inicio":"2026-01-01","fim":"2026-01-01"}'::jsonb, '[]'::jsonb);
    raise exception 'FALHOU: anônimo registrou sessão';
  exception when raise_exception then
    if sqlerrm like 'FALHOU%' then raise; end if;
  end;
end $$;

-- 12) reporte de erro: idempotente por id local
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select reportar_conteudo('rep-1', 't-q2', 'gabarito', 'alternativa c também é defensável', '0.1.0');
select reportar_conteudo('rep-1', 't-q2', 'gabarito', 'reenvio', '0.1.0');
do $$ begin
  if (select count(*) from reportes_conteudo where usuario_id = auth.uid()) <> 1 then raise exception 'FALHOU: reporte duplicado'; end if;
end $$;

-- 13) LGPD: excluir a própria conta apaga perfil, sessões e XP (ranking)
select excluir_minha_conta();
do $$ begin
  if exists (select 1 from perfis where id = '00000000-0000-0000-0000-00000000000b') then raise exception 'FALHOU: perfil não apagado'; end if;
  if exists (select 1 from ranking_alunos(semana_de(now())) where usuario_id = '00000000-0000-0000-0000-00000000000b') then raise exception 'FALHOU: ainda no ranking'; end if;
end $$;

reset role;
-- (como administrador) o reporte continua na fila, anonimizado
do $$ begin
  if (select count(*) from reportes_conteudo where questao_id = 't-q2' and usuario_id is null) <> 1 then raise exception 'FALHOU: reporte deveria ser mantido anonimizado'; end if;
end $$;
\echo 'TODOS OS TESTES SQL PASSARAM'
