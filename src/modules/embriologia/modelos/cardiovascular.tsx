// Embriologia cardiovascular: septação do coração, arcos aórticos e circulação fetal.
// Esquemas didáticos, fora de escala; IDs alinhados aos tópicos emb-13, emb-23 e emb-24.
// Convenção de cores do laboratório: cores identificam estruturas; não representam oxigenação.
// Orientação: vista ventral (frontal), cranial em cima; o lado esquerdo do embrião/feto fica à direita da tela (+x).
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte, useCena } from '../tres/nucleo.tsx';
import { TextoAncorado } from '../tres/rotulos.tsx';
import { COR } from '../tres/cores.ts';

type V3 = [number, number, number];

function vetor(p: V3) {
  return new THREE.Vector3(...p);
}

function tubo(pontos: V3[], raio: number, segmentos = 48, radiais = 12) {
  const curva = new THREE.CatmullRomCurve3(pontos.map(vetor));
  return new THREE.TubeGeometry(curva, segmentos, raio, radiais, false);
}

/** Descarta as geometrias criadas pelo modelo (valores e listas de um objeto). */
function descartar(g: object) {
  for (const v of Object.values(g)) {
    if (v instanceof THREE.BufferGeometry) v.dispose();
    else if (Array.isArray(v)) for (const x of v) if (x instanceof THREE.BufferGeometry) x.dispose();
  }
}

/** Rotação (Euler) que leva o eixo local `de` para a direção `para`. */
function girarPara(para: THREE.Vector3, de = new THREE.Vector3(0, 0, 1)): V3 {
  const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(de, para.clone().normalize()));
  return [e.x, e.y, e.z];
}

/** "Direita"/"Esquerda" do embrião presos ao modelo (somem no jogo, no isolamento e no corte, como Cranial/Caudal). */
function OrientacaoLados({ direita, esquerda, sujeito }: { direita: V3; esquerda: V3; sujeito: string }) {
  const { modoJogo, isolado, corte } = useCena();
  if (modoJogo || isolado || corte != null) return null;
  return (
    <>
      <TextoAncorado id="orientacao-direita" posicao={direita} texto={`Direita do ${sujeito}`} />
      <TextoAncorado id="orientacao-esquerda" posicao={esquerda} texto={`Esquerda do ${sujeito}`} />
    </>
  );
}

// Paleta por identidade (não por oxigenação). Câmaras com tons distintos entre si.
const CORES = {
  atrioDireito: '#d98a8f',
  atrioEsquerdo: '#e6a57f',
  ventriculoDireito: '#c25563',
  ventriculoEsquerdo: '#c8683f',
  septumPrimum: '#f3dcb2',
  septumSecundum: '#9b6fcf',
  coxins: '#8cc97a',
  septoIV: '#c27ba8',
  ostioSecundum: '#fde047',
  forameOval: '#fbbf24',
  forameIV: '#67e8f9',
  canalAV: '#c7d2fe',
  ostioPrimum: '#f472b6',
  valvas: '#7c6fd6',
  seio: '#5b54a8',
};

// =============================================================================================
// 1) Septação cardíaca — fim da 6ª / 7ª semana, corte frontal (metade posterior, z ≤ 0)
// =============================================================================================
/** Dimensões do coração esquemático: átrios em cima (y > 0), ventrículos embaixo; plano AV em y = 0. */
const C = { rx: 1, ryA: 0.9, ryV: 1.25, rz: 0.6, parede: 0.93, cis: 0.22 };
const RX_IN = C.rx * C.parede;
const RZ_IN = C.rz * C.parede;
const RYA_IN = C.ryA * C.parede;
const RYV_IN = C.ryV * C.parede;
/** Septos oblíquos, como no coração real: a face direita olha para a frente e para a direita (giro em torno de y). */
const BETA = Math.PI / 6;
const SEN = Math.sin(BETA);
const COS = Math.cos(BETA);
/** Ângulo paramétrico (phi da SphereGeometry) em que a casca é dividida no plano dos septos. */
const PHI_SEPTO = 1.5 * Math.PI + Math.atan((C.rz / C.rx) * Math.tan(BETA));
const D_SEPTO = SEN ** 2 / RX_IN ** 2 + COS ** 2 / RZ_IN ** 2;

/** O ápice aponta para a esquerda e para baixo: cisalhamento só abaixo do plano AV (y < 0). */
function cisalhar<G extends THREE.BufferGeometry>(g: G): G {
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y < 0) p.setX(i, p.getX(i) - C.cis * y);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/** Parede de uma câmara: metade posterior (z ≤ 0) do elipsoide, de um lado do plano dos septos (+1 = esquerdo). */
function quartoCasca(lado: 1 | -1, atrio: boolean, k = 1) {
  const [inicio, comprimento] = lado > 0 ? [Math.PI, PHI_SEPTO - Math.PI] : [PHI_SEPTO, 2 * Math.PI - PHI_SEPTO];
  const g = new THREE.SphereGeometry(1, 28, 14, inicio, comprimento, atrio ? 0 : Math.PI / 2, Math.PI / 2);
  g.scale(C.rx * k, (atrio ? C.ryA : C.ryV) * k, C.rz * k);
  return atrio ? g : cisalhar(g);
}

/** Face de corte da parede (anel no plano z = 0, entre as superfícies interna e externa). */
function corteParede(lado: 1 | -1, atrio: boolean) {
  const inicio = atrio ? (lado > 0 ? 0 : Math.PI / 2) : lado > 0 ? 1.5 * Math.PI : Math.PI;
  const g = new THREE.RingGeometry(C.parede, 1, 24, 1, inicio, Math.PI / 2);
  g.scale(C.rx, atrio ? C.ryA : C.ryV, 1);
  return atrio ? g : cisalhar(g);
}

/** Profundidade máxima da cavidade no plano dos septos, à altura t. */
const sAtrio = (t: number) => Math.sqrt(Math.max(0, 1 - (t / RYA_IN) ** 2) / D_SEPTO);
const sVentriculo = (t: number) => Math.sqrt(Math.max(0, 1 - (t / RYV_IN) ** 2) / D_SEPTO);

