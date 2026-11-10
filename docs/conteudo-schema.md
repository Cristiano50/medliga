# Especificação do conteúdo (v1)

Todo conteúdo didático do jogo é **dado** (JSON), separado do código. Cada disciplina tem uma pasta em `content/<disciplina>/`. O código valida tudo com Zod (`src/content/schema.ts`) no build; arquivo inválido quebra o build.

Idioma: português do Brasil, terminologia das traduções brasileiras de referência (Moore — *Embriologia Clínica*; Sadler — *Langman Embriologia Médica*) e da *Terminologia Embryologica* (FIPAT). Use "dias após a fertilização" para idade embrionária e diga explicitamente quando falar em idade gestacional (DUM ≈ idade embrionária + 2 semanas).

## Regras de rigor (obrigatórias)

1. Todo fato deve ser compatível com pelo menos uma obra de referência listada em `referencias` do tópico, com capítulo. Obras-base de embriologia:
   - Moore KL, Persaud TVN, Torchia MG. *Embriologia Clínica*. 11ª ed. Rio de Janeiro: GEN Guanabara Koogan; 2020. (orig. *The Developing Human*, 11th ed., 2019)
   - Sadler TW. *Langman Embriologia Médica*. 14ª ed. Rio de Janeiro: GEN Guanabara Koogan; 2021. (orig. *Langman's Medical Embryology*, 14th ed., 2018)
   - Schoenwolf GC et al. *Larsen Embriologia Humana*. 5ª ed. Elsevier; 2016.
   - Carlson BM. *Embriologia Humana e Biologia do Desenvolvimento*. 6ª ed. Elsevier; 2020.
   - Moore KL, Persaud TVN, Torchia MG. *Before We Are Born*. 10th ed. 2020 (ou ed. brasileira *Embriologia Básica*).
2. Onde as obras divergem (ex.: dia exato de fechamento dos neuroporos, estágio de Carnegie de um evento), **dê a faixa** e registre em `notasDivergencia`.
3. Não invente números (prevalências, tamanhos, dias). Se não tiver certeza, omita ou registre em `incertezas` do tópico.
4. Questão de múltipla escolha: **uma única alternativa correta inequívoca**; distratores plausíveis e do mesmo tipo; nada de "todas as anteriores"/"nenhuma das anteriores"; a `explicacao` diz por que a correta está certa e por que cada distrator está errado.
5. Nada de pegadinha de redação. Dificuldade 1 (definição) a 5 (integração/caso clínico complexo).
6. O agente **nunca** preenche `revisao.humano`. Esse campo é exclusivo do médico revisor.

## Arquivo de tópico — `content/<disciplina>/topicos/<id>.json`

```jsonc
{
  "id": "emb-03-fertilizacao",            // kebab-case, prefixo da disciplina + ordem
  "disciplina": "embriologia",
  "ordem": 3,
  "titulo": "Fertilização",
  "subtitulo": "Do transporte dos gametas ao zigoto",
  "periodo": {                            // opcional; período do desenvolvimento coberto
    "diaInicio": 0, "diaFim": 1,          // dias após a fertilização (pode ser negativo p/ gametogênese = omitir)
    "carnegie": [1]                       // estágios de Carnegie cobertos (pode ser [])
  },
  "objetivos": ["Descrever ...", "Explicar ..."],      // objetivos de aprendizagem (verbos de Bloom)
  "resumo": "Markdown simples (parágrafos, **negrito**, listas). 300–900 palavras. Conteúdo de estudo do tópico.",
  "pontosChave": ["frase curta e verificável", "..."],  // 6–12 itens
  "estruturas": [
    {
      "id": "zona-pelucida",               // usar IDs canônicos (ver lista abaixo) quando existirem
      "nome": "Zona pelúcida",
      "sinonimos": [],
      "definicao": "1–3 frases.",
      "origem": "opcional: de onde deriva",
      "destino": "opcional: o que forma / quando desaparece"
    }
  ],
  "eventos": [                             // para jogos de linha do tempo
    { "id": "reacao-acrossomica", "descricao": "Reação acrossômica", "diaMin": 0, "diaMax": 0, "ordem": 2 }
    // "ordem" = posição relativa dentro do tópico (inteiro crescente). diaMin/diaMax opcionais.
  ],
  "correlacoesClinicas": [
    { "id": "gravidez-ectopica", "titulo": "Gravidez ectópica", "descricao": "...", "mecanismo": "base embriológica" }
  ],
  "questoes": [ /* ver tipos abaixo; 18–30 por tópico */ ],
  "referencias": [
    { "obra": "Moore, Persaud, Torchia. Embriologia Clínica, 11ª ed., 2020", "capitulo": "2 — Primeira semana do desenvolvimento humano" }
  ],
  "notasDivergencia": ["Moore: neuroporo rostral fecha ~dia 25; Sadler: dia 25 ... (faixa adotada: 24–26)"],
  "incertezas": [],
  "revisao": { "autor": "agente-redator-embriologia", "data": "AAAA-MM-DD", "agentes": [], "humano": null }
}
```

## Tipos de questão

Campos comuns: `id` (único global, ex. `emb-03-q07`), `tipo`, `enunciado`, `explicacao`, `dificuldade` (1–5), `bloom` (`lembrar` | `compreender` | `aplicar` | `analisar`), `tags` (array), `referencia` (string curta, ex. "Moore 11ª ed., cap. 2").

```jsonc
// múltipla escolha (4 ou 5 alternativas). "contexto" opcional = vinheta de caso clínico.
{ "tipo": "multipla", "contexto": "opcional", "enunciado": "...",
  "alternativas": [{"id":"a","texto":"..."},{"id":"b","texto":"..."},{"id":"c","texto":"..."},{"id":"d","texto":"..."}],
  "correta": "c" }

// verdadeiro ou falso — afirmação única, sem ambiguidade
{ "tipo": "vf", "enunciado": "afirmação", "correta": true }

// ordenar — 4 a 7 itens; ordemCorreta lista os ids na sequência certa
{ "tipo": "ordenar", "enunciado": "Ordene cronologicamente:", "itens": [{"id":"1","texto":"..."}], "ordemCorreta": ["3","1","2","4"] }

// associar — 3 a 6 pares (coluna esquerda → direita), cada direita usada uma vez
{ "tipo": "associar", "enunciado": "Associe a estrutura à camada germinativa de origem:",
  "pares": [{"esquerda":"Epiderme","direita":"Ectoderma"}] }
```

Distribuição sugerida por tópico: ~55% `multipla` (≥ 3 com `contexto` clínico), ~20% `vf`, ~15% `ordenar`, ~10% `associar`.

## IDs canônicos de estruturas (usados pelos modelos 3D)

Use exatamente estes IDs quando a estrutura aparecer; crie outros em kebab-case se precisar.

zigoto, zona-pelucida, pronucleo-masculino, pronucleo-feminino, corpusculo-polar, blastomero, morula, blastocisto, blastocele, trofoblasto, embrioblasto, sinciciotrofoblasto, citotrofoblasto, epiblasto, hipoblasto, cavidade-amniotica, amnioblastos, saco-vitelino-primario, saco-vitelino, mesoderma-extraembrionario, celoma-extraembrionario, pediculo-de-conexao, lacunas-trofoblasticas, placa-precordal, linha-primitiva, no-primitivo, fosseta-primitiva, sulco-primitivo, ectoderma, mesoderma, endoderma, membrana-bucofaringea, membrana-cloacal, processo-notocordal, notocorda, placa-neural, sulco-neural, pregas-neurais, crista-neural, tubo-neural, neuroporo-cranial, neuroporo-caudal, mesoderma-paraxial, somitos, mesoderma-intermediario, mesoderma-lateral, mesoderma-somatico, mesoderma-esplancnico, celoma-intraembrionario, area-cardiogenica, tubo-cardiaco, proeminencia-cardiaca, arcos-faringeos, placoide-otico, placoide-lentiforme, broto-membro-superior, broto-membro-inferior, eminencia-caudal, proeminencia-hepatica, cordao-umbilical, alantoide, intestino-anterior, intestino-medio, intestino-posterior, placa-da-mao, raios-digitais, palpebras, pavilhao-auricular, herniacao-umbilical-fisiologica, vilosidades-corionicas, decidua-basal, placenta, corio-frondoso, corio-liso, amnio

## Arquivo de escolas — `content/escolas/escolas-medicas-br.json`

```jsonc
{ "atualizadoEm": "AAAA-MM-DD", "fontes": ["..."],
  "escolas": [
    { "id": "escs", "sigla": "ESCS", "nome": "Escola Superior de Ciências da Saúde", "mantenedora": "...",
      "cidade": "Brasília", "uf": "DF", "natureza": "publica-estadual", "site": "https://..." }
  ] }
```
`natureza`: `publica-federal` | `publica-estadual` | `publica-municipal` | `privada` | `comunitaria`.

## Histologia (`content/histologia/`)

Mesmo formato de tópico (ids `his-NN-nome`, `disciplina: "histologia"`, questões `his-NN-qNN`). Regras de rigor iguais.

Obras-base:
- Junqueira LC, Carneiro J. *Histologia Básica: texto e atlas*. 14ª ed. Rio de Janeiro: GEN Guanabara Koogan; 2023. (principal referência nas escolas brasileiras)
- Ross MH, Pawlina W. *Histologia: texto e atlas — correlações com biologia celular e molecular*. 8ª ed. GEN Guanabara Koogan; 2021.
- Gartner LP. *Tratado de Histologia*. 4ª/5ª ed. Elsevier.
- Kierszenbaum AL, Tres LL. *Histologia e Biologia Celular: uma introdução à patologia*. 5ª ed. Elsevier.

Coloração padrão das lâminas do jogo: hematoxilina-eosina (HE) — núcleos e estruturas basófilas em roxo-azulado; citoplasma, colágeno e estruturas acidófilas em rosa. Quando um item depender de outra coloração (PAS, tricrômico, orceína, Wright/Leishman para sangue, impregnação argêntica), diga qual.

### IDs canônicos das estruturas das lâminas do microscópio virtual

Use exatamente estes IDs em `estruturas` quando a estrutura aparecer no tópico:

epitelio-simples-pavimentoso, epitelio-simples-cubico, epitelio-simples-cilindrico, epitelio-pseudoestratificado, epitelio-estratificado-pavimentoso, epitelio-de-transicao, membrana-basal, lamina-propria, lumen, enterocito, celula-caliciforme, borda-em-escova, cilios, celula-basal, celula-em-guarda-chuva, estrato-basal, estrato-espinhoso, estrato-granuloso, estrato-lucido, estrato-corneo, papila-dermica, derme-reticular, acino-seroso, acino-mucoso, meia-lua-serosa, ducto-estriado, septo-conjuntivo, fibroblasto, fibras-colagenas, fibras-elasticas, mastocito, macrofago, plasmocito, capilar, adipocito-unilocular, condrocito, lacuna, grupo-isogeno, matriz-territorial, matriz-interterritorial, pericondrio, osteon, canal-de-havers, lamelas-concentricas, osteocito, canaliculos, canal-de-volkmann, lamelas-intersticiais, hemacia, neutrofilo, eosinofilo, basofilo, linfocito, monocito, plaquetas, fibra-muscular-esqueletica, estriacoes-transversais, endomisio, fibra-muscular-cardiaca, disco-intercalar, fibra-muscular-lisa, neuronio-multipolar, corpusculos-de-nissl, nucleolo, dendrito, cone-de-implantacao, celulas-da-glia, neuropilo, epineuro, perineuro, endoneuro, fasciculo-nervoso, fibra-mielinizada

### Lâminas em vários arquivos (histologia dos sistemas)

- `content/histologia/laminas.json`: as 16 lâminas da histologia geral.
- `content/histologia/laminas-sistemas-a.json` (circulatório, linfoide, pele), `-b.json` (tubo digestivo e glândulas anexas) e `-c.json` (respiratório, urinário, endócrino, reprodutor): um arquivo por grupo, cada um com seu renderizador em `src/modules/histologia/laminas/sistemas-{a,b,c}.tsx`.
- O carregador (`src/content/index.ts`), o validador e os testes juntam todos os `laminas*.json`. Ids e valores de `ordem` são únicos entre os arquivos.
- O conjunto de `estruturas` do texto de cada lâmina é igual ao de `partes` do desenho (teste em `tests/conteudo.test.ts`).
- Um id de estrutura mostra, no registro do app, a definição do **primeiro tópico** que o contém. Por isso, use o id canônico do tópico quando a estrutura for a mesma e um id específico quando o sentido for outro (ex.: `capsula-suprarrenal`, `tunica-albuginea-ovariana`, `veia-central-suprarrenal`).

Regras do jogo declaradas no registro das lâminas (`LaminaRender`, em `src/modules/histologia/laminas/index.ts`; lógica em `src/modules/histologia/regras.ts`):

- `areaDiagnostica`: retângulo onde o jogo "Qual é o tecido?" sorteia o centro do campo de 10×. O campo tem de mostrar o aspecto que define a resposta.
- `contem` (estrutura → partes desenhadas dentro dela): no "Identifique na lâmina", tocar numa parte conta como acerto quando o alvo é o todo (centro germinativo × folículo linfoide). O inverso continua erro. Só declare quando o desenho tiver o aninhamento.
- `distratoresExcluidos` (ids de outras lâminas): alternativas que não podem aparecer no "Qual é o tecido?" quando esta lâmina é a resposta, porque também descreveriam o campo. Critério usado: o tecido do distrator é a maior estrutura em pelo menos 10% dos campos sorteáveis. Sempre sobram pelo menos 3 alternativas erradas (teste em `tests/histologia-jogos.test.ts`).
- Termos de patologia não entram na descrição do tecido normal (ex.: "céu estrelado", "ovo frito", "olho de coruja").

### Modelos 3D da histologia

- Textos em `content/histologia/modelos3d-a.json` (néfron, alvéolo) e `modelos3d-b.json` (lóbulo hepático, sarcômero, junções celulares), validados por `ModeloHistologia3DSchema`.
- Campos: `id`, `ordem`, `titulo`, `escala` (aviso mostrado junto do modelo, ex.: "Esquema fora de escala"), `contexto` (avisos de interpretação: o que o modelo simplifica ou omite), `descricao`, `destaques`, `topicos`, `estruturas` (pelo menos 4) e `revisao`.
- Os modelos ficam em `src/modules/histologia/modelos3d/` (geometria pura em `geometria-*.ts`, testável sem navegador) e usam o mesmo contrato dos modelos da embriologia (`Componente`, `partes`, `camera`, `raio`).
- O conjunto de `estruturas` do texto é igual ao de `partes` do modelo, e os ids de modelo são distintos dos ids de estágios da embriologia (testes em `tests/histologia-3d-coerencia.test.ts` e validação no build).
- Todo modelo é esquema: cores convencionais (não são coloração HE), número reduzido de células e filamentos, proporções ajustadas para caber na tela. Isso é dito ao aluno em `escala` e `contexto`.
