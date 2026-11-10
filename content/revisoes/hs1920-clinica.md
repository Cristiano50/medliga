# Revisão HS19–20: urologia, ginecologia e mastologia (2ª etapa)

- Agente: `revisor-uro-gineco-v1`, na 2ª etapa (revisão transversal clínica). A conferência de fonte primária no texto integral (3ª verificação do protocolo) foi feita nesta mesma revisão.
- Data: 2026-11-10.
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Relatório da 1ª etapa: `content/revisoes/hs1920-histologia.md`.
- Fontes lidas pelo Bash com `curl`, sem WebFetch. Os scripts e downloads temporários ficaram em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hs1920-cli/`.
- Arquivos editados (só estes dois):
  - `content/histologia/topicos/his-19-reprodutor-masculino.json`;
  - `content/histologia/topicos/his-20-reprodutor-feminino.json`.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos. Não fiz commit.
- Ids e gabaritos: nenhum foi alterado. Isso vale para tópicos, estruturas, eventos, correlações, questões, alternativas, itens e lado esquerdo dos pares, e também para `correta` e `ordemCorreta`. Conferi por script contra cópias dos arquivos salvas antes da revisão.

## 1. Resumo

Revisei integralmente os dois tópicos, com foco nas correlações clínicas e nas 56 questões. **Não encontrei gabarito errado nem fato errado.**

Os três problemas importantes eram vinhetas e textos que ensinavam, sem dizer, condutas que as diretrizes desaconselham:
- **his-19, q16 e correlação de infertilidade:** apresentavam a biópsia testicular como exame diagnóstico da azoospermia. A EAU não recomenda biópsia sem extração terapêutica simultânea de espermatozoides. A distinção entre azoospermia obstrutiva e não obstrutiva é clínica.
- **his-20, q09:** pedia p16 num caso de morfologia inequívoca de HSIL (NIC3). A Parte II das Diretrizes diz que, nesse caso, o p16 não é necessário nem recomendado.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-19 Reprodutor masculino | 28 | 0 | 2 | 4 | 6 | aprovado-com-correcoes |
| his-20 Reprodutor feminino e mama | 28 | 0 | 1 | 5 | 6 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **3** | **9** | **12** | |

Gravidade:
- **crítica:** fato ou gabarito errado;
- **importante:** ambiguidade, distrator defensável, explicação incorreta, vinheta que modela conduta não recomendada;
- **menor:** redação, terminologia, precisão, referência.

Checagens por script, depois das edições:
- **Letras corretas** das 16 questões de múltipla escolha de cada tópico: a 4, b 4, c 4, d 4.
- **Explicações:** todas citam a letra de cada alternativa.
- **Pista de comprimento:** só his-20-q02 tem razão acima de 1,4 (1,41). Já estava assim e já foi avaliada na 1ª etapa: as alternativas são nomes curtos de estágios foliculares.
- **Resumos:** não foram alterados.

## 2. Conferência no texto integral (3ª verificação)

### 2.1 Rastreamento do câncer do colo: reconferido e mantido

Fontes, no texto integral:
- **Parte I:** `https://www.gov.br/saude/pt-br/assuntos/pcdt/c/cancer-de-colo-do-utero-parte-I`. PDF de 64 p., lido com `pdftotext -layout`. Cabeçalho: "PORTARIA CONJUNTA SAES/SECTICS Nº 13, DE 29 DE JULHO DE 2025".
- **Parte II:** `https://www.gov.br/saude/pt-br/assuntos/pcdt/c/cancer-de-colo-do-utero-parte-II`. PDF de 154 p. Cabeçalho: "PORTARIA CONJUNTA SAES/SCTIE Nº 105, DE 20 DE OUTUBRO DE 2026".

