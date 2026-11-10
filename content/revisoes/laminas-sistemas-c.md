# Revisão por agente: microscópio virtual, grupo C (respiratório, urinário, endócrino e reprodutor), etapas histologia e patologia

- Agentes: `revisor-laminas-v2` (1ª etapa, histologia) e `revisor-laminas-patologia-v2` (2ª etapa, patologia, com conferência de fonte primária) · Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md` (rigor de cada afirmação, terminologia dos tópicos, mudança mínima, ids intocados, registro em `revisao.agentes`, relatório; fontes lidas com curl nas APIs do PubMed e do Europe PMC, sem WebFetch). Mesmo padrão e mesma escala P1/P2/P3 de `laminas-histologia.md`, `laminas-sistemas-a.md` e `laminas-sistemas-b.md`.
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nas 7 lâminas.
- Escopo:
  - **Texto** (editado): `content/histologia/laminas-sistemas-c.json`, lâminas `pulmao`, `rim-cortex`, `tireoide`, `adrenal`, `testiculo`, `ovario`, `utero-proliferativo`. Li título, tecido, órgão, coloração, descrição, destaques e cada estrutura, e conferi tudo contra Junqueira 14ª ed., Ross 8ª ed. e os tópicos his-16 a his-20 (nomes, definições, `notasDivergencia`, `incertezas` e correlações).
  - **Desenho** (só avaliado, **nenhum código alterado**): `src/modules/histologia/laminas/sistemas-c.tsx`, versão do commit `abf42e0`, que não mudou durante a revisão. Usei as capturas do desenhista em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/lam-c/`:
    - `app/m-h*.png`, `app/h*-<id>.png`, `app/toque40-*.png`;
    - `full-<id>.png` e os recortes `c-<id>-*.png`;
    - `toque-<id>.json`.
  - Regerei os SVGs a partir do código atual (mesmo resultado de toque) e medi a composição dos campos do jogo (§3 e §9).
  - As capturas `app/ident-<id>.png` mostram só a tela final do jogo ("0 de 3 estruturas encontradas") e não documentam o fluxo de identificação. Por isso o toque foi avaliado pelas medições.
- Não mudaram: ids das lâminas, `ordem`, `titulo`, `tecido`, `orgao`, `coloracao`, `topicos` e os ids e a ordem das `estruturas`. Conferido por script contra a cópia anterior à revisão (§9).

## 1. Resumo

Gravidades: **crítica** = fato errado; **importante** = afirmação imprecisa que o aluno levaria como fato, ou contradição com o desenho ou com o tópico; **menor** = redação, terminologia, precisão, ponte com a patologia.

| Lâmina | Histologia (crít./imp./men.) | Patologia (acréscimos menores) | Veredito histologia | Veredito patologia | Desenho |
|---|---|---|---|---|---|
| pulmao | 0 / 1 / 5 | 3 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3) |
| rim-cortex | 0 / 0 / 3 | 2 | aprovado-com-correcoes | aprovado-com-correcoes | **ajustar (P2-1, P2-2)** |
| tireoide | 0 / 0 / 1 | 2 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3) |
| adrenal | 0 / 0 / 1 | 3 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3) |
| testiculo | 0 / 0 / 4 | 3 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3) |
| ovario | 0 / 0 / 5 | 2 | aprovado-com-correcoes | aprovado-com-correcoes | ok (P3) |
| utero-proliferativo | 0 / 0 / 0 | 2 | aprovado | aprovado-com-correcoes | **ajustar (P2-3)** |
| **Total** | **0 / 1 / 19** | **17** | | | 0 P1 de desenho · 1 P1 de jogo |

São **37 correções** em 38 campos (a troca "club" → "clube" toca 4 campos e conta como uma), sem nenhum erro crítico.

- **Correção importante:** a descrição do pulmão dizia que "as proporções seguem a escala de 1 un ≈ 1 µm". Só as células e as hemácias seguem essa escala. Alvéolos (90–120 un) e vias aéreas têm cerca de metade do tamanho real; no adulto, o alvéolo médio equivale a uma esfera de ≈ 200 µm (Ochs 2004, §8).
- **Desenhos:** **nenhum ensina errado (P1)**, e nenhuma etapa de histologia ficou `reprovado`. Os problemas são de fidelidade:
  - rim: TCD demais (41 perfis para 56 de TCP) e núcleos do tufo glomerular ao acaso (P2-1, P2-2);
  - útero: mitoses raras (9 no campo inteiro) (P2-3).
- **O problema mais sério do grupo é de jogo (P1-J).** Em três lâminas, a resposta de uma lâmina antiga também descreve o campo sorteado:
  - "Epitélio simples cúbico" em `rim-cortex` e `tireoide`;
  - "Epitélio simples cilíndrico" e, em 17% dos campos, "Tecido muscular liso" em `utero-proliferativo`.
  - O código já tem `distratoresExcluidos` (`src/modules/histologia/regras.ts`, `distratoresPossiveis`). Falta preencher o campo para estas lâminas (§3).
- **Ids:** dois precisam de nome próprio:
  - `capsula` da adrenal: no registro, vale a definição de órgão linfoide do his-12;
  - `tunica-albuginea` do ovário: no registro, vale a definição testicular de emb-17 e his-19.
  - `veia-central` também deveria ganhar nome próprio (§5).

### Conferido e correto (sem mudança)

Itens que o desenhista pediu para conferir, com o resultado:

