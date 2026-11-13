// Peças do avatar (direção "Suave": formas arredondadas e chapadas, sem contorno), numa grade de 200×200.
// Referências de anatomia: cabeça de x 63–137 e y 60–131; olhos em y 92; boca em y 109; pescoço de x 86–114;
// ombros a partir de y 147. Tudo o que fica dentro da moldura é recortado por um círculo de raio 100.
// Zona segura: o que importa numa peça fica a até 84 un. do centro; daí para fora a moldura cobre.
// As correções de legibilidade e de representação vêm da revisão independente de 13/11/2026.
import type { Forma } from './tipos.ts';

const T = '#0b1220'; // tinta (olhos, boca, sombras)
const B = '#ffffff';
const OURO = '#f5b942';
const VERDE = '#2dd4bf';
const METAL = '#c3ccda';
const ARDOSIA = '#22304f';
/** Par claro dos traços do rosto: rosa-claro quente (lê como lábio ou luz, não como tinta branca). */
const LUZ = '#ffc4b5';
const BORRACHA = '#d9480f';

export const CABECA = 'M63 84 C63 52 137 52 137 84 V96 C137 122 119 131 100 131 C81 131 63 122 63 96 Z';
const TRONCO = 'M26 200 C26 168 50 151 78 147 L122 147 C150 151 174 168 174 200 Z';

// ------------------------------------------------------------------------------------------------ corpo
export const PESCOCO: Forma[] = [
  { d: 'M86 116 H114 V146 C114 158 86 158 86 146 Z', f: 'pele' },
  { d: 'M86 126 H114 V134 C106 141 94 141 86 134 Z', f: T, o: 0.16 },
];
export const ROSTO_BASE: Forma[] = [
  { c: [62, 93, 8], f: 'pele' },
  { c: [138, 93, 8], f: 'pele' },
  { d: CABECA, f: 'pele' },
  { c: [78, 104, 7], f: '#f0705a', o: 0.22 },
  { c: [122, 104, 7], f: '#f0705a', o: 0.22 },
];

// Todo traço escuro do rosto leva um par claro, o mesmo para todos os tons de pele (sem regra por tom):
// o olho aberto tem esclera em amêndoa (o branco aparece só nos cantos) e a boca tem um arco claro por baixo.
// Na pele clara o par quase não aparece; na escura é ele que mantém o rosto legível (medido a 32 px).
const OLHOS: Forma[] = [
  { e: [85, 92, 7.6, 5.6], f: B },
  { e: [115, 92, 7.6, 5.6], f: B },
  { e: [85, 92, 4.4, 5.6], f: T },
  { e: [115, 92, 4.4, 5.6], f: T },
  { c: [86.5, 90, 1.4], f: B, o: 0.9 },
  { c: [116.5, 90, 1.4], f: B, o: 0.9 },
];
const claro = (d: string, sw = 3, o = 0.65): Forma => ({ d, s: LUZ, sw, o });
/** Expressões: olhos (desenhados antes da barba) e boca (desenhada depois). */
export const ROSTOS: Record<string, { olhos: Forma[]; boca: Forma[] }> = {
  sorriso: { olhos: OLHOS, boca: [claro('M91 113.2 Q100 121.6 109 113.2'), { d: 'M90 109 Q100 118 110 109', s: T, sw: 3.4 }] },
  serio: { olhos: OLHOS, boca: [claro('M92.6 114.8 H107.4', 3.4), { d: 'M92 111 H108', s: T, sw: 3.8 }] },
  confiante: {
    olhos: [...OLHOS, { d: 'M77 81.6 L92 79.6', s: T, sw: 3.6 }, { d: 'M108 79.6 L123 81.6', s: T, sw: 3.6 }],
    boca: [claro('M92 113.8 Q103 120.8 110 111.4'), { d: 'M91 110 Q103 117 111 107', s: T, sw: 3.4 }],
  },
  alegre: {
    olhos: [
      claro('M80.2 97.6 Q85 90.8 89.8 97.6', 3.4),
      claro('M110.2 97.6 Q115 90.8 119.8 97.6', 3.4),
      { d: 'M80 94 Q85 87 90 94', s: T, sw: 3.6 },
      { d: 'M110 94 Q115 87 120 94', s: T, sw: 3.6 },
    ],
    boca: [{ d: 'M88 106 Q100 124 112 106 Z', f: T }, { d: 'M91 107.5 H109 Q107 111 100 111 Q93 111 91 107.5 Z', f: B }, { d: 'M94 115 Q100 119.5 106 115 Q100 113 94 115 Z', f: '#f0705a' }],
  },
  sono: {
    olhos: [
      claro('M80.2 96.2 H89.8', 3),
      claro('M110.2 96.2 H119.8', 3),
      { d: 'M80 93 H90', s: T, sw: 3.4 },
      { d: 'M110 93 H120', s: T, sw: 3.4 },
      { d: 'M80 102 Q85 105.5 90 102', s: T, sw: 2, o: 0.4 },
      { d: 'M110 102 Q115 105.5 120 102', s: T, sw: 2, o: 0.4 },
    ],
    boca: [{ e: [100, 112, 4.4, 5], f: T }, { e: [100, 113.6, 3, 2.8], f: '#ff8a75' }],
  },
};

