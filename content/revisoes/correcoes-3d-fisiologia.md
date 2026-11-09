# Revisão focal de fisiologia — apresentação 3D

Data: 2026-11-09. Agente: revisor-3d-fisiologia-v2.

## Escopo e resultado

Revisão transversal por leitura do código local após as alterações de embriologia, anatomia e farmacologia. Arquivos examinados: Cena3D.tsx, Lab3D.tsx, tres/nucleo.tsx, tres/rotulos.tsx, modelos/placenta.tsx e modelos/implantacao.tsx; alterações selecionadas de estagios.json (semana-8) e emb-10-malformacoes.json (resumo, placenta e emb-10-q19). Não é auditoria integral do banco de questões, validação histométrica nem conferência médica. Não executei a inspeção visual integrada ou os testes nesta etapa; esses procedimentos ficam registrados pela integração principal.

Veredito focal: aprovado quanto à semântica fisiológica das alterações examinadas, sem nova falha científica bloqueante identificada por leitura. Zero correções adicionais de conteúdo realizadas por este agente. Conferência médica permanece pendente; nenhum campo revisao.humano foi preenchido.

## Conferência das alterações

| Elemento | Evidência no código | Parecer |
|---|---|---|
| Cores do coração | Lab3D mantém aviso persistente de que cores identificam estruturas e não oxigenação; nucleo substitui emissão colorida por contorno e os marcadores usam símbolos de resposta. | Adequado. O azul da veia umbilical não deve ser interpretado como escala de oxigenação: o sangue retorna da placenta ao feto por essa veia [1]. |
| Fluxo e batimento | Cena3D usa renderização por demanda; modelos cardíacos continuam sem animação fisiológica nova. Aviso explicita conexões esquemáticas. | Não se introduziu direção de fluxo, frequência ou sincronização fisiológica fictícia. Uma futura animação requer revisão própria. |
| Corte e isolamento | Plano de corte geométrico, filtros de interseção e visibilidade; avisos dizem que vizinhos estão ocultos e que a superfície cortada não foi reconstruída. | São ferramentas de exploração, não lesões ou cortes histológicos. As ferramentas ficam desativadas no modo de jogo. Não interpretar o interior vazio da malha como cavidade biológica demonstrada. |
| Idade e escala | Lab3D distingue idade após fertilização e gestacional aproximada; informa ausência de escala comparável e que intervalos do controle não representam duração. Descrição geral permanece exibida durante a seleção. | Adequado; a diferença aproximada de duas semanas está coerente com [2]. Não fornece precisão temporal artificial. |
| Placenta | geometriasVilosidades parte da placa coriônica e cresce na direção materna; sem capilares, circulação ou partículas novas. | Coerência estrutural melhora em relação aos cones anteriores. Continua esquema macroscópico simplificado: não demonstra transporte ou mistura sanguínea. Não usar a ramificação como contagem anatômica ou árvore vascular funcional. |
| Implantação | Sincício polar, hemicorte compartilhado; sem nova circulação simulada. | Não introduz afirmação funcional nova. Aprovação geométrica detalhada consta da revisão de embriologia. |
| Semana 8 e tudo-ou-nada | Texto diferencia malformações estruturais maiores de efeitos posteriores sobre função/crescimento; resumo inclui exceções ao princípio de tudo-ou-nada. | Consistente com [2], sem sugerir fim absoluto do risco teratogênico. |
| Placenta e anticoagulantes | Texto descreve transferência seletiva; q19 distingue passagem placentária e elimina inferência de substituição universal de varfarina. | Ressalva clínica de individualização está coerente com SMFM [3]. Revisão farmacológica detalhada permanece no relatório da área; não revalidei doses ou tratamentos de todo o tópico. |

## Pontos para a integração e revisão humana

- Confirmar visualmente cortes em várias posições. O marcador é ocultado quando sua âncora passa para a região cortada, mesmo que outra porção da estrutura permaneça visível; isso é limitação de interface, não evidência de desaparecimento biológico. A lista permanece como forma de seleção.
- Marcadores são ligações esquemáticas e não evidência de continuidade tecidual. O aviso existente de que linhas podem atravessar tecidos deve permanecer.
- A placenta ainda não representa os dois circuitos sanguíneos nem a membrana de troca. Ausência desses elementos é compatível com o escopo estrutural; não anunciar o modelo como simulador fisiológico.
- A aprovação é focal. Não resolve pendências preexistentes de estadiamento, dimensões, decídua capsular ou revisão humana, registradas em estagios-3d.md.

## Fontes verificadas

1. American Heart Association. [Fetal Circulation](https://www.heart.org/en/health-topics/congenital-heart-defects/symptoms--diagnosis-of-congenital-heart-defects/fetal-circulation), página revisada em 10/06/2026, consultada em 09/11/2026. Sustenta sentido do fluxo umbilical e papel placentário nas trocas.
2. OTIS/MotherToBaby. [Critical Periods of Development](https://mothertobaby.org/fact-sheets/critical-periods-development/), 01/04/2025, consultada em 09/11/2026. Sustenta distinção de idades, efeitos funcionais/crescimento posteriores e exceções ao tudo-ou-nada.
3. Society for Maternal-Fetal Medicine. [Consult Series #61: Anticoagulation in pregnant patients with cardiac disease](https://publications.smfm.org/publications/445-society-for-maternal-fetal-medicine-consult-series-61/), 2022, reafirmado em 2024, consultado em 09/11/2026. Sustenta individualização em próteses valvares mecânicas conforme válvula, trimestre e riscos.
