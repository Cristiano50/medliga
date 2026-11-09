# Revisão por agente — Grupo G3, área pediatria-neonatologia/anatomia/fisiologia (2ª etapa)

- **Agente:** `revisor-pediatria-v1`
- **Data:** 2026-11-09
- **Protocolo:** `docs/protocolo-revisao-agentes.md`
- **Etapa anterior:** `content/revisoes/g3-embriologia.md`
- **Situação:** revisão por agente (IA). Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos cinco tópicos.

## 1. Resumo

| Tópico | Questões | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| emb-11-cavidades-diafragma | 25 | 0 | 0 | 10 | aprovado-com-correcoes |
| emb-12-aparelho-faringeo | 25 | 0 | 1 | 10 | aprovado-com-correcoes |
| emb-13-cardiovascular | 25 | 0 | 1 | 18 | aprovado-com-correcoes |
| emb-14-respiratorio | 23 | 0 | 0 | 15 | aprovado-com-correcoes |
| emb-15-digestorio | 25 | 1 | 1 | 15 | aprovado-com-correcoes |
| **Total** | **123** | **1** | **3** | **68** | |

**Gravidade:**
- **crítica:** fato errado ou gabarito errado;
- **importante:** ambiguidade, distrator defensável ou explicação incorreta;
- **menor:** redação, terminologia, referência ou pista de comprimento.

**Gabaritos.** Nenhum gabarito estava errado. Nenhuma letra correta, `ordemCorreta` ou id foi alterado. A distribuição das letras corretas continua com no máximo 4 por tópico.

**A crítica.** Está num caso clínico (emb-15-q13) e não muda o gabarito. O caso dizia que a biópsia retal **por sucção** mostra ausência de células ganglionares também no plexo **mioentérico**. Isso não é possível, porque a sucção só retira mucosa e submucosa.

**O que conferi:** os 123 itens e todos os campos. O foco foi o olhar clínico, anatômico e fisiológico pedido:

- **Casos e condutas:**
  - HDC em sala de parto;
  - atresia de esôfago;
  - cardiopatias canal-dependentes e PGE1;
  - TGA (atriosseptostomia, Jatene);
  - Fallot;
  - canal arterial do prematuro;
  - estenose pilórica (alcalose hipoclorêmica);
  - vômito bilioso como emergência (má rotação/volvo, Ladd);
  - atresia duodenal;
  - atresia biliar;
  - corticoide antenatal;
  - surfactante e CPAP;
  - 22q11.2;
  - cisto tireoglosso.
- **Anatomia:**
  - inervação frênica e dor referida;
  - nervos dos arcos;
  - trajeto dos laríngeos recorrentes;
  - tríade portal;
  - linha pectínea;
  - remanescentes fetais.
- **Fisiologia:**
  - correntes preferenciais da circulação fetal;
  - transição ao nascer;
  - desdobramento de B2 na CIA;
  - depuração do líquido pulmonar;
  - distúrbio acidobásico da estenose pilórica.
- **Linhas do tempo:** a ordem de todos os eventos e questões de ordenar segue inequívoca. Não mexi em nenhuma.

**Pista de comprimento.** Usei um script que compara o tamanho da alternativa correta com a média dos distratores. Ele marcou 48 questões de múltipla escolha. Reescrevi os distratores, ou encurtei a correta, em **41 questões**. Os novos distratores continuam claramente errados, com um único erro central cada. Ajustei as explicações quando o distrator ganhou conteúdo novo (emb-13-q13, emb-14-q05, emb-15-q05).

Ficaram sem mudança 7 questões em que a correta tem praticamente o mesmo tamanho de outra alternativa: emb-11-q14, emb-12-q02, emb-12-q11, emb-13-q06, emb-15-q06, emb-15-q08 e emb-15-q14. Na emb-14-q12, ajustei só um distrator, e a correta segue um pouco mais longa.

**Verificação após as edições:**
- `npm run validar-conteudo`: "Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441".
- `npx vitest run`: 28 testes passam e 1 falha. A falha é `estágios 3D > todo modelo registrado tem estágio no conteúdo`, com a mensagem `coracao-tubular: expected false to be true`. Ela **não vem do G3**. Os modelos 3D `coracao-tubular`, `coracao-alca` e `aparelho-faringeo` foram registrados em `src/modules/embriologia/modelos/index.ts` sem estágio em `content/embriologia/estagios.json`, como já registrado em `g2-embriologia.md`, item 10. Os testes de questões, que cobrem as letras citadas nas explicações e os ids, passam.

