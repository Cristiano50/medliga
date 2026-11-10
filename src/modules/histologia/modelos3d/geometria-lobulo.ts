// Lóbulo hepático clássico (esquema fora de escala): geometria pura, sem React, testável.
// Plano horizontal (x, z) com ângulos medidos de +x para +z; o eixo do lóbulo (veia centrolobular e
// colunas dos espaços porta) fica ao longo de y. O modelo é uma fatia fina do prisma hexagonal.
//
// Placas: uma célula de espessura, radiais, em três zonas que se bifurcam (6 → 12 → 24). A bifurcação
// começa onde a placa nova encosta, de lado, na última célula da placa-mãe (forquilha sem sobreposição);
// logo depois da forquilha, cada placa nova tem uma passagem (falta uma célula), por onde os sinusoides
// dos dois lados se comunicam.
// Sinusoides: rede de tubos de calibre quase constante, no plano médio da fatia. Em cada vão entre placas,
// uma haste no eixo do vão; onde o vão alarga, dois tubos, um junto de cada placa, unidos por uma ponte;
// passagens atravessam as placas. Dos seis eixos voltados para os vértices, um tronco desemboca na veia
// centrolobular por um orifício da parede; na periferia, as pontas dos tubos recebem as entradas dos ramos
// terminais da veia porta e da artéria hepática, que saem dos espaços porta e correm pelas arestas do hexágono.
// Canalículos: só entre hepatócitos vizinhos (entre camadas e entre células consecutivas da placa); um canal
// de Hering por espaço porta liga a ponta de uma placa ao ducto biliar.
import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export type Ponto2 = [number, number];
export type Ponto3 = [number, number, number];

const GRAU = Math.PI / 180;

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
  /** raio da luz dos sinusoides (calibre quase constante) e do tronco que desemboca na veia */
  luz: 0.042,
  luzTronco: 0.05,
  /** folga entre o tubo "junto da placa" e a face da placa */
  folgaParede: 0.012,
  /** espessura do espaço de Disse (casca em volta do sinusoide) */
  disse: 0.016,
  /** folga mínima entre um tubo e um hepatócito */
  margem: 0.003,
  /** orifício da parede da veia centrolobular por onde entra cada tronco */
  raioOrificio: 0.058,
  /** conjuntivo do espaço porta (coluna centrada no vértice) */
  raioPorta: 0.27,
  raioCanaliculo: 0.012,
  /** canal de Hering: mais calibroso que o canalículo */
  raioHering: 0.02,
  /** recuo das pontas dos canalículos em relação à ponta da placa (maior que o chanfro do hepatócito) */
  recuoCanaliculo: 0.035,
  /** semieixos da célula de Kupffer (ao longo do sinusoide; transversais) */
  kupffer: [0.045, 0.024] as [number, number],
  /** altura das colunas (veias, espaço porta) acima e abaixo da fatia */
  alturaVasos: 0.62,
  alturaPorta: 0.52,
  /** ramos terminais (vênula portal e arteríola) e suas entradas nos sinusoides: raios e alturas (y) */
  ramoPorta: 0.02,
  ramoArteria: 0.011,
  entradaPorta: 0.015,
  entradaArteria: 0.009,
  alturaRamoPorta: 0.045,
  alturaRamoArteria: -0.045,
  /** os ramos terminais correm por fora da aresta do hexágono, a esta distância */
  afastamentoRamo: 0.014,
  /** setor (ângulos das placas) coberto por uma terceira camada de hepatócitos, translúcida */
  setorTranslucido: [60 * GRAU, 120 * GRAU] as [number, number],
  raioNucleo: 0.03,
} as const;

/** Altura total da fatia (camadas de hepatócitos). */
export const ALTURA_FATIA = LOBULO.camadas * LOBULO.altura + (LOBULO.camadas - 1) * LOBULO.folga;

export const direcao = (a: number): Ponto2 => [Math.cos(a), Math.sin(a)];
/** Normal à esquerda da direção a (sentido de ângulo crescente). */
export const normal = (a: number): Ponto2 => [-Math.sin(a), Math.cos(a)];
const soma = (p: Ponto2, q: Ponto2, k = 1): Ponto2 => [p[0] + q[0] * k, p[1] + q[1] * k];
const escalar = (p: Ponto2, q: Ponto2) => p[0] * q[0] + p[1] * q[1];
/** Ponto a `a` do centro ao longo do eixo `angulo`, com desvio lateral `lado` (para a esquerda) e altura y. */
export const pontoAxial = (angulo: number, a: number, lado = 0, y = 0): Ponto3 => [a * Math.cos(angulo) - lado * Math.sin(angulo), y, a * Math.sin(angulo) + lado * Math.cos(angulo)];
const plano = (p: Ponto3): Ponto2 => [p[0], p[2]];

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
  /** centro (distância ao longo da placa) da passagem deixada logo depois da forquilha; só numa das duas
   *  placas de cada forquilha */
  passagem: number | null;
}

export type TipoTubo = 'tronco' | 'haste' | 'par' | 'ponte' | 'passagem';

/** Trecho reto de sinusoide (luz), no plano médio da fatia. */
export interface Tubo {
  a: Ponto3;
  b: Ponto3;
  raio: number;
  tipo: TipoTubo;
}

