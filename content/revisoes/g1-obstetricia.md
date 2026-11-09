# Revisão por agente — Grupo G1, área obstetrícia/reprodução e histologia (etapa 2 de 2)

- Agente: `revisor-obstetricia-v1` · Área: `obstetricia-reproducao/histologia` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Etapa anterior: `content/revisoes/g1-embriologia.md` (`revisor-embriologia-v1`). O registro dela em `revisao.agentes` foi mantido intacto. O meu foi acrescentado depois dele.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: `content/embriologia/topicos/`: emb-01-introducao, emb-02-gametogenese, emb-03-fertilizacao, emb-04-semana1 e emb-05-semana2. Não alterei nenhum outro arquivo do repositório. Também não fiz commit.

## 1. Resumo

| Tópico | Questões | Críticas | Importantes | Menores | Pistas de comprimento removidas* | Veredito |
|---|---|---|---|---|---|---|
| emb-01-introducao | 25 | 0 | 2 | 2 | 4 questões | aprovado-com-correcoes |
| emb-02-gametogenese | 27 | 0 | 1 | 11 | 3 questões | aprovado-com-correcoes |
| emb-03-fertilizacao | 26 | 0 | 2 | 5 | 9 questões | aprovado-com-correcoes |
| emb-04-semana1 | 26 | 0 | 2 | 4 | 10 questões | aprovado-com-correcoes |
| emb-05-semana2 | 29 | 0 | 1 | 7 | 8 questões | aprovado-com-correcoes |
| **Total** | **133** | **0** | **8** | **29** | **34 questões** | |

Gravidades (protocolo):
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável, explicação incorreta ou contexto clínico em desacordo com a prática ou a norma;
- **menor**: redação, terminologia, referência ou complemento clínico.

\* **Pistas involuntárias.** São questões em que a alternativa correta era visivelmente mais longa ou mais “completa” que as demais. Em 29 delas era pelo menos 35% mais longa que a média dos distratores. A remoção não corrige erro de conteúdo e por isso aparece em coluna própria. O que fiz:
- reescrevi os distratores, e às vezes encurtei a correta, para comprimento e especificidade parecidos;
- não mudei gabarito, letras nem ids;
- quando um distrator ganhou texto, conferi que continuou claramente errado.

Restam 7 casos leves, em que a correta tem só 1 a 8 caracteres a mais que o distrator mais longo: 01-q12, 01-q15, 02-q10, 03-q07, 03-q12, 04-q15 e 05-q15. Mantive esses casos porque mexer neles exigiria inflar distratores sem ganho.

**Letra da correta nas explicações.** Nas 23 questões cujas alternativas editei, acrescentei a letra da correta à explicação (ex.: “… (b).”). Todas as alternativas erradas já eram citadas pela letra.

**Não encontrei fato errado nem gabarito errado.**

Os problemas encontrados foram de cinco tipos.

1. **Contexto clínico desatualizado ou em desacordo com a norma brasileira.**
   - A q09 do tópico 03 descrevia transferência de 3 embriões aos 36 anos. A Resolução CFM nº 2.320/2022 permite até 2 até os 37 anos.
   - O diagnóstico genético pré-implantacional estava descrito com biópsia de blastômero e com a terminologia antiga.
   - A placenta prévia usava a classificação total/parcial.
   - A datação pelo CCN aparecia sem a regra de confirmação/correção da DUM e sem a exceção da reprodução assistida.
2. **Mecanismos imprecisos.**
   - Anovulação atribuída só à falta de gonadotrofinas.
   - Gestação múltipla na FIV atribuída a ovulações múltiplas.
3. **Idade gestacional × idade embrionária.**
   - Uma explicação dizia que o período fetal começa com “~11 semanas” de idade gestacional. São ~10 semanas completas.
   - Duas alternativas usavam semana ordinal onde cabia semana completa.
