// Lâminas da histologia dos sistemas — grupo C: respiratório, urinário, endócrino e reprodutor.
// Ids e estruturas = content/histologia/laminas-sistemas-c.json (teste em tests/conteudo.test.ts).
// Esquemas em SVG com aspecto de HE. Cada lâmina declara a sua escala (1 un do SVG ≈ x µm) e mantém entre as
// estruturas as proporções do Junqueira 14ª ed. e do Ross 8ª ed. Formas repetidas (núcleos, hemácias, células)
// vão juntas num único <path> com vários subcaminhos: o desenho fica com poucas dezenas de elementos, leve no celular.
// Tudo é sorteado pelo rng da lâmina (semente fixa = id), então o desenho é sempre o mesmo.
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, type Rng } from '../he.tsx';
import type { LaminaRender } from './index.ts';

// ---------------------------------------------------------------------------------------------
// Geometria
type P = [number, number];
const f = (v: number) => +v.toFixed(1);
const f1 = f;

/** Elipse girada como subcaminho (várias no mesmo <path>). */
function elipse(cx: number, cy: number, rx: number, ry: number, ang = 0): string {
  const a = (ang * Math.PI) / 180;
  const dx = f(Math.cos(a) * rx * 2);
  const dy = f(Math.sin(a) * rx * 2);
  const g = f(ang);
  return `M${f(cx - dx / 2)},${f(cy - dy / 2)}a${f(rx)},${f(ry)} ${g} 1 0 ${dx},${dy}a${f(rx)},${f(ry)} ${g} 1 0 ${-dx},${-dy}z`;
}
const circulo = (cx: number, cy: number, r: number) => elipse(cx, cy, r, r);
/** Polígono (ou polilinha) como subcaminho. */
function contorno(pts: P[], fechar = true) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('') + (fechar ? 'z' : '');
}
const graus = (nx: number, ny: number) => (Math.atan2(ny, nx) * 180) / Math.PI;

/** Suaviza um polígono fechado (cantos arredondados), sem mudar a topologia. */
function chaikin(pts: P[], iter = 2): P[] {
  let p = pts;
  for (let k = 0; k < iter; k++) {
    const q: P[] = [];
    p.forEach((a, i) => {
      const b = p[(i + 1) % p.length];
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    });
    p = q;
  }
  return p;
}

/** Mantém a parte do polígono em que (p − m)·n ≤ 0. */
function cortar(pol: P[], nx: number, ny: number, mx: number, my: number): P[] {
  const lado = (p: P) => (p[0] - mx) * nx + (p[1] - my) * ny;
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

/** Sítio de um diagrama de potência (Voronoi com pesos): `w` funciona como raio, para células de tamanhos variados. */
interface Sitio {
  x: number;
  y: number;
  w: number;
}
/** Célula do diagrama de potência, limitada a rMax e recuada `folga` de cada vizinho (vizinhos ficam separados por 2·folga). */
function celulaPotencia(s: Sitio, sitios: Sitio[], rMax: number, folga: number): P[] {
  let pol: P[] = Array.from({ length: 20 }, (_, k) => [s.x + Math.cos((Math.PI / 10) * k) * rMax, s.y + Math.sin((Math.PI / 10) * k) * rMax]);
  for (const v of sitios) {
    if (v === s) continue;
    const nx = v.x - s.x;
    const ny = v.y - s.y;
    const d2 = nx * nx + ny * ny;
    if (!d2) continue;
    const d = Math.sqrt(d2);
    const dist = (d2 + s.w * s.w - v.w * v.w) / (2 * d) - folga; // distância do plano até s
    if (dist > rMax) continue;
    pol = cortar(pol, nx / d, ny / d, s.x + (nx / d) * dist, s.y + (ny / d) * dist);
    if (pol.length < 3) return [];
  }
  return pol;
}

/** Envoltória convexa (cadeia monótona). */
function envoltoria(pts: P[]): P[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const baixo: P[] = [];
  for (const q of p) {
    while (baixo.length >= 2 && cruz(baixo[baixo.length - 2], baixo[baixo.length - 1], q) <= 0) baixo.pop();
    baixo.push(q);
  }
  const cima: P[] = [];
  for (const q of [...p].reverse()) {
    while (cima.length >= 2 && cruz(cima[cima.length - 2], cima[cima.length - 1], q) <= 0) cima.pop();
    cima.push(q);
  }
  return [...baixo.slice(0, -1), ...cima.slice(0, -1)];
}

function dentro(x: number, y: number, pol: P[]) {
  let d = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i];
    const [xj, yj] = pol[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
}
function distSeg(x: number, y: number, a: P, b: P) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (y - a[1]) * vy) / (vx * vx + vy * vy || 1)));
  return Math.hypot(x - a[0] - vx * t, y - a[1] - vy * t);
}
function distLinha(x: number, y: number, pts: P[], fechada: boolean) {
  let m = Infinity;
  const n = fechada ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) m = Math.min(m, distSeg(x, y, pts[i], pts[(i + 1) % pts.length]));
  return m;
}

/**
 * Distância exata a uma linha longa, mais rápida: os segmentos vão em blocos com caixa envolvente, e um bloco só é
 * examinado se a caixa estiver mais perto que a melhor distância já achada.
 */
function medidorDeLinha(pts: P[], fechada: boolean, bloco = 8) {
  const n = fechada ? pts.length : pts.length - 1;
  const blocos: { i0: number; i1: number; x0: number; y0: number; x1: number; y1: number }[] = [];
  for (let i0 = 0; i0 < n; i0 += bloco) {
    const i1 = Math.min(n, i0 + bloco);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let i = i0; i <= i1; i++) {
      const [x, y] = pts[i % pts.length];
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
    blocos.push({ i0, i1, x0, y0, x1, y1 });
  }
  return (x: number, y: number) => {
    let m = Infinity;
    for (const b of blocos) {
      const dx = Math.max(b.x0 - x, 0, x - b.x1);
      const dy = Math.max(b.y0 - y, 0, y - b.y1);
      if (dx * dx + dy * dy >= m * m) continue;
      for (let i = b.i0; i < b.i1; i++) m = Math.min(m, distSeg(x, y, pts[i], pts[(i + 1) % pts.length]));
    }
    return m;
  };
}

/** Curva suave (Catmull-Rom) pelos pontos de controle, amostrada a cada `passo` un. */
function curva(ctrl: P[], passo: number): P[] {
  const out: P[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / passo));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
}

/** Ponto de uma linha amostrado por comprimento de arco, com tangente (tx, ty) e normal (nx, ny). */
interface Amostra {
  x: number;
  y: number;
  tx: number;
  ty: number;
  nx: number;
  ny: number;
  s: number;
}
/**
 * Reamostra uma linha (fechada ou aberta) em pontos equidistantes. Na linha fechada, a normal aponta para dentro;
 * na aberta, é a normal à esquerda do sentido de percurso.
 */
function amostrar(pts: P[], n: number, fechada: boolean): Amostra[] {
  const m = fechada ? pts.length : pts.length - 1;
  const acum = [0];
  for (let i = 0; i < m; i++) acum.push(acum[i] + Math.hypot(pts[(i + 1) % pts.length][0] - pts[i][0], pts[(i + 1) % pts.length][1] - pts[i][1]));
  const L = acum[m];
  let area = 0;
  if (fechada) pts.forEach((a, i) => (area += a[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * a[1]));
  const sinal = !fechada || area > 0 ? 1 : -1;
  let seg = 0;
  const ponto = (s: number): P => {
    s = fechada ? ((s % L) + L) % L : Math.max(0, Math.min(L, s));
    if (acum[seg] > s) seg = 0;
    while (seg < m - 1 && acum[seg + 1] < s) seg++;
    const a = pts[seg];
    const b = pts[(seg + 1) % pts.length];
    const t = (s - acum[seg]) / (acum[seg + 1] - acum[seg] || 1);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const passo = fechada ? L / n : L / Math.max(1, n - 1);
  const d = Math.min(2, passo / 2);
  return Array.from({ length: n }, (_, k) => {
    const s = k * passo;
    const [x0, y0] = ponto(s - d);
    const [x1, y1] = ponto(s + d);
    const [x, y] = ponto(s);
    const tl = Math.hypot(x1 - x0, y1 - y0) || 1;
    const tx = (x1 - x0) / tl;
    const ty = (y1 - y0) / tl;
    return { x, y, tx, ty, nx: -ty * sinal, ny: tx * sinal, s };
  });
}
function perimetro(pts: P[], fechada = true) {
  let L = 0;
  const m = fechada ? pts.length : pts.length - 1;
  for (let i = 0; i < m; i++) L += Math.hypot(pts[(i + 1) % pts.length][0] - pts[i][0], pts[(i + 1) % pts.length][1] - pts[i][1]);
  return L;
}

/** Centroide (por área) de um polígono. */
function centroidePol(pol: P[]): P {
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
  return Math.abs(a) < 1e-6 ? pol[0] : [cx / (3 * a), cy / (3 * a)];
}
/** Arredonda um contorno convexo: puxa os cantos (pontos além de `fator`·raio inscrito) em direção ao centro. */
function arredondar(pol: P[], fator = 1.12, puxa = 0.35): P[] {
  const c = centroidePol(pol);
  const rin = Math.min(...pol.map((p, i) => distSeg(c[0], c[1], p, pol[(i + 1) % pol.length])));
  const lim = rin * fator;
  return pol.map((p) => {
    const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
    if (d <= lim) return p;
    const nd = lim + (d - lim) * puxa;
    return [c[0] + ((p[0] - c[0]) * nd) / d, c[1] + ((p[1] - c[1]) * nd) / d];
  });
}
/** Relaxamento de Lloyd: cada sítio móvel vai para o centroide da sua célula (espaçamento mais regular). */
function relaxar(sitios: Sitio[], moveis: number, rMax: (s: Sitio) => number, iter: number) {
  for (let k = 0; k < iter; k++) {
    const novos = sitios.slice(0, moveis).map((st) => {
      const pol = celulaPotencia(st, sitios, rMax(st), 0);
      return pol.length >= 3 ? centroidePol(pol) : ([st.x, st.y] as P);
    });
    novos.forEach(([x, y], i) => {
      sitios[i].x = x;
      sitios[i].y = y;
    });
  }
}

/**
 * Células (diagrama de potência) de muitos sítios de uma vez, com vizinhança por grade (rápido para milhares).
 * `alcance` = distância máxima de um vizinho que ainda pode cortar a célula (maior quando há sítios com peso).
 */
function celulasDe(sitios: Sitio[], rMax: number, folga: number, alcance = 2 * rMax + 1): P[][] {
  const passo = alcance;
  const g = new Map<string, number[]>();
  sitios.forEach((st, i) => {
    const k = `${Math.floor(st.x / passo)},${Math.floor(st.y / passo)}`;
    const b = g.get(k);
    if (b) b.push(i);
    else g.set(k, [i]);
  });
  return sitios.map((st, i) => {
    const viz: Sitio[] = [st];
    const gx = Math.floor(st.x / passo);
    const gy = Math.floor(st.y / passo);
    for (let a = gx - 1; a <= gx + 1; a++) for (let b = gy - 1; b <= gy + 1; b++) for (const j of g.get(`${a},${b}`) ?? []) if (j !== i) viz.push(sitios[j]);
    return celulaPotencia(st, viz, rMax, folga);
  });
}
/** Relaxamento de Lloyd com vizinhança por grade (para muitos sítios). */
function relaxarRapido(sitios: Sitio[], moveis: number, rMax: number, alcance: number, iter: number) {
  for (let k = 0; k < iter; k++) {
    const pols = celulasDe(sitios, rMax, 0, alcance);
    for (let i = 0; i < moveis; i++) {
      if (pols[i].length < 3) continue;
      const [x, y] = centroidePol(pols[i]);
      sitios[i].x = x;
      sitios[i].y = y;
    }
  }
}

/** Registro de círculos ocupados (grade espacial): impede núcleos e células sobrepostos. */
function ocupacao(passo: number, rMax: number) {
  const m = new Map<number, number[]>();
  const chave = (i: number, j: number) => (i + 2000) * 8192 + (j + 2000);
  return {
    livre(x: number, y: number, r: number, folga = 0.6) {
      const alc = r + rMax + folga;
      for (let i = Math.floor((x - alc) / passo); i <= Math.floor((x + alc) / passo); i++)
        for (let j = Math.floor((y - alc) / passo); j <= Math.floor((y + alc) / passo); j++) {
          const b = m.get(chave(i, j));
          if (!b) continue;
          for (let k = 0; k < b.length; k += 3) if (Math.hypot(b[k] - x, b[k + 1] - y) < b[k + 2] + r + folga) return false;
        }
      return true;
    },
    marcar(x: number, y: number, r: number) {
      const k = chave(Math.floor(x / passo), Math.floor(y / passo));
      const b = m.get(k);
      if (b) b.push(x, y, r);
      else m.set(k, [x, y, r]);
    },
  };
}
type Ocupacao = ReturnType<typeof ocupacao>;

/** Pontos de um círculo (para envoltórias e contornos). */
const pontosCirculo = (cx: number, cy: number, r: number, n = 48): P[] => Array.from({ length: n }, (_, k) => [cx + Math.cos((2 * Math.PI * k) / n) * r, cy + Math.sin((2 * Math.PI * k) / n) * r]);
/** Contorno polar r(θ) em torno de (cx, cy). */
const pontosPolar = (cx: number, cy: number, r: (a: number) => number, n = 180): P[] =>
  Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n;
    return [cx + Math.cos(a) * r(a), cy + Math.sin(a) * r(a)];
  });

/**
 * Epitélio de uma camada ao longo de um contorno fechado: uma célula a cada `largura` un, com altura `altura(k)`
 * medida para dentro (sentido = +1) ou para fora (sentido = −1) do contorno. Devolve as células (quadriláteros que
 * se tocam, sem vãos) e, para cada uma, o ponto no meio da célula à profundidade pedida e o ângulo da normal.
 */
function epitelio(contornoBasal: P[], largura: number, altura: (k: number) => number, sentido = 1) {
  const n = Math.max(6, Math.round(perimetro(contornoBasal) / largura));
  const b = amostrar(contornoBasal, n, true);
  const alt = b.map((_, k) => altura(k));
  const topo: P[] = b.map((p, k) => [p.x + p.nx * alt[k] * sentido, p.y + p.ny * alt[k] * sentido]);
  const celulas = b.map((p, k) => {
    const q = b[(k + 1) % n];
    return [[p.x, p.y], [q.x, q.y], topo[(k + 1) % n], topo[k]] as P[];
  });
  const meio = (k: number, prof: number) => {
    const p = b[k];
    const q = b[(k + 1) % n];
    const nx = (p.nx + q.nx) / 2;
    const ny = (p.ny + q.ny) / 2;
    const l = Math.hypot(nx, ny) || 1;
    const h = (alt[k] + alt[(k + 1) % n]) / 2;
    return { x: (p.x + q.x) / 2 + (nx / l) * prof * h * sentido, y: (p.y + q.y) / 2 + (ny / l) * prof * h * sentido, ang: graus(nx * sentido, ny * sentido), nx: (nx / l) * sentido, ny: (ny / l) * sentido };
  };
  return { n, base: b, topo, celulas, meio };
}

/** Amostragem por dardos com raio variável e registro de ocupação. */
function dardos(rng: Rng, tentativas: number, area: [number, number, number, number], raio: () => number, aceitar: (x: number, y: number, r: number) => boolean, occ: Ocupacao, folga: number) {
  const [x0, y0, x1, y1] = area;
  const res: [number, number, number][] = [];
  for (let t = 0; t < tentativas; t++) {
    const x = entre(rng, x0, x1);
    const y = entre(rng, y0, y1);
    const r = raio();
    if (!occ.livre(x, y, r, folga) || !aceitar(x, y, r)) continue; // teste barato primeiro
    occ.marcar(x, y, r);
    res.push([x, y, r]);
  }
  return res;
}

/** Hemácia (disco bicôncavo visto de face ou de lado) como subcaminho. */
const hemacia = (x: number, y: number, rx: number, ang: number, ry = rx * 0.75) => elipse(x, y, rx, ry, ang);

// =============================================================================================
// 1. PULMÃO — escala 1 un ≈ 1 µm: alvéolos de ~90–120 µm, septos de 6–10 µm, hemácia ≈ 7,5 µm.
export const PARTES_PULMAO = ['bronquiolo', 'bronquiolo-respiratorio', 'ducto-alveolar', 'alveolo', 'septo-interalveolar', 'capilar', 'pneumocito-tipo-i', 'pneumocito-tipo-ii', 'macrofago-alveolar'];

