// Jogo "Identifique no 3D" genérico: alvos só da disciplina pedida, partida completa até o resultado e XP salvo
// com a disciplina certa (histologia); a embriologia continua igual pelo wrapper embriologia/Identifique.tsx.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { carregarDisciplina, ESTAGIOS, MODELOS_HISTOLOGIA_3D } from '../src/content/index.ts';
import { db } from '../src/data/db.ts';
import type { Cena3DProps } from '../src/modules/embriologia/Cena3D.tsx';
import { alvosPossiveis, CATALOGO_EMBRIOLOGIA, CATALOGO_HISTOLOGIA, sortearAlvos } from '../src/modules/tres3d/catalogo.ts';
import { Identifique3D } from '../src/modules/tres3d/Identifique3D.tsx';
import IdentifiqueEmbriologia from '../src/modules/embriologia/Identifique.tsx';
import { criarRng } from '../src/core/random.ts';

// Cena falsa: um botão por parte com nome (o toque vira um clique) e o modelo/perfil recebidos.
const recebidos: { estagioId: string; modelo: boolean; perfil: string | null }[] = [];
vi.mock('../src/modules/embriologia/Cena3D.tsx', () => ({
  Cena3D: (p: Cena3DProps) => {
    recebidos.push({ estagioId: p.estagioId, modelo: !!p.modelo, perfil: p.perfil?.tipo ?? null });
    return createElement(
      'div',
      { 'data-testid': 'cena', 'data-modelo': p.estagioId },
      Object.entries(p.nomes).map(([id, nome]) => createElement('button', { key: id, 'data-parte': id, onClick: () => p.onEscolher?.(id) }, `parte: ${nome}`)),
    );
  },
}));

beforeAll(async () => {
  await carregarDisciplina('embriologia');
  await carregarDisciplina('histologia');
});
afterEach(cleanup);

const idsHistologia = new Set(CATALOGO_HISTOLOGIA.itens.map((i) => i.id));
const idsEmbriologia = new Set(ESTAGIOS.map((e) => e.id));

describe('alvos do Identifique no 3D', () => {
  it('histologia: só modelos da histologia, só estruturas que existem no desenho', () => {
    const alvos = alvosPossiveis(CATALOGO_HISTOLOGIA, null);
    expect(alvos.length).toBeGreaterThan(20);
    for (const a of alvos) {
      expect(idsHistologia.has(a.itemId), a.itemId).toBe(true);
      expect(idsEmbriologia.has(a.itemId), a.itemId).toBe(false);
      expect(CATALOGO_HISTOLOGIA.modelos[a.itemId].partes).toContain(a.estruturaId);
      expect(a.topicoId.startsWith('his-'), a.topicoId).toBe(true);
    }
    // todo modelo do texto com desenho registrado entra no jogo
    for (const m of MODELOS_HISTOLOGIA_3D) if (CATALOGO_HISTOLOGIA.modelos[m.id]) expect(alvos.some((a) => a.itemId === m.id), m.id).toBe(true);
  });

  it('embriologia: só estágios da embriologia; modelo fixo restringe o sorteio', () => {
    for (const a of alvosPossiveis(CATALOGO_EMBRIOLOGIA, null)) {
      expect(idsEmbriologia.has(a.itemId), a.itemId).toBe(true);
      expect(idsHistologia.has(a.itemId), a.itemId).toBe(false);
    }
    const nefron = sortearAlvos(CATALOGO_HISTOLOGIA, 'nefron', 10, criarRng(3));
    expect(nefron).toHaveLength(10);
    expect(new Set(nefron.map((a) => a.itemId))).toEqual(new Set(['nefron']));
    expect(new Set(nefron.map((a) => a.estruturaId)).size).toBe(10);
  });

  it('sorteio agrupado pela ordem dos modelos (não troca de modelo a cada pergunta)', () => {
    const ordem = CATALOGO_HISTOLOGIA.itens.map((i) => i.id);
    for (let s = 1; s <= 20; s++) {
      const posicoes = sortearAlvos(CATALOGO_HISTOLOGIA, null, 10, criarRng(s)).map((a) => ordem.indexOf(a.itemId));
      expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
    }
  });
});

