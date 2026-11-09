# Conferência de fontes primárias: bloco Ministério da Saúde

- **Agente:** `conferencia-fontes-v1`. Olhar de saúde pública, clínica médica e neurologia.
- **Data:** 2026-11-09
- **Tarefa:** fechar os itens que as duas etapas de revisão deixaram "a conferir no texto integral" porque os documentos do Ministério da Saúde não abriam na rede da sessão. A rede foi liberada; todos os documentos abaixo foram baixados por `curl` e lidos no texto integral (`pdftotext`).
- **Arquivos editados (só estes):**
  - `content/histologia/topicos/his-07-osso.json`
  - `content/histologia/topicos/his-10-nervoso.json`
  - `content/embriologia/topicos/emb-20-olho-orelha-tegumento.json`
- **Garantias** (conferidas por script contra uma cópia dos três arquivos feita antes da edição):
  - Nenhum id alterado. Nenhum gabarito, letra correta, ordem, par de associação ou texto de alternativa alterado.
  - `revisao.humano` continua `null` nos três arquivos.
  - Uma entrada `conferencia-fontes` acrescentada ao fim de `revisao.agentes` em cada arquivo.
  - Formatação original dos JSON preservada (edição por substituição exata de trechos).
  - Nada foi commitado.
- **Situação:** conferência por agente (IA). Não substitui a conferência médica. Os tópicos continuam com o selo "Revisado por IA · conferência médica pendente".

## 1. Resumo

| Item | Tópico | Resultado | Mudança de texto | Veredito |
|---|---|---|---|---|
| 1. PCDT de Osteoporose (2025) | his-07 | **Confirmado.** A portaria é a **nº 22** de 22/10/2025 (a nº 23, da mesma data, é a da Acromegalia). Ela mantém a fratura por fragilidade, o T-escore ≤ −2,5 em mulheres na pós-menopausa e homens acima dos 50 anos e a definição de grave usada no tópico. | Nenhuma no conteúdo; referência e incerteza atualizadas | aprovado |
| 2. PCDT de Guillain-Barré | his-10 | **Confirmado.** A Portaria Conjunta nº 15/2020 (reeditada em 2022) é a versão da página oficial. Imunoglobulina ou plasmaférese na forma moderada-grave (Hughes ≥ 3, < 8 semanas); glicocorticoides contraindicados. | Nenhuma no conteúdo; referência e incerteza atualizadas | aprovado |
| 3a. Triagem auditiva neonatal | emb-20 | **Os três pontos da diretriz de 2012 foram confirmados, mas a diretriz foi atualizada.** O guia do MS de 2025 se declara a atualização das diretrizes de 2012 e muda o protocolo: infecção congênita passou a ser triada com emissões otoacústicas. | **2 correções importantes:** correlação de surdez congênita; explicação e referência do emb-20-q26 (gabarito mantido) | aprovado-com-correcoes |
| 3b. Reflexo vermelho / catarata | emb-20 | **Teste do reflexo vermelho confirmado** (MS 2013). A janela cirúrgica da catarata não está na fonte do MS. | Nenhuma no conteúdo; incerteza reescrita com o que foi lido | (mesmo arquivo) |
| 4. Teste do pezinho (his-08, emb-25) | — | Manual de 2016 lido: coleta ideal do 3º ao 5º dia e, para fenilcetonúria, só após 48 h. O emb-25 é compatível. | **Nenhuma** (fora do escopo de edição; só registro) | — |

Rede: todos os hosts usados estavam liberados (www.gov.br, bvsms.saude.gov.br, www.sbp.com.br). Nenhum "CONNECT tunnel failed, 403". O WebSearch só serviu para achar URLs. Sites secundários que apareceram na busca (blogs de cursinho, notícias municipais, Conass) não foram usados como fonte.

## 2. Item 1: his-07, PCDT de Osteoporose

