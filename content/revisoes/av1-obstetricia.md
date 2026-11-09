# Revisão por agente — camada avançada (AV1), área obstetrícia/reprodução humana/genética, 2ª etapa

- Agente: `revisor-obstetricia-avancado-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md` · 1ª etapa: `content/revisoes/av1-embriologia.md`
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas de `referencias`, `notasDivergencia` e `incertezas` de `content/embriologia/topicos/` emb-01 a emb-05. Não mexi no conteúdo anterior. Só estes 5 arquivos e este relatório foram alterados. Nada foi commitado.
- Foco clínico: datação e redatação (ACOG × Brasil), reprodução assistida (FIV, ICSI, blastocisto D5, PGT-A em mosaico, glossário ICMART), gemelaridade após reprodução assistida, gestação heterotópica, β-hCG e gravidez bioquímica, mola hidatiforme (ploidia, p57, dispermia, 46,YY), origem parental e meiótica das aneuploidias, 47,XXY e janela fértil.

## 1. Resumo

| Tópico | Questões avançadas | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| emb-01-introducao | q26–q30 (5) | 0 | 1 | 0 | aprovado-com-correcoes |
| emb-02-gametogenese | q28–q32 (5) | 0 | 1 | 0 | aprovado-com-correcoes |
| emb-03-fertilizacao | q27–q31 (5) | 0 | 0 | 3 | aprovado-com-correcoes |
| emb-04-semana1 | q27–q31 (5) | 0 | 1 | 3 | aprovado-com-correcoes |
| emb-05-semana2 | q30–q34 (5) | 0 | 0 | 2 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **3** | **8** | |

Gravidades seguem o protocolo: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou enganosa; **menor** = redação, terminologia, referência, realismo da vinheta.

**Nenhum gabarito estava errado.** Nenhum id nem letra correta mudou, e nenhuma alternativa foi alterada, portanto a distribuição das letras e as pistas de comprimento ficam como a 1ª etapa deixou. Refiz todas as contas de datação.

