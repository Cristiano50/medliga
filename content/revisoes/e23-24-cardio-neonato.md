# Revisão E23–E24: cardiologia pediátrica/neonatologia (2ª etapa)

- Agente: `revisor-cardio-neonato-v1`
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Etapa anterior: `content/revisoes/e23-24-embriologia.md`.
- Arquivos editados: `content/embriologia/topicos/emb-23-arcos-aorticos-veias.json` e `content/embriologia/topicos/emb-24-circulacao-fetal.json`. Nenhum outro tópico foi editado.
- Nenhum id foi alterado, e nenhuma letra correta, alternativa, sequência ou par mudou. `revisao.humano` continua `null` nos dois arquivos. Em `revisao.agentes` de cada arquivo foi acrescentada uma entrada `revisor-cardio-neonato-v1`, com veredito `aprovado-com-correcoes`.

## 1. Resumo

Revisei integralmente os dois tópicos (resumo, objetivos, pontos-chave, estruturas, eventos, correlações clínicas, referências, notas de divergência, incertezas e as 56 questões), com foco em aplicação clínica, condutas e vinhetas. Nenhum gabarito está errado, e não encontrei fato errado nas questões. As correções importantes são: um prazo de clampeamento que pode ter mudado na diretriz brasileira vigente (2026), uma vinheta incoerente (q07 do emb-24) e uma contradição interna sobre a veia cava inferior interrompida (emb-23).

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-23 Arcos aórticos e sistemas venosos | 28 | 0 | 1 | 4 | 5 | aprovado-com-correcoes |
| emb-24 Circulação fetal e transição neonatal | 28 | 0 | 2 | 6 | 8 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **3** | **10** | **13** | |

Gravidade, como no protocolo: **crítica** = fato ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou imprecisão de fato; **menor** = redação, terminologia, referência ou registro.

**Checagens automáticas** (script em pasta temporária, fora do repositório, comparando com a cópia anterior às minhas edições):
- ids das questões e das estruturas, `correta`, `alternativas`, `ordemCorreta` e `pares` idênticos aos de antes;
- em todas as múltiplas escolhas, "alternativa (x) está correta" coincide com `correta`, e a explicação cita todas as letras;
- letras corretas 4/4/4/4 (a/b/c/d) nos dois tópicos;
- só mudaram os campos listados na tabela da seção 2.

### Pontos de foco desta etapa

