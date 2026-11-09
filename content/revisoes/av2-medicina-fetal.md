# Revisão da camada avançada — genética, medicina fetal e obstetrícia (2ª etapa)

- **Agente:** `revisor-medicina-fetal-avancado-v1` (obstetra com atuação em medicina fetal e genética médica; revisor científico de 2ª etapa)
- **Data:** 2026-11-09
- **Escopo:**
  - **Parte 1:** a camada avançada, isto é, as questões com a tag `avancado` (emb-06 q30–q34, emb-07 q30–q34, emb-08 q30–q34, emb-09 q31–q35 e emb-10 q31–q35, 25 questões) e as entradas novas de `referencias`, `notasDivergencia` e `incertezas`.
  - **Parte 2:** a harmonização autorizada de trechos anteriores do emb-08 (surfactante) e do emb-09 (progesterona, estrogênios, pico do hCG).
  - Fora disso, nenhum texto anterior foi alterado. O que encontrei fora do escopo está na seção 5, para o revisor humano.
- **Base:** `docs/protocolo-revisao-agentes.md`, `docs/conteudo-schema.md` e o relatório da 1ª etapa (`content/revisoes/av2-embriologia.md`).
- **Arquivos alterados:** só os cinco tópicos e este relatório. Nenhum id mudou, nenhuma letra correta mudou, nenhum commit foi feito, e `revisao.humano` continua `null` nos cinco arquivos.

## 1. Resumo

Gravidade, conforme o protocolo:
- **crítica:** fato ou gabarito errado;
- **importante:** ambiguidade, distrator defensável ou explicação incorreta;
- **menor:** redação, terminologia, referência ou precisão de conduta.

| Tópico | Questões avançadas revisadas | Camada avançada: crít. / imp. / men. | Harmonização (itens) | Veredito |
|---|---|---|---|---|
| emb-06-semana3 | q30–q34 (5) | 0 / 0 / 1 | — | aprovado-com-correcoes |
| emb-07-semanas4a8 | q30–q34 (5) | 0 / 0 / 1 | — | aprovado-com-correcoes |
| emb-08-periodo-fetal | q30–q34 (5) | 0 / 1 / 3 | 3 (todos importantes) | aprovado-com-correcoes |
| emb-09-placenta-membranas | q31–q35 (5) | 0 / 0 / 4 | 3 (2 importantes, 1 menor) | aprovado-com-correcoes |
| emb-10-malformacoes | q31–q35 (5) | 0 / 0 / 3 | — | aprovado-com-correcoes |
| **Total** | **25** | **0 / 1 / 12** | **6 (5 importantes, 1 menor)** | — |

Nenhum gabarito, novo ou antigo, ficou errado com as mudanças. Por isso não há correção crítica. Um par de associação (emb-08-q29) **deixaria de ser inequívoco** com a faixa nova do surfactante e foi trocado. Classifiquei essa troca como importante, e não como crítica, porque o gabarito antigo ainda podia ser alcançado por eliminação (detalhes na seção 3).

