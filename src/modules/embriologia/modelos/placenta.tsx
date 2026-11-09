// Útero gestante no início do período fetal, em corte (metade posterior visível): placenta, decíduas e membranas.
import { useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';
import { FetoSimples } from './embriao.tsx';

const META = { phiStart: Math.PI, phiLength: Math.PI }; // metade z ≤ 0

function casca(r: number, thetaInicio = 0, thetaComp = Math.PI) {
  return new THREE.SphereGeometry(r, 64, 40, META.phiStart, META.phiLength, thetaInicio, thetaComp);
}

export const PARTES_PLACENTA = [
  'decidua-basal',
  'decidua-capsular',
  'decidua-parietal',
  'corio-frondoso',
  'corio-liso',
  'amnio',
  'cavidade-amniotica',
  'cordao-umbilical',
  'feto',
  'miometrio',
];
export function ModeloPlacenta() {
  const g = useMemo(() => {
    const capa = 0.62; // ângulo (rad) da região placentária no topo
    const cordaoCurva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.27, -0.39, 0.1),
      new THREE.Vector3(-0.72, 0.05, 0.28),
      new THREE.Vector3(-0.35, 0.62, 0.22),
      new THREE.Vector3(0.12, 1.05, 0.05),
      new THREE.Vector3(0, 1.5, -0.05),
    ]);
    return {
      miometrioExt: casca(2.25),
      miometrioInt: casca(2.0),
      miometrioCorte: new THREE.RingGeometry(2.0, 2.25, 96),
      deciduaParietal: casca(1.98, capa, Math.PI - capa),
      deciduaParietalCorte: new THREE.RingGeometry(1.9, 1.98, 96, 1, Math.PI / 2 + capa, 2 * Math.PI - 2 * capa),
      deciduaBasal: new THREE.SphereGeometry(1, 48, 24, META.phiStart, META.phiLength),
      corioFrondoso: new THREE.SphereGeometry(1, 48, 24, META.phiStart, META.phiLength),
      vilosidade: new THREE.ConeGeometry(0.05, 0.22, 8),
      deciduaCapsular: casca(1.66, capa + 0.05, Math.PI - capa - 0.05),
      corioLiso: casca(1.58, capa + 0.05, Math.PI - capa - 0.05),
      amnio: casca(1.5),
      liquido: casca(1.47),
      cordao: new THREE.TubeGeometry(cordaoCurva, 80, 0.065, 12, false),
    };
  }, []);
  const vilosidades = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 26; i++) {
      const x = -0.95 + (i % 13) * 0.16;
      const z = i < 13 ? -0.15 : -0.45;
      pts.push([x, 1.62, z]);
    }
    return pts;
  }, []);
  return (
    <group rotation={[0, -0.35, 0]} position={[0, -0.1, 0]} scale={0.9}>
      <Parte id="miometrio" cor={COR.miometrio} prioridade={0} ladoDuplo rotulo={[2.0, -0.9, 0.2]}>
        <Malha geometria={g.miometrioExt} />
        <Malha geometria={g.miometrioInt} />
        <Malha geometria={g.miometrioCorte} />
      </Parte>
      <Parte id="decidua-parietal" cor={COR.decidua} prioridade={1} ladoDuplo rotulo={[-1.75, -0.7, 0.1]}>
        <Malha geometria={g.deciduaParietal} />
        <Malha geometria={g.deciduaParietalCorte} />
      </Parte>
      <Parte id="decidua-basal" cor="#d98a95" prioridade={4} ladoDuplo rotulo={[1.25, 1.95, 0]}>
        <Malha geometria={g.deciduaBasal} posicao={[0, 1.84, 0]} escala={[1.25, 0.17, 1.25]} />
      </Parte>
      <Parte id="corio-frondoso" cor={COR.placenta} prioridade={5} ladoDuplo rotulo={[-1.2, 1.62, 0]}>
        <Malha geometria={g.corioFrondoso} posicao={[0, 1.66, 0]} escala={[1.12, 0.15, 1.12]} />
        {vilosidades.map((p, i) => (
          <Malha key={i} geometria={g.vilosidade} posicao={p} rotacao={[Math.PI, 0, 0]} />
        ))}
      </Parte>
      <Parte id="decidua-capsular" cor="#efb8bf" opacidade={0.85} prioridade={2} rotulo={[1.3, -0.9, 0.1]}>
        <Malha geometria={g.deciduaCapsular} posicao={[0, 0.06, 0]} />
      </Parte>
      <Parte id="corio-liso" cor={COR.corio} opacidade={0.9} prioridade={2.5} rotulo={[-1.25, -0.8, 0.1]}>
        <Malha geometria={g.corioLiso} posicao={[0, 0.06, 0]} />
      </Parte>
      <Parte id="amnio" cor={COR.amnio} opacidade={0.7} prioridade={3} rotulo={[1.25, 0.2, 0.1]}>
        <Malha geometria={g.amnio} posicao={[0, 0.06, 0]} />
      </Parte>
      <Parte id="cavidade-amniotica" cor={COR.cavidade} opacidade={0.16} prioridade={3.5} rotulo={[0.75, -0.95, 0.1]}>
        <Malha geometria={g.liquido} posicao={[0, 0.06, 0]} />
      </Parte>
      <FetoSimples posicao={[0, -0.25, 0.1]} escala={0.75} />
      <Parte id="cordao-umbilical" cor={COR.cordao} prioridade={7} rotulo={[-0.7, 0.25, 0.3]}>
        <Malha geometria={g.cordao} />
      </Parte>
    </group>
  );
}