/** Ponto do plano dos septos: s = profundidade a partir do corte, t = altura, desvio > 0 para o lado esquerdo. */
function pontoSepto(s: number, t: number, desvio = 0): V3 {
  return [desvio * COS - s * SEN, t, -desvio * SEN - s * COS];
}
/** Forma desenhada em (s, t) → geometria no plano dos septos, deslocada `desvio` para a esquerda (+) ou direita (−). */
function noSepto<G extends THREE.BufferGeometry>(g: G, desvio: number): G {
  g.rotateY(Math.PI / 2); // forma-x → −z ; normal da forma → +x
  g.translate(desvio, 0, 0);
  g.rotateY(BETA);
  return g;
}
/** Primeira profundidade em que um plano deslocado para a direita fica atrás do corte (z ≤ 0). */
const frente = (desvio: number) => Math.max(0, -desvio * Math.tan(BETA));

interface Furo { s: number; t: number; rs: number; rt: number }
const OSTIO_SECUNDUM: Furo = { s: 0.26, t: 0.57, rs: 0.13, rt: 0.085 };
const FORAME_OVAL: Furo = { s: 0.3, t: 0.3, rs: 0.16, rt: 0.11 };
const BASE_SEPTO_ATRIAL = 0.115; // topo dos coxins fundidos
const SECUNDUM = { desvio: -0.15, espessura: 0.07 };

function elipse(f: Furo) {
  return new THREE.Shape().absellipse(f.s, f.t, f.rs, f.rt, 0, Math.PI * 2, false);
}

/** Septo atrial: do teto ao plano dos coxins, da linha de corte à parede posterior, com um furo. */
function formaSeptoAtrial(furo: Furo, s0 = 0) {
  const forma = new THREE.Shape();
  forma.moveTo(s0, BASE_SEPTO_ATRIAL);
  const n = 24;
  const tTopo = RYA_IN * Math.sqrt(Math.max(0, 1 - D_SEPTO * s0 * s0));
  for (let i = 0; i <= n; i++) {
    const t = BASE_SEPTO_ATRIAL + ((tTopo - BASE_SEPTO_ATRIAL) * i) / n;
    forma.lineTo(Math.max(s0, sAtrio(t)), t);
  }
  forma.closePath();
  forma.holes.push(new THREE.Path().absellipse(furo.s, furo.t, furo.rs, furo.rt, 0, Math.PI * 2, true));
  return forma;
}

/** Septo interventricular muscular: cresce do ápice; borda livre côncava, mais baixa junto ao corte. */
const CRISTA = { tCorte: -0.42, tPosterior: -0.15, s0: 0.03 };
function bordaLivreIV() {
  const sPost = sVentriculo(CRISTA.tPosterior);
  const pontos: [number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const u = i / 16;
    pontos.push([CRISTA.s0 + (sPost - CRISTA.s0) * u, CRISTA.tCorte + (CRISTA.tPosterior - CRISTA.tCorte) * u * u]);
  }
  return pontos;
}
function formaSeptoIV() {
  const forma = new THREE.Shape();
  const base = -RYV_IN * Math.sqrt(1 - D_SEPTO * CRISTA.s0 * CRISTA.s0);
  forma.moveTo(CRISTA.s0, base);
  const n = 24;
  for (let i = 1; i <= n; i++) {
    const t = base + ((CRISTA.tPosterior - base) * i) / n;
    forma.lineTo(Math.max(CRISTA.s0, sVentriculo(t)), t);
  }
  const borda = bordaLivreIV();
  for (let i = borda.length - 2; i >= 0; i--) forma.lineTo(borda[i][0], borda[i][1]);
  forma.closePath();
  return forma;
}
/** Forame interventricular: entre a borda livre do septo muscular e os coxins fundidos. */
function formaForameIV() {
  const forma = new THREE.Shape();
  const borda = bordaLivreIV();
  forma.moveTo(0, borda[0][1]);
  for (const [s, t] of borda) forma.lineTo(s, t);
  forma.lineTo(sVentriculo(-0.1), -0.1);
  forma.lineTo(0, -0.1);
  forma.closePath();
  return forma;
}

/** Coxins AV fundidos: placa arredondada ao longo da linha dos septos, faceada no plano do corte. */
function geometriaCoxins() {
  const bisel = 0.035;
  const comprimento = sAtrio(0);
  const pontos: THREE.Vector2[] = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const s = comprimento / 2 + (comprimento / 2) * Math.cos(a);
    const w = 0.17 * Math.sin(a);
    const x = w * COS - s * SEN;
    const z = Math.min(-bisel, -w * SEN - s * COS);
    pontos.push(new THREE.Vector2(x, z));
  }
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pontos), { depth: 0.17, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 3 });
  g.rotateX(Math.PI / 2); // forma-y → z ; extrusão → −y
  g.translate(0, 0.085, 0);
  return g;
}

export const PARTES_SEPTACAO = [
  'atrio-direito',
  'atrio-esquerdo',
  'ventriculo-direito',
  'ventriculo-esquerdo',
  'septum-primum',
  'ostium-primum',
  'ostium-secundum',
  'septum-secundum',
  'forame-oval',
  'coxins-endocardicos',
  'canal-av-direito',
  'canal-av-esquerdo',
  'septo-interventricular',
  'forame-interventricular',
  'valvas-venosas',
  'seio-venoso',
];
/**
 * Fim da 6ª a 7ª semana: forame oval já formado (septum secundum sobre o ostium secundum, ostium primum fechado)
 * e forame interventricular ainda aberto (a parte membranosa só o fecha no fim da 7ª semana).
 * Corte frontal: só a metade posterior (z ≤ 0); vias de saída (anteriores) removidas pelo corte.
 * Vista padrão pela frente e pela direita: face direita dos septos (septum secundum translúcido sobre o ostium secundum).
 */