## 2. Tabela de correções — camada avançada

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-08-q32 | `contexto` + `explicacao` + `referencia` | Prematuro de 30 semanas com hipotermia "apesar da **secagem imediata** e das medidas de aquecimento"; gordura parda "já está presente" | "apesar das **medidas de proteção térmica previstas para prematuros**"; gordura parda presente, "ainda que em **reserva menor** que a do RN a termo"; frase final sobre as medidas próprias de proteção térmica do prematuro na diretriz da SBP | Nos menores de 34 semanas, a diretriz de reanimação da SBP (2022) põe o corpo em saco plástico **sem secar**, com touca. A vinheta ensinava uma conduta contrária num prematuro de 30 semanas. A ressalva sobre a gordura parda evita que o aluno conclua que ela é irrelevante na hipotermia do prematuro. Gabarito (a) mantido | **importante** | SBP, reanimação <34 semanas (2022; atualização de 2026 citada de forma qualitativa, ver incertezas); Moore cap. 6 |
| emb-08-q30 | `explicacao` + `referencia` | "A confirmação se faz por biópsia de vilo corial ou amniocentese" | "A confirmação exige exame diagnóstico invasivo"; a biópsia de vilo também analisa placenta e pode reproduzir a discordância (mosaicismo confinado ou placenta do gemelar morto), e a amniocentese analisa o feto vivo; o gemelar evanescente é limitação reconhecida do teste | Precisão de conduta no cenário exato da vinheta (DNA de origem placentária) | menor | ACOG PB 226 (2020) |
| emb-08-q33 | `pares[2].esquerda` | "…a partir de 15 semanas, **no mesmo material em que se dosa a alfafetoproteína**" | "…a partir de 15 semanas, **em líquido no qual também se dosam a alfafetoproteína e a acetilcolinesterase**" | A alfafetoproteína mais conhecida do aluno é a do soro materno, e o material do soro materno é o do DNA fetal livre. O par continuava único pelo "diagnóstico", mas a descrição era imprecisa | menor | Moore cap. 6; Sadler cap. 9 |
| emb-08-q33 | `referencia` | Moore; Sadler | + ACOG PB 226 (2020) | Janela do DNA fetal livre e translucência nucal são números de diretriz | menor (contada com o item acima) | ACOG PB 226 |
| emb-08-q34 | `explicacao` + `referencia` | "o passo seguinte é um exame diagnóstico"; "a insuficiência uteroplacentária **produz** restrição assimétrica" | "oferecer, com aconselhamento genético, um exame diagnóstico invasivo … considerando também a pesquisa de infecção congênita"; "**tipicamente** produz" | Conduta descrita como oferta, com investigação infecciosa. O absoluto foi suavizado: a restrição placentária precoce nem sempre é assimétrica (ver a nota de divergência das classificações) | menor | ACOG PB 226 (2020) e PB 227 (2021) |
| emb-09-q31 | `contexto` + `explicacao` | "dois fetos **do mesmo sexo**" numa ultrassonografia de 12 semanas | "dois fetos"; a explicação diz que sexos discordantes, quando puderem ser definidos com segurança mais adiante, praticamente confirmam a dizigose, e que sexos iguais não esclarecem | A definição do sexo fetal por ultrassonografia com 12 semanas não é confiável, e a vinheta não deve sugerir o contrário. A conclusão (corionicidade sim, zigosidade não) continua a mesma. Gabarito (b) mantido | menor | Moore cap. 7; Sadler cap. 8 |
| emb-09-q32 | `explicacao` | "…produzida por ele — **prova** de contato com o agente" | "— **indício** de contato…", mais uma frase sobre as limitações práticas da IgM neonatal (pode faltar em parte dos infectados; no sangue do cordão pode refletir contaminação materna) | Evita absolutizar um exame com sensibilidade limitada. O princípio cobrado (IgM não atravessa a placenta) não muda | menor | Moore cap. 7 e 20 (limitações descritas de forma qualitativa; ver incertezas) |
| emb-09-q34 | `explicacao` | TFF "**só ocorre** nas monocoriônicas" | "ocorre **praticamente só** nas monocoriônicas" | Coerência com a q31, corrigida na 1ª etapa pelo mesmo motivo (relatos raros em placentas dicoriônicas fundidas) | menor | Moore cap. 7; Sadler cap. 8 |
| emb-09-q35 | `contexto`, `enunciado`, alternativas (a)–(d), `explicacao` | "qual investigação **se impõe**?"; "impõe-se…" nas quatro alternativas; gestação única só implícita | "qual investigação **está indicada**?"; "indica-se…" nas quatro alternativas, para não criar pista; "gestação única" explícita; "justifica **oferecer** o estudo citogenético fetal, com aconselhamento" | Exame genético é oferecido, não imposto. A refutação de (c) dependia de a gestação ser única, o que não estava dito | menor | Moore cap. 7, 11 e 20 |
| emb-10-q31 | `explicacao` + `referencia` | "afetados em primeiro e em segundo graus" (sem dizer em relação a quem) | "um irmão afetado (primeiro grau da futura criança) e um primo materno afetado (terceiro grau)", com o peso maior no irmão | Precisão genética: o grau de parentesco depende do referencial. A dose alta de ácido fólico foi mantida em 4 a 5 mg/dia (pendência com o revisor humano) | menor | Thompson & Thompson cap. 8; FEBRASGO 2020 (acrescentada) |
| emb-10-q32 | `explicacao` + `referencia` | Refutação de (d): "transfere ao valproato a assinatura da talidomida… e ignora o risco cognitivo"; sem outras anomalias do valproato | (d) "atribui ao valproato, **como risco principal**, a assinatura da talidomida… e ignora o defeito do tubo neural e o risco cognitivo"; avaliação dirigida justificada também pelas anomalias craniofaciais, cardíacas e esqueléticas do valproato | A redação antiga sugeria que o valproato não tem relação com defeitos esqueléticos. Explicita por que a avaliação morfológica continua útil com 9 semanas | menor | Moore cap. 20 (tabela de teratógenos); MS, Manual de gestação de alto risco (2022), com incerteza |
| emb-10-q33 | `explicacao` + `referencia` + `incertezas[4]` | Limiar qualitativo, sem diretriz citada | Limiar continua qualitativo e passa a citar a ACOG: "salvo poucas exceções, radiografia, tomografia e medicina nuclear expõem o feto a doses muito menores do que as associadas a dano fetal" | O pedido manda citar a diretriz quando houver conduta. O número de 50 mGy **não** foi escrito, porque não consegui conferi-lo no texto integral (ver incertezas) | menor | ACOG CO 723 (2017; reafirmado em 2021, segundo citação localizada) |
| emb-06-q32 | `explicacao` + `referencia` | Vinheta com biópsia retal de espessura total, sem comentário sobre o exame habitual | Frase nova: no RN, a investigação habitualmente começa pela biópsia **por sucção** (mucosa e submucosa, plexo submucoso; como em emb-15-q13). A de **espessura total**, usada na vinheta, inclui o plexo mioentérico e fica para situações selecionadas (por exemplo, sucção inconclusiva) | O aluno não deve sair achando que a biópsia de espessura total é o primeiro exame do RN. A vinheta foi mantida, porque é coerente com a descrição dos dois plexos | menor | emb-15-digestorio (2ª etapa de pediatria); Kyrklund et al., ERNICA 2020 (só o resumo foi lido; ver incertezas) |
| emb-07-q32 | `explicacao` + `notasDivergencia` (nova) + `referencias` (nova) | Conversão só pela Tabela 5-1 de Moore | Aviso de que as curvas ultrassonográficas de CCN, obtidas in vivo, dão idade alguns dias menor para o mesmo comprimento. Por isso a questão pede expressamente a tabela de estágios e a morfologia | Conta refeita: Robinson & Fleming, IG (dias) = 8,052 × √9 + 23,73 ≈ 47,9 dias ≈ 6s6d de IG ≈ 34 dias após a fertilização, contra 37–42 dias na tabela. O aluno que usa a curva clínica precisa saber por que o número difere. Gabarito (b) mantido (morfologia do estágio 16) | menor | Moore cap. 5 (Tabela 5-1); Robinson & Fleming 1975; ACOG CO 700 |

