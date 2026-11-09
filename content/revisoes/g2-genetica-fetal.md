# Revisão por agente — Grupo G2, área genética médica / medicina fetal (etapa 2 de 2)

- Agente: `revisor-genetica-fetal-v1` · Área: `genetica-medica/medicina-fetal` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Etapa anterior: `content/revisoes/g2-embriologia.md` (`revisor-embriologia-v1`). O registro dela em `revisao.agentes` foi mantido intacto; o meu foi acrescentado depois dele.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos e em `derivados.json`.
- Escopo: `content/embriologia/topicos/` — emb-06-semana3, emb-07-semanas4a8, emb-08-periodo-fetal, emb-09-placenta-membranas, emb-10-malformacoes — mais `content/embriologia/derivados.json`. **Não editei `content/embriologia/estagios.json`** (outro revisor). Fora do grupo, por pedido do Cristiano, corrigi apenas a notação ISCN em `emb-02-gametogenese.json` (ponto 5).
- **Não fiz commit** (instrução explícita). **Registro honesto:** enquanto eu trabalhava, outra frente commitou as minhas edições em andamento — `6dc4c15` e `828c2bb` ("Revisão genética/medicina fetal em andamento", emb-06, emb-07 e parte de emb-10) e, depois, `424c610` ("tópicos 2, 6-10 e camadas (parcial)", o restante das edições de conteúdo e os registros em `revisao.agentes`). Conferi, depois desses commits, que todas as minhas edições continuam íntegras e que `revisao.humano` segue `null` nos seis arquivos. Este relatório não estava incluído nesses commits.

## 1. Resumo

| Arquivo | Questões / itens | Críticas | Importantes | Menores (conteúdo) | Pistas de comprimento* | Veredito |
|---|---|---|---|---|---|---|
| emb-06-semana3 | 29 questões | 0 | 0 | 0 | 7 questões | aprovado-com-correcoes |
| emb-07-semanas4a8 | 29 questões | 0 | 0 | 0 | 10 questões | aprovado-com-correcoes |
| emb-08-periodo-fetal | 29 questões | 0 | 1 | 2 | 9 questões | aprovado-com-correcoes |
| emb-09-placenta-membranas | 30 questões | 0 | 1 | 3 | 10 questões | aprovado-com-correcoes |
| emb-10-malformacoes | 30 questões | 0 | 2 | 5 | 10 questões | aprovado-com-correcoes |
| derivados.json | 33 itens | 0 | 0 | 1 | — | aprovado-com-correcoes |
| **Total (G2)** | **147 questões + 33 itens** | **0** | **4** | **11** | **46 questões** | |
| emb-02-gametogenese (fora do G2) | — | 0 | 0 | 1 | — | só a correção de ISCN |

Gravidades (protocolo): **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou conduta em desacordo com a prática; **menor** = redação, terminologia, referência ou complemento clínico.

\* **Pistas involuntárias.** São questões em que a alternativa correta era visivelmente mais longa e mais "completa" que as demais — o aluno acerta pelo formato, não pelo conteúdo. Era o ponto 11 que a etapa 1 deixou expressamente para o revisor transversal. Em 46 das 81 questões de múltipla escolha a correta era 1,35 a 3,7 vezes mais longa que a média dos distratores. O que fiz: reescrevi os distratores (e encurtei a correta quando ela trazia detalhe dispensável) para comprimento e especificidade parecidos; **não mudei gabarito, letras nem ids**; e reli cada distrator alongado para garantir que continua claramente errado. A remoção não corrige erro de conteúdo e por isso aparece em coluna própria. Depois das edições, nenhuma questão dos cinco tópicos ultrapassa o limiar de 1,35× (verificação automática abaixo).