// ------------------------------------------------------------------------------------------------ cabelo
const circulos = (lista: [number, number, number][], f = 'cabelo'): Forma[] => lista.map((c) => ({ c, f }));
const PUXADO = 'M63 84 C60 56 82 44 100 44 C118 44 140 56 137 84 C134 70 122 60 100 60 C78 60 66 70 63 84 Z';
/** Textura de trança: pontos pequenos no eixo do fio, claros no cabelo escuro e escuros no claro (cor 'marca'). */
const marcas = (d: string, sw: number): Forma => ({ d, s: 'marca', sw: +(sw * 0.42).toFixed(1), o: 0.22, dash: '0.1 7.4' });
const TRANCAS = ['M52 86 C45 106 45 128 47 150', 'M61 72 C52 98 54 130 56 162', 'M71 64 C62 98 66 132 67 166', 'M148 86 C155 106 155 128 153 150', 'M139 72 C148 98 146 130 144 162', 'M129 64 C138 98 134 132 133 166'];
// Dreads: fios grossos, de comprimentos desiguais, sem marca regular (o que os separa das tranças).
const DREADS = ['M54 82 C44 100 43 120 46 136', 'M61 70 C49 96 50 132 52 168', 'M70 62 C60 94 62 126 63 150', 'M79 58 C71 90 73 130 75 174', 'M146 82 C156 100 157 120 154 142', 'M139 70 C151 96 150 132 148 162', 'M130 62 C140 94 138 126 137 176', 'M121 58 C129 90 127 130 125 154'];

export interface Cabelo {
  atras: Forma[];
  frente: Forma[];
  /** y do ponto mais alto do cabelo no eixo central (para assentar o quipá) */
  topo: number;
  /** volume no alto da cabeça (coque): some dentro do capelo */
  volumeNoTopo?: boolean;
}

