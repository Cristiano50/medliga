# Revisão HAV2 — histologia, camada avançada dos tópicos 6 a 10

- Agente: `revisor-histologia-avancado-v1` (1ª etapa, área-mãe histologia)
- Data: 2026-11-10
- Protocolo: `docs/protocolo-revisao-agentes.md`, incluindo a 3ª verificação de fonte primária, feita pelo mesmo revisor. Fontes lidas com `curl` (gov.br, E-utilities, Europe PMC). WebFetch não foi usado.
- Formato: `docs/conteudo-schema.md`, seção Histologia. Obras-base: Junqueira & Carneiro 14ª ed. e Ross & Pawlina 8ª ed. Os livros impressos não foram consultados nesta sessão.
- Escopo: somente a **camada avançada**, isto é, as 25 questões com a tag `"avancado"` e as entradas novas em `referencias` e `incertezas`:

  | Tópico | Questões avançadas |
  |---|---|
  | `his-06-cartilagem.json` | q27–q31 |
  | `his-07-osso.json` | q28–q32 |
  | `his-08-sangue-hematopoese.json` | q29–q33 |
  | `his-09-muscular.json` | q28–q32 |
  | `his-10-nervoso.json` | q27–q31 |

  O conteúdo anterior, que já passou por duas etapas, não foi alterado.
- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica, e `revisao.humano` continua `null` nos cinco arquivos.
  - Nenhum id foi alterado.
  - Nenhum gabarito (`correta`) foi alterado.
  - Nenhuma alternativa foi reordenada.
  - Foram editados só os cinco arquivos acima e este relatório.
