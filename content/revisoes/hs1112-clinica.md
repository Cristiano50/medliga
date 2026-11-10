# Revisão HS11-12 — cardiologia/imunologia/infectologia (tópicos 11 e 12)

- Agente: `revisor-cardio-imuno-v1` (2ª etapa, revisão transversal clínica: cardiologia, imunologia clínica, infectologia/imunizações e patologia)
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, com a 3ª verificação (fonte primária no texto integral) feita por mim, com curl pelo proxy (sem WebFetch). Formato: `docs/conteudo-schema.md`.
- Arquivos editados: `content/histologia/topicos/his-11-circulatorio.json`, `content/histologia/topicos/his-12-linfoide.json` e este relatório. Nada mais foi alterado. Sem commit.
- Situação: **revisão por agente (IA)**. Não substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.
- Ids e gabaritos: verificados por script contra a cópia anterior. Nenhum id de tópico, questão, alternativa, item, estrutura, evento ou correlação mudou. Nenhuma `correta`, `ordemCorreta`, par, `ordem` de evento, texto de alternativa, `dificuldade` ou `bloom` mudou. As entradas anteriores de `revisao.agentes` estão intactas; a minha foi acrescentada no fim.

## 1. Resumo

Revisei integralmente os dois tópicos (objetivos, resumo, pontos-chave, estruturas, eventos, correlações clínicas, 58 questões, referências, notas de divergência e incertezas), com foco na aplicação clínica pedida: aterosclerose, arteriolosclerose, aneurismas e aortite sifilítica, varizes, endocardite, infarto subendocárdico e WPW (his-11); asplenia e vacinação, DiGeorge, timoma e miastenia, linfadenopatia reacional × linfoma, BCL2 e hiperplasia folicular tímica (his-12).

**Nenhum gabarito estava errado e nenhuma correção é crítica.** O ponto mais relevante está em his-11: a correlação de aterosclerose dizia que as placas de capa fina, núcleo lipídico grande e muitos macrófagos "rompem-se ou sofrem erosão". A erosão ocorre tipicamente em outro tipo de placa: rica em células musculares lisas e proteoglicanos, com poucos macrófagos e capa íntegra. Também em his-11, a correlação de varizes chamava as hemorroidas de "dilatações venosas". Esse ponto veio do revisor do his-14, por meio do coordenador. Corrigi pelo consenso SICCR 2020 e por uma revisão de 2025, os dois lidos no texto integral. Nenhuma questão dependia da definição antiga. Na asplenia (his-12), a redação da 1ª etapa foi reconferida no texto integral e continua válida. Li as notas técnicas do MS publicadas depois de junho de 2026, e nenhuma muda a indicação na asplenia.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-11 Sistema circulatório | 29 | 0 | 2 | 6 | 8 | aprovado-com-correcoes |
| his-12 Órgãos linfoides | 29 | 0 | 0 | 6 | 6 | aprovado-com-correcoes |
| **Total** | **58** | **0** | **2** | **12** | **14** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou fato impreciso que induz a erro; **menor** = redação, precisão, completude, terminologia, referência.

Checagens por script, depois das edições:
- **Letras corretas**: a/b/c/d = 4/4/4/4 nos dois tópicos. Nenhuma alternativa foi editada, por isso não há redistribuição nem mudança de pista de comprimento.
- **Explicações**: em todas as 32 questões de múltipla escolha, a explicação continua citando a letra de cada alternativa.
- **Campos alterados**: his-11: correlações `aterosclerose`, `varizes` e `isquemia-subendocardica`, estrutura `celula-espumosa`, explicações de q10 e q14, referência curta de q12, q13 e q16, referências, notas de divergência, incertezas e revisão. his-12: resumo (uma frase), correlações `linfadenopatia-reacional-linfoma`, `asplenia-encapsulados` e `timoma-miastenia`, q11 (contexto, explicação e referência), q16 (explicação e referência), referências, notas de divergência, incertezas e revisão.

### Testes

