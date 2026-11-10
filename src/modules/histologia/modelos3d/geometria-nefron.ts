// Geometria pura do néfron (esquema fora de escala), testável sem React.
// Eixo y: superfície do rim para cima (córtex em cima, medula embaixo). Néfron cortical, de alça curta.
// Ordem do trajeto: espaço capsular → túbulo contorcido proximal (com a parte reta) → ramo descendente delgado →
// ramo ascendente espesso → mácula densa, encostada no polo vascular do PRÓPRIO corpúsculo → túbulo contorcido
// distal → (túbulo de conexão, não destacado) → ducto coletor, que não faz parte do néfron.
import * as THREE from 'three';
import { curva, fracaoMaisProxima, TrechoDeCurva, vec, type V3 } from './geometria-comum.ts';

/** Faixas de córtex e medula (caixas translúcidas). */
export const REGIOES = { topo: 1.62, juncao: 0, base: -1.72, xMin: -1.3, xMax: 1.25, zMin: -0.6, zMax: 0.6 };

/** Corpúsculo renal: cápsula com folheto parietal aberto em janela para +z (modelo em corte). */
export const CORPUSCULO = {
  centro: [-0.38, 0.95, 0] as V3,
  raioParietalExterno: 0.36,
  raioParietalInterno: 0.325,
  /** volume translúcido do espaço capsular, logo dentro do folheto parietal */
  raioEspaco: 0.319,
  /** meio-ângulo da janela aberta para +z (rad) */
  janela: 0.85,
};
export const DIRECAO_POLO_VASCULAR: V3 = [0, 1, 0];
export const DIRECAO_POLO_URINARIO: V3 = (() => {
  const d = new THREE.Vector3(-0.25, -1, 0).normalize();
  return [d.x, d.y, d.z] as V3;
})();

export const RAIOS = {
  alcaCapilar: 0.024,
  aferente: 0.048,
  eferente: 0.036,
  proximal: 0.062,
  delgado: 0.028,
  espesso: 0.05,
  distal: 0.046,
  coletor: [0.075, 0.08, 0.09, 0.1] as const,
};

const centro = () => vec(CORPUSCULO.centro);
export const polovascular = (): THREE.Vector3 => centro().addScaledVector(vec(DIRECAO_POLO_VASCULAR), CORPUSCULO.raioParietalExterno);
export const poloUrinario = (): THREE.Vector3 => centro().addScaledVector(vec(DIRECAO_POLO_URINARIO), CORPUSCULO.raioParietalExterno);

/** Hilo do tufo: onde a arteríola aferente se ramifica e a eferente se forma. */
const HILO_Y = 1.17;

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
      new THREE.Vector3(c.x + 0.035 + lado, HILO_Y, c.z + lado),
      ponto(0.1, 0.05),
      ponto(0.17, 0.045),
      ponto(0.205, 0),
      ponto(0.17, -0.045),
      ponto(0.1, -0.05),
      new THREE.Vector3(c.x - 0.035 + lado, HILO_Y, c.z - lado),
    ];
    alcas.push(new THREE.CatmullRomCurve3(pontos, false, 'centripetal'));
  }
  return alcas;
}

/** Podócitos (folheto visceral): corpos sobre as alças, com prolongamentos primários ao longo da superfície. */
export function posicoesPodocitos(n = 14): { corpo: THREE.Vector3; normal: THREE.Vector3; prolongamentos: THREE.Vector3[][] }[] {
  const c = centro();
  return curvasAlcasGlomerulares(n).map((alca, k) => {
    const ponta = alca.getPoint(0.5);
    const normal = ponta.clone().sub(c).normalize();
    const corpo = c.clone().addScaledVector(normal, 0.245);
    const t = alca.getTangent(0.5).normalize();
    const b = new THREE.Vector3().crossVectors(normal, t).normalize();
    const prolongamentos = [t, t.clone().negate(), k % 2 ? b : b.clone().negate()].map((dir) => [
      c.clone().addScaledVector(normal, 0.24),
      c.clone().addScaledVector(normal.clone().addScaledVector(dir, 0.3).normalize(), 0.232),
      c.clone().addScaledVector(normal.clone().addScaledVector(dir, 0.55).normalize(), 0.226),
    ]);
    return { corpo, normal, prolongamentos };
  });
}
export const RAIO_CORPO_PODOCITO = 0.034;
export const RAIO_PROLONGAMENTO = 0.011;

// ---------------------------------------------------------------------------------- arteríolas
/** A aferente (mais calibrosa) chega pela direita; a eferente sai pela esquerda; o túbulo distal passa entre as duas. */
export function curvaAferente(): THREE.CatmullRomCurve3 {
  return curva([[-0.33, HILO_Y - 0.01, 0], [-0.33, 1.3, 0], [-0.24, 1.37, 0], [-0.06, 1.46, 0], [0.12, 1.57, 0]]);
}
export function curvaEferente(): THREE.CatmullRomCurve3 {
  return curva([[-0.43, HILO_Y - 0.01, 0], [-0.43, 1.3, 0], [-0.53, 1.37, 0], [-0.7, 1.46, 0], [-0.86, 1.56, 0]]);
}
/** Trecho da aferente com células justaglomerulares (túnica média junto ao polo vascular, fora da cápsula). */
export function trechoJustaglomerular(): TrechoDeCurva {
  const aferente = curvaAferente();
  const inicio = fracaoMaisProxima(aferente, new THREE.Vector3(-0.33, 1.32, 0));
  const fim = fracaoMaisProxima(aferente, new THREE.Vector3(-0.2, 1.39, 0));
  return new TrechoDeCurva(aferente, inicio, fim);
}

