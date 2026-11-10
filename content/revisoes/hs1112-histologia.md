# Revisão HS11-12 — histologia (tópicos 11 e 12)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, incluindo a 3ª verificação no texto integral, feita com curl pelo proxy (sem WebFetch). Formato: `docs/conteudo-schema.md`, seção Histologia.
- Arquivos: `content/histologia/topicos/his-11-circulatorio.json` e `content/histologia/topicos/his-12-linfoide.json`.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica, e `revisao.humano` continua `null` nos dois arquivos.
- Ids e gabaritos: nenhum id de tópico, questão, alternativa, item, estrutura, evento ou correlação foi alterado ou removido. Nenhum gabarito mudou (`correta`, `ordemCorreta`, pares) nem nenhuma `ordem` de evento. O único acréscimo é a estrutura `septo-conjuntivo` em his-12, para alinhar com a lâmina `timo` (ver tabela). A checagem foi feita por script contra a versão anterior.
- Escopo: só os dois tópicos e este relatório foram editados. As lâminas (`laminas*.json`) só foram lidas.
- **Aviso sobre commit:** eu não fiz commit. Enquanto eu revisava, outro processo fez o commit `9b21575` ("1ª etapa de his-17/18", 10:44), que já incluiu as minhas edições de his-11 e his-12. O conteúdo do commit é igual ao dos arquivos atuais. Este relatório ainda não está commitado.

## 1. Resumo

Revisei integralmente os dois tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações clínicas, 58 questões, referências, notas de divergência e incertezas. Também verifiquei a coerência com his-04, his-08, his-09, his-10, emb-12, emb-13, emb-15, emb-22, emb-23 e emb-24, e com as lâminas `aorta`, `feixe-neurovascular`, `linfonodo`, `baco` e `timo`.

**Nenhum gabarito estava errado.** O problema mais sério está na correlação de asplenia (his-12): ela apresentava como conduta atual no Brasil o esquema VPC13 seguida da VPP23, que o Ministério da Saúde substituiu em 2026 pela VPC20 (Nota Técnica nº 52/2026, lida no texto integral).

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-11 Sistema circulatório | 29 | 0 | 1 | 5 | 6 | aprovado-com-correcoes |
| his-12 Órgãos linfoides | 29 | 1 | 1 | 9 | 11 | aprovado-com-correcoes |
| **Total** | **58** | **1** | **2** | **14** | **17** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, precisão, referência.

Checagens feitas por script:
- **Letras corretas:** a/b/c/d = 4/4/4/4 nos dois tópicos (16 de múltipla escolha em cada). Não houve redistribuição.
- **Pista de comprimento:** a correta é a única mais longa em 3 de 16 questões em cada tópico, abaixo do acaso (4/16). É a mais curta em 3/16 (his-11) e 4/16 com empates (his-12). Não há pista a corrigir, e mexer nas alternativas pioraria o texto sem ganho, por isso não reequilibrei. A troca de "atravessa" por "cruza" em his-11-q10 (c) deixou essa alternativa como a mais curta.
- **Explicações:** em todas as 32 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- **Tipos:** 16 multipla, 7 vf, 3 ordenar, 3 associar em cada tópico. Há 13 questões com contexto clínico em his-11 e 10 em his-12.
- **Eventos:** as sequências (aterogênese em his-11; maturação do timócito em his-12) são inequívocas pela ordem de início de cada etapa. A nota sobre sobreposição foi mantida.
- **Testes:** `npm run validar-conteudo` passou ("Conteúdo OK — tópicos: 45; questões: 1363"). `npx vitest run` deu 83 de 84 testes aprovados. A única falha é de lâmina e não destes arquivos: "toda lâmina tem desenho e todo desenho tem lâmina", em que `pulmao` tem desenho mas ainda não tem dados de lâmina (outro agente está trabalhando nisso). Registrada e ignorada, como pedido.

### Pontos registrados pelo redator: resultado de cada um

