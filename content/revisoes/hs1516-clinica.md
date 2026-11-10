# Revisão HS15–16: gastro-hepatologia/pneumologia (glândulas anexas e sistema respiratório), 2ª etapa

- **Agente:** `revisor-gastro-pneumo-v1`. Olhar de gastroenterologia, hepatologia, pneumologia e patologia.
- **Data:** 2026-11-10
- **Protocolo:** `docs/protocolo-revisao-agentes.md`, com a 3ª verificação (fonte primária em texto integral). Acesso só por curl (Europe PMC REST, E-utilities); WebFetch não foi usado. Formato: `docs/conteudo-schema.md`, seção Histologia.
- **Etapa anterior:** `content/revisoes/hs1516-histologia.md`. Não refiz o que já estava conferido e não discordei de nenhuma correção da 1ª etapa.
- **Arquivos editados (só estes):**
  - `content/histologia/topicos/his-15-glandulas-anexas.json`
  - `content/histologia/topicos/his-16-respiratorio.json`
  - este relatório
- **Garantias** (conferidas por script contra o commit da 1ª etapa, `dbad032`, idêntico à cópia de segurança feita antes de editar):
  - Nenhum id foi alterado (tópicos, questões, alternativas, itens, estruturas, eventos, correlações).
  - Nenhum gabarito, letra correta, `ordemCorreta`, par de associação, texto de alternativa ou item, enunciado, dificuldade ou Bloom foi alterado. Mudaram só `contexto` (vinhetas) e `explicacao`.
  - Distribuição das letras corretas igual à da 1ª etapa: his-15 a4/b4/c4/d5; his-16 a4/b5/c4/d4.
  - `revisao.humano` continua `null`. Uma entrada nova em `revisao.agentes` em cada arquivo, depois da entrada da 1ª etapa.
  - Nada foi commitado por mim. **Observação:** durante a revisão, outro processo commitou estes arquivos duas vezes:
    - `a2fa6f2`: estado intermediário;
    - `cabc188`: já com a versão final dos dois tópicos.

    A diferença entre os dois commits é uma frase do his-16, na correlação `doenca-membrana-hialina` ("É a base…" → "Esse quadro é o substrato…"). Este relatório ainda não está em commit.
- **Situação:** revisão por agente (IA). Não substitui a conferência médica. Os tópicos continuam com o selo "Revisado por IA · conferência médica pendente".

## 1. Resumo

Revisei todos os campos dos dois tópicos (58 questões). O foco foi o desta etapa: correlações clínicas, vinhetas, condutas, critérios e números clínicos, e distratores.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-15 Glândulas anexas | 29 (17 MC, 6 V/F, 3 ordenar, 3 associar) | 0 | 2 | 8 | 10 | aprovado-com-correcoes |
| his-16 Sistema respiratório | 29 (17 MC, 6 V/F, 3 ordenar, 3 associar) | 0 | 1 | 5 | 6 | aprovado-com-correcoes |
| **Total** | **58** | **0** | **3** | **13** | **16** | |

**Gravidade** (mesma convenção das etapas clínicas anteriores):
- **crítica:** fato errado ou gabarito errado;
- **importante:** ambiguidade, distrator defensável, explicação incorreta, ou conduta e critério clínico imprecisos (inclusive conduta implícita numa vinheta);
- **menor:** redação, terminologia, precisão, atualização ou referência.

**Gabaritos.** Os 58 gabaritos estão corretos. Nenhuma questão tem mais de uma alternativa defensável, e os distratores das vinhetas são clinicamente plausíveis:
- zona 1 × Kupffer × canalículos × CYP2E1 (his-15-q08);
- estrelada × Kupffer × hepatócito × endotélio (q09);
- Kupffer × estrelada × colangiócito × neutrófilo (q10);
- glicogênio × hemossiderina × α1-antitripsina × Mallory-Denk (q11);
- hemólise × Gilbert × captação × refluxo de conjugada (q12);
- centroacinar × parasseptal × panacinar por surfactante × panacinar por elastase (his-16-q07);
- carvão × hemossiderina × lipofuscina × bilirrubina (q10);
- depuração × síntese de surfactante × mucociliar × CC16 (q15).