## 3. Harmonização autorizada (Parte 2)

Cada item também está registrado nas `notas` da entrada `revisor-medicina-fetal-avancado-v1` do tópico.

### 3.1 emb-08 — início da secreção de surfactante: "≈24ª semana" → faixa de **20ª a 24ª semana após a fertilização** (≈22 a 26 semanas de IG), a mesma de emb-14

| Campo | Antes | Depois | Gravidade |
|---|---|---|---|
| `resumo` (parágrafo 21–25 semanas) | "Por volta da **24ª semana** os pneumócitos tipo II começam a secretar surfactante…" | "Entre a **20ª e a 24ª semana** (a data varia entre as obras), os pneumócitos tipo II começam a secretar, ainda em pequena quantidade, o surfactante…" | importante (item 1) |
| `pontosChave[7]` | "…por volta da 24ª semana após a fertilização…" | "…por volta da 20ª a 24ª semana após a fertilização (≈22 a 26 semanas de IG), em pequena quantidade…" | (item 1) |
| `estruturas[pneumocito-tipo-ii].destino` | "…por volta da 24ª semana…" | "…por volta da 20ª a 24ª semana…, em pequena quantidade, que aumenta nas últimas semanas…" | (item 1) |
| `correlacoesClinicas[sdr-prematuro].mecanismo` | "…começa por volta da 24ª semana…" | "…começa por volta da 20ª a 24ª semana…, em pequena quantidade…" | (item 1) |
| `emb-08-q08.explicacao` | "…por volta da 24ª semana após a fertilização (≈26 semanas de IG)…" | "…por volta da 20ª a 24ª semana (≈22 a 26 semanas de IG), em pequena quantidade…". O RN de 26 semanas de IG (= 24 após a fertilização) com SDR continua coerente | (item 1) |
| `emb-08-q24.explicacao` | "…começa por volta da 24ª semana (≈26 IG)." | Faixa nova + "a data exata varia entre as obras, mas todas a situam depois do aparecimento do vérnix, de modo que a ordem não muda" | (item 1) |
| `notasDivergencia[1]` e `[7]` | Moore cap. 6 (≈24ª) adotado; conflito com emb-14 "para o revisor humano" | Nota [1]: faixa adotada, a mesma de emb-14 (Moore cap. 6 ≈24ª, Moore cap. 10 ≈20ª, Sadler no fim do 6º mês). Nota [7] **mantida**, agora descrevendo a harmonização e seus efeitos nos jogos | (item 1) |
| `eventos[inicio-secrecao-surfactante]` | "por volta da 24ª semana…, ≈26 semanas de IG"; dias 161–168; ordem 9 | "por volta da 20ª a 24ª semana…, ≈22 a 26 semanas de IG"; **dias 134–168**; ordem 9 | importante (item 2) |
| `eventos[movimentos-oculares-rapidos].ordem` e `eventos[resposta-piscar-sobressalto].ordem` | 7 e 8 | **9** e **9** (empate com o surfactante e com as unhas das mãos) | (item 2) |
| `emb-08-q29.pares[1]` + `explicacao` | "Início da secreção de surfactante pelos pneumócitos tipo II" → "21 a 25 semanas" | "Início dos movimentos oculares rápidos e das respostas de piscar-sobressalto" → "21 a 25 semanas"; a explicação diz por que o surfactante saiu da associação | importante (item 3) |