4. **Histologia e fisiologia incompletas.** Momento de diferenciação da teca, compartimentos da barreira hematotesticular, modelo das duas células, inibina, células luteínicas e transição lúteo-placentária.
5. **Pistas de comprimento**, descritas acima.

### Verificação (evidência)

`npm run validar-conteudo`, depois das edições:
```
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.
```

`npx vitest run`:
```
 FAIL  tests/conteudo.test.ts > estágios 3D > todo modelo registrado tem estágio no conteúdo
AssertionError: coracao-tubular: expected false to be true
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 28 passed (29)
```

**A falha não vem do G1.** O teste exige que todo modelo registrado em `src/modules/embriologia/modelos/index.ts` tenha estágio em `content/embriologia/estagios.json`. O modelo `coracao-tubular` foi registrado nesse arquivo, mas ainda não existe em `estagios.json`. Os dois arquivos aparecem modificados no `git status` por trabalho paralelo de outra sessão (há também `sistemas.tsx`, `Duelos.tsx` e `0006_duelos.sql` não rastreados). Não alterei nenhum deles. Os outros 28 testes passam.

Conferi por script, comparando com `HEAD`, que nos 5 tópicos ficaram intactos:
- os ids e a ordem de questões, alternativas, itens, estruturas, eventos e correlações;
- o tipo e a dificuldade de cada questão;
- todas as respostas corretas (`correta` e `ordemCorreta`);
- a `ordem` dos eventos;
- o registro da etapa 1 em `revisao.agentes`;
- `revisao.humano` = `null`.

A distribuição das letras corretas não mudou (maior fatia ≤ 27% por tópico).

O resumo do tópico 02 ficou com 899 palavras. Condensei as inserções para respeitar o limite de 900 do schema.

## 2. Tabela de correções

### emb-01-introducao

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| resumo (Estimativa da idade); pontosChave[6]; correlação `datacao-gestacional-ccn` | texto | “O CCN no 1º trimestre é o método mais preciso de datação”; correlação: CCN só “quando a DUM é incerta” | DUM confirmada ou corrigida pela USG do 1º trimestre. CCN até ~13 sem 6 d (≤ ~84 mm), erro de ~5–7 dias. Corrigir a DUM se a diferença passar de 5 dias (< 9 sem) ou de 7 dias (9–13 sem 6 d). Na reprodução assistida, datar pela transferência e pela idade do embrião. IG em semanas + dias completos | **Importante**: generalização incorreta (na reprodução assistida a data da transferência é mais exata). Além disso, a prática atual confirma a idade pela USG em toda gestação, não só com DUM incerta | ACOG Committee Opinion 700 (2017, reafirmado) |
| emb-01-q13 | explicacao; alternativas | “período fetal começa na 9ª semana (~11 semanas de IG)”; (b) “~5ª semana após a fertilização” | “cerca de 10 semanas completas de IG”; (b) “~5 semanas após a fertilização”; explicação diz “5 semanas completas (6ª semana do desenvolvimento)” | **Importante**: erro de 1 semana na conversão (56 dias pós-fertilização = 10 sem 0 d de IG) e confusão entre semana ordinal e cardinal, justamente no tópico que ensina a conversão | Moore 11ª, caps. 1 e 6; ACOG CO 700 |
| emb-01-q03 | alternativa (b); explicacao | “(6ª semana após a fertilização)”; “A 6ª semana pós-fertilização corresponderia a ~8 semanas” | “com cerca de 6 semanas após a fertilização”; “Seis semanas … corresponderiam a cerca de 8 semanas de IG” | **Menor**: semana ordinal × completa (coerência com a e c) | — |
| emb-01-q16 | enunciado; explicacao | “A IG pela DUM é cerca de 2 semanas maior que a idade embrionária” | “Em ciclos regulares de cerca de 28 dias, …”; explicação acrescenta que em ciclos longos ou irregulares a diferença muda | **Menor**: o V/F precisa ser inequívoco (a regra vale para ciclo de 28 dias) | Moore 11ª, cap. 6 |
| q09, q10, q12, q13 | alternativas | Correta mais longa (ex.: q10 85 × 26 caracteres) | Distratores e correta com comprimento equivalente | Pista involuntária | — |
| referencias | nova | — | ACOG CO 700 | Fonte das regras de datação | — |

