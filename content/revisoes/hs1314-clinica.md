# Revisão HS13–14: dermatologia e gastroenterologia (pele e anexos; tubo digestivo)

- Agente: `revisor-derma-gastro-v1` (2ª etapa, revisão transversal clínica, área "dermatologia/gastroenterologia")
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, com a 3ª verificação (fonte primária no texto integral). Acesso só por curl: Europe PMC, E-utilities do PubMed, OAI do PMC e gov.br. WebFetch não foi usado. Formato: `docs/conteudo-schema.md`.
- Arquivos editados: `content/histologia/topicos/his-13-pele.json` e `his-14-tubo-digestivo.json`. Mais nenhum, além deste relatório.
- Lidos para integrar, sem edição: relatório da 1ª etapa (`content/revisoes/hs1314-histologia.md`), Barrett no `his-02`, hemorroidas no `emb-15` e no `his-11`, seções C e H de `docs/pendencias-conferencia-medica.md`.
- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.

## 1. Resumo

Revisei integralmente os dois tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, 59 questões, referências, notas de divergência e incertezas. O foco foi a aplicação clínica. Toda conduta e todo número clínico foram conferidos no texto integral de diretriz vigente, de preferência brasileira.

**Não encontrei gabarito errado nem fato errado cobrado em questão.** Nenhum `correta`, `ordemCorreta`, `pares`, id, alternativa, enunciado ou vinheta foi alterado. As mudanças estão em explicações, correlações, resumo, pontos-chave, uma definição de estrutura, referências, notas e incertezas.

Três problemas foram classificados como importantes:

1. **Queimaduras profundas e enxerto (his-13).** O resumo, o ponto-chave, a correlação e as explicações das q09, q10 e q28 diziam só que a lesão de espessura total "reepiteliza pelas bordas". Não diziam que, salvo lesões muito pequenas, ela é tratada com excisão e enxerto. O aluno podia concluir que ela cura sozinha. Também não diziam que o 2º grau profundo costuma precisar de cirurgia.
2. **q13 do his-13 (melanoma).** A explicação afirmava que a lesão "preenche a regra ABCDE", incluindo o diâmetro, que a vinheta não informa.
3. **Doença celíaca (his-14).** A correlação trazia só a conduta europeia (ESsCD 2025), inclusive o diagnóstico sem biópsia em adultos. Faltava a posição do PCDT brasileiro de 2025: biópsia obrigatória salvo poucas exceções, IgA total junto com a tTG IgA e genotipagem HLA não incorporada ao SUS.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-13 Pele e anexos | 29 | 0 | 2 | 6 | 8 | aprovado-com-correcoes |
| his-14 Tubo digestivo | 30 | 0 | 1 | 9 | 10 | aprovado-com-correcoes |
| **Total** | **59** | **0** | **3** | **15** | **18** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável, explicação incorreta ou conduta incompleta que leva a erro;
- **menor**: redação, terminologia, precisão ou referência.

### Checagens por script

- **Identidade.** Comparei com a cópia dos arquivos anterior a esta revisão. Ids de tópico, estruturas, eventos, correlações, questões, alternativas e itens estão iguais. Também não mudaram `tipo`, `correta`, `ordemCorreta`, `pares`, `dificuldade`, `bloom`, enunciados e vinhetas.
- **Letras citadas.** Nas 35 questões de múltipla escolha, a explicação continua citando a letra de cada alternativa.
- **Distribuição das letras corretas.** Não mudou: his-13 a4/b4/c5/d4; his-14 a5/b4/c5/d4.
- **Registro.** `revisao.humano` continua `null`, e há uma entrada nova em `revisao.agentes` em cada arquivo.

### Fontes conferidas no texto integral

