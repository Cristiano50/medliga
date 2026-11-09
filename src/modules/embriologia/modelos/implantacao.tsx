// Implantação (≈ dia 8) e disco bilaminar (≈ dias 12–13). Cortes esquemáticos em meia-esfera para ver o interior.
import { useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';
import { pontosEsfera } from './inicio.tsx';

/** Esfera com relevo irregular determinístico (aspecto de tecido invasivo). */
function esferaIrregular(raio: number, amplitude: number, detalhe = 5, semente = 1) {
  const g = new THREE.IcosahedronGeometry(raio, detalhe);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 7.1 + semente) * Math.cos(v.y * 6.3 - semente) * 0.6 +
      Math.sin(v.z * 9.7 + v.y * 3.1 + semente * 2) * 0.4;
    v.multiplyScalar(1 + amplitude * n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Meia esfera (corte sagital) para mostrar o interior. */
function meiaEsfera(r: number, seg = 48) {
  return new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75), Math.PI, Math.PI); // metade z ≤ 0: corte voltado para a câmera
}

export const PARTES_IMPLANTACAO = [
  'sinciciotrofoblasto',
  'citotrofoblasto',
  'epiblasto',
  'hipoblasto',
  'cavidade-amniotica',
  'blastocele',
  'endometrio',
];
export function ModeloImplantacao() {
  const g = useMemo(() => {
    const sincicio = esferaIrregular(1.18, 0.07, 5, 2);
    // mantém só a metade inferior (polo embrionário invadindo o endométrio) + fatia de corte
    const cito = meiaEsfera(1.0);
    const celoma = meiaEsfera(0.95);
    const disco = new THREE.CylinderGeometry(0.46, 0.46, 0.09, 40);
    const hipo = new THREE.CylinderGeometry(0.46, 0.46, 0.06, 40);
    const amnio = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const endometrio = new THREE.BoxGeometry(5, 2.2, 3.6);
    return { sincicio, cito, celoma, disco, hipo, amnio, endometrio };
  }, []);
  return (
    // Polo embrionário voltado para baixo, já dentro do endométrio.
    <group rotation={[0, -0.5, 0]}>
      <Parte id="endometrio" cor={COR.endometrio} opacidade={0.12} prioridade={0} rotulo={[1.9, 0.1, 1.2]}>
        <Malha geometria={g.endometrio} posicao={[0, -1.0, 0]} />
      </Parte>
      <Parte id="sinciciotrofoblasto" cor={COR.sinciciotrofoblasto} opacidade={0.4} prioridade={1} sombreamentoPlano rotulo={[0.9, -1.0, 0.3]}>
        <Malha geometria={g.sincicio} posicao={[0, -0.12, 0]} escala={[1.05, 0.95, 1.05]} />
      </Parte>
      <Parte id="citotrofoblasto" cor={COR.citotrofoblasto} opacidade={0.8} prioridade={2} rotulo={[-0.95, 0.35, -0.1]}>
        <Malha geometria={g.cito} />
      </Parte>
      <Parte id="blastocele" cor={COR.cavidade} opacidade={0.18} prioridade={1.5} rotulo={[0, 0.35, 0]}>
        <Malha geometria={g.celoma} />
      </Parte>
      <Parte id="cavidade-amniotica" cor={COR.amnio} opacidade={0.65} prioridade={6} rotulo={[0.1, -0.95, 0]}>
        <Malha geometria={g.amnio} posicao={[0, -0.64, 0]} escala={[1, 0.55, 1]} />
      </Parte>
      <Parte id="epiblasto" cor={COR.epiblasto} prioridade={7} rotulo={[0.55, -0.62, 0]}>
        <Malha geometria={g.disco} posicao={[0, -0.62, 0]} />
      </Parte>
      <Parte id="hipoblasto" cor={COR.hipoblasto} prioridade={7} rotulo={[0.55, -0.5, 0]}>
        <Malha geometria={g.hipo} posicao={[0, -0.545, 0]} />
      </Parte>
    </group>
  );
}

