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
