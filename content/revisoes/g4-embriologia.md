# Revisão G4 — embriologia (tópicos 16 a 20)

- Agente: `revisor-embriologia-v1`
- Data: 2026-11-09
- Protocolo: `docs/protocolo-revisao-agentes.md`; formato: `docs/conteudo-schema.md`
- Arquivos: `content/embriologia/topicos/emb-16-urinario.json`, `emb-17-genital-diferenciacao-sexual.json`, `emb-18-sistema-nervoso.json`, `emb-19-musculoesqueletico-membros.json`, `emb-20-olho-orelha-tegumento.json`
- `revisao.humano` não foi tocado (continua `null` nos cinco arquivos). Nenhum id foi alterado; nenhum arquivo fora do G4 foi editado.

## 1. Resumo

Revisei integralmente os cinco tópicos: resumo, pontos-chave, objetivos, estruturas, eventos, correlações clínicas, 120 questões, referências, notas de divergência e incertezas. Os textos estavam, em geral, corretos e bem fundamentados. Os pontos de atenção pedidos foram conferidos um a um; os que exigiram correção estão na tabela da seção 2.

| Tópico | Questões | Crítica | Importante | Menor | Total | Veredito |
|---|---|---|---|---|---|---|
| emb-16 Sistema urinário | 25 | 0 | 1 | 3 | 4 | aprovado-com-correcoes |
| emb-17 Sistema genital e diferenciação sexual | 23 | 0 | 0 | 5 | 5 | aprovado-com-correcoes |
| emb-18 Sistema nervoso | 24 | 0 | 1 | 2 | 3 | aprovado-com-correcoes |
| emb-19 Musculoesquelético e membros | 24 | 1 | 1 | 2 | 4 | aprovado-com-correcoes |
| emb-20 Olho, orelha e tegumento | 24 | 0 | 0 | 1 | 1 | aprovado-com-correcoes |
| **Total** | **120** | **1** | **3** | **13** | **17** | |

Gravidade: **crítica** = fato errado ou gabarito errado; **importante** = ambiguidade, distrator defensável, explicação incorreta ou incompleta; **menor** = redação, terminologia, precisão, referência.

Nenhum gabarito estava errado. Em todas as questões de múltipla escolha a explicação cita a letra de cada distrator (checagem automática por script). Nenhuma letra correta passa de 29% em nenhum tópico, então não foi preciso redistribuir alternativas.

### Pontos de atenção conferidos sem erro

