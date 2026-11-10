# Revisão por agente — Modelos 3D da histologia, grupo A (`nefron` e `alveolo`)

- Agentes: `revisor-3d-histologia-v1` (1ª etapa, histologia) e `revisor-3d-fisiologia-v1` (2ª etapa, fisiologia/patologia) · Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (conferência de fonte primária por curl: E-utilities do PubMed, Europe PMC, OAI e páginas do PMC) · Esquema: `ModeloHistologia3DSchema` · Padrão de exigência e escala P1/P2/P3 dos desenhos: `content/revisoes/estagios-3d.md` e `correcoes-3d-*.md`.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos dois modelos.
- Objeto: textos de `content/histologia/modelos3d-a.json` e desenhos de `src/modules/histologia/modelos3d/grupo-a.tsx`, `geometria-nefron.ts` e `geometria-alveolo.ts`, avaliados pelas pranchas, pelas vistas brutas e pelas capturas do app (390×844 e 1280×800) e pela leitura do código da geometria.
- Arquivos alterados: só `content/histologia/modelos3d-a.json` e este relatório. **Nenhum código foi alterado**; as mudanças de desenho abaixo são **propostas**, não implementadas.
- Não mudaram: ids dos modelos, ids e lista de estruturas, `ordem`, `titulo`, `topicos`, `revisao.autor` (conferido por script contra a cópia de antes da revisão).
- Limite desta revisão: Junqueira, Ross, Guyton e Berne **não puderam ser abertos** nesta sessão (livros sem acesso pela rede). O que o texto atribui a eles vem dos tópicos his-16 e his-17, que já os citam de memória; a conferência foi feita na literatura de acesso aberto listada no item 8.

## 1. Resumo

Gravidade do texto: **crítica** = fato errado; **importante** = afirmação imprecisa ou ambígua que o aluno levaria como fato, ou aviso que faltava para um desenho que mostra mal; **menor** = redação, precisão, coerência. Desenho: **P1** ensina errado; **P2** mostra mal; **P3** refinamento.

| Modelo | Etapa | Críticas | Importantes | Menores | Desenho | Veredito |
|---|---|---|---|---|---|---|
| nefron | histologia | 0 | 2 | 6 | 0 P1 · 3 P2 · 7 P3 | aprovado-com-correcoes |
| nefron | fisiologia/patologia | 0 | 1 | 0 | — | aprovado-com-correcoes |
| alveolo | histologia | 0 | 4 | 6 | 0 P1 · 3 P2 · 7 P3 | aprovado-com-correcoes |
| alveolo | fisiologia/patologia | 0 | 0 | 1 | — | aprovado-com-correcoes |

São 20 correções em 26 trechos do JSON (15 do néfron, 11 do alvéolo). **Nenhum fato errado no texto e nenhum P1 nos desenhos.** Os dois textos já traziam os avisos principais (alça curta, janela da cápsula, taças com parede própria, rede capilar reduzida). O que faltava:

- no néfron, o nome "túbulo contorcido proximal" para uma peça que inclui a porção reta e desce à medula; o aviso de que os ramos da alça são paralelos no rim e aparecem afastados; e uma ressalva sobre a aquaporina-1 no ramo delgado das alças curtas;
- no alvéolo, uma frase ambígua que deixava ler "o tipo II cobre a maior parte da superfície"; a informação de que o tipo II é mais numeroso e cobre menos de 10%; e os avisos de que os três anéis do ducto não são esfíncteres e de que os tipo II não ficam junto à boca do alvéolo.

### Conferido e correto, sem mudança

- **Néfron**: trajeto espaço capsular → túbulo proximal → ramo descendente delgado → ramo ascendente espesso → mácula densa → contorcido distal → túbulo de conexão → ducto coletor; alça curta sem ramo ascendente delgado; polo vascular e polo urinário; mácula densa encostada no polo vascular do próprio corpúsculo, no ângulo entre as arteríolas, com as mesangiais extraglomerulares entre ela e o hilo; folheto parietal pavimentoso e visceral de podócitos; arteríola eferente → rede peritubular (vasa recta nos justamedulares); ducto coletor derivado do broto ureteral e néfron do blastema metanéfrico, como em emb-16.
- **Alvéolo**: sequência bronquíolo respiratório → ducto alveolar → saco alveolar → alvéolos; septo com capilares contínuos, fibras e células; capilares fora da luz; camadas da barreira hematoaérea iguais às de his-16; corpos lamelares e exocitose; macrófago alveolar; poro alveolar. O desenho tem 3 pneumócitos tipo II e 2 núcleos de tipo I, coerente com o tipo II mais numeroso.

## 2. Pontos declarados pelo desenhista: decisão

Saídas: **aviso cobre** · **faltava aviso** (corrigido no texto) · **desenho deve mudar** (item da lista do §4).

### Néfron