| Ponto | Situação |
|---|---|
| **Coarctação da aorta** | Correto. Exame (hipertensão nos braços, pulsos femorais fracos e atrasados, pressão menor nas pernas, sopro interescapular), forma crítica do recém-nascido canal-dependente (choque ao fechar o canal; prostaglandina E1), forma tardia (colaterais intercostais e erosões costais em crianças maiores e adultos), associação com valva bicúspide e Turner, limite da oximetria e as três hipóteses de mecanismo (tecido ductal, involução da aorta dorsal, hemodinâmica). q07 realista. Sem alteração. |
| **Arco duplo e arco à direita** | Correto: anel vascular com estridor, sibilância, infecções e disfagia; arco direito geralmente dominante; secção do arco menor; arco à direita em espelho com Fallot, tronco arterial e 22q11.2; arco à direita com subclávia esquerda aberrante e ligamento arterial formando anel. q04 e q22 corretas. |
| **Subclávia direita aberrante** | Correto: retroesofágica, disfagia lusória (sobretudo quando dilatada), laríngeo inferior direito não recorrente e marcador ultrassonográfico de trissomia 21. q05 correta. |
| **Interrupção do arco aórtico** | **Tipo B é o mais frequente: confirmado.** Classificação de Celoria e Patton (1959): A, distal à subclávia esquerda; B, entre a carótida comum e a subclávia esquerdas; C, entre o tronco braquiocefálico e a carótida comum esquerda. B > A, e C é raro. A deleção 22q11.2 aparece em cerca de metade ou mais do tipo B e é rara nos demais (CDC; revisão da ISUOG; vistos em resumos de busca). O texto ficou qualitativo, e a incerteza do redator foi resolvida e registrada. q06 correta e realista. |
| **Veia cava superior esquerda persistente** | Correto quanto ao seio coronário dilatado. **Corrigido (menor):** o resumo e os pontos-chave diziam que ela "drena no seio coronário" sem ressalva; numa minoria dos casos, ela drena no átrio esquerdo. Agora dizem "em geral". |
| **Veia cava inferior interrompida com continuação ázigo** | Associação com heterotaxia e isomerismo esquerdo correta; q13 e q25 corretas. **Corrigido (importante):** a correlação dizia "falta o segmento hepático", o que contradiz o próprio mecanismo e a q11/q13: o segmento terminal derivado da vitelina direita persiste e recebe as veias hepáticas, e o que falta é a conexão subcardinal–hepática. Agora o texto diz que falta a continuidade entre as veias renais e o fígado e registra que os laudos costumam chamar isso de "ausência do segmento hepático". |
| **Higroma cístico** | Correto após a 1ª etapa: aneuploidias (45,X e trissomias), cardiopatias, ecocardiograma fetal, pescoço alado e linfedema na síndrome de Turner. q14 e q21 corretas. |
| **Transição neonatal e fechamento dos shunts** | Correto: queda abrupta e depois gradual da resistência pulmonar; fechamento funcional do forame oval por pressão; canal arterial fechado por O₂ e queda da PGE2; ducto venoso fechado em dias a semanas. q05, q06, q18, q19 e q24 corretas. |
| **Clampeamento tardio** | **OMS 2014:** não antes de 1 minuto: correto. **SBP/FEBRASGO 2022, abaixo de 34 semanas, "após 30 s" ou "pelo menos 30 s"?** Segundo resumos que reproduzem os textos, o documento conjunto diz "depois de 30 segundos", e a diretriz de reanimação do prematuro da SBP de 2022 diz "no mínimo 30 segundos após o nascimento". As duas formas têm o mesmo sentido: não clampear antes de 30 s. Portanto, "pelo menos 30 s" era fiel a 2022. **Achado novo:** em junho de 2026, a SBP publicou novas diretrizes de reanimação neonatal (≥34 e <34 semanas). Para 34 semanas ou mais, os resumos confirmam pelo menos 60 s. Para menos de 34 semanas, os trechos localizados sugerem pelo menos 60 s, em linha com ILCOR, AHA, ERC e ACOG (2025), mas não consegui confirmar. **Corrigido (importante):** o prazo abaixo de 34 semanas saiu do resumo, da correlação e da explicação da q15; o texto diz só que o clampeamento também é adiado no prematuro com boa vitalidade. A diretriz de 2026 foi acrescentada às referências, e a pendência foi registrada em `incertezas`. A q15 (recém-nascido de 39 semanas, pelo menos 60 s) continua correta em todas as diretrizes. |
| **Teste do coraçãozinho e q10** | **A q10 tem a mesma conduta nos dois protocolos.** MS/SBP 2014 (Portaria SCTIE/MS nº 20/2014, reconfirmada): normal com ≥ 95% nos dois locais e diferença < 3%; qualquer valor < 95% ou diferença ≥ 3% leva a repetir em 1 h e, se confirmado, a ecocardiograma; acima de 34 semanas. SBP 2022 (manual de agosto de 2022, departamentos de Cardiologia e Neonatologia): normal com ≥ 95% e diferença ≤ 3%; 90%–94% ou diferença ≥ 4% leva a repetir em 1 h, até duas vezes, e, se persistir, o teste é positivo, com ecocardiograma; ≤ 89% é positivo; 35 semanas ou mais. Com 97% e 90% (diferença de 7%), os dois mandam repetir em 1 h e, se persistir, fazer ecocardiograma; só a (d) é defensável. **Corrigido (menor):** a explicação da q10 e a correlação passaram a registrar as até duas repetições e o teste positivo se a alteração persistir. |
| **Canal-dependentes e PGE1** | Correto: apneia é o efeito adverso que exige monitorização (q20 verdadeira). **Corrigido (menor):** a referência da q20, antes "prática de cardiologia pediátrica", passou a ser Lewis et al., *Circulation* 1981, também acrescentado às referências. q09 e q27 corretas. |
| **Canal arterial do prematuro (BeNeDuctus 2023)** | Conduta qualitativa correta. **Corrigido (menor):** a correlação passou a citar o BeNeDuctus no texto: em prematuros com menos de 28 semanas, a conduta expectante não foi inferior ao ibuprofeno precoce. Antes dizia só "reservado ao canal hemodinamicamente significativo". q16 correta. |
| **HPPRN: óxido nítrico e ECMO (AHA/ATS 2015)** | Correto: óxido nítrico inalatório no recém-nascido a termo ou próximo do termo com hipoxemia grave, e ECMO nos casos refratários (q08). Não foi localizada diretriz brasileira (só revisão no *J Pediatr* 2013 e protocolos institucionais). |
| **Forame oval patente e embolia paradoxal** | Correto: AHA/ASA 2021, 18 a 60 anos, AVC não lacunar sem outra causa, forame de alto risco; fechamento percutâneo com antiagregação prolongada é razoável. A AHA/ASA 2021 continua a referência vigente da AHA/ASA (nenhuma atualização de 2025–2026 localizada), em linha com a AAN 2020 e a SCAI 2022. Não foi localizada diretriz brasileira. q12 correta e realista. |
| **~80% de saturação na veia umbilical (Sadler)** | Compatível com o original de Sadler (cap. 13), mas não pude abrir o livro. Mantive a incerteza da página na edição brasileira. |
| **Vinheta da q07 (FiO₂)** | **Precisava. Corrigido (importante):** "hipoxemia grave" com 95% pré-ductal, sem informar a FiO₂, é incoerente: 95% em ar ambiente não é hipoxemia. Agora o caso informa ventilação mecânica com oxigênio a 100% e saturações de 90% (mão direita) e 76% (pé). O enunciado, as alternativas e a explicação não mudaram. |
| **Nome de `veias-umbilicais`** | **Harmonizado (menor):** o nome no emb-24 passou a "Veias umbilicais", como no emb-13, no emb-23 e em `estagios.json`. Os sinônimos agora são "veia umbilical" e "veia umbilical esquerda". A definição começa pelo par embrionário e descreve a veia única do feto, sem perder o conteúdo. O id não mudou. |
| **q02 ("vindo sobretudo da cava superior")** | Mantida. No feto humano, ao contrário da ovelha, a veia cava superior responde por cerca de metade ou mais da entrada do ventrículo direito (estimativa de memória, a conferir); a frase segue Moore e Sadler e é coerente com o emb-13. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-23-arcos-aorticos-veias | correlacoesClinicas `vci-interrompida-continuacao-azigo`.descricao | "**Falta o segmento hepático** da veia cava inferior…" | "Falta a **continuidade** da veia cava inferior **entre as veias renais e o fígado** (em laudos de imagem, muitas vezes descrita como ausência do segmento hepático)…" | Contradição interna: o mecanismo do próprio tópico e as questões q11 e q13 dizem que o segmento hepático (vitelina direita) se forma e que falta a conexão subcardinal–hepática. O segmento terminal recebe as veias hepáticas e chega ao átrio direito. | importante | Sadler 14ª ed., cap. 13; Moore 11ª ed., cap. 13; literatura radiológica sobre anomalias da veia cava inferior |
| emb-23-arcos-aorticos-veias | resumo (Anomalias) e pontosChave[10] | Veia cava superior esquerda "drena no seio coronário" | "**em geral** drena no seio coronário" | Afirmação absoluta; numa minoria dos casos ela drena no átrio esquerdo. | menor | Literatura de cardiologia pediátrica (sem número no texto) |
| emb-23-arcos-aorticos-veias | incertezas[1] (interrupção do arco) | "Tipo B é o mais frequente… conferir com o revisor clínico" | Confirmado: Celoria e Patton A/B/C; B > A, C raro; 22q11.2 em cerca de metade ou mais do tipo B; texto mantido qualitativo | Resolução de incerteza com fonte | menor | Celoria e Patton, *Am Heart J* 1959; CDC (manual de vigilância de defeitos congênitos); revisão da ISUOG |
| emb-23-arcos-aorticos-veias | incertezas[2] e [3] | Fatos clínicos e condutas "não conferidos" | Registro da conferência clínica (laríngeo não recorrente, veia cava superior esquerda, subclávia aberrante e trissomia 21, isomerismo; prostaglandina E1, anel vascular, 22q11.2 e calcemia) | Registro | menor | Prática de cardiologia pediátrica |
| emb-23-arcos-aorticos-veias | referencias (diretriz de cardiologia fetal) | "Arq Bras Cardiol. 2019" | "Arq Bras Cardiol. 2019;112(5):600-648" | Referência incompleta | menor | Pedra SRFF et al., 2019 (PMC6555576) |
| emb-24-circulacao-fetal | resumo (Clampeamento tardio) | "…e **pelo menos 30 segundos abaixo de 34 semanas**" | "≥ 60 s a partir de 34 semanas, prazo mantido nas diretrizes da SBP de 2026; abaixo de 34 semanas, o clampeamento também é adiado no prematuro com boa vitalidade" | Há diretriz brasileira mais nova (SBP, junho de 2026), e o prazo abaixo de 34 semanas não pôde ser confirmado (os indícios apontam ≥ 60 s); pela regra, a redação ficou qualitativa | importante | SBP/FEBRASGO 2022; SBP, diretrizes de reanimação 2026 (via resumos); ILCOR, AHA, ERC e ACOG 2025 |
| emb-24 / `clampeamento-tardio-cordao` | correlacoesClinicas.descricao | Idem ("após pelo menos 30 segundos abaixo de 34 semanas") | Idem (qualitativo abaixo de 34 semanas; SBP 2026 citada para ≥ 34 semanas) | Idem (mesma correção) | (na anterior) | Idem |
| emb-24-q15 | explicacao e referencia | "(e, abaixo de 34 semanas…, após pelo menos 30 segundos)"; referência sem SBP 2026 | Parêntese removido; "prazo mantido nas diretrizes de reanimação neonatal da SBP de 2026"; referência acrescentada | Idem; a resposta (a) segue correta | (na anterior) | Idem |
| emb-24-circulacao-fetal | referencias | — | + SBP, PRN: reanimação ≥34 e <34 semanas, diretrizes 2026 | Diretriz vigente | (na anterior) | SBP 2026 |
| emb-24-q07 | contexto | "hipoxemia grave… saturação de **95%** na mão direita e de **82%** no pé" (sem FiO₂) | "…Em ventilação mecânica com oxigênio a 100%, saturação de **90%** na mão direita e de **76%** no pé" | Vinheta incoerente: 95% sem FiO₂ não caracteriza hipoxemia grave | importante | Abman et al., *Circulation* 2015 (AHA/ATS); prática neonatal |
| emb-24-circulacao-fetal | estruturas `veias-umbilicais` | nome "Veia umbilical"; sinônimo "veia umbilical esquerda" | nome "Veias umbilicais"; sinônimos "veia umbilical" e "veia umbilical esquerda"; definição, origem e destino ajustados | Coerência com emb-13, emb-23 e `estagios.json` (mesmo id) | menor | Moore e Sadler, cap. 13 |
| emb-24-q10 | explicacao | "repetir a medida após 1 hora e, se persistir, ecocardiograma" | "+ (na atualização de 2022, até duas vezes)" | Precisão quanto ao protocolo de 2022 | menor | SBP 2022 (via fontes secundárias); Portaria SCTIE/MS nº 20/2014 |
| emb-24 / `teste-do-coracaozinho` | correlacoesClinicas.descricao | "…repetição após 1 hora (até duas vezes); ≤ 89%…" | "+ e, se persistirem, tornam o teste positivo, com indicação de ecocardiograma" | Faltava dizer o que acontece depois das repetições | menor | SBP 2022 (via fontes secundárias) |
| emb-24 / `canal-arterial-prematuro` | correlacoesClinicas.descricao | "tratamento… individualizado e reservado ao canal hemodinamicamente significativo" | "tratamento individualizado: no BeNeDuctus (2023), com prematuros abaixo de 28 semanas, a conduta expectante não foi inferior ao ibuprofeno precoce…" | Integrar a evidência citada nas referências | menor | Hundscheid et al., *N Engl J Med* 2023 |
| emb-24-q20 | referencia | "Moore…; prática de cardiologia pediátrica (ver incertezas)" | "Lewis et al., Circulation 1981; Moore…" (+ nas referências) | Referência específica para a apneia por prostaglandina E1 | menor | Lewis AB et al., *Circulation* 1981;64(5):893-8 |
| emb-24-circulacao-fetal | incertezas[0], [2] e novo item (clampeamento abaixo de 34 semanas) | Pendências da SBP; condutas sem diretriz brasileira | Registro do manual SBP de agosto de 2022, da Portaria nº 20/2014 reconfirmada, da conduta igual na q10, do prazo abaixo de 34 semanas a conferir na SBP 2026, da AHA/ASA 2021 ainda vigente e da ausência de diretriz brasileira para HPPRN e forame oval patente | Registro | menor | Ver seção 4 |

