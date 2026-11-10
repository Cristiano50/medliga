// Orçamento de triângulos por modelo e por nível: monta cada modelo num root do R3F com renderer stub
// (jsdom não tem WebGL), aplica o refino do nível e soma os triângulos das malhas visíveis.
import { afterAll, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { act, createRoot, extend } from '@react-three/fiber';
import { MODELOS } from '../src/modules/embriologia/modelos/index.ts';
import { forcarNivel, NIVEIS, PARAMETROS, type NivelQualidade } from '../src/modules/tres3d/qualidade.ts';
import { contarCena, prepararMalhas } from '../src/modules/tres3d/refinar.ts';
import { ORCAMENTO, excessos } from '../src/modules/tres3d/orcamento.ts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
// O <Canvas> registra o catálogo do three; com createRoot direto, é preciso registrar aqui.
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
    const { Componente } = MODELOS[id];
    root.render(<group name="modelo"><Componente /></group>);
  });
  const cena = (await import('@react-three/fiber'))._roots.get(canvas)!.store.getState().scene as THREE.Scene;
  return {
    cena,
    desmontar: async () => { await act(async () => root.unmount()); canvas.remove(); },
  };
}

const medidas: Record<string, Record<NivelQualidade, { triangulos: number; malhas: number }>> = {};

describe('orçamento de desenho 3D', () => {
  afterAll(() => forcarNivel(null));

  for (const id of Object.keys(MODELOS)) {
    it(`${id}: triângulos e malhas dentro do orçamento em cada nível`, async () => {
      medidas[id] = {} as Record<NivelQualidade, { triangulos: number; malhas: number }>;
      for (const nivel of NIVEIS) {
        forcarNivel(nivel); // embriões geram a superfície pela resolução do nível
        const { cena, desmontar } = await montar(id);
        const modelo = cena.getObjectByName('modelo')!;
        expect(modelo).toBeTruthy();
        prepararMalhas(modelo, { raio: MODELOS[id].raio, fator: PARAMETROS[nivel].fator });
        const medida = contarCena(modelo);
        medidas[id][nivel] = medida;
        expect(excessos({ triangulos: medida.triangulos, chamadas: medida.malhas }, nivel), `${id} em ${nivel}`).toEqual([]);
        await desmontar();
      }
      // O refino nunca reduz e o nível baixo é o desenho original.
      expect(medidas[id].media.triangulos).toBeGreaterThanOrEqual(medidas[id].baixa.triangulos);
      expect(medidas[id].alta.triangulos).toBeGreaterThanOrEqual(medidas[id].media.triangulos);
      expect(medidas[id].alta.malhas).toBe(medidas[id].baixa.malhas);
    }, 30000);
  }

  it('o nível baixo reproduz o desenho anterior (fator 1) e o alto aumenta a resolução em todos os modelos', () => {
    const linhas = Object.entries(medidas).map(([id, m]) => `${id}: ${m.baixa.triangulos} / ${m.media.triangulos} / ${m.alta.triangulos} (${m.baixa.malhas} malhas)`);
    expect(linhas.length).toBe(Object.keys(MODELOS).length);
    // Neurulação: só extrusões de polígonos já transladadas e caixas — nada paramétrico a refinar;
    // ganha apenas resolução de desenho, iluminação e sombra de contato.
    const semCurvas = ['neurulacao'];
    for (const [id, m] of Object.entries(medidas)) {
      if (semCurvas.includes(id)) expect(m.alta.triangulos, id).toBe(m.baixa.triangulos);
      else expect(m.alta.triangulos, id).toBeGreaterThan(m.baixa.triangulos);
      expect(m.alta.triangulos, id).toBeLessThanOrEqual(ORCAMENTO.alta.triangulos);
    }
    console.info(['triângulos por modelo (baixa / média / alta):', ...linhas].join('\n'));
  });
});
