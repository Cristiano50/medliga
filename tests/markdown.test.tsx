// Markdown mínimo: títulos no nível pedido (para a ordem dos títulos seguir a da página) e nada de HTML.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Markdown } from '../src/ui/comum.tsx';

const texto = '# Termos de uso\n\nTexto inicial.\n\n## 1. O que é\n\n- item **forte**\n- item *leve*\n\n### Detalhe\n\n<script>alert(1)</script>';

describe('Markdown', () => {
  it('por padrão, "#" vira h3 e os seguintes descem um nível', () => {
    const { container } = render(<Markdown texto={texto} />);
    expect([...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName)).toEqual(['H3', 'H4', 'H5']);
  });

  it('com nivel=1 a página ganha o h1 e os demais seguem em ordem', () => {
    const { container } = render(<Markdown texto={texto} nivel={1} />);
    expect([...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName}:${h.textContent}`)).toEqual(['H1:Termos de uso', 'H2:1. O que é', 'H3:Detalhe']);
  });

  it('não interpreta HTML: o texto aparece como texto', () => {
    const { container } = render(<Markdown texto={texto} nivel={2} />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<script>alert(1)</script>');
    expect(container.querySelector('strong')!.textContent).toBe('forte');
    expect(container.querySelector('em')!.textContent).toBe('leve');
  });
});
