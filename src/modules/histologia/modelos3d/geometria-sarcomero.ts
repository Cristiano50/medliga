// Sarcômero do músculo esquelético (esquema fora de escala): geometria pura, sem React, testável.
// Eixo da miofibrila ao longo de x; linha M em x = 0; corte transversal no plano (y, z).
// Comprimentos proporcionais a valores aproximados dos livros-texto (Junqueira 14ª: filamento grosso
// ~1,6 µm, fino ~1,0 µm, sarcômero ~2,5 µm em repouso); diâmetros e espaçamentos muito aumentados.
//
// Deslizamento: com o comprimento do sarcômero S, a banda A (filamento grosso) não muda; a banda I vale
// S − A e a banda H vale S − 2·fino (enquanto S ≥ 2·fino, isto é, sem sobreposição dos finos dos dois lados).
import * as THREE from 'three';
import { mesclar } from './geometria-lobulo.ts';

export type Ponto2 = [number, number];

export const SARCOMERO = {
  /** unidades de cena por µm (ao longo do eixo) */
  escala: 0.9,
  /** comprimentos em µm */
  grosso: 1.6,
  fino: 1.0,
  repouso: 2.5,
  contraido: 2.1,
  /** zona nua (sem cabeças) no centro do filamento grosso, µm */
  zonaNua: 0.18,
  /** distância entre filamentos grossos vizinhos na rede hexagonal (unidades, exagerada) */
  rede: 0.3,
  raioGrosso: 0.05,
  /** raio do conjunto da dupla hélice (filamento fino) */
  raioFino: 0.03,
  /** passo (volta completa) de cada fita da dupla hélice de actina, em unidades (esticado) */
  passoHelice: 0.26,
  /** espaçamento entre coroas de cabeças de miosina (unidades, exagerado) */
  passoCoroa: 0.07,
  raioDiscoZ: 0.44,
  raioDiscoM: 0.42,
  raioBandas: 0.5,
  /** anéis do túbulo T e das cisternas terminais em volta da miofibrila */
  raioAnel: 0.58,
  tuboT: 0.026,
  tuboCisterna: 0.036,
  /** distância entre o centro do túbulo T e o de cada cisterna terminal */
  afastamentoCisterna: 0.07,
  /** barra de cota do sarcômero (abaixo do modelo) */
  alturaCota: -0.8,
} as const;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Comprimento do sarcômero (µm) para a contração c ∈ [0, 1] (0 = repouso, 1 = contraído). */
export function comprimentoSarcomero(contracao: number): number {
  const { repouso, contraido } = SARCOMERO;
  return repouso - (repouso - contraido) * clamp(contracao);
}

export interface Bandas {
  /** comprimento do sarcômero (µm) */
  sarcomero: number;
  /** larguras em µm */
  larguraA: number;
  larguraI: number;
  larguraH: number;
  /** posições em unidades de cena, ao longo de x */
  linhaZ: [number, number];
  linhaM: number;
  bandaA: [number, number];
  bandaH: [number, number];
  /** cada banda I é dividida ao meio por uma linha Z (metade em cada sarcômero) */
  bandasI: [[number, number], [number, number]];
  /** filamentos finos: da linha Z até a ponta livre (esquerda e direita) */
  finos: [[number, number], [number, number]];
  /** junções A-I (onde ficam as tríades no músculo esquelético de mamíferos) */
  juncoesAI: [number, number];
}

export function bandas(contracao: number): Bandas {
  const { escala: k, grosso, fino } = SARCOMERO;
  const s = comprimentoSarcomero(contracao);
  const larguraA = grosso;
  const larguraI = s - grosso;
  const larguraH = Math.max(0, s - 2 * fino);
  const z = (s / 2) * k;
  const a = (grosso / 2) * k;
  const h = (larguraH / 2) * k;
  const meiaI = (larguraI / 2) * k;
  const f = fino * k;
  return {
    sarcomero: s,
    larguraA,
    larguraI,
    larguraH,
    linhaZ: [-z, z],
    linhaM: 0,
    bandaA: [-a, a],
    bandaH: [-h, h],
    bandasI: [[-z - meiaI, -z + meiaI], [z - meiaI, z + meiaI]],
    finos: [[-z, -z + f], [z - f, z]],
    juncoesAI: [-a, a],
  };
}

/**
 * Rede hexagonal no corte transversal (y, z): 7 filamentos grossos (centro + anel) e os filamentos finos
 * nas posições trigonais até 1,2 × a distância da rede (12 posições). Cada grosso tem finos a D/√3.
 */