### emb-02-gametogenese

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| correlação `anovulacao-inducao` | descricao; mecanismo | “Sem secreção adequada de gonadotrofinas e sem pico de LH, nenhum folículo amadurece”; indutores “gonadotrofinas ou clomifeno” | Duas situações: falta de gonadotrofinas (amenorreia hipotalâmica) ou falha da seleção folicular (SOP, em que o LH costuma estar alto). Indutores elevam o FSH, diretamente ou reduzindo a retroalimentação do estrogênio. Letrozol citado como 1ª escolha na SOP | **Importante**: mecanismo incorreto para a causa mais comum de anovulação; terapêutica atualizada | Teede et al., diretriz internacional de SOP 2023 |
| resumo (foliculogênese); `foliculo-primario` | texto | Teca “diferenciada em interna e externa” descrita só no folículo secundário | Teca organizada pelo estroma em volta do folículo primário em crescimento, já diferenciada em interna e externa antes do antro | **Menor**: momento histológico (Moore descreve a teca no folículo primário que cresce) | Moore 11ª, cap. 2 |
| resumo (eixo) | texto | “O FSH estimula … estrogênio pela granulosa (a partir de androgênios da teca)” | GnRH em pulsos; LH → androgênios na teca interna; FSH → aromatização na granulosa | **Menor**: modelo das duas células incompleto; a pulsatilidade explica o uso de análogos | Williams Obstetrics 26ª; Moore 11ª, cap. 2 |
| resumo (seleção) | texto | “vários folículos crescem, apenas um amadurece” | Folículos antrais recrutados pelo FSH; dominância pelo estradiol e pela **inibina B**, que reduzem o FSH | **Menor**: faltava o mecanismo (inibina, pedida no escopo) | idem |
| resumo; `corpo-luteo` | texto | “as paredes do folículo formam o corpo lúteo, que secreta progesterona e estrogênio” | Luteinização da granulosa e da teca sob LH (células granuloso- e teco-luteínicas); secreta também inibina A | **Menor**: histologia e endocrinologia | idem |
| resumo; notasDivergencia (corpo lúteo) | texto | hCG mantém o corpo lúteo “nos primeiros meses” | Corpo lúteo indispensável até a transição lúteo-placentária (~7–9 semanas de IG). Nota: lutectomia antes de ~7 semanas → abortamento; os números de Moore/Sadler (~20 sem/4º mês) referem-se à persistência | **Menor**: precisão clínica, com idade gestacional explícita | Csapo et al. 1972; Williams 26ª |
| evento `crescimento-folicular`; notasDivergencia | descricao; nova nota | “Crescimento folicular sob FSH: primário → secundário → maduro” | “… (a fase final, antral, depende do FSH)”. Nota sobre o crescimento pré-antral, independente de gonadotrofinas | **Menor**: fisiologia (a ordem do evento não mudou) | Sadler 14ª, cap. 3 (divergência registrada) |
| resumo (não disjunção) | texto | Trissomias e 45,X citadas juntas; “o risco de trissomias aumenta com a idade materna” | Acrescentado: o risco da 45,X não aumenta com a idade materna; em geral ela resulta da perda do cromossomo sexual paterno | **Menor**: evita associar a síndrome de Turner à idade materna | Thompson & Thompson 8ª, cap. 6 |
| resumo (Sertoli) | texto | “formam a barreira hematotesticular” | Junções oclusivas entre células de Sertoli separam o compartimento basal (espermatogônias) do adluminal (espermatócitos e espermátides) | **Menor**: histologia do epitélio seminífero | Moore 11ª, cap. 2 |
| correlação `contraceptivos-hormonais` | descricao | “inibem a ovulação” | + efeitos adicionais do progestagênio (muco cervical, endométrio) | **Menor**: completude | — |
| emb-02-q12 | contexto; explicacao | Dor “no quadrante inferior direito todo mês” | Dor “ora à direita, ora à esquerda”; explicação diz que o lado varia com o ovário que ovula | **Menor**: dor sempre do mesmo lado é atípica para mittelschmerz e levaria a investigar outra causa | — |
| notasDivergencia (nomenclatura) | texto | secundário = antral | + aviso: em parte da histologia e da medicina reprodutiva, “secundário” é o pré-antral multilaminar e “terciário” é o antral | **Menor**: fonte frequente de confusão | — |
| q10, q11, q14 | alternativas | Correta mais longa (q14: 71 × média 30) | Comprimentos equivalentes (q14 com nomes completos de todos os hormônios) | Pista involuntária | — |
| referencias | novas | — | Williams 26ª; Csapo 1972; Thompson & Thompson 8ª; Teede 2023 | Fontes dos acréscimos | — |

