# Revisão HS15–16: histologia (glândulas anexas e sistema respiratório)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, com a 3ª verificação (fonte primária em texto integral) e acesso só por curl. Formato: `docs/conteudo-schema.md`, seção Histologia.
- Arquivos editados: `content/histologia/topicos/his-15-glandulas-anexas.json` e `his-16-respiratorio.json`. Mais nenhum, além deste relatório.
- Lidos para conferir a coerência, sem edição:
  - tópicos his-02, his-03, his-04, his-08, his-18, emb-14, emb-15 e emb-25;
  - `content/histologia/laminas*.json`;
  - `src/modules/histologia/laminas/sistemas-b.tsx` e `sistemas-c.tsx` (`PARTES_FIGADO`, `PARTES_PANCREAS`, `PARTES_PULMAO`).
- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.
- O que mudou e o que não mudou:
  - Nenhum gabarito (`correta`, `ordemCorreta`, `pares`) foi alterado, nem o texto de alternativas e itens.
  - Ids de tópico, questão, evento e correlação continuam os mesmos.
  - Três ids de **estrutura** do his-15 foram trocados para os ids que a lâmina `pancreas` já usa (ver seção 2).
  - A checagem foi feita por script, comparando com a cópia dos arquivos anterior à revisão.

## 1. Resumo

Revisei integralmente os dois tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, 58 questões, referências, notas de divergência e incertezas. O conteúdo estava correto e bem escrito. **Não encontrei fato errado em questão nem gabarito errado.**

No his-15, duas afirmações do texto de estudo estavam imprecisas e foram classificadas como importantes. Nenhuma delas é cobrada em questão:

- o arranjo das células nas ilhotas humanas;
- a colangite esclerosante primária.

As demais correções são de precisão, de atribuição de fonte, de terminologia ou de coerência com as lâminas.

| Tópico | Questões | Crítica | Importante | Menor | Total | Ids alinhados à lâmina | Veredito |
|---|---|---|---|---|---|---|---|
| his-15 Glândulas anexas | 29 | 0 | 2 | 7 | 9 | 3 | aprovado-com-correcoes |
| his-16 Sistema respiratório | 29 | 0 | 0 | 7 | 7 | 0 | aprovado-com-correcoes |
| **Total** | **58** | **0** | **2** | **14** | **16** | **3** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão ou referência.

### Checagens por script

- **Letras citadas.** Nas 34 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- **Distribuição das letras corretas.** his-15: a4/b4/c4/d5. his-16: a4/b5/c4/d4. Nenhuma letra passa de 30%, então não houve redistribuição.
- **Pista de comprimento.** Em nenhuma questão a alternativa correta é a única muito mais longa. Em quase todas, um distrator é mais longo que ela.
- **V/F.** 3 verdadeiras e 3 falsas em cada tópico.
- **Tipos de questão** (cada tópico): 17 múltipla escolha, 6 V/F, 3 ordenar e 3 associar. Questões com contexto: 11 no his-15 e 13 no his-16.
- **Ordenar e associar.** As sequências não deixam margem de dúvida: trajeto da bile, trajeto do sangue, paracetamol, árvore respiratória, barreira e α1-antitripsina. Os pares são unívocos.
- **Dificuldade e Bloom** são coerentes com cada item.

### Pontos registrados pelo redator: conferência um a um