- **Pulmão:**
  - Tipo I achatado, de núcleo alongado, cobrindo a maior parte da superfície. Tipo II cúbico, saliente, nos cantos, com citoplasma de vacúolos claros (5 "bolhas" por célula).
  - Bronquíolo sem cartilagem nem glândulas, com células clube em cúpula e anel de músculo liso.
  - Bronquíolo respiratório com parede de epitélio cúbico e músculo liso, interrompida por aberturas de alvéolos.
  - Ducto alveolar com **botões de músculo liso** nas pontas dos septos (`botoes`, linhas 561–581). Os sacos, nas duas extremidades (`sacos`, linha 405), têm pontas arredondadas sem músculo, coerente com o his-16.
  - Ramo da artéria pulmonar na mesma bainha do bronquíolo.
  - Macrófagos com pigmento na luz.
  - Septos de ≈ 7–12 un, ou seja, sem aspecto de espessamento.
- **Rim:**
  - TCP: eosinófilo, de limites pouco nítidos, com 4–6 núcleos em anel a 64% do raio, borda em escova e luz estrelada.
  - TCD: claro, de limites nítidos, com mais núcleos e luz ampla.
  - Mácula densa: no TCD (333, 171), entre as duas arteríolas, a ≈ 8 un do polo vascular, com células altas e núcleos apinhados.
  - Arteríolas: a aferente é mais calibrosa (luz 17 un × 14 un da eferente). As células justaglomerulares estão **na média** da aferente (`arteriolaLongitudinal`, `jgCel` entre `hl` e `hw`, linha 852), com o endotélio por dentro.
  - O espaço urinário fica entre o tufo e o folheto parietal.
- **Tireoide:**
  - Células C entre a lâmina basal e os tirócitos, sem contato com o coloide: há 2,7 un de citoplasma de tirócito entre a célula C e o coloide (linha 1236). Também aparecem em grupos interfoliculares, com realce declarado.
  - Vacúolos de reabsorção encostados na superfície apical, com a ressalva de artefato.
  - Epitélio mais baixo nos folículos grandes (h = 7 com r > 70).
- **Adrenal:**
  - Fasciculada é a zona mais espessa (63% do córtex no desenho).
  - Cordões de 1–2 células, com espongiócitos espumosos, alguns binucleados.
  - Reticular anastomosada, acidófila, com lipofuscina e núcleos picnóticos.
  - Medula basófila **sem cápsula** separando-a do córtex. A fronteira é irregular, mas tem uma faixa clara contínua (P3-4).
  - Veia central com **feixes longitudinais excêntricos** fora da íntima. É o que descreve Barenthin (1975): "incomplete, eccentric, and located far from the intima" (§8).
- **Testículo:**
  - Ordem correta da base para a luz: espermatogônias (A escura e clara) a 7 un da lâmina basal, núcleos de Sertoli a 12,5 un, espermatócitos com cromatina filamentosa, espermátides redondas e alongadas (cabeça para a base, flagelo para a luz) e flagelos na luz.
  - Sertoli: núcleo claro e ovoide, com eixo maior radial e **nucléolo evidente**.
  - Leydig poligonais, eosinófilas, com vacúolos, junto a capilares do interstício.
  - Células mioides achatadas na túnica própria.
- **Ovário:**
  - Classificação completa: primordial (ovócito ≈ 27 un), primário unilaminar (ovócito 42 un, zona fina, granulosa cúbica), multilaminar (zona de 4 un, granulosa estratificada, teca em formação) e secundário/antral de ≈ 390 un.
  - O folículo antral tem antro com precipitado, cúmulo, corona radial, zona pelúcida de 7 un, lâmina basal, teca interna com capilares e **teca externa desenhada** (sem toque, declarado).
  - Ovócito antral de 104 un: compatível com o ovócito humano, que já passa de 100–110 µm quando o antro se forma (§8).
- **Útero:**
  - Glândulas retas e estreitas, com núcleos em alturas diferentes (pseudoestratificação mais visível nos perfis transversais).
  - **Nenhum vacúolo subnuclear e nenhuma secreção.**
  - Estroma denso de núcleos fusiformes, camada basal mais densa, grupos de 2–3 perfis de artérias espiraladas na funcional profunda.
  - Miométrio sem submucosa, em feixes cortados ao comprido e de través, com vasos.

## 2. Tabela de correções de texto

### Importante (1)

| lâmina | campo | antes | depois | motivo | fonte |
|---|---|---|---|---|---|
| pulmao | `descricao` | "Esquema: as proporções seguem a escala de 1 un ≈ 1 µm, mas no corte real os septos têm mais núcleos…" | "Esquema: as células e as hemácias seguem a escala de 1 un ≈ 1 µm, mas os alvéolos e as vias aéreas estão desenhados menores que no pulmão adulto, para caberem juntos no campo; no corte real…" | No desenho, alvéolos de 90–120 un e bronquíolo de 224 un de diâmetro externo. O alvéolo adulto tem volume médio de 4,2 × 10⁶ µm³, que corresponde a uma esfera de ≈ 200 µm (cálculo: (6V/π)^⅓ = 200,2 µm). O aluno levaria "1 un = 1 µm" como tamanho real dos alvéolos. | Ochs et al., *Am J Respir Crit Care Med* 2004, PMID 14512270 (§8) |

### Menores da etapa de histologia (19)

