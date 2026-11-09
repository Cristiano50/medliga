# Revisão H2: histologia (tópicos 5 a 7)

- Agente: `revisor-histologia-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`, seção "Histologia". Obras-base: Junqueira & Carneiro 14ª ed.; Ross & Pawlina 8ª ed.
- Arquivos: `content/histologia/topicos/his-05-adiposo.json`, `his-06-cartilagem.json`, `his-07-osso.json`
- `revisao.humano` não foi tocado e continua `null` nos três arquivos. Nenhum id foi alterado. Nenhum arquivo fora do H2 foi editado; `content/histologia/laminas.json` foi só lido.

## 1. Resumo

Revisei os três tópicos por inteiro: objetivos, resumo, pontos-chave, estruturas, eventos, correlações clínicas, 79 questões, referências, notas de divergência e incertezas. O conteúdo veio de boa qualidade:
- nenhum gabarito errado;
- nenhuma questão com mais de uma alternativa defensável;
- nenhuma ordenação ambígua.

As correções são de precisão e terminologia.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-05 Tecido adiposo | 26 (14 MC, 6 V/F, 4 ordenar, 2 associar) | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| his-06 Tecido cartilaginoso | 26 (15 MC, 6 V/F, 3 ordenar, 2 associar) | 0 | 0 | 4 | 4 | aprovado-com-correcoes |
| his-07 Tecido ósseo | 27 (16 MC, 6 V/F, 3 ordenar, 2 associar) | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **79** | **0** | **0** | **8** | **8** | |

Escala de gravidade:
- **Crítica:** fato errado ou gabarito errado.
- **Importante:** ambiguidade, distrator defensável ou explicação incorreta.
- **Menor:** redação, terminologia, precisão ou referência.

Checagens automáticas (script):
- Em toda questão de múltipla escolha, a explicação cita a letra da alternativa correta e de cada distrator.
- Letras corretas: his-05 a3/b4/c4/d3; his-06 a4/b3/c4/d4; his-07 a4/b4/c4/d4. Nenhuma passa de 40%, então não houve redistribuição.
- Cada tópico tem pelo menos 3 questões com `contexto` (6, 8 e 9).

### Pontos de atenção do redator, conferidos

- **Matriz capsular, territorial e interterritorial (Junqueira × Ross).**
  - O conteúdo usa só a divisão territorial (mais basófila, mais proteoglicanos) × interterritorial, comum às duas obras e à lâmina do microscópio. Isso está correto.
  - A nota de divergência foi refinada: "cápsula", sinônimo descritivo da matriz territorial em textos brasileiros, não é a "matriz capsular" (pericelular) de Ross (correção 6).
- **Origem dos grupos isógenos ("condroblasto" em Junqueira).**
  - O conteúdo diz "uma única célula cartilaginosa". Isso é compatível com Junqueira ("um único condroblasto"), com Ross e com a lâmina (`laminas.json`: "mesmo condroblasto", 2 a 8 células).
  - No his-06-q03 o aluno que segue Junqueira escolhe a mesma alternativa. Sem correção; a nota de divergência agora cita a lâmina.
- **Crescimento intersticial ao longo da vida.** Nenhum item cobra quando ele cessa. A nota registra a divergência: para Junqueira, ele acontece quase só nas fases iniciais; Ross diz que continua nas placas epifisárias e na cartilagem articular. Correto.
- **Fibrocartilagem.** O conteúdo diz "tipo I predominante" e a nota registra que Ross descreve os tipos I e II. O his-06-q07 cobra "fibrocartilagem; colágeno tipo I", sem ambiguidade.
- **Núcleo pulposo.**
  - A origem notocordal está correta e é a única coisa cobrada (his-06-q19).
  - A composição não é cobrada: Junqueira fala em líquido viscoso rico em ácido hialurônico com pouco colágeno II; outras obras, em agrecano e água.
  - No his-06-q13, a alternativa (b) inverte anel e núcleo e é claramente errada.