/** Porção respiratória do pulmão: bronquíolo com ramo da artéria pulmonar, bronquíolo respiratório, ductos e sacos alveolares. */
export function LaminaPulmao(rng: Rng) {
  const cor = { septo: '#e8a5c3', ar: HE.luz, bainha: '#f1cbdb', borda: '#cf7ea5', pneumoI: '#d585ac', pneumoII: '#f4cddd', espuma: '#fdf5f8', macrofago: '#e9cbd8', pigmento: '#7a5333', carvao: '#2f2723', capilar: '#f4d3e2', endotelio: '#d48cb0' };
  // feixe broncovascular: bronquíolo e ramo da artéria pulmonar na mesma bainha de conjuntivo
  const B: P = [212, 226];
  const RB = 112;
  const A: P = [198, 458];
  const RA = 60;
  const bainha = chaikin(envoltoria([...pontosCirculo(B[0], B[1], RB + 14, 36), ...pontosCirculo(A[0], A[1], RA + 16, 36)]), 1);
  const distBainha = medidorDeLinha(bainha, true);
  const foraBainha = (x: number, y: number, m: number) => (x < 40 || x > 400 || y < 70 || y > 560 || !dentro(x, y, bainha)) && distBainha(x, y) > m;

  // vias aéreas da porção respiratória (luz = faixa ao redor de uma linha central)
  const rb = curva([[392, -70], [410, 40], [470, 142], [546, 226]], 6);
  const ad = curva([[546, 226], [640, 292], [736, 314], [842, 300], [918, 262]], 6);
  const ad2 = curva([[736, 314], [770, 410], [794, 506]], 6);
  const sacos: [number, number, number][] = [[950, 250, 42], [798, 556, 40]];
  const HW_RB = 32;
  const HW_AD = 27;
  const mRb = medidorDeLinha(rb, false);
  const mAd = medidorDeLinha(ad, false);
  const mAd2 = medidorDeLinha(ad2, false);
  const dRb = (x: number, y: number) => mRb(x, y) - HW_RB;
  const dAd = (x: number, y: number) => Math.min(mAd(x, y), mAd2(x, y)) - HW_AD;
  const dSaco = (x: number, y: number) => Math.min(...sacos.map(([sx, sy, sr]) => Math.hypot(x - sx, y - sy) - sr));
  const dLuz = (x: number, y: number) => Math.min(dRb(x, y), dAd(x, y), dSaco(x, y));
  const noParenquima = (x: number, y: number, m: number) => x > -15 && x < W + 15 && y > -15 && y < H + 15 && dLuz(x, y) > m && foraBainha(x, y, m);

  // alvéolos: diagrama de Voronoi. Primeiro, fileiras de sementes ao longo das vias aéreas (cada alvéolo abre na luz
  // do ducto ou do bronquíolo respiratório entre dois septos); depois, sementes com distância mínima no resto do campo.
  const occS = ocupacao(60, 50);
  const sementes: [number, number, number][] = [];
  const fileira = (pts: P[], dist: number, passo: number, s0: number) => {
    const am = amostrar(pts, Math.round(perimetro(pts, false) / 2), false);
    const L = am[am.length - 1].s;
    const res: number[] = [];
    for (let s = s0; s < L - 10; s += passo) {
      const p = am[Math.min(am.length - 1, Math.round((s / L) * (am.length - 1)))];
      res.push(s);
      for (const lado of [1, -1]) {
        const x = p.x + p.nx * dist * lado;
        const y = p.y + p.ny * dist * lado;
        if (!occS.livre(x, y, 34, 0) || !foraBainha(x, y, 24)) continue;
        occS.marcar(x, y, 34);
        sementes.push([x, y, 34]);
      }
    }
    return res;
  };
  const posRb = fileira(rb, HW_RB + 60, 62, 34);
  fileira(ad, HW_AD + 42, 64, 48);
  fileira(ad2, HW_AD + 42, 64, 56);
  for (const [sx, sy, sr] of sacos) {
    const n = Math.round((2 * Math.PI * (sr + 42)) / 66);
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      const x = sx + Math.cos(a) * (sr + 42);
      const y = sy + Math.sin(a) * (sr + 42);
      if (!occS.livre(x, y, 34, 0)) continue;
      occS.marcar(x, y, 34);
      sementes.push([x, y, 34]);
    }
  }
  sementes.push(...dardos(rng, 6000, [-110, -110, W + 110, H + 110], () => entre(rng, 40, 50), (x, y) => dLuz(x, y) > 40 && foraBainha(x, y, 24), occS, 0));
  // pesos variados: alvéolos de tamanhos diferentes, como no corte real
  const sitios: Sitio[] = sementes.map(([x, y, r]) => ({ x, y, w: r > 34 ? entre(rng, 0, 22) : 8 }));
  const RMAX = 120;
  const brutas = sitios.map((s) => celulaPotencia(s, sitios, RMAX, 0));
  const alveolos = sitios.map((s) => chaikin(celulaPotencia(s, sitios, RMAX, 3.4), 2));

  // septos (arestas do Voronoi) e junções (vértices)
  const arestas: { a: P; b: P; i: number; j: number }[] = [];
  brutas.forEach((pol, i) =>
    pol.forEach((a, k) => {
      const b = pol[(k + 1) % pol.length];
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const pot = (t: Sitio) => (mx - t.x) ** 2 + (my - t.y) ** 2 - t.w * t.w;
      const di = pot(sitios[i]);
      let j = -1;
      let melhor = 40;
      sitios.forEach((t, jj) => {
        if (jj === i) return;
        const dd = Math.abs(pot(t) - di);
        if (dd < melhor) {
          melhor = dd;
          j = jj;
        }
      });
      if (j > i) arestas.push({ a, b, i, j });
    }),
  );
  const vertices = new Map<string, { p: P; cel: Set<number> }>();
  for (const e of arestas)
    for (const p of [e.a, e.b]) {
      const k = `${Math.round(p[0])},${Math.round(p[1])}`;
      const v = vertices.get(k) ?? { p, cel: new Set<number>() };
      v.cel.add(e.i).add(e.j);
      vertices.set(k, v);
    }

  const occ = ocupacao(30, 12);
  // pneumócitos tipo II: cúbicos, abaulados para a luz, nas junções dos septos; citoplasma espumoso (corpos lamelares extraídos)
  const tipoII: string[] = [];
  const espuma: string[] = [];
  const nucII: string[] = [];
  for (const v of vertices.values()) {
    if (v.cel.size < 3 || !noParenquima(v.p[0], v.p[1], 22) || rng() > 0.62) continue;
    const cels = [...v.cel];
    const c = cels[Math.floor(rng() * cels.length)];
    let ux = sitios[c].x - v.p[0];
    let uy = sitios[c].y - v.p[1];
    const ul = Math.hypot(ux, uy) || 1;
    ux /= ul;
    uy /= ul;
    let t = 0;
    while (t < 40 && !dentro(v.p[0] + ux * t, v.p[1] + uy * t, alveolos[c])) t += 0.5;
    if (t >= 40) continue;
    const cx = v.p[0] + ux * (t + 4);
    const cy = v.p[1] + uy * (t + 4);
    if (!occ.livre(cx, cy, 7)) continue;
    occ.marcar(cx, cy, 7);
    const ang = graus(ux, uy);
    tipoII.push(elipse(cx, cy, 5.6, 6.3, ang));
    nucII.push(circulo(cx - ux * 1.2, cy - uy * 1.2, 2.5));
    for (let k = 0; k < 5; k++) {
      const a = entre(rng, -1.2, 1.2) + Math.atan2(uy, ux);
      espuma.push(circulo(cx + Math.cos(a) * 3.8, cy + Math.sin(a) * 3.8, entre(rng, 0.8, 1.2)));
    }
  }
  // capilares (com hemácia) e pneumócitos tipo I (núcleo achatado e citoplasma delgado) ao longo dos septos
  const capilares: string[] = [];
  const hemacias: string[] = [];
  const endotelio: string[] = [];
  const tipoI: string[] = [];
  // área de toque do tipo I um pouco maior que o núcleo (o citoplasma delgado reveste a superfície alveolar)
  const alvoI: string[] = [];
  const nucI: string[] = [];
  for (const e of arestas) {
    const L = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]);
    if (L < 22) continue;
    const tx = (e.b[0] - e.a[0]) / L;
    const ty = (e.b[1] - e.a[1]) / L;
    const nCap = Math.max(1, Math.floor((L - 22) / 19));
    const vagaI = nCap >= 2 || rng() < 0.3 ? Math.floor(rng() * nCap) : -1;
    for (let k = 0; k < nCap; k++) {
      const s = 11 + ((k + 0.5) * (L - 22)) / nCap;
      const x = e.a[0] + tx * s;
      const y = e.a[1] + ty * s;
      if (!noParenquima(x, y, 10)) continue;
      const ang = graus(tx, ty);
      if (k === vagaI && rng() < 0.75) {
        // tipo I: do lado de um dos alvéolos, rente à superfície
        const lado = rng() < 0.5 ? 1 : -1;
        const px = x - ty * lado * 4.3;
        const py = y + tx * lado * 4.3;
        if (!occ.livre(px, py, 6.5)) continue;
        occ.marcar(px, py, 6.5);
        tipoI.push(elipse(px, py, 7, 2.4, ang));
        alvoI.push(elipse(px - ty * lado * 0.8, py + tx * lado * 0.8, 8.5, 4.4, ang));
        nucI.push(elipse(px - ty * lado * 0.3, py + tx * lado * 0.3, 4.2, 1.45, ang));
        continue;
      }
      if (!occ.livre(x, y, 6.6)) continue;
      occ.marcar(x, y, 6.6);
      capilares.push(elipse(x, y, 6.6, 3.9, ang));
      hemacias.push(hemacia(x + entre(rng, -1, 1) * tx, y + entre(rng, -1, 1) * ty, 3.5, ang, 2.6));
      if (rng() < 0.25) endotelio.push(elipse(x + tx * 5.2 - ty * 3.6, y + ty * 5.2 + tx * 3.6, 2.4, 0.9, ang));
    }
  }

  // extremidades livres dos septos na luz: botões de músculo liso no ducto alveolar; extremidade arredondada nas demais
  const botoes: string[] = [];
  const nucBotao: string[] = [];
  const pontas: string[] = [];
  for (const e of arestas) {
    const L = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]);
    const n = Math.max(4, Math.ceil(L / 2));
    let ant = dLuz(e.a[0], e.a[1]);
    for (let k = 1; k <= n; k++) {
      const x = e.a[0] + ((e.b[0] - e.a[0]) * k) / n;
      const y = e.a[1] + ((e.b[1] - e.a[1]) * k) / n;
      const d = dLuz(x, y);
      if ((ant > 0) !== (d > 0) && x > -20 && x < W + 20 && y > -20 && y < H + 20 && foraBainha(x, y, 4)) {
        // direção para a luz (gradiente numérico)
        const gx = dLuz(x + 1, y) - dLuz(x - 1, y);
        const gy = dLuz(x, y + 1) - dLuz(x, y - 1);
        const gl = Math.hypot(gx, gy) || 1;
        const doDucto = dAd(x, y) < Math.min(dRb(x, y), dSaco(x, y)) - 2;
        if (doDucto) {
          botoes.push(circulo(x - (gx / gl) * 2, y - (gy / gl) * 2, 5.4));
          nucBotao.push(elipse(x - (gx / gl) * 2, y - (gy / gl) * 2, 3, 1.2, graus(-gy, gx)));
        } else pontas.push(circulo(x - (gx / gl) * 1, y - (gy / gl) * 1, 4.2));
      }
      ant = d;
    }
  }

  // bronquíolo respiratório: parede de epitélio cúbico + músculo liso, interrompida pelas aberturas dos alvéolos
  const amRb = amostrar(rb, Math.round(perimetro(rb, false) / 2), false);
  const Lrb = amRb[amRb.length - 1].s;
  // aberturas de alvéolos (≈ 40 un) centradas em alguns alvéolos da fileira; o resto da parede é contínuo
  const aberturas: Record<number, number[]> = { 1: [posRb[1], posRb[4]], [-1]: [posRb[2], posRb[5]] };
  const paredes: [number, number, number][] = [];
  for (const lado of [1, -1]) {
    let ini = 0;
    for (const a of aberturas[lado].filter((v) => v !== undefined && v < Lrb - 60)) {
      paredes.push([lado, ini, a - 17]);
      ini = a + 17;
    }
    paredes.push([lado, ini, Lrb - 30]);
  }
  const paredesUteis = paredes.filter(([, s0, s1]) => s1 - s0 > 24);
  const celRb: string[] = [];
  const nucRb: string[] = [];
  const muscRb: string[] = [];
  const nucMuscRb: string[] = [];
  const ciliosRb: string[] = [];
  const naFaixa = (lado: number, s0: number, s1: number, o0: number, o1: number) => {
    const pts = amRb.filter((p) => p.s >= s0 && p.s <= s1);
    return contorno([...pts.map((p): P => [p.x + p.nx * o0 * lado, p.y + p.ny * o0 * lado]), ...pts.reverse().map((p): P => [p.x + p.nx * o1 * lado, p.y + p.ny * o1 * lado])]);
  };
  for (const [lado, s0, s1] of paredesUteis) {
    muscRb.push(naFaixa(lado, s0, s1, HW_RB + 9.5, HW_RB + 19));
    for (let s = s0; s + 8 <= s1; s += 8.5) {
      celRb.push(naFaixa(lado, s, s + 8.5, HW_RB - 0.5, HW_RB + 10));
      const p = amRb[Math.min(amRb.length - 1, Math.round((s + 4.25) / 2))];
      nucRb.push(circulo(p.x + p.nx * lado * (HW_RB + 5.2), p.y + p.ny * lado * (HW_RB + 5.2), 2.7));
      if (rng() < 0.4)
        for (const du of [-2.2, 0, 2.2]) {
          const bx = p.x + p.tx * du + p.nx * lado * HW_RB;
          const by = p.y + p.ty * du + p.ny * lado * HW_RB;
          ciliosRb.push(`M${f(bx)},${f(by)}l${f(-p.nx * lado * 4.5)},${f(-p.ny * lado * 4.5)}`);
        }
    }
    for (let s = s0 + 7; s + 7 <= s1; s += 13) {
      const p = amRb[Math.min(amRb.length - 1, Math.round(s / 2))];
      nucMuscRb.push(elipse(p.x + p.nx * lado * (HW_RB + 14.5), p.y + p.ny * lado * (HW_RB + 14.5), 5, 1.2, graus(p.tx, p.ty)));
    }
  }

  // macrófagos alveolares ("células de poeira"): na luz alveolar, com pigmento fagocitado
  const macrofagos: ReactElement[] = [];
  const candidatos = sitios.map((s, i) => ({ s, i })).filter(({ s }) => s.x > 60 && s.x < W - 60 && s.y > 60 && s.y < H - 60 && noParenquima(s.x, s.y, 40));
  for (let k = 0, feitos = 0; k < candidatos.length * 3 && feitos < 7; k++) {
    const { s, i } = candidatos[Math.floor(rng() * candidatos.length)];
    const x = s.x + entre(rng, -16, 16);
    const y = s.y + entre(rng, -16, 16);
    if (!dentro(x, y, alveolos[i]) || distLinha(x, y, alveolos[i], true) < 13 || !occ.livre(x, y, 11, 2)) continue;
    occ.marcar(x, y, 11);
    feitos++;
    const corpo = chaikin(Array.from({ length: 9 }, (_, q): P => {
      const a = (2 * Math.PI * q) / 9;
      const r = entre(rng, 8, 10.5);
      return [x + Math.cos(a) * r, y + Math.sin(a) * r];
    }), 1);
    const an = entre(rng, 0, Math.PI * 2);
    const nx = x + Math.cos(an) * 3.2;
    const ny = y + Math.sin(an) * 3.2;
    const graos: string[] = [];
    const preto: string[] = [];
    for (let q = 0; q < 12; q++) {
      const a = an + Math.PI + entre(rng, -1.3, 1.3);
      const r = entre(rng, 1.5, 6.5);
      (q % 3 ? graos : preto).push(circulo(x + Math.cos(a) * r, y + Math.sin(a) * r, entre(rng, 0.7, 1.3)));
    }
    macrofagos.push(
      <g key={k}>
        <path d={contorno(corpo)} fill={cor.macrofago} stroke={cor.borda} strokeWidth={0.8} />
        <path d={graos.join('')} fill={cor.pigmento} />
        <path d={preto.join('')} fill={cor.carvao} />
        <path d={elipse(nx, ny, 3.8, 2.7, graus(Math.cos(an + 1.57), Math.sin(an + 1.57)))} fill={HE.nucleo} />
      </g>,
    );
  }

  // bronquíolo: epitélio simples cilíndrico baixo/cúbico (células ciliadas e células club), sem cartilagem nem glândulas
  const fase = entre(rng, 0, 6);
  const apical = pontosPolar(B[0], B[1], (a) => 57 + 6 * Math.cos(6 * a + fase), 240);
  const ep = epitelio(apical, 8.5, () => 14, -1);
  const ciliadas: string[] = [];
  const club: string[] = [];
  const nucEp: string[] = [];
  const cilios: string[] = [];
  ep.celulas.forEach((c, k) => {
    if (k % 4 === 1) {
      // célula club (de Clara): ápice em cúpula, sem cílios
      const m = ep.meio(k, 0);
      club.push(`${contorno([c[1], c[2], c[3], c[0]], false)}Q${f(m.x - m.nx * 10)},${f(m.y - m.ny * 10)} ${f(c[1][0])},${f(c[1][1])}z`);
      const nn = ep.meio(k, 0.55);
      nucEp.push(circulo(nn.x, nn.y, 2.7));
    } else {
      ciliadas.push(contorno(c));
      const nn = ep.meio(k, 0.58);
      nucEp.push(elipse(nn.x, nn.y, 3.4, 2.1, nn.ang));
      for (const u of [0.2, 0.5, 0.8]) {
        const bx = c[0][0] + (c[1][0] - c[0][0]) * u;
        const by = c[0][1] + (c[1][1] - c[0][1]) * u;
        const m = ep.meio(k, 0);
        cilios.push(`M${f(bx)},${f(by)}l${f(-m.nx * 5 + entre(rng, -0.6, 0.6))},${f(-m.ny * 5 + entre(rng, -0.6, 0.6))}`);
      }
    }
  });
  const nucMusc: string[] = [];
  for (let k = 0; k < 30; k++) {
    const a = (2 * Math.PI * (k + entre(rng, -0.2, 0.2))) / 30;
    nucMusc.push(elipse(B[0] + Math.cos(a) * 88.5, B[1] + Math.sin(a) * 88.5, 5.2, 1.3, (a * 180) / Math.PI + 90));
  }
  const nucAdv: string[] = [];
  for (let k = 0; k < 16; k++) {
    const a = entre(rng, 0, Math.PI * 2);
    const r = entre(rng, 98, RB - 4);
    nucAdv.push(elipse(B[0] + Math.cos(a) * r, B[1] + Math.sin(a) * r, 5, 1.4, (a * 180) / Math.PI + 90 + entre(rng, -20, 20)));
  }

  // ramo da artéria pulmonar (parede delgada para o calibre); não é estrutura do jogo
  const hemArt: string[] = [];
  const occA = ocupacao(12, 5);
  for (let t = 0, n = 0; t < 400 && n < 16; t++) {
    const a = entre(rng, 0, Math.PI * 2);
    const r = Math.sqrt(rng()) * (RA - 16);
    const x = A[0] + Math.cos(a) * r;
    const y = A[1] + Math.sin(a) * r;
    if (!occA.livre(x, y, 4.2, 0.4)) continue;
    occA.marcar(x, y, 4.2);
    n++;
    hemArt.push(hemacia(x, y, 3.8, entre(rng, 0, 180), entre(rng, 2.2, 3)));
  }
  const nucMedia = Array.from({ length: 22 }, (_, k) => {
    const a = (2 * Math.PI * k) / 22 + entre(rng, -0.08, 0.08);
    return elipse(A[0] + Math.cos(a) * (RA - 4.5), A[1] + Math.sin(a) * (RA - 4.5), 4.6, 1.2, (a * 180) / Math.PI + 90);
  }).join('');
  const nucEndo = Array.from({ length: 7 }, (_, k) => {
    const a = (2 * Math.PI * k) / 7 + entre(rng, -0.2, 0.2);
    return elipse(A[0] + Math.cos(a) * (RA - 9.6), A[1] + Math.sin(a) * (RA - 9.6), 3.6, 1.1, (a * 180) / Math.PI + 90);
  }).join('');
  const nucBainha: string[] = [];
  for (let t = 0, n = 0; t < 300 && n < 18; t++) {
    const x = entre(rng, 70, 360);
    const y = entre(rng, 100, 560);
    if (!dentro(x, y, bainha) || Math.hypot(x - B[0], y - B[1]) < RB + 4 || Math.hypot(x - A[0], y - A[1]) < RA + 4) continue;
    n++;
    nucBainha.push(elipse(x, y, 5.5, 1.5, entre(rng, 0, 180)));
  }

  const luzRb = contorno(rb, false);
  const luzAd = contorno(ad, false) + contorno(ad2, false);
  return (
    <>
      <E id="septo-interalveolar">
        <rect x={-20} y={-20} width={W + 40} height={H + 40} fill={cor.septo} />
      </E>
      <E id="alveolo">
        <path d={alveolos.map((a) => contorno(a)).join('')} fill={cor.ar} stroke={cor.borda} strokeWidth={0.7} />
      </E>
      <E id="bronquiolo-respiratorio">
        <path d={luzRb} stroke={cor.ar} strokeWidth={2 * HW_RB} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </E>
      <E id="ducto-alveolar">
        <path d={luzAd} stroke={cor.ar} strokeWidth={2 * HW_AD} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={sacos.map(([x, y, r]) => circulo(x, y, r)).join('')} fill={cor.ar} />
      </E>
      <E id="septo-interalveolar">
        <path d={pontas.join('')} fill={cor.septo} />
      </E>
      <E id="capilar">
        {/* margem de toque de ~1,75 un em volta do capilar (a parede endotelial), sob os pneumócitos */}
        <path d={capilares.join('')} fill="none" stroke="transparent" strokeWidth={3.5} />
        <path d={capilares.join('')} fill={cor.capilar} stroke={cor.endotelio} strokeWidth={0.9} />
        <path d={hemacias.join('')} fill={HE.hemacia} />
        <path d={endotelio.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="pneumocito-tipo-i">
        <path d={alvoI.join('')} fill="transparent" />
        <path d={tipoI.join('')} fill={cor.pneumoI} />
        <path d={nucI.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="pneumocito-tipo-ii">
        <path d={tipoII.join('')} fill={cor.pneumoII} stroke={cor.borda} strokeWidth={0.7} />
        <path d={espuma.join('')} fill={cor.espuma} />
        <path d={nucII.join('')} fill={HE.nucleo} />
      </E>
      <E id="ducto-alveolar">
        <path d={botoes.join('')} fill={HE.musculo} stroke="#c45a8a" strokeWidth={0.8} />
        <path d={nucBotao.join('')} fill={HE.nucleo} />
      </E>
      <E id="bronquiolo-respiratorio">
        <path d={muscRb.join('')} fill={HE.musculo} />
        <path d={nucMuscRb.join('')} fill={HE.nucleo} />
        <path d={celRb.join('')} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.6} />
        <path d={nucRb.join('')} fill={HE.nucleo} />
        <path d={ciliosRb.join('')} stroke="#c4467c" strokeWidth={0.6} fill="none" />
      </E>
      <E id="macrofago-alveolar">{macrofagos}</E>
      {/* bainha conjuntiva broncovascular e ramo da artéria pulmonar: contexto, sem área de toque */}
      <g>
        <path d={contorno(bainha)} fill={cor.bainha} />
        <Deco>
          <path d={nucBainha.join('')} fill={HE.nucleo} />
        </Deco>
        <circle cx={A[0]} cy={A[1]} r={RA + 8} fill="#eebfd3" />
        <circle cx={A[0]} cy={A[1]} r={RA} fill={HE.musculo} />
        <path d={nucMedia} fill={HE.nucleo} />
        <path d={contorno(pontosPolar(A[0], A[1], (a) => RA - 8.5 + 0.7 * Math.sin(48 * a), 192))} fill="none" stroke="#f6d7e5" strokeWidth={1.6} />
        <circle cx={A[0]} cy={A[1]} r={RA - 9.4} fill={cor.ar} />
        <path d={nucEndo} fill={HE.nucleoEscuro} />
        <path d={hemArt.join('')} fill={HE.hemacia} />
      </g>
      <E id="bronquiolo">
        <circle cx={B[0]} cy={B[1]} r={RB} fill="#efc2d5" />
        <path d={nucAdv.join('')} fill={HE.nucleo} />
        <circle cx={B[0]} cy={B[1]} r={94} fill={HE.musculo} />
        <path d={nucMusc.join('')} fill={HE.nucleo} />
        <circle cx={B[0]} cy={B[1]} r={83} fill="#f3d0df" />
        <path d={ciliadas.join('')} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.6} />
        <path d={contorno(apical)} fill={cor.ar} />
        <path d={club.join('')} fill="#f3c6d8" stroke={HE.citoplasmaEscuro} strokeWidth={0.6} />
        <path d={nucEp.join('')} fill={HE.nucleo} />
        <path d={cilios.join('')} stroke="#c4467c" strokeWidth={0.7} fill="none" />
      </E>
    </>
  );
}

