# Revisão H3: clínica/hematologia/neurologia (tópicos 8 a 10), 2ª etapa

- **Agente:** `revisor-clinica-v1`. Olhar de clínica médica, hematologia, neurologia, cardiologia, patologia e laboratório.
- **Data:** 2026-11-09
- **Protocolo:** `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`, seção "Histologia".
- **Etapa anterior:** `content/revisoes/h3-histologia.md`. Não refiz o que já estava conferido e não discordei de nenhuma correção da 1ª etapa.
- **Arquivos editados (só estes):**
  - `content/histologia/topicos/his-08-sangue-hematopoese.json`
  - `content/histologia/topicos/his-09-muscular.json`
  - `content/histologia/topicos/his-10-nervoso.json`
- **Garantias** (conferidas por script contra `git show HEAD`):
  - Nenhum id foi alterado (tópicos, questões, alternativas, itens, estruturas, eventos, correlações).
  - Nenhum gabarito, letra correta, `ordemCorreta` ou par de associação foi alterado. O número de questões é o mesmo (28, 27 e 26).
  - `revisao.humano` continua `null` nos três arquivos.
  - Uma entrada nova em `revisao.agentes` em cada arquivo, depois da entrada da 1ª etapa.
  - Nada foi commitado.
- **Situação:** revisão por agente (IA). Não substitui a conferência médica. Os tópicos continuam com o selo "Revisado por IA · conferência médica pendente".

## 1. Resumo

Revisei todos os campos dos três tópicos (81 questões). O foco foi o desta etapa: correlações clínicas e vinhetas, condutas, valores de referência e números clínicos, frases sensíveis e distratores.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-08 Sangue e hematopoese | 28 (15 MC, 7 V/F, 3 ordenar, 3 associar) | 0 | 2 | 7 | 9 | aprovado-com-correcoes |
| his-09 Tecido muscular | 27 (15 MC, 5 V/F, 4 ordenar, 3 associar) | 0 | 1 | 7 | 8 | aprovado-com-correcoes |
| his-10 Tecido nervoso | 26 (15 MC, 5 V/F, 3 ordenar, 3 associar) | 0 | 1 | 5 | 6 | aprovado-com-correcoes |
| **Total** | **81** | **0** | **4** | **19** | **23** | |

**Gravidade** (mesma convenção da H2 de patologia/clínica):
- **crítica:** fato errado ou gabarito errado;
- **importante:** ambiguidade, distrator defensável, explicação incorreta, ou conduta e critério clínico imprecisos;
- **menor:** redação, terminologia, precisão, atualização ou referência.

**Gabaritos.** Os 81 gabaritos estão corretos. Nenhuma questão tem mais de uma alternativa defensável. Os distratores das vinhetas são clinicamente plausíveis e nenhum depende de pegadinha:
- ferropriva × megaloblástica × esferocitose × hemorragia aguda (his-08-q07);
- LMA × LLC × megaloblástica × infecção (q08);
- desvio à esquerda × eosinofilia × hipersegmentação × linfocitose reativa (q05);
- Duchenne × titinopatia × desminopatia × miastenia (his-09-q11);
- miastenia × Lambert-Eaton × hipertermia maligna (q12);
- leiomioma × leiomiossarcoma × rabdomiossarcoma × adenomiose (q15);
- esclerose múltipla × Guillain-Barré × poliomielite × miastenia (his-10-q07, q08).

Um distrator ficou mais exposto: a alternativa (b) de his-10-q07 (astrócito), porque o astrócito é o alvo da neuromielite óptica. A vinheta continua com uma só resposta: lesões ovais periventriculares e bandas oligoclonais favorecem a esclerose múltipla. A explicação agora diz isso (correção 22).

**Checagens automáticas, iguais antes e depois:**
- Letras corretas: his-08 a4/b4/c4/d3; his-09 a4/b4/c4/d3; his-10 a3/b4/c4/d4. Nenhuma passa de 27%.
- Toda explicação de múltipla escolha cita a letra de cada alternativa.

### O que conferi, item a item do pedido