### Fontes lidas
1. **Diário Oficial da União nº 208, de 31/10/2025, Seção 1, p. 145** (código de autenticidade 05152025103100145), na cópia da Conitec: <https://www.gov.br/conitec/pt-br/midias/relatorios/portaria/2025/portaria-conjunta-saes-sectics-no-23-de-22-de-outubro-de-2025.pdf/@@download/file>. **O arquivo se chama "nº 23", mas a página traz as duas portarias da mesma data.** É provável que daí venha a dúvida "22 ou 23".
2. **Texto integral do PCDT** (PDF de 98 p., gerado em 28/01/2026, já com as "alterações pós-publicação"), servido pela página oficial: <https://www.gov.br/saude/pt-br/assuntos/pcdt/o/osteoporose>.
3. Para comparar: PCDT anterior (Portaria Conjunta nº 19/2023), <https://www.gov.br/conitec/pt-br/midias/protocolos/portariaconjuntano19pcdtosteoporose.pdf/@@download/file>.

### Trechos decisivos
- DOU, p. 145: "PORTARIA CONJUNTA SAES/SECTICS Nº 22, DE 22 DE OUTUBRO DE 2025 — Aprova o Protocolo Clínico e Diretrizes Terapêuticas da Osteoporose." … "Art. 4º Fica revogada a Portaria Conjunta SAES/SECTICS nº 19, de 28 de setembro de 2023, publicada no Diário Oficial da União nº 201, de 23 de outubro de 2023, seção 1, pág. 105."
- Mesma página: "PORTARIA CONJUNTA SAES/SECTICS Nº 23, DE 22 DE OUTUBRO DE 2025 — Aprova o Protocolo Clínico e Diretrizes Terapêuticas da Acromegalia."
- PCDT 2025, item 3.1: "A definição clínica de osteoporose baseia-se tanto na evidência de fratura por fragilidade, independentemente da massa óssea, como na avaliação da densidade mineral óssea (DMO), por meio de densitometria óssea (g/cm²) da coluna lombar, fêmur total, colo do fêmur ou terço médio do rádio."
- Item 3.1: "A osteoporose refere-se a uma condição em que há: o T-escore menor ou igual a -2,5 DP em homens acima dos 50 anos e mulheres na pós menopausa na coluna lombar (ântero-posterior), colo femoral, quadril total ou 1/3 do rádio, mesmo na ausência de uma fratura prevalente ou; presença de fratura osteoporótica (também chamada de fratura de fragilidade) … independentemente do T-escore ou; o T-escore entre -1 e -2,49 associado a um aumento de risco de fratura avaliado pela ferramenta FRAX®."
- Item 3.1: "É considerada osteoporose grave quando o paciente com T-escore menor ou igual a – 2,5 DP associado a uma ou mais fraturas por fragilidade."
- Z-score: **o PCDT 2025 não o menciona** (busquei "Z-escore", "escore Z", "Z-score").
- PCDT 2023, para comparar: "quando T-score é menor ou igual a -3,0 DP, classifica-se como osteoporose grave". **A versão de 2025 mudou a definição de "grave"** e agora coincide com o tópico.

### Resultado
- O número é **22**.
- A definição clínica pela fratura por fragilidade se mantém, assim como o T-escore ≤ −2,5 em mulheres na pós-menopausa e em homens acima dos 50 anos.
- A "osteoporose grave" do PCDT 2025 (T-escore ≤ −2,5 com fratura) é a mesma do tópico. Por isso a correlação `osteoporose` e a explicação do his-07-q12 ("T-score ≤ −2,5 com fratura por fragilidade caracteriza osteoporose estabelecida (grave)") estão corretas. Nada foi contradito.

### Mudanças
- `referencias[6]`: agora traz número, data, DOU, revogação da nº 19/2023, URL e a seção 3.1.
- `incertezas[5]`: reescrita como confirmada, com as diferenças que não são contradição (abaixo).
- Nenhuma questão ou correlação citava a portaria pelo número; o texto didático ficou como estava.