export const PARTES_DISCO_BILAMINAR = [
  'epiblasto',
  'hipoblasto',
  'cavidade-amniotica',
  'saco-vitelino',
  'mesoderma-extraembrionario',
  'celoma-extraembrionario',
  'pediculo-de-conexao',
  'citotrofoblasto',
  'sinciciotrofoblasto',
  'lacunas-trofoblasticas',
  'placa-precordal',
];
export function ModeloDiscoBilaminar() {
  const g = useMemo(() => {
    const sincicio = new THREE.SphereGeometry(1.7, 56, 40, Math.PI, Math.PI);
    const cito = meiaEsfera(1.5);
    const mesoExtra = meiaEsfera(1.42);
    const celoma = meiaEsfera(1.38);
    const lacuna = new THREE.SphereGeometry(0.09, 16, 12);
    const disco = new THREE.CylinderGeometry(0.46, 0.46, 0.09, 48);
    const hipo = new THREE.CylinderGeometry(0.46, 0.46, 0.06, 48);
    const amnio = new THREE.SphereGeometry(0.46, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const saco = new THREE.SphereGeometry(0.4, 40, 30);
    const pediculo = new THREE.CylinderGeometry(0.14, 0.2, 0.75, 24);
    const placa = new THREE.CylinderGeometry(0.09, 0.09, 0.07, 24);
    const lacunas = pontosEsfera(40, 1.6).filter((p) => p.z <= -0.05);
    return { sincicio, cito, mesoExtra, celoma, lacuna, disco, hipo, amnio, saco, pediculo, placa, lacunas };
  }, []);
  const y0 = 0.42; // altura do disco
  return (
    <group rotation={[0, -0.6, 0]}>
      <Parte id="sinciciotrofoblasto" cor={COR.sinciciotrofoblasto} opacidade={0.38} prioridade={0} rotulo={[0, 1.72, 0.2]}>
        <Malha geometria={g.sincicio} />
      </Parte>
      <Parte id="lacunas-trofoblasticas" cor={COR.lacuna} prioridade={6} rotulo={[1.1, 1.05, 0.5]}>
        {g.lacunas.map((p, i) => (
          <Malha key={i} geometria={g.lacuna} posicao={p} escala={0.8 + ((i * 37) % 10) / 20} />
        ))}
      </Parte>
      <Parte id="citotrofoblasto" cor={COR.citotrofoblasto} opacidade={0.75} prioridade={1} rotulo={[-1.25, -0.75, 0.4]}>
        <Malha geometria={g.cito} />
      </Parte>
      <Parte id="mesoderma-extraembrionario" cor={COR.mesodermaExtra} opacidade={0.85} prioridade={1.5} rotulo={[1.2, -0.6, 0.3]}>
        <Malha geometria={g.mesoExtra} />
      </Parte>
      <Parte id="celoma-extraembrionario" cor={COR.celoma} opacidade={0.1} prioridade={0.8} rotulo={[-0.8, -0.2, 0.6]}>
        <Malha geometria={g.celoma} />
      </Parte>
      <Parte id="pediculo-de-conexao" cor={COR.mesodermaExtra} prioridade={6} rotulo={[0, 1.4, 0]}>
        <Malha geometria={g.pediculo} posicao={[0, y0 + 0.62, 0]} />
      </Parte>
      <Parte id="cavidade-amniotica" cor={COR.amnio} opacidade={0.6} prioridade={5} rotulo={[0.3, y0 + 0.4, 0]}>
        <Malha geometria={g.amnio} posicao={[0, y0 + 0.045, 0]} escala={[1, 0.62, 1]} />
      </Parte>
      <Parte id="epiblasto" cor={COR.epiblasto} prioridade={7} rotulo={[0.62, y0 + 0.05, 0]}>
        <Malha geometria={g.disco} posicao={[0, y0, 0]} />
      </Parte>
      <Parte id="hipoblasto" cor={COR.hipoblasto} prioridade={7} rotulo={[0.62, y0 - 0.08, 0]}>
        <Malha geometria={g.hipo} posicao={[0, y0 - 0.075, 0]} />
      </Parte>
      <Parte id="placa-precordal" cor="#e8a33c" prioridade={9} rotulo={[-0.32, y0 - 0.13, 0.15]}>
        <Malha geometria={g.placa} posicao={[-0.3, y0 - 0.12, 0]} escala={[1.2, 1, 1]} />
      </Parte>
      <Parte id="saco-vitelino" cor={COR.sacoVitelino} opacidade={0.85} prioridade={6} rotulo={[0.42, -0.2, 0]}>
        <Malha geometria={g.saco} posicao={[0, -0.09, 0]} />
      </Parte>
    </group>
  );
}
