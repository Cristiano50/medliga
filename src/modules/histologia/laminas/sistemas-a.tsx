// Lâminas da histologia dos sistemas — grupo A: circulatório, órgãos linfoides e pele.
// Ids e estruturas = content/histologia/laminas-sistemas-a.json (teste em tests/conteudo.test.ts).
// Escala esquemática, como nas outras lâminas: as células estão aumentadas em relação ao órgão, mas as proporções
// entre as estruturas de cada lâmina (espessura das túnicas, calibre de luz e parede, tamanho de folículos,
// lóbulos e anexos) seguem Junqueira (14ª ed.) e Ross (8ª ed.).
// Leveza para celular: milhares de núcleos vão num único <path> (traço quase nulo com ponta redonda) e as
// posições são sorteadas sem sobreposição (grade hexagonal com jitter + teste de colisão).
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, cunha, entre, grade, type Rng } from '../he.tsx';
import type { LaminaRender } from './index.ts';

// ---------------------------------------------------------------------------------------------
// utilitários geométricos e de desenho

type P = [number, number];
type Caixa = [number, number, number, number];
type El = [number, number, number, number, number?]; // cx, cy, rx, ry, ângulo (graus)
const TAU = Math.PI * 2;
const r1 = (v: number) => Math.round(v * 10) / 10;
/** meia unidade: basta para núcleos de 4–8 un e deixa o atributo d curto */
function m2(v: number) {
  const k = Math.round(v * 2);
  return k % 2 ? (k / 2).toFixed(1) : String(k / 2);
}
function pontos(pts: P[]) {
  let d = '';
  for (const [x, y] of pts) d += `M${m2(x)} ${m2(y)}h.01`;
  return d;
}
/** Núcleos (ou hemácias) redondos num único path: traço quase nulo com ponta redonda. */
function bolinhas(pts: P[], r: number, cor: string, key?: string | number) {
  return pts.length ? <path key={key} d={pontos(pts)} stroke={cor} strokeWidth={2 * r} strokeLinecap="round" fill="none" /> : null;
}
function elipse(cx: number, cy: number, rx: number, ry: number, ang = 0) {
  const a = (ang * Math.PI) / 180;
  const ex = r1(2 * rx * Math.cos(a));
  const ey = r1(2 * rx * Math.sin(a));
  const arco = `a${r1(rx)} ${r1(ry)} ${r1(ang)} 1 0 `;
  return `M${r1(cx - ex / 2)} ${r1(cy - ey / 2)}${arco}${ex} ${ey}${arco}${-ex} ${-ey}z`;
}
const elipses = (l: El[]) => l.map(([x, y, rx, ry, a]) => elipse(x, y, rx, ry, a ?? 0)).join('');
/** Polilinha compacta (coordenadas relativas, 1 casa decimal). */
function linha(pts: P[], fechar = false) {
  if (pts.length < 2) return '';
  let px = r1(pts[0][0]);
  let py = r1(pts[0][1]);
  let d = `M${px} ${py}l`;
  for (let i = 1; i < pts.length; i++) {
    const x = r1(pts[i][0]);
    const y = r1(pts[i][1]);
    d += `${r1(x - px)} ${r1(y - py)} `;
    px = x;
    py = y;
  }
  return d.trimEnd() + (fechar ? 'z' : '');
}
/** Curva suave (Catmull-Rom → Bézier cúbica) pelos pontos. */
function suave(pts: P[], fechar = true) {
  const n = pts.length;
  const p = (i: number) => (fechar ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < (fechar ? n : n - 1); i++) {
    const [a, b, c, e] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    d += `C${r1(b[0] + (c[0] - a[0]) / 6)} ${r1(b[1] + (c[1] - a[1]) / 6)} ${r1(c[0] - (e[0] - b[0]) / 6)} ${r1(c[1] - (e[1] - b[1]) / 6)} ${r1(c[0])} ${r1(c[1])}`;
  }
  return d + (fechar ? 'Z' : '');
}
function distSeg(p: P, a: P, b: P) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function distLinha(p: P, l: P[]) {
  let m = Infinity;
  for (let i = 1; i < l.length; i++) m = Math.min(m, distSeg(p, l[i - 1], l[i]));
  return m;
}
function dentroPoligono(p: P, pol: P[]) {
  let dentro = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i];
    const [xj, yj] = pol[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
function centroide(pol: P[]): P {
  let a = 0;
  let cx = 0;
  let cy = 0;
  pol.forEach((p, i) => {
    const q = pol[(i + 1) % pol.length];
    const c = p[0] * q[1] - q[0] * p[1];
    a += c;
    cx += (p[0] + q[0]) * c;
    cy += (p[1] + q[1]) * c;
  });
  return [cx / (3 * a), cy / (3 * a)];
}
/** Distância de c até a borda do polígono convexo na direção t. */
function raioPoligono(pol: P[], c: P, t: number) {
  const dx = Math.cos(t);
  const dy = Math.sin(t);
  let m = Infinity;
  for (let i = 0; i < pol.length; i++) {
    const a = pol[i];
    const b = pol[(i + 1) % pol.length];
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const s = ((a[0] - c[0]) * ey - (a[1] - c[1]) * ex) / den;
    const u = ((a[0] - c[0]) * dy - (a[1] - c[1]) * dx) / den;
    if (s > 0 && u >= -1e-9 && u <= 1 + 1e-9) m = Math.min(m, s);
  }
  return m;
}
/** Mantém a parte do polígono com lado(p) ≤ 0. */
function recortar(pol: P[], lado: (p: P) => number): P[] {
  const novo: P[] = [];
  pol.forEach((a, i) => {
    const b = pol[(i + 1) % pol.length];
    const la = lado(a);
    const lb = lado(b);
    if (la <= 0) novo.push(a);
    if ((la < 0 && lb > 0) || (la > 0 && lb < 0)) {
      const t = la / (la - lb);
      novo.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return novo;
}
const circulo = (c: P, r: number, n = 14): P[] => Array.from({ length: n }, (_, k) => [c[0] + Math.cos((TAU * k) / n) * r, c[1] + Math.sin((TAU * k) / n) * r]);
/** Célula de Voronoi de c, partindo do polígono inicial (vizinhos compartilham a borda, sem vãos). */
function voronoi(c: P, sementes: P[], inicial: P[], alcance = Infinity): P[] {
  let pol = inicial;
  for (const v of sementes) {
    const nx = v[0] - c[0];
    const ny = v[1] - c[1];
    if ((!nx && !ny) || Math.abs(nx) > alcance || Math.abs(ny) > alcance) continue;
    const mx = (c[0] + v[0]) / 2;
    const my = (c[1] + v[1]) / 2;
    pol = recortar(pol, (p) => (p[0] - mx) * nx + (p[1] - my) * ny);
    if (!pol.length) break;
  }
  return pol;
}
function qbez(p0: P, p1: P, p2: P, n: number): P[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
  });
}
function cbez(p0: P, p1: P, p2: P, p3: P, n: number): P[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
  });
}
/** Faixa (polígono) de largura variável ao longo de uma polilinha; devolve também o eixo com tangentes. */
function faixa(eixo: P[], meia: (f: number) => number) {
  const esq: P[] = [];
  const dir: P[] = [];
  const tg: P[] = [];
  eixo.forEach((p, i) => {
    const a = eixo[Math.max(0, i - 1)];
    const b = eixo[Math.min(eixo.length - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / l;
    const ty = (b[1] - a[1]) / l;
    const w = meia(i / (eixo.length - 1));
    tg.push([tx, ty]);
    esq.push([p[0] - ty * w, p[1] + tx * w]);
    dir.push([p[0] + ty * w, p[1] - tx * w]);
  });
  return { pol: [...esq, ...dir.reverse()], tg };
}

/** Forma polar (elipse ondulada) usada para órgãos, folículos, lóbulos. */
interface Forma {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  ang?: number;
  ond?: [number, number, number][]; // harmônico, amplitude relativa, fase
}
function raioForma(f: Forma, t: number) {
  const base = (f.rx * f.ry) / Math.hypot(f.ry * Math.cos(t), f.rx * Math.sin(t));
  let k = 1;
  for (const [m, a, fase] of f.ond ?? []) k += a * Math.sin(m * t + fase);
  return base * k;
}
/** Profundidade radial do ponto na forma: > 0 dentro (distância até a borda), < 0 fora. */
function prof(f: Forma, x: number, y: number) {
  const a = ((f.ang ?? 0) * Math.PI) / 180;
  const dx = x - f.cx;
  const dy = y - f.cy;
  const lx = dx * Math.cos(a) + dy * Math.sin(a);
  const ly = -dx * Math.sin(a) + dy * Math.cos(a);
  return raioForma(f, Math.atan2(ly, lx)) - Math.hypot(lx, ly);
}
/** Contorno da forma recuado de `margem` (negativo = expandido). */
function contorno(f: Forma, margem = 0, n = 96): P[] {
  const a = ((f.ang ?? 0) * Math.PI) / 180;
  return Array.from({ length: n }, (_, i) => {
    const t = (TAU * i) / n;
    const r = raioForma(f, t) - margem;
    const lx = Math.cos(t) * r;
    const ly = Math.sin(t) * r;
    return [f.cx + lx * Math.cos(a) - ly * Math.sin(a), f.cy + lx * Math.sin(a) + ly * Math.cos(a)];
  });
}
/** Ponto em coordenadas locais da forma (x ao longo de rx, y ao longo de ry). */
function local(f: Forma, x: number, y: number): P {
  const a = ((f.ang ?? 0) * Math.PI) / 180;
  const dx = x - f.cx;
  const dy = y - f.cy;
  return [dx * Math.cos(a) + dy * Math.sin(a), -dx * Math.sin(a) + dy * Math.cos(a)];
}

/** Ocupação do plano (discos): impede núcleos e células sobrepostos. */
function criarOcupacao(c = 16) {
  const mapa = new Map<number, number[]>();
  let rMax = 0;
  const k = (i: number, j: number) => (i + 200) * 100000 + (j + 200);
  return {
    livre(x: number, y: number, r: number) {
      const s = Math.ceil((r + rMax) / c);
      const i0 = Math.floor(x / c);
      const j0 = Math.floor(y / c);
      for (let i = i0 - s; i <= i0 + s; i++)
        for (let j = j0 - s; j <= j0 + s; j++) {
          const l = mapa.get(k(i, j));
          if (l) for (let m = 0; m < l.length; m += 3) if (Math.hypot(l[m] - x, l[m + 1] - y) < l[m + 2] + r) return false;
        }
      return true;
    },
    por(x: number, y: number, r: number) {
      rMax = Math.max(rMax, r);
      const kk = k(Math.floor(x / c), Math.floor(y / c));
      const l = mapa.get(kk);
      if (l) l.push(x, y, r);
      else mapa.set(kk, [x, y, r]);
    },
  };
}
type Ocup = ReturnType<typeof criarOcupacao>;

/**
 * Semeia núcleos numa região: grade hexagonal com jitter + segunda passada de dardos que preenche os vãos.
 * `raio` é o raio de exclusão (raio visual + 0,4): dois núcleos nunca se sobrepõem, nem entre regiões.
 */
function semear(rng: Rng, oc: Ocup, area: Caixa, passo: number, raio: number, aceita: (x: number, y: number) => boolean, prob = 1): P[] {
  const out: P[] = [];
  const [x0, y0, x1, y1] = area;
  const dy = passo * 0.866;
  const tenta = (x: number, y: number) => {
    if (!aceita(x, y) || !oc.livre(x, y, raio)) return;
    oc.por(x, y, raio);
    out.push([x, y]);
  };
  let fila = 0;
  for (let y = y0; y <= y1; y += dy, fila++)
    for (let x = x0 + (fila % 2 ? passo / 2 : 0); x <= x1; x += passo) {
      const jx = entre(rng, -0.15, 0.15) * passo;
      const jy = entre(rng, -0.15, 0.15) * passo;
      if (rng() < prob) tenta(x + jx, y + jy);
    }
  if (prob >= 1) {
    const n = Math.round(((x1 - x0) * (y1 - y0)) / (passo * dy) * 0.3);
    for (let k = 0; k < n; k++) tenta(entre(rng, x0, x1), entre(rng, y0, y1));
  }
  return out;
}

/** Pequeno vaso em corte transversal: arteríola (parede muscular), vênula (parede fina) ou capilar. */
function vasinho(rng: Rng, x: number, y: number, tipo: 'a' | 'v' | 'c', r: number, hem = 3.4, key?: string | number) {
  const nuc: El[] = [];
  const luz = tipo === 'a' ? r * 0.45 : r - (tipo === 'v' ? 2.2 : 1.5);
  if (tipo === 'a') {
    const n = r > 13 ? 4 : 3;
    const a0 = entre(rng, 0, TAU);
    for (let k = 0; k < n; k++) {
      const a = a0 + (TAU * k) / n;
      const rr = (r + luz) / 2;
      nuc.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr, Math.min(6.5, (r - luz) * 0.7), 1.3, (a * 180) / Math.PI + 90]);
    }
  }
  const ae = entre(rng, 0, TAU);
  nuc.push([x + Math.cos(ae) * (luz - 0.7), y + Math.sin(ae) * (luz - 0.7), Math.min(5, luz * 0.55), 1.1, (ae * 180) / Math.PI + 90]);
  // hemácias na luz, sem sobreposição
  const rh = Math.min(hem, luz - 1.2);
  const hem2: El[] = [];
  const n = tipo === 'v' ? Math.max(1, Math.round((luz * luz) / (rh * rh * 2.6))) : 1;
  for (let t = 0; t < 30 && hem2.length < n; t++) {
    const a = entre(rng, 0, TAU);
    const d = Math.sqrt(rng()) * Math.max(0, luz - rh - 1.2);
    const hx = x + Math.cos(a) * d;
    const hy = y + Math.sin(a) * d;
    if (hem2.some(([ox, oy]) => Math.hypot(ox - hx, oy - hy) < rh * 2)) continue;
    hem2.push([hx, hy, rh, rh * 0.82, entre(rng, 0, 180)]);
  }
  return (
    <g key={key}>
      <circle cx={r1(x)} cy={r1(y)} r={r} fill={tipo === 'a' ? HE.musculo : '#da86ab'} stroke={tipo === 'a' ? '#c9578d' : 'none'} strokeWidth={0.8} />
      <circle cx={r1(x)} cy={r1(y)} r={r1(luz)} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={0.7} />
      <path d={elipses(hem2)} fill={HE.hemacia} />
      <path d={elipses(nuc)} fill={HE.nucleo} />
    </g>
  );
}