**Ordem nos jogos (conferida item a item):**

- **Linha do tempo (eventos).** O jogo sorteia um evento por valor de `ordem` e compara todos os demais. Com a faixa de 20ª a 24ª semana, a ordem entre o surfactante e os movimentos oculares rápidos (21ª), o piscar-sobressalto (22ª–23ª) e as unhas das mãos (24ª) deixa de ser inequívoca. Pela regra do protocolo, os quatro passaram a compartilhar a mesma posição (ordem 9). **Nenhuma ordem foi invertida:** os quatro continuam depois do grupo da 17ª à 20ª semana (vérnix, *quickening*, gordura parda; ordem 6) e antes da reabertura das pálpebras (26ª; ordem 10). O preço é que a sequência movimentos oculares → piscar → unhas deixou de ser cobrada. O tópico passou de 16 para 14 posições distintas; o validador exige pelo menos 4.
- **emb-08-q24 (ordenar).** A sequência alças → genitália → ossificação → vérnix → surfactante foi **mantida**. Nenhuma das obras situa o início da secreção antes do vérnix (17ª–20ª). Os dois intervalos só se tocam na 20ª semana, a mesma convenção de faixas contíguas já usada no tópico. O gabarito continua inequívoco.
- **emb-08-q29 (associar).** O par "início da secreção de surfactante → 21 a 25 semanas" deixava de ser inequívoco, porque a 20ª semana da faixa cai no intervalo de 17 a 20 e o aluno que estudou o emb-14 (Moore cap. 10, ≈20ª) poderia hesitar. A troca usa dois marcos do mesmo intervalo já descritos no resumo. O gabarito da questão (um par por intervalo) continua único.
- **emb-08-q31 (múltipla, camada avançada).** Já usava a faixa e não mudou. O distrator (a) ("26 semanas após a fertilização, secreção estabelecida há várias semanas e risco desprezível") continua errado pela conversão invertida e pelo risco dito desprezível.