| Ponto | Resultado |
|---|---|
| Divergências de diâmetro | **Ok.** Nenhum número é cobrado (arteríola, capilar, número de lâminas elásticas). A lâmina `aorta` cita 40 a 70 lâminas no adulto, o que bate com a nota. |
| Sinusoides fenestrados das glândulas endócrinas | **Ok, sem mudança.** O conteúdo classifica as glândulas endócrinas como fenestradas e dá como sinusoides só fígado, baço e medula, onde as obras concordam. Nenhuma questão usa glândula endócrina como exemplo ou distrator de sinusoide (q04 tem a única resposta defensável: vilosidade intestinal). |
| Vias internodais | **Ok.** Não aparecem no conteúdo nem na q25. |
| Linfáticos meníngeos | **Precisado.** Louveau et al. (texto integral) descrevem vasos funcionais na dura-máter de **camundongos**, com estrutura "possivelmente semelhante" na dura humana. A nota foi ajustada. |
| Origem do epitélio tímico | **Confirmada** (resumo de Gordon et al. 2004: origem endodérmica única). Coerente com emb-12. Acrescentei à estrutura `timo` a origem do conjuntivo na crista neural, como em emb-12. |
| Seleção negativa no córtex | **Corrigido (importante).** Ver tabela: "sobretudo na medula" foi retirado. |
| Circulação esplênica aberta × fechada | **Atualizado.** A reconstrução 3D de baço humano (Steiniger et al. 2022) indica circulação inteiramente aberta. A q26 já cobrava a via aberta; a explicação e a nota foram ajustadas. |
| Corpúsculos de Hassall (TSLP) | **Confirmado** (resumo de Watanabe et al. 2005: TSLP leva células dendríticas a induzir Treg no timo humano). A definição foi alinhada à lâmina `timo` ("função não totalmente esclarecida"). A q28 está correta. |
| Asplenia: NT 83/2025, ACIP 2020 | **NT 83/2025 confirmada, mas superada:** a NT 52/2026 introduziu a VPC20 na RIE (ver tabela, crítica). O ACIP 2020 foi confirmado no texto integral: vacinar ≥ 2 semanas antes da esplenectomia eletiva, MenB a partir dos 10 anos. O Manual dos CRIE (6ª ed.) foi lido no gov.br: vacinar ≥ 14 dias antes, MenACWY na asplenia, MenB indisponível no SUS. |
| Timoma e timectomia (consenso 2016 e atualização 2020) | **Confirmados no texto integral.** 2016: "With rare exceptions, all patients with MG with thymoma should undergo surgery… may not produce improvement in MG". 2020: timectomia precoce na MG generalizada AChR+ sem timoma, de 18 a 50 anos. Não encontrei atualização internacional posterior que os substitua (busca no Europe PMC, 2022–2026). |
| Robbins de memória | Faixa subendocárdica poupada: mecanismo confirmado (Lindsey et al. 2018, texto integral). A extensão do infarto subendocárdico foi precisada. Aortite sifilítica, BCL2 e DiGeorge: compatíveis com o conhecimento padrão, sem fonte primária lida. DiGeorge passou a "pode esvaziar" as zonas T, porque a deficiência é de gravidade variável. |
| WPW | **Confirmado e precisado.** Leoni et al. 2023 e Mohan et al. 2019 (textos integrais) distinguem padrão (PR curto e onda delta) de síndrome (com taquicardias sintomáticas). As vias à esquerda muitas vezes contornam o anel fibroso pelo lado epicárdico, então o texto passou a dizer que a via "cruza" o anel. |

## 2. Tabela de correções

