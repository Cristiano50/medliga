// Peças do avatar (direção "Suave": formas arredondadas e chapadas, sem contorno), numa grade de 200×200.
// Referências de anatomia: cabeça de x 63–137 e y 60–131; olhos em y 92; boca em y 109; pescoço de x 86–114;
// ombros a partir de y 147. Tudo o que fica dentro da moldura é recortado por um círculo de raio 100.
import type { Forma } from './tipos.ts';

const T = '#0b1220'; // tinta (olhos, boca, sombras)
const B = '#ffffff';
const OURO = '#f5b942';
const VERDE = '#2dd4bf';
const METAL = '#c3ccda';
const ARDOSIA = '#22304f';

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
  { c: [78, 104, 7], f: '#f0705a', o: 0.26 },
  { c: [122, 104, 7], f: '#f0705a', o: 0.26 },
];

// Os olhos levam um ponto de brilho e a boca leva um arco claro por baixo (lábio): o rosto continua legível
// nos tons de pele mais escuros, sem regra especial por tom.
const OLHOS: Forma[] = [
  { e: [85, 92, 4, 5], f: T },
  { e: [115, 92, 4, 5], f: T },
  { c: [86.4, 90.2, 1.3], f: B, o: 0.9 },
  { c: [116.4, 90.2, 1.3], f: B, o: 0.9 },
];
const labio = (d: string): Forma => ({ d, s: B, sw: 2.4, o: 0.24 });
/** Expressões: olhos (desenhados antes da barba) e boca (desenhada depois). */
export const ROSTOS: Record<string, { olhos: Forma[]; boca: Forma[] }> = {
  sorriso: { olhos: OLHOS, boca: [labio('M91 112.6 Q100 121 109 112.6'), { d: 'M90 109 Q100 118 110 109', s: T, sw: 3.2 }] },
  serio: { olhos: OLHOS, boca: [labio('M93 114.4 H107'), { d: 'M92 111 H108', s: T, sw: 3.2 }] },
  confiante: {
    olhos: [...OLHOS, { d: 'M77 82 L92 80', s: T, sw: 3 }, { d: 'M108 80 L123 82', s: T, sw: 3 }],
    boca: [labio('M92 113.4 Q103 120.4 110 111'), { d: 'M91 110 Q103 117 111 107', s: T, sw: 3.2 }],
  },
  alegre: {
    olhos: [
      { d: 'M80 94 Q85 87 90 94', s: T, sw: 3.2 },
      { d: 'M110 94 Q115 87 120 94', s: T, sw: 3.2 },
      { d: 'M80.6 96.4 Q85 90.4 89.4 96.4', s: B, sw: 1.6, o: 0.2 },
      { d: 'M110.6 96.4 Q115 90.4 119.4 96.4', s: B, sw: 1.6, o: 0.2 },
    ],
    boca: [{ d: 'M88 106 Q100 124 112 106 Z', f: T }, { d: 'M91 107.5 H109 Q107 111 100 111 Q93 111 91 107.5 Z', f: B }, { d: 'M94 115 Q100 119.5 106 115 Q100 113 94 115 Z', f: '#f0705a' }],
  },
  sono: {
    olhos: [
      { d: 'M80 93 H90', s: T, sw: 3.2 },
      { d: 'M110 93 H120', s: T, sw: 3.2 },
      { d: 'M80 99 Q85 102.5 90 99', s: T, sw: 2, o: 0.32 },
      { d: 'M110 99 Q115 102.5 120 99', s: T, sw: 2, o: 0.32 },
    ],
    boca: [{ e: [100, 112, 4.2, 4.8], f: T }, { e: [100, 113.4, 2.4, 2.2], f: '#f0705a', o: 0.8 }],
  },
};

