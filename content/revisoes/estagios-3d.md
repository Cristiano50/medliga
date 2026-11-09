# Revisão por agente — Laboratório 3D (estagios.json), área embriologia/anatomia

- Agente: `revisor-estagios-3d-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` (partes aplicáveis a textos de estágio) · Esquema: `EstagioSchema` em `src/content/schema.ts`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 15 estágios.
- Escopo: só `content/embriologia/estagios.json`.
  - 12 estágios do grupo `desenvolvimento` (zigoto → placenta e membranas): **2ª revisão**, com olhar anatômico e de coerência com os tópicos citados em `topicos` (emb-03, 04, 05, 06, 07, 08, 09).
  - 3 estágios do grupo `sistemas` (`coracao-tubular`, `coracao-alca`, `aparelho-faringeo`): **1ª revisão, completa** (embriologia + anatomia + cardiologia), comparada com emb-12 e emb-13 e com o que o modelo 3D mostra (`src/modules/embriologia/modelos/sistemas.tsx`).
- Não mudaram: ids de estágios, ids e listas de estruturas, campo `grupo`, `ordem`, `diaReferencia` e `topicos`. Conferido por script contra `git show HEAD:content/embriologia/estagios.json` (resultado: iguais).

## 1. Resumo

Gravidades (protocolo): **crítica** = fato errado; **importante** = afirmação imprecisa ou ambígua que o aluno levaria como fato, ou contradição com o tópico; **menor** = redação, terminologia, precisão ou coerência fina.

| Estágio | Grupo | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| zigoto | desenvolvimento | 0 | 0 | 2 | aprovado-com-correcoes |
| clivagem | desenvolvimento | 0 | 0 | 1 | aprovado-com-correcoes |
| morula | desenvolvimento | 0 | 0 | 1 | aprovado-com-correcoes |
| blastocisto | desenvolvimento | 0 | 0 | 0 | aprovado |
| implantacao | desenvolvimento | 0 | 0 | 1 | aprovado-com-correcoes |
| disco-bilaminar | desenvolvimento | 0 | 0 | 3 | aprovado-com-correcoes |
| gastrulacao | desenvolvimento | 0 | 0 | 3 | aprovado-com-correcoes |
| neurulacao | desenvolvimento | 0 | 0 | 2 | aprovado-com-correcoes |
| semana-4 | desenvolvimento | 0 | 1 | 2 | aprovado-com-correcoes |
| semana-6 | desenvolvimento | 0 | 0 | 2 | aprovado-com-correcoes |
| semana-8 | desenvolvimento | 0 | 1 | 0 | aprovado-com-correcoes |
| placenta-membranas | desenvolvimento | 0 | 0 | 1 | aprovado-com-correcoes |
| coracao-tubular | sistemas | 0 | 2 | 10 | aprovado-com-correcoes |
| coracao-alca | sistemas | 0 | 0 | 5 | aprovado-com-correcoes |
| aparelho-faringeo | sistemas | 0 | 3 | 9 | aprovado-com-correcoes |
| **Total** | | **0** | **7** | **42** | 14 com correções, 1 aprovado |

São 49 correções em 55 campos editados (algumas correções tocam dois ou três campos, p. ex. o nervo do 4º arco aparece no destaque, no 4º arco e no nervo vago).

**Nenhum fato errado (crítica).** Os 12 estágios do desenvolvimento já estavam coerentes nos números (dias, Carnegie, tamanhos) depois da 1ª revisão; o que sobrou foi cronologia fina (placoide ótico "aparecendo" quando já é fosseta/vesícula; pavilhão "com forma definitiva" na 8ª semana) e terminologia. Os três estágios de sistemas tinham o esqueleto certo — regiões do tubo e seus destinos, alça em D, câmaras na posição final, derivados de arcos e bolsas, Meckel e Reichert, nervos V/VII/IX/X —, mas com quatro imprecisões que o aluno levaria para a prova: o nervo do 4º arco, a epiglote entre as cartilagens dos arcos 4/6, o "6º arco → artérias pulmonares e ducto arterioso" sem lado, e "cone arterial" usado para as vias de saída dos dois ventrículos.

### O que foi conferido e está correto (sem mudança)

