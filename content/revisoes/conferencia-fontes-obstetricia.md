# Conferência de fontes primárias: bloco de obstetrícia

- **Agente:** `conferencia-fontes-v1`. Olhar de obstetrícia e medicina fetal.
- **Data:** 2026-11-09
- **Tarefa:** fechar os itens que as duas etapas de revisão deixaram "a conferir no texto integral" porque os documentos não abriam na rede da sessão. A rede foi liberada. Os documentos abaixo foram baixados com `curl` e lidos no texto integral: PDFs convertidos com `pdftotext -layout`, HTML convertido em texto puro. As cópias de trabalho ficaram fora do repositório, na pasta temporária da sessão.
- **Arquivos editados (só estes):**
  - `content/embriologia/topicos/emb-01-introducao.json`
  - `content/embriologia/topicos/emb-08-periodo-fetal.json`
  - `content/embriologia/topicos/emb-10-malformacoes.json`
  - `content/embriologia/topicos/emb-18-sistema-nervoso.json` (só a dose de ácido fólico)
- **Garantias.** Um script comparou cada arquivo com a cópia feita antes da edição:
  - nenhum id mudou; nenhuma letra correta, alternativa, par, enunciado, contexto ou ordem de evento mudou;
  - `revisao.humano` continua `null` nos quatro arquivos;
  - foi acrescentada uma entrada `conferencia-fontes-v1` ao fim de `revisao.agentes` em cada arquivo;
  - a formatação original dos JSON foi preservada, porque a edição substituiu trechos exatos;
  - nada foi commitado.
- **Observação sobre a FEBRASGO.** O site da FEBRASGO foi reorganizado, e os links antigos dos PDFs (`/images/pec/...`, `/media/k2/...`) agora dão 404. Os arquivos atuais foram achados pela API pública do site (`/wp-json/wp/v2/media?search=...`) e estão em `/wp-content/uploads/2026/05/`.

## 1. Resumo

