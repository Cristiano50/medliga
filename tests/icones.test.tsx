// Ícones próprios: conjunto íntegro, uso nas disciplinas e conquistas, componente e ausência de emoji na interface.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ICONES, iconeParaSvg, type NomeIcone, type ParteIcone } from '../src/ui/icones.ts';
import { Icone } from '../src/ui/Icone.tsx';
import { DISCIPLINAS } from '../src/content/disciplinas.ts';
import { CONQUISTAS } from '../src/core/conquistas.ts';

const NOMES = Object.keys(ICONES) as NomeIcone[];
const caminho = (p: ParteIcone) => (typeof p === 'string' ? p : p.d);

/** Todos os números de um caminho SVG (coordenadas, raios e sinalizadores dos arcos). */
const numeros = (d: string) => (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);

function arquivos(dir: string, ext: RegExp, saida: string[] = []): string[] {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) arquivos(p, ext, saida);
    else if (ext.test(nome)) saida.push(p);
  }
  return saida;
}

describe('conjunto de ícones', () => {
  it('tem nomes em minúsculas com hífen e pelo menos uma parte cada', () => {
    expect(NOMES.length).toBeGreaterThanOrEqual(50);
    for (const n of NOMES) {
      expect(n).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect((ICONES[n] as ParteIcone[]).length).toBeGreaterThan(0);
    }
  });

  it('cada caminho começa com M, só usa comandos conhecidos e cabe na grade de 24×24', () => {
    for (const n of NOMES) {
      for (const p of ICONES[n] as ParteIcone[]) {
        const d = caminho(p);
        expect(d, n).toMatch(/^M/);
        expect(d.replace(/[MLHVCAZmlhvcaz\d\s.-]/g, ''), n).toBe('');
        for (const v of numeros(d)) {
          expect(Number.isFinite(v), n).toBe(true);
          expect(v, n).toBeGreaterThanOrEqual(-12);
          expect(v, n).toBeLessThanOrEqual(24);
        }
      }
    }
  });

  it('não repete o mesmo desenho com dois nomes', () => {
    const vistos = new Map<string, string>();
    for (const n of NOMES) {
      const assinatura = JSON.stringify(ICONES[n]);
      expect(vistos.get(assinatura), `${n} repete ${vistos.get(assinatura)}`).toBeUndefined();
      vistos.set(assinatura, n);
    }
  });

  it('gera SVG na cor do texto em volta, sem cor fixa', () => {
    for (const n of NOMES) {
      const svg = iconeParaSvg(n);
      expect(svg).toContain('viewBox="0 0 24 24"');
      expect(svg).toContain('currentColor');
      expect(svg).not.toMatch(/#[0-9a-f]{3,8}/i);
    }
  });
});

describe('uso dos ícones', () => {
  it('toda disciplina e todo jogo apontam para um ícone que existe', () => {
    for (const d of DISCIPLINAS) {
      expect(NOMES, d.id).toContain(d.icone);
      for (const j of d.jogos ?? []) expect(NOMES, `${d.id} · ${j.nome}`).toContain(j.icone);
    }
  });

  it('as disciplinas têm ícones diferentes entre si', () => {
    const usados = DISCIPLINAS.map((d) => d.icone);
    expect(new Set(usados).size).toBe(usados.length);
  });

  it('toda conquista aponta para um ícone que existe', () => {
    for (const c of CONQUISTAS) expect(NOMES, c.id).toContain(c.icone);
  });
});

describe('<Icone>', () => {
  it('é decorativo por padrão e vira imagem com nome quando recebe rótulo', () => {
    const { container, rerender } = render(<Icone nome="fogo" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBeNull();
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.querySelectorAll('path').length).toBe((ICONES.fogo as ParteIcone[]).length);

    rerender(<Icone nome="visto" rotulo="Tópico dominado" tamanho={18} className="ok" />);
    const rotulado = container.querySelector('svg')!;
    expect(rotulado.getAttribute('role')).toBe('img');
    expect(rotulado.getAttribute('aria-label')).toBe('Tópico dominado');
    expect(rotulado.getAttribute('aria-hidden')).toBeNull();
    expect(rotulado.getAttribute('width')).toBe('18');
    expect(rotulado.classList.contains('ok')).toBe(true);
  });

  it('desenha as partes de linha sem preenchimento e as cheias sem traço', () => {
    const { container } = render(<Icone nome="alvo" />);
    const partes = [...container.querySelectorAll('path')];
    const linhas = partes.filter((p) => p.getAttribute('fill') === 'none');
    const preenchidas = partes.filter((p) => p.getAttribute('fill') === 'currentColor');
    expect(linhas.length).toBe(2);
    expect(preenchidas.length).toBe(2);
    for (const p of linhas) expect(p.getAttribute('stroke')).toBe('currentColor');
    for (const p of preenchidas) expect(p.getAttribute('stroke')).toBeNull();
  });
});

describe('interface sem emoji', () => {
  // Emojis e pictogramas que mudam de desenho conforme o aparelho. Setas tipográficas (→) em frases e comentários
  // não entram: são texto.
  const PICTOGRAMA = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2300}-\u{23FF}\u{2039}\u{203A}\u{FE0F}]/u;

  it('nenhum arquivo de tela, estilo ou página usa emoji ou pictograma de fonte', () => {
    const fontes = [...arquivos('src', /\.(tsx?|css)$/), 'index.html'];
    expect(fontes.length).toBeGreaterThan(40);
    const achados: string[] = [];
    for (const arq of fontes) {
      readFileSync(arq, 'utf8')
        .split('\n')
        .forEach((linha, i) => {
          if (PICTOGRAMA.test(linha)) achados.push(`${arq}:${i + 1}: ${linha.trim().slice(0, 80)}`);
        });
    }
    expect(achados).toEqual([]);
  });
});