| lâmina | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| pulmao | `descricao`, `destaques[0]`, `bronquiolo`, `bronquiolo-respiratorio` | "células club" | "células clube" | Termo do his-16 (`celula-clube`; "club" e "Clara" como sinônimos/antigo). | his-16 |
| pulmao | `alveolo` | "(no esquema, de 90 a 120 µm)" | + "no adulto, o volume médio de um alvéolo equivale ao de uma esfera de cerca de 200 µm" | Complementa a correção importante, para o aluno não tomar o tamanho do esquema como real. | Ochs 2004 |
| pulmao | `capilar.nome` | "Capilar" | "Capilar alveolar" | Nome do his-16. | his-16 |
| pulmao | `pneumocito-tipo-i` | "(cerca de 95%)" | "(mais de 90%)" | O his-16 diz "mais de 90%" e registra a divergência: livros ≈ 95% × Crapo 1982 ≈ 93%. | his-16 (`notasDivergencia`) |
| pulmao | `pneumocito-tipo-i` | "não se divide" | "em geral não se divide e é reposta a partir do tipo II" | Formulação menos absoluta, coerente com o tipo II "progenitor após lesão" (his-16). | his-16 |
| pulmao | `pneumocito-tipo-ii` | "É tão ou mais numerosa que o tipo I, mas cobre só cerca de 5%" | "É mais numerosa que o tipo I, mas cobre menos de 10%" | His-16: o tipo I é "menos numeroso" que o II. Crapo: tipo II 16% das células, 7% da superfície. | his-16 (`notasDivergencia`) |
| rim-cortex | `espaco-urinario.nome` | "Espaço urinário (de Bowman)" | "Espaço urinário (espaço capsular, de Bowman)" | O nome do his-17 é "Espaço capsular". | his-17 |
| rim-cortex | `tubulo-contorcido-proximal` | "normalmente, toda a glicose" | "quase toda a glicose" | His-17: "quase toda". | his-17 |
| rim-cortex | `tubulo-contorcido-distal` | "Reabsorve sódio e cloreto; … sob ação da aldosterona, troca sódio por potássio e H+" | "Reabsorve sódio, cloreto e cálcio (este sob PTH); … a aldosterona aumenta a reabsorção de sódio e a secreção de potássio e H+" | Faltava o cálcio do his-17. "Troca" sugeria um trocador 1:1; são processos em células diferentes (principal e intercalada). | his-17 |
| tireoide | `destaques[1]` | "O hormônio fica armazenado fora da célula, no coloide, caso único entre as glândulas endócrinas." | "… no coloide, como parte da tireoglobulina: é a única glândula endócrina que guarda grande quantidade de hormônio fora das células." | Redação do his-18 ("grande quantidade"). O hormônio armazenado está na tireoglobulina, não livre. | his-18 (`incertezas`) |
| adrenal | `descricao` (Esquema) | "as espessuras foram comprimidas…; na glândula real a fasciculada ocupa cerca de dois terços do córtex, e a glomerulosa e a reticular são bem mais finas" | "…comprimidas…, e a reticular ficou proporcionalmente mais espessa; na glândula real a fasciculada ocupa cerca de três quartos do córtex, a glomerulosa cerca de 15%, e a reticular fica com o restante" | O número não batia com a fonte (75%). O texto dava a entender que o desenho falseava a fasciculada, mas o que destoa é a reticular: no desenho, glomerulosa 13%, fasciculada 63% e reticular 24% (y 26–93, 93–420, 420–542). | Long e Azizan, *Front Endocrinol* 2025, PMC12832385 (§8) |
| testiculo | `descricao`; `celula-mioide-peritubular.nome` | "lâmina própria com células mioides" | "túnica própria (lâmina própria)"; nome "Túnica própria com células mioides peritubulares" | Termo do his-19 (`tubulo-seminifero`: "túnica própria"). | his-19 |
| testiculo | `celula-mioide-peritubular` | "camadas de células mioides achatadas, contráteis" | "…achatadas e contráteis (no esquema, uma só camada)" | O desenho tem um só anel de núcleos (linha 1615). No ser humano são várias camadas. | his-19; desenho |
| testiculo | `espermatocito` | "cromatina em filamentos grossos, porque passa semanas na prófase…" | "cromatina em filamentos grossos (cromossomos na prófase I); como essa prófase dura semanas, é a célula em meiose mais vista no corte" | O texto punha a duração como causa do aspecto. A duração explica a frequência no corte (his-19). | his-19 (`espermatocito`) |
| testiculo | `destaques[1]` | "inibina" | "inibina B" | Termo do his-19. | his-19 |
| ovario | `epitelio-superficial-do-ovario.nome` | "Epitélio superficial (simples cúbico)" | "Epitélio de revestimento do ovário (simples cúbico)" | Nome do his-20. | his-20 |
| ovario | `foliculo-primordial` | "Ovócito primário (≈ 25–30 µm)" | "(cerca de 30–35 µm; no esquema, ≈ 27 µm)" | A fonte lida dá 35 µm para o ovócito do folículo primordial humano. A faixa 25–30 vinha de memória dos livros (§7, item 6). | Pors et al. 2022, PMC9596637 (§8) |
| ovario | `foliculo-secundario.nome` | "Folículo secundário (antro)" | "Folículo secundário (antral)" | "(antro)" parecia nomear a cavidade, não o folículo. "Antral" é o sinônimo do his-20. | his-20 |
| ovario | `ovocito-primario` | "(no esquema ≈ 100 µm)" | + "no ovário humano, já passa de 100–110 µm quando o antro se forma e chega a cerca de 110–120 µm, seu tamanho final" | Pedido do desenhista: os 104 un do esquema são compatíveis com um folículo antral inicial. | Pors et al. 2022 |
| ovario | `destaques[0]` | classificação sem ressalva | + "Atenção: parte da literatura chama de secundário o folículo pré-antral multilaminar e de terciário o antral; aqui, secundário = antral." | A divergência está no his-20 (`notasDivergencia`). Sem a ressalva, o aluno erra questões que usam a outra nomenclatura (§7, item 5). | his-20; Griffin et al. 2006 (§8) |

### Acréscimos da etapa de patologia (17, todos menores)

Todos estão alinhados às correlações dos tópicos e não trazem número clínico.