/** Cada cabelo tem uma parte atrás da cabeça e uma parte à frente (franja, topo). */
export const CABELOS: Record<string, Cabelo> = {
  careca: { atras: [], frente: [], topo: 60 },
  // translúcido e limitado ao contorno da cabeça; linha do cabelo na mesma altura dos outros cortes
  raspado: { atras: [], frente: [{ d: 'M63 84 C63 52 137 52 137 84 V91 C135.5 79 129 71 119 68.6 C107 66.4 93 66.4 81 68.6 C71 71 64.5 79 63 91 Z', f: 'cabelo', o: 0.5 }], topo: 60 },
  curto: { atras: [], frente: [{ d: 'M62 86 C56 50 82 38 104 40 C132 42 144 60 138 88 C135 74 127 66 115 63 C100 70 82 70 69 67 C67 73 65.6 80 64.8 87 L62 86 Z', f: 'cabelo' }], topo: 41 },
  topete: { atras: [], frente: [{ d: 'M62 86 C57 58 72 46 90 46 C94 32 120 28 132 40 C144 50 142 70 138 88 C136 76 130 67 120 65 C108 60 92 67 74 65 C68 69 64 77 62 86 Z', f: 'cabelo' }], topo: 40 },
  // entradas: a linha do cabelo recua nas têmporas
  entradas: {
    atras: [],
    frente: [{ d: 'M62 88 C56 52 82 40 102 41 C130 42 144 60 138 88 C136 78 132 70 126 66 C121 60 114 58 108 60 C103 63 97 63 92 60 C86 58 79 60 74 66 C68 70 64 78 62 88 Z', f: 'cabelo' }],
    topo: 42,
  },
  // laterais arredondadas, coladas à cabeça e mais largas na altura da orelha
  'calvo-lateral': {
    atras: [
      { d: 'M68 69 C60 68 54 77 54.5 89 C55 99 59 105.5 65.5 105 L70 99 Z', f: 'cabelo' },
      { d: 'M132 69 C140 68 146 77 145.5 89 C145 99 141 105.5 134.5 105 L130 99 Z', f: 'cabelo' },
    ],
    frente: [
      { d: 'M63.6 97 C62 85 63.4 75 67.4 68 C70.6 72 71.6 79 70.6 86 C69.4 90.4 66.6 94 63.6 97 Z', f: 'cabelo' },
      { d: 'M136.4 97 C138 85 136.6 75 132.6 68 C129.4 72 128.4 79 129.4 86 C130.6 90.4 133.4 94 136.4 97 Z', f: 'cabelo' },
    ],
    topo: 60,
  },
  'lateral-raspada': {
    atras: [],
    frente: [
      { d: 'M63 90 C63 80 64.5 74 68 70.5 C71 67.5 75 65 79 63.8 L82 69 C72 72 67 80 63 90 Z', f: 'cabelo', o: 0.5 },
      { d: 'M137 90 C137 80 135.5 74 132 70.5 C129 67.5 125 65 121 63.8 L118 69 C128 72 133 80 137 90 Z', f: 'cabelo', o: 0.5 },
      { d: 'M70 64 C72 40 104 32 126 42 C138 48 138 62 130 68 C116 61 96 63 80 71 C75 70 71 68 70 64 Z', f: 'cabelo' },
    ],
    topo: 37,
  },
  // crespo curto: ondas miúdas e juntas, coladas à cabeça
  'curto-crespo': {
    atras: [],
    frente: [
      ...circulos([[134.7, 79.4, 7.5], [132.5, 71.8, 7.5], [128.6, 64.9, 7.5], [123, 59.1, 7.5], [116.1, 54.7, 7.5], [108.3, 51.9, 7.5], [100, 51, 7.5], [91.7, 51.9, 7.5], [83.9, 54.7, 7.5], [77, 59.1, 7.5], [71.4, 64.9, 7.5], [67.5, 71.8, 7.5], [65.3, 79.4, 7.5]]),
      { d: 'M64 84 C61 44 139 44 136 84 C131 71 119 64.5 100 64.5 C81 64.5 69 71 64 84 Z', f: 'cabelo' },
    ],
    topo: 44,
  },
  'black-power': {
    atras: circulos([[62, 88, 15], [57, 70, 16], [64, 52, 17], [80, 40, 18], [100, 35, 19], [120, 40, 18], [136, 52, 17], [143, 70, 16], [138, 88, 15]]),
    frente: circulos([[76, 60, 12], [91, 54, 13], [108, 54, 13], [124, 60, 12]]),
    topo: 22,
  },
  // crespo preso no alto (coque afro)
  'crespo-preso': {
    atras: circulos([[100, 35, 19], [84, 41, 12], [116, 41, 12], [89, 26, 11], [111, 26, 11], [100, 22, 10]]),
    frente: [
      { d: PUXADO, f: 'cabelo' },
      { d: 'M78 49 C90 43 110 43 122 49', s: T, sw: 2.5, o: 0.22 },
      { d: 'M78 47 C90 41 110 41 122 47', s: B, sw: 1.6, o: 0.16 },
    ],
    topo: 45,
    volumeNoTopo: true,
  },
  cacheado: {
    atras: circulos([[58, 72, 15], [54, 90, 14], [56, 108, 13], [62, 124, 12], [142, 72, 15], [146, 90, 14], [144, 108, 13], [138, 124, 12], [66, 55, 16], [82, 45, 17], [100, 41, 18], [118, 45, 17], [134, 55, 16]]),
    frente: circulos([[74, 63, 12], [88, 57, 12], [102, 56, 12], [116, 58, 12], [128, 64, 11]]),
    topo: 26,
  },
  // tranças soltas: três de cada lado
  trancas: {
    atras: TRANCAS.flatMap((d): Forma[] => [{ d, s: 'cabelo', sw: 10 }, marcas(d, 10)]),
    frente: [
      { d: 'M63 86 C60 54 82 42 100 42 C118 42 140 54 137 86 C134 71 122 61 100 59 C78 61 66 71 63 86 Z', f: 'cabelo' },
      { d: 'M100 43 V58 M84 46 L88 60 M116 46 L112 60 M70 56 L77 66 M130 56 L123 66', s: 'marca', sw: 1.8, o: 0.2 },
    ],
    topo: 43,
  },
  dreads: {
    // cada fio leva um filete por baixo (cor 'marca'), que o separa do vizinho
    atras: DREADS.flatMap((d): Forma[] => [{ d, s: 'marca', sw: 14.5, o: 0.24 }, { d, s: 'cabelo', sw: 10.5 }]),
    frente: [
      { d: 'M63 86 C60 52 82 40 100 40 C118 40 140 52 137 86 C134 72 124 64 112 62 C104 66 96 66 88 62 C76 64 66 72 63 86 Z', f: 'cabelo' },
      // divisões dos fios, saindo do alto da cabeça
      { d: 'M100 42 V62 M88 44 C84 50 80 56 76 66 M112 44 C116 50 120 56 124 66 M76 50 C72 56 68 64 66 74 M124 50 C128 56 132 64 134 74', s: 'marca', sw: 1.8, o: 0.2 },
    ],
    topo: 41,
  },
  ondulado: {
    atras: [{ d: 'M56 90 C50 50 80 36 100 36 C120 36 150 50 144 90 C152 108 150 130 142 150 C136 158 124 152 124 142 L76 142 C76 152 64 158 58 150 C50 130 48 108 56 90 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 86 C60 56 84 44 104 46 C126 48 140 62 137 88 C132 73 122 66 110 64 C98 72 78 72 68 68 C65 73 64 80 63 86 Z', f: 'cabelo' }],
    topo: 38,
  },
  'liso-medio': {
    atras: [{ d: 'M58 86 C56 50 80 38 100 38 C120 38 144 50 142 86 V128 C142 137 130 139 126 132 V100 H74 V132 C70 139 58 137 58 128 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 88 C62 56 82 46 100 46 C118 46 138 56 137 88 C137 77 132 73 124 73 H76 C68 73 63 77 63 88 Z', f: 'cabelo' }],
    topo: 39,
  },
  'liso-longo': {
    atras: [{ d: 'M58 88 C54 50 80 36 100 36 C120 36 146 50 142 88 V170 C142 178 126 178 124 170 V100 H76 V170 C74 178 58 178 58 170 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 90 C60 58 80 46 100 48 C120 46 140 58 137 90 C134 75 122 63 100 57 C78 63 66 75 63 90 Z', f: 'cabelo' }],
    topo: 37,
  },
  'longo-franja': {
    atras: [{ d: 'M58 88 C54 50 80 36 100 36 C120 36 146 50 142 88 V170 C142 178 126 178 124 170 V100 H76 V170 C74 178 58 178 58 170 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 90 C60 56 80 45 100 45 C120 45 140 56 137 90 C137 82 134 78 128 77 C112 80 88 80 72 77 C66 78 63 82 63 90 Z', f: 'cabelo' }],
    topo: 37,
  },
  rabo: {
    atras: [{ d: 'M130 58 C156 56 166 84 160 112 C156 128 146 136 140 128 C146 112 146 90 130 78 Z', f: 'cabelo' }],
    frente: [{ d: PUXADO, f: 'cabelo' }],
    topo: 45,
  },
  coque: { atras: [{ c: [100, 38, 19], f: 'cabelo' }], frente: [{ d: PUXADO, f: 'cabelo' }], topo: 45, volumeNoTopo: true },
};