- **Tubo cardíaco**: sequência cranial → caudal tronco arterial, bulbo cardíaco, ventrículo primitivo, átrio primitivo, seio venoso; polo arterial cranial e venoso caudal; destinos (átrio primitivo → aurículas; ventrículo primitivo → parte trabeculada do VE; bulbo proximal → parte trabeculada do VD; tronco → raízes da aorta e do tronco pulmonar); corno direito → parte lisa do átrio direito; corno esquerdo → seio coronário; cada corno recebe vitelina, umbilical e cardinal comum; mesocárdio dorsal → seio transverso do pericárdio; veia umbilical esquerda → ligamento redondo; vitelinas → sinusoides, porta e parte hepática da VCI; Carnegie 10 / ≈ 22 dias.
- **Alça**: dobramento para a direita (alça em D) entre os dias 23 e 28; bulbo ventral, caudal e à direita; ventrículo primitivo à esquerda; átrio e seio venoso dorsais e craniais; sulco bulboventricular por fora e prega bulboventricular por dentro, junto ao forame interventricular primário; na vista ventral o lado esquerdo do embrião fica à direita da tela (conferido também no código do modelo).
- **Aparelho faríngeo**: 1º arco → músculos da mastigação, ventre anterior do digástrico, milo-hióideo, tensor do tímpano, tensor do véu palatino; 2º → expressão facial, estapédio, estilo-hióideo, ventre posterior do digástrico; 3º → corno maior e parte inferior do corpo do hioide, estilofaríngeo; Meckel → martelo, bigorna, ligamento esfenomandibular; Reichert → estribo, processo estiloide, ligamento estilo-hióideo, corno menor e parte superior do corpo do hioide; bolsas 1–4; só o 1º sulco (meato acústico externo) e a 1ª membrana (membrana timpânica) persistem; 3º arco → carótidas comuns e parte proximal das internas; 4º esquerdo → parte do arco da aorta; 4º direito → parte proximal da subclávia direita.

## 2. Tabela de correções

### Importantes

