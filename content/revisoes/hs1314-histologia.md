# Revisão HS13–14: histologia (pele e anexos; tubo digestivo)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, com a 3ª verificação (fonte primária em texto integral) e acesso só por curl (Europe PMC, E-utilities do PubMed, OAI do PMC, gov.br). Formato: `docs/conteudo-schema.md`, seção Histologia.
- Arquivos editados: `content/histologia/topicos/his-13-pele.json` e `his-14-tubo-digestivo.json`. Mais nenhum, além deste relatório.
- Lidos para conferir a coerência, sem edição:
  - tópicos his-02, his-03, his-04, his-09, emb-15, emb-20 e emb-22;
  - `content/histologia/laminas.json` (`pele-espessa`, `epitelio-cilindrico-intestino`) e `laminas-sistemas-a.json`/`-b.json` (`pele-fina`, `esofago`, `estomago-fundo`, `colon`), que outros agentes estavam escrevendo durante esta revisão;
  - `src/modules/histologia/laminas/sistemas-b.tsx` (`PARTES_ESOFAGO`, `PARTES_ESTOMAGO`, `PARTES_COLON`) e `epitelios.tsx` (`PARTES_EPIDERME`, `PARTES_EPITELIO_CILINDRICO`).
- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.
- O que mudou e o que não mudou:
  - Nenhum gabarito (`correta`, `ordemCorreta`, `pares`) foi alterado. Nenhum id de tópico, questão, alternativa, item, evento, correlação ou estrutura foi trocado.
  - Uma estrutura foi **acrescentada** ao his-13: `estrato-granuloso`, id canônico já usado na lâmina `pele-espessa` e no his-02.
  - A checagem foi feita por script, comparando com a cópia dos arquivos anterior à revisão (igual ao commit `9d7f661`).

## 1. Resumo

Revisei integralmente os dois tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, 59 questões, referências, notas de divergência e incertezas. O conteúdo estava, em geral, correto e bem escrito. **Não encontrei gabarito errado nem fato errado cobrado em questão.**

Três problemas foram classificados como importantes:
- **his-13-q09 (queimaduras).** A vinheta da área B podia ser lida como 2º grau profundo, e a explicação refutava a alternativa (a) com um fato errado.
- **his-14-q04 (esôfago).** A divisão em terços da muscular é uma convenção. Dissecções mostram outra distribuição, e isso deixava a alternativa (b) defensável.
- **his-14-q18 (canal anal).** A explicação dizia que a zona de transição anal é revestida por epitélio pavimentoso.

As demais correções são de precisão, de atribuição de fonte, de terminologia ou de coerência.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-13 Pele e anexos | 29 | 0 | 1 | 10 | 11 | aprovado-com-correcoes |
| his-14 Tubo digestivo | 30 | 0 | 2 | 8 | 10 | aprovado-com-correcoes |
| **Total** | **59** | **0** | **3** | **18** | **21** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão ou referência.

### Checagens por script

- **Letras citadas.** Nas 35 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- **Distribuição das letras corretas.** his-13: a4/b4/c5/d4. his-14: a5/b4/c5/d4. Nenhuma letra passa de 30%, então não houve redistribuição.
- **Pista de comprimento.** A alternativa correta é a mais longa em 1 de 17 questões do his-13 (q13, com 73 caracteres contra 72 do maior distrator) e em 0 de 18 do his-14. Não há pista.
- **V/F.** 3 verdadeiras e 3 falsas em cada tópico.
- **Tipos de questão.** his-13: 17 múltipla escolha (11 com contexto), 6 V/F, 3 ordenar e 3 associar. his-14: 18 múltipla escolha (14 com contexto), 6 V/F, 3 ordenar e 3 associar.
- **Ordenar e associar.** As sequências são inequívocas: ciclo do pelo, camadas do folículo, melanina, camadas do jejuno, absorção de lipídios e cascata de Correa. Os pares são unívocos. Na his-13-q27, Meissner e Merkel se distinguem pela localização. Na his-13-q29, sebácea e apócrina se distinguem por "holócrina" e por "acima da sebácea".
- **Eventos.** Os empates de `ordem` estão corretos: no his-13, "novo anágeno" e "exógena" ficam ambos na posição 4. A sequência de absorção de lipídios do his-14 não tem empate nem ambiguidade.
- **Dificuldade e Bloom** são coerentes com cada item.

