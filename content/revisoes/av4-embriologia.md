# Revisão por agente — camada avançada (AV4), área embriologia, 1ª etapa

- Agente: `revisor-embriologia-avancado-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` · Formato: `docs/conteudo-schema.md`
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 5 tópicos.
- Escopo: só a camada avançada (questões com a tag `"avancado"`) e as entradas novas em `referencias`, `notasDivergencia` e `incertezas` de `content/embriologia/topicos/` emb-16 a emb-20. As questões e os textos anteriores, que já passaram por duas etapas, não foram mexidos (auditoria contra o HEAD: só mudaram questões com a tag `avancado`, `incertezas` e `revisao.agentes`). Nenhum id foi alterado. Nenhum outro arquivo foi editado.

## 1. Resumo

| Tópico | Questões avançadas | Críticas | Importantes | Menores | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-16-urinario | q26–q30 (5) | 0 | 1 | 1 | 2 | aprovado-com-correcoes |
| emb-17-genital-diferenciacao-sexual | q24–q28 (5) | 0 | 1 | 4 | 5 | aprovado-com-correcoes |
| emb-18-sistema-nervoso | q25–q29 (5) | 0 | 0 | 3 | 3 | aprovado-com-correcoes |
| emb-19-musculoesqueletico-membros | q25–q29 (5) | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| emb-20-olho-orelha-tegumento | q25–q29 (5) | 0 | 0 | 2 | 2 | aprovado-com-correcoes |
| **Total** | **25** | **0** | **2** | **12** | **14** | |

Gravidades: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta; **menor** = redação, terminologia, referência, pista de comprimento, bloom.

**Nenhum gabarito estava errado e nenhum fato cobrado estava errado.** Nenhuma questão precisou ser reescrita, e nenhum gabarito mudou. Refiz as duas sequências (liquor, emb-18-q29; trajeto da luz, emb-20-q28), conferi as explicações letra a letra (todas citam a, b, c e d) e verifiquei os ids das alternativas (a–d, em ordem). A distribuição das letras corretas continua equilibrada nos 5 tópicos: nenhuma letra passa de 28%.

Os problemas encontrados foram de quatro tipos:
- duas refutações de distrator com problema: uma negava um fato verdadeiro (emb-16-q27, a AMI como fonte de irrigação do rim em ferradura) e outra se baseava num argumento que não cabia na vinheta (emb-17-q27, "antes da puberdade" para adolescentes de 16 anos);
- afirmações absolutas demais em explicações: andrógenos "sem papel" na fase transabdominal; arcos "não ossificados" no lactente; raízes que "não existem" descendo no canal cervical; lábios rômbicos só "formam o cerebelo";
- sistema de contagem da idade não explicitado em duas questões que contrastam idade gestacional e embrionária (emb-17-q25, emb-20-q25);
- pista de comprimento e bloom: em emb-20-q26, a correta era a mais curta (84 caracteres; as outras, 90–98) e a única sem "porque"; três itens de recordação/compreensão estavam como "analisar" ou "aplicar".

### Pontos de incerteza do redator: conferidos

