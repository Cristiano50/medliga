# Revisão AV3 — pediatria/cirurgia pediátrica/cardiologia/anatomia, camada avançada (tópicos 11 a 15)

- Agente: `revisor-pediatria-avancado-v1` (2ª etapa, área pediatria/cirurgia-pediatrica/cardiologia/anatomia)
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md`
- Etapa anterior: `content/revisoes/av3-embriologia.md`
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas de `referencias` e `incertezas`:
  - `emb-11-cavidades-diafragma.json` (q26–q30)
  - `emb-12-aparelho-faringeo.json` (q26–q30)
  - `emb-13-cardiovascular.json` (q26–q30)
  - `emb-14-respiratorio.json` (q24–q28)
  - `emb-15-digestorio.json` (q26–q30)
- O conteúdo anterior dos tópicos não foi mexido. Nenhum id e nenhuma letra correta (ou `ordemCorreta`) foi alterado. Nenhum arquivo fora desses cinco e deste relatório foi editado. `revisao.humano` continua `null` nos cinco arquivos.
- Situação: revisão por agente (IA). Nada aqui substitui a conferência médica.
- Commit: não fiz commit. O commit `83a2622` (sessão principal, 12:07) já levou as minhas edições do emb-11, feitas minutos antes. As edições dos tópicos 12 a 15 e este relatório estão sem commit.

## 1. Resumo

Revisei 25 questões: 17 de múltipla escolha, 3 de ordenar e 5 de associar. Todas são de dificuldade 4–5.

Nenhum gabarito estava errado. Nenhuma correção foi crítica. A única importante foi o sequestro pulmonar (emb-14-q27), cuja decisão está registrada abaixo.

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-11 Cavidades corporais e diafragma | 5 | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| emb-12 Aparelho faríngeo | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| emb-13 Sistema cardiovascular | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| emb-14 Sistema respiratório | 5 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| emb-15 Sistema digestório | 5 | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **1** | **8** | **9** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão clínica ou referência.

A atualização da nota da camada avançada em `incertezas` de cada tópico não foi contada como correção.

Uma checagem por script, depois das edições, confirmou:
- só mudaram os campos previstos: `explicacao`, `contexto`, `referencia`, um texto de alternativa (emb-14-q25 a), a nota da camada avançada em `incertezas`, `referencias` e `revisao.agentes`;
- ids, `correta`, `ordemCorreta` e ids de alternativas são iguais aos de antes;
- toda explicação de múltipla escolha avançada cita as quatro letras;
- nenhuma alternativa correta ficou mais longa que todos os distratores.

### Foco clínico conferido

**Diafragma e cavidades (emb-11)**
- **HDC e hipoplasia pulmonar (q26).** Gabarito correto: o período pseudoglandular, com menos gerações brônquicas e hipoplasia bilateral, e a vinheta é realista. Acrescentei a hipótese do duplo golpe: os dois pulmões já crescem menos antes da herniação, segundo o modelo experimental.
- **Ensaio TOTAL.** O ganho de sobrevida aparece só na HDC esquerda grave. Na moderada, não houve ganho significativo, e nos dois ensaios aumentaram a rotura prematura de membranas e o parto prematuro. Isso ficou registrado em emb-11 (incerteza) e em emb-14-q24 (explicação). Não há números no texto do aluno.
- **Paralisia de Erb com lesão do frênico (q27): correto.** Distocia de ombro, C5–C6, hemicúpula elevada e movimento paradoxal na ultrassonografia. O frênico (C3–C5) tem C5 em comum com o plexo. O vago e os intercostais não dão inervação motora ao diafragma.
- **Úlcera posterior e bolsa omental (q28): correto.** A úlcera da parede posterior do estômago perfura para o saco menor, que se comunica pelo forame omental. O caso é realista.
- **q29 e q30: corretos.** A dor da pleura diafragmática periférica é referida à parede toracoabdominal. É o mesmo mecanismo da pneumonia de base que simula abdome agudo na criança.

**Aparelho faríngeo (emb-12)**
- **Paralisia facial periférica × central (q26): correto.** Na lesão intratemporal, toda a hemiface fica paralisada (inclusive a fronte), com hiperacusia e perda gustativa dos 2/3 anteriores da língua. A mastigação (V3) fica preservada. O padrão central, que poupa a fronte, aparece como distrator e está corretamente refutado.
- **Paratireoide ectópica no mediastino (q27): gabarito correto** (paratireoide inferior, da 3ª bolsa, levada pelo timo). Completei a refutação de (a): a paratireoide superior ectópica tende ao espaço retroesofágico e ao mediastino posterior, e as duas superiores tinham sido encontradas.
- **Fenda palatina e otite com efusão (q28): correto.** O caso é realista (fenda não operada aos 10 meses). O raciocínio é o do tensor e do levantador do véu sem inserção mediana.
- **22q11.2 (q30): pares corretos.** Acrescentei duas precisões pediátricas:
  - o comprometimento tímico costuma ser hipoplasia, e a aplasia completa é rara;
  - as anomalias palatais mais comuns são a insuficiência velofaríngea e a fenda submucosa.

**Cardiovascular (emb-13)**
- **Fallot no ultrassom fetal (q26): correto.** O corte de quatro câmaras pode ser normal, e a CIV por desalinhamento aparece com a aorta cavalgante. Acrescentei a Diretriz Brasileira de Cardiologia Fetal (SBC, 2019), cuja seção da ultrassonografia morfológica inclui as vias de saída, ao lado da ISUOG 2023.
- **DSAV parcial (q27): correto.** O quadro tem CIA ostium primum, fenda mitral, dois orifícios AV e septo interventricular íntegro, numa criança de 6 anos sem síndrome.
- **Coração esquerdo hipoplásico dependente do canal (q28): correto.** A piora no 3º dia vem do fechamento do canal, e a conduta é a PGE1, mantida qualitativa e sem dose.
  - Acrescentei que oxigênio em concentração alta desvia o débito para os pulmões e piora a perfusão sistêmica.
  - Citei o Manual de Orientação da SBP (2022), que classifica a SHCE entre as cardiopatias com fluxo sistêmico dependente do canal.
- **Atresia tricúspide com CIV (q29) e tipos de CIV (q30): corretos e inequívocos.**

**Respiratório (emb-14)**
- **CHAOS (q24): correto** (líquido pulmonar retido estimula o crescimento). TOTAL: ver acima.
- **VACTERL × anemia de Fanconi (q25): gabarito correto.**
  - A alternativa correta passou a dizer "diagnóstico de exclusão".
  - A explicação passou a dizer que a anemia de Fanconi se rastreia pelo teste de fragilidade cromossômica (diepoxibutano ou mitomicina C), porque o hemograma normal ao nascer não a exclui.
  - Também diz que o ecocardiograma pré-operatório define o lado do arco aórtico.
- **Prematuro de 24 semanas de IG (q26): correto.** Equivale a cerca de 22 semanas após a fertilização, no canalicular tardio. A explicação não precisou de mudança.
- **Sequestro pulmonar (q27): decisão registrada** no item a seguir.
- **Sequência de Potter (q28): ordem correta e inequívoca.**

**Digestório (emb-15)**
- **Volvo do intestino médio (q26): gabarito correto.** A explicação agora diz expressamente que é **emergência cirúrgica**: reanimação, laparotomia imediata, distorção e procedimento de Ladd (Holcomb e Ashcraft, 7ª ed.).
- **Divertículo de Meckel (q27): correto.** A "regra dos 2" aparece só como mnemônica aproximada, e as distâncias seguem Moore e Sadler.
- **Duodeno e AMS (q28): correto.** Rotação de 270° anti-horária, com a 3ª parte do duodeno entre a AMS e a aorta.
- **Remanescentes umbilicais (q29): pares corretos.**
- **Hemorroidas internas × externas (q30): correto.** A hemorroida interna, acima da linha pectínea, é visceral e indolor. A externa trombosada, abaixo dela, é dolorosa (pudendo).

### Decisão sobre o sequestro pulmonar (emb-14-q27)

**Decisão: manter a vinheta intralobar.** É a forma mais comum e a apresentação típica na criança (pneumonias de repetição na base esquerda, artéria da aorta). Não troquei por um sequestro extralobar. Em vez disso:

- **Vinheta inequívoca:** a lesão fica "dentro do lobo inferior esquerdo" e é "drenada pelas veias pulmonares".
- **Explicação:**
  - apresenta a teoria clássica do broto respiratório acessório: antes da formação da pleura, o sequestro é intralobar; depois, extralobar, com pleura própria, drenagem venosa em geral sistêmica, diagnóstico pré-natal ou no lactente e associação a outras anomalias, como a HDC;
  - registra a hipótese de origem adquirida do intralobar (Frazier, Stocker et al., *Radiographics* 1997), com o contraponto do diagnóstico pré-natal de lesões intralobares;
  - corrige "quase sempre na base do pulmão esquerdo" para "quase sempre num lobo inferior, sobretudo à esquerda".
- **Gabarito (d) mantido.** "Explicação embriológica" restringe a resposta a mecanismos do desenvolvimento, e só (d) explica o quadro.

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-14-q27 | contexto, explicacao, referencia | Massa "no lobo inferior esquerdo", com artéria da aorta; explicação dava a origem por broto acessório como certa e "quase sempre na base do pulmão esquerdo" | Massa "dentro do lobo inferior esquerdo", "drenada pelas veias pulmonares"; teoria do broto acessório (antes/depois da pleura → intra/extralobar), hipótese adquirida do intralobar com contraponto pré-natal; "quase sempre num lobo inferior, sobretudo à esquerda" | Vinheta ambígua entre intra e extralobar, e mecanismo controverso para o intralobar apresentado como certo | importante | Moore 11ª ed., cap. 10; Sadler 14ª ed., cap. 14; Frazier AA, Rosado de Christenson ML, Stocker JT, Templeton PA, *Radiographics* 1997;17(3):725–745 |
| emb-11-q26 | explicacao, referencia (+ `referencias`) | Toda a hipoplasia atribuída à compressão | Acrescentado: modelos experimentais sugerem que os dois pulmões já crescem menos antes da herniação (duplo golpe), e a compressão agrava, sobretudo do lado da hérnia | Precisão fisiopatológica (explica também a hipoplasia contralateral) | menor | Keijzer R et al., *Am J Pathol* 2000;156(4):1299–1306 |
| emb-12-q27 | explicacao, referencia (+ `referencias`) | Refutação de (a): "as glândulas da 4ª bolsa migram pouco" | Acrescentado: as superiores ectópicas tendem ao espaço retrofaríngeo/retroesofágico e ao mediastino posterior, e as duas superiores foram encontradas | A paratireoide superior também pode chegar ao mediastino (posterior); a refutação precisava do dado da vinheta | menor | Phitayakorn R, McHenry CR, *Am J Surg* 2006;191(3):418–423 (resumo) |
| emb-12-q30 | explicacao, referencia (+ `referencias`) | "linfopenia T, ausência de sombra tímica"; fenda palatina sem qualificação | "sombra tímica pequena ou ausente; em geral hipoplasia, aplasia completa rara"; anomalias palatais mais comuns da 22q11.2: insuficiência velofaríngea e fenda submucosa, fenda franca menos frequente | Precisão pediátrica (o aluno tende a esperar aplasia tímica e fenda franca) | menor | McDonald-McGinn DM et al., *Nat Rev Dis Primers* 2015;1:15071 |
| emb-13-q26 | explicacao, referencia (+ `referencias`) | Só ISUOG 2023 para os cortes das vias de saída | + Diretriz Brasileira de Cardiologia Fetal (SBC, 2019) | Diretriz brasileira preferível; ela inclui as vias de saída na ultrassonografia morfológica | menor | Pedra SRFF et al., *Arq Bras Cardiol* 2019;112(5):600–648 |
| emb-13-q28 | explicacao, referencia (+ `referencias`) | "O oxigênio (b) favorece a constrição do canal e não reabre o forame oval" | + "em concentração alta, ainda reduz a resistência vascular pulmonar e desvia para os pulmões o débito do VD, piorando a perfusão sistêmica"; + Manual SBP 2022 | Ponto clínico central do manejo inicial da cardiopatia com fluxo sistêmico dependente do canal | menor | SBP, Departamentos Científicos de Cardiologia e Neonatologia, Manual de Orientação, 2022 (por fontes secundárias); fisiologia do balanço Qp/Qs |
| emb-14-q24 | explicacao, referencia (+ `referencias`) | Só o ganho de sobrevida no TOTAL (HDC esquerda grave) | + "na forma moderada não houve ganho significativo de sobrevida, e nos dois ensaios a oclusão aumentou a rotura prematura de membranas e o parto prematuro" | O ensaio é restrito; a terapia tem custo obstétrico | menor | Deprest JA et al., *N Engl J Med* 2021;385:107–118 e 119–129 |
| emb-14-q25 | alternativa (a), explicacao, referencia (+ `referencias`) | (a) "combinação não aleatória, sem causa única conhecida"; Fanconi citada sem dizer como afastá-la | (a) "Associação VACTERL, diagnóstico de exclusão: sem causa única conhecida…"; explicação: Fanconi rastreada pelo teste de fragilidade cromossômica (DEB/MMC), porque o hemograma normal ao nascer não a exclui; o ecocardiograma também define o lado do arco aórtico | Rigor diagnóstico (diagnóstico diferencial com anemia de Fanconi) e pré-operatório; letra e comprimento mantidos | menor | Solomon BD, *Orphanet J Rare Dis* 2011;6:56; Fanconi Anemia Research Fund, *Clinical Care Guidelines*, 5ª ed., 2020 |
| emb-15-q26 | contexto, explicacao, referencia (+ `referencias`) | "Na laparotomia…"; "vômito bilioso exige excluir volvo com urgência" | "Na laparotomia de urgência…"; "o volvo é emergência cirúrgica: após reanimação rápida, laparotomia imediata, com distorção das alças e procedimento de Ladd" | A conduta de emergência não estava explícita | menor | Holcomb GW III, Murphy JP, St Peter SD, *Holcomb and Ashcraft's Pediatric Surgery*, 7ª ed., 2019, cap. 31 (Malrotation) |

Registros em `incertezas` (não contados como correção):
- **emb-11:** duplo golpe (modelo animal, não comprovado em humanos); TOTAL grave × moderado; "raízes vizinhas, com C5 em comum".
- **emb-12:** padrão de ectopia das paratireoides; 22q11.2 (timo e palato), conferido por fontes secundárias.
- **emb-13:**
  - diretriz brasileira de cardiologia fetal (texto integral não aberto);
  - Manual SBP 2022 (PDF não aberto);
  - PGE1 qualitativa, sem dose;
  - alerta sobre o oxigênio.
- **emb-14:**
  - TOTAL moderado;
  - rastreamento de Fanconi (diretrizes FARF, por fontes secundárias);
  - **decisão sobre o sequestro intralobar**.
- **emb-15:** volvo como emergência (Holcomb e Ashcraft, 7ª ed.; a 8ª ed., de 2026, não foi consultada); a extensão real da necrose varia com o grau e a duração da torção.

## 3. Pontos para o revisor humano

1. **emb-14-q27 (sequestro intralobar).** Confirmar a decisão de manter a vinheta intralobar, com a explicação que expõe a teoria do broto acessório e a hipótese adquirida.
   - A alternativa seria trocar o caso por um sequestro extralobar: achado pré-natal, pleura própria, drenagem para a ázigo/hemiázigo. Esse caso é inequivocamente congênito, mas é menos típico da criança com pneumonias de repetição.
   - A frase sobre o diagnóstico pré-natal de lesões intralobares não traz números, porque não conferi uma série específica.
2. **emb-15-q26 (extensão do volvo).** A questão cobra o território anatômico da AMS (do duodeno distal à papila até cerca de 2/3 do transverso). Na prática cirúrgica, a necrose costuma ser descrita do jejuno a meados do transverso, e não confirmei se a irrigação colateral pelas arcadas pancreaticoduodenais costuma preservar o duodeno distal. Não pus essa afirmação no texto do aluno. Conferir se convém precisar a alternativa (c) ou a explicação.
3. **emb-13-q28 e q26 (diretrizes brasileiras).** Nesta sessão, a rede bloqueou `sbp.com.br` e `pmc.ncbi.nlm.nih.gov`.
   - Manual de Orientação da SBP (2022): título, autoria e a classificação da SHCE entre as lesões com fluxo sistêmico dependente do canal foram conferidos por fontes secundárias. O trecho sobre a PGE1 não foi lido.
   - Diretriz Brasileira de Cardiologia Fetal (2019): a inclusão das vias de saída na ultrassonografia morfológica foi conferida por trechos indexados.
   - Conferir os dois textos integrais.
4. **emb-14-q25 (Fanconi).** O rastreamento pelo teste de fragilidade cromossômica, independentemente do hemograma, segue as diretrizes do Fanconi Anemia Research Fund (5ª ed., 2020), conferidas por fontes secundárias. Conferir com o revisor de genética. A afirmação sobre o lado do arco aórtico no pré-operatório da atresia de esôfago segue a prática corrente de cirurgia pediátrica.
5. **emb-12-q30 (22q11.2).** A hipoplasia tímica (aplasia rara) e o predomínio da insuficiência velofaríngea e da fenda submucosa seguem McDonald-McGinn et al. (2015), conferidos por fontes secundárias. Não pus frequências no texto do aluno.
6. **emb-11-q26 (duplo golpe).** A hipótese vem do modelo do nitrofeno em ratos (Keijzer et al., 2000). O texto diz "modelos experimentais sugerem".
7. **Pendências da 1ª etapa que continuam abertas:**
   - texto impresso de Moore, Dalley e Agur (8ª ed. brasileira);
   - papel exato do tensor e do levantador na tuba auditiva (emb-12-q28);
   - texto integral da ISUOG 2023.
8. **Fora do escopo, não alterado.** A correlação clínica de emb-14 (conteúdo anterior) diz que o sequestro fica "quase sempre na base do pulmão esquerdo", segundo Moore. A explicação da q27 agora diz "quase sempre num lobo inferior, sobretudo à esquerda". As duas frases são compatíveis, mas o revisor humano pode harmonizá-las.

## 4. Execução

```
$ cd /home/user/medgame && npm run validar-conteudo && npx vitest run
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.
 Test Files  6 passed (6)
      Tests  47 passed (47)
```
