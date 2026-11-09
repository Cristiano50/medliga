# Revisão por agentes — Laboratório 3D, estágios cardiovasculares (grupo `sistemas`)

- Agentes e etapas, em sequência:
  1. `revisor-estagios-3d-v1`, área **embriologia/anatomia**;
  2. `revisor-cardio-3d-v1`, área **cardiologia-pediatrica**.
- Data: 2026-11-09.
- Protocolo: `docs/protocolo-revisao-agentes.md`, nas partes que se aplicam a textos de estágio. Esquema: `EstagioSchema` em `src/content/schema.ts`. Padrão de relatório: `content/revisoes/estagios-3d.md`.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica, e `revisao.humano` continua `null` nos três estágios.

**Escopo.** Três entradas novas de `content/embriologia/estagios.json`:
- `septacao-cardiaca` (ordem 104);
- `arcos-aorticos` (105);
- `circulacao-fetal` (106).

**Com o que comparei:**
- os tópicos ligados: `emb-13-cardiovascular`, `emb-23-arcos-aorticos-veias` e `emb-24-circulacao-fetal`, e ainda `emb-07-semanas4a8` para a tabela de Carnegie;
- o modelo `src/modules/embriologia/modelos/cardiovascular.tsx` (`PARTES_SEPTACAO`, `PARTES_ARCOS_AORTICOS`, `PARTES_CIRCULACAO_FETAL`, geometrias e cores);
- as capturas em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/novos3d/`, com as vistas padrão, as numeradas, as de outros ângulos e as de desktop, e os arquivos `toque-*.json`.

**O que não mudou.** Conferido por script contra o arquivo anterior, que é igual ao `HEAD`:
- os ids, o `grupo`, a `ordem`, o `diaReferencia`, o `carnegie`, os `topicos` e os títulos;
- os ids e os nomes das estruturas;
- `revisao.humano`;
- os outros 15 estágios.

Nenhum código foi alterado.

## 1. Resumo

Gravidade das correções, como no relatório `estagios-3d.md`:
- **crítica**: fato errado;
- **importante**: afirmação imprecisa ou contraditória que o aluno levaria como fato;
- **menor**: redação, terminologia ou precisão.

| Estágio | Etapa | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| septacao-cardiaca | 1ª embriologia/anatomia | 0 | 0 | 2 | aprovado-com-correcoes |
| septacao-cardiaca | 2ª cardiologia pediátrica | 0 | 0 | 2 | aprovado-com-correcoes |
| arcos-aorticos | 1ª embriologia/anatomia | 0 | 1 | 2 | aprovado-com-correcoes |
| arcos-aorticos | 2ª cardiologia pediátrica | 0 | 0 | 1 | aprovado-com-correcoes |
| circulacao-fetal | 1ª embriologia/anatomia | 0 | 1 | 3 | aprovado-com-correcoes |
| circulacao-fetal | 2ª cardiologia pediátrica | 0 | 1 | 3 | aprovado-com-correcoes |
| **Total** | | **0** | **3** | **13** | 16 correções em 22 trechos editados |

**Nenhum fato errado (crítica).** As três importantes:
1. **Subclávia direita aberrante.** O mecanismo estava reduzido a "regressão do 4º arco direito".
2. **Artérias umbilicais.** Eram descritas como ramos das ilíacas internas e, na mesma frase, como vasos que "persistem como ilíacas internas".
3. **Os três desvios fetais.** Segundo o texto, eles "poupam órgãos que ainda não fazem sua função". O fígado fetal funciona e recebe parte do sangue umbilical.

**Desenhos.**
- **P1 (ensina errado): nenhum.** Os lados e todos os trajetos pedidos estão certos.
- **P2 (mostra mal): 4 itens.** O septum secundum aparece como placa com orifício; a cava inferior não aponta para o forame oval; o ducto arterioso fica quase escondido na vista padrão; a paleta imita o código de cores do adulto.
- **P3 (refinamento): 6 itens.**

## 2. Textos

### 2.1 1ª etapa — embriologia/anatomia (`revisor-estagios-3d-v1`)

#### Correções

| estágio | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| arcos-aorticos | `destaques[3]`; estrutura `arco-aortico-4-direito` | Subclávia direita aberrante "(regressão do 4º arco direito)"; "Sua regressão anormal origina a subclávia direita aberrante, retroesofágica." | Regridem o 4º arco direito **e a aorta dorsal direita cranial à 7ª intersegmentar**, e **persiste o segmento caudal**, que normalmente desaparece. A subclávia passa a nascer da parte distal do arco, depois da subclávia esquerda, e cruza atrás do esôfago. | Só a regressão do 4º arco não explica a artéria retroesofágica: o que forma a subclávia é a persistência do segmento caudal da aorta dorsal direita, que normalmente regride, junto com a 7ª intersegmentar. O próprio emb-23 traz o mecanismo completo na correlação `subclavia-direita-aberrante-lusoria` e na q26. | importante | Moore 11ª ed., cap. 13 (anomalias das artérias dos arcos); emb-23 (q26, correlação) |
| arcos-aorticos | `descricao` | "…o tronco pulmonar dá os 6os arcos." | "…dá as artérias do 6º arco." | "6os" é abreviação irregular, e quem sai do tronco são as artérias, não os arcos. | menor | — |
| arcos-aorticos | estrutura `nervo-laringeo-recorrente-direito` | "contorna o 4º arco direito, futura subclávia direita" | "…futura **parte proximal** da subclávia direita" | O 4º arco forma só a parte proximal; o restante vem da aorta dorsal direita e da 7ª intersegmentar, como diz o próprio destaque. | menor | emb-23; Moore 11ª ed., cap. 13 |
| septacao-cardiaca | `destaques[0]` | "…→ fusão do septum primum com os coxins (fecha o ostium primum) → septum secundum…" | "…→ fusão do septum primum com os coxins, que fecha o ostium primum. **À medida que o ostium secundum se forma**, cresce à direita o septum secundum…" | Moore descreve o septum secundum crescendo "à medida que o forame secundário se forma", quase junto com o fechamento do ostium primum. A seta sugeria que ele só surge depois da fusão, uma ordem que as fontes não sustentam. A ordem dos eventos de emb-13 (septum primum → ostium secundum → septum secundum) continua respeitada. | menor | Moore 11ª ed., cap. 13; emb-13 (eventos 4–6) |
| septacao-cardiaca | estrutura `septum-secundum` | "Prega muscular espessa… Não forma partição completa: recobre o ostium secundum e deixa uma abertura, o forame oval. Sua borda livre…" | "Prega muscular espessa, **em crescente**… recobre o ostium secundum, e **sua borda livre, côncava, delimita** uma abertura, o forame oval (**no modelo, simplificada como um orifício na placa**)." | O desenho mostra uma placa completa com um furo, o que contradiz "não forma partição completa" (ver P2-1). A ressalva evita que o aluno aprenda a forma do desenho e deve sair quando o desenho for corrigido. | menor | Moore 11ª ed., cap. 13; Sadler 14ª ed., cap. 13; emb-13 |
| circulacao-fetal | estrutura `arterias-umbilicais` | "Par de artérias, ramos das ilíacas internas… as partes proximais persistem como **ilíacas internas** e artérias vesicais superiores" | "…Após o nascimento, contraem-se; as partes proximais persistem como **artérias vesicais superiores**…" | A frase dizia, ao mesmo tempo, que as umbilicais são ramos das ilíacas internas e que persistem como ilíacas internas. O texto agora segue emb-24, o tópico principal do estágio. A redação de Moore, na perspectiva embrionária, aparece em emb-23 (ver §4, item 5). | importante | emb-24 (estrutura `arterias-umbilicais`); Moore 11ª ed., cap. 13 |
| circulacao-fetal | estrutura `arterias-iliacas` | "Ramos terminais da aorta. As ilíacas internas dão as artérias umbilicais…" | "As **ilíacas comuns** são os ramos terminais da aorta e dividem-se em ilíacas internas, que no feto dão as artérias umbilicais, e externas…" | Os ramos terminais são as ilíacas comuns; internas e externas são ramos delas. | menor | anatomia; Moore 11ª ed., cap. 13 |
| circulacao-fetal | estrutura `veias-umbilicais` | "Leva o sangue mais oxigenado do feto da placenta ao fígado, onde…" | "Leva da placenta ao fígado o sangue mais oxigenado do feto; no fígado, …" | Redação: "do feto da placenta" tinha leitura ambígua. | menor | — |
| circulacao-fetal | `dias` | "Feto a termo (≈ 38 semanas após a fertilização)" | idem + "; ≈ 40 semanas de idade gestacional" | `docs/conteudo-schema.md` pede idade gestacional explícita quando importa. Sem ela, o aluno pode ler "38 semanas" como idade gestacional do termo. | menor | conteudo-schema; emb-07 (convenção + 2 semanas) |

#### Conferido e correto, sem mudança

- **septacao-cardiaca:**
  - corte frontal com só a metade posterior, sem as vias de saída;
  - janela no fim da 6ª à 7ª semana, com forame oval formado e forame interventricular aberto, que fecha no fim da 7ª semana (emb-13, evento e13-forame-interventricular, dias 43–49);
  - septum primum: cresce do teto em direção aos coxins, já fundido a eles, com o ostium secundum no alto;
  - ostium secundum formado por apoptose antes do fechamento do ostium primum;
  - septum secundum: muscular, cresce da parede ventrocranial do átrio direito, nas 5ª–6ª semanas segundo Moore;
  - forame oval mais baixo que o ostium secundum, sem alinhamento entre os dois, com o septum primum como valva à esquerda;
  - coxins formados por transição epitélio-mesênquima, com o destino correto;
  - canais AV e as valvas tricúspide e mitral;
  - septo muscular: cresce do ápice, sobretudo pela dilatação dos ventrículos;
  - parte membranosa formada pelos coxins e pelas cristas conotruncais;
  - valvas venosas: a esquerda funde-se ao septo; a parte inferior da direita forma a valva da veia cava inferior e a do seio coronário;
  - origem de cada câmara: parte lisa do átrio direito pelo corno direito, do átrio esquerdo pela veia pulmonar, e cone arterial e vestíbulo da aorta pelo cone.
- **arcos-aorticos:**
  - remodelação na 6ª–8ª semana (Moore, como em emb-23);
  - pares que não coexistem; 1º e 2º reduzidos (maxilar; hióidea e estapédia, segundo Sadler); 5º ausente ou rudimentar;
  - derivados do 3º, do 4º e do 6º arcos e do saco aórtico (corno direito para o tronco braquiocefálico);
  - aorta dorsal cranial ao 3º arco forma a carótida interna distal;
  - ducto carotídeo regride dos dois lados;
  - aorta dorsal direita regride caudalmente à 7ª intersegmentar;
  - subclávias: a esquerda vem da 7ª intersegmentar; a direita, do 4º arco, da aorta dorsal direita e da 7ª;
  - origem da subclávia esquerda sobe para junto da carótida comum esquerda;
  - artérias vertebrais, intercostais e lombares;
  - laríngeos recorrentes, à direita e à esquerda, e sua inervação, com a exceção do cricotireóideo;
  - arco duplo e interrupção tipo B.
- **circulacao-fetal:**
  - os três desvios e seus trajetos;
  - crista dividens (segundo Moore, como em emb-24);
  - cava superior seguindo para o ventrículo direito; ventrículo esquerdo, coronárias, cabeça e membros superiores;
  - mistura na aorta descendente;
  - transição ao nascer;
  - os cinco remanescentes;
  - forame oval patente "à sonda" em parte dos adultos;
  - o cordão com 2 artérias, 1 veia e geleia de Wharton.

#### Carnegie

Mantive o campo vazio nos três estágios.

- **septacao-cardiaca.** "Fim da 6ª à 7ª semana" corresponde a ≈ 40–49 dias. Na tabela de emb-07 (Moore, Tab. 5-1), isso cobre os estágios **16** (37–42 dias), **17** (42–44), **18** (44–48) e **19** (48–51).
  - Os estágios são definidos pela morfologia externa.
  - As obras adotadas não fixam num estágio de Carnegie o estado dos septos mostrado: forame oval formado e forame interventricular ainda aberto.
  - Um intervalo 16–19 seria só a conversão de dias, não um dado inequívoco da fonte.
- **arcos-aorticos.** O quadro é de transição de propósito ("não representa um dia exato"). A janela de 6ª–8ª semana iria do estágio 16 ao 23 e não acrescentaria informação.
- **circulacao-fetal.** É período fetal. Os estágios de Carnegie (1–23) acabam no fim do período embrionário, então o campo não se aplica, como em `placenta-membranas`.

### 2.2 2ª etapa — cardiologia pediátrica (`revisor-cardio-3d-v1`)

#### Correções

| estágio | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| circulacao-fetal | `descricao` | "Três desvios **poupam órgãos que ainda não fazem sua função**: o ducto venoso…" | "Três desvios fazem parte do sangue placentário contornar o fígado e a maior parte do débito cardíaco contornar os pulmões, que ainda não fazem trocas gasosas: …" | O fígado fetal funciona (metabolismo, hematopoese) e recebe pelos sinusoides boa parte do sangue umbilical. Segundo os estudos com Doppler citados em emb-24 (Kiserud), a maior parte. O ducto venoso existe para levar sangue oxigenado direto ao coração e ao encéfalo, e não porque o fígado "não funciona". Redação de emb-24. | importante | emb-24 (`resumo`, `notasDivergencia`); Kiserud 2005 |
| circulacao-fetal | `descricao` (cores); estruturas `ducto-venoso`, `veia-porta`, `tronco-pulmonar`, `arterias-pulmonares` (e `ducto-arterioso`, na linha abaixo) | "…uma escala de saturação exigiria valores…; a oxigenação relativa está descrita no texto **de cada vaso**." Vários vasos não traziam essa informação. | Acrescentados: ducto venoso "o mais oxigenado"; veia porta "pouco oxigenado"; tronco "sangue pouco oxigenado (sobretudo o da cava superior)"; artérias pulmonares "sangue pouco oxigenado". Também: "escala **com valores** de saturação exigiria números…"; "descrita no texto dos vasos"; e o aviso "**o vermelho da aorta e o verde-azulado das veias cavas não indicam sangue arterial e venoso**". | A justificativa das cores dependia de uma afirmação que não era verdadeira em quatro vasos. Uma escala **ordinal**, sem números, não exige valores: é a que Moore e Sadler usam nas figuras. O aviso compensa, no texto, o problema de paleta descrito em P2-4. | menor | emb-24 (ordem qualitativa das saturações) |
| circulacao-fetal | estruturas `veia-cava-inferior`, `atrio-direito` | "é dirigida pela borda do septum secundum (crista dividens) ao forame oval" | "é dirigida **preferencialmente** pela borda **inferior** do septum secundum (crista dividens)…" | O fluxo é preferencial, e parte da corrente fica no átrio direito. Mesmo termo de emb-24, onde está registrada a divergência entre Moore (crista dividens) e Sadler (valva da veia cava inferior). | menor | emb-24 (`resumo`, `notasDivergencia`) |
| circulacao-fetal | estrutura `ducto-arterioso` | "desvia o sangue do ventrículo direito para a aorta descendente. Contrai-se ao nascer (…) e forma o ligamento arterial." | "desvia para a aorta descendente **a maior parte** do sangue pouco oxigenado do ventrículo direito. Contrai-se ao nascer (…): **fechamento funcional em horas a poucos dias** no recém-nascido a termo; **depois se oblitera** e forma o ligamento arterial." | Parte do débito do ventrículo direito vai aos pulmões. O texto agora separa o fechamento funcional do anatômico, como emb-24. | menor | emb-24 (estrutura e `notasDivergencia`) |
| arcos-aorticos | estrutura `ducto-arterioso` | "Após o nascimento, contrai-se e forma o ligamento arterial." | "…contrai-se e **depois se oblitera**, formando o ligamento arterial." | Mesma distinção entre fechamento funcional e anatômico, como em emb-23 e emb-24. | menor | emb-23; emb-24 |
| septacao-cardiaca | estrutura `ostium-primum` | "…o ostium primum persiste (defeito do septo AV)." | "…persiste: é a **CIA tipo ostium primum, forma parcial** do defeito do septo AV." | Nome clínico do defeito. "Defeito do septo AV", sozinho, o aluno associa à forma total (valva AV comum, CIV de via de entrada). | menor | nomenclatura de cardiologia pediátrica; emb-13 |
| septacao-cardiaca | `destaques[2]` | "…base da CIV membranosa." | "…base da CIV membranosa (**perimembranosa**, na nomenclatura clínica)." | O ecocardiograma e a clínica usam "perimembranosa". Integração com a área, sem mudar a afirmação embriológica. | menor | nomenclatura de cardiologia pediátrica; emb-13 (`incertezas`, tipo de CIV) |

#### Conferido e correto, sem mudança

- CIA tipo ostium secundum: reabsorção excessiva do septum primum, uma das causas.
- Defeito do septo AV e trissomia 21.
- Forame oval: valva unidirecional e fechamento funcional por inversão do gradiente atrial.
- Interrupção do arco tipo B (4º arco esquerdo; 22q11.2).
- Arco duplo como anel vascular.
- Trajeto torácico do laríngeo recorrente esquerdo.
- Os dois trajetos da circulação fetal nos destaques.
- Os mediadores do fechamento do canal (O₂ e prostaglandinas).
- O fluxo pulmonar fetal, que é pequeno.

#### Convenção de cores: avaliação da justificativa

A regra "as cores identificam estruturas, não oxigenação" é coerente com o restante do laboratório. No aparelho faríngeo, por exemplo, as artérias são vermelhas e os nervos, amarelos.

**O argumento central é correto.** No feto, o sangue se mistura em vários pontos, e um código vermelho/azul levaria o aluno ao padrão do adulto. A versão original tinha duas falhas:
- dizia que a oxigenação estava descrita em cada vaso, o que não era verdade (agora está);
- dizia que uma escala exigiria valores de saturação, o que vale só para escala numérica.

**O problema que fica é de desenho (P2-4).** A paleta escolhida reproduz, por acaso, o código do adulto nos grandes vasos:
- a aorta é vermelha (`#e5534b`);
- as cavas são verdes ou verde-azuladas (`#2f855a`, `#0f9b8e`);
- o tronco e as artérias pulmonares são violeta ou lilás.

