# Revisão por agente — camada avançada (AV4), área clínica pediátrica/urologia/neurologia/anatomia, 2ª etapa

- Agente: `revisor-clinica-avancado-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md` · 1ª etapa: `content/revisoes/av4-embriologia.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas de `referencias` e `incertezas` de `content/embriologia/topicos/` emb-16 a emb-20. O conteúdo anterior não foi mexido. Nenhum id, alternativa, gabarito ou dificuldade mudou. Nas referências e incertezas, só acrescentei entradas no fim das listas e completei as duas incertezas da camada avançada do emb-16. Nenhum outro arquivo foi editado, e nada foi commitado.
- Durante a sessão, outro agente fez um commit (`83a2622`) com a 1ª etapa. As minhas mudanças ficaram por cima dele, e o `git diff` dos 5 arquivos mostra só as minhas mudanças.

## 1. Resumo

| Tópico | Questões avançadas | Críticas | Importantes | Menores | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-16-urinario | q26–q30 (5) | 0 | 1 | 1 | 2 | aprovado-com-correcoes |
| emb-17-genital-diferenciacao-sexual | q24–q28 (5) | 0 | 0 | 0 | 0 | aprovado |
| emb-18-sistema-nervoso | q25–q29 (5) | 0 | 0 | 0 | 0 | aprovado |
| emb-19-musculoesqueletico-membros | q25–q29 (5) | 0 | 1 | 0 | 1 | aprovado-com-correcoes |
| emb-20-olho-orelha-tegumento | q25–q29 (5) | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **2** | **4** | **6** | |

**Nenhum gabarito estava errado e nenhum fato cobrado estava errado.** Conferi, com olhar clínico, as 25 questões: o gabarito, cada distrator, as explicações letra a letra, as duas sequências (liquor 2-6-4-1-5-7-3; trajeto da luz 2-6-4-1-5-7-3) e os três `associar`. O app mostra todos os pares do `associar`, então a correspondência um a um é inequívoca nos três.

Critério de gravidade nesta etapa: as duas correções **importantes** não corrigem frases falsas. Corrigem omissões de conduta, justamente nos dois pontos clínicos pedidos para esta etapa:
- q28 do emb-16: a explicação tranquilizava os pais sobre a hipoplasia pulmonar, mas não dizia que o rim contralateral precisa de seguimento;
- q26 do emb-19: a explicação citava o "risco de compressão" do forame magno, mas não dizia o risco no lactente nem o que fazer.

Nos dois casos, o aluno aprenderia o mecanismo sem a conduta que vem dele. As quatro correções **menores** são de precisão de conduta (PEATE na triagem auditiva), realismo da vinheta (tomografia no recém-nascido), referência (EAU/ESPU) e bloom.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | gravidade | motivo | fonte |
|---|---|---|---|---|---|---|
| emb-16-q28 | explicacao, referencia | Termina na refutação de (d); nada sobre o rim contralateral | + "A tranquilização depende do rim direito, que será o único funcionante: como anomalias contralaterais (sobretudo refluxo vesicoureteral e obstrução da junção ureteropélvica) são relativamente frequentes, ele precisa de seguimento ultrassonográfico na gestação e após o nascimento, quando também se acompanham a involução do rim displásico e a hipertrofia compensadora do contralateral."; referência + Schreuder 2009, Rabelo 2005 | importante | Explicação só tranquilizadora, sem o seguimento do rim único funcionante (foco pedido). Redação qualitativa, sem números | Schreuder MF et al., Nephrol Dial Transplant 2009;24:1810-8 (meta-análise: anomalias contralaterais em cerca de 1/3, sobretudo refluxo; conferida pelo resumo); Rabelo EAS et al., J Pediatr (Rio J) 2005;81:400-4 (série brasileira: involução e hipertrofia compensadora; resumo) |
| emb-16-q26 | referencia; + `referencias` do tópico | "Moore 11ª ed., cap. 12; Sadler 14ª ed., cap. 16" | + "EAU/ESPU, Guidelines on Paediatric Urology (ureterocele e ureter ectópico)" | menor | A regra de Weigert–Meyer vem da literatura urológica, não de Moore ou Sadler (regra 1 do `conteudo-schema.md`) | EAU/ESPU, capítulo de ureterocele e ureter ectópico (trechos de busca: no rim duplo, a ureterocele drena sobretudo o polo superior, e o refluxo é frequente no inferior) |
| emb-19-q26 | explicacao, referencia; + `referencias` do tópico | "…com risco de compressão da junção bulbomedular." | "…, que no lactente pode causar apneia central e morte súbita; a Academia Americana de Pediatria recomenda neuroimagem e polissonografia logo após o diagnóstico, e um lactente com compressão na imagem, como este, precisa de avaliação neurocirúrgica." | importante | O foco "risco no lactente" não estava na explicação, e a vinheta (hipotonia acentuada, compressão na ressonância) pede conduta. Sem números | Hoover-Fong J et al. (AAP), Pediatrics 2020;145(6):e20201010, conferido por resumos e sínteses secundárias |
| emb-20-q26 | explicacao, referencia | "A triagem auditiva neonatal, obrigatória no Brasil, é especialmente importante nesse bebê." | "Como a infecção congênita, possível nesse bebê, é indicador de risco para deficiência auditiva, a triagem auditiva neonatal, obrigatória no Brasil, deve ser feita com PEATE automático, e a audição deve continuar a ser acompanhada, porque a perda pode surgir ou progredir depois do período neonatal."; referência + MS 2012 | menor | Com indicador de risco, a diretriz pede PEATE automático, qualquer que seja o resultado das emissões otoacústicas, e monitoramento. A frase genérica deixava supor só as emissões otoacústicas | Ministério da Saúde, Diretrizes de Atenção da Triagem Auditiva Neonatal, 2012 (já nas referências do tópico), conferida em documentos que a citam |
| emb-20-q27 | contexto, explicacao | "Recém-nascido… A tomografia mostra…"; "…e a avaliação audiológica das duas orelhas continuam indicadas." | "…Aos 5 anos, a tomografia dos ossos temporais, feita para planejar a cirurgia, mostra…"; "…são feitas desde o período neonatal, sem esperar a tomografia." | menor | Realismo: na atresia isolada, a tomografia costuma ser adiada até a idade de planejar a cirurgia. A explicação não afirma idade; a pergunta e o gabarito (b) não mudam | Literatura de otologia consultada por busca (tomografia por volta dos 5–6 anos; escore de Jahrsdoerfer) |
| emb-20-q28 | bloom | aplicar | compreender | menor | Ordenar o trajeto da luz é recordação/compreensão; fica coerente com a emb-18-q29, que a 1ª etapa passou para "compreender" | — |

### Registro em referências e incertezas (não contado como correção)

- **emb-16:** acrescentei 3 referências (EAU/ESPU; Schreuder 2009; Rabelo 2005). Completei as incertezas da q26 (EAU/ESPU conferida por trechos) e da q27 (variabilidade arterial confirmada em revisão anatômica de 2014 e em estudo tomográfico de 2023, sem frequências). Acrescentei uma incerteza da q28: seguimento qualitativo; não achei documento da SBP nem da SBU; a uretrocistografia de rotina ou seletiva diverge entre serviços e ficou de fora.
- **emb-17:** acrescentei uma incerteza. O Documento Científico nº 232 da SBP (DC de Endocrinologia, 12/02/2026) existe, mas o texto integral não abriu. Também ficou registrada a série de Cambridge de 2017 sobre insensibilidade completa aos andrógenos: neoplasias sobretudo após a puberdade, com a gonadectomia discutida na vida adulta, o que é compatível com a (d) da q27. Lee 2016 continua não aberto.
- **emb-19:** acrescentei 1 referência (Hoover-Fong 2020) e 1 incerteza: AAP conferida por resumos, e o documento da SBP de 2023 sobre acondroplasia não abriu.
- **emb-20:** acrescentei 1 incerteza:
  - o sistema de contagem de Miller 1982 continua não confirmado;
  - o PEATE automático com indicador de risco foi conferido em documentos que citam a diretriz do MS;
  - a idade da tomografia na microtia veio da literatura de otologia.
- **Referências novas da camada avançada (do redator):** Moore, Dalley e Agur, 8ª ed. (emb-16, emb-18, emb-19), Sadler cap. 13 (emb-19) e Miller et al. 1982 (emb-20). Estão corretas e sustentam os fatos. Não as alterei.

## 3. Conferência dos pontos clínicos pedidos

| Ponto | Resultado |
|---|---|
| Duplicação ureteral e Weigert–Meyer (emb-16-q26) | Correto. Ureter do polo superior: orifício caudal e medial, ureterocele ou ectopia, obstrução. Ureter do polo inferior: orifício cranial e lateral, refluxo. A vinheta (menina de 5 meses, ITU febril, ureterocele, refluxo só para o polo inferior) é típica e segue a investigação habitual após a 1ª ITU febril. O distrator (c) é fraco numa menina, mas está claramente errado. Faltava só a fonte urológica, que foi acrescentada. |
| Rim em ferradura e aneurisma (emb-16-q27) | Correto. Na cirurgia da aorta, a equipe deve esperar artérias múltiplas, de origem aórtica baixa ou ilíaca. A irrigação é muito variável, e a explicação já admite ramo da AMI como variação. O padrão "uma artéria de cada lado" existe numa minoria, mas o distrator (b) está errado pelo motivo que dá. |
| Rim displásico multicístico (emb-16-q28) | Gabarito correto. O seguimento do rim contralateral **foi acrescentado** (ver tabela). |
| Artéria polar inferior (emb-16-q30) | Correto, conforme Moore: artéria terminal; pode cruzar o ureter e causar hidronefrose. |
| Persistência dos ductos de Müller (emb-17-q24) | Correto: AMH ou AMHR2, testosterona e DHT normais; achado em cirurgia de hérnia ou criptorquidia. |
| Hipospádia proximal com gônadas impalpáveis (emb-17-q25) | Correto e no foco pedido: afastar primeiro HAC em 46,XX, pelo risco de crise perdedora de sal. Também estão certos: não atribuir o sexo antes da investigação; circuncisão contraindicada na hipospádia (o prepúcio serve à correção); gônadas impalpáveis bilaterais → DDS (AUA, Kolon 2014). As orientações atribuídas à SBP não foram confirmadas no texto integral (incerteza). |
| INSL3 e descida (emb-17-q26) | Correto: a fase transabdominal depende sobretudo do INSL3 e do gubernáculo; a inguinoescrotal, dos andrógenos. |
| Insensibilidade completa × Swyer (emb-17-q27) | Correto e qualitativo. Na insensibilidade completa, risco tumoral baixo: decisão compartilhada, sem pressa, com vigilância possível. Na disgenesia gonadal completa com Y, risco alto e gonadectomia indicada. Compatível com Lee 2006/2016 e com a série de Cambridge de 2017. |
| Vias SRY/AMH/testosterona/DHT/CYP21A2 (emb-17-q28) | Correto. Cada quadro tem um só ponto da via entre as opções oferecidas. |
| Terminologia DDS (emb-17) | Coerente com o tópico (sigla DDS; "DDS 46,XX"; "disgenesia gonadal completa 46,XY"). Nenhuma expansão divergente nas questões avançadas. |
| Medula presa (emb-18-q25) | Correto: estigma cutâneo, cone em L4 e filamento espessado; tração com o crescimento. A janela ultrassonográfica está descrita corretamente. |
| Núcleo do hipoglosso (emb-18-q26) | Correto: neurônio motor inferior, atrofia e fasciculações, desvio para o lado lesado, placa basal medial no assoalho do 4º ventrículo. Sensibilidade e paladar preservados: coerente. |
| Chiari II e MOMS (emb-18-q27) | Correto. Correção antes de 26 semanas de IG, com menos derivação e menos herniação do rombencéfalo, mas mais prematuridade e risco para a cicatriz uterina. A vinheta (23 semanas) está dentro da janela do ensaio. Sem números. |
| Anencefalia × agenesia renal (emb-18-q28) | Correto: equilíbrio entre urina fetal e deglutição; polidrâmnio × anidrâmnio. |
| Trajeto do liquor (emb-18-q29) | Correto e inequívoco. |
| Hérnia C6–C7 → raiz C7 (emb-19-q25) | Correto, e as refutações estão precisas. |
| Acondroplasia e forame magno (emb-19-q26) | Mecanismo correto (base endocondral × abóbada intramembranosa). O risco no lactente e a conduta **foram acrescentados**. |
| Ramos dorsais (emb-19-q27) | Correto. O latíssimo do dorso, inervado pelo toracodorsal (plexo braquial), é o bom distrator. |
| Coloboma (emb-20-q25) | Correto: fissura fechada na 7ª semana após a fertilização (≈ 9ª de IG), e exposição com 14 semanas de IG não explica o defeito. A menção à CHARGE é apropriada no coloboma bilateral. |
| Rubéola congênita (emb-20-q26) | Correto. Resumo de Miller 1982 reconfirmado: defeitos em todos os infectados antes da 11ª semana; em 35% dos infectados com 13–16 semanas, só surdez; nenhum defeito em 63 crianças infectadas após a 16ª. **Sistema de contagem não confirmado**: o resumo não o informa; o trabalho de 1980 do mesmo grupo conta a partir da DUM, e o Green Book britânico resume a série em semanas de gestação. A vinheta (15 semanas de IG datadas por ultrassonografia do 1º trimestre, ≈ 13 após a fertilização) fica dentro da faixa nos dois sistemas. A conduta auditiva foi precisada. |
| Microtia com atresia do meato (emb-20-q27) | Correto: perda condutiva, labirinto membranáceo da vesícula ótica. A vinheta foi ajustada (ver tabela). |
| Vinhetas e distratores (geral) | Realistas e plausíveis, com uma única alternativa defensável em todas. O único ajuste de realismo foi a tomografia da emb-20-q27. |

## 4. Dificuldade 4 nas questões de recordação (opinião; nada alterado)

| id | tipo | o que a questão exige | opinião |
|---|---|---|---|
| emb-18-q29 | ordenar | Trajeto do liquor, conteúdo básico de anatomia do 1º ano | Dificuldade 2–3. Não merece 4 pelo conteúdo; a integração com as hidrocefalias está só na explicação. |
| emb-19-q29 | associar | Origens de 6 estruturas do dorso e do membro | Dificuldade 3. O único elemento acima do básico é separar o bíceps (células hipaxiais que migram) do úmero (mesoderma lateral somático). |
| emb-20-q29 | associar | Origens de 6 estruturas do olho e da orelha | Dificuldade 3. É recordação; a doença citada não muda a resposta. |
| emb-16-q30 | V/F | Dois fatos de um quadro clínico do Moore e uma consequência direta | Dificuldade 3. |
| emb-19-q28 | V/F | Consequência da ressegmentação para artérias e nervos | Dificuldade 3. É compreensão de um conceito menos conhecido, mas sem caso a resolver. |

Fora da lista, a emb-20-q28 (ordenar o trajeto da luz) também é de dificuldade 3 na prática; corrigi só o bloom.

Nenhuma das cinco merece 4 pela exigência cognitiva. Elas ficam no "Desafio avançado" (dificuldade 4–5) só por decisão editorial. As saídas possíveis são baixar para 3, o que as tira do modo avançado, ou reescrevê-las como vinhetas clínicas, mantendo os ids. Não alterei a dificuldade, conforme pedido.

## 5. Pontos para o revisor humano

1. **SBP, Documento Científico nº 232 (genitália atípica, 2026), emb-17-q25:** o documento existe, mas não consegui abrir o texto integral. Confirmar que ele orienta tratar o caso como urgência, não atribuir o sexo na sala de parto e investigar HAC, como a explicação lhe atribui.
2. **Lee et al. 2016, emb-17-q27:** o texto integral ainda não foi conferido. A conduta na insensibilidade completa aos andrógenos vem mudando, a favor de adiar a gonadectomia e manter vigilância. A questão é qualitativa e está alinhada com isso.
3. **Rim displásico multicístico, emb-16-q28:** não achei documento da SBP nem da SBU. A uretrocistografia de rotina ou seletiva diverge entre serviços e ficou de fora. Se houver protocolo brasileiro de seguimento, citá-lo.
4. **Acondroplasia, emb-19-q26:** conferir no documento da SBP de 2023 ("Acondroplasia: etiologia, apresentação clínica e tratamento") e no texto integral da AAP 2020 o momento da neuroimagem e da polissonografia no lactente. Se a SBP coincidir, citá-la no lugar da AAP ou junto dela.
5. **Miller 1982, emb-20-q26:** confirmar no texto integral se as semanas são contadas pela DUM. A questão continua correta nos dois sistemas.
6. **Triagem auditiva, emb-20-q26 e q27:** confirmar no texto integral das Diretrizes de 2012 do MS que a rubéola congênita está na lista de indicadores de risco, com PEATE automático e monitoramento, e se há versão mais recente vigente.
7. **Microtia, emb-20-q27:** a mudança da tomografia para os 5 anos se baseou em literatura de otologia, não em diretriz brasileira. Vale a opinião de um otorrinolaringologista pediátrico.
8. **Sugestões não aplicadas** (nada errado; seriam acréscimos):
   - emb-17-q25: dizer que o teste do pezinho, que inclui HAC, não substitui a investigação imediata, porque o resultado pode chegar depois da crise;
   - emb-18-q25: dizer que o achado pede ressonância e avaliação neurocirúrgica;
   - emb-16-q30: ligar a artéria polar à obstrução da junção ureteropélvica por vaso cruzado, em que a correção reposiciona a pelve sem seccionar a artéria;
   - emb-18-q26: a frase "as placas do teto e do assoalho não contêm neuroblastos" é de Sadler e vale para o bulbo; a placa do assoalho do mesencéfalo é neurogênica (ponto já registrado na 1ª etapa).
9. **Limitação de acesso:** o WebFetch não alcançou `renaissance.stonybrookmedicine.edu` (texto do consenso de 2016) nem `ern-ithaca.eu` (texto da AAP 2020); os dois hosts estão fora da rede permitida da sessão. Todas as conferências externas foram feitas por resumos de busca, não pelo texto integral.

## 6. Verificação

- `npm run validar-conteudo`: `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.`
- `npx vitest run`: `Test Files 6 passed (6) · Tests 47 passed (47)`.
- Auditoria por script, comparando com a cópia dos 5 arquivos feita antes das edições:
  - só mudaram `referencia`/`explicacao` (emb-16-q26, q28; emb-19-q26; emb-20-q26, q27), `contexto` (emb-20-q27) e `bloom` (emb-20-q28);
  - nas listas, houve só acréscimos no fim de `referencias`, `incertezas` e `revisao.agentes`, e as duas incertezas da camada avançada do emb-16 foram completadas;
  - ids, alternativas, gabaritos, pares, itens e dificuldades ficaram iguais;
  - `revisao.humano` = `null` nos 5.
- Scripts temporários: `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-av4-cli/` (`editar.py`, `auditar.py`, cópias anteriores às edições).

### Fontes consultadas por busca (resumos, não o texto integral)

- Miller E et al., Lancet 1982 (resumo): https://www.qxmd.com/r/6126663 · Cradock-Watson et al., 1980: https://www.cambridge.org/core/journals/epidemiology-and-infection/article/fetal-infection-resulting-from-maternal-rubella-after-the-first-trimester-of-pregnancy/9061A0B2E788A430860BCAAA41619D18 · Green Book, cap. 28: https://assets.publishing.service.gov.uk/media/5a7b362bed915d3ed9062e5f/Green-Book-Chapter-28-v2_0.pdf
- Schreuder et al. 2009: https://www.qxmd.com/r/19171687 · Rabelo et al. 2005: https://scielo.br/j/jped/a/q5LsHk9ff33jngrpzd4vVmS/abstract/?lang=en
- EAU/ESPU, ureterocele e ureter ectópico: https://nl.patients.uroweb.org/guidelines/paediatric-urology/chapter/ureterocele-and-ectopic-ureter · Pediatric Urology Book: https://v1.pediatricurologybook.com/duplex-kidney.html
- Rim em ferradura: https://www.springermedicine.com/horseshoe-kidney-a-review-of-anatomy-and-pathology/20807228 · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10192719/
- AAP 2020 (acondroplasia): https://www.pubmed.gov/32457214/ · SBP 2023 (acondroplasia): https://www.sbp.com.br/sbp-lanca-documento-sobre-etiologia-apresentacao-clinica-e-tratamento-da-acondroplasia/
- SBP, Documento nº 232 (genitália atípica): https://www.sbp.com.br/abordagem-da-crianca-que-nasce-com-genitalia-atipica-orientacoes-para-o-pediatra/ · Resolução CFM nº 2.455/2026: https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2455_2026.pdf
- Insensibilidade completa aos andrógenos e risco gonadal: https://read.qxmd.com/read/25879315/gonadal-malignancy-risk-and-prophylactic-gonadectomy-in-disorders-of-sexual-development · https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2022.856128/pdf
- Triagem auditiva (MS 2012 e documentos que a citam): https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-pessoa-com-deficiencia/publicacoes/diretrizes-de-atencao-da-triagem-auditiva-neonatal.pdf · https://saude.es.gov.br/Media/sesa/Profissionais%20de%20Sa%C3%BAde%20e%20Gestores/Nota_T%C3%A9cnica_43_Triagem_Auditiva_Neonatal.pdf
- Atresia aural e tomografia: https://med.virginia.edu/otolaryngology/?p=489 · https://radiopaedia.org/cases/congenital-aural-atresia-2?lang=gb
- MOMS: https://www.chop.edu/centers-programs/center-fetal-diagnosis-and-treatment/management-myelomeningocele-study
