# Revisão HS17–18 — histologia (sistema urinário e glândulas endócrinas)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia), com conferência de fonte primária dos itens pedidos pelo redator
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (3ª verificação incluída; fontes lidas com `curl` pelo Bash, sem WebFetch); formato: `docs/conteudo-schema.md`
- Arquivos editados: `content/histologia/topicos/his-17-urinario.json` e `content/histologia/topicos/his-18-endocrino.json`. Nenhum outro arquivo do repositório foi alterado, fora este relatório. As lâminas (`laminas*.json` e `src/modules/histologia/laminas/sistemas-c.tsx`) só foram lidas.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos. Os gabaritos não mudaram: `correta`, `ordemCorreta`, `itens` e `pares` são os mesmos. Os ids também não mudaram, com uma exceção registrada: a estrutura `espaco-capsular` passou a `espaco-urinario`, alinhada à lâmina `rim-cortex`. A checagem foi feita por script, comparando cada arquivo com a cópia anterior às edições.

## 1. Resumo

Revisei integralmente os dois tópicos novos, com 56 questões ao todo: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, questões, referências, notas e incertezas. O conteúdo estava correto e bem escrito. **Não encontrei fato errado em questão nem gabarito errado.**

Uma correção foi classificada como importante. A explicação da his-18-q03 dava a prolactina pouco elevada num macroadenoma de 3 cm como argumento para afastar o prolactinoma. É justamente o cenário em que o PCDT manda excluir o efeito gancho.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-17 Sistema urinário | 28 | 0 | 0 | 10 | 10 | aprovado-com-correcoes |
| his-18 Glândulas endócrinas | 28 | 0 | 1 | 12 | 13 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **1** | **22** | **23** | |

Gravidade: **crítica** = fato ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou enganosa; **menor** = redação, terminologia, precisão, referência.

Checagens por script, depois das edições:
- **Letras corretas.** his-17: a4/b4/c4/d3; his-18: a4/b4/c4/d3. Nenhuma letra passa de 27%, então não houve redistribuição.
- **Pista de comprimento.** A correta é a alternativa mais longa em 1 de 15 questões (his-17-q02, com empate de 67 caracteres) e em 2 de 15 (his-18-q05, empate de 15; his-18-q14, empate de 70). Não há pista.
- **Letras na explicação.** Em todas as 30 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- **Tipos de questão.** Cada tópico tem 15 de múltipla escolha, 6 V/F, 4 de ordenar e 3 de associar. São 10 com contexto no his-17 e 11 no his-18. Os V/F ficam em 3 verdadeiros e 3 falsos em cada tópico.
- **Linhas do tempo.** Eventos do his-17 (filtrado do glomérulo à uretra) e do his-18 (síntese de T3/T4, com empate correto entre síntese da tireoglobulina e captação de iodeto): a ordem é inequívoca. Nas questões de ordenar (his-17-q22 a q25; his-18-q22 a q25), as sequências não deixam margem.

## 2. Conferência de fonte primária (texto integral)

