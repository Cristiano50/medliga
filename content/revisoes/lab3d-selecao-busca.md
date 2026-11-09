# Laboratório 3D — seleção e busca

Data: 2026-11-09. Base: 9259ba5.

## Melhorias

- Ficha da estrutura imediatamente abaixo do modelo, antes da lista: mesmo nome, descrição e link de estudo, com número correspondente ao marcador.
- Busca por nome sem distinguir acentos ou maiúsculas. Filtra apenas a lista, mantém números originais, seleção e tecidos, mostra contagem e permite limpar. Busca e seleção reiniciam ao mudar estágio. Ausência de resultados é descrita como ausência de correspondência do nome, não ausência anatômica.
- Guia da seleção com traço mais espesso e pintada por último, após distribuir os marcadores. Não muda suas coordenadas nem cores anatômicas. O aviso de que linhas podem atravessar tecidos continua visível.

## Revisão científica focal por agentes

1. Embriologia: aprovado. Confirmados filtro exclusivo da lista, números e seleção preservados, ficha independente da busca e ordem de pintura posterior ao layout.
2. Anatomia, em sequência: aprovado. Descrições científicas preservadas; destaque da guia é feedback de seleção, não atributo biológico ou conexão anatômica.

Sem alteração de malhas, IDs, conteúdo científico ou campos de revisão humana. Revisão por IA não equivale a conferência médica. As atualizações de histologia incorporadas da base não foram auditadas nesta entrega.

## Evidências

- 43 testes aprovados em 5 arquivos; TypeScript, validador de conteúdo (30 tópicos, 783 questões) e build aprovados.
- Testes adicionais conferem busca sem acentos, numeração original, ficha antes da lista, seleção preservada quando filtrada, limpeza ao mudar estágio e ordem SVG sem deslocamento nem alteração do símbolo de acerto.
- Chrome isolado com componentes reais: aparelho faríngeo em 320×568 e 1280×900, 20 marcadores, seleção do nervo trigêmeo e ficha próxima ao modelo; sem transbordamento horizontal.
- Busca por `trigemeo` em 320 px retorna 1 de 20 e preserva o número 14 e a ficha selecionada. Capturas locais em `test-results/mobile/` (não versionadas).
- Inspeção por dimensões simuladas, não aparelho físico; página de teste sem navegação global ou conta. Não foi aferido desempenho em GPU móvel.
