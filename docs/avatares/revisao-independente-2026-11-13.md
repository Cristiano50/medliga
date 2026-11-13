# Avatares — revisão independente e o que foi feito com ela

Este arquivo guarda (1) o que foi aplicado de cada achado da revisão independente de 13/11/2026 e (2), abaixo, o relatório da revisão na íntegra, como foi entregue pelo agente revisor.

**Importante.** A revisão foi feita por um agente de IA, sobre o commit `5324eb0` (e conferiu o turbante de `5aea149`). As correções abaixo foram aplicadas depois dela e **não passaram por uma segunda revisão independente**; foram conferidas pelo autor em pranchas renderizadas (rosto nos 13 tons a 96 e 32 px, cabelos, coberturas, óculos, apoio, roupas, acessórios, fundos e molduras), pelos testes automáticos (`tests/avatar.test.tsx`) e no navegador. As pranchas `t1`…`t17` e os arquivos `revisao-trabalho/…` citados no relatório são arquivos de trabalho da sessão e **não estão no repositório**.

## Estado de cada achado

| Achado | Estado | O que foi feito |
|---|---|---|
| P1-1 rosto some nos tons escuros | **implementado** | Olho aberto com esclera em amêndoa; par claro (`#ffc4b5` a 65 %) colado a cada traço escuro; modo compacto até 40 px (pessoa ampliada 1,3× em torno da cabeça); lente e brilho dos óculos. Igual para todos os tons, sem regra por tom (teste: só a cor da pele muda de um tom para outro) |
| P1-2 turbante parecia gorro | **implementado** | Turbante de amarrar (desenho do revisor, com nó assimétrico no alto) e dastar como itens separados |
| P1-3 fresta de pescoço no hijab | **implementado** | Pano dos ombros sobe até debaixo do queixo, com a dobra marcada |
| P1-4 recompensa disputando vaga com identidade | **implementado** | Nova vaga `paramento` (touca, máscara, óculos de proteção, capelo), por cima do que a pessoa usa: touca sobre o hijab; óculos de proteção sobre os de grau; em turbante e dastar, o pano veste a cor da touca com a faixa na testa |
| P2-1 cabelo × pele | **implementado em parte** | Sombra de raiz; marca clara ou escura conforme a cor do cabelo. Barba curta no tom mais escuro continua pouco visível (limite do estilo sem contorno) |
| P2-2 figura some no fundo | **implementado** | Cores de tecido um passo mais escuras que o fundo de mesmo nome (contraste ≥ 1,4, com teste); item inicial sem roupa igual ao fundo; aviso no editor com botão "Usar fundo com mais contraste" (nunca bloqueio). Não feito: ordenar os fundos pelo contraste |
| P2-3 fundos escuros somem na tela | **implementado** | Aro próprio (`#6b7ba4`) em ardósia, noite, faixa, mostrador e escudo |
| P2-4 molduras iguais a 32 px | **implementado** | Escada por cor, largura (6 ou 12 un.) e selos grandes; nível no canto superior esquerdo, conquista no direito. "Dez mil" ganhou selo claro com estrela escura, para não se confundir com a chama. O nome da moldura entra no texto alternativo e, na linha do ranking, em texto para leitor de tela |
| P2-5 nomes no masculino | **implementado no catálogo; proposto nos títulos de nível** | Monitoria, Diretoria de Liga, Internato, Preceptoria, Titular, Neutra, Calvície com laterais, Sem cabelo. Os títulos de nível em `src/core/scoring.ts` (Calouro, Monitor, Diretor de Liga, Interno, Preceptor, Professor Titular) **não foram alterados**: é decisão de produto do Cristiano |
| P2-6 a P2-9 tranças, crespo curto, calvície, raspado | **implementado** | Desenhos do revisor; lateral raspada limitada ao contorno da cabeça |
| P2-10, P2-11 máscara, martelo, lanterna, lupa | **implementado** | Máscara abaixo dos olhos; martelo em "T"; lanterna acesa de corpo escuro; lupa dentro da zona segura |
| P2-12 capelo e chama | **implementado** | Com capelo, o volume do coque some; sobre turbante e dastar o capelo não é desenhado e o jogador tem o **canudo** (mesma conquista); chama no canto |
| P2-13 acessórios sob o hijab | **implementado** | Com pano de ombros, o que se usa no corpo vai por cima; cordões do moletom não aparecem |
| P2-14 cor da cobertura | **implementado** | Campo `corCabeca` com preto, branco, areia, marinho e as oito cores de tecido |
| P2-15 tons de pele | **implementado** | 13 tons em ordem de luminância: os 8 anteriores, um intermediário escuro, um abaixo do mais escuro e três de subtom oliva. Cores do revisor; conferidas em prancha, **não conferidas por pessoas** |
| P2-16 peças que faltam | **implementado em parte** | Entraram: quipá (sobre o cabelo), dreads (desenho inicial), crespo preso, entradas, longo com franja, cabelo branco, óculos de aro fino e de lentes escuras, aparelho auditivo, implante coclear, cordão de girassol, canudo. **Não entraram**: barba com cor própria, lenço, filá/kufi, boné, marcas do rosto, tranças rentes, cacheado curto. `apoio` é escolha única: não dá para combinar aparelho auditivo e cordão de girassol. Não incluir sem consulta: cocar, pintura corporal indígena, cordão de quebra-cabeça |
| P2-17 sorteio | **implementado** | O sorteio nunca veste cobertura de cabeça nem item de apoio; com avatar existente, mantém pele, óculos, cobertura e apoio; troca o fundo quando a pessoa se confunde com ele (testes) |
| P2-18 texto alternativo | **implementado** | "Avatar de {nome}: … . Moldura {nome}." com forma própria por cabelo e por cor ("tranças pretas", "dreads castanhos"); teste garante que nenhum cabelo × cor deixa marcador sobrando e que o catálogo não tem palavra de gênero, raça, religião, idade ou saúde |
| P3 | **implementado em parte** | Fresta do "curto", touca com silhueta própria, capote sem costura na frente, olivas do estetoscópio, olheiras do "pós-plantão" a 40 %, bochechas a 22 %. Não feito: black power com ondas menores, segunda largura de ombros |

## Pendências que dependem de pessoas (não resolvidas por agente)

1. **Conferência por quem usa as peças**, antes de publicar: hijab, turbante, dastar, quipá, tranças, dreads, cabelo crespo, aparelho auditivo, implante coclear, cordão de girassol.
2. **Conferência por estudantes negros** do par claro no lábio e da esclera (o ponto em que uma correção de legibilidade pode virar caricatura).
3. **Teste com leitor de tela real** (o texto alternativo e o editor foram conferidos por teste automático e por leitura do código, não com TalkBack/VoiceOver).
4. Três dados do relatório vieram de memória do revisor e **não foram conferidos na fonte**: valores da escala Monk, matrizes de simulação de daltonismo e percentuais do Censo 2022. O número da lei do cordão de girassol também não foi conferido e não é citado no app.
5. Decisão do Cristiano: nomes neutros para os títulos de nível.

---

# Revisão independente dos avatares montáveis do MedLiga

Legibilidade, acessibilidade (WCAG 2.2) e representação · 13/11/2026

**O que foi revisado.** `src/modules/avatar/` (`tipos.ts`, `pecas.ts`, `catalogo.ts`, `montar.ts`) e as seis pranchas em `avatares/revisao/` (geradas às 15:42). O estilo (formas arredondadas e chapadas, sem contorno, moldura redonda) foi tomado como dado.

**O repositório mudou durante a revisão.** Comecei sobre o commit `5324eb0`. Enquanto eu media, entraram três commits: `9b04fb8` (15:54: `Avatar.tsx`, `EditorAvatar.tsx`, `regras.ts`), `59221a6` (16:01) e `5aea149` (16:05: **turbante redesenhado e dastar novo**). Consequências:
- O achado P1-2 (turbante = gorro) valia para `5324eb0` e **já foi corrigido pelo autor em `5aea149`**. Conferi a versão nova (prancha `t16-turbante-autor.png`); o resultado está em P1-2.
- As pranchas de estado atual `t1` a `t5` são de antes das 16:05 e mostram o turbante antigo; `t13` e `t16` mostram o novo.
- Li `Avatar.tsx`, `EditorAvatar.tsx` e `regras.ts` só para não recomendar o que já existe e para conferir o texto alternativo e o sorteio. **Não é uma revisão desses três arquivos.**
- Cores, rosto, cabelos, hijab, touca, acessórios, fundos e molduras não mudaram entre `5324eb0` e `5aea149` (`git diff` só toca o turbante, o dastar e uma linha do catálogo): as medições valem para os dois.

**Como.** (1) Contraste nominal: razão WCAG entre as cores do catálogo, com as opacidades compostas como o navegador faz. (2) Contraste efetivo: cada avatar foi rasterizado no Chromium a 32, 56 e 96 px (1× e 2×) e medido pixel a pixel na região dos olhos e da boca. (3) Daltonismo simulado (protanopia, deuteranopia, tritanopia). (4) Pranchas próprias com as combinações pedidas e com os pixels ampliados. (5) Cada correção de desenho sugerida abaixo foi montada num protótipo **em memória** (`revisao-trabalho/proposta.ts`) e renderizada antes de entrar no relatório.

**Estado: tudo aqui é PROPOSTO; nada foi implementado.** O repositório não foi alterado e não há commit. Onde está escrito "testado em protótipo", a evidência é uma prancha ou uma medição em `revisao-trabalho/`; onde está "não testado", é só recomendação.

**Limites desta revisão.**
- Foi feita por um agente de IA. Em representação (hijab, turbante, dastar, quipá, cabelo crespo, tranças, dreads, aparelhos), as correções seguem referências gerais de como essas peças são, mas **não substituem a conferência por pessoas que as usam**. Antes de publicar, mostre as peças novas a estudantes desses grupos.
- 3:1 é o mínimo do critério 1.4.11 (contraste não textual) para elementos gráficos necessários à compreensão. Um traço de rosto num avatar não é, a rigor, "necessário à compreensão"; uso 3:1 como régua porque o problema aqui é de equidade: o rosto precisa ler igual em todos os tons.
- A razão WCAG mede só luminância. Duas cores de matiz diferente e luminância igual (grisalho sobre pele média) dão 1,1:1 e ainda assim se separam para quem tem visão de cores típica; por isso há também ΔE2000 e a simulação de daltonismo.
- Três dados entram de memória e **não foram conferidos na fonte** nesta revisão: os dez valores da escala Monk, as matrizes de simulação de daltonismo (Machado et al., 2009) e os percentuais do Censo 2022. Estão marcados onde aparecem.

---

## 1. Resumo

| | Achado | Peça | Evidência |
|---|---|---|---|
| **P1-1** | Olhos, boca e aro dos óculos somem nos tons 7 e 8 (e enfraquecem no 6): a tinta #0b1220 dá 2,43:1 e 1,63:1 contra a pele; a 32 px não sobra um pixel com 3:1 | `rosto` (todas), `oculos` | tabelas B e I |
| ~~P1-2~~ | **Corrigido pelo autor em `5aea149`, durante a revisão.** Em `5324eb0` o "turbante" era um gorro, com a silhueta da touca. A versão nova (amarração alta com nó; dastar separado) lê como turbante e como dastar a 200, 56 e 32 px. Restam ajustes menores | `cabeca: turbante`, `dastar` | prancha 3 (antes), `t16` (depois) |
| **P1-3** | Hijab deixa uma fresta de pele do pescoço entre o pano da cabeça e o dos ombros (45 un², 1,25 a 2,75 un. de altura) | `cabeca: hijab` | medição por pixel |
| **P1-4** | Duas recompensas disputam a vaga com peças de identidade: a touca cirúrgica (nível 30) com hijab, turbante e dastar, e os óculos de proteção com os óculos de grau. Quem usa uma cobertura ou óculos só usa a recompensa se tirar do avatar o que o representa | `cabeca: touca`, `oculos: protecao` | `catalogo.ts`, `montar.ts` |
| P2-1 | Cabelo não se separa da testa em 19 dos 72 pares cor × tom (< 1,5:1): loiro e grisalho nos tons 2 a 4, castanho no 7, castanho-escuro e preto no 8 | `corCabelo`, `barba` | tabela C |
| P2-2 | A figura some no fundo que o próprio aluno escolhe: pele × fundo < 1,5:1 em 31 de 112 pares; três cores de roupa são idênticas às de fundo; hijab e turbante da cor do fundo desaparecem | `fundo`, `corRoupa` | tabelas F e J |
| P2-3 | Fundos "noite", "mostrador", "faixa" e "escudo" não se destacam da tela (1,00 a 1,55:1); "ardósia" fica em 1,98:1 | `fundo` | tabela D |
| P2-4 | A 32 px as dez molduras viram cinco grupos: "Diretor de Liga" (nível 15), "Residente" (30) e "Preceptor" (40) são o mesmo anel dourado, e "Professor Titular" (50) difere deles por um ponto escuro | `moldura` | tabela E, `t3` |
| P2-5 | Cinco molduras, uma expressão e um cabelo têm nome no masculino | `moldura`, `rosto: serio`, `cabelo: calvo-lateral` | `catalogo.ts` |
| P2-6 | Tranças: a textura some justamente no cabelo preto (1,02:1) e são só duas de cada lado | `cabelo: trancas` | `t5`, `t9` |
| P2-7 | Crespo curto: nove bolas grandes (lê como cacheado) e uma fresta de pele no topo (10 un²) | `cabelo: curto-crespo` | `t5`, medição |
| P2-8 | Calvo com laterais: os tufos terminam em ponta para cima | `cabelo: calvo-lateral` | `t5` |
| P2-9 | Raspado é um fio de 2 un. no alto da cabeça: lê como careca com contorno | `cabelo: raspado` | `t14` |
| P2-10 | Máscara cobre 37 % do olho e some na pele clara (1,07 a 1,36:1 nos tons 1 a 3) | `acessorio: mascara` | medição, tabela G |
| P2-11 | Martelo de reflexos lê como bandeirinha; lanterna clínica quase não aparece sobre o jaleco (1,51:1); lupa cortada pela borda | `acessorio: martelo`, `lanterna`, `lupa` | `t10`, `t11` |
| P2-12 | Capelo: o coque passa por cima dele; com turbante ou touca, sobra pano dos lados. Chama da moldura cai em cima de capelo, coque, topete e black power | `acessorio: capelo`, `moldura: chama*` | `t2` |
| P2-13 | Com hijab, estetoscópio, fones, crachá e cordões do moletom ficam por baixo do pano e aparecem só as pontas | `montar.ts` (ordem) | `t2` |
| P2-14 | Cobertura de cabeça só existe na cor da roupa, e a paleta não tem preto, branco, areia nem marinho | `corRoupa` | — |
| P2-15 | Tons de pele: um só subtom (alaranjado), passos maiores no lado escuro, nada abaixo do Monk 9 | `pele` | tabela A |
| P2-16 | Faltam peças de identidade: quipá, dreads, crespo preso, aparelho auditivo, implante coclear, óculos de lentes escuras | — | seção 7 |
| P2-17 | O sorteio do primeiro acesso veste hijab, turbante ou dastar em 30 % dos alunos novos e dá pelo menos um par de baixo contraste (pele, roupa ou cabelo × fundo < 1,3:1) em 45 % | `regras.ts: sortearAvatar` | `alt-atual.ts` |
| P2-18 | O texto alternativo que existe compõe frases como "cabelo tranças preto" e "cabelo calvo com laterais grisalho", e não cita a moldura | `regras.ts: descricaoAvatar` | `alt-atual.ts`, seção 5 |

P3 (refinamentos) estão na seção 3.3. O que está bom está na seção 3.4.

**As quatro correções que mais rendem**, todas com o desenho testado em protótipo:
1. Rosto: esclera em amêndoa nos olhos abertos, par claro colado a cada traço escuro e modo compacto até 40 px. Leva o olho aberto dos tons 7 e 8 de 1,59 e 1,45:1 para 3,23 e 4,16:1 a 32 px @1x, e de 2,45 e 1,64:1 para 7,65 e 11,39:1 a 32 px @2x, sem tocar nos tons de pele.
2. Coberturas: hijab sem fresta, quipá novo, touca com silhueta própria, cor própria para a cobertura (turbante e dastar o autor já refez).
3. Recompensas em camada própria (touca por cima do hijab, proteção por cima dos óculos de grau).
4. Molduras em escada que sobrevive a 32 px (largura do anel, cor e gemas grandes) e aro de base nos fundos escuros.

---

## 2. Contrastes medidos

Legenda: razão de contraste WCAG 2.x (1 a 21). **negrito ✗** = abaixo de 1,5:1 (some); △ = entre 1,5 e 3:1 (fraco; abaixo do mínimo de 3:1 do critério 1.4.11 para elementos gráficos); sem marca = 3:1 ou mais. Nas tabelas geradas por script o separador decimal é o ponto.

### A. Escala dos tons de pele

| tom | cor | luminância | L* | C* | matiz h° | ITA | classe ITA | ΔL* (passo) | ΔE2000 (passo) | contraste c/ anterior |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| p1 | #fbe4d2 | 0.806 | 92.0 | 12.7 | 66.7 | 74.5° | muito claro | — | — | — |
| p2 | #f4cfae | 0.669 | 85.5 | 22.8 | 68.8 | 59.1° | muito claro | 6.5 | 7.1 | 1.19 |
| p3 | #e6b58c | 0.518 | 77.1 | 30.3 | 65.9 | 44.4° | claro | 8.3 | 6.8 | 1.27 |
| p4 | #d29a6c | 0.379 | 67.9 | 35.8 | 64.4 | 29.1° | intermediário | 9.2 | 7.3 | 1.32 |
| p5 | #b97d52 | 0.256 | 57.6 | 37.7 | 60.3 | 13.2° | bronzeado | 10.3 | 9.0 | 1.40 |
| p6 | #99613c | 0.156 | 46.5 | 35.7 | 58.0 | -6.6° | marrom | 11.1 | 11.1 | 1.48 |
| p7 | #77472c | 0.086 | 35.2 | 30.4 | 54.4 | -30.9° | escuro | 11.3 | 10.4 | 1.52 |
| p8 | #55301e | 0.041 | 24.1 | 23.8 | 51.4 | -54.3° | escuro | 11.1 | 9.1 | 1.49 |

Referência — escala Monk Skin Tone (10 tons, Google/Ellis Monk):

