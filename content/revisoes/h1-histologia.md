# Revisão por agente — Grupo H1, área histologia (1ª etapa)

- Agente: `revisor-histologia-v1` · Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md` (área-mãe: histologia) · Formato: `docs/conteudo-schema.md` (seção "Histologia")
- Situação: **revisão por agente (IA)**. Nada aqui substitui a conferência médica. `revisao.humano` continua `null` nos 4 tópicos.
- Escopo: `content/histologia/topicos/` — his-01-metodos, his-02-epitelio-revestimento, his-03-epitelio-glandular, his-04-conjuntivo. Nenhum outro arquivo foi alterado. `content/histologia/laminas.json` foi só lido, para conferir coerência.
- Verificação depois das edições: `npm run validar-conteudo` → "Conteúdo OK — disciplinas: embriologia, histologia; tópicos: 30; questões: 783; escolas: 441". `npx vitest run` → 5 arquivos, 39 testes, todos passando.

## 1. Resumo

| Tópico | Questões (MC/VF/ord/assoc) | Críticas | Importantes | Menores | Veredito |
|---|---|---|---|---|---|
| his-01-metodos | 25 (14/5/3/3) | 0 | 1 | 5 | aprovado-com-correcoes |
| his-02-epitelio-revestimento | 25 (14/5/3/3) | 0 | 2 | 6 | aprovado-com-correcoes |
| his-03-epitelio-glandular | 25 (14/5/3/3) | 0 | 0 | 7 | aprovado-com-correcoes |
| his-04-conjuntivo | 25 (14/5/3/3) | 0 | 1 | 4 | aprovado-com-correcoes |
| **Total** | **100** | **0** | **4** | **22** | |

Gravidades: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou afirmação que induz erro; **menor** = redação, terminologia, referência.

**Não encontrei gabarito errado nem fato central errado.** Conferi todos os campos dos 4 tópicos: objetivos, resumo, pontos-chave, estruturas, eventos, correlações, referências, notas, incertezas e as 100 questões com explicações. Cada múltipla escolha tem uma única alternativa defensável, e as explicações citam as letras certas. Ordenações e associações não têm margem de dúvida. Os problemas foram:
- afirmações absolutas ou desatualizadas: capilar "nunca" no epitélio; macrófago "deriva do monócito" sem ressalva; S-100 descrito como marcador melanocítico;
- uma frase do resumo de his-02 que sugeria que carcinoma basocelular e urotelial vêm de metaplasia;
- imprecisões de terminologia e coerência com as lâminas: lâmina lúcida, "planura estriada", membrana basal espessa da traqueia, pericito, xeroftalmia;
- referências incompletas: Yamashina 1999, ASCO/CAP HER2.

### Distribuição das letras corretas (múltipla escolha)

| Tópico | a/b/c/d | Maior fatia |
|---|---|---|
| his-01 (14 MC) | 4/3/4/3 | 29% |
| his-02 (14 MC) | 3/4/4/3 | 29% |
| his-03 (14 MC) | 4/3/3/4 | 29% |
| his-04 (14 MC) | 3/4/4/3 | 29% |

Nenhuma letra passa de 40%, então não houve redistribuição.

## 2. Tabela de correções

### his-01-metodos

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| imuno-histoquimica-tumores | correlação.descricao | "marcadores melanocíticos como S-100 (melanoma)" | "S-100 e marcadores melanocíticos, como HMB-45 e Melan-A (melanoma)" | S-100 é sensível, mas não é específico de melanócitos (também marca células de Schwann, células de Langerhans, condrócitos etc.) | importante | Robbins 10ª ed. (pele; neoplasia) |
| his-01-metodos | resumo (HE) | "a hematoxilina comporta-se como corante básico" | acrescenta "na prática, a hemateína ligada a um mordente, em geral alumínio" | resolve a divergência Junqueira × Ross/Bancroft sem mudar as questões | menor | Ross 8ª ed., cap. 1; Bancroft 8th ed. |
| his-01-metodos | resumo (MEV) | "gera imagem tridimensional" | "gera imagem com aspecto tridimensional" | o MEV gera imagem 2D com relevo; agora coerente com q11 | menor | Ross 8ª ed., cap. 1 |
| fixacao-inadequada | correlação.descricao | "em até 1 hora após a retirada… 6 a 72 horas" | "o mais curto possível (no máximo 1 hora)… 6 a 72 horas" | redação da diretriz ("as short as possible"); faixa 6–72 h confirmada | menor | ASCO/CAP ER/PgR 2020; HER2 2018 |
| his-01-metodos | referencias | só a diretriz ER/PgR | + Wolff AC et al., HER2, J Clin Oncol 2018 | o texto cita HER2, mas faltava a diretriz de HER2 | menor | ASCO/CAP HER2 2018 |
| his-01-q07 | explicacao | "corte de congelação (de tecido fixado…)" | "(de tecido fresco ou fixado em formol…)" | o Sudan/óleo vermelho O é feito também em tecido fresco congelado | menor | Bancroft 8th ed. |
| his-01-metodos | referencias[0].capitulo | "1 — Métodos de estudo em histologia" | "1 — Histologia e seus métodos de estudo" | título do cap. 1 de Junqueira (13ª ed.; conferir na 14ª) | menor | Junqueira 13ª ed. |
| his-01-metodos | notasDivergencia / incertezas | — | atualizadas (hematoxilina; ASCO/CAP com o que foi e o que não foi confirmado) | registro | — | — |

### his-02-epitelio-revestimento

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| capilar | estrutura.definicao | "nunca entre as células epiteliais" | "em regra não penetra… (exceção clássica: estria vascular da cóclea)" | a estria vascular é um epitélio com capilares intraepiteliais; "nunca" é falso | importante | Ross 8ª ed. (orelha); Junqueira 14ª ed. (audiorreceptor) |
| his-02-epitelio-revestimento | resumo (correlações) | "Metaplasia… carcinoma (neoplasia maligna epitelial: epidermoide, basocelular, urotelial)" | "carcinoma — nome de toda neoplasia maligna epitelial (…), que nem sempre é precedida de metaplasia" | a frase sugeria que basocelular e urotelial surgem de metaplasia | importante | Robbins 10ª ed. (neoplasia) |
| his-02-epitelio-revestimento; lamina-basal | resumo; estrutura.definicao | "com lâmina lúcida e lâmina densa" | lâmina densa + "lâmina lúcida, que pode ser artefato de fixação" | coerência com a nota de divergência (Ross: ausente em material congelado rapidamente) | menor | Ross 8ª ed., cap. 5 |
| his-02-epitelio-revestimento; epitelio-estratificado-pavimentoso; his-02-q18 | resumo; definicao; explicacao | "não queratinizado: boca, esôfago, vagina" | "maior parte da boca… (gengiva e palato duro queratinizados ou paraqueratinizados)" | a mucosa mastigatória é queratinizada | menor | Junqueira 14ª ed. (trato digestivo); Ross 8ª ed., cap. 16 |
| discinesia-ciliar-primaria; his-02-q09 | titulo; descricao; explicacao | "(síndrome de Kartagener)"; "espermatozoides imóveis"; "cerca de metade" | "e síndrome de Kartagener"; "infertilidade masculina frequente (flagelos imóveis ou discinéticos)"; "40–50%" | Kartagener é um subgrupo da DCP; séries clínicas dão 38–48% de situs inversus total | menor | Robbins 10ª ed.; séries PMID 17515466 e 36342963 |
| membrana-basal | estrutura.definicao | "PAS-positiva" | + "em geral pouco visível na HE (na traqueia e nos brônquios é espessa e eosinófila)" | coerência com a lâmina `epitelio-pseudoestratificado-traqueia` | menor | Junqueira 14ª ed. (respiratório) |
| borda-em-escova | sinonimos | ["borda estriada"] | + "planura estriada" | termo usado na lâmina `epitelio-cilindrico-intestino` | menor | laminas.json |
| his-02-epitelio-revestimento | notasDivergencia | "ACG exigem… BSG aceita" | "ACG, 2022… BSG, 2014" | anos das diretrizes | menor | ACG 2022 (Shaheen et al.); BSG 2014 (Fitzgerald et al.) |
| his-02-epitelio-revestimento | notasDivergencia / incertezas | — | nova nota sobre situs inversus; incerteza correspondente resolvida | registro | — | — |

### his-03-epitelio-glandular

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| sindrome-de-sjogren | correlação.descricao | "olho seco (xeroftalmia)" | "olho seco (ceratoconjuntivite seca)" | em português, "xeroftalmia" designa sobretudo a lesão ocular da hipovitaminose A | menor | Robbins 10ª ed. (doenças imunes) |
| epitelio-simples-cilindrico | estrutura.definicao | "Epitélio de revestimento do intestino em que…" | definição geral + o caso do intestino | a definição restringia o tipo de epitélio ao intestino | menor | Junqueira 14ª ed., cap. 4 |
| lamina-propria | estrutura.definicao | "glândulas mucosas simples (como as intestinais)" | "glândulas simples da mucosa" | as glândulas intestinais não são "mucosas" no sentido de secreção | menor | Junqueira 14ª ed. (trato digestivo) |
| granulos-de-zimogenio | estrutura.definicao | "com precursores de enzimas" | "com enzimas ou seus precursores inativos (zimogênios, como no pâncreas)" | os grânulos serosos salivares contêm amilase ativa | menor | Ross 8ª ed., cap. 16 |
| borda-em-escova | sinonimos | ["borda estriada"] | + "planura estriada" | coerência com a lâmina | menor | laminas.json |
| his-03-q12 | explicacao | "O carcinoma basocelular (c) nasce na epiderme" | "origina-se de células basais da epiderme ou do folículo piloso" | coerência com a nota de divergência de his-02 | menor | Robbins 10ª ed. (pele) |
| referência Yamashina | referencias.obra; incertezas | "Arch Histol Cytol, 1999" (sem volume) | "Arch Histol Cytol. 1999;62(4):347-354. doi:10.1679/aohc.62.347" | referência completa (incerteza resolvida) | menor | J-STAGE / DOI 10.1679/aohc.62.347 |

### his-04-conjuntivo

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| his-04-conjuntivo; macrofago; his-04-q24 | resumo; pontosChave; estrutura.origem; par e explicação da q24 | "Macrófago: deriva do monócito" | "os recrutados derivam de monócitos; parte dos residentes vem de precursores embrionários" | a afirmação categórica contradizia a própria nota de divergência; a origem embrionária de parte dos macrófagos residentes é consenso atual | importante | Ross 8ª ed., cap. 6; literatura de ontogenia de macrófagos |
| his-04-conjuntivo; capilar; his-04-q18 | resumo; definicao; explicacao | leucócitos "migram dos capilares" | "sobretudo pelas vênulas pós-capilares" | a diapedese ocorre principalmente nas vênulas pós-capilares | menor | Junqueira 14ª ed., cap. 5; Robbins 10ª ed. (inflamação) |
| celula-mesenquimal | sinonimos; definicao | sinônimo "pericito (em torno de capilares)" | sinônimo removido; definição diz que o pericito é célula distinta, com potencial semelhante | pericito não é sinônimo de célula mesenquimal indiferenciada | menor | Junqueira 14ª ed., cap. 5; Ross 8ª ed., cap. 6 |
| his-04-q08 | explicacao | tipo III "se manifesta em dias" | "horas (reação de Arthus) a dias (doença do soro)" | a reação de Arthus surge em horas | menor | Robbins 10ª ed. (hipersensibilidade) |
| his-04-conjuntivo | resumo (síntese) | "as cadeias α são produzidas no RER" | "as cadeias pró-α…" | terminologia, coerente com eventos e q20 | menor | Ross 8ª ed., cap. 6 |
| his-04-conjuntivo | notasDivergencia | — | nota sobre a origem dos macrófagos atualizada | registro | — | — |

## 3. Pontos para o revisor humano

1. **Capítulos citados de memória.** As edições anteriores confirmam a estrutura de Junqueira (cap. 1 "Histologia e seus métodos de estudo", 4 epitelial, 5 conjuntivo, 16 glândulas do tubo digestivo, 18 pele). As de Ross também (cap. 1 métodos, 2 citoplasma, 5 epitelial, 6 conjuntivo, 15 tegumentar, 16 cavidade oral e glândulas salivares, 18 fígado, vesícula e pâncreas). Uma página de curso da Univ. de Michigan cita Ross cap. 16 = "Digestive System I: Oral Cavity and Associated Structures". **Não conferi os sumários da 14ª ed. de Junqueira nem da 8ª ed. de Ross**: não estavam acessíveis deste ambiente. Também falta conferir Kierszenbaum 5ª (caps. 1, 2, 4) e Gartner 4ª (caps. 1, 4, 5, 6).
2. **ASCO/CAP.** Fontes secundárias confirmam a fixação de 6 a 72 h nas duas diretrizes (HER2 2018 ampliou o limite de 48 para 72 h). Quanto ao tempo até a fixação, as fontes registram "o mais curto possível" e "≤ 1 h" (notificação de 2011, mantida "sem mudança" em 2020). Falta conferir a redação exata no texto integral (`documents.cap.org` não estava acessível).
3. **Lâmina lúcida.** Ross a trata como provável artefato de fixação; Junqueira a descreve como componente da lâmina basal. O conteúdo agora traz a ressalva, e nenhuma questão cobra o ponto.
4. **Meias-luas serosas.** O estudo de Yamashina (1999) é em glândula sublingual de **rato**. A questão his-03-q17 (V/F, verdadeira) atribui a afirmação "aos estudos citados por Ross & Pawlina" e usa "podem ser, ao menos em parte". O humano decide se mantém o item ou se prefere que o jogo só ensine a meia-lua como critério de glândula mista. Também falta conferir se a 14ª ed. de Junqueira menciona a hipótese.
5. **Secreção apócrina.** O exemplo adotado (lipídio do leite) é consensual. As glândulas "apócrinas" axilares secretam também, ou principalmente, por exocitose, e o conteúdo não as usa como exemplo. Mantido.
6. **Exemplos de classificação de glândulas.** Variam entre autores (sebácea "acinosa ramificada" × "acinosa simples ramificada"; parótida e pâncreas "acinosos" × "tubuloacinosos"). As questões usam só os exemplos consensuais. A q23 usa o rótulo "Acinosa ramificada" para a sebácea, compatível com as duas nomenclaturas.
7. **Esôfago de Barrett.** A ACG (2022) exige metaplasia intestinal; a BSG (2014), não. A vinheta da his-02-q10 descreve células caliciformes, então a resposta vale pelas duas definições.
8. **Periodicidade do colágeno.** Junqueira dá 64 nm, Ross 68 nm, a biofísica ~67 nm; a faixa 64–68 nm é mantida. Nenhuma questão cobra o número.
9. **Origem dos macrófagos.** O tópico registra agora as duas origens. A lâmina `conjuntivo-frouxo` em `laminas.json`, de outro revisor, ainda diz "deriva de monócitos do sangue" na estrutura `macrofago`. Não é contradição direta, mas convém harmonizar. Sugestão para o revisor das lâminas: "os recrutados derivam de monócitos".
10. **Classificação do conjuntivo.** O conteúdo segue Junqueira (propriamente dito × propriedades especiais); Ross agrupa em embrionário, propriamente dito e especializado. Nenhuma questão cobra a categoria-mãe, só a variedade e o local.
11. **Carcinoma basocelular.** O conteúdo diz "células semelhantes às basais da epiderme", e a his-03-q12 diz "células basais da epiderme ou do folículo piloso". A origem exata, interfolicular ou folicular, segue em discussão na literatura.
12. **Situs inversus na DCP.** O conteúdo usa 40–50%: livros dizem "cerca de metade", e as séries de 337 e 559 pacientes deram 47,7% e 38,5%.
13. **Linha do tempo da epiderme (his-02, eventos).** "Perde núcleo e organelas (estrato lúcido, na pele espessa)" (ordem 4) precede "Torna-se célula córnea" (ordem 5). Mantive a ordem porque segue os estratos da pele espessa, como diz o texto. Na pele fina, as duas coisas ocorrem praticamente juntas. Se o humano preferir, pode empatar as duas com o mesmo valor de `ordem`.
14. **his-01-q12 (imuno-histoquímica).** Alguns sarcomas, como o sinovial e o epitelioide, expressam citoqueratinas. O enunciado pede a interpretação "mais provável", e a explicação diz "em geral", então a resposta única se mantém. O humano pode querer citar a exceção.

### Coerência com `laminas.json` (somente leitura)

Conferi todas as estruturas das lâminas ligadas aos tópicos 02, 03 e 04: rim, intestino, traqueia, pele espessa, bexiga, submandibular e conjuntivo frouxo. IDs, nomes e definições batem com os tópicos, com estas ressalvas:
- "planura estriada" (lâmina) foi acrescentado como sinônimo de `borda-em-escova` nos tópicos;
- a membrana basal espessa e eosinófila da traqueia (lâmina) agora consta da definição em his-02;
- `acino-mucoso` se chama "Ácino mucoso" na lâmina e "Unidade secretora mucosa" no tópico, com "ácino mucoso" como sinônimo; está coerente;
- `papila-dermica` aparece como "Papila dérmica (derme papilar)" nos dois arquivos;
- macrófago: ver o item 9 acima.

### Fontes consultadas na web (fatos pontuais)

- Yamashina S, Tamaki H, Katsumata O. Arch Histol Cytol 1999;62(4):347–354 — [J-STAGE](https://www.jstage.jst.go.jp/article/aohc/62/4/62_4_347/_article) · [DOI](https://doi.org/10.1679/aohc.62.347)
- Situs inversus na DCP — [PMID 17515466](https://www.pubmed.gov/17515466/) · [PMID 36342963](https://pubmed.ncbi.nlm.nih.gov/36342963/) · [MedlinePlus](https://medlineplus.gov/genetics/condition/primary-ciliary-dyskinesia)
- ASCO/CAP (fontes secundárias) — [resumo CAP ER/PgR](https://documents.cap.org/documents/erpgr_summaryrecommendations.pdf) · [HER2 2018 (ASBD)](https://www.asbd.org.au/images/ASBD_documents/Education/HER2-testing-guidelines-2018.pdf) · [OncLive](https://www.onclive.com/view/new-asco-cap-guidelines-clarify-her2-testing-in-breast-cancer) · [ASCO Post 2014](https://ascopost.com/issues/february-15-2014/asco-and-college-of-american-pathologists-guideline-update-recommendations-for-her2-testing-in-breast-cancer)
- Ross cap. 16 — [Univ. of Michigan Histology: Oral Cavity and Salivary Glands](https://histology.medicine.umich.edu/node/36)
