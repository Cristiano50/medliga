# Revisão emb-25 — endocrinologia pediátrica (2ª etapa)

- Agente: `revisor-endocrinologia-v1` (área `endocrinologia-pediatrica`)
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Ponto de partida: relatório da 1ª etapa, `content/revisoes/e25-embriologia.md`.
- Arquivo revisado e editado: `content/embriologia/topicos/emb-25-endocrino.json`. Nenhum outro tópico foi editado.
- Nenhum id foi alterado e nenhuma letra correta mudou. `revisao.humano` continua `null`.

## 1. Resumo

Revisei o tópico inteiro com foco clínico: objetivos, resumo, 12 pontos-chave, 19 estruturas, 8 eventos, 10 correlações clínicas, 29 questões, referências, notas de divergência e incertezas.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-25 Sistema endócrino | 29 (16 múltipla, 7 V/F, 3 ordenar, 3 associar) | 0 | 1 | 8 | 9 | aprovado-com-correcoes |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável, explicação incorreta ou associação enganosa;
- **menor**: redação, terminologia, precisão ou referência.

**Gabaritos.** Nenhum gabarito estava errado. Conferi as 29 questões e as letras não mudaram: a, b, c e d continuam corretas 4 vezes cada. Pela checagem por script, todas as explicações de múltipla escolha citam a letra de cada alternativa. Nenhuma questão tem pista de comprimento: a razão entre a correta e a média dos distratores fica abaixo de 1,35 em todas.

**Resumo.** Passou de 890 para 898 palavras, dentro do limite de 900.

### Conferido por foco clínico

- **Hipotireoidismo congênito.**
  - O que foi conferido e mantido:
    - triagem por TSH em sangue seco;
    - coleta do 3º ao 5º dia, a partir de 48 h;
    - PCDT de 2021 (Portaria Conjunta SAES/SCTIE/MS nº 5, de 16/04/2021);
    - levotiroxina de 10–15 µg/kg/dia, iniciada após a coleta dos exames confirmatórios, idealmente nos primeiros 14 dias;
    - disgenesia como causa mais comum do primário permanente, com a ectopia como forma mais frequente, e disormonogênese com glândula tópica em seguida;
    - T4 materno que protege só em parte;
    - TSH que não detecta o hipotireoidismo central.
  - A q05, a q06, a q07, a q08 e a q21 estão corretas e têm distratores inequívocos.
  - Três ajustes de precisão:
    - atribuição do "sem esperar exames de imagem" (item 3 da tabela);
    - razões da janela de coleta (item 5);
    - disormonogênese não é só enzimática (item 7).
- **Ectopia e cisto do ducto tireoglosso.** Estão corretos:
  - tireoide lingual ou sublingual, às vezes como único tecido;
  - cisto mediano que sobe com a deglutição e com a protrusão da língua (q29);
  - lobo piramidal.
- **Hipopituitarismo congênito.**
  - O quadro neonatal está correto: hipoglicemia por falta de GH e cortisol, icterícia prolongada, micropênis com ou sem criptorquidia, e TSH da triagem normal com T4L baixo.
  - O gabarito e a explicação da q03 também estão corretos.
  - O problema estava na correlação, que listava genes e fenótipo de forma enganosa (item 1 da tabela). Na mesma linha, o resumo generalizava o micropênis a qualquer hipopituitarismo (item 2).
- **Craniofaringioma.** O quadro clínico está correto: suprasselar, cístico e calcificado; cefaleia e hipertensão intracraniana; hemianopsia bitemporal; deficiência de GH e diabetes insípido central. A origem foi precisada para o tipo adamantinomatoso (item 8).
- **Hipoparatireoidismo na 22q11.2.** Correlação e q11 estão corretas:
  - hipocalcemia com fósforo alto e PTH inapropriadamente baixo;
  - 3ª e 4ª bolsas, com TBX1;
  - distratores coerentes: deficiência de vitamina D e pseudo-hipoparatireoidismo têm PTH alto.
- **Zona fetal e estriol.** Estão corretos:
  - DHEA-S da zona fetal sob ACTH, 16α-hidroxilação hepática, sulfatase e aromatase placentárias;
  - estriol baixo na anencefalia e na deficiência de sulfatase ligada ao X;
  - progesterona independente do feto.
  - A q13 e a q19 estão corretas.