### Para o revisor humano (sem contradição; não editei)
- **Z-score:** o PCDT não trata dele. A frase do tópico continua apoiada só nas posições oficiais da ISCD.
- **Sítios:** o tópico cita coluna lombar, colo do fêmur e fêmur total; o PCDT inclui também o terço do rádio.
- **Critério novo:** o PCDT acrescenta o T-escore entre −1 e −2,49 com FRAX elevado, que o tópico não cita. O tópico apresenta os critérios da OMS.
- **Idade:** o PCDT diz homens "acima dos 50 anos"; o tópico diz "a partir de 50 anos", como a ISCD ("50 and older").
- No apêndice do PCDT, a alteração da definição de "grave" consta como apresentada na "132ª reunião … de 13 de janeiro de 2025". A data parece erro de digitação por 2026, porque a 131ª reunião foi em 16/12/2025. Não afeta o tópico.

## 3. Item 2: his-10, PCDT de Guillain-Barré

### Fontes lidas
1. **Texto integral** servido pela página oficial do PCDT, <https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sindrome-de-guillain-barre>. É um PDF de 16 p., modificado em 02/09/2022, com o mesmo texto da cópia da Conitec: <https://www.gov.br/conitec/pt-br/midias/protocolos/20201022_portaria_conjunta_pcdt_sgb-1.pdf/@@download/file>.
2. Lista oficial de PCDTs da letra S, <https://www.gov.br/saude/pt-br/assuntos/pcdt/s>. O link "Síndrome de Guillain-Barré" leva ao documento acima.
3. Página "Saúde de A a Z" do MS, <https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/sindrome-de-guillain-barre>, que remete ao mesmo PCDT.

### Trechos decisivos
- "PORTARIA CONJUNTA Nº 15, DE 13 DE OUTUBRO DE 2020. Aprova o Protocolo Clínico e Diretrizes Terapêuticas da Síndrome de Guillain-Barré."
- Apêndice 1: "Depois da publicação, em 13/10/2020, da Portaria Conjunta SAES/SCTIE nº 15, impôs-se a reedição do Protocolo … pela necessidade de se excluírem apresentações farmacêuticas de imunoglobulina humana devido à ausência de registros válidos na Anvisa." O informe foi à Conitec em 10/03/2022.
- "4. CRITÉRIOS DE INCLUSÃO … apresentarem doença moderada-grave (Escala de Incapacidade) e menos de 8 semanas de evolução."
- "Para a correta indicação do tratamento, faz-se necessária a determinação da gravidade clínica proposta por Hughes et al., sendo considerada doença leve de 0 a 2 e moderada-grave de 3 a 6 (Quadro 1)." Quadro 1: "3 — Capaz de caminhar somente com bengala ou suporte."
- "Os tratamentos modificadores de doença preconizados na SGB incluem um tratamento não medicamentoso (plasmaférese) e um medicamentoso (imunoglobulina humana endovenosa). Não se observam diferenças significativas na resposta a essas duas formas de tratamento."
- "Glicocorticoides estão contraindicados no tratamento da SGB."
- Também confirmam o tópico: "na primeira semana, a proteína no LCR pode ser normal em até 1/3 dos pacientes" e "infecção por Campylobacter jejuni a mais frequente (32%), seguida por citomegalovírus (13%)".

### Resultado
- **Vigência:** em 09/11/2026, a página oficial de PCDTs serve a Portaria Conjunta nº 15/2020 (reeditada em 2022). Não localizei portaria posterior nem consulta pública de atualização. Isso é inferência a partir da página oficial e da busca: não há como provar a ausência de um ato.
- As **indicações** conferem com o tópico: "imunoglobulina intravenosa ou plasmaférese … nas formas moderadas a graves, como em quem não consegue andar sem apoio". Hughes 3 a 6 com menos de 8 semanas; Hughes 3 é "caminha só com bengala ou suporte".
- **Corticoide:** o tópico diz "não são eficazes"; o PCDT diz "contraindicados". É compatível, e o PCDT é mais forte.

### Mudanças
- `referencias[11]`: URL, nota da reedição de 2022 e seções 4 e 7 (com o Quadro 1).
- `incertezas[3]`: a parte do PCDT foi reescrita como confirmada. Mantive o resto (EAN/PNS 2023, McDonald 2024 e OMS 2021 conferidos por resumo; proporção de ventilação mecânica deixada qualitativa).
- Nenhuma mudança no texto didático.