As três correções importantes:
1. **emb-01 q26 (datação):** o gabarito dependia do critério de redatação. Com ciclo de 35 dias, a diferença DUM × CCN era de 7 dias. Isso leva a redatar pelo ACOG, mas fica dentro da margem de 3 a 7 dias que guias brasileiros de pré-natal na atenção primária usam para manter a DUM. O ciclo passou a 37 dias, o que dá uma diferença de ~9 dias e leva a redatar por todos os critérios. O enunciado deixou de depender do ACOG.
2. **emb-02 q31 (janela fértil):** a explicação ensinava uma janela de ~3 dias. A evidência clínica (Wilcox et al., NEJM 1995) e o aconselhamento contraceptivo usam ~6 dias. A explicação foi ampliada, e o gabarito não muda.
3. **emb-04 q27 (PGT-A em mosaico):** a vinheta descrevia a biópsia como se as células fossem contadas uma a uma. A explicação tratava o laudo como prova de duas linhagens. A vinheta e a explicação agora seguem o PGT-A atual e o ASRM 2023.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | gravidade | motivo | fonte |
|---|---|---|---|---|---|---|
| emb-01-q26 | contexto, enunciado, explicacao, referencia | Ciclo de 35 dias, ovulação ~21º dia, diferença de 7 dias; "segundo os critérios do ACOG (CO 700)"; (b) refutada só pelo limiar de 5 dias do ACOG | Ciclo de 37 dias, ovulação ~23º dia, embrião com 33 dias após a fertilização = 6s5d de IG, diferença ~9 dias; enunciado neutro; a explicação cita o ACOG (> 5 dias antes de 9 semanas) e os guias brasileiros de APS (DUM mantida só se a diferença couber em ~7 dias); (b) refutada pela conta (9 dias, não "até 7") e pelo ACOG | importante | Com 7 dias, a resposta era (c) pelo ACOG e, segundo trechos obtidos por busca, pela FEBRASGO e pelo consenso CBR/FEBRASGO, mas (b) pelo Guia do Pré-natal na APS do RS (2024), que aceita desvio de 3 a 7 dias no 1º trimestre. Com 9 dias, (c) vale por todos. 37 dias está na faixa normal da FIGO (24–38 dias). Letra (c) e alternativas mantidas. | ACOG CO 700 (2017); SES-RS, Guia do Pré-natal e Puerpério na APS (2024) |
| emb-02-q31 | explicacao, refutação de (a), referencia | "Espermatozoides sobrevivem cerca de 2 dias"; (a) "espermatozoides dos dias 12 a 14 em geral não sobrevivem até o 18º dia" | Mantida a conta pela premissa da vinheta e acrescentado que a janela fértil clínica vai de ~5 dias antes da ovulação até o próprio dia, com maior chance nos 2 dias anteriores e no dia da ovulação; (a) "4 a 6 dias antes da ovulação, fora da janela fértil ou no seu início, com chance bem menor" | importante | A explicação levava o aluno a fixar uma janela fértil de ~3 dias, o que é clinicamente enganoso (aconselhamento contraceptivo e de concepção). Gabarito (b) mantido. | Wilcox, Weinberg, Baird. N Engl J Med 1995;333:1517–21 (resumo) |
| emb-03-q30 | explicacao | Usa "FIV convencional" × ICSI sem comentar a terminologia | Acrescenta que, no glossário ICMART, "FIV" abrange inseminação in vitro convencional e ICSI, e que a IIU não é TRA em sentido estrito (é reprodução medicamente assistida) | menor | Terminologia (foco "glossário ICMART"); pares e gabarito inalterados | ICMART 2017 (via fontes secundárias) |
| emb-03-q31 | referencia; referencias | "Cerca de metade dos 47,XXY tem origem paterna" só com Thompson, capítulo citado de memória | Acrescentado Thomas & Hassold, Hum Reprod Update 2003;9(4):309–17 | menor | Dar fonte verificável ao número cobrado na explicação | Thomas & Hassold 2003 (resumo: "quase metade" por não disjunção paterna) |
| emb-03 | referencias (Hviid) | "…Hum Reprod Update. 2018" | "…2018;24(4):468–83" | menor | Referência incompleta | Hviid et al. 2018 (resumo: blastocisto × clivagem, OR 2,18 para monozigóticos) |
| emb-04-q27 | contexto, explicacao, referencia; referencias | "A biópsia… mostra trissomia em parte das células e constituição normal nas demais"; "Um resultado em mosaico indica duas linhagens celulares" | "Retiram-se algumas células do trofectoderma, analisadas em conjunto; o número de cópias fica entre o de 2 e o de 3 cópias; laudo de mosaico"; "Um valor intermediário é interpretado como mistura… um mosaicismo real exige…"; acrescenta variação técnica, laudos discordantes entre laboratórios e transferência após aconselhamento quando não há euploide | importante | No PGT-A por sequenciamento não se contam células; o laudo de mosaico é um valor intermediário e pode ser artefato. A explicação apresentava como certo o que é inferência. Gabarito (b) mantido. | ASRM, Clinical management of mosaic results from PGT-A of blastocysts, Fertil Steril 2023;120:973–82 |
| emb-04-q29 | explicacao, referencia; referencias; incertezas | "rara na concepção espontânea e mais frequente após reprodução assistida"; mecanismo sem fonte | "…bem mais frequente…; por isso, numa gestação por reprodução assistida, ver gestação intrauterina não afasta ectópica ao mesmo tempo"; Refaat et al. 2015 citado para o mecanismo | menor | Mensagem clínica central da heterotópica após FIV; a incerteza da 1ª etapa sobre o mecanismo fica parcialmente resolvida | Refaat, Dalton, Ledger. Reprod Biol Endocrinol 2015;13:30 (resumo); ACOG PB 193 |
| emb-04-q31 | explicacao, referencia; referencias | Não nomeava a entidade; "neste contexto" sem dizer qual | "Neste contexto (concepção espontânea, sem hCG exógena, que em tratamentos de fertilidade pode dar positivo nos dias seguintes à aplicação)…"; "É a chamada gravidez bioquímica (perda gestacional bioquímica)…" | menor | Terminologia (foco "gravidez bioquímica") e armadilha clínica da hCG de indução em reprodução assistida | Kolte et al. (ESHRE), Hum Reprod 2015;30(3):495–8; ICMART 2017 |
| emb-04 | referencias (ICMART) | "…Fertil Steril. 2017" | "…2017;108(3):393–406"; capítulo inclui "gravidez bioquímica" | menor | Referência incompleta (igual à correção feita em emb-03 na 1ª etapa) | — |
| emb-05-q30 | contexto; explicacao (a) | Esvaziamento indicado só por sangramento + hCG alta; "a constituição 46,YY não é observada" | Vinheta inclui ultrassonografia com conteúdo intrauterino heterogêneo, multicístico, sem embrião; "46,YY nunca foi descrita (presume-se que um concepto sem cromossomo X seja inviável)" | menor | Realismo (a conduta parte da suspeita ultrassonográfica; FIGO 2021) e formulação compatível com as fontes achadas | Ngan et al., FIGO 2021; StatPearls; Medscape (secundárias) |
| emb-05-q31 | explicacao | "salvo a rara gestação heterotópica" | "salvo a gestação heterotópica, rara na concepção espontânea, mas bem mais frequente após reprodução assistida" | menor | Evita ensinar que a gestação intrauterina afasta ectópica também após FIV | ACOG PB 193 (2018) |