| lâmina | campo | acréscimo (resumido) | fonte |
|---|---|---|---|
| pulmao | `septo-interalveolar` | enfisema: destruição das paredes distais ao bronquíolo terminal, sem fibrose evidente | his-16 (`enfisema`) |
| pulmao | `pneumocito-tipo-ii` | falta de surfactante no prematuro (membranas hialinas, SDR do recém-nascido); o tipo II prolifera no dano alveolar difuso | his-16 (`doenca-membrana-hialina`) |
| pulmao | `macrofago-alveolar` | nome "células da insuficiência cardíaca" | his-16 (`macrofago-alveolar`, `congestao-pulmonar-celulas-ic`) |
| rim-cortex | `tubulo-contorcido-proximal` | segmento mais atingido na necrose tubular aguda; perda da borda em escova, descamação | his-17 (`necrose-tubular-aguda`) |
| rim-cortex | `espaco-urinario` | crescentes (folheto parietal, macrófagos, fibrina) nas glomerulonefrites graves | his-17 (`sindrome-nefritica`) |
| tireoide | `coloide` | Graves: coloide escasso, pálido, recortado; epitélio cilíndrico alto | his-18 (`doenca-de-graves`) |
| tireoide | `tirocito` | Hashimoto: infiltrado linfoplasmocitário com folículos linfoides; células de Hürthle | his-18 (`tireoidite-de-hashimoto`) |
| adrenal | `zona-glomerulosa` | não depende do ACTH: preservada no glicocorticoide exógeno e no tumor cortical, produz aldosterona na insuficiência central, destruída na doença de Addison | his-18 (`sindrome-de-cushing`, `insuficiencia-suprarrenal`) |
| adrenal | `zona-fasciculada` | hiperplasia (com a reticular) no excesso de ACTH; atrofia sob glicocorticoide exógeno | his-18 (`sindrome-de-cushing`) |
| adrenal | `celula-cromafim` | origem do feocromocitoma | his-18 (`feocromocitoma`) |
| testiculo | `espermatogonia` | GCNIS: células grandes e atípicas, de citoplasma claro, junto à lâmina basal | his-19 (`criptorquidia-gcnis`) |
| testiculo | `celula-de-sertoli` | síndrome de células de Sertoli isoladas (azoospermia) | his-19 (`infertilidade-masculina-biopsia`) |
| testiculo | `celula-de-leydig` | Klinefelter: túbulos hialinizados, aglomerados de Leydig | his-19 (idem) |
| ovario | `teca-interna` | SOP: teca interna hiperplásica e luteinizada, andrógenos em excesso | his-20 (`sindrome-ovarios-policisticos`) |
| ovario | `celulas-da-granulosa` | tumor de células da granulosa: estrogênio, hiperplasia endometrial | his-20 (`hiperplasia-endometrial`) |
| utero-proliferativo | `glandula-endometrial` | hiperplasia endometrial (relação glândula/estroma aumentada; atipia = EIN, precursora do carcinoma endometrioide) | his-20 (`hiperplasia-endometrial`) |
| utero-proliferativo | `miometrio` | sem submucosa, a basal pode invadir o miométrio: adenomiose | his-20 (`endometriose-adenomiose`) |

## 3. Resposta do jogo "Qual é o tecido?" (campo `tecido`)

As 7 respostas estão corretas e são inequívocas como **nome**. As 34 respostas de `laminas*.json` continuam distintas. Mas a lista de distratores exclui só o mesmo texto e as lâminas de `distratoresExcluidos` (`regras.ts`, `distratoresPossiveis`). Medi a composição dos 121 campos de 10× de uma grade 11 × 11 sobre cada área de sorteio (`areaDiagnostica` ou `AREA_PADRAO`), com círculo de 150 un e centro limitado como no `Visor` (método em §9).

| lâmina (área) | o campo garante (mín. do campo; % dos campos) | resposta de outra lâmina que também descreve o campo |
|---|---|---|
| pulmao (padrão) | alvéolo ≥ 18,3% e septo ≥ 2% em 100%; bronquíolo ou bronquíolo respiratório em 50% | "Epitélio simples cúbico": só o epitélio dos bronquíolos, numa parte pequena do campo. Fraco (opcional) |
| rim-cortex [280,260,400,400] | corpúsculo (tufo + espaço + cápsula) ≥ 43,9% em 100%; túbulos 8,2–34,3% em 100% | **"Epitélio simples cúbico"** (`epitelio-cubico-rim`): TCP e TCD são epitélio simples cúbico em 100% dos campos |
| tireoide (padrão) | coloide ≥ 20%, tirócitos ≥ 22% em 100%; células C em 76% | **"Epitélio simples cúbico"**: tirócitos em 100% dos campos; o próprio texto da lâmina antiga cita os "folículos da tireoide" como exemplo |
| adrenal [250,160,750,420] | fasciculada ≥ 40% em 100%; reticular em 55%, medula em 12% | nenhuma |
| testiculo (padrão) | epitélio seminífero completo e Leydig ≥ 5,5% em 100% | nenhuma |
| ovario (padrão) | algum folículo ≥ 7% em 100%; antral em 57%; epitélio superficial em 0% | nenhuma. Nos piores campos, a 350,290, só há primordial e primário em estroma (93% sem toque), o que ainda é ovário. A área opcional [480,330,750,480] garante o antral (≥ 27%) em 100%, mas sempre mostra o mesmo folículo |
| utero-proliferativo [200,170,800,400] | glândulas ≥ 21,9% e funcional ≥ 31,9% em 100%; miométrio em 17,4% (até 11,6%) | **"Epitélio simples cilíndrico"** (`epitelio-cilindrico-intestino`) em 100%: glândulas e superfície; **"Tecido muscular liso"** (`musculo-liso`) em 17%; "Epitélio pseudoestratificado cilíndrico ciliado" é discutível (glândulas com "aspecto pseudoestratificado" e superfície com algumas ciliadas) |

**Rim × lâmina antiga `epitelio-cubico-rim`.** No sentido inverso, a lâmina antiga já exclui `rim-cortex` (`index.ts`, linha 41, alteração de outra sessão durante esta revisão). Falta este sentido.

**Útero × `musculo-liso`.** A área [200, 170, 800, 350] tira o miométrio de todos os campos (≤ 0,4%), mantendo glândulas ≥ 26,9% e funcional ≥ 42,3%. Essa mudança de área resolve o conflito sem excluir o distrator.