### his-11 — Sistema circulatório

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-11-q17 (+ resumo, estrutura `vasa-vasorum`, nota) | enunciado; explicacao; referencia; resumo; definicao; notasDivergencia | V/F verdadeiro: "**Nos vasos de grande calibre**, os vasa vasorum nutrem a adventícia e a parte externa da média, enquanto a íntima e a parte interna da média são nutridas por difusão" | "**Nas grandes artérias**…". A explicação, o resumo e a estrutura acrescentam que, nas veias, os vasa vasorum chegam perto do lúmen | Nas veias os vasa vasorum penetram a média até perto do lúmen, então a afirmação não era inequivocamente verdadeira para "vasos de grande calibre". O gabarito (verdadeiro) foi mantido | importante | Loesch e Dashwood, J Cell Commun Signal 2018 (PMC6235771); Phillippi, Sci Adv 2022 (PMC9020663) |
| his-11-q10 (+ resumo, correlação `pre-excitacao-ventricular`, nota, incerteza, referência) | alternativa c; explicacao; descricao; mecanismo | Via acessória que "**atravessa** o anel fibroso"; só "padrão de WPW" no caso com palpitações | "**cruza** o anel fibroso (à direita, em geral através dele; à esquerda, muitas vezes por fora, pelo lado epicárdico)". Padrão × **síndrome** de WPW explicitado | Precisão anatômica e terminológica. A resposta (c) continua sendo a única defensável | menor | Leoni et al., J Cardiovasc Med 2023 (PMC10836786); Mohan et al., Indian Pacing Electrophysiol J 2019 (PMC6904806) |
| correlação `isquemia-subendocardica` | descricao | Infarto subendocárdico "restrito ao terço interno" | "terço interno (no máximo, à metade interna)" | Definição usual (terço a metade interna). O caso da q16 (terço interno) continua válido | menor | Robbins 10ª ed., Coração (de memória; ver seção 3) |
| resumo (artéria muscular) | resumo | Lâmina elástica interna ondulada "porque o vaso se contrai após a morte" | "porque o músculo liso se contrai após a morte e na fixação" | Coerência com a lâmina `feixe-neurovascular` | menor | `laminas-sistemas-a.json` |
| notasDivergencia (linfáticos no SNC) | nota | "descritos nas meninges (dura-máter) em 2015" | "descritos em 2015 na dura-máter de camundongos…, estrutura possivelmente semelhante na dura humana" | O achado foi em camundongos | menor | Louveau et al., Nature 2015 (PMC4506234, texto integral) |
| incertezas (Robbins de memória) | incerteza | Faixa subendocárdica poupada "de memória" | Mecanismo de difusão a partir da cavidade confirmado em modelos experimentais; a descrição em autópsia humana segue Robbins | Fonte lida | menor | Lindsey et al., Am J Physiol Heart Circ Physiol 2018 (PMC5966768) |

### his-12 — Órgãos linfoides e sistema imune

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| correlação `asplenia-encapsulados` (+ referências, incerteza) | descricao | Conduta atual no Brasil: VPC13 seguida da VPP23 (Manual dos CRIE, NT 83/2025). Meningocócicas e prazo de 2 semanas só pelo ACIP | O Manual dos CRIE indica vacinas contra pneumococo, meningococo (ACWY conjugada) e Hib, e vacinar ≥ 14 dias antes da esplenectomia eletiva. O esquema VPC13→VPP23 **passou a ser substituído em 2026 pela VPC20, dose única a partir de 5 anos**, à medida que se esgotam os estoques (NT 52/2026). ACIP: MenB a partir de 10 anos, indisponível no SUS | Conduta desatualizada apresentada como vigente | **crítica** | NT nº 52/2026-CGICI/DPNI/SVSA/MS; NT nº 64/2026; NT nº 83/2025; Manual dos CRIE 6ª ed.; Mbaeyi et al., MMWR 2020 (PMC7527029) |
| pontosChave[5]; resumo (Seleção); estrutura `medula-timica`; q25 (explicação); nota; referência | texto | "seleção negativa **sobretudo na medula**"; medula "sede **principal** da seleção negativa"; no resumo, a seleção negativa só na medula | "seleção negativa **no córtex e na medula**, onde células epiteliais com AIRE apresentam proteínas de outros órgãos"; no resumo, ela "continua" na medula, "iniciada já no córtex" | Em camundongos, a deleção clonal no córtex é cerca de 2× maior que na medula. O ponto-chave afirmava o contrário. Nenhuma resposta muda: AIRE e q25 tratam da etapa medular | importante | Klein et al., Nat Rev Immunol 2014 (PMC4757912, texto integral pelo OAI do PMC), que resume Stritesky et al., PNAS 2013 |
| his-12-q10 | explicacao; referencia | "ali [no centro germinativo] também ocorre troca de classe" | A troca de classe em geral começa antes, na ativação pelo T auxiliar, e é pouco frequente dentro do centro germinativo | Fato desatualizado na explicação. A resposta (b) não muda | menor | Roco et al., Immunity 2019 (resumo) |
| his-12-q23 (+ incerteza) | enunciado; referencia | "continua a produzir linfócitos T **em pequena quantidade** no adulto" | "…no adulto, **em quantidade reduzida**" | Douek: a produção diminui com a idade, mas a saída é "substancial" até o fim da vida adulta. O gabarito (verdadeiro) foi mantido | menor | Douek et al., Nature 1998 (resumo) |
| resumo (Correlações); his-12-q29 (explicação) | texto | A hipoplasia tímica "**esvazia** as zonas T" | "**pode esvaziar**" | Deficiência de gravidade variável (a forma completa é rara), coerente com a própria correlação e com emb-12 | menor | emb-12; Robbins 10ª ed. |
| estrutura `timo` | origem | Epitélio do endoderma; linfócitos hematopoéticos | + "conjuntivo da cápsula e dos septos, da crista neural" | Coerência com emb-12 | menor | emb-12; Sadler 14ª ed. |
| estrutura `septo-conjuntivo` (nova) e `trabecula` | estruturas | O septo tímico estava dentro de `trabecula` ("no timo, os septos delimitam lóbulos incompletos") | Nova `septo-conjuntivo`, "Septo interlobular do timo", com o id da lâmina `timo`. `trabecula` fica para linfonodo e baço (id usado pelas lâminas `linfonodo` e `baco`) | Alinhamento com o id da lâmina. **Nenhum id foi mudado ou removido**: só acrescentado | menor | `laminas-sistemas-a.json` (lâmina `timo`) |
| estrutura `corpusculo-de-hassall` | definicao | "Produz citocinas, como a TSLP, que ajudam a gerar Treg" | "Sua função não está totalmente esclarecida; no timo humano, produz TSLP, que leva células dendríticas a induzir Treg" | Coerência com a lâmina e precisão (o achado é humano e o efeito passa pelas células dendríticas) | menor | Watanabe et al., Nature 2005 (resumo) |
| his-12-q26 (+ nota, referência) | explicacao; nota | Via fechada apresentada como alternativa sem ressalva | Via fechada "descrita nos livros"; reconstruções 3D do baço humano indicam circulação inteiramente aberta | Atualização. A ordem cobrada (via aberta) não muda | menor | Steiniger et al., Sci Rep 2022 (resumo) |
| resumo (Seleção positiva) | texto | "afinidade moderada" | "afinidade baixa a moderada" | Coerência com a q05 e com Abbas | menor | Abbas 10ª ed. |
| incertezas (APS-1); referência Kisand | incerteza | Autoanticorpos contra IL-17/IL-22 "conferidos no resumo, sem texto integral" | Conferidos no texto integral (IL-17A 41%, IL-17F 75%, IL-22 91% em > 150 pacientes) | Fonte lida | menor | Kisand et al., J Exp Med 2010 (PMC2822605) |

