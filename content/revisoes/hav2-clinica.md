# Revisão HAV2: clínica, camada avançada dos tópicos 6 a 10 de histologia

- Agente: `revisor-clinica-avancado-v1`. Área: clínica, hematologia, neurologia e ortopedia/anestesiologia. É a 2ª etapa, a revisão transversal.
- Data: 2026-11-10.
- Protocolo: `docs/protocolo-revisao-agentes.md`. A 3ª verificação, de fonte primária no texto integral, foi feita pelo próprio revisor.
- Método de acesso:
  - as fontes foram baixadas com `curl` para `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-hav2-cli/dl/`;
  - foram usados gov.br (PDF), E-utilities do NCBI (`efetch db=pmc` para textos do PMC fora do subconjunto aberto) e a API REST do Europe PMC;
  - WebFetch não foi usado.
- Formato: `docs/conteudo-schema.md`.
- Relatório da 1ª etapa: `content/revisoes/hav2-histologia.md`.
- Escopo: só a **camada avançada**, isto é, as 25 questões com a tag `"avancado"` e as entradas novas:

  | Tópico | Questões |
  |---|---|
  | `his-06-cartilagem.json` | q27–q31 |
  | `his-07-osso.json` | q28–q32 |
  | `his-08-sangue-hematopoese.json` | q29–q33 |
  | `his-09-muscular.json` | q28–q32 |
  | `his-10-nervoso.json` | q27–q31 |

- Situação: **revisão por agente (IA)**. Ela não substitui a conferência médica, e `revisao.humano` continua `null` nos cinco arquivos.
  - Nenhum id foi alterado.
  - Nenhuma letra correta (`correta`) foi alterada.
  - Nenhuma alternativa foi reordenada.
  - Foram editados só os cinco arquivos e este relatório.

## 1. Resumo

**Não há gabarito errado nem fato clínico errado nas alternativas corretas.** Corrigi duas coisas importantes:

- **his-07-q28.** "Transplante de medula óssea" deixava a alternativa correta contestável, porque a medula contém estroma mesenquimal produtor de RANKL. Passou a "transplante de células hematopoéticas", como nos pacientes. Essa era a sugestão da 1ª etapa, e ela foi aceita.
- **his-08-q31.** A explicação afirmava que "só a deficiência de B12" causa lesão neurológica e que a de folato "não" a causa. Isso foi atenuado para "tipicamente" e "só raramente", porque a degeneração combinada subaguda por folato existe, embora rara.

As demais correções são de vinheta, de conduta na explicação e de referências conferidas no texto integral.

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| his-06 Cartilagem | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| his-07 Osso | 5 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| his-08 Sangue e hematopoese | 5 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| his-09 Muscular | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| his-10 Nervoso | 5 | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **2** | **9** | **11** | |

Gravidade:
- **crítica**: fato ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, realismo ou referência.

Checagens por script nas 15 questões de múltipla escolha, depois das edições (`audit.py` no scratchpad):
- ids das alternativas `a–d`, na ordem;
- a explicação cita as quatro letras;
- dificuldade 4–5 e Bloom `aplicar` ou `analisar` em todas as 25 questões;
- a alternativa mais longa é a correta em 2 das 15 questões. Uma é his-10-q27, empatada com o distrator espelhado. A outra é his-07-q28: depois da troca de termo, (c) tem 156 caracteres, contra 154 de (b) e 153 de (a). A diferença não serve de pista.

### Focos clínicos pedidos: conferência ponto a ponto

