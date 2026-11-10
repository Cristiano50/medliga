# Revisão HS19–20 — histologia (sistema reprodutor masculino e feminino)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia), com a conferência de fonte primária (3ª verificação do protocolo) feita nesta mesma revisão para os pontos pedidos.
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Fontes lidas pelo Bash com `curl`, sem WebFetch.
- Arquivos editados: `content/histologia/topicos/his-19-reprodutor-masculino.json` e `content/histologia/topicos/his-20-reprodutor-feminino.json`. Nenhum outro arquivo de conteúdo foi alterado.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.
- Ids e gabaritos: nenhum id foi alterado (tópicos, estruturas, eventos, correlações, questões, alternativas, itens, lado esquerdo dos pares). Nenhum `correta` ou `ordemCorreta` foi alterado. Conferi por script contra a versão original, salva antes da revisão.
- Observação sobre o git: o commit `9d7f661` (10:36) incluiu um estado intermediário destes dois arquivos, feito por quem orquestra a branch, enquanto a revisão ainda estava em andamento. O estado final está na árvore de trabalho. Não fiz commit.

## 1. Resumo

Revisei integralmente os dois tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, 56 questões, referências, notas de divergência e incertezas. O conteúdo estava correto e cuidadoso. **Não encontrei gabarito errado nem fato errado em resposta de questão.** As três correções importantes são:
- uma definição imprecisa: o ovócito primário estava "no centro" dos folículos antrais, mas nesses folículos fica em posição excêntrica, no cumulus;
- um V/F que ficaria verdadeiro para mulheres imunossuprimidas;
- um par de "associar" com margem de dúvida.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-19 Reprodutor masculino | 28 | 0 | 0 | 6 | 6 | aprovado-com-correcoes |
| his-20 Reprodutor feminino e mama | 28 | 0 | 3 | 7 | 10 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **3** | **13** | **16** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, precisão, referência.

Checagens feitas por script:
- **Letras corretas** das 16 questões de múltipla escolha de cada tópico: a 4, b 4, c 4, d 4. Não houve redistribuição.
- **Pista de comprimento:** a alternativa correta é a mais longa em 5 de 16 questões em cada tópico (31%, perto do acaso de 25%). A razão entre o comprimento da correta e a média dos distratores fica entre 0,56 e 1,41. As duas razões mais altas são his-20-q02 (1,41) e his-19-q06 (1,32), e nas duas as alternativas são nomes curtos e equivalentes. Não há pista a corrigir.
- **Explicações:** todas citam a letra de cada alternativa.
- **Tipos:** cada tópico tem 16 de múltipla escolha (12 com contexto clínico ou de lâmina), 6 V/F (3 verdadeiras e 3 falsas), 3 de ordenar e 3 de associar.
- **Linhas do tempo:** his-19 tem 12 eventos e his-20 tem 7, todos com `ordem` distinta. A sequência é inequívoca nas fontes.

## 2. Verificação dos itens 1 e 2 (texto integral)

### Item 1 — Rastreamento do câncer do colo do útero: CONFIRMADO

