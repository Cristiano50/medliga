# Revisão por agente — Grupo G3, área embriologia

- Agente: `revisor-embriologia-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica; `revisao.humano` permanece `null` em todos os tópicos.

## 1. Resumo

| Tópico | Questões | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| emb-11-cavidades-diafragma | 25 | 0 | 0 | 2 | aprovado-com-correcoes |
| emb-12-aparelho-faringeo | 25 | 0 | 1 | 3 | aprovado-com-correcoes |
| emb-13-cardiovascular | 25 | 0 | 0 | 1 | aprovado-com-correcoes |
| emb-14-respiratorio | 23 | 0 | 0 | 13 | aprovado-com-correcoes |
| emb-15-digestorio | 25 | 0 | 1 | 17 | aprovado-com-correcoes |
| **Total** | **123** | **0** | **2** | **36** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, referência.

Não encontrei nenhum fato errado nem gabarito errado nos 5 tópicos. Conferi um por um todos os campos: resumo, pontos-chave, estruturas, eventos, correlações e as 123 questões com explicações. Isso inclui todos os pontos de atenção do grupo:

- **Arcos e bolsas:** derivados de cada arco faríngeo (cartilagem, músculo, nervo, artéria) e de cada bolsa.
- **Língua:** origem da mucosa e inervação.
- **Face e palato:** fenda labial × palatina.
- **Diafragma:** os quatro componentes (Moore), C3–C5 e lado da HDC (esquerdo).
- **Coração:** septum primum/secundum, coxins, septo aorticopulmonar, arcos aórticos e laríngeos recorrentes, circulação fetal e remanescentes.
- **Pulmão:** fases de Moore × Sadler e início do surfactante.
- **Digestório:**
  - rotação do estômago (90° horária, vista cranial) e do intestino médio (270° anti-horária, vista ventral, eixo na AMS);
  - recanalização duodenal;
  - Meckel;
  - onfalocele × gastrosquise;
  - Hirschsprung.

Os capítulos citados em `referencia` e `referencias` são compatíveis com o sumário das edições adotadas. Nenhum estava claramente errado:

- Moore 11ª: cap. 4, 5, 8, 9, 10, 11, 13, 18 e 20.
- Sadler 14ª: cap. 7, 9, 13, 14, 15 e 17.
- Larsen 5ª: cap. 11, 12, 13, 14 e 17.
- Carlson 6ª: cap. 15.

Limitação: a conferência foi feita com o conteúdo das obras de referência conhecido pelo revisor e com busca pontual na web. As edições impressas não estavam disponíveis para consulta direta. As dúvidas que dependem do texto exato do livro estão na seção 3.

Verificação após as edições:
- `npm run validar-conteudo`: "Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523". O único aviso é sobre `emb-01-introducao.json` (eventos com ordem repetida), que fica fora do G3.
- `npx vitest run`: 2 arquivos, 25 testes, todos passando.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-12-aparelho-faringeo / `e12-primordio-tireoide` | `eventos` | Evento "Surge o primórdio da tireoide" (dia 24, ordem 2), entre "primeiros arcos" (22–24) e "ruptura da membrana bucofaríngea" | Evento retirado da linha do tempo. Os demais foram renumerados (ordem 1–5) sem mudança de ids. A incerteza correspondente foi atualizada | **Importante.** A ordem não é inequívoca: o estadiamento de Carnegie já identifica o primórdio da tireoide no estágio 10 (~22 dias), o mesmo estágio em que Moore situa os dois primeiros pares de arcos (alguns autores o veem já no estágio 9). O jogo de ordenar teria duas respostas defensáveis | O'Rahilly R. (1983), *The timing and sequence of events in the development of the human endocrine system during the embryonic period proper*, resumido em UNSW Embryology; Moore 11ª ed., cap. 5 (Tabela de estágios) e cap. 9 |
| emb-15-digestorio / `ma-rotacao-volvo` | `correlacoesClinicas[].mecanismo` | "Falha ou anomalia dos 180° finais da rotação durante o retorno…" | Três situações: não rotação (alças voltam sem girar, colo à esquerda); rotação mista com volvo (falha dos 90° finais, segundo Moore, ceco logo abaixo do piloro); rotação horária (duodeno anterior à AMS). Em todas, fixação mesentérica anormal e raiz estreita que favorece o volvo | **Importante.** A explicação estava incorreta e contradizia a própria descrição da correlação. A rotação reversa é anomalia do sentido da rotação, não dos 180° finais, e Moore atribui a rotação mista à falha dos últimos 90° | Moore 11ª ed., cap. 11 (anomalias da rotação do intestino médio); Sadler 14ª ed., cap. 15 |
| emb-12-aparelho-faringeo | `resumo` (Língua) | "a cópula (2º arco) e a eminência hipofaríngea (3º e 4º arcos) formam o terço posterior" | "a eminência hipofaríngea (3º e 4º arcos), que cresce sobre a cópula (2º arco) e a recobre, forma a mucosa do terço posterior" | Menor. O texto sugeria que a cópula forma a mucosa do adulto. Em Moore ela é recoberta e desaparece. A nova redação concorda com a estrutura `copula-eminencia-hipofaringea`, com a q14 e com a explicação da inervação pelo IX | Moore 11ª ed., cap. 9 |
| emb-12-aparelho-faringeo | `resumo` (Face e palato) | "as nasais mediais fundem-se entre si e com as maxilares e formam o segmento intermaxilar" | "as nasais mediais fundem-se entre si, formando o segmento intermaxilar (…), e fundem-se também com as maxilares" | Menor. A redação dava a entender que a fusão com as maxilares forma o segmento intermaxilar. Ele resulta só da fusão das nasais mediais entre si | Sadler 14ª ed., cap. 17; Moore 11ª ed., cap. 9 |
| emb-12-aparelho-faringeo | `incertezas` | "A posição relativa entre … arcos e … tireoide segue Moore" | Registra o estágio 10 de Carnegie e a retirada do evento | Menor. Atualização coerente com a correção do evento | idem 1ª linha |
| emb-11-cavidades-diafragma / `hernia-diafragmatica-congenita` | `correlacoesClinicas[].mecanismo` | "O predomínio à esquerda relaciona-se ao fechamento mais precoce da abertura direita." | "provavelmente se relaciona … (explicação proposta por Moore, não comprovada)" | Menor. Uma hipótese estava apresentada como fato | Moore 11ª ed., cap. 8 |
| emb-11-q15 | `explicacao` | "Moore relaciona o predomínio ao fechamento…" | "Moore relaciona o predomínio, como hipótese, ao fechamento…" | Menor. Mesmo motivo | Moore 11ª ed., cap. 8 |
| emb-13-q22 | `enunciado` | "Ordene as regiões do tubo cardíaco…" (lista incluía o saco aórtico) | "Ordene as regiões do tubo cardíaco e o saco aórtico, no qual o tubo se continua, …" | Menor. O saco aórtico não é região do tubo cardíaco propriamente dito, e sim a dilatação na qual o tronco arterial se continua | Moore 11ª ed., cap. 13; Sadler 14ª ed., cap. 13 |
| emb-15-digestorio / `malformacoes-anorretais` | `correlacoesClinicas[].descricao` | "(retouretral ou retovesical no menino; retovestibular ou retoperineal na menina)" | "(retoperineal em ambos os sexos; retouretral ou retovesical no menino; retovestibular na menina)" | Menor. A fístula perineal também ocorre no menino | Moore 11ª ed., cap. 11 (anomalias anorretais) |
| emb-15-digestorio | `notasDivergencia` | Sem menção à divergência sobre a ruptura da membrana anal | Nova nota: Moore situa a ruptura no fim da 8ª semana; Sadler, a ruptura da membrana cloacal no fim da 7ª. A ordem da linha do tempo não muda | Menor. Divergência entre as obras-base não registrada | Moore 11ª ed., cap. 11; Sadler 14ª ed., cap. 15 |
| emb-14-q01 a q13 (13 questões) | `explicacao` | Explicação sem citar a letra correta (os distratores já eram citados) | Prefixo "A alternativa (x) está correta: …", com a letra igual à de `correta` | Menor. Padronização exigida pelo protocolo ("citando as letras corretas") e já seguida pelos tópicos 11–13. O conteúdo não mudou | — |
| emb-15-q01 a q15 (15 questões) | `explicacao` | idem | idem | Menor. idem | — |

Também conferi, sem alterar:
- **Gabaritos:** todos corretos.
- **Distribuição das letras corretas:** nenhuma letra passa de 40% em nenhum tópico (máximo de 4 em 13–15 questões).
- **Sequências de ordenar e eventos:** inequívocas segundo Moore e Sadler, exceto a retirada acima.
- **Pares de associar:** corretos e sem ambiguidade.

## 3. Pontos para o revisor humano

1. **Divertículo de Meckel (emb-15).** O tópico atribui a Sadler "2–3%, 40–60 cm da valva ileocecal" e a Moore "2–4%, 40–50 cm da junção ileocecal". Não consegui conferir o texto exato. Minha lembrança é que Sadler também cita 2–4%. Conferir na 14ª ed. brasileira (cap. 15) e ajustar a correlação, a q11 e a nota de divergência, se for o caso.
2. **Origem das cartilagens laríngeas.** O resumo e os pontos-chave do emb-12 dizem que "o esqueleto e o conjuntivo dos arcos derivam da crista neural". As notas do emb-12 e as incertezas do emb-14 registram evidência de origem no mesoderma da placa lateral para as cartilagens da laringe. Avaliar se o resumo deve dizer "predominantemente".
3. **Componentes do diafragma (emb-11).** O jogo segue o esquema de quatro componentes de Moore, com "pequenas porções" das membranas pleuroperitoneais (q16 e q24). Estudos experimentais atribuem às pregas pleuroperitoneais o conjuntivo muscular de todo o diafragma. Isso está registrado em `notasDivergencia`. Manter o esquema clássico é decisão didática.
4. **Septação atrial (emb-13, eventos e q20).** A sequência "septum primum funde-se aos coxins → surge o septum secundum" segue Moore e Sadler. A morfologia moderna (grupo de Anderson) descreve o "septum secundum" como uma prega do teto atrial e discute a cronologia. Mantive a sequência dos livros-texto.
5. **Ordem cecal × fixação (emb-15-q22).** A sequência "o ceco desce → o mesocólon ascendente funde-se" segue a narrativa dos livros. Os dois processos se estendem pelo período fetal. Se o revisor humano os considerar parcialmente simultâneos, retirar o item 5 da questão.
6. **Surfactante (emb-14).** A faixa "20ª–24ª semana após a fertilização" combina Moore (~20 semanas) e Sadler (fim do 6º mês). A coerência com o emb-08 (≈24ª semana) já está registrada.
7. **Condutas clínicas** (fora do escopo da embriologia; para os revisores transversais de pediatria, cirurgia pediátrica, genética e obstetrícia):
   - sala de parto na HDC e oclusão traqueal fetal;
   - operação de Sistrunk;
   - microarranjo/FISH na 22q11.2;
   - PGE1, atriosseptostomia e troca arterial;
   - inibidores da COX no canal arterial;
   - procedimento de Ladd;
   - Kasai;
   - corticoide antenatal.

   O emb-14 cita ACOG Committee Opinion 713 (2017). Pela regra de rigor do schema, avaliar se cabe acrescentar a diretriz brasileira vigente (FEBRASGO/Ministério da Saúde).
8. **Pista de comprimento (recomendação editorial, não corrigida).** Em várias questões a alternativa correta é visivelmente a mais longa: emb-11-q07, q11, q13; emb-13-q13; emb-14-q05, q06, q10; emb-15-q03. Não há ambiguidade de conteúdo, mas o aluno pode acertar por pista formal. Sugiro equilibrar o comprimento das alternativas numa revisão editorial.
9. **Títulos de capítulos.** O mesmo capítulo de Moore aparece com títulos diferentes entre tópicos: cap. 8 é "Cavidades corporais…" × "Cavidades do corpo…", e cap. 11 é "Sistema alimentar" × "Sistema digestório". Uniformizar conforme o sumário da edição brasileira em mãos. Os números dos capítulos estão corretos.