### emb-03-fertilizacao

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-03-q09 | contexto; explicacao | “36 anos … transferência de **três** embriões”; (b) “embriões triploides em geral são identificados e não transferidos” | “transferência de **dois** embriões”. Explicação: prática atual de transferir um único embrião e limite do CFM por idade; (b) zigotos com 3 pronúcleos descartados na avaliação de 16–18 h | **Importante**: a vinheta descrevia conduta vedada no Brasil (até 2 embriões até 37 anos). O gabarito (a) não muda | Resolução CFM 2.320/2022 |
| correlação `gestacao-multipla-reproducao-assistida` | descricao; mecanismo | “a estimulação ovariana também pode gerar múltiplas ovulações” | Na FIV os ovócitos são aspirados: gêmeos dizigóticos vêm de cada embrião transferido, e a gemelaridade monozigótica é mais frequente (sobretudo com blastocisto). Ovulações múltiplas só na indução sem FIV. Acrescentados a transferência eletiva de um único embrião e os limites do CFM | **Importante**: mecanismo não se aplica à FIV | CFM 2.320/2022; Hviid et al., Hum Reprod Update 2018 |
| resumo (reprodução assistida) | texto | — | Fertilização confirmada por 2 pronúcleos (~16–18 h); transferência preferencial de 1 embrião e limite do CFM; GIFT depende de laparoscopia e é raramente usada | **Menor**: atualização da prática | CFM 2.320/2022 |
| correlação `infertilidade-tubaria-fiv` | descricao | — | Hidrossalpinge: salpingectomia ou oclusão antes da FIV (o refluxo de líquido tubário reduz a implantação) | **Menor**: complemento clínico relevante para a q16 | Johnson et al., Cochrane 2010 |
| correlação `triploidia-dispermia`; q10 (explicacao, referencia); notasDivergencia | texto | “causa mais comum: dispermia” | Mantido, com a precisão “nos abortos espontâneos”. Triploidia diândrica pode ter fenótipo de mola parcial; a digínica (erro na meiose II do ovócito) não se associa a mola. Nota sobre o viés de recrutamento das amostras | **Menor**: integração com a mola (tópico 05) e evidência molecular | Zaragoza et al., Am J Hum Genet 2000 |
| emb-03-q08 | contexto; alternativas a/d; explicacao | “duas tentativas de FIV convencional” antes da ICSI | “uma tentativa”; explicação diz que, na oligoastenozoospermia grave, a ICSI já é indicada desde o primeiro ciclo | **Menor**: realismo clínico (não se repete a FIV convencional nesse cenário) | — |
| `corona-radiata` | definicao | “Camada de células foliculares que envolve a zona pelúcida” | Camada mais interna do cumulus, de células radiais aderidas à zona; o ovócito sai com o restante do cumulus | **Menor**: histologia | Moore 11ª, cap. 2 |
| q02, q04, q06, q08, q11, q12, q14, q15, q16 | alternativas | Correta 1,4 a 2,4 vezes mais longa que a média dos distratores | Comprimentos equivalentes | Pista involuntária | — |
| referencias; notasDivergencia | novas | — | CFM 2.320/2022; Zaragoza 2000; Hviid 2018; Johnson 2010; notas sobre triploidia e número de embriões | Rastreabilidade | — |

