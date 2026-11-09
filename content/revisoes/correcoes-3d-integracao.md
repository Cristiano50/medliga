# Integração das correções científicas e visuais 3D

Data: 09/11/2026. Base final integrada: `b11b051` (inclui as revisões genéticas/fetais e as atualizações multidisciplinar e de histologia publicadas após a avaliação inicial em `828c2bb`). As atualizações foram incorporadas preservando o módulo de histologia; estilos e validador compartilhados foram conciliados; os testes de aplicação foram repetidos após a integração.

## Implementado

- Placenta: árvores vilosas esquemáticas crescendo da placa coriônica para o compartimento materno. Implantação: sincício polar com corte consistente. Revisão cruzada de embriologia e anatomia.
- Semanas 4/6: superfície contínua no tronco mantendo curva/perfil e marcos; semana 6 com seis saliências auriculares em cada lado. Marcadores cranial/caudal nos embriões das semanas 4/6/8, ocultos em jogo e durante isolamento/corte.
- Laboratório: isolar/ocultar/restaurar e corte de exploração; lista numerada acessível; linhas ancoradas na superfície quando há dica de rótulo, evitando o centro vazio das cascas; distribuição lateral de marcadores sem empilhar nomes. Contorno e símbolos de resposta preservam as cores estruturais.
- Texto geral continua visível ao selecionar. Idades após fertilização, ausência de escala comparável e natureza esquemática das cores cardíacas ficam explícitas. O seletor usa nomes/idades reais em vez de marcas temporais uniformes enganosas.
- Teratologia: período fetal não apresentado como livre de risco; tudo-ou-nada qualificado; transferência placentária seletiva; questão sobre heparina/varfarina sem conduta universal.
- Validador de conteúdo usa `fileURLToPath`, corrigindo caminhos no Windows.

## Revisão científica

[Embriologia](correcoes-3d-embriologia.md), [anatomia](correcoes-3d-anatomia.md), [fisiologia](correcoes-3d-fisiologia.md) e [farmacologia/teratologia](correcoes-3d-teratologia.md) registram escopo e fontes. Alterações de conteúdo têm registros focais em `revisao.agentes`. Nenhum campo `revisao.humano` foi alterado. A revisão por agentes não equivale a certificação ou conferência médica integral.

## Verificações

- Vitest: 39 testes em 5 arquivos, incluindo junção corpo/cauda, normais, bilateralidade, direção vilosa, corte do sincício, seleção de fragmentos visíveis, distribuição em largura de 300 px e limpeza de isolamento/corte ao trocar estágio.
- TypeScript sem erros; validador: 20 tópicos, 523 questões, 441 escolas; build de produção e service worker gerados.
- A base `b11b051` acrescentou 16 lâminas de histologia ainda apontando para tópicos não cadastrados; o validador emite avisos não bloqueantes para essas referências. Esse módulo foi preservado, mas não recebeu auditoria científica nesta entrega focada em embriologia.
- No ambiente Windows usado, execuções restritas da suíte completa apresentaram ENOENT em arquivos temporários do runner. A execução completa sem essa restrição passou 39/39. Não foi alterada a configuração dos testes para mascarar falha.
- Inspeção real no Chrome, em página temporária local que monta os mesmos componentes sem cadastro: semana 6, seleção e isolamento bilateral; troca 6 → 8 → placenta; placenta com ramificações e marcadores. A inspeção motivou ajuste de enquadramento e ancoragem superficial. Arquivos temporários de QA não fazem parte da entrega.
- A ferramenta do navegador deixou de responder ao aplicar viewport móvel; inspeção visual móvel e verificação exaustiva dos cortes em todos os modelos continuam pendentes. Teste matemático de distribuição estreita não substitui teste visual em aparelho.
- Esta entrega não modifica regras de XP ou SQL em relação a `b11b051`; testes SQL não reexecutados localmente nesta entrega. A atualização multidisciplinar incorporada já continha alterações próprias nessa área.

## Limites e próxima etapa

Os modelos seguem esquemáticos. O corte é geométrico, não histológico: não fecha a malha nem reconstrói tecido interno. Uma âncora cortada deixa de exibir seu marcador, mesmo se outra porção da estrutura permanece; a lista oferece seleção alternativa. Linhas de rótulo podem atravessar tecidos e não indicam continuidade anatômica. Não há simulação de fluxo, transporte placentário, batimento ou morfogênese. Remodelagem da semana 8, vista reunida da gastrulação e animações funcionais ficam para etapa própria, com nova revisão científica. A conferência humana de estágio, proporções e detalhes anatômicos permanece necessária.