**Não encontrei fato errado nem gabarito errado nas 147 questões.** O conteúdo de genética e de medicina fetal chegou a esta etapa correto e, no essencial, bem hedgeado: notação ISCN correta (`45,X`, `47,XXY`, `rob(14;21)`, `69,XXY`, sem o clássico "45,XO"), origem materna predominante da não disjunção da trissomia 21 com a meiose I identificada, 45,X sem efeito de idade materna e com perda frequentemente paterna, direção parental certa no imprinting de 15q11.2-q13, DNA fetal livre tratado como rastreamento de origem placentária que exige confirmação invasiva, janelas de translucência nucal, biópsia de vilo corial, amniocentese e cordocentese adequadas, corionicidade pelo dia da divisão, transfusão feto-fetal restrita às monocoriônicas e acretismo atribuído à falha da decídua basal sobre cicatriz uterina. Em `derivados.json`, **nenhum dos 33 itens precisou mudar de categoria**.

O que encontrei foi de quatro tipos: (1) mecanismo genético ou método diagnóstico ausente onde o aluno precisa dele; (2) uma afirmação clínica endossada por omissão numa explicação; (3) idade pós-fertilização apresentada sem conversão onde a leitura em idade gestacional muda a conduta; (4) terminologia obstétrica abandonada num distrator. Mais as pistas de comprimento.

### Distribuição das letras corretas (inalterada)

