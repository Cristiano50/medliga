# Correções focais — teratologia e representação 3D

Data: 09/11/2026. Revisor: agente de farmacologia/teratologia (`revisor-3d-teratologia-v1`).

Escopo: quatro achados da avaliação visual/científica, aplicados ao destaque do estágio `semana-8`, ao resumo e à estrutura `placenta` do tópico `emb-10-malformacoes` e à questão `emb-10-q19`. Uma questão revisada nesta etapa; não houve auditoria integral do tópico, das demais questões ou das geometrias. Foram feitas quatro correções importantes de abrangência/ambiguidade, sem mudança de ids ou gabarito e sem preenchimento de `revisao.humano`.

| Item | Antes, resumido | Depois, resumido | Motivo e fonte |
|---|---|---|---|
| `semana-8`, `destaques[1]` | Encerra-se o período de maior sensibilidade a teratógenos | Especifica malformações estruturais maiores e mantém riscos fetais de crescimento e função | Evitar leitura de que o risco acaba na semana 8; CDC e OTIS |
| `emb-10`, `resumo` | Tudo ou nada sem qualificação | Princípio geral com exceções conforme a exposição | Evitar regra determinística para exposições precoces; OTIS |
| `emb-10`, estrutura `placenta`, `destino` | Termo barreira placentária considerado inadequado | Barreira não absoluta, com transferência dependente da substância e exemplo da heparina | Evitar a inferência de passagem irrestrita de qualquer substância; FDA |
| `emb-10-q19`, enunciado e explicação | Substituição de varfarina por heparina e escolha de anticoagulante formuladas genericamente | Pergunta somente sobre passagem placentária; explicação ressalva decisão individual em próteses mecânicas | Transferência placentária não basta para determinar conduta clínica; SMFM |

## Fontes verificadas

- [CDC — About Alcohol Use During Pregnancy](https://www.cdc.gov/alcohol-pregnancy/about/index.html): não há período conhecido seguro para álcool; o cérebro se desenvolve e pode ser afetado durante toda a gestação.
- [OTIS/MotherToBaby — Critical Periods of Development, 1 de abril de 2025](https://mothertobaby.org/fact-sheets/critical-periods-development/): diferencia efeitos estruturais e funcionais, datação gestacional e pós-concepção, e registra exceções ao princípio de tudo ou nada.
- [FDA — Reviewer Guidance: Evaluating the Risks of Drug Exposure in Human Pregnancies](https://www.fda.gov/media/71368/download): referência conceitual sobre transferência placentária e exceções como heparina; documento histórico, não empregado como diretriz terapêutica atual.
- [SMFM Consult Series #61 — Anticoagulation in pregnant patients with cardiac disease, 2022, reafirmado em 2024](https://publications.smfm.org/publications/445-society-for-maternal-fetal-medicine-consult-series-61/): anticoagulação em próteses mecânicas depende de válvula, trimestre, tolerância individual ao risco e contexto do parto.

## Consequências para o design

Uma futura linha do tempo não deve sinalizar ausência de risco após a semana 8. Exposições não devem produzir malformações obrigatórias em animações; risco e causalidade precisam permanecer distintos. Um detalhe ampliado de transferência placentária precisa representar compartimentos separados e passagem seletiva, sem sugerir mistura direta dos sangues ou parâmetros quantitativos não validados.

## Conferência humana

Permanecem pendentes a conferência médica das alterações e a avaliação de qualquer futura simulação de exposição, dose ou risco individual. O registro `aprovado-com-correcoes` refere-se exclusivamente ao escopo focal acima; não certifica o restante do conteúdo.

## Validação

- `node --experimental-strip-types scripts/validar-conteudo.ts`: aprovado — 20 tópicos, 523 questões, 441 escolas.
- `node node_modules/vitest/vitest.mjs run`: 34 testes aprovados em 4 arquivos, na árvore compartilhada durante esta entrega. Aviso de depreciação do carregamento CommonJS de three.js; nenhum teste falhou.
- O validador usava `URL.pathname` como caminho de arquivo, produzindo `C:\C:\...` no Windows. Corrigido para `fileURLToPath`, preservando compatibilidade com caminhos de arquivo locais.
