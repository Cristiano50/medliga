import { describe, expect, it } from 'vitest';
import { calcularXP, corrigir, nivelPorXP, tituloDoNivel } from '../src/core/scoring.ts';
import { novoEstado, registrarResposta, vencidos, dominio, INTERVALOS_DIAS, inicioDoDia } from '../src/core/srs.ts';
import { montarSessao } from '../src/core/session.ts';
import { criarRng, embaralhar } from '../src/core/random.ts';
import { podeIniciar, PLANOS } from '../src/core/planos.ts';
import { rankingEscolas, semanaAtual } from '../src/core/ranking.ts';
import { calcularSequencia } from '../src/data/store.ts';
import { seloRevisao, TopicoSchema, type Questao, type Topico } from '../src/content/schema.ts';

const base = { explicacao: 'Explicação suficiente.', dificuldade: 3, bloom: 'lembrar' as const, tags: [] };
const qm: Questao = {
  ...base,
  id: 'q1',
  tipo: 'multipla',
  enunciado: 'Pergunta?',
  alternativas: [
    { id: 'a', texto: 'A' },
    { id: 'b', texto: 'B' },
    { id: 'c', texto: 'C' },
    { id: 'd', texto: 'D' },
  ],
  correta: 'c',
};
const qo: Questao = {
  ...base,
  id: 'q2',
  tipo: 'ordenar',
  enunciado: 'Ordene',
  itens: [
    { id: '1', texto: 'um' },
    { id: '2', texto: 'dois' },
    { id: '3', texto: 'três' },
  ],
  ordemCorreta: ['2', '1', '3'],
};
const qa: Questao = {
  ...base,
  id: 'q3',
  tipo: 'associar',
  enunciado: 'Associe',
  pares: [
    { esquerda: 'Epiderme', direita: 'Ectoderma' },
    { esquerda: 'Fígado', direita: 'Endoderma' },
    { esquerda: 'Rim', direita: 'Mesoderma' },
  ],
};

describe('correção', () => {
  it('múltipla escolha', () => {
    expect(corrigir(qm, { tipo: 'multipla', escolhida: 'c' }).correta).toBe(true);
    expect(corrigir(qm, { tipo: 'multipla', escolhida: 'a' }).correta).toBe(false);
  });
  it('ordenar: acerto parcial não conta como correto', () => {
    const r = corrigir(qo, { tipo: 'ordenar', ordem: ['2', '3', '1'] });
    expect(r.correta).toBe(false);
    expect(r.fracao).toBeCloseTo(1 / 3);
    expect(corrigir(qo, { tipo: 'ordenar', ordem: ['2', '1', '3'] }).correta).toBe(true);
  });
  it('associar', () => {
    expect(corrigir(qa, { tipo: 'associar', pares: { Epiderme: 'Ectoderma', Fígado: 'Endoderma', Rim: 'Mesoderma' } }).correta).toBe(true);
    expect(corrigir(qa, { tipo: 'associar', pares: { Epiderme: 'Ectoderma', Fígado: 'Mesoderma', Rim: 'Endoderma' } }).fracao).toBeCloseTo(1 / 3);
  });
  it('tipo de resposta diferente é erro', () => {
    expect(corrigir(qm, { tipo: 'vf', escolhida: true }).correta).toBe(false);
  });
});

describe('XP', () => {
  it('erro vale zero', () => {
    expect(calcularXP({ dificuldade: 5, correta: false, comboAnterior: 10 })).toBe(0);
  });
  it('base por dificuldade, combo limitado a +50% e retorno decrescente', () => {
    expect(calcularXP({ dificuldade: 1, correta: true, comboAnterior: 0 })).toBe(10);
    expect(calcularXP({ dificuldade: 5, correta: true, comboAnterior: 0 })).toBe(22);
    expect(calcularXP({ dificuldade: 1, correta: true, comboAnterior: 100 })).toBe(15);
    expect(calcularXP({ dificuldade: 1, correta: true, comboAnterior: 0, acertosRecentes24h: 1 })).toBe(5);
    expect(calcularXP({ dificuldade: 1, correta: true, comboAnterior: 0, acertosRecentes24h: 5 })).toBe(2);
  });
  it('bônus de velocidade só em modo cronometrado', () => {
    const rapido = calcularXP({ dificuldade: 2, correta: true, comboAnterior: 0, tempoMs: 0, limiteMs: 15000 });
    const lento = calcularXP({ dificuldade: 2, correta: true, comboAnterior: 0, tempoMs: 15000, limiteMs: 15000 });
    expect(rapido).toBe(18);
    expect(lento).toBe(12);
  });
  it('níveis', () => {
    expect(nivelPorXP(0).nivel).toBe(1);
    expect(nivelPorXP(100).nivel).toBe(2);
    expect(nivelPorXP(99).progresso).toBeLessThan(1);
    expect(tituloDoNivel(1)).toBe('Calouro');
    expect(tituloDoNivel(12)).toBe('Ligante');
  });
});