Não mexi em nenhum gabarito; a redistribuição feita na etapa 1 continua válida: emb-06 4/4/4/4, emb-07 5/4/4/4, emb-08 4/4/4/3, emb-09 5/4/4/4, emb-10 4/4/4/4 (a/b/c/d).

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade / fonte |
|---|---|---|---|---|---|
| `emb-10` → `resumo` (imprinting) e `emb-10-q10` → `explicacao` | texto | "a perda da contribuição paterna causa Prader-Willi e a da materna, Angelman" — só a direção parental | acrescentados, em termos qualitativos, a deleção como mecanismo mais frequente, seguida da dissomia uniparental e dos defeitos de imprinting, as variantes patogênicas de *UBE3A* na Angelman, e a ressalva de que o cariótipo convencional não detecta nada disso (microarranjo, MLPA, estudo de metilação) | O tópico cobra imprinting em duas questões e o aluno saía sem saber por que mecanismo a contribuição parental se perde nem que exame pedir. A proporção dos mecanismos foi dada qualitativamente, sem percentuais, como manda a regra 3 do schema. | **importante** — Thompson & Thompson, cap. 6 e 14 (já nas `referencias` do tópico) |
| `emb-10-q08` → `explicacao` | texto | "A alternativa (b) descreve a síndrome de Klinefelter (47,XXY)." | "…(47,XXY), em que cerca de metade dos casos decorre de erro na meiose I paterna e o efeito da idade materna, quando existe, é discreto." | O distrator (b) afirma que a frequência da Klinefelter "aumenta com a idade materna". A explicação o rotulava apenas como "descreve Klinefelter" e, por omissão, endossava a afirmação. Com cerca de metade dos casos de origem paterna, o aluno precisava da refutação explícita. | **importante** — Thompson & Thompson, cap. 6 |
| `emb-09-q12` → alternativa (b) | `texto` | "placenta prévia **centro-total**, com sangramento materno…" | "placenta prévia **recobrindo o orifício interno do colo**, com sangramento materno…" | Classificação total/parcial/marginal abandonada; a revisão de obstetrícia (G1, etapa 2) já a havia removido de emb-03. Distrator ensinava terminologia que o aluno não deve usar. | **importante** — coerência com `g1-obstetricia.md`; prática obstétrica corrente |
| `emb-08` → `resumo` e `notasDivergencia` | texto | "**26 a 29 semanas.** O feto pode sobreviver se nascer…" (idade pós-fertilização, sem conversão) | "**26 a 29 semanas** (≈28 a 31 semanas de idade gestacional)**.**…" + nota registrando que a literatura neonatal atual discute a periviabilidade em idade gestacional, na faixa de 22 a 25 semanas, com sobrevida progressiva e dependente de cuidado intensivo, e que o intervalo de Moore não deve ser lido como limiar clínico | Lido como idade gestacional — o que o aluno faz, porque é o referencial da clínica — o trecho afirmaria que a sobrevida começa por volta de 28 semanas de IG. É o tipo de erro que se carrega para o plantão. O conteúdo continua sem fixar um limiar único (decisão da etapa 1, mantida). | **importante** — Moore 11ª ed., cap. 6 (referencial de fertilização); ponto 5 da etapa 1 |
| `emb-10` → `resumo` (translocação) | texto | "portador normal, com 45 cromossomos, e risco elevado de prole trissômica" | "…, maior quando a portadora é a mãe" | O risco de recorrência diferente por sexo do portador é o dado que muda o aconselhamento; já estava na explicação de q06, mas não no resumo. | menor — Thompson & Thompson, cap. 6 |
| `emb-10-q09` → `explicacao` | texto | mecanismo embriológico da microdeleção 22q11.2, sem método diagnóstico | acrescentado: "A confirmação exige microarranjo cromossômico, FISH ou MLPA, pois a microdeleção não é visível no cariótipo convencional." | Questão de caso clínico que pede "a alteração genética": sem isso o aluno pede cariótipo e recebe resultado normal. | menor — Thompson & Thompson, cap. 5 |
| `emb-10-q18` → `explicacao` + `notasDivergencia` | texto | "…contracepção eficaz durante o uso e por período definido após sua suspensão" | "…contracepção eficaz desde antes do início e durante o uso, mantida por pelo menos um mês após a suspensão, prazo em que a bula brasileira ainda considera haver risco" + nota de divergência | "Período definido" não ensina nada; o foco da revisão pedia o programa de prevenção da gravidez. Prazo conferido em bulas brasileiras (risco até cerca de um mês após a interrupção; uma delas pede teste de gravidez até cinco semanas depois) — divergência registrada em vez de número único. | menor — bulas brasileiras de isotretinoína (verificadas na revisão) |
| `emb-10-q20` e `emb-10-q26` → `explicacao` | texto | tetraciclinas se depositam "na segunda metade da gestação" | "no segundo e no terceiro trimestres" | Coerência com o evento `janela-tetraciclina` (`diaMin` 84 = 14 semanas de IG = 2º trimestre), cuja descrição a etapa 1 já havia corrigido; as explicações ficaram para trás. | menor — coerência interna |
| `emb-09` → `resumo` (gemelaridade) | texto | janelas de divisão, sem dizer como se determina a corionicidade | acrescentado: a corionicidade é determinada com maior acurácia na ultrassonografia do **primeiro trimestre** — membrana espessa e **sinal do lambda** nas dicoriônicas, membrana fina com inserção em T (**sinal do T**) nas monocoriônicas | O tópico cobra corionicidade em três questões e a explicação de q24 já usava "membrana divisória fina" como pista, sem nomear o sinal. É o achado que define o seguimento (risco de transfusão feto-fetal) e o aluno brasileiro vê isso no laudo. | menor — Williams, obstetrícia (gemelaridade); coerente com a explicação de emb-09-q24 |
| `emb-09` → `resumo` (cordão) | texto | "a artéria umbilical única associa-se com frequência a outras anomalias, sobretudo cardiovasculares e renais" | "…, quando isolada, costuma ter bom prognóstico, mas associa-se com frequência clinicamente relevante a outras anomalias… e a restrição de crescimento — por isso indica avaliação morfológica dirigida" | O resumo era mais alarmista que a correlação clínica e que a q20 do próprio tópico, que trazem a ressalva do achado isolado. Alinhamento interno, sem afirmar percentuais (a `incertezas` do tópico registra que as proporções variam). | menor — Moore 11ª ed., cap. 7; coerência com `arteria-umbilical-unica` e emb-09-q20 |
| `emb-09` → `pontosChave` (acretismo) | texto | "acreta adere ao miométrio, increta o invade e percreta atravessa toda a parede uterina" | "…; os principais fatores de risco são cesariana prévia e placenta prévia" | Os fatores de risco estavam no `mecanismo` da correlação, mas não no ponto-chave — e são exatamente o que o foco desta etapa pedia (cesárea prévia + placenta prévia). | menor — Moore 11ª ed., cap. 7; prática obstétrica |
| `emb-08` → `resumo` + `notasDivergencia` | texto | amniocentese "(15–18 semanas)" | "a partir de 15 semanas; janela habitual de 15 a 18" + nota: protocolo da FEBRASGO descreve 15 a 20 semanas e indica a amniocentese a partir de 15 semanas completas; a amniocentese precoce (11 a 12 semanas) associou-se a mais perda fetal, pé torto e perda de líquido | A janela fechada escondia a regra que importa (não antes de 15 semanas) e o motivo dela. Enunciados das questões, que usam 15 a 18 semanas como instância válida, foram preservados. | menor — FEBRASGO, protocolo de diagnóstico pré-natal invasivo (verificado na revisão) |
| `emb-08` → `notasDivergencia` (BVC) | texto | "10 a 12 semanas em Moore; 10 a 13 na prática obstétrica corrente" | acrescentado "com parte da literatura brasileira citando até 14 semanas" | A faixa adotada (10 a 13) continua, mas a divergência precisava ficar registrada para o revisor humano. | menor — protocolos brasileiros (UFRJ, FEBRASGO) |
| `derivados.json` → `melanocitos` | `texto` | "Melanócitos" | "Melanócitos da pele" | O minijogo exige pertencimento inequívoco à categoria: "melanócitos" sem qualificação deixa espaço para o epitélio pigmentar da retina, que é neuroectoderma. A explicação já era restrita à pele; agora o enunciado também. Categoria, id e gabarito inalterados. | menor — Moore 11ª ed., cap. 19 |
| `emb-02-gametogenese` → `resumo` e correlação `idade-materna` (**fora do G2**) | texto | "47,+21" | "47,XX,+21 ou 47,XY,+21" | Notação não conforme à ISCN: o cariótipo precisa dos cromossomos sexuais antes do ganho. Corrigido a pedido do Cristiano; nenhuma outra alteração nesse arquivo e nenhum registro em `revisao.agentes` dele (não é meu grupo). | menor — ISCN 2020 |

