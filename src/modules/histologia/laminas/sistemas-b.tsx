// Lâminas da histologia dos sistemas — grupo B: tubo digestivo e glândulas anexas.
// Ids e estruturas = content/histologia/laminas-sistemas-b.json (teste em tests/conteudo.test.ts).
// Desenho leve para celular: cada tipo de célula de uma estrutura vai num único <path> (subcaminhos), e núcleos
// redondos ou alongados são traços de ponta redonda (um "ponto" = traço de comprimento quase zero).
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, grade, hexagono, type Rng } from '../he.tsx';
import type { LaminaRender } from './index.ts';

// ---------------------------------------------------------------------------------------------
// utilitários de geometria e de caminho
type P = [number, number];
const q = (v: number) => String(Math.round(v * 10) / 10);
/** Coordenadas relativas em décimos inteiros (texto curto e sem acúmulo de arredondamento). */
function relativo(pts: P[]) {
  let d = '';
  let cx = 0;
  let cy = 0;
  pts.forEach(([x, y], i) => {
    const X = Math.round(x * 10);
    const Y = Math.round(y * 10);
    d += i ? `${(X - cx) / 10} ${(Y - cy) / 10} ` : `M${X / 10} ${Y / 10}l`;
    cx = X;
    cy = Y;
  });
  return d.trimEnd();
}
/** Polígono fechado. */
const pg = (pts: P[]) => (pts.length > 2 ? relativo(pts) + 'z' : '');
/** Ponto (desenhar com strokeLinecap="round"; o diâmetro é o strokeWidth). */
const pt = (x: number, y: number) => `M${q(x)} ${q(y)}h.01`;
/** Segmento centrado em (x, y), de comprimento `c` e ângulo `a` (rad): núcleo alongado com ponta redonda. */
const seg = (x: number, y: number, c: number, a: number) => {
  const dx = (Math.cos(a) * c) / 2;
  const dy = (Math.sin(a) * c) / 2;
  return `M${q(x - dx)} ${q(y - dy)}L${q(x + dx)} ${q(y + dy)}`;
};
/**
 * Vários pontos num só caminho, com deslocamentos relativos (texto bem mais curto que pontos absolutos). As contas
 * são em décimos inteiros, para o arredondamento não se acumular de um ponto para o outro.
 */
function pontos(lista: P[]) {
  let d = '';
  let cx = 0;
  let cy = 0;
  lista.forEach(([x, y], i) => {
    const X = Math.round(x * 10);
    const Y = Math.round(y * 10);
    d += i ? `m${(X - cx) / 10} ${(Y - cy) / 10}h.1` : `M${X / 10} ${Y / 10}h.1`;
    cx = X + 1; // o "h.1" anda um décimo para a direita
    cy = Y;
  });
  return d;
}
/** Distância do ponto (x, y) até a borda de um polígono convexo que o contém, na direção a. */
function raioPoligono(poli: P[], x: number, y: number, a: number) {
  const c = Math.cos(a);
  const sn = Math.sin(a);
  let m = Infinity;
  poli.forEach(([ax, ay], k) => {
    const [bx, by] = poli[(k + 1) % poli.length];
    const ex = bx - ax;
    const ey = by - ay;
    const den = c * ey - sn * ex;
    if (Math.abs(den) < 1e-9) return;
    const t = ((ax - x) * ey - (ay - y) * ex) / den;
    const u = ((ax - x) * sn - (ay - y) * c) / den;
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) m = Math.min(m, t);
  });
  return m;
}
const circ = (x: number, y: number, r: number) => `M${q(x - r)} ${q(y)}a${q(r)} ${q(r)} 0 1 0 ${q(2 * r)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-2 * r)} 0`;
/** Elipse girada (a em rad). */
const elip = (x: number, y: number, rx: number, ry: number, a = 0) => {
  const c = Math.cos(a) * rx;
  const s = Math.sin(a) * rx;
  const g = q((a * 180) / Math.PI);
  return `M${q(x - c)} ${q(y - s)}a${q(rx)} ${q(ry)} ${g} 1 0 ${q(2 * c)} ${q(2 * s)}a${q(rx)} ${q(ry)} ${g} 1 0 ${q(-2 * c)} ${q(-2 * s)}`;
};
/** Fuso (célula muscular lisa cortada ao comprido), horizontal. */
const fuso = (x0: number, x1: number, y: number, e: number) => {
  const c = Math.round((x1 - x0) * 10) / 10;
  return `M${q(x0)} ${q(y)}q${q(c / 2)} ${q(-e)} ${c} 0q${q(-c / 2)} ${q(e)} ${-c} 0z`;
};
/** Linha (polilinha aberta). */
const lin = (pts: P[]) => (pts.length > 1 ? relativo(pts) : '');

function distSeg(px: number, py: number, [ax, ay]: P, [bx, by]: P) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function distLinha(pts: P[], x: number, y: number) {
  let m = Infinity;
  for (let i = 1; i < pts.length; i++) m = Math.min(m, distSeg(x, y, pts[i - 1], pts[i]));
  return m;
}

type Amostra = { x: number; y: number; tx: number; ty: number };
/** Pontos a intervalos iguais ao longo de uma polilinha, com a tangente (média dos vizinhos). */
function reamostrar(pts: P[], passo: number, inicio = 0): Amostra[] {
  const out: P[] = [];
  let s = inicio;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const L = Math.hypot(bx - ax, by - ay);
    if (!L) continue;
    for (; s <= L; s += passo) out.push([ax + ((bx - ax) * s) / L, ay + ((by - ay) * s) / L]);
    s -= L;
  }
  return out.map(([x, y], i) => {
    const [ax, ay] = out[Math.max(0, i - 1)];
    const [bx, by] = out[Math.min(out.length - 1, i + 1)];
    const L = Math.hypot(bx - ax, by - ay) || 1;
    return { x, y, tx: (bx - ax) / L, ty: (by - ay) / L };
  });
}

/** Arco de circunferência (ângulos em graus; sentido dado pela ordem a0 → a1). */
function arco(cx: number, cy: number, r: number, a0: number, a1: number, n = 8): P[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as P;
  });
}

type CelulaContorno = { tipo: string; poli: P[]; ax: number; ay: number; nx: number; ny: number; tx: number; ty: number; prof: number };
/**
 * Epitélio simples ao longo de um contorno apical (a luz fica à esquerda do sentido de percurso; o tecido, à
 * direita). `escolher` decide o tipo de cada célula, quantas amostras ela ocupa na superfície e sua altura; `bojo`
 * abaula a face basal (célula parietal). As células vizinhas dividem a mesma linha de limite: sem vãos.
 */
function celulasNoContorno(am: Amostra[], escolher: (a: Amostra, i: number) => { tipo: string; n: number; prof: number; bojo?: number }) {
  const cel: CelulaContorno[] = [];
  for (let i = 0; i < am.length - 1; ) {
    const { tipo, n: n0, prof, bojo = 0 } = escolher(am[i], i);
    const n = Math.max(1, Math.min(n0, am.length - 1 - i));
    const ap = am.slice(i, i + n + 1);
    const bas = ap.map((a, j): P => {
      const sn = Math.sin((Math.PI * j) / n);
      const d = bojo ? prof * (0.8 + 0.2 * sn) + bojo * sn : prof;
      return [a.x - a.ty * d, a.y + a.tx * d];
    });
    const m = ap[Math.floor(n / 2)];
    const m2 = ap[Math.ceil(n / 2)];
    const tx = (m.tx + m2.tx) / 2;
    const ty = (m.ty + m2.ty) / 2;
    const tn = Math.hypot(tx, ty) || 1;
    cel.push({ tipo, poli: [...ap.map((a): P => [a.x, a.y]), ...bas.reverse()], ax: (m.x + m2.x) / 2, ay: (m.y + m2.y) / 2, tx: tx / tn, ty: ty / tn, nx: -ty / tn, ny: tx / tn, prof: prof + bojo });
    i += n;
  }
  return cel;
}
/** Parte apical de uma célula do contorno (até a fração f da altura), para a teca de muco ou os grânulos. */
function apice(c: CelulaContorno, f: number) {
  const k = c.poli.length / 2;
  const ap = c.poli.slice(0, k);
  const bas = c.poli.slice(k).reverse();
  return [...ap, ...bas.map(([x, y], j): P => [ap[j][0] + (x - ap[j][0]) * f, ap[j][1] + (y - ap[j][1]) * f]).reverse()];
}
/** Ponto dentro da célula: v = fração da altura (0 = ápice), u = deslocamento ao longo da superfície. */
const naCelula = (c: CelulaContorno, v: number, u = 0): P => [c.ax + c.nx * c.prof * v + c.tx * u, c.ay + c.ny * c.prof * v + c.ty * u];

/** Ocupação do plano por círculos (para não sobrepor núcleos nem células soltas). */
class Espaco {
  private m = new Map<number, [number, number, number][]>();
  private maxR = 0;
  private readonly c = 16;
  livre(x: number, y: number, r: number) {
    const a = r + this.maxR;
    for (let i = Math.floor((x - a) / this.c); i <= Math.floor((x + a) / this.c); i++)
      for (let j = Math.floor((y - a) / this.c); j <= Math.floor((y + a) / this.c); j++)
        for (const [ox, oy, or] of this.m.get(i * 4096 + j) ?? []) if (Math.hypot(ox - x, oy - y) < or + r) return false;
    return true;
  }
  marcar(x: number, y: number, r: number) {
    const k = Math.floor(x / this.c) * 4096 + Math.floor(y / this.c);
    const l = this.m.get(k) ?? [];
    l.push([x, y, r]);
    this.m.set(k, l);
    this.maxR = Math.max(this.maxR, r);
  }
  /** marca e devolve true se couber */
  tentar(x: number, y: number, r: number) {
    if (!this.livre(x, y, r)) return false;
    this.marcar(x, y, r);
    return true;
  }
}

/** Músculo liso cortado ao comprido (fusos horizontais, núcleo central alongado em parte deles). */
function lisoLongitudinal(rng: Rng, y0: number, y1: number, fora: (x: number, y: number) => boolean = () => false) {
  let cel = '';
  let nuc = '';
  for (let y = y0 + 3; y < y1 - 1; y += 6.2) {
    for (let x = -40 + entre(rng, 0, 40); x < W + 40; ) {
      const c = entre(rng, 48, 72);
      const yy = y + entre(rng, -0.8, 0.8);
      if (!fora(x + c / 2, yy)) {
        cel += fuso(x, x + c, yy, entre(rng, 6.2, 7.6));
        if (rng() < 0.55) nuc += seg(x + c / 2 + entre(rng, -4, 4), yy, entre(rng, 8, 11), 0);
      }
      x += c * entre(rng, 0.55, 0.7);
    }
  }
  return { cel, nuc };
}

/** Músculo liso cortado de través: perfis redondos de calibres variados, núcleo central em parte deles. */
function lisoTransversal(rng: Rng, y0: number, y1: number, fora: (x: number, y: number) => boolean = () => false, passo = 7.4) {
  const perfis = ['', '', ''];
  let nuc = '';
  for (const [x, y] of grade(rng, passo, [-10, y0 + 3, W + 10, y1 - 2], 0.12)) {
    if (y < y0 + 3 || y > y1 - 3 || fora(x, y)) continue;
    const k = rng() < 0.3 ? 0 : rng() < 0.6 ? 1 : 2;
    perfis[k] += pt(x, y);
    if (k > 0 && rng() < 0.42) nuc += pt(x + entre(rng, -0.5, 0.5), y + entre(rng, -0.5, 0.5));
  }
  return { perfis, nuc };
}
/** Diâmetros dos perfis transversais (fino, médio, grosso) para um dado passo. */
const calibres = (passo: number) => [passo * 0.66, passo * 0.8, passo * 0.92];
const COR_LISO = { fundo: '#eab0ca', fibra: '#dc7aa4', borda: '#cf6f99' };

/** Gânglio do plexo mioentérico: neuropilo claro, neurônios grandes com núcleo vesicular e nucléolo, núcleos de glia. */
function ganglio(rng: Rng, cx: number, cy: number, rx: number, ry: number, nNeur: number, k: string) {
  const esp = new Espaco();
  let corpos = '';
  let nucs = '';
  let nucleolos = '';
  let glia = '';
  for (let t = 0, n = 0; t < 200 && n < nNeur; t++) {
    const x = cx + entre(rng, -rx + 11, rx - 11);
    const y = cy + entre(rng, -ry + 8, ry - 8);
    if (((x - cx) / (rx - 9)) ** 2 + ((y - cy) / (ry - 7)) ** 2 > 1) continue;
    if (!esp.tentar(x, y, 12)) continue;
    n++;
    const a = entre(rng, -0.4, 0.4);
    corpos += elip(x, y, 10, 7.5, a);
    const nx = x + entre(rng, -1.5, 1.5);
    nucs += circ(nx, y, 3.6);
    nucleolos += pt(nx + 0.6, y - 0.4);
  }
  for (let t = 0; t < 120; t++) {
    const x = cx + entre(rng, -rx + 3, rx - 3);
    const y = cy + entre(rng, -ry + 3, ry - 3);
    if (((x - cx) / (rx - 2)) ** 2 + ((y - cy) / (ry - 2)) ** 2 > 1) continue;
    if (!esp.tentar(x, y, 3.2)) continue;
    glia += pt(x, y);
  }
  return (
    <g key={k}>
      <path d={elip(cx, cy, rx, ry)} fill="#f1d7e6" stroke="#c99ab9" strokeWidth={1.2} />
      <path d={corpos} fill="#d895bd" stroke="#b9729f" strokeWidth={0.6} />
      <path d={nucs} fill="#9a86cc" />
      <path d={nucleolos} stroke={HE.nucleoEscuro} strokeWidth={2.2} strokeLinecap="round" />
      <path d={glia} stroke={HE.nucleo} strokeWidth={3.4} strokeLinecap="round" />
    </g>
  );
}