| Fonte | Como foi lida | Resultado |
|---|---|---|
| **PCDT da Síndrome Nefrótica Primária em crianças e adolescentes** | PDF em `https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sindrome-nefrotica-primaria-em-criancas-e-adolescentes` (o link entrega o PDF), `pdftotext`. Diário Oficial: busca em `in.gov.br` | **Confirmado.** Cabeçalho: "PORTARIA CONJUNTA SAES/SCTIE Nº 87, DE 15 DE OUTUBRO DE 2026". Art. 4º revoga a Portaria Conjunta SAS/SCTIE/MS nº 1, de 10/01/2018. No DOU: Seção 1, **edição nº 198, de 20/10/2026, p. 88** (`in.gov.br/web/dou/-/portaria-conjunta-saes/sctie-n-87-de-15-de-outubro-de-2026-739127375`). Item 3.1 / Quadro 1: proteinúria "acima de 1.000 mg/m² por dia… ou índice de proteinúria/creatinina maior ou igual a 2 g/g… ou ≥ 3 cruzes"; albumina "menor que 3,0 g/dL". Biópsia: "Em geral, a biópsia renal não é realizada… pode ser indicada para pacientes acima de 12 anos, com SNCR ou com possibilidade de causa secundária". Lesões mínimas: "forma mais comum em crianças com diagnóstico inicial acima de 1 ano, com frequência que varia de 70 a 90%". Antinefrina: "foi demonstrada a presença de anticorpos antinefrina em pacientes com SNCS" (item 3.1, e não a introdução). Item 6.2.2, "Inicial ou da primeira descompensação": "deve-se usar prednisona ou prednisolona… remissão… em cerca de 85%". Os números de seção da referência foram ajustados. |
| **PCDT da Síndrome Nefrótica Primária em Adultos** | PDF em `https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sindrome-nefrotica-primaria-em-adultos` | **Confirmado: Portaria Conjunta nº 8, de 14/04/2020.** Introdução: "proteinúria (>3,0-3,5 g/1,73m2/dia em adultos), hipoalbuminemia (<3,0 g/dl)". Item 5.1.2: "Albumina sérica… abaixo de 3,5 g/dl". A divergência 3,0 × 3,5 g/dL é real e está correta na nota. Série brasileira: GESF 24,6%, membranosa 20,7%, IgA 20,1%, AGM 15,5%. Histopatologia: "define o plano terapêutico, **auxilia** a definição do diagnóstico etiológico". A correlação dizia "define o diagnóstico" e foi corrigida. Item 6.3.1: "Alterações glomerulares mínimas - AGM (doença de lesões mínimas)". |
| **PCDT da Hiperprolactinemia** | PDF em `https://www.gov.br/saude/pt-br/assuntos/pcdt/h/hiperprolactinemia` | **Confirmado: Portaria Conjunta nº 19, de 23/11/2020**, reeditada para corrigir a dose máxima de cabergolina ("apresentado à 97ª reunião da Subcomissão… realizada no dia 22/03/2022"). Prolactinomas: "tumores funcionantes mais comuns… aproximadamente 40% dos adenomas"; micro "< 10 mm", macro "10 mm ou mais". Compressão de haste: "geralmente inferiores a 100 ng/mL". Item 7.1: "agonistas dopaminérgicos constituem a primeira opção… cabergolina… primeira escolha para a maioria". Item 3.3, que motivou a correção da q03: "o efeito gancho… deve ser considerado em todos os casos de macroadenomas da hipófise com 3 cm ou mais associados a níveis de prolactina ≤ 200 ng/mL… solicitar dosagem da prolactina em soro diluído". |
| **PCDT da Insuficiência Adrenal** | PDF em `https://www.gov.br/saude/pt-br/assuntos/pcdt/i/insuficiencia-adrenal` | **Confirmado: Portaria Conjunta nº 20, de 24/11/2020**, que revoga a Portaria SAS/MS nº 1.170/2015. Autoimune em "cerca de 70% a 90%" nos EUA e na Europa. São Paulo: autoimune 39%, paracoccidioidomicose 28%, tuberculose 11%, adrenoleucodistrofia 7,3%. Hiperpigmentação "por elevação da proopiomelanocortina… ACTH e… MSH"; "hipercalemia só ocorre na IAP". "O uso prolongado de corticoide é a causa mais comum de IA". Fludrocortisona só na forma primária (6.1 × 6.2). Crise: "Pacientes instáveis devem ser imediatamente tratados com… hidrocortisona… mesmo antes de testes de confirmação". |
| **ATA 2015** (Haugen et al., PMC4739132, PMID 26462967) | `efetch db=pmc` devolve só a página de rosto. Europe PMC: `isOpenAccess: N`, `fullTextXML` com erro 500. A página do PMC tem verificação anti-robô; o BioC não tem o texto | **Texto integral NÃO relido nesta rede.** O resumo, no PubMed, confirma o escopo: critérios de PAAF e interpretação da citologia. Citações secundárias em acesso aberto: "FNA is the procedure of choice in the evaluation of thyroid nodules" (PMC9752034, PMC5195836) e "[A11], Recommendation 9" para o Bethesda (PMC9574989). As afirmações do conteúdo são qualitativas e foram mantidas. Na referência, saiu o número "Recomendação 7", que não pôde ser conferido. A incerteza do redator ("texto integral lido no PMC") foi corrigida para refletir o que esta revisão conseguiu ler. |
| **Endocrine Society 2008, Cushing** (Nieman et al., PMC2386281) | `efetch db=pmc` devolve só a página de rosto e o resumo; não é de acesso aberto | **Só o resumo oficial**, que confirma as duas afirmações usadas: "After excluding exogenous glucocorticoid use…"; "We recommend initial use of one test with high diagnostic accuracy (urine cortisol, late night salivary cortisol, 1 mg overnight or 2 mg 48-h dexamethasone suppression test)". A numeração "Recomendações 1 e 4" foi retirada. Pela minha memória da diretriz, os testes iniciais estão no item 3.1, e não no 4, mas não pude conferir. |
| **Casey e Lussey-Lepoutre 2026** (Endocr Relat Cancer 33(10); doi 10.1530/ERC-26-0310; PMC13695349; PMID 42820462) | Europe PMC `fullTextXML` (acesso aberto, CC BY) | **Confirmado.** "up to 40% of cases… are attributable to germline mutations" (SDHB, SDHD, SDHC, VHL, RET, NF1, TMEM127…). "Since the 2017 WHO classification, the terms 'benign' and 'malignant' have been abandoned for PPGLs. The current 2022 WHO classification advises that all PPGLs should be considered malignant neoplasms with variable metastatic potential." "preference for plasma-free metanephrines". PASS: "considerable interobserver variation". GAPP descrito. A nota foi precisada: "neoplasias malignas" e feocromocitoma = paraganglioma intra-adrenal. |
| Revisão da ATA 2025 (Uludag et al., PMC12821139) | Europe PMC, texto integral | Confirmado. A diretriz de 2025 exclui os nódulos. NIFTP: neoplasia de baixo risco na OMS (5ª ed.), e a recomendação 1 da ATA 2025 diz que o potencial maligno é mínimo. A nota foi precisada. |
| Anticorpos antinefrina | PubMed (E-utilities) | Watts et al., J Am Soc Nephrol 2022;33:238-52 (PMID 34732507) e Hengel et al., N Engl J Med 2024;391:422-33 (PMID 38804512): anticorpos em 44% dos adultos com lesões mínimas (69% sem imunossupressão) e em 52% das crianças com síndrome nefrótica idiopática (90% sem imunossupressão); no modelo animal, ligam-se ao diafragma da fenda. A incerteza foi resolvida e os dois artigos entraram nas referências. Os números não entraram no conteúdo. |
| OMS 2022, hipófise (Asa et al., Endocr Pathol 2022;33:6-26, PMID 35291028) | Resumo no PubMed | "pituitary neuroendocrine tumors (PitNETs; formerly known as pituitary adenomas)", com linhagens PIT1, TPIT e SF1. A nota dizia "ao lado de adenoma" e foi corrigida. |
| OMS 2022, "Hürthle" | Revisão em acesso aberto, Curr Oncol 2023 (PMC10453903) | "The term 'Hürthle cell' has been discarded… 'oncocytes' and 'oncocytic'". A nota foi precisada. |

