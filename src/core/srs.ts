// Revisão espaçada (sistema de caixas de Leitner). Simples, previsível e fácil de explicar ao aluno.
export const INTERVALOS_DIAS = [0, 1, 3, 7, 16, 35] as const; // caixa 0..5

export interface EstadoItem {
  questaoId: string;
  caixa: number; // 0..5
  proximaRevisao: number; // epoch ms
  acertos: number;
  erros: number;
  ultimaResposta: number; // epoch ms
}

const DIA = 24 * 60 * 60 * 1000;

export function novoEstado(questaoId: string, agora: number): EstadoItem {
  return { questaoId, caixa: 0, proximaRevisao: agora, acertos: 0, erros: 0, ultimaResposta: 0 };
}

export function registrarResposta(e: EstadoItem, correta: boolean, agora: number): EstadoItem {
  const caixa = correta ? Math.min(INTERVALOS_DIAS.length - 1, e.caixa + 1) : 1;
  // Erro: volta para a caixa 1 e reaparece em 10 minutos (ainda na mesma sessão de estudo do dia).
  const proximaRevisao = correta ? inicioDoDia(agora) + INTERVALOS_DIAS[caixa] * DIA : agora + 10 * 60 * 1000;
  return {
    ...e,
    caixa,
    proximaRevisao,
    acertos: e.acertos + (correta ? 1 : 0),
    erros: e.erros + (correta ? 0 : 1),
    ultimaResposta: agora,
  };
}

export function inicioDoDia(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function vencidos(estados: EstadoItem[], agora: number): EstadoItem[] {
  return estados.filter((e) => e.proximaRevisao <= agora).sort((a, b) => a.caixa - b.caixa || a.proximaRevisao - b.proximaRevisao);
}

/** Domínio do tópico (0–1): média ponderada das caixas das questões já vistas, penalizando não vistas. */
export function dominio(estados: EstadoItem[], totalQuestoes: number): number {
  if (totalQuestoes === 0) return 0;
  const max = INTERVALOS_DIAS.length - 1;
  const soma = estados.reduce((s, e) => s + Math.min(e.caixa, max) / max, 0);
  return Math.min(1, soma / totalQuestoes);
}