- **HAC.** Só como integração com o emb-17. A q23 (V) está correta. O emb-17 é coerente: HAC por 21-hidroxilase como causa mais comum de DDS 46,XX, com útero e ovários normais.
- **Filho de mãe diabética.** Estão corretos:
  - a cadeia de Pedersen (q15, q25);
  - a separação entre malformações da organogênese e macrossomia (q16).
  - A conduta continua qualitativa (grupo de risco, alimentação precoce, glicemia desde as primeiras horas), sem valores de corte, como pedido.
  - Confirmado por busca: o documento da SBP é o DC nº 16, de 9 de maio de 2022, do Departamento Científico de Endocrinologia, e diz que o filho de mãe diabética pode ter hipoglicemia assintomática já na primeira hora.
- **PNMT e cortisol.** Estão corretos a indução da PNMT pelo cortisol que chega pelo sangue do córtex (q14) e o fato de os paragangliomas secretarem sobretudo noradrenalina. A ressalva para os paragangliomas simpáticos está no item 6.
- **hCG, testosterona fetal, LH e micropênis.** Estão corretos: a hCG estimula as células de Leydig na janela de diferenciação, e o LH fetal faz o pênis crescer e o testículo descer na 2ª metade da gestação. A genitália é bem formada e o micropênis aparece só quando falta LH.

## 2. Tabela de correções