// =============================================================================================
// 2. RIM, CÓRTEX — escala 1 un ≈ 0,75 µm: corpúsculo renal ≈ 180 µm; TCP ≈ 57 µm de diâmetro externo; TCD ≈ 42 µm;
// hemácia ≈ 10 un.
export const PARTES_RIM = ['glomerulo', 'espaco-urinario', 'capsula-glomerular', 'tubulo-contorcido-proximal', 'tubulo-contorcido-distal', 'macula-densa', 'arteriola-aferente', 'arteriola-eferente', 'capilar'];

/** Arteríola em corte longitudinal entre p0 e p1: parede de músculo liso, endotélio e hemácias na luz. */
function arteriolaLongitudinal(rng: Rng, p0: P, p1: P, hw: number, hl: number, jg: number, mostrar: (x: number, y: number) => boolean) {
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const tx = (p1[0] - p0[0]) / L;
  const ty = (p1[1] - p0[1]) / L;
  const em = (s: number, o: number): P => [p0[0] + tx * s - ty * o, p0[1] + ty * s + tx * o];
  const faixa = (o0: number, o1: number, s0 = 0, s1 = L) => contorno([em(s0, o0), em(s1, o0), em(s1, o1), em(s0, o1)]);
  const ang = graus(tx, ty);
  const nucM: string[] = [];
  const nucE: string[] = [];
  const hem: string[] = [];
  const jgCel: string[] = [];
  const jgNuc: string[] = [];
  const jgGraos: string[] = [];
  const om = hl + (hw - hl) / 2;
  for (let s = 4; s < L - 3; s += entre(rng, 8, 13)) {
    for (const lado of [1, -1]) {
      if (rng() < 0.3) continue;
      if (s > L - jg && lado === 1) continue; // trecho com células justaglomerulares
      // músculo liso circular cortado de través: núcleos curtos, transversais ao eixo do vaso
      const [x, y] = em(s + entre(rng, -2.5, 2.5), lado * (om + entre(rng, -1.2, 1.2)));
      if (mostrar(x, y)) nucM.push(elipse(x, y, 1.7, 2.6, ang));
    }
  }
  for (let s = 10; s < L - 6; s += 26) for (const lado of [1, -1]) {
    const [x, y] = em(s + entre(rng, -4, 4), lado * (hl - 0.9));
    if (mostrar(x, y)) nucE.push(elipse(x, y, 4, 1, ang));
  }
  for (let s = 8; s < L - 6; s += entre(rng, 15, 26)) {
    const [x, y] = em(s, entre(rng, -hl + 4, hl - 4));
    hem.push(hemacia(x, y, 4.6, ang + entre(rng, -30, 30), 2.6));
  }
  // células justaglomerulares: células musculares lisas modificadas, epitelioides, com grânulos de renina
  for (let s = L - jg; s < L - 4; s += 8.5) {
    jgCel.push(faixa(hl + 0.3, hw - 0.3, s, s + 8));
    const [x, y] = em(s + 4, om);
    if (mostrar(x, y)) jgNuc.push(circulo(x, y, 2.4));
    for (let k = 0; k < 4; k++) {
      const [gx, gy] = em(s + entre(rng, 1, 7), om + entre(rng, -3, 3));
      if (Math.hypot(gx - x, gy - y) > 3.2) jgGraos.push(circulo(gx, gy, 0.6));
    }
  }
  return { parede: faixa(-hw, hw), luz: faixa(-hl, hl), nucM: nucM.join(''), nucE: nucE.join(''), hem: hem.join(''), jgCel: jgCel.join(''), jgNuc: jgNuc.join(''), jgGraos: jgGraos.join('') };
}

