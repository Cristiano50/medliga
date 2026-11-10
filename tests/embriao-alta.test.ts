// Embriões em resolução alta: os testes antigos (superficie-/escultura-embriao) fixam o padrão (fator 1);
// aqui, a resolução do nível alto (lados 72; grade 60×96×60) mantém as mesmas garantias geométricas.
import { afterEach, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { resolucaoSuperficie, superficieEmbriao } from '../src/modules/embriologia/modelos/superficie-embriao.ts';
import { campoSemana8, esculpirSemana8, resolucaoEscultura } from '../src/modules/embriologia/modelos/escultura-embriao.ts';
import { forcarNivel } from '../src/modules/tres3d/qualidade.ts';

const angulo = (t: number) => THREE.MathUtils.degToRad(115 - 280 * t);
const curva = {
  ponto: (t: number) => new THREE.Vector3(0.85 * Math.cos(angulo(t)), 0.85 * Math.sin(angulo(t)), 0),
  dorsal: (t: number) => new THREE.Vector3(Math.cos(angulo(t)), Math.sin(angulo(t)), 0),
  tangente: (t: number) => new THREE.Vector3(Math.sin(angulo(t)), -Math.cos(angulo(t)), 0),
};
const raio = (t: number) => 0.4 - 0.355 * t;

afterEach(() => forcarNivel(null));

describe('resolução dos embriões por nível', () => {
  it('padrão igual ao desenho anterior no fator 1; 72 lados e grade 60×96×60 no nível alto', () => {
    expect(resolucaoSuperficie(1)).toEqual({ lados: 48, densidade: 160, aneisPonta: 8 });
    expect(resolucaoSuperficie(1.5)).toEqual({ lados: 72, densidade: 240, aneisPonta: 12 });
    expect(resolucaoEscultura(1)).toEqual({ nx: 40, ny: 64, nz: 40 });
    expect(resolucaoEscultura(1.5)).toEqual({ nx: 60, ny: 96, nz: 60 });
    // Sem argumento, o gerador lê o nível (forçado aqui; nos demais testes, fator 1).
    forcarNivel('alta');
    expect(resolucaoSuperficie()).toEqual({ lados: 72, densidade: 240, aneisPonta: 12 });
    expect(resolucaoEscultura()).toEqual({ nx: 60, ny: 96, nz: 60 });
    forcarNivel(null);
    expect(resolucaoSuperficie().lados).toBe(48);
  });

  it('superfície alta: junção corpo/cauda coincidente, faces para fora, normais unitárias e simetria', () => {
    forcarNivel('alta');
    const corpo = superficieEmbriao(curva, raio, 0, 0.88);
    const cauda = superficieEmbriao(curva, raio, 0.88, 1);
    const anel = 73;
    for (const nome of ['position', 'normal']) {
      const a = corpo.getAttribute(nome);
      const b = cauda.getAttribute(nome);
      for (let j = 0; j < anel; j++) {
        expect(a.getX(a.count - anel + j)).toBe(b.getX(j));
        expect(a.getY(a.count - anel + j)).toBe(b.getY(j));
        expect(a.getZ(a.count - anel + j)).toBe(b.getZ(j));
      }
    }
    const baixa = superficieEmbriao(curva, raio, 0, 0.88, resolucaoSuperficie(1));
    expect(corpo.getIndex()!.count).toBeGreaterThan(2 * baixa.getIndex()!.count);
    const g = superficieEmbriao(curva, raio);
    const p = g.getAttribute('position'), n = g.getAttribute('normal'), idx = g.getIndex()!;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < idx.count; i += 3) {
      a.fromBufferAttribute(p, idx.getX(i)); b.fromBufferAttribute(p, idx.getX(i + 1)); c.fromBufferAttribute(p, idx.getX(i + 2));
      const face = b.sub(a).cross(c.sub(a));
      if (face.lengthSq() > 1e-14) expect(face.dot(new THREE.Vector3().fromBufferAttribute(n, idx.getX(i)))).toBeGreaterThan(0);
    }
    for (let i = 0; i < p.count; i++) expect(new THREE.Vector3().fromBufferAttribute(n, i).length()).toBeCloseTo(1, 5);
    expect(g.boundingBox!.min.z).toBeCloseTo(-g.boundingBox!.max.z, 6);
    [corpo, cauda, baixa, g].forEach((x) => x.dispose());
  });

  it('escultura alta: superfície do campo, normais pelo gradiente depois da fusão, orientação externa, cache por resolução', () => {
    const alta = esculpirSemana8({ nx: 60, ny: 96, nz: 60 });
    const padrao = esculpirSemana8({ nx: 40, ny: 64, nz: 40 });
    expect(esculpirSemana8({ nx: 60, ny: 96, nz: 60 })).toBe(alta);
    forcarNivel('alta');
    expect(esculpirSemana8()).toBe(alta);
    forcarNivel(null);
    expect(esculpirSemana8()).toBe(padrao);
    const p = alta.getAttribute('position'), n = alta.getAttribute('normal'), idx = alta.getIndex()!;
    expect(p.count).toBeGreaterThan(2 * padrao.getAttribute('position').count);
    expect(p.count).toBeLessThan(60000);
    expect(idx.count / 3).toBeLessThan(120000);
    const campo = campoSemana8();
    const v = new THREE.Vector3(), normal = new THREE.Vector3(), e = 0.0005;
    let erroCampo = 0, erroNormal = 0, desvio = 0;
    for (let i = 0; i < p.count; i += 7) {
      v.fromBufferAttribute(p, i);
      erroCampo = Math.max(erroCampo, Math.abs(campo(v.x, v.y, v.z)));
      normal.fromBufferAttribute(n, i);
      erroNormal = Math.max(erroNormal, Math.abs(normal.length() - 1));
      const gradiente = new THREE.Vector3(
        campo(v.x + e, v.y, v.z) - campo(v.x - e, v.y, v.z),
        campo(v.x, v.y + e, v.z) - campo(v.x, v.y - e, v.z),
        campo(v.x, v.y, v.z + e) - campo(v.x, v.y, v.z - e),
      ).normalize();
      desvio = Math.max(desvio, gradiente.distanceTo(normal));
    }
    // Vértices interpolados nas arestas da grade: perto da isossuperfície, mais perto que na grade padrão.
    expect(erroCampo).toBeLessThan(0.01);
    expect(erroNormal).toBeLessThan(0.00005);
    expect(desvio).toBeLessThan(1e-6);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    let menor = Infinity;
    for (let i = 0; i < idx.count; i += 3) {
      a.fromBufferAttribute(p, idx.getX(i)); b.fromBufferAttribute(p, idx.getX(i + 1)); c.fromBufferAttribute(p, idx.getX(i + 2));
      normal.fromBufferAttribute(n, idx.getX(i)).add(new THREE.Vector3().fromBufferAttribute(n, idx.getX(i + 1))).add(new THREE.Vector3().fromBufferAttribute(n, idx.getX(i + 2)));
      menor = Math.min(menor, b.sub(a).cross(c.sub(a)).dot(normal));
    }
    expect(menor).toBeGreaterThanOrEqual(-1e-9);
    expect(alta.boundingBox!.max.z).toBeCloseTo(-alta.boundingBox!.min.z, 4);
  }, 30000);
});