| # | id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|---|
| 1 | correlação `hipopituitarismo-congenito`; referencias | mecanismo | "mutações de fatores de transcrição hipofisários (por exemplo, PROP1 e POU1F1) ou defeitos de linha média, como a displasia septo-óptica (**em parte dos casos**, por HESX1)" | O quadro neonatal com neuro-hipófise ectópica e haste fina ou interrompida associa-se a genes de ação precoce (HESX1, LHX4, SOX3, OTX2) e a defeitos de linha média; a displasia septo-óptica é **raramente** por HESX1; na maioria dos casos a causa não é achada. PROP1 e POU1F1 agem depois, na diferenciação das linhagens, e em geral têm neuro-hipófise tópica e nenhum defeito fora da hipófise. POU1F1 poupa ACTH e gonadotrofinas; PROP1 costuma se manifestar depois do período neonatal. Referência Fang et al. (2016) acrescentada | A descrição (micropênis, hipoglicemia, neuro-hipófise ectópica) vinha seguida de PROP1/POU1F1 como exemplos. O aluno associaria POU1F1 a micropênis e a deficiência de cortisol, o que está errado. Também é imprecisa a ideia de que "parte dos casos" de displasia septo-óptica se deve a HESX1 | importante | Fang Q et al., Endocr Rev 2016;37(6):636-75 |
| 2 | emb-25 | resumo (Placenta e gônadas) | "o hipopituitarismo congênito causa micropênis" | "o hipopituitarismo congênito **com falta de LH** causa micropênis" | Nem todo hipopituitarismo congênito causa micropênis (por exemplo, a deficiência de POU1F1). Deixa o resumo coerente com o item 1 | menor | idem item 1 |
| 3 | emb-25; emb-25-q06 | resumo; pontosChave[5]; correlação `hipotireoidismo-congenito` (descrição); q06 (explicação, referência) | "sem esperar exames de imagem (PCDT/MS, 2021)" | Mantido o PCDT e acrescentado o consenso ENDO-ERN/ESPE 2021 como fonte da regra sobre imagem. Na q06: "a ultrassonografia e a cintilografia não devem atrasar o tratamento (consenso ENDO-ERN/ESPE, 2021)"; referência da q06 com van Trotsenburg et al. | A frase explícita sobre imagem não foi confirmada no texto do PCDT, porque o gov.br estava fora da rede. Uma busca a atribui ao PCDT resumido em forma condicional: a impossibilidade de fazer os exames etiológicos não deve atrasar o tratamento. No consenso europeu, a recomendação é explícita. O gabarito da q06 vale pelas duas fontes, porque o PCDT manda iniciar o mais cedo possível, após a coleta | menor | van Trotsenburg et al., Thyroid 2021;31:387-419; PCDT 2021 (via busca) |
| 4 | emb-25; evento `e25-eixo-tireoidiano-fetal`; emb-25-q26; incertezas[2] | resumo; descrição do evento; explicação | "eixo hipotálamo-hipófise-tireoide fetal amadurece **na metade** da gestação" | "...na **segunda metade** da gestação" | O eixo começa a amadurecer por volta de 20 semanas e continua até o termo e depois do parto. "Na metade" sugere que fica maduro com 20 semanas, o que contradiz a hipotiroxinemia do prematuro. A ordem da q26 e a linha do tempo não mudam (continua depois do coloide e antes da regressão da zona fetal) | menor | Fisiologia tireoidiana fetal (Fisher; Moore 11ª ed., cap. 9 — ver item 2 da seção 3 do relatório da 1ª etapa) |
| 5 | emb-25-q07 | explicação | "Por isso o MS recomenda a coleta entre o 3º e o 5º dia" | "Por isso, e também por razões ligadas a outras doenças triadas (como a fenilcetonúria), o MS recomenda..." | A janela do MS vale para o painel inteiro ("especificidades das doenças triadas"), não só para o pico de TSH. O gabarito (d) segue correto, porque o enunciado pede a razão ligada ao hipotireoidismo | menor | Página do MS sobre triagem neonatal (via busca); manual técnico de 2016 |
| 6 | emb-25-q14; correlação `neuroblastoma-feocromocitoma` | enunciado; descrição | "paragangliomas extrassuprarrenais secretam sobretudo noradrenalina" | "paragangliomas **simpáticos** extrassuprarrenais..."; na correlação, "(paragangliomas simpáticos)" | Os paragangliomas parassimpáticos de cabeça e pescoço em geral não secretam catecolaminas, ou secretam dopamina. A premissa do enunciado precisava valer sem exceção | menor | Literatura de endocrinologia (feocromocitoma e paraganglioma) |
| 7 | correlação `hipotireoidismo-congenito` | mecanismo | "disormonogênese (defeitos **enzimáticos** com glândula tópica)" | "defeitos hereditários da síntese hormonal, de enzimas, transportadores ou da tireoglobulina, com glândula tópica" | NIS, pendrina (transportadores) e tireoglobulina não são enzimas | menor | van Trotsenburg et al., 2021 |
| 8 | correlação `craniofaringioma-endocrino`; referencias | mecanismo | "Origina-se de restos epiteliais da bolsa de Rathke..." | Acrescentado: "(ducto craniofaríngeo). Essa origem embrionária vale sobretudo para o tipo adamantinomatoso, o da criança; o tipo papilar, quase restrito ao adulto, tem gênese e alterações moleculares distintas"; referência Müller et al. (2019) acrescentada | Os dois tipos histológicos diferem na gênese e na faixa etária. A origem em restos da bolsa de Rathke, que os livros de embriologia dão para todos, é a aceita para o tipo da infância | menor | Müller HL et al., Nat Rev Dis Primers 2019;5:75 |
| 9 | emb-25 | incertezas[0], [2], [3], [9] | Pendências do PCDT, do eixo, do micropênis (q03) e dos genes | Acrescentado o que esta revisão confirmou e o que continua pendente (ver seção 3) | Resolver o que deu para resolver e registrar o resto | menor | buscas de 2026-11-09 (abaixo) |

Registro acrescentado ao fim de `revisao.agentes`: `{"area": "endocrinologia-pediatrica", "agente": "revisor-endocrinologia-v1", "data": "2026-11-09", "veredito": "aprovado-com-correcoes", "notas": "9 correções (0 críticas, 1 importante, 8 menores); …"}`.

## 3. Pontos para o revisor humano

