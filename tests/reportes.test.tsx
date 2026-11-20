// Fila de reportes da equipe: regras puras (espelho de supabase/migrations/0008_equipe_reportes.sql) e a tela.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contagemDe, filaDe, limparNota, MOTIVOS_REPORTE, STATUS_REPORTE, tratarReporte, type ReporteGuardado } from '../src/core/reportes.ts';

const r = (id: number, questaoId: string, criadoEm: string, extra: Partial<ReporteGuardado> = {}): ReporteGuardado => ({
  id,
  questaoId,
  motivo: 'gabarito',
  texto: null,
  versaoApp: '0.1.0',
  status: 'aberto',
  criadoEm,
  nota: null,
  tratadoEm: null,
  ...extra,
});

const BASE: ReporteGuardado[] = [
  r(1, 'q-b', '2026-11-01T10:00:00Z'),
  r(2, 'q-a', '2026-11-03T10:00:00Z'),
  r(3, 'q-a', '2026-11-02T10:00:00Z'),
  r(4, 'q-c', '2026-10-30T10:00:00Z', { status: 'corrigido', tratadoEm: '2026-11-05T10:00:00Z', nota: 'feito' }),
  r(5, 'q-d', '2026-10-29T10:00:00Z', { status: 'corrigido', tratadoEm: '2026-11-07T10:00:00Z' }),
];

describe('fila de reportes', () => {
  it('nos abertos, a questão com mais reportes vem primeiro e, dentro dela, o reporte mais antigo', () => {
    const f = filaDe(BASE, 'aberto');
    expect(f.map((x) => x.id)).toEqual([3, 2, 1]);
    expect(f.map((x) => x.reportesDaQuestao)).toEqual([2, 2, 1]);
  });

  it('nos tratados, o tratado mais recentemente vem primeiro; a contagem é só da mesma situação', () => {
    const f = filaDe(BASE, 'corrigido');
    expect(f.map((x) => x.id)).toEqual([5, 4]);
    expect(f.every((x) => x.reportesDaQuestao === 1)).toBe(true);
    expect(filaDe(BASE, 'procedente')).toEqual([]);
  });

  it('o limite fica entre 1 e 200', () => {
    expect(filaDe(BASE, 'aberto', 1)).toHaveLength(1);
    expect(filaDe(BASE, 'aberto', 0)).toHaveLength(1); // o servidor faz greatest(limite, 1)
    expect(filaDe(BASE, 'aberto', 500)).toHaveLength(3);
  });

  it('conta por situação, com zero nas que não têm reportes', () => {
    expect(contagemDe(BASE)).toEqual({ aberto: 3, procedente: 0, improcedente: 0, corrigido: 2 });
  });
});

describe('tratar reporte', () => {
  const agora = '2026-11-20T12:00:00Z';

  it('um reporte só: muda a situação, registra a data e guarda a nota sem espaços nas pontas', () => {
    const { lista, mudaram } = tratarReporte(BASE, 2, 'procedente', '  conferido no Moore  ', false, agora);
    expect(mudaram).toBe(1);
    const t = lista.find((x) => x.id === 2)!;
    expect(t).toMatchObject({ status: 'procedente', nota: 'conferido no Moore', tratadoEm: agora });
    expect(lista.find((x) => x.id === 3)!.status).toBe('aberto');
    expect(BASE.find((x) => x.id === 2)!.status).toBe('aberto'); // não altera a lista original
  });

  it('"aplicar a todos" muda todos os abertos da mesma questão, e só eles', () => {
    const { lista, mudaram } = tratarReporte(BASE, 3, 'improcedente', '', true, agora);
    expect(mudaram).toBe(2);
    expect(lista.filter((x) => x.status === 'improcedente').map((x) => x.id).sort()).toEqual([2, 3]);
    expect(lista.find((x) => x.id === 1)!.status).toBe('aberto');
  });

  it('reabrir apaga a data do tratamento e mantém a nota quando não vem outra', () => {
    const { lista } = tratarReporte(BASE, 4, 'aberto', null, false, agora);
    expect(lista.find((x) => x.id === 4)).toMatchObject({ status: 'aberto', tratadoEm: null, nota: 'feito' });
  });

  it('a nota é cortada em 1000 caracteres; vazia ou só espaços não apaga a anterior', () => {
    expect(limparNota('x'.repeat(1200))).toHaveLength(1000);
    expect(limparNota('   ')).toBeNull();
    expect(limparNota(undefined)).toBeNull();
    const { lista } = tratarReporte(BASE, 4, 'procedente', '   ', false, agora);
    expect(lista.find((x) => x.id === 4)!.nota).toBe('feito');
  });

  it('recusa situação inválida e reporte que não existe', () => {
    expect(() => tratarReporte(BASE, 2, 'apagado' as never, null, false, agora)).toThrow(/situação inválida/);
    expect(() => tratarReporte(BASE, 99, 'procedente', null, false, agora)).toThrow(/não encontrado/);
  });
});

describe('o app e o servidor usam os mesmos motivos e situações', () => {
  const tabela = readFileSync('supabase/migrations/0004_reportes.sql', 'utf8');
  const fila = readFileSync('supabase/migrations/0008_equipe_reportes.sql', 'utf8');
  const lista = (texto: string, re: RegExp) => [...texto.matchAll(re)].map((m) => [...m[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]));

  it('motivos: a lista do app é a mesma do check da tabela', () => {
    expect(lista(tabela, /motivo in \(([^)]*)\)/g)).toEqual([MOTIVOS_REPORTE.map((m) => m.id)]);
  });

  it('situações: a mesma lista no check da tabela e em todas as validações das funções da equipe', () => {
    const ids = STATUS_REPORTE.map((x) => x.id);
    expect(lista(tabela, /status in \(([^)]*)\)/g)).toEqual([ids]);
    const nasFuncoes = lista(fila, /p_status not in \(([^)]*)\)/g);
    expect(nasFuncoes).toHaveLength(2);
    for (const l of nasFuncoes) expect(l).toEqual(ids);
    expect(lista(fila, /from \(values ([^;]*?)\) as s\(status\)/g)[0]).toEqual(ids);
  });
});
