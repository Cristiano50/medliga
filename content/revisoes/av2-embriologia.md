# Revisão da camada avançada — embriologia (1ª etapa)

- **Agente:** `revisor-embriologia-avancado-v1` (professor titular de embriologia, revisor científico de 1ª etapa)
- **Data:** 2026-11-09
- **Escopo:** apenas a camada avançada recém-escrita (questões com a tag `avancado` no fim de cada arquivo) e as entradas novas em `referencias`, `notasDivergencia` e `incertezas`. As questões e os textos anteriores (resumo, pontos-chave, estruturas, eventos, correlações) **não** foram alterados: já passaram por duas etapas.
- **Protocolo:** `docs/protocolo-revisao-agentes.md`; especificação `docs/conteudo-schema.md`.

## 1. Resumo

| Tópico | Questões revisadas | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| emb-06-semana3 | q30–q34 (5) | 0 | 0 | 3 | aprovado-com-correcoes |
| emb-07-semanas4a8 | q30–q34 (5) | 0 | 1 | 0 | aprovado-com-correcoes |
| emb-08-periodo-fetal | q30–q34 (5) | 1 | 0 | 1 | aprovado-com-correcoes |
| emb-09-placenta-membranas | q31–q35 (5) | 0 | 0 | 2 | aprovado-com-correcoes |
| emb-10-malformacoes | q31–q35 (5) | 0 | 0 | 1 | aprovado-com-correcoes |
| **Total** | **25** | **1** | **1** | **7** | — |

Gravidade conforme o protocolo: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, referência, precisão de arredondamento, pista de comprimento.

Verificações estruturais feitas em todas as 25 questões (script em
`/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-av2/checks.py`): ids das
alternativas em `a, b, c, d` nessa ordem; `correta` existente e única; **todas** as letras citadas na
`explicacao`; `associar` com 3 a 6 pares e coluna direita sem repetição; `ordenar` com 4 a 7 itens e
`ordemCorreta` coerente; `dificuldade` 4 ou 5 e `bloom` `analisar`/`aplicar` em todas; nenhuma questão nova
duplica questão anterior do mesmo tópico (maior semelhança medida: 0,50, entre dois enunciados de
`ordenar` de formato igual e conteúdo distinto). Distribuição do gabarito por tópico depois da camada nova:
nenhuma letra passa de 29% (emb-06 26%, emb-07 29%, emb-08 26%, emb-09 29%, emb-10 25%) — abaixo do limite
de 40% do protocolo, sem necessidade de redistribuir.

Contas de idade refeitas uma a uma (idade gestacional = idade após a fertilização + ~2 semanas):