| estágio | estrutura/campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| semana-4 | `descricao`; estrutura `placoide-otico` (`nome`, `descricao`) | "Aparecem… os **placoides ótico** e do cristalino…"; nome "Placoide/fosseta ótica" | "…as **fossetas óticas (que se fecham em vesículas)**, os placoides do cristalino…"; nome "**Fosseta/vesícula ótica**"; descrição explica que é o placoide já invaginado e que origina o labirinto membranáceo | Aos 26–28 dias (estágios 12–13) o placoide ótico já invaginou: emb-07 põe as fossetas óticas no estágio 11 (23–26 dias) e as vesículas no 13. O jogo "Identifique" pedia "Placoide…" num estágio em que ele já não existe como placoide. Id mantido. | Moore 11ª ed., cap. 5 (Tab. 5-1); emb-07 |
| semana-8 | `descricao`; estrutura `pavilhao-auricular` | "pavilhões auriculares **com forma definitiva**"; "**Forma final**, ainda baixo na cabeça." | "pavilhões auriculares **começando a assumir** a forma definitiva, mas ainda de implantação baixa"; "Começa a assumir a forma definitiva… chega à posição definitiva no período fetal." | No fim da 8ª semana o pavilhão só começa a tomar a forma final; emb-08 ainda o descreve de implantação baixa na 9ª–12ª semana e aproximando-se da posição definitiva na 13ª–16ª. | Moore 11ª ed., cap. 5 (8ª semana) e cap. 6; emb-08 |
| coracao-tubular | `descricao`; `destaques[2]` | "…seio venoso, **cujos cornos recebem** as veias vitelinas, umbilicais e cardinais comuns" (no dia 22); "Cada corno do seio venoso recebe três veias…" | descrição diz que o modelo é um **esquema** que já mostra as três veias, "ligação que se completa **em meados da 4ª semana**"; destaque começa com "Em meados da 4ª semana…" | O estágio é datado de ≈ 22 dias (Carnegie 10), mas Sadler descreve os cornos recebendo as três veias em meados da 4ª semana. Sem a ressalva, o aluno associaria o dia 22 a um sistema venoso que ainda está se formando. | Sadler 14ª ed., cap. 13; fonte secundária consultada na web (ver §5) |
| coracao-tubular | estrutura `bulbo-cardiaco` | "…o **cone arterial** forma as vias de saída dos dois ventrículos." | "…a **parte média (cone)** forma as vias de saída dos dois ventrículos: o **cone arterial (infundíbulo) do direito** e o **vestíbulo da aorta do esquerdo**." | Na anatomia, "cone arterial" é o infundíbulo do VD; usado para a porção embrionária média do bulbo, faz o aluno pensar que o infundíbulo do VD também forma a via de saída do VE. | Moore 11ª ed., cap. 13; Sadler 14ª ed., cap. 13 ("conus cordis"); Terminologia Anatômica |
| aparelho-faringeo | `destaques[0]`; estruturas `arco-faringeo-4` e `nervo-vago` | 4º arco: "vago (X, **ramo laríngeo superior**)"; "O ramo laríngeo superior inerva **os derivados do 4º arco**" | 4º arco: vago — **ramo laríngeo superior** (o citado nos livros-texto; inerva o **cricotireóideo**) e **ramo faríngeo** (constritores da faringe e levantador do véu palatino); 6º: laríngeo recorrente (músculos intrínsecos, exceto o cricotireóideo) | Os constritores e o levantador do véu palatino, listados como músculos do 4º arco no próprio estágio, são inervados pelo ramo faríngeo do vago (plexo faríngeo), não pelo laríngeo superior. emb-12 já fazia essa distinção; o estágio contradizia o tópico. | emb-12 (`resumo` e `notasDivergencia`); Moore 11ª ed., cap. 9 (Tab. 9-1); anatomia do nervo vago |
| aparelho-faringeo | estrutura `arco-faringeo-4` | "Com o 6º arco, origina **as cartilagens da laringe**" | "…origina as cartilagens da laringe, **exceto a epiglote**" | A epiglote vem do mesênquima da eminência hipofaríngea (3º–4º arcos), e não das cartilagens dos arcos 4 e 6 (tireóidea, cricóidea, aritenóideas, corniculadas, cuneiformes). | Moore 11ª ed., cap. 9; Sadler 14ª ed., cap. 17; emb-12 |
| aparelho-faringeo | estrutura `arcos-aorticos` | "3º: carótidas comuns e início das internas; 4º…; **6º: artérias pulmonares e ducto arterioso**" | acrescentado: "surgem em sequência craniocaudal e **não existem todas ao mesmo tempo**"; "**1º e 2º** regridem quase totalmente (restos: parte da artéria maxilar; artérias hióidea e estapédia)"; "6º: **partes proximais** das artérias pulmonares e, **só à esquerda**, o ducto arterioso" | Sem o lado, o texto sugeria ducto arterioso bilateral; as partes distais das artérias pulmonares não vêm do 6º arco; o modelo mostra artérias nos arcos 1–4 e o texto não dizia o destino de 1 e 2. Alinhado a emb-12 e emb-13. | Moore 11ª ed., cap. 13; Sadler 14ª ed., cap. 13; emb-13 |

### Menores

