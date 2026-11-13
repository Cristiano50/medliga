# Roadmap

Ordem dos módulos baseada no semestre mais comum de cada disciplina nas escolas pesquisadas (`docs/pesquisa-curricular.md`).

## v0.1 — Embriologia (este repositório)
- [x] Núcleo do jogo: XP, níveis, sequência de dias, revisão espaçada, sessões, limites do plano gratuito.
- [x] Embriologia geral (tópicos 1–10) com questões de 4 tipos, resumos, estruturas, correlações clínicas e fontes.
- [x] Embriologia dos sistemas (tópicos 11–20) — lacuna apontada pela pesquisa curricular (está em todas as escolas, do 1º ao 3º semestre).
- [x] Reportar erro nas questões; exclusão de conta/dados (LGPD); painel do professor (agregado, mínimo de 5 alunos).
- [x] Laboratório 3D com 12 estágios (zigoto → placenta) e jogo Identifique.
- [x] Minijogos: linha do tempo, camadas germinativas, plantão relâmpago (90 s).
- [x] Cadastro de escolas (441 cursos) e rankings: interno da escola, entre escolas e geral.
- [x] Servidor Supabase (migrações + testes SQL), sincronização offline.
- [x] Revisão científica por agentes em duas etapas (embriologia + área transversal) nos 20 tópicos, nos 15 modelos 3D e no minijogo de camadas.
- [ ] Conferência médica (Cristiano) — lista em `docs/pendencias-conferencia-medica.md`.
- [x] Duelos entre colegas, conquistas, painel do professor, modelos 3D de órgãos e sistemas.
- [x] Aprofundamento (09/11/2026): tópicos 21–25, camada avançada (100 questões de dificuldade 4–5), modo Desafio avançado e modelos 3D de septação cardíaca, arcos aórticos e circulação fetal; revisão por agentes em duas etapas.

## Revisão dos gráficos (em andamento, 13/11/2026)
Cada etapa: desenho no canvas do Wonder (arquivo "MedLiga — Gráficos") → revisão independente → código → testes.
- [x] **1. Avatares montáveis** com itens liberados por nível e por conquista (perfil, início, ranking, duelo, navegação). Pendente: conferência por pessoas que usam as peças (hijab, turbante, dastar, quipá, tranças, dreads, cabelo crespo, aparelho auditivo, implante coclear, cordão de girassol) e teste com leitor de tela real. Não entraram: barba com cor própria, lenço, filá/kufi, boné, marcas do rosto, tranças rentes; escolha múltipla em "apoio". Decisão do Cristiano em aberto: nomes neutros para os títulos de nível (Calouro, Monitor, Diretor de Liga, Interno, Preceptor, Professor Titular).
- [x] **2. Ícones próprios** no lugar dos emojis: 52 ícones (navegação, jogos, respostas e ações, resultados, conquistas, disciplinas), em `src/ui/icones.ts`, e na biblioteca do arquivo do Wonder. Pendente: revisão independente dos desenhos e teste com leitor de tela real. As conquistas ainda usam ícones do conjunto; as medalhas próprias são a etapa 3.
- [x] **3. Medalhas das conquistas e selos dos títulos de nível** (`src/ui/insignias.ts`): 16 medalhas com o progresso no anel e 8 selos; perfil e início. Pendente: revisão independente dos desenhos, teste com leitor de tela real e a decisão sobre títulos neutros de gênero. Não entrou: aviso na hora em que a medalha é obtida (fica para a etapa 4, com as telas de resultado).
- [x] **4. Telas de resultado e estados vazios** (`src/ui/cenas.ts`): cena em três tons conforme o desempenho, entrada curta que respeita "reduzir movimento", estados vazios com a mesma cena e aviso de medalha nova. Pendente: revisão independente, leitor de tela real e celular real. Não entraram: ilustrações próprias para cada estado vazio (usam o ícone do conjunto) e som.
- [x] **5. Cartões das disciplinas e tela inicial** (`src/ui/cartoes.tsx`): emblema na cor do assunto, cartão em linha, Plantão em destaque, selo "Em foco" e disciplinas futuras em cartões menores. Pendente: revisão independente e celular real. Não entraram: progresso de cada disciplina no cartão (exigiria baixar o conteúdo de todas na tela inicial) e mudanças no cabeçalho "Meta do dia".
- [ ] 6. Marca: só proposta no canvas (o ícone do app não muda sem decisão; busca no INPI pendente).

## v0.2 — Lançamento do piloto
- Ativar Supabase em produção (região São Paulo) e domínio.
- Termos de uso e política de privacidade (LGPD); exclusão de conta na tela de perfil.
- Tela interna para a equipe tratar a fila de reportes.
- Cobrança (lojas + web) e gestão de licenças institucionais.
- Builds Android (Google Play — teste interno) e iOS (TestFlight).
- Completar o cadastro de escolas (≈ 30 cursos faltantes; precisa liberar e-mec.mec.gov.br na rede do ambiente).

## v0.3+ — Novos módulos (cada um com jogabilidade própria)
1. **Histologia** — [x] histologia geral entregue (09/11/2026): microscópio virtual com 16 lâminas, jogos Identifique na lâmina e Qual é o tecido?, 10 tópicos revisados por agentes em duas etapas. [x] Aprofundamento (10/11/2026): histologia dos sistemas (tópicos 11–20), camada avançada (50 questões de dificuldade 4–5), 18 lâminas novas (34 no total) e laboratório 3D da histologia (néfron, alvéolo, lóbulo hepático, sarcômero, junções celulares), tudo com revisão por agentes em duas etapas e conferência de fonte primária; conferência médica pendente. Próximo: órgãos dos sentidos, sistema nervoso central, cavidade oral e dente, placenta e cordão; colorações especiais no microscópio (PAS, tricrômico, prata).
2. **Anatomia** — dissecção 3D por camadas (modelos próprios ou base aberta compatível com uso comercial).
3. **Bioquímica** — montar vias metabólicas, achar a enzima bloqueada.
4. **Genética** — heredogramas e cariótipos interativos (liga com teratologia).
5. **Fisiologia** — simulador de sistemas (alterar variáveis e prever respostas).
6. **Patologia** e **Farmacologia** — mecanismos, alvos, efeitos adversos.
7. **Semiologia** — exame físico interativo (anamnese, ausculta, manobras).
8. **Fisiopatologia** — cascatas causa → mecanismo → manifestação.
9. **Cirurgia** — centro cirúrgico 3D: escolher a técnica, apontar planos e estruturas, antecipar complicações.

Outras: duelos assíncronos entre colegas, torneios intercursos agendados, trilha "PBL" que reagrupa os tópicos com os nomes dos módulos da ESCS/UniCEUB, outros cursos da saúde (enfermagem, odontologia, fisioterapia).
