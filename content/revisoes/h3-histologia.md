# Revisão H3 — histologia (tópicos 8 a 10)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md` (seção Histologia; obras-base Junqueira & Carneiro 14ª ed., Ross & Pawlina 8ª ed.)
- Arquivos: `content/histologia/topicos/his-08-sangue-hematopoese.json`, `his-09-muscular.json`, `his-10-nervoso.json`
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos três arquivos. Nenhum id foi alterado (tópicos, estruturas, eventos, correlações, questões, alternativas, itens). Nenhum gabarito (`correta`/`ordemCorreta`) foi alterado. A checagem foi feita por script contra `git show HEAD`. Nenhum arquivo fora do H3 foi editado; `content/histologia/laminas.json` só foi lido.

## 1. Resumo

Revisei integralmente os três tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações clínicas, 81 questões, referências, notas de divergência e incertezas. O conteúdo estava, em geral, correto e bem escrito. **Não encontrei fato errado em questão nem gabarito errado.** As correções são de precisão, de terminologia ou de coerência entre tópicos e lâminas. Uma delas foi classificada como importante, porque a explicação de uma questão ensinava um fato anatômico incorreto.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-08 Sangue e hematopoese | 28 | 0 | 1 | 8 | 9 | aprovado-com-correcoes |
| his-09 Tecido muscular | 27 | 0 | 0 | 8 | 8 | aprovado-com-correcoes |
| his-10 Tecido nervoso | 26 | 0 | 0 | 5 | 5 | aprovado-com-correcoes |
| **Total** | **81** | **0** | **1** | **21** | **22** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, precisão, referência.

Outras checagens, feitas por script:
- Em todas as 45 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- Distribuição das letras corretas: his-08 a4/b4/c4/d3; his-09 a4/b4/c4/d3; his-10 a3/b4/c4/d4. Nenhuma letra passa de 27%, então não houve redistribuição.
- Tipos de questão: his-08 15 multipla, 7 vf, 3 ordenar, 3 associar (8 com contexto); his-09 15/5/4/3 (8 com contexto); his-10 15/5/3/3 (7 com contexto).
- Todos os ids de estrutura das lâminas `esfregaco-sanguineo`, `musculo-esqueletico`, `musculo-cardiaco`, `musculo-liso`, `neuronio-medula` e `nervo-periferico` existem nos tópicos, com nomes e definições compatíveis. Comparei com a versão atual de `laminas.json`, já editada pelo `revisor-laminas-v1`.

### Pontos de atenção do redator: conferência um a um

