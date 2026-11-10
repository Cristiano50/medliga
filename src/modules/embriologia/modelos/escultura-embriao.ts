import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { fatorEmbriao } from '../../tres3d/qualidade.ts';

type V3 = [number, number, number];
type Volume = (x: number, y: number, z: number) => number;

/** Cordão curvo esquemático, passando pela inserção original; extremo proximal enterrado no tronco. */
export function cordaoSemana8() {
  const inicio = new THREE.Vector3(-0.12, -0.08, -0.12);
  const insercao = new THREE.Vector3(-0.36, -0.18, 0);
  const fim = new THREE.Vector3(-1.2, -0.55, 0.5);
  const curva = new THREE.CatmullRomCurve3([
    inicio, insercao, insercao.clone().lerp(fim, 0.22), new THREE.Vector3(-0.9, -0.31, 0.35), fim,
  ]);
  const tubo = new THREE.TubeGeometry(curva, 48, 0.105, 20, false);
  const tampas = [0, 1].map((t) => {
    const disco = new THREE.CircleGeometry(0.105, 20);
    const direcao = curva.getTangent(t).multiplyScalar(t === 0 ? -1 : 1);
    disco.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), direcao));
    const p = curva.getPoint(t); disco.translate(p.x,p.y,p.z);
    return disco;
  });
  const geometria = mergeGeometries([tubo, ...tampas]);
  tubo.dispose(); tampas.forEach(g=>g.dispose());
  return geometria;
}

/** Campo elipsoidal: envelope didático, não superfície reconstruída de espécime. */
function elipsoide(c: V3, r: V3, angulo = 0): Volume {
  const cos = Math.cos(angulo), sin = Math.sin(angulo);
  const escala = Math.min(...r);
  return (x, y, z) => {
    const dx = x - c[0], dy = y - c[1];
    const u = (cos * dx + sin * dy) / r[0], v = (-sin * dx + cos * dy) / r[1], w = (z - c[2]) / r[2];
    return (Math.sqrt(u * u + v * v + w * w) - 1) * escala;
  };
}

/** Segmento afilado com extremos arredondados e pontos articulares preservados. */
function membro(a: V3, b: V3, ra: number, rb: number): Volume {
  const d = b.map((v, i) => v - a[i]);
  const l2 = d.reduce((s, v) => s + v * v, 0);
  return (x, y, z) => {
    const px = x-a[0], py = y-a[1], pz = z-a[2];
    const t = THREE.MathUtils.clamp((px*d[0]+py*d[1]+pz*d[2]) / l2, 0, 1);
    const qx = px-t*d[0], qy = py-t*d[1], qz = pz-t*d[2];
    return Math.sqrt(qx*qx + qy*qy + qz*qz) - (ra + (rb - ra) * t);
  };
}

function unir(a: number, b: number, suavidade: number) {
  const h = Math.max(suavidade - Math.abs(a - b), 0) / suavidade;
  return Math.min(a, b) - h * h * suavidade * 0.25;
}

/** Envelope didático: crânio oval, pequena região facial e transição cervical curta.
 * Parâmetros gráficos, não medidas de espécime. Membros mantêm os marcos anteriores. */
export function campoSemana8(): Volume {
  const volumes: Volume[] = [
    elipsoide([-0.015, 0.83, 0], [0.49, 0.51, 0.445]),
    elipsoide([-0.31, 0.62, 0], [0.24, 0.22, 0.30]),
    elipsoide([-0.32, 0.49, 0], [0.19, 0.115, 0.22]),
    // Proeminência nasal pequena e baixa, sem ponte/queixo de adulto.
    elipsoide([-0.535, 0.645, 0], [0.085, 0.066, 0.08]),
    elipsoide([0.08, -0.05, 0], [0.42, 0.62, 0.38], 0.25),
    elipsoide([0.01, 0.34, 0], [0.24, 0.31, 0.27]),
  ];
  for (const lado of [1, -1]) {
    const ombro: V3 = [-0.02, 0.35, lado * 0.3];
    const cotovelo: V3 = [-0.12, 0, lado * 0.42];
    const punho: V3 = [-0.42, 0.18, lado * 0.4];
    const quadril: V3 = [0.2, -0.42, lado * 0.24];
    const joelho: V3 = [-0.22, -0.52, lado * 0.36];
    const tornozelo: V3 = [-0.08, -0.85, lado * 0.3];
    volumes.push(
      membro(ombro, cotovelo, 0.09, 0.075),
      membro(cotovelo, punho, 0.075, 0.055),
      elipsoide([-0.5, 0.23, lado * 0.4], [0.08, 0.07, 0.04]),
      membro(quadril, joelho, 0.11, 0.085),
      membro(joelho, tornozelo, 0.085, 0.055),
      elipsoide([-0.18, -0.89, lado * 0.3], [0.11, 0.05, 0.05]),
    );
  }
  // Laço simples (mesma ordem de união do reduce): o campo é avaliado centenas de milhares de vezes.
  return (x, y, z) => {
    let d = 100;
    for (let i = 0; i < volumes.length; i++) d = unir(d, volumes[i](x, y, z), 0.055);
    return d;
  };
}