## 3. Pontos de atenção do redator: conferência um a um

| Ponto | Resultado |
|---|---|
| Localização da mácula densa | **Correto.** Junqueira a põe no início do túbulo contorcido distal; Ross, no fim do ramo ascendente espesso (túbulo reto distal). O texto diz "parede do túbulo distal voltada para o polo vascular", o que vale nas duas descrições. A posição na linha do tempo (ramo ascendente espesso → mácula densa → TCD) e as questões q06, q17, q18 e q23 valem nas duas. |
| Divisão do néfron | **Correto.** Os dois vocabulários (Ross: segmentos espessos e delgado; Junqueira: TCP, alça, TCD) aparecem de forma coerente. A q01 cobra só que o ducto coletor não pertence ao néfron, consenso compatível com o emb-16 (broto ureteral). |
| Camada que mais pesa na barreira | **Adequado.** Nenhum texto ou questão hierarquiza MBG × diafragma; só sequência (q22) e composição (q03, q13) são cobradas. Mantido. |
| Epitélio da uretra feminina | **Adequado.** "Sobretudo estratificado pavimentoso" é compatível com Junqueira e Ross, e não é cobrado. Correção menor na uretra masculina: as glândulas de Littré ficam sobretudo na parte esponjosa. |
| "Lesões mínimas" | **Correto.** O PCDT do adulto usa "AGM (doença de lesões mínimas)" no item 6.3.1; a nota foi precisada. Na q09, "confirma" virou "é esperado": o apagamento difuso dos pedicelos não é específico (ocorre também na GESF). |
| Corticotrofos PAS+ | **Correto** (Ross e Robbins: os adenomas corticotróficos são basófilos e PAS-positivos). A nota existente basta. |
| Arranjo da glomerulosa | **Correto.** "Arcos ou grupos ovoides" é compatível com Junqueira, com Ross e com o desenho da lâmina `adrenal` ("grupos ovoides ('arcos'/'glomérulos')"). |
| Células oxífilas | **Correto.** "Raras na criança, aumentam com a idade" vale em todas as obras. A q10(d) não depende da idade exata. |
| NIFTP | **Conferido** (OMS 5ª ed. e ATA 2025). O conteúdo continua correto. Acrescentei à q08 que papilas e metástase afastam a NIFTP, e à correlação que a citologia "sugere" o carcinoma papilífero sem distingui-lo da NIFTP. |
| PitNET (OMS 2022) | **Nota corrigida:** o termo substitui "adenoma" (Asa et al. 2022). O conteúdo mantém "adenoma", como o PCDT e os livros, o que é aceitável. |
| Células de Hürthle/oncocíticas | **Nota precisada:** a OMS 2022 descarta o epônimo. A alternativa da q07, "Células de Hürthle, tirócitos oncocíticos…", traz os dois termos. Mantida. |
| Feocromocitoma sem "benigno/maligno" | **Conferido no texto integral** (Casey 2026). A q14 está correta. O distrator (d) dizia "tumores esporádicos **como este**" sem a vinheta estabelecer que o tumor era esporádico (até 40% são hereditários); virou "feocromocitomas esporádicos…". |
| Hialinose da arteríola eferente | **Correto.** A afirmação de Robbins ("rarely, if ever… in persons who do not have diabetes"), citada de memória, aparece em revisões de acesso aberto (PMC12571060; PMC12547650). A q21 está correta. |
| Alteração de Crooke | **Correto.** Ocorre nos corticotrofos não tumorais expostos a excesso de glicocorticoide, por filamentos de queratina (confirmado em PMC10652249). |
| Perda da reticulina | **Correto.** A "disruption of the reticulin network" define a morfologia adenomatosa (PMC13619420). |
| Anticorpos antinefrina | **Conferido na fonte primária** (Watts 2022; Hengel 2024). O texto passou a citar a doença de lesões mínimas e a síndrome nefrótica idiopática da criança. |
| Ids qualificados de "célula principal" | **Correto.** `celula-principal-ducto-coletor` (his-17) e `celula-principal-paratireoide` (his-18) não colidem com `celula-principal` (estômago: his-14 e lâmina `estomago-fundo`). |