- **Urinário:** cronologia pronefro (início da 4ª semana) → mesonefro (fim da 4ª) → metanefro (início da 5ª). Indução recíproca: WT1, GDNF/HGF do blastema agindo em RET/MET do broto; FGF2/BMP7/WNT do broto agindo no blastema. Derivados do broto ureteral e do blastema. Ascensão renal até a 9ª semana, com rotação do hilo e ramos arteriais sucessivos. Rim em ferradura retido pela AMI. Trígono a partir dos ductos mesonéfricos, com a divergência moderna registrada. Sequência de Potter com hipoplasia pulmonar como causa do óbito.
- **Genital:** células germinativas primordiais (epiblasto → parede do saco vitelino perto da alantoide → mesentério dorsal do intestino posterior → cristas gonadais na 6ª semana). SRY + SF1 → SOX9 → Sertoli. AMH vem das Sertoli e faz regredir os ductos de Müller. A testosterona (Leydig, 8ª semana) mantém os ductos de Wolff. A DHT (5α-redutase tipo 2) masculiniza a genitália externa e a próstata. Destinos de Wolff e Müller nos dois sexos. Conferidos fenótipo, cariótipo e mecanismo da insensibilidade completa aos andrógenos (46,XY, receptor de andrógenos ligado ao X), da HAC por 21-hidroxilase (46,XX, CYP21A2) e da deficiência de 5α-redutase tipo 2 (46,XY, SRD5A2).
- **Sistema nervoso:** vesículas primárias e secundárias e seus derivados. Placas alar e basal e sulco limitante. Cone medular em S1 com 24 semanas, L2–L3 ao nascer e L1–L2 no adulto, com a divergência entre fontes registrada. Chiari II apresentado como hipótese do vazamento de liquor, diferenciado do Chiari I. Hipófise e DTN.
- **Musculoesquelético:** ressegmentação (metade caudal + metade cranial, 8 nervos × 7 vértebras cervicais). AER/FGF no eixo proximodistal, ZPA/SHH no anteroposterior e WNT7A/LMX1B/EN1 no dorsoventral. Sentido da rotação: membro superior lateral, inferior medial.
- **Olho, orelha e tegumento:** epitélio pigmentado e retina neural vêm das camadas externa e interna do cálice óptico. Músculos da íris vêm do neuroectoderma. Coloboma resulta da falha da fissura coroide na 7ª semana. A artéria hialoide deixa a artéria central da retina. Martelo e bigorna vêm do 1º arco, o estribo do 2º. Esmalte vem dos ameloblastos (ectoderma oral); dentina vem dos odontoblastos (crista neural).
- **Capítulos citados em `referencia`/`referencias`:** conferidos contra o sumário de Moore 11ª ed. (12 urogenital, 14 esquelético, 15 muscular, 16 membros, 17 nervoso, 18 olhos e orelhas, 19 tegumentar, 20 defeitos congênitos), de Sadler 14ª ed. (2 gametogênese, 9 defeitos congênitos, 10–12 esqueleto axial, músculos e membros, 16 urogenital, 17 cabeça e pescoço, 18 SNC, 19 orelha, 20 olho, 21 tegumento), de Larsen 5ª ed. e de Carlson 6ª ed. Nenhum estava claramente errado. Também conferi a citação das diretrizes (Lee 2006, Speiser 2018, Kolon 2014, Adzick/MOMS 2011, RDC 344/2002, Lei 12.303/2010).

## 2. Tabela de correções