### 3.2 emb-09 — progesterona, estrogênios e hCG

| Campo | Antes | Depois | Gravidade |
|---|---|---|---|
| `resumo` (Funções) | progesterona "sendo assumida pela placenta **após o primeiro trimestre**" | "a placenta assume sua produção por volta de **7 a 9 semanas de IG**, na transição lúteo-placentária" | **importante** (item 1) |
| `emb-09-q29.pares[1].direita` | "Mantém a quiescência uterina e a gestação, sendo assumida pela placenta após o primeiro trimestre" | "Mantém a quiescência uterina e a gestação; a placenta assume sua produção por volta de 7 a 9 semanas de idade gestacional". O par continua único | (item 1) |
| `notasDivergencia[2]` | "Redação adotada: … após o primeiro trimestre" | Moore (involução no fim do 1º trimestre) e Sadler (fim do 4º mês) referem-se à **persistência** do corpo lúteo. A dependência dele vai até ~7 semanas de IG (Csapo 1972), e a transição ocorre em ~7–9 semanas de IG (Williams). Harmonizado com emb-02 e emb-25 | (item 1) |
| `emb-09-q29.explicacao` | "Os estrogênios, em cuja síntese a placenta depende de **precursores androgênicos de origem fetal**…" | Sem 17α-hidroxilase, a placenta sintetiza os estrogênios a partir de DHEA-S. O **estriol** depende quase só de precursores fetais (suprarrenal e fígado do feto); o **estradiol e a estrona** usam também DHEA-S **materno**. Nota de divergência nova. O `resumo` ganhou "o estriol depende quase só de precursores fetais" | **importante** (item 2: explicação incorreta por generalização) |
| `resumo` e `emb-09-q08.explicacao` | hCG "com pico **em torno de 8 semanas** de IG" | "com pico **entre 8 e 10 semanas** de IG"; q08 cita também a transição lúteo-placentária (~7–9 semanas). Nota de divergência nova | menor (item 3) |
| `referencias` | — | + Williams Obstetrics 26ª ed. (Implantation and Placental Development); + Csapo et al. 1972, nas mesmas citações já usadas em emb-02 e emb-25 | — |

O gabarito do emb-09-q08 (d) continua correto e único. O emb-09-q29 (associar) continua com quatro pares sem margem de dúvida.

## 4. Pontos clínicos do pedido conferidos

