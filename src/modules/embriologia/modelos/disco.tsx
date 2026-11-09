// 3ª semana: gastrulação (disco trilaminar em vista "explodida") e neurulação (bloco em corte transversal).
import { useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';

function elipse(a: number, b: number, cx = 0, cy = 0, seg = 64): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector2(cx + Math.cos(t) * a, cy + Math.sin(t) * b));
  }
  return pts;
}

/** Forma oval do disco (mais largo na região cranial, como no disco em forma de pera). */
function formaDisco(a: number, b: number, buracos: THREE.Vector2[][] = []): THREE.Shape {
  const pts: THREE.Vector2[] = [];
  const seg = 80;
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    const y = Math.sin(t) * b;
    const largura = a * (0.82 + 0.18 * (y / b)); // cranial (+y) mais largo
    pts.push(new THREE.Vector2(Math.cos(t) * largura, y));
  }
  const s = new THREE.Shape(pts);
  for (const h of buracos) s.holes.push(new THREE.Path(h));
  return s;
}

function extrudar(forma: THREE.Shape, profundidade: number) {
  return new THREE.ExtrudeGeometry(forma, { depth: profundidade, bevelEnabled: false, curveSegments: 24 });
}

// Rotação que leva o plano XY da forma para o plano horizontal: forma +y → mundo −z (cranial ao fundo).
const DEITAR: [number, number, number] = [-Math.PI / 2, 0, 0];

export const PARTES_GASTRULACAO = [
  'linha-primitiva',
  'no-primitivo',
  'fosseta-primitiva',
  'processo-notocordal',
  'ectoderma',
  'mesoderma',
  'endoderma',
  'membrana-bucofaringea',
  'membrana-cloacal',
  'placa-precordal',
];
export function ModeloGastrulacao() {
  const a = 0.95;
  const b = 1.4;
  const zBuco = -1.15; // cranial
  const zCloaca = 1.2; // caudal
  const g = useMemo(() => {
    const ecto = extrudar(formaDisco(a, b), 0.06);
    const endo = extrudar(formaDisco(a, b), 0.06);
    const meso = extrudar(
      formaDisco(a * 0.97, b * 0.97, [elipse(0.2, 0.09, 0, -zBuco), elipse(0.14, 0.08, 0, -zCloaca)]),
      0.06,
    );
    const linha = new THREE.BoxGeometry(0.12, 0.05, 0.72);
    const no = new THREE.SphereGeometry(0.11, 24, 16);
    const fosseta = new THREE.CylinderGeometry(0.04, 0.04, 0.012, 20);
    const processo = new THREE.CylinderGeometry(0.045, 0.05, 1.1, 16);
    const placa = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24);
    const membranaB = new THREE.CylinderGeometry(0.2, 0.2, 0.88, 32);
    const membranaC = new THREE.CylinderGeometry(0.14, 0.14, 0.88, 32);
    return { ecto, endo, meso, linha, no, fosseta, processo, placa, membranaB, membranaC };
  }, []);
  // vista "explodida": as três camadas afastadas verticalmente
  const yEcto = 0.42;
  const yMeso = 0.0;
  const yEndo = -0.42;
  return (
    <group rotation={[0, 0.35, 0]}>
      <Parte id="ectoderma" cor={COR.ectoderma} opacidade={0.82} prioridade={2} rotulo={[-0.75, yEcto + 0.07, -0.3]}>
        <Malha geometria={g.ecto} posicao={[0, yEcto, 0]} rotacao={DEITAR} />
      </Parte>
      <Parte id="linha-primitiva" cor="#2f6fe0" prioridade={8} rotulo={[0.12, yEcto + 0.1, 0.8]}>
        <Malha geometria={g.linha} posicao={[0, yEcto + 0.075, 0.68]} />
      </Parte>
      <Parte id="no-primitivo" cor="#1e4fb8" prioridade={8} rotulo={[0.16, yEcto + 0.14, 0.3]}>
        <Malha geometria={g.no} posicao={[0, yEcto + 0.07, 0.3]} escala={[1, 0.55, 1]} />
      </Parte>
      <Parte id="fosseta-primitiva" cor="#0b1b40" prioridade={9} rotulo={[-0.12, yEcto + 0.16, 0.3]}>
        <Malha geometria={g.fosseta} posicao={[0, yEcto + 0.13, 0.3]} />
      </Parte>
      <Parte id="mesoderma" cor={COR.mesoderma} opacidade={0.92} prioridade={2} rotulo={[0.8, yMeso + 0.07, 0.1]}>
        <Malha geometria={g.meso} posicao={[0, yMeso, 0]} rotacao={DEITAR} />
      </Parte>
      <Parte id="processo-notocordal" cor={COR.notocorda} prioridade={8} rotulo={[0.1, yMeso + 0.12, -0.3]}>
        <Malha geometria={g.processo} posicao={[0, yMeso + 0.06, -0.25]} rotacao={[Math.PI / 2, 0, 0]} />
      </Parte>
      <Parte id="placa-precordal" cor="#e8a33c" prioridade={8} rotulo={[0.14, yMeso + 0.1, -0.88]}>
        <Malha geometria={g.placa} posicao={[0, yMeso + 0.03, -0.88]} escala={[1.2, 1, 0.7]} />
      </Parte>
      <Parte id="endoderma" cor={COR.endoderma} opacidade={0.95} prioridade={2} rotulo={[0.75, yEndo + 0.07, 0.4]}>
        <Malha geometria={g.endo} posicao={[0, yEndo, 0]} rotacao={DEITAR} />
      </Parte>
      {/* Membranas: ectoderma e endoderma unidos, sem mesoderma entre eles (coluna translúcida atravessa o "furo" do mesoderma). */}
      <Parte id="membrana-bucofaringea" cor="#c4b5fd" opacidade={0.55} prioridade={7} rotulo={[0, yEcto + 0.12, zBuco]}>
        <Malha geometria={g.membranaB} posicao={[0, 0.03, zBuco]} escala={[1, 1, 0.45]} />
      </Parte>
      <Parte id="membrana-cloacal" cor="#c4b5fd" opacidade={0.55} prioridade={7} rotulo={[0, yEcto + 0.12, zCloaca]}>
        <Malha geometria={g.membranaC} posicao={[0, 0.03, zCloaca]} escala={[1, 1, 0.55]} />
      </Parte>
    </group>
  );
}

