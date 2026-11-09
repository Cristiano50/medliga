// Utilitários para desenhar lâminas histológicas esquemáticas em SVG (aspecto de coloração HE).
import type { ReactNode } from 'react';

export const W = 1000;
export const H = 700;

/** Paleta HE (hematoxilina = roxo-azulado; eosina = rosa) e de outras colorações usadas. */
export const HE = {
  vidro: '#f7eef3',
  luz: '#fbf7fa',
  nucleo: '#4b3a8f',
  nucleoEscuro: '#33276b',
  nucleoClaro: '#7a6bb8',
  citoplasma: '#eaa6c4',
  citoplasmaClaro: '#f3c9da',
  citoplasmaEscuro: '#d97ea6',
  colageno: '#ee9fbf',
  colagenoClaro: '#f6c8da',
  hemacia: '#d8436d',
  muco: '#e9e4f1',
  basofilo: '#a891d6',
  basofiloEscuro: '#8a6fc4',
  musculo: '#df7fa8',
  // osso por desgaste (sem coloração)
  ossoMatriz: '#d8c8ae',
  ossoLinha: '#8f7a5a',
  ossoEscuro: '#3f3222',
  // esfregaço (Leishman/Wright)
  hemaciaEsfregaco: '#eba7ad',
  hemaciaCentro: '#f6d3d5',
  nucleoLeuco: '#5a3d96',
  graoEosino: '#e3633e',
  graoBaso: '#3a2470',
  citoLinfo: '#a8c3ea',
  citoMono: '#b9c2db',
  plaqueta: '#8b6cba',
} as const;

/** Grupo identificável: tudo dentro dele responde ao toque como a estrutura `id`. */
export function E({ id, children }: { id: string; children: ReactNode }) {
  return <g data-e={id}>{children}</g>;
}

/** Elementos só decorativos (não respondem ao toque). */
export function Deco({ children }: { children: ReactNode }) {
  return <g style={{ pointerEvents: 'none' }}>{children}</g>;
}

export type Rng = () => number;

export function entre(rng: Rng, a: number, b: number) {
  return a + rng() * (b - a);
}

/** Pontilhado de fundo (textura de corte). */
export function textura(rng: Rng, n: number, cor: string, area: [number, number, number, number] = [0, 0, W, H], r = 1.6) {
  const [x0, y0, x1, y1] = area;
  return (
    <Deco>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={entre(rng, x0, x1)} cy={entre(rng, y0, y1)} r={entre(rng, r * 0.5, r)} fill={cor} opacity={0.5} />
      ))}
    </Deco>
  );
}

/** Polígono a partir de pontos. */
export function poli(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';
}

/** Setor de anel (usado em túbulos e ácinos): célula em forma de cunha. */
export function cunha(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number): [number, number] => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  const [x0, y0] = p(r1, a0);
  const [x1, y1] = p(r1, a1);
  const [x2, y2] = p(r0, a1);
  const [x3, y3] = p(r0, a0);
  return `M${x0},${y0} A${r1},${r1} 0 0 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 0 ${x3},${y3} Z`;
}

/** Hexágonos irregulares em grade (para adipócitos, células poligonais). */
export function grade(rng: Rng, passo: number, area: [number, number, number, number], jitter = 0.25) {
  const [x0, y0, x1, y1] = area;
  const centros: [number, number][] = [];
  const dy = passo * 0.866;
  let linha = 0;
  for (let y = y0; y <= y1 + dy; y += dy, linha++) {
    for (let x = x0 + (linha % 2 ? passo / 2 : 0); x <= x1 + passo; x += passo) {
      centros.push([x + entre(rng, -jitter, jitter) * passo, y + entre(rng, -jitter, jitter) * passo]);
    }
  }
  return centros;
}

/** Hexágono ao redor de um centro (raio r, leve irregularidade). */
export function hexagono(rng: Rng, cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const rr = r * entre(rng, 0.9, 1.05);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as [number, number];
  });
}
