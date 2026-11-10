import * as THREE from 'three';
import { fatorEmbriao } from '../../tres3d/qualidade.ts';

type Curva = {
  ponto: (t: number) => THREE.Vector3;
  dorsal: (t: number) => THREE.Vector3;
  tangente: (t: number) => THREE.Vector3;
};

export interface ResolucaoSuperficie {
  /** divisões ao redor do eixo (padrão 48 no fator 1; 72 no nível alto) */
  lados?: number;
  /** anéis por unidade de t ao longo da curva (padrão 160 no fator 1) */
  densidade?: number;
  /** anéis de cada semiesfera das extremidades (padrão 8 no fator 1) */
  aneisPonta?: number;
}

/** Resolução padrão pelo nível de qualidade (fator 1 = valores originais; nos testes o fator é 1). */
export function resolucaoSuperficie(fator = fatorEmbriao()): Required<ResolucaoSuperficie> {
  return { lados: Math.round(48 * fator), densidade: Math.round(160 * fator), aneisPonta: Math.round(8 * fator) };
}

/** Superfície contínua do esquema em C; mantém a curva, o perfil e a compressão lateral originais.
 * Intervalos adjacentes compartilham exatamente o mesmo anel (corpo/eminência caudal) quando gerados
 * com a mesma resolução. Só as extremidades anatômicas recebem semiesferas, nunca a divisão entre partes.
 */
export function superficieEmbriao(c: Curva, raio: (t: number) => number, inicio = 0, fim = 1, resolucao: ResolucaoSuperficie = {}) {
  const padrao = resolucaoSuperficie();
  const lados = resolucao.lados ?? padrao.lados;
  const densidade = resolucao.densidade ?? padrao.densidade;
  const aneisPonta = resolucao.aneisPonta ?? padrao.aneisPonta;
  const segmentos = Math.max(2, Math.ceil((fim - inicio) * densidade));
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

  if (inicio === 0) for (let k = aneisPonta; k > 0; k--) anel(0, (k / aneisPonta) * Math.PI / 2, -1);
  for (let i = 0; i <= segmentos; i++) anel(inicio + (fim - inicio) * i / segmentos);
  if (fim === 1) for (let k = 1; k <= aneisPonta; k++) anel(1, (k / aneisPonta) * Math.PI / 2, 1);
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
