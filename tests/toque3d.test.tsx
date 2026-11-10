// Toque nos modelos 3D da histologia (grupos A e B): cada parte precisa ser escolhida pelo resolvedor de toque
// (prioridade, depois distância) para um raio vindo de ao menos uma de 6 direções (±x, ±y, ±z) em direção a
// algum ponto da própria parte. Também mede triângulos e malhas de cada modelo em cada nível de qualidade.
// Monta cada modelo num root do R3F com renderer stub (jsdom não tem WebGL), como em orcamento-3d.test.tsx.
import { afterAll, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { _roots, act, createRoot, extend } from '@react-three/fiber';
import { MODELOS_HISTOLOGIA } from '../src/modules/histologia/modelos3d/index.ts';
import { resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { forcarNivel, NIVEIS, PARAMETROS, type NivelQualidade } from '../src/modules/tres3d/qualidade.ts';
import { contarCena, prepararMalhas } from '../src/modules/tres3d/refinar.ts';
import { ORCAMENTO, excessos } from '../src/modules/tres3d/orcamento.ts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
extend(THREE as unknown as Parameters<typeof extend>[0]);

function rendererStub(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const nada = () => {};
  return {
    domElement: canvas,
    render: nada,
    setPixelRatio: nada,
    getPixelRatio: () => 1,
    setSize: nada,
    setAnimationLoop: nada,
    dispose: nada,
    forceContextLoss: nada,
    shadowMap: { enabled: false, type: THREE.PCFShadowMap, autoUpdate: true, needsUpdate: false },
    xr: { enabled: false, isPresenting: false, addEventListener: nada, removeEventListener: nada, setAnimationLoop: nada, getSession: () => null },
    info: { render: {}, memory: {}, programs: [] },
    capabilities: {},
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.NoToneMapping,
  } as unknown as THREE.WebGLRenderer;
}

async function montar(id: string) {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const root = createRoot(canvas);
  await act(async () => {
    await root.configure({ gl: rendererStub(canvas), frameloop: 'never', size: { width: 390, height: 520, top: 0, left: 0 }, events: undefined });
    const { Componente } = MODELOS_HISTOLOGIA[id];
    root.render(<group name="modelo"><Componente /></group>);
  });
  const cena = _roots.get(canvas)!.store.getState().scene as THREE.Scene;
  const modelo = cena.getObjectByName('modelo')!;
  modelo.updateWorldMatrix(true, true);
  return { modelo, desmontar: async () => { await act(async () => root.unmount()); canvas.remove(); } };
}

/** Malhas de cada parte (userData.parteId é posto pela <Parte> em todos os descendentes). */
function malhasPorParte(raiz: THREE.Object3D): Map<string, THREE.Mesh[]> {
  const m = new Map<string, THREE.Mesh[]>();
  raiz.traverse((o) => {
    const malha = o as THREE.Mesh;
    if (!malha.isMesh || !malha.userData.parteId) return;
    const lista = m.get(malha.userData.parteId) ?? [];
    lista.push(malha);
    m.set(malha.userData.parteId, lista);
  });
  return m;
}

/** Centros de até `n` triângulos de cada malha, no mundo. */
function amostras(malhas: THREE.Mesh[], n = 48): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (const m of malhas) {
    const pos = m.geometry.getAttribute('position');
    const idx = m.geometry.getIndex();
    const tris = Math.floor((idx ? idx.count : pos.count) / 3);
    const passo = Math.max(1, Math.floor(tris / n));
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let t = 0; t < tris; t += passo) {
      const i0 = idx ? idx.getX(3 * t) : 3 * t;
      const i1 = idx ? idx.getX(3 * t + 1) : 3 * t + 1;
      const i2 = idx ? idx.getX(3 * t + 2) : 3 * t + 2;
      a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2);
      pts.push(a.clone().add(b).add(c).divideScalar(3).applyMatrix4(m.matrixWorld));
    }
  }
  return pts;
}

const DIRECOES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(([x, y, z]) => new THREE.Vector3(x, y, z));

/** Primeira direção (e ponto) em que um raio rumo à parte a escolhe; null se nenhuma. */
function tocavel(raiz: THREE.Object3D, malhas: THREE.Mesh[], id: string): { direcao: string; ponto: THREE.Vector3 } | null {
  const raycaster = new THREE.Raycaster();
  for (const ponto of amostras(malhas)) {
    for (const d of DIRECOES) {
      raycaster.set(ponto.clone().addScaledVector(d, 20), d.clone().negate());
      if (resolverToque(raycaster.intersectObject(raiz, true)) === id) return { direcao: d.toArray().join(','), ponto };
    }
  }
  return null;
}

const ids = Object.keys(MODELOS_HISTOLOGIA);

describe('toque nos modelos 3D da histologia', () => {
  it('há modelos registrados (grupo A pelo menos)', () => {
    expect(ids).toEqual(expect.arrayContaining(['nefron', 'alveolo']));
  });

  for (const id of ids) {
    it(`${id}: toda parte existe no desenho e é tocável por um raio de ao menos uma de 6 direções`, async () => {
      const { modelo, desmontar } = await montar(id);
      prepararMalhas(modelo, { raio: MODELOS_HISTOLOGIA[id].raio, fator: 1 }); // BVH nas malhas densas, como no app
      const porParte = malhasPorParte(modelo);
      const partes = MODELOS_HISTOLOGIA[id].partes;
      expect(new Set(porParte.keys()), `${id}: partes desenhadas`).toEqual(new Set(partes));
      const falhas: string[] = [];
      for (const parte of partes) if (!tocavel(modelo, porParte.get(parte)!, parte)) falhas.push(parte);
      expect(falhas, `${id}: partes que nenhum raio escolhe`).toEqual([]);
      await desmontar();
    }, 60000);
  }
});

describe('orçamento de desenho dos modelos da histologia', () => {
  afterAll(() => forcarNivel(null));
  const medidas: Record<string, Partial<Record<NivelQualidade, { triangulos: number; malhas: number }>>> = {};

  for (const id of ids) {
    it(`${id}: triângulos e malhas dentro do orçamento em cada nível; o refino aumenta a resolução`, async () => {
      medidas[id] = {};
      for (const nivel of NIVEIS) {
        forcarNivel(nivel);
        const { modelo, desmontar } = await montar(id);
        prepararMalhas(modelo, { raio: MODELOS_HISTOLOGIA[id].raio, fator: PARAMETROS[nivel].fator });
        const medida = contarCena(modelo);
        medidas[id][nivel] = medida;
        expect(excessos({ triangulos: medida.triangulos, chamadas: medida.malhas }, nivel), `${id} em ${nivel}`).toEqual([]);
        await desmontar();
      }
      const m = medidas[id] as Record<NivelQualidade, { triangulos: number; malhas: number }>;
      expect(m.media.triangulos).toBeGreaterThanOrEqual(m.baixa.triangulos);
      expect(m.alta.triangulos).toBeGreaterThan(m.baixa.triangulos);
      expect(m.alta.malhas).toBe(m.baixa.malhas);
      expect(m.alta.triangulos).toBeLessThanOrEqual(ORCAMENTO.alta.triangulos);
      console.info(`${id}: ${m.baixa.triangulos} / ${m.media.triangulos} / ${m.alta.triangulos} triângulos (baixa / média / alta), ${m.baixa.malhas} malhas`);
    }, 60000);
  }
});