// --------------------------------------------------------------------------------- túbulos
export function curvaProximal(): THREE.CatmullRomCurve3 {
  const inicio = centro().addScaledVector(vec(DIRECAO_POLO_URINARIO), 0.3);
  return curva([
    [inicio.x, inicio.y, inicio.z],
    [-0.475, 0.56, 0],
    [-0.53, 0.42, 0.1],
    [-0.7, 0.36, 0.26],
    [-0.92, 0.44, 0.22],
    [-1.0, 0.64, 0.05],
    [-0.9, 0.82, -0.15],
    [-0.7, 0.74, -0.28],
    [-0.6, 0.52, -0.22],
    [-0.74, 0.3, -0.06],
    [-0.98, 0.22, 0.1],
    [-1.06, 0.02, 0.06],
    // parte reta (pars recta), descendo pela medula externa
    [-1.02, -0.22, 0],
    [-0.99, -0.4, 0],
  ]);
}
export function curvaDescendenteDelgado(): THREE.CatmullRomCurve3 {
  return curva([[-0.99, -0.4, 0], [-0.97, -0.75, 0], [-0.94, -1.05, 0], [-0.9, -1.25, 0]]);
}

/** Ponto do túbulo distal encostado no polo vascular: no ângulo entre as arteríolas, acima das células mesangiais extraglomerulares. */
export const DISTANCIA_TUBULO_AO_POLO = 0.12;
export const pontoMacula = (): THREE.Vector3 => polovascular().addScaledVector(vec(DIRECAO_POLO_VASCULAR), DISTANCIA_TUBULO_AO_POLO);

/** Túbulo distal inteiro (ramo ascendente espesso + túbulo contorcido distal), dividido na mácula densa. */
export function curvaDistalCompleta(): THREE.CatmullRomCurve3 {
  const m = pontoMacula();
  return curva([
    [-0.9, -1.25, 0],
    [-0.86, -1.42, 0.02],
    [-0.7, -1.52, -0.02],
    [-0.52, -1.42, -0.08],
    [-0.32, -1.0, -0.15],
    [-0.1, -0.3, -0.2],
    [0.02, 0.4, -0.24],
    [0, 0.95, -0.28],
    [-0.16, 1.32, -0.34],
    [-0.32, m.y - 0.01, -0.24],
    // trecho reto ao longo de z, atravessando o ângulo entre as arteríolas no polo vascular
    [m.x, m.y, -0.12],
    [m.x, m.y, 0],
    [m.x, m.y, 0.12],
    [-0.3, 1.38, 0.3],
    [-0.1, 1.25, 0.4],
    [0.1, 1.05, 0.33],
    [0.15, 0.8, 0.15],
    [0.32, 0.62, 0.12],
    [0.52, 0.72, 0.32],
    [0.62, 0.95, 0.22],
    [0.7, 1.1, 0.05],
    // fim no ducto coletor (o túbulo de conexão não é destacado)
    [0.9, 1.15, 0],
  ]);
}
export function divisaoMacula(): number {
  return fracaoMaisProxima(curvaDistalCompleta(), pontoMacula());
}
export function curvaAscendenteEspesso(): TrechoDeCurva {
  return new TrechoDeCurva(curvaDistalCompleta(), 0, divisaoMacula());
}
export function curvaDistal(): TrechoDeCurva {
  return new TrechoDeCurva(curvaDistalCompleta(), divisaoMacula(), 1);
}

/** Mácula densa: placa de células altas na parede do túbulo voltada para o polo vascular (−y), ao longo de z. */
export const MACULA = { comprimento: 0.16, raio: RAIOS.espesso + 0.007, arco: (2 * Math.PI) / 3 };
/** Centro da face da mácula voltada para o polo vascular. */
export const centroFaceMacula = (): THREE.Vector3 => pontoMacula().addScaledVector(vec(DIRECAO_POLO_VASCULAR), -MACULA.raio);

/** Células mesangiais extraglomerulares: entre o polo vascular, as arteríolas e a mácula densa. */
export function posicoesMesangiaisExtraglomerulares(): THREE.Vector3[] {
  const p = polovascular();
  const y = p.y + 0.035;
  return [
    [-0.38, y, 0.09], [-0.38, y, -0.09], [-0.32, y + 0.005, 0.1], [-0.44, y + 0.005, 0.1], [-0.32, y + 0.005, -0.1], [-0.44, y + 0.005, -0.1],
  ].map(([x, yy, z]) => new THREE.Vector3(x, yy, z));
}
export const RAIO_MESANGIAL_EXTRA = 0.03;

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
  // o eixo do torno não pode ter raio exatamente 0 repetido (polo): mantém como está, o Lathe fecha o polo
  return pts.map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
}