| Ponto do conteúdo (onde aparece) | Resultado | Trecho decisivo |
|---|---|---|
| "Risco padrão" e faixa de 25–64 anos (q21; ponto-chave 10; correlação) | Confere | Figura 1, obs. 1: "O teste deve ser realizado em mulheres entre 25 e 64 anos de risco padrão (vide texto)" |
| 5 anos após teste negativo (q21, q10-a) | Confere | Rec. 18: "repetição do teste de DNA-HPV oncogênico em intervalos de cinco anos, após resultado negativo (forte, … certeza alta)" |
| HPV 16/18 → colposcopia (q10, gabarito c) | Confere | Rec. 19: "encaminhamento para colposcopia após resultado … mostrando presença dos tipos 16 e/ou 18" |
| Outros tipos → citologia reflexa; ASC-US+ ou insatisfatória → colposcopia (q10-b) | Confere | Rec. 20: "Se a citologia estiver alterada (ASC-US+) ou se mostrar insatisfatória, a mulher deverá ser encaminhada para realização de colposcopia" |
| Novo teste em 12 meses após triagem negativa (q10-d) | Confere | Rec. 22: "repetição de teste de DNA-HPV oncogênico em 12 meses a partir da data do resultado do teste de triagem negativo (colposcopia ou citologia reflexa)" |
| Fim do rastreamento | Confere | Rec. 12: "encerrar … quando o último teste acima dos 60 anos apresentar resultado negativo" |
| Citologia trienal onde não há teste (q21) | Confere | Rec. 28: "citologia trienal após dois resultados anuais consecutivos negativos" |
| **Rec. 39** (q21; correlação) | Confere | "intervalo de rastreamento de 3 anos para mulheres vivendo com HIV/aids e em outras situações de imunodepressão ou imunossupressão". **Ajuste:** o texto dizia "HIV ou imunossuprimidas"; passou a nomear o grupo como a diretriz (imunodepressão inclui doença renal crônica e câncer, nota "o") |
| **Rec. 40** (correlação) | Confere | "após resultado … positivo (qualquer tipo detectado), encaminhamento para colposcopia independente do resultado da citologia reflexa" para o mesmo grupo |
| LAST × NIC (q09; correlação) | Confere | Quadro 2 da Parte II:<br>• LSIL (NIC1): "atipia predominantemente limitada ao terço inferior … maturação preservada e mitoses predominantemente na camada basal";<br>• HSIL (NIC2): "aproximadamente até dois terços";<br>• HSIL (NIC3): "mais de dois terços … ou de toda a espessura" |
| **p16** (q09) | **Ajustado** | Quadro 2: "Marcador imunohistoquímico auxiliar em casos morfologicamente equívocos, especialmente na diferenciação entre LSIL e HSIL. Não é necessário para todos os casos típicos de HSIL". Seção 7.3 ("Terminologia histológica e uso de imunomarcadores"): "seu uso não é recomendado quando o diagnóstico morfológico é de HSIL(NIC3), devido ao risco de subgraduação indevida". A vinheta da q09 (mais de 2/3 da espessura, morfologia inequívoca) trazia "p16 em bloco"; ver tabela 3 |
| ZT tipo 3, mais comum em mulheres mais velhas (q20) | Confere | Parte II: "a ZT tipo 3 é mais frequentemente encontrada em mulheres mais maduras" |

Não mudei, mas registro dois pontos:
- A Figura 1 (obs. 7) e as Recs. 23–25 completam o seguimento após triagem negativa: teste negativo em 12 meses → volta a 5 anos; 16/18 → colposcopia; outro tipo persistente em 24 meses → colposcopia, qualquer que seja a citologia. A correlação para em "se normal, novo teste em 12 meses". Não está errado e nenhuma questão cobra; ver seção 5.
- A frase "mulheres e demais pessoas com colo do útero" é paráfrase, não citação. A Parte I diz "mulheres" e estende as mesmas orientações a pessoas LBTQIA+ (Rec. 42).

### 2.2 Masculino: EAU, OMS e marcadores