describe('revisão espaçada', () => {
  const dia = 86400000;
  const t0 = new Date('2026-11-09T10:00:00').getTime();
  it('acerto sobe de caixa e agenda pelo intervalo', () => {
    let e = novoEstado('q', t0);
    e = registrarResposta(e, true, t0);
    expect(e.caixa).toBe(1);
    expect(e.proximaRevisao).toBe(inicioDoDia(t0) + INTERVALOS_DIAS[1] * dia);
    e = registrarResposta(e, true, t0 + dia);
    expect(e.caixa).toBe(2);
  });
  it('erro volta para a caixa 1 e reaparece em 10 min', () => {
    let e = { ...novoEstado('q', t0), caixa: 4 };
    e = registrarResposta(e, false, t0);
    expect(e.caixa).toBe(1);
    expect(e.proximaRevisao).toBe(t0 + 10 * 60 * 1000);
    expect(vencidos([e], t0 + 11 * 60 * 1000)).toHaveLength(1);
  });
  it('domínio considera questões não vistas', () => {
    expect(dominio([{ ...novoEstado('a', 0), caixa: 5 }], 2)).toBeCloseTo(0.5);
  });
});

describe('sessões', () => {
  const topico = {
    id: 't',
    questoes: [qm, qo, qa, { ...base, id: 'q4', tipo: 'vf', enunciado: 'Afirmação.', correta: true } as Questao],
  } as unknown as Topico;
  it('plantão só usa tipos rápidos', () => {
    const s = montarSessao([topico], { modo: 'plantao', tamanho: 10, rng: criarRng(1) });
    expect(s.every((i) => i.questao.tipo === 'multipla' || i.questao.tipo === 'vf')).toBe(true);
  });
  it('ordenar nunca começa na ordem correta', () => {
    for (let semente = 0; semente < 50; semente++) {
      const s = montarSessao([topico], { modo: 'estudo', tamanho: 10, rng: criarRng(semente) });
      const o = s.find((i) => i.questao.id === 'q2')!;
      expect(o.ordemExibicao!.join()).not.toBe('2,1,3');
    }
  });
  it('embaralhar com semente é determinístico', () => {
    expect(embaralhar([1, 2, 3, 4, 5], criarRng(7))).toEqual(embaralhar([1, 2, 3, 4, 5], criarRng(7)));
  });
});

describe('planos', () => {
  it('limites do gratuito', () => {
    const uso = { data: '2026-11-09', sessoesEstudo: 5, plantoesRanqueados: 2 };
    expect(podeIniciar('gratuito', uso, 'estudo').ok).toBe(false);
    expect(podeIniciar('gratuito', uso, 'plantao')).toEqual({ ok: true, restante: 1 });
    expect(podeIniciar('premium', { ...uso, sessoesEstudo: 999 }, 'estudo').ok).toBe(true);
    expect(PLANOS.institucional.painelProfessor).toBe(true);
  });
});

describe('ranking', () => {
  it('escola soma só os 20 melhores e ignora quem não pontuou', () => {
    const alunos = [
      ...Array.from({ length: 25 }, (_, i) => ({ usuarioId: `a${i}`, nome: '', escolaId: 'grande', xpSemana: 100 })),
      ...Array.from({ length: 5 }, (_, i) => ({ usuarioId: `b${i}`, nome: '', escolaId: 'pequena', xpSemana: 300 })),
      { usuarioId: 'z', nome: '', escolaId: 'pequena', xpSemana: 0 },
      { usuarioId: 'sem', nome: '', escolaId: null, xpSemana: 999 },
    ];
    const r = rankingEscolas(alunos);
    expect(r[0]).toEqual({ escolaId: 'grande', pontos: 2000, contribuintes: 20, membrosAtivos: 25 });
    expect(r[1]).toEqual({ escolaId: 'pequena', pontos: 1500, contribuintes: 5, membrosAtivos: 5 });
  });
  it('semana começa na segunda-feira, horário de Brasília', () => {
    // domingo 23:30 em Brasília = segunda 02:30 UTC → ainda pertence à semana anterior
    expect(semanaAtual(Date.parse('2026-11-16T02:30:00Z'))).toBe('2026-11-09');
    expect(semanaAtual(Date.parse('2026-11-16T03:00:00Z'))).toBe('2026-11-16');
  });
});

describe('sequência de dias', () => {
  it('conta até ontem se ainda não jogou hoje', () => {
    const hoje = new Date('2026-11-09T12:00:00').getTime();
    expect(calcularSequencia(new Set(['2026-11-08', '2026-11-07']), hoje)).toBe(2);
    expect(calcularSequencia(new Set(['2026-11-09', '2026-11-08']), hoje)).toBe(2);
    expect(calcularSequencia(new Set(['2026-11-06']), hoje)).toBe(0);
  });
});

describe('schema', () => {
  it('selo de revisão nunca indica médico sem revisão humana', () => {
    expect(seloRevisao({ autor: 'x', data: '', agentes: [], humano: null })).toBe('pendente');
    expect(seloRevisao({ autor: 'x', data: '', agentes: [{ area: 'embriologia', agente: 'r', data: '', veredito: 'aprovado' }], humano: null })).toBe('revisado-ia');
    expect(
      seloRevisao({ autor: 'x', data: '', agentes: [], humano: { conferidoPor: 'Dr. X', conferidoEm: '2026-11-10' } }),
    ).toBe('conferido-medico');
  });
  it('rejeita múltipla escolha com gabarito inexistente', () => {
    const r = TopicoSchema.shape.questoes.element.safeParse({ ...qm, correta: 'z' });
    expect(r.success).toBe(false);
  });
});
