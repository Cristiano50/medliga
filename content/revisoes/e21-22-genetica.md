# Revisão emb-21 e emb-22 — genética clínica (2ª etapa)

- Agente: `revisor-genetica-v1` · Área: `genetica-clinica` (genética clínica e dismorfologia) · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Etapa anterior: `content/revisoes/e21-22-embriologia.md` (`revisor-embriologia-v1`). O registro dela em `revisao.agentes` foi mantido intacto. O meu foi acrescentado depois dele.
- Arquivos editados: só `content/embriologia/topicos/emb-21-regulacao-molecular.json` e `content/embriologia/topicos/emb-22-crista-neural.json` (mais este relatório).
- **Situação: revisão por agente (IA).** Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos dois arquivos.
- Nenhum id foi alterado (tópicos, questões, estruturas, eventos, correlações). Nenhum gabarito, letra, ordem ou par foi alterado. A checagem automática foi feita contra o `HEAD` anterior às minhas edições (`3656b80`).
- **Não fiz commit.** Registro honesto: enquanto eu trabalhava, outra frente fez o commit `89aa3a8` ("2ª etapa concluída em 1–5, 11–20, emb-23/24…", 12:21:32). Ele incluiu as minhas edições de conteúdo nos dois arquivos, embora a mensagem não as mencione.
  - Os meus registros em `revisao.agentes` foram gravados logo depois e estão fora desse commit (alteração não commitada), assim como este relatório.
  - Conferi que o arquivo de trabalho contém todas as minhas edições e que `revisao.humano` segue `null`.
  - As alterações não commitadas em emb-06 e emb-07 não são minhas.
- **Células C da tireoide.** Não editei nada sobre elas. Conferi por script que nenhum texto afirma a camada de origem no ser humano. As duas únicas frases afirmativas são, de propósito, a alternativa errada (a) da q15 e a afirmação falsa da V/F q22.

## 1. Resumo

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-21 Regulação molecular | 29 (16 múltipla, 6 V/F, 4 ordenar, 3 associar; 8 com contexto) | 0 | 0 | 16 | 16 | aprovado-com-correcoes |
| emb-22 Crista neural | 29 (16 múltipla, 6 V/F, 4 ordenar, 3 associar; 8 com contexto) | 0 | 1 | 12 | 13 | aprovado-com-correcoes |

Gravidade (protocolo): **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, precisão, complemento, referência.

**Gabaritos.** Não encontrei fato errado nem gabarito errado nas 58 questões. Os genes centrais estavam corretos:
- SHH e DHCR7;
- FGFR3 com ganho de função;
- FGFR2 (Apert);
- PAX3 (Waardenburg tipo 1);
- PAX6;
- HOXD13 (expansão de poli-alanina);
- TBX5;
- RET com perda de função no Hirschsprung;
- TBX1;
- TCOF1;
- CHD7;
- NF1 e a via RAS.

O que corrigi foi sobretudo genética clínica incompleta ou ambígua: modo de herança, mutação nova e idade paterna, heterogeneidade de locus, método diagnóstico e terminologia de síndromes e de genes.

**Única correção importante (emb-22).** O texto da Treacher Collins dizia "herança autossômica dominante na maioria dos casos (TCOF1; mais raramente … POLR1D e POLR1C)". A leitura natural punha POLR1C entre os genes da forma dominante. Pela GeneReviews (atualização de 2024):
- POLR1C causa forma **autossômica recessiva** (variantes bialélicas), assim como uma parte dos casos de POLR1D;
- a forma dominante é TCOF1 e, mais raramente, POLR1D ou POLR1B.

O erro muda o aconselhamento: risco de 25% com pais não afetados, contra 50% com um genitor afetado.

**Letras e pistas.** A distribuição continua 4/4/4/4 (a/b/c/d) nos dois tópicos. Todas as explicações citam as quatro letras. Não alterei nenhuma alternativa, salvo a troca de caixa em emb-21-q10 (c). A única razão de comprimento acima de 1,35 continua sendo a emb-21-q14 (1,50): são nomes de genes (HOXD13 × PAX6/SOX10/RET), sem pista explorável, como já registrado na 1ª etapa.

