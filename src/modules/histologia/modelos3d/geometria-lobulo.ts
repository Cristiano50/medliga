// Lóbulo hepático clássico (esquema fora de escala): geometria pura, sem React, testável.
// Plano horizontal (x, z) com ângulos medidos de +x para +z; o eixo do lóbulo (veia centrolobular e
// colunas dos espaços porta) fica ao longo de y. O modelo é uma fatia fina do prisma hexagonal.
//
// Placas: uma célula de espessura, radiais, em três zonas que se bifurcam (6 → 12 → 24), para que o
// espaço entre placas vizinhas não cresça demais da veia centrolobular até a periferia. A bifurcação
// começa onde a placa nova encosta, de lado, na última célula da placa-mãe (forquilha sem sobreposição).
// Sinusoides: troncos de cone entre as faces de duas placas vizinhas (raio limitado pelas faces), com o
// espaço de Disse como casca de mesma forma, um pouco maior. Tríades portais nos seis vértices.
import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export type Ponto2 = [number, number];
export type Ponto3 = [number, number, number];

export const LOBULO = {
  /** centro → vértice do hexágono */
  raioHex: 1.55,
  /** raio externo da veia centrolobular */
  raioVeia: 0.2,
  paredeVeia: 0.02,
  /** espessura tangencial da placa (uma célula) */
  espessura: 0.1,
  /** comprimento radial de um hepatócito */
  comprimento: 0.11,
  /** altura de um hepatócito (camada) */
  altura: 0.14,
  /** folga entre hepatócitos vizinhos (radial e entre camadas) */
  folga: 0.012,
  camadas: 2,
  /** espessura do espaço de Disse (casca em volta do sinusoide) */
  disse: 0.02,
  /** folga entre a casca de Disse e a face da placa */
  margem: 0.004,
  /** menor raio de luz de sinusoide admitido */
  luzMinima: 0.016,
  /** conjuntivo do espaço porta (coluna centrada no vértice) */
  raioPorta: 0.27,
  raioCanaliculo: 0.014,
  /** semieixos da célula de Kupffer (ao longo do sinusoide; transversais) */
  kupffer: [0.052, 0.032] as [number, number],
  /** altura das colunas (veias, espaço porta) acima e abaixo da fatia */
  alturaVasos: 0.62,
  alturaPorta: 0.52,
} as const;

/** Altura total da fatia (camadas de hepatócitos). */
export const ALTURA_FATIA = LOBULO.camadas * LOBULO.altura + (LOBULO.camadas - 1) * LOBULO.folga;

const GRAU = Math.PI / 180;
export const direcao = (a: number): Ponto2 => [Math.cos(a), Math.sin(a)];
/** Normal à esquerda da direção a (sentido de ângulo crescente). */
export const normal = (a: number): Ponto2 => [-Math.sin(a), Math.cos(a)];
const soma = (p: Ponto2, q: Ponto2, k = 1): Ponto2 => [p[0] + q[0] * k, p[1] + q[1] * k];
const escalar = (p: Ponto2, q: Ponto2) => p[0] * q[0] + p[1] * q[1];

export type Zona = 'A' | 'B' | 'C';

export interface Placa {
  indice: number;
  zona: Zona;
  /** direção radial da placa */
  angulo: number;
  /** placa de que esta se bifurca (zona A: nenhuma) */
  mae: number | null;
  /** segmentos radiais [início, fim] de cada hepatócito ao longo da placa (iguais em todas as camadas) */
  celulas: [number, number][];
}

export interface TrechoSinusoide {
  zona: Zona;
  /** eixo radial do trecho */
  angulo: number;
  /** meia abertura entre as placas que o limitam (as placas ficam em angulo ± meiaAbertura) */
  meiaAbertura: number;
  inicio: number;
  fim: number;
  /** raio da casca de Disse (externo) no início e no fim; a luz tem raio menor em LOBULO.disse */
  raioInicio: number;
  raioFim: number;
}