| Tema | Fonte (acesso) | Trecho decisivo |
|---|---|---|
| Queimaduras: profundidade e cirurgia | Jeschke et al., Nat Rev Dis Primers 2020, PMC7224101 (Europe PMC) | "Deep partial-thickness (second-degree) burns … are less painful … drier, require surgery and will scar. A full-thickness (third-degree) burn extends through the full dermis … and, unless very small, surgical management. Finally, a fourth-degree burn involves injury to deeper tissues, such as muscle or bone". |
| Queimaduras | Toussaint e Singer, Clin Exp Emerg Med 2014, PMC5052819 | "Full thickness or third-degree burns extend through the entire thickness of the dermis"; "Fourth degree burns extend through the entire skin thickness including the fat"; "deep partial thickness and full thickness burns generally require consultation with a burn specialist for possible excision and grafting". |
| Enxerto | Rowan et al., Crit Care 2015, PMC4464872 | "The standard for rapid and permanent closure of full-thickness burns is a split-thickness skin graft from an uninjured donor site on the same patient (autograft)". |
| Área doadora | Serebrakian et al., Plast Reconstr Surg Glob Open 2018, PMC6191241 | "Once an STSG is harvested, an iatrogenic wound remains at the donor site that heals by reepithelialization from underlying dermal appendages over 7–10 days". |
| Cartilha do MS (queimaduras) | bvsms.saude.gov.br e www.gov.br/saude | **Não lida.** bvsms respondeu HTTP 403, como na 1ª etapa. Procurei no www.gov.br/saude nas páginas "Saúde de A a Z" (letra Q), nas listas de cartilhas, manuais e guias de 2016 a 2026 e na busca do portal (a API REST pede autorização). Não achei a cartilha nem outra página do MS com a classificação. |
| Melanoma: ABCDE e rastreamento | INCA, https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-melanoma (aba para profissionais "Atualizado em 31/07/2023"; introdução de 07/07/2023) | "Diâmetro: maior que 6 milímetros"; "Alguns melanomas não são pigmentados"; "Não há evidência científica de que o rastreamento do câncer de pele melanoma na população em geral traga mais benefícios do que riscos e, portanto, até o momento, ele não é recomendado"; "o melanoma representa apenas 4% das neoplasias malignas do órgão. É o tipo mais grave". |
| Câncer de pele não melanoma | INCA, …/pele-nao-melanoma (introdução de 27/05/2025; aba para profissionais de 07/07/2023) | "carcinoma basocelular (o mais comum e também o menos agressivo)"; "Não há evidência científica de que o rastreamento do câncer de pele não melanoma na população em geral traga mais benefícios do que riscos e, portanto, até o momento, ele não é recomendado". |
| Breslow | ICCR, Scolyer et al., Am J Surg Pathol 2013, PMC3864181 | "Breslow thickness is the single most important prognostic factor for clinically localized primary melanoma … measured from the top of the granular layer of the epidermis (or, if the surface is ulcerated, from the base of the ulcer)". |
| CBC: via Hedgehog | Chmiel et al., Cells 2022, PMC9601130 | "The Hh pathway mostly depends on inactivating mutations in a negative regulator, PTCH1, or less often on activating mutations in a positive regulator, SMO"; "Due to its low metastatic potential, local surgical treatment is the treatment of choice". |
| Psoríase | PCDT da Psoríase, Portaria Conjunta nº 18, de 14/10/2021, https://www.gov.br/saude/pt-br/assuntos/pcdt/p/psoriase (PDF em `@@download/file`) | "placas eritemato-escamosas … bordas bem delimitadas … escamas … branco-prateadas … deixam pontilhado sanguinolento ao serem removidas … joelhos, cotovelos, couro cabeludo"; histologia com "perda da camada granular, paraceratose", dilatação dos vasos papilares e "microabcessos de Munro". O Consenso Brasileiro de Psoríase da SBD (2020, PMC8790202; destaques de 2025, PMC12650776) trata sobretudo de tratamento. |
| Vitiligo | Consenso da SBD, Dellatorre et al., An Bras Dermatol 2020, PMC7772607 | "Vitiligo is a muco-cutaneous, autoimmune … disease, which manifests through hypochromic or achromic macules"; "effector autoreactive CD8+ T lymphocytes … destroying melanocytes". |
| Albinismo | Marçon e Maia, An Bras Dermatol 2019, PMC6857599 | "normal number of melanocytes in the epidermis and follicles, but the melanin pigment is totally or partially absent"; "OCA1A … total absence of melanin production"; nistagmo e hipoplasia da fóvea. |
| Acne | Consenso latino-americano, Rocha et al., An Bras Dermatol 2024, PMC11074621 | "Acne is a chronic immune-inflammatory disorder of the pilosebaceous unit … comedones, papules, pustules, nodules, or cysts … sequelae such as scarring". |
| Barrett | ACG 2022, Shaheen et al., PMC10259184 (OAI do PMC; o Europe PMC deu erro 500) | "the normal squamous epithelium is replaced by specialized columnar epithelium with goblet cells"; "BE is the only known precursor lesion of esophageal adenocarcinoma"; "surveillance … at intervals dictated by the degree of dysplasia"; "segment length is a risk factor for progression". Não achei diretriz brasileira (FBG ou SOBED) em rede liberada. |
| H. pylori e metaplasia intestinal | V Consenso Brasileiro, Coelho et al., Arq Gastroenterol 2026;63:e26043, PMC13460752; errata PMC13637691 | Afirmação 4: "H. pylori infection is considered the leading cause of chronic gastritis … peptic ulcer disease, gastric adenocarcinoma, and gastric MALT lymphoma"; erradicação em toda gastrite associada. Afirmação 8: atrofia e metaplasia intestinal "possess the potential for regression following H. pylori treatment"; a displasia tem "a lower chance of regression". Seção de histologia: "H. pylori is easily identified using hematoxylin and eosin (H&E) staining. Special staining techniques (such as Giemsa) and immunohistochemistry increase the probability of detection". O **IV Consenso** (2018, PMID 30043876) não abriu: doi.org recusou o túnel e www.scielo.br pediu verificação por JavaScript. Ele foi substituído pelo V. |
| Gastrite autoimune × adenocarcinoma | Liu et al., BMC Gastroenterol 2026, PMC13181878 (texto integral); Rugge et al., Gut 2023, PMID 35772926 (resumo); He et al., Helicobacter 2025, PMID 41398405 (resumo); ARIOSO, Dig Liver Dis 2026, PMID 41198445 (resumo) | Liu: "AIG may be a potential independent risk factor for GC particularly in H. pylori-negative patients", com I² de 77%. Rugge: "corpus-restricted inflammation/atrophy does not increase the GC risk. The excess of GC risk reported … could plausibly result from unrecognised previous/current H. pylori comorbidity". He: "HP-naïve status does not confer protection". ARIOSO: "increased risk of gastric type 1 neuroendocrine neoplasms and possibly gastric adenocarcinoma". |
| Doença celíaca (Brasil) | PCDT da Doença Celíaca, Portaria Conjunta SAES/SECTICS nº 8, de 23/06/2025 (revoga a Portaria SAS/MS nº 1.149/2015), https://www.gov.br/saude/pt-br/assuntos/pcdt/d/doenca-celiaca | "Ao menos seis fragmentos da mucosa intestinal, incluindo dois fragmentos do bulbo duodenal e quatro da segunda porção do duodeno"; "dosagem sérica simultânea do tTG IgA e da IgA total"; "o diagnóstico de doença celíaca deve ser sempre confirmado por exame histológico de biópsia de duodeno"; a dispensa de biópsia só aparece "segundo diretrizes internacionais" para parentes de primeiro grau sintomáticos (tTG IgA 10 vezes o limite e EMA positivo); genotipagem HLA "não foi incorporado ao SUS … não sendo, portanto, recomendado"; Marsh sem subdivisão ou Corazza e Villanacci; dieta isenta de glúten "por toda sua vida". |
| Doença celíaca (Europa) | ESsCD 2025, parte 1, PMC12704582; parte 2, PMC13097674 | "at least four biopsies from the distal duodenum, plus two from the duodenal bulb"; via sem biópsia "conditionally recommended for adults under 45 years with IgA anti-TG2 levels ≥ 10 × the upper limit of normal", confirmada numa segunda amostra; "A gluten challenge is required if a patient … has reduced or eliminated gluten from the diet before appropriate diagnostic evaluation"; "Confirm HLA-DQ2/DQ8 before starting a gluten challenge, as a negative result rules out CeD"; "Duodenal histology is the preferred endpoint"; a sensibilidade ao trigo não celíaca exige sorologia e testes de alergia normais "while on a gluten-containing diet". Parte 2: "The treatment for CeD is a lifelong adherence to a GFD". |
| Doença de Crohn | PCDT, Portaria Conjunta SAES/SCTIE nº 51, de 18/05/2026, …/pcdt/d/pcdt-doenca-de-crohn.pdf | "acometimento segmentar, assimétrico e transmural de qualquer porção do tubo digestivo, da boca ao ânus"; "O íleo, o cólon e a região perianal são os segmentos … mais acometidos"; a peça cirúrgica confirma "acometimento transmural, padrão segmentar e presença de granulomas não caseosos"; pela ECCO, não há achado patognomônico. |
| Retocolite ulcerativa | PCDT, Portaria Conjunta SAES/SECTICS nº 9, de 12/09/2024, …/pcdt/r/retocolite-ulcerativa | "acomete predominantemente a camada mucosa do cólon … usualmente afeta o reto … em geral de forma contínua"; "acometimento periapendicular em alguns pacientes com doença distal"; histologia: "distorção arquitetural difusa de criptas e infiltrado inflamatório transmucoso com plasmocitose basal … criptites e abscessos crípticos". |
| Hirschsprung | ERNICA, Rossi et al., J Pediatr Gastroenterol Nutr 2026, PMC13342790 | "delayed passage of meconium (>24 h in a term infant), abdominal distension, and bilious vomiting"; "at least 2 cm proximal to the dentate line or 3 cm from the anal orifice, and must contain a representative amount of submucosa"; "The presence of any number of ganglion cells on H&E staining excludes HSCR"; "acetylcholinesterase activity is increased, and calretinin immunohistochemistry is negative"; "(except within 1–2 cm of the transition zone)". A vinheta da q15 reproduz a tríade. |
| Adenocarcinoma gástrico difuso hereditário | IGCLC, Blair et al., Lancet Oncol 2020, PMC7116190 (OAI do PMC) | "largely caused by inactivating germline mutations in the tumour suppressor gene CDH1, although pathogenic variants in CTNNA1 occur in a minority of HDGC families"; "CDH1 encodes E-cadherin, a transmembrane protein that is localised to the adherens junctions". |
| Apendicite | Diretriz sueca, Salö et al., BJS Open 2025, PMC11980984 | "transmural invasion of neutrophils (gold standard)"; "pathologists apply different criteria"; "The aetiology of appendicitis is multifactorial, with obstruction, environment, gender, age, and genetic and immunological factors being important"; "The aetiology of appendicitis is not completely understood". |
| Hemorroidas (só para a proposta da seção 3) | Consenso da SICCR, Tech Coloproctol 2020, PMC7005095 | "the hemorrhoidal cushions are known to provide 15% of the patient's resting anal tone"; "differentiate HD from anorectal varices"; ligadura elástica "above the dentate line to avoid severe pain"; "The most common presentation of HD is painless rectal bleeding". |