| Ponto | Decisão | Observação |
|---|---|---|
| Alça curta, curva na medula externa, sem ramo ascendente delgado; delgado → espesso pouco antes da curva; faixa da medula única | aviso cobre, com 2 acréscimos; **desenho deve mudar (P2-1)** | Correto para alça curta (Kriz 2026). Acrescentado: a curva já aparece em verde; a faixa não separa medula externa e interna; no rim os ramos são paralelos. Os ramos divergentes são o P2-1. |
| Porção reta do proximal dentro do "túbulo contorcido proximal" | **faltava aviso** (corrigido); P2-2 | O nome da estrutura passou a "Túbulo proximal (contorcido e reto)"; a descrição diz onde fica cada porção. Id mantido. |
| Túbulo de conexão não desenhado | aviso cobre (redação ajustada) | "não está desenhado à parte: … chega direto ao ducto coletor". |
| Glomérulo com 14 alças separadas, sem anastomoses e sem mesângio; podócitos em estrela, ampliados | aviso cobre (1 acréscimo) | Acrescentado que o tufo real é uma rede que se ramifica e volta a se unir (Terasaki 2020). Podócitos: P3-4. |
| Cápsula com janela | aviso cobre | — |
| Mácula densa exatamente na divisa espesso/distal | aviso cobre (1 acréscimo) | O texto já registrava Junqueira × Ross; acrescentado "no esquema, a placa azul fica na divisa entre os dois". A literatura de fisiologia lida põe a mácula no fim do ramo espesso cortical, com o contorcido distal começando "a distância variável" depois dela (Mount 2014; Peti-Peterdi e Harris 2010). Ver §6, ponto 3. |
| Túbulo cruza o ângulo entre as arteríolas | nada a avisar | É a anatomia real. |
| Células justaglomerulares só na aferente | **faltava aviso** (corrigido); P3-6 | "(em menor número, também da eferente)… No esquema, o manguito amarelo, só na aferente" (Barajas 1979, resumo). |
| Aferente mais calibrosa que a eferente | aviso cobre | "calibres… não são reais"; a relação desenhada é a aceita (Terasaki 2020). |
| Polo urinário a ~166° do vascular | aviso cobre | O texto diz "do lado oposto". |
| "O ducto coletor não faz parte do néfron; deriva do broto ureteral" | correto, sem mudança | Igual a emb-16 e a his-17. Túbulo de conexão: em camundongo, deriva do mesênquima do capuz (linhagem do néfron), e não do broto (Kobayashi 2008, texto integral; Georgas 2009, resumo). O texto não afirma a origem dele. Ver §6, ponto 4. |

### Alvéolo

| Ponto | Decisão | Observação |
|---|---|---|
| Taça com parede própria; septo compartilhado no pulmão | aviso cobre; P3-5 | Na região do poro as duas paredes quase se tocam (vão de 0,01), com os capilares entre elas. |
| Capilares em um anel e uma alça por alvéolo | aviso cobre (1 acréscimo) | Acrescentado "sem ligação desenhada com os ramos da artéria e das veias pulmonares". |
| Bronquíolo respiratório liso, com um alvéolo | aviso cobre | — |
| Saco alveolar como esfera translúcida | aviso cobre | Está na descrição da estrutura. |
| Botões de músculo liso como **anéis completos** | **faltava aviso** (corrigido) e **desenho deve mudar (P2-1)** | Sim, sugere esfíncter do ducto e, pela forma, anel de cartilagem. O aviso antigo só dizia "aparecem como anéis". Aviso novo em `contexto` e na descrição do ducto. |
| Tipo II junto à borda da boca; 3 tipo II e 2 núcleos de tipo I | **faltava aviso** (corrigido) e **desenho deve mudar (P2-2)** | O texto dizia "nos cantos dos septos" e o desenho os põe em fila perto da boca. Texto corrigido também para dizer que o tipo II é mais numeroso e cobre menos de 10% da superfície, como em his-16. |
| Corpos lamelares como esferas brancas, uma no ápice | **faltava aviso** (corrigido); P3-7 | Descrição: a do ápice representa um corpo em exocitose. |
| Barreira como mancha amarela | aviso cobre (1 acréscimo) | Camadas do texto corretas; acrescentado "marca só o local; as camadas não estão desenhadas". P3-4. |
| Poro como anel com canal curto | **faltava aviso** (corrigido); P3-6 | "No esquema, o anel roxo, ampliado, com um canal curto; no pulmão, é um simples orifício no septo." |
| Macrófago só na luz | **faltava aviso** (corrigido) | Na descrição e no aviso novo de `contexto`. |

## 3. Correções de texto

### Néfron

