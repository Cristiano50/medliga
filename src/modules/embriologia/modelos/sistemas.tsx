// Embriologia dos sistemas: coração (tubo reto e alça cardíaca) e aparelho faríngeo.
// Esquemas didáticos, fora de escala; IDs alinhados aos tópicos emb-12 e emb-13.
import { useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';

type V3 = [number, number, number];
const ESFERA = new THREE.SphereGeometry(1, 32, 24);

const CORES_CORACAO = {
  seio: '#7c6fd6',
  atrio: '#d9707c',
  ventriculo: '#c2414d',
  bulbo: '#e0895a',
  tronco: '#e8b04a',
  veia: '#6d8fd8',
  pericardio: '#fde2e4',
  mesocardio: '#f4b7a8',
};

/** Tubo com perfil de raio variável ao longo do eixo y (LatheGeometry). */
function lathe(perfil: [number, number][]) {
  return new THREE.LatheGeometry(
    perfil.map(([r, y]) => new THREE.Vector2(r, y)),
    40,
  );
}

function tubo(pontos: V3[], raio: number) {
  const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curva, 48, raio, 20, false);
}

// ---------------------------------------------------------------------------------------------
export const PARTES_CORACAO_TUBULAR = [
  'seio-venoso',
  'atrio-primitivo',
  'ventriculo-primitivo',
  'bulbo-cardiaco',
  'tronco-arterial',
  'saco-aortico',
  'arcos-aorticos',
  'mesocardio-dorsal',
  'cavidade-pericardica',
  'veias-vitelinas',
  'veias-umbilicais',
  'veias-cardinais',
];
/** ≈ dia 22: tubo cardíaco reto; polo arterial cranial (em cima), polo venoso caudal (embaixo). Vista ventral. */
export function ModeloCoracaoTubular() {
  const g = useMemo(
    () => ({
      // [raio, y] de baixo (caudal) para cima (cranial); estreitamentos marcam os sulcos entre as regiões
      seio: lathe([[0.001, -1.2], [0.2, -1.18], [0.24, -1.05], [0.22, -0.82], [0.17, -0.74]]),
      atrio: lathe([[0.17, -0.74], [0.28, -0.6], [0.31, -0.45], [0.27, -0.3], [0.18, -0.22]]),
      ventriculo: lathe([[0.18, -0.22], [0.32, -0.08], [0.36, 0.1], [0.32, 0.28], [0.2, 0.38]]),
      bulbo: lathe([[0.2, 0.38], [0.27, 0.5], [0.27, 0.72], [0.18, 0.86]]),
      tronco: lathe([[0.18, 0.86], [0.16, 1.0], [0.15, 1.14], [0.18, 1.22]]),
      saco: new THREE.SphereGeometry(0.2, 24, 16),
      arco: new THREE.TorusGeometry(0.28, 0.035, 10, 32, Math.PI * 0.9),
      mesocardio: new THREE.BoxGeometry(0.06, 1.7, 0.42),
      pericardio: new THREE.SphereGeometry(1, 48, 32, Math.PI, Math.PI),
      vitelina: tubo([[0.12, -1.12, 0.05], [0.28, -1.35, 0.15], [0.38, -1.7, 0.2]], 0.055),
      umbilical: tubo([[0.18, -1.08, 0], [0.5, -1.25, 0.05], [0.75, -1.55, 0.1]], 0.06),
      cardinal: tubo([[0.2, -1.0, -0.08], [0.55, -0.95, -0.25], [0.9, -0.8, -0.35]], 0.06),
    }),
    [],
  );
  const lados = [1, -1];
  return (
    <group position={[0, 0.15, 0]}>
      <Parte id="cavidade-pericardica" cor={CORES_CORACAO.pericardio} opacidade={0.14} prioridade={0} rotulo={[0.8, 0.6, -0.1]}>
        <Malha geometria={g.pericardio} escala={[0.85, 1.45, 0.75]} />
      </Parte>
      <Parte id="mesocardio-dorsal" cor={CORES_CORACAO.mesocardio} opacidade={0.7} prioridade={2} rotulo={[0, 0.2, -0.6]}>
        <Malha geometria={g.mesocardio} posicao={[0, 0.05, -0.42]} rotacao={[0, Math.PI / 2, 0]} />
      </Parte>
      <Parte id="seio-venoso" cor={CORES_CORACAO.seio} prioridade={6}>
        <Malha geometria={g.seio} />
      </Parte>
      <Parte id="atrio-primitivo" cor={CORES_CORACAO.atrio} prioridade={6}>
        <Malha geometria={g.atrio} />
      </Parte>
      <Parte id="ventriculo-primitivo" cor={CORES_CORACAO.ventriculo} prioridade={6}>
        <Malha geometria={g.ventriculo} />
      </Parte>
      <Parte id="bulbo-cardiaco" cor={CORES_CORACAO.bulbo} prioridade={6}>
        <Malha geometria={g.bulbo} />
      </Parte>
      <Parte id="tronco-arterial" cor={CORES_CORACAO.tronco} prioridade={6}>
        <Malha geometria={g.tronco} />
      </Parte>
      <Parte id="saco-aortico" cor="#f0c36a" prioridade={6}>
        <Malha geometria={g.saco} posicao={[0, 1.3, 0]} escala={[1.2, 0.7, 0.9]} />
      </Parte>
      <Parte id="arcos-aorticos" cor="#e35d5d" prioridade={7}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.arco} posicao={[l * 0.02, 1.32, -0.25]} rotacao={[0, l > 0 ? -Math.PI / 2 : Math.PI / 2, 0]} />
        ))}
      </Parte>
      <Parte id="veias-vitelinas" cor="#8aa6e6" prioridade={7}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.vitelina} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="veias-umbilicais" cor={CORES_CORACAO.veia} prioridade={7}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.umbilical} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="veias-cardinais" cor="#5468b8" prioridade={7}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.cardinal} escala={[l, 1, 1]} />
        ))}
      </Parte>
    </group>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_CORACAO_ALCA = [
  'seio-venoso',
  'atrio-primitivo',
  'ventriculo-primitivo',
  'bulbo-cardiaco',
  'tronco-arterial',
  'sulco-bulboventricular',
  'cavidade-pericardica',
];
/**
 * ≈ dia 28: alça cardíaca concluída (alça em D). Vista ventral: o lado esquerdo do embrião fica à direita da tela (+x).
 * Átrio e seio venoso passam para a posição dorsal e cranial; o ventrículo primitivo desloca-se para a esquerda e
 * caudalmente; o bulbo cardíaco fica à direita do embrião.
 */