/** Células adiposas (Voronoi limitado por círculo): bordas compartilhadas, núcleo achatado em parte delas. */
function adipocitos(rng: Rng, sementes: P[], rMax: number) {
  let d = '';
  const nuc: El[] = [];
  sementes.forEach((s, i) => {
    const pol = voronoi(s, sementes, circulo(s, rMax), rMax * 2.2);
    if (pol.length < 3) return;
    d += linha(pol, true);
    if (i % 3 === 0) {
      // núcleo em crescente achatado, por dentro da orla, na maior aresta
      let k = 0;
      let lmax = 0;
      pol.forEach((p, j) => {
        const q = pol[(j + 1) % pol.length];
        const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (l > lmax) {
          lmax = l;
          k = j;
        }
      });
      const a = pol[k];
      const b = pol[(k + 1) % pol.length];
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const dc = Math.hypot(s[0] - mx, s[1] - my) || 1;
      nuc.push([mx + ((s[0] - mx) / dc) * 3.6, my + ((s[1] - my) / dc) * 3.6, Math.min(rMax * 0.28, lmax * 0.35), 2.2, (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI]);
    }
  });
  void rng;
  return { d, nuc };
}

/** Folículo linfoide secundário: centro germinativo com zona escura (profunda) e clara, e macrófagos de corpos tingíveis. */
function centroGerminativo(rng: Rng, oc: Ocup, gc: Forma, fundo: P) {
  // eixo "para dentro" (zona escura voltada para o lado oposto ao antígeno: paracórtex/medula no linfonodo)
  const dl = Math.hypot(fundo[0] - gc.cx, fundo[1] - gc.cy) || 1;
  const ux = (fundo[0] - gc.cx) / dl;
  const uy = (fundo[1] - gc.cy) / dl;
  const escura = (x: number, y: number) => (x - gc.cx) * ux + (y - gc.cy) * uy > -gc.ry * 0.1;
  const caixa: Caixa = [gc.cx - gc.rx - 4, gc.cy - gc.rx - 4, gc.cx + gc.rx + 4, gc.cy + gc.rx + 4];
  // macrófagos de corpos tingíveis (fagocitam linfócitos B em apoptose)
  const tbm: P[] = [];
  for (let t = 0; t < 200 && tbm.length < 3; t++) {
    const x = entre(rng, caixa[0], caixa[2]);
    const y = entre(rng, caixa[1], caixa[3]);
    if (prof(gc, x, y) < 12 || !oc.livre(x, y, 9.5)) continue;
    oc.por(x, y, 9.5);
    tbm.push([x, y]);
  }
  const fdc = semear(rng, oc, caixa, 17, 3.6, (x, y) => prof(gc, x, y) > 4 && !escura(x, y), 0.4);
  const blastos = semear(rng, oc, caixa, 10.2, 4.1, (x, y) => prof(gc, x, y) > 4 && escura(x, y));
  const citos = semear(rng, oc, caixa, 8.6, 3.3, (x, y) => prof(gc, x, y) > 3.4, 0.97);
  const fragmentos: El[] = [];
  const nucTbm: El[] = [];
  tbm.forEach(([x, y]) => {
    const an = entre(rng, 0, TAU);
    const [nx, ny] = [x + Math.cos(an) * 2.8, y + Math.sin(an) * 2.8];
    nucTbm.push([nx, ny, 2.8, 2.1, (an * 180) / Math.PI + 90]);
    const fr: El[] = [];
    for (let t = 0; t < 40 && fr.length < 4; t++) {
      const a = entre(rng, 0, TAU);
      const d = entre(rng, 2.5, 5.6);
      const r = entre(rng, 0.9, 1.7);
      const fx = x + Math.cos(a) * d;
      const fy = y + Math.sin(a) * d;
      if (Math.hypot(fx - nx, fy - ny) < r + 3.4 || fr.some(([ox, oy, or]) => Math.hypot(ox - fx, oy - fy) < or + r + 0.6)) continue;
      fr.push([fx, fy, r, r, 0]);
    }
    fragmentos.push(...fr);
  });
  return (
    <>
      <path d={suave(contorno(gc, 0, 72))} fill="#e3cfe4" />
      {tbm.map(([x, y], i) => (
        <circle key={i} cx={r1(x)} cy={r1(y)} r={8.2} fill="#f4e4ec" stroke="#dcbcd0" strokeWidth={0.6} />
      ))}
      <path d={elipses(nucTbm)} fill={HE.nucleoClaro} />
      <path d={elipses(fragmentos)} fill="#291e5c" />
      <Deco>
        {bolinhas(fdc, 3.1, '#a698d4', 'fdc')}
        {bolinhas(blastos, 3.6, '#5b4b9e', 'cb')}
        {bolinhas(citos, 2.8, '#3f307f', 'cc')}
      </Deco>
    </>
  );
}

// =============================================================================================
// 1. Aorta (artéria elástica)

const PARTES_AORTA = ['lumen', 'endotelio', 'tunica-intima', 'fibras-elasticas', 'tunica-media', 'tunica-adventicia', 'vasa-vasorum'];
/** Aorta em corte transversal: segmento da parede, da luz (em cima) à adventícia (embaixo). */
function LaminaAorta(rng: Rng) {
  const R = 2600; // a parede é um arco de tubo largo, levemente côncavo para a luz
  const cv = (x: number) => -((x - 500) ** 2) / (2 * R);
  const giro = (x: number) => (Math.atan(-(x - 500) / R) * 180) / Math.PI;
  const Y_END = 92; // superfície do endotélio (no centro)
  const Y_IEL = 140; // limite íntima/média (1ª lâmina elástica)
  const Y_ADV = 552; // limite média/adventícia (última lâmina)
  const N = 23; // lâminas desenhadas (a aorta adulta tem 40 a 70)
  const passoL = (Y_ADV - Y_IEL) / (N - 1);
  const curva = (y0: number, passo = 10): P[] => {
    const pts: P[] = [];
    for (let x = -10; x <= W + 10; x += passo) pts.push([x, y0 + cv(x)]);
    return pts;
  };
  const entreCurvas = (ya: number, yb: number) => linha([...curva(ya), ...curva(yb).reverse()], true);

  // vasa vasorum: na adventícia e no terço externo da média
  const vasos: [number, number, 'a' | 'v' | 'c', number][] = (
    [
      [235, 515, 'a', 12], [742, 522, 'v', 13], [110, 616, 'a', 15], [392, 602, 'v', 17], [522, 668, 'c', 6.5],
      [620, 630, 'a', 14], [868, 610, 'v', 18], [958, 676, 'c', 6.5], [292, 676, 'c', 6.5],
    ] as [number, number, 'a' | 'v' | 'c', number][]
  ).map(([x, y, t, r]) => [x, y + cv(x), t, r]);
  const pertoDeVaso = (x: number, y: number, m: number) => vasos.some(([vx, vy, , r]) => Math.hypot(vx - x, vy - y) < r + m);

  // lâminas elásticas fenestradas, onduladas (retração da parede na fixação)
  let dLam = '';
  for (let k = 0; k < N; k++) {
    const y0 = Y_IEL + k * passoL;
    const lam = entre(rng, 34, 52);
    const fase = entre(rng, 0, TAU);
    const amp = entre(rng, 1.7, 2.5);
    const yL = (x: number) => y0 + cv(x) + amp * Math.sin((TAU * x) / lam + fase);
    for (let x = -10; x < W + 10; ) {
      const fim = Math.min(W + 10, x + entre(rng, 70, 170));
      const pts: P[] = [];
      for (let xx = x; xx <= fim; xx += 4) pts.push([xx, yL(xx)]);
      dLam += linha(pts);
      x = fim + entre(rng, 4, 7); // fenestra
    }
  }
  // células musculares lisas entre as lâminas: núcleos alongados, paralelos às lâminas
  const nucMedia: El[] = [];
  for (let k = 0; k < N - 1; k++) {
    const yc = Y_IEL + (k + 0.5) * passoL;
    for (let x = entre(rng, -10, 15); x < W + 10; x += entre(rng, 24, 36)) {
      const y = yc + cv(x) + entre(rng, -1, 1);
      if (pertoDeVaso(x, y, 9) || rng() < 0.12) continue;
      nucMedia.push([x, y, entre(rng, 8, 10.5), entre(rng, 1.9, 2.3), giro(x) + entre(rng, -4, 4)]);
    }
  }
  // íntima: endotélio + camada subendotelial (conjuntivo frouxo com algumas células musculares lisas)
  const nucIntima: El[] = [];
  for (let x = entre(rng, 0, 40); x < W; x += entre(rng, 38, 70)) nucIntima.push([x, entre(rng, Y_END + 12, Y_IEL - 10) + cv(x), entre(rng, 6.5, 8.5), 1.9, giro(x) + entre(rng, -10, 10)]);
  let dFibrilas = '';
  for (let k = 0; k < 9; k++) {
    const x = entre(rng, 0, W - 80);
    const y = entre(rng, Y_END + 10, Y_IEL - 8) + cv(x);
    dFibrilas += `M${r1(x)} ${r1(y)}q${r1(entre(rng, 25, 45))} ${r1(entre(rng, -5, 5))} ${r1(entre(rng, 60, 110))} ${r1(entre(rng, -4, 4))}`;
  }
  const nucEnd: El[] = [];
  for (let x = entre(rng, 0, 30); x < W + 10; x += entre(rng, 46, 74)) nucEnd.push([x, Y_END + cv(x) - 1.1, 8, 2.2, giro(x)]);
  // adventícia: conjuntivo denso com feixes colágenos, fibroblastos e algumas fibras elásticas
  const feixes: ReactElement[] = [];
  for (let k = 0; k < 30; k++) {
    const x = entre(rng, -80, W);
    const y = entre(rng, Y_ADV + 10, H + 10) + cv(x);
    const c = entre(rng, 140, 300);
    feixes.push(<path key={k} d={`M${r1(x)} ${r1(y)}q${r1(c / 2)} ${r1(entre(rng, -12, 12))} ${r1(c)} ${r1(entre(rng, -10, 10))}`} stroke="#dc86ad" strokeWidth={r1(entre(rng, 4, 9))} opacity={0.7} />);
  }
  let dElastAdv = '';
  for (let k = 0; k < 8; k++) {
    const x = entre(rng, 0, W - 100);
    const y = entre(rng, Y_ADV + 20, H - 10) + cv(x);
    dElastAdv += `M${r1(x)} ${r1(y)}q${r1(entre(rng, 30, 50))} ${r1(entre(rng, -8, 8))} ${r1(entre(rng, 80, 130))} ${r1(entre(rng, -6, 6))}`;
  }
  const nucAdv: El[] = [];
  for (let t = 0; t < 400 && nucAdv.length < 48; t++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, Y_ADV + 8, H - 4) + cv(x);
    if (pertoDeVaso(x, y, 8) || nucAdv.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 22)) continue;
    nucAdv.push([x, y, entre(rng, 6.5, 9), entre(rng, 1.7, 2.1), giro(x) + entre(rng, -25, 25)]);
  }
  // luz: plasma e algumas hemácias
  const hemLuz: El[] = [];
  for (let t = 0; t < 80 && hemLuz.length < 7; t++) {
    const x = entre(rng, 180, 820);
    const y = entre(rng, 14, Y_END + cv(x) - 14);
    if (hemLuz.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 30)) continue;
    hemLuz.push([x, y, 4.2, 3.4, entre(rng, 0, 180)]);
  }

  return (
    <>
      <E id="lumen">
        <path d={linha([[-10, -10], [W + 10, -10], ...curva(Y_END).reverse()], true)} fill="#fbf4f8" />
        <path d={elipses(hemLuz)} fill={HE.hemacia} />
      </E>
      <E id="tunica-adventicia">
        <path d={linha([...curva(Y_ADV - 2), [W + 10, H + 10], [-10, H + 10]], true)} fill={HE.colageno} />
        <g fill="none" strokeLinecap="round">
          {feixes}
        </g>
        <path d={dElastAdv} stroke="#8c3d6b" strokeWidth={1.1} fill="none" opacity={0.75} />
        <path d={elipses(nucAdv)} fill={HE.nucleo} />
      </E>
      <E id="tunica-media">
        <path d={entreCurvas(Y_IEL - 1, Y_ADV)} fill="#e8a2c2" />
        <path d={elipses(nucMedia)} fill={HE.nucleo} />
      </E>
      <E id="tunica-intima">
        <path d={entreCurvas(Y_END, Y_IEL)} fill={HE.colagenoClaro} />
        <path d={dFibrilas} stroke="#8c3d6b" strokeWidth={0.9} fill="none" opacity={0.7} />
        <path d={elipses(nucIntima)} fill={HE.nucleo} />
      </E>
      <E id="fibras-elasticas">
        {/* traço visível fino; faixa transparente pouco mais larga só para o toque (3,5 un: com lâminas a cada 18,7 un,
            uma faixa de 6 un cobria 1/3 da média, e um toque na média contava como lâmina) */}
        <path d={dLam} stroke="transparent" strokeWidth={3.5} fill="none" />
        <path d={dLam} stroke="#8c3d6b" strokeWidth={2.4} strokeLinecap="round" fill="none" style={{ pointerEvents: 'none' }} />
      </E>
      <E id="vasa-vasorum">
        {vasos.map(([x, y, t, r], i) => (
          <g key={i}>
            {/* bainha de conjuntivo ao redor do vaso: interrompe as lâminas no terço externo da média. Cor do conjuntivo
                vizinho e contorno irregular (um halo claro e redondo lembraria retração ou edema perivascular) */}
            <path d={suave(Array.from({ length: 18 }, (_, k) => {
              const a = (TAU * k) / 18;
              const rr = r + 5 + 1.6 * Math.sin(3 * a + i * 1.7) + 1 * Math.sin(5 * a + i * 0.9);
              return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as P;
            }))} fill={HE.colageno} />
            {vasinho(rng, x, y, t, r, 3.6)}
          </g>
        ))}
      </E>
      <E id="endotelio">
        <path d={linha(curva(Y_END, 8))} stroke="transparent" strokeWidth={10} fill="none" />
        <path d={linha(curva(Y_END + 0.6, 8))} stroke="#cf6f9c" strokeWidth={1.6} fill="none" />
        <path d={elipses(nucEnd)} fill={HE.nucleo} />
      </E>
    </>
  );
}

// =============================================================================================
// 2. Feixe vasculonervoso: artéria muscular, veia e nervo

