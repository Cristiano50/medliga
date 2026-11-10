# Revisão HAV1 — histologia, camada avançada (tópicos 1 a 5)

- Agente: `revisor-histologia-avancado-v1` (1ª etapa, área-mãe histologia), com a conferência de fonte primária exigida desde 10/11/2026
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md` (seção Histologia)
- Escopo: só a camada avançada, ou seja, as questões com a tag `avancado` e as entradas acrescentadas no commit `b370699` em `referencias`, `notasDivergencia` e `incertezas`. Arquivos: `his-01-metodos.json` (q26–q30), `his-02-epitelio-revestimento.json` (q26–q30), `his-03-epitelio-glandular.json` (q26–q30), `his-04-conjuntivo.json` (q26–q30) e `his-05-adiposo.json` (q27–q31), em `content/histologia/topicos/`.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos cinco arquivos. Comparei com `git show HEAD` por script e confirmei os pontos abaixo:
  - Nenhum id mudou.
  - Nenhum gabarito mudou (`correta`, `ordemCorreta` e `pares`).
  - Nenhuma questão anterior à camada avançada foi tocada.
  - Referências, notas e incertezas antigas estão intactas. Só acrescentei entradas no fim das listas.
  - Nenhum arquivo além destes cinco e deste relatório foi editado.

## 1. Resumo

Revisei 25 questões: 16 de múltipla escolha, 3 V/F, 3 de ordenar e 3 de associar. Também revisei as 10 entradas novas em `referencias`, `notasDivergencia` e `incertezas`. **Não encontrei gabarito errado nem fato errado que exigisse correção crítica.** Quatro correções foram importantes:
- duas alternativas corretas generalizavam além do que a vinheta sustenta (his-04-q28; his-05-q27, tecido bege);
- um diagnóstico diferencial faltava (his-02-q27, salt-split);
- uma explicação sugeria um fato inexato (his-03-q27, calponina).

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-01 Métodos | 5 | 0 | 0 | 0 | 0 | aprovado |
| his-02 Epitélio de revestimento | 5 | 0 | 1 | 1 | 2 | aprovado-com-correcoes |
| his-03 Epitélio glandular | 5 | 0 | 1 | 0 | 1 | aprovado-com-correcoes |
| his-04 Conjuntivo | 5 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| his-05 Adiposo | 5 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **4** | **5** | **9** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão, bloom ou referência.

Checagens feitas por script nas 16 questões de múltipla escolha avançadas:
- ids das alternativas em a, b, c, d;
- explicação que cita a letra de cada alternativa;
- comprimento das alternativas. Em nenhuma questão a correta é a mais longa, e as diferenças são de poucos caracteres.

A distribuição das letras corretas de cada tópico não mudou: nenhuma letra passa de 40%.

Dificuldade (4–5) e bloom estão adequados, com duas exceções corrigidas:
- his-04-q30 é V/F de classificação genética, ou seja, memorização: bloom passou a `lembrar`;
- his-05-q31 é V/F sobre critério diagnóstico: bloom passou a `compreender`.

### Pontos de atenção pedidos: resultado um a um

| Questão | Resultado |
|---|---|
| his-01-q26 (RE com 4 h até o fixador, controle interno negativo) | **Correta.** Conferida no texto integral de Hammond et al. 2010 (PMC3073033, via OAI do PMC): "Uninterpretable for ER or PgR if finding that no tumor nuclei are immunoreactive and that internal epithelial elements present in the sample ... lack any nuclear staining"; entre as causas de resultado não interpretável, "samples where fixation was delayed for more than 1 hour"; fixação "no less than 6 hours and ... not more than 72 hours"; "an alternative potential sample for retesting should be suggested". A explicação do distrator c também está conferida: "the myoepithelial cells and the stromal cells must invariably show a negative result". **Allison 2020**: só o resumo pôde ser lido (PMID 31928404; texto integral em ascopubs.org e meridian.allenpress.com, fora da rede; documents.cap.org não conecta, "connect_unreachable"). O resumo mantém < 1% como negativo e manda relatar o estado dos controles nos casos com 0–10%; não diz se a categoria "não interpretável" foi mantida com esse nome. O conceito cobrado vale nas duas versões: não relatar como negativo e repetir em outra amostra. Fica para o humano (ver seção 3). |
| his-01-q28 (limite de resolução) | **Correta.** A resolução de ~0,2 µm não depende do aumento, e ampliar uma imagem já no limite só gera "aumento vazio". Coerente com o resumo do tópico (0,2 µm) e com a questão de ordens de grandeza (membrana 7,5–10 nm). Sem alteração. |
| his-02-q26 (fogo selvagem; compensação pela Dsg3 nas mucosas) | **Correta.** Porro et al. 2019 (PMC6544031) diz: "Dsg-1 expression is more intense in the upper portions of the epidermis, whereas ... Dsg-3 predominates in the lower layers of the epidermis and in mucous membranes"; "cleavage below the stratum corneum ... acantholytic keratinocytes in or adjacent to the granulosa layer"; "Neither DIF nor IIF distinguishes PF from PV"; e o fogo selvagem no Mato Grosso do Sul (reserva Terena de Limão Verde). Sem alteração. |
| his-02-q27 (salt-split com marcação do assoalho) | **Correção importante.** A marcação do assoalho **não é exclusiva da EBA**. Também ocorre:<br>- no penfigoide de membranas mucosas anti-laminina 332 (Shi et al. 2022, PMC9599625: "IgG autoantibodies against LM332 react with the dermal side of salt-split normal human skin");<br>- no penfigoide anti-p200, antilaminina γ1 (Kridin e Ahmed 2019, PMC6817563: lado dérmico em 90/108 casos e dérmico e epidérmico em 16/108);<br>- no lúpus bolhoso, citado por Santi et al. 2019 como diferencial que o salt-split ajuda a separar do penfigoide bolhoso.<br>A questão continua inequívoca, porque nenhum desses antígenos está entre as alternativas e o quadro mecanobolhoso (áreas de trauma, cicatrizes atróficas, milia, pouco infiltrado) é o da EBA clássica (Santi et al., PMC6544032). Para fechar o diferencial com o penfigoide anti-laminina 332, de predomínio mucoso, a vinheta passou a dizer "não há lesões nas mucosas". A explicação agora registra o diferencial e diz que o diagnóstico definitivo exige exames complementares (Santi: "The definite diagnosis of EBA requires additional techniques"). O gabarito c foi mantido. |
| his-02-q30 (pênfigo neonatal) | **Verdadeira; correção menor.** O consenso da SBD (Porro et al.) diz: "Neonatal pemphigus foliaceus is rarer than neonatal PV, due to the predominance of Dsg-3 compared with Dsg-1 in the newborn's skin". A formulação mais precisa é a de distribuição: Dsg3 em toda a espessura da epiderme do recém-nascido e, no adulto, só nas camadas profundas. Ela está em Brazel et al. 2021 (PMC8623226: "presence of desmoglein 3 throughout the epidermis. In comparison, desmoglein 3 is only present in the deep epidermis of adult skin"), que cita o estudo original (Wu et al., N Engl J Med 2000, PMID 10882766; o PubMed não traz resumo e o texto não foi lido). "Predomina sobre a desmogleína 1" é uma afirmação quantitativa difícil de sustentar numa V/F e foi trocada por "está presente também nas camadas superficiais da epiderme". A afirmação continua verdadeira. |
| his-03-q26 (escore de foco, ACR/EULAR 2016) | **Correta; conta refeita.** 6 focos em 12 mm² = 0,5 foco/mm² = **2 focos/4 mm²**. A biópsia com escore ≥ 1 vale 3 pontos, e o Schirmer de 4 mm/5 min em um olho vale 1 ponto (≤ 5 mm em pelo menos um olho): total de **4 pontos**, o mínimo para classificar. A inclusão vale pelas duas respostas positivas às perguntas orais ("daily feeling of dry mouth for more than 3 months"; "drink liquids to aid in swallowing dry food"), e a lista de exclusões confere. A Tabela foi conferida no texto integral (PMC5650478): "score ≥ 4 when summing the weights"; "focus score ≥ 1 foci/4 mm²". A definição de foco (≥ 50 células mononucleares) foi conferida em Fisher et al. 2017 (PMC5530351). Gabarito b correto. |
| his-03-q27 (p63 e calponina nos carcinomas invasivos) | **Correção importante na explicação.** A explicação da alternativa a dava a entender que a calponina, como a p63, não marca miofibroblastos. Werling et al. 2003 (PMID 12502930, resumo) diz: "No case showed p63 expression by myofibroblasts or vascular smooth muscle cells, whereas myofibroblasts expressed, in 8% and 76% of cases, SMM-HC and calponin". O texto passou a descrever o painel: p63, nuclear e sem marcação de miofibroblastos, lida junto com um marcador citoplasmático como a calponina. Gabarito c e vinheta mantidos: a calponina é negativa em torno dos ninhos, o que é compatível. |
| his-04-q26 (cenários experimentais em fibroblastos) | **Correta.** Os cinco pares são unívocos:<br>- sem ascorbato → hidroxilação deficiente;<br>- quelante de cobre → lisil-oxidase inativa;<br>- inibidor das peptidases → pró-colágeno que não se agrega;<br>- FBN1 → microfibrilas;<br>- COL3A1 → fibras reticulares.<br>Coerente com his-04-q17 (lisil-oxidase dependente de cobre) e q20 (etapas da síntese). Sem alteração. |
| his-04-q28 (origem dos macrófagos residentes e recrutados) | **Correção importante.** A alternativa correta dizia "Os residentes se mantêm sem monócitos", generalização que a vinheta ("vários órgãos") não sustenta e que é falsa para o intestino. Fontes:<br>- Bain et al. 2014 (PMC4169290, resumo): os macrófagos intestinais embrionários "did not persist ... replaced around the time of weaning by the CCR2-dependent influx of Ly6Chi monocytes ... had to be continued throughout adult life";<br>- Ginhoux e Guilliams 2016 (PMID 26982352, resumo): "several tissue-resident macrophage populations ... self-maintain independently of BM contribution";<br>- Hashimoto et al. 2013 (PMC3853406).<br>A alternativa a passou a "Os residentes desses órgãos se mantêm sem monócitos; os recrutados derivam deles", e a explicação registra a exceção intestinal. Gabarito a mantido. |
| his-04-q29 (coleta e interpretação da triptase) | **Correta.** WAO 2020, no texto integral (PMC7607509): "serum tryptase levels are increased from 15 min to 3 h or even longer, after the onset; levels peak between 1 and 2 h after the onset with 36–40% remaining < 11.4 μg/L"; basal "at least 24 h after resolution"; "Excluding urticaria pigmentosa does not exclude mastocytosis, neither does a normal baseline tryptase". A coleta em 1 h e a basal em 48 h estão de acordo. Sem alteração. |
| his-05-q27 (termogênese sem UCP1) | **Correção importante (ambiguidade).** A vinheta dizia "tecido adiposo multilocular de um mamífero". Isso incluiria o tecido bege, que é multilocular e tem termogênese independente da UCP1 por ciclos fúteis de creatina (Kazak et al. 2015, PMC4656041: "creatine reduction in Ucp1-deficient mice reduces core body temperature") e de Ca²⁺ via SERCA2b (Ikeda et al. 2017, PMC5727902: "a robust UCP1-independent thermogenic mechanism in beige fat", inclusive no porco, "a species that lacks a functional UCP1 protein"). Para o tecido pardo clássico, a resposta c está certa. Matthias et al. 2000 (PMID 10825155, resumo): células Ucp1-/- "were as potent as wild-type in norepinephrine-induced cAMP accumulation and lipolysis", com resposta térmica de "approximately 3%" da normal, e a ácidos graxos "practically without effect"; "no other adrenergically induced thermogenic mechanism exists in brown adipocytes except that mediated by UCP1". A vinheta passou a especificar o depósito interescapular de camundongos. Na explicação:<br>- o mecanismo foi precisado: os prótons só voltam pela ATP sintase, no ritmo do consumo de ATP, e a respiração não acelera;<br>- foi registrado o achado experimental, sem o percentual;<br>- foi registrada a exceção do tecido bege.<br>Gabarito c mantido. |
| his-05-q30 (t(12;16) no lipossarcoma mixoide) | **Correta; correção menor (referência).** A t(12;16)(q13;p11), com fusão FUS-CHOP (DDIT3), foi conferida em Rabbitts et al. 1993 (PMID 7503811) e Crozat et al. 1993 (PMID 8510758), nos resumos. A amplificação de MDM2-CDK4 no tumor lipomatoso atípico/lipossarcoma bem diferenciado foi conferida em Sirvent et al. 2007 (PMID 17895748). As referências primárias foram acrescentadas à questão e ao tópico. Os pares continuam unívocos. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| his-02-q27 | contexto | "…cicatrizes atróficas e milia." | "…cicatrizes atróficas e milia; não há lesões nas mucosas." | **Importante.** O assoalho também é marcado no penfigoide anti-laminina 332, de predomínio mucoso; o dado afasta esse diferencial. | Shi et al. 2022, PMC9599625; Santi et al. 2019, PMC6544032 |
| his-02-q27 | explicacao | Assoalho = "padrão clássico da EBA" | Acrescenta que o assoalho não é exclusivo da EBA (anti-laminina 332, anti-p200), que o quadro mecanobolhoso aponta para a EBA e que o diagnóstico definitivo exige exames complementares | **Importante.** Faltava o diferencial. | Shi et al. 2022; Kridin e Ahmed 2019, PMC6817563; Santi et al. 2019 |
| his-02-q27 | referencia | Santi; Ross | + Shi et al. 2022; Kridin e Ahmed 2019 | Fontes do diferencial | idem |
| his-02-q30 | enunciado | "na pele do recém-nascido a desmogleína 3 predomina sobre a desmogleína 1" | "na pele do recém-nascido, ao contrário da do adulto, a desmogleína 3 está presente também nas camadas superficiais da epiderme" | **Menor.** Precisão: a compensação vem da distribuição da Dsg3. Continua verdadeira. | Brazel et al. 2021, PMC8623226 (cita Wu et al., NEJM 2000); Porro et al. 2019 |
| his-02-q30 | explicacao / referencia | "predomina a desmogleína 3" | Dsg3 "restrita às camadas profundas da epiderme no adulto, está presente em toda a sua espessura"; + Brazel et al. 2021 | idem | idem |
| his-03-q27 | explicacao (a) | "…e por isso se usam marcadores como p63 e calponina" | Painel: p63 nuclear, que não cora miofibroblastos, lida com um marcador citoplasmático como a calponina, que pode corá-los em parte dos casos | **Importante.** A calponina marca miofibroblastos em parte dos casos. | Werling et al. 2003, PMID 12502930 |
| his-03-q27 | referencia | OMS; Junqueira; Ross | + Werling et al. 2003 | Fonte | idem |
| his-04-q27 | explicacao | "(degeneração da média…) (d)" | + "Esse padrão não é exclusivo do Marfan…; é o quadro clínico que aponta para FBN1" | **Menor.** As alterações da média são inespecíficas. | Halushka et al. 2016, PMID 27031798 ("both distinct and nonspecific histopathologic changes") |
| his-04-q28 | alternativa a | "Os residentes se mantêm sem monócitos; os recrutados na inflamação derivam deles" | "Os residentes desses órgãos se mantêm sem monócitos; os recrutados derivam deles" | **Importante.** A generalização é falsa para o intestino adulto. | Bain et al. 2014, PMC4169290; Ginhoux e Guilliams 2016 |
| his-04-q28 | explicacao / referencia | "parte dos macrófagos residentes…" | "várias populações…" + exceção intestinal; + Ginhoux e Guilliams 2016; Bain et al. 2014 | idem | idem |
| his-04-q30 | bloom | analisar | lembrar | **Menor.** V/F de memorização (classificação genética). | — |
| his-05-q27 | contexto | "tecido adiposo multilocular de um mamífero"; "(4) … de um animal geneticamente sem UCP1" | "depósito interescapular de tecido adiposo multilocular (pardo clássico) de camundongos"; "(4) … do mesmo depósito de um camundongo geneticamente sem UCP1" | **Importante.** O tecido bege, também multilocular, tem termogênese sem UCP1. | Matthias et al. 2000; Kazak et al. 2015; Ikeda et al. 2017 |
| his-05-q27 | explicacao / referencia | "os prótons voltam pela ATP sintase, e a energia do gradiente não é dissipada como calor" | Prótons só pela ATP sintase, no ritmo do consumo de ATP; respiração não acelera; achado experimental (lipólise normal, resposta térmica praticamente abolida); exceção do tecido bege; + Matthias, Kazak, Ikeda | Precisão do mecanismo e da exceção | idem |
| his-05-q30 | referencia | Robbins; OMS; Ross | + Rabbitts et al. 1993; Sirvent et al. 2007 | **Menor.** Fonte primária dos dados moleculares | PMID 7503811, 8510758, 17895748 |
| his-05-q31 | bloom / referencia | analisar; OMS, Robbins, Junqueira | compreender; + Hisaoka 2014 | **Menor.** V/F conceitual; fonte de "lipoblastos não são pré-requisito" | Hisaoka 2014, PMID 24930875: "lipoblasts are not a prerequisite for the diagnosis of liposarcoma partly because of some benign tumors harboring lipoblasts" |

Também acrescentei, sem mudar nada que já existia:
- em `referencias`, 12 entradas:
  - his-02: Shi 2022; Kridin e Ahmed 2019; Brazel 2021;
  - his-03: Werling 2003;
  - his-04: Ginhoux e Guilliams 2016; Bain 2014;
  - his-05: Matthias 2000; Kazak 2015; Ikeda 2017; Rabbitts 1993 (com Crozat 1993); Sirvent 2007; Hisaoka 2014.
- em `incertezas`, uma entrada "Revisão da camada avançada (histologia, 2026-11-10)" em his-02 a his-05, com os trechos decisivos e o que não foi lido;
- em `revisao.agentes`, a entrada `revisor-histologia-avancado-v1` nos cinco arquivos.

### Questões sem alteração (conferidas)

- **his-01-q27** (vermelho Congo): a birrefringência sob polarização e a tipagem da proteína estão corretas.
- **his-01-q29** (etapas da imuno-histoquímica): a sequência é inequívoca para os itens listados. A omissão da contracoloração já está registrada.
- **his-01-q30** (glândula sudorípara écrina cortada várias vezes): a glândula apócrina também é tubulosa simples enovelada, mas não está entre as alternativas, e a écrina é a "mais provável" numa pele de região não especificada.
- **his-02-q28** (zônula de oclusão e via paracelular): correta.
- **his-02-q29** (DCP com ultraestrutura normal): ERS 2017 no texto integral (PMC6054534) diz: "normal ciliary ultrastructure ... does not exclude the diagnosis of PCD (16% ...)"; "Further diagnostic investigations should be performed in patients with normal ultrastructure if the clinical history is strong"; e, para DNAH11, ultraestrutura normal com batimento hipercinético.
- **his-03-q28** (carcinoma ex-adenoma pleomórfico), **his-03-q29** (associações de FC, ducto estriado e Sjögren) e **his-03-q30** (camadas da unidade ductal): corretas.
- **his-05-q28** (anel de sinete: PAS e citoqueratinas): o PAS-positivo em célula epitelial é lido no contexto de células isoladas que infiltram a parede.
- **his-05-q29** (deficiência de leptina × resistência): Considine et al. 1996 (PMID 8532024) mostra leptina correlacionada com a gordura e insensibilidade na obesidade comum; Farooqi et al. 1999 (PMID 10486419), pelo título, mostra resposta à leptina recombinante na deficiência congênita.

**Resultado dos testes** (`cd /home/user/medgame && npm run validar-conteudo && npx vitest run`, 2026-11-10):
- `validar-conteudo`: "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441."
- vitest: 83 de 84 testes passaram. Falhou só `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, porque o desenho `pulmao` não tem lâmina correspondente. É trabalho em andamento de outro agente (desenho de lâminas), sem relação com estes cinco arquivos. O teste de ids de alternativas passou.

