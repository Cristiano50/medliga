# Processo de revisão do conteúdo

## Camadas

1. **Redação** por agente especialista seguindo `docs/conteudo-schema.md`: obras de referência com capítulo, faixa quando as fontes divergem (`notasDivergencia`), dúvidas registradas (`incertezas`), sem números inventados.
2. **Revisão por agentes de áreas diferentes** (embriologia, anatomia/histologia, genética, clínica — obstetrícia/pediatria — e fisiologia). Cada um lê o tópico inteiro e aponta erros com correção e fonte. As correções são aplicadas e cada revisão fica registrada em `revisao.agentes` (área, agente, data, veredito, notas). Relatórios em `content/revisoes/`.
3. **Conferência médica humana** — exclusiva do Cristiano (ou de professor indicado por ele). Só essa pessoa preenche `revisao.humano` (`conferidoPor`, `conferidoEm`, opcional `registro` e `notas`). Nenhum agente ou automação preenche esse campo.

## O que o jogador vê

| Situação | Selo |
|---|---|
| sem revisão de agentes | "Revisão pendente" |
| revisado por agentes, sem conferência humana | "Revisado por IA · conferência médica pendente" |
| conferido por médico | "Conferido por médico" (com nome e data ao tocar) |

Decisão do Cristiano (09/11/2026): conteúdo revisado só por agentes **pode** aparecer na versão pública, com o selo correspondente.

## Como conferir (para o médico revisor)

1. `npm run revisao` mostra o estado de cada tópico.
2. Leia o tópico no app (aba Resumo, Estruturas, Clínica, Fontes) e as questões (modo Estudo mostra a explicação de cada uma), ou direto no JSON.
3. Para registrar, edite o campo `revisao.humano` do tópico:
   ```json
   "humano": { "conferidoPor": "Dr. Fulano de Tal", "conferidoEm": "2026-11-20", "registro": "CRM-DF 00000", "notas": "q07 reescrita" }
   ```
   ou envie a lista do que conferiu para o agente registrar exatamente o que foi informado.
4. Erros encontrados: anote o id da questão (ex.: `emb-06-q12`) e a correção; o agente corrige e reenvia para revisão.

## Reporte de erro pelos jogadores (próxima versão)

Botão "reportar erro" em cada questão → fila de revisão no servidor → correção → nova versão do conteúdo.