| Ponto | Resultado | Fonte lida (trecho decisivo) |
|---|---|---|
| Zonas do ácino × centrolobular/periportal | Correto. A zona 1 é periportal e recebe primeiro o sangue mais oxigenado. A zona 3 é centrolobular, a menos oxigenada, e se concentra a CYP2E1. A nota que trata os pares como equivalentes aproximados foi mantida. | Choi, Int J Mol Sci 2025 (PMC12387026, texto integral): "Acinar zones 1 (periportal) through 3 (pericentral) … decreasing oxygen tension". Ni et al., Redox Biol 2013 (PMC3814950): "higher expression levels of CYP2E1, CYP1A2, CYP3A … at the perivenous zone" |
| Origem das células de Kupffer | Correto como divergência. Nenhuma questão cobra a origem. A nota ganhou as fontes primárias. A atribuição "his-08" foi corrigida para "his-04" (nota) e "his-08" (estrutura macrófago). | Gomez Perdiguero et al., Nature 2015 (PMID 25470051, resumo): "the vast majority of adult tissue-resident macrophages in liver (Kupffer cells) … originate from … erythro-myeloid progenitors". Scott et al., Nat Commun 2016 (PMID 26813785, resumo): monócitos originam células de Kupffer que se autorrenovam quando o nicho fica livre |
| Arquitetura das ilhotas humanas | **Corrigido (importante).** O resumo dizia que os tipos "se misturam, sem o centro de β e a periferia de α". Bosco et al. encontraram centro β e periferia α nas ilhotas pequenas e células α ao longo dos vasos nas maiores. A nova redação vale para os dois estudos. | Cabrera et al., PNAS 2006 (PMID 16461897, resumo): "did not show anatomical subdivisions … fewer beta cells and more alpha cells than did mouse islets". Bosco et al., Diabetes 2010 (PMID 20185817, resumo): "In small human islets … beta-cells had a core position, alpha-cells had a mantle position … In bigger islets, alpha-cells … also along vessels that penetrate" |
| Canal de Hering | Correto. É revestido em parte por hepatócitos e em parte por colangiócitos e abriga progenitoras. Segue para dúctulos revestidos só por colangiócitos (descrição de Ross). Junqueira trata Hering e dúctulos como quase sinônimos, como já registrado. A sequência das questões não é afetada. | Choi 2025 (PMC12387026): "The canal of Hering is a transitional ductule partially lined with hepatocytes and partially with cuboidal cholangiocytes. Bile flows from the canal of Hering into the intrahepatic bile ductules, which are entirely lined with cholangiocytes … niche for liver stem/progenitor cells" |
| Fluxo portal 70–80% | Correto. O resumo diz "cerca de três quartos", coerente com a lâmina (3/4 e 1/4). O valor não é cobrado. A nota ganhou uma fonte em texto integral. | Popovic et al., Diagnostics 2026 (PMC13664619): "The portal vein … accounts for approximately 70–80% of total hepatic blood flow, whereas the hepatic artery provides the remaining 20–30%" |
| MASLD 2023 | Correto. A incerteza foi resolvida: o texto integral foi lido na publicação simultânea em Hepatology. | Rinella et al., Hepatology 2023;78(6):1966-86 (PMC10653297): "MASLD, defined as the presence of hepatic steatosis in conjunction with one cardiometabolic risk factor … and no other discernible cause … MetALD … greater amounts of alcohol per week". J Hepatol 2023;79(6):1542-56 (PMID 37364790): metadados conferidos |
| Área coberta pelo pneumócito I | Correto. O tópico diz "mais de 90%", e as questões cobram só que o tipo I, menos numeroso, cobre a maior parte da superfície. | Crapo et al., Am Rev Respir Dis 1982 (PMID 7103258, resumo): tipo I = 8% das células; "Seven percent of the alveolar surface was covered by alveolar type II cells, which make up 16%" (logo, tipo I ≈ 93%) |
| Surfactante como parte da barreira | Correto como divergência entre autores. A nota atribuía a Ross a lista sem surfactante, mas, pela minha memória da obra, Ross inclui "a thin layer of surfactant" na barreira mais delgada. A nota foi reescrita sem a atribuição contestável. A q05 passou a citar a película no enunciado, para ficar coerente com a q25. | Ross 8ª ed., cap. 19, citado de memória (conferir) |
| Origem dos macrófagos alveolares | Correto como divergência (camundongo). Nenhuma questão cobra a origem. | Guilliams et al., J Exp Med 2013 (PMID 24043763, resumo): "circulating monocytes contributed minimally … fetal monocytes … self-maintain throughout life" |
| Ácino × lóbulo pulmonar | Correto. O ácino é o parênquima distal ao bronquíolo terminal (q01, q08, estruturas). A atribuição a Ross na nota ("inclui o bronquíolo terminal") ficou marcada como citada de memória. O lóbulo não é cobrado. | Robbins 10ª ed. (de memória) |
| Célula clube | Correto: epônimo e histórico. | Winkelmann e Noack, Eur Respir J 2010 (PMID 20223917, resumo): "active member of the Nazi party … tissue taken from prisoners executed in nearby Dresden". Irwin et al., Chest 2013 (PMID 23276834): título |
| Padrão do ferro (Kupffer × hepatócitos periportais) | Correto (q10). A incerteza foi resolvida e virou nota. | Choi 2025 (PMC12387026): "Secondary iron overload from exogenous sources (e.g., repeated transfusion) predominantly involves Kupffer cells". Srinivasamurthy e Mehta, Eur J Hum Genet 2026 (PMC13424879): "in the early stages of haemochromatosis, iron deposition is mainly present in periportal hepatocytes". de Melo Campos et al., HTCT 2025 (PMC12131004): "periportal hepatocytes with iron-spared Kupffer cells" |
| Glóbulos PAS+ resistentes à diástase (SBPT 2024) | **A SBPT 2024 não descreve a histologia.** No texto integral não aparecem "PAS", "diastase" nem "periportal". Da SBPT conferi: herança codominante; produção sobretudo hepática; polímeros "within the rough surface of the endoplasmic reticulum of hepatocytes"; PiZZ com "10-20% of normal"; colestase neonatal prolongada; indicações de dosagem; critérios de reposição. Os glóbulos PAS-D periportais estão em outras fontes de texto integral, que acrescentei às referências e à q11. | Feitosa et al., J Bras Pneumol 2024 (PMC11601085). Fromme et al., Hepatol Commun 2025 (PMC11999460): "pink globules that can be as large as a nucleus and are located predominantly in the periportal area". Boyd et al., Frontline Gastroenterol 2020 (PMC6914302): "Globules tend to be concentrated in periportal hepatocytes" |
| Proteinose alveolar (ERS) | Correto. A diretriz é de 2024 (Eur Respir J 64(5):2400725). O resumo para clínicos, de 2025, foi lido em texto integral. Forma autoimune mais frequente; diagnóstico por lavado com PAS e anticorpo anti-GM-CSF; 1ª linha de tratamento. A q15 foi ajustada para "e/ou … sintomática ou progressiva". | Alfaro et al., Breathe 2025 (PMC12070199): "Whole lung lavage (WLL) and/or inhaled … GM-CSF should be offered as first line therapy (strong recommendation)"; "foamy macrophages … and PAS-positive amorphic material" |
| Necrose de zona 3 por paracetamol | Correto (q08, q26, q28, correlação): CYP2E1 → NAPQI, glutationa esgotada, adutos e lesão mitocondrial, necrose centrolobular. O consenso de Dart 2023 continua conferido só no resumo: JAMA Netw Open não tem cópia no PMC, e o tópico não usa doses. | Skat-Rørdam et al., Cell Mol Life Sci 2025 (PMC12106265): "APAP is metabolized by … CYP2E1 … to … NAPQI … In the case of an overdose, glutathione reserves are depleted and unconjugated NAPQI forms protein adducts"; "acetaminophen … induces centrilobular necrosis". Ni 2013 (PMC3814950) |
| Febre amarela mediozonal | Correto (q28, correlação). A incerteza foi resolvida em texto integral e virou nota. | Carvalho et al., Cells 2022 (PMC9265354): "evident midzonal (Z2) lesions … Councilman bodies … coagulative necrosis"; "the midzonal region … the most affected area in the liver acinus" |
| Cílios olfatórios | Correto (imóveis). A incerteza foi resolvida e virou nota, com referência nova. | Rayamajhi et al., PLoS Biol 2024 (PMC10810531): "(9+2) axonemal microtubule arrangement … but lack the dynein arms"; "In keeping with the immotile nature of olfactory cilia, … ciliary motility genes are repressed in zebrafish, mouse, and human OSNs" |

