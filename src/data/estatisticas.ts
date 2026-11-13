// Estatísticas do jogador lidas do banco local, na forma que as conquistas esperam.
// Usadas pelo Perfil (conquistas) e pelo avatar (itens liberados por conquista).
import { db } from './db.ts';
import { carregarDisciplina } from '../content/index.ts';
import { dominio } from '../core/srs.ts';
import { nivelPorXP } from '../core/scoring.ts';
import type { EstatisticasJogador } from '../core/conquistas.ts';

export async function carregarEstatisticas(e: { xpTotal: number; sequenciaDias: number; temEscola: boolean }): Promise<EstatisticasJogador> {
  const [sessoes, estados, reportes, topicos] = await Promise.all([
    db.sessoes.toArray(),
    db.estados.toArray(),
    db.reportes.count(),
    carregarDisciplina('embriologia'),
  ]);
  const porId = new Map(estados.map((x) => [x.questaoId, x]));
  const dominados = topicos.filter(
    (t) => dominio(t.questoes.map((q) => porId.get(q.id)).filter((x) => !!x) as typeof estados, t.questoes.length) >= 0.6,
  ).length;
  return {
    sessoes: sessoes.map((s) => ({ modo: s.modo, acertos: s.acertos, total: s.total })),
    sequenciaDias: e.sequenciaDias,
    xpTotal: e.xpTotal,
    nivel: nivelPorXP(e.xpTotal).nivel,
    topicosDominados: dominados,
    totalTopicos: topicos.length,
    temEscola: e.temEscola,
    reportesEnviados: reportes,
  };
}
