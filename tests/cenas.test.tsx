// Cenas das telas de resultado e dos estados vazios, movimento que respeita "reduzir movimento" e aviso de medalha.
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ICONES } from '../src/ui/icones.ts';
import { CAIXA_CENA, CORES_HUMOR, cenaFormas, cenaPartes, humorPorAcertos, type Humor } from '../src/ui/cenas.ts';
import { Cena, EstadoVazio } from '../src/ui/Cena.tsx';
import { contraste } from '../src/modules/avatar/cor.ts';
import { conquistasNovas } from '../src/core/conquistas.ts';
import { useApp } from '../src/data/store.ts';
import { db } from '../src/data/db.ts';

const numeros = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
const HUMORES: Humor[] = ['comemorar', 'bom', 'calmo'];

describe('humor da cena', () => {
  it('80% ou mais comemora, de 50% a 79% é bom, abaixo disso é calmo', () => {
    expect(humorPorAcertos(10, 10)).toBe('comemorar');
    expect(humorPorAcertos(8, 10)).toBe('comemorar');
    expect(humorPorAcertos(10, 12)).toBe('comemorar');
    expect(humorPorAcertos(9, 12)).toBe('bom');
    expect(humorPorAcertos(5, 10)).toBe('bom');
    expect(humorPorAcertos(4, 10)).toBe('calmo');
    expect(humorPorAcertos(0, 10)).toBe('calmo');
  });

  it('sem respostas, é calmo', () => {
    expect(humorPorAcertos(0, 0)).toBe('calmo');
    expect(humorPorAcertos(3, 0)).toBe('calmo');
  });
});