- `npm run validar-conteudo`: **passou** ("Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441").
- `npx vitest run`: **83 de 84 testes aprovados** (8 de 9 arquivos). A única falha não é destes tópicos: `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, com "pulmao: expected false to be true". A lâmina `pulmao` tem desenho mas ainda não tem dados, e outro agente está trabalhando nela. É a mesma falha registrada na 1ª etapa. Ignorada, como pedido.

## 2. Tabela de correções

### his-11 — Sistema circulatório

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| correlação `aterosclerose` | descricao | Placas de capa fina, núcleo lipídico grande e muitos macrófagos "rompem-se **ou sofrem erosão** e causam trombose" | Essas placas "rompem-se e causam trombose". Frase nova: parte das tromboses ocorre por **erosão**, com o endotélio se desprendendo de placas ricas em células musculares lisas e proteoglicanos, com poucos macrófagos e capa fibrosa íntegra | A erosão foi atribuída ao fenótipo da placa que se rompe. Na prova, ruptura × erosão é cobrada justamente por esse contraste. Nenhuma questão cobrava o ponto | importante | Baaten et al., Eur Heart J 2024 (PMC10757869, texto integral) |
| correlação `varizes` | descricao | "Varizes esofágicas (hipertensão portal) e **hemorroidas são dilatações venosas** de outros territórios" | As varizes esofágicas continuam como dilatações venosas de outro território. Hemorroidas: "não são simples varizes: são **coxins vasculares normais do canal anal**, com vasos, conjuntivo e músculo liso". A **doença hemorroidária** passa a ser "o aumento e o deslocamento (prolapso) sintomático desses coxins, distinta das varizes anorretais da hipertensão portal" | A redação antiga confundia uma estrutura normal com variz. Na literatura atual, a teoria varicosa é só uma de três hipóteses não comprovadas, e o consenso trata à parte as varizes anorretais. Ponto levantado pelo revisor do his-14. **Nenhuma questão dependia da definição antiga**: o termo só aparecia nessa correlação. As questões de varizes (q14, q29) tratam de veias dos membros inferiores | importante | Gallo et al., consenso SICCR, Tech Coloproctol 2020 (PMC7005095); Parol et al., Int J Mol Sci 2025 (PMC12524921), textos integrais |
| estrutura `celula-espumosa` (+ nota de divergência nova) | definicao; origem | "Macrófago (e, **em menor grau**, célula muscular lisa)"; origem "**sobretudo** monócitos" | "Célula da íntima (macrófago ou célula muscular lisa)"; origem: monócitos e células musculares lisas da íntima, que respondem por boa parte das células espumosas em placas coronárias humanas avançadas | Dados em placas humanas contrariam "em menor grau". Não usei número: o de Allahverdian (50%) só foi lido no resumo. Os eventos e a q26 (estria gordurosa de macrófagos espumosos) não mudam | menor | Bennett et al., Circ Res 2016 (PMC4762053, texto integral pelo OAI do PMC); Allahverdian et al., Circulation 2014 (resumo) |
| correlação `isquemia-subendocardica` | descricao | O infarto subendocárdico "pode ocorrer com estenoses difusas ou quedas globais da perfusão, como no choque" | Pode ocorrer **quando a oclusão se desfaz (espontaneamente ou pelo tratamento) antes que a necrose, que avança do subendocárdio para o epicárdio, atravesse a parede**, ou com estenoses difusas e quedas globais da perfusão, caso em que costuma ser circunferencial | O texto anterior sugeria que o infarto subendocárdico não envolve oclusão. A q16 (choque, necrose circunferencial) continua válida | menor | Hedström et al., J Cardiovasc Magn Reson 2009 (PMC2758877, texto integral): a transmuralidade cresce com a duração da isquemia no ser humano |
| his-11-q10 | explicacao | "com crises de **taquicardia**, como neste rapaz, fala-se em síndrome de WPW" | "quando há taquicardias sintomáticas, como sugerem as **crises de palpitação** deste rapaz, fala-se em síndrome de WPW" | A vinheta descreve palpitações, não taquicardia documentada. A resposta (c) não muda | menor | Leoni et al., J Cardiovasc Med 2023 (PMC10836786; lido na 1ª etapa): síndrome quando o padrão corresponde a sintomas atribuíveis a taquicardia |
| his-11-q14 | explicacao (c) | "Músculo cardíaco **na adventícia** existe **apenas** nas veias cavas e pulmonares" | "Músculo cardíaco na parede venosa só existe nas grandes veias junto ao coração, como as cavas e as pulmonares, e não nas veias superficiais das pernas" | A túnica exata das extensões miocárdicas não foi conferida (ponto 5 da 1ª etapa), e "apenas" excluía outras grandes veias junto ao coração, como o seio coronário. A alternativa (c) continua claramente errada | menor | Ross 8ª ed., cap. 13 (sem o livro em mãos) |
| his-11-q12, q13, q16 | referencia | Só Robbins (+ Junqueira) | + Dos Santos et al., J Vasc Bras 2021 (q12); + Pivatto Júnior et al., Braz J Infect Dis 2017 (q13); + Hedström et al. 2009 (q16) | Fontes conferidas no texto integral | menor | ver seção 3 |
| incertezas (Robbins de memória; endocardite) e referências | incertezas; referencias | Arteriolosclerose, Mönckeberg e aortite sifilítica listados como "de memória"; endocardite sem texto integral | Arteriolosclerose hialina × hiperplásica, Mönckeberg não obstrutiva e endarterite obliterante dos vasa vasorum conferidas. Endocardite: Duke-ISCVID 2023 de novo sem texto integral, e o estudo de validação aberto descreve os critérios maiores. Seis referências acrescentadas | Fontes lidas. O conteúdo de endocardite continua qualitativo, como pedido | menor | Dos Santos 2021; Pivatto Júnior 2017; Uehara 2023; Papadimitriou-Olivgeris 2024 |

Conferidos **sem mudança** em his-11:
- **Arteriolosclerose hialina × hiperplásica** (resumo, correlação, q12, q29) e **Mönckeberg** (distrator da q12, "sem estreitamento importante do lúmen"), conforme Dos Santos et al. 2021.
- **Aortite sifilítica** (correlação, q13, q29), conforme Pivatto Júnior 2017, Uehara 2023 e Litmanovich 2012 (aorta ascendente mais acometida; valvulite com insuficiência aórtica).
- **Capa fibrosa e placa vulnerável** na q11, conforme Baaten 2024.
- **Varizes dos membros inferiores** (correlação, q14, q29), compatíveis com Robbins. Não achei diretriz brasileira aberta: a busca no Europe PMC expirou. O trecho das hemorroidas foi corrigido (ver tabela).
- **Endocardite** (correlação, q15), já qualitativa. Não há critérios, números nem esquemas.
- **WPW padrão × síndrome** (correlação, q10, q22), conforme Leoni 2023 e Mohan 2019, lidos na 1ª etapa.
- Hemostasia, NO, Weibel-Palade, linfáticos e sistema de condução: sem problema clínico.

### his-12 — Órgãos linfoides e sistema imune

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| correlação `linfadenopatia-reacional-linfoma` | descricao | "a distinção exige exame histológico com imuno-histoquímica, que depende da avaliação da arquitetura" | + "Como o diagnóstico depende da arquitetura, as diretrizes do Ministério da Saúde **preferem a biópsia excisional** do linfonodo e não consideram a **punção aspirativa por agulha fina** um método diagnóstico adequado" | Era o ponto de foco. Lugano 2014 continuou sem texto integral, por isso usei as diretrizes brasileiras, que dizem o mesmo | menor | DDT do Linfoma Folicular (Portaria SAS/MS nº 1.051/2014); PCDT do Linfoma de Hodgkin no Adulto (Portaria Conjunta nº 24/2020), textos integrais |
| correlação `linfadenopatia-reacional-linfoma` (+ mecanismo; resumo, Correlações) | descricao; mecanismo; resumo | "a arquitetura **é apagada**"; "suas células **expressam** BCL2"; BCL2 "ausente nos **centros germinativos** normais"; no resumo, "o linfoma a apaga" | "**costuma ser** apagada, total ou parcialmente"; "**em geral** expressam BCL2 (no grau 3, a expressão pode faltar)"; "ausente nos **linfócitos B** dos centros germinativos normais"; no resumo, "em geral a apaga, total ou parcialmente" | Precisão. Há padrões parcialmente foliculares, o grau 3 pode perder BCL2, e no centro germinativo normal os linfócitos T são BCL2-positivos. A q29 e a q11 continuam corretas | menor | DDT do Linfoma Folicular 2014: "Os linfócitos centrofoliculares normais… são Bcl-2 negativos"; "O LF de alto grau (grau 3) pode perder a expressão de CD10 e Bcl-2" |
| his-12-q11 | contexto; explicacao; referencia | "Na **biópsia** de um linfonodo cervical"; na reacional, "**células** do centro germinativo BCL2-negativas" | "Na **biópsia excisional**…"; "**linfócitos B** do centro germinativo BCL2-negativos"; + DDT do Linfoma Folicular (MS, 2014) | Alinha a vinheta à conduta e à imuno-histoquímica. A resposta (c) não muda | menor | DDT do Linfoma Folicular 2014 |
| correlação `asplenia-encapsulados` | descricao | VPC20 "em dose única a partir dos 5 anos"; "o ACIP (2020) recomenda… MenB a partir dos 10 anos" | + "em crianças de 2 meses a 4 anos ainda não vacinadas, em esquemas de duas a quatro doses conforme a idade de início"; ACIP "(2020; indicações reafirmadas em 2025)" | A asplenia funcional da doença falciforme começa na infância, e o texto sugeria que só havia esquema a partir dos 5 anos. Confirmado que a recomendação americana segue vigente | menor | NT nº 52/2026 (Quadro 1); Amin et al., MMWR 2026 (ACIP 2025, PMC12782235), textos integrais |
| correlação `timoma-miastenia`; his-12-q16 | descricao; explicacao; referencia | Conduta só pelos consensos internacionais (2016; 2020) | + **PCDT da Miastenia Gravis (MS, 2022)**: timectomia indicada na presença de timoma; sem timoma, pode ser considerada, sobretudo com piora progressiva e diagnóstico recente. Consensos de 2016 e 2020 mantidos | Pedido de preferir diretriz brasileira vigente. A resposta da q16 (d) não muda | menor | Portaria Conjunta SAES/SCTIE nº 11/2022 (texto integral); Sanders 2016 e Narayanaswami 2021, que reconferi no texto integral |
| incertezas, referências, nota de divergência | incertezas; referencias; notasDivergencia | Asplenia: notas posteriores a 26/06/2026 não lidas. Lugano sem texto. BCL2, hiperplasia folicular tímica, timoma, células mioides e DiGeorge "de memória" | Notas de junho a setembro de 2026 lidas (64, 69, 79, Conjunta 310) e NT 44/2026 (Hib). Lugano de novo inacessível, com as diretrizes do MS no lugar. BCL2/t(14;18), hiperplasia folicular tímica, timócitos imaturos no timoma, células mioides e deficiência T heterogênea na 22q11.2 conferidos. Sete referências novas. Nota nova sobre as frequências divergentes das alterações tímicas na miastenia | Fontes lidas | menor | ver seção 3 |

Conferidos **sem mudança** em his-12:
- **DiGeorge**: correlação, q08 e q29. A deficiência T é heterogênea, e um pequeno subgrupo não produz linfócitos T (McDonald-McGinn 2015). TBX1 também confere.
- **Hiperplasia folicular tímica**: centros germinativos na medula, na miastenia AChR-positiva de início precoce (Waheed 2024; Matsui 2025).
- **Timoma**: timócitos imaturos nos tipos AB, B1 e B2, raros em A e B3, o que confere com "em geral". A miastenia é a doença autoimune mais associada ao timoma (Matsui 2025). Vinheta da q16 (mulher de 52 anos): o PCDT diz que o timoma é mais comum entre 50 e 70 anos.
- **Asplenia, fisiopatologia**: q13, q14 e q29 (Howell-Jolly; zona marginal) conferem.
- **APS-1/AIRE**: q06 confere.
- **Esferocitose**: q13 confere.

## 3. Fontes conferidas (3ª verificação): URL e trecho decisivo

Notas do MS em `https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/<nome>.pdf/@@download/file`. Diretrizes da Conitec em `https://www.gov.br/conitec/pt-br/midias/…/<arquivo>.pdf/@@download/file` (o link sem `@@download/file` devolve HTML). Artigos pela API do Europe PMC (`/rest/PMC<id>/fullTextXML`) ou pelo OAI do PMC (`https://pmc.ncbi.nlm.nih.gov/api/oai/v1/mh/?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:<n>&metadataPrefix=pmc`). Metadados pelo esummary do E-utilities.

