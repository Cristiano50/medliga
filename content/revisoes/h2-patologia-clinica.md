# Revisão H2: patologia/clínica (tópicos 5 a 7), 2ª etapa

- **Agente:** `revisor-patologia-clinica-v1`. Olhar de patologia geral, clínica médica e laboratório.
- **Data:** 2026-11-09
- **Protocolo:** `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`, seção "Histologia".
- **Etapa anterior:** `content/revisoes/h2-histologia.md`. Não refiz o que já estava conferido e não discordei de nenhuma correção da 1ª etapa.
- **Arquivos editados (só estes):**
  - `content/histologia/topicos/his-05-adiposo.json`
  - `content/histologia/topicos/his-06-cartilagem.json`
  - `content/histologia/topicos/his-07-osso.json`
- **Garantias:**
  - Nenhum id foi alterado (tópicos, questões, estruturas, eventos, correlações).
  - Nenhum gabarito, letra correta ou `ordemCorreta` foi alterado.
  - `revisao.humano` continua `null` nos três arquivos.
  - Nada foi commitado.
- **Situação:** revisão por agente (IA). Nada aqui substitui a conferência médica.

## 1. Resumo

Revisei todos os campos dos três tópicos (79 questões). O foco foi o pedido desta etapa: correlações clínicas e vinhetas, condutas e números clínicos, frases sensíveis e distratores.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-05 Tecido adiposo | 26 (14 MC, 6 V/F, 4 ordenar, 2 associar) | 0 | 2 | 4 | 6 | aprovado-com-correcoes |
| his-06 Tecido cartilaginoso | 26 (15 MC, 6 V/F, 3 ordenar, 2 associar) | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| his-07 Tecido ósseo | 27 (16 MC, 6 V/F, 3 ordenar, 2 associar) | 0 | 2 | 8 | 10 | aprovado-com-correcoes |
| **Total** | **79** | **0** | **4** | **15** | **19** | |

**Gravidade:**
- **crítica:** fato errado ou gabarito errado;
- **importante:** ambiguidade, distrator defensável, explicação incorreta, ou conduta e critério clínico imprecisos;
- **menor:** redação, terminologia, precisão ou referência.

**Gabaritos.** Os 79 gabaritos estão corretos, e nenhuma questão tem mais de uma alternativa defensável. Os distratores das vinhetas são clinicamente plausíveis e nenhum depende de pegadinha:
- lipoma × lipossarcoma × hibernoma;
- osteoartrite × gota × artrite reumatoide;
- condrossarcoma × osteossarcoma × encondroma;
- acondroplasia × osteogênese imperfeita × raquitismo × deficiência de GH;
- osteoporose × osteomalácia × osteopetrose × hiperparatireoidismo.

**Checagens automáticas, iguais antes e depois:**
- Letras corretas: his-05 a3/b4/c4/d3; his-06 a4/b3/c4/d4; his-07 a4/b4/c4/d4. Nenhuma passa de 40%.
- Toda explicação de múltipla escolha cita a letra de cada alternativa.
- Questões com `contexto`: 6, 8 e 9 por tópico.

### O que conferi, item a item do pedido

