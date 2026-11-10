// Refino das geometrias paramétricas (Sphere, Cylinder, Capsule, Tube, Torus, Lathe, Ring, Circle, Extrude):
// reconstrói no próprio objeto (dispose + copy) com os segmentos multiplicados pelo fator do nível.
// O componente dono continua dono da geometria (seu dispose no desmonte segue valendo).
// Só refina geometria intacta: reconstruída com os parâmetros originais, as posições têm de ser idênticas,
// o que detecta translate/rotate/cisalhamento aplicados depois da construção.
import * as THREE from 'three';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';

type Parametros = Record<string, unknown>;
interface Receita {
  construir: (p: Parametros) => THREE.BufferGeometry;
  escalar: (p: Parametros, f: number) => Parametros;
}

const seg = (v: unknown, f: number, minimo = 1) => Math.max(minimo, Math.round(Number(v) * f));
// Segmentos ao longo do comprimento só crescem quando já eram vários (cilindro reto de 1 segmento continua 1).
const segLongo = (v: unknown, f: number) => (Number(v) > 1 ? seg(v, f) : Number(v));

const RECEITAS: Record<string, Receita> = {
  SphereGeometry: {
    construir: (p: any) => new THREE.SphereGeometry(p.radius, p.widthSegments, p.heightSegments, p.phiStart, p.phiLength, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, widthSegments: seg(p.widthSegments, f, 3), heightSegments: seg(p.heightSegments, f, 2) }),
  },
  CylinderGeometry: {
    construir: (p: any) => new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, radialSegments: seg(p.radialSegments, f, 3), heightSegments: segLongo(p.heightSegments, f) }),
  },
  CapsuleGeometry: {
    construir: (p: any) => new THREE.CapsuleGeometry(p.radius, p.height, p.capSegments, p.radialSegments, p.heightSegments),
    escalar: (p, f) => ({ ...p, capSegments: seg(p.capSegments, f), radialSegments: seg(p.radialSegments, f, 3), heightSegments: segLongo(p.heightSegments, f) }),
  },
  TubeGeometry: {
    construir: (p: any) => new THREE.TubeGeometry(p.path, p.tubularSegments, p.radius, p.radialSegments, p.closed),
    escalar: (p, f) => ({ ...p, tubularSegments: seg(p.tubularSegments, f), radialSegments: seg(p.radialSegments, f, 3) }),
  },
  TorusGeometry: {
    construir: (p: any) => new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, radialSegments: seg(p.radialSegments, f, 2), tubularSegments: seg(p.tubularSegments, f, 3) }),
  },
  LatheGeometry: {
    construir: (p: any) => new THREE.LatheGeometry(p.points, p.segments, p.phiStart, p.phiLength),
    escalar: (p, f) => ({ ...p, segments: seg(p.segments, f) }),
  },
  RingGeometry: {
    construir: (p: any) => new THREE.RingGeometry(p.innerRadius, p.outerRadius, p.thetaSegments, p.phiSegments, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, thetaSegments: seg(p.thetaSegments, f, 3) }),
  },
  CircleGeometry: {
    construir: (p: any) => new THREE.CircleGeometry(p.radius, p.segments, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, segments: seg(p.segments, f, 3) }),
  },
  ExtrudeGeometry: {
    construir: (p: any) => new THREE.ExtrudeGeometry(p.shapes, p.options),
    escalar: (p: any, f) => {
      const o = { ...(p.options ?? {}) };
      o.curveSegments = seg(o.curveSegments ?? 12, f);
      if (o.bevelEnabled !== false) o.bevelSegments = seg(o.bevelSegments ?? 3, f);
      if (o.extrudePath) o.steps = seg(o.steps ?? 1, f);
      return { ...p, options: o };
    },
  },
};

export const TIPOS_REFINAVEIS = Object.keys(RECEITAS);

interface EstadoGeometria {
  refinavel: boolean;
  motivo?: 'tipo' | 'transformada' | 'alterada' | 'morph';
  tipo?: string;
  base?: Parametros;
  fator: number;
}
const estados = new WeakMap<THREE.BufferGeometry, EstadoGeometria>();
// BVH indireto: não reordena o índice da geometria (que pode já estar na GPU).
const OPCOES_BVH = { maxLeafTris: 10, indirect: true };

function mesmasPosicoes(a: THREE.BufferGeometry, b: THREE.BufferGeometry): boolean {
  const pa = a.getAttribute('position')?.array;
  const pb = b.getAttribute('position')?.array;
  if (!pa || !pb || pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) if (pa[i] !== pb[i]) return false;
  const ia = a.getIndex(), ib = b.getIndex();
  return (ia?.count ?? -1) === (ib?.count ?? -1);
}

/** Classifica uma vez e guarda os parâmetros-base (idempotente). */
export function classificarGeometria(g: THREE.BufferGeometry): EstadoGeometria {
  const conhecido = estados.get(g);
  if (conhecido) return conhecido;
  const parametros = (g as THREE.BufferGeometry & { parameters?: Parametros }).parameters;
  const receita = RECEITAS[g.type];
  let estado: EstadoGeometria;
  if (!receita || !parametros) estado = { refinavel: false, motivo: 'tipo', fator: 1 };
  else if ((g as unknown as { _transformed?: boolean })._transformed) estado = { refinavel: false, motivo: 'transformada', fator: 1 };
  else if (Object.keys(g.morphAttributes).length) estado = { refinavel: false, motivo: 'morph', fator: 1 };
  else {
    const referencia = receita.construir(parametros);
    const intacta = mesmasPosicoes(g, referencia);
    referencia.dispose();
    estado = intacta ? { refinavel: true, tipo: g.type, base: { ...parametros }, fator: 1 } : { refinavel: false, motivo: 'alterada', fator: 1 };
  }
  estados.set(g, estado);
  return estado;
}