Já o vaso mais oxigenado, a veia umbilical, é amarelo. E a cava inferior, que leva a corrente mais oxigenada vinda do ducto venoso, é verde-azulada.

O aviso agora está no texto. Mesmo assim, a imagem continua sugerindo a leitura do adulto a quem não lê a descrição.

## 3. Desenhos

### 3.1 Itens pedidos: resultado

| Item | Resultado | Como conferi |
|---|---|---|
| **Lados** nos 3 modelos | **Correto.** "Direita do embrião/feto" fica em −x. Na vista ventral, o lado esquerdo do embrião aparece à direita da tela. Exemplos: o ducto arterioso fica à direita da tela na vista ventral e à esquerda na dorsal (`arcos-aorticos-g220_0`); o ventrículo esquerdo e o ápice ficam para a esquerda do embrião (cisalhamento +x abaixo do plano AV). | `OrientacaoLados`; capturas padrão, `-m` e de outros ângulos |
| Laríngeo recorrente **direito** contorna o **4º arco direito** (subclávia) | **Correto.** Sai do vago abaixo do 4º arco (y 0,18, contra 0,38 do arco), passa sob ele por fora e sobe medialmente ao arco. O 6º direito termina num coto, sem a parte distal. | `nervoDir`, `arco4`, `ponta` do 6º direito; `-m`, `-g220_0` |
| Laríngeo recorrente **esquerdo** sob o **ducto arterioso** (6º esquerdo) | **Correto.** Sai do vago abaixo do ducto (y −0,28, contra −0,08), passa por baixo dele de lateral para medial e sobe medialmente ao 4º arco esquerdo. Na vista ventral, passa por trás do ramo ventral do arco. | `nervoEsq`, `ducto`; recorte ampliado da captura de desktop |
| **7ª intersegmentar** | **Correta.** É par e nasce da aorta dorsal de cada lado, caudal ao 6º arco: é a posição embrionária, antes de a origem da subclávia esquerda subir. Passa dorsalmente ao vago, como a subclávia no adulto. | `setima` |
| **Regressão da aorta dorsal direita caudal** | **Correta.** O segmento fica afinado (raio 0,036, contra 0,075) da 7ª intersegmentar até a fusão, só à direita. Na vista ventral padrão fica escondido (P3-3). | `dorsalRegressao`; `-g220_0` |
| **Ducto carotídeo** | **Correto.** Aparece afinado entre o 3º e o 4º arcos, dos dois lados. | `ductoCarotideo` |
| Septum primum, ostium secundum, septum secundum e forame oval | **Relações corretas.** O septum secundum está à direita (desvio −0,15) e é espesso; o septum primum é fino e fica no plano do septo. O ostium secundum está no alto do primum (altura 0,49–0,66) e o forame oval, mais baixo, no secundum (0,19–0,41), sem sobreposição; o primum fecha o forame pela esquerda. O desenho foge do esquema clássico só na **forma do secundum** (P2-1). | `OSTIO_SECUNDUM`, `FORAME_OVAL`, `SECUNDUM`, `noSepto`; `-m`, `-m-g70_0`, desktop |
| Forame interventricular aberto no momento escolhido | **Correto.** Uma película ocupa o espaço entre a borda livre côncava do septo muscular e os coxins fundidos. | `formaForameIV`, `bordaLivreIV` |
| Trajeto do **ducto venoso** | **Correto.** Parte da junção entre a veia umbilical e o ramo esquerdo da porta, dentro do fígado, sobe para a direita e para trás e chega à cava inferior no alto do fígado. | `ductoVenoso`, `FETO.juncao`, `FETO.entradaDV` |
| **Cava inferior → forame oval** | **Desemboca no átrio direito, mas não aponta para o forame** (P2-2). | `vci`, `vcs`, `septoInteratrial` |
| **Ducto arterioso** do tronco pulmonar à aorta descendente | **Trajeto correto.** Vai da bifurcação pulmonar, na origem da pulmonar esquerda, à aorta logo depois do arco, distal aos três ramos. Na vista padrão, porém, fica quase invisível (P2-3). | `ducto`, `aorta`, `ramos` |
| **Artérias umbilicais** saindo das ilíacas internas | **Aceitável.** Saem da ilíaca comum no ponto de origem da interna, descem à pelve e sobem pela parede anterior até o umbigo. O texto avisa que a interna não é desenhada (P3-4). | `arteriaCorpo`, `iliacaComum` |
| **Convenção de cores** | Ver §2.2 e P2-4. | `CORES` e as cores de cada `Parte` |