| Ponto | Fonte (texto integral) | Trecho decisivo | Resultado |
|---|---|---|---|
| Biópsia testicular (q13, q16, correlação de infertilidade) | EAU Sexual and Reproductive Health, cap. Male Infertility (`https://uroweb.org/guidelines/sexual-and-reproductive-health/chapter/male-infertility`) | 11.6.1.a.4: "Testis biopsies (including fine-needle aspiration [FNA]) without performing simultaneously a therapeutic sperm retrieval are not recommended". 11.6.2.b: "Testicular biopsy before TESE is not recommended". 11.6.1: azoospermia obstrutiva "characterised by normal FSH values, testes of normal size, and epididymal enlargement" | q13 já estava certa (ajustada na 1ª etapa). **q16 e correlação ajustadas** |
| Ausência congênita bilateral dos deferentes (q16) | EAU; Cai & Li, *Front Genet* 2022 (PMC8873976) | EAU: "semen volume < 1.0mL and acidic pH < 7.0"; "MESA or PESA is indicated in males with CBAVD. Testicular sperm extraction and percutaneous TESA, are also options"; "Test males with structural abnormalities of the vas deferens … and their partners for CFTR gene mutations. Strong". Cai & Li: "seminal fructose <13 μmol/ejaculation". Tabela da EAU: frutose seminal > 13 µmol/ejaculado como referência | Frutose baixa confirmada (vinheta mantida). A pesquisa de CFTR no casal entrou na explicação |
| Criptorquidia, GCNIS e idade da cirurgia | EAU, 11.4.1 | "Treatment between the age of six to 18 months is therefore recommended to conserve spermatogonial stem cells … and decrease the risk of tumours"; "Orchidopexy performed before the onset of puberty has been reported to decrease the risk … even men who undergo early orchidopexy still harbour a higher risk"; "Perform simultaneous testicular biopsy for the detection of … GCNIS … if undescended testes are corrected in adulthood. Strong" | Mantido. **Acrescentada** a idade recomendada (6–18 meses). A SBP diz "até os 2 anos": ver notasDivergencia |
| Varicocele | EAU, 11.4.3 | "Patients with isolated, clinical right varicocele should be examined further for abdominal, retroperitoneal and congenital pathology"; "The exact association between reduced male fertility and varicocele is unknown. Increased scrotal temperature, hypoxia and reflux of toxic metabolites…"; "failure of ipsilateral testicular growth and development" | Confere (correlação e q15) |
| Anabolizantes e testosterona (q14) | EAU, 11.5.3.d | "Usually, adequate sperm numbers and quality will improve over a six to twelve-month period from cessation"; "Testosterone therapy is contraindicated in infertile males. 1a" | Confere |
| FSH × padrão histológico | EAU, 11.3.4 | "When spermatogonia are absent or markedly diminished, FSH level is usually elevated; when … maturation arrest exists at the spermatocyte or spermatid level, FSH level is usually within the normal range" | Confere |
| GCNIS: OMS 2016 e 2022 | Berney DM et al., *Histopathology* 2022;81(4):459-66 (PMC9544657) | "retaining its structure and main nomenclature, including the use of the term 'germ cell neoplasia in situ' (GCNIS) for the pre‐invasive lesion of most germ cell tumours"; termos anteriores "carcinoma in situ", "intratubular germ cell neoplasia, unclassified"; "Germ cell tumours unrelated to GCNIS … Spermatocytic tumour" | Confere. Moch 2016 continua só pelo resumo; a afirmação "desde 2016" vem de Berney ("builds upon the radical revision made in 2016") |
| Marcadores de GCNIS | Rajpert-De Meyts E et al., *BJU Int* 2022 (PMC9796833) | "immunohistochemical expression of placental‐like alkaline phosphatase (PLAP), OCT3/4 factor and D2‐40 antigen, marking GCNIS cells" | Confere |
| p63, 34βE12 e AMACR | Inamura K, *Oncotarget* 2018 (PMC5865702) | "all of these tumors show evidence of complete basal cell loss, as determined by the immunohistochemical analysis of TP63 and 34βE12"; "TP63 (p63) and high-molecular weight cytokeratins, which are not detectably expressed by adenocarcinomas"; AMACR "helpful" | Confere. A correlação passou a nomear a 34βE12 |
| Gleason arquitetural e grupos ISUP (q20; correlação) | Kweldam CF et al., *Histopathology* 2019;74(1):146-60 (PMC7380027) | "architecture‐based nine‐tier Gleason grading system"; "the cytonuclear atypia‐based now obsolete Mostofi (WHO) grading and the architecture‐based Gleason grading"; grade groups "endorsed by the ISUP in 2014 and recommended by the WHO" | Confere. A graduação continua só qualitativa (nenhum escore ou grupo numérico no conteúdo) |