Também conferi no texto integral da SBPT (PMC11601085) as indicações de dosagem do his-16, que estão corretas e completas:
- todo adulto com obstrução persistente após broncodilatador;
- enfisema antes dos 45 anos;
- enfisema em não fumante ou em fumante com pouca carga tabágica;
- enfisema de predomínio basal;
- história familiar de enfisema ou de doença hepática;
- paniculite;
- doença hepática crônica sem causa definida.

Conferi também os critérios de reposição: "nonsmokers or former smokers over 18 years of age with a genetic variant consistent with severe AATD, a low serum AAT concentration … and evidence of airflow limitation". Os metadados de todas as referências foram conferidos nas E-utilities: PMIDs, volumes, páginas e DOIs batem.

### Coerência com outros tópicos e com as lâminas

**Lâmina `figado`** (`laminas-sistemas-b.json`):
- Os 8 ids existem no his-15, com definições compatíveis: `veia-centrolobular`, `placas-de-hepatocitos`, `sinusoide-hepatico`, `celula-de-kupffer`, `triade-portal`, `ramo-da-veia-porta`, `ramo-da-arteria-hepatica` e `ducto-biliar`.
- Coincidem também os fluxos (3/4 e 1/4), a ausência de septos no ser humano e a Kupffer "dentro do sinusoide, presa ao endotélio".
- As estruturas já servem a um futuro modelo 3D de lóbulo: `lobulo-hepatico`, `lobulo-portal`, `acino-hepatico`, `canaliculo-biliar`, `canal-de-hering`, `espaco-perissinusoidal`, `celula-estrelada-hepatica`, `placa-limitante` e `hepatocito`. Todas têm id único no registro global de estruturas.

