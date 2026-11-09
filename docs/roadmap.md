# Roadmap

Ordem dos módulos baseada no semestre mais comum de cada disciplina nas escolas pesquisadas (`docs/pesquisa-curricular.md`).

## v0.1 — Embriologia (este repositório)
- [x] Núcleo do jogo: XP, níveis, sequência de dias, revisão espaçada, sessões, limites do plano gratuito.
- [x] Embriologia geral (tópicos 1–10) com questões de 4 tipos, resumos, estruturas, correlações clínicas e fontes.
- [x] Embriologia dos sistemas (tópicos 11–20) — lacuna apontada pela pesquisa curricular (está em todas as escolas, do 1º ao 3º semestre).
- [x] Reportar erro nas questões; exclusão de conta/dados (LGPD); painel do professor (agregado, mínimo de 5 alunos).
- [x] Laboratório 3D com 12 estágios (zigoto → placenta) e jogo Identifique.
- [x] Minijogos: linha do tempo, camadas germinativas, plantão relâmpago (90 s).
- [x] Cadastro de escolas (441 cursos) e rankings: interno da escola, entre escolas e geral.
- [x] Servidor Supabase (migrações + testes SQL), sincronização offline.
- [ ] Revisão científica por agentes de cada área (em andamento) e conferência médica (Cristiano).

## v0.2 — Lançamento do piloto
- Ativar Supabase em produção (região São Paulo) e domínio.
- Termos de uso e política de privacidade (LGPD); exclusão de conta na tela de perfil.
- Tela interna para a equipe tratar a fila de reportes.
- Cobrança (lojas + web) e gestão de licenças institucionais.
- Builds Android (Google Play — teste interno) e iOS (TestFlight).
- Completar o cadastro de escolas (≈ 30 cursos faltantes; precisa liberar e-mec.mec.gov.br na rede do ambiente).

## v0.3+ — Novos módulos (cada um com jogabilidade própria)
1. **Histologia** — microscópio virtual (lâminas com zoom, identificar tecidos/células).
2. **Anatomia** — dissecção 3D por camadas (modelos próprios ou base aberta compatível com uso comercial).
3. **Bioquímica** — montar vias metabólicas, achar a enzima bloqueada.
4. **Genética** — heredogramas e cariótipos interativos (liga com teratologia).
5. **Fisiologia** — simulador de sistemas (alterar variáveis e prever respostas).
6. **Patologia** e **Farmacologia** — mecanismos, alvos, efeitos adversos.
7. **Semiologia** — exame físico interativo (anamnese, ausculta, manobras).
8. **Fisiopatologia** — cascatas causa → mecanismo → manifestação.
9. **Cirurgia** — centro cirúrgico 3D: escolher a técnica, apontar planos e estruturas, antecipar complicações.

Outras: duelos assíncronos entre colegas, torneios intercursos agendados, trilha "PBL" que reagrupa os tópicos com os nomes dos módulos da ESCS/UniCEUB, outros cursos da saúde (enfermagem, odontologia, fisioterapia).