### 2.3 Feminino: SOP/PMOS, endométrio e mama

| Ponto | Fonte | Trecho decisivo | Resultado |
|---|---|---|---|
| PMOS: publicação primária | Teede HJ et al., *Lancet* 2026;407(10545):2329-39 (PMID 42119588). Resumo pelo E-utilities. O texto integral é de acesso aberto (CC BY), mas www.thelancet.com e doi.org são recusados pelo proxy ("CONNECT tunnel failed, 403"), e o artigo não está no Europe PMC | "polyendocrine metabolic ovarian syndrome was the consensus new name"; "56 leading academic, clinical, and patient organisations"; "A co-designed global implementation strategy, including a transition period, education, and alignment with health systems and disease classification, is under way" | Base da decisão (2.4) |
| PMOS: AJOG | Bahri-Khomami M et al., *Am J Obstet Gynecol* 2026;235(5):999-1002 (PMID 42665241), resumo | "has been renamed … endorsed by 56 professional and patient organizations"; "Diagnostic criteria remain unchanged" | Critérios inalterados: confere |
| PMOS: Fertil Steril | Teede HJ et al. 2026 (PMID 42679945), resumo | "delivered a 97% consensus on the name PMOS"; "Implementation … spans coding and classification systems, … clinical guidelines" | Implantação em curso |
| PMOS: editorial da RBGO (FEBRASGO) | Soares-Júnior JM et al., *Rev Bras Ginecol Obstet* 2026;48:e-rbgoedt4 (PMC13690375), texto integral pelo Europe PMC | "an international initiative **proposed** changing its name to … (PMOS)"; "The **proposed** new nomenclature"; "The transition from PCOS to PMOS is an attempt…"; críticas a "Polyendocrine" e "Metabolic" | Base da decisão (2.4) |
| PMOS: posição da FEBRASGO | `https://www.febrasgo.org.br/?s=PMOS` | 3 resultados, nenhum sobre a síndrome (osteoporose, legislação, covid-19) | Sem posição encontrada |
| Critérios da SOP; risco endometrial (correlação; q12, q13) | Teede HJ et al., *J Clin Endocrinol Metab* 2023 (PMC10505534), texto integral | 1.4.6: ultrassonografia "not recommended in adolescents"; 1.5.4: "Serum AMH should not yet be used in adolescents"; 1.5.5: "Either serum AMH or ultrasound … both tests should not be performed"; 1.11.1: "markedly higher risk of developing endometrial hyperplasia and endometrial cancer"; 1.11.2: "routine screening is not recommended" | Confere |
| Hiperplasia endometrial (OMS 2020) | Giannella L et al., *Cancers* 2024 (PMC10930610), texto integral | Dois grupos desde 2014, "maintained in the most recent WHO classification version of 2020"; PTEN entre as alterações; deficiência de PTEN/PAX2/MMR "desirable criterion" para AEH/EIN | Confere |
| Tipo não especial × lobular; E-caderina | Wilson N et al., *Front Oncol* 2021 (PMC7844138); Apostol 2025 (PMC12400667), textos integrais | "single file pattern, surrounding a normal breast duct in a concentric manner"; "loss of cell adhesion molecule E-cadherin leading to cells with a discohesive morphology"; "overwhelmingly characterized by HER2 negativity"; mamografia com "low sensitivity for detecting ILC"; "invasive breast carcinoma of no special type (IBC-NST)" | Confere. A referência de Wilson passou de "resumo conferido" para texto integral |
| Biópsia endometrial na investigação de infertilidade (q07) | ESHRE, Evidence-based guideline: unexplained infertility, *Hum Reprod* 2023;38(10):1881-90 (PMC10546081), texto integral | "In women investigated for infertility, endometrial biopsy for histological examination is not recommended in the absence of other indications … Strong" | **Vinheta da q07 ajustada** |
| Endometriose e adenomiose | Robbins (citado de memória) | Sem conduta nem número no conteúdo | Mantido. Nenhum protocolo da FEBRASGO foi lido |
| Placenta | Integração com emb-09 | Só no resumo e na estrutura `vilosidades-corionicas`; nenhuma questão | Mantido |