### 3.2 P1 — ensina errado

Nenhum.

### 3.3 P2 — mostra mal

**P2-1. `septacao-cardiaca`: o septum secundum aparece como placa completa com um furo.**

*O que está no código.* `formaSeptoAtrial(FORAME_OVAL, frente(SECUNDUM.desvio))` (linha 255) desenha o secundum do teto até a base, `BASE_SEPTO_ATRIAL`. O forame oval é um furo fechado (`forma.holes.push`, linha 151), e por isso há tecido do secundum também **abaixo** do forame.

*O que dizem as fontes.* No esquema de Moore e Sadler, o secundum é um **crescente**. A borda livre, côncava, fica voltada para baixo e para trás, e o forame oval é o espaço entre essa borda e a parte inferior do septum primum, fundida aos coxins. O próprio texto diz "não forma partição completa". O modelo da circulação fetal já usa um crescente aberto embaixo (`FENDA_SECUNDUM`), então os dois modelos se contradizem.

*Correção.* Trocar o furo do secundum por uma reentrância aberta caudal e posteriormente, chegando até a base, de modo que o forame oval fique entre a borda livre e o primum fundido aos coxins. É preciso manter:
- o forame oval abaixo do ostium secundum e sem sobreposição;
- a película do forame preenchendo o espaço do crescente;
- o primum visível através do forame.

