# Conferência de fontes primárias: bloco literatura e diretrizes internacionais

- Agente: `conferencia-fontes-v1` · Data: 2026-11-09
- Tarefa: conferir, com a rede liberada, os artigos citados de memória e as diretrizes internacionais deixadas "a conferir no texto integral".
- Arquivos editados (só estes):
  - `content/embriologia/topicos/`: `emb-21-regulacao-molecular.json`, `emb-22-crista-neural.json`, `emb-16-urinario.json`, `emb-13-cardiovascular.json`, `emb-05-semana2.json`;
  - `content/histologia/topicos/`: `his-08-sangue-hematopoese.json`, `his-01-metodos.json`.
- Campos alterados: só `referencias`, `incertezas`, `notasDivergencia` (emb-21 e emb-22) e `revisao.agentes`.
  - Nenhuma questão foi tocada: `questoes` está idêntico ao `HEAD` nos sete arquivos (conferido por script).
  - Também não mudaram `resumo`, `pontosChave`, `estruturas`, `eventos` e `correlacoesClinicas`.
  - `revisao.humano` continua `null`. Em cada arquivo foi **acrescentada** uma entrada `conferencia-fontes-v1` em `revisao.agentes`.
- Método:
  - Metadados (autores, título, periódico, ano, volume, páginas, DOI): API E-utilities do PubMed (`esearch`/`esummary`/`efetch`).
  - Textos abertos: `efetch db=pmc` e Europe PMC `fullTextXML`.
  - Diretrizes: PDFs com `curl` + `pdftotext -layout` (KDIGO, ISUOG) e a página do capítulo no uroweb.org (EAU).
  - Os livros-texto não foram conferidos (não acessíveis) e ficaram como estavam.
- **Situação: conferência por agente (IA).** Nada aqui substitui a conferência médica.

## 1. Resumo

| # | Ponto | Resultado | Mudança |
|---|---|---|---|
| 1 | Citações de periódico nos 7 arquivos | **44 citações conferidas** (43 de periódico e a diretriz EAU): 33 corretas; 4 com erro (títulos de Kalish 2017 e de Reddy 2014; fascículo da KDIGO 2026; a referência da EAU atribuía a regra de Weigert–Meyer à diretriz e não dava a edição); 7 com dado faltando (ACOG 2018, Ngan 2021, Usui 2019, Allison 2020, Wolff 2018, Wolff 2023, Wells 2015) | DOI e PMID em todas as de periódico; 6 referências novas (Takahashi 2006 e 2007; Fernbach 1997; Siddiqui 2025; Hammond 2010; Wolff 2013) |
| 2 | Afirmações que dependem dos artigos | **Nenhuma afirmação do texto do aluno contradita.** Wallace & Burns: semanas pós-concepção. Johansson 2015: dados humanos indiretos (confirmado). Legius 2021 não diz "cerca de metade" | Incertezas de Jones 2008 e Wallace & Burns resolvidas; atribuição a Legius corrigida na incerteza |
| 3 | Mola 46,YY (emb-05-q30) | **Não esclarecido**: nenhuma fonte primária com dados; só revisões ("presumed to be non-viable"; "yet to be described") | Formulação cautelosa mantida; incerteza completada com o que foi lido |
| 4 | KDIGO 2026, anemia na DRC (his-08) | **Confirmado** no texto integral (publicada em Kidney Int 2026;109(1S):S1–S99) | Referência corrigida (fascículo 1S, páginas, DOI, PMID); texto do aluno sem mudança |
| 5 | Weigert–Meyer na diretriz EAU (emb-16-q26) | **Parcialmente confirmado**: o capítulo da EAU 2026 confirma o padrão clínico, mas **não cita a regra** | Referência da EAU corrigida (edição 2026; conteúdo real); regra documentada em Siddiqui 2025 e Fernbach 1997 |
| 6 | ISUOG 2023, rastreamento cardíaco fetal (emb-13) | **Confirmado** no texto integral, junto com a Diretriz Brasileira de Cardiologia Fetal 2019 | DOI/PMID; itens (2) e (5) da incerteza resolvidos |
| 7 | ASCO/CAP: HER2 e RE/RP, fixação (his-01) | **Confirmado** nas diretrizes de 2010 (RE/RP) e 2013 (HER2); 2020 só por fonte secundária. **Erro na incerteza**: a passagem de 48 para 72 h foi em 2013, não em 2018 | Referências Hammond 2010 e Wolff 2013 acrescentadas; incerteza reescrita; texto do aluno sem mudança |