## 3. Pontos para o revisor humano

1. **Diretrizes SBP 2026 de reanimação (prematuro <34 semanas; DOI 10.25060/PRN-SBP-2026-2):** confirmar o prazo mínimo de clampeamento no prematuro com boa vitalidade. Se for de pelo menos 60 s, ele pode voltar ao resumo e à correlação do emb-24 (hoje qualitativos). Confirmar também que a diretriz ≥34 semanas de 2026 mantém pelo menos 60 s.
2. **Manual da SBP de 2022 (teste do coraçãozinho):** conferir no documento primário a numeração ("nº 4"), a idade gestacional (35 semanas ou mais) e os limiares, inclusive se "normal" exige ≥ 95% nos dois membros. A q10 tem a mesma resposta em qualquer leitura.
3. **Sadler, edição brasileira, cap. 13:** página dos ~80% de saturação na veia umbilical (pendente desde a 1ª etapa).
4. **Diretriz Brasileira de Cardiologia Fetal 2019:** conferir no texto primário a indicação de ecocardiograma fetal por higroma ou translucência nucal aumentada (citada no emb-23).
5. **Diretriz brasileira para forame oval patente e para HPPRN:** não localizei nenhuma. Se houver documento da SBC/SBHCI, da Academia Brasileira de Neurologia ou da SBP, pode substituir ou complementar AHA/ASA 2021 e AHA/ATS 2015.
6. **emb-24-q02:** mantive "vindo sobretudo da cava superior". A frase é defensável no feto humano e segue Moore e Sadler; se o revisor preferir redação neutra, pode usar "rico em retorno da cava superior", como na q25.
7. **Percentuais da interrupção do arco** (tipo B, cerca de metade a dois terços dos casos; 22q11.2 em cerca de metade ou mais do tipo B): vieram de resumos de busca e só estão em `incertezas`. O texto do tópico é qualitativo.