| Tema | Onde está | Situação |
|---|---|---|
| Lipomas e lipossarcoma (MDM2) | his-05 correlações, q11, q12, q20 | Correto. O lipoma é o tumor de partes moles mais comum do adulto. O lipossarcoma em geral surge sem lipoma prévio. A amplificação de MDM2 (12q13–15) é o achado mais específico do bem diferenciado; o mixoide tem t(12;16). Acrescentei o termo da OMS 2020, "tumor lipomatoso atípico" (correção 3). A q11 foi alinhada à ressalva da 1ª etapa (lipoblastos não obrigatórios; correção 4). |
| Obesidade, leptina e adiponectina | his-05 resumo, correlações, q07, q13, q17, q25 | Correto. Leptina alta com resistência e adiponectina baixa; deficiência congênita de leptina responde à leptina recombinante. Sem correção. |
| Tecido pardo no recém-nascido e no prematuro | his-05 resumo, correlação, q09, q10, q14, q18 | Duas correções importantes. O resumo contradizia a si mesmo (correção 1). A conduta da correlação não seguia a diretriz da SBP para o prematuro <34 semanas (correção 2). |
| Osteoartrite e condrossarcoma (idade e sítios) | his-06 resumo, correlações, q10, q11, q24 | Idade "a partir dos 40 anos" está correta. Completei os sítios do condrossarcoma (fêmur e úmero proximais; raro em mãos e pés) e apresentei a osteoartrite como doença de toda a articulação (correções 7 e 9). |
| Acondroplasia (FGFR3) | his-06 correlação, q12 | Correta: mutação ativadora, autossômica dominante, maioria por mutação nova, idade paterna. Ajustei o "displasia esquelética mais comum" (correção 8). |
| Policondrite | — | **Não consta do conteúdo.** Não acrescentei (ver seção 3, item 9). |
| Osteoporose (densitometria, T-score, tratamento) | his-07 correlação, q12, q19 | O critério estava incompleto (correção 10). Não há tratamento citado, o que é adequado para um jogo de histologia. |
| Raquitismo e osteomalácia (vitamina D, laboratório) | his-07 resumo, correlação, q12, q13 | Mecanismo e laboratório corrigidos (correções 11 e 12). Vinheta ajustada (correção 13). |
| Osteogênese imperfeita | his-07 correlação, q14, his-06-q12 | Correta. Acrescentei as formas recessivas e o diferencial com maus-tratos (correção 14). |
| Doença de Paget | — | **Não consta como correlação.** Passou a aparecer só como exemplo de fosfatase alcalina muito elevada (correção 15). Ver seção 3, item 9. |
| Consolidação de fraturas | his-07 resumo, correlação, q25 | Sequência correta. Acrescentei os fatores que retardam a consolidação e uma nota sobre consolidação primária × osso primário (correção 18). |
| Hiperparatireoidismo | his-07 correlação, q06, q16, q26 | Correto. Fósforo "baixo ou normal-baixo" no primário (correção 17). |
| Calcitonina como marcador | his-07 resumo, q22, q26 | Não constava. Acrescentei o uso como marcador do carcinoma medular da tireoide e a restrição do uso farmacológico (correção 16). |

**Frases sensíveis.** Nada no conteúdo é orientação de tratamento a pacientes. Três trechos de conduta foram mantidos em tom didático, descrevendo o que a literatura faz:
- leptina recombinante na deficiência congênita;
- tratamento cirúrgico do condrossarcoma;
- transplante na osteopetrose.

O único trecho prescritivo era o de hipotermia neonatal. Ele foi reescrito com atribuição explícita à diretriz da SBP (correção 2).

