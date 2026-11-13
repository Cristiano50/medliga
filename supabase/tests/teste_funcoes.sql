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

-- 7b) minijogo de histologia: id com ':' vale como jogada (4 XP)
do $$
declare r jsonb;
begin
  r := registrar_sessao(
    jsonb_build_object('id','10000000-0000-0000-0000-000000000006','modo','microscopio','disciplina','histologia','inicio', (now() - interval '1 minute')::text,'fim', now()::text),
    jsonb_build_array(jsonb_build_object('questao_id','lamina:osso-compacto:osteon','topico_id','his-07-osso','correta',true,'tempo_ms',2000)));
  if (r->>'xp_contabilizado')::int <> 4 then raise exception 'FALHOU: minijogo de histologia, veio %', r; end if;
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

-- 10b) avatar: grava o formato válido, recusa o inválido, e o ranking devolve o avatar (Beto tem, Ana não)
do $$
declare
  v_ok jsonb := '{"v":1,"pele":"p6","rosto":"sorriso","cabelo":"cacheado","corCabelo":"preto","cabeca":"nenhum","corCabeca":"vinho","barba":"nenhuma","oculos":"redondo","apoio":"nenhum","roupa":"jaleco","corRoupa":"azul","acessorio":"estetoscopio","paramento":"nenhum","fundo":"verde-agua","moldura":"monitor"}';
  v_ruim jsonb;
  v_avatar jsonb;
begin
  perform salvar_avatar(v_ok);
  if (select avatar from perfis where id = auth.uid()) <> v_ok then raise exception 'FALHOU: avatar não gravado'; end if;
  foreach v_ruim in array array[
    v_ok || '{"extra":"x"}',                              -- chave desconhecida
    v_ok - 'moldura',                                     -- categoria faltando
    v_ok || '{"v":2}',                                    -- versão desconhecida
    v_ok || '{"pele":"<script>alert(1)</script>"}',       -- valor fora do padrão
    v_ok || '{"pele":"P6"}',                              -- maiúscula
    v_ok || '{"pele":"um-id-comprido-demais-para-o-limite"}', -- mais de 24 caracteres
    v_ok || '{"pele":7}',                                 -- valor que não é texto
    '"texto"'::jsonb, '[1,2,3]'::jsonb                    -- não é objeto
  ] loop
    begin
      perform salvar_avatar(v_ruim);
      raise exception 'FALHOU: aceitou avatar inválido: %', v_ruim;
    exception when raise_exception then
      if sqlerrm like 'FALHOU%' then raise; end if;
    end;
  end loop;
  if (select avatar from perfis where id = auth.uid()) <> v_ok then raise exception 'FALHOU: avatar mudou depois de envio inválido'; end if;
  begin
    update perfis set avatar = '{"v":1}' where id = auth.uid();
    raise exception 'FALHOU: update direto do avatar deveria ser negado';
  exception when insufficient_privilege then null;
  end;
  select avatar into v_avatar from ranking_alunos(semana_de(now())) where usuario_id = auth.uid();
  if v_avatar <> v_ok then raise exception 'FALHOU: ranking deveria devolver o avatar de Beto, veio %', v_avatar; end if;
  if (select avatar from ranking_alunos(semana_de(now())) where usuario_id = '00000000-0000-0000-0000-00000000000a') is not null then
    raise exception 'FALHOU: Ana não montou avatar';
  end if;
  -- remover o avatar e gravar de novo
  perform salvar_avatar(null);
  if (select avatar from perfis where id = auth.uid()) is not null then raise exception 'FALHOU: avatar não removido'; end if;
  perform salvar_avatar(v_ok);
end $$;
-- visitante sem login vê o ranking (com avatar), mas não grava avatar
set role anon;
set request.jwt.claim.sub = '';
do $$ begin
  if (select count(*) from ranking_alunos(semana_de(now())) where avatar is not null) <> 1 then raise exception 'FALHOU: ranking público deveria trazer 1 avatar'; end if;
  begin
    perform salvar_avatar('{"v":1}'::jsonb);
    raise exception 'FALHOU: anônimo gravou avatar';
  exception when insufficient_privilege then null;
  end;
end $$;
set role authenticated;

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

-- 13) LGPD: excluir a própria conta apaga perfil (com o avatar), sessões e XP (ranking)
select excluir_minha_conta();
do $$ begin
  if exists (select 1 from perfis where id = '00000000-0000-0000-0000-00000000000b') then raise exception 'FALHOU: perfil não apagado'; end if;
  if exists (select 1 from ranking_alunos(semana_de(now())) where usuario_id = '00000000-0000-0000-0000-00000000000b') then raise exception 'FALHOU: ainda no ranking'; end if;
