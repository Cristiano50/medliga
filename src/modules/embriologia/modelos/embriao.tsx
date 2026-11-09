// Embriões das semanas 4, 6 e 8 — vista lateral esquemática (lado ventral voltado para a esquerda, −x).
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Malha, Parte, useCena } from '../tres/nucleo.tsx';
import { COR } from '../tres/cores.ts';
import { salienciasAuriculares, superficieEmbriao } from './superficie-embriao.ts';
import { TextoAncorado } from '../tres/rotulos.tsx';

type V3 = [number, number, number];
const v3 = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];

/** Linha mediana em forma de C (arco de círculo no plano XY). */
function curvaC(raio: number, grauInicio: number, varredura: number) {
  const ponto = (t: number) => {
    const th = THREE.MathUtils.degToRad(grauInicio - varredura * t);
    return new THREE.Vector3(Math.cos(th) * raio, Math.sin(th) * raio, 0);
  };
  const dorsal = (t: number) => ponto(t).normalize();
  const ventral = (t: number) => dorsal(t).negate();
  const tangente = (t: number) => {
    const th = THREE.MathUtils.degToRad(grauInicio - varredura * t);
    return new THREE.Vector3(Math.sin(th), -Math.cos(th), 0); // sentido cranial → caudal
  };
  return { ponto, dorsal, ventral, tangente };
}