**Lâmina `pancreas`** (`laminas-sistemas-b.json`): ids `acino-pancreatico`, `celula-centroacinosa`, `ducto-intercalado`, `ilhota-de-langerhans`, `ducto-interlobular` e `septo-conjuntivo`.
- O his-15 usava `acino-seroso`, `ducto-intercalar` e `ilhotas-pancreaticas`. Troquei esses três para os ids da lâmina (ver seção 2).
- `ducto-interlobular` e `septo-conjuntivo` não são estruturas do his-15. `septo-conjuntivo` existe no his-03. Não acrescentei estruturas, porque a tarefa era de correção.

**Lâmina `pulmao`** (`PARTES_PULMAO` em `sistemas-c.tsx`; `laminas-sistemas-c.json` ainda vazio):
- Os 9 ids já existem no his-16: `bronquiolo`, `bronquiolo-respiratorio`, `ducto-alveolar`, `alveolo`, `septo-interalveolar`, `capilar`, `pneumocito-tipo-i`, `pneumocito-tipo-ii` e `macrofago-alveolar`.
- Para um futuro modelo 3D de alvéolo, o his-16 tem também `poro-alveolar`, `corpos-lamelares`, `surfactante-pulmonar`, `barreira-hematoaerea` e `fibras-elasticas`.