### Imunizações (asplenia)

Para saber se havia nota posterior a junho de 2026, li a listagem completa de 2026 do gov.br (174 itens, páginas `?b_start:int=0…180`) e procurei pneumocócica, meningocócica, Hib, RIE/CRIE e asplenia.

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| **NT nº 52/2026-CGICI/DPNI/SVSA/MS** (assinada em 20–21/05; publicada em 22/06/2026) | `…/nota-tecnica-no-52-2026-cgici-dpni-svsa-ms.pdf/@@download/file` | "≥ 5 anos (incluindo adultos): dose única (exceto … TCTH e … CAR-T)"; Quadro 1: 2–6 meses, 3 doses + reforço; 7–11 meses, 2 + reforço; 12–59 meses, 2 doses; "Iniciar a administração da VPC20 somente após o esgotamento dos estoques da VPC13 e VPP23. Lembrar que indivíduos vacinados com a VPC20 não deverão receber mais a VPP23"; "6.1 … 6. Asplenia anatômica ou funcional e doenças relacionadas". A NT nº 45/2026 (15/05) tem o mesmo conteúdo; o diff mostra só diferenças de formatação. |
| NT nº 64/2026-DPNI/SVSA/MS (20/07/2026) | `…/nota-tecnica-no-64-2026-dpni-svsa-ms.pdf/@@download/file` | "alterando a Faixa Etária do Tipo de Dose Única (DU) de '≥ 5A < 60A' para '≥ 5A'". Só regra de registro. |
| NT nº 44/2026-CGICI/DPNI/SVSA/MS (09/06/2026) | `…/nota-tecnica-no-44-2026-cgici-dpni-svsa-ms.pdf/@@download/file` | "contidas na 6º edição do Manual do CRIE 2023, a Hib encontra-se disponibilizada nas seguintes condições: … Asplenia anatômica ou funcional e doenças relacionadas". Ampliação temporária, até novembro de 2026, para cardiopatias, pneumopatias crônicas e diabetes. |
| NT nº 69/2026-CGICI/DPNI/SVSA/MS (13/07/2026) | `…/nota-tecnica-no-69-2026-cgici-dpni-svsa-ms.pdf/@@download/file` | "A VPC20 foi introduzida no PNI em 2026, em esquema sequencial com a VPC10, iniciando o processo de transição da estratégia de vacinação infantil". Trata de cobertura na rotina e não muda a RIE. |
| NT nº 79/2026-CGICI/DPNI/SVSA/MS (03/08/2026) | `…/nota-tecnica-no-79-2026-cgici-dpni-svsa-ms.pdf/@@download/file` | Trata de acesso ("Não orientar usuários a retornarem em outra data quando houver indicação vacinal"). Não muda indicações. |
| NT Conjunta nº 310/2026-DPNI/SVSA-DESF/SAPS/MS (14/09/2026) | `…/nota-tecnica-conjunta-no-310-2026.pdf/@@download/file` | VPC20 a partir de 85 anos. "4.7 … de 60 a 84 anos … com condições clínicas especiais, a VPC20 será mantida na estratégia especial conforme Nota Técnica Nº52/2026". A NT 52/2026 segue vigente em setembro. |
| **Manual dos CRIE, 6ª ed., 2023** | `https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2024/manual-dos-centros-de-referencia-para-imunobiologicos-especiais-6a-edicao/@@download/file` | 5.1: "Nos pacientes que serão submetidos à esplenectomia eletiva, a vacinação deverá preceder o procedimento cirúrgico pelo período mínimo de 14 dias"; "necessitam de vacinas varicela, hepatite A, influenza inativada e contra germes capsulados: pneumococo, meningococo e Haemophilus influenzae tipo b". MenACWY: "Asplenia anatômica e funcional, doença falciforme e talassemias — 2 doses com intervalo de 8 semanas — 1 dose a cada 5 anos". Cap. 15: "A vacina meningocócica B não está disponível no SUS." |
| Amin et al., MMWR 2026;75(1):7-14 (ACIP 2025) | Europe PMC, PMC12782235 | "Indications for MenACWY and MenB vaccination have not changed since they were published in 2020"; "Persons aged ≥10 years who are at increased risk for meningococcal disease: Routine and booster vaccination." |

