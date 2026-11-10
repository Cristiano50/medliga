# Revisão HS17–18 — nefrologia/endocrinologia (2ª etapa: sistema urinário e glândulas endócrinas)

- Agente: `revisor-nefro-endo-v1` (2ª etapa, revisor transversal clínico: nefrologia, endocrinologia e patologia), com a 3ª verificação (fonte primária no texto integral) feita na mesma passagem.
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`. Fontes lidas com `curl` pelo Bash; WebFetch não foi usado. Formato: `docs/conteudo-schema.md`. Ponto de partida: o relatório da 1ª etapa (`content/revisoes/hs1718-histologia.md`).
- Arquivos editados:
  - `content/histologia/topicos/his-17-urinario.json`;
  - `content/histologia/topicos/his-18-endocrino.json`;
  - este relatório.

  Mais nada no repositório foi alterado. `laminas-sistemas-c.json` e `src/modules/histologia/laminas/sistemas-c.tsx` só foram lidos. Nenhum commit foi feito.
- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica, e `revisao.humano` continua `null` nos dois arquivos.
- O que não mudou (conferido por script contra cópias anteriores às edições):
  - ids de questões, estruturas, eventos e correlações;
  - `correta`, `ordemCorreta`, `itens`, `pares`;
  - os textos de todas as alternativas.

## 1. Resumo

Revisei integralmente os dois tópicos, com 56 questões (28 em cada), olhando sobretudo a aplicação clínica:
- nefrologia: biópsia renal, síndromes nefrótica e nefrítica, lesões mínimas × GESF, NTA, nefropatia diabética, antinefrina;
- endocrinologia: prolactinoma e efeito gancho, Graves × Hashimoto, bócio, carcinoma papilífero × NIFTP, carcinoma medular, PitNET, Cushing, feocromocitoma, insuficiência adrenal, hiperparatireoidismo.

**Nenhum fato estava errado e nenhum gabarito estava errado.** Os problemas encontrados foram outros:
- duas omissões ou vinhetas que ensinavam uma conduta contrária ao PCDT da Hiperprolactinemia (efeito gancho);
- um número clínico que não pôde ser conferido no texto integral (doses do teste de dexametasona);
- lacunas do material de estudo em relação ao que as questões cobram (carcinoma medular, hiperparatireoidismo);
- precisões de fidelidade aos PCDTs.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-17 Sistema urinário | 28 | 0 | 0 | 5 | 5 | aprovado-com-correcoes |
| his-18 Glândulas endócrinas | 28 | 0 | 2 | 10 | 12 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **2** | **15** | **17** | |

Gravidade:
- **crítica**: fato ou gabarito errado;
- **importante**: ambiguidade, distrator defensável, explicação incorreta ou enganosa, vinheta com conduta contrária à diretriz;
- **menor**: redação, terminologia, precisão, lacuna do material, referência.

### Checagens por script, depois das edições

- Gabaritos e alternativas são idênticos aos de antes, e os ids também.
- Em todas as 30 questões de múltipla escolha, a explicação cita a letra de cada alternativa.
- A distribuição de letras não mudou (a4/b4/c4/d3 nos dois tópicos), e nenhuma letra passa de 27%.
- Nas vinhetas, as alternativas não foram tocadas, então não surgiu pista de comprimento.
- O resumo do his-18 passou de 808 para 857 palavras. O do his-17 não foi editado e continua com 910, um pouco acima das 900 sugeridas, como já estava.

## 2. Conferência de fonte primária (texto integral)

| Fonte | Como foi lida | Resultado e trecho decisivo |
|---|---|---|
| **PCDT da Síndrome Nefrótica Primária em crianças e adolescentes** (Portaria Conjunta SAES/SCTIE nº 87, de 15/10/2026) | `curl` em `https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sindrome-nefrotica-primaria-em-criancas-e-adolescentes`, que entrega o PDF de 89 p.; texto com `pdftotext` | **Confirmado.** Quadro 1: "Proteinúria acima de 1.000 mg/m² por dia… ou índice… ≥ 2 g/g… Albumina sérica menor que 3,0 g/dL". Biópsia: "Em geral, a biópsia renal não é realizada… pode ser indicada para pacientes acima de 12 anos, com SNCR ou com possibilidade de causa secundária". "foi demonstrada a presença de anticorpos antinefrina em pacientes com SNCS". "A SNLM é a forma mais comum em crianças com diagnóstico inicial acima de 1 ano, com frequência que varia de 70 a 90%". 6.2.2: "remissão da proteinúria em cerca de 85% dos pacientes". |
| **PCDT da Síndrome Nefrótica Primária em Adultos** (Portaria Conjunta nº 8, de 14/04/2020) | `curl` em `https://www.gov.br/saude/pt-br/assuntos/pcdt/s/sindrome-nefrotica-primaria-em-adultos`, PDF de 222 p. | **Confirmado.** Introdução: "proteinúria (>3,0-3,5 g/1,73m2/dia em adultos), hipoalbuminemia (<3,0 g/dl)"; série brasileira com GESF 24,6% e GNM 20,7%. 5.1.2: "o exame histopatológico define o plano terapêutico, auxilia a definição do diagnóstico etiológico". **Novo nesta etapa**, para lesões mínimas × GESF: no 6.3.1.1, AGM com "proteinúria seletiva e que, em geral, não é acompanhada de hematúria e nem de hipertensão arterial"; no 6.3.2.1, GESF com "proteinúria não seletiva e que, em geral, pode acompanhar-se de algum grau de hematúria microscópica e de hipertensão arterial". |
| **KDIGO 2021 — Glomerular Diseases** (Kidney Int 2021;100(4S):S1–S276) | `curl` em `https://kdigo.org/wp-content/uploads/2024/05/KDIGO-2021-Glomerular-Diseases-Guideline_English_2024-Chapter-Updates.pdf` (kdigo.org liberado), `pdftotext` | **Lido.** Cap. 5, Practice Point 5.1.1: "MCD in adults can be diagnosed only with a kidney biopsy… Immunofluorescence microscopy is negative or shows low-intensity staining for C3 and/or IgM. Electron microscopy demonstrates extensive foot process effacement but no electron-dense deposits… One caveat is that early FSGS lesions may be missed if the biopsy sample is small." Cap. 6: "We define primary FSGS as… FSGS lesions, electron microscopy… demonstrates diffuse foot process effacement, and clinically the patients display NS". Cap. 7: "postinfectious glomerulonephritis after a latent period, often several weeks after an infection", o que sustenta a faringite de 3 semanas da his-17-q10. |
| **KDIGO 2025 — Nephrotic Syndrome in Children** (Kidney Int 2025;107(5S):S241–S289) | `curl` em `https://kdigo.org/wp-content/uploads/2025/04/KDIGO-2025-Guideline-for-Nephrotic-Syndrome-in-Children.pdf` | **Lido.** Seção 1.4: "Recent studies highlighting the presence of anti-slit diaphragm antibodies on biopsy and anti-nephrin autoantibodies in circulation may lead to the development of future biomarkers". Pesquisa: "Evaluate anti-nephrin and anti-slit diaphragm antibodies as biomarkers". Conclusão: a antinefrina ainda não é exame de rotina. |
| Hengel et al., N Engl J Med 2024;391:422-33 (PMID 38804512) | Resumo pelo E-utilities; não há texto integral aberto (o NEJM não está no PMC) | Resumo: "IgG localization to the podocyte slit diaphragm" no camundongo imunizado; anticorpos em 44% dos adultos com lesões mínimas, 9% na GESF primária e 52% das crianças. **Só a afirmação qualitativa** (ligação ao diafragma no modelo animal) entrou no texto. Watts 2022 (PMC8763186): o `efetch` responde "The publisher of this article does not allow downloading of the full text in XML form". |
| **PCDT da Hiperprolactinemia** (Portaria Conjunta nº 19, de 23/11/2020) | `curl` em `https://www.gov.br/saude/pt-br/assuntos/pcdt/h/hiperprolactinemia`, PDF de 17 p. | **Confirmado.** Item 1: "Representam aproximadamente 40% dos adenomas hipofisários"; micro "menos de 10 mm", macro "10 mm ou mais"; compressão de haste com prolactina "geralmente inferiores a 100 ng/mL". **Item 3.3:** "O efeito gancho caracteriza-se pela leitura de valores pouco elevados da prolactina e deve ser considerado em todos os casos de macroadenomas da hipófise com 3 cm ou mais associados a níveis de prolactina ≤ 200 ng/mL. Para excluí-lo, deve-se solicitar dosagem da prolactina em soro diluído… Nestes últimos [pseudoprolactinomas], o nível de prolactina após diluição será semelhante ao pré-diluição, enquanto que nos macroprolactinomas… com efeito gancho… valores extremamente altos". 7.1: "agonistas dopaminérgicos constituem a primeira opção"; a cabergolina é "de primeira escolha para a maioria". 7.2: "Até 10% dos pacientes com macroprolactinoma podem requerer cirurgia, caso não ocorra resposta aos agonistas… ou… se o comprometimento visual não melhorar". |
| **PCDT da Insuficiência Adrenal** (Portaria Conjunta nº 20, de 24/11/2020) | `curl` em `https://www.gov.br/saude/pt-br/assuntos/pcdt/i/insuficiencia-adrenal`, PDF de 16 p. | **Confirmado.** Item 1: "Nos Estados Unidos e na Europa, a adrenalite autoimune é responsável por cerca de 70% a 90%"; "a autoimunidade tornou-se a principal causa de IAP em países desenvolvidos"; São Paulo: 39/28/11/7,3%. 3.1: hiperpigmentação "por elevação da proopiomelanocortina… ACTH e… MSH"; "**Hiponatremia pode ocorrer na IAP e IAC, mas hipercalemia só ocorre na IAP**". "o uso prolongado de corticoide é a causa mais comum de IA". 6.1: fludrocortisona na IAP. 6.2: "ausência de necessidade da reposição mineralocorticoide" na IAC. **6.3: "Pacientes instáveis devem ser imediatamente tratados com glicocorticoide intravenoso (succinato sódico de hidrocortisona)… mesmo antes de testes de confirmação".** |
| **Casey e Lussey-Lepoutre 2026** (Endocr Relat Cancer 33(10); PMC13695349) | `fullTextXML` do Europe PMC (CC BY) | **Confirmado.** "up to 40% of cases being driven by germline mutations". "Since the 2017 WHO classification, the terms 'benign' and 'malignant' have been abandoned for PPGLs. The current 2022 WHO classification advises that all PPGLs should be considered malignant neoplasms with variable metastatic potential." "preference for plasma-free metanephrines". PASS com "considerable interobserver variation". O conteúdo estava correto e não foi alterado. |
| **Endocrine Society 2008, Cushing** (Nieman et al., PMC2386281) | Várias tentativas: Europe PMC (`isOpenAccess: N`; `fullTextXML` com HTTP 500); OAI do PMC ("cannotDisseminateFormat"); BioC ("No result"); página do PMC (reCAPTCHA); `academic.oup.com` ("CONNECT tunnel failed, response 403") | **Texto integral não aberto.** Como foi pedido, as doses do teste de dexametasona ("1 mg à noite ou 2 mg/dia por 48 horas") saíram da correlação, que ficou qualitativa: excluir o glicocorticoide exógeno e começar por um teste de alta acurácia. |
| SBEM 2014, carcinoma medular (Maia et al., Arq Bras Endocrinol Metab 58(7):667-700, PMID 25372577) | Resumo pelo E-utilities. O texto integral no SciELO **não abriu**: `www.scielo.br` devolve HTTP 403 com a página de desafio "Establishing a secure connection", tanto no HTML quanto no PDF | Resumo: "originates in the thyroid parafollicular cells"; "Approximately 25% of these cases are hereditary due to activating mutations in the… RET proto-oncogene"; "associations with pheochromocytoma and hyperparathyroidism"; "serum calcitonin measurements… useful for diagnostic confirmation". O texto novo é **qualitativo**: diz "parte dos casos é hereditária", sem os 25%. |
| SBEM 2013 (nódulos e câncer diferenciado; hipertireoidismo) | Resumos pelo E-utilities; SciELO com o mesmo bloqueio | Não sustentam afirmação nova. As afirmações sobre Graves e Hashimoto do conteúdo vêm de Robbins e são qualitativas. |
| ATA 2015, nódulos (PMC4739132), e ATA 2015, carcinoma medular (PMC4490627) | `efetch db=pmc`: "The publisher of this article does not allow downloading of the full text in XML form"; `thyroid.org`, `liebertpub.com` e `europepmc.org` sem conexão (proxy) | Continua o que a 1ª etapa registrou: as afirmações da ATA no conteúdo são qualitativas e conferidas só no resumo e em citações secundárias. |
| OMS 2022, tireoide (Baloch et al., Endocr Pathol 2022;33:27-63, PMID 35288841) | Resumo pelo E-utilities | "Low-risk follicular cell-derived neoplasms include… NIFTP"; "the term thyroid follicular nodular disease (FND)… to describe… multinodular goiter"; "The term 'Hürthle cell' is discouraged"; "Medullary thyroid carcinomas derived from thyroid C cells". Entrou numa nota de terminologia, sem mudar o texto do aluno. |
| OMS 2022, hipófise (Asa et al., PMID 35291028) | Resumo pelo E-utilities | "pituitary neuroendocrine tumors (PitNETs; formerly known as pituitary adenomas)"; "The routine use of immunohistochemistry for pituitary transcription factors (PIT1, TPIT, SF1…) is endorsed". |

