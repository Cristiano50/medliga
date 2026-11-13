// Avatar montável do jogador: só peças prontas (sem foto), desenhadas numa grade de 200×200.
// As peças foram desenhadas no canvas do Wonder (arquivo "MedLiga — Gráficos", direção "Suave").

/** Escolhas do jogador: um id curto por categoria. É isto que fica no perfil e vai ao servidor. */
export interface AvatarConfig {
  v: 1;
  pele: string;
  rosto: string;
  cabelo: string;
  corCabelo: string;
  cabeca: string;
  barba: string;
  oculos: string;
  roupa: string;
  corRoupa: string;
  acessorio: string;
  fundo: string;
  moldura: string;
}

export type Categoria = Exclude<keyof AvatarConfig, 'v'>;

export const CATEGORIAS: Categoria[] = ['pele', 'rosto', 'cabelo', 'corCabelo', 'cabeca', 'barba', 'oculos', 'roupa', 'corRoupa', 'acessorio', 'fundo', 'moldura'];

/** Cor de uma forma: referência à escolha do jogador ('pele', 'cabelo', 'roupa') ou um valor fixo (#rrggbb). */
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
}

/** Como um item é liberado. Os livres não têm regra. */
export type Desbloqueio = { tipo: 'nivel'; nivel: number } | { tipo: 'conquista'; id: string };

export interface ItemAvatar {
  id: string;
  nome: string;
  desbloqueio?: Desbloqueio;
  /** valor da cor, nas categorias de cor (pele, corCabelo, corRoupa) */
  cor?: string;
}
