// Geometria pura do alvéolo pulmonar e da porção respiratória (esquema fora de escala), testável sem React.
// Bronquíolo respiratório (eixo x) → ducto alveolar → saco alveolar; alvéolos como taças abertas para a luz
// do ducto/saco. Um alvéolo maior, à direita, fica aberto em corte (metade z ≤ 0) e mostra a parede:
// pneumócitos tipo I (revestimento) e tipo II (nos cantos, com corpos lamelares), macrófago, capilares no
// septo (fora da luz), barreira hematoaérea e poro alveolar para o alvéolo de trás do mesmo saco.
import * as THREE from 'three';
import { basePerpendicular, vec, type V3 } from './geometria-comum.ts';

export interface DefAlveolo {
  id: string;
  /** onde se abre (ducto alveolar, saco alveolar ou bronquíolo respiratório) */
  grupo: 'ducto' | 'saco' | 'bronquiolo';
  centro: V3;
  /** raio da luz alveolar (face interna do epitélio) */
  raio: number;
  /** espessura da parede no esquema */
  parede: number;
  /** direção (unitária) do centro para a boca do alvéolo */
  abertura: V3;
  /** meio-ângulo da boca (rad) */
  meiaAbertura: number;
  /** giro em torno do eixo da boca (varia a direção do capilar meridiano) */
  giro: number;
}

export const RAIO_ALVEOLO = 0.24;
export const PAREDE_ALVEOLO = 0.045;
/** Capilar do septo: eixo a esta distância da face interna da parede; raio do tubo. */
export const capilarDe = (raio: number, parede: number) => ({ eixo: raio + parede * 0.9, raio: Math.min(0.026, parede * 0.55) });

export const BRONQUIOLO = { inicio: -1.75, fim: -0.95, raioExterno: 0.22, raioInterno: 0.17 };
export const SACO = { centro: [0.54, 0, 0] as V3, raio: 0.3 };
/** Ducto alveolar: a luz (volume translúcido) vai do bronquíolo ao saco; a "parede" são as bocas dos alvéolos. */
export const DUCTO = { inicio: BRONQUIOLO.fim, fim: SACO.centro[0] - SACO.raio, raioLuz: 0.18, estacoes: [-0.62, -0.04] };
/** Botões de músculo liso e fibras elásticas: anel fino na borda da boca de cada alvéolo que se abre no ducto. */
export const ANEL_DA_BOCA = { tubo: 0.016 };
/** Anel da boca no referencial do alvéolo (+y = boca): raio do anel e altura do seu plano. */
export function anelDaBoca(a: Pick<DefAlveolo, 'raio' | 'parede' | 'meiaAbertura'>): { raio: number; altura: number } {
  const r = a.raio + a.parede / 2;
  return { raio: r * Math.sin(a.meiaAbertura), altura: r * Math.cos(a.meiaAbertura) };
}

/** Alvéolo aberto em corte (metade z ≤ 0), maior que os outros para mostrar as células da parede. */
export const HEROI = (() => {
  const raio = 0.34;
  const parede = 0.065;
  const distancia = SACO.raio + raio * 0.55;
  const centro: V3 = [SACO.centro[0] + distancia, 0, 0];
  // Boca um pouco mais fechada que a dos vizinhos (36°): a parede de trás chega ao encontro com o alvéolo de
  // trás do mesmo saco, onde fica o poro alveolar.
  return { id: 'aberto', centro, raio, parede, abertura: [-1, 0, 0] as V3, meiaAbertura: (36 * Math.PI) / 180 };
})();