### Pontos registrados pelo redator: conferência um a um

| Ponto | Resultado | Fonte e trecho decisivo |
|---|---|---|
| Origem das células de Langerhans e de Merkel | **Correto**, e nenhuma questão cobra a origem. As notas estão exatas. | Hoeffel et al., J Exp Med 2012, PMID 22565823 (resumo): "adult LCs derive predominantly from fetal liver monocyte-derived cells with a minor contribution of YS-derived cells". Morrison et al., Dev Biol 2009, PMID 19782676: a deleção de Atoh1 na linhagem epidérmica elimina as células de Merkel, e na crista neural "had no effect". Van Keymeulen et al., J Cell Biol 2009, PMID 19786578: "MCs arise through the differentiation of epidermal progenitors". |
| Secreção das glândulas "apócrinas" | **Mantido fora do conteúdo.** O resumo, as estruturas e as questões não afirmam o modo de secreção. A nota passou a dizer que a atribuição a Ross não foi conferida e que há descrições de secreção por decapitação. | Ross 8ª ed. não acessível. Baker, Temperature 2019 (PMC6773238) confirma a abertura no folículo e o início da função na puberdade, mas não trata do modo de secreção. |
| Graus de queimadura | **Corrigido** (q09, correlação, notas). A classificação estava certa. Havia três problemas: o aspecto do 3º grau ("acastanhado ou carbonizado") não está na fonte citada; a área B da q09 não separava o 2º grau profundo do 3º; e a explicação da q09 dizia que leito seco e quase indolor "não tem anexos preservados". | Jeschke et al., Nat Rev Dis Primers 2020, PMC7224101: "superficial partial thickness, which are homogeneous, moist, hyperaemic and blanch, to deep partial thickness, which are less sensate, drier … and do not blanch. Third-degree … usually present with almost no pain". Toussaint e Singer, Clin Exp Emerg Med 2014, PMC5052819: "A superficial partial thickness burn extends into the superficial papillary dermis … blanch"; "Deep partial thickness burns extend into the reticular dermis and appear yellow or white and dry … extremely painful; however in some cases, the sensation … may become diminished"; "Full thickness … dry, leathery, black or white and are usually painless … do not blanch". A cartilha do MS (bvsms.saude.gov.br) continuou com HTTP 403. |
| Duração das fases do pelo | **Correto.** Anos no couro cabeludo e semanas na catágena; só a sequência é cobrada. A nota recebeu os números da fonte. | Natarelli et al., J Clin Med 2023, PMC9917549: "anagen lasts about two to eight years among scalp hair"; "catagen … lasting about two weeks". Eflúvio pós-parto: Rebora, Clin Cosmet Investig Dermatol 2019, PMC6709511: "Postpartum TE develops 2–4 months after childbirth". |
| Terços musculares do esôfago | **Corrigido** (q04: importante). O padrão clássico dos livros é uma convenção. Em cadáveres, só 4–6% proximais são exclusivamente esqueléticos, e a zona mista invade o "terço superior". Isso tornava defensável a alternativa (b). O enunciado passou a pedir "pela divisão clássica dos livros de histologia", e a explicação cita os números. | Meyer et al., J Clin Gastroenterol 1986, PMID 3745845 (resumo): "The lower 54-62% of the esophagus was found to be exclusively smooth muscle, the proximal 4.1-5.6% to be exclusively striated, and the remainder to be mixed." |
| Transição epitelial do canal anal × linha pectínea | **Corrigido.** A zona de transição fica em torno da linha, sobretudo logo acima dela. O resumo dizia "acima da linha pectínea, a mucosa é colorretal", e a estrutura `linha-pectinea` repetia isso. A q18 dizia que a zona de transição tem epitélio pavimentoso (importante). | Fenger, Acta Pathol Microbiol Scand A 1979, PMID 93398 (resumo): "the epithelial variants may be found … from 6 mm below to 20 mm above the dentate line". Li et al., Front Med 2026, PMC13584962: borda superior da zona "8.18 ± 2.96 mm above the dentate line"; zona com epitélio estratificado cilíndrico e pavimentoso. Gomes et al., World J Gastrointest Endosc 2025, PMC12576667: "Tumors located just proximal to the pectinate line are typically nonkeratinizing SCCs"; "Approximately 90% of anal SCCs are caused by infection with high-risk HPV"; o HIV é fator de amplificação. |
| Marsh original × modificada (ESsCD 2025) | **Correto.** A nota ganhou a ressalva da "zona cinzenta". A afirmação "dieta sem glúten por toda a vida" estava atribuída à parte 1, mas está na **parte 2** (2026); a referência foi acrescentada e a citação corrigida. | ESsCD parte 1, PMC12704582: "The modified Marsh classification remains the reference standard"; "later modified to subdivide stage III … 3A (partial), 3B (subtotal), and 3C (total villous atrophy)"; "A positive CeD‑specific serology in patients with Marsh‑II stage or Marsh‑III stage confirms the diagnosis"; "low-level positive IgA anti-TG2 and Marsh-II histology represents a diagnostic 'grey zone'"; "at least four biopsies from the distal duodenum, plus two from the duodenal bulb"; "Confirm HLA‑DQ2/DQ8 before starting a gluten challenge, as a negative result rules out CeD"; "Duodenal histology is the preferred endpoint for the gluten challenge". Parte 2, PMC13097674: "The treatment for CeD is a lifelong adherence to a GFD." |
| Células de Paneth no colo | **Correto** ("normalmente ausente no colo esquerdo"; metaplasia no colo esquerdo). A nota ganhou a fonte. | Sakuraba, Dig Endosc 2026, PMC13367016: "Paneth cells are occasionally found in the cecum and proximal colon. However, the presence of Paneth cells in the distal colon is common in UC". Muto et al., Nat Commun 2026, PMID 41904124: metaplasia "in the left colon". |
| Abscesso de cripta nas duas DII | **Correto.** q14 e q30 não usam o abscesso como critério de diferença. | Jucan et al., Biomedicines 2023, PMC10669373: escores de atividade do Crohn e da RCU incluem "crypt abscess"; "the histological features that define chronicity [em UC e CD] are crypt architectural distortion … basal plasmacytosis … and Paneth cell metaplasia". |
| Breslow | **Correto.** A incerteza foi resolvida. A medida passou a ser "do topo da camada granulosa (ou da base da úlcera)". | ICCR, Scolyer et al., Am J Surg Pathol 2013, PMC3864181: "Breslow thickness is the single most important prognostic factor for clinically localized primary melanoma … measured from the top of the granular layer of the epidermis (or, if the surface is ulcerated, from the base of the ulcer)". O mesmo texto diz que o linfonodo sentinela é preditor ainda mais forte; a q13 pergunta por medidas do tumor primário. O artigo AJCC 8ª ed. (PMC5978683) foi lido e não traz essa frase. |
| Critério histológico de apendicite | **Correto** como "critério clássico" (q23 = verdadeiro). A explicação ganhou a ressalva de que os critérios variam. | Diretriz sueca, Salö et al., BJS Open 2025, PMC11980984: "accepted diagnostic criteria, that is transmural invasion of neutrophils (gold standard)"; "pathologists apply different criteria". Roupakias et al., Cureus 2025, PMC12042725: "Some pathologists define AA as transmural inflammation (neutrophilic infiltration of the muscularis propria), while others suggest that mucosal inflammation … must be considered as early appendicitis". |
| Abetalipoproteinemia | **Correto** (q09 do his-14). | Takahashi et al., J Atheroscler Thromb 2021, PMC8560840: "Deficiency of microsomal triglyceride transfer protein (MTTP) abrogates the assembly of apo B-containing lipoprotein in the intestine"; "steatorrhea, vomiting, and failure to thrive in infancy"; "lipid-laden enterocytes"; acantócitos. |
| Tipos de Lauren | **Correto** (q16, q27, correlação). | Muratore et al., Front Oncol 2026, PMC13550965: "Laurén distinguished for the first time intestinal-type adenocarcinomas and diffuse-type carcinomas"; "E-cadherin mutations, which represent a hallmark molecular alteration of diffuse-type disease". Lauren 1965, PMID 14320675 (só o título no PubMed). O câncer gástrico difuso hereditário por CDH1 segue Robbins, de memória. |
| Gastrite autoimune | **Correto**, com uma ressalva. O texto dizia que ela aumenta o risco "de adenocarcinoma" como fato estabelecido. Isso é debatido e virou nota (menor). Hipergastrinemia, hiperplasia de ECL e tumor neuroendócrino estão confirmados. | Ahn e Kim, Korean J Helicobacter Up Gastrointest Res 2025, PMC12173590: "Elevated gastrin levels also play a critical role in inducing abnormal ECL cell proliferation"; "The relationship between AIG and gastric cancer remains a topic of debate"; "H. pylori-negative patients with AIG were not found to develop gastric cancer". |
| Azul alciano no Barrett | **Correto.** Ganhou uma nota sobre as "células colunares azuis". | Bhardwaj et al., Patholog Res Int 2012, PMC3369502: "acidic mucin in goblet cells (blue by Alcian blue at pH 2.5) against a backdrop of gastric neutral mucin (magenta caps by PAS) … helpful in differentiating true IM from so-called columnar blue cells or pseudogoblet cells". Maslyonkina et al., Cancer Med 2022, PMC8729054: "sometimes cytoplasm of pseudo‑GCs" também se cora em azul. |
| ABCDE do INCA | **Correto** (correlação e q13). | https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-melanoma/versao-para-profissionais-de-saude (aba "atualizada em 31/07/2023"; acesso em 10/11/2026): "Diâmetro: maior que 6 milímetros"; "Alguns melanomas não são pigmentados"; "Não há evidência científica de que o rastreamento do câncer de pele melanoma na população em geral traga mais benefícios do que riscos e, portanto, até o momento, ele não é recomendado"; o exame histopatológico confirma o diagnóstico. A página-mãe foi atualizada em 16/09/2025, sem mudar essa aba. |
| Hirschsprung (ERNICA 2026) | **Correto** (q15, q24, correlação). O título da referência foi completado: o título oficial termina em "2025". | Rossi et al., J Pediatr Gastroenterol Nutr 2026, PMC13342790, Tabela 1: "Biopsies should be taken from the posterior and/or lateral rectal wall at least 2 cm proximal to the dentate line or 3 cm from the anal orifice, and must contain a representative amount of submucosa"; "The presence of any number of ganglion cells on H&E staining excludes HSCR"; "A combination of H&E and calretinin is recommended"; "acetylcholinesterase activity is increased, and calretinin immunohistochemistry is negative"; "(except within 1–2 cm of the transition zone)"; atraso do mecônio "> 24 h in a term infant". Monforte et al., World J Pediatr Surg 2025, PMC12314976: "inserted approximately 2–3 cm from the dentate line, bypassing the normally hypoganglionic zone"; hipertrofia e tortuosidade dos troncos nervosos. |