| gravidade | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| importante | estrutura `tubulo-contorcido-proximal` (`nome`, `descricao`); `descricao` do modelo; `destaques[0]` | nome "Túbulo contorcido proximal"; "No esquema, inclui a porção reta, que desce para a medula"; "túbulo contorcido proximal (porção contorcida e porção reta)" | nome "**Túbulo proximal (contorcido e reto)**"; "A porção contorcida fica no córtex; a porção reta, que o esquema mostra na mesma cor, desce do córtex à medula externa e é o início da alça de Henle"; "túbulo proximal (porção contorcida e porção reta)" | A peça laranja desce 0,4 para dentro da faixa da medula; chamá-la de "contorcido" ensina que o contorcido proximal entra na medula, e "túbulo contorcido… porção reta" é contradição nos termos. His-17 usa "túbulo proximal (contorcido e reto)". Id mantido. | his-17 (`resumo`); Kriz 2026 (porção reta nos raios medulares e na faixa externa) |
| importante | `contexto[2]`; estrutura `ramo-ascendente-espesso` | "…passa ao ascendente espesso pouco antes da curva." | "…pouco antes da curva, e por isso a curva já aparece em verde. No rim, os dois ramos da alça correm paralelos, em grampo; no esquema, estão afastados e divergem."; "No esquema, começa pouco antes da curva da alça." | O desenho mostra uma alça aberta em V (separação de 0,6 a 1,1 entre os ramos, para tubos de 0,1 de diâmetro); sem aviso, perde-se a ideia de grampo, base da contracorrente. O trecho verde ainda desce antes da curva. | Kriz 2026 (o ducto coletor "descends parallel to the TAL"; ramo delgado e ramo espesso atravessam a mesma faixa interna) |
| menor | `contexto[1]`; estrutura `glomerulo` | "o tufo real tem muito mais alças, organizadas em lóbulos…"; "poucas alças e sem o mesângio" | "o tufo real é uma rede com muito mais capilares, que se ramificam e voltam a se unir, organizada em lóbulos…"; "poucas alças, sem ligações entre elas e sem o mesângio" | O desenho tem alças independentes; o tufo é uma rede. | Terasaki 2020 |
| menor | `contexto[4]` | "O túbulo de conexão… não está destacado." | "…não está desenhado à parte: no esquema, o túbulo contorcido distal chega direto ao ducto coletor." | "Destacado" deixava dúvida se ele está no desenho. | `geometria-nefron.ts` |
| menor | `contexto[5]`; estrutura `medula-renal` | "As faixas… indicam só a região." | "…; a da medula não separa a medula externa da interna."; "…faixa translúcida de baixo, sem separação entre medula externa e interna" | O texto fala em "medula externa" e a faixa é única; a curva fica a 56% da altura da faixa. | Kriz 2026 |
| menor | estrutura `espaco-urinario` | (sem dizer como aparece) | "+ No esquema, o volume amarelado translúcido dentro da cápsula." | Única estrutura do corpúsculo sem indicação de como é vista. | `grupo-a.tsx` |
| menor | estrutura `macula-densa` | "…Ross, no fim do ramo ascendente espesso." | "…; no esquema, a placa azul fica na divisa entre os dois." | Diz onde o desenho a põe diante da divergência. | his-17 (`notasDivergencia`); Mount 2014 |
| menor | estrutura `celulas-justaglomerulares` | "…da túnica média da arteríola aferente, junto ao polo vascular…" | "…da arteríola aferente (em menor número, também da eferente)… No esquema, o manguito amarelo, só na aferente." | As células granulares existem em todo o componente vascular do aparelho, mais numerosas na aferente. | Barajas 1979 (resumo); Broeker 2022 |
| **importante (2ª etapa)** | estrutura `ramo-descendente-delgado` | "…muito permeável à água (aquaporina-1), que perde água para o interstício medular hipertônico." | "Na descrição clássica, é muito permeável à água (aquaporina-1) e perde água para o interstício medular hipertônico; nas alças curtas, como a deste esquema, estudos em roedores encontraram pouca ou nenhuma aquaporina-1 nesse ramo." | O modelo é de alça curta. A frase é a de Guyton e de his-17 para o ramo descendente em geral, mas não vale sem ressalva para o néfron desenhado. A descrição clássica foi mantida. | Nawata e Pannabecker 2018; Kriz 2026 (texto integral); Zhai 2007 (resumo) |

### Alvéolo

