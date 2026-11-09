# Revisão emb-21 e emb-22 — embriologia (1ª etapa)

- Agente: `revisor-embriologia-v1`
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md`
- Arquivos revisados e editados: `content/embriologia/topicos/emb-21-regulacao-molecular.json` e `content/embriologia/topicos/emb-22-crista-neural.json`. Nenhum outro tópico foi editado.
- `revisao.humano` não foi tocado (continua `null`). Nenhum id foi alterado (tópicos, questões, estruturas, eventos e correlações).
- Revisão registrada no fim de `revisao.agentes` de cada arquivo.

## 1. Resumo

Revisei os dois tópicos inteiros: objetivos, resumo, pontos-chave, estruturas, eventos, correlações clínicas, referências, notas de divergência, incertezas e as 29 questões de cada um. Também conferi a coerência com emb-06, emb-07, emb-10, emb-12, emb-13, emb-15, emb-18, emb-19, emb-20 e emb-25.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-21 Regulação molecular | 29 (16 múltipla, 6 V/F, 4 ordenar, 3 associar; 8 com contexto após a correção) | 0 | 2 | 9 | 11 | aprovado-com-correcoes |
| emb-22 Crista neural | 29 (16 múltipla, 6 V/F, 4 ordenar, 3 associar; 8 com contexto) | 0 | 5 | 19 | 24 | aprovado-com-correcoes |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, precisão, referência.

**Gabaritos.** Nenhum gabarito de letra estava errado. Na emb-22-q15, a alternativa marcada como correta tinha um texto que contrariava a regra do próprio tópico. Reescrevi o texto e mantive a letra (ver tabela). Em todas as questões de múltipla escolha, a explicação cita a letra da correta e a de cada distrator (checagem por script).

**Distribuição das letras.** Nos dois tópicos, a, b, c e d são corretas 4 vezes cada nas 16 questões de múltipla escolha. Não foi preciso redistribuir.

**Pista de comprimento.** Medi a razão entre o tamanho da correta e a média dos distratores. Usei o mesmo limiar das revisões anteriores (1,35), e havia três casos acima dele.
- emb-21-q09 (1,46, a correta era a mais longa): aumentei o distrator (b). A razão caiu para 1,17.
- emb-22-q02 (1,42): os distratores "SRY" e "hCG" eram curtos e implausíveis. Troquei-os por distratores do mesmo tipo (BMP alto; SHH da notocorda). A razão caiu para 0,93.
- emb-22-q13 (1,36, empate na mais longa): aumentei o distrator (d). A razão caiu para 1,15.

A única correta ainda "mais longa" é a emb-21-q14 (HOXD13, com 6 caracteres, contra PAX6, SOX10 e RET). São nomes de genes, não uma pista explorável.

**V/F.** emb-21: 4 V / 2 F; emb-22: 3 V / 3 F. Todas as afirmações são inequívocas.

**Ordenar e linha do tempo.**
- emb-21: os eventos e a q25 seguem a cascata fluxo nodal → Nodal no mesoderma lateral esquerdo → Lefty2/PITX2 → morfogênese assimétrica, sem ambiguidade. As q23, q24 e q26 (Hedgehog, Wnt, BMP/SMAD) também são inequívocas.
- emb-22: os eventos (indução → especificação → TEM → migração → diferenciação) são inequívocos. Corrigi um item ambíguo na q24 e um item impreciso na q26 (ver tabela).

### Pontos indicados pelo redator, conferidos

- **Nomenclatura e colinearidade HOX.** Quatro agrupamentos (HOXA–HOXD), com genes 3' expressos antes e mais cranialmente; coerente com emb-07. Acrescentei Sadler cap. 6 às referências e à q06.
- **Hedgehog e cílio primário.** PTCH1–SMO–GLI no cílio primário, em vertebrados, e dependência do colesterol (modificação do ligante e ativação de SMO): corretos. A nota sobre dados de camundongo e ciliopatias humanas foi mantida.
- **Lateralidade.** A cascata está correta. Havia um erro: a q25 e o resumo atribuíam a "barreira na linha média" ao Lefty2. Essa função é do **Lefty1**, na linha média; o **Lefty2** fica no mesoderma lateral esquerdo e limita a sinalização de Nodal (Sadler cap. 5). Corrigi os dois. As referências de lateralidade (q10, q25) passaram a citar Sadler cap. 5, onde o assunto é tratado. Coerente com emb-06 (NODAL/LEFTY2/PITX2).
- **Fatores de iPS.** Incerteza resolvida e movida para `notasDivergencia`, com fonte: OCT4, SOX2, KLF4 e MYC (Takahashi & Yamanaka, Cell 2006; Takahashi et al., Cell 2007); outros protocolos usam OCT4, SOX2, NANOG e LIN28 (Yu et al., Science 2007). A q16 cita os fatores com "p. ex.", o que está correto.
- **BMP e destino celular.** Tratamento qualitativo mantido. Registrei em `incertezas` da emb-22 que o modelo do "BMP intermediário" vem sobretudo de anfíbios e peixe-zebra.
- **Células C (crista × endoderma; Johansson 2015).**
  - A citação está correta: Development 2015;142(20):3519–3528, dev.126581.
  - Em todo o tópico, a camada de origem no ser humano não é afirmada.
  - O problema estava na q15: a alternativa correta dizia "manter a atribuição clássica à crista neural", o que afirma a origem na crista. Foi reescrita como "apresentar as duas propostas, sem afirmar a camada de origem no ser humano".
  - Também retirei do resumo a referência a ids internos de tópicos.
  - A nota de divergência citava "emb-12 e emb-18". O emb-18 não trata das células C; o tópico coerente é o **emb-25**.
- **Cartilagens da laringe.** A nota dizia que o texto usa "grande parte", mas o resumo, a estrutura `ectomesenquima` e a explicação da q16 diziam apenas "cartilagens dos arcos". Corrigi os três para "grande parte das cartilagens dos arcos (as da laringe vêm sobretudo do mesoderma da placa lateral)", coerente com emb-12.
- **Colonização entérica rostrocaudal até a 7ª semana (Wallace & Burns 2005).** Citação correta (Cell Tissue Res 2005;319:367–382): entrada no esôfago na 4ª semana e intestino terminal colonizado na 7ª. Acrescentei a obra às referências. A q24 foi corrigida (ver tabela). Ficou para o revisor humano o sistema de contagem das semanas.
- **Limites crista × mesoderma nos ossos do crânio.** O tópico não afirma limites. A nota remete a emb-19, que traz a mesma ressalva (osso parietal).
- **Treacher Collins e p53 (Jones 2008).**
  - Mecanismo correto: TCOF1/treacle → menor biogênese ribossômica → estabilização de p53 → apoptose do neuroepitélio → déficit de crista.
  - A q25 dizia que a inibição de p53 "reverte o quadro em modelos animais (ver incertezas)". Corrigi para "preveniu o fenótipo em camundongos Tcof1+/− (Jones et al., 2008), achado experimental sem aplicação clínica". Jones 2008 entrou nas referências.
  - A herança passou a "autossômica dominante na maioria dos casos", com POLR1D/POLR1C, coerente com emb-12.
- **Waardenburg, CHARGE, neuroblastoma, feocromocitoma.**
  - Waardenburg: PAX3 nos tipos 1 e 3; MITF no tipo 2; SOX10, EDNRB e EDN3 no tipo 4, com Hirschsprung.
  - CHARGE: CHD7, com hipoplasia dos canais semicirculares.
  - Neuroblastoma: MYCN, opsoclonia-mioclonia, massa que cruza a linha média.
  - Feocromocitoma: NEM 2 (RET), VHL, NF1 e SDHx.
  - Tudo correto. Três ajustes:
    - "Associação CHARGE" passou a **síndrome** CHARGE (é síndrome monogênica desde a identificação de CHD7).
    - A explicação da q11 negava coloboma na Treacher Collins. Ela tem coloboma palpebral (a própria q09 o cita).
    - "Catecolaminas urinárias (HVA/VMA)" passou a "metabólitos urinários das catecolaminas", coerente com emb-25.
- **Holoprosencefalia, Smith-Lemli-Opitz e colesterol.** Corretos e coerentes com emb-18 (SHH, trissomia 13, diabetes materno, álcool, DHCR7). A q11 da emb-21 não tinha `contexto`, e o enunciado falava em "essa condição" sem referente. Acrescentei uma vinheta de SLO com holoprosencefalia.
- **Holt-Oram (TBX5).** Correto (raio pré-axial e cardiopatia septal); coerente com emb-19.
- **Experimentos clássicos.**
  - Enxerto de notocorda com placa do assoalho e neurônios motores ectópicos: coerente com emb-06-q31.
  - Ácido retinoico com transformações homeóticas: Kessel & Gruss, Cell 1991.
  - Olhos ectópicos por eyeless/Pax6: Halder, Callaerts & Gehring, Science 1995.
  - Os três estão corretos. Acrescentei nota de que vêm de modelos animais.

## 2. Tabela de correções

### emb-21-regulacao-molecular

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-21-q11 | contexto | ausente; enunciado "Qual mecanismo liga essa condição à via SHH?" sem referente | vinheta: microcefalia, hipotelorismo, fenda palatina, sindactilia 2–3 dos artelhos, holoprosencefalia, colesterol baixo e 7-desidrocolesterol alto | **importante**: questão sem referente (ambígua/inutilizável) | Moore cap. 20–21; Sadler cap. 1 |
| emb-21-q25 | explicacao | "Nodal induz Lefty2 (barreira na linha média)" | Lefty2 limita a sinalização de Nodal; a barreira na linha média é o Lefty1 | **importante**: explicação incorreta | Sadler cap. 5 |
| emb-21 | resumo (lateralidade) | "induz Lefty (barreira na linha média)" | LEFTY1 na linha média (barreira); LEFTY2 no mesoderma lateral (limita Nodal) | menor: precisão, coerência com q25 | Sadler cap. 5 |
| emb-21 | resumo (Notch) | "inibição lateral (neurogênese, somitogênese)" | inibição lateral (neurogênese) e relógio da segmentação (somitogênese) | menor: Notch na somitogênese não é inibição lateral | Sadler caps. 1 e 6; Moore cap. 21 |
| organizador-istmico | destino | "Teto do mesencéfalo e cerebelo" | centro sinalizador que padroniza o teto do mesencéfalo e o cerebelo (rombômero 1) | menor: o istmo sinaliza, não "se torna" esses órgãos | Moore cap. 17; Sadler cap. 18 |
| emb-21-q04 | explicacao (c) | "nenhum receptor de superfície liga-se ao DNA" | (c) descreve receptores nucleares (ácido retinoico); Notch é transmembrana | menor: clareza da refutação | Sadler cap. 1 |
| emb-21-q09 | alternativa (b) + explicacao | "o cristalino do olho" | "o cristalino e a retina neural do olho" | menor: pista de comprimento (correta era a mais longa, razão 1,46) | — |
| emb-21-q15 | explicacao (b) | "multipotência limita-se a uma linhagem (p. ex., crista neural)" | "origina vários tipos celulares, mas não todos" | menor: a crista forma várias linhagens | Moore cap. 21 |
| emb-21-q06, q10, q15, q22, q25 | referencia | Sadler cap. 1 | q06: caps. 1 e 6; q10/q25: cap. 5; q15/q22: + Moore cap. 21 | menor: capítulo onde o assunto é tratado | — |
| emb-21 | referencias | — | + Sadler cap. 5 (eixos, lateralidade) e cap. 6 (genes HOX) | menor: referências citadas nas questões | — |
| emb-21 | incertezas → notasDivergencia | incerteza sobre os fatores de iPS | resolvida (Takahashi & Yamanaka 2006; Takahashi 2007; Yu 2007); + nota sobre os experimentos em modelos animais | menor: incerteza resolvida com fonte | literatura primária citada |

### emb-22-crista-neural

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| emb-22-q15 | alternativa (c) + explicacao | correta: "manter a atribuição clássica à crista neural e registrar a divergência" | "apresentar as duas propostas, sem afirmar a camada de origem no ser humano" | **importante**: a correta afirmava a crista, contra a regra do tópico; não era a postura mais defensável | Johansson 2015 |
| emb-22-q11 | explicacao (a) | "Treacher Collins não cursa com coloboma nem atresia de coanas" | Treacher Collins tem coloboma palpebral, não de íris e retina, e não explica cardiopatia nem canais semicirculares; "associação" → "síndrome" CHARGE | **importante**: explicação incorreta (contradiz q09) | Moore cap. 9; Thompson cap. 14 |
| emb-22-q24 | item 4 + explicacao | "Diferenciação dos plexos mioentérico e submucoso" após a colonização do intestino terminal | "Maturação dos plexos ao longo de todo o intestino (período fetal)" | **importante**: a diferenciação rostral começa antes de a migração chegar ao intestino terminal; ordem não era inequívoca | Wallace & Burns 2005 |
| emb-22-q25 | explicacao | "inibição de p53 reverte o quadro em modelos animais (ver incertezas)" | "preveniu o fenótipo em camundongos Tcof1+/− (Jones 2008), achado experimental sem aplicação clínica" | **importante**: o experimento preveniu, não reverteu; o texto sugeria terapia | Jones et al., Nat Med 2008 |
| crista-neural-vagal | definicao + origem | "ao nível dos somitos occipitais"; origem "Somitos 1–7" | tubo neural ao nível dos somitos 1–7 (occipital e cervical alta) | **importante**: "origem: somitos" sugere origem mesodérmica; somitos 5–7 não são occipitais | Larsen cap. 10; Le Douarin |
| emb-22 | periodo.carnegie | [9, 10, 11, 12, 13] | [] | menor: estágios 9–13 incoerentes com dias 17–56 (padrão dos demais tópicos) | — |
| emb-22 | objetivos[5] | "Registrar com honestidade a divergência…" | "Reconhecer a divergência… (crista neural × endoderma)" | menor: objetivo de aprendizagem, não de redação | — |
| emb-22 | pontosChave[8] | "a divergência é registrada e a camada não é afirmada" | "estudos em camundongo indicam endoderma; no ser humano, permanece em discussão" | menor: redação voltada ao aluno | Johansson 2015 |
| emb-22 | resumo | "sob a ectoderma" | "sob o ectoderma" | menor: gênero | — |
| emb-22 | resumo | "ossos membranosos e cartilagens dos arcos" | "grande parte das cartilagens dos arcos (as da laringe, sobretudo da placa lateral)" | menor: coerência com a nota de divergência e emb-12 | Sadler cap. 17 |
| emb-22 | resumo | "(coerente com os tópicos emb-12 e emb-18)" | removido; "aqui… não se afirma a camada" | menor: id interno em texto do aluno; emb-18 não trata das células C | — |
| crista-neural-cardiaca | origem | "do placoide ótico aos somitos 3" | "do nível do placoide ótico ao do 3º somito" | menor: redação/precisão | Moore cap. 13 |
| ectomesenquima | destino | "cartilagens dos arcos" | "grande parte das cartilagens dos arcos (laríngeas, sobretudo da placa lateral)" | menor: coerência | Sadler cap. 17 |
| emb-22 | notasDivergencia[0] | "coerente com emb-12 e emb-18" | "coerente com emb-12 e emb-25" | menor: tópico errado | — |
| charge-chd7 | titulo | "Associação CHARGE" | "Síndrome CHARGE" | menor: terminologia atual (CHD7) | Vissers et al., Nat Genet 2004 |
| treacher-collins-ribossomo | descricao | "herança autossômica dominante (TCOF1)" | "dominante na maioria dos casos (TCOF1; mais raramente POLR1D, POLR1C)" | menor: precisão, coerência com emb-12 | genética clínica |
| emb-22-q02 | alternativas (c), (d) + explicacao | "ação do gene SRY"; "sinalização endócrina da hCG" | "nível alto de BMP, como no ectoderma de superfície"; "SHH da notocorda, que ventraliza o tubo neural" | menor: distratores implausíveis e de outro tipo; pista de comprimento (1,42) | Sadler cap. 6 |
| emb-22-q05 | enunciado | "sob a ectoderma" | "sob o ectoderma" | menor: gênero | — |
| emb-22-q12 | contexto | "catecolaminas urinárias (HVA/VMA)" | "metabólitos urinários das catecolaminas (HVA/VMA)" | menor: HVA/VMA são metabólitos; coerência com emb-25 | — |
| emb-22-q13 | alternativa (d) + explicacao | "endoderma faríngeo" | "endoderma do intestino anterior" | menor: pista de comprimento (empate na mais longa, 1,36) | — |
| emb-22-q16 | explicacao | "cartilagens dos arcos" | "grande parte das cartilagens dos arcos (laríngeas, sobretudo da placa lateral)" | menor: coerência | Sadler cap. 17 |
| emb-22-q26 | item 3 + explicacao | "Forma as cristas troncoconais" | "Participa da formação das cristas (coxins) troncoconais", com mesênquima do endocárdio | menor: as cristas também têm mesênquima endocárdico | Sadler cap. 13 |
| emb-22 | referencias | 8 obras | + Moore caps. 4, 9, 11, 17 e 19; Sadler caps. 13 e 15; Wallace & Burns 2005; Jones 2008 | menor: obras citadas nas questões e ausentes da lista | — |
| emb-22 | incertezas | — | Waardenburg/CHARGE conferidos (Pingault 2010; Vissers 2004); + nota sobre o modelo do BMP intermediário; + contagem de semanas em Wallace & Burns | menor: incertezas parcialmente resolvidas ou explicitadas | — |

### Coerência com outros tópicos (não editados; para o mantenedor)

- **emb-07 × emb-19.** emb-07 usa "zona de atividade polariza**dora**"; emb-19 usa "polariza**nte**" (e o id da estrutura em emb-21 é `zona-de-atividade-polarizante`, com nome "polarizadora"). Sugere-se padronizar o nome exibido. Os ids não devem mudar.
- **emb-13 × emb-22.** "Cristas truncais e conais" (emb-13) e "cristas troncoconais" (emb-22) são sinônimos. Não há conflito.
- **Sem divergências de fato** com emb-06, emb-10, emb-12, emb-15, emb-18, emb-19, emb-20 e emb-25 nos pontos tratados:
  - Lateralidade: emb-06 (NODAL/LEFTY2/PITX2, discinesia ciliar).
  - HOX, SHH e ácido retinoico: emb-07.
  - Isotretinoína: emb-10.
  - Corpo ultimofaríngeo, laringe, 22q11 e Treacher Collins: emb-12.
  - Crista cardíaca pelos arcos 3, 4 e 6: emb-13.
  - Hirschsprung, RET e trissomia 21: emb-15.
  - Holoprosencefalia e SLO: emb-18.
  - FGFR3, FGFR2, AER/ZPA e Holt-Oram: emb-19.
  - CHARGE e melanócitos: emb-20.
  - Células C, neuroblastoma e feocromocitoma: emb-25.

## 3. Pontos para o revisor humano

1. **Células C no ser humano.**
   - A emb-22 apresenta as duas propostas e não afirma a camada. A q15 cobra essa postura, e a q22 cobra a ausência de consenso.
   - Confirmar que a formulação "os dados humanos são indiretos" descreve bem a parte humana de Johansson et al. (2015), que usou imuno-histoquímica em tecido embrionário humano.
2. **Wallace & Burns (2005).** Confirmar se as semanas (entrada ≈4ª, intestino terminal ≈7ª) são pós-concepção (presumido, pelo estadiamento embrionário) ou desde a DUM. Isso afeta a q24 e a nota de divergência.
3. **Capítulos citados.** Confirmar nas edições brasileiras:
   - Sadler 14ª ed. trata de potência celular e iPS no cap. 1 ou no cap. 3? Hoje a q15 e a q22 citam o cap. 1 e Moore cap. 21.
   - Sadler cap. 5: lateralidade (q10, q25).
   - Sadler cap. 6: genes HOX (q06).
   - Moore cap. 21: células-tronco e epigenética.
4. **Treacher Collins.**
   - O resgate por p53 está descrito como experimental. Não há nenhuma aplicação clínica no texto.
   - Conferir com o revisor de genética a lista de genes menores (POLR1D, POLR1C) e os padrões de herança.
5. **Waardenburg tipo 2.**
   - O texto cita MITF como gene principal.
   - SOX10, SNAI2 e outros ficaram só na nota de incertezas.
   - Decidir se convém citá-los no corpo do texto.
6. **Período do emb-22.**
   - Os estágios de Carnegie (9–13) foram retirados, por serem incoerentes com os dias 17–56; os demais tópicos de sistemas também usam `[]`.
   - O dia de início (17) foi mantido: a borda neural é especificada durante a gastrulação e a formação da placa neural (≈ dias 17–19).
   - Se o app passar a usar o período para associar estágios 3D, reavaliar.
7. **Prevalências.** Continuam omitidas nos dois tópicos (holoprosencefalia, acondroplasia, craniossinostoses, aniridia, Hirschsprung por gene, Waardenburg, CHARGE), como registrado em `incertezas`.

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

Os scripts de checagem (distribuição de letras, letras citadas nas explicações, razão de comprimento) estão em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-e2122/` e não fazem parte do repositório. Depois das correções:
- letras a/b/c/d = 4/4/4/4 nos dois tópicos;
- todas as explicações citam as quatro letras;
- nenhuma razão de comprimento passa de 1,35, exceto emb-21-q14 (nomes de genes, sem pista).
