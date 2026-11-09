import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { bocaSemana8, campoSemana8, cordaoSemana8, esculpirSemana8, marcosFaceSemana8, pavilhaoSemana8 } from '../src/modules/embriologia/modelos/escultura-embriao.ts';

describe('escultura da semana 8', () => {
  it('assenta olhos e orelhas bilateralmente na superfície e mantém orelhas abaixo dos olhos', () => {
    const campo = campoSemana8();
    const marcos = marcosFaceSemana8();
    for (const pares of [marcos.olhos, marcos.orelhas]) {
      expect(pares).toHaveLength(2);
      expect(pares[0].posicao.x).toBe(pares[1].posicao.x);
      expect(pares[0].posicao.y).toBe(pares[1].posicao.y);
      expect(pares[0].posicao.z).toBeCloseTo(-pares[1].posicao.z, 7);
      for (const marco of pares) {
        const { x, y, z } = marco.posicao;
        expect(Math.abs(campo(x, y, z))).toBeLessThan(1e-7);
        expect(new THREE.Vector3(0, 0, 1).applyEuler(marco.rotacao).distanceTo(marco.normal)).toBeLessThan(1e-6);
        const base = marco.posicao.clone().addScaledVector(marco.normal, -0.02);
        expect(campo(base.x, base.y, base.z)).toBeLessThan(0);
      }
    }
    expect(marcos.orelhas[0].posicao.y).toBeLessThan(marcos.olhos[0].posicao.y);
  });

  it('mantém boca aderente à face e pavilhão finito com superfície posterior integrada', () => {
    const campo = campoSemana8();
    const boca = bocaSemana8();
    const p = boca.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      expect(Math.abs(campo(p.getX(i), p.getY(i), p.getZ(i)))).toBeLessThan(0.009);
    }
    const orelha = pavilhaoSemana8();
    const n = orelha.getAttribute('normal');
    expect(Array.from(orelha.getAttribute('position').array).every(Number.isFinite)).toBe(true);
    for (let i = 0; i < n.count; i++) expect(new THREE.Vector3().fromBufferAttribute(n, i).length()).toBeCloseTo(1, 4);
    boca.dispose(); orelha.dispose();
  });

  it('preserva bilateralidade e continuidade nos marcos articulares e cervicais', () => {
    const campo = campoSemana8();
    for (const lado of [-1, 1]) {
      for (const [x,y,z] of [[-.02,.35,.3],[-.12,0,.42],[-.42,.18,.4],[.2,-.42,.24],[-.22,-.52,.36],[-.08,-.85,.3]]) {
        expect(campo(x,y,z*lado)).toBeLessThan(0);
        expect(campo(x,y,z)).toBeCloseTo(campo(x,y,-z), 5);
      }
    }
    for(let y=0;y<=.8;y+=.02) expect(campo(0,y,0)).toBeLessThan(0);
    // Sem cauda ou prolongamento além do envelope craniano/corporal.
    expect(campo(0,1.4,0)).toBeGreaterThan(0);
    expect(campo(0,-1.04,0)).toBeGreaterThan(0);
  });

  it('gera superfície finita com normais unitárias, orientação externa e orçamento limitado', () => {
    const geo=esculpirSemana8();
    const p=geo.getAttribute('position'), n=geo.getAttribute('normal'), idx=geo.getIndex()!;
    expect(p.count).toBeLessThan(30000);
    expect(idx.count/3).toBeLessThan(50000);
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),normal=new THREE.Vector3();
    let finita = true, erroNormal = 0, menorOrientacao = Infinity;
    for(let i=0;i<p.count;i++) {
      finita &&= Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i));
      erroNormal = Math.max(erroNormal, Math.abs(normal.fromBufferAttribute(n,i).length() - 1));
    }
    for(let i=0;i<idx.count;i+=3) {
      a.fromBufferAttribute(p,idx.getX(i)); b.fromBufferAttribute(p,idx.getX(i+1)); c.fromBufferAttribute(p,idx.getX(i+2));
      normal.fromBufferAttribute(n,idx.getX(i)).add(new THREE.Vector3().fromBufferAttribute(n,idx.getX(i+1))).add(new THREE.Vector3().fromBufferAttribute(n,idx.getX(i+2)));
      menorOrientacao = Math.min(menorOrientacao, b.sub(a).cross(c.sub(a)).dot(normal));
    }
    expect(finita).toBe(true);
    expect(erroNormal).toBeLessThan(0.00005);
    expect(menorOrientacao).toBeGreaterThanOrEqual(-1e-9);
    expect(geo.boundingBox!.max.z).toBeCloseTo(-geo.boundingBox!.min.z,5);
    geo.dispose();
  }, 15000);

  it('mantém extremidades do cordão e geometria válida', () => {
    const geo=cordaoSemana8();
    const p=geo.getAttribute('position');
    const campo = campoSemana8();
    // Toda a tampa proximal está dentro do corpo, não somente seu centro.
    for(let i=49*21;i<49*21+22;i++) expect(campo(p.getX(i),p.getY(i),p.getZ(i))).toBeLessThan(0);
    for (const centro of [new THREE.Vector3(-.12,-.08,-.12),new THREE.Vector3(-1.2,-.55,.5)]) {
      let menor=Infinity;
      for(let i=0;i<p.count;i++) menor=Math.min(menor,new THREE.Vector3().fromBufferAttribute(p,i).distanceTo(centro));
      expect(menor).toBeLessThan(1e-6);
    }
    expect(Array.from(p.array).every(Number.isFinite)).toBe(true);
    geo.dispose();
  });
});