### emb-04-semana1

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| resumo (correlações); correlação `diagnostico-genetico-pre-implantacional` (id mantido); objetivos[6]; q10 (contexto); q23 (enunciado, itens 1 e 7, explicacao) | texto | “Diagnóstico genético pré-implantacional”: retirada de 1–2 células de embriões de 6–8 células “ou, com mais frequência”, do trofoblasto; pesquisa “do sexo” | **Teste genético pré-implantacional (PGT)**: PGT-A, PGT-M e PGT-SR. Biópsia do trofectoderma do blastocisto (dias 5–7); biópsia de blastômero abandonada porque reduz a implantação. Limitações: mosaicismo e benefício não demonstrado do PGT-A como rastreamento de rotina. CFM: seleção de sexo só para evitar doença. q23 passa a cultivar até o blastocisto | **Importante**: terminologia e prática desatualizadas (termo pedido no escopo) | Zegers-Hochschild et al. 2017 (glossário ICMART); Scott et al. 2013; ASRM 2024; CFM 2.320/2022 |
| emb-04-q10 | explicacao (a); alternativas b–d | “(a) … além disso, a justificativa é falsa” (o hipoblasto não contribuir para o embrião) | “(a) A biópsia é feita no trofoblasto, não no hipoblasto, que fica no interior e não é amostrado” | **Importante**: a refutação estava errada. No modelo atual, que o próprio tópico 05 adota, o hipoblasto é extraembrionário e é deslocado pelo endoderma definitivo | Moore 11ª, cap. 3; Sadler 14ª, cap. 5 |
| resumo (hCG) | texto | “No fim da 2ª semana há hCG suficiente para os testes” | “… 2ª semana após a fertilização (cerca de 4 semanas de IG, perto da menstruação esperada)” | **Menor**: idade gestacional explícita | Moore 11ª, cap. 3 |
| correlação `perda-embrionaria-precoce` | mecanismo | “produção hormonal inadequada pelo corpo lúteo também contribui” | Insuficiência lútea como causa isolada “é controversa” | **Menor**: a entidade não tem critério diagnóstico reprodutível | ASRM 2021 (luteal phase deficiency) |
| notasDivergencia | nova | — | Gêmeos monozigóticos dicoriônicos após transferência de um único blastocisto: a correspondência entre corionicidade e momento da separação não é absoluta. As questões seguem os livros | **Menor**: divergência relevante para a q12 | séries de casos em FIV (ver §3) |
| `trofoblasto` | sinonimos | “massa celular externa” | + “trofectoderma” | **Menor**: termo usado na reprodução assistida | — |
| q01, q02, q04, q05, q06, q09, q10, q11, q12, q15 | alternativas | Correta 1,4 a 2,8 vezes mais longa (ex.: q02 97 × 35) | Comprimentos equivalentes. Na q04, o distrator (b) virou “hipoblasto e saco vitelino”, com a explicação ajustada | Pista involuntária | — |
| referencias | novas | — | ASRM 2024 (PGT-A); Scott 2013; glossário ICMART 2017; CFM 2.320/2022; ASRM 2021 | Rastreabilidade | — |