| Afirmação do redator | Resultado | Fonte e trecho decisivo |
|---|---|---|
| Parte I = Portaria Conjunta SAES/SECTICS nº 13/2025 | **Confirmado.** É de 29/07/2025 e foi publicada no DOU de 18/08/2025, seção 1, p. 70 | PDF: `https://www.gov.br/saude/pt-br/assuntos/pcdt/c/cancer-de-colo-do-utero-parte-I` (o link serve o PDF direto; 64 p., `pdftotext -layout`). Cabeçalho: "PORTARIA CONJUNTA SAES/SECTICS Nº 13, DE 29 DE JULHO DE 2025 … Parte I - Rastreamento organizado utilizando testes moleculares para detecção de DNA-HPV Oncogênico". DOU: busca em `www.in.gov.br/consulta/-/buscar/dou` ("pubDate":"18/08/2025", "numberPage":"70") |
| Teste de DNA-HPV primário dos 25 aos 64 anos | **Confirmado** | Figura 1, obs. 1: "O teste deve ser realizado em mulheres entre 25 e 64 anos de risco padrão". Rec. 1: teste "com genotipagem parcial ou estendida como método de rastreamento primário". Rec. 9: início aos 25 anos |
| Intervalo de 5 anos se negativo | **Confirmado** | Rec. 18: "repetição do teste de DNA-HPV oncogênico em intervalos de cinco anos, após resultado negativo (forte, … certeza alta)" |
| HPV 16/18 → colposcopia; outros → citologia reflexa; ASC-US+ ou insatisfatória → colposcopia; 12 meses após triagem negativa; fim após 60 anos com teste negativo | **Confirmado** | Recs. 19, 20, 22 e 12 ("encerrar … quando o último teste acima dos 60 anos apresentar resultado negativo") |
| Citologia trienal onde o teste ainda não existe | **Confirmado** | Rec. 28: "manter o rastreamento utilizando-se a citologia trienal após dois resultados anuais consecutivos negativos" |
| (não citado pelo redator) | **Acrescentado** | Rec. 39: intervalo de **3 anos** após teste negativo para "mulheres vivendo com HIV/aids e em outras situações de imunodepressão ou imunossupressão". Rec. 40: colposcopia com qualquer tipo detectado. Por causa da Rec. 39, a q21 precisava de "risco padrão" |
| Parte II = "Portaria Conjunta nº 105/2026", com terminologia LAST | **Confirmado.** A sigla impressa é **SAES/SCTIE** (e não SECTICS), igual no PDF e no DOU. Data de 20/10/2026; publicada no DOU de 28/10/2026, edição 204, seção 1, p. 129 | PDF: `https://www.gov.br/saude/pt-br/assuntos/pcdt/c/cancer-de-colo-do-utero-parte-II` (154 p.). Cabeçalho: "PORTARIA CONJUNTA SAES/SCTIE Nº 105, DE 20 DE OUTUBRO DE 2026". DOU: `https://www.in.gov.br/web/dou/-/portaria-conjunta-saes/sctie-n-105-de-20-de-outubro-de-2026-740663243` (publicado em 28/10/2026, edição 204, seção 1, página 129) |
| LSIL (NIC1), HSIL (NIC2), HSIL (NIC3); p16 | **Confirmado** | Quadro 2, "Diagnósticos histopatológicos segundo a Terminologia LAST". LSIL (NIC1): "coilocitose, atipia predominantemente limitada ao terço inferior …, maturação preservada e mitoses predominantemente na camada basal". HSIL (NIC2): "aproximadamente até dois terços". HSIL (NIC3): "mais de dois terços … ou de toda a espessura". p16: "auxiliar em casos morfologicamente equívocos, especialmente na diferenciação entre LSIL e HSIL" |
| ZT tipo 3, mais comum em mulheres mais velhas | **Confirmado** | "A ZT tipo 3, caracterizada por uma junção escamocolunar não completamente visível no canal endocervical …"; "a ZT tipo 3 é mais frequentemente encontrada em mulheres mais maduras" |

Conclusão: números, datas e recomendações conferem. A incerteza do redator sobre o DOU foi resolvida e registrada em `incertezas`. As referências passaram a trazer os dados do DOU.

### Item 2 — Renomeação da SOP como PMOS: CONFIRMADO (mantida, com redação ajustada)