**O que mudou de mais importante:**
1. **Colangite esclerosante primária** (his-15, importante). O texto sugeria que a casca de cebola na biópsia é o caminho do diagnóstico. Pela diretriz BSG/UK-PSC 2019, o diagnóstico é feito pela colangiorressonância. A biópsia fica para casos selecionados, e a casca de cebola muitas vezes não aparece na biópsia por agulha. Acrescentei também o risco de colangiocarcinoma.
2. **Vinheta do paracetamol** (his-15-q08, importante). Havia biópsia hepática num quadro de insuficiência hepática aguda com tempo de protrombina alargado. Isso não é conduta de rotina, e a via percutânea é arriscada na coagulopatia. Agora o achado vem do fígado retirado no transplante de urgência.
3. **Vinheta da proteinose alveolar** (his-16-q15, importante). Havia biópsia pulmonar num paciente com lavado típico e anticorpo anti-GM-CSF. A diretriz ERS 2024 sugere **não** fazer biópsia de rotina nesse caso. A biópsia saiu da vinheta, e entrou a tomografia em pavimentação em mosaico.

As demais correções completam condutas qualitativas, todas conferidas em texto integral:
- acetilcisteína precoce, sem dose;
- diagnóstico da deficiência de α1-antitripsina por dosagem e fenotipagem/genotipagem, com o limiar de reposição da SBPT;
- MASH;
- hepatite autoimune;
- pâncreas exócrino na fibrose cística;
- integração da membrana hialina com o emb-14;
- precisão sobre o carcinoma da laringe.

### Conferência item a item do foco desta etapa

