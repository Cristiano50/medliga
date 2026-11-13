// Avatar: catálogo íntegro, peças desenhadas, regras de desbloqueio, validação do dado e componente.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CATALOGO, NOMES_CATEGORIA, item } from '../src/modules/avatar/catalogo.ts';
import { CATEGORIAS, type AvatarConfig, type Forma } from '../src/modules/avatar/tipos.ts';
import { ACESSORIOS, BARBAS, CABELOS, COBERTURAS, FUNDOS, MOLDURAS, OCULOS, ROSTOS, ROUPAS } from '../src/modules/avatar/pecas.ts';
import { avatarParaSvg, montarAvatar } from '../src/modules/avatar/montar.ts';
import {
  AVATAR_INICIAL,
  chaveItem,
  comoLiberar,
  corDoNome,
  descricaoAvatar,
  itensLiberados,
  itensNovos,
  liberado,
  normalizarAvatar,
  restringirAoLiberado,
  sortearAvatar,
  type Progresso,
} from '../src/modules/avatar/regras.ts';
import { Avatar } from '../src/modules/avatar/Avatar.tsx';
import { CONQUISTAS } from '../src/core/conquistas.ts';
import { TITULOS_NIVEL } from '../src/core/scoring.ts';
import { criarRng } from '../src/core/random.ts';

const calouro: Progresso = { nivel: 1, conquistas: new Set() };
const tudo: Progresso = { nivel: 99, conquistas: new Set(CONQUISTAS.map((c) => c.id)) };

/** Peças desenhadas de cada categoria que tem desenho próprio (as demais são só cor). */
const DESENHOS: Partial<Record<keyof AvatarConfig, Record<string, unknown>>> = {
  rosto: ROSTOS,
  cabelo: CABELOS,
  cabeca: COBERTURAS,
  barba: BARBAS,
  oculos: OCULOS,
  roupa: ROUPAS,
  acessorio: ACESSORIOS,
  fundo: FUNDOS,
  moldura: MOLDURAS,
};
const SEM_DESENHO = new Set(['nenhum', 'nenhuma', 'careca']);

describe('catálogo do avatar', () => {
  it('tem todas as categorias, com nome, e ids únicos no formato aceito pelo servidor', () => {
    for (const cat of CATEGORIAS) {
      expect(NOMES_CATEGORIA[cat]).toBeTruthy();
      const ids = CATALOGO[cat].map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9-]{1,24}$/);
      for (const it of CATALOGO[cat]) expect(it.nome.length).toBeGreaterThan(1);
    }
  });

  it('toda regra de desbloqueio aponta para um título de nível ou uma conquista que existe', () => {
    const niveis = new Set(TITULOS_NIVEL.map((t) => t.min));
    const conquistas = new Set(CONQUISTAS.map((c) => c.id));
    for (const cat of CATEGORIAS)
      for (const it of CATALOGO[cat]) {
        const d = it.desbloqueio;
        if (!d) continue;
        if (d.tipo === 'nivel') expect(niveis.has(d.nivel), `${cat}:${it.id} nível ${d.nivel}`).toBe(true);
        else expect(conquistas.has(d.id), `${cat}:${it.id} conquista ${d.id}`).toBe(true);
        expect(comoLiberar(it)).toBeTruthy();
      }
  });

  it('cada conquista e cada título de nível (a partir de Monitor) libera pelo menos um item', () => {
    const regras = CATEGORIAS.flatMap((cat) => CATALOGO[cat].map((i) => i.desbloqueio).filter((d) => !!d));
    for (const c of CONQUISTAS) expect(regras.some((d) => d!.tipo === 'conquista' && d!.id === c.id), c.id).toBe(true);
    for (const t of TITULOS_NIVEL.filter((t) => t.min > 1)) expect(regras.some((d) => d!.tipo === 'nivel' && d!.nivel === t.min), t.titulo).toBe(true);
  });

  it('nada que representa a pessoa fica bloqueado: pele, forma do cabelo, barba e cores naturais de cabelo', () => {
    for (const cat of ['pele', 'cabelo', 'barba'] as const) for (const it of CATALOGO[cat]) expect(it.desbloqueio, `${cat}:${it.id}`).toBeUndefined();
    for (const id of ['preto', 'castanho-escuro', 'castanho', 'ruivo', 'loiro', 'grisalho']) expect(item('corCabelo', id)?.desbloqueio).toBeUndefined();
    for (const id of ['redondo', 'retangular']) expect(item('oculos', id)?.desbloqueio).toBeUndefined();
    // coberturas de cabeça de uso pessoal ou religioso são livres; só a touca cirúrgica é item de jogo
    for (const it of CATALOGO.cabeca) if (it.id !== 'touca') expect(it.desbloqueio, `cabeca:${it.id}`).toBeUndefined();
  });

  it('as cores (pele, cabelo, roupa) são hexadecimais válidos', () => {
    for (const cat of ['pele', 'corCabelo', 'corRoupa'] as const) for (const it of CATALOGO[cat]) expect(it.cor, `${cat}:${it.id}`).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('todo item do catálogo tem desenho, e todo desenho está no catálogo', () => {
    for (const [cat, pecas] of Object.entries(DESENHOS) as [keyof AvatarConfig & string, Record<string, unknown>][]) {
      const ids = CATALOGO[cat as Exclude<keyof AvatarConfig, 'v'>].map((i) => i.id);
      for (const id of ids) if (!SEM_DESENHO.has(id)) expect(pecas[id], `${cat}:${id} sem desenho`).toBeDefined();
      for (const id of Object.keys(pecas)) expect(ids, `${cat}:${id} fora do catálogo`).toContain(id);
    }
  });
});