| Tema | Onde está | Situação |
|---|---|---|
| Anemia ferropriva, VCM, RDW | his-08 resumo, correlação `anemia-microcitica`, q07, q28 | O mecanismo estava correto. O critério de confirmação (ferritina) faltava, e "talassemias, principal diagnóstico diferencial" era discutível. Acrescentei o RDW e a investigação de perda digestiva (correção 3). VCM ~80/~100 fL mantido como aproximação (nota da 1ª etapa). |
| Anemia megaloblástica e hipersegmentação | his-08 correlação `anemia-macrocitica`, q05, q28 | A frase sobre fármacos estava errada (correção 4). Acrescentei a lesão neurológica exclusiva da B12 (correção 5). O critério de hipersegmentação foi alinhado na 1ª etapa e está correto. |
| Anemia falciforme | — | **Não consta do tópico.** Proposta na seção 3. |
| Reticulócitos | his-08 resumo, `reticulocito`, q17 | A faixa "1–2%" excluía valores normais (correção 1). |
| Desvio à esquerda | his-08 resumo, `neutrofilo-bastonete`, correlação, q05, q28 | Correto. Sem correção. |
| Eosinofilia | his-08 correlação, q03, q14, q28 | Correta (alergia, helmintíase com fase tecidual, fármacos; IL-5). Só a vinheta de toxocaríase foi ajustada (correção 8). |
| Leucemias, mielograma e biópsia | his-08 resumo, correlação, q08, q28 | O mecanismo e os bastonetes de Auer estavam corretos. Não havia menção ao mielograma; acrescentei-a na correlação e na explicação (correção 6). Sem limiar numérico de blastos, porque a OMS 2022 e o ICC 2022 divergem. |
| Trombocitopenia | his-08 resumo, correlação, q13 | A pseudoplaquetopenia por EDTA já estava lá. Corrigi a implicação de que toda plaquetopenia sangra (correção 2) e acrescentei o mielograma na PTI típica (correção 7). |
| Eritropoetina | his-08 resumo, correlação `anemia-doenca-renal-cronica`, q22 | O mecanismo estava correto. A conduta estava generalizada (correção 9). |
| Miastenia grave | his-09 resumo, correlação, q12, q27 | Correta (anti-AChR, anti-MuSK, timo, Lambert-Eaton como distrator). Precisei a resposta aos anticolinesterásicos (correção 15). |
| Duchenne e Becker | his-09 correlação, q11, q27 | O fluxo diagnóstico estava desatualizado (correção 10). Becker não constava; entrou uma frase na correlação de Duchenne (correção 11). |
| Rabdomiólise e CK | — | CK só aparece em Duchenne. **Rabdomiólise não consta.** Proposta na seção 3. |
| Infarto: cronologia histológica e troponinas | his-09 resumo, correlação, q13, q20, q24 | A cronologia de Robbins está correta (1ª etapa). Faltava a troponina como biomarcador; acrescentei-a com a 4ª definição universal (correção 12). Em q24, precisei o início da necrose visível (correção 13). |
| Hipertrofia × hiperplasia | his-09 correlação, q14 | Correta. Sem correção. |
| Leiomioma | his-09 correlação, q15 | A dependência hormonal estava incompleta (correção 14). |
| Esclerose múltipla | his-10 resumo, correlação, q07, q20 | Correta no essencial. Atualizei as formas clínicas, os locais típicos (McDonald 2024), a lesão axonal precoce e o diferencial com neuromielite óptica (correções 21 e 22). |
| Guillain-Barré | his-10 resumo, pontos-chave, correlação, q08, q15, q20 | A conduta estava generalizada (correção 17). Acrescentei o líquor normal na 1ª semana, os gatilhos e a variante axonal (correção 18), a restrição à forma desmielinizante no resumo e no ponto-chave (correção 19) e a explicação de q08 (correção 20). |
| Degeneração walleriana e regeneração | his-10 resumo, eventos, q13, q14, q23, q26 | Correta (Seddon, bandas de Büngner, cromatólise, inibidores da mielina do SNC). Sem correção. |
| Neuropatias | his-10 (Guillain-Barré; lesão traumática de nervo) | Corretas. A neuropatia diabética não consta; proposta na seção 3. |
| Barreira hematoencefálica | his-10 resumo, pontos-chave, q04 | Correta (1ª etapa: endotélio, pericitos e astrócitos). Não há correlação clínica da barreira; proposta na seção 3. |
| Tumores gliais | his-10 correlação, q05 | A nomenclatura estava anterior à OMS 2021 (correção 23). O gabarito (b, astrocítico) está correto. |
| Doenças neurodegenerativas | — | **Nenhuma é citada no tópico.** A lipofuscina aparece só como distrator histológico em q01. Proposta na seção 3. |