describe('desenho da cena', () => {
  it('só a cena de comemorar tem confetes; os brilhos diminuem com o humor', () => {
    expect(cenaPartes('comemorar', 'ranking').pecas).toHaveLength(10);
    expect(cenaPartes('comemorar', 'ranking').brilhos).toHaveLength(4);
    expect(cenaPartes('bom', 'tendencia').pecas).toHaveLength(0);
    expect(cenaPartes('bom', 'tendencia').brilhos).toHaveLength(2);
    expect(cenaPartes('calmo', 'estudar').pecas).toHaveLength(0);
    expect(cenaPartes('calmo', 'estudar').brilhos).toHaveLength(0);
  });

  it('o ícone vem do conjunto próprio, na cor do humor, e a cor se lê sobre o cartão escuro', () => {
    for (const h of HUMORES) {
      const p = cenaPartes(h, 'ranking');
      expect(p.icone).toHaveLength((ICONES.ranking as unknown[]).length);
      for (const f of p.icone) expect(f.s ?? f.f).toBe(CORES_HUMOR[h]);
      expect(contraste(CORES_HUMOR[h], '#131c30'), h).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('tudo cabe na caixa e as formas que se movem não levam transformação própria', () => {
    const [, , lado] = CAIXA_CENA.split(' ').map(Number);
    for (const h of HUMORES) {
      const p = cenaPartes(h, 'festa');
      for (const f of [...p.halo, ...p.brilhos, ...p.pecas]) {
        expect(f.tr, h).toBeUndefined(); // a animação do CSS usa transform: uma transformação no elemento seria perdida
        for (const v of numeros(f.d)) {
          expect(Number.isFinite(v)).toBe(true);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(lado);
        }
      }
    }
  });

  it('cada confete parte de um ponto mais perto do centro', () => {
    for (const peca of cenaPartes('comemorar', 'ranking').pecas) {
      const [x, y] = numeros(peca.d);
      // o deslocamento inicial aponta do lugar final para o centro (60, 60)
      expect(peca.dx * (60 - x) + peca.dy * (60 - y)).toBeGreaterThan(0);
      expect(Math.hypot(peca.dx, peca.dy)).toBeCloseTo(14, 0);
    }
  });

  it('a cena pronta junta halo, confetes, brilhos e ícone, nesta ordem', () => {
    const p = cenaPartes('comemorar', 'ranking');
    const fs = cenaFormas('comemorar', 'ranking');
    expect(fs).toHaveLength(p.halo.length + p.pecas.length + p.brilhos.length + p.icone.length);
    expect(fs[0]).toEqual(p.halo[0]);
    expect(fs.at(-1)).toEqual(p.icone.at(-1));
    expect(fs.some((f) => 'dx' in f)).toBe(false);
  });
});

describe('<Cena> e <EstadoVazio>', () => {
  it('a cena é decorativa e marca cada parte que se move', () => {
    const { container } = render(<Cena humor="comemorar" icone="ranking" />);
    const svg = container.querySelector('svg.cena')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.classList.contains('comemorar')).toBe(true);
    expect(svg.getAttribute('viewBox')).toBe(CAIXA_CENA);
    expect(svg.querySelectorAll('.cena-halo')).toHaveLength(1);
    expect(svg.querySelectorAll('.cena-icone')).toHaveLength(1);
    expect(svg.querySelectorAll('.cena-brilho')).toHaveLength(4);
    const pecas = [...svg.querySelectorAll<SVGGElement>('.cena-peca')];
    expect(pecas).toHaveLength(10);
    for (const g of pecas) {
      expect(g.style.getPropertyValue('--dx')).toMatch(/px$/);
      expect(g.style.getPropertyValue('--dy')).toMatch(/px$/);
    }
  });

  it('o estado vazio mostra a cena calma, o título e o que vier dentro', () => {
    const { container, getByText } = render(
      <EstadoVazio icone="grafico" titulo="Ainda não há dados suficientes">
        <p>Um tópico aparece aqui quando pelo menos 5 alunos já responderam.</p>
      </EstadoVazio>,
    );
    expect(container.querySelector('svg.cena.calmo')).not.toBeNull();
    expect(container.querySelector('h2')!.textContent).toBe('Ainda não há dados suficientes');
    expect(getByText(/pelo menos 5 alunos/)).toBeTruthy();
  });
});

describe('movimento', () => {
  const css = readFileSync('src/styles.css', 'utf8');
  const quadros = [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g)].map((m) => ({ nome: m[1], corpo: m[2] }));

  it('"reduzir movimento" desliga animações e transições em tudo', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\* \{ transition: none !important; animation: none !important; \}/);
  });

  it('toda animação só descreve de onde parte: o estado de repouso é o desenho pronto', () => {
    expect(quadros.map((q) => q.nome).sort()).toEqual(['aviso-entra', 'cena-brilho', 'cena-estouro', 'cena-halo', 'cena-pop', 'cena-surgir']);
    for (const q of quadros) {
      expect(q.corpo, q.nome).toMatch(/from\s*\{/);
      expect(q.corpo, q.nome).not.toMatch(/(^|\s)to\s*\{|100%/);
    }
  });

  it('nenhuma animação se repete sem fim nem dura mais de um segundo', () => {
    const usos = [...css.matchAll(/animation:\s*([^;]+);/g)].map((m) => m[1]).filter((v) => !v.includes('none'));
    expect(usos.length).toBeGreaterThanOrEqual(6);
    for (const u of usos) {
      expect(u).not.toMatch(/infinite/);
      const duracao = Number(u.match(/([\d.]+)s/)![1]);
      expect(duracao, u).toBeLessThanOrEqual(1);
    }
  });
});

describe('aviso de medalha nova', () => {
  it('conquistasNovas devolve só o que ainda não estava guardado, sem repetir', () => {
    expect(conquistasNovas(undefined, ['a', 'b'])).toEqual(['a', 'b']);
    expect(conquistasNovas(['a'], ['a', 'b', 'b', 'c'])).toEqual(['b', 'c']);
    expect(conquistasNovas(['a', 'b'], ['b', 'a'])).toEqual([]);
  });

  beforeEach(async () => {
    await db.perfil.clear();
    useApp.setState({ perfil: null, medalhasNovas: [], conquistasConferidas: false });
    await useApp.getState().salvarPerfil({ nome: 'Teste' });
  });

  it('a primeira conferência depois de abrir o app guarda as conquistas sem avisar', async () => {
    await useApp.getState().registrarConquistas(['primeiro-passo', 'sequencia-3']);
    expect(useApp.getState().perfil!.conquistasObtidas).toEqual(['primeiro-passo', 'sequencia-3']);
    expect(useApp.getState().medalhasNovas).toEqual([]);
    expect(useApp.getState().conquistasConferidas).toBe(true);
  });

  it('o que é obtido depois, com o app aberto, entra no aviso; dispensar limpa o aviso e mantém a conquista', async () => {
    await useApp.getState().registrarConquistas([]); // quem acabou de chegar: nada ainda
    expect(useApp.getState().conquistasConferidas).toBe(true);
    await useApp.getState().registrarConquistas(['primeiro-passo']);
    expect(useApp.getState().medalhasNovas).toEqual(['primeiro-passo']);
    await useApp.getState().registrarConquistas(['primeiro-passo', 'plantonista']);
    expect(useApp.getState().medalhasNovas).toEqual(['primeiro-passo', 'plantonista']);
    await useApp.getState().registrarConquistas(['primeiro-passo', 'plantonista']);
    expect(useApp.getState().medalhasNovas).toEqual(['primeiro-passo', 'plantonista']);

    useApp.getState().dispensarMedalhas();
    expect(useApp.getState().medalhasNovas).toEqual([]);
    expect(useApp.getState().perfil!.conquistasObtidas).toEqual(['primeiro-passo', 'plantonista']);
    expect((await db.perfil.toArray())[0].conquistasObtidas).toEqual(['primeiro-passo', 'plantonista']);
  });
});
