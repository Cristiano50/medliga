# Revisão AV3 — embriologia, camada avançada (tópicos 11 a 15)

- Agente: `revisor-embriologia-avancado-v1` (1ª etapa, área embriologia)
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md`
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas em `referencias`, `notasDivergencia` e `incertezas`:
  - `emb-11-cavidades-diafragma.json` (q26–q30)
  - `emb-12-aparelho-faringeo.json` (q26–q30)
  - `emb-13-cardiovascular.json` (q26–q30)
  - `emb-14-respiratorio.json` (q24–q28)
  - `emb-15-digestorio.json` (q26–q30)
- As questões e os textos anteriores não foram mexidos. Nenhum id foi alterado. Nenhum arquivo fora desses cinco (e deste relatório) foi editado. `revisao.humano` continua `null` nos cinco arquivos. Não houve commit.

## 1. Resumo

Foram revisadas 25 questões: 17 de múltipla escolha, 3 de ordenar e 5 de associar. Todas eram de dificuldade 4–5. Nenhum gabarito estava errado. Em todas as questões de ordenar, refiz a sequência, e todas estavam corretas e sem margem de dúvida.

Uma checagem por script confirmou quatro pontos:
- toda explicação de múltipla escolha cita as quatro letras;
- os ids das alternativas são a, b, c, d, nessa ordem;
- não há pista de comprimento (diferença máxima de cerca de 25 caracteres entre alternativas, e nunca a favor da correta);
- as letras corretas da camada avançada estão distribuídas em cada tópico, e nenhum tópico passa de 40% numa letra.

| Tópico | Questões avançadas | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-11 Cavidades corporais e diafragma | 5 | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| emb-12 Aparelho faríngeo | 5 | 0 | 0 | 0 | 0 | aprovado |
| emb-13 Sistema cardiovascular | 5 | 0 | 0 | 0 | 0 | aprovado |
| emb-14 Sistema respiratório | 5 | 0 | 1 | 4 | 5 | aprovado-com-correcoes |
| emb-15 Sistema digestório | 5 | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **1** | **7** | **8** | |

Gravidade:
- **crítica**: fato errado ou gabarito errado;
- **importante**: ambiguidade, distrator defensável ou explicação incorreta;
- **menor**: redação, terminologia, precisão ou referência.

Nos cinco arquivos, a frase "ainda sem revisão por agente" da nota da camada avançada foi trocada pelo status da revisão. Essa troca não foi contada como correção.

### Pontos de incerteza do redator, conferidos

- **Inervação das pleuras (emb-11 q30): correta.**
  - A pleura costal e a parte periférica da diafragmática são inervadas pelos intercostais, com dor referida à parede toracoabdominal.
  - A parte central da diafragmática e a pleura mediastinal são inervadas pelo frênico, com dor referida ao ombro.
  - A pleura visceral não tem sensibilidade dolorosa.
  - Isso é coerente com a origem da margem do diafragma na parede lateral do corpo (9ª–12ª semana; Moore, cap. 8) e com o resumo do tópico.
- **Bolsa omental (emb-11 q28): correta.**
  - Forma-se por fendas no mesogástrio dorsal, que a rotação gástrica amplia; o lado direito original do estômago passa a ser a parede posterior.
  - O forame omental é limitado à frente pela borda livre do ligamento hepatoduodenal.
  - A perfuração de úlcera da parede posterior do estômago se acumula primeiro na bolsa.
- **Conteúdo dos ligamentos (emb-11 q29): correto**, conforme Moore, Dalley e Agur:
  - gastroesplênico: vasos gástricos curtos e gastromentais esquerdos;
  - esplenorrenal: vasos esplênicos e cauda do pâncreas;
  - hepatoduodenal: tríade portal;
  - mesentério: ramos jejunais e ileais da AMS;
  - mesocólon transverso: vasos cólicos médios.
- **Paralisia de Erb com lesão do frênico (emb-11 q27):**
  - Gabarito correto: frênico C3–C5, hemicúpula elevada e movimento paradoxal; o vago e os intercostais não dão inervação motora ao diafragma.
  - Corrigida a precisão das raízes (ver tabela): a raiz C5 é comum aos dois, não só "vizinha".
- **Facial intratemporal (emb-12 q26): correto.**
  - A lesão proximal ao nervo do estapédio e à corda do tímpano paralisa toda a hemiface, inclusive a fronte.
  - Causa hiperacusia e perda da gustação dos 2/3 anteriores da língua.
  - O V3 fica preservado (mastigação e sensibilidade geral).
  - O padrão central, que poupa a fronte, é usado corretamente como distrator.
- **Tensor e levantador do véu e tuba auditiva (emb-12 q28): correto.**
  - Tensor: 1º arco, V3. Levantador: 4º arco, ramo faríngeo do vago.
  - Moore, Dalley e Agur descrevem a abertura ativa da tuba pela ação conjunta dos dois músculos, o que sustenta a alternativa correta. A nota de divergência foi complementada com isso.
  - A citação de Heidsieck et al. (Clin Oral Investig 2016;20(7):1389–1401, PMID 27153847) foi conferida.
- **Fallot com corte de quatro câmaras normal (emb-13 q26): correto.**
  - O mecanismo é o desvio anterossuperior do septo conotruncal.
  - A transposição fica excluída pelo tronco pulmonar anterior e pela aorta que sai do VE.
  - O DSAV altera o corte de quatro câmaras.
  - Dados da diretriz ISUOG 2023 conferidos: Ultrasound Obstet Gynecol 2023;61(6):788–803, doi 10.1002/uog.26224. O texto integral não foi lido.
- **DSAV parcial (emb-13 q27): correto.**
  - Quadro: CIA ostium primum, fenda do folheto anterior da mitral, dois orifícios AV e septo interventricular íntegro.
  - Mecanismo: coxins deficientes que não se fundem ao septum primum.
  - A forma total (valva AV comum e CIV de via de entrada) é a típica da trissomia 21.
- **Atresia tricúspide com CIV (emb-13 q29): sequência refeita e inequívoca.**
  - Cavas → AD → comunicação interatrial (obrigatória) → AE → VE → CIV → VD hipoplásico → tronco pulmonar.
  - O enunciado especifica "com CIV e grandes artérias normais", e a nota já registra que em séries clínicas a CIV pode faltar.
- **Tipos de CIV × mecanismo (emb-13 q30): pares corretos e sem ambiguidade.**
  - Perimembranosa: falha da parte membranosa (coxins e cristas conotruncais).
  - Via de entrada: falha de fusão dos coxins AV.
  - Desalinhamento: Fallot.
  - CIV sob vaso único: falha das cristas truncais e conais (tronco arterial).
  - Musculares múltiplas: defeitos da parte muscular (Moore, cap. 13).
- **CHAOS × oclusão traqueal fetal (emb-14 q24): princípio correto.** O líquido pulmonar retido distende o pulmão e estimula seu crescimento. Precisado que o ensaio TOTAL incluiu só HDC esquerda grave.
- **VACTERL (emb-14 q25): correto.** Atresia de esôfago com fístula, malformação anorretal e defeito radial somam três componentes. Acrescentado que o diagnóstico exige afastar quadros sobrepostos (ver tabela).
- **Canalicular com 24 semanas de IG (emb-14 q26): gabarito correto** (≈22 semanas após a fertilização, canalicular tardio). Corrigida a refutação do período sacular (ver tabela).
- **Sequestro pulmonar (emb-14 q27): gabarito correto** segundo Moore (pulmão acessório na base esquerda, com irrigação sistêmica) e Sadler (broto respiratório adicional do intestino anterior). A origem discutida do sequestro intralobar foi registrada para o revisor humano.
- **Sequência de Potter (emb-14 q28): cadeia correta.** Broto ureteral → ausência de néfrons e de urina → oligoidrâmnio a partir do 2º trimestre → compressão e falta de líquido → insuficiência respiratória.
- **Volvo do intestino médio (emb-15 q26): correto.** Fica em risco todo o território da AMS, do duodeno distal à papila até cerca dos 2/3 proximais do transverso. O estômago (tronco celíaco) e o colo descendente (AMI) são poupados.
- **"Regra dos 2" do Meckel (emb-15 q27):** aparece expressamente como mnemônica aproximada ("ajuda a memorizar, mas é aproximada"). As distâncias seguem Moore (40–50 cm) e Sadler (40–60 cm), coerentes com a correlação e a questão já existentes no tópico.
- **3ª parte do duodeno × AMS (emb-15 q28): correto.** Rotação de 270° anti-horária: o ramo cranial volta primeiro, por trás da AMS, e o caudal passa à frente; a rotação reversa e a não rotação estão bem descritas. Precisado o conteúdo do ramo cranial.
- **Hemorroidas × linha pectínea (emb-15 q30): correto.**
  - Hemorroida interna: plexo retal interno, território visceral e indolor.
  - Hemorroida externa trombosada: plexo retal externo, nervo retal inferior (ramo do pudendo), dolorosa.
  - Irrigação: artéria retal superior (da AMI) × retais inferiores (da pudenda interna).

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-14-q26 | explicacao | "O período sacular (c) **mal começou**" com 24 semanas de IG | "O período sacular (c) **ainda não começou** (≈24ª/26ª semana após a fertilização)" | 24 semanas de IG ≈ 22 após a fertilização; pelas faixas do próprio tópico (Moore ~24, Sadler 26), o sacular ainda não começou. A explicação contradizia o resumo | importante | Moore 11ª ed., cap. 10; Sadler 14ª ed., cap. 14 |
| emb-11-q27 | alternativa (d) e explicacao | "frênico, formado por C3–C5, segmentos **vizinhos** aos lesados na paralisia de Erb" | "frênico (C3–C5), de raízes vizinhas **e em parte comuns** às da paralisia de Erb"; explicação: "têm C5 em comum com o plexo braquial"; "trajeto que reflete" → "origem que reflete" | C5 participa do frênico e da paralisia de Erb (C5–C6); "vizinhos" era impreciso | menor | Moore, Dalley e Agur, 8ª ed. (plexo braquial; nervo frênico) |
| emb-11-q26 | explicacao (refutação de d) | "Os brônquios lobares (d) surgem na 5ª semana, antes da herniação" | "Na 10ª semana o concepto já está no período fetal, e os brônquios lobares (d) surgiram na 5ª semana, antes de as vísceras chegarem ao tórax" | "Herniação" era ambígua com a herniação umbilical fisiológica, e faltava refutar o rótulo "período embrionário" | menor | Moore 11ª ed., cap. 6, 8 e 10 |
| emb-14-q24 | explicacao | oclusão traqueal "na hérnia diafragmática grave", com aumento da sobrevida no TOTAL | "na hérnia diafragmática **esquerda** grave" | O ensaio TOTAL (grave) incluiu só HDC esquerda; coerência com emb-11 | menor | Deprest et al., N Engl J Med 2021;385:107–118 |
| emb-14-q25 | explicacao, referencia (+ `referencias`) | (sem menção a diagnóstico diferencial) | Acrescentado: a associação só se firma depois de afastados quadros sobrepostos, como a anemia de Fanconi no defeito radial e as anomalias cromossômicas; referência Solomon 2011 incluída | Rigor clínico: defeito radial com VACTERL exige pensar em anemia de Fanconi | menor | Solomon BD, Orphanet J Rare Dis 2011;6:56 (lista de diagnósticos diferenciais) |
| emb-14-q28 | enunciado | "Ordene a cadeia de eventos que leva à hipoplasia pulmonar na agenesia renal bilateral" | "Na agenesia renal bilateral, ordene a cadeia de eventos que leva à hipoplasia pulmonar e à insuficiência respiratória ao nascer" | O último item (insuficiência respiratória) é posterior à hipoplasia, e o enunciado não o abrangia | menor | Moore 11ª ed., cap. 10 e 12 |
| emb-14 (camada avançada) | incertezas | nota sem menção ao sequestro intralobar | Acrescentado: o caso da q27 é sequestro intralobar; parte da literatura de patologia o considera adquirido, e as obras não distinguem intra de extralobar; conferir com o revisor humano | Registro de divergência relevante | menor | Moore 11ª ed., cap. 10; Sadler 14ª ed., cap. 14 |
| emb-15-q28 | explicacao | "o ramo cranial (duodeno distal e jejuno) volta primeiro" | "o ramo cranial (duodeno distal, jejuno **e parte do íleo**) volta primeiro" | Coerência com o resumo e com a estrutura da alça intestinal primária | menor | Sadler 14ª ed., cap. 15; Moore 11ª ed., cap. 11 |

## 3. Pontos para o revisor humano

1. **emb-14 q27 (sequestro pulmonar intralobar).** O gabarito segue a explicação embriológica clássica: broto acessório do intestino anterior (Moore, Sadler). A origem adquirida da maioria dos sequestros intralobares é defendida na literatura de patologia. Confirmar se a formulação "explicação embriológica mais provável" é aceitável, ou se a vinheta deveria descrever um sequestro extralobar (por exemplo, achado pré-natal, com pleura própria).
2. **emb-14 q25 (VACTERL).** A frase sobre afastar a anemia de Fanconi e as anomalias cromossômicas vem da literatura de genética (Solomon 2011), não das obras de embriologia. Conferir com o revisor de genética.
3. **emb-12 q28 (tuba auditiva na fenda palatina).** A disfunção é multifatorial. O papel exato do tensor e do levantador segue em discussão (Heidsieck et al. 2016 pede mais pesquisa). A questão cobra só o raciocínio anatômico. Conferir com otorrino/cirurgia craniofacial.
4. **emb-13 q26.** A afirmação de que o corte de quatro câmaras pode ser normal nos defeitos conotruncais apoia-se na diretriz ISUOG 2023. A referência bibliográfica foi conferida, mas o texto integral não foi lido.
5. **Anatomia do adulto (Moore, Dalley e Agur, 8ª ed. brasileira, 2019).** O texto impresso da edição brasileira não foi conferido. Isso vale para:
   - inervação das pleuras;
   - conteúdo dos ligamentos;
   - hemorroidas;
   - relações da 3ª parte do duodeno;
   - nervo facial;
   - músculos do palato mole.

   Todos estão de acordo com a anatomia-padrão, mas a página não foi checada.
6. **emb-13 q29.** Sadler descreve a atresia tricúspide "sempre" com CIV, mas em séries clínicas a CIV pode faltar. A questão especifica "com CIV" (nota já existente).

## 4. Execução

```
$ cd /home/user/medgame && npm run validar-conteudo && npx vitest run
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.
 Test Files  6 passed (6)
      Tests  47 passed (47)
```