export function ModeloSeptacaoCardiaca() {
  const g = useMemo(() => {
    const camaras = {
      adExt: quartoCasca(-1, true),
      adInt: quartoCasca(-1, true, C.parede),
      adCorte: corteParede(-1, true),
      aeExt: quartoCasca(1, true),
      aeInt: quartoCasca(1, true, C.parede),
      aeCorte: corteParede(1, true),
      vdExt: quartoCasca(-1, false),
      vdInt: quartoCasca(-1, false, C.parede),
      vdCorte: corteParede(-1, false),
      veExt: quartoCasca(1, false),
      veInt: quartoCasca(1, false, C.parede),
      veCorte: corteParede(1, false),
    };
    // septum primum (fino) no plano dos septos; septum secundum (espesso, muscular) à direita dele
    const septumPrimum = noSepto(new THREE.ShapeGeometry(formaSeptoAtrial(OSTIO_SECUNDUM), 4), 0);
    const ostioSecundum = noSepto(new THREE.ShapeGeometry(elipse(OSTIO_SECUNDUM), 24), 0.003);
    const septumSecundum = noSepto(
      new THREE.ExtrudeGeometry(formaSeptoAtrial(FORAME_OVAL, frente(SECUNDUM.desvio)), { depth: SECUNDUM.espessura, bevelEnabled: false, curveSegments: 24 }),
      SECUNDUM.desvio,
    );
    const forameOval = noSepto(new THREE.ShapeGeometry(elipse(FORAME_OVAL), 24), SECUNDUM.desvio + SECUNDUM.espessura / 2);
    // ostium primum já fechado: linha de fusão do septum primum com os coxins
    const tOP = BASE_SEPTO_ATRIAL + 0.01;
    const ostioPrimum = tubo([pontoSepto(0.01, tOP), pontoSepto(sAtrio(tOP) - 0.02, tOP)], 0.024, 8, 10);
    // canais AV: meia-luva (parede posterior) + plano da abertura, à direita e à esquerda dos coxins
    const canal = new THREE.CylinderGeometry(1, 1, 0.2, 28, 1, true, Math.PI / 2, Math.PI);
    const canalAbertura = new THREE.CircleGeometry(1, 28, Math.PI, Math.PI).rotateX(Math.PI / 2);
    // septo interventricular muscular (espesso) e forame interventricular
    const septoIV = cisalhar(noSepto(new THREE.ExtrudeGeometry(formaSeptoIV(), { depth: 0.1, bevelEnabled: false }), -0.05));
    const forameIV = cisalhar(noSepto(new THREE.ShapeGeometry(formaForameIV(), 4), 0));
    const esfera = new THREE.SphereGeometry(1, 20, 14);
    const disco = new THREE.CircleGeometry(1, 28);
    const seio = tubo([[0, 0, 0], [0, 0, 0.2]], 0.07, 6, 16);
    return { ...camaras, septumPrimum, ostioSecundum, septumSecundum, forameOval, ostioPrimum, coxins: geometriaCoxins(), canal, canalAbertura, septoIV, forameIV, esfera, disco, seio };
  }, []);
  useEffect(() => () => descartar(g), [g]);

  // Orifício sinoatrial na parede posterior do átrio direito, ladeado pelas valvas venosas.
  const sino = useMemo(() => {
    const [x, y] = [-0.6, 0.42];
    const z = -RZ_IN * Math.sqrt(1 - (x / RX_IN) ** 2 - (y / RYA_IN) ** 2);
    const p = new THREE.Vector3(x, y, z);
    const n = new THREE.Vector3(x / RX_IN ** 2, y / RYA_IN ** 2, z / RZ_IN ** 2).normalize(); // para fora
    const lateral = new THREE.Vector3(0, 1, 0).cross(n).normalize();
    const cima = n.clone().cross(lateral).normalize();
    const base = new THREE.Matrix4().makeBasis(lateral, cima, n.clone().negate());
    const e = new THREE.Euler().setFromRotationMatrix(base);
    const rot: V3 = [e.x, e.y, e.z];
    const dentro = (d: number, l = 0) => p.clone().addScaledVector(n, -d).addScaledVector(lateral, l).toArray() as V3;
    return { rot, centro: dentro(0.012), valvas: [dentro(0.03, -0.1), dentro(0.03, 0.1)], tuboRot: girarPara(n), tuboPos: p.toArray() as V3 };
  }, []);

  const canais: { id: string; x: number; rx: number; rz: number }[] = [
    { id: 'canal-av-direito', x: -0.62, rx: 0.25, rz: 0.4 },
    { id: 'canal-av-esquerdo', x: 0.48, rx: 0.3, rz: 0.44 },
  ];
  return (
    <group position={[0.05, 0.12, 0.1]} rotation={[0.1, 0, 0]}>
      <Parte id="atrio-direito" cor={CORES.atrioDireito} prioridade={1} rotulo={[-0.85, 0.35, -0.2]}>
        <Malha geometria={g.adExt} />
        <Malha geometria={g.adInt} />
        <Malha geometria={g.adCorte} />
      </Parte>
      <Parte id="atrio-esquerdo" cor={CORES.atrioEsquerdo} prioridade={1} rotulo={[0.8, 0.45, -0.2]}>
        <Malha geometria={g.aeExt} />
        <Malha geometria={g.aeInt} />
        <Malha geometria={g.aeCorte} />
      </Parte>
      <Parte id="ventriculo-direito" cor={CORES.ventriculoDireito} prioridade={1} rotulo={[-0.6, -0.75, -0.3]}>
        <Malha geometria={g.vdExt} />
        <Malha geometria={g.vdInt} />
        <Malha geometria={g.vdCorte} />
      </Parte>
      <Parte id="ventriculo-esquerdo" cor={CORES.ventriculoEsquerdo} prioridade={1} rotulo={[0.9, -0.75, -0.3]}>
        <Malha geometria={g.veExt} />
        <Malha geometria={g.veInt} />
        <Malha geometria={g.veCorte} />
      </Parte>
      <Parte id="septum-primum" cor={CORES.septumPrimum} prioridade={6} rotulo={pontoSepto(0.12, 0.78)}>
        <Malha geometria={g.septumPrimum} />
      </Parte>
      <Parte id="ostium-secundum" cor={CORES.ostioSecundum} opacidade={0.6} prioridade={9} rotulo={pontoSepto(OSTIO_SECUNDUM.s, OSTIO_SECUNDUM.t, 0.003)}>
        <Malha geometria={g.ostioSecundum} />
      </Parte>
      <Parte id="septum-secundum" cor={CORES.septumSecundum} opacidade={0.78} prioridade={7} rotulo={pontoSepto(0.2, 0.7, SECUNDUM.desvio)}>
        <Malha geometria={g.septumSecundum} />
      </Parte>
      <Parte id="forame-oval" cor={CORES.forameOval} opacidade={0.6} prioridade={9} rotulo={pontoSepto(FORAME_OVAL.s, FORAME_OVAL.t, SECUNDUM.desvio)}>
        <Malha geometria={g.forameOval} />
      </Parte>
      <Parte id="ostium-primum" cor={CORES.ostioPrimum} prioridade={9} rotulo={pontoSepto(0.3, BASE_SEPTO_ATRIAL)}>
        <Malha geometria={g.ostioPrimum} />
      </Parte>
      <Parte id="coxins-endocardicos" cor={CORES.coxins} prioridade={7} rotulo={pontoSepto(0.05, 0)}>
        <Malha geometria={g.coxins} />
      </Parte>
      {canais.map((c) => (
        <Parte key={c.id} id={c.id} cor={CORES.canalAV} opacidade={0.55} prioridade={6} rotulo={[c.x, 0, -c.rz]}>
          <Malha geometria={g.canal} posicao={[c.x, 0, 0]} escala={[c.rx, 1, c.rz]} />
          <Malha geometria={g.canalAbertura} posicao={[c.x, 0, 0]} escala={[c.rx, 1, c.rz]} />
        </Parte>
      ))}
      <Parte id="septo-interventricular" cor={CORES.septoIV} prioridade={6} rotulo={[0.1, -0.75, -0.02]}>
        <Malha geometria={g.septoIV} />
      </Parte>
      <Parte id="forame-interventricular" cor={CORES.forameIV} opacidade={0.55} prioridade={9} rotulo={[0.0, -0.22, -0.1]}>
        <Malha geometria={g.forameIV} />
      </Parte>
      <Parte id="seio-venoso" cor={CORES.seio} prioridade={7} rotulo={sino.centro}>
        <Malha geometria={g.disco} posicao={sino.centro} rotacao={sino.rot} escala={[0.075, 0.12, 1]} />
        <Malha geometria={g.seio} posicao={sino.tuboPos} rotacao={sino.tuboRot} />
      </Parte>
      <Parte id="valvas-venosas" cor={CORES.valvas} prioridade={8}>
        {sino.valvas.map((p, i) => (
          <Malha key={i} geometria={g.esfera} posicao={p} rotacao={sino.rot} escala={[0.025, 0.16, 0.05]} />
        ))}
      </Parte>
      <OrientacaoLados direita={[-0.5, 1.08, 0]} esquerda={[0.5, 1.08, 0]} sujeito="embrião" />
    </group>
  );
}

