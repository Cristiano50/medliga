// Apoio geométrico puro (sem React) dos modelos 3D da histologia.
import * as THREE from 'three';

export type V3 = [number, number, number];
export const vec = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);

/** Trecho [inicio, fim] (fração do comprimento) de outra curva; continua refinável pelo TubeGeometry. */
export class TrechoDeCurva extends THREE.Curve<THREE.Vector3> {
  constructor(
    readonly curva: THREE.Curve<THREE.Vector3>,
    readonly inicio: number,
    readonly fim: number,
  ) {
    super();
  }
  override getPoint(t: number, alvo = new THREE.Vector3()): THREE.Vector3 {
    return alvo.copy(this.curva.getPointAt(this.inicio + (this.fim - this.inicio) * t));
  }
}

/** Curva Catmull-Rom centrípeta (sem laçadas nem "estouros" entre pontos próximos). */
export function curva(pontos: V3[], fechada = false): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(pontos.map(vec), fechada, 'centripetal');
}

/** Fração do comprimento da curva mais próxima de um ponto (busca em `amostras` passos). */
export function fracaoMaisProxima(c: THREE.Curve<THREE.Vector3>, ponto: THREE.Vector3, amostras = 2000): number {
  let melhor = 0;
  let distancia = Infinity;
  const p = new THREE.Vector3();
  for (let i = 0; i <= amostras; i++) {
    const u = i / amostras;
    c.getPointAt(u, p);
    const d = p.distanceToSquared(ponto);
    if (d < distancia) { distancia = d; melhor = u; }
  }
  return melhor;
}

/** Base ortonormal (e1, e2) perpendicular a `eixo`, determinística. */
export function basePerpendicular(eixo: THREE.Vector3): [THREE.Vector3, THREE.Vector3] {
  const auxiliar = Math.abs(eixo.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const e1 = new THREE.Vector3().crossVectors(auxiliar, eixo).normalize();
  const e2 = new THREE.Vector3().crossVectors(eixo, e1).normalize();
  return [e1, e2];
}

/** Quaternion que leva o eixo +y local para `direcao`. */
export function girarYPara(direcao: THREE.Vector3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao.clone().normalize());
}