| gravidade | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| importante | estrutura `pneumocito-tipo-i` | "Célula pavimentosa muito delgada, menos numerosa que o pneumócito tipo II, que cobre a maior parte da superfície alveolar…" | "Célula pavimentosa muito delgada que cobre a maior parte da superfície alveolar (mais de 90%), embora seja menos numerosa que o pneumócito tipo II…" | A oração "que cobre a maior parte" podia ser lida como referida ao tipo II. | his-16; Crapo 1982 (resumo); Knudsen e Ochs 2018 |
| importante | estrutura `pneumocito-tipo-ii`; `destaques[2]` | "Célula cúbica, nos cantos dos septos, que secreta o surfactante…"; "os tipo II, cúbicos, ficam nos cantos dos septos…" | "+ mais numerosa que o pneumócito tipo I, mas que cobre menos de 10% da superfície alveolar"; "os tipo II, cúbicos, são mais numerosos, mas cobrem menos de 10% dela…" | Pedido da revisão: o par "mais numeroso × cobre pouco" é o ponto cobrado em his-16 e não estava no modelo. | Crapo 1982 (resumo: tipo I 8% e tipo II 16% das células; tipo II 7% da superfície); Knudsen e Ochs 2018 (tipo I "around 95%") |
| importante | `contexto` (item novo); estrutura `ducto-alveolar` | "no ducto alveolar, os botões de músculo liso aparecem como anéis"; "…desenhados como anéis alaranjados" | "No ducto alveolar, o músculo liso e as fibras elásticas ficam nas bordas livres dos septos, em torno das bocas dos alvéolos, e formam os botões vistos nos cortes. No esquema, aparecem como três anéis completos em volta da luz: não são esfíncteres que fechem o ducto nem anéis de cartilagem."; descrição no mesmo sentido | Três anéis completos e grossos em volta da luz sugerem esfíncter ou cartilagem. | Knudsen e Ochs 2018 |
| importante | `contexto` (item novo); estrutura `pneumocito-tipo-ii` | (sem aviso) | "No alvéolo em corte, os pneumócitos tipo II estão perto da boca do alvéolo e há um só macrófago, na luz. No pulmão, os tipo II ficam dispersos entre os tipo I, de preferência nos cantos onde os septos se encontram, e há macrófagos também nos septos."; "No esquema, as três células azuis, salientes na luz, perto da boca do alvéolo." | O texto dizia "cantos dos septos" e o desenho mostra outra posição. | Knudsen 2023; Knudsen e Ochs 2018 |
| menor | `contexto[2]` | — | "+ O alvéolo de trás, ligado ao alvéolo em corte pelo poro, abre-se para um ducto ou saco vizinho que não está desenhado." | A boca do alvéolo de trás aponta para o vazio. | `geometria-alveolo.ts` |
| menor | `contexto[3]`; estrutura `capilar` | "A rede capilar aparece como poucos tubos em anéis e alças; no septo, ela é densa." | "…, sem ligação desenhada com os ramos da artéria e das veias pulmonares; …"; "No esquema, os tubos vermelhos na face externa das taças, que corresponde ao meio do septo." | Os capilares são anéis fechados e ficam por fora da parede. | `geometria-alveolo.ts` |
| menor | estrutura `corpos-lamelares` | — | "+ No esquema, as esferas brancas dentro das células azuis; a do ápice, na superfície da célula, representa um corpo em exocitose." | Uma das esferas aflora na superfície. | `geometria-alveolo.ts` |
| menor | estrutura `macrofago-alveolar` | — | "+ No esquema, um só, na luz, sobre o epitélio." | O texto fala em septos e luz; o desenho tem só o da luz. | — |
| menor | estrutura `barreira-hematoaerea` | "No esquema, a mancha amarela sobre um capilar." | "…marca só o local; as camadas não estão desenhadas." | Evita que a mancha seja lida como uma camada. | — |
| menor | estrutura `poro-alveolar` | — | "+ No esquema, o anel roxo, ampliado, com um canal curto; no pulmão, é um simples orifício no septo." | O anel tem 17% do diâmetro do alvéolo e há um canal. | — |
| **menor (2ª etapa)** | estrutura `pneumocito-tipo-ii` | "…que secreta o surfactante…" | "Secreta o surfactante, que reduz a tensão superficial e evita o colapso do alvéolo na expiração…" | O modelo citava o surfactante sem dizer o que faz. | his-16; emb-14; Knudsen e Ochs 2018 |

## 4. Desenhos: lista P1/P2/P3 (propostas, não implementadas)

Medidas tiradas das constantes da geometria. Os testes de `tests/geometria-histologia-a.test.ts` precisarão acompanhar as mudanças de posição.

### Néfron

**P1:** nenhum.

**P2**

1. **Alça de Henle aberta em V, e não em grampo.** `curvaDistalCompleta()` em `geometria-nefron.ts`, pontos `[-0.62, -0.88, -0.08]` a `[0.12, 0.95, -0.36]`. O ramo espesso sobe em diagonal: a separação entre os ramos é 0,60 em y = −0,6, 0,93 em y = −0,15 e 1,12 em y = 0,4, para tubos de 0,10 de diâmetro. **Fazer:** subir o ramo espesso paralelo ao descendente (x ≈ −0,85 a −0,80) até y ≈ 0,3–0,5 e só então levá-lo, por trás do corpúsculo, ao polo vascular.
2. **Porção reta do túbulo proximal sem distinção da contorcida.** `curvaProximal()` (dois últimos pontos, comentário "parte reta") e `<Parte id="tubulo-contorcido-proximal">` em `grupo-a.tsx`. A peça laranja entra 0,40 na faixa da medula. O nome e a descrição novos cobrem por ora. O núcleo só aceita cor por `Parte` (`Malha` não tem cor), então um tom próprio para o trecho reto (de y ≈ 0,2 a −0,4) exige uma parte nova, com id novo, texto e entrada em his-17: fica para outra rodada. **Fazer já**, sem id novo: marcar a passagem contorcido → reto só com geometria (um estreitamento ou anel fino em y ≈ 0,2) e deixar o trecho reto vertical.
3. **Túbulo proximal contorcido tão curto quanto o distal.** Poligonais de controle: proximal contorcido 2,56; porção reta 0,62; contorcido distal 2,47 (`curvaProximal()` e `curvaDistalCompleta()` depois de `pontoMacula()`). O texto diz "distal mais curto que o proximal" e o desenho mostra os dois iguais; o aviso de `contexto[0]` cobre só em parte. **Fazer:** mais duas ou três voltas no proximal, ou distal com metade do comprimento.

**P3**

