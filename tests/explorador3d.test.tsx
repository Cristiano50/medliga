// Explorador 3D genérico (laboratório da histologia): avisos de escala e de interpretação sempre visíveis,
// seleção com painel, ocultar/reexibir, isolar, corte, tela cheia, troca de modelo pela URL e links.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { carregarDisciplina } from '../src/content/index.ts';
import type { Cena3DProps } from '../src/modules/embriologia/Cena3D.tsx';
import { CATALOGO_HISTOLOGIA } from '../src/modules/tres3d/catalogo.ts';
import { Explorador3D } from '../src/modules/tres3d/Explorador3D.tsx';

vi.mock('../src/modules/embriologia/Cena3D.tsx', () => ({
  Cena3D: (p: Cena3DProps) => (
    <output data-testid="cena">
      {JSON.stringify({ id: p.estagioId, selecionado: p.selecionado, ocultos: p.ocultos, isolado: p.isolado, corte: p.corte, telaCheia: !!p.telaCheia, rotulos: p.rotulosVisiveis, modelo: !!p.modelo, perfil: p.perfil?.tipo ?? null })}
    </output>
  ),
}));
beforeAll(async () => {
  await carregarDisciplina('histologia');
  // o jsdom não implementa scrollIntoView (usado ao entrar em tela cheia)
  Element.prototype.scrollIntoView ??= () => {};
});
afterEach(cleanup);

const cena = () => JSON.parse(screen.getByTestId('cena').textContent!);
const abrir = (rota: string) => render(<MemoryRouter initialEntries={[rota]}><Explorador3D disciplina="histologia" /></MemoryRouter>);

describe('explorador 3D da histologia', () => {
  it('mostra sempre o aviso de escala e os avisos de interpretação de cada modelo', () => {
    expect(CATALOGO_HISTOLOGIA.itens.length).toBeGreaterThanOrEqual(2);
    for (const item of CATALOGO_HISTOLOGIA.itens) {
      abrir(`/lab3d/histologia?modelo=${item.id}`);
      const avisos = screen.getByLabelText('Como interpretar o modelo');
      expect(within(avisos).getByText(item.escala!).tagName).toBe('STRONG');
      expect(item.escala).toMatch(/fora de escala/i);
      for (const linha of item.contexto!) expect(within(avisos).getByText(linha)).toBeTruthy();
      expect(cena()).toMatchObject({ id: item.id, modelo: true });
      expect(cena().perfil).not.toBeNull();
      cleanup();
    }
  });

  it('seleciona pela lista, mostra o painel com o tópico do próprio modelo, oculta, reexibe, isola e corta', () => {
    abrir('/lab3d/histologia?modelo=nefron');
    const lista = screen.getByRole('group', { name: 'Estruturas deste modelo' });
    expect(within(lista).getAllByRole('button')).toHaveLength(CATALOGO_HISTOLOGIA.modelos.nefron.partes.length);
    fireEvent.click(within(lista).getByRole('button', { name: /^4 Glomérulo$/ }));
    const ficha = screen.getByRole('region', { name: 'Estrutura selecionada' });
    expect(within(ficha).getByRole('heading', { name: 'Glomérulo' })).toBeTruthy();
    expect(within(ficha).getByText(/Tufo de capilares/)).toBeTruthy();
    expect(within(ficha).getByRole('link', { name: /Estudar: Sistema urinário/ }).getAttribute('href')).toBe('/topico/his-17-urinario');
    expect(cena().selecionado).toBe('glomerulo');

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar seleção' }));
    expect(cena()).toMatchObject({ selecionado: null, ocultos: ['glomerulo'] });
    expect(screen.getByText(/1 estrutura\(s\) oculta\(s\)/)).toBeTruthy();
    fireEvent.click(within(lista).getByRole('button', { name: /Glomérulo.*oculta/ }));
    expect(cena()).toMatchObject({ selecionado: 'glomerulo', ocultos: [] });

    fireEvent.click(screen.getByRole('button', { name: 'Isolar seleção' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Corte de exploração' }));
    expect(cena()).toMatchObject({ isolado: 'glomerulo', corte: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Tela cheia' }));
    expect(cena().telaCheia).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar marcadores' }));
    expect(cena().rotulos).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Restaurar vista' }));
    expect(cena()).toMatchObject({ selecionado: null, ocultos: [], isolado: null, corte: null });
  });

  it('troca de modelo pelos botões, limpa a exploração e aponta o desafio para o modelo atual', () => {
    abrir('/lab3d/histologia?modelo=nefron');
    expect(screen.getByRole('link', { name: /Desafio: identifique neste modelo/ }).getAttribute('href')).toBe('/jogar/identifique/histologia?modelo=nefron');
    fireEvent.click(screen.getByRole('button', { name: /^5 Arteríola eferente$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar seleção' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo modelo' }));
    expect(cena()).toMatchObject({ id: 'alveolo', selecionado: null, ocultos: [], isolado: null, corte: null, perfil: 'cascas' });
    expect(screen.getByRole('link', { name: /Desafio: identifique neste modelo/ }).getAttribute('href')).toBe('/jogar/identifique/histologia?modelo=alveolo');
    expect(screen.getByRole('link', { name: /Estudar o tópico/ }).getAttribute('href')).toBe('/topico/his-16-respiratorio');
    // busca sem acentos, como no laboratório da embriologia
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'pneumocito' } });
    expect(within(screen.getByRole('group', { name: 'Estruturas deste modelo' })).getAllByRole('button')).toHaveLength(2);
  });

  it('modelo desconhecido na URL cai no primeiro do catálogo', () => {
    abrir('/lab3d/histologia?modelo=nao-existe');
    expect(cena().id).toBe(CATALOGO_HISTOLOGIA.itens[0].id);
  });
});
