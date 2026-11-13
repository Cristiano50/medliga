// Medalhas das conquistas e selos dos títulos de nível. Puro: serve ao app, aos testes e às pranchas do canvas.
// Mesma linguagem dos ícones (src/ui/icones.ts): uma placa de cor chapada, um anel em volta e o ícone por cima, em tinta.
// Desenho por código próprio; nada vem de biblioteca de terceiros.
import { ICONES, type NomeIcone, type ParteIcone } from './icones.ts';

/** Um caminho SVG com a sua pintura. */
export interface FormaInsignia {
  d: string;
  /** preenchimento (ausente = sem preenchimento) */
  f?: string;
  /** opacidade do preenchimento */
  fo?: number;
  /** traço */
  s?: string;
  sw?: number;
  /** opacidade da forma inteira */
  o?: number;
  /** transformação SVG */
  tr?: string;
  /** ponta do traço reta (o padrão é arredondada) */
  reto?: boolean;
}

const TINTA = '#0b1220';
const APAGADO = '#8794b0';
const PLACA_FECHADA = '#17223b';
const BORDA_FECHADA = '#2c3a5c';
const TRILHO = '#22304f';
const FITA_FECHADA = '#1e2a47';

const n = (v: number) => +v.toFixed(2);
const circulo = (cx: number, cy: number, r: number) => `M${n(cx + r)} ${cy} A${r} ${r} 0 1 1 ${n(cx - r)} ${cy} A${r} ${r} 0 0 1 ${n(cx + r)} ${cy} Z`;
/** Ponto no círculo: ângulo em graus a partir do topo, no sentido horário. */
const polar = (cx: number, cy: number, r: number, graus: number): [number, number] => {
  const a = (graus * Math.PI) / 180;
  return [n(cx + r * Math.sin(a)), n(cy - r * Math.cos(a))];
};
/** Arco de círculo do ângulo `de` ao ângulo `ate` (graus a partir do topo, sentido horário). */
const arco = (cx: number, cy: number, r: number, de: number, ate: number) => {
  const [x0, y0] = polar(cx, cy, r, de);
  const [x1, y1] = polar(cx, cy, r, ate);
  return `M${x0} ${y0} A${r} ${r} 0 ${ate - de > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

/** As partes de um ícone, numa cor, encaixadas numa caixa de lado `lado` centrada em (cx, cy). */
function iconeEm(nome: NomeIcone, cor: string, cx: number, cy: number, lado: number): FormaInsignia[] {
  const k = n(lado / 24);
  const tr = `translate(${cx} ${cy}) scale(${k}) translate(-12 -12)`;
  return (ICONES[nome] as ParteIcone[]).map((p) =>
    typeof p === 'string' ? { d: p, s: cor, sw: 2, tr } : p.p === 'suave' ? { d: p.d, f: cor, fo: 0.2, tr } : { d: p.d, f: cor, tr },
  );
}

// ------------------------------------------------------------------------------------------------ medalhas
export type Familia = 'liga' | 'sequencia' | 'jogos' | 'dominio' | 'carreira';
export type FormaPlaca = 'circulo' | 'losango' | 'hexagono' | 'escudo' | 'roseta';

/** Cada família de conquistas tem uma cor e uma forma de placa: a forma distingue as famílias mesmo sem a cor. */
export const FAMILIAS: Record<Familia, { nome: string; cor: string; escura: string; forma: FormaPlaca }> = {
  liga: { nome: 'Liga', cor: '#2dd4bf', escura: '#0f8f80', forma: 'circulo' },
  sequencia: { nome: 'Sequência', cor: '#f0705a', escura: '#b8402c', forma: 'losango' },
  jogos: { nome: 'Jogos', cor: '#4f8ef7', escura: '#2c62c4', forma: 'hexagono' },
  dominio: { nome: 'Domínio', cor: '#8b7cf0', escura: '#5a49c9', forma: 'escudo' },
  carreira: { nome: 'Carreira', cor: '#f5b942', escura: '#b97f10', forma: 'roseta' },
};

/** Anel das medalhas em três graus (3, 7 e 30 dias; 1, 10 e todos os tópicos). */
export const METAIS = { 1: '#c98a5a', 2: '#c3ccda', 3: '#f5b942' } as const;
export const NOMES_GRAU = { 1: 'bronze', 2: 'prata', 3: 'ouro' } as const;

/** Medalha de cada conquista (as chaves são os ids de src/core/conquistas.ts). */
export const MEDALHAS: Record<string, { familia: Familia; grau?: 1 | 2 | 3 }> = {
  'primeiro-passo': { familia: 'liga' },
  'vestiu-a-camisa': { familia: 'liga' },
  revisor: { familia: 'liga' },
  'sequencia-3': { familia: 'sequencia', grau: 1 },
  'sequencia-7': { familia: 'sequencia', grau: 2 },
  'sequencia-30': { familia: 'sequencia', grau: 3 },
  plantonista: { familia: 'jogos' },
  'plantao-perfeito': { familia: 'jogos' },
  'olho-clinico': { familia: 'jogos' },
  camadas: { familia: 'jogos' },
  cronologista: { familia: 'jogos' },
  'dominio-1': { familia: 'dominio', grau: 1 },
  'dominio-10': { familia: 'dominio', grau: 2 },
  'dominio-todos': { familia: 'dominio', grau: 3 },
  'nivel-10': { familia: 'carreira' },
  'xp-10000': { familia: 'carreira' },
};

/** Caixa do desenho da medalha: placa centrada em (36, 32), anel de raio 28 e as pontas da fita embaixo. */
export const CAIXA_MEDALHA = '0 0 72 76';
const MX = 36;
const MY = 32;
const R_ANEL = 28;

function roseta(cx: number, cy: number, vale: number, pico: number, gomos: number): string {
  const passo = 360 / gomos;
  // ponto de controle afastado para a curva passar pelo pico
  const controle = 2 * pico - vale * Math.cos((passo / 2) * (Math.PI / 180));
  const [x0, y0] = polar(cx, cy, vale, 0);
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < gomos; i++) {
    const [qx, qy] = polar(cx, cy, controle, i * passo + passo / 2);
    const [x, y] = polar(cx, cy, vale, (i + 1) * passo);
    d += ` Q${qx} ${qy} ${x} ${y}`;
  }
  return d + ' Z';
}

const PLACAS: Record<FormaPlaca, string> = {
  circulo: circulo(MX, MY, 20),
  losango: `M${MX} 9.5 L58.5 ${MY} L${MX} 54.5 L13.5 ${MY} Z`,
  hexagono: `M${MX} 11 L54.19 21.5 V42.5 L${MX} 53 L17.81 42.5 V21.5 Z`,
  escudo: 'M19.5 14 H52.5 V31 C52.5 41.5 45.5 48.5 36 52 C26.5 48.5 19.5 41.5 19.5 31 Z',
  roseta: roseta(MX, MY, 18.5, 21.5, 12),
};
const FITA = 'M27 50 L20 72 L28.5 66.5 L35 72 L36 54 Z M45 50 L52 72 L43.5 66.5 L37 72 L36 54 Z';
const DENTRO = `translate(${MX} ${MY}) scale(0.8) translate(${-MX} ${-MY})`;

export interface EstadoMedalha {
  obtida: boolean;
  /** de 0 a 1; só aparece enquanto a medalha não foi obtida */
  progresso: number;
}

/**
 * Formas da medalha de uma conquista, de trás para a frente: fita, anel, placa, filete e ícone.
 * Obtida: placa na cor da família e anel inteiro (bronze, prata ou ouro nas conquistas em graus).
 * Ainda não obtida: placa escura, ícone apagado e o anel mostra quanto falta.
 */
export function medalhaFormas(id: string, icone: NomeIcone, estado: EstadoMedalha): FormaInsignia[] {
  const m = MEDALHAS[id];
  const fam = FAMILIAS[m?.familia ?? 'liga'];
  const placa = PLACAS[fam.forma];
  const p = Math.max(0, Math.min(1, estado.progresso));
  const formas: FormaInsignia[] = [{ d: FITA, f: estado.obtida ? fam.escura : FITA_FECHADA }];
  if (estado.obtida) {
    formas.push({ d: circulo(MX, MY, R_ANEL), s: m?.grau ? METAIS[m.grau] : fam.cor, sw: 3 });
    formas.push({ d: placa, f: fam.cor, s: fam.cor, sw: 3 });
    formas.push({ d: placa, s: '#ffffff', sw: 1.6, o: 0.5, tr: DENTRO });
  } else {
    formas.push({ d: circulo(MX, MY, R_ANEL), s: TRILHO, sw: 3 });
    if (p > 0) formas.push({ d: arco(MX, MY, R_ANEL, 0, Math.min(359.9, p * 360)), s: fam.cor, sw: 3 });
    formas.push({ d: placa, f: PLACA_FECHADA, s: BORDA_FECHADA, sw: 3 });
  }
  formas.push(...iconeEm(icone, estado.obtida ? TINTA : APAGADO, MX, MY, 25));
  return formas;
}

/** Texto alternativo da medalha: diz se foi obtida ou quanto do caminho já foi feito. */
export function descricaoMedalha(nome: string, estado: EstadoMedalha): string {
  if (estado.obtida) return `Medalha ${nome}: obtida`;
  const pct = Math.round(Math.max(0, Math.min(1, estado.progresso)) * 100);
  return pct > 0 ? `Medalha ${nome}: ${pct}% do caminho` : `Medalha ${nome}: ainda não obtida`;
}

// ------------------------------------------------------------------------------------------------ selos de nível
const VERDE_AGUA = '#2dd4bf';
const AZUL = '#4f8ef7';
const VIOLETA = '#8b7cf0';
const OURO = '#f5b942';

/**
 * Selo de cada título de nível, na ordem de TITULOS_NIVEL (src/core/scoring.ts). A cor muda por fase
 * (ciclo básico, clínica, residência e docência) e o anel de oito gomos mostra em que degrau o título está.
 */
export const SELOS: { min: number; icone: NomeIcone; cor: string }[] = [
  { min: 1, icone: 'livro', cor: VERDE_AGUA },
  { min: 5, icone: 'estudar', cor: VERDE_AGUA },
  { min: 10, icone: 'estetoscopio', cor: VERDE_AGUA },
  { min: 15, icone: 'camisa', cor: AZUL },
  { min: 20, icone: 'pulso', cor: AZUL },
  { min: 30, icone: 'bisturi', cor: VIOLETA },
  { min: 40, icone: 'estrela', cor: VIOLETA },
  { min: 50, icone: 'capelo', cor: OURO },
];

/** Posição (0 a 7) do título a que o nível pertence. */
export function indiceDoSelo(nivel: number): number {
  let i = 0;
  SELOS.forEach((s, k) => {
    if (nivel >= s.min) i = k;
  });
  return i;
}

export const CAIXA_SELO = '0 0 48 48';
/** Até este tamanho (px), o selo é desenhado sem o emblema: só o disco e o anel. */
export const LADO_SELO_COMPACTO = 22;
const SX = 24;
const SY = 24;
const GOMOS = 8;
const FOLGA = 12; // graus entre dois gomos

const gomos = (de: number, ate: number) =>
  Array.from({ length: ate - de }, (_, k) => arco(SX, SY, 20, (de + k) * (360 / GOMOS) + FOLGA / 2, (de + k + 1) * (360 / GOMOS) - FOLGA / 2)).join(' ');

export interface EstadoSelo {
  /** título já alcançado (colorido) ou ainda por vir (apagado) */
  ativo: boolean;
  /** sem o emblema, para tamanhos pequenos */
  compacto?: boolean;
}

/** Formas do selo do título de posição `indice` (0 = Calouro … 7 = Professor Titular). */
export function seloFormas(indice: number, estado: EstadoSelo): FormaInsignia[] {
  const i = Math.max(0, Math.min(SELOS.length - 1, indice));
  const selo = SELOS[i];
  const cheios = i + 1;
  const formas: FormaInsignia[] = [];
  if (cheios < GOMOS) formas.push({ d: gomos(cheios, GOMOS), s: TRILHO, sw: 4, reto: true });
  formas.push({ d: gomos(0, cheios), s: estado.ativo ? selo.cor : '#3a4a6e', sw: 4, reto: true });
  formas.push(estado.ativo ? { d: circulo(SX, SY, 13.5), f: selo.cor } : { d: circulo(SX, SY, 12.75), f: PLACA_FECHADA, s: BORDA_FECHADA, sw: 1.5 });
  if (!estado.compacto) formas.push(...iconeEm(selo.icone, estado.ativo ? TINTA : APAGADO, SX, SY, 18));
  return formas;
}

// ------------------------------------------------------------------------------------------------ SVG como texto
/** Uma forma como marcação SVG (prévias, pranchas do canvas e testes). O app desenha as mesmas formas em React. */
export function formaInsigniaParaSvg(f: FormaInsignia): string {
  const a = [`d="${f.d}"`, `fill="${f.f ?? 'none'}"`];
  if (f.fo !== undefined) a.push(`fill-opacity="${f.fo}"`);
  if (f.s) a.push(`stroke="${f.s}" stroke-width="${f.sw ?? 2}" stroke-linecap="${f.reto ? 'butt' : 'round'}" stroke-linejoin="round"`);
  if (f.o !== undefined) a.push(`opacity="${f.o}"`);
  if (f.tr) a.push(`transform="${f.tr}"`);
  return `<path ${a.join(' ')}/>`;
}

export function insigniaParaSvg(formas: FormaInsignia[], caixa: string, largura: number): string {
  const [, , w, h] = caixa.split(' ').map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${n((largura * h) / w)}" viewBox="${caixa}">${formas.map(formaInsigniaParaSvg).join('')}</svg>`;
}
