// Geometria pura do néfron (esquema fora de escala), testável sem React.
// Eixo y: superfície do rim para cima (córtex em cima, medula embaixo). Néfron cortical, de alça curta.
// Ordem do trajeto: espaço capsular → túbulo contorcido proximal (com a parte reta) → ramo descendente delgado →
// ramo ascendente espesso → mácula densa, encostada no polo vascular do PRÓPRIO corpúsculo → túbulo contorcido
// distal → (túbulo de conexão, não destacado) → ducto coletor, que não faz parte do néfron.
import * as THREE from 'three';
import { basePerpendicular, curva, fracaoMaisProxima, TrechoDeCurva, vec, type V3 } from './geometria-comum.ts';

/** Faixas de córtex e medula (caixas translúcidas). */
export const REGIOES = { topo: 1.75, juncao: 0, base: -1.72, xMin: -1.3, xMax: 1.2, zMin: -0.6, zMax: 0.6 };

/** Corpúsculo renal: cápsula com folheto parietal aberto em janela para +z (modelo em corte). */
export const CORPUSCULO = {
  centro: [-0.36, 0.95, 0] as V3,
  raioParietalExterno: 0.46,
  raioParietalInterno: 0.415,
  /** volume translúcido do espaço capsular, logo dentro do folheto parietal */
  raioEspaco: 0.408,
  /** meio-ângulo da janela aberta para +z (rad) */
  janela: 0.85,
};
export const DIRECAO_POLO_VASCULAR: V3 = [0, 1, 0];
export const DIRECAO_POLO_URINARIO: V3 = (() => {
  const d = new THREE.Vector3(-0.25, -1, 0).normalize();
  return [d.x, d.y, d.z] as V3;
})();

export const RAIOS = {
  alcaCapilar: 0.028,
  aferente: 0.048,
  eferente: 0.036,
  proximal: 0.062,
  /** porção reta do proximal: um pouco mais fina, para marcar só com geometria a passagem contorcido → reto */
  proximalReto: 0.052,
  delgado: 0.028,
  espesso: 0.05,
  distal: 0.046,
  coletor: [0.075, 0.08, 0.09, 0.1] as const,
};

const centro = () => vec(CORPUSCULO.centro);
export const polovascular = (): THREE.Vector3 => centro().addScaledVector(vec(DIRECAO_POLO_VASCULAR), CORPUSCULO.raioParietalExterno);
export const poloUrinario = (): THREE.Vector3 => centro().addScaledVector(vec(DIRECAO_POLO_URINARIO), CORPUSCULO.raioParietalExterno);

/** Hilo do tufo: onde a arteríola aferente se ramifica e a eferente se forma. */
const HILO_Y = CORPUSCULO.centro[1] + 0.28;

// ----------------------------------------------------------------------------------- glomérulo
/** Alças capilares do glomérulo: saem do hilo (lado aferente), vão a um lóbulo e voltam (lado eferente). */
export function curvasAlcasGlomerulares(n = 14): THREE.CatmullRomCurve3[] {
  const c = centro();
  const polo = vec(DIRECAO_POLO_VASCULAR);
  const alcas: THREE.CatmullRomCurve3[] = [];
  const ouro = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < n; k++) {
    // direções dos lóbulos: espiral de Fibonacci na calota oposta ao polo vascular (y ≤ ~0,35)
    const y = 0.35 - (1.35 * (k + 0.5)) / n;
    const raio = Math.sqrt(1 - y * y);
    const a = k * ouro;
    const d = new THREE.Vector3(Math.cos(a) * raio, y, Math.sin(a) * raio).normalize();
    const t = new THREE.Vector3().crossVectors(d, polo);
    if (t.lengthSq() < 1e-6) t.set(1, 0, 0);
    t.normalize().applyAxisAngle(d, a * 0.7);
    const lado = (k % 2 ? 1 : -1) * 0.012;
    const ponto = (r: number, desvio: number) => c.clone().addScaledVector(d, r).addScaledVector(t, desvio);
    const pontos = [
      new THREE.Vector3(c.x + 0.045 + lado, HILO_Y, c.z + lado),
      ponto(0.13, 0.065),
      ponto(0.22, 0.058),
      ponto(0.265, 0),
      ponto(0.22, -0.058),
      ponto(0.13, -0.065),
      new THREE.Vector3(c.x - 0.045 + lado, HILO_Y, c.z - lado),
    ];
    alcas.push(new THREE.CatmullRomCurve3(pontos, false, 'centripetal'));
  }
  return alcas;
}

/**
 * Pontes entre alças vizinhas (o tufo real é uma rede que se ramifica e volta a se unir): algumas ligações
 * curtas entre pontos próximos de alças diferentes, escolhidas de forma determinística.
 */
