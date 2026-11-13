// Avatar montável do jogador: só peças prontas (sem foto), desenhadas numa grade de 200×200.
// As peças foram desenhadas no canvas do Wonder (arquivo "MedLiga — Gráficos", direção "Suave").

/** Escolhas do jogador: um id curto por categoria. É isto que fica no perfil e vai ao servidor. */
export interface AvatarConfig {
  v: 1;
  pele: string;
  rosto: string;
  cabelo: string;
  corCabelo: string;
  /** cobertura de cabeça de uso pessoal ou religioso (hijab, turbante, dastar, quipá) */
  cabeca: string;
  corCabeca: string;
  barba: string;
  oculos: string;
  /** aparelho auditivo, implante coclear, cordão de girassol */
  apoio: string;
  roupa: string;
  corRoupa: string;
  /** item de jogo usado no corpo (crachá, estetoscópio…) */
  acessorio: string;
  /** item de jogo usado na cabeça ou no rosto (touca, máscara, óculos de proteção, capelo): fica em vaga própria,
   *  para não disputar lugar com a cobertura de cabeça nem com os óculos de quem os usa */
  paramento: string;
  fundo: string;
  moldura: string;
}

export type Categoria = Exclude<keyof AvatarConfig, 'v'>;

export const CATEGORIAS: Categoria[] = [
  'pele',
  'rosto',
  'cabelo',
  'corCabelo',
  'cabeca',
  'corCabeca',
  'barba',
  'oculos',
  'apoio',
  'roupa',
  'corRoupa',
  'acessorio',
  'paramento',
  'fundo',
  'moldura',
];

/**
 * Cor de uma forma: referência à escolha do jogador ('pele', 'cabelo', 'roupa', 'cabeca'), 'marca' (clara sobre
 * cabelo escuro, escura sobre cabelo claro) ou um valor fixo (#rrggbb).
 */
export type Cor = string;

/** Forma vetorial simples. Exatamente um de d (caminho), c (círculo), e (elipse) ou r (retângulo). */
export interface Forma {
  d?: string;
  /** círculo: cx, cy, r */
  c?: [number, number, number];
  /** elipse: cx, cy, rx, ry */
  e?: [number, number, number, number];
  /** retângulo: x, y, largura, altura, raio */
  r?: [number, number, number, number, number];
  /** preenchimento */
  f?: Cor;
  /** traço (pontas e junções sempre arredondadas) */
  s?: Cor;
  sw?: number;
  /** opacidade (0 a 1) */
  o?: number;
  /** regra par-ímpar, para formas com janela */
  par?: boolean;
  /** tracejado */
  dash?: string;
  /** transformação SVG (deslocamento, espelhamento) */
  tr?: string;
  /** marca usada pela montagem para omitir a forma em certas combinações (ex.: 'cordao') */
  tag?: string;
}

/** Como um item é liberado. Os livres não têm regra. */
export type Desbloqueio = { tipo: 'nivel'; nivel: number } | { tipo: 'conquista'; id: string };

export interface ItemAvatar {
  id: string;
  nome: string;
  desbloqueio?: Desbloqueio;
  /** valor da cor: nas categorias de cor (pele, corCabelo, corRoupa, corCabeca) e a cor dominante do fundo */
  cor?: string;
  /**
   * Como o item entra no texto alternativo, quando o nome do botão não compõe frase.
   * No cabelo, {cor}, {cores-f} e {cores-m} marcam o lugar da cor ("tranças {cores-f}" → "tranças pretas").
   */
  alt?: string;
  /** nas cores de cabelo: masculino singular, feminino plural e masculino plural ("preto", "pretas", "pretos") */
  formas?: [string, string, string];
}