| MST | cor | L* | C* | matiz h° | ITA | tom do catálogo mais próximo (ΔE2000) |
|---|---:|---:|---:|---:|---:|---:|
| 1 | #f6ede4 | 94.2 | 5.6 | 74.5 | 83.0° | p1 (5.9) |
| 2 | #f3e7db | 92.3 | 7.6 | 74.2 | 80.2° | p1 (4.3) |
| 3 | #f7ead0 | 93.1 | 14.2 | 89.1 | 71.7° | p1 (6.6) |
| 4 | #eadaba | 87.6 | 17.8 | 88.5 | 64.7° | p1 (7.8) |
| 5 | #d7bd96 | 77.9 | 23.4 | 81.5 | 50.3° | p2 (7.2) |
| 6 | #a07e56 | 55.1 | 27.9 | 73.8 | 10.9° | p5 (7.6) |
| 7 | #825c43 | 42.5 | 23.9 | 59.0 | -20.1° | p6 (6.3) |
| 8 | #604134 | 30.7 | 17.7 | 48.8 | -55.4° | p8 (5.9) |
| 9 | #3a312a | 21.1 | 6.5 | 65.7 | -78.3° | p8 (12.4) |
| 10 | #292420 | 14.6 | 3.8 | 67.2 | -84.3° | p8 (15.7) |

Leitura da tabela A:
- **Passos.** ΔE2000 entre vizinhos vai de 6,8 a 11,1; o passo em L* cresce de 6,5 (p1→p2) para 11,3 (p6→p7). Há três tons no terço claro (L* 77 a 92) e dois no terço escuro (L* 24 a 35). Não é um defeito grave, mas quem está entre p6 e p7, ou abaixo de p8, tem menos escolha do que quem está entre p1 e p3.
- **Subtom.** Os oito tons ficam na mesma matiz (h 51° a 69°, croma 13 a 38): é uma rampa só, alaranjada. Os tons médios e claros da escala Monk são mais amarelados e menos saturados (h 74° a 89°). Pele oliva ou amarelada (parte dos pardos, descendentes de asiáticos, indígenas) não tem par.
- **Extremos.** Monk 1 a 4 têm p1 como vizinho mais próximo (ΔE 4 a 8). p8 (L* 24,1) fica entre Monk 8 e Monk 9; Monk 10 (L* 14,6) está 9,5 L* abaixo (ΔE 15,7).
- A classe ITA é só uma régua de espaçamento: são cores de ilustração, não medidas de pele.
- Os valores da escala Monk vêm de memória (publicados pelo Google em skintone.google); confira antes de citar.

### B. Traços do rosto contra cada tom de pele