**Frases sensíveis.** Nenhum trecho é orientação de tratamento a pacientes. Os trechos de conduta foram reescritos em tom didático e com atribuição explícita à diretriz:
- anemia da DRC (KDIGO 2026);
- Guillain-Barré (EAN/PNS 2023; PCDT do Ministério da Saúde).

As demais menções a tratamento, "anticolinesterásico como tratamento sintomático" (his-09-q12) e "sutura aproxima os cotos" (his-10-q14), são descritivas e foram mantidas.

**Campo `fontes`.** Não existe no `TopicoSchema`. As fontes estão onde o schema prevê:
- `referencias` do tópico: 5 novas no his-08, 4 no his-09 e 3 no his-10;
- `referencia` de cada questão alterada;
- `notasDivergencia` (his-08, reticulócitos) e `incertezas` (uma entrada nova em cada tópico).

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | his-08 (resumo); his-08-q17; notasDivergencia | resumo; explicacao, referencia; nota | Reticulócitos "~1–2% das hemácias" | "Cerca de 1%; os laboratórios usam, no adulto, faixas em torno de 0,5–2,5%". Na q17: a contagem cai quando a produção falha (ferro, B12/folato, aplasia, DRC); na anemia, interpreta-se o valor absoluto ou corrigido | "1–2%" deixava fora valores normais entre 0,5 e 1%. A porcentagem crua engana na anemia, um erro clássico. Gabarito (V) mantido. | menor | MedlinePlus/NLM (Reticulocyte count); Hoffbrand 7ª ed. |
| 2 | his-08 (resumo); `trombocitopenia` | resumo; correlacoesClinicas.descricao | "Trombocitopenia causa petéquias…"; "< 150.000/µL, **com** petéquias, equimoses…" | "**Quando acentuada**, causa…"; "as formas leves costumam ser assintomáticas; quanto mais baixa a contagem, maior o risco…" | O texto sugeria que toda plaquetopenia sangra. Mantido sem limiares numéricos de sangramento. | menor | Hoffbrand 7ª ed.; Provan 2019 |
| 3 | his-08 / `anemia-microcitica`; his-08-q07 | correlacoesClinicas.descricao; explicacao, referencia | "Perdas crônicas…; as talassemias são **o principal** diagnóstico diferencial" | Perdas menstruais ou digestivas; **ferritina baixa confirma**; RDW costuma estar aumentado; no homem e na mulher após a menopausa, deficiência de ferro sem causa evidente **exige investigar perda digestiva**. Diferenciais: traço talassêmico (ferritina normal) e anemia da inflamação | Faltava o exame que confirma o diagnóstico. A anemia da inflamação é diferencial tão ou mais frequente que a talassemia. A investigação digestiva é o ponto de segurança clínica (câncer colorretal). Gabarito (a) mantido. | menor | BSG, Gut 2021;70:2030-51; Hoffbrand 7ª ed. |
| 4 | his-08 / `anemia-macrocitica` | correlacoesClinicas.descricao | "Álcool, hepatopatia **e alguns fármacos** causam macrocitose **sem megaloblastos**" | "Fármacos que inibem a síntese de DNA (metotrexato, hidroxiureia) **produzem alterações megaloblásticas**; álcool, hepatopatia e hipotireoidismo causam macrocitose em geral sem megaloblastos" | Ensinava o contrário do que cai em prova: antifolatos e inibidores da síntese de DNA são causas clássicas de megaloblastose | importante | Hoffbrand 7ª ed. (anemias megaloblásticas) |
| 5 | his-08 / `anemia-macrocitica` | correlacoesClinicas.descricao | Sem menção neurológica | "Só a deficiência de B12 causa também lesão neurológica, como a degeneração combinada subaguda da medula espinal" | Integração clínica clássica (B12 × folato) e ligação com o tópico de tecido nervoso | menor | Hoffbrand 7ª ed.; Robbins 10ª ed. |
| 6 | his-08 (resumo); `leucemia-aguda`; his-08-q08 | resumo; correlacoesClinicas.descricao; explicacao, referencia | Blastos "ocupam a medula **e aparecem** no sangue"; sem método diagnóstico | "**Em geral** aparecem no sangue"; infecções por neutropenia. "Diagnóstico confirmado no **mielograma**, com imunofenotipagem por citometria de fluxo e estudo citogenético e molecular; a biópsia de medula (em geral da crista ilíaca) complementa quando o aspirado é insuficiente." Na q08: a confirmação é feita no mielograma | Há leucemias com poucos ou nenhum blasto circulante. Faltava o mielograma, pedido no foco desta etapa. Sem limiar de % de blastos (OMS 2022 e ICC 2022 divergem). Gabarito (b) mantido. | menor | Döhner et al., Blood 2022;140:1345-77 (ELN); Hoffbrand 7ª ed. |
| 7 | his-08-q13 | explicacao, referencia | Só "o quadro sugere trombocitopenia imune pós-viral" | + "Na PTI a destruição é periférica e a medula tem megacariócitos em número normal ou aumentado; no quadro típico, o mielograma não é necessário, e o diagnóstico é de exclusão" | Integra a pergunta (megacariócito) com a conduta diagnóstica atual e evita a ideia de que toda plaquetopenia exige mielograma. Gabarito (a) mantido. | menor | Provan et al., Blood Adv 2019;3:3780-817; Neunert et al. (ASH), Blood 2011;117:4190-207 |
| 8 | his-08-q14 | contexto | "A sorologia **confirma** toxocaríase" | "A sorologia para Toxocara é **positiva, compatível com** toxocaríase" | A sorologia não distingue infecção atual de pregressa. O diagnóstico é clínico-laboratorial. Gabarito (c) mantido. | menor | — (conceito de sorologia; sem mudança de conteúdo cobrado) |
| 9 | his-08 / `anemia-doenca-renal-cronica`; his-08-q22 | correlacoesClinicas (descricao, mecanismo); explicacao, referencia | "**Tratada com eritropoetina recombinante** e reposição de ferro quando necessária" | KDIGO 2026: **corrigir primeiro causas reversíveis** (deficiência de ferro); agentes estimuladores da eritropoese **conforme o caso**, sem normalizar a hemoglobina (alvos altos associaram-se a mais eventos cardiovasculares e AVC). Mecanismo: ferro e inflamação também contribuem | Conduta apresentada como universal e sem o principal alerta de segurança. Gabarito (V) mantido. | importante | KDIGO 2026, Kidney Int 2026;109(1) |
| 10 | his-09 / `distrofia-duchenne`; his-09-q11 | correlacoesClinicas.descricao; contexto; explicacao, referencia | "**A biópsia mostra**… a imuno-histoquímica não marca distrofina" (biópsia como via diagnóstica) | "Hoje o diagnóstico é confirmado sobretudo por **teste genético do gene DMD** (deleções e duplicações mais comuns); **a biópsia fica para os casos em que o teste não é conclusivo**." Vinheta: "O teste genético inicial não foi conclusivo, e a biópsia muscular mostra…". A explicação diz o mesmo | A vinheta ensinava implicitamente a biópsia como próximo passo diante de CK alta num menino com sinal de Gowers. O texto novo da vinheta não entrega a resposta ("teste genético", sem nomear o gene). Gabarito (a) mantido. | importante | Birnkrant et al., Lancet Neurol 2018;17:251-67 |
| 11 | his-09 / `distrofia-duchenne` | correlacoesClinicas.descricao | Sem Becker | "Na distrofia de Becker, mutações que preservam a fase de leitura produzem distrofina reduzida ou truncada, com quadro mais tardio e mais leve" | Contraste pedido no foco desta etapa (Duchenne/Becker). Uma frase dentro da correlação existente, sem correlação nova | menor | Robbins 10ª ed., Nervos periféricos e músculos esqueléticos |
| 12 | his-09 (resumo); `infarto-miocardio` | resumo; correlacoesClinicas.descricao | Sem biomarcador | "As isoformas cardíacas da troponina (cTnI, cTnT), liberadas pelos cardiomiócitos lesados, são o biomarcador de escolha. Pela **quarta definição universal** (2018), adotada nas diretrizes da SBC: elevação e/ou queda, com ao menos um valor **acima do percentil 99 do limite superior de referência**, associada a evidência de isquemia aguda (sintomas, ECG, imagem)." Resumo: troponina como marcador laboratorial | A ponte estrutura–clínica mais direta do tópico (o complexo troponina já é ensinado no sarcômero). Pedido no foco. | menor | Thygesen et al., Eur Heart J 2019;40:237-69; Nicolau et al. (SBC), Arq Bras Cardiol 2021;117(1):181-264 |
| 13 | his-09-q24 | explicacao, referencia | "Necrose de coagulação (**primeiras horas** a 1 dia)" | "Visível ao microscópio óptico **a partir de ~4–12 h**; antes disso, em geral não há alteração histológica, embora a troponina já possa estar subindo" | "Primeiras horas" sugeria necrose visível de imediato. É o ponto de autópsia de morte súbita precoce. A ordem cobrada não muda. | menor | Robbins 10ª ed., Coração; Thygesen 2018 |
| 14 | his-09 / `leiomioma`; his-09-q15 | correlacoesClinicas.descricao; explicacao, referencia | "Dependente **de estrogênio**; pode causar aumento do fluxo e dor" | "Dependente de **estrogênio e progesterona**; muitas vezes assintomático; pode causar aumento do fluxo, dor e sintomas compressivos" | A progesterona é necessária ao crescimento do mioma (base dos moduladores do receptor de progesterona). A maioria dos miomas é assintomática. Gabarito (c) mantido. | menor | Bulun, N Engl J Med 2013;369:1344-55; Robbins 10ª ed. |
| 15 | his-09 / `miastenia-grave` | correlacoesClinicas.descricao | "**Responde** a inibidores da acetilcolinesterase" | "**Em geral melhora** com inibidores… (a resposta é menor nas formas anti-MuSK)" | A afirmação era absoluta. A forma anti-MuSK já é citada no mecanismo. | menor | Robbins 10ª ed. |
| 16 | his-09-q06 | contexto | "Contusão grave no quadríceps. **A biópsia, semanas depois**, mostra…" | "Laceração extensa do quadríceps, suturada em cirurgia. Três semanas depois é reoperado por deiscência, e um fragmento da borda da lesão é examinado…" | Não se biopsia contusão muscular. A vinheta precisava de um motivo real para obter o tecido. Achado histológico e gabarito (a) mantidos. | menor | — (realismo da vinheta) |
| 17 | his-10 / `guillain-barre` | correlacoesClinicas.descricao | "**Tratada com** imunoglobulina intravenosa ou plasmaférese" | "Parte dos pacientes evolui com **insuficiência respiratória e disautonomia**; a fase aguda exige monitorização. Pelas diretrizes (EAN/PNS 2023; PCDT do MS), IgIV ou plasmaférese **nas formas moderadas a graves, como em quem não consegue andar sem apoio**; **corticoides não são eficazes**" | Conduta apresentada como universal. Omitia a principal causa de morte evitável e o erro clássico (corticoide). | importante | van Doorn et al., Eur J Neurol 2023;30:3646-74; MS, Portaria Conjunta SAES/SCTIE nº 15/2020 (PCDT SGB) |
| 18 | his-10 / `guillain-barre` | correlacoesClinicas (descricao, mecanismo) | Gatilho genérico; dissociação albuminocitológica sem ressalva; "Há variantes axonais" | Gatilhos: *C. jejuni* (o mais identificado), CMV, zika. A dissociação "pode faltar na primeira semana". Variante axonal motora aguda ligada ao *C. jejuni*, com anticorpos contra gangliosídeos do axolema | Líquor normal no início não exclui SGB (erro frequente). Zika tem relevância brasileira. | menor | van Doorn 2023; Robbins 10ª ed. |
| 19 | his-10 (resumo); pontosChave[11] | resumo; pontosChave | SGB "ataca a mielina periférica… **boa recuperação**"; ponto-chave sem ressalva | "**Na forma desmielinizante clássica**… a remielinização explica a boa recuperação **da maioria**"; ponto-chave "a forma desmielinizante da SGB" | Coerência com a correlação e com q08/q20, que já especificavam a forma desmielinizante | menor | van Doorn 2023 |
| 20 | his-10-q08 | explicacao, referencia | Sem comentário sobre a diarreia prévia | "Diarreia prévia sugere *C. jejuni*, que também se associa às variantes axonais; por isso o enunciado especifica a forma desmielinizante clássica" | Antecipa a objeção do aluno informado (pós-diarreia → AMAN). Mostra por que só (d) é defensável. Gabarito (d) mantido. | menor | van Doorn 2023; Robbins 10ª ed. |
| 21 | his-10 / `esclerose-multipla` | correlacoesClinicas (descricao, mecanismo) | "Com surtos… e remissões"; "placas na **substância branca** (periventriculares, nervo óptico, medula)"; axônios "**inicialmente preservados**" | Forma remitente-recorrente e formas progressivas. Lesões em locais típicos: periventriculares, corticais/justacorticais, infratentoriais, medula, nervo óptico. Critérios de **McDonald (revisão de 2024)**, com exclusão de outras causas. Axônios "**relativamente** preservados (há lesão axonal já nas placas agudas)". Diferencial: **neuromielite óptica** (anti-aquaporina-4, pés astrocitários) | Atualização diagnóstica: o nervo óptico entrou como 5º local na revisão de 2024. Há lesões corticais. A lesão axonal é precoce. O diferencial com NMO é integração histológica direta (astrócito). | menor | Montalban et al., Lancet Neurol 2025;24:850-65; Robbins 10ª ed. |
| 22 | his-10-q07 | explicacao, referencia | "Astrócitos (b)… não são o alvo primário" | + "…da esclerose múltipla; são o alvo na neuromielite óptica (anti-aquaporina-4), em que lesões ovais periventriculares e bandas oligoclonais, como as da vinheta, são pouco típicas" | Neurite óptica é o sintoma inicial clássico das duas doenças, e a explicação precisa mostrar por que (b) não serve aqui. Gabarito (c) mantido. | menor | Montalban 2025; Robbins 10ª ed. |
| 23 | his-10 (resumo); `gliomas` | resumo; correlacoesClinicas (descricao, mecanismo) | "Astrocitomas (**incluindo o glioblastoma**)"; "gliomas derivam de células da glia"; "tumores infiltrativos" | Tumores astrocíticos (astrocitomas e glioblastoma); marcadores IDH e 1p/19q (define o oligodendroglioma). Na OMS 2021, "glioblastoma" designa **só o tumor IDH-selvagem do adulto**, e o IDH-mutado de grau 4 é "astrocitoma IDH-mutado". "Glia **ou seus precursores**"; "**em geral** infiltrativos (gliomas difusos)" | Terminologia vigente, que o aluno encontra em laudos. Ependimomas e gliomas circunscritos não são difusos. Gabarito de q05 (b) não muda. | menor | Louis et al., Neuro-Oncology 2021;23:1231-51 (OMS 2021) |

