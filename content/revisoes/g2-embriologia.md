# Revisão por agente — Grupo G2, área embriologia

- Agente: `revisor-embriologia-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` em todos os arquivos (5 tópicos, 12 estágios e derivados).
- Escopo: `content/embriologia/topicos/` — emb-06-semana3, emb-07-semanas4a8, emb-08-periodo-fetal, emb-09-placenta-membranas, emb-10-malformacoes — mais `content/embriologia/estagios.json` e `content/embriologia/derivados.json`. Nenhum outro arquivo foi alterado.

## 1. Resumo

| Arquivo | Questões / itens | Críticas | Importantes | Menores | Gabarito redistribuído* | Veredito |
|---|---|---|---|---|---|---|
| emb-06-semana3 | 29 questões | 0 | 0 | 1 | — (já equilibrado) | aprovado-com-correcoes |
| emb-07-semanas4a8 | 29 questões | 0 | 1 | 1 | — (já equilibrado) | aprovado-com-correcoes |
| emb-08-periodo-fetal | 29 questões | 0 | 2 | 7 | 7 questões | aprovado-com-correcoes |
| emb-09-placenta-membranas | 30 questões | 0 | 1 | 6 | 6 questões | aprovado-com-correcoes |
| emb-10-malformacoes | 30 questões | 0 | 1 | 11 | 8 questões | aprovado-com-correcoes |
| estagios.json | 12 estágios | 1 | 0 | 4 | — | 8 aprovado / 4 aprovado-com-correcoes |
| derivados.json | 33 itens | 0 | 0 | 1 | — | aprovado-com-correcoes |
| **Total** | **147 questões + 45 itens** | **1** | **5** | **31** | **21 questões** | |

Gravidades (protocolo): **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável ou explicação incorreta; **menor** = redação, terminologia ou referência.

\* A redistribuição de letras não corrige erro de conteúdo, por isso aparece em coluna própria e está contada entre as menores. Em cada questão troquei os **textos** entre alternativas, atualizei `correta` e reescrevi a `explicacao` com as letras novas. Os ids `a…d` continuam em ordem (teste `alternativas com ids em ordem a, b, c…` passa).

**Um erro de fato (crítica), nos textos do laboratório 3D.** O estágio rotulado "6ª semana" trazia os números da 7ª. Nas 147 questões não encontrei gabarito errado. O resto foi: números não confirmados nas fontes, citações de letra trocadas nas explicações, datas em conflito entre arquivos e, sobretudo, sequências de `eventos` que o jogo de linha do tempo pediria sem ter resposta defensável.

### Distribuição das letras corretas (múltipla escolha)

| Tópico | Antes (a/b/c/d) | Depois (a/b/c/d) | Maior fatia depois |
|---|---|---|---|
| emb-06 (16 MC) | 4/4/4/4 | sem mudança | 25% |
| emb-07 (17 MC) | 5/4/4/4 | sem mudança | 29% |
| emb-08 (15 MC) | **11**/4/0/0 | 4/4/4/3 | 27% |
| emb-09 (17 MC) | **11**/4/2/0 | 5/4/4/4 | 29% |
| emb-10 (16 MC) | **12**/3/1/0 | 4/4/4/4 | 25% |

### Eventos: posições do jogo de linha do tempo

O jogo (`src/games/LinhaDoTempo.tsx`) sorteia **um evento por valor de `ordem`**, então eventos que compartilham `ordem` nunca são cobrados um contra o outro. Usei isso, como manda o protocolo, para os eventos simultâneos ou de ordem controversa — nenhum evento foi removido e nenhum id mudou.