const PARTES_FEIXE = ['lumen', 'tunica-intima', 'lamina-elastica-interna', 'tunica-media', 'tunica-adventicia', 'veia-de-medio-calibre', 'nervo', 'adipocito-unilocular'];
function LaminaFeixe(rng: Rng) {
  const ax = 272;
  const ay = 362;
  const RL = 78; // raio da luz da artéria
  const fase = entre(rng, 0, TAU);
  const [f2, f3, f4] = [entre(rng, 0, TAU), entre(rng, 0, TAU), entre(rng, 0, TAU)];
  const rIEL = (t: number) => RL + 6 + 3.2 * Math.sin(26 * t + fase);
  const rLum = (t: number) => RL + 0.6 + 1.6 * Math.sin(26 * t + fase);
  const rMed = (t: number) => RL + 58 + 1.5 * Math.sin(9 * t + f2);
  // borda externa irregular: a adventícia continua-se com o conjuntivo ao redor
  const rAdv = (t: number) => rMed(t) + 36 + 5 * Math.sin(5 * t + f3) + 3 * Math.sin(11 * t + f4) + 2 * Math.sin(23 * t + f2) + 1.4 * Math.sin(37 * t + f4);
  const polar = (rf: (t: number) => number, n = 180): P[] =>
    Array.from({ length: n }, (_, i) => {
      const t = (TAU * i) / n;
      const r = rf(t);
      return [ax + Math.cos(t) * r, ay + Math.sin(t) * r];
    });

  // túnica média: camadas concêntricas de músculo liso; núcleos alongados no sentido circunferencial
  const nucMedia: El[] = [];
  for (let j = 0; j < 8; j++) {
    const rho = RL + 11.5 + j * 6;
    const n = Math.round((TAU * rho) / 24);
    const a0 = entre(rng, 0, TAU);
    for (let i = 0; i < n; i++) {
      if (rng() < 0.12) continue;
      const a = a0 + ((i + (j % 2) * 0.5) * TAU) / n + entre(rng, -0.04, 0.04);
      nucMedia.push([ax + Math.cos(a) * rho, ay + Math.sin(a) * rho, entre(rng, 6.8, 9), entre(rng, 1.7, 2.1), (a * 180) / Math.PI + 90 + entre(rng, -3, 3)]);
    }
  }
  // limites celulares discretos na média
  const anelM = [RL + 14.5, RL + 26.5, RL + 38.5, RL + 50.5];
  // endotélio: núcleos achatados nas dobras, fazendo saliência na luz
  const nucEnd: El[] = [];
  for (let k = 0; k < 26; k++) {
    if (rng() < 0.3) continue;
    const t = (Math.PI / 2 - fase + TAU * k) / 26;
    const r = rLum(t) - 0.6;
    nucEnd.push([ax + Math.cos(t) * r, ay + Math.sin(t) * r, 6.2, 2.0, (t * 180) / Math.PI + 90]);
  }
  // adventícia: conjuntivo com feixes colágenos e fibroblastos
  const arcos: ReactElement[] = [];
  for (let k = 0; k < 16; k++) {
    const a = entre(rng, 0, TAU);
    const da = entre(rng, 0.5, 1.1);
    const r = entre(rng, RL + 64, RL + 88);
    const p = (b: number) => `${r1(ax + Math.cos(b) * r)} ${r1(ay + Math.sin(b) * r)}`;
    arcos.push(<path key={k} d={`M${p(a)}A${r1(r)} ${r1(r)} 0 0 1 ${p(a + da)}`} stroke="#dd88ae" strokeWidth={r1(entre(rng, 2.5, 4))} fill="none" />);
  }
  const nucAdv: El[] = [];
  for (let k = 0; k < 26; k++) {
    const a = entre(rng, 0, TAU);
    const r = entre(rng, RL + 63, RL + 90);
    nucAdv.push([ax + Math.cos(a) * r, ay + Math.sin(a) * r, entre(rng, 5.5, 7.5), 1.6, (a * 180) / Math.PI + 90 + entre(rng, -12, 12)]);
  }
  const hemArt: El[] = [];
  for (let t = 0; t < 60 && hemArt.length < 5; t++) {
    const a = entre(rng, 0, TAU);
    const d = Math.sqrt(rng()) * (RL - 12);
    const x = ax + Math.cos(a) * d;
    const y = ay + Math.sin(a) * d;
    if (hemArt.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 9)) continue;
    hemArt.push([x, y, 3.3, 2.7, entre(rng, 0, 180)]);
  }

  // veia satélite: luz ampla e irregular, parede fina (média delgada, adventícia relativamente espessa)
  // luz irregular, achatada de um lado (veias colapsam parcialmente no corte)
  const VL: Forma = { cx: 715, cy: 262, rx: 172, ry: 80, ang: -13, ond: [[2, 0.05, 0.5], [3, 0.09, 1.9], [4, 0.05, 2.6], [5, 0.04, 0.2], [7, 0.02, 1.1]] };
  const VA: Forma = { ...VL, ond: [...(VL.ond ?? []), [4, 0.03, 2.4]] };
  const ocV = criarOcupacao(12);
  const nucVeia: El[] = [];
  const lumV = contorno(VL, 0, 160);
  lumV.forEach((p, i) => {
    if (i % 9) return;
    const q = lumV[(i + 1) % lumV.length];
    const ang = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
    const [lx, ly] = local(VL, p[0], p[1]);
    const d = Math.hypot(lx, ly) || 1;
    const [cx, cy] = [p[0] - (p[0] - VL.cx) / d, p[1] - (p[1] - VL.cy) / d];
    nucVeia.push([cx, cy, 5.5, 1.7, ang]);
    ocV.por(cx, cy, 5);
  });
  contorno(VL, -4, 120).forEach((p, i) => {
    if (i % 3 || rng() < 0.35) return;
    const q = contorno(VL, -4, 120)[(i + 1) % 120];
    nucVeia.push([p[0], p[1], 6, 1.6, (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI]);
  });
  contorno(VA, -17, 90).forEach((p, i) => {
    if (i % 2 || rng() < 0.3) return;
    nucVeia.push([p[0] + entre(rng, -3, 3), p[1] + entre(rng, -3, 3), entre(rng, 5.5, 7), 1.6, entre(rng, -30, 30) - 13]);
  });
  // sangue na luz: hemácias acumuladas na parte de baixo e algumas soltas
  const caixaV: Caixa = [VL.cx - 185, VL.cy - 130, VL.cx + 185, VL.cy + 130];
  const embaixo = (x: number, y: number) => {
    const [lx, ly] = local(VL, x, y);
    return ly > -10 + 14 * Math.sin(lx / 45);
  };
  const hemV = [
    ...semear(rng, ocV, caixaV, 9, 3.6, (x, y) => prof(VL, x, y) > 4.5 && embaixo(x, y), 0.92),
    ...semear(rng, ocV, caixaV, 9, 3.6, (x, y) => prof(VL, x, y) > 4.5 && !embaixo(x, y), 0.06),
  ];

  // nervo: um fascículo com perineuro, endoneuro e fibras mielínicas
  const NV: P = [740, 578];
  const RF = 72;
  const EPI: Forma = { cx: NV[0], cy: NV[1], rx: 94, ry: 90, ond: [[3, 0.04, 1], [5, 0.03, 2]] };
  const fibras: [number, number, number][] = [];
  for (let t = 0; t < 6000; t++) {
    const a = entre(rng, 0, TAU);
    const rr = rng() < 0.25 ? entre(rng, 4.2, 5.6) : entre(rng, 2.6, 4.2);
    const d = Math.sqrt(rng()) * (RF - 4 - rr);
    const x = NV[0] + Math.cos(a) * d;
    const y = NV[1] + Math.sin(a) * d;
    if (fibras.some(([ox, oy, or]) => Math.hypot(ox - x, oy - y) < or + rr + 0.8)) continue;
    fibras.push([x, y, rr]);
  }
  let dMielina = '';
  let dAxonio = '';
  let dSchwann = '';
  fibras.forEach(([x, y, rr]) => {
    dMielina += elipse(x, y, rr, rr);
    dAxonio += elipse(x, y, rr * 0.36, rr * 0.36);
    if (rng() < 0.18) {
      const a = entre(rng, 0, TAU);
      const R1 = rr + 0.9;
      const p1: P = [x + Math.cos(a - 0.8) * R1, y + Math.sin(a - 0.8) * R1];
      const p2: P = [x + Math.cos(a + 0.8) * R1, y + Math.sin(a + 0.8) * R1];
      dSchwann += `M${r1(p1[0])} ${r1(p1[1])}A${r1(R1)} ${r1(R1)} 0 0 1 ${r1(p2[0])} ${r1(p2[1])}Q${r1(x + Math.cos(a) * (R1 + 2.6))} ${r1(y + Math.sin(a) * (R1 + 2.6))} ${r1(p1[0])} ${r1(p1[1])}z`;
    }
  });
  const nucEndoneuro: El[] = [];
  for (let t = 0; t < 300 && nucEndoneuro.length < 8; t++) {
    const a = entre(rng, 0, TAU);
    const d = Math.sqrt(rng()) * (RF - 8);
    const x = NV[0] + Math.cos(a) * d;
    const y = NV[1] + Math.sin(a) * d;
    if (fibras.some(([ox, oy, or]) => Math.hypot(ox - x, oy - y) < or + 3)) continue;
    nucEndoneuro.push([x, y, 4.2, 1.3, entre(rng, 0, 180)]);
  }

  // tecido adiposo em lóbulos ao redor do feixe; o resto é conjuntivo frouxo
  const GORD: Forma[] = [
    { cx: 70, cy: 80, rx: 160, ry: 115, ond: [[3, 0.08, 1]] },
    { cx: 100, cy: 650, rx: 210, ry: 110, ond: [[3, 0.07, 2]] },
    { cx: 470, cy: 675, rx: 120, ry: 70, ond: [[4, 0.06, 0.4]] },
    { cx: 960, cy: 470, rx: 100, ry: 270, ond: [[3, 0.06, 1.3]] },
    { cx: 455, cy: 45, rx: 115, ry: 60, ond: [[3, 0.07, 0.2]] },
  ];
  const semAdip = grade(rng, 42, [-30, -30, W + 30, H + 30], 0.2).filter(
    ([x, y]) =>
      GORD.some((g) => prof(g, x, y) > 6) &&
      Math.hypot(x - ax, y - ay) > 212 &&
      prof(VA, x, y) < -34 &&
      prof(EPI, x, y) < -34,
  );
  const adip = adipocitos(rng, semAdip, 26);
  // fundo: conjuntivo frouxo com feixes colágenos, fibroblastos e capilares
  const fundo: ReactElement[] = [];
  for (let k = 0; k < 34; k++) {
    const x = entre(rng, -100, W);
    const y = entre(rng, 0, H);
    fundo.push(<path key={k} d={`M${r1(x)} ${r1(y)}c${r1(entre(rng, 40, 90))} ${r1(entre(rng, -40, 40))} ${r1(entre(rng, 120, 200))} ${r1(entre(rng, -60, 60))} ${r1(entre(rng, 180, 300))} ${r1(entre(rng, -80, 80))}`} stroke="#efb7cf" strokeWidth={r1(entre(rng, 5, 9))} fill="none" strokeLinecap="round" />);
  }
  const nucFundo: El[] = Array.from({ length: 46 }, () => [entre(rng, 0, W), entre(rng, 0, H), entre(rng, 5.5, 7.5), 1.7, entre(rng, 0, 180)]);
  const caps = [[505, 440], [470, 560], [905, 120], [590, 425], [150, 230], [380, 150]].map(([x, y], i) => vasinho(rng, x, y, 'c', 6, 3.2, i));

  return (
    <>
      <Deco>
        <rect width={W} height={H} fill={HE.colagenoClaro} />
        {fundo}
        <path d={elipses(nucFundo)} fill={HE.nucleo} />
        {caps}
      </Deco>
      <E id="adipocito-unilocular">
        <path d={adip.d} fill={HE.luz} stroke="#d77aa3" strokeWidth={2} strokeLinejoin="round" />
        <path d={elipses(adip.nuc)} fill={HE.nucleo} />
      </E>
      <E id="veia-de-medio-calibre">
        <path d={suave(contorno(VA, -27, 90))} fill={HE.colageno} />
        <path d={suave(contorno(VL, -8, 120))} fill="#e594b8" />
        <path d={suave(lumV)} fill="#f8e7ee" stroke="#c96c97" strokeWidth={1} />
        {bolinhas(hemV, 3.2, HE.hemacia)}
        <path d={elipses(nucVeia)} fill={HE.nucleo} />
      </E>
      <E id="nervo">
        <path d={suave(contorno(EPI, 0, 60))} fill="#efa6c5" />
        <circle cx={NV[0]} cy={NV[1]} r={RF + 5.5} fill="none" stroke="#c9578d" strokeWidth={4.5} />
        <circle cx={NV[0]} cy={NV[1]} r={RF + 1.8} fill="#f3d6e4" stroke="#d97ea6" strokeWidth={1.8} />
        <path d={dMielina} fill="#f8edf3" stroke="#c77ba4" strokeWidth={0.7} />
        <path d={dAxonio} fill="#b0558a" />
        <path d={dSchwann} fill={HE.nucleo} />
        <path d={elipses(nucEndoneuro)} fill={HE.nucleo} />
      </E>
      <E id="tunica-adventicia">
        <path d={suave(polar(rAdv, 240))} fill={HE.colageno} />
        {arcos}
        {/* feixes colágenos que saem da adventícia para o conjuntivo vizinho */}
        <Deco>
          <path
            d={Array.from({ length: 22 }, (_, k) => {
              const a = (TAU * k) / 22 + 0.11 * k;
              const r0 = rAdv(a) - 6;
              const da = (k % 2 ? 1 : -1) * (0.05 + 0.02 * (k % 3));
              const l = 16 + 9 * ((k * 7) % 4);
              return `M${r1(ax + Math.cos(a) * r0)} ${r1(ay + Math.sin(a) * r0)}Q${r1(ax + Math.cos(a + da) * (r0 + l * 0.6))} ${r1(ay + Math.sin(a + da) * (r0 + l * 0.6))} ${r1(ax + Math.cos(a + 2 * da) * (r0 + l))} ${r1(ay + Math.sin(a + 2 * da) * (r0 + l))}`;
            }).join('')}
            stroke={HE.colageno}
            strokeWidth={3.2}
            strokeLinecap="round"
            fill="none"
          />
        </Deco>
        <path d={elipses(nucAdv)} fill={HE.nucleo} />
        <Deco>
          {vasinho(rng, ax + Math.cos(0.7) * (RL + 78), ay + Math.sin(0.7) * (RL + 78), 'a', 7, 2.6, 'vv1')}
          {vasinho(rng, ax + Math.cos(3.9) * (RL + 80), ay + Math.sin(3.9) * (RL + 80), 'v', 7.5, 2.6, 'vv2')}
        </Deco>
      </E>
      <E id="tunica-media">
        <path d={linha(polar(rMed, 180), true)} fill={HE.musculo} />
        <g fill="none" stroke="#d06a98" strokeWidth={0.6} opacity={0.6} strokeDasharray="18 10">
          {anelM.map((r) => (
            <circle key={r} cx={ax} cy={ay} r={r} />
          ))}
        </g>
        <path d={elipses(nucMedia)} fill={HE.nucleo} />
        {/* lâmina elástica externa: mais fina e descontínua, no limite com a adventícia */}
        <Deco>
          <path d={linha(polar((t) => rMed(t) - 1.2 + 1.4 * Math.sin(40 * t), 360), true)} stroke="#b9467f" strokeWidth={1.3} fill="none" strokeDasharray="30 9" />
        </Deco>
      </E>
      <E id="tunica-intima">
        <path d={linha(polar(rIEL, 312), true)} fill="#f3cddd" />
      </E>
      <E id="lumen">
        <path d={linha(polar(rLum, 312), true)} fill="#fbf4f8" />
        <path d={elipses(hemArt)} fill={HE.hemacia} />
      </E>
      <E id="tunica-intima">
        {/* faixa de toque mais larga que a íntima (que é muito delgada na artéria muscular) */}
        <path d={linha(polar((t) => rLum(t) + 0.5, 312), true)} stroke="transparent" strokeWidth={11} fill="none" />
        <path d={linha(polar(rLum, 312), true)} stroke="#cf6f9c" strokeWidth={1.2} fill="none" />
        <path d={elipses(nucEnd)} fill={HE.nucleo} />
      </E>
      <E id="lamina-elastica-interna">
        {/* no HE: linha ondulada, vítrea e eosinófila; aqui levemente realçada */}
        <path d={linha(polar(rIEL, 312), true)} stroke="transparent" strokeWidth={6} fill="none" />
        <path d={linha(polar(rIEL, 312), true)} stroke="#c23f7d" strokeWidth={2.8} fill="none" style={{ pointerEvents: 'none' }} />
        <path d={linha(polar((t) => rIEL(t) - 0.4, 312), true)} stroke="#f6c2da" strokeWidth={0.7} fill="none" style={{ pointerEvents: 'none' }} />
      </E>
    </>
  );
}

// =============================================================================================
// 3. Linfonodo

