// Avatar: catálogo íntegro, peças desenhadas, regras de desbloqueio, validação do dado e componente.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CATALOGO, NOMES_CATEGORIA, item } from '../src/modules/avatar/catalogo.ts';
import { CATEGORIAS, type AvatarConfig, type Forma } from '../src/modules/avatar/tipos.ts';
import { ACESSORIOS, APOIOS, BARBAS, CABELOS, COBERTURAS, FUNDOS, MOLDURAS, OCULOS, PARAMENTOS, ROSTOS, ROUPAS } from '../src/modules/avatar/pecas.ts';
import { avatarParaSvg, LADO_COMPACTO, montarAvatar, TRANSFORMACAO_COMPACTA } from '../src/modules/avatar/montar.ts';
import { contraste } from '../src/modules/avatar/cor.ts';
import {
  AVATAR_INICIAL,
  avisoDeContraste,
  chaveItem,
  comoLiberar,
  corDoNome,
  descricaoAvatar,
  itensLiberados,
  itensNovos,
  liberado,
  melhorFundo,
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
  apoio: APOIOS,
  acessorio: ACESSORIOS,
  paramento: PARAMENTOS,
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

  it('nada que representa a pessoa fica bloqueado: pele, cabelo, barba, cobertura de cabeça, óculos e apoio', () => {
    for (const cat of ['pele', 'cabelo', 'barba', 'cabeca', 'corCabeca', 'oculos', 'apoio', 'corRoupa'] as const)
      for (const it of CATALOGO[cat]) expect(it.desbloqueio, `${cat}:${it.id}`).toBeUndefined();
    for (const id of ['preto', 'castanho-escuro', 'castanho', 'ruivo', 'loiro', 'grisalho', 'branco']) expect(item('corCabelo', id)?.desbloqueio).toBeUndefined();
  });

  it('item de jogo não disputa vaga com item de identidade: touca, máscara, proteção e capelo ficam em paramento', () => {
    for (const id of ['touca', 'mascara', 'protecao', 'capelo']) {
      expect(item('paramento', id)?.desbloqueio, id).toBeDefined();
      expect(item('cabeca', id)).toBeUndefined();
      expect(item('oculos', id)).toBeUndefined();
    }
    // tudo o que é de jogo nessas vagas tem regra de desbloqueio; tudo o que é de identidade, não
    for (const cat of ['acessorio', 'paramento'] as const) for (const it of CATALOGO[cat]) if (!SEM_DESENHO.has(it.id)) expect(it.desbloqueio, `${cat}:${it.id}`).toBeDefined();
  });

  it('os tons de pele estão em ordem de luminância e têm nomes neutros', () => {
    const cores = CATALOGO.pele.map((p) => p.cor!);
    for (let i = 1; i < cores.length; i++) expect(contraste(cores[i], '#ffffff'), CATALOGO.pele[i].nome).toBeGreaterThan(contraste(cores[i - 1], '#ffffff'));
    CATALOGO.pele.forEach((p, i) => expect(p.nome).toBe(`Tom ${i + 1}`));
  });

  it('nenhum nome nem texto alternativo do catálogo fala de gênero, raça, religião, idade ou saúde', () => {
    const proibidas = /\b(homem|mulher|moça|moca|rapaz|menin[oa]|negr[oa]|branc[oa] de pele|pard[oa]|moren[oa]|muçulman[oa]|judeu|judia|sikh|candomblé|idos[oa]|velh[oa]|surd[oa]|ceg[oa]|deficiente)\b/i;
    for (const cat of CATEGORIAS) for (const it of CATALOGO[cat]) expect(`${it.nome} ${it.alt ?? ''}`, `${cat}:${it.id}`).not.toMatch(proibidas);
    // nomes de moldura e de expressão sem marca de gênero
    for (const nome of ['Monitor', 'Diretor de Liga', 'Interno', 'Preceptor', 'Professor Titular', 'Sério', 'Calvo com laterais']) expect(CATEGORIAS.flatMap((cat) => CATALOGO[cat].map((i) => i.nome))).not.toContain(nome);
  });

  it('as cores (pele, cabelo, roupa, cobertura, fundo) são hexadecimais válidos', () => {
    for (const cat of ['pele', 'corCabelo', 'corRoupa', 'corCabeca', 'fundo'] as const) for (const it of CATALOGO[cat]) expect(it.cor, `${cat}:${it.id}`).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('a roupa não tem a mesma cor do fundo de mesmo nome', () => {
    for (const it of CATALOGO.corRoupa) {
      const fundo = item('fundo', it.id);
      if (fundo) expect(contraste(it.cor!, fundo.cor!), it.id).toBeGreaterThan(1.4);
    }
    // o item inicial de cada categoria também não se confunde com o fundo inicial
    expect(avisoDeContraste(AVATAR_INICIAL, calouro)).toBeNull();
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
      if (f.tr) expect(f.tr).toMatch(/^(translate\(0 -?[\d.]+\)|matrix\(-1 0 0 1 200 0\))$/);
      for (const n of [...(f.c ?? []), ...(f.e ?? []), ...(f.r ?? [])]) expect(Number.isFinite(n)).toBe(true);
    }
  };

  it('toda peça de toda categoria monta só com formas válidas', () => {
    for (const cat of CATEGORIAS)
      for (const it of CATALOGO[cat]) {
        const m = montarAvatar({ ...AVATAR_INICIAL, [cat]: it.id });
        expect(m.fundo.length).toBeGreaterThan(0);
        expect(m.pessoa.length).toBeGreaterThan(5);
        formasValidas(m.fundo);
        formasValidas(m.pessoa);
        formasValidas(m.fora);
        // nenhuma referência de cor fica sem resolver
        expect(avatarParaSvg({ ...AVATAR_INICIAL, [cat]: it.id })).not.toMatch(/(fill|stroke)="(pele|cabelo|roupa|cabeca|marca|undefined)"/);
      }
  });

  const temForma = (m: { pessoa: Forma[] }, f: Forma) => JSON.stringify(m.pessoa).includes(JSON.stringify(f));

  it('a cobertura de cabeça esconde o cabelo; o quipá fica sobre ele; a moldura fica por cima do recorte', () => {
    const cabelo = CABELOS['black-power'].frente[0];
    expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'black-power' }), cabelo)).toBe(true);
    for (const id of ['hijab', 'turbante', 'dastar']) expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'black-power', cabeca: id }), cabelo), id).toBe(false);
    const comQuipa = montarAvatar({ ...AVATAR_INICIAL, cabelo: 'black-power', cabeca: 'quipa' });
    expect(temForma(comQuipa, cabelo)).toBe(true);
    // assenta no topo do cabelo (22) e não na cabeça nua
    expect(comQuipa.pessoa.some((f) => f.f === 'cabeca' && f.tr === `translate(0 ${CABELOS['black-power'].topo - 43})`)).toBe(true);
    expect(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'careca', cabeca: 'quipa' }).pessoa.some((f) => f.f === 'cabeca' && f.tr === undefined)).toBe(true);
    expect(montarAvatar({ ...AVATAR_INICIAL, moldura: 'titular' }).fora.length).toBeGreaterThan(0);
    expect(montarAvatar(AVATAR_INICIAL).fora).toEqual([]);
  });

  it('paramentos ficam por cima do que a pessoa usa: touca sobre o hijab, proteção sobre os óculos', () => {
    const hijab = COBERTURAS.hijab.frente[0];
    const touca = PARAMENTOS.touca.sobre[0];
    const m = montarAvatar({ ...AVATAR_INICIAL, cabeca: 'hijab', paramento: 'touca' });
    const pos = (f: Forma) => m.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(f));
    expect(pos(hijab)).toBeGreaterThanOrEqual(0);
    expect(pos(touca)).toBeGreaterThan(pos(hijab));
    // sem cobertura, a touca esconde o cabelo
    expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'liso-longo', paramento: 'touca' }), CABELOS['liso-longo'].atras[0])).toBe(false);
    // turbante e dastar: a touca não cabe; o pano veste a cor da roupa e ganha a faixa
    for (const id of ['turbante', 'dastar']) {
      const t = montarAvatar({ ...AVATAR_INICIAL, cabeca: id, corCabeca: 'branco', corRoupa: 'verde', paramento: 'touca' });
      expect(t.cores.cabeca, id).toBe(item('corRoupa', 'verde')!.cor);
      expect(temForma(t, touca), id).toBe(false);
      expect(temForma(t, COBERTURAS[id].faixaTouca![0]), id).toBe(true);
    }
    // óculos de grau continuam lá, com os de proteção por cima; a máscara fica por baixo dos óculos
    const o = montarAvatar({ ...AVATAR_INICIAL, oculos: 'redondo', paramento: 'protecao' });
    const io = o.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(OCULOS.redondo[0]));
    const ip = o.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(PARAMENTOS.protecao.sobre[0]));
    expect(io).toBeGreaterThanOrEqual(0);
    expect(ip).toBeGreaterThan(io);
    const k = montarAvatar({ ...AVATAR_INICIAL, oculos: 'redondo', paramento: 'mascara' });
    expect(k.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(PARAMENTOS.mascara.sobOculos[1]))).toBeLessThan(k.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(OCULOS.redondo[0])));
  });

  it('capelo: o coque some dentro dele, e ele não é desenhado sobre turbante nem dastar', () => {
    const capelo = PARAMENTOS.capelo.sobre[0];
    expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'coque', paramento: 'capelo' }), CABELOS.coque.atras[0])).toBe(false);
    expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'coque' }), CABELOS.coque.atras[0])).toBe(true);
    expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabeca: 'hijab', paramento: 'capelo' }), capelo)).toBe(true);
    for (const id of ['turbante', 'dastar']) expect(temForma(montarAvatar({ ...AVATAR_INICIAL, cabeca: id, paramento: 'capelo' }), capelo), id).toBe(false);
    // o canudo é liberado pela mesma conquista
    expect(item('acessorio', 'canudo')?.desbloqueio).toEqual(item('paramento', 'capelo')?.desbloqueio);
  });

  it('com hijab, o que se usa no corpo vai por cima do pano e os cordões do moletom não aparecem', () => {
    const m = montarAvatar({ ...AVATAR_INICIAL, cabeca: 'hijab', roupa: 'moletom', acessorio: 'estetoscopio' });
    const pano = m.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(COBERTURAS.hijab.ombros[0]));
    const esteto = m.pessoa.findIndex((x) => JSON.stringify(x) === JSON.stringify(ACESSORIOS.estetoscopio[0]));
    expect(esteto).toBeGreaterThan(pano);
    expect(m.pessoa.some((f) => f.tag === 'cordao')).toBe(false);
    expect(montarAvatar({ ...AVATAR_INICIAL, roupa: 'moletom' }).pessoa.filter((f) => f.tag === 'cordao').length).toBe(2);
  });

  it('o rosto leva par claro em todo traço escuro, igual para todos os tons de pele', () => {
    for (const [id, r] of Object.entries(ROSTOS)) {
      const formas = [...r.olhos, ...r.boca];
      // algo claro (esclera branca, dentes ou par #ffc4b5) acompanha a tinta
      expect(formas.some((f) => f.f === '#ffffff' || f.s === '#ffc4b5'), id).toBe(true);
      expect(JSON.stringify(formas), id).not.toMatch(/"(pele|p\d)"/); // nenhuma regra por tom
    }
    const svgs = CATALOGO.pele.map((p) => avatarParaSvg({ ...AVATAR_INICIAL, pele: p.id }).replaceAll(p.cor!, 'PELE'));
    expect(new Set(svgs).size).toBe(1); // só a cor da pele muda de um tom para outro
  });

  it('modo compacto: até 40 px a pessoa é ampliada em torno da cabeça; o fundo e a moldura não', () => {
    const c: AvatarConfig = { ...AVATAR_INICIAL, moldura: 'ligante' };
    expect(avatarParaSvg(c, 'a', LADO_COMPACTO)).toContain(TRANSFORMACAO_COMPACTA);
    expect(avatarParaSvg(c, 'a', LADO_COMPACTO + 1)).not.toContain(TRANSFORMACAO_COMPACTA);
    const pequeno = render(<Avatar config={c} tamanho={32} decorativo />).container;
    const grupo = pequeno.querySelector(`g[transform="${TRANSFORMACAO_COMPACTA}"]`)!;
    expect(grupo.children.length).toBe(montarAvatar(c).pessoa.length);
    expect(grupo.parentElement!.getAttribute('clip-path')).toMatch(/^url\(#av/);
    expect(render(<Avatar config={c} tamanho={56} decorativo />).container.querySelector(`g[transform="${TRANSFORMACAO_COMPACTA}"]`)).toBeNull();
  });

  it('fundos escuros levam o próprio aro; as molduras se distinguem por cor, largura e selos grandes', () => {
    for (const id of ['ardosia', 'noite', 'faixa', 'tempo', 'liga']) expect(FUNDOS[id].at(-1), id).toMatchObject({ s: '#6b7ba4', sw: 5 });
    for (const id of ['verde-agua', 'ouro', 'ceu']) expect(FUNDOS[id].some((f) => f.s === '#6b7ba4'), id).toBe(false);
    const assinatura = (id: string) => {
      const fs = MOLDURAS[id];
      const anel = fs.find((f) => f.c && f.s && f.s !== '#0b1220' && (f.sw ?? 0) >= 6)!;
      // selos: círculos e estrelas com pelo menos 2 px a 32 px (12,5 un. de diâmetro)
      const selos = fs.filter((f) => (f.c && f.f && f.c[2] >= 6.25) || (f.d && f.f)).map((f) => `${f.c ? Math.round(f.c[0] / 20) + ',' + Math.round(f.c[1] / 20) : 'd'}:${f.f}`);
      return `${anel.s}/${anel.sw}/${selos.join('|')}`;
    };
    const ids = Object.keys(MOLDURAS);
    expect(new Set(ids.map(assinatura)).size).toBe(ids.length);
    // nada desenhado para fora do quadro
    for (const id of ids) for (const f of MOLDURAS[id]) if (f.c) expect(f.c[1] - f.c[2], id).toBeGreaterThanOrEqual(-1);
  });

  it('usa as cores escolhidas e gera SVG sem referência de cor por nome', () => {
    const svg = avatarParaSvg({ ...AVATAR_INICIAL, pele: 'p8', corCabelo: 'ruivo', corRoupa: 'vinho', barba: 'barba-cheia', roupa: 'pijama', cabeca: 'quipa', corCabeca: 'marinho' });
    expect(svg).toContain(item('pele', 'p8')!.cor);
    expect(svg).toContain(item('corCabelo', 'ruivo')!.cor);
    expect(svg).toContain(item('corRoupa', 'vinho')!.cor);
    expect(svg).toContain(item('corCabeca', 'marinho')!.cor);
    expect(svg).not.toMatch(/"(pele|cabelo|roupa|cabeca|marca)"/);
    // a marca das tranças é clara no cabelo escuro e escura no claro
    expect(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'trancas', corCabelo: 'preto' }).cores.marca).toBe('#ffffff');
    expect(montarAvatar({ ...AVATAR_INICIAL, cabelo: 'trancas', corCabelo: 'loiro' }).cores.marca).toBe('#0b1220');
  });
});

