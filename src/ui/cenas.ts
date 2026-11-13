// Cenas das telas de resultado e dos estados vazios: um halo, o ícone grande e, conforme o desempenho, brilhos e
// confetes. Puro: serve ao app, aos testes e às pranchas do canvas. O movimento fica no CSS (styles.css) e parte
// sempre de um quadro inicial para o desenho final, de modo que, com "reduzir movimento", a cena aparece pronta.
import type { NomeIcone } from './icones.ts';
import { iconeEm, type FormaInsignia } from './insignias.ts';

/** comemorar: 80% ou mais de acertos, ou vitória. bom: de 50% a 79%, ou algo em dia. calmo: o resto. */
export type Humor = 'comemorar' | 'bom' | 'calmo';

export const CORES_HUMOR: Record<Humor, string> = { comemorar: '#f5b942', bom: '#2dd4bf', calmo: '#9db0d0' };
const CORES_CONFETE = ['#2dd4bf', '#f0705a', '#8b7cf0', '#4f8ef7', '#f5b942'];

/** Humor da cena pela fração de acertos. Sem nenhuma resposta, é calmo. */
export function humorPorAcertos(acertos: number, total: number): Humor {
  if (!(total > 0)) return 'calmo';
  const f = acertos / total;
  return f >= 0.8 ? 'comemorar' : f >= 0.5 ? 'bom' : 'calmo';
}

export const CAIXA_CENA = '0 0 120 120';
const C = 60;
const n = (v: number) => +v.toFixed(2);
const circulo = (cx: number, cy: number, r: number) => `M${n(cx + r)} ${n(cy)} A${r} ${r} 0 1 1 ${n(cx - r)} ${n(cy)} A${r} ${r} 0 0 1 ${n(cx + r)} ${n(cy)} Z`;
/** Ponto em volta do centro: ângulo em graus a partir do topo, no sentido horário. */
const emVolta = (raio: number, graus: number): [number, number] => {
  const a = (graus * Math.PI) / 180;
  return [C + raio * Math.sin(a), C - raio * Math.cos(a)];
};
/** Brilho de quatro pontas, com os lados para dentro. */
const brilho = (x: number, y: number, r: number) =>
  `M${n(x)} ${n(y - r)} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Q${n(x)} ${n(y)} ${n(x)} ${n(y + r)} Q${n(x)} ${n(y)} ${n(x - r)} ${n(y)} Q${n(x)} ${n(y)} ${n(x)} ${n(y - r)} Z`;
/** Polígono em volta de (x, y), já girado: os pontos saem nas coordenadas finais (sem transformação no elemento). */
const girado = (x: number, y: number, pontos: [number, number][], graus: number) => {
  const a = (graus * Math.PI) / 180;
  return pontos.map(([px, py], i) => `${i ? 'L' : 'M'}${n(x + px * Math.cos(a) - py * Math.sin(a))} ${n(y + px * Math.sin(a) + py * Math.cos(a))}`).join(' ') + ' Z';
};

/** Um confete: a forma no lugar final e de onde ela parte (deslocamento para o lado do centro). */
export interface PecaCena extends FormaInsignia {
  dx: number;
  dy: number;
}

export interface PartesCena {
  halo: FormaInsignia[];
  icone: FormaInsignia[];
  brilhos: FormaInsignia[];
  pecas: PecaCena[];
}

const BRILHOS: Record<Humor, [number, number, number][]> = {
  comemorar: [[24, 25, 8], [98, 27, 6], [103, 84, 7], [18, 86, 5]],
  bom: [[98, 27, 6.5], [20, 90, 5]],
  calmo: [],
};
// ângulo (graus a partir do topo), raio e giro de cada confete; a forma alterna entre tira, triângulo e ponto
const CONFETES: [number, number, number][] = [
  [-62, 55, 20], [-22, 56, -35], [14, 55, 50], [55, 56, -15], [118, 55, 30], [150, 56, -50], [182, 55, 10], [212, 56, 65], [262, 55, -25], [305, 56, 40],
];

export function cenaPartes(humor: Humor, icone: NomeIcone): PartesCena {
  const cor = CORES_HUMOR[humor];
  const halo: FormaInsignia[] = [
    { d: circulo(C, C, 40), f: cor, fo: 0.12 },
    { d: circulo(C, C, 40), s: cor, sw: 1.5, o: 0.4 },
    { d: circulo(C, C, 52), s: cor, sw: 1.6, o: 0.28, dash: '0.1 9' },
  ];
  const brilhos = BRILHOS[humor].map(([x, y, r]) => ({ d: brilho(x, y, r), f: cor }));
  const pecas: PecaCena[] =
    humor !== 'comemorar'
      ? []
      : CONFETES.map(([ang, raio, giro], i) => {
          const [x, y] = emVolta(raio, ang);
          const tipo = i % 3;
          const d = tipo === 0 ? girado(x, y, [[-3.4, -1.4], [3.4, -1.4], [3.4, 1.4], [-3.4, 1.4]], giro) : tipo === 1 ? girado(x, y, [[0, -3], [2.8, 2.2], [-2.8, 2.2]], giro) : circulo(x, y, 2.1);
          // parte de 14 unidades mais perto do centro
          return { d, f: CORES_CONFETE[i % CORES_CONFETE.length], dx: n(((C - x) / raio) * 14), dy: n(((C - y) / raio) * 14) };
        });
  return { halo, icone: iconeEm(icone, cor, C, C, 48), brilhos, pecas };
}

/** Todas as formas da cena pronta, de trás para a frente. */
export function cenaFormas(humor: Humor, icone: NomeIcone): FormaInsignia[] {
  const p = cenaPartes(humor, icone);
  return [...p.halo, ...p.pecas.map(({ dx: _dx, dy: _dy, ...f }) => f), ...p.brilhos, ...p.icone];
}
