# Revisão H1: patologia/clínica (tópicos 1 a 4), 2ª etapa

- **Agente:** `revisor-patologia-clinica-v1`. Olhar de patologia geral, clínica médica e laboratório.
- **Data:** 2026-11-09
- **Protocolo:** `docs/protocolo-revisao-agentes.md`, com a histologia como área-mãe. Formato: `docs/conteudo-schema.md`, seção "Histologia".
- **Etapa anterior:** `content/revisoes/h1-histologia.md`. Não refiz o que já estava conferido e não discordei de nenhuma correção da 1ª etapa. O item 14 dela (sarcomas que expressam citoqueratinas, na his-01-q12) foi incorporado à correção 1.
- **Arquivos editados (só estes):**
  - `content/histologia/topicos/his-01-metodos.json`
  - `content/histologia/topicos/his-02-epitelio-revestimento.json`
  - `content/histologia/topicos/his-03-epitelio-glandular.json`
  - `content/histologia/topicos/his-04-conjuntivo.json`
- **Garantias:**
  - Nenhum id foi alterado (tópicos, questões, alternativas, estruturas, eventos, correlações).
  - Nenhum gabarito, letra correta, `ordemCorreta` ou par de associação foi alterado.
  - Nenhum texto de alternativa de múltipla escolha foi alterado.
  - `revisao.humano` continua `null` nos quatro arquivos.
  - Nada foi commitado.
- **Situação:** revisão por agente (IA). Nada aqui substitui a conferência médica.

## 1. Resumo

Revisei todos os campos dos quatro tópicos (100 questões). O foco foi o pedido desta etapa:
- correlações clínicas e vinhetas;
- condutas e números clínicos;
- frases sensíveis;
- distratores.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-01 Métodos | 25 (14 MC, 5 V/F, 3 ordenar, 3 associar) | 0 | 1 | 4 | 5 | aprovado-com-correcoes |
| his-02 Epitélio de revestimento | 25 (14 MC, 5 V/F, 3 ordenar, 3 associar) | 0 | 0 | 4 | 4 | aprovado-com-correcoes |
| his-03 Epitélio glandular | 25 (14 MC, 5 V/F, 3 ordenar, 3 associar) | 0 | 0 | 6 | 6 | aprovado-com-correcoes |
| his-04 Tecido conjuntivo | 25 (14 MC, 5 V/F, 3 ordenar, 3 associar) | 0 | 0 | 7 | 7 | aprovado-com-correcoes |
| **Total** | **100** | **0** | **1** | **21** | **22** | |

**Gravidade:**
- **crítica:** fato errado ou gabarito errado;
- **importante:** ambiguidade, distrator defensável, explicação incorreta, ou conduta e critério clínico imprecisos;
- **menor:** redação, terminologia, precisão, atualização ou referência.

**Gabaritos.** Os 100 gabaritos estão corretos. Nenhuma questão tem mais de uma alternativa defensável. Os distratores das vinhetas são clinicamente plausíveis e nenhum depende de pegadinha:
- carcinoma × linfoma × sarcoma × hiperplasia reacional (his-01-q12);
- pênfigo vulgar × penfigoide × epidermólise bolhosa adquirida (his-02-q07, q08);
- discinesia ciliar primária × fibrose cística × metaplasia (his-02-q09);
- Barrett × metaplasia escamosa; adenocarcinoma × carcinoma epidermoide (his-02-q10);
- adenoma pleomórfico × adenocarcinoma × basocelular × lipoma (his-03-q12);
- Marfan × Ehlers-Danlos vascular × osteogênese imperfeita × Williams (his-04-q05, q06);
- queloide × cicatriz hipertrófica × tecido de granulação (his-04-q14).

**Checagens automáticas, iguais antes e depois:**
- Letras corretas das múltiplas escolhas: his-01 a4/b3/c4/d3; his-02 a3/b4/c4/d3; his-03 a4/b3/c3/d4; his-04 a3/b4/c4/d3. Nenhuma passa de 40%, então não houve redistribuição.
- Toda explicação de múltipla escolha continua citando a letra de cada alternativa.
- Questões com `contexto`: 7, 9, 7 e 10.

### O que conferi, item a item do pedido