| Tópico | Eventos | Posições distintas antes | Depois |
|---|---|---|---|
| emb-06 | 8 | 8 | 8 (sem mudança) |
| emb-07 | 9 | 9 | 9 (sem mudança) |
| emb-08 | 21 | 21 | 16 |
| emb-09 | 21 | 21 | 13 |
| emb-10 | 16 | 16 | 11 |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade / fonte |
|---|---|---|---|---|---|
| `estagios.json` → `semana-6` | `dias`, `diaReferencia`, `carnegie`, `tamanho` | "≈ 41–44 dias", 42, [17], "≈ 11–14 mm" | "≈ 35–42 dias", 40, [15, 16], "≈ 7–11 mm" | Eram os valores da **7ª semana**: emb-07 atribui o estágio 17 (42–44 dias; 11–14 mm) à 7ª semana, e a 6ª vai até o dia 42. A descrição do próprio estágio (placas das mãos com raios digitais, placas dos pés, pigmento retiniano, saliências auriculares) é a dos estágios 15–16. O aluno lia uma coisa no laboratório 3D e o oposto no tópico. | **crítica** — Moore 11ª ed., cap. 5 (Tab. 5-1), comparado com o resumo de emb-07 |
| `emb-07-q17` + `resumo` + `notasDivergencia` | alternativa correta (a) e resumo | "Ocorre alguns dias mais tarde (**cerca de 4–5 dias, segundo Moore**)…"; resumo: "Os membros inferiores atrasam-se 4–5 dias…" | alternativa sem número ("…cada etapa aparece primeiro nos membros superiores e depois nos inferiores"); resumo idem; divergência registrada | O número está **dentro da alternativa correta** e conflita com as datas de estágio do próprio tópico (brotos superiores dias 26–27, inferiores no fim da 4ª semana ⇒ 1–2 dias). Não confirmei "4–5 dias" em fonte primária; as fontes secundárias consultadas dão 1–2 dias para o aparecimento dos brotos e 2–5 dias para as etapas seguintes. Tirei o número, mantive o fato (gradiente craniocaudal). A alternativa continua sendo a única defensável. | **importante** — emb-07 (Tab. 5-1 de Moore, estágios 12 e 13); divergência em `notasDivergencia` |
| `emb-08-q16` | `explicacao` | "…mas a análise citogenética depende das células **(a)**." | "…depende das células, e não do líquido isoladamente, **como propõe (a)**." | A citação de letra lia-se como se **(a)** fosse a alternativa das células — ou seja, apontava o distrator como correto. Era a única refutação de (a) na explicação. | **importante** — protocolo (explicação cita as letras corretas) |
| `emb-08` — `eventos` | `ordem` | 21 posições distintas | 16 posições; `ordem` compartilhada por: (início do período fetal / produção de urina), (ossificação detectável na US / folículos primordiais), (vérnix e lanugo / percepção dos movimentos / gordura parda), (surfactante / unhas das mãos) | Pares e trios com **faixas de dias idênticas** (p. ex. os três marcos de 17–20 semanas, dias 113–140). O jogo pediria uma ordem que Moore não estabelece. | **importante** — Moore 11ª ed., cap. 6 (marcos por intervalo, não por dia) |
| `emb-09` — `eventos` | `ordem` | 21 posições distintas | 13 posições; `ordem` compartilhada por: (reação decidual / divisão monoamniótica / lacunas), (vilosidades primárias / gêmeos unidos), (vilosidades secundárias / alantoide), (vilosidades terciárias / concha citotrofoblástica / circulação fetal), (cório liso / involução do saco vitelino / obliteração do celoma) | Janelas sobrepostas, inclusive duas com a **mesma faixa** (dias 56–70). Pior ainda: ordenar uma *janela de divisão gemelar* contra um marco do desenvolvimento viloso é arbitrário. | **importante** — Moore 11ª ed., cap. 7; Sadler 14ª ed., cap. 8 |
| `emb-10` — `eventos` | `ordem` | 16 posições distintas | 11 posições; `ordem` compartilhada por: (talidomida / coração / pico de sensibilidade), (neuroporo cranial / membros), (fim da organogênese / radiação no SNC), (tetraciclinas / IECA-BRA) | Janelas teratogênicas com o mesmo dia de início (20, 24, 56 e 84). As duas últimas eram **idênticas** (dias 84–266). | **importante** — Moore 11ª ed., cap. 20 (gráfico de períodos críticos) |
| `emb-08-q05`, `q07`, `q09`, `q11`, `q13`, `q15`, `q17` | `alternativas`, `correta`, `explicacao` | correta = "a" em 11 das 15 questões de múltipla escolha (73%) | q05/q07/q09/q11 → "c"; q13/q15/q17 → "d" (a=4, b=4, c=4, d=3) | Concentração acima dos 40% do protocolo: o aluno aprende a marcar "a". Em q11 as datas voltaram à ordem cronológica depois da troca. | menor — protocolo |
| `emb-09-q04`, `q08`, `q09`, `q11`, `q12`, `q14` | `alternativas`, `correta`, `explicacao` | correta = "a" em 11 das 17 (65%) | q04/q09 → "c"; q08/q11/q12/q14 → "d" (a=5, b=4, c=4, d=4) | idem | menor — protocolo |
| `emb-10-q02`, `q06`, `q07`, `q08`, `q11`, `q12`, `q14`, `q15` | `alternativas`, `correta`, `explicacao` | correta = "a" em 12 das 16 (75%) | q02 → "b"; q06/q11/q14 → "c"; q07/q08/q12/q15 → "d" (4 por letra) | idem | menor — protocolo |
| `emb-10` → `broto-membro-inferior` | `origem` | "Mesoderma somático da parede corporal, no **início da 5ª semana**." | "…no **fim da 4ª semana** (por volta do dia 28)." | Conflitava com emb-07 e com `estagios.json` (`semana-4`: broto inferior ≈ dia 28). | menor — Moore 11ª ed., cap. 5 e 16 |
| `emb-10` → `broto-membro-superior` | `origem` | "…no **final da 4ª semana**." | "…por volta dos **dias 26 a 27** (4ª semana)." | idem (emb-07: dias 26–27, estágio 12). | menor — Moore 11ª ed., cap. 5 |
| `emb-10` → `janela-tetraciclina` | `descricao` | "(segunda metade da gestação)" | "(segundo e terceiro trimestres)" | Incoerente com o próprio `diaMin` 84 do evento (dia 84 pós-fertilização = 14 semanas de IG = 2º trimestre, não a segunda metade da gestação). | menor — coerência interna |
| `emb-07` → `incertezas` | janela da talidomida | "…o valor exato não foi conferido…; por isso não foi usado como número nas questões." | "dias 20 a 36 após a fertilização (34 a 50 após a DUM). A faixa foi conferida na revisão…" | Incerteza **resolvida**: a faixa está em revisões da literatura sobre a embriopatia e é a já adotada em emb-10. | menor — protocolo (resolver incertezas com fonte) |
| `emb-06` → `capa-citotrofoblastica` | `sinonimos` | `[]` | `["concha citotrofoblástica"]` | emb-09 usa "concha citotrofoblástica" para a mesma estrutura; sem o sinônimo o aluno vê dois nomes sem ligação. | menor — terminologia (traduções brasileiras divergem) |
| `estagios.json` → `neurulacao` | `destaques` | "começa a bater por volta do **22º–23º dia**" | "por volta do **21º ao 23º dia**" | Faixa adotada nos tópicos emb-06 e emb-07 (notas de divergência: Moore cap. 4 dias 21–22; cap. 13 dias 22–23). | menor — coerência com os tópicos |
| `estagios.json` → `semana-8` / `palpebras` | `descricao` | "Crescem e **se fundem** por volta do fim do período embrionário; reabrem no período fetal." | "**Começam a se unir** no fim do período embrionário e permanecem fundidas até se reabrirem por volta da **26ª semana** após a fertilização." | emb-08 põe a fusão na 9ª–10ª semana e a reabertura na 26ª; no fim da 8ª semana as pálpebras apenas começam a se unir. | menor — Moore 11ª ed., cap. 5 e 6 |
| `estagios.json` → `placenta-membranas` | `descricao` e estrutura `decidua-capsular` | "a decídua capsular… com o crescimento, **encosta na** decídua parietal" | "…com o crescimento, **degenera**, de modo que o cório liso se funde à decídua parietal"; estrutura passou a dizer que ela se distende e degenera | Dava a entender que a capsular persiste e se funde à parietal. Quem se funde à parietal é o cório liso, depois de a capsular degenerar (emb-09 descreve assim). | menor (2 edições) — Moore 11ª ed., cap. 7 |
| `derivados.json` → `epitelio-bexiga` | `explicacao` | "…deriva do seio urogenital, de origem endodérmica (cloaca)." | acrescentado: o epitélio do **trígono** começa a se formar dos ductos mesonéfricos (mesoderma) e só depois é substituído por epitélio endodérmico | A resposta do minijogo continua **endoderma** (é o que Moore afirma para o epitélio da bexiga), mas o aluno que estudou o trígono precisa da ressalva. | menor — Moore 11ª ed., cap. 12 |

