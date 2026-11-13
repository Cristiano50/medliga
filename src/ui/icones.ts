// Ícones próprios do MedLiga (no lugar dos emojis). Grade de 24×24, traço de 2 com pontas arredondadas, cor do texto
// em volta (currentColor). Mesma linguagem dos avatares: formas simples e arredondadas, com um preenchimento suave.
// Desenhados por código próprio; nenhum vem de biblioteca de terceiros.

/** linha: só traço. suave: preenchimento a 20% (base do desenho). cheio: preenchimento sólido, sem traço. */
export type ParteIcone = string | { d: string; p: 'suave' | 'cheio' };

const n = (v: number) => +v.toFixed(2);
const circulo = (cx: number, cy: number, r: number) => `M${n(cx + r)} ${cy} A${r} ${r} 0 1 1 ${n(cx - r)} ${cy} A${r} ${r} 0 0 1 ${n(cx + r)} ${cy} Z`;
const ANEL = circulo(12, 12, 8.5);
const CORACAO = 'M12 20 C6 16 3.5 12.6 3.5 9 A4.25 4.25 0 0 1 12 7.6 A4.25 4.25 0 0 1 20.5 9 C20.5 12.6 18 16 12 20 Z';
const estrela = (cx: number, cy: number, r: number): string => {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.46 : r;
    p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`);
  }
  return p.join(' ') + ' Z';
};
/** Cápsula inclinada a 45°, centrada em (12, 12). */
const CAPSULA = 'M5.3 12.6 L12.6 5.3 A4.3 4.3 0 0 1 18.7 11.4 L11.4 18.7 A4.3 4.3 0 0 1 5.3 12.6 Z';

export const ICONES = {
  // ---------------------------------------------------------------- navegação
  inicio: [{ d: 'M4 11 L12 4 L20 11 V19 A1 1 0 0 1 19 20 H5 A1 1 0 0 1 4 19 Z', p: 'suave' }, 'M4 11 L12 4 L20 11 V19 A1 1 0 0 1 19 20 H5 A1 1 0 0 1 4 19 Z', 'M10 20 V14.5 H14 V20'],
  estudar: [
    { d: 'M12 6.5 C10 5 7 4.5 4 5 V18 C7 17.5 10 18 12 19.5 C14 18 17 17.5 20 18 V5 C17 4.5 14 5 12 6.5 Z', p: 'suave' },
    'M12 6.5 C10 5 7 4.5 4 5 V18 C7 17.5 10 18 12 19.5 C14 18 17 17.5 20 18 V5 C17 4.5 14 5 12 6.5 Z',
    'M12 6.5 V19.5',
  ],
  ranking: [
    { d: 'M7.5 4 H16.5 V9 A4.5 4.5 0 0 1 7.5 9 Z', p: 'suave' },
    'M7.5 4 H16.5 V9 A4.5 4.5 0 0 1 7.5 9 Z',
    'M7.5 6 H4.5 V7.2 A3.2 3.2 0 0 0 7.8 10.4 M16.5 6 H19.5 V7.2 A3.2 3.2 0 0 1 16.2 10.4',
    'M12 13.5 V17 M8.5 20 H15.5 M9.5 17 H14.5',
  ],
  perfil: [{ d: circulo(12, 8, 4), p: 'suave' }, circulo(12, 8, 4), 'M4.5 20 C4.5 16.4 8 14.6 12 14.6 C16 14.6 19.5 16.4 19.5 20'],

  // ---------------------------------------------------------------- jogo
  fogo: [
    { d: 'M12 3 C12 6 17 8.5 17 14 A5 5 0 0 1 7 14 C7 11.8 8 10.4 9.2 9.4 C9.4 11 10.2 11.8 11 12 C10.4 8.8 10.8 5.4 12 3 Z', p: 'suave' },
    'M12 3 C12 6 17 8.5 17 14 A5 5 0 0 1 7 14 C7 11.8 8 10.4 9.2 9.4 C9.4 11 10.2 11.8 11 12 C10.4 8.8 10.8 5.4 12 3 Z',
    'M12 19 C10.9 19 10.2 18.2 10.2 17.2 C10.2 16.2 11.1 15.6 12 14.4 C12.9 15.6 13.8 16.2 13.8 17.2 C13.8 18.2 13.1 19 12 19 Z',
  ],
  raio: [{ d: 'M13 3 L5 13.5 H11 L10 21 L19 10 H13 Z', p: 'suave' }, 'M13 3 L5 13.5 H11 L10 21 L19 10 H13 Z'],
  alvo: [{ d: ANEL, p: 'suave' }, ANEL, circulo(12, 12, 4.8), { d: circulo(12, 12, 1.7), p: 'cheio' }],
  ampulheta: [
    'M6.5 3.5 H17.5 M6.5 20.5 H17.5',
    'M8 3.5 V7 C8 9.6 12 10.4 12 12 C12 13.6 8 14.4 8 17 V20.5 M16 3.5 V7 C16 9.6 12 10.4 12 12 C12 13.6 16 14.4 16 17 V20.5',
    { d: 'M9.4 19 C9.8 17.4 11.2 16.9 12 16 C12.8 16.9 14.2 17.4 14.6 19 Z', p: 'cheio' },
  ],
  'quebra-cabeca': [{ d: 'M5 8 H9.2 A2.2 2.2 0 1 1 12.8 8 H17 V12.2 A2.2 2.2 0 1 1 17 15.8 V20 H5 Z', p: 'suave' }, 'M5 8 H9.2 A2.2 2.2 0 1 1 12.8 8 H17 V12.2 A2.2 2.2 0 1 1 17 15.8 V20 H5 Z'],
  microscopio: [
    { d: 'M10.6 3.4 L14 5.1 L11.2 10.7 L7.8 9 Z', p: 'suave' },
    'M10.6 3.4 L14 5.1 L11.2 10.7 L7.8 9 Z',
    'M9.2 9.9 L8.2 12',
    'M13.2 7.4 C17.2 9 18 13.8 14.6 17',
    'M6.5 14.2 H11.5 M5.5 20.5 H18.5 M14.6 17 V20.5 M10 17 H14.6',
  ],
  cubo: [{ d: 'M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z', p: 'suave' }, 'M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z', 'M4 7.5 L12 12 L20 7.5 M12 12 V21'],
  // duas espadas cruzadas: ponta em folha, lâmina, guarda, cabo e pomo
  duelo: [
    { d: `M3.6 3.6 L7 4.4 L8.2 8.2 L4.4 7 Z M20.4 3.6 L17 4.4 L15.8 8.2 L19.6 7 Z ${circulo(19.3, 19.3, 1.5)} ${circulo(4.7, 19.3, 1.5)}`, p: 'cheio' },
    'M7 7 L14.6 14.6 M17 7 L9.4 14.6',
    'M11.4 17.6 L17.6 11.4 M12.6 17.6 L6.4 11.4',
    'M15.6 15.6 L18.4 18.4 M8.4 15.6 L5.6 18.4',
  ],
  revisao: ['M19 9 A7.6 7.6 0 0 0 5.6 8', 'M5 4.5 V8.5 H9', 'M5 15 A7.6 7.6 0 0 0 18.4 16', 'M19 19.5 V15.5 H15'],
  livro: [
    { d: 'M6 4 H17 A1 1 0 0 1 18 5 V20 H7.6 A1.6 1.6 0 0 1 6 18.4 Z', p: 'suave' },
    'M6 4 H17 A1 1 0 0 1 18 5 V20 H7.6 A1.6 1.6 0 0 1 6 18.4 Z',
    'M6 18.4 A1.6 1.6 0 0 1 7.6 16.8 H18',
    'M10 4 V10 L12 8.6 L14 10 V4',
  ],
  pergunta: [{ d: ANEL, p: 'suave' }, ANEL, 'M9.6 9.6 A2.5 2.5 0 1 1 12 12.2 V13.6', { d: circulo(12, 16.6, 1.15), p: 'cheio' }],
  coracao: [{ d: CORACAO, p: 'cheio' }],
  'coracao-vazio': [CORACAO],
  'coracao-partido': [{ d: CORACAO, p: 'suave' }, CORACAO, 'M12 7.6 L10.4 11 L13.4 13 L12 16.4'],

  // ---------------------------------------------------------------- respostas e ações
  certo: [{ d: ANEL, p: 'suave' }, ANEL, 'M8 12.4 L11 15.4 L16.4 9.4'],
  errado: [{ d: ANEL, p: 'suave' }, ANEL, 'M9 9 L15 15 M15 9 L9 15'],
  visto: ['M5 12.6 L10 17.6 L19.4 7'],
  fechar: ['M6 6 L18 18 M18 6 L6 18'],
  'seta-esquerda': ['M14.5 5.5 L8 12 L14.5 18.5'],
  'seta-direita': ['M9.5 5.5 L16 12 L9.5 18.5'],
  'seta-cima': ['M5.5 14.5 L12 8 L18.5 14.5'],
  'seta-baixo': ['M5.5 9.5 L12 16 L18.5 9.5'],
  anterior: [{ d: 'M16.5 5.5 V18.5 L7 12 Z', p: 'cheio' }, 'M16.5 5.5 V18.5 L7 12 Z'],
  proximo: [{ d: 'M7.5 5.5 V18.5 L17 12 Z', p: 'cheio' }, 'M7.5 5.5 V18.5 L17 12 Z'],
  pausa: [{ d: 'M7.5 5 H10.5 V19 H7.5 Z M13.5 5 H16.5 V19 H13.5 Z', p: 'suave' }, 'M7.5 5 H10.5 V19 H7.5 Z M13.5 5 H16.5 V19 H13.5 Z'],
  bandeira: [
    { d: 'M6 5 C9 3.5 11 6.5 14 5 C15.5 4.3 17 4.2 18 4.6 V13 C17 12.6 15.5 12.7 14 13.4 C11 14.9 9 11.9 6 13.4 Z', p: 'suave' },
    'M6 21 V4',
    'M6 5 C9 3.5 11 6.5 14 5 C15.5 4.3 17 4.2 18 4.6 V13 C17 12.6 15.5 12.7 14 13.4 C11 14.9 9 11.9 6 13.4',
  ],
  cadeado: [{ d: 'M6 11 H18 V19 A1 1 0 0 1 17 20 H7 A1 1 0 0 1 6 19 Z', p: 'suave' }, 'M6 11 H18 V19 A1 1 0 0 1 17 20 H7 A1 1 0 0 1 6 19 Z', 'M8 11 V8.5 A4 4 0 0 1 16 8.5 V11'],
  grafico: [{ d: 'M5.5 13 H8.5 V20 H5.5 Z M10.5 6 H13.5 V20 H10.5 Z M15.5 10 H18.5 V20 H15.5 Z', p: 'suave' }, 'M5.5 13 H8.5 V20 H5.5 Z M10.5 6 H13.5 V20 H10.5 Z M15.5 10 H18.5 V20 H15.5 Z', 'M3.5 20 H20.5'],
  lupa: [{ d: circulo(10.5, 10.5, 6), p: 'suave' }, circulo(10.5, 10.5, 6), 'M15 15 L20 20'],
  // selo "revisado por IA": losango neutro (de propósito, não é um visto)
  losango: [{ d: 'M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z', p: 'suave' }, 'M12 3.5 L20.5 12 L12 20.5 L3.5 12 Z'],

  // ---------------------------------------------------------------- resultados
  festa: [{ d: 'M4 20 L8.6 8.6 L15.4 15.4 Z', p: 'suave' }, 'M4 20 L8.6 8.6 L15.4 15.4 Z', 'M13 3.5 V6 M19.6 4.4 L17.8 6.2 M20.5 11 H18 M14.6 9.4 C15.8 8.2 16.8 9.2 18 8'],
  tendencia: ['M4 17 L10 11 L13.5 14.5 L20 7.5', 'M15 7.5 H20 V12.5'],
  medalha: [{ d: circulo(12, 15, 5), p: 'suave' }, circulo(12, 15, 5), 'M8.4 3.5 L11 9.6 M15.6 3.5 L13 9.6 M8.4 3.5 H15.6', { d: estrela(12, 15, 2.6), p: 'cheio' }],
  empate: [{ d: ANEL, p: 'suave' }, ANEL, 'M8.5 10 H15.5 M8.5 14 H15.5'],
  estrela: [{ d: estrela(12, 12.6, 8.6), p: 'suave' }, estrela(12, 12.6, 8.6)],

  // ---------------------------------------------------------------- conquistas
  pegadas: [
    { d: 'M8 3.5 C10 3.5 10.6 6.4 10.1 8.8 C9.7 10.8 6.3 10.8 5.9 8.8 C5.4 6.4 6 3.5 8 3.5 Z M16 9 C18 9 18.6 11.9 18.1 14.3 C17.7 16.3 14.3 16.3 13.9 14.3 C13.4 11.9 14 9 16 9 Z', p: 'suave' },
    'M8 3.5 C10 3.5 10.6 6.4 10.1 8.8 C9.7 10.8 6.3 10.8 5.9 8.8 C5.4 6.4 6 3.5 8 3.5 Z',
    'M6.4 12.6 H9.6 V13.6 A1.6 1.6 0 0 1 6.4 13.6 Z',
    'M16 9 C18 9 18.6 11.9 18.1 14.3 C17.7 16.3 14.3 16.3 13.9 14.3 C13.4 11.9 14 9 16 9 Z',
    'M14.4 18.1 H17.6 V19.1 A1.6 1.6 0 0 1 14.4 19.1 Z',
  ],
  camisa: [{ d: 'M8.6 4 L4 7 L6 10.6 L8 9.6 V20 H16 V9.6 L18 10.6 L20 7 L15.4 4 A3.4 3.4 0 0 1 8.6 4 Z', p: 'suave' }, 'M8.6 4 L4 7 L6 10.6 L8 9.6 V20 H16 V9.6 L18 10.6 L20 7 L15.4 4 A3.4 3.4 0 0 1 8.6 4 Z'],
  capelo: [{ d: 'M2.5 9.5 L12 5 L21.5 9.5 L12 14 Z', p: 'suave' }, 'M2.5 9.5 L12 5 L21.5 9.5 L12 14 Z', 'M6.5 11.6 V16 C8.5 18.6 15.5 18.6 17.5 16 V11.6', 'M21.5 9.5 V15'],

  // ---------------------------------------------------------------- disciplinas
  broto: [
    { d: 'M12 13 C8 13 5.5 11 5 7 C9 7 11.5 9 12 13 Z M12 11 C12.5 7.5 15 5 19 4.5 C19 8.5 16.5 10.8 12 11 Z', p: 'suave' },
    'M12 21 V11',
    'M12 13 C8 13 5.5 11 5 7 C9 7 11.5 9 12 13 Z',
    'M12 11 C12.5 7.5 15 5 19 4.5 C19 8.5 16.5 10.8 12 11 Z',
  ],
  osso: [
    { d: 'M7.8 13.6 L13.6 7.8 A2.4 2.4 0 1 1 17.4 6.6 A2.4 2.4 0 1 1 16.2 10.4 L10.4 16.2 A2.4 2.4 0 1 1 6.6 17.4 A2.4 2.4 0 1 1 7.8 13.6 Z', p: 'suave' },
    'M7.8 13.6 L13.6 7.8 A2.4 2.4 0 1 1 17.4 6.6 A2.4 2.4 0 1 1 16.2 10.4 L10.4 16.2 A2.4 2.4 0 1 1 6.6 17.4 A2.4 2.4 0 1 1 7.8 13.6 Z',
  ],
  frasco: [
    { d: 'M8.2 14.5 H15.8 L18.4 19 A1 1 0 0 1 17.5 20.5 H6.5 A1 1 0 0 1 5.6 19 Z', p: 'suave' },
    'M9.5 3.5 H14.5',
    'M10.5 3.5 V9 L5.6 18.4 A1.4 1.4 0 0 0 6.8 20.5 H17.2 A1.4 1.4 0 0 0 18.4 18.4 L13.5 9 V3.5',
    'M8.2 14.5 H15.8',
  ],
  dna: ['M7.5 3 C7.5 8 16.5 8 16.5 12 C16.5 16 7.5 16 7.5 21', 'M16.5 3 C16.5 8 7.5 8 7.5 12 C7.5 16 16.5 16 16.5 21', 'M9 5.6 H15 M9 18.4 H15 M10 12 H14'],
  pulso: [{ d: CORACAO, p: 'suave' }, CORACAO, 'M6.8 12.2 H9.4 L10.8 9.6 L13 14.8 L14.4 12.2 H17.2'],
  placa: [
    { d: 'M3.5 9.5 A8.5 3.5 0 1 0 20.5 9.5 A8.5 3.5 0 1 0 3.5 9.5 Z', p: 'suave' },
    'M3.5 9.5 A8.5 3.5 0 1 0 20.5 9.5 A8.5 3.5 0 1 0 3.5 9.5 Z',
    'M3.5 9.5 V14 A8.5 3.5 0 0 0 20.5 14 V9.5',
    { d: `${circulo(9, 9.2, 1.2)} ${circulo(14, 10.2, 1)} ${circulo(12.4, 8.2, 0.7)}`, p: 'cheio' },
  ],
  pilula: [{ d: CAPSULA, p: 'suave' }, CAPSULA, 'M8.95 8.95 L15.05 15.05'],
  estetoscopio: [
    'M6 4 V8.6 A4 4 0 0 0 14 8.6 V4',
    'M5 4 H7 M13 4 H15',
    'M10 12.6 V15 A4.5 4.5 0 0 0 19 15 V14.2',
    { d: circulo(19, 12, 2.1), p: 'suave' },
    circulo(19, 12, 2.1),
  ],
  cascata: [
    { d: 'M4 4.5 H10 V8.5 H4 Z M14 10 H20 V14 H14 Z M4 15.5 H10 V19.5 H4 Z', p: 'suave' },
    'M4 4.5 H10 V8.5 H4 Z M14 10 H20 V14 H14 Z M4 15.5 H10 V19.5 H4 Z',
    'M10 6.5 H17 V10 M17 14 V17.5 H10',
  ],
  bisturi: [
    { d: 'M12 12 L19.5 4.5 C20.4 7.6 18.8 11.6 14.5 14.5 Z', p: 'suave' },
    'M12 12 L19.5 4.5 C20.4 7.6 18.8 11.6 14.5 14.5 Z',
    'M12 12 L14.5 14.5 L6.6 20.4 A1.8 1.8 0 0 1 4 17.9 Z',
  ],
} satisfies Record<string, ParteIcone[]>;

export type NomeIcone = keyof typeof ICONES;

/** SVG como texto (canvas de design e prévias). O app usa o componente Icone, que desenha as mesmas partes. */
export function iconeParaSvg(nome: NomeIcone, tamanho = 24): string {
  const partes = (ICONES[nome] as ParteIcone[]).map((p) =>
    typeof p === 'string'
      ? `<path d="${p}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      : p.p === 'suave'
        ? `<path d="${p.d}" fill="currentColor" fill-opacity="0.2"/>`
        : `<path d="${p.d}" fill="currentColor"/>`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24">${partes.join('')}</svg>`;
}