function interpolar(tabela: [number, number][], t: number): number {
  for (let i = 1; i < tabela.length; i++) {
    const [t0, v0] = tabela[i - 1];
    const [t1, v1] = tabela[i];
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return tabela[tabela.length - 1][1];
}

/** Euler que alinha os eixos locais (x, y, z) a uma base ortonormal dada. */
function eulerBase(x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3): V3 {
  const m = new THREE.Matrix4().makeBasis(x.clone().normalize(), y.clone().normalize(), z.clone().normalize());
  const e = new THREE.Euler().setFromRotationMatrix(m);
  return [e.x, e.y, e.z];
}

/** Cápsula de raio r cujo comprimento total vai de a até b (sem esticar as pontas). */
function capsulaEntre(a: THREE.Vector3, b: THREE.Vector3, r: number) {
  const s = segmento(a, b);
  return { ...s, geo: new THREE.CapsuleGeometry(r, Math.max(0.001, s.comp - 2 * r), 6, 14) };
}

/** Cápsula entre dois pontos. */
function segmento(a: THREE.Vector3, b: THREE.Vector3) {
  const dir = b.clone().sub(a);
  const comp = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  return { posicao: v3(a.clone().add(b).multiplyScalar(0.5)), rotacao: [e.x, e.y, e.z] as V3, comp };
}

const ESFERA = new THREE.SphereGeometry(1, 32, 24);
const ESFERA_BAIXA = new THREE.SphereGeometry(1, 16, 12);

/** Marcadores ligados às extremidades do modelo, não aos lados da tela. */
function OrientacaoEmbriao({ cranial, caudal }: { cranial: V3; caudal: V3 }) {
  const { modoJogo, isolado, ocultos, corte } = useCena();
  if (modoJogo || isolado || corte != null || ocultos?.some((id) => id === 'corpo' || id === 'eminencia-caudal')) return null;
  return <>
    <TextoAncorado id="orientacao-cranial" posicao={cranial} texto="Cranial" />
    <TextoAncorado id="orientacao-caudal" posicao={caudal} texto="Caudal" />
  </>;
}

// ---------------------------------------------------------------------------------------------
export const PARTES_SEMANA_4 = [
  'arcos-faringeos',
  'proeminencia-cardiaca',
  'placoide-otico',
  'placoide-lentiforme',
  'broto-membro-superior',
  'broto-membro-inferior',
  'somitos',
  'eminencia-caudal',
  'cordao-umbilical',
  'proeminencia-hepatica',
];
export function ModeloSemana4() {
  const d = useMemo(() => {
    const c = curvaC(0.85, 115, 280);
    const raio = (t: number) =>
      interpolar(
        [
          [0, 0.4],
          [0.1, 0.35],
          [0.2, 0.33],
          [0.45, 0.31],
          [0.65, 0.26],
          [0.8, 0.19],
          [0.92, 0.11],
          [1, 0.045],
        ],
        t,
      );
    const z = new THREE.Vector3(0, 0, 1);
    const corpo = superficieEmbriao(c, raio, 0, 0.88);
    const cauda = superficieEmbriao(c, raio, 0.88, 1);
    const cabeca = { p: v3(c.ponto(0).add(c.ventral(0).multiplyScalar(0.06))), r: 0.47 };
    const somitos: V3[] = [];
    for (let i = 0; i < 30; i++) {
      const t = 0.11 + (i / 29) * 0.72;
      const r = raio(t);
      const base = c.ponto(t).add(c.dorsal(t).multiplyScalar(r * 0.72));
      somitos.push(v3(base.clone().add(z.clone().multiplyScalar(r * 0.5))));
      somitos.push(v3(base.clone().add(z.clone().multiplyScalar(-r * 0.5))));
    }
    const arcos: { posicao: V3; rotacao: V3; comp: number }[] = [];
    [0.28, 0.24, 0.18, 0.12].forEach((comp, i) => {
      const t = 0.075 + i * 0.032;
      const r = raio(t);
      for (const lado of [1, -1]) {
        const centro = c.ponto(t).add(c.ventral(t).multiplyScalar(r * 0.45)).add(z.clone().multiplyScalar(lado * r * 0.78));
        const a = centro.clone().add(c.ventral(t).multiplyScalar(comp / 2));
        const b = centro.clone().add(c.ventral(t).multiplyScalar(-comp / 2));
        arcos.push(segmento(a, b));
      }
    });
    const tCor = 0.2;
    const coracao = v3(c.ponto(tCor).add(c.ventral(tCor).multiplyScalar(raio(tCor) + 0.1)));
    const tFig = 0.37;
    const figado = v3(c.ponto(tFig).add(c.ventral(tFig).multiplyScalar(raio(tFig) + 0.02)));
    const tCordao = 0.5;
    const inicioCordao = c.ponto(tCordao).add(c.ventral(tCordao).multiplyScalar(raio(tCordao) * 0.7));
    const fimCordao = inicioCordao.clone().add(c.ventral(tCordao).multiplyScalar(0.55)).add(z.clone().multiplyScalar(0.75));
    const cordao = segmento(inicioCordao, fimCordao);
    const broto = (t: number, lado: number, escala: V3) => {
      const r = raio(t);
      const p = c.ponto(t).add(z.clone().multiplyScalar(lado * r * 0.92)).add(c.ventral(t).multiplyScalar(r * 0.25));
      return { p: v3(p), rot: eulerBase(c.tangente(t), c.ventral(t), z), escala };
    };
    const brotosSup = [broto(0.31, 1, [0.17, 0.11, 0.075]), broto(0.31, -1, [0.17, 0.11, 0.075])];
    const brotosInf = [broto(0.69, 1, [0.13, 0.085, 0.06]), broto(0.69, -1, [0.13, 0.085, 0.06])];
    const tOt = 0.11;
    const otico = [1, -1].map((l) =>
      v3(c.ponto(tOt).add(z.clone().multiplyScalar(l * raio(tOt) * 0.93)).add(c.dorsal(tOt).multiplyScalar(raio(tOt) * 0.3))),
    );
    const cristalino = [1, -1].map((l) =>
      v3(new THREE.Vector3(...cabeca.p).add(z.clone().multiplyScalar(l * cabeca.r * 0.9)).add(c.ventral(0).multiplyScalar(cabeca.r * 0.32))),
    );
    const cranial = v3(new THREE.Vector3(...cabeca.p).add(new THREE.Vector3(0, 0.62, 0)));
    const caudal = v3(c.ponto(1).add(new THREE.Vector3(-0.16, -0.1, 0)));
    return { corpo, cauda, cabeca, somitos, arcos, coracao, figado, cordao, brotosSup, brotosInf, otico, cristalino, cranial, caudal };
  }, []);
  useEffect(() => () => { d.corpo.dispose(); d.cauda.dispose(); }, [d]);
  const capsula = useMemo(() => new THREE.CapsuleGeometry(0.055, 1, 6, 12), []);
  const cilindro = useMemo(() => new THREE.CylinderGeometry(0.11, 0.13, 1, 20), []);
  return (
    <group rotation={[0, 0.5, 0]} position={[0.1, 0, 0]}>
      <OrientacaoEmbriao cranial={d.cranial} caudal={d.caudal} />
      <Parte id="corpo" cor={COR.embriao} prioridade={1} rugosidade={0.5}>
        <Malha geometria={ESFERA} posicao={d.cabeca.p} escala={d.cabeca.r} />
        <Malha geometria={d.corpo} />
      </Parte>
      <Parte id="eminencia-caudal" cor={COR.embriao} prioridade={4} rugosidade={0.5}>
        <Malha geometria={d.cauda} />
      </Parte>
      <Parte id="somitos" cor={COR.embriaoEscuro} prioridade={6}>
        {d.somitos.map((p, i) => (
          <Malha key={i} geometria={ESFERA_BAIXA} posicao={p} escala={0.052} />
        ))}
      </Parte>
      <Parte id="arcos-faringeos" cor={COR.embriaoEscuro} prioridade={7}>
        {d.arcos.map((a, i) => (
          <Malha key={i} geometria={capsula} posicao={a.posicao} rotacao={a.rotacao} escala={[1, a.comp, 1]} />
        ))}
      </Parte>
      <Parte id="proeminencia-cardiaca" cor={COR.coracao} prioridade={6}>
        <Malha geometria={ESFERA} posicao={d.coracao} escala={[0.27, 0.27, 0.24]} />
      </Parte>
      <Parte id="proeminencia-hepatica" cor={COR.figado} prioridade={6}>
        <Malha geometria={ESFERA} posicao={d.figado} escala={[0.2, 0.2, 0.2]} />
      </Parte>
      <Parte id="cordao-umbilical" cor={COR.cordao} prioridade={6}>
        <Malha geometria={cilindro} posicao={d.cordao.posicao} rotacao={d.cordao.rotacao} escala={[1, d.cordao.comp, 1]} />
      </Parte>
      <Parte id="broto-membro-superior" cor={COR.embriao} prioridade={7}>
        {d.brotosSup.map((b, i) => (
          <Malha key={i} geometria={ESFERA} posicao={b.p} rotacao={b.rot} escala={b.escala} />
        ))}
      </Parte>
      <Parte id="broto-membro-inferior" cor={COR.embriao} prioridade={7}>
        {d.brotosInf.map((b, i) => (
          <Malha key={i} geometria={ESFERA} posicao={b.p} rotacao={b.rot} escala={b.escala} />
        ))}
      </Parte>
      <Parte id="placoide-otico" cor="#b07862" prioridade={8}>
        {d.otico.map((p, i) => (
          <Malha key={i} geometria={ESFERA_BAIXA} posicao={p} escala={[0.065, 0.065, 0.03]} />
        ))}
      </Parte>
      <Parte id="placoide-lentiforme" cor="#9c6a58" prioridade={8}>
        {d.cristalino.map((p, i) => (
          <Malha key={i} geometria={ESFERA_BAIXA} posicao={p} escala={[0.06, 0.06, 0.03]} />
        ))}
      </Parte>
    </group>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_SEMANA_6 = [
  'placa-da-mao',
  'raios-digitais',
  'olho',
  'pavilhao-auricular',
  'herniacao-umbilical-fisiologica',
  'proeminencia-hepatica',
  'broto-membro-inferior',
];
export function ModeloSemana6() {
  const d = useMemo(() => {
    const c = curvaC(0.9, 100, 235);
    const raio = (t: number) =>
      interpolar(
        [
          [0, 0.45],
          [0.12, 0.36],
          [0.25, 0.38],
          [0.5, 0.36],
          [0.72, 0.29],
          [0.88, 0.17],
          [1, 0.06],
        ],
        t,
      );
    const z = new THREE.Vector3(0, 0, 1);
    const corpo = superficieEmbriao(c, raio);
    const cabecaCentro = c.ponto(0).add(c.ventral(0).multiplyScalar(0.12)).add(new THREE.Vector3(0, 0.08, 0));
    const cabeca = { p: v3(cabecaCentro), r: 0.6 };
    const olho = [1, -1].map((l) => v3(cabecaCentro.clone().add(z.clone().multiplyScalar(l * 0.5)).add(c.ventral(0).multiplyScalar(0.28)).add(new THREE.Vector3(0, -0.05, 0))));
    // saliências auriculares ao redor do 1º sulco faríngeo
    const auriculares = salienciasAuriculares(c, raio);
    const membro = (t: number, lado: number, comp: number) => {
      const r = raio(t);
      const ombro = c.ponto(t).add(z.clone().multiplyScalar(lado * r * 0.85)).add(c.ventral(t).multiplyScalar(r * 0.2));
      const dir = c.ventral(t).multiplyScalar(0.7).add(c.tangente(t).multiplyScalar(0.55)).add(z.clone().multiplyScalar(lado * 0.35)).normalize();
      const fim = ombro.clone().add(dir.clone().multiplyScalar(comp));
      return { seg: capsulaEntre(ombro, fim, t < 0.5 ? 0.075 : 0.07), fim, dir };
    };
    const bracos = [membro(0.3, 1, 0.3), membro(0.3, -1, 0.3)];
    const pernas = [membro(0.7, 1, 0.22), membro(0.7, -1, 0.22)];
    const placa = (m: ReturnType<typeof membro>, lado: number, esc: V3) => {
      const n = z.clone().multiplyScalar(lado);
      const u = m.dir.clone();
      const w = new THREE.Vector3().crossVectors(n, u).normalize();
      return { p: v3(m.fim.clone().add(u.clone().multiplyScalar(esc[1] * 0.6))), rot: eulerBase(w, u, n), esc, u, w, n };
    };
    const maos = [placa(bracos[0], 1, [0.16, 0.13, 0.04]), placa(bracos[1], -1, [0.16, 0.13, 0.04])];
    const pes = [placa(pernas[0], 1, [0.12, 0.1, 0.04]), placa(pernas[1], -1, [0.12, 0.1, 0.04])];
    const raios: { posicao: V3; rotacao: V3; comp: number }[] = [];
    for (const m of maos) {
      const centro = new THREE.Vector3(...m.p);
      for (let k = -2; k <= 2; k++) {
        const ang = k * 0.32;
        const dirRaio = m.u.clone().multiplyScalar(Math.cos(ang)).add(m.w.clone().multiplyScalar(Math.sin(ang)));
        const a = centro.clone().add(dirRaio.clone().multiplyScalar(0.02)).add(m.n.clone().multiplyScalar(0.035));
        const b = centro.clone().add(dirRaio.clone().multiplyScalar(0.12)).add(m.n.clone().multiplyScalar(0.03));
        raios.push(segmento(a, b));
      }
    }
    const tFig = 0.42;
    const figado = v3(c.ponto(tFig).add(c.ventral(tFig).multiplyScalar(raio(tFig) * 0.75)));
    const tCor = 0.56;
    const baseCordao = c.ponto(tCor).add(c.ventral(tCor).multiplyScalar(raio(tCor) * 0.8));
    const fimCordao = baseCordao.clone().add(c.ventral(tCor).multiplyScalar(0.5)).add(z.clone().multiplyScalar(0.7));
    const cordao = segmento(baseCordao, fimCordao);
    const hernia = v3(baseCordao.clone().add(fimCordao.clone().sub(baseCordao).multiplyScalar(0.22)));
    const cranial = v3(cabecaCentro.clone().add(new THREE.Vector3(0, 0.73, 0)));
    const caudal = v3(c.ponto(1).add(new THREE.Vector3(-0.16, -0.1, 0)));
    return { corpo, cabeca, olho, auriculares, bracos, pernas, maos, pes, raios, figado, cordao, hernia, cranial, caudal };
  }, []);
  useEffect(() => () => d.corpo.dispose(), [d]);
  const raioGeo = useMemo(() => new THREE.CapsuleGeometry(0.014, 1, 4, 8), []);
  const cil = useMemo(() => new THREE.CylinderGeometry(0.1, 0.12, 1, 20), []);
  return (
    <group rotation={[0, 0.55, 0]}>
      <OrientacaoEmbriao cranial={d.cranial} caudal={d.caudal} />
      <Parte id="corpo" cor={COR.embriao} prioridade={1} rugosidade={0.5}>
        <Malha geometria={ESFERA} posicao={d.cabeca.p} escala={d.cabeca.r} />
        <Malha geometria={d.corpo} />
        {d.bracos.map((m, i) => (
          <Malha key={i} geometria={m.seg.geo} posicao={m.seg.posicao} rotacao={m.seg.rotacao} />
        ))}
        {d.pernas.map((m, i) => (
          <Malha key={`p${i}`} geometria={m.seg.geo} posicao={m.seg.posicao} rotacao={m.seg.rotacao} />
        ))}
      </Parte>
      <Parte id="olho" cor={COR.olho} prioridade={8}>
        {d.olho.map((p, i) => (
          <Malha key={i} geometria={ESFERA_BAIXA} posicao={p} escala={[0.09, 0.09, 0.05]} />
        ))}
      </Parte>
      <Parte id="pavilhao-auricular" cor={COR.embriaoEscuro} prioridade={8}>
        {d.auriculares.map((p, i) => (
          <Malha key={i} geometria={ESFERA_BAIXA} posicao={p} escala={0.035} />
        ))}
      </Parte>
      <Parte id="placa-da-mao" cor={COR.embriao} prioridade={6}>
        {d.maos.map((m, i) => (
          <Malha key={i} geometria={ESFERA} posicao={m.p} rotacao={m.rot} escala={m.esc} />
        ))}
      </Parte>
      <Parte id="raios-digitais" cor="#c98a74" prioridade={8}>
        {d.raios.map((r, i) => (
          <Malha key={i} geometria={raioGeo} posicao={r.posicao} rotacao={r.rotacao} escala={[1, r.comp, 1]} />
        ))}
      </Parte>
      <Parte id="broto-membro-inferior" cor={COR.embriao} prioridade={6}>
        {d.pes.map((m, i) => (
          <Malha key={i} geometria={ESFERA} posicao={m.p} rotacao={m.rot} escala={m.esc} />
        ))}
      </Parte>
      <Parte id="proeminencia-hepatica" cor={COR.figado} prioridade={5}>
        <Malha geometria={ESFERA} posicao={d.figado} escala={[0.24, 0.26, 0.24]} />
      </Parte>
      <Parte id="cordao-umbilical" cor={COR.cordao} prioridade={5}>
        <Malha geometria={cil} posicao={d.cordao.posicao} rotacao={d.cordao.rotacao} escala={[1, d.cordao.comp, 1]} />
      </Parte>
      <Parte id="herniacao-umbilical-fisiologica" cor="#e7b9a0" prioridade={7}>
        <Malha geometria={ESFERA} posicao={d.hernia} escala={0.16} />
      </Parte>
    </group>
  );
}

// ---------------------------------------------------------------------------------------------
/** Corpo humano esquemático do fim do período embrionário (reutilizado em menor escala como feto). */
function geometriaSemana8() {
  const z = new THREE.Vector3(0, 0, 1);
  const cabeca = new THREE.Vector3(-0.05, 0.78, 0);
  const rCabeca = 0.56;
  const tronco = new THREE.Vector3(0.08, -0.05, 0);
  const membros: ReturnType<typeof capsulaEntre>[] = [];
  const dedos: { posicao: V3; rotacao: V3; comp: number }[] = [];
  const maosPes: { p: V3; esc: V3 }[] = [];
  for (const lado of [1, -1]) {
    const ombro = new THREE.Vector3(-0.02, 0.35, lado * 0.3);
    const cotovelo = new THREE.Vector3(-0.12, 0.0, lado * 0.42);
    const punho = new THREE.Vector3(-0.42, 0.18, lado * 0.4);
    membros.push(capsulaEntre(ombro, cotovelo, 0.075));
    membros.push(capsulaEntre(cotovelo, punho, 0.065));
    const mao = punho.clone().add(new THREE.Vector3(-0.08, 0.05, 0));
    maosPes.push({ p: v3(mao), esc: [0.08, 0.07, 0.04] });
    for (let k = -2; k <= 2; k++) {
      const dir = new THREE.Vector3(-0.85, 0.35 + k * 0.22, 0).normalize();
      dedos.push(segmento(mao.clone().add(dir.clone().multiplyScalar(0.05)), mao.clone().add(dir.clone().multiplyScalar(0.13 - Math.abs(k) * 0.01))));
    }
    const quadril = new THREE.Vector3(0.2, -0.42, lado * 0.24);
    const joelho = new THREE.Vector3(-0.22, -0.52, lado * 0.36);
    const tornozelo = new THREE.Vector3(-0.08, -0.85, lado * 0.3);
    membros.push(capsulaEntre(quadril, joelho, 0.085));
    membros.push(capsulaEntre(joelho, tornozelo, 0.07));
    const pe = tornozelo.clone().add(new THREE.Vector3(-0.1, -0.04, 0));
    maosPes.push({ p: v3(pe), esc: [0.11, 0.05, 0.05] });
    for (let k = 0; k < 5; k++) {
      const ponta = pe.clone().add(new THREE.Vector3(-0.11, -0.01 + k * 0.006, (k - 2) * 0.022));
      dedos.push(segmento(pe.clone().add(new THREE.Vector3(-0.06, 0, (k - 2) * 0.02)), ponta));
    }
  }
  const olhos = [1, -1].map((l) => cabeca.clone().add(new THREE.Vector3(-0.36, 0.02, l * 0.36)));
  const orelhas = [1, -1].map((l) => cabeca.clone().add(new THREE.Vector3(0.12, -0.24, l * (rCabeca * 0.88))));
  const inicioCordao = new THREE.Vector3(-0.36, -0.18, 0);
  const fimCordao = new THREE.Vector3(-1.2, -0.55, 0.5);
  return { z, cabeca, rCabeca, tronco, membros, dedos, maosPes, olhos, orelhas, cordao: segmento(inicioCordao, fimCordao), hernia: v3(inicioCordao.clone().lerp(fimCordao, 0.12)) };
}

export const PARTES_SEMANA_8 = ['palpebras', 'pavilhao-auricular', 'dedos', 'herniacao-umbilical-fisiologica', 'cordao-umbilical'];
export function ModeloSemana8() {
  const d = useMemo(geometriaSemana8, []);
  const dedoGeo = useMemo(() => new THREE.CapsuleGeometry(0.016, 1, 4, 8), []);
  const orelha = useMemo(() => new THREE.TorusGeometry(0.085, 0.026, 10, 28, Math.PI * 1.55), []);
  const palpebra = useMemo(() => new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const cil = useMemo(() => new THREE.CylinderGeometry(0.1, 0.12, 1, 20), []);
  return (
    <group rotation={[0, 0.6, 0]} position={[0.1, -0.05, 0]}>
      <OrientacaoEmbriao cranial={[-0.05, 1.48, 0]} caudal={[0.55, -0.95, 0]} />
      <Parte id="corpo" cor={COR.embriao} prioridade={1} rugosidade={0.5}>
        <Malha geometria={ESFERA} posicao={v3(d.cabeca)} escala={d.rCabeca} />
        <Malha geometria={ESFERA} posicao={v3(d.tronco)} rotacao={[0, 0, 0.25]} escala={[0.42, 0.62, 0.38]} />
        {d.membros.map((m, i) => (
          <Malha key={i} geometria={m.geo} posicao={m.posicao} rotacao={m.rotacao} />
        ))}
        {d.maosPes.map((m, i) => (
          <Malha key={`m${i}`} geometria={ESFERA} posicao={m.p} escala={m.esc} />
        ))}
        {d.olhos.map((o, i) => (
          <Malha key={`o${i}`} geometria={ESFERA_BAIXA} posicao={v3(o)} escala={[0.06, 0.06, 0.03]} />
        ))}
      </Parte>
      <Parte id="palpebras" cor="#d9a28c" prioridade={8}>
        {d.olhos.map((o, i) => (
          <group key={i}>
            <Malha geometria={palpebra} posicao={v3(o.clone().add(new THREE.Vector3(0, 0.005, 0)))} escala={[0.085, 0.05, 0.05]} />
            <Malha geometria={palpebra} posicao={v3(o.clone().add(new THREE.Vector3(0, -0.005, 0)))} rotacao={[Math.PI, 0, 0]} escala={[0.085, 0.04, 0.05]} />
          </group>
        ))}
      </Parte>
      <Parte id="pavilhao-auricular" cor={COR.embriaoEscuro} prioridade={8}>
        {d.orelhas.map((o, i) => (
          <Malha key={i} geometria={orelha} posicao={v3(o)} rotacao={[0, i === 0 ? 0 : Math.PI, 0.6]} />
        ))}
      </Parte>
      <Parte id="dedos" cor="#e3ad97" prioridade={8}>
        {d.dedos.map((s, i) => (
          <Malha key={i} geometria={dedoGeo} posicao={s.posicao} rotacao={s.rotacao} escala={[1, s.comp, 1]} />
        ))}
      </Parte>
      <Parte id="cordao-umbilical" cor={COR.cordao} prioridade={5}>
        <Malha geometria={cil} posicao={d.cordao.posicao} rotacao={d.cordao.rotacao} escala={[1, d.cordao.comp, 1]} />
      </Parte>
      <Parte id="herniacao-umbilical-fisiologica" cor="#e7b9a0" prioridade={7}>
        <Malha geometria={ESFERA} posicao={d.hernia} escala={0.15} />
      </Parte>
    </group>
  );
}

/** Feto esquemático numa única Parte (usado no modelo da placenta). */
export function FetoSimples({ posicao, escala = 1, rotacao }: { posicao: V3; escala?: number; rotacao?: V3 }) {
  const d = useMemo(geometriaSemana8, []);
  return (
    <Parte id="feto" cor={COR.embriao} prioridade={6} posicao={posicao} escala={escala} rotacao={rotacao}>
      <Malha geometria={ESFERA} posicao={v3(d.cabeca)} escala={d.rCabeca} />
      <Malha geometria={ESFERA} posicao={v3(d.tronco)} rotacao={[0, 0, 0.25]} escala={[0.42, 0.62, 0.38]} />
      {d.membros.map((m, i) => (
        <Malha key={i} geometria={m.geo} posicao={m.posicao} rotacao={m.rotacao} />
      ))}
      {d.maosPes.map((m, i) => (
        <Malha key={`m${i}`} geometria={ESFERA} posicao={m.p} escala={m.esc} />
      ))}
    </Parte>
  );
}