**Campo `fontes`.** O pedido citava esse campo, mas o `TopicoSchema` (`src/content/schema.ts`) não o tem: ele só existe nos arquivos de escolas e de currículo, e o Zod descartaria a chave sem aviso. As fontes foram registradas onde o schema prevê:
- `referencias` do tópico: 3 novas no his-05, 3 no his-06 e 8 no his-07;
- `referencia` das questões alteradas;
- texto das `notasDivergencia` e das `incertezas`.

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | his-05-adiposo | resumo (Correlações) | "O recém-nascido, sobretudo o prematuro, tem **pouca reserva de gordura parda**…" | Recém-nascido: panículo fino e grande superfície relativa; gordura parda **proporcionalmente abundante, porém reserva limitada**; o prematuro tem ainda menos | Contradizia o próprio resumo ("relativamente abundante") e a q09. Induziria o aluno a achar que o RN a termo tem pouca gordura parda. | importante | Ross 8ª ed., tecido adiposo; MSD Manual (profissionais), "Hipotermia em neonatos" |
| 2 | his-05-adiposo / `hipotermia-neonatal` | correlacoesClinicas.descricao | "Medidas como **secar** e aquecer o bebê, contato pele a pele e ambiente térmico neutro previnem a hipotermia" (frase aplicada "sobretudo ao prematuro") | Normotermia como prioridade (axilar 36,5–37,5 °C), segundo as diretrizes SBP 2022. RN ≥34 semanas: sala aquecida, secagem com compressas aquecidas, pele a pele se houver boa vitalidade. **Prematuro <34 semanas: não se seca o corpo; saco plástico de polietileno, touca dupla, calor radiante.** Hipotermia aumenta morbimortalidade. | A conduta generalizada contrariava a diretriz para o prematuro <34 semanas. Era o único trecho de conduta. | importante | SBP/PRN, diretrizes 2022 (RN ≥34 semanas e prematuro <34 semanas) |
| 3 | his-05-adiposo / `lipossarcoma` | correlacoesClinicas.descricao | "O tipo bem diferenciado tem células atípicas…" | Acrescentado: chama-se **tumor lipomatoso atípico** quando está nos membros ou no tronco, onde pode ser ressecado por completo (OMS, 2020) | Terminologia vigente da OMS, que o aluno encontra em laudos | menor | WHO Soft Tissue and Bone Tumours, 5ª ed., 2020 |
| 4 | his-05-q11 | explicacao | Bem diferenciado "mostra atipia… **e lipoblastos**" | "atipia… **às vezes** lipoblastos, e amplificação de MDM2" | A 1ª etapa corrigiu isso na correlação e na q12, mas a q11 ficou para trás. Gabaritos (d) e (a) mantidos. | menor | OMS 2020; Robbins 10ª ed. |
| 5 | his-05-q10 | explicacao, referencia | Sem valor de referência | "35,5 °C está abaixo da faixa normal de temperatura axilar (36,5 a 37,5 °C)"; referência à SBP 2022 | Dá ao aluno o critério para interpretar a vinheta | menor | SBP 2022 |
| 6 | his-05-adiposo | notasDivergencia (nova) | — | Dois sentidos de "lipoblasto": precursor normal (histologia) × célula diagnóstica do lipossarcoma, também vista no lipoblastoma (patologia) | O resumo usa "pré-adipócitos (lipoblastos)" e as questões de tumor usam "lipoblastos" como sinal de malignidade. Sem a nota, o aluno pode confundir. | menor | Junqueira 14ª ed., cap. 6; OMS 2020 |
| 7 | his-06-cartilagem (resumo; `condrossarcoma`) | resumo; correlacoesClinicas.descricao; notasDivergencia (nova) | Sítios: "pelve, cintura escapular, costelas" | "pelve, costelas, cintura escapular e **extremidades proximais do fêmur e do úmero**; raro nas mãos e nos pés (sede típica do encondroma)". Nota: "tumor cartilaginoso atípico" (grau 1, esqueleto apendicular) × "condrossarcoma grau 1" (pelve, escápula, base do crânio). | O fêmur proximal está entre os sítios mais frequentes; o contraste com o encondroma é o que a q11 cobra. Idade (≥40 anos) mantida. | menor | OMS 2020 (tumores condrogênicos); Robbins 10ª ed. |
| 8 | his-06-cartilagem / `acondroplasia` | correlacoesClinicas.descricao; notasDivergencia (nova) | "A displasia esquelética mais comum e importante causa de nanismo" | "A causa mais comum de baixa estatura desproporcionada (nanismo de membros curtos)". Nota: Robbins × GeneReviews; cerca de 80% por mutação nova (o texto mantém "a maioria"). | "Mais comum" depende de se contar a osteogênese imperfeita, que também está na nosologia das displasias. A formulação de GeneReviews é inequívoca. | menor | GeneReviews NBK1152 (Legare JM, Achondroplasia) |
| 9 | his-06-cartilagem / `osteoartrite` | correlacoesClinicas.descricao | "Doença degenerativa da cartilagem articular" | "Doença de **toda a articulação** (cartilagem, osso subcondral, sinóvia, estruturas periarticulares), centrada na degeneração da cartilagem" | Conceito atual (OARSI). A correlação já citava mediadores inflamatórios, esclerose e cistos subcondrais. | menor | Kraus VB et al. Osteoarthritis Cartilage 2015;23:1233–41 |
| 10 | his-07-osso / `osteoporose`; his-07-q12 | correlacoesClinicas.descricao; explicacao, referencia; incertezas | "diagnóstico densitométrico por DXA (T-score ≤ −2,5)" | **Diagnóstico clínico** por fratura por fragilidade (em especial vertebral ou do fêmur proximal), independentemente da DXA. **Densitométrico:** T-score ≤ −2,5 na coluna lombar, no colo do fêmur ou no fêmur total, **só em mulheres na pós-menopausa e homens ≥50 anos**; com fratura = osteoporose estabelecida (grave); antes da menopausa e em homens <50 anos, **Z-score**. Na q12: T-score −3,0 + fratura vertebral = osteoporose estabelecida. | O texto sugeria que o T-score vale para qualquer idade e omitia o diagnóstico por fratura, que está no PCDT do MS. Os dois pontos são cobrados em prova. | importante | OMS, TRS 843 (1994); ISCD, posições oficiais; MS, PCDT Osteoporose (2023, revogado em 10/2025; ver seção 3) |
| 11 | his-07-osso / `raquitismo-osteomalacia` | correlacoesClinicas.mecanismo | "**Sem calcitriol**, a absorção… cai e a mineralização falha" | Pouca vitamina D → menor absorção de cálcio e fosfato → **hiperparatireoidismo secundário** (calcemia mantida à custa do osso, **perda renal de fosfato**) → falha de mineralização. **Laboratório:** 25(OH)D baixa, PTH e fosfatase alcalina altos, fósforo baixo, cálcio normal ou baixo. **O calcitriol pode estar normal ou alto e não serve para o diagnóstico.** | Na forma carencial, o calcitriol muitas vezes está normal ou alto (o PTH estimula a 1α-hidroxilase). "Sem calcitriol" leva ao erro clássico de pedir 1,25(OH)₂D. A hipofosfatemia por PTH explica a falha de mineralização. | importante | Munns CF et al. J Clin Endocrinol Metab 2016;101:394–415 |
| 12 | his-07-osso | resumo (Correlações) | "mineralização deficiente **por falta de vitamina D**" | "em geral por falta de vitamina D (também por falta de fosfato)" | Coerência com a correlação, que já citava fosfato (raquitismo hipofosfatêmico) | menor | Munns 2016; Robbins 10ª ed. |
| 13 | his-07-q13 | contexto, referencia | "Criança de 18 meses, em aleitamento materno **exclusivo** prolongado" | "em aleitamento materno prolongado" | Aleitamento exclusivo aos 18 meses é irreal e foge da recomendação de alimentação complementar a partir dos 6 meses. O fator de risco que a vinheta quer mostrar (aleitamento sem suplementação de vitamina D, pouco sol) continua lá. Gabarito (b) mantido. | menor | Munns 2016 |
| 14 | his-07-osso / `osteogenese-imperfeita`; his-07-q14 | correlação (descricao, mecanismo); explicacao | Só COL1A1/COL1A2; sem diferencial | "Na maioria dos casos (formas AD), COL1A1/COL1A2; formas recessivas raras (genes do processamento do colágeno)". **Fraturas múltiplas na infância exigem investigar maus-tratos; os diagnósticos não se excluem.** Na q14, escleras azuladas e história familiar favorecem OI. | Precisão genética e frase clínica de segurança. Não abre outra resposta, porque nenhuma alternativa cita maus-tratos. | menor | GeneReviews NBK1295 (COL1A1- and COL1A2-Related OI) |
| 15 | his-07-osso (resumo); his-07-q03 | resumo; explicacao | "fosfatase alcalina, marcador sérico de formação óssea" | Marcador é a **fração óssea** (a total também vem do fígado). Na q03: sobe de forma acentuada na **doença de Paget**; P1NP é outro marcador de formação. | Erro frequente do aluno: atribuir ao osso toda fosfatase alcalina elevada. Gabarito (a) mantido. | menor | Robbins 10ª ed.; Ross 8ª ed. |
| 16 | his-07-q22; notasDivergencia (calcitonina) | explicacao, referencia; nota | Nota: "embora tenha uso farmacológico" | q22: calcitonina sérica é sobretudo **marcador tumoral do carcinoma medular da tireoide** (células C). Nota: uso farmacológico restrito; a EMA (2012) retirou a indicação em osteoporose por pequeno aumento do risco de câncer no uso prolongado. | Atualização e integração clínica pedidas ("calcitonina como marcador"). Gabarito (falso) mantido. | menor | Robbins 10ª ed., Sistema endócrino; EMA, comunicado de 2012 |
| 17 | his-07-osso / `hiperparatireoidismo` | correlacoesClinicas.descricao | Primário "com hipercalcemia e **hipofosfatemia**" | "com hipercalcemia e fósforo **baixo ou normal-baixo**" | No hiperparatireoidismo primário o fósforo muitas vezes está na faixa normal-baixa. A vinheta q16 (fósforo baixo) continua correta. | menor | Robbins 10ª ed., Sistema endócrino |
| 18 | his-07-osso / `reparo-de-fratura`; notasDivergencia (nova) | correlacoesClinicas.descricao; nota | "imobilização adequada e boa vascularização favorecem" | "estabilidade adequada do foco (imobilização ou fixação) e boa vascularização favorecem; mobilidade excessiva, infecção e desnutrição retardam e podem levar à **pseudoartrose**". Nota: consolidação primária (direta, sem calo, com estabilidade absoluta) e secundária (com calo) ≠ osso primário e secundário. | Completar o quadro clínico e evitar confusão de termos entre ortopedia e histologia | menor | Robbins 10ª ed. (consolidação de fraturas); AO Principles of Fracture Management, 3ª ed., 2017 |
| 19 | his-07-osso / `osteopetrose`; his-07-q15 | correlacoesClinicas.descricao; explicacao | "o transplante… pode ser curativo" | "…quando o defeito é do próprio osteoclasto". Na q15: nas formas por deficiência de **RANKL** (produzido por células mesenquimais) o transplante não corrige a doença. | Precisão. Reforça o raciocínio da questão (linhagem do osteoclasto × do estroma). Gabarito (a) mantido. | menor | Wu CC et al. J Clin Endocrinol Metab 2017;102:3111–23 |