// =============================================================================================
// 2) Arcos aórticos — transição da 6ª–8ª semana (identidades embrionárias)
// =============================================================================================
const NIVEL = { a1: 1.45, a2: 1.18, a3: 0.8, a4: 0.38, a6: -0.08, s7: -0.48, fusao: -1.05 };
const DORSAL = { x: 0.36, z: -0.4 };

/** Arco em "C" ao redor da faringe: do saco aórtico (ventral) à aorta dorsal do mesmo lado. */
function caminhoArco(y: number, lado: number, inicio: V3 = [lado * 0.1, y - 0.04, 0.42]): V3[] {
  return [inicio, [lado * 0.42, y, 0.4], [lado * 0.68, y, 0.08], [lado * 0.6, y, -0.25], [lado * DORSAL.x, y, DORSAL.z]];
}

export const PARTES_ARCOS_AORTICOS = [
  'saco-aortico',
  'tronco-pulmonar',
  'arco-aortico-3',
  'arco-aortico-4-direito',
  'arco-aortico-4-esquerdo',
  'arco-aortico-6-direito',
  'arco-aortico-6-esquerdo',
  'ducto-arterioso',
  'aorta-dorsal-direita',
  'aorta-dorsal-esquerda',
  'aorta-dorsal-fundida',
  'ducto-carotideo',
  'arteria-intersegmentar-7',
  'arterias-intersegmentares',
  'remanescentes-arcos-1-2',
  'nervo-vago',
  'nervo-laringeo-recorrente-direito',
  'nervo-laringeo-recorrente-esquerdo',
  'faringe-primitiva',
];
/**
 * Vista ventral: saco aórtico e tronco pulmonar na frente (+z), aortas dorsais atrás (−z); os arcos contornam a faringe.
 * 1º e 2º arcos já regrediram (cotos discretos), o 5º não aparece, a parte distal do 6º direito já regrediu,
 * por isso o laríngeo recorrente direito sobe e contorna o 4º arco direito; o esquerdo segue sob o 6º (ducto arterioso).
 */
