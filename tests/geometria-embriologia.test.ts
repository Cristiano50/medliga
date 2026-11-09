import { describe, expect, it } from 'vitest';
import { Box3, Vector3 } from 'three';
import { geometriaSincicioPolar } from '../src/modules/embriologia/modelos/implantacao.tsx';
import { geometriasVilosidades } from '../src/modules/embriologia/modelos/placenta.tsx';

describe('relações espaciais embriológicas', () => {
  it('mantém o sincício no polo implantado e no mesmo hemicorte das camadas internas', () => {
    const geometria = geometriaSincicioPolar();
    const pos = geometria.getAttribute('position');
    let raioPolar = 0;
    let raioEquatorial = 0;
    const ponto = new Vector3();
    for (let i = 0; i < pos.count; i++) {
      ponto.fromBufferAttribute(pos, i);
      expect(ponto.y).toBeLessThanOrEqual(1e-6);
      expect(ponto.z).toBeLessThanOrEqual(1e-6);
      expect(Number.isFinite(ponto.length())).toBe(true);
      if (ponto.y < -0.9) raioPolar = Math.max(raioPolar, ponto.length());
      if (Math.abs(ponto.y) < 1e-6) raioEquatorial = Math.max(raioEquatorial, ponto.length());
    }
    expect(raioPolar - raioEquatorial).toBeGreaterThan(0.15);
    geometria.dispose();
  });

  it('mantém as árvores vilosas fora do espaço amniótico, entre a placa coriônica e a decídua basal', () => {
    const geometrias = geometriasVilosidades();
    const caixa = new Box3();
    expect(geometrias.length).toBeGreaterThan(0);
    for (const geometria of geometrias) {
      geometria.computeBoundingBox();
      caixa.union(geometria.boundingBox!);
      geometria.dispose();
    }
    // Âmnio termina em y=1,56; a face materna da placa inicia ~1,60.
    // A face inferior da decídua basal está em y>=1,87.
    expect(caixa.min.y).toBeGreaterThan(1.56);
    expect(caixa.max.y).toBeLessThan(1.88);
    expect(caixa.max.y).toBeGreaterThan(1.83);
    expect(caixa.max.z).toBeLessThan(0);
  });
});