| Foco | Questão | Resultado |
|---|---|---|
| Acondroplasia × raquitismo | his-06-q27, q30, q31 | **Correto.** O PCDT de Raquitismo e Osteomalácia de 2022 foi lido no texto integral. Seção 1: deficiência de mineralização da placa, com a redução do fósforo como causa das alterações da placa. Seção 3.3: desorganização da placa. Ornitz e Legeai-Mallet 2017, no texto integral: o FGFR3 ativado suprime a proliferação e a maturação dos condrócitos e reduz a placa. A referência foi acrescentada (menor). Na q30, a frase "contribui para a macrocefalia" fica para o revisor humano; o gabarito (falso) não depende dela. |
| Osteoartrite | his-06-q28, q31 | **Correto.** Del Río 2025, no texto integral: "early loss of proteoglycans and incipient collagen fibrillation". A redação "uma das alterações iniciais" (1ª etapa) confere. Sem mudança. |
| Microfratura | his-06-q29, q31 | **Correto e realista.** Muthu et al. 2024, no texto integral: a perfuração da placa subcondral forma um coágulo com progenitores da medula, que origina fibrocartilagem com colágeno tipo I, mecanicamente inferior; a cartilagem é avascular e tem reparo limitado. A referência foi acrescentada (menor). |
| Osteopetrose e transplante de células hematopoéticas | his-07-q28, q30, q31 | **q28: importante.** A sugestão da 1ª etapa foi avaliada e **aceita**. O contexto e as alternativas (b) e (c) passaram de "transplante de medula óssea" a "transplante de células hematopoéticas… como o que se faz nos pacientes". Lo Iacono 2013, no texto integral, lista as **células do estroma da medula** entre as fontes de RANKL no osso; com "medula", um aluno bem informado poderia defender que o enxerto traz RANKL. A explicação ganhou a diretriz EBMT/ESID 2026, conferida no texto integral, que manda excluir o subtipo RANKL antes de indicar o transplante. **q30:** a hematopoese extramedular confere com Chemtob 2026, no texto integral; a referência foi acrescentada (menor). |
| Osteomalácia × osteoporose (tetraciclina) | his-07-q29 | **Correto.** PCDT 2022, 3.4, no texto integral: "diminuição da distância entre as bandas de tetraciclina e o aumento relevante do osteoide"; biópsia "reservada para os casos… nos quais não há correlação clínico-laboratorial". A vinheta segue o item 3.1: dor em pelve e membros inferiores, fraqueza proximal e fraturas com trauma mínimo. Sem mudança. |
| Hematopoese extramedular | his-07-q30 | **Correto.** Ver a linha da osteopetrose. |
| Anemia mista ferro + B12 (RDW) | his-08-q29 | **Correto.** Takami 2026, no texto integral, tabela 3: VCM normal com RDW alto indica "mixed cell population… combined deficiency (iron + B12/folate)". A mesma linha da tabela inclui a deficiência de ferro inicial, mas o distrator (a) continua refutado pelos macro-ovalócitos e pelos neutrófilos hipersegmentados. A referência foi acrescentada (menor). |
| Mielograma megaloblástico | his-08-q30 | **Correto.** Sem mudança. |
| Neurologia da B12 × folato | his-08-q31 | **Importante (explicação).** A explicação dizia "só a de B12 causa também lesão neurológica" e "a de folato… não essa lesão". Há degeneração combinada subaguda por deficiência isolada de folato, rara: Guntupalli 2023, no texto integral, com revisão dos casos. A explicação passou a "tipicamente" e "só raramente". O gabarito (c) e o distrator (a), "única carência", seguem inequívocos. Fora do escopo: a correlação "Anemia macrocítica" do tópico repete o absoluto (seção 5). |
| Reticulócitos e hemoglobina no tratamento com ferro | his-08-q33 | **Correto (verdadeiro).** PCDT 2014, 8.6, no texto integral: "reticulocitose discreta… nos primeiros dias… a Hb aumenta lentamente em uma a duas semanas… 2 g/dL em três semanas… normalizar em seis a oito semanas". Sem mudança. |
| Hipertermia maligna: dantroleno e desencadeantes | his-09-q29, q31 | **Correto; duas menores.** JSA 2025, no texto integral. Sinais iniciais: CO₂ expirado alto, taquicardia e rigidez do masseter, e "additionally, rapid temperature increases". A vinheta passou a pôr a febre depois desses sinais. Conduta: suspender os desencadeantes, passar à anestesia intravenosa e dar dantroleno intravenoso; a explicação, que só citava o dantroleno, ficou completa. |
| Succinilcolina em criança | his-09-q29 | **Conferida só por fonte secundária.** A bula da ANVISA (`consultas.anvisa.gov.br`) e a americana (`dailymed.nlm.nih.gov`, `api.fda.gov`) não abriram (proxy). A advertência da FDA, reservando o uso pediátrico para "emergency intubation or instances where immediate securing of the airway is necessary, e.g., laryngospasm, difficult airway, full stomach", foi lida citada no texto integral de Klincová 2022. Bohringer 2019, no texto integral, registra as mudanças de redação de 1993. A vinheta (fratura exposta, sequência rápida, estômago cheio) está dentro do uso previsto. Nenhuma diretriz brasileira aberta tratava do tema. |
| Becker × Duchenne | his-09-q30, q32 | **Correto.** Birnkrant 2018, no texto integral (efetch PMC5869704): "deletion and duplication testing is usually the first confirmatory test"; se negativo, "genetic sequencing"; se não confirmar, "muscle biopsy… immunohistochemistry… or western blot". "Distrofina truncada" para Becker é usada na literatura (Sheikh e Yokota 2020, texto integral: "BMD can feature a plethora of truncated dystrophins"). Sem mudança. |
| Guillain-Barré: forma desmielinizante × NAMA | his-10-q27, q30 | **Correto.** PCDT de 2020, relido no texto integral (portaria nº 15). Seção 3.2: formas desmielinizantes com velocidades reduzidas, latências distais prolongadas, bloqueio com dispersão temporal e ondas F prolongadas; formas axonais com amplitudes reduzidas; a ENMG é mais nítida em cerca de 2 semanas. Seção 6: NAMA sem sintomas sensitivos, reflexos podendo ser normais, anti-GM1/GD1 e *C. jejuni*. **EAN/PNS 2023 não acessível**: o Europe PMC não tem o texto, e o PDF aberto da editora vem de `onlinelibrary.wiley.com`, recusado pelo proxy. Sem mudança. |
| Esclerose múltipla progressiva | his-10-q29 | **Correto.** Coclitu 2025, no texto integral: "Axonal loss is the principal unsolved cause of irreversible disability in people with MS"; "incomplete and inefficient remyelination". A referência foi acrescentada (menor); a citada antes (McDonald 2024) trata de diagnóstico. |
| Regeneração nervosa | his-10-q28, q31 | **Correto.** A classificação de Seddon (axonotmese com bainhas preservadas; neurotmese com secção total) confere com Rodríguez-Aceves 2026, no texto integral. A formação de neuroma quando o coto proximal não alcança o distal segue os livros-base. O nervo óptico como trato do SNC (q31) está correto. Sem mudança. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| his-07-q28 | contexto; alternativas (b) e (c) | "efeito de um transplante de **medula óssea** de um animal normal"; "transplante de medula normal (não) corrigiria" | "transplante de **células hematopoéticas** de um animal normal, como o que se faz nos pacientes com osteopetrose"; "transplante de células hematopoéticas (não) corrigiria" | **importante**: a medula inclui estroma mesenquimal, fonte de RANKL, e (c) ficava contestável. Gabarito (c) mantido | Lo Iacono 2013 (PMC3671266, texto integral); Albert 2026, EBMT/ESID (PMC13349871, texto integral) |
| his-07-q28 | explicacao; referencia; `referencias` | evidência só dos pacientes | + "a diretriz europeia de transplante para erros inatos (EBMT/ESID, 2026) trata a deficiência de RANKL como contraindicação, a excluir antes de indicar o transplante" | **menor**: conduta vigente conferida | Albert 2026: "Contraindications in specific subtypes must be excluded: (a) osteoblast defects: RANKL" |
| his-07-q30 | referencia; `referencias` | Robbins, Junqueira, Moore | + Chemtob et al., Front Pediatr 2026 | **menor**: fonte conferida para a hematopoese extramedular | Chemtob 2026 (PMC13381457): "failure of intramedullary haematopoiesis… This leads to extramedullary haematopoiesis and hepatosplenomegaly" |
| his-08-q31 | explicacao | "Das duas, **só a de B12** causa também lesão neurológica"; "folato… mas **não** essa lesão neurológica (a)" | "a de B12 é a que **tipicamente** lesa também o sistema nervoso"; "folato… mas **só raramente** essa lesão neurológica; não é a única carência que a causa, nem a mais provável aqui (a)" | **importante**: afirmação absoluta falsa; há degeneração combinada subaguda por folato | Guntupalli 2023 (PMC10460268, texto integral): "Folate deficiency is a rare cause of subacute combined degeneration" |
| his-08-q31 | referencia; `referencias` | Hoffbrand; Obeid 2024; Cohen 2026 | + Guntupalli et al., Cureus 2023 | **menor**: fonte da correção | idem |
| his-08-q29 | referencia; `referencias` | Junqueira; Hoffbrand; PCDT 4.2 | + Takami A, JMA J 2026 | **menor**: o VCM normal com RDW alto na deficiência combinada agora tem fonte lida | Takami 2026 (PMC13639491), tabela 3 |
| his-09-q29 | contexto | "Minutos depois surgem rigidez do masseter, CO₂…, taquicardia **e elevação rápida da temperatura**" | "…rigidez do masseter, CO₂… e taquicardia; **em seguida, a temperatura sobe rapidamente** e, mais tarde, aparecem…" | **menor**: realismo; na diretriz, a febre vem depois dos sinais iniciais | JSA 2025 (PMC12860801): "The initial signs of MH include… ETCO₂… tachycardia, and… masseter muscle rigidity… Additionally, rapid temperature increases" |
| his-09-q29 | explicacao | "O dantroleno, usado no tratamento, age no próprio receptor de rianodina…" | "No tratamento, suspendem-se os desencadeantes (anestésico volátil e succinilcolina), passando à anestesia intravenosa, e dá-se dantroleno intravenoso, que age…" | **menor**: conduta completa | JSA 2025: "Discontinue the administration of triggering agents… switch to intravenous anesthesia and non-depolarizing muscle relaxants"; "Dantrolene acts on the Ca²⁺ release channels (RYR1)" |
| his-06-q27 | referencia; `referencias` | Junqueira; Robbins; PCDT 2022 | + Ornitz e Legeai-Mallet, Dev Dyn 2017 | **menor**: a placa na acondroplasia agora tem fonte lida (antes só Robbins, de memória) | Ornitz 2017 (PMC5354942 via efetch): "increased FGFR3 signaling profoundly suppresses proliferation and maturation of growth plate chondrocytes resulting in decreased growth plate size" |
| his-06-q29 | referencia; `referencias` | Ross; Junqueira | + Muthu et al., World J Orthop 2024 | **menor**: fonte conferida para a microfratura | Muthu 2024 (PMC10999967): "the vascularized bone marrow can enable the formation of clot rich in chondroprogenitor cells… formation of type I collagen and fibrocartilage" |
| his-10-q29 | referencia; `referencias` | Robbins; Junqueira; McDonald 2024 | + Coclitu et al., Expert Rev Neurother 2025 | **menor**: fonte conferida para a perda axonal na forma progressiva | Coclitu 2025 (PMC12312756) |

