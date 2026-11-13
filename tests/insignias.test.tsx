// Medalhas das conquistas e selos dos títulos de nível: dados íntegros, desenho por estado e componentes.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CONQUISTAS } from '../src/core/conquistas.ts';
import { TITULOS_NIVEL } from '../src/core/scoring.ts';
import { ICONES } from '../src/ui/icones.ts';
import { contraste } from '../src/modules/avatar/cor.ts';
import {
  CAIXA_MEDALHA,
  CAIXA_SELO,
  FAMILIAS,
  LADO_SELO_COMPACTO,
  MEDALHAS,
  METAIS,
  SELOS,
  descricaoMedalha,
  indiceDoSelo,
  insigniaParaSvg,
  medalhaFormas,
  seloFormas,
  type Familia,
  type FormaInsignia,
} from '../src/ui/insignias.ts';
import { Medalha, SeloNivel } from '../src/ui/Insignias.tsx';

const TINTA = '#0b1220';
const numeros = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
const comTraco = (fs: FormaInsignia[], cor: string) => fs.filter((f) => f.s === cor);

describe('medalhas das conquistas', () => {
  it('cada conquista tem a sua medalha e não sobra medalha sem conquista', () => {
    expect(Object.keys(MEDALHAS).sort()).toEqual(CONQUISTAS.map((c) => c.id).sort());
    for (const m of Object.values(MEDALHAS)) expect(FAMILIAS[m.familia]).toBeDefined();
  });

  it('as famílias têm cor e forma diferentes entre si, e todas são usadas', () => {
    const fams = Object.values(FAMILIAS);
    expect(new Set(fams.map((f) => f.cor)).size).toBe(fams.length);
    expect(new Set(fams.map((f) => f.forma)).size).toBe(fams.length);
    const usadas = new Set(Object.values(MEDALHAS).map((m) => m.familia));
    expect([...usadas].sort()).toEqual(Object.keys(FAMILIAS).sort());
  });

  it('o ícone em tinta se lê sobre a cor de cada família', () => {
    for (const [id, f] of Object.entries(FAMILIAS)) expect(contraste(TINTA, f.cor), id).toBeGreaterThanOrEqual(4.5);
  });

  it('as conquistas em graus sobem bronze, prata e ouro', () => {
    const graus = (fam: Familia) => CONQUISTAS.filter((c) => MEDALHAS[c.id].familia === fam).map((c) => MEDALHAS[c.id].grau);
    expect(graus('sequencia')).toEqual([1, 2, 3]);
    expect(graus('dominio')).toEqual([1, 2, 3]);
    for (const fam of ['liga', 'jogos', 'carreira'] as Familia[]) expect(graus(fam).every((g) => g === undefined)).toBe(true);
    expect(new Set(Object.values(METAIS)).size).toBe(3);
  });

  it('obtida: placa na cor da família, anel inteiro (no metal do grau) e ícone em tinta', () => {
    for (const c of CONQUISTAS) {
      const m = MEDALHAS[c.id];
      const fam = FAMILIAS[m.familia];
      const fs = medalhaFormas(c.id, c.icone, { obtida: true, progresso: 1 });
      expect(fs[0].f, c.id).toBe(fam.escura); // fita
      expect(fs[1].s, c.id).toBe(m.grau ? METAIS[m.grau] : fam.cor); // anel
      expect(fs[2].f, c.id).toBe(fam.cor); // placa
      const icone = fs.slice(4);
      expect(icone.length, c.id).toBe((ICONES[c.icone] as unknown[]).length);
      for (const f of icone) expect(f.s ?? f.f, c.id).toBe(TINTA);
    }
  });

  it('ainda não obtida: placa escura, ícone apagado e o anel mostra o progresso', () => {
    const c = CONQUISTAS.find((x) => x.id === 'sequencia-7')!;
    const cor = FAMILIAS.sequencia.cor;
    const zero = medalhaFormas(c.id, c.icone, { obtida: false, progresso: 0 });
    expect(comTraco(zero, cor)).toHaveLength(0);
    expect(zero.some((f) => f.f === cor)).toBe(false);

    const meio = medalhaFormas(c.id, c.icone, { obtida: false, progresso: 0.5 });
    const arco = comTraco(meio, cor);
    expect(arco).toHaveLength(1);
    // metade do caminho: o arco sai do topo (36, 4) e termina embaixo (36, 60)
    expect(arco[0].d).toMatch(/^M36 4 A28 28 0 0 1 36 60$/);
    const quarto = comTraco(medalhaFormas(c.id, c.icone, { obtida: false, progresso: 0.25 }), cor)[0];
    expect(quarto.d).toMatch(/^M36 4 A28 28 0 0 1 64 32$/);
    const quase = comTraco(medalhaFormas(c.id, c.icone, { obtida: false, progresso: 0.75 }), cor)[0];
    expect(quase.d).toMatch(/^M36 4 A28 28 0 1 1 8 32$/);
    // valores fora de 0 a 1 não quebram o desenho
    expect(comTraco(medalhaFormas(c.id, c.icone, { obtida: false, progresso: -3 }), cor)).toHaveLength(0);
    expect(comTraco(medalhaFormas(c.id, c.icone, { obtida: false, progresso: 7 }), cor)).toHaveLength(1);
  });

  it('o desenho cabe na caixa da medalha', () => {
    const [, , w, h] = CAIXA_MEDALHA.split(' ').map(Number);
    for (const c of CONQUISTAS) {
      for (const estado of [{ obtida: true, progresso: 1 }, { obtida: false, progresso: 0.4 }]) {
        for (const f of medalhaFormas(c.id, c.icone, estado)) {
          if (f.tr) continue; // o ícone e o filete têm a própria grade
          for (const v of numeros(f.d)) {
            expect(Number.isFinite(v), c.id).toBe(true);
            expect(v, c.id).toBeGreaterThanOrEqual(0);
            expect(v, c.id).toBeLessThanOrEqual(Math.max(w, h));
          }
        }
      }
    }
  });

  it('o texto alternativo diz se foi obtida ou quanto falta', () => {
    expect(descricaoMedalha('Semana cheia', { obtida: true, progresso: 1 })).toBe('Medalha Semana cheia: obtida');
    expect(descricaoMedalha('Semana cheia', { obtida: false, progresso: 3 / 7 })).toBe('Medalha Semana cheia: 43% do caminho');
    expect(descricaoMedalha('Semana cheia', { obtida: false, progresso: 0 })).toBe('Medalha Semana cheia: ainda não obtida');
  });

  it('gera SVG com a caixa certa', () => {
    const c = CONQUISTAS[0];
    const svg = insigniaParaSvg(medalhaFormas(c.id, c.icone, { obtida: true, progresso: 1 }), CAIXA_MEDALHA, 72);
    expect(svg).toContain(`viewBox="${CAIXA_MEDALHA}"`);
    expect(svg).toContain('width="72" height="76"');
  });
});