| # | Item | Resultado | Mudança |
|---|---|---|---|
| 1 | Redatação pelo CCN (emb-01-q26 e resumo) | **Confirmado.** O consenso CBR/FEBRASGO redata acima de 5 dias até a 9ª semana. O Protocolo FEBRASGO n. 63 redata a partir de 5 dias. Com diferença de ~9 dias, (c) vale por todos os critérios | Referências (consenso CBR/FEBRASGO, FEBRASGO n. 63, Manual de gestação de alto risco do MS); nota de divergência reescrita; incerteza reduzida ao texto integral do ACOG CO 700. Resumo, enunciado e explicação **inalterados** |
| 2 | Ácido fólico em alto risco (emb-10, emb-18) | **Confirmado.** FEBRASGO: 4 mg/dia, a partir de 30 dias antes da concepção. MS: 5 mg/dia, de 60 a 90 dias antes (CAB 32); 4 a 5 mg/dia no Manual de gestação de alto risco | "4 mg/dia (FEBRASGO) ou 5 mg/dia (Ministério da Saúde)" explícito em emb-10 (resumo, ponto-chave, correlação, explicações de q16 e q31) e em emb-18 (correlação, explicação de q15). Alternativas mantidas |
| 3 | Radiação (emb-10-q33), ACOG CO 723 | **Parcial.** CO 723 vigente, **reafirmado em 2026** (o conteúdo dizia 2021). Limiar de 50 mGy **não conferido** no texto integral | Ano da reafirmação corrigido (referência, campo `referencia` da q33, incerteza). O número 50 mGy **não** entrou na explicação |
| 4 | RCIU (emb-08-q34), ACOG PB 227 e 226 | **PB 226 substituído** em jan. 2026 (Practice Advisory da ACOG + SMFM Consult #74). PB 227 vigente, texto integral fechado. **Há protocolo FEBRASGO vigente**: n. 90, 3ª ed., 2025 | Referências atualizadas em q30, q33 e q34; FEBRASGO n. 90 e n. 63 acrescentadas; gabarito (b) sustentado pela FEBRASGO |
| 5 | Proteção térmica do prematuro (emb-08-q32) | **Confirmado** nas diretrizes SBP de 2022 e de 2026: corpo em saco plástico sem secar, touca dupla | Incerteza removida; referência de 2026 completada (autores, DOI, URL, item 5.3.1); SBP 2022 acrescentada |
| 6 | Surfactante (emb-08) | **Sem fonte primária acessível.** Uma revisão secundária aberta é compatível com a faixa | Registrado em `notasDivergencia[1]`; a conferência fica para os livros (Moore e Sadler) |

Veredito por arquivo: emb-01 **aprovado** (sem correção de conteúdo); emb-08, emb-10 e emb-18 **aprovado-com-correcoes** (correções menores ou de referência).

## 2. Item 1: redatação da gestação pelo CCN (emb-01)

### Fontes lidas

1. **Consenso CBR/FEBRASGO.** Ofício OF/CBR/0111/2020, de 20/03/2020: "Normatização de exames de ultrassonografia" e protocolos de exames de ultrassom obstétrico.
   - URL: https://cbr.org.br/wp-content/uploads/2022/12/consenso-CBR-Febrasgo-GO.pdf
   - Seção "Ultrassonografia obstétrica inicial (endovaginal)", item "Idade gestacional", trecho decisivo:
     > "c. em caso de discordância de mais de 5 dias até a 9ª semana e de 7 dia ou mais entre 9ª semana e 14ª semana, re-definir a idade gestacional e informar a nova data provável do parto (pela ultrasonografia)."
2. **FEBRASGO. Ultrassonografia no primeiro trimestre de gestação.** São Paulo: FEBRASGO; 2021 (Protocolo FEBRASGO-Obstetrícia n. 63).
   - URL: https://www.febrasgo.org.br/wp-content/uploads/2026/05/O-Ultrassonografia-no-primeiro-trimestre-de-gestacao-2026-05-13.pdf
   - Seção "Cálculo da idade gestacional", p. 9–10:
     > "No primeiro trimestre, se a data da última menstruação (DUM) for conhecida e os ciclos menstruais forem regulares, mantém-se a idade gestacional (IG) calculada pela DUM quando a diferença da IG calculada pela DUM e a IG calculada pelo CCN for inferior a cinco dias; quando essa diferença for maior que ou igual a cinco dias, fica estabelecida como IG a calculada pelo CCN [...]. Em casos de fertilização assistida, a IG deve ser calculada pelo tempo decorrido desde a transferência embrionária ou dos gametas, acrescidos dos dias desde a data da fertilização em si [...] e das duas semanas que diferenciam a IG obstétrica da IG embriológica."
   - O protocolo anterior sobre o mesmo tema (n. 77, 2018, Santana et al.) também foi lido. Ele não traz regra de redatação.
3. **Brasil, Ministério da Saúde. Manual de gestação de alto risco.** Brasília; 2022.
   - URL: https://bvsms.saude.gov.br/bvs/publicacoes/manual_gestacao_alto_risco.pdf
   - Não fixa limiar numérico para redatar.
   - Item 9.2: "O exame ultrassonográfico no início da gestação, idealmente entre 9 e 12 semanas, é o método mais fidedigno para avaliação da idade gestacional".
   - Item 68.2.2.3: "Com sete semanas de gestação (medida do comprimento cabeça-nádega – CCN) o erro é de apenas três dias [...] 7 dias com 12 semanas".
4. **ACOG Committee Opinion n. 700** (para comparação).
   - URL: https://www.acog.org/clinical/guidance/committee-opinion/2017/05/methods-for-estimating-the-due-date
   - A página da ACOG confirma o documento como **vigente: "Number 700, May 2017, Reaffirmed 2025"**. O resumo também foi lido no PubMed (PMID 28426621).
   - O **texto integral não abriu**: fica em journals.lww.com, que dá "CONNECT tunnel failed, 403". Cópias de terceiros não foram usadas.
   - Por isso a tabela do ACOG (> 5 dias até 8 semanas e 6 dias; > 7 dias de 9 semanas a 13 semanas e 6 dias) segue conferida só em fontes secundárias.

### Limite antes de 9 semanas

| Fonte | Antes de 9 semanas | De 9 semanas a 13 semanas e 6 dias |
|---|---|---|
| ACOG CO 700 (secundária) | > 5 dias | > 7 dias |
| Consenso CBR/FEBRASGO (2020) | **> 5 dias** ("mais de 5 dias até a 9ª semana") | **≥ 7 dias** ("7 dias ou mais") |
| Protocolo FEBRASGO n. 63 (2021) | **≥ 5 dias** (sem faixas) | **≥ 5 dias** |
| Guias de APS (SES-RS 2024; não reaberto) | mantém a DUM se ≤ 3–7 dias | idem |
| MS, Manual de gestação de alto risco (2022) | sem limiar | sem limiar |

Os critérios divergem justamente na diferença de exatamente 5 dias antes de 9 semanas e nas diferenças de 5 a 7 dias depois de 9 semanas.

### q26 refeita

- Ciclo de 37 dias com fase lútea de ~14 dias: ovulação por volta do 23º dia.
- No exame (DUM = 56 dias): 56 − 23 = 33 dias após a fertilização. Somando 14 dias, são 47 dias de IG, isto é, **6 semanas e 5 dias**.
- **Diferença: 9 dias.** Ela redata pelo ACOG (> 5), pelo consenso CBR/FEBRASGO (> 5), pela FEBRASGO n. 63 (≥ 5) e pelos guias de APS (> 7). **A resposta (c) vale por todos os critérios lidos.**
- (b) continua errada por todos os critérios, porque a diferença é de 9 dias e não de "até 7 dias".

### q27 refeita (reprodução assistida)

- Transferência de blastocisto D5: 5 + 14 = 19 dias de IG no dia da transferência.
- 40 dias depois: 59 dias, isto é, 8 semanas e 3 dias. É exatamente a regra da FEBRASGO n. 63.
- A data provável do parto, 261 dias após a transferência (280 − 19), é aritmética. O texto do ACOG que a enuncia não foi lido.

### Mudanças

- **Referências acrescentadas:** consenso CBR/FEBRASGO, FEBRASGO n. 63 e Manual de gestação de alto risco do MS.
- **ACOG CO 700:** a referência passou a "(reafirmado em 2025)", com URL e a ressalva de que o texto integral não foi aberto.
- **Campo `referencia`** de q26 e q27: acrescentados o consenso CBR/FEBRASGO e/ou a FEBRASGO n. 63.
- **`notasDivergencia[4]`:** reescrita com os critérios da FEBRASGO, do consenso e do MS.
- **`incertezas[2]`:** reduzida à única pendência real, a tabela do ACOG CO 700 no texto integral (mais o guia da SES-RS, que não foi reaberto).
- **Não alterados:** resumo, enunciado, alternativas e explicação. A explicação da q26 já dizia que a diferença redata "por qualquer dos critérios em uso", e as fontes confirmam isso.

## 3. Item 2: ácido fólico na prevenção de recorrência de DTN (emb-10, emb-18)

### Fontes lidas

1. **FEBRASGO. Prevenção dos defeitos abertos do tubo neural.** 3ª ed. São Paulo: FEBRASGO; 2025 (Protocolo FEBRASGO-Obstetrícia n. 16).
   - URL: https://www.febrasgo.org.br/wp-content/uploads/2026/05/O-Prevencao-dos-defeitos-abertos-do-tubo-neural-2026-05-13_edicao-3.pdf
   - Highlights: "As doses diárias recomendadas para redução de risco de defeitos do tubo neural são de 400µg para gestações de risco habitual e 4mg para as de alto risco".
   - Fluxograma: histórico de DTN leva a "Aumentar para 4000 mcg/dia (4mg/dia)".
   - Recomendações finais: "Mulheres com risco aumentado para DTN podem se beneficiar com 4mg ao dia (grau de evidência: 2B). No planejamento gestacional, a suplementação deve ser iniciada 30 dias antes da provável concepção e continuar até o fim do primeiro trimestre de gestação provável (grau de evidência: 1A)."
   - A Tabela 2 do mesmo protocolo atribui ao "Ministério da Saúde brasileiro" **4–5 mg** no grupo de risco.
2. **Mariani Neto C. Prevenção dos defeitos abertos do tubo neural – DTN.** 2ª ed. São Paulo: FEBRASGO; 2020 (Orientações e Recomendações FEBRASGO n. 1). É a obra que já constava nas referências.
   - URL: https://www.febrasgo.org.br/wp-content/uploads/2026/05/Serie-DTN-2a-ed-web.pdf
   - p. 17: "Mulheres com alto risco de DTN devem tomar uma dose dez vezes maior (4 mg ou 4.000 microgramas) de ácido fólico diariamente, pelo mesmo período [pelo menos 1 mês antes da gravidez e pelas primeiras 12 semanas]".
3. **Brasil, Ministério da Saúde. Atenção ao pré-natal de baixo risco.** Brasília; 2012 (Cadernos de Atenção Básica n. 32).
   - URL: https://bvsms.saude.gov.br/bvs/publicacoes/cadernos_atencao_basica_32_prenatal.pdf
   - Atenção pré-concepcional, p. 28: "Administração preventiva de ácido fólico no período pré-gestacional, para a prevenção de anormalidades congênitas do tubo neural, especialmente nas mulheres com antecedentes desse tipo de malformações (**5mg, VO/dia, durante 60 a 90 dias antes da concepção**)".
   - O manual técnico "Pré-natal e puerpério" do MS (3ª ed., 2006) tem o mesmo texto: https://bvsms.saude.gov.br/bvs/publicacoes/manual_pre_natal_puerperio_3ed.pdf
4. **Brasil, Ministério da Saúde. Manual de gestação de alto risco** (2022).
   - Cap. 47, Epilepsia, p. 493: "Suplementação com ácido fólico **4 a 5 mg/dia, pelo menos três meses antes da concepção**, e mantido durante toda a gravidez".
   - Diabetes, cap. 44: 4 mg/dia.
   - Trombofilias, cap. 50: 5 mg/dia.
5. **Brasil, Ministério da Saúde. Programa Nacional de Suplementação de Ferro: manual de condutas gerais** (2013).
   - URL: https://bvsms.saude.gov.br/bvs/publicacoes/manual_suplementacao_ferro_condutas_gerais.pdf
   - Recomenda 400 µg/dia a todas as gestantes, "pelo menos 30 dias antes da data em que se planeja engravidar".

### Resultado

As duas fontes confirmam:

- **FEBRASGO:** 4 mg/dia no alto risco, iniciados 30 dias (1 mês) antes da concepção e mantidos até o fim do 1º trimestre.
- **Ministério da Saúde:** 5 mg/dia, de 60 a 90 dias antes da concepção (CAB 32), com antecedente de DTN. No Manual de gestação de alto risco (2022), 4 a 5 mg/dia, pelo menos 3 meses antes (epilepsia).

O texto "pelo menos 30 dias antes" é o mínimo comum às fontes e foi mantido.

### Mudanças

**emb-10:**

- **Texto da dose:** "4 mg/dia pela FEBRASGO ou 5 mg/dia pelo Ministério da Saúde" passou a constar no resumo, em `pontosChave[11]`, na correlação `prevencao-acido-folico` e nas explicações de q16 e q31.
- **Alternativas da q16:** mantidas com a faixa "4 a 5 mg/dia", sem mudança de texto.
- **`notasDivergencia[3]`:** reescrita com as fontes e os prazos de início.
- **Referências:**
  - série FEBRASGO 2020 completada com autor e URL;
  - acrescentados o Protocolo FEBRASGO n. 16 (2025) e o CAB n. 32 (2012);
  - Manual de gestação de alto risco com URL e capítulo preenchido ("47 — Epilepsia e gravidez", que antes dizia "seção a conferir").
- **Campo `referencia`** de q16 e q31: completado.
- **Incerteza da q32 (valproato):** removida. Lido o cap. 47: "regra geral é não substituir o esquema terapêutico de DAE em pacientes controladas, mesmo no primeiro trimestre"; seguimento com neurologista; morfológica de 1º e 2º trimestres. A redação qualitativa da q32 é compatível.

**emb-18:**

- **Frase trocada:** "no Brasil é comum o comprimido de 5 mg" não tinha fonte. Passou a "5 mg/dia segundo o Ministério da Saúde" na correlação `acido-folico-prevencao` (agora "4 mg/dia segundo a FEBRASGO ou 5 mg/dia segundo o Ministério da Saúde") e na explicação da q15.
- **`notasDivergencia[6]`:** reescrita.
- **Referências:** série FEBRASGO completada com URL; acrescentados o Protocolo FEBRASGO n. 16 e o CAB n. 32.

### Achado para o revisor humano

- O mesmo CAB n. 32 (2012), item 5.4.5, "Condutas gerais", manda prescrever "ácido fólico (5mg/dia) para profilaxia da anemia" a **todas** as gestantes.
- Os documentos mais recentes do MS adotam 0,4 mg/dia para todas: PNSF 2013, 400 µg; Manual de gestação de alto risco 2022, 0,4 a 0,8 mg/dia.
- A alternativa (c) da emb-10-q16 ("4 a 5 mg/dia é a recomendada para todas as gestantes brasileiras") continua falsa pelas recomendações vigentes. O ponto ficou registrado em `notasDivergencia[3]`.

## 4. Item 3: radiação na gestação (emb-10-q33)

### Fontes lidas

1. **ACOG Committee Opinion n. 723**, Guidelines for Diagnostic Imaging During Pregnancy and Lactation.
   - URL: https://www.acog.org/clinical/guidance/committee-opinion/2017/10/guidelines-for-diagnostic-imaging-during-pregnancy-and-lactation
   - A página indica **"Number 723, October 2017, Reaffirmed 2026"**, com "Interim update" sobre ressonância magnética e gadolínio. O documento está **vigente**.
   - O resumo (página da ACOG e PubMed, PMID 28937575/28937570) diz: "With few exceptions, radiation exposure through radiography, computed tomography scan, or nuclear medicine imaging techniques is at a dose much lower than the exposure associated with fetal harm."
   - O **texto integral não abriu**: fica em journals.lww.com, que dá 403 na rede da sessão. O **limiar de 50 mGy não foi conferido** nesse documento.
2. **Fonte secundária**, de acesso aberto via Europe PMC: Rocha APC et al. *Radiol Bras.* 2020;53(3):185 (PMC7302893), revista do CBR.
   - Trecho: "In general, radiation doses lower than 50 mGy are not related to fetal abnormalities or spontaneous abortion". O artigo cita a diretriz ACR–SPR (2018), não o ACOG.
   - Na Tabela 1, a tomografia de abdome dá ~4 mGy, e a de abdome e pelve, ~25 mGy.

### Resultado

- **Vigência:** confirmada, mas o conteúdo dizia "reafirmado em 2021". **Corrigido para 2026.**
- **Limiar de 50 mGy:** não conferido no CO 723. Seguindo a instrução, o número **não** entrou na explicação.

### Mudanças

- Referência do CO 723: "(reafirmado em 2026, com atualização interina sobre ressonância magnética e gadolínio)", com URL.
- Campo `referencia` da q33: "(2017, reafirmado em 2026)".
- `incertezas[4]`: reescrita com o que foi lido, incluindo a revisão da *Radiologia Brasileira*.
- A explicação da q33 não mudou.

## 5. Item 4: restrição de crescimento fetal (emb-08-q34)

### Fontes lidas

1. **ACOG Practice Bulletin n. 227**, Fetal Growth Restriction.
   - URL: https://www.acog.org/clinical/guidance/practice-bulletin/2021/02/fetal-growth-restriction
   - A página indica "Number 227, February 2021" e "Interim update" (definição ampliada e momento do parto). Continua listado e **vigente**.
   - O texto integral é "Full Member Benefit" e fica em journals.lww.com, fora da rede. **Não foi lido.**
2. **ACOG Practice Bulletin n. 226**, Screening for Fetal Chromosomal Abnormalities.
   - A URL antiga redireciona para "Withdrawn Document".
   - O substituto é a **ACOG Practice Advisory "Screening for Fetal Chromosomal Abnormalities", de janeiro de 2026**: https://www.acog.org/clinical/guidance/practice-advisory/2026/01/screening-for-fetal-chromosomal-abnormalities
   - Trecho da Practice Advisory: "The guidance in Consult Series #74 and this Practice Advisory replaces ACOG Practice Bulletin No. 226". O Consult Series #74 é de Rink, Dugoff e Kuller (*Pregnancy* 2025;1:e70139).
   - Também da Practice Advisory: "A positive cfDNA result should be followed by genetic counseling, a detailed anatomic survey, and a recommendation for diagnostic testing with chorionic villus sampling (CVS) or amniocentesis". O gemelar evanescente aparece entre as situações em que o cfDNA "cannot be offered".
3. **FEBRASGO. Restrição do crescimento fetal.** 3ª ed. São Paulo: FEBRASGO; 2025 (Protocolo FEBRASGO-Obstetrícia n. 90). Este é o **protocolo FEBRASGO vigente** sobre o tema; a 1ª edição é o n. 35, de 2018, Martinelli et al.
   - URL: https://www.febrasgo.org.br/wp-content/uploads/2026/05/O-Restricao-do-crescimento-fetal-2026-05-13_edicao-3.pdf
   - Classifica a RCF em precoce (< 32 semanas) e tardia (≥ 32 semanas), pelo consenso de 2016.
   - Insuficiência placentária é a principal causa (80%).
   - Fluxograma, quadro "Investigação": "Ultrassonografia detalhada • Discutir análise genética se: RCF precoce, anomalias congênitas e/ou polidrâmnio • PCR CMV no LA se houver amniocentese ou contexto clínico".
4. **FEBRASGO, Protocolo n. 63 (2021)**, p. 27: "Em casos de TN maior do que 3,5 mm [...] deve-se oferecer BVC com avaliação de cariótipo molecular com pesquisa de microdeleções e microadições (microarray)". O mesmo protocolo diz que nesses casos de 10% a 20% das alterações genéticas escapam ao NIPT.

### Resultado

- O gabarito (b) da q34 está **sustentado por fonte brasileira lida no texto integral**. A vinheta tem restrição precoce, com 20 semanas, e TN de 3,8 mm.
- A explicação da q34 é compatível com as duas fontes da FEBRASGO: oferecer exame diagnóstico invasivo com aconselhamento, e não outro rastreamento, e considerar infecção congênita.
- O PB 227 não foi lido. O gabarito não depende dele.
- O PB 226 não é mais vigente. q30 e q33 são compatíveis com o documento que o substituiu: cfDNA como rastreamento, exame diagnóstico após resultado positivo, gemelar evanescente como limitação.

### Mudanças

- **Referências acrescentadas:** a Practice Advisory da ACOG (2026), a FEBRASGO n. 90 e a FEBRASGO n. 63.
- **Referências marcadas:** o PB 226 ficou como "substituído em janeiro de 2026"; o PB 227 recebeu "com atualização interina; vigente", URL e a ressalva de que o texto integral não foi aberto.
- **Campo `referencia`:**
  - q30 e q33: "ACOG PB 226 (2020), substituído pela Practice Advisory da ACOG (2026)";
  - q34: "FEBRASGO, protocolos n. 90 (2025) e n. 63 (2021); ACOG PB 227 (2021)".
- **`notasDivergencia[6]`:** passou a citar a classificação precoce × tardia da FEBRASGO n. 90, que não usa os termos simétrica e assimétrica.
- **`incertezas[5]`:** reescrita. A pendência ficou só na redação exata do PB 227.
- O texto das questões não mudou.

## 6. Item 5: proteção térmica do prematuro (emb-08-q32)

### Fontes lidas

1. **SBP, diretrizes 2026 para o RN < 34 semanas.** Guinsburg R, Almeida MFB et al. Reanimação do recém-nascido <34 semanas em sala de parto: diretrizes 2026 da Sociedade Brasileira de Pediatria. Rio de Janeiro: SBP; 2026 (12 jun. 2026). doi:10.25060/PRN-SBP-2026-2.
   - URL: https://www.sbp.com.br/wp-content/uploads/2026/06/PRN-SBP-Diretrizes-2026-Reanimacao-RN-menor-34-semanas-12junho2026c.pdf
   - Item 5.3.1, "Manter o RN em normotermia": "Logo depois de posicionar o paciente, introduzir seu corpo dentro de saco plástico de polietileno sem secá-lo, mantendo a face do lado de fora. O saco plástico só será retirado depois da estabilização térmica na unidade neonatal. Tal prática deve ser suplementada pelo emprego de touca dupla".
   - Durante o clampeamento: "secar rapidamente a cabeça com uma compressa estéril aquecida, sem secar o corpo e cobrir o corpo com plástico de polietileno estéril".
   - Também: "Todos os RN <32 semanas devem ser levados à mesa de reanimação".
2. **SBP, diretrizes 2022 para o RN < 34 semanas.** doi:10.25060/PRN-SBP-2022-1.
   - URL: https://www.sbp.com.br/wp-content/uploads/2026/02/DiretrizesSBP-Reanimacao-RNmenor34semanas-MAIO2022a.pdf
   - Trecho: "logo depois de posicionar o paciente sob fonte de calor radiante sem secá-lo, introduzir o corpo dentro do saco plástico, mantendo a face do lado de fora [...] touca dupla".

### Resultado

- **Confirmado nas duas versões:** no prematuro < 34 semanas o corpo não é seco e vai para o saco plástico. Um RN de 30 semanas vai sempre à mesa de reanimação.
- **Diferença entre as versões:** em 2026, durante o clampeamento, seca-se a cabeça. Em 2022, a cabeça não era seca e era coberta com plástico.
- A vinheta ("medidas de proteção térmica previstas para prematuros") e a explicação são qualitativas e estão corretas.

### Mudanças

- Incerteza `incertezas[4]` removida.
- Referência de 2026 completada com autores, DOI, URL e item 5.3.1.
- Referência de 2022 acrescentada.
- O texto da q32 não mudou.

## 7. Item 6: início da secreção de surfactante (emb-08)

- **Fonte primária:** nenhuma acessível. Moore e Sadler não estão disponíveis em texto aberto na rede da sessão.
- **Fonte secundária:** Yildiz Atar H, Baatz JE, Ryan RM. *Children (Basel)*. 2021;8(4):281 (PMC8067463, via Europe PMC). Trecho: "AEC2s start producing surfactant at ~24 weeks of GA". O artigo não cita fonte para isso.
- ~24 semanas de IG equivalem a ≈22 semanas após a fertilização, dentro da faixa adotada (20ª–24ª semana após a fertilização).
- **Resultado: a conferência fica para os livros** (Moore, cap. 6 e 10; Sadler, cap. 8). O registro foi acrescentado ao fim de `notasDivergencia[1]`, e nenhum número mudou.

## 8. Hosts e documentos que não abriram

| Host / documento | Resultado |
|---|---|
| journals.lww.com (texto integral de ACOG CO 700, CO 723 e PB 227) | "CONNECT tunnel failed, 403" |
| amb.org.br (Diretriz AMB de ultrassonografia de 1º trimestre) | "CONNECT tunnel failed, 403" |
| febrasgo.org.br sem "www" | "CONNECT tunnel failed, 403"; com "www" funciona |
| Links antigos de PDFs da FEBRASGO (`/images/pec/...`, `/media/k2/...`) | 404, por causa da reorganização do site; os arquivos atuais estão em `/wp-content/uploads/2026/05/` |
| Cópias não oficiais do ACOG CO 700 em sites de terceiros | Não usadas: a ação foi bloqueada pela política de conteúdo restrito |
| Guia do Pré-natal na APS (SES-RS, 2024) | Não reaberto (host fora da lista) |

## 9. O que fica para o revisor humano

1. **ACOG CO 700, texto integral.** Conferir a tabela de limiares (> 5 dias até 8 semanas e 6 dias; > 7 dias de 9 semanas a 13 semanas e 6 dias) e a DPP de 261 dias após transferência de D5. O gabarito da q26 não depende disso.
2. **Critério de redatação a adotar no resumo do emb-01.** O resumo cita só o ACOG. A FEBRASGO n. 63 (≥ 5 dias em todo o 1º trimestre) e o consenso CBR/FEBRASGO (> 5 dias / ≥ 7 dias) divergem entre si depois de 9 semanas. A divergência está registrada em `notasDivergencia[4]`. Cabe decidir se o resumo deve citar o critério brasileiro.
3. **Ácido fólico.** Decidir se mantém "4 mg (FEBRASGO) ou 5 mg (MS)", agora explícito, ou se adota uma das doses. Prazo de início: "pelo menos 30 dias" (FEBRASGO) × 60–90 dias / 3 meses (MS).
4. **Radiação.** O limiar de 50 mGy segue sem conferência no CO 723. Uma revisão da *Radiol Bras* (2020) o sustenta, citando a ACR–SPR. Decidir se cita o número com essa fonte.
5. **ACOG PB 227, texto integral.** Conferir a redação sobre exame invasivo na restrição precoce isolada.
6. **Surfactante.** Conferir a faixa de 20ª–24ª semana após a fertilização em Moore (cap. 6 e 10) e Sadler (cap. 8).
7. **CAB n. 32 (2012).** O documento prescreve 5 mg/dia de ácido fólico a todas as gestantes (anemia). Ver o achado na seção 3. A alternativa (c) da emb-10-q16 continua falsa pelas recomendações vigentes do MS.

## 10. Verificação

Comandos executados em `/home/user/medgame` depois das edições:

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  48 passed (48)
```

Outros três agentes editaram outros tópicos ao mesmo tempo. Os resultados acima refletem o estado do repositório no momento da execução.
