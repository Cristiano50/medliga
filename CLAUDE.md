# MedLiga

Jogo de estudo competitivo para estudantes de medicina (e da saúde). App web/PWA em React + TypeScript + three.js (react-three-fiber), offline-first (IndexedDB/Dexie), servidor Supabase (Postgres + RLS) para contas e rankings, empacotamento Android/iOS com Capacitor. Conteúdo didático em JSON (`content/`), validado por Zod no build.

Comandos: `npm run dev` · `npm test` (vitest) · `npm run typecheck` · `npm run validar-conteudo` · `npm run revisao` (estado da revisão) · `npm run test:sql` (migrações + testes SQL num Postgres local) · `npm run seed` (gera `supabase/seed.sql`) · `npm run build`.

## Regras de trabalho

- Toda entrega: commit e push para `Cristiano50/medliga` (branch `main`), com o estado dos testes na mensagem ou no README.
- **Rigor científico** (pedido permanente do Cristiano, 10/11/2026): todo conteúdo novo é escrito seguindo `docs/conteudo-schema.md` e passa por redação → revisão da área → revisão transversal → conferência de fonte primária no texto integral (método em `docs/protocolo-revisao-agentes.md`; WebFetch não funciona nesta rede, usar curl) antes de ir para o app. Registrar cada revisão em `revisao.agentes`; conteúdo em revisão fica em branch de trabalho, e no `main` só entra o revisado.
- **Só o Cristiano (ou professor indicado por ele) preenche `revisao.humano`.** O agente nunca marca conteúdo como conferido por médico, nem por automação. Conteúdo só revisado por agentes aparece com o selo "Revisado por IA · conferência médica pendente" (decisão do Cristiano, 09/11/2026).
- Não declarar algo como concluído sem evidência verificável (teste, saída de comando, captura de tela); distinguir implementado de proposto.
- Regras de XP existem em dois lugares (`src/core/scoring.ts`/`src/games/minijogo.ts` e `supabase/migrations/0002_funcoes.sql`): mudou um, mude o outro e rode `npm test` e `npm run test:sql`.
- Nunca commitar `.env`, chaves, tokens ou dados de usuários. Segredos só por variável de ambiente.
- Marca comercial num só lugar: `src/config/marca.ts` (+ manifesto em `vite.config.ts` e `capacitor.config.json`). Busca formal no INPI (classes 9, 41, 42) pendente antes de registrar a marca.
- Modelos 3D são procedurais (código próprio, sem assets de terceiros): toda estrutura listada em `content/embriologia/estagios.json` precisa existir no modelo (teste em `tests/conteudo.test.ts`).