| Tema | Onde está | Situação |
|---|---|---|
| Esteatose, MASLD/MetALD | his-15 correlação `esteatose-esteato-hepatite`; nota de divergência | Correto. Acrescentei o termo MASH (Rinella 2023, texto integral) e ajustei a inflamação: predomina a mononuclear, e os neutrófilos são mais comuns na forma alcoólica (Boyd 2020, texto integral). Os limiares de álcool da MetALD (140–350 g/semana em mulheres; 210–420 g/semana em homens) foram conferidos, mas continuam fora do texto. |
| Hepatites | his-15 correlação `hepatites-virais-febre-amarela`; resumo | Corretas: hepatite aguda, hepatite de interface, vidro fosco na hepatite B. A hepatite de interface aparecia só como viral. Acrescentei a hepatite autoimune com plasmócitos (Boyd 2020). |
| Cirrose e célula estrelada | his-15 correlação `cirrose-hepatica`; q09; q23 | Correto (TGF-β, PDGF, capilarização). Vinheta da q09: um paciente com ascite (cirrose descompensada) não faz biópsia percutânea de rotina, e a via indicada seria a transvenosa (Boyd 2020). A vinheta passou a ser de necropsia. |
| Colestase e CEP | his-15 correlação `colestase`; q12 | CBP correta. CEP corrigida (item 1 acima). Vinheta da q12: biópsia hepática num cálculo de colédoco já identificado não tem indicação. Ganhou a ressalva "dispensável quando a imagem já mostra a causa". |
| Paracetamol: zona 3, CYP2E1, NAPQI; acetilcisteína | his-15 correlação; q08; q26; q28 | Mecanismo e zonação corretos (conferidos na 1ª etapa). A acetilcisteína agora "fornece cisteína para repor a glutationa", tem benefício maior quanto mais precoce e continua indicada na insuficiência instalada (Yoon 2016, texto integral). **Sem dose, esquema, nomograma ou critérios de transplante.** Dart 2023 continua conferido só no resumo. |
| Hemocromatose × sobrecarga transfusional | his-15 q10 (explicação) | Correto e conferido na 1ª etapa: Kupffer na sobrecarga transfusional, hepatócitos periportais na hemocromatose. Sem correção. Ver seção 3 (talassemia). |
| Febre amarela mediozonal | his-15 correlação; q28 | Correto (Carvalho 2022, texto integral, 1ª etapa). Sem correção. |
| Pancreatite | his-15 correlação `pancreatite-aguda`; q15 | Correto (causas, enzimas, autodigestão, PRSS1/SPINK1/CFTR). Não há número. Os critérios de Atlanta revisados não foram incluídos, porque não li o texto integral. |
| Fibrose cística | his-15 correlação `diabetes-ilhotas`; resumo | Faltava o pâncreas exócrino, embora o objetivo do tópico cite a fibrose cística. Acrescentei: secreção ductal espessa, atrofia acinar, fibrose, insuficiência exócrina com esteatorreia (remete ao his-03) e diabetes relacionado à FC "comum em adolescentes e adultos". Fonte: diretriz brasileira de 2017, texto integral (≈20% e ≈40%; números não usados). |
| Deficiência de α1-antitripsina (fígado) | his-15 correlação; q11 | Correto. Acrescentei: diagnóstico pela dosagem sérica e pela fenotipagem/genotipagem; avaliação hepática não invasiva; biópsia só em casos selecionados (SBPT 2024, texto integral). A explicação da q11 ganhou a mesma ressalva, porque a vinheta usa biópsia. |
| DPOC e enfisema centroacinar × panacinar | his-16 correlação `enfisema`; q07; q08; q29 | Correto. Conferi a definição e os tipos em texto integral (Marchiori 2024, JBP; Int J Mol Sci 2026). O predomínio lobar (centroacinar nos lobos superiores, panacinar nas bases) segue Robbins (ver seção 3). |
| Asma e remodelamento | his-16 correlação; q17 | Correto. Conferido em Varricchi 2025 (texto integral): espessamento da membrana basal reticular, hiperplasia caliciforme, hipertrofia e hiperplasia do músculo liso, angiogênese. |
| Membrana hialina no prematuro | his-16 correlação; q09; q21 | Correto. Integrei ao emb-14 com a mesma redação já revisada lá: SDR do recém-nascido, risco maior quanto menor a idade gestacional, corticoide antenatal, CPAP e surfactante exógeno. Achados em prematuros que morrem com 1–3 dias conferidos (Eur J Histochem 2012). |
| Metaplasia escamosa no tabagismo | his-16 correlação `tabagismo-vias-aereas`; coerência com his-02 | Correto e coerente com o his-02. Corrigi "o epitélio da glote é **a** sede do carcinoma epidermoide da laringe": o tumor também surge na supraglote, sobre metaplasia escamosa. |
| Pneumoconioses | his-16 correlação; q11; q12 | Correto. Conferido em texto integral: nódulo silicótico de colágeno em redemoinho, partículas fracamente birrefringentes, zonas superiores e risco de tuberculose (Fazio 2025); revestimento de ferro dos corpos de asbesto (Avramescu 2023). |
| Proteinose alveolar (ERS 2024/2025) | his-16 correlação; q15 | Forma autoimune, lavado PAS+, anti-GM-CSF e primeira linha (lavagem e/ou GM-CSF inalatório) corretos. Corrigido: biópsia não é de rotina (item 3 acima). |
| Deficiência de α1-antitripsina (pulmão) | his-16 correlação; q07; q26 | Correto. Os critérios de reposição foram conferidos de novo no texto integral, e incluí o limiar: < 57 mg/dL (11 µmol/L), não fumante ou ex-fumante, maior de 18 anos, variante grave, limitação ao fluxo aéreo. Acrescentei também como o diagnóstico é confirmado. |

### Lâminas

- **`pulmao`:** não há o que alinhar. `laminas-sistemas-c.json` continua `{"laminas": []}`. Os 9 ids de `PARTES_PULMAO` (`sistemas-c.tsx`) já existem no his-16, conferido por script:
  - `bronquiolo`, `bronquiolo-respiratorio`, `ducto-alveolar`;
  - `alveolo`, `septo-interalveolar`, `capilar`;
  - `pneumocito-tipo-i`, `pneumocito-tipo-ii`, `macrofago-alveolar`.

  Nenhum id foi trocado.