| id | campo | antes (resumido) | depois (resumido) | motivo | gravidade | fonte |
|---|---|---|---|---|---|---|
| emb-19-musculoesqueletico-membros / `polidactilia` | correlacoesClinicas.descricao | "a pós-axial é frequentemente isolada…; a **pré-axial associa-se mais a síndromes**" | Pós-axial: a mais comum; isolada e familiar na ascendência africana, mais vezes sindrômica em outras populações (indicação de avaliação genética). Duplicação do polegar (pré-axial): em geral isolada, unilateral e esporádica, mas também presente em algumas síndromes | Fato invertido: a forma pré-axial é tipicamente isolada e esporádica | crítica | StatPearls "Polydactyly" (statpearls.com/articlelibrary/viewarticle/38505); MSD Manual Professional, "Congenital Limb Anomalies"; Moore 11ª ed., cap. 16 |
| emb-19-q19 + eventos `e19-rotacao-membros`, `e19-dedos-livres` (+ nota de divergência) | itens 6 e 3, explicacao, descricao | "Os membros giram em sentidos opostos" → "Os dedos ficam separados" | "Os membros **começam** a girar…" → "Os dedos ficam **completamente** separados…"; explicação e nota explicam que a rotação é gradual | A rotação se completa por volta do fim do período embrionário, ao mesmo tempo que a separação completa dos dedos; a ordem só é inequívoca entre o início da rotação (7ª semana) e a separação completa (fim da 8ª) | importante | Sadler 14ª ed., cap. 12; Moore 11ª ed., cap. 16 |
| emb-16-q23 | itens 3 e 4, ordemCorreta, explicacao | Itens separados: "porções caudais incorporadas à bexiga" → "ureteres passam a desembocar separadamente" (ordem 2-4-3-1) | Os dois fatos fundidos num só item (4). Novo item 3: "Os ductos mesonéfricos alcançam a cloaca e nela desembocam". Ordem 3-2-4-1 | Os itens antigos eram causa e efeito praticamente simultâneos (a ordem tinha margem de dúvida); o novo item é anterior ao broto ureteral sem ambiguidade | importante | Sadler 14ª ed., cap. 16; Moore 11ª ed., cap. 12 |
| emb-18-q15 | explicacao | Refutava (c) só pelo fechamento do tubo neural | Acrescenta que o período embrionário termina no fim da 8ª semana após a fertilização (≈ 10ª de IG), não na 12ª | O distrator traz uma premissa falsa ("12ª semana, quando termina o período embrionário") que a explicação deixava passar | importante | Moore 11ª ed., cap. 1 e 6; Sadler 14ª ed., cap. 8 |
| emb-16 / estrutura `mesonefro` | destino | "no homem, **túbulos caudais** persistem como dúctulos eferentes" | Os túbulos junto ao testículo (epigenitais) formam os dúctulos eferentes; os caudais ao testículo deixam o paradídimo | Precisão: os túbulos caudais ao polo do testículo originam o paradídimo, não os dúctulos eferentes | menor | Sadler 14ª ed., cap. 16; Moore 11ª ed., cap. 12 |
| emb-16-q04 | explicacao | "túbulos caudais e o ducto mesonéfrico originam…" | "alguns túbulos mesonéfricos e o ducto mesonéfrico originam…" | Coerência com a correção acima | menor | idem |
| emb-16-q21 | explicacao | "fim da nefrogênese… por volta da 32ª–36ª semana" | Mesma faixa, mas avisando que as fontes nem sempre dizem se é idade gestacional ou após a fertilização (remete às notas) | Explicitar o sistema de contagem de idade | menor | notasDivergencia do tópico |
| emb-17 | resumo (Correlações) | "A nomenclatura atual (consenso de 2006) usa diferenças do desenvolvimento do sexo" | O consenso de Chicago (2006) criou DSD = *disorders of sex development*, hoje muitas vezes lido como *differences*; em português, DDS (distúrbios ou, cada vez mais, diferenças) | O consenso de 2006 não usou "diferenças" | menor | Lee et al., Pediatrics 2006;118:e488 |
| emb-17 / `dds-nomenclatura` | correlacoesClinicas.descricao | Listava 'intersexo' entre os termos "obsoletos e estigmatizantes" | 'Intersexo' deixou de ser categoria diagnóstica, mas é termo identitário de muitas pessoas e organizações e deve ser respeitado; mantida a ressalva histórica sobre a sigla | Terminologia respeitosa pedida na tarefa | menor | Lee et al. 2006 |
| emb-17-q12 | contexto | "Adolescente 46,XY…, **registrado e criado** no gênero feminino" | "…, com registro civil e criação no gênero feminino" | Concordância de gênero inadequada para a pessoa descrita; redação neutra | menor | — |
| emb-17 | resumo (Ductos genitais) | "os mesonéfricos regridem, deixando epoóforo, paraoóforo e ducto de Gartner" | "os ductos e túbulos mesonéfricos regridem, deixando restos como…" | Epoóforo e paraoóforo incluem restos de túbulos, não só do ducto | menor | Sadler 14ª ed., cap. 16; Moore 11ª ed., cap. 12 |
| emb-17 / estrutura `ducto-mesonefrico` | destino | "regride, deixando epoóforo, paraoóforo e ducto de Gartner" | "regride; seus restos (com os de túbulos mesonéfricos) formam…" | Idem | menor | idem |
| emb-18 | resumo (Correlações) | "falhas caudais causam espinha bífida" | Causam espinha bífida **aberta** (mielomeningocele, mielosquise); a oculta não é falha de fechamento do tubo neural, mas defeito do arco vertebral | Precisão conceitual | menor | Moore 11ª ed., cap. 17; Sadler 14ª ed., cap. 18 |
| emb-18 resumo + estrutura `crista-neural` | resumo; destino | Pia-máter e aracnoide listadas "no SNP" | SNP separado de "fora dele": melanócitos, leptomeninges e mesênquima craniofacial | As leptomeninges não fazem parte do SNP | menor | Sadler 14ª ed., cap. 18 |
| emb-19 resumo, evento `e19-ossificacao-primaria`, q19 (item 5 e explicação) | vários | "centro primário… na **maioria** dos ossos dos membros até a 12ª semana" | "em **todos os ossos longos** dos membros até a 12ª semana" (o carpo só ossifica depois do nascimento) | Fidelidade à fonte; também deixa inequívoca a ordem do evento | menor | Sadler 14ª ed., cap. 12; Moore 11ª ed., cap. 16 |
| emb-19 | resumo (Ressegmentação) | "artérias intersegmentares passam **ao lado** dos corpos vertebrais" | "antes entre os esclerótomos, passam a cruzar a **parte média** dos corpos vertebrais" | Precisão anatômica | menor | Sadler 14ª ed., cap. 10 |
| emb-20 / estrutura `sulco-optico` | sinonimos | ["fosseta óptica"] | [] | O termo não é usado nas traduções de Moore/Sadler e pode ser confundido com a fosseta do disco óptico, outra anomalia congênita | menor | Moore 11ª ed., cap. 18; Sadler 14ª ed., cap. 20 |

