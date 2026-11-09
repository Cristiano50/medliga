// Montagem de sessões de jogo a partir do banco de questões.
import type { Questao, Topico } from '../content/schema.ts';
import type { EstadoItem } from './srs.ts';
import { embaralhar } from './random.ts';

export type ModoSessao = 'estudo' | 'plantao' | 'revisao' | 'duelo';

export interface ItemSessao {
  questao: Questao;
  topicoId: string;
  /** Ordem embaralhada das alternativas/itens para exibição (não altera os ids). */
  ordemExibicao?: string[];
}

export interface OpcoesSessao {
  modo: ModoSessao;
  tamanho: number;
  rng?: () => number;
  estados?: Map<string, EstadoItem>;
  agora?: number;
  /** Plantão usa só tipos rápidos (múltipla e V/F). */
  tipos?: Questao['tipo'][];
  /** Desafio avançado: só questões com dificuldade maior ou igual a este valor. */
  dificuldadeMinima?: number;
}

/** Dificuldade mínima das questões do Desafio avançado. */
export const DIFICULDADE_AVANCADA = 4;

/** Quantas questões do Desafio avançado existem nestes tópicos. */
export function contarAvancadas(topicos: Topico[]): number {
  return topicos.reduce((s, t) => s + t.questoes.filter((q) => q.dificuldade >= DIFICULDADE_AVANCADA).length, 0);
}

export function questoesDe(topicos: Topico[]): { questao: Questao; topicoId: string }[] {
  return topicos.flatMap((t) => t.questoes.map((questao) => ({ questao, topicoId: t.id })));
}

function prepararExibicao(item: { questao: Questao; topicoId: string }, rng: () => number): ItemSessao {
  const q = item.questao;
  // Múltipla escolha: ordem do autor (as explicações citam as letras; embaralhar quebraria a referência).
  // O equilíbrio da posição do gabarito é garantido no conteúdo (revisão) e conferido em tests/conteudo.test.ts.
  if (q.tipo === 'multipla') return { ...item, ordemExibicao: q.alternativas.map((a) => a.id) };
  if (q.tipo === 'ordenar') {
    // Garante que a ordem inicial exibida não seja a resposta certa.
    let ordem = embaralhar(q.itens.map((i) => i.id), rng);
    for (let tent = 0; tent < 5 && ordem.join() === q.ordemCorreta.join(); tent++) ordem = embaralhar(ordem, rng);
    return { ...item, ordemExibicao: ordem };
  }
  if (q.tipo === 'associar') return { ...item, ordemExibicao: embaralhar(q.pares.map((p) => p.direita), rng) };
  return { ...item };
}

/**
 * Estudo: prioriza questões vencidas na revisão espaçada, depois não vistas, em dificuldade crescente.
 * Plantão: sorteio dentre tipos rápidos, mistura de dificuldades.
 * Revisão: apenas vencidas.
 */
export function montarSessao(topicos: Topico[], o: OpcoesSessao): ItemSessao[] {
  const rng = o.rng ?? Math.random;
  const agora = o.agora ?? Date.now();
  const estados = o.estados ?? new Map<string, EstadoItem>();
  let pool = questoesDe(topicos);
  const tipos = o.tipos ?? (o.modo === 'plantao' ? (['multipla', 'vf'] as Questao['tipo'][]) : undefined);
  if (tipos) pool = pool.filter((p) => tipos.includes(p.questao.tipo));
  const minima = o.dificuldadeMinima;
  if (minima) pool = pool.filter((p) => p.questao.dificuldade >= minima);

  let escolhidas: { questao: Questao; topicoId: string }[];
  if (o.modo === 'plantao') {
    escolhidas = embaralhar(pool, rng).slice(0, o.tamanho);
  } else {
    const vencidas = pool.filter((p) => {
      const e = estados.get(p.questao.id);
      return e && e.proximaRevisao <= agora;
    });
    if (o.modo === 'revisao') {
      escolhidas = embaralhar(vencidas, rng).slice(0, o.tamanho);
    } else {
      const naoVistas = embaralhar(
        pool.filter((p) => !estados.has(p.questao.id)),
        rng,
      ).sort((a, b) => a.questao.dificuldade - b.questao.dificuldade);
      const restantes = embaralhar(
        pool.filter((p) => estados.has(p.questao.id) && !vencidas.includes(p)),
        rng,
      );
      const ordenadas = [...embaralhar(vencidas, rng), ...naoVistas, ...restantes];
      escolhidas = ordenadas.slice(0, o.tamanho);
      // Mantém a curva de dificuldade agradável: fáceis primeiro dentro da sessão.
      escolhidas.sort((a, b) => a.questao.dificuldade - b.questao.dificuldade);
    }
  }
  return escolhidas.map((e) => prepararExibicao(e, rng));
}