| Arquivo | Veredito | Correções |
|---|---|---|
| emb-21 | aprovado-com-correcoes | 1 título (Kalish); DOI/PMID em 5 referências; 2 referências novas; incerteza de Kalish passou a nota de divergência |
| emb-22 | aprovado-com-correcoes | DOI/PMID em 11 referências (12 artigos) e em Wells; 2 incertezas resolvidas (Jones; Wallace & Burns); atribuição a Legius corrigida |
| emb-16 | aprovado-com-correcoes | Referência EAU corrigida; DOI/PMID em 2; 2 referências novas; incertezas completadas |
| emb-13 | aprovado-com-correcoes | DOI/PMID e capítulo da ISUOG; DOI/PMID da Diretriz Brasileira; incerteza (2) e (5) resolvida |
| emb-05 | aprovado-com-correcoes | Título de Reddy (faltava ACOG); dados de ACOG, Ngan e Usui completados; DOI/PMID em 6; incerteza 46,YY completada |
| his-08 | aprovado-com-correcoes | KDIGO corrigida; DOI/PMID em 4 referências; incerteza atualizada |
| his-01 | aprovado-com-correcoes | Allison 2020, Wolff 2018 e Wolff 2023 completadas; 2 referências novas; incerteza corrigida (2013, não 2018) |

**Fora dos meus arquivos.** As citações da lista que não estão neles não foram editadas:
- Ginhoux 2010 (his-10);
- Grossmann 1997 (emb-03);
- Antonarakis 1992 (emb-02);
- Zaragoza 2000 em emb-03;
- Bergmann 2009 e Muretta 2015 (his-09; não constam de his-08).

## 2. Tabela de citações (antes → depois)

"OK" = autores, título, periódico, ano, volume e páginas conferem com o PubMed. Em todas as linhas, DOI e PMID foram acrescentados ao texto da referência.

