// Regras dos jogos do microscópio: partes aninhadas no "Identifique na lâmina" e distratores do "Qual é o tecido?".
import { describe, expect, it } from 'vitest';
import { LAMINAS } from '../src/content/index.ts';
import { LAMINAS_RENDER, type LaminaRender } from '../src/modules/histologia/laminas/index.ts';
import { contracaoDe, distratoresPossiveis, montarRodadas, partesDe, recipientesDe, toqueAceito } from '../src/modules/histologia/regras.ts';

describe('contem (estruturas aninhadas)', () => {
  const comContem = Object.entries(LAMINAS_RENDER).filter(([, r]) => r.contem);

  it('toda chave e todo valor de contem estão em partes', () => {
    expect(comContem.length).toBeGreaterThan(0);
    for (const [id, r] of comContem) {
      const partes = new Set(r.partes);
      for (const [k, vs] of Object.entries(r.contem!)) {
        expect(partes.has(k), `${id}: chave ${k}`).toBe(true);
        expect(vs.length, `${id}: ${k} sem partes`).toBeGreaterThan(0);
        for (const v of vs) expect(partes.has(v), `${id}: ${k} → ${v}`).toBe(true);
      }
    }
  });

  it('não há ciclo (nenhuma estrutura contém a si mesma, direta ou indiretamente)', () => {
    for (const [id, r] of comContem) {
      for (const k of Object.keys(r.contem!)) {
        // busca em profundidade a partir de k: voltar a k seria ciclo
        const pilha = [...r.contem![k]];
        const vistos = new Set<string>();
        while (pilha.length) {
          const p = pilha.pop()!;
          expect(p, `${id}: ciclo em ${k}`).not.toBe(k);
          if (vistos.has(p)) continue;
          vistos.add(p);
          pilha.push(...(r.contem![p] ?? []));
        }
      }
    }
  });

  it('toda estrutura que contém outra tem nome no conteúdo, e o cartão usa a contração certa', () => {
    for (const [id, r] of comContem) {
      const lamina = LAMINAS.find((l) => l.id === id);
      if (!lamina) continue; // desenho sem texto (grupo em produção)
      for (const k of Object.keys(r.contem!)) {
        const nome = lamina.estruturas.find((e) => e.id === k)?.nome;
        expect(nome, `${id}: ${k}`).toBeDefined();
        expect(contracaoDe(nome!)).toMatch(/^(do|da|dos|das) \S/);
      }
    }
    expect(contracaoDe('Folículo linfoide')).toBe('do folículo linfoide');
    expect(contracaoDe('Túnica íntima')).toBe('da túnica íntima');
    expect(contracaoDe('Células cilíndricas ciliadas')).toBe('das células cilíndricas ciliadas');
    expect(contracaoDe('Lamelas intersticiais')).toBe('das lamelas intersticiais');
    expect(contracaoDe('Enterócitos (epitélio simples cilíndrico)')).toBe('dos enterócitos (epitélio simples cilíndrico)');
    expect(contracaoDe('Ósteon (sistema de Havers)')).toBe('do ósteon (sistema de Havers)');
  });
});