**his-02** (epitélio respiratório, cílios 9+2, metaplasia escamosa do tabagista), **his-03** (ausência de células mioepiteliais no pâncreas exócrino, fibrose cística), **his-04** (fibras reticulares, origem dos macrófagos), **emb-14** (período canalicular, surfactante, pleuras) e **emb-15** (origem da Kupffer):
- Coerentes com os tópicos revistos.
- Divergências de id entre tópicos estão na seção 3.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-15 estrutura `acino-seroso` | id; sinonimos | `acino-seroso` | `acino-pancreatico` (+ sinônimo "ácino seroso do pâncreas") | Alinhar ao id da lâmina `pancreas`. **Registro de troca de id.** Nenhuma questão nem histórico usa ids de estrutura de tópico | alinhamento | `laminas-sistemas-b.json`; `PARTES_PANCREAS` |
| his-15 estrutura `ducto-intercalar` | id; sinonimos; definicao | `ducto-intercalar`; "epitélio cúbico baixo" | `ducto-intercalado` (+ sinônimo); "epitélio pavimentoso a cúbico baixo" | Id da lâmina. Epitélio igual ao da lâmina (Ross: células pavimentosas a cúbicas baixas) | alinhamento + menor | lâmina `pancreas`; Ross 8ª ed., cap. 18 |
| his-15 estrutura `ilhotas-pancreaticas` | id; sinonimos | `ilhotas-pancreaticas` | `ilhota-de-langerhans` (+ sinônimo "ilhota de Langerhans") | Id da lâmina. **Registro de troca de id.** Ver seção 3: emb-25 e his-18 usam `ilhotas-pancreaticas` | alinhamento | lâmina `pancreas` |
| his-15 | resumo (pâncreas endócrino) | "Nas ilhotas humanas, os tipos se misturam, sem o centro de células β e a periferia de α descritos em roedores." | "…ficam mais misturados do que nas de roedores (centro β e periferia α): há proporcionalmente mais células α, e muitas acompanham os capilares que penetram a ilhota." Nota de divergência e referência (Bosco) acrescentadas | A afirmação categórica é contrariada por Bosco 2010 (centro e periferia nas ilhotas humanas pequenas). A nova redação vale para os dois estudos | importante | Cabrera et al. 2006 (PMID 16461897); Bosco et al. 2010 (PMID 20185817) |
| his-15 `colestase` | descricao | Na CEP, "os ductos maiores são envolvidos por fibrose concêntrica em casca de cebola" | "inflamação e fibrose estreitam ductos biliares intra e extra-hepáticos, e a lesão clássica na biópsia é a fibrose concêntrica em casca de cebola em torno de um ducto acometido" | A casca de cebola é a lesão vista na biópsia, em ductos acometidos de pequeno e médio calibre, e não um traço "dos ductos maiores" | importante | Boyd et al., Frontline Gastroenterol 2020 (PMC6914302); Robbins 10ª ed. |
| his-15 `esteatose-esteato-hepatite` | descricao | "…Mallory-Denk, neutrófilos e fibrose perissinusoidal…" | "…Mallory-Denk, inflamação lobular (com neutrófilos, mais evidentes na forma alcoólica) e fibrose…" | Na MASH, a inflamação é mista, e os neutrófilos destacam-se na forma alcoólica | menor | Robbins 10ª ed. (de memória; ver incertezas) |
| his-15-q11 | explicacao (refuta b); referencia | "A hemossiderina … cora-se em azul pelo Perls, **não pelo PAS**." | "…forma grânulos castanho-dourados na HE, que se coram em azul pelo Perls, e não glóbulos eosinófilos resistentes à diástase no retículo endoplasmático." Referência + Fromme 2025 | A reatividade da hemossiderina ao PAS é variável. O argumento que separa o distrator é a morfologia e o Perls | menor | Fromme et al. 2025 (PMC11999460) |
| his-15-q10 | referencia | Robbins; Junqueira | + Choi 2025; Srinivasamurthy e Mehta 2026 | Fonte primária do padrão do ferro | menor (com a linha das incertezas) | ver seção 1 |
| his-15 | notasDivergencia (Kupffer) | "A mesma divergência está registrada no emb-15 e no his-08" | Fontes primárias + "emb-15 e his-04 (e na origem do macrófago no his-08)" | O his-08 não tem a nota, só a origem na estrutura `macrofago`. A nota está no his-04 | menor | Gomez Perdiguero 2015; Scott 2016 |
| his-15 | notasDivergencia (fluxo) | "outras obras dão 70–80% portal" | + fonte em texto integral | Número sem fonte lida | menor | Popovic et al. 2026 (PMC13664619) |
| his-15 | notasDivergencia (MASLD); referencias (Rinella, Carvalho) | Rinella: "(resumo)"; Carvalho: "(resumo)" | Texto integral (Hepatology, PMC10653297; Cells, PMC9265354). Definições de MASLD e MetALD na nota | Conferência de fonte primária | menor | PMC10653297; PMC9265354 |
| his-15 | incertezas → notasDivergencia; referencias | Quatro incertezas abertas: ferro, febre amarela, α1-antitripsina e MASLD | Resolvidas e registradas como "Conferido", com trechos. Ficou explícito que a SBPT não descreve os glóbulos PAS-D. Nova nota sobre canal de Hering e paracetamol. Cinco referências novas (Bosco, Fromme, Choi, Srinivasamurthy, Boyd). Nova incerteza: CEP e esteato-hepatite, de memória | Registro honesto do que foi lido | menor | ver seção 1 |
| his-16-q05 | enunciado; explicacao | "o oxigênio passa do ar alveolar ao plasma atravessando:" | "depois de se dissolver na película de surfactante e líquido que reveste o alvéolo, o oxigênio passa ao plasma atravessando:" | A q25 do mesmo tópico põe a película como 1ª camada. Sem a menção, a alternativa (b) parecia incompleta para quem segue Ross | menor | Ross 8ª ed., cap. 19 (de memória) |
| his-16 | notasDivergencia (barreira) | "Junqueira e Ross listam [só] pneumócito I, lâminas basais e endotélio" | "há descrições que listam só os componentes teciduais e outras, como a de Ross (de memória), que incluem a película…" | Atribuição a Ross provavelmente errada | menor | Ross 8ª ed. (conferir) |
| his-16-q15 | explicacao | "a lavagem pulmonar total **e** o GM-CSF inalatório … da forma autoimune sintomática" | "…**e/ou**… sintomática **ou progressiva**" | Igual à recomendação | menor | Alfaro et al., Breathe 2025 (PMC12070199) |
| his-16 `bronquite-cronica`; his-16-q06 | descricao; explicacao | "inflamação, metaplasia escamosa e fibrose da parede dos bronquíolos" | "…metaplasia escamosa **do epitélio brônquico** e fibrose da parede dos bronquíolos" | A frase situava a metaplasia escamosa nos bronquíolos. Nos bronquíolos, a alteração é metaplasia caliciforme, inflamação e fibrose | menor | Robbins 10ª ed. (pulmão — DPOC) |
| his-16 evento `h16-laringe` | descricao | "Atravessa a laringe, entre as pregas vestibulares e as pregas vocais" | "…passando entre as pregas vestibulares e depois entre as pregas vocais (rima da glote)" | Podia ser lido como o ventrículo, o espaço entre as pregas. A ordem não muda | menor | Junqueira 14ª ed. (respiratório) |
| his-16 | notasDivergencia (ácino) | "Ross inclui o próprio bronquíolo terminal" | "alguns livros de histologia (Ross, citado de memória) incluem…" | Atribuição não conferida | menor | — |
| his-16 | incertezas → notasDivergencia; referencias | "Cílios olfatórios imóveis segue Ross … Conferir." | Nota "Conferido" com o trecho e a referência Rayamajhi 2024 | Incerteza resolvida em texto integral | menor | PMC10810531 |
| his-15 e his-16 | revisao.agentes | `[]` | Entrada `revisor-histologia-v1`, 2026-11-10, `aprovado-com-correcoes` | Registro da revisão | — | — |