// ------------------------------------------------------------------------------------------------ coberturas de cabeça
export interface Cobertura {
  atras: Forma[];
  frente: Forma[];
  /** pano que cai sobre os ombros (hijab): os acessórios de corpo vão por cima dele */
  ombros: Forma[];
  /** não esconde o cabelo: é desenhada sobre ele, na altura do topo do cabelo (quipá) */
  mantemCabelo?: boolean;
  /** o capelo não assenta sobre esta cobertura (o jogador tem o canudo, liberado pela mesma conquista) */
  semCapelo?: boolean;
  /** a touca cirúrgica não cabe por cima: o próprio pano veste a cor da touca e ganha esta faixa na testa */
  faixaTouca?: Forma[];
}

/** Coberturas de uso pessoal ou religioso. A cor é própria ('cabeca'), escolhida pelo jogador. */
export const COBERTURAS: Record<string, Cobertura> = {
  hijab: {
    atras: [{ d: 'M52 96 C46 42 154 42 148 96 C150 122 146 140 150 156 L50 156 C54 140 50 122 52 96 Z', f: 'cabeca' }],
    frente: [
      { d: 'M54 92 C49 43 151 43 146 92 C148 122 132 146 100 148 C68 146 52 122 54 92 Z M67 90 C67 60 133 60 133 90 V98 C133 121 117 130 100 130 C83 130 67 121 67 98 Z', f: 'cabeca', par: true },
      { d: 'M67 92 C67 60 133 60 133 92', s: T, sw: 3, o: 0.13 },
      { d: 'M70 128 C84 142 116 142 130 128', s: T, sw: 3, o: 0.12 }, // dobra sob o queixo
    ],
    // o pano dos ombros sobe até debaixo do queixo: nenhuma fresta de pescoço
    ombros: [{ d: 'M60 128 C78 142 122 142 140 128 C151 146 154 164 150 176 C124 186 76 186 50 176 C46 164 49 146 60 128 Z', f: 'cabeca' }],
  },
  // Turbante de amarrar (afro-brasileiro): faixa na testa, volume alto, panos cruzados e nó no alto; orelhas de fora.
  turbante: {
    atras: [],
    frente: [
      { d: 'M60 89 C50 57 62 23 100 21 C138 23 150 57 140 89 C130 76 116 70 100 70 C84 70 70 76 60 89 Z', f: 'cabeca' },
      { d: 'M57 75 C72 55 104 45 138 51 C142 59 143 67 142 75 C120 57 86 59 62 85 Z', f: B, o: 0.14 },
      { d: 'M143 73 C128 55 100 43 66 45', s: T, sw: 3, o: 0.18 },
      { d: 'M58 73 C74 55 100 49 124 51', s: T, sw: 3, o: 0.18 },
      { d: 'M82 31 C74 19 90 9 100 19 C110 9 126 19 118 31 C114 39 86 39 82 31 Z', f: 'cabeca' },
      { d: 'M82 31 C86 39 114 39 118 31', s: T, sw: 3, o: 0.2 },
      { e: [100, 27, 7, 6], f: B, o: 0.18 },
    ],
    ombros: [],
    semCapelo: true,
    faixaTouca: [{ d: 'M60 89 C70 76 84 70 100 70 C116 70 130 76 140 89', s: B, sw: 5, o: 0.4 }],
  },
  // Dastar (turbante sikh): voltas em camadas que se encontram em V invertido na testa; cobre o alto das orelhas.
  dastar: {
    atras: [],
    frente: [
      { d: 'M53 96 C42 54 64 20 100 20 C136 20 158 54 147 96 L138 92 C130 80 114 70 100 65 C86 70 70 80 62 92 Z', f: 'cabeca' },
      { d: 'M55 84 L100 55 L145 84', s: T, sw: 3, o: 0.17 },
      { d: 'M53 68 L100 43 L147 68', s: T, sw: 3, o: 0.15 },
      { d: 'M58 50 L100 31 L142 50', s: T, sw: 3, o: 0.12 },
      { d: 'M62 92 C70 80 86 70 100 65 C114 70 130 80 138 92', s: T, sw: 3, o: 0.2 },
      // ponta do tecido de baixo, no centro da testa
      { d: 'M92 72 L100 65 L108 72 C103 74 97 74 92 72 Z', f: B, o: 0.38 },
    ],
    ombros: [],
    semCapelo: true,
    faixaTouca: [{ d: 'M62 92 C70 80 86 70 100 65 C114 70 130 80 138 92', s: B, sw: 5, o: 0.4 }],
  },
  // Quipá: calota no alto da cabeça, sobre o cabelo.
  quipa: {
    atras: [],
    frente: [
      { d: 'M77 64 C79 43 121 43 123 64 C116 60.5 108 59.5 100 59.5 C92 59.5 84 60.5 77 64 Z', f: 'cabeca' },
      { d: 'M77 64 C84 60.5 92 59.5 100 59.5 C108 59.5 116 60.5 123 64', s: T, sw: 2.4, o: 0.2 },
      { d: 'M88 50 C94 47 106 47 112 50', s: B, sw: 2, o: 0.22 },
    ],
    ombros: [],
    mantemCabelo: true,
  },
};