| Fonte | Como foi lida | Trecho decisivo |
|---|---|---|
| **Publicação primária:** Teede HJ et al.; Global Name Change Consortium. *Lancet* 2026;407(10545):2329-39, PMID 42119588 (não estava citada pelo redator) | Resumo pelo E-utilities. O texto integral não abriu: www.thelancet.com não conecta nesta rede, e o artigo não está no Europe PMC | "polyendocrine metabolic ovarian syndrome was the consensus new name"; "multistep global consensus process … 56 leading academic, clinical, and patient organisations"; "A co-designed global implementation strategy, including a transition period … is under way" |
| Bahri-Khomami M et al. *Am J Obstet Gynecol* 2026;235(5):999-1002, PMID 42665241 | Resumo (E-utilities); a citação confere | "has been renamed … following a multistep international consensus process endorsed by 56 professional and patient organizations"; "Diagnostic criteria remain unchanged" |
| Teede HJ et al. *Fertil Steril* 2026, PMID 42679945 | Resumo (E-utilities); a citação confere | "delivered a 97% consensus on the name PMOS" |
| Soares-Júnior JM et al. *Rev Bras Ginecol Obstet* 2026;48:e-rbgoedt4, PMC13690375 (DOI 10.61622/rbgo/2026rbgoedt4) | **Texto integral** pelo Europe PMC (`/rest/PMC13690375/fullTextXML`); autores e localizador conferem | "an international initiative proposed changing its name to Polyendocrine Metabolic Ovarian Syndrome (PMOS)"; "diagnostic criteria continue to follow the recommendations of the 2023 International Guideline … at least two of the three Rotterdam criteria"; "what are observed are not cysts, but rather follicles that have arrested their development". O editorial também critica o termo "Polyendocrine" e a ênfase em "Metabolic" |
| Teede HJ et al. *J Clin Endocrinol Metab* 2023;108(10):2447-69, PMC10505534 | **Texto integral** (Europe PMC) | Dois de três critérios, com o AMH como alternativa à ultrassonografia (1.5.5: "Either serum AMH or ultrasound may be used … both tests should not be performed"); 1.4.6: ultrassonografia não recomendada em adolescentes; 1.5.4: "Serum AMH should not yet be used in adolescents"; 1.11.2: informar o risco endometrial, "routine screening is not recommended" |

Conclusão: a menção à PMOS **fica**. Ajustes feitos:
- A correlação passou a dizer que o consenso "definiu o novo nome …, em implantação gradual e sem mudança dos critérios diagnósticos".
- A referência agora cita a publicação primária (Lancet).
- A nota de divergência registra as críticas do editorial da RBGO.
- Não encontrei tradução oficial para o português; o tópico continua a usar "SOP", o que me parece adequado.

## 3. Pontos do redator: conferência um a um