4. **Podócitos em gaiola.** `posicoesPodocitos()`: corpos em r = 0,31 e prolongamentos em r = 0,288–0,305, numa casca em volta do tufo; as alças só chegam a 0,293 na ponta. Parecem uma rede solta no espaço capsular. Fazer: apoiar corpo e prolongamentos sobre as alças (`alca.getPoint(t)` mais o raio do capilar), dois ou três por alça.
5. **Espaço capsular como esfera cheia.** `espaco: new THREE.SphereGeometry(CORPUSCULO.raioEspaco…)` em `grupo-a.tsx` inclui o volume do tufo. Fazer: casca entre r ≈ 0,30 e 0,408, ou manter com a frase nova da descrição.
6. **Células justaglomerulares só na aferente.** `trechoJustaglomerular()`. Opcional: trecho curto e mais fino na eferente.
7. **Divisa espesso/distal exatamente na mácula.** `divisaoMacula()`. Opcional: trocar de cor cerca de 0,1 depois da placa (ver §6, ponto 3). Manter enquanto o revisor humano não decidir.
8. **Faixa da medula única.** `REGIOES`. Opcional: linha ou tom em y ≈ −1,0 marcando medula externa e interna, com a curva (y = −0,97) acima dela.
9. **Ducto coletor sem outros afluentes.** `perfilDuctoColetor()`. Opcional: um ou dois tocos de túbulos de outros néfrons chegando ao ducto ("recebe vários néfrons").
10. **Alças do glomérulo sem ligações.** `curvasAlcasGlomerulares()`. Opcional: três ou quatro pontes curtas entre alças vizinhas.

### Alvéolo

**P1:** nenhum.

**P2**

1. **Ducto alveolar como três anéis completos.** `DUCTO.botoes`, `raioBotao`, `tuboBotao` em `geometria-alveolo.ts`; `botao: new THREE.TorusGeometry(...)` e `<Parte id="ducto-alveolar">` em `grupo-a.tsx`. Os toros ficam em x = −0,95, −0,33 e 0,36, perpendiculares ao eixo, e são **a única geometria** da estrutura "Ducto alveolar": quem a seleciona vê só anéis. **Fazer:** (a) trocar os três toros por anéis finos na borda da boca de cada alvéolo do ducto (toro de raio `raio · sen(meiaAbertura)` no plano da boca, para os `grupo: 'ducto'`), ou por segmentos em espiral; (b) dar ao ducto um volume de luz translúcido, como o do saco alveolar.
2. **Pneumócitos tipo II em fila junto à boca.** `TIPO_II = [[106, 200], [106, 262], [104, 338]]`; a borda da boca fica em polar 123°. **Fazer:** espalhar pela parede (polares 30° a 100°), um deles junto ao encontro com o alvéolo de trás (perto de `PORO`), e embutir a célula na parede: `centroTipoII()` hoje deixa a caixa inteira na luz, apoiada no revestimento.
3. **Alvéolo de trás aberto para o vazio.** Item `'vizinho'` de `alveolosIntactos()`: `abertura: [dn.x, dn.y, dn.z]` aponta para fora do modelo. **Fazer:** virar a boca para um trecho de saco ou ducto vizinho desenhado (ou para o próprio saco), ou fechar a taça.

**P3**

4. **Barreira longe do capilar.** `capilarDe()` põe o eixo do capilar a 0,9 da espessura da parede, na face externa; a mancha (`BARREIRA`) fica na face da luz. Fazer: no alvéolo em corte, trazer o capilar sob a mancha para junto do revestimento, ou afinar a parede ali, para sugerir a parte delgada do septo.
5. **Taças separadas por vãos.** `alveolosIntactos()`. Aproximar as taças vizinhas do ducto e do saco até as paredes se tocarem.
6. **Poro com canal e anel grosso.** `PORO` (`raioAnel` 0,058) e `poroCanal` (comprimento 0,12). As duas paredes já estão a 0,01 uma da outra; reduzir o anel e o canal.
7. **Corpos lamelares lisos.** `CORPOS_LAMELARES_LOCAIS`. Opcional: duas ou três lamelas concêntricas num deles.
8. **Bronquíolo respiratório com um só alvéolo e sem músculo.** `BRONQUIOLO`. Opcional: segundo alvéolo.
9. **Capilares em anéis fechados.** `capilaresLocais()`. Opcional: um ramo de entrada e um de saída.
10. **Leitura no celular.** Na vista padrão de 390×844, as células do alvéolo em corte ocupam poucos pixels (captura `alveolo-390x844-baixa.png`); dependem do zoom.

## 5. Fisiologia e patologia (2ª etapa)

Cada afirmação funcional dos dois modelos, conferida contra a literatura lida e contra his-16 e his-17. Guyton e Berne não puderam ser abertos.