const PARTES_LINFONODO = ['capsula', 'seio-subcapsular', 'trabecula', 'foliculo-linfoide', 'centro-germinativo', 'paracortex', 'venula-endotelio-alto', 'cordao-medular', 'seio-medular'];
function LaminaLinfonodo(rng: Rng) {
  const NO: Forma = { cx: 500, cy: 372, rx: 472, ry: 328, ond: [[3, 0.02, 0.7], [5, 0.012, 2.1]] };
  const pf = (x: number, y: number) => prof(NO, x, y);
  const MED: Forma = { cx: 500, cy: 592, rx: 330, ry: 258, ond: [[4, 0.05, 0.3], [7, 0.035, 1.7], [11, 0.02, 0.9]] };
  const hilo: P[] = [[418, 720], [444, 676], [471, 652], [500, 645], [529, 652], [556, 676], [582, 720]];
  const noHilo = (x: number, y: number, m = 0) => dentroPoligono([x, y], hilo) || distLinha([x, y], hilo) < m;
  const anel = (d: number, t: number): P => {
    const r = raioForma(NO, t) - d;
    return [NO.cx + Math.cos(t) * r, NO.cy + Math.sin(t) * r];
  };

  // folículos linfoides no córtex superficial, logo abaixo do seio subcapsular
  const t0 = (150 * Math.PI) / 180;
  const t1 = (390 * Math.PI) / 180;
  const amostras: { t: number; s: number }[] = [];
  let total = 0;
  let prev = anel(85, t0);
  for (let t = t0; t <= t1; t += 0.004) {
    const p = anel(85, t);
    total += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
    amostras.push({ t, s: total });
  }
  const tEm = (s: number) => (amostras.find((a) => a.s >= s) ?? amostras[amostras.length - 1]).t;
  const tamanhos = [52, 60, 46, 63, 66, 60, 47, 58, 52, 49];
  const primarios = new Set([2, 6]);
  const vaos = [46, 24, 46, 24, 47, 25, 46, 24, 46];
  const fols: { f: Forma; gc: Forma | null }[] = [];
  const trabT: number[] = [];
  let cur = 18;
  tamanhos.forEach((rf, i) => {
    const rt = rf * 1.12;
    const rr = rf * 0.9;
    const sc = cur + rt;
    if (sc + rt > total - 10) return;
    const t = tEm(sc);
    const c = anel(30 + rr, t);
    const a = anel(30 + rr, t - 0.01);
    const b = anel(30 + rr, t + 0.01);
    const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    const f: Forma = { cx: c[0], cy: c[1], rx: rt, ry: rr, ang, ond: [[3, 0.03, entre(rng, 0, TAU)]] };
    let gc: Forma | null = null;
    if (!primarios.has(i)) {
      const dn = Math.hypot(NO.cx - c[0], NO.cy - c[1]);
      const off = 0.14 * rr;
      gc = { cx: c[0] + ((NO.cx - c[0]) / dn) * off, cy: c[1] + ((NO.cy - c[1]) / dn) * off, rx: rt * 0.64, ry: rr * 0.62, ang, ond: [[3, 0.04, entre(rng, 0, TAU)]] };
    }
    fols.push({ f, gc });
    cur = sc + rt + (vaos[i] ?? 30);
    if ((vaos[i] ?? 0) >= 40) trabT.push(tEm(sc + rt + (vaos[i] ?? 0) / 2));
  });
  const noFoliculo = (x: number, y: number, m = 0) => fols.some(({ f }) => prof(f, x, y) > -m);

  // trabéculas: da cápsula para dentro, nos intervalos entre folículos, até a medula
  const trabs: P[][] = trabT.map((t) => {
    // parte da cápsula na mesma linha radial do intervalo entre dois folículos e curva aos poucos para o hilo
    const p0 = anel(3, t);
    const nx = NO.cx - p0[0];
    const ny = NO.cy - p0[1];
    const nl = Math.hypot(nx, ny);
    const pts: P[] = [p0];
    let p = p0;
    for (let k = 1; k < 34; k++) {
      const f = Math.min(1, Math.max(0, (k - 9) / 10));
      const hx = 500 - p[0];
      const hy = 660 - p[1];
      const hl = Math.hypot(hx, hy) || 1;
      let dx = (nx / nl) * (1 - f) + (hx / hl) * f;
      let dy = (ny / nl) * (1 - f) + (hy / hl) * f;
      const dl = Math.hypot(dx, dy);
      dx /= dl;
      dy /= dl;
      p = [p[0] + dx * 11, p[1] + dy * 11];
      if (noFoliculo(p[0], p[1], 13) || prof(MED, p[0], p[1]) > 8) break;
      pts.push(p);
    }
    return pts;
  });
  const distTrab = (x: number, y: number) => Math.min(Infinity, ...trabs.map((l) => distLinha([x, y], l)));

  // medula: contorno limitado pelo seio subcapsular
  const medula: P[] = Array.from({ length: 160 }, (_, i) => {
    const t = (TAU * i) / 160;
    const rm = raioForma(MED, t);
    let r = 0;
    while (r < rm && pf(MED.cx + Math.cos(t) * (r + 2), MED.cy + Math.sin(t) * (r + 2)) > 28) r += 2;
    return [MED.cx + Math.cos(t) * r, MED.cy + Math.sin(t) * r];
  });
  const naMedula = (x: number, y: number, m = 0) => prof(MED, x, y) > m && pf(x, y) > 28 + m;
  // cordões medulares: rede de vizinhança relativa (cordões que se ramificam e se anastomosam)
  const nos = grade(rng, 56, [140, 300, 860, 720], 0.3).filter(([x, y]) => prof(MED, x, y) > 10 && pf(x, y) > 36 && !noHilo(x, y, 22));
  const arestas: { a: P; b: P; w: number }[] = [];
  const dd = (p: P, q: P) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  for (let i = 0; i < nos.length; i++)
    for (let j = i + 1; j < nos.length; j++) {
      const d = dd(nos[i], nos[j]);
      if (d > 115) continue;
      if (nos.some((k, m) => m !== i && m !== j && Math.max(dd(nos[i], k), dd(nos[j], k)) < d)) continue;
      const meio: P = [(nos[i][0] + nos[j][0]) / 2, (nos[i][1] + nos[j][1]) / 2];
      if (noHilo(meio[0], meio[1], 14)) continue;
      arestas.push({ a: nos[i], b: nos[j], w: entre(rng, 19, 27) });
    }
  // nas bordas da medula, os cordões continuam no paracórtex
  nos.forEach((p) => {
    const pm = prof(MED, p[0], p[1]);
    if (pm > 82) return;
    const dl = dd(p, [MED.cx, MED.cy]) || 1;
    const e: P = [p[0] + ((p[0] - MED.cx) / dl) * (pm + 16), p[1] + ((p[1] - MED.cy) / dl) * (pm + 16)];
    if (pf(e[0], e[1]) > 40) arestas.push({ a: p, b: e, w: entre(rng, 19, 25) });
  });
  const folgaCordao = (x: number, y: number) => Math.min(Infinity, ...arestas.map(({ a, b, w }) => distSeg([x, y], a, b) - w / 2));
  const classes = [21, 24, 27];
  const dCordoes = classes.map((c) =>
    arestas
      .filter(({ w }) => classes.reduce((m, k) => (Math.abs(k - w) < Math.abs(m - w) ? k : m)) === c)
      .map(({ a, b }) => `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`)
      .join(''),
  );

  const paracortex = (x: number, y: number, m = 0) =>
    pf(x, y) > 27 + m && !noFoliculo(x, y, m) && prof(MED, x, y) < -m && distTrab(x, y) > 12.5 + m && !noHilo(x, y, m);

  const oc = criarOcupacao(16);
  // vênulas de endotélio alto no paracórtex
  const hevs: [number, number, number][] = [];
  for (let t = 0; t < 4000 && hevs.length < 12; t++) {
    const x = entre(rng, 60, 940);
    const y = entre(rng, 110, 600);
    if (!paracortex(x, y, 22) || hevs.some(([hx, hy]) => Math.hypot(hx - x, hy - y) < 72)) continue;
    const r = entre(rng, 15, 18.5);
    hevs.push([x, y, r]);
    oc.por(x, y, r + 1.5);
  }
  // macrófagos nos seios
  const macro: [number, number, number][] = [];
  for (let t = 0; t < 2400 && macro.length < 46; t++) {
    const sub = t % 2 === 0;
    const x = entre(rng, 20, 980);
    const y = entre(rng, 40, 700);
    const ok = sub ? pf(x, y) > 15.5 && pf(x, y) < 24.5 : naMedula(x, y, 4) && folgaCordao(x, y) > 8 && !noHilo(x, y, 10);
    if (!ok || !oc.livre(x, y, 7)) continue;
    oc.por(x, y, 7);
    macro.push([x, y, sub ? 5.4 : 6.4]);
  }
  // plasmócitos nos cordões medulares
  const plasmo = semear(rng, oc, [160, 300, 860, 720], 17, 5.8, (x, y) => folgaCordao(x, y) < -5.5 && naMedula(x, y, -10) && !noHilo(x, y, 6), 0.45);
  // centros germinativos (células maiores e mais claras; macrófagos de corpos tingíveis)
  const centros = fols.map(({ gc }, i) => (gc ? <g key={i}>{centroGerminativo(rng, oc, gc, [NO.cx, NO.cy + 120])}</g> : null));
  // células dendríticas interdigitantes (núcleos claros) no paracórtex
  const idc = semear(rng, oc, [40, 40, 960, 700], 30, 4.6, (x, y) => paracortex(x, y, 3), 0.55);
  // linfócitos pequenos: manto e folículos primários (mais densos), paracórtex e cordões, raros nos seios
  const area: Caixa = [10, 40, 990, 700];
  const manto = semear(rng, oc, area, 7.75, 3.1, (x, y) => noFoliculo(x, y, -3.2) && !fols.some(({ gc }) => gc && prof(gc, x, y) > -3));
  const para = semear(rng, oc, area, 8.9, 3.4, (x, y) => paracortex(x, y, 3.2));
  const cordoes = semear(rng, oc, [140, 300, 860, 720], 8.6, 3.4, (x, y) => folgaCordao(x, y) < -3.4 && naMedula(x, y, -12) && !noHilo(x, y, 4) && !noFoliculo(x, y, 3), 0.92);
  const seios = semear(rng, oc, area, 10, 3.4, (x, y) => {
    const p = pf(x, y);
    return (p > 16.5 && p < 23.5) || (naMedula(x, y, 4) && folgaCordao(x, y) > 4 && !noHilo(x, y, 6));
  }, 0.12);

  // seio subcapsular: fibras reticulares atravessando o seio e endotélio de revestimento
  let dRet = '';
  const revest: El[] = [];
  for (let t = 0; t < TAU; t += 0.034) {
    const a = anel(13.8, t + entre(rng, -0.01, 0.01));
    const b = anel(26.2, t + entre(rng, -0.012, 0.012));
    dRet += `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`;
  }
  for (let t = 0; t < TAU; t += 0.085) {
    for (const [d, dt] of [[14.2, 0], [25.9, 0.04]] as [number, number][]) {
      const p = anel(d, t + dt);
      const q = anel(d, t + dt + 0.01);
      revest.push([p[0], p[1], 4.4, 1.2, (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI]);
    }
  }
  const nucCaps: El[] = [];
  for (let t = 0; t < TAU; t += entre(rng, 0.045, 0.08)) {
    const p = anel(6.5 + entre(rng, -2, 2), t);
    const q = anel(6.5, t + 0.01);
    nucCaps.push([p[0], p[1], 6, 1.5, (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI]);
  }
  const fibrasCaps = [4, 9].map((d) => linha(Array.from({ length: 241 }, (_, i) => anel(d, (TAU * i) / 240)))).join('');
  // seios medulares: fibras reticulares curtas
  let dRetMed = '';
  for (let t = 0; t < 1400; t++) {
    const x = entre(rng, 170, 830);
    const y = entre(rng, 320, 700);
    if (!naMedula(x, y, 3) || folgaCordao(x, y) < 5 || noHilo(x, y, 8)) continue;
    const a = entre(rng, 0, TAU);
    const l = entre(rng, 7, 13);
    const e: P = [x + Math.cos(a) * l, y + Math.sin(a) * l];
    if (folgaCordao(e[0], e[1]) < 2) continue;
    dRetMed += `M${r1(x)} ${r1(y)}L${r1(e[0])} ${r1(e[1])}`;
  }
  const nucTrab: El[] = [];
  trabs.forEach((l) =>
    l.forEach((p, i) => {
      if (i % 2 || i === 0) return;
      const q = l[Math.min(l.length - 1, i + 1)];
      nucTrab.push([p[0], p[1], 5.5, 1.4, (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI]);
    }),
  );
  // gordura ao redor do linfonodo
  const semAdip = grade(rng, 44, [-30, -30, W + 30, H + 30], 0.2).filter(([x, y]) => pf(x, y) < -22);
  const adip = adipocitos(rng, semAdip, 27);
  // vasos linfáticos aferentes: atravessam a cápsula e desembocam no seio subcapsular
  const aferentes = [4.1, 5.25].map((t, i) => {
    const a = anel(-48, t - 0.05);
    const b = anel(15, t);
    const m: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return (
      <g key={i}>
        <path d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`} stroke="#d995b8" strokeWidth={11} />
        <path d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`} stroke="#fbf5f8" strokeWidth={8} />
        {/* válvula */}
        <path d={`M${r1(m[0] - 4)} ${r1(m[1] - 3)}l4 5M${r1(m[0] + 4)} ${r1(m[1] - 3)}l-4 5`} stroke="#d995b8" strokeWidth={1.2} fill="none" />
      </g>
    );
  });

  return (
    <>
      <Deco>
        <rect width={W} height={H} fill="#f2d9e6" />
        <path d={adip.d} fill={HE.luz} stroke="#e2a2c0" strokeWidth={1.6} strokeLinejoin="round" />
        <path d={elipses(adip.nuc)} fill={HE.nucleo} />
      </Deco>
      <E id="capsula">
        <path d={suave(contorno(NO, 0, 160))} fill={HE.colageno} />
        <path d={fibrasCaps} stroke="#dc86ad" strokeWidth={1.1} fill="none" />
        <path d={elipses(nucCaps)} fill={HE.nucleo} />
        <Deco>{aferentes}</Deco>
      </E>
      <E id="seio-subcapsular">
        <path d={suave(contorno(NO, 13, 160))} fill="#f7eef3" />
        <path d={dRet} stroke="#dcb3c9" strokeWidth={0.7} fill="none" />
        <path d={elipses(revest)} fill="#5b4a9a" />
      </E>
      <E id="paracortex">
        <path d={suave(contorno(NO, 27, 160))} fill="#d3bad8" />
      </E>
      <E id="seio-subcapsular">
        {/* seios peritrabeculares: ligam o seio subcapsular aos seios medulares */}
        {trabs.map((l, i) => (
          <g key={i}>
            <path d={linha(l.slice(1))} stroke="#f7eef3" strokeWidth={24} strokeLinejoin="round" fill="none" />
            <circle cx={r1(l[l.length - 1][0])} cy={r1(l[l.length - 1][1])} r={12} fill="#f7eef3" />
          </g>
        ))}
      </E>
      <E id="trabecula">
        {trabs.map((l, i) => (
          <path key={i} d={linha(l)} stroke="#ea98bb" strokeWidth={11} strokeLinejoin="round" fill="none" />
        ))}
        {trabs.map((l, i) => (
          <circle key={`f${i}`} cx={r1(l[l.length - 1][0])} cy={r1(l[l.length - 1][1])} r={5.5} fill="#ea98bb" />
        ))}
        <path d={elipses(nucTrab)} fill={HE.nucleo} />
      </E>
      <E id="seio-medular">
        <path d={suave(medula)} fill="#f7eef3" />
        <path d={dRetMed} stroke="#dcb3c9" strokeWidth={0.7} fill="none" />
      </E>
      <E id="cordao-medular">
        {dCordoes.map((d, i) => (
          <path key={i} d={d} stroke="#d0b3d6" strokeWidth={classes[i]} strokeLinecap="round" fill="none" />
        ))}
        {plasmo.map(([x, y], i) => {
          const a = entre(rng, 0, 180);
          const ar = (a * Math.PI) / 180;
          return (
            <g key={i}>
              <ellipse cx={r1(x)} cy={r1(y)} rx={5.3} ry={4} transform={`rotate(${r1(a)} ${r1(x)} ${r1(y)})`} fill="#b48ad0" />
              {/* halo claro justanuclear (complexo de Golgi) e núcleo excêntrico com cromatina em grumos ("roda de carroça") */}
              <circle cx={r1(x - Math.cos(ar) * 1.5)} cy={r1(y - Math.sin(ar) * 1.5)} r={1.5} fill="#dccbe8" />
              <circle cx={r1(x + Math.cos(ar) * 1.9)} cy={r1(y + Math.sin(ar) * 1.9)} r={2.6} fill="#2f2466" />
              {bolinhas(
                [0, 1, 2, 3, 4].map((k) => [x + Math.cos(ar) * 1.9 + Math.cos(ar + k * 1.257) * 1.5, y + Math.sin(ar) * 1.9 + Math.sin(ar + k * 1.257) * 1.5] as P),
                0.45,
                '#7f6db8',
              )}
            </g>
          );
        })}
      </E>
      <E id="seio-medular">
        {macro.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={r1(x)} cy={r1(y)} r={r} fill="#efc6d8" stroke="#dba5bf" strokeWidth={0.6} />
            <ellipse cx={r1(x + 1)} cy={r1(y)} rx={2.8} ry={2.1} fill="#6d5ca9" />
          </g>
        ))}
      </E>
      <E id="foliculo-linfoide">
        {fols.map(({ f }, i) => (
          <path key={i} d={suave(contorno(f, 0, 72))} fill="#c3a9cf" />
        ))}
      </E>
      <E id="centro-germinativo">{centros}</E>
      <Deco>
        {bolinhas(idc, 3.6, '#a395d3', 'idc')}
        {bolinhas(manto, 2.7, '#2c2163', 'manto')}
        {bolinhas([...para, ...cordoes, ...seios], 3.0, '#33276b', 'para')}
      </Deco>
      <E id="venula-endotelio-alto">
        {hevs.map(([x, y, r], i) => {
          const n = Math.round(r * 0.62);
          const rl = r * 0.32;
          const a0 = entre(rng, 0, TAU);
          let dc = '';
          const nuc: El[] = [];
          for (let k = 0; k < n; k++) {
            const a = a0 + (TAU * k) / n;
            const b = a0 + (TAU * (k + 1)) / n;
            dc += cunha(r1(x), r1(y), r1(rl), r1(r - 1), a, b);
            const am = (a + b) / 2;
            const rm = rl + 3.6;
            nuc.push([x + Math.cos(am) * rm, y + Math.sin(am) * rm, 3.0, 2.6, (am * 180) / Math.PI]);
          }
          // linfócitos atravessando a parede, entre as células endoteliais, e um na luz
          const migr: P[] = [0, Math.floor(n / 2)].map((k) => {
            const a = a0 + (TAU * (k + 1)) / n;
            return [x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3)];
          });
          return (
            <g key={i}>
              <circle cx={r1(x)} cy={r1(y)} r={r1(r)} fill="#e9c3d8" stroke="#c98bb0" strokeWidth={0.9} />
              <path d={dc} fill="#ebc6da" stroke="#d6a2bf" strokeWidth={0.5} />
              <path d={elipses(nuc)} fill="#8778c0" />
              <circle cx={r1(x)} cy={r1(y)} r={r1(rl)} fill={HE.luz} />
              {bolinhas([...migr, [x + 0.5, y]], 2.4, '#2c2163')}
            </g>
          );
        })}
      </E>
      <E id="capsula">
        {/* hilo: a cápsula se espessa; entram a artéria, saem a veia e o vaso linfático eferente */}
        <path d={suave(hilo, false) + 'L582 720L418 720Z'} fill={HE.colageno} />
        <Deco>
          {vasinho(rng, 488, 689, 'a', 13, 3.0, 'ha')}
          {vasinho(rng, 532, 688, 'v', 15, 3.0, 'hv')}
          <circle cx={460} cy={690} r={11} fill="#fbf5f8" stroke="#d995b8" strokeWidth={1.4} />
          {bolinhas([[456, 688], [464, 693]], 2.4, '#33276b')}
        </Deco>
      </E>
    </>
  );
}