export interface Kupffer {
  centro: Ponto3;
  angulo: number;
  trecho: number;
}

export interface Vaso {
  centro: Ponto2;
  raioExterno: number;
  raioInterno: number;
}

export interface Triade {
  vertice: Ponto2;
  angulo: number;
  veia: Vaso;
  arteria: Vaso;
  ducto: Vaso;
}

export interface Segmento3 {
  a: Ponto3;
  b: Ponto3;
}

export interface GeometriaLobulo {
  vertices: Ponto2[];
  placas: Placa[];
  sinusoides: TrechoSinusoide[];
  kupffer: Kupffer[];
  canaliculos: Segmento3[];
  triades: Triade[];
}

// ------------------------------------------------------------------------------------------
// Polígonos no plano (para validação e testes)
// ------------------------------------------------------------------------------------------

/** Retângulo (pegada) de um hepatócito: [início, fim] ao longo da direção, espessura da placa de lado. */
export function cantosCelula(angulo: number, inicio: number, fim: number, espessura = LOBULO.espessura): Ponto2[] {
  const u = direcao(angulo);
  const n = normal(angulo);
  const h = espessura / 2;
  return [soma(soma([0, 0], u, inicio), n, -h), soma(soma([0, 0], u, fim), n, -h), soma(soma([0, 0], u, fim), n, h), soma(soma([0, 0], u, inicio), n, h)];
}

/** Pegada (trapézio) do tronco de cone de um trecho, com raio r(a) linear entre início e fim. */
export function pegadaTrecho(t: Pick<TrechoSinusoide, 'angulo' | 'inicio' | 'fim' | 'raioInicio' | 'raioFim'>): Ponto2[] {
  const u = direcao(t.angulo);
  const n = normal(t.angulo);
  const a0 = soma([0, 0], u, t.inicio);
  const a1 = soma([0, 0], u, t.fim);
  return [soma(a0, n, -t.raioInicio), soma(a1, n, -t.raioFim), soma(a1, n, t.raioFim), soma(a0, n, t.raioInicio)];
}

function eixosSeparacao(p: Ponto2[]): Ponto2[] {
  const eixos: Ponto2[] = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const e: Ponto2 = [-(b[1] - a[1]), b[0] - a[0]];
    const c = Math.hypot(e[0], e[1]);
    if (c > 1e-12) eixos.push([e[0] / c, e[1] / c]);
  }
  return eixos;
}

/** Interseção de polígonos convexos com área (SAT); toque de borda (até `tolerancia`) não conta. */
export function convexosSeCruzam(p: Ponto2[], q: Ponto2[], tolerancia = 1e-9): boolean {
  for (const eixo of [...eixosSeparacao(p), ...eixosSeparacao(q)]) {
    let pMin = Infinity, pMax = -Infinity, qMin = Infinity, qMax = -Infinity;
    for (const v of p) { const d = escalar(v, eixo); pMin = Math.min(pMin, d); pMax = Math.max(pMax, d); }
    for (const v of q) { const d = escalar(v, eixo); qMin = Math.min(qMin, d); qMax = Math.max(qMax, d); }
    if (pMax <= qMin + tolerancia || qMax <= pMin + tolerancia) return false;
  }
  return true;
}

function distanciaPontoSegmento(c: Ponto2, a: Ponto2, b: Ponto2): number {
  const ab: Ponto2 = [b[0] - a[0], b[1] - a[1]];
  const t = Math.max(0, Math.min(1, escalar([c[0] - a[0], c[1] - a[1]], ab) / Math.max(1e-12, escalar(ab, ab))));
  return Math.hypot(a[0] + ab[0] * t - c[0], a[1] + ab[1] * t - c[1]);
}

/** Ponto dentro de polígono convexo (anti-horário ou horário). */
export function dentroConvexo(c: Ponto2, p: Ponto2[]): boolean {
  let sinal = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const x = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (Math.abs(x) < 1e-12) continue;
    const s = Math.sign(x);
    if (sinal === 0) sinal = s;
    else if (s !== sinal) return false;
  }
  return true;
}