export function redeFilamentos(): { grossos: Ponto2[]; finos: Ponto2[] } {
  const D = SARCOMERO.rede;
  const a1: Ponto2 = [D, 0];
  const a2: Ponto2 = [D / 2, (D * Math.sqrt(3)) / 2];
  const grossos: Ponto2[] = [[0, 0], ...Array.from({ length: 6 }, (_, k) => [D * Math.cos((k * Math.PI) / 3), D * Math.sin((k * Math.PI) / 3)] as Ponto2)];
  const finos: Ponto2[] = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      for (const f of [1 / 3, 2 / 3]) {
        const p: Ponto2 = [i * a1[0] + j * a2[0] + f * (a1[0] + a2[0]), i * a1[1] + j * a2[1] + f * (a1[1] + a2[1])];
        if (Math.hypot(p[0], p[1]) <= 1.2 * D + 1e-9) finos.push(p);
      }
    }
  }
  finos.sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0]) || Math.hypot(...p) - Math.hypot(...q));
  return { grossos, finos };
}

/** Cabeças de miosina de um filamento grosso: posição ao longo de x, ângulo em volta do eixo e lado. */
export function cabecasMiosina(): { x: number; angulo: number; lado: -1 | 1 }[] {
  const { escala: k, grosso, zonaNua, passoCoroa } = SARCOMERO;
  const inicio = (zonaNua / 2) * k;
  const fim = (grosso / 2) * k - 0.02;
  const lista: { x: number; angulo: number; lado: -1 | 1 }[] = [];
  for (const lado of [-1, 1] as const) {
    let coroa = 0;
    for (let x = inicio + passoCoroa / 2; x <= fim; x += passoCoroa, coroa++) {
      // Três cabeças por coroa (120°), cada coroa girada 40° em relação à anterior.
      for (let c = 0; c < 3; c++) lista.push({ x: lado * x, angulo: ((coroa * 40 + c * 120) * Math.PI) / 180, lado });
    }
  }
  return lista;
}

// ------------------------------------------------------------------------------------------
// Geometrias
// ------------------------------------------------------------------------------------------

const seg = (n: number, fator: number, minimo = 3) => Math.max(minimo, Math.round(n * fator));

/** Hélice ao longo de +x, de 0 a `comprimento`: raio, passo, fase e sentido de avanço. */
class Helice extends THREE.Curve<THREE.Vector3> {
  comprimento: number;
  raio: number;
  passo: number;
  fase: number;
  centro: Ponto2;
  constructor(comprimento: number, raio: number, passo: number, fase: number, centro: Ponto2 = [0, 0]) {
    super();
    this.comprimento = comprimento;
    this.raio = raio;
    this.passo = passo;
    this.fase = fase;
    this.centro = centro;
  }
  getPoint(t: number, alvo = new THREE.Vector3()) {
    const x = t * this.comprimento;
    const ang = this.fase + (2 * Math.PI * x) / this.passo;
    return alvo.set(x, this.centro[0] + this.raio * Math.cos(ang), this.centro[1] + this.raio * Math.sin(ang));
  }
}

/**
 * Filamentos finos (dupla hélice de actina F) nas posições `finos`, de x = 0 até `comprimento` (sentido +x);
 * o componente posiciona o grupo na linha Z e o espelha para o lado direito.
 */
export function geometriaFinos(finos: Ponto2[], comprimento: number, fator = 1): THREE.BufferGeometry {
  const { raioFino, passoHelice } = SARCOMERO;
  const raioFita = raioFino * 0.5;
  const raioHelice = raioFino - raioFita;
  const voltas = comprimento / passoHelice;
  const partes: THREE.BufferGeometry[] = [];
  finos.forEach((p, i) => {
    for (const fase of [0, Math.PI]) {
      const curva = new Helice(comprimento, raioHelice, passoHelice, fase + i * 0.7, p);
      partes.push(new THREE.TubeGeometry(curva, seg(Math.ceil(voltas * 12), fator, 4), raioFita, seg(5, Math.sqrt(fator)), false));
    }
  });
  return mesclar(partes);
}