| Arquivo | Citação | Antes → depois | PMID | DOI |
|---|---|---|---|---|
| emb-21 | Goriely & Wilkie. Am J Hum Genet 2012;90(2):175–200 | OK | 22325359 | 10.1016/j.ajhg.2011.12.017 |
| emb-21 | Dubourg et al. Am J Med Genet C 2018;178(2):258–269 | OK | 29785796 | 10.1002/ajmg.c.31619 |
| emb-21 | Cooper et al. Nat Genet 2003;33(4):508–513 | OK | 12652302 | 10.1038/ng1134 |
| emb-21 | Kalish et al. Clin Cancer Res 2017;23(13):e115–e122 | título "predisposition **for** Wilms tumors" → "predisposition **to** Wilms tumors" | 28674120 | 10.1158/1078-0432.CCR-17-0710 |
| emb-21 | Shapiro et al. Am J Respir Crit Care Med 2018;197(12):e24–e39 | OK | 29905515 | 10.1164/rccm.201805-0819ST |
| emb-21 | Takahashi & Yamanaka. Cell 2006;126(4):663–676 (nota de divergência) | OK; acrescentada a `referencias` (q16) | 16904174 | 10.1016/j.cell.2006.07.024 |
| emb-21 | Takahashi et al. Cell 2007;131(5):861–872 (nota) | OK; acrescentada a `referencias` (q16) | 18035408 | 10.1016/j.cell.2007.11.019 |
| emb-21 | Yu et al. Science 2007 (nota) | OK (318(5858):1917–1920), sem mudança | 18029452 | 10.1126/science.1151526 |
| emb-21 | Kessel & Gruss. Cell 1991 (nota) | OK (67(1):89–104), sem mudança | 1680565 | 10.1016/0092-8674(91)90574-i |
| emb-21 | Halder, Callaerts & Gehring. Science 1995 (nota) | OK (267(5205):1788–1792), sem mudança | 7892602 | 10.1126/science.7892602 |
| emb-22 | Johansson et al. Development 2015;142(20):3519–3528 | OK | 26395490 | 10.1242/dev.126581 |
| emb-22 | Wallace & Burns. Cell Tissue Res 2005;319(3):367–382 | OK | 15672264 | 10.1007/s00441-004-1023-2 |
| emb-22 | Jones et al. Nat Med 2008;14(2):125–133 | OK | 18246078 | 10.1038/nm1725 |
| emb-22 | Óskarsdóttir et al. Genet Med 2023;25(3):100338 | OK | 36729053 | 10.1016/j.gim.2022.11.006 |
| emb-22 | Amiel et al. J Med Genet 2008;45(1):1–14 | OK | 17965226 | 10.1136/jmg.2007.053959 |
| emb-22 | Pingault et al. Hum Mutat 2010;31(4):391–406 | OK | 20127975 | 10.1002/humu.21211 |
| emb-22 | Vissers et al. Nat Genet 2004;36(9):955–957 | OK | 15300250 | 10.1038/ng1407 |
| emb-22 | Legius et al. Genet Med 2021;23(8):1506–1513 | OK | 34012067 | 10.1038/s41436-021-01170-5 |
| emb-22 | Lenders et al. J Clin Endocrinol Metab 2014;99(6):1915–1942 | OK | 24893135 | 10.1210/jc.2014-1498 |
| emb-22 | Woods et al. N Engl J Med 2002;346(14):1041–1046 | OK | 11932470 | 10.1056/NEJMoa012387 |
| emb-22 | Schilling et al. N Engl J Med 2002;346(14):1047–1053 | OK | 11932471 | 10.1056/NEJMoa012277 |
| emb-22 | Mossé et al. Nature 2008;455(7215):930–935 | OK | 18724359 | 10.1038/nature07261 |
| emb-22 | Wells et al. Thyroid 2015 (incerteza) | "Wells et al., Thyroid 2015" → "Wells SA Jr et al., Thyroid 2015;25(6):567–610" | 25810047 | 10.1089/thy.2014.0335 |
| emb-16 | EAU Guidelines on Paediatric Urology "(edição vigente)" | → edição 2026 (EAU Annual Congress London 2026; ISBN 978-94-92671-32-5); capítulo 19 descrito pelo conteúdo real, **sem** atribuir-lhe a regra de Weigert–Meyer | — | — |
| emb-16 | Schreuder et al. Nephrol Dial Transplant 2009;24(6):1810–8 | OK | 19171687 | 10.1093/ndt/gfn777 |
| emb-16 | Rabelo et al. J Pediatr (Rio J) 2005;81(5):400–4 | OK (no PubMed, 1º autor "Rabêlo EA", título traduzido do português) | 16247543 | 10.2223/JPED.1391 |
| emb-16 | Fernbach et al. Radiographics 1997;17(1):109–127 | **nova** (q26) | 9017803 | 10.1148/radiographics.17.1.9017803 |
| emb-16 | Siddiqui et al. Urol Case Rep 2025;61:103111 | **nova** (q26) | 40673163 | 10.1016/j.eucr.2025.103111 |
| emb-13 | Carvalho et al. (ISUOG) Ultrasound Obstet Gynecol 2023;61(6):788–803 | OK; capítulo acrescentado | 37267096 | 10.1002/uog.26224 |
| emb-13 | Pedra et al. Arq Bras Cardiol 2019;112(5):600–648 | OK | 31188968 | 10.5935/abc.20190075 |
| emb-05 | Bouyer et al. Hum Reprod 2002;17(12):3224–3230 | OK | 12456628 | 10.1093/humrep/17.12.3224 |
| emb-05 | ACOG Practice Bulletin No. 193. Obstet Gynecol 2018 | → 2018;131(3):e91–e103 | 29470343 | 10.1097/AOG.0000000000002560 |
| emb-05 | Reddy et al. J Ultrasound Med 2014;33:745–57 | título "joint NICHD, SMFM, AIUM, ACR, SPR and SRU" → "…AIUM, **ACOG**, ACR…"; → 33(5):745–57 | 24764329 | 10.7863/ultra.33.5.745 |
| emb-05 | Ngan et al. Int J Gynaecol Obstet 2021;155(Suppl 1) | → …(Suppl 1):86–93 | 34669197 | 10.1002/ijgo.13877 |
| emb-05 | Usui et al. Sci Rep 2019;9 | → 2019;9(1):12542 | 31467376 | 10.1038/s41598-019-49047-7 |
| emb-05 | Zaragoza et al. Am J Hum Genet 2000;66(6):1807–20 | OK | 10801385 | 10.1086/302951 |
| emb-05 | Kajii & Ohama. Nature 1977;268:633–4 (incerteza) | OK, sem mudança | 561314 | 10.1038/268633a0 |
| emb-05 | Ohama et al. Nature 1981;292:551–2 (incerteza) | OK, sem mudança | 7254351 | 10.1038/292551a0 |
| his-08 | Snook et al. Gut 2021;70(11):2030–51 | OK | 34497146 | 10.1136/gutjnl-2021-325210 |
| his-08 | Döhner et al. Blood 2022;140(12):1345–77 | OK | 35797463 | 10.1182/blood.2022016867 |
| his-08 | Provan et al. Blood Adv 2019;3(22):3780–817 | OK | 31770441 | 10.1182/bloodadvances.2019000812 |
| his-08 | Neunert et al. Blood 2011;117(16):4190–207 | OK | 21325604 | 10.1182/blood-2010-08-302984 |
| his-08 | KDIGO 2026 anemia na DRC. Kidney Int 2026;109(1) | → "Kidney Disease: Improving Global Outcomes (KDIGO) Anemia Work Group … (CKD). Kidney Int. 2026;109(1S):S1–S99" (109(1):44–56 é o sumário executivo) | 41485812 | 10.1016/j.kint.2025.06.006 |
| his-01 | Allison et al. J Clin Oncol, 2020 | → 2020;38(12):1346–1366 (+ Arch Pathol Lab Med 2020;144(5):545–563, PMID 31928354) | 31928404 | 10.1200/JCO.19.02309 |
| his-01 | Wolff et al. J Clin Oncol, 2018 | → 2018;36(20):2105–2122 (+ Arch Pathol Lab Med 2018;142(11):1364–1382, PMID 29846104) | 29846122 | 10.1200/JCO.2018.77.8738 |
| his-01 | Wolff et al. Arch Pathol Lab Med 2023 / J Clin Oncol 2023 | → APLM 2023;147(9):993–1000 (PMID 37303228); JCO 2023;41(22):3867–3872 | 37284804 | 10.5858/arpa.2023-0950-SA; 10.1200/JCO.22.02864 |
| his-01 | Hammond et al. Arch Pathol Lab Med 2010;134(6):907–922 | **nova** (diretriz de RE/RP de 2010; + J Clin Oncol 2010;28(16):2784–2795, PMID 20404251) | 20524868 | 10.5858/134.6.907 |
| his-01 | Wolff et al. J Clin Oncol 2013;31(31):3997–4013 | **nova** (atualização de HER2 de 2013; + Arch Pathol Lab Med 2014;138(2):241–256, PMID 24099077) | 24101045 | 10.1200/JCO.2013.50.9984 |

