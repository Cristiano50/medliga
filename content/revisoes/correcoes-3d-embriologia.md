# Correções geométricas — embriologia

Data: 2026-11-09. Revisão e implementação por agente de IA em papel de embriologista; conferência médica pendente. Não altera `revisao.humano`, textos, gabaritos ou IDs. A revisão transversal anatômica ocorrerá após esta implementação.

## Escopo e alterações

| Modelo | Antes | Depois | Justificativa |
|---|---|---|---|
| Placenta no início do período fetal | Cones apontavam para −y, lado fetal; decídua basal estava no lado +y. | Árvores vilosas com ramificações simples crescem da face materna da placa coriônica para +y. Placa e decídua foram separadas para tornar legível o compartimento interviloso. | Vilosidades se projetam no compartimento materno, não na cavidade amniótica. |
| Implantação, aproximadamente dia 8 | Esfera irregular completa representava o sincício, apesar do comentário sobre polo inferior. | Casca espessada em direção ao polo embrionário (−y), aberta no plano de corte z=0; camadas internas e endométrio compartilham o hemicorte. | Preserva polaridade da invasão e torna visível a relação epiblasto–cavidade amniótica–hipoblasto. |

## Fontes consultadas

- [UNSW Embryology — Placenta, Villi Development](https://embryology.med.unsw.edu.au/embryology/index.php/Placenta_-_Villi_Development): crescimento viloso no tecido/compartimento materno, ramificação e distinção de vilosidades terminais tardias.
- [Embryology.ch — The trophoblast](https://embryology.ch/old/anglais/fplacenta/fecond03.html): diferenciação e invasão no polo embrionário; esquema do oitavo dia.
- [UNSW Embryology — Implantation](https://embryology.med.unsw.edu.au/embryology/index.php/Implantation): contexto temporal e espacial da implantação humana.

## Limites científicos e visuais

- São esquemas didáticos fora de escala, sem pretensão de reconstrução histológica. Espessuras, quantidade de ramos e distâncias são escolhas para legibilidade; não são medidas biológicas.
- A placenta mostra árvores simplificadas livres no compartimento interviloso; não detalha vilosidades de ancoragem, capilares, citotrofoblasto ou barreira placentária. Não representa vilosidades terminais maduras de terceiro trimestre.
- A extensão do sincício não corresponde a um ângulo universal medido em espécime; indica espessamento polar no estágio aproximado. O recorte de meia peça é uma operação didática, não ausência anatômica.
- A região polar é uma casca fechada nas bordas de corte. As camadas internas são superfícies esquemáticas; o modelo não demonstra migração celular ou dinâmica de invasão.
- Esta entrega não é revisão integral das questões nem certificação por médico. Inspeção renderizada e revisão transversal devem verificar a leitura das relações espaciais antes da publicação.

## Verificação

`tests/geometria-embriologia.test.ts` confere polaridade e hemicorte do sincício, maior espessamento polar e limites espaciais das vilosidades em relação ao âmnio/decídua. Execução: `node node_modules/vitest/vitest.mjs run tests/geometria-embriologia.test.ts` — **2/2 testes passaram**. Há um aviso de depreciação do carregamento CommonJS de Three.js; não houve falha de teste. Inspeção visual renderizada continua a cargo da revisão integrada.

## Revisão transversal focal das alterações dos outros agentes

Revisor: `revisor-geometria-embriologia-v2`. Veredito: aprovado no escopo abaixo, sem nova correção. Não constitui conferência humana nem revisão integral dos estágios/tópicos.

- **Anatomia, semanas 4 e 6:** revisão de `superficie-embriao.ts` e integração em `embriao.tsx`. Curva em C, função de calibre e compressão lateral preservadas; junção entre corpo e eminência caudal compartilha anel. Saliências auriculares passam a existir dos dois lados. A simplificação clássica das seis saliências por lado permanece explicitamente esquemática. Fonte: [UNSW — Outer Ear Development](https://embryology.med.unsw.edu.au/embryology/index.php/Hearing_-_Outer_Ear_Development).
- **Teratologia:** conferidos apenas os trechos alterados de `semana-8` e `emb-10-malformacoes`, incluindo a única questão `emb-10-q19`. A distinção entre risco estrutural e funcional, ressalva ao princípio de tudo ou nada e ausência de indicação universal para trocar varfarina por heparina são coerentes com [OTIS/MotherToBaby — Critical Periods of Development](https://mothertobaby.org/fact-sheets/critical-periods-development/) e [SMFM Consult #61](https://publications.smfm.org/publications/445-society-for-maternal-fetal-medicine-consult-series-61/), consultadas nesta revisão. A transferência seletiva é coerente com a diferenciação materno-fetal; não foi criada simulação quantitativa.
- **Verificação conjunta:** `node node_modules/vitest/vitest.mjs run tests/geometria-embriologia.test.ts tests/superficie-embriao.test.ts` — 5/5 testes passaram.
- Registros focais acrescentados em `revisao.agentes`; todos os valores de `revisao.humano` preservados. O estado de inspeção visual acima é o desta sub-revisão de código; a entrega integrada registra sua própria inspeção renderizada.