| Tema | Onde está | Situação |
|---|---|---|
| Fixação e tempos ASCO/CAP | his-01 resumo, `fixacao-inadequada`, q01, q02 | Faixa de 6 a 72 h e "o mais curto possível (≤ 1 h)" estão corretas. Acrescentei o porquê da janela (falso-negativo; recuperação antigênica) e a atualização de HER2 de 2023, que reafirma a de 2018 (correção 3). |
| Congelação intraoperatória | his-01 resumo, `exame-de-congelacao`, q06, q07, q16 | Correta. A vinheta da q06 passou a nomear um tumor em que a margem por congelação é prática corrente (correção 2). |
| Imuno-histoquímica (painéis, marcadores) | his-01 resumo, `imuno-histoquimica-tumores`, q12, q19 | "Linfomas expressam CD45" era absoluto. Corrigido, com as exceções clássicas (correção 1). |
| Artefatos | his-01 resumo, q13, q14, q18 | Corretos. Sem correção. |
| Amiloide e esteatose | his-01 correlações, q07 | Corretos. Acrescentei a tipagem do amiloide e o uso real da coloração de lipídios (correções 4 e 5). |
| Metaplasia escamosa brônquica | his-02 resumo, correlação, q02, q11, q22 | Correta (células de reserva, reversibilidade, sequência até o carcinoma). Sem correção. |
| Esôfago de Barrett | his-02 correlação, q10, nota | Correto. Vinheta e correlação alinhadas ao critério ACG 2022 (correções 8 e 9). |
| Carcinomas, in situ × invasivo | his-02 correlação, q14, q22 | Corretos, inclusive a nomenclatura LSIL/HSIL do colo. Sem correção. |
| Pênfigo × penfigoide | his-02 resumo, correlações, q07, q08, q24 | Corretos: nível da clivagem, Nikolsky, padrão intercelular × linear na IFD, desmogleína 3 (e 1) × BP180/BP230. Sem correção. |
| Discinesia ciliar primária | his-02 resumo, correlação, q09, q25 | O resumo dizia só "imobilizam os cílios". Acrescentei o diagnóstico combinado e o fato de que microscopia eletrônica normal não exclui a doença (correções 6 e 7). |
| Fibrose cística e teste do suor | his-02-q09 (distrator), his-03 resumo, correlação, q10, q11 | Mecanismo (secreção × reabsorção de Cl⁻) correto. Infertilidade masculina e ponto de corte do teste do suor corrigidos (correções 10 e 11). |
| Sjögren | his-03 correlação | Correto. Acrescentei o critério histológico da biópsia de glândula salivar menor e o tipo de linfoma (correção 12). |
| Adenomas e adenocarcinomas | his-03 resumo, correlações, q12, q13 | Corretos. Acrescentei a via serrilhada, o carcinoma ex-adenoma pleomórfico e a precisão dos marcadores mioepiteliais (correções 13 a 15). |
| Glândulas sudoríparas | his-03 resumo, estrutura, q10, q23 | Corretas. Sem correção. |
| Escorbuto | his-04 resumo, correlação, q03, q04, q23 | Correto (vinheta realista, mecanismo, lisil-oxidase dependente de cobre). Sem correção. |
| Ehlers-Danlos | his-04 resumo, correlação, q06, q23 | Correto para o tipo vascular. Ajustei à classificação internacional de 2017 (correção 20). |
| Marfan | his-04 resumo, correlação, q05, q23 | Correto; a vinheta preenche os critérios de Ghent revisados (ectopia do cristalino + dilatação da raiz da aorta). Acrescentei a histopatologia da aorta (correção 21). |
| Osteogênese imperfeita | his-04-q05 (distrator), q23 | Correta. Alinhada à revisão de his-07 (correção 22). |
| Queloide e cicatrização | his-04 resumo, correlação, q14, q22 | Queloide correto. Na q22, a contração da ferida foi atribuída só à remodelação (correção 18). |
| Mastócitos e anafilaxia | his-04 resumo, correlação, q08, q09, q21 | Mecanismo e vinheta corretos. Conduta atribuída à diretriz; anafilaxia não mediada por IgE e triptase (correções 16 e 17). |
| Plasmócitos e mieloma | his-04 resumo, estrutura, q07, q16, q24 | Morfologia do plasmócito correta. **O mieloma não consta do conteúdo.** Não acrescentei (seção 3, item 10). |
| Edema | his-04 resumo, correlação, q13 | Correto. Cacifo inconstante e retenção de sódio acrescentados (correção 19). |