Não conferidas, por não serem artigos de periódico:
- livros-texto;
- GeneReviews (Treacher Collins, NBK1532);
- Manual de Orientação da SBP 2022 (emb-13-q28);
- MedlinePlus.

## 3. Conferência por item: fonte, trecho decisivo, resultado

### 3.1 emb-22: Johansson et al. 2015 (células C), "dados humanos indiretos"?
- **Fonte:** texto integral (PMC4631767).
- **Trechos:**
  - "With lineage tracing, we now provide direct evidence that Sox17+ anterior endoderm is the only source of differentiated C cells and their progenitors **in mice**".
  - Seção de resultados: "Wnt1+ neural crest progeny does not contribute to the thyroid C cell lineage in mice".
  - Os dados humanos são todos indiretos:
    - expressão de FOXA1/FOXA2 em microarranjos de carcinoma medular e na linhagem TT;
    - menção a células C na tireoide lingual e na síndrome de DiGeorge, como observações compatíveis.
- **Resultado: confirmado.** As explicações de q15 e q22 ("os dados humanos são indiretos") e a nota de divergência estão corretas. Sem mudança no texto.

### 3.2 emb-22: Wallace & Burns 2005, semanas pós-concepção ou desde a DUM?
- **Fonte:** resumo (PMID 15672264). O texto integral está na Springer (link.springer.com recusado pelo proxy, 403) e não está no PMC.
- **Trecho:** "human embryonic and fetal gut material ranging from weeks 4-14. Neural crest cells … entered the foregut at week 4, and migrated rostrocaudally to reach the terminal hindgut by week 7".
- **Evidência indireta:**
  - Na 4ª semana contada da DUM (cerca de 2 semanas após a fertilização) ainda não existe intestino.
  - Dois estudos primários abertos leem o artigo em idade embrionária:
    - Fawkner-Corbett et al., Cell 2021;184(3):810–826 (PMID 33406409): "by PCW 7–8, the enteric neural crest-derived cells have migrated the length of the GI tract (Wallace and Burns, 2005)";
    - Kruepunga et al., J Anat 2020;237(4):655–671 (PMID 32598482), que estadiam por Carnegie: entrada da crista vagal na parede do intestino no estágio 14 (~33 dias), citando Wallace & Burns.
- **Resultado:**
  - São semanas de idade embrionária (pós-concepção), na mesma convenção do tópico. q24 ("~4ª" e "~7ª semana") confere.
  - A incerteza foi retirada e a conclusão foi registrada na nota de divergência nº 2, com a ressalva de que a seção de métodos não foi lida.

