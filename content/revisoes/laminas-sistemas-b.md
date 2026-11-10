# Revisão por agente: microscópio virtual, grupo B (tubo digestivo e glândulas anexas), etapas histologia e patologia

- Agentes: `revisor-laminas-v2` (1ª etapa, histologia) e `revisor-laminas-patologia-v2` (2ª etapa, patologia) · Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (rigor de cada afirmação, terminologia, mudança mínima, ids intocados, registro em `revisao.agentes`, relatório; fontes lidas com curl, sem WebFetch). Padrão e escala P1/P2/P3 de `content/revisoes/laminas-histologia.md` (revisão v1 das 16 lâminas antigas).
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nas 5 lâminas.
- Escopo:
  - **Texto** (editado): `content/histologia/laminas-sistemas-b.json`, lâminas `esofago`, `estomago-fundo`, `colon`, `figado` e `pancreas`. Foram lidos título, tecido, órgão, coloração, descrição, destaques e cada estrutura, e conferidos contra Junqueira 14ª ed., Ross 8ª ed. e os tópicos his-14 e his-15 (nomes e definições).
  - **Desenho** (só avaliado, **nenhum código alterado**): `src/modules/histologia/laminas/sistemas-b.tsx`. Avaliado pelas capturas do app (`app/h-*`, `h10-*`, `h40-*`, `t40-*`, `m-app-4x-40x.png`, `m-toques-40x.png`), pelas renderizações completas e recortes (`out/full-*`, `out/c-*`), pelos cantos da área de sorteio (`campos/m-campos-10x.png`) e pela medição de toque (`toque.json`/`toque.log`), todos em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/lam-b/`.
- Não mudaram: ids das lâminas, `ordem`, `titulo`, `tecido`, `topicos`, ids e lista de `estruturas`. Conferido por script contra `git show HEAD:` (§6).

## 1. Resumo

Gravidades (protocolo e revisão v1): **crítica** = fato errado; **importante** = afirmação imprecisa que o aluno levaria como fato, ou contradição com o desenho ou com o tópico; **menor** = redação, terminologia, precisão.

| Lâmina | Críticas | Importantes | Menores | Veredito histologia | Veredito patologia | Desenho |
|---|---|---|---|---|---|---|
| esofago | 0 | 1 | 2 | aprovado-com-correcoes | aprovado | ajustar (P2) |
| estomago-fundo | 0 | 1 | 2 | aprovado-com-correcoes | aprovado-com-correcoes | ajustar (P2) |
| colon | 0 | 0 | 3 | **reprovado (pelo desenho)** | aprovado-com-correcoes | **refazer a mucosa (P1)** |
| figado | 0 | 0 | 8 | aprovado-com-correcoes | aprovado-com-correcoes | ajustar (P2) |
| pancreas | 0 | 0 | 2 | aprovado-com-correcoes | aprovado | ajustar (P2) |
| **Total** | **0** | **2** | **17** | | | 1 P1 de desenho · 1 P1 de jogo |

São **19 correções** em 21 campos de texto (a troca "espaço portal" → "espaço porta" toca vários campos do fígado e conta como uma).

**Nenhum erro crítico de texto.** As duas importantes:
- O **ducto da glândula esofágica** era descrito como "de epitélio cúbico" (o desenho também o mostra simples). O ducto excretor tem epitélio estratificado, em geral de duas camadas, que se torna pavimentoso na abertura.
- **"Ovo frito"** para a célula parietal. Na patologia, a expressão designa o halo perinuclear do oligodendroglioma. Foi retirada pelo mesmo critério que tirou "olho de coruja" do neurônio na revisão v1.

**O problema grave está no desenho do cólon (P1-1).** Entre as criptas há colunas de lâmina própria com topo em cúpula e borda estriada, iguais às vilosidades da lâmina do intestino delgado. Isso contradiz o critério que define a lâmina ("sem vilosidades, superfície plana"). Não posso alterar código, então a etapa de histologia do cólon ficou **reprovada** (definição do protocolo: "sobrou problema grave que você não conseguiu resolver"). Na revisão v1, problemas P1 de desenho ficaram só nas notas, com veredito dado pelo texto. Aqui me afastei disso porque o erro atinge o próprio critério diagnóstico da lâmina (ver ponto 1 em §5).

**Respostas do jogo "Qual é o tecido?"** (`tecido`): as cinco estão corretas, são inequívocas e diferem entre si e das 16 antigas e das 6 do grupo A. No fim desta revisão, o grupo C tinha 7 lâminas no JSON (pulmão, rim, tireoide, adrenal, testículo, ovário, útero), e nenhuma conflita. O problema que sobra é de **código do jogo** (P1-2): o distrator "Epitélio simples cilíndrico" (lâmina do intestino delgado) é resposta **defensável** num campo de cólon ou de estômago, que são revestidos por esse epitélio.

### Conferido e correto (sem mudança)

Itens que o desenhista pediu para conferir, com resultado:
- **Esôfago:** estratificado pavimentoso não queratinizado, sem granulosa nem córnea. Glândulas esofágicas propriamente ditas, mucosas, na **submucosa** × glândulas cárdicas esofágicas na **lâmina própria** perto do estômago. Muscular externa esquelética no terço superior, mista no médio e lisa no inferior. A muscular da mucosa do esôfago é longitudinal e aparece em perfis redondos no corte transversal; a circular interna aparece cortada ao comprido. Junção esofagogástrica abrupta. Barrett como metaplasia intestinal com caliciformes (definição do ACG, coerente com his-02).
- **Estômago:**
  - Fossetas com ≈1/4 da espessura da mucosa: no desenho, 132 de 520 un.
  - Parietais na metade superior e principais na base. Contagem no SVG: parietais com 77% da área de células em y 228–300 e 65% em 300–370; principais com 94% em 494–545.
  - Células mucosas do colo entre as parietais. Parietal eosinófila com núcleo central, às vezes binucleada, abaulando para a lâmina própria. Principal com base basófila e ápice claro.
  - Sem caliciformes no estômago normal. Fator intrínseco e anemia perniciosa.
  - Traço transparente de toque no eixo da glândula: funciona. A faixa de 12 un cobre a luz (7 un) e 2,4 un do ápice das células de cada lado, e as células continuam tocáveis (parietal 13,7% e principal 11,1% da área da lâmina).
- **Cólon:** sem vilosidades, criptas retas e próximas, caliciformes abundantes, lâmina própria rica em células, Paneth ausente no cólon distal (coerente com his-14). Tênias citadas e camada longitudinal contínua declarada como convenção de esquema.
- **Fígado:**
  - Lóbulo clássico **sem septos** (humano), com nota sobre o porco. Placas de **uma célula** de espessura.
  - **Kupffer na luz do sinusoide**, presa ao endotélio, com realce declarado. Tríade **completa**, declarada como convenção.
  - **Linfáticos** e nervos no espaço porta citados no texto (destaque 1 e estrutura). **Espaço de Disse** citado como não visível no HE.
  - Fluxo de sangue e de bile em sentidos opostos. Zona 3 e paracetamol.
- **Pâncreas:** **sem ductos estriados**, **células centroacinosas** (em metade ou mais dos ácinos do desenho), ilhota **pálida com capilares**, tipos celulares só por imuno-histoquímica. A diferença com a **parótida** está explícita no destaque 0, e a `areaDiagnostica` [360, 270, 480, 390] mantém a ilhota grande (420, 330; r 88) inteira em todo campo de 10×.

## 2. Tabela de correções de texto

### Importantes (2)

| lâmina | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| esofago | `glandula-esofagica` | "O ducto, de epitélio cúbico, atravessa…" | "O ducto excretor, de epitélio estratificado (em geral com duas camadas de células) que se torna pavimentoso junto à abertura, atravessa…" | "Cúbico" sem qualificação ensina "simples cúbico", e o desenho mostra uma só fileira (P2-5). O ducto intralobular tem duas camadas (cúbica + mioepitelial); o extralobular, duas camadas (cilíndrica + basal), pavimentoso na abertura. | Nie et al., *Esophagus* 2020;17(4):376-384, PMID 32621256, PMC7497321 (texto integral, §6); Ross 8ª ed., Sistema digestório II |
| estomago-fundo | `destaques[0]` | "…núcleo central, às vezes dois — o aspecto de 'ovo frito'." | "…núcleo central, às vezes dois." | Na patologia, "ovo frito" é o halo perinuclear do oligodendroglioma (e é usado em outras neoplasias de células claras). Ligar o termo a uma célula normal, eosinófila e sem halo, cria associação errada. O critério é o mesmo usado para "olho de coruja" na v1. | Attanasio et al., *Int J Mol Sci* 2026;27(16):7163, PMID 42653168, PMC13513445 (texto integral, §6); Junqueira 14ª ed. e Ross 8ª ed. descrevem a parietal sem esse termo |

### Menores (17)

| lâmina | etapa | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|---|
| esofago | hist. | `destaques[2]` | "Muscular externa: estriada… lisa no terço inferior" | "Muscular externa, na descrição clássica dos livros: …" | O his-14 registra a divergência com dissecções (Meyer 1986) e chama a divisão de "descrição clássica". | his-14 (`notasDivergencia`) |
| esofago | hist. | `epitelio-estratificado-pavimentoso` | "a basal, de células… que se dividem" | "a basal, … onde (com as camadas logo acima dela) ocorrem as divisões que renovam o epitélio" | Divisão também nas camadas suprabasais. É o mesmo ajuste feito na pele espessa na v1. | Junqueira, Pele e anexos (v1); Maev et al. 2023 (camada basal de 1–3 fileiras, §6) |
| estomago-fundo | hist. | `celula-mucosa-do-colo` | "núcleo achatado na base; muco mais fluido" | "núcleo na base; muco mais solúvel que o da superfície" | Junqueira: núcleo na base. Ross (de memória): o núcleo tende a ser esférico. O termo do his-14 é "mais solúvel". | his-14; Junqueira 14ª ed., Trato digestivo |
| estomago-fundo | pat. | `celula-mucosa-superficial` | "secreta um muco espesso que retém bicarbonato" | "secreta muco neutro (PAS-positivo), espesso, e bicarbonato, que fica retido no muco" | A célula secreta os dois. O muco **neutro** distingue a foveolar da caliciforme (mucina ácida) na metaplasia intestinal e no Barrett. | his-14 (estrutura e correlação Barrett) |
| colon | pat. | `destaques[3]` | "A maioria dos carcinomas colorretais se origina de adenomas (pólipos)" | "A maioria dos adenocarcinomas colorretais surge de adenomas (pólipos adenomatosos)…, pela sequência adenoma–carcinoma; outra parte surge pela via serrilhada" | "(pólipos)" igualava pólipo a adenoma, e faltava a via serrilhada. Texto alinhado ao his-03. | his-03; Cai et al., *Front Public Health* 2026, PMID 42953785, PMC13715656 (lesões serrilhadas ≈15–30% dos CCR, §6) |
| colon | pat. | `celula-caliciforme` | "(pálido no HE, PAS-positivo)" | "(pálido no HE; mucinas ácidas, positivas pelo PAS e pelo azul alciano)" | Coerente com his-14 e com a correlação de Barrett. | his-14 |
| colon | pat. | `plexo-mioenterico` | "Os neurônios faltam no segmento afetado da doença de Hirschsprung" | "…faltam as células ganglionares deste plexo e do submucoso; o diagnóstico é feito em biópsia retal com submucosa" | A biópsia avalia o plexo submucoso (his-14, ERNICA 2026). | his-14 (correlação "hirschsprung-biopsia-retal") |
| figado | hist. | `descricao`, `destaques[0]`, `destaques[1]`, `triade-portal.nome`, `ramo-da-veia-porta` | "espaço(s) portal(is)" | "espaço(s) porta" | Os nomes das estruturas precisam bater com o his-15 ("Espaço porta (tríade portal)"). | his-15 |
| figado | hist. | `destaques[0]` | "zonas 1 a 3, da tríade para a veia centrolobular" | "zonas 1 a 3, dos ramos vasculares que saem dos espaços porta até a veia centrolobular" | O eixo do ácino são os ramos terminais de distribuição, não a tríade. | his-15 (`acino-hepatico`) |
| figado | hist. | `sinusoide-hepatico.nome` | "Capilar sinusoide" | "Sinusoide hepático (capilar sinusoide)" | Nome do tópico; o antigo fica como sinônimo. | his-15 |
| figado | hist. | `ramo-da-veia-porta` | "sangue venoso do intestino, do baço e do pâncreas" | "…do estômago, dos intestinos, do baço e do pâncreas" | Lista incompleta. | Junqueira 14ª ed., Glândulas anexas |
| figado | hist. | `ducto-biliar` | "recebe a bile dos canalículos" | "recebe a bile que vem dos canalículos pelos canais de Hering" | Segmento intermediário citado no his-15. | his-15 (`canal-de-hering`) |
| figado | pat. | `placas-de-hepatocitos` | "canalículos biliares, invisíveis no HE" | "…que não aparecem no HE do fígado normal (na colestase, podem surgir dilatados, com tampões de bile)" | "Invisíveis" sem qualificação é falso na colestase, achado clássico da biópsia. | his-15 (correlação colestase); Robbins, Fígado |
| figado | pat. | `sinusoide-hepatico` | "espaço de Disse, não visível no HE" | "espaço de Disse, com as células estreladas (de Ito), que, ativadas, depositam o colágeno da fibrose; o espaço não é visível no HE de rotina" | Base celular da fibrose e da cirrose. | his-15 |
| figado | pat. | `triade-portal` | "formam a placa limitante" | "…placa limitante, destruída na hepatite de interface" | Correlação central do his-15 (ver também P2-3 no desenho). | his-15 |
| pancreas | hist. | `descricao` | "Glândula mista." | "Glândula mista (exócrina e endócrina)." | No jogo, "Glândula exócrina mista (seromucosa)" (submandibular) é um distrator possível. Sem a qualificação, "mista" confunde. | Junqueira 14ª ed., Glândulas anexas |
| pancreas | hist. | `descricao`; `destaques[3]` | "(α, β, δ, PP)"; "PP (polipeptídeo pancreático)" | "(α, β, δ, PP e ε)"; "PP (polipeptídio pancreático) e ε (grelina)" | Mesma lista e grafia do his-15. | his-15 |

## 3. Desenhos: avaliação por lâmina

Critério da v1: o esquema precisa mostrar os **aspectos diagnósticos** que o texto e os tópicos cobram, sem induzir erro. Não se exige fotorrealismo. Coordenadas do SVG (1000 × 700), funções de `src/modules/histologia/laminas/sistemas-b.tsx`. Os ajustes são **propostos**; nenhum código foi alterado.

| Lâmina | Aspectos diagnósticos conferidos | Toque (área) | Área diagnóstica | Veredito |
|---|---|---|---|---|
| esofago | Superficiais achatadas **com núcleo**, sem córnea. Camada basal de uma fileira (≈7% da espessura) e papilas até 28–41% da espessura, ou seja, esôfago **normal**, sem padrão de refluxo. Capilares nas papilas. Muscular da mucosa em perfis redondos (longitudinal). Glândulas mucosas na submucosa com ducto que chega à luz. Circular interna em fusos, longitudinal externa em perfis redondos, plexo entre elas. **Ducto simples cúbico** | 7/7; menor: plexo 1,5% | [200,160,800,250]: todo campo de 10× contém o epitélio | **ajustar (P2-5)** |
| estomago-fundo | Fosseta ≈1/4; glândulas longas e retas; colo com mucosas do colo; parietais na metade superior, principais na base; LP escassa entre glândulas; muscular da mucosa em duas subcamadas. **Fossetas estreitas e muito espaçadas, cristas largas de topo plano** | 9/9; menor: fosseta 2,1% | [200,150,800,420]: todos os cantos mostram parietais | **ajustar (P2-2)** |
| colon | Criptas retas até a muscular da mucosa, caliciformes, LP celular, sem Paneth. **Colunas de LP com cúpula e borda estriada = aspecto de vilosidades** | 8/8; menor: epitélio de superfície 1,1% | [200,150,800,230]: sempre há criptas, mas o campo de y 0–300 é justamente o de aspecto viloso | **refazer (P1-1, P2-1)** |
| figado | Hexágono com a veia central e 6 espaços porta, sem septos; placas de 1 célula; sinusoides com hemácias e endotélio; Kupffer na luz; tríade completa (veia > artéria ≈ ducto). **Sem placa limitante** | 8/8; menor: artéria 0,2% (8 un de raio; tocável a 40×) | padrão [250,200,750,500]: o fígado é reconhecível em qualquer campo | **ajustar (P2-3)** |
| pancreas | Ácinos juntos com base basófila e ápice com zimogênio, núcleo basal; centroacinosas; sem ductos estriados; ilhota pálida com capilares; septo com ducto interlobular e vasos. **Ductos intercalados mal reconhecíveis** | 6/6; menor: ducto intercalado 0,4% | ilhota grande sempre no campo | **ajustar (P2-4)** |

### Lista priorizada de ajustes nos desenhos

**P1: ensina errado ou contradiz o texto/tópico**

1. **cólon: mucosa com aspecto de vilosidades** (`LaminaColon`, linhas 784–809 e 826–828).
   - **Geometria atual.**
     - Criptas a cada 60 un (`x: 20 + 60*k`), células de 18 un (`prof`) e luz de 7 un (`lw` = 3,5).
     - Entre duas criptas sobra uma coluna de lâmina própria de ≈17 un, 2,4× a largura da luz.
     - Na superfície, os "ombros" de raio `R = 13` ocupam 2 × 13 un de cada intervalo; com a boca de 12 un, sobram só 22 un planos.
     - A borda estriada magenta (`d.borda`) cobre esse topo.
   - **Efeito.** A 4× e a 10× (`campos/c-colon-q10-0.png`, `out/c-colon-10x-mucosa.png`), cada intervalo entre criptas vira um dedo de lâmina própria com capilares e linfócitos, revestido dos dois lados por epitélio com caliciformes e coroado por uma cúpula com borda estriada. É a mesma figura das vilosidades da lâmina `epitelio-cilindrico-intestino`. As luzes das criptas (lilás, 7 un) parecem "espaços entre vilosidades". O critério diagnóstico do texto e do his-14 ("sem vilosidades: a superfície é plana") fica contradito, e o distrator "Epitélio simples cilíndrico" (a lâmina das vilosidades) vira escolha natural no jogo.
   - **Corrigir:**
     - (a) Superfície plana e contínua entre as bocas, com `R` ≈ 4–5 (só arredondar a boca) e células da superfície da mesma altura das outras.
     - (b) Criptas mais próximas: passo ≈ 48–50 un, lâmina própria entre elas ≈ 5–8 un. As criptas é que devem dominar o campo, como "tubos de ensaio".
     - (c) Luz um pouco mais larga (≈ 8–10 un), com muco.
     - (d) Fundo da cripta em "U" arredondado (hoje as células convergem num triângulo, `arco(c.x, c.fundo, 4.5, …)`).
     - (e) Opcional: 1–2 grupos de criptas cortadas de través, como anéis de caliciformes em volta de uma luz central ("rosetas"), aspecto típico do cólon a 10×.
   - Depois do redesenho, refazer a captura `c-colon-q10-*` e reavaliar.
2. **Jogo "Qual é o tecido?": distrator defensável** (`src/modules/histologia/QualTecido.tsx`, linha 25, `LAMINAS.filter((x) => x.tecido !== l.tecido)`).
   - Para `colon` e `estomago-fundo`, o distrator "Epitélio simples cilíndrico" (`epitelio-cilindrico-intestino`) descreve corretamente o revestimento do campo. Pelo protocolo, distrator precisa ser claramente errado, não "menos certo".
   - Com 34 lâminas, o distrator aparece em ≈ 3 de cada 33 rodadas dessas lâminas (≈ 9%).
   - O mesmo vale, fora deste grupo, para `pele-fina` × "Epitélio estratificado pavimentoso queratinizado" (`pele-espessa`).
   - **Corrigir** (código, não texto): uma lista de pares incompatíveis por lâmina, ou um campo `conflitaCom` no registro `LAMINAS_RENDER`, excluído do sorteio de distratores.

**P2: mostra mal (não ensina errado, mas ensina mal)**

1. **cólon: muscular externa** (`LaminaColon`, `ySepto1 = 594` até a borda, `lisoTransversal(rng, ySepto1, H + 6, …)`, linha 880). A camada longitudinal é contínua e espessa (≥ 106 un, quase a espessura da circular, 142 un). A ressalva está no texto, mas tênias são o achado cobrado em prova. **Corrigir:** longitudinal fina (≈ 15–20 un) na maior parte do campo, com uma tênia (espessamento de ≈ 90–110 un) num trecho de ≈ 250 un. Assim a ressalva do texto passa a ser desenho.
2. **estômago: superfície com cristas largas** (`LaminaEstomago`: `fossetas = 50 + 136*k`, linha 584; `lwPit`, linha 578; `R = 26`, linha 577). As fossetas são fendas estreitas (luz de 17 un na boca e 8 un no fundo) a cada 136 un. Entre elas ficam cristas de topo plano com ≈ 67 un retos e eixo de lâmina própria de ≈ 80 un, quase o dobro da largura de uma glândula (≈ 47 un). A 4×, o quarto superior lê-se como projeções largas (pregas ou vilosidades largas), não como invaginações. **Corrigir:**
   - fossetas em funil com boca de ≈ 25–30 un;
   - ombros menores (`R` ≈ 10–12);
   - eixo de lâmina própria entre fossetas de ≈ 30–40 un, por exemplo com as fossetas mais próximas e as glândulas vizinhas chegando à fosseta por fora do plano, como diz o comentário original da função.
3. **fígado: falta a placa limitante** (`LaminaFigado`, linha 1010 `noPortal(mx, my, -6)` e linha 1013).
   - As placas são simplesmente recortadas no contorno do espaço porta. Terminam abertas, com hepatócitos cortados, e os sinusoides desembocam direto no conjuntivo (`out/c-figado-40x-portal.png`).
   - O texto (estrutura `triade-portal`) e o his-15 citam a placa limitante, cuja destruição define a hepatite de interface.
   - **Corrigir:** anel contínuo de hepatócitos inteiros, de uma célula de espessura, em volta de cada espaço porta. As placas radiais terminam nele, e os sinusoides partem dos ramos de distribuição através dele. O anel continua no grupo `placas-de-hepatocitos` (não há id próprio).
4. **pâncreas: ductos intercalados** (`LaminaPancreas`, linhas 1314–1327).
   - Cada ducto é um segmento de ≈ 24–30 un **paralelo à fronteira** entre dois ácinos vizinhos (ângulo `atan2(y2−y1, x2−x1) + π/2`), na folga de 14 un, sem ligação com a luz ou a célula centroacinosa de nenhum deles.
   - A 10× aparece como um "=" solto (`out/c-pancreas-10x-septo.png`). O texto diz que o ducto "continua as células centroacinosas".
   - **Corrigir:** tubo de ≈ 40–60 un que **sai** de um ácino com célula centroacinosa (contínuo com ela) e corre entre ácinos. Pode terminar num pequeno ducto intralobular desenhado como decoração (`Deco`), já que não há estrutura própria para ele.
5. **esôfago: ducto da glândula** (`LaminaEsofago`, linhas 457–470, `ductoNucC`). Na submucosa, muscular da mucosa e lâmina própria o ducto tem uma só fileira de núcleos de cada lado (simples cúbico). **Corrigir:** duas fileiras (luminal cúbica a cilíndrica e basal), coerente com a correção de texto. Dentro do epitélio, o revestimento achatado (`ductoNucA`) já está certo.

**P3: refinamentos (opcionais)**

1. **esôfago** (`LaminaEsofago`):
   - Ácinos mucosos com raio 15 numa grade de 31 un com jitter se sobrepõem (`out/c-esofago-40x-glandula.png`) e têm luz mínima (r 2,4). Ácinos mucosos costumam ter luz mais ampla que os serosos.
   - As intermediárias (hexágonos de raio 9,7, linhas 375–384) são todas do mesmo tamanho. No esôfago elas crescem e clareiam (glicogênio) para a superfície antes de achatar.
   - Papilas em cunha pontiaguda (`cos^1.3`, linha 338): arredondar a ponta.
2. **estômago** (`escolher`, linha 630):
   - Já há principais logo abaixo do colo: em y 228–300 são 57 principais para 86 parietais (22% da área). Reduzir quase a zero no terço superior.
   - Na base (494–545), só 6% de parietais: manter algumas espalhadas, como descrevem os livros.
   - Núcleo da mucosa do colo como traço achatado (linha 650): trocar por ovoide na base.
3. **cólon:**
   - Caliciformes com 40–52% das células da cripta (linha 806). Conferir a proporção preferida (ponto 5 em §5).
   - A teca da caliciforme ultrapassa a superfície apical em alguns pontos (`out/c-colon-40x-superficie.png`).
4. **fígado:**
   - Sinusoides quase retos e radiais (desvio de ±1,7/`rm` por passo, linha 995), com anastomoses só como "pontes" de 15%. O labirinto real é mais tortuoso.
   - Hepatócitos em "tijolo" (polígonos de lados radiais e tangenciais, até ≈ 30 un de largura): mais poligonais.
   - Kupffer como elipse lisa que enche a luz (linha 1042): forma irregular abaulando a luz, mantendo o realce declarado.
5. **pâncreas:**
   - Ilhota em grade hexagonal regular (linha 1361), não em cordões. Dispor as células em cordões ao longo dos capilares e pôr núcleos endoteliais nos capilares (linhas 1421–1423).
   - Vão de estroma irregular (10–30 un) em volta da ilhota grande, sobretudo à direita. Ácinos em favo de mel muito regular.

## 4. Etapa de patologia: o que foi olhado

- **Esôfago.** O desenho é de esôfago normal:
  - Camada basal de uma fileira (14 de 206 un) e papilas até 28–41% da espessura. Os três sinais clássicos da esofagite de refluxo são hiperplasia basal, papilas alongadas e células inflamatórias no epitélio (Maev et al. 2023).
  - Barrett com caliciformes é a definição do ACG; a BSG aceita epitélio colunar sem caliciformes. A divergência já está no his-02, e não há correção.
- **Estômago.** "Ovo frito" retirado (importante). Muco neutro × mucina ácida das caliciformes. Gastrite autoimune com perda de parietais, falta de fator intrínseco e B12 sem absorção no íleo: conferido com o his-14.
- **Cólon.**
  - Sequência adenoma–carcinoma com a via serrilhada.
  - Mucinas ácidas.
  - Hirschsprung com biópsia retal com submucosa.
  - Paneth ausente no cólon distal (his-14; a metaplasia de Paneth no cólon esquerdo é sinal de cronicidade).
- **Fígado.** Zona 3 e paracetamol/hipóxia: correto. Acrescentados colestase (tampões de bile), células estreladas (fibrose) e hepatite de interface (placa limitante); não há número clínico novo. Ferro em Kupffer × hepatócitos não é citado na lâmina.
- **Pâncreas.** Diabetes tipo 1 com destruição autoimune de β: correto. Sem correção.
- Nenhum número clínico (dose, limiar, prevalência) foi introduzido. Os números anatômicos do texto (1/4 da mucosa, 3/4 do fluxo portal) já constam do his-14 e do his-15, que registram a fonte ou a incerteza.

## 5. Pontos para o revisor humano

1. **Veredito do cólon.** A histologia ficou `reprovado` por causa do desenho (P1-1). **Atualização:** o P1 foi resolvido no redesenho v2 (§7), e a nova entrada é `aprovado-com-correcoes`; a `reprovado` fica como histórico. O texto está correto e sem correções. Na v1, desenhos P1 ficaram com `aprovado-com-correcoes` e nota. Decidir o padrão. Como `seloRevisao` mostra "Revisado por IA" se **alguma** entrada não for `reprovado`, o selo do cólon continua "revisado-ia" por causa da entrada de patologia. Se a intenção é segurar a lâmina até o redesenho, ela não deveria ir para o `main` antes disso.
2. **Jogo (P1-2).** Decidir como impedir distratores defensáveis: cólon/estômago × "Epitélio simples cilíndrico"; pele fina × "Epitélio estratificado pavimentoso queratinizado".
3. **"Cólon" × "colo".** O his-14 usa "colo", "tênia do colo" e "colo esquerdo"; a lâmina usa "cólon" no título, no tecido e no texto. Mantive "cólon", que é comum nos livros de histologia brasileiros e evita confusão com o "colo" da glândula gástrica na lâmina vizinha. Escolher um termo para a disciplina.
4. **"Espaço porta" × "espaço portal".** Adotei o termo do his-15. Confirmar a preferência.
5. **Números e fatos citados de memória:**
   - fossetas com ≈1/4 da espessura da mucosa no corpo e no fundo (Ross; incerteza já registrada no his-14);
   - núcleo da célula mucosa do colo (Junqueira: na base; Ross: tende a ser esférico);
   - proporção de caliciformes no cólon (Ross descreve as absortivas como mais numerosas na maior parte do cólon, com aumento das caliciformes para o reto; o desenho tem quase 1:1 na metade inferior das criptas);
   - glândulas cárdicas esofágicas também perto da faringe (Ross); o texto só cita as do terço distal, o que basta para esta lâmina.
6. **Ducto da glândula esofágica.** A correção se apoia numa revisão de patologia (Nie et al. 2020) com histologia normal descrita. Confirmar a formulação em Junqueira e Ross ("estratificado" × "estratificado cúbico").
7. **"Ovo frito".** Se algum professor usa a expressão para a célula parietal, decidir se vale citá-la com a ressalva (oligodendroglioma) ou manter fora, como "olho de coruja".
8. **Barrett.** O texto segue o ACG (caliciformes obrigatórias), como o his-02. Confirmar se as escolas-alvo seguem essa definição ou a da BSG.

## 6. Evidências

- **Integridade (script contra `git show HEAD:content/histologia/laminas-sistemas-b.json`):**
  - ids, `ordem`, `titulo`, `tecido`, `topicos` e ids de estruturas iguais e na mesma ordem;
  - `revisao.humano` = `null` nas 5;
  - +2 entradas em `revisao.agentes` em cada lâmina;
  - campos de texto alterados: esofago 3, estomago-fundo 3, colon 3, figado 10, pancreas 2;
  - 5 valores de `tecido` distintos.
- **`npm run validar-conteudo`** → `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.`
- **`npx vitest run`**, duas execuções:
  - primeira, logo após a edição: `Test Files 1 failed | 8 passed (9) · Tests 1 failed | 83 passed (84)`. A única falha era `toda lâmina tem desenho e todo desenho tem lâmina: pulmao: expected false to be true`, do grupo C em produção (desenho sem texto ainda), não desta revisão;
  - segunda, depois que o grupo C ganhou texto: `Test Files 9 passed (9) · Tests 84 passed (84)`, incluindo "estruturas do texto e do desenho são as mesmas" e "o campo do jogo 'Qual é o tecido?' é sorteado numa área diagnóstica dentro do SVG".
- **Contagem de células do estômago:** script `rev-lam-b/estomago_camadas.py` sobre `lam-b/campos/estomago-fundo.svg` (polígonos dos grupos `celula-*`, por faixa de y). Parietais: 26% da área na faixa 162–228 (colo, com 182 mucosas do colo), 77% em 228–300, 65% em 300–370, 56% em 370–440, 42% em 440–494 e 6% em 494–545.
- **Fontes lidas em texto integral** (curl; Europe PMC respondeu 503 e foi usado o OAI do PMC):
  - Nie L, Li W, Xue L, et al. Submucosal gland neoplasms of the esophagus: an update and review. *Esophagus*. 2020;17(4):376-384. doi:10.1007/s10388-020-00758-1 (PMID 32621256; PMC7497321). Trechos: "The intralobular duct is lined by two-layered cuboidal epithelial and myoepithelial cells, while the extralobular duct is lined by two-layered columnar epithelial and basal cells, becoming squamous cells at the opening"; "SMGs are almost composed of pure mucous acini (MA), however, serous acini (SA) can be observed occasionally".
  - Maev IV, Livzan MA, Mozgovoi SI, et al. Esophageal mucosal resistance in reflux esophagitis. *Diagnostics (Basel)*. 2023;13(16):2664. doi:10.3390/diagnostics13162664 (PMID 37627923; PMC10453919). Trechos: "The basal layer is usually represented by 1–3 layers of cells"; "The three major features of reflux esophagitis are basal cell hyperplasia, inflammatory cells in the squamous epithelium, and elongation of the lamina propria papillae."
  - Attanasio G, Caltabiano R, Amato F, et al. Beyond oligodendroglioma… *Int J Mol Sci*. 2026;27(16):7163. doi:10.3390/ijms27167163 (PMID 42653168; PMC13513445). Trecho: "The classic 'fried egg' appearance, with round nuclei and perinuclear halos, was historically regarded as highly suggestive of oligodendroglioma."
  - Cai J, Huang Y, Luo Y, et al. Differential risk and protective factors for conventional adenomas and serrated lesions. *Front Public Health*. 2026;14:1949376. doi:10.3389/fpubh.2026.1949376 (PMID 42953785; PMC13715656). Trecho: "serrated lesions … may account for approximately 15–30% of CRC cases". Usado só qualitativamente ("outra parte").
- **Capturas usadas:** as do desenhista em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/lam-b/` (app, out, campos) e a medição de toque `toque.log`. Os scripts desta revisão estão em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-lam-b/` (`editar.py`, `estomago_camadas.py`, `grepx.py`, `fontes/`), fora do repositório.

## 7. Reavaliação do desenho (v2)

- Agente: `revisor-laminas-v2` · Data: 2026-11-10.
- Objeto: redesenho do commit `cf28fe1` (só `src/modules/histologia/laminas/sistemas-b.tsx`; ids, `partes` e `areaDiagnostica` inalterados).
- Material: capturas em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/lam-b/v2/` (`cmp-*`, `cmp-recortes-*`, `cmp-colon-vs-delgado.png`, `campos-10x-depois.png`, `app/m-app-4x-10x-40x.png`, `app/m-toques-40x.png`, `depois/`, `toque.json`).
- Nenhum código foi alterado nesta etapa. O texto do cólon foi ajustado ao novo desenho (§7.3), e cada lâmina ganhou uma entrada nova em `revisao.agentes`. A entrada `reprovado` do cólon fica como histórico.

