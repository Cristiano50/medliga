# Revisão G4: clínica pediátrica e anatomia (tópicos 16 a 20), 2ª etapa

- Agente: `revisor-clinica-anatomia-v1` (área `clinica-pediatrica/anatomia`), revisor transversal
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`. Relatório da 1ª etapa: `content/revisoes/g4-embriologia.md`.
- Arquivos: `content/embriologia/topicos/emb-16-urinario.json`, `emb-17-genital-diferenciacao-sexual.json`, `emb-18-sistema-nervoso.json`, `emb-19-musculoesqueletico-membros.json`, `emb-20-olho-orelha-tegumento.json`
- Garantias, todas conferidas por script contra o `HEAD`:
  - gabaritos (`correta`, `ordemCorreta`) e ids de tópicos, questões, alternativas, estruturas, eventos e correlações estão idênticos;
  - toda explicação de múltipla escolha continua citando a letra de cada distrator;
  - `revisao.humano` continua `null` nos cinco arquivos, e o registro da 1ª etapa foi mantido em `revisao.agentes`.
- Escopo: nenhum arquivo fora do G4 foi editado e nada foi commitado. Durante a sessão, outros arquivos do repositório (tópicos 1 a 15, `estagios.json`, `src/…`) foram alterados por trabalho paralelo; não mexi neles.

## 1. Resumo

Fiz uma segunda leitura integral dos cinco tópicos: resumo, pontos-chave, objetivos, estruturas, eventos, correlações, 120 questões, referências, notas e incertezas. O olhar foi o clínico (condutas e diretrizes brasileiras) e o anatômico (relações, inervação, irrigação, marcos).

| Tópico | Questões | Crítica | Importante (pista de comprimento) | Importante (outras) | Menor | Total | Veredito |
|---|---|---|---|---|---|---|---|
| emb-16 Sistema urinário | 25 | 0 | 11 | 1 | 0 | 12 | aprovado-com-correcoes |
| emb-17 Genital e diferenciação sexual | 23 | 0 | 8 | 0 | 9 | 17 | aprovado-com-correcoes |
| emb-18 Sistema nervoso | 24 | 0 | 6 | 1 | 7 | 14 | aprovado-com-correcoes |
| emb-19 Musculoesquelético e membros | 24 | 0 | 10 | 0 | 3 | 13 | aprovado-com-correcoes |
| emb-20 Olho, orelha e tegumento | 24 | 0 | 10 | 0 | 2 | 12 | aprovado-com-correcoes |
| **Total** | **120** | **0** | **45** | **2** | **21** | **68** | |

Gravidade: **crítica** = fato ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou questão resolvível sem conhecimento; **menor** = redação, terminologia, precisão, atualização de conduta, referência. Classifiquei a pista de comprimento como importante porque permite acertar a questão sem saber o conteúdo.

**Principais achados**

- **Nenhum gabarito errado e nenhum fato errado** (0 crítica). A 1ª etapa foi cuidadosa; esta etapa acrescenta precisão clínica, terminologia e validade das questões.
- **Pista involuntária de comprimento era sistemática.**
  - Antes: em 50 das 72 questões de múltipla escolha, a alternativa correta era a mais longa; em 44 delas, com folga (correta ≥ 1,35 × a média dos distratores).
  - Correção em 45 questões: reescrevi distratores com especificidade parecida (todos continuam claramente errados e refutados na explicação) e encurtei várias corretas, sem mudar gabarito nem ids.
  - Depois: a correta é a mais longa em 16 de 72, sempre por 5 caracteres ou menos. Só sobra uma razão acima de 1,3: emb-18-q04, "À substância cinzenta" × "À substância branca", diferença de 2 caracteres, sem pista real.
- **Linha do tempo.** Decidi os pares que a 1ª etapa deixou "próximos mas mantidos", usando a regra do minijogo de mostrar um evento por valor de `ordem` (`src/games/LinhaDoTempo.tsx`). Quando a ordem não é inequívoca, os dois eventos passam a compartilhar a mesma posição; nenhum evento foi apagado.
  - emb-16: próstata e rins na região lombar passam a compartilhar a posição 5.
  - emb-18: crescimento desproporcional da coluna e desconexão da bolsa de Rathke passam a compartilhar a posição 5; o evento foi reescrito para descrever um acontecimento, não um estado.
  - emb-17-q20: a ordem AMH/Sertoli antes de testosterona/Leydig foi mantida, com justificativa biológica: a diferenciação das células de Leydig depende das células de Sertoli (DHH).
- **DDS: terminologia padronizada.** A SBP (Departamento Científico de Endocrinologia, documento de fevereiro de 2026, "Abordagem da criança que nasce com genitália atípica") usa a forma dupla **"Distúrbios/Diferenças"** (da Diferenciação do Sexo, DDS). A **Resolução CFM nº 2.455/2026**, publicada em 04/05/2026, revogou a 1.664/2003 e adota **"distúrbios do desenvolvimento sexual"**. O tópico 17 passou a usar em todo o texto **"distúrbios/diferenças do desenvolvimento sexual (DDS)"**; a escolha e as fontes estão em `notasDivergencia`.
- **Condutas atualizadas**, com fonte:
  - HAC: teste do pezinho no PNTN desde 2012, confirmação sérica, falso-positivo em prematuros, cloreto de sódio no lactente.
  - Insensibilidade completa aos andrógenos: gonadectomia em geral adiada para depois da puberdade, em decisão compartilhada.
  - Criptorquidia: cirurgia a partir dos 6 meses, de preferência até os 12 e no máximo até os 18.
  - Mielomeningocele: cirurgia fetal antes de 26 semanas no MOMS ou fechamento pós-natal em 48–72 h; hidrocefalia; bexiga neurogênica.
  - Ácido fólico: 0,4 mg/dia no risco habitual e 4 mg/dia no alto risco.
  - DDQ: encaminhamento, ultrassonografia e radiografia, Pavlik.
  - Pé torto: método de Ponseti completo.
  - Catarata congênita: teste do olhinho e janela cirúrgica.
  - Triagem auditiva: diretrizes do Ministério da Saúde de 2012.
- **Anatomia conferida sem erro:**
  - cone medular (valores das fontes, com dados de imagem neonatal acrescentados);
  - descida testicular e canal inguinal: camadas da parede abdominal, anel profundo lateral aos vasos epigástricos inferiores, túnica vaginal;
  - ascensão e irrigação renal, rim em ferradura retido pela AMI, artéria polar inferior cruzando o ureter;
  - rotação dos membros e dermátomos espiralados do membro inferior;
  - inervação epaxial e hipaxial;
  - costela cervical: tronco inferior C8–T1, artéria subclávia, parestesia em T1 e C8;
  - tensor do tímpano pelo nervo V e estapédio pelo VII;
  - artéria central da retina, ramo da oftálmica, que vem da carótida interna.

**Pendências da 1ª etapa**

| Pendência (numeração do relatório da 1ª etapa) | Situação |
|---|---|
| 5. Terminologia de DDS | Resolvida com fonte (SBP 2026 + CFM 2.455/2026). Confirmação do Cristiano ainda pedida (ver seção 3). |
| 6. Hipospádia | Resolvida: mantida a atribuição a Moore/Sadler, acrescentando que a maioria dos casos isolados é multifatorial. |
| 7. Ordens apertadas | Decididas (ver acima). |
| 9. "glândula seminal" × "vesícula seminal" | Harmonizada para "glândula seminal" no emb-17. |
| 1. Cone medular | O tópico mantém L2–L3 ao nascer (Moore); acrescentei dados de imagem (RN a termo em geral em L1–L2) sem mudar a ordem da q22. |
| 4. Polidactilia | Conferida do ponto de vista clínico: a redação atual está correta. |
| 2, 3, 8, 10 | Continuam pendentes (seção 3). |

## 2. Tabela de correções

### 2.1 Correções de conteúdo (exceto pista de comprimento)

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-16 / evento `e16-brotos-prostaticos` (+ nota de divergência) | eventos.ordem | ordem 6, depois de "rins na região lombar" (5) | ordem 5, compartilhada com `e16-rins-posicao-lombar` | Ordem relativa não inequívoca: rins na posição adulta ≈ 9ª semana (Moore); brotos prostáticos no fim do 3º mês (Sadler), ≈ 10ª semana em outras fontes, e "≈ 10 semanas de gestação" em estudos da próstata humana, sem sistema de contagem explícito | importante | Moore 11ª ed., cap. 12; Sadler 14ª ed., cap. 16; regra do minijogo em `src/games/LinhaDoTempo.tsx` |
| emb-17 objetivos, resumo (Correlações), correlação `dds-nomenclatura` (título e descrição) + nota | vários | "diferenças do desenvolvimento do sexo (DDS)"; "distúrbios ou, cada vez mais, diferenças" | "distúrbios/diferenças do desenvolvimento sexual (DDS)" em todo o tópico; o texto informa a forma da SBP e a do CFM | Padronização pedida; terminologia brasileira vigente | menor | SBP, DC Endocrinologia, fev/2026; Resolução CFM nº 2.455/2026; Lee et al., Pediatrics 2006 |
| emb-17 / `dds-nomenclatura` | descricao | terminava na equipe multiprofissional | + conduta inicial na genitália atípica: urgência, não atribuir sexo na sala de parto, investigar HAC (crise perdedora de sal), equipe multiprofissional | Atualização clínica | menor | SBP 2026 (conferido por resumos e citações; texto integral não acessível) |
| emb-17 / `insensibilidade-androgenos` | descricao | "momento da gonadectomia é individualizado; risco baixo antes da puberdade" | Risco baixo, sobretudo antes da puberdade. A gonadectomia, se escolhida, costuma ser adiada para depois da puberdade (espontânea, por aromatização da testosterona), em decisão compartilhada. A pessoa pode manter as gônadas sob vigilância (sem marcadores validados) | Prática atual e decisão compartilhada | menor | Lee et al., Horm Res Paediatr 2016;85:158–80; revisões sobre gonadectomia na CAIS (PMC6480640; PMID 26428189) |
| emb-17 / `hac-21-hidroxilase` | descricao | "17-OHP usada na triagem neonatal"; glicocorticoide ± mineralocorticoide | 17-OHP é o marcador do teste do pezinho no PNTN desde 2012; confirmação sérica; falso-positivo em prematuros e em amostra muito precoce; hidrocortisona, fludrocortisona e NaCl no lactente | Triagem brasileira e conduta | menor | Portaria GM/MS nº 2.829/2012 (Fase IV do PNTN); Speiser et al., JCEM 2018; SBP, guia prático HAC e triagem neonatal |
| emb-17 / `criptorquidia` + emb-17-q17 | descricao; explicacao | "a partir dos 6 meses, preferencialmente até os 18" | "a partir dos 6 meses (idade corrigida), de preferência até os 12 e no máximo até os 18" | Precisão em relação às diretrizes | menor | Kolon et al., J Urol 2014 (AUA); diretrizes EAU/ESPU de urologia pediátrica |
| emb-17 / `hipospadia` | mecanismo | "em geral por produção ou ação insuficiente de andrógenos" | Mecanismo atribuído a Moore/Sadler + "na prática, a maioria dos casos isolados é multifatorial, sem causa endócrina identificada" | Pendência 6 da 1ª etapa | menor | Baskin et al., Environ Health Perspect 2001;109:1175; Int J Pediatr Endocrinol 2014:20 |
| emb-17-q11 | explicacao (com a alternativa b) | "(b)… o AMH não é produzido"; explicação sem orientação inicial | (b) passou a afirmar que o receptor de andrógenos impede a ação do AMH; a explicação refuta isso e cita a SBP (não atribuir sexo na sala de parto) e a triagem desde 2012 | Distrator mais plausível e explicação mais completa | (contado na pista da q11) | SBP 2026; Portaria 2.829/2012 |
| emb-17-q13 | explicacao | "a ressecção histeroscópica do septo pode ser considerada" | + "embora o benefício seja controverso: no ensaio randomizado TRUST (2021), não aumentou os nascidos vivos" | Evidência atual | menor | Rikken et al., Hum Reprod 2021;36:1260–7 |
| emb-17-q20 (+ nota) | explicacao | Sertoli (7ª semana) → Leydig (8ª semana), sem justificativa | Sertoli diferenciam-se primeiro e são necessárias à diferenciação das Leydig (DHH) | Decide a pendência 7 (AMH × testosterona): a ordem fica, agora justificada | menor | Larsen 5ª ed., cap. 16; Yao, Whoriskey, Capel, Genes Dev 2002;16:1433 |
| emb-17: resumo, pontosChave, `ducto-mesonefrico`, q06 (c), explicações das q06, q12 e q22 | vários | "vesícula seminal" | "glândula seminal"; 1ª menção "glândula seminal (vesícula seminal)" | Harmoniza com o emb-16 e a Terminologia Anatômica (pendência 9) | menor | Terminologia Anatômica (FIPAT; trad. SBA) |
| emb-18 / evento `e18-coluna-cresce-mais` (+ nota) | descricao; ordem | "A medula ocupa todo o canal vertebral; a partir de então…" (ordem 6) | "A coluna vertebral e a dura-máter passam a crescer mais rapidamente que a medula, que até então ocupava todo o canal (3º mês)"; ordem 5, compartilhada com `e18-rathke-desconexao` | Descrevia um estado, não um evento. A vizinhança com a desconexão de Rathke (6ª semana a fim do 2º mês) e o início gradual do crescimento desproporcional deixavam a ordem sem margem segura | importante | Sadler 14ª ed., cap. 18; Moore 11ª ed., cap. 17 |
| emb-18-q09 | contexto; explicacao | "paralisia flácida e ausência de sensibilidade nos MMII… perímetro cefálico > p97" | "paresia flácida e perda de sensibilidade abaixo do nível da lesão… ventriculomegalia à ultrassonografia transfontanelar" | Realismo: na mielomeningocele, a hidrocefalia costuma manifestar-se depois do fechamento (macrocefalia ao nascer é minoria), e lesão lombossacra não implica paralisia total. Diagnóstico inalterado | menor | Moore 11ª ed., cap. 17; Adzick et al., NEJM 2011 (MOMS) |
| emb-18 / `mielomeningocele` | descricao | Só MOMS ("reduziu derivação… prematuridade") | + cirurgia fetal antes de 26 semanas de IG; risco de afinamento ou deiscência da cicatriz uterina; sem cirurgia fetal, curativo estéril úmido e fechamento em 48–72 h; DVP ou terceiroventriculostomia; cateterismo intermitente limpo | Conduta atual pedida | menor | Adzick et al., NEJM 2011; prática de neurocirurgia pediátrica (ver seção 3) |
| emb-18 / `acido-folico-prevencao`, q15 (explicação), nota | descricao; explicacao; nota | "400 µg; dose alta de cerca de 4 mg (gestação afetada)"; "4 mg nas diretrizes internacionais" | 0,4 mg/dia para todas as que podem engravidar; 4 mg/dia no alto risco (DTN prévio ou em genitor; comprimido de 5 mg comum no Brasil); até o fim do 1º trimestre; q15 cita a FEBRASGO | Doses como pedido (0,4 mg / 4 mg) | menor | FEBRASGO, série DTN, 2ª ed., 2020; materiais do Ministério da Saúde (4–5 mg no alto risco) |
| emb-18 / `cone-medular` (+ nota) | destino | "L2–L3 no RN e L1–L2 no adulto" | Mesmo valor, atribuído a Moore + "na ultrassonografia do RN a termo, em geral L1–L2" | Marco anatômico com o dado clínico | menor | Sahin et al., Arch Dis Child Fetal Neonatal Ed 1997;77:F67; Beek et al., Neuroradiology 1996 |
| emb-18 / `medula-presa` | descricao | — | + ultrassonografia da coluna no lactente com marcador cutâneo lombossacro; cone em L4 ou abaixo pede seguimento | Aplicação clínica | menor | Sahin et al. 1997 |
| emb-18-q08 | explicacao | "punção lombar abaixo do cone (no RN, em nível mais baixo que no adulto)" | "nos espaços L3–L4 ou L4–L5 (no RN, cujo cone pode estar mais baixo, prefere-se L4–L5)" | Precisão | menor | Prática pediátrica de procedimentos |
| emb-18 / `craniofaringioma` | descricao | "mais frequente em crianças" | "picos de incidência na infância e na vida adulta; o tumor da região selar mais comum na infância" | Epidemiologia bimodal | menor | Bunin et al., J Neurosurg 1998;89:547 |
| emb-19 / `pe-torto-congenito` | descricao | "Ponseti (gessos seriados, tenotomia quando indicada, órtese)" | Início nas primeiras semanas; gessos semanais; tenotomia percutânea na maioria; órtese de abdução em tempo integral por ~3 meses e depois noturna até 4–5 anos | Conduta completa pedida | menor | Ponseti 1996; JBJS Essent Surg Tech (PMC6135620) |
| emb-19 / `displasia-desenvolvimento-quadril` | descricao | "confirmada por USG nos primeiros meses e tratada com Pavlik" | Manobra positiva → ortopedista; USG por volta de 6 semanas com fatores de risco; radiografia após 4–6 meses; Pavlik; depois de ~3 meses as manobras negativam e a limitação da abdução vira o principal sinal | Conduta pedida (Ortolani/Barlow, USG, Pavlik) | menor | Shaw & Segal, Pediatrics 2016 (AAP); SBOT, Rev Bras Ortop 2023 (DDQ, parte 1) |
| emb-19-q12 | explicacao | "conduta envolve USG e Pavlik" | "encaminhamento ao ortopedista, USG e, em geral, Pavlik" | Coerência com a correlação | menor | AAP 2016 |
| emb-20 / `catarata-congenita` | descricao | "exige tratamento precoce para evitar ambliopia" | Teste do reflexo vermelho recomendado pelo Ministério da Saúde antes da alta e repetido nas consultas; encaminhamento urgente; cirurgia em 4–6 semanas (unilateral) e até ~10 semanas (bilateral) | Conduta e triagem pedidas | menor | MS, Diretrizes de Atenção à Saúde Ocular na Infância (2013); material UNESP; NT NATS/TJMG 148/2014; MSD Manual |
| emb-20 / `surdez-congenita` | descricao | "obrigatória por lei desde 2010" | + diretrizes do Ministério da Saúde de 2012: 24–48 h e no máximo até 1 mês; EOA sem indicador de risco e PEATE automático com indicador; diagnóstico até 3 meses e intervenção até 6 (1-3-6) | Conduta pedida | menor | Lei 12.303/2010; MS, Diretrizes de Atenção da Triagem Auditiva Neonatal (2012) |

As referências novas também foram incluídas em `referencias`:

| Tópico | Referências acrescentadas |
|---|---|
| emb-17 | SBP 2026; CFM 2.455/2026; Lee 2016; Portaria 2.829/2012; Rikken 2021 |
| emb-18 | FEBRASGO 2020; Sahin 1997 |
| emb-19 | AAP 2016; Ponseti 1996 |
| emb-20 | Diretrizes do Ministério da Saúde de 2012 (triagem auditiva) e de 2013 (saúde ocular) |

### 2.2 Pista involuntária de comprimento (45 questões)

Em todas, os distratores foram reescritos para comprimento e especificidade parecidos, e em várias a correta foi encurtada. Os distratores continuam inequivocamente errados e refutados na explicação, que foi ajustada quando o texto do distrator mudou (emb-16-q02, q03, q11, q15; emb-17-q01, q11). "car." = caracteres; razão = comprimento da correta ÷ média dos distratores.

| id | o que mudou | antes | depois | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-16-q02 | alternativas a, b, d (correta: c) | correta 66 car. × maior distrator 39; razão correta/média 2.25 | 66 × 65; razão 1.19 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q03 | alternativas a, b, c, d (correta: a) | correta 186 car. × maior distrator 105; razão correta/média 2.24 | 130 × 133; razão 1.13 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q04 | alternativas a, b, c, d (correta: d) | correta 191 car. × maior distrator 71; razão correta/média 2.94 | 128 × 135; razão 1.16 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q05 | alternativas a, b, c, d (correta: b) | correta 194 car. × maior distrator 103; razão correta/média 2.39 | 130 × 131; razão 1.09 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q07 | alternativas b, c, d (correta: b) | correta 132 car. × maior distrator 101; razão correta/média 1.71 | 106 × 101; razão 1.19 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q09 | alternativas a, b, c, d (correta: a) | correta 178 car. × maior distrator 99; razão correta/média 2.77 | 127 × 132; razão 1.19 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q10 | alternativas b, c, d (correta: d) | correta 41 car. × maior distrator 31; razão correta/média 1.98 | 34 × 42; razão 0.91 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q11 | alternativas a, b, c, d (correta: b) | correta 85 car. × maior distrator 32; razão correta/média 3.54 | 61 × 60; razão 1.10 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q12 | alternativas a, b, c, d (correta: c) | correta 159 car. × maior distrator 95; razão correta/média 1.75 | 130 × 140; razão 1.08 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q13 | alternativas a, b, c, d (correta: a) | correta 158 car. × maior distrator 75; razão correta/média 3.39 | 123 × 129; razão 1.14 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-16-q15 | alternativas d (correta: c) | correta 34 car. × maior distrator 28; razão correta/média 1.38 | 34 × 47; razão 1.04 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q01 | alternativas a, b, c, d (correta: b) | correta 119 car. × maior distrator 49; razão correta/média 2.70 | 79 × 87; razão 0.99 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q02 | alternativas a, b, c (correta: d) | correta 75 car. × maior distrator 49; razão correta/média 1.77 | 75 × 73; razão 1.06 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q03 | alternativas a, b, c, d (correta: a) | correta 139 car. × maior distrator 80; razão correta/média 2.21 | 105 × 100; razão 1.08 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q07 | alternativas b, c (correta: d) | correta 65 car. × maior distrator 50; razão correta/média 1.59 | 65 × 66; razão 1.14 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q09 | alternativas a, b, c, d (correta: c) | correta 85 car. × maior distrator 36; razão correta/média 3.59 | 71 × 82; razão 0.91 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q10 | alternativas a, c (correta: b) | correta 98 car. × maior distrator 70; razão correta/média 1.71 | 98 × 97; razão 1.20 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q11 | alternativas a, b, d (correta: a) | correta 147 car. × maior distrator 98; razão correta/média 1.75 | 106 × 108; razão 1.04 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-17-q14 | alternativas b, c, e (correta: e) | correta 110 car. × maior distrator 93; razão correta/média 1.79 | 82 × 93; razão 1.02 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q02 | alternativas a, c, d (correta: b) | correta 70 car. × maior distrator 33; razão correta/média 2.16 | 70 × 67; razão 1.08 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q05 | alternativas a, b, c, d (correta: b) | correta 77 car. × maior distrator 57; razão correta/média 1.79 | 55 × 64; razão 0.91 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q07 | alternativas b, c, d (correta: a) | correta 64 car. × maior distrator 50; razão correta/média 1.57 | 64 × 73; razão 1.01 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q08 | alternativas c (correta: d) | correta 79 car. × maior distrator 64; razão correta/média 1.32 | 79 × 81; razão 1.19 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q10 | alternativas a, b, d (correta: c) | correta 40 car. × maior distrator 28; razão correta/média 1.69 | 40 × 54; razão 0.86 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-18-q13 | alternativas a, b, c, d, e (correta: e) | correta 102 car. × maior distrator 51; razão correta/média 2.37 | 88 × 87; razão 1.13 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q02 | alternativas b, c, d (correta: b) | correta 88 car. × maior distrator 72; razão correta/média 1.93 | 83 × 102; razão 1.09 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q03 | alternativas a, b, c, d (correta: d) | correta 100 car. × maior distrator 71; razão correta/média 2.48 | 86 × 95; razão 1.05 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q05 | alternativas a, b (correta: b) | correta 79 car. × maior distrator 64; razão correta/média 1.71 | 69 × 65; razão 1.20 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q07 | alternativas a, b, c, d (correta: c) | correta 140 car. × maior distrator 82; razão correta/média 1.97 | 103 × 107; razão 1.01 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q08 | alternativas a, b, c, d (correta: d) | correta 105 car. × maior distrator 54; razão correta/média 3.21 | 78 × 97; razão 1.07 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q09 | alternativas a, b, c, d (correta: a) | correta 151 car. × maior distrator 67; razão correta/média 2.92 | 113 × 116; razão 1.09 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q10 | alternativas a, b, c, d (correta: c) | correta 112 car. × maior distrator 65; razão correta/média 1.83 | 96 × 108; razão 1.08 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q12 | alternativas a, b, c, d (correta: b) | correta 175 car. × maior distrator 81; razão correta/média 2.57 | 112 × 115; razão 1.10 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q13 | alternativas a, b, c, d (correta: d) | correta 93 car. × maior distrator 53; razão correta/média 1.92 | 75 × 74; razão 1.04 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-19-q14 | alternativas b (correta: a) | correta 80 car. × maior distrator 68; razão correta/média 1.28 | 80 × 88; razão 1.16 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q01 | alternativas a, c, d (correta: b) | correta 57 car. × maior distrator 34; razão correta/média 2.38 | 57 × 59; razão 1.01 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q02 | alternativas a, b, c, d (correta: d) | correta 80 car. × maior distrator 46; razão correta/média 2.18 | 64 × 69; razão 0.95 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q05 | alternativas b, c, d, e (correta: e) | correta 94 car. × maior distrator 72; razão correta/média 1.61 | 71 × 72; razão 1.06 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q06 | alternativas a, b, c, d (correta: b) | correta 83 car. × maior distrator 33; razão correta/média 2.52 | 68 × 70; razão 1.01 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q07 | alternativas a, b, c, d (correta: c) | correta 76 car. × maior distrator 48; razão correta/média 1.81 | 72 × 72; razão 1.15 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q08 | alternativas a, b, c, d (correta: d) | correta 101 car. × maior distrator 83; razão correta/média 2.15 | 78 × 78; razão 1.11 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q09 | alternativas a, b, d (correta: a) | correta 145 car. × maior distrator 87; razão correta/média 1.81 | 106 × 110; razão 1.10 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q12 | alternativas a, b, c, d (correta: d) | correta 95 car. × maior distrator 47; razão correta/média 2.44 | 71 × 77; razão 0.98 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q13 | alternativas a, b, c, d (correta: a) | correta 99 car. × maior distrator 73; razão correta/média 1.50 | 90 × 88; razão 1.12 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |
| emb-20-q14 | alternativas a, b, c (correta: a) | correta 97 car. × maior distrator 58; razão correta/média 1.93 | 69 × 80; razão 0.99 | pista de comprimento (correta visivelmente mais longa/completa) | importante | protocolo e pedido da tarefa; gabarito e ids mantidos |

## 3. Pontos para o revisor humano

1. **Terminologia DDS (confirmar com o Cristiano).** O tópico adota "distúrbios/diferenças do desenvolvimento sexual (DDS)": a forma dupla da SBP somada à expressão "desenvolvimento sexual" da Resolução CFM nº 2.455/2026.
   - O documento da SBP de 2026 expande a sigla como "Distúrbios/Diferenças **da Diferenciação do Sexo**". Se a preferência for seguir a SBP ao pé da letra, basta trocar a expansão em quatro lugares (objetivos, resumo, título e descrição de `dds-nomenclatura`).
   - Não consegui abrir o texto integral do documento: `www.sbp.com.br` não está liberado na rede da sessão. A conferência foi feita por resumos e citações do documento na busca.
   - A mesma limitação vale para a orientação inicial diante de genitália atípica (não atribuir sexo na sala de parto, investigar HAC), também conferida por resumo.
2. **Gonadectomia na insensibilidade completa aos andrógenos.**
   - Há consenso em adiar a cirurgia para depois da puberdade e em decidir de forma compartilhada.
   - Manter as gônadas a longo prazo continua controverso.
   - Vale a leitura de um endocrinologista pediátrico.
3. **Ácido fólico.**
   - A FEBRASGO (2020) recomenda 0,4 mg/dia no risco habitual e 4 mg/dia no alto risco.
   - Materiais do Ministério da Saúde citam 4–5 mg no alto risco, e o comprimido disponível costuma ser de 5 mg.
   - O texto oficial vigente do Ministério da Saúde (Caderno de Atenção Básica nº 32, ou documento mais recente) não foi aberto. Confirmar se o app deve citar os 5 mg.
   - Também confirmar se a recomendação do Programa Nacional de Suplementação de Ferro (ácido fólico com ferro durante toda a gestação) deve aparecer.
4. **Mielomeningocele.** Os detalhes da conduta pós-natal vêm da prática neurocirúrgica pediátrica corrente, sem diretriz brasileira conferida nesta sessão:
   - curativo estéril úmido e fechamento em 48–72 h;
   - DVP ou terceiroventriculostomia;
   - cateterismo intermitente limpo.
5. **Cone medular ao nascer.** As questões seguem Moore (L2–L3); a imagem neonatal mostra o RN a termo em geral em L1–L2. A ordem da q22 é a mesma nos dois casos. Decidir se o app deve trocar o valor.
6. **Catarata congênita e teste do olhinho.**
   - A janela cirúrgica varia entre as fontes: unilateral em 4–6 semanas; bilateral entre 6–8 e 10 semanas.
   - O calendário de repetição do teste também diverge entre os documentos.
   - O guia de triagem ocular neonatal do Ministério da Saúde está em revisão (consulta pública de 2026). Conferir a versão vigente antes de publicar.
7. **Linha do tempo.**
   - Aceitar ou não as posições compartilhadas: emb-16 (próstata e rins na região lombar) e emb-18 (crescimento desproporcional da coluna e desconexão de Rathke).
   - Aceitar ou não a manutenção da ordem Sertoli antes de Leydig no emb-17. A justificativa (DHH) está na q20 e nas notas.
8. **Fontanela anterior.** O tópico usa "por volta de 18 meses", como Sadler e Moore. Séries clínicas costumam relatar fechamento mediano por volta de 13–14 meses, com ampla variação (de poucos meses a cerca de 2 anos); esses dados não foram conferidos nesta sessão. A q18 (falso: "nas primeiras semanas") continua inequívoca. Não alterei o texto.
9. **Pendências da 1ª etapa que continuam abertas:**
   - término da nefrogênese: idade gestacional ou pós-fertilização? (item 2);
   - origem do trígono e da uretra glandar (item 3);
   - janelas críticas da rubéola, idade de fusão dos arcos vertebrais e fim da ossificação vertebral (item 8);
   - limitação das obras-base (item 10).
   Sobre a polidactilia (item 4), confirmo do ponto de vista clínico que a redação atual está correta; a leitura de um geneticista ainda é bem-vinda.
10. **Limitações desta revisão.**
    - As obras-base (Moore, Sadler, Larsen, Carlson) não estavam disponíveis em texto.
    - O WebFetch foi bloqueado pela rede da sessão para `www.sbp.com.br` e `www.neonatologia.com.br`, e a busca web devolve resumos e trechos. Nos pontos em que só houve fonte secundária, isso está indicado acima.
    - Para liberar a leitura direta dos documentos da SBP numa próxima revisão, `www.sbp.com.br` precisa ser permitido nas configurações de rede da sessão.

## 4. Evidência de validação

```
$ npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > estágios 3D > todo modelo registrado tem estágio no conteúdo
 AssertionError: coracao-tubular: expected false to be true
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 28 passed (29)
```

A única falha não vem do G4. Ela resulta de trabalho paralelo ainda em andamento no repositório: `src/modules/embriologia/modelos/index.ts` (modificado) registra os modelos novos `coracao-tubular`, `coracao-alca` e `aparelho-faringeo`, e `content/embriologia/estagios.json` (também modificado, fora do G4) ainda não tem esses estágios. Não mexi nesses arquivos. Todos os testes de conteúdo dos tópicos passam.

Checagens próprias, feitas por script nos cinco arquivos:

| Checagem | Resultado |
|---|---|
| Gabaritos e ids em relação ao `HEAD` | idênticos |
| Letras dos distratores citadas nas explicações | nenhuma ausente |
| `revisao.humano` | `null` |
| `revisao.agentes` | 2 registros (etapa 1 + esta) |
| Letra correta mais frequente por tópico | no máximo 29% (sem necessidade de redistribuir) |
| Correta como alternativa mais longa | 50/72 → 16/72, sempre por ≤ 5 caracteres |

## 5. Fontes consultadas na web (além das obras-base citadas nos tópicos)

- SBP, "Abordagem da criança que nasce com genitália atípica: orientações para o pediatra" (fev/2026): https://www.sbp.com.br/abordagem-da-crianca-que-nasce-com-genitalia-atipica-orientacoes-para-o-pediatra/
- Resolução CFM nº 2.455/2026: https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2455_2026.pdf e https://portal.cfm.org.br/noticias/cfm-publica-norma-com-diretrizes-para-diagnostico-e-tratamento-de-disturbios-do-desenvolvimento-sexual/
- Revista de Pediatria SOPERJ (DDS, consenso de Chicago): https://revistadepediatriasoperj.org.br/rps/article/download/202/301/574
- FEBRASGO, Prevenção dos defeitos abertos do tubo neural (2ª ed., 2020): https://www.febrasgo.org.br/media/k2/attachments/Serie-DTN-2a-ed-web.pdf
- Portaria GM/MS nº 2.829/2012 (citada em resolução estadual): https://saude.campinas.sp.gov.br/legislacao/cidadania_saude/anteriores/E_R-SS-122_211113.pdf. SBP, guia de HAC e triagem neonatal: https://www.sbp.com.br/fileadmin/user_upload/22106c-GPA_-_Hiperplasia_Adrenal_Congenita-TriagemNeonatal.pdf
- Gonadectomia na CAIS: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6480640/ e https://www.pubmed.gov/26428189/
- Orquidopexia (idade): https://www.frontiersin.org/articles/10.3389/fendo.2024.1327957. AUA: https://www.auanet.org/documents/Guidelines/PDF/clinical-guidance/translated-guidelines/Evaluaci%C3%B3n%20y%20Tratamiento%20de%20la%20Criptorquidia.pdf
- Cone medular neonatal: https://fn.bmj.com/content/77/1/F67.abstract, https://researchinformation.umcutrecht.nl/en/publications/sonographic-determination-of-the-position-of-the-conus-medullaris/, https://pmc.ncbi.nlm.nih.gov/articles/PMC6280053
- Ponseti: https://pmc.ncbi.nlm.nih.gov/articles/PMC6135620
- DDQ: https://scielo.br/j/rbort/a/bMbLB6VHKnGMZD9RzWjnN9B/?lang=en e https://www.msdmanuals.com/pt/profissional/pediatria/anormalidades-musculoesqueléticas-congênitas/displasia-do-desenvolvimento-do-quadril
- Catarata congênita: https://repositorio.unesp.br/server/api/core/bitstreams/a69ba01c-5545-4b7c-891d-8f746dceee50/content, https://bd-login.tjmg.jus.br/jspui/bitstream/tjmg/5712/3/NT%20148%20-%202014%20NATS%20Catarata%20cong%c3%aanita.pdf, https://www.msdmanuals.com/pt/profissional/pediatria/anomalias-e-disfun%C3%A7%C3%B5es-oculares-em-crian%C3%A7as/catarata-cong%C3%AAnita
- Teste do reflexo vermelho (Ministério da Saúde): https://periodicos.ufes.br/rbps/article/download/15742/10889/43643. Consulta pública de 2026: https://www.gov.br/saude/pt-br/acesso-a-informacao/participacao-social/consultas-publicas/2026/revisao-e-atualizacao-do-guia-para-realizacao-da-triagem-ocular-neonatal-ton-e-seguimento-assistencial/caderno-da-consulta-publica
- Triagem auditiva neonatal: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-pessoa-com-deficiencia/publicacoes/diretrizes-de-atencao-da-triagem-auditiva-neonatal.pdf e https://educapes.capes.gov.br/bitstream/capes/743048/2/F%c3%b4lder%20Triagem%20Auditiva%20Neonatal.pdf
- Hipospádia (etiologia): https://pmc.ncbi.nlm.nih.gov/articles/PMC1240480 e https://ijpeonline.biomedcentral.com/track/pdf/10.1186/1687-9856-2014-20
- Ensaio TRUST (septo uterino): protocolo em https://pmc.ncbi.nlm.nih.gov/articles/PMC6173848; resultados em Hum Reprod 2021;36:1260–7
