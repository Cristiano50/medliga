# Semana 8 — refinamento da superfície 3D

Data: 2026-11-09. Base: 7c832eb. Escopo: primeiro modelo remodelado nesta etapa, a 8ª semana; não é uma remodelagem de todo o catálogo.

## Implementação

O corpo anteriormente composto por esferas, elipsoides e cápsulas sobrepostos foi substituído por uma superfície contínua. A união suave preserva o envelope craniano, o volume do tronco e os pontos articulares anteriores, acrescentando uma transição cervical curta e membros afilados. Mãos e pés continuam pequenos e simplificados; dedos separados, pálpebras, orelhas e herniação umbilical mantêm seus objetos e IDs.

O cordão passa a ter curvatura suave, atravessa a inserção externa anterior e mantém o extremo distal. Seu início fica enterrado no tronco para não mostrar uma tampa desconectada. Não há representação dos vasos ou de histologia no extremo distal.

O modelo fetal da placenta e a função compartilhada que gera seus dados não foram alterados. Cores de identificação, seleção, recorte e avisos didáticos continuam ativos.

## Referência e limites científicos

Referência de morfologia externa: [National Museum of Health and Medicine — Carnegie 23](https://medicalmuseum.health.mil/index.cfm/collections.hdac.anatomy.s23), consultada em 2026-11-09. A descrição sustenta cabeça arredondada, diferenciação cervical e subdivisões dos membros, mas não valida as coordenadas ou proporções deste esquema procedural.

O resultado tem formas mais contínuas, não maior precisão anatômica demonstrada. Cabeça quase esférica, face, pavilhões e mãos permanecem simplificados. A postura anterior foi preservada; a descrição clássica de antebraço elevado não foi usada como alegação de correspondência exata do modelo a um espécime Carnegie 23. Não foram acrescentadas musculatura adulta, vascularização decorativa, unhas ou detalhes faciais inventados. Conferência médica permanece pendente.

## Revisão por especialistas

- Embriologia: aprovado no escopo focal de suavização didática, após leitura do código e das capturas. Preservados cabeça grande, dedos separados, hérnia fisiológica e ausência de cauda. Solicitou garantir tampa proximal interna; ajuste realizado e protegido por teste.
- Anatomia, segunda revisão sequencial: aprovado após inspeção de código, testes e quatro capturas. Preservadas continuidade cranio-cervical, articulações, marcos externos e seleção. O trecho cinza proximal corresponde à parede exterior do cordão; a aprovação não valida proporções como medidas reais.

## Verificação técnica e visual

- 46 testes aprovados em 6 arquivos; TypeScript, conteúdo (30 tópicos, 783 questões) e build aprovados.
- Testes novos: marcos articulares dentro da superfície, bilateralidade, continuidade cervical, limites craniano/caudal, normais unitárias e orientação externa das faces, orçamento de geometria e tampa proximal inteira dentro do campo corporal.
- Malha principal: 22.960 vértices indexados, 45.894 triângulos. Geração local medida em aproximadamente 1,08 s, sem promessa de desempenho equivalente em celular. Construída uma vez por montagem e liberada ao sair do modelo.
- Capturas Chrome isolado: 320×568 e 1280×900, cinco marcadores e sem transbordamento horizontal; vistas orbitadas de ambos os lados e posterior; seleção dos dedos preservada. Evidências locais em `test-results/mobile/semana8-escultura-vista*.png` e `semana8-dedos-selecao.png`.
- Dimensões móveis simuladas, não aparelho físico. O corte continua geométrico, sem reconstrução de tecidos internos; não é uma nova representação histológica.