## 3. Pontos para o revisor humano

1. **Cone medular ao nascer:** Moore dá L2–L3, Sadler L3, e estudos de imagem neonatal L1–L2 com mais frequência. O tópico adota L2–L3 com a divergência registrada (q22, eventos e pontos-chave). Vale confirmar se o curso da escola-alvo cobra outro valor.
2. **Término da nefrogênese:** a faixa 32–36 semanas não deixa claro, nas fontes consultadas de memória, se é idade gestacional ou pós-fertilização. O evento usa os dias 224–252. Conferir no Moore/Larsen impressos.
3. **Origem do trígono e da uretra glandar:** os livros-texto dão a origem nos ductos mesonéfricos com substituição endodérmica e o cordão ectodérmico da glande. Estudos recentes divergem (detrusor; uretra toda endodérmica). O conteúdo segue os livros e registra a divergência; as questões só cobrem a versão dos livros.
4. **Polidactilia:** a correção usa a ascendência apenas como dado epidemiológico. Pedir a um geneticista ou cirurgião de mão que confirme a redação, inclusive quanto à indicação de avaliação genética na pós-axial fora da ascendência africana.
5. **Terminologia de DDS:** confirmar o termo preferido pelo Cristiano para o app ("diferenças" × "distúrbios" do desenvolvimento do sexo). Hoje o texto apresenta os dois e usa "diferenças" como forma principal.
6. **Hipospádia:** o mecanismo diz "em geral por produção ou ação insuficiente de andrógenos", conforme Moore e Sadler. Na clínica, a maioria dos casos é multifatorial ou idiopática. Não alterei porque segue as obras-base, mas o revisor pode preferir suavizar.
7. **Ordens apertadas na linha do tempo**, defensáveis mas vizinhas:
   - emb-18: perda da conexão da bolsa de Rathke (6ª semana até o fim do 2º mês) × medula ocupando todo o canal (3º mês);
   - emb-17-q20: AMH × início da testosterona (o momento exato do AMH está nas incertezas do tópico);
   - emb-16: brotos prostáticos (fim do 3º mês, segundo Sadler; ≈ 10ª–11ª semana em outras fontes) × rins na posição lombar (9ª semana).

   Mantive essas ordens. Se o revisor considerar alguma ambígua, a solução é retirar o evento.
8. **Janelas da rubéola** (cristalino na 4ª–7ª semana, segundo Moore) e **fusão dos arcos vertebrais** e fim da ossificação vertebral (3–5 anos e ~25 anos): vieram de memória do texto de Moore. Já constam nas incertezas e continuam pendentes de conferência no livro.
9. **Terminologia:** emb-16 usa "glândula seminal" (Terminologia Anatômica) e emb-17 usa "vesícula seminal". As duas formas estão corretas; harmonizar entre tópicos se o app tiver glossário único.
10. **Limitação desta revisão:** as obras-base não estavam disponíveis em texto. A conferência foi feita de memória do conteúdo das edições citadas, mais busca na web para a polidactilia e para o nível do cone medular. Os demais pontos não foram conferidos em fonte primária nesta sessão.

## 4. Evidência de validação

```
$ npm run validar-conteudo
AVISO emb-01-introducao.json: eventos com "ordem" repetida   (arquivo fora do G4; não alterado)
Conteúdo OK — disciplinas: embriologia; tópicos: 20; questões: 523; escolas: 441.

$ npx vitest run
 Test Files  2 passed (2)
      Tests  25 passed (25)
```