export function ModeloArcosAorticos() {
  const g = useMemo(() => {
    // aortas dorsais em segmentos (lado esquerdo, +x; o direito é espelhado):
    // cranial ao 3º arco | ducto carotídeo (3º–4º, em regressão) | caudal ao 4º arco até a fusão
    const x = DORSAL.x;
    const z = DORSAL.z;
    const ateFusao: V3[] = [[x, -0.62, z], [0.2, NIVEL.fusao + 0.12, z - 0.01], [0.02, NIVEL.fusao - 0.02, z - 0.02]];
    const ramoPulmonar = (l: number): V3[] => [[l * 0.5, NIVEL.a6, 0.2], [l * 0.47, NIVEL.a6 - 0.22, 0.06], [l * 0.36, NIVEL.a6 - 0.5, -0.05]];
    const sexto = (l: number): V3[] => [[l * 0.02, NIVEL.a6 - 0.02, 0.3], [l * 0.28, NIVEL.a6, 0.33], [l * 0.5, NIVEL.a6, 0.2]];
    const nervoEsq: V3[] = [
      [0.88, NIVEL.a6 - 0.2, -0.05],
      [0.74, NIVEL.a6 - 0.24, -0.12],
      [0.56, NIVEL.a6 - 0.2, -0.16],
      [0.45, NIVEL.a6, -0.12],
      [0.37, NIVEL.a4 - 0.2, -0.04],
      [0.22, 0.52, 0.1],
      [0.12, 0.64, 0.15],
    ];
    const nervoDir: V3[] = [
      [-0.88, NIVEL.a4 - 0.2, -0.05],
      [-0.74, NIVEL.a4 - 0.25, -0.12],
      [-0.56, NIVEL.a4 - 0.2, -0.16],
      [-0.45, NIVEL.a4, -0.12],
      [-0.3, 0.56, 0.0],
      [-0.12, 0.68, 0.15],
    ];
    return {
      saco: new THREE.SphereGeometry(1, 28, 18),
      sacoHaste: tubo([[0.0, 0.5, 0.42], [-0.04, 0.1, 0.48], [-0.1, -0.4, 0.44], [-0.06, -0.78, 0.32]], 0.085),
      cornoSaco: tubo([[0, 0.62, 0.42], [0.1, NIVEL.a3 - 0.04, 0.42]], 0.07, 8),
      tronco: tubo([[0.06, -0.78, 0.46], [0.1, -0.4, 0.36], [0.05, NIVEL.a6 - 0.04, 0.3]], 0.08),
      arco3: tubo(caminhoArco(NIVEL.a3, 1), 0.058),
      arco4: tubo(caminhoArco(NIVEL.a4, 1, [0.1, NIVEL.a4 + 0.06, 0.44]), 0.062),
      sexto: tubo(sexto(1), 0.058),
      ramoPulmonar: tubo(ramoPulmonar(1), 0.035, 24, 10),
      ducto: tubo([[0.5, NIVEL.a6, 0.2], [0.66, NIVEL.a6, -0.02], [0.58, NIVEL.a6 - 0.01, -0.28], [DORSAL.x, NIVEL.a6 - 0.02, DORSAL.z]], 0.058),
      dorsalCranial: tubo([[x, 1.68, z], [x, 1.2, z], [x, NIVEL.a3, z]], 0.07, 24, 14),
      ductoCarotideo: tubo([[x, NIVEL.a3, z], [x, NIVEL.a4, z]], 0.034, 12, 10),
      dorsalCaudalEsq: tubo([[x, NIVEL.a4, z], [x, NIVEL.s7, z], ...ateFusao], 0.075, 48, 14),
      dorsalCaudalDir: tubo([[x, NIVEL.a4, z], [x, NIVEL.s7, z]], 0.075, 24, 14),
      dorsalRegressao: tubo([[x, NIVEL.s7, z], ...ateFusao], 0.036, 32, 10),
      fundida: tubo([[0, NIVEL.fusao + 0.02, DORSAL.z - 0.02], [0, -1.4, DORSAL.z - 0.01], [0, -1.78, DORSAL.z]], 0.095, 24, 16),
      setima: tubo([[DORSAL.x, NIVEL.s7, DORSAL.z], [0.7, NIVEL.s7 - 0.02, DORSAL.z - 0.02], [1.1, NIVEL.s7 - 0.07, -0.3]], 0.04, 24, 10),
      intersegmentar: new THREE.CylinderGeometry(0.022, 0.022, 0.26, 8, 1).rotateX(Math.PI / 2).translate(0, 0, -0.13),
      remanescente: tubo([[DORSAL.x, 0, DORSAL.z], [0.44, 0, -0.26], [0.5, 0.02, -0.14]], 0.026, 12, 8),
      vago: tubo([[0.88, 1.65, -0.05], [0.88, 0.4, -0.05], [0.88, -0.4, -0.05], [0.86, -0.95, -0.08]], 0.034, 32, 10),
      nervoEsq: tubo(nervoEsq, 0.024, 48, 8),
      nervoDir: tubo(nervoDir, 0.024, 48, 8),
      faringe: new THREE.CylinderGeometry(1, 1, 2.05, 32, 1, true),
      ponta: new THREE.SphereGeometry(1, 14, 10),
    };
  }, []);
  useEffect(() => () => descartar(g), [g]);
  const lados = [-1, 1];
  const intersegmentares: { p: V3; r: number }[] = [
    ...[1.0, 0.6, 0.18, -0.25, -0.75].flatMap((y) => lados.map((l) => ({ p: [l * DORSAL.x, y, DORSAL.z - 0.05] as V3, r: -l * 0.35 }))),
    ...[-1.3, -1.6].flatMap((y) => lados.map((l) => ({ p: [l * 0.04, y, DORSAL.z - 0.06] as V3, r: -l * 0.45 }))),
  ];
  return (
    <group position={[0, 0.05, 0]} rotation={[0.12, 0, 0]}>
      <Parte id="faringe-primitiva" cor={COR.endoderma} opacidade={0.09} prioridade={0} rotulo={[0.22, 1.35, 0.03]}>
        <Malha geometria={g.faringe} posicao={[0, 0.6, 0.03]} escala={[0.22, 1, 0.21]} />
      </Parte>
      <Parte id="saco-aortico" cor="#f0c36a" prioridade={6} rotulo={[0.1, 0.55, 0.58]}>
        <Malha geometria={g.saco} posicao={[0, 0.56, 0.42]} escala={[0.17, 0.3, 0.14]} />
        <Malha geometria={g.sacoHaste} />
        {lados.map((l) => (
          <Malha key={l} geometria={g.cornoSaco} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="tronco-pulmonar" cor="#c4a1f0" prioridade={6} rotulo={[0.1, -0.5, 0.4]}>
        <Malha geometria={g.tronco} />
      </Parte>
      <Parte id="arco-aortico-3" cor="#fb923c" prioridade={7} rotulo={[0.68, NIVEL.a3, 0.1]}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.arco3} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="arco-aortico-4-direito" cor="#f87171" prioridade={7} rotulo={[-0.68, NIVEL.a4, 0.1]}>
        <Malha geometria={g.arco4} escala={[-1, 1, 1]} />
      </Parte>
      <Parte id="arco-aortico-4-esquerdo" cor="#dc2626" prioridade={7} rotulo={[0.68, NIVEL.a4, 0.1]}>
        <Malha geometria={g.arco4} />
      </Parte>
      <Parte id="arco-aortico-6-direito" cor="#a78bfa" prioridade={7} rotulo={[-0.3, NIVEL.a6, 0.33]}>
        <Malha geometria={g.sexto} escala={[-1, 1, 1]} />
        <Malha geometria={g.ramoPulmonar} escala={[-1, 1, 1]} />
        <Malha geometria={g.ponta} posicao={[-0.5, NIVEL.a6, 0.2]} escala={0.058} />
      </Parte>
      <Parte id="arco-aortico-6-esquerdo" cor="#7c3aed" prioridade={7} rotulo={[0.3, NIVEL.a6, 0.33]}>
        <Malha geometria={g.sexto} />
        <Malha geometria={g.ramoPulmonar} />
      </Parte>
      <Parte id="ducto-arterioso" cor="#ec4899" prioridade={8} rotulo={[0.64, NIVEL.a6, -0.1]}>
        <Malha geometria={g.ducto} />
      </Parte>
      <Parte id="aorta-dorsal-direita" cor="#be123c" prioridade={6} rotulo={[-DORSAL.x, 0.1, DORSAL.z]}>
        <Malha geometria={g.dorsalCaudalDir} escala={[-1, 1, 1]} />
        <Malha geometria={g.dorsalRegressao} escala={[-1, 1, 1]} />
        <Malha geometria={g.dorsalCranial} escala={[-1, 1, 1]} />
        {[NIVEL.a3, NIVEL.a4, NIVEL.s7].map((y) => (
          <Malha key={y} geometria={g.ponta} posicao={[-DORSAL.x, y, DORSAL.z]} escala={y === NIVEL.s7 ? 0.06 : 0.07} />
        ))}
      </Parte>
      <Parte id="aorta-dorsal-esquerda" cor="#9f1239" prioridade={6} rotulo={[DORSAL.x, 0.1, DORSAL.z]}>
        <Malha geometria={g.dorsalCaudalEsq} />
        <Malha geometria={g.dorsalCranial} />
        {[NIVEL.a3, NIVEL.a4].map((y) => (
          <Malha key={y} geometria={g.ponta} posicao={[DORSAL.x, y, DORSAL.z]} escala={0.07} />
        ))}
      </Parte>
      <Parte id="ducto-carotideo" cor="#fda4af" prioridade={8} rotulo={[DORSAL.x, (NIVEL.a3 + NIVEL.a4) / 2, DORSAL.z]}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.ductoCarotideo} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="aorta-dorsal-fundida" cor="#7f1d3a" prioridade={6} rotulo={[0, -1.5, DORSAL.z]}>
        <Malha geometria={g.fundida} />
      </Parte>
      <Parte id="arteria-intersegmentar-7" cor="#34d399" prioridade={8} rotulo={[0.8, NIVEL.s7, DORSAL.z]}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.setima} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="arterias-intersegmentares" cor="#a7f3d0" prioridade={8} rotulo={[0.04, -1.3, -0.7]}>
        {intersegmentares.map(({ p, r }, i) => (
          <Malha key={i} geometria={g.intersegmentar} posicao={p} rotacao={[0, r, 0]} />
        ))}
      </Parte>
      <Parte id="remanescentes-arcos-1-2" cor="#fecdd3" prioridade={8} rotulo={[0.5, NIVEL.a1, -0.14]}>
        {[NIVEL.a1, NIVEL.a2].flatMap((y) => lados.map((l) => <Malha key={`${y}${l}`} geometria={g.remanescente} posicao={[0, y, 0]} escala={[l, 1, 1]} />))}
      </Parte>
      <Parte id="nervo-vago" cor="#facc15" prioridade={8} rotulo={[0.88, 1.2, -0.05]}>
        {lados.map((l) => (
          <Malha key={l} geometria={g.vago} escala={[l, 1, 1]} />
        ))}
      </Parte>
      <Parte id="nervo-laringeo-recorrente-direito" cor="#fde68a" prioridade={9} rotulo={[-0.56, NIVEL.a4 - 0.2, -0.16]}>
        <Malha geometria={g.nervoDir} />
      </Parte>
      <Parte id="nervo-laringeo-recorrente-esquerdo" cor="#fef08a" prioridade={9} rotulo={[0.56, NIVEL.a6 - 0.2, -0.16]}>
        <Malha geometria={g.nervoEsq} />
      </Parte>
      <OrientacaoLados direita={[-0.95, 1.75, 0]} esquerda={[0.95, 1.75, 0]} sujeito="embrião" />
    </group>
  );
}