/** Tubo fino com extremos em 3D (ramos terminais, entradas, canal de Hering). */
export interface Segmento3 {
  a: Ponto3;
  b: Ponto3;
}

export interface Kupffer {
  centro: Ponto3;
  /** direção do sinusoide em que está */
  angulo: number;
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

export interface RamosTerminais {
  /** ramos que saem do vaso do espaço porta e correm pela aresta do hexágono */
  ramos: Segmento3[];
  /** entradas curtas, do ramo até a ponta de um sinusoide */
  entradas: Segmento3[];
}

export interface GeometriaLobulo {
  vertices: Ponto2[];
  placas: Placa[];
  sinusoides: Tubo[];
  /** pontas periféricas dos sinusoides (onde entram os ramos terminais) */
  pontas: Ponto3[];
  /** ângulos dos orifícios da parede da veia centrolobular */
  orificios: number[];
  /** cascas do espaço de Disse: trechos de haste, com o raio externo da casca */
  mangas: Tubo[];
  kupffer: Kupffer[];
  canaliculos: Segmento3[];
  /** canais de Hering: da ponta de um canalículo ao ducto biliar do espaço porta */
  hering: Segmento3[];
  triades: Triade[];
  porta: RamosTerminais;
  arteria: RamosTerminais;
}

// ------------------------------------------------------------------------------------------
// Polígonos no plano (para validação e testes)
// ------------------------------------------------------------------------------------------

/** Retângulo (pegada) de um hepatócito: [início, fim] ao longo da direção, espessura da placa de lado. */
export function cantosCelula(angulo: number, inicio: number, fim: number, espessura: number = LOBULO.espessura): Ponto2[] {
  const u = direcao(angulo);
  const n = normal(angulo);
  const h = espessura / 2;
  return [soma(soma([0, 0], u, inicio), n, -h), soma(soma([0, 0], u, fim), n, -h), soma(soma([0, 0], u, fim), n, h), soma(soma([0, 0], u, inicio), n, h)];
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

export function distanciaPontoSegmento(c: Ponto2, a: Ponto2, b: Ponto2): number {
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

function segmentosSeCruzam(a: Ponto2, b: Ponto2, c: Ponto2, d: Ponto2): boolean {
  const lado = (p: Ponto2, q: Ponto2, r: Ponto2) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return lado(a, b, c) !== lado(a, b, d) && lado(c, d, a) !== lado(c, d, b);
}

/** Distância de um segmento a um polígono convexo (0 se o cruzar ou estiver dentro). */
export function distanciaSegmentoPoligono(a: Ponto2, b: Ponto2, p: Ponto2[]): number {
  if (dentroConvexo(a, p) || dentroConvexo(b, p)) return 0;
  let d = Infinity;
  for (let i = 0; i < p.length; i++) {
    const [c, e] = [p[i], p[(i + 1) % p.length]];
    if (segmentosSeCruzam(a, b, c, e)) return 0;
    d = Math.min(d, distanciaPontoSegmento(c, a, b), distanciaPontoSegmento(a, c, e), distanciaPontoSegmento(b, c, e));
  }
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
  // Posições no referencial do vértice: e_r (radial, para fora) e e_t (tangencial). A arteríola fica no eixo,
  // do lado do lóbulo, e a veia do lado de fora, para os ramos terminais saírem para as duas arestas vizinhas
  // sem atravessar os outros dois elementos; o ducto fica do lado da placa que recebe o canal de Hering.
  const local = (v: Ponto2, ang: number, r: number, t: number): Ponto2 => soma(soma(v, direcao(ang), r), normal(ang), t);
  return verticesHexagono().map((v, k) => {
    const ang = k * 60 * GRAU;
    return {
      vertice: v,
      angulo: ang,
      veia: { centro: local(v, ang, 0.07, 0.06), raioExterno: 0.1, raioInterno: 0.088 },
      arteria: { centro: local(v, ang, -0.15, 0), raioExterno: 0.042, raioInterno: 0.018 },
      ducto: { centro: local(v, ang, 0.02, -0.175), raioExterno: 0.048, raioInterno: 0.026 },
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
  const celula = (inicio: number, i: number): [number, number] => [inicio + i * passo, inicio + i * passo + L];
  /** Passagem: a segunda posição (índice 1), logo depois da célula da forquilha, fica vazia. */
  const centroPassagem = (inicio: number) => inicio + passo + L / 2;
  // Zona A: 6 placas voltadas para os meios das arestas, encostadas na veia centrolobular.
  for (let k = 0; k < 6; k++) {
    placas.push({ indice: placas.length, zona: 'A', angulo: (30 + 60 * k) * GRAU, mae: null, celulas: [0, 1].map((i) => celula(raioVeia + g, i)), passagem: null });
  }
  // Zona B: cada placa A se bifurca em ±15°.
  const inicioB = inicioBifurcacao(15 * GRAU);
  // Em cada forquilha, só a placa do lado de ângulo crescente tem passagem: cada vão novo fica ligado a um
  // vizinho, e as passagens não formam anéis em volta da veia.
  for (const mae of placas.filter((p) => p.zona === 'A')) {
    for (const s of [-1, 1]) {
      placas.push({ indice: placas.length, zona: 'B', angulo: mae.angulo + s * 15 * GRAU, mae: mae.indice, celulas: (s > 0 ? [0, 2, 3] : [0, 1, 2, 3]).map((i) => celula(inicioB, i)), passagem: s > 0 ? centroPassagem(inicioB) : null });
    }
  }
  // Zona C: cada placa B se bifurca em ±7,5°, até a periferia (hexágono e espaços porta).
  const inicioC = inicioBifurcacao(7.5 * GRAU);
  for (const mae of placas.filter((p) => p.zona === 'B')) {
    for (const s of [-1, 1]) {
      const angulo = mae.angulo + s * 7.5 * GRAU;
      const celulas: [number, number][] = [celula(inicioC, 0)];
      for (let i = s > 0 ? 2 : 1; i < 20; i++) {
        const [a, b] = celula(inicioC, i);
        if (!celulaCabe(angulo, a, b, vertices)) break;
        celulas.push([a, b]);
      }
      placas.push({ indice: placas.length, zona: 'C', angulo, mae: mae.indice, celulas, passagem: s > 0 ? centroPassagem(inicioC) : null });
    }
  }
  return placas;
}

/** Trechos contínuos de uma placa (células consecutivas, sem passagem entre elas). */
export function fragmentos(p: Placa): [number, number][][] {
  const lista: [number, number][][] = [];
  for (const c of p.celulas) {
    const ultimo = lista[lista.length - 1];
    if (ultimo && c[0] - ultimo[ultimo.length - 1][1] <= LOBULO.folga + 1e-9) ultimo.push(c);
    else lista.push([c]);
  }
  return lista;
}

/** Desvio lateral do tubo "junto da placa" num vão de meia abertura Δ, à distância a do centro. */
export function desvioJuntoDaPlaca(a: number, meiaAbertura: number): number {
  return (a * Math.sin(meiaAbertura) - LOBULO.espessura / 2) / Math.cos(meiaAbertura) - (LOBULO.luz + LOBULO.folgaParede);
}

/** Estações (distância ao centro) da rede de sinusoides ao longo dos eixos dos vãos. */
export function estacoesSinusoides(placas: Placa[] = geometriaLobulo().placas) {
  const B = placas.find((p) => p.zona === 'B' && p.passagem !== null)!;
  const C = placas.find((p) => p.zona === 'C' && p.passagem !== null)!;
  return {
    /** o tronco entra na veia (dentro da luz) e vai até aqui */
    inicioTronco: LOBULO.raioVeia - LOBULO.paredeVeia - 0.015,
    fimTronco: 0.36,
    /** nó da zona B: onde chegam as passagens das placas B (no eixo de cada vão) */
    noB: B.passagem! / Math.cos(15 * GRAU),
    /** losango da zona B: os dois tubos junto das placas, de `parB[0]` a `parB[1]`, reunidos em `uniaoB` */
    parB: [0.675, 0.73] as [number, number],
    uniaoB: 0.775,
    /** nó da zona C: onde chegam as passagens das placas C */
    noC: C.passagem! / Math.cos(7.5 * GRAU),
    /** a haste da zona C se divide aqui em dois tubos, que seguem até a periferia */
    divisaoC: 1.135,
    inicioParC: 1.17,
  };
}

interface RedeSinusoides {
  tubos: Tubo[];
  pontas: Ponto3[];
  orificios: number[];
  mangas: Tubo[];
  kupffer: Kupffer[];
}

function construirSinusoides(placas: Placa[], vertices: Ponto2[]): RedeSinusoides {
  const { luz, luzTronco, disse, raioPorta } = LOBULO;
  const e = estacoesSinusoides(placas);
  const tubos: Tubo[] = [];
  const pontas: Ponto3[] = [];
  const mangas: Tubo[] = [];
  const kupffer: Kupffer[] = [];
  const orificios: number[] = [];
  const tubo = (a: Ponto3, b: Ponto3, tipo: TipoTubo, raio: number = luz) => tubos.push({ a, b, raio, tipo });
  const haste = (eixo: number, a0: number, a1: number) => tubo(pontoAxial(eixo, a0), pontoAxial(eixo, a1), 'haste');
  const manga = (eixo: number, a0: number, a1: number, raio: number = luz) => mangas.push({ a: pontoAxial(eixo, a0), b: pontoAxial(eixo, a1), raio: raio + disse, tipo: 'haste' });
  const macrofago = (eixo: number, a: number) => kupffer.push({ centro: pontoAxial(eixo, a, 0, luz - LOBULO.kupffer[1] - 0.003), angulo: eixo });

  /** Losango da zona B: do nó, dois tubos abrem para junto das placas, correm paralelos a elas e se reúnem. */
  const losangoB = (eixo: number) => {
    const D = 15 * GRAU;
    const [d, f] = e.parB;
    const meio = (d + f) / 2;
    for (const s of [-1, 1]) {
      tubo(pontoAxial(eixo, e.noB), pontoAxial(eixo, d, s * desvioJuntoDaPlaca(d, D)), 'par');
      tubo(pontoAxial(eixo, d, s * desvioJuntoDaPlaca(d, D)), pontoAxial(eixo, meio, s * desvioJuntoDaPlaca(meio, D)), 'par');
      tubo(pontoAxial(eixo, meio, s * desvioJuntoDaPlaca(meio, D)), pontoAxial(eixo, f, s * desvioJuntoDaPlaca(f, D)), 'par');
      tubo(pontoAxial(eixo, f, s * desvioJuntoDaPlaca(f, D)), pontoAxial(eixo, e.uniaoB), 'par');
    }
    tubo(pontoAxial(eixo, meio, -desvioJuntoDaPlaca(meio, D)), pontoAxial(eixo, meio, desvioJuntoDaPlaca(meio, D)), 'ponte');
  };

  /** Fim dos dois tubos da zona C num eixo: a maior distância em que as duas pontas ficam no lóbulo. */
  const fimParC = (eixo: number): number => {
    const D = 7.5 * GRAU;
    for (let a = LOBULO.raioHex; a > e.inicioParC; a -= 0.002) {
      const ok = [-1, 1].every((s) => {
        const p = plano(pontoAxial(eixo, a, s * desvioJuntoDaPlaca(a, D)));
        return dentroHexagono(p, 0.03) && vertices.every((v) => Math.hypot(p[0] - v[0], p[1] - v[1]) >= raioPorta + 0.006);
      });
      if (ok) return a;
    }
    return e.inicioParC + 0.02;
  };

  /** Zona C de um eixo: haste a partir de `inicio` (passando pelo nó C), divisão em dois tubos até a periferia. */
  const zonaC = (eixo: number, inicio: number) => {
    const D = 7.5 * GRAU;
    if (inicio < e.noC) haste(eixo, inicio, e.noC);
    haste(eixo, e.noC, e.divisaoC);
    manga(eixo, 1.02, 1.115);
    const fim = fimParC(eixo);
    const meio = (e.inicioParC + fim) / 2;
    for (const s of [-1, 1]) {
      tubo(pontoAxial(eixo, e.divisaoC), pontoAxial(eixo, e.inicioParC, s * desvioJuntoDaPlaca(e.inicioParC, D)), 'par');
      tubo(pontoAxial(eixo, e.inicioParC, s * desvioJuntoDaPlaca(e.inicioParC, D)), pontoAxial(eixo, meio, s * desvioJuntoDaPlaca(meio, D)), 'par');
      tubo(pontoAxial(eixo, meio, s * desvioJuntoDaPlaca(meio, D)), pontoAxial(eixo, fim, s * desvioJuntoDaPlaca(fim, D)), 'par');
      pontas.push(pontoAxial(eixo, fim, s * desvioJuntoDaPlaca(fim, D)));
    }
    tubo(pontoAxial(eixo, meio, -desvioJuntoDaPlaca(meio, D)), pontoAxial(eixo, meio, desvioJuntoDaPlaca(meio, D)), 'ponte');
  };

  for (let k = 0; k < 6; k++) {
    // Eixo voltado para o vértice: do espaço porta até a veia centrolobular.
    const vertice = k * 60 * GRAU;
    orificios.push(vertice);
    tubo(pontoAxial(vertice, e.inicioTronco), pontoAxial(vertice, e.fimTronco), 'tronco', luzTronco);
    manga(vertice, 0.25, 0.34, luzTronco);
    haste(vertice, e.fimTronco, e.noB);
    macrofago(vertice, 0.41);
    manga(vertice, 0.46, 0.55);
    losangoB(vertice);
    zonaC(vertice, e.uniaoB);
    macrofago(vertice, 0.87);
    // Eixo da placa A (meio da aresta): o vão nasce entre as duas placas B e se liga aos vizinhos pelas passagens.
    const meioAresta = (30 + 60 * k) * GRAU;
    losangoB(meioAresta);
    zonaC(meioAresta, e.uniaoB);
    macrofago(meioAresta, 0.87);
  }
  // Eixos das placas B: o vão nasce entre as duas placas C, no nó das passagens.
  for (const p of placas.filter((x) => x.zona === 'B')) zonaC(p.angulo, e.noC);
  // Passagens: atravessam cada placa B ou C pela falta de uma célula e ligam os nós dos dois vãos vizinhos.
  for (const p of placas) {
    if (p.passagem === null) continue;
    const D = (p.zona === 'B' ? 15 : 7.5) * GRAU;
    const a = p.passagem / Math.cos(D);
    tubo(pontoAxial(p.angulo - D, a), pontoAxial(p.angulo + D, a), 'passagem');
  }
  return { tubos, pontas, orificios, mangas, kupffer };
}

/** Alturas (y) das faces de contato entre camadas de hepatócitos (onde correm os canalículos horizontais). */
export function alturasCanaliculos(): number[] {
  const { camadas, altura, folga } = LOBULO;
  return Array.from({ length: camadas - 1 }, (_, i) => -ALTURA_FATIA / 2 + (i + 1) * altura + (i + 0.5) * folga);
}

/** A placa tem a terceira camada (translúcida) de hepatócitos? */
export function noSetorTranslucido(p: Placa): boolean {
  const [a, b] = LOBULO.setorTranslucido;
  return p.angulo > a + 1e-6 && p.angulo < b - 1e-6;
}

/** Altura (y) da face de contato entre a segunda camada e a terceira, translúcida. */
export const ALTURA_CANALICULO_SETOR = ALTURA_FATIA / 2 + LOBULO.folga / 2;
/** Topo da terceira camada. */
export const TOPO_TERCEIRA_CAMADA = ALTURA_FATIA / 2 + LOBULO.folga + LOBULO.altura;

/**
 * Rede de canalículos, só entre hepatócitos vizinhos, no plano médio de cada placa: trechos horizontais em
 * cada face de contato entre camadas (e, no setor translúcido, entre a segunda e a terceira) e trechos
 * verticais entre células consecutivas da placa. As pontas recuam da ponta da placa.
 */
function construirCanaliculos(placas: Placa[]): Segmento3[] {
  const meia = ALTURA_FATIA / 2;
  const recuo = LOBULO.recuoCanaliculo;
  const segs: Segmento3[] = [];
  for (const p of placas) {
    const setor = noSetorTranslucido(p);
    const alturas = setor ? [...alturasCanaliculos(), ALTURA_CANALICULO_SETOR] : alturasCanaliculos();
    for (const f of fragmentos(p)) {
      const [ini, fim] = [f[0][0] + recuo, f[f.length - 1][1] - recuo];
      for (const y of alturas) segs.push({ a: pontoAxial(p.angulo, ini, 0, y), b: pontoAxial(p.angulo, fim, 0, y) });
      for (let i = 1; i < f.length; i++) {
        const r = (f[i - 1][1] + f[i][0]) / 2;
        segs.push({ a: pontoAxial(p.angulo, r, 0, -meia), b: pontoAxial(p.angulo, r, 0, setor ? TOPO_TERCEIRA_CAMADA : meia) });
      }
    }
  }
  return segs;
}

/** Canal de Hering de cada espaço porta: da ponta periférica do canalículo da placa vizinha até o ducto biliar. */
function construirHering(placas: Placa[], tr: Triade[]): Segmento3[] {
  const y = alturasCanaliculos()[0];
  return tr.map((t) => {
    const alvo = t.angulo - 7.5 * GRAU;
    const placa = placas.find((p) => p.zona === 'C' && Math.abs(Math.atan2(Math.sin(p.angulo - alvo), Math.cos(p.angulo - alvo))) < 1e-6)!;
    const fim = placa.celulas[placa.celulas.length - 1][1] - LOBULO.recuoCanaliculo;
    return { a: pontoAxial(placa.angulo, fim, 0, y), b: [t.ducto.centro[0], y, t.ducto.centro[1]] as Ponto3 };
  });
}

/**
 * Ramos terminais de um vaso do espaço porta: de cada tríade, um ramo para cada aresta vizinha, por fora da
 * aresta, até perto do meio dela; e uma entrada curta do ramo até cada ponta de sinusoide da sua metade da aresta.
 */
function construirRamos(tr: Triade[], pontas: Ponto3[], qual: 'veia' | 'arteria', y: number): RamosTerminais {
  const R = LOBULO.raioHex;
  const ramos: Segmento3[] = [];
  const entradas: Segmento3[] = [];
  const dentro = 0.2;
  const ate = R / 2 - 0.02;
  tr.forEach((t, k) => {
    for (const s of [-1, 1]) {
      const aresta = direcao((k * 60 + s * 120) * GRAU);
      const fora = direcao((k * 60 + s * 30) * GRAU);
      const linha = (d: number): Ponto3 => {
        const p = soma(soma(t.vertice, aresta, d), fora, LOBULO.afastamentoRamo);
        return [p[0], y, p[1]];
      };
      const c = t[qual].centro;
      ramos.push({ a: [c[0], y, c[1]], b: linha(dentro) }, { a: linha(dentro), b: linha(ate) });
      for (const p of pontas) {
        const ang = Math.atan2(p[2], p[0]);
        const dif = Math.atan2(Math.sin(ang - t.angulo), Math.cos(ang - t.angulo));
        // pontas do meio setor (30°) desta tríade, do lado desta aresta
        if (Math.abs(dif) > 30 * GRAU || Math.sign(dif) !== s) continue;
        const ao = Math.max(dentro, Math.min(ate, escalar([p[0] - t.vertice[0], p[2] - t.vertice[1]], aresta)));
        entradas.push({ a: linha(ao), b: [p[0], Math.sign(y) * 0.014, p[2]] });
      }
    }
  });
  return { ramos, entradas };
}

let cache: GeometriaLobulo | null = null;

/** Disposição do lóbulo (determinística; calculada uma vez). */
export function geometriaLobulo(): GeometriaLobulo {
  if (cache) return cache;
  const vertices = verticesHexagono();
  const placas = construirPlacas(vertices);
  const rede = construirSinusoides(placas, vertices);
  const tr = triades();
  cache = {
    vertices,
    placas,
    sinusoides: rede.tubos,
    pontas: rede.pontas,
    orificios: rede.orificios,
    mangas: rede.mangas,
    kupffer: rede.kupffer,
    canaliculos: construirCanaliculos(placas),
    hering: construirHering(placas, tr),
    triades: tr,
    porta: construirRamos(tr, rede.pontas, 'veia', LOBULO.alturaRamoPorta),
    arteria: construirRamos(tr, rede.pontas, 'arteria', LOBULO.alturaRamoArteria),
  };
  return cache;
}

export interface Hepatocito {
  centro: Ponto3;
  angulo: number;
  placa: number;
}

/** Centros 3D dos hepatócitos das camadas da fatia, com a direção da placa. */
export function hepatocitos(g = geometriaLobulo()): Hepatocito[] {
  const { camadas, altura, folga } = LOBULO;
  const lista: Hepatocito[] = [];
  for (const p of g.placas) {
    for (const [a, b] of p.celulas) {
      for (let c = 0; c < camadas; c++) {
        lista.push({ centro: pontoAxial(p.angulo, (a + b) / 2, 0, -ALTURA_FATIA / 2 + altura / 2 + c * (altura + folga)), angulo: p.angulo, placa: p.indice });
      }
    }
  }
  return lista;
}

/** Hepatócitos da terceira camada (translúcida), só nas placas do setor da frente. */
export function hepatocitosTranslucidos(g = geometriaLobulo()): Hepatocito[] {
  const y = ALTURA_FATIA / 2 + LOBULO.folga + LOBULO.altura / 2;
  return g.placas.filter(noSetorTranslucido).flatMap((p) => p.celulas.map(([a, b]) => ({ centro: pontoAxial(p.angulo, (a + b) / 2, 0, y), angulo: p.angulo, placa: p.indice })));
}

/** Núcleos das células translúcidas: um por célula; duas células binucleadas. */
export function nucleosTranslucidos(g = geometriaLobulo()): Ponto3[] {
  return hepatocitosTranslucidos(g).flatMap((h, i) => {
    if (i % 9 !== 4) return [h.centro];
    const d = 0.024;
    return [-1, 1].map((s) => [h.centro[0] + s * d * Math.cos(h.angulo), h.centro[1], h.centro[2] + s * d * Math.sin(h.angulo)] as Ponto3);
  });
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
  const g = (prontas.length ? mergeGeometries(prontas, false) : null) ?? new THREE.BufferGeometry();
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

function geometriaCelulas(lista: Hepatocito[]): THREE.BufferGeometry[] {
  const base = geometriaHepatocito();
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const eixoY = new THREE.Vector3(0, 1, 0);
  const um = new THREE.Vector3(1, 1, 1);
  const partes = lista.map(({ centro, angulo }) => {
    q.setFromAxisAngle(eixoY, -angulo); // +x local → direção da placa
    return base.clone().applyMatrix4(m.compose(new THREE.Vector3(...centro), q, um));
  });
  base.dispose();
  return partes;
}

export function geometriaPlacas(g = geometriaLobulo()): THREE.BufferGeometry {
  return mesclar(geometriaCelulas(hepatocitos(g)));
}

/** Terceira camada (translúcida) do setor da frente, com os núcleos dentro das células. */
export function geometriaPlacasTranslucidas(g = geometriaLobulo(), fator = 1): THREE.BufferGeometry {
  const nucleo = new THREE.SphereGeometry(LOBULO.raioNucleo, seg(10, fator), seg(7, fator, 2));
  const nucleos = nucleosTranslucidos(g).map((p) => nucleo.clone().translate(...p));
  nucleo.dispose();
  return mesclar([...geometriaCelulas(hepatocitosTranslucidos(g)), ...nucleos]);
}

const Y = new THREE.Vector3(0, 1, 0);
const UM = new THREE.Vector3(1, 1, 1);

/** Cilindro de `a` a `b` (eixo +y da geometria levado para a direção do segmento). */
function cilindroEntre(a: Ponto3, b: Ponto3, raio: number, radiais: number, aberto: boolean, aneis = 1): THREE.BufferGeometry {
  const va = new THREE.Vector3(...a);
  const d = new THREE.Vector3(...b).sub(va);
  const comprimento = d.length();
  const c = new THREE.CylinderGeometry(raio, raio, comprimento, radiais, aneis, aberto);
  const q = new THREE.Quaternion().setFromUnitVectors(Y, d.clone().normalize());
  return c.applyMatrix4(new THREE.Matrix4().compose(va.addScaledVector(d, 0.5), q, UM));
}

/** Tubos abertos de uma lista de trechos; `acrescimo` soma ao raio (0 = luz). */
export function geometriaTubos(tubos: Tubo[], fator = 1, acrescimo = 0): THREE.BufferGeometry {
  const radiais = seg(10, fator);
  return mesclar(tubos.map((t) => cilindroEntre(t.a, t.b, t.raio + acrescimo, radiais, true)));
}

/** Tubos finos fechados (ramos terminais, entradas, canalículos, canal de Hering). */
export function geometriaSegmentos(segmentos: Segmento3[], raio: number, fator = 1, radiaisBase = 6, aneis = 1): THREE.BufferGeometry {
  const radiais = seg(radiaisBase, fator);
  return mesclar(segmentos.filter((s) => Math.hypot(s.a[0] - s.b[0], s.a[1] - s.b[1], s.a[2] - s.b[2]) > 1e-6).map((s) => cilindroEntre(s.a, s.b, raio, radiais, false, aneis)));
}

export function geometriaKupffer(g = geometriaLobulo(), fator = 1): THREE.BufferGeometry {
  const [ax, tr] = LOBULO.kupffer;
  const base = new THREE.SphereGeometry(1, seg(8, fator), seg(6, fator, 2));
  const partes = g.kupffer.map((k) => {
    const q = new THREE.Quaternion().setFromAxisAngle(Y, -k.angulo);
    return base.clone().applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...k.centro), q, new THREE.Vector3(ax, tr, tr)));
  });
  base.dispose();
  return mesclar(partes);
}

/** Canalículos e canais de Hering (um pouco mais calibrosos), numa malha só. */
export function geometriaCanaliculos(g = geometriaLobulo(), fator = 1): THREE.BufferGeometry {
  const a = geometriaSegmentos(g.canaliculos, LOBULO.raioCanaliculo, fator);
  const b = geometriaSegmentos(g.hering, LOBULO.raioHering, fator, 8, 2);
  return mesclar([a, b]);
}

/** Ramos terminais e entradas de um vaso do espaço porta, numa malha só. */
export function geometriaRamos(r: RamosTerminais, raioRamo: number, raioEntrada: number, fator = 1): THREE.BufferGeometry {
  return mesclar([geometriaSegmentos(r.ramos, raioRamo, fator, 8), geometriaSegmentos(r.entradas, raioEntrada, fator)]);
}

/**
 * Parede da veia centrolobular, com um orifício redondo em cada eixo por onde desemboca um tronco de
 * sinusoides. Colunas verticais em volta do eixo y; nas colunas que passam por um orifício, a parede fica em
 * dois pedaços (abaixo e acima da abertura). Faces externa e interna, bordas de cima e de baixo e o contorno
 * de cada orifício.
 */
export function geometriaVeiaCentral(fator = 1): THREE.BufferGeometry {
  const { raioVeia: re, paredeVeia, alturaVasos, raioOrificio: ro } = LOBULO;
  const ri = re - paredeVeia;
  const h = alturaVasos / 2;
  const meioAngulo = ro / re; // meia largura angular do orifício na face externa
  const orificios = geometriaLobulo().orificios;
  const pos: number[] = [];
  const nor: number[] = [];
  const v = (r: number, ang: number, y: number, n: [number, number, number]) => { pos.push(r * Math.cos(ang), y, r * Math.sin(ang)); nor.push(...n); };
  const quad = (p: [number, number, number, [number, number, number]][]) => { for (const i of [0, 1, 2, 0, 2, 3]) v(...p[i]); };
  /** meia altura da abertura na direção `ang` (0 fora dos orifícios) */
  const abertura = (ang: number) => {
    let m = 0;
    for (const o of orificios) {
      const d = Math.atan2(Math.sin(ang - o), Math.cos(ang - o));
      if (Math.abs(d) < meioAngulo) m = Math.max(m, ro * Math.sqrt(1 - (d / meioAngulo) ** 2));
    }
    return m;
  };
  // Bordas das colunas: finas dentro dos orifícios, largas entre eles.
  const bordas: number[] = [];
  const finas = seg(10, fator, 6);
  const largas = seg(3, fator, 2);
  const setor = (2 * Math.PI) / orificios.length;
  for (const o of orificios) {
    for (let i = 0; i < finas; i++) bordas.push(o - meioAngulo + (2 * meioAngulo * i) / finas);
    for (let i = 0; i < largas; i++) bordas.push(o + meioAngulo + ((setor - 2 * meioAngulo) * i) / largas);
  }
  for (let j = 0; j < bordas.length; j++) {
    const a0 = bordas[j];
    const a1 = j + 1 < bordas.length ? bordas[j + 1] : bordas[0] + 2 * Math.PI;
    const [m0, m1] = [abertura(a0), abertura(a1)];
    const fora = (ang: number): [number, number, number] => [Math.cos(ang), 0, Math.sin(ang)];
    const dentro = (ang: number): [number, number, number] => [-Math.cos(ang), 0, -Math.sin(ang)];
    const pedacos: [number, number, number, number][] = m0 > 1e-9 || m1 > 1e-9 ? [[-h, -h, -m0, -m1], [m0, m1, h, h]] : [[-h, -h, h, h]];
    for (const [y0a, y0b, y1a, y1b] of pedacos) {
      quad([[re, a0, y0a, fora(a0)], [re, a0, y1a, fora(a0)], [re, a1, y1b, fora(a1)], [re, a1, y0b, fora(a1)]]);
      quad([[ri, a0, y0a, dentro(a0)], [ri, a1, y0b, dentro(a1)], [ri, a1, y1b, dentro(a1)], [ri, a0, y1a, dentro(a0)]]);
    }
    // contorno do orifício (liga a face externa à interna)
    if (m0 > 1e-9 || m1 > 1e-9) {
      for (const s of [-1, 1]) {
        const n: [number, number, number] = [0, -s, 0];
        const cantos: [number, number, number, [number, number, number]][] = [[re, a0, s * m0, n], [re, a1, s * m1, n], [ri, a1, s * m1, n], [ri, a0, s * m0, n]];
        quad(s > 0 ? cantos : [...cantos].reverse());
      }
    }
    // bordas de cima e de baixo
    quad([[ri, a0, h, [0, 1, 0]], [ri, a1, h, [0, 1, 0]], [re, a1, h, [0, 1, 0]], [re, a0, h, [0, 1, 0]]]);
    quad([[ri, a0, -h, [0, -1, 0]], [re, a0, -h, [0, -1, 0]], [re, a1, -h, [0, -1, 0]], [ri, a1, -h, [0, -1, 0]]]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.computeBoundingSphere();
  return g;
}

/** Extremos (no plano) de cada barra da moldura: de um espaço porta ao seguinte, sem entrar no conjuntivo. */
export function barrasMoldura(): [Ponto2, Ponto2][] {
  const apotema = LOBULO.raioHex * Math.cos(30 * GRAU);
  const meia = LOBULO.raioHex / 2 - (LOBULO.raioPorta + 0.012);
  return Array.from({ length: 6 }, (_, k) => {
    const meio = (30 + 60 * k) * GRAU;
    const c = soma([0, 0], direcao(meio), apotema);
    return [soma(c, normal(meio), -meia), soma(c, normal(meio), meia)] as [Ponto2, Ponto2];
  });
}

/** Traços de cada barra da moldura (centro ao longo da barra e comprimento). */
export function tracosMoldura(n = 7, vazio = 0.48): { centro: number; comprimento: number }[] {
  const total = LOBULO.raioHex - 2 * (LOBULO.raioPorta + 0.012);
  const comprimento = total / (n + (n - 1) * vazio);
  return Array.from({ length: n }, (_, i) => ({ centro: -total / 2 + comprimento / 2 + i * comprimento * (1 + vazio), comprimento }));
}

/**
 * Moldura do lóbulo clássico: em cada aresta do hexágono, uma linha tracejada de um espaço porta ao seguinte
 * (limite imaginário; os traços param no conjuntivo, sem atravessar os vasos da tríade). Um anel, centrado em
 * y = 0; o componente o põe em cima e embaixo da fatia.
 */
export function geometriaMoldura(largura = 0.04, espessura = 0.014): THREE.BufferGeometry {
  const apotema = LOBULO.raioHex * Math.cos(30 * GRAU);
  const tracos: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 6; k++) {
    const meio = (30 + 60 * k) * GRAU;
    const q = new THREE.Quaternion().setFromAxisAngle(Y, -(meio + Math.PI / 2)); // +x da caixa → direção da aresta
    const n = normal(meio);
    for (const t of tracosMoldura()) {
      const caixa = new THREE.BoxGeometry(t.comprimento, espessura, largura, 2, 1, 1);
      const centro = new THREE.Vector3(Math.cos(meio) * apotema + n[0] * t.centro, 0, Math.sin(meio) * apotema + n[1] * t.centro);
      tracos.push(caixa.applyMatrix4(new THREE.Matrix4().compose(centro, q, UM)));
    }
  }
  return mesclar(tracos);
}

/** Tubo de parede (veia, artéria, ducto): perfil retangular girado em torno de y, centrado na origem. */
export function geometriaTuboOco(raioInterno: number, raioExterno: number, altura: number, segmentos = 40): THREE.LatheGeometry {
  const h = altura / 2;
  // Dois anéis de vértices a mais na parede externa (±0,55 h), para a âncora do marcador não cair na borda.
  const perfil = [
    new THREE.Vector2(raioInterno, -h),
    new THREE.Vector2(raioExterno, -h),
    new THREE.Vector2(raioExterno, -0.55 * h),
    new THREE.Vector2(raioExterno, 0.55 * h),
    new THREE.Vector2(raioExterno, h),
    new THREE.Vector2(raioInterno, h),
    new THREE.Vector2(raioInterno, -h),
  ];
  return new THREE.LatheGeometry(perfil, segmentos);
}

/**
 * Setas de sentido (decoração, sem toque): `sangue` aponta da periferia para o centro, sobre os eixos dos
 * vértices; `bile` aponta do centro para a periferia, sobre os eixos das placas A. Flutuam acima da fatia.
 */
export function geometriaSetas(qual: 'sangue' | 'bile', y = 0.38): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 6; k++) {
    const eixo = (qual === 'sangue' ? 60 * k : 30 + 60 * k) * GRAU;
    const [de, para] = qual === 'sangue' ? [1.08, 0.88] : [0.74, 0.94];
    const sentido = Math.sign(para - de);
    const ponta = 0.06;
    partes.push(cilindroEntre(pontoAxial(eixo, de, 0, y), pontoAxial(eixo, para - sentido * ponta, 0, y), 0.009, 8, false));
    const cone = new THREE.ConeGeometry(0.028, ponta, 12);
    const d = new THREE.Vector3(Math.cos(eixo) * sentido, 0, Math.sin(eixo) * sentido);
    const q = new THREE.Quaternion().setFromUnitVectors(Y, d);
    partes.push(cone.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...pontoAxial(eixo, para - (sentido * ponta) / 2, 0, y)), q, UM)));
  }
  return mesclar(partes);
}