/** Assenta um marco na superfície real do campo, em vez de aproximá-lo à esfera antiga. */
export function marcosFaceSemana8() {
  const campo = campoSemana8();
  function assentar(x: number, y: number, lado: number) {
    let dentro = 0, fora = 0.75;
    for (let i = 0; i < 32; i++) {
      const meio = (dentro + fora) / 2;
      if (campo(x, y, meio * lado) < 0) dentro = meio; else fora = meio;
    }
    const posicao = new THREE.Vector3(x, y, lado * (dentro + fora) / 2);
    const e = 0.0001, z = posicao.z;
    const normal = new THREE.Vector3(campo(x+e,y,z)-campo(x-e,y,z), campo(x,y+e,z)-campo(x,y-e,z), campo(x,y,z+e)-campo(x,y,z-e)).normalize();
    const cima = new THREE.Vector3(0, 1, 0).addScaledVector(normal, -normal.y).normalize();
    const direita = new THREE.Vector3().crossVectors(cima, normal).normalize();
    const rotacao = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(direita, cima, normal));
    return { posicao, rotacao, normal };
  }
  return {
    olhos: [1, -1].map((lado) => assentar(-0.365, 0.755, lado)),
    orelhas: [1, -1].map((lado) => assentar(0.035, 0.60, lado)),
  };
}

/** Pavilhão simples fechado: concha rasa e rebordo integrado, sem anel solto. */
export function pavilhaoSemana8() {
  const pos: number[] = [], indices: number[] = [];
  const aneis = 10, lados = 40, camada = (aneis + 1) * (lados + 1);
  for (let face = 0; face < 2; face++) for (let i = 0; i <= aneis; i++) {
    const r = i / aneis;
    for (let j = 0; j <= lados; j++) {
      const ang = j * Math.PI * 2 / lados;
      const altura = face === 0 ? 0.009 + 0.021 * Math.exp(-(((r - 0.78) / 0.22) ** 2)) : -0.025 * (1 - r * r);
      pos.push(Math.cos(ang) * r * 0.062, Math.sin(ang) * r * 0.087, altura);
    }
  }
  for (let i = 0; i < aneis; i++) for (let j = 0; j < lados; j++) {
    const a = i * (lados + 1) + j, b = a + lados + 1;
    indices.push(a, b, a + 1, a + 1, b, b + 1);
    indices.push(a + camada, a + 1 + camada, b + camada, a + 1 + camada, b + 1 + camada, b + camada);
  }
  for (let j = 0; j < lados; j++) {
    const a = aneis * (lados + 1) + j;
    indices.push(a, a + camada, a + 1, a + 1, a + camada, a + 1 + camada);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(indices);
  const compacta = mergeVertices(g, 1e-6);
  g.dispose(); compacta.computeVertexNormals();
  return compacta;
}

/** Sulco bucal superficial discreto, aderente à face e sem dentes ou lábios adultos. */
export function bocaSemana8() {
  const campo = campoSemana8();
  const pontos: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const z = (i / 16 - 0.5) * 0.14;
    const y = 0.535; // Sulco neutro: não atribuir expressão facial ao embrião.
    let fora = -0.8, dentro = -0.2;
    for (let k = 0; k < 28; k++) {
      const meio = (fora + dentro) / 2;
      if (campo(meio, y, z) < 0) dentro = meio; else fora = meio;
    }
    pontos.push(new THREE.Vector3((fora + dentro) / 2 - 0.002, y, z));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pontos), 32, 0.005, 8, false);
}

export interface ResolucaoEscultura {
  /** células da grade em x, y, z (padrão 40×64×40 no fator 1; 60×96×60 no nível alto) */
  nx?: number;
  ny?: number;
  nz?: number;
}

/** Resolução padrão pelo nível de qualidade (fator 1 = grade original; nos testes o fator é 1). */
export function resolucaoEscultura(fator = fatorEmbriao()): Required<ResolucaoEscultura> {
  return { nx: Math.round(40 * fator), ny: Math.round(64 * fator), nz: Math.round(40 * fator) };
}

/** Uma geometria por resolução no módulo: a grade alta custa caro e o modelo pode ser remontado. */
const esculturas = new Map<string, THREE.BufferGeometry>();

/** Isosuperfície por tetraedros: malha suave única, sem texturas ou arquivos externos.
 * As normais vêm do gradiente do campo, calculadas depois do mergeVertices (uma vez por vértice);
 * a orientação de cada triângulo segue essas normais. O dispose do componente libera só a GPU:
 * a geometria em cache continua válida e é reenviada se o modelo voltar. */