| Ponto | Resultado |
|---|---|
| Weigert–Meyer (emb-16-q26) | Correto. Ureter do polo superior: orifício caudal e medial, com ureterocele ou ectopia. Ureter do polo inferior: orifício cranial e lateral, túnel submucoso curto, refluxo. O broto mais cranial no ducto mesonéfrico (que drena o polo superior) é levado caudalmente com o ducto. Sadler (cap. 16) descreve o broto anômalo que "desce com o ducto mesonéfrico". Fontes urológicas e radiológicas consultadas por busca concordam. Incerteza atualizada. |
| Artérias múltiplas no rim em ferradura (emb-16-q27) | O gabarito (a) está correto. A refutação de (c) dizia que a AMI "não é fonte da irrigação renal". Relatos cirúrgicos descrevem artérias vindas da aorta, das ilíacas e, como variação, da AMI. **Corrigido.** |
| Rim displásico multicístico com líquido normal (emb-16-q28) | Correto. A hipoplasia depende do oligoidrâmnio, não da doença renal. A placenta faz a excreção. |
| Artéria polar inferior terminal (emb-16-q30) | Correto. Moore: as artérias acessórias são terminais, e uma artéria para o polo inferior pode cruzar o ureter e causar hidronefrose. |
| Persistência dos ductos de Müller (emb-17-q24) | Correto (AMH ou AMHR2; testosterona e DHT normais). Acrescentada a referência ao consenso de 2006, que classifica a síndrome entre as DDS 46,XY. |
| Hipospádia proximal + gônadas impalpáveis → HAC em 46,XX (emb-17-q25) | Correto. Coerente com a diretriz da AUA (Kolon 2014: recém-nascido com testículos impalpáveis bilaterais → avaliar DDS) e com a SBP. Acrescentada a referência à AUA. |
| INSL3 × andrógenos (emb-17-q26) | O gabarito (b) está correto. A explicação dizia que a fase transabdominal "não depende dos andrógenos". Eles têm papel acessório (regressão do ligamento suspensor cranial), e o INSL3 é o fator principal. **Corrigido.** |
| Conduta gonadal: insensibilidade completa × Swyer (emb-17-q27) | Qualitativa, coerente com o consenso (risco baixo na insensibilidade completa; alto na disgenesia gonadal 46,XY). Nenhum percentual citado. O distrator (c) tinha problema. **Corrigido.** |
| Medula presa (emb-18-q25) | Correto. Cone em L4 é anormal no lactente. A explicação da janela ultrassonográfica foi precisada. |
| Núcleo do hipoglosso após a flexura pontina (emb-18-q26) | Correto. Placa basal; com a abertura do rombencéfalo ("livro aberto"), os núcleos motores ficam mediais aos sensitivos no assoalho do 4º ventrículo. Refutação de (d) completada. |
| Chiari II × MOMS (emb-18-q27) | Correto. Fechamento fetal antes de 26 semanas de IG: menos derivação ventricular e menos herniação do rombencéfalo, mais prematuridade. |
| Anencefalia com polidrâmnio × agenesia renal (emb-18-q28) | Correto. Equilíbrio entre urina fetal e deglutição. |
| Trajeto do liquor (emb-18-q29) | Sequência refeita: 2-6-4-1-5-7-3. Correta e inequívoca. |
| Hérnia C6–C7 → raiz C7 (emb-19-q25) | Correto. Alternativa e explicação precisadas. |
| Acondroplasia e forame magno (emb-19-q26) | Correto. Base endocondral (inclusive o occipital em torno do forame magno); abóbada intramembranosa relativamente poupada. |
| Ramos dorsais e latíssimo do dorso (emb-19-q27) | Correto. O latíssimo é músculo do membro: nervo toracodorsal, do plexo braquial (ramos ventrais). |
| Artérias segmentares × discos (emb-19-q28) | Correto (Sadler, cap. 10: as artérias intersegmentares passam a cruzar a parte média dos corpos; os nervos ficam junto aos discos). Terminologia alinhada com o resumo e a explicação. |
| Coloboma × exposição com 14 semanas de IG (emb-20-q25) | Correto. Fissura fechada na 7ª semana após a fertilização (≈ 9ª de IG). |
| Rubéola com 15 semanas (emb-20-q26) | Correto. Resumo de Miller et al. 1982 reconfirmado: defeitos em todos os infectados antes da 11ª semana; em 35% dos infectados com 13–16 semanas, só surdez; nenhum defeito atribuível em 63 crianças infectadas após a 16ª. Com 15 semanas de IG (≈ 13 semanas após a fertilização), a questão fica dentro da faixa de 13–16 semanas em qualquer dos dois sistemas de contagem. |
| Microtia com atresia do meato (emb-20-q27) | Correto. Perda condutiva; o labirinto membranáceo vem da vesícula ótica. |
| Retina invertida (emb-20-q28) | Correto. Sequência refeita: 2-6-4-1-5-7-3. |

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | gravidade | motivo | fonte |
|---|---|---|---|---|---|---|
| emb-16-q27 | explicacao (c) | "A AMI (c) é a estrutura que retém o istmo, não a fonte da irrigação renal" | "…retém o istmo; como variação, pode mandar algum ramo ao rim, mas não é a fonte habitual da irrigação nem substitui as artérias vindas da aorta" | importante | A explicação negava um fato verdadeiro: no rim em ferradura há artérias renais vindas da AMI como variação. O gabarito não muda, porque (c) diz "apenas" ramos da AMI e "sem artérias renais vindas da aorta" | Relatos de correção de aneurisma da aorta com rim em ferradura (ex.: J Vasc Bras, SciELO), consultados por busca; Moore, Dalley e Agur, 8ª ed. (Abdome) |
| emb-16-q30 | bloom | analisar | compreender | menor | V/F com dois fatos de Moore e uma consequência direta; não exige análise | — |
| emb-17-q27 | alternativas[c], explicacao (c) | "(c) Gonadectomia nas duas antes da idade da puberdade, porque o risco de gonadoblastoma é o mesmo"; refutação: "a retirada precoce… suprimiria a puberdade espontânea" | "(c) Vigilância sem gonadectomia nas duas, porque o risco tumoral é baixo nas duas condições"; refutação: o risco só é baixo na primeira, e nas gônadas em fita com Y ele é alto | importante | As duas pacientes têm 16 anos: "antes da idade da puberdade" era impossível na vinheta, e a refutação não se aplicava (a primeira já tem mamas). O novo distrator completa as combinações de conduta. Gabarito (d) mantido | Lee et al., Pediatrics 2006; Lee et al., Horm Res Paediatr 2016 |
| emb-17-q26 | explicacao (a, c) | Transabdominal: "depende do gubernáculo e do INSL3…, e não dos andrógenos; … pela mesma razão, não depende de andrógenos (c)" | "depende sobretudo do gubernáculo e do INSL3; os andrógenos têm nela papel apenas acessório (regressão do ligamento suspensor cranial)… (c) erra duas vezes: a fase não falhou e não depende principalmente dos andrógenos" | menor | Afirmação absoluta demais, e refutação circular de (c). Gabarito (b) mantido | Larsen 5ª ed., cap. 16; literatura sobre descida testicular (modelo de Hutson), consultada por busca |
| emb-17-q26 | enunciado | "…chegaram à região inguinal, mas não às saliências labioescrotais" | "…mas não aos lábios maiores (derivados das saliências labioescrotais)" | menor | Termo embrionário aplicado à anatomia de uma criança de 3 anos | Moore 11ª ed., cap. 12 |
| emb-17-q25 | alternativas[c], explicacao, referencia | "Feto 46,XX virilizado por HAC: as gônadas…"; "(9ª a 12ª semana, segundo Moore)" | "Criança 46,XX virilizada por HAC: gônadas…"; "(9ª a 12ª semana após a fertilização, segundo Moore)"; referência + Kolon et al., J Urol 2014 | menor | "Feto" para um recém-nascido de 2 dias; idade sem o sistema de contagem; a regra "gônadas impalpáveis bilaterais → investigar DDS" vem da AUA. O comprimento de (c) ficou dentro da faixa das outras (108 × 101–107) | Kolon et al., J Urol 2014; Moore 11ª ed., cap. 12 |
| emb-17-q24 | referencia | "Moore 11ª ed., cap. 12; Sadler 14ª ed., cap. 16" | + "Lee et al., Pediatrics 2006" | menor | A síndrome de persistência dos ductos de Müller (AMH/AMHR2) não é descrita em detalhe nos capítulos citados; o consenso de 2006 a classifica entre as DDS 46,XY | Lee et al., Pediatrics 2006 |
| emb-18-q25 | explicacao | "…porque os arcos posteriores ainda não se ossificaram" | "…porque os elementos posteriores das vértebras ainda estão pouco ossificados (processos espinhosos cartilagíneos e metades dos arcos ainda não fundidas)" | menor | As metades dos arcos já têm centros de ossificação desde a vida fetal. A janela acústica decorre da ossificação incompleta e da fusão ainda ausente (coerente com o resumo do emb-19) | Moore 11ª ed., cap. 14; Sadler 14ª ed., cap. 10 |
| emb-18-q26 | explicacao (d) | "Os lábios rômbicos (d)… formam o cerebelo." | Acrescenta que os neuroblastos alares que migram ventralmente no rombencéfalo formam núcleos de retransmissão (olivares, pontinos), não núcleos motores | menor | O distrator tinha uma parte verdadeira (migração ventral de neuroblastos alares), que a refutação não tratava | Sadler 14ª ed., cap. 18 |
| emb-18-q29 | bloom | aplicar | compreender | menor | Ordenar o trajeto do liquor é recordação/compreensão; não há caso a resolver | — |
| emb-19-q25 | alternativas[b], explicacao (d) | "(b) …cada nervo cervical sai acima da vértebra de mesmo número"; "raízes que descem pelo canal… não existem na região cervical" | "(b) …cada nervo de C1 a C7 sai acima…"; "o trajeto longo das raízes no canal é próprio da região lombossacra (cauda equina); na região cervical, as raízes são curtas e quase horizontais" | menor | O C8 não tem vértebra homônima; as raízes cervicais inferiores descem um pouco no canal, e a afirmação absoluta estava incorreta. Gabarito (b) mantido | Moore, Dalley e Agur, 8ª ed. (Dorso); Sadler 14ª ed., cap. 10 |
| emb-19-q28 | enunciado, bloom | "as artérias segmentares do tronco (como as intercostais posteriores e as lombares)"; bloom analisar | "as artérias intersegmentares do tronco (no adulto, as intercostais posteriores e as lombares)"; bloom compreender | menor | Terminologia: o resumo, a explicação e Sadler falam em artérias intersegmentares. Bloom: V/F de compreensão | Sadler 14ª ed., cap. 10 e 13 |
| emb-20-q25 | explicacao (a) | "reabertura das pálpebras, entre 26 e 28 semanas segundo Moore" | "…entre 26 e 28 semanas após a fertilização, segundo Moore" | menor | A questão contrasta idade gestacional e embrionária; a idade não especificada podia ser lida como IG | Moore 11ª ed., cap. 18; notasDivergencia do tópico (dias 182–196) |
| emb-20-q26 | alternativas[d] | "Surdez neurossensorial isolada; a orelha interna permanece suscetível por mais tempo" (84 caracteres) | "Surdez neurossensorial isolada, porque a orelha interna permanece suscetível por mais tempo" (91) | menor | Pista de comprimento (a correta era a mais curta; as outras tinham 90–98) e a única sem "porque". Sentido mantido | — |