**Limitações:**
- As edições impressas das obras-base não estavam disponíveis.
- Nesta sessão, a rede bloqueou a leitura direta de `sbp.com.br` e `me.ufrj.br`. Diretrizes da SBP e protocolos institucionais foram conferidos por trechos de busca. Os pontos que dependem do texto literal estão na seção 3.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| **emb-15-q13** | `contexto` | Biópsia retal por sucção mostra ausência de células ganglionares "nos plexos submucoso e mioentérico" | "Ausência de células ganglionares no plexo submucoso e troncos nervosos hipertróficos" | **Crítica (fato errado; gabarito inalterado).** A sucção retira mucosa e submucosa e não alcança o plexo mioentérico, que fica na muscular própria. A avaliação do mioentérico exige biópsia de espessura total | Kapur RP, *Semin Pediatr Surg* 2009 (patologia da doença de Hirschsprung); Nelson, *Textbook of Pediatrics*, 21ª ed. |
| emb-15 / `doenca-hirschsprung` | `correlacoesClinicas[].descricao` | "Diagnóstico por biópsia retal" | Acrescentado: "a biópsia por sucção, de mucosa e submucosa, avalia o plexo submucoso" | Menor. Coerência com a q13 | idem |
| **emb-15-q07** | `explicacao` | "A perda de suco gástrico (HCl) explica a alcalose hipoclorêmica e hipocalêmica" | A perda de HCl explica a alcalose hipoclorêmica. A hipocalemia vem sobretudo da perda **renal** de K⁺ (hipovolemia com hiperaldosteronismo secundário e bicarbonatúria). Esses distúrbios são corrigidos antes da cirurgia | **Importante.** A explicação estava fisiologicamente incorreta: o suco gástrico tem pouco potássio | Nelson, 21ª ed. (estenose hipertrófica do piloro); fisiologia renal da alcalose de contração |
| emb-15 / `estenose-hipertrofica-piloro` | `descricao` | "Tratamento por piloromiotomia" | Piloromiotomia após correção da desidratação e dos distúrbios eletrolíticos: "urgência clínica, não emergência cirúrgica" | Menor. Conduta atual | Nelson, 21ª ed.; Holcomb & Ashcraft, *Pediatric Surgery* |
| **emb-13-q05** | `explicacao` | "O desdobramento fixo [decorre] da sobrecarga de volume do VD" | Desdobramento **amplo** porque o maior volume ejetado pelo VD atrasa o fechamento pulmonar. **Fixo** porque a CIA equaliza entre os átrios as variações respiratórias do retorno venoso | **Importante.** A explicação confundia o mecanismo do desdobramento amplo com o do fixo | Park, *Pediatric Cardiology for Practitioners*; Braunwald, semiologia cardíaca |
| **emb-12** | `resumo`, `pontosChave[1]`, `estruturas[arcos-faringeos].origem` | "O esqueleto e o conjuntivo [dos arcos] derivam da crista neural" | "Em grande parte da crista neural". As cartilagens laríngeas (4º e 6º arcos) vêm do mesoderma da placa lateral, segundo Sadler e estudos de linhagem | **Importante.** A generalização contradizia a nota de divergência do próprio tópico e as incertezas do emb-14. Resolve a pendência 2 da etapa 1 | Sadler 14ª ed., cap. 17 (introdução: placa lateral → aritenóidea e cricóidea); estudos de linhagem em camundongo |
| emb-12 | `notasDivergencia` | Nota sobre as cartilagens sem citar Sadler | Acrescentado que Sadler atribui aritenóidea e cricóidea à placa lateral, embora sua tabela as liste como derivadas dos arcos 4 e 6. As duas afirmações são compatíveis (arco = local; placa lateral = camada) | Menor | idem |
| emb-12 | `resumo` (4º arco) e nova `notasDivergencia` | Nervo do 4º arco: laríngeo superior para cricotireóideo, constritores e levantador do véu | Vago: o laríngeo superior inerva o cricotireóideo; o ramo faríngeo (plexo faríngeo) inerva os constritores e o levantador do véu palatino. Nota de divergência nova | Menor. Precisão anatômica. Os pares de associação mantêm a convenção dos livros-texto | Moore 11ª ed., cap. 9; Larsen 5ª ed., cap. 17; anatomia do adulto (plexo faríngeo) |
| emb-12-q01, emb-12-q23 | `explicacao` | "Laríngeo superior (cricotireóideo e constritores)" | "Laríngeo superior: cricotireóideo; os constritores recebem o ramo faríngeo do vago" | Menor. Mesmo motivo | idem |
| emb-12-q10 | `explicacao` | Triagem neonatal "rastreia doenças metabólicas, endócrinas e hemoglobinopatias, não microdeleções" | Acrescentado que, onde inclui TRECs, a triagem pode sinalizar linfopenia T, mas não identifica nem confirma a microdeleção | Menor. Atualização: a triagem de imunodeficiências por TRECs está em implantação no Brasil | Diretrizes de triagem neonatal ampliada (implantação variável por estado) |
| emb-13 | `resumo` (circulação fetal) | No átrio direito, "a maior parte [do sangue da VCI] é dirigida… pelo forame oval" | "A corrente mais oxigenada (vinda sobretudo do ducto venoso) é dirigida **preferencialmente**… (crista dividens)" | Menor. Fisiologia: a passagem pelo forame oval é seletiva, sobretudo da corrente do ducto venoso | Kiserud T, *Semin Fetal Neonatal Med* 2005; Rudolph, fisiologia da circulação fetal |
| emb-13 | `resumo` (nascimento) | "A resistência pulmonar cai e a pressão no AE sobe" | Acrescentados a queda do retorno ao átrio direito, a aeração e o aumento do fluxo pulmonar | Menor. Sequência fisiológica completa da transição | idem; Moore 11ª ed., cap. 13 |
| emb-13-q14 | `explicacao` | Crista dividens dirige "a maior parte do sangue da cava inferior" | "Dirige preferencialmente a corrente mais oxigenada (do ducto venoso)" | Menor. Idem | idem |
| emb-13-q08 | `explicacao` | Só inibidores da COX | Acrescentados o paracetamol como alternativa e a indicação conforme a repercussão hemodinâmica (muitos canais fecham espontaneamente) | Menor. Prática atual | Jasani B et al., Cochrane 2022 (paracetamol no canal arterial); Hundscheid T et al., *N Engl J Med* 2023 (BeNeDuctus) |
| emb-13 / `persistencia-canal-arterial` | `descricao` | "No prematuro, inibidores da COX podem promover o fechamento" | "No prematuro com canal hemodinamicamente significativo, inibidores da COX (ibuprofeno, indometacina) ou o paracetamol…" | Menor. Idem | idem |
| emb-13 / `coarctacao-aorta` | `descricao` | Na forma crítica, a perfusão inferior depende do ducto | Acrescentado: "mantido aberto com prostaglandina E1 até a correção" | Menor. Conduta canal-dependente | Diretrizes de cardiologia pediátrica (PGE1 nas lesões canal-dependentes) |
| emb-13-q11 | `explicacao` | "Há sempre CIV associada" | "Há quase sempre CIV associada" | Menor. Há relatos raros de tronco arterial com septo íntegro | Literatura de cardiologia pediátrica |
| emb-13 | `incertezas[4]` | Condutas "devem ser conferidas pelo revisor clínico" | Registro da conferência e dos acréscimos (paracetamol, tratamento individualizado, PGE1 na coarctação) | Menor | — |
| emb-14 | `resumo` (líquido pulmonar) | "Ao nascer, o líquido sai pela boca e pelo nariz e é absorvido por capilares e linfáticos" | Via principal: reabsorção epitelial ativa de Na⁺, estimulada pelos hormônios do trabalho de parto e pela entrada de ar. A saída pela boca e nariz é menor. Relação com a taquipneia transitória e a cesariana sem trabalho de parto | Menor. Fisiologia atual, que integra com o caso q09 (distrator c) | Jain L, Eaton DC, *Semin Perinatol* 2006 |
| emb-14 | `resumo` (surfactante) | "Por volta da 20ª–24ª semana" | "20ª–24ª semana **após a fertilização**" | Menor. O caso clínico usa idade gestacional, e o schema exige explicitar a referência | `docs/conteudo-schema.md` |
| emb-14 / `atresia-esofago-fistula-traqueoesofagica` | `descricao` | Sem conduta inicial | Acrescentados: sonda antes da 1ª mamada se houver polidrâmnio ou sialorreia; jejum; cabeceira elevada; aspiração contínua do coto proximal (sonda tipo Replogle); ecocardiograma e pesquisa de anomalias; correção cirúrgica | Menor. Conduta atual | Holcomb & Ashcraft, *Pediatric Surgery*; Nelson, 21ª ed. |
| emb-14 | `referencias` | Só ACOG 713 (2017) | Acrescentados OMS 2022 (corticoide antenatal) e Ministério da Saúde, *Manual de gestação de alto risco* (2022) | Menor. A regra de rigor pede diretriz brasileira quando houver (pendência 7 da etapa 1) | WHO 2022; MS 2022 |
| emb-14 | `incertezas[3]` | Janela "24–34 semanas (ACOG); alguns protocolos 22–23" | OMS 2022: 24–34 semanas, com condições (IG confiável, parto provável em 7 dias, sem infecção materna, assistência neonatal adequada). ACOG 2017: 24 0/7–33 6/7, periviabilidade e pré-termo tardio selecionado. A q10 (30 semanas) está dentro de todas as janelas | Menor | WHO 2022; ACOG CO 713 |
| emb-14 | `incertezas[0]` | Origem do mesênquima laríngeo em aberto | Remissão a Sadler (placa lateral) e ao emb-12 | Menor | Sadler 14ª ed., cap. 17 |
| emb-15 / `atresia-biliar` | `descricao` | Icterícia "que persiste além das primeiras semanas"; Kasai "precoce" | Investigar toda icterícia **a partir de 14 dias** de vida, ou qualquer acolia ou colúria, com bilirrubinas. Escala colorimétrica de fezes da Caderneta da Criança. Kasai idealmente **antes dos 60 dias** | Menor. Diretriz brasileira (campanha Alerta Amarelo) | SBP e Ministério da Saúde, campanha Alerta Amarelo; Caderneta da Criança |
| emb-15-q17 | `explicacao` | "Icterícia que persiste além das primeiras semanas deve ser investigada" | "…a partir de 14 dias de vida…, com dosagem de bilirrubina direta" | Menor. Idem | idem |
| emb-15 | `incertezas` (Kasai) | Janela só qualitativa | Registra os marcos de 14 e 60 dias, com atribuição | Menor | idem |
| emb-15 / `diverticulo-meckel` | `descricao` | "Moore: 2–4%; Sadler: 2–3%" | "2–4% da população, segundo Moore" | Menor. A prevalência atribuída a Sadler não foi confirmada (pendência 1 da etapa 1). O texto do aluno passou a citar só a fonte segura | Moore 11ª ed., cap. 11 |
| emb-15 | `notasDivergencia` (Meckel) | "Sadler — 2–3%" | Registra que o valor não foi confirmado, que os dois revisores recordam 2–4% e que as séries clínicas dão ~2% (0,3–4%) | Menor | Moore; séries clínicas (revisões de vitelino) |
| emb-11-q15 | `explicacao` | "…possivelmente pelo tamanho do lobo direito do fígado nessa fase" | Trecho retirado. Fica só a hipótese de Moore (fechamento mais precoce à direita) | Menor. Hipótese não atribuível a Moore | Moore 11ª ed., cap. 8 |
| emb-11 | `incertezas[3]` | Conduta de sala de parto da HDC: "conferir com pediatria" | Conferida: sem ventilação com balão e máscara, intubação e descompressão gástrica, conforme o consenso CDH EURO e a SBP 2022 (HDC entre as indicações de ventilação por cânula). Oclusão traqueal fetal com benefício na HDC esquerda grave | Menor | Snoek KG et al., *Neonatology* 2016 (CDH EURO, atualização 2015); Diretrizes SBP de Reanimação Neonatal 2022 (por fonte secundária); Deprest JA et al., *N Engl J Med* 2021 (TOTAL) |
| emb-11-q04, q07, q08, q09, q10, q11, q12, q13 | `alternativas` | Correta visivelmente mais longa ou mais completa (razão 1,5–3,0) | Distratores alongados com detalhe falso plausível, ou correta encurtada | Menor. Pista involuntária | — |
| emb-12-q04, q06, q12, q13, q14, q15 | `alternativas` | idem (razão 1,4–2,9) | idem | Menor | — |
| emb-13-q01, q02, q04, q07, q08, q10, q11, q12, q13, q14 | `alternativas` (+ `explicacao` da q13) | idem (razão 1,5–3,3) | idem. Na q13, os três distratores passaram a ter estrutura paralela à correta, cada um com um erro de derivação, e a explicação refuta cada um | Menor | — |
| emb-14-q01, q02, q03, q05, q06, q10, q11, q12, q13 | `alternativas` (+ `explicacao` da q05) | idem (razão 1,5–2,7) | idem | Menor | — |
| emb-15-q03, q05, q07, q09, q10, q11, q13, q15 | `alternativas` (+ `explicacao` da q05) | idem (razão 1,8–3,3) | idem | Menor | — |