- **Nomes das zonas da placa epifisária.**
  - Junqueira: repouso, proliferação (cartilagem seriada), hipertrofia, cartilagem calcificada, ossificação.
  - Ross: reserva, proliferação, hipertrofia, cartilagem calcificada, reabsorção.
  - A ordem é a mesma nas duas obras. Acrescentei "(reserva)" para quem estuda por Ross (correção 8).
- **Colar ósseo × hipertrofia dos condrócitos.** Junqueira descreve os dois ao mesmo tempo ("enquanto se forma o colar ósseo…"). O conteúdo já trata isso corretamente:
  - os eventos `his07-colar-osseo` e `his07-hipertrofia-calcificacao` têm a mesma `ordem` (2);
  - o colar ficou fora do his-07-q24;
  - a explicação do his-07-q24 menciona a simultaneidade.
- **Calo ósseo.**
  - Sequência do his-07-q25: hematoma → remoção de restos e proliferação de osteoprogenitoras → calo mole (conjuntivo e cartilagem) → calo ósseo (osso primário) → remodelação em osso lamelar.
  - É compatível com Junqueira (cartilagem, ossificação intramembranosa e endocondral no foco; o calo ósseo é de osso primário) e com Ross (calo mole e calo duro). Sem ambiguidade.
- **Gordura parda no adulto.**
  - O conteúdo diz que ela persiste em pequenos depósitos (cervical, supraclavicular, paravertebral, perirrenal), detectáveis por PET-CT após exposição ao frio. Isso segue Ross e é compatível com a descrição clássica de Junqueira ("quantidade muito reduzida no adulto").
  - O his-05-q18 é inequivocamente falso, e o his-05-q14 (PET-CT) está correto.
- **Papel da calcitonina.** Ela vem das células parafoliculares (C) da tireoide, age diretamente em receptores dos osteoclastos e inibe a reabsorção; seu papel fisiológico no adulto é pequeno (Guyton). O his-07-q22 é inequivocamente falso.
- **Osteocalcina.**
  - É produzida pelo osteoblasto, depende de vitamina K e liga cálcio. Como marcador de formação, não tem especificidade absoluta: também é liberada da matriz durante a reabsorção (já registrado em incertezas).
  - O his-07-q03 tem uma única resposta defensável (osteoblasto).
- **Capítulos citados de memória (Junqueira 6, 7 e 8; Ross 9, 7 e 8).**
  - Não consegui conferir. A busca não achou o sumário da 14ª ed. de Junqueira nem o da 8ª ed. de Ross, e as páginas das editoras e de outros sites foram bloqueadas pela rede desta sessão.
  - Um programa de disciplina (MEFST) lista Adiposo 6, Cartilagem 7, Osso 8, numeração compatível com Junqueira.
  - Para Ross, as fontes encontradas citam cartilagem 7, osso 8 e adiposo 9 em edições anteriores (6ª/7ª). Não confirmei se a 8ª ed. reorganizou os capítulos.
  - A numeração foi mantida, igual à dos outros tópicos de histologia do projeto, e a pendência ficou registrada em `incertezas` de cada tópico.

### Coerência com as lâminas do microscópio (`laminas.json`)

- **Tecido adiposo unilocular:** `adipocito-unilocular`, `septo-conjuntivo` e `capilar` batem com o tópico (anel de sinete, lipídio extraído por álcool e xilol, Sudan em cortes por congelação).
- **Cartilagem hialina:**
  - `condrocito`, `lacuna` (espaço por retração), `grupo-isogeno` (2 a 8 células de uma mesma célula; o tópico diz "até cerca de oito"), `matriz-territorial` e `matriz-interterritorial` (mais e menos basófila) e `pericondrio` (camada interna origina condroblastos) batem com o tópico.
  - A ordem das camadas no his-06-q23 corresponde à descrição da lâmina.
- **Osso compacto (desgaste):**
  - `osteon`, `canal-de-havers`, `lamelas-concentricas`, `canaliculos`, `canal-de-volkmann` e `lamelas-intersticiais` batem com o tópico.
  - Na lâmina, `osteocito` aparece como "Lacuna de osteócito"; a definição do tópico menciona as lacunas escuras no desgaste. Compatível.