- **`figado` e `pancreas`:** os ids continuam alinhados desde a 1ª etapa. Nada mudou.

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | his-15 `colestase` | descricao | CEP "associada à retocolite"; "intra e extra-hepáticos"; "a lesão clássica na biópsia é a casca de cebola" | Associada à DII (sobretudo RCU); ductos "intra e/ou extra-hepáticos"; diagnóstico pela colangiorressonância (estenoses curtas multifocais, aspecto em contas); biópsia só em casos selecionados (pequenos ductos); casca de cebola muitas vezes ausente na biópsia; risco de colangiocarcinoma | O texto induzia à ideia de diagnóstico por biópsia | importante | Chapman et al., Gut 2019 (PMC6691863) |
| 2 | his-15-q08 | contexto | "Três dias depois, tem icterícia… TP alargado. **A biópsia** mostra necrose…" | "…só procurou atendimento três dias depois…; evoluiu para insuficiência hepática aguda e recebeu transplante de urgência; **o fígado retirado** mostra necrose…" | Biópsia não é rotina na IHA, e a via percutânea é arriscada com coagulopatia. A procura tardia é a situação típica de falha | importante | Boyd et al. 2020 (PMC6914302); Yoon et al. 2016 (PMC4913076): transplante na IHA por paracetamol |
| 3 | his-16-q15 | contexto; explicacao | "…**A biópsia mostra** alvéolos preenchidos…, septos normais. Há anti-GM-CSF" | Tomografia com vidro fosco e espessamento septal (pavimentação em mosaico, *crazy paving*); lavado leitoso PAS+; anti-GM-CSF. Explicação: "a diretriz sugere não fazer biópsia pulmonar de rotina" | Vinheta contrária à recomendação da ERS | importante | Alfaro et al., Breathe 2025 (PMC12070199) |
| 4 | his-15-q09 | contexto | "…tem ascite e varizes. **A biópsia hepática** corada por tricrômico…" | "…morre de hemorragia digestiva alta. **Na necropsia**, cortes do fígado corados por tricrômico…" | Cirrose descompensada com ascite não leva a biópsia percutânea de rotina | menor | Boyd 2020 (ascite → via transvenosa) |
| 5 | his-15-q12 | contexto | "A biópsia hepática mostra tampões…" | "Em obstruções como essa, a biópsia hepática (dispensável quando a imagem já mostra a causa) revela tampões…" | Realismo: o diagnóstico de coledocolitíase é por imagem | menor | — (julgamento clínico) |
| 6 | his-15 `esteatose-esteato-hepatite` | descricao | "Na esteato-hepatite…, inflamação lobular (com neutrófilos, mais evidentes na forma alcoólica)" | "(na MASLD, chamada de MASH…)… inflamação lobular (sobretudo mononuclear; neutrófilos são mais comuns na forma alcoólica)" | Nomenclatura de 2023. A frase antiga sugeria neutrófilos sempre presentes | menor | Rinella 2023 (PMC10653297); Boyd 2020 |
| 7 | his-15 `necrose-centrolobular-paracetamol` | descricao | "causa importante de IHA"; "acetilcisteína age repondo a glutationa" | "(a mais comum nos Estados Unidos)"; "fornece cisteína para repor a glutationa; o benefício é maior quanto mais cedo…, mas continua indicada mesmo com a insuficiência hepática já instalada". Sem dose | Mensagem clínica essencial (tempo), qualitativa | menor | Yoon 2016 (PMC4913076) |
| 8 | his-15 `hepatites-virais-febre-amarela` | descricao | Hepatite de interface só nas hepatites B e C | + "A hepatite de interface é também o achado típico da hepatite autoimune, em que plasmócitos no infiltrado sugerem o diagnóstico." | Completude: hepatite de interface ≠ só viral | menor | Boyd 2020 |
| 9 | his-15 `deficiencia-alfa1-antitripsina-figado`; his-15-q11 | descricao; explicacao | Sem menção a como se diagnostica | Dosagem sérica + fenotipagem/genotipagem; fígado avaliado por exames não invasivos; biópsia só em casos selecionados | A vinheta usa biópsia; a SBPT a reserva a casos selecionados | menor | SBPT 2024 (PMC11601085) |
| 10 | his-15 `diabetes-ilhotas`; resumo | descricao; lista de correlações | FC: "a fibrose do pâncreas exócrino acaba por envolver as ilhotas" | Secreção ductal espessa (CFTR) → obstrução, atrofia acinar, fibrose, insuficiência exócrina com esteatorreia (ver his-03); depois as ilhotas; DRFC comum em adolescentes e adultos. "fibrose cística" entra na lista do resumo | O objetivo do tópico cita a FC, mas o pâncreas exócrino não era tratado | menor | Athanazio et al., J Bras Pneumol 2017 (PMC5687954) |
| 11 | his-15 | referencias; notasDivergencia; incertezas | — | +3 referências (Chapman 2019, Yoon 2016, Athanazio 2017); nota "Conferido (2ª etapa)" com os trechos; incerteza do paracetamol atualizada; incerteza da CEP substituída pelo registro de que a SBH 2019 não abriu | Registro da 3ª verificação | menor | ver seção 5 |
| 12 | his-16 `deficiencia-alfa1-antitripsina-pulmao` | descricao | "(…variante genética grave, concentração sérica baixa e limitação ao fluxo aéreo)" | Diagnóstico por dosagem + fenotipagem/genotipagem; reposição: "…variante de deficiência grave, concentração sérica abaixo de 57 mg/dL (11 µmol/L) e limitação ao fluxo aéreo na prova de função pulmonar" | Critério de reposição completo, conferido no texto integral (pedido desta etapa) | menor | SBPT 2024 (PMC11601085) |
| 13 | his-16 `proteinose-alveolar` | descricao | "na biópsia, alvéolos cheios…"; "diagnóstico usa o lavado e o anti-GM-CSF" | "quando há biópsia…"; "…sem biópsia pulmonar de rotina (reservada aos casos que continuam duvidosos)" | Coerência com a recomendação da ERS e com a correção 3 | menor | Alfaro 2025 |
| 14 | his-16 `doenca-membrana-hialina` | descricao | Só fisiopatologia e histologia | + "Esse quadro é o substrato da SDR do recém-nascido, tanto mais frequente quanto menor a idade gestacional; o corticoide antenatal ajuda a preveni-la; tratamento com suporte ventilatório (como o CPAP) e surfactante exógeno (ver emb-14)" | Integração pedida com o emb-14 (mesma redação qualitativa já revisada lá) | menor | emb-14 (correlação `sindrome-desconforto-respiratorio-rn`) |
| 15 | his-16 `tabagismo-vias-aereas` | descricao | "o epitélio estratificado pavimentoso da glote é **a** sede do carcinoma epidermoide da laringe" | "o carcinoma epidermoide da laringe, ligado ao tabagismo, surge do epitélio estratificado pavimentoso das pregas vocais ou de áreas de metaplasia escamosa" | A frase excluía os tumores supraglóticos | menor | Robbins 10ª ed. (de memória; redação menos assertiva que a anterior) |
| 16 | his-16 | referencias; incertezas | — | +4 referências (Fazio 2025, Avramescu 2023, Varricchi 2025, Marchiori 2024); incertezas de α1-antitripsina, proteinose e patologia atualizadas com o que foi conferido e o que segue de Robbins | Registro da 3ª verificação | menor | ver seção 5 |
| — | his-15 e his-16 | revisao.agentes | 1 entrada | + `revisor-gastro-pneumo-v1`, 2026-11-10, `aprovado-com-correcoes` | Registro da revisão | — | — |