**Frases sensíveis.** Nada no conteúdo é orientação de tratamento a pacientes. Havia um único trecho de conduta: "emergência tratada com adrenalina intramuscular" (anafilaxia, na correlação e na his-04-q08). Ele estava correto e foi mantido em tom didático, com atribuição explícita à diretriz da WAO 2020 (correção 16). Outros trechos citam condutas só como fato didático, sem dose nem instrução, e foram mantidos:
- retirada de pólipos na colonoscopia;
- receptores hormonais e HER2 orientam o tratamento;
- recidiva do adenoma pleomórfico após excisão incompleta.

**Campo `fontes`.** O `TopicoSchema` (`src/content/schema.ts`) não tem esse campo. As fontes foram registradas onde o schema prevê:
- `referencias` do tópico: 1 nova no his-01, 4 no his-02, 6 no his-03 e 4 no his-04;
- `referencia` das questões alteradas;
- texto das `notasDivergencia` e das `incertezas`.

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | his-01-metodos (resumo); `imuno-histoquimica-tumores`; his-01-q12 | resumo; correlação.descricao; explicacao, referencia | "CD45 em linfomas"; "Linfomas (a) expressam CD45"; sarcomas "em geral" sem citoqueratina | "CD45 na **maioria** dos linfomas". Nenhum marcador é absoluto: as células de Reed-Sternberg do **Hodgkin clássico** e parte dos **linfomas anaplásicos** são CD45-negativas; **sarcoma sinovial e epitelioide** expressam citoqueratinas. Na q12, as exceções CD45-negativas em geral não expressam citoqueratina, e a resposta (b) se mantém. | "CD45-negativo exclui linfoma" é armadilha diagnóstica clássica, e a explicação a ensinava. Resolve também o item 14 da 1ª etapa. Gabarito (b) mantido. | importante | Robbins 10ª ed. (neoplasia; neoplasias de leucócitos) |
| 2 | his-01-q06 | contexto, referencia | "ressecção de um **tumor de pele**" | "ressecção de um **carcinoma basocelular da face**" | A margem intraoperatória por congelação é prática corrente nos carcinomas de pele não melanocíticos. A vinheta genérica podia sugerir que vale para qualquer tumor de pele (ver seção 3, item 3). Gabarito (c) mantido. | menor | Bancroft 8th ed. (cortes de congelação) |
| 3 | `fixacao-inadequada`; referencias; incertezas | descricao; mecanismo; nova referência | 6–72 h sem justificativa; só a diretriz de HER2 de 2018 | Faixa "reafirmada na atualização de HER2 de 2023"; fixação curta ou longa demais altera a imunorreatividade (resultados falsos, sobretudo falso-negativos). Mecanismo: as pontes do formol mascaram epítopos, daí a **recuperação antigênica** por calor. | Explica o número cobrado e dá a diretriz vigente | menor | ASCO/CAP HER2 2018 e 2023 (Wolff et al.); ER/PgR 2020 (Allison et al.) |
| 4 | `amiloide-vermelho-congo` | descricao | Vermelho Congo + birrefringência "confirma o diagnóstico" | Confirma **tratar-se de amiloide**. A **tipagem** (imuno-histoquímica, imunofluorescência ou espectrometria de massa) define o tipo (AL, ATTR), do qual depende a conduta. | Na prática, o diagnóstico só se completa com a tipagem | menor | Robbins 10ª ed. (amiloidose) |
| 5 | `lipidios-em-parafina` | descricao | "é preciso corar com Sudan… um corte de congelação" | Mantido, acrescentando: na rotina, a esteatose **macrovesicular** é reconhecida na HE; a pesquisa de lipídios fica para casos duvidosos, como a **microvesicular** | Evita a ideia de que toda biópsia hepática exige congelação. A q07 continua correta, porque pede como **provar** que era lipídio. | menor | Robbins 10ª ed. (fígado); Bancroft 8th ed. (lipídios) |
| 6 | his-02-epitelio-revestimento | resumo (Correlações) | DCP: "defeitos dos braços de dineína **imobilizam** os cílios" | "defeitos do axonema, sobretudo dos braços de dineína, tornam os cílios **imóveis ou discinéticos**" | Coerência com a correlação e a q09; muitos genótipos dão batimento anormal, não ausente | menor | ERS 2017 (Lucas et al.); ATS 2018 (Shapiro et al.) |
| 7 | `discinesia-ciliar-primaria`; his-02-q09; incertezas | descricao; explicacao, referencia | Sem menção ao diagnóstico | O diagnóstico combina óxido nítrico nasal, videomicroscopia do batimento ciliar, microscopia eletrônica e genética. **Microscopia eletrônica normal não exclui** a DCP, porque parte dos pacientes tem ultraestrutura normal. | A vinheta da q09 usa a ME e poderia ensinar que ela é exame definitivo. Gabarito (d) mantido. | menor | ERS 2017; ATS 2018 |
| 8 | his-02-q10 | contexto, referencia | "mucosa **avermelhada**… estendendo-se acima da junção" | "mucosa **cor de salmão**… estendendo-se por **cerca de 3 cm** acima da junção" | Descrição endoscópica clássica; a extensão satisfaz o critério de ≥ 1 cm do ACG e da BSG. Gabarito (c) mantido. | menor | ACG 2022 (Shaheen et al.); BSG 2014 (Fitzgerald et al.) |
| 9 | `esofago-de-barrett`; notasDivergencia; referencias | descricao; nota | Sem critério diagnóstico; nota só sobre caliciformes | Critério do ACG 2022: mucosa colunar ≥ 1 cm acima da JEG + metaplasia intestinal na biópsia. A nota agora registra que as duas diretrizes exigem ≥ 1 cm e que só o ACG exige caliciformes. | Critério vigente, cobrado em prova | menor | ACG 2022; BSG 2014 |
| 10 | his-03-epitelio-glandular (resumo); `fibrose-cistica` | resumo; descricao | "secreções espessas obstruem… ductos genitais masculinos (infertilidade)" | A maioria dos homens é infértil, em geral por **ausência congênita bilateral dos ductos deferentes** (azoospermia obstrutiva) | O mecanismo clínico é a ausência dos ductos deferentes, não só um tampão de secreção. É pergunta frequente de prova. | menor | Robbins 10ª ed. (fibrose cística); consenso CFF 2017 |
| 11 | `fibrose-cistica`; his-03-q10; referencias; incertezas | descricao; contexto, explicacao, referencia | "suor com cloreto elevado"; vinheta "concentração de cloreto elevada" | Cloreto **≥ 60 mmol/L** compatível com FC; **30–59 mmol/L** intermediário, com investigação complementar (estudo do CFTR). No Brasil, a triagem neonatal (teste do pezinho) dosa o **tripsinogênio imunorreativo**, e o teste do suor confirma. Vinheta: "cloreto acima de 60 mmol/L, confirmado em segunda amostra". | Número pedido ("teste do suor") com diretriz vigente; integra o fluxo brasileiro. Gabarito (c) mantido. | menor | Farrell et al., consenso CFF 2017; Athanazio et al., diretrizes brasileiras 2017; MS, manual de triagem neonatal 2016 |
| 12 | `sindrome-de-sjogren`; referencias | descricao | "há risco aumentado de linfoma" | Biópsia de glândulas salivares menores do lábio com **sialoadenite linfocítica focal**; **escore de foco ≥ 1** (≥ 1 agregado de ≥ 50 linfócitos por 4 mm²), que é, com o **anti-Ro/SSA**, um dos dois critérios de maior peso na classificação ACR/EULAR 2016. Linfoma sobretudo **B de zona marginal extranodal (MALT)**. | Correlação histológica direta do tópico e tipo de linfoma que o aluno encontra em prova | menor | Shiboski et al., ACR/EULAR 2016; Robbins 10ª ed. |
| 13 | `camada-mioepitelial-invasao`; referencias | descricao | Lesões benignas mantêm a camada mioepitelial; marcadores "p63 e actina de músculo liso" | "**A maioria** das lesões benignas"; marcadores p63, **calponina**, **cadeia pesada da miosina de músculo liso**; a actina de músculo liso marca também miofibroblastos; exceção: **adenose microglandular** (benigna, sem mioepitélio) | Prática atual e armadilha conhecida (actina no estroma) | menor | OMS, Breast Tumours, 5ª ed., 2019 |
| 14 | `adenoma-adenocarcinoma-colon`; referencias | descricao; mecanismo | Só a sequência adenoma–carcinoma (APC, KRAS, TP53) | Outra parte surge pela **via serrilhada** (lesões serrilhadas sésseis; BRAF, metilação, fenótipo CIMP) | Conceito atual (OMS 2019). A q13 continua inequívoca. | menor | OMS, Digestive System Tumours, 5ª ed., 2019; Robbins 10ª ed. |
| 15 | `adenoma-pleomorfico` | descricao | "raramente sofre transformação maligna" | "+ (carcinoma ex-adenoma pleomórfico), risco que aumenta com o tempo de evolução" | Termo do laudo e fator de risco | menor | Robbins 10ª ed. (glândulas salivares) |
| 16 | `anafilaxia`; his-04-q08; referencias | descricao; explicacao, referencia | "emergência tratada com adrenalina intramuscular" | "É uma emergência: segundo as diretrizes (WAO, 2020), o tratamento de primeira linha é a adrenalina intramuscular." O mesmo na q08. | Único trecho de conduta. Estava correto; agora tem atribuição explícita, em tom didático. Gabarito (a) mantido. | menor | Cardona et al., WAO Anaphylaxis Guidance 2020 |
| 17 | `anafilaxia`; incertezas | descricao; mecanismo | "com urticária…"; mecanismo só tipo I | Pele pode não ser acometida; **triptase sérica** sobe nas primeiras horas e apoia o diagnóstico (valor normal não exclui). Mecanismo: "**na maioria dos casos**" tipo I; opioides e contrastes podem ativar mastócitos sem IgE. | Precisão clínica e laboratorial; a triptase integra o grânulo do mastócito descrito no tópico | menor | WAO 2020 |
| 18 | his-04-q22 | itens 1 e 3 (texto); explicacao | Remodelação = "colágeno III → I **e contração por miofibroblastos**" | Granulação: "fibroblastos, **miofibroblastos**, capilares novos e colágeno III"; remodelação: "colágeno III → I e **ganho de resistência**". A explicação diz que a contração começa na granulação e pode prosseguir. | A contração da ferida começa na fase proliferativa; atribuí-la só à remodelação era impreciso. Ids e `ordemCorreta` mantidos; a sequência continua inequívoca. | menor | Robbins 10ª ed. (reparo tecidual) |
| 19 | his-04-conjuntivo (resumo); `edema` | resumo; descricao; mecanismo | Edema "na pele, como depressão persistente à compressão (cacifo)"; sem retenção de sódio | Cacifo "**muitas vezes**", e tende a desaparecer no **linfedema crônico** (fibrose); **retenção de sódio e água** (doença renal) entre as causas e no mecanismo | Robbins lista a retenção de sódio entre os mecanismos; o linfedema crônico é classicamente sem cacifo. A q13 não muda. | menor | Robbins 10ª ed. (distúrbios hemodinâmicos) |
| 20 | his-04-conjuntivo (resumo); `ehlers-danlos`; referencias | resumo; mecanismo | "doenças hereditárias do colágeno"; mutações em genes de colágenos ou enzimas | "Grupo de doenças hereditárias do conjuntivo, **a maioria** por defeitos do colágeno ou de seu processamento"; tipo clássico COL5A1/COL5A2; tipo **hipermóvel**, o mais comum, **sem gene identificado** | Classificação internacional vigente (2017) | menor | Malfait et al., 2017 |
| 21 | `sindrome-de-marfan`; referencias | mecanismo | Sem a histopatologia da aorta | Média com **fragmentação e perda de fibras elásticas** e **acúmulo de matriz mucoide** (degeneração da média, antes "necrose cística da média") | Ponte histologia–patologia e terminologia atual do consenso | menor | Halushka et al., 2016 (SCVP/AECVP); Robbins 10ª ed. |
| 22 | his-04-q23 | explicacao, referencia | "osteogênese imperfeita, o colágeno I do osso" | "Na maioria dos casos (formas autossômicas dominantes)…, com formas recessivas raras por genes do processamento do colágeno" | Coerência com a revisão de his-07 (H2, correção 14). O par da associação não muda. | menor | GeneReviews NBK1295 |