// =============================================================================================
// 3) Circulação fetal — feto a termo (esquema frontal)
// =============================================================================================
/** Coração do feto: coordenadas locais ampliadas em torno do centro (o coração aparece maior que na proporção real). */
const CENTRO_CORACAO: V3 = [0, 0.72, 0];
const K_CORACAO = 1.45;
function h([x, y, z]: V3): V3 {
  return [CENTRO_CORACAO[0] + K_CORACAO * x, CENTRO_CORACAO[1] + K_CORACAO * y, CENTRO_CORACAO[2] + K_CORACAO * z];
}
const hr = ([x, y, z]: V3): V3 => [K_CORACAO * x, K_CORACAO * y, K_CORACAO * z];
const FETO = {
  ad: { c: h([-0.25, 0.11, 0.04]), r: hr([0.21, 0.2, 0.2]) },
  ae: { c: h([-0.04, 0.16, -0.14]), r: hr([0.17, 0.15, 0.16]) },
  vd: { c: h([-0.06, -0.17, 0.14]), r: hr([0.25, 0.2, 0.17]) },
  ve: { c: h([0.2, -0.2, -0.04]), r: hr([0.19, 0.25, 0.18]) },
  umbigo: [0.0, -0.7, 0.42] as V3,
  juncao: [0.02, -0.16, 0.12] as V3, // veia umbilical + ramo esquerdo da veia porta
  entradaDV: [-0.24, 0.12, -0.12] as V3, // ducto venoso → veia cava inferior
  bifAorta: [0.0, -0.92, -0.28] as V3,
  bifPulmonar: h([0.16, 0.29, -0.02]),
};

/** Septo interatrial esquemático entre os dois átrios (aproximados por esferas). */
function septoInteratrial() {
  const a = vetor(FETO.ad.c);
  const b = vetor(FETO.ae.c);
  const r1 = (FETO.ad.r[0] + FETO.ad.r[1] + FETO.ad.r[2]) / 3;
  const r2 = (FETO.ae.r[0] + FETO.ae.r[1] + FETO.ae.r[2]) / 3;
  const d = b.clone().sub(a);
  const dist = d.length();
  const n = d.normalize();
  const x = (dist * dist + r1 * r1 - r2 * r2) / (2 * dist);
  const raio = Math.sqrt(Math.max(0.004, r1 * r1 - x * x));
  // "para baixo" no plano do septo e o ângulo correspondente no plano local dos discos (após girarPara(n))
  const descer = new THREE.Vector3(0, -1, 0).projectOnPlane(n).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  const ex = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
  const ey = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  const anguloBaixo = Math.atan2(descer.dot(ey), descer.dot(ex));
  return { centro: a.clone().addScaledVector(n, x), n, raio, descer, anguloBaixo };
}
/** Abertura inferior do septum secundum em crescente (rad): por ela se vê a valva (septum primum). */
const FENDA_SECUNDUM = 1.3;

