# Revisão por agente — Modelos 3D da histologia, grupo B (`lobulo-hepatico`, `sarcomero` e `juncoes-celulares`)

- Agentes: `revisor-3d-histologia-v1` (1ª etapa, histologia) e `revisor-3d-fisiologia-v1` (2ª etapa, fisiologia/patologia) · Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (conferência de fonte primária por curl: E-utilities do PubMed, Europe PMC, OAI e páginas do PMC) · Esquema: `ModeloHistologia3DSchema` · Formato, padrão de exigência e escala P1/P2/P3 dos desenhos: `content/revisoes/modelos3d-histologia-a.md`.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos três modelos.
- Objeto: textos de `content/histologia/modelos3d-b.json` e desenhos de `src/modules/histologia/modelos3d/grupo-b.tsx`, `geometria-lobulo.ts`, `geometria-sarcomero.ts` e `geometria-juncoes.ts`, avaliados pelas pranchas, pelas vistas avulsas, pelas capturas do app (390×844 e 1280×800, repouso e contraído, isolada e corte), pela leitura do código da geometria e por medidas tiradas dele (script da revisão, fora do repositório).
- Arquivos alterados: só `content/histologia/modelos3d-b.json` e este relatório. **Nenhum código foi alterado**; as mudanças de desenho abaixo são **propostas**, não implementadas.
- Não mudaram: ids dos modelos, ids, nomes e lista de estruturas, `ordem`, `titulo`, `escala`, `topicos`, `descricao` geral de cada modelo e `revisao.autor` (conferido por script contra a cópia de antes da revisão).
- Limite desta revisão: Junqueira, Ross e Guyton **não puderam ser abertos** (livros sem acesso pela rede). O que o texto atribui a eles vem dos tópicos his-02, his-09 e his-15, que já os citam de memória; a conferência foi feita na literatura listada no item 8, parte dela só no resumo (indicado caso a caso).

## 1. Resumo

Gravidade do texto: **crítica** = fato errado; **importante** = afirmação imprecisa ou ambígua que o aluno levaria como fato, ou aviso que faltava para um desenho que mostra mal; **menor** = redação, precisão, coerência. Desenho: **P1** ensina errado; **P2** mostra mal; **P3** refinamento.

| Modelo | Etapa | Críticas | Importantes | Menores | Desenho | Veredito |
|---|---|---|---|---|---|---|
| lobulo-hepatico | histologia | 0 | 4 | 4 | 0 P1 · 3 P2 · 7 P3 | aprovado-com-correcoes |
| lobulo-hepatico | fisiologia/patologia | 0 | 0 | 1 | — | aprovado-com-correcoes |
| sarcomero | histologia | 0 | 2 | 4 | 0 P1 · 2 P2 · 5 P3 | aprovado-com-correcoes |
| sarcomero | fisiologia/patologia | 0 | 0 | 1 | — | aprovado-com-correcoes |
| juncoes-celulares | histologia | 0 | 2 | 5 | 0 P1 · 1 P2 · 6 P3 | aprovado-com-correcoes |
| juncoes-celulares | fisiologia/patologia | 0 | 1 | 1 | — | aprovado-com-correcoes |

São 25 correções em 30 trechos do JSON (11 do lóbulo, 7 do sarcômero, 12 das junções). **Nenhum fato errado no texto e nenhum P1 nos desenhos.** O que pesa:

- **Lóbulo hepático.** O destaque principal do modelo (sangue da periferia para o centro, bile no sentido oposto) está certo no texto, mas **não pode ser lido no desenho**: os sinusoides não se ligam a nada (a veia centrolobular é um tubo fechado, não há ramos terminais da porta e da artéria, os canalículos não chegam ao ducto). Além disso, os sinusoides se afunilam em direção à veia centrolobular, ao contrário do que se descreve no fígado, e os canalículos aparecem como canos salientes sobre a face de corte. Faltavam os avisos; foram escritos. São os três P2.
- **Sarcômero.** O desenho e a legenda ao vivo estão corretos para os números que usam, mas esses números (filamento fino de 1,0 µm) são os clássicos do **músculo de rã**. Nos músculos humanos medidos, o filamento fino tem cerca de 1,2 a 1,4 µm. O modelo se diz "de mamífero" e mostra a legenda com duas casas decimais; faltava a ressalva, que foi escrita. Os filamentos finos dos sarcômeros vizinhos estão em linha com os do sarcômero central, como se atravessassem a linha Z.
- **Junções celulares.** O texto dava ao hemidesmossomo do epitélio simples desenhado a composição do hemidesmossomo da epiderme (BP180 e BP230), e citava pênfigo e penfigoide sem dizer que são doenças de epitélios estratificados, com alvos (desmogleínas 1 e 3; BP180/BP230) que não são os das junções do epitélio simples. Corrigido. No desenho, a zônula de adesão tem a mesma geometria da zônula de oclusão (faixa que preenche a fenda).

### Conferido e correto, sem mudança

- **Lóbulo hepático**: veia centrolobular no centro e espaços porta nos ângulos; tríade (ramo portal maior e de parede fina, arteríola menor e de parede espessa, ducto de epitélio cúbico); placas de uma célula de espessura no adulto; hepatócito com faces sinusoidais dos dois lados da placa e canalículo entre hepatócitos vizinhos, vedado por zônulas de oclusão; endotélio fenestrado sem lâmina basal contínua; espaço de Disse com microvilosidades e células estreladas; célula de Kupffer na luz do sinusoide; canais de Hering; lóbulo humano sem septos (há no porco); "sangue do tubo digestivo, do baço e do pâncreas"; zona 3 menos oxigenada e sede da lesão por paracetamol. O sentido do fluxo da bile está em quatro lugares do texto (descrição, destaque 1, canalículo e ducto).
- **Sarcômero**: limites e conteúdo das bandas A, I e H; linha Z no meio da banda I e linha M no meio da banda H; banda A constante e bandas I e H mais curtas na contração; legenda ao vivo (repouso: 2,50 · A 1,60 · I 0,90 · H 0,50; contraído: 2,10 · 1,60 · 0,50 · 0,10; I = sarcômero − A; H = sarcômero − 2 × filamento fino); rede hexagonal com o fino entre três grossos; cabeças fora da zona nua, voltadas para as linhas Z, em coroas de três giradas 40° (compatível com os períodos de 14,3 e 42,9 nm); titina da linha Z à linha M; tríade na junção A-I, duas por sarcômero, e, no cardíaco, túbulo T na linha Z com díades; receptor de rianodina e SERCA. Nome exibido **"Banda H"**, igual ao de his-09.
- **Junções celulares**: ordem apical → basal (oclusão, adesão, desmossomo); zônulas contínuas e desmossomo em disco; claudinas e ocludina; E-caderina, cateninas e cinturão de actina; desmogleínas e desmocolinas com placa presa à queratina; conexon de seis conexinas; integrina α6β4 e plectina; lâmina basal de colágeno IV, laminina, nidogênio e perlecan; microvilosidades com eixo de actina preso à trama terminal. Definições dos ids novos `cinturao-de-actina` e `filamentos-de-queratina` conferidas, sem mudança; `titina` e `filamento-grosso`, idem; `filamento-fino` foi corrigido (item 3).

## 2. Pontos declarados pelo desenhista: decisão

Saídas: **aviso cobre** · **faltava aviso** (corrigido no texto) · **desenho deve mudar** (item da lista do §4).

### Lóbulo hepático