/** Vaso em corte transversal: artéria (parede muscular espessa, luz redonda) ou veia (parede fina, luz ampla). */
function vaso(rng: Rng, x: number, y: number, r: number, arteria: boolean, k: string) {
  const parede = arteria ? r * 0.42 : Math.max(1.8, r * 0.1);
  const luz = r - parede;
  let nucs = '';
  const n = Math.max(5, Math.round((2 * Math.PI * r) / 9));
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * (i + rng() * 0.4)) / n;
    const rr = arteria ? luz + parede * entre(rng, 0.3, 0.7) : r - parede / 2;
    nucs += seg(x + Math.cos(a) * rr, y + Math.sin(a) * rr, arteria ? 4 : 3.5, a + Math.PI / 2);
  }
  let hem = '';
  const nh = Math.round((luz * luz) / 30);
  const esp = new Espaco();
  for (let t = 0, c = 0; t < 60 && c < nh; t++) {
    const a = entre(rng, 0, 2 * Math.PI);
    const d = Math.sqrt(rng()) * (luz - 3.5);
    if (esp.tentar(x + Math.cos(a) * d, y + Math.sin(a) * d, 3.4)) {
      hem += pt(x + Math.cos(a) * d, y + Math.sin(a) * d);
      c++;
    }
  }
  return (
    <g key={k}>
      <circle cx={x} cy={y} r={r} fill={arteria ? '#e38ab0' : '#eaa6c4'} stroke="#c45a88" strokeWidth={1} />
      <circle cx={x} cy={y} r={luz} fill={HE.luz} stroke="#c45a88" strokeWidth={0.8} />
      <path d={hem} stroke={HE.hemacia} strokeWidth={6} strokeLinecap="round" />
      <path d={nucs} stroke={HE.nucleo} strokeWidth={arteria ? 2 : 1.8} strokeLinecap="round" />
    </g>
  );
}