Registro em `revisao.agentes`, acrescentado depois da entrada da 1ª etapa nos três tópicos:

`{"area": "clinica/hematologia/neurologia", "agente": "revisor-clinica-v1", "data": "2026-11-09", "veredito": "aprovado-com-correcoes", "notas": "<n> correções (…)"}`

## 3. Pontos para o revisor humano

1. **Nível de detalhe clínico num tópico de histologia (decisão pedagógica).** Entraram trechos de conduta e diagnóstico, todos atribuídos a diretriz:
   - KDIGO 2026 na anemia da DRC;
   - EAN/PNS 2023 e PCDT na SGB;
   - 4ª definição universal no infarto;
   - Birnkrant 2018 em Duchenne;
   - McDonald 2024 na EM.

   Decidir se o 1º/2º ano deve ver esse nível ou só o mecanismo com uma frase de fonte. Nenhum desses detalhes é cobrado como resposta de questão.
2. **Diretrizes conferidas só por busca ou de memória.** O texto integral não abriu nesta sessão: os domínios `pmc.ncbi.nlm.nih.gov`, `kdigo.org` e `www.unn.no` estão bloqueados na rede.
   - **KDIGO 2026 (anemia na DRC):** publicação em Kidney Int 2026;109(1) vista em busca; a recomendação de não normalizar a hemoglobina (alvo < 11,5 g/dL) veio de sínteses. Conferir também se convém citar o PCDT do MS de anemia na DRC.
   - **PCDT de Guillain-Barré (Portaria Conjunta nº 15, de 13/10/2020):** identificado pelo título. Conferir se segue vigente e se a indicação ("formas moderadas a graves") bate com o texto brasileiro.
   - **SBC 2021 (SCA sem supra):** as páginas (181-264) foram citadas de memória. Avaliar se convém citar também a diretriz ESC 2023 de síndromes coronarianas agudas.
   - **Birnkrant 2018:** o fluxo "CK → deleção/duplicação → sequenciamento → biópsia se inconclusivo" foi citado de memória. A busca confirmou a obra, não a frase.
   - **PTI:** "mielograma não necessário no quadro típico" está explícito na ASH 2011. Na síntese do consenso de 2019, aparece como "não é rotina". As duas fontes estão citadas.