Registro em `revisao.agentes`, acrescentado depois da entrada da 1ª etapa nos quatro tópicos:

`{"area": "patologia/clinica", "agente": "revisor-patologia-clinica-v1", "data": "2026-11-09", "veredito": "aprovado-com-correcoes", "notas": "<n> correções (…)"}`

## 3. Pontos para o revisor humano

1. **ASCO/CAP.**
   - Resumos da ASCO e do CAP confirmam que a atualização de HER2 de 2023 reafirma a de 2018.
   - O texto integral não foi lido. A redação exata do tempo até a fixação continua pendente, como na 1ª etapa (item 2).
   - A citação 2023 está em `referencias` do his-01 com o DOI do Arch Pathol Lab Med. Conferir os dados da versão do J Clin Oncol.
2. **Fibrose cística (diretriz brasileira).**
   - O texto integral das *Diretrizes brasileiras de diagnóstico e tratamento da fibrose cística* (J Bras Pneumol 2017) não abriu: `jbp.org.br` está fora da rede desta sessão.
   - O ponto de corte ≥ 60 mmol/L e a faixa 30–59 mmol/L vêm do consenso CFF 2017. Estudos brasileiros descrevem como padrão dois testes com cloreto ≥ 60 mmol/L.
   - Conferir:
     - se a diretriz brasileira exige duas dosagens. A vinheta da q10 diz "confirmado em segunda amostra", o que vale nas duas leituras;
     - a redação do manual de triagem neonatal do MS (tripsinogênio imunorreativo em duas dosagens).