### 7.1 O P1 do cólon foi resolvido

- **Geometria nova:**
  - superfície plana: a boca da cripta só é arredondada (`R` 4,5);
  - criptas a cada 50 un, com luz de 9 un e fundo em U;
  - lâmina própria entre criptas de ≈ 8 un, menor que a luz da cripta (antes eram 17 un, 2,4× a luz);
  - planura estriada como linha fina, só no topo plano.
- **Resultado:** a 4×, a 10× e nos quatro cantos da área de sorteio, a mucosa lê-se como **tubos de ensaio paralelos** pendurados numa superfície plana, que chegam à muscular da mucosa. Na comparação lado a lado (`cmp-colon-vs-delgado.png`), não lembra mais as vilosidades da lâmina `epitelio-cilindrico-intestino`: não há cúpulas nem eixos de lâmina própria largos, e os fundos em U deixam claro que o elemento repetido é a glândula.
- **Tênia (antigo P2-1):** resolvida. A longitudinal tem 18 un e engrossa numa tênia (perfil cos², 300 un de largura).
- **Toque:** as 8 estruturas são tocáveis (`toque.json`). A área sem estrutura subiu de 3,7% para 12,5% porque a serosa foi desenhada como decoração. A serosa não está na lista de estruturas, e o texto agora a cita.