3. **Reticulócitos.** A faixa 0,5–2,5% é a de MedlinePlus/UCSF; outras fontes dão 0,5–1,5%. Conferir com a tabela da SBPC/ML ou do laboratório de referência do curso e com Junqueira 14ª ed. Nenhuma questão cobra o número.
4. **Critérios de McDonald 2024.** Se o curso ainda ensina os de 2017 (4 locais, sem nervo óptico), não há conflito em questão: a q07 cobra só a célula-alvo.
5. **Nomenclatura da OMS 2021 para gliomas.** Decidir se termos como "IDH-selvagem" e "codeleção 1p/19q" cabem no 1º ano. Estão só na correlação; a q05 não os cobra.
6. **Vinhetas reescritas** (his-09-q06 e his-09-q11). Confirmar se o cenário clínico novo ficou natural para a turma:
   - q06: reoperação por deiscência, no lugar da biópsia de contusão;
   - q11: teste genético inconclusivo antes da biópsia.
7. **Temas do pedido ausentes do conteúdo.** Nada disto foi implementado. São propostas ao redator, e cada uma exigiria a 1ª etapa (histologia) antes de entrar:
   - **Anemia falciforme (his-08):**
     - HbS polimeriza na desoxigenação → drepanócitos no esfregaço;
     - hemólise com reticulocitose;
     - corpúsculos de Howell-Jolly após autoesplenectomia;
     - vaso-oclusão;
     - triagem no teste do pezinho (PNTN) e PCDT da doença falciforme do MS.
     - Integra hemácia, citoesqueleto e baço.
   - **Rabdomiólise e CK (his-09):**
     - necrose de fibras esqueléticas com liberação de CK e mioglobina;
     - urina escura (mioglobinúria) e risco de lesão renal aguda;
     - causas: esforço extremo, esmagamento, fármacos (estatinas), miopatias metabólicas.
     - Contraste útil com Duchenne (CK alta crônica) e com a troponina (especificidade cardíaca).
   - **Doenças neurodegenerativas (his-10):**
     - ELA: perda de neurônios motores do corno anterior e do córtex motor; conversa com a q02 do corno anterior;
     - Parkinson: perda de neurônios pigmentados (neuromelanina) da substância negra, corpos de Lewy;
     - Alzheimer: placas de β-amiloide, emaranhados neurofibrilares de tau, perda neuronal.
     - Também integram a lipofuscina × neuromelanina.
   - **Neuromielite óptica (his-10):** hoje aparece só como diferencial na correlação de EM e na q07. Vale uma correlação própria (astrócito, aquaporina-4 nos pés vasculares).
   - **Barreira hematoencefálica na clínica (his-10):**
     - edema vasogênico em tumores e abscessos;
     - órgãos circunventriculares sem barreira;
     - passagem de fármacos (por exemplo, levodopa × dopamina).
   - **Neuropatia diabética (his-10):** axonal, dependente do comprimento, com perda de fibras finas. Contraste com a SGB desmielinizante.