export function ModeloCoracaoAlca() {
  const g = useMemo(() => {
    const P: V3[] = [
      [0.0, 0.15, -0.65],
      [0.0, 0.4, -0.55],
      [0.08, 0.58, -0.38],
      [0.2, 0.62, -0.15],
      [0.35, 0.4, 0.05],
      [0.38, 0.0, 0.3],
      [0.22, -0.45, 0.42],
      [-0.08, -0.55, 0.42],
      [-0.35, -0.3, 0.38],
      [-0.38, 0.15, 0.32],
      [-0.22, 0.55, 0.25],
      [0.0, 0.95, 0.18],
    ];
    const seg = (a: number, b: number) => P.slice(a, b + 1);
    return {
      seio: tubo(seg(0, 2), 0.17),
      cornos: tubo([[-0.42, 0.0, -0.7], [0, 0.12, -0.66], [0.42, 0.0, -0.7]], 0.11),
      atrio: tubo(seg(2, 4), 0.27),
      ventriculo: tubo(seg(4, 7), 0.31),
      bulbo: tubo(seg(7, 9), 0.23),
      tronco: tubo(seg(9, 11), 0.15),
      sulco: new THREE.TorusGeometry(0.25, 0.03, 10, 32),
      pericardio: new THREE.SphereGeometry(1, 48, 32, Math.PI, Math.PI),
      P,
    };
  }, []);
  // cada região: seu segmento de tubo + uma esfera na junção com a anterior (suaviza a passagem)
  const juntas: { id: string; cor: string; geo: THREE.BufferGeometry; extra?: THREE.BufferGeometry; p: V3; r: number }[] = [
    { id: 'seio-venoso', cor: CORES_CORACAO.seio, geo: g.seio, extra: g.cornos, p: g.P[0], r: 0.17 },
    { id: 'atrio-primitivo', cor: CORES_CORACAO.atrio, geo: g.atrio, p: g.P[2], r: 0.25 },
    { id: 'ventriculo-primitivo', cor: CORES_CORACAO.ventriculo, geo: g.ventriculo, p: g.P[4], r: 0.27 },
    { id: 'bulbo-cardiaco', cor: CORES_CORACAO.bulbo, geo: g.bulbo, p: g.P[7], r: 0.25 },
    { id: 'tronco-arterial', cor: CORES_CORACAO.tronco, geo: g.tronco, p: g.P[9], r: 0.18 },
  ];
  // sulco bulboventricular: anel na junção entre ventrículo e bulbo, perpendicular ao tubo
  const tangente = new THREE.Vector3(...g.P[8]).sub(new THREE.Vector3(...g.P[6])).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangente);
  const e = new THREE.Euler().setFromQuaternion(q);
  return (
    <group position={[0, -0.15, 0]} scale={1.25}>
      <Parte id="cavidade-pericardica" cor={CORES_CORACAO.pericardio} opacidade={0.12} prioridade={0} rotulo={[0.75, 0.8, -0.1]}>
        <Malha geometria={g.pericardio} posicao={[0, 0.2, 0]} escala={[0.85, 1.0, 0.85]} />
      </Parte>
      {juntas.map((j) => (
        <Parte key={j.id} id={j.id} cor={j.cor} prioridade={6}>
          <Malha geometria={j.geo} />
          {j.extra && <Malha geometria={j.extra} />}
          <Malha geometria={ESFERA} posicao={j.p} escala={j.r} />
        </Parte>
      ))}
      <Parte id="sulco-bulboventricular" cor="#7a1f2a" prioridade={8}>
        <Malha geometria={g.sulco} posicao={g.P[7]} rotacao={[e.x, e.y, e.z]} />
      </Parte>
    </group>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_APARELHO_FARINGEO = [
  'arco-faringeo-1',
  'arco-faringeo-2',
  'arco-faringeo-3',
  'arco-faringeo-4',
  'bolsa-faringea-1',
  'bolsa-faringea-2',
  'bolsa-faringea-3',
  'bolsa-faringea-4',
  'sulco-faringeo-1',
  'sulco-faringeo-2',
  'sulco-faringeo-3',
  'membranas-faringeas',
  'arcos-aorticos',
  'nervo-trigemeo',
  'nervo-facial',
  'nervo-glossofaringeo',
  'nervo-vago',
  'cartilagem-de-meckel',
  'cartilagem-de-reichert',
  'faringe-primitiva',
];
/**
 * ≈ 4ª–5ª semana: bloco da parede lateral da faringe primitiva, antes de o 2º arco recobrir os seguintes.
 * Arcos empilhados no sentido cranial (em cima) → caudal; face medial (−x) voltada para a luz da faringe
 * (endoderma, bolsas); face lateral (+x) voltada para fora (ectoderma, sulcos). Cada arco mostra, em corte,
 * a artéria do arco aórtico (vermelho), o nervo (amarelo) e a cartilagem (cinza-azulado).
 */
export function ModeloAparelhoFaringeo() {
  const L = 1.5;
  const arcos = [
    { n: 1, y: 0.95, r: 0.3, nervo: 'nervo-trigemeo', cartilagem: 'cartilagem-de-meckel' },
    { n: 2, y: 0.35, r: 0.27, nervo: 'nervo-facial', cartilagem: 'cartilagem-de-reichert' },
    { n: 3, y: -0.2, r: 0.22, nervo: 'nervo-glossofaringeo', cartilagem: null },
    { n: 4, y: -0.65, r: 0.18, nervo: 'nervo-vago', cartilagem: null },
  ];
  const entre = [0.65, 0.075, -0.43, -0.9]; // y das bolsas 1–4 (a 4ª fica caudal ao 4º arco)
  const g = useMemo(
    () => ({
      arco: new THREE.CylinderGeometry(1, 1, L, 40),
      nucleo: new THREE.CylinderGeometry(1, 1, L + 0.06, 20),
      bolsa: new THREE.SphereGeometry(1, 28, 18),
      sulco: new THREE.CylinderGeometry(1, 1, L * 0.92, 20, 1, false, -Math.PI / 2, Math.PI),
      membrana: new THREE.BoxGeometry(0.025, 0.12, L * 0.7),
      luz: new THREE.BoxGeometry(0.7, 2.3, L),
    }),
    [],
  );
  const deitar: V3 = [Math.PI / 2, 0, 0]; // cilindros ao longo de z
  return (
    <group rotation={[0, -0.55, 0]} position={[0.15, -0.1, 0]}>
      <Parte id="faringe-primitiva" cor={COR.endoderma} opacidade={0.08} prioridade={0} rotulo={[-0.75, 1.15, 0]}>
        <Malha geometria={g.luz} posicao={[-0.68, 0.1, 0]} />
      </Parte>
      {arcos.map((a) => (
        <Parte key={a.n} id={`arco-faringeo-${a.n}`} cor="#f2b8a2" opacidade={0.55} prioridade={2} rotulo={[a.r + 0.05, a.y + a.r * 0.6, L / 2]}>
          <Malha geometria={g.arco} posicao={[0, a.y, 0]} rotacao={deitar} escala={[a.r, 1, a.r]} />
        </Parte>
      ))}
      <Parte id="arcos-aorticos" cor="#e0393e" prioridade={8}>
        {arcos.map((a) => (
          <Malha key={a.n} geometria={g.nucleo} posicao={[-a.r * 0.25, a.y + a.r * 0.25, 0]} rotacao={deitar} escala={[a.r * 0.2, 1, a.r * 0.2]} />
        ))}
      </Parte>
      {arcos.map((a) => (
        <Parte key={a.nervo} id={a.nervo} cor="#facc15" prioridade={8}>
          <Malha geometria={g.nucleo} posicao={[a.r * 0.35, a.y - a.r * 0.1, 0]} rotacao={deitar} escala={[a.r * 0.14, 1, a.r * 0.14]} />
        </Parte>
      ))}
      {arcos
        .filter((a) => a.cartilagem)
        .map((a) => (
          <Parte key={a.cartilagem!} id={a.cartilagem!} cor="#b8c7d9" prioridade={8}>
            <Malha geometria={g.nucleo} posicao={[-a.r * 0.15, a.y - a.r * 0.45, 0]} rotacao={deitar} escala={[a.r * 0.24, 1, a.r * 0.24]} />
          </Parte>
        ))}
      {entre.map((y, i) => (
        <Parte key={`b${i}`} id={`bolsa-faringea-${i + 1}`} cor={COR.endoderma} prioridade={7}>
          <Malha geometria={g.bolsa} posicao={[-0.08, y, 0]} escala={[0.2, 0.075, L * 0.38]} />
        </Parte>
      ))}
      {entre.slice(0, 3).map((y, i) => (
        <Parte key={`s${i}`} id={`sulco-faringeo-${i + 1}`} cor={COR.ectoderma} prioridade={7} ladoDuplo>
          <Malha geometria={g.sulco} posicao={[0.22, y, 0]} rotacao={deitar} escala={[0.07, 1, 0.07]} />
        </Parte>
      ))}
      <Parte id="membranas-faringeas" cor="#c4b5fd" prioridade={9}>
        {entre.slice(0, 3).map((y, i) => (
          <Malha key={i} geometria={g.membrana} posicao={[0.13, y, 0]} />
        ))}
      </Parte>
    </group>
  );
}