export function curvasPontesGlomerulares(maximo = 5): THREE.CatmullRomCurve3[] {
  const c = centro();
  const alcas = curvasAlcasGlomerulares();
  const pontes: THREE.CatmullRomCurve3[] = [];
  const usadas = new Set<number>();
  for (let i = 0; i < alcas.length && pontes.length < maximo; i++) {
    if (usadas.has(i)) continue;
    const a = alcas[i].getPoint(0.36);
    let melhor: { j: number; b: THREE.Vector3; d: number } | null = null;
    for (let j = 0; j < alcas.length; j++) {
      if (j === i || usadas.has(j)) continue;
      for (const u of [0.3, 0.4, 0.5, 0.6, 0.7]) {
        const b = alcas[j].getPoint(u);
        const d = a.distanceTo(b);
        if (d > 0.07 && d < 0.2 && (!melhor || d < melhor.d)) melhor = { j, b, d };
      }
    }
    if (!melhor) continue;
    usadas.add(i).add(melhor.j);
    const meio = a.clone().add(melhor.b).multiplyScalar(0.5);
    meio.addScaledVector(meio.clone().sub(c).normalize(), 0.012);
    pontes.push(new THREE.CatmullRomCurve3([a, meio, melhor.b], false, 'centripetal'));
  }
  return pontes;
}
export const RAIO_PONTE = 0.022;

export interface Podocito {
  /** índice da alça em que se apoia e posição nela (0–1) */
  alca: number;
  t: number;
  corpo: THREE.Vector3;
  /** direção do capilar para o espaço capsular (o corpo fica deste lado) */
  normal: THREE.Vector3;
  /** prolongamentos primários: dois ao longo do capilar e dois que o abraçam */
  prolongamentos: THREE.Vector3[][];
}

/** Podócitos (folheto visceral): corpos apoiados nas alças capilares, com prolongamentos que as abraçam. */
export function posicoesPodocitos(n = 14): Podocito[] {
  const c = centro();
  const r = RAIOS.alcaCapilar;
  const lista: Podocito[] = [];
  curvasAlcasGlomerulares(n).forEach((alca, k) => {
    // lado de fora do capilar (voltado para o espaço capsular), perpendicular ao eixo do tubo
    const normalEm = (t: number) => {
      const p = alca.getPoint(t);
      const tan = alca.getTangent(t).normalize();
      const radial = p.clone().sub(c).normalize();
      const nrm = radial.addScaledVector(tan, -radial.dot(tan));
      if (nrm.lengthSq() < 1e-6) nrm.copy(basePerpendicular(tan)[0]);
      return { p, tan, nrm: nrm.normalize() };
    };
    for (const t of k % 2 ? [0.5] : [0.3, 0.7]) {
      const { p, tan, nrm } = normalEm(t);
      const b = new THREE.Vector3().crossVectors(tan, nrm).normalize();
      const sobre = (u: number, folga: number) => { const q = normalEm(u); return q.p.addScaledVector(q.nrm, r + folga); };
      const abraco = (lado: number) => [0.35, 0.95, 1.55].map((a) => p.clone().addScaledVector(nrm, Math.cos(a) * (r + 0.008)).addScaledVector(b, lado * Math.sin(a) * (r + 0.008)));
      lista.push({
        alca: k,
        t,
        corpo: p.clone().addScaledVector(nrm, r + DISTANCIA_CORPO_PODOCITO),
        normal: nrm,
        prolongamentos: [
          [sobre(t, 0.008), sobre(t + 0.045, 0.006), sobre(t + 0.09, 0.004)],
          [sobre(t, 0.008), sobre(t - 0.045, 0.006), sobre(t - 0.09, 0.004)],
          abraco(1),
          abraco(-1),
        ],
      });
    }
  });
  return lista;
}
export const RAIO_CORPO_PODOCITO = 0.04;
/** Centro do corpo (achatado) a esta distância da parede do capilar. */
export const DISTANCIA_CORPO_PODOCITO = 0.014;
export const RAIO_PROLONGAMENTO = 0.011;

// ---------------------------------------------------------------------------------- arteríolas
/** A aferente (mais calibrosa) chega pela direita; a eferente sai pela esquerda; o túbulo distal passa entre as duas. */
export function curvaAferente(): THREE.CatmullRomCurve3 {
  return curva([[-0.27, HILO_Y - 0.01, 0], [-0.27, 1.4, 0], [-0.16, 1.47, 0], [0, 1.57, 0], [0.16, 1.66, 0]]);
}
export function curvaEferente(): THREE.CatmullRomCurve3 {
  return curva([[-0.45, HILO_Y - 0.01, 0], [-0.45, 1.4, 0], [-0.56, 1.47, 0], [-0.74, 1.57, 0], [-0.9, 1.66, 0]]);
}
/** Trecho da aferente com células justaglomerulares (túnica média junto ao polo vascular, fora da cápsula). */
export function trechoJustaglomerular(): TrechoDeCurva {
  const aferente = curvaAferente();
  const inicio = fracaoMaisProxima(aferente, new THREE.Vector3(-0.27, 1.42, 0));
  const fim = fracaoMaisProxima(aferente, new THREE.Vector3(-0.08, 1.52, 0));
  return new TrechoDeCurva(aferente, inicio, fim);
}