Depois da correção, tirar do texto do `septum-secundum` a ressalva "(no modelo, simplificada como um orifício na placa)".

**P2-2. `circulacao-fetal`: a cava inferior não aponta para o forame oval.**

*O que está no código.*
- A `vci` (linha 663) termina na parte lateral do assoalho do átrio direito (≈ x −0,36, y 0,65), com o último segmento vertical.
- Fica na mesma linha da `vcs` (x ≈ −0,38, linha 664).
- O forame oval está no centro do septo interatrial calculado por `septoInteratrial` (≈ x −0,18, y 0,92), mais alto e mais medial.

O desenho sugere que as duas cavas se encontram no átrio direito. Não mostra a corrente da cava inferior sendo dirigida ao forame pela crista dividens, que é o ponto central do estágio e do primeiro destaque.

*Correção:*
- terminar a cava inferior na parte posteroinferior do átrio direito, junto ao septo, com o último segmento apontado para cima, medialmente e para trás, em direção à abertura inferior do crescente do septum secundum e ao forame;
- se preciso, baixar o forame no septo (deslocá-lo ao longo de `septo.descer`), para que a borda inferior do secundum (a crista dividens) fique logo acima do orifício da cava;
- manter a cava superior apontada para o ventrículo direito.

**P2-3. `circulacao-fetal`: o ducto arterioso quase não aparece na vista padrão.**