| estágio | estrutura/campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| zigoto | `descricao` | "Célula única e totipotente formada pela fertilização… os pronúcleos… se aproximam…" | Estágio 1 de Carnegie, da fertilização à 1ª clivagem; "a rigor, é nessa reunião [dos cromossomos no fuso] que o zigoto se forma: Moore chama de **oótide** a célula que ainda tem os dois pronúcleos, como a representada aqui" | O modelo mostra os dois pronúcleos; emb-03 define zigoto pela reunião dos cromossomos na metáfase e chama a célula com pronúcleos de oótide. | emb-03; Moore 11ª ed., cap. 2 |
| zigoto | estrutura `zigoto` | "Célula diploide resultante da **fusão dos gametas**…" | "Célula diploide (46 cromossomos) formada quando os cromossomos maternos e paternos se reúnem na metáfase da primeira mitose…" | Coerência com emb-03 (no ser humano não há fusão de pronúcleos). | emb-03 |
| clivagem | `dias` | "≈ 2 dias após a fertilização" | "≈ 40 horas (2º dia) após a fertilização" | O modelo é o estágio de 4 células; emb-04 adota ~40 h (Sadler). | emb-04 |
| morula | `descricao` | "compactação, por volta do estágio de **8** células" | "…de **8–9** células" | Faixa adotada em emb-04 (8 em Sadler; após 9 em Moore). | emb-04 (`notasDivergencia`) |
| implantacao | estrutura `cavidade-amniotica` | "Cavidade que surge no epiblasto; revestida por amnioblastos." | "…por volta do dia 8, entre o epiblasto (assoalho) e os amnioblastos (teto)." | No dia 8 o assoalho é o epiblasto; os amnioblastos formam só o teto. | emb-05 |
| disco-bilaminar | `destaques[0]` | "Semana dos 'pares'…; 2 camadas de mesoderma extraembrionário" | "'Semana dos dois' (Sadler)…; 2 lâminas de mesoderma extraembrionário" | Termo usado em emb-05, com a atribuição. | emb-05; Sadler 14ª ed., cap. 4 |
| disco-bilaminar | `destaques[1]` | "Placa precordal: espessamento do hipoblasto…" | idem + "(Moore; Sadler a descreve na 3ª semana)" | Divergência registrada em emb-05/emb-06. | emb-05 (`notasDivergencia`) |
| disco-bilaminar | estrutura `mesoderma-extraembrionario` | "entre o **trofoblasto** e o âmnio/saco vitelino; dividido em camada somática e esplâncnica" | "entre o **citotrofoblasto** e o âmnio/saco vitelino; o celoma extraembrionário o divide em lâmina somática e lâmina esplâncnica" | Precisão anatômica, como em emb-05. | emb-05; Moore 11ª ed., cap. 3 |
| gastrulacao | `descricao` | "Vista dorsal (pela cavidade amniótica, removida) do disco trilaminar." | "Vista dorsal do disco trilaminar, com o âmnio removido." | Redação (a cavidade não é "removida"). | — |
| gastrulacao | estrutura `membrana-bucofaringea` | "…ficam fundidos…; futura abertura da boca." | "…ficam unidos, sem mesoderma, no local da futura boca; rompe-se no fim da 4ª semana." | Coerência com emb-06/emb-12. | emb-06; emb-12 |
| gastrulacao | estrutura `membrana-cloacal` | "…futura região do ânus e do **seio urogenital**." | "Área caudal à linha primitiva…; mais tarde se divide nas membranas anal e urogenital, que se rompem." | O seio urogenital é estrutura interna; a membrana corresponde aos futuros orifícios. | emb-06; Moore 11ª ed., cap. 4 |
| neurulacao | `descricao` | "…começa na região dos **futuros 4º a 6º pares de somitos** (região cervical)" | "…começa na altura do 4º ao 6º par de somitos (**futura região cervical**)" | Os somitos já existem (estágio 10 tem 4–12 pares); futura é a região. | emb-06; Moore 11ª ed., cap. 4 |
| neurulacao | estrutura `somitos` | "miótomo (músculos esqueléticos)" | "miótomo (músculos esqueléticos do dorso, da parede do corpo e dos membros)" | Os músculos da cabeça (arcos faríngeos, extraoculares) não vêm dos somitos; os da língua vêm dos somitos occipitais. | Moore 11ª ed., cap. 15; Sadler 14ª ed., cap. 11 |
| semana-4 | estrutura `cordao-umbilical` | "Liga o embrião à **placenta**; contém vasos umbilicais." | "Forma-se a partir do pedículo de conexão e do ducto vitelino, revestido pelo âmnio; liga o embrião ao córion (futura placenta)…" | Coerência com emb-07; não há placenta definida na 4ª semana. | emb-07 |
| semana-4 | `destaques[0]` | "…ou espinha bífida (caudal)." | "…ou espinha bífida **aberta** (caudal)." | Termo de emb-07 (a espinha bífida oculta não é falha de fechamento do neuroporo). | emb-07 |
| semana-6 | `descricao` | "…as saliências auriculares **formam** o pavilhão." | "…**surgem** as saliências auriculares, que **formarão** o pavilhão." | emb-07 põe o contorno do pavilhão no estágio 17 (7ª semana). | emb-07 |
| semana-6 | estrutura `pavilhao-auricular` (nome "Saliências auriculares") | "Seis saliências ao redor do primeiro sulco faríngeo que formam o pavilhão…" | "…(três do 1º e três do 2º arco, na descrição clássica) que formarão o pavilhão…" | Origem explícita, como em emb-07/emb-12 (com a ressalva já registrada em emb-07). | emb-07; emb-12 |
| placenta-membranas | `destaques[2]` | "Âmnio e cório se fundem e obliteram a cavidade coriônica." | "A expansão do âmnio oblitera a cavidade coriônica, e o âmnio adere ao cório (membrana amniocoriônica)." | Causa e efeito na ordem de emb-09. | emb-09 |
| coracao-tubular | `descricao` | "tubos endocárdicos, derivados da área cardiogênica (mesoderma esplâncnico), fundem-se…" | "…formados na área cardiogênica (**campo cardíaco primário**…), fundem-se **com o dobramento lateral**…; os dois polos se alongam com células do **campo cardíaco secundário**." | Coerência com emb-13 (o trato de saída e a entrada crescem por acréscimo do campo secundário). | emb-13; Sadler 14ª ed., cap. 13 |
| coracao-tubular | `destaques[1]`; estrutura `mesocardio-dorsal` | "O mesocárdio dorsal degenera e deixa o **seio pericárdico transverso**." | "A **parte central** do mesocárdio dorsal degenera e deixa o **seio transverso do pericárdio**." | Termo anatômico e precisão (só a parte central regride), como em emb-13. | emb-13; Moore 11ª ed., cap. 13 |
| coracao-tubular | estrutura `seio-venoso` | "O corno direito é incorporado ao átrio direito (parte lisa); o esquerdo forma o seio coronário." | "…com cornos direito e esquerdo. O corno direito incorpora-se ao átrio direito (parte lisa, o **seio das veias cavas**); o esquerdo forma o seio coronário (e a **veia oblíqua do átrio esquerdo**)." | Completa o destino, como em emb-13. | emb-13; Sadler 14ª ed., cap. 13 |
| coracao-tubular | estrutura `ventriculo-primitivo` | "Origina a maior parte do ventrículo esquerdo." | "Origina a **parte trabeculada** do ventrículo esquerdo, a maior parte dessa câmara." | Coerência com emb-13. | emb-13 |
| coracao-tubular | estrutura `tronco-arterial` | "…será dividido pelo septo aorticopulmonar em raiz da aorta e tronco pulmonar." | "…contínua com o saco aórtico; o septo aorticopulmonar (conotruncal) o divide nas raízes e partes proximais da aorta e do tronco pulmonar." | Coerência com emb-13. | emb-13 |
| coracao-tubular | estrutura `saco-aortico` | (sem destino) | "+ contribui para a parte proximal do arco da aorta e para o tronco braquiocefálico" | Destino, como em emb-13. | emb-13; Moore 11ª ed., cap. 13 |
| coracao-tubular | estrutura `arcos-aorticos` | "Artérias que percorrem os arcos faríngeos…" | "+ surgem em sequência craniocaudal e não existem todas ao mesmo tempo (aqui, o 1º par)" | O modelo mostra um par; emb-13 frisa que não coexistem. | emb-13 |
| coracao-tubular | estrutura `veias-vitelinas` | "…o **sistema porta**…" | "…atravessam o septo transverso; originam os sinusoides hepáticos, a **veia porta**, a **veia mesentérica superior** e a porção hepática da VCI." | Coerência com emb-13. | emb-13 |
| coracao-tubular | estrutura `veias-umbilicais` | "Trazem sangue oxigenado da **placenta**." | "…do **córion (futura placenta)**." | No dia 22 a placenta não está formada (emb-13: "córion/placenta"). | emb-13 |
| coracao-tubular | estrutura `veias-cardinais` (nome "Veias cardinais comuns") | "Drenam o corpo do embrião (cardinais anteriores e posteriores)…; a comum direita contribui para a VCS." | "Troncos curtos formados pela união das cardinais anteriores e posteriores… A VCS forma-se da cardinal anterior direita e da cardinal comum direita." | O texto confundia as comuns com as anteriores/posteriores. | Moore 11ª ed., cap. 13; emb-13 |
| coracao-alca | `carnegie` | `[]` | `[11, 12, 13]` | Dias 23–28 pela tabela de emb-07 (11 = 23–26; 12 = 26–30; 13 = 28–32); fontes de estadiamento põem as câmaras atriais na posição dorsocranial definitiva no estágio 13. | emb-07; literatura de estadiamento (ver §5) |
| coracao-alca | `descricao` | "…a porção caudal (átrio e seio venoso) passa a ocupar posição dorsal e cranial." | "Entre os dias 23 e 28…; o ventrículo primitivo, **para a esquerda**; a porção caudal…, dorsal e cranialmente **e para a esquerda**, até ficar atrás e acima dos ventrículos." | Descrição de Sadler adotada em emb-13 ("região atrial, dorsocranial e para a esquerda"). | emb-13; Sadler 14ª ed., cap. 13 |
| coracao-alca | `destaques[2]` | "Alterações da lateralidade da alça associam-se à dextrocardia…" | "A alça para a esquerda (**alça em L**) **pode causar** dextrocardia; alterações da lateralidade associam-se também a outros defeitos (heterotaxia)." | Mecanismo explícito e "pode", como em emb-13 (nem toda dextrocardia vem de alça em L). | emb-13 |
| coracao-alca | estrutura `atrio-primitivo` | "Desloca-se dorsal e cranialmente, acima dos ventrículos." | "…(e um pouco para a esquerda), ficando atrás e acima dos ventrículos." | idem | emb-13 |
| coracao-alca | estrutura `ventriculo-primitivo` | "…futuro ventrículo esquerdo." | "…origina a parte trabeculada do ventrículo esquerdo." | Coerência com emb-13 e com o estágio anterior. | emb-13 |
| aparelho-faringeo | `dias`, `carnegie` | "4ª–5ª semana após a fertilização"; `[]` | "≈ 28–32 dias após a fertilização (fim da 4ª–início da 5ª semana)"; `[13, 14]` | O modelo tem quatro pares de arcos e o 2º ainda não cobriu os seguintes: estágio 13 (quatro pares) e 14; a cobertura ocorre na 5ª semana (emb-07). `diaReferencia` 32 mantido. | emb-07; Moore 11ª ed., Tab. 5-1 |
| aparelho-faringeo | `descricao` | "…com uma artéria (vermelho), um nervo (amarelo) e uma cartilagem (cinza-azulado)…; onde se encontram, as membranas faríngeas." | acrescentado o componente muscular; "No modelo: …cartilagens **só no 1º e no 2º arcos**"; membranas "com pouco mesênquima entre eles"; "O 5º arco é rudimentar ou ausente, e o 6º não está representado." | O modelo só tem malha de cartilagem nos arcos 1 e 2 (Meckel e Reichert); o aluno procuraria cartilagem nos arcos 3 e 4. Os destaques citam o 6º arco, que não aparece no modelo. | `sistemas.tsx`; emb-12 |
| aparelho-faringeo | estrutura `arco-faringeo-2` (`nome`) | "2º arco faríngeo (**hioide**)" | "2º arco faríngeo (**hióideo**)" | Adjetivo, como em emb-12 ("2º (hióideo)"). | emb-12 |
| aparelho-faringeo | estrutura `arco-faringeo-2` (`descricao`) | "Cresce sobre os arcos seguintes e **forma o seio cervical**." | "Cresce caudalmente sobre o 3º e o 4º arcos e encerra os sulcos seguintes no seio cervical, que normalmente desaparece." | O seio cervical é a cavidade que se forma quando o 2º arco cobre os sulcos 2–4; ele não "forma" o seio. | emb-12; Moore 11ª ed., cap. 9 |
| aparelho-faringeo | estrutura `bolsa-faringea-3` | "Parte dorsal: paratireoides inferiores; parte ventral: timo." | idem + "Ambos migram caudalmente, e por isso a paratireoide da 3ª bolsa termina abaixo da que vem da 4ª." | Explica a inversão inferior/superior, como em emb-12. | emb-12 |
| aparelho-faringeo | estrutura `bolsa-faringea-4` | "Paratireoides superiores e corpo ultimofaríngeo, que se incorpora à tireoide." | "Parte dorsal: paratireoides superiores; parte ventral: corpo ultimofaríngeo (para Sadler, de uma 5ª bolsa considerada parte da 4ª), que se incorpora à tireoide e origina as células parafoliculares (C)." | Coerência com emb-12 e divergência Moore × Sadler. (Não afirma a camada germinativa das células C, que é controversa.) | emb-12 |
| aparelho-faringeo | estrutura `membranas-faringeas` | "Pontos de contato entre o ectoderma… e o endoderma…" | "…se aproximam, com pouco mesênquima entre eles; só a 1ª persiste, formando a membrana timpânica." | A membrana timpânica tem três camadas (ectoderma, mesênquima, endoderma). | emb-12; Moore 11ª ed., cap. 9 |
| aparelho-faringeo | estrutura `nervo-trigemeo`; `destaques[0]` | "Os ramos maxilar e mandibular inervam os derivados do 1º arco." | "O ramo mandibular (V3) é o nervo motor dos músculos do 1º arco; os ramos maxilar (V2) e mandibular (V3) dão a sensibilidade…"; destaque: "trigêmeo (V; motor pelo V3)" | O V2 não inerva músculo; coerência com emb-12 ("motor pelo V3"). | emb-12 |
| aparelho-faringeo | estrutura `cartilagem-de-meckel` | "Origina o martelo, a bigorna e o ligamento esfenomandibular…" | "Sua extremidade dorsal origina o martelo e a bigorna; seu pericôndrio, o **ligamento anterior do martelo** e o ligamento esfenomandibular… o restante da cartilagem desaparece." | Derivados completos e de que parte vêm. | Moore 11ª ed., cap. 9; emb-12 |