8. **Itens da 1ª etapa ainda pendentes.** Continuam válidos:
   - capítulos de Junqueira 14ª ed., Ross 8ª ed., Kierszenbaum 5ª ed. e Hoffbrand 7ª ed.;
   - tabela do leucograma de Junqueira;
   - plaquetas (~10 dias, 2–4 µm);
   - IIb × IIx;
   - Pi × golpe de força;
   - bipolares nos gânglios coclear e vestibular.

## 4. Fontes consultadas nesta sessão (busca pontual)

- EAN/PNS, Guillain-Barré (2023): https://pubmed.ncbi.nlm.nih.gov/37814552/
- Quarta definição universal de infarto (resumos do ACC): https://acc.org/latest-in-cardiology/ten-points-to-remember/2018/08/24/00/09/fourth-universal-definition-of-mi-esc-2018
- SBC 2021, SCA sem supra:
  - registro: https://pmc.ncbi.nlm.nih.gov/articles/PMC8294740
  - síntese: https://portal.afya.com.br/cardiologia/diretrizes-brasileiras-sobre-angina-instavel-e-iam-sem-supradesnivel-do-segmento-st
- Duchenne, care considerations 2018 (confirmação da obra): https://www.ncbi.nlm.nih.gov/pubmed/30275244 e https://www.institut-myologie.org/en/2018/02/27/dmd-care-considerations-update-part-1/
- OMS 2021, gliomas: https://medlink.com/articles/glioblastoma-idh-wildtype e https://pmc.ncbi.nlm.nih.gov/articles/PMC10227121
- PTI, consenso internacional 2019: https://doaj.org/article/615595aac465412eafebf2c7540a0966 e https://www.thebloodproject.com/?p=20246
- Reticulócitos: https://nlm.nih.gov/medlineplus/ency/article/003637.htm e https://www.ucsfhealth.org/medical-tests/reticulocyte-count
- KDIGO 2026, anemia na DRC: https://pubmed.ncbi.nlm.nih.gov/41485807/ e https://www.newswise.com/articles/updated-kdigo-guideline-recommends-more-personalized-treatment-for-anemia-in-chronic-kidney-disease
- McDonald 2024: https://pubmed.ncbi.nlm.nih.gov/40975103/ e https://practicalneurology.com/news/2024-mcdonald-criteria-revisions-published-in-the-lancet-neurology/2483516/
- PCDT SGB (MS, 2020): https://www.gov.br/conitec/pt-br/midias/protocolos/20201022_portaria_conjunta_pcdt_sgb-1.pdf (link visto na busca, não aberto)