Registros administrativos, que não contam como correção:
- em cada tópico, a nota do redator "ainda sem revisão transversal" passou a "revisão transversal clínica em 10/11/2026, ver a última entrada";
- uma entrada nova "Revisão clínica da camada avançada" foi acrescentada em `incertezas`;
- uma entrada `revisor-clinica-avancado-v1`, de área `clinica/hematologia/neurologia/ortopedia`, foi acrescentada ao fim de `revisao.agentes`. As anteriores foram mantidas.

## 3. Questões conferidas sem correção (raciocínio clínico)

- **his-06-q28.** Remover proteoglicanos tira a basofilia, a metacromasia e a resistência à compressão, e a tração fica preservada. A frase sobre osteoartrite confere com Del Río 2025.
- **his-06-q30.** É falso, como está no gabarito. A placa e a base do crânio são endocondrais.
- **his-06-q31.** Os seis pares são inequívocos.
- **his-07-q29.** A vinheta de osteomalácia (mulher de 62 anos, dor pélvica, fraqueza proximal, fraturas por trauma mínimo, fosfatase alcalina alta sem causa definida) indica corretamente a biópsia (PCDT 3.4). Os distratores de osteoporose (b), de mineralização acelerada (c) e de osteíte fibrosa (d) estão bem separados.
- **his-07-q31 e q32.** Os pares e a sequência da remodelação são inequívocos.
- **his-08-q30.** A assincronia núcleo-citoplasma aponta para B12, folato ou fármacos. Na falta de ferro, o citoplasma é que se atrasa.
- **his-08-q32.** Pares corretos. A anemia da doença renal crônica é normocítica, com reticulócitos baixos.
- **his-08-q33.** Ver a seção 1.
- **his-09-q28.** Fibra permeabilizada em rigor relaxa com ATP e Ca²⁺ baixo.
- **his-09-q30.** Rapaz de 16 anos que ainda anda, com início aos 11 anos e distrofina menor e reduzida no western blot: o quadro é de distrofia de Becker. A extrapolação do fluxo de Birnkrant, escrito para a distrofia de Duchenne, já está assinalada na explicação.
- **his-09-q31.** Pares corretos.
- **his-09-q32.** É falso: o teste genético vem antes da biópsia.
- **his-10-q27.** O paciente 1 tem o padrão desmielinizante, com dispersão temporal. O paciente 2 tem o de NAMA: diarreia, quadro só motor, anti-GM1 e amplitudes baixas sem bloqueio.
- **his-10-q28.** Na axonotmese (esmagamento), há degeneração walleriana e regeneração pelas colunas de Schwann. Na neurotmese sem reparo, o coto distal fica sem axônios e forma-se um neuroma proximal.
- **his-10-q29.** O quadro é de esclerose múltipla secundariamente progressiva, explicada pela perda axonal acumulada.
- **his-10-q30.** Os pares são corretos. A aquaporina-4 está nos pés astrocitários, e o anti-GM1 atinge o axolema.
- **his-10-q31.** É falso: o nervo óptico é um trato do SNC.