// ------------------------------------------------------------------------------------------------ barba e bigode (cor do cabelo)
export const BARBAS: Record<string, Forma[]> = {
  bigode: [{ d: 'M85 105 C89 98 96 98 100 102 C104 98 111 98 115 105 C108 107 104 106 100 105 C96 106 92 107 85 105 Z', f: 'cabelo' }],
  cavanhaque: [
    { d: 'M85 105 C89 98 96 98 100 102 C104 98 111 98 115 105 C108 107 104 106 100 105 C96 106 92 107 85 105 Z', f: 'cabelo' },
    { d: 'M90 118 C94 114 106 114 110 118 C110 127 104 131 100 131 C96 131 90 127 90 118 Z', f: 'cabelo' },
  ],
  'barba-curta': [
    { d: 'M63 96 C65 120 80 131 100 131 C120 131 135 120 137 96 C132 107 122 113 114 110 C108 100 92 100 86 110 C78 113 68 107 63 96 Z M89 110 C93 104 107 104 111 110 C109 118 91 118 89 110 Z', f: 'cabelo', o: 0.6, par: true },
  ],
  'barba-cheia': [
    { d: 'M61 92 C61 128 78 142 100 142 C122 142 139 128 139 92 C134 104 124 108 114 104 C106 97 94 97 86 104 C76 108 66 104 61 92 Z M88 110 C92 104 108 104 112 110 C110 119 90 119 88 110 Z', f: 'cabelo', par: true },
  ],
};

// ------------------------------------------------------------------------------------------------ óculos (de uso pessoal)
const lente = { f: B, o: 0.3 };
export const OCULOS: Record<string, Forma[]> = {
  redondo: [
    { c: [85, 92, 12], ...lente },
    { c: [115, 92, 12], ...lente },
    { c: [85, 92, 12], s: T, sw: 3 },
    { c: [115, 92, 12], s: T, sw: 3 },
    { d: 'M97 91 Q100 88 103 91', s: T, sw: 3 },
    // brilho no aro: mantém os óculos visíveis na pele escura
    { d: 'M75.6 87 A10.6 10.6 0 0 1 86 81.4 M105.6 87 A10.6 10.6 0 0 1 116 81.4', s: B, sw: 1.6, o: 0.6 },
  ],
  retangular: [
    { r: [71, 82, 26, 20, 6], ...lente },
    { r: [103, 82, 26, 20, 6], ...lente },
    { r: [71, 82, 26, 20, 6], s: T, sw: 3 },
    { r: [103, 82, 26, 20, 6], s: T, sw: 3 },
    { d: 'M97 91 H103', s: T, sw: 3 },
    { d: 'M76 84.6 H88 M108 84.6 H120', s: B, sw: 1.6, o: 0.6 },
  ],
  'aro-fino': [
    { c: [85, 92, 12.5], f: B, o: 0.22 },
    { c: [115, 92, 12.5], f: B, o: 0.22 },
    { c: [85, 92, 12.5], s: T, sw: 2.6, o: 0.5 },
    { c: [115, 92, 12.5], s: T, sw: 2.6, o: 0.5 },
    { c: [85, 92, 12.5], s: OURO, sw: 1.6 },
    { c: [115, 92, 12.5], s: OURO, sw: 1.6 },
    { d: 'M97.4 90 Q100 87.4 102.6 90', s: OURO, sw: 1.6 },
  ],
  escuros: [
    { r: [70, 82, 27, 20, 7], f: T, o: 0.92 },
    { r: [103, 82, 27, 20, 7], f: T, o: 0.92 },
    { d: 'M97 89 H103', s: T, sw: 3.4 },
    { d: 'M64 88 L70 89 M130 89 L136 88', s: T, sw: 3 },
    { d: 'M75 86 L81 86 M108 86 L114 86', s: B, sw: 2.4, o: 0.75 },
    { r: [70, 82, 27, 20, 7], s: B, sw: 1.4, o: 0.4 },
    { r: [103, 82, 27, 20, 7], s: B, sw: 1.4, o: 0.4 },
  ],
};

// ------------------------------------------------------------------------------------------------ apoio (sempre livre)
const ESPELHO = 'matrix(-1 0 0 1 200 0)';
const espelhar = (fs: Forma[]): Forma[] => fs.map((f) => ({ ...f, tr: ESPELHO }));
const CORPO_APARELHO = 'M139.5 85 C144 81 149.5 84.5 149.5 91 C149.5 97 147.6 101.4 145.2 101 C143.6 100.6 144.6 96 144.4 92 C144.2 88.6 142.6 86.8 139.5 87.6 Z';
// Aparelho auditivo retroauricular, em verde-água de propósito: aparelho bege some na pele.
const APARELHO: Forma[] = [
  { d: CORPO_APARELHO, f: VERDE },
  { d: 'M140.4 86.4 C137.4 87.6 136.6 91 138.4 94', s: METAL, sw: 1.8 },
  { c: [138.8, 94.6, 2.2], f: METAL },
];
// Implante coclear: processador atrás da orelha, fio e antena redonda na lateral da cabeça.
const IMPLANTE: Forma[] = [
  { d: CORPO_APARELHO, f: ARDOSIA },
  { d: 'M146 84 C147 80 146 77 143.6 75', s: ARDOSIA, sw: 1.8 },
  { c: [141, 71.5, 6.5], f: ARDOSIA },
  { c: [141, 71.5, 2.6], f: VERDE },
];
/** orelha: desenhado logo depois das orelhas. corpo: desenhado sobre a roupa. */
export const APOIOS: Record<string, { orelha: Forma[]; corpo: Forma[] }> = {
  'aparelho-auditivo': { orelha: APARELHO, corpo: [] },
  'aparelho-auditivo-2': { orelha: [...APARELHO, ...espelhar(APARELHO)], corpo: [] },
  'implante-coclear': { orelha: IMPLANTE, corpo: [] },
  'implante-coclear-2': { orelha: [...IMPLANTE, ...espelhar(IMPLANTE)], corpo: [] },
  // Cordão de girassol (deficiências ocultas): fita verde com girassóis e cartão.
  girassol: {
    orelha: [],
    corpo: [
      { d: 'M84 149 L100 180 L116 149', s: '#1f9d55', sw: 5.5 },
      ...([[88.5, 158], [95, 170.5], [105, 170.5], [111.5, 158]] as [number, number][]).flatMap(([x, y]): Forma[] => [{ c: [x, y, 2.9], f: '#f2c94c' }, { c: [x, y, 1.1], f: '#6b452d' }]),
      { r: [91, 178, 18, 14, 3], f: B },
      { c: [100, 185, 4.2], f: '#f2c94c' },
      { c: [100, 185, 1.7], f: '#6b452d' },
    ],
  },
};