- Pista do redator: `fontes-conferidas.md`, em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/av-his0610/`. Conferi de novo os pontos críticos, baixando eu mesmo as fontes para `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hav2/dl/`.

## 1. Resumo

**Não encontrei gabarito errado nem fato errado no enunciado ou nas alternativas.** Os cinco cenários experimentais têm previsão única e coerente com o mecanismo descrito nos tópicos. Além disso, cada um coincide com o resultado real de estudos primários (seção 4). As correções são de precisão nas explicações, de realismo numa vinheta e de referências.

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-06 Cartilagem | 5 (3 multipla, 1 vf, 1 associar) | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| his-07 Osso | 5 (3 multipla, 1 associar, 1 ordenar) | 0 | 1 | 1 | 2 | aprovado-com-correcoes |
| his-08 Sangue e hematopoese | 5 (3 multipla, 1 associar, 1 vf) | 0 | 1 | 3 | 4 | aprovado-com-correcoes |
| his-09 Muscular | 5 (3 multipla, 1 associar, 1 vf) | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| his-10 Nervoso | 5 (3 multipla, 1 associar, 1 vf) | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **2** | **11** | **13** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão ou referência.

Checagens feitas por script em todas as 15 questões de múltipla escolha da camada:
- ids das alternativas `a, b, c, d`, na ordem;
- a explicação cita as quatro letras;
- não há pista de comprimento: a alternativa mais longa é a correta em só 1 das 15 questões (his-10-q27, empatada com o distrator espelhado);
- letras corretas: his-06 b/d/c, his-07 c/a/d, his-08 d/b/c, his-09 d/b/a, his-10 a/c/b. Nenhum tópico passa de 28% numa letra, então não houve redistribuição;
- dificuldade 4–5 em todas as 25 questões; Bloom `analisar` ou `aplicar`, adequado a cada uma.

### Pontos de atenção pedidos: conferência um a um

| Ponto | Resultado |
|---|---|
| Cenários experimentais (his-06 q27/q28, his-07 q28, his-09 q28, his-10 q28) | **Previsão única e correta em todos.** Os resultados reais coincidem com cada cenário. **his-06-q27:** FGFR3 ativado reduz a proliferação e a diferenciação (Naski 1998; Li 1999), e a hipofosfatemia alarga a zona hipertrófica por falta de apoptose (Sabbagh 2005). **his-06-q28:** extrair os proteoglicanos não altera a resistência intrínseca à tração (Schmidt 1990). **his-07-q28:** sem RANKL, não há osteoclastos (Kong 1999); sem OPG, há osteoporose precoce (Bucay 1998). **his-09-q28:** a fibra desmembranada em rigor relaxa com ATP e Ca²⁺ < 10⁻⁸ M (Goldman 1984). **his-10-q28:** segue Seddon e o tópico. Fiz duas correções de precisão: a explicação de his-06-q27 e uma frase sobre osteoartrite em his-06-q28. |
| his-07-q28: RANKL × OPG × transplante | **Gabarito correto; explicação corrigida (importante).** Os pacientes com osteopetrose por deficiência de RANKL foram transplantados com enxerto hematopoético **completo** e não tiveram melhora óssea (Lo Iacono 2013, texto integral; Sobacchi 2007). A explicação, porém, dizia que o transplante "não repõe o fator", e linfócitos também expressam RANKL. Agora ela diz "sobretudo da linhagem mesenquimal" e cita a evidência humana. Em camundongos, RANKL transgênico em linfócitos corrigiu parcialmente a osteopetrose (Kim 2000); isso ficou registrado como ponto para o revisor humano. |
| his-08-q29: ferro + B12, VCM normal, RDW alto | **Correto.** O VCM é uma média, micro e macrócitos se compensam, e o RDW e o esfregaço revelam a mistura. O distrator (a) é coerente com o PCDT 4.2 (anemia ferropriva inicialmente normocítica) e é refutado pelos macro-ovalócitos e pelos neutrófilos hipersegmentados. |
| his-09-q29: hipertermia maligna × rigidez cadavérica | **Correto.** A diretriz JSA 2025 foi relida no texto integral: liberação de Ca²⁺ acelerada além da recaptação, contração sustentada, ATP consumido pela contração e pela SERCA, calor e CO₂, dantroleno agindo no RYR1. A rigidez da hipertermia maligna é contração com consumo de ATP; a rigidez cadavérica é falta de ATP. A vinheta ficou mais realista: succinilcolina em intubação de urgência, porque a bula restringe o uso pediátrico. |
| his-10-q27: forma desmielinizante × NAMA; "sem lentificação importante" | **Correto.** O PCDT 3.2 e 6 foi relido no texto integral, e a vinheta do paciente 2 (sem bloqueio nem lentificação importante) mostra o padrão axonal típico. A NAMA pode ter bloqueio ou lentificação **transitórios**, sem dispersão temporal (falha de condução reversível; Zhai 2026, texto integral). Isso foi acrescentado à explicação para o aluno não generalizar. A dispersão temporal do paciente 1 mantém o padrão desmielinizante. |
| his-10-q31: regeneração do nervo óptico | **Correto (falso).** O nervo óptico é um trato do SNC, com mielina de oligodendrócitos e sem células de Schwann. A explicação é coerente com o resumo do his-10 (inibidores na mielina, cicatriz glial). Não houve mudança. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| his-06-q27 | explicacao | no raquitismo, "os condrócitos hipertróficos não são removidos" | "com o fosfato baixo, deixam de entrar em apoptose no ritmo normal e se acumulam" | **menor**: mecanismo preciso do alargamento da zona hipertrófica | Sabbagh et al., PNAS 2005 (PMID 15976027, resumo); PCDT Raquitismo 2022, 1 ("redução das concentrações de fósforo… causa fisiopatogênica das alterações… na placa") |
| his-06-q28 | explicacao | "a perda de proteoglicanos é… **a primeira** alteração… na osteoartrite" | "**uma das alterações iniciais**" | **menor**: afirmação absoluta, não sustentada | correlação do próprio tópico (perda de proteoglicanos, aumento da água, fibrilação…) |
| his-07-q28 | explicacao | "como o RANKL vem de células de linhagem mesenquimal, um transplante… **não repõe o fator**" | "no osso, o RANKL vem **sobretudo** de células de linhagem mesenquimal; por isso não se espera que o transplante corrija… pacientes transplantados, mesmo com enxerto completo, não tiveram melhora óssea" | **importante**: linfócitos (hematopoéticos) também expressam RANKL; a explicação ensinava um fato incompleto como absoluto | Lo Iacono et al., Clin Dev Immunol 2013 (PMC3671266, texto integral); Sobacchi et al., Nat Genet 2007 (resumo) |
| his-07-q28 | referencia; `referencias` | Wu et al., JCEM 2017 | Sobacchi 2007 e Lo Iacono 2013, acrescentados às referências | **menor**: o texto integral de Wu 2017 não está aberto, e o resumo não trata de RANKL | idem |
| his-08-q33 | explicacao | "a hemoglobina sobe mais devagar, **ao longo de uma a duas semanas**" | "começa a subir mais devagar, em uma a duas semanas, e só se normaliza em seis a oito semanas" | **importante**: o texto sugeria recuperação da hemoglobina em 1–2 semanas | PCDT Anemia por deficiência de ferro (Portaria SAS/MS nº 1.247/2014), 8.6 |
| his-08 | `referencias` (PCDT ferro) | "hemoglobina sobe em uma a duas semanas" | "aumenta lentamente em uma a duas semanas, sobe 2 g/dL em três semanas e normaliza em seis a oito semanas" | **menor**: trecho completo do item 8.6 | idem |
| his-08-q31 | explicacao | "não se espera o hemograma alterar para investigar" | "não se deve esperar que o hemograma se altere para investigar" | **menor**: redação | — |
| his-08-q32 | pares (esquerda) | "Aumento de bastonetes" | "Aumento de neutrófilos bastonetes" | **menor**: o mesmo exercício tem "Bastonetes de Auer"; evita a pegadinha de redação | — |
| his-09-q29 | contexto | criança "anestesiada com sevoflurano para uma cirurgia ortopédica" recebe succinilcolina | "com fratura exposta vai a cirurgia de urgência: é intubado em sequência rápida com succinilcolina, e a anestesia é mantida com sevoflurano" | **menor**: realismo; a bula americana tem advertência em destaque que restringe o uso pediátrico (hipercalemia em miopatias não diagnosticadas). Gabarito e desencadeantes inalterados | Gupta e Zestos, Ann Card Anaesth 2025 (PMC11902349, texto integral); bula (host recusado) |
| his-09-q30 | explicacao | "Pelas recomendações de 2018, o diagnóstico das **distrofinopatias** começa pelo teste genético" | "Nas recomendações de 2018 **para a distrofia de Duchenne**, o teste genético é o primeiro exame confirmatório… o mesmo raciocínio vale neste caso" | **menor**: Birnkrant 2018 trata da distrofia de Duchenne; a aplicação à de Becker é extrapolação | Birnkrant et al., Lancet Neurol 2018 (PMC5869704, texto integral) |
| his-09-q31 | enunciado | "…ponto da transmissão neuromuscular ou do acoplamento excitação-contração…" | "…da transmissão neuromuscular, do acoplamento excitação-contração ou do ciclo das pontes cruzadas…" | **menor**: a rigidez cadavérica (um dos pares) não é transmissão nem acoplamento | resumo do his-09 |
| his-10-q27 | explicacao | só o padrão clássico | + "No início, a NAMA pode até mostrar bloqueio ou lentificação transitórios, por falha de condução nos nós de Ranvier, mas sem a dispersão temporal da desmielinização; sem bloqueio, o paciente 2 tem o padrão axonal típico." | **menor**: evitar a generalização "forma axonal nunca tem bloqueio"; o gabarito não muda | Zhai et al., Front Neurol 2026 (PMC13013526, texto integral) |
| his-10-q27 | referencia; `referencias` | PCDT SGB; Junqueira; Robbins | + Zhai et al. 2026 | **menor**: fonte da frase acrescentada | idem |

Registros administrativos, que não contam como correção:
- nas incertezas do redator, o trecho "ainda sem revisão da área nem transversal" passou a "revisada pela área em 10/11/2026… ainda sem revisão transversal";
- uma entrada nova "Revisão de histologia da camada avançada" em `incertezas` de cada tópico;
- uma entrada `revisor-histologia-avancado-v1` acrescentada ao fim de `revisao.agentes` de cada tópico. As anteriores foram mantidas.

## 3. Questões conferidas sem correção (resumo do raciocínio)

**his-06**
- **q29.** O tecido de reparo após a microfratura, com feixes de colágeno I, condrócitos em fileiras e matriz basófila só perilacunar, é fibrocartilagem vinda da medula subcondral. Isso é coerente com a correlação "lesão condral" do tópico.
- **q30** (F). A abóbada craniana é intramembranosa. O FGFR3 ativado inibe os condrócitos, e a frase "contribui para a macrocefalia" está bem dosada. Li 1999 descreve macrocefalia no modelo murino.
- **q31.** Seis pares sem ambiguidade.

**his-07**
- **q29.** Faixas de osteoide largas e bandas de tetraciclina mais próximas. Relido o PCDT 3.4: "diminuição da distância entre as bandas de tetraciclina e o aumento relevante do osteoide"; a biópsia fica para casos "nos quais não há correlação clínico-laboratorial". Os sinais clínicos do item 3.1 (dor na pelve e nos membros inferiores, fraqueza proximal, fraturas com trauma mínimo) conferem.
- **q30.** Hematopoese extramedular no fígado na osteopetrose infantil.
- **q31.** Os pares são inequívocos. "Por estímulo hormonal" separa o hiperparatireoidismo da pós-menopausa.
- **q32.** A ordem osteoclastogênese → túnel → linha cimentante → osteoide → mineralização e osteócitos é inequívoca; a lamela mais interna é a mais jovem.

**his-08**
- **q30.** Assincronia núcleo-citoplasma megaloblástica.
- **q31.** Na deficiência de B12, a lesão neurológica pode ocorrer sem anemia. Obeid 2024, no texto integral: "Macrocytic anemia is not related to the presence or absence of neurological symptoms or their severity". Cohen 2026, no texto integral: manifestações "may be irreversible, including… peripheral neuropathy, subacute combined degeneration".
- **q33.** É verdadeira (PCDT 8.6); foi corrigida só a explicação.

**his-09**
- **q28.** O gabarito (d) coincide com Goldman 1984. O breve aumento transitório de tensão antes do relaxamento não é cobrado.
- **q30.** Distrofia de Becker.
- **q32** (F). Birnkrant 2018, no texto integral: "dystrophin gene deletion and duplication testing is usually the first confirmatory test… if genetic testing does not confirm… muscle biopsy".

**his-10**
- **q28.** No esmagamento (axonotmese), há degeneração walleriana e regeneração pelas colunas de células de Schwann. Na secção com cotos afastados (neurotmese sem reparo), o coto distal fica sem axônios e forma-se um neuroma proximal.
- **q29.** Na forma progressiva secundária, a perda axonal acumulada explica a incapacidade.
- **q30.** Pares corretos. A aquaporina-4 está nos pés vasculares dos astrócitos, e o anti-GM1/GD1 atinge o axolema.

## 4. Fontes conferidas (URL/DOI/PMID e trecho decisivo)

| Fonte | Acesso | Trecho decisivo | Usada em |
|---|---|---|---|
| PCDT Raquitismo e Osteomalácia, Portaria Conjunta nº 2/2022 | gov.br `/assuntos/pcdt/r/raquitismo-e-osteomalacia` (PDF), texto integral | 1: "O raquitismo resulta da deficiência de mineralização da placa de crescimento"; "redução das concentrações de fósforo… causa fisiopatogênica das alterações observadas na placa". 3.1: "dor óssea… mais pronunciada na coluna lombar, pelve e extremidades inferiores… fraqueza muscular caracteristicamente é proximal". 3.4: "diminuição da distância entre as bandas de tetraciclina e o aumento relevante do osteoide… reservado para os casos… nos quais não há correlação clínico-laboratorial" | his-06-q27, his-07-q29 |
| PCDT Anemia por deficiência de ferro, Portaria SAS/MS nº 1.247/2014 | gov.br `/assuntos/pcdt/a/anemia-deficiencia-de-ferro` (PDF), texto integral | 4.2: "Inicialmente aparece anemia… normocítica… Com a continuação… hipocrômica… e microcitose… surgem a anisocitose". 8.6: "Uma reticulocitose discreta pode ser vista nos primeiros dias do tratamento, e a Hb aumenta lentamente em uma a duas semanas, chegando a um aumento de 2 g/dL em três semanas… normalizar em seis a oito semanas" | his-08-q29, his-08-q33 |
| PCDT Síndrome de Guillain-Barré, Portaria Conjunta nº 15/2020 | gov.br `/assuntos/pcdt/s/sindrome-de-guillain-barre` (PDF), texto integral | 3.2: formas desmielinizantes com "velocidades de condução motora reduzidas, prolongamento das latências motoras distais… bloqueio da condução… com dispersão temporal… ondas F prolongadas"; "formas… axonal… diminuição das amplitudes". 6 (NAMA): "sintomas sensitivos estão ausentes… Anticorpos anti-GM1 e anti-GD1… Campylobacter jejuni" | his-10-q27, his-10-q30 |
| Zhai Q et al. Front Neurol 2026;17:1766901. doi:10.3389/fneur.2026.1766901; PMID 41890796 | PMC13013526, texto integral | "AMAN patients may experience transient conduction block or conduction slowing, simulating demyelination… but without abnormal temporal dispersion… (Reversible conduction failure)"; "serial NCS enhance subtype classification accuracy" | his-10-q27 |
| Leonhard SE et al. Nat Rev Neurol 2019 | PMC6821638, texto integral | Reclassificação de AIDP/AMAN em estudos repetidos é controversa; não detalha a velocidade na NAMA | his-10-q27 (contexto) |
| Tsutsumi YM et al. (JSA). J Anesth 2026;40(1):4-12. doi:10.1007/s00540-025-03647-y; PMID 41504952 | PMC12860801, texto integral | "triggered by volatile inhalational anesthetics and/or… suxamethonium"; "CICR rate is abnormally accelerated, surpassing the rate of Ca²⁺ reuptake"; "sustained pathological muscle contractions, resulting in excessive ATP consumption… energy-dependent uptake of Ca²⁺ into the SR further increases ATP demand… heat… CO₂"; "Dantrolene acts on… RYR1"; "masseter" | his-09-q29, his-09-q31 |
| Gupta D, Zestos MM. Ann Card Anaesth 2025; PMID 39774142 | PMC11902349, texto integral | "boxed warning for succinylcholine, precluding its use, especially among pediatric patients aged 8 years or less due to the risk of cardiac dysrhythmias and arrest secondary to hyperkalemic rhabdomyolysis in patients with undiagnosed skeletal myopathies" | his-09-q29 (vinheta) |
| Birnkrant DJ et al. Lancet Neurol 2018;17(3):251-67 | PMC5869704 (efetch db=pmc), texto integral | "approximately 70%… deletion or duplication… dystrophin gene deletion and duplication testing is usually the first confirmatory test"; "if genetic testing does not confirm a clinical diagnosis of DMD, then a muscle biopsy… immunohistochemistry… or western blot" | his-09-q30, his-09-q32 |
| Obeid R et al. J Clin Med 2024;13(8):2176; PMID 38673453 | PMC11050313, texto integral | "Macrocytic anemia is not related to the presence or absence of neurological symptoms or their severity"; sintomas "may become irreversible" | his-08-q31 |
| Cohen RV et al. EClinicalMedicine 2026;100:104205; PMID 42830915 | PMC13634271, texto integral | "Clinical manifestations are heterogeneous and may be irreversible, including megaloblastic anaemia, peripheral neuropathy, subacute combined degeneration of the spinal cord" | his-08-q31 |
| Lo Iacono N et al. Clin Dev Immunol 2013:412768. doi:10.1155/2013/412768; PMID 23762088 | PMC3671266, texto integral | "the RANKL-dependent ARO does not gain any benefit from this approach, because the genetic defect is not intrinsic to the hematopoietic osteoclast lineage but rather to the mesenchymal one"; "full engraftment… but again there was no benefit on bone architecture"; "RANKL is broadly expressed… T and B lymphocytes… In the bone, it is produced mainly by cells of mesenchymal origin"; "only partially rescued by transgenic overexpression under a lymphocyte-specific promoter" | his-07-q28 |
| Sobacchi C et al. Nat Genet 2007;39(8):960-2; PMID 17632511 | resumo (PubMed) | "biopsy specimens lacked osteoclasts… could not be cured by hematopoietic stem cell transplantation" | his-07-q28 |
| Kong YY et al. Nature 1999; PMID 9950424 | resumo | "severe osteopetrosis… completely lack osteoclasts as a result of an inability of osteoblasts to support osteoclastogenesis" | his-07-q28 |
| Bucay N et al. Genes Dev 1998; PMID 9573043 | resumo | OPG−/−: "decrease in total bone density… severe trabecular and cortical bone porosity… high incidence of fractures" | his-07-q28 |
| Kim N et al. PNAS 2000; PMID 10984520 | resumo | RANKL transgênico em linfócitos "rescued osteoclast development in two locations"; placa e metáfise não corrigidas | his-07-q28 (ponto humano) |
| Wu CC et al. JCEM 2017; PMID 28655174 | resumo (texto integral não aberto) | O resumo não trata de RANKL nem de transplante por forma genética | his-07-q28 (referência substituída) |
| Naski MC et al. Development 1998; PMID 9811582 | resumo | FGFR3 ativado na cartilagem: "markedly inhibiting chondrocyte proliferation and… slowing chondrocyte differentiation" | his-06-q27 |
| Li C et al. Hum Mol Genet 1999; PMID 9887329 | resumo | "dramatically reduced proliferation… macrocephaly… fewer maturing and hypertrophic chondrocytes" | his-06-q27, his-06-q30 |
| Sabbagh Y et al. PNAS 2005; PMID 15976027 | resumo | "expansion of the late hypertrophic chondrocyte layer, characteristic of rickets, is secondary to impaired apoptosis"; "normal phosphorus levels are required for growth plate maturation" | his-06-q27 |
| Schmidt MB et al. J Orthop Res 1990; PMID 2324854 | resumo | "essentially complete extraction of proteoglycan glycosaminoglycans does not affect the intrinsic tensile stiffness and strength" | his-06-q28 |
| Goldman YE et al. J Physiol 1984;354:577-604; PMID 6481645 | resumo | fibras desmembranadas em rigor, com Ca²⁺ livre < 10⁻⁸ M, relaxam após a liberação de ATP | his-09-q28 |

Os estudos lidos só no resumo não foram acrescentados às `referencias`, com exceção de Sobacchi 2007, que vai acompanhado de Lo Iacono 2013 (texto integral). Eles foram registrados em `incertezas`.

Hosts recusados pelo proxy:
- `dailymed.nlm.nih.gov` e `www.accessdata.fda.gov` (bula da succinilcolina);
- `europepmc.org` (PDF);
- o PDF do PMC exige verificação anti-robô.

## 5. Pontos para o revisor humano

1. **his-07-q28 (transplante na falta de RANKL):** a previsão "não corrigiria" apoia-se nos pacientes, que tiveram enxerto completo sem melhora óssea. Em camundongos, RANKL transgênico superexpresso em linfócitos corrigiu parcialmente a cavidade medular e a diáfise (Kim 2000). Não se localizou estudo de transplante de medula em camundongos sem RANKL. A redação "sobretudo da linhagem mesenquimal" e a alternativa (c) parecem seguras; o revisor humano pode preferir trocar o enunciado de "transplante de medula de um animal normal" por "transplante de células hematopoéticas, como nos pacientes".
2. **his-09-q29 (bula da succinilcolina):** a advertência em destaque foi conferida só por fonte secundária (Gupta e Zestos 2025). A bula não pôde ser aberta. Não se conferiu que ela reserva o uso pediátrico para a intubação de urgência; confirmar e, se preferir, voltar à vinheta eletiva.
3. **his-10-q27 (critérios eletrofisiológicos):** os critérios de Hadden, Rajabally e outros classificam parte dos casos de modo diferente, e o PCDT não menciona a falha de condução reversível. A vinheta foi escrita para ser inequívoca (paciente 2 sem bloqueio; paciente 1 com dispersão temporal).
4. **his-08-q31 ("só a B12 causa lesão neurológica"):** é a formulação clássica, já adotada no tópico. Relatos isolados de neuropatia por deficiência de folato não foram pesquisados.
5. **his-09-q30 / q32:** Birnkrant 2018 é recomendação para a distrofia de Duchenne. A explicação de q30 agora atribui a recomendação à distrofia de Duchenne e só estende o raciocínio ao caso de Becker. O termo "distrofina truncada" para Becker foi mantido, como na correlação já revisada; a proteína é, na verdade, encurtada por deleção interna.
6. **Livros-base:** Junqueira 14ª ed. e Ross 8ª ed. não foram consultados no impresso. Ficam pendentes:
   - capítulos e redação sobre a placa epifisária na acondroplasia e no raquitismo;
   - linha cimentante e preenchimento do ósteon;
   - fibras desmembranadas;
   - nervo óptico como trato do SNC.
7. **Diretrizes não abertas:**
   - EMHG/BJA (hipertermia maligna), host recusado;
   - BSH 2014 e NICE NG239 (B12), host recusado;
   - EAN/PNS 2023 (Guillain-Barré), sem texto aberto;
   - Munns 2016 (raquitismo), a API devolveu só o resumo;
   - Wu 2017 (osteopetrose), sem texto aberto.
8. **his-10 `referencias`:** o PCDT da síndrome de Guillain-Barré aparece em duas entradas, uma das seções 4 e 7 (anterior) e outra das seções 3.2 e 6 (camada avançada). Não as fundi, porque a entrada anterior está fora do escopo. Fundir, se preferir.

## 6. Validação

`cd /home/user/medgame && npm run validar-conteudo && npx vitest run` (10/11/2026, depois das edições):

- `validar-conteudo`: **OK**: "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441."
- `vitest`: **68 de 70 testes passaram; 2 falharam, ambos fora destes arquivos e de trabalhos de outros agentes:**
  1. `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`. Falha em `aorta`: existe desenho sem lâmina nos dados. É o mesmo tipo de falha prevista para `esofago`, causada pelo agente que desenha lâminas.
  2. `tests/zz-debug.test.tsx > quebra`. É um arquivo de depuração de geometria 3D criado às 10:31 por outro agente.

  Os testes de conteúdo que cobrem estes tópicos passaram, entre eles "alternativas com ids em ordem a, b, c… (a letra exibida é a citada na explicação)".
