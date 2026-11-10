// Junções celulares de um epitélio simples cilíndrico (esquema fora de escala): geometria pura, testável.
// Duas células vizinhas lado a lado em x (célula A em x < 0, célula B em x > 0), separadas pela fenda
// intercelular centrada em x = 0; ápice em +y, base em y = JUNCOES.base; profundidade em z.
// Complexo juncional, do ápice para a base: zônula de oclusão → zônula de adesão → desmossomo.
import * as THREE from 'three';
import { mesclar } from './geometria-lobulo.ts';

export type Ponto3 = [number, number, number];

export const JUNCOES = {
  /** largura (x) e profundidade (z) de cada célula */
  largura: 0.8,
  profundidade: 0.7,
  altura: 2.0,
  /** y da face basal das células */
  base: -1.0,
  /** espaço intercelular (muito exagerado) */
  fenda: 0.07,
  /** raio dos cantos verticais das células */
  canto: 0.08,
  /** faixas (zônulas) em y: [baixo, cima] */
  oclusao: [0.86, 0.94] as [number, number],
  adesao: [0.66, 0.79] as [number, number],
  /** cinturão de actina: recuo da membrana para dentro e raio do feixe */
  cinturao: { recuo: 0.065, raio: 0.024 },
  /** desmossomos na face lateral comum: o primeiro (mais apical) completa o complexo juncional */
  desmossomos: [
    { y: 0.53, z: -0.12, alcas: [0.34, 0.24] },
    { y: -0.06, z: 0.17, alcas: [0.34, 0.24] },
    // Na altura do núcleo, alças mais rasas (os filamentos contornam o núcleo).
    { y: -0.5, z: -0.15, alcas: [0.19, 0.14] },
  ],
  placaDesmossomo: { raio: 0.1, espessura: 0.03 },
  /** junção comunicante (placa de conexons) na face lateral comum */
  comunicante: { y: 0.22, z: 0.1, raioPlaca: 0.115, passo: 0.05, raioConexon: 0.018 },
  /** hemidesmossomos: deslocamento em x a partir do centro de cada célula, para o lado da face comum */
  hemidesmossomos: [
    { dx: 0.2, z: -0.16 },
    { dx: -0.16, z: 0.15 },
  ],
  placaHemidesmossomo: { raio: 0.075, espessura: 0.026 },
  /** lâmina basal (lâmina densa) em y: [baixo, cima]; entre ela e a célula, a lâmina lúcida */
  laminaBasal: [-1.11, -1.055] as [number, number],
  microvilos: { nx: 6, nz: 5, passo: 0.12, raio: 0.032, comprimento: 0.18 },
  /** núcleo (elipsoide) no terço basal, um pouco afastado da face comum (dx para fora) */
  nucleo: { y: -0.42, dx: 0.05, raios: [0.2, 0.36, 0.2] as Ponto3 },
} as const;

/** x do centro das duas células (A, B). */
export function centrosCelulas(): [number, number] {
  const c = JUNCOES.fenda / 2 + JUNCOES.largura / 2;
  return [-c, c];
}

/** x da membrana lateral de cada célula voltada para a fenda (A: −fenda/2; B: +fenda/2). */
export const membranaLateral = (lado: -1 | 1) => (lado * JUNCOES.fenda) / 2;

/** Centro do núcleo de cada célula (A, B): no terço basal, deslocado para longe da face comum. */
export function centrosNucleos(): [Ponto3, Ponto3] {
  const [xa, xb] = centrosCelulas();
  const { y, dx } = JUNCOES.nucleo;
  return [[xa - dx, y, 0], [xb + dx, y, 0]];
}

/** Centro de cada placa de desmossomo, dentro do citoplasma, junto à membrana. */
export function placasDesmossomo(): { lado: -1 | 1; centro: Ponto3; indice: number }[] {
  const { espessura } = JUNCOES.placaDesmossomo;
  const lista: { lado: -1 | 1; centro: Ponto3; indice: number }[] = [];
  JUNCOES.desmossomos.forEach((d, indice) => {
    for (const lado of [-1, 1] as const) lista.push({ lado, indice, centro: [lado * (JUNCOES.fenda / 2 + 0.007 + espessura / 2), d.y, d.z] });
  });
  return lista;
}