## 3. Pontos para o revisor humano

1. **Decídua capsular (placenta-membranas) — divergência entre fontes.** O texto segue emb-09 e Sadler: a capsular se distende e degenera, e o cório liso se funde à decídua parietal. Moore descreve primeiro o contato/fusão da capsular com a parietal e o desaparecimento dela só no 2º trimestre (fontes secundárias citam ~22 semanas). No modelo do "≈ 3º mês" a capsular ainda está presente, o que é compatível com as duas versões. Decida se quer citar o tempo de Moore.
2. **Idades e CCN por estágio de Carnegie (emb-07) continuam sendo a principal pendência** (já apontada na revisão G2): a tabela do tópico não bate exatamente com as versões da Tabela 5-1 de Moore que circulam (p. ex. estágio 10 com 1,5–3 × 2,0–3,5 mm; estágio 15 com 35–38 dias). Os estágios do laboratório seguem o tópico; se o tópico mudar, `semana-4`, `semana-6`, `coracao-alca` e `aparelho-faringeo` precisam acompanhar.
3. **Coração tubular é um esquema de livro-texto.** Os cinco segmentos no dia 22 e as três veias já ligadas são a figura clássica (Moore, Sadler). No modelo atual do campo cardíaco secundário, o tubo do dia 22 é sobretudo o futuro VE, e trato de saída e seio venoso são acrescentados depois. A descrição agora diz isso em uma frase; decida se basta.
4. **Carnegie da alça (11–13).** Algumas descrições de estadiamento põem o início da alça ainda no fim do estágio 10; adotei 11–13 pelas datas do tópico (23–28 dias). Pela mesma lógica, o aparelho faríngeo ficou com 13–14.
5. **Nervo do 4º arco.** Moore e Sadler citam o laríngeo superior como "o nervo do 4º arco"; o texto agora diz isso e acrescenta o ramo faríngeo (constritores, levantador do véu palatino). É compatível com as questões de emb-12, que mantêm "laríngeo superior" nos pares de associação.
6. **Título "Zigoto" com pronúcleos.** O modelo mostra dois pronúcleos, que Moore chama de oótide; a descrição explica isso. Se preferir, o título pode virar "Zigoto (estágio pronuclear)" — não mudei o título.
7. **Fora deste arquivo (não alterado):**
   - emb-13 usa "parte média (cone arterial)" para o bulbo; o mesmo problema de terminologia da correção importante do `bulbo-cardiaco`. Sugiro "parte média (cone, ou cone cardíaco)" no tópico.
   - `src/modules/embriologia/Lab3D.tsx` mostra `carnegie.join('–')`: com três valores aparece "Carnegie 11–12–13". Sugiro exibir primeiro–último.
   - `aparelho-faringeo` poderia listar também `emb-13-cardiovascular` em `topicos` (artérias dos arcos); não mexi em `topicos`.