## 3. Foco clínico: conferência ponto a ponto

| Ponto | Onde | Resultado |
|---|---|---|
| Síndrome nefrótica × nefrítica e biópsia (MO, IF, ME) | his-17: correlações, q09, q10, q27 | **Correto.** Os padrões de IF (linear, granular, mesangial), os depósitos (corcovas, espículas) e os métodos (PAS, prata, tricrômico) estão certos. Os limiares estão fiéis aos PCDTs nº 87/2026 e nº 8/2020 e continuam fora das questões. |
| Lesões mínimas × GESF | his-17: correlação síndrome nefrótica, q09 | **Precisado (menor).** O texto não dizia que a GESF primária também tem apagamento difuso dos pedicelos nem que uma biópsia pequena pode não mostrar a esclerose, que é a ressalva da KDIGO 2021 (PP 5.1.1). Acrescentei isso e o contraste clínico do PCDT do adulto. Na q09 o gabarito (b) continua o único defensável: o achado esperado é o mesmo nas duas doenças. |
| Necrose tubular aguda | his-17: correlação, q11 | **Correto.** Os segmentos vulneráveis (porção reta do TCP e ramo ascendente espesso), os cilindros castanhos com uromodulina, a membrana basal preservada (com tubulorrexe focal na forma isquêmica) e a fase poliúrica estão certos. A vinheta (choque em cirurgia de aorta) é realista. |
| Nefropatia diabética | his-17: correlação, q12, q21 | **Correto.** O espessamento da MBG precede os outros achados; vêm depois a expansão mesangial e os nódulos de Kimmelstiel-Wilson. A hialinose eferente já tinha apoio secundário na 1ª etapa. O vermelho-congo negativo na q12 afasta bem o amiloide. |
| Anticorpos antinefrina | his-17: correlação síndrome nefrótica | **Correto e precisado (menor).** A afirmação bate com o PCDT nº 87/2026, lido no texto integral. Acrescentei que, no modelo animal, os anticorpos se ligam ao diafragma da fenda (Hengel 2024, resumo) e que ainda são biomarcadores em avaliação (KDIGO 2025, texto integral). |
| Prolactinoma e efeito gancho | his-18: correlação tumores hipofisários, q03 | **Duas correções importantes.** (1) A correlação ensinava só a regra "compressão da haste → prolactina < 100 ng/mL", sem a ressalva do item 3.3. Quem lesse só o resumo trataria um macroprolactinoma volumoso como pseudoprolactinoma. (2) Na vinheta da q03, um macroadenoma de 3 cm com prolactina < 100 ng/mL ia para a cirurgia sem a dosagem em soro diluído, e a explicação dizia que "a peça já resolveu a dúvida". O PCDT manda diluir antes, e um macroprolactinoma seria tratado primeiro com agonista (7.1 e 7.2). A dosagem diluída, sem mudança no valor, passou a fazer parte da vinheta, e o gabarito (d) ficou mais firme. Isso resolve o ponto 4 deixado pela 1ª etapa ao revisor humano: a vinheta continua com 3 cm. |
| Graves × Hashimoto | his-18: correlações, q06, q07, q28 | **Correto.** A histologia (epitélio alto com coloide recortado × infiltrado com centros germinativos e oncócitos), os anticorpos (TRAb × anti-TPO) e o risco de linfoma de zona marginal estão certos. Os distratores são plausíveis e claramente errados. |
| Bócio | his-18: correlação, q08(c) | **Correto.** Acrescentei uma nota de terminologia: a OMS 2022 usa "doença nodular folicular" (menor). |
| Carcinoma papilífero × NIFTP | his-18: correlação, q08, q09, notas | **Correto** (ajustado na 1ª etapa). A vinheta da q08 traz papilas e metástase linfonodal, o que afasta a NIFTP. |
| Carcinoma medular e calcitonina | his-18: q08(b), q09(c), q28 | **Fatos corretos, mas o tema não estava no material de estudo**, embora três questões o usem. Acrescentei uma frase à correlação do carcinoma papilífero, em contraste com o folicular: células C, estroma amiloide, calcitonina sérica, RET/NEM2. Também entrou no resumo e nos objetivos. O texto é coerente com o emb-25 (`carcinoma-medular-tireoide`) (menor). |
| PitNET × adenoma | his-18: correlação tumores hipofisários, notas | **Correto.** O termo PitNET e as linhagens PIT1/TPIT/SF1 passaram da nota para o texto do aluno; o conteúdo continua usando "adenoma", como o PCDT (menor). |
| Cushing (Endocrine Society 2008) | his-18: correlação, q13 | Clínica e histologia corretas: atrofia das zonas fasciculada e reticular com glomerulosa preservada no Cushing ACTH-independente, e alteração de Crooke. **As doses saíram** porque o texto integral não abriu (menor). A q13 já era qualitativa ("dexametasona em dose baixa"). |
| Feocromocitoma (revisão de 2026) | his-18: correlação, q14, q28, notas | **Correto e conferido no texto integral.** Os textos dizem "até cerca de 40%" para a causa hereditária, não usam "benigno/maligno" e dão preferência às metanefrinas livres plasmáticas. Nada alterado. |
| Insuficiência adrenal (PCDT nº 20/2020) | his-18: correlação, q15, q20 | **Correto.** O texto já dizia "hidrocortisona intravenosa imediatamente, mesmo antes dos testes de confirmação" e que a hiperpotassemia só ocorre na forma primária, ambos conferidos no item 6.3 e no 3.1. Precisei a epidemiologia ("Estados Unidos e Europa", como no PCDT) e acrescentei que a hiponatremia pode ocorrer também na forma central (3.1) (menores). |
| Hiperparatireoidismo | his-18: q11, q10; his-07 | **Correto.** A q11 (hiperplasia das quatro glândulas na doença renal crônica) e o distrator do adenoma estão certos. O hiperparatireoidismo não aparecia no resumo do his-18; entrou uma frase sobre o primário × secundário, coerente com o his-07 (menor). |