function descartarBVH(g: THREE.BufferGeometry) {
  if (g.boundsTree) disposeBoundsTree.call(g);
}

/** Reconstrói `g` no próprio objeto com os segmentos × fator (fator 1 = parâmetros originais). Devolve se mudou. */
export function refinarGeometria(g: THREE.BufferGeometry, fator: number): boolean {
  const estado = classificarGeometria(g);
  if (!estado.refinavel || !estado.tipo || !estado.base) return false;
  if (Math.abs(estado.fator - fator) < 1e-6) return false;
  const receita = RECEITAS[estado.tipo];
  const nova = receita.construir(fator === 1 ? estado.base : receita.escalar(estado.base, fator));
  estado.fator = fator;
  const contagem = (x: THREE.BufferGeometry) => `${x.getAttribute('position').count}/${x.getIndex()?.count ?? 0}`;
  if (contagem(nova) === contagem(g)) {
    // Ex.: extrusão de polígono (só segmentos retos): nada muda com o fator.
    nova.dispose();
    return false;
  }
  const { userData, name } = g;
  descartarBVH(g);
  g.dispose(); // libera os buffers da GPU antes de trocar os atributos
  g.copy(nova);
  g.userData = userData;
  g.name = name;
  nova.dispose();
  g.computeBoundingSphere();
  return true;
}

export function triangulosDaGeometria(g: THREE.BufferGeometry): number {
  const total = g.getIndex()?.count ?? g.getAttribute('position')?.count ?? 0;
  const faixa = Math.min(total, Math.max(0, g.drawRange.count === Infinity ? total : g.drawRange.count));
  return Math.floor(faixa / 3);
}

export interface OpcoesRefino {
  /** raio aproximado do modelo (MODELOS[id].raio) */
  raio: number;
  fator: number;
  /** objetos com raio no mundo abaixo desta fração do raio do modelo não são refinados */
  limiarRelativo?: number;
  /** malhas com mais triângulos que isto ganham BVH (toque rápido) */
  limiteBVH?: number;
}

export interface ResultadoRefino {
  mudou: boolean;
  refinadas: number;
  comBVH: number;
  malhas: number;
}

const ehMaterialDoModelo = (m: THREE.Material | THREE.Material[]) => !Array.isArray(m) && !!(m as THREE.MeshStandardMaterial).isMeshStandardMaterial;

/**
 * Prepara as malhas sob `raiz`: refina as geometrias paramétricas grandes (pelo maior uso da geometria
 * compartilhada; geometrias de módulo voltam ao fator 1 num modelo em que só aparecem pequenas),
 * pula sombreamento plano e `userData.semRefino`, e põe BVH nas malhas densas.
 * Malhas auxiliares (contorno do drei, sombras) não usam material Standard e ficam de fora.
 */
export function prepararMalhas(raiz: THREE.Object3D, { raio, fator, limiarRelativo = 0.04, limiteBVH = 2000 }: OpcoesRefino): ResultadoRefino {
  raiz.updateWorldMatrix(true, true);
  const usos = new Map<THREE.BufferGeometry, { raioMax: number; bloqueada: boolean; malhas: THREE.Mesh[] }>();
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.geometry || !ehMaterialDoModelo(m.material)) return;
    const g = m.geometry;
    if (!g.boundingSphere) g.computeBoundingSphere();
    const r = (g.boundingSphere?.radius ?? 0) * m.matrixWorld.getMaxScaleOnAxis();
    const uso = usos.get(g) ?? { raioMax: 0, bloqueada: false, malhas: [] };
    uso.raioMax = Math.max(uso.raioMax, r);
    uso.bloqueada ||= !!(m.material as THREE.MeshStandardMaterial).flatShading || !!m.userData.semRefino || !!g.userData.semRefino;
    uso.malhas.push(m);
    usos.set(g, uso);
  });
  let mudou = false, refinadas = 0, comBVH = 0, malhas = 0;
  for (const [g, uso] of usos) {
    malhas += uso.malhas.length;
    const alvo = !uso.bloqueada && uso.raioMax >= limiarRelativo * raio ? fator : 1;
    // Fator 1 numa geometria nunca refinada: nada a reconstruir (evita classificar à toa).
    if (alvo !== 1 || estados.get(g)?.fator !== undefined) {
      if (refinarGeometria(g, alvo)) mudou = true;
    }
    if ((estados.get(g)?.fator ?? 1) > 1) refinadas++;
    if (triangulosDaGeometria(g) > limiteBVH) {
      if (!g.boundsTree) computeBoundsTree.call(g, OPCOES_BVH);
      for (const m of uso.malhas) if (m.raycast !== acceleratedRaycast) m.raycast = acceleratedRaycast;
      comBVH++;
    }
  }
  return { mudou, refinadas, comBVH, malhas };
}

/** Soma de triângulos das malhas visíveis sob `raiz` (uma chamada de desenho por malha). */
export function contarCena(raiz: THREE.Object3D): { triangulos: number; malhas: number } {
  let triangulos = 0, malhas = 0;
  raiz.traverseVisible((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.geometry) return;
    malhas++;
    triangulos += triangulosDaGeometria(m.geometry);
  });
  return { triangulos, malhas };
}