| Ponto | Resultado |
|---|---|
| Espermatogônias A escura/clara × A/B | Mantido. Ad (reserva), Ap (renovação, origina B) e B estão de acordo com Ross e com Amann 2008 ("A(pale)-spermatogonia become committed to proliferate", resumo). A afirmação de que Junqueira usa só A e B é compatível com a minha leitura do livro, mas não pôde ser conferida no impresso. A subdivisão só aparece como distrator (q02), com morfologia correta na explicação. |
| Duração da espermatogênese | Heller & Clermont 1963 (PMID 13953583, resumo): "one cycle of the seminiferous epithelium lasts 16 days, and the whole of spermatogenesis … approximately 64 days". Amann 2008 (PMID 18497337, resumo): "the accepted value might be in error by approximately 6 days". **Corrigido** no resumo: "cerca de quatro ciclos" equivalia a 64 dias e não cobria os 74 dias adotados em emb-02. Agora diz "cerca de 2 meses (64–74 dias; ver emb-02), ou seja, quatro a cinco ciclos". Nenhum número é resposta de questão. |
| Arranjo dos estágios do ciclo seminífero | Mantido. O conteúdo usa só o ponto comum às descrições helicoidal e em mosaico: vários estágios por corte transversal no homem e um por segmento no rato. A q19 (V) vale nos dois modelos. |
| Epitélio da glândula seminal | "Cilíndrico secretor" é compatível com Ross (pseudoestratificado cilíndrico) e com Junqueira (cúbico ou pseudoestratificado cilíndrico; de memória). A nota foi detalhada e nenhuma questão cobra a diferença. O pigmento lipocrômico da vinheta da q09 está correto. |
| Origem da zona pelúcida | Mantida como divergência (ovócito × ovócito e células foliculares; emb-02 cita os dois). Não é cobrada. |
| Número de lobos da mama | 15–25 (Junqueira) × 15–20 (Ross). Mantido no resumo; não é cobrado. |
| LAST × NIC | Confirmado no Quadro 2 da Parte II (ver item 1). A q09 traz as duas formas e é inequívoca: mais de 2/3 da espessura corresponde a HSIL (NIC3). Na explicação, as mitoses da LSIL passaram a "predominantemente" basais, como no Quadro 2. |
| Hiperplasia endometrial (OMS 2020) | Confirmado no texto integral de revisões abertas. Giannella et al., *Cancers* 2024;16(5):914 (PMC10930610): "The 2014 WHO classification distinguished EH into two categories: hyperplasia without atypia and atypical endometrial hyperplasia (AEH)/EIN … this subdivision was also maintained in the most recent WHO classification version of 2020", com PTEN entre as alterações. Niu et al., *Cancers* 2024;16(6):1159 (PMC10968747): "In the WHO 2020 classification, the only recognized morphological precancerous lesion is atypical hyperplasia/endometrioid intraepithelial neoplasia (AH/EIN)". |
| "Tipo não especial" | Confirmado. Apostol et al., *Hered Cancer Clin Pract* 2025;23:20 (PMC12400667, texto integral) cita a 5ª ed. da OMS, com "invasive breast carcinoma of no special type (IBC-NST)". Wilson et al., *Front Oncol* (PMC7844138, texto integral) usa "invasive ductal carcinoma of no special type". O livro da OMS não foi lido (é pago). |
| GCNIS | Confirmado nos resumos de Moch 2016 (PMID 26935559) e Berney 2022 (PMID 35502823): "Germ cell neoplasia in situ (GCNIS) … WHO-recommended term"; "retaining … the term 'germ cell neoplasia in situ'". O tumor espermatocítico não deriva de GCNIS (Moch). Pettersson 2007 (PMID 17476009): RR 2,23 com cirurgia antes dos 13 anos e 5,40 com cirurgia aos 13 anos ou depois, o que confirma "risco menor, mas não igual ao da população". |
| his-19-q16: frutose na vinheta | **Confirmada e mantida.** Cai & Li, *Front Genet* 2022;13:775123 (PMC8873976, texto integral): "low ejaculate volume (<1.0 ml …), … azoospermia, pH < 7.0, seminal fructose <13 μmol/ejaculation". Shamohammadi et al., *Basic Clin Androl* 2025 (PMC12175365, texto integral): "all patients had abnormal semen fructose" (47 casos de CBAVD). EAU (uroweb, texto integral): "semen volume < 1.0mL and acidic pH < 7.0". A incerteza foi retirada e a referência, acrescentada. |
| Marcadores imuno-histoquímicos | Confirmados. GCNIS: Rajpert-De Meyts et al., *BJU Int* 2022;130(5):646-54 (PMC9796833, texto integral): "placental‐like alkaline phosphatase (PLAP), OCT3/4 factor … marking GCNIS cells". Próstata: Inamura, *Oncotarget* 2018 (PMC5865702, texto integral): "TP63 (p63) and high-molecular weight cytokeratins, which are not detectably expressed by adenocarcinomas"; "PSA, PAP, high-molecular-weight cytokeratin (34βE12), TP63, and AMACR are helpful". A incerteza foi retirada e as referências, acrescentadas. |
| EAU (relida em `https://uroweb.org/guidelines/sexual-and-reproductive-health/chapter/male-infertility`) | Confirmado:<br>• "Perform simultaneous testicular biopsy for the detection of intratubular germ cell neoplasia in situ … if undescended testes are corrected in adulthood. Strong";<br>• "Patients with isolated, clinical right varicocele should be examined further for abdominal, retroperitoneal and congenital pathology";<br>• "Usually, adequate sperm numbers and quality will improve over a six to twelve-month period from cessation" (anabolizantes);<br>• "Testosterone therapy is contraindicated in infertile males. 1a";<br>• "Testis biopsies … without performing simultaneously a therapeutic sperm retrieval are not recommended". Por este último trecho, a vinheta da q13 foi ajustada (ver tabela). |
| Carcinoma lobular | Confirmado no texto integral de Wilson et al. (PMC7844138): "single file pattern", "concentric manner", "intracytoplasmic vacuole", "loss of … E-cadherin", "strongly ER positive", "challenging to detect both physically and with current standard imaging", CDH1 germinativo na síndrome do câncer gástrico difuso hereditário. A citação "Front Oncol. 2021;10:591399" está como o PubMed a exibe (eCollection 2020); não foi mudada. |
| Coerência com emb-02, emb-03, emb-04, emb-09, emb-17 e his-01 | Origens embrionárias (Sertoli do epitélio celômico; Leydig do mesênquima; dúctulos eferentes dos túbulos mesonéfricos; epidídimo, deferente e glândula seminal do ducto mesonéfrico; próstata e bulbouretrais do seio urogenital; tuba paramesonéfrica) conferem com emb-17. Os ids de estruturas comuns são os de emb-02. A nomenclatura folicular (secundário = antral) segue emb-02. A membrana placentária confere com emb-09. HER2 e receptores remetem a his-01. **Corrigido:** "capacidade de fertilizar" no epidídimo passou a remeter à capacitação no trato feminino (emb-03). |
| Coerência com as lâminas | Até as 10:40 de 10/11 não havia lâmina `testiculo`, `ovario` nem `utero-proliferativo` em `content/histologia/laminas*.json` nem nos desenhos (`src/modules/histologia/laminas/`). Não houve id a alinhar. Ver a seção 5. |