| Ponto | Resultado |
|---|---|
| Capítulos de Junqueira citados pela numeração da 13ª ed. (9 nervoso, 10 muscular, 12 sangue, 13 hemocitopoese) | **Não resolvido.** Não encontrei o sumário da 14ª ed. (2023). As questões citam o **título** do capítulo, o que permite localizá-lo em qualquer numeração. Fica para o humano. |
| Ross 8ª (10 sangue, 11 muscular, 12 nervoso), Kierszenbaum 5ª (6, 7, 8), Robbins 10ª, Hoffbrand 7ª | Numeração de Ross e Kierszenbaum compatível com a minha memória das obras; a busca não trouxe o sumário impresso. Em Robbins, o título do capítulo de adaptações era o da 9ª ed. e foi corrigido (ver tabela). Hoffbrand: capítulos não numerados no conteúdo. |
| Percentuais do leucograma; as questões cobram só a ordem | **Seguro.** Só q18 (V/F) cobra: "o neutrófilo é o mais numeroso", inequívoco em todas as fontes. A ordem completa N > L > M > E > B aparece apenas no resumo e nos pontos-chave. Pontos-chave só são exibidos, não viram jogo (`src/screens/Topico.tsx`). Acrescentei "habitual" porque as faixas de monócitos (3–8%) e eosinófilos (2–4%) se sobrepõem. Os valores atribuídos a Junqueira (60–70, 20–30, 3–8, 2–4, 0,5–1%) batem com material didático secundário que cita o livro; a tabela da 14ª ed. não foi vista. |
| Diâmetro da hemácia 7,5 × 7,8 µm | Faixa 7–8 µm adequada; não é cobrada numericamente. |
| Reticulócitos ~1% × 1–2% | "~1–2%" adequado; aparece só em explicação de V/F, sem ser cobrado. |
| Lóbulos do neutrófilo 2–5 × 3–5; hipersegmentação | 2–5 mantido. A lâmina já foi corrigida para "2 a 5 (em geral 3)", e os dois textos agora coincidem. Na correlação, o critério de hipersegmentação foi alinhado à nota de divergência (ver tabela). |
| Limites do VCM | ~80 e ~100 fL só nas correlações, como aproximação, com a nota sobre a faixa 80–95 fL de Hoffbrand. Mantido. |
| Contagem de plaquetas | < 150.000/µL só na correlação ("na maioria dos laboratórios"). Mantido. |
| Hematopoese fetal (início × predomínio; AGM) | A sequência saco vitelino → fígado → medula (q25) é inequívoca. "Fígado, principal no início do período fetal" está de acordo com Moore. "Medula predominante no fim da gestação" foi trocado por "principal sítio no 3º trimestre", compatível com Moore (28 semanas após a fertilização) e Sadler (7º mês). Nota acrescentada. |
| Célula renal produtora de eritropoetina | **Incerteza resolvida e movida para `notasDivergencia`:** células intersticiais peritubulares (Hoffbrand; ~90% renal). O conteúdo continua dizendo só "sobretudo no rim". |
| Fibras IIb × IIx | Conteúdo correto. As questões falam em "tipo II glicolíticas". Na nota, a atribuição "Junqueira usa IIb" foi suavizada (não conferida). |
| Regeneração cardíaca (~1%/ano aos 25 anos; Bergmann 2009) | Correto: ~1% ao ano aos 25 anos e ~0,45% aos 75 (Science 2009;324:98-102). |
| Cronologia histológica do infarto (Robbins) | Correta: necrose de coagulação a partir de 4–12 h, neutrófilos em 1–3 dias, macrófagos em 3–7 dias, granulação a partir de 7–10 dias, cicatriz densa após ~2 meses. Em q24 a ordem de início das fases é inequívoca. |
| Origem da micróglia (saco vitelino; Ginhoux 2010) | Correta. q12 cobra "linhagem hematopoética mieloide (mesodérmica)", que vale nas duas visões. Na estrutura `microglia`, explicitei o saco vitelino. A origem do `macrofago` em his-08 foi alinhada. |
| Barreira hematoencefálica | A resposta de q04 está correta: junções oclusivas endoteliais (d). A afirmação "induzidas pelos astrócitos" foi suavizada: pericitos também são necessários (Armulik e Daneman, Nature 2010). Ver tabela. |
| "Núcleo excêntrico" nos gânglios autônomos | Mantido como "muitas vezes excêntrico" (descrição de atlas). A q11 não depende disso: tipo de neurônio, núcleo central e cápsula contínua de satélites bastam para o gânglio sensitivo. |
| Receptores de ACh nas dobras juncionais | Correto: receptores nas cristas, canais de Na⁺ no fundo (Ross; Flucher e Daniels, Neuron 1989;3:163-75). **Incerteza resolvida** e movida para `notasDivergencia`. |
| Degeneração walleriana com empate de `ordem` (remoção de restos = colunas de Schwann = 3) | Permitido pelo protocolo e adequado: os dois processos ocorrem em paralelo. A ordem dos demais eventos é inequívoca. A q23 omite a remoção e diz isso na explicação. |
| Coerência com as lâminas | Ok (ver acima). A única divergência, "núcleo bilobado" do basófilo em q15 contra "núcleo irregular" na lâmina, foi alinhada. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-08-q11 + resumo + estrutura `medula-ossea-vermelha` | explicacao; resumo; definicao | "esqueleto axial (b), **isto é**, crânio, vértebras, costelas, esterno e **pelve**". A estrutura dizia "esqueleto axial e epífises proximais", sem o quadril | "crânio, vértebras, costelas, esterno e pelve (b), isto é, esqueleto axial **e ossos do quadril**". Resumo e estrutura acrescentam os ossos do quadril | Os ossos do quadril pertencem ao esqueleto apendicular, e a explicação ensinava o contrário. A estrutura omitia um dos principais sítios de medula vermelha do adulto (crista ilíaca, local habitual da biópsia) | importante | Ross 8ª ed., cap. 10; Junqueira 14ª ed., Hemocitopoese; Terminologia Anatômica |
| his-08 resumo + q25 | resumo; explicacao | Medula "predominante no **fim da gestação**" | "Principal sítio no **3º trimestre**". Nota de divergência ampliada com Sadler | "Fim da gestação" sugere o termo; Moore dá 28 semanas após a fertilização e Sadler o 7º mês | menor | Moore 11ª ed., cap. 6; Sadler 14ª ed. |
| his-08 | pontosChave[4] | "a frequência dos leucócitos é N > L > M > E > B" | "a frequência **habitual**…" | As faixas de monócitos e eosinófilos se sobrepõem, e a ordem M > E vale em média | menor | Junqueira 14ª ed., Células do sangue |
| his-08 / `macrofago` | origem | "Monócito do sangue." | + "parte dos macrófagos residentes (como a micróglia) deriva de precursores embrionários e se mantém por autorrenovação" | Coerência com his-10 (micróglia do saco vitelino) | menor | Ginhoux et al., Science 2010 |
| his-08 / `anemia-macrocitica` | descricao | "neutrófilos hipersegmentados (mais de 5 lóbulos)" | "(núcleos com 6 ou mais lóbulos, ou excesso de núcleos com 5)" | Alinhado à nota de divergência e aos critérios usados em hematologia | menor | Hoffbrand 7ª ed.; Robbins 10ª ed. |
| his-08-q03 | explicacao | "O neutrófilo (b) tem núcleo com vários lóbulos…" | "pode ter núcleo bilobado, mas em geral tem três ou mais lóbulos, e seus grânulos são finos e pouco corados, não grandes e alaranjados" | O próprio tópico admite neutrófilo bilobado; quem refuta o distrator são os grânulos | menor | Junqueira 14ª ed., Células do sangue; lâmina `esfregaco-sanguineo` |
| his-08-q15 | alternativa d; explicacao | "Núcleo **bilobado**, parcialmente encoberto…" | "Núcleo **irregular**, parcialmente encoberto…" | Coerência com a lâmina e com Junqueira (núcleo irregular, muitas vezes em S) | menor | Junqueira 14ª ed.; `laminas.json` |
| his-08-q22 | bloom | aplicar | compreender | V/F sobre mecanismo; não há aplicação a caso | menor | — |
| his-08 | incertezas → notasDivergencia | "Tipo celular renal produtor de EPO… omitido" | Nota: células intersticiais peritubulares (~90% renal); conteúdo mantém "sobretudo no rim" | Incerteza resolvida | menor | Hoffbrand 7ª ed. (eritropoese) |
| his-09 / `fibra-muscular-esqueletica` | origem | "mioblastos derivados dos **somitos**" | "do mesoderma paraxial (somitos no tronco e membros; mesoderma paraxial cranial na maioria dos músculos da cabeça)" | Músculos da cabeça não vêm dos somitos | menor | Sadler 14ª ed., cap. 11; Moore 11ª ed., cap. 15 |
| his-09 / `distrofia-duchenne` | mecanismo | "ciclos de necrose e regeneração **esgotam as células satélites**" | "…acabam superando a capacidade regenerativa do músculo" | O esgotamento das satélites é uma hipótese; há também disfunção intrínseca delas | menor | Robbins 10ª ed., Nervos periféricos e músculos esqueléticos |
| his-09-q04 | explicacao | "dobras (fendas sinápticas secundárias)"; terminal "recoberto apenas por **uma** célula de Schwann" | "dobras juncionais, separadas por fendas sinápticas secundárias"; "recoberto apenas por prolongamentos de células de Schwann, sem mielina" | As dobras delimitam as fendas secundárias e não são elas; a placa tem várias células de Schwann terminais | menor | Ross 8ª ed., cap. 11 |
| his-09-q11 | explicacao | Titina e desmina: "cuja falta não produz esse quadro" | "mutações nos seus genes causam outras miopatias, raras e de quadro diferente, e não a distrofia de Duchenne" | A frase antiga podia ser lida como "a falta dessas proteínas não causa doença" | menor | Robbins 10ª ed. |
| his-09-q23 | item 4 (+ nota + referência) | "A liberação do fosfato **desencadeia** o golpe de força" | "O fosfato é liberado e ocorre o golpe de força" | A causalidade é debatida: o golpe pode preceder a saída do Pi. A sequência cobrada não muda | menor | Muretta et al., PNAS 2015;112:14272-7; Ross 8ª ed., cap. 11 |
| his-09 | referencias (Robbins) | "Respostas celulares ao estresse: adaptações…" | "Lesão celular, morte celular e adaptações…" | O título antigo era o da 9ª ed. | menor | Robbins 10ª ed., cap. 2 |
| his-09 | notasDivergencia (IIb × IIx) | "Junqueira e Ross usam I, IIa e IIb" | "Ross usa I, IIa e IIb (subdivisão em Junqueira 14ª ed. não conferida)" | Atribuição a Junqueira não verificada | menor | Ross 8ª ed., cap. 11 |
| his-09 | incertezas → notasDivergencia (+ referência) | Receptores de ACh nas cristas "segue Ross" | Nota com fonte primária | Incerteza resolvida | menor | Flucher e Daniels, Neuron 1989;3(2):163-75 |
| his-10 resumo, `axonio`, q17 (+ nota + referência) | resumo; definicao; explicacao | "**Sem ribossomos** no axoplasma" | "sem retículo endoplasmático rugoso e com **pouquíssimos** ribossomos" | Há tradução local em axônios. A redação nova é compatível com os livros (sem Nissl) e com a literatura atual | menor | Ross 8ª ed., cap. 12; Holt, Martin e Schuman, Nat Struct Mol Biol 2019;26:557-66 |
| his-10 resumo, pontosChave[3], q04 (+ nota + referência) | resumo; pontosChave; explicacao | Junções oclusivas "**induzidas pelos astrócitos**"; pés vasculares "induzem e mantêm" | "Com os pericitos, ajudam a induzir e manter"; "mantidas com a participação dos astrócitos"; "contribuem para induzir e manter" | Os pericitos são necessários para formar e manter a barreira, que se forma no embrião antes da maturação dos astrócitos. A resposta (d) não muda | menor | Armulik et al. e Daneman et al., Nature 2010;468:557-66 |
| his-10 resumo + `ganglio-sensitivo` | resumo; definicao | Gânglios sensitivos "(raízes dorsais e nervos cranianos)" = pseudounipolares | "(das raízes dorsais e da maioria dos cranianos; coclear e vestibular, bipolares, são exceção)" | Contradição interna: o próprio tópico lista os gânglios coclear e vestibular como bipolares | menor | Junqueira 14ª ed., Tecido nervoso |
| his-10 / `microglia` | origem | "Precursores hematopoéticos mieloides (mesoderma)…" | + "sobretudo macrófagos primitivos do saco vitelino… autorrenovação" | Precisão, alinhada à nota e a Ginhoux 2010 | menor | Ginhoux et al., Science 2010;330:841-5 |
| his-10-q09 | explicacao (refutação de a) | "A mielina… não [é] sede de canais iônicos" | "A mielina compacta funciona como isolante elétrico; os canais iônicos que importam para a condução estão na membrana do axônio" | Afirmação absoluta demais: membranas de células de Schwann têm canais. O argumento correto é sobre a membrana do axônio | menor | Ross 8ª ed., cap. 12 |