describe('regras de desbloqueio', () => {
  it('calouro só tem os itens livres; com nível e conquistas, os itens são liberados', () => {
    expect(itensLiberados(calouro)).toEqual([]);
    expect(liberado(item('roupa', 'jaleco')!, calouro)).toBe(false);
    expect(liberado(item('roupa', 'jaleco')!, { nivel: 5, conquistas: new Set() })).toBe(true);
    expect(liberado(item('roupa', 'pijama')!, { nivel: 19, conquistas: new Set() })).toBe(false);
    expect(liberado(item('paramento', 'protecao')!, { nivel: 1, conquistas: new Set(['olho-clinico']) })).toBe(true);
    const total = CATEGORIAS.reduce((s, cat) => s + CATALOGO[cat].filter((i) => i.desbloqueio).length, 0);
    expect(itensLiberados(tudo).length).toBe(total);
  });

  it('explica como liberar', () => {
    expect(comoLiberar(item('roupa', 'jaleco')!)).toBe('Nível 5 · Monitor');
    expect(comoLiberar(item('paramento', 'protecao')!)).toBe('Conquista: Olho clínico');
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
    const querendo: AvatarConfig = { ...AVATAR_INICIAL, roupa: 'jaleco-titular', moldura: 'titular', cabelo: 'trancas', acessorio: 'cracha', paramento: 'touca', cabeca: 'hijab', apoio: 'girassol' };
    const r = restringirAoLiberado(querendo, { nivel: 3, conquistas: new Set(['primeiro-passo']) });
    expect(r.roupa).toBe('camiseta');
    expect(r.moldura).toBe('nenhuma');
    expect(r.paramento).toBe('nenhum');
    expect(r.cabelo).toBe('trancas');
    expect(r.acessorio).toBe('cracha');
    expect(r.cabeca).toBe('hijab');
    expect(r.apoio).toBe('girassol');
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
    const tons = new Set(Array.from({ length: 200 }, (_, i) => sortearAvatar(calouro, criarRng(100 + i)).pele));
    expect(tons.size).toBe(CATALOGO.pele.length); // todos os tons aparecem no sorteio
  });

  it('o sorteio nunca veste cobertura de cabeça nem item de apoio, e mantém o que a pessoa escolheu', () => {
    for (let s = 1; s <= 300; s++) {
      const a = sortearAvatar(tudo, criarRng(s));
      expect(a.cabeca).toBe('nenhum');
      expect(a.apoio).toBe('nenhum');
    }
    const meu: AvatarConfig = { ...AVATAR_INICIAL, pele: 'p9', cabeca: 'dastar', corCabeca: 'marinho', apoio: 'implante-coclear', oculos: 'aro-fino' };
    for (let s = 1; s <= 50; s++) {
      const a = sortearAvatar(tudo, criarRng(s), meu);
      expect([a.pele, a.cabeca, a.corCabeca, a.apoio, a.oculos]).toEqual(['p9', 'dastar', 'marinho', 'implante-coclear', 'aro-fino']);
    }
  });

  it('o sorteio não deixa a pessoa fundida no fundo', () => {
    let fundidos = 0;
    for (let s = 1; s <= 500; s++) if (avisoDeContraste(sortearAvatar(calouro, criarRng(s)), calouro)) fundidos++;
    expect(fundidos).toBe(0);
  });

  it('avisa (sem bloquear) quando o rosto, o cabelo, a cobertura ou a roupa se confundem com o fundo', () => {
    // pele do tom 5 (#d29a6c) sobre fundo verde tem a mesma luminância
    const rosto = avisoDeContraste({ ...AVATAR_INICIAL, pele: 'p4', fundo: 'verde', corRoupa: 'vinho' }, calouro)!;
    expect(rosto.parte).toBe('o rosto');
    expect(rosto.fundo).not.toBe('verde');
    expect(avisoDeContraste({ ...AVATAR_INICIAL, pele: 'p4', fundo: rosto.fundo, corRoupa: 'vinho' }, calouro)).toBeNull();
    expect(avisoDeContraste({ ...AVATAR_INICIAL, pele: 'p2', cabelo: 'black-power', corCabelo: 'preto', fundo: 'noite' }, calouro)?.parte).toBe('o cabelo');
    expect(avisoDeContraste({ ...AVATAR_INICIAL, pele: 'p7', cabeca: 'hijab', corCabeca: 'areia', fundo: 'ouro', corRoupa: 'vinho' }, calouro)?.parte).toBe('a cobertura de cabeça');
    // com cobertura, o cabelo escondido não entra na conta
    expect(avisoDeContraste({ ...AVATAR_INICIAL, pele: 'p2', cabelo: 'black-power', corCabelo: 'preto', cabeca: 'hijab', corCabeca: 'branco', fundo: 'noite', corRoupa: 'coral' }, calouro)).toBeNull();
    // o fundo sugerido é sempre um que a pessoa já liberou
    const sugerido = melhorFundo({ ...AVATAR_INICIAL, pele: 'p4', fundo: 'verde' }, calouro);
    expect(item('fundo', sugerido)?.desbloqueio).toBeUndefined();
  });
});