/** Núcleos soltos do conjuntivo (fibroblastos alongados, linfócitos e plasmócitos redondos), sem sobreposição. */
function celulasConjuntivo(rng: Rng, n: number, area: [number, number, number, number], dentro: (x: number, y: number) => boolean, esp: Espaco, linfo = 0.4) {
  let fib = '';
  let red = '';
  for (let t = 0, c = 0; t < n * 12 && c < n; t++) {
    const x = entre(rng, area[0], area[2]);
    const y = entre(rng, area[1], area[3]);
    if (!dentro(x, y) || !esp.tentar(x, y, 6)) continue;
    c++;
    if (rng() < linfo) red += pt(x, y);
    else fib += seg(x, y, entre(rng, 6, 9), entre(rng, -0.6, 0.6));
  }
  return (
    <Deco>
      <path d={fib} stroke={HE.nucleo} strokeWidth={2.4} strokeLinecap="round" />
      <path d={red} stroke={HE.nucleoEscuro} strokeWidth={4.6} strokeLinecap="round" />
    </Deco>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_ESOFAGO = ['epitelio-estratificado-pavimentoso', 'lamina-propria', 'muscular-da-mucosa', 'submucosa', 'glandula-esofagica', 'muscular-externa', 'plexo-mioenterico'];
/**
 * Esôfago (terço inferior), corte transversal da parede, luz em cima. Proporções de esquema: as células estão maiores
 * que na escala real para serem reconhecíveis a 40× (por isso há menos camadas de células que no órgão).
 */
export function LaminaEsofago(rng: Rng) {
  const sup = (x: number) => 34 + 3 * Math.sin(x / 75) + 1.5 * Math.sin(x / 23);
  const yMM0 = 288;
  const yMM1 = 320;
  const yME0 = 470;
  const ySepto0 = 598;
  const ySepto1 = 612;
  // ducto de uma glândula esofágica: sobe da submucosa e atravessa muscular da mucosa, lâmina própria e epitélio
  const ducto: P[] = [[724, 392], [736, 360], [741, 328], [737, 300], [744, 262], [750, 214], [746, 150], [751, 92], [749, 30]];
  const dDucto = (x: number, y: number) => distLinha(ducto, x, y);
  // papilas da lâmina própria projetando-se no epitélio
  const papilas: { x: number; h: number; w: number }[] = [];
  for (let x = entre(rng, 30, 70); x < W + 40; x += entre(rng, 92, 128)) if (Math.abs(x - 745) > 44) papilas.push({ x, h: entre(rng, 58, 82), w: entre(rng, 17, 22) });
  const juncao = (x: number) => {
    let y = 240 + 4 * Math.sin(x / 90);
    for (const p of papilas) {
      const u = (x - p.x) / p.w;
      if (Math.abs(u) < 1) y -= p.h * Math.pow(1 - Math.pow(Math.abs(u), 2.4), 1.3); // ponta arredondada
    }
    return y;
  };
  const curva: P[] = [];
  for (let x = -10; x <= W + 10; x += 2) curva.push([x, juncao(x)]);
  const curvaFina: P[] = [];
  for (let x = -10; x <= W + 10; x += 0.5) curvaFina.push([x, juncao(x)]);
  const distJuncao = (x: number, y: number) => {
    let m = Infinity;
    for (const [cx, cy] of curva) if (Math.abs(cx - x) < 40) m = Math.min(m, Math.hypot(cx - x, cy - y));
    return m;
  };
  const supPts: P[] = [];
  for (let x = -10; x <= W + 10; x += 10) supPts.push([x, sup(x)]);

  // --- epitélio estratificado pavimentoso não queratinizado
  // camada basal: células pequenas, basófilas, em paliçada sobre a junção
  const espBas = new Espaco();
  let basCel = '';
  let basNuc = '';
  for (const { x, y, tx, ty } of reamostrar(curvaFina, 9.6, 4)) {
    const nx = ty; // normal para dentro do epitélio (para cima)
    const ny = -tx;
    if (dDucto(x, y) < 13) continue;
    const em = (u: number, v: number): P => [x + tx * u + nx * v, y + ty * u + ny * v];
    const [cx, cy] = em(0, 7.5);
    // no fundo das cristas a curva é côncava e as células convergem: pula a que encostaria na vizinha
    if (!espBas.tentar(cx, cy, 4.7)) continue;
    basCel += pg([em(-4.9, 0), em(4.9, 0), em(4.6, 14), em(-4.6, 14)]);
    basNuc += seg(cx, cy, 4.2, Math.atan2(ny, nx));
  }
  // camadas intermediárias (espinhosas): poligonais, maiores e mais claras para cima (glicogênio)
  const esp = new Espaco();
  let profCel = '';
  let medCel = '';
  let medNuc = '';
  const faixa = (x: number, y: number) => (y - sup(x)) / (juncao(x) - sup(x)); // 0 = superfície, 1 = base
  for (const [x, y] of grade(rng, 15, [-10, 60, W + 10, 270], 0.1)) {
    // parabasais: pequenas, mais basófilas
    if (y < sup(x) + 47 || y > juncao(x) - 4 || distJuncao(x, y) < 16 || dDucto(x, y) < 12.5 || faixa(x, y) <= 0.58) continue;
    esp.marcar(x, y, 7.4);
    profCel += pg(hexagono(rng, x, y, 8.6));
    medNuc += circ(x + entre(rng, -0.8, 0.8), y + entre(rng, -0.8, 0.8), 3.4);
  }
  for (const [x, y] of grade(rng, 19.5, [-10, 50, W + 10, 270], 0.08)) {
    // intermediárias: maiores e claras (glicogênio); a grade fecha sem vãos (epitélio coeso)
    const k = faixa(x, y);
    if (y < sup(x) + 46 || y > juncao(x) - 4 || distJuncao(x, y) < 18 || dDucto(x, y) < 13.5 || k > 0.64 || !esp.livre(x, y, 7.6)) continue;
    esp.marcar(x, y, 9.4);
    medCel += pg(hexagono(rng, x, y, 11.4));
    medNuc += circ(x + entre(rng, -1, 1), y + entre(rng, -0.8, 0.8), 3.3);
  }
  // camadas superficiais: células achatadas que mantêm o núcleo (não há camada córnea)
  let supCel = '';
  let supNuc = '';
  for (let f = 0; f < 4; f++) {
    const L = 31 - f * 3;
    for (let x = -20 + (f % 2) * (L / 2) + entre(rng, -4, 4); x < W + 20; x += L - 1) {
      const y = sup(x) + 5.5 + f * 10.6;
      if (dDucto(x, y) < 10) continue;
      supCel += elip(x, y, L / 2 + 1, 4.6 + f * 0.6, Math.atan2(sup(x + 5) - sup(x - 5), 10));
      if (rng() < 0.8) supNuc += seg(x + entre(rng, -3, 3), y, f === 0 ? 3 : 4.5, 0);
    }
  }
  const epitelio = pg([...supPts, ...[...curva].reverse()]);

  // --- lâmina própria: conjuntivo frouxo, capilares nas papilas
  const espLP = new Espaco();
  const capilares: ReactElement[] = [];
  papilas.forEach((p, i) => {
    const y = 240 - p.h * 0.45;
    espLP.marcar(p.x, y, 9);
    capilares.push(
      <g key={i}>
        <ellipse cx={p.x} cy={y} rx={5.5} ry={8} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1.4} />
        <circle cx={p.x} cy={y - 2.5} r={2.7} fill={HE.hemacia} />
        <circle cx={p.x + 0.5} cy={y + 3} r={2.7} fill={HE.hemacia} />
      </g>,
    );
  });
  for (const [x, y, r] of [[160, 268, 7], [420, 270, 9], [590, 266, 6], [880, 272, 8]] as const) {
    espLP.marcar(x, y, r + 3);
    capilares.push(
      <g key={`v${x}`}>
        <circle cx={x} cy={y} r={r} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1.5} />
        <circle cx={x - r * 0.3} cy={y} r={2.8} fill={HE.hemacia} />
        <circle cx={x + r * 0.35} cy={y + 1} r={2.8} fill={HE.hemacia} />
      </g>,
    );
  }
  const dentroLP = (x: number, y: number) => y > juncao(x) + 5 && y < yMM0 - 5 && dDucto(x, y) > 13;

  // --- muscular da mucosa: músculo liso longitudinal, aqui cortado de través, em feixes
  const cortesMM = [-10];
  while (cortesMM[cortesMM.length - 1] < W) cortesMM.push(cortesMM[cortesMM.length - 1] + entre(rng, 70, 120));
  const entreFeixes = (x: number) => cortesMM.some((c) => Math.abs(x - c) < 3);
  const mm = lisoTransversal(rng, yMM0, yMM1, (x, y) => entreFeixes(x) || dDucto(x, y) < 12.5);

  // --- submucosa: conjuntivo denso com vasos e glândulas esofágicas (mucosas)
  const glandulas: { cx: number; cy: number; acinos: P[] }[] = [
    { cx: 250, cy: 396, acinos: [] },
    { cx: 712, cy: 404, acinos: [] },
  ];
  for (const g of glandulas)
    for (const [x, y] of grade(rng, 31, [g.cx - 80, g.cy - 50, g.cx + 80, g.cy + 50], 0.04))
      if (((x - g.cx) / 74) ** 2 + ((y - g.cy) / 44) ** 2 < 1 && dDucto(x, y) > 13 + 13.6) g.acinos.push([x, y]);
  let acinoCel = '';
  let acinoLim = '';
  let acinoNuc = '';
  let acinoLuz = '';
  for (const g of glandulas)
    for (const [x, y] of g.acinos) {
      const r = 13.6; // grade de 31 un com pouco desvio: ácinos vizinhos não se sobrepõem
      acinoCel += circ(x, y, r);
      const n = 7;
      const giro = entre(rng, 0, 1);
      for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n + giro;
        acinoLim += `M${q(x + Math.cos(a) * 4.4)} ${q(y + Math.sin(a) * 4.4)}L${q(x + Math.cos(a) * r)} ${q(y + Math.sin(a) * r)}`;
        const am = a + Math.PI / n;
        acinoNuc += seg(x + Math.cos(am) * (r - 2.6), y + Math.sin(am) * (r - 2.6), 4.2, am + Math.PI / 2);
      }
      acinoLuz += circ(x, y, 4); // luz mais ampla que a de um ácino seroso
    }
  // ducto excretor: epitélio estratificado de duas camadas (luminal cúbica a cilíndrica baixa e basal achatada);
  // dentro do epitélio da mucosa, perto da abertura, o revestimento se achata (pavimentoso)
  let ductoBordas = '';
  const ductoLum: P[] = [];
  let ductoBas = '';
  let ductoNucA = '';
  for (const { x, y, tx, ty } of reamostrar(ducto, 6.2, 3)) {
    const noEpitelio = y < juncao(x) - 2;
    for (const lado of [-1, 1]) {
      const nx = -ty * lado;
      const ny = tx * lado;
      if (noEpitelio) {
        ductoNucA += seg(x + nx * 5.4, y + ny * 5.4, 3.6, Math.atan2(ty, tx));
        continue;
      }
      ductoBordas += `M${q(x + tx * 3.1 + nx * 2.5)} ${q(y + ty * 3.1 + ny * 2.5)}L${q(x + tx * 3.1 + nx * 7)} ${q(y + ty * 3.1 + ny * 7)}`;
      ductoLum.push([x + nx * 4.7, y + ny * 4.7]);
      ductoBas += seg(x + tx * 1.6 + nx * 8.8, y + ty * 1.6 + ny * 8.8, 3.4, Math.atan2(ty, tx));
    }
  }
  const vasosSM = [vaso(rng, 460, 420, 15, true, 'a1'), vaso(rng, 515, 432, 22, false, 'v1'), vaso(rng, 905, 380, 11, true, 'a2'), vaso(rng, 60, 440, 16, false, 'v2')];
  const espSM = new Espaco();
  for (const g of glandulas) for (const [x, y] of g.acinos) espSM.marcar(x, y, 19);
  for (const [x, y, r] of [[460, 420, 15], [515, 432, 22], [905, 380, 11], [60, 440, 16]] as const) espSM.marcar(x, y, r + 2);
  const fibrasSM = Array.from({ length: 26 }, () => {
    const y = entre(rng, yMM1 + 6, yME0 - 6);
    const x = entre(rng, -60, W);
    return `M${q(x)} ${q(y)}q${q(entre(rng, 25, 40))} ${q(entre(rng, -10, 10))} ${q(entre(rng, 60, 90))} 0t${q(entre(rng, 60, 90))} 0`;
  }).join('');

  // --- muscular externa: circular interna (cortada ao comprido), longitudinal externa (de través)
  const ganglios: [number, number, number, number, number][] = [
    [190, 605, 40, 15, 3],
    [520, 605, 48, 16, 4],
    [850, 606, 36, 14, 3],
  ];
  const noGanglio = (x: number, y: number, m: number) => ganglios.some(([gx, gy, rx, ry]) => ((x - gx) / (rx + m)) ** 2 + ((y - gy) / (ry + m)) ** 2 < 1);
  const circular = lisoLongitudinal(rng, yME0, ySepto0, (x, y) => noGanglio(x, y, 4));
  const longit = lisoTransversal(rng, ySepto1, H + 6, (x, y) => noGanglio(x, y, 3) || entreFeixes(x * 0.7 + 40), 8);
  const nervos = `M-10 605C80 600 120 607 150 605M230 605C300 603 420 609 472 605M568 605C650 602 760 609 814 606M886 606C930 604 980 607 1010 605`;

  return (
    <>
      <rect width={W} height={H} fill={HE.luz} />
      <E id="lamina-propria">
        <path d={`M-10 150H${W + 10}V${yMM0 + 2}H-10Z`} fill={HE.colagenoClaro} />
        <Deco>
          <path d={lin([[0, 262], [120, 258], [260, 266], [400, 260], [560, 268], [700, 259], [860, 266], [1000, 260]])} stroke="#eab3cc" strokeWidth={3} fill="none" />
        </Deco>
        {celulasConjuntivo(rng, 70, [0, 150, W, yMM0], dentroLP, espLP, 0.55)}
        {capilares}
      </E>
      <E id="epitelio-estratificado-pavimentoso">
        <path d={epitelio} fill="#efc0d6" />
        <path d={profCel} fill="#e9a7c5" stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={medCel} fill="#f2c6da" stroke="#dc93b5" strokeWidth={0.8} />
        <path d={supCel} fill="#f6d6e5" stroke="#d98fb2" strokeWidth={0.8} />
        <path d={basCel} fill="#c98ab7" stroke="#a979b0" strokeWidth={0.6} />
        <path d={medNuc} fill={HE.nucleo} />
        <path d={basNuc} stroke={HE.nucleoEscuro} strokeWidth={5} strokeLinecap="round" />
        <path d={supNuc} stroke={HE.nucleoEscuro} strokeWidth={2.4} strokeLinecap="round" />
      </E>
      <E id="muscular-da-mucosa">
        <path d={`M-10 ${yMM0}H${W + 10}V${yMM1}H-10Z`} fill={COR_LISO.fundo} />
        {mm.perfis.map((d, i) => (
          <path key={i} d={d} stroke={COR_LISO.fibra} strokeWidth={calibres(7.4)[i]} strokeLinecap="round" />
        ))}
        <path d={mm.nuc} stroke={HE.nucleo} strokeWidth={2.6} strokeLinecap="round" />
      </E>
      <E id="submucosa">
        <path d={`M-10 ${yMM1}H${W + 10}V${yME0}H-10Z`} fill={HE.colageno} />
        <Deco>
          <path d={fibrasSM} stroke="#df86ad" strokeWidth={4} fill="none" opacity={0.7} />
        </Deco>
        {celulasConjuntivo(rng, 34, [0, yMM1 + 6, W, yME0 - 6], () => true, espSM, 0.2)}
        {vasosSM}
      </E>
      <E id="glandula-esofagica">
        {glandulas.map((g, i) => (
          <Deco key={i}>
            <path d={elip(g.cx, g.cy, 84, 54)} fill="#f2c2d7" />
          </Deco>
        ))}
        <path d={acinoCel} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.1} />
        <path d={acinoLim} stroke="#c7bcdc" strokeWidth={0.8} />
        <path d={acinoLuz} fill={HE.luz} />
        <path d={acinoNuc} stroke={HE.nucleoEscuro} strokeWidth={2.4} strokeLinecap="round" />
        <Deco>
          <path d={lin(ducto.slice(0, 5))} stroke={HE.colagenoClaro} strokeWidth={27} strokeLinejoin="round" fill="none" />
        </Deco>
        <path d={lin(ducto)} stroke="#e8adc9" strokeWidth={21} strokeLinejoin="round" fill="none" />
        <path d={ductoBordas} stroke="#d58db0" strokeWidth={0.8} />
        <path d={lin(ducto)} stroke={HE.luz} strokeWidth={4.6} strokeLinejoin="round" strokeLinecap="round" fill="none" />
        <path d={pontos(ductoLum)} stroke={HE.nucleo} strokeWidth={3.6} strokeLinecap="round" />
        <path d={ductoBas} stroke={HE.nucleoEscuro} strokeWidth={2.2} strokeLinecap="round" />
        <path d={ductoNucA} stroke={HE.nucleoEscuro} strokeWidth={2.3} strokeLinecap="round" />
      </E>
      <E id="muscular-externa">
        <path d={`M-10 ${yME0}H${W + 10}V${H + 10}H-10Z`} fill={COR_LISO.fundo} />
        <path d={circular.cel} fill="#e08cb1" stroke={COR_LISO.borda} strokeWidth={0.5} />
        <path d={circular.nuc} stroke={HE.nucleo} strokeWidth={2.6} strokeLinecap="round" />
        <path d={`M-10 ${ySepto0}H${W + 10}V${ySepto1}H-10Z`} fill={HE.colagenoClaro} />
        {longit.perfis.map((d, i) => (
          <path key={i} d={d} stroke={COR_LISO.fibra} strokeWidth={calibres(8)[i]} strokeLinecap="round" />
        ))}
        <path d={longit.nuc} stroke={HE.nucleo} strokeWidth={2.7} strokeLinecap="round" />
      </E>
      <E id="plexo-mioenterico">
        <path d={nervos} stroke="#f0cfe0" strokeWidth={6} fill="none" />
        {ganglios.map(([x, y, rx, ry, n], i) => ganglio(rng, x, y, rx, ry, n, `g${i}`))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_ESTOMAGO = ['fosseta-gastrica', 'celula-mucosa-superficial', 'celula-mucosa-do-colo', 'celula-parietal', 'celula-principal', 'glandula-fundica', 'lamina-propria', 'muscular-da-mucosa', 'submucosa'];
/**
 * Estômago, região fúndica (fundo/corpo): mucosa com fossetas rasas (≈ 1/4 da espessura) e glândulas fúndicas
 * longas e retas. Esquema: no órgão, várias glândulas desembocam em cada fosseta; aqui, no plano de corte, uma
 * glândula continua cada fosseta e as vizinhas aparecem sem a fosseta (cortadas fora do plano dela).
 */
export function LaminaEstomago(rng: Rng) {
  const yS = 30; // superfície
  const yPit = 162; // fundo das fossetas
  const yMM0 = 550;
  const yMM1 = 588;
  const R = 11; // raio do "ombro" entre a superfície e a boca da fosseta
  // fosseta em funil: boca larga (≈ 28 un), afinando até ≈ 9 un no fundo
  const lwPit = (y: number) => 4.5 + 9.5 * (1 - Math.min(1, Math.max(0, (y - yS - R) / (yPit - yS - R)))) ** 1.6;
  const lG = 3.4; // meia-largura da luz da glândula
  const lwGl = (y: number, yb: number) => (y > yb - 40 ? lG + (1.4 * (y - yb + 40)) / 40 : lG); // base um pouco dilatada
  const yN = yPit + 40; // fim do colo inclinado: daí para baixo a glândula é reta
  const yC = yPit + 6; // topo da crista entre as duas glândulas que se abrem na mesma fosseta
  const rC = 10; // raio da crista (as células ali são baixas, para não se cruzarem)
  // fossetas próximas (a cada 104 un), cada uma com duas glândulas: eixo de lâmina própria entre fossetas ≈ 34 un
  const PF = 104;
  const fossetas = Array.from({ length: 10 }, (_, k) => 52 + PF * k + entre(rng, -3, 3));
  const glandulas = fossetas.flatMap((x) => [
    { x: x - 26 + entre(rng, -1.5, 1.5), fosseta: x, lado: -1, fundo: entre(rng, 524, 538) },
    { x: x + 26 + entre(rng, -1.5, 1.5), fosseta: x, lado: 1, fundo: entre(rng, 524, 538) },
  ]);
  /** Topo da crista entre duas fossetas: levemente arqueado (crista estreita e arredondada, não um platô). */
  const topoCrista = (x0: number, x1: number): P[] => {
    const n = Math.max(2, Math.round((x1 - x0) / 5));
    return Array.from({ length: n + 1 }, (_, i): P => [x0 + ((x1 - x0) * i) / n, yS - 7 * Math.sin((Math.PI * i) / n)]);
  };
  const passos = (a: P, b: P, n: number) => Array.from({ length: n }, (_, i): P => [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n]);
  /** Luz de uma glândula do topo do colo (junto à fosseta) até o fundo, como contorno no sentido da luz à esquerda. */
  const paredeGlandula = (g: (typeof glandulas)[number]) => {
    const px = g.fosseta;
    const esq: P[] = g.lado < 0 ? passos([px - lwPit(yPit), yPit], [g.x - lG, yN], 9) : passos([px + rC, yC + rC], [g.x - lG, yN], 6);
    for (let y = yN + 4; y < g.fundo; y += 4) esq.push([g.x - lwGl(y, g.fundo), y]);
    const fundo = arco(g.x, g.fundo, 4.8, 180, 0, 8);
    const dir: P[] = [];
    for (let y = g.fundo - 4; y > yN; y -= 4) dir.push([g.x + lwGl(y, g.fundo), y]);
    dir.push(...(g.lado < 0 ? passos([g.x + lG, yN], [px - rC, yC + rC], 6) : passos([g.x + lG, yN], [px + lwPit(yPit), yPit], 9)));
    return [...esq, ...fundo, ...dir];
  };

  // contorno apical contínuo: superfície → fosseta → glândula esquerda → crista → glândula direita → fosseta → superfície
  const cont: P[] = [];
  let xAnterior = -60;
  for (let k = 0; k < fossetas.length; k++) {
    const px = fossetas[k];
    const l0 = lwPit(yS + R);
    cont.push(...topoCrista(xAnterior, px - l0 - R).slice(0, -1));
    cont.push(...arco(px - l0 - R, yS + R, R, -90, 0, 6));
    for (let y = yS + R + 4; y <= yPit; y += 4) cont.push([px - lwPit(y), y]);
    cont.push(...paredeGlandula(glandulas[2 * k]));
    cont.push(...arco(px, yC + rC, rC, 180, 360, 8));
    cont.push(...paredeGlandula(glandulas[2 * k + 1]));
    for (let y = yPit - 4; y > yS + R; y -= 4) cont.push([px + lwPit(y), y]);
    cont.push(...arco(px + l0 + R, yS + R, R, 180, 270, 6));
    xAnterior = px + l0 + R;
  }
  cont.push(...topoCrista(xAnterior, W + 60));

  // tipo de célula pela profundidade: superfície/fosseta → colo → metade superior → base
  const escolher = (a: { x: number; y: number }) => {
    const y = a.y;
    if (y < yPit + 2) return { tipo: 'sup', n: 2, prof: 21 };
    const r = rng();
    // na crista as células convergem: só células mucosas do colo, mais baixas
    if (fossetas.some((px) => Math.hypot(a.x - px, y - yC - rC) < rC + 3)) return { tipo: 'colo', n: 2, prof: 9 };
    // logo abaixo da crista, o septo entre os dois colos é estreito: a altura das células não passa da metade
    // da largura dele (senão as células dos dois lados se sobreporiam)
    const px = fossetas.reduce((m, f) => (Math.abs(f - a.x) < Math.abs(m - a.x) ? f : m));
    if (y < yN + 2 && Math.abs(a.x - px) < 23) return { tipo: 'colo', n: 2, prof: Math.max(6, Math.min(16, Math.abs(a.x - px) - 1.5)) };
    const parietal = { tipo: 'parietal', n: 4, prof: 17, bojo: 4 };
    if (y < 228) return r < 0.6 ? { tipo: 'colo', n: 2, prof: 16 } : parietal;
    // metade superior: parietais, com algumas mucosas do colo; as principais só aparecem mais abaixo
    if (y < 300) return r < 0.8 ? parietal : { tipo: 'colo', n: 2, prof: 16 };
    const g = glandulas.reduce((m, gl) => (Math.abs(gl.x - a.x) < Math.abs(m.x - a.x) ? gl : m));
    // na base, poucas parietais espalhadas; no fundo curvo, só principais (uma parietal ali ficaria deformada)
    const pPar = y < 440 ? 0.65 - (0.3 * (y - 300)) / 140 : y < g.fundo - 24 ? 0.15 : 0;
    return r < pPar ? parietal : { tipo: 'principal', n: 2, prof: 15 };
  };
  const celulas = celulasNoContorno(reamostrar(cont, 5), escolher);

  const esp = new Espaco();
  const espNuc = new Espaco();
  const d = { sup: '', supApice: '', supNuc: '', colo: '', coloNuc: '', parietal: '', parietalNuc: '', principal: '', principalApice: '', principalNuc: '' };
  for (const c of celulas) {
    const [cx, cy] = naCelula(c, 0.5);
    esp.marcar(cx, cy, c.tipo === 'parietal' ? 13 : 10);
    if (c.tipo === 'sup') {
      d.sup += pg(c.poli);
      d.supApice += pg(apice(c, 0.55));
      const [x, y] = naCelula(c, 0.78);
      // nos ombros a superfície é convexa e as bases convergem: núcleo só onde couber (o resto fica fora do plano)
      if (espNuc.tentar(x, y, 3.2)) d.supNuc += seg(x, y, 4, Math.atan2(c.ny, c.nx));
    } else if (c.tipo === 'colo') {
      d.colo += pg(c.poli);
      // núcleo ovoide na base da célula
      const [x, y] = naCelula(c, 0.78);
      if (c.prof > 10 && espNuc.tentar(x, y, 3)) d.coloNuc += seg(x, y, 1.6, Math.atan2(c.ny, c.nx));
    } else if (c.tipo === 'parietal') {
      d.parietal += pg(c.poli);
      const [x, y] = naCelula(c, 0.5);
      if (!espNuc.tentar(x, y, 4.6)) continue;
      if (rng() < 0.14) {
        const [x1, y1] = naCelula(c, 0.5, -4.6);
        const [x2, y2] = naCelula(c, 0.5, 4.6);
        d.parietalNuc += circ(x1, y1, 3.5) + circ(x2, y2, 3.5);
      } else d.parietalNuc += circ(x, y, 4.3);
    } else {
      d.principal += pg(c.poli);
      d.principalApice += pg(apice(c, 0.42));
      const [x, y] = naCelula(c, 0.76);
      if (espNuc.tentar(x, y, 3.6)) d.principalNuc += circ(x, y, 3.5);
    }
  }
  // luz das fossetas (até o fundo delas) e das glândulas (do colo ao fundo)
  let luzFosseta = '';
  let luzGlandula = '';
  for (const px of fossetas) {
    const l0 = lwPit(yS + R);
    const esq: P[] = [...arco(px - l0 - R, yS + R, R, -90, 0, 10)];
    const dir: P[] = [];
    for (let y = yS + R + 4; y <= yPit; y += 4) {
      esq.push([px - lwPit(y), y]);
      dir.unshift([px + lwPit(y), y]);
    }
    luzFosseta += pg([...esq, [px, yPit + 4], ...dir, ...arco(px + l0 + R, yS + R, R, 180, 270, 10)]);
  }
  // eixo de cada glândula, do fundo da fosseta ao fundo da glândula: área de toque transparente sobre a luz estreita
  // (≈ 7 un). Só da largura da luz: as células da parede são partes da glândula (`contem`), então um toque nelas já
  // vale quando o alvo é a glândula, e uma faixa mais larga tiraria delas o ápice quando o alvo é a célula
  let eixos = '';
  for (const g of glandulas) eixos += lin([[g.fosseta + g.lado * 3, yPit + 2], [g.x, yN], [g.x, g.fundo + 2]]);
  for (const g of glandulas) {
    const fecho: P[] = g.lado < 0 ? [[g.fosseta, yC], [g.fosseta, yPit]] : [[g.fosseta, yPit], [g.fosseta, yC]];
    luzGlandula += pg([...(g.lado < 0 ? [] : fecho), ...paredeGlandula(g), ...(g.lado < 0 ? fecho : [])]);
  }

  // lâmina própria: conjuntivo frouxo entre fossetas e glândulas (linfócitos, plasmócitos, capilares)
  const espLP = new Espaco();
  let capLP = '';
  let hemLP = '';
  for (let k = 0; k < 400 && capLP.length < 1600; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, yS + 30, yMM0 - 6);
    if (!esp.livre(x, y, 8) || !espLP.tentar(x, y, 9)) continue;
    capLP += elip(x, y, 5, 3.4, entre(rng, -0.5, 0.5));
    hemLP += pt(x, y);
  }
  const mmCirc = lisoLongitudinal(rng, yMM0, yMM0 + 19);
  const mmLong = lisoTransversal(rng, yMM0 + 19, yMM1, () => false, 7);
  const fibrasSM = Array.from({ length: 16 }, () => {
    const y = entre(rng, yMM1 + 8, H - 4);
    const x = entre(rng, -60, W);
    return `M${q(x)} ${q(y)}q${q(entre(rng, 25, 40))} ${q(entre(rng, -10, 10))} ${q(entre(rng, 60, 90))} 0t${q(entre(rng, 60, 90))} 0`;
  }).join('');
  const vasosSM: [number, number, number, boolean][] = [[300, 640, 14, true], [352, 648, 21, false], [760, 632, 10, true], [800, 650, 17, false]];
  const espSM = new Espaco();
  for (const [x, y, r] of vasosSM) espSM.marcar(x, y, r + 3);
  const adipos: P[] = [[560, 660], [598, 668], [575, 698], [80, 676], [120, 690]];
  for (const [x, y] of adipos) espSM.marcar(x, y, 22);

  return (
    <>
      <rect width={W} height={H} fill={HE.luz} />
      <Deco>
        {/* camada de muco sobre a superfície */}
        <path d={`M-10 ${yS - 14}H${W + 10}V${yS + 2}H-10Z`} fill="#efe7f1" />
      </Deco>
      <E id="lamina-propria">
        <path d={pg([...cont, [W + 60, yMM0 + 2], [-30, yMM0 + 2]])} fill={HE.colagenoClaro} />
        <Deco>
          <path d={capLP} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1.1} />
          <path d={hemLP} stroke={HE.hemacia} strokeWidth={4.4} strokeLinecap="round" />
        </Deco>
        {celulasConjuntivo(rng, 150, [0, yS + 26, W, yMM0 - 4], (x, y) => esp.livre(x, y, 4), espLP, 0.7)}
      </E>
      <E id="fosseta-gastrica">
        <path d={luzFosseta} fill="#f7f1f6" />
      </E>
      <E id="glandula-fundica">
        <path d={luzGlandula} fill="#fbf5f9" stroke="#e2bcd0" strokeWidth={0.6} />
      </E>
      <E id="celula-mucosa-superficial">
        <path d={d.sup} fill="#e7a2c2" stroke="#cf86aa" strokeWidth={0.7} />
        <path d={d.supApice} fill="#f3e9f2" stroke="#ddc6db" strokeWidth={0.5} />
        <path d={d.supNuc} stroke={HE.nucleo} strokeWidth={4.2} strokeLinecap="round" />
      </E>
      <E id="celula-mucosa-do-colo">
        <path d={d.colo} fill="#e5d8ea" stroke="#bfa8cf" strokeWidth={0.7} />
        <path d={d.coloNuc} stroke={HE.nucleoEscuro} strokeWidth={4.4} strokeLinecap="round" />
      </E>
      <E id="celula-principal">
        <path d={d.principal} fill="#9f88cd" stroke="#8068b6" strokeWidth={0.7} />
        <path d={d.principalApice} fill="#c4b3e1" />
        <path d={d.principalNuc} fill={HE.nucleoEscuro} />
      </E>
      <E id="celula-parietal">
        <path d={d.parietal} fill="#f294b8" stroke="#c8578a" strokeWidth={0.8} />
        <path d={d.parietalNuc} fill={HE.nucleo} />
      </E>
      <E id="glandula-fundica">
        <path d={eixos} stroke="transparent" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </E>
      <E id="muscular-da-mucosa">
        <path d={`M-10 ${yMM0}H${W + 10}V${yMM1}H-10Z`} fill={COR_LISO.fundo} />
        <path d={mmCirc.cel} fill="#e08cb1" stroke={COR_LISO.borda} strokeWidth={0.5} />
        <path d={mmCirc.nuc} stroke={HE.nucleo} strokeWidth={2.6} strokeLinecap="round" />
        {mmLong.perfis.map((p, i) => (
          <path key={i} d={p} stroke={COR_LISO.fibra} strokeWidth={calibres(7)[i]} strokeLinecap="round" />
        ))}
        <path d={mmLong.nuc} stroke={HE.nucleo} strokeWidth={2.5} strokeLinecap="round" />
      </E>
      <E id="submucosa">
        <path d={`M-10 ${yMM1}H${W + 10}V${H + 10}H-10Z`} fill={HE.colageno} />
        <Deco>
          <path d={fibrasSM} stroke="#df86ad" strokeWidth={4} fill="none" opacity={0.7} />
          <path d={adipos.map(([x, y]) => circ(x, y, 20)).join('')} fill="#fbf4f8" stroke="#d98fb2" strokeWidth={1.4} />
        </Deco>
        {celulasConjuntivo(rng, 26, [0, yMM1 + 6, W, H - 4], () => true, espSM, 0.2)}
        {vasosSM.map(([x, y, r, a], i) => vaso(rng, x, y, r, a, `s${i}`))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Faixa de epitélio simples entre dois contornos com os mesmos vértices-chave (apical e basal): cada trecho é dividido
// em n células, e o ponto basal de cada limite fica na mesma fração do trecho basal que o apical no trecho apical.
// Assim as células ladrilham a faixa sem vãos nem sobreposição, inclusive onde convergem (boca da cripta) ou se
// abrem em leque (fundo da cripta).
function comprimento(l: P[]) {
  let s = 0;
  for (let i = 1; i < l.length; i++) s += Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]);
  return s;
}
/** Ponto na fração f (0–1) do comprimento de uma polilinha. */
function noPercurso(l: P[], f: number): P {
  const total = comprimento(l);
  if (!total) return l[0];
  let alvo = f * total;
  for (let i = 1; i < l.length; i++) {
    const s = Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]);
    if (alvo <= s || i === l.length - 1) {
      const t = s ? Math.min(1, alvo / s) : 0;
      return [l[i - 1][0] + (l[i][0] - l[i - 1][0]) * t, l[i - 1][1] + (l[i][1] - l[i - 1][1]) * t];
    }
    alvo -= s;
  }
  return l[l.length - 1];
}
/** Trecho de uma polilinha entre as frações f0 e f1, com os vértices internos. */
function trechoDe(l: P[], f0: number, f1: number): P[] {
  const total = comprimento(l);
  const out: P[] = [noPercurso(l, f0)];
  let s = 0;
  for (let i = 1; i < l.length - 1; i++) {
    s += Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]);
    if (total && s / total > f0 && s / total < f1) out.push(l[i]);
  }
  out.push(noPercurso(l, f1));
  return out;
}
type Trecho = { ap: P[]; ba: P[]; zona: string };
type CelulaFaixa = { poli: P[]; a0: P; a1: P; b0: P; b1: P; zona: string };
function celulasEmFaixa(trechos: Trecho[], largura: number) {
  const cel: CelulaFaixa[] = [];
  for (const t of trechos) {
    // nos leques (fundo da cripta, anéis) conta a linha média, senão as poucas células ficariam largas demais na base
    const n = Math.max(1, Math.round(Math.max(comprimento(t.ap), (comprimento(t.ap) + comprimento(t.ba)) / 2) / largura));
    for (let j = 0; j < n; j++) {
      const ap = trechoDe(t.ap, j / n, (j + 1) / n);
      const ba = trechoDe(t.ba, j / n, (j + 1) / n);
      cel.push({ poli: [...ap, ...ba.reverse()], a0: ap[0], a1: ap[ap.length - 1], b0: ba[ba.length - 1], b1: ba[0], zona: t.zona });
    }
  }
  return cel;
}
/** Ponto no eixo da célula da faixa: v = fração da altura (0 = ápice). */
const noEixo = (c: CelulaFaixa, v: number): P => {
  const ax = (c.a0[0] + c.a1[0]) / 2;
  const ay = (c.a0[1] + c.a1[1]) / 2;
  const bx = (c.b0[0] + c.b1[0]) / 2;
  const by = (c.b0[1] + c.b1[1]) / 2;
  return [ax + (bx - ax) * v, ay + (by - ay) * v];
};