| Questão | Enunciado | Conta refeita | Resultado |
|---|---|---|---|
| emb-06-q30 | 5s4d de IG | 3s4d após a fertilização = **dia 25** | dentro da faixa adotada do neuroporo cranial (24–26); gabarito (b) correto |
| emb-07-q32 | CCN 9 mm, placas dos pés, pigmento retiniano, saliências auriculares, raios digitais sem entalhes | estágio 16 (8–11 mm; 37–42 dias) → IG 7s2d–8s0d | gabarito (b) correto; **erro encontrado no distrator (c)** (ver tabela 2) |
| emb-08-q31 | 24s3d de IG | ~22 semanas após a fertilização | conta correta; **premissa sobre surfactante errada** (ver tabela 2) |
| emb-08-q32 | 30 semanas de IG | ~28 semanas após a fertilização | correto |
| emb-10-q32 | 9 semanas de IG | ~7 semanas após a fertilização; tubo neural fechado nos dias 24–28 = IG 5s3d–6s0d | gabarito (b) correto; arredondamento ajustado |
| emb-10-q33 | 10 semanas de IG | ~8 semanas após a concepção | início da janela de 8–15 semanas pós-concepção; correto |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-08-q31 | `alternativas[c]` + `explicacao` | "Cerca de 22 semanas após a fertilização, **antes do início habitual da secreção de surfactante, que se dá por volta da 24ª semana**" | "Cerca de 22 semanas após a fertilização, **fim do período canalicular, com secreção de surfactante incipiente e insuficiente**"; explicação passa a citar a faixa de 20ª a 24ª semana e a dizer que a resposta não depende da data exata | a alternativa correta dependia de uma data contestada: `emb-14-respiratorio` registra que **Moore (cap. 10) situa o início por volta da 20ª semana após a fertilização** e adota a faixa 20ª–24ª, e `emb-14-q25` descreve 24 semanas de IG como fim do período canalicular com surfactante **já iniciado, porém mínimo**. Um aluno que estudasse o emb-14 marcaria outra alternativa. Gabarito permanece (c) | **crítica** (sem mudança de gabarito) | Moore 11ª ed., cap. 6 e 10; coerência interna com `emb-14-respiratorio` (`notasDivergencia[0]` e `[3]`, `pontosChave[8]`, q25) |
| emb-07-q32 | `alternativas[c]` | "44 a 48 dias após a fertilização (7ª semana), ou cerca de **9 semanas** de IG" | "… ou cerca de **8 a 9 semanas** de IG" | conversão errada em questão cujo objeto é justamente a conversão: 44–48 dias + 14 = 58–62 dias = 8s2d–8s6d. O distrator continua inequivocamente errado pela morfologia (estágio 18) | **importante** | Moore 11ª ed., cap. 5 (Tabela 5-1), faixa adotada no tópico |
| emb-06-q30 | `alternativas[b]` | "Fechamento do neuroporo cranial; sua falha causa anencefalia" (60 caracteres) | "Fechamento do neuroporo cranial **no polo rostral**; sua falha causa anencefalia" (76) | pista de comprimento: a correta era 26% mais curta que a média dos distratores (81) | menor | protocolo (pistas involuntárias) |
| emb-06-q30 | `explicacao` | dias 15 a 17 = "cerca de **4 semanas e meia** de IG" | dias 15 a 17 = "**pouco mais de 4 semanas** de IG" | 15–17 dias + 14 = 4s1d–4s3d; "4 semanas e meia" descreve só o topo da faixa | menor | conversão do próprio tópico |
| emb-06-q32 | `contexto` | "A **biópsia retal** mostra ausência de células ganglionares nos plexos submucoso e mioentérico" | "A **biópsia retal de espessura total** mostra …" | precisão e coerência com `emb-15-q13`, corrigida na 2ª etapa daquele tópico porque a **biópsia por sucção alcança apenas mucosa e submucosa** e não avalia o plexo mioentérico. Sem o qualificador, o aluno lê uma contradição entre os dois tópicos | menor | `emb-15-digestorio` (`correlacoesClinicas[9]`, q13 e notas da 2ª etapa) |
| emb-09-q31 | `explicacao` | "a transfusão feto-fetal é **exclusiva** das monocoriônicas" | "… é **praticamente exclusiva** das monocoriônicas" | afirmação absoluta não sustentável (relatos raros em placentas dicoriônicas fundidas); a alternativa correta (b), que diz "não é esperada", já era adequadamente cautelosa | menor | Moore 11ª ed., cap. 7; Sadler 14ª ed., cap. 8 |
| emb-09-q32 | `explicacao` | "A (a) está errada: **nem** o afinamento da membrana … torna a membrana permeável à IgM" | "A (a) está errada: o afinamento da membrana … **não a torna** permeável à IgM **em nenhum momento da gestação**" | "nem" sem segundo termo deixava a refutação de (a) ambígua em português | menor | redação |
| emb-10-q32 | `explicacao` | tubo neural fechado nos dias 24–28 = "≈**6 semanas** de IG" | "≈**5,5 a 6 semanas** de IG" | 24–28 dias + 14 = 38–42 dias = 5s3d–6s0d | menor | faixas adotadas em `notasDivergencia` do tópico |
| emb-08 | `notasDivergencia` (entrada nova) | — | registro do conflito entre emb-08 ("≈24ª semana", Moore cap. 6) e emb-14 ("≈20ª semana", Moore cap. 10; faixa 20ª–24ª), com a observação de que q31 foi reescrita para não depender da data | divergência entre tópicos do mesmo módulo, que o revisor humano precisa resolver com os livros à mão | — | protocolo, item `notasDivergencia` |

Nenhum id foi alterado, nenhuma questão precisou ser reescrita por inteiro, nenhum gabarito mudou de letra
e `revisao.humano` segue `null` nos cinco arquivos.

### Pontos de atenção do pedido, conferidos sem correção

- **emb-08-q30 (cfDNA com gemelar evanescente):** correto — DNA fetal livre é de origem placentária, é
  rastreamento e o gemelar que morreu continua liberando DNA; confirmação invasiva obrigatória. Coerente com
  `emb-08-q19` e com a incerteza já registrada sobre a janela de ~10 semanas. (Só houve ajuste de comprimento
  da alternativa (d), 20% mais curta que a média dos distratores.)