### emb-05-semana2

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-05-q24 (pendência da etapa 1) | enunciado; item 1; explicacao; incertezas | “Ordene o aparecimento das cavidades”; item “Celoma extraembrionário” | “Ordene as cavidades pela ordem em que **começam a se formar**”; item “**Primeiros espaços** do celoma extraembrionário”; explicação cita a formação do saco secundário “à medida que” o celoma cresce (Moore) | **Importante**: a ambiguidade apontada na etapa 1 vinha de Moore descrever o saco secundário concomitante à expansão do celoma. Pedir o início da formação torna a ordem compatível com Sadler (11–12 × 13) e com Moore. Ordem e ids mantidos. Incerteza reduzida, não eliminada (ver §3) | Sadler 14ª, cap. 4; Moore 11ª, cap. 3 |
| correlação `gravidez-ectopica` | descricao | Locais, fatores de risco e quadro clássico | + cicatriz de cesariana; laqueadura; gestação com DIU; **metade sem fator de risco**. + diagnóstico: β-hCG + USG transvaginal; massa anexial extraovariana; heterotópica. Valor isolado de β-hCG não decide; zona discriminatória variável, com limiar conservador de até 3.500 mUI/mL (ACOG), e gestação de localização desconhecida com seguimento seriado | **Menor**: complemento clínico pedido no escopo. O valor de corte aparece com contexto, nunca como critério isolado | ACOG Practice Bulletin 193 (2018); Williams 26ª |
| resumo (ectópica) | texto | Locais raros: ovário, abdome, colo | + cicatriz de cesariana; “cerca de metade sem fator de risco conhecido” | **Menor**: idem | ACOG PB 193 |
| correlação `placenta-previa`; q15 (explicacao) | descricao | “recobrindo total ou parcialmente o orifício interno” | Placenta prévia (recobre o orifício) × placenta de inserção baixa (< 2 cm); termos total/parcial/marginal abandonados. + migração placentária (confirmar no 3º trimestre); prévia + cesárea prévia → risco de acretismo | **Menor**: terminologia atual e risco associado | Reddy et al., J Ultrasound Med 2014; Williams 26ª |
| resumo; correlação `mola-hidatiforme` (descricao, mecanismo); incertezas | texto | “exigem seguimento com hCG” | Esvaziamento por aspiração a vácuo, hCG seriada até normalizar, contracepção no seguimento. p57 (gene de expressão materna): negativa na completa e positiva na parcial. Incerteza com as faixas de risco de NTG | **Menor**: conduta e diagnóstico atuais (escopo) | Ngan et al., FIGO 2021; Williams 26ª |
| resumo (hCG); pontosChave[4] | texto | “positivos já no fim da 2ª semana” | “… após a fertilização (≈ 4 semanas de IG)” | **Menor**: idade gestacional explícita | Moore 11ª, cap. 3 |
| emb-05-q10 | explicacao (a) | Biparental = gestação comum ou aborto hidrópico | + exceção: mola completa biparental familiar (NLRP7/KHDC3L), que não é o caso mais provável | **Menor**: precisão (gabarito c mantido) | Ngan et al., FIGO 2021 |
| emb-05-q15 | explicacao (a) | Intersticial “costuma romper no 1º trimestre” | Rompe na primeira metade da gestação, em geral mais tarde que a ampular, até o início do 2º trimestre | **Menor**: precisão clínica | Williams 26ª (Ectopic Pregnancy) |
| q03, q06, q07, q09, q11, q13, q15, q16 | alternativas | Correta 1,3 a 2,7 vezes mais longa (ex.: q16 169 × 62) | Comprimentos equivalentes | Pista involuntária | — |
| referencias | novas e ajuste | — | Reddy 2014; Ngan/FIGO 2021; capítulo da referência ACOG PB 193 ampliado (diagnóstico) | Rastreabilidade | — |

### Conferido sem alteração (olhar clínico e histológico)