// =============================================================================================
// 4. Baço

const PARTES_BACO = ['capsula', 'trabecula', 'polpa-branca', 'centro-germinativo', 'arteria-central', 'zona-marginal', 'polpa-vermelha', 'sinusoides-esplenicos'];
function LaminaBaco(rng: Rng) {
  const sup = (x: number) => 12 + 3 * Math.sin(x / 70);
  const capInf = (x: number) => 42 + 4 * Math.sin(x / 55 + 1);
  // polpa branca: nódulo com centro germinativo e arteríola central excêntrica; PALS em corte transversal e longitudinal
  const FOL: Forma = { cx: 318, cy: 338, rx: 106, ry: 94, ang: -12, ond: [[3, 0.03, 1], [5, 0.02, 2]] };
  const A1: P = [394, 262];
  const PALS1: Forma = { cx: A1[0], cy: A1[1], rx: 52, ry: 48, ang: 30, ond: [[3, 0.04, 0.4]] };
  const GC: Forma = { cx: 300, cy: 352, rx: 57, ry: 51, ang: -12, ond: [[3, 0.04, 2.2]] };
  const PALS2: Forma = { cx: 772, cy: 470, rx: 66, ry: 60, ang: 10, ond: [[3, 0.05, 1.2], [4, 0.03, 0.3]] };
  const A3: [P, P] = [[395, 645], [590, 560]];
  const W3 = 42;
  const ZM = 30; // largura da zona marginal ao redor do nódulo
  const ZP = 22; // ao redor das bainhas periarteriolares
  const T1: P[] = [[630, 20], [668, 120], [702, 208], [736, 292]];
  const T2: Forma = { cx: 110, cy: 520, rx: 40, ry: 36, ond: [[3, 0.05, 0.5]] };
  const d3 = (x: number, y: number) => distSeg([x, y], A3[0], A3[1]);
  const branca = (x: number, y: number) => Math.max(prof(FOL, x, y), prof(PALS1, x, y), prof(PALS2, x, y), W3 - d3(x, y));
  const marginal = (x: number, y: number) => Math.max(prof(FOL, x, y) + ZM, prof(PALS1, x, y) + ZP, prof(PALS2, x, y) + ZP, W3 + ZP - d3(x, y));
  const trab = (x: number, y: number) => Math.max(15 - distLinha([x, y], T1), prof(T2, x, y));
  const vermelha = (x: number, y: number, m = 0) => y > capInf(x) + m && marginal(x, y) < -m && trab(x, y) < -m;

  // sinusoides: canais alongados e curvos, de parede fina, separados pelos cordões esplênicos
  const sins: { pts: P[]; w: number; c: P }[] = [];
  for (let t = 0; t < 12000 && sins.length < 300; t++) {
    const cx = entre(rng, -10, W + 10);
    const cy = entre(rng, 50, H + 10);
    const a = entre(rng, 0, Math.PI);
    const L = entre(rng, 20, 78);
    const w = [15, 19, 23][Math.floor(rng() * 3)];
    const k = entre(rng, -0.45, 0.45);
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const pts = qbez([cx - (ux * L) / 2, cy - (uy * L) / 2], [cx - uy * k * L * 0.5, cy + ux * k * L * 0.5], [cx + (ux * L) / 2, cy + (uy * L) / 2], 6);
    if (!pts.every(([x, y]) => vermelha(x, y, w / 2 + 3))) continue;
    const perto = sins.filter((s) => Math.hypot(s.c[0] - cx, s.c[1] - cy) < 120);
    if (perto.some((s) => Math.min(...pts.map((p) => distLinha(p, s.pts)), ...s.pts.map((p) => distLinha(p, pts))) < (s.w + w) / 2 + 9)) continue;
    sins.push({ pts, w, c: [cx, cy] });
  }
  const folgaSin = (x: number, y: number) => {
    let m = Infinity;
    for (const s of sins) if (Math.abs(s.c[0] - x) < 70 && Math.abs(s.c[1] - y) < 70) m = Math.min(m, distLinha([x, y], s.pts) - s.w / 2);
    return m;
  };
  const oc = criarOcupacao(16);
  // endotélio dos sinusoides: células alongadas cujos núcleos fazem saliência na luz
  const nucSin: El[] = [];
  const hemSin: P[] = [];
  sins.forEach((s) => {
    const seg = s.pts.slice(1).map((p, i) => Math.hypot(p[0] - s.pts[i][0], p[1] - s.pts[i][1]));
    const comp = seg.reduce((a, b) => a + b, 0);
    const em = (u: number): { p: P; t: P } => {
      let i = 0;
      while (i < seg.length - 1 && u > seg[i]) u -= seg[i++];
      const a = s.pts[i];
      const b = s.pts[i + 1];
      const f = Math.min(1, u / (seg[i] || 1));
      return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], t: [(b[0] - a[0]) / (seg[i] || 1), (b[1] - a[1]) / (seg[i] || 1)] };
    };
    const meia = (s.w - 2.4) / 2;
    for (let u = entre(rng, 2, 10), lado = 1; u < comp; u += entre(rng, 13, 19), lado = -lado) {
      const { p, t } = em(u);
      const x = p[0] - t[1] * lado * (meia - 1);
      const y = p[1] + t[0] * lado * (meia - 1);
      nucSin.push([x, y, 4.2, 1.8, (Math.atan2(t[1], t[0]) * 180) / Math.PI]);
      oc.por(x, y, 2.6);
    }
    // fileiras de hemácias; a segunda fileira, defasada meio passo, para que caibam lado a lado sem sobreposição
    const faixas = s.w === 15 ? [0] : s.w === 19 ? [-3.6, 3.6] : [-4.6, 4.6];
    for (let u = -4; u < comp + 4; u += 7.2)
      for (const [fi, f] of faixas.entries()) {
        if (rng() > 0.94) continue;
        const uu = Math.max(0, Math.min(comp, u + fi * 3.6 + entre(rng, -0.6, 0.6)));
        const { p, t } = em(uu);
        const off = f + entre(rng, -0.8, 0.8);
        // com as pontas cortadas, a hemácia não pode passar da extremidade do canal
        if (Math.abs(off) > meia - 3.3 || uu < 3.4 || uu > comp - 3.4) continue;
        const x = p[0] - t[1] * off;
        const y = p[1] + t[0] * off;
        if (!oc.livre(x, y, 3.5)) continue;
        oc.por(x, y, 3.5);
        hemSin.push([x, y]);
      }
  });
  const dSin = [15, 19, 23].map((w) =>
    sins
      .filter((s) => s.w === w)
      .map((s) => `M${r1(s.pts[0][0])} ${r1(s.pts[0][1])}Q${r1(2 * s.pts[3][0] - (s.pts[0][0] + s.pts[6][0]) / 2)} ${r1(2 * s.pts[3][1] - (s.pts[0][1] + s.pts[6][1]) / 2)} ${r1(s.pts[6][0])} ${r1(s.pts[6][1])}`)
      .join(''),
  );
  // cordões esplênicos (de Billroth): macrófagos, células reticulares, linfócitos, plasmócitos e muitas hemácias
  const nosCordao = (x: number, y: number, r: number) => vermelha(x, y, r) && folgaSin(x, y) > r + 1.5;
  const celCord = semear(rng, oc, [0, 40, W, H], 16, 6.8, (x, y) => nosCordao(x, y, 6.8), 0.42);
  const linfCord: P[] = [];
  const macCord: P[] = [];
  const plasCord: P[] = [];
  const retCord: El[] = [];
  celCord.forEach(([x, y]) => {
    const u = rng();
    if (u < 0.42) linfCord.push([x, y]);
    else if (u < 0.68) macCord.push([x, y]);
    else if (u < 0.82) plasCord.push([x, y]);
    else retCord.push([x, y, 4.6, 1.8, entre(rng, 0, 180)]);
  });
  const hemCord = semear(rng, oc, [0, 40, W, H], 9, 3.6, (x, y) => nosCordao(x, y, 3.6), 0.8);
  // zona marginal: linfócitos médios (mais citoplasma, menos densos), macrófagos e hemácias esparsas
  const ehMarginal = (x: number, y: number, m: number) => marginal(x, y) > m && branca(x, y) < -m && trab(x, y) < -m;
  const macZM = semear(rng, oc, [0, 40, W, H], 34, 6.5, (x, y) => ehMarginal(x, y, 6.5), 0.4);
  const hemZM = semear(rng, oc, [0, 40, W, H], 16, 3.6, (x, y) => ehMarginal(x, y, 3.6), 0.25);
  const linfZM = semear(rng, oc, [0, 40, W, H], 9.6, 3.7, (x, y) => ehMarginal(x, y, 3.7));
  // arteríolas centrais (reservadas antes dos linfócitos da polpa branca)
  oc.por(A1[0], A1[1], 15.5);
  oc.por(PALS2.cx, PALS2.cy, 14.5);
  const d3a = (x: number, y: number) => d3(x, y) < 15;
  const centro = centroGerminativo(rng, oc, GC, A1);
  const linfPB = semear(rng, oc, [0, 40, W, H], 7.9, 3.15, (x, y) => branca(x, y) > 3 && prof(GC, x, y) < -3 && !d3a(x, y));

  // arteríola em corte longitudinal (na bainha periarteriolar longitudinal)
  const [p, q] = A3;
  const comp3 = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const ux = (q[0] - p[0]) / comp3;
  const uy = (q[1] - p[1]) / comp3;
  const ang3 = (Math.atan2(uy, ux) * 180) / Math.PI;
  const nucA3: El[] = [];
  const hemA3: P[] = [];
  for (let u = 6; u < comp3 - 4; u += 9) {
    for (const lado of [-1, 1]) {
      // músculo liso circular visto de perfil: núcleos curtos, transversais ao eixo
      const off = lado * 9;
      nucA3.push([p[0] + ux * (u + (lado > 0 ? 4 : 0)) - uy * off, p[1] + uy * (u + (lado > 0 ? 4 : 0)) + ux * off, 3.4, 1.3, ang3 + 90]);
    }
    if (rng() < 0.55) hemA3.push([p[0] + ux * (u + 2), p[1] + uy * (u + 2)]);
  }
  for (let u = 10; u < comp3 - 10; u += 34) for (const lado of [-1, 1]) nucA3.push([p[0] + ux * (u + lado * 8) - uy * lado * 4.4, p[1] + uy * (u + lado * 8) + ux * lado * 4.4, 5, 1.2, ang3]);
  const arteriola = (c: P, r: number, key: number) => {
    const nuc: El[] = [];
    const a0 = entre(rng, 0, TAU);
    for (let k = 0; k < 4; k++) {
      const a = a0 + (TAU * k) / 4;
      nuc.push([c[0] + Math.cos(a) * (r * 0.68), c[1] + Math.sin(a) * (r * 0.68), 4.6, 1.4, (a * 180) / Math.PI + 90]);
    }
    nuc.push([c[0] + Math.cos(a0 + 0.8) * (r * 0.38), c[1] + Math.sin(a0 + 0.8) * (r * 0.38), 3.6, 1.1, ((a0 + 0.8) * 180) / Math.PI + 90]);
    return (
      <g key={key}>
        <circle cx={c[0]} cy={c[1]} r={r} fill={HE.musculo} stroke="#c9578d" strokeWidth={0.8} />
        <circle cx={c[0]} cy={c[1]} r={r * 0.42} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={0.7} />
        {bolinhas([[c[0] + 0.5, c[1]]], 2.9, HE.hemacia)}
        <path d={elipses(nuc)} fill={HE.nucleo} />
      </g>
    );
  };
  // cápsula (conjuntivo denso com algumas células musculares lisas; mesotélio na superfície) e trabéculas
  const nucCaps: El[] = [];
  for (let x = entre(rng, 0, 20); x < W; x += entre(rng, 34, 52)) nucCaps.push([x, sup(x) + 1.6, 6, 1.5, (Math.atan(Math.cos(x / 70) * (3 / 70)) * 180) / Math.PI]);
  for (let k = 0; k < 34; k++) {
    const x = entre(rng, 0, W);
    nucCaps.push([x, entre(rng, sup(x) + 7, capInf(x) - 5), entre(rng, 6, 8), 1.6, entre(rng, -8, 8)]);
  }
  const t1 = faixa(
    Array.from({ length: 30 }, (_, i) => {
      const f = i / 29;
      const s = f * (T1.length - 1);
      const k = Math.min(T1.length - 2, Math.floor(s));
      const g = s - k;
      return [T1[k][0] + (T1[k + 1][0] - T1[k][0]) * g, T1[k][1] + (T1[k + 1][1] - T1[k][1]) * g] as P;
    }),
    (f) => 19 - 6 * f,
  );
  const nucTrab: El[] = [];
  for (let i = 3; i < 29; i += 2) {
    const s = (i / 29) * (T1.length - 1);
    const k = Math.min(T1.length - 2, Math.floor(s));
    const g = s - k;
    const tg = t1.tg[i];
    nucTrab.push([T1[k][0] + (T1[k + 1][0] - T1[k][0]) * g + entre(rng, -6, 6) * tg[1], T1[k][1] + (T1[k + 1][1] - T1[k][1]) * g - entre(rng, -6, 6) * tg[0], 6, 1.5, (Math.atan2(tg[1], tg[0]) * 180) / Math.PI]);
  }
  for (let k = 0; k < 6; k++) {
    const a = entre(rng, 0, TAU);
    nucTrab.push([T2.cx + Math.cos(a) * 30, T2.cy + Math.sin(a) * 28, 5.5, 1.4, (a * 180) / Math.PI + 90]);
  }

  return (
    <>
      <Deco>
        <rect width={W} height={H} fill={HE.vidro} />
      </Deco>
      <E id="polpa-vermelha">
        <rect y={30} width={W} height={H - 30} fill="#e39eb5" />
        {bolinhas(hemCord, 3.2, HE.hemacia, 'h')}
        {macCord.map(([x, y], i) => (
          <circle key={i} cx={r1(x)} cy={r1(y)} r={6.2} fill="#f1cad9" stroke="#dca5bf" strokeWidth={0.6} />
        ))}
        <path d={elipses(macCord.map(([x, y]) => [x + 1, y, 2.9, 2.2, entre(rng, 0, 180)] as El))} fill="#6d5ca9" />
        {plasCord.map(([x, y], i) => (
          <ellipse key={i} cx={r1(x)} cy={r1(y)} rx={5.2} ry={4} fill="#b48ad0" />
        ))}
        {bolinhas(plasCord.map(([x, y]) => [x + 1.8, y] as P), 2.5, '#2f2466', 'pn')}
        <path d={elipses(retCord)} fill="#7a6bb8" />
        {bolinhas(linfCord, 2.9, '#33276b', 'l')}
      </E>
      <E id="sinusoides-esplenicos">
        {dSin.map((d, i) => (
          <g key={i}>
            {/* pontas cortadas: o canal sai do plano do corte (pontas arredondadas pareciam tubos fechados) */}
            <path d={d} stroke="#c97aa0" strokeWidth={[15, 19, 23][i]} fill="none" />
            <path d={d} stroke="#efc3d2" strokeWidth={[15, 19, 23][i] - 2.4} fill="none" />
          </g>
        ))}
        {bolinhas(hemSin, 3.2, HE.hemacia)}
        <path d={elipses(nucSin)} fill={HE.nucleo} />
      </E>
      <E id="zona-marginal">
        <path d={suave(contorno(FOL, -ZM, 90)) + suave(contorno(PALS1, -ZP, 60)) + suave(contorno(PALS2, -ZP, 72))} fill="#dbc3db" />
        <path d={`M${A3[0][0]} ${A3[0][1]}L${A3[1][0]} ${A3[1][1]}`} stroke="#dbc3db" strokeWidth={2 * (W3 + ZP)} strokeLinecap="round" />
        {macZM.map(([x, y], i) => (
          <circle key={i} cx={r1(x)} cy={r1(y)} r={6} fill="#efd3e2" stroke="#dcb7cc" strokeWidth={0.6} />
        ))}
        <path d={elipses(macZM.map(([x, y]) => [x + 1, y, 2.8, 2.1, 30] as El))} fill="#6d5ca9" />
        {bolinhas(hemZM, 3.2, HE.hemacia, 'h')}
        {bolinhas(linfZM, 3.2, '#4b3a8f', 'l')}
      </E>
      <E id="polpa-branca">
        <path d={suave(contorno(FOL, 0, 90)) + suave(contorno(PALS1, 0, 60)) + suave(contorno(PALS2, 0, 72))} fill="#c6aed2" />
        <path d={`M${A3[0][0]} ${A3[0][1]}L${A3[1][0]} ${A3[1][1]}`} stroke="#c6aed2" strokeWidth={2 * W3} strokeLinecap="round" />
      </E>
      <E id="centro-germinativo">{centro}</E>
      <Deco>{bolinhas(linfPB, 2.75, '#2c2163')}</Deco>
      <E id="arteria-central">
        {arteriola(A1, 14.5, 1)}
        {arteriola([PALS2.cx, PALS2.cy], 13.5, 2)}
        <path d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={HE.musculo} strokeWidth={26} />
        <path d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={HE.luz} strokeWidth={9} />
        {bolinhas(hemA3, 2.9, HE.hemacia)}
        <path d={elipses(nucA3)} fill={HE.nucleo} />
      </E>
      <E id="trabecula">
        <path d={linha(t1.pol, true)} fill={HE.colageno} />
        <path d={suave(contorno(T2, 0, 48))} fill={HE.colageno} />
        <path d={elipses(nucTrab)} fill={HE.nucleo} />
        {/* veia trabecular: só endotélio apoiado no conjuntivo da trabécula, sem parede muscular própria */}
        <Deco>
          <ellipse cx={T2.cx} cy={T2.cy} rx={21} ry={12} fill="#f8e7ee" stroke="#c96c97" strokeWidth={0.9} />
          {bolinhas([[T2.cx - 8, T2.cy + 2], [T2.cx, T2.cy - 3], [T2.cx + 8, T2.cy + 3], [T2.cx + 1, T2.cy + 5]], 3, HE.hemacia)}
          <path d={elipses([[T2.cx - 12, T2.cy - 9.5, 5, 1.2, -20], [T2.cx + 13, T2.cy + 8.5, 5, 1.2, -25]])} fill={HE.nucleo} />
        </Deco>
      </E>
      <E id="capsula">
        <path d={linha([...Array.from({ length: 51 }, (_, i) => [i * 20, sup(i * 20)] as P), ...Array.from({ length: 51 }, (_, i) => [W - i * 20, capInf(W - i * 20)] as P)], true)} fill={HE.colageno} />
        <path d={linha(Array.from({ length: 51 }, (_, i) => [i * 20, (sup(i * 20) + capInf(i * 20)) / 2] as P))} stroke="#dc86ad" strokeWidth={1.2} fill="none" />
        <path d={elipses(nucCaps)} fill={HE.nucleo} />
      </E>
    </>
  );
}

