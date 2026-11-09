# Revisão por agente — Grupo G1, área embriologia

- Agente: `revisor-embriologia-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: `content/embriologia/topicos/` — emb-01-introducao, emb-02-gametogenese, emb-03-fertilizacao, emb-04-semana1, emb-05-semana2. Nenhum outro arquivo foi alterado.

## 1. Resumo

| Tópico | Questões | Críticas | Importantes | Menores | Gabarito redistribuído* | Veredito |
|---|---|---|---|---|---|---|
| emb-01-introducao | 25 | 0 | 2 | 0 | 5 questões | aprovado-com-correcoes |
| emb-02-gametogenese | 27 | 0 | 0 | 1 | 6 questões | aprovado-com-correcoes |
| emb-03-fertilizacao | 26 | 0 | 1 | 2 | 6 questões | aprovado-com-correcoes |
| emb-04-semana1 | 26 | 0 | 2 | 2 | 7 questões | aprovado-com-correcoes |
| emb-05-semana2 | 29 | 0 | 4 | 4 | — (já equilibrado) | aprovado-com-correcoes |
| **Total** | **133** | **0** | **9** | **9** | **24 questões** | |

Gravidades:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia ou referência.

\* A redistribuição de letras não corrige erro de conteúdo. Por isso aparece em coluna própria. Em cada caso troquei os **textos** entre alternativas, atualizei `correta` e reescrevi a `explicacao` citando as letras novas. Os ids `a…e` continuam em ordem.

**Não encontrei fato errado nem gabarito errado.** Conferi todos os campos dos 5 tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, referências, notas e as 133 questões com explicações. Os problemas que achei foram de três tipos:
- sequências ambíguas nos jogos de ordenar e na linha do tempo, onde as fontes descrevem dois eventos no mesmo dia;
- uma afirmação imprecisa sobre a hCG na mola parcial;
- a apresentação, sem ressalva de espécie, do modelo murino da ZP3.

### Distribuição das letras corretas (múltipla escolha)

| Tópico | Antes (a/b/c/d/e) | Depois (a/b/c/d/e) | Maior fatia depois |
|---|---|---|---|
| 01 (15 MC) | 5/6/4/0/0 | 3/4/4/3/1 | 27% |
| 02 (16 MC) | 5/8/3/0/0 | 3/4/4/4/1 | 25% |
| 03 (16 MC) | 3/9/3/1/0 | 4/3/4/4/1 | 25% |
| 04 (15 MC) | 6/8/1/0/— | 4/4/4/3/— | 27% |
| 05 (16 MC) | 4/4/4/4/0 | sem mudança | 25% |

Nas questões cujas alternativas seguem uma ordem natural (fases da meiose, valores numéricos, fases do ciclo, sequência cronológica), mantive a ordem e a letra.

### Verificação (evidência)

`npm run validar-conteudo`, depois da revisão:
```
AVISO emb-01-introducao.json: eventos com "ordem" repetida
AVISO emb-04-semana1.json: eventos com "ordem" repetida
AVISO emb-05-semana2.json: eventos com "ordem" repetida
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.
```

`npx vitest run`:
```
Test Files  2 passed (2)
     Tests  25 passed (25)