/** Cabeças de miosina de todos os filamentos grossos (pescoço + cabeça), inclinadas para as linhas Z. */
export function geometriaCabecas(grossos: Ponto2[], fator = 1): THREE.BufferGeometry {
  const { raioGrosso } = SARCOMERO;
  // Cabeças pequenas: resolução cresce só com a raiz do fator (no nível alto, 10 × 7 em vez de 14 × 10).
  const f = Math.sqrt(fator);
  const cabeca = new THREE.SphereGeometry(1, seg(7, f), seg(5, f, 2));
  const pescoco = new THREE.CylinderGeometry(0.009, 0.009, 1, seg(4, f), 1, true);
  const partes: THREE.BufferGeometry[] = [];
  const inclinacao = (40 * Math.PI) / 180;
  const y = new THREE.Vector3(0, 1, 0);
  for (const g of grossos) {
    for (const c of cabecasMiosina()) {
      const radial = new THREE.Vector3(0, Math.cos(c.angulo), Math.sin(c.angulo));
      const d = radial.clone().multiplyScalar(Math.cos(inclinacao)).add(new THREE.Vector3(c.lado * Math.sin(inclinacao), 0, 0)).normalize();
      const base = new THREE.Vector3(c.x, g[0], g[1]).addScaledVector(radial, raioGrosso * 0.9);
      const comprimentoPescoco = 0.035;
      const q = new THREE.Quaternion().setFromUnitVectors(y, d);
      partes.push(pescoco.clone().applyMatrix4(new THREE.Matrix4().compose(base.clone().addScaledVector(d, comprimentoPescoco / 2), q, new THREE.Vector3(1, comprimentoPescoco, 1))));
      // Cabeça alongada na direção do pescoço.
      partes.push(cabeca.clone().applyMatrix4(new THREE.Matrix4().compose(base.clone().addScaledVector(d, comprimentoPescoco + 0.026), q, new THREE.Vector3(0.019, 0.03, 0.019))));
    }
  }
  cabeca.dispose();
  pescoco.dispose();
  return mesclar(partes);
}

/** Deslocamento da titina em relação ao eixo de cada filamento grosso (entre os finos, voltada para o vizinho). */
export const DESVIO_TITINA: Ponto2 = [0.072, 0];

/** Segmento elástico da titina (banda I): molas de x = 0 a x = comprimento, com nove voltas (comprimem na contração). */
export function geometriaMolasTitina(grossos: Ponto2[], comprimento: number, fator = 1): THREE.BufferGeometry {
  return mesclar(
    grossos.map((g, i) => {
      const centro: Ponto2 = [g[0] + DESVIO_TITINA[0], g[1] + DESVIO_TITINA[1]];
      return new THREE.TubeGeometry(new Helice(comprimento, 0.016, comprimento / 9, i, centro), seg(90, fator, 12), 0.009, seg(4, fator), false);
    }),
  );
}

/** Segmento da titina preso ao filamento grosso (banda A), da ponta do grosso até a linha M, dos dois lados. */
export function geometriaTitinaBandaA(grossos: Ponto2[], fator = 1): THREE.BufferGeometry {
  const meiaA = (SARCOMERO.grosso / 2) * SARCOMERO.escala;
  const y = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(y, new THREE.Vector3(1, 0, 0));
  return mesclar(
    grossos.map((g) => {
      const c = new THREE.CylinderGeometry(0.009, 0.009, 2 * meiaA, seg(5, fator), 1, false);
      return c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, g[0] + DESVIO_TITINA[0], g[1] + DESVIO_TITINA[1]), q, new THREE.Vector3(1, 1, 1)));
    }),
  );
}

/** Retículo sarcoplasmático: 4 cisternas terminais (anéis) e túbulos longitudinais sobre a banda A. */
export function geometriaReticulo(fator = 1): THREE.BufferGeometry {
  const { raioAnel, tuboCisterna, afastamentoCisterna, grosso, escala } = SARCOMERO;
  const a = (grosso / 2) * escala;
  const partes: THREE.BufferGeometry[] = [];
  const giro = new THREE.Matrix4().makeRotationY(Math.PI / 2); // eixo do anel → x
  for (const juncao of [-a, a]) {
    for (const lado of [-1, 1]) {
      const anel = new THREE.TorusGeometry(raioAnel, tuboCisterna, seg(8, fator), seg(56, fator));
      anel.applyMatrix4(giro).translate(juncao + lado * afastamentoCisterna, 0, 0);
      partes.push(anel);
    }
  }
  // Túbulos longitudinais entre as cisternas do lado da banda A (seis, em volta da miofibrila).
  const x0 = -a + afastamentoCisterna;
  const comprimento = 2 * (a - afastamentoCisterna);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
  for (let k = 0; k < 6; k++) {
    const ang = ((30 + 60 * k) * Math.PI) / 180;
    const c = new THREE.CylinderGeometry(0.012, 0.012, comprimento, seg(6, fator), seg(8, fator, 1), true);
    partes.push(c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x0 + comprimento / 2, raioAnel * Math.cos(ang), raioAnel * Math.sin(ang)), q, new THREE.Vector3(1, 1, 1))));
  }
  return mesclar(partes);
}