describe('toqueAceito', () => {
  const linfonodo = LAMINAS_RENDER.linfonodo;
  const aorta = LAMINAS_RENDER.aorta;
  const timo = LAMINAS_RENDER.timo;
  const cartilagem = LAMINAS_RENDER['cartilagem-hialina'];

  it('o próprio alvo vale; sem contem, só ele', () => {
    expect(toqueAceito(linfonodo, 'paracortex', 'paracortex')).toBe(true);
    const semContem: LaminaRender = { desenhar: () => null, partes: ['a', 'b'] };
    expect(toqueAceito(semContem, 'a', 'b')).toBe(false);
    expect(toqueAceito(undefined, 'a', 'a')).toBe(true);
  });

  it('parte contida vale quando o alvo é o todo; o inverso continua erro', () => {
    expect(toqueAceito(linfonodo, 'foliculo-linfoide', 'centro-germinativo')).toBe(true);
    expect(toqueAceito(linfonodo, 'centro-germinativo', 'foliculo-linfoide')).toBe(false);
    expect(toqueAceito(linfonodo, 'foliculo-linfoide', 'paracortex')).toBe(false);
    expect(toqueAceito(aorta, 'tunica-intima', 'endotelio')).toBe(true);
    expect(toqueAceito(aorta, 'endotelio', 'tunica-intima')).toBe(false);
    expect(toqueAceito(aorta, 'tunica-media', 'fibras-elasticas')).toBe(true);
    expect(toqueAceito(timo, 'medula-timica', 'corpusculo-de-hassall')).toBe(true);
    expect(toqueAceito(LAMINAS_RENDER['pele-fina'], 'foliculo-piloso', 'papila-do-pelo')).toBe(true);
    // com a pilha do Visor: parte sobre o seu recipiente
    expect(toqueAceito(linfonodo, 'foliculo-linfoide', 'centro-germinativo', ['centro-germinativo', 'foliculo-linfoide', 'paracortex'])).toBe(true);
  });

  it('é transitivo (condrócito dentro da lacuna dentro do grupo isógeno)', () => {
    expect(partesDe(cartilagem, 'grupo-isogeno')).toEqual(new Set(['lacuna', 'condrocito']));
    expect(recipientesDe(cartilagem, 'condrocito')).toEqual(new Set(['lacuna', 'grupo-isogeno']));
    expect(toqueAceito(cartilagem, 'grupo-isogeno', 'condrocito', ['condrocito', 'lacuna', 'grupo-isogeno', 'matriz-territorial'])).toBe(true);
    // condrócito jovem sob o pericôndrio, fora de grupo: a lacuna está sob o toque, o grupo não
    expect(toqueAceito(cartilagem, 'grupo-isogeno', 'condrocito', ['condrocito', 'lacuna', 'matriz-interterritorial'])).toBe(false);
    expect(toqueAceito(cartilagem, 'lacuna', 'condrocito', ['condrocito', 'lacuna', 'matriz-interterritorial'])).toBe(true);
  });

  it('parte em mais de um recipiente: decide a posição do toque', () => {
    // célula epitelial reticular na medula (a medula é desenhada sobre o polígono do lóbulo/córtex)
    const naMedula = ['celula-epitelial-reticular', 'medula-timica', 'cortex-timico'];
    expect(toqueAceito(timo, 'medula-timica', 'celula-epitelial-reticular', naMedula)).toBe(true);
    expect(toqueAceito(timo, 'cortex-timico', 'celula-epitelial-reticular', naMedula)).toBe(false);
    const noCortex = ['celula-epitelial-reticular', 'cortex-timico'];
    expect(toqueAceito(timo, 'cortex-timico', 'celula-epitelial-reticular', noCortex)).toBe(true);
    expect(toqueAceito(timo, 'medula-timica', 'celula-epitelial-reticular', noCortex)).toBe(false);
    // vasa vasorum: na média ou na adventícia
    const naMedia = ['vasa-vasorum', 'fibras-elasticas', 'tunica-media'];
    expect(toqueAceito(aorta, 'tunica-media', 'vasa-vasorum', naMedia)).toBe(true);
    expect(toqueAceito(aorta, 'tunica-adventicia', 'vasa-vasorum', naMedia)).toBe(false);
    // osteócito do ósteon (as lamelas intersticiais são o fundo de todo o corte)
    const osso = LAMINAS_RENDER['osso-compacto'];
    const noOsteon = ['osteocito', 'canaliculos', 'osteon', 'lamelas-intersticiais'];
    expect(toqueAceito(osso, 'osteon', 'osteocito', noOsteon)).toBe(true);
    expect(toqueAceito(osso, 'lamelas-intersticiais', 'osteocito', noOsteon)).toBe(false);
    expect(toqueAceito(osso, 'lamelas-intersticiais', 'osteocito', ['osteocito', 'lamelas-intersticiais'])).toBe(true);
  });

  it('parte de limite tocada fora do recipiente vale só se a declaração não for ambígua', () => {
    // endotélio tocado do lado da luz: só pertence à íntima
    expect(toqueAceito(aorta, 'tunica-intima', 'endotelio', ['endotelio', 'lumen'])).toBe(true);
    // célula epitelial reticular sem recipiente sob o toque: ambígua (córtex ou medula)
    expect(toqueAceito(timo, 'cortex-timico', 'celula-epitelial-reticular', ['celula-epitelial-reticular'])).toBe(false);
  });
});