## 3. Fontes conferidas (3ª verificação): URL e trecho decisivo

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| Nota Técnica nº 83/2025-CGICI/DPNI/SVSA/MS | https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2025/nota-tecnica-no-83-2025-cgici-dpni-svsa-ms.pdf/@@download/file (assinada em 27 e 30/06/2025) | "2.3 … a VPC13 encontra-se disponibilizada em esquemas seguida da vacina Pneumocócica 23-valente (VPP23) nas seguintes condições: … Asplenia anatômica ou funcional e doenças relacionadas." |
| **Nota Técnica nº 52/2026-CGICI/DPNI/SVSA/MS** | …/notas-tecnicas/2026/nota-tecnica-no-52-2026-cgici-dpni-svsa-ms.pdf/@@download/file (assinada em 20–21/05/2026) | "4.1 … ≥ 5 anos (incluindo adultos): dose única (exceto … TCTH e CAR-T)"; "Iniciar a administração da VPC20 somente após o esgotamento dos estoques da VPC13 e VPP23. Lembrar que indivíduos vacinados com a VPC20 não deverão receber mais a VPP23"; "6.1 … 6. Asplenia anatômica ou funcional e doenças relacionadas." |
| Nota Técnica nº 64/2026-DPNI/SVSA/MS | …/notas-tecnicas/2026/nota-tecnica-no-64-2026-dpni-svsa-ms.pdf/@@download/file | Atualiza só o registro da Dose Única: "de '≥ 5A < 60A' para '≥ 5A'". |
| Manual dos CRIE, 6ª ed., 2023 | https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2024/manual-dos-centros-de-referencia-para-imunobiologicos-especiais-6a-edicao/@@download/file (a cópia em bvsms recusava acesso) | 5.1: "Nos pacientes que serão submetidos à esplenectomia eletiva, a vacinação deverá preceder o procedimento cirúrgico pelo período mínimo de 14 dias"; "necessitam de vacinas varicela, hepatite A, influenza inativada e contra germes capsulados: pneumococo, meningococo e Haemophilus influenzae tipo b". MenACWY: "1. Asplenia anatômica e funcional…". Cap. 15: "A vacina meningocócica B não está disponível no SUS." |
| Mbaeyi et al., MMWR Recomm Rep 2020 | Europe PMC, PMC7527029 (texto integral) | "Among persons undergoing elective splenectomy, meningococcal vaccines should be administered at least 2 weeks before surgery, if possible; otherwise … after the procedure as soon as the patient's condition is stable"; MenB "aged ≥10 years … anatomic or functional asplenia". |
| Sanders et al., Neurology 2016 | PMC4977114 (texto integral) | "With rare exceptions, all patients with MG with thymoma should undergo surgery to remove the tumor. Removal of the thymoma … may not produce improvement in MG." |
| Narayanaswami et al., Neurology 2021 (atualização 2020) | PMC7884987 (texto integral) | "In nonthymomatous, generalized MG patients with AChR-Ab, aged 18–50 years, thymectomy should be considered early in the disease…" |
| Kisand et al., J Exp Med 2010 | PMC2822605 (texto integral) | "neutralizing autoantibodies against IL-17A (41%), IL-17F (75%), and/or IL-22 (91%) in >150 APECED patients". |
| Louveau et al., Nature 2015 | PMC4506234 (texto integral) | "we discovered functional lymphatic vessels lining the dural sinuses" (camundongo); "We identified a potentially similar structure in human dura". |
| Klein et al., Nat Rev Immunol 2014 | OAI do PMC, PMC4757912 (texto integral; o Europe PMC deu erro 500) | "5 × 10⁵ cells per day undergo negative selection in the cortex … around two-fold higher than the number of cells believed to undergo negative selection in the medulla". O texto integral de Stritesky et al. 2013 (PMC3606987) não abriu (Europe PMC 500; OAI "unsupported"). |
| Leoni et al., J Cardiovasc Med 2023 | PMC10836786 (texto integral) | "WPW occurs when the electrocardiographic sign – short PR and delta wave – corresponds to symptoms referable to PSVT"; "while the right APs penetrate through the annulus fibrosus, the left pathways more often 'bypass' the annulus with an epicardial course." |
| Mohan et al., Indian Pacing Electrophysiol J 2019 | PMC6904806 (texto integral) | "ventricular preexcitation … WPW pattern … without symptoms … WPW syndrome … with symptoms". |
| Loesch e Dashwood, J Cell Commun Signal 2018 | PMC6235771 (texto integral) | "The vasa vasorum … is more pronounced and penetrates deeper towards the lumen in veins than in arteries." |
| Phillippi, Sci Adv 2022 | PMC9020663 (texto integral) | "Vasa vasorum in veins also lie within the adventitia and penetrate the media in close proximity to the lumen." |
| Lindsey et al., Am J Physiol Heart Circ Physiol 2018 | PMC5966768 (texto integral) | "the subendocardium is spared from death by diffusion of oxygen from the LV cavity" (modelo murino). |
| Furchgott e Zawadzki, Nature 1980 | E-utilities, PMID 6253831 (resumo) | "relaxation … by ACh requires the presence of endothelial cells, and … ACh, acting on muscarinic receptors of these cells…"; em tiras atritadas, "graded contractions … mediated by muscarinic receptors". |
| Gordon et al., Nat Immunol 2004 | PMID 15098031 (resumo) | "cortical and medullary thymic epithelial compartments derive from a single germ layer, the endoderm". |
| Watanabe et al., Nature 2005 | PMID 16121185 (resumo) | "human Hassall's corpuscles express … TSLP … TSLP-conditioned dendritic cells … induce … CD4⁺CD25⁺FOXP3⁺ regulatory T cells". |
| Roco et al., Immunity 2019 | PMID 31375460 (resumo) | "CSR is triggered prior to differentiation into GC B cells or plasmablasts and is greatly diminished in GCs". |
| Douek et al., Nature 1998 | PMID 9872319 (resumo) | "although thymic function declines with age, substantial output is maintained into late adulthood". |
| Steiniger et al., Sci Rep 2022 | PMID 36182999 (resumo) | "the human splenic microcirculation is entirely open". |
| Metadados das 8 citações originais | esummary (E-utilities) | Autores, revista, ano, volume, páginas, DOI e PMID batem nas 8 citações. |
| Inacessível | NCBI Bookshelf (StatPearls) | Verificação reCAPTCHA. Substituído pelas revisões acima. |