Correções propostas (código, P1-J em §4).

## 4. Desenhos: avaliação por lâmina e lista de ajustes

Critério das revisões anteriores: o esquema precisa mostrar os **aspectos diagnósticos** que o texto e os tópicos cobram, sem induzir erro. Não se exige fotorrealismo. Coordenadas do SVG (1000 × 700) e linhas de `src/modules/histologia/laminas/sistemas-c.tsx` (commit `abf42e0`). Os ajustes são **propostos**; nenhum código foi alterado.

| Lâmina | Toque (menor área; disco inscrito) | Veredito do desenho |
|---|---|---|
| pulmao | 9/9; macrófago 0,26% (7 un), tipo I 1,04% (3 un, com alvo ampliado), tipo II 0,66% (5 un) | ok (P3-1) |
| rim-cortex | 9/9; mácula densa 0,11% (7 un), eferente 0,67%, cápsula 2,17% (faixa transparente de 10 un) | ajustar (P2-1, P2-2; P3-2) |
| tireoide | 6/6; folículo 9,9% como faixa de borda (3 un) | ok (P2-4 de jogo; P3-3) |
| adrenal | 8/8; veia central 2,15% (27 un) | ok (P3-4) |
| testiculo | 9/9; mioides 7% (3 un), espermátide 5,9% (5 un) | ok (P3-5) |
| ovario | 9/9; zona pelúcida 0,35% (3 un ≈ 19 px a 40×), epitélio 1,38% | ok (P3-6) |
| utero-proliferativo | 7/7; artéria espiralada 0,58% (7 un) | ajustar (P2-3) |

Todas as 57 estruturas têm área de toque. As menores são alcançáveis a 40×. A zona pelúcida (anel de 7 un, ≈ 22 px a 40×) é a mais apertada (P3-6).

### P1: ensina errado ou contradiz o texto ou o tópico

- **Desenho: nenhum.**
- **P1-J (jogo, não é desenho): distratores defensáveis.** É o mesmo tipo de problema do P1-2 do grupo B. Por isso a etapa de histologia não foi reprovada, como no estômago do grupo B. Corrigir em `LAMINAS_SISTEMAS_C` (linhas 2276–2287), com o campo que já existe:
  - `'rim-cortex'`: `distratoresExcluidos: ['epitelio-cubico-rim']`;
  - `tireoide`: `distratoresExcluidos: ['epitelio-cubico-rim']`;
  - `'utero-proliferativo'`: `distratoresExcluidos: ['epitelio-cilindrico-intestino', 'musculo-liso']` e, por decisão do revisor humano, `'epitelio-pseudoestratificado-traqueia'`. Para `musculo-liso`, a alternativa é a área `[200, 170, 800, 350]` (§3);
  - opcional: `pulmao`: `['epitelio-cubico-rim']`.

### P2: mostra mal (não ensina errado, mas ensina mal)

1. **rim-cortex: TCD demais** (`LaminaRimCortex`).
   - `tubSem` (linha 894) sorteia o raio por tentativa (80% de 33–37 un, 20% de 24–27 un). Os perfis pequenos (TCD) entram mais nas folgas, e `proximais`/`distais` são separados pelo raio (linha 899).
   - Resultado: **56 perfis de TCP para 41 de TCD** com centro no campo (58% contra os 70% pretendidos no comentário da linha 875). TCP ocupa 37,9% da área e TCD 19,9%. Nos campos do jogo, TCP e TCD têm a mesma área (9,8% × 9,4%).
   - O texto e o his-17 dizem que os perfis de TCP predominam. O TCP é o segmento mais longo do néfron, e no córtex real os perfis de TCD são bem mais raros.
   - **Corrigir:** classificar como TCD só uma fração fixa dos túbulos (≈ 1 a cada 5–6), independente do raio; ou semear primeiro os TCP e depois um número fixo de TCD (≈ 8–10 no campo), preenchendo as folgas com TCP menores.
2. **rim-cortex: tufo glomerular** (linhas 1091 e 1097).
   - As alças são dardos de raio 5–8 com folga 2, e sobra ≈ 45% de matriz rosa no tufo (`c-rim-cortex-40x-glomerulo.png`). Os núcleos (`nucTufo`) caem ao acaso nessa matriz, muitas vezes em grupos de 3–4.
   - O texto diz que os podócitos ficam "na superfície, voltados para o espaço urinário" e os mesangiais "no eixo dos lóbulos". O desenho não mostra nem uma coisa nem outra.
   - Na etapa de patologia, matriz abundante com grupos de ≥ 3–4 núcleos é o que se descreve como expansão ou hipercelularidade mesangial.
   - **Corrigir:**
     - alças mais compactas (folga ≈ 0,8, mais tentativas), ocupando ≈ 60–70% do tufo;
     - núcleos de podócito na borda externa dos lóbulos (`lob`), salientes para o espaço urinário;
     - 1–2 núcleos mesangiais no centro de cada lóbulo;
     - núcleos endoteliais encostados na parede das alças.
3. **utero-proliferativo: mitoses raras** (`glandula`, linha 2065: `rng() < 0.012 && nMitose < 6`; estroma, linha 2164: `n < 3`).
   - São **9 mitoses no campo inteiro** (6 em 1.603 células glandulares; 3 no estroma), pequenas (traço de 3,2 × 1,1 un) e quase invisíveis a 10×.
   - O texto e o his-20 dão as mitoses como sinal da fase proliferativa, ao lado das glândulas retas.
   - **Corrigir:**
     - ≈ 1 mitose a cada 2–3 perfis glandulares (probabilidade ≈ 0,04, limite ≈ 25) e ≈ 8–10 no estroma;
     - figura maior (placa de ≈ 5 × 1,6 un, halo de ≈ 4 × 6 un), na metade apical da célula, como já está (`ep.meio(k, 0.72)`).
   - **Opcional:** pseudoestratificação mais nítida nas glândulas cortadas ao comprido. Hoje os núcleos variam de 32% a 66% da altura (`entre(rng, 0.32, 0.66)`, linha 2072), e a 40× parecem quase alinhados (`c-utero-proliferativo-40x-glandula.png`). Usar 0,2–0,75 e permitir encostar (ocupação de 2,6 → ≈ 1,8).