3. **Congelação em lesões melanocíticas (his-01-q06).**
   - Troquei "tumor de pele" por "carcinoma basocelular da face". Motivo: a avaliação de margens e o diagnóstico de lesões melanocíticas por congelação são, em geral, desaconselhados.
   - Não pus essa afirmação no conteúdo porque não conferi a redação das diretrizes de melanoma (SBD, SBP).
   - Se o humano quiser, ela pode entrar como nota.
4. **Cirurgia de Mohs.**
   - Não citei Mohs na q06. Nela, a congelação é o exame definitivo da margem, e isso contradiria a frase "o diagnóstico final é confirmado no material em parafina", válida para o exame intraoperatório convencional.
   - Decisão editorial: acrescentar uma nota que distinga os dois.
5. **Discinesia ciliar primária.**
   - "Parte dos pacientes" tem ultraestrutura normal. Algumas fontes citam cerca de 30%, mas o número não foi conferido no texto da ERS 2017 e foi omitido.
   - O jogo não cobra o número.
6. **Anafilaxia.**
   - A frase de tratamento foi atribuída à WAO 2020. O guia da ASBAI não foi conferido.
   - O momento de coleta da triptase ficou como "primeiras horas".
   - Decisão pedagógica: manter a frase de conduta num tópico de histologia ou reduzi-la à atribuição da fonte.
