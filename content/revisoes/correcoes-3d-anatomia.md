# Correções visuais 3D — revisão anatômica por agente

Data: 09/11/2026. Base examinada: `828c2bb`. Esta revisão é focal; não constitui conferência médica nem validação integral do banco de questões. `revisao.humano` não foi alterado.

## Implementação

| Área | Antes | Depois | Motivo e limite |
|---|---|---|---|
| Semana 6, saliências auriculares | Seis saliências apenas no lado +z | Seis em cada lado, com correspondência bilateral | Modelo rotacionável deve preservar bilateralidade. Mantida representação didática tradicional, sem atribuição nova de destinos individuais. |
| Semanas 4 e 6, tronco | Cadeia de 81/71 esferas sobrepostas, com numerosas interseções de superfícies | Superfície contínua varrida na mesma curva C, com os mesmos perfis de calibre e compressão lateral 0,88 | Melhora leitura de volume e reduz malhas. Não é reconstrução a partir de imagem médica; a superfície interpolada substitui o envelope discretizado das esferas, não promete igualdade vértice a vértice. |
| Semana 4, cauda | Conjunto separado de esferas | Superfície própria, com anel coincidente e normais iguais às do tronco | Preserva id `eminencia-caudal`, prioridade de seleção e continuidade da junção. |
| Orientação | Sem marcadores ligados às extremidades | Cranial e caudal acompanham a rotação dos modelos das semanas 4, 6 e 8, apenas no laboratório | Não cria um eixo dorsal/ventral global incorreto para um embrião curvo; não acrescenta pistas ao modo Identifique. Marcadores ocultos durante isolamento, corte de exploração ou ocultação do corpo/cauda, evitando referências soltas. |

Cabeça, olhos, somitos, arcos faríngeos, brotos, mãos, raios digitais, proeminências e inserções mantêm suas coordenadas originais. A semana 8 não foi remodelada. A intenção é manter o aspecto embrionário esquemático, sem introduzir proporções de um bebê.

## Validação geométrica

`tests/superficie-embriao.test.ts`: 3 testes aprovados — anéis/normal da junção corpo-cauda coincidentes; faces externas e normais finitas/unitárias com simetria lateral; seis saliências correspondentes de cada lado. Execução conjunta com `tests/conteudo.test.ts`: 9/9 aprovados. Esses testes verificam propriedades matemáticas e consistência de ids, não fidelidade anatômica completa.

A conferência visual em execução da entrega principal confirmou bilateralidade auricular e isolamento. O marcador cranial da semana 6 exigiu ampliação do enquadramento; a entrega principal ajusta os raios de câmera. A checagem global de tipos deve ser repetida após integração das alterações concorrentes.

## Revisão transversal das alterações de placenta e implantação

Conferência por código das alterações do agente de embriologia:

- **Placenta:** a nova ramificação cresce da placa coriônica para +y, em direção ao compartimento materno, corrigindo a orientação invertida dos cones. Não representa circulação nem contagem biológica de vilosidades. Não interpretar todas as ramificações como vilosidades de ancoragem. O espaço interviloso deve continuar distinguível da cavidade amniótica.
- **Implantação:** sincício polar e componentes compartilham o corte em z≤0, corrigindo a casca integral que envolvia o corte anterior. Distribuição e espessura continuam esquemáticas; a metade polar não deve ser generalizada como limite anatômico fixo para todos os dias de implantação.
- **Veredito transversal:** coerentes para representação esquemática, condicionadas à verificação visual final de orientação, interseções e legibilidade. Nenhuma aprovação humana registrada.

## Fontes consultadas

- [UNSW — desenvolvimento da orelha externa](https://embryology.med.unsw.edu.au/embryology/index.php/Hearing_-_Outer_Ear_Development): seis saliências no esquema tradicional de formação de cada pavilhão.
- [UNSW — desenvolvimento das vilosidades](https://embryology.med.unsw.edu.au/embryology/index.php/Placenta_-_Villi_Development): crescimento e ramificação vilosa no compartimento materno.
- [Embryology.ch — trofoblasto](https://embryology.ch/old/anglais/fplacenta/fecond03.html): origem polar e progressão da implantação.

Conferência humana ainda necessária, especialmente para refinamentos de morfologia, proporções e correspondência com estágio Carnegie. Não foram adicionadas animações fisiológicas.