// --------------------------------------------------------------------------------- túbulos
/** Porção reta do túbulo proximal e ramos da alça: descem e sobem paralelos (grampo), a esta distância. */
export const ALCA = { xDescendente: -1.0, xAscendente: -0.8, inicioReta: 0.12, fimProximal: -0.4, fimDelgado: -0.78, fundo: -0.97 };

/**
 * Porção contorcida do túbulo proximal: sai do polo urinário, faz quatro voltas em serpentina à esquerda e à
 * frente do corpúsculo, volta por trás delas e chega, já na vertical, ao início da porção reta. É o segmento
 * mais longo do néfron (aqui, quase o dobro do túbulo contorcido distal). Fica toda no córtex.
 */
export function curvaProximalContorcida(): THREE.CatmullRomCurve3 {
  const inicio = centro().addScaledVector(vec(DIRECAO_POLO_URINARIO), 0.4);
  const x = ALCA.xDescendente;
  return curva([
    [inicio.x, inicio.y, inicio.z],
    [-0.5, 0.43, 0.06],
    // 1ª volta (para a esquerda)
    [-0.62, 0.31, 0.2],
    [-0.85, 0.28, 0.3],
    [-1.08, 0.3, 0.32],
    [-1.18, 0.4, 0.36],
    // 2ª volta (para a direita)
    [-1.08, 0.5, 0.42],
    [-0.92, 0.5, 0.44],
    [-0.8, 0.52, 0.42],
    [-0.74, 0.61, 0.4],
    // 3ª volta (para a esquerda)
    [-0.84, 0.7, 0.34],
    [-1.0, 0.7, 0.3],
    [-1.12, 0.72, 0.3],
    [-1.19, 0.82, 0.34],
    // 4ª volta (para a direita)
    [-1.1, 0.92, 0.4],
    [-0.96, 0.93, 0.42],
    // retorno por trás das voltas, descendo até o início da porção reta
    [-0.9, 1.04, 0.28],
    [-0.98, 1.06, 0.1],
    [-1.1, 0.96, -0.02],
    [-1.16, 0.76, -0.06],
    [-1.14, 0.52, -0.04],
    [-1.06, 0.3, -0.02],
    [x - 0.01, 0.2, 0],
    [x, ALCA.inicioReta, 0],
  ]);
}
/** Porção reta do túbulo proximal: trecho retilíneo e vertical que desce do córtex à medula externa (início da alça de Henle). */
export function curvaProximalReta(): THREE.LineCurve3 {
  return new THREE.LineCurve3(new THREE.Vector3(ALCA.xDescendente, ALCA.inicioReta, 0), new THREE.Vector3(ALCA.xDescendente, ALCA.fimProximal, 0));
}
export function curvaDescendenteDelgado(): THREE.LineCurve3 {
  // alça curta (néfron cortical): desce só até a medula externa
  return new THREE.LineCurve3(new THREE.Vector3(ALCA.xDescendente, ALCA.fimProximal, 0), new THREE.Vector3(ALCA.xDescendente, ALCA.fimDelgado, 0));
}

/** Ponto do túbulo distal encostado no polo vascular: no ângulo entre as arteríolas, acima das células mesangiais extraglomerulares. */
export const DISTANCIA_TUBULO_AO_POLO = 0.19;
export const pontoMacula = (): THREE.Vector3 => polovascular().addScaledVector(vec(DIRECAO_POLO_VASCULAR), DISTANCIA_TUBULO_AO_POLO);

/**
 * Túbulo distal inteiro (ramo ascendente espesso + túbulo contorcido distal). O ramo espesso começa pouco antes
 * da curva, sobe paralelo e junto ao ramo descendente (alça em grampo) até o córtex e só então passa por trás do
 * corpúsculo até o polo vascular; a placa da mácula densa fica no fim dele.
 */
