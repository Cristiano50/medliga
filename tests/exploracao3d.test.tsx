import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as THREE from 'three';
import { resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { distribuirRotulos } from '../src/modules/embriologia/tres/rotulos.tsx';
import { carregarDisciplina } from '../src/content/index.ts';
import Lab from '../src/modules/embriologia/Lab3D.tsx';
import type { Cena3DProps } from '../src/modules/embriologia/Cena3D.tsx';

vi.mock('../src/modules/embriologia/Cena3D.tsx', () => ({ Cena3D: (p: Cena3DProps) => <output data-testid="cena">{JSON.stringify({ ocultos: p.ocultos, isolado: p.isolado, corte: p.corte })}</output> }));
beforeAll(async () => { await carregarDisciplina('embriologia'); });
afterEach(cleanup);

describe('exploração 3D', () => {
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