O `ducto` (linha 670) é curto e vai para trás, por trás do tronco pulmonar e do arco. No celular e no desktop, aparece só um ponto rosa acima do tronco. No teste de toque recebeu **2 toques**; a aorta recebeu 26 e o tronco pulmonar, 4. É um dos três desvios do estágio.

*Correção.* Qualquer uma destas opções resolve:
- lateralizar e alongar o ponto médio do ducto (mais para a esquerda e para cima), para que ele apareça ao lado da bifurcação, à esquerda do tronco;
- abrir o estágio numa oblíqua anterior esquerda leve;
- deixar translúcida a parte do tronco que o cobre.

**P2-4. `circulacao-fetal`: a paleta imita o código de cores do adulto.**

*O que aparece.*
- Aorta vermelha, cavas verde e verde-azulada, tronco e artérias pulmonares violeta e lilás. O ventrículo direito, grande e na frente, é vermelho.
- A veia umbilical, o vaso mais oxigenado do feto, é amarela.
- A cava inferior, que leva a corrente mais oxigenada vinda do ducto venoso, é verde-azulada.

O aluno que lê pelo hábito aprende o padrão do adulto, justamente o que a convenção quer evitar. O texto agora avisa, mas a imagem continua induzindo essa leitura.

*Correção.* Uma de duas opções, que é decisão de produto (§4):
- **(a)** tirar a aorta e as cavas do eixo vermelho/azul e usar cores claramente "de identidade", sem associação com oxigenação;
- **(b)** manter a paleta e oferecer uma camada opcional de **oxigenação relativa**, com legenda ordinal (mais oxigenado, misturado, menos oxigenado) e sem números, como nas figuras de Moore e Sadler e na ordem qualitativa de emb-24.