export function curvaDistalCompleta(): THREE.CatmullRomCurve3 {
  const m = pontoMacula();
  const xd = ALCA.xDescendente;
  const xa = ALCA.xAscendente;
  return curva([
    [xd, ALCA.fimDelgado, 0],
    [xd + 0.015, -0.9, 0],
    [(xd + xa) / 2, ALCA.fundo, 0],
    [xa - 0.015, -0.9, 0],
    [xa, ALCA.fimDelgado, 0],
    // sobe paralelo ao ramo descendente e à porção reta do proximal
    [xa, -0.4, -0.01],
    [xa, 0, -0.05],
    [xa, 0.35, -0.16],
    // por trás do corpúsculo, até o polo vascular
    [-0.76, 0.62, -0.34],
    [-0.66, 0.9, -0.48],
    [-0.5, 1.18, -0.52],
    [-0.38, 1.42, -0.44],
    [-0.36, 1.57, -0.28],
    // trecho reto ao longo de z, atravessando o ângulo entre as arteríolas no polo vascular
    [m.x, m.y, -0.13],
    [m.x, m.y, 0],
    [m.x, m.y, 0.13],
    // túbulo contorcido distal (mais curto que o proximal): passa por cima do polo e desce à direita
    [-0.2, 1.63, 0.26],
    [0.05, 1.56, 0.34],
    [0.24, 1.36, 0.28],
    [0.3, 1.12, 0.14],
    [0.46, 1.0, 0.1],
    [0.6, 1.14, 0.2],
    [0.72, 1.3, 0.06],
    // fim no ducto coletor (o túbulo de conexão não é desenhado à parte)
    [0.9, 1.36, 0],
  ]);
}
/**
 * Divisa de cor entre o ramo ascendente espesso e o túbulo contorcido distal: logo depois da placa da mácula
 * densa, que assim fica no fim do ramo espesso (como na literatura de fisiologia).
 */
export function divisaoMacula(): number {
  const m = pontoMacula();
  return fracaoMaisProxima(curvaDistalCompleta(), new THREE.Vector3(m.x, m.y, MACULA.comprimento / 2 + 0.01));
}
export function curvaAscendenteEspesso(): TrechoDeCurva {
  return new TrechoDeCurva(curvaDistalCompleta(), 0, divisaoMacula());
}
export function curvaDistal(): TrechoDeCurva {
  return new TrechoDeCurva(curvaDistalCompleta(), divisaoMacula(), 1);
}

/** Mácula densa: placa de células altas (mais espessa que o resto da parede) voltada para o polo vascular (−y), ao longo de z. */
export const MACULA = { comprimento: 0.2, raio: RAIOS.espesso + 0.03, arco: (2 * Math.PI) / 3 };
/** Centro da face da mácula voltada para o polo vascular. */
export const centroFaceMacula = (): THREE.Vector3 => pontoMacula().addScaledVector(vec(DIRECAO_POLO_VASCULAR), -MACULA.raio);

/** Células mesangiais extraglomerulares: entre o polo vascular, as arteríolas e a mácula densa. */
export function posicoesMesangiaisExtraglomerulares(): THREE.Vector3[] {
  const p = polovascular();
  // no ângulo entre as arteríolas (x entre os dois pedículos), sob a mácula densa; nenhuma à frente dela
  const y = p.y + 0.055;
  return [
    [p.x - 0.006, y, 0], [p.x, y - 0.002, -0.08], [p.x - 0.01, y - 0.004, -0.16], [p.x - 0.012, y - 0.004, 0.08],
  ].map(([x, yy, z]) => new THREE.Vector3(x, yy, z));
}
/** Ampliadas (como as demais células do aparelho justaglomerular) para serem vistas e tocadas. */
export const RAIO_MESANGIAL_EXTRA = 0.05;

/** Ducto coletor: perfil (raio, y) de uma revolução em torno do eixo vertical em x = DUCTO_X. */
export const DUCTO_X = 0.95;
export function perfilDuctoColetor(): THREE.Vector2[] {
  const [a, b, c, d] = RAIOS.coletor;
  return [
    new THREE.Vector2(0, REGIOES.topo),
    new THREE.Vector2(a, REGIOES.topo),
    new THREE.Vector2(b, 0.5),
    new THREE.Vector2(c, -0.6),
    new THREE.Vector2(d, REGIOES.base),
    new THREE.Vector2(0, REGIOES.base),
  ];
}

/** Perfil (x, y) da parede da cápsula para LatheGeometry em torno do eixo da janela: arco externo e interno. */
export function perfilCapsula(passos = 24): THREE.Vector2[] {
  const { raioParietalExterno: re, raioParietalInterno: ri, janela } = CORPUSCULO;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= passos; i++) {
    const t = janela + ((Math.PI - janela) * i) / passos;
    pts.push(new THREE.Vector2(re * Math.sin(t), re * Math.cos(t)));
  }
  for (let i = passos; i >= 0; i--) {
    const t = janela + ((Math.PI - janela) * i) / passos;
    pts.push(new THREE.Vector2(ri * Math.sin(t), ri * Math.cos(t)));
  }
  pts.push(pts[0].clone());
  return pts.map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
}