| Afirmação do texto | Resultado | Fonte lida |
|---|---|---|
| Túbulo proximal reabsorve cerca de dois terços da água e do sódio filtrados | confirmado (qualitativo) | Zhuo e Li 2013: "approximately 65% of filtered load"; "65% to 70%" |
| Ramo descendente delgado muito permeável à água (aquaporina-1) | **ressalva acrescentada** para a alça curta | Nawata e Pannabecker 2018; Kriz 2026; Zhai 2007 (resumo) |
| Ramo ascendente espesso impermeável à água, Na⁺-K⁺-2Cl⁻, dilui o fluido | confirmado | Mount 2014 |
| Mácula densa: sensor do NaCl do fluido tubular | confirmado | Peti-Peterdi e Harris 2010; Mount 2014 |
| Células justaglomerulares com grânulos de renina, na aferente | confirmado | Broeker 2022; Kurtz 2011 (resumo) |
| Contorcido distal reabsorve NaCl e cálcio | confirmado | Subramanya e Ellison 2014 |
| Ducto coletor: sob ADH, células principais inserem aquaporina-2 na membrana apical | confirmado | Pearce 2015 |
| Arteríola eferente forma a rede peritubular; vasa recta nos justamedulares | confirmado para os vasa recta | Kriz 2026 |
| Pneumócito tipo II secreta surfactante dos corpos lamelares e é progenitor do tipo I | confirmado | Knudsen e Ochs 2018; Knudsen 2023 |
| Barreira: pneumócito tipo I, lâminas basais fundidas, endotélio | confirmado | Knudsen 2023 (lâmina basal única na parte delgada) |
| Capilar de endotélio contínuo | confirmado | Knudsen e Ochs 2018 |
| Macrófago fagocita surfactante usado | confirmado | Knudsen e Ochs 2018 |
| Poro alveolar: ventilação colateral, passagem de bactérias e exsudato | mantido como em his-16; papel ainda discutido na literatura | Blickensdorf 2020 |

O texto dos modelos **não traz** número clínico, espessura da barreira, lei de Laplace nem descrição do feedback tubuloglomerular; esses temas estão em his-16 e his-17 e não foram alterados. Os dois percentuais do alvéolo ("mais de 90%", "menos de 10%") são morfométricos, iguais aos de his-16. Coerência com as correlações clínicas: necrose tubular aguda (porção reta proximal e ramo espesso na medula externa) e doença da membrana hialina, enfisema e proteinose alveolar não contradizem nada do que os modelos mostram.

## 6. Pontos para o revisor humano

1. **Nome "Túbulo proximal (contorcido e reto)".** Mudei o nome exibido no modelo; o id `tubulo-contorcido-proximal` continua, e o registro do app mostra para ele a definição de his-17 ("…no córtex"). Decida se prefere manter o nome antigo e pedir ao desenhista que separe a porção reta.
2. **Aquaporina-1 no ramo delgado das alças curtas.** Guyton e his-17 descrevem o ramo descendente delgado como muito permeável à água por aquaporina-1. Zhai et al. (2007) não acharam aquaporina-1 em todo o ramo descendente delgado de 90% dos néfrons de alça curta do camundongo e descrevem o mesmo em cortes de rato e de rim humano (li só o resumo); Nawata e Pannabecker (2018) e Kriz et al. (2026), lidos na íntegra, dizem o mesmo para roedores. Deixei a descrição clássica e acrescentei a ressalva. Se preferir o texto só de livro, basta apagar a segunda oração. His-17 não foi alterado; talvez mereça uma nota de divergência.
3. **Mácula densa.** Junqueira (início do contorcido distal) × Ross (fim do ramo espesso) vêm de his-17, citados de memória; não li os livros. A literatura de fisiologia lida apoia Ross. O desenho fica na divisa. Decida se a troca de cor deve ir para depois da placa (P3-7).
4. **Túbulo de conexão.** Não está desenhado e o texto não diz de onde vem. Em camundongo, ele deriva do mesênquima do capuz, a linhagem do néfron, e não do broto ureteral. Emb-16 não cita o túbulo de conexão. Se um dia for desenhado, a cor deve ser a do néfron, e não a do ducto coletor.
5. **Células justaglomerulares na eferente.** Acrescentei "(em menor número, também da eferente)" com base no resumo de Barajas (1979); his-17 cita só a aferente. Conferir em Junqueira e Ross.
6. **"Mais de 90%" e "menos de 10%".** Crapo (1982) foi lido só no resumo (tipo II cobre 7%); Knudsen e Ochs (2018), na íntegra (tipo I cerca de 95%). Os valores repetem his-16.
7. **Anéis do ducto alveolar.** O aviso diz que os anéis "não são esfíncteres que fechem o ducto". Junqueira, pelo que lembro, descreve esses feixes como "semelhantes a esfíncteres" em torno das aberturas dos alvéolos; não li o livro. Confira se a redação do aviso está de acordo com a edição adotada e escolha a opção de redesenho (P2-1).
8. **Curva da alça curta.** O esquema põe a passagem delgado → espesso "pouco antes da curva". Kriz et al. (2026) descrevem o ramo delgado passando ao espesso "after a turn"; Zhai et al. (2006, só o resumo) descrevem três tipos de curva nas alças curtas. O texto diz "no esquema" e não afirma como é no rim. No ser humano, boa parte das alças curtas faz a curva ainda no córtex, nos raios medulares (Kriz 2026); o modelo mostra a curva na medula externa.
9. **"Segmento mais longo do néfron" e "distal mais curto que o proximal".** São frases de livro-texto, iguais às de his-17; não foram conferidas em fonte primária. O desenho mostra os dois com o mesmo comprimento (P2-3).
10. **Calibre das arteríolas.** Aferente mais larga que a eferente foi confirmado em glomérulos de camundongo (Terasaki 2020). A inversão nos néfrons justamedulares, clássica nos livros, não foi conferida; o texto não a cita.
11. **Macrófagos "dos septos".** Redação de Junqueira e Ross, igual à de his-16. A imunologia atual separa macrófagos alveolares (luz) de intersticiais; não mudei.
12. **Fora deste arquivo, não alterado:** his-17 poderia ganhar nota de divergência sobre a aquaporina-1 (ponto 2) e sobre as células justaglomerulares na eferente (ponto 5).