Registros (não contam como correção):
- `notasDivergencia` de emb-01: nova nota sobre os critérios de redatação (ACOG × guias brasileiros de APS).
- `incertezas` anotadas com o que foi conferido: emb-01 (datação no Brasil), emb-02 (q31), emb-03 (glossário ICMART de 2025; q31), emb-04 (q27; q29, parcialmente resolvida), emb-05 (46,YY).
- `revisao.agentes`: uma entrada `obstetricia/reproducao-humana/genetica` / `revisor-obstetricia-avancado-v1` acrescentada em cada tópico, sem apagar as anteriores.

## 3. Conferências por eixo clínico (sem correção, salvo onde indicado)

**Datação e redatação**
- emb-01 q26: conta refeita com 37 dias: ovulação no dia 23; 56 − 23 = 33 dias após a fertilização; 33 + 14 = 47 dias = 6s5d; diferença de 9 dias → (c). ✔
- emb-01 q27: D5 = 19 dias de IG na transferência; 19 + 40 = 59 dias = 8s3d → (b); (c) 54 dias = 7s5d; (d) 45 dias = 6s3d. A datação pela transferência e pela idade do embrião é o que o ACOG CO 700 manda, e não achei divergência brasileira. ✔ Observação: um CCN 6 dias menor que a idade pela transferência não muda a data, mas na prática pede atenção ao crescimento. Não é cobrado e não foi acrescentado.
- emb-01 q28, q29 e q30: contas da 1ª etapa conferidas (56 dias ≈ 10 semanas de IG; 6/14/20/35/56/70; 11/37/75 dias). ✔
- emb-05 q32: 5 + 9 = 14 dias após a fertilização = 28 dias = 4 semanas de IG. O β-hCG 9 dias após a transferência de um blastocisto é o momento usual do teste. ✔

**Reprodução assistida e gemelaridade**
- emb-02 q30: o FSH exógeno mantém o FSH acima do limiar e contorna a seleção do folículo dominante (estradiol e inibina B) → (a). ✔
- emb-03 q27: 2 blastocistos aos 34 anos respeitam o limite do CFM nas resoluções de 2017, 2021 e 2022. Par MC/DA = divisão do embrioblasto. Monozigóticos são mais frequentes com blastocisto (Hviid 2018: OR 2,18 contra transferência na clivagem). ✔
- emb-03 q28: 3PN após ICSI com checagem em 16–18 h; mecanismo = retenção do 2º corpúsculo polar (Grossmann 1997, já conferido na 1ª etapa). ✔
- emb-03 q30: cada descrição serve a uma só técnica. Terminologia ICMART acrescentada (menor).
- emb-04 q30: modelo dos livros, com a ressalva dos monozigóticos dicoriônicos após transferência de um único blastocisto já registrada. ✔

**Heterotópica e β-hCG**
- emb-04 q29: diagnóstico de heterotópica inequívoco (saco vitelino no saco anexial, separado do ovário). Mecanismo com fonte; mensagem "intrauterina não afasta ectópica após reprodução assistida" acrescentada (menor).
- emb-04 q31: β-hCG positivo em concepção espontânea = implantação iniciada → (d). Gravidez bioquímica nomeada (menor).