end $$;

-- 14) painel do professor: sem vínculo, sem acesso; com vínculo e licença, só agregados com ≥ 5 alunos
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$ begin
  begin
    perform * from painel_escola('unb');
    raise exception 'FALHOU: painel sem vínculo';
  exception when raise_exception then
    if sqlerrm like 'FALHOU%' then raise; end if;
  end;
end $$;

reset role;
-- (como administrador) o reporte continua na fila, anonimizado
do $$ begin
  if (select count(*) from reportes_conteudo where questao_id = 't-q2' and usuario_id is null) <> 1 then raise exception 'FALHOU: reporte deveria ser mantido anonimizado'; end if;
end $$;
-- (administrador) concede professor da UnB e licença; com 1 aluno só, o painel não mostra nada (mínimo de 5)
insert into professores values ('00000000-0000-0000-0000-00000000000c', 'unb');
insert into licencas_institucionais (escola_id, valido_ate) values ('unb', current_date + 30);
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$ begin
  if (select count(*) from minhas_escolas_professor() where licenca_ativa) <> 1 then raise exception 'FALHOU: professor/licença'; end if;
  if (select count(*) from painel_escola('unb')) <> 0 then raise exception 'FALHOU: painel deveria ocultar recorte com < 5 alunos'; end if;
end $$;

-- 15) duelo: C cria, A entra; resultado do adversário só aparece depois de jogar; vencedor por acertos
create temporary table t_duelo (codigo text);
grant all on t_duelo to authenticated;
do $$ begin
  insert into t_duelo select criar_duelo('embriologia', array['t-q1','t-q2','t-q3','t-q1','t-q2']);
  if (select codigo from t_duelo) !~ '^[A-Z2-9]{6}$' then raise exception 'FALHOU: código do duelo'; end if;
  begin
    perform criar_duelo('embriologia', array['nao-existe','t-q1','t-q2','t-q3','t-q1']);
    raise exception 'FALHOU: aceitou questão fora do catálogo';
  exception when raise_exception then
    if sqlerrm like 'FALHOU%' then raise; end if;
  end;
  perform registrar_resultado_duelo((select codigo from t_duelo), 4, 5, 20000);
  -- C tem perfil e avatar: o adversário deve receber os dois
  perform salvar_perfil('Caio', null, 3);
  perform salvar_avatar('{"v":1,"pele":"p2","rosto":"serio","cabelo":"curto","corCabelo":"castanho","cabeca":"quipa","corCabeca":"marinho","barba":"barba-curta","oculos":"nenhum","apoio":"aparelho-auditivo","roupa":"camiseta","corRoupa":"coral","acessorio":"nenhum","paramento":"nenhum","fundo":"azul","moldura":"nenhuma"}');
end $$;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$
declare r jsonb;
begin
  r := entrar_duelo((select codigo from t_duelo));
  if (r->>'sou_criador')::boolean then raise exception 'FALHOU: A não é criador'; end if;
  if r->>'adversario' <> 'Caio' or r->'adversario_avatar'->>'barba' <> 'barba-curta' then raise exception 'FALHOU: duelo deveria trazer nome e avatar do adversário: %', r; end if;
  if r->'resultado_adversario' <> 'null'::jsonb then raise exception 'FALHOU: resultado do adversário vazou antes de jogar: %', r; end if;
  if jsonb_array_length(r->'questoes') <> 5 then raise exception 'FALHOU: questões do duelo'; end if;
  begin
    perform registrar_resultado_duelo((select codigo from t_duelo), 5, 5, 100); -- tempo implausível
    raise exception 'FALHOU: aceitou tempo implausível';
  exception when raise_exception then
    if sqlerrm like 'FALHOU%' then raise; end if;
  end;
  r := registrar_resultado_duelo((select codigo from t_duelo), 5, 5, 15000);
  if (r->'resultado_adversario'->>'acertos')::int <> 4 then raise exception 'FALHOU: depois de jogar deveria ver o resultado do adversário: %', r; end if;
end $$;
-- terceiro usuário não entra em duelo cheio
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
reset role;
insert into auth.users values ('00000000-0000-0000-0000-00000000000d', 'davi@gmail.com');
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
do $$ begin
  begin
    perform entrar_duelo((select codigo from t_duelo));
    raise exception 'FALHOU: terceiro entrou no duelo';
  exception when raise_exception then
    if sqlerrm like 'FALHOU%' then raise; end if;
  end;
end $$;
reset role;
\echo 'TODOS OS TESTES SQL PASSARAM'
