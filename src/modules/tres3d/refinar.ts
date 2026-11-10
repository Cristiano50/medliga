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

// Tetos: com 96 divisões na circunferência, o erro de silhueta de um objeto do tamanho do modelo inteiro
// fica abaixo de meio pixel a dpr 3 num celular; acima disso, os triângulos não aparecem.
const TETO_VOLTA = 96;
const TETO_COMPRIMENTO = 256;
/** Multiplica pelo fator, sem cair abaixo do original nem passar do teto (salvo se o original já passava). */
const seg = (v: unknown, f: number, minimo = 1, teto = TETO_VOLTA) => {
  const n = Number(v);
  return Math.max(minimo, Math.min(Math.round(n * f), Math.max(n, teto)));
};
// Segmentos ao longo do comprimento só crescem quando já eram vários (cilindro reto de 1 segmento continua 1).
const segLongo = (v: unknown, f: number) => (Number(v) > 1 ? seg(v, f, 1, TETO_COMPRIMENTO) : Number(v));

const RECEITAS: Record<string, Receita> = {
  SphereGeometry: {
    construir: (p: any) => new THREE.SphereGeometry(p.radius, p.widthSegments, p.heightSegments, p.phiStart, p.phiLength, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, widthSegments: seg(p.widthSegments, f, 3), heightSegments: seg(p.heightSegments, f, 2, TETO_VOLTA * 0.75) }),
  },
  CylinderGeometry: {
    construir: (p: any) => new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, radialSegments: seg(p.radialSegments, f, 3), heightSegments: segLongo(p.heightSegments, f) }),
  },
  CapsuleGeometry: {
    construir: (p: any) => new THREE.CapsuleGeometry(p.radius, p.height, p.capSegments, p.radialSegments, p.heightSegments),
    escalar: (p, f) => ({ ...p, capSegments: seg(p.capSegments, f, 1, TETO_VOLTA / 4), radialSegments: seg(p.radialSegments, f, 3), heightSegments: segLongo(p.heightSegments, f) }),
  },
  TubeGeometry: {
    construir: (p: any) => new THREE.TubeGeometry(p.path, p.tubularSegments, p.radius, p.radialSegments, p.closed),
    escalar: (p, f) => ({ ...p, tubularSegments: seg(p.tubularSegments, f, 1, TETO_COMPRIMENTO), radialSegments: seg(p.radialSegments, f, 3) }),
  },
  TorusGeometry: {
    construir: (p: any) => new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc, p.thetaStart, p.thetaLength),
    escalar: (p, f) => ({ ...p, radialSegments: seg(p.radialSegments, f, 2), tubularSegments: seg(p.tubularSegments, f, 3, TETO_COMPRIMENTO) }),
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
      if (o.bevelEnabled !== false) o.bevelSegments = seg(o.bevelSegments ?? 3, f, 1, 12);
      if (o.extrudePath) o.steps = seg(o.steps ?? 1, f, 1, TETO_COMPRIMENTO);
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

/** Geometrias sendo reconstruídas: o dispose interno não é o dispose do dono. */
const emRefino = new WeakSet<THREE.BufferGeometry>();

/**
 * Cópia no fator 1 de uma geometria compartilhada, para os usos pequenos quando um uso grande a refinou
 * (ex.: a esfera dos 60 somitos da semana 4 também desenha os placoides). Liberada junto com a original.
 */
const copiasBase = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const origemDaCopia = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
function copiaBase(g: THREE.BufferGeometry): THREE.BufferGeometry | null {
  const pronta = copiasBase.get(g);
  if (pronta) return pronta;
  const estado = estados.get(g);
  if (!estado?.refinavel || !estado.tipo || !estado.base) return null;
  const copia = RECEITAS[estado.tipo].construir(estado.base);
  copia.computeBoundingSphere();
  copiasBase.set(g, copia);
  origemDaCopia.set(copia, g);
  const aoDescartar = () => {
    if (emRefino.has(g)) return;
    copia.dispose();
  };
  g.addEventListener('dispose', aoDescartar);
  return copia;
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
  emRefino.add(g);
  g.dispose(); // libera os buffers da GPU antes de trocar os atributos
  emRefino.delete(g);
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
  /** usos pequenos de geometria refinada que ficaram com a cópia no fator 1 */
  copiasBase: number;
}

