// Implantação (≈ dia 8) e disco bilaminar (≈ dias 12–13). Cortes esquemáticos em meia-esfera para ver o interior.
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';
import { pontosEsfera } from './inicio.tsx';

/** Sincício polar (−y), em corte z=0. Espessura didática, não medida histológica. */
export function geometriaSincicioPolar() {
  const colunas = 40;
  const linhas = 24;
  const pontos: number[] = [];
  const indices: number[] = [];
  const stride = colunas + 1;
  const camada = stride * (linhas + 1);
  for (let face = 0; face < 2; face++) {
    for (let j = 0; j <= linhas; j++) {
      const theta = Math.PI / 2 + (j / linhas) * Math.PI / 2;
      for (let i = 0; i <= colunas; i++) {
        const phi = Math.PI + (i / colunas) * Math.PI;
        const polar = -Math.cos(theta);
        const relevo = 0.018 * Math.sin(phi * 7) * Math.sin(theta * 9) * polar;
        const raio = face === 0 ? 1.025 + 0.19 * polar + relevo : 1.005;
        pontos.push(-raio * Math.cos(phi) * Math.sin(theta), raio * Math.cos(theta), raio * Math.sin(phi) * Math.sin(theta));
      }
    }
  }
  const quad = (a: number, b: number, c: number, d: number) => indices.push(a, b, d, b, c, d);
  for (let j = 0; j < linhas; j++) {
    for (let i = 0; i < colunas; i++) {
      const a = j * stride + i;
      quad(a, a + stride, a + stride + 1, a + 1);
      quad(a + camada, a + camada + 1, a + camada + stride + 1, a + camada + stride);
    }
    for (const i of [0, colunas]) {
      const a = j * stride + i;
      quad(a, a + camada, a + camada + stride, a + stride);
    }
  }
  for (let i = 0; i < colunas; i++) quad(i, i + 1, i + 1 + camada, i + camada);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pontos, 3));
  g.setIndex(indices);
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
    const sincicio = geometriaSincicioPolar();
    // Todas as camadas compartilham o corte z=0; polo embrionário voltado para −y.
    const cito = meiaEsfera(1.0);
    const celoma = meiaEsfera(0.95);
    const disco = new THREE.CylinderGeometry(0.46, 0.46, 0.09, 40, 1, false, Math.PI / 2, Math.PI);
    const hipo = new THREE.CylinderGeometry(0.46, 0.46, 0.06, 40, 1, false, Math.PI / 2, Math.PI);
    const amnio = new THREE.SphereGeometry(0.4, 32, 16, Math.PI, Math.PI, Math.PI / 2, Math.PI / 2);
    const endometrio = new THREE.BoxGeometry(5, 2.2, 1.8);
    return { sincicio, cito, celoma, disco, hipo, amnio, endometrio };
  }, []);
  useEffect(() => () => Object.values(g).forEach((geometria) => geometria.dispose()), [g]);
  return (
    // Polo embrionário voltado para baixo, já dentro do endométrio.
    <group rotation={[0, -0.5, 0]}>
      <Parte id="endometrio" cor={COR.endometrio} opacidade={0.12} prioridade={0} rotulo={[1.9, 0.1, 1.2]}>
        <Malha geometria={g.endometrio} posicao={[0, -1.0, -0.9]} />
      </Parte>
      <Parte id="sinciciotrofoblasto" cor={COR.sinciciotrofoblasto} opacidade={0.4} prioridade={1} sombreamentoPlano rotulo={[0.9, -1.0, 0.3]}>
        <Malha geometria={g.sincicio} />
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