describe('montagem do avatar', () => {
  const formasValidas = (fs: Forma[]) => {
    for (const f of fs) {
      expect([f.d, f.c, f.e, f.r].filter((x) => x !== undefined).length, JSON.stringify(f)).toBe(1);
      expect(f.f !== undefined || f.s !== undefined, JSON.stringify(f)).toBe(true);
      if (f.d) expect(f.d).toMatch(/^[MLHVCSQTAZmlhvcsqtaz0-9eE\s,.+-]+$/);
      for (const n of [...(f.c ?? []), ...(f.e ?? []), ...(f.r ?? [])]) expect(Number.isFinite(n)).toBe(true);
    }
  };

  it('toda peça de toda categoria monta só com formas válidas', () => {
    for (const cat of CATEGORIAS)
      for (const it of CATALOGO[cat]) {
        const m = montarAvatar({ ...AVATAR_INICIAL, [cat]: it.id });
        expect(m.dentro.length).toBeGreaterThan(5);
        formasValidas(m.dentro);
        formasValidas(m.fora);
      }
  });

  it('a cobertura de cabeça esconde o cabelo, e a moldura fica por cima do recorte', () => {
    const cabelo = JSON.stringify(CABELOS['black-power'].frente[0]);
    const sem = montarAvatar({ ...AVATAR_INICIAL, cabelo: 'black-power' });
    const com = montarAvatar({ ...AVATAR_INICIAL, cabelo: 'black-power', cabeca: 'hijab' });
    expect(JSON.stringify(sem.dentro)).toContain(cabelo);
    expect(JSON.stringify(com.dentro)).not.toContain(cabelo);
    expect(montarAvatar({ ...AVATAR_INICIAL, moldura: 'titular' }).fora.length).toBeGreaterThan(0);
    expect(montarAvatar(AVATAR_INICIAL).fora).toEqual([]);
  });

  it('usa as cores escolhidas e gera SVG sem referência de cor por nome', () => {
    const svg = avatarParaSvg({ ...AVATAR_INICIAL, pele: 'p8', corCabelo: 'ruivo', corRoupa: 'vinho', barba: 'barba-cheia', roupa: 'pijama' });
    expect(svg).toContain(item('pele', 'p8')!.cor);
    expect(svg).toContain(item('corCabelo', 'ruivo')!.cor);
    expect(svg).toContain(item('corRoupa', 'vinho')!.cor);
    expect(svg).not.toMatch(/"(pele|cabelo|roupa)"/);
  });
});

