# Plano comercial (versão 0.1 — hipóteses a validar)

> Números de preço e metas aqui são **hipóteses de trabalho**, não dados de mercado. Validar com entrevistas e com o piloto.

## Proposta de valor

**Para o aluno do ciclo básico**: estudar a matéria da prova jogando, com modelos 3D que não existem no livro, revisão espaçada automática e a motivação de pontuar pela própria escola.
**Para a escola/liga acadêmica**: engajamento mensurável da turma, painel do professor por tópico, torneios internos e externos (vitrine para a instituição).

Diferenciais frente aos concorrentes (Jaleko, Medway, Sanar, Estratégia MED, Afya/Whitebook, Anki, apps de anatomia 3D):
1. Foco no **ciclo básico** (1º–4º semestre), onde os grandes players de residência quase não competem.
2. **Competição entre escolas** (ranking interno + liga entre instituições) — identidade forte no Brasil (atléticas, ligas, intercursos).
3. **Jogabilidade própria por disciplina** (laboratório 3D, linha do tempo, camadas, futuro centro cirúrgico 3D), não só banco de questões.
4. Conteúdo **alinhado às ementas** pesquisadas (ESCS, UnB, UniCEUB, UCB, Unicamp, UFMG, USP, UNIFESP, UFRJ) e às obras que as escolas adotam (Moore, Langman, Larsen).

## Modelo de receita (escolhido em 09/11/2026: freemium + escolas)

| Plano | Para quem | O que libera | Preço (hipótese) |
|---|---|---|---|
| Gratuito | todos | conteúdo de estudo, laboratório 3D, 5 sessões de questões e 3 plantões ranqueados por dia | R$ 0 |
| Premium | aluno | ilimitado, revisão espaçada do dia, estatísticas detalhadas, duelos (futuro) | R$ 29,90/mês ou R$ 239,90/ano |
| Escola / Liga | instituição, liga acadêmica, cursinho | Premium para a turma, painel do professor, torneios internos, trilha alinhada ao PPC | por aluno/ano, sob consulta |

Os limites ficam em `src/core/planos.ts` (um lugar só) e o plano vem do servidor (`plano_atual()`: licença da escola > assinatura > gratuito).

### Cobrança
- **Android/iOS**: compras de conteúdo digital dentro do app precisam usar o faturamento das lojas (Google Play Billing / App Store). Sugestão: RevenueCat para unificar e gravar em `assinaturas` via webhook.
- **Web**: Mercado Pago, Pagar.me ou Stripe (Pix e cartão).
- **Institucional**: contrato + nota fiscal; licença registrada em `licencas_institucionais`.

## Aquisição

1. **Embaixadores por escola** (1–2 alunos por turma, com Premium grátis e metas de convites). O ranking da escola só soma até 20 alunos: cada convite até o 20º tem efeito direto na posição da escola.
2. **Ligas acadêmicas e atléticas**: torneios intercursos com premiação simbólica; parceria com ligas de anatomia/embriologia.
3. **Professores**: painel gratuito no piloto, em troca de uso em sala e feedback do conteúdo.
4. **Conteúdo curto nas redes** (vídeos dos modelos 3D girando + "você sabe identificar?").
5. Piloto sugerido em Brasília (ESCS, UnB, UniCEUB, UCB, Católica) pela proximidade do fundador.

## Métricas do piloto

Retenção D1/D7/D30, sessões por semana por aluno, % de alunos com escola, escolas com ≥ 20 ativos/semana, conversão gratuito → premium, NPS, taxa de erros reportados por 1.000 questões.

## Exigências legais e de risco

- **Marca**: "MedArena" foi descartada (conflitos). "MedLiga" sem uso encontrado em buscas na web, mas a **busca formal no INPI (classes 9, 41, 42) é obrigatória** antes de registrar e de investir em marca.
- **LGPD**: termos de uso, política de privacidade, base legal (execução de contrato/consentimento), encarregado (DPO), exclusão de conta (já existe `excluir_minha_conta()`), dados mínimos (apelido, escola, semestre). Alunos de 17 anos: tratar como adolescente (art. 14).
- **Conteúdo**: texto e questões próprios; nunca copiar figuras ou trechos de livros. Modelos 3D próprios (procedurais).
- **Responsabilidade**: aviso permanente de que é ferramenta de estudo, não de decisão clínica; selo de revisão em cada conteúdo.
- **Empresa**: CNPJ, contas de desenvolvedor (Google Play, Apple Developer), domínio e e-mail comercial (`src/config/marca.ts`).
