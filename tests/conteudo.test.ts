// Consistência entre conteúdo e modelos 3D.
import { describe, expect, it } from 'vitest';
import estagios from '../content/embriologia/estagios.json';
import { MODELOS } from '../src/modules/embriologia/modelos/index.ts';
import { EstagiosArquivoSchema } from '../src/content/schema.ts';

describe('estágios 3D', () => {
  const dados = EstagiosArquivoSchema.parse(estagios);
  it('todo estágio tem modelo', () => {
    for (const e of dados.estagios) expect(MODELOS[e.id], e.id).toBeDefined();
  });
  it('toda estrutura listada no estágio existe no modelo (senão o jogo Identifique pede algo impossível)', () => {
    for (const e of dados.estagios) {
      const partes = new Set(MODELOS[e.id].partes);
      for (const s of e.estruturas) expect(partes.has(s.id), `${e.id}: ${s.id}`).toBe(true);
    }
  });
  it('toda parte do modelo tem nome no estágio (exceto partes só de exibição)', () => {
    for (const e of dados.estagios) {
      const nomes = new Set(e.estruturas.map((s) => s.id));
      for (const p of MODELOS[e.id].partes) expect(nomes.has(p), `${e.id}: parte ${p} sem nome`).toBe(true);
    }
  });
  it('estágios em ordem cronológica', () => {
    const dias = [...dados.estagios].sort((a, b) => a.ordem - b.ordem).map((e) => e.diaReferencia);
    expect(dias).toEqual([...dias].sort((a, b) => a - b));
  });
});

describe('questões de múltipla escolha', () => {
  const arquivos = import.meta.glob('../content/*/topicos/*.json', { eager: true, import: 'default' }) as Record<
    string,
    { id: string; questoes: { tipo: string; id: string; correta?: string; alternativas?: { id: string }[] }[] }
  >;
  it('alternativas com ids em ordem a, b, c… (a letra exibida é a citada na explicação)', () => {
    for (const t of Object.values(arquivos))
      for (const q of t.questoes)
        if (q.tipo === 'multipla') expect(q.alternativas!.map((a) => a.id).join(''), q.id).toBe('abcde'.slice(0, q.alternativas!.length));
  });
});
