# MedLiga

**Estude medicina jogando. Some pontos para você e para a sua escola.**

Jogo de estudo para estudantes de medicina, com rigor científico, modelos 3D manipuláveis e competição entre alunos e entre escolas. Roda no navegador, instala como app (PWA) no celular e no computador, funciona sem internet e está pronto para empacotar para Android e iOS.

> Ferramenta de estudo. Não substitui aulas, livros-texto nem orientação profissional, e não deve ser usada para decisões clínicas.

## Estado atual — v0.1.0 (em desenvolvimento)

| Área | Situação |
|---|---|
| Módulo 1: **Embriologia geral** (tópicos 1–10) | revisado por agentes em duas etapas (embriologia + obstetrícia/reprodução nos 1–5; embriologia + genética/medicina fetal nos 6–10); conferência médica pendente |
| Embriologia dos sistemas (tópicos 11–20) | revisado por agentes em duas etapas (embriologia + pediatria/anatomia/clínica); conferência médica pendente |
| **Aprofundamento da embriologia**: tópicos 21–25 (regulação molecular do desenvolvimento, crista neural e neurocristopatias, arcos aórticos e sistemas venosos, circulação fetal e transição neonatal, sistema endócrino) e **camada avançada** de 100 questões integradoras (dificuldade 4–5) nos tópicos 1–20, com o modo **Desafio avançado** | revisado por agentes em duas etapas (embriologia + obstetrícia/reprodução, genética/medicina fetal, pediatria/cirurgia/cardiologia, clínica pediátrica/urologia/neurologia, genética clínica, cardiologia pediátrica/neonatologia, endocrinologia pediátrica); conferência médica pendente |
| Módulo 2: **Histologia geral** (tópicos 1–10: métodos, epitélios, conjuntivo, adiposo, cartilagem, osso, sangue, muscular, nervoso) | revisado por agentes em duas etapas (histologia + patologia/clínica; hematologia/neurologia nos tópicos 8–10); conferência médica pendente |
| **Aprofundamento da histologia** (10/11/2026): **histologia dos sistemas**, tópicos 11–20 (circulatório, linfoide, pele, tubo digestivo, glândulas anexas, respiratório, urinário, endócrino, reprodutor masculino, reprodutor feminino e mama), e **camada avançada** de 50 questões de dificuldade 4–5 nos tópicos 1–10. A histologia passa a ter 20 tópicos e 597 questões, 132 delas no **Desafio avançado** | revisado por agentes em duas etapas (histologia + clínica/patologia da área) e conferência de fonte primária no texto integral; nenhum gabarito errado; conferência médica pendente |
| **Microscópio virtual**: 34 lâminas procedurais em HE (16 da histologia geral + 18 dos sistemas: aorta, feixe vasculonervoso, linfonodo, baço, timo, pele fina, esôfago, estômago, cólon, fígado, pâncreas, pulmão, córtex renal, tireoide, adrenal, testículo, ovário, útero proliferativo) com objetivas de 4×, 10× e 40×, mais os jogos **Identifique na lâmina** (o toque numa parte vale quando o alvo é o todo) e **Qual é o tecido?** (sem alternativas que também descrevam o campo) | implementado; textos e desenhos revisados por agente (histologia/patologia), desenhos corrigidos conforme a revisão e reavaliados |
| Laboratório 3D da embriologia: 12 estágios do desenvolvimento (zigoto → placenta) + órgãos e sistemas (coração tubular, alça cardíaca, aparelho faríngeo, septação cardíaca, arcos aórticos, circulação fetal) + jogo **Identifique** | implementado; textos dos 18 modelos revisados por agentes (embriologia + anatomia; os 3 cardiovasculares também por cardiologia pediátrica) |
| **Laboratório 3D da histologia** (10/11/2026): néfron, alvéolo pulmonar, lóbulo hepático, sarcômero (com controle de contração) e junções celulares, sempre com o aviso "esquema fora de escala" e os avisos de interpretação; jogo **Identifique no 3D** da histologia | implementado; textos e desenhos revisados por agentes em duas etapas (histologia + fisiologia/patologia), desenhos corrigidos e reavaliados; conferência médica pendente |
| **Qualidade do 3D** (10/11/2026, todos os 23 modelos): níveis baixa/média/alta escolhidos pelo aparelho, resolução adaptativa (até 3× parada e reduzida durante o giro), ambiente e sombras em todos os modelos, geometria refinada no nível alto (embriões das semanas 4, 6 e 8 inclusive), acabamentos de material (orgânico, úmido, membrana, fibroso), toque correto com o corte ligado | implementado e medido (triângulos, chamadas e programas dentro do orçamento; toque em grade idêntico ao anterior). Tempos de quadro medidos só com renderização por software: **falta teste em celular real** |
| Minijogos: **Plantão relâmpago**, **Linha do tempo**, **Camadas germinativas**, **Duelo** entre colegas (por código), questões de estudo (4 tipos), **conquistas** | implementado (duelo exige servidor online) |
| Revisão espaçada, XP, níveis, sequência de dias, limites do plano gratuito | implementado e testado |
| Cadastro de escolas (441 cursos de medicina) e "minha escola não está na lista" | implementado |
| Rankings: interno da escola, entre escolas (soma dos 20 melhores), geral | implementado; servidor **ainda não ativado** (sem projeto Supabase) |
| Servidor (Supabase): migrações, RLS, XP recalculado no servidor, antifraude | implementado e testado em Postgres local |
| Painel do professor (plano institucional: acerto da turma por tópico, sem dados individuais) | implementado (servidor + tela) |
| Reportar erro em questões; exclusão de conta e de dados do aparelho (LGPD) | implementado |
| Pagamentos e builds nas lojas | planejado (v0.2) |