## 4. Coerência com outros tópicos e lâminas

- **emb-12**: o timo vem da parte ventral da 3ª bolsa (endoderma), com conjuntivo da crista neural (acrescentado em his-12); a tonsila palatina vem da 2ª bolsa. Na 22q11.2, a hipoplasia é a regra e a aplasia é rara (his-12 agora diz "pode esvaziar"). Coerente.
- **emb-13, emb-23 e emb-24**: o endotélio vem de angioblastos e o epicárdio do proepicárdio (his-11 não contradiz). Linfáticos e ducto torácico: coerente.
- **emb-15**: baço do mesênquima do mesogástrio dorsal. Coerente.
- **his-04, his-08, his-09 e his-10**: `macrofago`, `plasmocito`, `linfocito`, `fibras-elasticas`, `fibra-muscular-lisa`, `fibra-muscular-cardiaca` e `fibra-de-purkinje` têm definições compatíveis. A barreira hematoencefálica (q19) usa a mesma redação de his-10 (pericitos e astrócitos). Marfan remete a his-04.
- **Lâminas do grupo A** (já desenhadas quando conferi):
  - `aorta`: `lumen`, `endotelio`, `tunica-intima`, `fibras-elasticas`, `tunica-media`, `tunica-adventicia`, `vasa-vasorum` existem em his-11 com definições compatíveis.
  - `feixe-neurovascular`: `lumen`, `tunica-intima`, `lamina-elastica-interna`, `tunica-media`, `tunica-adventicia` e `veia-de-medio-calibre` são compatíveis; a causa da ondulação da LEI foi alinhada. `nervo` e `adipocito-unilocular` só estão na lâmina; não há conflito de id.
  - `linfonodo`: todos os 9 ids existem em his-12, com definições compatíveis.
  - `baco`: todos os 8 ids existem. A lâmina usa `polpa-vermelha` apontando para os cordões; his-12 tem `polpa-vermelha` e também `cordoes-esplenicos`, que é compatível.
  - `timo`: 6 dos 7 ids existiam; `septo-conjuntivo` foi acrescentado (ver tabela).