Metadados das citações novas (autores, volume, páginas, DOI, PMID e PMC) conferidos pelas E-utilities e pelo Europe PMC.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-13 (resumo, pontosChave[10], `queimaduras-profundidade`, q09, q10, q28) | resumo; ponto-chave; descricao e mecanismo da correlação; explicações e referências das q09, q10 e q28 | "nas de espessura total, só pelas bordas"; "a conduta não é abordada aqui" | Cura mais lenta e com mais cicatriz quanto mais profunda a lesão; o 2º grau profundo costuma precisar de excisão e enxerto; o de espessura total, salvo lesões muito pequenas, precisa de cirurgia, com enxerto de pele parcial autólogo como padrão; a área doadora reepiteliza a partir dos anexos; na q09, a área B "precisará de excisão e enxerto"; na q10, o caso é ligado ao enxerto | O texto deixava supor que a lesão de espessura total cura pelas bordas sem cirurgia. O foco "enxerto" pedido para esta etapa não aparecia | importante | Jeschke 2020; Toussaint e Singer 2014; Rowan 2015; Serebrakian 2018 |
| his-13-q13 | explicacao | "A lesão preenche a regra ABCDE (assimetria, bordas, cor, diâmetro e evolução)" | "A lesão tem sinais de alerta da regra ABCDE … assimetria, bordas irregulares, cor variável e evolução (o diâmetro não foi informado; o critério é maior que 6 mm)" | A vinheta não informa o diâmetro | importante | INCA (melanoma, profissionais) |
| his-14 `doenca-celiaca` + q12 + q13 | descricao; explicações e referências das q12 e q13 | Só a ESsCD: "admite diagnóstico sem biópsia em adultos selecionados" | tTG IgA com IgA total; PCDT (2025) e ESsCD pedem seis biópsias; ESsCD admite a via sem biópsia, e o PCDT exige biópsia salvo poucas exceções; dieta por toda a vida (PCDT e ESsCD); q13: genotipagem HLA não incorporada ao SUS | Faltava a diretriz brasileira vigente, que diverge da europeia numa conduta. A deficiência de IgA (falso-negativo) não aparecia | importante | PCDT da Doença Celíaca 2025; ESsCD 2025 partes 1 e 2 |
| his-13 `queimaduras-profundidade` + notas + incertezas | descricao; notasDivergencia; incertezas | "toda a derme, às vezes com a hipoderme"; nota: a gordura "que a classificação brasileira inclui no 3º" | "a lesão da hipoderme entra no 3º grau em algumas classificações e no 4º em outras"; nota e incerteza registram que a cartilha do MS não pôde ser lida | Atribuição a uma fonte não lida. Pelas fontes lidas, o 3º grau é toda a derme, e Toussaint e Singer põem a gordura no 4º grau | menor | Jeschke 2020; Toussaint e Singer 2014; tentativa no bvsms e no gov.br |
| his-13 `melanoma` | descricao | "não recomenda rastreamento populacional" | "… do câncer de pele, melanoma ou não melanoma" | O INCA diz o mesmo nas duas páginas | menor | INCA (melanoma e não melanoma) |
| his-13-q13 | explicacao | Breslow "medida da camada granulosa" | "medida do topo da camada granulosa" | Precisão (ICCR) | menor | ICCR 2013 |
| his-13 `carcinoma-basocelular` + q11 | mecanismo; referencia da q11 | "mutações que ativam a via Hedgehog (como as de PTCH1)" | "alterações que ativam a via Hedgehog, sobretudo mutações que inativam o gene supressor PTCH1"; INCA não melanoma citado na q11 | O PTCH1 é inibidor da via; suas mutações o inativam | menor | Chmiel 2022; INCA |
| his-13-q10 | explicacao | "(com a bainha radicular externa e as células-tronco da protuberância)" | "(sobretudo a bainha radicular externa)" | A protuberância nem sempre fica na área doadora: depende da espessura retirada | menor | Serebrakian 2018 (anexos dérmicos, sem especificar a protuberância) |
| his-13 q14, q15, q16 + incertezas + referências | referencia; incertezas; referencias | Psoríase, acne, vitiligo e albinismo só em Robbins, de memória | PCDT da Psoríase 2021, consenso latino-americano de acne 2024, consenso da SBD de vitiligo 2020 e Marçon e Maia 2019 citados; incertezas atualizadas; 8 referências novas | Registro da conferência em fonte brasileira | menor | ver seção 1 |
| his-14 `barrett-biopsia` | descricao | displasia "o que define o risco" | "o grau orienta o risco de progressão e o intervalo de vigilância, e o comprimento do segmento também pesa (ACG, 2022)" | Simplificação: o comprimento do segmento também é fator de risco | menor | ACG 2022 |
| his-14 `gastrite-h-pylori` | descricao | "mais bem vista com Giemsa, impregnação pela prata ou imuno-histoquímica" | "costuma ser vista na HE, e o Giemsa, a impregnação pela prata ou a imuno-histoquímica aumentam a detecção" | O consenso diz que a HE identifica a bactéria com facilidade | menor | V Consenso Brasileiro 2026 |
| his-14 `gastrite-h-pylori` + q10, q27 | mecanismo; referências | Sem a posição do consenso brasileiro | Atrofia e metaplasia intestinal são condições pré-cancerosas que podem regredir após a erradicação, e a displasia regride menos; o V Consenso recomenda erradicar em toda gastrite associada | Integração do foco "H. pylori e metaplasia intestinal" com a diretriz brasileira vigente | menor | V Consenso Brasileiro 2026 (afirmações 4 e 8) |
| his-14 `gastrite-autoimune` + nota | descricao; notasDivergencia | Debate "porque pode depender de infecção … pelo H. pylori". Nota: estudo prospectivo "não encontrou câncer" | Os dois lados: estudo prospectivo sem H. pylori sem excesso de risco × metanálises recentes com risco aumentado também sem a infecção. Nota: "não achou excesso de risco", com as quatro fontes e o tipo de leitura de cada uma | Debate apresentado de um lado só; a nota exagerava o resultado de Rugge | menor | Rugge 2023; Liu 2026; He 2025; ARIOSO 2026; Ahn e Kim 2025 |
| his-14 `crohn-retocolite` + q14, q22 + nota | descricao; referências; notasDivergencia | RCU "a partir do reto e de modo contínuo" | "… e, em geral, de modo contínuo"; nota com o acometimento periapendicular e a descrição do Crohn no PCDT | O PCDT registra exceções à continuidade | menor | PCDT da RCU 2024; PCDT da Doença de Crohn 2026 |
| his-14 `adenocarcinoma-gastrico` + q16 | descricao; explicacao; referencia | "Mutações germinativas de CDH1 causam o câncer gástrico difuso hereditário" | "… causam a maioria dos casos … (uma minoria tem variantes de CTNNA1)" | Precisão | menor | IGCLC 2020 |
| his-14-q23 | explicacao | A obstrução "favorece a distensão, a isquemia e a invasão bacteriana" | "… é o mecanismo clássico …, mas a diretriz sueca considera a etiologia multifatorial e não totalmente compreendida" | Mecanismo apresentado como único. O V/F, sobre o critério histológico, não muda | menor | Salö et al. 2025 |
| his-14 `muscular-externa` | definicao | "músculo esquelético no terço superior do esôfago" | "…, na descrição clássica" | Coerência com a q04, o resumo e o ponto-chave corrigidos na 1ª etapa | menor | Meyer et al. 1986 (1ª etapa) |
| his-14 notas, incertezas, referências | notasDivergencia; incertezas; referencias | PCDT da doença celíaca e IV Consenso "não consultados"; CDH1 de memória | 3 notas novas (PCDT × ESsCD na doença celíaca; RCU e Crohn nos PCDT; Barrett no ACG integrado ao his-02); incertezas atualizadas (PCDT, V Consenso, IGCLC) e nova incerteza sobre hemorroidas; 8 referências novas | Registro da conferência | menor | ver seção 1 |