### Linfoma

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| DDT do Linfoma Folicular (Portaria SAS/MS nº 1.051, de 10/10/2014) | `https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/ddt_linfomafolicular_10102014.pdf/@@download/file` | "preferencialmente pelo estudo de material obtido por uma biópsia excisional de linfonodo … a aspiração com agulha fina não é um método diagnóstico apropriado"; "folículos neoplásicos de tamanho uniforme, pobres em macrófagos e com zonas do manto mal formadas"; "Os linfócitos centrofoliculares normais … são Bcl-2 negativos"; "O LF de alto grau (grau 3) pode perder a expressão de CD10 e Bcl-2"; "t(14;18)(q32;q21) é vista em cerca de 90% dos casos". |
| PCDT do Linfoma de Hodgkin no Adulto (Portaria Conjunta nº 24, de 29/12/2020) | `https://www.gov.br/conitec/pt-br/midias/protocolos/20201230_pcdt_linfoma-de-hodgkin.pdf/@@download/file` | "A biópsia excisional de um linfonodo para exame histopatológico com imuno-histoquímica é o procedimento padrão para o diagnóstico"; "As amostras obtidas por aspiração por agulha fina ou por biópsia com agulha grossa (core biopsy) são geralmente inadequadas". |

### Timo e miastenia

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| PCDT da Miastenia Gravis (Portaria Conjunta nº 11, de 23/05/2022) | `https://www.gov.br/conitec/pt-br/midias/protocolos/20220530_portal_pcdt_miastenia_gravis.pdf/@@download/file` | "A timectomia está indicada para pacientes com timoma"; "pode ser considerada em pacientes com piora progressiva, especialmente em pacientes com diagnóstico mais recente"; "Setenta por cento dos pacientes têm hiperplasia de timo e aproximadamente 10% têm timoma … mais comum em pacientes entre 50 e 70 anos". |
| Sanders et al., Neurology 2016 (consenso) | Europe PMC, PMC4977114 (reconferido) | "With rare exceptions, all patients with MG with thymoma should undergo surgery to remove the tumor. Removal of the thymoma … may not produce improvement in MG." |
| Narayanaswami et al., Neurology 2021 (atualização 2020) | Europe PMC, PMC7884987 (reconferido) | "In nonthymomatous, generalized MG patients with AChR-Ab, aged 18–50 years, thymectomy should be considered early in the disease…" |
| Waheed et al., Mediastinum 2024;8:31 | Europe PMC, PMC11177005 | "germinal centers (GCs) … localized in the medulla or the perivascular areas"; "myoid cells are the only known cells, aside from skeletal muscle, to express AChR in its native folded form"; tabela: na miastenia AChR-positiva, hiperplasia folicular 40%, timo normal ou atrófico 50% e timoma 10%. |
| Matsui, Ohigashi, Marx, Front Immunol 2025;16:1649171 | Europe PMC, PMC12558853 | "TAMG is the most common thymoma-associated autoimmune disease (30–40%)"; "types AB, B1, and B2 thymomas consistently harbor interepithelial immature (TdT-positive) T cells, whereas immature T cells are rare and sometimes even absent in types A and B3"; tabela: hiperplasia folicular tímica na miastenia de início precoce. |