- **emb-08-q34 (RCIU simétrica precoce):** correto — restrição proporcional precoce com líquido amniótico e
  Doppler umbilical normais aponta causa intrínseca e indica exame diagnóstico; o distrator (a) inverte o
  padrão da insuficiência uteroplacentária, (c) contraria a hierarquia da datação pelo CCN do 1º trimestre.
  A divergência "simétrica × assimétrica" versus "precoce × tardia" já estava registrada e é citada na
  explicação.
- **emb-09-q31 (sinal do lambda):** correto — membrana espessa, sinal do lambda e duas massas placentárias
  definem dicorionicidade; a ultrassonografia determina corionicidade, não zigosidade; (d) transforma
  possibilidade em certeza e ainda erra a janela (divisão entre o 4º e o 8º dia dá monocoriônica).
- **emb-09-q32 (IgG × IgM):** correto — IgG por transcitose mediada por receptor no sinciciotrofoblasto, IgM
  não atravessa; coerente com `pontosChave[7]`, q07 e q17 do tópico. O distrator (b) é refutado pelo fato de
  o sinciciotrofoblasto produzir hormônios (hCG, progesterona, estrogênios, somatomamotrofina), não
  imunoglobulinas.
- **emb-09-q35 (dupla bolha e citogenética):** correto — deglutição de até ~400 mL/dia (valor já adotado nas
  estruturas e correlações do tópico), obstrução duodenal, polidrâmnio, e indicação de estudo citogenético
  reforçada pela translucência nucal aumentada; a proporção de trissomia 21 ficou qualitativa, com incerteza
  registrada.
- **emb-10-q31 (DTN e ácido fólico em dose alta):** segue a dose já adotada no conteúdo — **4 a 5 mg/dia**,
  iniciada pelo menos 30 dias antes da concepção — e o rastreamento com alfafetoproteína de 15 a 20 semanas,
  coerentes com `pontosChave[11]`, `correlacoesClinicas[9]`, q15 e q28. A pendência 4 mg (FEBRASGO) × 5 mg
  (Ministério da Saúde) continua registrada em `notasDivergencia` e é do revisor humano.
- **emb-10-q32 (valproato com 9 semanas):** correto — tubo neural já fechado, suplementação agora não previne
  o defeito; a explicação mantém a conduta dentro do que é consensual (avaliação morfológica dirigida, revisão
  do esquema com o neurologista, prejuízo cognitivo dose-dependente, não suspender por iniciativa da
  paciente) e atribui corretamente ao distrator (d) a assinatura da talidomida (dias 20 a 36).
- **emb-10-q33 (radiação diagnóstica):** correto, inclusive a conversão (10 semanas de IG ≈ 8 semanas após a
  concepção, início da janela de 8 a 15 semanas pós-concepção do sistema nervoso central). Os limiares de dose
  permanecem **qualitativos** ("muito abaixo dos limiares associados a malformações"), sem número e sem citar
  diretriz — coerente com a incerteza já registrada no tópico, que menciona limiares da ordem de algumas
  dezenas de mGy com variação entre diretrizes. Nenhuma conduta excepcional é endossada.
- **emb-10-q35 (fenilcetonúria materna):** correto — fenilalanina atravessa a placenta e atinge no feto
  concentrações superiores às maternas; feto em regra heterozigoto; prevenção por controle dietético
  pré-concepcional; herança autossômica recessiva.
- **Divergência da gastrosquise (Moore × Sadler):** emb-07-q30 e emb-07-q34 nomeiam explicitamente a
  atribuição de Moore (fechamento incompleto das pregas laterais na 4ª semana), a explicação diz que o
  mecanismo é debatido e a nota de divergência nova reproduz a redação já usada em `emb-15-digestorio`
  (Sadler: enfraquecimento da parede à direita pela involução da veia umbilical direita; terceira hipótese:
  ruptura vascular local). Coerente entre os três tópicos.
- **Divergência da classificação da RCIU:** registrada em `notasDivergencia` de emb-08 e citada na própria
  explicação de q34; `emb-08-q13` (assimétrica, 32 semanas) e q34 (simétrica, 20 semanas) usam o mesmo par
  conceitual sem se contradizer.
- **Sobreposição de temas:** a Hirschsprung de emb-06-q32 é coerente com `emb-15-digestorio` (colonização
  craniocaudal, segmento distal contraído, colo proximal dilatado) e com o tópico novo
  **`emb-22-crista-neural`** (criado por outro agente durante esta revisão), que descreve a mesma falha de
  colonização, a origem vagal e o gene RET; as três abordagens são complementares (3ª semana/derivados,
  cirurgia neonatal, neurocristopatia e genes), sem contradição. O melanócito de emb-06-q34 (via de migração
  até a epiderme) também é coerente com a via dorsolateral descrita em `emb-22`.