/** Distância de um ponto a um polígono convexo (0 se estiver dentro). */
export function distanciaPoligono(c: Ponto2, p: Ponto2[]): number {
  if (dentroConvexo(c, p)) return 0;
  let d = Infinity;
  for (let i = 0; i < p.length; i++) d = Math.min(d, distanciaPontoSegmento(c, p[i], p[(i + 1) % p.length]));
  return d;
}

export function verticesHexagono(raio: number = LOBULO.raioHex): Ponto2[] {
  return Array.from({ length: 6 }, (_, k) => direcao(k * 60 * GRAU).map((v) => v * raio) as Ponto2);
}

/** Dentro do hexágono com folga (as normais das arestas ficam em 30° + 60°k; apótema = R cos 30°). */
export function dentroHexagono(p: Ponto2, folga = 0, raio: number = LOBULO.raioHex): boolean {
  const apotema = raio * Math.cos(30 * GRAU);
  for (let k = 0; k < 6; k++) if (escalar(p, direcao((30 + 60 * k) * GRAU)) > apotema - folga + 1e-12) return false;
  return true;
}

// ------------------------------------------------------------------------------------------
// Construção
// ------------------------------------------------------------------------------------------

/** Início da placa bifurcada: a face encosta de lado na placa-mãe, com folga de 6 milésimos. */
const inicioBifurcacao = (meiaAbertura: number) => (LOBULO.espessura + 0.006) / Math.sin(meiaAbertura);

function triades(): Triade[] {
  // Posições no referencial do vértice: e_r (radial, para fora) e e_t (tangencial).
  const local = (v: Ponto2, ang: number, r: number, t: number): Ponto2 => soma(soma(v, direcao(ang), r), normal(ang), t);
  return verticesHexagono().map((v, k) => {
    const ang = k * 60 * GRAU;
    return {
      vertice: v,
      angulo: ang,
      veia: { centro: local(v, ang, 0, 0.085), raioExterno: 0.1, raioInterno: 0.088 },
      arteria: { centro: local(v, ang, 0.06, -0.11), raioExterno: 0.042, raioInterno: 0.018 },
      ducto: { centro: local(v, ang, -0.09, -0.08), raioExterno: 0.048, raioInterno: 0.026 },
    };
  });
}

/** O hepatócito cabe no lóbulo: dentro do hexágono e fora do conjuntivo dos espaços porta. */
function celulaCabe(angulo: number, inicio: number, fim: number, vertices: Ponto2[]): boolean {
  const cantos = cantosCelula(angulo, inicio, fim);
  if (!cantos.every((c) => dentroHexagono(c, 0.02))) return false;
  return vertices.every((v) => distanciaPoligono(v, cantos) >= LOBULO.raioPorta + 0.015);
}

function construirPlacas(vertices: Ponto2[]): Placa[] {
  const { comprimento: L, folga: g, raioVeia } = LOBULO;
  const passo = L + g;
  const placas: Placa[] = [];
  const serie = (inicio: number, n: number): [number, number][] => Array.from({ length: n }, (_, i) => [inicio + i * passo, inicio + i * passo + L]);
  // Zona A: 6 placas voltadas para os meios das arestas, encostadas na veia centrolobular.
  for (let k = 0; k < 6; k++) {
    placas.push({ indice: placas.length, zona: 'A', angulo: (30 + 60 * k) * GRAU, mae: null, celulas: serie(raioVeia + g, 2) });
  }
  // Zona B: cada placa A se bifurca em ±15°.
  const inicioB = inicioBifurcacao(15 * GRAU);
  for (const mae of placas.filter((p) => p.zona === 'A')) {
    for (const s of [-1, 1]) placas.push({ indice: placas.length, zona: 'B', angulo: mae.angulo + s * 15 * GRAU, mae: mae.indice, celulas: serie(inicioB, 4) });
  }
  // Zona C: cada placa B se bifurca em ±7,5°, até a periferia (hexágono e espaços porta).
  const inicioC = inicioBifurcacao(7.5 * GRAU);
  for (const mae of placas.filter((p) => p.zona === 'B')) {
    for (const s of [-1, 1]) {
      const angulo = mae.angulo + s * 7.5 * GRAU;
      const celulas: [number, number][] = [];
      for (let i = 0; i < 20; i++) {
        const [a, b] = [inicioC + i * passo, inicioC + i * passo + L];
        if (!celulaCabe(angulo, a, b, vertices)) break;
        celulas.push([a, b]);
      }
      placas.push({ indice: placas.length, zona: 'C', angulo, mae: mae.indice, celulas });
    }
  }
  return placas;
}