### DiGeorge (22q11.2)

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| McDonald-McGinn et al., Nat Rev Dis Primers 2015 | OAI do PMC, PMC4900471 (o Europe PMC não tem texto aberto) | "Immunodeficiency affects up to 75% of paediatric patients … owing to thymic hypoplasia and impaired T cell production. However, the condition is heterogeneous, ranging from … normal T cell production to a small subset of patients with absent T cell production"; "Management of immune deficiency ranges from a thymus transplant (rare) to no intervention"; "Tbx1-null mice … absence of the thymus and parathyroid glands". |

### Vasos e coração

| Fonte | Acesso | Trecho decisivo |
|---|---|---|
| Baaten et al., Eur Heart J 2024;45(1):18-31 | Europe PMC, PMC10757869 | "Ruptured plaques are typically thin-cap fibroatheroma with a large lipid core"; "In ruptured plaques, macrophages and foam cells are abundantly present"; "eroded plaques consist for a major part of VSMCs and are rich in proteoglycans (e.g. versican) and hyaluronan … inflammation is limited with a sparse distribution of macrophages and T cells"; "plaques with an intact fibrous cap". |
| Bennett, Sinha, Owens, Circ Res 2016;118:692-702 | OAI do PMC, PMC4762053 (o Europe PMC deu erro 500) | "a large fraction of foam cells dual-positive for SMC and macrophage markers are of VSMC not myeloid origin". |
| Allahverdian et al., Circulation 2014 | E-utilities, PMID 24481950 (só resumo; ahajournals bloqueado) | "50±7% … of total foam cells were SMC derived". O número **não** foi usado no conteúdo. |
| Hedström et al., J Cardiovasc Magn Reson 2009;11:38 | Europe PMC, PMC2758877 | "The transmural extent of MI increased progressively as the duration of ischemia increased"; "previously been described as the 'wavefront phenomenon' in dogs by Reimer and Jennings". |
| Dos Santos et al., J Vasc Bras 2021;20:e20200211 | Europe PMC, PMC8276643 | "Hyaline arteriolosclerosis is frequently associated with SAH"; "Hyperplastic arteriolosclerosis is characterized by laminar and concentric thickening … smooth muscle cells with thickened and multiple basement membranes, and are associated with severe SAH cases"; "MMCS refers to non-obstructive calcification in the internal elastic lamina or the tunica media of muscular arteries … does not compromise the arterial lumen". |
| Pivatto Júnior et al., Braz J Infect Dis 2017;21:349-52 | Europe PMC, PMC9427662 | "The vasa vasorum undergoes a process of endarteritis obliterans, necrosis of medial layer (mesoarteritis), and infiltration of plasma cells." |
| Uehara et al., Am J Case Rep 2023;24:e941070 | Europe PMC, PMC10519639 | "The treponemes initially infect the adventitial vasa vasorum of the aorta, inducing perivascular lymphoplasmacytic inflammation and leading to endarteritis obliterans, median destruction…" |
| Litmanovich et al., Insights Imaging 2012 | Europe PMC, PMC3505571 | "syphilitic aortic aneurysm, syphilitic aortic valvulitis with aortic regurgitation …; The ascending thoracic aorta is most commonly involved". Confere com a q13; não acrescentado às referências. |
| Gallo et al., consenso SICCR, Tech Coloproctol 2020;24(2):145-64 | Europe PMC, PMC7005095 | "History of longstanding or uncontrolled portal hypertension should be considered for differentiate HD from anorectal varices"; "the hemorrhoidal cushions are known to provide 15% of the patient's resting anal tone". Não encontrei no texto a descrição histológica dos coxins, que tirei da revisão abaixo. |
| Parol et al., Int J Mol Sci 2025;26(19):9394 | OAI do PMC, PMC12524921 (o Europe PMC estava com erro 503 nessa hora) | "anal cushions … consist of blood vessels and non-vascular components: epithelium (mucosa or anoderm), connective tissue (elastic and collagenous), a layer of muscular tissue (named the muscle of Treitz), and an anchoring system"; "they can become swollen, inflamed, and displaced, which results in … hemorrhoidal disease"; "three main theories … the varicose vein theory … the vascular hyperplasia theory … the sliding anal lining theory … no non-ambiguous, well-proved theories". "Comunicações arteriovenosas" não foi acrescentado: não o encontrei em texto lido. |
| Papadimitriou-Olivgeris et al., Clin Infect Dis 2024;78(4):949-55 | Europe PMC, PMC11006096 | Duke-ISCVID 2023: "imaging criteria were adapted by adding cardiac CT and 18F-FDG PET/CT …"; "intraoperative evidence of IE as a new surgical major criterion". Fonte secundária: o conteúdo não cita critérios. |

