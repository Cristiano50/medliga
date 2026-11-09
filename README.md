# MedLiga

**Estude medicina jogando. Some pontos para você e para a sua escola.**

Jogo de estudo para estudantes de medicina, com rigor científico, modelos 3D manipuláveis e competição entre alunos e entre escolas. Roda no navegador, instala como app (PWA) no celular e no computador, funciona sem internet e está pronto para empacotar para Android e iOS.

> Ferramenta de estudo. Não substitui aulas, livros-texto nem orientação profissional, e não deve ser usada para decisões clínicas.

## Estado atual — v0.1.0 (em desenvolvimento)

| Área | Situação |
|---|---|
| Módulo 1: **Embriologia geral** (tópicos 1–10) | revisado por agentes (embriologia + obstetrícia nos tópicos 1–5; 2ª etapa dos 6–10 em andamento); conferência médica pendente |
| Embriologia dos sistemas (tópicos 11–20) | revisado por agentes em duas etapas (embriologia + pediatria/anatomia/clínica); conferência médica pendente |
| Laboratório 3D: 12 estágios do desenvolvimento (zigoto → placenta) + órgãos e sistemas (coração tubular, alça cardíaca, aparelho faríngeo) + jogo **Identifique** | implementado; textos dos 15 modelos revisados por agentes (embriologia + anatomia) |
| Minijogos: **Plantão relâmpago**, **Linha do tempo**, **Camadas germinativas**, **Duelo** entre colegas (por código), questões de estudo (4 tipos), **conquistas** | implementado (duelo exige servidor online) |
| Revisão espaçada, XP, níveis, sequência de dias, limites do plano gratuito | implementado e testado |
| Cadastro de escolas (441 cursos de medicina) e "minha escola não está na lista" | implementado |
| Rankings: interno da escola, entre escolas (soma dos 20 melhores), geral | implementado; servidor **ainda não ativado** (sem projeto Supabase) |
| Servidor (Supabase): migrações, RLS, XP recalculado no servidor, antifraude | implementado e testado em Postgres local |
| Painel do professor (plano institucional: acerto da turma por tópico, sem dados individuais) | implementado (servidor + tela) |
| Reportar erro em questões; exclusão de conta e de dados do aparelho (LGPD) | implementado |
| Pagamentos e builds nas lojas | planejado (v0.2) |

Evidência (09/11/2026): `npm test` 29/29 · `npm run test:sql` "TODOS OS TESTES SQL PASSARAM" (15 cenários) · `npm run typecheck` sem erros · `npm run validar-conteudo` OK.

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173 — em dev o ranking usa dados fictícios sinalizados
npm test             # testes do núcleo e da coerência conteúdo × 3D
npm run build        # valida o conteúdo, checa tipos e gera dist/ (PWA)
```

Servidor e lojas: ver [docs/arquitetura.md](docs/arquitetura.md) ("Ativar o servidor") e os scripts `npm run android` / `npm run ios` (precisam de Android Studio / Xcode).

## Como o jogo funciona

- **Trilha por tópicos**: resumo, estruturas, correlações clínicas e fontes; questões de múltipla escolha (com casos clínicos), verdadeiro/falso, ordenar e associar, sempre com explicação.
- **Laboratório 3D**: linha do tempo do desenvolvimento; gire, aproxime e toque nas estruturas (zigoto, clivagem, mórula, blastocisto, implantação, disco bilaminar, gastrulação, neurulação em corte, embriões das semanas 4, 6 e 8, placenta e membranas).
- **Identifique**: o jogo pede uma estrutura e você precisa encontrá-la no modelo 3D (3 vidas).
- **Plantão relâmpago**: 90 segundos de questões rápidas com bônus de velocidade e combo; vale para o ranking.
- **Escolas**: cada aluno joga por sua escola; há ranking interno e a escola compete com as outras pela soma dos seus 20 melhores alunos da semana.
- **Selo de revisão** em todo conteúdo: "Revisado por IA · conferência médica pendente" até a conferência de um médico.

## Documentação

- [Arquitetura](docs/arquitetura.md) · [Especificação do conteúdo](docs/conteudo-schema.md) · [Processo de revisão médica](docs/revisao-medica.md)
- [Pesquisa curricular](docs/pesquisa-curricular.md) (ESCS, UnB, UniCEUB, UCB, Unicamp, UFMG, USP, UNIFESP, UFRJ, UFRGS; novas DCN 2025)
- [Plano comercial](docs/negocio.md) · [Roadmap](docs/roadmap.md)

## Licença

Proprietário — todos os direitos reservados. Código, textos, questões e modelos 3D são originais deste projeto.