### 3.3 emb-22: Jones et al. 2008 (Treacher Collins/p53)
- **Fonte:** resumo (PMID 18246078). O texto integral é manuscrito de autor sem liberação de download pelas APIs.
- **Trecho:** "inhibition of p53 prevents cyclin G1-driven apoptotic elimination of neural crest cells while rescuing the craniofacial abnormalities associated with mutations in Tcof1 … suppression of p53 function provides an attractive avenue for **possible** clinical prevention".
- **Pifitrina-α:** confirmada em fonte secundária. James et al., Nucleus 2014;5(5):402–426 (PMID 25482194): "Using a Trp53 gene deletion in mouse or pifithrin-α … Jones et al. blocked apoptosis".
- **Resultado: confirmado.** A cascata da q25 (TCOF1 → ribossomos → p53 → apoptose do neuroepitélio → déficit de crista → hipoplasia) segue o resumo. A incerteza foi retirada, e a ressalva "achado experimental, sem aplicação clínica" continua na explicação da q25.

### 3.4 emb-22: Legius et al. 2021 (NF1)
- **Fonte:** texto integral (PMC8354850).
- **Critérios:** a Tabela 1 confere item a item com a correlação "neurofibromatose-nf1". Inclui:
  - os limiares de > 5 mm e > 15 mm;
  - a exigência de que um achado pigmentar seja bilateral;
  - as anomalias da coroide;
  - a VAF de 50%;
  - o critério B para filho de genitor afetado.
- **Casos de novo:** o artigo diz "As many as 30–50% of NF1 patients are sporadic or founder patients".
- **Resultado:**
  - O texto do aluno ("cerca de metade dos casos de novo") **não** é contradito: está no limite superior e é o número da literatura de genética clínica.
  - A incerteza, porém, atribuía "cerca de metade" a Legius 2021. A atribuição foi corrigida, e o número fica para conferência na GeneReviews (NF1) ou no Thompson & Thompson.

### 3.5 emb-22: demais artigos de genética
- **Mossé 2008** (texto, PMC2672043): "PHOX2B mutations explain only a small subset of hereditary neuroblastoma". Confere com o capítulo citado ("ALK; PHOX2B").
- **Woods 2002 e Schilling 2002** (resumos): "Screening infants for neuroblastoma does not appear to reduce mortality". Confere.
- **Lenders 2014** (resumo): "We recommend consideration of genetic testing in all patients". Confere com a incerteza.
- **Vissers 2004** (resumo): CHD7 na CHARGE. Confere.
- **Amiel 2008** (resumo): RET como gene principal. Confere.
- **Pingault 2010** (resumo): seis genes (PAX3, MITF, EDN3, EDNRB, SOX10, SNAI2). Confere. As frequências relativas no tipo 2 não constam do resumo (texto não aberto).
- **Wells 2015 (ATA):** texto integral não liberado (`efetch db=pmc` diz que a editora não permite; Europe PMC devolve erro 500). A incerteza foi mantida, com a citação completa.

### 3.6 emb-21: Cooper 2003, Takahashi & Yamanaka 2006/2007, Kalish 2017 e outros
- **Cooper 2003** (resumo): "response to the Hh signal is compromised in mutant cells from mouse models of SLOS … sterol depletion affects the activity of Smoothened". Confere com a correlação de Smith-Lemli-Opitz.
- **Takahashi 2006** (resumo): "Oct3/4, Sox2, c-Myc, and Klf4". **Takahashi 2007:** "the same four factors" em fibroblastos humanos. Confere com a nota e com a q16.
- **Kalish 2017** (texto integral, PMC5538793):
  - "WAGR … contiguous gene deletions in chromosome 11p13 including WT1, PAX6"; "The risk of WT in WAGR is approximately 50%".
  - Recomendação (resumo): "renal ultrasounds every 3 months from birth … through the seventh birthday", com registro de esquemas europeus diferenciados.
  - **Resultado:** confirmado. A incerteza virou nota de divergência entre consensos; o texto do aluno continua qualitativo.
- **Goriely & Wilkie 2012, Dubourg 2018 e Shapiro 2018:** metadados corretos; os resumos são compatíveis com o uso.
- **Pendências:** o número "cerca de 80%" (acondroplasia por variante nova) não está no resumo de Goriely e continua para conferir no Thompson & Thompson.

