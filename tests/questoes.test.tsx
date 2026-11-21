// Resposta revelada: certo e errado com forma própria (visto e X) e texto para leitor de tela, não só a cor (WCAG 1.4.1).
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { QuestaoView } from '../src/games/questoes.tsx';
import type { Questao } from '../src/content/schema.ts';

const base = { enunciado: 'Enunciado de teste', explicacao: 'Explicação de teste.', dificuldade: 2, bloom: 'lembrar' as const, tags: [] };
const multipla: Questao = {
  ...base,
  id: 't-m',
  tipo: 'multipla',
  alternativas: [
    { id: 'a', texto: 'Primeira' },
    { id: 'b', texto: 'Segunda' },
    { id: 'c', texto: 'Terceira' },
    { id: 'd', texto: 'Quarta' },
  ],
  correta: 'b',
};
const nada = () => {};
const marcas = (c: HTMLElement, tipo: 'certo' | 'errado') => [...c.querySelectorAll(`.marca-resultado.${tipo}`)];

describe('alternativas reveladas', () => {
  it('antes de revelar, só as letras; depois, visto na certa e X na escolhida errada, com texto', () => {
    const { container, rerender } = render(<QuestaoView questao={multipla} resposta={{ tipo: 'multipla', escolhida: 'd' }} onResponder={nada} revelada={false} />);
    expect(container.querySelectorAll('.marca-resultado')).toHaveLength(0);
    expect(container.querySelectorAll('.letra')).toHaveLength(4);

    rerender(<QuestaoView questao={multipla} resposta={{ tipo: 'multipla', escolhida: 'd' }} onResponder={nada} revelada />);
    const botoes = [...container.querySelectorAll('button.opcao')];
    const certa = botoes.find((b) => b.textContent!.includes('Segunda'))!;
    const errada = botoes.find((b) => b.textContent!.includes('Quarta'))!;
    expect(certa.querySelector('.marca-resultado.certo .so-leitor')!.textContent).toBe('Resposta certa:');
    expect(errada.querySelector('.marca-resultado.errado .so-leitor')!.textContent).toBe('Sua resposta, errada:');
    // a forma muda: o visto e o X são desenhos diferentes
    const d = (b: Element) => b.querySelector('.marca-resultado path')!.getAttribute('d');
    expect(d(certa)).not.toBe(d(errada));
    // as outras continuam com a letra
    expect(container.querySelectorAll('.letra')).toHaveLength(2);
  });

  it('acertou: só a marca de certo', () => {
    const { container } = render(<QuestaoView questao={multipla} resposta={{ tipo: 'multipla', escolhida: 'b' }} onResponder={nada} revelada />);
    expect(marcas(container, 'certo')).toHaveLength(1);
    expect(marcas(container, 'errado')).toHaveLength(0);
  });

  it('verdadeiro ou falso também leva a marca', () => {
    const vf: Questao = { ...base, id: 't-vf', tipo: 'vf', correta: false };
    const { container } = render(<QuestaoView questao={vf} resposta={{ tipo: 'vf', escolhida: true }} onResponder={nada} revelada />);
    expect(marcas(container, 'certo')).toHaveLength(1);
    expect(marcas(container, 'errado')).toHaveLength(1);
    expect(container.querySelector('.marca-resultado.certo')!.closest('button')!.textContent).toContain('Falso');
  });

  it('ordenar e associar: cada linha diz se está na posição ou associação certa', () => {
    const ordenar: Questao = {
      ...base,
      id: 't-o',
      tipo: 'ordenar',
      itens: [
        { id: 'x', texto: 'X' },
        { id: 'y', texto: 'Y' },
        { id: 'z', texto: 'Z' },
      ],
      ordemCorreta: ['x', 'y', 'z'],
    };
    const { container } = render(<QuestaoView questao={ordenar} resposta={{ tipo: 'ordenar', ordem: ['x', 'z', 'y'] }} onResponder={nada} revelada />);
    expect(marcas(container, 'certo')).toHaveLength(1);
    expect(marcas(container, 'errado')).toHaveLength(2);
    expect(container.querySelector('.marca-resultado.errado .so-leitor')!.textContent).toBe('posição errada');

    const associar: Questao = {
      ...base,
      id: 't-a',
      tipo: 'associar',
      pares: [
        { esquerda: 'A', direita: '1' },
        { esquerda: 'B', direita: '2' },
        { esquerda: 'C', direita: '3' },
      ],
    };
    const r = render(<QuestaoView questao={associar} resposta={{ tipo: 'associar', pares: { A: '1', B: '3', C: '2' } }} onResponder={nada} revelada />);
    expect(marcas(r.container, 'certo')).toHaveLength(1);
    expect(marcas(r.container, 'errado')).toHaveLength(2);
  });
});