/** Conexons da junção comunicante: posições (y, z) numa rede hexagonal dentro da placa. */
export function conexons(): [number, number][] {
  const { y, z, raioPlaca, passo } = JUNCOES.comunicante;
  const lista: [number, number][] = [];
  for (let i = -4; i <= 4; i++) {
    for (let j = -4; j <= 4; j++) {
      const dy = passo * (i + j / 2);
      const dz = passo * ((j * Math.sqrt(3)) / 2);
      if (Math.hypot(dy, dz) <= raioPlaca - JUNCOES.comunicante.raioConexon + 1e-9) lista.push([y + dy, z + dz]);
    }
  }
  return lista;
}

/** Comprimento de cada par de conexons: atravessa a fenda e as duas membranas. */
export const COMPRIMENTO_CONEXON = JUNCOES.fenda + 0.04;

/** Hemidesmossomos: centro da placa (dentro da célula, logo acima da membrana basal). */
export function placasHemidesmossomo(): { celula: 0 | 1; centro: Ponto3 }[] {
  const [xa, xb] = centrosCelulas();
  const { espessura } = JUNCOES.placaHemidesmossomo;
  const y = JUNCOES.base + 0.008 + espessura / 2;
  const lista: { celula: 0 | 1; centro: Ponto3 }[] = [];
  for (const h of JUNCOES.hemidesmossomos) {
    // dx > 0 aponta para a face comum nas duas células (espelhado na célula B).
    lista.push({ celula: 0, centro: [xa + h.dx, y, h.z] });
    lista.push({ celula: 1, centro: [xb - h.dx, y, -h.z] });
  }
  return lista;
}

/** Microvilosidades: base (x, z) no ápice de cada célula. */
export function microvilosidades(): [number, number][] {
  const { nx, nz, passo } = JUNCOES.microvilos;
  const lista: [number, number][] = [];
  for (const xc of centrosCelulas()) {
    for (let i = 0; i < nx; i++) {
      for (let k = 0; k < nz; k++) lista.push([xc + (i - (nx - 1) / 2) * passo + (k % 2 ? passo / 4 : -passo / 4), (k - (nz - 1) / 2) * passo]);
    }
  }
  return lista;
}

/** Trajetos dos filamentos de queratina: alças presas às placas e fios que unem hemidesmossomo e desmossomo. */
export function trajetosQueratina(): Ponto3[][] {
  const trajetos: Ponto3[][] = [];
  const f = JUNCOES.fenda / 2 + 0.04;
  for (const p of placasDesmossomo()) {
    const s = p.lado;
    const [, y, z] = p.centro;
    const [funda, rasa] = JUNCOES.desmossomos[p.indice].alcas;
    for (const [dz, fundo] of [[0.04, funda], [-0.05, rasa]] as const) {
      trajetos.push([
        [s * f, y + 0.06, z + dz],
        [s * (f + fundo * 0.55), y + 0.15, z + dz * 2.2],
        [s * (f + fundo), y + 0.02, z + dz * 1.5],
        [s * (f + fundo * 0.6), y - 0.13, z - dz],
        [s * f, y - 0.05, z - dz * 0.6],
      ]);
    }
  }
  // Rede transcelular: de cada hemidesmossomo mais próximo da face comum ao desmossomo mais basal.
  const ultimo = JUNCOES.desmossomos[JUNCOES.desmossomos.length - 1];
  const yPlaca = JUNCOES.base + 0.04;
  for (const h of placasHemidesmossomo()) {
    const s = h.celula === 0 ? -1 : 1;
    const [x, , z] = h.centro;
    const pertoDaFace = Math.abs(x) < JUNCOES.largura / 2;
    if (pertoDaFace) {
      trajetos.push([
        [x, yPlaca, z],
        [x - s * 0.02, yPlaca + 0.18, z + 0.03],
        [(x + s * f) / 2, (yPlaca + ultimo.y) / 2, (z + ultimo.z) / 2],
        [s * (f + 0.03), ultimo.y - 0.07, ultimo.z],
        [s * f, ultimo.y - 0.04, ultimo.z],
      ]);
    } else {
      // Sob o núcleo: alça baixa presa ao hemidesmossomo.
      trajetos.push([
        [x - 0.03, yPlaca, z],
        [x - 0.07, yPlaca + 0.12, z + 0.06],
        [x + 0.02, yPlaca + 0.19, z + 0.02],
        [x + 0.06, yPlaca + 0.1, z - 0.05],
        [x + 0.03, yPlaca, z],
      ]);
    }
  }
  return trajetos;
}