describe('selos dos títulos de nível', () => {
  it('há um selo por título, na mesma ordem e com o mesmo nível mínimo', () => {
    expect(SELOS.map((s) => s.min)).toEqual(TITULOS_NIVEL.map((t) => t.min));
  });

  it('cada selo usa um ícone que existe, e nenhum repete', () => {
    for (const s of SELOS) expect(Object.keys(ICONES)).toContain(s.icone);
    expect(new Set(SELOS.map((s) => s.icone)).size).toBe(SELOS.length);
    for (const s of SELOS) expect(contraste(TINTA, s.cor), s.icone).toBeGreaterThanOrEqual(4.5);
  });

  it('o nível leva ao selo do título a que pertence', () => {
    expect([1, 4, 5, 9, 10, 15, 29, 30, 49, 50, 120].map(indiceDoSelo)).toEqual([0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 7]);
    expect(indiceDoSelo(0)).toBe(0);
  });

  it('o anel tem tantos gomos cheios quanto o degrau do título', () => {
    SELOS.forEach((s, i) => {
      const fs = seloFormas(i, { ativo: true });
      const cheios = fs.find((f) => f.s === s.cor)!;
      expect((cheios.d.match(/M/g) ?? []).length, s.icone).toBe(i + 1);
      const vazios = fs.find((f) => f.s === '#22304f');
      expect(vazios ? (vazios.d.match(/M/g) ?? []).length : 0, s.icone).toBe(8 - (i + 1));
      expect(fs.some((f) => f.f === s.cor), s.icone).toBe(true); // disco na cor da fase
    });
  });

  it('título ainda por vir fica apagado; o modo compacto não leva o emblema', () => {
    const porVir = seloFormas(3, { ativo: false });
    expect(porVir.some((f) => f.s === SELOS[3].cor || f.f === SELOS[3].cor)).toBe(false);
    const inteiro = seloFormas(3, { ativo: true });
    const compacto = seloFormas(3, { ativo: true, compacto: true });
    expect(inteiro.length - compacto.length).toBe((ICONES[SELOS[3].icone] as unknown[]).length);
    expect(compacto.some((f) => f.tr)).toBe(false);
  });

  it('posição fora da lista cai no primeiro ou no último título', () => {
    expect(seloFormas(-2, { ativo: true })).toEqual(seloFormas(0, { ativo: true }));
    expect(seloFormas(99, { ativo: true })).toEqual(seloFormas(7, { ativo: true }));
  });
});

describe('<Medalha> e <SeloNivel>', () => {
  it('a medalha é uma imagem com nome', () => {
    const c = CONQUISTAS.find((x) => x.id === 'plantonista')!;
    const { container } = render(<Medalha id={c.id} icone={c.icone} nome={c.nome} obtida={false} progresso={0.3} tamanho={56} />);
    const svg = container.querySelector('svg.medalha')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Medalha Plantonista: 30% do caminho');
    expect(svg.getAttribute('viewBox')).toBe(CAIXA_MEDALHA);
    expect(svg.getAttribute('width')).toBe('56');
    expect(svg.getAttribute('height')).toBe('59');
    expect(svg.querySelectorAll('path').length).toBe(medalhaFormas(c.id, c.icone, { obtida: false, progresso: 0.3 }).length);
  });

  it('o selo é decorativo por padrão, vira imagem com rótulo e perde o emblema quando pequeno', () => {
    const { container, rerender } = render(<SeloNivel nivel={12} tamanho={28} />);
    let svg = container.querySelector('svg.selo-nivel')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe(CAIXA_SELO);
    expect(svg.querySelectorAll('path').length).toBe(seloFormas(2, { ativo: true }).length);

    rerender(<SeloNivel nivel={12} tamanho={LADO_SELO_COMPACTO} rotulo="Ligante" />);
    svg = container.querySelector('svg.selo-nivel')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Ligante');
    expect(svg.querySelectorAll('path').length).toBe(seloFormas(2, { ativo: true, compacto: true }).length);

    rerender(<SeloNivel indice={7} ativo={false} tamanho={26} />);
    svg = container.querySelector('svg.selo-nivel')!;
    expect(svg.querySelectorAll('path').length).toBe(seloFormas(7, { ativo: false }).length);
  });
});
