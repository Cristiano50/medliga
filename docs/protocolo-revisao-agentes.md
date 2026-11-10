# Protocolo de revisão por agentes especialistas

Usado para todo conteúdo novo do MedLiga. Cada grupo de tópicos passa por **duas revisões em sequência**, de áreas diferentes, e por uma **conferência de fonte primária**:
1. **Embriologia** (ou a área-mãe da disciplina): confere todos os fatos.
2. **Revisor transversal** de outra área (clínica, genética, anatomia, fisiologia, obstetrícia): confere de novo, olhando especialmente aplicação clínica, terminologia e integração com a sua área.
3. **Conferência de fonte primária** (obrigatória desde 10/11/2026, a pedido do Cristiano): toda conduta, número clínico (dose, limiar, prazo, critério diagnóstico, prevalência) e citação de artigo ou diretriz é conferida no **texto integral** da fonte. Pode ser feita pelo próprio revisor da 2ª etapa ou por um agente dedicado (`area: "conferencia-fontes"`). O que não puder ser confirmado vira redação qualitativa e entra em `incertezas`; nunca fica um número sem fonte lida.

## Como ler as fontes nesta rede (testado)

- **Não use a ferramenta WebFetch**: ela não passa pelo proxy da sessão e falha até em sites liberados. Use o Bash com curl (`curl -sSL -m 90 "<url>" -o <arquivo>`, com um agente de navegador genérico se o site exigir); PDF → `pdftotext -layout arquivo.pdf -`.
- **gov.br**: o link `.pdf` abre uma página; o arquivo está em `<link>.pdf/@@download/file`.
- **PubMed**: as páginas têm verificação anti-robô; use a API E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=…&retmode=json`, `esummary.fcgi?db=pubmed&id=<PMID>&retmode=json`, `efetch.fcgi?db=pubmed&id=<PMID>&rettype=abstract&retmode=text`), no máximo 3 requisições por segundo.
- **Texto completo aberto**: Europe PMC (`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=…&format=json`, `…/rest/PMC<id>/fullTextXML`) ou OAI do PMC (`https://www.ncbi.nlm.nih.gov/pmc/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:<n>&metadataPrefix=pmc`).
- Hosts liberados e limitações: seção H de `docs/pendencias-conferencia-medica.md`. Se um host der "CONNECT tunnel failed, 403", ele está fora da rede: registre e siga.
- Registre no relatório a URL (ou DOI/PMID) e o trecho decisivo de cada item conferido.

## O que conferir em cada tópico (todos os campos)

- `resumo`, `pontosChave`, `objetivos`: cada afirmação correta segundo as obras de referência (Moore 11ª ed., Sadler/Langman 14ª ed., Larsen 5ª ed., Carlson 6ª ed.; Thompson & Thompson para genética; Williams para obstetrícia; diretrizes do Ministério da Saúde/FEBRASGO/SBP quando houver recomendação clínica).
- `estruturas`: definição, origem e destino corretos; nomes em português conforme a terminologia usada nos livros brasileiros.
- `eventos`: a sequência (`ordem`) precisa ser **inequívoca** segundo as fontes, porque vira um jogo de ordenar. Eventos simultâneos ou de ordem controversa recebem o **mesmo valor de `ordem`** (o jogo sorteia um único evento por posição, então empates nunca são cobrados; os ids continuam válidos para o histórico dos alunos). Dias em `diaMin`/`diaMax` são **dias após a fertilização**.
- `correlacoesClinicas`: mecanismo embriológico correto; números (prevalência, risco) só se estiverem nas fontes.
- Cada questão:
  - fato correto; **uma única alternativa defensável**; distratores claramente errados (não "menos certos");
  - enunciado sem ambiguidade (idade de fertilização × gestacional explícita quando importar);
  - `explicacao` correta, justificando a certa e refutando cada distrator, **citando as letras corretas**;
  - V/F: afirmação inequivocamente verdadeira ou falsa;
  - ordenar/associar: sequência ou pares sem margem de dúvida;
  - `dificuldade` (1–5) e `bloom` coerentes;
  - `referencia` plausível (obra + capítulo).
- `notasDivergencia` e `incertezas`: resolva as incertezas que você conseguir (com fonte); mantenha as demais para o revisor humano.
- Português correto e claro; nada de texto copiado de livros.

## Como corrigir

- Edite o JSON diretamente, com mudanças mínimas e precisas. **Não mude ids** de tópicos, questões, estruturas ou eventos (o app e o histórico dos alunos dependem deles); se uma questão não tem conserto, reescreva-a mantendo o id.
- Múltipla escolha: as alternativas ficam com ids `a, b, c, d(, e)` nessa ordem e o app as exibe nessa ordem. Se a letra correta estiver concentrada (ex.: "a" em mais de 40% das questões do tópico), redistribua trocando os **textos** entre alternativas, atualize `correta` e **todas** as letras citadas na `explicacao`.
- Depois de editar, rode `cd /home/user/medgame && npm run validar-conteudo && npx vitest run` e corrija o que quebrar nos seus arquivos.
- Registre a sua revisão no fim de `revisao.agentes` do tópico:
  `{"area": "<sua área>", "agente": "revisor-<area>-v1", "data": "AAAA-MM-DD", "veredito": "aprovado" | "aprovado-com-correcoes" | "reprovado", "notas": "<n> correções; principais: …"}`
  - `aprovado`: nada a corrigir; `aprovado-com-correcoes`: você corrigiu tudo o que encontrou; `reprovado`: sobrou problema grave que você não conseguiu resolver (explique).
- **Nunca preencha `revisao.humano`.** É exclusivo do médico revisor.

## Relatório

Grave `content/revisoes/<grupo>-<area>.md` com:
1. Resumo (tópicos revisados, nº de questões, nº de correções por gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, referência).
2. Tabela de correções: `id | campo | antes (resumido) | depois (resumido) | motivo | fonte`.
3. Pontos para o revisor humano (dúvidas que permanecem, divergências relevantes entre fontes).