/** Raio máximo da casca de Disse: não sai da fatia de hepatócitos. */
export const RAIO_MAXIMO_TRECHO = ALTURA_FATIA / 2 - LOBULO.margem;

/** Raio da casca de Disse num trecho entre placas a ±meiaAbertura: limitado pelas faces das placas. */
export function raioDisse(a: number, meiaAbertura: number): number {
  return (a * Math.sin(meiaAbertura) - LOBULO.espessura / 2) / Math.cos(meiaAbertura) - LOBULO.margem;
}

function trecho(zona: Zona, angulo: number, meiaAbertura: number, inicio: number, fim: number): TrechoSinusoide {
  return { zona, angulo, meiaAbertura, inicio, fim, raioInicio: raioDisse(inicio, meiaAbertura), raioFim: raioDisse(fim, meiaAbertura) };
}

/**
 * Abre um trecho de sinusoide no eixo `angulo`, entre placas a ±meiaAbertura, a partir de `desde`:
 * avança o início até a luz ter o raio mínimo e a pegada não tocar hepatócito; depois estende o fim
 * (bissecção) até o maior comprimento em que a pegada não cruza hepatócito, não sai do hexágono e não
 * entra no conjuntivo do espaço porta.
 */
function abrirTrecho(zona: Zona, angulo: number, meiaAbertura: number, desde: number, obstaculos: Ponto2[][], vertices: Ponto2[]): TrechoSinusoide | null {
  const valido = (t: TrechoSinusoide) => {
    if (t.raioInicio < LOBULO.disse + LOBULO.luzMinima - 1e-9) return false;
    // A casca não passa da altura da fatia (o raio cresce com a distância ao centro).
    if (t.raioFim > RAIO_MAXIMO_TRECHO) return false;
    const p = pegadaTrecho(t);
    if (!p.every((c) => dentroHexagono(c, 0.01))) return false;
    for (const v of vertices) if (distanciaPoligono(v, p) < LOBULO.raioPorta - 0.002) return false;
    return obstaculos.every((o) => !convexosSeCruzam(p, o, 1e-6));
  };
  const raioMinimo = LOBULO.disse + LOBULO.luzMinima + LOBULO.margem;
  const inicioMinimo = (raioMinimo * Math.cos(meiaAbertura) + LOBULO.espessura / 2) / Math.sin(meiaAbertura);
  let inicio = Math.max(desde, inicioMinimo);
  let achou = false;
  for (let i = 0; i < 200; i++, inicio += 0.004) {
    if (valido(trecho(zona, angulo, meiaAbertura, inicio, inicio + 0.01))) { achou = true; break; }
  }
  if (!achou) return null;
  let ok: number = inicio + 0.01;
  let falha: number = LOBULO.raioHex;
  if (valido(trecho(zona, angulo, meiaAbertura, inicio, falha))) ok = falha;
  else {
    for (let i = 0; i < 40; i++) {
      const meio = (ok + falha) / 2;
      if (valido(trecho(zona, angulo, meiaAbertura, inicio, meio))) ok = meio;
      else falha = meio;
    }
  }
  return trecho(zona, angulo, meiaAbertura, inicio, ok);
}