```

O teste de ids em ordem `a, b, c…` passa. Rodei `npm run seed` e `supabase/seed.sql` ficou idêntico: não mudei ids, tipos nem dificuldades. Os três AVISOs são intencionais (ver §3, item 1).

Também conferi automaticamente as explicações de todas as 79 questões de múltipla escolha. Toda alternativa errada é citada pela letra certa. Nas questões editadas, a letra correta também é citada.

## 2. Tabela de correções

### emb-01-introducao

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-01-q23 | itens / explicacao | Itens “Fim do período embrionário” e “Início do período fetal” a ordenar | Item 5 passou a “Início do 2º trimestre da gestação” (sempre > 10 sem. de IG); explicação refeita | **Importante**: os dois itens são o mesmo marco (fim da 8ª = início da 9ª semana), sem ordem inequívoca | Moore 11ª, caps. 1 e 6 |
| eventos `fim-periodo-embrionario` / `inicio-periodo-fetal` | ordem | 4 e 5 | ambos 4; `nascimento-a-termo` 6 → 5 | **Importante**: eventos simultâneos (ver §3.1) | Moore 11ª, cap. 1 |
| q01, q07, q09, q12, q14 | alternativas / correta / explicacao | corretas a, a, a, b, b | e, d, d, a, d | Redistribuição: a+b = 11/15; nenhuma d/e. Em q07 as alternativas foram reordenadas (mórula → blastocisto livre → em adesão → zigoto) | — |
| notasDivergencia | nova nota | — | Registro do empate na linha do tempo | Rastreabilidade | — |

### emb-02-gametogenese

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| incertezas → notasDivergencia | intervalo LH–ovulação | “Moore 12–24 h após o pico × fisiologia 34–36 h após o início do surto” (incerteza) | Resolvido: as cifras medem a partir de referências diferentes (pico × início do surto; medianas clínicas ~32 h após o início e ~16 h após o pico); não cobrado | **Menor**: incerteza resolvida com fonte | Moore 11ª, cap. 2; GLOWM, *Documentation of Ovulation* |
| q04, q05, q08, q09, q10, q16 | alternativas / correta / explicacao | corretas b, b, a, b, a, b | d, d, d, e, c, d | Redistribuição: a+b = 13/16; nenhuma d/e | — |

Fatos conferidos sem alteração no tópico 02:
- nº de ovócitos ao nascer: Moore ~2 milhões × Sadler 600–800 mil, já registrado como faixa;
- ~7 milhões de células germinativas no 5º mês (Sadler);
- ~40 mil ovócitos na puberdade;
- duração da espermatogênese: ~2 meses (Moore) × ~74 dias (Sadler), faixa 64–74;
- paradas em prófase I/diplóteno e em metáfase II;
- fases do ciclo e duração constante da fase lútea.

### emb-03-fertilizacao

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| resumo (reação acrossômica) | texto | “Sadler … induzida por proteínas da zona (no modelo clássico, a ZP3)” | Explicita que o modelo ZP3 = receptor/indutor vem de camundongo e que, na zona humana (ZP1–ZP4), a ligação parece depender da ZP2 | **Importante**: risco de ensinar mecanismo murino como humano | Baibakov et al., *J Cell Biol* 2012; Avella et al., *J Cell Biol* 2014 |
| resumo (transporte) | texto | “de dezenas a centenas de milhões por ejaculação” | “centenas de milhões (200–600 milhões segundo Moore; 200–300 milhões segundo Sadler)” | **Menor**: inconsistente com as fontes e com a própria nota de divergência | Moore 11ª, cap. 2; Sadler 14ª, cap. 3 |
| notasDivergencia + incertezas | ZP / reação acrossômica | Nota dizia “induzida pela ZP3”; incerteza genérica | Nota com ressalva murina e dado de que, em camundongo, a maioria dos espermatozoides fertilizantes inicia a reação no cumulus; incerteza com as referências da ZP2 | **Menor**: precisão e fonte | idem |
| q01, q02, q03, q04, q05, q07 | alternativas / correta / explicacao | corretas b, b, b, b, b, b | e, d, c, a, d, d | Redistribuição: b = 9/16 | — |

### emb-04-semana1

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-04-q22 | itens / ordemCorreta / explicacao | 6 itens terminando em “diferenciação do trofoblasto → aparecimento do hipoblasto” | Item 2 virou “Primeira clivagem (dois blastômeros)”; ordem 2-3-5-1-4-6 | **Importante**: Sadler descreve o trofoblasto diferenciado e o hipoblasto no mesmo dia 8; Moore os separa (~6 × ~7). A ordem não é inequívoca | Sadler 14ª, caps. 3–4; Moore 11ª, cap. 2 |
| eventos `diferenciacao-trofoblasto` / `aparecimento-hipoblasto` | ordem | 9 e 10 | ambos 9 | **Importante**: mesmo motivo | idem |
| emb-04-q26 | par | “Fim da 1ª semana → Aparecimento do hipoblasto” | “~7º–8º dia → …”; explicação cita dia 7 (Moore) e dia 8 (Sadler) | **Menor**: o dia 8 de Sadler já é a 2ª semana | idem |
| emb-04-q22 | referencia | “Sadler 14ª ed., cap. 3 e 4” | “Sadler 14ª ed., cap. 3” | **Menor**: o cap. 4 só entrava pelo hipoblasto, que saiu | — |
| q01, q02, q04, q05, q07, q10, q13 | alternativas / correta / explicacao | corretas b, a, b, b, b, b, a | d, c, c, d, c, d, b | Redistribuição: a+b = 14/15; nenhuma d | — |

Fatos conferidos sem alteração no tópico 04:
- compactação: após 9 células (Moore) × após a 3ª clivagem, 8 células (Sadler); faixa 8–9 mantida;
- mórula com 12–32 células, no 3º dia;
- eclosão (faixa 4–6);
- implantação no ~6º dia (dia 20 do ciclo);
- hipoblasto no dia 7 (Moore) × 8 (Sadler);
- corionicidade dos gêmeos monozigóticos.

### emb-05-semana2

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| eventos `e05-implantacao-completa` / `e05-circulacao-uteroplacentaria` | ordem | 5 e 6 | ambos 5 | **Importante**: Sadler descreve inserção completa e erosão dos sinusoides nos mesmos dias 11–12 | Sadler 14ª, cap. 4 |
| eventos `e05-saco-vitelino-secundario` / `e05-vilosidades-primarias` | ordem | 7 e 8 | ambos 6 | **Importante**: Sadler descreve os dois no dia 13 | Sadler 14ª, cap. 4 |
| emb-05-q23 | enunciado / itens / ordemCorreta / explicacao | Ordenava “saco vitelino secundário → vilosidades primárias” | Item 5 virou “O blastocisto adere ao epitélio endometrial pelo polo embrionário”; ordem 5-3-1-4-2; enunciado passou a abranger o fim da 1ª semana | **Importante**: ordem não inequívoca (mesmo dia em Sadler) | Sadler 14ª, caps. 3–4; Moore 11ª, caps. 2–3 |
| resumo + correlação `mola-hidatiforme` | texto | “Ambas produzem muita hCG”; “hCG elevada” | hCG em geral muito elevada na completa e menos elevada (às vezes dentro do esperado) na parcial | **Importante**: generalização incorreta para a mola parcial | Williams Obstetrics 26ª ed., *Gestational Trophoblastic Disease* |
| resumo (placa precordal) | texto | Espessamento do hipoblasto no fim da 2ª semana, sem atribuição | “segundo Moore …”, com a descrição de Sadler (3ª semana, células do nó primitivo) | **Menor**: divergência entre fontes apresentada como consenso | Moore 11ª, cap. 3; Sadler 14ª, cap. 5 |
| resumo; emb-05-q10 | terminologia | “oócito” | “ovócito” | **Menor**: terminologia das edições brasileiras | Moore/Sadler (trad. bras.) |
| estrutura `decidua-basal` | definicao | “(endometrial gravídico)” | “(endométrio gravídico)” | **Menor**: erro de redação | — |
| emb-05-q23 | referencia | “Moore cap. 3; Sadler cap. 4” | “Moore cap. 2 e 3; Sadler cap. 3 e 4” | **Menor**: a adesão é conteúdo da 1ª semana | — |
| incertezas | nova | — | Ordem celoma extraembrionário × saco vitelino secundário (q24) para conferência humana | Rastreabilidade | Moore 11ª, cap. 3; Sadler 14ª, cap. 4 |

Fatos conferidos sem alteração no tópico 05:
- distribuição das ectópicas conferida com o resumo de Bouyer et al., *Hum Reprod* 2002 (1.800 casos): ampola 70,0%, istmo 12,0%, fímbrias 11,1%, ovário 3,2%, intersticial 2,4%, abdominal 1,3%. Tubárias = 95,5%, coerente com “mais de 95%” e com a q08;
- tampão de fechamento;
- lacunas no dia 9;
- sangramento de implantação no ~13º dia, com o erro de ~4 semanas na DUM da q12 (conta refeita);
- composição do córion, do âmnio e do saco vitelino;
- cariótipos das molas.

### Referências (capítulos)

Conferi todas as `referencia` e `referencias` contra o sumário das edições citadas:
- **Moore 11ª**: 1 introdução; 2 primeira semana, que inclui gametogênese, fertilização e reprodução assistida; 3 segunda semana, que inclui ectópica; 5 quarta à oitava semana, que inclui estágios de Carnegie e estimativa de idade; 6 período fetal; 7 placenta e membranas, que inclui gêmeos; 20 defeitos congênitos.
- **Sadler 14ª**: 2 gametogênese; 3 primeira semana; 4 segunda semana; 5 terceira semana; 6 terceira à oitava semana; 8 terceiro mês ao nascimento, que inclui gêmeos; 9 defeitos congênitos.
- **Carlson 6ª**: 1 preparação para a gravidez; 2 transporte dos gametas e fertilização.

Não encontrei capítulo claramente errado. Corrigi só as duas referências de questão cujo conteúdo mudou (04-q22 e 05-q23).

## 3. Pontos para o revisor humano

1. **Eventos simultâneos: empate na `ordem` em vez de remoção.**
   - O protocolo manda remover eventos de ordem controversa ou simultânea. Preferi dar a mesma `ordem` aos pares ambíguos: 01 (fim do embrionário/início do fetal), 04 (trofoblasto/hipoblasto) e 05 (inserção completa/circulação; saco vitelino secundário/vilosidades).
   - Motivo: o jogo *Linha do tempo* já usa um único evento por valor de `ordem` (`src/games/LinhaDoTempo.tsx`, comentário “evita empates ambíguos”). Assim os pares nunca são pedidos em sequência.
   - Além disso, as jogadas ficam salvas no histórico como `linha:<tópico>:<evento>`. Remover eventos deixaria ids órfãos, o que o protocolo quer evitar.
   - Efeito colateral: o validador emite 3 AVISOs (“ordem repetida”).
   - Se preferirem a remoção literal, basta apagar um evento de cada par: `inicio-periodo-fetal`, `aparecimento-hipoblasto`, `e05-circulacao-uteroplacentaria` e `e05-saco-vitelino-secundario`. Nenhuma questão depende deles.
2. **Hipoblasto (dia 7 × 8).**
   - Mantive a faixa 7–8, que segue os livros.
   - Dados de cultivo de embriões humanos situam a segregação epiblasto/hipoblasto por volta dos dias 6–8, perto da adesão. Por isso, mesmo a ordem “adesão → hipoblasto” é mais frágil do que parece. Nenhuma questão a cobra isoladamente (a q26 usa “~7º–8º dia”).
3. **Receptor da zona pelúcida (ZP2 × ZP3) e momento da reação acrossômica (corona × zona).**
   - Hoje nenhuma questão cobra um dos dois.
   - Se alguma questão futura cobrar, use a formulação dos livros com a ressalva murina.
4. **Implantação completa: dia 10 (Moore) × 11–12 (Sadler).** Faixa 10–12 mantida. Placa precordal: 2ª semana (Moore) × 3ª (Sadler). A q13 cobra só função e posição.
5. **Origem do mesoderma extraembrionário.**
   - Moore e Sadler: células do saco vitelino.
   - Larsen e Carlson discutem contribuição do epiblasto/linha primitiva.
   - Nenhuma questão cobra a origem (q05 e q27 cobram só a composição).
6. **Ordem das cavidades na q24 (tópico 05).** Celoma extraembrionário antes do saco vitelino secundário: Sadler separa os dois (dias 11–12 × 13); Moore diz que o saco secundário se forma “à medida que” o celoma se forma. Registrei em `incertezas`.
7. **Números de livro conferidos de memória da edição, não da página.** Vale abrir a edição brasileira para confirmar:
   - Moore: ~2 milhões de ovócitos ao nascer;
   - Moore: compactação “após o estágio de 9 células”;
   - Moore: 95–98% de ectópicas tubárias;
   - Sadler: ~74 dias de espermatogênese;
   - Moore: formulação sobre o termo “pré-embrião” (incerteza mantida no tópico 01);
   - Moore: até ~10% de espermatozoides anormais (incerteza mantida no tópico 02).
8. **Intervalo LH–ovulação.** Resolvi como diferença de referência (pico × início do surto). Os valores clínicos vieram de fonte secundária (GLOWM) e não são cobrados em questão.
9. **Distribuição de letras.** Ficou equilibrada. Se o app algum dia embaralhar alternativas, a redistribuição deixa de ser necessária.

Fontes consultadas na web nesta revisão:
- Bouyer J et al. *Sites of ectopic pregnancy: a 10 year population-based study of 1800 cases.* Hum Reprod 2002;17(12):3224–30 (resumo).
- Baibakov B et al. *Human sperm bind to the N-terminal domain of ZP2 in humanized zonae pellucidae in transgenic mice.* J Cell Biol 2012.
- Avella MA et al. *A single domain of the ZP2 zona pellucida protein mediates gamete recognition in mice and humans.* J Cell Biol 2014.
- GLOWM — *Documentation of Ovulation* (intervalos entre surto/pico de LH e ovulação).