### Coerência com outros tópicos e com as lâminas

- **his-02 (urotélio):** coerente. O his-17 acrescenta corretamente os cálices.
- **his-07 (paratireoide e PTH):** coerente. O PTH age via osteoblastos, e a calcitonina tem papel pequeno no adulto (his-18-q11).
- **his-15 (ilhotas):** coerente. Usa o mesmo id `ilhotas-pancreaticas` e os mesmos tipos celulares (β, α, δ, PP, ε). O his-18 remete ao his-15 e não cobra ilhotas.
- **emb-16:** coerente. Ducto coletor do broto ureteral; néfron do blastema. A nota sobre "túbulo coletor" × "ducto coletor" já existe.
- **emb-25:** coerente. Hipófise de dupla origem; células C sem camada germinativa afirmada; medula da crista neural; pineal do teto do diencéfalo. Ids iguais: `adeno-hipofise`, `neuro-hipofise`, `celulas-parafoliculares`, `medula-suprarrenal`, `ilhotas-pancreaticas`, `glandula-pineal`.
- **Lâminas** (lidas em `src/modules/histologia/laminas/sistemas-c.tsx`; `laminas-sistemas-c.json` ainda vazio às 10:40):
  - `rim-cortex` usa `espaco-urinario` para o espaço que o his-17 chamava `espaco-capsular`. **O id do tópico foi alinhado à lâmina.** Nenhum outro tópico usa esse id. Nome e sinônimos ("espaço urinário", "espaço de Bowman") foram mantidos. A lâmina também usa `capilar`, que o his-17 não define; não é necessário, porque cada lâmina tem a sua própria definição.
  - `tireoide` usa `celula-parafolicular` (singular); o his-18 e o emb-25 usam `celulas-parafoliculares`. **Não alterei:** mudar o his-18 quebraria a coerência com o emb-25. Recomendo que a lâmina use `celulas-parafoliculares`. `tirocito`, `coloide` e `capilar` coincidem.
  - `adrenal` usa `medula-adrenal`; o his-18 e o emb-25 usam `medula-suprarrenal`. **Não alterei**, pelo mesmo motivo; recomendo `medula-suprarrenal` na lâmina, termo da Terminologia Anatômica em português. As zonas `zona-glomerulosa`, `zona-fasciculada` e `zona-reticular` e o `capilar` coincidem. `capsula` e `veia-central` existem só na lâmina, o que não é problema.
  - `pancreas` (his-15) usa `ilhota-de-langerhans`, enquanto his-15, his-18 e emb-25 usam `ilhotas-pancreaticas`. A divergência é anterior a esta revisão e cabe ao his-15 ou à lâmina; não alterei.
  - A vinheta da his-18-q12 dizia "veia de parede espessa". Foi alinhada ao desenho e a Ross: veia central de parede irregular, com feixes excêntricos de músculo liso longitudinal.