### Registro nas incertezas (não contado como correção)

- emb-16, incerteza da q26: acrescentada a conferência da regra de Weigert–Meyer em fontes de urologia pediátrica e radiologia. A diretriz EAU/ESPU continua não conferida.
- emb-16, incerteza da q27: acrescentada a variação com artéria vinda da AMI e o ajuste da explicação.
- emb-17: nova incerteza da camada avançada, sobre o papel acessório dos andrógenos na fase transabdominal (q26) e a conduta gonadal qualitativa, sem percentuais (q27). O texto integral de Lee 2016 não foi conferido.
- emb-20, incerteza da q26: números do resumo de Miller 1982 reconfirmados. O sistema de contagem das semanas continua não confirmado.
- As entradas novas em `referencias` (Moore, Dalley e Agur 8ª ed. no emb-16, emb-18 e emb-19; Sadler cap. 13 no emb-19; Miller et al. 1982 no emb-20) estão corretas e sustentam os fatos novos. Não foram alteradas.

## 3. Pontos para o revisor humano

1. **Weigert–Meyer (emb-16-q26):** a regra vem da literatura urológica, não de Moore ou Sadler; Sadler só descreve o broto ectópico que desce com o ducto mesonéfrico. A conferência foi feita por resumos de busca (Pediatric Urology Book; Radiopaedia), sem a diretriz EAU/ESPU nem o Campbell-Walsh. Vale abrir uma das duas.
2. **Rim em ferradura (emb-16-q27):** a questão diz o que esperar ("várias artérias"), sem frequência. A frequência dos padrões arteriais (classificação de Graves) não foi conferida.
3. **Rim displásico multicístico (emb-16-q28):** a explicação não menciona que o rim contralateral tem anomalias associadas com alguma frequência (por exemplo, refluxo) e precisa de seguimento pós-natal. Isso não altera o gabarito. Não acrescentei por falta de fonte conferida para a frequência.
4. **Descida testicular (emb-17-q26):** o modelo de duas fases com INSL3 está no Larsen e na literatura de pesquisa (em boa parte, de modelos animais). Moore e Sadler enfatizam o gubernáculo e os andrógenos (já registrado em `notasDivergencia`). Confirmar se o curso-alvo cobra o INSL3.
5. **Conduta gonadal (emb-17-q27):** qualitativa, compatível com os consensos de 2006 e 2016. Recomendo conferir o texto integral de Lee et al. 2016 (e, se houver, documento brasileiro da SBP) antes da publicação, porque a conduta na insensibilidade completa aos andrógenos mudou nos últimos anos.
6. **Rubéola (emb-20-q26):** confirmar no texto integral de Miller 1982 se as semanas são contadas pela DUM. A questão continua correta nos dois sistemas.
7. **Dificuldade no limite inferior:** emb-18-q29 (trajeto do liquor), emb-19-q29 e emb-20-q29 (associar origens) e os V/F emb-16-q30 e emb-19-q28 são, na prática, de recordação ou compreensão. A dificuldade 4 é defensável só pela integração entre áreas. Não alterei a dificuldade, porque isso tiraria as questões do "Desafio avançado" (dificuldade 4–5); a decisão é editorial.
8. **Fora do escopo (texto já aprovado):** o resumo do emb-18 afirma, com Sadler, que as placas do teto e do assoalho "não têm neuroblastos". Na literatura de pesquisa, a placa do assoalho do mesencéfalo origina neurônios dopaminérgicos. Isso não afeta a q26, que trata do bulbo, mas talvez mereça uma nota de divergência numa próxima revisão do texto-base.
9. **Limitação de acesso:** a sessão não abre PubMed nem outros sites fora da rede permitida (falharam pubmed.ncbi.nlm.nih.gov e www.qxmd.com). As conferências externas desta revisão foram feitas por resumos de busca, não pelo texto integral.

## 4. Verificação

- `npm run validar-conteudo`: `Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 35; questões: 1026; escolas: 441.` (contagem do repositório inteiro, com os tópicos que outros agentes editam ao mesmo tempo)
- `npx vitest run`: `Test Files 6 passed (6) · Tests 47 passed (47)`. Numa execução intermediária, o teste geométrico `tests/escultura-embriao.test.ts` (modelo 3D da semana 8, sem relação com o conteúdo) falhou uma vez por lentidão (7,5 s, com outros agentes rodando em paralelo). Rodado isoladamente, passou (3/3). A suíte completa, rodada de novo, passou inteira.
- Auditoria contra o HEAD (script): nos 5 arquivos, só mudaram questões com a tag `avancado`, `incertezas` e `revisao.agentes`. Ids, ordem das questões, `referencias` e `notasDivergencia` ficaram iguais. `revisao.humano` = `null` nos 5.