### 7.2 Situação de cada lâmina

| Lâmina | Ajustes resolvidos | Erro novo? | Veredito v2 |
|---|---|---|---|
| esofago | P2-5: ducto excretor com duas camadas de núcleos, achatado dentro do epitélio. P3 em parte: ácinos mucosos sem sobreposição e com luz maior, papilas com ponta arredondada | não | aprovado |
| estomago-fundo | P2-2: fossetas em funil a cada 104 un, ainda ≈ 1/4 da mucosa (132 de 520 un). P3: principais saem do terço superior; parietais com 90% da área de células em y 228–300, principais com 94% na base (494–545) | P3 (glândulas encostadas, sem lâmina própria entre elas) | aprovado |
| colon | P1-1 e P2-1 (acima) | P3 (trecho oblíquo com criptas encurtadas) | aprovado-com-correcoes (texto ajustado ao desenho) |
| figado | P2-3: placa limitante como anel contínuo de hepatócitos em volta de cada espaço porta. Kupffer com contorno irregular, ainda tocável (0,61%, ponto robusto na medição final de `toque.json`) | não | aprovado |
| pancreas | P2-4: ducto intercalado sai da célula centroacinosa, com epitélio cúbico baixo (0,59% da área). Capilares da ilhota com núcleos endoteliais | P3 (ducto por cima das células acinosas) | aprovado |