Registro em `revisao.agentes`, acrescentado depois da entrada da 1ª etapa nos três tópicos:

`{"area": "patologia/clinica", "agente": "revisor-patologia-clinica-v1", "data": "2026-11-09", "veredito": "aprovado-com-correcoes", "notas": "<n> correções (…)"}`

## 3. Pontos para o revisor humano

1. **PCDT de Osteoporose do Ministério da Saúde.**
   - A Portaria Conjunta SAES/SECTICS nº 19/2023 foi revogada por uma portaria conjunta de 22/10/2025.
   - As fontes divergem quanto ao número (22 ou 23), e o texto integral não pôde ser aberto: os sites `gov.br` estão bloqueados na rede desta sessão.
   - Conferir se a versão de 2025 mantém:
     - a definição clínica por fratura por fragilidade;
     - o critério densitométrico da OMS.
   - Conferir também o número da portaria em `referencias` do his-07.
2. **Diretrizes de reanimação neonatal da SBP (2022).**
   - Foram conferidas só por busca: saco plástico de polietileno e touca dupla obrigatórios no prematuro <34 semanas; temperatura axilar de 36,5–37,5 °C.
   - Conferir no documento:
     - a redação sobre secagem e contato pele a pele no RN ≥34 semanas;
     - os títulos exatos dos dois documentos;
     - se convém citar a temperatura da sala de parto, que deixei qualitativa ("sala aquecida").
   - **Decisão pedagógica:** manter esse nível de detalhe de conduta num tópico de histologia ou reduzir a correlação ao mecanismo e a uma frase com a fonte.