Também conferido, fora da lista do redator:
- inervação simpática colinérgica das écrinas (q18 do his-13). Baker 2019: "release of acetylcholine from nonmyelinated class C sympathetic postganglionic fibers, which binds to muscarinic (subtype 3) receptors". A frase sobre as apócrinas foi suavizada: Baker diz "Apocrine gland innervation is poorly understood, but isolated sweat glands have been found to respond equally to adrenergic and cholinergic stimuli";
- albinismo: a redução ou ausência de melanina, o nistagmo e a hipoplasia da fóvea foram vistos em Ma e Wang, J Med Case Rep 2024, PMC11654439 (relato com revisão, só fonte de apoio).

Todas as citações bibliográficas dos dois tópicos (DOI, PMID, PMC, volume e páginas) foram conferidas pelas E-utilities do PubMed.

### Coerência com lâminas e tópicos

- **`pele-espessa`.** Os 7 ids da lâmina existem no his-13, com definições compatíveis: `estrato-basal`, `estrato-espinhoso`, `estrato-granuloso` (acrescentado), `estrato-lucido`, `estrato-corneo`, `papila-dermica` (sinônimo "derme papilar", como no his-02) e `derme-reticular`.
- **`pele-fina`.** Os 9 ids da lâmina existem no his-13 com o mesmo nome: `epiderme`, `derme`, `hipoderme`, `foliculo-piloso`, `haste-do-pelo`, `papila-do-pelo`, `glandula-sebacea`, `musculo-eretor-do-pelo` e `glandula-sudoripara-ecrina`.
  - A lâmina apareceu em `laminas-sistemas-a.json` durante a revisão.
  - As descrições batem com o his-13: bainha interna que some no istmo; eretor do lado do ângulo obtuso, com estímulo simpático; ducto écrino de duas camadas, mais escuro.
