# Conferência de fontes primárias: bloco SBP (neonatologia e pediatria)

- Agente: `conferencia-fontes-v1`
- Data: 2026-11-09
- Tarefa: fechar os itens que as revisões anteriores deixaram "a conferir no texto integral" (documentos da SBP, do Ministério da Saúde e da CONITEC), agora com a rede liberada.
- Arquivos editados (só estes): `content/embriologia/topicos/emb-24-circulacao-fetal.json`, `emb-25-endocrino.json`, `emb-17-genital-diferenciacao-sexual.json`, `emb-19-musculoesqueletico-membros.json` e `content/histologia/topicos/his-05-adiposo.json`.
- Nenhum id, letra correta, alternativa, enunciado, contexto, `ordemCorreta` ou par foi alterado. A verificação foi feita por script, comparando cada arquivo com a cópia anterior às edições. `revisao.humano` continua `null` nos cinco arquivos. Em `revisao.agentes` de cada arquivo foi **acrescentada** uma entrada `conferencia-fontes-v1`.
- Método: os PDFs foram baixados com `curl` e convertidos com `pdftotext -layout`. As tabelas que são imagem (Quadro 2 do documento de hipoglicemia) foram lidas pela página renderizada. As cópias de trabalho ficaram fora do repositório, na pasta temporária da sessão.

## 1. Resumo

| # | Item | Resultado | Mudança |
|---|---|---|---|
| 1 | Clampeamento na diretriz de reanimação SBP 2026 (< 34 e ≥ 34 semanas) | **Confirmado**: no mínimo 60 s nas duas faixas, com boa vitalidade | emb-24: o prazo abaixo de 34 semanas voltou ao resumo, à correlação e à explicação da q15; referências separadas com DOI |
| 2 | Teste do coraçãozinho (Manual de Orientação SBP 2022 × protocolo de 2014) | **Confirmado**, com 1 ajuste de redação | emb-24: "≤ 89% indica avaliação urgente" → "torna o teste positivo, com avaliação cardiológica e ecocardiograma antes da alta"; nota de divergência e q10 citam o Relatório CONITEC nº 115 |
| 3 | ~80% de saturação na veia umbilical (Sadler) | **Não esclarecido** | Mantido em `incertezas`, com o que foi lido; fica para o livro |
| 4 | emb-25: PCDT do hipotireoidismo congênito, SBP nº 5/2018, manual técnico 2016, SBP nº 16/2022 | **Confirmado** (todos os pontos) | q06 volta a citar o PCDT para "sem esperar exames de imagem"; referências com URL; incertezas resolvidas |
| 5 | emb-17: Documento Científico SBP nº 232 (genitália atípica, 2026) | **Parcialmente confirmado** (número, data, departamento, "urgência médica"); o resto **não esclarecido** | Só referência e `incertezas` (texto integral restrito a associados) |
| 6 | emb-19: acondroplasia na SBP (2023) e conduta no lactente | **Confirmado** (Diretriz SBP nº 113, 25/10/2023) | Diretriz citada na q26 e nas referências; incerteza reescrita |
| 7 | his-05: prevenção de hipotermia no prematuro < 34 semanas | **Confirmado** para 2022; **corrigido** para 2026 (exceção do prematuro moderado) | Correlação ajustada; referências 2022 e 2026 com título exato, DOI e URL |

| Arquivo | Veredito | Correções |
|---|---|---|
| emb-24 | aprovado-com-correcoes | 3 (1 importante, 2 menores) |
| emb-25 | aprovado | 0 (1 ajuste de atribuição na q06) |
| emb-17 | aprovado | 0 (referência e incerteza) |
| emb-19 | aprovado | 0 (citação da diretriz da SBP acrescentada) |
| his-05 | aprovado-com-correcoes | 1 menor |

