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
  it('estágios em ordem cronológica dentro de cada grupo', () => {
    for (const g of ['desenvolvimento', 'sistemas']) {
      const dias = dados.estagios.filter((e) => e.grupo === g).sort((a, b) => a.ordem - b.ordem).map((e) => e.diaReferencia);
      expect(dias, g).toEqual([...dias].sort((a, b) => a - b));
    }
  });
  it('todo modelo registrado tem estágio no conteúdo', () => {
    const ids = new Set(dados.estagios.map((e) => e.id));
    for (const id of Object.keys(MODELOS)) expect(ids.has(id), id).toBe(true);
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

import laminas from '../content/histologia/laminas.json';
import { AREA_PADRAO, LAMINAS_RENDER } from '../src/modules/histologia/laminas/index.ts';
import { LaminasArquivoSchema } from '../src/content/schema.ts';

describe('lâminas do microscópio virtual', () => {
  const dados = LaminasArquivoSchema.parse(laminas);
  it('toda lâmina tem desenho e todo desenho tem lâmina', () => {
    for (const l of dados.laminas) expect(LAMINAS_RENDER[l.id], l.id).toBeDefined();
    for (const id of Object.keys(LAMINAS_RENDER)) expect(dados.laminas.some((l) => l.id === id), id).toBe(true);
  });
  it('estruturas do texto e do desenho são as mesmas (o jogo não pede o que não existe)', () => {
    for (const l of dados.laminas) {
      expect(new Set(l.estruturas.map((e) => e.id)), l.id).toEqual(new Set(LAMINAS_RENDER[l.id].partes));
    }
  });
  it('o campo do jogo "Qual é o tecido?" é sorteado numa área diagnóstica dentro do SVG', () => {
    // lâminas em que um campo de 10× fora da área mostraria só conjuntivo ou só neurópilo
    for (const id of ['epitelio-pseudoestratificado-traqueia', 'pele-espessa', 'epitelio-transicao-bexiga', 'neuronio-medula']) {
      expect(LAMINAS_RENDER[id].areaDiagnostica, id).toBeDefined();
    }
    for (const [id, r] of Object.entries(LAMINAS_RENDER)) {
      const [x0, y0, x1, y1] = r.areaDiagnostica ?? AREA_PADRAO;
      expect(x0 < x1 && y0 < y1 && x0 >= 0 && y0 >= 0 && x1 <= 1000 && y1 <= 700, id).toBe(true);
    }
  });
});