## 4. Fontes conferidas (texto integral, salvo indicação)

| Fonte | Acesso | Trecho decisivo | Usada em |
|---|---|---|---|
| PCDT Raquitismo e Osteomalácia, Portaria Conjunta SAES/SCTIE nº 2, de 11/01/2022 | `https://www.gov.br/saude/pt-br/assuntos/pcdt/r/raquitismo-e-osteomalacia` (serve o PDF; `pdftotext`) | 1: "redução das concentrações de fósforo… causa fisiopatogênica das alterações observadas na placa de crescimento". 3.1: "dor óssea… coluna lombar, pelve e extremidades inferiores… fraturas com trauma mínimo… fraqueza muscular caracteristicamente é proximal". 3.4: "diminuição da distância entre as bandas de tetraciclina e o aumento relevante do osteoide… reservado para os casos de maior complexidade, nos quais não há correlação clínico-laboratorial" | his-06-q27, his-07-q29 |
| PCDT Anemia por deficiência de ferro, Portaria SAS/MS nº 1.247/2014 | `…/pcdt/a/anemia-deficiencia-de-ferro` (PDF) | 4.2: "Inicialmente aparece anemia… normocítica"; "Com a piora… surgem a anisocitose". 8.6: "reticulocitose discreta pode ser vista nos primeiros dias… a Hb aumenta lentamente em uma a duas semanas, chegando a um aumento de 2 g/dL em três semanas… normalizar em seis a oito semanas" | his-08-q29, q33 |
| PCDT Síndrome de Guillain-Barré, Portaria Conjunta nº 15, de 13/10/2020 | `…/pcdt/s/sindrome-de-guillain-barre` (PDF) | 3.2: "velocidades de condução motora reduzidas, prolongamento das latências motoras distais… bloqueio… com dispersão temporal… ondas F prolongadas. As formas de apresentação axonal… diminuição das amplitudes"; ENMG "mais pronunciadas aproximadamente 2 semanas após". 6 (NAMA): "sintomas sensitivos estão ausentes e os reflexos tendinosos podem ser normais. Anticorpos anti-GM1 e anti-GD1… Campylobacter jejuni" | his-10-q27, q30 |
| Ornitz DM, Legeai-Mallet L. Dev Dyn 2017;246(4):291-309. doi:10.1002/dvdy.24479; PMID 27987249 | PMC5354942 (efetch db=pmc) | "increased FGFR3 signaling profoundly suppresses proliferation and maturation of growth plate chondrocytes resulting in decreased growth plate size"; "The head is large with frontal bossing and the midface is hypoplastic resulting from cartilage growth defects at the skull base" | his-06-q27, q30 |
| Muthu S et al. World J Orthop 2024;15(3):266-84. doi:10.5312/wjo.v15.i3.266; PMID 38596189 | PMC10999967 | "clot rich in chondroprogenitor cells… formation of type I collagen and fibrocartilage"; "avascular as well as aneural nature of cartilage substantially limits its ability to self-regenerate"; "poor viscoelastic properties of the restored fibrocartilage" | his-06-q29 |
| Del Río E. Int J Mol Sci 2025;26(23):11447. doi:10.3390/ijms262311447; PMID 41373603 | PMC12691886 | "The early loss of proteoglycans and incipient collagen fibrillation increase the tissue water content" | his-06-q28 (sem mudança; não acrescentado às referências) |
| Lo Iacono N et al. Clin Dev Immunol 2013:412768; PMID 23762088 | PMC3671266 | "In the bone, it is produced mainly by cells of mesenchymal origin, osteoblasts, hypertrophic chondrocytes, and bone marrow (BM) stromal cells"; "Three of them received full HSCT… good levels of hematological engraftment but no improvement in bone remodeling" | his-07-q28 |
| Albert MH et al. Bone Marrow Transplant 2026;61(7):791-804. doi:10.1038/s41409-026-02906-0; PMID 42174044 (diretriz EBMT/ESID) | PMC13349871 | "Allogeneic HSCT is the therapy of choice for patients with infantile osteopetrosis… Contraindications in specific subtypes must be excluded: (a) osteoblast defects: RANKL"; na tabela 1b, osteopetrose com variantes de RANKL na categoria "generally not recommended" | his-07-q28 |
| Chemtob A et al. Front Pediatr 2026;14:1846893. doi:10.3389/fped.2026.1846893; PMID 42519738 | PMC13381457 | "failure of intramedullary haematopoiesis in a context involving medullary obstruction. This leads to extramedullary haematopoiesis and hepatosplenomegaly" | his-07-q30 |
| Takami A. JMA J 2026;9(5):1084-93. doi:10.31662/jmaj.2026-0173; PMID 42840373 | PMC13639491 | Tabela 3, linha "Normal (80–100 fL) / High / Mixed cell population: Early iron deficiency, combined deficiency (iron + B12/folate)…"; "a normal MCV does not exclude clinically significant abnormalities if RDW is elevated" | his-08-q29 |
| Guntupalli L, Lurie A, Stoll V, Lugo LD. Cureus 2023;15(7):e42593. doi:10.7759/cureus.42593; PMID 37637552 | PMC10460268 | "Folate deficiency is a rare cause of subacute combined degeneration (SCD)"; "Rarely, folate deficiency has been described to present with a similar pathology" | his-08-q31 |
| Obeid R et al. J Clin Med 2024;13(8):2176; PMID 38673453 | PMC11050313 | "Macrocytic anemia is not related to the presence or absence of neurological symptoms or their severity" | his-08-q31 |
| Cohen RV et al. EClinicalMedicine 2026;100:104205; PMID 42830915 | PMC13634271 | "Clinical manifestations are heterogeneous and may be irreversible, including megaloblastic anaemia, peripheral neuropathy, subacute combined degeneration" | his-08-q31 |
| Tsutsumi YM et al. (JSA). J Anesth 2026;40(1):4-12; PMID 41504952 | PMC12860801 | "triggered by volatile inhalational anesthetics and/or… suxamethonium"; "The initial signs of MH include… ETCO₂… unexplained tachycardia, and muscle rigidity, including masseter… Additionally, rapid temperature increases (> 0.5 °C/15 min)"; "Discontinue… triggering agents… switch to intravenous anesthesia and non-depolarizing muscle relaxants"; "Dantrolene acts on… RYR1"; "RYR1 or CACNA1S variants… approximately 50–70%" | his-09-q29, q31 |
| Klincová M et al. Children (Basel) 2022;9(11):1692. doi:10.3390/children9111692; PMID 36360420 | PMC9717737 | Advertência da FDA: succinilcolina só para "emergency intubation or instances where immediate securing of the airway is necessary, e.g., laryngospasm, difficult airway, full stomach…" | his-09-q29 (vinheta) |
| Bohringer C et al. Transl Perioper Pain Med 2019;6(4):129-35; PMID 33834087 | PMC8025983 (efetch) | Histórico da bula de 1993 (contraindicação pediátrica fora da urgência, depois redação de "balance against the risk") | his-09-q29 (contexto) |
| Birnkrant DJ et al. Lancet Neurol 2018;17(3):251-67 | PMC5869704 (efetch) | "deletion and duplication testing is usually the first confirmatory test"; "If deletion or duplication testing is negative, genetic sequencing should be done"; "if genetic testing does not confirm… muscle biopsy… immunohistochemistry… or western blot" | his-09-q30, q32 |
| Sheikh O, Yokota T. J Pers Med 2020;10(3):111; PMID 32899151 | PMC7565713 | "BMD features partially functional dystrophin protein due to in-frame mutations"; "BMD can feature a plethora of truncated dystrophins" | his-09-q30 (terminologia; sem mudança) |
| Coclitu CI et al. Expert Rev Neurother 2025;25(7):791-817; PMID 40440559 | PMC12312756 | "Axonal loss is the principal unsolved cause of irreversible disability in people with MS"; "incomplete and inefficient remyelination in MS" | his-10-q29 |
| Rodríguez-Aceves CA et al. Brain Spine 2026;6:106119; PMID 42327692 | PMC13280257 | "Axonotmesis… axonal and myelin disruption with preserved CT sheaths"; "Neurotmesis… complete transection of the nerve" | his-10-q28 (sem mudança; não acrescentado às referências) |