## 4. Item 3: emb-20, triagem auditiva neonatal e teste do reflexo vermelho

### 4a. Triagem auditiva neonatal

#### Fontes lidas
1. **Diretrizes de Atenção da Triagem Auditiva Neonatal**, MS, 2012 (19 p.): <https://bvsms.saude.gov.br/bvs/publicacoes/diretrizes_atencao_triagem_auditiva_neonatal.pdf>. A cópia do gov.br é idêntica byte a byte.
2. **Guia para realização da Triagem Auditiva Neonatal (TAN) e seguimento assistencial**, MS, 1ª ed., 2025 (64 p.; PDF gerado em 30/10/2025): <https://bvsms.saude.gov.br/bvs/publicacoes/guia_triagem_auditiva_neonatal.pdf>. Achei o link na notícia da SBP sobre o lançamento: <https://www.sbp.com.br/sbp-participa-de-lancamento-do-guia-nacional-de-triagem-auditiva-neonatal-durante-o-33o-congresso-brasileiro-de-fonoaudiologia/>.

#### Trechos decisivos: diretrizes de 2012 (os três pontos pedidos)
- **Indicadores de risco:** "São considerados neonatos ou lactentes com indicadores de risco para deficiência auditiva (Irda) aqueles que apresentarem os seguintes fatores … Infecções congênitas (toxoplasmose, rubéola, citomegalovírus, herpes, sífilis, HIV)."
- **PEATE automático no risco:** "Para os neonatos e lactentes sem indicador de risco, utiliza-se o exame de Emissões Otoacústicas Evocadas (EOAE) … Para os neonatos e lactentes com indicador de risco, utiliza-se o teste de Peate-Automático ou em modo triagem."
- **Prazos:** "A TAN deve ser realizada, preferencialmente, nos primeiros dias de vida (24h a 48h) na maternidade, e, no máximo, durante o primeiro mês de vida." Entre os indicadores de qualidade: "conclusão do diagnóstico até os três meses de vida". E também: "o diagnóstico funcional e a intervenção iniciados antes dos seis meses de vida da criança possibilitam, em geral, melhores resultados".
- Além disso: "Aqueles neonatos e lactentes com malformação de orelha, mesmo que em apenas uma delas, deverão ser encaminhados diretamente para diagnóstico otorrinolaringológico e audiológico."

#### Trechos decisivos: guia de 2025, que atualiza as diretrizes de 2012
- "Este documento refere-se à atualização das Diretrizes de Atenção da Triagem Auditiva Neonatal (TAN), publicado em 2012 pelo Ministério da Saúde, sendo atualizado para Guia para realização da Triagem Auditiva Neonatal (TAN) e seguimento assistencial."
- **IRDA1** (perda coclear): "Infecções congênitas do grupo STORCH+Z, incluindo a síndrome congênita do vírus Zika, mesmo que o diagnóstico ainda esteja em investigação. Uso de medicações ototóxicas. Anomalias craniofaciais … a exemplo de microtia/atresia, apêndice pré-auricular … Hereditariedade."
- **IRDA2** (perda retrococlear e espectro da neuropatia auditiva): "Permanência em Utin por mais de cinco dias. Peso ao nascimento menor de 1.500 gramas. Hiperbilirrubinemia com exsanguineotransfusão. ECMO. Ventilação mecânica por mais de cinco dias. Anóxia grave … Encefalopatia hipóxico-isquêmica. Hemorragia peri-ventricular."
- **Protocolo:** "a TAN em neonatos sem IRDA (baixo risco) ou com IRDA1 deve ser realizada com EOAT" … "Grupo com IRDA2: Realizar o protocolo combinado, EOAT e PEATE-A, antes da alta hospitalar." O Quadro 1 (p. 24) traz o mesmo: "SEM FATOR DE RISCO e FATOR DE RISCO – IRDA1: STORCH+Z … → EOAT"; "IRDA2 → EOAT + PEATE-A".
- **Prazos:** "A etapa teste deve ser realizada preferencialmente nos primeiros dias de vida (24h a 48h) … A etapa reteste, quando necessária, deve ocorrer até o 15º dia de vida." O guia também diz: "a TAN deve ser realizada dentro do primeiro mês de vida em todos os recém-nascidos". E ainda: "marcadores de referência 1-3-6 (triagem auditiva até o primeiro mês; diagnóstico até o terceiro mês e início da intervenção até o sexto mês) sejam substituídos por metas mais audaciosas, como 1-2-3, em serviços que já estejam estruturados". Por fim: "o ideal é que a intervenção seja iniciada até aos 6 meses de idade".
- **Malformação de orelha:** "o encaminhamento direto para o serviço especializado ou CER, a fim de realizar diagnóstico audiológico, sem realizar a triagem auditiva previamente no recém-nascido, pode ocorrer quando: … Diante da presença de malformação de orelha, mesmo que unilateral (JCIH, 2019)." E também: "Para a realização do registro das EOAT é necessária a integridade anatômica da orelha externa."
- **Lei:** o guia confirma a obrigatoriedade pela "Lei Federal n.º 12.303, de 02 de agosto de 2010, que obriga a realização do exame de Emissões Otoacústicas Evocadas (EOA) em todos os recém-nascidos".