// ------------------------------------------------------------------------------------------
// Geometrias
// ------------------------------------------------------------------------------------------

const seg = (n: number, fator: number, minimo = 3) => Math.max(minimo, Math.round(n * fator));

function contornoArredondado<T extends THREE.Path>(alvo: T, largura: number, profundidade: number, raio: number): T {
  const x = largura / 2;
  const y = profundidade / 2;
  const r = Math.min(raio, x, y);
  alvo.moveTo(-x + r, -y);
  alvo.lineTo(x - r, -y);
  alvo.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  alvo.lineTo(x, y - r);
  alvo.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  alvo.lineTo(-x + r, y);
  alvo.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  alvo.lineTo(-x, -y + r);
  alvo.absarc(-x + r, -y + r, r, Math.PI, 1.5 * Math.PI, false);
  return alvo;
}

/**
 * Corpo da célula: prisma de cantos arredondados extrudado ao longo de +z da forma; o componente o deita
 * (rotação −90° em x: a extrusão vira +y) e o põe na base. Paramétrico (refinável).
 */
export function geometriaCelula(): THREE.ExtrudeGeometry {
  const { largura, profundidade, canto, altura } = JUNCOES;
  return new THREE.ExtrudeGeometry(contornoArredondado(new THREE.Shape(), largura, profundidade, canto), { depth: altura, bevelEnabled: false, curveSegments: 6 });
}

/** Faixa de zônula em volta de uma célula: da membrana (um pouco por dentro) até o meio da fenda. */
export function geometriaFaixa(altura: number): THREE.ExtrudeGeometry {
  const { largura, profundidade, canto, fenda } = JUNCOES;
  const fora = fenda / 2;
  const dentro = 0.016;
  const forma = contornoArredondado(new THREE.Shape(), largura + 2 * fora, profundidade + 2 * fora, canto + fora);
  forma.holes.push(contornoArredondado(new THREE.Path(), largura - 2 * dentro, profundidade - 2 * dentro, canto - dentro));
  return new THREE.ExtrudeGeometry(forma, { depth: altura, bevelEnabled: false, curveSegments: 6 });
}

/** Cinturão de actina: feixe fechado que contorna o citoplasma apical, recuado da membrana (centro na origem). */
export function geometriaCinturao(): THREE.TubeGeometry {
  const { largura, profundidade, canto, cinturao } = JUNCOES;
  const x = largura / 2 - cinturao.recuo;
  const z = profundidade / 2 - cinturao.recuo;
  const r = Math.max(0.02, canto - cinturao.recuo / 2);
  const pontos: THREE.Vector3[] = [];
  const cantos: [number, number, number][] = [
    [x - r, z - r, 0],
    [-x + r, z - r, Math.PI / 2],
    [-x + r, -z + r, Math.PI],
    [x - r, -z + r, 1.5 * Math.PI],
  ];
  for (const [cx, cz, a0] of cantos) {
    for (let i = 0; i <= 3; i++) {
      const a = a0 + (i / 3) * (Math.PI / 2);
      pontos.push(new THREE.Vector3(cx + r * Math.cos(a), 0, cz + r * Math.sin(a)));
    }
  }
  const curva = new THREE.CatmullRomCurve3(pontos, true, 'centripetal');
  return new THREE.TubeGeometry(curva, 96, cinturao.raio, 8, true);
}