**Mola hidatiforme e genética**
- emb-05 q30: 46,XY sem alelos maternos, com dois alelos paternos diferentes, p57 negativa no citotrofoblasto e no estroma = mola completa heterozigota (dispérmica) → (d). ✔
- emb-05 q34: triploidia digínica sobretudo por erro na meiose II materna. Zaragoza 2000 (resumo) diz que os casos maternos vieram principalmente da meiose II; McFadden e Langlois 2000 concordam; Baumer 2000 achou metade em MI e metade em MII. O "em geral" do texto é defensável. ✔
- emb-02 q28: alelos A, B (maternos, pericentroméricos) + C → meiose I materna (Antonarakis 1992). ✔
- emb-02 q29: 2 espermátides com 24 e 2 com 22 cromossomos. ✔
- emb-03 q31: XmXpY → espermatozoide 24,XY → meiose I paterna. "Cerca de metade" é paterna (Thomas & Hassold 2003: "quase metade"; outras séries, 50–60%). ✔

## 4. Datação: ACOG CO 700 × prática brasileira

| Fonte | Critério para redatar no 1º trimestre | Situação da conferência |
|---|---|---|
| ACOG CO 700 (2017, reafirmado) | > 5 dias até 8 6/7 semanas pela DUM; > 7 dias de 9 0/7 a 13 6/7 | Já citado no tópico |
| Consenso CBR/FEBRASGO de ultrassonografia (ofício de 2020; PDF no site do CBR) | Trecho: discordância "de mais de 5 dias até a 9ª semana e de 7 dias ou mais" depois | Só trecho obtido por busca; texto integral não aberto |
| Protocolo FEBRASGO de ultrassonografia no 1º trimestre | Trecho: manter a DUM se a diferença para o CCN for menor que 5 dias | Só trecho; número e ano do protocolo não confirmados |
| Guia do Pré-natal e Puerpério na APS, SES-RS (2024) | Desvio esperado de 3 a 7 dias no 1º trimestre; DUM mantida se couber nele | Trecho literal obtido por busca |
| Guia de Referência Rápida — Pré-natal, SMS-Rio (2019) | Ultrassonografia "confirma a DUM se esta cair dentro da margem de erro do exame" | Trecho obtido por busca |
| Guia institucional do Hospital Israelita Albert Einstein | Segue o ACOG | Trecho obtido por busca |

Conclusão: a FEBRASGO e o CBR, ao que tudo indica, seguem os limiares do ACOG, enquanto guias de atenção primária usam uma margem única de ~1 semana. Os dois critérios só divergem para diferenças de 6 a 7 dias antes de 9 semanas. Por isso a q26 passou a usar ~9 dias. O resumo do tópico, fora do escopo, cita só o ACOG, o que está correto. Não consegui abrir o *Manual de Gestação de Alto Risco* (MS, 2022) no trecho de datação.

## 5. Pontos para o revisor humano

1. **Datação no Brasil (emb-01):** conferir no texto integral o consenso CBR/FEBRASGO e o protocolo FEBRASGO de ultrassonografia de 1º trimestre (há a diferença "> 5" × "≥ 5 dias"), e avaliar a mudança do ciclo da q26 de 35 para 37 dias. Se preferir manter 35 dias, a q26 precisa voltar a nomear o critério.
2. **46,YY (emb-05 q30):** só achei fontes secundárias (StatPearls: "presumidamente inviável"; Medscape: "nunca registrada"). Falta uma fonte primária ou uma frase de Williams ou Robbins. A redação agora é "nunca foi descrita (presume-se inviável)".
3. **Glossário ICMART:** saiu a 4ª edição (*The International Glossary on Infertility and Fertility Care, 2025*; Hum Reprod 2026;41(6):892–909), com 79 termos novos e 14 excluídos. Conferir se mudaram as definições de FIV, ICSI, IIU, GIFT, PGT-A e gravidez bioquímica, e se as referências de emb-03 e emb-04 devem ser atualizadas.
4. **Resolução do CFM sobre reprodução assistida:** uma fonte (Migalhas) menciona norma posterior que modifica a 2.320/2022; não consegui identificá-la. A q27 de emb-03 (2 embriões aos 34 anos) é compatível com as versões de 2017, 2021 e 2022. Pendência já listada em `docs/pendencias-conferencia-medica.md` (item C).
5. **PGT-A em mosaico (emb-04 q27):** a vinheta foi reescrita para o PGT-A por número de cópias. Conferir se a formulação agrada e se o ASRM 2023 (autoria e título conferidos só na página da ASRM) é a referência desejada.
6. **Janela fértil (emb-02 q31):** a premissa de 48 h vem de Moore. A explicação agora cita a janela de ~6 dias (Wilcox 1995). Decidir se o resumo do tópico, fora do escopo, deve mencionar a janela fértil clínica.
7. **Pendências da 1ª etapa mantidas:** capítulos de Thompson & Thompson (mosaicismo: provavelmente caps. 5 e 17, e não 6) e de Carlson 6ª ed. citados de memória.
8. **Vinheta de emb-03 q27:** "(uma só placenta)" com 8 semanas é uma inferência (no 1º trimestre a corionicidade se define pelo número de sacos coriônicos). Mantida por ser didática.
9. **Método:** todas as conferências de artigos e diretrizes foram feitas por resumos e trechos obtidos por busca na web, não pelo texto integral. Os sites do NCBI, da Nature, do GFMER e do CBR não abrem na rede desta sessão.