7. **Nomenclatura da esteatose (his-01-q07).**
   - A vinheta usa "doença hepática gordurosa".
   - O consenso multissocietário de 2023 propõe "doença hepática esteatótica associada à disfunção metabólica" (MASLD).
   - A terminologia em português ainda varia entre as sociedades brasileiras. Mantive o termo genérico, que não está errado.
8. **Distratores fracos, mas não injustos.**
   - **his-03-q12:** carcinoma basocelular e lipoma são pouco plausíveis para um nódulo de parótida. Uma alternativa mais instrutiva seria o **tumor de Warthin**, 2º tumor benigno da parótida, típico de homem tabagista mais velho, com epitélio oncocítico em dupla camada sobre estroma linfoide. Não troquei porque o item atual não é errado e a troca seria conteúdo novo.
   - **his-03-q13 (d):** "metaplasia intestinal" no cólon é conceitualmente impossível. O distrator é claramente errado, mas pouco plausível.
9. **Filariose.** O Brasil foi validado pela OMS, em 2024, como tendo eliminado a filariose linfática como problema de saúde pública. A citação como causa de linfedema (his-04) continua correta. Se o humano quiser contexto brasileiro, pode acrescentar a ressalva.
10. **Temas do pedido ausentes do conteúdo.** Nada disto foi implementado. São propostas ao redator, porque criar uma correlação nova exigiria a 1ª etapa antes.
    - **Mieloma múltiplo (his-04, plasmócito):**
      - proliferação monoclonal de plasmócitos na medula;
      - plasmócitos atípicos, corpúsculos de Russell e de Dutcher;
      - componente M (proteína monoclonal) e cadeias leves (Bence Jones);
      - lesões líticas, hipercalcemia, anemia e insuficiência renal (cilindros de cadeias leves);
      - amiloidose AL, que integra a correlação de amiloide do his-01.
    - **Pênfigo foliáceo endêmico (fogo selvagem), his-02:**
      - forma brasileira do pênfigo foliáceo, contra desmogleína 1, com clivagem subcórnea;
      - hoje só aparece como distrator na q08;
      - boa integração regional com o modelo da compensação das desmogleínas, que explica a ausência de lesão mucosa.
    - **Tumor de Warthin (his-03):** como correlação ou como distrator (item 8).
