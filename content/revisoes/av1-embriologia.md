# Revisão por agente — camada avançada (AV1), área embriologia, 1ª etapa

- Agente: `revisor-embriologia-avancado-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas em `referencias`, `notasDivergencia` e `incertezas` de `content/embriologia/topicos/` emb-01 a emb-05. As questões e os textos anteriores, que já passaram por duas etapas, não foram mexidos. Nenhum outro arquivo foi alterado.

## 1. Resumo

| Tópico | Questões avançadas | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| emb-01-introducao | q26–q30 (5) | 0 | 1 | 0 | aprovado-com-correcoes |
| emb-02-gametogenese | q28–q32 (5) | 0 | 1 | 0 | aprovado-com-correcoes |
| emb-03-fertilizacao | q27–q31 (5) | 0 | 1 | 3 | aprovado-com-correcoes |
| emb-04-semana1 | q27–q31 (5) | 0 | 0 | 3 | aprovado-com-correcoes |
| emb-05-semana2 | q30–q34 (5) | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **4** | **7** | |

Gravidades: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, referência, pista de comprimento.

**Nenhum gabarito estava errado e nenhum fato cobrado estava errado.** Refiz todas as contas, conferi as explicações letra a letra e verifiquei os ids das alternativas (a–d, em ordem). Nenhuma questão precisou ser reescrita, e nenhum id nem gabarito mudou. A distribuição das letras corretas continua equilibrada nos 5 tópicos (maior fatia: 5 de 19 ou 20).

Os problemas encontrados foram de quatro tipos:
- uma questão de datação cujo gabarito só é único com o limiar do ACOG, que o enunciado não nomeava (emb-01 q26);
- um item de ordenar com sobreposição temporal real (emb-02 q32);
- duas refutações de distrator com lógica errada (emb-03 q27 e emb-05 q32);
- pista de comprimento invertida: em 7 das 18 questões avançadas com alternativas de tamanhos diferentes, a correta era a mais curta. Corrigi as 4 em que a diferença era evidente (5 a 13 caracteres).

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | gravidade | motivo | fonte |
|---|---|---|---|---|---|---|
| emb-01-q26 | enunciado, contexto, explicacao | "qual deve ser a conduta quanto à datação?"; "Na ultrassonografia…, a IG calculada pela DUM é de 8 semanas" | "…segundo os critérios do ACOG (Committee Opinion 700)?"; "No dia da ultrassonografia…"; explicação diz "Pelos critérios do ACOG" | importante | A diferença DUM × CCN é de 7 dias. Pelo ACOG (> 5 dias antes de 9 semanas), a correta é (c). Se fosse aplicado um limiar único de 7 dias no 1º trimestre (não confirmado em protocolo brasileiro), (b) passaria a ser defensável. Nomear a diretriz torna o gabarito único. | ACOG CO 700 (2017) |
| emb-02-q32 | itens[1], explicacao | "Luteinização das células da granulosa e da teca interna, com secreção de progesterona" (posição 6, depois da ovulação) | "A parede do folículo rompido forma o corpo lúteo, que secreta progesterona"; a explicação registra que a luteinização começa com o pico de LH | importante | A luteinização da granulosa e a subida da progesterona começam com o pico de LH, horas antes da ruptura folicular. Do jeito que estava, o item podia vir antes da ovulação, e a sequência deixava de ser inequívoca. A ordem cobrada não mudou. | Moore 11ª ed., cap. 2; Williams 26th ed. (ciclo ovariano) |
| emb-03-q27 | explicacao (a) | "…formaria seu próprio córion e não explicaria o par que compartilha a placenta" | "…teria seu próprio córion, mas o par monocoriônico continuaria a exigir a divisão de um blastocisto, e o outro blastocisto teria de não se implantar: combinação bem menos provável que (b)" | importante | A alternativa (a) atribui à concepção natural só o 3º embrião. A refutação antiga não a refutava de fato. Agora o distrator é refutado pelo critério "mais provável". | Moore 11ª ed., cap. 7 |
| emb-03-q28 | explicacao (abertura e d) | "três pronúcleos após ICSI resultam, em geral, de falha na expulsão do 2º CP"; "(d) Cada pronúcleo replica seu DNA… sem se dividir em dois" | "o mecanismo mais frequente… é a falha na expulsão do 2º CP"; (d) acrescenta que parte dos 3PN pós-ICSI é diploide, mas entre os triploides predomina a retenção do 2º CP | menor | Grossmann et al.: cerca de 36% dos "3PN" pós-ICSI eram diploides. "Em geral" exagerava a proporção. | Grossmann et al., Hum Reprod 1997;12(12):2762–5 (resumo) |
| emb-03-q29 | alternativas[d] | "Maior proporção de ovócitos com mais de um pronúcleo masculino" (62 car.; demais 70–75) | "Aumento dos ovócitos com dois ou mais pronúcleos masculinos (polispermia)" (73) | menor | Pista de comprimento (a correta era a mais curta). O sentido não mudou. | — |
| emb-03 | referencias (ICMART) | "…Fertil Steril. 2017" | "…Fertil Steril. 2017;108(3):393–406" | menor | Referência incompleta | Glossário ICMART 2017 |
| emb-04-q29 | explicacao | "…e ainda podem deslocar-se; uma tuba lesada por salpingite favorece que o embrião fique retido…" | "…a explicação mais aceita é que um deles se desloque até a tuba, e a lesão tubária pela salpingite favorece que fique retido…" | menor | O mecanismo da ectópica após FIV não está nas obras-base. O texto deixou de afirmá-lo como fato estabelecido. O fato cobrado (heterotópica) não mudou. | ACOG PB 193 (2018) |
| emb-04-q28 | alternativas[c] | "Sem compactação, falha a separação entre células internas e externas" (68; demais 72–79) | "Sem compactação, falha a distinção entre células internas e externas da mórula" (78) | menor | Pista de comprimento | — |
| emb-04-q31 | alternativas[d] | "Houve implantação inicial, com sinciciotrofoblasto produtor de hCG" (66; demais 75–80) | "Houve implantação inicial, com o sinciciotrofoblasto já produzindo a hCG" (72) | menor | Pista de comprimento | — |
| emb-05-q32 | explicacao (c) | "(c) Subtrai as 2 semanas em vez de somá-las…" | "(c) Iguala a idade após a fertilização à idade gestacional, sem somar as 2 semanas; além disso…" | importante | A alternativa (c) diz "14 dias após a fertilização (≈ 2 semanas de IG)", ou seja, iguala as duas idades. Subtrair daria 0 semana. A explicação ensinava o raciocínio errado. | Moore 11ª ed., cap. 1 e 3 |
| emb-05-q31 | alternativas[a] | "Saco vitelino secundário, na cavidade coriônica, fora do âmnio" (62; demais 67–75) | "Saco vitelino secundário, situado na cavidade coriônica, fora do âmnio" (70) | menor | Pista de comprimento | — |

Registros (não contam como correção):
- `incertezas` anotadas com o que foi conferido: emb-01 (datação × FEBRASGO/MS), emb-02 q28, emb-03 q27 e q28, emb-04 q29, emb-05 q30.
- Nova incerteza em emb-04: o capítulo de Thompson citado para mosaicismo (q27).
- `revisao.agentes`: uma entrada acrescentada em cada tópico, sem apagar as anteriores.

## 3. Contas refeitas e fatos conferidos sem correção

- **emb-01 q26**: ciclo de 35 dias, logo ovulação/fertilização ~21º dia. Com 56 dias de DUM, o embrião tem 35 dias após a fertilização = 49 dias de IG = 7 semanas. A diferença é de 7 dias, acima do limite de 5 dias (ACOG, ≤ 8 6/7 semanas): redatar → **(c)**. ✔
- **emb-01 q27**: o blastocisto D5 tem 5 dias na transferência (19 dias de IG). 19 + 40 = 59 dias = **8 semanas e 3 dias (b)**. Os distratores também conferem: (c) 40 + 14 = 54 = 7s5d; (d) 45 dias = 6s3d. ✔ ACOG: DPP = transferência + 261 dias para D5 (19 + 261 = 280). ✔
- **emb-01 q28**: estágio 23 (~56 dias; até ~60 em O'Rahilly) ≈ 10 semanas de IG, portanto concordante → (a). ✔
- **emb-01 q29**: em dias após a fertilização: implantação ~6; 4 semanas de IG = 14; 20; 7 semanas de IG = 35; estágio 23 ≈ 56; 12 semanas de IG = 70. Ordem 3-5-1-2-6-4, com intervalos de pelo menos 6 dias entre posições. ✔
- **emb-01 q30**: 3s4d → 11 dias; 7s2d → 37 dias (6ª semana); 12s5d → 75 dias (período fetal) → (d). ✔
- **emb-02 q28**: alelos A, B (maternos, heterodissomia pericentromérica) + C → meiose I materna (c). ✔ Antonarakis 1992 (resumo): 128 casos maternos em MI × 38 em MII (77,1%), sem diferença de idade materna entre os grupos; os autores reconhecem erros raros de atribuição por crossing-over. A incerteza do redator está **resolvida**.
- **emb-02 q29**: não disjunção em MI seguida de MII normal → 2 espermátides com 24 cromossomos e 2 com 22 → (d). ✔
- **emb-02 q30**: FSH exógeno contorna a queda do FSH causada pelo estradiol e pela inibina B → (a). ✔ Coerente com o resumo do tópico.
- **emb-02 q31**: ciclo de 32 dias → ovulação ~18º dia. Com espermatozoides viáveis por ~48 h e ovócito por 12–24 h, a janela vai dos dias 16 a 18 → (b). ✔ A resposta não muda com os dados de Wilcox (janela de até 6 dias), porque o pico de probabilidade continua nos 2 dias anteriores à ovulação e no próprio dia.
- **emb-03 q27, q29, q30, q31; emb-04 q27, q28, q30, q31; emb-05 q30, q31, q33, q34**: gabarito único, explicações corretas. Na q30 do emb-03, cada descrição serve a uma só técnica. Na q31, XmXpY implica espermatozoide 24,XY, ou seja, meiose I paterna, e cerca de metade dos 47,XXY tem essa origem (Thompson & Thompson).
- **emb-05 q32**: 5 + 9 = 14 dias após a fertilização = 28 dias = **4 semanas de IG**, com disco bilaminar (a linha primitiva aparece na 3ª semana) → (b). ✔
- **emb-05 q34**: "triploidia digínica em geral por erro na meiose II": Zaragoza 2000 (resumo) diz que os casos maternos vieram principalmente de erro na meiose II. ✔

## 4. Pontos de incerteza do redator: o que foi resolvido

| Ponto | Situação | Base |
|---|---|---|
| Crossing-over e atribuição meiose I × II (emb-02 q28) | **Resolvido.** Os marcadores pericentroméricos são o método do artigo, cujos autores admitem erros raros. A questão pede o "mais provável". | Antonarakis et al., Am J Hum Genet 1992;50(3):544–50 (resumo) |
| Zigotos 3PN após ICSI (emb-03 q28) | **Resolvido.** ~36% dos "3PN" eram diploides; entre os triploides, a principal causa é a não extrusão do 2º CP. A explicação foi ajustada. | Grossmann et al., Hum Reprod 1997 (resumo) |
| Gêmeos dizigóticos monocoriônicos (emb-03 q27) | **Resolvido.** O fenômeno existe e é raro: revisão sistemática com 31 pares, todos MC/DA, 82,1% após reprodução assistida. O "mais provável" do enunciado basta. | Peters et al., Twin Res Hum Genet 2017;20(2):161–8 (resumo) |
| Mecanismo da ectópica após FIV (emb-04 q29) | **Parcial.** O texto passou a apresentar o deslocamento até a tuba como "explicação mais aceita". Não achei a frase nas obras-base. | — (pendente) |
| Origem dispérmica das molas completas heterozigotas (emb-05 q30) | **Resolvido.** Usui et al. 2019: 12 de 13 casos com zigosidade centromérica mista (dispermia). | Usui et al., Sci Rep 2019, doi:10.1038/s41598-019-49047-7 (resumo) |
| "Mola 46,YY não ocorre" (emb-05 q30) | **Pendente.** Afirmação clássica, coerente com a inviabilidade presumida de um concepto sem X, mas sem fonte primária conferida. A questão diz "não é observada", o que é defensável. | — (pendente) |

## 5. Datação: ACOG CO 700 × prática brasileira

- O que as questões usam (ACOG CO 700): redatar pelo CCN quando a diferença passa de **5 dias até 8 6/7 semanas** e de **7 dias de 9 0/7 a 13 6/7 semanas**; na reprodução assistida, datar pela transferência e pela idade do embrião (D5 → DPP em 261 dias).
- Prática brasileira: **não consegui confirmar** os limiares adotados pela FEBRASGO nem pelo Ministério da Saúde. A busca não trouxe o trecho do *Manual de Gestação de Alto Risco* (MS, 2022) nem do documento da FEBRASGO sobre ultrassonografia de 1º trimestre. Os sites de PubMed/NCBI não abrem na rede da sessão. O MSD Manual em português reproduz os limiares do ACOG. Se algum protocolo brasileiro adotar um limiar único de 7 dias no 1º trimestre, a alternativa (b) da q26 ficaria defensável; por isso a q26 passou a nomear o ACOG.
- A datação de gestações por reprodução assistida pela data da transferência (q27) é prática geral, sem divergência conhecida.
- Pendência já registrada em `docs/pendencias-conferencia-medica.md` (item C). Este relatório não altera esse arquivo.

## 6. Pontos para o revisor humano

1. **Limiares de redatação no Brasil (emb-01 q26)**: confirmar se FEBRASGO/MS usam 5 dias antes de 9 semanas. Se a prática brasileira for diferente, decidir entre manter a q26 ancorada no ACOG (como está) ou trocar o cenário por uma diferença acima de 7 dias.
2. **"46,YY não é observada" (emb-05 q30)**: falta uma fonte primária ou uma frase de Williams/Robbins.
3. **Ectópica após FIV (emb-04 q29)**: aceitar a formulação "explicação mais aceita" ou citar uma revisão específica.
4. **Capítulos citados de memória**: Carlson 6ª ed., "Clivagem e implantação" (provavelmente cap. 3, como nas edições anteriores, porque o tópico já cita os caps. 1 e 2 dessa edição); Thompson & Thompson 8ª ed., cap. 6, para mosaicismo (emb-04 q27), que pode estar nos capítulos de citogenética clínica ou de diagnóstico pré-natal.
5. **Sobrevida dos espermatozoides (emb-02 q31)**: a premissa de ~48 h segue Moore. Estudos clínicos (janela fértil de até 6 dias) indicam sobrevida maior em parte dos casos. O gabarito não muda; vale decidir se o resumo do tópico deve mencionar isso.
6. **emb-04 q30 (associar gemelaridade × momento da separação)**: o conteúdo é clássico e se sobrepõe à q12 do mesmo tópico. Mantive dificuldade 4 e Bloom "aplicar". Avaliar se pertence à camada avançada.
7. **Pista de comprimento residual**: em emb-01 q28, emb-02 q28/q29 e emb-04 q31, a correta ainda é a mais curta, mas a diferença é de 1 a 3 caracteres. Mantidas.
8. As conferências de artigos (Antonarakis, Grossmann, Usui, Peters, Hviid, Zaragoza) foram feitas **pelos resumos obtidos por busca**, não pelo texto integral.

## 7. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo && npx vitest run
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

(Última execução, depois de todas as edições. O total de tópicos e questões inclui arquivos que outros agentes editavam ao mesmo tempo; esta revisão alterou só emb-01 a emb-05 e este relatório. Nada foi commitado.)
