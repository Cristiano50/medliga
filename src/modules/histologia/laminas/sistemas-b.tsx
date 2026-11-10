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
/** Polígono fechado. */
const pg = (pts: P[]) => 'M' + pts.map(([x, y]) => `${q(x)} ${q(y)}`).join('L') + 'Z';
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
const fuso = (x0: number, x1: number, y: number, e: number) => `M${q(x0)} ${q(y)}Q${q((x0 + x1) / 2)} ${q(y - e)} ${q(x1)} ${q(y)}Q${q((x0 + x1) / 2)} ${q(y + e)} ${q(x0)} ${q(y)}Z`;
/** Linha (polilinha aberta). */
const lin = (pts: P[]) => 'M' + pts.map(([x, y]) => `${q(x)} ${q(y)}`).join('L');

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
  for (let x = entre(rng, 30, 70); x < W + 40; x += entre(rng, 92, 128)) if (Math.abs(x - 745) > 42) papilas.push({ x, h: entre(rng, 58, 84), w: entre(rng, 15, 20) });
  const juncao = (x: number) => {
    let y = 240 + 4 * Math.sin(x / 90);
    for (const p of papilas) {
      const u = (x - p.x) / p.w;
      if (Math.abs(u) < 1) y -= p.h * Math.pow(Math.cos((u * Math.PI) / 2), 1.3);
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
    if (dDucto(x, y) < 12) continue;
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
  for (const [x, y] of grade(rng, 17, [-10, 60, W + 10, 270], 0.11)) {
    const s = sup(x);
    if (y < s + 47 || y > juncao(x) - 4 || distJuncao(x, y) < 16.5 || dDucto(x, y) < 11.5) continue;
    const k = (y - s) / (juncao(x) - s); // 0 = superfície, 1 = base
    const fy = k > 0.55 ? 1 : 0.86;
    const pts = hexagono(rng, x, y, 9.7).map(([px, py]): P => [x + (px - x) * 1.02, y + (py - y) * fy]);
    if (k > 0.62) profCel += pg(pts);
    else medCel += pg(pts);
    if (esp.tentar(x, y, 5)) medNuc += circ(x + entre(rng, -1, 1), y + entre(rng, -1, 1), k > 0.62 ? 3.6 : 3.3);
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
  const dentroLP = (x: number, y: number) => y > juncao(x) + 5 && y < yMM0 - 5 && dDucto(x, y) > 11;

  // --- muscular da mucosa: músculo liso longitudinal, aqui cortado de través, em feixes
  const cortesMM = [-10];
  while (cortesMM[cortesMM.length - 1] < W) cortesMM.push(cortesMM[cortesMM.length - 1] + entre(rng, 70, 120));
  const entreFeixes = (x: number) => cortesMM.some((c) => Math.abs(x - c) < 3);
  const mm = lisoTransversal(rng, yMM0, yMM1, (x, y) => entreFeixes(x) || dDucto(x, y) < 11);

  // --- submucosa: conjuntivo denso com vasos e glândulas esofágicas (mucosas)
  const glandulas: { cx: number; cy: number; acinos: P[] }[] = [
    { cx: 250, cy: 396, acinos: [] },
    { cx: 712, cy: 404, acinos: [] },
  ];
  for (const g of glandulas)
    for (const [x, y] of grade(rng, 31, [g.cx - 80, g.cy - 50, g.cx + 80, g.cy + 50], 0.08))
      if (((x - g.cx) / 74) ** 2 + ((y - g.cy) / 44) ** 2 < 1) g.acinos.push([x, y]);
  let acinoCel = '';
  let acinoLim = '';
  let acinoNuc = '';
  let acinoLuz = '';
  for (const g of glandulas)
    for (const [x, y] of g.acinos) {
      const r = 15;
      acinoCel += circ(x, y, r);
      const n = 7;
      const giro = entre(rng, 0, 1);
      for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n + giro;
        acinoLim += `M${q(x + Math.cos(a) * 3)} ${q(y + Math.sin(a) * 3)}L${q(x + Math.cos(a) * r)} ${q(y + Math.sin(a) * r)}`;
        const am = a + Math.PI / n;
        acinoNuc += seg(x + Math.cos(am) * (r - 2.6), y + Math.sin(am) * (r - 2.6), 4.2, am + Math.PI / 2);
      }
      acinoLuz += circ(x, y, 2.4);
    }
  // ducto: luz estreita revestida por epitélio cúbico; dentro do epitélio da mucosa, por células achatadas
  let ductoBordas = '';
  let ductoNucC = '';
  let ductoNucA = '';
  for (const { x, y, tx, ty } of reamostrar(ducto, 6.4, 3)) {
    const noEpitelio = y < juncao(x) - 2;
    for (const lado of [-1, 1]) {
      const nx = -ty * lado;
      const ny = tx * lado;
      if (!noEpitelio) ductoBordas += `M${q(x + tx * 3.2 + nx * 2.6)} ${q(y + ty * 3.2 + ny * 2.6)}L${q(x + tx * 3.2 + nx * 8.4)} ${q(y + ty * 3.2 + ny * 8.4)}`;
      if (noEpitelio) ductoNucA += seg(x + nx * 5.4, y + ny * 5.4, 3.6, Math.atan2(ty, tx));
      else ductoNucC += pt(x + nx * 5.6, y + ny * 5.6);
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
        <path d={epitelio} fill="#eebad1" />
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
          <path d={lin(ducto.slice(0, 5))} stroke={HE.colagenoClaro} strokeWidth={23} strokeLinejoin="round" fill="none" />
        </Deco>
        <path d={lin(ducto)} stroke="#eab3cd" strokeWidth={17} strokeLinejoin="round" fill="none" />
        <path d={ductoBordas} stroke="#d58db0" strokeWidth={0.8} />
        <path d={lin(ducto)} stroke={HE.luz} strokeWidth={4.6} strokeLinejoin="round" strokeLinecap="round" fill="none" />
        <path d={ductoNucC} stroke={HE.nucleo} strokeWidth={3.8} strokeLinecap="round" />
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
  const R = 26; // raio do "ombro" entre a superfície e a fosseta
  const lwPit = (y: number) => 8.5 - 4.5 * Math.min(1, Math.max(0, (y - yS - R) / (yPit - yS - R))); // funil
  const lwGl = (y: number, yb: number) => (y > yb - 40 ? 3.2 + (1.6 * (y - yb + 40)) / 40 : 3.2); // base um pouco dilatada
  const yN = yPit + 48; // fim do colo inclinado: daí para baixo a glândula é reta
  const yC = yPit + 8; // topo da crista entre as duas glândulas que se abrem na mesma fosseta
  const rC = 16; // raio da crista (≈ altura das células, para elas não se cruzarem)
  const fossetas = Array.from({ length: 8 }, (_, k) => 50 + 136 * k + entre(rng, -5, 5));
  const glandulas = fossetas.flatMap((x) => [
    { x: x - 34 + entre(rng, -2, 2), fosseta: x, lado: -1, fundo: entre(rng, 524, 538) },
    { x: x + 34 + entre(rng, -2, 2), fosseta: x, lado: 1, fundo: entre(rng, 524, 538) },
  ]);
  const passos = (a: P, b: P, n: number) => Array.from({ length: n }, (_, i): P => [a[0] + ((b[0] - a[0]) * (i + 1)) / n, a[1] + ((b[1] - a[1]) * (i + 1)) / n]);
  /** Luz de uma glândula do topo do colo (junto à fosseta) até o fundo, como contorno no sentido da luz à esquerda. */
  const paredeGlandula = (g: (typeof glandulas)[number]) => {
    const px = g.fosseta;
    const esq: P[] = g.lado < 0 ? passos([px - lwPit(yPit), yPit], [g.x - 3.2, yN], 9) : passos([px + rC, yC + rC], [g.x - 3.2, yN], 6);
    for (let y = yN + 4; y < g.fundo; y += 4) esq.push([g.x - lwGl(y, g.fundo), y]);
    const fundo = arco(g.x, g.fundo, 4.8, 180, 0, 8);
    const dir: P[] = [];
    for (let y = g.fundo - 4; y > yN; y -= 4) dir.push([g.x + lwGl(y, g.fundo), y]);
    dir.push(...(g.lado < 0 ? passos([g.x + 3.2, yN], [px - rC, yC + rC], 6) : passos([g.x + 3.2, yN], [px + lwPit(yPit), yPit], 9)));
    return [...esq, ...fundo, ...dir];
  };

  // contorno apical contínuo: superfície → fosseta → glândula esquerda → crista → glândula direita → fosseta → superfície
  const cont: P[] = [[-30, yS]];
  for (let k = 0; k < fossetas.length; k++) {
    const px = fossetas[k];
    const l0 = lwPit(yS + R);
    cont.push(...arco(px - l0 - R, yS + R, R, -90, 0, 10));
    for (let y = yS + R + 4; y <= yPit; y += 4) cont.push([px - lwPit(y), y]);
    cont.push(...paredeGlandula(glandulas[2 * k]));
    cont.push(...arco(px, yC + rC, rC, 180, 360, 10));
    cont.push(...paredeGlandula(glandulas[2 * k + 1]));
    for (let y = yPit - 4; y > yS + R; y -= 4) cont.push([px + lwPit(y), y]);
    cont.push(...arco(px + l0 + R, yS + R, R, 180, 270, 10));
  }
  cont.push([W + 60, yS]);

  // tipo de célula pela profundidade: superfície/fosseta → colo → corpo → base
  const escolher = (a: { x: number; y: number }) => {
    const y = a.y;
    if (y < yPit + 2) return { tipo: 'sup', n: 2, prof: 22 };
    const r = rng();
    // na crista as células convergem: só células mucosas do colo, mais baixas
    if (fossetas.some((px) => Math.hypot(a.x - px, y - yC - rC) < rC + 3)) return { tipo: 'colo', n: 2, prof: 14 };
    if (y < 228) return r < 0.62 ? { tipo: 'colo', n: 2, prof: 17 } : { tipo: 'parietal', n: 4, prof: 20, bojo: 4 };
    // no fundo curvo da glândula, só células principais (uma parietal ali ficaria deformada)
    const pPar = y < 440 ? 0.64 - (0.34 * (y - 228)) / 212 : y < 494 ? 0.2 : 0;
    return r < pPar ? { tipo: 'parietal', n: 4, prof: 20, bojo: 4 } : { tipo: 'principal', n: 2, prof: 18 };
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
      const [x, y] = naCelula(c, 0.84);
      if (espNuc.tentar(x, y, 3)) d.coloNuc += seg(x, y, 4.5, Math.atan2(c.ty, c.tx));
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
        <path d={d.coloNuc} stroke={HE.nucleoEscuro} strokeWidth={2.8} strokeLinecap="round" />
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
export const PARTES_COLON = ['epitelio-simples-cilindrico', 'cripta-intestinal', 'celula-caliciforme', 'lamina-propria', 'muscular-da-mucosa', 'submucosa', 'muscular-externa', 'plexo-mioenterico'];
/**
 * Intestino grosso (cólon), corte transversal da parede: superfície plana, sem vilosidades, com criptas retas,
 * paralelas e muito próximas, ricas em células caliciformes. Luz em cima.
 */
export function LaminaColon(rng: Rng) {
  const yS = 24;
  const yMM0 = 306;
  const yMM1 = 324;
  const yME0 = 436;
  const ySepto0 = 578;
  const ySepto1 = 594;
  const R = 13; // ombro entre a superfície e a boca da cripta; ali as células são mais baixas para não se cruzarem
  const prof = 18; // altura das células (≈ 2× a largura)
  const lw = (y: number) => (y < yS + R + 24 ? 6 - (2.5 * (y - yS - R)) / 24 : 3.5); // luz estreita, boca um pouco mais larga
  // criptas muito próximas ("tubos de ensaio"): pouca lâmina própria entre elas
  const criptas = Array.from({ length: 17 }, (_, k) => ({ x: 20 + 60 * k + entre(rng, -3, 3), fundo: entre(rng, 284, 296) }));
  const cont: P[] = [[-40, yS]];
  for (const c of criptas) {
    cont.push(...arco(c.x - 6 - R, yS + R, R, -90, 0, 7));
    for (let y = yS + R + 4; y < c.fundo; y += 4) cont.push([c.x - lw(y), y]);
    cont.push(...arco(c.x, c.fundo, 4.5, 180, 0, 6));
    for (let y = c.fundo - 4; y > yS + R; y -= 4) cont.push([c.x + lw(y), y]);
    cont.push(...arco(c.x + 6 + R, yS + R, R, 180, 270, 7));
  }
  cont.push([W + 40, yS]);
  // caliciformes: ~1 em 3 na superfície, ~1 em 2 no terço inferior das criptas
  const celulas = celulasNoContorno(reamostrar(cont, 4.6), (a) => ({
    tipo: rng() < (a.y < yS + R ? 0.28 : a.y < 150 ? 0.4 : 0.52) ? 'cal' : 'abs',
    n: 2,
    prof: a.y > yS + 1 && a.y < yS + R + 2 ? 12 : prof,
  }));
  const espNuc = new Espaco();
  const d = { sup: '', supNuc: '', borda: '', cri: '', criNuc: '', cal: '', calTeca: '', calNuc: '' };
  for (const c of celulas) {
    const naSuperficie = c.ay < yS + R - 2;
    if (c.tipo === 'cal') {
      d.cal += pg(c.poli);
      const [tx, ty] = naCelula(c, 0.36);
      d.calTeca += elip(tx, ty, c.prof * 0.34, 4.5, Math.atan2(c.ny, c.nx));
      const [x, y] = naCelula(c, 0.86);
      if (espNuc.tentar(x, y, 2.6)) d.calNuc += seg(x, y, 3, Math.atan2(c.ty, c.tx));
    } else {
      const [x, y] = naCelula(c, 0.66);
      const nuc = espNuc.tentar(x, y, 2.8) ? seg(x, y, 5, Math.atan2(c.ny, c.nx)) : '';
      if (naSuperficie) {
        d.sup += pg(c.poli);
        d.supNuc += nuc;
        // planura estriada (microvilosidades): faixa fina sobre as células absortivas da superfície
        const k = c.poli.length / 2;
        d.borda += lin(c.poli.slice(0, k).map(([px, py]): P => [px + c.nx * 1, py + c.ny * 1]));
      } else {
        d.cri += pg(c.poli);
        d.criNuc += nuc;
      }
    }
  }
  let luzCripta = '';
  for (const c of criptas) {
    const esq: P[] = [];
    const dir: P[] = [];
    for (let y = yS + R; y < c.fundo; y += 4) {
      esq.push([c.x - lw(y), y]);
      dir.unshift([c.x + lw(y), y]);
    }
    luzCripta += pg([[c.x - 6, yS + R - 6], ...esq, ...arco(c.x, c.fundo, 4.5, 180, 0, 6), ...dir, [c.x + 6, yS + R - 6]]);
  }
  // lâmina própria rica em células (linfócitos, plasmócitos), capilares junto às criptas
  const espLP = new Espaco();
  for (const c of celulas) {
    const [x, y] = naCelula(c, 0.5);
    espLP.marcar(x, y, 10);
  }
  let capLP = '';
  let hemLP = '';
  for (let k = 0; k < 500 && capLP.length < 1500; k++) {
    const x = entre(rng, 0, W);
    const y = entre(rng, yS + 30, yMM0 - 8);
    if (!espLP.tentar(x, y, 7)) continue;
    capLP += elip(x, y, 3.2, 5, 0);
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
  const ganglios: [number, number, number, number, number][] = [
    [140, 586, 44, 16, 3],
    [480, 585, 52, 17, 4],
    [820, 587, 40, 15, 3],
  ];
  const noGanglio = (x: number, y: number, m: number) => ganglios.some(([gx, gy, rx, ry]) => ((x - gx) / (rx + m)) ** 2 + ((y - gy) / (ry + m)) ** 2 < 1);
  const circular = lisoLongitudinal(rng, yME0, ySepto0, (x, y) => noGanglio(x, y, 4));
  const cortes = [-10];
  while (cortes[cortes.length - 1] < W) cortes.push(cortes[cortes.length - 1] + entre(rng, 90, 150));
  const longit = lisoTransversal(rng, ySepto1, H + 6, (x, y) => noGanglio(x, y, 3) || cortes.some((c) => Math.abs(x - c) < 3), 8);
  const nervos = `M-10 586C40 582 80 588 100 586M190 586C280 583 360 590 430 585M530 585C620 582 720 590 782 587M858 587C920 584 970 589 1010 586`;

  return (
    <>
      <rect width={W} height={H} fill={HE.luz} />
      <E id="lamina-propria">
        <path d={pg([...cont, [W + 40, yMM0 + 2], [-40, yMM0 + 2]])} fill="#f3c0d6" />
        <Deco>
          <path d={capLP} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={1.1} />
          <path d={hemLP} stroke={HE.hemacia} strokeWidth={4.4} strokeLinecap="round" />
        </Deco>
        {celulasConjuntivo(rng, 420, [0, yS + 16, W, yMM0 - 3], () => true, espLP, 0.8)}
      </E>
      <E id="cripta-intestinal">
        {/* luz estreita com muco */}
        <path d={luzCripta} fill="#e6dcee" />
        <path d={d.cri} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.criNuc} stroke={HE.nucleo} strokeWidth={3.6} strokeLinecap="round" />
      </E>
      <E id="epitelio-simples-cilindrico">
        <path d={d.sup} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.supNuc} stroke={HE.nucleo} strokeWidth={3.6} strokeLinecap="round" />
        <path d={d.borda} stroke="#c4467c" strokeWidth={2} fill="none" strokeLinecap="round" />
      </E>
      <E id="celula-caliciforme">
        <path d={d.cal} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
        <path d={d.calTeca} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.1} />
        <path d={d.calNuc} stroke={HE.nucleoEscuro} strokeWidth={3} strokeLinecap="round" />
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
      <E id="muscular-externa">
        <path d={`M-10 ${yME0}H${W + 10}V${H + 10}H-10Z`} fill={COR_LISO.fundo} />
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
      b = nb.map((a0) => a0 + entre(rng, -1.7, 1.7) / rm);
      // limite à direita de cada placa: sinusoide comum, ponte (anastomose entre placas) ou sinusoide com Kupffer
      const tipos = b.map(() => {
        const t = rng();
        return t < 0.15 ? 0 : t < 0.185 ? 2 : 1;
      });
      const largs = tipos.map((t) => (t === 0 ? 0 : t === 2 ? 11 : entre(rng, 5.5, 7.5)));
      b.forEach((a0, j) => {
        const a1 = j < b.length - 1 ? b[j + 1] : b[0] + 2 * Math.PI;
        const tD = tipos[j];
        const b0 = a0 + largs[(j - 1 + b.length) % b.length] / 2 / rm;
        const b1 = a1 - largs[j] / 2 / rm;
        const bm = (b0 + b1) / 2;
        const fora = (a: number) => Math.max(r, Math.min(r + h, rho(a)));
        const [mx, my] = em(bm, (r + fora(bm)) / 2);
        if (fora(bm) - r < 3 || mx < -25 || mx > W + 25 || my < -25 || my > H + 25 || noPortal(mx, my, -6)) return;
        celulas += pg([em(b0, r), em(bm, r), em(b1, r), em(b1, fora(b1)), em(bm, fora(bm)), em(b0, fora(b0))]);
        const larguraArco = (b1 - b0) * rm;
        if (fora(bm) - r > 10 && larguraArco > 9 && !noPortal(mx, my, 5)) {
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
          if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10 || noPortal(sx, sy, 8)) return;
          const c = Math.min(7, h / 2 - 1.2);
          kupffer += elip(sx, sy, c, 4.3, as);
          kupfferNuc += elip(sx + Math.cos(as) * 0.8, sy + Math.sin(as) * 0.8, 3.3, 2.2, as);
          espS.marcar(sx, sy, c);
          return;
        }
        const rs = r + h * entre(rng, 0.3, 0.7);
        if (rs > rho(as) - 2) return;
        const [sx, sy] = em(as, rs);
        if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10 || noPortal(sx, sy, 2)) return;
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
  const vizinhos = centros.map(([x, y], i) => centros.map((c, j) => j).filter((j) => j !== i && Math.hypot(centros[j][0] - x, centros[j][1] - y) < passo * 1.6));
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
  const centroacinosas = new Set<number>(ductos.flat());
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
      poli = cortar(poli, ux, uy, ux * il.x + uy * il.y - raioIlhota(il, Math.atan2(-uy, -ux)) - 4);
    }
    const sx = septoX(y);
    if (Math.abs(x - sx) < 120) poli = x < sx ? cortar(poli, 1, 0, sx - septoL(y) - 3) : cortar(poli, -1, 0, -(sx + septoL(y) + 3));
    if (poli.length < 3 || area(poli) < 900) return;
    // o centro precisa ficar bem dentro do perfil (senão núcleos e grânulos cairiam fora do ácino, no conjuntivo)
    if (Array.from({ length: 12 }, (_, k) => raioPoligono(poli, x, y, (Math.PI * k) / 6)).some((r) => !(r >= 13 && r < 40))) return;
    basal += pg(poli);
    apical += pg(poli.map(([px, py]): P => [x + (px - x) * 0.56, y + (py - y) * 0.56]));
    const comCentro = centroacinosas.has(i) || rng() < 0.5;
    // 7 células por perfil de ácino: limites radiais do centro à borda, núcleo redondo na base, grânulos no ápice
    const n = 7;
    const giro = entre(rng, 0, 1);
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n + giro;
      const rb = raioPoligono(poli, x, y, a);
      limites += `M${q(x + Math.cos(a) * 3)} ${q(y + Math.sin(a) * 3)}l${q(Math.cos(a) * (rb - 3))} ${q(Math.sin(a) * (rb - 3))}`;
      const am = a + Math.PI / n;
      const rn = raioPoligono(poli, x, y, am) * 0.76;
      const nx = x + Math.cos(am) * rn;
      const ny = y + Math.sin(am) * rn;
      if (espN.tentar(nx, ny, 3.4)) nucs.push([nx, ny]);
      for (let g = 0; g < 2; g++) {
        const ag = a + (Math.PI / n) * entre(rng, 0.3, 1.7);
        const dg = raioPoligono(poli, x, y, ag) * entre(rng, comCentro ? 0.3 : 0.12, 0.5);
        gr.push([x + Math.cos(ag) * dg, y + Math.sin(ag) * dg]);
      }
    }
    if (comCentro) {
      // célula centroacinosa: início do ducto intercalado dentro do ácino; citoplasma muito pálido, núcleo claro ovoide
      const a = entre(rng, 0, Math.PI);
      centroCel += elip(x, y, 6, 4.2, a);
      centroNuc += elip(x, y, 2.9, 1.9, a);
    } else luz.push([x, y]);
  });
  let ductoParede = '';
  let ductoLuz = '';
  let ductoNuc = '';
  for (const [i, j] of ductos) {
    const [x1, y1] = centros[i];
    const [x2, y2] = centros[j];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const L = 12;
    ductoParede += `M${q(mx - c * L)} ${q(my - sn * L)}L${q(mx + c * L)} ${q(my + sn * L)}`;
    ductoLuz += `M${q(mx - c * (L + 3))} ${q(my - sn * (L + 3))}L${q(mx + c * (L + 3))} ${q(my + sn * (L + 3))}`;
    for (let t = -L + 3; t <= L - 2; t += 7.5)
      for (const lado of [-1, 1]) ductoNuc += seg(mx + c * (t + (lado > 0 ? 3.5 : 0)) - sn * 3.5 * lado, my + sn * (t + (lado > 0 ? 3.5 : 0)) + c * 3.5 * lado, 3.2, a);
  }

  // ilhotas de Langerhans: cordões de células pálidas com núcleos redondos e capilares entre eles
  let ilCel = '';
  let ilNuc = '';
  let ilCap = '';
  let ilHem = '';
  let ilBorda = '';
  for (const il of ilhotas) {
    const contorno = Array.from({ length: 36 }, (_, k): P => {
      const a = (2 * Math.PI * k) / 36;
      return [il.x + Math.cos(a) * raioIlhota(il, a), il.y + Math.sin(a) * raioIlhota(il, a)];
    });
    ilBorda += pg(contorno);
    const caps: P[][] = [];
    const nCap = il.r > 70 ? 4 : 2;
    for (let k = 0; k < nCap; k++) {
      const a = entre(rng, 0, Math.PI) + (k * Math.PI) / nCap;
      const pts: P[] = [];
      for (let t = -1; t <= 1.001; t += 0.125) {
        const u = t * il.r * 0.92;
        const v = Math.sin(t * 3 + k) * il.r * 0.12 + (k - (nCap - 1) / 2) * il.r * 0.3;
        pts.push([il.x + Math.cos(a) * u - Math.sin(a) * v, il.y + Math.sin(a) * u + Math.cos(a) * v]);
      }
      const dentro = pts.filter(([px, py]) => naIlhota(px, py, -6));
      if (dentro.length > 3) caps.push(dentro);
    }
    for (const c of caps) {
      ilCap += lin(c);
      reamostrar(c, 9, 4).forEach((a, k) => {
        if (k % 2 === 0) ilHem += pt(a.x, a.y);
      });
    }
    const esp = new Espaco();
    for (const [x, y] of grade(rng, 12.5, [il.x - il.r - 10, il.y - il.r - 10, il.x + il.r + 10, il.y + il.r + 10], 0.1)) {
      if (!naIlhota(x, y, -6) || caps.some((c) => distLinha(c, x, y) < 6.5)) continue;
      ilCel += pg(hexagono(rng, x, y, 7));
      if (esp.tentar(x, y, 3)) ilNuc += pt(x + entre(rng, -0.7, 0.7), y + entre(rng, -0.7, 0.7));
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
        <path d={ductoParede} stroke="#ecc3d7" strokeWidth={11} strokeLinecap="round" fill="none" />
        <path d={ductoLuz} stroke="#fbf3f7" strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d={ductoNuc} stroke={HE.nucleo} strokeWidth={2.3} strokeLinecap="round" />
      </E>
      <E id="ilhota-de-langerhans">
        <path d={ilBorda} fill="#f3dbe7" stroke="#d6a6c2" strokeWidth={1.6} />
        <path d={ilCel} fill="#f0d0e0" stroke="#dcb1c8" strokeWidth={0.6} />
        <path d={ilCap} stroke="#e4b3cb" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ilCap} stroke={HE.luz} strokeWidth={5.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={ilHem} stroke={HE.hemacia} strokeWidth={4.4} strokeLinecap="round" />
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
  esofago: { desenhar: LaminaEsofago, partes: PARTES_ESOFAGO, areaDiagnostica: [200, 160, 800, 250] },
  // o campo precisa pegar as glândulas com células parietais, não só a base, a muscular da mucosa e a submucosa
  'estomago-fundo': { desenhar: LaminaEstomago, partes: PARTES_ESTOMAGO, areaDiagnostica: [200, 150, 800, 420] },
  // o campo precisa pegar as criptas (mucosa até y≈300), não só a submucosa e a muscular externa
  colon: { desenhar: LaminaColon, partes: PARTES_COLON, areaDiagnostica: [200, 150, 800, 230] },
  figado: { desenhar: LaminaFigado, partes: PARTES_FIGADO },
  // o campo precisa conter a ilhota grande (420, 330): sem ela, os ácinos lembram outra glândula serosa
  pancreas: { desenhar: LaminaPancreas, partes: PARTES_PANCREAS, areaDiagnostica: [360, 270, 480, 390] },
};
