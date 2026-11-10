// Acabamentos (materiais.ts) e núcleo 3D: sem contexto, o material de sempre; com contexto, o acabamento do
// perfil, sem transmission; o estado de destaque vale igual para todo material; dpr não re-renderiza as partes.
import { Profiler } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { _roots, act, createRoot, extend } from '@react-three/fiber';
import { CenaProvider, Malha, Parte, type CenaCtx } from '../src/modules/embriologia/tres/nucleo.tsx';
import {
  ACABAMENTOS,
  AcabamentoContext,
  acabamentoDoPerfil,
  criarMaterial,
  materialLegado,
  resolverAcabamento,
  type AmbienteAcabamento,
} from '../src/modules/tres3d/materiais.ts';
import { MODELOS } from '../src/modules/embriologia/modelos/index.ts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
extend(THREE as unknown as Parameters<typeof extend>[0]);

const nada = () => {};
const stub = (canvas: HTMLCanvasElement) =>
  ({
    domElement: canvas, render: nada, setPixelRatio: nada, getPixelRatio: () => 1, setSize: nada, getDrawingBufferSize: (v: THREE.Vector2) => v.set(780, 1040), setAnimationLoop: nada, dispose: nada, forceContextLoss: nada,
    shadowMap: { enabled: false, type: THREE.PCFShadowMap }, xr: { enabled: false, isPresenting: false, addEventListener: nada, removeEventListener: nada, setAnimationLoop: nada, getSession: () => null },
    info: { render: {}, memory: {}, programs: [] }, outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.NoToneMapping,
  }) as unknown as THREE.WebGLRenderer;

const raizes: { canvas: HTMLCanvasElement; root: ReturnType<typeof createRoot> }[] = [];
async function montar(no: React.ReactNode) {
  const canvas = document.createElement('canvas');
  const root = createRoot(canvas);
  await act(async () => {
    await root.configure({ gl: stub(canvas), frameloop: 'never', size: { width: 390, height: 520, top: 0, left: 0 }, dpr: 2 });
    root.render(no);
  });
  raizes.push({ canvas, root });
  return { store: _roots.get(canvas)!.store, render: (n: React.ReactNode) => act(async () => root.render(n)) };
}
afterEach(async () => {
  for (const { root } of raizes.splice(0)) await act(async () => root.unmount());
});

const cena = (extra: Partial<CenaCtx> = {}): CenaCtx => ({ rotulosVisiveis: false, selecionado: null, destaques: {}, nomes: {}, modoJogo: false, ...extra });
const geo = new THREE.SphereGeometry(1, 8, 6);

function Cena({ ambiente, ctx, acabamentoMalha }: { ambiente: AmbienteAcabamento | null; ctx?: Partial<CenaCtx>; acabamentoMalha?: 'umido' }) {
  const malhas = (
    <CenaProvider value={cena(ctx)}>
      <Parte id="pele" cor="#e6a58f" acabamentoOrganico>
        <MalhaNomeada nome="pele" />
      </Parte>
      <Parte id="corpo" cor="#f0c3ae" rugosidade={0.5}>
        <group name="corpo-g"><MalhaNomeada nome="corpo" /></group>
        {acabamentoMalha && <MalhaNomeada nome="corpo-umido" acabamento={acabamentoMalha} />}
      </Parte>
      <Parte id="zona-pelucida" cor="#d9e6f5" opacidade={0.22} prioridade={0}>
        <MalhaNomeada nome="zona" />
      </Parte>
      <Parte id="casca" cor="#a5d8ff" opacidade={0.6}>
        <MalhaNomeada nome="casca" />
      </Parte>
    </CenaProvider>
  );
  return ambiente ? <AcabamentoContext.Provider value={ambiente}>{malhas}</AcabamentoContext.Provider> : malhas;
}
function MalhaNomeada({ nome, acabamento }: { nome: string; acabamento?: 'umido' }) {
  return <group name={`${nome}-pai`}><Malha geometria={geo} acabamento={acabamento} /></group>;
}
const malhaDe = (store: Awaited<ReturnType<typeof montar>>['store'], nome: string) =>
  ((store.getState().scene.getObjectByName(`${nome}-pai`)!.children[0]) as THREE.Mesh).material as THREE.MeshStandardMaterial;