## 3. Pontos para o revisor humano

1. **Paracetamol: fonte de conduta.**
   - O consenso norte-americano e canadense (Dart et al., JAMA Netw Open 2023) continua lido só no resumo:
     - não há cópia no PMC nem no Europe PMC;
     - `jamanetwork.com` recusa a conexão nesta rede (CONNECT 403, testado de novo hoje).
   - Não localizei diretriz brasileira de sociedade sobre a intoxicação.
   - O tópico não traz dose, esquema, nomograma nem critérios de transplante, de propósito.
   - Decidir se cita os CIATox (centros de informação e assistência toxicológica) como referência nacional de conduta.
   - A revisão usada (Yoon 2016) ressalva que nem todo etilista tem risco aumentado com doses terapêuticas. O texto mantém "uso crônico de álcool… aumenta o risco", que é correto como fator de risco na sobredose.
2. **CEP: fonte brasileira.**
   - A atualização das recomendações da SBH (Couto et al., Arq Gastroenterol 2019, PMID 31460591) não abriu:
     - o SciELO respondeu com página de verificação anti-robô, que não contornei;
     - o repositório institucional não resolve nesta rede.
   - A redação segue a BSG/UK-PSC 2019, em texto integral. Conferir se a SBH diverge (por exemplo, quanto à frequência de DII associada na população brasileira; o texto diz só "frequentemente").
3. **Limiar de reposição de α1-antitripsina** (< 57 mg/dL ou 11 µmol/L).
   - Está no texto integral da SBPT 2024, na frase "There seems to be a consensus that intravenous AAT replacement therapy is indicated in…".
   - A 1ª etapa o tinha omitido de propósito; incluí porque esta etapa pedia os critérios, se conferidos.
   - Nenhuma questão cobra o número. Decidir se fica.
   - A SBPT recomenda também dosar a IgA antes da reposição, pelo risco de anafilaxia na deficiência grave de IgA. Não incluí.
