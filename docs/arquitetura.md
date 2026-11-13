# Arquitetura

## Visão geral

```
┌──────────────── App (um único código) ────────────────┐       ┌──────── Supabase ────────┐
│ React 19 + TypeScript + Vite                           │       │ Auth (código por e-mail) │
│  ├─ telas (src/screens) e minijogos (src/games)        │ HTTPS │ Postgres + RLS           │
│  ├─ módulo 3D (src/modules/embriologia, three.js/R3F)  │◀────▶ │ funções SECURITY DEFINER │
│  ├─ núcleo puro (src/core): XP, revisão, sessões,      │       │  registrar_sessao (XP    │
│  │   planos, ranking — testado com vitest              │       │  recalculado no servidor)│
│  ├─ dados locais (Dexie/IndexedDB) + fila de envio     │       │  ranking_alunos/escolas  │
│  └─ conteúdo JSON empacotado (content/) validado (Zod) │       └──────────────────────────┘
│ Service worker (vite-plugin-pwa): funciona sem internet│
└────────────────────────────────────────────────────────┘
   Web/PWA (desktop e celular) · Android e iOS via Capacitor (mesmo build `dist/`)
```

## Decisões

| Decisão | Por quê |
|---|---|
| **Um só código web** (PWA + Capacitor) | Roda em navegador, desktop (PWA instalada), Android e iOS com o mesmo build; custo de manutenção de uma equipe pequena. |
| **Offline-first** | Todo o conteúdo vai no bundle e no cache do service worker; respostas, XP e revisão espaçada ficam no IndexedDB. A sincronização envia sessões quando há rede (idempotente: o servidor ignora sessão repetida). |
| **XP recalculado no servidor** | O app calcula para mostrar; o servidor recalcula a partir do catálogo de questões (`questoes`) e ignora o XP enviado. Antifraude: tempo mínimo por resposta, coerência da duração, máximo de respostas, teto diário, retorno decrescente para questões repetidas em 24 h. |
| **Escrita só por funções** | RLS em todas as tabelas, sem política de insert/update para o cliente. O ranking é lido por funções que não expõem e-mail. |
| **Ranking da escola = soma dos 20 melhores** | Escola grande não vence só pelo tamanho; cada colega até o 20º ajuda (crescimento orgânico); um aluno sozinho não carrega a escola. Constante `TOP_N_ESCOLA` + SQL. |
| **Temporada semanal** (segunda a domingo, Brasília) | Ritmo de retorno; recomeça para todos. A escola do aluno fica fixa na semana em que ele pontuou pela primeira vez (troca vale na semana seguinte). |
| **Modelos 3D procedurais** | Geometria gerada em código (sem assets de terceiros): sem custo de licença, leve (funciona em celular simples), cada estrutura é um objeto identificável para os jogos. Arte final pode substituir os modelos mantendo os mesmos IDs. |
| **Conteúdo como dado** | `content/<disciplina>/topicos/*.json` com schema único (`docs/conteudo-schema.md`). Novos módulos = novos JSON + jogabilidade própria, sem mudar o núcleo. |
| **Avatar montável, sem foto** | O jogador monta o avatar com peças do próprio jogo (`src/modules/avatar/`): o perfil guarda só os ids das peças, nunca imagem. As peças são formas vetoriais simples numa grade de 200×200, desenhadas por código próprio (sem assets de terceiros) e usadas igualmente pelo app, pelos testes e pelas pranchas do canvas de design. Nada que representa a pessoa (pele, cabelo, cobertura de cabeça, barba, óculos de uso pessoal, aparelho auditivo, implante coclear, cordão de girassol) fica bloqueado; roupas, acessórios, paramentos, fundos e molduras são liberados por título de nível e por conquista. Item de jogo não disputa vaga com item de identidade: a touca cirúrgica vai por cima do hijab e os óculos de proteção por cima dos óculos de grau (categoria `paramento`). O rosto usa o mesmo desenho em todos os tons de pele (par claro em cada traço escuro e modo compacto até 40 px), sem regra por tom. **O desbloqueio é conferido só no aparelho**, porque nível e conquistas não existem no servidor: o servidor valida o formato (`salvar_avatar`, migração `0007`: as 15 categorias de `CATEGORIAS`, com teste que espelha app × SQL) e um cliente adulterado poderia exibir um item ainda bloqueado; é só cosmético e não afeta XP nem ranking. Quem não montou avatar aparece como silhueta neutra com a cor derivada do nome (o app não escolhe pele nem cabelo por ninguém). |