Contagem do estômago v2: `rev-lam-b/estomago_camadas.py` sobre `lam-b/v2/depois/estomago-fundo.svg`. Áreas de células parietais por faixa:

| y | 162–228 | 228–300 | 300–370 | 370–440 | 440–494 | 494–545 |
|---|---|---|---|---|---|---|
| parietais | 37% (colo, com 194 mucosas do colo) | 90% | 76% | 64% | 26% | 6% |

### 7.3 Correções de texto que acompanham o desenho (cólon, 2 menores)

| campo | antes | depois | motivo |
|---|---|---|---|
| `descricao` | "Esquema: a camada longitudinal externa aparece contínua, mas no cólon ela se concentra nas três tênias…" | "…e, por fora, a serosa. A camada longitudinal é delgada e se concentra nas três tênias do cólon; o campo mostra uma delas. Esquema: num trecho, junto à muscular da mucosa, as criptas aparecem cortadas de través, como anéis de células em volta da luz (corte oblíquo; as criptas acima delas não são mais curtas, só saem do plano)…" | A nota antiga ficou falsa com o desenho novo. A serosa e os anéis agora aparecem no campo e precisam de explicação. |
| `cripta-intestinal` | "Tubo reto… até perto da muscular da mucosa." | "…; cortada de través, aparece como anel de células em volta da luz." | Explica os anéis, que tocam como "Cripta". |