| Tema | Questão | Resultado |
|---|---|---|
| DNA fetal livre com gemelar evanescente: rastreamento × diagnóstico | emb-08-q30 | Correto (DNA placentário; o gemelar morto continua liberando DNA; confirmação invasiva). Explicação refinada sobre biópsia de vilo × amniocentese. Janela de ~10 semanas coerente com a incerteza já registrada |
| Prematuro de 24 semanas e surfactante | emb-08-q31 | Correto. 24s3d de IG − 2 semanas ≈ 22 semanas após a fertilização, no período canalicular tardio, com secreção incipiente. Corticoide antenatal e surfactante exógeno citados de forma qualitativa |
| Hipotermia do prematuro | emb-08-q32 | Gabarito (a) correto (gordura branca de 3,5% / 8% / 16%; Moore). **Vinheta corrigida** (secagem num prematuro de 30 semanas) |
| Métodos de diagnóstico pré-natal (biópsia de vilo, amniocentese, cordocentese, TN) | emb-08-q33 | Pares corretos (DNA fetal livre ≥ ~10 semanas; biópsia de vilo de 10 a 13 semanas; amniocentese ≥ 15; cordocentese com transfusão no mesmo ato; TN de 11 a 13s6d). Par da amniocentese precisado |
| RCIU simétrica precoce e exame invasivo | emb-08-q34 | Correto (TN de 3,8 mm, restrição proporcional com 20 semanas, líquido e Doppler normais → causa intrínseca → oferecer exame diagnóstico). Conduta e referências completadas |
| Sinal do lambda, corionicidade e TFF | emb-09-q31, q34 | Corretos. Detalhe do sexo aos 12 semanas retirado; "só ocorre" → "praticamente só" |
| IgG × IgM nas infecções congênitas | emb-09-q32 | Correto. Limitações práticas da IgM acrescentadas |
| Pré-eclâmpsia e artérias espiraladas | emb-09-q33 | Correto, sem alteração (invasão deficiente pelo trofoblasto extraviloso, vasos de alta resistência, Doppler das uterinas alterado; distratores de acretismo, TFF e mistura de sangues bem refutados) |
| Dupla bolha e citogenética | emb-09-q35 | Correto. "Impõe-se" → "indica-se"; gestação única explícita; deglutição de até ~400 mL/dia (valor de Moore já adotado) |
| Recorrência de DTN e ácido fólico em dose alta | emb-10-q31 | Correto. **Dose mantida em 4 a 5 mg/dia**, como já adotado no módulo (pendência 4 × 5 mg com o revisor humano). DNA fetal livre não rastreia DTN (correto). Parentesco precisado |
| Valproato com 9 semanas | emb-10-q32 | Correto. 9 semanas de IG ≈ 7 após a fertilização, e o tubo neural fecha nos dias 24–28 = 5s3d–6s0d de IG. Refutação de (d) e anomalias associadas precisadas |
| Radiação diagnóstica | emb-10-q33 | Correto. Limiar **qualitativo**, agora citando a ACOG CO 723. 10 semanas de IG ≈ 8 semanas após a concepção, início da janela de 8 a 15 semanas do SNC |
| Fenilcetonúria materna | emb-10-q35 | Correto, sem alteração (fenilalanina com concentração fetal maior que a materna, feto em regra heterozigoto, herança AR, controle dietético desde antes da concepção) |
| Hirschsprung: espessura total × sucção | emb-06-q32 | Correto. A vinheta (espessura total, dois plexos) é coerente, e a explicação passou a dizer que a sucção é o exame inicial habitual no RN (coerente com emb-15-q13) |
| Gastrosquise × onfalocele | emb-07-q30, q34 | Corretos, sem alteração (gastrosquise à direita, sem membrana, cordão de inserção normal, AFP elevada; onfalocele com saco e cordão inserido nele; divergência de mecanismo nomeada como a de Moore) |
| Conversões de idade | todas | Refeitas uma a uma (tabela abaixo) |

Contas de idade refeitas (IG = idade após a fertilização + 14 dias):