3. **Neonatologia (resolvida em parte).** A termogênese sem tremor como mecanismo principal no RN e a menor gordura parda do prematuro batem com a literatura (MSD Manual; SBP). Ainda falta conferir em tratado de neonatologia, como pediu a 1ª etapa.
4. **Acondroplasia.**
   - Confirmar se o curso prefere a frase de Robbins ("displasia esquelética mais comum") ou a de GeneReviews, que foi a adotada.
   - Decidir se cita o número de cerca de 80% de mutações novas.
5. **Terminologia da OMS 2020 nos tumores.**
   - Termos: "tumor lipomatoso atípico" e "tumor cartilaginoso atípico".
   - Constam só na correlação do lipossarcoma e em notas. Nenhuma questão cobra esses termos.
   - Decidir se devem entrar em questões.
6. **Calcitonina.**
   - A restrição citada é da EMA (2012).
   - Não conferi o registro atual na ANVISA (spray nasal, injetável). A frase do conteúdo ("uso farmacológico restrito") é qualitativa.
7. **Hiperparatireoidismo.**
   - "Hoje muitos casos são diagnosticados pela calcemia, antes da doença óssea" está correto em termos qualitativos.
   - Séries brasileiras mostram proporção de casos sintomáticos maior que as norte-americanas e europeias. Avaliar se convém ressalvar.
