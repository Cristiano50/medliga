// Regras do avatar: validação, desbloqueio por nível e por conquista, sorteio e texto alternativo. Puro e testável.
// O desbloqueio é conferido só no aparelho: nível e conquistas não existem no servidor (ver docs/arquitetura.md).
import type { AvatarConfig, Categoria, ItemAvatar } from './tipos.ts';
import { CATEGORIAS } from './tipos.ts';
import { CATALOGO, item } from './catalogo.ts';
import { CONQUISTAS } from '../../core/conquistas.ts';
import { TITULOS_NIVEL } from '../../core/scoring.ts';

/** O que o jogador já alcançou, para decidir o que está liberado. */
export interface Progresso {
  nivel: number;
  conquistas: ReadonlySet<string>;
}

/** Ponto de partida do editor: o primeiro item livre de cada categoria (o aluno escolhe a pele no primeiro passo). */
export const AVATAR_INICIAL: AvatarConfig = {
  v: 1,
  pele: 'p4',
  rosto: 'sorriso',
  cabelo: 'curto',
  corCabelo: 'castanho-escuro',
  cabeca: 'nenhum',
  barba: 'nenhuma',
  oculos: 'nenhum',
  roupa: 'camiseta',
  corRoupa: 'verde-agua',
  acessorio: 'nenhum',
  fundo: 'verde-agua',
  moldura: 'nenhuma',
};

export const chaveItem = (categoria: Categoria, id: string) => `${categoria}:${id}`;

export function liberado(it: ItemAvatar, p: Progresso): boolean {
  const d = it.desbloqueio;
  if (!d) return true;
  return d.tipo === 'nivel' ? p.nivel >= d.nivel : p.conquistas.has(d.id);
}

/** Texto curto de como liberar o item (null para os livres). */
export function comoLiberar(it: ItemAvatar): string | null {
  const d = it.desbloqueio;
  if (!d) return null;
  if (d.tipo === 'nivel') {
    const titulo = TITULOS_NIVEL.find((t) => t.min === d.nivel)?.titulo;
    return titulo ? `Nível ${d.nivel} · ${titulo}` : `Nível ${d.nivel}`;
  }
  return `Conquista: ${CONQUISTAS.find((c) => c.id === d.id)?.nome ?? d.id}`;
}

/**
 * Valida um avatar vindo do banco local ou do servidor. Aceita só ids que existem no catálogo: um id desconhecido
 * vira o item inicial da categoria e nunca é usado como texto ou marcação. Devolve null se não for um avatar.
 */
export function normalizarAvatar(x: unknown): AvatarConfig | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  if (o.v !== 1) return null;
  const c: AvatarConfig = { ...AVATAR_INICIAL };
  for (const cat of CATEGORIAS) {
    const id = o[cat];
    if (typeof id === 'string' && item(cat, id)) c[cat] = id;
  }
  return c;
}

/** Troca por itens livres o que o jogador ainda não liberou (usado ao salvar). */
export function restringirAoLiberado(c: AvatarConfig, p: Progresso): AvatarConfig {
  const r = { ...c };
  for (const cat of CATEGORIAS) {
    const it = item(cat, c[cat]);
    if (!it || !liberado(it, p)) r[cat] = AVATAR_INICIAL[cat];
  }
  return r;
}

/** Chaves (categoria:id) dos itens com regra de desbloqueio que o jogador já liberou. */
export function itensLiberados(p: Progresso): string[] {
  const r: string[] = [];
  for (const cat of CATEGORIAS) for (const it of CATALOGO[cat]) if (it.desbloqueio && liberado(it, p)) r.push(chaveItem(cat, it.id));
  return r;
}

/** Itens liberados que o jogador ainda não viu no editor. */
export function itensNovos(p: Progresso, vistos: readonly string[] | undefined): string[] {
  const ja = new Set(vistos ?? []);
  return itensLiberados(p).filter((k) => !ja.has(k));
}

/** No sorteio, chance de sair "nenhum" nas categorias opcionais (para o resultado não vir sempre carregado). */
const CHANCE_SEM: Partial<Record<Categoria, [string, number]>> = {
  cabeca: ['nenhum', 0.7],
  barba: ['nenhuma', 0.65],
  oculos: ['nenhum', 0.6],
  acessorio: ['nenhum', 0.4],
  moldura: ['nenhuma', 0.3],
};

/** Sorteia um avatar só com itens liberados. `rng` devolve um número em [0, 1). */
export function sortearAvatar(p: Progresso, rng: () => number = Math.random): AvatarConfig {
  const c: AvatarConfig = { ...AVATAR_INICIAL };
  for (const cat of CATEGORIAS) {
    const sem = CHANCE_SEM[cat];
    if (sem && rng() < sem[1]) {
      c[cat] = sem[0];
      continue;
    }
    const opcoes = CATALOGO[cat].filter((it) => liberado(it, p) && it.id !== sem?.[0]);
    if (opcoes.length) c[cat] = opcoes[Math.floor(rng() * opcoes.length)].id;
  }
  return c;
}

const minusculo = (s: string) => s.charAt(0).toLocaleLowerCase('pt-BR') + s.slice(1);

/**
 * Texto alternativo do avatar: descreve o que o jogador escolheu (cabelo ou cobertura, barba, óculos, roupa e
 * acessório), sem inferir gênero, idade ou raça e sem citar o tom de pele.
 */
export function descricaoAvatar(c: AvatarConfig): string {
  const partes: string[] = [];
  if (c.cabeca !== 'nenhum') partes.push(minusculo(item('cabeca', c.cabeca)?.nome ?? ''));
  else if (c.cabelo === 'careca') partes.push('careca');
  else partes.push(`cabelo ${minusculo(item('cabelo', c.cabelo)?.nome ?? '')} ${minusculo(item('corCabelo', c.corCabelo)?.nome ?? '')}`.trim());
  if (c.barba !== 'nenhuma') partes.push(minusculo(item('barba', c.barba)?.nome ?? ''));
  if (c.oculos !== 'nenhum') partes.push(`óculos ${minusculo(item('oculos', c.oculos)?.nome ?? '')}`);
  partes.push(minusculo(item('roupa', c.roupa)?.nome ?? ''));
  if (c.acessorio !== 'nenhum') partes.push(minusculo(item('acessorio', c.acessorio)?.nome ?? ''));
  return `Avatar: ${partes.filter(Boolean).join(', ')}`;
}

const CORES_PADRAO = ['#2dd4bf', '#f5b942', '#4f8ef7', '#f0705a', '#8b7cf0', '#34b98a', '#ee7fb0', '#7dd3fc'];

/** Cor de fundo do avatar padrão (silhueta), escolhida pelo nome, sempre a mesma para o mesmo nome. */
export function corDoNome(nome: string): string {
  let h = 0;
  for (const ch of nome) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return CORES_PADRAO[h % CORES_PADRAO.length];
}