4. **Jogo "Identifique na lâmina": estruturas aninhadas sem `contem`.**
   - Nenhuma lâmina do grupo C declara `contem`. Com isso, um toque na parte conta erro quando o alvo é o todo. Exemplos:
     - pedir "Folículo tireoidiano", cuja área é só a faixa da lâmina basal (linha 1310), e o aluno tocar o coloide ou um tirócito;
     - pedir "Medula da suprarrenal", cuja área são as fendas entre as células, e tocar uma célula cromafim;
     - pedir "Folículo secundário", cuja área é só o antro, e tocar a granulosa ou o ovócito;
     - pedir "Septo interalveolar" e tocar um capilar.
   - **Corrigir** (padrão do grupo A):
     - tireoide: `contem: { 'foliculo-tireoidiano': ['coloide', 'tirocito'] }` (sem células C, que também existem fora dos folículos);
     - adrenal: `{ 'medula-suprarrenal': ['celula-cromafim', 'veia-central'] }`;
     - ovario: `{ 'foliculo-secundario': ['ovocito-primario', 'zona-pelucida', 'celulas-da-granulosa', 'teca-interna'] }`;
     - pulmao: `{ 'septo-interalveolar': ['capilar', 'pneumocito-tipo-i', 'pneumocito-tipo-ii'] }`;
     - utero: `{ 'endometrio-funcional': ['glandula-endometrial', 'arteria-espiralada'], 'endometrio-basal': ['glandula-endometrial'] }`, em que a glândula conta pela camada sob o toque (`toqueAceito` com `pilha`).

### P3: refinamentos (opcionais)

1. **pulmao** (`LaminaPulmao`):
   - Saco alveolar sem id próprio. Os dois sacos (`sacos`, linha 405: (950, 250, r 42) e (798, 556, r 40)) somam ≈ 1,5% da lâmina e caberiam como estrutura `saco-alveolar` (§6).
   - Cantos dos septos em triângulos grandes (arredondamento de `chaikin` nas junções).
   - Só 2 aberturas de alvéolo por lado no bronquíolo respiratório (`aberturas`, linha 591). Com 3–4, o caráter "interrompido" ficaria mais claro.
2. **rim-cortex:**
   - Células justaglomerulares em faixa de ≈ 40 × 8 un dentro da aferente (linha 852), sem área própria (§6).
   - O folheto parietal já tem faixa de toque ampliada. Fazer o mesmo se as justaglomerulares ganharem id.
3. **tireoide** (linha 1236): a célula C isolada (`cx = b.x + b.nx * 4`, elipse de 5,3 un no sentido radial) passa 1,3 un para fora do contorno da lâmina basal (linha `Deco` de `contornos`) e parece montada nela (`c-tireoide-40x-b.png`). **Corrigir:** `* 5.5` e altura do epitélio de 12 → 13 nesses folículos (linha 1218). A célula fica dentro da lâmina basal e longe do coloide, como diz o texto.
4. **adrenal** (`LaminaAdrenal`):
   - Reticular com 24% do córtex (`yR` 420 → `yM` 542, linhas 1345–1346). O real é ≈ 10%, e agora isso está declarado no texto. Aproximar `yM` de ≈ 480 se couber a rede anastomosada.
   - Glomerulosa como fileira regular de "bolas" quase circulares (`a` 28–31, `b` 33,5, passo 62–68; linha 1359). Variar o tamanho e incluir arcos.
   - Faixa clara contínua na junção corticomedular (`furosM` só abaixo de `yM + 14`, linha 1459). Interdigitar cordões da reticular com grupos de células cromafins, para não sugerir um limite.
5. **testiculo:** uma só camada de células mioides (`mioides`, linha 1615). Ao acrescentar um segundo anel em `R + 5,5`, o desenho fica coerente com "camadas" (ser humano). O texto já declara o esquema.
6. **ovario:**
   - Teca externa, cúmulo oóforo e corona radiata estão desenhados, mas não têm id. Os três existem no his-20 (`teca-externa`, `cumulus-oophorus`, `corona-radiata`) e são clássicos de prova (§6).
   - Zona pelúcida com toque apertado (anel de 7 un). Acrescentar uma faixa transparente de ≈ 3 un de cada lado.
   - Teca interna mostrada só por núcleos e capilares, sem citoplasma epitelioide claro.

## 5. Ids que o desenhista criou fora dos tópicos

`estruturas()` (`src/content/index.ts`) guarda a definição do **primeiro** tópico carregado que tem o id. O app pré-carrega a embriologia, então emb-* vem antes de his-*. Hoje o registro só é lido pelo Lab3D (`src/modules/embriologia/Lab3D.tsx`), mas deve servir a outros usos. O microscópio mostra a descrição da própria lâmina.

