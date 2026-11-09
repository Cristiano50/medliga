// Estágios iniciais: zigoto, clivagem, mórula, blastocisto (esquemáticos, fora de escala relativa entre estágios).
import { useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';

function useEsfera(r: number, seg = 48) {
  return useMemo(() => new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), [r, seg]);
}

/** Pontos aproximadamente uniformes numa esfera (espiral de Fibonacci), determinísticos. */
export function pontosEsfera(n: number, raio: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const ouro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = ouro * i;
    pts.push(new THREE.Vector3(Math.cos(t) * r * raio, y * raio, Math.sin(t) * r * raio));
  }
  return pts;
}

function ZonaPelucida({ raio = 1.25, aberta = false }: { raio?: number; aberta?: boolean }) {
  const geo = useMemo(
    () => (aberta ? new THREE.SphereGeometry(raio, 48, 36, 0, Math.PI * 2, 0, Math.PI * 0.72) : new THREE.SphereGeometry(raio, 48, 36)),
    [raio, aberta],
  );
  return (
    <Parte id="zona-pelucida" cor={COR.zonaPelucida} opacidade={0.22} prioridade={0} rotulo={[0, raio, 0]}>
      <Malha geometria={geo} />
    </Parte>
  );
}

function CorpusculosPolares({ raio = 1.12 }: { raio?: number }) {
  const g = useEsfera(0.1, 24);
  return (
    <Parte id="corpusculo-polar" cor="#f6e3cf" prioridade={6}>
      <Malha geometria={g} posicao={[0.18, raio, 0.12]} />
      <Malha geometria={g} posicao={[-0.08, raio - 0.01, 0.22]} escala={0.85} />
    </Parte>
  );
}

export const PARTES_ZIGOTO = ['zona-pelucida', 'zigoto', 'pronucleo-masculino', 'pronucleo-feminino', 'corpusculo-polar'];
export function ModeloZigoto() {
  const cito = useEsfera(1.0, 64);
  const pn = useEsfera(0.23, 32);
  return (
    <group>
      <ZonaPelucida />
      <Parte id="zigoto" cor={COR.citoplasma} opacidade={0.42} prioridade={2} rotulo={[0.75, 0.55, 0.4]}>
        <Malha geometria={cito} />
      </Parte>
      <Parte id="pronucleo-masculino" cor={COR.pronucleoMasc} prioridade={8}>
        <Malha geometria={pn} posicao={[-0.25, 0.04, 0]} />
      </Parte>
      <Parte id="pronucleo-feminino" cor={COR.pronucleoFem} prioridade={8}>
        <Malha geometria={pn} posicao={[0.25, -0.03, 0.02]} escala={1.05} />
      </Parte>
      <CorpusculosPolares />
    </group>
  );
}

export const PARTES_CLIVAGEM = ['zona-pelucida', 'blastomero'];
export function ModeloClivagem() {
  const g = useEsfera(0.5, 48);
  // tetraedro: arranjo frequente no embrião humano de 4 células
  const pos: [number, number, number][] = [
    [0.35, 0.35, 0.35],
    [-0.35, -0.35, 0.35],
    [-0.35, 0.35, -0.35],
    [0.35, -0.35, -0.35],
  ];
  return (
    <group>
      <ZonaPelucida />
      <Parte id="blastomero" cor={COR.blastomero} rugosidade={0.5} rotulo={[0.35, 0.9, 0.35]}>
        {pos.map((p, i) => (
          <Malha key={i} geometria={g} posicao={p} />
        ))}
      </Parte>
    </group>
  );
}

export const PARTES_MORULA = ['zona-pelucida', 'morula', 'blastomero'];
export function ModeloMorula() {
  const externa = useEsfera(0.34, 32);
  const pts = useMemo(() => pontosEsfera(14, 0.66), []);
  const internos = useMemo(() => pontosEsfera(4, 0.22), []);
  const contorno = useEsfera(1.02, 48);
  return (
    <group>
      <ZonaPelucida />
      {/* Volume da mórula como um todo (para identificação); células individuais = blastômeros */}
      <Parte id="morula" cor={COR.blastomero} opacidade={0.12} prioridade={1} rotulo={[-0.7, 0.75, 0.3]}>
        <Malha geometria={contorno} />
      </Parte>
      <Parte id="blastomero" cor={COR.blastomero} rugosidade={0.5} rotulo={[0.35, 1.0, 0.2]}>
        {pts.map((p, i) => (
          <Malha key={i} geometria={externa} posicao={p} escala={[1, 0.92, 1]} />
        ))}
        {internos.map((p, i) => (
          <Malha key={`i${i}`} geometria={externa} posicao={p} escala={0.9} />
        ))}
      </Parte>
    </group>
  );
}

export const PARTES_BLASTOCISTO = ['zona-pelucida', 'trofoblasto', 'embrioblasto', 'blastocele'];
export function ModeloBlastocisto() {
  const trofo = useMemo(() => new THREE.IcosahedronGeometry(1.05, 4), []);
  const cel = useEsfera(0.98, 48);
  const icm = useEsfera(0.2, 24);
  const pontosICM = useMemo(() => {
    // aglomerado no polo embrionário (topo), por dentro do trofoblasto
    const base = [
      [0, 0.78, 0],
      [0.22, 0.72, 0.05],
      [-0.22, 0.72, -0.04],
      [0.05, 0.72, 0.23],
      [-0.06, 0.72, -0.24],
      [0.18, 0.62, -0.18],
      [-0.17, 0.62, 0.18],
      [0, 0.58, 0],
      [0.3, 0.58, 0.12],
      [-0.3, 0.58, -0.1],
    ];
    return base as [number, number, number][];
  }, []);
  return (
    <group>
      <ZonaPelucida raio={1.22} aberta />
      <Parte id="trofoblasto" cor={COR.trofoblasto} opacidade={0.38} prioridade={1} sombreamentoPlano rotulo={[-0.8, -0.65, 0.4]}>
        <Malha geometria={trofo} />
      </Parte>
      <Parte id="blastocele" cor={COR.cavidade} opacidade={0.12} prioridade={0.5} rotulo={[0, -0.2, 0]}>
        <Malha geometria={cel} escala={[0.96, 0.96, 0.96]} />
      </Parte>
      <Parte id="embrioblasto" cor={COR.embrioblasto} prioridade={7} rotulo={[0, 1.0, 0]}>
        {pontosICM.map((p, i) => (
          <Malha key={i} geometria={icm} posicao={p} />
        ))}
      </Parte>
    </group>
  );
}