| Ponto | Decisão | Observação |
|---|---|---|
| Placas como paredes retas que se bifurcam (6 → 12 → 24), e não a rede anastomosada | aviso cobre | `contexto` já dizia. A descrição da estrutura dizia "se ramificam"; passou a dizer "se anastomosam", como his-15, com a ressalva do modelo. |
| Sinusoides como cones lisos, sem endotélio | **faltava aviso** (corrigido) e **desenho deve mudar (P2-1)** | O aviso cobria "tubo liso, sem endotélio", mas não o calibre: a luz cresce de 0,035 para 0,122 de raio na zona A, cai para 0,019 e volta a 0,122 na zona B, cai para 0,023 e chega a 0,094 na zona C. O sinusoide fica mais estreito junto da veia centrolobular, o inverso do descrito (Wisse 1983, rato, resumo). |
| Casca do espaço de Disse só no trecho médio | aviso cobre; P3-4 | — |
| Canalículos como sulcos verdes nas faces de corte, calibre exagerado: (a) fica claro que estão entre hepatócitos e nunca na face sinusoidal? | **faltava aviso** (corrigido) e **desenho deve mudar (P2-3)** | A topologia está certa: tubo de raio 0,018 no plano médio de uma placa de 0,10, a 0,032 de cada face sinusoidal. Mas não são sulcos: são tubos com metade para fora da face de corte, e o aluno os lê como canos apoiados sobre a placa. As pontas afloram nas extremidades das placas (P3-7). |
| (b) o sentido do fluxo da bile está no texto? | sim, sem mudança | Descrição, destaque 1 e estruturas `canaliculo-biliar` e `ducto-biliar`. No desenho, o caminho não aparece (P2-2; aviso novo). |
| Tríade completa nos 6 ângulos | aviso cobre | Lau 2021: no fígado humano, número de espaços porta por lóbulo não uniforme. |
| Proporções de parede arbitrárias (ramo portal fino, artéria espessa) | nada a avisar | A relação desenhada é a correta: parede de 12% do raio na veia e de 57% na artéria. |
| Cores | **faltava aviso** para o vermelho do sinusoide (corrigido); P3-5 e P3-6 | Azul da veia centrolobular, violeta do ramo portal e verde da bile não induzem erro. O vermelho do sinusoide, ao lado do vermelho-escuro da artéria, sugere sangue arterial: o aviso de cores passou a dizer que é sangue misto, em maior parte portal. A moldura azul-clara fica entre os tons das veias (ver moldura). |
| Células de Kupffer na luz do sinusoide | correto, nada a avisar | Dixon 2013; igual a his-15. |
| Zonas do ácino não desenhadas | aviso cobre | Destaque 4 conferido (Kietzmann 2017; Yoon 2016). |
| "sangue do tubo digestivo, do baço e do pâncreas" | correta | Eipel 2010: baço, estômago, intestinos, vesícula e pâncreas. |
| "faces voltadas para os sinusoides de cada lado da placa" | correta | Treyer e Müsch 2013; Kietzmann 2017 ("face blood channels called sinusoids at either side"). |
| Moldura de seis barras entre os espaços porta | **faltava aviso** em `contexto` (corrigido); P3-6 | Não lembra o septo do porco (são barras finas em cima e embaixo da fatia, e não paredes), mas é um objeto sólido, tocável, de cor próxima à dos vasos. A ressalva "limite imaginário, sem septo" só estava na descrição da estrutura; foi levada ao aviso, com "as barras não representam vasos". |

### Sarcômero

| Ponto | Decisão | Observação |
|---|---|---|
| Comprimentos (2,5 µm; grosso 1,6; fino 1,0; contraído 2,1 com H = 0,1) | **faltava ressalva** (corrigido); **desenho deve mudar (P2-1)**, só a legenda | Grosso: ~1,65 µm, quase constante entre espécies (Gokhin 2012); 1,6 está bem. Fino: 1,0 µm é o valor do músculo de rã (~0,94; Gokhin e Fowler 2013); no ser humano, 1,19 a 1,37 µm em deltoide e peitoral maior (Gokhin 2012, integral) e 1,30 µm no extensor radial curto do carpo (Lieber 1994, resumo). Com filamento fino humano, um sarcômero de 2,5 µm não teria banda H de 0,5 µm. Decisão: manter os números de livro, com ressalva em `contexto` e na estrutura; ver §6, ponto 4. |
| Banda A constante; I e H encurtam; legenda ao vivo | correto | Valores da legenda conferidos em `bandas()`; Squire 2016. |
| Rede de 7 grossos e 12 finos | aviso cobre | 6 finos a D/√3 e 6 a 2D/√3; o grosso central tem seis finos em volta. |
| Cabeças simples, em coroas de três, que não se movem | aviso cobre, com 1 acréscimo; P3-3 | Acrescentado que as pontes cruzadas não estão desenhadas (as cabeças não tocam os finos). |
| Uma titina por meio filamento, como mola | aviso cobre | "Na realidade são várias": provavelmente seis por meio filamento (Squire 2016; Tskhovrebova e Trinick 2010). |
| Túbulo T e retículo como anéis na junção A-I; distinção com o cardíaco | correto; aviso cobre; P3-4 | Al-Qusairi e Laporte 2011; Setterberg 2021. |
| Linha Z como disco branco; linha M como disco amarelo | **faltava aviso** (corrigido); **desenho deve mudar (P2-2)** | Os filamentos finos dos sarcômeros vizinhos usam as mesmas 12 posições e ficam em linha com os do sarcômero central. |
| "Banda H" × "zona H" | sem mudança | His-09 usa "Banda H" (id `banda-h`); o modelo exibe "Banda H". "Zona H" é o termo da literatura em inglês (H-zone); ver §6, ponto 6. |
| Barra "sarcômero" como cota tocável | aviso cobre | "não é uma estrutura do tecido". |

### Junções celulares

| Ponto | Decisão | Observação |
|---|---|---|
| Zônula de oclusão como faixa sólida | aviso cobre | Farquhar e Palade 1963: faixa contínua, com fusão das membranas. |
| Zônulas contornam também as faces sem vizinha | aviso cobre | — |
| Ordem apical → basal: oclusão, adesão (com cinturão de actina), desmossomo | correta | Farquhar e Palade 1963; Meng e Takeichi 2009. |
| Zônula de adesão (não declarado) | **faltava aviso** (corrigido); **desenho deve mudar (P2-1)** | Mesma geometria da zônula de oclusão, só translúcida: parece uma segunda vedação. Nessa junção o espaço intercelular é mantido (~200 Å). |
| Junção comunicante entre o 1º e o 2º desmossomo | aviso cobre, com 1 acréscimo; P3-3 | Acrescentado: cada bastão é um par de conexons, e o estreitamento do espaço (~2 nm) não foi desenhado. |
| Lâmina basal só com a lâmina densa; lâmina lúcida com filamentos de ancoragem | aviso cobre (redação ajustada) | "Artefato de fixação" passou a "artefato do preparo convencional": Chan e Inoue (1994, resumo) atribuem a lâmina lúcida à desidratação, não à fixação. Ver §6, ponto 10. |
| Queratina do hemidesmossomo ao desmossomo, esquemática | **faltava aviso** (corrigido); P3-4 | Aviso novo em `contexto`. |
| Pênfigo, penfigoide bolhoso, E-caderina/cateninas, integrina α6β4, plectina | conferidos; **2 correções importantes** | Hemidesmossomo do epitélio simples (tipo II) e doenças bolhosas em epitélio estratificado; §3 e §5. |
| Claudinas/ocludina e conexinas | conferidas; 1 ajuste menor | Permeabilidade seletiva da zônula de oclusão. |

## 3. Correções de texto

### Lóbulo hepático