## 3. Pontos para o revisor humano (e para a coordenação)

1. **Ids de estrutura divergentes entre tópicos.** O registro global (`src/content/index.ts`, `estruturas()`) guarda a primeira definição de cada id. Um modelo 3D que use esse registro mostra a definição do tópico carregado primeiro. Decisão pendente:
   - **Ilhotas.** O his-15 e a lâmina `pancreas` usam agora `ilhota-de-langerhans`; o emb-25 e o his-18 (ainda sem revisão) usam `ilhotas-pancreaticas`. Há duas saídas:
     - a lâmina adota `ilhotas-pancreaticas`, e o his-15 volta ao id antigo;
     - o his-18 se alinha à lâmina.
   - **Ducto intercalar.** O his-03 (salivares) usa `ducto-intercalar`; o his-15 e a lâmina `pancreas`, `ducto-intercalado`. Os nomes exibidos continuam "Ducto intercalar". Junqueira e Ross em português usam "ducto intercalar".
   - **Pneumócitos.** O emb-14 usa `pneumocito-tipo-1` e `pneumocito-tipo-2`; o his-16 e a lâmina `pulmao`, `pneumocito-tipo-i` e `pneumocito-tipo-ii`. Não mexi no emb-14, que está fora do escopo.
2. **Lâmina `figado` (para o agente da lâmina, fora do meu escopo).**
   - A `descricao` geral diz que os sinusoides são "capilares de parede descontínua com células endoteliais e células de Kupffer", o que sugere que a Kupffer faz parte da parede.
   - A estrutura `celula-de-kupffer` da própria lâmina, o his-15 e a 8ª ed. de Ross a situam na luz, presa ao endotélio.
   - Sugestão: "…de parede descontínua (células endoteliais), com células de Kupffer na luz".