#### Resultado
- Os três pontos pedidos estão **confirmados no texto de 2012**: os indicadores de risco, com a rubéola; o PEATE automático para quem tem indicador; e os prazos de 24–48 h, até 1 mês, diagnóstico até 3 meses e intervenção até 6 meses.
- **Mas o próprio Ministério da Saúde atualizou essas diretrizes em 2025**, e o guia novo **contradiz o protocolo** que o tópico apresentava como recomendação atual. Pelo guia de 2025, a infecção congênita é IRDA1 e é triada com emissões otoacústicas. O PEATE-A, combinado às emissões, ficou para o IRDA2.
- Os prazos foram mantidos (24–48 h; até o 1º mês; 1-3-6), e o guia acrescentou o reteste até o 15º dia.

#### Mudanças (2 correções importantes; nenhum gabarito alterado)
1. **`correlacoesClinicas[6]` (surdez congênita)**, último período.
   - Antes: "as diretrizes do Ministério da Saúde (2012) recomendam fazê-la de preferência nas primeiras 24–48 horas e no máximo até o fim do 1º mês, com emissões otoacústicas nos recém-nascidos sem indicador de risco e PEATE automático nos que têm indicador de risco, com diagnóstico até os 3 meses e intervenção até os 6 meses."
   - Depois: "o guia do Ministério da Saúde de 2025, que atualizou as diretrizes de 2012, recomenda fazê-la de preferência nas primeiras 24–48 horas (reteste, se preciso, até o 15º dia) e no máximo até o fim do 1º mês: emissões otoacústicas nos recém-nascidos sem indicador de risco ou com indicadores ligados sobretudo a perda coclear (como as infecções congênitas), e emissões otoacústicas com PEATE automático nos que têm indicadores ligados a perda retrococlear e ao espectro da neuropatia auditiva (como internação em UTI neonatal por mais de 5 dias); diagnóstico até os 3 meses e intervenção até os 6 meses."
2. **`emb-20-q26`, explicação**, último período. O gabarito (d) e as alternativas não mudaram.
   - Antes: "… a triagem auditiva neonatal, obrigatória no Brasil, deve ser feita com PEATE automático, e a audição deve continuar a ser acompanhada …"
   - Depois: "… a triagem auditiva neonatal, obrigatória no Brasil, deve ser feita (pelo guia do Ministério da Saúde de 2025, com emissões otoacústicas, porque esse indicador se associa sobretudo a perda coclear), e a audição deve continuar a ser acompanhada …"
   - `referencia` da questão: a diretriz de 2012 foi trocada pelo guia de 2025.
