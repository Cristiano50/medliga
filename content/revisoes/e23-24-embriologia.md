# Revisão E23–E24: embriologia (1ª etapa)

- Agente: `revisor-embriologia-v1`
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`. Formato: `docs/conteudo-schema.md`.
- Arquivos editados: `content/embriologia/topicos/emb-23-arcos-aorticos-veias.json` e `content/embriologia/topicos/emb-24-circulacao-fetal.json`. Nenhum outro tópico foi editado.
- Nenhum id foi alterado. `revisao.humano` continua `null` nos dois arquivos. Em `revisao.agentes` de cada arquivo foi acrescentada uma entrada `revisor-embriologia-v1`, com veredito `aprovado-com-correcoes`.

## 1. Resumo

Revisei integralmente os dois tópicos novos: resumo, objetivos, pontos-chave, estruturas, eventos, correlações clínicas, referências, notas de divergência, incertezas e as 56 questões (28 em cada tópico). Os textos estavam corretos e bem fundamentados no essencial. Nenhum gabarito estava errado, e nenhum fato errado foi encontrado nas questões.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-23 Arcos aórticos e sistemas venosos | 28 | 0 | 1 | 3 | 4 | aprovado-com-correcoes |
| emb-24 Circulação fetal e transição neonatal | 28 | 0 | 1 | 3 | 4 | aprovado-com-correcoes |
| **Total** | **56** | **0** | **2** | **6** | **8** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável, explicação incorreta ou imprecisão de fato;
- **menor**: redação, terminologia, referência ou registro (notas e incertezas).

**Checagens automáticas** (script em pasta temporária, fora do repositório):
- Em todas as múltiplas escolhas, a frase "alternativa (x) está correta" coincide com `correta`, e a explicação cita todas as letras.
- **Distribuição das letras corretas:** 4/4/4/4 (a/b/c/d) em cada tópico, de 16 múltiplas. Não foi preciso redistribuir.
- **Pista de comprimento:**
  - emb-23: a correta nunca é a única alternativa mais longa (é a mais curta em 4 das 16).
  - emb-24: a correta é a mais longa em 3 das 16 e a mais curta em 5.
  - As diferenças são de poucos caracteres, sem padrão explorável.
- **V/F:** 3 verdadeiras e 3 falsas em cada tópico.
- **Tipos de questão:** 16 múltiplas (8 com contexto clínico), 6 V/F, 3 de ordenar e 3 de associar. As sequências e os pares são inequívocos.

### Pontos registrados pelo redator e conferidos

| Ponto | Situação |
|---|---|
| **Fração do sangue umbilical que passa pelo ducto venoso** | As fontes divergem: Moore, cerca de metade; Sadler, "a maior parte"; Doppler, cerca de 20% a 30% (Kiserud, 2005). O texto diz "parte" e nenhuma questão cobra o número. **Corrigido:** o parágrafo inicial do resumo do emb-24 dizia que os desvios fazem "a maior parte do sangue contornar o fígado", o que contradizia a nota. |
| **Esfíncter do ducto venoso** | Sadler o descreve; estudos anatômicos humanos não mostram esfíncter muscular. A nota está correta e o tema não é cobrado. |
| **Mistura × correntes preferenciais na veia cava inferior** | A redação "mistura-se pouco" e "preferencialmente" é adequada. **Corrigido na nota:** Sadler também descreve a mistura (a nota atribuía só a Moore). Sadler atribui o direcionamento ao forame oval à valva da veia cava inferior, com a crista dividens retendo pequena parte do sangue no átrio direito; Moore atribui o direcionamento à crista dividens. O texto segue Moore, e a divergência foi registrada. |
| **Bradicinina × O₂/PGE2** | Sadler cita a bradicinina como mediadora do fechamento do canal. O texto enfatiza O₂ e PGE2 (Moore e fisiologia neonatal). A explicação da q04 está correta. |
| **Tempos de fechamento** | Canal arterial: funcional em horas a poucos dias; anatômico em cerca de 12 semanas (Moore) ou 1 a 3 meses (Sadler). Nenhuma questão cobra números, e a linha do tempo só põe o funcional antes do anatômico, com empates onde a ordem é incerta. Coerente com o emb-13. |
| **Prevalência do forame oval patente** | Moore: até cerca de 25%. Sadler: cerca de 20%. Hagen et al. (1984): cerca de 27%. "Um quinto a um quarto" está correto e coerente com o emb-13. |
| **Segmento pós-renal da veia cava inferior** | Moore: supracardinal direita. Sadler: segmento sacrocardinal. As questões cobram só o segmento hepático, consensual, e a q19 cita as duas versões. |
| **5º arco** | "Não se forma ou é rudimentar". A q17 cobra só a ausência de derivados. |
| **Mecanismo da coarctação** | O campo `mecanismo` está correto (três hipóteses, mecanismo incerto). **Corrigido na nota de divergência:** a hipótese hemodinâmica (persistência do istmo estreito) também está em Moore, que apresenta três hipóteses, e não só na literatura de cardiologia pediátrica. |
| **Linfáticos** | Seis sacos primários, jugulares primeiro, início na 5ª–6ª semana (Sadler × Moore) e ducto torácico: corretos. **Corrigido no resumo do emb-23:** o higroma do 1º trimestre estava associado "sobretudo" à síndrome de Turner; ver tabela. |
| **Teste do coraçãozinho (q10: 97% e 90%)** | A conduta é a mesma nos dois protocolos. Protocolo de 2014 (MS/SBP): qualquer valor abaixo de 95% ou diferença de 3% ou mais leva a repetir após 1 hora e, se confirmado, a ecocardiograma. Atualização da SBP de 2022: 90% a 94% ou diferença de 4% ou mais é duvidoso; repete-se após 1 hora (até duas vezes) e, se persistir, o teste é positivo, com ecocardiograma antes da alta. Nos dois, a alternativa (d) é a única correta. Os critérios de 2022 foram reconfirmados em fontes secundárias localizadas por busca: Afya, Estratégia MED, Grupo MedCof. O documento primário não pôde ser aberto (sbp.com.br não resolve na rede da sessão). |
| **Clampeamento do cordão (SBP/FEBRASGO 2022)** | Fontes secundárias (Portal de Boas Práticas da Fiocruz, Afya) e o título da página da SBP (lançamento em 21/03/2022) confirmam: pelo menos 60 s a partir de 34 semanas com boa vitalidade, e mais de 30 s abaixo de 34 semanas. A OMS 2014 recomenda não antes de 1 minuto. A q15 e a correlação estão corretas. |
| **PGE1 e apneia** | Correto: a apneia é o efeito adverso que exige monitorização. Febre, rubor e hipotensão também ocorrem (q20). |
| **Óxido nítrico/ECMO na HPPRN** | Coerente com a AHA/ATS 2015: óxido nítrico inalatório na hipoxemia grave do recém-nascido a termo ou próximo do termo; ECMO nos casos refratários (q08). |
| **Fechamento do forame oval patente (AHA/ASA 2021)** | Correto: 18 a 60 anos, AVC não lacunar sem outra causa, forame de alto risco; fechamento percutâneo com antiagregação prolongada considerado razoável. |
| **Canal arterial no prematuro (BeNeDuctus 2023)** | Correto. Hundscheid et al., NEJM 2023: a conduta expectante não foi inferior ao ibuprofeno precoce. O texto diz "tratamento individualizado". |
| **~80% de saturação na veia umbilical atribuídos a Sadler** | Reconheço a frase no original de Sadler (cap. 13, circulação fetal: "about 80% saturated with oxygen"), mas também de memória. A incerteza foi mantida e atualizada; falta a página da edição brasileira. |

### Outros pontos conferidos sem erro

- **emb-23:**
  - derivados do saco aórtico e dos arcos 1º–6º;
  - ducto carotídeo e regressão da aorta dorsal direita entre a 7ª intersegmentar e a junção;
  - subclávias (esquerda: 7ª intersegmentar; direita: origem tripla), vertebrais, intercostais e lombares;
  - laríngeos recorrentes e laríngeo inferior direito não recorrente na subclávia aberrante;
  - vitelinas, umbilicais e ducto venoso;
  - cardinais, veia cava superior e braquiocefálica esquerda;
  - veia cava inferior nas versões de Moore e de Sadler, ázigo e hemiázigo;
  - anomalias: arco duplo, arco à direita, subclávia aberrante, interrupção A/B/C com 22q11.2, veia cava superior esquerda e continuação ázigo com isomerismo esquerdo;
  - linha do tempo (dias 22–28 e 36–56).
- **emb-24:**
  - trajeto e desvios, ordem de oxigenação (q25) e sentidos dos shunts;
  - mudanças ao nascer, fossa oval (assoalho do septum primum, limbo do septum secundum) e remanescentes;
  - ligamento umbilical mediano (úraco) × mediais;
  - pré/pós-ductal, CIV com insuficiência cardíaca tardia, coração esquerdo hipoplásico e embolia paradoxal.
- **Capítulos citados:**
  - Moore 11ª ed.: cap. 13 (cardiovascular) e 20 (defeitos congênitos);
  - Sadler 14ª ed.: cap. 13 (cardiovascular) e 17 (cabeça e pescoço);
  - Larsen 5ª ed.: cap. 13 (vasculatura);
  - diretrizes e artigos (OMS 2014, Portaria SCTIE/MS nº 20/2014, Abman 2015, Kleindorfer 2021, Hundscheid 2023, McDonald 2013, Rabe 2019, Kiserud 2005, Celoria e Patton 1959, Pedra 2019): referências plausíveis.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-23-arcos-aorticos-veias | resumo (Linfáticos) | Higroma no 1º trimestre "associa-se a aneuploidias, **sobretudo** à síndrome de Turner" | "associa-se a aneuploidias, **entre elas** a síndrome de Turner" | Imprecisão de fato. Nas séries de higroma septado do 1º trimestre, a trissomia 21 é ao menos tão frequente quanto a 45,X; a 45,X predomina no higroma do 2º trimestre. O texto fica neutro, como a correlação e a q21. | importante | Moore 11ª ed., cap. 13 e 20; Malone et al., Obstet Gynecol 2005 (FASTER); Scholl et al., Obstet Gynecol 2012 |
| emb-23-q13 | explicacao, distrator (d) | "A falta da braquiocefálica esquerda (d) **ocorre na** veia cava superior dupla" | "…(d), que **pode acompanhar** a veia cava superior dupla, não altera…" | A braquiocefálica falta só em parte dos casos de veia cava superior dupla; a correlação do próprio tópico diz "frequentemente pequena ou ausente". | menor | Correlação `vcs-esquerda-persistente`; Sadler 14ª ed., cap. 13 |
| emb-23-q27 | enunciado | "Associe cada **veia** do adulto…" | "Associe cada veia (ou remanescente venoso) do adulto…" | O ligamento redondo do fígado, um dos itens, não é veia. | menor | Terminologia |
| emb-23-arcos-aorticos-veias | notasDivergencia (coarctação) | "A hipótese hemodinâmica… **vem da literatura de cardiologia pediátrica**" | "Moore apresenta três hipóteses: tecido ductal, involução de segmento da aorta dorsal esquerda e persistência do istmo… emb-13 cita só as duas primeiras" | Atribuição incorreta de fonte: a hipótese do istmo está em Moore. | menor | Moore 11ª ed., cap. 13 (coarctação da aorta) |
| emb-24-circulacao-fetal | resumo (Por que há desvios) | Os três desvios "fazem **a maior parte do sangue contornar o fígado** e os pulmões" | "fazem **parte** do sangue placentário contornar o fígado e **a maior parte do débito cardíaco** contornar os pulmões" | Contradizia a nota de divergência e o restante do texto ("parte"). Pelo Doppler, só cerca de 20% a 30% do sangue umbilical passa pelo ducto venoso na 2ª metade da gestação, e o sangue portal sempre atravessa o fígado. | importante | Kiserud, Semin Fetal Neonatal Med 2005; Moore 11ª ed. e Sadler 14ª ed., cap. 13 |
| emb-24-circulacao-fetal | notasDivergencia (mistura na veia cava inferior) | "**Moore** descreve a mistura…" | "Moore **e Sadler** descrevem a mistura…" + divergência valva da veia cava inferior (Sadler) × crista dividens (Moore) no direcionamento ao forame oval | Sadler descreve explicitamente a mistura na veia cava inferior e atribui o direcionamento à valva da veia cava inferior. O texto segue Moore, e a divergência fica registrada. | menor | Sadler 14ª ed., cap. 13; Moore 11ª ed., cap. 13 |
| emb-24-circulacao-fetal | incertezas[0] (SBP) | Critérios conferidos "por resultados de busca e resumos secundários" | Mantida, com registro da reconferência em fontes secundárias e da numeração ("Manual de Orientação nº 4") não confirmada | Registro: os mesmos critérios aparecem em várias fontes secundárias; a fonte primária continua pendente. | menor | Afya; Estratégia MED; Grupo MedCof; Portal de Boas Práticas/Fiocruz |
| emb-24-circulacao-fetal | incertezas[1] (80%) | "atribuída a Sadler… de memória; conferir" | Mantida, com o reconhecimento da frase do original ("about 80% saturated with oxygen"), também de memória | Registro honesto: compatível com o original, mas sem acesso ao livro nesta sessão. | menor | Sadler, Langman's Medical Embryology, cap. 13 |

## 3. Coerência com emb-09, emb-11, emb-12, emb-13 e emb-14 (não editados)

Não encontrei contradição.

- **emb-12:**
  - os remanescentes dos 1º e 2º arcos (parte da maxilar; hióidea e estapédia) são os mesmos, com a mesma nota de divergência;
  - nervos: laríngeo superior para o 4º arco e laríngeo recorrente para o 6º;
  - o higroma da q07 está no triângulo posterior, por falha de conexão do saco jugular.
- **emb-13:**
  - derivados dos arcos, laríngeos recorrentes e subclávia retroesofágica com laríngeo não recorrente;
  - circulação fetal: corrente do ducto venoso dirigida pela crista dividens; ventrículo direito "principalmente" com sangue da cava superior, a mesma ideia da q02 do emb-24;
  - forame oval patente (Moore 25%; Sadler 20%) e tempos de fechamento do canal (horas a dias; semanas a cerca de 3 meses);
  - coarctação ligada a Turner e à valva bicúspide.
  - **Registro, sem erro:** o emb-13 cita só duas das três hipóteses de Moore para a coarctação, e o emb-23 cita as três.
- **emb-14:** o laríngeo recorrente esquerdo sob o arco e o ducto, e o direito contornando a subclávia, conferem.
- **emb-11:** a veia umbilical na borda livre do ligamento falciforme confere.
- **emb-09:** úraco → ligamento umbilical mediano; duas artérias e uma veia umbilicais; conferem.
- **Observação de dados:** a estrutura `veias-umbilicais` tem o nome "Veia umbilical" no emb-24 e "Veias umbilicais" no emb-13 e no emb-23. Não é erro de conteúdo: o emb-24 trata da veia única do feto. Mas, se algum glossário unificar estruturas por id, o nome exibido pode variar.

## 4. Pontos para o revisor humano

1. **Edição brasileira de Sadler, cap. 13:**
   - confirmar a página dos ~80% de saturação na veia umbilical e a frase "a maior parte" do sangue pelo ducto venoso;
   - em Moore, confirmar "cerca de metade".
2. **SBP 2022 (documento primário):**
   - critérios do teste do coraçãozinho (≥ 95% e ≤ 3%; 90%–94% ou ≥ 4%; ≤ 89%), número de repetições, idade gestacional (35 semanas ou mais) e o número do documento ("Manual de Orientação nº 4");
   - texto SBP/FEBRASGO 2022 para menos de 34 semanas: "após 30 segundos" ou "pelo menos 30 segundos". As fontes secundárias usam as duas formas, e nenhuma questão cobra esse limite.
3. **Higroma cístico:** a ordem de frequência das aneuploidias no 1º trimestre (trissomia 21 × 45,X) vem de séries clínicas, não das obras de embriologia. O texto agora não ordena as aneuploidias.
4. **Interrupção do arco:** o tipo B ser o mais frequente e a classificação de Celoria e Patton vêm da cardiologia pediátrica. Cabe ao revisor clínico conferir (incerteza já registrada pelo redator).
5. **emb-24-q07 (HPPRN):** o caso diz "hipoxemia grave" com 95% na mão direita sem informar a FiO₂. Mantive porque não muda a resposta; o revisor clínico pode acrescentar "em oxigênio a 100%".
6. **emb-24-q02:** a alternativa correta diz que o sangue do ventrículo direito vem "sobretudo da cava superior". No feto humano, a cava superior responde por cerca de metade ou mais do retorno ao ventrículo direito, e o restante vem da cava inferior e do seio coronário. Mantive, coerente com o emb-13 (q14).
7. **emb-24-q10:** a questão tem dificuldade 5. Uma dificuldade 4 seria igualmente defensável; mantive.
8. **Tempos de fusão anatômica do forame oval** (Sadler, cerca de 1 ano; outras fontes, primeiros meses): não são cobrados; conferir a nota na edição brasileira.
9. **Condutas clínicas** (PGE1 e apneia, óxido nítrico/ECMO, fechamento do forame oval patente, BeNeDuctus, clampeamento): conferidas contra as diretrizes citadas. A 2ª etapa (revisor transversal de neonatologia/cardiologia pediátrica) deve reconferir.

## 5. Evidência de execução

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
 Test Files  6 passed (6)
      Tests  47 passed (47)
```

O teste do modelo 3D `septacao-cardiaca`, que poderia falhar por causa do trabalho paralelo no 3D, **não falhou** nesta execução: todos os 47 testes passaram. Outros agentes editam o 3D ao mesmo tempo, então o resultado pode mudar numa execução posterior.

Não foi feito commit.