3. **Capítulos citados de memória.** Não conferi o sumário da 14ª ed. de Junqueira (16 glândulas anexas, 17 respiratório) nem os títulos dos capítulos de Gartner e Kierszenbaum. A numeração de Ross (18, 19) é compatível com as edições que conheço.
4. **Arranjo das ilhotas humanas.** Há divergência real na literatura: Cabrera 2006 × Bosco 2010, os dois conferidos só no resumo. O resumo agora usa redação compatível com os dois, e nenhuma questão cobra o ponto. "1–2% do volume" e "mais numerosas na cauda" vêm de memória (Ross e Junqueira).
5. **Barreira hematoaérea e ácino pulmonar em Ross.** As duas atribuições a Ross são de memória:
   - inclusão da película de surfactante na barreira;
   - ácino incluindo ou não o bronquíolo terminal.

   Vale conferir no texto impresso da 8ª ed. As questões ficaram robustas às duas leituras.
6. **Paracetamol.** O consenso norte-americano e canadense (Dart et al., JAMA Netw Open 2023) não tem cópia no PMC e não abriu nesta rede. Ficou conferido só o resumo. O tópico não traz dose, esquema nem limiar. O mecanismo e a zonação foram conferidos em texto integral, em outras fontes.
7. **Achados de patologia citados de Robbins sem o texto impresso**: neutrófilos na esteato-hepatite; extensão da CEP; asma; pneumoconioses; doença da membrana hialina; bronquite crônica. Estão em `incertezas`. Nenhum número foi usado.
8. **Origem de Kupffer e de macrófagos alveolares.** Os dados de linhagem são de camundongo. Nenhuma questão cobra a origem.
9. **Terminologia.** O sinônimo "colangíolo" do canal de Hering foi mantido, porque Junqueira trata canal de Hering e dúctulo como equivalentes. A nota de divergência explica a distinção de Ross. Pode ser removido se o revisor preferir a nomenclatura de Ross e de Roskams et al. (Hepatology 2004).
10. **Anatomia.** A frase "o colédoco une-se ao ducto pancreático e se abre na papila maior" foi mantida sem ressalva. Em parte das pessoas, os dois desembocam separadamente na papila. Não é cobrado.

## 4. Testes

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina
AssertionError: pulmao: expected false to be true
 Test Files  1 failed | 8 passed (9)
      Tests  1 failed | 83 passed (84)
```

A única falha é da lâmina `pulmao`. O desenho já está registrado em `sistemas-c.tsx`, mas `laminas-sistemas-c.json` ainda está vazio, porque outro agente está desenhando a lâmina. A falha não tem relação com os arquivos desta revisão.

## 5. Fontes lidas (acesso por curl: Europe PMC REST, E-utilities)

**Texto integral:**
- SBPT 2024 (PMC11601085)
- Rinella 2023, Hepatology (PMC10653297)
- Carvalho 2022 (PMC9265354)
- Alfaro 2025, Breathe (PMC12070199)
- Fromme 2025 (PMC11999460)
- Boyd 2020 (PMC6914302)
- Choi 2025 (PMC12387026)
- Srinivasamurthy e Mehta 2026 (PMC13424879)
- de Melo Campos 2025 (PMC12131004)
- Popovic 2026 (PMC13664619)
- Skat-Rørdam 2025 (PMC12106265)
- Ni 2013 (PMC3814950)
- Rayamajhi 2024 (PMC10810531)
- Guilliams 2013 (PMC3782041), lido também em texto integral

**Só resumo:**
- Cabrera 2006: o texto integral, PMC1413730, retornou erro 500 no Europe PMC e no OAI
- Bosco 2010
- Crapo 1982
- Winkelmann e Noack 2010
- Gomez Perdiguero 2015
- Scott 2016
- Dart 2023
- Roskams 2004

**Não aberto:** diretriz completa da ERS (Eur Respir J 2024), não necessária, porque o resumo para clínicos traz as recomendações com a força de cada uma.

Os arquivos baixados ficaram na área temporária da sessão, fora do repositório.