describe('regras de desbloqueio', () => {
  it('calouro só tem os itens livres; com nível e conquistas, os itens são liberados', () => {
    expect(itensLiberados(calouro)).toEqual([]);
    expect(liberado(item('roupa', 'jaleco')!, calouro)).toBe(false);
    expect(liberado(item('roupa', 'jaleco')!, { nivel: 5, conquistas: new Set() })).toBe(true);
    expect(liberado(item('roupa', 'pijama')!, { nivel: 19, conquistas: new Set() })).toBe(false);
    expect(liberado(item('oculos', 'protecao')!, { nivel: 1, conquistas: new Set(['olho-clinico']) })).toBe(true);
    const total = CATEGORIAS.reduce((s, cat) => s + CATALOGO[cat].filter((i) => i.desbloqueio).length, 0);
    expect(itensLiberados(tudo).length).toBe(total);
  });

  it('explica como liberar', () => {
    expect(comoLiberar(item('roupa', 'jaleco')!)).toBe('Nível 5 · Monitor');
    expect(comoLiberar(item('oculos', 'protecao')!)).toBe('Conquista: Olho clínico');
    expect(comoLiberar(item('roupa', 'camiseta')!)).toBeNull();
  });

  it('marca como novos só os itens liberados que ainda não foram vistos', () => {
    const p: Progresso = { nivel: 5, conquistas: new Set(['primeiro-passo']) };
    const liberados = itensLiberados(p);
    expect(liberados).toContain(chaveItem('roupa', 'jaleco'));
    expect(liberados).toContain(chaveItem('acessorio', 'cracha'));
    expect(itensNovos(p, undefined)).toEqual(liberados);
    expect(itensNovos(p, [chaveItem('roupa', 'jaleco')])).not.toContain(chaveItem('roupa', 'jaleco'));
    expect(itensNovos(p, liberados)).toEqual([]);
  });

  it('ao salvar, item ainda bloqueado volta para o item livre da categoria', () => {
    const querendo: AvatarConfig = { ...AVATAR_INICIAL, roupa: 'jaleco-titular', moldura: 'titular', cabelo: 'trancas', acessorio: 'cracha' };
    const r = restringirAoLiberado(querendo, { nivel: 3, conquistas: new Set(['primeiro-passo']) });
    expect(r.roupa).toBe('camiseta');
    expect(r.moldura).toBe('nenhuma');
    expect(r.cabelo).toBe('trancas');
    expect(r.acessorio).toBe('cracha');
    expect(restringirAoLiberado(querendo, tudo)).toEqual(querendo);
  });

  it('o avatar inicial só usa itens livres que existem', () => {
    for (const cat of CATEGORIAS) expect(item(cat, AVATAR_INICIAL[cat])?.desbloqueio, cat).toBeUndefined();
    expect(restringirAoLiberado(AVATAR_INICIAL, calouro)).toEqual(AVATAR_INICIAL);
  });

  it('o sorteio só usa itens liberados e é reproduzível com a mesma semente', () => {
    for (let s = 1; s <= 40; s++) {
      const a = sortearAvatar(calouro, criarRng(s));
      expect(restringirAoLiberado(a, calouro)).toEqual(a);
      expect(normalizarAvatar(a)).toEqual(a);
    }
    expect(sortearAvatar(tudo, criarRng(7))).toEqual(sortearAvatar(tudo, criarRng(7)));
    const tons = new Set(Array.from({ length: 60 }, (_, i) => sortearAvatar(calouro, criarRng(100 + i)).pele));
    expect(tons.size).toBe(CATALOGO.pele.length); // todos os tons aparecem no sorteio
  });
});