### Questões com distratores reescritos (pistas de comprimento)

Sem mudança de gabarito, letras ou ids.

| Tópico | Questões | Razão correta/distratores antes | Depois |
|---|---|---|---|
| emb-06 | q06, q07, q09, q10, q11, q13, q15 | 1,50 a 2,60 | todas ≤ 1,35 |
| emb-07 | q01, q02, q06, q07, q08, q10, q11, q12, q16, q17 | 1,43 a 3,66 | todas ≤ 1,35 |
| emb-08 | q04, q05, q07, q08, q12, q13, q15, q16, q18 | 1,35 a 2,27 | todas ≤ 1,35 |
| emb-09 | q05, q06, q07, q08, q09, q10, q11, q12, q14, q24 | 1,38 a 2,16 | todas ≤ 1,35 |
| emb-10 | q05, q06, q08, q09, q10, q11, q12, q13, q14, q16 | 1,44 a 2,00 | todas ≤ 1,35 |

### `derivados.json` — conferência item a item (olhar de dismorfologia)

Reconferi os 33 itens. Além do ajuste em `melanocitos`, **nada mudou de categoria, de texto ou saiu do jogo**. Mantidos de propósito, com a justificativa:

- **`adeno-hipofise`** em "ectoderma superficial" (bolsa de Rathke, ectoderma do estomodeu), como em Moore e Sadler — a literatura que propõe origem na crista neural anterior fica como alerta para o revisor humano (ponto 6 da etapa 1).
- **`foliculos-tireoide`** restrito a "células foliculares da tireoide": a origem das células C (parafoliculares) é controversa e seria indefensável no jogo.
- **`ganglios-raiz-dorsal`** limitado aos nervos espinais — parte dos gânglios sensitivos cranianos tem contribuição placodal, e a restrição mantém o item inequívoco.
- **`epitelio-bexiga`** em endoderma, com a ressalva do trígono acrescentada na etapa 1.

## 3. Evidência

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.

$ npx vitest run
 Test Files  2 passed (2)
      Tests  29 passed (29)