- **`esofago`, `estomago-fundo` e `colon`.** Todos os ids da lâmina existem no his-14, em `laminas-sistemas-b.json` e em `PARTES_*` de `sistemas-b.tsx`.
  - A lâmina do esôfago é do terço inferior, com muscular lisa. É coerente com a q04, que descreve o terço médio.
- **`epitelio-cilindrico-intestino`.** `epitelio-simples-cilindrico`, `celula-caliciforme`, `borda-em-escova` ("planura estriada") e `lamina-propria` são compatíveis. O "quilífero" da lâmina é sinônimo de `lacteo` no his-14.
- **Nenhum id precisou ser trocado.**
- **Tópicos.**
  - Origem da derme, dos melanócitos e do folículo: coerente com o emb-20.
  - Canal anal (endoderma acima e proctodeu abaixo da linha pectínea) e Hirschsprung: coerentes com o emb-15 e o emb-22. O atraso do mecônio é de 48 h nos tópicos de embriologia e de 24 h na ERNICA; a nota existente cobre a diferença.
  - Barrett (definição no his-02), apócrinas, colorretal e caliciformes (his-03) e derme reticular densa não modelada (his-04): coerentes.
  - O his-09 não trata do eretor nem da muscular do esôfago.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-13-q09 | contexto (área B) | "esbranquiçado, seco e **endurecido** … **quase não sente** a picada" | "branco, seco e **com aspecto de couro** … **não sente** a picada" | O 2º grau profundo também é seco, branco, não empalidece e é menos sensível. Sem o aspecto de couro e a insensibilidade, B não era inequivocamente de espessura total, e a correta (c) dependia disso | importante | Jeschke 2020; Toussaint e Singer 2014 |