## 4. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-20 / `ovocito-primario` | definicao | "…parada na prófase I, no centro dos folículos primordiais, primários e antrais" | "…fica no centro dos folículos primordiais e primários e, no folículo antral, em posição excêntrica, no cumulus oophorus" | No folículo antral o ovócito é excêntrico, sustentado pelo cumulus (o próprio resumo e a q24 dizem isso) | importante | Ross 8ª ed., cap. 23; Junqueira 14ª ed., Aparelho reprodutor feminino |
| his-20-q21 | enunciado; explicacao; referencia | "uma mulher de 40 anos com teste negativo deve repeti-lo em 3 anos" (F) | "uma mulher de 40 anos, **de risco padrão**, …". A explicação cita a Rec. 39 (3 anos em HIV e imunossupressão) e a Rec. 28 (citologia trienal) | Sem o risco padrão, a afirmação seria verdadeira para imunossuprimidas. Gabarito mantido (F) | importante | Diretrizes Parte I, Recs. 18, 28 e 39 |
| his-20-q26 | pares (direita da tuba); explicacao | Tuba → "Cilíndrico simples com células ciliadas e secretoras" | "…, sobre pregas longitudinais, sem glândulas". A explicação diz que o endométrio também tem células ciliadas e secretoras, mas forma glândulas | O epitélio de superfície do endométrio também é cilíndrico simples com células ciliadas e secretoras, e o par tinha margem de dúvida | importante | Ross 8ª ed., cap. 23 |
| his-20 / `hpv-zona-transformacao-rastreamento` | descricao | Condutas sem distinção de risco; "conduta após teste positivo … Parte II (Portaria Conjunta nº 105/2026)" | "No risco padrão: …". Acrescentado: "Mulheres vivendo com HIV ou imunossuprimidas repetem o teste negativo em 3 anos e vão à colposcopia com qualquer tipo oncogênico". Agora diz "conduta após a triagem positiva … (Portaria Conjunta SAES/SCTIE nº 105/2026)" | Precisão; coerência com a q21; sigla como impressa | menor | Parte I, Recs. 39–40; Parte II, cabeçalho e DOU |
| his-20 | pontosChave[9] | "Rastreamento no SUS (2025): …" | "Rastreamento no SUS (diretrizes de 2025, risco padrão): …" | Precisão | menor | Parte I, Figura 1 |
| his-20-q09 | explicacao | LSIL: "as mitoses ficam na camada basal" | "…ficam predominantemente na camada basal" | Texto do Quadro 2 | menor | Parte II, Quadro 2 |
| his-20 / `arteria-espiralada` | sinonimos | "artéria helicina do endométrio" | "artéria helicoidal" | "Helicinas" são as artérias do pênis (his-19); para o endométrio, o termo usual é "espiralada (helicoidal)" | menor | Junqueira 14ª ed.; Ross 8ª ed. |
| his-20 / `sindrome-ovarios-policisticos` | descricao; notasDivergencia | "um processo internacional de consenso renomeou a condição como … PMOS, sem mudar os critérios" | "…com organizações acadêmicas, clínicas e de pacientes, definiu o novo nome … (PMOS), em implantação gradual e sem mudança dos critérios diagnósticos". A nota registra as críticas do editorial da RBGO | A fonte primária fala em nome de consenso com período de transição; a RBGO, em "proposta" | menor | Lancet 2026 (PMID 42119588); RBGO 2026 (PMC13690375) |
| his-20 | referencias | AJOG + Fertil Steril; Partes I e II sem dados do DOU; OMS 2020 "citada pela literatura secundária" | Lancet 2026 (primária) acrescentado; DOU nas Partes I e II; Recs. 39–40 no capítulo da Parte I; OMS 2020 com as revisões lidas no texto integral | Rastreabilidade | menor | ver seção 2 |
| his-20 | incertezas | "Conferir no Diário Oficial …"; PMOS só por resumos e RBGO; OMS por resumos | DOU resolvido (com dados); PMOS com a fonte primária e a observação de que o Lancet não abriu; OMS 2020 e 2019 com textos integrais de revisões | Registro da conferência | menor | ver seção 2 |
| his-19 | resumo; notasDivergencia | "a espermatogênese completa leva cerca de quatro ciclos" | "…leva cerca de 2 meses (64–74 dias; ver emb-02), ou seja, quatro a cinco ciclos". A nota de duração foi atualizada | Quatro ciclos de 16 dias são 64 dias e não cobrem os 74 dias da faixa de emb-02 (74/16 ≈ 4,6) | menor | Heller & Clermont 1963; Amann 2008; emb-02 |
| his-19 | resumo | Epidídimo: "adquirem motilidade progressiva e capacidade de fertilizar" | + "(a capacitação ocorre depois, no trato genital feminino; ver emb-03)" | Coerência com emb-03 (q02 e q19 de emb-03 separam maturação de capacitação) | menor | Moore 11ª ed., cap. 2; Ross 8ª ed., cap. 22 |
| his-19-q08 | explicacao | Células principais "que absorvem grande parte do fluido" | "…boa parte do fluido que resta depois dos dúctulos eferentes" | O próprio tópico atribui aos dúctulos eferentes a reabsorção da maior parte do fluido | menor | Ross 8ª ed., cap. 22 |
| his-19-q13 | contexto | "A biópsia desse testículo mostra…" (biópsia diagnóstica na investigação de infertilidade) | "A biópsia desse testículo, colhida durante a extração de espermatozoides para reprodução assistida, mostra…" | A EAU, citada no tópico, desaconselha biópsia testicular sem extração terapêutica simultânea. Diagnóstico e gabarito inalterados | menor | EAU Male Infertility (uroweb) |
| his-19 | notasDivergencia | "as descrições variam entre cilíndrico simples e pseudoestratificado" | Ross: pseudoestratificado cilíndrico; Junqueira: cúbico ou pseudoestratificado cilíndrico (de memória). "Cilíndrico secretor" é compatível com as duas | Precisão da nota | menor | Ross 8ª ed.; Junqueira 14ª ed. |
| his-19 | incertezas; referencias | Incertezas sobre a frutose (q16) e os marcadores (OCT3/4, PLAP, p63, AMACR) | Incertezas retiradas (confirmadas). Acrescentadas Cai & Li 2022, Rajpert-De Meyts 2022 e Inamura 2018. A incerteza da EAU registra a releitura | Conferência no texto integral | menor | ver seção 3 |