// ------------------------------------------------------------------------------------------------ roupas
const decoteRedondo: Forma[] = [
  { d: 'M82 147 C86 160 114 160 118 147 Z', f: 'pele' },
  { d: 'M82 147 C86 160 114 160 118 147', s: T, sw: 5, o: 0.2 },
];
export const ROUPAS: Record<string, Forma[]> = {
  camiseta: [{ d: TRONCO, f: 'roupa' }, ...decoteRedondo],
  moletom: [
    { d: TRONCO, f: 'roupa' },
    { d: 'M66 152 C74 136 126 136 134 152 C124 166 76 166 66 152 Z', f: 'roupa' },
    { d: 'M66 152 C74 136 126 136 134 152 C124 166 76 166 66 152 Z', f: T, o: 0.16 },
    { d: 'M82 149 C86 160 114 160 118 149 Z', f: 'pele' },
    { d: 'M92 162 V184', s: B, sw: 3, tag: 'cordao' },
    { d: 'M108 162 V184', s: B, sw: 3, tag: 'cordao' },
    { d: 'M136 172 L146 176 V184 C146 190 141 193 136 195 C131 193 126 190 126 184 V176 Z', f: B, o: 0.85 },
  ],
  jaleco: [
    { d: TRONCO, f: '#f4f7fb' },
    { d: 'M84 147 L100 174 L116 147 Z', f: 'roupa' },
    { d: 'M78 147 L100 178 L90 190 L68 158 Z', f: '#d3dcea' },
    { d: 'M122 147 L100 178 L110 190 L132 158 Z', f: '#d3dcea' },
  ],
  pijama: [
    { d: TRONCO, f: 'roupa' },
    { d: 'M82 147 L100 172 L118 147 Z', f: 'pele' },
    { d: 'M82 147 L100 172 L118 147', s: T, sw: 5, o: 0.22 },
    { r: [116, 176, 24, 18, 3], f: T, o: 0.16 },
  ],
  // capote: fecha atrás (sem costura na frente); gola alta e costuras de manga raglã
  capote: [
    { d: TRONCO, f: '#8db3d6' },
    { d: 'M78 147 C84 158 116 158 122 147 L122 147 C118 150 82 150 78 147 Z', f: 'pele' },
    { d: 'M78 148 C84 159 116 159 122 148', s: B, sw: 6, o: 0.6 },
    { d: 'M79 152 C68 160 56 172 48 188 M121 152 C132 160 144 172 152 188', s: T, sw: 3, o: 0.12 },
  ],
  'jaleco-titular': [
    { d: TRONCO, f: '#f4f7fb' },
    { d: 'M84 147 L100 174 L116 147 Z', f: ARDOSIA },
    { d: 'M78 147 L100 178 L90 190 L68 158 Z', f: '#d3dcea' },
    { d: 'M122 147 L100 178 L110 190 L132 158 Z', f: '#d3dcea' },
    { d: 'M78 147 L100 178 L122 147', s: OURO, sw: 3 },
    { d: 'M138 170 L148 174 V182 C148 188 143 191 138 193 C133 191 128 188 128 182 V174 Z', f: OURO },
  ],
};