| his-13-q09 | explicacao (refutação de a; descrição de B) + referencia | "um leito seco e quase indolor **não tem anexos preservados**" | "um leito branco, seco, com aspecto de couro e insensível à agulha indica lesão de espessura total, não de 2º grau superficial"; B "tem aspecto de couro … é indolor". Toussaint e Singer acrescentados à referência | O 2º grau profundo é seco e pouco doloroso e ainda tem anexos profundos; a frase ensinava o contrário | (mesma correção acima) | idem |
| his-13 / `queimaduras-profundidade` | descricao | 3º grau "branco, **acastanhado ou carbonizado**"; "seguem a revisão de Jeschke" | 2º superficial "(papilar)"; 2º profundo "esbranquiçado ou amarelado, em geral menos sensível"; 3º "seco, com aspecto de couro, branco ou escuro, … em geral indolor"; fontes: Jeschke e Toussaint e Singer | Os descritores do 3º grau não estavam na fonte citada; profundidade papilar × reticular agora com fonte | menor | idem |
| his-13 | notasDivergencia (queimaduras) | 4º grau só em Jeschke | + Toussaint põe a gordura no 4º grau (no Brasil, 3º); divergência sobre a dor no 2º profundo; imprecisão da avaliação clínica | Registro de divergência entre fontes | menor | idem |
| his-13 / `melanoma` + q13 | descricao; referencia | Breslow "medida da camada granulosa ao ponto mais profundo" | "do topo da camada granulosa (ou da base da úlcera, se houver)"; ICCR na referência; incerteza → nota | Precisão; incerteza resolvida | menor | ICCR, Scolyer et al. 2013 |
| his-13 / `vitiligo` | descricao | albinismo: melanócitos "**não produzem** melanina" | "produzem **pouca ou nenhuma** melanina (no tipo 1, por defeito da tirosinase)" | Só o OCA1A não produz melanina; nos demais, há redução | menor | Ma e Wang 2024 (revisão); Robbins |
| his-13-q16 | explicacao | "a falta de pigmento no olho explica o nistagmo" | "a falta de melanina durante o desenvolvimento do olho prejudica a formação da fóvea, o que explica o nistagmo e a baixa visão" | Mecanismo simplificado demais | menor | Ma e Wang 2024 |
| his-13-q18 | explicacao; referencia | "As apócrinas … são descritas com inervação adrenérgica" | "inervação menos conhecida: os livros … descrevem como adrenérgica, e glândulas isoladas respondem a estímulos adrenérgicos e colinérgicos"; Baker na referência | Afirmação apresentada como consenso; a parte cobrada (écrinas) foi conferida | menor | Baker 2019 |
| his-13-q03 | alternativa b | "Célula melanocítica" | "Melanócito" | Termo não usado nos livros | menor | Junqueira; Ross |
| his-13-q01 | explicacao | "papilas dérmicas altas, que formam as impressões digitais" | "cristas epidérmicas e papilas dérmicas altas, cujo arranjo desenha as impressões digitais" | Coerência com o resumo, que atribui o desenho às cristas epidérmicas | menor | Junqueira; Ross |
| his-13 / estruturas | (nova) `estrato-granuloso` | — | Estrutura acrescentada, com definição compatível com o his-02 e a lâmina | O tópico listava 4 dos 5 estratos; a lâmina `pele-espessa` usa os 5 | menor | his-02; `laminas.json` |
| his-13-q17 + incertezas + notas | referencia; incertezas; notasDivergencia | eflúvio, ciclo e inervação "de memória"; Breslow em incertezas | Rebora na q17; incertezas atualizadas; nota do ciclo do pelo com números; nota das apócrinas suavizada (Ross não conferido); 5 referências novas (Toussaint, ICCR, Baker, Natarelli, Rebora) | Registro da conferência | menor | ver seção 1 |
| his-14-q04 | enunciado; explicacao; referencia | "De onde provém o corte?" | "Pela divisão clássica dos livros de histologia, de que segmento provém o corte?" + dados de Meyer na explicação | Pela anatomia real, a zona mista ocupa boa parte do "terço superior", e a alternativa (b) ficava defensável | importante | Meyer et al. 1986 |
| his-14 resumo + pontosChave[3] + notasDivergencia | resumo; pontosChave; nota | "A muscular externa é esquelética no terço superior…" | "Na descrição clássica, …"; nota com os percentuais de Meyer | Coerência com a q04 | menor | idem |
| his-14-q18 | explicacao; referencia | "Na zona de transição e abaixo dela, o epitélio é estratificado pavimentoso" | "A zona de transição tem epitélio variável, com áreas estratificadas cilíndricas e pavimentosas, e abaixo dela o epitélio é estratificado pavimentoso; o carcinoma dessa região é, em geral, epidermoide" | A explicação ensinava um fato errado sobre a zona de transição. A resposta (b) não muda | importante | Fenger 1979; Li 2026; Gomes 2025 |
| his-14 resumo + pontosChave[9] + `linha-pectinea` + nota | resumo; pontosChave; definicao; notasDivergencia | "Acima da linha pectínea, a mucosa é colorretal…"; definição: "acima dela a mucosa é colorretal" | Zona de transição "em torno da linha pectínea, sobretudo logo acima dela"; mucosa colorretal "mais acima"; nota com Fenger e Li | Logo acima da linha fica a zona de transição, não a mucosa colorretal | menor | Fenger 1979; Li 2026 |
| his-14 / `gastrite-autoimune` + nota | descricao; notasDivergencia | "Aumenta o risco de tumores neuroendócrinos e de adenocarcinoma gástrico" | Aumenta o risco de tumores neuroendócrinos; associação com adenocarcinoma "debatida, porque pode depender de infecção concomitante ou prévia pelo H. pylori" | Afirmação controversa apresentada como fato; Robbins afirma o risco, a literatura recente discute | menor | Ahn e Kim 2025 |
| his-14 / `doenca-celiaca` + referências + incerteza | descricao; referencias; incertezas | "dieta sem glúten … por toda a vida (ESsCD, 2025)" atribuída à parte 1 | "(ESsCD, parte 2, 2026)"; referência da parte 2 acrescentada; frase retirada do capítulo da parte 1 | A frase não está na parte 1 | menor | ESsCD parte 2, PMC13097674 |
| his-14-q23 + nota | explicacao; referencia; notasDivergencia | "a infiltração neutrofílica da muscular própria define a apendicite aguda" | + "(inflamação transmural) … embora alguns patologistas aceitem critérios mais brandos"; diretriz sueca na referência e nota | Precisão; o V/F continua verdadeiro ("critério clássico") | menor | Salö et al. 2025; Roupakias et al. 2025 |
| his-14 / referências | ERNICA | título sem "2025" | título oficial "…rectosigmoid Hirschsprung's disease 2025" | Citação exata (PubMed) | menor | PMID 42057764 |
| his-14 / referências, notas, incertezas | referencias; notasDivergencia; incertezas | Itens de patologia "de memória"; azul alciano não conferido | 9 referências novas (ESsCD parte 2, Meyer, Fenger, Li, Gomes, Bhardwaj, Ahn e Kim, Takahashi, Salö); notas novas (Barrett/azul alciano, gastrite autoimune, apendicite); notas ampliadas (Marsh, com a "zona cinzenta" de Marsh 2; Paneth); incertezas atualizadas | Registro da conferência | menor | ver seção 1 |
| his-14-q09, q11 | referencia | Só Robbins, Junqueira e Ross | + Takahashi et al. 2021 (q09); + Ahn e Kim 2025 (q11) | Fonte conferida em texto integral para o caso clínico | menor | ver seção 1 |