// ------------------------------------------------------------------------------------------------ cabelo
const circulos = (lista: [number, number, number][], f = 'cabelo'): Forma[] => lista.map((c) => ({ c, f }));
const PUXADO = 'M63 84 C60 56 82 44 100 44 C118 44 140 56 137 84 C134 70 122 60 100 60 C78 60 66 70 63 84 Z';

/** Cada cabelo tem uma parte atrás da cabeça e uma parte à frente (franja, topo). */
export const CABELOS: Record<string, { atras: Forma[]; frente: Forma[] }> = {
  careca: { atras: [], frente: [] },
  raspado: { atras: [], frente: [{ d: 'M62 88 C58 48 142 48 138 88 C134 70 122 62 100 62 C78 62 66 70 62 88 Z', f: 'cabelo', o: 0.55 }] },
  curto: { atras: [], frente: [{ d: 'M62 86 C56 50 82 38 104 40 C132 42 144 60 138 88 C135 74 127 66 115 63 C100 70 82 70 69 67 C65 73 63 80 62 86 Z', f: 'cabelo' }] },
  topete: { atras: [], frente: [{ d: 'M62 86 C57 58 72 46 90 46 C94 32 120 28 132 40 C144 50 142 70 138 88 C136 76 130 67 120 65 C108 60 92 67 74 65 C68 69 64 77 62 86 Z', f: 'cabelo' }] },
  'curto-crespo': {
    atras: [],
    frente: [
      ...circulos([[66, 77, 10], [69, 65, 11], [78, 56, 11], [89, 51, 11], [100, 49, 11], [111, 51, 11], [122, 56, 11], [131, 65, 11], [134, 77, 10]]),
      { d: 'M64 82 C64 54 136 54 136 82 C130 70 118 64 100 64 C82 64 70 70 64 82 Z', f: 'cabelo' },
    ],
  },
  'black-power': {
    atras: circulos([[62, 88, 15], [57, 70, 16], [64, 52, 17], [80, 40, 18], [100, 35, 19], [120, 40, 18], [136, 52, 17], [143, 70, 16], [138, 88, 15]]),
    frente: circulos([[76, 60, 12], [91, 54, 13], [108, 54, 13], [124, 60, 12]]),
  },
  cacheado: {
    atras: circulos([[58, 72, 15], [54, 90, 14], [56, 108, 13], [62, 124, 12], [142, 72, 15], [146, 90, 14], [144, 108, 13], [138, 124, 12], [66, 55, 16], [82, 45, 17], [100, 41, 18], [118, 45, 17], [134, 55, 16]]),
    frente: circulos([[74, 63, 12], [88, 57, 12], [102, 56, 12], [116, 58, 12], [128, 64, 11]]),
  },
  ondulado: {
    atras: [{ d: 'M56 90 C50 50 80 36 100 36 C120 36 150 50 144 90 C152 108 150 130 142 150 C136 158 124 152 124 142 L76 142 C76 152 64 158 58 150 C50 130 48 108 56 90 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 86 C60 56 84 44 104 46 C126 48 140 62 137 88 C132 73 122 66 110 64 C98 72 78 72 68 68 C65 73 64 80 63 86 Z', f: 'cabelo' }],
  },
  'liso-medio': {
    atras: [{ d: 'M58 86 C56 50 80 38 100 38 C120 38 144 50 142 86 V128 C142 137 130 139 126 132 V100 H74 V132 C70 139 58 137 58 128 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 88 C62 56 82 46 100 46 C118 46 138 56 137 88 C137 77 132 73 124 73 H76 C68 73 63 77 63 88 Z', f: 'cabelo' }],
  },
  'liso-longo': {
    atras: [{ d: 'M58 88 C54 50 80 36 100 36 C120 36 146 50 142 88 V170 C142 178 126 178 124 170 V100 H76 V170 C74 178 58 178 58 170 Z', f: 'cabelo' }],
    frente: [{ d: 'M63 90 C60 58 80 46 100 48 C120 46 140 58 137 90 C134 75 122 63 100 57 C78 63 66 75 63 90 Z', f: 'cabelo' }],
  },
  rabo: {
    atras: [{ d: 'M130 58 C156 56 166 84 160 112 C156 128 146 136 140 128 C146 112 146 90 130 78 Z', f: 'cabelo' }],
    frente: [{ d: PUXADO, f: 'cabelo' }],
  },
  coque: { atras: [{ c: [100, 38, 19], f: 'cabelo' }], frente: [{ d: PUXADO, f: 'cabelo' }] },
  trancas: {
    atras: [
      ...['M61 72 C52 98 54 130 56 162', 'M71 64 C62 98 66 132 67 166', 'M139 72 C148 98 146 130 144 162', 'M129 64 C138 98 134 132 133 166'].flatMap((d): Forma[] => [
        { d, s: 'cabelo', sw: 10 },
        { d, s: T, sw: 10, o: 0.22, dash: '2 8' },
      ]),
    ],
    frente: [
      { d: 'M63 86 C60 54 82 42 100 42 C118 42 140 54 137 86 C134 71 122 61 100 59 C78 61 66 71 63 86 Z', f: 'cabelo' },
      { d: 'M100 43 V58', s: T, sw: 2, o: 0.25 },
      { d: 'M84 46 L88 60', s: T, sw: 2, o: 0.25 },
      { d: 'M116 46 L112 60', s: T, sw: 2, o: 0.25 },
    ],
  },
  'lateral-raspada': {
    atras: [],
    frente: [
      { d: 'M62 90 C59 68 64 57 74 53 L80 68 C70 72 66 80 62 90 Z', f: 'cabelo', o: 0.5 },
      { d: 'M138 90 C141 68 136 57 126 53 L120 68 C130 72 134 80 138 90 Z', f: 'cabelo', o: 0.5 },
      { d: 'M70 64 C72 40 104 32 126 42 C138 48 138 62 130 68 C116 61 96 63 80 71 C75 70 71 68 70 64 Z', f: 'cabelo' },
    ],
  },
  'calvo-lateral': {
    atras: [
      { d: 'M60 100 C54 84 58 68 68 62 L72 100 Z', f: 'cabelo' },
      { d: 'M140 100 C146 84 142 68 132 62 L128 100 Z', f: 'cabelo' },
    ],
    frente: [
      { d: 'M63 96 C61 82 63 72 68 66 C70 72 71 78 70 84 C68 88 65 92 63 96 Z', f: 'cabelo' },
      { d: 'M137 96 C139 82 137 72 132 66 C130 72 129 78 130 84 C132 88 135 92 137 96 Z', f: 'cabelo' },
    ],
  },
};