## 6. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo && npx vitest run
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

(Última execução, depois de todas as edições. Nenhuma falha, inclusive nos testes dos modelos 3D. Os totais incluem arquivos de outros agentes; esta revisão alterou só emb-01 a emb-05 e este relatório.)

## 7. Fontes consultadas por busca (resumos e trechos)

- ACOG CO 700 e critérios brasileiros: [MSD Manual (PT), Idade gestacional](https://www.msdmanuals.com/pt/profissional/pediatria/problemas-perinatais/idade-gestacional); [Guia do Pré-natal e Puerpério na APS — SES-RS 2024](https://atencaoprimaria.rs.gov.br/upload/arquivos/202404/25124004-guia-do-pre-natal-2024.pdf); [Guia de Referência Rápida — Pré-natal, SMS-Rio 2019](https://subpav.org/SAP/protocolos/arquivos/guia_de_referencia_rapida_atencao_ao_pre-natal__:rotinas_para_gestantes_de_risco_habitual__.pdf); [Consenso CBR/FEBRASGO](https://cbr.org.br/wp-content/uploads/2022/12/consenso-CBR-Febrasgo-GO.pdf); [Protocolo FEBRASGO — USG 1º trimestre (cópia)](https://drglaucius.com.br/wp-content/uploads/2018/01/usg-1t.pdf); [Einstein — Determinação da Idade Gestacional](https://medicalsuite.einstein.br/pratica-medica/Pathways/Determinacao-da-Idade-Gestacional.pdf)
- 46,YY: [StatPearls — Hydatidiform Mole](https://www.ncbi.nlm.nih.gov/books/NBK459155/); [Medscape — Hydatidiform Mole](https://img.medscape.com/pi/iphone/medscapeapp/html/A254657-business.html); [Kajii & Ohama 1977](https://www.nature.com/articles/268633a0.pdf); [Ohama et al. 1981](https://www.nature.com/articles/292551a0)
- PGT-A em mosaico: [ASRM 2023](https://www.asrm.org/practice-guidance/practice-committee-documents/clinical-management-of-mosaic-results-from-preimplantation-genetic-testing-for-aneuploidy-pgt-a-of-blastocysts-a-committee-opinion)
- ICMART: [Glossário 2017 (PDF ASRM)](https://www.asrm.org/globalassets/_asrm/practice-guidance/practice-guidelines/pdf/international_glossary_on_infertilty_and_fertility_care.pdf); [Vitrolife — resumo das definições de 2017](https://blog.vitrolife.com/togetheralltheway/dont-glance-over-the-glossary-you-might-miss-a-new-acronym); [Glossário 2025 (ASRM)](https://www.asrm.org/practice-guidance/practice-committee-documents/the-international-glossary-on-infertility-and-fertility-care-2025/)
- Janela fértil: [Wilcox et al. 1995](https://scholars.duke.edu/publication/750382)
- Ectópica após FIV: [Refaat et al. 2015](https://link.springer.com/content/pdf/10.1186/s12958-015-0025-0.pdf)
- Gravidez bioquímica: [Kolte et al. 2015 (ESHRE)](https://pubmed.ncbi.nlm.nih.gov/25376455/)
- 47,XXY: [Thomas & Hassold 2003](https://eprints.soton.ac.uk/24986/)
- Gemelaridade monozigótica: [Hviid et al. 2018](https://www.pubmed.gov/29538675/)
- Triploidia: [Zaragoza et al. 2000](https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/Parental-Origin-and-Phenotype-of-Triploidy/99900547898001842)
