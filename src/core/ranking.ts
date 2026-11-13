// Regras de ranking. Espelhadas nas funções SQL do servidor (supabase/migrations/0002_ranking.sql).
//
// - Temporada semanal: segunda 00:00 a domingo 23:59, horário de Brasília (America/Sao_Paulo).
// - Ranking individual e interno da escola: XP da semana.
// - Ranking entre escolas: soma do XP semanal dos 20 melhores alunos de cada escola.
//   Motivo: (a) escolas grandes não vencem só pelo tamanho; (b) cada aluno a mais até o 20º ajuda a escola,
//   o que incentiva convidar colegas (crescimento orgânico); (c) um único "fenômeno" não carrega a escola sozinho.

export const TOP_N_ESCOLA = 20;

export interface PontuacaoAluno {
  usuarioId: string;
  nome: string;
  escolaId: string | null;
  xpSemana: number;
  /** avatar escolhido pelo jogador, como veio do servidor (validado na hora de desenhar) */
  avatar?: unknown;
}

export interface PontuacaoEscola {
  escolaId: string;
  pontos: number;
  contribuintes: number; // quantos alunos entraram na soma
  membrosAtivos: number;
}

export function rankingEscolas(alunos: PontuacaoAluno[], topN = TOP_N_ESCOLA): PontuacaoEscola[] {
  const porEscola = new Map<string, number[]>();
  for (const a of alunos) {
    if (!a.escolaId || a.xpSemana <= 0) continue;
    const l = porEscola.get(a.escolaId) ?? [];
    l.push(a.xpSemana);
    porEscola.set(a.escolaId, l);
  }
  return [...porEscola.entries()]
    .map(([escolaId, xs]) => {
      const top = xs.sort((a, b) => b - a).slice(0, topN);
      return { escolaId, pontos: top.reduce((s, x) => s + x, 0), contribuintes: top.length, membrosAtivos: xs.length };
    })
    .sort((a, b) => b.pontos - a.pontos || b.membrosAtivos - a.membrosAtivos);
}

/** Início da semana (segunda 00:00) em America/Sao_Paulo, devolvido como AAAA-MM-DD. */
export function semanaAtual(t = Date.now()): string {
  // Brasília não tem horário de verão desde 2019: UTC−3 fixo.
  const brt = new Date(t - 3 * 60 * 60 * 1000);
  const diaSemana = (brt.getUTCDay() + 6) % 7; // 0 = segunda
  const inicio = new Date(Date.UTC(brt.getUTCFullYear(), brt.getUTCMonth(), brt.getUTCDate() - diaSemana));
  return inicio.toISOString().slice(0, 10);
}