1. **PCDT do hipotireoidismo congênito (2021).** O gov.br continuou fora da rede, então não abri o texto integral. Conferir no PDF:
   - (a) se a recomendação de não esperar ultrassonografia ou cintilografia está escrita no PCDT. Uma busca atribuiu ao PCDT resumido a frase "a impossibilidade de realizar exames para determinação etiológica não deve atrasar o início do tratamento", com a investigação etiológica adiada para depois dos 3 anos nesses casos. Se a frase estiver lá, dá para voltar a atribuir a regra só ao PCDT;
   - (b) se o PCDT diferencia a conduta pelo valor do TSH no papel-filtro. O consenso europeu manda iniciar logo após a coleta quando o TSH capilar está muito alto e permite esperar 1–2 dias pelo resultado sérico quando está pouco alto. O texto segue a fórmula do PCDT resumido: "após coleta de sangue para exames confirmatórios";
   - (c) a janela do 3º ao 5º dia no manual técnico de 2016. A página atual do MS, vista por busca, diz "entre 48 horas após o parto e o 5º dia de vida", o que é compatível com a nota de divergência.
2. **Hipopituitarismo congênito.** A correlação ficou com a associação gene × fenótipo usual (Fang et al., 2016). A q03 não cita genes, então o gabarito não depende disso.
   - Sugestão sem pendência: dizer na descrição que a icterícia prolongada do hipopituitarismo é muitas vezes colestática. É um dado útil na investigação da colestase neonatal; não acrescentei para manter a mudança mínima.
   - A conferência dos genes pelo revisor de genética continua indicada (incerteza 9).
3. **Nomenclatura do diabetes insípido.** Em 2022, um grupo internacional propôs rebatizar o diabetes insípido central como "deficiência de arginina-vasopressina" (AVP-D). O texto mantém "diabetes insípido central", que ainda é o termo dos livros e das provas brasileiras. Decidir se vale acrescentar o novo nome entre parênteses aqui e no emb-18. Não confirmei se a SBEM adotou formalmente a proposta.
4. **22q11.2 (sugestão, não erro).** A hipocalcemia é muitas vezes transitória no período neonatal e pode voltar em situações de estresse (cirurgia, infecção, puberdade). Pode valer uma frase na correlação; não acrescentei porque não há erro.
5. **Proporções etiológicas do hipotireoidismo congênito.** Com pontos de corte de TSH mais baixos, várias séries, inclusive brasileiras, mostram mais casos com glândula tópica. A afirmação qualitativa do texto, de que a disgenesia é a causa mais comum do primário permanente, continua a dos livros e do PCDT. Os números foram omitidos de propósito (incerteza 1).
6. **Pendências da 1ª etapa que não são da minha área.** Ficam com o revisor humano:
   - atribuição a Moore na bolsa de Rathke;
   - zona reticular;
   - insulina fetal (8–10 semanas).

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo && npx vitest run
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

Checagens por script, feitas em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-e25-endo/`:
- ids das questões e gabaritos idênticos aos de antes da revisão;
- letras corretas a/b/c/d = 4/4/4/4;
- todas as letras citadas nas explicações;
- nenhuma razão de comprimento acima de 1,35;
- `revisao.humano` = `null`.

Fontes consultadas por busca na web em 2026-11-09. Não abri os PDFs: gov.br, sbp.com.br e hcfmb.unesp.br estavam fora da rede liberada da sessão.
- PCDT Hipotireoidismo Congênito (Conitec): https://www.gov.br/conitec/pt-br/midias/protocolos/20210426_portaria_conjunta_pcdt_hipotireoidismo_congenito.pdf e PCDT resumido: https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/pcdt_resumido_do_hipotireoidismo.pdf
- Ministério da Saúde, Triagem neonatal: https://www.gov.br/saude/pt-br/composicao/saes/triagem-neonatal
- SBP, Hipoglicemia neonatal (DC nº 16, 2022): https://www.sbp.com.br/fileadmin/user_upload/23452c-DC_Hipoglicemia_neonatal.pdf e notícia da SBP: https://www.sbp.com.br/hipoglicemia-neonatal-sbp-aborda-principais-causas-diagnostico-e-tratamento-do-disturbio/
- Fang et al., 2016 (Endocr Rev): https://ri.conicet.gov.ar/handle/11336/116202
- Müller et al., 2019 (Nat Rev Dis Primers): https://www.nature.com/articles/s41572-019-0125-9.pdf
- HESX1, PROP1 e POU1F1 em coortes de hipopituitarismo e de displasia septo-óptica: https://research.birmingham.ac.uk/en/publications/mutation-analysis-of-pouf-1-prop1-and-hesx1-show-low-frequency-of