function construirSinusoides(placas: Placa[], vertices: Ponto2[]): TrechoSinusoide[] {
  const obstaculos = placas.flatMap((p) => p.celulas.map(([a, b]) => cantosCelula(p.angulo, a, b)));
  const fimPlaca = (p: Placa) => p.celulas[p.celulas.length - 1][1];
  const trechos: TrechoSinusoide[] = [];
  const add = (t: TrechoSinusoide | null) => { if (t) trechos.push(t); return t; };
  const { raioVeia, disse, margem } = LOBULO;
  for (let k = 0; k < 6; k++) {
    // Eixo voltado para o vértice: da veia centrolobular até o espaço porta, estreitando a cada bifurcação.
    const vertice = k * 60 * GRAU;
    const a = add(abrirTrecho('A', vertice, 30 * GRAU, raioVeia + 0.002, obstaculos, vertices));
    const b = add(abrirTrecho('B', vertice, 15 * GRAU, a ? a.fim : raioVeia, obstaculos, vertices));
    add(abrirTrecho('C', vertice, 7.5 * GRAU, b ? b.fim : raioVeia, obstaculos, vertices));
    // Eixo da placa A (meio da aresta): nasce além do fim da placa A, entre as duas placas B.
    const meioAresta = (30 + 60 * k) * GRAU;
    const placaA = placas.find((p) => p.zona === 'A' && Math.abs(p.angulo - meioAresta) < 1e-9)!;
    const b2 = add(abrirTrecho('B', meioAresta, 15 * GRAU, fimPlaca(placaA) + disse + margem, obstaculos, vertices));
    add(abrirTrecho('C', meioAresta, 7.5 * GRAU, b2 ? b2.fim : fimPlaca(placaA), obstaculos, vertices));
  }
  // Eixos das placas B: nascem além do fim de cada placa B, entre as duas placas C.
  for (const p of placas.filter((x) => x.zona === 'B')) add(abrirTrecho('C', p.angulo, 7.5 * GRAU, fimPlaca(p) + disse + margem, obstaculos, vertices));
  return trechos;
}

function construirKupffer(trechos: TrechoSinusoide[]): Kupffer[] {
  const [ax, tr] = LOBULO.kupffer;
  const lista: Kupffer[] = [];
  trechos.forEach((t, i) => {
    if (t.fim - t.inicio < 2 * ax + 0.06) return;
    // Posição ao longo do trecho variada (sequência áurea), para não formar anéis regulares.
    const a = t.inicio + ax + 0.01 + ((i * 0.618034) % 1) * (t.fim - t.inicio - 2 * ax - 0.02);
    // Luz no trecho ocupado pela célula (o menor raio entre as duas pontas da célula).
    const raio = (x: number) => t.raioInicio + ((t.raioFim - t.raioInicio) * (x - t.inicio)) / (t.fim - t.inicio);
    const luz = Math.min(raio(a - ax), raio(a + ax)) - LOBULO.disse;
    if (luz < tr + 0.012) return;
    // Presa à parede (endotélio): centro deslocado do eixo até quase tocar a parede, alternando o lado.
    const lado = i % 2 ? 1 : -1;
    const beta = (lado * 50 * Math.PI) / 180;
    const desvio = luz - tr - 0.004;
    const u = direcao(t.angulo);
    const n = normal(t.angulo);
    const base = soma([0, 0], u, a);
    const xy = soma(base, n, desvio * Math.cos(beta));
    lista.push({ centro: [xy[0], desvio * Math.sin(beta), xy[1]], angulo: t.angulo, trecho: i });
  });
  return lista;
}