### 2.4 Decisão: PMOS como "renomeada" ou "proposta"

**Decisão: o texto diz "novo nome proposto" (por consenso internacional, em transição), e não "renomeada".** As razões:
1. A publicação primária (Lancet) descreve um nome escolhido por consenso, mas diz que a implantação está em curso, inclusive o "alignment with … disease classification".
2. A revista da FEBRASGO (RBGO, texto integral) trata o nome como proposta e critica o termo.
3. Não encontrei adoção pela FEBRASGO nem por diretriz brasileira.
4. Para um estudante brasileiro, "SOP" continua sendo o termo esperado em prova.

Os artigos do próprio consórcio (AJOG, Fertil Steril) dizem "renamed"; a divergência ficou registrada em `notasDivergencia`.

O que mudou:
- título da correlação: "renomeada em 2026 como PMOS" → "novo nome proposto em 2026: PMOS";
- correlação: "definiu o novo nome" → "escolheu o nome … e propôs sua adoção gradual, com período de transição";
- explicação da q12;
- nota de divergência.

Nenhuma questão cobra o nome.

### 2.5 Decisão: id `espermatocito` × `espermatocito-primario`

**Mantido `espermatocito` no his-19.** Às 10:51, o desenho da lâmina `testiculo` em `src/modules/histologia/laminas/sistemas-c.tsx` (`PARTES_TESTICULO`) foi criado por outro agente com o id `espermatocito`, igual ao do tópico. O JSON da lâmina ainda não existe: às 10:57, `content/histologia/laminas-sistemas-c.json` continuava com `"laminas": []`.

Comparação dos ids:
- As outras partes do desenho (`tunica-albuginea`, `espermatogonia`, `espermatide`, `celula-de-sertoli`, `celula-de-leydig`) coincidem com os ids do tópico.
- `lamina-propria`, `lumen` e `capilar` são ids genéricos de lâmina.
- emb-02 conserva `espermatocito-primario` e `espermatocito-secundario`. A granularidade é outra: a embriologia separa as duas divisões meióticas; na lâmina, a célula reconhecível é o espermatócito primário, e o secundário raramente é visto.

Recomendação para o JSON da lâmina: usar `espermatocito` com o nome "Espermatócito (primário)".

As lâminas `ovario` e `utero-proliferativo` ainda não existem (nem JSON nem desenho). Os ids sugeridos continuam os da seção 5 de `hs1920-histologia.md`.