describe('distratores do "Qual é o tecido?"', () => {
  const ids = new Set(Object.keys(LAMINAS_RENDER));
  const comExclusao = Object.entries(LAMINAS_RENDER).filter(([, r]) => r.distratoresExcluidos);

  it('todo id de distratoresExcluidos existe no registro (e no conteúdo) e não é a própria lâmina', () => {
    expect(comExclusao.length).toBeGreaterThan(0);
    for (const [id, r] of comExclusao)
      for (const x of r.distratoresExcluidos!) {
        expect(ids.has(x), `${id}: ${x}`).toBe(true);
        expect(LAMINAS.some((l) => l.id === x), `${id}: ${x} sem texto`).toBe(true);
        expect(x, id).not.toBe(id);
      }
  });

  it('sobram sempre pelo menos 3 distratores', () => {
    for (const l of LAMINAS) expect(distratoresPossiveis(l, LAMINAS, LAMINAS_RENDER).length, l.id).toBeGreaterThanOrEqual(3);
  });

  it('a escolha respeita as exclusões (e nunca repete o tecido da resposta)', () => {
    const exemplo: Record<string, LaminaRender> = {
      a: { desenhar: () => null, partes: [], distratoresExcluidos: ['b', 'c'] },
    };
    const lams = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, tecido: `tecido ${id}` }));
    expect(distratoresPossiveis(lams[0], lams, exemplo).map((x) => x.id)).toEqual(['d', 'e', 'f']);
    expect(distratoresPossiveis(lams[0], [...lams, { id: 'g', tecido: 'tecido a' }], exemplo).map((x) => x.id)).toEqual(['d', 'e', 'f']);

    let vistas = 0;
    for (let semente = 1; semente <= 400; semente++) {
      for (const r of montarRodadas(semente, LAMINAS, LAMINAS_RENDER)) {
        const certa = LAMINAS.find((l) => l.id === r.laminaId)!;
        const excl = new Set(LAMINAS_RENDER[r.laminaId]?.distratoresExcluidos ?? []);
        expect(r.opcoes).toHaveLength(4);
        expect(new Set(r.opcoes).size).toBe(4);
        expect(r.opcoes).toContain(r.laminaId);
        for (const o of r.opcoes.filter((o) => o !== r.laminaId)) {
          expect(excl.has(o), `${r.laminaId}: ${o}`).toBe(false);
          expect(LAMINAS.find((l) => l.id === o)!.tecido).not.toBe(certa.tecido);
        }
        if (excl.size) vistas++;
      }
    }
    expect(vistas).toBeGreaterThan(100); // lâminas com exclusão saíram muitas vezes
  });

  it('o centro sorteado fica na área diagnóstica da lâmina', () => {
    for (const r of montarRodadas(7, LAMINAS, LAMINAS_RENDER, LAMINAS.length)) {
      const a = LAMINAS_RENDER[r.laminaId].areaDiagnostica;
      if (!a) continue;
      expect(r.centro.x >= a[0] && r.centro.x <= a[2] && r.centro.y >= a[1] && r.centro.y <= a[3], r.laminaId).toBe(true);
    }
  });
});
