// Pontuação (XP). As mesmas regras são reaplicadas no servidor (supabase/migrations) para o ranking:
// o cliente calcula para exibir; o servidor recalcula para contar.
import type { Questao } from '../content/schema.ts';

export type Resposta =
  | { tipo: 'multipla'; escolhida: string }
  | { tipo: 'vf'; escolhida: boolean }
  | { tipo: 'ordenar'; ordem: string[] }
  | { tipo: 'associar'; pares: Record<string, string> }; // esquerda -> direita escolhida

export interface Correcao {
  correta: boolean;
  /** 0–1: fração de acerto (ordenar/associar admitem acerto parcial para feedback; XP só com acerto total). */
  fracao: number;
}

export function corrigir(q: Questao, r: Resposta): Correcao {
  if (q.tipo !== r.tipo) return { correta: false, fracao: 0 };
  switch (q.tipo) {
    case 'multipla': {
      const ok = (r as Extract<Resposta, { tipo: 'multipla' }>).escolhida === q.correta;
      return { correta: ok, fracao: ok ? 1 : 0 };
    }
    case 'vf': {
      const ok = (r as Extract<Resposta, { tipo: 'vf' }>).escolhida === q.correta;
      return { correta: ok, fracao: ok ? 1 : 0 };
    }
    case 'ordenar': {
      const ordem = (r as Extract<Resposta, { tipo: 'ordenar' }>).ordem;
      let certos = 0;
      q.ordemCorreta.forEach((id, i) => {
        if (ordem[i] === id) certos++;
      });
      const fracao = certos / q.ordemCorreta.length;
      return { correta: fracao === 1, fracao };
    }
    case 'associar': {
      const pares = (r as Extract<Resposta, { tipo: 'associar' }>).pares;
      let certos = 0;
      for (const p of q.pares) if (pares[p.esquerda] === p.direita) certos++;
      const fracao = certos / q.pares.length;
      return { correta: fracao === 1, fracao };
    }
  }
}

export const XP_BASE_POR_DIFICULDADE = [0, 10, 12, 15, 18, 22] as const;
export const COMBO_MAX = 0.5; // +50%
export const COMBO_PASSO = 0.1; // +10% por acerto consecutivo após o primeiro

export interface ContextoXP {
  dificuldade: number;
  correta: boolean;
  /** acertos consecutivos ANTES desta resposta */
  comboAnterior: number;
  /** ms gastos (só usado em modo cronometrado) */
  tempoMs?: number;
  /** limite de tempo da questão em modo cronometrado */
  limiteMs?: number;
  /** quantas vezes a questão já foi acertada nas últimas 24 h (retorno decrescente contra farm) */
  acertosRecentes24h?: number;
}

export function calcularXP(c: ContextoXP): number {
  if (!c.correta) return 0;
  const base = XP_BASE_POR_DIFICULDADE[Math.min(5, Math.max(1, Math.round(c.dificuldade)))];
  const combo = Math.min(COMBO_MAX, Math.max(0, c.comboAnterior) * COMBO_PASSO);
  let velocidade = 0;
  if (c.tempoMs !== undefined && c.limiteMs) {
    const restante = Math.max(0, 1 - c.tempoMs / c.limiteMs);
    velocidade = 0.5 * restante; // até +50% respondendo rápido
  }
  const repeticao = [1, 0.5, 0.2][Math.min(2, c.acertosRecentes24h ?? 0)] ?? 0.2;
  return Math.round(base * (1 + combo + velocidade) * repeticao);
}

/** Tempo mínimo plausível de resposta (antifraude simples; o servidor aplica regra equivalente). */
export const TEMPO_MINIMO_MS = 1200;

/** Nível do jogador a partir do XP total: curva suave (nível n exige 100·n^1.5 XP acumulado). */
export function nivelPorXP(xp: number): { nivel: number; atual: number; proximo: number; progresso: number } {
  let nivel = 1;
  const limiar = (n: number) => Math.round(100 * Math.pow(n, 1.5));
  while (xp >= limiar(nivel)) nivel++;
  const anterior = nivel === 1 ? 0 : limiar(nivel - 1);
  const proximo = limiar(nivel);
  return { nivel, atual: xp, proximo, progresso: (xp - anterior) / (proximo - anterior) };
}

export const TITULOS_NIVEL: { min: number; titulo: string }[] = [
  { min: 1, titulo: 'Calouro' },
  { min: 5, titulo: 'Monitor' },
  { min: 10, titulo: 'Ligante' },
  { min: 15, titulo: 'Diretor de Liga' },
  { min: 20, titulo: 'Interno' },
  { min: 30, titulo: 'Residente' },
  { min: 40, titulo: 'Preceptor' },
  { min: 50, titulo: 'Professor Titular' },
];

export function tituloDoNivel(nivel: number): string {
  let t = TITULOS_NIVEL[0].titulo;
  for (const x of TITULOS_NIVEL) if (nivel >= x.min) t = x.titulo;
  return t;
}