- **Modelo 3D de néfron (futuro):** os ids do his-17 cobrem os segmentos em ordem anatômica, o que serve de base para as partes do modelo. São eles: `corpusculo-renal`, `glomerulo`, `capsula-glomerular`, `espaco-urinario`, `podocito`, `tubulo-contorcido-proximal`, `ramo-descendente-delgado`, `ramo-ascendente-delgado`, `ramo-ascendente-espesso`, `macula-densa`, `tubulo-contorcido-distal`, `ducto-coletor`, `arteriola-aferente`, `arteriola-eferente`, `vasa-recta`, `celulas-justaglomerulares` e `celulas-mesangiais-extraglomerulares`. Falta um id para o túbulo de conexão, citado no texto; só seria preciso se o modelo o desenhar.

## 4. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| **his-17** / estrutura `espaco-capsular` | id | `espaco-capsular` | `espaco-urinario` (nome e sinônimos mantidos) | Alinhar à lâmina `rim-cortex` (PARTES_RIM). Id novo, sem histórico de alunos e sem uso em outro tópico | menor | `sistemas-c.tsx` |
| his-17 / `borda-em-escova` | sinonimos | "planura estriada" | "orla em escova" | "Planura/borda estriada" é o termo do enterócito; o próprio his-02 distingue os dois | menor | Junqueira 14ª ed.; his-02 |
| his-17 / `diafragma-da-fenda` | sinonimos | "fenda de filtração" | "diafragma de fenda" | A fenda é o espaço entre os pedicelos; o diafragma é o que a fecha | menor | Ross 8ª ed., cap. 20 |
| his-17 resumo + `uretra` | resumo; definicao | Membranosa e esponjosa "com glândulas de Littré" | "…; na esponjosa, glândulas de Littré" | As glândulas de Littré ficam sobretudo na uretra esponjosa | menor | Ross 8ª ed., cap. 20; Junqueira 14ª ed., cap. 19 |
| his-17 / `sindrome-nefrotica` | descricao | Histopatologia "define o diagnóstico e o plano terapêutico" | "define o plano terapêutico e auxilia o diagnóstico etiológico" | Fidelidade ao texto do PCDT do adulto | menor | Portaria Conjunta nº 8/2020, item 5.1.2 |
| his-17 / `sindrome-nefrotica` (+ referências e incerteza) | mecanismo | Antinefrina "na síndrome nefrótica corticossensível" (artigo original não lido) | "…na doença de lesões mínimas e na síndrome nefrótica idiopática da criança, em geral corticossensível"; Watts 2022 e Hengel 2024 nas referências; incerteza removida | Conferido na fonte primária | menor | PMID 34732507; PMID 38804512 |
| his-17-q09 | enunciado | "Que achado… **confirma** o diagnóstico mais provável?" | "…**é esperado** no diagnóstico mais provável?" | O apagamento difuso dos pedicelos não é específico das lesões mínimas (ocorre também na GESF). A resposta (b) não muda | menor | Robbins 10ª ed., O rim |
| his-17 / referência PCDT pediátrico | obra; capitulo | Sem DOU; "6.2.2 — Tratamento do primeiro episódio"; antinefrina "da introdução" | "DOU nº 198, de 20/10/2026, seção 1, p. 88"; "6.2.2 — Inicial ou da primeira descompensação"; antinefrina no item 3.1 | Conferido no PDF e no DOU | menor | gov.br; in.gov.br |
| his-17 / notasDivergencia (nome da doença) | nota | AGM "(PCDT do adulto)" | + "que no item 6.3.1 acrescenta 'doença de lesões mínimas' entre parênteses" | Precisão | menor | Portaria Conjunta nº 8/2020 |
| his-17 / incertezas | incertezas | Hialinose eferente "de memória"; PCDT sem DOU; lâmina "futura" | Hialinose com apoio secundário (PMC12571060, PMC12547650); DOU conferido; lâmina `rim-cortex` e id alinhado | Incertezas resolvidas ou atualizadas | menor | ver seção 2 |
| **his-18-q03** | explicacao | (a): "prolactinomas desse tamanho costumam elevar muito mais a prolactina" | Mantido, mais: "um valor pouco elevado não basta para afastá-los: num macroadenoma de 3 cm ou mais, o PCDT manda repetir a dosagem em soro diluído para excluir o efeito gancho; aqui, a peça já resolveu a dúvida" | A vinheta (3 cm, prolactina < 100 ng/mL) é o cenário clássico do efeito gancho. A explicação ensinava um raciocínio que pode deixar passar um macroprolactinoma. O gabarito (d) não muda: a imuno-histoquímica afasta (a) | **importante** | PCDT da Hiperprolactinemia, item 3.3 |
| his-18-q14 | alternativa d; explicacao | "Tumores esporádicos **como este** não dão metástases a distância" | "Feocromocitomas esporádicos não dão metástases a distância" | A vinheta não estabelece que o tumor é esporádico (até 40% têm causa germinativa). O distrator continua falso | menor | Casey e Lussey-Lepoutre 2026 |
| his-18-q12 | contexto | "junto a uma veia de parede espessa" | "junto a uma veia de parede irregular, com feixes de músculo liso longitudinal" | Descrição de Ross (feixes excêntricos) e coerência com o desenho da lâmina `adrenal` | menor | Ross 8ª ed., cap. 21; `sistemas-c.tsx` |
| his-18-q08 | explicacao | Papilas, psamomas e metástase "completam o quadro típico (d)" | + "e afastam a NIFTP, neoplasia encapsulada e não invasiva com núcleos semelhantes" | Desde 2016, os núcleos sozinhos não bastam num nódulo encapsulado não invasivo | menor | OMS 5ª ed.; PMC12821139 |
| his-18 / `carcinoma-papilifero-tireoide` | mecanismo | "a citologia pode **reconhecê-lo**" | "pode **sugeri-lo** (sem distingui-lo da NIFTP, que exige a peça inteira)" | Mesmo motivo | menor | PMC10453903; PMC12821139 |
| his-18 / referência ATA 2015 | capitulo | "Recomendação 7 (PAAF…); Recomendação 9 (Bethesda)" | Descrição sem o número 7; Recomendação 9 (seção A11) "segundo citação secundária" | Texto integral não acessível nesta rede; o número 7 não pôde ser conferido | menor | PMC9574989 |
| his-18 / referência Endocrine Society 2008 | capitulo | "Recomendações 1 e 4" | "Resumo e recomendações iniciais (…)" | Só o resumo pôde ser lido; a numeração provável dos testes iniciais é 3.1, não 4 | menor | PMC2386281 (resumo) |
| his-18 / notasDivergencia (PitNET) + referências | nota | OMS 2022 usa PitNET "ao lado de 'adenoma'" | PitNET, "antes chamados adenomas", classificados pela linhagem (PIT1, TPIT, SF1); Asa et al. 2022 nas referências | A OMS 2022 substitui o termo, não o acrescenta | menor | PMID 35291028 |
| his-18 / notasDivergencia (NIFTP) | nota | "a diretriz ATA de 2025 os classifica como neoplasias de baixo risco" | OMS 5ª ed.: neoplasias de baixo risco; ATA 2025, recomendação 1: potencial maligno mínimo | Atribuição precisa | menor | PMC12821139 |
| his-18 / notasDivergencia (Hürthle) | nota | "classificações recentes preferem 'oncocíticas'" | "a OMS de 2022 abandonou o epônimo 'Hürthle' e adota 'oncocítico'" | Precisão | menor | PMC10453903 |
| his-18 / notasDivergencia (feocromocitoma) | nota | OMS 2022: "neoplasias com potencial metastático variável" | "neoplasias **malignas** com potencial metastático variável" e feocromocitoma = paraganglioma intra-adrenal | Fidelidade à fonte | menor | PMC13695349 |
| his-18 / notasDivergencia (folículo) | nota | "o histologia usa" | "a histologia usa" | Gramática | menor | — |
| his-18 / incertezas | incertezas | Cushing e ATA "texto integral lido no PMC"; OMS não lida; reticulina e Crooke "de memória" | O que esta revisão conseguiu ler (resumos e citações secundárias); PitNET no resumo de Asa 2022; reticulina e Crooke com apoio em acesso aberto | Registro honesto da leitura | menor | ver seção 2 |