### Inacessíveis nesta sessão

- **Lugano 2014** (Cheson et al., J Clin Oncol; PMC4979083): o Europe PMC `fullTextXML` deu erro 500; o OAI do PMC respondeu `cannotDisseminateFormat`; o efetch `db=pmc` trouxe só a página inicial; o BioC não achou nada. As diretrizes do MS ficaram no lugar.
- **Duke-ISCVID 2023** (Fowler et al., Clin Infect Dis; PMC10681650): Europe PMC com erro 500 e OAI com `cannotDisseminateFormat`.
- **ESC 2023 de endocardite** (Delgado et al., Eur Heart J; PMID 37622656): não está no PMC.
- **SBIm** (`sbim.org.br`, `www.sbim.org.br`): o proxy recusou a conexão ("CONNECT tunnel failed, 403").
- Uma busca no Europe PMC por diretriz brasileira de doença venosa (SBACV/J Vasc Bras) expirou em 60 s. Não repeti.

## 4. Pontos para o revisor humano

1. **Asplenia (his-12)**: confirmar a redação. A VPC20 é dada em dose única a partir de 5 anos e em esquemas de 2 a 4 doses entre 2 meses e 4 anos em não vacinados, substituindo a VPC13 seguida da VPP23 à medida que se esgotam os estoques (NT 52/2026, mantida pela Conjunta 310/2026). O Manual dos CRIE manda vacinar pelo menos 14 dias antes da esplenectomia eletiva. A MenACWY é indicada (2 doses e reforço a cada 5 anos), e a MenB não está no SUS. Pendentes:
   - Portaria GM/MS nº 6.623/2025 e o "Guia Técnico para introdução da VPC20 no PNI" (citado nas NT 64 e 69), que não li;
   - a data em que a VPC20 chegou a cada CRIE;
   - o calendário SBIm de pacientes especiais (site bloqueado), que seria a fonte brasileira para a MenB na asplenia. Por isso a MenB continua citada pelo ACIP.

   Nenhuma questão cobra esquema vacinal.
