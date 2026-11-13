// Regras do avatar: validação, desbloqueio por nível e por conquista, sorteio, aviso de contraste e texto
// alternativo. Puro e testável.
// O desbloqueio é conferido só no aparelho: nível e conquistas não existem no servidor (ver docs/arquitetura.md).
import type { AvatarConfig, Categoria, ItemAvatar } from './tipos.ts';
import { CATEGORIAS } from './tipos.ts';
import { CATALOGO, item } from './catalogo.ts';
import { CABELOS, COBERTURAS } from './pecas.ts';
import { contraste } from './cor.ts';
import { CONQUISTAS } from '../../core/conquistas.ts';
import { TITULOS_NIVEL } from '../../core/scoring.ts';

/** O que o jogador já alcançou, para decidir o que está liberado. */
export interface Progresso {
  nivel: number;
  conquistas: ReadonlySet<string>;
}

/**
 * Item livre de cada categoria: é para onde vai um id desconhecido ou um item ainda bloqueado.
 * Não é "o avatar padrão" de ninguém: quem não montou o avatar aparece como silhueta, e o editor abre num sorteio.
 */
export const AVATAR_INICIAL: AvatarConfig = {
  v: 1,
  pele: 'p4',
  rosto: 'sorriso',
  cabelo: 'curto',
  corCabelo: 'castanho-escuro',
  cabeca: 'nenhum',
  corCabeca: 'vinho',
  barba: 'nenhuma',
  oculos: 'nenhum',
  apoio: 'nenhum',
  roupa: 'camiseta',
  corRoupa: 'verde-agua',
  acessorio: 'nenhum',
  paramento: 'nenhum',
  fundo: 'ceu',
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

// ------------------------------------------------------------------------------------------------ contraste com o fundo
const corDoItem = (cat: Categoria, id: string) => item(cat, id)?.cor ?? '#808080';

/** O que aparece de cada parte contra o fundo: pele, cabelo (se visível), cobertura (se houver) e roupa. */
function partesContraFundo(c: AvatarConfig): { parte: string; cor: string; minimo: number }[] {
  const cobertura = COBERTURAS[c.cabeca];
  const touca = c.paramento === 'touca';
  const cabeloVisivel = !touca && (!cobertura || !!cobertura.mantemCabelo) && c.cabelo !== 'careca' && !!CABELOS[c.cabelo];
  const partes = [{ parte: 'o rosto', cor: corDoItem('pele', c.pele), minimo: 1.3 }];
  if (cabeloVisivel) partes.push({ parte: 'o cabelo', cor: corDoItem('corCabelo', c.corCabelo), minimo: 1.3 });
  if (cobertura && !cobertura.mantemCabelo && !touca) partes.push({ parte: 'a cobertura de cabeça', cor: corDoItem('corCabeca', c.corCabeca), minimo: 1.3 });
  partes.push({ parte: 'a roupa', cor: c.roupa === 'jaleco' || c.roupa === 'jaleco-titular' ? '#f4f7fb' : c.roupa === 'capote' ? '#8db3d6' : corDoItem('corRoupa', c.corRoupa), minimo: 1.3 });
  return partes;
}

function menorContraste(c: AvatarConfig, fundo: string): number {
  const cor = corDoItem('fundo', fundo);
  return Math.min(...partesContraFundo(c).map((p) => contraste(p.cor, cor)));
}

/** Entre os fundos liberados, o que mais separa a pessoa da cor de trás. */
export function melhorFundo(c: AvatarConfig, p: Progresso): string {
  let melhor = c.fundo;
  let valor = -1;
  for (const it of CATALOGO.fundo) {
    if (!liberado(it, p)) continue;
    const v = menorContraste(c, it.id);
    if (v > valor) {
      valor = v;
      melhor = it.id;
    }
  }
  return melhor;
}

/**
 * Aviso (nunca bloqueio) quando uma parte do avatar se confunde com o fundo escolhido. Devolve a parte que some
 * e um fundo melhor, ou null quando está tudo legível ou não há fundo melhor entre os liberados.
 */
export function avisoDeContraste(c: AvatarConfig, p: Progresso): { parte: string; fundo: string } | null {
  const cor = corDoItem('fundo', c.fundo);
  const fraca = partesContraFundo(c).find((x) => contraste(x.cor, cor) < x.minimo);
  if (!fraca) return null;
  const fundo = melhorFundo(c, p);
  if (fundo === c.fundo || menorContraste(c, fundo) <= menorContraste(c, c.fundo)) return null;
  return { parte: fraca.parte, fundo };
}

// ------------------------------------------------------------------------------------------------ sorteio
/** No sorteio, chance de sair "nenhum" nas categorias opcionais (para o resultado não vir sempre carregado). */
const CHANCE_SEM: Partial<Record<Categoria, [string, number]>> = {
  barba: ['nenhuma', 0.65],
  oculos: ['nenhum', 0.6],
  acessorio: ['nenhum', 0.4],
  paramento: ['nenhum', 0.75],
  moldura: ['nenhuma', 0.3],
};
/**
 * Não entram no sorteio: cobertura de cabeça e itens de apoio são peças de identidade ou religiosas, que só a pessoa
 * escolhe. Quando já existe um avatar, o sorteio também mantém a pele e os óculos de quem os escolheu.
 */
const SO_A_PESSOA_ESCOLHE: Categoria[] = ['cabeca', 'corCabeca', 'apoio'];
const MANTIDAS_DO_ATUAL: Categoria[] = ['pele', 'oculos', ...SO_A_PESSOA_ESCOLHE];

/**
 * Sorteia um avatar só com itens liberados. `rng` devolve um número em [0, 1). Com `atual`, mantém o que representa
 * a pessoa (pele, óculos, cobertura de cabeça e apoio) e sorteia o resto.
 */
export function sortearAvatar(p: Progresso, rng: () => number = Math.random, atual?: AvatarConfig | null): AvatarConfig {
  const c: AvatarConfig = { ...AVATAR_INICIAL };
  for (const cat of CATEGORIAS) {
    if (atual && MANTIDAS_DO_ATUAL.includes(cat)) {
      c[cat] = atual[cat];
      continue;
    }
    if (SO_A_PESSOA_ESCOLHE.includes(cat)) continue; // fica em "nenhum"
    const sem = CHANCE_SEM[cat];
    if (sem && rng() < sem[1]) {
      c[cat] = sem[0];
      continue;
    }
    const opcoes = CATALOGO[cat].filter((it) => liberado(it, p) && it.id !== sem?.[0]);
    if (opcoes.length) c[cat] = opcoes[Math.floor(rng() * opcoes.length)].id;
  }
  // Se a pessoa se confunde com o fundo sorteado, troca o fundo pelo que mais a separa.
  if (avisoDeContraste(c, p)) c.fundo = melhorFundo(c, p);
  return c;
}

// ------------------------------------------------------------------------------------------------ texto alternativo
const minusculo = (s: string) => s.charAt(0).toLocaleLowerCase('pt-BR') + s.slice(1);
const altDe = (cat: Categoria, id: string) => {
  const it = item(cat, id);
  return it ? (it.alt ?? minusculo(it.nome)) : '';
};

/**
 * Texto alternativo do avatar: "Avatar de {nome}: {cabelo ou cobertura}, {barba}, {óculos}, {apoio}, {roupa},
 * {acessório}, {paramento}. Moldura {moldura}."
 * Diz só o que a pessoa escolheu, com o nome do catálogo. Não infere gênero, idade, raça, religião nem condição de
 * saúde, e não cita o tom de pele. A moldura entra porque informa o nível ou a conquista.
 */
export function descricaoAvatar(c: AvatarConfig, nome = ''): string {
  const partes: string[] = [];
  const cobertura = COBERTURAS[c.cabeca];
  const touca = c.paramento === 'touca';
  if (!touca && (!cobertura || cobertura.mantemCabelo)) {
    const formas = item('corCabelo', c.corCabelo)?.formas ?? ['', '', ''];
    partes.push(altDe('cabelo', c.cabelo).replace('{cor}', formas[0]).replace('{cores-f}', formas[1]).replace('{cores-m}', formas[2]).replace(/\s+/g, ' ').trim());
  }
  if (cobertura && !(touca && cobertura.mantemCabelo)) partes.push(`${altDe('cabeca', c.cabeca)} ${minusculo(item('corCabeca', c.corCabeca)?.nome ?? '')}`.trim());
  if (c.barba !== 'nenhuma') partes.push(altDe('barba', c.barba));
  if (c.oculos !== 'nenhum') partes.push(altDe('oculos', c.oculos));
  if (c.apoio !== 'nenhum') partes.push(altDe('apoio', c.apoio));
  partes.push(altDe('roupa', c.roupa));
  if (c.acessorio !== 'nenhum') partes.push(altDe('acessorio', c.acessorio));
  if (c.paramento !== 'nenhum') partes.push(altDe('paramento', c.paramento));
  const moldura = c.moldura !== 'nenhuma' ? ` Moldura ${item('moldura', c.moldura)?.nome ?? ''}.` : '';
  return `${nome ? `Avatar de ${nome}` : 'Avatar'}: ${partes.filter(Boolean).join(', ')}.${moldura}`;
}

const CORES_PADRAO = ['#2dd4bf', '#f5b942', '#4f8ef7', '#f0705a', '#8b7cf0', '#34b98a', '#ee7fb0', '#7dd3fc'];

/** Cor de fundo do avatar padrão (silhueta), escolhida pelo nome, sempre a mesma para o mesmo nome. */
export function corDoNome(nome: string): string {
  let h = 0;
  for (const ch of nome) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return CORES_PADRAO[h % CORES_PADRAO.length];
}