| gravidade | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| importante | `contexto[2]` | "…cada sinusoide é um tubo liso, sem o endotélio fenestrado desenhado." | "+ Os tubos se alargam para a periferia e recomeçam estreitos a cada bifurcação das placas só por causa da geometria do esquema: no fígado, os sinusoides não se afunilam em direção à veia centrolobular (no rato, os centrolobulares são mais largos e retos que os periportais)." | O desenho mostra o gradiente de calibre ao contrário (P2-1). | Wisse 1983 e McCuskey 2003 (resumos, rato) |
| importante | `contexto` (item novo, índice 3); estrutura `veia-centrolobular` | (sem aviso) | "O caminho do sangue e o da bile não podem ser seguidos no desenho. Não estão desenhados os ramos terminais da veia porta e da artéria hepática, que saem do espaço porta, correm pelos limites do lóbulo e se abrem nos sinusoides; a parede da veia centrolobular aparece inteira, sem as aberturas por onde os sinusoides desembocam; e os canalículos terminam na ponta das placas, sem a ligação com o ducto biliar (canais de Hering)."; na estrutura, "+ No modelo, o tubo azul, de parede inteira: as aberturas dos sinusoides não estão desenhadas." | O texto diz "recebe os sinusoides" e "ramos de distribuição levam aos sinusoides"; o desenho não mostra nenhuma dessas ligações (P2-2). | Wisse 1983 (resumo: "sinusoidal inlets", "sinusoidal outlets"); Teutsch 2005 (resumo); Boyer 2013; his-15 |
| importante | `contexto[6]` (antes 5); estrutura `canaliculo-biliar` | "…ali os sulcos dos canalículos ficam à mostra; eles nunca passam pela face do hepatócito voltada para o sinusoide."; "No modelo, linhas verdes nas faces de contato expostas pelo corte e entre as camadas." | "No esquema, são os tubos verdes, que correm no meio da espessura da placa, à mesma distância dos sinusoides dos dois lados. …ali os canalículos ficam à mostra, como tubos salientes: não correm sobre uma face livre da célula e nunca passam pela face do hepatócito voltada para o sinusoide."; "No modelo, tubos verdes nas faces de contato expostas pelo corte, entre as camadas e entre células vizinhas da mesma camada." | O desenho mostra tubos salientes, não sulcos nem linhas (P2-3); faltava dizer o que o aluno vê e citar os trechos verticais. | Treyer e Müsch 2013; `geometria-lobulo.ts` |
| importante | `contexto[8]` (antes 7) | "…a moldura marca só o lóbulo clássico." | "+ Ela é um limite imaginário: no fígado humano não há septo de conjuntivo entre os lóbulos (há no porco), e as barras não representam vasos." | A ressalva só aparecia ao tocar a estrutura. | Albadry 2024; Lau 2021 |
| menor | `contexto[0]` | "O lóbulo real é um prisma mais longo que largo; a veia centrolobular…" | "Nos livros, o lóbulo é um prisma mais alto que largo; em reconstruções tridimensionais do fígado humano, as unidades são poliedros de forma e tamanho variáveis. A veia centrolobular…" | "O lóbulo real é um prisma" afirma como fato a idealização dos livros. | Teutsch 2005 (resumo); Lau 2021 |
| menor | estrutura `placas-de-hepatocitos` | "Lâminas de hepatócitos com uma célula de espessura que irradiam… e se ramificam…; no modelo, blocos de faces planas em duas camadas." | "Lâminas de hepatócitos, com uma célula de espessura no adulto, que se anastomosam e irradiam…; no modelo, blocos de faces planas, sem núcleo desenhado, em duas camadas, que formam paredes retas e bifurcadas." | Coerência com his-15 ("se anastomosam"); "ramificam" descrevia o desenho como se fosse o tecido. | his-15; Choi e Enomoto 2025 |
| menor | estrutura `canaliculo-biliar` | "Sulco entre as faces de contato de hepatócitos vizinhos, sem parede própria…" | "Canal estreito entre hepatócitos vizinhos, formado por um sulco na face de contato de cada um, sem parede própria…" | O canalículo é a luz delimitada pelos dois sulcos, não um sulco. | Treyer e Müsch 2013 ("a narrow lumen between two adjacent hepatocytes") |
| menor | estrutura `sinusoide-hepatico` | (sem dizer como aparece) | "+ No modelo, os tubos vermelhos translúcidos entre as placas, sem o endotélio." | Única estrutura do parênquima sem indicação de como é vista. | `grupo-b.tsx` |
| **menor (2ª etapa)** | `contexto[7]` (antes 6) | "sangue dos sinusoides em vermelho," | "sangue dos sinusoides em vermelho (a cor não indica sangue arterial: o sangue dos sinusoides é misto, em maior parte portal)," | Vermelho ao lado do vermelho-escuro da artéria. | Eipel 2010 (75–80% portal) |

### Sarcômero

| gravidade | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| importante | `contexto[1]`; estrutura `filamento-fino` | "…filamento fino de cerca de 1,0 µm. Os valores variam entre fontes, espécies e músculos."; "mede cerca de 1,0 µm" | "…O filamento grosso tem quase o mesmo comprimento em todos os vertebrados; o fino varia com a espécie e com o músculo: 1,0 µm é próximo do valor clássico do músculo de rã, e nos músculos humanos medidos ele tem cerca de 1,2 a 1,4 µm. Por isso, no músculo humano, a banda H é mais estreita que a do esquema para o mesmo comprimento de sarcômero. Os números da legenda do controle são os do esquema, e não medidas de um músculo humano."; "no esquema, mede 1,0 µm (nos músculos humanos medidos, cerca de 1,2 a 1,4 µm)" | Modelo "de mamífero" com filamento fino de rã e legenda de duas casas decimais. | Gokhin 2012; Gokhin e Fowler 2013; Lieber 1994 (resumo) |
| importante | `contexto[4]` | "…as linhas Z e M aparecem como discos." | "+ Os filamentos finos dos sarcômeros vizinhos aparecem em linha com os do sarcômero central, como se atravessassem o disco; na linha Z real, os filamentos dos dois lados terminam, intercalam-se e são unidos pela α-actinina." | Aviso para o P2-2. | Luther 2009; Squire 2016 |
| menor | `contexto[3]` | "As cabeças não se movem quando o controle de contração é usado." | "+ Elas também não aparecem ligadas aos filamentos finos: as pontes cruzadas não estão desenhadas." | Aviso para o P3-3. | `geometria-sarcomero.ts` |
| menor | `contexto[7]` | "abaixo de cerca de 2,0 µm, os filamentos finos dos dois lados se sobrepõem no centro" | "com os comprimentos do esquema, abaixo de cerca de 2,0 µm (duas vezes o filamento fino) os filamentos finos dos dois lados se sobreporiam no centro" | O limiar depende do comprimento do filamento fino; 2,0 µm vale para o esquema. | Gokhin e Fowler 2013 |
| menor | estrutura `sarcomero` | "(cerca de 2,5 µm em repouso)" | "(cerca de 2,5 µm em repouso nos livros-texto; o valor varia com o músculo e com o grau de estiramento)" | His-09 registra Junqueira ~2,5 e Ross 2–3; a literatura lida dá de 2,2 a mais de 3 µm. | Squire 2016; Lieber 1994 (resumo) |
| menor | estrutura `filamento-fino` | "Dupla hélice de actina F, com tropomiosina…" | "Actina F (dois cordões de monômeros de actina G enrolados em dupla hélice), com tropomiosina…" | A actina F já é o filamento em dupla hélice; "dupla hélice de actina F" sugere dois filamentos. | Luther e Squire 2014 ("two twisting strings of beads") |
| **menor (2ª etapa)** | estrutura `filamento-fino` | "…troponina (não desenhadas)… Na contração, desliza…" | "+ O Ca²⁺ liberado pelo retículo sarcoplasmático liga-se à troponina C, e a tropomiosina se desloca e expõe na actina os sítios de ligação da miosina." | O modelo tem controle de contração e citava troponina e Ca²⁺ sem dizer o que fazem. | his-09; Bolaños e Calderón 2022 |

### Junções celulares