### Conferidos sem erro (foco desta etapa)

- **Holoprosencefalia**: SHH, trissomia 13, diabetes materno e álcool; "a face prediz o cérebro".
- **SLO**: DHCR7, colesterol baixo e 7-desidrocolesterol alto; vinheta da q11 coerente.
- **Acondroplasia**: mecanismo de ganho de função (q12) correto; displasia tanatofórica no mesmo receptor.
- **Apert × Crouzon** (FGFR2); vinheta da q13 inequívoca.
- **Holt-Oram**: TBX5, raio pré-axial e cardiopatia septal (q08).
- **Lateralidade**: a cascata NODAL/LEFTY/PITX2 e ZIC3 estão corretos.
- **Isotretinoína**: fenótipo e mecanismo pelos receptores nucleares corretos.
- **Células-tronco e iPS**: conjunto de Yamanaka e citações corretas (Takahashi & Yamanaka 2006; Takahashi 2007; Yu 2007).
- **Imprinting**: q21 correta.
- **Hirschsprung**: RET com perda de função × NEM 2 com ganho de função; trissomia 21 e Waardenburg-Shah.
- **Waardenburg 4**: SOX10, EDNRB e EDN3 (q10).
- **CHARGE**: CHD7, canais semicirculares, sobreposição com 22q11.2 (q11).
- **Neuroblastoma**: MYCN, opsoclonia-mioclonia, massa que cruza a linha média; HVA/VMA como metabólitos.
- **Feocromocitoma**: metanefrinas plasmáticas; NEM 2, VHL e NF1.
- **NF1**: Schwann/melanócitos e neurofibromina como RAS-GAP (q14, q29).

## 2. Tabela de correções