export function geometriaMicrovilosidades(fator = 1): THREE.BufferGeometry {
  const { raio, comprimento } = JUNCOES.microvilos;
  const topo = JUNCOES.base + JUNCOES.altura;
  const base = new THREE.CapsuleGeometry(raio, comprimento, seg(3, fator, 2), seg(8, fator));
  const partes = microvilosidades().map(([x, z]) => base.clone().translate(x, topo + comprimento / 2 + raio * 0.4, z));
  base.dispose();
  return mesclar(partes);
}

const EIXO_X = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
const UM = new THREE.Vector3(1, 1, 1);

/** Desmossomos: placas citoplasmáticas dos dois lados e o núcleo extracelular (caderinas) na fenda. */
export function geometriaDesmossomos(fator = 1): THREE.BufferGeometry {
  const { raio, espessura } = JUNCOES.placaDesmossomo;
  const partes: THREE.BufferGeometry[] = [];
  for (const p of placasDesmossomo()) {
    const c = new THREE.CylinderGeometry(raio, raio, espessura, seg(20, fator), 1, false);
    partes.push(c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...p.centro), EIXO_X, UM)));
  }
  for (const d of JUNCOES.desmossomos) {
    const c = new THREE.CylinderGeometry(raio * 0.82, raio * 0.82, JUNCOES.fenda + 0.014, seg(20, fator), 1, false);
    partes.push(c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, d.y, d.z), EIXO_X, UM)));
  }
  return mesclar(partes);
}

export function geometriaConexons(fator = 1): THREE.BufferGeometry {
  const r = JUNCOES.comunicante.raioConexon;
  return mesclar(
    conexons().map(([y, z]) => {
      const c = new THREE.CylinderGeometry(r, r, COMPRIMENTO_CONEXON, seg(8, fator), 1, false);
      return c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, y, z), EIXO_X, UM));
    }),
  );
}

export function geometriaQueratina(fator = 1): THREE.BufferGeometry {
  return mesclar(
    trajetosQueratina().map((pontos) => {
      const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
      return new THREE.TubeGeometry(curva, seg(28, fator, 8), 0.013, seg(5, fator), false);
    }),
  );
}

/** Hemidesmossomos: placa sobre a membrana basal e filamentos de ancoragem até a lâmina basal. */
export function geometriaHemidesmossomos(fator = 1): THREE.BufferGeometry {
  const { raio, espessura } = JUNCOES.placaHemidesmossomo;
  const yMembrana = JUNCOES.base;
  const yLamina = JUNCOES.laminaBasal[1];
  const partes: THREE.BufferGeometry[] = [];
  for (const h of placasHemidesmossomo()) {
    const [x, y, z] = h.centro;
    partes.push(new THREE.CylinderGeometry(raio, raio, espessura, seg(18, fator), 1, false).translate(x, y, z));
    // Filamentos de ancoragem atravessam a lâmina lúcida (até um pouco dentro da lâmina densa).
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const alto = yMembrana + 0.005;
      const baixo = yLamina - 0.012;
      partes.push(new THREE.CylinderGeometry(0.007, 0.007, alto - baixo, seg(4, fator), 1, true).translate(x + 0.045 * Math.cos(a), (alto + baixo) / 2, z + 0.045 * Math.sin(a)));
    }
  }
  return mesclar(partes);
}

/** Lâmina basal (lâmina densa): placa fina sob as duas células. */
export function geometriaLamina(): THREE.BoxGeometry {
  const [y0, y1] = JUNCOES.laminaBasal;
  const largura = 2 * (JUNCOES.fenda / 2 + JUNCOES.largura) + 0.24;
  return new THREE.BoxGeometry(largura, y1 - y0, JUNCOES.profundidade + 0.24);
}
