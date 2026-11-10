// Modelos 3D da histologia, grupo B: relações espaciais (lóbulo hepático, sarcômero, junções celulares),
// orçamento de desenho por nível e toque de todas as partes.
import { afterAll, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import * as THREE from 'three';
import { _roots, act, createRoot, extend } from '@react-three/fiber';
import {
  ALTURA_FATIA,
  LOBULO,
  RAIO_MAXIMO_TRECHO,
  cantosCelula,
  convexosSeCruzam,
  dentroHexagono,
  distanciaPoligono,
  geometriaLobulo,
  hepatocitos,
  pegadaTrecho,
  verticesHexagono,
} from '../src/modules/histologia/modelos3d/geometria-lobulo.ts';
import { SARCOMERO, bandas, cabecasMiosina, comprimentoSarcomero, redeFilamentos } from '../src/modules/histologia/modelos3d/geometria-sarcomero.ts';
import {
  COMPRIMENTO_CONEXON,
  JUNCOES,
  centrosCelulas,
  centrosNucleos,
  conexons,
  geometriaFaixa,
  microvilosidades,
  placasDesmossomo,
  placasHemidesmossomo,
  trajetosQueratina,
} from '../src/modules/histologia/modelos3d/geometria-juncoes.ts';
import { MODELOS_HISTO_B } from '../src/modules/histologia/modelos3d/grupo-b.tsx';
import { resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { forcarNivel, NIVEIS, PARAMETROS, type NivelQualidade } from '../src/modules/tres3d/qualidade.ts';
import { contarCena, prepararMalhas } from '../src/modules/tres3d/refinar.ts';
import { excessos } from '../src/modules/tres3d/orcamento.ts';
import modelosB from '../content/histologia/modelos3d-b.json';

const GRAU = Math.PI / 180;
const angulo = (p: [number, number]) => Math.atan2(p[1], p[0]);
const difAngulo = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

describe('lóbulo hepático clássico', () => {
  const g = geometriaLobulo();
  const pegadas = g.placas.flatMap((p) => p.celulas.map(([a, b]) => ({ placa: p, poligono: cantosCelula(p.angulo, a, b) })));

  it('hexágono regular centrado na veia centrolobular, com uma tríade portal em cada vértice', () => {
    const v = verticesHexagono();
    const centro = v.reduce((s, p) => [s[0] + p[0] / 6, s[1] + p[1] / 6], [0, 0]);
    expect(Math.hypot(...centro)).toBeLessThan(1e-12);
    for (let k = 0; k < 6; k++) {
      expect(Math.hypot(...v[k])).toBeCloseTo(LOBULO.raioHex, 12);
      // hexágono regular: lado = raio
      const w = v[(k + 1) % 6];
      expect(Math.hypot(w[0] - v[k][0], w[1] - v[k][1])).toBeCloseTo(LOBULO.raioHex, 12);
    }
    expect(g.triades).toHaveLength(6);
    g.triades.forEach((t, k) => {
      expect(t.vertice[0]).toBeCloseTo(v[k][0], 12);
      expect(t.vertice[1]).toBeCloseTo(v[k][1], 12);
      expect(difAngulo(angulo(t.vertice), k * 60 * GRAU)).toBeLessThan(1e-9);
      const vasos = [t.veia, t.arteria, t.ducto];
      // os três elementos dentro do conjuntivo do espaço porta, sem se sobrepor
      for (const vaso of vasos) expect(Math.hypot(vaso.centro[0] - t.vertice[0], vaso.centro[1] - t.vertice[1]) + vaso.raioExterno).toBeLessThan(LOBULO.raioPorta - 0.02);
      for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 3; j++) {
          const [a, b] = [vasos[i], vasos[j]];
          expect(Math.hypot(a.centro[0] - b.centro[0], a.centro[1] - b.centro[1])).toBeGreaterThan(a.raioExterno + b.raioExterno);
        }
      }
      // ramo portal: o maior, de parede fina; artéria: parede espessa em relação à luz
      expect(t.veia.raioExterno).toBeGreaterThan(t.arteria.raioExterno);
      expect(t.veia.raioExterno).toBeGreaterThan(t.ducto.raioExterno);
      const parede = (x: typeof t.veia) => (x.raioExterno - x.raioInterno) / x.raioInterno;
      expect(parede(t.arteria)).toBeGreaterThan(1);
      expect(parede(t.veia)).toBeLessThan(0.2);
    });
  });

  it('placas de uma célula de espessura, radiais a partir da veia, dentro do lóbulo e sem sobreposição', () => {
    expect(g.placas.filter((p) => p.zona === 'A')).toHaveLength(6);
    expect(g.placas.filter((p) => p.zona === 'B')).toHaveLength(12);
    expect(g.placas.filter((p) => p.zona === 'C')).toHaveLength(24);
    expect(hepatocitos()).toHaveLength(pegadas.length * LOBULO.camadas);
    for (const { poligono } of pegadas) {
      for (const c of poligono) {
        expect(dentroHexagono(c)).toBe(true);
        expect(Math.hypot(...c)).toBeGreaterThan(LOBULO.raioVeia);
      }
      for (const v of verticesHexagono()) expect(distanciaPoligono(v, poligono)).toBeGreaterThan(LOBULO.raioPorta);
    }
    for (let i = 0; i < pegadas.length; i++) {
      for (let j = i + 1; j < pegadas.length; j++) expect(convexosSeCruzam(pegadas[i].poligono, pegadas[j].poligono, 1e-9), `${i} × ${j}`).toBe(false);
    }
    // Zona A encosta na veia; cada placa B/C começa encostada (forquilha) numa célula da placa-mãe.
    for (const p of g.placas.filter((x) => x.zona === 'A')) expect(p.celulas[0][0] - LOBULO.raioVeia).toBeLessThanOrEqual(LOBULO.folga + 1e-9);
    for (const p of g.placas.filter((x) => x.mae !== null)) {
      const mae = g.placas[p.mae!];
      const primeira = cantosCelula(p.angulo, ...p.celulas[0]);
      const distancia = Math.min(...mae.celulas.map(([a, b]) => Math.min(...cantosCelula(mae.angulo, a, b).map((c) => distanciaPoligono(c, primeira)))));
      expect(distancia, `placa ${p.indice}`).toBeLessThan(0.02);
      expect(p.celulas.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('sinusoides entre duas placas, sem atravessar hepatócitos, da periferia até a veia centrolobular', () => {
    expect(g.sinusoides.length).toBeGreaterThanOrEqual(36);
    const placaEm = (ang: number, a: number, b: number) =>
      g.placas.some((p) => difAngulo(p.angulo, ang) < 1e-9 && p.celulas.some(([x, y]) => x < b && y > a - 0.15));
    for (const t of g.sinusoides) {
      const pegada = pegadaTrecho(t);
      for (const { poligono } of pegadas) expect(convexosSeCruzam(pegada, poligono, 1e-6)).toBe(false);
      // ladeado por placas reais nos dois lados do eixo
      expect(placaEm(t.angulo - t.meiaAbertura, t.inicio, t.fim), `${t.zona} ${t.angulo}`).toBe(true);
      expect(placaEm(t.angulo + t.meiaAbertura, t.inicio, t.fim), `${t.zona} ${t.angulo}`).toBe(true);
      // luz aberta e casca dentro da fatia
      expect(t.raioInicio - LOBULO.disse).toBeGreaterThanOrEqual(LOBULO.luzMinima - 1e-9);
      expect(Math.max(t.raioInicio, t.raioFim)).toBeLessThanOrEqual(RAIO_MAXIMO_TRECHO + 1e-9);
      expect(RAIO_MAXIMO_TRECHO).toBeLessThan(ALTURA_FATIA / 2);
      for (const c of pegada) expect(dentroHexagono(c)).toBe(true);
    }
    // Do espaço porta à veia centrolobular: em cada eixo voltado para um vértice, trechos contínuos A → B → C,
    // o primeiro encostado na veia e o último encostado no conjuntivo do espaço porta.
    for (const t of g.triades) {
      const cadeia = g.sinusoides.filter((s) => difAngulo(s.angulo, t.angulo) < 1e-9).sort((a, b) => a.inicio - b.inicio);
      expect(cadeia.map((s) => s.zona)).toEqual(['A', 'B', 'C']);
      expect(cadeia[0].inicio - LOBULO.raioVeia).toBeLessThan(0.01);
      for (let i = 1; i < cadeia.length; i++) expect(cadeia[i].inicio).toBeCloseTo(cadeia[i - 1].fim, 9);
      const ultimo = cadeia[cadeia.length - 1];
      expect(distanciaPoligono(t.vertice, pegadaTrecho(ultimo))).toBeLessThan(LOBULO.raioPorta + 0.01);
    }
  });

  it('células de Kupffer dentro da luz dos sinusoides', () => {
    expect(g.kupffer.length).toBeGreaterThan(12);
    const [ax, tr] = LOBULO.kupffer;
    for (const k of g.kupffer) {
      const t = g.sinusoides[k.trecho];
      const u = [Math.cos(t.angulo), Math.sin(t.angulo)];
      const a = k.centro[0] * u[0] + k.centro[2] * u[1];
      const lateral = -k.centro[0] * u[1] + k.centro[2] * u[0];
      const desvio = Math.hypot(lateral, k.centro[1]);
      const raio = (x: number) => t.raioInicio + ((t.raioFim - t.raioInicio) * (x - t.inicio)) / (t.fim - t.inicio);
      expect(a - ax).toBeGreaterThan(t.inicio);
      expect(a + ax).toBeLessThan(t.fim);
      expect(desvio + tr).toBeLessThanOrEqual(Math.min(raio(a - ax), raio(a + ax)) - LOBULO.disse + 1e-9);
      expect(k.angulo).toBe(t.angulo);
    }
  });

  it('canalículos biliares entre hepatócitos vizinhos, no plano médio das placas', () => {
    const meia = ALTURA_FATIA / 2;
    for (const { a, b } of g.canaliculos) {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const placa = g.placas.find((p) => Math.abs(-m[0] * Math.sin(p.angulo) + m[2] * Math.cos(p.angulo)) < 1e-9 && m[0] * Math.cos(p.angulo) + m[2] * Math.sin(p.angulo) > 0);
      expect(placa).toBeTruthy();
      // não saem da fatia (os verticais chegam até as faces de corte)
      expect(Math.max(Math.abs(a[1]), Math.abs(b[1]))).toBeLessThanOrEqual(meia + 1e-9);
      if (Math.abs(a[1] - b[1]) > 1e-9) {
        // vertical: na folga entre duas células consecutivas da placa
        const r = Math.hypot(m[0], m[2]);
        expect(placa!.celulas.some(([, fim], i) => i + 1 < placa!.celulas.length && r > fim && r < placa!.celulas[i + 1][0])).toBe(true);
      } else {
        // horizontal: na interface entre camadas de hepatócitos
        const yInterface = -meia + LOBULO.altura + LOBULO.folga / 2;
        expect(a[1]).toBeCloseTo(yInterface, 9);
      }
    }
  });
});

describe('sarcômero', () => {
  const k = SARCOMERO.escala;
  const niveis = [0, 0.25, 0.5, 0.75, 1];

  it('linhas Z nas extremidades, linha M no centro, banda A = comprimento dos filamentos grossos', () => {
    for (const c of niveis) {
      const b = bandas(c);
      const s = comprimentoSarcomero(c);
      expect(b.linhaZ[1] - b.linhaZ[0]).toBeCloseTo(s * k, 12);
      expect(b.linhaZ[0]).toBeCloseTo(-b.linhaZ[1], 12);
      expect(b.linhaM).toBe(0);
      expect(b.bandaA[1] - b.bandaA[0]).toBeCloseTo(SARCOMERO.grosso * k, 12);
      expect(b.bandaA[0] + b.bandaA[1]).toBeCloseTo(0, 12);
      // sarcômero = banda A + banda I (duas metades)
      expect(b.larguraA + b.larguraI).toBeCloseTo(s, 12);
    }
  });

  it('banda I só com finos e atravessada pela linha Z; banda H só com grossos, centrada na linha M', () => {
    for (const c of niveis) {
      const b = bandas(c);
      b.bandasI.forEach(([ini, fim], i) => {
        // a linha Z divide a banda I ao meio
        expect((ini + fim) / 2).toBeCloseTo(b.linhaZ[i], 12);
        expect(fim - ini).toBeCloseTo(b.larguraI * k, 12);
      });
      // a banda I começa onde terminam os grossos (junção A-I)
      expect(b.bandasI[0][1]).toBeCloseTo(b.bandaA[0], 12);
      expect(b.bandasI[1][0]).toBeCloseTo(b.bandaA[1], 12);
      // finos ancorados nas linhas Z, com o comprimento do filamento fino, terminando na borda da banda H
      expect(b.finos[0][0]).toBeCloseTo(b.linhaZ[0], 12);
      expect(b.finos[1][1]).toBeCloseTo(b.linhaZ[1], 12);
      for (const [ini, fim] of b.finos) expect(fim - ini).toBeCloseTo(SARCOMERO.fino * k, 12);
      expect(b.finos[0][1]).toBeCloseTo(b.bandaH[0], 12);
      expect(b.finos[1][0]).toBeCloseTo(b.bandaH[1], 12);
      expect(b.bandaH[0] + b.bandaH[1]).toBeCloseTo(0, 12);
      expect(b.bandaH[0]).toBeGreaterThan(b.bandaA[0]);
      expect(b.bandaH[1]).toBeLessThan(b.bandaA[1]);
    }
  });

  it('contração: a banda A fica constante; I, H e o sarcômero encurtam', () => {
    const lista = niveis.map(bandas);
    for (let i = 1; i < lista.length; i++) {
      expect(lista[i].larguraA).toBe(lista[0].larguraA);
      expect(lista[i].bandaA).toEqual(lista[0].bandaA);
      expect(lista[i].larguraI).toBeLessThan(lista[i - 1].larguraI);
      expect(lista[i].larguraH).toBeLessThan(lista[i - 1].larguraH);
      expect(lista[i].sarcomero).toBeLessThan(lista[i - 1].sarcomero);
      // a perda de I é igual à perda de H (deslizamento, sem encurtar filamentos)
      expect(lista[0].larguraI - lista[i].larguraI).toBeCloseTo(lista[0].larguraH - lista[i].larguraH, 12);
    }
    // valores de repouso dos livros-texto: 2,5 µm; A 1,6; I 0,9; H 0,5
    expect(lista[0].sarcomero).toBe(2.5);
    expect(lista[0].larguraI).toBeCloseTo(0.9, 12);
    expect(lista[0].larguraH).toBeCloseTo(0.5, 12);
    // no contraído, os finos dos dois lados ainda não se sobrepõem
    expect(lista[lista.length - 1].larguraH).toBeGreaterThan(0);
  });

  it('tríades na junção A-I, com uma cisterna de cada lado', () => {
    for (const c of niveis) {
      const b = bandas(c);
      expect(b.juncoesAI).toEqual(b.bandaA);
      for (const x of b.juncoesAI) {
        const cisternas = [x - SARCOMERO.afastamentoCisterna, x + SARCOMERO.afastamentoCisterna];
        // uma cisterna sobre a banda A e outra sobre a banda I, sem passar da linha Z
        expect(Math.abs(cisternas[0]) < Math.abs(x)).not.toBe(Math.abs(cisternas[1]) < Math.abs(x));
        for (const y of cisternas) expect(Math.abs(y)).toBeLessThan(b.linhaZ[1]);
        expect(SARCOMERO.afastamentoCisterna).toBeGreaterThan(SARCOMERO.tuboT + SARCOMERO.tuboCisterna);
      }
    }
  });

  it('rede hexagonal: seis finos em volta do grosso central e cada fino interno entre três grossos', () => {
    const { grossos, finos } = redeFilamentos();
    const D = SARCOMERO.rede;
    expect(grossos).toHaveLength(7);
    expect(finos).toHaveLength(12);
    const perto = (p: [number, number], lista: [number, number][]) => lista.filter((q) => Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1]) - D / Math.sqrt(3)) < 1e-9);
    expect(perto([0, 0], finos)).toHaveLength(6);
    for (const f of finos.filter((p) => Math.hypot(...p) < D)) expect(perto(f, grossos)).toHaveLength(3);
    // nada se toca no corte transversal
    for (const f of finos) for (const g of grossos) expect(Math.hypot(f[0] - g[0], f[1] - g[1])).toBeGreaterThan(SARCOMERO.raioFino + SARCOMERO.raioGrosso);
  });

  it('cabeças de miosina fora da zona nua, voltadas para a linha Z do seu lado', () => {
    const cabecas = cabecasMiosina();
    expect(cabecas.length).toBeGreaterThan(30);
    for (const c of cabecas) {
      expect(Math.abs(c.x)).toBeGreaterThan((SARCOMERO.zonaNua / 2) * k);
      expect(Math.abs(c.x)).toBeLessThan((SARCOMERO.grosso / 2) * k);
      expect(Math.sign(c.x)).toBe(c.lado);
    }
    expect(cabecas.filter((c) => c.lado < 0)).toHaveLength(cabecas.length / 2);
  });
});

describe('junções celulares', () => {
  const [xa, xb] = centrosCelulas();

  it('complexo juncional na ordem apical → basal: oclusão, adesão, desmossomo; hemidesmossomo na base', () => {
    const topo = JUNCOES.base + JUNCOES.altura;
    const desmossomoApical = JUNCOES.desmossomos[0];
    const meiaPlaca = JUNCOES.placaDesmossomo.raio;
    expect(JUNCOES.oclusao[1]).toBeLessThan(topo);
    expect(JUNCOES.oclusao[0]).toBeGreaterThan(JUNCOES.adesao[1]);
    expect(JUNCOES.adesao[0]).toBeGreaterThan(desmossomoApical.y + meiaPlaca);
    // o desmossomo do complexo é o mais apical; os outros ficam abaixo
    for (const d of JUNCOES.desmossomos.slice(1)) expect(d.y).toBeLessThan(desmossomoApical.y);
    // junção comunicante na face lateral, abaixo do complexo e acima da base
    const { y, raioPlaca } = JUNCOES.comunicante;
    expect(y + raioPlaca).toBeLessThan(desmossomoApical.y - meiaPlaca);
    expect(y - raioPlaca).toBeGreaterThan(JUNCOES.base);
    // hemidesmossomos na base, acima da lâmina basal
    for (const h of placasHemidesmossomo()) {
      const meia = JUNCOES.placaHemidesmossomo.espessura / 2;
      expect(h.centro[1] - meia).toBeGreaterThan(JUNCOES.base);
      expect(h.centro[1] + meia).toBeLessThan(Math.min(...JUNCOES.desmossomos.map((d) => d.y - meiaPlaca)));
      expect(JUNCOES.laminaBasal[1]).toBeLessThan(JUNCOES.base);
    }
    // microvilosidades no ápice das duas células
    for (const [x, z] of microvilosidades()) {
      const c = Math.abs(x - xa) < Math.abs(x - xb) ? xa : xb;
      expect(Math.abs(x - c)).toBeLessThan(JUNCOES.largura / 2);
      expect(Math.abs(z)).toBeLessThan(JUNCOES.profundidade / 2);
    }
  });

  it('zônulas circundam cada célula e se encontram no meio da fenda', () => {
    expect(xa).toBeCloseTo(-xb, 12);
    expect(xb - JUNCOES.largura / 2).toBeCloseTo(JUNCOES.fenda / 2, 12);
    const faixa = geometriaFaixa(0.1);
    faixa.computeBoundingBox();
    const caixa = faixa.boundingBox!;
    // a forma (x, profundidade) vai da membrana até o meio da fenda em todos os lados
    expect(caixa.max.x).toBeCloseTo(JUNCOES.largura / 2 + JUNCOES.fenda / 2, 6);
    expect(caixa.min.x).toBeCloseTo(-(JUNCOES.largura / 2 + JUNCOES.fenda / 2), 6);
    expect(caixa.max.y).toBeCloseTo(JUNCOES.profundidade / 2 + JUNCOES.fenda / 2, 6);
    expect(xa + caixa.max.x).toBeCloseTo(0, 6);
    expect(xb + caixa.min.x).toBeCloseTo(0, 6);
    faixa.dispose();
  });

  it('desmossomos com uma placa em cada célula; conexons atravessam a fenda e as duas membranas', () => {
    const placas = placasDesmossomo();
    expect(placas).toHaveLength(2 * JUNCOES.desmossomos.length);
    for (const p of placas) {
      const meia = JUNCOES.placaDesmossomo.espessura / 2;
      // placa no citoplasma da sua célula, junto à membrana lateral
      expect(Math.sign(p.centro[0])).toBe(p.lado);
      expect(Math.abs(p.centro[0]) - meia).toBeGreaterThan(JUNCOES.fenda / 2);
      expect(Math.abs(p.centro[0]) - meia - JUNCOES.fenda / 2).toBeLessThan(0.02);
    }
    const lista = conexons();
    expect(lista.length).toBeGreaterThanOrEqual(7);
    expect(COMPRIMENTO_CONEXON).toBeGreaterThan(JUNCOES.fenda);
    for (const [y, z] of lista) {
      expect(Math.hypot(y - JUNCOES.comunicante.y, z - JUNCOES.comunicante.z)).toBeLessThanOrEqual(JUNCOES.comunicante.raioPlaca);
      expect(Math.abs(z)).toBeLessThan(JUNCOES.profundidade / 2);
    }
  });

  it('filamentos de queratina no citoplasma, fora dos núcleos, presos às placas', () => {
    const nucleos = centrosNucleos();
    const [rx, ry, rz] = JUNCOES.nucleo.raios;
    const placas = [...placasDesmossomo().map((p) => p.centro), ...placasHemidesmossomo().map((h) => h.centro)];
    for (const pontos of trajetosQueratina()) {
      const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
      for (let i = 0; i <= 60; i++) {
        const p = curva.getPoint(i / 60);
        for (const n of nucleos) expect(((p.x - n[0]) / rx) ** 2 + ((p.y - n[1]) / ry) ** 2 + ((p.z - n[2]) / rz) ** 2).toBeGreaterThan(1);
        // dentro de uma das células (não atravessa a fenda)
        expect(Math.abs(p.x)).toBeGreaterThan(JUNCOES.fenda / 2);
        expect(p.y).toBeGreaterThan(JUNCOES.base);
      }
      // as duas pontas presas a uma placa (desmossomo ou hemidesmossomo)
      for (const extremo of [pontos[0], pontos[pontos.length - 1]]) {
        expect(Math.min(...placas.map((c) => Math.hypot(extremo[0] - c[0], extremo[1] - c[1], extremo[2] - c[2])))).toBeLessThan(0.12);
      }
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Montagem (renderer sem WebGL): orçamento por nível e toque de cada parte
// ---------------------------------------------------------------------------------------------
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
  const palco = document.createElement('div');
  palco.appendChild(canvas);
  document.body.appendChild(palco);
  const root = createRoot(canvas);
  await act(async () => {
    await root.configure({ gl: rendererStub(canvas), frameloop: 'never', size: { width: 390, height: 520, top: 0, left: 0 }, events: undefined });
    root.render(createElement('group', { name: 'modelo' }, createElement(MODELOS_HISTO_B[id].Componente)));
  });
  const cena = _roots.get(canvas)!.store.getState().scene as THREE.Scene;
  return {
    modelo: cena.getObjectByName('modelo')!,
    palco,
    desmontar: async () => {
      await act(async () => root.unmount());
      palco.remove();
    },
  };
}

function idDaParte(o: THREE.Object3D | null): string | null {
  for (let x = o; x; x = x.parent) if (x.userData?.parteId) return x.userData.parteId as string;
  return null;
}

/** Centros de até `n` triângulos de cada malha da parte, no mundo. */
function amostras(modelo: THREE.Object3D, id: string, n = 24): THREE.Vector3[] {
  const pontos: THREE.Vector3[] = [];
  modelo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || idDaParte(m) !== id) return;
    const pos = m.geometry.getAttribute('position');
    const indice = m.geometry.getIndex();
    const total = (indice ? indice.count : pos.count) / 3;
    const passo = Math.max(1, Math.floor(total / n));
    const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    for (let t = 0; t < total; t += passo) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(pos, indice ? indice.getX(3 * t + j) : 3 * t + j);
      pontos.push(v[0].clone().add(v[1]).add(v[2]).divideScalar(3).applyMatrix4(m.matrixWorld));
    }
  });
  return pontos;
}

const DIRECOES = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

describe('modelos do grupo B montados', () => {
  afterAll(() => forcarNivel(null));

  it('o texto lista exatamente as partes de cada modelo, em ordens 3, 4 e 5', () => {
    const textos = (modelosB as { modelos: { id: string; ordem: number; estruturas: { id: string }[]; revisao: { humano: unknown } }[] }).modelos;
    expect(textos.map((m) => m.ordem)).toEqual([3, 4, 5]);
    expect(new Set(textos.map((m) => m.id))).toEqual(new Set(Object.keys(MODELOS_HISTO_B)));
    for (const m of textos) {
      expect(new Set(m.estruturas.map((e) => e.id))).toEqual(new Set(MODELOS_HISTO_B[m.id].partes));
      expect(m.revisao.humano).toBeNull();
    }
  });

  for (const id of Object.keys(MODELOS_HISTO_B)) {
    it(`${id}: triângulos e malhas no orçamento de cada nível; todas as partes tocáveis`, async () => {
      const medidas = {} as Record<NivelQualidade, { triangulos: number; malhas: number }>;
      for (const nivel of NIVEIS) {
        forcarNivel(nivel);
        const { modelo, desmontar } = await montar(id);
        prepararMalhas(modelo, { raio: MODELOS_HISTO_B[id].raio, fator: PARAMETROS[nivel].fator });
        medidas[nivel] = contarCena(modelo);
        expect(excessos({ triangulos: medidas[nivel].triangulos, chamadas: medidas[nivel].malhas }, nivel), `${id} em ${nivel}`).toEqual([]);
        if (nivel === 'baixa') {
          // cada parte tem malha e é escolhida pelo toque em ao menos um raio de uma das 6 direções
          modelo.updateMatrixWorld(true);
          const raio = new THREE.Raycaster();
          const distancia = 10;
          for (const parte of MODELOS_HISTO_B[id].partes) {
            const pontos = amostras(modelo, parte);
            expect(pontos.length, parte).toBeGreaterThan(0);
            let acertou = false;
            for (const p of pontos) {
              for (const d of DIRECOES) {
                raio.set(p.clone().addScaledVector(d, distancia), d.clone().negate());
                if (resolverToque(raio.intersectObject(modelo, true)) === parte) { acertou = true; break; }
              }
              if (acertou) break;
            }
            expect(acertou, `${id}: ${parte} não é tocável`).toBe(true);
          }
        }
        await desmontar();
      }
      expect(medidas.alta.malhas).toBe(medidas.baixa.malhas);
      expect(medidas.media.triangulos).toBeGreaterThanOrEqual(medidas.baixa.triangulos);
      expect(medidas.alta.triangulos).toBeGreaterThan(medidas.baixa.triangulos);
      console.info(`${id}: ${medidas.baixa.triangulos} / ${medidas.media.triangulos} / ${medidas.alta.triangulos} triângulos (${medidas.baixa.malhas} malhas)`);
    }, 60000);
  }

  it('sarcômero: o controle de contração aparece fora do jogo e não deixa o toque passar', async () => {
    forcarNivel('baixa');
    const { palco, desmontar } = await montar('sarcomero');
    const entrada = palco.querySelector('input[type="range"]') as HTMLInputElement;
    expect(entrada).toBeTruthy();
    expect(palco.querySelector('output')!.textContent).toMatch(/Sarcômero 2,50 µm · A 1,60 µm \(constante\) · I 0,90 µm · H 0,50 µm/);
    let vazou = false;
    palco.addEventListener('pointerdown', () => { vazou = true; });
    entrada.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(vazou).toBe(false);
    await act(async () => {
      entrada.value = '1';
      entrada.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(palco.querySelector('output')!.textContent).toMatch(/Sarcômero 2,10 µm · A 1,60 µm \(constante\) · I 0,50 µm · H 0,10 µm/);
    await desmontar();
    expect(palco.querySelector('input')).toBeNull();
  });
});
