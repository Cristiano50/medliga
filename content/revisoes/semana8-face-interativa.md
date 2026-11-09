# Semana 8 — face e acabamento no modelo manipulável

Data: 2026-11-09. Escopo: modelo procedural da semana 8 pós-fertilização; nenhuma questão alterada.

## Implementação e correções

| Elemento | Antes | Depois | Motivo |
| --- | --- | --- | --- |
| Cabeça/face | Cabeça esférica sem região facial integrada | Crânio oval com volumes faciais discretos unidos ao corpo | Melhor leitura tridimensional, sem pretensão morfométrica |
| Olhos/orelhas | Posicionamento por esfera; orelhas em anel | Marcos assentados no campo corporal e pavilhões simples aderentes | Evitar estruturas flutuantes |
| Boca | Primeira implementação sugeria sorriso | Sulco neutro | Correção menor solicitada pela embriologia: não atribuir expressão |
| Superfície | Material uniforme e iluminação lavada na primeira captura | Material físico opaco, ambiente e luz reduzidos | Correção menor de legibilidade solicitada pela embriologia |
| Exploração | Figura complementar sempre expandida | Figura opcional, modelo interativo permanece principal | Priorizar rotação, marcadores, seleção e corte |

Referência qualitativa: [NMHM — Carnegie 23](https://medicalmuseum.health.mil/index.cfm/collections.hdac.anatomy.s23). Não houve reconstrução ou comparação métrica com espécime. A imagem aprovada informa a direção visual, mas não foi convertida automaticamente em malha nem reproduzida com realismo equivalente.

## Revisões

Anatomia implementou a geometria focal. Embriologia revisou código e capturas, solicitou boca neutra e iluminação menos intensa, e aprovou as correções. Fisiologia realizou a segunda revisão sequencial e aprovou o escopo didático: cordão e herniação fisiológica continuam distintos; corte e isolamento preservam os avisos necessários. Registros anexados a `revisao.agentes`; `revisao.humano` permanece inalterado.

Não há translucência biológica, vasos decorativos ou anatomia interna acrescentada. A transparência durante seleção é apenas um recurso de interface. Sombras são desligadas durante seleção, isolamento, ocultação e corte para não sugerir presença de tecidos removidos. O corte continua sem reconstrução da superfície seccionada e não representa lesão.

## Verificações

- 50 testes aprovados, incluindo superfície contínua, assentamento bilateral dos marcos faciais, pavilhão, boca e controles de exploração.
- TypeScript, validação do conteúdo e build de produção verificados antes da publicação.
- Chrome isolado com telas simuladas de 320×568 e 1280×900: rotação, cinco marcadores, corte, isolamento com um marcador e ausência de transbordamento horizontal. Sem teste em aparelho físico.
- Capturas locais: `test-results/mobile/interativo-1280-marcadores.png`, `interativo-320-marcadores.png` e variantes `-rotacao`, `-corte`, `-isolado`.
- Semanas 4/6, função compartilhada do feto da placenta e IDs não alterados.

## Limites para conferência humana

Modelo ainda estilizado, com proporções gráficas e postura aproximadas. A aprovação dos agentes não valida morfometria, correspondência integral com a referência artística ou simulação fisiológica. Face, postura e proporções exigem conferência médica antes de alegação de fidelidade anatômica integral.