// ------------------------------------------------------------------------------------------------ coberturas de cabeça
/** Cobrem o cabelo. A cor segue a cor da roupa. */
export const COBERTURAS: Record<string, { atras: Forma[]; frente: Forma[]; ombros: Forma[] }> = {
  hijab: {
    atras: [{ d: 'M52 96 C46 42 154 42 148 96 C150 122 146 140 150 156 L50 156 C54 140 50 122 52 96 Z', f: 'roupa' }],
    frente: [
      { d: 'M54 92 C49 43 151 43 146 92 C148 122 132 146 100 148 C68 146 52 122 54 92 Z M67 90 C67 60 133 60 133 90 V98 C133 121 117 130 100 130 C83 130 67 121 67 98 Z', f: 'roupa', par: true },
      { d: 'M67 92 C67 60 133 60 133 92', s: T, sw: 3, o: 0.13 },
    ],
    ombros: [{ d: 'M62 140 C80 152 120 152 138 140 C150 150 154 164 150 176 C124 186 76 186 50 176 C46 164 50 150 62 140 Z', f: 'roupa' }],
  },
  turbante: {
    atras: [],
    frente: [
      { d: 'M59 84 C52 44 80 28 100 28 C120 28 148 44 141 84 C130 68 114 63 100 63 C86 63 70 68 59 84 Z', f: 'roupa' },
      { d: 'M66 66 C84 50 112 46 136 58', s: T, sw: 3, o: 0.16 },
      { d: 'M62 78 C84 60 114 58 139 72', s: T, sw: 3, o: 0.16 },
      { e: [100, 40, 9, 7], f: B, o: 0.22 },
    ],
    ombros: [],
  },
  touca: {
    atras: [],
    frente: [
      { d: 'M60 84 C55 46 80 32 100 32 C120 32 145 46 140 84 C128 75 114 71 100 71 C86 71 72 75 60 84 Z', f: 'roupa' },
      { d: 'M60 84 C72 75 86 71 100 71 C114 71 128 75 140 84', s: T, sw: 4, o: 0.18 },
      { d: 'M70 52 C84 42 116 42 130 52', s: B, sw: 3, o: 0.25 },
    ],
    ombros: [],
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

// ------------------------------------------------------------------------------------------------ óculos
const lente = { f: B, o: 0.18 };
export const OCULOS: Record<string, Forma[]> = {
  redondo: [
    { c: [85, 92, 12], ...lente },
    { c: [115, 92, 12], ...lente },
    { c: [85, 92, 12], s: T, sw: 3 },
    { c: [115, 92, 12], s: T, sw: 3 },
    { d: 'M97 91 Q100 88 103 91', s: T, sw: 3 },
  ],
  retangular: [
    { r: [71, 82, 26, 20, 6], ...lente },
    { r: [103, 82, 26, 20, 6], ...lente },
    { r: [71, 82, 26, 20, 6], s: T, sw: 3 },
    { r: [103, 82, 26, 20, 6], s: T, sw: 3 },
    { d: 'M97 91 H103', s: T, sw: 3 },
  ],
  protecao: [
    { d: 'M62 90 H70 M130 90 H138', s: ARDOSIA, sw: 6 },
    { r: [67, 78, 66, 28, 13], f: '#7dd3fc', o: 0.4 },
    { r: [67, 78, 66, 28, 13], s: ARDOSIA, sw: 3.5 },
    { d: 'M76 84 L84 84', s: B, sw: 3, o: 0.7 },
  ],
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
    { d: 'M92 162 V184', s: B, sw: 3 },
    { d: 'M108 162 V184', s: B, sw: 3 },
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
  capote: [
    { d: TRONCO, f: '#8db3d6' },
    { d: 'M78 147 C84 158 116 158 122 147 L122 147 C118 150 82 150 78 147 Z', f: 'pele' },
    { d: 'M78 148 C84 159 116 159 122 148', s: B, sw: 6, o: 0.6 },
    { d: 'M60 170 C80 182 120 182 140 170', s: T, sw: 3, o: 0.12 },
    { d: 'M100 158 V200', s: T, sw: 3, o: 0.12 },
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

// ------------------------------------------------------------------------------------------------ acessórios
/** corpo: desenhado sobre a roupa e o pescoço, atrás do rosto. rosto: desenhado por último, sobre o rosto e o cabelo. */
export const ACESSORIOS: Record<string, { corpo: Forma[]; rosto: Forma[] }> = {
  cracha: {
    corpo: [
      { d: 'M84 149 L100 178 L116 149', s: VERDE, sw: 4 },
      { r: [89, 174, 22, 18, 4], f: B },
      { c: [96, 181, 3], f: ARDOSIA },
      { d: 'M102 180 H107 M94 188 H106', s: ARDOSIA, sw: 2, o: 0.6 },
    ],
    rosto: [],
  },
  estetoscopio: {
    corpo: [
      { d: 'M80 150 C76 178 90 194 100 194 C110 194 124 178 120 150', s: ARDOSIA, sw: 5 },
      { d: 'M120 164 C132 168 136 178 136 186', s: ARDOSIA, sw: 5 },
      { c: [136, 190, 8], f: METAL },
      { c: [136, 190, 3.5], f: '#14b8a6' },
    ],
    rosto: [],
  },
  fones: {
    corpo: [
      { d: 'M72 150 C70 176 130 176 128 150', s: ARDOSIA, sw: 7 },
      { r: [62, 140, 16, 26, 7], f: ARDOSIA },
      { r: [122, 140, 16, 26, 7], f: ARDOSIA },
      { r: [66, 146, 8, 14, 4], f: VERDE },
      { r: [126, 146, 8, 14, 4], f: VERDE },
    ],
    rosto: [],
  },
  lanterna: {
    corpo: [
      { r: [116, 176, 24, 18, 3], f: T, o: 0.16 },
      { r: [123, 160, 6, 24, 3], f: METAL },
      { r: [123, 156, 6, 7, 2], f: OURO },
      { d: 'M131 164 V176', s: METAL, sw: 2 },
    ],
    rosto: [],
  },
  martelo: {
    corpo: [
      { d: 'M150 200 L160 150', s: METAL, sw: 5 },
      { d: 'M146 142 L176 150 L158 162 Z', f: '#f0705a' },
      { c: [160, 150, 4], f: METAL },
    ],
    rosto: [],
  },
  lupa: {
    corpo: [
      { d: 'M44 180 L34 196', s: ARDOSIA, sw: 7 },
      { c: [54, 166, 15], f: B, o: 0.25 },
      { c: [54, 166, 15], s: METAL, sw: 5 },
      { d: 'M46 160 Q50 154 58 156', s: B, sw: 2.5, o: 0.8 },
    ],
    rosto: [],
  },
  capelo: {
    corpo: [],
    rosto: [
      { d: 'M74 52 V66 C88 74 112 74 126 66 V52 Z', f: '#1a2540' },
      { d: 'M56 46 L100 28 L144 46 L100 64 Z', f: ARDOSIA },
      { d: 'M100 46 L134 52 V70', s: OURO, sw: 3 },
      { c: [134, 73, 4.5], f: OURO },
    ],
  },
  mascara: {
    corpo: [],
    rosto: [
      { d: 'M68 99 Q62 96 60 92 M132 99 Q138 96 140 92', s: B, sw: 2.5, o: 0.8 },
      { d: 'M68 97 C84 91 116 91 132 97 V112 C124 126 108 131 100 131 C92 131 76 126 68 112 Z', f: '#bfe3ee' },
      { d: 'M74 106 C88 101 112 101 126 106 M76 115 C90 110 110 110 124 115', s: B, sw: 2.5, o: 0.7 },
    ],
  },
};

// ------------------------------------------------------------------------------------------------ fundos
const chao: Forma = { c: [100, 210, 120], f: B, o: 0.14 };
const liso = (cor: string): Forma[] => [{ c: [100, 100, 100], f: cor }, chao];
export const FUNDOS: Record<string, Forma[]> = {
  'verde-agua': liso(VERDE),
  ouro: liso(OURO),
  azul: liso('#4f8ef7'),
  coral: liso('#f0705a'),
  violeta: liso('#8b7cf0'),
  verde: liso('#34b98a'),
  rosa: liso('#ee7fb0'),
  ceu: liso('#7dd3fc'),
  ardosia: liso('#33456e'),
  noite: liso('#1a2540'),
  faixa: [{ c: [100, 100, 100], f: '#1a2540' }, { d: 'M-20 130 L220 40 V92 L-20 182 Z', f: VERDE }, { d: 'M-20 190 L220 100', s: OURO, sw: 4 }],
  folhetos: [{ c: [100, 100, 100], f: '#4f8ef7' }, { d: 'M-10 78 L210 48 V124 L-10 154 Z', f: '#e5534b' }, { d: 'M-10 154 L210 124 V220 H-10 Z', f: '#f2c94c' }],
  tempo: [
    { c: [100, 100, 100], f: '#131c30' },
    { c: [100, 100, 84], s: VERDE, sw: 2, o: 0.5 },
    { c: [100, 100, 62], s: VERDE, sw: 2, o: 0.35 },
    { d: 'M100 8 V22 M192 100 H178 M8 100 H22 M165 35 L155 45 M35 35 L45 45', s: OURO, sw: 4 },
  ],
  liga: [
    { c: [100, 100, 100], f: '#0f3b46' },
    { d: 'M100 14 L170 42 V96 C170 140 140 166 100 180 C60 166 30 140 30 96 V42 Z', s: VERDE, sw: 6, o: 0.55 },
    { d: 'M100 14 L170 42 V96 C170 140 140 166 100 180 C60 166 30 140 30 96 V42 Z', f: VERDE, o: 0.12 },
  ],
};

// ------------------------------------------------------------------------------------------------ molduras (fora do recorte)
// Toda moldura leva um fio escuro por dentro, para se destacar de qualquer fundo (um anel verde-água sobre fundo
// verde-água sumia).
const FIO: Forma = { c: [100, 100, 91.5], s: '#0b1220', sw: 3 };
const anel = (cor: string, sw = 7, r = 96.5): Forma => ({ c: [100, 100, r], s: cor, sw });
const estrela = (cx: number, cy: number, r: number): string => {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return p.join(' ') + ' Z';
};
const chama = (cor: string, miolo: string): Forma[] => [
  { d: 'M100 -2 C112 8 116 16 112 26 C110 32 104 34 100 34 C94 34 88 30 88 22 C88 16 92 14 93 8 C96 10 98 12 99 14 C100 8 100 4 100 -2 Z', f: cor },
  { d: 'M100 14 C105 19 106 24 104 28 C103 31 101 32 100 32 C97 32 95 30 95 26 C95 22 98 20 100 14 Z', f: miolo },
];
export const MOLDURAS: Record<string, Forma[]> = {
  monitor: [FIO, anel(VERDE, 6)],
  ligante: [FIO, anel(VERDE, 7), { c: [100, 100, 96.5], s: B, sw: 1.5, o: 0.75 }],
  diretor: [FIO, anel(OURO, 6)],
  interno: [FIO, anel(OURO, 7), { c: [100, 100, 96.5], s: VERDE, sw: 2.5 }],
  residente: [FIO, anel(OURO, 8), ...[[100, 3.5], [100, 196.5], [3.5, 100], [196.5, 100]].map(([x, y]): Forma => ({ c: [x, y, 5.5], f: B }))],
  preceptor: [
    FIO,
    anel(OURO, 8),
    ...[-56, -40, -24, 24, 40, 56].map((g): Forma => {
      const a = ((90 + g) * Math.PI) / 180;
      return { c: [+(100 + Math.cos(a) * 96.5).toFixed(1), +(100 + Math.sin(a) * 96.5).toFixed(1), 5], f: '#fff3cf' };
    }),
    { c: [100, 196.5, 6.5], f: B },
  ],
  titular: [FIO, anel(OURO, 9), { c: [100, 100, 96.5], s: B, sw: 1.5, o: 0.8 }, { c: [100, 193, 12], f: '#0b1220' }, { d: estrela(100, 193, 9), f: OURO }],
  chama: [FIO, anel('#fb923c', 7), ...chama('#fb923c', '#fde047')],
  'chama-dourada': [FIO, anel(OURO, 8), { c: [100, 100, 96.5], s: '#fb923c', sw: 2.5 }, ...chama(OURO, B)],
  'dez-mil': [
    FIO,
    anel(OURO, 8),
    { c: [100, 190, 15], f: '#0b1220' },
    { d: estrela(100, 190, 11), f: OURO },
    { d: estrela(70, 182, 6.5), f: B },
    { d: estrela(130, 182, 6.5), f: B },
  ],
};