### 3.4 P3 — refinamento

**P3-1. `arcos-aorticos`: intersegmentares acima dos arcos.** Há intersegmentares em y = 1,0, cranial ao 3º arco (futura parte distal da carótida interna), e em y = 0,6, sobre o ducto carotídeo (array `intersegmentares`, linhas 451–454). Isso sugere que a carótida interna e o ducto carotídeo dão intersegmentares. Nos esquemas de referência, elas aparecem caudalmente aos arcos. Sugestão: começar no nível do 4º ou do 6º arco para baixo. O texto já diz "só alguns, esquemáticos".

**P3-2. `arcos-aorticos`: o tubo da via de saída responde como "Saco aórtico".** A haste da via de saída aórtica (`sacoHaste`) faz parte da `Parte` `saco-aortico` (linha 462). Tocar o tubo longo mostra "Saco aórtico", e foram 22 toques, quase todos no tubo. A descrição explica, mas uma tonalidade mais clara ou uma haste mais curta deixaria claro que o saco é só a dilatação. Não é preciso criar estrutura nova no JSON.

**P3-3. `arcos-aorticos`: a regressão da aorta dorsal direita só aparece na vista dorsal.** Na vista ventral padrão, o segmento afinado fica escondido atrás da via de saída e do tronco pulmonar (ver `-g220_0`). Sugestões: girar levemente a vista inicial ou deixar a via de saída translúcida.