- **Idade gestacional nas vinhetas**: 01-q03, q12 e q13, 02-q13, 05-q08 (7 semanas pela DUM), q10, q12 (sangramento de implantação: erro de ~4 semanas, conta refeita: dia 27 do ciclo usado como DUM) e q15 (32 semanas de IG). Todas explícitas e com conversão correta.
- **Ciclo e hormônios**:
  - ovulação ~14º dia em ciclo de 28 dias e ~21º em ciclo de 35 (fase lútea ~constante);
  - pico de LH → término da meiose I;
  - paradas em diplóteno e em metáfase II;
  - endométrio por fase (glândulas retas sob estrogênio × tortuosas e secretoras sob progesterona);
  - fase isquêmica.
- **Histologia**:
  - Sertoli e Leydig;
  - zona pelúcida (glicoproteica, acelular, formada no folículo primário);
  - teca interna (androgênios) e externa (fibrosa);
  - cito e sinciciotrofoblasto (sincício sem mitoses);
  - células deciduais.
- **Ectópica**: distribuição por local (Bouyer 2002, já conferida na etapa 1); mecanismo tubário pós-DIP (05-q09); vinhetas com massa anexial (04-q11, 05-q08).
- **Mola**: cariótipos 46,XX androgenético e 69,XXY/XXX diândrico; hCG mais alta na completa; risco de NTG maior na completa.
- **Reprodução assistida**:
  - indicações de FIV (fator tubário) e de ICSI (fator masculino grave, falha de fertilização);
  - ICSI dispensa corona, zona e fusão espontânea;
  - etapas da FIV com PGT (04-q23) em ordem inequívoca.
- **Não disjunção e idade materna**: mecanismo (parada prolongada em prófase I) e origem materna da maioria das trissomias 21 (02-q10).
- **Eventos de linha do tempo**: nenhuma nova ambiguidade. Os empates de `ordem` da etapa 1 continuam adequados. No tópico 02 só mudei o texto do evento `crescimento-folicular`, não a ordem.

## 3. Pontos para o revisor humano

1. **Vigência da Resolução CFM nº 2.320/2022.** Os limites citados (até 2 embriões até 37 anos, até 3 acima, até 2 euploides em qualquer idade) e a proibição de selecionar o sexo, exceto para evitar doença, vêm dessa resolução. Não encontrei resolução posterior que a substitua, mas não consegui abrir o DOU nem o site do CFM nesta sessão: a rede bloqueou `ses.sp.bvs.br`. Confirmar antes de publicar.
2. **Regras de datação.**
   - Os limites de correção da DUM (> 5 dias antes de 9 semanas; > 7 dias entre 9 e 13 semanas e 6 dias), o CCN até ~84 mm e o erro de ~5–7 dias seguem o ACOG CO 700. Conferi por cópias secundárias, não pelo PDF original.
   - Vale confirmar se a FEBRASGO e o Ministério da Saúde adotam os mesmos limites. Nenhuma questão os cobra.
3. **Zona discriminatória (3.500 mUI/mL).** Está só na correlação, como limiar conservador recomendado pelo ACOG (PB 193) e com o aviso de que um valor isolado não decide. Se preferirem não citar número algum, basta apagar essa oração.
4. **Transição lúteo-placentária (~7–9 semanas de IG).**
   - Baseia-se na série pequena de Csapo (1972) e em revisões, que variam entre 7–9 e 7–10 semanas.
   - Os números de Moore (~20 semanas) e Sadler (4º mês) foram mantidos como persistência do corpo lúteo, não como dependência dele.
5. **q24 do tópico 05.**
   - A reformulação (“começam a se formar”; “primeiros espaços do celoma”) torna a ordem defensável pelas duas obras.
   - Tabelas de estágios de Carnegie, porém, põem a transição saco primário → secundário entre os estágios 5c e 6, sem separar claramente os dois eventos.
   - Vale abrir a figura e o texto de Moore 11ª, cap. 3. Se ainda houver dúvida, a saída mais segura é trocar o item 3 por outro evento.