### 3.7 emb-05: Bouyer 2002, Usui 2019, Zaragoza 2000, Ngan 2021
- **Bouyer** (resumo): "interstitial (2.4%), isthmic (12.0%), ampullary (70.0%), fimbrial (11.1%), ovarian (3.2%) or abdominal (1.3%)". A q08 e a nota de divergência conferem; as tubárias somam 95,5%, o que confere com "mais de 95%".
- **Usui** (texto integral, PMC6715694): "In the other twelve cases, centromeric zygosity was random … considered to be of dispermic origin". A Tabela 1 tem 12 molas dispérmicas, uma delas 47,XYY. A 13ª (48,XXYY) foi reclassificada como monospérmica por endoduplicação. Confere ("12 de 13").
- **Zaragoza** (resumo): "the majority of cases were diandric in origin because of dispermy, whereas the maternally-derived cases mainly originated through errors in meiosis II"; "association between paternal-but not maternal-triploidy and the development of partial hydatidiform moles". A q34 confere.
- **Ngan 2021** (texto integral, PMC9298230): p57 "absent in the villous cytotrophoblasts and stromal cells of CHM". As explicações de q30 e q34 conferem.

### 3.8 Ponto 3: mola 46,YY (emb-05-q30)
- **Buscas sem resultado:** PubMed `"46,YY"` (único resultado: um caso de mosaicismo de cromossomos sexuais, sem relação com mola) e `"46,YY"[tiab] AND mole` (zero). Europe PMC: frases "YY mole", "46,YY", "never been / not been observed / nonviable" com "hydatidiform".
- **Primárias lidas:**
  - Kajii & Ohama 1977 e Ohama et al. 1981: os resumos não falam de YY.
  - Usui 2019: nenhuma 46,YY entre 13 molas heterozigotas.
- **Secundárias encontradas:**
  - Fisher & Maher, Best Pract Res Clin Obstet Gynaecol 2021;74:29–41 (PMID 33685819), citada por Lukinovic et al., Radiol Oncol 2022 (PMID 36286620): "46, YY embryos are presumed to be non-viable".
  - Hafezi et al., Int J Fertil Steril 2020 (PMID 32681629): "The 46,YY constitution has yet to be described, most likely because such embryos will not be developed beyond a few cells", citando o relatório FIGO de 2012.
  - Kubelka-Sabit et al., Balkan J Med Genet 2017: "46, YY is non viable".
- **Achado lateral:** Rosenbusch (Int J Reprod Med 2014, PMID 25763399) relata, a partir de Staessen & Van Steirteghem (Hum Reprod 1997), "one diploid ICSI embryo with a YY-chromosome constitution" (pré-implantação, FISH X/Y/18). O resumo original não traz esse dado. Não contradiz a q30, que trata de mola.
- **Resultado: não esclarecido por fonte primária.** A formulação cautelosa da q30 ("nunca foi descrita (presume-se que um concepto sem cromossomo X seja inviável)") foi mantida e é a que as fontes sustentam. A incerteza foi completada com essas leituras.

### 3.9 Ponto 4: his-08, KDIGO 2026 (anemia na DRC)
- **Publicação:** sim. KDIGO 2026 Clinical Practice Guideline for the Management of Anemia in CKD, Kidney Int 2026;109(1S):S1–S99. O sumário executivo saiu em Kidney Int 2026;109(1):44–56.
- **Fonte:** PDFs integrais em kdigo.org.
- **Trechos:**
  - Practice Point 3.1.2: "In people with anemia and CKD, address all correctable causes of anemia, including iron deficiency, prior to the initiation of treatment with an ESA or a HIF-PHI".
  - Sumário executivo: "Before initiating ESA treatment, healthcare providers should ensure that patients are iron replete … addressing reversible causes of anemia (including iron deficiency) may obviate the need for ESA treatment".
  - Recomendação 3.3.1 (1D): "In adults with anemia and CKD treated with ESAs, we recommend targeting the Hb level to below 11.5 g/dl (115 g/l)", justificada pelo "risk of stroke and thromboembolic events and the important risk of high blood pressure" com alvos de 11,5 g/dl ou mais.
  - Sumário executivo: "using ESAs to target higher Hb levels (e.g., ≥13 g/dl) increases the risk of cardiovascular events, such as stroke and vascular access loss".
- **Resultado: confirmado.** A correlação "anemia da DRC" e a q22 (ferro e causas reversíveis antes do AEE; sem normalizar a Hb; alvos altos com mais eventos cardiovasculares e AVC) conferem, sem mudança.
- **Mudança:** só a referência, que dizia "109(1)" e agora diz "109(1S):S1–S99", com DOI e PMID. Incerteza atualizada (KDIGO saiu dela).