Evidência do aprofundamento da embriologia (09/11/2026, nesta sessão): 47/47 testes Vitest · TypeScript sem erros · conteúdo validado (35 tópicos, 1026 questões; embriologia com 25 tópicos e 766 questões, 184 de dificuldade 4–5) · testes SQL aprovados · build/PWA gerado · regressão no Chromium 390×844 (tópicos 21–25, Desafio avançado, 3 modelos 3D novos, Identifique) sem erros de página. Relatórios das revisões em `content/revisoes/` (av1–av4, e21-22, e23-24, e25, estagios-3d-cardiovascular).

Evidência da entrega de histologia (09/11/2026, nesta sessão): 43/43 testes Vitest · TypeScript sem erros · conteúdo validado (30 tópicos, 783 questões, 441 escolas) · testes SQL aprovados ("TODOS OS TESTES SQL PASSARAM", Postgres local) · build/PWA gerado · fluxo de histologia conferido no Chromium em 390×844 (início, tópico, questões, plantão, microscópio, os dois jogos e duelos) sem erros de página.

Evidência da atualização 3D (09/11/2026): 39/39 testes Vitest · TypeScript sem erros · conteúdo validado (20 tópicos, 523 questões) · build/PWA gerado. No Windows desta revisão, comandos executados diretamente pelo Node (equivalentes aos scripts npm); suíte completa aprovada fora da restrição de arquivos temporários do ambiente. SQL não mudou; a evidência anterior de 15 cenários permanece histórica, não foi reexecutada nesta entrega.

### Atualização do laboratório 3D

- Vilosidades dirigidas ao compartimento materno, sincício polar em corte e saliências auriculares bilaterais.
- Tronco contínuo nas semanas 4 e 6; orientação cranial/caudal nas semanas 4, 6 e 8.
- Marcadores numerados ligados à lista, seleção por contorno sem mudar cores, ocultação, isolamento e corte de exploração (somente no laboratório).
- Idade, escala e simplificações explícitas; correções focais de teratologia e passagem placentária de anticoagulantes.

Revisões por agentes de embriologia, anatomia, fisiologia e farmacologia/teratologia; conferência médica permanece pendente. [Escopo, testes e limitações da entrega](content/revisoes/correcoes-3d-integracao.md).

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
- **Microscópio virtual** (histologia): lâminas em HE desenhadas por código; troque a objetiva, percorra a lâmina e toque nas células e estruturas. **Identifique na lâmina** pede uma estrutura; **Qual é o tecido?** mostra um campo e pede o tecido ou órgão.
- **Plantão relâmpago**: 90 segundos de questões rápidas com bônus de velocidade e combo; vale para o ranking.
- **Escolas**: cada aluno joga por sua escola; há ranking interno e a escola compete com as outras pela soma dos seus 20 melhores alunos da semana.
- **Selo de revisão** em todo conteúdo: "Revisado por IA · conferência médica pendente" até a conferência de um médico.

## Documentação

- [Arquitetura](docs/arquitetura.md) · [Especificação do conteúdo](docs/conteudo-schema.md) · [Processo de revisão médica](docs/revisao-medica.md)
- [Pesquisa curricular](docs/pesquisa-curricular.md) (ESCS, UnB, UniCEUB, UCB, Unicamp, UFMG, USP, UNIFESP, UFRJ, UFRGS; novas DCN 2025)
- [Plano comercial](docs/negocio.md) · [Roadmap](docs/roadmap.md)

## Licença

Proprietário — todos os direitos reservados. Código, textos, questões e modelos 3D são originais deste projeto.