// =============================================================================================
// 5. Timo

const PARTES_TIMO = ['capsula', 'septo-conjuntivo', 'cortex-timico', 'medula-timica', 'corpusculo-de-hassall', 'celula-epitelial-reticular', 'macrofago'];
function LaminaTimo(rng: Rng) {
  const sup = (x: number) => 7 + 2 * Math.sin(x / 80);
  const capInf = (x: number) => 26 + 3 * Math.sin(x / 60 + 0.8);
  const sementes: P[] = [[262, 262], [668, 226], [452, 552], [866, 522], [52, 575], [990, 175]];
  const caixa: P[] = [[-40, 20], [W + 40, 20], [W + 40, H + 40], [-40, H + 40]];
  const lobulos = sementes.map((s) => voronoi(s, sementes, caixa));
  const centros = lobulos.map(centroide);
  // septos interlobulares: arestas comuns a dois lóbulos
  const septos: [P, P][] = [];
  for (let i = 0; i < lobulos.length; i++)
    for (let j = i + 1; j < lobulos.length; j++) {
      const pol = lobulos[i];
      const naBissetriz = (p: P) => Math.abs(Math.hypot(p[0] - sementes[i][0], p[1] - sementes[i][1]) - Math.hypot(p[0] - sementes[j][0], p[1] - sementes[j][1])) < 0.5;
      pol.forEach((a, k) => {
        const b = pol[(k + 1) % pol.length];
        if (!naBissetriz(a) || !naBissetriz(b) || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return;
        const u = a[1] < b[1] ? a : b;
        let v = a[1] < b[1] ? b : a;
        // septo incompleto entre os lóbulos 0 e 1: parte da cápsula e para no meio; abaixo, córtex e medula contínuos
        if (i === 0 && j === 1) v = [u[0] + (v[0] - u[0]) * 0.47, u[1] + (v[1] - u[1]) * 0.47];
        septos.push([u, v]);
      });
    }
  const distSepto = (x: number, y: number) => Math.min(Infinity, ...septos.map(([a, b]) => distSeg([x, y], a, b)));
  /** Traçado levemente sinuoso do septo (±4 un), que passa pelas pontas e pelo meio do segmento reto. */
  const sinuoso = (a: P, b: P, i: number): P[] => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const [nx, ny] = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    return Array.from({ length: 25 }, (_, k) => {
      const u = k / 24;
      const o = 3 * Math.sin(TAU * 2 * u + (i % 2) * Math.PI) + 1.2 * Math.sin(TAU * 3 * u);
      return [a[0] + (b[0] - a[0]) * u + nx * o, a[1] + (b[1] - a[1]) * u + ny * o];
    });
  };
  // vasos nos septos (na metade de cada septo) com bainha de conjuntivo
  const vasosSepto: [number, number, 'a' | 'v', number][] = septos
    .filter(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]) > 90)
    .map(([a, b], i) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, i % 2 ? 'v' : 'a', i % 2 ? 8.5 : 7]);
  // medula: núcleo claro de cada lóbulo; ponte de medula sob o septo incompleto (lóbulos 0 e 1)
  const medulas = lobulos.map((pol, i) => {
    const c = centros[i];
    const fs = [entre(rng, 0, TAU), entre(rng, 0, TAU), entre(rng, 0, TAU)];
    const raios = Array.from({ length: 120 }, (_, k) => {
      const t = (TAU * k) / 120;
      return 0.45 * raioPoligono(pol, c, t) * (1 + 0.12 * Math.sin(3 * t + fs[0]) + 0.08 * Math.sin(5 * t + fs[1]) + 0.05 * Math.sin(8 * t + fs[2]));
    });
    return { c, raios };
  });
  const raioMed = (m: { raios: number[] }, t: number) => {
    const f = ((((t / TAU) * 120) % 120) + 120) % 120;
    const k = Math.floor(f);
    return m.raios[k] + (m.raios[(k + 1) % 120] - m.raios[k]) * (f - k);
  };
  const ponte: P[] = [centros[0], [468, 284], centros[1]];
  const naMedula = (x: number, y: number, m = 0) =>
    medulas.some((md) => Math.hypot(x - md.c[0], y - md.c[1]) < raioMed(md, Math.atan2(y - md.c[1], x - md.c[0])) - m) || distLinha([x, y], ponte) < 30 - m;
  const noLobulo = (x: number, y: number) => lobulos.some((pol) => dentroPoligono([x, y], pol));
  const foraSepto = (x: number, y: number, m: number) =>
    y > capInf(x) + m && distSepto(x, y) > 8 + m && vasosSepto.every(([vx, vy, , r]) => Math.hypot(vx - x, vy - y) > r + 4 + m);
  const noCortex = (x: number, y: number, m = 0) => noLobulo(x, y) && foraSepto(x, y, m) && !naMedula(x, y, -m);

  // corpúsculos de Hassall: na medula, células epiteliais reticulares achatadas em camadas concêntricas
  const hassall: [number, number, number][] = [];
  const quantos = [3, 2, 3, 2, 1, 0];
  medulas.forEach((md, i) => {
    let n = 0;
    for (let t = 0; t < 300 && n < quantos[i]; t++) {
      const r = i === 0 && n === 0 ? 33 : entre(rng, 15, 26);
      const a = entre(rng, 0, TAU);
      const d = Math.sqrt(rng()) * raioMed(md, a) * 0.8;
      const x = md.c[0] + Math.cos(a) * d;
      const y = md.c[1] + Math.sin(a) * d;
      if (x < 15 || x > W - 15 || y > H - 15) continue;
      if (raioMed(md, Math.atan2(y - md.c[1], x - md.c[0])) - Math.hypot(x - md.c[0], y - md.c[1]) < r + 8) continue;
      if (hassall.some(([hx, hy, hr]) => Math.hypot(hx - x, hy - y) < r + hr + 16)) continue;
      hassall.push([x, y, r]);
      n++;
    }
  });
  const foraHassall = (x: number, y: number, m: number) => hassall.every(([hx, hy, hr]) => Math.hypot(hx - x, hy - y) > hr + m);

  const oc = criarOcupacao(16);
  // vasos na junção corticomedular
  const vasosCM: [number, number][] = [];
  medulas.forEach((md) =>
    [0.9, 3.6].forEach((a) => {
      const r = raioMed(md, a) - 9;
      const x = md.c[0] + Math.cos(a) * r;
      const y = md.c[1] + Math.sin(a) * r;
      if (x > 10 && x < W - 10 && y < H - 10 && y > 40 && naMedula(x, y, 4) && foraHassall(x, y, 12)) {
        vasosCM.push([x, y]);
        oc.por(x, y, 8);
      }
    }),
  );
  const tudo: Caixa = [0, 20, W, H];
  // células epiteliais reticulares (núcleo grande, claro, com nucléolo; citoplasma eosinófilo)
  const erc = [
    ...semear(rng, oc, tudo, 22, 9.5, (x, y) => naMedula(x, y, 9) && foraHassall(x, y, 13) && foraSepto(x, y, 9), 0.5),
    ...semear(rng, oc, tudo, 44, 9, (x, y) => noCortex(x, y, 9), 0.13),
  ];
  // macrófagos do córtex (fagocitam timócitos em apoptose), esparsos: 2–3 por campo de 10×. Muitos, entre células
  // monótonas, dariam o padrão de "céu estrelado", que é da patologia (linfoma de Burkitt, parte dos linfoblásticos T)
  const mac = semear(rng, oc, tudo, 48, 8.6, (x, y) => noCortex(x, y, 8.6), 0.12);
  const timCortex = semear(rng, oc, tudo, 7.6, 3.05, (x, y) => noCortex(x, y, 3.05));
  const timMedula = semear(rng, oc, tudo, 10.5, 3.3, (x, y) => naMedula(x, y, 3.3) && foraHassall(x, y, 3.3) && foraSepto(x, y, 3.3), 0.8);

  const nucErc: El[] = erc.map(([x, y]) => [x, y, 4.6, 3.4, entre(rng, 0, 180)]);
  const citErc: El[] = erc.map(([x, y], i) => [x, y, 8.6, 6.6, nucErc[i][4]]);
  const nucMac: El[] = [];
  const fragMac: El[] = [];
  mac.forEach(([x, y]) => {
    const an = entre(rng, 0, TAU);
    const [nx, ny] = [x + Math.cos(an) * 2.6, y + Math.sin(an) * 2.6];
    nucMac.push([nx, ny, 2.9, 2.2, (an * 180) / Math.PI + 90]);
    for (let t = 0, n = 0; t < 40 && n < 3; t++) {
      const a = entre(rng, 0, TAU);
      const d = entre(rng, 2.4, 5.2);
      const r = entre(rng, 1, 1.7);
      const fx = x + Math.cos(a) * d;
      const fy = y + Math.sin(a) * d;
      if (Math.hypot(fx - nx, fy - ny) < r + 3.5 || fragMac.slice(-n).some(([ox, oy, or]) => Math.hypot(ox - fx, oy - fy) < or + r + 0.6)) continue;
      fragMac.push([fx, fy, r, r, 0]);
      n++;
    }
  });
  // septos: fibroblastos alinhados
  const nucSepto: El[] = [];
  septos.forEach(([a, b]) => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    for (let u = entre(rng, 10, 30); u < l - 8; u += entre(rng, 26, 40)) {
      const o = entre(rng, -3.5, 3.5);
      nucSepto.push([a[0] + ((b[0] - a[0]) * u) / l - ((b[1] - a[1]) / l) * o, a[1] + ((b[1] - a[1]) * u) / l + ((b[0] - a[0]) / l) * o, 6, 1.5, ang]);
    }
  });
  const nucCaps: El[] = Array.from({ length: 28 }, () => {
    const x = entre(rng, 0, W);
    return [x, entre(rng, sup(x) + 5, capInf(x) - 4), entre(rng, 6, 8), 1.5, entre(rng, -6, 6)];
  });

  return (
    <>
      <Deco>
        <rect width={W} height={H} fill={HE.vidro} />
      </Deco>
      <E id="cortex-timico">
        {lobulos.map((pol, i) => (
          <path key={i} d={linha(pol, true)} fill="#ab92c4" />
        ))}
      </E>
      <E id="macrofago">
        {mac.map(([x, y], i) => (
          <circle key={i} cx={r1(x)} cy={r1(y)} r={7.6} fill="#f2e0ea" stroke="#d9bdd0" strokeWidth={0.5} />
        ))}
        <path d={elipses(nucMac)} fill={HE.nucleoClaro} />
        <path d={elipses(fragMac)} fill="#291e5c" />
      </E>
      <E id="medula-timica">
        {medulas.map((md, i) => (
          <path
            key={i}
            d={suave(
              md.raios.filter((_, k) => k % 2 === 0).map((r, k) => {
                const t = (TAU * k * 2) / 120;
                return [md.c[0] + Math.cos(t) * r, md.c[1] + Math.sin(t) * r] as P;
              }),
            )}
            fill="#edd0e1"
          />
        ))}
        <path d={linha(ponte)} stroke="#edd0e1" strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {vasosCM.map(([x, y], i) => vasinho(rng, x, y, 'v', 6.5, 2.7, i))}
      </E>
      <E id="celula-epitelial-reticular">
        <path d={elipses(citErc)} fill="#f0d5e3" />
        <path d={elipses(nucErc)} fill="#9a8bcb" />
        {bolinhas(erc.map(([x, y]) => [x + 0.8, y - 0.6] as P), 1, '#4b3a8f')}
      </E>
      <Deco>
        {bolinhas(timCortex, 2.65, '#271c5a', 'c')}
        {bolinhas(timMedula, 2.9, '#3a2d78', 'm')}
      </Deco>
      <E id="corpusculo-de-hassall">
        {hassall.map(([x, y, r], i) => {
          // camadas externas: células achatadas, enroladas, com núcleos em crescente; centro queratinizado, eosinófilo
          const camadas = [r - 1, r - 6.5, r - 12];
          let dc = '';
          const nuc: El[] = [];
          camadas.forEach((rc, k) => {
            if (rc < 9) return;
            const n = Math.max(5, Math.round((TAU * rc) / 15));
            const a0 = entre(rng, 0, TAU);
            for (let m = 0; m < n; m++) {
              const a = a0 + (TAU * m) / n;
              const b = a0 + (TAU * (m + 1)) / n;
              dc += cunha(r1(x), r1(y), r1(rc - 5.5), r1(rc), a, b);
              if (k < 2 && m % 2 === 0) {
                const am = (a + b) / 2;
                nuc.push([x + Math.cos(am) * (rc - 2.8), y + Math.sin(am) * (rc - 2.8), Math.min(5, rc * 0.25), 1.2, (am * 180) / Math.PI + 90]);
              }
            }
          });
          const nucleo = Math.max(5, r - 17.5);
          return (
            <g key={i}>
              <circle cx={r1(x)} cy={r1(y)} r={r} fill="#f0b4cc" />
              <path d={dc} fill="#f3bfd4" stroke="#d987ab" strokeWidth={0.7} />
              <circle cx={r1(x)} cy={r1(y)} r={r1(nucleo)} fill="#e88db4" />
              <circle cx={r1(x)} cy={r1(y)} r={r1(nucleo * 0.62)} fill="none" stroke="#d26f9c" strokeWidth={0.8} />
              <path d={elipses(nuc)} fill="#5d4c9e" />
            </g>
          );
        })}
      </E>
      <E id="septo-conjuntivo">
        {septos.map(([a, b], i) => (
          <path key={i} d={linha(sinuoso(a, b, i))} stroke={HE.colageno} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ))}
        {vasosSepto.map(([x, y, t, r], i) => (
          <g key={i}>
            <circle cx={r1(x)} cy={r1(y)} r={r + 4} fill={HE.colageno} />
            {vasinho(rng, x, y, t, r, 2.8)}
          </g>
        ))}
        <path d={elipses(nucSepto)} fill={HE.nucleo} />
      </E>
      <E id="capsula">
        <path d={linha([...Array.from({ length: 51 }, (_, i) => [i * 20, sup(i * 20)] as P), ...Array.from({ length: 51 }, (_, i) => [W - i * 20, capInf(W - i * 20)] as P)], true)} fill={HE.colageno} />
        <path d={elipses(nucCaps)} fill={HE.nucleo} />
      </E>
    </>
  );
}