6. **Origem da triploidia.**
   - Moore e Zaragoza (2000) sustentam o predomínio da dispermia em abortos espontâneos.
   - Outros estudos acham mais casos digínicos conforme a idade gestacional da amostra.
   - A q10 do tópico 03 (aborto do 1º trimestre, sem alternativa digínica) continua com uma única resposta defensável.
7. **Gêmeos monozigóticos dicoriônicos após transferência de um único blastocisto.**
   - Vêm de séries de casos e a zigosidade nem sempre foi confirmada.
   - As questões (04-q12) seguem o modelo dos livros, e a divergência ficou registrada em nota.
8. **PGT-A.** A frase sobre benefício “não demonstrado como rastreamento de rotina para todas as pacientes de FIV” reproduz a ASRM 2024. Pode ser sensível para o público comercial do jogo, mas está correta segundo a fonte.
9. **Letrozol na SOP.** É a 1ª linha na diretriz internacional de 2023. No Brasil, o uso para indução da ovulação não consta da bula (é *off-label*). O texto não fala em bula; avaliar se cabe a menção.
10. **Referências citadas sem consulta ao texto.** As edições impressas não estavam disponíveis. Conferir:
    - capítulos e títulos de Williams Obstetrics 26ª (“Implantation and Placental Development”, “Ectopic Pregnancy”, “Gestational Trophoblastic Disease”);
    - Thompson & Thompson 8ª, cap. 6;
    - em Moore 11ª, cap. 2, a descrição da teca já no folículo primário em crescimento.
11. **Faixas de risco de NTG após mola**: completa ~15–20%; parcial de < 1% a ~5%, conforme a série (FIGO 2021, Williams). Ficaram só em `incertezas`, sem uso em questões.
12. **Restrições de rede desta sessão.** O WebFetch não alcançou `ses.sp.bvs.br`, `pmc.ncbi.nlm.nih.gov` nem `embryology.med.unsw.edu.au`. As verificações na web foram feitas por WebSearch, com resumos e cópias secundárias.

### Fontes consultadas na web nesta revisão

- ACOG Committee Opinion No. 700 — *Methods for Estimating the Due Date* (resumos e cópias: SMFM, StatPearls, protocolos que reproduzem a tabela).
- Resolução CFM nº 2.320/2022 (texto no DOU e comunicado do CFM, por resumos de busca).
- ASRM/SART. *The use of preimplantation genetic testing for aneuploidy: a committee opinion.* Fertil Steril 2024;122:421–34.
- Scott RT Jr et al. Fertil Steril 2013;100:624–30 (biópsia de blastômero × trofectoderma).
- Zegers-Hochschild F et al. *International Glossary on Infertility and Fertility Care, 2017* (PGT-A/M/SR).
- Csapo AI et al. Am J Obstet Gynecol 1972 (lutectomia) e revisões sobre a transição lúteo-placentária.
- ACOG Practice Bulletin 193 (via AAFP 2020 e cópia institucional): metade das pacientes sem fator de risco; zona discriminatória de até 3.500 mUI/mL.
- Reddy UM et al. J Ultrasound Med 2014;33:745–57 (placenta prévia × de inserção baixa).
- Ngan HYS et al. FIGO Cancer Report 2021 — doença trofoblástica gestacional (p57; seguimento).
- Zaragoza MV et al. Am J Hum Genet 2000;66:1807–20 (origem parental da triploidia).
- Hviid KVR et al. Hum Reprod Update 2018; Busnelli A et al. Fertil Steril 2019 (gemelaridade monozigótica após transferência de blastocisto).
- Teede HJ et al. J Clin Endocrinol Metab 2023;108:2447–69 (letrozol como 1ª linha na SOP).
- Relatos de gêmeos monozigóticos dicoriônicos após transferência de um único blastocisto (Shibuya & Kyono; Kyono; Fluhr et al.; revisão de 2024).
