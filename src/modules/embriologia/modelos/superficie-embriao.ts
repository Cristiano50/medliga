import * as THREE from 'three';

type Curva = {
  ponto: (t: number) => THREE.Vector3;
  dorsal: (t: number) => THREE.Vector3;
  tangente: (t: number) => THREE.Vector3;
};

/** Superfície contínua do esquema em C; mantém a curva, o perfil e a compressão lateral originais.
 * Intervalos adjacentes compartilham exatamente o mesmo anel (corpo/eminência caudal).
 * Só as extremidades anatômicas recebem semiesferas, nunca a divisão entre partes.
 */
export function superficieEmbriao(c: Curva, raio: (t: number) => number, inicio = 0, fim = 1) {
  const segmentos = Math.max(2, Math.ceil((fim - inicio) * 160));
  const lados = 48;
  const pos: number[] = [];
  const normais: number[] = [];
  const indices: number[] = [];
  const z = new THREE.Vector3(0, 0, 1);

  function anel(t: number, latitude = 0, ponta: -1 | 0 | 1 = 0) {
    const centro = c.ponto(t);
    const dorsal = c.dorsal(t);
    const tangente = c.tangente(t);
    const r = raio(t);
    const cosLat = Math.cos(latitude);
    const sinLat = Math.sin(latitude);
    for (let j = 0; j <= lados; j++) {
      const ang = (j / lados) * Math.PI * 2;
      const radial = dorsal.clone().multiplyScalar(Math.cos(ang)).addScaledVector(z, Math.sin(ang));
      const p = centro.clone().addScaledVector(radial, r * cosLat).addScaledVector(tangente, ponta * r * sinLat);
      let normal: THREE.Vector3;
      if (ponta) {
        normal = radial.clone().multiplyScalar(cosLat).addScaledVector(tangente, ponta * sinLat);
      } else {
        // A derivada inclui curvatura e variação de calibre; idêntica dos dois lados da junção.
        const antes = Math.max(0, t - 0.0001);
        const depois = Math.min(1, t + 0.0001);
        const superficie = (u: number) => c.ponto(u).addScaledVector(c.dorsal(u), raio(u) * Math.cos(ang)).addScaledVector(z, raio(u) * Math.sin(ang));
        const longitudinal = superficie(depois).sub(superficie(antes));
        const angular = dorsal.clone().multiplyScalar(-Math.sin(ang)).addScaledVector(z, Math.cos(ang));
        normal = angular.cross(longitudinal).normalize();
      }
      // Transformação inversa-transposta para a compressão lateral original.
      normal.z /= 0.88;
      normal.normalize();
      pos.push(p.x, p.y, p.z * 0.88);
      normais.push(normal.x, normal.y, normal.z);
    }
  }

  if (inicio === 0) for (let k = 8; k > 0; k--) anel(0, (k / 8) * Math.PI / 2, -1);
  for (let i = 0; i <= segmentos; i++) anel(inicio + (fim - inicio) * i / segmentos);
  if (fim === 1) for (let k = 1; k <= 8; k++) anel(1, (k / 8) * Math.PI / 2, 1);
  const aneis = pos.length / 3 / (lados + 1);
  for (let i = 0; i < aneis - 1; i++) for (let j = 0; j < lados; j++) {
    const a = i * (lados + 1) + j;
    const b = a + lados + 1;
    indices.push(a, a + 1, b, a + 1, b + 1, b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normais, 3));
  geo.setIndex(indices);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/** Seis saliências em cada lado, no esquema tradicional do primeiro sulco faríngeo. */
export function salienciasAuriculares(c: Curva, raio: (t: number) => number): [number, number, number][] {
  const t = 0.11;
  const pontos: [number, number, number][] = [];
  for (const lado of [1, -1]) {
    const centro = c.ponto(t).add(new THREE.Vector3(0, 0, lado * raio(t) * 0.92));
    for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3;
      const p = centro.clone().addScaledVector(c.tangente(t), Math.cos(ang) * 0.09).addScaledVector(c.dorsal(t), -Math.sin(ang) * 0.09);
      pontos.push([p.x, p.y, p.z]);
    }
  }
  return pontos;
}