## 3. Pontos para o revisor humano

1. **Classificação brasileira das queimaduras.** A cartilha do MS segue inacessível: bvsms respondeu HTTP 403, e não achei nada no www.gov.br/saude.
   - O texto agora diz que a hipoderme entra no 3º grau em algumas classificações e no 4º em outras.
   - Se a escola ensina pela cartilha (3º grau incluindo o tecido subcutâneo), basta confirmar no impresso e, se quiser, voltar a dizer isso com a citação.
   - A pendência deveria entrar na seção C de `docs/pendencias-conferencia-medica.md`. Não editei esse arquivo, que está fora do escopo.
2. **Enxerto.** A frase nova diz que o 2º grau profundo "costuma precisar" de excisão e enxerto, como Jeschke e Toussaint e Singer.
   - No Brasil, parte dos serviços trata o 2º grau profundo pequeno com curativo.
   - Conferir se a redação serve à escola.
3. **Doença celíaca.** A correlação mostra a divergência entre o PCDT de 2025 e a ESsCD de 2025 (via sem biópsia; Marsh com ou sem subtipos; HLA).
   - Nenhuma questão cobra a via sem biópsia.
   - Se o jogo for usado para Revalida ou residência no Brasil, decidir se a posição do PCDT deve vir primeiro, como está agora.