function alveolosIntactos(): DefAlveolo[] {
  const lista: DefAlveolo[] = [];
  const dist = DUCTO.raioLuz + RAIO_ALVEOLO * 0.7;
  const meiaDucto = Math.acos((dist - DUCTO.raioLuz) / RAIO_ALVEOLO);
  const dirs: [string, V3][] = [['cima', [0, 1, 0]], ['baixo', [0, -1, 0]], ['tras', [0, 0, -1]]];
  DUCTO.estacoes.forEach((x, e) =>
    dirs.forEach(([nome, d], i) =>
      lista.push({
        id: `ducto-${e + 1}-${nome}`, grupo: 'ducto', centro: [x + d[0] * dist, d[1] * dist, d[2] * dist], raio: RAIO_ALVEOLO, parede: PAREDE_ALVEOLO,
        abertura: [-d[0], -d[1], -d[2]], meiaAbertura: meiaDucto, giro: 0.9 * (i + 3 * e),
      }),
    ),
  );
  const distSaco = SACO.raio + RAIO_ALVEOLO * 0.55;
  const meiaSaco = Math.acos((distSaco - SACO.raio) / RAIO_ALVEOLO);
  dirs.forEach(([nome, d], i) =>
    lista.push({
      id: `saco-${nome}`, grupo: 'saco', centro: [SACO.centro[0] + d[0] * distSaco, d[1] * distSaco, d[2] * distSaco], raio: RAIO_ALVEOLO, parede: PAREDE_ALVEOLO,
      abertura: [-d[0], -d[1], -d[2]], meiaAbertura: meiaSaco, giro: 0.7 + 1.3 * i,
    }),
  );
  // alvéolo que se abre direto na luz do bronquíolo respiratório (parede "interrompida por alvéolos")
  const rb = 0.17;
  const yb = BRONQUIOLO.raioInterno + rb * 0.55;
  lista.push({
    id: 'bronquiolo', grupo: 'bronquiolo', centro: [-1.15, yb, 0], raio: rb, parede: 0.04,
    abertura: [0, -1, 0], meiaAbertura: Math.acos((yb - BRONQUIOLO.raioInterno) / rb), giro: 0.4,
  });
  return lista;
}

/** Ponto na esfera do alvéolo em corte: ângulo polar a partir do fundo (+x) e azimute t (z ≤ 0 ⇔ t ∈ [π, 2π]). */
export function direcaoHeroi(polarGraus: number, azimuteGraus: number): THREE.Vector3 {
  const f = (polarGraus * Math.PI) / 180;
  const t = (azimuteGraus * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(f), Math.sin(f) * Math.cos(t), Math.sin(f) * Math.sin(t));
}
const direcaoPoro = () => direcaoHeroi(PORO.polar, PORO.azimute);
/** Alvéolo de trás do saco alveolar: vizinho do alvéolo em corte, com quem divide o septo do poro. */
export const ID_VIZINHO_DO_PORO = 'saco-tras';

export const ALVEOLOS: DefAlveolo[] = alveolosIntactos();

/**
 * Perfil (x, y) da parede de um alvéolo intacto para LatheGeometry em torno do eixo da boca (+y): face externa,
 * face interna (a luz, no raio do alvéolo) e a borda da boca. Com as duas faces, quem olha para dentro da taça
 * vê o revestimento, e não os capilares, que ficam na espessura da parede.
 */
export function perfilTaca(raio: number, parede: number, meiaAbertura: number, passos = 14): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const arco = (r: number, i: number) => {
    const t = meiaAbertura + ((Math.PI - meiaAbertura) * i) / passos;
    return new THREE.Vector2(Math.max(0, r * Math.sin(t)), r * Math.cos(t));
  };
  for (let i = 0; i <= passos; i++) pts.push(arco(raio + parede, i));
  for (let i = passos; i >= 0; i--) pts.push(arco(raio, i));
  pts.push(pts[0].clone());
  return pts;
}

/** Todas as luzes alveolares (para o teste: capilares sempre fora delas). */
export function luzesAlveolares(): { id: string; centro: THREE.Vector3; raio: number }[] {
  return [...ALVEOLOS, HEROI].map((a) => ({ id: a.id, centro: vec(a.centro), raio: a.raio }));
}

/** Orientação de um alvéolo intacto: +y local → boca; giro em torno do eixo. */
export function orientacaoAlveolo(a: DefAlveolo): THREE.Quaternion {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec(a.abertura).normalize());
  return q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a.giro));
}

/**
 * Capilares de um alvéolo intacto no referencial local (+y = boca, −y = fundo): um anel e uma alça meridiana
 * na calota do fundo, no septo (eixo fora da luz e dentro/rente à parede).
 */
export function capilaresLocais(raio: number, parede: number): THREE.CatmullRomCurve3[] {
  const { eixo } = capilarDe(raio, parede);
  const ponto = (polar: number, azimute: number) =>
    new THREE.Vector3(Math.sin(polar) * Math.cos(azimute) * eixo, -Math.cos(polar) * eixo, Math.sin(polar) * Math.sin(azimute) * eixo);
  // anel ondulado (rede capilar esquemática): polar 50° ± 9°
  const anel: THREE.Vector3[] = [];
  for (let i = 0; i < 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    anel.push(ponto(((50 + 9 * Math.sin(3 * t)) * Math.PI) / 180, t));
  }
  const meridiano: THREE.Vector3[] = [];
  for (let i = -7; i <= 7; i++) {
    const polar = (Math.abs(i) / 7) * ((70 * Math.PI) / 180);
    meridiano.push(ponto(polar, i < 0 ? Math.PI : 0));
  }
  return [new THREE.CatmullRomCurve3(anel, true, 'centripetal'), new THREE.CatmullRomCurve3(meridiano, false, 'centripetal')];
}