## 3. Pontos para o revisor humano

1. **his-01-q26 e a diretriz de 2020.** Conferir no texto integral de Allison et al. 2020 (J Clin Oncol 38:1346; Arch Pathol Lab Med 144:545) se a categoria "uninterpretable" (resultado 0% com controle interno negativo, ou pré-analítica fora do padrão) manteve esse nome. Se a atualização usar outra denominação, como "cannot be determined" no modelo de laudo do CAP, basta ajustar o rótulo das alternativas b e d. O conceito cobrado não muda.
2. **his-02-q30.** Conferir no artigo original de Wu et al. (N Engl J Med 2000;343:31-35) a descrição exata da distribuição da Dsg3 e da Dsg1 na pele neonatal. O consenso da SBD fala em "predomínio"; a questão agora usa "presente também nas camadas superficiais".
3. **his-02-q27.** Se o professor quiser cobrar o diferencial do assoalho, pode criar uma questão sobre o penfigoide anti-laminina 332 ou o anti-p200. A q27 atual ficou inequívoca com as alternativas que tem.
4. **his-05-q27.** Os textos integrais de Matthias et al. 2000 e de trabalhos mais recentes sobre ciclos fúteis no próprio tecido pardo (creatina, Ca²⁺) não foram lidos. A questão agora se limita ao depósito interescapular de camundongo, o modelo do estudo de Matthias. Vale confirmar que nenhum dado posterior contradiz a "resposta térmica praticamente abolida" nesse modelo.
5. **his-03-q27.** Só o resumo de Werling et al. 2003 foi lido. A explicação usa apenas o dado qualitativo (a calponina pode marcar miofibroblastos), sem o percentual.
6. **his-04-q28.** Os resumos de Ginhoux e Guilliams 2016, Hashimoto et al. 2013 e Bain et al. 2014 foram lidos, os textos integrais não. A exceção intestinal é bem estabelecida em camundongos. Em humanos, a renovação dos macrófagos residentes é menos estudada, mas a questão é explicitamente experimental, em camundongos.
7. **his-04-q30.** "O tipo hipermóvel, o mais comum" vem de conteúdo já revisado do tópico. Malfait et al. 2017 (resumo) e GeneReviews (Hakim, atualização de 2024) confirmam a falta de gene identificado. A frequência relativa não foi lida no texto integral.
8. **his-05-q30 e q31.** Os fatos moleculares foram conferidos em artigos originais (resumos). A redação da OMS 2020 (Soft Tissue and Bone Tumours) e de Robbins 10ª ed. continua não lida.
9. Continuam pendentes, como nas etapas anteriores, os números de capítulo de Junqueira 14ª ed. e de Ross 8ª ed. citados nas questões avançadas.
10. Na incerteza antiga de his-04 ("Momento ideal de coleta da triptase omitido"), a q29 agora traz a cinética conferida na WAO 2020. A incerteza antiga não foi editada (fora do escopo) e pode ser atualizada pelo humano.

