# Laboratório 3D — revisão móvel (2026-11-09)

## Escopo e correções

- Marcadores e textos de orientação só são projetados quando suas âncoras têm coordenadas finitas dentro do enquadramento nos três eixos. Isso não implica ausência anatômica da estrutura; a lista continua disponível e Restaurar vista recupera o enquadramento.
- Abas do laboratório quebram linha em telas estreitas; controles pequenos têm altura mínima de 44 px.
- Preservada a camada DOM de marcadores integrada em `f48492f`, que elimina as raízes React aninhadas. Geometria, proporções, IDs, conteúdo didático e revisão humana não foram alterados nesta entrega.

## Revisão científica por agentes

1. Embriologia: aprovado após integração; ocultar a indicação cranial/caudal fora do quadro evita posicioná-la falsamente na borda. Recomendação de esclarecer o comportamento das indicações de orientação incorporada ao aviso.
2. Anatomia, em sequência: aprovado; projeção, identificação e filtros de corte preservados. Ajustes de disposição não alteram relações anatômicas.

Aprovação focal por IA, não conferência médica. Os novos tópicos de histologia integrados do repositório não fazem parte desta revisão.

## Verificação

Capturas automatizadas em Chrome headless, usando os componentes reais do laboratório com conteúdo local, em 320×568, 390×844 e 844×390. Modelos: placenta/membranas, semana 6 e aparelho faríngeo. A página de teste não contém navegação global, conta ou dados pessoais.

Verificados enquadramento, abas, controles e camada de marcadores. Nenhum transbordamento horizontal nos nove cenários. Contagens no enquadramento inicial: 10, 7 e 20 marcadores, respectivamente. Evidências locais em `test-results/mobile/` (não versionadas).

No aparelho faríngeo a 320 px, aproximação forte reduziu os marcadores de 20 para 8, todos com âncoras dentro do palco; Restaurar vista recuperou os 20. Corte de exploração deixou 7 marcadores. As capturas da semana 6 mostram as duas indicações de orientação na vista inicial.

Testes automatizados: 40 aprovados em 5 arquivos, incluindo limites do enquadramento e valores inválidos. TypeScript, validação de conteúdo e build aprovados após integrar `f48492f` (30 tópicos, 783 questões).

Limites: emulação de dimensões, não teste em aparelho físico; toque multidedos e desempenho em GPU móvel não aferidos. Em paisagem, a página mantém rolagem vertical para preservar o espaço mínimo entre os 20 marcadores.