| gravidade | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| importante | `destaques[3]` (1ª frase); estrutura `hemidesmossomo` | "Hemidesmossomo: integrina α6β4 e BP180 (colágeno XVII) prendem a célula à lâmina basal, e a placa (BP230, plectina) recebe filamentos de queratina." | "Hemidesmossomo: a integrina α6β4 prende a célula à lâmina basal, e a plectina, na placa, recebe filamentos de queratina. Nos epitélios estratificados e pseudoestratificados, como a epiderme, o hemidesmossomo tem também BP180 (colágeno XVII) e BP230; nos epitélios simples, como o do intestino, só integrina α6β4 e plectina."; estrutura no mesmo sentido, com "como o do esquema" e "No esquema, os discos alaranjados da base, com os filamentos de ancoragem." | O modelo é de epitélio simples cilíndrico com microvilosidades; a composição dada era a do hemidesmossomo tipo I, da epiderme. | Walko 2015 (integral); Fontao 1999 (resumo) |
| importante | `contexto[3]`; estrutura `zonula-de-adesao` | (sem aviso) | "A zônula de adesão aparece como faixa azul translúcida que preenche o espaço entre as células: a faixa representa as caderinas, e nessa junção o espaço intercelular não é obliterado."; estrutura: "+ o espaço intercelular é mantido." | Aviso para o P2-1. | Farquhar e Palade 1963 (resumo) |
| menor | `contexto[2]`; estrutura `juncao-comunicante` | (sem dizer o que é cada bastão) | "Na junção comunicante, cada bastão rosa representa um par de conexons, um de cada célula; ali as membranas se aproximam até cerca de 2 nm, estreitamento que o esquema não mostra."; estrutura: "+ No esquema, cada bastão rosa é um par de conexons." | O texto fala em "par de conexons" e o desenho mostra um bastão inteiro; a fenda não se estreita (P3-3). | Goodenough e Paul 2009 |
| menor | `contexto[5]` | "…e que o Ross registra poder ser artefato de fixação." | "…e que pode ser artefato do preparo convencional para microscopia eletrônica: não aparece em tecido congelado rapidamente (o Ross registra essa possibilidade)." | A fonte primária atribui o artefato à desidratação, não à fixação. | Chan e Inoue 1994 (resumo) |
| menor | `contexto` (item novo, índice 6) | (sem aviso) | "Os filamentos de queratina aparecem como poucas alças presas às placas dos desmossomos e como fios que vão dos hemidesmossomos aos desmossomos; na célula, formam uma rede por todo o citoplasma." | Simplificação declarada pelo desenhista, sem aviso. | Walko 2015; Delva 2009 |
| menor | `contexto[7]` (antes 6) | "células translúcidas, zônula de oclusão…" | "células translúcidas, microvilosidades em laranja-claro, zônula de oclusão… + A cor parecida das microvilosidades e dos hemidesmossomos não indica relação entre eles." | Cor das microvilosidades fora da lista; dois laranjas quase iguais (P3-2). | `grupo-b.tsx` |
| menor | estrutura `desmossomo` | — | "+ Nos epitélios simples, predominam a desmogleína 2 e a desmocolina 2; as desmogleínas 1 e 3, alvos dos pênfigos, são expressas sobretudo nos epitélios estratificados." | Liga o desmossomo desenhado (epitélio simples) à correlação clínica sem sugerir que o pênfigo o atinge. | Delva 2009 |
| **importante (2ª etapa)** | `destaques[3]` (2ª frase) | "Autoanticorpos contra desmogleínas causam o pênfigo; contra componentes do hemidesmossomo, o penfigoide bolhoso." | "As doenças bolhosas autoimunes atingem a pele e as mucosas de epitélio estratificado: autoanticorpos contra as desmogleínas 1 e 3 dos desmossomos causam os pênfigos (bolha dentro do epitélio); contra BP180 e BP230 dos hemidesmossomos, o penfigoide bolhoso (bolha sob a epiderme)." | Sem a ressalva, o aluno aplica as doenças às junções do epitélio simples desenhado; alvos nomeados como em his-02. | Porro 2019 e Santi 2019 (consensos da SBD, integral); his-02 |
| **menor (2ª etapa)** | estrutura `zonula-de-oclusao` | "veda a via paracelular e separa os domínios apical e basolateral." | "veda a via paracelular, com permeabilidade seletiva a íons e solutos que depende das claudinas de cada epitélio, e separa os domínios apical e basolateral." | "Veda" sem ressalva contradiz a fisiologia dos epitélios permeáveis. | Günzel e Yu 2013; Hartsock e Nelson 2008 |

## 4. Desenhos: lista P1/P2/P3 (propostas, não implementadas)

Medidas tiradas do código da geometria (unidades de cena). Os testes de `tests/geometria-histologia-b.test.ts` precisarão acompanhar as mudanças.

### Lóbulo hepático

**P1:** nenhum.

**P2**

1. **Sinusoides em funil, mais estreitos junto da veia centrolobular.** `raioDisse()`, `trecho()`, `abrirTrecho()` e `construirSinusoides()` em `geometria-lobulo.ts`; `geometriaTrechos()`. O raio é o maior círculo que cabe entre duas placas radiais, então cresce com a distância ao centro e recomeça a cada bifurcação. No eixo de um vértice: zona A de 0,202 a 0,353 (luz 0,035 → 0,122), zona B de 0,353 a 0,738 (0,019 → 0,122), zona C de 0,738 a 1,282 (0,023 → 0,094). **Fazer:** calibre aproximadamente constante (luz ≈ 0,04 a 0,05). Onde o vão entre placas alarga, pôr dois tubos, um junto de cada placa, unidos por duas ou três pontes curtas (o que também mostra a rede), em vez de um cone; na zona A, um tronco único, o mais largo, até a veia. Teste afetado: "sinusoides entre duas placas, sem atravessar hepatócitos, da periferia até a veia centrolobular".
2. **Sangue e bile sem caminho desenhado.** `geometriaTuboOco()` e `<Parte id="veia-centrolobular">` (parede sem aberturas; os troncos da zona A encostam nela em r = 0,202); `construirSinusoides()` (os trechos acabam no hexágono ou no conjuntivo do espaço porta, sem vaso de entrada); `construirCanaliculos()` (acabam em `fim − 0.01`, sem ligação com `ducto`). **Fazer:** (a) seis orifícios na parede da veia, nos eixos dos vértices; (b) em cada espaço porta, um raminho violeta e um vermelho ao longo das duas arestas vizinhas do hexágono, com entradas curtas nos sinusoides da zona C, dentro das partes `ramo-da-veia-porta` e `ramo-da-arteria-hepatica` (sem id novo); (c) no espaço porta da frente, um trecho verde curto da ponta de uma placa ao ducto (canal de Hering), dentro de `canaliculo-biliar`; (d) se o núcleo aceitar marcas não tocáveis, duas setas: sangue para o centro, bile para a periferia.
3. **Canalículos como canos salientes sobre as faces de corte.** `alturasCanaliculos()`, `construirCanaliculos()`, `geometriaCanaliculos()`; `LOBULO.raioCanaliculo` 0,018, com o eixo em y = ±0,146 (a própria face). Na vista padrão, é o que mais aparece: uma faixa verde sobre cada placa. **Fazer:** uma das duas: (a) cobrir um setor de 60° com uma terceira camada de hepatócitos, translúcida, para o canalículo aparecer entre duas células; (b) afundar o tubo (eixo em |y| = meia − raio) e reduzir o raio para cerca de 0,012, de modo que pareça um sulco.

**P3**

4. **Espaço de Disse como manga de meia extensão, sem endotélio.** `mangasDisse()`, `COBERTURA_DISSE` 0,5. Opcional: casca em todo o comprimento com uma janela, e uma película fina de endotélio num trecho.
5. **Vermelho do sinusoide ao lado do vermelho-escuro da artéria.** `COR_LOBULO.sinusoide` '#d9534f' × `arteria` '#c8243f'. Opcional: tom intermediário entre o violeta da porta e o vermelho (magenta escuro), para o sangue misto.
6. **Moldura em barras sólidas, de cor próxima à dos vasos.** `geometriaMoldura()`; `COR_LOBULO.moldura` '#a9bcff'. Opcional: tracejada (segmentos curtos) e em cinza neutro.
7. **Pontas dos canalículos afloram nas extremidades das placas.** `construirCanaliculos()` recua 0,01 da ponta da placa; o chanfro do hepatócito (`geometriaHepatocito()`, `c = 0.022`) é maior, e o tubo aparece na face de extremidade, voltada para o sinusoide ou para a veia. Fazer: na ponta central da placa, recuar 0,035; na ponta periférica, ligar ao ducto (P2-2c) ou recuar também.
8. **Hepatócitos sem núcleo.** `geometriaHepatocito()`. Opcional: um núcleo esférico por célula e duas ou três células binucleadas.
9. **Seis tríades idênticas e sem placa limitante.** `triades()`. Opcional: variar a posição dos três elementos entre os ângulos.
10. **Leitura no celular.** Na vista padrão de 390×844, a casca de Disse e as células de Kupffer quase não se distinguem (`lobulo-hepatico-390x844-baixa.png`); dependem do zoom.

### Sarcômero

**P1:** nenhum.

**P2**