| tom | cor | olhos/boca/sobrancelha/aro (#0b1220) × pele | branco puro × pele | arco claro sob a boca (branco 24 %) × pele | arco claro × boca | bochecha (coral 26 %) × pele | sombra do pescoço (tinta 16 %) × pele | olheira "pós-plantão" (tinta 32 %) × pele | arco claro do olho "alegre" (branco 20 %) × pele | lente dos óculos (branco 18 %) × pele |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| p1 | #fbe4d2 | 15.27 | **1.23** ✗ | #fceadd **1.05** ✗ | 16.05 | **1.25** ✗ | **1.40** ✗ | 2.05 △ | **1.04** ✗ | **1.04** ✗ |
| p2 | #f4cfae | 12.82 | **1.46** ✗ | #f7dbc1 **1.10** ✗ | 14.09 | **1.20** ✗ | **1.39** ✗ | 2.01 △ | **1.08** ✗ | **1.07** ✗ |
| p3 | #e6b58c | 10.12 | 1.85 △ | #ecc7a8 **1.17** ✗ | 11.84 | **1.14** ✗ | **1.37** ✗ | 1.95 △ | **1.14** ✗ | **1.13** ✗ |
| p4 | #d29a6c | 7.65 | 2.45 △ | #ddb28f **1.27** ✗ | 9.68 | **1.06** ✗ | **1.34** ✗ | 1.86 △ | **1.22** ✗ | **1.19** ✗ |
| p5 | #b97d52 | 5.45 | 3.43 | #ca9c7c **1.40** ✗ | 7.63 | **1.03** ✗ | **1.31** ✗ | 1.75 △ | **1.33** ✗ | **1.29** ✗ |
| p6 | #99613c | 3.68 | 5.09 | #b1876b 1.59 △ | 5.84 | **1.16** ✗ | **1.26** ✗ | 1.59 △ | **1.47** ✗ | **1.42** ✗ |
| p7 | #77472c | 2.43 △ | 7.71 | #98735f 1.82 △ | 4.41 | **1.31** ✗ | **1.19** ✗ | **1.40** ✗ | 1.65 △ | 1.57 △ |
| p8 | #55301e | 1.63 △ | 11.49 | #7e6254 2.05 △ | 3.34 | **1.46** ✗ | **1.11** ✗ | **1.22** ✗ | 1.82 △ | 1.71 △ |

Brilho do olho (branco a 90 % sobre a tinta = #e7e7e9) × olho: 15.18:1 em qualquer tom — o problema do brilho é o tamanho (raio 1,3 un. = 0,42 px de diâmetro a 32 px), não a cor.

Leitura da tabela B:
- A tinta dos traços passa de 3:1 só até o tom 6 (3,68). No 7 cai para 2,43 e no 8 para 1,63.
- O "arco claro sob a boca" (branco a 24 %) chega a 1,82 e 2,05 nos tons 7 e 8: ajuda, mas não chega a 3:1. O brilho do olho tem contraste alto e tamanho de 0,42 px a 32 px: não aparece.
- Bochecha, sombra do pescoço, olheira e lente dos óculos ficam abaixo de 1,5:1 em quase todos os tons. Isso é aceitável para detalhe (são sombras), mas a olheira é o que identifica o "pós-plantão": nos tons 7 e 8 (1,40 e 1,22) a expressão perde a marca.

### C. Cor do cabelo contra cada tom de pele (o cabelo se separa da testa?)

| cabelo | cor | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| preto | #1f1a1e | 13.99 | 11.74 | 9.27 | 7.00 | 5.00 | 3.37 | 2.22 △ | **1.49** ✗ |
| castanho-escuro | #3d2a22 | 11.03 | 9.26 | 7.31 | 5.53 | 3.94 | 2.66 △ | 1.75 △ | **1.18** ✗ |
| castanho | #6b452d | 6.81 | 5.72 | 4.52 | 3.41 | 2.43 △ | 1.64 △ | **1.08** ✗ | **1.38** ✗ |
| ruivo | #b5532a | 4.04 | 3.40 | 2.68 △ | 2.03 △ | **1.44** ✗ | **1.03** ✗ | 1.56 △ | 2.32 △ |
| loiro | #dbb46c | 1.59 △ | **1.34** ✗ | **1.06** ✗ | **1.25** ✗ | 1.76 △ | 2.60 △ | 3.95 | 5.89 |
| grisalho | #aab0ba | 1.78 △ | **1.49** ✗ | **1.18** ✗ | **1.12** ✗ | 1.57 △ | 2.33 △ | 3.54 | 5.27 |
| azul | #2a9bb8 | 2.64 △ | 2.22 △ | 1.75 △ | **1.32** ✗ | **1.06** ✗ | 1.57 △ | 2.38 △ | 3.54 |
| rosa | #e05a9c | 2.80 △ | 2.35 △ | 1.86 △ | **1.40** ✗ | **1.00** ✗ | **1.48** ✗ | 2.25 △ | 3.34 |
| violeta | #7c5cd6 | 3.93 | 3.30 | 2.60 △ | 1.97 △ | **1.40** ✗ | **1.06** ✗ | 1.60 △ | 2.38 △ |

Peças translúcidas (a cor do cabelo é misturada à pele): "raspado" (55 %), laterais de "lateral-raspada" (50 %), "barba-curta" (60 %). Contraste da mistura contra a pele:

**raspado (55 %)**

| cabelo | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| preto | 3.63 | 3.44 | 3.17 | 2.85 △ | 2.46 △ | 2.03 △ | 1.62 △ | **1.27** ✗ |
| castanho-escuro | 3.15 | 2.96 △ | 2.71 △ | 2.42 △ | 2.08 △ | 1.72 △ | **1.37** ✗ | **1.10** ✗ |
| castanho | 2.52 △ | 2.35 △ | 2.13 △ | 1.88 △ | 1.60 △ | **1.31** ✗ | **1.04** ✗ | **1.19** ✗ |
| ruivo | 2.06 △ | 1.89 △ | 1.69 △ | **1.47** ✗ | **1.23** ✗ | **1.01** ✗ | **1.27** ✗ | 1.59 △ |
| loiro | **1.28** ✗ | **1.17** ✗ | **1.03** ✗ | **1.13** ✗ | **1.38** ✗ | 1.75 △ | 2.26 △ | 2.89 △ |
| grisalho | **1.35** ✗ | **1.24** ✗ | **1.10** ✗ | **1.05** ✗ | **1.27** ✗ | 1.61 △ | 2.08 △ | 2.65 △ |
| azul | 1.71 △ | 1.59 △ | **1.43** ✗ | **1.25** ✗ | **1.05** ✗ | **1.19** ✗ | 1.52 △ | 1.94 △ |
| rosa | 1.76 △ | 1.61 △ | **1.43** ✗ | **1.23** ✗ | **1.02** ✗ | **1.22** ✗ | 1.57 △ | 1.98 △ |
| violeta | 2.02 △ | 1.88 △ | 1.69 △ | **1.48** ✗ | **1.25** ✗ | **1.01** ✗ | **1.25** ✗ | 1.58 △ |

**lateral-raspada, laterais (50 %)**

| cabelo | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| preto | 3.15 | 3.01 | 2.80 △ | 2.56 △ | 2.25 △ | 1.90 △ | 1.55 △ | **1.25** ✗ |
| castanho-escuro | 2.78 △ | 2.64 △ | 2.44 △ | 2.21 △ | 1.94 △ | 1.63 △ | **1.33** ✗ | **1.09** ✗ |
| castanho | 2.29 △ | 2.15 △ | 1.97 △ | 1.76 △ | 1.53 △ | **1.28** ✗ | **1.04** ✗ | **1.17** ✗ |
| ruivo | 1.92 △ | 1.78 △ | 1.61 △ | **1.42** ✗ | **1.21** ✗ | **1.01** ✗ | **1.25** ✗ | 1.53 △ |
| loiro | **1.25** ✗ | **1.15** ✗ | **1.03** ✗ | **1.12** ✗ | **1.34** ✗ | 1.67 △ | 2.11 △ | 2.64 △ |
| grisalho | **1.32** ✗ | **1.22** ✗ | **1.09** ✗ | **1.05** ✗ | **1.25** ✗ | 1.54 △ | 1.95 △ | 2.43 △ |
| azul | 1.63 △ | 1.53 △ | **1.39** ✗ | **1.23** ✗ | **1.06** ✗ | **1.16** ✗ | **1.45** ✗ | 1.81 △ |
| rosa | 1.67 △ | 1.55 △ | **1.39** ✗ | **1.21** ✗ | **1.02** ✗ | **1.20** ✗ | 1.50 △ | 1.86 △ |
| violeta | 1.88 △ | 1.77 △ | 1.61 △ | **1.43** ✗ | **1.23** ✗ | **1.01** ✗ | **1.22** ✗ | 1.51 △ |

**barba-curta (60 %)**

| cabelo | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| preto | 4.21 | 3.94 | 3.59 | 3.17 | 2.68 △ | 2.16 △ | 1.68 △ | **1.30** ✗ |
| castanho-escuro | 3.58 | 3.34 | 3.02 | 2.65 △ | 2.24 △ | 1.81 △ | **1.41** ✗ | **1.11** ✗ |
| castanho | 2.78 △ | 2.57 △ | 2.30 △ | 2.00 △ | 1.67 △ | **1.34** ✗ | **1.05** ✗ | **1.21** ✗ |
| ruivo | 2.21 △ | 2.02 △ | 1.78 △ | 1.52 △ | **1.25** ✗ | **1.01** ✗ | **1.30** ✗ | 1.66 △ |
| loiro | **1.31** ✗ | **1.19** ✗ | **1.03** ✗ | **1.15** ✗ | **1.42** ✗ | 1.83 △ | 2.42 △ | 3.15 |
| grisalho | **1.39** ✗ | **1.27** ✗ | **1.11** ✗ | **1.06** ✗ | **1.30** ✗ | 1.68 △ | 2.21 △ | 2.88 △ |
| azul | 1.80 △ | 1.65 △ | **1.47** ✗ | **1.27** ✗ | **1.04** ✗ | **1.22** ✗ | 1.60 △ | 2.08 △ |
| rosa | 1.86 △ | 1.69 △ | **1.48** ✗ | **1.26** ✗ | **1.02** ✗ | **1.25** ✗ | 1.63 △ | 2.10 △ |
| violeta | 2.17 △ | 2.00 △ | 1.78 △ | 1.53 △ | **1.27** ✗ | **1.01** ✗ | **1.29** ✗ | 1.65 △ |

Leitura da tabela C: dos 72 pares, 19 ficam abaixo de 1,5:1 e 28 entre 1,5 e 3:1. Só com as seis cores naturais (livres): 12 de 48 abaixo de 1,5:1. Os casos que importam por serem comuns: **loiro nos tons 2, 3 e 4** (1,34 / 1,06 / 1,25), **grisalho nos tons 2, 3 e 4** (1,49 / 1,18 / 1,12), **castanho no tom 7** (1,08), **castanho-escuro no tom 8** (1,18), **preto no tom 8** (1,49). O último tem limite físico: contra #55301e, nem o preto puro passa de 1,82:1.

### D. Fundos contra a tela (#0b1220) e o cartão (#131c30)

| fundo | cor principal | × tela | × cartão |
|---|---:|---:|---:|
| verde-agua | #2dd4bf | 10.06 | 9.12 |
| ouro | #f5b942 | 10.61 | 9.62 |
| azul | #4f8ef7 | 5.84 | 5.29 |
| coral | #f0705a | 6.39 | 5.80 |
| violeta | #8b7cf0 | 5.56 | 5.05 |
| verde | #34b98a | 7.54 | 6.84 |
| rosa | #ee7fb0 | 7.40 | 6.71 |
| ceu | #7dd3fc | 11.23 | 10.19 |
| ardosia | #33456e | 1.98 △ | 1.79 △ |
| noite | #1a2540 | **1.23** ✗ | **1.12** ✗ |
| faixa | #1a2540 | **1.23** ✗ | **1.12** ✗ |
| folhetos | #4f8ef7 | 5.84 | 5.29 |
| tempo | #131c30 | **1.10** ✗ | **1.00** ✗ |
| liga | #0f3b46 | 1.55 △ | **1.40** ✗ |

Nos fundos compostos a cor medida é a base (a que encosta na borda do círculo): "faixa" tem também verde-água e ouro; "folhetos", vermelho #e5534b e amarelo #f2c94c; "tempo", marcas em ouro; "liga", contorno verde-água a 55 %.

### E. Molduras contra a tela, o cartão e entre si

| moldura | cor do anel | largura (un.) | largura a 32 px | largura a 56 px | largura a 96 px | detalhe que a distingue | × tela | × cartão |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| monitor | #2dd4bf | 6 | 0.96 px | 1.68 px | 2.88 px | — | 10.06 | 9.12 |
| ligante | #2dd4bf | 7 | 1.12 px | 1.96 px | 3.36 px | fio branco 1,5 | 10.06 | 9.12 |
| diretor | #f5b942 | 6 | 0.96 px | 1.68 px | 2.88 px | — | 10.61 | 9.62 |
| interno | #f5b942 | 7 | 1.12 px | 1.96 px | 3.36 px | fio verde-água 2,5 | 10.61 | 9.62 |
| residente | #f5b942 | 8 | 1.28 px | 2.24 px | 3.84 px | 4 pontos brancos r 5,5 | 10.61 | 9.62 |
| preceptor | #f5b942 | 8 | 1.28 px | 2.24 px | 3.84 px | 6 pontos creme r 5 + 1 branco r 6,5 | 10.61 | 9.62 |
| titular | #f5b942 | 9 | 1.44 px | 2.52 px | 4.32 px | fio branco 1,5 + estrela r 9 | 10.61 | 9.62 |
| chama | #fb923c | 7 | 1.12 px | 1.96 px | 3.36 px | chama 28×36 | 8.27 | 7.50 |
| chama-dourada | #f5b942 | 8 | 1.28 px | 2.24 px | 3.84 px | fio laranja 2,5 + chama 28×36 | 10.61 | 9.62 |
| dez-mil | #f5b942 | 8 | 1.28 px | 2.24 px | 3.84 px | estrela r 11 + 2 estrelas r 6,5 | 10.61 | 9.62 |

Fio escuro interno (#0b1220, 3 un. = 0,48 px a 32 px) × tela: 1.00:1; × cartão: 1.10:1.

Cores das molduras entre si (contraste WCAG e ΔE2000):

|  | verde-água | ouro | laranja | branco | creme |
|---|---:|---:|---:|---:|---:|
| verde-água | — | 1.05 (ΔE 41.2) | 1.22 (ΔE 50.4) | 1.86 (ΔE 28.6) | 1.68 (ΔE 29.6) |
| ouro | 1.05 (ΔE 41.2) | — | 1.28 (ΔE 15.8) | 1.76 (ΔE 29.8) | 1.59 (ΔE 20.7) |
| laranja | 1.22 (ΔE 50.4) | 1.28 (ΔE 15.8) | — | 2.26 (ΔE 33.3) | 2.04 (ΔE 28.4) |
| branco | 1.86 (ΔE 28.6) | 1.76 (ΔE 29.8) | 2.26 (ΔE 33.3) | — | 1.11 (ΔE 13.5) |
| creme | 1.68 (ΔE 29.6) | 1.59 (ΔE 20.7) | 2.04 (ΔE 28.4) | 1.11 (ΔE 13.5) | — |

Anel da moldura contra cada fundo (sem o fio escuro, o anel se fundiria com o fundo onde a razão é baixa):

| anel | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite | faixa | folhetos | tempo | liga |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| verde-água | **1.00** ✗ | **1.05** ✗ | 1.72 △ | 1.57 △ | 1.81 △ | **1.33** ✗ | **1.36** ✗ | **1.12** ✗ | 5.09 | 8.16 | 8.16 | 1.72 △ | 9.12 | 6.50 |
| ouro | **1.05** ✗ | **1.00** ✗ | 1.82 △ | 1.66 △ | 1.91 △ | **1.41** ✗ | **1.43** ✗ | **1.06** ✗ | 5.37 | 8.61 | 8.61 | 1.82 △ | 9.62 | 6.86 |
| laranja | **1.22** ✗ | **1.28** ✗ | **1.42** ✗ | **1.29** ✗ | **1.49** ✗ | **1.10** ✗ | **1.12** ✗ | **1.36** ✗ | 4.18 | 6.71 | 6.71 | **1.42** ✗ | 7.50 | 5.35 |

### F. A figura contra o fundo que o próprio aluno escolhe

**Cor do cabelo × fundo** (o cabelo se separa do fundo?)

| cabelo | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite | faixa | folhetos | tempo | liga |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| preto | 9.21 | 9.72 | 5.34 | 5.85 | 5.09 | 6.90 | 6.78 | 10.28 | 1.81 △ | **1.13** ✗ | **1.13** ✗ | 5.34 | **1.01** ✗ | **1.42** ✗ |
| castanho-escuro | 7.27 | 7.66 | 4.22 | 4.62 | 4.02 | 5.44 | 5.34 | 8.11 | **1.43** ✗ | **1.12** ✗ | **1.12** ✗ | 4.22 | **1.26** ✗ | **1.12** ✗ |
| castanho | 4.49 | 4.73 | 2.60 △ | 2.85 △ | 2.48 △ | 3.36 | 3.30 | 5.01 | **1.13** ✗ | 1.82 △ | 1.82 △ | 2.60 △ | 2.03 △ | **1.45** ✗ |
| ruivo | 2.66 △ | 2.81 △ | 1.55 △ | 1.69 △ | **1.47** ✗ | 2.00 △ | 1.96 △ | 2.97 △ | 1.91 △ | 3.06 | 3.06 | 1.55 △ | 3.43 | 2.44 △ |
| loiro | **1.05** ✗ | **1.11** ✗ | 1.64 △ | 1.50 △ | 1.72 △ | **1.27** ✗ | **1.30** ✗ | **1.17** ✗ | 4.85 | 7.78 | 7.78 | 1.64 △ | 8.70 | 6.20 |
| grisalho | **1.17** ✗ | **1.24** ✗ | **1.47** ✗ | **1.34** ✗ | 1.54 △ | **1.14** ✗ | **1.16** ✗ | **1.31** ✗ | 4.34 | 6.96 | 6.96 | **1.47** ✗ | 7.79 | 5.55 |
| azul | 1.74 △ | 1.84 △ | **1.01** ✗ | **1.11** ✗ | **1.04** ✗ | **1.30** ✗ | **1.28** ✗ | 1.94 △ | 2.92 △ | 4.69 | 4.69 | **1.01** ✗ | 5.24 | 3.74 |
| rosa | 1.85 △ | 1.95 △ | **1.07** ✗ | **1.17** ✗ | **1.02** ✗ | **1.38** ✗ | **1.36** ✗ | 2.06 △ | 2.76 △ | 4.42 | 4.42 | **1.07** ✗ | 4.94 | 3.52 |
| violeta | 2.59 △ | 2.73 △ | 1.50 △ | 1.64 △ | **1.43** ✗ | 1.94 △ | 1.90 △ | 2.89 △ | 1.97 △ | 3.15 | 3.15 | 1.50 △ | 3.53 | 2.51 △ |

**Tom de pele × fundo** (orelhas, careca, pescoço)

| pele | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite | faixa | folhetos | tempo | liga |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| p1 | 1.52 △ | **1.44** ✗ | 2.62 △ | 2.39 △ | 2.75 △ | 2.03 △ | 2.06 △ | **1.36** ✗ | 7.73 | 12.39 | 12.39 | 2.62 △ | 13.85 | 9.88 |
| p2 | **1.27** ✗ | **1.21** ✗ | 2.20 △ | 2.01 △ | 2.31 △ | 1.70 △ | 1.73 △ | **1.14** ✗ | 6.49 | 10.40 | 10.40 | 2.20 △ | 11.63 | 8.29 |
| p3 | **1.01** ✗ | **1.05** ✗ | 1.73 △ | 1.58 △ | 1.82 △ | **1.34** ✗ | **1.37** ✗ | **1.11** ✗ | 5.12 | 8.21 | 8.21 | 1.73 △ | 9.18 | 6.55 |
| p4 | **1.31** ✗ | **1.39** ✗ | **1.31** ✗ | **1.20** ✗ | **1.38** ✗ | **1.01** ✗ | **1.03** ✗ | **1.47** ✗ | 3.87 | 6.21 | 6.21 | **1.31** ✗ | 6.94 | 4.95 |
| p5 | 1.84 △ | 1.95 △ | **1.07** ✗ | **1.17** ✗ | **1.02** ✗ | **1.38** ✗ | **1.36** ✗ | 2.06 △ | 2.76 △ | 4.43 | 4.43 | **1.07** ✗ | 4.95 | 3.53 |
| p6 | 2.73 △ | 2.88 △ | 1.58 △ | 1.74 △ | 1.51 △ | 2.05 △ | 2.01 △ | 3.05 | 1.86 △ | 2.99 △ | 2.99 △ | 1.58 △ | 3.34 | 2.38 △ |
| p7 | 4.14 | 4.37 | 2.40 △ | 2.63 △ | 2.29 △ | 3.11 | 3.05 | 4.63 | **1.23** ✗ | 1.97 △ | 1.97 △ | 2.40 △ | 2.20 △ | 1.57 △ |
| p8 | 6.17 | 6.51 | 3.58 | 3.92 | 3.41 | 4.62 | 4.54 | 6.89 | **1.21** ✗ | **1.32** ✗ | **1.32** ✗ | 3.58 | **1.48** ✗ | **1.05** ✗ |

**Cor da roupa × fundo** (medida contra o "chão": branco a 14 % sobre o fundo, que é o que fica atrás dos ombros nos fundos lisos). O hijab e o turbante usam a cor da roupa: valem as mesmas razões, mas contra o fundo puro (segunda tabela).

| roupa | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| verde-agua | **1.08** ✗ | **1.14** ✗ | **1.44** ✗ | **1.36** ✗ | **1.49** ✗ | **1.17** ✗ | **1.19** ✗ | **1.20** ✗ | 3.42 | 5.26 |
| azul | 2.35 △ | 2.49 △ | 1.51 △ | 1.61 △ | **1.47** ✗ | 1.86 △ | 1.83 △ | 2.62 △ | 1.57 △ | 2.41 △ |
| verde | 1.77 △ | 1.87 △ | **1.14** ✗ | **1.21** ✗ | **1.10** ✗ | **1.40** ✗ | **1.38** ✗ | 1.97 △ | 2.08 △ | 3.20 |
| vinho | 4.18 | 4.43 | 2.69 △ | 2.86 △ | 2.60 △ | 3.30 | 3.26 | 4.65 | **1.13** ✗ | **1.36** ✗ |
| coral | 1.70 △ | 1.80 △ | **1.09** ✗ | **1.16** ✗ | **1.06** ✗ | **1.34** ✗ | **1.32** ✗ | 1.89 △ | 2.17 △ | 3.34 |
| ouro | **1.02** ✗ | **1.08** ✗ | 1.52 △ | **1.43** ✗ | 1.57 △ | **1.24** ✗ | **1.26** ✗ | **1.14** ✗ | 3.61 | 5.55 |
| violeta | 2.79 △ | 2.95 △ | 1.79 △ | 1.91 △ | 1.74 △ | 2.20 △ | 2.18 △ | 3.10 | **1.32** ✗ | 2.03 △ |
| cinza | 2.76 △ | 2.92 △ | 1.77 △ | 1.89 △ | 1.72 △ | 2.18 △ | 2.15 △ | 3.06 | **1.34** ✗ | 2.06 △ |
| jaleco (branco fixo) | 1.61 △ | 1.52 △ | 2.50 △ | 2.35 △ | 2.58 △ | 2.04 △ | 2.06 △ | **1.45** ✗ | 5.92 | 9.11 |
| capote (azul fixo) | **1.27** ✗ | **1.35** ✗ | **1.22** ✗ | **1.15** ✗ | **1.26** ✗ | **1.01** ✗ | **1.01** ✗ | **1.42** ✗ | 2.89 △ | 4.45 |

| cobertura (cor da roupa) × fundo puro | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite | faixa | folhetos | tempo | liga |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| verde-agua | **1.00** ✗ | **1.05** ✗ | 1.72 △ | 1.57 △ | 1.81 △ | **1.33** ✗ | **1.36** ✗ | **1.12** ✗ | 5.09 | 8.16 | 8.16 | 1.72 △ | 9.12 | 6.50 |
| azul | 2.18 △ | 2.30 △ | **1.27** ✗ | **1.39** ✗ | **1.21** ✗ | 1.64 △ | 1.61 △ | 2.44 △ | 2.33 △ | 3.74 | 3.74 | **1.27** ✗ | 4.18 | 2.98 △ |
| verde | 1.64 △ | 1.73 △ | **1.05** ✗ | **1.04** ✗ | **1.10** ✗ | **1.23** ✗ | **1.21** ✗ | 1.83 △ | 3.10 | 4.97 | 4.97 | **1.05** ✗ | 5.56 | 3.96 |
| vinho | 3.88 | 4.09 | 2.25 △ | 2.46 △ | 2.14 △ | 2.90 △ | 2.85 △ | 4.33 | **1.31** ✗ | 2.10 △ | 2.10 △ | 2.25 △ | 2.35 △ | 1.68 △ |
| coral | 1.57 △ | 1.66 △ | **1.10** ✗ | **1.00** ✗ | **1.15** ✗ | **1.18** ✗ | **1.16** ✗ | 1.76 △ | 3.23 | 5.19 | 5.19 | **1.10** ✗ | 5.80 | 4.13 |
| ouro | **1.05** ✗ | **1.00** ✗ | 1.82 △ | 1.66 △ | 1.91 △ | **1.41** ✗ | **1.43** ✗ | **1.06** ✗ | 5.37 | 8.61 | 8.61 | 1.82 △ | 9.62 | 6.86 |
| violeta | 2.59 △ | 2.73 △ | 1.50 △ | 1.64 △ | **1.43** ✗ | 1.94 △ | 1.90 △ | 2.89 △ | 1.97 △ | 3.15 | 3.15 | 1.50 △ | 3.53 | 2.51 △ |
| cinza | 2.56 △ | 2.70 △ | **1.48** ✗ | 1.62 △ | **1.41** ✗ | 1.92 △ | 1.88 △ | 2.85 △ | 1.99 △ | 3.19 | 3.19 | **1.48** ✗ | 3.57 | 2.54 △ |

Contagem da tabela F: pele × fundo, 31 de 112 pares abaixo de 1,5:1; cabelo × fundo, 38 de 126; roupa × fundo liso, 29 de 80; cobertura × fundo, 31 de 112. Tons 7 e 8 contra os cinco fundos escuros: nenhum par chega a 3:1 e 6 de 10 ficam abaixo de 1,5:1. Cabelo preto ou castanho-escuro contra os cinco fundos escuros: 9 de 10 abaixo de 1,5:1.

### G. Peças de cor fixa contra a pele

| peça | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| máscara #bfe3ee | **1.11** ✗ | **1.07** ✗ | **1.36** ✗ | 1.80 △ | 2.52 △ | 3.74 | 5.67 | 8.45 |
| jaleco #f4f7fb (gola encosta no pescoço) | **1.14** ✗ | **1.36** ✗ | 1.72 △ | 2.28 △ | 3.19 | 4.73 | 7.18 | 10.69 |
| capote #8db3d6 | 1.79 △ | 1.51 △ | **1.19** ✗ | **1.11** ✗ | 1.56 △ | 2.31 △ | 3.51 | 5.23 |
| aro dos óculos de proteção #22304f | 10.68 | 8.97 | 7.08 | 5.35 | 3.82 | 2.58 △ | 1.70 △ | **1.14** ✗ |
| lente dos óculos de proteção (#7dd3fc a 40 %) | **1.15** ✗ | **1.08** ✗ | **1.01** ✗ | **1.13** ✗ | **1.30** ✗ | 1.55 △ | 1.90 △ | 2.29 △ |
| sombra interna do hijab (tinta 13 %) × pele | **1.31** ✗ | **1.30** ✗ | **1.29** ✗ | **1.27** ✗ | **1.24** ✗ | **1.20** ✗ | **1.15** ✗ | **1.09** ✗ |

**Cor da roupa × pele** (decote, pescoço, hijab em volta do rosto)

| roupa | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| verde-agua | 1.52 △ | **1.27** ✗ | **1.01** ✗ | **1.31** ✗ | 1.84 △ | 2.73 △ | 4.14 | 6.17 |
| azul | 3.31 | 2.78 △ | 2.20 △ | 1.66 △ | **1.18** ✗ | **1.25** ✗ | 1.90 △ | 2.83 △ |
| verde | 2.49 △ | 2.09 △ | 1.65 △ | **1.25** ✗ | **1.12** ✗ | 1.66 △ | 2.52 △ | 3.76 |
| vinho | 5.89 | 4.94 | 3.90 | 2.95 △ | 2.10 △ | **1.42** ✗ | **1.07** ✗ | 1.59 △ |
| coral | 2.39 △ | 2.01 △ | 1.58 △ | **1.20** ✗ | **1.17** ✗ | 1.74 △ | 2.63 △ | 3.92 |
| ouro | **1.44** ✗ | **1.21** ✗ | **1.05** ✗ | **1.39** ✗ | 1.95 △ | 2.88 △ | 4.37 | 6.51 |
| violeta | 3.93 | 3.30 | 2.60 △ | 1.97 △ | **1.40** ✗ | **1.06** ✗ | 1.60 △ | 2.38 △ |
| cinza | 3.88 | 3.26 | 2.57 △ | 1.94 △ | **1.39** ✗ | **1.07** ✗ | 1.62 △ | 2.41 △ |

### H. Tamanho dos traços em pixels (grade de 200 un.)

| traço | 32 px | 56 px | 96 px | 200 px |
|---|---:|---:|---:|---:|
| cabeça (largura 74) | 11.84 | 20.72 | 35.52 | 74.00 |
| olho (largura 8) | 1.28 | 2.24 | 3.84 | 8.00 |
| olho (altura 10) | 1.60 | 2.80 | 4.80 | 10.00 |
| distância entre os olhos (30) | 4.80 | 8.40 | 14.40 | 30.00 |
| brilho do olho (diâmetro 2,6) | 0.42 | 0.73 | 1.25 | 2.60 |
| boca "sorriso" (largura 20) | 3.20 | 5.60 | 9.60 | 20.00 |
| traço da boca (3,2) | 0.51 | 0.90 | 1.54 | 3.20 |
| arco claro sob a boca (2,4) | 0.38 | 0.67 | 1.15 | 2.40 |
| sobrancelha "confiante" (3) | 0.48 | 0.84 | 1.44 | 3.00 |
| aro dos óculos (3) | 0.48 | 0.84 | 1.44 | 3.00 |
| lente redonda (diâmetro 24) | 3.84 | 6.72 | 11.52 | 24.00 |
| fio escuro da moldura (3) | 0.48 | 0.84 | 1.44 | 3.00 |
| anel da moldura (6 a 9) | 0.96 | 1.68 | 2.88 | 6.00 |
| ponto da moldura "residente" (diâmetro 11) | 1.76 | 3.08 | 5.28 | 11.00 |
| estrela da "titular" (diâmetro 18) | 2.88 | 5.04 | 8.64 | 18.00 |
| chama (largura 28) | 4.48 | 7.84 | 13.44 | 28.00 |
| trança (largura 10) | 1.60 | 2.80 | 4.80 | 10.00 |
| martelo: cabeça (30 × 20) | 4.80 | 8.40 | 14.40 | 30.00 |
| lanterna (6 × 28) | 0.96 | 1.68 | 2.88 | 6.00 |
| estetoscópio: tubo (5) | 0.80 | 1.40 | 2.40 | 5.00 |

### I. Contraste efetivo do rosto depois de rasterizado (o que a tela de fato mostra)

Avatar careca, sem óculos, fundo ardósia. Para cada tom e expressão, o avatar foi desenhado num canvas do Chromium e cada pixel da região dos olhos e da boca foi comparado com a cor nominal da pele.

Em cada célula: contraste do pixel mais contrastante contra a pele (nº de pixels de dispositivo com ≥ 3:1), **atual → proposta**. "Olho aberto" = expressões sorriso/sério/confiante; "olho fechado" = alegre. A proposta inclui o modo compacto (figura × 1,3) só a 32 px.

**32 px @1x**

| tom | olho aberto | olho fechado (alegre) | olho fechado (pós-plantão) | boca sorriso | boca séria | boca alegre (dentes) |
|---|---:|---:|---:|---:|---:|---:|
| p1 | 7.22 (2) → 12.83 (8) | 2.51 △ (0) → 4.55 (2) | 2.07 △ (0) → 3.52 (4) | 2.50 △ (0) → 4.60 (2) | 2.43 △ (0) → 2.88 △ (0) | 2.87 △ (0) → 5.66 (4) |
| p2 | 6.32 (2) → 10.77 (7) | 2.44 △ (0) → 4.20 (2) | 2.02 △ (0) → 3.26 (4) | 2.41 △ (0) → 4.30 (2) | 2.37 △ (0) → 2.80 △ (0) | 2.46 △ (0) → 4.85 (4) |
| p3 | 5.28 (2) → 8.50 (5) | 2.28 △ (0) → 3.74 (2) | 1.96 △ (0) → 2.92 △ (0) | 2.29 △ (0) → 3.91 (2) | 2.25 △ (0) → 2.64 △ (0) | 2.31 △ (0) → 3.91 (4) |
| p4 | 4.19 (2) → 6.42 (3) | 2.16 △ (0) → 3.23 (2) | 1.87 △ (0) → 2.56 △ (0) | 2.14 △ (0) → 3.47 (2) | 2.13 △ (0) → 2.46 △ (0) | 2.07 △ (0) → 2.99 △ (0) |
| p5 | 3.16 (2) → 4.58 (3) | 1.97 △ (0) → 2.64 △ (0) | 1.76 △ (0) → 2.12 △ (0) | 1.94 △ (0) → 2.94 △ (0) | 1.96 △ (0) → 2.24 △ (0) | 1.82 △ (0) → 2.19 △ (0) |
| p6 | 2.27 △ (0) → 3.09 (1) | 1.75 △ (0) → 2.09 △ (0) | 1.60 △ (0) → 1.70 △ (0) | 1.71 △ (0) → 2.38 △ (0) | 1.73 △ (0) → 1.93 △ (0) | 1.53 △ (0) → 2.29 △ (0) |
| p7 | 1.59 △ (0) → 3.23 (2) | **1.50** ✗ (0) → 1.60 △ (0) | **1.42** ✗ (0) → **1.38** ✗ (0) | **1.45** ✗ (0) → 1.84 △ (0) | **1.48** ✗ (0) → 1.61 △ (0) | 2.20 △ (0) → 3.47 (2) |
| p8 | **1.45** ✗ (0) → 4.16 (4) | **1.45** ✗ (0) → 1.81 △ (0) | **1.42** ✗ (0) → 1.53 △ (0) | **1.23** ✗ (0) → 2.04 △ (0) | **1.25** ✗ (0) → **1.34** ✗ (0) | 3.27 (2) → 5.16 (2) |

**32 px @2x**

| tom | olho aberto | olho fechado (alegre) | olho fechado (pós-plantão) | boca sorriso | boca séria | boca alegre (dentes) |
|---|---:|---:|---:|---:|---:|---:|
| p1 | 15.27 (14) → 15.27 (23) | 11.22 (8) → 15.27 (14) | 7.64 (8) → 15.27 (12) | 12.36 (8) → 15.27 (16) | 15.27 (6) → 15.27 (16) | 6.50 (10) → 15.27 (10) |
| p2 | 12.82 (14) → 12.82 (21) | 9.77 (8) → 12.82 (12) | 6.96 (8) → 12.82 (12) | 10.63 (8) → 12.82 (16) | 12.82 (6) → 12.82 (16) | 5.46 (8) → 12.82 (10) |
| p3 | 10.12 (14) → 10.12 (18) | 8.03 (8) → 10.12 (12) | 6.00 (8) → 10.12 (10) | 8.59 (8) → 10.12 (16) | 10.12 (6) → 10.12 (16) | 4.31 (6) → 10.12 (8) |
| p4 | 7.66 (11) → 7.65 (16) | 6.37 (8) → 7.65 (12) | 5.01 (8) → 7.65 (10) | 6.71 (6) → 7.65 (12) | 7.65 (6) → 7.65 (16) | 3.26 (4) → 7.65 (8) |
| p5 | 5.49 (10) → 5.45 (19) | 4.75 (6) → 5.45 (12) | 3.94 (6) → 5.45 (10) | 4.89 (5) → 5.45 (10) | 5.45 (6) → 5.45 (16) | 2.48 △ (0) → 5.45 (4) |
| p6 | 3.71 (7) → 5.04 (30) | 3.35 (4) → 3.68 (10) | 2.93 △ (0) → 3.68 (10) | 3.41 (2) → 3.68 (8) | 3.68 (6) → 3.68 (8) | 2.09 △ (0) → 4.12 (6) |
| p7 | 2.45 △ (0) → 7.65 (16) | 2.29 △ (0) → 2.91 △ (0) | 2.11 △ (0) → 3.12 (8) | 2.30 △ (0) → 3.12 (4) | 2.43 △ (0) → 3.12 (6) | 2.20 △ (0) → 6.25 (4) |
| p8 | 1.64 △ (0) → 11.39 (21) | 1.58 △ (0) → 3.92 (8) | 1.51 △ (0) → 4.17 (8) | 1.57 △ (0) → 4.17 (6) | 1.63 △ (0) → 4.17 (6) | 3.27 (4) → 9.30 (10) |

**56 px @1x**

| tom | olho aberto | olho fechado (alegre) | olho fechado (pós-plantão) | boca sorriso | boca séria | boca alegre (dentes) |
|---|---:|---:|---:|---:|---:|---:|
| p1 | 14.19 (10) → 15.27 (10) | 5.61 (6) → 13.77 (10) | 3.19 (6) → 3.65 (6) | 11.82 (6) → 13.62 (8) | 3.57 (4) → 3.52 (8) | 15.27 (6) → 15.27 (6) |
| p2 | 12.03 (10) → 12.82 (10) | 5.21 (5) → 11.68 (10) | 3.07 (5) → 3.36 (6) | 10.19 (6) → 11.65 (6) | 3.37 (4) → 3.28 (8) | 12.82 (6) → 12.82 (6) |
| p3 | 9.59 (10) → 10.12 (8) | 4.66 (4) → 9.39 (8) | 2.90 △ (0) → 2.99 △ (0) | 8.35 (4) → 9.31 (6) | 3.10 (4) → 3.05 (4) | 10.12 (6) → 10.12 (6) |
| p4 | 7.31 (10) → 7.65 (8) | 3.98 (4) → 7.18 (8) | 2.68 △ (0) → 2.57 △ (0) | 6.53 (4) → 7.16 (4) | 2.80 △ (0) → 2.78 △ (0) | 7.65 (6) → 7.65 (6) |
| p5 | 5.27 (8) → 5.45 (6) | 3.29 (4) → 5.21 (6) | 2.38 △ (0) → 2.25 △ (0) | 4.86 (4) → 5.21 (4) | 2.43 △ (0) → 2.48 △ (0) | 5.45 (6) → 5.45 (6) |
| p6 | 3.59 (4) → 3.83 (6) | 2.56 △ (0) → 3.55 (4) | 2.03 △ (0) → 1.94 △ (0) | 3.39 (4) → 3.56 (4) | 1.99 △ (0) → 2.09 △ (0) | 4.46 (4) → 4.46 (4) |
| p7 | 2.39 △ (0) → 5.54 (8) | 1.94 △ (0) → 2.41 △ (0) | 1.66 △ (0) → 1.62 △ (0) | 2.30 △ (0) → 2.65 △ (0) | 1.59 △ (0) → 2.05 △ (0) | 6.76 (4) → 6.76 (4) |
| p8 | 1.62 △ (0) → 7.91 (8) | **1.46** ✗ (0) → 3.06 (2) | **1.45** ✗ (0) → 1.86 △ (0) | 1.59 △ (0) → 3.39 (2) | **1.27** ✗ (0) → 2.48 △ (0) | 10.07 (4) → 10.07 (4) |

**96 px @1x**

| tom | olho aberto | olho fechado (alegre) | olho fechado (pós-plantão) | boca sorriso | boca séria | boca alegre (dentes) |
|---|---:|---:|---:|---:|---:|---:|
| p1 | 15.27 (26) → 15.27 (32) | 15.27 (22) → 15.27 (24) | 15.27 (22) → 15.27 (22) | 15.27 (20) → 15.27 (20) | 15.27 (16) → 15.27 (18) | 15.27 (20) → 15.27 (20) |
| p2 | 12.82 (26) → 12.82 (30) | 12.82 (22) → 12.82 (22) | 12.82 (22) → 12.82 (21) | 12.82 (20) → 12.82 (20) | 12.82 (16) → 12.82 (18) | 12.82 (18) → 12.82 (18) |
| p3 | 10.12 (26) → 10.12 (29) | 10.12 (20) → 10.12 (22) | 10.12 (20) → 10.12 (12) | 10.12 (18) → 10.12 (20) | 10.12 (16) → 10.12 (18) | 10.12 (18) → 10.12 (18) |
| p4 | 7.65 (24) → 7.65 (24) | 7.65 (20) → 7.65 (20) | 7.65 (12) → 7.65 (12) | 7.65 (16) → 7.65 (17) | 7.65 (8) → 7.65 (18) | 7.65 (18) → 7.65 (18) |
| p5 | 5.45 (23) → 5.45 (33) | 5.45 (16) → 5.45 (20) | 5.45 (12) → 5.45 (12) | 5.45 (14) → 5.45 (14) | 5.45 (8) → 5.45 (18) | 5.45 (22) → 5.45 (22) |
| p6 | 3.68 (20) → 5.09 (37) | 3.68 (16) → 3.68 (20) | 3.68 (12) → 3.68 (12) | 3.68 (10) → 3.68 (10) | 3.68 (8) → 3.68 (8) | 5.09 (14) → 5.09 (14) |
| p7 | 4.80 (1) → 7.71 (30) | 2.43 △ (0) → 3.12 (8) | 2.43 △ (0) → 3.12 (10) | 2.43 △ (0) → 3.12 (2) | 2.43 △ (0) → 3.12 (6) | 7.71 (6) → 7.71 (6) |
| p8 | 7.15 (2) → 11.49 (33) | 1.63 △ (0) → 4.17 (13) | 1.63 △ (0) → 4.18 (10) | 2.03 △ (0) → 4.17 (8) | 1.69 △ (0) → 4.17 (8) | 11.49 (16) → 11.49 (16) |

Leitura:
- **Estado atual, 32 px @1x (monitor):** o olho aberto tem 3:1 só até o tom 5; no 6 cai para 2,27, no 7 para 1,59 e no 8 para 1,45. A boca não chega a 3:1 em tom nenhum (2,50 no tom 1; 1,23 no tom 8).
- **Estado atual, 32 px @2x (celular):** tons 1 a 6 passam; **tons 7 e 8 não têm nenhum pixel com 3:1** em olho ou boca (2,45 e 1,64 no olho; 2,30 e 1,57 na boca). A única exceção são os dentes do "alegre" no tom 8.
- **Estado atual, 96 px:** nos tons 7 e 8 só o brilho do olho (1 ou 2 pixels) passa de 3:1.
- **Proposta:** o olho aberto passa de 3:1 em todos os tons e em todos os tamanhos medidos (mínimo 3,09, no tom 6 a 32 px @1x). A 32 px @2x, 56 px @2x e 96 px, olhos e boca passam de 3:1 em todos os tons e expressões, com uma exceção: o olho do "alegre" no tom 7 a 32 px @2x (2,91).
- **O que a proposta não resolve:** em tela de densidade 1× (monitor comum), traços finos continuam abaixo de 3:1 nos tons médios e escuros. A 32 px @1x: olho fechado 1,4 a 2,6 e boca 1,3 a 2,9 nos tons 5 a 8. A 56 px @1x: boca reta 2,0 a 2,8 nos tons 4 a 8, sorriso 2,65 no tom 7, olho do "pós-plantão" 1,6 a 3,0 nos tons 3 a 8. São traços de meio pixel a um pixel; sem contorno e sem regra por tom não há como. Se o placar de 56 px importar em monitor comum, estenda o modo compacto até 56 px.

### J. Daltonismo simulado: tom de pele × fundo e cores das molduras

ΔE2000 entre o tom de pele e o fundo — visão típica / protanopia / deuteranopia / tritanopia. **negrito** = ΔE < 12 em algum tipo de daltonismo (cabeça e fundo se confundem). Entre parênteses, o contraste WCAG (que não muda muito com o daltonismo).

| pele | verde-agua | ouro | azul | coral | violeta | verde | rosa | ceu | ardosia | noite | tempo | liga |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| p1 | **33.0 / 8.2 / 19.4 / 40.1 (1.52)** | 21.8 / 23.1 / 20.7 / 15.7 (1.44) | 41.9 / 41.1 / 46.5 / 51.5 (2.62) | 29.7 / 27.6 / 22.4 / 30.0 (2.39) | 43.0 / 42.9 / 45.8 / 37.1 (2.75) | 35.0 / 15.3 / 19.0 / 42.1 (2.03) | 32.1 / 29.7 / 19.6 / 24.3 (2.06) | 30.9 / 26.8 / 31.7 / 38.6 (1.36) | 60.0 / 58.5 / 62.7 / 64.5 (7.73) | 77.8 / 76.3 / 79.9 / 79.8 (12.39) | 83.6 / 82.1 / 85.4 / 85.1 (13.85) | 67.8 / 63.4 / 68.5 / 70.4 (9.88) |
| p2 | **35.5 / 9.9 / 22.4 / 46.4 (1.27)** | **16.3 / 17.2 / 14.9 / 8.7 (1.21)** | 44.7 / 45.0 / 50.5 / 55.1 (2.20) | 25.9 / 22.0 / 16.5 / 23.9 (2.01) | 45.7 / 46.5 / 49.6 / 39.6 (2.31) | **36.1 / 9.7 / 16.7 / 47.0 (1.70)** | 33.4 / 31.5 / 20.9 / 18.1 (1.73) | 35.4 / 32.2 / 36.8 / 44.3 (1.14) | 59.6 / 58.2 / 63.2 / 65.2 (6.49) | 75.7 / 73.7 / 78.6 / 78.5 (10.40) | 78.4 / 75.9 / 81.1 / 80.6 (11.63) | 66.8 / 61.8 / 68.0 / 70.7 (8.29) |
| p3 | 38.5 / 13.0 / 23.8 / 50.9 (1.01) | **14.0 / 13.6 / 11.7 / 3.3 (1.05)** | 44.9 / 46.5 / 51.8 / 57.1 (1.73) | **21.1 / 15.6 / 10.3 / 17.5 (1.58)** | 45.5 / 47.6 / 50.8 / 39.2 (1.82) | **38.1 / 4.4 / 14.1 / 50.3 (1.34)** | **32.6 / 31.5 / 20.9 / 12.0 (1.37)** | 38.4 / 35.6 / 39.6 / 48.5 (1.11) | 57.1 / 55.5 / 61.4 / 62.4 (5.12) | 67.1 / 64.4 / 71.0 / 69.9 (8.21) | 68.2 / 65.3 / 71.7 / 70.3 (9.18) | 62.8 / 56.7 / 64.4 / 67.2 (6.55) |
| p4 | 41.4 / 18.1 / 25.6 / 54.0 (1.31) | **15.6 / 14.2 / 12.6 / 7.3 (1.39)** | 44.8 / 47.6 / 52.1 / 58.2 (1.31) | **17.4 / 8.3 / 3.7 / 11.9 (1.20)** | 45.1 / 48.3 / 51.1 / 38.3 (1.38) | **39.8 / 6.2 / 12.4 / 52.2 (1.01)** | **32.5 / 31.8 / 21.5 / 7.9 (1.03)** | 41.3 / 39.3 / 42.0 / 51.7 (1.47) | 52.0 / 50.3 / 57.1 / 57.2 (3.87) | 57.4 / 55.0 / 61.7 / 60.0 (6.21) | 58.3 / 55.7 / 62.1 / 60.1 (6.94) | 54.0 / 47.3 / 55.8 / 59.1 (4.95) |
| p5 | 45.6 / 25.0 / 28.2 / 57.4 (1.84) | 22.4 / 20.9 / 18.9 / 15.9 (1.95) | 44.0 / 48.2 / 51.3 / 59.5 (1.07) | **15.3 / 1.9 / 6.0 / 9.9 (1.17)** | 43.5 / 48.2 / 50.3 / 38.3 (1.02) | 43.1 / 14.1 / 13.1 / 54.5 (1.38) | **32.0 / 32.5 / 23.3 / 10.9 (1.36)** | 45.5 / 43.3 / 44.2 / 55.3 (2.06) | 43.8 / 43.0 / 49.4 / 50.3 (2.76) | 48.0 / 46.2 / 52.6 / 51.3 (4.43) | 48.8 / 46.5 / 52.7 / 51.0 (4.95) | 45.4 / 38.0 / 46.2 / 51.5 (3.53) |
| p6 | 50.4 / 34.2 / 33.4 / 60.8 (2.73) | 31.8 / 31.1 / 28.8 / 26.5 (2.88) | 44.8 / 50.1 / 50.9 / 60.8 (1.58) | 20.5 / 12.3 / 16.6 / 17.3 (1.74) | 43.7 / 49.5 / 50.0 / 40.0 (1.51) | 46.8 / 24.9 / 19.4 / 56.7 (2.05) | 35.0 / 35.8 / 28.2 / 20.6 (2.01) | 50.4 / 49.1 / 48.0 / 59.2 (3.05) | 37.2 / 37.7 / 42.6 / 45.5 (1.86) | 39.7 / 38.8 / 44.2 / 44.4 (2.99) | 40.1 / 38.5 / 44.0 / 43.4 (3.34) | 38.4 / 30.6 / 37.9 / 45.6 (2.38) |
| p7 | 57.5 / 45.6 / 41.8 / 65.8 (4.14) | 44.0 / 44.0 / 41.3 / 39.2 (4.37) | 47.2 / 52.9 / 51.5 / 63.3 (2.40) | 30.1 / 21.9 / 29.7 / 28.1 (2.63) | 45.4 / 51.1 / 50.7 / 44.1 (2.29) | 53.0 / 37.5 / 29.9 / 60.7 (3.11) | 41.3 / 40.7 / 37.0 / 33.0 (3.05) | 57.6 / 56.9 / 53.9 / 64.9 (4.63) | 32.4 / 33.6 / 37.3 / 43.1 (1.23) | 32.5 / 32.3 / 36.9 / 39.8 (1.97) | 32.5 / 31.3 / 36.1 / 38.1 (2.20) | 33.6 / 24.6 / 30.9 / 41.9 (1.57) |
| p8 | 66.6 / 58.7 / 52.8 / 73.0 (6.17) | 57.9 / 56.1 / 56.0 / 53.2 (6.51) | 49.6 / 54.8 / 52.4 / 65.0 (3.58) | 38.0 / 29.8 / 40.0 / 36.5 (3.92) | 47.6 / 52.5 / 51.7 / 48.0 (3.41) | 58.0 / 46.5 / 38.7 / 63.9 (4.62) | 47.5 / 44.4 / 46.3 / 42.5 (4.54) | 67.5 / 67.5 / 63.2 / 73.0 (6.89) | 29.6 / 31.1 / 33.7 / 42.7 (1.21) | 26.9 / 27.1 / 30.9 / 37.3 (1.32) | 26.2 / 25.4 / 29.3 / 34.9 (1.48) | 30.8 / 20.7 / 25.7 / 39.9 (1.05) |

Pares pele × fundo com ΔE < 12 sob algum daltonismo: p1×verde-agua, p2×verde-agua, p2×ouro, p2×verde, p3×ouro, p3×coral, p3×verde, p3×rosa, p4×ouro, p4×coral, p4×verde, p4×rosa, p5×coral, p5×rosa

Cores das molduras entre si — ΔE2000 em visão típica / protanopia / deuteranopia / tritanopia:

| | verde-água #2dd4bf | ouro #f5b942 | laranja #fb923c | branco |
|---|---:|---:|---:|---:|
| verde-água #2dd4bf | — | 41.2 / 24.1 / 32.9 / 52.9 | 50.4 / 24.6 / 32.0 / 62.5 | 28.6 / 13.1 / 17.1 / 28.2 |
| ouro #f5b942 | 41.2 / 24.1 / 32.9 / 52.9 | — | 15.8 / 8.6 / 5.1 / 10.0 | 29.8 / 31.1 / 29.1 / 26.9 |
| laranja #fb923c | 50.4 / 24.6 / 32.0 / 62.5 | 15.8 / 8.6 / 5.1 / 10.0 | — | 33.3 / 34.4 / 31.0 / 33.5 |
| branco | 28.6 / 13.1 / 17.1 / 28.2 | 29.8 / 31.1 / 29.1 / 26.9 | 33.3 / 34.4 / 31.0 / 33.5 | — |

Leitura: para quem tem protanopia ou deuteranopia (algo entre 1 em 20 e 1 em 12 homens, conforme a população), a cabeça dos tons 3 a 5 quase se funde com os fundos coral, verde, rosa e ouro (ΔE de 1,9 a 12). O laranja da moldura "Semana cheia" e o ouro das outras ficam a ΔE 5 a 9: a chama é o que distingue, não a cor do anel. As matrizes vêm de memória (Machado, Oliveira e Fernandes, 2009); confira se for citar.

### K. Contrastes nominais das correções propostas

| tom | tinta × pele (atual e proposta) | esclera branca × pele | par claro #ffc4b5 a 65 % × pele | par claro × tinta | melhor dos dois (traço) | melhor dos dois (olho aberto) |
|---|---:|---:|---:|---:|---:|---:|
| p1 | 15.27 | **1.23** ✗ | #fecfbf **1.15** ✗ | 13.28 | 15.27 | 15.27 |
| p2 | 12.82 | **1.46** ✗ | #fbc8b3 **1.03** ✗ | 12.48 | 12.82 | 12.82 |
| p3 | 10.12 | 1.85 △ | #f6bfa7 **1.14** ✗ | 11.51 | 10.12 | 10.12 |
| p4 | 7.65 | 2.45 △ | #efb59b **1.37** ✗ | 10.51 | 7.65 | 7.65 |
| p5 | 5.45 | 3.43 | #e7ab92 1.74 △ | 9.48 | 5.45 | 5.45 |
| p6 | 3.68 | 5.09 | #dba18b 2.30 △ | 8.48 | 3.68 | 5.09 |
| p7 | 2.43 △ | 7.71 | #cf9885 3.13 | 7.59 | 3.13 | 7.71 |
| p8 | 1.63 △ | 11.49 | #c49080 4.18 | 6.82 | 4.18 | 11.49 |
| p9 (sugerido) | **1.25** ✗ | 15.03 | #ba8b7d 5.05 | 6.29 | 5.05 | 15.03 |

Aro de base dos fundos escuros (#6b7ba4, 5 un.): × tela 4.45 · × cartão 4.04 · × noite 3.61 · × ardósia 2.25

Tons sugeridos (para discussão):

| tom | cor | L* | C* | h° | ITA | vizinho mais próximo no catálogo (ΔE2000) | Monk mais próximo (ΔE2000) |
|---|---:|---:|---:|---:|---:|---:|---:|
| p6b (entre p6 e p7) | #885436 | 41.0 | 32.2 | 55.0 | -18.9° (marrom) | p7 (5.0) | MST 7 (4.3) |
| p9 (abaixo de p8) | #3a2015 | 15.4 | 17.0 | 48.7 | -69.7° (escuro) | p8 (7.1) | MST 9 (9.8) |
| oliva claro | #e6c9a0 | 82.5 | 24.6 | 80.1 | 53.2° (claro) | p2 (5.0) | MST 5 (3.2) |
| oliva médio | #c49b68 | 66.7 | 33.6 | 74.9 | 27.1° (bronzeado) | p4 (5.1) | MST 5 (10.0) |
| oliva escuro | #8f6a42 | 47.7 | 29.7 | 70.8 | -4.7° (marrom) | p6 (6.3) | MST 7 (7.3) |

Cores de roupa iguais às de fundo — troca sugerida (contraste da roupa nova contra o fundo de mesmo nome e contra o "chão"):

| roupa | atual | sugerida | × fundo de mesmo nome | × chão (branco 14 %) | ΔE2000 |
|---|---:|---:|---:|---:|---:|
| verde-água | #2dd4bf | #12a594 | 1.65 | 1.78 | 12.7 |
| ouro | #f5b942 | #d9941a | 1.45 | 1.57 | 9.9 |
| coral | #f0705a | #cf4f3c | 1.48 | 1.72 | 10.6 |

Cores neutras sugeridas para a cobertura de cabeça × tons de pele (o pano encosta no rosto):

| cor | p1 | p2 | p3 | p4 | p5 | p6 | p7 | p8 | × tela |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| preto #23262f | 12.33 | 10.35 | 8.17 | 6.17 | 4.40 | 2.97 △ | 1.96 △ | **1.32** ✗ | **1.24** ✗ |
| branco #f4f1ea | **1.09** ✗ | **1.29** ✗ | 1.64 △ | 2.17 △ | 3.04 | 4.51 | 6.84 | 10.19 | 16.60 |
| areia #d9c3a5 | **1.39** ✗ | **1.17** ✗ | **1.08** ✗ | **1.43** ✗ | 2.01 △ | 2.98 △ | 4.52 | 6.73 | 10.97 |
| marinho #27407a | 8.15 | 6.85 | 5.40 | 4.08 | 2.91 △ | 1.97 △ | **1.30** ✗ | **1.15** ✗ | 1.87 △ |

---

## 3. Achados

Formato das correções de desenho: o de `pecas.ts` (grade de 200 × 200; `T` = #0b1220, `B` = #ffffff, `OURO`, `VERDE`, `METAL`, `ARDOSIA` como no arquivo).

### 3.1 P1 — exclui, ofende ou deixa ilegível

#### P1-1. O rosto some nos tons de pele 7 e 8 — `rosto: sorriso | serio | confiante | alegre | sono`, `oculos: redondo | retangular`

**O que está errado.** Olhos, boca, sobrancelha e aro dos óculos são desenhados em #0b1220. Contra a pele isso dá 15,3:1 no tom 1 e 1,63:1 no tom 8 (tabela B). A intenção do comentário em `pecas.ts` ("o rosto continua legível nos tons de pele mais escuros, sem regra especial por tom") está certa, mas os dois recursos são fracos demais: o brilho do olho tem 0,42 px a 32 px e o arco claro tem 24 % de opacidade. Resultado medido: a 32 px @2x, tons 7 e 8 não têm nenhum pixel com 3:1 no rosto (fora os dentes do "alegre" no tom 8); a 96 px, só o brilho (tabela I). Na prancha `revisao-trabalho/t1-rosto-pixels.png` o tom 8 é um círculo marrom com duas bochechas.

**Correção mínima, a mesma para todos os tons, sem clarear nenhum tom** (testada em protótipo: `t6b-rosto-depois.png`, `t6c-rosto-32.png`, `t7-rosto-grande.png`, tabela I).

A ideia já está no arquivo: todo traço escuro leva um par claro. Falta dar ao par claro área e opacidade suficientes.

1. **Olho aberto com esclera em amêndoa.** Uma elipse branca mais larga que alta sob a pupila, e a pupila com a altura inteira do olho. O branco aparece só nos cantos, como num olho relaxado. Testei antes a esclera redonda em volta da pupila inteira: dá ar de susto, na pele escura lembra caricatura e, a 32 px @1x, o anel branco se mistura com a pupila e vira um borrão cinza nos tons médios. **Não use a redonda.**

```ts
const OLHOS: Forma[] = [
  { e: [85, 92, 7.6, 5.6], f: B },      // esclera
  { e: [115, 92, 7.6, 5.6], f: B },
  { e: [85, 92, 4.4, 5.6], f: T },      // pupila: mesma altura da esclera
  { e: [115, 92, 4.4, 5.6], f: T },
  { c: [86.5, 90, 1.4], f: B, o: 0.9 }, // brilho
  { c: [116.5, 90, 1.4], f: B, o: 0.9 },
];
```

2. **Par claro em rosa-claro quente, a 65 %.** Em vez de branco a 24 %, `#ffc4b5` a 65 %. Na pele clara quase não aparece (1,03 a 1,15:1 nos tons 1 a 3); na escura lê como o lábio inferior, mais claro que a pele (3,13:1 no tom 7; 4,18:1 no tom 8). Branco puro a 50 % daria quase o mesmo contraste, mas lê como tinta branca.

```ts
const LUZ = '#ffc4b5';
const claro = (d: string, sw = 3, o = 0.65): Forma => ({ d, s: LUZ, sw, o });

sorriso:   boca: [claro('M91 113.2 Q100 121.6 109 113.2'), { d: 'M90 109 Q100 118 110 109', s: T, sw: 3.4 }]
serio:     boca: [claro('M92.6 114.8 H107.4', 3.4), { d: 'M92 111 H108', s: T, sw: 3.8 }]
confiante: olhos: [...OLHOS, { d: 'M77 81.6 L92 79.6', s: T, sw: 3.6 }, { d: 'M108 79.6 L123 81.6', s: T, sw: 3.6 }]
           boca: [claro('M92 113.8 Q103 120.8 110 111.4'), { d: 'M91 110 Q103 117 111 107', s: T, sw: 3.4 }]
alegre:    olhos: [claro('M80.2 97.6 Q85 90.8 89.8 97.6', 3.4), claro('M110.2 97.6 Q115 90.8 119.8 97.6', 3.4),
                   { d: 'M80 94 Q85 87 90 94', s: T, sw: 3.6 }, { d: 'M110 94 Q115 87 120 94', s: T, sw: 3.6 }]
           boca: (como está: os dentes brancos já resolvem)
sono:      olhos: [claro('M80.2 96.2 H89.8', 3), claro('M110.2 96.2 H119.8', 3),
                   { d: 'M80 93 H90', s: T, sw: 3.4 }, { d: 'M110 93 H120', s: T, sw: 3.4 },
                   { d: 'M80 102 Q85 105.5 90 102', s: T, sw: 2, o: 0.32 }, { d: 'M110 102 Q115 105.5 120 102', s: T, sw: 2, o: 0.32 }]
           boca: [{ e: [100, 112, 4.4, 5], f: T }, { e: [100, 113.6, 3, 2.8], f: '#ff8a75' }]
```

A sobrancelha do "confiante" fica só em tinta, um pouco mais grossa: testei um par claro sob ela e lê como sombra de maquiagem.

3. **Modo compacto até 40 px.** A 32 px @1x um olho tem 1,3 × 1,6 px e a boca meio pixel de espessura, em qualquer tom. Em `montar.ts`, quando o lado for ≤ 40 px, amplie tudo menos o fundo e a moldura em torno da cabeça:

```
<g clip-path="…">{fundo}<g transform="translate(100 100) scale(1.3) translate(-100 -92)">{resto de `dentro`}</g></g>{fora}
```

(fator 1,3; centro em (100, 92); 8 un. para baixo). A cabeça passa de 11,8 para 15,4 px de largura. A roupa quase sai do quadro, e a 32 px ela já não lia.

4. **Óculos na pele escura.** O aro em tinta dá 1,63:1 no tom 8 e a lente (branco a 18 %) 1,71:1. Suba a lente para 30 % (2,44:1) e acrescente um brilho no aro (branco a 60 %: 5,2:1 no tom 8):

```ts
redondo:    lente { f: B, o: 0.3 }  +  { d: 'M75.6 87 A10.6 10.6 0 0 1 86 81.4 M105.6 87 A10.6 10.6 0 0 1 116 81.4', s: B, sw: 1.6, o: 0.6 }
retangular: lente { f: B, o: 0.3 }  +  { d: 'M76 84.6 H88 M108 84.6 H120', s: B, sw: 1.6, o: 0.6 }
protecao:   antes do aro ardósia:   { r: [67, 78, 66, 28, 13], s: B, sw: 6, o: 0.4 }
```

**Resultado medido** (tabela I, atual → proposta, pico de contraste contra a pele):

| | tom 6 | tom 7 | tom 8 |
|---|---:|---:|---:|
| olho aberto, 32 px @1x | 2,27 → 3,09 | 1,59 → 3,23 | 1,45 → 4,16 |
| olho aberto, 32 px @2x | 3,71 → 5,04 | 2,45 → 7,65 | 1,64 → 11,39 |
| boca "sorriso", 32 px @2x | 3,41 → 3,68 | 2,30 → 3,12 | 1,57 → 4,17 |
| olho aberto, 96 px | 3,68 → 5,09 | 4,80 (só o brilho) → 7,71 | 7,15 (só o brilho) → 11,49 |

**Atenção ao que pedir para conferir.** O par claro no lábio e a esclera são o ponto em que uma correção de legibilidade pode virar caricatura. No protótipo ficou sóbrio (`t7-rosto-grande.png`), mas quem tem de dizer isso são estudantes negros: mostre a eles antes de publicar.

#### P1-2. O turbante era um gorro — `cabeca: turbante` — corrigido pelo autor em `5aea149`

**O que estava errado (em `5324eb0`).** A peça era uma calota justa de x 59 a 141 e y 28 a 84, com dois vincos e um brilho; a touca cirúrgica tinha a mesma silhueta (x 60 a 140, y 32 a 84). Sem amarração, sem volume, sem pano cruzado. A suspeita do autor procedia (prancha 3; `t5-detalhes.png`).

**O que o autor fez (em `5aea149`).** Redesenhou o turbante como amarração alta com nó na frente e criou o dastar como item separado, com as camadas em "V" invertido e a ponta do pano de baixo na testa.

**Conferência da versão nova** (`t16-turbante-autor.png`):
- **Resolve.** O turbante lê como pano amarrado e o dastar como dastar, a 200, 56 e 32 px; os dois se distinguem entre si, do hijab e da touca. O volume está certo (mais altos e mais largos que a cabeça); o dastar cobre o alto das orelhas, como deve.
- **A separação está certa.** São peças de origem, forma e uso diferentes: o turbante de amarrar (afro-brasileiro; no candomblé, ojá ou torço) tem faixa reta na testa, orelhas de fora e nó; o dastar (sikh) tem a borda em "V", cobre o alto das orelhas e não tem nó. No Brasil, "turbante" sem qualificativo é o primeiro; os nomes "Turbante" e "Dastar" estão bons.
- **O que separa turbante de gorro neste estilo** é a silhueta e não o detalhe interno: volume acima da cabeça, pano que se cruza em vez de vincos paralelos, e o arremate (nó ou "V"). A versão nova tem os três.

**Ajustes que restam** (nenhum é P1):
1. O nó é simétrico, de duas alças iguais com miolo: a 200 px lembra um laço de presente. Uma alça maior que a outra, ou o nó um pouco fora do centro, tira esse ar. (P3; não testado.)
2. Os dois usam a cor da roupa: turbante ouro em fundo ouro some (`t16`), e não há branco, preto nem areia. Ver P2-14.
3. Capelo por cima dos dois fica mal: o chapéu pousa no meio do pano (`t16`). Ver regra 1 na seção 6.
4. A chama da moldura cai sobre o alto do turbante. Ver regra 2.
5. Touca cirúrgica e turbante ou dastar são a mesma vaga. Ver P1-4.
6. **Conferência por quem usa.** Vale para os dois, e para o dastar em especial: mostre a um estudante sikh antes de publicar.

Antes de ver o commit do autor eu tinha desenhado os dois no protótipo (`proposta.ts`, prancha `t8-coberturas.png`). Não há motivo para trocar a versão do autor pela minha; fica só como segunda referência.

#### P1-3. Hijab com fresta de pescoço — `cabeca: hijab`

**O que está errado.** O pano da cabeça (`frente`) termina em y 148 no centro e o pano dos ombros (`ombros`) começa em y 149; nas bordas do pescoço a distância chega a 2,75 un. Pelo vão aparece a pele do pescoço: 45 un² de #e6b58c no tom 3, medidos por pixel (`confere-outros.ts`). Na prancha lê como um colar ou um segundo sorriso no peito. Num hijab, pescoço à mostra é erro de desenho que quem usa nota.

**Correção** (testada: 0 un² de pele depois). Suba o pano dos ombros até debaixo do queixo e marque a dobra com uma sombra:

```ts
hijab: {
  atras: (como está),
  frente: [
    (a forma atual, com a janela do rosto),
    { d: 'M67 92 C67 60 133 60 133 92', s: T, sw: 3, o: 0.13 },
    { d: 'M70 128 C84 142 116 142 130 128', s: T, sw: 3, o: 0.12 },     // dobra sob o queixo
  ],
  ombros: [{ d: 'M60 128 C78 142 122 142 140 128 C151 146 154 164 150 176 C124 186 76 186 50 176 C46 164 49 146 60 128 Z', f: 'roupa' }],
},
```

No mais o hijab está correto e respeitoso: cobre cabelo, orelhas e pescoço, a janela do rosto deixa a testa à mostra a partir de y 67,5, o pano cai sobre os ombros. Ver também P2-13 (acessórios por baixo do pano) e P2-14 (cor).

#### P1-4. Recompensas que disputam a vaga com peças de identidade — `cabeca: touca`, `oculos: protecao`

**O que está errado.** A regra do produto (nada que represente a pessoa fica bloqueado) é cumprida ao pé da letra: conferi `catalogo.ts` e nenhum item de pele, cabelo, barba, cobertura ou óculos comuns tem `desbloqueio` além dos intencionais (seção 4.3). Mas duas recompensas ocupam a mesma vaga que a identidade:

- `touca` (nível 30) está em `cabeca`, junto com hijab, turbante e dastar. `AvatarConfig.cabeca` guarda um id só. Uma aluna de hijab que chega ao nível 30 só veste a touca se tirar o hijab do avatar.
- `protecao` (conquista "olho-clinico") está em `oculos`, junto com os de grau. Quem usa óculos só veste os de proteção se tirar os seus.

Na prática a recompensa existe para quem não usa cobertura nem óculos. E é um defeito de estrutura: `AvatarConfig` leva `v: 1` e vai ao servidor; mudar depois de publicado pede migração.

**Correção** (testada em protótipo: `t15-touca-hijab.png`). Tire as duas recompensas das vagas de identidade:

- Novo campo `paramento: 'nenhum' | 'touca'` (ou mova a touca para `acessorio` e permita dois acessórios, um de rosto e um de corpo). A touca é desenhada **por cima** da cobertura: sobre o hijab fica como a touca que se usa sobre o hijab no centro cirúrgico (testado); sobre o quipá, cobre-o. Sobre turbante e dastar ela não cabe: nesses dois, a recompensa veste o próprio pano na cor da touca, com a faixa na testa, como a capa cirúrgica que se usa sobre o turbante (não testado).
- `protecao` passa para a camada de rosto do acessório (onde já está a máscara) ou para um campo próprio, e é desenhada por cima dos óculos de grau, como na vida real.

O mesmo cuidado vale para tudo que entrar depois (aparelho auditivo, cordão de girassol): ver seção 7.

### 3.2 P2 — mostra mal

#### P2-1. Cabelo e barba não se separam da pele — `corCabelo`, `barba`, `cabelo: raspado`

Tabela C. Não há como dar 3:1 a todos os pares sem contorno ou sem escolher a cor do cabelo pelo tom da pele: cabelo loiro tem a luminância da pele clara, castanho a da pele escura, e contra o tom 8 nem o preto puro passa de 1,82:1. O que dá para fazer, dentro do estilo:

1. **Sombra de raiz** (testada: `t9-cabelos-proposta.png`). Em `montar.ts`, depois de `ROSTO_BASE` e antes dos olhos, redesenhe as formas opacas de `cabelo.frente` deslocadas 2,4 un. para baixo, em tinta a 20 %: `<g transform="translate(0 2.4)" opacity="0.2">…formas com f: T…</g>`. É o mesmo recurso que o arquivo já usa no pescoço, no decote e na borda do hijab. Dá uma linha de 1,45 a 1,53:1 contra a pele nos tons 1 a 4, o bastante para o loiro no tom 3 deixar de ser uma mancha só. **Não chega a 3:1** e não aparece a 32 px. `Forma` não tem deslocamento; ou o grupo SVG, ou um campo `dy`.
2. **Tranças, dreads e cabelo preso: marca clara no cabelo escuro, escura no claro.** Ver P2-6.
3. **Barba no tom 8** (preta: 1,49:1 cheia; 1,30:1 curta): mesmo limite físico, sem correção dentro do estilo. A barba cheia ainda lê pela silhueta (o queixo desce até y 142); a curta praticamente some.
4. Aceitar que, a 32 px, cabelo e pele de mesma luminância leem como uma forma só. O que identifica a pessoa nesse tamanho é a silhueta contra o fundo (P2-2).

#### P2-2. A figura some no fundo que o aluno escolhe — `fundo`, `corRoupa`, `cabeca`

Tabelas F e J e prancha `t2-combos.png` (última linha). Casos medidos: tom 3 × verde-água 1,01; tom 4 × verde 1,01 (ΔE 6 em protanopia); tom 5 × violeta 1,02; tom 5 × coral ΔE 1,9 em protanopia; tom 8 × escudo 1,05; black power preto × noite 1,13; loiro × ouro 1,11; turbante ouro × fundo ouro 1,00; hijab verde-água × fundo verde-água 1,00 (fica um rosto solto no ar).

Não existe um fundo que separe de todos os tons de pele, e o estilo não tem contorno. Correções, da mais barata para a mais cara (não testadas, salvo indicação):

1. **Três cores de roupa são o mesmo hexadecimal que o fundo de mesmo nome** (verde-água #2dd4bf, ouro #f5b942, coral #f0705a). Azul, verde e violeta já foram escurecidos um passo; faça o mesmo com essas três (tabela K): verde-água `#12a594`, ouro `#d9941a`, coral `#cf4f3c`. Dá 1,45 a 1,65:1 contra o fundo de mesmo nome: a roupa deixa de ser invisível, sem chegar a 3:1.
2. **`AVATAR_INICIAL` (`regras.ts`) tem `corRoupa: 'verde-agua'` e `fundo: 'verde-agua'`**: roupa igual ao fundo (1,08:1 contra o chão). É para onde cai todo id desconhecido e todo item que `restringirAoLiberado` devolve. Troque um dos dois (por exemplo `fundo: 'azul'`).
3. **Editor: a prévia a 32 px já existe** ("no ranking"); está certo. Confira só se ela aparece sobre a cor do cartão (#131c30), que é onde o ranking a mostra.
4. **Editor: aviso suave, nunca bloqueio**, quando `contraste(pele, fundo) < 1,3` ou `contraste(corCabelo, fundo) < 1,3` (ou `corRoupa` × `fundo`, com hijab ou turbante): "Neste fundo o rosto pode se confundir com a cor de trás" e um botão que troca para o fundo de maior contraste.
5. **Ordem dos fundos no editor** pelo contraste com o tom escolhido (os que funcionam primeiro). É regra por tom, mas só de ordenação.

#### P2-3. Fundos escuros somem na tela — `fundo: noite | tempo | faixa | liga | ardosia`

Tabela D: noite 1,23:1 contra a tela e 1,12:1 contra o cartão; mostrador 1,10 e **1,00** (é a cor do cartão); faixa 1,23 e 1,12 na base; escudo 1,55 e 1,40; ardósia 1,98 e 1,79. Sem moldura, o disco não tem borda: sobra um busto flutuando, e numa lista de ranking os avatares parecem de tamanhos diferentes. Um fundo não pode ser escuro e, ao mesmo tempo, ter 3:1 contra uma tela escura; a saída é uma borda.

**Correção** (testada: `t12-molduras-proposta.png`, metade de baixo). Cada fundo escuro leva o próprio aro, por último na lista:

```ts
const ARO_BASE: Forma = { c: [100, 100, 97.5], s: '#6b7ba4', sw: 5 };   // 4,45:1 contra a tela; 4,04:1 contra o cartão
ardosia: [{ c: [100, 100, 100], f: '#33456e' }, chao, ARO_BASE],
noite:   [{ c: [100, 100, 100], f: '#1a2540' }, chao, ARO_BASE],
faixa:   [...FUNDOS.faixa, ARO_BASE],   tempo: [...FUNDOS.tempo, ARO_BASE],   liga: [...FUNDOS.liga, ARO_BASE],
```

Com moldura, o aro fica por baixo do fio escuro e não aparece. A 32 px são 0,8 px: fino, mas visível.

Isso resolve o disco contra a tela. Não resolve cabelo preto e tons 7 e 8 contra esses fundos (P2-2).

#### P2-4. As molduras não se distinguem a 32 px — `moldura` (todas)

**O que acontece** (`t3-molduras.png`, pixels ampliados; tabela E):

| tamanho | o que se distingue |
|---|---|
| 32 px @1x | **5 grupos**: verde-água (Monitor = Ligante); laranja com chama (Semana cheia); ouro liso (Diretor = Residente = Preceptor, e Interno um pouco esverdeado); ouro com ponto escuro embaixo (Dez mil = Professor Titular); ouro com chama (Hábito de residente) |
| 32 px @2x | os mesmos, mais os 4 pontos do Residente, mal |
| 56 px | Monitor e Ligante ainda iguais; os pontos e as estrelas começam a ler |
| 78 a 96 px | todas, menos Monitor × Ligante (diferem por 1 un. de largura e um fio branco de 1,5 un.) |

As diferenças foram postas em detalhes de 1,5 a 5,5 un., que a 32 px valem 0,24 a 0,9 px. A largura do anel vai de 6 a 9 un. (0,96 a 1,44 px): o nível 50 e o nível 15 diferem por meio pixel. Verde-água e ouro têm a mesma luminância (1,05:1), separados só pela matiz; ouro e laranja ficam a ΔE 5 em deuteranopia.

**Correção** (testada: `t17-molduras-cantos.png`). A escada usa só três variáveis que sobrevivem a 32 px: cor do anel, largura (6 ou 12 un.: 1 ou 2 px) e gemas grandes (raio 8 a 9 un.: 2,6 a 2,9 px). Dois cantos fixos: **nível no canto superior esquerdo, conquista (chama, dez mil) no superior direito**. O alto e o centro ficam livres para cabelo e capelo; o rodapé, para crachá, estetoscópio e escudo do moletom.

```ts
const anel = (cor: string, sw: number): Forma => ({ c: [100, 100, 100 - sw / 2], s: cor, sw });
const fio = (sw: number): Forma => ({ c: [100, 100, 100 - sw - 1.5], s: T, sw: 3 });
const gema = (grau: number, r: number, cor = B, raio = 94): Forma[] => {  // grau 0 = embaixo; 135 = canto superior esquerdo
  const a = ((90 + grau) * Math.PI) / 180, x = 100 + Math.cos(a) * raio, y = 100 + Math.sin(a) * raio;
  return [{ c: [x, y, r + 2.5], f: T }, { c: [x, y, r], f: cor }];
};
const chamaCanto = (cor: string, miolo: string): Forma[] => [
  { c: [166, 34, 19], f: T },
  { d: 'M166 14 C178 24 182 32 178 42 C176 48 170 50 166 50 C160 50 154 46 154 38 C154 32 158 30 159 24 C162 26 164 28 165 30 C166 24 166 20 166 14 Z', f: cor },
  { d: 'M166 30 C171 35 172 40 170 44 C169 47 167 48 166 48 C163 48 161 46 161 42 C161 38 164 36 166 30 Z', f: miolo },
];
monitor:   [fio(6),  anel(VERDE, 6)],
ligante:   [fio(12), anel(VERDE, 12)],
diretor:   [fio(6),  anel(OURO, 6)],
interno:   [fio(12), anel(OURO, 12)],
residente: [fio(12), anel(OURO, 12), ...gema(135, 9)],
preceptor: [fio(12), anel(OURO, 12), ...gema(107, 8), ...gema(135, 9), ...gema(163, 8)],
titular:   [fio(12), anel(OURO, 12), { c: [100, 100, 99], s: B, sw: 2 }, { c: [34, 34, 19], f: T }, { c: [34, 34, 16], f: OURO }, { d: estrela(34, 34, 11), f: T }],
chama:           [fio(7), anel('#fb923c', 7), ...chamaCanto('#fb923c', '#fde047')],
'chama-dourada': [fio(8), anel(OURO, 8), ...chamaCanto(OURO, B)],
'dez-mil':       [fio(8), anel(OURO, 8), { c: [166, 34, 19], f: T }, { d: estrela(166, 34, 15), f: OURO }, { d: estrela(166, 34, 6), f: B }],
```

É uma proposta de sistema, não a única possível; o que importa é a regra: **a 32 px, nada menor que 2 px (12,5 un.) distingue uma moldura da outra**. E, como a moldura carrega informação (nível), ela não pode depender só de cor (critério 1.4.1) e precisa de equivalente em texto (1.1.1): na linha do ranking, o nível vai também escrito, e a moldura entra no texto alternativo (seção 5).

Detalhe: a chama atual começa em y = −2 e é cortada pela borda do SVG.

#### P2-5. Nomes no masculino — `catalogo.ts`

Regras e combinações: nada amarra peça a gênero. `montar.ts` não bloqueia combinação nenhuma; barba aparece com hijab, com cabelo longo, com qualquer coisa. Está certo.

Nomes: sete estão no masculino e passam a nomear a pessoa que os usa.

| id | nome atual | sugestão |
|---|---|---|
| `moldura: monitor` | Monitor | Monitoria |
| `moldura: diretor` | Diretor de Liga | Diretoria de Liga |
| `moldura: interno` | Interno | Internato |
| `moldura: preceptor` | Preceptor | Preceptoria |
| `moldura: titular` | Professor Titular | Titular (ou Cátedra) |
| `rosto: serio` | Sério | Neutra (a categoria é "Expressão") |
| `cabelo: calvo-lateral` | Calvo com laterais | Calvície com laterais |

"Ligante", "Residente", "Hábito de residente", "Jaleco de titular" e os demais são neutros. Os nomes de cabelo concordam com "cabelo" (Curto, Liso longo) e não com a pessoa; ficam.

Os nomes das molduras repetem os títulos de nível de `src/core/scoring.ts` (`TITULOS_NIVEL`: Calouro, Monitor, Ligante, Diretor de Liga, Interno, Residente, Preceptor, Professor Titular), que o editor também mostra no motivo do bloqueio ("Nível 5 · Monitor"). A troca tem de ser feita lá, e inclui "Calouro" (por exemplo "Ingressante"). É decisão de produto, fora do módulo do avatar; registro porque a regra do catálogo é não amarrar nada a um gênero.

#### P2-6. Tranças — `cabelo: trancas`

**O que está errado.** (a) A textura é um tracejado em tinta a 22 %: contra cabelo preto dá 1,02:1. As tranças perdem a textura justamente na cor em que são mais usadas e viram quatro fios lisos. As três riscas do couro cabeludo têm o mesmo problema. (b) São duas de cada lado, finas e afastadas do rosto: lê como quatro mechas.

**Correção** (testada: `t9-cabelos-proposta.png`). Três de cada lado e marca em claro, em pontos pequenos no eixo da trança:

```ts
const marcas = (d: string, sw: number): Forma => ({ d, s: B, sw: +(sw * 0.42).toFixed(1), o: 0.22, dash: '0.1 7.4' });
const TRANCAS = ['M52 86 C45 106 45 128 47 150', 'M61 72 C52 98 54 130 56 162', 'M71 64 C62 98 66 132 67 166',
                 'M148 86 C155 106 155 128 153 150', 'M139 72 C148 98 146 130 144 162', 'M129 64 C138 98 134 132 133 166'];
trancas: {
  atras: TRANCAS.flatMap((d): Forma[] => [{ d, s: 'cabelo', sw: 10 }, marcas(d, 10)]),
  frente: [
    { d: 'M63 86 C60 54 82 42 100 42 C118 42 140 54 137 86 C134 71 122 61 100 59 C78 61 66 71 63 86 Z', f: 'cabelo' },
    { d: 'M100 43 V58 M84 46 L88 60 M116 46 L112 60 M70 56 L77 66 M130 56 L123 66', s: B, sw: 1.8, o: 0.2 },
  ],
},
```

A marca clara dá 2,04:1 no preto e 1,78:1 no castanho, mas só 1,17:1 no loiro. Regra de uma linha, pela cor do cabelo e não pelo tom de pele: `s: contraste(corCabelo, '#ffffff') >= 4.5 ? B : T`. No protótipo usei sempre `B`; a troca por cor **não foi testada**.

#### P2-7. Crespo curto — `cabelo: curto-crespo`

**O que está errado.** Nove círculos de raio 10 a 11 formam um contorno de bolas grandes: lê como cacheado curto ou como uma tiara de contas. Crespo curto tem textura miúda e silhueta compacta, colada à cabeça. E há uma fresta de pele dentro do cabelo, no topo (10 un²): os círculos terminam em y 60 e a faixa começa em y 61.

Comparação de cuidado: "curto" tem uma mecha assimétrica desenhada; "liso médio" tem franja e pontas; "crespo curto" é uma fileira de círculos. O black power e o cacheado estão bem: volume certo, mais largos que a cabeça, nada de caricatura.

**Correção** (testada: `t9-cabelos-proposta.png`; 0 un² de pele depois). Treze ondas de raio 7,5 num arco colado à cabeça, e uma calota que as une:

```ts
'curto-crespo': {
  atras: [],
  frente: [
    ...circulos([[134.7, 79.4, 7.5], [132.5, 71.8, 7.5], [128.6, 64.9, 7.5], [123, 59.1, 7.5], [116.1, 54.7, 7.5], [108.3, 51.9, 7.5], [100, 51, 7.5],
                 [91.7, 51.9, 7.5], [83.9, 54.7, 7.5], [77, 59.1, 7.5], [71.4, 64.9, 7.5], [67.5, 71.8, 7.5], [65.3, 79.4, 7.5]]),
    { d: 'M64 84 C61 44 139 44 136 84 C131 71 119 64.5 100 64.5 C81 64.5 69 71 64 84 Z', f: 'cabelo' },
  ],
},
```

#### P2-8. Calvo com laterais — `cabelo: calvo-lateral`

**O que está errado.** Os tufos de trás (`M60 100 C54 84 58 68 68 62 L72 100 Z`) terminam num canto vivo em (68, 62), 4 un. para fora da cabeça: leem como pontas para cima (orelhas de gato, penacho de coruja). É a única peça do catálogo para quem tem calvície.

**Correção** (testada: `t9-cabelos-proposta.png`). Laterais arredondadas, coladas à cabeça, mais largas na altura da orelha:

```ts
'calvo-lateral': {
  atras: [
    { d: 'M68 69 C60 68 54 77 54.5 89 C55 99 59 105.5 65.5 105 L70 99 Z', f: 'cabelo' },
    { d: 'M132 69 C140 68 146 77 145.5 89 C145 99 141 105.5 134.5 105 L130 99 Z', f: 'cabelo' },
  ],
  frente: [
    { d: 'M63.6 97 C62 85 63.4 75 67.4 68 C70.6 72 71.6 79 70.6 86 C69.4 90.4 66.6 94 63.6 97 Z', f: 'cabelo' },
    { d: 'M136.4 97 C138 85 136.6 75 132.6 68 C129.4 72 128.4 79 129.4 86 C130.6 90.4 133.4 94 136.4 97 Z', f: 'cabelo' },
  ],
},
```

"Calvo com laterais" e "grisalho" não bastam para professores e alunos mais velhos: falta o meio do caminho (entradas), o cabelo branco e a barba de cor própria. Ver seção 7.

#### P2-9. Raspado — `cabelo: raspado`

**O que está errado.** A forma vai do contorno de fora (topo em y 58) até uma linha em y 62 no centro: sobre a cabeça é uma faixa de 2 un. de altura. Lê como careca com um fio escuro no alto (prancha 2, linha "Raspado"). Além disso sai 1 a 2 un. para fora da cabeça, e como é translúcida mistura-se com o fundo e não com a pele (em fundo ouro fica oliva).

**Correção** (testada: `t14-curto-raspado.png`). Borda de fora igual ao contorno da cabeça; linha do cabelo em y 66 a 68, onde está a dos outros cortes:

```ts
raspado: { atras: [], frente: [{ d: 'M63 84 C63 52 137 52 137 84 V91 C135.5 79 129 71 119 68.6 C107 66.4 93 66.4 81 68.6 C71 71 64.5 79 63 91 Z', f: 'cabelo', o: 0.5 }] },
```

No tom 8 com cabelo preto continua quase invisível (1,25:1): é como é na vida.

`lateral-raspada` tem o mesmo vazamento nas laterais a 50 %; limite-as ao contorno da cabeça (P3).

#### P2-10. Máscara cirúrgica — `acessorio: mascara`

**O que está errado.** (a) A borda de cima passa em y 93,6 na vertical dos olhos, e o olho vai de y 87 a 97: a máscara cobre **37 %** do olho (medido). (b) A cor #bfe3ee dá 1,11 / 1,07 / 1,36:1 contra os tons 1, 2 e 3, e as alças são brancas a 80 %: na pele clara a máscara se funde com o rosto.

**Correção** (testada: `t10-acessorios.png`; cobre 2 % da pupila depois). Desce 5 un., ganha a tira do clipe nasal e a borda de baixo num azul mais fundo, e alças azuladas:

```ts
mascara: {
  corpo: [],
  rosto: [
    { d: 'M69 103 Q62 100 60 94 M131 103 Q138 100 140 94', s: '#8fc7d8', sw: 2.5 },
    { d: 'M68 102 C84 96.5 116 96.5 132 102 V114 C124 127 108 132 100 132 C92 132 76 127 68 114 Z', f: '#bfe3ee' },
    { d: 'M68 102 C84 96.5 116 96.5 132 102', s: '#7fb9cc', sw: 3 },
    { d: 'M68 114 C76 127 92 132 100 132 C108 132 124 127 132 114', s: '#7fb9cc', sw: 2, o: 0.7 },
    { d: 'M74 109 C88 104.5 112 104.5 126 109 M76 117 C90 112.5 110 112.5 124 117', s: B, sw: 2.5, o: 0.7 },
  ],
},
```

A tira dá 1,76:1 no tom 1 e 1,48:1 no tom 2 (no tom 3 só 1,17:1): melhora, não resolve. Máscara clara em pele clara é assim.

Máscara com barba cheia: a barba aparece em volta e por baixo, como na vida. Não precisa de regra.

#### P2-11. Martelo, lanterna e lupa — `acessorio: martelo | lanterna | lupa`

**Martelo.** Confirmado: lê como bandeirinha (`t11-martelo.png`). Um triângulo fino preso no alto de uma haste é o esquema de uma flâmula. Redesenhei o Taylor com triângulo gordo e aro de metal e continuou lendo como bandeira. Duas saídas testadas:

- **Recomendada: martelo em "T" (tipo Buck ou Tromner).** A silhueta em T lê como martelo a 96 e a 56 px sem depender de conhecer o instrumento.

```ts
martelo: {
  corpo: [
    { d: 'M133 198 L143 152', s: ARDOSIA, sw: 5.5 },        // cabo
    { d: 'M128 147 L157 153', s: '#d9480f', sw: 11 },       // cabeça de borracha, atravessada
    { c: [158, 153.2, 7.8], f: '#d9480f' },                 // ponta maior
    { c: [143.6, 150.2, 4.4], f: METAL },                   // aro
  ],
  rosto: [],
},
```

- **Alternativa: Taylor com a cinta de metal por cima da cabeça.** É a cinta atravessando o triângulo que desfaz a bandeira. Estudante de medicina reconhece; leigo, menos.

```ts
{ d: 'M138 198 L150 146', s: ARDOSIA, sw: 5.5 },
{ d: 'M131 150 L166 138 L168 166 Z', f: '#d9480f', s: '#d9480f', sw: 5 },
{ d: 'M146.6 141 L152.4 164', s: METAL, sw: 5.5 },
{ c: [149.4, 152, 2.2], f: ARDOSIA },
```

Nos dois: cabo em ardósia (o metal #c3ccda dá 1,51:1 sobre o jaleco) e borracha em #d9480f, que não está na paleta de roupa (4,00:1 sobre o jaleco; 1,47:1 sobre a roupa coral, onde o coral atual some).

**Lanterna clínica.** Corpo em metal sobre jaleco branco: 1,51:1; a 96 px é um risco cinza no bolso, e o que se lê é "caneta". Corpo escuro, ponta acesa com halo e três raios:

```ts
lanterna: {
  corpo: [
    { r: [116, 176, 24, 18, 3], f: T, o: 0.16 },                                                    // bolso
    { c: [126, 152, 9], f: OURO, o: 0.35 },                                                          // halo
    { d: 'M126 139 V143 M115.4 144.4 L118.2 147.2 M136.6 144.4 L133.8 147.2', s: OURO, sw: 2.2 },   // raios
    { r: [122.5, 156, 7, 28, 3.5], f: ARDOSIA },
    { r: [122.5, 150, 7, 9, 3], f: OURO },
    { d: 'M131.5 163 V176', s: METAL, sw: 2.2 },                                                     // presilha
  ],
  rosto: [],
},
```

**Lupa.** O cabo termina em (34, 196), a 116 un. do centro: fora do círculo. Sobra um anel cortado, que lê como argola; com moldura, some metade. Mais para dentro, aro com fio escuro por baixo do metal:

```ts
lupa: {
  corpo: [
    { d: 'M56 168 L45 181', s: ARDOSIA, sw: 7 },
    { c: [66, 156, 14], f: B, o: 0.28 },
    { c: [66, 156, 14], s: ARDOSIA, sw: 7 },
    { c: [66, 156, 14], s: METAL, sw: 3.6 },
    { d: 'M58.6 150.6 Q62 145.4 69.6 147', s: B, sw: 2.5, o: 0.8 },
  ],
  rosto: [],
},
```

Regra que sai daqui: **zona segura**. O que importa num acessório fica a até 84 un. do centro; daí para fora a moldura cobre.

#### P2-12. Capelo e chama brigam com o que está no alto da cabeça — `acessorio: capelo`, `moldura: chama | chama-dourada`

Ver seção 6 (combinações).

#### P2-13. Com hijab, os acessórios de corpo ficam por baixo do pano — `montar.ts`

A ordem é roupa → pescoço → acessório de corpo → pano dos ombros. Com hijab, do estetoscópio sobra a ponta do tubo e o auscultador; dos fones, dois tocos escuros; do moletom, as pontas dos cordões (`t2-combos.png`). Quem usa hijab põe o estetoscópio por cima dele.

**Correção** (testada com estetoscópio: `t8-coberturas.png`): quando a cobertura tem `ombros`, desenhe `acessorio.corpo` **depois** de `cobertura.ombros`. Os cordões do moletom são da roupa e continuam com as pontas (y 184) aparecendo sob a barra do pano (y 176 a 186): com hijab, não desenhe as duas linhas `M92 162 V184` e `M108 162 V184` (não testado).

#### P2-14. A cobertura só existe na cor da roupa — `corRoupa`, `COBERTURAS`

Hijab, turbante, dastar e touca usam `f: 'roupa'`. Duas consequências: a cobertura é sempre da cor da camiseta, e a paleta (verde-água, azul, verde, vinho, coral, ouro, violeta, cinza) não tem as cores em que essas peças mais se usam: preto, branco, areia, marinho. Branco importa em particular para o turbante de quem é de candomblé.

**Correção** (cores testadas em `t8-coberturas.png`; o campo novo não). Campo `corCabeca` em `AvatarConfig`, com as oito cores atuais mais quatro neutras, e a referência `'cabeca'` em `corDe`: preto `#23262f`, branco `#f4f1ea`, areia `#d9c3a5`, marinho `#27407a` (tabela K). Padrão: a cor da roupa, para não mudar o avatar de quem já tem um.

#### P2-15. Tons de pele — `pele`

Tabela A. Os oito cobrem a faixa de luminância (L* 92 a 24) e os passos são razoáveis. Três ressalvas:

1. **Um só subtom.** Tudo em h 51° a 69°, croma alta. Falta pele oliva ou amarelada.
2. **Passos maiores no lado escuro** (ΔL* 11 entre p5, p6, p7 e p8; 6,5 a 8,3 entre p1, p2 e p3). No Censo 2022, pardos e pretos somam 55,5 % da população (45,3 % + 10,2 %; brancos 43,5 %; indígenas 0,8 %; amarelos 0,4 % — de memória, confira). A faixa com menos opções é a da maioria.
3. **Nada abaixo de p8.**

**Sugestão** (não testada em desenho; medidas na tabela K): cinco tons, para discussão. `#885436` entre p6 e p7; `#3a2015` abaixo de p8; oliva claro `#e6c9a0`, médio `#c49b68` e escuro `#8f6a42`. O tom abaixo de p8 **só deve entrar junto com a correção P1-1**: sem ela a tinta dá 1,25:1 e o rosto some por completo; com ela, o olho dá 15:1 e o lábio 5,05:1. Mantenha os nomes neutros ("Tom 9") e a ordem por luminância.

#### P2-16. Faltam peças de identidade

Ver seção 7.

#### P2-17. O sorteio do primeiro acesso — `regras.ts: sortearAvatar`

O editor abre, para quem ainda não tem avatar, com um sorteio entre os itens livres ("nenhum rosto é o padrão"), e sem avatar salvo o componente mostra uma silhueta neutra. A ideia é boa. Dois efeitos medidos em 20 000 sorteios de um jogador novo (`alt-atual.ts`):

1. **Cobertura de cabeça em 29,8 % dos sorteios**: hijab 9,8 %, turbante 10,0 %, dastar 9,9 %. Um em cada dez alunos novos abre o editor de dastar, e um em cada dez de hijab, sem ter escolhido. São peças religiosas ou de identidade; sorteá-las como enfeite é o tipo de coisa que quem as usa pode achar desrespeitoso, e quem não usa pode salvar por graça. É decisão de produto; minha recomendação é não sortear. O botão "Sortear" também troca o tom de pele e a cobertura de quem já os escolheu.
2. **Baixo contraste em 45,1 % dos sorteios**: pele × fundo abaixo de 1,3:1 em 17,6 %; roupa × fundo em 22,9 %; cabelo × fundo em 12,9 %. A primeira imagem que quase metade dos alunos vê de si tem alguma parte fundida no fundo.

**Correção** (não testada):
- Cobertura de cabeça nunca entra no sorteio: `cabeca` fica em "nenhum" na primeira vez e, depois, no que a pessoa escolheu (em `CHANCE_SEM`, `cabeca: ['nenhum', 1]` para o primeiro sorteio; nos seguintes, copiar `cabeca` e `pele` do avatar atual).
- Depois de sortear, se `contraste(pele, fundo) < 1,5`, `contraste(corRoupa, fundo) < 1,3` ou `contraste(corCabelo, fundo) < 1,3`, sortear o fundo de novo (no máximo algumas tentativas).

#### P2-18. O texto alternativo que existe — `regras.ts: descricaoAvatar`

Ver seção 5.

### 3.3 P3 — refinamento

| Peça | O que é | Correção |
|---|---|---|
| `cabelo: curto` | Fresta de fundo entre o cabelo e a cabeça na têmpora esquerda (8,8 un²; cerca de 0,4 un. de largura por 20 de altura) | Trocar o fim do caminho `…C65 73 63 80 62 86 Z` por `…C67 73 65.6 80 64.8 87 L62 86 Z` (testado: `t14`) |
| `cabelo: lateral-raspada` | Laterais a 50 % saem da cabeça e se misturam com o fundo | Limitar ao contorno da cabeça (não testado) |
| `cabelo: black-power` | Contorno de bolas grandes (raio 15 a 19), linguagem muito próxima da do cacheado | Opcional: ondas menores (raio 9 a 10), como no crespo curto proposto (não testado) |
| `cabeca: touca` | Silhueta de gorro | Topo mais reto, faixa na testa, laço atrás (testado: `t8`): `atras: [{ d: 'M134 70 C146 66 152 72 150 78 C146 76 142 76 138 78 Z M136 74 C148 80 150 90 146 94 C142 88 140 84 136 82 Z', f: 'roupa' }]`, `frente: [{ d: 'M60 85 C56 60 62 40 74 36 C90 32 110 32 126 36 C138 40 144 60 140 85 C128 76 114 72 100 72 C86 72 72 76 60 85 Z', f: 'roupa' }, { d: 'M60 85 C72 76 86 72 100 72 C114 72 128 76 140 85 C140.6 81 140.8 77 140.6 73 C128 66 114 63 100 63 C86 63 72 66 59.4 73 C59.2 77 59.4 81 60 85 Z', f: T, o: 0.16 }, { d: 'M74 44 C88 39 112 39 126 44', s: B, sw: 3, o: 0.25 }]` |
| `roupa: capote` | Costura vertical no meio do peito: capote fecha atrás; com a costura lê como agasalho de zíper | Tirar `M100 158 V200`; pôr costuras de manga raglã: `{ d: 'M79 152 C68 160 56 172 48 188 M121 152 C132 160 144 172 152 188', s: T, sw: 3, o: 0.12 }` (testado: `t10`). Mesmo assim é a roupa médica menos reconhecível |
| `roupa: pijama` | Lê como camiseta de gola V com bolso | Aceitável. A cor ajuda (verde, azul) |
| `acessorio: estetoscopio` | Reconhecível. Faltam as hastes com olivas | `{ d: 'M80 152 C72 158 68 166 68 176 M80 152 C78 160 77 168 78 178', s: METAL, sw: 2.6 }, { c: [68, 178, 3], f: ARDOSIA }, { c: [78, 180, 3], f: ARDOSIA }` (testado: `t10`) |
| `rosto: sono` | Olheiras a 32 % somem nos tons 7 e 8 (1,40 e 1,22:1) | Aceitar, ou subir para 45 % |
| `rosto: confiante` | Sobrancelha em tinta: 2,43 e 1,63:1 nos tons 7 e 8 | Engrossar para 3,6 (já na proposta P1-1); a boca torta carrega a expressão |
| bochechas | Coral a 26 %: 1,46:1 no tom 8 e 1,03:1 no tom 5. A 32 px, no tom 8, são o que mais aparece no rosto | Depois de P1-1 deixam de competir. Opcional: baixar para 20 % |
| `montar.ts: avatarParaSvg` | `id` do recorte tem padrão fixo (`recorte-avatar`). `Avatar.tsx` já usa `useId`, então no app não há id repetido | Só cuidar de passar `idRecorte` onde `avatarParaSvg` for usado mais de uma vez na mesma página (prévias, testes) |
| corpo | Um só tronco e um só formato de rosto | Para um busto é aceitável; se houver pedido, uma segunda largura de ombros e pescoço |
| prancha 5 | O título diz 120 px; as células têm 78 px | Só para quem ler a prancha |

### 3.4 O que está bom

- Nenhuma peça de identidade bloqueada; nenhuma combinação proibida; nomes de tom neutros ("Tom 1" a "Tom 8").
- Hijab bem resolvido na forma (fora a fresta). Black power e cacheado com volume certo.
- O fio escuro por dentro de toda moldura resolve anel × fundo (sem ele, o anel verde-água ou dourado ficaria a menos de 1,5:1 em 5 dos 14 fundos, e o laranja em 9).
- No que entrou durante a revisão: silhueta neutra para quem não montou o avatar; ids desconhecidos trocados pelo item inicial; avatar decorativo quando o nome está ao lado; `useId` no recorte; no editor, nome por extenso em cada opção, "Bloqueado" para leitor de tela com o motivo, aviso de que a cobertura esconde o cabelo, prévia a 32 px.
- Jaleco, estetoscópio, crachá, fones, capelo e máscara leem a 96 px.
- A decisão de marcar o rosto com pares claros em vez de regra por tom é a certa; só estava fraca.

---

## 4. Respostas às perguntas

### 4.1 Legibilidade do rosto

Medido nas tabelas B, C e I. **O rosto some a 32 px:**
- @1x: tons 7 e 8 em todas as expressões (olho 1,59 e 1,45; boca 1,45 e 1,23), salvo os dentes do "alegre" no tom 8; tom 6 fraco (olho 2,27). A boca não chega a 3:1 em tom nenhum.
- @2x: tons 7 e 8, todas as expressões, nenhum pixel com 3:1 (fora os dentes do "alegre" no tom 8).
- Piora com óculos de aro em tinta, barba preta, fundo escuro.

**O cabelo não se separa da testa** nos pares listados em P2-1. Correção em P1-1 e P2-1.

### 4.2 Contraste com a interface

- **Fundos** (tabela D): os oito lisos claros se destacam (5,05 a 11,2:1). "Noite", "mostrador", "faixa" e "escudo" **somem** (1,00 a 1,55:1); "ardósia" fica fraco (1,98 e 1,79:1).
- **Molduras** (tabela E): todas se destacam da tela e do cartão (7,5 a 10,6:1). **Entre si, só a partir de 78 a 96 px**; a 32 px são cinco grupos. Correção em P2-3 e P2-4.

### 4.3 Representação

- **Tons de pele:** P2-15.
- **Cabelos:** cacheado e black power têm o mesmo cuidado que os lisos e volume certo; nenhum é caricatura. Crespo curto (P2-7) e tranças (P2-6) estão abaixo dos demais. Faltam dreads, crespo preso, tranças rentes. Franja existe em "liso médio"; não existe em cabelo longo nem cacheado.
- **Coberturas:** hijab correto, com a fresta (P1-3); turbante refeito e dastar separado pelo autor em `5aea149`, os dois conferidos (P1-2). Falta quipá, que pede uma mudança em `montar.ts` (cobertura que não esconde o cabelo). **Cocar e pintura corporal indígena: não incluir sem consultar estudantes indígenas**; são de uso cerimonial e não uma peça de vestuário que qualquer um põe.
- **Idade e corpo:** não bastam. Faltam entradas, cabelo branco, barba de cor própria; óculos de aro fino e de lentes escuras; aparelho auditivo, implante coclear, cordão de girassol. Seção 7.
- **Gênero:** regras e combinações, certo; nomes, P2-5.
- **Regra do bloqueio**, conferida em `catalogo.ts` (`lista.ts`): pele 0 de 8; cabelo 0 de 15; barba 0 de 5; cor da roupa 0 de 8; cor do cabelo 3 de 9 (azul 5, rosa 15, violeta 20: de propósito); cabeça 1 de 5 (touca 30: de propósito; o dastar novo é livre); óculos 1 de 4 (proteção, conquista "olho-clinico": não é óculos comum). **A regra está cumprida.** A ressalva é P1-4: cumprida no bloqueio, quebrada na vaga.

### 4.4 Itens médicos a 96 px

| Item | Lê? | Observação |
|---|---|---|
| Jaleco | sim | Na pele do tom 1 a gola quase some (1,14:1) |
| Pijama cirúrgico | em parte | Camiseta de gola V com bolso |
| Capote | não | Agasalho azul-claro com zíper: a costura do meio está errada (P3) |
| Touca | em parte | Gorro (P3) |
| Máscara | sim | Cobre 37 % do olho; some na pele clara (P2-10) |
| Estetoscópio | sim | Faltam as olivas (P3) |
| Lanterna clínica | não | Risco cinza no bolso (P2-11) |
| Martelo de reflexos | não | Bandeirinha: confirmado (P2-11) |
| Lupa | em parte | Argola cortada pela borda (P2-11) |

### 4.5 Leitor de tela

Seção 5.

### 4.6 Coerência do conjunto

Seção 6.

---

## 5. Texto alternativo

**O que já existe** (`Avatar.tsx` e `regras.ts: descricaoAvatar`, de `9b04fb8`). O componente tem `role="img"` com `aria-label`, ou `aria-hidden` quando recebe `decorativo`. O texto lista cabelo ou cobertura, barba, óculos, roupa e acessório, e não cita tom de pele, gênero, idade nem raça. **A base está certa.** Saída real para os 12 exemplos do autor (`alt-atual.ts`):

```
 1 Avatar: cabelo black power preto, jaleco, estetoscópio
 3 Avatar: hijab, jaleco
 4 Avatar: cabelo tranças preto, moletom da liga, fones
 7 Avatar: cabelo coque castanho-escuro, óculos retangulares, jaleco de titular
 9 Avatar: cabelo calvo com laterais grisalho, bigode, óculos redondos, jaleco
12 Avatar: cabelo lateral raspada violeta, óculos de proteção, moletom da liga, martelo de reflexos
```

**O que mudar** (P2-18; não testado).

1. **Seis cabelos dão frase que não fecha**, porque o texto é "cabelo " + o rótulo do botão: "cabelo tranças preto", "cabelo coque castanho-escuro", "cabelo rabo de cavalo preto", "cabelo topete preto", "cabelo calvo com laterais grisalho", "cabelo lateral raspada violeta". O `nome` é rótulo de botão e não compõe frase. Um campo `alt` por item, com o lugar da cor marcado:

| id | `alt` |
|---|---|
| `curto`, `raspado`, `cacheado`, `ondulado`, `liso-medio`, `liso-longo`, `curto-crespo`, `black-power` | "cabelo curto {cor}", "cabelo raspado {cor}", … (como hoje) |
| `topete` | "topete {cor}" |
| `lateral-raspada` | "cabelo {cor} com a lateral raspada" |
| `careca` | "sem cabelo" |
| `calvo-lateral` | "calvície com laterais {cor, no plural}" |
| `trancas` | "tranças {cor, no plural}" |
| `rabo` | "rabo de cavalo {cor}" |
| `coque` | "coque {cor}" |

   A cor também pede forma própria para concordar ("tranças pretas", "laterais grisalhas"): dois campos na cor (`alt` e `altPlural`) resolvem.

2. **A moldura não entra, e ela informa o nível.** Acrescentar ao fim: "Moldura {nome}."
3. **O nome vem no fim, entre parênteses** ("Avatar: … (Marina)"). Para quem ouve, o nome primeiro orienta melhor: "Avatar de Marina: …".
4. **A cobertura vem sem cor** ("hijab"). Opcional: "hijab vinho".

**Formato curto proposto** (placar e perfil), até cerca de 100 caracteres:

> Avatar de {nome}: {cabelo ou cobertura}, {barba}, {óculos}, {roupa}, {acessório}. Moldura {moldura}.

Ordem fixa, do que mais identifica para o que menos. Itens "nenhum" não entram. O fundo não entra.

- "Avatar de Marina Teles: cabelo black power preto, jaleco, estetoscópio."
- "Avatar de Samira Haddad: hijab vinho, jaleco. Moldura Monitoria."
- "Avatar de Dandara Reis: tranças pretas, moletom da liga, fones."
- "Avatar: calvície com laterais grisalhas, bigode, óculos redondos, jaleco. Moldura Preceptoria."

**Formato longo** (perfil, sob demanda, em `aria-describedby` ou num "Detalhes do avatar"): acrescenta expressão, fundo e tom de pele pelo nome do catálogo: "Expressão alegre. Fundo rosa. Tom de pele 3 de 8."

**Onde é imagem e onde é decoração.**
- **Linha do ranking** (32 px, nome ao lado): `decorativo`. O leitor já diz "Marina Teles, 1240 pontos"; descrever vinte avatares em sequência é ruído. O que a moldura informa vai em texto na linha, visível ou só para leitor de tela: "nível 30".
- **Placar do duelo** (56 px) e **perfil** (96 a 200 px): imagem, com o formato curto.

**O que dizer.**
- Só o que a pessoa escolheu, com o nome que o catálogo dá: "hijab", "dastar", "quipá", "tranças", "aparelho auditivo", "óculos de lentes escuras".
- A moldura pelo nome, porque informa.

**O que não dizer** (a função atual já respeita; vale como teste automático: nenhum `alt` do catálogo contém estas palavras).
- Raça, cor ou etnia: nunca "negra", "branco", "parda", "morena", "de pele escura". O tom de pele, quando entra (formato longo), é "Tom 6 de 8".
- Gênero: nunca "mulher", "homem", "moça", "rapaz". "Avatar de {nome}", não "avatar do aluno".
- Religião ou origem por inferência: "hijab", não "muçulmana"; "quipá", não "judeu"; "dastar", não "sikh"; "turbante", não "de candomblé".
- Idade ou saúde por inferência: "cabelo grisalho", não "idoso"; "aparelho auditivo", não "surdo"; "óculos de lentes escuras", não "cego".
- Juízo: "bonito", "sério demais", "simpática".
- "Imagem de", "foto de": o papel `img` já diz.

**No editor** (`EditorAvatar.tsx`, só lido; não testado com leitor de tela). Já tem: nome por extenso em cada opção; "Bloqueado." e o motivo no nome do botão; `aria-pressed` na opção escolhida; aviso de que a cobertura esconde o cabelo. Faltam, pelo que li:
- "Tom 3" → "Tom 3 de 8" no nome da opção (o `nome` do catálogo é o que o leitor ouve).
- O aviso de baixo contraste (P2-2, item 4), em texto, na região `role="status"` que já existe.
- As amostras de 64 px das cores escuras (preto, castanho-escuro, tons 7 e 8, noite) dependem de borda ou do nome para se distinguirem sobre o cartão; o nome está lá, então é só conferir a borda de foco (2.4.7, 1.4.11).

---

## 6. Combinações que brigam e a regra que resolve

Pranchas `revisao-trabalho/t2-combos.png` (estado em `5324eb0`, com o turbante antigo) e `t16-turbante-autor.png` (turbante e dastar de `5aea149`).

| Combinação | O que acontece | Regra |
|---|---|---|
| Capelo + coque | O coque (topo em y 19) passa por cima do capelo (topo em y 28): 258 un² de cabelo acima do chapéu | **Regra 1** |
| Capelo + turbante, dastar ou touca | A base do capelo (x 74 a 126) é mais estreita que a cobertura: sobra pano dos dois lados. Com o turbante e o dastar novos (`t16`), o chapéu pousa no meio do pano e esconde o nó | **Regra 1** |
| Capelo + hijab | Fica bem | manter |
| Capelo + black power, cacheado, topete, rabo, tranças | Fica bem: o cabelo aparece em volta | manter |
| Chama + capelo, coque, topete, black power | A chama (y −2 a 34, no alto e no centro) cai em cima de tudo que é alto: coque pegando fogo | **Regra 2** |
| Estrela do titular ou do dez mil (embaixo, no centro) + crachá, escudo do moletom | O selo cobre o crachá (y 174 a 192) | **Regra 2** |
| Hijab + estetoscópio, fones, crachá | Acessório por baixo do pano, pontas soltas | **Regra 3** (P2-13) |
| Hijab ou turbante + fundo da mesma cor | A cobertura some; fica um rosto solto | **Regra 4** (P2-2) |
| Roupa verde-água, ouro ou coral + fundo de mesmo nome | Roupa invisível (1,08:1) | **Regra 4** |
| Máscara + barba cheia | A barba aparece em volta: certo | nenhuma |
| Máscara + qualquer rosto | Cobre 37 % do olho | P2-10 |
| Óculos de proteção + hijab | Fica bem (as hastes passam por cima do pano) | nenhuma |
| Óculos de proteção + óculos de grau | Impossível: mesma vaga | **Regra 5** (P1-4) |
| Touca + hijab, turbante, dastar | Impossível: mesma vaga | **Regra 5** (P1-4) |
| Cabelo longo + moletom, fones, estetoscópio | Fica bem: o cabelo de trás passa por trás dos ombros | nenhuma |
| Lupa ou martelo + qualquer moldura | A moldura corta o acessório | **Regra 6** |
| Máscara + óculos de proteção + touca + capote | Sobra uma faixa de testa: avatar anônimo | Escolha do aluno; a prévia a 32 px mostra |

**Regra 1 — um andar por vez no alto da cabeça.** Cada cabelo e cada cobertura declara `topo` (o y do ponto mais alto no eixo central) e, se for o caso, `volumeNoTopo`. Com capelo:
- coque e crespo preso: não desenhar `cabelo.atras` (o volume some dentro do chapéu);
- turbante, dastar e touca: o capelo não é oferecido; no lugar, o editor oferece o **canudo** (diploma enrolado, acessório de corpo), liberado pela mesma conquista. Ninguém perde a recompensa;
- hijab e quipá: capelo por cima, como hoje.

**Regra 2 — selos da moldura em dois cantos fixos.** Nível (gemas, estrela do titular) no canto superior esquerdo (centro em (34, 34)); conquista (chama, estrela do dez mil) no superior direito (centro em (166, 34)). O alto e o rodapé ficam livres. Testado em `t17` com black power, coque, capelo, crachá, estetoscópio e martelo.

**Regra 3 — com cobertura de ombros, o acessório de corpo vai por cima do pano.**

**Regra 4 — aviso, não bloqueio**, quando duas camadas vizinhas têm menos de 1,3:1; e as três cores de roupa trocadas (P2-2).

**Regra 5 — recompensa não ocupa vaga de identidade** (P1-4).

**Regra 6 — zona segura de 84 un. de raio** para o que importa num acessório.

---

## 7. Peças que faltam, em ordem de prioridade

Todas as de identidade são **livres** e ficam em categorias que não disputam vaga com recompensa. "Testado" = desenhado e renderizado no protótipo.

**(feito) Dastar** — criado pelo autor em `5aea149`, conferido em P1-2.

**1. Quipá** — categoria `cabeca`, com `mantemCabelo: true`. Testado (`t8`). Hoje `montar.ts` esconde o cabelo sob qualquer cobertura; o quipá precisa ficar sobre ele. Desenho para cabeça sem cabelo no topo:

```ts
quipa: {
  atras: [],
  frente: [
    { d: 'M77 64 C79 43 121 43 123 64 C116 60.5 108 59.5 100 59.5 C92 59.5 84 60.5 77 64 Z', f: 'roupa' },   // ou 'cabeca' (P2-14)
    { d: 'M77 64 C84 60.5 92 59.5 100 59.5 C108 59.5 116 60.5 123 64', s: T, sw: 2.4, o: 0.2 },
    { d: 'M88 50 C94 47 106 47 112 50', s: B, sw: 2, o: 0.22 },
  ],
  ombros: [],
  mantemCabelo: true,
},
```

Desenhado depois de `cabelo.frente`. Com careca, raspado e calvo, na posição acima; nos demais, deslocado em y por `topo − 43`, com `topo` assim: curto 41, topete 40, lateral-raspada 37, curto-crespo 44, black-power 22, cacheado 26, tranças 43, ondulado 38, liso-médio 39, liso-longo 37, rabo 45, coque 45. O quipá não entra no sorteio (P2-17).

**2. Cores neutras de cobertura** — preto, branco, areia, marinho (P2-14).

**3. Dreads** — categoria `cabelo`. Testado (`t9`).

```ts
const DREADS = ['M58 74 C47 96 46 122 48 146', 'M66 62 C55 92 56 128 58 160', 'M76 56 C66 92 68 130 70 168',
                'M142 74 C153 96 154 122 152 146', 'M134 62 C145 92 144 128 142 160', 'M124 56 C134 92 132 130 130 168'];
dreads: {
  atras: DREADS.flatMap((d): Forma[] => [{ d, s: 'cabelo', sw: 12 }, marcas(d, 12)]),
  frente: [
    { d: 'M63 86 C60 52 82 40 100 40 C118 40 140 52 137 86 C134 71 122 62 100 60 C78 62 66 71 63 86 Z', f: 'cabelo' },
    ...['M100 44 C88 46 76 56 70 74', 'M100 44 C112 46 124 56 130 74', 'M100 44 C94 48 86 54 82 64', 'M100 44 C106 48 114 54 118 64'].map((d) => marcas(d, 9)),
  ],
},
```

No protótipo os dreads e as tranças ficaram parecidos demais (os dois são fios com pontos). Antes de publicar, diferencie: dreads mais grossos e de comprimentos desiguais, sem marca regular. **Este desenho é ponto de partida, não final.**

**4. Crespo preso** (coque afro) — categoria `cabelo`. Testado (`t9`).

```ts
'crespo-preso': {
  atras: circulos([[100, 30, 20], [83, 37, 13], [117, 37, 13], [88, 20, 12], [112, 20, 12], [100, 14, 11]]),
  frente: [
    { d: 'M63 84 C60 56 82 44 100 44 C118 44 140 56 137 84 C134 70 122 60 100 60 C78 60 66 70 63 84 Z', f: 'cabelo' },
    { d: 'M78 49 C90 43 110 43 122 49', s: T, sw: 2.5, o: 0.22 },
    { d: 'M78 47 C90 41 110 41 122 47', s: B, sw: 1.6, o: 0.16 },
  ],
},
```

**5. Aparelho auditivo e implante coclear** — categoria nova `apoio`, livre, desenhada logo depois das orelhas. Testado (`t9`). Não ponha em `acessorio`: obrigaria a escolher entre o aparelho e o estetoscópio.

```ts
'aparelho-auditivo': [
  { d: 'M139.5 85 C144 81 149.5 84.5 149.5 91 C149.5 97 147.6 101.4 145.2 101 C143.6 100.6 144.6 96 144.4 92 C144.2 88.6 142.6 86.8 139.5 87.6 Z', f: VERDE },
  { d: 'M140.4 86.4 C137.4 87.6 136.6 91 138.4 94', s: METAL, sw: 1.8 },
  { c: [138.8, 94.6, 2.2], f: METAL },
],
'implante-coclear': [
  { d: (o mesmo corpo), f: ARDOSIA },
  { d: 'M146 84 C147 80 146 77 143.6 75', s: ARDOSIA, sw: 1.8 },
  { c: [141, 71.5, 6.5], f: ARDOSIA },
  { c: [141, 71.5, 2.6], f: VERDE },
],
```

Lê a partir de 96 px; a 32 px, não (10 un. = 1,6 px). Em verde-água de propósito: aparelho bege some na pele. Ofereça o lado (direito, esquerdo, os dois). Sob o hijab fica coberto.

**6. Óculos de lentes escuras e de aro fino** — categoria `oculos`. Testado (`t9`). Lentes escuras servem a quem é cego ou tem fotofobia, sem que o nome diga isso.

```ts
escuros: [
  { r: [70, 82, 27, 20, 7], f: T, o: 0.92 }, { r: [103, 82, 27, 20, 7], f: T, o: 0.92 },
  { d: 'M97 89 H103', s: T, sw: 3.4 }, { d: 'M64 88 L70 89 M130 89 L136 88', s: T, sw: 3 },
  { d: 'M75 86 L81 86 M108 86 L114 86', s: B, sw: 2.4, o: 0.75 },
  { r: [70, 82, 27, 20, 7], s: B, sw: 1.4, o: 0.4 }, { r: [103, 82, 27, 20, 7], s: B, sw: 1.4, o: 0.4 },
],
'aro-fino': [
  { c: [85, 92, 12.5], f: B, o: 0.22 }, { c: [115, 92, 12.5], f: B, o: 0.22 },
  { c: [85, 92, 12.5], s: T, sw: 2.6, o: 0.5 }, { c: [115, 92, 12.5], s: T, sw: 2.6, o: 0.5 },
  { c: [85, 92, 12.5], s: OURO, sw: 1.6 }, { c: [115, 92, 12.5], s: OURO, sw: 1.6 },
  { d: 'M97.4 90 Q100 87.4 102.6 90', s: OURO, sw: 1.6 },
],
```

**7. Cordão de girassol** (deficiências ocultas; instituído no Brasil pela Lei 14.624/2023 — de memória, confira o número antes de citar) — categoria `apoio` ou acessório de corpo livre. Testado (`t9`).

```ts
girassol: [
  { d: 'M84 149 L100 180 L116 149', s: '#1f9d55', sw: 5.5 },
  ...[[88.5, 158], [95, 170.5], [105, 170.5], [111.5, 158]].flatMap(([x, y]): Forma[] => [{ c: [x, y, 2.9], f: '#f2c94c' }, { c: [x, y, 1.1], f: '#6b452d' }]),
  { r: [91, 178, 18, 14, 3], f: B }, { c: [100, 185, 4.2], f: '#f2c94c' }, { c: [100, 185, 1.7], f: '#6b452d' },
],
```

O cordão de quebra-cabeça (autismo) é contestado por parte das pessoas autistas; não o incluiria sem ouvi-las.

**8. Tons de pele** — cinco sugeridos (P2-15). Não testados em desenho.

**9. Para quem é mais velho** — entradas (testado, `t9`); cabelo branco (`#e6e9ee`, não testado); barba com cor própria (campo `corBarba`, não testado).

```ts
entradas: { atras: [], frente: [{ d: 'M62 88 C56 52 82 40 102 41 C130 42 144 60 138 88 C136 78 132 70 126 66 C121 60 114 58 108 60 C103 63 97 63 92 60 C86 58 79 60 74 66 C68 70 64 78 62 88 Z', f: 'cabelo' }] },
```

**10. Mais cabelos** — longo com franja (testado, `t9`: `frente: [{ d: 'M63 90 C60 56 80 45 100 45 C120 45 140 56 137 90 C137 82 134 78 128 77 C112 80 88 80 72 77 C66 78 63 82 63 90 Z', f: 'cabelo' }]`, com o `atras` do liso longo); cacheado curto; tranças rentes (nagô); cacheado com franja. Os três últimos não foram desenhados.

**11. Outras coberturas** — lenço amarrado (serve também a quem perdeu o cabelo em tratamento); filá ou kufi; boné. Não desenhados.

**12. Marcas do rosto** — categoria livre: sardas, vitiligo, pinta, linhas de expressão. Não desenhadas.

**13. Canudo** — acessório de corpo, par do capelo (regra 1). Não desenhado.

**Não incluir sem consulta:** cocar, pintura corporal indígena, cordão de quebra-cabeça.

---

## 8. Arquivos e como reproduzir

Tudo em `(pasta de trabalho da sessão, fora do repositório) avatares/revisao-trabalho/`. Rodar naquela pasta com `node --experimental-strip-types <arquivo>.ts`.

| Arquivo | O que faz |
|---|---|
| `cor.ts` | Luminância e contraste WCAG, composição com opacidade, CIELAB, ΔE2000, ITA. `teste-cor.ts` confere contra valores conhecidos (preto × branco 21,00; #777 × branco 4,48; ΔE vermelho × verde 86,61) |
| `contraste.ts` | Tabelas A a H → `contrastes.md` |
| `efetivo.ts atual` / `efetivo.ts proposta` | Tabela I → `efetivo-atual.md`, `efetivo-proposta.md`; `resumo-efetivo.py` junta as duas |
| `daltonismo.ts` | Tabela J → `daltonismo.md` |
| `proposta.ts` | O protótipo: troca as formas **na memória** e monta com as regras propostas. É a fonte dos caminhos deste relatório |
| `proposta-medidas.ts`, `avulsos.ts`, `contagens.ts`, `lista.ts` | Tabela K, números avulsos, contagens, itens com `desbloqueio` |
| `confere-hijab.ts`, `confere-outros.ts`, `confere-curto.ts` | Medições por pixel (fresta do hijab, máscara × olho, frestas de cabelo, coque × capelo) |
| `alt-atual.ts` | O que `descricaoAvatar` diz hoje para cada cabelo e para os 12 exemplos; estatística de 20 000 sorteios de `sortearAvatar` |
| `t1` a `t17` (`.ts`, `.html`, `.png`) | Pranchas de trabalho |

Pranchas principais:
- estado atual: `t1-rosto-pixels.png` (rosto a 32 px), `t2-combos.png` (combinações), `t3-molduras.png` (molduras e fundos pequenos), `t4-cabelos.png`, `t5-detalhes.png`;
- antes e depois: `t6a-rosto-antes.png` e `t6b-rosto-depois.png`, `t6c-rosto-32.png`, `t6d-rosto-32x2.png`, `t7-rosto-grande.png`, `t9-cabelos-proposta.png`, `t10-acessorios.png`, `t11-martelo.png`, `t12-molduras-proposta.png` e `t17-molduras-cantos.png`, `t13-exemplos.png` (os 12 exemplos do autor), `t14-curto-raspado.png`;
- peças novas: `t8-coberturas.png`, `t9-cabelos-proposta.png`, `t15-touca-hijab.png`;
- turbante e dastar do autor (`5aea149`): `t16-turbante-autor.png`.

**O que não foi feito.** Nenhuma alteração no repositório, nenhum commit. `Avatar.tsx`, `EditorAvatar.tsx` e `regras.ts` entraram durante a revisão e foram só lidos (texto alternativo, sorteio, avatar inicial); não rodei o app nem os testes do repositório. Não testei com leitor de tela nem com pessoas. As peças novas são desenhos de trabalho: provam que cabem na grade e leem no tamanho, e não que estão prontas.