4. **Gastrite autoimune e adenocarcinoma.** O texto apresenta os dois lados sem números.
   - O estudo de Rugge e as metanálises de He e do ARIOSO foram lidos só no resumo; Liu, no texto integral.
5. **H. pylori.** O IV Consenso Brasileiro pedido não abriu. Usei o V, de 2026, que o substitui.
   - A frase acrescentada (regressão de atrofia e metaplasia após erradicação; erradicação em toda gastrite por H. pylori) vem das afirmações 4 e 8.
6. **Barrett.** Não achei diretriz brasileira em rede liberada.
   - A integração com o his-02 (ACG 2022 × BSG 2014) ficou registrada nas notas.
   - As biópsias de Seattle e os intervalos de vigilância não foram incluídos.
7. **Hemorroidas e canal anal: lacuna, sem edição.** O his-14 não fala dos coxins vasculares do canal anal nem das hemorroidas.
   - O tema está só no emb-15 (q30: hemorroida interna indolor acima da linha pectínea; externa trombosada dolorosa abaixo).
   - **Proposta, não implementada:** uma frase no parágrafo do canal anal: "a submucosa da parte superior tem coxins vasculares, que contribuem para a continência; seu deslizamento e dilatação formam as hemorroidas internas, que sangram sem dor". Fonte: consenso da SICCR 2020, PMC7005095.
   - Fora do escopo: o his-11 descreve as hemorroidas como "dilatações venosas", ao lado das varizes. O consenso da SICCR as distingue das varizes anorretais. Vale revisar no his-11.
8. **Acne.** O papel dos andrógenos, da queratinização do infundíbulo e de *Cutibacterium acnes* segue Robbins, de memória. O consenso latino-americano lido trata de definição e tratamento.
9. **Pendências da 1ª etapa que continuam.**
   - Capítulos de Junqueira 14ª ed. e de Ross 8ª ed. citados de memória.
   - Afirmações de Ross de memória (pele do dorso, linhas de Langer, fossetas do antro).
   - Modo de secreção das "apócrinas".
10. **Selo.** Até a conferência médica, os dois tópicos devem aparecer com "Revisado por IA · conferência médica pendente".

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

A única falha é de lâmina: o desenho `pulmao` ainda não tem entrada nos arquivos de lâminas. É a mesma falha registrada na 1ª etapa. Esses arquivos estão sendo escritos por outro agente e não têm relação com os dois tópicos revisados. Ela foi registrada e ignorada, como pedido.

Os scripts temporários e as fontes baixadas ficaram em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hs1314-cli/`. Não fiz commit.