8. **Campo `camada` da `linha-primitiva` = "ectoderma".** Na gastrulação a linha primitiva é epiblasto; o campo não aparece na interface hoje (conferido por busca no código), por isso não mudei.
9. **Proeminência hepática já na 4ª semana (`semana-4`).** Coerente com emb-07, mas não conferi com a figura de Moore; vale um olhar.

## 4. Evidência

```
$ python3 aplicar.py content/embriologia/estagios.json      # script da revisão (fora do repositório)
mudanças aplicadas: 55
ids/grupos/estruturas/humano iguais ao HEAD: True

$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.

$ npx vitest run
 Test Files  2 passed (2)
      Tests  29 passed (29)
```

Os testes de `tests/conteudo.test.ts` (`todo estágio tem modelo`, `toda estrutura listada no estágio existe no modelo`, `toda parte do modelo tem nome no estágio`, `estágios em ordem cronológica dentro de cada grupo`, `todo modelo registrado tem estágio no conteúdo`) passam.

A árvore de trabalho tem alterações em `content/embriologia/topicos/emb-10-malformacoes.json` (já estava lá quando esta revisão começou) e em `content/embriologia/topicos/emb-06-semana3.json` (apareceu durante a revisão). **Nenhuma das duas é desta revisão**: vêm de outras frentes. A validação e os testes acima foram rodados de novo depois de `emb-06` mudar, com o mesmo resultado (29/29). A conferência de coerência com emb-06 usou o arquivo como estava no início da revisão. Olhei o diff da outra frente: ele só reescreve textos de alternativas de questões e não mexe em resumo, estruturas, eventos, dias nem Carnegie, que foram os dados usados aqui.