### emb-21-regulacao-molecular

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| holoprosencefalia-shh-colesterol | descricao | "Associa-se a mutações de SHH, à trissomia 13…" | espectro (alobar, semilobar, lobar, microformas); SHH (gene mais frequentemente alterado) e ZIC2, SIX3, TGIF1; formas por SHH autossômicas dominantes com penetrância incompleta e expressividade variável (genitor portador com microforma ou sem sinal) | menor: o foco pedia genes e espectro; sem a penetrância incompleta o aluno erra o aconselhamento | Dubourg et al., Am J Med Genet C 2018; coerente com emb-18 |
| holoprosencefalia-shh-colesterol | mecanismo | SLO "compromete a modificação e a sinalização de SHH" | SLO autossômica recessiva; acúmulo de 7-DHC; compromete sobretudo a **resposta** das células-alvo (ativação de SMO depende de esteróis) | menor: precisão do mecanismo; o ligante é processado, o defeito é na resposta | Cooper et al., Nat Genet 2003 |
| acondroplasia-fgfr3 | descricao | "displasia esquelética letal (tanatofórica)"; sem herança | tanatofórica "em geral letal no período perinatal"; acondroplasia autossômica dominante, penetrância completa, quase sempre p.Gly380Arg, cerca de 80% de variante nova surgida no alelo paterno e associada à idade paterna | menor: foco da etapa; há sobreviventes de longo prazo na tanatofórica | Thompson & Thompson cap. 7; Goriely & Wilkie 2012 |
| craniossinostoses-fgfr2 | mecanismo | "Mutações em receptores FGFR (sobretudo FGFR2)…" | ganho de função; autossômica dominante; Apert quase sempre p.Ser252Trp ou p.Pro253Arg, em geral novas e paternas (idade paterna) | menor: precisão | Goriely & Wilkie 2012 |
| aniridia-pax6 | descricao + mecanismo | "pode fazer parte da **associação** WAGR (deleção 11p13…)" | **síndrome** WAGR (deleção de genes contíguos em 11p13 com PAX6 e WT1); herança AD com casos esporádicos; na aniridia esporádica, pesquisar deleção de WT1 (microarranjo, FISH ou MLPA) e, se presente, vigilância ultrassonográfica renal periódica; WT1 explica Wilms e anomalias geniturinárias | menor: em dismorfologia, "associação" designa agrupamento sem causa conhecida; WAGR é síndrome de genes contíguos. A conduta é a que muda o desfecho | Kalish et al., Clin Cancer Res 2017 |
| sinpolidactilia-hoxd13 | descricao | sem herança | autossômica dominante, expressividade variável | menor: complemento | Thompson & Thompson cap. 14 |
| heterotaxia-lateralidade | descricao + mecanismo | "Difere do situs inversus totalis, **de baixo risco**"; "genes como ZIC3" | "de risco cardíaco bem menor"; na discinesia ciliar primária (em geral autossômica recessiva), lateralidade aleatória: cerca de metade com situs inversus totalis (Kartagener) e minoria com heterotaxia; ZIC3 ligado ao X e genes dos cílios móveis | menor: "baixo risco" sem qualificação ignora que o situs inversus pode ser sinal de DCP; o foco pedia DCP | Shapiro et al., ATS 2018; coerente com emb-06 |
| emb-21-q08 | explicacao | Holt-Oram sem herança | "de herança autossômica dominante, o que explica os vários parentes afetados" | menor: a vinheta cita parentes afetados | Thompson & Thompson cap. 14 |
| emb-21-q09, q28; resumo; pontosChave; objetivos | enunciado, explicacao, par, texto | "gene T (Brachyury)", "T/Brachyury" | "TBXT (Brachyury, antes chamado T)", "TBXT (Brachyury)" | menor: símbolo HGNC atual é TBXT; o nome antigo foi mantido entre parênteses porque é o dos livros-texto | HGNC |
| emb-21-q10 | alternativa (c) + explicacao | "(Nodal/Lefty/Pitx2)"; "imagem em espelho de baixo risco" | "(NODAL/LEFTY/PITX2)" (paciente humano); "de risco cardíaco bem menor (que, porém, pode ser sinal de discinesia ciliar primária)" | menor: notação de gene humano; coerência com a correlação | HGNC; Shapiro 2018 |
| emb-21-q11 | explicacao | "o colesterol é necessário à modificação e à sinalização de SHH" | SLO autossômica recessiva; 7-DHC é o marcador diagnóstico (colesterol pode ser normal nas formas leves); colesterol necessário à modificação do ligante e à ativação de SMO, e na SLO o defeito é sobretudo na resposta | menor: o aluno precisa saber que colesterol normal não exclui SLO | Cooper 2003; literatura de genética clínica |
| emb-21-q13 | explicacao | "a maioria dos casos deriva de mutações em FGFR2" | "quase todos os casos devem-se a uma de duas variantes de FGFR2 com ganho de função (p.Ser252Trp ou p.Pro253Arg), em geral novas e de origem paterna" | menor: precisão | Goriely & Wilkie 2012 |
| emb-21-q14 | explicacao (d) | "RET associa-se… às neoplasias endócrinas múltiplas" | "…à neoplasia endócrina múltipla tipo 2 (ganho de função)" | menor: a NEM 1 é causada por MEN1, não por RET | Thompson & Thompson cap. 15 |
| emb-21-q16; notasDivergencia | contexto, nota iPS | "OCT4", "LIN28" | "OCT4 [gene POU5F1]", "LIN28 [LIN28A]" | menor: símbolos HGNC | HGNC |
| resumo; emb-21-q21 | resumo, explicacao, referencia | "(Prader-Willi/Angelman)"; "15q11-q13" | "em 15q11.2-q13, a perda da contribuição paterna causa Prader-Willi, e a da materna, Angelman"; q21 cita também T&T cap. 6 | menor: direção parental (o que se cobra em prova) e notação ISCN; coerente com emb-10 | Thompson & Thompson caps. 6 e 14 |
| emb-21 | referencias, notasDivergencia, incertezas | — | + T&T caps. 6 e 7; Goriely & Wilkie 2012; Dubourg 2018; Cooper 2003; Kalish 2017; Shapiro 2018; + nota de nomenclatura HGNC; + 2 incertezas (80% na acondroplasia; intervalos da vigilância de Wilms) | menor: fontes das afirmações acrescentadas | — |

### emb-22-crista-neural

