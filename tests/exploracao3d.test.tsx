import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as THREE from 'three';
import { resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { ancoraNoEnquadramento, distribuirRotulos, CamadaMarcadores } from '../src/modules/embriologia/tres/rotulos.tsx';
import { carregarDisciplina } from '../src/content/index.ts';
import Lab from '../src/modules/embriologia/Lab3D.tsx';
import type { Cena3DProps } from '../src/modules/embriologia/Cena3D.tsx';

vi.mock('../src/modules/embriologia/Cena3D.tsx', () => ({ Cena3D: (p: Cena3DProps) => <output data-testid="cena">{JSON.stringify({ ocultos: p.ocultos, isolado: p.isolado, corte: p.corte })}</output> }));
beforeAll(async () => { await carregarDisciplina('embriologia'); });
afterEach(cleanup);

describe('exploração 3D', () => {
  it('mostra a ilustração e seus limites somente na semana 8, preservando a cena interativa', () => {
    render(<MemoryRouter initialEntries={['/lab3d?estagio=semana-8']}><Lab /></MemoryRouter>);
    expect(screen.getByText('Comparar com a ilustração artística').closest('details')?.open).toBe(false);
    fireEvent.click(screen.getByText('Comparar com a ilustração artística'));
    const imagem = screen.getByRole('img', { name: /Ilustração artística de embrião/ });
    expect(imagem.getAttribute('src')).toMatch(/illustrations\/embriao-semana8-v1.webp$/);
    expect(screen.getByText(/aproximadamente 10 semanas gestacionais/)).toBeTruthy();
    expect(screen.getByText(/não corresponde à reconstrução de um espécime/)).toBeTruthy();
    expect(screen.getByTestId('cena')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Modelo anterior' }));
    expect(screen.queryByRole('img', { name: /Ilustração artística de embrião/ })).toBeNull();
  });
  it('busca sem acentos preserva número, seleção e tecidos; limpa ao mudar estágio', () => {
    render(<MemoryRouter initialEntries={['/lab3d?estagio=semana-6']}><Lab /></MemoryRouter>);
    const busca = screen.getByRole('searchbox');
    fireEvent.change(busca, { target: { value: 'saliencias' } });
    const lista = screen.getByRole('group', { name: 'Estruturas deste estágio' });
    expect(within(lista).getAllByRole('button')).toHaveLength(1);
    fireEvent.click(within(lista).getByRole('button', { name: /4 Saliências auriculares/ }));
    const ficha = screen.getByRole('region', { name: 'Estrutura selecionada' });
    expect(ficha.compareDocumentPosition(lista) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(busca, { target: { value: 'inexistente' } });
    expect(within(lista).queryAllByRole('button')).toHaveLength(0);
    expect(within(ficha).getByRole('heading', { name: /Saliências auriculares/ })).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('cena').textContent!)).toEqual({ ocultos: [], isolado: null, corte: null });
    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(within(lista).getAllByRole('button').length).toBeGreaterThan(1);
    fireEvent.change(busca, { target: { value: 'saliencias' } });
    fireEvent.click(screen.getByRole('button', { name: 'Próximo modelo' }));
    expect((busca as HTMLInputElement).value).toBe('');
    expect(screen.queryByRole('region', { name: 'Estrutura selecionada' })).toBeNull();
  });

  it('pinta a seleção por último sem mover marcadores nem mudar símbolos de resposta', () => {
    const pontos = [
      { id: 'a', x: 20, y: 50, numero: '1', nome: 'A', estado: 'normal' },
      { id: 'b', x: 25, y: 80, numero: '2', nome: 'B', estado: 'certo' },
    ];
    const { container, rerender } = render(<CamadaMarcadores quadro={{ pontos, largura: 300, altura: 360 }} />);
    const posicao = container.querySelector('.marcador')!.getAttribute('cy');
    rerender(<CamadaMarcadores quadro={{ pontos: [{ ...pontos[0], estado: 'selecionado' }, pontos[1]], largura: 300, altura: 360 }} />);
    expect(container.querySelector('svg')!.lastElementChild!.querySelector('title')!.textContent).toBe('A');
    expect(container.querySelector('.selecionado .marcador')!.getAttribute('cy')).toBe(posicao);
    // a resposta certa continua marcada com o visto desenhado (traço), não com o número
    expect(container.querySelector('.certo .simbolo')!.getAttribute('d')).toMatch(/^M /);
    expect(container.querySelector('.certo text')).toBeNull();
    expect(container.querySelector('.selecionado text')!.textContent).toBe('1');
  });
  it('omite âncoras fora do enquadramento em qualquer eixo e recupera ao voltar', () => {
    for (const eixo of ['x', 'y', 'z'] as const) {
      for (const valor of [-1.01, 1.01, Infinity, NaN]) {
        expect(ancoraNoEnquadramento({ x: 0, y: 0, z: 0, [eixo]: valor })).toBe(false);
      }
    }
    expect(ancoraNoEnquadramento({ x: -1, y: 1, z: 0 })).toBe(true);
    expect(ancoraNoEnquadramento(new THREE.Vector3(0, 0, 0))).toBe(true);
  });
  it('oculta, reexibe pela lista e limpa isolamento/corte ao trocar estágio', () => {
    render(<MemoryRouter initialEntries={['/lab3d?estagio=semana-6']}><Lab /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /4 Saliências auriculares/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar seleção' }));
    expect(JSON.parse(screen.getByTestId('cena').textContent!).ocultos).toContain('pavilhao-auricular');
    fireEvent.click(screen.getByRole('button', { name: /Saliências auriculares.*oculta/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Isolar seleção' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Corte de exploração' }));
    expect(JSON.parse(screen.getByTestId('cena').textContent!)).toEqual({ ocultos: [], isolado: 'pavilhao-auricular', corte: 0 });
    expect(screen.getByText(/Esquema didático/)).toBeTruthy();
    expect(screen.getByText(/A cabeça cresce muito/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo modelo' }));
    expect(JSON.parse(screen.getByTestId('cena').textContent!)).toEqual({ ocultos: [], isolado: null, corte: null });
  });

  it('não seleciona malhas ocultas nem fragmentos removidos pelo corte', () => {
    const externo = new THREE.Group(); externo.visible = false;
    const escondido = new THREE.Mesh(); escondido.userData = { parteId: 'oculta', prioridade: 9 }; externo.add(escondido);
    const cortado = new THREE.Mesh(); cortado.userData = { parteId: 'cortada', prioridade: 8 };
    const visivel = new THREE.Mesh(); visivel.userData = { parteId: 'visivel', prioridade: 1 };
    const intersecoes = [
      { object: escondido, distance: 1, point: new THREE.Vector3(0, 0, -1) },
      { object: cortado, distance: 2, point: new THREE.Vector3(0, 0, 1) },
      { object: visivel, distance: 3, point: new THREE.Vector3(0, 0, -1) },
    ];
    expect(resolverToque(intersecoes, [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)])).toBe('visivel');
  });

  it('distribui marcadores concentrados sem sobreposição em tela estreita', () => {
    const labels = distribuirRotulos(Array.from({ length: 15 }, (_, i) => ({ x: 250, y: 180 + i })), 300, 360);
    expect(labels).toHaveLength(15);
    for (const lado of [22, 278]) {
      const coluna = labels.filter((p) => p.marcadorX === lado);
      expect(coluna.length).toBeGreaterThan(0);
      coluna.forEach((p, i) => {
        expect(p.marcadorY).toBeGreaterThan(13);
        expect(p.marcadorY).toBeLessThan(347);
        if (i) expect(p.marcadorY - coluna[i - 1].marcadorY).toBeGreaterThanOrEqual(28);
      });
    }
  });
});