- **Ponto de arquitetura (não corrigido, porque os ids não podem mudar):** o id canônico `lacuna` designa a lacuna do condrócito (lâmina e his-06), mas o his-07 o usa para a lacuna do osteócito. Hoje não causa erro: o microscópio usa as estruturas da própria lâmina, e o registro global `estruturas()` só é consultado pelo laboratório 3D de embriologia. Ficou registrado em `incertezas` do his-07.

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | his-05-adiposo (resumo); his-05-q19 (explicacao); his-05-q24 (item 4 e explicacao); notasDivergencia | texto | "noradrenalina atua em receptores **β3**-adrenérgicos" | "receptores **β**-adrenérgicos"; nota de divergência nova | O β3 é dado de roedores e livros-texto; em humanos o subtipo predominante no tecido pardo é debatido (há evidência de β2). A forma genérica é verdadeira nas duas fontes. A ordem do his-05-q24 não muda. | menor | Ross 8ª ed., tecido adiposo; Blondin DP et al. Cell Metab 2020;32:287–300 |
| 2 | his-05-adiposo / `lipossarcoma` | correlacoesClinicas.descricao | "bem diferenciado tem atipia… **e lipoblastos**… e MDM2" | Células atípicas hipercromáticas nos septos, **às vezes** lipoblastos (não obrigatórios) e amplificação de MDM2, "**o achado mais específico**" | Lipoblastos não são necessários ao diagnóstico do lipossarcoma bem diferenciado; a amplificação de MDM2 é o marcador | menor | OMS, Soft Tissue and Bone Tumours, 5ª ed., 2020; Robbins 10ª ed. |
| 3 | his-05-q12 | explicacao | "Lipoblastos e MDM2… sustentam" | MDM2 por FISH é o achado mais específico; lipoblastos reforçam quando presentes, sem ser obrigatórios | Mesma razão da correção 2. Gabarito (a) mantido: é a única alternativa que distingue lipossarcoma de lipoma. | menor | Idem |
| 4 | his-06-cartilagem | resumo | "condrossarcoma… típico do **esqueleto axial** de adultos" | "típico de adultos (em geral **a partir dos 40 anos**) e das **porções centrais do esqueleto** (pelve, cintura escapular, costelas)" | Pelve e cintura escapular pertencem ao esqueleto apendicular, não ao axial; Robbins fala em "porções centrais do esqueleto" | menor | Robbins 10ª ed., tumores formadores de cartilagem; Terminologia Anatômica (cinturas no esqueleto apendicular) |
| 5 | his-06-cartilagem / `condrossarcoma` (+ incertezas) | correlacoesClinicas.descricao | "em geral a partir da **4ª década**, sobretudo no **esqueleto axial** (pelve, **ombro**, costelas)" | "em geral **a partir dos 40 anos**, sobretudo nas **porções centrais do esqueleto** (pelve, cintura escapular, costelas)" | "4ª década" significa 30–39 anos; a obra citada (Robbins) diz 40 anos ou mais. Também corrige "esqueleto axial". | menor | Robbins 10ª ed. |
| 6 | his-06-cartilagem / notasDivergencia (zonas da matriz) e grupos isógenos | notasDivergencia | Ross: matriz capsular dentro da territorial | Acrescentado: a capsular é a mais basófila; "cápsula" (sinônimo da territorial em textos brasileiros, mantido em `sinonimos`) ≠ "matriz capsular" de Ross. Na nota dos grupos isógenos: compatível com a lâmina ("mesmo condroblasto") | Evitar que o aluno confunda o sinônimo "cápsula" com a zona pericelular de Ross | menor | Ross 8ª ed., cartilagem; Junqueira 14ª ed., cap. 7; `laminas.json` |
| 7 | his-06-cartilagem / `fibras-colagenas` | estruturas.nome, definicao | Nome "Fibras colágenas (tipo I) da fibrocartilagem" | Nome canônico "Fibras colágenas"; a definição diz que, na fibrocartilagem, são feixes de colágeno I acidófilos e que, na hialina e na elástica, o colágeno II forma fibrilas finas não visíveis no HE | Alinhar ao nome da lâmina de conjuntivo para o mesmo id canônico, sem perder o conteúdo | menor | `laminas.json`; `docs/conteudo-schema.md` |
| 8 | his-07-osso (resumo; `placa-epifisaria`; his-07-q23 item 2; notasDivergencia) | texto | "Zona de repouso" | "Zona de repouso (reserva)"; no resumo, também "proliferação (ou cartilagem seriada)" | Ross chama a zona de "reserva" e Junqueira chama a proliferação de "cartilagem seriada"; com os dois nomes, quem estudou pela outra obra não se confunde. A ordem não muda. | menor | Junqueira 14ª ed., cap. 8; Ross 8ª ed., osso |

