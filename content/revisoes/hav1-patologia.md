# Revisão HAV1 — patologia/dermatologia/clínica, camada avançada (tópicos 1 a 5)

- Agente: `revisor-patologia-avancado-v1` (2ª etapa, revisor transversal de patologia, dermatopatologia e patologia mamária), com a conferência de fonte primária no texto integral exigida desde 10/11/2026
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Etapa anterior: `content/revisoes/hav1-histologia.md`.
- Escopo: só a camada avançada, ou seja, as questões com a tag `avancado` e as entradas novas em `referencias`, `notasDivergencia` e `incertezas`. Arquivos em `content/histologia/topicos/`:
  - `his-01-metodos.json` (q26–q30);
  - `his-02-epitelio-revestimento.json` (q26–q30);
  - `his-03-epitelio-glandular.json` (q26–q30);
  - `his-04-conjuntivo.json` (q26–q30);
  - `his-05-adiposo.json` (q27–q31).
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos cinco arquivos. Comparei com `git show HEAD` por script e confirmei:
  - nenhum id mudou;
  - nenhum gabarito mudou (`correta`, `ordemCorreta`, `pares`), nem alternativas, enunciados, contextos ou itens;
  - só questões com a tag `avancado` foram tocadas, e nelas só `explicacao` e `referencia`;
  - todas as referências, notas e incertezas antigas estão intactas, com uma exceção autorizada: a incerteza antiga da triptase no his-04 (item 4 da lista), que estava desatualizada;
  - as entradas novas foram acrescentadas no fim das listas;
  - nenhum arquivo além destes cinco e deste relatório foi editado.