// ------------------------------------------------------------------------------------------------ acessórios (itens de jogo, no corpo)
/** Desenhados sobre a roupa e o pescoço (e sobre o pano do hijab), atrás do rosto. */
export const ACESSORIOS: Record<string, Forma[]> = {
  cracha: [
    { d: 'M84 149 L100 178 L116 149', s: VERDE, sw: 4 },
    { r: [89, 174, 22, 18, 4], f: B },
    { c: [96, 181, 3], f: ARDOSIA },
    { d: 'M102 180 H107 M94 188 H106', s: ARDOSIA, sw: 2, o: 0.6 },
  ],
  estetoscopio: [
    { d: 'M80 150 C76 178 90 194 100 194 C110 194 124 178 120 150', s: ARDOSIA, sw: 5 },
    { d: 'M120 164 C132 168 136 178 136 186', s: ARDOSIA, sw: 5 },
    // hastes com olivas
    { d: 'M80 152 C72 158 68 166 68 176 M80 152 C78 160 77 168 78 178', s: METAL, sw: 2.6 },
    { c: [68, 178, 3], f: ARDOSIA },
    { c: [78, 180, 3], f: ARDOSIA },
    { c: [136, 190, 8], f: METAL },
    { c: [136, 190, 3.5], f: '#14b8a6' },
  ],
  fones: [
    { d: 'M72 150 C70 176 130 176 128 150', s: ARDOSIA, sw: 7 },
    { r: [62, 140, 16, 26, 7], f: ARDOSIA },
    { r: [122, 140, 16, 26, 7], f: ARDOSIA },
    { r: [66, 146, 8, 14, 4], f: VERDE },
    { r: [126, 146, 8, 14, 4], f: VERDE },
  ],
  // lanterna clínica: corpo escuro (lê sobre o jaleco branco), ponta acesa com halo e raios
  lanterna: [
    { r: [116, 176, 24, 18, 3], f: T, o: 0.16 },
    { c: [126, 152, 9], f: OURO, o: 0.35 },
    { d: 'M126 139 V143 M115.4 144.4 L118.2 147.2 M136.6 144.4 L133.8 147.2', s: OURO, sw: 2.2 },
    { r: [122.5, 156, 7, 28, 3.5], f: ARDOSIA },
    { r: [122.5, 150, 7, 9, 3], f: OURO },
    { d: 'M131.5 163 V176', s: METAL, sw: 2.2 },
  ],
  // martelo de reflexos em "T": a silhueta lê como martelo sem depender de conhecer o instrumento
  martelo: [
    { d: 'M133 198 L143 152', s: ARDOSIA, sw: 5.5 },
    { d: 'M128 147 L157 153', s: BORRACHA, sw: 11 },
    { c: [158, 153.2, 7.8], f: BORRACHA },
    { c: [143.6, 150.2, 4.4], f: METAL },
  ],
  lupa: [
    { d: 'M56 168 L45 181', s: ARDOSIA, sw: 7 },
    { c: [66, 156, 14], f: B, o: 0.28 },
    { c: [66, 156, 14], s: ARDOSIA, sw: 7 },
    { c: [66, 156, 14], s: METAL, sw: 3.6 },
    { d: 'M58.6 150.6 Q62 145.4 69.6 147', s: B, sw: 2.5, o: 0.8 },
  ],
  // canudo (diploma enrolado): par do capelo, para quem usa turbante ou dastar
  canudo: [
    { d: 'M117 180 L146 155', s: T, sw: 17, o: 0.2 },
    { d: 'M117 180 L146 155', s: '#f4f1ea', sw: 13 },
    { d: 'M128.2 163.7 L134.8 171.3', s: '#e5534b', sw: 5 },
    { c: [146, 155, 6.5], f: '#d9d3c4' },
    { c: [146, 155, 2.6], f: '#f4f1ea' },
  ],
};

// ------------------------------------------------------------------------------------------------ paramentos (itens de jogo, na cabeça ou no rosto)
/**
 * Ficam em vaga própria, por cima do que a pessoa usa: a touca vai sobre o hijab e os óculos de proteção sobre os
 * óculos de grau. atras: atrás da cabeça. sobOculos: no rosto, por baixo dos óculos. sobre: por último.
 */
export const PARAMENTOS: Record<string, { atras: Forma[]; sobOculos: Forma[]; sobre: Forma[] }> = {
  // touca cirúrgica: topo mais reto, faixa na testa e laço atrás; a cor segue a da roupa
  touca: {
    atras: [{ d: 'M134 70 C146 66 152 72 150 78 C146 76 142 76 138 78 Z M136 74 C148 80 150 90 146 94 C142 88 140 84 136 82 Z', f: 'roupa' }],
    sobOculos: [],
    sobre: [
      { d: 'M60 85 C56 60 62 40 74 36 C90 32 110 32 126 36 C138 40 144 60 140 85 C128 76 114 72 100 72 C86 72 72 76 60 85 Z', f: 'roupa' },
      { d: 'M60 85 C72 76 86 72 100 72 C114 72 128 76 140 85 C140.6 81 140.8 77 140.6 73 C128 66 114 63 100 63 C86 63 72 66 59.4 73 C59.2 77 59.4 81 60 85 Z', f: T, o: 0.16 },
      { d: 'M74 44 C88 39 112 39 126 44', s: B, sw: 3, o: 0.25 },
    ],
  },
  // máscara: abaixo dos olhos, com a tira do clipe nasal e alças azuladas (liam mal na pele clara)
  mascara: {
    atras: [],
    sobOculos: [
      { d: 'M69 103 Q62 100 60 94 M131 103 Q138 100 140 94', s: '#8fc7d8', sw: 2.5 },
      { d: 'M68 102 C84 96.5 116 96.5 132 102 V114 C124 127 108 132 100 132 C92 132 76 127 68 114 Z', f: '#bfe3ee' },
      { d: 'M68 102 C84 96.5 116 96.5 132 102', s: '#7fb9cc', sw: 3 },
      { d: 'M68 114 C76 127 92 132 100 132 C108 132 124 127 132 114', s: '#7fb9cc', sw: 2, o: 0.7 },
      { d: 'M74 109 C88 104.5 112 104.5 126 109 M76 117 C90 112.5 110 112.5 124 117', s: B, sw: 2.5, o: 0.7 },
    ],
    sobre: [],
  },
  protecao: {
    atras: [],
    sobOculos: [],
    sobre: [
      { d: 'M62 90 H70 M130 90 H138', s: ARDOSIA, sw: 6 },
      { r: [67, 78, 66, 28, 13], f: '#7dd3fc', o: 0.4 },
      { r: [67, 78, 66, 28, 13], s: B, sw: 6, o: 0.4 },
      { r: [67, 78, 66, 28, 13], s: ARDOSIA, sw: 3.5 },
      { d: 'M76 84 L84 84', s: B, sw: 3, o: 0.7 },
    ],
  },
  capelo: {
    atras: [],
    sobOculos: [],
    sobre: [
      { d: 'M74 52 V66 C88 74 112 74 126 66 V52 Z', f: '#1a2540' },
      { d: 'M56 46 L100 28 L144 46 L100 64 Z', f: ARDOSIA },
      { d: 'M100 46 L134 52 V70', s: OURO, sw: 3 },
      { c: [134, 73, 4.5], f: OURO },
    ],
  },
};