| Questão | Dado | Conta | Resultado |
|---|---|---|---|
| emb-06-q30 | 5s4d de IG | 39 − 14 = **dia 25** | neuroporo cranial (24–26) ✔. Dias 15–17 = 29–31 d = 4s1d–4s3d de IG ✔ |
| emb-07-q30 | herniação até ~10ª semana após a fertilização | 10 + 2 | ≈12 semanas de IG ✔ |
| emb-07-q32 | estágio 16, 37–42 dias | + 14 = 51–56 d | 7s2d–8s0d ✔. (a) 42–46 d = 6s0d–6s4d; (c) 58–62 d = 8s2d–8s6d; (d) 70–74 d = 10s0d–10s4d ✔. Curva de Robinson para 9 mm ≈ 47,9 d ≈ 6s6d de IG (nota nova) |
| emb-08-q08 | RN de 26 semanas de IG | − 2 | 24 após a fertilização, dentro da faixa 20ª–24ª ✔ |
| emb-08-q31 | 24s3d de IG | − 2 | ≈22s3d após a fertilização ✔; (a) soma em vez de subtrair ✔ |
| emb-08-q32 | 30 semanas de IG | − 2 | ≈28 após a fertilização, no intervalo de 26–29 (gordura branca ≈3,5%) ✔ |
| emb-08 (faixa nova) | 20ª–24ª semana após a fertilização | + 2 | ≈22–26 semanas de IG; dias 134 (início da 20ª semana) a 168 (fim da 24ª) ✔ |
| emb-10-q32 | 9 semanas de IG; tubo neural nos dias 24–28 | 63 − 14 = 49 d ≈ 7 semanas; 24–28 + 14 = 38–42 d | 5s3d–6s0d de IG ✔ |
| emb-10-q33 | 10 semanas de IG | − 2 | ≈8 semanas após a concepção (janela de 8–15) ✔ |

## 5. Pontos para o revisor humano