## 4. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| **his-17** / `sindrome-nefrotica` | mecanismo | Lesões mínimas: "IF negativa e apagamento difuso"; GESF: "esclerose de parte do tufo em parte dos glomérulos" | IF "negativa (no máximo, coloração fraca de IgM ou C3)", sem depósitos; GESF primária também com apagamento difuso; biópsia pequena pode não conter glomérulos esclerosados e parecer lesões mínimas; contraste clínico (proteinúria seletiva sem hematúria nem HAS × não seletiva, que pode vir com hematúria microscópica e HAS) | Armadilha diagnóstica central de lesões mínimas × GESF que faltava no texto | menor | KDIGO 2021, PP 5.1.1 e cap. 6; PCDT nº 8/2020, 6.3.1.1 e 6.3.2.1 |
| his-17 / `sindrome-nefrotica` | mecanismo (antinefrina) | "descritos recentemente na DLM e na SNI da criança, em geral corticossensível" | + "no modelo animal, ligam-se ao diafragma da fenda e reproduzem a doença, e ainda estão em avaliação como biomarcadores (KDIGO 2025)" | Ligar o achado à histologia e deixar claro que não é exame de rotina | menor | Hengel 2024 (resumo); KDIGO 2025, 1.4 |
| his-17-q09 | explicacao; referencia | Explicava só as lesões mínimas | + "O mesmo apagamento difuso ocorre na GESF primária, cujas lesões focais podem faltar numa amostra pequena; a ausência de hematúria e de hipertensão favorece as lesões mínimas, e o achado esperado… é o mesmo"; referência + PCDT 6.3 e KDIGO caps. 5 e 6 | Evita ensinar que apagamento difuso = lesões mínimas. Gabarito (b) mantido | menor | KDIGO 2021; PCDT nº 8/2020 |
| his-17 / referencias | — | — | + KDIGO 2021 (Glomerular Diseases, caps. 5–7) e KDIGO 2025 (SN na criança) | Fontes lidas no texto integral que sustentam o texto novo | menor | kdigo.org |
| his-17 / incertezas | — | — | + registro do que foi lido nesta etapa e do que não abriu (Watts 2022, Hengel 2024) | Registro honesto da leitura | menor | seção 2 |
| **his-18** / `tumores-hipofisarios` | mecanismo | Só "qualquer massa selar que comprima a haste… eleva moderadamente a prolactina (< 100 ng/mL)" | + "O inverso também engana: num macroprolactinoma volumoso, o efeito gancho… pode dar leitura apenas pouco elevada; por isso o PCDT manda dosar a prolactina em soro diluído em todo macroadenoma de 3 cm ou mais com prolactina ≤ 200 ng/mL — no macroprolactinoma com efeito gancho, o valor diluído fica muito alto; na compressão da haste, não muda" | Sem a ressalva, o texto leva a classificar um macroprolactinoma como pseudoprolactinoma | **importante** | PCDT nº 19/2020, item 3.3 |
| **his-18-q03** | contexto; explicacao; referencia | Macroadenoma de 3 cm, prolactina < 100 ng/mL, operado; "aqui, a peça já resolveu a dúvida" | Vinheta: "…e não muda quando dosada em soro diluído". Explicação: o PCDT manda diluir; um macroprolactinoma seria tratado primeiro com agonista dopaminérgico, e a cirurgia fica para falta de resposta ou de melhora visual; o valor diluído não mudou, como na compressão da haste. Referência: itens 1, 3.3, 7.1 e 7.2 | A vinheta mostrava conduta contrária ao PCDT (operar sem afastar o efeito gancho). Gabarito (d) e alternativas mantidos | **importante** | PCDT nº 19/2020, 3.3, 7.1 e 7.2 |
| his-18 / `tumores-hipofisarios` | mecanismo | "a imuno-histoquímica identifica o hormônio e a linhagem" | + "(na classificação da OMS de 2022, esses tumores se chamam tumores neuroendócrinos hipofisários, PitNET, e são classificados pelos fatores de transcrição PIT1, TPIT e SF1)" | Terminologia atual também no texto do aluno, e não só na nota | menor | Asa et al. 2022 (resumo) |
| his-18 / `sindrome-de-cushing` | descricao | "…supressão com dexametasona em dose baixa (1 mg à noite ou 2 mg/dia por 48 horas)" | "…como o cortisol livre urinário, o cortisol salivar no fim da noite ou o teste de supressão com dexametasona em dose baixa" | Doses sem texto integral lido; redação qualitativa, como foi pedido | menor | PMC2386281 (só resumo) |
| his-18 / `insuficiencia-suprarrenal` | descricao | "Em países desenvolvidos, a adrenalite autoimune causa cerca de 70–90%" | "Nos Estados Unidos e na Europa…" | Fidelidade ao PCDT | menor | PCDT nº 20/2020, item 1 |
| his-18 / `insuficiencia-suprarrenal` | descricao | Central: "falta o cortisol, mas não há hiperpotassemia nem hiperpigmentação" | "falta o cortisol e pode haver hiponatremia, mas não há hiperpotassemia nem hiperpigmentação" | O PCDT diz que a hiponatremia ocorre nas duas formas. Evita o erro comum de achar que a hiponatremia é exclusiva da forma primária | menor | PCDT nº 20/2020, 3.1 |
| his-18 / `carcinoma-papilifero-tireoide` | mecanismo | Sem carcinoma medular | + "Já o carcinoma medular não deriva do tirócito, e sim das células C: … estroma amiloide derivado da calcitonina, e secreta calcitonina, cuja dosagem sérica ajuda no diagnóstico; parte dos casos é hereditária, por mutação germinativa ativadora de RET (NEM 2…)" | q08(b), q09(c) e q28 cobram o carcinoma medular, que não estava no material de estudo | menor | SBEM 2014 (resumo); Robbins 10ª ed.; Baloch 2022 (resumo); emb-25 |
| his-18 / resumo (paratireoides) | resumo | Sem hiperparatireoidismo | + primário ("em geral por adenoma de uma só glândula… hipercalcemia") × secundário ("comum na doença renal crônica… retenção de fosfato, falta de calcitriol e hipocalcemia… as quatro glândulas… hiperplásicas") | A q11 cobra o tema. Coerente com o his-07 | menor | Robbins 10ª ed.; his-07 |
| his-18 / resumo (Correlações) + objetivos[6] | resumo; objetivos | Listas sem carcinoma medular e sem hiperparatireoidismo | Acrescentados | Coerência entre objetivos, resumo e questões | menor | — |
| his-18 / notasDivergencia | nova nota | — | "Doença nodular folicular da tireoide" (OMS 2022) × "bócio" (mantido) | Terminologia | menor | Baloch 2022 (resumo) |
| his-18 / referencias | PCDT da Hiperprolactinemia (capítulo); novas | Capítulos 1 e 7.1 | + 3.3 (efeito gancho) e 7.2 (cirurgia); + SBEM 2014 (carcinoma medular) e Baloch 2022 (OMS, tireoide) | Citar o que sustenta o texto | menor | seção 2 |
| his-18 / incertezas | Cushing; nova entrada | Cushing: só a 1ª etapa | + tentativa desta etapa e retirada das doses; nova entrada sobre os PCDTs relidos, o SciELO bloqueado e a ATA sobre carcinoma medular fechada | Registro honesto da leitura | menor | seção 2 |