## 3. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-19 / `infertilidade-masculina-biopsia` | descricao | "Na azoospermia, a histologia testicular distingue espermatogênese preservada … de falha da produção" (biópsia como exame diagnóstico) | A distinção é clínica e laboratorial (volume testicular, FSH, volume e pH do ejaculado, deferentes); a biópsia não é exame isolado, e sim feita durante a extração de espermatozoides para reprodução assistida; acrescentada "frutose baixa" na ausência congênita dos deferentes | A EAU não recomenda biópsia sem extração terapêutica simultânea | importante | EAU Male Infertility, 11.6.1.a.4, 11.6.2.b, 11.6.1 |
| his-19-q16 | contexto; explicacao | "A biópsia testicular mostra túbulos com todas as gerações…"; "A biópsia mostra espermatogênese completa…" | "Na extração de espermatozoides do testículo para ICSI, o exame histológico do fragmento mostra…". A explicação diz que os achados clínicos já indicam obstrução e a histologia confirma; (a) "a histologia mostraria"; acrescentado: biópsia sem extração simultânea não é recomendada e pesquisa de CFTR no homem e na parceira. Gabarito (c) mantido | Vinheta de dificuldade 5 que ensinava biópsia diagnóstica num quadro de diagnóstico clínico | importante | EAU (11.6.1.a.4; 11.3.5.b; 11.6.1.b.1; recomendação forte de CFTR no casal); Cai & Li 2022 |
| his-19 / `criptorquidia-gcnis` | descricao | "A orquidopexia antes da puberdade associa-se a risco menor…" | + "por isso, e para preservar as células germinativas, a cirurgia é hoje indicada cedo, entre 6 e 18 meses de idade segundo a diretriz europeia" | "Antes da puberdade" podia ser lido como época aceitável para a cirurgia | menor | EAU 11.4.1.a.2.a |
| his-19 / `adenocarcinoma-prostata` | descricao | "p63 e citoqueratina de alto peso molecular negativas" | "… citoqueratina de alto peso molecular, como a 34βE12, negativas" | Terminologia do anticorpo usado na prática | menor | Inamura 2018 |
| his-19 | referencias | EAU sem detalhe; Berney "resumo conferido"; Gleason só em Robbins | EAU com 6–18 meses, biópsia só com extração e CFTR no casal; Berney no texto integral (PMC9544657); **Kweldam 2019** acrescentado (q20) | Rastreabilidade | menor | seção 2.2 |
| his-19 | notasDivergencia; incertezas | — | Nota: EAU 6–18 meses × SBP (página às famílias) "até os 2 anos". Incerteza: o que foi relido; Moch 2016 só pelo resumo; nenhuma diretriz da SBU lida | Registro | menor | EAU; SBP (`sbp.com.br/pediatria-para-familias/cuidados-com-a-saude/urologia-pediatrica/`) |
| his-20-q09 | contexto; explicacao | Vinheta de HSIL (NIC3) inequívoca com "p16 com marcação forte e contínua (em bloco)"; explicação: p16 "ajuda nos casos duvidosos" | p16 retirado da vinheta. Explicação: com morfologia inequívoca, o p16 não é necessário; as Diretrizes o reservam aos casos duvidosos (sobretudo LSIL × HSIL/NIC2) e não o recomendam quando a morfologia já é de HSIL (NIC3). Gabarito (d) mantido | A vinheta modelava uso de p16 que a diretriz desaconselha, e o aluno poderia achar que o p16 faz parte do diagnóstico de NIC3 | importante | Parte II, Quadro 2 e seção 7.3 |
| his-20-q07 | contexto | "Biópsia endometrial de mulher de 31 anos com ciclos regulares, em investigação de infertilidade" | "Endométrio de mulher de 44 anos com ciclos regulares, retirado em histerectomia por leiomiomas uterinos". Achados e gabarito (c) mantidos | A datação histológica do endométrio não é recomendada na investigação de infertilidade | menor | ESHRE 2023 (PMC10546081) |
| his-20 / `sindrome-ovarios-policisticos` (+ q12, nota) | titulo; descricao; q12 explicacao; notasDivergencia | "renomeada em 2026 como PMOS"; "definiu o novo nome" | "novo nome proposto em 2026: PMOS"; "escolheu o nome … e propôs sua adoção gradual, com período de transição … termo ainda em uso no Brasil"; nota com a decisão e a divergência | "Renomeada" apresentava como fato consumado uma adoção que o próprio consenso descreve como em curso (seção 2.4) | menor | Lancet 2026 (resumo); RBGO 2026 (texto integral); site da FEBRASGO |
| his-20 / `hpv-zona-transformacao-rastreamento`; his-20-q21 | descricao; explicacao | "Mulheres vivendo com HIV ou imunossuprimidas" | "Mulheres vivendo com HIV/aids ou com outra imunodepressão ou imunossupressão" | A Rec. 39–40 abrange também a imunodepressão por doença (DRC, câncer). Gabarito da q21 (F) mantido | menor | Parte I, Recs. 39–40 e nota "o" |
| his-20 | referencias | Parte II sem a seção 7.3; Wilson "resumo conferido"; PMOS "definiu" | Parte II com o Quadro 2 completo e a seção 7.3; Wilson no texto integral (PMC7844138); **ESHRE 2023** acrescentada; PMOS "escolheu … transição em curso; Lancet inacessível" | Rastreabilidade | menor | seção 2.3 |
| his-20 | incertezas | "PMOS: a renomeação foi conferida…" | "o novo nome foi conferido…" + item com o que foi relido nesta etapa (Partes I e II, p16, Lancet inacessível, ESHRE; protocolos da FEBRASGO não lidos) | Registro | menor | — |