## 4. Fontes acessadas (curl pelo proxy; sem WebFetch)

| Fonte | Acesso | Uso |
|---|---|---|
| Hammond et al., Arch Pathol Lab Med 2010 (PMID 20524868, PMC3073033) | Texto integral (OAI do PMC; o Europe PMC deu erro 500) | his-01-q26 |
| Allison et al., J Clin Oncol 2020 (PMID 31928404) | Só o resumo (E-utilities) | his-01-q26 |
| Porro et al., An Bras Dermatol 2019 (PMC6544031) | Texto integral (Europe PMC) | his-02-q26, q30 |
| Santi et al., An Bras Dermatol 2019 (PMC6544032) | Texto integral | his-02-q27 |
| Shi et al., Biomolecules 2022 (PMC9599625); Kridin e Ahmed, Front Immunol 2019 (PMC6817563) | Texto integral | his-02-q27 |
| Brazel et al., Medicina 2021 (PMC8623226); Hans-Filho et al., "Fogo selvagem: endemic pemphigus foliaceus", An Bras Dermatol 2018 (PMC6106655) | Texto integral | his-02-q30 |
| Lucas et al., ERS 2017 (PMC6054534) | Texto integral (OAI) | his-02-q29 |
| Shiboski et al., Arthritis Rheumatol 2017 (PMC5650478); Fisher et al., Ann Rheum Dis 2017 (PMC5530351) | Texto integral | his-03-q26 |
| Werling et al., Am J Surg Pathol 2003 (PMID 12502930) | Resumo | his-03-q27 |
| Cardona et al., WAO 2020 (PMC7607509) | Texto integral | his-04-q29 |
| Malfait et al. 2017 (PMID 28306229); GeneReviews hEDS (PMID 20301456); Halushka et al. 2016 (PMID 27031798) | Resumos | his-04-q27, q30 |
| Ginhoux e Guilliams 2016 (PMID 26982352); Hashimoto et al. 2013 (PMID 23601688); Bain et al. 2014 (PMID 25151491) | Resumos | his-04-q28 |
| Matthias et al. 2000 (PMID 10825155); Kazak et al. 2015 (PMID 26496606); Ikeda et al. 2017 (PMID 29131158) | Resumos | his-05-q27 |
| Considine et al. 1996 (PMID 8532024); Farooqi et al. 1999 (PMID 10486419, só título) | Resumo / título | his-05-q29 |
| Rabbitts et al. 1993 (PMID 7503811); Crozat et al. 1993 (PMID 8510758); Sirvent et al. 2007 (PMID 17895748); Hisaoka 2014 (PMID 24930875) | Resumos | his-05-q30, q31 |

Hosts inacessíveis nesta sessão: documents.cap.org ("connect_unreachable"), www.cap.org, ascopubs.org e www.asco.org (sem conexão).