2. **Biópsia excisional**: a fonte brasileira mais específica é a DDT do Linfoma Folicular de 2014. Não achei versão posterior na Conitec, mas não confirmei formalmente que ela continua em vigor. Lugano 2014 não teve texto integral. O PCDT do Hodgkin (2020) aceita agulha grossa guiada por imagem para linfonodos profundos. O texto do jogo diz só "preferem a biópsia excisional" e "punção aspirativa por agulha fina inadequada", o que vale para os dois documentos.
3. **Erosão × ruptura (his-11)**: decidir se vale uma questão nova sobre o tema. Não criei, porque o escopo era revisar. A correlação agora traz o contraste.
4. **Células espumosas**: o texto agora diz que boa parte das células espumosas das placas coronárias humanas avançadas é de origem muscular lisa. Os livros brasileiros ainda as atribuem sobretudo a macrófagos. Os eventos e a q26 mantêm a estria gordurosa como lesão de macrófagos espumosos. Confirmar se a redação da estrutura agrada.
5. **Frequências na miastenia AChR-positiva**: o PCDT dá hiperplasia do timo em 70% e timoma em cerca de 10%; Waheed 2024 dá hiperplasia folicular em 40%, timo normal ou atrófico em 50% e timoma em 10%. O conteúdo não cobra números; a divergência foi registrada em `notasDivergencia`.
6. **Endocardite**: o conteúdo continua qualitativo. Se o revisor tiver acesso a Duke-ISCVID 2023 ou à ESC 2023, pode avaliar se acrescenta "exames de imagem, sobretudo o ecocardiograma" (TC cardíaca e PET/CT entraram como critério de imagem).
7. **Ainda sem fonte lida, de Robbins sem o livro em mãos**:
   - extensão do infarto subendocárdico (terço a metade interna) e faixa poupada em autópsia humana;
   - ordem dos territórios mais acometidos pela aterosclerose;
   - cúspides valvares em grande parte avasculares;
   - fatores de risco e anatomia patológica das varizes;
   - padrões de linfadenite reacional e exemplos;
   - zonas T pobres em linfócitos na DiGeorge;
   - Howell-Jolly após esplenectomia.
8. **Hemorroidas (his-11, correlação `varizes`)**: confirmar a redação nova e a coerência com o his-14. Deixei de fora as "comunicações arteriovenosas" dos coxins, porque não as encontrei nos textos lidos; a revisão de 2025 cita só a hipótese do "corpus cavernosum recti". Robbins 10ª ed. ainda descreve as hemorroidas como dilatações vasculares colaterais. Se o his-14 usar o mesmo termo de outra forma, alinhar.
9. **his-11-q14 (c)**: confirmar em Ross 8ª ed. em que túnica ficam as extensões miocárdicas das veias cavas e pulmonares. A explicação agora não afirma a túnica.
10. **Carry-over da 1ª etapa** que continua aberto: seleção negativa "no córtex e na medula", circulação esplênica "inteiramente aberta" e números de capítulo de Junqueira, Ross, Kierszenbaum, Robbins e Abbas.