Também conferi, sem alterar:
- **HDC** (emb-11-q09/q10, emb-14-q13): apresentação, radiografia e mecanismo de gravidade.
- **Eventração × paralisia frênica** (q11).
- **Morgagni à direita** (q12).
- **CIA OS, DSAV e ecocardiograma em todo RN com síndrome de Down** (MS e SBP).
- **TGA:** PGE1, atriosseptostomia com forame restritivo e Jatene.
- **Fallot:** posição genupeitoral e aumento da RVS.
- **Coarctação na síndrome de Turner** e localização justaductal.
- **Tronco arterial e 22q11.2.**
- **Laríngeo recorrente e aneurisma do arco.**
- **SDR:** quadro, radiografia, CPAP e surfactante.
- **Atresia de esôfago:** polidrâmnio, sonda enrolada, ar no abdome e tipos.
- **Atresia duodenal:** dupla bolha, vômito bilioso e trissomia 21.
- **Má rotação:** vômito bilioso súbito, seriografia com ângulo duodenojejunal à direita e saca-rolhas, emergência.
- **Meckel:** pertecnetato e mucosa gástrica.
- **Gastrosquise × onfalocele.**
- **Malformação anorretal com fístula retourinária e VACTERL.**
- **Linha pectínea:** irrigação e drenagem.