| id | campo | antes (resumido) | depois (resumido) | motivo | fonte |
|---|---|---|---|---|---|
| treacher-collins-ribossomo; resumo | descricao; resumo | "herança autossômica dominante na maioria dos casos (TCOF1; mais raramente… POLR1D e POLR1C)" | dominante: TCOF1 (principal), mais raramente POLR1D ou POLR1B, com expressividade muito variável e grande parte de novo; minoria **autossômica recessiva** (bialélicos em POLR1C ou POLR1D); resumo cita POLR1B, POLR1C e POLR1D | **importante**: ambiguidade que ensina POLR1C como dominante; muda o risco de recorrência | GeneReviews, Treacher Collins (atualização 2024) |
| emb-22-q09 | explicacao + referencia | "…com inteligência normal e herança autossômica dominante" | "a mãe com traços mais leves ilustra a herança autossômica dominante com expressividade variável (risco de 50% a cada gestação)"; + GeneReviews | menor: a vinheta traz a mãe levemente afetada; é o ponto de aconselhamento | GeneReviews TCS |
| waardenburg-crista | descricao + mecanismo | "distopia dos cantos no tipo 1"; "MITF (tipo 2)"; "SOX10/EDNRB/EDN3 (tipo 4)" | distopia nos tipos 1 e 3, anomalias dos membros superiores no tipo 3; tipo 2 heterogêneo, com MITF **e SOX10**, entre outros; tipos 1 e 2 dominantes; no tipo 4, SOX10 dominante e EDNRB/EDN3 em geral recessivos | menor: o tipo 3 também tem distopia; SOX10 é tão frequente quanto MITF no tipo 2 (resolve o ponto 5 da 1ª etapa) | Pingault et al., Hum Mutat 2010 |
| doenca-hirschsprung-crista; resumo | descricao + mecanismo; resumo | sem herança; "gene RET (perda de função)…" | predomínio masculino; maioria isolada, herança complexa; RET como principal gene (variantes raras com perda de função e comuns de baixa penetrância); nas famílias, AD com penetrância incompleta e dependente do sexo; EDNRB/EDN3 em heterozigose (Hirschsprung isolado, baixa penetrância) × homozigose (Waardenburg-Shah); variantes de RET do éxon 10 causam Hirschsprung e NEM 2A | menor: o foco pedia herança; a dupla heterozigose × homozigose explica as duas apresentações | Amiel et al., J Med Genet 2008 |
| emb-22-q08 | explicacao | "o gene RET (perda de função) é a **principal causa**, ao contrário… das neoplasias endócrinas múltiplas (NEM 2)" | "RET é o principal **gene** associado…, embora a herança costume ser complexa; na NEM 2, ao contrário, ganho de função (algumas do éxon 10 causam as duas condições)" | menor: variantes codificantes de RET explicam a minoria dos casos esporádicos; precisão de NEM 2 | Amiel 2008 |
| delecao-22q11-crista-cardiaca; resumo; emb-22-q28 | titulo, descricao, mecanismo; resumo; par | "Deleção 22q11.2 (DiGeorge)"; sem herança nem diagnóstico; "gene TBX1" | "Síndrome da deleção 22q11.2"; acrescentados imunodeficiência T, hipocalcemia, insuficiência velofaríngea, dificuldades de aprendizagem e risco psiquiátrico; AD, maioria de novo; cariótipo não detecta, diagnóstico por microarranjo ou MLPA (FISH não detecta deleções atípicas fora da sonda); TBX1 expresso no endoderma/mesoderma faríngeos, não na crista (ação indireta) | menor: terminologia recomendada; o foco pedia FISH/MLPA/microarranjo e quadro; coerente com emb-12 e emb-10 | Thompson & Thompson cap. 6; Óskarsdóttir et al., Genet Med 2023 |
| charge-chd7 | mecanismo | "Mutações em CHD7…" | "Variantes patogênicas em CHD7 (herança autossômica dominante, na maioria de novo)…" | menor: complemento | Vissers et al., Nat Genet 2004 |
| neuroblastoma | descricao | sem genética nem rastreamento | minoria hereditária (ALK, PHOX2B); HVA/VMA apoiam o diagnóstico, mas o rastreamento de lactentes por esses metabólitos aumentou diagnósticos (sobretudo tumores de bom prognóstico) sem reduzir mortalidade e não é usado como rastreamento populacional | menor: o foco perguntava se a triagem é recomendada — **não é** (estudos de Quebec e da Alemanha) | Woods et al. e Schilling et al., NEJM 2002; Mossé et al., Nature 2008 |
| feocromocitoma; emb-22-q13 | descricao; explicacao | "NEM 2, VHL, NF1 e **paragangliomas** por mutações de SDHx" | "fração considerável hereditária: NEM 2 (RET), VHL, NF1 e síndromes de paraganglioma-feocromocitoma hereditário (SDHA, SDHB, SDHC, SDHD, SDHAF2), entre outras" | menor: SDHx também causa feocromocitoma suprarrenal | Lenders et al., Endocrine Society 2014 |
| neurofibromatose-nf1 | descricao | "risco de glioma óptico; herança autossômica dominante" | "glioma das vias ópticas"; AD com penetrância completa, expressividade muito variável, cerca de metade de novo; **critérios revisados de 2021** (sete critérios; dois ou mais sem genitor afetado, um com genitor afetado; anomalias da coroide e variante patogênica de NF1 incluídas); síndrome de Legius (SPRED1) quando só há manchas e efélides | menor: o foco pedia os critérios de 2021 | Legius et al., Genet Med 2021 |
| emb-22-q12 | contexto | "e, **por vezes**, movimentos oculares caóticos" | "e movimentos oculares rápidos e caóticos com mioclonias (opsoclonia-mioclonia)" | menor: "por vezes" não cabe na vinheta de um paciente | — |
| resumo; pontosChave; e22-especificacao; emb-22-q23 | texto | "SNAIL2/SLUG", "SNAIL2" | "SNAI2/SLUG", "SNAI2" | menor: símbolo HGNC | HGNC |
| emb-22 | referencias, notasDivergencia, incertezas | — | + 10 referências (T&T cap. 6; Óskarsdóttir 2023; Amiel 2008; Pingault 2010; Vissers 2004; GeneReviews TCS; Legius 2021; Lenders 2014; Woods/Schilling 2002; Mossé 2008); + nota de nomenclatura; incertezas de Waardenburg e PPGL atualizadas; + 2 incertezas (ATA/éxon 10; rastreamento de neuroblastoma e proporções) | menor: fontes das afirmações acrescentadas | — |