## 3. Pontos para o revisor humano

1. **Capítulos de Junqueira 14ª ed. (2023).** As referências usam o título do capítulo e a numeração da 13ª ed. (9 nervoso, 10 muscular, 12 células do sangue, 13 hemocitopoese). Conferir no sumário impresso; não achei o sumário online. Vale também conferir Ross 8ª ed. (10, 11, 12) e Kierszenbaum 5ª ed. (6, 7, 8), citados de memória e compatíveis com a minha memória das obras.
2. **Tabela do leucograma em Junqueira 14ª ed.** Conferir se os valores continuam 60–70 / 20–30 / 3–8 / 2–4 / 0,5–1% (o de basófilos pode ser "0–1%"). Nada disso é cobrado em questão; os números aparecem no resumo, em q18 (explicação) e nas notas.
3. **Sobrevida (~10 dias) e tamanho (~2–4 µm) das plaquetas.** Compatíveis com as obras-base, de memória; não cobrados.
4. **Hematopoese fetal.** A formulação adotada é "medula como principal sítio no 3º trimestre". Se a escola-alvo ensina "a medula começa no 2º trimestre", não há conflito, porque o conteúdo trata de predomínio e não de início. Confirmar se a apostila local dá outra data.
5. **Basófilos e hipersegmentação.** Os critérios de hipersegmentação variam entre Hoffbrand (≥ 6 lóbulos) e Robbins (5 ou 6 ou mais). O conteúdo registra os dois; nenhuma questão cobra o número de lóbulos.
6. **Fibras IIb × IIx.** Ver se o professor prefere a nomenclatura clássica (IIb) ou a humana (IIx). As questões evitam o conflito.
7. **Pi × golpe de força (his-09-q23).** O item foi reescrito sem causalidade. Se o curso ensina "a liberação do Pi desencadeia o golpe" (Ross, Guyton), o aluno não é prejudicado, porque a ordem cobrada é a mesma.
8. **Bipolares nos gânglios coclear e vestibular.** É a classificação clássica de Junqueira (Ross registra variação morfológica). Só a célula bipolar da retina é cobrada.
9. **Selo.** Até a conferência médica, estes tópicos devem aparecer com "Revisado por IA · conferência médica pendente". A 2ª etapa (revisor transversal de outra área) ainda não foi feita.

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441.

$ npx vitest run
 Test Files  5 passed (5)
      Tests  39 passed (39)
```

Também conferido por script contra `HEAD`: ids e gabaritos iguais nos três arquivos; `revisao.humano` = `null`; uma entrada nova em `revisao.agentes` em cada arquivo. Nenhum commit foi feito.