## 4. O que foi revisado e mantido sem mudança (principais)

**his-19:**
- zonas da próstata (hiperplasia na zona de transição; maioria dos carcinomas na periférica): q11, q21, q28;
- toque retal na hiperplasia e no carcinoma;
- mecanismo da hiperplasia (DHT, 5α-redutase tipo 2, α1);
- q12: "apoia" o diagnóstico, sem dizer que basta;
- varicocele: q15 e correlação;
- anabolizantes: q14;
- GCNIS: q13, com a vinheta já ajustada na 1ª etapa;
- Klinefelter e Sertoli isoladas: q28;
- ereção e PDE5: q22.

**his-20:**
- q10: HPV 16 → colposcopia;
- q21: com risco padrão; gabarito F confere com a Rec. 18;
- q20: ZT tipo 3;
- q08: zona de transformação e cistos de Naboth;
- endometriose (q11) e correlação com adenomiose;
- hiperplasia: q13 e q28;
- SOP: q12, com a vinheta e os critérios conferidos;
- lobular × não especial: q14; mioepiteliais: q15;
- lactação: q16, q22, q25.

## 5. Pontos para o revisor humano

1. **PMOS.** Confirmar a decisão "proposto" × "renomeado" (seção 2.4). Sugestão: rever quando a FEBRASGO ou a CID se manifestarem. O texto integral do Lancet não foi lido: o host está fora da rede e o artigo não está no Europe PMC.
2. **Idade da orquidopexia.** A EAU diz 6–18 meses; a SBP, na página às famílias de nov. 2025, diz "até os 2 anos". A correlação cita a EAU. Não li diretriz da SBU nem documento técnico da SBP. Decidir se vale citar a fonte brasileira.
3. **Seguimento após triagem negativa (Recs. 23–25).** A correlação do HPV não diz que a persistência por 24 meses leva à colposcopia. Não está errado e nada é cobrado. Decidir se acrescenta: o tópico é de histologia, e a decisão sobre o nível clínico é a G2 de `docs/pendencias-conferencia-medica.md`.
4. **Nível clínico em histologia.** Agora, além do rastreamento, há conduta da EAU (biópsia só com extração; CFTR no casal; idade da orquidopexia) em correlações e explicações de questões de dificuldade 4–5. É o mesmo ponto 7 da 1ª etapa.
5. **Fontes não lidas no texto integral:**
   - livros da OMS (Female Genital Tumours 2020; Breast Tumours 2019; Urinary and Male Genital Tumours 2016/2022): conferidos em revisões abertas;
   - Moch 2016: só o resumo;
   - Robbins, citado de memória para zonas da próstata, endometriose e adenomiose;
   - protocolos da FEBRASGO de endometriose, SOP e hiperplasia;
   - diretrizes da SBU. Nada disso sustenta número ou conduta no conteúdo.
6. **Lâminas.** O desenho `testiculo` usa `espermatocito`, alinhado ao tópico (seção 2.5); falta o JSON da lâmina. No desenho, a túnica própria do túbulo seminífero aparece como `lamina-propria`. Ross usa os dois nomes, mas o tópico chama a estrutura de "túnica própria". Conferir quando a lâmina for escrita.
7. **Resumo do his-19 acima de 900 palavras.** Ponto 4 da 1ª etapa; não mexi no resumo.

## 6. Testes

- `npm run validar-conteudo`: **OK**, com a saída "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441".
- `npx vitest run`: 83 de 84 testes passam. A única falha é `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, com a mensagem "pulmao: expected false to be true". O desenho `pulmao` está em `sistemas-c.tsx`, mas a lâmina ainda não está em `laminas-sistemas-c.json`. É trabalho em andamento de outros agentes, sem relação com his-19/his-20; foi ignorada, como combinado. É a mesma falha registrada na 1ª etapa.