4. **Vinhetas com biópsia que mantive:**
   - **his-15-q10 (talassemia).** Hoje a carga de ferro hepático costuma ser estimada por ressonância, e a biópsia é rara. Não conferi fonte e não mexi.
   - **Talassemia (mesma questão).** A eritropoese ineficaz também aumenta a absorção intestinal de ferro, que vai aos hepatócitos. "Os hepatócitos ainda têm pouco pigmento" é plausível no início, e a resposta (Kupffer, pela localização descrita) não muda. Avaliar se vale uma frase na explicação.
   - **his-16-q11 e q12 (pneumoconioses).** O diagnóstico costuma se apoiar na exposição e na imagem, e a biópsia fica para casos duvidosos. Não conferi diretriz brasileira (SBPT ou Ministério da Saúde) e mantive as vinhetas.
   - **his-15-q11 (deficiência de α1-antitripsina).** A explicação agora diz que a biópsia é para casos selecionados.
5. **Achados de patologia ainda só de Robbins** (registrados em `incertezas` do his-16):
   - predomínio lobar do enfisema centroacinar e do panacinar;
   - composição das membranas hialinas;
   - bronquite crônica;
   - células da insuficiência cardíaca;
   - edema de Reinke;
   - origem do carcinoma da laringe.
6. **Terminologia.**
   - "Padrão de pavimentação em mosaico" (*crazy paving*): o termo aparece na literatura brasileira indexada (busca no Europe PMC). O consenso brasileiro de terminologia de TC de tórax não foi aberto. Deixei também o termo em inglês entre parênteses.
   - "MASH" ficou com o nome por extenso em português, sem sigla nacional, porque não conferi se a SBH adotou sigla própria.
7. **Pancreatite aguda.** Os critérios diagnósticos de Atlanta (revisão de 2012) não foram incluídos, porque não li o texto integral. O texto é qualitativo e correto.
8. **Pendências da 1ª etapa que continuam** (fora do meu escopo):
   - ids `ilhota-de-langerhans` × `ilhotas-pancreaticas`;
   - `ducto-intercalado` × `ducto-intercalar`;
   - `pneumocito-tipo-i` × `pneumocito-tipo-1`;
   - atribuições a Ross citadas de memória.

## 4. Testes

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina
AssertionError: pulmao: expected false to be true // Object.is equality
 Test Files  1 failed | 8 passed (9)
      Tests  1 failed | 83 passed (84)