// =============================================================================================
// 6. Pele fina (couro cabeludo)

const PARTES_PELE_FINA = ['epiderme', 'derme', 'hipoderme', 'foliculo-piloso', 'haste-do-pelo', 'papila-do-pelo', 'glandula-sebacea', 'musculo-eretor-do-pelo', 'glandula-sudoripara-ecrina'];
function LaminaPeleFina(rng: Rng) {
  const sup = (x: number) => 40 + 1.2 * Math.sin(x / 47);
  const jun = (x: number) => 98 + 4.5 * Math.sin(x / 36 + 0.6) + 2 * Math.sin(x / 13);
  const hip = (x: number) => 548 + 14 * Math.sin(x / 85 + 2);
  // folículos em corte longitudinal (oblíquos, como no couro cabeludo) e transversal
  const fols = [
    { p0: [250, 42] as P, dir: [280, 558] as P, comp: 650 },
    { p0: [560, 42] as P, dir: [240, 528] as P, comp: 620 },
  ].map((f) => {
    const l = Math.hypot(f.dir[0], f.dir[1]);
    const ax: P = [f.dir[0] / l, f.dir[1] / l];
    const g = (xl: number, yl: number): P => [f.p0[0] + xl * ax[1] + yl * ax[0], f.p0[1] - xl * ax[0] + yl * ax[1]];
    return { ...f, ax, g, s: ax[0] / ax[1], rot: (Math.atan2(-ax[0], ax[1]) * 180) / Math.PI, fim: g(0, f.comp) };
  });
  const transversais: P[] = [[95, 612], [300, 650], [660, 642], [935, 330]];
  const sudoriparas = [
    { c: [636, 470] as P, rx: 66, ry: 52 },
    { c: [165, 468] as P, rx: 68, ry: 50 },
  ];
  const pertoFoliculo = (x: number, y: number, m: number) =>
    fols.some((f) => distSeg([x, y], f.p0, f.fim) < 40 + m) || transversais.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 38 + m);
  const pertoSudoripara = (x: number, y: number, m: number) => sudoriparas.some(({ c, rx, ry }) => Math.hypot((x - c[0]) / (rx + m), (y - c[1]) / (ry + m)) < 1);

  // ---- epiderme fina: basal, espinhosa (poucas camadas), granulosa (1–2), córnea delgada; sem lúcida
  const naAbertura = (x: number, y: number) => fols.some((f) => Math.abs((x - f.p0[0]) * f.ax[1] - (y - f.p0[1]) * f.ax[0]) < 36 && y < 122);
  const basais: El[] = [];
  const nucBasal: El[] = [];
  for (let x = 2; x < W; x += 9.5) {
    const y = jun(x) - 6.5;
    if (naAbertura(x, y)) continue;
    const ang = (Math.atan2(jun(x + 1) - jun(x - 1), 2) * 180) / Math.PI;
    basais.push([x, y, 4.6, 6.4, ang]);
    nucBasal.push([x, y + 0.5, 2.3, 3.3, ang]);
  }
  const ocE = criarOcupacao(12);
  // espinhosas: células poligonais justapostas (Voronoi), achatando-se para cima
  const esp = semear(rng, ocE, [0, 50, W, 104], 10.5, 4.6, (x, y) => y > sup(x) + 16 && y < jun(x) - 14 && !naAbertura(x, y));
  let dEsp = '';
  esp.forEach((c) => {
    dEsp += linha(voronoi(c, esp, circulo(c, 7.6, 10), 20), true);
  });
  const granulosas: El[] = [];
  const graos: P[] = [];
  for (let x = 0; x < W + 10; x += 15) {
    const y = sup(x) + 12.5;
    if (naAbertura(x, y)) continue;
    granulosas.push([x, y, 7.6, 2.8, 0]);
    for (let k = 0; k < 4; k++) graos.push([x + entre(rng, -5.5, 5.5), y + entre(rng, -1.2, 1.2)]);
  }
  const nucGran: El[] = granulosas.filter((_, i) => i % 2 === 0).map(([x, y]) => [x, y, 2.6, 1.3, 0]);
  const cornea = [2.5, 5, 7.5].map((d) => linha(Array.from({ length: 101 }, (_, i) => [i * 10, sup(i * 10) + d + 0.6 * Math.sin(i * 1.7)] as P))).join('');
  const topoEpi = Array.from({ length: 101 }, (_, i) => [i * 10, sup(i * 10)] as P);
  const baseEpi = Array.from({ length: 201 }, (_, i) => [W - i * 5, jun(W - i * 5)] as P);

  // ---- derme: papilar (frouxa, capilares) e reticular (feixes colágenos grossos)
  const feixes: ReactElement[] = [];
  for (let k = 0; k < 52; k++) {
    const x = entre(rng, -80, W);
    const y = entre(rng, 140, 470);
    const a = entre(rng, -0.3, 0.3);
    const c = entre(rng, 110, 220);
    feixes.push(<path key={k} d={`M${r1(x)} ${r1(y)}q${r1((Math.cos(a) * c) / 2)} ${r1((Math.sin(a) * c) / 2 + entre(rng, -14, 14))} ${r1(Math.cos(a) * c)} ${r1(Math.sin(a) * c)}`} stroke="#df8bb1" strokeWidth={r1(entre(rng, 6, 12))} opacity={0.55} fill="none" strokeLinecap="round" />);
  }
  let dFibrasPap = '';
  for (let k = 0; k < 26; k++) {
    const x = entre(rng, 0, W - 60);
    const y = jun(x) + entre(rng, 6, 24);
    dFibrasPap += `M${r1(x)} ${r1(y)}q${r1(entre(rng, 15, 30))} ${r1(entre(rng, -5, 5))} ${r1(entre(rng, 40, 70))} ${r1(entre(rng, -4, 4))}`;
  }
  const nucDerme: El[] = [];
  for (let t = 0; t < 900 && nucDerme.length < 64; t++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, jun(x) + 8, hip(x) - 6);
    if (pertoFoliculo(x, y, 6) || pertoSudoripara(x, y, 8) || nucDerme.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 30)) continue;
    nucDerme.push([x, y, entre(rng, 5.5, 7.5), 1.6, entre(rng, -30, 30)]);
  }
  const vasosDerme: ReactElement[] = [];
  for (let t = 0, n = 0; t < 400 && n < 8; t++) {
    const x = entre(rng, 20, W - 20);
    const papilar = n < 4;
    const y = papilar ? jun(x) + entre(rng, 9, 16) : entre(rng, 170, hip(x) - 30);
    if (pertoFoliculo(x, y, 18) || pertoSudoripara(x, y, 18) || x < 0) continue;
    vasosDerme.push(vasinho(rng, x, y, papilar ? 'c' : n % 2 ? 'a' : 'v', papilar ? 5 : entre(rng, 9, 13), 3, n));
    n++;
  }

  // ---- hipoderme: lóbulos de adipócitos com septos conjuntivos
  const semAdip = grade(rng, 62, [-40, 470, W + 40, H + 40], 0.2).filter(([x, y]) => y > hip(x) + 30);
  const adip = adipocitos(rng, semAdip, 38);

  // ---- folículo piloso em corte longitudinal (coordenadas locais: y ao longo do eixo, da superfície ao bulbo)
  const desenhoFol = fols.map((f, fi) => {
    const L = f.comp;
    const yB = L - 52;
    const s = f.s;
    const ocF = criarOcupacao(10);
    // bainha conjuntiva e membrana vítrea; bainha radicular externa (clara, rica em glicogênio)
    const bainha = `M-39 84L39 84L39 ${yB - 40}C39 ${yB - 20} 55 ${yB - 15} 55 ${yB}A55 53 0 0 1 -55 ${yB}C-55 ${yB - 15} -39 ${yB - 20} -39 ${yB - 40}Z`;
    const externa = `M-33.5 ${r1(-33.5 * s)}L33.5 ${r1(33.5 * s)}L33.5 ${yB - 40}C33.5 ${yB - 22} 49 ${yB - 16} 49 ${yB}A49 47 0 0 1 -49 ${yB}C-49 ${yB - 16} -33.5 ${yB - 22} -33.5 ${yB - 40}Z`;
    const vitrea = `M-33.5 84L-33.5 ${yB - 40}C-33.5 ${yB - 22} -49 ${yB - 16} -49 ${yB}A49 47 0 0 0 49 ${yB}C49 ${yB - 16} 33.5 ${yB - 22} 33.5 ${yB - 40}L33.5 84`;
    // infundíbulo: epitélio igual ao da epiderme, contínuo com ela; canal com queratina
    const infund = `M-33.5 ${r1(-33.5 * s)}L33.5 ${r1(33.5 * s)}L33.5 124L-33.5 124Z`;
    const canal = `M-16 ${r1(-16 * s - 1)}L16 ${r1(16 * s - 1)}L16 112L11.5 150L-11.5 150L-16 112Z`;
    const queratina = [-14.2, 14.2].map((x) => `M${x} ${r1(x * s + 2)}C${x - 1} 40 ${x + 1} 80 ${x * 0.86} 125`).join('');
    // bainha radicular interna (eosinófila, com grânulos de tri-hialina), da região do istmo para baixo
    const interna = `M-11.5 150L-17 176L-17 ${L - 128}L17 ${L - 128}L17 176L11.5 150Z`;
    // haste: sai pela superfície (corte do pelo) e nasce na matriz acima da papila
    const haste = `M-11 -58L11 -58L11 ${L - 150}Q11 ${L - 116} 0 ${L - 112}Q-11 ${L - 116} -11 ${L - 150}Z`;
    const pigmento = semear(rng, ocF, [-9, -55, 9, L - 190], 4.4, 1.2, (x) => Math.abs(x) < 8.6, 0.4);
    // bulbo: matriz (células basófilas que proliferam) em volta da papila dérmica
    const matriz = `M-17 ${L - 135}C-30 ${L - 110} -48 ${yB - 25} -47 ${yB}A47 47 0 0 0 47 ${yB}C48 ${yB - 25} 30 ${L - 110} 17 ${L - 135}Z`;
    const papila = `M-8 ${L + 4}L-9 ${L - 16}C-22 ${L - 30} -20 ${L - 78} 0 ${L - 84}C20 ${L - 78} 22 ${L - 30} 9 ${L - 16}L8 ${L + 4}Z`;
    const naPapila = (x: number, y: number) => y > L - 88 && Math.abs(x) < (y > L - 16 ? 11 : 22 * Math.sin(Math.min(1, (y - (L - 86)) / 50) * (Math.PI / 2)) + 3);
    const naMatriz = (x: number, y: number) =>
      (y > yB ? Math.hypot(x, y - yB) < 45 : y > L - 133 && Math.abs(x) < 17 + (30 * (y - (L - 133))) / (yB - (L - 133))) && !naPapila(x, y);
    const nucMatriz = semear(rng, ocF, [-48, L - 140, 48, L], 6.6, 2.6, (x, y) => naMatriz(x, y));
    const melanina: P[] = [];
    for (let k = 0; k < 14; k++) melanina.push([entre(rng, -13, 13), entre(rng, L - 104, L - 90)]);
    const nucPapila: El[] = [[-6, L - 60, 2.6, 1.6, 70], [5, L - 48, 2.6, 1.6, 110], [-3, L - 34, 2.4, 1.5, 80], [8, L - 68, 2.2, 1.4, 60], [-10, L - 42, 2.2, 1.4, 100]];
    // bainha externa: núcleos em várias fileiras; infundíbulo: queratinócitos
    const nucExt = semear(rng, ocF, [-32, 126, 32, yB - 46], 7.6, 2.9, (x, y) => Math.abs(x) > 18.6 && Math.abs(x) < 31.4 && y < yB - 46);
    const nucInf = semear(rng, ocF, [-33, -20, 33, 124], 10, 3.4, (x, y) => Math.abs(x) > 18.2 && Math.abs(x) < 31.2 && y > x * s + 5);
    // infundíbulo como a epiderme: camada granulosa (células achatadas com querato-hialina) e córnea revestindo o canal
    const granInf: El[] = [];
    const graosInf: P[] = [];
    for (const lado of [-1, 1])
      for (let y = lado * 17.3 * s + 8; y < 106; y += 6.6) {
        const x = lado * 17.3;
        if (nucInf.some(([nx, ny]) => Math.hypot(nx - x, ny - y) < 4.4)) continue;
        granInf.push([x, y, 3, 1.15, 90]);
        graosInf.push([x - 0.3, y - 1.3], [x + 0.3, y + 1.2]);
      }
    const corneaInf = [-15, 15].map((x) => `M${x} ${r1(x * s + 1)}L${x} 110`).join('');
    const triHialina = semear(rng, ocF, [-17, L - 260, 17, L - 132], 4.2, 1.3, (x) => Math.abs(x) > 12.4 && Math.abs(x) < 16, 0.55);
    const nucBainha: El[] = [];
    for (let y = 100; y < yB - 30; y += entre(rng, 18, 28)) for (const lado of [-1, 1]) nucBainha.push([lado * 36.4, y + entre(rng, -4, 4), 1.4, 6, 0]);
    const tf = `translate(${f.p0[0]} ${f.p0[1]}) rotate(${r1(f.rot)})`;
    const grad = `pele-fina-haste-${fi}`;
    return {
      folic: (
        <g transform={tf}>
          <path d={bainha} fill="#e9a0c0" />
          <path d={externa} fill="#f4dde7" />
          <path d={infund} fill="#efbcd3" />
          <path d={vitrea} stroke="#e0709e" strokeWidth={1.6} fill="none" />
          <path d={elipses(nucBainha)} fill={HE.nucleo} />
          {bolinhas(nucExt, 2.5, '#5d4ea0', 'e')}
          {bolinhas(nucInf, 2.4, HE.nucleo, 'i')}
          <path d={canal} fill="#fbeff4" />
          <path d={corneaInf} stroke="#f4bfd5" strokeWidth={2} fill="none" />
          <path d={corneaInf} stroke="#e48fb4" strokeWidth={0.7} strokeDasharray="14 5" fill="none" />
          <path d={elipses(granInf)} fill="#e7a0bf" stroke={HE.citoplasmaEscuro} strokeWidth={0.5} />
          {bolinhas(graosInf, 0.55, '#2f2466', 'g')}
          <path d={queratina} stroke="#eeb0ca" strokeWidth={1} fill="none" />
          <path d={interna} fill="#e8799f" />
          {bolinhas(triHialina, 0.95, '#b8245a', 't')}
          <path d={matriz} fill="#ab8fd2" />
          {bolinhas(nucMatriz, 2.2, '#35286f', 'm')}
          {bolinhas(melanina, 1, '#6b4226', 'mel')}
        </g>
      ),
      haste: (
        <g transform={tf}>
          <defs>
            <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1={0} y1={L - 260} x2={0} y2={L - 112}>
              <stop offset="0" stopColor="#d6a066" />
              <stop offset="1" stopColor="#ecd3b0" />
            </linearGradient>
          </defs>
          <path d={haste} fill={`url(#${grad})`} stroke="#a87440" strokeWidth={0.8} />
          {/* melanina (pigmento natural do pelo, não corante) */}
          {bolinhas(pigmento, 0.8, '#76482a')}
        </g>
      ),
      papila: (
        <g transform={tf}>
          <path d={papila} fill="#f2d4e2" />
          <path d={elipses(nucPapila)} fill={HE.nucleoClaro} />
          <circle cx={2} cy={L - 22} r={4.4} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={0.7} />
          {bolinhas([[2, L - 22]], 2.6, HE.hemacia)}
        </g>
      ),
      tf,
    };
  });

  // ---- glândula sebácea (lado do ângulo obtuso, entre o folículo e o músculo eretor), em coordenadas locais
  const lobos: Forma[] = [
    { cx: -84, cy: 152, rx: 40, ry: 31, ang: 15, ond: [[3, 0.04, 1]] },
    { cx: -91, cy: 213, rx: 42, ry: 33, ang: -8, ond: [[3, 0.04, 2]] },
  ];
  const desenhoSeb = desenhoFol.map((_, fi) => {
    let dCel = '';
    const nucSeb: El[] = [];
    const picn: P[] = [];
    const espuma: P[] = [];
    const basal: El[] = [];
    lobos.forEach((lb) => {
      const sem = grade(rng, 13.5, [lb.cx - lb.rx, lb.cy - lb.rx, lb.cx + lb.rx, lb.cy + lb.rx], 0.18).filter(([x, y]) => prof(lb, x, y) > 10.5);
      sem.forEach((c) => {
        const pol = voronoi(c, sem, circulo(c, 8.6, 10), 24);
        dCel += linha(pol, true);
        // perto do ducto (centro da glândula), as células se desintegram (secreção holócrina): núcleo picnótico
        const perto = Math.hypot(c[0] + 56, c[1] - 134) < 26 || prof(lb, c[0], c[1]) > lb.ry * 0.78;
        if (perto) picn.push(c);
        else nucSeb.push([c[0], c[1], 2.8, 2.6, 0]);
        for (let k = 0; k < 3; k++) espuma.push([c[0] + entre(rng, -4.5, 4.5), c[1] + entre(rng, -4.5, 4.5)]);
      });
      contorno(lb, 2.6, 30).forEach((p, i, arr) => {
        const q = arr[(i + 1) % arr.length];
        basal.push([p[0], p[1], 3.4, 1.5, (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI]);
      });
    });
    void fi;
    return { dCel, nucSeb, picn, espuma, basal };
  });

  // ---- músculo eretor do pelo: da bainha conjuntiva (abaixo da glândula, na "protuberância") à derme papilar
  // sobe da inserção sem descer abaixo dela e contorna a glândula de perto (uma reta atravessaria os lóbulos)
  const eixoEretor = cbez([-40, 275], [-160, 275], [-155, 220], [-178, -12], 40);
  const eretor = faixa(eixoEretor, (f) => 10 - 3.5 * f);
  const nucEretor: El[] = [];
  eixoEretor.forEach((p, i) => {
    if (i < 2 || i > 37) return;
    const [tx, ty] = eretor.tg[i];
    const off = [-4.2, 0, 4.2][i % 3] * (1 - 0.3 * (i / 40));
    if (i % 2) return;
    nucEretor.push([p[0] - ty * off, p[1] + tx * off, 6.2, 1.5, (Math.atan2(ty, tx) * 180) / Math.PI]);
  });

  // ---- glândulas sudoríparas écrinas: porção secretora (clara, com mioepiteliais) e ducto (duas camadas, mais escuro)
  const tubulos: { c: P; r: number; tipo: 's' | 'd' }[] = [];
  sudoriparas.forEach(({ c, rx, ry }) => {
    for (const [tipo, r, n] of [['s', 16, 10], ['d', 10.5, 6]] as ['s' | 'd', number, number][]) {
      for (let t = 0, k = 0; t < 1500 && k < n; t++) {
        const a = entre(rng, 0, TAU);
        const d = Math.sqrt(rng());
        const x = c[0] + Math.cos(a) * d * (rx - r * 0.6);
        const y = c[1] + Math.sin(a) * d * (ry - r * 0.6);
        if (tubulos.some((o) => Math.hypot(o.c[0] - x, o.c[1] - y) < o.r + r + 1.5)) continue;
        tubulos.push({ c: [x, y], r, tipo });
        k++;
      }
    }
  });
  const desenhoTub = tubulos.map(({ c: [x, y], r, tipo }, i) => {
    let dc = '';
    let dc2 = '';
    const nuc: El[] = [];
    const a0 = entre(rng, 0, TAU);
    if (tipo === 's') {
      const n = 9;
      for (let k = 0; k < n; k++) {
        const a = a0 + (TAU * k) / n;
        const b = a0 + (TAU * (k + 1)) / n;
        dc += cunha(r1(x), r1(y), 4.2, r1(r - 2.2), a, b);
        const am = (a + b) / 2;
        nuc.push([x + Math.cos(am) * (r - 6.6), y + Math.sin(am) * (r - 6.6), 2.4, 2.2, 0]);
      }
      // células mioepiteliais: núcleos achatados na periferia
      for (let k = 0; k < 4; k++) {
        const a = a0 + 0.3 + (TAU * k) / 4;
        nuc.push([x + Math.cos(a) * (r - 1.2), y + Math.sin(a) * (r - 1.2), 3.8, 1.1, (a * 180) / Math.PI + 90]);
      }
    } else {
      for (let k = 0; k < 9; k++) {
        const a = a0 + (TAU * k) / 9;
        const b = a0 + (TAU * (k + 1)) / 9;
        dc += cunha(r1(x), r1(y), 6.4, r1(r), a, b);
        const am = (a + b) / 2;
        nuc.push([x + Math.cos(am) * 8.5, y + Math.sin(am) * 8.5, 1.9, 1.8, 0]);
      }
      for (let k = 0; k < 7; k++) {
        const a = a0 + 0.2 + (TAU * k) / 7;
        const b = a0 + 0.2 + (TAU * (k + 1)) / 7;
        dc2 += cunha(r1(x), r1(y), 3, 6.4, a, b);
        const am = (a + b) / 2;
        nuc.push([x + Math.cos(am) * 4.7, y + Math.sin(am) * 4.7, 1.6, 1.5, 0]);
      }
    }
    return (
      <g key={i}>
        <circle cx={r1(x)} cy={r1(y)} r={r} fill={tipo === 's' ? '#eebcd2' : '#d7a2c9'} stroke="#cf7aa3" strokeWidth={0.8} />
        <path d={dc} fill={tipo === 's' ? '#f2c7da' : '#d9a6cb'} stroke={tipo === 's' ? '#dba0bd' : '#c48bb7'} strokeWidth={0.6} />
        {dc2 && <path d={dc2} fill="#cf98c2" stroke="#c48bb7" strokeWidth={0.5} />}
        <circle cx={r1(x)} cy={r1(y)} r={tipo === 's' ? 4.2 : 3} fill={HE.luz} stroke={tipo === 'd' ? '#e06e9c' : 'none'} strokeWidth={1.2} />
        <path d={elipses(nuc)} fill={tipo === 's' ? '#4b3a8f' : '#3a2d78'} />
      </g>
    );
  });

  // ---- folículos em corte transversal (no fundo da derme e na hipoderme)
  const ocT = criarOcupacao(10);
  const cortesT = transversais.map(([x, y], i) => {
    const anelNuc = [21.5, 28].flatMap((rr) => {
      const n = Math.round((TAU * rr) / 7.6);
      const a0 = entre(rng, 0, TAU);
      return Array.from({ length: n }, (_, k) => [x + Math.cos(a0 + (TAU * k) / n) * rr, y + Math.sin(a0 + (TAU * k) / n) * rr] as P);
    });
    const ct: El[] = [0.4, 2, 3.5, 5].map((a) => [x + Math.cos(a + i) * 36, y + Math.sin(a + i) * 36, 6, 1.4, ((a + i) * 180) / Math.PI + 90]);
    const tri = i % 2 ? semear(rng, ocT, [x - 17, y - 17, x + 17, y + 17], 4.2, 1.3, (px, py) => Math.hypot(px - x, py - y) > 12.4 && Math.hypot(px - x, py - y) < 16, 0.5) : [];
    return { x, y, anelNuc, ct, tri, pig: Array.from({ length: 7 }, () => [x + entre(rng, -6.5, 6.5), y + entre(rng, -6.5, 6.5)] as P) };
  });

  return (
    <>
      <Deco>
        <rect width={W} height={H} fill={HE.vidro} />
      </Deco>
      <E id="hipoderme">
        <path d={linha([...Array.from({ length: 51 }, (_, i) => [i * 20, hip(i * 20) - 4] as P), [W + 10, H + 10], [-10, H + 10]], true)} fill="#efb0ca" />
        <path d={adip.d} fill={HE.luz} stroke="#d77aa3" strokeWidth={2} strokeLinejoin="round" />
        <path d={elipses(adip.nuc)} fill={HE.nucleo} />
      </E>
      <E id="derme">
        <path d={linha([...baseEpi.slice().reverse(), ...Array.from({ length: 51 }, (_, i) => [W - i * 20, hip(W - i * 20)] as P)], true)} fill={HE.colageno} />
        <path d={linha([...baseEpi.slice().reverse(), ...Array.from({ length: 101 }, (_, i) => [W - i * 10, jun(W - i * 10) + 28] as P)], true)} fill={HE.colagenoClaro} />
        {feixes}
        <path d={dFibrasPap} stroke="#eab3cb" strokeWidth={1.2} fill="none" />
        <path d={elipses(nucDerme)} fill={HE.nucleo} />
        {vasosDerme}
        {/* conjuntivo frouxo ao redor das glândulas sudoríparas */}
        {sudoriparas.map(({ c, rx, ry }, i) => (
          <ellipse key={i} cx={c[0]} cy={c[1]} rx={rx + 8} ry={ry + 8} fill={HE.colagenoClaro} />
        ))}
      </E>
      <E id="epiderme">
        <path d={linha([...topoEpi, ...baseEpi], true)} fill={HE.citoplasma} />
        <path d={dEsp} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} strokeDasharray="1.6 1.4" />
        {bolinhas(esp, 2.6, HE.nucleo)}
        <path d={linha([...topoEpi, ...Array.from({ length: 101 }, (_, i) => [W - i * 10, sup(W - i * 10) + 9.5] as P)], true)} fill="#f4bfd5" />
        <path d={cornea} stroke="#e48fb4" strokeWidth={0.9} strokeDasharray="22 6" fill="none" />
        <path d={elipses(granulosas)} fill="#e7a0bf" stroke={HE.citoplasmaEscuro} strokeWidth={0.6} />
        <path d={elipses(nucGran)} fill={HE.nucleoEscuro} />
        {bolinhas(graos, 0.9, '#2f2466')}
        <path d={elipses(basais)} fill="#d98bb0" stroke={HE.nucleoClaro} strokeWidth={0.6} />
        <path d={elipses(nucBasal)} fill={HE.nucleoEscuro} />
      </E>
      <E id="glandula-sudoripara-ecrina">{desenhoTub}</E>
      <E id="musculo-eretor-do-pelo">
        {desenhoFol.map(({ tf }, i) => (
          <g key={i} transform={tf}>
            <path d={linha(eretor.pol, true)} fill={HE.musculo} stroke="#d27aa2" strokeWidth={0.8} />
            <path d={elipses(nucEretor)} fill={HE.nucleo} />
          </g>
        ))}
      </E>
      <E id="glandula-sebacea">
        {desenhoFol.map(({ tf }, i) => {
          const sb = desenhoSeb[i];
          return (
            <g key={i} transform={tf}>
              {/* ducto curto que desemboca no canal do folículo (unidade pilossebácea) */}
              <path d="M-14 118L-58 136" stroke="#efc6d8" strokeWidth={14} strokeLinecap="round" />
              <path d="M-14 118L-52 133" stroke="#fbf3f7" strokeWidth={3.5} strokeLinecap="round" />
              {bolinhas([[-24, 116.5], [-36, 121.5], [-46, 125.5], [-22, 127], [-34, 131], [-46, 135]], 1.9, HE.nucleo)}
              {lobos.map((lb, k) => (
                <path key={k} d={suave(contorno(lb, 0, 48))} fill="#f4e5ec" stroke="#b99bd0" strokeWidth={1.6} />
              ))}
              <path d={sb.dCel} fill="#f7ebf1" stroke="#dcb7cb" strokeWidth={0.8} />
              {bolinhas(sb.espuma, 1, '#ead2de', 'esp')}
              <path d={elipses(sb.nucSeb)} fill="#5d4c9e" />
              {bolinhas(sb.picn, 1.7, '#2f2466', 'pic')}
              <path d={elipses(sb.basal)} fill="#3a2d78" />
            </g>
          );
        })}
      </E>
      <E id="foliculo-piloso">
        {desenhoFol.map(({ folic }, i) => (
          <g key={i}>{folic}</g>
        ))}
        {cortesT.map(({ x, y, anelNuc, ct, tri }, i) => (
          <g key={`t${i}`}>
            <circle cx={x} cy={y} r={38} fill="#e9a0c0" />
            <circle cx={x} cy={y} r={33.4} fill="#f4dde7" stroke="#e0709e" strokeWidth={1.4} />
            {bolinhas(anelNuc, 2.5, '#5d4ea0')}
            <path d={elipses(ct)} fill={HE.nucleo} />
            <circle cx={x} cy={y} r={17} fill="#e8799f" />
            {bolinhas(tri, 0.95, '#b8245a')}
          </g>
        ))}
      </E>
      <E id="haste-do-pelo">
        {desenhoFol.map(({ haste }, i) => (
          <g key={i}>{haste}</g>
        ))}
        {cortesT.map(({ x, y, pig }, i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={11} fill="#d6a066" stroke="#a87440" strokeWidth={0.8} />
            {bolinhas(pig, 0.9, '#76482a')}
          </g>
        ))}
      </E>
      <E id="papila-do-pelo">
        {desenhoFol.map(({ papila }, i) => (
          <g key={i}>{papila}</g>
        ))}
      </E>
    </>
  );
}