// ------------------------------------------------------------------------------------------------ fundos
const chao: Forma = { c: [100, 210, 120], f: B, o: 0.14 };
const liso = (cor: string): Forma[] => [{ c: [100, 100, 100], f: cor }, chao];
/** Os fundos escuros levam o próprio aro: sem ele, o disco some na tela escura e sobra um busto solto. */
const ARO_BASE: Forma = { c: [100, 100, 97.5], s: '#6b7ba4', sw: 5 };
export const FUNDOS: Record<string, Forma[]> = {
  'verde-agua': liso(VERDE),
  ouro: liso(OURO),
  azul: liso('#4f8ef7'),
  coral: liso('#f0705a'),
  violeta: liso('#8b7cf0'),
  verde: liso('#34b98a'),
  rosa: liso('#ee7fb0'),
  ceu: liso('#7dd3fc'),
  ardosia: [...liso('#33456e'), ARO_BASE],
  noite: [...liso('#1a2540'), ARO_BASE],
  faixa: [{ c: [100, 100, 100], f: '#1a2540' }, { d: 'M-20 130 L220 40 V92 L-20 182 Z', f: VERDE }, { d: 'M-20 190 L220 100', s: OURO, sw: 4 }, ARO_BASE],
  folhetos: [{ c: [100, 100, 100], f: '#4f8ef7' }, { d: 'M-10 78 L210 48 V124 L-10 154 Z', f: '#e5534b' }, { d: 'M-10 154 L210 124 V220 H-10 Z', f: '#f2c94c' }],
  tempo: [
    { c: [100, 100, 100], f: '#131c30' },
    { c: [100, 100, 84], s: VERDE, sw: 2, o: 0.5 },
    { c: [100, 100, 62], s: VERDE, sw: 2, o: 0.35 },
    { d: 'M100 8 V22 M192 100 H178 M8 100 H22 M165 35 L155 45 M35 35 L45 45', s: OURO, sw: 4 },
    ARO_BASE,
  ],
  liga: [
    { c: [100, 100, 100], f: '#0f3b46' },
    { d: 'M100 14 L170 42 V96 C170 140 140 166 100 180 C60 166 30 140 30 96 V42 Z', s: VERDE, sw: 6, o: 0.55 },
    { d: 'M100 14 L170 42 V96 C170 140 140 166 100 180 C60 166 30 140 30 96 V42 Z', f: VERDE, o: 0.12 },
    ARO_BASE,
  ],
};

// ------------------------------------------------------------------------------------------------ molduras (fora do recorte)
// A escada usa só o que sobrevive a 32 px: cor do anel, largura (6 ou 12 un.: 1 ou 2 px) e selos grandes.
// Dois cantos fixos: nível no canto superior esquerdo, conquista no superior direito. O alto fica livre para
// cabelo e capelo; o rodapé, para crachá, estetoscópio e escudo do moletom.
// Toda moldura leva um fio escuro por dentro, para se destacar de qualquer fundo.
const anel = (cor: string, sw: number): Forma => ({ c: [100, 100, 100 - sw / 2], s: cor, sw });
const fio = (sw: number): Forma => ({ c: [100, 100, 100 - sw - 1.5], s: T, sw: 3 });
/** Selo redondo sobre o anel. grau 0 = embaixo; 135 = canto superior esquerdo. */
const gema = (grau: number, r: number, cor = B, raio = 94): Forma[] => {
  const a = ((90 + grau) * Math.PI) / 180;
  const x = +(100 + Math.cos(a) * raio).toFixed(1);
  const y = +(100 + Math.sin(a) * raio).toFixed(1);
  return [{ c: [x, y, r + 2.5], f: T }, { c: [x, y, r], f: cor }];
};
const estrela = (cx: number, cy: number, r: number): string => {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return p.join(' ') + ' Z';
};
const chamaCanto = (cor: string, miolo: string): Forma[] => [
  { c: [166, 34, 19], f: T },
  { d: 'M166 14 C178 24 182 32 178 42 C176 48 170 50 166 50 C160 50 154 46 154 38 C154 32 158 30 159 24 C162 26 164 28 165 30 C166 24 166 20 166 14 Z', f: cor },
  { d: 'M166 30 C171 35 172 40 170 44 C169 47 167 48 166 48 C163 48 161 46 161 42 C161 38 164 36 166 30 Z', f: miolo },
];
export const MOLDURAS: Record<string, Forma[]> = {
  monitor: [fio(6), anel(VERDE, 6)],
  ligante: [fio(12), anel(VERDE, 12)],
  diretor: [fio(6), anel(OURO, 6)],
  interno: [fio(12), anel(OURO, 12)],
  residente: [fio(12), anel(OURO, 12), ...gema(135, 9)],
  preceptor: [fio(12), anel(OURO, 12), ...gema(107, 8), ...gema(135, 9), ...gema(163, 8)],
  titular: [fio(12), anel(OURO, 12), { c: [100, 100, 99], s: B, sw: 2 }, { c: [34, 34, 19], f: T }, { c: [34, 34, 16], f: OURO }, { d: estrela(34, 34, 11), f: T }],
  chama: [fio(7), anel('#fb923c', 7), ...chamaCanto('#fb923c', '#fde047')],
  'chama-dourada': [fio(8), anel(OURO, 8), ...chamaCanto(OURO, B)],
  // selo claro com estrela escura: a 32 px não se confunde com a chama (selo escuro) da moldura vizinha
  'dez-mil': [fio(8), anel(OURO, 8), { c: [166, 34, 19], f: T }, { c: [166, 34, 16], f: OURO }, { d: estrela(166, 34, 11), f: T }],
};