8. **Marcadores de remodelação (P1NP).** Acrescentei P1NP como marcador de formação na explicação da his-07-q03, sem número e sem cobrança. Avaliar se o nível de detalhe é adequado ao 1º ano.
9. **Temas do pedido ausentes do conteúdo.** Nada disto foi implementado. São propostas ao redator, porque criar uma correlação nova exigiria a revisão de histologia antes.
   - **Policondrite recidivante (his-06):**
     - inflamação autoimune das cartilagens;
     - pavilhão auricular (elástica) com **preservação do lóbulo**, que não tem cartilagem;
     - nariz em sela;
     - cartilagens traqueobrônquicas (hialina), com risco de colapso da via aérea.
     - É uma boa integração com o tópico de tipos de cartilagem.
   - **Doença de Paget (his-07):**
     - remodelação desordenada, de início osteoclástico;
     - osso lamelar em **padrão em mosaico**, com linhas cimentantes proeminentes (integra o ósteon e a linha cimentante);
     - fosfatase alcalina muito alta;
     - risco aumentado de osteossarcoma no idoso.
10. **Itens da 1ª etapa ainda pendentes.** Continuam válidos:
    - capítulos de Junqueira 14ª ed. e Ross 8ª ed.;
    - redações de Junqueira citadas de memória;
    - id `lacuna` compartilhado entre cartilagem e osso.

## 4. Fontes consultadas nesta sessão (busca pontual)

- EMA. *European Medicines Agency recommends limiting long-term use of calcitonin medicines* (2012): https://ema.europa.eu/documents/press-release/european-medicines-agency-recommends-limiting-long-term-use-calcitonin-medicines_en.pdf
- GeneReviews, Achondroplasia (NBK1152): https://ncbi.nlm.nih.gov/books/NBK1152/pdf/Bookshelf_NBK1152.pdf e https://pubmed.ncbi.nlm.nih.gov/20301331/
- GeneReviews, COL1A1- and COL1A2-Related Osteogenesis Imperfecta (NBK1295): https://www.ncbi.nlm.nih.gov/books/NBK1295/ e https://pubmed.ncbi.nlm.nih.gov/20301472/
- SBP, Reanimação do prematuro na sala de parto 2022: https://www.sbp.com.br/especiais/reanimacao/reanimacao-do-prematuro-na-sala-de-parto/
- MSD Manual (profissionais), Hipotermia em neonatos: https://www.msdmanuals.com/pt/profissional/pediatria/problemas-perinatais/hipotermia-em-neonatos
- Conitec/MS, PCDT Osteoporose:
  - portaria de 2023: https://www.gov.br/conitec/pt-br/midias/protocolos/portariaconjuntano19pcdtosteoporose.pdf
  - portaria de 2025: https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-23-de-22-de-outubro-de-2025.pdf
  - Os dois links apareceram na busca, mas não puderam ser abertos.

Os fatos abaixo foram citados de memória, de obras consagradas, e estão nas `referencias`:
- critérios da OMS (TRS 843, 1994);
- posições da ISCD;
- Munns 2016;
- Wu 2017;
- OARSI 2015;
- OMS 2020;
- AO 2017.

## 5. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441.

$ npx vitest run
 Test Files  5 passed (5)
      Tests  39 passed (39)
```

Comparação estrutural com `HEAD`, feita por script:
- Nos três arquivos, só mudaram os campos listados na tabela, mais `referencias`, `notasDivergencia`, `incertezas` e `revisao.agentes`.
- Número de questões, ids, alternativas e gabaritos estão iguais.

Durante esta revisão havia alterações de outros agentes em outros arquivos do repositório (his-01 a his-04, his-08 a his-10 e um `.tsx`). Não as toquei.

Nada foi commitado.