export function esculpirSemana8(resolucao: ResolucaoEscultura = {}) {
  const padrao = resolucaoEscultura();
  const nx = resolucao.nx ?? padrao.nx, ny = resolucao.ny ?? padrao.ny, nz = resolucao.nz ?? padrao.nz;
  const chave = `${nx}x${ny}x${nz}`;
  const pronta = esculturas.get(chave);
  if (pronta) return pronta;
  const campo = campoSemana8();
  const min: V3 = [-0.8, -1.05, -0.7], max: V3 = [0.7, 1.45, 0.7];
  const passo = max.map((v, i) => (v - min[i]) / [nx, ny, nz][i]);
  const indice = (x: number, y: number, z: number) => (y * (nz + 1) + z) * (nx + 1) + x;
  const valores = new Float32Array((nx + 1) * (ny + 1) * (nz + 1));
  for (let y = 0; y <= ny; y++) for (let z = 0; z <= nz; z++) for (let x = 0; x <= nx; x++) {
    valores[indice(x, y, z)] = campo(min[0] + x * passo[0], min[1] + y * passo[1], min[2] + z * passo[2]);
  }
  const cantos = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const tetraedros = [[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  const pos: number[] = [];
  const ab = new THREE.Vector3(), ac = new THREE.Vector3();
  function triangulo(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
    if (ab.subVectors(b, a).cross(ac.subVectors(c, a)).lengthSq() < 1e-18) return;
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }
  const vs = new Array<number>(8);
  const ps = cantos.map(() => new THREE.Vector3());
  for (let y = 0; y < ny; y++) for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
    let negativos = 0;
    for (let k = 0; k < 8; k++) {
      const [dx, dy, dz] = cantos[k];
      vs[k] = valores[indice(x + dx, y + dy, z + dz)];
      if (vs[k] < 0) negativos++;
    }
    if (negativos === 0 || negativos === 8) continue;
    for (let k = 0; k < 8; k++) {
      const [dx, dy, dz] = cantos[k];
      ps[k].set(min[0] + (x + dx) * passo[0], min[1] + (y + dy) * passo[1], min[2] + (z + dz) * passo[2]);
    }
    const cruzar = (a: number, b: number) => ps[a].clone().lerp(ps[b], vs[a] / (vs[a] - vs[b]));
    for (const t of tetraedros) {
      const dentro = t.filter((i) => vs[i] < 0), fora = t.filter((i) => vs[i] >= 0);
      if (!dentro.length || !fora.length) continue;
      if (dentro.length === 1 || fora.length === 1) {
        const unico = dentro.length === 1 ? dentro : fora;
        const outros = dentro.length === 1 ? fora : dentro;
        triangulo(cruzar(unico[0], outros[0]), cruzar(unico[0], outros[1]), cruzar(unico[0], outros[2]));
      } else {
        const a = cruzar(dentro[0], fora[0]), b = cruzar(dentro[0], fora[1]), c = cruzar(dentro[1], fora[0]), d = cruzar(dentro[1], fora[1]);
        triangulo(a, b, c); triangulo(b, d, c);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const compacta = mergeVertices(geo, 1e-6);
  geo.dispose();
  // Normais pelo gradiente do campo, uma vez por vértice já fundido.
  const p = compacta.getAttribute('position');
  const normais = new Float32Array(p.count * 3);
  const n = new THREE.Vector3();
  const e = 0.0005;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    n.set(campo(x + e, y, z) - campo(x - e, y, z), campo(x, y + e, z) - campo(x, y - e, z), campo(x, y, z + e) - campo(x, y, z - e)).normalize();
    normais[i * 3] = n.x; normais[i * 3 + 1] = n.y; normais[i * 3 + 2] = n.z;
  }
  compacta.setAttribute('normal', new THREE.BufferAttribute(normais, 3));
  // Orientação externa: a face concorda com a soma das normais dos seus vértices.
  const idx = compacta.getIndex()!;
  const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3(), soma = new THREE.Vector3();
  for (let i = 0; i < idx.count; i += 3) {
    const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2);
    va.fromBufferAttribute(p, a); vb.fromBufferAttribute(p, b).sub(va); vc.fromBufferAttribute(p, c).sub(va);
    soma.set(normais[a * 3] + normais[b * 3] + normais[c * 3], normais[a * 3 + 1] + normais[b * 3 + 1] + normais[c * 3 + 1], normais[a * 3 + 2] + normais[b * 3 + 2] + normais[c * 3 + 2]);
    if (vb.cross(vc).dot(soma) < 0) { idx.setX(i + 1, c); idx.setX(i + 2, b); }
  }
  compacta.computeBoundingBox(); compacta.computeBoundingSphere();
  esculturas.set(chave, compacta);
  return compacta;
}