| lâmina | id atual | definição que o registro mostraria | proposta |
|---|---|---|---|
| adrenal | `capsula` | his-12: "Envoltório de conjuntivo denso dos órgãos linfoides encapsulados (timo, linfonodo, baço)…" (também usado por linfonodo, baço e timo) | **renomear para `capsula-suprarrenal`** (necessário) |
| adrenal | `veia-central` | nenhuma (nenhum tópico tem o id); o fígado usa `veia-centrolobular`, mas "veia central" é o nome comum da centrolobular | **renomear para `veia-central-suprarrenal`** (recomendado, evita colisão futura); o his-18 cita a veia na definição de `medula-suprarrenal` e poderia ganhar a estrutura |
| ovario | `tunica-albuginea` | emb-17: "…separa os cordões testiculares do epitélio superficial; marca morfológica precoce do testículo" (ou a do his-19, testicular) | **renomear para `tunica-albuginea-ovariana`** (necessário); o `testiculo` mantém `tunica-albuginea` |
| tireoide | `septo-conjuntivo` | his-03: "…divide a glândula em lobos e lóbulos, levando vasos, nervos e **ductos excretores**" | manter o id; o problema é a definição do his-03, glandular exócrina, que vale também para timo, pâncreas e tecido adiposo. Proposta: generalizar no his-03 ("…vasos, nervos e, nas glândulas exócrinas, os ductos excretores") ou criar `septo-tireoidiano`. Fora do escopo desta revisão |
| rim-cortex | `capilar` | his-02: "Vaso de parede fina, formado por endotélio…, situado no conjuntivo sob o epitélio…" | manter: é o id canônico genérico, com definição própria em cada lâmina (decisão registrada nas `incertezas` do his-17) e usado em 9 lâminas |
| utero-proliferativo | `epitelio-simples-cilindrico` | his-02: definição genérica do tipo de epitélio (exemplos sem o útero) | manter: genérico e correto; o cólon usa o mesmo id |
| utero-proliferativo | `lumen` | his-02: "Espaço interno de um órgão oco, túbulo ou ducto…" | manter: genérico e correto |

## 6. Ids do tópico deixados de fora: a ausência prejudica o ensino?

- **`saco-alveolar` (his-16), fundido em `ducto-alveolar`: prejudica pouco.**
  - O saco está desenhado (sem botões de músculo, como deve), e o nome da estrutura diz "(e saco alveolar)".
  - Perde-se a possibilidade de pedir o saco no "Identifique" e de contrastá-lo com o ducto (botões × sem botões).
  - Recomendo id próprio para os dois sacos (P3-1).
- **`celulas-justaglomerulares` (his-17), dentro de `arteriola-aferente`: prejudica moderadamente.**
  - O aparelho justaglomerular é item clássico de prova. As células estão desenhadas (claras, com grânulos, na média) e descritas no texto, mas não podem ser alvo.
  - Recomendo id próprio na faixa da linha 852, com `contem: { 'arteriola-aferente': ['celulas-justaglomerulares'] }` e faixa de toque ampliada.
- **`tubulo-seminifero` (his-19): prejudica.**
  - É a unidade do órgão e a primeira estrutura que se pede numa lâmina de testículo. Hoje um toque em qualquer ponto do túbulo devolve a célula sob o dedo, nunca o túbulo.
  - Recomendo o id com `contem: { 'tubulo-seminifero': ['celula-mioide-peritubular', 'espermatogonia', 'espermatocito', 'espermatide', 'celula-de-sertoli', 'espermatozoide'] }`, com área própria só na luz ou sem área.
- **`estroma-endometrial` (his-20): prejudica moderadamente.**
  - O estroma é critério de datação (denso na proliferativa, edemaciado na secretora, pré-decidual depois). Hoje o toque nele devolve "Camada funcional" ou "Camada basal".
  - Recomendo `estroma-endometrial` como área do estroma, contido nas duas camadas (`contem`, decisão pela posição, como a célula epitelial reticular do timo).
- **Fora da lista do pedido, mas do mesmo tipo:** `teca-externa`, `cumulus-oophorus` e `corona-radiata` (his-20) estão desenhados no ovário sem id (P3-6).

## 7. Pontos para o revisor humano

1. **Distratores do jogo (P1-J).** Confirmar as exclusões para `rim-cortex`, `tireoide` e `utero-proliferativo`. Decidir se "Epitélio pseudoestratificado cilíndrico ciliado" sai das alternativas do útero (as glândulas proliferativas têm "aspecto pseudoestratificado") e se o pulmão exclui "Epitélio simples cúbico" (bronquíolos em metade dos campos, em área pequena).
2. **Renomeação de ids** (§5): `capsula` → `capsula-suprarrenal` e `tunica-albuginea` (ovário) → `tunica-albuginea-ovariana` são necessárias; `veia-central` → `veia-central-suprarrenal` é recomendada. A definição de `septo-conjuntivo` no his-03 ("ductos excretores") vale para lâminas que não são glândulas exócrinas.
3. **Ids ausentes** (§6): `tubulo-seminifero` e `celulas-justaglomerulares` têm o maior ganho didático.
4. **Proporção TCP × TCD.** Corrigi o desenho para "TCP predominante" sem número, porque nenhuma fonte foi lida. Se a disciplina quiser cobrar uma razão (os livros costumam dar várias vezes mais perfis de TCP), ela precisa de fonte.
5. **Nomenclatura folicular.**
   - O pedido diz que Junqueira e Ross divergem. Pela minha leitura (de memória, sem acesso ao texto dos livros nesta rede), **os dois usam secundário = antral**, e o pré-antral com granulosa estratificada é "primário multilaminar".
   - A divergência real é com outras obras e com a literatura de biologia reprodutiva:
     - "secundário" = pré-antral e "terciário" = antral, como registra o his-20;
     - ou ainda "secundário" = ≥ 2 camadas de granulosa, pré-antral ou antral, como em Griffin et al. 2006 (§8).
   - A lâmina é coerente com o his-20 e com o emb-02, e agora traz a ressalva. Confirmar nas edições impressas.