## Pastas

- `content/` — conteúdo didático, escolas, pesquisa curricular.
- `src/core/` — lógica pura (sem React): `scoring.ts`, `srs.ts`, `session.ts`, `planos.ts`, `ranking.ts`.
- `src/data/` — IndexedDB (`db.ts`), estado global (`store.ts`), servidor (`backend.ts`: supabase/demo/offline), sincronização (`sync.ts`).
- `src/modules/embriologia/` — laboratório 3D, jogo Identifique, modelos por estágio (`modelos/`), núcleo de interação 3D (`tres/nucleo.tsx`).
- `src/games/` — questões (4 tipos), linha do tempo, camadas germinativas.
- `src/ui/` — peças comuns da interface: `icones.ts` (ícones próprios, desenhados por código numa grade de 24×24; nenhum vem de biblioteca de terceiros) e `Icone.tsx` (componente: decorativo por padrão, vira imagem com nome quando recebe `rotulo`), além do layout e dos selos. A interface não usa emoji: `tests/icones.test.tsx` falha se algum aparecer em `src/` ou no `index.html`. `insignias.ts` desenha as medalhas das conquistas e os selos dos títulos de nível com as mesmas partes dos ícones (`Insignias.tsx` são os componentes); as chaves de `MEDALHAS` são os ids de `src/core/conquistas.ts` e a ordem de `SELOS` é a de `TITULOS_NIVEL`, e um teste garante que as duas listas continuem iguais. `cenas.ts` e `Cena.tsx` fazem a cena das telas de resultado e dos estados vazios (`humorPorAcertos` decide o tom); o movimento fica em `styles.css` e cada animação só descreve o quadro inicial, de modo que a regra geral de "reduzir movimento" deixa a cena pronta e parada. `cartoes.tsx` tem o emblema e os cartões da tela inicial e das disciplinas (a cor vem de `--cor`, misturada no CSS com `color-mix`). `AvisoMedalhas.tsx` (montado no `Layout`) mostra a medalha obtida com o app aberto: o estado global guarda `medalhasNovas` só na memória, e a primeira conferência depois de abrir o app nunca avisa.
- `src/modules/avatar/` — avatar do jogador: peças (`pecas.ts`), catálogo e regras de desbloqueio (`catalogo.ts`, `regras.ts`), montagem das camadas (`montar.ts`), componente (`Avatar.tsx`) e editor (`EditorAvatar.tsx`, rota `/perfil/avatar`).
- `supabase/migrations/` — esquema, funções e permissões; `supabase/tests/` — testes SQL.
- `scripts/` — validação de conteúdo, seed do servidor, estado da revisão, ícones.

## Modo de servidor

`src/data/backend.ts` escolhe:
- **supabase** quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` existem;
- **demo** só em desenvolvimento ou com `?demo=1` (ranking fictício, sempre sinalizado na tela);
- **offline** nos demais casos (XP guardado no aparelho, entra no ranking quando houver conta).

## Ativar o servidor (passo a passo)

1. Criar projeto no Supabase (região São Paulo, `sa-east-1`, por causa da LGPD e da latência).
2. Aplicar `supabase/migrations/*.sql` em ordem (SQL Editor ou `supabase db push`).
3. `npm run seed` e aplicar `supabase/seed.sql` (escolas + catálogo de questões). Repetir a cada nova versão do conteúdo.
4. Em Authentication: habilitar login por e-mail com código (OTP) e personalizar o e-mail em português.
5. Criar `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (chave pública "anon"; nunca a service role).
6. Opcional: preencher `escolas.dominios_email` para o selo de aluno verificado.

## Testes

- `npm test` — núcleo (XP, revisão espaçada, sessões, planos, ranking, schema) e coerência conteúdo × modelos 3D.
- `npm run test:sql` — aplica as migrações num Postgres local com simulação do `auth` do Supabase e roda os cenários de XP, idempotência, antifraude, permissões, rankings, avatar (formato válido e inválido, ranking e duelo com avatar), reportes, exclusão de conta, painel do professor e duelos.
- `npm run validar-conteudo` — roda antes de todo build; JSON inválido interrompe o build.