const ehMaterialDoModelo = (m: THREE.Material | THREE.Material[]) => !Array.isArray(m) && !!(m as THREE.MeshStandardMaterial).isMeshStandardMaterial;

/**
 * Prepara as malhas sob `raiz`: refina as geometrias paramétricas usadas por algum objeto grande (raio no
 * mundo ≥ 4% do raio do modelo); os usos pequenos da mesma geometria passam a desenhar uma cópia no fator 1.
 * Geometrias de módulo voltam ao fator 1 num modelo em que só aparecem pequenas (resultado determinístico,
 * independe da ordem de navegação). Pula sombreamento plano e `userData.semRefino`; põe BVH nas malhas densas.
 * Malhas auxiliares (contorno do drei, sombras) não usam material Standard e ficam de fora.
 */
export function prepararMalhas(raiz: THREE.Object3D, { raio, fator, limiarRelativo = 0.04, limiteBVH = 2000 }: OpcoesRefino): ResultadoRefino {
  raiz.updateWorldMatrix(true, true);
  const limiar = limiarRelativo * raio;
  type Uso = { malha: THREE.Mesh; raio: number };
  const usos = new Map<THREE.BufferGeometry, { raioMax: number; bloqueada: boolean; malhas: Uso[] }>();
  raiz.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.geometry || !ehMaterialDoModelo(m.material)) return;
    // Uma malha que já recebeu a cópia base conta como uso da geometria original.
    const g = origemDaCopia.get(m.geometry) ?? m.geometry;
    if (!g.boundingSphere) g.computeBoundingSphere();
    const r = (g.boundingSphere?.radius ?? 0) * m.matrixWorld.getMaxScaleOnAxis();
    const uso = usos.get(g) ?? { raioMax: 0, bloqueada: false, malhas: [] };
    uso.raioMax = Math.max(uso.raioMax, r);
    uso.bloqueada ||= !!(m.material as THREE.MeshStandardMaterial).flatShading || !!m.userData.semRefino || !!g.userData.semRefino;
    uso.malhas.push({ malha: m, raio: r });
    usos.set(g, uso);
  });
  let mudou = false, refinadas = 0, comBVH = 0, malhas = 0, copias = 0;
  for (const [g, uso] of usos) {
    malhas += uso.malhas.length;
    const alvo = !uso.bloqueada && uso.raioMax >= limiar ? fator : 1;
    // Fator 1 numa geometria nunca refinada: nada a reconstruir (evita classificar à toa).
    if (alvo !== 1 || estados.get(g)?.fator !== undefined) {
      if (refinarGeometria(g, alvo)) mudou = true;
    }
    const refinada = (estados.get(g)?.fator ?? 1) > 1;
    if (refinada) refinadas++;
    for (const { malha, raio: r } of uso.malhas) {
      const desejada = refinada && r < limiar ? copiaBase(g) ?? g : g;
      if (malha.geometry !== desejada) { malha.geometry = desejada; mudou = true; }
      if (desejada !== g) copias++;
    }
    if (triangulosDaGeometria(g) > limiteBVH) {
      if (!g.boundsTree) computeBoundsTree.call(g, OPCOES_BVH);
      for (const { malha } of uso.malhas) if (malha.geometry === g && malha.raycast !== acceleratedRaycast) malha.raycast = acceleratedRaycast;
      comBVH++;
    }
  }
  return { mudou, refinadas, comBVH, malhas, copiasBase: copias };
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