11. **Itens da 1ª etapa ainda pendentes.** Continuam válidos os capítulos de Junqueira 14ª ed. e Ross 8ª ed., a redação exata ASCO/CAP, a decisão sobre as meias-luas serosas e a ordem dos eventos da epiderme (itens 1, 2, 4 e 13 de `h1-histologia.md`).

## 4. Fontes consultadas nesta sessão (busca pontual)

- ASCO/CAP, HER2 2023:
  - recomendações do CAP: https://documents.cap.org/documents/asco-cap-her2-recommendations.pdf
  - perguntas frequentes do CAP, 2023: https://documents.cap.org/documents/her2_breast_update_faqs_2023.pdf
  - tabela-resumo da ASCO, 2023: https://old-prod.asco.org/sites/new-www.asco.org/files/content-files/practice-patients/documents/2023-HER2-Testing-in-Breast-Cancer-Update-Summary-Table.pdf
  - página do CAP: https://www.cap.org/protocols-and-guidelines/cap-guidelines/current-cap-guidelines/recommendations-for-human-epidermal-growth-factor-2-testing-in-breast-cancer
- Teste do suor:
  - estudo brasileiro (Frontiers in Pediatrics, 2017): https://www.frontiersin.org/articles/10.3389/fped.2017.00222/pdf
  - consenso CFF 2017: https://mdedge.com/content/new-cf-guidelines-include-lower-sweat-chloride-threshold e https://guidelinecentral.com/guideline/25047
- Diretrizes brasileiras de fibrose cística: https://portaldeboaspraticas.iff.fiocruz.br/biblioteca/diretrizes-brasileiras-de-diagnostico-e-tratamento-da-fibrose-cistica/ (página de referência). O texto em `jbp.org.br` e em `www.scienceopen.com` **não abriu**: os dois hosts estão fora da rede desta sessão.
- Discinesia ciliar primária:
  - ERS 2017: https://discovery.dundee.ac.uk/en/publications/european-respiratory-society-guidelines-for-the-diagnosis-of-prim/ e https://publications.ersnet.org/content/breathe/13/3/166
  - ATS 2018: https://www.thoracic.org/statements/resources/pldd/PCD-full-length.pdf

Os fatos abaixo foram citados de memória, de obras e diretrizes consagradas, e estão nas `referencias`:
- ACG 2022 e BSG 2014 (Barrett);
- ACR/EULAR 2016 (Sjögren);
- classificação internacional de Ehlers-Danlos (2017);
- consenso SCVP/AECVP de patologia da aorta (2016);
- WAO 2020 (anafilaxia);
- OMS 2019 (tumores digestivos e da mama);
- GeneReviews NBK1295 (osteogênese imperfeita).

## 5. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441.

$ npx vitest run
 Test Files  5 passed (5)
      Tests  41 passed (41)
```

Nenhum teste falhou durante esta revisão. O outro agente que mexe em `src/modules/histologia` não causou quebra.

Comparação estrutural com `HEAD`, feita por script:
- Nos quatro arquivos, só mudaram os campos listados na tabela, mais `referencias`, `notasDivergencia` (his-02), `incertezas` e `revisao.agentes`.
- Número de questões, ids, alternativas (textos e ids), pares de associação, ids de itens, gabaritos e `ordemCorreta` estão iguais.
- `revisao.humano` = `null` nos quatro.

Durante esta revisão havia alterações de outros agentes em outros arquivos do repositório (his-08 a his-10 e código em `src/modules/histologia`, este já commitado por eles). Não as toquei.

Nada foi commitado.