Hosts recusados pelo proxy em 10/11/2026:
- `consultas.anvisa.gov.br` e `dailymed.nlm.nih.gov` (bula da succinilcolina; `api.fda.gov` também recusado);
- `onlinelibrary.wiley.com` e `doi.org`: EAN/PNS 2023, BSH 2014 sobre cobalamina e folato;
- `www.nice.org.uk`: NG239;
- `search.scielo.org`;
- `www.ean.org`;
- sites da SBA/BJAN.

Também não foi lido: GeneReviews no `www.ncbi.nlm.nih.gov/books`, que devolveu uma página de verificação anti-robô.

## 5. Pontos para o revisor humano

1. **his-07-q28.** Nenhum estudo de transplante de células hematopoéticas em camundongos sem RANKL foi localizado (busca no Europe PMC em 10/11/2026). A previsão para os animais é extrapolada dos pacientes (Lo Iacono 2013) e da diretriz EBMT/ESID 2026. Continua valendo a observação da 1ª etapa: RANKL transgênico superexpresso em linfócitos corrige parcialmente a osteopetrose murina (Kim 2000). Com a nova redação, (c) é defensável.
2. **his-08, fora do escopo.** A correlação "Anemia macrocítica" do tópico diz "só a de B12 causa também lesão neurológica". Sugiro trocar por "tipicamente a de B12; na de folato, só raramente", como em q31.
3. **his-09-q29.** Conferir a bula da succinilcolina registrada na ANVISA (uso pediátrico). Aqui só foi lida a advertência da FDA, citada em texto integral.
4. **his-06-q30.** A frase "esse contraste com a ossificação endocondral deficiente contribui para a macrocefalia" é interpretação didática. Ornitz e Legeai-Mallet atribuem a fronte proeminente e a face média hipoplásica ao defeito da base do crânio e não detalham o mecanismo do perímetro cefálico aumentado. O gabarito não depende da frase.
5. **his-10-q27.** A diretriz EAN/PNS 2023 continua sem texto aberto nesta rede. O PCDT de 2020 foi a referência.
6. **his-09-q30.** "Distrofina truncada" para Becker é termo usado na literatura (Sheikh e Yokota 2020). Se preferir, troque por "encurtada", que é mais preciso para a deleção interna em fase.
7. **Sem fonte primária lida e fora das referências.** Ficaram fora das `referencias` a osteoartrite (Del Río 2025) e a classificação de Seddon (Rodríguez-Aceves 2026), porque não mudaram o texto. Os livros-base continuam sem conferência no impresso, como registrou a 1ª etapa.

## 6. Validação

Comandos rodados em 10/11/2026, depois das edições: `cd /home/user/medgame && npm run validar-conteudo && npx vitest run`.

- `validar-conteudo`: **OK**. Saída: "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 45; questões: 1363; escolas: 441."
- `vitest`: **83 de 84 testes passaram** (8 de 9 arquivos). A única falha está fora destes cinco arquivos e vem do trabalho de outro agente nas lâminas: `tests/conteudo.test.ts > lâminas do microscópio virtual > toda lâmina tem desenho e todo desenho tem lâmina`, em `pulmao`, onde há desenho sem lâmina nos dados. Os testes de conteúdo que cobrem estes tópicos passaram, entre eles o de alternativas com ids em ordem e letra citada na explicação.
