# Revisão independente dos gráficos (etapas 2 a 5) — 20/11/2026

Revisão feita por um agente que não desenhou as peças, sem alterar o repositório. Método: contraste WCAG calculado com as cores do código; daltonismo simulado (Machado, Oliveira & Fernandes, 2009, severidade 1,0) com diferença de cor em ΔE2000; alvos de toque e animações medidos no app em execução (390 px); semelhança com uma biblioteca de ícones conhecida (Lucide 0.460.0, ISC) medida por sobreposição de pixels.

Resultado: 1 problema alto, 10 médios e vários baixos. Movimento aprovado (17 animações, todas de uma vez só, até 1,36 s, nada pisca; com "reduzir movimento" nada se move). Nenhum ícone é cópia: ícones sem relação dão sobreposição de 0,20 a 0,27; os mais altos (`visto` 0,76, `perfil` 0,67, `frasco` 0,62, `capelo` 0,60) são formas convencionais.

## O que foi aplicado

| Achado | Gravidade | Correção | Verificação |
|---|---|---|---|
| Alternativa certa/errada só pela cor (falha WCAG 1.4.1; verde × vermelho com ΔE 6,9 em deuteranopia) | alta | `MarcaResultado`: visto ou X num quadrado, no lugar da letra, com texto para leitor de tela ("Resposta certa:", "Sua resposta, errada:"); também em verdadeiro/falso, ordenar, associar, "Qual é o tecido?" e "Linha do tempo" | `tests/questoes.test.tsx`; captura com deuteranopia simulada |
| `fogo` parecia gota (dentro da placa coral, "gota de sangue") e tinha três sentidos | média | chama assimétrica com três línguas, sem a gota interna; fica só para a sequência de dias. "Desafio avançado" passa a mostrar os cinco pontos de dificuldade; o combo fica só no texto | prancha antes × depois de 14 a 48 px |
| `duelo` virava um "X" até 24 px, em vermelho de erro | média | "VS" (um contra um); emblema em fúcsia `#e879f9` | prancha antes × depois |
| `livro` parecia disquete | média | livro fechado com lombada e título, sem a fita no alto | prancha antes × depois |
| Aba ativa da navegação só pela cor (1,64:1 entre os estados) | média | barra de 3 px no alto da aba ativa | medida no navegador |
| Emblema ilegível no selo de 26 px | média | selo sem emblema até 31 px (só disco e gomos); emblema a partir de 32 px | `tests/insignias.test.tsx` |
| Selo de 18 px do início virava "bolinha" (trilho 1,04:1) | média | gomos vazios em `#56688f` nos títulos alcançados | prancha antes × depois |
| Grau bronze/prata/ouro só pela cor; texto alternativo sem o grau | média | 1, 2 ou 3 cravos na base do anel; grau no texto alternativo ("Medalha Semana cheia (prata): obtida") | testes e navegador |
| Medalha não obtida perdia a forma da família (borda 1,59:1) | média | borda `#56688f` (3,2:1) e progresso escrito embaixo ("40% do caminho") | teste de contraste |
| Cores de estado usadas como cor de assunto | média | Revisão do dia `#7dd3fc`, Duelo `#e879f9`, Anatomia `#fdba74` (também no token do canvas) | teste: nenhuma disciplina usa o verde de acerto nem o vermelho de erro |
| "Em breve" quase só pela posição | média | etiqueta visível com cadeado; borda tracejada `#56688f` | `tests/cartoes.test.tsx` |
| Duas ações primárias na tela da disciplina e o primeiro jogo repetido | média (opinião) | um destaque só (Plantão); o primeiro jogo aparece uma vez | navegador |
| Coração cheio menor que o vazio | baixa | o cheio ganhou o mesmo contorno | prancha |
| Domínio × Jogos (e as fases clínica × residência) iguais em deuteranopia | baixa | violeta claro `#c4b5fd` | teste de contraste da tinta |
| Hover que fica aceso depois do toque | baixa | regras de hover dentro de `@media (hover: hover)` | — |
| Abas com 40 px | baixa | 44 px | auditoria |
| Derrota no duelo mostrava medalha | baixa | mostra o livro aberto (`estudar`) | — |
| `capelo` próximo do desenho de referência | baixa | botão no centro, cordão até a ponta e borla cheia | prancha |

## O que ficou para depois

- Ícones de leitura duvidosa, sem troca nesta rodada: `placa` (Patologia; sugere microbiologia), `cascata`, `pegadas` (vira "8 8" dentro da medalha), `bisturi` (parece caneta), `revisao` (parece "atualizar"), `losango`, `quebra-cabeca`, `tendencia` e `pulso` como selo. Cada troca pede desenho, conferência em 14–24 px e decisão sobre o sentido.
- Largura desigual entre ícones (`fogo`, `dna`, `pausa`, `medalha` mais estreitos) e `alvo`, `pausa`, `empate` abaixo de 18 px.
- "Hábito de residente" com uma medalha dentro da medalha.
- Na tela inicial, "Continuar estudando" vem antes, mas o destaque visual é o Plantão (opinião; mudar a ordem é decisão de produto).
- Alvos entre 36 e 40 px em `.btn.pequeno` e no fechar do aviso: passam os 24 px da WCAG 2.5.8, ficam abaixo dos 44 px recomendados.
- Lâmina do "Identifique na lâmina": quando o aluno erra, a estrutura certa e a tocada brilham em verde e vermelho; o título diz qual era a pedida, mas no desenho a diferença ainda é só a cor.
- No canvas do Wonder, as peças da biblioteca `jogo/fogo`, `jogo/duelo`, `jogo/livro`, `conquistas/capelo` e `jogo/coracao` ainda têm o desenho antigo: trocar peça da biblioteca exige apagá-la, o que só se faz com o pedido do Cristiano. O antes × depois está registrado na página "Ícones".

Evidências (capturas, simulações, medidas e scripts) ficaram na pasta de trabalho da sessão; os números citados acima são os do relatório do revisor.