## 5. Pontos para o revisor humano

1. **Capítulos citados de memória.** Junqueira 14ª ed. (caps. 21 e 22, pela numeração da 13ª) e Ross 8ª ed. (caps. 22 e 23) não foram conferidos no impresso. O mesmo vale para as descrições atribuídas a cada livro nas notas: espermatogônias A/B em Junqueira, epitélio da glândula seminal, origem da zona pelúcida e número de lobos da mama.
2. **Lancet 2026 (PMOS).** Só o resumo foi lido; o texto integral não abre nesta rede. Decidir se a correlação deve chamar a condição de "renomeada" (AJOG) ou de nome "proposto" (RBGO). O título da correlação usa "renomeada em 2026 como PMOS".
3. **Livros da OMS** (Female Genital Tumours 2020; Breast Tumours 2019) não foram lidos. A nomenclatura foi conferida em revisões abertas.
4. **Resumo do his-19 acima do limite.** Tem 966 palavras; a especificação pede 300–900. Já tinha 947 antes da revisão e subiu 19 palavras com as correções de coerência. Decidir se o redator deve enxugar (sugestão: o parágrafo do pênis ou o das glândulas acessórias).
5. **Ids para as lâminas que estão sendo desenhadas.** Para não precisar mudar ids depois:
   - `testiculo`: `tubulo-seminifero`, `celula-de-sertoli`, `espermatogonia`, **`espermatocito`** (his-19 usa um id único, com sinônimos; emb-02 usa `espermatocito-primario`/`espermatocito-secundario`), `espermatide`, `espermatozoide`, `celula-de-leydig`, `celula-mioide-peritubular`, `tunica-albuginea`;
   - `ovario`: `epitelio-superficial-do-ovario`, `cortex-ovariano`, `medula-ovariana`, `foliculo-primordial`, `foliculo-primario`, `foliculo-secundario`, `foliculo-maduro`, `ovocito-primario`, `zona-pelucida`, `celulas-da-granulosa`, `teca-interna`, `teca-externa`, `cumulus-oophorus`, `corona-radiata`, `foliculo-atresico`, `corpo-luteo`, `corpo-albicans`;
   - `utero-proliferativo`: `endometrio-funcional`, `endometrio-basal`, `glandula-endometrial`, `estroma-endometrial`, `arteria-espiralada`, `miometrio`.
   
   Se a lâmina usar `espermatocito-primario`, a decisão é de arquitetura: mudar o id do tópico (e registrar) ou o da lâmina.
6. **Corpo lúteo.** "Regride em cerca de duas semanas" (os livros dão 10–14 dias) e a omissão de corpos de Call-Exner e células hilares foram mantidas como o redator registrou.
7. **Nível clínico num tópico de histologia.** As condutas de rastreamento (q10, q21), da EAU (q14, q16) e a PMOS estão em correlações e questões de dificuldade 3–5. Decidir se ficam ou se devem ser reduzidas ao mecanismo, como em decisões anteriores (seção G2 de `docs/pendencias-conferencia-medica.md`).

## 6. Testes

- `npm run validar-conteudo`: **OK** ("Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441").
- `npx vitest run`: 83 de 84 testes passam. A única falha é `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, com a mensagem "pulmao: expected false to be true". O desenho `pulmao` já existe em `sistemas-c.tsx`, mas a lâmina ainda não está em `laminas-sistemas-c.json`. É trabalho em andamento de outros agentes e não tem relação com his-19 nem his-20; foi ignorada, como combinado. Os demais testes de conteúdo passam, entre eles o de ids das alternativas em ordem a, b, c, d.