### `derivados.json` — conferência item a item

Os 33 itens foram conferidos um a um contra Moore e Sadler. **Nenhum precisou mudar de categoria, ser trocado ou sair do jogo**; ids de categorias e de itens estão intactos. Dois itens já estavam escritos com o cuidado certo e por isso ficam:

- **`foliculos-tireoide`** diz "**células foliculares** da tireoide" (endoderma) e não "tireoide". Correto: a origem das **células C (parafoliculares)** é controversa (crista neural na descrição clássica, endoderma em trabalhos recentes) e ficaria indefensável no jogo.
- **`melanocitos`** tem a explicação restrita à pele (crista neural). O epitélio pigmentar da retina, que é neuroectoderma, não entra no enunciado.

Mantive **`adeno-hipofise`** em "ectoderma superficial" (bolsa de Rathke, ectoderma do estomodeu), que é o que Moore e Sadler afirmam e o que as provas brasileiras cobram — ver ponto 6 abaixo.

## 3. Evidência

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.

$ npx vitest run
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 28 passed (29)
```

Passam todos os testes que tocam os arquivos deste grupo: `todo estágio tem modelo`, `toda estrutura listada no estágio existe no modelo`, `toda parte do modelo tem nome no estágio`, `estágios em ordem cronológica dentro de cada grupo` e `alternativas com ids em ordem a, b, c…`.

**A falha é anterior a esta revisão e está fora do grupo G2** — ver ponto 10. O teste `todo modelo registrado tem estágio no conteúdo` foi acrescentado a `tests/conteudo.test.ts` (alterado na árvore de trabalho por outra frente, junto com `src/modules/embriologia/modelos/index.ts`, `src/modules/embriologia/modelos/sistemas.tsx` e `src/content/schema.ts`) e cobra estágios para três modelos 3D que ainda não têm estágio. A lista de ids de `estagios.json` é **idêntica** à do HEAD (conferido com `git show HEAD:content/embriologia/estagios.json`): não removi, não renomeei e não acrescentei estágio nenhum.

## 4. Pontos para o revisor humano

1. **Idades e CCN dos estágios de Carnegie 10–23 (emb-07) — a pendência mais importante.** Não dá para conferir a Tabela 5-1 de Moore sem o livro. Os valores do tópico são internamente coerentes e batem com as tabelas que circulam (estágio 22 ≈ 23–28 mm / ~54 dias; estágio 23 ≈ 27–31 mm / ~56,5 dias), mas **o estágio 10 aparece como 1,5–3 mm** e várias tabelas dão 2,0–3,5 mm. Esses números estão em 4 questões (emb-07-q10, q13, q26, q29) e no `semana-4`/`semana-6` do laboratório 3D. Confira direto na Tabela 5-1. Lembre que **O'Rahilly & Müller atribuem idades pós-ovulatórias diferentes**, em geral maiores nos estágios iniciais — a nota já está em `notasDivergencia`, e o estadiamento é morfológico, não cronológico.
2. **Atraso dos membros inferiores (emb-07).** Tirei o "4–5 dias" porque não o confirmei e porque ele conflita com os dias dos estágios 12 e 13 do próprio tópico. Se Moore escrever "4 a 5 dias" para o desenvolvimento (e não para o aparecimento dos brotos), vale repor com essa distinção explícita.
3. **Volumes de líquido amniótico (emb-09): 30 mL em 10 semanas, 350 mL em 20 semanas, 700–1.000 mL em 37 semanas.** São os números de Moore, mas ele não explicita o referencial de idade (o conteúdo adotou idade gestacional, e a conversão nos eventos está coerente). A literatura obstétrica dá curvas diferentes (p. ex. ~400 mL entre 22 e 30 semanas, ~800 mL depois). Vale decidir se mantém os números de Moore ou passa para uma curva obstétrica, e dizer qual.
4. **Zika (emb-10).** As datas dos atos normativos conferem: ESPIN declarada em 11/11/2015 (Portaria GM/MS 1.813) e encerrada pela Portaria 1.682, **de 30/07/2017**; ESPII da OMS de 01/02 a 18/11/2016. Mas o **Ministério anunciou o fim da emergência em 11/05/2017**, cerca de dois meses e meio antes da portaria, e o parecer técnico que fundamentou a decisão é de 23/05/2017. Decida se o conteúdo deve mencionar o anúncio além do ato formal.
5. **Limite de viabilidade (emb-08).** O conteúdo evita de propósito fixar uma idade gestacional única e descreve a sobrevida como progressiva, seguindo Moore. Isso é uma decisão clínica, não embriológica: um neonatologista deveria dizer se o jogo deve citar o limiar praticado no Brasil e com que referência (SBP / Ministério da Saúde).
6. **Adeno-hipófise no minijogo de camadas (`derivados.json`).** Mantida em "ectoderma superficial" (bolsa de Rathke), como em Moore e Sadler. Há literatura recente propondo origem na crista neural anterior / neuroectoderma. Como as categorias do jogo incluem "neuroectoderma", um aluno bem lido pode reclamar. Se preferir, troque o item ou mantenha e aceite que a resposta é a dos livros adotados.
7. **Epitélio do trígono vesical (`derivados.json`).** Acrescentei a ressalva à explicação, mas quem decide se o item continua no jogo é você.
8. **Ácido fólico em alto risco: 4 mg/dia (FEBRASGO) × 5 mg/dia (Ministério da Saúde).** O conteúdo usa a faixa "4 a 5 mg/dia" e registra a divergência. Confirme qual citar para o aluno brasileiro.
9. **Fusão das pregas neurais e fusão do palato.** Já estão em `notasDivergencia`: o "zíper bidirecional a partir da região cervical" é simplificação didática (há descrições de mais de um ponto de início no embrião humano), e a janela da fusão palatina aparece como 7ª–10ª semana no texto e como 6ª–9ª nos gráficos de períodos críticos. Mantive as duas faixas como estão.
10. **Fora do G2, mas bloqueia `npx vitest run`:** três modelos 3D recém-registrados em `src/modules/embriologia/modelos/index.ts` — `coracao-tubular`, `coracao-alca` e `aparelho-faringeo` — **ainda não têm estágio em `estagios.json`**, e o teste novo cobra isso. O campo **`grupo`** (`'desenvolvimento'` / `'sistemas'`) foi acrescentado a `EstagioSchema` com `default('desenvolvimento')`, então os 12 estágios atuais continuam válidos e o teste `estágios em ordem cronológica dentro de cada grupo` passa — mas nenhum estágio declara `grupo` no JSON, e o grupo `'sistemas'` está vazio. Criar esses três estágios é escrever conteúdo novo, com ids e listas de estruturas novas (casadas com `PARTES_CORACAO_TUBULAR`, `PARTES_CORACAO_ALCA` e `PARTES_APARELHO_FARINGEO`), para os tópicos emb-12 (aparelho faríngeo) e emb-13 (cardiovascular) — outro grupo. Não fiz: minhas instruções eram não mudar ids nem listas de estruturas deste arquivo.
11. **Estilo, para o revisor transversal.** Em boa parte das questões de múltipla escolha a alternativa correta é a **mais longa e mais detalhada**. A redistribuição quebrou o padrão de posição ("marque a"), mas não o de comprimento. Equilibrar isso exige reescrever distratores, o que vai além de uma revisão de fatos.
12. **Pequenas aproximações que deixei como estão** (defensáveis nas fontes, mas se quiser uniformizar): a mórula chegando à cavidade uterina "por volta do 3º–4º dia" em `estagios.json` (Moore fala em cerca de 4 dias); e `periodo.diaInicio` 15 em emb-06 convivendo com `diaMin` 14 do evento da linha primitiva (a faixa adotada em `notasDivergencia` é 14–16).