export const PARTES_CIRCULACAO_FETAL = [
  'placenta',
  'cordao-umbilical',
  'veias-umbilicais',
  'arterias-umbilicais',
  'figado',
  'ducto-venoso',
  'veia-porta',
  'veia-cava-inferior',
  'veia-cava-superior',
  'atrio-direito',
  'atrio-esquerdo',
  'ventriculo-direito',
  'ventriculo-esquerdo',
  'septum-secundum',
  'septum-primum',
  'forame-oval',
  'tronco-pulmonar',
  'arterias-pulmonares',
  'pulmoes',
  'ducto-arterioso',
  'aorta',
  'arterias-iliacas',
];
/**
 * Feto a termo, vista frontal, fora de escala (coração ampliado; placenta reduzida, abaixo do feto).
 * Átrios translúcidos para mostrar o forame oval (no septum secundum) e sua valva (septum primum).
 */
export function ModeloCirculacaoFetal() {
  const septo = useMemo(septoInteratrial, []);
  const g = useMemo(() => {
    const cordaoCurva = new THREE.CatmullRomCurve3(
      ([FETO.umbigo, [0.1, -0.84, 0.6], [0.32, -1.04, 0.7], [0.52, -1.16, 0.64], [0.66, -1.22, 0.48]] as V3[]).map(vetor),
    );
    // vasos do cordão em hélice ao redor do eixo (2 artérias e 1 veia central)
    const amostras = 80;
    const quadros = cordaoCurva.computeFrenetFrames(amostras, false);
    const helice = (fase: number, raio: number): V3[] => {
      const pts: V3[] = [];
      for (let i = 0; i <= amostras; i++) {
        const u = i / amostras;
        const a = fase + u * Math.PI * 2 * 2.5;
        const p = cordaoCurva.getPointAt(u).addScaledVector(quadros.normals[i], Math.cos(a) * raio).addScaledVector(quadros.binormals[i], Math.sin(a) * raio);
        pts.push(p.toArray() as V3);
      }
      return pts;
    };
    const fim = cordaoCurva.getPointAt(1);
    const tangenteFim = cordaoCurva.getTangentAt(1);
    const arteriaCorpo = (l: number): V3[] => [
      [l * 0.15, -1.1, -0.24],
      [l * 0.2, -1.19, -0.08],
      [l * 0.18, -1.09, 0.2],
      [l * 0.1, -0.88, 0.38],
    ];
    const hA = helice(0, 0.055);
    const hB = helice(Math.PI, 0.055);
    const [esq, dir] = hA[0][0] >= hB[0][0] ? [hA, hB] : [hB, hA];
    return {
      placenta: new THREE.CylinderGeometry(0.3, 0.34, 0.1, 40),
      placentaPos: fim.clone().addScaledVector(tangenteFim, 0.05).toArray() as V3,
      placentaRot: girarPara(tangenteFim, new THREE.Vector3(0, 1, 0)),
      cordao: new THREE.TubeGeometry(cordaoCurva, 64, 0.095, 16, false),
      veiaUmbilical: tubo(
        [...cordaoCurva.getSpacedPoints(16).reverse().map((p) => p.toArray() as V3), [0.01, -0.5, 0.38], [0.02, -0.34, 0.3], [0.02, -0.24, 0.2], FETO.juncao],
        0.042,
        96,
        10,
      ),
      arteriaEsq: tubo([...arteriaCorpo(1), ...esq], 0.028, 120, 8),
      arteriaDir: tubo([...arteriaCorpo(-1), ...dir], 0.028, 120, 8),
      esfera: new THREE.SphereGeometry(1, 32, 22),
      ductoVenoso: tubo([FETO.juncao, [-0.06, -0.06, 0.05], [-0.17, 0.05, -0.06], FETO.entradaDV], 0.037, 24, 10),
      veiaPorta: tubo([[0.3, -0.5, -0.02], [0.2, -0.36, 0.06], [0.1, -0.24, 0.1], FETO.juncao], 0.042, 24, 10),
      vci: tubo([[-0.12, -1.18, -0.26], [-0.15, -0.6, -0.25], [-0.21, -0.15, -0.2], FETO.entradaDV, h([-0.24, -0.19, -0.04]), h([-0.25, -0.05, 0.02])], 0.06, 48, 12),
      vcs: tubo([[-0.38, 1.52, 0.04], h([-0.26, 0.45, 0.03]), h([-0.26, 0.27, 0.04])], 0.055, 16, 12),
      anel: new THREE.RingGeometry(0.5, 1, 36, 1, septo.anguloBaixo + FENDA_SECUNDUM / 2, 2 * Math.PI - FENDA_SECUNDUM),
      disco: new THREE.CircleGeometry(1, 32),
      tronco: tubo([h([0.02, -0.05, 0.22]), h([0.08, 0.13, 0.24]), h([0.14, 0.25, 0.12]), FETO.bifPulmonar], 0.055, 24, 12),
      pulmonarDir: tubo([FETO.bifPulmonar, h([0.06, 0.35, -0.06]), h([-0.1, 0.38, -0.12]), h([-0.32, 0.35, -0.15]), h([-0.52, 0.25, -0.12])], 0.034, 32, 8),
      pulmonarEsq: tubo([FETO.bifPulmonar, h([0.34, 0.3, -0.08]), h([0.52, 0.23, -0.1])], 0.034, 16, 8),
      ducto: tubo([FETO.bifPulmonar, h([0.22, 0.33, -0.17]), h([0.24, 0.28, -0.32])], 0.052, 16, 10),
      aorta: tubo(
        [h([0.1, -0.09, 0.02]), h([0.04, 0.13, 0.12]), h([0.0, 0.33, 0.1]), h([0.04, 0.49, 0.0]), h([0.16, 0.47, -0.2]), h([0.24, 0.29, -0.36]), [0.3, 0.5, -0.5], [0.16, 0.0, -0.42], [0.06, -0.55, -0.33], FETO.bifAorta],
        0.06,
        96,
        12,
      ),
      ramoArco: tubo([[0, 0, 0], [0, 0.22, 0]], 0.03, 4, 8),
      iliacaComum: tubo([FETO.bifAorta, [0.08, -1.02, -0.27], [0.15, -1.1, -0.24], [0.24, -1.24, -0.2], [0.3, -1.42, -0.18]], 0.038, 24, 10),
    };
  }, [septo]);
  useEffect(() => () => descartar(g), [g]);
  const sRot = girarPara(septo.n);
  const noSeptoFetal = (d: number, baixo = 0) => septo.centro.clone().addScaledVector(septo.n, d).addScaledVector(septo.descer, baixo).toArray() as V3;
  const ramos: { p: V3; r: number }[] = [
    { p: h([0.0, 0.47, 0.04]), r: 0.45 },
    { p: h([0.07, 0.5, -0.06]), r: 0 },
    { p: h([0.13, 0.46, -0.15]), r: -0.6 },
  ];
  return (
    <group position={[-0.05, -0.05, -0.1]}>
      <Parte id="pulmoes" cor="#f4b6c2" opacidade={0.13} prioridade={0} rotulo={[-1.05, 0.75, -0.1]}>
        <Malha geometria={g.esfera} posicao={[-0.8, 0.85, -0.18]} escala={[0.29, 0.44, 0.3]} />
        <Malha geometria={g.esfera} posicao={[0.8, 0.85, -0.18]} escala={[0.26, 0.44, 0.3]} />
      </Parte>
      <Parte id="figado" cor={COR.figado} opacidade={0.22} prioridade={0.5} rotulo={[-0.68, -0.18, 0.1]}>
        <Malha geometria={g.esfera} posicao={[-0.1, -0.14, 0.02]} escala={[0.6, 0.28, 0.38]} />
      </Parte>
      <Parte id="placenta" cor={COR.placenta} prioridade={3} rotulo={[0.95, -1.4, 0.45]}>
        <Malha geometria={g.placenta} posicao={g.placentaPos} rotacao={g.placentaRot} />
      </Parte>
      <Parte id="cordao-umbilical" cor={COR.cordao} opacidade={0.22} prioridade={1} rotulo={[0.36, -1.0, 0.8]}>
        <Malha geometria={g.cordao} />
      </Parte>
      <Parte id="veias-umbilicais" cor="#e0b100" prioridade={7} rotulo={[0.02, -0.4, 0.34]}>
        <Malha geometria={g.veiaUmbilical} />
      </Parte>
      <Parte id="arterias-umbilicais" cor="#c084fc" prioridade={7} rotulo={[0.18, -1.09, 0.2]}>
        <Malha geometria={g.arteriaEsq} />
        <Malha geometria={g.arteriaDir} />
      </Parte>
      <Parte id="ducto-venoso" cor="#f97316" prioridade={8} rotulo={[-0.11, -0.01, 0]}>
        <Malha geometria={g.ductoVenoso} />
      </Parte>
      <Parte id="veia-porta" cor="#84cc16" prioridade={8} rotulo={[0.24, -0.42, 0.03]}>
        <Malha geometria={g.veiaPorta} />
      </Parte>
      <Parte id="veia-cava-inferior" cor="#0f9b8e" prioridade={6} rotulo={[-0.15, -0.7, -0.25]}>
        <Malha geometria={g.vci} />
      </Parte>
      <Parte id="veia-cava-superior" cor="#2f855a" prioridade={6} rotulo={[-0.38, 1.42, 0.04]}>
        <Malha geometria={g.vcs} />
      </Parte>
      <Parte id="atrio-direito" cor={CORES.atrioDireito} opacidade={0.3} prioridade={2} rotulo={h([-0.42, 0.12, 0.08])}>
        <Malha geometria={g.esfera} posicao={FETO.ad.c} escala={FETO.ad.r} />
      </Parte>
      <Parte id="atrio-esquerdo" cor={CORES.atrioEsquerdo} opacidade={0.45} prioridade={2} rotulo={h([0.05, 0.26, -0.22])}>
        <Malha geometria={g.esfera} posicao={FETO.ae.c} escala={FETO.ae.r} />
      </Parte>
      <Parte id="ventriculo-direito" cor={CORES.ventriculoDireito} prioridade={3} rotulo={h([-0.2, -0.25, 0.25])}>
        <Malha geometria={g.esfera} posicao={FETO.vd.c} escala={FETO.vd.r} rotacao={[0, 0, 0.3]} />
      </Parte>
      <Parte id="ventriculo-esquerdo" cor={CORES.ventriculoEsquerdo} prioridade={3} rotulo={h([0.32, -0.33, 0.0])}>
        <Malha geometria={g.esfera} posicao={FETO.ve.c} escala={FETO.ve.r} rotacao={[0, 0, 0.5]} />
      </Parte>
      <Parte id="septum-secundum" cor={CORES.septumSecundum} prioridade={7} rotulo={noSeptoFetal(-0.014, -septo.raio * 0.78)}>
        <Malha geometria={g.anel} posicao={noSeptoFetal(-0.014)} rotacao={sRot} escala={septo.raio} />
      </Parte>
      <Parte id="forame-oval" cor={CORES.forameOval} opacidade={0.75} prioridade={9}>
        <Malha geometria={g.disco} posicao={noSeptoFetal(-0.007)} rotacao={sRot} escala={septo.raio * 0.52} />
      </Parte>
      <Parte id="septum-primum" cor={CORES.septumPrimum} prioridade={7} rotulo={noSeptoFetal(0.012, septo.raio * 0.85)}>
        <Malha geometria={g.disco} posicao={noSeptoFetal(0.012, septo.raio * 0.3)} rotacao={sRot} escala={septo.raio * 0.78} />
      </Parte>
      <Parte id="tronco-pulmonar" cor="#a78bfa" prioridade={6} rotulo={h([0.08, 0.13, 0.24])}>
        <Malha geometria={g.tronco} />
      </Parte>
      <Parte id="arterias-pulmonares" cor="#ddd6fe" prioridade={7} rotulo={h([0.42, 0.27, -0.09])}>
        <Malha geometria={g.pulmonarDir} />
        <Malha geometria={g.pulmonarEsq} />
      </Parte>
      <Parte id="ducto-arterioso" cor="#ec4899" prioridade={9} rotulo={h([0.22, 0.33, -0.17])}>
        <Malha geometria={g.ducto} />
      </Parte>
      <Parte id="aorta" cor="#e5534b" prioridade={6} rotulo={[0.16, 0.0, -0.42]}>
        <Malha geometria={g.aorta} />
        {ramos.map(({ p, r }, i) => (
          <Malha key={i} geometria={g.ramoArco} posicao={p} rotacao={[0, 0, r]} />
        ))}
      </Parte>
      <Parte id="arterias-iliacas" cor="#f59e8b" prioridade={7} rotulo={[0.24, -1.24, -0.2]}>
        <Malha geometria={g.iliacaComum} />
        <Malha geometria={g.iliacaComum} escala={[-1, 1, 1]} />
      </Parte>
      <OrientacaoLados direita={[-0.8, 1.4, -0.18]} esquerda={[0.8, 1.4, -0.18]} sujeito="feto" />
    </group>
  );
}