/**
 * Distância do eixo de um capilar em anel ao centro do alvéolo em corte. Sob a mancha da barreira hematoaérea o
 * capilar encosta no revestimento (parte delgada do septo); no resto, fica junto da face externa da parede.
 */
export function eixoCapilarHeroi(polar: number, azimute: number): number {
  const { eixo, raio } = capilarDe(HEROI.raio, HEROI.parede);
  if (polar !== BARREIRA.polar) return eixo;
  const junto = HEROI.raio + raio + FOLGA_BARREIRA;
  const peso = Math.exp(-(((azimute - BARREIRA.azimute) / 16) ** 2));
  return eixo - (eixo - junto) * peso;
}
/** Espessura esquemática entre a luz e o capilar na parte delgada do septo. */
export const FOLGA_BARREIRA = 0.004;

/** Capilares do alvéolo em corte (referencial do modelo): meios-anéis na metade z ≤ 0 que terminam no plano do corte. */
export const POLARES_CAPILARES_HEROI = [40, 65, 95, 118];
export function capilaresHeroi(): { curvas: THREE.CatmullRomCurve3[]; raio: number; tampas: { centro: THREE.Vector3; normal: THREE.Vector3 }[] } {
  const { eixo, raio } = capilarDe(HEROI.raio, HEROI.parede);
  const c = vec(HEROI.centro);
  const curvas: THREE.CatmullRomCurve3[] = [];
  const tampas: { centro: THREE.Vector3; normal: THREE.Vector3 }[] = [];
  for (const polar of POLARES_CAPILARES_HEROI) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const azimute = 180 + (180 * i) / 24;
      pts.push(c.clone().addScaledVector(direcaoHeroi(polar, azimute), eixoCapilarHeroi(polar, azimute)));
    }
    curvas.push(new THREE.CatmullRomCurve3(pts, false, 'centripetal'));
    tampas.push({ centro: pts[0], normal: new THREE.Vector3(0, 0, 1) }, { centro: pts[pts.length - 1], normal: new THREE.Vector3(0, 0, 1) });
  }
  // alça meridiana no fundo, de cima a baixo pela parede de trás (liga os anéis)
  const meridiano: THREE.Vector3[] = [];
  for (let i = 0; i <= 12; i++) {
    const polar = 110 - (220 * i) / 12; // 110° → 0° (fundo) → −110°
    meridiano.push(c.clone().addScaledVector(direcaoHeroi(Math.abs(polar), polar >= 0 ? 235 : 305), eixo));
  }
  curvas.push(new THREE.CatmullRomCurve3(meridiano, false, 'centripetal'));
  return { curvas, raio, tampas };
}

/** Capilares de todo o modelo no referencial do modelo, com o raio do tubo (para os testes). */
export function capilaresNoModelo(): { curva: THREE.Curve<THREE.Vector3>; raio: number; matriz: THREE.Matrix4 }[] {
  const lista: { curva: THREE.Curve<THREE.Vector3>; raio: number; matriz: THREE.Matrix4 }[] = [];
  for (const a of ALVEOLOS) {
    const m = new THREE.Matrix4().compose(vec(a.centro), orientacaoAlveolo(a), new THREE.Vector3(1, 1, 1));
    for (const c of capilaresLocais(a.raio, a.parede)) lista.push({ curva: c, raio: capilarDe(a.raio, a.parede).raio, matriz: m });
  }
  const heroi = capilaresHeroi();
  for (const c of heroi.curvas) lista.push({ curva: c, raio: heroi.raio, matriz: new THREE.Matrix4() });
  return lista;
}

// ------------------------------------------------------------------------------- células do alvéolo em corte
/**
 * Núcleos achatados dos pneumócitos tipo I no revestimento (polar, azimute em graus). Poucos, de propósito:
 * o tipo I é menos numeroso que o tipo II, mas cada célula cobre uma área muito maior (o revestimento inteiro).
 */