Citados de memória, de obras consagradas, e listados nas `referencias`:
- Hoffbrand 7ª ed.;
- Robbins 10ª ed.;
- BSG 2021 (Snook et al.);
- ELN 2022 (Döhner et al.);
- ASH 2011 (Neunert et al.);
- Bulun 2013;
- Louis 2021 (já citado pela 1ª etapa).

## 5. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441.

$ npx vitest run
 Test Files  5 passed (5)
      Tests  41 passed (41)
```

São 41 testes, e não 39 como nos relatórios anteriores: outro agente está alterando `src/modules/histologia` e `tests/conteudo.test.ts`. Não toquei nesse código. Nenhum teste falhou durante esta revisão.

Comparação estrutural com `HEAD`, feita por script:
- **his-08:** mudaram resumo, correlações (5), questões q07, q08, q13, q14, q17 e q22 (só contexto, explicação e referência), referências, notas, incertezas e `revisao`.
- **his-09:** mudaram resumo, correlações (4), q06, q11, q15, q16 e q24, referências, incertezas e `revisao`.
- **his-10:** mudaram resumo, pontos-chave, correlações (3), q07 e q08, referências, incertezas e `revisao`.

Ids, tipos, alternativas, itens, pares e gabaritos estão idênticos. `revisao.humano` = `null`. Nada foi commitado.

Ao final desta revisão, `git status` mostra também alterações de outros agentes em `his-01` a `his-04`. Não as fiz e não as toquei.