### 3.10 Ponto 5: emb-16-q26, Weigert–Meyer na diretriz EAU/ESPU
- **Fonte:** EAU Guidelines on Paediatric Urology, edição 2026, capítulo 19 "Ureterocele and ectopic ureter", lido em uroweb.org (texto completo do capítulo). O PDF integral fica em d56bochluxqnz.cloudfront.net, recusado pelo proxy (403).
- **Trechos:**
  - "Approximately 80% of ureteroceles are associated with the upper moiety ureter in duplicated systems".
  - "The ureter corresponding to the lower moiety is raised by the ureterocele and is frequently refluxing".
  - Ureter ectópico: "The ureter can drain the upper moiety of a duplex or single system"; em meninas, "persistent urinary incontinence despite normal voiding", com "continuous dribbling".
- **"Weigert" não aparece** no capítulo 19, no capítulo de refluxo vesicoureteral nem no de urologia fetal (busca no HTML).
- **Onde a regra foi documentada:**
  - Siddiqui et al., Urol Case Rep 2025 (texto integral, PMC12264601): "the upper pole ureter inserts inferomedially in the bladder, whereas the lower pole inserts supralaterally".
  - Fernbach et al., Radiographics 1997 (resumo): "Vesicoureteral reflux affects the lower pole … Ectopic ureterocele and ectopic ureteral insertion affect the upper pole".
- **Resultado: parcialmente confirmado.** O gabarito e a explicação da q26 conferem com as fontes. A referência da EAU dizia "(edição vigente)" e "regra de Weigert–Meyer". Agora traz a edição 2026, o ISBN e o conteúdo real do capítulo, e diz expressamente que o capítulo não cita a regra.
- **Novas referências:** Siddiqui 2025 (relato de caso: fonte modesta, mas a única lida que descreve as posições) e Fernbach 1997.
- **Pendência:** o mecanismo embriológico da explicação (broto do polo superior levado caudalmente com o ducto mesonéfrico) segue Sadler, não conferido.

### 3.11 Ponto 6: emb-13, ISUOG 2023 (Fallot com quatro câmaras normal; vias de saída)
- **Fonte:** ISUOG Practice Guidelines (updated): fetal cardiac screening, Ultrasound Obstet Gynecol 2023;61:788–803. PDF integral de acesso aberto em isuog.org.
- **Trechos da ISUOG:**
  - "The cardiac screening examination should include the fetal situs and the four-chamber, outflow-tract and great-vessel views … The inclusion of outflow-tract and great-vessel views enables detection of anomalies such as tetralogy of Fallot … (GRADE OF RECOMMENDATION: C)".
  - "The LVOT view helps to identify outlet ventricular septal defects and conotruncal as well as aortic valve abnormalities that are not visible in the four-chamber view".
  - "Common abnormalities associated with a seemingly normal four-chamber view, such as complete transposition of the great arteries, tetralogy of Fallot, double outlet right ventricle, common arterial trunk…".
  - Período ideal do exame: 18–22 semanas, em gestação de baixo risco.
- **Diretriz Brasileira de Cardiologia Fetal 2019** (texto integral, PMC6555576):
  - "Because the four-chamber view does not include the examination of the right and left ventricular outflows, important diseases such as transposition of the great arteries, tetralogy of Fallot (TOF), common truncus arteriosus … may be missed".
  - Tabela 2.2: Fallot entre as cardiopatias com quatro câmaras normal.
  - Tabela 2.3: defeitos do septo AV com quatro câmaras anormal, o que confirma a refutação do distrator (a).
- **Resultado: confirmado.** A q26 (22 semanas, baixo risco, Fallot com quatro câmaras normal) está correta.
- **Mudança:** DOI, PMID e capítulo nas referências; itens (2) e (5) da incerteza da camada avançada marcados como conferidos.

### 3.12 Ponto 7: his-01, ASCO/CAP (HER2: Wolff 2018/2023; RE/RP: Allison 2020)
- **Textos integrais lidos (PMC):**
  - Hammond et al., Arch Pathol Lab Med 2010 (diretriz original de RE/RP; PMC3073033):
    - "The time from tumor removal to fixation should be kept to ≤ 1 hour";
    - "Breast tissue specimens must be fixed in 10% NBF for no less than 6 hours and for not more than 72 hours";
    - tabela: "Time from tissue acquisition to fixation should be as short as possible".
  - Wolff et al., Arch Pathol Lab Med 2014 (= J Clin Oncol 2013, atualização de HER2; PMC4086638):
    - "begins the fixation process quickly (time to fixative within 1 hour) and is fixed in 10% neutral buffered formalin for 6 to 72 hours";
    - "time in fixative (which has increased from 6 to 48 hours to 6 to 72 hours **in this update** …)".