- **Cenários experimentais (emb-06-q31, emb-07-q31):** ambos declaram na explicação que o experimento é de
  modelo animal e têm incerteza registrada sobre a extrapolação ao ser humano — procedimento correto para um
  jogo de estudo.

## 3. Pontos para o revisor humano

1. **Início da secreção de surfactante (prioridade).** Há conflito entre dois tópicos já aprovados nas
   etapas anteriores: `emb-08` adota "≈24ª semana após a fertilização" atribuída a Moore cap. 6 (e repete o
   valor em `pontosChave[7]`, `estruturas`, `eventos` e correlações), enquanto `emb-14` registra "≈20ª
   semana" atribuída a Moore cap. 10 e adota a faixa de 20ª a 24ª semana. Não alterei o texto anterior
   (fora do escopo) e reescrevi emb-08-q31 para não depender da data. **Conferir o número nas duas obras e
   harmonizar emb-08 e emb-14** — enquanto isso, qualquer questão nova sobre o tema deve usar a faixa.
2. **Tabela 5-1 de Moore (idades e CCN por estágio de Carnegie).** Pendência herdada da 1ª etapa do emb-07 e
   agora também base de emb-07-q32 (estágio 16 = 8–11 mm, 37–42 dias). Conferência direta na obra ainda
   pendente; as tabelas de O'Rahilly & Müller dão idades diferentes.
3. **Ácido fólico em dose alta: 4 mg (FEBRASGO) × 5 mg (Ministério da Saúde).** emb-10-q31 usa a faixa "4 a
   5 mg/dia" já adotada. Escolher a dose única a adotar no app é decisão clínica do revisor humano.
4. **Limiares de dose de radiação ionizante (emb-10-q33).** O conteúdo é deliberadamente qualitativo. Se o
   revisor quiser um número (ex.: o limiar habitualmente citado em diretrizes de obstetrícia), ele precisa
   vir com a diretriz nomeada e sua edição vigente, e a questão deve citá-la na `referencia`.
5. **Arredondamento do fechamento do tubo neural em idade gestacional.** emb-10-q15 (já aprovada) diz "por
   volta de 6 semanas"; emb-10-q32 passou a "≈5,5 a 6 semanas". Ambas defensáveis; harmonizar se quiser uma
   só formulação no módulo.
6. **Risco de recorrência dos defeitos do tubo neural (emb-10-q31).** Mantido sem número, apenas "supera o
   da população geral e fica abaixo do de uma doença monogênica" (incerteza registrada). Se o revisor aceitar
   os 2–5% habitualmente citados, a explicação pode ganhar o valor com a fonte.
7. **Redundância tolerada:** o sinal do lambda aparece em emb-09-q31 (vinheta completa) e como um dos cinco
   pares de emb-09-q34. Não é erro e o jogo sorteia questões, mas vale a decisão editorial de manter ou
   trocar o par.
8. **Verificação de fontes limitada neste ambiente.** As obras-base (Moore 11ª ed., Sadler 14ª ed.,
   Thompson & Thompson 8ª ed.) não estão disponíveis nesta sessão e o acesso à rede está restrito (as buscas
   confirmaram apenas a existência da divergência sobre o surfactante — ~20 semanas para o aparecimento dos
   corpos lamelares, ~24 para a secreção —, sem acesso ao texto das obras). A conferência página a página dos
   números continua pendente, como já registrado nas incertezas dos tópicos.

## 4. Evidência de execução

Depois das correções, em 2026-11-09:

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

O teste do modelo 3D `septacao-cardiaca`, que o pedido autorizava ignorar, **não falhou** nesta execução:
a suíte passou inteira (47/47). Nada foi ignorado.

Pistas de comprimento depois das correções (razão entre o tamanho da alternativa correta e a média dos
distratores), nas 20 questões novas de múltipla escolha: entre **0,88 e 1,06** — as duas fora da faixa
(emb-06-q30, 0,74; emb-08-q30, 0,80) foram corrigidas.

Arquivos alterados nesta revisão: os cinco tópicos do escopo (`emb-06-semana3`, `emb-07-semanas4a8`,
`emb-08-periodo-fetal`, `emb-09-placenta-membranas`, `emb-10-malformacoes`) e este relatório. Nenhum commit
foi feito. `revisao.humano` permanece `null` nos cinco arquivos.