Registro em `revisao.agentes` dos três tópicos:
- `{"area": "histologia", "agente": "revisor-histologia-v1", "data": "2026-11-09", "veredito": "aprovado-com-correcoes", …}`
- Contagens nas notas: his-05, 3 menores; his-06, 4 menores; his-07, 1 menor.

## 3. Pontos para o revisor humano

1. **Números de capítulo.**
   - Conferir no sumário: Junqueira 14ª ed. (6 adiposo, 7 cartilaginoso, 8 ósseo, 1 métodos) e Ross 8ª ed. (9 adiposo, 7 cartilagem, 8 osso).
   - Não consegui confirmar se a 8ª ed. de Ross manteve a numeração da 7ª. A pendência vale também para os outros tópicos de histologia, que usam a mesma numeração (Ross 10 sangue, 11 muscular, 12 nervoso).
2. **Redação de Junqueira citada de memória.** Conferir:
   - "grupos isógenos originados de um único condroblasto" e "até oito células";
   - crescimento intersticial "quase só nas fases iniciais";
   - núcleo pulposo como "líquido viscoso rico em ácido hialurônico";
   - "quantidade muito reduzida" de tecido pardo no adulto;
   - glicólise anaeróbia dos condrócitos (his-06-q20);
   - em que capítulo está a descrição do disco intervertebral (cartilagem ou articulações).
3. **Cartilagem elástica e calcificação (his-06-q17, falso).** A afirmação segue Ross. Junqueira diz só "menos sujeita a processos degenerativos". As duas fontes são compatíveis com o gabarito, mas convém confirmar a frase de Ross na 8ª ed.
4. **Subtipo β do tecido pardo.** O conteúdo passou a dizer só "β-adrenérgicos" (correção 1). Se o curso preferir ensinar "β3", como muitos livros-texto, decidir e registrar.
5. **Robbins 10ª ed.**
   - Conferir a faixa etária do condrossarcoma ("40 anos ou mais") e a redação sobre lipoblastos e MDM2 no lipossarcoma bem diferenciado.
   - Conferir os títulos de capítulo em português ("tumores de partes moles" ou "de tecidos moles").
6. **Neonatologia (his-05-q10 e correlação de hipotermia).** Duas afirmações vêm da literatura de neonatologia, não das obras de histologia: o prematuro tem menos tecido pardo, e o tremor é pouco eficaz no recém-nascido. Conferir em tratado de pediatria; a incerteza do redator foi mantida.
7. **Sinônimo "cápsula" da matriz territorial.** Foi mantido em `sinonimos`, com a ressalva na nota de divergência. Se o jogo usar sinônimos para aceitar respostas, avaliar se é melhor retirá-lo para não colidir com a "matriz capsular" de Ross.
8. **Id `lacuna`.** Ele designa a lacuna do condrócito no his-06 e na lâmina, e a do osteócito no his-07. Hoje é inofensivo, mas é uma decisão de arquitetura: criar ids separados exigiria mudar ids, o que este protocolo não permite ao revisor.
9. **Critérios fora das obras de histologia.**
   - T-score ≤ −2,5 (OMS).
   - Papel fisiológico pequeno da calcitonina (Guyton, cap. 80, a conferir na 14ª ed.).

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441.

$ npx vitest run
 Test Files  5 passed (5)
      Tests  39 passed (39)
```

Nada foi commitado.
