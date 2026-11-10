# Revisão por agentes: microscópio virtual, grupo A dos sistemas (laminas-sistemas-a.json + desenhos), etapas histologia e patologia

- Agentes: `revisor-laminas-v2` (1ª etapa, histologia) e `revisor-laminas-patologia-v2` (2ª etapa, patologia, com conferência de fonte primária) · Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (rigor de cada afirmação, terminologia dos tópicos, mudanças mínimas, sem mudar ids, registro em `revisao.agentes`, relatório; fontes lidas por curl nas APIs do PubMed/Europe PMC). Padrão de exigência e escala P1/P2/P3 iguais aos de `content/revisoes/laminas-histologia.md`.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nas 6 lâminas.
- Escopo:
  - **Textos** (editados): `content/histologia/laminas-sistemas-a.json`, lâminas `aorta`, `feixe-neurovascular`, `linfonodo`, `baco`, `timo`, `pele-fina`: título, tecido, órgão, coloração, descrição, destaques e descrição de cada estrutura, conferidos contra Junqueira 14ª ed., Ross 8ª ed. e os tópicos his-11, his-12 e his-13.
  - **Desenhos** (só avaliados, **nenhum código alterado**): `src/modules/histologia/laminas/sistemas-a.tsx`, pelas capturas do app (`app/prancha-app.png`, `app/h-<id>.png`, `app/h40-<id>.png`), renderizações completas (`full-<id>.png`), recortes de 10× e 40× (`c-<id>-*.png`), cantos das áreas de sorteio (`c-<id>-jogo-*.png`) e `toque.txt`, todos em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/lam-a/`. Para o jogo "Qual é o tecido?", medi a composição de cada campo de 10× sorteável (ver §7).
- Não mudaram: ids das lâminas, `ordem`, `titulo`, `orgao`, `topicos`, ids, nomes e ordem das `estruturas`. Conferido por script contra a versão anterior à revisão (`git show dd4be4e:content/histologia/laminas-sistemas-a.json`; durante a revisão outra sessão fez commits de retrato que já incluem parte destas edições): 21 campos de texto alterados; `revisao.humano` = `null` e 2 entradas novas em `revisao.agentes` em cada lâmina; os 27 valores de `tecido` de todos os arquivos `laminas*.json` continuam distintos.

## 1. Resumo

Gravidades: **crítica** = fato errado; **importante** = afirmação imprecisa que o aluno levaria como fato, contradição com tópico ou com o desenho, ou resposta do jogo que não corresponde ao campo; **menor** = redação, terminologia, precisão.

| Lâmina | Histologia (crít./imp./men.) | Patologia (crít./imp./men.) | Veredito histologia | Veredito patologia | Desenho |
|---|---|---|---|---|---|
| aorta | 0 / 0 / 3 | 0 / 0 / 0 | aprovado-com-correcoes | aprovado | ok (P2-4 toque; P3-1) |
| feixe-neurovascular | 0 / 1 / 1 | 0 / 0 / 0 | aprovado-com-correcoes | aprovado | ok (P2-3 área do jogo; P3-2) |
| linfonodo | 0 / 0 / 1 | 0 / 0 / 2 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3-3) |
| baco | 0 / 0 / 2 | 0 / 1 / 0 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3-4) |
| timo | 0 / 1 / 0 | 0 / 1 / 1 | aprovado-com-correcoes | aprovado-com-correcoes | **ajustar (P2-1, P2-2)** |
| pele-fina | 0 / 0 / 5 | 0 / 1 / 0 | aprovado-com-correcoes | aprovado-com-correcoes | **ajustar (P1-1, área do jogo)**; P3-6 |
| **Total** | **0 / 2 / 12** | **0 / 3 / 3** | | | 4 ok · 2 ajustar |

São **20 correções** (nenhuma crítica, 5 importantes, 15 menores) em 21 campos.

**As cinco importantes:**
1. **feixe-neurovascular, `tecido`**: "Artéria muscular e veia (feixe vasculonervoso)" → "Artéria muscular (feixe vasculonervoso)". A artéria aparece em 100% dos campos sorteados no jogo, e a veia em só 34%. Em dois de cada três sorteios a resposta citava uma veia que não está no campo.
2. **timo, `destaques[1]`**: seleção negativa "na medula" → "começa no córtex e se completa na medula" (contradizia his-12).
3. **timo, `descricao` e estrutura `macrofago`**: "céu estrelado" como aspecto do córtex normal. Na patologia, esse padrão é sinal do linfoma de Burkitt e de parte dos linfomas linfoblásticos T, e o timo pediátrico normal não o mostra (Pina-Oviedo 2023, §6). É o mesmo tipo de problema do "olho de coruja" retirado na revisão anterior. O termo saiu da descrição do córtex normal e ficou explicado, com o sentido da patologia, na estrutura macrófago.
4. **baco, `destaques[2]`**: a frase punha a anemia falciforme como causa de esplenomegalia. Na doença falciforme, os infartos repetidos levam a fibrose e atrofia do baço (autoesplenectomia). A esferocitose ficou como exemplo de esplenomegalia.
5. **pele-fina, `destaques[2]`**: a reepitelização a partir dos anexos é a das queimaduras **de espessura parcial (2º grau)**, que poupam parte da derme, e não das "superficiais" (his-13).

**Jogo "Qual é o tecido?"**: o problema mais sério do grupo **não é de texto**. Na `pele-fina`, o campo sorteado mostra a epiderme em 41% das rodadas. Nessas rodadas, "Epitélio estratificado pavimentoso queratinizado", que é a resposta da `pele-espessa` e pode aparecer como distrator, também é defensável. Esse ajuste é de código (P1-1, uma linha). Em `timo`, cerca de 1 campo em 4 sai sem corpúsculo de Hassall (P2-1).

### Conferido e correto (sem mudança)

- **Aorta.** Média mais espessa, com lâminas elásticas fenestradas e músculo liso entre elas. A média não tem fibroblastos: as células musculares lisas produzem elastina, colágeno e substância fundamental. A íntima é relativamente espessa, espessa-se com a idade e é a sede do ateroma. A lâmina elástica interna se confunde com a primeira lâmina da média. A adventícia é mais fina que a média. Os vasa vasorum ficam na adventícia e na parte externa da média, e a parte interna é nutrida por difusão (his-11 e PMC12731113). A fenestra permite a difusão. Lâminas onduladas pela retração.
- **Feixe.** Artéria × veia: luz redonda e parede espessa × luz ampla e irregular e parede fina. A lâmina elástica interna é ondulada pela contração pós-morte e, no HE, vítrea e eosinófila. A média da artéria muscular tem até cerca de 40 camadas (Junqueira). Na veia, a adventícia costuma ser a túnica mais espessa, e as valvas são pregas da íntima. A lâmina elástica externa é mais fina e descontínua. Nervo com perineuro e mielina extraída.
- **Linfonodo.** Caminho da linfa (seios peritrabeculares = sinônimo de "seios trabeculares" em his-12). Zona B × zona T. Polaridade do centro germinativo: zona escura profunda e zona clara voltada para a cápsula, com manto mais espesso do lado da cápsula. Vênulas de endotélio alto no paracórtex. Cordões medulares com plasmócitos. Cápsula espessada no hilo.
- **Baço.** Filtra sangue e não tem seios linfáticos nem córtex e medula. Bainha periarteriolar com linfócitos T e nódulos com linfócitos B, com a arteríola central excêntrica no nódulo. Zona marginal. Cordões de Billroth e sinusoides com fendas e lâmina basal descontínua. A veia trabecular não tem parede muscular própria. Cápsula com mesotélio.
- **Timo.** Órgão linfoide primário, lóbulos incompletos, medula contínua entre lóbulos. Corpúsculos de Hassall exclusivos da medula do timo; função ligada a linfócitos T reguladores (his-12: TSLP). Arcabouço de células epiteliais reticulares, sem fibras reticulares no parênquima. Barreira hematotímica só no córtex. Involução adiposa no adulto.
- **Pele fina.** Epiderme delgada sem estrato lúcido; derme papilar frouxa e reticular densa não modelada. No couro cabeludo, os bulbos chegam à hipoderme. Bainhas do folículo na ordem certa; a bainha radicular interna é eosinófila, com tri-hialina. Matriz e papila dérmica. Sebácea holócrina, com núcleos picnóticos perto do ducto. O eretor é músculo liso com inervação simpática e se insere abaixo da sebácea, do lado do ângulo obtuso. A protuberância tem células-tronco. Écrina: porção secretora com mioepiteliais e ducto de duas camadas, mais escuro, com borda eosinófila. A haste castanha é pigmento natural (melanina).

## 2. Tabela de correções de texto

### Importantes (5)

| lâmina | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| feixe-neurovascular | `tecido` | "Artéria muscular e veia (feixe vasculonervoso)" | "Artéria muscular (feixe vasculonervoso)" | Medido nos 121 campos sorteáveis (§7): artéria em 100% (≥ 28,6% do campo), veia em 34%. Em 2/3 das rodadas a resposta citava uma veia ausente. Continua distinta de "Artéria elástica (aorta)" e de todas as outras 26 respostas. | `areaDiagnostica` [270,260,450,380] em `sistemas-a.tsx`; `QualTecido.tsx` |
| timo | `destaques[1]` | "…na medula, a seleção negativa contra antígenos próprios." | "…a seleção negativa contra antígenos próprios começa no córtex e se completa na medula." | his-12 diz "seleção negativa no córtex e na medula" (pontos-chave e estrutura `medula-timica`). | his-12; Ross 8ª ed., Sistema linfático (timo) |
| timo | `descricao`; estrutura `macrofago` | córtex "com macrófagos claros espalhados (aspecto de 'céu estrelado')"; macrófago: "…dão o aspecto de 'céu estrelado'" | córtex "com macrófagos claros esparsos, que fagocitam timócitos mortos"; macrófago: "no timo normal fica esparsa no córtex escuro. Na patologia, muitos macrófagos com corpos apoptóticos entre células monótonas formam o padrão de 'céu estrelado', típico do linfoma de Burkitt e presente em parte dos linfomas linfoblásticos T." | Na biópsia de mediastino, o "céu estrelado" é critério que separa o linfoma linfoblástico T do timo normal. Ensiná-lo como aspecto normal do córtex induz o erro inverso. | PMID 38090035 (PMC10713242); PMID 41749833 (PMC12938643); PMID 42740338 (PMC13586492) |
| baco | `destaques[2]` | "…(esferocitose hereditária, anemia falciforme) ficam retidas e são destruídas, o que contribui para a esplenomegalia nas anemias hemolíticas." | "…ficam retidas e são destruídas. Na esferocitose, isso contribui para a esplenomegalia; na anemia falciforme, os infartos repetidos levam a fibrose e atrofia progressivas do baço (autoesplenectomia)." | O aluno levaria "anemia falciforme → esplenomegalia", e a prova cobra a autoesplenectomia e a asplenia funcional (his-12 a cita). | PMID 39568431 (PMC11873697); PMID 41665679 (PMC13388681); his-12 (asplenia funcional na doença falciforme) |
| pele-fina | `destaques[2]` | "…ajudam a reepitelizar a pele após escoriações e queimaduras superficiais." | "…após escoriações e queimaduras de espessura parcial (2º grau), que poupam parte da derme." | A queimadura superficial (1º grau) só atinge a epiderme e se renova pela camada basal. A reepitelização a partir dos anexos é a das queimaduras de espessura parcial. | his-13 ("Nas queimaduras que poupam parte da derme, as células dos folículos e das glândulas reepitelizam a ferida") |

### Menores (15)

| lâmina | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| aorta | `coloracao`; `descricao` | realce "como apareceriam com orceína ou Verhoeff" | "…com orceína ou resorcina-fucsina" | Verhoeff cora as fibras elásticas de preto; o realce do esquema é roxo-escuro. his-11 cita orceína e resorcina-fucsina. | his-11 (`fibras-elasticas`); Junqueira 14ª ed., Tecido conjuntivo |
| aorta | `descricao`; estrutura `fibras-elasticas` | no HE, lâminas "claras e refringentes, pouco contrastadas" | "eosinófilas, vítreas e refringentes, pouco contrastadas com o músculo liso" | Contradizia a lâmina vizinha (feixe: lâmina elástica interna "vítrea e eosinófila") e o tópico ("pouco visíveis no HE"). | his-11; Ross 8ª ed., Sistema cardiovascular |
| aorta | `descricao` | "a aorta humana adulta tem cerca de 40 a 70" | "a aorta torácica humana adulta tem cerca de 40 a 70 (o número varia com a idade e é cerca de metade na aorta abdominal)" | O número depende do segmento e da idade. | PMC12593762 (§6); Junqueira 14ª ed. (ver §5, item 4) |
| feixe-neurovascular | estruturas `lamina-elastica-interna`; `tunica-intima` | "Lâmina … entre a íntima e a média… É o marco que identifica a artéria muscular." | "…componente mais externo da íntima, que a separa da média… Nítida e ondulada, é o marco que distingue a artéria muscular da veia que a acompanha (na veia não é nítida)."; íntima: "+ a lâmina elástica interna é o limite externo da íntima" | Alinhado a his-11, que a define como parte da íntima. Arteríolas e artérias elásticas também têm lâmina elástica interna, então ela não identifica sozinha a artéria muscular. | his-11 (`lamina-elastica-interna`, `tunica-intima`) |
| linfonodo | estrutura `centro-germinativo` | "linfócitos B grandes em proliferação (zona escura) e em seleção (zona clara)" | "centroblastos, linfócitos B grandes em proliferação (zona escura…), e centrócitos, menores, em seleção (zona clara…)" | Os centrócitos não são "grandes". Termos de his-12. | his-12 (`centro-germinativo`) |
| linfonodo | `destaques[1]` | "…fica pobre em linfócitos na aplasia tímica (síndrome de DiGeorge)" | "…na hipoplasia ou aplasia do timo (síndrome de DiGeorge, deleção 22q11.2)" | Na tríade clássica, o déficit T vem da **hipoplasia** tímica; a aplasia (atimia congênita) é a minoria. | PMID 36648576 (PMC9892161); his-12 |
| linfonodo | `destaques[2]` | "…o timo tem corpúsculos de Hassall e não tem folículos" | "…e, quando normal, não tem folículos" | Folículos aparecem na hiperplasia folicular tímica. | PMID 41514597 (PMC12784861) |
| baco | `descricao` | "Esquema: proporções simplificadas, células aumentadas e menos polpa branca que num corte real." | "Esquema: proporções simplificadas e células aumentadas em relação ao órgão." | Afirmação sem base: no esquema, a polpa branca, o centro germinativo e a arteríola somam 10,3% da área e, com a zona marginal, 17,3% (`toque.txt`). Não há como sustentar "menos que no real". | `toque.txt` |
| baco | estrutura `centro-germinativo` | "linfócitos B grandes em proliferação e seleção" | "centroblastos (linfócitos B grandes em proliferação), centrócitos (menores, em seleção)" | Igual ao linfonodo. | his-12 |
| timo | `descricao` | "Não há folículos linfoides nem seios." | "No timo normal não há seios nem folículos linfoides; folículos com centros germinativos na medula indicam hiperplasia folicular tímica, associada sobretudo à miastenia grave de início precoce." | Ponte com a patologia, já presente em his-12 (correlação timoma/miastenia). | PMID 41514597 (PMC12784861); PMID 40666538; his-12 |
| pele-fina | `descricao` | sebácea "fica no ângulo obtuso entre o folículo e o músculo eretor" | "fica entre o folículo e o músculo eretor do pelo, do lado em que o folículo forma ângulo obtuso com a superfície" | O ângulo obtuso é o do folículo com a superfície, não o do folículo com o músculo. Do jeito antigo, a frase ensinava geometria errada. | his-13 (`musculo-eretor-do-pelo`); Ross 8ª ed., Sistema tegumentar |
| pele-fina | `destaques[0]` | "…sem estrato lúcido e com anexos (folículos pilosos, glândulas sebáceas)…" | "…com folículos pilosos e glândulas sebáceas; … (as sudoríparas écrinas existem nas duas e são mais numerosas na espessa)" | "Com anexos" sugeria que a pele espessa não tem anexos; ela tem muitas écrinas. | his-13 |
| pele-fina | estrutura `foliculo-piloso` | bainha radicular interna "desaparece na altura do istmo" | "desfaz-se no istmo, logo abaixo da desembocadura da glândula sebácea" | Alinhado a his-13 ("se desfazem na altura da desembocadura da glândula sebácea") sem perder o termo istmo. Coerente com o desenho (a bainha interna começa logo abaixo do ducto sebáceo). | his-13 (`bainha-radicular-interna`) |
| pele-fina | estrutura `derme` | reticular "onde ficam os anexos" | "onde fica a maior parte dos anexos" | A própria lâmina diz que, no couro cabeludo, os bulbos chegam à hipoderme. | — |
| pele-fina | estrutura `glandula-sudoripara-ecrina` | "com células cúbicas claras e células mioepiteliais" | "com células claras e escuras (estas mais perto da luz) e células mioepiteliais" | his-13 cita células claras, escuras e mioepiteliais. | his-13; Ross 8ª ed., Sistema tegumentar |

## 3. Resposta do jogo "Qual é o tecido?" (campo `tecido`)

O jogo mostra um campo de 10× (círculo de 300 un) centrado num ponto sorteado em `areaDiagnostica`. Os distratores só são excluídos quando o texto de `tecido` é **idêntico** (`QualTecido.tsx`, `LAMINAS.filter((x) => x.tecido !== l.tecido)`). Medi a composição dos 121 campos de uma grade 11 × 11 sobre cada área (método em §7):

| lâmina | resposta | o que o campo garante (mín. do campo, % dos campos) | risco |
|---|---|---|---|
| aorta | Artéria elástica (aorta) | lâminas elásticas ≥ 22% em 100%; média+lâminas ≥ 69% | "Tecido muscular liso" como distrator é parcialmente defensável (P2-3, geral) |
| feixe-neurovascular | **Artéria muscular (feixe vasculonervoso)** (corrigida) | artéria ≥ 28,6% em 100%; veia em 34%; conjuntivo frouxo sem rótulo até 61% | com "Tecido conjuntivo frouxo" ou "Tecido muscular liso" como distrator, parte do campo é de fato esses tecidos (P2-3) |
| linfonodo | Linfonodo | seio subcapsular ≥ 3,5% e folículo/centro germinativo ≥ 16,5% em 100% | nenhum |
| baco | Baço | polpa branca ≥ 7,8% e polpa vermelha ≥ 18% em 100%; arteríola central em 96% | nenhum |
| timo | Timo | córtex ≥ 47% e medula ≥ 9% em 100%; **Hassall em 77%** (mín. 0%) | sem Hassall, córtex escuro e medula clara ainda indicam timo, mas o critério exclusivo falta (P2-1) |
| pele-fina | Pele fina (com pelos) | folículo ≥ 15%, sebácea ≥ 7,9% e eretor ≥ 5,2% em 100%; **epiderme em 41%** (até 10%) | **"Epitélio estratificado pavimentoso queratinizado" (resposta da pele-espessa) fica defensável** (P1-1) |

As 27 respostas continuam distintas. A da `pele-fina` não pode ser resolvida só no texto do grupo A: a epiderme dela **é** epitélio estratificado pavimentoso queratinizado. As saídas estão em P1-1 e em §5.

## 4. Desenhos: avaliação por lâmina

Critério: o esquema precisa mostrar os **aspectos diagnósticos** que o texto e os tópicos cobram, sem induzir erro. Não se exige fotorrealismo nem escala exata. As coordenadas são do SVG (1000 × 700). Os ajustes são **propostos**; nenhum código foi alterado. A escala foi conferida pela hemácia (≈ 6,4–6,8 un ≈ 7,5 µm, ou seja, 1 un ≈ 1,1–1,2 µm).

| Lâmina | Aspectos diagnósticos conferidos | Veredito |
|---|---|---|
| aorta | Parede côncava para a luz; endotélio com núcleos salientes; íntima 48 un × média 412 un (≈ 1:8,6); 23 lâminas onduladas com fenestras e núcleos musculares alongados paralelos a elas, sem fibroblastos; adventícia mais fina que a média, com colágeno, fibras elásticas e fibroblastos; vasa vasorum (arteríolas, vênulas, capilares) na adventícia e no terço externo da média. Realce das lâminas declarado. | **ok** (P2-4 de toque; P3-1) |
| feixe-neurovascular | Artéria com luz redonda (≈ 176 µm), lâmina elástica interna pregueada (26 ondas), média com 8 camadas circunferenciais, lâmina elástica externa tracejada, adventícia com vasa vasorum; veia com luz ampla, sangue sedimentado, média fina e adventícia mais espessa que a média; nervo com perineuro, fibras sem sobreposição, axônio central, mielina extraída e núcleos de Schwann em crescente; adipócitos uniloculares. Proporções plausíveis. | **ok** (P2-3; P3-2) |
| linfonodo | Cápsula, aferentes com valva na convexidade, seio subcapsular com revestimento e fibras reticulares; folículos primários escuros e secundários com centro germinativo **polarizado corretamente** (zona escura profunda, clara para a cápsula, manto mais espesso do lado da cápsula), macrófagos de corpos tingíveis; trabéculas com seio peritrabecular; paracórtex com vênulas de endotélio alto (endotélio cúbico, linfócitos na parede); medula com cordões anastomosados (linfócitos, plasmócitos) e seios com macrófagos; hilo com artéria, veia e eferente; gordura. | **ok** (P3-3) |
| baco | Cápsula com mesotélio; trabécula longitudinal e transversal com veia trabecular sem parede própria; nódulo com centro germinativo e **arteríola excêntrica**; bainha periarteriolar em corte transversal (arteríola central) e longitudinal (músculo circular visto de perfil: núcleos curtos transversais ao eixo); zona marginal clara com linfócitos médios e macrófagos; cordões cheios de hemácias, macrófagos e plasmócitos; sinusoides com núcleos endoteliais salientes. | **ok** (P3-4) |
| timo | Lóbulos com córtex escuro de timócitos e medula clara; septo incompleto com medula contínua (no alto, ao centro, como diz o texto); corpúsculos de Hassall em camadas concêntricas com centro eosinófilo, só na medula; células epiteliais reticulares de núcleo grande e claro com nucléolo; vasos nos septos e na junção corticomedular. **Macrófagos numerosos no córtex (padrão de "céu estrelado")**; área do jogo sem Hassall em 23% dos campos. | **ajustar (P2-1, P2-2)** |
| pele-fina | Epiderme delgada (≈ 70 µm): basal cilíndrica, espinhosas, granulosa com querato-hialina, córnea fina, **sem lúcido**; junção pouco ondulada; derme papilar frouxa e reticular densa; hipoderme; folículos oblíquos com haste, bainha interna eosinófila com tri-hialina, bainha externa clara, membrana vítrea e bainha conjuntiva; bulbo com matriz basófila sobre a papila e melanina; **sebácea e eretor do lado do ângulo obtuso**, com o eretor inserido abaixo da sebácea; écrina na derme profunda (secretora × ducto de duas camadas); cortes transversais de folículos. | **ajustar (P1-1, área do jogo)**; P3-6 |

**Toque** (`toque.txt`): todas as 48 estruturas são tocáveis. As menores: lâmina elástica interna 0,55% do SVG (9,8% de um campo de 40×), íntima do feixe 0,49% (10%), papila do pelo 0,64% (15,5%), arteríola central 0,97% (23,7%). Todas são alcançáveis a 40×.

### Lista priorizada de ajustes

**P1: induzem erro conceitual ou deixam o gabarito defensável em duas alternativas**

1. **pele-fina, área do jogo** (`sistemas-a.tsx`, `LAMINAS_SISTEMAS_A['pele-fina'].areaDiagnostica = [300, 200, 520, 300]`, linha 2025). Com centro y < 255, o círculo de 10× pega a epiderme interfolicular (junção em y ≈ 98 ± 6). Isso acontece em 41% dos sorteios, com até 10% do campo. Nesses campos, "Epitélio estratificado pavimentoso queratinizado" (resposta da `pele-espessa`, sorteável como distrator) é verdadeiro para parte da imagem. **Corrigir:** `[300, 260, 520, 300]`. Medido: epiderme em 0% dos campos; folículo ≥ 16,2%, glândula sebácea ≥ 7,9% e eretor ≥ 5,2% em 100% dos campos. O infundíbulo (até y ≈ 153, junto ao folículo) continua visível, mas dentro do folículo. Solução geral alternativa: ver P2-3 (distratores incompatíveis).

**P2: aspecto diagnóstico pouco fiel ou jogo injusto (não ensina errado, mas ensina mal)**

1. **timo, área do jogo** (`areaDiagnostica: [300, 200, 680, 380]`, linha 2023). Corpúsculo de Hassall presente (≥ 0,5% do campo) em só 77% dos campos; centros sem Hassall ficam, por exemplo, em torno de (490, 290), na ponte de medula. Medula e córtex estão sempre presentes. **Corrigir:** `[150, 150, 350, 350]`, em volta do lóbulo do Hassall grande (236, 244, r 33). Medido: Hassall ≥ 1,9% do campo, medula ≥ 15,6% e córtex ≥ 41,5% em 100% dos campos.
2. **timo, densidade de macrófagos no córtex** (`LaminaTimo`, `const mac = semear(rng, oc, tudo, 48, 8.6, (x, y) => noCortex(x, y, 8.6), 0.32)`, linha 1490). São cerca de 60 macrófagos, uns 6 por campo de 10×, desenhados para dar "céu estrelado", termo que o texto revisto agora reserva à patologia. **Corrigir:** `prob` ≈ 0,1–0,15 (2–3 por campo), mantendo os corpos apoptóticos no citoplasma.
3. **feixe-neurovascular e aorta: distratores parcialmente verdadeiros** (`QualTecido.tsx`, `montar`).
   - No feixe, o conjuntivo frouxo de fundo (Deco, sem rótulo) chega a 61% do campo. Para o feixe e para a aorta, "Tecido conjuntivo frouxo" e "Tecido muscular liso" descrevem parte do campo. Não são a melhor resposta, mas também não estão "claramente errados".
   - **Corrigir (desenho/área):** feixe `areaDiagnostica: [180, 260, 320, 470]`. Medido: artéria (luz e túnicas) ≥ 52,8% do campo, conjuntivo frouxo ≤ 35%. A veia sai do campo, e a resposta revista não depende dela.
   - **Corrigir (jogo, decisão de produto):** campo opcional por lâmina com distratores proibidos (ex.: `aorta`/`feixe-neurovascular` × `musculo-liso`, `conjuntivo-frouxo`; `pele-fina` × `pele-espessa`, `tecido-adiposo`). É mudança de esquema e de código.
4. **aorta, toque das lâminas elásticas** (`LaminaAorta`, `<path d={dLam} stroke="transparent" strokeWidth={6} …/>`, linha 531). Com lâminas a cada 18,7 un, a faixa de toque de 6 un cobre 32% da túnica média (19% do SVG contra 40% da média). No "Identifique na lâmina", um toque na média cai numa lâmina 1 vez em 3 e conta como erro, embora a lâmina seja componente da média. **Corrigir:** faixa de ≈ 3,5 un, ou aceitar um toque na lâmina quando o alvo for a média (ver item 5).
5. **"Identifique na lâmina": estruturas aninhadas** (`IdentifiqueLamina.tsx`, `escolher`: `const certo = id === alvo.estruturaId`). Afeta este grupo e as lâminas antigas. Pedir "Folículo linfoide" e o aluno tocar o centro germinativo (que é parte do folículo secundário) conta erro. O mesmo vale para endotélio × íntima e lâminas × média (aorta), arteríola e centro germinativo × polpa branca (baço), Hassall e células epiteliais × medula (timo), haste e papila × folículo (pele). **Corrigir:** mapa `contidoEm` por lâmina para aceitar a parte quando o alvo é o todo. É mudança de código.

**P3: refinamentos (opcionais)**

1. **aorta**: o halo claro em volta de cada vaso dos vasa vasorum (`<circle … r={r + 5} fill={HE.colagenoClaro} />`, linha 538) lembra espaço de retração ou edema perivascular. Usar cor próxima à do conjuntivo vizinho e contorno irregular.
2. **feixe-neurovascular**:
   - Luz da veia quase oval (`VL`, linha 621, harmônicos de 1,5–6%); o texto diz "irregular, muitas vezes colapsada". Aumentar a irregularidade ou achatar um lado.
   - Fibras do nervo esparsas: o endoneuro ocupa cerca de 60% do fascículo (laço de `fibras`, linhas 660–669, folga 1,6 un). Folga ≈ 0,8 e mais tentativas.
   - Borda externa da adventícia da artéria nítida (`rAdv`, linha 565; `path` da linha 749); o texto diz "contínua com o conjuntivo ao redor". Esgarçar a borda.
3. **linfonodo**:
   - Plasmócitos dos cordões sem halo justanuclear nem cromatina em roda (linhas 1064–1073).
   - A medula encosta no seio subcapsular em quase toda a metade inferior (`MED`, linha 800; contorno, linhas 878–884). O córtex deveria contornar a medula, exceto junto ao hilo.
   - Centro germinativo pouco celular (`centroGerminativo`, `prob` 0,4/1/0,85, linhas 371–373).
4. **baco**:
   - Sinusoides como bastonetes curtos de pontas arredondadas (`qbez` nas linhas 1166–1180 com `strokeLinecap="round"` na linha 1343). Parecem tubos fechados. Preferir perfis mais longos, algumas anastomoses e pontas que saem do plano.
   - Zona marginal de mesma largura em volta das bainhas periarteriolares (`ZP = 22`, linha 1155). No ser humano, ela é mais evidente em volta dos folículos.
5. **timo**:
   - Septos retilíneos em grade de Voronoi (linhas 1401–1421). Na peça real são levemente sinuosos.
   - Medula muito pálida, quase vazia (`fill="#e8d5e7"`, linha 1555; `timMedula` com `prob` 0,8, linha 1492). Um pouco mais de rosa (citoplasma eosinófilo pálido das células epiteliais) a deixaria mais fiel.
6. **pele-fina**:
   - O eretor faz uma "rede" que desce abaixo da própria inserção (`eixoEretor = cbez([-40, 275], [-140, 300], [-190, 170], [-178, -12], 40)`, linha 1829). Trajeto mais reto e oblíquo, da protuberância à derme papilar.
   - Espinhoso com só 2 fileiras (`esp` entre `sup + 21` e `jun − 15`, linha 1662). Pôr 3–4 fileiras.
   - Infundíbulo sem granulosa nem córnea (`infund`, linhas 1727 e 1758), embora o comentário diga "epitélio igual ao da epiderme".
   - Contorno lilás grosso dos lóbulos sebáceos (`strokeWidth={5}`, linha 1967) lembra cápsula. A camada basal já é dada pelos núcleos achatados.

## 5. Pontos para o revisor humano

1. **Pele fina × pele espessa no jogo (P1-1).** Escolher entre: (a) só ajustar a área da `pele-fina` (uma linha de código, medida acima); (b) também mudar a resposta da `pele-espessa` (em `laminas.json`, fora do escopo desta revisão) para algo como "Pele espessa (epitélio estratificado pavimentoso queratinizado)"; (c) criar distratores incompatíveis por lâmina (P2-3).
2. **Resposta do feixe.** A resposta passou a "Artéria muscular (feixe vasculonervoso)". Se preferir manter a veia na resposta, a área teria de ficar estreita, como [420, 270, 460, 360], e a veia seria só ≥ 3% do campo. Não recomendo.
3. **"Céu estrelado" no timo normal.** Há divergência. Parte dos textos de histologia usa a expressão para o córtex tímico normal. A patologia a usa como critério de linfoma de alto grau, e Pina-Oviedo (2023) afirma que o timo pediátrico normal não a mostra. O texto ficou com a leitura da patologia. Confirmar a preferência da disciplina e, se mantiver a expressão para o normal, decidir se vale citá-la com a ressalva.
4. **Números a conferir nas edições citadas:**
   - "40 a 70 lâminas elásticas" na aorta torácica adulta: a revisão aberta lida dá 40–60 unidades lamelares; pela minha leitura, Junqueira cita algo como 40 ao nascer e 70 no adulto, mas não consegui o texto integral do livro.
   - "Até cerca de 40 camadas" de músculo liso na artéria muscular (Junqueira).
5. **Seios "peritrabeculares" (lâmina) × "trabeculares" (his-12).** O termo da lâmina está entre os sinônimos do tópico. Uniformizar se a disciplina preferir.
6. **Classificação das queimaduras.** "Espessura parcial (2º grau)" foi usada sem desdobrar em 2º grau superficial e profundo (his-13 traz os dois). Confirmar a redação.
7. **Estruturas aninhadas e distratores "tecido × órgão"** (P2-3, P2-5). Exigem decisão de produto e mudança de esquema ou código. Valem também para as 16 lâminas antigas.
8. **Concorrência.** Durante esta revisão, outros agentes alteraram his-11, his-12 e his-13 (resumos, correlações, questões, referências; nas estruturas usadas pelas lâminas só mudou a redação de `celula-espumosa`). Reconferi as correções contra as versões atuais e estão coerentes com elas: seleção negativa, hiperplasia folicular do timo com centros germinativos na medula, asplenia funcional na doença falciforme, queimaduras que poupam parte da derme.
9. **Teste que falha fora deste grupo.** `npx vitest run` tem 1 falha: "toda lâmina tem desenho e todo desenho tem lâmina" → `pulmao`. O desenho `pulmao` está em `sistemas-c.tsx` (alterado por outro agente às 11:09, fora do commit), e `laminas-sistemas-c.json` ainda está vazio. Não tem relação com o grupo A; nenhum arquivo do grupo C foi tocado aqui.

## 6. Fontes conferidas (texto lido por curl nas APIs do Europe PMC e do PubMed)

| item | fonte | trecho decisivo |
|---|---|---|
| Lâminas da aorta | Europe PMC, `rest/PMC12593762/fullTextXML` (revisão de 2025 sobre aneurismas da aorta torácica) | "The thickness and number of lamellar units depend on the patient's age and aorta topography. On average, the media of the thoracic aorta contains approximately 40–60 lamellar units. The number of lamellar units decreases by half when proceeding from the ascending aorta to the abdominal aorta" |
| Vasa vasorum e difusão | Europe PMC, `rest/PMC12731113/fullTextXML` | "In the thoracic elastic aorta, the inner avascular zone of the media is nourished by diffusion from the lumen, whereas the vasa vasorum supply the outer…" |
| DiGeorge | PMID 36648576, Europe PMC `PMC9892161` (J Clin Immunol 2023, diretriz de imunologia da 22q11.2del) | "The classic phenotypic triad of DGS consists of conotruncal heart defects, hypocalcemia due to hypoparathyroidism, and T cell deficiency due to thymic hypoplasia"; "approximately 0.5% of those diagnosed with 22q11.2del have … congenital athymia" (número não levado ao texto) |
| Folículos no timo | PMID 41514597, Europe PMC `PMC12784861` (Porubsky, Cancers 2025) | "lymphoid follicles, which typically are not present in significant numbers within a normal thymus"; TFH "strongly linked to early-onset myasthenia gravis, and is characterized by germinal-center formation within thymic lobes"; follicles "within the medulla and perivascular spaces" |
| Hiperplasia folicular e miastenia | PMID 40666538 (Sikorski et al., Mediastinum 2025), resumo pela E-utilities | "TFH is a hallmark of EOMG, characterized by GC formation and intrathymic production of AChR autoantibodies" |
| "Céu estrelado" × timo normal | PMID 38090035, Europe PMC `PMC10713242` (Pina-Oviedo, Mediastinum 2023) | T-LBL: "effacement of the architecture … and a 'starry-sky' pattern"; timo pediátrico normal: "A 'starry-sky' pattern is not seen"; "the lack of apoptosis and necrosis are typical features of normal thymic cortex" |
| "Céu estrelado" no Burkitt | PMID 41749833, Europe PMC `PMC12938643` (2026) | "A 'starry sky' pattern is usually present, resulting from the interspersed tingible body macrophages" |
| "Céu estrelado" no linfoblástico T | PMID 42740338, Europe PMC `PMC13586492` (2026) | "A 'starry sky' pattern due to interspersed tingible-body macrophages is present in some cases, mimicking Burkitt lymphoma" |
| Baço na doença falciforme | PMID 39568431, Europe PMC `PMC11873697` (Haematologica 2025) | "repeated intrasplenic sickling causing infarction and inflammation, ultimately leading to progressive splenic fibrosis and, in some cases, complete splenic atrophy (autosplenectomy)" |
| idem | PMID 41665679, Europe PMC `PMC13388681` (Abdom Radiol 2026) | "Autosplenectomy in SCD occurs due to recurrent episodes of vascular occlusion and infarction" |

Junqueira 14ª ed. e Ross 8ª ed. não estão abertos na rede. As afirmações atribuídas a eles foram conferidas contra os tópicos his-11, his-12 e his-13 (já revisados por duas etapas) e contra as fontes acima. Os números que dependem só do livro estão no §5, item 4.

## 7. Evidências

- **Integridade** (script contra `git show dd4be4e:…/laminas-sistemas-a.json`, idêntico ao arquivo antes desta revisão): ids, `ordem`, `titulo`, `orgao`, `topicos` e ids, nomes e ordem das estruturas iguais; 21 campos de texto alterados; `revisao.humano` = `null` e 2 entradas em `revisao.agentes` nas 6 lâminas; 27 valores de `tecido` distintos em `laminas*.json`.
- **Campos do jogo**: grade de rótulos (`data-e`) a cada 2 un sobre os SVGs atuais (renderizados depois da última edição de `sistemas-a.tsx`), com o mesmo método de `toque.mjs` (Chromium headless, `elementFromPoint`). Para cada centro, calculei a fração de cada estrutura no círculo de raio 150 un, com o centro limitado como no `Visor` (`limitar`). Dois métodos deram o mesmo resultado (amostragem direta em 121 centros; convolução por FFT numa grade de 10 un): Hassall presente em 76,7–77,7% dos campos; epiderme da pele fina em 40,7–41,3%. Scripts em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-lam-a/` (`grade.mjs`, `campos.py`, `busca2.py`, `busca3.py`).
- `npm run validar-conteudo` → `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.`
- `npx vitest run` → `Test Files 1 failed | 8 passed (9) · Tests 1 failed | 83 passed (84)`. A única falha é `pulmao` (grupo C, em andamento; §5, item 9). Os testes das lâminas do grupo A passam: estruturas do texto = do desenho; área diagnóstica dentro do SVG.