## 4. Fontes consultadas nesta sessão

- sbp.com.br e portaldeboaspraticas.iff.fiocruz.br **não resolvem na rede da sessão**; não abri nenhum documento primário. As informações abaixo vêm de resultados de busca (resumos e trechos):
  - SBP/FEBRASGO 2022 (clampeamento): página de lançamento da SBP (21/03/2022), resumo no repositório Arca/Fiocruz, Portal Afya e protocolo "Cuidados ao Nascimento" (IFF/Fiocruz), que reproduz a diretriz SBP 2022 para menos de 34 semanas ("no mínimo 30 segundos").
  - SBP 2026: páginas do acervo da SBP ("Reanimação do recém-nascido ≥34 semanas / <34 semanas em sala de parto: Diretrizes 2026", junho de 2026) e resumos (Grupo MedCof, FGMED, WeMEDS, Medway).
  - Teste do coraçãozinho: Portal Afya, Estratégia MED, Grupo MedCof, POP da Rio Saúde, notícia da SBP sobre a Portaria nº 20/2014 e Portaria GM/MS nº 1.940/2018.
  - Interrupção do arco: CDC, *Birth Defects Surveillance Quick Reference Handbook*; revisão da ISUOG; StatPearls.
  - Forame oval patente: resumos da AHA/ASA 2021, AAN 2020 e SCAI 2022; nenhuma atualização da AHA/ASA de 2025–2026 localizada.
  - ILCOR/AHA/ERC/ACOG 2025 (clampeamento no prematuro): resumos de busca.
- De memória, sem acesso nesta sessão: Abman et al. 2015 (classes de recomendação), Hundscheid et al. 2023 (desenho e resultado do BeNeDuctus), Lewis et al. 1981 e Sadler (80%).

## 5. Evidência de execução

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

Não foi feito commit.