### Coerência com outros tópicos (não editados)

- **emb-12** (Treacher Collins): diz "autossômica dominante (geralmente TCOF1)", o que é correto. Sugere-se mencionar a forma recessiva (POLR1C/POLR1D), como na emb-22.
- **emb-12** (22q11.2): cita "microarranjo cromossômico ou FISH". É coerente com a emb-22, que acrescenta MLPA e a limitação do FISH.
- **Sem conflito** com:
  - emb-18: SHH como causa monogênica mais frequente; colesterol necessário à sinalização;
  - emb-19: acondroplasia de novo com idade paterna; FGFR2 em Apert e Crouzon; TBX5 em Holt-Oram;
  - emb-06: DCP com cerca de metade em situs inversus;
  - emb-10: imprinting em 15q11.2-q13.
- **Nenhum outro tópico** usa "associação WAGR", "T/Brachyury", "SNAIL2" ou "neoplasias endócrinas múltiplas" ligado a RET (busca por script).

## 3. Pontos para o revisor humano

1. **Fontes que não pude abrir.** Nesta sessão, PubMed e NCBI Bookshelf estavam bloqueados pela rede.
   - Confirmadas por busca na web: Legius et al. 2021 (critérios e citação); GeneReviews de Treacher Collins (genes e modos de herança, atualização de 2024); Óskarsdóttir et al. 2023 (citação).
   - Citadas de memória, a conferir (volume e páginas): Goriely & Wilkie 2012, Dubourg 2018, Cooper 2003, Kalish 2017, Shapiro 2018, Amiel 2008, Pingault 2010, Vissers 2004, Lenders 2014, Woods e Schilling 2002, Mossé 2008.
   - O conteúdo genético afirmado é o consenso dos livros de genética clínica.