6. **Tamanho do ovócito do folículo primordial.** Mudei 25–30 µm para 30–35 µm com base em Pors et al. 2022, que citam 35 µm (Westergaard 2007; o resumo deste não traz o número). A faixa antiga vinha de memória dos livros (Junqueira ≈ 25 µm?). Confirmar a preferência.
7. **Proporção das zonas da adrenal.** Fasciculada ≈ 75% e glomerulosa ≈ 15% vêm de uma revisão de 2025 (texto integral lido). O his-18 omitiu as espessuras de propósito ("variam entre as obras"). Decidir se a lâmina deve ficar só qualitativa.
8. **Alvéolo de ≈ 200 µm.** É um cálculo meu a partir do volume médio de Ochs 2004 (esfera equivalente). Os alvéolos não são esferas, e no corte os perfis são menores que o diâmetro real. Confirmar a redação.
9. **Concorrência.** Durante esta revisão, outra sessão alterou `src/modules/histologia/laminas/index.ts` (exclusão `rim-cortex` na lâmina antiga) e criou `regras.ts`, com `distratoresExcluidos` e `contem` já usados pelos jogos. As propostas de §3 e §4 foram ajustadas a esse código. Nada em `sistemas-c.tsx` mudou.

## 8. Fontes conferidas (texto lido por curl)

| item | fonte | trecho decisivo |
|---|---|---|
| Tamanho do alvéolo | Ochs M, Nyengaard JR, Jung A, et al. The number of alveoli in the human lung. *Am J Respir Crit Care Med*. 2004;169(1):120-4. doi:10.1164/rccm.200308-1107OC, PMID 14512270 (resumo, E-utilities) | "The mean size of a single alveolus was rather constant with 4.2 x 10(6) microm3 (range: 3.3-4.8 x 10(6) microm3…)". Esfera equivalente de ≈ 200 µm (cálculo do revisor) |
| Tamanho do ovócito | Pors SE, Nikiforov D, Cadenas J, et al. Oocyte diameter predicts the maturation rate of human immature oocytes collected ex vivo. *J Assist Reprod Genet*. 2022. doi:10.1007/s10815-022-02602-0, PMID 36087150, PMC9596637 (texto integral, Europe PMC) | "the human oocyte grows from a diameter of 35 µm in the primordial follicle [1] to a diameter usually exceeding 100–110 µm when an antrum starts to form at a follicular diameter of around 250 µm [2]"; "At ovulation, the oocyte has reached its final diameter of around 110–120 µm" |
| Nomenclatura folicular (3ª variante) | Griffin J, Emery BR, Huang I, et al. Comparative analysis of follicle morphology and oocyte diameter in four mammalian species. *J Exp Clin Assist Reprod*. 2006;3:2. PMID 16509981, PMC1413548 (texto integral) | "a follicle … can be generally categorized as primordial, primary, or secondary based on the presence and number of cuboidal granulosa cell layers… Secondary follicles can then be further subdivided … preantral … or antral" |
| Proporção das zonas da adrenal | Long KC, Azizan EA. The adrenal gland and primary aldosteronism: anatomy, steroidogenesis, regulation, and genetic insights. *Front Endocrinol*. 2025. doi:10.3389/fendo.2025.1736534, PMID 41601940, PMC12832385 (texto integral) | "The ZG is located directly under the capsule, occupying approximately 15% of the adrenal cortex"; "The ZF occupies approximately 75% of the adrenal cortex" |
| Veia central da adrenal | Barenthin H. [The wall structure of the central vein of the human adrenal glands]. *Z Mikrosk Anat Forsch*. 1975;89(4):647-64. PMID 1229251 (resumo, E-utilities) | "The longitudinal smooth muscle system in the wall of the central vein was found to be incomplete, eccentric, and located far from the intima" |
| Primordial (ref. de Pors) | Westergaard CG, Byskov AG, Andersen CY. *Hum Reprod*. 2007;22:2225-31. PMID 17580300 (resumo) | o resumo não traz o diâmetro do ovócito, só o do núcleo ("14-23 microm") e o aumento com a idade até os 35 anos; por isso a faixa no texto é "cerca de" |

As afirmações de patologia acrescentadas vêm das correlações dos tópicos his-16 a his-20, já revisadas por duas etapas e com fontes registradas nelas. Nenhum número clínico (dose, limiar, prevalência) foi introduzido. Junqueira 14ª ed. e Ross 8ª ed. não estão abertos nesta rede: o que depende só deles está em §7.

## 9. Evidências

- **Integridade** (script contra `laminas-sistemas-c.original.json`, cópia do arquivo antes da revisão, igual ao `HEAD`):
  - ids, `ordem`, `titulo`, `tecido`, `orgao`, `coloracao`, `topicos` e ids e ordem das estruturas iguais;
  - `revisao.humano` = `null` nas 7 lâminas; +2 entradas em `revisao.agentes` em cada uma;
  - campos alterados: pulmao 10, rim-cortex 4, tireoide 3, adrenal 4, testiculo 8, ovario 7, utero-proliferativo 2 (38);
  - 34 valores de `tecido` distintos em `laminas*.json`.
- **`npm run validar-conteudo`** → `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.`
- **`npx vitest run`** → `Test Files 10 passed (10) · Tests 96 passed (96)`.
- **Campos do jogo:**
  - SVGs regerados do código atual com o `render.mjs` do desenhista, copiado para a pasta da revisão. A área de toque saiu idêntica a `lam-c/toque-*.json`.
  - Grade de rótulos (`data-e`) a cada 2 un por `elementFromPoint` (Chromium headless, `grade.mjs`).
  - Para cada um dos 121 centros (grade 11 × 11 sobre a área de sorteio), fração de cada estrutura no círculo de raio 150 un, com o centro limitado como no `Visor` (`campos.py`).
- **Contagens no SVG:**
  - rim: 56 perfis de TCP e 41 de TCD com centro no campo;
  - útero: 6 mitoses em glândulas (1.603 células glandulares, 58 perfis) e 3 no estroma.
- **Arquivos da revisão**, fora do repositório, em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-lam-c/`:
  - `editar.py` e `editar2.py` (correções), `notas.json` (entradas de `revisao.agentes`);
  - `render.mjs`, `grade.mjs`, `campos.py`;
  - `fontes/` (textos baixados);
  - `laminas-sistemas-c.original.json`.
