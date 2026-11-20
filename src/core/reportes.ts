// Reportes de erro de conteúdo: motivos, situações e as regras da fila da equipe.
// As regras da fila existem em dois lugares: aqui (modo demonstração e testes) e em
// supabase/migrations/0008_equipe_reportes.sql (servidor). Mudou um, mude o outro e rode npm test e npm run test:sql.

export type MotivoReporte = 'gabarito' | 'explicacao' | 'enunciado' | 'portugues' | 'outro';
export type StatusReporte = 'aberto' | 'procedente' | 'improcedente' | 'corrigido';

export const MOTIVOS_REPORTE: { id: MotivoReporte; rotulo: string }[] = [
  { id: 'gabarito', rotulo: 'Gabarito errado' },
  { id: 'explicacao', rotulo: 'Explicação incorreta ou incompleta' },
  { id: 'enunciado', rotulo: 'Enunciado ambíguo / mais de uma resposta' },
  { id: 'portugues', rotulo: 'Erro de português ou digitação' },
  { id: 'outro', rotulo: 'Outro' },
];

/** Situações na ordem das abas; `acao` é o texto do botão que leva o reporte para a situação. */
export const STATUS_REPORTE: { id: StatusReporte; rotulo: string; acao: string }[] = [
  { id: 'aberto', rotulo: 'Abertos', acao: 'Reabrir' },
  { id: 'procedente', rotulo: 'Procedentes', acao: 'Procedente' },
  { id: 'improcedente', rotulo: 'Improcedentes', acao: 'Improcedente' },
  { id: 'corrigido', rotulo: 'Corrigidos', acao: 'Corrigido' },
];

export const rotuloMotivo = (m: string) => MOTIVOS_REPORTE.find((x) => x.id === m)?.rotulo ?? m;
export const ehStatusReporte = (s: string): s is StatusReporte => STATUS_REPORTE.some((x) => x.id === s);

/** Um reporte como a equipe o vê: sem quem reportou. */
export interface ReporteFila {
  id: number;
  questaoId: string;
  motivo: string;
  texto: string | null;
  versaoApp: string | null;
  status: StatusReporte;
  criadoEm: string;
  /** reportes da mesma questão na mesma situação */
  reportesDaQuestao: number;
  nota: string | null;
  tratadoEm: string | null;
}

/** Registro completo (modo demonstração): o que o servidor guarda, menos quem reportou e quem tratou. */
export type ReporteGuardado = Omit<ReporteFila, 'reportesDaQuestao'>;

export const LIMITE_NOTA = 1000;
const LIMITE_PAGINA = 200;

/**
 * Fila de uma situação. Nos abertos: primeiro as questões com mais reportes, depois pelo id da questão e, dentro
 * dela, os mais antigos. Nos tratados: os tratados mais recentemente primeiro.
 */
export function filaDe(todos: readonly ReporteGuardado[], status: StatusReporte, limite = 100): ReporteFila[] {
  const doStatus = todos.filter((r) => r.status === status);
  const porQuestao = new Map<string, number>();
  for (const r of doStatus) porQuestao.set(r.questaoId, (porQuestao.get(r.questaoId) ?? 0) + 1);
  const lista = doStatus.map((r) => ({ ...r, reportesDaQuestao: porQuestao.get(r.questaoId)! }));
  lista.sort((a, b) =>
    status === 'aberto'
      ? b.reportesDaQuestao - a.reportesDaQuestao || a.questaoId.localeCompare(b.questaoId) || a.criadoEm.localeCompare(b.criadoEm) || a.id - b.id
      : (b.tratadoEm ?? '').localeCompare(a.tratadoEm ?? '') || a.id - b.id,
  );
  // como no servidor: least(greatest(coalesce(limite, 100), 1), 200)
  return lista.slice(0, Math.min(Math.max(Number.isFinite(limite) ? Math.floor(limite) : 100, 1), LIMITE_PAGINA));
}

export function contagemDe(todos: readonly ReporteGuardado[]): Record<StatusReporte, number> {
  const c: Record<StatusReporte, number> = { aberto: 0, procedente: 0, improcedente: 0, corrigido: 0 };
  for (const r of todos) c[r.status]++;
  return c;
}

/** Nota da equipe: sem espaços nas pontas, vazia vira null, no máximo 1000 caracteres. */
export function limparNota(nota: string | null | undefined): string | null {
  const t = (nota ?? '').trim();
  return t ? t.slice(0, LIMITE_NOTA) : null;
}

/**
 * Muda a situação de um reporte (ou de todos os abertos da mesma questão) e devolve a nova lista e quantos mudaram.
 * Reabrir apaga a data do tratamento; a nota só muda quando vem uma nova.
 */
export function tratarReporte(
  todos: readonly ReporteGuardado[],
  id: number,
  status: StatusReporte,
  nota: string | null,
  mesmaQuestao: boolean,
  agora: string,
): { lista: ReporteGuardado[]; mudaram: number } {
  if (!ehStatusReporte(status)) throw new Error(`situação inválida: ${status}`);
  const alvo = todos.find((r) => r.id === id);
  if (!alvo) throw new Error('reporte não encontrado');
  const novaNota = limparNota(nota);
  let mudaram = 0;
  const lista = todos.map((r) => {
    if (!(r.id === id || (mesmaQuestao && r.questaoId === alvo.questaoId && r.status === 'aberto'))) return r;
    mudaram++;
    return { ...r, status, nota: novaNota ?? r.nota, tratadoEm: status === 'aberto' ? null : agora };
  });
  return { lista, mudaram };
}