function construirCanaliculos(placas: Placa[]): Segmento3[] {
  const { camadas, altura, folga } = LOBULO;
  const meia = ALTURA_FATIA / 2;
  const segs: Segmento3[] = [];
  const ponto = (ang: number, r: number, y: number): Ponto3 => [Math.cos(ang) * r, y, Math.sin(ang) * r];
  for (const p of placas) {
    if (!p.celulas.length) continue;
    const ini = p.celulas[0][0];
    const fim = p.celulas[p.celulas.length - 1][1];
    // Entre as camadas: ao longo da placa, no plano médio.
    for (let c = 1; c < camadas; c++) {
      const y = -meia + c * altura + (c - 0.5) * folga;
      segs.push({ a: ponto(p.angulo, ini + 0.01, y), b: ponto(p.angulo, fim - 0.01, y) });
    }
    // Entre hepatócitos vizinhos da mesma placa: verticais, na folga radial.
    for (let i = 1; i < p.celulas.length; i++) {
      const r = (p.celulas[i - 1][1] + p.celulas[i][0]) / 2;
      segs.push({ a: ponto(p.angulo, r, -meia + 0.006), b: ponto(p.angulo, r, meia - 0.006) });
    }
  }
  return segs;
}

let cache: GeometriaLobulo | null = null;

/** Disposição do lóbulo (determinística; calculada uma vez). */
export function geometriaLobulo(): GeometriaLobulo {
  if (cache) return cache;
  const vertices = verticesHexagono();
  const placas = construirPlacas(vertices);
  const sinusoides = construirSinusoides(placas, vertices);
  cache = {
    vertices,
    placas,
    sinusoides,
    kupffer: construirKupffer(sinusoides),
    canaliculos: construirCanaliculos(placas),
    triades: triades(),
  };
  return cache;
}

/** Centros 3D dos hepatócitos (todas as camadas), com a direção da placa. */
export function hepatocitos(g = geometriaLobulo()): { centro: Ponto3; angulo: number; placa: number }[] {
  const { camadas, altura, folga } = LOBULO;
  const lista: { centro: Ponto3; angulo: number; placa: number }[] = [];
  for (const p of g.placas) {
    for (const [a, b] of p.celulas) {
      const r = (a + b) / 2;
      for (let c = 0; c < camadas; c++) {
        const y = -ALTURA_FATIA / 2 + altura / 2 + c * (altura + folga);
        lista.push({ centro: [Math.cos(p.angulo) * r, y, Math.sin(p.angulo) * r], angulo: p.angulo, placa: p.indice });
      }
    }
  }
  return lista;
}

// ------------------------------------------------------------------------------------------
// Geometrias (mescladas: uma chamada de desenho por parte; resolução pelo fator do nível)
// ------------------------------------------------------------------------------------------

const seg = (n: number, fator: number, minimo = 3) => Math.max(minimo, Math.round(n * fator));

/** Para mesclar: tudo sem índice e só com posição e normal. */
function preparar(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const n = g.index ? g.toNonIndexed() : g;
  if (n !== g) g.dispose();
  for (const nome of Object.keys(n.attributes)) if (nome !== 'position' && nome !== 'normal') n.deleteAttribute(nome);
  if (!n.getAttribute('normal')) n.computeVertexNormals();
  return n;
}

export function mesclar(partes: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const prontas = partes.map(preparar);
  const g = mergeGeometries(prontas, false) ?? new THREE.BufferGeometry();
  for (const p of prontas) p.dispose();
  g.computeBoundingSphere();
  return g;
}

/** Hepatócito poliédrico: caixa com os cantos truncados (faces planas). Eixos: x radial, y altura, z lateral. */
export function geometriaHepatocito(): THREE.BufferGeometry {
  const hx = LOBULO.comprimento / 2;
  const hy = LOBULO.altura / 2;
  const hz = LOBULO.espessura / 2;
  const c = 0.022;
  const pontos: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    pontos.push(new THREE.Vector3(sx * (hx - c), sy * hy, sz * hz));
    pontos.push(new THREE.Vector3(sx * hx, sy * (hy - c), sz * hz));
    pontos.push(new THREE.Vector3(sx * hx, sy * hy, sz * (hz - c)));
  }
  return new ConvexGeometry(pontos);
}