export const PARTES_COLON = ['epitelio-simples-cilindrico', 'cripta-intestinal', 'celula-caliciforme', 'lamina-propria', 'muscular-da-mucosa', 'submucosa', 'muscular-externa', 'plexo-mioenterico'];
/**
 * Intestino grosso (cólon), corte transversal da parede, luz em cima. Mucosa sem vilosidades: superfície plana e
 * contínua entre as bocas das criptas; criptas retas, muito próximas (pouca lâmina própria entre elas), de fundo em
 * "U", com caliciformes. Num trecho perto da muscular da mucosa as criptas aparecem cortadas de través (anéis),
 * como acontece quando o corte pega o fundo delas obliquamente. Muscular externa: circular interna, plexo
 * mioentérico e longitudinal externa delgada, espessada numa tênia do cólon; abaixo, a serosa.
 */
export function LaminaColon(rng: Rng) {
  const yS = 24; // superfície (plana)
  const yMM0 = 306;
  const yMM1 = 324;
  const yME0 = 436;
  const ySepto0 = 590;
  const ySepto1 = 604;
  const P = 50; // passo das criptas
  const lw = 4.5; // meia-largura da luz da cripta (luz de 9 un, com muco)
  const R = 4.5; // só arredonda a boca da cripta
  const dS = 13; // altura das células da superfície e da boca
  const dC = 16.5; // altura das células da cripta (≈ 2× a largura)
  // altura da parede: um pouco menor junto à boca, onde a lâmina própria entre as criptas se alarga sob a superfície
  const dParede = (y: number) => dS + (dC - dS) * Math.min(1, Math.max(0, (y - yS - dS) / 36));
  const rosetaX = [640, 690, 740, 790];
  const rosetaY = 263;
  const rR = lw + dC; // raio externo do anel de células
  const criptas = Array.from({ length: 21 }, (_, k) => {
    const x = 15 + P * k + entre(rng, -1.5, 1.5);
    // sobre as criptas cortadas de través (anéis), as longitudinais saem do plano de corte logo acima deles: o perfil
    // termina aberto, cortado reto, sem o fundo em U (um U fechado tão alto leria como cripta encurtada, sinal de
    // colite crônica)
    const aberta = x > 600 && x < 810;
    return { x, aberta, fundo: aberta ? 226 + (entre(rng, 196, 204) - 200) * 0.5 : entre(rng, 272, 283) };
  });

  // contornos apical (luz) e basal (lâmina própria), trecho a trecho
  const trechos: Trecho[] = [];
  const cont: P[] = [[-60, yS]];
  let basalAnterior: P = [-60, yS + dS];
  let apicalAnterior: P = [-60, yS];
  for (const c of criptas) {
    const mE: P = [c.x - lw - dS, yS + dS]; // canto basal (onde a superfície e a parede se encontram)
    const mD: P = [c.x + lw + dS, yS + dS];
    const ombroE = arco(c.x - lw - R, yS + R, R, -90, 0, 4);
    const ombroD = arco(c.x + lw + R, yS + R, R, 180, 270, 4);
    // superfície entre a cripta anterior e esta
    trechos.push({ ap: [apicalAnterior, ombroE[0]], ba: [basalAnterior, mE], zona: 'sup' });
    trechos.push({ ap: ombroE, ba: [mE, mE], zona: 'sup' });
    const apE: P[] = [];
    const baE: P[] = [];
    for (let y = yS + R; y <= c.fundo; y += 6) apE.push([c.x - lw, y]);
    for (let y = yS + dS; y <= c.fundo; y += 6) baE.push([c.x - lw - dParede(y), y]);
    apE.push([c.x - lw, c.fundo]);
    baE.push([c.x - lw - dC, c.fundo]);
    trechos.push({ ap: apE, ba: baE, zona: 'cri' });
    if (!c.aberta) trechos.push({ ap: arco(c.x, c.fundo, lw, 180, 0, 12), ba: arco(c.x, c.fundo, lw + dC, 180, 0, 12), zona: 'fundo' });
    trechos.push({ ap: [...apE].reverse().map(([x, y]): P => [2 * c.x - x, y]), ba: [...baE].reverse().map(([x, y]): P => [2 * c.x - x, y]), zona: 'cri' });
    trechos.push({ ap: ombroD, ba: [mD, mD], zona: 'sup' });
    // perfil aberto: a lâmina própria começa logo abaixo do corte reto das paredes e da luz
    const fim: P[] = c.aberta ? [[c.x - lw, c.fundo], [c.x + lw, c.fundo]] : arco(c.x, c.fundo, lw, 180, 0, 12);
    cont.push(...ombroE, ...apE, ...fim, ...[...apE].reverse().map(([x, y]): P => [2 * c.x - x, y]), ...ombroD);
    apicalAnterior = ombroD[ombroD.length - 1];
    basalAnterior = mD;
  }
  trechos.push({ ap: [apicalAnterior, [W + 60, yS]], ba: [basalAnterior, [W + 60, yS + dS]], zona: 'sup' });
  cont.push([W + 60, yS]);
  // criptas cortadas de través: anel de células em volta de uma luz central
  for (const x of rosetaX)
    trechos.push({ ap: arco(x, rosetaY, lw, 0, 360, 24), ba: arco(x, rosetaY, rR, 0, 360, 24), zona: 'anel' });

  const celulas = celulasEmFaixa(trechos, 8.6);
  // caliciformes: poucas na superfície (predominam as absortivas), cerca de 1 em 3 nas criptas, mais no fundo;
  // no "U" do fundo ficam células-tronco e absortivas jovens (sem teca)
  const pCal = (c: CelulaFaixa) => (c.zona === 'sup' ? 0.16 : c.zona === 'fundo' ? 0 : c.zona === 'anel' ? 0.38 : (c.a0[1] + c.a1[1]) / 2 > 150 ? 0.38 : 0.3);
  const espNuc = new Espaco();
  const d = { sup: '', supNuc: '', borda: '', cri: '', criNuc: '', cal: '', calTeca: '', calNuc: '', baseSup: '', baseCri: '' };
  for (const c of celulas) {
    // base invisível com o contorno de todas as células (caliciformes incluídas) da superfície e das criptas: fica sob
    // as caliciformes e diz ao jogo se a caliciforme tocada é da superfície ou da cripta (ver `contem` no registro)
    if (c.zona === 'sup') d.baseSup += pg(c.poli);
    else d.baseCri += pg(c.poli);
    const wA = Math.hypot(c.a1[0] - c.a0[0], c.a1[1] - c.a0[1]);
    const wB = Math.hypot(c.b1[0] - c.b0[0], c.b1[1] - c.b0[1]);
    const [ax, ay] = noEixo(c, 0);
    const [bx, by] = noEixo(c, 1);
    const h = Math.hypot(bx - ax, by - ay);
    const eixo = Math.atan2(by - ay, bx - ax);
    if (h < 4) continue;
    const caliciforme = wA > 3 && rng() < pCal(c);
    if (caliciforme) {
      d.cal += pg(c.poli);
      // teca dentro da célula: não passa da superfície apical nem das paredes laterais
      const w = wA * 0.64 + wB * 0.36;
      const [tx, ty] = noEixo(c, 0.38);
      d.calTeca += elip(tx, ty, Math.min(0.3 * h, 0.38 * h - 0.9), Math.max(1.2, Math.min(4.4, w / 2 - 0.9)), eixo);
      const [x, y] = noEixo(c, 0.86);
      if (espNuc.tentar(x, y, 2.4)) d.calNuc += seg(x, y, 2.6, eixo + Math.PI / 2);
      continue;
    }
    // na superfície as células convergem para a lâmina própria estreita: núcleo mais curto, para o leque não lembrar
    // a ponta de uma vilosidade
    const [x, y] = noEixo(c, c.zona === 'sup' ? 0.6 : 0.66);
    const nuc = espNuc.tentar(x, y, 2.6) ? seg(x, y, c.zona === 'sup' ? 2.4 : 4.6, eixo) : '';
    if (c.zona === 'sup') {
      d.sup += pg(c.poli);
      d.supNuc += nuc;
      // planura estriada fina, só no topo plano das células absortivas da superfície
      if (Math.abs(c.a0[1] - yS) < 0.5 && Math.abs(c.a1[1] - yS) < 0.5) d.borda += lin([[c.a0[0] + 0.4, yS + 0.7], [c.a1[0] - 0.4, yS + 0.7]]);
    } else {
      d.cri += pg(c.poli);
      d.criNuc += nuc;
    }
  }
  let luzCripta = '';
  for (const c of criptas) {
    const ap: P[] = [];
    for (let y = yS + R; y <= c.fundo; y += 6) ap.push([c.x - lw, y]);
    const fim: P[] = c.aberta ? [[c.x - lw, c.fundo], [c.x + lw, c.fundo]] : arco(c.x, c.fundo, lw, 180, 0, 12);
    luzCripta += pg([[c.x - lw - R, yS - 0.5], ...arco(c.x - lw - R, yS + R, R, -90, 0, 4), ...ap, ...fim, ...[...ap].reverse().map(([x, y]): P => [2 * c.x - x, y]), ...arco(c.x + lw + R, yS + R, R, 180, 270, 4), [c.x + lw + R, yS - 0.5]]);
  }
  luzCripta += rosetaX.map((x) => circ(x, rosetaY, lw)).join('');

  // lâmina própria: colunas estreitas entre as criptas, faixa sob o fundo delas e em volta dos anéis
  const naLP = (x: number, y: number, m: number) => {
    if (y < yS + dS + m || y > yMM0 - m) return false;
    if (rosetaX.some((rx) => Math.hypot(x - rx, y - rosetaY) < rR + m)) return false;
    for (const c of criptas) {
      if (Math.abs(x - c.x) > P) continue;
      if (y <= c.fundo ? Math.abs(x - c.x) < lw + dParede(y) + m : !c.aberta && Math.hypot(x - c.x, y - c.fundo) < lw + dC + m) return false;
      if (c.aberta && y > c.fundo && y < c.fundo + m && Math.abs(x - c.x) < lw + dC + m) return false;
    }
    return true;
  };
  const espLP = new Espaco();
  let capLP = '';
  let hemLP = '';
  for (let k = 0; k < 900 && capLP.length < 1400; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, yS + 30, yMM0 - 6);
    if (!naLP(x, y, 4.4) || !espLP.tentar(x, y, 5.5)) continue;
    capLP += elip(x, y, 2.8, 4.2, Math.PI / 2);
    hemLP += pt(x, y);
  }
  const mm = lisoLongitudinal(rng, yMM0, yMM1);
  const espSM = new Espaco();
  const vasosSM: [number, number, number, boolean][] = [[180, 372, 13, true], [226, 384, 20, false], [640, 392, 11, true], [676, 380, 16, false], [930, 366, 12, true]];
  for (const [x, y, r] of vasosSM) espSM.marcar(x, y, r + 3);
  const adipos: P[] = [[420, 380], [455, 395], [432, 418], [470, 360], [800, 405], [836, 412]];
  for (const [x, y] of adipos) espSM.marcar(x, y, 21);
  const fibrasSM = Array.from({ length: 18 }, () => {
    const y = entre(rng, yMM1 + 8, yME0 - 8);
    const x = entre(rng, -60, W);
    return `M${q(x)} ${q(y)}q${q(entre(rng, 25, 40))} ${q(entre(rng, -10, 10))} ${q(entre(rng, 60, 90))} 0t${q(entre(rng, 60, 90))} 0`;
  }).join('');

  // muscular externa: circular interna; longitudinal externa delgada (≈ 18 un), espessada numa tênia do cólon
  const tenia = (x: number) => {
    const u = (x - 700) / 150;
    return Math.abs(u) < 1 ? Math.cos((u * Math.PI) / 2) ** 2 : 0;
  };
  const yLong = (x: number) => ySepto1 + 18 + 88 * tenia(x); // limite externo da longitudinal
  const ySerosa = (x: number) => yLong(x) + 8 + 52 * (1 - tenia(x)); // superfície serosa (mesotélio)
  const ganglios: [number, number, number, number, number][] = [
    [140, 597, 44, 15, 3],
    [430, 597, 50, 16, 4],
    [760, 598, 40, 14, 3],
  ];
  const noGanglio = (x: number, y: number, m: number) => ganglios.some(([gx, gy, rx, ry]) => ((x - gx) / (rx + m)) ** 2 + ((y - gy) / (ry + m)) ** 2 < 1);
  const circular = lisoLongitudinal(rng, yME0, ySepto0, (x, y) => noGanglio(x, y, 4));
  const cortes = [-10];
  while (cortes[cortes.length - 1] < W) cortes.push(cortes[cortes.length - 1] + entre(rng, 70, 110));
  const longit = lisoTransversal(rng, ySepto1, H + 14, (x, y) => y > yLong(x) - 2 || noGanglio(x, y, 3) || cortes.some((c) => Math.abs(x - c) < 2.5), 8);
  const nervos = `M-10 597C40 593 80 599 96 597M184 597C260 594 330 601 380 596M480 596C580 593 680 601 720 598M800 598C880 595 960 600 1010 597`;
  const xs = Array.from({ length: 53 }, (_, k) => -20 + k * 20);
  const contornoLong = xs.map((x): P => [x, yLong(x)]);
  const contornoSerosa = xs.map((x): P => [x, ySerosa(x)]);
  let mesotelio = '';
  for (let x = 4; x < W; x += 13) if (ySerosa(x) < H - 2) mesotelio += seg(x, ySerosa(x) - 1.4, 5, Math.atan2(ySerosa(x + 1) - ySerosa(x - 1), 2));
  const espSer = new Espaco();
  let serNuc = '';
  for (let k = 0; k < 120; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, ySepto1 + 20, H);
    if (y < yLong(x) + 5 || y > ySerosa(x) - 5 || !espSer.tentar(x, y, 6)) continue;
    serNuc += seg(x, y, 6, entre(rng, -0.4, 0.4));
  }

  return (
    <>
      <rect width={W} height={H} fill={HE.luz} />
      <E id="lamina-propria">
        <path d={pg([...cont, [W + 60, yMM0 + 2], [-60, yMM0 + 2]])} fill="#f3c0d6" />
        <Deco>
          <path d={capLP} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
          <path d={hemLP} stroke={HE.hemacia} strokeWidth={3.8} strokeLinecap="round" />
        </Deco>
        {celulasConjuntivo(rng, 520, [0, yS + 14, W, yMM0 - 2], (x, y) => naLP(x, y, 2.6), espLP, 0.8)}
      </E>
      <E id="cripta-intestinal">
        <path d={d.baseCri} fill="transparent" />
        {/* luz com muco */}
        <path d={luzCripta} fill="#e6dcee" />
        <path d={d.cri} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.criNuc} stroke={HE.nucleo} strokeWidth={3.4} strokeLinecap="round" />
      </E>
      <E id="epitelio-simples-cilindrico">
        <path d={d.baseSup} fill="transparent" />
        <path d={d.sup} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.supNuc} stroke={HE.nucleo} strokeWidth={3.4} strokeLinecap="round" />
        <path d={d.borda} stroke="#cf6a97" strokeWidth={1.4} fill="none" />
      </E>
      <E id="celula-caliciforme">
        <path d={d.cal} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.calTeca} fill={HE.muco} stroke="#b9acd3" strokeWidth={1} />
        <path d={d.calNuc} stroke={HE.nucleoEscuro} strokeWidth={2.8} strokeLinecap="round" />
      </E>
      <E id="muscular-da-mucosa">
        <path d={`M-10 ${yMM0}H${W + 10}V${yMM1}H-10Z`} fill={COR_LISO.fundo} />
        <path d={mm.cel} fill="#e08cb1" stroke={COR_LISO.borda} strokeWidth={0.5} />
        <path d={mm.nuc} stroke={HE.nucleo} strokeWidth={2.6} strokeLinecap="round" />
      </E>
      <E id="submucosa">
        <path d={`M-10 ${yMM1}H${W + 10}V${yME0}H-10Z`} fill={HE.colageno} />
        <Deco>
          <path d={fibrasSM} stroke="#df86ad" strokeWidth={4} fill="none" opacity={0.7} />
          <path d={adipos.map(([x, y]) => circ(x, y, 19)).join('')} fill="#fbf4f8" stroke="#d98fb2" strokeWidth={1.4} />
        </Deco>
        {celulasConjuntivo(rng, 26, [0, yMM1 + 6, W, yME0 - 6], () => true, espSM, 0.25)}
        {vasosSM.map(([x, y, r, a], i) => vaso(rng, x, y, r, a, `s${i}`))}
      </E>
      {/* serosa (subserosa e mesotélio) e cavidade peritoneal: fora das estruturas desta lâmina, sem toque */}
      <Deco>
        <path d={pg([...contornoLong, [W + 20, H + 20], [-20, H + 20]])} fill={HE.colagenoClaro} />
        <path d={pg([...contornoSerosa, [W + 20, H + 20], [-20, H + 20]])} fill={HE.luz} />
        <path d={lin(contornoSerosa)} stroke="#e7a3c3" strokeWidth={2.4} fill="none" />
        <path d={mesotelio} stroke={HE.nucleo} strokeWidth={1.8} strokeLinecap="round" />
        <path d={serNuc} stroke={HE.nucleo} strokeWidth={2.2} strokeLinecap="round" />
      </Deco>
      <E id="muscular-externa">
        <path d={pg([[-20, yME0], [W + 20, yME0], ...[...contornoLong].reverse()])} fill={COR_LISO.fundo} />
        <path d={circular.cel} fill="#e08cb1" stroke={COR_LISO.borda} strokeWidth={0.5} />
        <path d={circular.nuc} stroke={HE.nucleo} strokeWidth={2.6} strokeLinecap="round" />
        <path d={`M-10 ${ySepto0}H${W + 10}V${ySepto1}H-10Z`} fill={HE.colagenoClaro} />
        {longit.perfis.map((p, i) => (
          <path key={i} d={p} stroke={COR_LISO.fibra} strokeWidth={calibres(8)[i]} strokeLinecap="round" />
        ))}
        <path d={longit.nuc} stroke={HE.nucleo} strokeWidth={2.7} strokeLinecap="round" />
      </E>
      <E id="plexo-mioenterico">
        <path d={nervos} stroke="#f0cfe0" strokeWidth={6} fill="none" />
        {ganglios.map(([x, y, rx, ry, n], i) => ganglio(rng, x, y, rx, ry, n, `g${i}`))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_FIGADO = ['veia-centrolobular', 'placas-de-hepatocitos', 'sinusoide-hepatico', 'celula-de-kupffer', 'triade-portal', 'ramo-da-veia-porta', 'ramo-da-arteria-hepatica', 'ducto-biliar'];
/**
 * Fígado humano: um lóbulo clássico inteiro (hexágono com a veia centrolobular no centro e um espaço portal em cada
 * canto) e partes dos seis vizinhos. Sem septos entre os lóbulos (no ser humano o limite é imaginário, traçado entre
 * os espaços portais). Placas de uma célula de espessura, radiais, que se ramificam e se anastomosam, separadas por
 * sinusoides. Esquema: hepatócitos maiores que na escala real, logo menos células por raio de lóbulo.
 */
export function LaminaFigado(rng: Rng) {
  const C: P = [500, 350];
  const R = 280; // centro do lóbulo → canto (espaço portal)
  const D = R * Math.sqrt(3);
  const centros: P[] = [C, ...[30, 90, 150, 210, 270, 330].map((g): P => [C[0] + D * Math.cos((g * Math.PI) / 180), C[1] + D * Math.sin((g * Math.PI) / 180)])];
  const portais = [0, 60, 120, 180, 240, 300].map((g) => {
    const a = (g * Math.PI) / 180;
    return { x: C[0] + R * Math.cos(a), y: C[1] + R * Math.sin(a), giro: entre(rng, 0, 2 * Math.PI), f: entre(rng, 0, 6), r: entre(rng, 46, 54) };
  });
  const raioPortal = (p: (typeof portais)[number], a: number) => p.r + 7 * Math.sin(3 * a + p.f) + 3 * Math.sin(5 * a + 2 * p.f);
  const noPortal = (x: number, y: number, m: number) => portais.some((p) => Math.hypot(x - p.x, y - p.y) < raioPortal(p, Math.atan2(y - p.y, x - p.x)) + m);
  const apotema = R * Math.cos(Math.PI / 6);
  const rho = (a: number) => {
    let d = (((a - Math.PI / 6) % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3);
    if (d > Math.PI / 6) d -= Math.PI / 3;
    return apotema / Math.cos(d);
  };
  const rVC = 21;
  const ANEL = 14; // espessura da placa limitante (uma fileira de hepatócitos em volta do espaço porta)

  let celulas = '';
  let nucleos = '';
  let nucleolos = '';
  let hemacias = '';
  let endotelio = '';
  let kupffer = '';
  let kupfferNuc = '';
  const espN = new Espaco();
  const espS = new Espaco();
  for (const [cx, cy] of centros) {
    const em = (a: number, r: number): P => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    // placas como faixas angulares que partem da veia centrolobular e se dividem quando ficam largas demais;
    // b[j] = ângulo do limite esquerdo da placa j (a placa j vai de b[j] a b[j + 1]; b[n] = b[0] + 2π)
    const n0 = 7;
    const giro = entre(rng, 0, 2 * Math.PI);
    let b = Array.from({ length: n0 }, (_, k) => giro + (2 * Math.PI * (k + entre(rng, -0.12, 0.12))) / n0);
    for (let r = rVC + 2; r < R; ) {
      const h = entre(rng, 15, 18.5);
      const rm = r + h / 2;
      const nb: number[] = [];
      b.forEach((a0, j) => {
        const a1 = j < b.length - 1 ? b[j + 1] : b[0] + 2 * Math.PI;
        nb.push(a0);
        if ((a1 - a0) * rm > 36) nb.push(a0 + (a1 - a0) * entre(rng, 0.4, 0.6));
      });
      // os limites desviam um pouco a cada passo: sinusoides tortuosos, placas irregulares
      b = nb.map((a0) => a0 + entre(rng, -3, 3) / rm);
      // limite à direita de cada placa: sinusoide comum, ponte (anastomose entre placas) ou sinusoide com Kupffer
      const tipos = b.map(() => {
        const t = rng();
        return t < 0.2 ? 0 : t < 0.235 ? 2 : 1;
      });
      const largs = tipos.map((t) => (t === 0 ? 0 : t === 2 ? 12.5 : entre(rng, 5.5, 7.5)));
      b.forEach((a0, j) => {
        const a1 = j < b.length - 1 ? b[j + 1] : b[0] + 2 * Math.PI;
        const tD = tipos[j];
        const b0 = a0 + largs[(j - 1 + b.length) % b.length] / 2 / rm;
        const b1 = a1 - largs[j] / 2 / rm;
        const bm = (b0 + b1) / 2;
        const fora = (a: number) => Math.max(r, Math.min(r + h, rho(a)));
        const [mx, my] = em(bm, (r + fora(bm)) / 2);
        if (fora(bm) - r < 3 || mx < -25 || mx > W + 25 || my < -25 || my > H + 25 || noPortal(mx, my, ANEL + 2)) return;
        celulas += pg([em(b0, r), em(bm, r), em(b1, r), em(b1, fora(b1)), em(bm, fora(bm)), em(b0, fora(b0))]);
        const larguraArco = (b1 - b0) * rm;
        if (fora(bm) - r > 10 && larguraArco > 9 && !noPortal(mx, my, ANEL + 6)) {
          if (larguraArco > 19 && rng() < 0.12) {
            // hepatócito binucleado
            const [x1, y1] = em(bm - 4.3 / rm, (r + fora(bm)) / 2);
            const [x2, y2] = em(bm + 4.3 / rm, (r + fora(bm)) / 2);
            if (espN.tentar(x1, y1, 3.6) && espN.tentar(x2, y2, 3.6)) {
              nucleos += pt(x1, y1) + pt(x2, y2);
              nucleolos += pt(x1 + 0.5, y1) + pt(x2 + 0.5, y2);
            }
          } else if (espN.tentar(mx, my, 4.4)) {
            nucleos += pt(mx, my);
            nucleolos += pt(mx + 0.6, my - 0.4);
          }
        }
        // conteúdo do sinusoide à direita desta célula (só no trecho deste passo, onde a largura é a dele)
        if (tD === 0) return;
        const as = a1;
        if (tD === 2) {
          // célula de Kupffer: macrófago dentro do sinusoide (dilatado neste trecho), preso ao endotélio,
          // núcleo ovoide maior e mais claro que o endotelial; comprimento menor que o passo, para não invadir as placas
          const rs = r + h / 2;
          if (rs > rho(as) - h / 2) return;
          const [sx, sy] = em(as, rs);
          if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10 || noPortal(sx, sy, ANEL + 9)) return;
          // na luz, encostada num dos lados (no endotélio): sobra luz livre do outro lado
          const c = Math.min(7, h / 2 - 1.2);
          const lado = rng() < 0.5 ? -1 : 1;
          const kx = sx - Math.sin(as) * 1 * lado;
          const ky = sy + Math.cos(as) * 1 * lado;
          const contorno = Array.from({ length: 10 }, (_, i): P => {
            const t = (2 * Math.PI * i) / 10;
            const k = entre(rng, 0.82, 1);
            const u = Math.cos(t) * c * k;
            const v = Math.sin(t) * 5 * (i === 3 || i === 7 ? 1 : k);
            return [kx + Math.cos(as) * u - Math.sin(as) * v, ky + Math.sin(as) * u + Math.cos(as) * v];
          });
          kupffer += pg(contorno);
          kupfferNuc += elip(kx + Math.cos(as) * 0.8, ky + Math.sin(as) * 0.8, 3.3, 2.2, as);
          espS.marcar(sx, sy, c);
          return;
        }
        const rs = r + h * entre(rng, 0.3, 0.7);
        if (rs > rho(as) - 2) return;
        const [sx, sy] = em(as, rs);
        if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10 || noPortal(sx, sy, ANEL + 3)) return;
        const t = rng();
        if (t < 0.4 && espS.tentar(sx, sy, 3)) hemacias += pt(sx, sy);
        else if (t < 0.65) {
          const lado = rng() < 0.5 ? -1 : 1;
          const [ex, ey] = em(as + (lado * 2.1) / rs, rs);
          if (espS.tentar(ex, ey, 2.6)) endotelio += seg(ex, ey, 4.2, as);
        }
      });
      r += h;
    }
  }

  // placa limitante: fileira contínua de hepatócitos inteiros em volta de cada espaço porta, onde as placas
  // terminam; poucos sinusoides a atravessam (vindos dos ramos de distribuição)
  let limitante = '';
  let limNuc = '';
  let limNucleolo = '';
  for (const p of portais) {
    const raioMedio = p.r + ANEL / 2;
    const n = Math.round((2 * Math.PI * raioMedio) / 18);
    const giro = entre(rng, 0, 2 * Math.PI);
    const entradas = new Set([0, Math.round(n / 3) + 1, Math.round((2 * n) / 3)].map((k) => (k + Math.floor(entre(rng, 0, n))) % n));
    for (let k = 0; k < n; k++) {
      const a0 = giro + (2 * Math.PI * k) / n + (entradas.has(k) ? 2.6 / raioMedio : 0);
      const a1 = giro + (2 * Math.PI * (k + 1)) / n - (entradas.has((k + 1) % n) ? 2.6 / raioMedio : 0);
      const am = (a0 + a1) / 2;
      const em = (a: number, d: number): P => {
        const r = raioPortal(p, a) + d;
        return [p.x + Math.cos(a) * r, p.y + Math.sin(a) * r];
      };
      const [cx, cy] = em(am, 0.4 + ANEL / 2);
      if (cx < -25 || cx > W + 25 || cy < -25 || cy > H + 25) continue;
      limitante += pg([em(a0, 0.4), em(am, 0.4), em(a1, 0.4), em(a1, 0.4 + ANEL), em(am, 0.4 + ANEL), em(a0, 0.4 + ANEL)]);
      if (espN.tentar(cx, cy, 4.4)) {
        limNuc += pt(cx, cy);
        limNucleolo += pt(cx + 0.6, cy - 0.4);
      }
    }
  }

  // espaço portal: conjuntivo com a tríade (ramo da veia porta, ramo da artéria hepática, ducto biliar)
  const ct: ReactElement[] = [];
  const veias: ReactElement[] = [];
  const arterias: ReactElement[] = [];
  const ductos: ReactElement[] = [];
  portais.forEach((p, i) => {
    const contorno = Array.from({ length: 28 }, (_, k): P => {
      const a = (2 * Math.PI * k) / 28;
      return [p.x + Math.cos(a) * raioPortal(p, a), p.y + Math.sin(a) * raioPortal(p, a)];
    });
    const loc = (u: number, v: number): P => [p.x + Math.cos(p.giro) * u - Math.sin(p.giro) * v, p.y + Math.sin(p.giro) * u + Math.cos(p.giro) * v];
    const [vx, vy] = loc(-9, 4);
    const [ax, ay] = loc(19, -17);
    const [dx, dy] = loc(21, 15);
    const esp = new Espaco();
    esp.marcar(vx, vy, 24);
    esp.marcar(ax, ay, 11);
    esp.marcar(dx, dy, 13);
    let fib = '';
    let linfo = '';
    for (let t = 0, n = 0; t < 120 && n < 16; t++) {
      const a = entre(rng, 0, 2 * Math.PI);
      const dd = Math.sqrt(rng()) * (raioPortal(p, a) - 6);
      const x = p.x + Math.cos(a) * dd;
      const y = p.y + Math.sin(a) * dd;
      if (!esp.tentar(x, y, 4)) continue;
      n++;
      if (rng() < 0.45) linfo += pt(x, y);
      else fib += seg(x, y, 6, entre(rng, 0, Math.PI));
    }
    ct.push(
      <g key={i}>
        <path d={pg(contorno)} fill={HE.colageno} stroke="#e08ab0" strokeWidth={1.5} />
        <Deco>
          <path d={fib} stroke={HE.nucleo} strokeWidth={2.2} strokeLinecap="round" />
          <path d={linfo} stroke={HE.nucleoEscuro} strokeWidth={4.4} strokeLinecap="round" />
        </Deco>
      </g>,
    );
    // ramo da veia porta: o maior, parede fina, luz ampla e irregular
    let hem = '';
    for (const [u, v] of [[-8, -3], [0, 2], [7, -2], [-3, 6], [10, 4]] as const) {
      const [hx, hy] = loc(-9 + u, 4 + v);
      hem += pt(hx, hy);
    }
    let endo = '';
    for (let k = 0; k < 6; k++) {
      const a = (2 * Math.PI * (k + 0.3)) / 6;
      const [ex, ey] = loc(-9 + Math.cos(a) * 18.5, 4 + Math.sin(a) * 11.5);
      endo += seg(ex, ey, 4, p.giro + a + Math.PI / 2);
    }
    veias.push(
      <g key={i}>
        <path d={elip(vx, vy, 20, 13, p.giro)} fill={HE.luz} stroke="#d77aa3" strokeWidth={2} />
        <path d={hem} stroke={HE.hemacia} strokeWidth={5.6} strokeLinecap="round" />
        <path d={endo} stroke={HE.nucleo} strokeWidth={1.8} strokeLinecap="round" />
      </g>,
    );
    // ramo da artéria hepática: pequeno, parede muscular espessa, luz redonda
    let mus = '';
    for (let k = 0; k < 5; k++) {
      const a = (2 * Math.PI * k) / 5 + 0.3;
      mus += seg(ax + Math.cos(a) * 5.4, ay + Math.sin(a) * 5.4, 3.4, a + Math.PI / 2);
    }
    arterias.push(
      <g key={i}>
        <circle cx={ax} cy={ay} r={8} fill="#e07aa6" stroke="#b9568a" strokeWidth={1} />
        <circle cx={ax} cy={ay} r={3.2} fill={HE.luz} stroke="#b9568a" strokeWidth={0.6} />
        <path d={pt(ax, ay)} stroke={HE.hemacia} strokeWidth={3.6} strokeLinecap="round" />
        <path d={mus} stroke={HE.nucleo} strokeWidth={1.8} strokeLinecap="round" />
      </g>,
    );
    // ducto biliar: epitélio simples cúbico em volta de uma luz redonda
    let paredes = '';
    let nucs = '';
    const n = 8;
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      paredes += `M${q(dx + Math.cos(a) * 3.9)} ${q(dy + Math.sin(a) * 3.9)}L${q(dx + Math.cos(a) * 10)} ${q(dy + Math.sin(a) * 10)}`;
      const am = a + Math.PI / n;
      nucs += pt(dx + Math.cos(am) * 7.2, dy + Math.sin(am) * 7.2);
    }
    ductos.push(
      <g key={i}>
        <circle cx={dx} cy={dy} r={10} fill="#e9a9c8" stroke="#c66d98" strokeWidth={1} />
        <path d={paredes} stroke="#c66d98" strokeWidth={0.7} />
        <circle cx={dx} cy={dy} r={3.9} fill={HE.luz} />
        <path d={nucs} stroke={HE.nucleo} strokeWidth={3.6} strokeLinecap="round" />
      </g>,
    );
  });

  return (
    <>
      <E id="sinusoide-hepatico">
        <rect x={-10} y={-10} width={W + 20} height={H + 20} fill="#fbeef5" />
      </E>
      <E id="placas-de-hepatocitos">
        <path d={celulas} fill="#eca4c4" stroke="#d084a9" strokeWidth={0.7} strokeLinejoin="round" />
        <path d={nucleos} stroke="#5f4ba0" strokeWidth={7.6} strokeLinecap="round" />
        <path d={nucleolos} stroke={HE.nucleoEscuro} strokeWidth={1.8} strokeLinecap="round" />
      </E>
      <E id="sinusoide-hepatico">
        <path d={hemacias} stroke={HE.hemacia} strokeWidth={5} strokeLinecap="round" />
        <path d={endotelio} stroke={HE.nucleoEscuro} strokeWidth={1.7} strokeLinecap="round" />
      </E>
      <E id="celula-de-kupffer">
        <path d={kupffer} fill="#dc9fc2" stroke="#b7739d" strokeWidth={0.7} />
        <path d={kupfferNuc} fill="#5c4596" />
      </E>
      <E id="placas-de-hepatocitos">
        <path d={limitante} fill="#eca4c4" stroke="#d084a9" strokeWidth={0.7} strokeLinejoin="round" />
        <path d={limNuc} stroke="#5f4ba0" strokeWidth={7.6} strokeLinecap="round" />
        <path d={limNucleolo} stroke={HE.nucleoEscuro} strokeWidth={1.8} strokeLinecap="round" />
      </E>
      <E id="veia-centrolobular">
        {centros.map(([x, y], i) => {
          let hem = '';
          let endo = '';
          for (let k = 0; k < 5; k++) {
            const a = (2 * Math.PI * (k + 0.4)) / 5;
            endo += seg(x + Math.cos(a) * (rVC - 1.2), y + Math.sin(a) * (rVC - 1.2), 4.5, a + Math.PI / 2);
          }
          for (const [u, v] of [[-6, -4], [3, 5], [8, -7]] as const) hem += pt(x + u, y + v);
          return (
            <g key={i}>
              {/* parede fina, interrompida onde os sinusoides desembocam */}
              <circle cx={x} cy={y} r={rVC} fill={HE.luz} stroke="#d98fb2" strokeWidth={2.2} strokeDasharray="13 5" />
              <path d={hem} stroke={HE.hemacia} strokeWidth={5.6} strokeLinecap="round" />
              <path d={endo} stroke={HE.nucleoEscuro} strokeWidth={1.8} strokeLinecap="round" />
            </g>
          );
        })}
      </E>
      <E id="triade-portal">{ct}</E>
      <E id="ramo-da-veia-porta">{veias}</E>
      <E id="ramo-da-arteria-hepatica">{arterias}</E>
      <E id="ducto-biliar">{ductos}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_PANCREAS = ['acino-pancreatico', 'celula-centroacinosa', 'ducto-intercalado', 'ilhota-de-langerhans', 'ducto-interlobular', 'septo-conjuntivo'];
/**
 * Pâncreas: parte exócrina (ácinos serosos muito juntos, células centroacinosas, ductos intercalados longos; não há
 * ductos estriados) e parte endócrina (ilhotas de Langerhans, mais pálidas, com capilares). Um septo interlobular
 * com ducto interlobular e vasos atravessa o campo.
 */
export function LaminaPancreas(rng: Rng) {
  const ilhotas = [
    { x: 420, y: 330, r: 88 },
    { x: 815, y: 548, r: 52 },
  ];
  const raioIlhota = (il: (typeof ilhotas)[number], a: number) => il.r * (1 + 0.06 * Math.sin(3 * a + il.x) + 0.04 * Math.sin(5 * a + il.y));
  const naIlhota = (x: number, y: number, m: number) => ilhotas.some((il) => Math.hypot(x - il.x, y - il.y) < raioIlhota(il, Math.atan2(y - il.y, x - il.x)) + m);
  const septoX = (y: number) => 640 + 36 * Math.sin(y / 170) + 0.07 * y;
  const ductoY = 196;
  const vasosY = 468;
  const septoL = (y: number) => 15 + 3 * Math.sin(y / 60) + 24 * Math.exp(-(((y - ductoY) / 46) ** 2)) + 14 * Math.exp(-(((y - vasosY) / 38) ** 2));
  const noSepto = (x: number, y: number, m: number) => Math.abs(x - septoX(y)) < septoL(y) + m;

  // ácinos em mosaico irregular (células de Voronoi da grade), quase sem conjuntivo entre eles; recortados junto às
  // ilhotas e ao septo, para nada ficar desenhado por cima de outra coisa
  const passo = 50;
  const centros = grade(rng, passo, [-40, -40, W + 40, H + 40], 0.17).filter(([x, y]) => !naIlhota(x, y, 8) && !noSepto(x, y, 8));
  // ácinos encostados na ilhota (só uma cápsula fina de fibras reticulares entre eles): completa a grade onde ela
  // deixou um vão em volta da ilhota
  for (const il of ilhotas) {
    const n = Math.round((2 * Math.PI * (il.r + 24)) / 44);
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      const x = il.x + Math.cos(a) * (raioIlhota(il, a) + 23);
      const y = il.y + Math.sin(a) * (raioIlhota(il, a) + 23);
      if (!noSepto(x, y, 8) && centros.every(([cx, cy]) => Math.hypot(cx - x, cy - y) > 36)) centros.push([x, y]);
    }
  }
  const vizinhos = centros.map(([x, y], i) => centros.map((_, j) => j).filter((j) => j !== i && Math.hypot(centros[j][0] - x, centros[j][1] - y) < passo * 1.6));
  // ductos intercalados: correm entre dois ácinos vizinhos (a fronteira entre eles se alarga para dar lugar ao tubo)
  const usados = new Set<number>();
  const ductos: [number, number][] = [];
  centros.forEach(([x, y], i) => {
    if (ductos.length >= 18 || usados.has(i) || x < 40 || x > W - 40 || y < 40 || y > H - 40 || rng() > 0.09) return;
    const j = vizinhos[i].find((k) => !usados.has(k) && Math.hypot(centros[k][0] - x, centros[k][1] - y) < passo * 1.25);
    if (j === undefined) return;
    ductos.push([i, j]);
    for (const k of [i, j, ...vizinhos[i]]) usados.add(k);
  });
  const folga = (i: number, j: number) => (ductos.some(([a, b]) => (a === i && b === j) || (a === j && b === i)) ? 14 : 2.2);
  const cortar = (poli: P[], nx: number, ny: number, c: number): P[] => {
    const out: P[] = [];
    poli.forEach((a, k) => {
      const b = poli[(k + 1) % poli.length];
      const da = nx * a[0] + ny * a[1] - c;
      const db = nx * b[0] + ny * b[1] - c;
      if (da <= 0) out.push(a);
      if (da * db < 0) {
        const t = da / (da - db);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    });
    return out;
  };
  const area = (poli: P[]) => Math.abs(poli.reduce((s, [x0, y0], k) => s + x0 * poli[(k + 1) % poli.length][1] - poli[(k + 1) % poli.length][0] * y0, 0)) / 2;
  // cada ducto intercalado começa na célula centroacinosa do ácino i, sai entre duas células dele e segue pela
  // fresta entre i e j (alargada para 14 un)
  const trajetos = new Map<number, P[]>();
  for (const [i, j] of ductos) {
    const [x1, y1] = centros[i];
    const [x2, y2] = centros[j];
    const m: P = [(x1 + x2) / 2, (y1 + y2) / 2];
    const t: P = [-(y2 - y1) / Math.hypot(x2 - x1, y2 - y1), (x2 - x1) / Math.hypot(x2 - x1, y2 - y1)];
    const lado = rng() < 0.5 ? -1 : 1;
    trajetos.set(i, [[x1, y1], m, [m[0] + t[0] * 12 * lado, m[1] + t[1] * 12 * lado]]);
  }
  const centroacinosas = new Set<number>(ductos.map(([i]) => i));
  let basal = '';
  let apical = '';
  const gr: P[] = [];
  let limites = '';
  const nucs: P[] = [];
  const luz: P[] = [];
  let centroCel = '';
  let centroNuc = '';
  const espN = new Espaco();
  centros.forEach(([x, y], i) => {
    // começa por um octógono de raio limitado: junto ao septo e às ilhotas o ácino não se estica para ocupar o vão
    let poli = Array.from({ length: 8 }, (_, k): P => [x + Math.cos((Math.PI * k) / 4 + 0.39) * 33, y + Math.sin((Math.PI * k) / 4 + 0.39) * 33]);
    for (const j of vizinhos[i]) {
      const [qx, qy] = centros[j];
      const d = Math.hypot(qx - x, qy - y);
      const ux = (qx - x) / d;
      const uy = (qy - y) / d;
      poli = cortar(poli, ux, uy, ux * (x + qx) / 2 + uy * (y + qy) / 2 - folga(i, j) / 2);
    }
    for (const il of ilhotas) {
      const d = Math.hypot(il.x - x, il.y - y);
      if (d > il.r + 90) continue;
      const ux = (il.x - x) / d;
      const uy = (il.y - y) / d;
      poli = cortar(poli, ux, uy, ux * il.x + uy * il.y - raioIlhota(il, Math.atan2(-uy, -ux)) - 2.5);
    }
    const sx = septoX(y);
    if (Math.abs(x - sx) < 120) poli = x < sx ? cortar(poli, 1, 0, sx - septoL(y) - 3) : cortar(poli, -1, 0, -(sx + septoL(y) + 3));
    if (poli.length < 3 || area(poli) < 900 || x < -28 || x > W + 28 || y < -28 || y > H + 28) return;
    // o centro precisa ficar bem dentro do perfil (senão núcleos e grânulos cairiam fora do ácino, no conjuntivo)
    if (Array.from({ length: 12 }, (_, k) => raioPoligono(poli, x, y, (Math.PI * k) / 6)).some((r) => !(r >= 11 && r < 40))) return;
    basal += pg(poli);
    apical += pg(poli.map(([px, py]): P => [x + (px - x) * 0.56, y + (py - y) * 0.56]));
    const comCentro = centroacinosas.has(i) || rng() < 0.5;
    // 7 células por perfil de ácino: limites radiais do centro à borda, núcleo redondo na base, grânulos no ápice
    const n = 7;
    const trajeto = trajetos.get(i);
    // no ácino de onde sai um ducto, um dos limites entre células fica alinhado com ele (o ducto passa entre duas células)
    const giro = trajeto ? Math.atan2(trajeto[1][1] - y, trajeto[1][0] - x) : entre(rng, 0, 1);
    const longeDoDucto = (px: number, py: number, m: number) => !trajeto || distSeg(px, py, trajeto[0], trajeto[1]) > m;
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n + giro;
      const rb = raioPoligono(poli, x, y, a);
      limites += `M${q(x + Math.cos(a) * 3)} ${q(y + Math.sin(a) * 3)}l${q(Math.cos(a) * (rb - 3))} ${q(Math.sin(a) * (rb - 3))}`;
      const am = a + Math.PI / n;
      const rn = raioPoligono(poli, x, y, am) * 0.76;
      const nx = x + Math.cos(am) * rn;
      const ny = y + Math.sin(am) * rn;
      if (longeDoDucto(nx, ny, 7.4) && espN.tentar(nx, ny, 3.4)) nucs.push([nx, ny]);
      for (let g = 0; g < (k % 2 ? 1 : 2); g++) {
        const ag = a + (Math.PI / n) * entre(rng, 0.3, 1.7);
        const dg = raioPoligono(poli, x, y, ag) * entre(rng, comCentro ? 0.3 : 0.12, 0.5);
        if (longeDoDucto(x + Math.cos(ag) * dg, y + Math.sin(ag) * dg, 5.6)) gr.push([x + Math.cos(ag) * dg, y + Math.sin(ag) * dg]);
      }
    }
    if (comCentro) {
      // célula centroacinosa: início do ducto intercalado dentro do ácino; citoplasma muito pálido, núcleo claro ovoide
      const a = trajeto ? giro : entre(rng, 0, Math.PI);
      centroCel += elip(x, y, 6, 4.2, a);
      centroNuc += elip(x, y, 2.9, 1.9, a);
    } else luz.push([x, y]);
  });
  let ductoParede = '';
  let ductoLuz = '';
  let ductoNuc = '';
  for (const tr of trajetos.values()) {
    // parede de epitélio cúbico baixo (pálido), luz estreita e núcleos redondos dos dois lados
    ductoParede += lin(tr);
    const [cx, cy] = tr[0];
    const u = Math.hypot(tr[1][0] - cx, tr[1][1] - cy);
    ductoLuz += lin([[cx + ((tr[1][0] - cx) * 6) / u, cy + ((tr[1][1] - cy) * 6) / u], tr[1], tr[2]]);
    for (const am of reamostrar(tr, 6.5, 9))
      for (const lado of [-1, 1]) ductoNuc += pt(am.x - am.ty * 3 * lado, am.y + am.tx * 3 * lado);
  }

  // ilhotas de Langerhans: cordões de células pálidas com núcleos redondos e capilares entre eles
  let ilCel = '';
  let ilNuc = '';
  let ilCap = '';
  let ilHem = '';
  let ilBorda = '';
  let ilEndo = '';
  for (const il of ilhotas) {
    const contorno = Array.from({ length: 36 }, (_, k): P => {
      const a = (2 * Math.PI * k) / 36;
      return [il.x + Math.cos(a) * raioIlhota(il, a), il.y + Math.sin(a) * raioIlhota(il, a)];
    });
    ilBorda += pg(contorno);
    // rede de capilares (fenestrados) atravessando a ilhota; as células endócrinas formam cordões ao longo deles
    const caps: P[][] = [];
    const nCap = il.r > 70 ? 4 : 2;
    for (let k = 0; k < nCap; k++) {
      const a = (k * Math.PI) / nCap + entre(rng, -0.25, 0.25);
      const desloc = (k % 2 ? 1 : -1) * entre(rng, 0, il.r * 0.35);
      const pts: P[] = [];
      for (let t = -1; t <= 1.001; t += 0.1) {
        const u = t * il.r;
        const v = desloc + Math.sin(t * 3.2 + k * 1.7) * il.r * 0.1;
        pts.push([il.x + Math.cos(a) * u - Math.sin(a) * v, il.y + Math.sin(a) * u + Math.cos(a) * v]);
      }
      const dentro = pts.filter(([px, py]) => naIlhota(px, py, -5));
      if (dentro.length > 3) caps.push(dentro);
    }
    for (const c of caps) {
      ilCap += lin(c);
      reamostrar(c, 9, 4).forEach((a, k) => {
        if (k % 2 === 0) ilHem += pt(a.x, a.y);
        else if (k % 4 === 1) ilEndo += seg(a.x - a.ty * 2.7 * (k % 8 === 1 ? 1 : -1), a.y + a.tx * 2.7 * (k % 8 === 1 ? 1 : -1), 3.2, Math.atan2(a.ty, a.tx));
      });
    }
    const esp = new Espaco();
    for (const [x, y] of grade(rng, 12, [il.x - il.r - 10, il.y - il.r - 10, il.x + il.r + 10, il.y + il.r + 10], 0.08)) {
      const dc = Math.min(...caps.map((c) => distLinha(c, x, y)));
      // cordões de duas a três células de cada lado do capilar
      if (!naIlhota(x, y, -6) || dc < 5.5 || dc > 27) continue;
      ilCel += pg(hexagono(rng, x, y, 6.8));
      if (esp.tentar(x, y, 3)) ilNuc += pt(x + entre(rng, -0.6, 0.6), y + entre(rng, -0.6, 0.6));
    }
  }

  // septo interlobular, ducto interlobular (epitélio cúbico a cilíndrico baixo, conjuntivo denso em volta) e vasos
  const yy = Array.from({ length: 38 }, (_, k) => -20 + k * 20);
  const septo = pg([...yy.map((y): P => [septoX(y) - septoL(y), y]), ...[...yy].reverse().map((y): P => [septoX(y) + septoL(y), y])]);
  const dx = septoX(ductoY);
  const dy = ductoY;
  let ductoILCel = '';
  let ductoILNuc = '';
  const nIL = 16;
  for (let k = 0; k < nIL; k++) {
    const a0 = (2 * Math.PI * k) / nIL;
    const a1 = (2 * Math.PI * (k + 1)) / nIL;
    const em = (a: number, r: number): P => [dx + Math.cos(a) * r, dy + Math.sin(a) * r];
    ductoILCel += pg([em(a0, 13), em(a1, 13), em(a1, 23), em(a0, 23)]);
    const am = (a0 + a1) / 2;
    ductoILNuc += seg(...em(am, 19.5), 2.6, am);
  }
  const vx = septoX(vasosY);

  return (
    <>
      <E id="septo-conjuntivo">
        {/* conjuntivo: trama fina entre os ácinos, mais espesso nos septos */}
        <rect x={-10} y={-10} width={W + 20} height={H + 20} fill="#f1c1d7" />
        <path d={septo} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 14 }, (_, k) => {
            const y = entre(rng, 0, H);
            return <path key={k} d={seg(septoX(y) + entre(rng, -septoL(y) + 6, septoL(y) - 6), y, 8, Math.PI / 2 + entre(rng, -0.3, 0.3))} stroke={HE.nucleo} strokeWidth={2.4} strokeLinecap="round" />;
          })}
        </Deco>
        {vaso(rng, vx - 9, vasosY - 10, 9, true, 'a')}
        {vaso(rng, vx + 7, vasosY + 12, 13, false, 'v')}
      </E>
      <E id="acino-pancreatico">
        <path d={basal} fill="#9c80c8" stroke="#f1c1d7" strokeWidth={1.6} />
        <path d={apical} fill="#ee9cbe" />
        <path d={pontos(gr)} stroke="#d9406f" strokeWidth={2.4} strokeLinecap="round" />
        <path d={limites} stroke="#7d62b2" strokeWidth={0.7} />
        <path d={pontos(nucs)} stroke="#33266e" strokeWidth={6.6} strokeLinecap="round" />
        <path d={pontos(luz)} stroke={HE.luz} strokeWidth={2.6} strokeLinecap="round" />
      </E>
      <E id="celula-centroacinosa">
        <path d={centroCel} fill="#f7e9f1" stroke="#cfa9c2" strokeWidth={0.8} />
        <path d={centroNuc} fill="#7d6ab6" />
      </E>
      <E id="ducto-intercalado">
        <path d={ductoParede} stroke="#d4a3bf" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ductoParede} stroke="#f2d3e2" strokeWidth={8.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ductoLuz} stroke="#fbf3f7" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ductoNuc} stroke="#6a57a8" strokeWidth={2.9} strokeLinecap="round" />
      </E>
      <E id="ilhota-de-langerhans">
        <path d={ilBorda} fill="#f3dbe7" stroke="#d6a6c2" strokeWidth={1.6} />
        <path d={ilCel} fill="#f0d0e0" stroke="#dcb1c8" strokeWidth={0.6} />
        <path d={ilCap} stroke="#e4b3cb" strokeWidth={6.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ilCap} stroke={HE.luz} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ilHem} stroke={HE.hemacia} strokeWidth={3.8} strokeLinecap="round" />
        <path d={ilEndo} stroke={HE.nucleoEscuro} strokeWidth={1.6} strokeLinecap="round" />
        <path d={ilNuc} stroke="#6652a6" strokeWidth={5.2} strokeLinecap="round" />
      </E>
      <E id="ducto-interlobular">
        <circle cx={dx} cy={dy} r={33} fill="#e891b7" />
        <path d={ductoILCel} fill="#f0b6cf" stroke="#cf7ea6" strokeWidth={0.8} />
        <path d={ductoILNuc} stroke={HE.nucleo} strokeWidth={4.2} strokeLinecap="round" />
        <circle cx={dx} cy={dy} r={13} fill={HE.luz} />
      </E>
    </>
  );
}