**P3-4. `circulacao-fetal`: não há tronco da ilíaca interna.** As umbilicais saem da ilíaca comum, sem tronco da interna. Sugestão: desenhar um coto curto de ilíaca interna dentro da `Parte` `arterias-iliacas`, com a umbilical como sua continuação. Depois, tirar do texto da estrutura `arterias-iliacas` a frase "No modelo, as umbilicais saem do ponto…".

**P3-5. `circulacao-fetal`: a veia porta chega pelo lado errado.** A `veiaPorta` (linha 662) chega à junção vindo de baixo e da **esquerda** do feto (x 0,3), como uma tributária da veia umbilical. Na anatomia, o tronco porta sobe à direita da linha média (atrás do colo do pâncreas), e é o **ramo esquerdo** que corre para a esquerda até o recesso umbilical, onde encontra a veia umbilical. Sugestão: tronco vindo de baixo e da linha média ou da direita, com um ramo esquerdo até a junção.

**P3-6. `circulacao-fetal`: a aorta parece sair do ventrículo direito.** A raiz da aorta nasce dentro do ventrículo esquerdo (`h([0.1,-0.09,0.02])`), mas fica escondida atrás da esfera do ventrículo direito. Na vista padrão, a aorta parece sair do topo do VD, ao lado do tronco pulmonar. Sugestões: deixar o VD levemente translúcido ou mostrar um trecho da via de saída do VE. A relação entre as grandes artérias está certa: o tronco começa anterior e passa à esquerda e para trás, e a pulmonar direita passa atrás da aorta ascendente e da cava superior.

## 4. Para o revisor humano

1. **Carnegie vazio nos três estágios** (§2.1). Confirme se prefere manter vazio ou converter os dias pela tabela de emb-07:
   - septação: 16–19;
   - arcos: 16–23;
   - circulação fetal: não se aplica.

   Se a tabela de emb-07 mudar (pendência já registrada em `estagios-3d.md`, ponto 2), a conversão muda junto.
2. **Septum secundum em crescente ou em placa com orifício (P2-1).**
   - Esquema clássico de Moore e Sadler: crescente, com o forame delimitado embaixo pelo septum primum fundido aos coxins.
   - Anatomia do adulto (e descrições morfológicas recentes): a fossa oval tem borda quase completa, com uma borda inferior muscular que não vem do septum secundum.

   Recomendo o crescente, por coerência com os livros e com o modelo da circulação fetal. Quando o desenho mudar, a ressalva no texto do `septum-secundum` precisa sair.
3. **Convenção de cores (P2-4).** Decisão de produto:
   - manter a paleta por identidade, com o aviso agora no texto;
   - trocar as cores da aorta e das cavas;
   - ou oferecer uma camada opcional de oxigenação relativa, ordinal e sem números.