export function geometriaPlacas(g = geometriaLobulo()): THREE.BufferGeometry {
  const base = geometriaHepatocito();
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const eixoY = new THREE.Vector3(0, 1, 0);
  const um = new THREE.Vector3(1, 1, 1);
  const partes = hepatocitos(g).map(({ centro, angulo }) => {
    q.setFromAxisAngle(eixoY, -angulo); // +x local → direção da placa
    return base.clone().applyMatrix4(m.compose(new THREE.Vector3(...centro), q, um));
  });
  base.dispose();
  return mesclar(partes);
}

/** Matriz que leva o eixo +y de um cilindro para a direção radial `angulo`, com centro em `a` (ao longo). */
function matrizRadial(angulo: number, a: number, y = 0): THREE.Matrix4 {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(angulo), 0, Math.sin(angulo)));
  return new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(angulo) * a, y, Math.sin(angulo) * a), q, new THREE.Vector3(1, 1, 1));
}

/** Troncos de cone abertos dos trechos; `recuo` reduz o raio (0 = casca de Disse; LOBULO.disse = luz). */
export function geometriaTrechos(trechos: TrechoSinusoide[], recuo: number, fator = 1): THREE.BufferGeometry {
  const radiais = seg(18, fator);
  return mesclar(
    trechos.map((t) => {
      const c = new THREE.CylinderGeometry(t.raioFim - recuo, t.raioInicio - recuo, t.fim - t.inicio, radiais, 1, true);
      return c.applyMatrix4(matrizRadial(t.angulo, (t.inicio + t.fim) / 2));
    }),
  );
}

export function geometriaKupffer(g = geometriaLobulo(), fator = 1): THREE.BufferGeometry {
  const [ax, tr] = LOBULO.kupffer;
  const base = new THREE.SphereGeometry(1, seg(10, fator), seg(7, fator, 2));
  const partes = g.kupffer.map((k) => {
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -k.angulo);
    return base.clone().applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...k.centro), q, new THREE.Vector3(ax, tr * 0.85, tr)));
  });
  base.dispose();
  return mesclar(partes);
}

export function geometriaCanaliculos(g = geometriaLobulo(), fator = 1): THREE.BufferGeometry {
  const radiais = seg(6, fator);
  return mesclar(
    g.canaliculos.map(({ a, b }) => {
      const va = new THREE.Vector3(...a);
      const vb = new THREE.Vector3(...b);
      const d = vb.clone().sub(va);
      const c = new THREE.CylinderGeometry(LOBULO.raioCanaliculo, LOBULO.raioCanaliculo, d.length(), radiais, 1, false);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
      return c.applyMatrix4(new THREE.Matrix4().compose(va.add(vb).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
    }),
  );
}

/** Moldura hexagonal (limite imaginário do lóbulo), plana, no plano da forma; o componente a deita. */
export function geometriaMoldura(largura = 0.06, espessura = 0.018): THREE.ExtrudeGeometry {
  const meia = largura / 2 / Math.cos(30 * GRAU);
  const hex = (r: number) => verticesHexagono(r).map(([x, z]) => new THREE.Vector2(x, z));
  const forma = new THREE.Shape(hex(LOBULO.raioHex + meia));
  forma.holes.push(new THREE.Path(hex(LOBULO.raioHex - meia)));
  return new THREE.ExtrudeGeometry(forma, { depth: espessura, bevelEnabled: false });
}

/** Tubo de parede (veia, artéria, ducto): perfil retangular girado em torno de y, centrado na origem. */
export function geometriaTuboOco(raioInterno: number, raioExterno: number, altura: number, segmentos = 40): THREE.LatheGeometry {
  const h = altura / 2;
  const perfil = [
    new THREE.Vector2(raioInterno, -h),
    new THREE.Vector2(raioExterno, -h),
    new THREE.Vector2(raioExterno, h),
    new THREE.Vector2(raioInterno, h),
    new THREE.Vector2(raioInterno, -h),
  ];
  return new THREE.LatheGeometry(perfil, segmentos);
}