3. **`referencias`:** a diretriz de 2012 ganhou URL, seções e a nota "(atualizadas pelo guia de 2025)". O **guia de 2025** entrou como referência nova, com URL e seções. A diretriz de saúde ocular de 2013 ganhou URL (ver 4b).
4. **`incertezas[7]`:** o trecho "conferidos em documentos que citam a diretriz …, não no texto integral" foi reescrito como conferido, com a mudança de 2025. O resto da incerteza ficou: a contagem de semanas em Miller 1982 e a tomografia da q27.

#### Para o revisor humano (não editei)
- **emb-20-q27** (microtia com atresia): a explicação termina com "A triagem auditiva neonatal, obrigatória no Brasil, e a avaliação audiológica das duas orelhas são feitas desde o período neonatal, sem esperar a tomografia". As diretrizes de 2012 mandavam encaminhar a malformação de orelha **direto ao diagnóstico**. O guia de 2025 diz que esse encaminhamento direto **pode** ocorrer, e lembra que as emissões otoacústicas exigem a integridade da orelha externa. Como a fonte vigente é permissiva, não há contradição e mantive o texto. Proposta (não implementada): "o recém-nascido com malformação de orelha, mesmo unilateral, pode ser encaminhado direto à avaliação otorrinolaringológica e audiológica, sem esperar a tomografia".
- A correlação `apendices-pre-auriculares` ("exigem triagem auditiva") agora tem apoio explícito: o guia de 2025 lista o apêndice pré-auricular entre os IRDA1. Não houve mudança.

### 4b. Teste do reflexo vermelho e catarata congênita

#### Fontes lidas
1. **Diretrizes de Atenção à Saúde Ocular na Infância: detecção e intervenção precoce para a prevenção de deficiências visuais**, MS, 2013 (1ª ed., 42 p.): <https://bvsms.saude.gov.br/bvs/publicacoes/diretrizes_atencao_saude_ocular_infancia.pdf>. Não existe uma "diretriz de catarata congênita" separada do MS de 2013. A catarata é tratada dentro deste documento.
2. **Consulta pública de 2026**, "Revisão e Atualização do Guia para realização da Triagem Ocular Neonatal (TON) e seguimento assistencial". Página: <https://www.gov.br/saude/pt-br/acesso-a-informacao/participacao-social/consultas-publicas/2026/revisao-e-atualizacao-do-guia-para-realizacao-da-triagem-ocular-neonatal-ton-e-seguimento-assistencial>. Caderno: o PDF em `…/caderno-da-consulta-publica`.
3. **Não consegui baixar a 2ª ed. (2016)** das diretrizes de saúde ocular. Os nomes de arquivo que tentei no bvsms deram 404, e não procurei além disso.

#### Trechos decisivos
- MS 2013: "Todos os nascidos devem ser submetidos ao TRV antes da alta da maternidade e, pelo menos, duas a três vezes ao ano, nos três primeiros anos de vida." Na faixa de 3 a 5 anos: "pelo menos uma vez ao ano do 3º ao 5º ano de vida".
- MS 2013: "Uma vez detectado fatores de risco ou doença ocular, esses neonatos devem ser encaminhados imediatamente ao serviço oftalmológico especializado de referência (Recomendação da SBOP)." E também: "Em caso de reflexo alterado ou suspeito, o paciente deve ser encaminhado para o médico oftalmologista."
- MS 2013: não há janela cirúrgica da catarata. Busquei "semana", "cirurg" e "urgên"; a única menção a semanas de vida é a do rastreio da retinopatia da prematuridade.
- Página da consulta pública: "Status: Encerrada - Período: 13/02/2026 a 28/02/2026".
- Caderno: "O primeiro exame deve ser realizado nas primeiras horas de vida (até 48 horas), idealmente antes da alta na maternidade." Sobre a periodicidade: "1º ano de vida: TRV aos 2, 6 e 9 meses de vida; 2º ano de vida: TRV aos 12, 18 e 24 meses de vida; a partir do 3º ano … uma vez ao ano". Sobre o encaminhamento: "O atendimento na atenção especializada deverá ser realizado com a maior brevidade possível, preferencialmente em até 30 dias". O caderno também não traz janela cirúrgica.