export const NUCLEOS_TIPO_I: [number, number][] = [[50, 225], [118, 232]];
export const RAIO_NUCLEO_TIPO_I = 0.05;
/**
 * Pneumócitos tipo II: dispersos pela parede, entre os capilares, um deles junto ao encontro com o alvéolo de
 * trás (perto do poro). Ficam embutidos na parede e salientes na luz.
 */
export const TIPO_II: [number, number][] = [[80, 200], [110, 292], [45, 330]];
/** Células ampliadas em relação ao alvéolo (esquema fora de escala), para serem vistas e tocadas. */
export const TIPO_II_DIMENSOES: V3 = [0.13, 0.095, 0.13];
/** Quanto da altura da célula fica dentro da parede (o resto faz saliência na luz); não alcança os capilares. */
export const TIPO_II_EMBUTIDO = 0.03;
export const RAIO_CORPO_LAMELAR = 0.024;
/** Corpos lamelares no referencial da célula (y = eixo apical, voltado para a luz). */
export const CORPOS_LAMELARES_LOCAIS: V3[] = [[-0.032, 0.004, 0.026], [0.03, -0.004, 0.028], [0.004, 0.012, -0.034], [0.0, 0.05, 0.0]];
export const MACROFAGO = { polar: 25, azimute: 290, raio: 0.072 };
/** Sobre o capilar em anel de 95°, no meio da parede de trás (a face interna que a vista padrão mostra de frente). */
export const BARREIRA = { polar: 95, azimute: 262, abertura: 0.22 };
/** Poro alveolar: orifício pequeno no septo entre o alvéolo em corte e o alvéolo de trás do saco. */
export const PORO = { polar: 135, azimute: 270, raioAnel: 0.036, tubo: 0.009, raioCanal: 0.03 };

export function centroNucleoTipoI([polar, az]: [number, number]): THREE.Vector3 {
  return vec(HEROI.centro).addScaledVector(direcaoHeroi(polar, az), HEROI.raio - 0.008);
}
export function centroTipoII([polar, az]: [number, number]): THREE.Vector3 {
  return vec(HEROI.centro).addScaledVector(direcaoHeroi(polar, az), HEROI.raio - TIPO_II_DIMENSOES[1] / 2 + TIPO_II_EMBUTIDO);
}
/** Orientação da célula sobre o revestimento: +y local aponta para a luz (centro do alvéolo). */
export function orientacaoTipoII([polar, az]: [number, number]): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcaoHeroi(polar, az).negate());
}
export function centroMacrofago(): THREE.Vector3 {
  return vec(HEROI.centro).addScaledVector(direcaoHeroi(MACROFAGO.polar, MACROFAGO.azimute), HEROI.raio - MACROFAGO.raio * 0.85);
}
export function centroPoro(): THREE.Vector3 {
  return vec(HEROI.centro).addScaledVector(direcaoHeroi(PORO.polar, PORO.azimute), HEROI.raio - 0.004);
}
export const direcaoDoPoro = direcaoPoro;
/**
 * Canal do poro: do revestimento do alvéolo em corte até a luz do alvéolo de trás (as duas paredes se
 * encostam ali, formando o septo comum). Devolve o centro e o comprimento, ao longo da direção do poro.
 */
export function canalDoPoro(): { centro: THREE.Vector3; comprimento: number } {
  const c = vec(HEROI.centro);
  const d = direcaoPoro();
  const vizinho = ALVEOLOS.find((a) => a.id === ID_VIZINHO_DO_PORO)!;
  // primeira interseção da reta c + t·d com a esfera da luz do vizinho
  const oc = c.clone().sub(vec(vizinho.centro));
  const b2 = oc.dot(d);
  const delta = b2 * b2 - (oc.lengthSq() - vizinho.raio * vizinho.raio);
  const inicio = HEROI.raio - 0.004;
  const fim = delta > 0 ? -b2 - Math.sqrt(delta) : HEROI.raio + HEROI.parede;
  return { centro: c.addScaledVector(d, (inicio + fim) / 2), comprimento: fim - inicio };
}

/** Base local de um ponto do alvéolo em corte (normal para fora + tangentes), para pseudópodes e manchas. */
export function baseNoHeroi(polar: number, azimute: number): { normal: THREE.Vector3; t1: THREE.Vector3; t2: THREE.Vector3 } {
  const normal = direcaoHeroi(polar, azimute);
  const [t1, t2] = basePerpendicular(normal);
  return { normal, t1, t2 };
}