- **Resumos:**
  - Wolff 2023: "The 2018 ASCO-CAP recommendations for HER2 testing are affirmed".
  - Allison 2020 e Wolff 2018: os resumos não tratam da fase pré-analítica.
- **Não lidos:** os textos integrais de Allison 2020 e Wolff 2018 (ascopubs.org e meridian.allenpress.com recusados pelo proxy, 403; ausentes do PMC; documents.cap.org não testado, conforme a orientação).
- **Fonte secundária para 2020:** Ndengue et al., PLoS One 2026;21(6):e0343185 (PMID 42247401) diz que as diretrizes atuais (Allison 2020; Wolff 2023) recomendam "cold ischemia time … not exceeding one hour and fixation duration between 6 and 72 hours".
- **Resultado:**
  - O texto do aluno (correlação "fixacao-inadequada": ≤ 1 h; 6–72 h; reafirmado em 2023) confere, sem mudança.
  - **Erro corrigido na incerteza:** ela dizia que a atualização de HER2 de 2018 "ampliou o limite de 48 para 72 horas"; foi a de 2013.
  - Hammond 2010 e Wolff 2013 foram acrescentadas a `referencias`. A incerteza foi mantida para a redação literal de 2020 e 2018.

## 4. Para o revisor humano
1. **his-01:** conferir no texto original de Allison et al. 2020 (e de Wolff 2018) a redação de "≤ 1 hora" e "6 a 72 horas". Lidas: 2010 e 2013; 2020 só por fonte secundária.
2. **emb-05-q30:** não há fonte primária para "46,YY nunca descrita / inviável".
   - Avaliar se basta a revisão de Fisher & Maher 2021 (especialistas em genética de DTG) ou se convém precisar "nunca descrita **em mola**", dado o embrião YY pré-implantação relatado por Rosenbusch 2014.
3. **emb-22 (NF1):** conferir "cerca de metade dos casos de novo" na GeneReviews ou no Thompson & Thompson. Legius 2021 diz "até 30–50%".
4. **emb-22:** recomendação da ATA 2015 (Wells) sobre RET do éxon 10 na doença de Hirschsprung (texto não liberado). Também as frequências de MITF e SOX10 no Waardenburg tipo 2 (Pingault 2010, texto não aberto).
5. **emb-16-q26:** o mecanismo embriológico (broto que desce com o ducto mesonéfrico) depende de Sadler. A regra de Weigert–Meyer está apoiada em relato de caso (Siddiqui 2025) e no resumo de uma revisão (Fernbach 1997); a diretriz EAU não a nomeia.
6. **emb-22-q24:** a seção de métodos de Wallace & Burns não foi lida. A leitura "pós-concepção" apoia-se no resumo, na biologia e em dois estudos que citam o artigo.
7. **emb-21:** "cerca de 80%" de variantes novas na acondroplasia (Thompson & Thompson) não foi conferido. O resumo de Goriely & Wilkie não traz o número.
8. **Fora deste bloco:** Ginhoux 2010 (his-10), Grossmann 1997 (emb-03), Antonarakis 1992 (emb-02), Zaragoza em emb-03, Bergmann 2009 e Muretta 2015 (his-09).

## 5. Rede
- **Acessíveis:** eutils.ncbi.nlm.nih.gov, www.ebi.ac.uk (Europe PMC), kdigo.org, www.isuog.org e uroweb.org.
  - O `fullTextXML` do Europe PMC devolveu erro 500 para artigos fora do subconjunto aberto.
  - O `efetch db=pmc` devolveu só a página de rosto quando a editora não permite (ATA 2015, Provan 2019, Jones 2008, Goriely 2012).
  - A API BioC do NCBI respondeu 429 (limite de requisições).
- **Recusados pelo proxy (CONNECT 403):** link.springer.com, ascopubs.org, meridian.allenpress.com, www.cap.org, europepmc.org e d56bochluxqnz.cloudfront.net (PDF da EAU).

## 6. Validação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  48 passed (48)
```

Conferência por script contra o `HEAD`, nos sete arquivos:
- `questoes` idêntico;
- campos alterados só `referencias`, `incertezas`, `notasDivergencia` (emb-21, emb-22) e `revisao`;
- `revisao.humano` = `null`.

Não foi feito commit.