## 3. Pontos para o revisor humano

1. **Prevalência do divertículo de Meckel em Sadler** (pendência 1 da etapa 1, ainda aberta). O texto do aluno agora cita só Moore (2–4%). Se a 14ª ed. de Sadler (cap. 15) disser 2–4%, como os dois revisores por agente recordam, basta ajustar a nota de divergência.
2. **Cartilagens laríngeas e placa lateral (emb-12).** A atribuição a Sadler veio da memória do revisor e de fonte secundária que cita o Langman; o texto impresso não foi conferido. Conferir a frase na introdução do cap. 17 (Sadler 14ª ed.) e a tabela de derivados dos arcos. Se a edição brasileira não trouxer a frase, trocar "segundo Sadler" por "segundo estudos de linhagem".
3. **Diretrizes SBP de Reanimação Neonatal (2022) na HDC (emb-11).** O texto original não pôde ser lido nesta sessão, porque o site estava bloqueado na rede. A conferência usou protocolo institucional que reproduz a diretriz (HDC entre as indicações de ventilação por cânula traqueal) e o consenso CDH EURO. Confirmar a redação e verificar se há edição mais recente.
4. **Corticoide antenatal (emb-14).** Confirmar no *Manual de gestação de alto risco* (MS, 2022) e no protocolo FEBRASGO vigente a janela e o esquema, e ajustar `incertezas[3]` se necessário. A q10 (30 semanas, betametasona IM) é inequívoca em qualquer diretriz.
5. **Nervo do 4º arco (emb-12).** Mantive "laríngeo superior" como nervo do 4º arco nos pares de associação (q23), por convenção de Moore e Sadler, e precisei no resumo que constritores e levantador do véu recebem o ramo faríngeo do vago. Decidir se o jogo deve ensinar "vago (ramos faríngeo e laríngeo superior)".
6. **Canal arterial no prematuro (emb-13-q08).** O tratamento evolui para a conduta expectante em muitos casos (BeNeDuctus 2023). A questão pergunta qual fármaco "pode favorecer" o fechamento, o que segue correto, e a explicação agora traz a indicação individualizada. Avaliar se o caso deve explicitar a repercussão hemodinâmica, como o ecocardiograma com canal amplo e fluxo diastólico reverso na aorta.
7. **Triagem por TRECs (emb-12-q10).** A implantação no teste do pezinho do SUS varia por estado. A explicação é condicional ("onde já inclui").
8. **Pistas de comprimento residuais.** Em emb-11-q14, emb-12-q02, emb-12-q11, emb-13-q06, emb-14-q12, emb-15-q06, emb-15-q08 e emb-15-q14, a correta tem tamanho próximo de outra alternativa. Não alterei; avaliar numa revisão editorial.
9. **Pendências da etapa 1 que continuam válidas** (não são de pediatria):
   - item 3: esquema de quatro componentes do diafragma;
   - item 4: septum secundum segundo Anderson;
   - item 5: descida do ceco × fixação do mesocólon (emb-15-q22);
   - item 6: faixa do surfactante;
   - item 9: títulos de capítulos.
10. **Fora do G3, mas bloqueia `npx vitest run`.** Os modelos 3D `coracao-tubular`, `coracao-alca` e `aparelho-faringeo` não têm estágio em `content/embriologia/estagios.json`. É conteúdo novo dos temas do emb-12 e do emb-13, a ser criado e revisado à parte.
11. **Sugestões não aplicadas** (conteúdo novo, fora do escopo de correção):
   - conduta de sala de parto na gastrosquise: alças protegidas com filme ou bolsa estéril, decúbito lateral direito, sonda gástrica, hidratação e prevenção de hipotermia;
   - menção à oximetria de pulso neonatal (teste do coraçãozinho) nas cardiopatias críticas.