export const LAMINAS_SISTEMAS_B: Record<string, LaminaRender> = {
  // o campo de 10× precisa pegar o epitélio e a muscular da mucosa, não só a submucosa ou a muscular externa
  esofago: {
    desenhar: LaminaEsofago,
    partes: PARTES_ESOFAGO,
    areaDiagnostica: [200, 160, 800, 250],
    // o plexo fica entre as camadas circular e longitudinal. A glândula esofágica não entra em "submucosa": o ducto
    // dela atravessa a muscular da mucosa, a lâmina própria e o epitélio
    contem: { 'muscular-externa': ['plexo-mioenterico'] },
  },
  // o campo precisa pegar as glândulas com células parietais, não só a base, a muscular da mucosa e a submucosa
  'estomago-fundo': {
    desenhar: LaminaEstomago,
    partes: PARTES_ESTOMAGO,
    areaDiagnostica: [200, 150, 800, 420],
    // as células mucosas superficiais não entram em "fosseta": também revestem o topo entre as fossetas
    contem: { 'glandula-fundica': ['celula-parietal', 'celula-principal', 'celula-mucosa-do-colo'] },
    // epitélio (superfície, fossetas e glândulas) em 61–83% de todo campo: "Epitélio simples cilíndrico" também vale
    distratoresExcluidos: ['epitelio-cilindrico-intestino'],
  },
  // o campo precisa pegar as criptas (mucosa até y≈300), não só a submucosa e a muscular externa
  colon: {
    desenhar: LaminaColon,
    partes: PARTES_COLON,
    areaDiagnostica: [200, 150, 800, 230],
    // caliciformes na superfície e nas criptas: vale a região sob o toque
    contem: { 'cripta-intestinal': ['celula-caliciforme'], 'epitelio-simples-cilindrico': ['celula-caliciforme'], 'muscular-externa': ['plexo-mioenterico'] },
    // criptas e superfície (epitélio simples cilíndrico) em 52–84% de todo campo
    distratoresExcluidos: ['epitelio-cilindrico-intestino'],
  },
  figado: {
    desenhar: LaminaFigado,
    partes: PARTES_FIGADO,
    contem: { 'triade-portal': ['ramo-da-veia-porta', 'ramo-da-arteria-hepatica', 'ducto-biliar'], 'sinusoide-hepatico': ['celula-de-kupffer'] },
  },
  // o campo precisa conter a ilhota grande (420, 330): sem ela, os ácinos lembram outra glândula serosa
  pancreas: {
    desenhar: LaminaPancreas,
    partes: PARTES_PANCREAS,
    areaDiagnostica: [360, 270, 480, 390],
    // o ducto intercalado começa dentro do ácino mas corre entre os ácinos: não entra em "ácino"
    contem: { 'acino-pancreatico': ['celula-centroacinosa'], 'septo-conjuntivo': ['ducto-interlobular'] },
  },
};