describe('acabamentos dos modelos 3D', () => {
  it('ordem: prop → tabela por id → acabamentoOrganico → perfil (opaco/translúcido); sem contexto, null', () => {
    const amb: AmbienteAcabamento = { ...acabamentoDoPerfil('cascas'), nivel: 'alta' };
    expect(resolverAcabamento('x', { opacidade: 1 }, null)).toBeNull();
    expect(resolverAcabamento('x', { opacidade: 1, prop: 'fibroso' }, null)).toBe('fibroso');
    expect(resolverAcabamento('amnio', { opacidade: 1, prop: 'umido' }, amb)).toBe('umido');
    expect(resolverAcabamento('amnio', { opacidade: 1 }, amb)).toBe('membrana');
    expect(resolverAcabamento('x', { opacidade: 1, acabamentoOrganico: true }, amb)).toBe('organico');
    expect(resolverAcabamento('x', { opacidade: 0.4 }, amb)).toBe('membrana');
    expect(resolverAcabamento('x', { opacidade: 1 }, amb)).toBe('padrao');
    expect(acabamentoDoPerfil('organico')).toEqual({ opaco: 'organico', translucido: 'organico' });
    expect(acabamentoDoPerfil('esquema')).toEqual({ opaco: 'padrao', translucido: 'padrao' });
  });

  it('fábrica: Physical sem transmission no médio/alto, Standard no baixo; cor, opacidade e profundidade como antes', () => {
    const p = { cor: '#4f8ef7', opacidade: 0.5, rugosidade: 0.62 };
    const legado = materialLegado(p, false);
    for (const a of ACABAMENTOS) {
      const alta = criarMaterial(a, p, { nivel: 'alta' }) as THREE.MeshPhysicalMaterial;
      expect(alta.isMeshPhysicalMaterial, a).toBe(true);
      expect(alta.transmission, a).toBe(0);
      expect(alta.color.getHex()).toBe(legado.color.getHex());
      for (const k of ['opacity', 'transparent', 'depthWrite', 'side', 'flatShading', 'metalness'] as const) expect(alta[k], `${a}.${k}`).toBe(legado[k]);
      const baixa = criarMaterial(a, p, { nivel: 'baixa' });
      expect((baixa as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial, a).toBeUndefined();
      expect(baixa.isMeshStandardMaterial).toBe(true);
      expect(baixa.roughness).toBe(alta.roughness);
    }
    expect((criarMaterial('organico', p, { nivel: 'alta' }) as THREE.MeshPhysicalMaterial).sheen).toBeGreaterThan(0);
    expect(criarMaterial('padrao', { ...p, opacidade: 1 }, { nivel: 'alta' }).depthWrite).toBe(true);
    // Ajuste de cor do perfil: menos saturação, mesmo matiz.
    const pele = criarMaterial('organico', { ...p, cor: '#e6a58f' }, { nivel: 'alta', saturacao: 0.85 });
    const [h0, h1] = [{ h: 0, s: 0, l: 0 }, { h: 0, s: 0, l: 0 }];
    new THREE.Color('#e6a58f').getHSL(h0);
    pele.color.getHSL(h1);
    expect(h1.h).toBeCloseTo(h0.h, 4);
    expect(h1.s).toBeCloseTo(h0.s * 0.85, 4);
  });

  it('sem contexto, <Parte> cria exatamente o material de hoje', async () => {
    const { store } = await montar(<Cena ambiente={null} />);
    const pele = malhaDe(store, 'pele') as THREE.MeshPhysicalMaterial;
    expect(pele.isMeshPhysicalMaterial).toBe(true);
    expect(pele.clearcoat).toBe(0.08);
    expect(pele.envMapIntensity).toBe(0.15);
    expect(pele.sheen).toBe(0);
    expect(pele.userData.organico).toBe(true);
    const corpo = malhaDe(store, 'corpo');
    expect(corpo.type).toBe('MeshStandardMaterial');
    expect(corpo.roughness).toBe(0.5);
    const zona = malhaDe(store, 'zona');
    expect(zona.type).toBe('MeshStandardMaterial');
    expect([zona.transparent, zona.depthWrite, zona.opacity]).toEqual([true, false, 0.22]);
  });

  it('com contexto: acabamento do perfil e da tabela; <Malha acabamento> usa outro material da mesma parte', async () => {
    const amb: AmbienteAcabamento = { ...acabamentoDoPerfil('cascas'), nivel: 'alta' };
    const { store } = await montar(<Cena ambiente={amb} acabamentoMalha="umido" />);
    expect(malhaDe(store, 'zona').userData.acabamento).toBe('membrana');
    expect(malhaDe(store, 'casca').userData.acabamento).toBe('membrana');
    expect(malhaDe(store, 'corpo').userData.acabamento).toBe('padrao');
    expect(malhaDe(store, 'pele').userData.acabamento).toBe('organico');
    expect(malhaDe(store, 'pele').userData.organico).toBe(true);
    const umido = malhaDe(store, 'corpo-umido');
    expect(umido).not.toBe(malhaDe(store, 'corpo'));
    expect(umido.userData.acabamento).toBe('umido');
    expect(umido.color.getHex()).toBe(malhaDe(store, 'corpo').color.getHex());
  });

  it('destaque igual em todo acabamento: apagado reduz a opacidade e desliga a profundidade; selecionado mantém', async () => {
    const amb: AmbienteAcabamento = { ...acabamentoDoPerfil('organico'), nivel: 'alta' };
    const { render, store } = await montar(<Cena ambiente={amb} acabamentoMalha="umido" />);
    await render(<Cena ambiente={amb} acabamentoMalha="umido" ctx={{ selecionado: 'pele' }} />);
    const pele = malhaDe(store, 'pele');
    expect([pele.opacity, pele.transparent, pele.depthWrite]).toEqual([1, false, true]);
    for (const nome of ['corpo', 'corpo-umido']) {
      const m = malhaDe(store, nome);
      expect(m.opacity, nome).toBeCloseTo(0.4, 6);
      expect([m.transparent, m.depthWrite], nome).toEqual([true, false]);
    }
    const zona = malhaDe(store, 'zona');
    expect(zona.opacity).toBeCloseTo(Math.min(0.22, 0.22 * 0.35 + 0.05), 6);
    await render(<Cena ambiente={amb} acabamentoMalha="umido" ctx={{ destaques: { corpo: 'certo' } }} />);
    expect([malhaDe(store, 'corpo').opacity, malhaDe(store, 'corpo-umido').opacity]).toEqual([1, 1]);
  });

  it('contorno de seleção fica fora do toque (recém-criado, ainda sem matriz de mundo)', async () => {
    const amb: AmbienteAcabamento = { ...acabamentoDoPerfil('esquema'), nivel: 'alta' };
    // Elemento estável do modelo (como o Cena3D faz): a parte re-renderiza só pelo contexto.
    const modelo = (
      <Parte id="pequena" cor="#ff0000" prioridade={8} posicao={[3, 0, 0]} escala={0.1}>
        <MalhaNomeada nome="pequena" />
      </Parte>
    );
    const arvore = (selecionado: string | null) => (
      <AcabamentoContext.Provider value={amb}>
        <CenaProvider value={cena({ selecionado })}>{modelo}</CenaProvider>
      </AcabamentoContext.Provider>
    );
    // Como no app: o modelo já está montado e a seleção chega depois (o contorno nasce sem passar por um quadro).
    const { store, render } = await montar(arvore(null));
    await render(arvore('pequena'));
    const cenaThree = store.getState().scene;
    const contornos: THREE.Mesh[] = [];
    cenaThree.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && (m.material as THREE.Material).type === 'ShaderMaterial') contornos.push(m); });
    expect(contornos).toHaveLength(1);
    // Nenhum quadro foi desenhado: a matriz de mundo do contorno ainda é a identidade (esfera de raio 1 na origem).
    expect(contornos[0].matrixWorld.equals(new THREE.Matrix4())).toBe(true);
    const pelaOrigem = new THREE.Raycaster(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    expect(pelaOrigem.intersectObject(cenaThree, true)).toHaveLength(0);
    // A parte de verdade (em x = 3, escala 0,1) continua tocável depois que as matrizes são atualizadas.
    cenaThree.updateMatrixWorld(true);
    const pelaParte = new THREE.Raycaster(new THREE.Vector3(3, 0, 5), new THREE.Vector3(0, 0, -1));
    const hits = pelaParte.intersectObject(cenaThree, true);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => (h.object as THREE.Mesh).material !== contornos[0].material)).toBe(true);
  });

  it('mudar o dpr não re-renderiza as partes (seletores no useThree)', async () => {
    // Modelo só com <Parte>/<Malha> (os textos Cranial/Caudal de rotulos.tsx ainda leem o estado inteiro).
    let commits = 0;
    const { Componente } = MODELOS.gastrulacao;
    const { store } = await montar(
      <Profiler id="modelo" onRender={() => { commits++; }}>
        <CenaProvider value={cena()}>
          <Componente />
        </CenaProvider>
      </Profiler>,
    );
    const antes = commits;
    await act(async () => { store.getState().setDpr(1.25); });
    await act(async () => { store.getState().setDpr(3); });
    expect(store.getState().viewport.dpr).toBe(3);
    expect(commits).toBe(antes);
  });
});