### 7.4 Lista que resta

**P1:** nenhum de desenho. Continua o **P1-2 do jogo** (`QualTecido.tsx`, linha 25): "Epitélio simples cilíndrico" é distrator defensável para cólon e estômago (e, fora do grupo, "Epitélio estratificado pavimentoso queratinizado" para a pele fina). É código, e o redesenho não o resolve.

**P2:** nenhum.

**P3, opcionais:**
1. **cólon, trecho oblíquo** (`LaminaColon`: `rosetaX = [640, 690, 740, 790]`, `rosetaY = 263`; criptas com `curta`, fundo 196–204).
   - As 4 criptas acima dos anéis terminam ≈ 80 un antes das outras, com o fundo em U **fechado**. Abaixo delas ficam ≈ 21 un de lâmina própria, os anéis e mais ≈ 22 un até a muscular da mucosa.
   - Na patologia, criptas que não chegam à muscular da mucosa são sinal de distorção arquitetural (colite crônica). Os anéis e a nota de texto tornam a leitura de corte oblíquo a mais provável.
   - O ideal: terminar esses 4 perfis **abertos** (parede que sai do plano, sem o U) logo acima dos anéis, ou pôr os anéis colados ao fundo de criptas de comprimento normal.
2. **cólon, tênia:** em cunha (cos²) que ultrapassa a borda do campo. Seria melhor em lente plano-convexa, com a serosa por fora.
3. **estômago, lâmina própria entre glândulas:** no corpo da mucosa (y ≈ 230–530), glândulas vizinhas se encostam. A parietal de uma toca a principal da outra, sem a faixa fina de lâmina própria com capilares. O texto diz "pouca", não "nenhuma". Deixar 3–5 un entre glândulas, com um capilar de vez em quando.
4. **esôfago:** as células intermediárias continuam do mesmo tamanho; no órgão, crescem e clareiam (glicogênio) para a superfície antes de achatar.
5. **fígado (não aplicados):** hepatócitos em tijolo; sinusoides retos e radiais demais.
6. **pâncreas:**
   - ilhota ainda em grade hexagonal, não em cordões ao longo dos capilares;
   - ácinos em favo regular (não aplicado);
   - o ducto intercalado é desenhado por cima das células acinosas (`out c-pancreas-40x-ducto2`) em vez de afastá-las. O conceito está certo: o ducto começa dentro do ácino.