describe('validação do avatar recebido', () => {
  it('aceita o avatar válido e recusa o que não é avatar', () => {
    expect(normalizarAvatar(AVATAR_INICIAL)).toEqual(AVATAR_INICIAL);
    for (const x of [null, undefined, 'texto', 7, [], {}, { v: 2, pele: 'p1' }]) expect(normalizarAvatar(x)).toBeNull();
  });

  it('id desconhecido ou malicioso vira o item inicial e nunca chega ao desenho', () => {
    const sujo = { ...AVATAR_INICIAL, pele: '"><script>alert(1)</script>', cabelo: 'nao-existe', fundo: 42, extra: 'x' };
    const limpo = normalizarAvatar(sujo)!;
    expect(limpo.pele).toBe(AVATAR_INICIAL.pele);
    expect(limpo.cabelo).toBe(AVATAR_INICIAL.cabelo);
    expect(limpo.fundo).toBe(AVATAR_INICIAL.fundo);
    expect(Object.keys(limpo).sort()).toEqual(['v', ...CATEGORIAS].sort());
    const { container } = render(<Avatar config={sujo} nome="Teste" />);
    expect(container.innerHTML).not.toContain('script');
  });
});

describe('componente Avatar', () => {
  it('desenha as camadas do avatar e descreve o que o jogador escolheu, sem citar tom de pele', () => {
    const c: AvatarConfig = { ...AVATAR_INICIAL, pele: 'p7', cabelo: 'black-power', corCabelo: 'preto', oculos: 'redondo', roupa: 'jaleco', acessorio: 'estetoscopio', moldura: 'ligante' };
    const { container } = render(<Avatar config={c} nome="Ana S." tamanho={96} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('width')).toBe('96');
    const rotulo = svg.getAttribute('aria-label')!;
    expect(rotulo).toBe('Avatar: cabelo black power preto, óculos redondos, jaleco, estetoscópio (Ana S.)');
    expect(rotulo).not.toMatch(/tom|pele/i);
    const m = montarAvatar(c);
    expect(svg.querySelectorAll('g[clip-path] > *').length).toBe(m.dentro.length);
    expect(svg.querySelectorAll('path, circle, ellipse, rect').length).toBe(m.dentro.length + m.fora.length + 1); // + círculo do recorte
    expect(svg.innerHTML).toContain(item('pele', 'p7')!.cor);
  });

  it('descreve cobertura de cabeça e barba; careca não cita cor de cabelo', () => {
    expect(descricaoAvatar({ ...AVATAR_INICIAL, cabeca: 'hijab' })).toBe('Avatar: hijab, camiseta');
    expect(descricaoAvatar({ ...AVATAR_INICIAL, cabelo: 'careca', barba: 'barba-cheia' })).toBe('Avatar: careca, barba cheia, camiseta');
  });

  it('sem avatar montado, mostra a silhueta padrão com a cor do nome (sem pele nem cabelo)', () => {
    const { container } = render(<Avatar nome="Bruno C." />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('Avatar padrão (Bruno C.)');
    expect(svg.innerHTML).toContain(corDoNome('Bruno C.'));
    for (const it of CATALOGO.pele) expect(svg.innerHTML).not.toContain(it.cor);
    expect(corDoNome('Bruno C.')).toBe(corDoNome('Bruno C.'));
  });

  it('decorativo fica fora da leitura de tela; dois avatares na mesma tela não dividem o id do recorte', () => {
    const { container } = render(
      <>
        <Avatar config={AVATAR_INICIAL} decorativo />
        <Avatar config={AVATAR_INICIAL} decorativo />
      </>,
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs[0].getAttribute('aria-hidden')).toBe('true');
    expect(svgs[0].getAttribute('role')).toBeNull();
    const ids = [...container.querySelectorAll('clipPath')].map((c) => c.id);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(id).toMatch(/^av[a-zA-Z0-9]+$/);
  });
});