## 5. Fontes

- Moore, Persaud, Torchia. *Embriologia Clínica*, 11ª ed. — caps. 2–7 (desenvolvimento, placenta), 9 (aparelho faríngeo), 13 (sistema cardiovascular), 15 (sistema muscular).
- Sadler. *Langman — Embriologia Médica*, 14ª ed. — caps. 3–6, 8, 11, 13 (sistema cardiovascular: alça, seio venoso), 17 (cabeça e pescoço).
- Tópicos do próprio app: emb-03, emb-04, emb-05, emb-06, emb-07, emb-08, emb-09, emb-12, emb-13 (resumos, estruturas, `notasDivergencia`).
- Busca na web feita em 2026-11-09. Só li os **resumos que a ferramenta de busca devolveu**, e as fontes são secundárias: a rede da sessão não deixou abrir páginas (embryology.med.unsw.edu.au foi recusado). Servem de apoio, não de prova; o revisor humano deve conferir nos livros.
  - Decídua capsular degenerando por volta de 22 semanas: [LifeMap Discovery — decidual formation](https://discovery.lifemapsc.com/library/review-of-medical-embryology/chapter-40-the-placenta-decidual-formation), [StatPearls (NCBI Bookshelf)](https://www.ncbi.nlm.nih.gov/books/NBK551634/).
  - Cornos do seio venoso recebendo três veias "em meados da 4ª semana" (redação de Sadler) e destino do corno esquerdo (seio coronário e veia oblíqua do átrio esquerdo): [material de aula — Development of CVS](https://www.scribd.com/document/684674053/Development-of-CVS), [LifeMap Discovery — sinus venosus and associated veins](https://discovery.lifemapsc.com/library/review-of-medical-embryology/chapter-118-development-of-sinus-venosus-and-associated-veins).
  - Alça cardíaca do fim do estágio 10 ao 13, com os átrios chegando à posição dorsocranial no estágio 13: resultados que apontavam para [PMC9225347](https://pmc.ncbi.nlm.nih.gov/articles/PMC9225347) e [PMC7033877](https://pmc.ncbi.nlm.nih.gov/articles/PMC7033877/figure/jah34800-fig-0004). As fontes divergem nos detalhes do estadiamento (ver ponto 4).