1. **Surfactante (harmonizado; número a conferir).** O emb-08 agora usa a faixa de 20ª a 24ª semana do emb-14. Falta conferir nas obras o que Moore diz nos caps. 6 e 10 e o que Sadler diz ("fim do 6º mês"). Se o revisor fixar um número único, o empate da linha do tempo (ordem 9: movimentos oculares, piscar-sobressalto, surfactante e unhas) pode ser desfeito, e a sequência 21ª → 22ª–23ª → 24ª volta a ser cobrada.
2. **Ácido fólico em dose alta: 4 mg (FEBRASGO) × 5 mg (Ministério da Saúde).** Mantido "4 a 5 mg/dia" no emb-10-q31, como pedido. A decisão é do revisor humano.
3. **Radiação (emb-10-q33).** A ACOG CO 723 foi citada só pela frase qualitativa, que confirmei numa citação. O limiar de **50 mGy** habitualmente atribuído ao documento ("sem aumento de anomalias ou perdas abaixo dele") **não** foi escrito, porque o texto integral não abriu nesta sessão. A vigência também deve ser conferida: a reafirmação de 2021 foi vista em citação secundária. Se confirmado, o número pode entrar na explicação com a diretriz citada.
4. **Diretriz SBP 2026 (emb-08-q32).** A versão de 2022 para menores de 34 semanas previa saco plástico sem secar e touca dupla. O texto de 2026 não abriu, e por isso a vinheta e a explicação ficaram qualitativas. Conferir no PDF.
5. **ACOG PB 226 e PB 227 (emb-08-q30, q33, q34)** foram conferidos só por resumos. Não localizei protocolo vigente da FEBRASGO sobre restrição de crescimento fetal nem sobre rastreamento de aneuploidias. Se houver, ele deve substituir ou complementar as citações americanas, como pede a preferência por diretriz brasileira.
6. **Classificação da RCIU (emb-08-q34).** A vinheta usa "todas as medidas abaixo do p10, Doppler normal". Pelo consenso Delphi (Gordijn et al., 2016), isso seria "pequeno para a idade gestacional" se não houver um critério absoluto (por exemplo, abaixo do p3). A divergência já está registrada no tópico. Decidir se a vinheta deve trazer um critério de RCF explícito (por exemplo, medidas abaixo do p3).
7. **Manual de gestação de alto risco (MS 2022) em emb-10-q32.** A seção de epilepsia não foi reaberta nesta sessão. Conferir se sustenta a conduta qualitativa (não suspender por conta própria; revisar com o neurologista).
8. **Hirschsprung (emb-06-q32).** A diretriz ERNICA 2020 foi lida só no resumo. Conferir o trecho sobre sucção × espessura total. Não localizei diretriz brasileira.
9. **Toxoplasmose congênita (emb-09-q32).** As limitações da IgM ficaram qualitativas. O protocolo do Ministério da Saúde não foi aberto.
10. **Fora do escopo, não alterado — herniação fisiológica no emb-08.** O emb-08 adota retorno das alças "entre a 10ª e a 12ª semana após a fertilização" (resumo, pontos-chave, estrutura, evento, q02), o que equivale a até ~14 semanas de IG. Na ultrassonografia, a herniação fisiológica está resolvida por volta de 12 semanas de IG, e a persistência depois disso levanta suspeita de onfalocele. O emb-07-q30 usa "≈10ª semana após a fertilização ≈ 12 semanas de IG". Sugiro explicitar a IG no emb-08 ou fechar a faixa em ~10ª–11ª semana após a fertilização.
11. **Fora do escopo, não alterado — eventos iniciais do emb-08.** A produção de urina (9ª–12ª, ordem 1), o retorno das alças (10ª–12ª, ordem 2), a genitália madura (~12ª, ordem 3) e a eritropoiese esplênica (fim da 12ª, ordem 4) têm faixas muito sobrepostas. Vale conferir se a ordem é inequívoca nas fontes ou se pede empates.
12. **Fora do escopo — redação absoluta sobre TFF.** O resumo e o `pontosChave[11]` do emb-09 ainda dizem que a TFF é "exclusiva" ou "só ocorre" nas monocoriônicas. As questões avançadas (q31, q34) dizem "praticamente". Decisão editorial.
13. **emb-10-q34 (andrógenos).** Conferir em Moore se o limite "antes de cerca de 12 semanas" para a fusão labial é após a fertilização ou em IG. O par continua único pela eliminação, mas o referencial deve ser o da obra.
14. **Tamanho do resumo.** Os resumos de emb-08, emb-09 e emb-10 já passavam de 900 palavras antes desta revisão (914, 928 e 963). As harmonizações acrescentaram 13 palavras ao emb-08 e 18 ao emb-09. O validador não cobra esse limite.
15. **Limitações de verificação.** As obras-base (Moore, Sadler, Williams, Thompson & Thompson) não estão disponíveis na sessão, e a rede é restrita: a busca funciona, mas a leitura de páginas de terceiros não. As afirmações novas foram mantidas qualitativas sempre que não pude confirmar o texto da diretriz, com registro em `incertezas`.

## 6. Evidência de execução

Verificações estruturais nos cinco tópicos, feitas com o script `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-av2-mf/checks.py`:
- as alternativas seguem a ordem a, b, c, d;
- todas as letras são citadas nas explicações das questões avançadas;
- os pares de `associar` não repetem a coluna direita;
- a razão entre o comprimento da alternativa correta e a média dos distratores, nas questões avançadas de múltipla escolha, fica entre **0,86 e 1,06**;
- a distribuição do gabarito não mudou (máximo de 29% por letra).

O diff estrutural (JSON antes × depois) confirma que só os campos listados nas seções 2 e 3 mudaram, mais os acréscimos em `referencias`, `notasDivergencia`, `incertezas` e `revisao.agentes`. Nos arquivos com formatação padrão (emb-06, emb-07, emb-09 e emb-10), a formatação foi preservada byte a byte; no emb-08, de formato compacto, as edições foram feitas no texto bruto.

Depois das correções, em 2026-11-09:

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```