## 5. Pontos para o revisor humano

1. **Vacinação na asplenia (his-12)**: confirmar a redação nova (VPC20 em dose única a partir de 5 anos, substituindo a VPC13 seguida da VPP23 à medida que se esgotam os estoques; Manual dos CRIE: vacinar ≥ 14 dias antes da esplenectomia eletiva). Não foram lidos a Portaria GM/MS nº 6.623/2025 (que institui a RIE) nem eventuais informes posteriores a 26/06/2026. Nenhuma questão cobra esquema vacinal.
2. **Seleção negativa**: os dados quantitativos (deleção cortical maior que a medular) são de camundongo, e os livros de histologia ainda situam a seleção negativa na medula. O conteúdo agora diz "no córtex e na medula". Decidir se mantém essa redação. A lâmina `timo` (só leitura para mim) diz, nos destaques, "na medula, a seleção negativa contra antígenos próprios"; sugiro ao revisor da lâmina acrescentar "e também no córtex".
3. **Circulação esplênica**: Steiniger et al. 2022 reconstruíram regiões limitadas de baço humano. Decidir se a q26 deve continuar citando a via fechada "descrita nos livros".
4. **Fatos de Robbins 10ª ed. a conferir no livro impresso**: extensão do infarto subendocárdico (terço a metade interna) e faixa poupada em autópsia humana; aortite sifilítica (endarterite obliterante dos vasa vasorum); BCL2 ausente nos centros germinativos normais e presente no linfoma folicular; zonas T pobres em linfócitos na DiGeorge; hiperplasia folicular do timo na miastenia; padrões de linfadenite reacional; ordem dos territórios mais acometidos pela aterosclerose.
5. **Não alterado, a conferir**:
   - his-11-q14, explicação de (c): "Músculo cardíaco na adventícia… existe apenas nas veias cavas e pulmonares". Conferir em Ross 8ª ed. em que túnica ficam as extensões miocárdicas. A alternativa continua claramente errada de qualquer modo.
   - Resumo e estrutura `pericito`: "podem originar células endoteliais e musculares lisas no reparo" é afirmação dos livros. Não verifiquei a literatura de rastreamento de linhagem; não é cobrado.
6. **Números de capítulo**: Junqueira 14ª ed. (citado pela numeração da 13ª), Kierszenbaum 5ª ed. e títulos de Robbins e Abbas continuam de memória. Ross 8ª ed. cap. 13 (cardiovascular) e 14 (linfático) são compatíveis com a numeração usada nos relatórios H1–H3.
7. **Notas de divergência sem fonte lida** (não cobradas): calibre da arteríola (Ross < 0,1 mm × Junqueira < 0,5 mm) e número de lâminas elásticas da aorta (40 a 70; a lâmina usa o mesmo número).