```

A falha de `tests/conteudo.test.ts` relatada na etapa 1 (três modelos 3D sem estágio) **não existe mais**: a frente do laboratório 3D incluiu os estágios dos sistemas e as 29 asserções passam, inclusive `todo estágio tem modelo`, `toda estrutura listada no estágio existe no modelo`, `estágios em ordem cronológica dentro de cada grupo` e `alternativas com ids em ordem a, b, c…`.

Verificação das pistas de comprimento, depois das edições (razão entre o comprimento da alternativa correta e a média dos distratores, limiar 1,35):

```
emb-06-semana3            CUEs: nenhuma
emb-07-semanas4a8         CUEs: nenhuma
emb-08-periodo-fetal      CUEs: nenhuma
emb-09-placenta-membranas CUEs: nenhuma
emb-10-malformacoes       CUEs: nenhuma
```

Registro em `revisao.agentes` (etapa 1 preservada, `humano` intocado):

```
derivados.json            ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
emb-06-semana3.json       ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
emb-07-semanas4a8.json    ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
emb-08-periodo-fetal.json ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
emb-09-placenta-membranas.json ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
emb-10-malformacoes.json  ['revisor-embriologia-v1', 'revisor-genetica-fetal-v1']  humano: None
```

## 4. Pontos para o revisor humano

Primeiro os meus; depois os da etapa 1 que eu não podia resolver e continuam abertos.

1. **Ácido fólico em alto risco: 4 mg/dia × 5 mg/dia.** O conteúdo usa a faixa "4 a 5 mg/dia" com a divergência registrada (FEBRASGO 4 mg; documentos do Ministério da Saúde 5 mg, dose da apresentação do SUS). O foco desta revisão citava 4 mg/dia. **Decisão sua:** citar um valor único (e qual) ou manter a faixa. Está em emb-10 no resumo, nos pontos-chave, em q16 e na correlação `prevencao-acido-folico` — mexer num lugar exige mexer nos quatro.
2. **Limiar de periviabilidade.** Acrescentei a conversão para idade gestacional e a nota de que a literatura neonatal discute 22 a 25 semanas, mas **não fixei limiar** e não é decisão de embriologista: um neonatologista deveria dizer se o jogo cita o limiar praticado no Brasil e com que referência (SBP / Ministério da Saúde).
3. **Janela da biópsia de vilo corial.** Mantida 10 a 13 semanas, com a ressalva de não realizar antes de 10 semanas; parte da literatura brasileira usa até 14 semanas. Confirme a faixa que quer ensinar.
4. **Prazo de contracepção após a isotretinoína.** Adotei "pelo menos um mês após a suspensão", conforme as bulas brasileiras; uma delas pede teste de gravidez até cinco semanas depois. Se houver norma da Anvisa com prazo próprio, ela deve prevalecer — não encontrei o texto do programa de prevenção da gravidez em fonte oficial durante esta revisão, e registrei isso em `notasDivergencia`.
5. **Enriquecimentos de genética que deixei de fora de propósito**, para não inventar números nem inflar o tópico: risco de recorrência praticamente de 100% no portador de rob(21;21); proporções percentuais dos mecanismos da trissomia 21 (o conteúdo usa "maioria", "pequena parcela", "minoritário"); risco de recorrência dos defeitos do tubo neural. Se quiser qualquer um deles no app, me diga a fonte a adotar.
6. **`derivados.json`:** adeno-hipófise e epitélio do trígono vesical continuam sendo decisão sua (pontos 6 e 7 da etapa 1). Acrescento que `ganglios-raiz-dorsal` e `foliculos-tireoide` só são inequívocos porque estão redigidos com restrição — se alguém "simplificar" esses enunciados no futuro, o item passa a ter duas respostas defensáveis.
7. **Herdados da etapa 1, ainda abertos:** idades e CCN dos estágios de Carnegie 10–23 (emb-07, Tabela 5-1 de Moore — pendência mais importante do grupo, em 4 questões); volumes de líquido amniótico em emb-09 (números de Moore × curvas obstétricas); menção ao anúncio do fim da emergência do Zika (11/05/2017) além da portaria de 30/07/2017; fusão das pregas neurais em mais de um ponto e as duas janelas da fusão palatina.
8. **Fora do G2, para outra frente:** corrigi "47,+21" em `emb-02-gametogenese.json` por pedido explícito, mas **não revisei esse tópico** nem registrei revisão nele. Vale uma varredura de notação ISCN nos tópicos fora do G2 (emb-05 usa `69,XXY` e `46,XX` corretamente; não verifiquei os demais).