## 5. Ids: tópico × lâminas

Releitura feita em 10/11/2026, perto das 11h. `laminas-sistemas-c.json` continua com `{"laminas": []}`; li os ids em `src/modules/histologia/laminas/sistemas-c.tsx`.

- **`rim-cortex`: alinhada.** `PARTES_RIM` usa `espaco-urinario`, `glomerulo`, `capsula-glomerular`, `tubulo-contorcido-proximal`, `tubulo-contorcido-distal`, `macula-densa`, `arteriola-aferente`, `arteriola-eferente` e `capilar`. Todos existem no his-17, exceto `capilar`, que é canônico e definido em cada lâmina.
- **`tireoide`: divergência persiste.** `PARTES_TIREOIDE` usa `celula-parafolicular`; o his-18 e o emb-25 usam `celulas-parafoliculares`. `tirocito`, `coloide` e `capilar` coincidem. `septo-conjuntivo` é canônico.
- **`adrenal`: divergência persiste.** `PARTES_ADRENAL` usa `medula-adrenal`; o his-18 e o emb-25 usam `medula-suprarrenal`. As três zonas e `capilar` coincidem; `capsula` e `veia-central` existem só na lâmina.

Não alterei os ids do tópico. Eles estão corretos, seguem a Terminologia Anatômica em português e são os mesmos do emb-25. Mudá-los quebraria a coerência entre disciplinas. Quem precisa ser alinhado ao tópico é o desenho da lâmina.