### 7.5 Decisão: proporção de caliciformes do cólon

**Manter** a do redesenho: 16% na superfície, 30% na metade superior da cripta, 38% na metade inferior e nos anéis, e nenhuma no U do fundo (células-tronco e absortivas jovens).

Justificativa:
- Assim as absortivas **predominam em todos os níveis**, como no texto ("na superfície predominam as absortivas") e na descrição de Ross (de memória: absortivas mais numerosas na maior parte do cólon).
- As caliciformes continuam visivelmente mais numerosas que no intestino delgado e aumentam em profundidade.
- Kim e Ho (*Curr Gastroenterol Rep* 2010, PMC2933006, texto integral) dão a média de todo o epitélio: "The proportion of goblet cells among epithelial cell types increases caudally from duodenum (4%) to distal colon (16%)". O dado vem em boa parte de estudos experimentais e não separa cripta de superfície, por isso não justifica reduzir as criptas. Textos de patologia descrevem as caliciformes como muito numerosas no terço inferior das criptas humanas, sobretudo no cólon esquerdo e no reto.

Não reduzir abaixo de ≈ 25% nas criptas (o cólon perderia o aspecto característico) nem passar de ≈ 40% (as caliciformes passariam a predominar, contra o texto).

**Revisor humano:** confirmar a proporção preferida pela disciplina (item 5 de §5).

### 7.6 Evidências (v2)

- `npm run validar-conteudo` → `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.`
- `npx vitest run` → `Test Files 10 passed (10) · Tests 96 passed (96)`.
- `revisao.agentes`: cada lâmina tem agora 3 entradas (histologia v2, patologia v2 e reavaliação do desenho v2). `revisao.humano` continua `null`.