## 5. Pontos para o revisor humano

1. **ATA 2015 e Endocrine Society 2008.** O texto integral não estava acessível por esta rede: não são de acesso aberto, e o efetch devolve só o resumo. O redator escreveu "texto integral lido no PMC", o que não consegui reproduzir. As afirmações do conteúdo são qualitativas e batem com os resumos. Vale conferir no PDF:
   - se "FNA is the procedure of choice" é a Recomendação 7 da ATA;
   - se os testes iniciais de Cushing são o item 3.1 de Nieman 2008.
2. **Ids das lâminas em desenho.** `tireoide` usa `celula-parafolicular` e `adrenal` usa `medula-adrenal`, enquanto his-18 e emb-25 usam `celulas-parafoliculares` e `medula-suprarrenal`. Decidir de que lado alinhar; a sugestão é a lâmina, por coerência com o emb-25 e com o termo "suprarrenal". Também está pendente `ilhota-de-langerhans` (lâmina `pancreas`) × `ilhotas-pancreaticas` (his-15, his-18 e emb-25).
3. **Id `espaco-urinario`.** O id do his-17 foi alinhado ao desenho da lâmina `rim-cortex`. Se o agente das lâminas tiver decidido usar `espaco-capsular`, basta reverter esse id no his-17, que não é usado em nenhum outro lugar.
4. **Hiperprolactinemia (his-18-q03).** Confirmar se o professor quer o efeito gancho na explicação, que acrescentei, ou se prefere mudar a vinheta para um macroadenoma menor que 3 cm, o que tiraria a questão do cenário de efeito gancho.
5. **Terminologia.** Decidir se o conteúdo passa a usar "PitNET" e "oncocítico" (OMS 2022) ou mantém "adenoma" e "Hürthle" (PCDT e livros), como hoje. As notas registram as duas formas; nenhuma questão é anulada por isso.
6. **Capítulos citados de memória.** Junqueira 14ª ed. (19 e 20, pela numeração da 13ª), Ross 8ª ed. (20 e 21) e Guyton & Hall 14ª ed. (19, 26–29, 75–80) são compatíveis com a minha memória das obras, mas não foram vistos no sumário impresso. Em Robbins: a frase da hialinose eferente, Crooke, reticulina e a preservação da glomerulosa.
7. **Frequências dos PCDTs.** 70–90% de lesões mínimas, ~85% de remissão, ~40% de prolactinomas e a série de São Paulo estão no texto dos PCDTs, mas a literatura original que eles citam não foi lida.
8. **Selo.** Até a conferência médica, os dois tópicos devem aparecer com "Revisado por IA · conferência médica pendente". A 2ª etapa (revisor transversal de outra área) ainda não foi feita.

## 6. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina
AssertionError: pulmao: expected false to be true
 Test Files  1 failed | 8 passed (9)
      Tests  1 failed | 83 passed (84)
```

A única falha é a de lâminas: o desenho `pulmao` já existe em `sistemas-c.tsx`, mas a entrada correspondente ainda não está em `laminas-sistemas-c.json`, que segue vazio. É trabalho em andamento de outro agente, como previsto no pedido. Não tem relação com os dois tópicos.

Também conferido por script, contra as cópias anteriores às edições:
- ids e gabaritos iguais, exceto a estrutura `espaco-capsular` → `espaco-urinario`;
- `revisao.humano` = `null`;
- uma entrada nova em `revisao.agentes` em cada arquivo.

Nenhum commit foi feito.
