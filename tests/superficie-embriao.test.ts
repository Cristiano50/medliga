import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { salienciasAuriculares, superficieEmbriao } from '../src/modules/embriologia/modelos/superficie-embriao.ts';

const angulo = (t: number) => THREE.MathUtils.degToRad(115 - 280 * t);
const curva = {
  ponto: (t: number) => new THREE.Vector3(0.85 * Math.cos(angulo(t)), 0.85 * Math.sin(angulo(t)), 0),
  dorsal: (t: number) => new THREE.Vector3(Math.cos(angulo(t)), Math.sin(angulo(t)), 0),
  tangente: (t: number) => new THREE.Vector3(Math.sin(angulo(t)), -Math.cos(angulo(t)), 0),
};
const raio = (t: number) => 0.4 - 0.355 * t;

describe('superfície embrionária contínua', () => {
  it('mantém a junção corpo/cauda coincidente e com as mesmas normais', () => {
    const corpo = superficieEmbriao(curva, raio, 0, 0.88);
    const cauda = superficieEmbriao(curva, raio, 0.88, 1);
    for (const nome of ['position', 'normal']) {
      const a = corpo.getAttribute(nome);
      const b = cauda.getAttribute(nome);
      for (let j = 0; j < 49; j++) {
        expect(a.getX(a.count - 49 + j)).toBe(b.getX(j));
        expect(a.getY(a.count - 49 + j)).toBe(b.getY(j));
        expect(a.getZ(a.count - 49 + j)).toBe(b.getZ(j));
      }
    }
    corpo.dispose(); cauda.dispose();
  });

  it('possui faces orientadas para fora, normais finitas e simetria lateral', () => {
    const g = superficieEmbriao(curva, raio);
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    const idx = g.getIndex()!;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < idx.count; i += 3) {
      a.fromBufferAttribute(p, idx.getX(i));
      b.fromBufferAttribute(p, idx.getX(i + 1));
      c.fromBufferAttribute(p, idx.getX(i + 2));
      const face = b.sub(a).cross(c.sub(a));
      if (face.lengthSq() > 1e-14) {
        expect(face.dot(new THREE.Vector3().fromBufferAttribute(n, idx.getX(i)))).toBeGreaterThan(0);
      }
    }
    for (let i = 0; i < p.count; i++) {
      expect(Number.isFinite(p.getX(i) + p.getY(i) + p.getZ(i))).toBe(true);
      expect(new THREE.Vector3().fromBufferAttribute(n, i).length()).toBeCloseTo(1, 5);
    }
    expect(g.boundingBox!.min.z).toBeCloseTo(-g.boundingBox!.max.z, 6);
    g.dispose();
  });

  it('gera seis saliências de cada lado com correspondência bilateral', () => {
    const pontos = salienciasAuriculares(curva, raio);
    expect(pontos).toHaveLength(12);
    expect(pontos.filter((p) => p[2] > 0)).toHaveLength(6);
    expect(pontos.filter((p) => p[2] < 0)).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(pontos[i][0]).toBe(pontos[i + 6][0]);
      expect(pontos[i][1]).toBe(pontos[i + 6][1]);
      expect(pontos[i][2]).toBe(-pontos[i + 6][2]);
    }
  });
});