4. **emb-23 (fora do escopo; não alterado).** No `resumo` (Anomalias), o mecanismo da subclávia direita aberrante continua só "regressão do 4º arco direito". A correlação `subclavia-direita-aberrante-lusoria` e a q26 do mesmo tópico já trazem o mecanismo completo, que este estágio agora segue. Sugiro alinhar o resumo.
5. **Remanescentes das artérias umbilicais.**
   - emb-23 (resumo, pontos-chave, estrutura): as partes proximais persistem como "ilíacas internas e vesicais superiores". É a redação de Moore, na perspectiva da artéria umbilical embrionária, ramo das aortas dorsais.
   - emb-24 e emb-13: "vesicais superiores".

   O estágio segue emb-24, porque descreve as umbilicais como ramos das ilíacas internas, e a outra redação ficaria contraditória. Vale harmonizar os dois tópicos.
6. **Fontes de memória.**
   - "Septum secundum nas 5ª e 6ª semanas (Moore)", que já estava no texto, e "cresce à medida que o ostium secundum se forma", que entrou nesta revisão: confira em Moore, 11ª ed., cap. 13.
   - Sadler põe a formação dos septos principais entre os dias 27 e 37 (emb-13, `notasDivergencia`).
7. **Nomenclatura clínica acrescentada**:
   - "CIA tipo ostium primum, forma parcial do defeito do septo AV";
   - "CIV perimembranosa".

   Confirme se é a forma preferida para o público do app. A alternativa seria "defeito do septo atrioventricular parcial".
8. **Crista dividens × valva da veia cava inferior.** Moore atribui o direcionamento à crista dividens; Sadler, à valva da cava inferior. O estágio segue Moore, como emb-24, onde a divergência está registrada. Isso também vale para a eventual correção de P2-2.
9. **Tempos de fechamento do canal arterial.** "Horas a poucos dias no RN a termo" e "obliteração em semanas a meses" vêm de emb-24, que registra as faixas divergentes de Moore e Sadler. Nenhum número novo foi introduzido.
10. **Limite desta revisão.** Os fatos foram conferidos de memória contra as obras de referência (Moore 11ª ed. e Sadler 14ª ed., cap. 13) e contra os tópicos do app. Nenhum livro foi aberto nesta sessão e não fiz busca na web. As conferências de desenho se baseiam no código do modelo e nas capturas fornecidas. Não rodei o app.

## 5. Evidência

```
$ python3 -I .../scratchpad/rev-3d-cv/aplicar.py content/embriologia/estagios.json
trocas de texto aplicadas: 22
ids, grupos, ordens, dias de referência, carnegie, tópicos, títulos, estruturas (ids e nomes) e humano: iguais; outros estágios: iguais

$ git show HEAD:content/embriologia/estagios.json | cmp - .../scratchpad/rev-3d-cv/estagios.antes.json && echo "HEAD == antes"
HEAD == antes

$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

`tests/conteudo.test.ts` passa. Os testes conferem:
- que toda estrutura do estágio existe no modelo;
- que toda parte do modelo tem nome no estágio;
- que os estágios estão em ordem cronológica dentro do grupo.

Durante a revisão, outras frentes fizeram commits (`d575400` e anteriores) que tocaram tópicos de embriologia. Nenhum deles mexeu em `estagios.json`, `cardiovascular.tsx`, emb-13, emb-23 ou emb-24. O emb-07 mudou só numa explicação de questão e numa nota sobre CCN; a tabela de estágios continua igual. `git status` ao final mostra só `content/embriologia/estagios.json` modificado, mais este relatório (novo).

## 6. Fontes

- Moore, Persaud, Torchia. *Embriologia Clínica*, 11ª ed., cap. 13 (sistema cardiovascular): septação atrial e ventricular, artérias dos arcos faríngeos e suas anomalias, circulação fetal e neonatal. Tab. 5-1 (estágios de Carnegie, via emb-07).
- Sadler. *Langman — Embriologia Médica*, 14ª ed., cap. 13: septação, valvas venosas, artérias dos arcos, circulação antes e depois do nascimento.
- Tópicos do app: emb-07 (tabela de Carnegie); emb-13, emb-23 e emb-24 (resumos, estruturas, eventos, `notasDivergencia`, `incertezas`, correlações e questões citadas).
- Kiserud T. *Physiology of the fetal circulation*. Semin Fetal Neonatal Med, 2005 (via emb-24): fração do sangue umbilical que passa pelo ducto venoso.