Fontes lidas com curl pelo proxy (sem WebFetch), via E-utilities, Europe PMC e OAI do PMC (o endpoint novo é `pmc.ncbi.nlm.nih.gov/api/oai/v1/mh/`). Os arquivos baixados e os scripts ficaram em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hav1-pat/`.

## 1. Resumo

Revisei as 25 questões avançadas: 16 de múltipla escolha, 3 V/F, 3 de ordenar e 3 de associar. Também revisei as entradas novas da 1ª etapa e do redator.

**Não encontrei gabarito errado nem fato errado (0 críticas).** Fiz duas correções importantes, ambas no his-03, em explicações que ensinavam uma generalização falsa:
- **his-03-q27**: a explicação dizia, sem ressalva, que "o carcinoma in situ" mantém o mioepitélio. Os carcinomas papilíferos encapsulado e sólido podem ser classificados como in situ sem mioepitélio periférico, e por isso a ausência de mioepitélio sempre se interpreta junto com a morfologia.
- **his-03-q28**: a explicação dizia que uma recidiva de adenoma pleomórfico "continuaria benigna, sem o componente atípico infiltrativo". O carcinoma ex-adenoma pleomórfico também surge em recidivas, e as recidivas múltiplas são fator de risco.

A atualização mais relevante entre as menores está na **his-02-q29**: a diretriz da ERS de 2017 foi substituída pelas diretrizes conjuntas **ERS/ATS de 2025**. Li o texto integral; o gabarito continua correto, e a explicação e a referência foram atualizadas.

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-01 Métodos | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| his-02 Epitélio de revestimento | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| his-03 Epitélio glandular | 5 | 0 | 2 | 0 | 2 | aprovado-com-correcoes |
| his-04 Conjuntivo | 5 | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| his-05 Adiposo | 5 | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **2** | **10** | **12** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão, referência ou incerteza desatualizada.

Nenhuma alternativa foi alterada. Por isso o comprimento das alternativas e a distribuição das letras corretas não mudaram, e nenhuma letra passa de 40% em nenhum tópico. Checagem por script: as explicações das 16 múltiplas avançadas citam todas as letras.

### Pontos de atenção pedidos: resultado um a um

| Tema (questão) | Resultado e trecho decisivo |
|---|---|
| **Fixação e RE; Hammond 2010 × Allison 2020; "não interpretável"** (his-01-q26) | **Correta; correção menor (referência).** Reli Hammond et al. 2010 no texto integral (PMC3073033):<br>- "Uninterpretable for ER or PgR if finding that no tumor nuclei are immunoreactive and that internal epithelial elements ... lack any nuclear staining";<br>- entre as causas de resultado não interpretável, "samples where fixation was delayed for more than 1 hour";<br>- o controle interno positivo "must display a heterogeneous staining pattern of the luminal cells";<br>- mioepitélio e estroma "must invariably show a negative result".<br>**Allison 2020**: o texto integral continua fora da rede. ascopubs.org, meridian.allenpress.com e www.cap.org foram recusados pelo proxy (403), e documents.cap.org deu erro 502. O resumo (PMID 31928404) mantém < 1% como negativo, cria a categoria "ER Low Positive" (1–10%) e manda relatar o estado dos controles de 0% a 10%.<br>Achei uma fonte secundária aberta que cita Allison 2020 e reproduz a regra: Cho et al., J Breast Cancer 2021 (PMC7920867), "prolonged cold ischemia time ... inappropriate external/internal controls ... These cases are uninterpretable, and repeat staining of another block or specimen is recommended [Allison 2020]". O conceito cobrado (não relatar como negativo; repetir em outra amostra) vale nas duas versões. Acrescentei a fonte secundária. |
| **Amiloidose: vermelho Congo e tipagem** (his-01-q27) | **Correta; correção menor.**<br>- Posicionamento brasileiro da SBC 2021, no texto integral (PMC8462947): "a coloração vermelho-congo permite a confirmação da infiltração amiloide nos tecidos, porém não identifica o tipo da proteína precursora"; tipagem por "imuno-histoquímica ou, preferencialmente, de microdissecção a laser ... com realização de espectrometria de massa".<br>- Howie e Owen-Casey 2022, no texto integral (PMC9518257): o "verde-maçã" nem sempre aparece e costuma vir com outras cores ("the commonest combination was green and yellow"; "the best expression to use is anomalous colours").<br>A explicação passou a dizer "birrefringência, classicamente descrita como verde-maçã", mencionando as cores anômalas, e "de preferência, espectrometria de massa". Também registrei uma nota de divergência. |
| **Fogo selvagem — consenso da SBD 2019** (his-02-q26) | **Correta, sem alteração.** Porro et al., no texto integral (PMC6544031):<br>- o fogo selvagem "compromises young adults from rural areas of the geographic region of FS, with a family history of the disease";<br>- as lesões ficam em áreas seborreicas e "do not compromise the mucous membranes";<br>- "In Brazil, its incidence is high, mainly in the midwest";<br>- Dsg1 mais intensa nas camadas superiores e Dsg3 "in the lower layers of the epidermis and in mucous membranes". |
| **Salt-split: EBA × anti-laminina 332 × anti-p200** (his-02-q27) | **Correta, sem alteração.** A correção da 1ª etapa foi conferida:<br>- Santi et al. (PMC6544032): na EBA, "IgG deposition on the dermal side of the cleavage"; no penfigoide bolhoso, "on the epidermal or epidermal and dermal side";<br>- Shi et al. 2022 (PMC9599625): "IgG autoantibodies against LM332 react with the dermal side";<br>- Kridin e Ahmed 2019 (PMC6817563): lado dérmico em 90/108 casos e nos dois lados em 16/108.<br>O consenso também cita o lúpus bolhoso como diferencial. O alvo dele é igualmente o colágeno VII (Duan et al. 2015, PMC4451988: "circulating anti-type VII collagen antibodies"), o que não ameaça o gabarito c. |
| **Pênfigo neonatal** (his-02-q30) | **Verdadeira; correção menor (referência).** Fonte brasileira em texto integral: Fagundes et al., An Bras Dermatol 2021 (PMC8441454), "Desmoglein 3 is expressed throughout the epidermis, including the subcorneal layers in neonatal skin, and may be protective against disease-causing anti-desmoglein 1 antibodies". Num estudo brasileiro com 19 gestantes com fogo selvagem, não houve doença neonatal clínica. A formulação da 1ª etapa ("presente também nas camadas superficiais") está confirmada. |
| **Discinesia ciliar primária (ERS 2017)** (his-02-q29) | **Correta; correção menor (diretriz vigente).** As diretrizes **ERS/ATS 2025** (Shoemark et al., Eur Respir J 2025;66(6):2500745, texto integral PMC13101888) unificaram a ERS 2017 e a ATS 2018. Trechos decisivos:<br>- "no adjunct test is suitable as a standalone test to diagnose PCD and no single adjunct or reference test is suitable to exclude PCD";<br>- a videomicroscopia determina o caráter primário "by reproducibility of an abnormal finding after culture in vitro";<br>- "Pursuing a genetic diagnosis is encouraged".<br>A explicação e a referência foram atualizadas, e o gabarito a continua correto. Na ERS 2017 (PMC6054534), o DNAH11 tem ultraestrutura normal e cílios "hyper-frequent, stiff", com batimento "hyperkinetic ... with reduced proximal axonemal bending". A vinheta (batimento rígido, ultraestrutura normal, situs inversus) é coerente. |
| **Sjögren, ACR/EULAR 2016; conta refeita** (his-03-q26) | **Correta, sem alteração.** Conta refeita por script: 6 focos/12 mm² = 0,5 foco/mm² = **2 focos/4 mm²**. Biópsia (peso 3) + Schirmer de 4 mm/5 min em um olho (≤ 5 mm, peso 1) = **4 pontos**, o mínimo. Tabela 3 do texto integral (PMC5650478): "score ≥ 4 when summing the weights"; "focus score ≥ 1 foci/4 mm²". A inclusão vale pelas perguntas 4 e 5, e as sete exclusões conferem. A recomendação da SBR 2019 só foi lida no resumo (PMID 31852541): "Minor salivary gland biopsy is recommended for all anti-Ro negative or incomplete criteria cases", coerente com a vinheta. |
| **Carcinoma invasivo de mama: p63/calponina** (his-03-q27) | **Correção importante.** Quinn et al., Histopathology 2023, no texto integral (PMC10107929):<br>- "at least two MEC markers ... usually a combination of a nuclear and cytoplasmic stain";<br>- p63 "with no expression in blood vessels or myofibroblasts", e os marcadores citoplasmáticos (actina de músculo liso, calponina, miosina de músculo liso) "tend to stain myofibroblasts";<br>- "The absence of MECs at the periphery of a lesion may support a diagnosis of invasive malignancy but must be interpreted in context and with caution", porque "encapsulated and solid papillary carcinoma may be categorised as in situ lesions despite the absence of a peripheral MEC layer".<br>A explicação dizia "o carcinoma in situ mantém" a camada, sem ressalva. Passou a dizer "carcinoma ductal in situ" e a registrar a exceção. Vinheta e gabarito c mantidos: ninhos irregulares infiltrando estroma denso. |
| **Carcinoma ex-adenoma pleomórfico** (his-03-q28) | **Correção importante.**<br>- Scarini et al., Front Oral Health 2023 (texto integral, PMC10149834; grupo da Unicamp): adenoma pleomórfico é o tumor salivar mais comum; "If untreated, ... up to 6.2% of PAs undergo malignant transformation"; "Multiple recurrences, male sex, advanced age, previous radiation therapy, and tumor size are the most frequently reported risk factors".<br>- Antony et al. 2012 (resumo): carcinoma "arising from a primary or recurrent benign pleomorphic adenoma".<br>A explicação de (a) dizia que a recidiva "continuaria benigna, sem o componente atípico infiltrativo". Foi corrigida: a recidiva é benigna em si, mas o carcinoma pode surgir nela. Os fatores de risco foram ampliados, sem percentuais. Gabarito d mantido. |
| **Marfan** (his-04-q27) | **Correta; correção menor (referência).** Loeys et al. 2010 (Ghent revisada, resumo, PMID 20591885): "aortic root aneurysm and ectopia lentis are the cardinal clinical features. In the absence of any family history, the presence of these two manifestations is sufficient for the unequivocal diagnosis". A ressalva da 1ª etapa (degeneração da média inespecífica, Halushka 2016) se mantém. |
| **Anafilaxia: triptase (WAO 2020)** (his-04-q29) | **Correta, sem alteração.** WAO 2020 relida no texto integral (PMC7607509):<br>- "increased from 15 min to 3 h or even longer, after the onset; levels peak between 1 and 2 h";<br>- "normal levels do not exclude anaphylaxis";<br>- basal "at least 24 h after resolution";<br>- "neither does a normal baseline tryptase" exclui mastocitose.<br>**A incerteza antiga ("Momento ideal de coleta da triptase omitido") estava desatualizada e foi reescrita** com a cinética conferida. A correlação básica continua com a forma qualitativa "sobe nas primeiras horas", compatível. O guia da ASBAI segue não conferido: asbai.org.br e aaai-asbai.org.br estão sem conexão. |
| **Ehlers-Danlos hipermóvel** (his-04-q30) | **Falsa, como no gabarito; correção menor (referência).** "O mais comum", que estava pendente, foi conferido no texto integral de Forghani 2019 (PMC6335943): "The 2017 classification describes 13 subtypes of EDS, with hEDS being the most common subtype". Malfait 2017 (resumo): o diagnóstico definitivo de todos os subtipos, "except for the hypermobile type", depende de variante causal. |
| **Lipossarcomas: MDM2, t(12;16)** (his-05-q30, q31) | **Corretas; correções menores.** Lee et al., J Clin Oncol 2018, no texto integral (PMC5759315):<br>- WDLPS "also known as atypical lipomatous tumor";<br>- MDM2 "amplified in nearly 100% of patients" com WDLPS ou DDLPS;<br>- "Over 90% of MLPSs contain a pathognomonic t(12;16)(q13;p11)" (FUS-DDIT3).<br>"O achado mais específico do lipossarcoma bem diferenciado" foi trocado por "distingue do lipoma", com a menção ao desdiferenciado e ao termo "tumor lipomatoso atípico" (OMS). Pares e gabarito mantidos. |
| **Deficiência congênita de leptina** (his-05-q29, q30) | **Correta; correção menor (referência).** von Schnurbein et al., JCEM 2024, no texto integral (PMC11403321):<br>- "severe early-onset obesity usually associated with low or undetectable circulating leptin levels";<br>- hiperfagia;<br>- há formas com leptina imunorreativa normal ou alta (bioinativa ou antagonista), registrado em incertezas.<br>Resposta à leptina recombinante: Farooqi et al. 2002 (resumo). O texto integral (PMC150795) não abriu. |
| **Gordura parda no PET** (his-05-q30) | **Correta; correção menor.**<br>- Cypess et al., NEJM 2009, no texto integral (PMC2859951): depósito "cervical–supraclavicular" é o mais comum, com densidade de gordura na TC e adipócitos multiloculares UCP1+; detecção inversamente relacionada à "outdoor temperature" (P = 0,02).<br>- Cohade et al. 2003 (resumo): "typically bilateral and symmetric", "should not be misinterpreted as a malignant metastatic process".<br>A explicação ganhou a ressalva de não confundir com metástase. |

As demais questões avançadas foram conferidas e ficaram sem alteração:
- his-01-q28, q29 e q30;
- his-02-q28;
- his-03-q29 e q30;
- his-04-q26 e q28;
- his-05-q27 e q28.

As correções da 1ª etapa nelas (macrófagos residentes, termogênese sem UCP1, anel de sinete) são compatíveis com a patologia.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| his-01-q26 | referencia | Hammond 2010; Allison 2020 | + Cho et al., J Breast Cancer 2021 (síntese da atualização de 2020) | **Menor.** Allison 2020 sem texto integral na rede; fonte secundária aberta reproduz a regra "uninterpretable" de 2020 | PMC7920867; Hammond, PMC3073033 |
| his-01-q27 | explicacao | "birrefringência verde-maçã ... confirma"; tipagem "imuno-histoquímica, imunofluorescência ou espectrometria de massa"; "(a) ... a cor não informa o tipo" | "birrefringência, classicamente descrita como verde-maçã (... cores anômalas)"; "ou, de preferência, espectrometria de massa"; "(a) ... o vermelho Congo não identifica o tipo da proteína precursora" | **Menor.** Precisão terminológica e de método | SBC 2021, PMC8462947; Howie e Owen-Casey 2022, PMC9518257 |
| his-01-q27 | referencia | Robbins; Junqueira; Bancroft | + Simões et al. (SBC 2021); Howie e Owen-Casey 2022 | idem | idem |
| his-02-q29 | explicacao | "A diretriz da ERS (2017) recomenda prosseguir a investigação..." | "As diretrizes conjuntas da ERS e da ATS (2025), que unificaram as anteriores, afirmam que nenhum exame isolado exclui a DCP..., que a persistência após cultura mostra o caráter primário e que se deve buscar a confirmação genética (a)" | **Menor.** Diretriz substituída; conteúdo e gabarito continuam corretos | Shoemark et al. 2025, PMC13101888 |
| his-02-q29 | referencia | Lucas (ERS 2017); Junqueira | + Shoemark et al. (ERS/ATS 2025), em primeiro lugar | idem | idem |
| his-02-q30 | referencia | Porro; Moore; Brazel | + Fagundes et al., An Bras Dermatol 2021 | **Menor.** Fonte brasileira em texto integral confirma a Dsg3 nas camadas subcórneas do recém-nascido | PMC8441454 |
| his-03-q27 | explicacao | "a maioria das lesões benignas e o carcinoma in situ mantêm a camada..." | "...e o carcinoma ductal in situ mantêm..." + "A ausência de mioepitélio é sempre lida junto com a morfologia...; o carcinoma papilífero encapsulado e o papilífero sólido podem ser classificados como in situ, embora não tenham mioepitélio na periferia" | **Importante.** A explicação generalizava ("ausência de mioepitélio = invasivo"), uma armadilha conhecida | Quinn et al. 2023, PMC10107929 |
| his-03-q27 | referencia | OMS; Werling; Junqueira; Ross | + Quinn et al., Histopathology 2023 | idem | idem |
| his-03-q28 | explicacao | "risco que aumenta com o tempo de evolução"; "(a) ... a recidiva ... continuaria benigna, sem o componente atípico infiltrativo" | "o risco aumenta com o tempo de evolução sem tratamento, a idade, o tamanho do tumor e as recidivas múltiplas"; "(a) ... afasta a recidiva; a recidiva é, em si, benigna, e um componente atípico e infiltrativo também indicaria carcinoma ex-adenoma pleomórfico, que pode surgir no tumor primário ou numa recidiva" | **Importante.** A explicação de (a) contradizia a definição e os fatores de risco | Scarini et al. 2023, PMC10149834; Antony et al. 2012, PMID 21744105 |
| his-03-q28 | referencia | Robbins; Ross | + Scarini et al. 2023; Antony et al. 2012 | idem | idem |
| his-04-q27 | referencia | Ross; Junqueira; Halushka | + Loeys et al. 2010 (Ghent revisada) | **Menor.** Fonte do critério clínico da vinheta | PMID 20591885 |
| his-04-q30 | referencia | Malfait 2017 | + Forghani, Balkan Med J 2019 | **Menor.** "O mais comum" conferido no texto integral | PMC6335943 |
| his-04 | incertezas[4] (antiga) | "Momento ideal de coleta da triptase omitido; o texto usa 'primeiras horas'..." | Cinética conferida na WAO 2020 (15 min a 3 h ou mais; pico 1–2 h; basal ≥ 24 h após a resolução), presente na q29; correlação mantém "primeiras horas"; ASBAI ainda não conferido | **Menor.** Incerteza desatualizada (pedido explícito) | WAO 2020, PMC7607509 |
| his-05-q29 | referencia | Ross; Robbins | + von Schnurbein et al. 2024; Farooqi et al. 2002 | **Menor.** Fonte primária da deficiência congênita | PMC11403321; PMID 12393845 |
| his-05-q30 | explicacao | "A amplificação de MDM2 ... é o achado mais específico do lipossarcoma bem diferenciado"; "capta FDG no PET-CT." | "...presente em praticamente todos os lipossarcomas bem diferenciados (tumores lipomatosos atípicos) e também nos desdiferenciados, distingue esse tumor do lipoma"; "...capta FDG..., em geral de forma bilateral e simétrica, em tecido com densidade de gordura na TC, o que não deve ser confundido com metástase em linfonodo" | **Menor.** Precisão (MDM2 não é exclusivo do bem diferenciado) e terminologia da OMS; armadilha clássica do PET | Lee et al. 2018, PMC5759315; Cypess et al. 2009, PMC2859951; Cohade et al. 2003, PMID 12571205 |
| his-05-q30 | referencia | Robbins; OMS; Rabbitts; Sirvent; Ross | + Lee 2018; Cypess 2009; Cohade 2003 | idem | idem |
| his-05-q31 | explicacao / referencia | "O achado mais específico do lipossarcoma bem diferenciado é a amplificação de MDM2" | "O achado que sustenta o diagnóstico do lipossarcoma bem diferenciado (tumor lipomatoso atípico) e o distingue do lipoma é a amplificação de MDM2"; + Lee 2018 | **Menor.** Mesma precisão | PMC5759315 |

Também acrescentei, sem alterar nada que já existia:
- **em `referencias`, 15 entradas:**
  - his-01: SBC 2021; Howie e Owen-Casey 2022; Cho 2021;
  - his-02: Shoemark (ERS/ATS 2025); Fagundes 2021;
  - his-03: Quinn 2023; Scarini 2023; Antony 2012;
  - his-04: Loeys 2010; Forghani 2019;
  - his-05: Lee 2018; Cypess 2009; Cohade 2003; von Schnurbein 2024; Farooqi 2002.
- **em `notasDivergencia`, 1 entrada:** his-01, a cor da birrefringência do amiloide.
- **em `incertezas`, 1 entrada por tópico:** "Revisão de patologia da camada avançada (2026-11-10)", com os trechos decisivos e o que não foi lido.
- **em `revisao.agentes`, a entrada `revisor-patologia-avancado-v1` nos cinco arquivos,** com área `patologia/dermatologia/clinica`, data 2026-11-10 e veredito `aprovado-com-correcoes`.

## 3. Pontos para o revisor humano

1. **his-01-q26, rótulo de 2020.** Conferir no texto integral de Allison et al. 2020 (J Clin Oncol 38:1346; Arch Pathol Lab Med 144:545) se a categoria se chama "uninterpretable". A fonte secundária (Cho et al. 2021) usa esse termo citando Allison 2020; o modelo de laudo do CAP pode usar "cannot be determined". Se for outro nome, basta ajustar o rótulo das alternativas b e d.
2. **his-02, referências antigas da DCP.** A ERS 2017 e a ATS 2018 continuam em `referencias` e no conteúdo básico do tópico, fora do escopo desta revisão. Decidir se o conteúdo básico deve citar a diretriz unificada ERS/ATS 2025. Na q29, ela já aparece em primeiro lugar.
3. **his-02-q30.** O artigo original de Wu et al. (N Engl J Med 2000;343:31-35) continua não lido. Duas fontes em texto integral sustentam a formulação: Brazel 2021 e Fagundes 2021 (An Bras Dermatol).
4. **his-03-q26.** O texto integral das recomendações da SBR para o diagnóstico de Sjögren (Trevisani et al., Adv Rheumatol 2019) não abriu, porque o domínio BMC foi recusado pelo proxy. Só o resumo foi lido.
5. **his-03-q28.** A afirmação de que o risco aumenta "com o tempo de evolução" vem de Robbins e de Eneroth e Zetterberg 1974, nenhum dos dois lido; a série recente lida (Scarini 2023) fala em "untreated". Conferir em Robbins 10ª ed. A questão não usa percentuais.
6. **his-03-q27.** Os textos da OMS (Breast Tumours, 5ª ed.) não foram lidos. A ressalva sobre os carcinomas papilíferos vem de Quinn et al. 2023.
7. **his-04-q29.** Guia brasileiro de anafilaxia (ASBAI): os sites estão sem conexão nesta rede. Na WAO 2020, a equação de consenso aparece com a unidade "ng/L", provável erro de digitação. Isso não é cobrado.
8. **his-05.** A redação da OMS 2020 (Soft Tissue and Bone Tumours) e de Robbins 10ª ed. continua não lida. Também não foi lido o texto integral de Farooqi 2002 (PMC150795, indisponível pelas APIs).
9. **Opcional (conteúdo novo, não feito):**
   - uma questão sobre o padrão de serrilhado na imunofluorescência direta: em U na EBA e em N no penfigoide bolhoso e no anti-p200 (Santi 2019; Kridin e Ahmed 2019);
   - uma questão sobre leptina normal na deficiência congênita bioinativa (von Schnurbein 2024).
10. Continuam pendentes, como nas etapas anteriores, os números de capítulo de Junqueira 14ª ed. e de Ross 8ª ed.

## 4. Fontes acessadas (curl pelo proxy; sem WebFetch)

| Fonte | Acesso | Uso |
|---|---|---|
| Hammond et al., Arch Pathol Lab Med 2010 (PMC3073033) | Texto integral (OAI do PMC) | his-01-q26 |
| Allison et al., J Clin Oncol / Arch Pathol Lab Med 2020 (PMID 31928404, 31928354) | Só resumo (texto integral: hosts recusados) | his-01-q26 |
| Cho et al., J Breast Cancer 2021 (PMC7920867) | Texto integral (Europe PMC) | his-01-q26 |
| Simões et al., posicionamento da SBC sobre amiloidose cardíaca, Arq Bras Cardiol 2021 (PMC8462947) | Texto integral | his-01-q27 |
| Howie e Owen-Casey, Ann Med 2022 (PMC9518257) | Texto integral | his-01-q27 |
| Porro et al. (PMC6544031) e Santi et al. (PMC6544032), consensos da SBD 2019 | Texto integral | his-02-q26, q27, q30 |
| Shi et al. 2022 (PMC9599625); Kridin e Ahmed 2019 (PMC6817563); Duan et al. 2015 (PMC4451988) | Texto integral | his-02-q27 |
| Fagundes et al., An Bras Dermatol 2021 (PMC8441454) | Texto integral | his-02-q30 |
| Wu et al., N Engl J Med 2000 (PMID 10882766) | Sem resumo no PubMed nem no Europe PMC | his-02-q30 (não lido) |
| Lucas et al., ERS 2017 (PMC6054534) | Texto integral (OAI) | his-02-q29 |
| Shoemark et al., ERS/ATS 2025 (PMC13101888) | Texto integral (OAI; o Europe PMC deu erro 500) | his-02-q29 |
| Shiboski et al., ACR/EULAR 2016 (PMC5650478) | Texto integral (OAI) | his-03-q26 |
| Trevisani et al., SBR 2019 (PMID 31852541) | Só resumo (BMC recusado pelo proxy) | his-03-q26 |
| Quinn et al., Histopathology 2023 (PMC10107929) | Texto integral | his-03-q27 |
| Scarini et al., Front Oral Health 2023 (PMC10149834) | Texto integral | his-03-q28 |
| Antony et al., Head Neck Pathol 2012 (PMID 21744105, PMC3311945) | Resumo (o texto integral não abriu: erro 500 e página anti-robô) | his-03-q28 |
| Eneroth e Zetterberg 1974 (PMID 4365171); Egal et al. 2018 (PMID 30115468) | Só título (sem resumo) | his-03-q28 (não lidos) |
| Loeys et al., J Med Genet 2010 (PMID 20591885) | Resumo | his-04-q27 |
| Cardona et al., WAO 2020 (PMC7607509) | Texto integral | his-04-q29 |
| Malfait et al. 2017 (PMID 28306229); Forghani, Balkan Med J 2019 (PMC6335943) | Resumo / texto integral | his-04-q30 |
| Lee et al., J Clin Oncol 2018 (PMC5759315) | Texto integral (OAI) | his-05-q30, q31 |
| Cypess et al., N Engl J Med 2009 (PMC2859951) | Texto integral (OAI) | his-05-q30 |
| Cohade et al., J Nucl Med 2003 (PMID 12571205) | Resumo | his-05-q30 |
| von Schnurbein et al., JCEM 2024 (PMC11403321) | Texto integral | his-05-q29, q30 |
| Farooqi et al., J Clin Invest 2002 (PMID 12393845); Montague et al., Nature 1997 (PMID 9202122) | Resumos | his-05-q29 |

Hosts inacessíveis nesta sessão:
- recusados pelo proxy: ascopubs.org, meridian.allenpress.com, www.cap.org, www.asco.org, advancesinrheumatology.biomedcentral.com, web.archive.org, api.unpaywall.org, www.semanticscholar.org;
- erro 502: documents.cap.org;
- sem conexão: asbai.org.br e aaai-asbai.org.br;
- verificação anti-robô (reCAPTCHA): a página do GeneReviews no NCBI Bookshelf.

## 5. Testes

Rodei `cd /home/user/medgame && npm run validar-conteudo && npx vitest run` em 2026-11-10, depois das edições:
- `validar-conteudo`: "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441."
- vitest: 83 de 84 testes passaram. Falhou só `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, porque o desenho `pulmao` não tem lâmina correspondente. É a mesma falha registrada na 1ª etapa e vem de trabalho em andamento de outro agente (`src/modules/histologia/laminas/sistemas-c.tsx`, modificado no diretório de trabalho). Não tem relação com estes cinco arquivos.
- O script de verificação contra `git show HEAD` passou (ids, gabaritos, alternativas e entradas antigas preservados; `revisao.humano` = null).
