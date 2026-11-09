import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

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
    return (Math.hypot((cos * dx + sin * dy) / r[0], (-sin * dx + cos * dy) / r[1], (z - c[2]) / r[2]) - 1) * escala;
  };
}

/** Segmento afilado com extremos arredondados e pontos articulares preservados. */
function membro(a: V3, b: V3, ra: number, rb: number): Volume {
  const d = b.map((v, i) => v - a[i]);
  const l2 = d.reduce((s, v) => s + v * v, 0);
  return (x, y, z) => {
    const px = x-a[0], py = y-a[1], pz = z-a[2];
    const t = THREE.MathUtils.clamp((px*d[0]+py*d[1]+pz*d[2]) / l2, 0, 1);
    return Math.hypot(px-t*d[0], py-t*d[1], pz-t*d[2]) - THREE.MathUtils.lerp(ra, rb, t);
  };
}

function unir(a: number, b: number, suavidade: number) {
  const h = Math.max(suavidade - Math.abs(a - b), 0) / suavidade;
  return Math.min(a, b) - h * h * suavidade * 0.25;
}

/** Mantém centros e marcos do esquema anterior; une volumes, sem inventar anatomia superficial. */
export function campoSemana8(): Volume {
  const volumes: Volume[] = [
    elipsoide([-0.05, 0.78, 0], [0.56, 0.56, 0.56]),
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
  return (x, y, z) => volumes.reduce((d, volume) => unir(d, volume(x, y, z), 0.055), 100);
}

/** Isosuperfície por tetraedros: malha suave única, sem texturas ou arquivos externos. */
export function esculpirSemana8() {
  const campo = campoSemana8();
  const nx = 40, ny = 64, nz = 40;
  const min: V3 = [-0.8, -1.05, -0.7], max: V3 = [0.7, 1.45, 0.7];
  const passo = max.map((v, i) => (v - min[i]) / [nx, ny, nz][i]);
  const indice = (x: number, y: number, z: number) => (y * (nz + 1) + z) * (nx + 1) + x;
  const valores = new Float32Array((nx + 1) * (ny + 1) * (nz + 1));
  for (let y = 0; y <= ny; y++) for (let z = 0; z <= nz; z++) for (let x = 0; x <= nx; x++) {
    valores[indice(x, y, z)] = campo(min[0] + x * passo[0], min[1] + y * passo[1], min[2] + z * passo[2]);
  }
  const cantos = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const tetraedros = [[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  const pos: number[] = [], normais: number[] = [];
  const normal = (p: THREE.Vector3) => {
    const e = 0.0005, { x, y, z } = p;
    return new THREE.Vector3(campo(x+e,y,z)-campo(x-e,y,z), campo(x,y+e,z)-campo(x,y-e,z), campo(x,y,z+e)-campo(x,y,z-e)).normalize();
  };
  function triangulo(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
    const na = normal(a); let nb = normal(b), nc = normal(c);
    const face = b.clone().sub(a).cross(c.clone().sub(a));
    if (face.lengthSq() < 1e-18) return;
    if (face.dot(na.clone().add(nb).add(nc)) < 0) { [b,c] = [c,b]; [nb,nc] = [nc,nb]; }
    for (const p of [a,b,c]) pos.push(p.x,p.y,p.z);
    for (const n of [na,nb,nc]) normais.push(n.x,n.y,n.z);
  }
  for (let y = 0; y < ny; y++) for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
    const vs = cantos.map(([dx,dy,dz]) => valores[indice(x+dx,y+dy,z+dz)]);
    if (vs.every(v=>v>=0) || vs.every(v=>v<0)) continue;
    const ps = cantos.map(([dx,dy,dz]) => new THREE.Vector3(min[0]+(x+dx)*passo[0],min[1]+(y+dy)*passo[1],min[2]+(z+dz)*passo[2]));
    const cruzar = (a: number, b: number) => ps[a].clone().lerp(ps[b], vs[a]/(vs[a]-vs[b]));
    for (const t of tetraedros) {
      const dentro = t.filter(i=>vs[i]<0), fora = t.filter(i=>vs[i]>=0);
      if (!dentro.length || !fora.length) continue;
      if (dentro.length === 1 || fora.length === 1) {
        const unico = dentro.length === 1 ? dentro : fora;
        const outros = dentro.length === 1 ? fora : dentro;
        triangulo(cruzar(unico[0],outros[0]),cruzar(unico[0],outros[1]),cruzar(unico[0],outros[2]));
      } else {
        const a=cruzar(dentro[0],fora[0]), b=cruzar(dentro[0],fora[1]), c=cruzar(dentro[1],fora[0]), d=cruzar(dentro[1],fora[1]);
        triangulo(a,b,c); triangulo(b,d,c);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('normal',new THREE.Float32BufferAttribute(normais,3));
  const compacta = mergeVertices(geo, 1e-6);
  geo.dispose();
  compacta.computeBoundingBox(); compacta.computeBoundingSphere();
  return compacta;
}