2. **Acondroplasia, "cerca de 80%" de variantes novas.** Número consagrado em T&T e na GeneReviews. Conferir na edição brasileira adotada (registrado em `incertezas`).
3. **WAGR.** O texto indica pesquisar deleção de WT1 na aniridia esporádica e fazer vigilância renal "periódica na infância", sem intervalo nem idade de término. Esses parâmetros variam entre consensos (AACR/Kalish 2017 e consensos europeus). Decidir se convém fixá-los.
4. **Feocromocitoma e paraganglioma.**
   - A diretriz da Endocrine Society (2014) recomenda considerar teste genético germinativo em todos os pacientes. A conduta ficou só em `incertezas`, não no texto do aluno.
   - Conferir se a diretriz foi atualizada e decidir se a conduta deve entrar.
5. **Hirschsprung e éxon 10 de RET.**
   - Resumos secundários indicam que a diretriz da ATA (2015) trata da pesquisa do éxon 10 de RET em pacientes com Hirschsprung. Não pude abrir o texto integral.
   - O tópico afirma só o fato genético (variantes do éxon 10 causam as duas condições), sem conduta.
6. **Neuroblastoma.**
   - O texto diz que o rastreamento populacional por HVA/VMA não reduziu a mortalidade e não é usado. Não encontrei diretriz brasileira específica.
   - A vigilância em síndromes de predisposição (ALK, PHOX2B e outras) não foi incluída.
7. **Smith-Lemli-Opitz.** Adotei o mecanismo de Cooper et al. (2003): o defeito está sobretudo na resposta ao SHH (SMO). Os livros-texto simplificam para "o colesterol modifica o SHH". As duas ideias aparecem na q11. Confirmar se a redação é adequada ao nível do aluno.
8. **Holoprosencefalia.** "SHH, o gene mais frequentemente alterado" segue emb-18 e a literatura. Algumas séries mostram ZIC2 e SIX3 com frequências próximas.
9. **Nomenclatura HGNC.**
   - Usei TBXT, POU5F1, LIN28A e SNAI2, com o nome dos livros entre parênteses.
   - Nomes de proteínas (Nodal, Lefty, Patched, Smoothened) e de genes de modelos animais (Pax6, Sox17, Wnt1) foram mantidos onde se referem a proteínas ou a experimentos.
   - Decidir se o padrão "símbolo HGNC + nome antigo" deve valer para toda a disciplina.
10. **NF1.** Os critérios de 2021 ficaram na descrição da correlação clínica, que ficou longa. Não criei questão nova sobre eles, pois isso estaria fora do escopo de correção.
11. **Pontos da 1ª etapa** (células C; Wallace & Burns; capítulos do Sadler): continuam válidos. Não os alterei. O ponto 5 (genes do Waardenburg tipo 2) foi resolvido nesta etapa (SOX10 no corpo do texto).

## 4. Verificação

```
$ cd /home/user/medgame && npm run validar-conteudo
Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.

$ npx vitest run
      Tests  47 passed (47)
```

Checagem por script, comparando com `HEAD`. Scripts em `/tmp/claude-0/-home-user/dffebdf6-4feb-54e6-87ea-f3ab03870b86/scratchpad/rev-e2122-gen/` (fora do repositório).
- Ids de tópicos, questões, estruturas, eventos e correlações: iguais.
- `correta`, `ordemCorreta`, ids de alternativas e itens, coluna direita dos pares: iguais.
- Letras a/b/c/d = 4/4/4/4 nos dois tópicos; todas as explicações de múltipla escolha citam as quatro letras.
- Razão de comprimento > 1,35 só na emb-21-q14 (nomes de genes, como antes).
- `revisao.humano` = `null` nos dois arquivos. `revisao.agentes` = [`revisor-embriologia-v1`, `revisor-genetica-v1`].
- `resumo`: 603 palavras (emb-21) e 540 palavras (emb-22), dentro de 300–900.