**Hosts fora da rede:** `sbp.com.br` sem "www" ("CONNECT tunnel failed, 403"; os links `?acervo_download=` desse host não abriram, mas os mesmos documentos abriram por `www.sbp.com.br`); `wordpress.sbp.com.br` (403); `saude.sc.gov.br` (sem conexão; o Relatório CONITEC nº 115 foi obtido em `www.gov.br`).

## 2. Itens

### Item 1. Clampeamento do cordão: diretrizes de reanimação SBP 2026

**Fontes lidas (texto integral):**
- Guinsburg R, Almeida MFB et al. *Reanimação do recém-nascido <34 semanas em sala de parto: Diretrizes 2026 da SBP*. 12/06/2026. https://doi.org/10.25060/PRN-SBP-2026-2. PDF: https://www.sbp.com.br/acervo/reanimacao-do-prematuro-34-semanas-em-sala-de-parto-junho-2026/
- Almeida MFB, Guinsburg R et al. *Reanimação do recém-nascido ≥34 semanas em sala de parto: Diretrizes 2026 da SBP*. 12/06/2026. https://doi.org/10.25060/PRN-SBP-2026-1. PDF: https://www.sbp.com.br/acervo/reanimacao-do-recem-nascido-%E2%89%A534-semanas-em-sala-de-parto-junho-2026/
- SBP/FEBRASGO. *Recomendações sobre o clampeamento do cordão umbilical*. 17/03/2022. https://www.sbp.com.br/fileadmin/user_upload/23396c-Diretrizes-Recom_Clamp_CordUmb.pdf