export const LAMINAS_SISTEMAS_A: Record<string, LaminaRender> = {
  // o campo de 10× precisa pegar a luz, a íntima e a média com as lâminas elásticas (não só a adventícia)
  aorta: {
    desenhar: LaminaAorta,
    partes: PARTES_AORTA,
    areaDiagnostica: [250, 180, 750, 240],
    // vasa vasorum na adventícia e no terço externo da média: vale a túnica sob o toque
    contem: { 'tunica-intima': ['endotelio'], 'tunica-media': ['fibras-elasticas', 'vasa-vasorum'], 'tunica-adventicia': ['vasa-vasorum'] },
    // a média (músculo liso) é a maior estrutura em todo campo; a íntima subendotelial é conjuntivo frouxo
    distratoresExcluidos: ['musculo-liso', 'conjuntivo-frouxo'],
  },
  // a artéria inteira (luz e túnicas) em ≥ 53% do campo; a veia e o nervo ficam fora
  'feixe-neurovascular': {
    desenhar: LaminaFeixe,
    partes: PARTES_FEIXE,
    areaDiagnostica: [180, 260, 320, 470],
    // a lâmina elástica interna é o componente mais externo da íntima
    contem: { 'tunica-intima': ['lamina-elastica-interna'] },
    // a média (músculo liso) e o conjuntivo frouxo ao redor do feixe ocupam boa parte do campo
    distratoresExcluidos: ['musculo-liso', 'conjuntivo-frouxo'],
  },
  // cápsula com seio subcapsular e folículos: o que distingue o linfonodo do baço e do timo
  linfonodo: {
    desenhar: LaminaLinfonodo,
    partes: PARTES_LINFONODO,
    areaDiagnostica: [300, 190, 700, 250],
    contem: { 'foliculo-linfoide': ['centro-germinativo'], paracortex: ['venula-endotelio-alto'] },
  },
  // polpa branca com arteríola central ao lado da polpa vermelha
  baco: {
    desenhar: LaminaBaco,
    partes: PARTES_BACO,
    areaDiagnostica: [300, 230, 520, 380],
    // cordões e sinusoides, juntos, formam a polpa vermelha
    contem: { 'polpa-branca': ['centro-germinativo', 'arteria-central'], 'polpa-vermelha': ['sinusoides-esplenicos'] },
  },
  // lóbulo do corpúsculo de Hassall grande (236, 244): córtex escuro, medula clara e Hassall em todo campo
  timo: {
    desenhar: LaminaTimo,
    partes: PARTES_TIMO,
    areaDiagnostica: [150, 150, 350, 350],
    // células epiteliais reticulares no córtex e na medula: vale a região sob o toque
    contem: { 'medula-timica': ['corpusculo-de-hassall', 'celula-epitelial-reticular'], 'cortex-timico': ['celula-epitelial-reticular', 'macrofago'] },
  },
  // unidade pilossebácea (folículo, glândula sebácea, eretor) no campo, sem a epiderme interfolicular nem a gordura
  'pele-fina': {
    desenhar: LaminaPeleFina,
    partes: PARTES_PELE_FINA,
    areaDiagnostica: [300, 260, 520, 300],
    contem: { 'foliculo-piloso': ['haste-do-pelo', 'papila-do-pelo'] },
    // o infundíbulo e a bainha radicular externa, contínuos com a epiderme, são epitélio estratificado pavimentoso
    distratoresExcluidos: ['pele-espessa'],
  },
};