## 3. Pontos para o revisor humano

1. **Capítulos das obras-base.** As referências citam Junqueira 14ª ed. caps. 18 e 15 e Ross 8ª ed. caps. 15 e 17, com a numeração das edições anteriores. Não achei o sumário da 14ª ed. de Junqueira em rede liberada; conferir no livro.
2. **Queimaduras.**
   - A classificação brasileira (MS) não pôde ser lida: bvsms.saude.gov.br responde HTTP 403.
   - Conferir se a escola usa "3º grau inclui a hipoderme" (texto atual) ou o 4º grau internacional.
   - Conferir se aceita a q09 reescrita, que separa o 3º grau pelo aspecto de couro, pela ausência de empalidecimento e pela insensibilidade à agulha.
   - As fontes divergem sobre a dor no 2º grau profundo: Jeschke diz "less sensate"; Toussaint, "extremely painful", às vezes com sensibilidade diminuída. A q28 usa "menos sensível", como Jeschke.
3. **Muscular do esôfago (q04).** O enunciado agora pede a divisão clássica dos livros. Se o professor preferir não ensinar a convenção dos terços, a alternativa pode virar "porção de musculatura mista".
4. **Zona de transição anal.** O texto adota "em torno da linha pectínea, sobretudo logo acima", com base em Fenger 1979 (resumo) e Li 2026. Ross 8ª ed. (três zonas por terços do canal) não foi conferido no livro.
5. **Gastrite autoimune e adenocarcinoma.** Robbins afirma o risco aumentado, e a literatura recente debate se ele depende do H. pylori. O texto apresenta o debate; decidir se basta.
6. **Modo de secreção das "apócrinas".** O conteúdo evita o tema. A afirmação de Ross ("principalmente merócrina") consta só nas notas, sem conferência.
7. **Albinismo, vitiligo, psoríase, acne, carcinomas basocelular e espinocelular, H. pylori, Crohn × retocolite e Lauren/CDH1.** Descrições qualitativas de Robbins citadas de memória. Foram conferidas só em revisões, e algumas nem nisso. Não há número nelas.
8. **Afirmações de Ross de memória** (registradas em `incertezas`): pele do dorso classificada como "fina"; linhas de Langer na derme reticular; profundidade das fossetas do antro.
9. **Doença celíaca.** O PCDT brasileiro não foi consultado. O número de biópsias e a via sem biópsia seguem a ESsCD 2025.
10. **Selo.** Até a conferência médica, os dois tópicos devem aparecer com "Revisado por IA · conferência médica pendente". A 2ª etapa (revisor transversal) ainda não foi feita.

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina
AssertionError: pulmao: expected false to be true
 Test Files  1 failed | 8 passed (9)
      Tests  1 failed | 83 passed (84)
```

A única falha é de lâmina: o desenho `pulmao` de `sistemas-c.tsx` ainda não tem entrada em `laminas-sistemas-c.json`. Esses arquivos estão sendo escritos por outro agente e não têm relação com os dois tópicos revisados. Ela foi registrada e ignorada, como pedido.

Checagem por script contra a cópia anterior à revisão (igual ao commit `9d7f661`):
- ids, alternativas, itens e gabaritos estão iguais;
- a única estrutura nova é `estrato-granuloso`;
- `revisao.humano` continua `null`;
- há uma entrada nova em `revisao.agentes` em cada arquivo.

Não fiz commit. Durante a revisão, a sessão principal fez quatro commits no branch de trabalho (`b179f88`, `dbad032`, `9b21575` e `b37c748`), e eles já incluem as edições dos dois tópicos e uma versão deste relatório. Esta última frase é a única mudança ainda fora de commit.
