// Coerência entre os textos dos modelos 3D da histologia (content/histologia/modelos3d-*.json) e os desenhos
// registrados (src/modules/histologia/modelos3d/grupo-*.tsx), grupo a grupo: o jogo nunca pede o que não
// existe, toda parte desenhada tem nome, e os ids não se confundem com os estágios da embriologia.
import { describe, expect, it } from 'vitest';
import estagios from '../content/embriologia/estagios.json';
import textosA from '../content/histologia/modelos3d-a.json';
import textosB from '../content/histologia/modelos3d-b.json';
import { ModelosHistologia3DArquivoSchema } from '../src/content/schema.ts';
import type { ModeloEstagio } from '../src/modules/embriologia/modelos/index.ts';
import { MODELOS } from '../src/modules/embriologia/modelos/index.ts';
import { MODELOS_HISTO_A } from '../src/modules/histologia/modelos3d/grupo-a.tsx';
import { MODELOS_HISTO_B } from '../src/modules/histologia/modelos3d/grupo-b.tsx';
import { MODELOS_HISTOLOGIA } from '../src/modules/histologia/modelos3d/index.ts';

const grupos: [string, unknown, Record<string, ModeloEstagio>][] = [
  ['A (modelos3d-a.json × grupo-a.tsx)', textosA, MODELOS_HISTO_A],
  ['B (modelos3d-b.json × grupo-b.tsx)', textosB, MODELOS_HISTO_B],
];
const idsEstagios = new Set((estagios as { estagios: { id: string }[] }).estagios.map((e) => e.id));

describe('modelos 3D da histologia: texto × desenho', () => {
  for (const [nome, bruto, registro] of grupos) {
    describe(`grupo ${nome}`, () => {
      const { modelos } = ModelosHistologia3DArquivoSchema.parse(bruto);

      it('todo modelo do texto está no registro e todo modelo registrado tem texto', () => {
        for (const m of modelos) expect(registro[m.id], m.id).toBeDefined();
        for (const id of Object.keys(registro)) expect(modelos.some((m) => m.id === id), id).toBe(true);
      });

      it('estruturas do texto = partes do desenho (sem repetição)', () => {
        for (const m of modelos) {
          const ids = m.estruturas.map((e) => e.id);
          expect(new Set(ids).size, `${m.id}: estruturas repetidas`).toBe(ids.length);
          expect(new Set(registro[m.id]?.partes ?? []).size, `${m.id}: partes repetidas`).toBe(registro[m.id]?.partes.length ?? 0);
          expect(new Set(ids), m.id).toEqual(new Set(registro[m.id]?.partes ?? []));
        }
      });

      it('ids distintos dos estágios da embriologia e dos modelos da embriologia', () => {
        for (const m of modelos) {
          expect(idsEstagios.has(m.id), m.id).toBe(false);
          expect(MODELOS[m.id], m.id).toBeUndefined();
        }
        for (const id of Object.keys(registro)) expect(idsEstagios.has(id), id).toBe(false);
      });

      it('aviso de escala, avisos de interpretação e revisão humana em branco (só o Cristiano preenche)', () => {
        for (const m of modelos) {
          expect(m.escala, m.id).toMatch(/fora de escala/i);
          expect(m.contexto.length, m.id).toBeGreaterThan(0);
          expect(m.revisao.humano, m.id).toBeNull();
          for (const e of m.estruturas) expect(e.descricao.length, `${m.id}: ${e.id}`).toBeGreaterThan(20);
        }
      });

      it('câmera e raio válidos para o enquadramento', () => {
        for (const [id, md] of Object.entries(registro)) {
          expect(Math.hypot(...md.camera), id).toBeGreaterThan(0);
          expect(md.raio, id).toBeGreaterThan(0.5);
          expect(md.raio, id).toBeLessThan(3);
        }
      });
    });
  }

  it('o registro geral junta os dois grupos sem colisão de ids', () => {
    const a = Object.keys(MODELOS_HISTO_A);
    const b = Object.keys(MODELOS_HISTO_B);
    expect(a.filter((id) => b.includes(id))).toEqual([]);
    expect(new Set(Object.keys(MODELOS_HISTOLOGIA))).toEqual(new Set([...a, ...b]));
    const ordens = [...ModelosHistologia3DArquivoSchema.parse(textosA).modelos, ...ModelosHistologia3DArquivoSchema.parse(textosB).modelos].map((m) => m.ordem);
    expect(new Set(ordens).size).toBe(ordens.length);
  });
});