1. **Legenda numérica do controle sem indicação de que são valores do esquema.** `ControleContracao` em `grupo-b.tsx` (`el.legenda.textContent = …`, `virgula()`), com `SARCOMERO.fino` 1,0, `repouso` 2,5 e `contraido` 2,1 em `geometria-sarcomero.ts`. A conta está certa; os números são os do músculo de rã, com duas casas decimais, num modelo "de mamífero". **Fazer:** prefixar "Esquema:" e usar "≈" (por exemplo, "Esquema: sarcômero ≈ 2,50 µm · A ≈ 1,60 µm (constante) · I ≈ 0,90 µm · H ≈ 0,50 µm"). A troca das constantes por valores humanos é decisão do revisor humano (P3-7 e §6, ponto 4).
2. **Filamentos finos dos sarcômeros vizinhos em linha com os do sarcômero central.** Em `ModeloSarcomero`, as duas malhas `vizinhos` usam `rede.finos` (12 posições simétricas em z), giradas 180° em y: caem nas mesmas posições (y, z) dos filamentos do outro lado do disco. Na vista oblíqua, os filamentos parecem atravessar a linha Z. **Fazer:** girar 30° em torno do eixo x as posições dos filamentos dos vizinhos (ficam entre as do sarcômero central), o que sugere a intercalação na linha Z.

**P3**

3. **Cabeças de miosina fixas e sem contato com os finos.** `cabecasMiosina()` (ângulo = coroa × 40° + 120° × c, sem relação com as posições de `redeFilamentos().finos`) e `geometriaCabecas()` (inclinação fixa de 40°). Opcional: na zona de sobreposição, apontar cada cabeça para o filamento fino mais próximo; variar a inclinação com o controle.
4. **Retículo e túbulo T como anéis soltos.** `geometriaReticulo()` (quatro toros e seis cilindros) e `tuboT`. As cisternas do lado da banda I ficam isoladas, e o túbulo T é um anel fechado, sem ligação com o sarcolema. Opcional: malha fina sobre a banda I entre as cisternas de sarcômeros vizinhos e um toco radial em cada túbulo T.
5. **Linha M como disco maciço; zona nua sem marca.** `discoM` (raio 0,42) e `SARCOMERO.zonaNua` (0,18 µm). Opcional: disco M mais translúcido, ou pontes curtas entre os filamentos grossos.
6. **Uma titina por meio filamento.** `geometriaMolasTitina()` e `geometriaTitinaBandaA()`. Opcional: duas ou três por meio filamento.
7. **Constantes com valores humanos.** Se o revisor humano preferir, `fino` ≈ 1,3 e `repouso` ≈ 2,7 a 2,8; a faixa de contração sem sobreposição dos finos fica curta (até 2 × fino), e o modelo teria de mostrar a sobreposição.

### Junções celulares

**P1:** nenhum.

**P2**

1. **Zônula de adesão com a mesma geometria da zônula de oclusão.** `geometriaFaixa()` serve às duas (`oclusao` e `adesao` em `ModeloJuncoes`): faixa que vai de 0,016 por dentro da membrana até o meio da fenda, onde encontra a da célula vizinha. Só a opacidade muda (0,3). O aluno vê duas faixas que fecham o espaço intercelular. **Fazer:** geometria própria para a adesão: uma lâmina fina na face citoplasmática da membrana e bastonetes curtos (caderinas) cruzando a fenda, com o vão à mostra. Teste afetado: "zônulas circundam cada célula e se encontram no meio da fenda".

**P3**

2. **Microvilosidades e hemidesmossomos em laranjas quase iguais.** `COR_JUNCOES.microvilos` '#f4a259' × `hemidesmossomo` '#f59e0b'. Fazer: microvilosidades no tom da célula, mais escuro, ou outro matiz no hemidesmossomo.
3. **Junção comunicante sem estreitamento e com bastões maciços.** `conexons()` (13 bastões), `geometriaConexons()` (um cilindro de `COMPRIMENTO_CONEXON` = 0,11 por canal) e `JUNCOES.fenda` constante. Fazer: aproximar as duas membranas na área da placa (ressalto de cada célula) e desenhar cada canal em duas metades, com um furo axial.
4. **Queratina só em alças e fios.** `trajetosQueratina()`: duas alças por placa de desmossomo e quatro fios a partir dos hemidesmossomos. Opcional: alguns filamentos de uma placa a outra, contornando o núcleo.
5. **Desmossomo de uma cor só.** `geometriaDesmossomos()` mescla as placas e o núcleo extracelular. Opcional: núcleo extracelular mais fino, com uma lâmina central, para sugerir as caderinas e a linha densa.
6. **Microvilosidades maciças.** `geometriaMicrovilosidades()`. Opcional: uma microvilosidade cortada, com o eixo em vermelho (cor da actina) descendo até a altura do cinturão.
7. **Lâmina basal como placa única.** `geometriaLamina()`. Opcional: fibras reticulares sob a placa (lâmina reticular), para o par lâmina basal × membrana basal de his-02.

## 5. Fisiologia e patologia (2ª etapa)

Cada afirmação funcional dos três modelos, conferida contra a literatura lida e contra his-02, his-09 e his-15.

| Afirmação do texto | Resultado | Fonte lida |
|---|---|---|
| Sangue misto, portal e arterial, vai dos espaços porta para a veia centrolobular | confirmado; aviso de cor acrescentado | Eipel 2010; Abdel-Misih e Bloomston 2010; Choi e Enomoto 2025 |
| Ramo portal traz sangue do tubo digestivo, do baço e do pâncreas, pobre em oxigênio | confirmado ("partially deoxygenated"; inclui a vesícula) | Eipel 2010 |
| Bile corre dos canalículos para o ducto do espaço porta, em sentido oposto ao do sangue | confirmado | Boyer 2013 ("countercurrent to the direction of portal blood flow") |
| Canalículo vedado por zônulas de oclusão; canais de Hering | confirmado | Boyer 2013; Treyer e Müsch 2013; Strazzabosco e Fabris 2008 |
| Zona 3 menos oxigenada e mais vulnerável à hipóxia e ao paracetamol | confirmado | Kietzmann 2017 (60–65 → 30–35 mmHg); Yoon 2016; his-15 (correlações de necrose centrolobular e de hepatite isquêmica) |
| Linfa hepática forma-se no espaço de Disse | confirmado | Tanaka e Iwakiri 2016 |
| Célula de Kupffer fagocita partículas vindas pela porta | confirmado | Dixon 2013 |
| Artéria hepática irriga os ductos biliares | confirmado (plexo peribiliar) | Strazzabosco e Fabris 2008 |
| Filamentos deslizam sem encurtar; banda A constante; I e H encurtam | confirmado | Squire 2016 |
| Cabeças de miosina formam pontes cruzadas e hidrolisam ATP | confirmado (texto de his-09) | Squire 2016 |
| Titina: elástica na banda I, presa ao grosso na banda A, mantém o filamento grosso centrado | confirmado | Tskhovrebova e Trinick 2010; Horowits e Podolsky 1987 (resumo) |
| Túbulo T leva o potencial de ação; tríade na junção A-I; díade na linha Z no cardíaco | confirmado | Al-Qusairi e Laporte 2011; Setterberg 2021 |
| Retículo armazena Ca²⁺, libera pelo receptor de rianodina e recaptura pela SERCA | confirmado | Al-Qusairi e Laporte 2011; Bolaños e Calderón 2022 |
| Ca²⁺ e troponina C | **acrescentado** (1 frase) | Bolaños e Calderón 2022; his-09 |
| Zônula de oclusão veda a via paracelular e separa os domínios | **ajustado** (permeabilidade seletiva); "separa os domínios" mantido, ver §6, ponto 9 | Günzel e Yu 2013; Hartsock e Nelson 2008 |
| Zônula de adesão: E-caderina ligada por cateninas ao cinturão de actina | confirmado | Hartsock e Nelson 2008; Meng e Takeichi 2009 |
| Desmossomo dá resistência mecânica | confirmado | Delva 2009 |
| Junção comunicante passa íons e pequenas moléculas | confirmado | Goodenough e Paul 2009 |
| Pênfigo (desmogleínas) e penfigoide bolhoso (BP180/BP230) | **corrigido** (epitélio estratificado; desmogleínas 1 e 3) | Porro 2019; Santi 2019; Delva 2009; his-02 (pênfigo vulgar, penfigoide bolhoso, fogo selvagem na camada avançada) |

O texto dos três modelos **não traz** número clínico, dose, limiar nem prevalência. Os números que ficaram são morfométricos e têm fonte lida: comprimentos de filamentos (Gokhin 2012; Lieber 1994) e o estreitamento de cerca de 2 nm na junção comunicante (Goodenough e Paul 2009). Coerência com as correlações clínicas dos tópicos: necrose centrolobular, hepatite isquêmica, colestase e cirrose (his-15), distrofia de Duchenne e miastenia (his-09), pênfigo vulgar e penfigoide bolhoso (his-02) não contradizem nada do que os modelos mostram.