```

A única falha é a da lâmina `pulmao`, a mesma da 1ª etapa. O desenho está registrado em `sistemas-c.tsx`, mas `laminas-sistemas-c.json` continua vazio, porque outro agente desenha a lâmina. A falha não tem relação com os arquivos desta revisão.

## 5. Fontes lidas (curl: Europe PMC REST e E-utilities)

**Texto integral, com o trecho decisivo:**

**SBPT 2024**
- Feitosa et al., J Bras Pneumol 2024;50(5):e20240235 (PMC11601085).
- Reposição: "intravenous AAT replacement therapy is indicated in nonsmokers or former smokers over 18 years of age with a genetic variant consistent with severe AATD, a low serum AAT concentration (< 11 µmol/L or < 57 mg/dL), and evidence of airflow limitation on pulmonary function testing".
- Fígado: "liver biopsy is reserved for selected cases only".
- Diagnóstico: "Serum AAT concentrations should be determined, and allelic variants should be identified by phenotyping or genotyping".

**ERS, resumo para clínicos**
- Alfaro et al., Breathe 2025;21(2):240224 (PMC12070199).
- Biópsia: "We suggest to not routinely perform lung biopsy as part of the diagnostic work up of patients with suspected PAP (conditional recommendation, moderate certainty)".
- Tratamento: "Whole lung lavage and inhaled GM-CSF are first-line treatments for symptomatic or progressive aPAP".
- Caso-modelo: HRCT com "bilateral crazy paving opacities".

**BSG/UK-PSC 2019**
- Chapman et al., Gut 2019;68(8):1356-78 (PMC6691863).
- Imagem: "magnetic resonance cholangiopancreatography (MRCP) becoming the preferred imaging modality for the diagnosis of PSC"; "typical beading appearance caused by short multifocal strictures".
- Histologia: "concentric 'onion skin' periductal fibrosis, but this is often not present on small liver biopsy specimens".
- Biópsia: "liver biopsy is normally reserved for possible small duct PSC, assessment of suspected possible overlap variants or instances where the diagnosis is unclear".
- Colangiocarcinoma: "Malignancy, particularly CCA, is now the most common cause of death".
- DII: "IBD is present in 62–83% of patients with PSC of Northern European descent, but rates are as low as 21% elsewhere".

**Paracetamol**
- Yoon et al., J Clin Transl Hepatol 2016;4(2):131-42 (PMC4913076).
- Acetilcisteína: "NAC is a cysteine prodrug and hepatic GSH precursor"; "timely administration is critical"; "treatment should still be given to patients who are found to be in active hepatic failure".
- Epidemiologia: "the most common cause of acute liver failure in the United States".
- Álcool: "Chronic alcohol ingestion … augments APAP hepatotoxicity by up-regulating … CYP 2E1 and decreasing GSH stores".
- Desnutrição: "a clear association between malnourishment and APAP hepatotoxicity".

**Biópsia hepática**
- Boyd et al., Frontline Gastroenterol 2020 (PMC6914302).
- Insuficiência hepática aguda: "Biopsies are occasionally carried out in acute liver failure … case-by-case".
- Coagulopatia: "Coagulopathy and thrombocytopenia … may pose an unacceptable risk for a percutaneous approach".
- Ascite: entre as razões para a via transvenosa.
- Esteato-hepatite: "neutrophils are perhaps more common in alcoholic steatohepatitis".
- Hepatite autoimune: "AIH is characterised by interface hepatitis … The presence of plasma cells in the infiltrate is suggestive".

**MASLD**
- Rinella et al., Hepatology 2023 (PMC10653297).
- "Persons with MASLD and steatohepatitis will be designated as metabolic dysfunction associated steatohepatitis (MASH)".

**Fibrose cística**
- Athanazio et al., J Bras Pneumol 2017;43(3):219-45 (PMC5687954): insuficiência pancreática exócrina com esteatorreia.
- Diabetes: "Approximately 20% of the adolescents and 40% of the adults develop cystic fibrosis-related diabetes".

**Silicose**
- Fazio et al., J Occup Med Toxicol 2025;20:9 (PMC11917111).
- Distribuição: "predilection for the posterior upper zones".
- Nódulo: "central acellular zone of 'whorled' collagen fibers".
- Partículas: "Silica particles are weakly birefringent under polarized light".
- Tuberculose: risco relativo combinado de 4,01.

**Corpos de asbesto**
- Avramescu et al., Part Fibre Toxicol 2023;20:19 (PMC10165766).
- "an iron-rich coat forms around the asbestos fibres … termed an 'asbestos ferruginous body'".

**Asma**
- Varricchi et al., Allergy 2025;80(2):408-22 (PMC11804314).
- "ASM hypertrophy/hyperplasia, RBM thickening, goblet cell hyperplasia/metaplasia, angiogenesis".

**Enfisema**
- Marchiori et al., J Bras Pneumol 2024;49(6):e20230340 (PMC10760424): definição e tipos de enfisema.
- Int J Mol Sci 2026 (PMC13566781): o enfisema parasseptal "predisposes to pneumothorax".
- Para o enfisema panacinar, a mesma fonte descreve "homogeneous dilation of airspaces from the respiratory bronchioles to the alveoli".

**Membrana hialina**
- Eur J Histochem 2012 (PMC3493981): "alveolar collapse, epithelial necrosis … hyaline membrane formation" em prematuros que morreram com 1–3 dias.

**Não abertos (registrados em `incertezas`):**
- Dart et al., JAMA Netw Open 2023: CONNECT 403 em jamanetwork.com; sem PMC.
- Couto et al., SBH, Arq Gastroenterol 2019: SciELO com verificação anti-robô, não contornada; `hdl.handle.net` não resolve.
- Cochrane 2018 sobre intervenções na sobredose de paracetamol (PMC6491303): o Europe PMC retornou erro 500.

Os arquivos baixados e os scripts (edição e checagem de garantias) ficaram em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hs1516-cli/`, fora do repositório.