describe('servidor', () => {
  it('a migração do avatar aceita exatamente as categorias do app', async () => {
    const { readFileSync } = await import('node:fs');
    const sql = readFileSync('supabase/migrations/0007_avatar.sql', 'utf8');
    const lista = /e\.key not in \(([^)]*)\)/.exec(sql)![1].split(',').map((x) => x.trim().replace(/'/g, ''));
    expect(lista.sort()).toEqual([...CATEGORIAS].sort());
    expect(sql).toContain(`jsonb_object_keys(p)) = ${CATEGORIAS.length + 1}`);
    // todo id do catálogo cabe no formato que o servidor aceita
    for (const cat of CATEGORIAS) for (const it of CATALOGO[cat]) expect(it.id).toMatch(/^[a-z0-9-]{1,24}$/);
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
    expect(CATEGORIAS.length).toBe(15);
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
    expect(rotulo).toBe('Avatar de Ana S.: cabelo black power preto, óculos redondos, jaleco, estetoscópio. Moldura Ligante.');
    expect(rotulo).not.toMatch(/tom|pele/i);
    const m = montarAvatar(c);
    expect(svg.querySelectorAll('g[clip-path] > :not(g)').length).toBe(m.fundo.length);
    expect(svg.querySelectorAll('g[clip-path] > g > *').length).toBe(m.pessoa.length);
    expect(svg.querySelectorAll('path, circle, ellipse, rect').length).toBe(m.fundo.length + m.pessoa.length + m.fora.length + 1); // + círculo do recorte
    expect(svg.innerHTML).toContain(item('pele', 'p7')!.cor);
  });

  it('o texto alternativo compõe frase para todo cabelo e toda cor', () => {
    const d = (c: Partial<AvatarConfig>, nome = '') => descricaoAvatar({ ...AVATAR_INICIAL, ...c }, nome);
    expect(d({ cabelo: 'trancas', corCabelo: 'preto', roupa: 'moletom' }, 'Dandara Reis')).toBe('Avatar de Dandara Reis: tranças pretas, moletom da liga.');
    expect(d({ cabelo: 'dreads', corCabelo: 'castanho' })).toBe('Avatar: dreads castanhos, camiseta.');
    expect(d({ cabelo: 'calvo-lateral', corCabelo: 'grisalho', barba: 'bigode', oculos: 'aro-fino', moldura: 'preceptor' })).toBe('Avatar: calvície com laterais grisalhas, bigode, óculos de aro fino, camiseta. Moldura Preceptoria.');
    expect(d({ cabelo: 'lateral-raspada', corCabelo: 'violeta' })).toBe('Avatar: cabelo violeta com a lateral raspada, camiseta.');
    expect(d({ cabelo: 'coque', corCabelo: 'castanho-escuro' })).toBe('Avatar: coque castanho-escuro, camiseta.');
    expect(d({ cabelo: 'careca', barba: 'barba-cheia' })).toBe('Avatar: sem cabelo, barba cheia, camiseta.');
    expect(d({ cabeca: 'hijab', corCabeca: 'vinho', roupa: 'jaleco', moldura: 'monitor' }, 'Samira Haddad')).toBe('Avatar de Samira Haddad: hijab vinho, jaleco. Moldura Monitoria.');
    expect(d({ cabeca: 'quipa', corCabeca: 'preto', cabelo: 'curto', corCabelo: 'castanho' })).toBe('Avatar: cabelo curto castanho, quipá preto, camiseta.');
    expect(d({ apoio: 'aparelho-auditivo-2', paramento: 'touca', cabelo: 'liso-longo' })).toBe('Avatar: aparelhos auditivos, camiseta, touca cirúrgica.');
    expect(d({ cabeca: 'hijab', corCabeca: 'preto', paramento: 'touca', apoio: 'girassol' })).toBe('Avatar: hijab preto, cordão de girassol, camiseta, touca cirúrgica.');
    // nenhum cabelo deixa marcador ou espaço sobrando, em nenhuma cor
    for (const h of CATALOGO.cabelo) for (const cor of CATALOGO.corCabelo) expect(d({ cabelo: h.id, corCabelo: cor.id }), `${h.id}/${cor.id}`).not.toMatch(/[{}]|  | ,| \./);
    // nunca cita a pele
    for (const p of CATALOGO.pele) expect(d({ pele: p.id })).toBe(d({}));
  });

  it('sem avatar montado, mostra a silhueta padrão com a cor do nome (sem pele nem cabelo)', () => {
    const { container } = render(<Avatar nome="Bruno C." />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('Avatar padrão de Bruno C..');
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