## 6. Pontos para o revisor humano

1. **Redesenho do lóbulo (P2-1 a P2-3).** Os avisos novos dizem ao aluno o que o esquema não mostra, mas o destaque principal (fluxos opostos) continua sem apoio no desenho. Decida se o modelo vai ao ar com os avisos ou depois das ligações (orifícios na veia, ramos terminais, canal de Hering).
2. **Calibre dos sinusoides.** "Centrolobulares mais largos e retos que os periportais" vem de dois **resumos**, ambos de rato (Wisse 1983; McCuskey 2003). Não achei fonte aberta para o fígado humano. O aviso diz "no rato". Conferir em Ross.
3. **"Prisma mais alto que largo".** É a descrição dos livros (não lidos). Teutsch (2005, só o resumo) reconstruiu unidades poliédricas de 7 a 9 faces e 0,3 a 0,9 mm de altura no fígado humano. O aviso cita as duas coisas.
4. **Comprimentos do sarcômero.** Mantive os números de livro (2,5 · 1,6 · 1,0 µm, que o código atribui a Junqueira 14ª ed., não lido) com ressalva. O filamento fino humano "de cerca de 1,2 a 1,4 µm" vem de Gokhin (2012, integral: 1,19 a 1,37 µm em deltoide e peitoral maior) e de Lieber (1994, resumo: 1,30 µm). Walker e Schrodt (1974) não têm resumo no PubMed e não foram lidos. O comprimento ótimo do sarcômero humano (2,80 µm em Lieber 1994; 2,38–2,58 a 2,74–2,94 µm previstos em Gokhin 2012) **não** foi posto no texto. Decida: (a) manter; (b) trocar as constantes por valores humanos (P3-7), com outra faixa de contração.
5. **Repouso de 2,5 µm.** Junqueira ~2,5 e Ross 2–3 (his-09, de memória); Squire (2016) dá 2,2 a 2,3 µm; Lieber (1994) mediu de 2,6 a 3,4 µm num músculo humano conforme a posição do punho. O texto passou a dizer "nos livros-texto; o valor varia".
6. **"Banda H" × "zona H".** Mantido "Banda H", como his-09. A literatura em inglês usa "H-zone", e livros de fisiologia traduzidos costumam usar "zona H" (não conferi nenhum). Se quiser, acrescente o sinônimo em his-09 e no nome exibido.
7. **Hemidesmossomo do epitélio simples.** Walko (2015, integral) distingue o tipo I (epitélios estratificados e pseudoestratificados: integrina α6β4, plectina, CD151, BP180 e BP230) do tipo II (epitélios simples, como o intestino: só integrina α6β4 e plectina). His-02 dá a composição do tipo I como geral, o que vale para a epiderme. Não alterei his-02; talvez mereça uma nota de divergência.
8. **Desmogleína 2 nos epitélios simples.** "Predominam a desmogleína 2 e a desmocolina 2" é leitura de Delva (2009): "Dsg2 and Dsc2 are expressed widely and in all desmosome bearing tissues, whereas the other desmosomal cadherins are predominantly expressed in stratifying epithelia". Se preferir só o texto de livro, apague a última frase da estrutura `desmossomo`.
9. **Função de cerca da zônula de oclusão.** O texto (como his-02 e os livros) diz que ela separa os domínios apical e basolateral. Günzel e Yu (2013) registram "increasing experimental evidence that tight junctions and claudins are not required for fence function". Mantive a frase de livro.
10. **Lâmina lúcida.** His-02 diz "artefato de fixação" e atribui a Ross (não lido). Chan e Inoue (1994, só o resumo) concluem que o artefato se forma na desidratação convencional, e não na fixação química. No modelo ficou "artefato do preparo convencional"; his-02 não foi alterado.
11. **Célula de Kupffer "presa ao endotélio" e "pobre em oxigênio".** Redações de livro, iguais às de his-15. Dixon (2013) diz "reside within the sinusoid"; Eipel (2010), "partially deoxygenated". Não mudei.
12. **Zônula de adesão no desenho (P2-1).** Escolha entre redesenhar com caderinas visíveis ou manter a faixa translúcida com o aviso novo.
13. **Fora deste arquivo, não alterado:** his-02 (pontos 7 e 10); his-15 usa "sulco" para o canalículo biliar (no modelo ficou "canal estreito… formado por um sulco na face de contato de cada um").
14. **Commit.** Não fiz commit. Durante a revisão, a sessão que coordena o trabalho gravou um retrato do branch `aprofundamento-histologia` (3fb1f4b, "retrato das revisões do 3D e do toque com corte") que já inclui o JSON revisado; este relatório ainda não está em nenhum commit.

## 7. Evidência

```
$ python3 aplicar.py content/histologia/modelos3d-b.json modelos3d-b.ANTES.json   # script da revisão, fora do repositório
trocas aplicadas: 30; entradas de revisão acrescentadas: 6
ids/ordem/títulos/tópicos/descrição geral/lista e nomes de estruturas iguais ao arquivo de antes; revisao.humano = null

$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 Test Files  17 passed (17)
      Tests  178 passed (178)

$ git diff --no-index --stat modelos3d-b.ANTES.json content/histologia/modelos3d-b.json
 1 file changed, 75 insertions(+), 28 deletions(-)
```

A cópia de antes (`modelos3d-b.ANTES.json`) é idêntica à versão do commit b4df539. Medidas do §2 e do §4 tiradas com um script que importa a geometria só para leitura:

```
LOBULO placas: 42 por zona [ 6, 12, 24 ] células/placa [ '2', '4', '4' ]
eixo do vértice 0: A 0.202→0.353 luz 0.035→0.122 | B 0.353→0.738 luz 0.019→0.122 | C 0.738→1.282 luz 0.023→0.094
kupffer: 31 canalículos (segmentos): 240 raio canalículo 0.018 espessura da placa 0.1
tríade: veia 0.1 0.088 artéria 0.042 0.018 ducto 0.048 0.026
SARCOMERO repouso: sarcomero 2.5, larguraA 1.6, larguraI 0.9, larguraH 0.5 · contraído: 2.1, 1.6, 0.5, 0.1
rede: grossos 7 finos 12 raios dos finos 0.173/0.346 cabeças por filamento 42
JUNCOES: conexons 13 placas de desmossomo 6 hemidesmossomos 4 microvilosidades 60 fenda 0.07 oclusão [0.845, 0.945] adesão [0.66, 0.79] desmossomos y [0.53, -0.06, -0.5] comunicante y 0.22
```