/** Joga até o resultado: acerta todos os alvos, menos o primeiro (toca numa parte errada). */
async function jogarAteOResultado() {
  for (let rodada = 0; rodada < 10; rodada++) {
    const pedido = screen.getByRole('heading', { name: /^Toque em:/ }).textContent!.replace(/^Toque em:\s*/, '');
    const certo = screen.getAllByRole('button', { name: `parte: ${pedido}` })[0];
    if (rodada === 0) {
      const errado = screen.getAllByRole('button', { name: /^parte: / }).find((b) => b !== certo)!;
      fireEvent.click(errado);
      expect(screen.getByRole('status').textContent).toMatch(/Você tocou em:/);
    } else {
      fireEvent.click(certo);
      expect(screen.getByRole('status').textContent).toMatch(/Encontrou!/);
    }
    const botao = screen.getByRole('button', { name: /^(Próxima|Ver resultado)$/ });
    if (botao.textContent === 'Ver resultado') { fireEvent.click(botao); break; }
    fireEvent.click(botao);
  }
  await waitFor(() => expect(screen.getByRole('heading', { name: /^\+\d+ XP$/ })).toBeTruthy());
}

describe('partida completa', () => {
  it('histologia: alvos do modelo pedido, cena com modelo e perfil da histologia, XP salvo com disciplina histologia', async () => {
    recebidos.length = 0;
    render(createElement(MemoryRouter, { initialEntries: ['/jogar/identifique/histologia?modelo=nefron'] }, createElement(Identifique3D, { disciplina: 'histologia' })));
    expect(screen.getByText(/Néfron cortical e ducto coletor · Esquema fora de escala/)).toBeTruthy();
    await jogarAteOResultado();
    expect(screen.getByText('9 de 10 estruturas encontradas')).toBeTruthy();
    expect(new Set(recebidos.map((r) => r.estagioId))).toEqual(new Set(['nefron']));
    expect(recebidos.every((r) => r.modelo && r.perfil === 'esquema')).toBe(true);
    const sessoes = await db.sessoes.where('modo').equals('identifique').toArray();
    const ultima = sessoes.sort((a, b) => b.fim - a.fim)[0];
    expect(ultima.disciplina).toBe('histologia');
    expect(ultima.total).toBe(10);
    expect(ultima.acertos).toBe(9);
    expect(ultima.topicoIds).toEqual(['his-17-urinario']);
    const respostas = await db.respostas.where('sessaoId').equals(ultima.id).toArray();
    expect(respostas).toHaveLength(10);
    for (const r of respostas) expect(r.questaoId).toMatch(/^identifique:nefron:[a-z-]+$/);
    // mesmo XP das regras dos minijogos: 4 por acerto com combo (9 acertos seguidos depois de um erro)
    expect(ultima.xp).toBe(respostas.reduce((s, r) => s + r.xp, 0));
    expect(screen.getByRole('heading', { name: `+${ultima.xp} XP` })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Ir ao laboratório' }).getAttribute('href')).toBe('/lab3d/histologia');
  });

  it('embriologia (wrapper): mesmos alvos, textos e registro de antes, com disciplina embriologia', async () => {
    recebidos.length = 0;
    render(createElement(MemoryRouter, { initialEntries: ['/jogar/identifique?estagio=semana-4'] }, createElement(IdentifiqueEmbriologia)));
    const estagio = ESTAGIOS.find((e) => e.id === 'semana-4')!;
    expect(screen.getByText(`${estagio.titulo} · ${estagio.dias}`)).toBeTruthy();
    await jogarAteOResultado();
    // o Cena3D da embriologia recebe só o id (modelo e perfil padrão pelo registro da embriologia)
    expect(recebidos.every((r) => r.estagioId === 'semana-4' && !r.modelo && r.perfil === null)).toBe(true);
    const sessoes = await db.sessoes.where('modo').equals('identifique').toArray();
    const ultima = sessoes.sort((a, b) => b.fim - a.fim)[0];
    expect(ultima.disciplina).toBe('embriologia');
    expect(ultima.topicoIds).toEqual([estagio.topicos[0]]);
    const respostas = await db.respostas.where('sessaoId').equals(ultima.id).toArray();
    for (const r of respostas) expect(r.questaoId).toMatch(/^identifique:semana-4:[a-z0-9-]+$/);
    expect(screen.getByRole('link', { name: 'Ir ao laboratório' }).getAttribute('href')).toBe('/lab3d');
  });

  it('modelo sem estruturas: mensagem com o rótulo da disciplina e volta ao laboratório certo', () => {
    render(createElement(MemoryRouter, { initialEntries: ['/x?modelo=inexistente'] }, createElement(Identifique3D, { disciplina: 'histologia' })));
    expect(screen.getByRole('heading', { name: 'Sem estruturas para este modelo' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Voltar ao laboratório' }).getAttribute('href')).toBe('/lab3d/histologia');
  });
});