## 6. Pontos para o revisor humano

1. **his-18-q03 (efeito gancho).** Confirmar a solução: a vinheta ficou com 3 cm e agora inclui a dosagem em soro diluído, sem mudança no valor. Se o professor preferir uma vinheta sem esse passo, a alternativa é reduzir o tumor para menos de 3 cm.
2. **Cushing.** Ler o PDF de Nieman 2008 (provavelmente a recomendação 3.1) e decidir se as doses do teste de dexametasona voltam ao texto ("1 mg à noite; 2 mg/dia por 48 h"). Até lá, a redação fica qualitativa.
3. **Carcinoma medular.** O resumo da SBEM 2014 traz "aproximadamente 25%" de casos hereditários, número que não entrou porque o texto integral, no SciELO, não abriu. Conferir no PDF:
   - se o professor quer o número;
   - a frase "estroma amiloide derivado da calcitonina" (Robbins, de memória).
4. **Hiperparatireoidismo.** A frase sobre o primário × secundário segue Robbins e o his-07, sem números. Se houver interesse em diretriz brasileira, as candidatas são a declaração da SBEM sobre hiperparatireoidismo primário e as diretrizes da SBN para distúrbio mineral e ósseo na DRC (J Bras Nefrol 2021). Nesta rede, só o prefácio desta última abriu no Europe PMC (PMC8823912).
5. **Ids das lâminas `tireoide` e `adrenal`.** Ver a seção 5. Decidir com o desenhista; a sugestão é alinhar a lâmina ao tópico.
6. **Feocromocitoma.** O texto do aluno diz "potencial metastático variável" sem a palavra "malignas", que só aparece na nota (OMS 2022: "malignant neoplasms with variable metastatic potential"). Isso foi feito de propósito, para não confundir com a dicotomia abandonada. O professor decide se quer a palavra no texto.
7. **Alport, não conferido.** O conteúdo diz que a forma ligada ao X é a mais comum, como Robbins. A classificação genética proposta em 2018 trata os heterozigotos de COL4A3/COL4A4 como forma autossômica dominante, e com ela essa proporção vem sendo discutida. Não li a fonte, por isso não alterei. Vale a opinião do nefrologista.
8. **Rede.** O `www.scielo.br`, liberado na seção H de `docs/pendencias-conferencia-medica.md`, hoje responde com um desafio anti-robô (HTTP 403), inclusive para PDFs. Isso impede a leitura dos consensos da SBEM e de outras diretrizes publicadas no SciELO. `thyroid.org`, `liebertpub.com` e `academic.oup.com` não conectam. Vale atualizar a seção H.
9. **Selo.** Os dois tópicos têm agora as revisões de histologia e de nefrologia/endocrinologia, ambas feitas por IA. Até a conferência médica, devem aparecer com "Revisado por IA · conferência médica pendente".

## 7. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441.

$ npx vitest run
 FAIL  tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina
AssertionError: pulmao: expected false to be true // Object.is equality
 Test Files  1 failed | 8 passed (9)
      Tests  1 failed | 83 passed (84)
```

A única falha é a mesma da 1ª etapa: o desenho `pulmao` existe em `sistemas-c.tsx`, mas `laminas-sistemas-c.json` continua vazio. É trabalho em andamento de outro agente e não tem relação com os dois tópicos.

Também conferi por script, contra as cópias anteriores às edições:
- ids e gabaritos iguais;
- textos das alternativas iguais;
- `revisao.humano` = `null`;
- exatamente uma entrada nova em `revisao.agentes` em cada arquivo, com `area: "nefrologia/endocrinologia"`, `agente: "revisor-nefro-endo-v1"`, `data: "2026-11-10"` e `veredito: "aprovado-com-correcoes"`.

Nenhum commit foi feito.