/** Córtex renal: corpúsculos renais (glomérulo, espaço urinário, cápsula), túbulos contorcidos e aparelho justaglomerular. */
export function LaminaRimCortex(rng: Rng) {
  const cor = { interst: '#f3d5e2', tcp: '#dc79a4', escova: '#c8528c', estrias: '#ec9fc2', tcd: '#f1c2d6', tcdBorda: '#d590b2', membrana: '#c2578a', tufo: '#e597bb', alca: '#fbeef3', mb: '#cd6395', espaco: '#fcf5f8', capsula: '#cf769f', parede: '#e07eab', jg: '#efb7cf' };
  // corpúsculos renais; o primeiro com o polo vascular (arteríolas) e a mácula densa
  const corpusculos = [
    { x: 330, y: 330, R: 120, polo: true },
    { x: 790, y: 505, R: 104, polo: false },
    { x: -24, y: 676, R: 112, polo: false },
  ];
  const aferente: [P, P] = [[172, 102], [312, 240]];
  const eferente: [P, P] = [[350, 240], [492, 110]];
  const MD = { x: 333, y: 171, R: 31 };
  // túbulos em corte transversal: sementes com distância mínima (TCP ≈ 70%, maiores; TCD menores) e diagrama de
  // potência, que dá contornos arredondados e encostados uns nos outros, como no córtex real (interstício estreito).
  // Corpúsculos, arteríolas e o TCD da mácula densa entram como sítios fixos: os túbulos vizinhos se moldam a eles.
  const occ = ocupacao(60, 130);
  const fixos: Sitio[] = [];
  corpusculos.forEach((c) => {
    occ.marcar(c.x, c.y, c.R + 6);
    fixos.push({ x: c.x, y: c.y, w: c.R + 7 });
  });
  for (const [[ax, ay], [bx, by], hw] of [[...aferente, 17], [...eferente, 13]] as [P, P, number][]) {
    const L = Math.hypot(bx - ax, by - ay);
    for (let t = 0; t <= L; t += 10) {
      const x = ax + ((bx - ax) * t) / L;
      const y = ay + ((by - ay) * t) / L;
      occ.marcar(x, y, hw + 4);
      fixos.push({ x, y, w: hw + 6 });
    }
  }
  occ.marcar(MD.x, MD.y, MD.R + 2);
  const tubSem = dardos(rng, 9000, [-70, -70, W + 70, H + 70], () => (rng() < 0.8 ? entre(rng, 33, 37) : entre(rng, 24, 27)), () => true, occ, 0);
  const mdSitio: Sitio = { x: MD.x, y: MD.y, w: MD.R + 3 };
  const sitios: Sitio[] = [...tubSem.map(([x, y, r]) => ({ x, y, w: r })), mdSitio, ...fixos];
  relaxar(sitios, tubSem.length, (st) => st.w * 1.8, 2);
  const forma = (st: Sitio) => arredondar(chaikin(celulaPotencia(st, sitios, st.w * 1.6, 4.2), 2), 1.16, 0.42);
  const proximais = sitios.slice(0, tubSem.length).filter((q) => q.w >= 31).map(forma);
  const distais = sitios.slice(0, tubSem.length).filter((q) => q.w < 31).map(forma);
  const contornoMd = forma(mdSitio);
  const centroide = (pol: P[]): P => [pol.reduce((a, p) => a + p[0], 0) / pol.length, pol.reduce((a, p) => a + p[1], 0) / pol.length];
  // distância do centro até o contorno na direção a (interseção do raio com as arestas)
  const raioEm = (pol: P[], c: P, a: number) => {
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let t = 90;
    pol.forEach((p, i) => {
      const q = pol[(i + 1) % pol.length];
      const ex = q[0] - p[0];
      const ey = q[1] - p[1];
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) return;
      const tt = ((p[0] - c[0]) * ey - (p[1] - c[1]) * ex) / den;
      const u = ((p[0] - c[0]) * dy - (p[1] - c[1]) * dx) / den;
      if (tt > 0 && u >= 0 && u <= 1) t = Math.min(t, tt);
    });
    return t;
  };

  // capilares peritubulares: no interstício entre túbulos vizinhos (com hemácia e, às vezes, núcleo endotelial)
  const capilares: string[] = [];
  const hemCap: string[] = [];
  const nucCap: string[] = [];
  const brutas = sitios.slice(0, tubSem.length).map((st) => celulaPotencia(st, sitios, st.w * 1.6, 0));
  const vistos = new Set<string>();
  const occCap = ocupacao(30, 14);
  brutas.forEach((pol) =>
    pol.forEach((a, k) => {
      const b = pol[(k + 1) % pol.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const chave = `${Math.round(mx / 3)},${Math.round(my / 3)}`;
      if (L < 24 || vistos.has(chave) || mx < -10 || mx > W + 10 || my < -10 || my > H + 10) return;
      vistos.add(chave);
      if (fixos.some((q) => Math.hypot(q.x - mx, q.y - my) < q.w + 6) || Math.hypot(mx - MD.x, my - MD.y) < MD.R + 12 || rng() > 0.4) return;
      const ang = graus(b[0] - a[0], b[1] - a[1]);
      const rx = Math.min(L / 2 - 5, 12);
      if (!occCap.livre(mx, my, rx, 4)) return;
      occCap.marcar(mx, my, rx);
      capilares.push(elipse(mx, my, rx, 4.5, ang));
      hemCap.push(hemacia(mx + entre(rng, -2, 2), my, Math.min(4.6, rx - 1), ang, 2.7));
      if (rng() < 0.35) nucCap.push(elipse(mx + ((b[0] - a[0]) / L) * (rx - 3.5), my + ((b[1] - a[1]) / L) * (rx - 3.5), 2.6, 1, ang));
    }),
  );
  // nas junções de três túbulos sobra um espaço triangular maior: capilar mais calibroso ou fibroblasto
  const todos = [...proximais, ...distais, contornoMd];
  const centros = todos.map(centroidePol);
  // espaço livre em volta de um ponto do interstício (negativo se cair dentro de um túbulo)
  const folgaEm = (x: number, y: number) => {
    let m = 99;
    todos.forEach((pol, i) => {
      if (Math.hypot(centros[i][0] - x, centros[i][1] - y) > 70) return;
      m = Math.min(m, dentro(x, y, pol) ? -1 : distLinha(x, y, pol, true) - 0.6);
    });
    for (const c of corpusculos) m = Math.min(m, Math.hypot(c.x - x, c.y - y) - c.R - 3);
    for (const q of fixos) m = Math.min(m, Math.hypot(q.x - x, q.y - y) - q.w + 2);
    return m;
  };
  const fibroblastos: string[] = [];
  const jaVisto = new Set<string>();
  for (const pol of brutas)
    for (const v of pol) {
      const chave = `${Math.round(v[0] / 4)},${Math.round(v[1] / 4)}`;
      if (jaVisto.has(chave) || v[0] < -10 || v[0] > W + 10 || v[1] < -10 || v[1] > H + 10) continue;
      jaVisto.add(chave);
      const r = Math.min(8, Math.floor(folgaEm(v[0], v[1]) * 2) / 2);
      if (r < 4.5 || !occCap.livre(v[0], v[1], r, 4)) continue;
      occCap.marcar(v[0], v[1], r);
      if (rng() < 0.45) {
        capilares.push(circulo(v[0], v[1], r));
        hemCap.push(hemacia(v[0], v[1], Math.min(4.6, r - 1), entre(rng, 0, 180), Math.min(3, r - 1.6)));
      } else if (rng() < 0.5) fibroblastos.push(elipse(v[0], v[1], Math.min(4, r - 0.5), 1.3, entre(rng, 0, 180)));
    }

  // TCP: células altas e eosinófilas, limites pouco nítidos, poucos núcleos por corte, borda em escova e luz estreita
  const occNuc = ocupacao(20, 6);
  const tcpNuc: string[] = [];
  const tcpEscova: string[] = [];
  const tcpEstrias: string[] = [];
  const tcpLuz: string[] = [];
  for (const pol of proximais) {
    const c = centroide(pol);
    const rin = Math.min(...pol.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1])));
    const n = 4 + (rin > 34 ? 1 : 0) + (rng() < 0.35 ? 1 : 0);
    const giro = entre(rng, 0, Math.PI * 2);
    for (let k = 0; k < n; k++) {
      const a = giro + (2 * Math.PI * k) / n + entre(rng, -0.2, 0.2);
      const r = raioEm(pol, c, a) * 0.64;
      const px = c[0] + Math.cos(a) * r;
      const py = c[1] + Math.sin(a) * r;
      if (!occNuc.livre(px, py, 4.4, 0.5)) continue;
      occNuc.marcar(px, py, 4.4);
      tcpNuc.push(circulo(px, py, 4.4));
    }
    const f1 = entre(rng, 0, 6);
    const f2 = entre(rng, 0, 6);
    const rl = (a: number) => Math.max(3.5, rin * 0.3 * (1 + 0.22 * Math.sin(3 * a + f1) + 0.16 * Math.sin(5 * a + f2)));
    tcpEscova.push(contorno(pontosPolar(c[0], c[1], (a) => rl(a) + 4.4, 60)));
    tcpEstrias.push(contorno(pontosPolar(c[0], c[1], (a) => rl(a) + 2.2, 60)));
    tcpLuz.push(contorno(pontosPolar(c[0], c[1], rl, 60)));
  }
  // TCD: células mais baixas e claras, limites nítidos, mais núcleos por corte, sem borda em escova, luz ampla
  const tcdCel: string[] = [];
  const tcdNuc: string[] = [];
  const tcdLuz: string[] = [];
  const mdCel: string[] = [];
  const mdNuc: string[] = [];
  const polo: P = [corpusculos[0].x, corpusculos[0].y - corpusculos[0].R];
  const tubuloDistal = (pol: P[], md: boolean) => {
    const c = centroide(pol);
    const ux = (polo[0] - c[0]) / Math.hypot(polo[0] - c[0], polo[1] - c[1]);
    const uy = (polo[1] - c[1]) / Math.hypot(polo[0] - c[0], polo[1] - c[1]);
    // fração da mácula densa: lado do túbulo voltado para o polo vascular (normal externa ≈ direção do polo)
    const voltado = (b: Amostra) => (md ? -(b.nx * ux + b.ny * uy) : -1);
    const largura = 12.5;
    const n = Math.max(6, Math.round(perimetro(pol) / largura));
    const base = amostrar(pol, n, true);
    const alt = base.map((b) => {
      const v = voltado(b);
      return v > 0.55 ? 11.5 + 5 * ((v - 0.55) / 0.45) : 11.5;
    });
    const topo: P[] = base.map((b, k) => [b.x + b.nx * alt[k], b.y + b.ny * alt[k]]);
    base.forEach((b, k) => {
      const q = base[(k + 1) % n];
      const cel: P[] = [[b.x, b.y], [q.x, q.y], topo[(k + 1) % n], topo[k]];
      const mxp = (b.x + q.x) / 2;
      const myp = (b.y + q.y) / 2;
      const nx = (b.nx + q.nx) / 2;
      const ny = (b.ny + q.ny) / 2;
      const h = (alt[k] + alt[(k + 1) % n]) / 2;
      if (voltado(b) > 0.7) {
        // mácula densa: células altas e estreitas (duas por fatia), núcleos apinhados, alongados e mais apicais
        const meio: P = [(cel[0][0] + cel[1][0]) / 2, (cel[0][1] + cel[1][1]) / 2];
        const meioT: P = [(cel[2][0] + cel[3][0]) / 2, (cel[2][1] + cel[3][1]) / 2];
        mdCel.push(contorno([cel[0], meio, meioT, cel[3]]), contorno([meio, cel[1], cel[2], meioT]));
        for (const [u, prof] of [[0.25, 0.42], [0.75, 0.66]]) {
          const bx = cel[0][0] + (cel[1][0] - cel[0][0]) * u;
          const by = cel[0][1] + (cel[1][1] - cel[0][1]) * u;
          const nxp = bx + nx * h * prof;
          const nyp = by + ny * h * prof;
          if (!occNuc.livre(nxp, nyp, 1.8, 0.3)) continue;
          occNuc.marcar(nxp, nyp, 1.8);
          mdNuc.push(elipse(nxp, nyp, 3.6, 1.7, graus(nx, ny)));
        }
        return;
      }
      tcdCel.push(contorno(cel));
      const px = mxp + nx * h * 0.5;
      const py = myp + ny * h * 0.5;
      if (rng() < 0.85 && occNuc.livre(px, py, 3.4, 0.5)) {
        occNuc.marcar(px, py, 3.4);
        tcdNuc.push(circulo(px, py, 3.4));
      }
    });
    tcdLuz.push(contorno(topo));
  };
  for (const pol of distais) tubuloDistal(pol, false);
  tubuloDistal(contornoMd, true);

  // corpúsculos: cápsula (folheto parietal), espaço urinário e tufo glomerular lobulado
  const espacos: string[] = [];
  const capsulas: string[] = [];
  const capsulaNuc: string[] = [];
  const tufos: string[] = [];
  const alcas: string[] = [];
  const hemTufo: string[] = [];
  const nucTufo: string[] = [];
  corpusculos.forEach((c) => {
    espacos.push(circulo(c.x, c.y, c.R));
    capsulas.push(circulo(c.x, c.y, c.R + 0.6));
    const nN = Math.round((2 * Math.PI * c.R) / 46);
    for (let k = 0; k < nN; k++) {
      const a = (2 * Math.PI * (k + entre(rng, -0.2, 0.2))) / nN;
      if (c.polo && Math.abs(a - (3 * Math.PI) / 2) < 0.5) continue;
      capsulaNuc.push(elipse(c.x + Math.cos(a) * (c.R - 1), c.y + Math.sin(a) * (c.R - 1), 5.4, 1.8, (a * 180) / Math.PI + 90));
    }
    // lóbulos do tufo (alças capilares agrupadas); no polo vascular o tufo encosta na cápsula
    const lob: [number, number, number][] = [[c.x, c.y, c.R * 0.5]];
    const nl = 6;
    const g0 = entre(rng, 0, 1);
    for (let k = 0; k < nl; k++) {
      const a = g0 + (2 * Math.PI * k) / nl + entre(rng, -0.15, 0.15);
      lob.push([c.x + Math.cos(a) * c.R * 0.45, c.y + Math.sin(a) * c.R * 0.45, c.R * entre(rng, 0.38, 0.42)]);
    }
    if (c.polo) lob.push([c.x, c.y - c.R + 33, 30]);
    tufos.push(lob.map(([x, y, r]) => circulo(x, y, r)).join(''));
    const noTufo = (x: number, y: number, m: number) => lob.some(([lx, ly, r]) => Math.hypot(x - lx, y - ly) < r - m);
    const occG = ocupacao(16, 8);
    const loops = dardos(rng, 1400, [c.x - c.R, c.y - c.R, c.x + c.R, c.y + c.R], () => entre(rng, 5, 8), (x, y, r) => noTufo(x, y, r * 0.5), occG, 2);
    for (const [x, y, r] of loops) {
      alcas.push(circulo(x, y, r));
      if (rng() < 0.6) hemTufo.push(hemacia(x, y, Math.min(4.6, r - 1), entre(rng, 0, 180), Math.min(3.2, r - 2.4)));
    }
    // núcleos de células mesangiais, endoteliais e podócitos entre as alças (não se sobrepõem às alças)
    dardos(rng, 1400, [c.x - c.R, c.y - c.R, c.x + c.R, c.y + c.R], () => 3.2, (x, y) => noTufo(x, y, 1), occG, 0.9).forEach(([x, y, r]) => nucTufo.push(circulo(x, y, r)));
  });
  // dentro da cápsula a arteríola entra no tufo: sem núcleos da parede ali (o tufo a cobre)
  const foraDoCorpusculo = (x: number, y: number) => Math.hypot(x - corpusculos[0].x, y - corpusculos[0].y) > corpusculos[0].R - 2;
  const af = arteriolaLongitudinal(rng, aferente[0], aferente[1], 17, 8.5, 40, foraDoCorpusculo);
  const ef = arteriolaLongitudinal(rng, eferente[0], eferente[1], 13, 7, 0, foraDoCorpusculo);

  return (
    <>
      <rect x={-20} y={-20} width={W + 40} height={H + 40} fill={cor.interst} />
      <Deco>
        <path d={fibroblastos.join('')} fill={HE.nucleo} />
      </Deco>
      <E id="tubulo-contorcido-proximal">
        <path d={proximais.map((p) => contorno(p)).join('')} fill={cor.tcp} stroke={cor.membrana} strokeWidth={1.4} />
        <path d={tcpNuc.join('')} fill={HE.nucleo} />
        <path d={tcpEscova.join('')} fill={cor.escova} />
        <path d={tcpEstrias.join('')} fill="none" stroke={cor.estrias} strokeWidth={4.4} strokeDasharray="0.6 1.2" />
        <path d={tcpLuz.join('')} fill={HE.luz} />
      </E>
      <E id="tubulo-contorcido-distal">
        <path d={[...distais, contornoMd].map((p) => contorno(p)).join('')} fill={cor.tcd} stroke={cor.membrana} strokeWidth={1.2} />
        <path d={tcdCel.join('')} fill={cor.tcd} stroke={cor.tcdBorda} strokeWidth={0.7} />
        <path d={tcdNuc.join('')} fill={HE.nucleo} />
        <path d={tcdLuz.join('')} fill={HE.luz} />
      </E>
      <E id="capilar">
        <path d={capilares.join('')} fill="#fbe9f1" stroke="#c96b98" strokeWidth={0.8} />
        <path d={hemCap.join('')} fill={HE.hemacia} />
        <path d={nucCap.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="macula-densa">
        <path d={mdCel.join('')} fill="#eab3cb" stroke={cor.tcdBorda} strokeWidth={0.6} />
        <path d={mdNuc.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="espaco-urinario">
        <path d={espacos.join('')} fill={cor.espaco} />
      </E>
      <E id="capsula-glomerular">
        {/* faixa de toque um pouco mais larga que o folheto parietal (que tem só 2–3 µm) */}
        <path d={capsulas.join('')} fill="none" stroke="transparent" strokeWidth={10} />
        <path d={capsulas.join('')} fill="none" stroke={cor.capsula} strokeWidth={3.4} />
        <path d={capsulaNuc.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="arteriola-aferente">
        <path d={af.parede} fill={cor.parede} />
        <path d={af.jgCel} fill={cor.jg} stroke="#d98bb0" strokeWidth={0.5} />
        <path d={af.jgGraos} fill="#b9427c" />
        <path d={af.jgNuc} fill={HE.nucleo} />
        <path d={af.nucM} fill={HE.nucleo} />
        <path d={af.luz} fill={HE.luz} />
        <path d={af.nucE} fill={HE.nucleoEscuro} />
        <path d={af.hem} fill={HE.hemacia} />
      </E>
      <E id="arteriola-eferente">
        <path d={ef.parede} fill={cor.parede} />
        <path d={ef.nucM} fill={HE.nucleo} />
        <path d={ef.luz} fill={HE.luz} />
        <path d={ef.nucE} fill={HE.nucleoEscuro} />
        <path d={ef.hem} fill={HE.hemacia} />
      </E>
      <E id="glomerulo">
        <path d={tufos.join('')} fill={cor.tufo} />
        <path d={alcas.join('')} fill={cor.alca} stroke={cor.mb} strokeWidth={1} />
        <path d={hemTufo.join('')} fill={HE.hemacia} />
        <path d={nucTufo.join('')} fill={HE.nucleo} />
      </E>
    </>
  );
}

// =============================================================================================
// 3. TIREOIDE — escala 1 un ≈ 1 µm: folículos de 50–250 µm; tirócitos cúbicos de ~10 µm; célula C ≈ 15 µm.
export const PARTES_TIREOIDE = ['foliculo-tireoidiano', 'tirocito', 'coloide', 'celulas-parafoliculares', 'capilar', 'septo-conjuntivo'];

/** Tireoide: folículos de tamanhos variados, coloide, tirócitos, células parafoliculares (C) e capilares. */
export function LaminaTireoide(rng: Rng) {
  const cor = { estroma: '#f4d5e2', septo: '#eaa9c6', fibra: '#de8fb4', tirocito: '#eeb1cb', borda: '#d283aa', coloide: '#e283ae', vacuolo: '#fbeef4', celulaC: '#f1dbe6', bordaC: '#c29ab3', nucC: '#7465b3' };
  // septo interlobular atravessando o campo, com vasos
  const septo = curva([[-40, 600], [200, 560], [470, 590], [720, 545], [1040, 575]], 4);
  const HS = 17;
  const fixos: Sitio[] = septo.filter((_, i) => i % 3 === 0).map(([x, y]) => ({ x, y, w: HS + 5 }));
  const occ = ocupacao(60, 100);
  for (const q of fixos) occ.marcar(q.x, q.y, HS + 4);
  const sem = dardos(rng, 7000, [-80, -80, W + 80, H + 80], () => 26 + 70 * rng() ** 2, () => true, occ, 0);
  // algumas sementes pequenas viram ilhas de células C entre os folículos
  const ilhasIdx = new Set(sem.map((q, i) => ({ q, i })).filter(({ q }) => q[2] < 34 && q[0] > 80 && q[0] < W - 80 && q[1] > 80 && q[1] < 480).slice(0, 3).map(({ i }) => i));
  const sitios: Sitio[] = [...sem.map(([x, y, r]) => ({ x, y, w: r })), ...fixos];
  relaxar(sitios, sem.length, (st) => st.w * 1.8, 1);
  const forma = (i: number) => arredondar(chaikin(celulaPotencia(sitios[i], sitios, sitios[i].w * 1.7, 4.2), 3), 1.35, 0.7);
  const occN = ocupacao(30, 12);

  const celulas: string[] = [];
  const nucleos: string[] = [];
  const coloide: string[] = [];
  const vacuolos: string[] = [];
  const cCel: string[] = [];
  const cNuc: string[] = [];
  const estromaIlha: string[] = [];
  const contornos: string[] = [];
  let comC = 0;
  sem.forEach((_, i) => {
    const { x, y, w: r } = sitios[i];
    const pol = forma(i);
    if (pol.length < 3 || x < -60 || x > W + 60 || y < -60 || y > H + 60) return;
    if (ilhasIdx.has(i)) {
      // ilha interfolicular: grupo compacto de células C (claras, maiores que os tirócitos) no conjuntivo
      estromaIlha.push(contorno(pol));
      const centrosC = dardos(rng, 400, [x - r * 1.5, y - r * 1.5, x + r * 1.5, y + r * 1.5], () => 7, (cx, cy) => dentro(cx, cy, pol) && distLinha(cx, cy, pol, true) > 9, occN, 0);
      const sc: Sitio[] = centrosC.map(([cx, cy]) => ({ x: cx, y: cy, w: 0 }));
      sc.forEach((q) => {
        const cel = celulaPotencia(q, sc, 10.5, 0.5);
        if (cel.length < 3) return;
        cCel.push(contorno(chaikin(cel, 1)));
        cNuc.push(circulo(q.x + entre(rng, -0.8, 0.8), q.y + entre(rng, -0.8, 0.8), 3.2));
      });
      return;
    }
    // folículos grandes têm epitélio mais baixo (menos ativos); os pequenos, mais alto
    const temC = r > 34 && r < 70 && comC < 14 && rng() < 0.6;
    if (temC) comC++;
    const h = temC ? 12 : r > 70 ? 7 : r > 45 ? 9 : 10.5;
    const ep = epitelio(pol, 9, () => h, 1);
    ep.celulas.forEach((c) => celulas.push(contorno(c)));
    const k0 = temC ? Math.floor(rng() * ep.n) : -10;
    ep.celulas.forEach((_, k) => {
      if (temC && (k === k0 || k === (k0 + 1) % ep.n)) return;
      if (rng() > 0.92) return;
      const m = ep.meio(k, 0.48);
      // nos cantos mais fechados as células convergem: núcleo que encostaria no vizinho fica fora do plano de corte
      if (!occN.livre(m.x, m.y, 3.1, 0.5)) return;
      occN.marcar(m.x, m.y, 3.1);
      nucleos.push(h < 8 ? elipse(m.x, m.y, 3.3, 2, m.ang + 90) : circulo(m.x, m.y, 2.9));
    });
    coloide.push(contorno(ep.topo));
    contornos.push(contorno(pol.filter((_, k) => k % 2 === 0)));
    if (temC) {
      // célula C: base do epitélio, entre os tirócitos e a lâmina basal, sem alcançar o coloide
      const b = ep.base[(k0 + 1) % ep.n];
      const cx = b.x + b.nx * 4;
      const cy = b.y + b.ny * 4;
      cCel.push(elipse(cx, cy, 8.6, 5.3, graus(b.nx, b.ny) + 90));
      cNuc.push(circulo(cx + b.nx * 0.4, cy + b.ny * 0.4, 3.2));
      occN.marcar(cx, cy, 8.6);
    }
    if (h >= 9 && rng() < 0.5) {
      // vacúolos de reabsorção na periferia do coloide (folículo ativo)
      const nv = Math.floor(entre(rng, 2, 6));
      for (let q = 0; q < nv; q++) {
        const k = Math.floor(rng() * ep.n);
        const t = ep.topo[k];
        const b = ep.base[k];
        const rv = entre(rng, 2, 3.4);
        vacuolos.push(circulo(t[0] + b.nx * rv * 0.6, t[1] + b.ny * rv * 0.6, rv));
      }
    }
  });

  // capilares: no conjuntivo delgado entre folículos (rede capilar rica) e nas junções
  const capilares: string[] = [];
  const hemCap: string[] = [];
  const nucCap: string[] = [];
  const brutas = sem.map((_, i) => celulaPotencia(sitios[i], sitios, sitios[i].w * 1.7, 0));
  const occC = ocupacao(30, 12);
  const visto = new Set<string>();
  brutas.forEach((pol) =>
    pol.forEach((a, k) => {
      const b = pol[(k + 1) % pol.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const chave = `${Math.round(mx / 3)},${Math.round(my / 3)}`;
      if (L < 22 || visto.has(chave) || mx < -10 || mx > W + 10 || my < -10 || my > H + 10) return;
      visto.add(chave);
      if (distLinha(mx, my, septo, false) < HS + 12 || rng() > 0.6) return;
      const rx = Math.min(L / 2 - 6, 10);
      // o capilar fica no conjuntivo entre dois folículos; contra os núcleos basta testar a sua meia-largura
      if (!occC.livre(mx, my, rx, 3) || !occN.livre(mx, my, 4.4, 0.5)) return;
      occC.marcar(mx, my, rx);
      const ang = graus(b[0] - a[0], b[1] - a[1]);
      capilares.push(elipse(mx, my, rx, 4.4, ang));
      hemCap.push(hemacia(mx, my, Math.min(3.8, rx - 1), ang + entre(rng, -15, 15), 2.6));
      if (rng() < 0.3) nucCap.push(elipse(mx + ((b[0] - a[0]) / L) * (rx - 3), my + ((b[1] - a[1]) / L) * (rx - 3), 2.4, 0.9, ang));
    }),
  );

  // septo: conjuntivo denso com fibroblastos, uma arteríola e uma vênula
  const fib: string[] = [];
  const amS = amostrar(septo, 120, false);
  for (let k = 0; k < 60 && fib.length < 40; k++) {
    const p = amS[Math.floor(rng() * amS.length)];
    const o = entre(rng, -HS + 3, HS - 3);
    if (!occN.livre(p.x + p.nx * o, p.y + p.ny * o, 5.5, 0.5)) continue;
    occN.marcar(p.x + p.nx * o, p.y + p.ny * o, 5.5);
    fib.push(elipse(p.x + p.nx * o, p.y + p.ny * o, 5.5, 1.3, graus(p.tx, p.ty) + entre(rng, -10, 10)));
  }
  const fibras = [-9, -3, 4, 10].map((o) => contorno(amS.map((p): P => [p.x + p.nx * o, p.y + p.ny * o]), false)).join('');
  const vasos: [number, number, number][] = [[330, 576, 11], [600, 566, 8]];

  return (
    <>
      <E id="septo-conjuntivo">
        <rect x={-20} y={-20} width={W + 40} height={H + 40} fill={cor.estroma} />
        <path d={estromaIlha.join('')} fill={cor.estroma} />
        <path d={contorno(septo, false)} stroke={cor.septo} strokeWidth={2 * HS} strokeLinecap="round" fill="none" />
        <path d={fibras} stroke={cor.fibra} strokeWidth={1.2} fill="none" />
        <path d={fib.join('')} fill={HE.nucleo} />
        <path d={vasos.map(([x, y, r]) => circulo(x, y, r)).join('')} fill={HE.luz} stroke={HE.musculo} strokeWidth={3} />
        <path d={vasos.map(([x, y, r]) => hemacia(x - r * 0.25, y, 3.8, 30) + hemacia(x + r * 0.3, y + 1.5, 3.8, -20)).join('')} fill={HE.hemacia} />
      </E>
      <E id="foliculo-tireoidiano">
        {/* o folículo como unidade: toque na borda (lâmina basal, faixa de ~4 un por fora); tirócitos, coloide, células C
            e capilares, desenhados por cima, são estruturas próprias */}
        <path d={contornos.join('')} fill="none" stroke="transparent" strokeWidth={8} />
      </E>
      <E id="capilar">
        <path d={capilares.join('')} fill="#fbe9f1" stroke="#c96b98" strokeWidth={0.8} />
        <path d={hemCap.join('')} fill={HE.hemacia} />
        <path d={nucCap.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="tirocito">
        <path d={celulas.join('')} fill={cor.tirocito} stroke={cor.borda} strokeWidth={0.6} />
        <path d={nucleos.join('')} fill={HE.nucleo} />
      </E>
      <Deco>
        <path d={contornos.join('')} fill="none" stroke="#c0628f" strokeWidth={1.3} />
      </Deco>
      <E id="coloide">
        <path d={coloide.join('')} fill={cor.coloide} />
        <path d={vacuolos.join('')} fill={cor.vacuolo} />
      </E>
      <E id="celulas-parafoliculares">
        <path d={cCel.join('')} fill={cor.celulaC} stroke={cor.bordaC} strokeWidth={0.8} />
        <path d={cNuc.join('')} fill={cor.nucC} />
      </E>
    </>
  );
}

// =============================================================================================
// 4. ADRENAL — escala 1 un ≈ 1 µm nas células (espongiócito ≈ 20 µm); as espessuras das zonas estão comprimidas para
// caberem todas no campo (na glândula real a fasciculada é bem mais espessa que as outras).
export const PARTES_ADRENAL = ['capsula', 'zona-glomerulosa', 'zona-fasciculada', 'zona-reticular', 'medula-suprarrenal', 'celula-cromafim', 'capilar', 'veia-central'];

/** Adrenal: cápsula, zonas glomerulosa, fasciculada e reticular do córtex, e medula com células cromafins. */
export function LaminaAdrenal(rng: Rng) {
  const cor = { capsula: '#e9a2c2', sinusoide: '#fbeaf1', zg: '#e7a0c0', zgBorda: '#cf7ea5', zf: '#f6dce7', zfBorda: '#d79bb8', zr: '#dd85ab', zrBorda: '#c46b95', lipofuscina: '#8a5a32', med: '#c9b5dc', medBorda: '#a68cc4', medNuc: '#5b4b9c', espuma: '#fdf6f9' };
  const yG = (x: number) => 24 + 3 * Math.sin(x / 50); // cápsula → glomerulosa
  const yR = (x: number) => 420 + 10 * Math.sin(x / 80 + 2); // fasciculada → reticular
  const yM = (x: number) => 542 + 10 * Math.sin(x / 45) + 6 * Math.sin(x / 17 + 1); // reticular → medula
  const faixaY = (f0: (x: number) => number, f1: (x: number) => number) => {
    const xs = Array.from({ length: 53 }, (_, k) => -20 + k * 20);
    return contorno([...xs.map((x): P => [x, f0(x)]), ...[...xs].reverse().map((x): P => [x, f1(x)])]);
  };
  const hemacias: string[] = [];
  const endotelio: string[] = [];

  // zona glomerulosa: grupos ovoides compactos ("arcos"/"glomérulos") de células colunares baixas, núcleos escuros e
  // citoplasma mais acidófilo; os grupos são maciços (sem luz), separados por capilares
  const occNuc = ocupacao(20, 8);
  const zgCel: string[] = [];
  const zgNuc: string[] = [];
  for (let x = 6; x < W + 40; x += entre(rng, 62, 68)) {
    const a = entre(rng, 28, 31);
    const b = 33.5;
    const cy = 59.5;
    const ctr = pontosPolar(x, cy, (t) => (a * b) / Math.hypot(b * Math.cos(t), a * Math.sin(t)), 48);
    const sem: Sitio[] = [{ x, y: cy, w: 0 }];
    for (const [fr, n] of [[0.78, 15], [0.44, 7]] as [number, number][]) {
      const g = entre(rng, 0, 1);
      for (let k = 0; k < n; k++) {
        const t = g + (2 * Math.PI * k) / n;
        sem.push({ x: x + Math.cos(t) * a * fr, y: cy + Math.sin(t) * b * fr, w: 0 });
      }
    }
    celulasDe(sem, 16, 0.4).forEach((pol0, i) => {
      let pol = pol0;
      for (let k = 0; k < ctr.length; k++) {
        const p0 = ctr[k];
        const p1 = ctr[(k + 1) % ctr.length];
        const nx = p1[1] - p0[1];
        const ny = -(p1[0] - p0[0]);
        const nl = Math.hypot(nx, ny);
        // corta pelo contorno do grupo (normal para fora)
        const sx = (nx / nl) * ((x - p0[0]) * nx + (cy - p0[1]) * ny > 0 ? -1 : 1);
        const sy = (ny / nl) * ((x - p0[0]) * nx + (cy - p0[1]) * ny > 0 ? -1 : 1);
        pol = cortar(pol, sx, sy, p0[0], p0[1]);
        if (pol.length < 3) return;
      }
      zgCel.push(contorno(pol));
      const c = centroidePol(pol);
      const q = sem[i];
      // núcleo um pouco deslocado para a base (periferia do grupo), como nas células colunares
      const dx = q.x - x;
      const dy = q.y - cy;
      const dl = Math.hypot(dx, dy) || 1;
      const px = c[0] + (i ? (dx / dl) * 2 : 0);
      const py = c[1] + (i ? (dy / dl) * 2 : 0);
      if (!occNuc.livre(px, py, 2.9, 0.4)) return;
      occNuc.marcar(px, py, 2.9);
      zgNuc.push(circulo(px, py, 2.9));
    });
  }

  // zona fasciculada: cordões retos, de 1–2 células, perpendiculares à cápsula, separados por capilares sinusoides;
  // espongiócitos grandes, com citoplasma vacuolizado (lipídios extraídos) e núcleo central (às vezes dois)
  const zfCel: string[] = [];
  const zfNuc: string[] = [];
  const passoC = 41;
  const noSinusoide: [number, number, number][] = [];
  // ondulação quase paralela entre cordões vizinhos (fases próximas): os cordões não se cruzam
  const fase0 = entre(rng, 0, 6);
  for (let k = -1, x0 = 4; x0 < W + 40; k++, x0 += passoC) {
    const fase = fase0 + 0.12 * k;
    const xc = (y: number) => x0 + 5 * Math.sin(y / 70 + fase);
    const sem: Sitio[] = [];
    for (let y = 95; y < 432; y += entre(rng, 18, 21)) {
      if (rng() < 0.18) sem.push({ x: xc(y) + entre(rng, -2, 2), y, w: 0 }); // trecho de uma só célula
      else for (const d of [-9.2, 9.2]) sem.push({ x: xc(y) + d + entre(rng, -1.2, 1.2), y: y + entre(rng, -2, 2), w: 0 });
    }
    celulasDe(sem, 17, 0.5).forEach((pol0, i) => {
      const q = sem[i];
      let pol = cortar(pol0, 1, 0, xc(q.y) + 17.5, 0);
      pol = cortar(pol, -1, 0, xc(q.y) - 17.5, 0);
      pol = cortar(pol, 0, -1, 0, 93.5);
      pol = cortar(pol, 0, 1, 0, yR(q.x) - 1);
      if (pol.length < 3) return;
      zfCel.push(contorno(pol));
      const c = centroidePol(pol);
      if (Math.abs(pol.reduce((acc, p, j) => acc + p[0] * pol[(j + 1) % pol.length][1] - pol[(j + 1) % pol.length][0] * p[1], 0)) < 160) return; // fragmento: núcleo fora do plano
      if (rng() < 0.08 && occNuc.livre(c[0], c[1], 7.8, 0.5)) {
        occNuc.marcar(c[0], c[1], 7.8);
        zfNuc.push(circulo(c[0] - 4.2, c[1], 3.4), circulo(c[0] + 4.2, c[1], 3.4));
      } else if (occNuc.livre(c[0], c[1], 3.8, 0.5)) {
        occNuc.marcar(c[0], c[1], 3.8);
        zfNuc.push(circulo(c[0], c[1], 3.8));
      }
    });
    // hemácias e núcleos endoteliais no sinusoide à direita do cordão (postos depois de todos os cordões)
    for (let y = 100 + entre(rng, 0, 25); y < yR(x0) - 6; y += entre(rng, 22, 40)) noSinusoide.push([xc(y) + passoC / 2, y, rng() < 0.75 ? 1 : 0]);
  }
  for (const [x, y, hem] of noSinusoide) {
    if (!occNuc.livre(x, y, 3.8, 0.4)) continue;
    occNuc.marcar(x, y, 3.8);
    if (hem) hemacias.push(hemacia(x, y, 3.6, 90 + entre(rng, -10, 10), 1.9));
    else endotelio.push(elipse(x, y, 4, 1.1, 90));
  }

  // zona reticular: rede de cordões anastomosados de células menores e mais acidófilas, algumas com lipofuscina
  const zrCel: string[] = [];
  const zrNuc: string[] = [];
  const lipof: string[] = [];
  // medula: grupos e cordões de células cromafins (citoplasma basófilo, granuloso), sinusoides e a veia central
  const veia = { x: 560, y: 660, rx: 150, ry: 26 };
  const naVeia = (x: number, y: number, m: number) => ((x - veia.x) / (veia.rx + m)) ** 2 + ((y - veia.y) / (veia.ry + m)) ** 2 < 1;
  const medCel: string[] = [];
  const medNuc: string[] = [];
  // reticular e medula num só diagrama de potência: a fronteira entre as zonas é a borda comum das células.
  // Os furos da rede (sinusoides) entram como sítios fixos com peso; as células, relaxadas, ficam poligonais e
  // encostadas umas nas outras, contornando os sinusoides.
  const occR = ocupacao(40, 21);
  const furosR = dardos(rng, 800, [-20, 400, W + 20, 570], () => 21, (x, y) => y > yR(x) + 8 && y < yM(x) - 4, occR, 0);
  const furosM = dardos(rng, 800, [-20, 540, W + 20, H + 20], () => 16, (x, y) => y > yM(x) + 14 && !naVeia(x, y, 16), occR, 22);
  for (const [x, y] of furosR) hemacias.push(hemacia(x + entre(rng, -2, 2), y + entre(rng, -2, 2), 3.6, entre(rng, 0, 180), 2.2));
  const hemMedula = furosM.map(([x, y]) => hemacia(x, y, 3.6, entre(rng, 0, 180), 2.4)).join('');
  const occC = ocupacao(24, 9);
  const semR0 = dardos(rng, 6000, [-20, 400, W + 20, 580], () => 6.4, (x, y) => y > yR(x) + 1 && y < yM(x) + 2 && furosR.every(([fx, fy]) => Math.hypot(fx - x, fy - y) > 10.5), occC, 0);
  const semM0 = dardos(rng, 6000, [-20, 530, W + 20, H + 20], () => 8.4, (x, y) => y > yM(x) && !naVeia(x, y, 8) && furosM.every(([fx, fy]) => Math.hypot(fx - x, fy - y) > 15), occC, 0);
  const sitRM: Sitio[] = [
    ...semR0.map(([x, y]) => ({ x, y, w: 0 })),
    ...semM0.map(([x, y]) => ({ x, y, w: 5 })),
    ...furosR.map(([x, y]) => ({ x, y, w: 10 })),
    ...furosM.map(([x, y]) => ({ x, y, w: 14 })),
    ...Array.from({ length: 13 }, (_, k): Sitio => ({ x: veia.x - veia.rx + (k * 2 * veia.rx) / 12, y: veia.y, w: 0 })),
  ];
  const nMov = semR0.length + semM0.length;
  relaxarRapido(sitRM, nMov, 20, 48, 2);
  // rMax folgado: no topo da reticular a célula passa do limite e é cortada reta por ele (sem "bolas" na fronteira)
  celulasDe(sitRM, 18, 0.5, 48)
    .slice(0, nMov)
    .forEach((pol0, i) => {
      const q = sitRM[i];
      if (i < semR0.length) {
        const pol = cortar(pol0, 0, -1, 0, yR(q.x) - 1);
        if (pol.length < 3) return;
        zrCel.push(contorno(pol));
        const c = centroidePol(pol);
        const r = rng() < 0.12 ? 2.2 : 3.1; // alguns núcleos picnóticos (menores e escuros)
        if (!occNuc.livre(c[0], c[1], r, 0.5)) return;
        occNuc.marcar(c[0], c[1], r);
        zrNuc.push(circulo(c[0], c[1], r));
        if (rng() < 0.3)
          for (let g = 0; g < 4; g++) {
            const a = entre(rng, 0, Math.PI * 2);
            lipof.push(circulo(c[0] + Math.cos(a) * 5.2, c[1] + Math.sin(a) * 5.2, 0.8));
          }
        return;
      }
      if (pol0.length < 3 || pol0.some(([x, y]) => naVeia(x, y, 3))) return;
      medCel.push(contorno(pol0));
      const c = centroidePol(pol0);
      if (!occNuc.livre(c[0], c[1], 4, 0.5)) return;
      occNuc.marcar(c[0], c[1], 4);
      medNuc.push(circulo(c[0] + entre(rng, -0.8, 0.8), c[1] + entre(rng, -0.8, 0.8), 4));
    });
  // veia central (medular): parede delgada com feixes excêntricos de músculo liso longitudinal
  const feixes: string[] = [];
  const nucFeixe: string[] = [];
  for (const [dx, l] of [[-90, 40], [-20, 34], [60, 46]]) {
    const x = veia.x + dx;
    const y = veia.y - veia.ry * Math.sqrt(Math.max(0, 1 - (dx / veia.rx) ** 2)) - 6;
    feixes.push(elipse(x, y, l / 2, 9, 0));
    for (let k = -1; k <= 1; k++) nucFeixe.push(elipse(x + k * l * 0.28, y + entre(rng, -3, 3), 4, 1.2, 0));
  }
  const nucVeia = Array.from({ length: 9 }, (_, k) => {
    const t = Math.PI * (0.1 + (0.8 * k) / 8);
    return elipse(veia.x + Math.cos(t) * (veia.rx - 2), veia.y - Math.sin(t) * (veia.ry - 1.5), 4, 1, graus(-Math.sin(t) * veia.rx, -Math.cos(t) * veia.ry));
  }).join('');

  // cápsula: conjuntivo denso, fibroblastos achatados
  const capNuc: string[] = [];
  for (let k = 0; k < 60 && capNuc.length < 26; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, 5, yG(x) - 5);
    if (!occNuc.livre(x, y, 6, 0.5)) continue;
    occNuc.marcar(x, y, 6);
    capNuc.push(elipse(x, y, 6, 1.4, entre(rng, -5, 5)));
  }

  return (
    <>
      <defs>
        {/* citoplasma espumoso dos espongiócitos (gotículas de lipídio extraídas pelo processamento) */}
        <pattern id="adrenal-espuma" width={23} height={19} patternUnits="userSpaceOnUse">
          <rect width={23} height={19} fill={cor.zf} />
          {[[3, 3, 1.6], [9, 2, 1.2], [15, 4, 2], [21, 2, 1.1], [6, 8, 2.1], [12, 9, 1.4], [18, 10, 1.8], [2, 13, 1.3], [9, 15, 1.9], [15, 15, 1.2], [20, 16, 1.6], [13, 1, 0.9]].map(([x, y, r], k) => (
            <circle key={k} cx={x} cy={y} r={r} fill={cor.espuma} />
          ))}
        </pattern>
      </defs>
      <E id="capilar">
        <rect x={-20} y={-20} width={W + 40} height={H + 40} fill={cor.sinusoide} />
        <path d={hemacias.join('')} fill={HE.hemacia} />
        <path d={endotelio.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="capsula">
        <path d={faixaY(() => -20, yG)} fill={cor.capsula} />
        <path d={capNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="zona-glomerulosa">
        <path d={zgCel.join('')} fill={cor.zg} stroke={cor.zgBorda} strokeWidth={0.6} />
        <path d={zgNuc.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="zona-fasciculada">
        <path d={zfCel.join('')} fill="url(#adrenal-espuma)" stroke={cor.zfBorda} strokeWidth={0.8} />
        <path d={zfNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="zona-reticular">
        <path d={zrCel.join('')} fill={cor.zr} stroke={cor.zrBorda} strokeWidth={0.6} />
        <path d={lipof.join('')} fill={cor.lipofuscina} />
        <path d={zrNuc.join('')} fill={HE.nucleoEscuro} />
      </E>
      {/* medula: o toque entre os grupos de células cromafins (sinusoides, vênulas, conjuntivo) identifica a medula */}
      <E id="medula-suprarrenal">
        <path d={faixaY(yM, () => H + 20)} fill={cor.sinusoide} />
        <path d={hemMedula} fill={HE.hemacia} />
      </E>
      <E id="celula-cromafim">
        <path d={medCel.join('')} fill={cor.med} stroke={cor.medBorda} strokeWidth={0.7} />
        <path d={medNuc.join('')} fill={cor.medNuc} />
      </E>
      <E id="veia-central">
        <path d={elipse(veia.x, veia.y, veia.rx + 3, veia.ry + 3)} fill="#e7a7c4" />
        <path d={feixes.join('')} fill={HE.musculo} />
        <path d={nucFeixe.join('')} fill={HE.nucleo} />
        <path d={elipse(veia.x, veia.y, veia.rx, veia.ry)} fill={HE.luz} />
        <path d={nucVeia} fill={HE.nucleoEscuro} />
        <path d={Array.from({ length: 7 }, (_, k) => hemacia(veia.x - 100 + k * 33 + entre(rng, -6, 6), veia.y + entre(rng, -8, 10), 3.7, entre(rng, 0, 180), 2.6)).join('')} fill={HE.hemacia} />
      </E>
    </>
  );
}

// =============================================================================================
// 5. TESTÍCULO — escala 1 un ≈ 0,8 µm: túbulo seminífero ≈ 190 µm; epitélio ≈ 60 µm; espermatócito ≈ 15 µm;
// espermátide redonda ≈ 8 µm; célula de Leydig ≈ 14 µm. A túnica albugínea real é mais espessa que a faixa do esquema.
export const PARTES_TESTICULO = ['tunica-albuginea', 'celula-mioide-peritubular', 'espermatogonia', 'espermatocito', 'espermatide', 'celula-de-sertoli', 'espermatozoide', 'celula-de-leydig', 'capilar'];

/** Testículo: túnica albugínea, túbulos seminíferos com epitélio germinativo e células de Sertoli, interstício com Leydig. */
export function LaminaTesticulo(rng: Rng) {
  const cor = { interst: '#f5dde8', albuginea: '#e8a2c1', fibra: '#dc8db2', propria: '#e6a3c1', sertoli: '#f0cfdd', luz: '#fbf4f7', cauda: '#d38db1', germ: '#f6e1ea', germBorda: '#d9a7c0', esperm: '#f2d2e0', espgClara: '#6c5db2', espcNuc: '#9284c8', sertNuc: '#9a8fd0', leydig: '#e488af', leydigBorda: '#c96d97' };
  const yA = (x: number) => 64 + 4 * Math.sin(x / 90);
  // túbulos em corte transversal (fileiras alternadas), com interstício triangular entre eles
  const tubulos: [number, number, number][] = [];
  for (const [y, xs] of [[205, [118, 378, 638, 898]], [456, [-12, 248, 508, 768, 1028]], [705, [118, 378, 638, 898]]] as [number, number[]][])
    for (const x of xs) tubulos.push([x + entre(rng, -10, 10), y + entre(rng, -8, 8), entre(rng, 106, 114)]);
  const LP = 7; // lâmina própria (túnica própria) com células mioides

  const propria: string[] = [];
  const mioides: string[] = [];
  const sertoliFundo: string[] = [];
  const sertoliNuc: string[] = [];
  const nucleolos: string[] = [];
  const luzes: string[] = [];
  const caudas: string[] = [];
  const gCel: string[] = [];
  const gNucEscuro: string[] = [];
  const gNucClaro: string[] = [];
  const cCel: string[] = [];
  const cNuc: string[] = [];
  const cCromatina: string[] = [];
  const eCel: string[] = [];
  const eNuc: string[] = [];
  const eAlong: string[] = [];
  tubulos.forEach(([x, y, R], ti) => {
    propria.push(circulo(x, y, R + LP) + circulo(x, y, R));
    const a0m = entre(rng, 0, 0.3);
    for (let a = a0m; a < a0m + 2 * Math.PI - 0.13; a += entre(rng, 0.2, 0.32)) {
      mioides.push(elipse(x + Math.cos(a) * (R + 3.6), y + Math.sin(a) * (R + 3.6), 6, 1.3, (a * 180) / Math.PI + 90));
    }
    sertoliFundo.push(circulo(x, y, R));
    const rl = R - 80;
    luzes.push(circulo(x, y, rl));
    const occ = ocupacao(16, 10);
    const radial = (a: number, r: number): P => [x + Math.cos(a) * r, y + Math.sin(a) * r];
    // núcleos de Sertoli: perto da base, claros, ovais/triangulares, com o eixo maior radial e nucléolo evidente
    const nS = Math.round(entre(rng, 9, 12));
    for (let k = 0; k < nS; k++) {
      const a = ((k + entre(rng, -0.25, 0.25)) * 2 * Math.PI) / nS;
      const [px, py] = radial(a, R - 12.5 + entre(rng, -1.5, 1.5));
      occ.marcar(px, py, 5.6);
      sertoliNuc.push(elipse(px, py, 5.6, 3.3, (a * 180) / Math.PI));
      nucleolos.push(circulo(px, py, 1.2));
    }
    // fileira de células: passo um pouco maior que o diâmetro, com leve variação de altura; a ocupação impede sobreposição
    const fileira = (r0: number, rc: number, dens: number, desenhar: (px: number, py: number, a: number) => void) => {
      for (let a = entre(rng, 0, 0.2); a < 2 * Math.PI; a += (2 * rc + 0.8) / r0) {
        if (rng() > dens) continue;
        const [px, py] = radial(a, r0 + entre(rng, -1.5, 1.5));
        if (!occ.livre(px, py, rc, 0.3)) continue;
        occ.marcar(px, py, rc);
        desenhar(px, py, a);
      }
    };
    // espermatogônias: sobre a lâmina basal; tipo A escuro (núcleo denso) e tipos A claro / B (núcleo mais claro)
    fileira(R - 7.2, 6.3, 1, (px, py, a) => {
      gCel.push(circulo(px, py, 6.3));
      (rng() < 0.4 ? gNucEscuro : gNucClaro).push(elipse(px, py, 4.3, 3.7, (a * 180) / Math.PI + 90));
    });
    // espermatócitos primários: as maiores células germinativas, núcleo com cromatina em filamentos (prófase I)
    const espermatocito = (px: number, py: number) => {
      cCel.push(circulo(px, py, 9.2));
      cNuc.push(circulo(px, py, 6.2));
      for (let f = 0; f < 5; f++) {
        const rt = entre(rng, 1.6, 4.8);
        const b0 = entre(rng, 0, Math.PI * 2);
        const b1 = b0 + entre(rng, 1, 2.2);
        cCromatina.push(`M${f1(px + Math.cos(b0) * rt)},${f1(py + Math.sin(b0) * rt)}A${f1(rt)},${f1(rt)} 0 0 1 ${f1(px + Math.cos(b1) * rt)},${f1(py + Math.sin(b1) * rt)}`);
      }
    };
    fileira(R - 23.5, 9.2, 1, espermatocito);
    fileira(R - 41.5, 9.2, 0.7, espermatocito);
    // espermátides redondas (duas fileiras) e, em parte dos túbulos (estágio do ciclo), espermátides alongadas junto à luz
    for (const rr of [R - 55.5, R - 66])
      fileira(rr, 5, 1, (px, py) => {
        eCel.push(circulo(px, py, 5));
        eNuc.push(circulo(px, py, 2.9));
      });
    // completa cada camada nos vãos que sobraram (o epitélio seminífero é compacto: quase não sobra citoplasma de Sertoli à vista)
    const completar = (r0: number, r1: number, rc: number, desenhar: (px: number, py: number, a: number) => void) => {
      for (let t = 0; t < 900; t++) {
        const a = entre(rng, 0, Math.PI * 2);
        const rr = entre(rng, r0 + rc, r1 - rc);
        const [px, py] = radial(a, rr);
        if (!occ.livre(px, py, rc, 0.3)) continue;
        occ.marcar(px, py, rc);
        desenhar(px, py, a);
      }
    };
    completar(R - 50, R - 15.5, 9.2, espermatocito);
    completar(R - 72, R - 50, 5, (px, py) => {
      eCel.push(circulo(px, py, 5));
      eNuc.push(circulo(px, py, 2.9));
    });
    completar(R - 16, R - 1, 6.3, (px, py, a) => {
      gCel.push(circulo(px, py, 6.3));
      (rng() < 0.4 ? gNucEscuro : gNucClaro).push(elipse(px, py, 4.3, 3.7, (a * 180) / Math.PI + 90));
    });
    const alongadas = ti % 5 !== 2 && rng() < 0.75;
    if (alongadas)
      for (let a = entre(rng, 0, 0.5); a < 2 * Math.PI; ) {
        // feixes de 5–7 cabeças (núcleo condensado, escuro e alongado) mergulhadas no ápice da célula de Sertoli
        const n = Math.floor(entre(rng, 5, 8));
        for (let k = 0; k < n; k++, a += 4.6 / (R - 75)) {
          const [px, py] = radial(a, R - 75.5);
          if (!occ.livre(px, py, 1.6, 0.2)) continue;
          occ.marcar(px, py, 1.6);
          eAlong.push(elipse(px, py, 3.2, 1.2, (a * 180) / Math.PI));
          const [tx, ty] = radial(a + entre(rng, -0.05, 0.05), rl - entre(rng, 4, 14));
          caudas.push(`M${f1(px - Math.cos(a) * 3)},${f1(py - Math.sin(a) * 3)}Q${f1((px + tx) / 2 + entre(rng, -3, 3))},${f1((py + ty) / 2 + entre(rng, -3, 3))} ${f1(tx)},${f1(ty)}`);
        }
        a += entre(rng, 0.25, 0.5);
      }
    // flagelos de espermatozoides já liberados na luz
    for (let k = 0; k < (alongadas ? 10 : 22); k++) {
      const a = entre(rng, 0, Math.PI * 2);
      const r0 = Math.sqrt(rng()) * (rl - 6);
      const [x0, y0] = [x + Math.cos(a) * r0, y + Math.sin(a) * r0];
      const b = entre(rng, 0, Math.PI * 2);
      const l = entre(rng, 10, 20);
      const [x1, y1] = [x0 + Math.cos(b) * l, y0 + Math.sin(b) * l];
      if (Math.hypot(x1 - x, y1 - y) > rl - 3) continue;
      caudas.push(`M${f1(x0)},${f1(y0)}q${f1(Math.cos(b + 1) * 4)},${f1(Math.sin(b + 1) * 4)} ${f1(x1 - x0)},${f1(y1 - y0)}`);
    }
  });

  // interstício: grupos de células de Leydig (poligonais, eosinófilas, núcleo redondo) junto a capilares
  const folgaT = (x: number, y: number) => Math.min(y - yA(x) - 4, ...tubulos.map(([tx, ty, R]) => Math.hypot(x - tx, y - ty) - R - LP));
  const occL = ocupacao(20, 9);
  const vasos: [number, number, number][] = [];
  for (let y = 70; y < H + 10; y += 6)
    for (let x = -10; x < W + 10; x += 6) {
      const c = folgaT(x, y);
      if (c < 20 || !occL.livre(x, y, 8, 52)) continue;
      occL.marcar(x, y, 8);
      vasos.push([x, y, Math.min(9, c - 9)]);
    }
  const semL = dardos(rng, 9000, [-20, 60, W + 20, H + 20], () => 8.6, (x, y) => folgaT(x, y) > 9 && vasos.some(([vx, vy]) => Math.hypot(vx - x, vy - y) < 40), occL, 0);
  const sitL: Sitio[] = [...semL.map(([x, y]) => ({ x, y, w: 0 })), ...vasos.map(([x, y, r]) => ({ x, y, w: r + 3 }))];
  const leyCel: string[] = [];
  const leyNuc: string[] = [];
  const leyVac: string[] = [];
  celulasDe(sitL, 10.5, 0.5, 30)
    .slice(0, semL.length)
    .forEach((pol, i) => {
      if (pol.length < 3) return;
      leyCel.push(contorno(pol));
      const q = sitL[i];
      const a = entre(rng, 0, Math.PI * 2);
      leyNuc.push(circulo(q.x + Math.cos(a) * 1.4, q.y + Math.sin(a) * 1.4, 3.5));
      for (let k = 0; k < 3; k++) {
        const b = a + Math.PI + entre(rng, -0.9, 0.9);
        leyVac.push(circulo(q.x + Math.cos(b) * 5.6, q.y + Math.sin(b) * 5.6, entre(rng, 0.8, 1.3)));
      }
    });
  const hemV = vasos.map(([x, y, r]) => hemacia(x, y, Math.min(4.6, r - 1.5), entre(rng, 0, 180), Math.min(3.2, r - 2.5))).join('');
  const nucVaso = vasos.filter(() => rng() < 0.5).map(([x, y, r]) => elipse(x, y - r + 1, Math.min(3.5, r * 0.5), 1, 0)).join('');
  // túnica vascular: vasos sob a albugínea
  const vascular: [number, number, number][] = [[260, 80, 9], [520, 84, 11], [770, 79, 8]];
  const fibAlb: string[] = [];
  const occA = ocupacao(20, 8);
  for (let k = 0; k < 80 && fibAlb.length < 30; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, 6, yA(x) - 6);
    if (!occA.livre(x, y, 7, 1)) continue;
    occA.marcar(x, y, 7);
    fibAlb.push(elipse(x, y, 7, 1.4, entre(rng, -4, 4)));
  }
  const fibrasAlb = Array.from({ length: 6 }, (_, k) => {
    const yy = 8 + k * 9.5;
    return `M-20,${yy}C300,${yy + entre(rng, -4, 4)} 700,${yy + entre(rng, -4, 4)} ${W + 20},${yy}`;
  }).join('');

  return (
    <>
      <rect x={-20} y={-20} width={W + 40} height={H + 40} fill={cor.interst} />
      <E id="tunica-albuginea">
        <path d={contorno([[-20, -20], [W + 20, -20], ...Array.from({ length: 53 }, (_, k): P => [W + 20 - k * 20, yA(W + 20 - k * 20)])])} fill={cor.albuginea} />
        <path d={fibrasAlb} stroke={cor.fibra} strokeWidth={1.2} fill="none" />
        <path d={fibAlb.join('')} fill={HE.nucleo} />
      </E>
      <E id="capilar">
        <path d={[...vasos, ...vascular].map(([x, y, r]) => circulo(x, y, r)).join('')} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1.6} />
        <path d={hemV + vascular.map(([x, y, r]) => hemacia(x - r * 0.3, y, 4.4, 20, 3.2) + hemacia(x + r * 0.35, y + 1, 4.4, -30, 3.2)).join('')} fill={HE.hemacia} />
        <path d={nucVaso} fill={HE.nucleoEscuro} />
      </E>
      <E id="celula-de-leydig">
        <path d={leyCel.join('')} fill={cor.leydig} stroke={cor.leydigBorda} strokeWidth={0.7} />
        <path d={leyVac.join('')} fill="#f8e3ec" />
        <path d={leyNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="celula-mioide-peritubular">
        <path d={propria.join('')} fill={cor.propria} fillRule="evenodd" />
        <path d={mioides.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="celula-de-sertoli">
        <path d={sertoliFundo.join('')} fill={cor.sertoli} />
      </E>
      <E id="espermatozoide">
        <path d={luzes.join('')} fill={cor.luz} />
        <path d={caudas.join('')} stroke={cor.cauda} strokeWidth={0.8} fill="none" />
      </E>
      <E id="espermatogonia">
        <path d={gCel.join('')} fill={cor.germ} stroke={cor.germBorda} strokeWidth={0.6} />
        <path d={gNucEscuro.join('')} fill={HE.nucleoEscuro} />
        <path d={gNucClaro.join('')} fill={cor.espgClara} />
      </E>
      <E id="espermatocito">
        <path d={cCel.join('')} fill={cor.germ} stroke={cor.germBorda} strokeWidth={0.6} />
        <path d={cNuc.join('')} fill={cor.espcNuc} />
        <path d={cCromatina.join('')} stroke={HE.nucleoEscuro} strokeWidth={1.2} strokeLinecap="round" fill="none" />
      </E>
      <E id="espermatide">
        <path d={eCel.join('')} fill={cor.esperm} stroke={cor.germBorda} strokeWidth={0.5} />
        <path d={eNuc.join('')} fill="#5d4d9e" />
        <path d={eAlong.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="celula-de-sertoli">
        <path d={sertoliNuc.join('')} fill={cor.sertNuc} />
        <path d={nucleolos.join('')} fill={HE.nucleoEscuro} />
      </E>
    </>
  );
}

// =============================================================================================
// 6. OVÁRIO — escala 1 un ≈ 1 µm: folículo primordial ≈ 35 µm (oócito ≈ 27 µm); primário unilaminar ≈ 65 µm;
// folículo secundário (antral) ≈ 400 µm, com ovócito de ≈ 104 µm e zona pelúcida de ≈ 7 µm.
export const PARTES_OVARIO = ['epitelio-superficial-do-ovario', 'tunica-albuginea', 'foliculo-primordial', 'foliculo-primario', 'foliculo-secundario', 'ovocito-primario', 'zona-pelucida', 'celulas-da-granulosa', 'teca-interna'];

/** Córtex do ovário: epitélio superficial, túnica albugínea, folículos primordiais, primários e um folículo secundário. */
export function LaminaOvario(rng: Rng) {
  const cor = { estroma: '#eebfd3', albuginea: '#e8adc7', fibra: '#dc94b6', epitelio: '#eeb6ce', epBorda: '#d488ad', ooplasma: '#f2c9db', vesicula: '#ece2f3', zona: '#f08fbd', granulosa: '#e7b3cc', liquor: '#f6dbe7', tecaI: '#f1d0de', tecaE: '#e4aac4', folicular: '#efc3d6', mb: '#cf6f9b' };
  const ySup = (x: number) => 20 + 4 * Math.sin(x / 120);
  const yAlb = (x: number) => 74 + 5 * Math.sin(x / 100 + 1);
  const F: P = [662, 446]; // folículo secundário
  const R = { te: 196, ti: 178, g: 156, a: 116 };
  const angC = (140 * Math.PI) / 180;
  const O: P = [F[0] + Math.cos(angC) * 80, F[1] + Math.sin(angC) * 80]; // ovócito sobre o cúmulo oóforo
  const RO = 52;
  const RZ = 59;
  const RCum = 75;
  const M: P = [212, 452]; // primário multilaminar (pré-antral)
  const unilam: P[] = [[150, 236], [372, 196], [918, 170], [430, 636], [96, 640]];
  const occ = ocupacao(40, 210);
  occ.marcar(F[0], F[1], R.te);
  occ.marcar(M[0], M[1], 72);
  unilam.forEach(([x, y]) => occ.marcar(x, y, 34));
  const primordiais = dardos(rng, 4000, [0, 92, W, 150], () => 16.5, (x, y) => y > yAlb(x) + 20, occ, 14);
  primordiais.push(...dardos(rng, 600, [0, 150, W, H], () => 16.5, () => rng() < 0.4, occ, 30).slice(0, 5));

  // epitélio superficial (simples cúbico) e túnica albugínea
  const epCel: string[] = [];
  const epNuc: string[] = [];
  for (let x = -10; x < W + 10; x += 9) {
    const q: P[] = [[x, ySup(x)], [x + 9, ySup(x + 9)], [x + 9, ySup(x + 9) + 9], [x, ySup(x) + 9]];
    epCel.push(contorno(q));
    epNuc.push(circulo(x + 4.5, ySup(x + 4.5) + 4.6, 2.7));
  }
  const albFib = Array.from({ length: 5 }, (_, k) => contorno(Array.from({ length: 27 }, (_, i): P => [-20 + i * 40, ySup(-20 + i * 40) + 17 + k * 11 + 1.5 * Math.sin(i * 0.9 + k)]), false)).join('');
  const albNuc: string[] = [];
  const occN = ocupacao(20, 7);
  for (let t = 0; t < 400 && albNuc.length < 45; t++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, ySup(x) + 14, yAlb(x) - 3);
    if (!occN.livre(x, y, 6, 1)) continue;
    occN.marcar(x, y, 6);
    albNuc.push(elipse(x, y, 6, 1.4, entre(rng, -6, 6)));
  }

  // estroma cortical: muito celular, células fusiformes em redemoinhos (sem área de toque: não é estrutura do jogo)
  const dentroFol = (x: number, y: number, m: number) =>
    Math.hypot(x - F[0], y - F[1]) < R.te + m || Math.hypot(x - M[0], y - M[1]) < 70 + m || unilam.some(([ux, uy]) => Math.hypot(x - ux, y - uy) < 32 + m) || primordiais.some(([px, py]) => Math.hypot(x - px, y - py) < 16.5 + m);
  const estNuc: string[] = [];
  dardos(rng, 9000, [-10, 60, W + 10, H + 10], () => 5.8, (x, y) => y > yAlb(x) + 4 && !dentroFol(x, y, 4), occN, 1).forEach(([x, y]) => {
    const ang = 50 * Math.sin(x / 90) + 40 * Math.cos(y / 70) + entre(rng, -18, 18);
    estNuc.push(elipse(x, y, 5.4, 1.4, ang));
  });

  // folículos primordiais: oócito com núcleo excêntrico e nucléolo, envolto por uma camada de células foliculares achatadas
  const pCel: string[] = [];
  const pNucF: string[] = [];
  const pOo: string[] = [];
  const pVes: string[] = [];
  const pNucleolo: string[] = [];
  for (const [x, y] of primordiais) {
    pCel.push(circulo(x, y, 16.5));
    pOo.push(circulo(x, y, 13.4));
    const a = entre(rng, 0, Math.PI * 2);
    pVes.push(circulo(x + Math.cos(a) * 3.5, y + Math.sin(a) * 3.5, 5.4));
    pNucleolo.push(circulo(x + Math.cos(a) * 4.5, y + Math.sin(a) * 4.5, 1.3));
    const n = Math.floor(entre(rng, 4, 7));
    const g = entre(rng, 0, 1);
    for (let k = 0; k < n; k++) {
      const b = g + (2 * Math.PI * k) / n;
      pNucF.push(elipse(x + Math.cos(b) * 15, y + Math.sin(b) * 15, 5, 1.5, (b * 180) / Math.PI + 90));
    }
  }
  // folículos primários unilaminares: oócito maior, zona pelúcida delgada e uma camada de células da granulosa cúbicas
  const uCel: string[] = [];
  const uNuc: string[] = [];
  const uOo: string[] = [];
  const uZona: string[] = [];
  const uVes: string[] = [];
  const uNucleolo: string[] = [];
  for (const [x, y] of unilam) {
    const ep = epitelio(pontosCirculo(x, y, 32, 72), 8.4, () => 9, 1);
    ep.celulas.forEach((c, k) => {
      uCel.push(contorno(c));
      const m = ep.meio(k, 0.5);
      uNuc.push(circulo(m.x, m.y, 2.8));
    });
    uZona.push(circulo(x, y, 23));
    uOo.push(circulo(x, y, 21));
    const a = entre(rng, 0, Math.PI * 2);
    uVes.push(circulo(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 7.5));
    uNucleolo.push(circulo(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 1.8));
  }
  // folículo primário multilaminar (pré-antral): granulosa estratificada, zona pelúcida evidente, teca começando a se formar
  const mNuc: string[] = [];
  const mTeca: string[] = [];
  const occM = ocupacao(12, 4);
  dardos(rng, 6000, [M[0] - 60, M[1] - 60, M[0] + 60, M[1] + 60], () => 2.9, (x, y) => {
    const d = Math.hypot(x - M[0], y - M[1]);
    return d > 37 && d < 57;
  }, occM, 1.7).forEach(([x, y]) => mNuc.push(circulo(x, y, 2.9)));
  for (let a = 0; a < 2 * Math.PI - 0.2; a += entre(rng, 0.18, 0.26)) mTeca.push(elipse(M[0] + Math.cos(a) * 65, M[1] + Math.sin(a) * 65, 5.2, 1.4, (a * 180) / Math.PI + 90));

  // folículo secundário (antral)
  const gNuc: string[] = [];
  const occG = ocupacao(12, 4);
  const noCumulo = (x: number, y: number) => Math.hypot(x - O[0], y - O[1]) < RCum - 2;
  dardos(rng, 30000, [F[0] - R.g, F[1] - R.g, F[0] + R.g, F[1] + R.g], () => 2.9, (x, y) => {
    const d = Math.hypot(x - F[0], y - F[1]);
    const dO = Math.hypot(x - O[0], y - O[1]);
    return d < R.g - 3 && dO > RZ + 11 && (d > R.a + 2 || noCumulo(x, y));
  }, occG, 1.7).forEach(([x, y]) => gNuc.push(circulo(x, y, 2.9)));
  // corona radiata: primeira camada de células da granulosa, radiada em torno da zona pelúcida
  const nCor = Math.floor((2 * Math.PI * (RZ + 4.6)) / 8.2);
  for (let k = 0, a = 0; k < nCor; k++, a = (2 * Math.PI * k) / nCor) gNuc.push(elipse(O[0] + Math.cos(a) * (RZ + 4.6), O[1] + Math.sin(a) * (RZ + 4.6), 3.4, 1.9, (a * 180) / Math.PI));
  const tiNuc: string[] = [];
  const tiCap: string[] = [];
  const tiHem: string[] = [];
  const occT = ocupacao(14, 6);
  for (let k = 0; k < 16; k++) {
    const a = ((k + entre(rng, -0.3, 0.3)) * 2 * Math.PI) / 16;
    const r = (R.g + R.ti) / 2;
    const [x, y] = [F[0] + Math.cos(a) * r, F[1] + Math.sin(a) * r];
    occT.marcar(x, y, 5);
    tiCap.push(elipse(x, y, 5.5, 3.6, (a * 180) / Math.PI + 90));
    tiHem.push(hemacia(x, y, 3.2, (a * 180) / Math.PI + 90, 2.3));
  }
  dardos(rng, 8000, [F[0] - R.ti, F[1] - R.ti, F[0] + R.ti, F[1] + R.ti], () => 3.1, (x, y) => {
    const d = Math.hypot(x - F[0], y - F[1]);
    return d > R.g + 3.5 && d < R.ti - 3;
  }, occT, 2.6).forEach(([x, y]) => tiNuc.push(circulo(x, y, 3.1)));
  const teNuc: string[] = [];
  for (let t = 0; t < 900; t++) {
    const a = entre(rng, 0, Math.PI * 2);
    const r = entre(rng, R.ti + 3, R.te - 3);
    const [x, y] = [F[0] + Math.cos(a) * r, F[1] + Math.sin(a) * r];
    if (!occT.livre(x, y, 6, 0.6)) continue;
    occT.marcar(x, y, 6);
    teNuc.push(elipse(x, y, 6, 1.4, (a * 180) / Math.PI + 90));
  }
  const precip: string[] = [];
  for (let k = 0; k < 70; k++) {
    const a = entre(rng, 0, Math.PI * 2);
    const r = Math.sqrt(rng()) * (R.a - 6);
    const [x, y] = [F[0] + Math.cos(a) * r, F[1] + Math.sin(a) * r];
    if (Math.hypot(x - O[0], y - O[1]) < RCum + 4) continue;
    precip.push(circulo(x, y, entre(rng, 0.6, 1.2)));
  }
  const vesO: P = [O[0] + 8, O[1] - 10];

  return (
    <>
      <path d={`M-20,-20H${W + 20}V${f1(ySup(W + 20))}` + Array.from({ length: 53 }, (_, k) => `L${W + 20 - k * 20},${f1(ySup(W + 20 - k * 20))}`).join('') + 'Z'} fill={HE.vidro} />
      <path d={contorno([[-20, yAlb(-20)], ...Array.from({ length: 53 }, (_, k): P => [-20 + k * 20, yAlb(-20 + k * 20)]), [W + 20, H + 20], [-20, H + 20]])} fill={cor.estroma} />
      <path d={estNuc.join('')} fill={HE.nucleo} />
      <E id="tunica-albuginea">
        <path d={contorno([...Array.from({ length: 53 }, (_, k): P => [-20 + k * 20, ySup(-20 + k * 20) + 8]), ...Array.from({ length: 53 }, (_, k): P => [W + 20 - k * 20, yAlb(W + 20 - k * 20) + 1])])} fill={cor.albuginea} />
        <path d={albFib} stroke={cor.fibra} strokeWidth={1.2} fill="none" />
        <path d={albNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="epitelio-superficial-do-ovario">
        <path d={epCel.join('')} fill={cor.epitelio} stroke={cor.epBorda} strokeWidth={0.6} />
        <path d={epNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="foliculo-primordial">
        <path d={pCel.join('')} fill={cor.folicular} stroke={cor.mb} strokeWidth={0.7} />
        <path d={pNucF.join('')} fill={HE.nucleo} />
        <path d={pOo.join('')} fill={cor.ooplasma} />
        <path d={pVes.join('')} fill={cor.vesicula} stroke="#9c8fcf" strokeWidth={0.7} />
        <path d={pNucleolo.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="foliculo-primario">
        <path d={uCel.join('')} fill={cor.folicular} stroke={cor.epBorda} strokeWidth={0.6} />
        <path d={uNuc.join('')} fill={HE.nucleo} />
        <path d={uZona.join('')} fill={cor.zona} />
        <path d={uOo.join('')} fill={cor.ooplasma} />
        <path d={uVes.join('')} fill={cor.vesicula} stroke="#9c8fcf" strokeWidth={0.7} />
        <path d={uNucleolo.join('')} fill={HE.nucleoEscuro} />
        <circle cx={M[0]} cy={M[1]} r={70} fill={cor.tecaI} />
        <path d={mTeca.join('')} fill={HE.nucleo} />
        <circle cx={M[0]} cy={M[1]} r={59} fill={cor.granulosa} stroke={cor.mb} strokeWidth={1} />
        <path d={mNuc.join('')} fill={HE.nucleo} />
        <circle cx={M[0]} cy={M[1]} r={34} fill={cor.zona} />
        <circle cx={M[0]} cy={M[1]} r={30} fill={cor.ooplasma} />
        <circle cx={M[0] - 5} cy={M[1] + 4} r={10} fill={cor.vesicula} stroke="#9c8fcf" strokeWidth={0.7} />
        <circle cx={M[0] - 4} cy={M[1] + 6} r={2.4} fill={HE.nucleoEscuro} />
      </E>
      {/* teca externa: conjuntivo condensado, contínuo com o estroma (como o estroma, sem área de toque) */}
      <g>
        <circle cx={F[0]} cy={F[1]} r={R.te} fill={cor.tecaE} />
        <path d={teNuc.join('')} fill={HE.nucleo} />
      </g>
      <E id="teca-interna">
        <circle cx={F[0]} cy={F[1]} r={R.ti} fill={cor.tecaI} />
        <path d={tiCap.join('')} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={tiHem.join('')} fill={HE.hemacia} />
        <path d={tiNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="celulas-da-granulosa">
        <circle cx={F[0]} cy={F[1]} r={R.g} fill={cor.granulosa} stroke={cor.mb} strokeWidth={1.4} />
      </E>
      <E id="foliculo-secundario">
        <circle cx={F[0]} cy={F[1]} r={R.a} fill={cor.liquor} />
        <path d={precip.join('')} fill="#e7a9c6" />
      </E>
      <E id="celulas-da-granulosa">
        <circle cx={O[0]} cy={O[1]} r={RCum} fill={cor.granulosa} />
        <path d={gNuc.join('')} fill={HE.nucleo} />
      </E>
      <E id="zona-pelucida">
        <circle cx={O[0]} cy={O[1]} r={RZ} fill={cor.zona} />
      </E>
      <E id="ovocito-primario">
        <circle cx={O[0]} cy={O[1]} r={RO} fill={cor.ooplasma} />
        <circle cx={vesO[0]} cy={vesO[1]} r={14} fill={cor.vesicula} stroke="#9c8fcf" strokeWidth={0.8} />
        <circle cx={vesO[0] + 2} cy={vesO[1] + 1} r={3.4} fill={HE.nucleoEscuro} />
      </E>
    </>
  );
}

// =============================================================================================
// 7. ÚTERO, FASE PROLIFERATIVA — escala 1 un ≈ 1,2 µm: glândula ≈ 60 µm de diâmetro; células glandulares ≈ 20 µm de
// altura. As espessuras estão comprimidas: o endométrio proliferativo tem 1–4 mm e o miométrio, 1–2 cm.
export const PARTES_UTERO = ['epitelio-simples-cilindrico', 'lumen', 'endometrio-funcional', 'endometrio-basal', 'glandula-endometrial', 'arteria-espiralada', 'miometrio'];

/** Endométrio proliferativo: glândulas retas, estroma denso, artérias espiraladas, camada basal e miométrio. */
export function LaminaUteroProliferativo(rng: Rng) {
  const cor = { funcional: '#ecbad0', basal: '#e3a6c1', glandula: '#e0a3c4', glBorda: '#c47ca3', epitelio: '#e3a9c8', interfeixe: '#f2d4e1', mitose: '#f1d3e1' };
  const ySup = (x: number) => 34 + 5 * Math.sin(x / 110) + 3 * Math.sin(x / 37);
  const yB = (x: number) => 410 + 10 * Math.sin(x / 130 + 1); // funcional → basal
  const yM = (x: number) => 510 + 16 * Math.sin(x / 90); // basal → miométrio (sem submucosa)
  const dyM = (x: number) => (16 / 90) * Math.cos(x / 90);
  const faixa = (f0: (x: number) => number, f1y: (x: number) => number) => {
    const xs = Array.from({ length: 53 }, (_, k) => -20 + k * 20);
    return contorno([...xs.map((x): P => [x, f0(x)]), ...[...xs].reverse().map((x): P => [x, f1y(x)])]);
  };

  // glândulas: tubos retos perpendiculares à superfície (cortados ao comprido) e perfis transversais/oblíquos
  const glCel: string[] = [];
  const glNuc: string[] = [];
  const glLuz: string[] = [];
  const mitoses: string[] = [];
  const halos: string[] = [];
  const contornosGl: P[][] = [];
  let nMitose = 0;
  const occGl = ocupacao(16, 4);
  const glandula = (contornoExt: P[], h: number) => {
    contornosGl.push(contornoExt);
    const ep = epitelio(contornoExt, 7.4, () => h, 1);
    ep.celulas.forEach((c, k) => {
      glCel.push(contorno(c));
      // núcleos alongados em alturas diferentes (aspecto pseudoestratificado do epitélio proliferativo)
      if (rng() < 0.012 && nMitose < 6) {
        nMitose++;
        const m = ep.meio(k, 0.72);
        halos.push(elipse(m.x, m.y, 3.4, 4.6, m.ang + 90));
        mitoses.push(elipse(m.x, m.y, 3.2, 1.1, m.ang + 90));
        return;
      }
      const m = ep.meio(k, entre(rng, 0.32, 0.66));
      if (m.y < ySup(m.x) + 3) return; // trecho da glândula acima da superfície (coberto pela luz do útero)
      // nas curvas fechadas (fundo de saco, perfis pequenos) as células convergem: núcleo que tocaria o vizinho fica fora do plano
      if (!occGl.livre(m.x, m.y, 2.6, 0.4)) return;
      occGl.marcar(m.x, m.y, 2.6);
      glNuc.push(elipse(m.x, m.y, 4.4, 1.9, m.ang));
    });
    glLuz.push(contorno(ep.topo));
  };
  // poucas glândulas inteiras no plano de corte, de comprimentos e inclinações diferentes; as outras aparecem como perfis
  const longas = ([[118, 452, 0.05], [404, 300, -0.08], [652, 470, 0.1], [905, 380, -0.04]] as [number, number, number][]).map(([x0, fundo, incl]) => {
    const fase = entre(rng, 0, 6);
    const linha: P[] = [];
    for (let y = 10; y <= fundo; y += 6) linha.push([x0 + incl * (y - 10) + 7 * Math.sin(y / 55 + fase), y]);
    return linha;
  });
  const HWG = 26;
  for (const linha of longas) {
    const am = amostrar(linha, Math.round(perimetro(linha, false) / 4), false);
    const esq = am.map((p): P => [p.x + p.nx * HWG, p.y + p.ny * HWG]);
    const dir = am.map((p): P => [p.x - p.nx * HWG, p.y - p.ny * HWG]);
    const fim = am[am.length - 1];
    const cap: P[] = Array.from({ length: 13 }, (_, k) => {
      const a = Math.atan2(fim.ny, fim.nx) - (Math.PI * k) / 12; // fundo de saco: meia-volta pelo lado de baixo
      return [fim.x + Math.cos(a) * HWG, fim.y + Math.sin(a) * HWG];
    });
    const ext = [...esq, ...cap.slice(1, -1), ...dir.reverse()];
    glandula(ext, 19.5);
  }
  const occ = ocupacao(40, 30);
  const medLongas = longas.map((l) => medidorDeLinha(l, false));
  const distLongas = (x: number, y: number) => Math.min(...medLongas.map((m) => m(x, y)));
  // artérias espiraladas: grupos de 2–3 perfis pequenos (o mesmo vaso enrolado, cortado várias vezes), na parte
  // profunda da camada funcional; na fase proliferativa ainda são pouco enroladas
  const grupos: P[] = [];
  for (let t = 0; t < 400 && grupos.length < 4; t++) {
    const x = entre(rng, 40, W - 40);
    const y = entre(rng, 250, 380);
    if (distLongas(x, y) < HWG + 30 || grupos.some(([gx, gy]) => Math.hypot(gx - x, gy - y) < 160)) continue;
    grupos.push([x, y]);
  }
  const artMedia: string[] = [];
  const perfisArt: P[] = [];
  const artLuz: string[] = [];
  const artNuc: string[] = [];
  const artHem: string[] = [];
  const artEndo: string[] = [];
  grupos.forEach(([gx, gy]) => {
    const n = rng() < 0.5 ? 2 : 3;
    const g0 = entre(rng, 0, Math.PI * 2);
    for (let k = 0; k < n; k++) {
      const a = g0 + (2 * Math.PI * k) / n;
      const x = gx + Math.cos(a) * 13;
      const y = gy + Math.sin(a) * 13;
      occ.marcar(x, y, 12);
      perfisArt.push([x, y]);
      artMedia.push(circulo(x, y, 10));
      artLuz.push(circulo(x, y, 4.2));
      for (let q = 0; q < 5; q++) {
        const b = (2 * Math.PI * q) / 5 + entre(rng, -0.2, 0.2);
        artNuc.push(elipse(x + Math.cos(b) * 7.1, y + Math.sin(b) * 7.1, 3, 1.1, (b * 180) / Math.PI + 90));
      }
      artEndo.push(elipse(x + 3.6, y, 1.6, 0.7, 90));
      if (rng() < 0.6) artHem.push(hemacia(x - 0.5, y, 2.6, entre(rng, 0, 180), 1.8));
    }
  });
  // perfis transversais de glândulas (na funcional e alguns, menores, na basal)
  const transversais = dardos(rng, 2500, [-10, 80, W + 10, 500], () => entre(rng, 20, 26), (x, y, r) => y - r > ySup(x) + 30 && y + r < yM(x) - 8 && distLongas(x, y) > HWG + r + 10 && (y < yB(x) || r < 23), occ, 12);
  for (const [x, y, r] of transversais) {
    const e = entre(rng, 1, 1.25);
    const g = entre(rng, 0, Math.PI);
    const ctr = pontosPolar(x, y, (a) => r / Math.sqrt(Math.cos(a - g) ** 2 / (e * e) + Math.sin(a - g) ** 2), 60);
    glandula(ctr, Math.min(16, r - 7));
  }
  const caixas = contornosGl.map((pol) => [Math.min(...pol.map((p) => p[0])), Math.min(...pol.map((p) => p[1])), Math.max(...pol.map((p) => p[0])), Math.max(...pol.map((p) => p[1]))]);
  const medGl = contornosGl.map((pol) => medidorDeLinha(pol, true));
  const naGlandula = (x: number, y: number, m: number) =>
    contornosGl.some((pol, i) => {
      const [x0, y0, x1, y1] = caixas[i];
      return x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m && (dentro(x, y, pol) || medGl[i](x, y) < m);
    });

  // estroma: denso e celular (núcleos ovais/fusiformes, pouco citoplasma); mais denso ainda na camada basal
  const occE = ocupacao(16, 12); // rMax ≥ maior raio marcado (perfis arteriais)
  for (const [x, y] of perfisArt) occE.marcar(x, y, 11.5);
  const estF: string[] = [];
  const estB: string[] = [];
  dardos(rng, 16000, [-10, 40, W + 10, 560], () => 3.5, (x, y) => y > ySup(x) + 22 && y < yM(x) - 5 && !naGlandula(x, y, 5.5), occE, 2.6).forEach(([x, y]) => {
    const bas = y > yB(x);
    (bas ? estB : estF).push(elipse(x, y, entre(rng, 3, 3.6), entre(rng, 1.5, 2), entre(rng, 0, 180)));
  });
  // mitoses ocasionais também no estroma
  for (let k = 0, n = 0; k < 200 && n < 3; k++) {
    const x = entre(rng, 50, W - 50);
    const y = entre(rng, 120, 380);
    if (!occE.livre(x, y, 4.6, 0.5) || naGlandula(x, y, 5)) continue;
    occE.marcar(x, y, 4.6);
    n++;
    halos.push(circulo(x, y, 4.4));
    mitoses.push(elipse(x, y, 3.2, 1.1, entre(rng, 0, 180)));
  }

  // epitélio de revestimento: simples cilíndrico (células secretoras e algumas ciliadas), interrompido nas aberturas das glândulas
  const sup = Array.from({ length: 141 }, (_, k): P => [-10 + k * 7.4, ySup(-10 + k * 7.4)]);
  const supCel: string[] = [];
  const supNuc: string[] = [];
  const supCil: string[] = [];
  const bocas = longas.map((l) => (l.find((p) => p[1] >= 40) ?? l[0])[0]);
  for (let k = 0; k < sup.length - 1; k++) {
    const [x0, y0] = sup[k];
    const [x1, y1] = sup[k + 1];
    const xm = (x0 + x1) / 2;
    if (bocas.some((b) => Math.abs(xm - b) < HWG + 3)) continue;
    supCel.push(contorno([[x0, y0], [x1, y1], [x1, y1 + 18], [x0, y0 + 18]]));
    supNuc.push(elipse(xm, (y0 + y1) / 2 + entre(rng, 9, 12), 4.4, 1.9, 90));
    if (k % 5 === 2) supCil.push(`M${f1(x0 + 1.5)},${f1(y0)}l0,-4.5M${f1(xm)},${f1((y0 + y1) / 2)}l0,-4.5M${f1(x1 - 1.5)},${f1(y1)}l0,-4.5`);
  }

  // miométrio: feixes de músculo liso em várias direções (cortes longitudinais e transversais), conjuntivo entre eles
  // vasos no conjuntivo entre os feixes (sítios com peso: os feixes se afastam deles)
  const vasosM: [number, number, number][] = [[230, 640, 15], [700, 655, 12]];
  const occFx = ocupacao(80, 40);
  vasosM.forEach(([x, y, r]) => occFx.marcar(x, y, r + 10));
  const semF = dardos(rng, 1500, [-60, 470, W + 60, H + 60], () => 36, (x, y) => y > yM(x) + 10, occFx, 0);
  const sitF: Sitio[] = [...semF.map(([x, y]) => ({ x, y, w: 0 })), ...vasosM.map(([x, y, r]) => ({ x, y, w: r + 18 }))];
  const feixes: string[] = [];
  const feixesT: string[] = [];
  const nucL: string[] = [];
  const nucT: string[] = [];
  const occF = ocupacao(16, 7);
  celulasDe(sitF, 60, 2.6, 130).slice(0, semF.length).forEach((pol0, i) => {
    const q = sitF[i];
    // corte pela junção endométrio-miométrio (tangente à curva no x do feixe): irregular, sem submucosa
    const sl = dyM(q.x);
    const nl = Math.hypot(sl, 1);
    const pol = cortar(pol0, sl / nl, -1 / nl, q.x, yM(q.x) + 2);
    if (pol.length < 3) return;
    const ac = centroidePol(pol);
    const longitudinal = rng() < 0.6;
    (longitudinal ? feixes : feixesT).push(contorno(chaikin(pol, 3)));
    const th = entre(rng, 0, 180);
    const area = Math.abs(pol.reduce((acc, p, j) => acc + p[0] * pol[(j + 1) % pol.length][1] - pol[(j + 1) % pol.length][0] * p[1], 0)) / 2;
    const n = Math.round(area / (longitudinal ? 150 : 95));
    for (let t = 0, feitos = 0; t < n * 8 && feitos < n; t++) {
      const x = ac[0] + entre(rng, -40, 40);
      const y = ac[1] + entre(rng, -40, 40);
      if (!dentro(x, y, pol) || distLinha(x, y, pol, true) < 6) continue;
      const r = longitudinal ? 6.8 : 2.1;
      if (!occF.livre(x, y, r, longitudinal ? 2.5 : 4)) continue;
      occF.marcar(x, y, r);
      feitos++;
      (longitudinal ? nucL : nucT).push(longitudinal ? elipse(x, y, 6.8, 1.3, th + entre(rng, -6, 6)) : circulo(x, y, 2.1));
    }
  });

  return (
    <>
      <E id="miometrio">
        <path d={faixa(yM, () => H + 20)} fill={cor.interfeixe} />
        <path d={feixes.join('')} fill={HE.musculo} />
        <path d={feixesT.join('')} fill="#e58db3" />
        <path d={nucL.join('')} fill={HE.nucleo} />
        <path d={nucT.join('')} fill={HE.nucleo} />
        <path d={vasosM.map(([x, y, r]) => circulo(x, y, r)).join('')} fill={HE.luz} stroke="#c9578d" strokeWidth={3.5} />
        <path d={vasosM.map(([x, y, r]) => hemacia(x - r * 0.3, y, 3.6, 30, 2.6) + hemacia(x + r * 0.3, y + 2, 3.6, -40, 2.6)).join('')} fill={HE.hemacia} />
      </E>
      <E id="endometrio-basal">
        <path d={faixa(yB, yM)} fill={cor.basal} />
        <path d={estB.join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="endometrio-funcional">
        <path d={faixa(ySup, yB)} fill={cor.funcional} />
        <path d={estF.join('')} fill={HE.nucleo} />
        <path d={halos.slice(nMitose).join('')} fill={cor.mitose} />
        <path d={mitoses.slice(nMitose).join('')} fill={HE.nucleoEscuro} />
      </E>
      <E id="arteria-espiralada">
        <path d={artMedia.join('')} fill={HE.musculo} stroke="#c45a8a" strokeWidth={0.8} />
        <path d={artNuc.join('')} fill={HE.nucleo} />
        <path d={artLuz.join('')} fill={HE.luz} />
        <path d={artEndo.join('')} fill={HE.nucleoEscuro} />
        <path d={artHem.join('')} fill={HE.hemacia} />
      </E>
      <E id="glandula-endometrial">
        <path d={contornosGl.map((pol) => contorno(pol)).join('')} fill={cor.glandula} stroke={cor.glBorda} strokeWidth={1} />
        <path d={glCel.join('')} fill={cor.glandula} stroke={cor.glBorda} strokeWidth={0.5} />
        <path d={glNuc.join('')} fill={HE.nucleo} />
        <path d={halos.slice(0, nMitose).join('')} fill={cor.mitose} />
        <path d={mitoses.slice(0, nMitose).join('')} fill={HE.nucleoEscuro} />
        <path d={glLuz.join('')} fill={HE.luz} />
      </E>
      <E id="lumen">
        <path d={`M-20,-20H${W + 20}V${f1(ySup(W + 20))}` + sup.slice().reverse().map(([x, y]) => `L${f1(x)},${f1(y)}`).join('') + `L-20,${f1(ySup(-20))}Z`} fill={HE.luz} />
      </E>
      <E id="epitelio-simples-cilindrico">
        <path d={supCel.join('')} fill={cor.epitelio} stroke={cor.glBorda} strokeWidth={0.5} />
        <path d={supNuc.join('')} fill={HE.nucleo} />
        <path d={supCil.join('')} stroke="#c4467c" strokeWidth={0.7} fill="none" />
      </E>
    </>
  );
}

// =============================================================================================
export const LAMINAS_SISTEMAS_C: Record<string, LaminaRender> = {
  pulmao: { desenhar: LaminaPulmao, partes: PARTES_PULMAO },
  // o campo do jogo precisa mostrar um corpúsculo renal: sem ele, só túbulos, o campo lembraria a lâmina epitelio-cubico-rim
  'rim-cortex': { desenhar: LaminaRimCortex, partes: PARTES_RIM, areaDiagnostica: [280, 260, 400, 400] },
  tireoide: { desenhar: LaminaTireoide, partes: PARTES_TIREOIDE },
  // a fasciculada (cordões de espongiócitos) é o aspecto mais característico: o campo sempre pega ela e uma vizinha
  adrenal: { desenhar: LaminaAdrenal, partes: PARTES_ADRENAL, areaDiagnostica: [250, 160, 750, 420] },
  testiculo: { desenhar: LaminaTesticulo, partes: PARTES_TESTICULO },
  ovario: { desenhar: LaminaOvario, partes: PARTES_OVARIO },
  // o campo do jogo precisa pegar endométrio com glândulas: um campo só de miométrio lembraria a lâmina de músculo liso
  'utero-proliferativo': { desenhar: LaminaUteroProliferativo, partes: PARTES_UTERO, areaDiagnostica: [200, 170, 800, 400] },
};