## 7. Evidência

```
$ python3 aplicar.py content/histologia/modelos3d-a.json modelos3d-a.ANTES.json   # script da revisão, fora do repositório
trocas aplicadas: 26; entradas de revisão acrescentadas: 4
ids/ordem/tópicos/títulos/lista de estruturas iguais ao arquivo de antes; revisao.humano = null

$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 Test Files  17 passed (17)
      Tests  170 passed (170)

$ git diff --stat -- content/histologia/modelos3d-a.json
 content/histologia/modelos3d-a.json | 64 +++++++++++++++++++++----------------
 1 file changed, 36 insertions(+), 28 deletions(-)
```

A árvore de trabalho já tinha alterações de outra frente (`content/histologia/modelos3d-b.json`, `geometria-lobulo.ts`, `grupo-b.tsx`, `tests/geometria-histologia-b.test.ts`); não são desta revisão e não foram tocadas. Nada foi commitado.

## 8. Fontes conferidas

Acesso em 2026-11-10, por curl. "Integral" = corpo do artigo lido (XML do Europe PMC, OAI do PMC ou página do PMC); "resumo" = só o resumo do PubMed (E-utilities).

| Fonte | Identificação | Leitura | Trecho decisivo |
|---|---|---|---|
| Kriz W, Kaissling B, Le Hir M. Pflugers Arch 2026 | PMID 41688577 · [PMC12904963](https://pmc.ncbi.nlm.nih.gov/articles/PMC12904963/) | integral | "Short loops of Henle… consist (i) of a thick descending part (proximal straight tubule PST) located within the medullary rays of the cortex and within the outer stripe, (ii) of a thin descending limb (SDTL) that traverse the inner stripe… and after a turn into the (iii) thick ascending limb (TAL)… Touching its parent glomerulus with the macula densa, before transforming into the distal convoluted tubule"; "draining via the distal convoluted and connecting tubule… into the collecting duct CD, which descends parallel to the TAL"; "the initial part of the SDTLs is sparsely equipped with AQP1 channels"; "The EA of a juxtamedullary glomerulus splits into DVRs"; no ser humano, "short loops include a substantial portion of cortical loops, which form their bends already in the medullary rays of the cortex" |
| Nawata CM, Pannabecker TL. J Comp Physiol B 2018 | PMID 29797052 · [PMC6186196](https://pmc.ncbi.nlm.nih.gov/articles/PMC6186196/) | integral (manuscrito do autor) | "There is little or no expression of the water channel AQP1 in the short-looped DTL of the rat and mouse" |
| Zhai XY et al. J Am Soc Nephrol 2007;18:2937 | PMID 17942963 | resumo | "complete absence of aquaporin-1 along the entire length of descending thin limbs of 90% of short loop nephrons"; "also… in sections of human and rat kidneys" |
| Zhai XY et al. J Am Soc Nephrol 2006;17:77 | PMID 16319188 | resumo | "three types of short-looped nephron bends were identified" |
| Christensen EI et al. Am J Physiol Renal Physiol 2014;306:F664 | PMID 24477686 | resumo | curvas das alças curtas na faixa interna da medula externa; "Each CD drained approximately three to six nephrons" (rato) |
| Mount DB. Clin J Am Soc Nephrol 2014 | PMID 25318757 · [PMC4220766](https://pmc.ncbi.nlm.nih.gov/articles/PMC4220766/) | integral | "The TAL then meets its parent glomerulus at the vascular pole; the plaque of renal tubular cells at this junction constitutes the macula densa… The distal convoluted tubule (DCT) begins at a variable distance after the macula densa"; "active Na+-Cl− absorption by the water-impermeable TAL dilutes the luminal fluid" |
| Peti-Peterdi J, Harris RC. J Am Soc Nephrol 2010 | PMID 20360309 · [PMC4577295](https://pmc.ncbi.nlm.nih.gov/articles/PMC4577295/) | integral (manuscrito do autor) | "The macula densa plaque is a unique group of 15 to 20 cells located at the end of the cortical thick ascending limb"; "the high distal tubular [NaCl]-induced afferent arteriolar vasoconstriction (tubuloglomerular feedback) and the low tubular [NaCl]-induced renin release" |
| Kobayashi A et al. Cell Stem Cell 2008 | PMID 18682239 · [PMC2561900](https://pmc.ncbi.nlm.nih.gov/articles/PMC2561900/) | integral (manuscrito do autor) | "The ureteric epithelium generates the collecting duct network of the mature kidney"; "the connecting segment derives from the main body of the nephron and not the collecting duct" |
| Georgas K et al. Dev Biol 2009;332:273 | PMID 19501082 | resumo | "these cells are derived from the cap mesenchyme and not the ureteric epithelium" |
| Zhuo JL, Li XC. Compr Physiol 2013 | PMID 23897681 · [PMC3760239](https://pmc.ncbi.nlm.nih.gov/articles/PMC3760239/) | integral (manuscrito do autor) | "Proximal tubules are responsible for reabsorbing approximately 65% of filtered load" |
| Subramanya AR, Ellison DH. Clin J Am Soc Nephrol 2014 | PMID 24855283 · [PMC4255408](https://pmc.ncbi.nlm.nih.gov/articles/PMC4255408/) | integral | "In the early DCT, apical sodium reabsorption is exclusively mediated by thiazide-sensitive NaCl cotransporter (NCC)"; reabsorção de cálcio por TRPV5, regulada pelo PTH |
| Pearce D et al. Clin J Am Soc Nephrol 2015 | PMID 24875192 · [PMC4284417](https://pmc.ncbi.nlm.nih.gov/articles/PMC4284417/) | integral | "AVP binding to its type 2 receptor (V2R) in the basolateral membrane of principal cells… leads rapidly to translocation of AQP2 from intracellular vesicles to the apical membrane" |
| Broeker KAE et al. Pflugers Arch 2022 | PMID 35511367 · [PMC9338909](https://pmc.ncbi.nlm.nih.gov/articles/PMC9338909/) | integral | "juxtaglomerular cells in the kidney, which are located in the walls of the afferent arterioles at their entrance into the glomeruli" |
| Barajas L. Am J Physiol 1979;237:F333 | PMID 386808 | resumo | "Juxtaglomerular granular cells… are present throughout the vascular component but are more numerous in the afferent arteriole" |
| Kurtz A. Annu Rev Physiol 2011;73:377 | PMID 20936939 | resumo | renina circulante vem das células justaglomerulares das arteríolas aferentes |
| Terasaki M et al. Sci Rep 2020 | PMID 33230129 · [PMC7683536](https://pmc.ncbi.nlm.nih.gov/articles/PMC7683536/) | integral | "The afferent arteriole branches to form a complex network of capillaries that converges back to the efferent arteriole"; "It is already accepted that the afferent arteriole is wider than the efferent arteriole" |
| Pollak MR et al. Clin J Am Soc Nephrol 2014 | PMID 24875196 · [PMC4123398](https://pmc.ncbi.nlm.nih.gov/articles/PMC4123398/) | integral | epitélio parietal contínuo com o túbulo proximal no polo urinário; arteríolas aferente e eferente no polo vascular |
| Crapo JD et al. Am Rev Respir Dis 1982;126:332 | PMID 7103258 | resumo | "type I epithelial cells were found to comprise 8% of the cells… Seven percent of the alveolar surface was covered by alveolar type II cells, which make up 16% of the total alveolar cells" |
| Knudsen L, Ochs M. Histochem Cell Biol 2018 | PMID 30390118 · [PMC6267411](https://pmc.ncbi.nlm.nih.gov/articles/PMC6267411/) | integral | "type I alveolar epithelial cells which cover around 95% of the total alveolar surface… interspersed with single cuboidal type II alveolar epithelial cells"; "At these alveolar entrance rings (which also represent the 'wall' of alveolar ducts), connective tissue (mostly elastic) fibers and smooth muscle cells can be found"; "the alveolar duct as such does not have a wall of its own"; "surfactant stabilizes alveolar dimensions and thus prevents alveolar collapse by a surface-area dependent reduction of alveolar surface tension"; "a continuous capillary endothelium" |
| Knudsen L et al. Front Physiol 2023 | PMID 37025383 · [PMC10070844](https://pmc.ncbi.nlm.nih.gov/articles/PMC10070844/) | integral | "The AE2 cells are usually located in the corners of the alveoli or in niches between segments of the alveolar capillary network"; na parte delgada, "a single basement membrane (BM), which is shared by both the alveolar epithelium and the capillary endothelium"; barreira "interrupted only by the alveolar entrance and by inter-alveolar pores of Kohn" |
| Blickensdorf M et al. Front Microbiol 2020 | PMID 32903715 · [PMC7438790](https://pmc.ncbi.nlm.nih.gov/articles/PMC7438790/) | integral | poros de Kohn interligam alvéolos e dão passagem a macrófagos; "the role of Pores of Kohn in the mammalian lung is still under debate" |

**Não abertos:** Junqueira e Carneiro, Ross e Pawlina, Guyton e Hall, Berne e Levy (livros); Kriz e Bankir, "A standard nomenclature for structures of the kidney" (1988; PMID 3352156, sem resumo no PubMed e sem texto no PMC); texto integral de Zhai 2006 e 2007 (journals.lww.com não respondeu pela rede da sessão).
