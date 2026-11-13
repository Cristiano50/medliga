// Cartões da tela inicial e das disciplinas: emblema, cartão de jogo e cartão "em breve".
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartaoEmBreve, CartaoJogo, Emblema } from '../src/ui/cartoes.tsx';
import { DISCIPLINAS } from '../src/content/disciplinas.ts';
import { contraste } from '../src/modules/avatar/cor.ts';

describe('<Emblema>', () => {
  it('é uma placa na cor do assunto com o ícone dentro, fora da leitura de tela', () => {
    const { container } = render(<Emblema icone="broto" cor="#2dd4bf" tamanho={48} />);
    const placa = container.querySelector<HTMLElement>('.emblema')!;
    expect(placa.style.getPropertyValue('--cor')).toBe('#2dd4bf');
    expect(placa.style.width).toBe('48px');
    expect(placa.style.borderRadius).toBe('14px');
    const svg = placa.querySelector('svg.icone-svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('width')).toBe('28');
  });
});

describe('<CartaoJogo>', () => {
  it('é um link com emblema, nome, descrição e seta', () => {
    const { container, getByRole } = render(
      <MemoryRouter>
        <CartaoJogo to="/jogar/camadas" icone="quebra-cabeca" cor="#f0705a" nome="Camadas germinativas" descricao="De onde vem cada tecido?" />
      </MemoryRouter>,
    );
    const link = getByRole('link');
    expect(link.getAttribute('href')).toBe('/jogar/camadas');
    expect(link.textContent).toBe('Camadas germinativasDe onde vem cada tecido?');
    expect(link.classList.contains('destaque')).toBe(false);
    expect(container.querySelector<HTMLElement>('.emblema')!.style.width).toBe('48px');
    expect(container.querySelectorAll('svg.icone-svg')).toHaveLength(2); // emblema e seta
    expect(container.querySelector('svg.seta')).not.toBeNull();
  });

  it('em destaque, o emblema cresce e o cartão aceita selos', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <CartaoJogo destaque to="/x" icone="raio" cor="var(--accent)" nome="Plantão relâmpago" descricao="90 segundos de questões rápidas.">
          <span className="selo">3 plantões hoje</span>
        </CartaoJogo>
      </MemoryRouter>,
    );
    expect(container.querySelector('a.cartao-jogo.destaque')).not.toBeNull();
    expect(container.querySelector<HTMLElement>('.emblema')!.style.width).toBe('56px');
    expect(getByText('3 plantões hoje')).toBeTruthy();
  });
});

describe('<CartaoEmBreve>', () => {
  it('não é link e diz "Em breve" a quem usa leitor de tela', () => {
    const { container } = render(<CartaoEmBreve icone="osso" cor="#f87171" nome="Anatomia" descricao="Dissecção 3D por camadas" />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('.so-leitor')!.textContent).toBe('Em breve');
    expect(container.querySelector('strong')!.textContent).toBe('Anatomia');
  });
});

describe('cores das disciplinas', () => {
  it('cada disciplina tem uma cor própria que se vê sobre o cartão escuro', () => {
    const cores = DISCIPLINAS.map((d) => d.cor);
    expect(new Set(cores).size).toBe(cores.length);
    for (const d of DISCIPLINAS) {
      expect(d.cor, d.id).toMatch(/^#[0-9a-f]{6}$/i);
      // ícone é objeto gráfico: pelo menos 3:1 sobre o cartão (#131c30)
      expect(contraste(d.cor, '#131c30'), d.id).toBeGreaterThanOrEqual(3);
    }
  });
});