Scripts e textos baixados ficaram em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-h3d-b/`, fora do repositório.

## 8. Fontes conferidas

Acesso em 2026-11-10, por curl. "Integral" = corpo do artigo lido (XML do Europe PMC ou página do PMC; "manuscrito" = manuscrito do autor no PMC); "resumo" = só o resumo do PubMed (E-utilities).

### Fígado

| Fonte | Identificação | Leitura | Trecho decisivo |
|---|---|---|---|
| Treyer A, Müsch A. Compr Physiol 2013 | PMID 23720287 · [PMC3697931](https://pmc.ncbi.nlm.nih.gov/articles/PMC3697931/) | integral (manuscrito) | "the apical, or, canalicular domain, which makes up a narrow lumen between two adjacent hepatocytes"; "Each hepatocyte participates in multiple, narrow lumina, the bile canaliculi, and has multiple basal surfaces that face the endothelial lining"; "bile canaliculi… organized in one or two-cell-thick cords. The bile canaliculi connect to the bile ducts located in the portal triad" |
| Boyer JL. Compr Physiol 2013 | PMID 23897680 · [PMC4091928](https://pmc.ncbi.nlm.nih.gov/articles/PMC4091928/) | integral (manuscrito) | "a canalicular network which is formed by the apical membrane of adjacent hepatocytes and sealed by tight junctions. The bile canaliculi (~1 μm in diameter) conduct the flow of bile countercurrent to the direction of portal blood flow and connect with the canal of Hering and bile ducts" |
| Eipel C, Abshagen K, Vollmar B. World J Gastroenterol 2010 | PMID 21182219 · [PMC3012579](https://pmc.ncbi.nlm.nih.gov/articles/PMC3012579/) | integral | "75%-80% of the blood entering the liver is partially deoxygenated venous blood supplied by the portal vein, which collects all the blood that leaves the spleen, stomach, small and large intestine, gallbladder and pancreas. The hepatic artery accounts for the remaining 25% with well-oxygenated blood" |
| Abdel-Misih SR, Bloomston M. Surg Clin North Am 2010 | PMID 20637938 · [PMC4038911](https://pmc.ncbi.nlm.nih.gov/articles/PMC4038911/) | integral (manuscrito) | "The arterial and portal blood ultimately mixes within the hepatic sinusoids" |
| Braet F, Wisse E. Comp Hepatol 2002 | PMID 12437787 · [PMC131011](https://pmc.ncbi.nlm.nih.gov/articles/PMC131011/) | integral | "open pores or fenestrae lacking a diaphragm and a basal lamina underneath the endothelium"; "The space of Disse (SD) contains numerous microvilli of the parenchymal cells" |
| Wisse E et al. Scan Electron Microsc 1983;(Pt 3):1441 | PMID 6648350 | resumo (rato) | "Sinusoids in periportal areas are narrower and more tortuous than the wider and straighter central ones"; "Portal veins show few sinusoidal inlets"; "Central veins… show numerous sinusoidal outlets (direct sinusoidal connections)" |
| McCuskey RS et al. Anat Rec A 2003;275:1019 | PMID 14533176 | resumo (rato) | "Widened centrilobular radial sinusoids form… the associated cell plates straighten and become one cell thick… the periportal zone, which retains thickened cell plates and anastomotic sinusoids" |
| Choi, Enomoto. Int J Mol Sci 2025 | PMID 40869049 · [PMC12387026](https://pmc.ncbi.nlm.nih.gov/articles/PMC12387026/) | integral | "Hepatocytes form one-cell-thick plates radiating from portal tracts to central veins, separated by sinusoids conveying mixed portal and arterial blood"; "Pediatric livers commonly display two-cell-thick hepatic plates"; lóbulo "hexagonal with a central vein at its core and portal tracts at the vertices" |
| Kietzmann T. Redox Biol 2017 | PMID 28126520 · [PMC5257182](https://pmc.ncbi.nlm.nih.gov/articles/PMC5257182/) | integral | "about 60–65 mm Hg… in the periportal blood to about 30–35 mm Hg… in the perivenous blood"; "In the cords the hepatocyte membranes… face blood channels called sinusoids at either side"; "Resident macrophages, the Kupffer cells (KC) are also to be found in the sinusoid" |
| Yoon E et al. J Clin Transl Hepatol 2016 | PMID 27350943 · [PMC4913076](https://pmc.ncbi.nlm.nih.gov/articles/PMC4913076/) | integral | "zone 3 of the liver… where APAP is known to case the greatest extent of liver injury" |
| Tanaka M, Iwakiri Y. Cell Mol Gastroenterol Hepatol 2016 | PMID 28105461 · [PMC5240041](https://pmc.ncbi.nlm.nih.gov/articles/PMC5240041/) | integral | "Hepatic lymphatic fluid is thought to originate from plasma components filtered through the fenestrae of LSECs into the space of Disse" |
| Dixon LJ et al. Compr Physiol 2013 | PMID 23720329 · [PMC4748178](https://pmc.ncbi.nlm.nih.gov/articles/PMC4748178/) | integral (manuscrito) | "Kupffer cells… reside within the sinusoid"; "their localization in the hepatic sinusoid allows them to efficiently phagocytize pathogens entering from the portal or arterial circulation" |
| Strazzabosco M, Fabris L. Anat Rec 2008 | PMID 18484611 · [PMC3743051](https://pmc.ncbi.nlm.nih.gov/articles/PMC3743051/) | integral (manuscrito) | "peribiliary vascular plexus… originate from the terminal branches of the hepatic artery"; "The canal of Hering is a channel… lined in part by hepatocytes and in part by cholangiocytes" |
| Albadry M et al. Front Pharmacol 2024 | PMID 38818378 · [PMC11137285](https://pmc.ncbi.nlm.nih.gov/articles/PMC11137285/) | integral | "Pigs have interlobular septa, but humans, rats, and mice lack this structure" |
| Lau C et al. Sci Rep 2021 | PMID 33927276 · [PMC8085188](https://pmc.ncbi.nlm.nih.gov/articles/PMC8085188/) | integral | "In humans, since the boundaries of the classic hepatic lobules are not histologically demarcated"; "liver lobules of variable sizes and shapes—commonly but not always roughly hexagonal—with a non-uniform number of portal tracts surrounding each central vein" |
| Teutsch HF. Hepatology 2005;42:317 | PMID 15965926 | resumo | "Primary modules were polyhedral, with seven to nine facets, having heights from 0.3 to 0.9 mm… Such variation in shape and size" |

### Sarcômero

| Fonte | Identificação | Leitura | Trecho decisivo |
|---|---|---|---|
| Gokhin DS et al. Am J Physiol Cell Physiol 2012 | PMID 22075691 · [PMC3287155](https://pmc.ncbi.nlm.nih.gov/articles/PMC3287155/) | integral | "thick-filament lengths are essentially constant across muscles and species (∼1.65 μm), thin-filament lengths are highly variable"; "Using deltoid and pectoralis major muscle biopsies, we identified thin-filament lengths that ranged from 1.19 ± 0.08 to 1.37 ± 0.04 μm" |
| Gokhin DS, Fowler VM. Nat Rev Mol Cell Biol 2013 | PMID 23299957 · [PMC3711620](https://pmc.ncbi.nlm.nih.gov/articles/PMC3711620/) | integral (manuscrito) | "The frog sartorius and human pectoralis major have thin filament lengths of ~0.94 and ~1.37 µm, respectively, but identical thick filament lengths of 1.65 µm" |
| Lieber RL, Loren GJ, Fridén J. J Neurophysiol 1994;71:874 | PMID 8201427 | resumo | "Thin filament lengths… were 1.30 ± .027 (SE) microns whereas thick filaments were 1.66 ± .027 microns long, suggesting an optimal sarcomere length of 2.80 microns"; "ECRB sarcomere length increased from 2.6 to 3.4 microns" |
| Gordon AM, Huxley AF, Julian FJ. J Physiol 1966;184:170 | PMID 5921536 | resumo (rã) | "a plateau between sarcomere lengths of 2.05 and 2.2 μ" |
| Squire JM. Glob Cardiol Sci Pract 2016 | PMID 29043260 · [PMC5642817](https://pmc.ncbi.nlm.nih.gov/articles/PMC5642817/) | integral | "the length of the A-band remained virtually constant. At the same time the edges of the H-zone appeared to move with the Z-band"; "the square lattice of actin filaments in the I-band… the hexagonal lattice… in the A-band"; "a heads-free bare zone region at the centre of the filament"; "sarcomeres are often around 2.2 to 2.3 µm long at rest length"; titina "extends from the Z-line through the I-band to connect to the myosin filaments where several titin strands (probably six per half myosin filament)" |
| Luther PK, Squire JM. Biology (Basel) 2014 | PMID 25478994 · [PMC4280514](https://pmc.ncbi.nlm.nih.gov/articles/PMC4280514/) | integral | "actin filaments at the so-called trigonal positions in the hexagonal myosin filament array, such that one actin filament was surrounded by three myosin filaments"; "strong axial repeats of 14.3 nm and 42.9 nm"; filamentos de actina "like two twisting strings of beads" |
| Luther PK. J Muscle Res Cell Motil 2009 | PMID 19830582 · [PMC2799012](https://pmc.ncbi.nlm.nih.gov/articles/PMC2799012/) | integral | "At the Z-disc the barbed ends of the antiparallel actin filaments from adjoining sarcomeres interdigitate and are crosslinked primarily by layers of α-actinin"; "titin runs between the M-line and the Z-disc" |
| Tskhovrebova L, Trinick J. J Biomed Biotechnol 2010 | PMID 20625501 · [PMC2896707](https://pmc.ncbi.nlm.nih.gov/articles/PMC2896707/) | integral | "in situ spans half the sarcomere, with the N-terminus in the Z-line and the C-terminus in the M-line"; "the elastic I-band part of the molecule, which connects the end of the thick filament to the Z-line"; "six molecules bound to each half of thick filament" |
| Horowits R, Podolsky RJ. J Cell Biol 1987;105:2217 | PMID 3680378 | resumo | "the elastic titin filaments, which join thick filaments to Z-discs… act to resist the movement of thick filaments away from the center of the sarcomere during contraction" |
| Al-Qusairi L, Laporte J. Skelet Muscle 2011 | PMID 21797990 · [PMC3156648](https://pmc.ncbi.nlm.nih.gov/articles/PMC3156648/) | integral | "The close association of one T-tubule with two terminal cisternae on both sides of the tubule forms the triad"; "associated with the edges of A bands (A-I junctions)… forming triad rows at each side of the Z-line"; RyR1 "on the junctional face of SR"; SERCA |
| Setterberg IE et al. Front Physiol 2021 | PMID 34566684 · [PMC8458775](https://pmc.ncbi.nlm.nih.gov/articles/PMC8458775/) | integral | túbulos T do cardiomiócito "in a well-organized network along the Z-lines"; "specialized junctions called dyads, where LTCCs and RyRs are in close proximity" |
| Bolaños P, Calderón JC. Front Physiol 2022 | PMID 36117698 · [PMC9478590](https://pmc.ncbi.nlm.nih.gov/articles/PMC9478590/) | integral | Ca²⁺ "binds to troponin C thus activating the contractile machinery"; "a TT is surrounded by two radially dilated portions of the SR, called 'terminal cisternae'" |

### Junções celulares

| Fonte | Identificação | Leitura | Trecho decisivo |
|---|---|---|---|
| Farquhar MG, Palade GE. J Cell Biol 1963;17:375 | PMID 13944428 · [PMC2106201](https://pmc.ncbi.nlm.nih.gov/articles/PMC2106201/) | resumo (o corpo é PDF digitalizado) | "zonula occludens (tight junction), zonula adhaerens (intermediary junction), and macula adhaerens (desmosome)… succeed each other in the order given in an apical-basal direction"; zônula de oclusão: "fusion of the adjacent cell membranes resulting in obliteration of the intercellular space"; zônula de adesão: "presence of an intercellular space (∼200 A)"; "The zonula occludens appears to form a continuous belt-like attachment, whereas the desmosome is a discontinuous, button-like structure" |
| Hartsock A, Nelson WJ. Biochim Biophys Acta 2008 | PMID 17854762 · [PMC2682436](https://pmc.ncbi.nlm.nih.gov/articles/PMC2682436/) | integral (manuscrito) | "Adherens junctions consist of the transmembrane protein E-cadherin, and intracellular components, p120-catenin, β-catenin and α-catenin"; "The occludin and claudin family of transmembrane proteins form the core of the Tight junction and control ion selectivity and permeability of the paracellular pathway" |
| Günzel D, Yu AS. Physiol Rev 2013 | PMID 23589827 · [PMC3768107](https://pmc.ncbi.nlm.nih.gov/articles/PMC3768107/) | integral (manuscrito) | "claudins constitute both paracellular barriers and pores and thereby play a key role in determining the permeability properties of epithelial and endothelial cells"; "increasing experimental evidence that tight junctions and claudins are not required for fence function" |
| Meng W, Takeichi M. Cold Spring Harb Perspect Biol 2009 | PMID 20457565 · [PMC2882120](https://pmc.ncbi.nlm.nih.gov/articles/PMC2882120/) | integral | "the AJ is specifically termed the 'zonula adherens' or 'adhesion belt,' as it completely encloses the cells along with the F-actin lining, called the circumferential actin belt" |
| Delva E, Tucker DK, Kowalczyk AP. Cold Spring Harb Perspect Biol 2009 | PMID 20066089 · [PMC2742091](https://pmc.ncbi.nlm.nih.gov/articles/PMC2742091/) | integral | "Desmogleins and desmocollins, members of the cadherin superfamily, mediate adhesion at desmosomes"; placa com placoglobina, placofilinas e desmoplaquina; "Dsg2 and Dsc2 are expressed widely and in all desmosome bearing tissues, whereas the other desmosomal cadherins are predominantly expressed in stratifying epithelia" |
| Goodenough DA, Paul DL. Cold Spring Harb Perspect Biol 2009 | PMID 20066080 · [PMC2742079](https://pmc.ncbi.nlm.nih.gov/articles/PMC2742079/) | integral | "The intercellular channels are formed by head-to-head docking of hexameric assemblies (connexons) of… the connexins"; "direct diffusion of ions and small molecules between adjacent cells"; "leaving a narrow ∼2 nm extracellular 'gap'" |
| Walko G, Castañón MJ, Wiche G. Cell Tissue Res 2015 | PMID 26017636 · [PMC4452579](https://pmc.ncbi.nlm.nih.gov/articles/PMC4452579/) | integral | "Classical type I HDs, found in stratified and pseudostratified epithelia, for example in the epidermis, consist in five major components, namely integrin α6β4, plectin isoform 1a (P1a), tetraspanin CD151, … BP230 and BPAG2 (also called BP180 or type XVII collagen). Type II HDs, found in simple epithelia such as that of the intestine, consist of integrin α6β4 and plectin and lack the two BP antigens"; "Integrin α6β4 binds to the extracellular matrix protein laminin-332, whereas P1a forms a bridge to the cytoplasmic keratin intermediate filament network"; "Fine anchoring filaments originate at HDs, traverse the lamina lucida and insert into the lamina densa" |
| Fontao L et al. Exp Cell Res 1999;250:298 | PMID 10413585 | resumo | "In cells lacking BP230 and BP180, HD1/plectin still associates with alpha6beta4 integrin, forming HD-like structures, called type II HDs" (linhagem epitelial intestinal) |
| Yurchenco PD. Cold Spring Harb Perspect Biol 2011 | PMID 21421915 · [PMC3039528](https://pmc.ncbi.nlm.nih.gov/articles/PMC3039528/) | integral | "laminin, type IV collagen, nidogen (entactin), and perlecan" |
| Chan FL, Inoue S. Microsc Res Tech 1994;28:48 | PMID 8061357 | resumo | "an artefactual formation of the lamina lucida occurs during dehydration in conventional tissue preparation rather than during chemical fixation" |
| Crawley SW, Mooseker MS, Tyska MJ. J Cell Biol 2014 | PMID 25422372 · [PMC4242837](https://pmc.ncbi.nlm.nih.gov/articles/PMC4242837/) | integral | "core actin bundles"; "Anchoring microvilli into the terminal web plays a crucial role in promoting the long-term stability of the brush border"; "microvilli amplify the surface area" |
| Porro AM et al. An Bras Dermatol 2019 (consenso da SBD, pênfigos) | PMID 31166407 · [PMC6544031](https://pmc.ncbi.nlm.nih.gov/articles/PMC6544031/) | integral | "pathogenic autoantibodies (usually IgG) that are directed against various desmosomal proteins (the desmogleins Dsg3 and Dsg1)… compromises intraepidermal adhesion"; pênfigo foliáceo e fogo selvagem: antidesmogleína 1 |
| Santi CG et al. An Bras Dermatol 2019 (consenso da SBD, penfigoides) | PMID 31166405 · [PMC6544032](https://pmc.ncbi.nlm.nih.gov/articles/PMC6544032/) | integral | "IgG autoantibodies are produced against antigens of the basement membrane zone (BMZ)-180kDa and 230kDa -collagen XVII, COL17 or BPAg2, and BPAg1"; dermatoses bolhosas subepidérmicas |

**Não abertos:** Junqueira e Carneiro, Ross e Pawlina, Guyton e Hall (livros); Vollmar e Menger, Physiol Rev 2009 (journals.physiology.org: "CONNECT tunnel failed, response 403"); texto integral de McCuskey 2008 (PMID 18484612) e de Wake e Sato 2015 (PMID 26332299), lidos só no resumo e não usados como prova; texto integral de Gordon, Huxley e Julian 1966 (PDF digitalizado) e de Burkholder e Lieber 2001 (PMID 11296141); Walker e Schrodt 1974 (PMID 4202806, sem resumo no PubMed). O OAI do PMC respondeu "cannotDisseminateFormat" para os artigos sem licença aberta, e as páginas do PMC devolveram verificação anti-robô em parte das tentativas; nesses casos a leitura foi refeita com intervalo entre os pedidos.