#### Resultado
- O tópico diz que o teste do reflexo vermelho é "recomendado pelo Ministério da Saúde antes da alta da maternidade e repetido nas consultas dos primeiros anos". **Confirmado** pela diretriz de 2013 e compatível com o caderno de 2026.
- O "encaminhamento urgente ao oftalmologista" da catarata densa é compatível com o "imediatamente" da diretriz de 2013.
- A **janela cirúrgica** (4–6 semanas na unilateral; até ≈ 10 semanas na bilateral) **não está em nenhuma fonte do MS lida**. Continua sem fonte primária conferida e fica na incerteza.
- A versão final do guia de triagem ocular **não foi localizada** em 09/11/2026.

#### Mudanças
- `referencias`: a diretriz de saúde ocular de 2013 ganhou URL e o conteúdo conferido no campo "capítulo".
- `incertezas[5]`: reescrita com o que foi lido (2013 e caderno de 2026) e com o que continua pendente.
- Nenhuma mudança no texto didático.

## 5. Item 4: his-08 e emb-25 (só registro, sem edição)

- **Fonte lida:** *Triagem neonatal biológica: manual técnico*, MS, 2016 (83 p.): <https://bvsms.saude.gov.br/bvs/publicacoes/triagem_neonatal_biologica_manual_tecnico.pdf>.
- **Trechos:**
  - "Recomenda-se que o período ideal de coleta da primeira amostra esteja compreendido entre o 3º e o 5º dia de vida do bebê devido às especificidades das doenças diagnosticadas atualmente."
  - Na orientação ao pré-natal: "preconizando a necessidade dessa ser realizada até o 5º dia de vida do bebê".
  - No capítulo de fenilcetonúria: "Recomenda-se que a coleta seja feita somente após 48 horas do nascimento".
  - "Deve ser considerada como uma condição de exceção toda coleta realizada após o 28º dia de vida".
- **Situação dos tópicos:**
  - O **emb-25** diz "entre o 3º e o 5º dia de vida, a partir de 48 horas" e registra na incerteza a diferença com a página atual do programa ("de 48 horas após o parto até o 5º dia"). As duas formulações são compatíveis com o manual.
  - O **his-08** não menciona o teste do pezinho (busquei "pezinho", "triagem", "5º dia").
  - Não editei nenhum dos dois.

## 6. O que fica para o revisor humano

1. **his-07:** decidir se o tópico deve citar o critério do PCDT 2025 que ele não traz (T-escore entre −1 e −2,49 com FRAX elevado) e o terço do rádio entre os sítios. O Z-score continua apoiado só na ISCD.
2. **his-10:** nenhuma pendência do PCDT. Continuam as do revisor clínico (diretrizes internacionais conferidas por resumo).
3. **emb-20:**
   - conferir as duas correções feitas a partir do guia de triagem auditiva de 2025 (correlação de surdez congênita e explicação do q26);
   - decidir a proposta para a q27 (encaminhamento direto na malformação de orelha);
   - achar uma fonte primária para a janela cirúrgica da catarata congênita;
   - acompanhar a versão final do guia de triagem ocular neonatal (consulta pública encerrada em 28/02/2026).
4. **`revisao.humano`** continua `null` nos três arquivos. Só o Cristiano, ou professor indicado por ele, preenche.

## 7. Verificação

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  48 passed (48)
```

Comparação estrutural com a cópia anterior à edição (script):
- **his-07:** alterados `referencias[6]` e `incertezas[5]`; acrescentado `revisao.agentes[2]`.
- **his-10:** alterados `referencias[11]` e `incertezas[3]`; acrescentado `revisao.agentes[2]`.
- **emb-20:**
  - alterados `correlacoesClinicas[6].descricao`, `questoes[25].explicacao`, `questoes[25].referencia`, `referencias[12–14]`, `incertezas[5]` e `incertezas[7]`;
  - acrescentados `referencias[15]` (a de Miller 1982, que só mudou de posição porque o guia de 2025 entrou no índice 13) e `revisao.agentes[4]`.
- Ids, `correta`, alternativas, ordens e pares estão idênticos nos três arquivos. `revisao.humano` é `null` nos três.