**Trechos que decidem:**
- < 34 semanas, 2026 (cap. 4): "Se, ao nascimento, o RN <34 semanas está respirando ou chorando e o tônus muscular está em flexão, independentemente do aspecto do líquido amniótico, ele apresenta boa vitalidade e recomenda-se clampear o cordão umbilical no mínimo 60 segundos após o nascimento." A Figura 1 (item 5.2) mostra o mesmo: "RN <34 semanas com boa vitalidade ao nascer → Clampeamento do cordão umbilical ≥60 segundos após nascimento".
- ≥ 34 semanas, 2026 (cap. 4): "No RN com boa vitalidade, recomenda-se clampear o cordão no mínimo 60 segundos após o nascimento." O documento também cita a OMS ("1-3 minutos após o nascimento em RN com boa vitalidade").
- SBP/FEBRASGO 2022 ("Recomendação atual"): ≥ 34 semanas, "clampear o cordão no mínimo 60 segundos após a extração do concepto"; < 34 semanas, "aguardar 30 segundos ou mais, antes de clampear o cordão umbilical". A diretriz da SBP de 2022 para < 34 semanas também diz "no mínimo 30 segundos" (https://doi.org/10.25060/PRN-SBP-2022-1).

**Resultado:** confirmado. O prazo para menos de 34 semanas foi **ampliado de 30 para 60 segundos** em 2026. Para 34 semanas ou mais, segue em 60 segundos.

**Mudanças (emb-24):**
- Resumo: "abaixo de 34 semanas, o clampeamento também é adiado no prematuro com boa vitalidade" → "abaixo de 34 semanas, a diretriz da SBP de 2026 recomenda, no prematuro com boa vitalidade, o mesmo mínimo de 60 segundos (em 2022, 30 segundos ou mais)".
- Correlação `clampeamento-tardio-cordao`: "Abaixo de 34 semanas, o prematuro com boa vitalidade também deve ter o clampeamento adiado" → "Abaixo de 34 semanas, a diretriz de reanimação do prematuro da SBP de 2026 recomenda, no prematuro com boa vitalidade, clampear no mínimo 60 segundos após o nascimento (as recomendações SBP/FEBRASGO de 2022 indicavam 30 segundos ou mais)".
- Explicação da q15: depois de "prazo mantido nas diretrizes de reanimação neonatal da SBP de 2026", foi acrescentado "que estenderam o mesmo mínimo de 60 segundos ao prematuro com menos de 34 semanas e boa vitalidade". O gabarito (a) continua o mesmo.
- Referências: a entrada única das diretrizes de 2026 virou duas, com autores, data, DOI, URL e capítulo. A entrada SBP/FEBRASGO 2022 ganhou data, URL e os prazos da "Recomendação atual".
- `incertezas`: a pendência do clampeamento abaixo de 34 semanas foi retirada, porque está resolvida.

### Item 2. Teste do coraçãozinho

**Fontes lidas (texto integral):**
- SBP, Departamentos Científicos de Cardiologia e Neonatologia. *Manual de Orientação nº 4: Sistematização do atendimento ao recém-nascido com suspeita ou diagnóstico de cardiopatia congênita*. 11/08/2022. https://www.sbp.com.br/fileadmin/user_upload/23544c-MO_Sistemat_atend_RN_cSuspeita_CardCongenita.pdf
- Portaria SCTIE/MS nº 20, de 10/06/2014. https://bvsms.saude.gov.br/bvs/saudelegis/sctie/2014/prt0020_10_06_2014.html
- CONITEC. *Relatório de Recomendação nº 115: Teste do coraçãozinho (oximetria de pulso) na triagem neonatal* (2014; documento ao qual a Portaria nº 20 remete). https://www.gov.br/conitec/pt-br/midias/incorporados/testecoracaozinho-final.pdf/@@download/file

**Trechos que decidem:**
- Número do documento: cabeçalho "Nº 4, 11 de Agosto de 2022 — Manual de Orientação — Departamento Científico de Cardiologia e Neonatologia (2019-2021)". **Confirmado.**
- Idade gestacional: o texto diz "todos os RN com idade gestacional igual ou maior que 35 semanas e que se encontram clinicamente bem, assintomáticos, em ambiente de alojamento conjunto"; o fluxograma (Figura 2) diz "IG>35 semanas". **35 semanas ou mais, confirmado.** A pequena diferença interna do manual foi registrada na nota de divergência.
- Momento e locais: "preferencialmente entre 24 e 48 horas de vida"; "na mão direita (medida pré-ductal) e em um dos membros inferiores (medida pós-ductal)".
- Limiares e repetições: "Teste negativo: SpO2 maior ou igual a 95% e a diferença [...] menor ou igual a 3%"; "Teste duvidoso: SpO2 entre 90% e 94% ou uma diferença [...] maior ou igual a 4%. Nesta situação, o teste deve ser realizado novamente após uma hora por até duas vezes. Caso as medidas de oximetria se mantenham nestes valores mesmo após a terceira avaliação, o teste será considerado positivo". **Confirmado.**
- Positivo ≤ 89%: "Teste positivo: SpO2 menor ou igual a 89% no membro superior direito ou no membro inferior. Nessa situação, o RN deverá ser reavaliado de forma minuciosa [...] e a avaliação cardiológica e ecocardiográfica deverá também ser realizada [...] este RN não deveria receber alta hospitalar antes que seja realizada esta avaliação". **Confirmado.** O manual não usa a palavra "urgente".
- Portaria nº 20/2014: só "incorpora a oximetria de pulso - teste do coraçãozinho, a ser realizado de forma universal". Os critérios estão no Relatório CONITEC nº 115: "idade gestacional > 34 semanas"; "Entre 24 e 48 horas de vida, antes da alta"; "Resultado normal: Saturação periférica maior ou igual a 95% em ambas as medidas [...] e diferença menor que 3%"; "Resultado anormal: Caso qualquer medida da SpO2 seja menor que 95% ou houver uma diferença igual ou maior que 3% [...], uma nova aferição deverá ser realizada após 1 hora. Caso o resultado se confirme, um ecocardiograma deverá ser realizado dentro das 24 horas seguintes"; e, nas limitações, a coarctação de aorta pode não ser detectada.
- q10 (97% e 90%, diferença de 7%): pelo protocolo de 2014, o resultado é anormal (< 95% e diferença ≥ 3%), com repetição em 1 hora e ecocardiograma se confirmado. Pelo manual de 2022, é duvidoso (90%–94% e diferença ≥ 4%), com repetição em 1 hora (até duas vezes) e teste positivo, com ecocardiograma, se persistir. **Mesma conduta; gabarito (d) confirmado.** A q21 (a coarctação pode passar) também está confirmada pelo Relatório CONITEC nº 115.

**Resultado:** confirmado, com 1 ajuste de redação.

**Mudanças (emb-24):**
- Correlação `teste-do-coracaozinho`: "saturação ≤ 89% indica avaliação urgente com ecocardiograma" → "saturação ≤ 89% torna o teste positivo, com avaliação cardiológica e ecocardiograma antes da alta". É a redação do manual.
- Nota de divergência: o "protocolo de 2014 (Ministério da Saúde/SBP)" passou a "(Relatório CONITEC nº 115, base da Portaria SCTIE/MS nº 20/2014)". A atualização de 2022 deixou de ser citada "segundo fontes secundárias" e passou a ser citada pelo próprio manual, com as três medidas, o "positivo com ≤ 89% (avaliação cardiológica e ecocardiograma, sem alta antes do esclarecimento)" e a ressalva de que o texto diz "≥ 35" e o fluxograma, "> 35".
- Referência da q10: acrescentado "e Relatório CONITEC nº 115".
- Referências: o Manual nº 4 ganhou data, URL e seção (1.4, Figura 2); a Portaria ganhou URL; o Relatório CONITEC nº 115 foi acrescentado.
- `incertezas`: a pendência das fontes primárias do coraçãozinho foi retirada, porque está resolvida.

### Item 3. Cerca de 80% de saturação na veia umbilical

**O que foi procurado:** o valor, que o texto atribui a Sadler (cap. 13), não aparece nas diretrizes da SBP abertas (reanimação 2022 e 2026; clampeamento 2022). No Europe PMC, o estudo de oximetria por ressonância em fetos humanos (Saini BS et al., *Normal human and sheep fetal vessel oxygen saturations by T2 magnetic resonance imaging*, J Physiol 2020;598:3259-81) não está em acesso aberto. O resumo traz a aorta ascendente (68 ± 10%) e o tronco pulmonar (49 ± 9%), mas não o valor da veia umbilical.

**Resultado:** não esclarecido. O item continua em `incertezas` do emb-24, com o registro do que foi lido, e **fica para conferência no livro** (Sadler, 14ª ed. brasileira, cap. 13). O texto só usa a ordem qualitativa (q25), que não depende do número.

### Item 4. emb-25: hipotireoidismo congênito e hipoglicemia neonatal

**Fontes lidas (texto integral):**
- Portaria Conjunta SAES/SCTIE/MS nº 5, de 16/04/2021 (PCDT do Hipotireoidismo Congênito). https://www.gov.br/conitec/pt-br/midias/protocolos/20210426_portaria_conjunta_pcdt_hipotireoidismo_congenito.pdf/@@download/file
- SBP, DC Endocrinologia. *Hipotireoidismo Congênito: Triagem Neonatal*. Documento Científico nº 5, nov. 2018. https://www.sbp.com.br/fileadmin/user_upload/_21369c-DC_Hipotireoidismo_Congenito.pdf
- Ministério da Saúde. *Triagem neonatal biológica: manual técnico*. 2016. https://bvsms.saude.gov.br/bvs/publicacoes/triagem_neonatal_biologica_manual_tecnico.pdf
- SBP, DC Endocrinologia. *Hipoglicemia neonatal*. Documento Científico nº 16, 09/05/2022. https://www.sbp.com.br/fileadmin/user_upload/23452c-DC_Hipoglicemia_neonatal.pdf

**Trechos que decidem:**
- Início após a coleta e prazo de 14 dias. PCDT, item 8: "Impõe-se que o tratamento seja iniciado o mais precocemente possível, idealmente nos primeiros 14 dias de vida, após a coleta de sangue para os exames diagnósticos confirmatórios". SBP nº 5, Quadro 5, tem a mesma frase. **Confirmado.**
- "Sem esperar exames de imagem". PCDT, item 4: "A impossibilidade de se proceder aos exames para determinação etiológica não deve atrasar o início do tratamento. Nesses casos, inicia-se o tratamento, postergando-se a determinação da causa [...] para após os 3 anos". SBP nº 5: "Não é aceitável que o início do tratamento seja adiado pela indisponibilidade dos exames de imagem". A frase literal "sem esperar exames de imagem" não está no PCDT, mas o sentido está (o PCDT fala em impossibilidade de fazer os exames etiológicos: US cervical, cintilografia e tireoglobulina). **Confirmado quanto ao conteúdo.**
- Dose. PCDT, item 8.2: "O tratamento inicia-se com a dose-padrão de 10-15 mcg/kg via oral, uma vez por dia"; doses de 12–17 mcg/kg nos casos mais graves. **Confirmado.**
- Conduta pelo TSH em papel-filtro. PCDT, Quadro 1: < 10 mUI/L, normal, nenhuma conduta; 10–20, limítrofe, "convocar para novo teste do pezinho"; > 20, sugestivo, "convocar com urgência para consulta médica e dosagem sérica [...] de T4 total ou livre e TSH". O diagnóstico é confirmado por "TSH acima de 10 mUI/L e T4 livre ou T4 total baixos", que "indicam o início do tratamento". O texto do tópico não cita os pontos de corte; a vinheta da q06 (TSH sérico muito elevado e T4 livre baixo) e o gabarito (c) são compatíveis com o Quadro 1. **Confirmado.**
- Janela de coleta. PCDT: "48 horas após o nascimento ou até o 5º dia de vida, após a diminuição do pico fisiológico do TSH". SBP nº 5, Quadro 1: "48 horas após o nascimento e até o 5º dia de vida (3º-5º dia de vida)". Manual técnico de 2016: "o período ideal de coleta da primeira amostra esteja compreendido entre o 3º e o 5º dia de vida do bebê devido às especificidades das doenças diagnosticadas". **Confirmado**, inclusive a explicação da q07 ("também por razões ligadas a outras doenças triadas").
- Nova coleta em recém-nascidos de risco. SBP nº 5: prematuros (< 37 semanas), baixo peso, gemelares, uso de dopamina ou amiodarona, exposição a iodo, cardiopatia e doença grave devem repetir a triagem "com 1 mês de vida, ou na alta hospitalar (o que ocorrer primeiro)", ou fazer a "triagem tripla no 5º, 10º e 30º dias". O PCDT, item 7, diz o mesmo. **Confirmado.**
- SBP nº 16/2022. O texto integral é **de acesso livre**; a incerteza antiga dizia que era restrito. Quadro 1, fatores de risco: "Filhos de mães diabéticas". Texto: "Bebês nascidos de mães com diabetes [...] podem desenvolver hipoglicemia assintomática logo na primeira hora após o nascimento ou até 12 horas de vida". Quadro 2 ("Triagem inicial de RN pretermo tardio [...], RN PIG, filho de mãe diabética e RN GIG"): "Alimentação dentro da 1ª hora — Glicemia 30 minutos depois da 1ª dieta". **Confirmados** "grupo de risco, alimentação precoce, glicemia desde as primeiras horas" (q15 e correlação).

**Resultado:** confirmado.

**Mudanças (emb-25):**
- Explicação da q06: "(consenso ENDO-ERN/ESPE, 2021)" → "(PCDT de 2021; consenso ENDO-ERN/ESPE, 2021)". O enunciado pergunta "segundo o PCDT", e agora a atribuição está conferida. Não houve correção de fato.
- Referências: URL no PCDT (com capítulos 3, 4 e 8), no manual técnico de 2016 e no SBP nº 5; data, URL e quadros no SBP nº 16.
- `incertezas`: a pendência geral dos textos integrais (PCDT, manual de 2016, SBP 2018 e 2022) foi retirada. A da conduta no filho de mãe diabética foi reescrita como conferida, mantendo o registro de que os valores de corte do Quadro 2 continuam fora do texto por opção.

### Item 5. emb-17: Documento Científico SBP nº 232 (genitália atípica, 2026)

**Fontes tentadas e lidas:**
- Página do documento: https://www.sbp.com.br/abordagem-da-crianca-que-nasce-com-genitalia-atipica-orientacoes-para-o-pediatra/ . O link "Leia o documento na íntegra" leva a https://www.sbp.com.br/acervo/abordagem-da-crianca-quenasce-com-genitalia-atipicaorientacoes-para-o-pediatra/ , que **redireciona para o login de associados** (`/associados/login/?redirect_to=...acervo_download=1&post_id=57181`). **O texto integral não pôde ser lido.**
- Boletim SBP em Dia nº 38 (março de 2026), que reproduz a primeira página do documento: https://www.sbp.com.br/wp-content/uploads/2026/03/BoletimSBPemDia_Edicao38.pdf

**Trechos que decidem (primeira página, pelo Boletim):**
- Cabeçalho: "Abordagem da criança que nasce com genitália atípica: Orientações para o pediatra — Nº 232, 12 de Fevereiro de 2026 — Documento Científico — Departamento Científico de Endocrinologia (Gestão 2022-2024)"; colaboradores Guilherme Guaragna Filho, Andrea Trevas Maciel-Guerra e Gil Guerra-Júnior.
- Introdução: "A genitália atípica (ambígua) é a manifestação clínica mais evidente dos Distúrbios/Diferenças da Diferenciação do Sexo (DDS), ocorrendo em 1:4500 nascidos vivos. [...] Essas condições são consideradas como uma urgência médica, em razão da situação estressante que acarretam do ponto de vista psicossocial e porque algumas de suas etiologias, se não prontamente reconhecidas e tratadas, podem colocar em risco [...]". O trecho termina aí.

**Resultado:**
- **Confirmados:** o número (232), a data, o departamento e o que a q25 atribui à SBP sobre "tratar como urgência". A primeira página também confirma a forma "Distúrbios/Diferenças da Diferenciação do Sexo (DDS)" registrada na nota de terminologia do tópico; isso diz respeito à pendência A1 de `docs/pendencias-conferencia-medica.md`.
- **Não esclarecidos:** "não atribuir o sexo na sala de parto" e "investigar HAC" (q25, correlação de DDS e explicação da questão de HAC). Nada do que foi lido contradiz esses pontos.

**Mudanças (emb-17):** nenhuma no texto didático. A referência ganhou número, data, a observação "texto integral restrito a associados" e as duas URLs. A incerteza da camada avançada foi atualizada com o que foi lido e o que falta.

**Para o revisor humano:** abrir o documento nº 232 com login de associado da SBP e conferir "não atribuir o sexo na sala de parto" e "investigar HAC".

### Item 6. emb-19: acondroplasia

**Fonte lida (texto integral):** Alves C, Raskin S et al. *Acondroplasia: etiologia, apresentação clínica e tratamento*. Diretriz da SBP nº 113, 25/10/2023. https://www.sbp.com.br/fileadmin/user_upload/24190e-Diretrizes_Acondroplasia_-_Etiologia__ApresClinica_e_tratamento.pdf . A página de acervo (https://www.sbp.com.br/acervo/acondroplasia-etiologia-apresentacao-clinica-e-tratamento/) exige login, mas o PDF em `fileadmin` é público. O documento é uma **Diretriz** (nº 113), não um "documento científico".

**Trechos que decidem:**
- Seção 6.1: "A estenose de forame magno pode causar compressão da medula espinal levando à falência respiratória e morte súbita, que no primeiro ano de vida é 7,5% superior quando comparado à população geral". A Figura 6 resume: "A estenose do forame magno leva à compressão cervicomedular, apneia central e morte súbita".
- Seção 6.1: "Na abordagem destes pacientes está indicada a realização de polissonografia nos primeiros meses de vida [...] Exames de neuroimagem são importantes para a confirmação diagnóstica. [...] os exames de ressonância nuclear magnética são os mais indicados para diagnosticar a compressão cervical e que necessite de tratamento cirúrgico"; "Procedimentos neurocirúrgicos para reduzir a estenose do forame magno [...] são mais frequentes durante a infância"; "Caso seja observado crescimento acelerado [do perímetro cefálico] é mandatória a avaliação neurológica com neuropediatra e neurocirurgião".
- Quadro 3 ("Supervisão de saúde de pessoas com acondroplasia", adaptado de Hoover-Fong et al., Pediatrics 2020): neuroimagem e polissonografia do nascimento a 1 mês e, de 1 mês a 1 ano, "se novo diagnóstico".

**Resultado:** confirmado. A recomendação da q26 (apneia central e morte súbita; neuroimagem e polissonografia logo após o diagnóstico; avaliação neurocirúrgica do lactente com compressão) coincide com a diretriz da SBP. O relatório da AAP (Hoover-Fong 2020) não tem texto integral aberto (Europe PMC: PMID 32457214, sem acesso aberto); o resumo e o Quadro 3 da SBP, que o adapta, são compatíveis.

**Mudanças (emb-19):**
- Explicação da q26: "a Academia Americana de Pediatria recomenda" → "a Academia Americana de Pediatria e a SBP (Diretriz nº 113, 2023) recomendam".
- Referência da q26: acrescentado "SBP, Diretriz nº 113 (2023)".
- Referências do tópico: diretriz acrescentada, com URL e as seções 6.1 e 11 (Quadro 3).
- `incertezas`: a pendência da q26 foi reescrita como conferida na diretriz da SBP; fica só a ressalva sobre o texto integral da AAP.

### Item 7. his-05: prevenção de hipotermia no prematuro com menos de 34 semanas

**Fontes lidas (texto integral):**
- *Reanimação do recém-nascido <34 semanas em sala de parto: diretrizes 2022 da SBP*. https://doi.org/10.25060/PRN-SBP-2022-1 . https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/junho/06/DiretrizesSBP-Reanimacao-RNmenor34semanas-MAIO2022a.pdf
- *Reanimação do recém-nascido ≥34 semanas em sala de parto: diretrizes 2022 da SBP*. https://doi.org/10.25060/PRN-SBP-2022-2 . https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/junho/06/DiretrizesSBP-Reanimacao-RNigualMaior34semanas-MAIO2022a.pdf
- Diretrizes 2026 (< 34 e ≥ 34 semanas), as mesmas do item 1.

**Trechos que decidem:**
- 2022, < 34 semanas (item 4.1): "Todo RNPT <34 semanas deve ser conduzido à mesa de reanimação após o clampeamento do cordão"; "logo depois de posicionar o paciente sob fonte de calor radiante sem secá-lo, introduzir o corpo dentro do saco plástico, mantendo a face do lado de fora [...] Tal prática deve ser suplementada pelo emprego de touca dupla"; "Recomenda-se que a temperatura axilar do RNPT seja mantida entre 36,5-37,5ºC"; sala a 23–25 °C. **Confirma a frase do his-05 inteira.**
- 2022, ≥ 34 semanas: sala a 23–25 °C; "é importante secar o corpo e o segmento cefálico com compressas aquecidas e, se possível, cobrir a cabeça com touca"; "Manter o RN em contato pele-a-pele com a mãe, coberto com tecido de algodão seco e aquecido". **Confirmado.**
- 2026, < 34 semanas (item 5.3.1): para o prematuro levado à mesa, "introduzir seu corpo dentro de saco plástico de polietileno sem secá-lo, mantendo a face do lado de fora", "touca dupla (touca plástica coberta por touca de lã ou algodão)", temperatura axilar de 36,5–37,5 °C. A novidade está no item 4.1: o "RNPT moderado, definido como aquele com IG de 32 0/7 a 33 6/7 semanas, com boa vitalidade ao nascer pode permanecer em pele-a-pele junto aos pais"; depois do clampeamento, "retirar a cobertura plástica e o campo já utilizados, secar o corpo e a cabeça com compressa aquecida e colocar touca dupla, plástica e de tecido. A seguir, cobrir o corpo com nova cobertura plástica, sem inserir o RN no saco plástico". Pelo item 4.2, só "todo RN <32 semanas" vai obrigatoriamente à mesa.
- 2026, ≥ 34 semanas: "secar a cabeça e o corpo com compressas aquecidas e cobrir a cabeça com touca"; pele a pele; sala a 23–25 °C. **Confirmado.**

**Resultado:** confirmado para 2022. Para 2026, a afirmação geral "no prematuro com menos de 34 semanas, o corpo não é secado" deixou de valer para o prematuro moderado com boa vitalidade: **corrigido (menor)**.

**Mudanças (his-05):**
- Correlação `hipotermia-neonatal`: "diretrizes [...] da SBP (2022)" → "(2022 e 2026)". "No prematuro com menos de 34 semanas, o corpo não é secado: é envolto em saco plástico [...]" → "No prematuro com menos de 34 semanas levado à mesa de reanimação, o corpo não é secado: é envolto em saco plástico de polietileno, com touca dupla e fonte de calor radiante (pela diretriz de 2026, o prematuro de 32 a 33 semanas com boa vitalidade pode ficar em contato pele a pele, seco, com touca dupla e cobertura plástica)".
- A q10 (32 semanas, 35,5 °C; faixa normal de 36,5–37,5 °C) foi conferida e não mudou.
- Referências: as duas diretrizes de 2022 com título exato ("Reanimação do recém-nascido <34 semanas...", e não "do prematuro"), autores, DOI, URL e item; as duas de 2026 foram acrescentadas.
- `incertezas`: a pendência "conferidas por busca, não pelo texto integral" foi retirada. A temperatura da sala (23–25 °C, igual em 2022 e 2026) está confirmada, mas o texto continua qualitativo ("sala aquecida"), porque não estava errado.

## 3. O que fica para o revisor humano

1. **emb-24:** os ~80% de saturação na veia umbilical, a conferir em Sadler, 14ª ed. brasileira, cap. 13 (página).
2. **emb-17:** o Documento Científico SBP nº 232 na íntegra (login de associado), para conferir "não atribuir o sexo na sala de parto" e "investigar HAC". Estão atribuídos à SBP na q25, na correlação de DDS e na explicação da questão de HAC.
3. **emb-19:** o texto integral de Hoover-Fong et al. (AAP, Pediatrics 2020), sem acesso aberto. A conduta foi conferida pela Diretriz SBP nº 113, que o adapta.
4. Como em todo o conteúdo, `revisao.humano` continua vazio: nenhum destes tópicos foi marcado como conferido por médico.

## 4. Verificação

Checagem por script (cópia anterior × arquivo editado, nos cinco arquivos): ids, `correta`, `ordemCorreta`, `pares`, `tipo`, `alternativas`, `itens`, `contexto` e `enunciado` idênticos; ids de estruturas, eventos e correlações idênticos; entradas anteriores de `revisao.agentes` intactas, com uma nova entrada no fim; `revisao.humano` = `null`.

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  48 passed (48)
```