// ---------------------------------------------------------------------------------------------
// Neurulação: bloco do tronco com a face anterior em corte transversal (como nos esquemas dos livros).

function poligono(pts: [number, number][]): THREE.Shape {
  return new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
}

function espelhar(pts: [number, number][]): [number, number][] {
  return pts.map(([x, y]) => [-x, y] as [number, number]).reverse();
}

function parabola(x0: number, x1: number, y0: number, k: number, n = 24): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([x, y0 + k * x * x]);
  }
  return pts;
}

export const PARTES_NEURULACAO = [
  'placa-neural',
  'pregas-neurais',
  'sulco-neural',
  'crista-neural',
  'notocorda',
  'somitos',
  'mesoderma-intermediario',
  'mesoderma-somatico',
  'mesoderma-esplancnico',
  'celoma-intraembrionario',
  'ectoderma',
  'endoderma',
];
export function ModeloNeurulacao() {
  const L = 2.2;
  const g = useMemo(() => {
    const ex = (s: THREE.Shape, d = L) => {
      const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 20 });
      geo.translate(0, 0, -d / 2);
      return geo;
    };
    // Placa neural (assoalho do sulco): faixa central em U
    const k1 = 1.796; // fundo externo: y = 0.24 + k1 x²
    const k2 = 1.701; // superfície do sulco: y = 0.34 + k2 x²
    const placa = poligono([...parabola(-0.22, 0.22, 0.24, k1), ...parabola(0.22, -0.22, 0.34, k2)]);
    const pregaDir = poligono([
      ...parabola(0.22, 0.46, 0.24, k1),
      [0.45, 0.67],
      [0.42, 0.64],
      ...parabola(0.42, 0.22, 0.34, k2),
    ]);
    const pregaEsq = poligono(espelhar([...parabola(0.22, 0.46, 0.24, k1), [0.45, 0.67], [0.42, 0.64], ...parabola(0.42, 0.22, 0.34, k2)]));
    const sulco = poligono([...parabola(-0.4, 0.4, 0.345, k2), [0.4, 0.62], [-0.4, 0.62]]);
    const crista = new THREE.Shape();
    crista.absarc(0, 0, 0.05, 0, Math.PI * 2, false);
    const ectoDir = poligono([
      [0.49, 0.62],
      [1.6, 0.47],
      [1.6, 0.39],
      [0.49, 0.53],
    ]);
    const ectoEsq = poligono(espelhar([
      [0.49, 0.62],
      [1.6, 0.47],
      [1.6, 0.39],
      [0.49, 0.53],
    ]));
    const noto = new THREE.Shape();
    noto.absarc(0, 0.1, 0.08, 0, Math.PI * 2, false);
    const somito = new THREE.Shape();
    // retângulo arredondado
    const r = 0.06;
    const [sx0, sx1, sy0, sy1] = [0.14, 0.56, -0.05, 0.22];
    somito.moveTo(sx0 + r, sy0);
    somito.lineTo(sx1 - r, sy0);
    somito.quadraticCurveTo(sx1, sy0, sx1, sy0 + r);
    somito.lineTo(sx1, sy1 - r);
    somito.quadraticCurveTo(sx1, sy1, sx1 - r, sy1);
    somito.lineTo(sx0 + r, sy1);
    somito.quadraticCurveTo(sx0, sy1, sx0, sy1 - r);
    somito.lineTo(sx0, sy0 + r);
    somito.quadraticCurveTo(sx0, sy0, sx0 + r, sy0);
    const inter = new THREE.Shape();
    inter.absarc(0.68, 0.1, 0.07, 0, Math.PI * 2, false);
    const somatico = poligono([
      [0.78, 0.25],
      [1.6, 0.25],
      [1.6, 0.33],
      [0.78, 0.33],
    ]);
    const esplancnico = poligono([
      [0.78, -0.06],
      [1.6, -0.06],
      [1.6, 0.02],
      [0.78, 0.02],
    ]);
    const celoma = poligono([
      [0.8, 0.03],
      [1.6, 0.03],
      [1.6, 0.24],
      [0.8, 0.24],
    ]);
    const endo = poligono([
      [-1.6, -0.18],
      [1.6, -0.18],
      [1.6, -0.1],
      [-1.6, -0.1],
    ]);
    const segmentos = [-0.81, -0.27, 0.27, 0.81];
    return {
      placa: ex(placa),
      pregaDir: ex(pregaDir),
      pregaEsq: ex(pregaEsq),
      sulco: ex(sulco),
      crista: ex(crista),
      ectoDir: ex(ectoDir),
      ectoEsq: ex(ectoEsq),
      noto: ex(noto),
      somito: ex(somito, 0.46),
      inter: ex(inter),
      somatico: ex(somatico),
      esplancnico: ex(esplancnico),
      celoma: ex(celoma),
      endo: ex(endo),
      segmentos,
    };
  }, []);
  return (
    <group rotation={[0.25, -0.55, 0]} position={[0, -0.2, 0]}>
      <Parte id="placa-neural" cor={COR.neuroectoderma} prioridade={6} rotulo={[0, 0.32, 1.1]}>
        <Malha geometria={g.placa} />
      </Parte>
      <Parte id="pregas-neurais" cor="#38bdf8" prioridade={6} rotulo={[0.4, 0.72, 1.1]}>
        <Malha geometria={g.pregaDir} />
        <Malha geometria={g.pregaEsq} />
      </Parte>
      <Parte id="sulco-neural" cor="#e0f2fe" opacidade={0.18} prioridade={3} rotulo={[0, 0.6, 0.6]}>
        <Malha geometria={g.sulco} />
      </Parte>
      <Parte id="crista-neural" cor={COR.cristaNeural} prioridade={8} rotulo={[-0.47, 0.75, 1.1]}>
        <Malha geometria={g.crista} posicao={[0.47, 0.66, 0]} />
        <Malha geometria={g.crista} posicao={[-0.47, 0.66, 0]} />
      </Parte>
      <Parte id="ectoderma" cor={COR.ectoderma} prioridade={5} rotulo={[1.2, 0.55, 1.1]}>
        <Malha geometria={g.ectoDir} />
        <Malha geometria={g.ectoEsq} />
      </Parte>
      <Parte id="notocorda" cor={COR.notocorda} prioridade={8} rotulo={[0, 0.12, 1.15]}>
        <Malha geometria={g.noto} />
      </Parte>
      <Parte id="somitos" ladoDuplo cor={COR.mesoderma} prioridade={6} rotulo={[0.35, 0.25, 1.05]}>
        {g.segmentos.map((z) => (
          <group key={z}>
            <Malha geometria={g.somito} posicao={[0, 0, z]} />
            <Malha geometria={g.somito} posicao={[0, 0, z]} escala={[-1, 1, 1]} />
          </group>
        ))}
      </Parte>
      <Parte id="mesoderma-intermediario" ladoDuplo cor="#f97366" prioridade={7} rotulo={[0.68, 0.2, 1.1]}>
        <Malha geometria={g.inter} />
        <Malha geometria={g.inter} escala={[-1, 1, 1]} />
      </Parte>
      <Parte id="mesoderma-somatico" ladoDuplo cor={COR.mesodermaClaro} prioridade={6} rotulo={[1.25, 0.34, 1.1]}>
        <Malha geometria={g.somatico} />
        <Malha geometria={g.somatico} escala={[-1, 1, 1]} />
      </Parte>
      <Parte id="mesoderma-esplancnico" ladoDuplo cor="#d9443a" prioridade={6} rotulo={[1.25, 0.0, 1.1]}>
        <Malha geometria={g.esplancnico} />
        <Malha geometria={g.esplancnico} escala={[-1, 1, 1]} />
      </Parte>
      <Parte id="celoma-intraembrionario" ladoDuplo cor={COR.celoma} opacidade={0.25} prioridade={3} rotulo={[-1.2, 0.14, 1.1]}>
        <Malha geometria={g.celoma} />
        <Malha geometria={g.celoma} escala={[-1, 1, 1]} />
      </Parte>
      <Parte id="endoderma" cor={COR.endoderma} prioridade={5} rotulo={[0.9, -0.12, 1.1]}>
        <Malha geometria={g.endo} />
      </Parte>
    </group>
  );
}
