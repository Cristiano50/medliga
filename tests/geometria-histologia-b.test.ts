// Modelos 3D da histologia, grupo B: relações espaciais (lóbulo hepático, sarcômero, junções celulares),
// orçamento de desenho por nível e toque de todas as partes.
import { afterAll, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import * as THREE from 'three';
import { _roots, act, createRoot, extend } from '@react-three/fiber';
import {
  ALTURA_CANALICULO_SETOR,
  ALTURA_FATIA,
  LOBULO,
  TOPO_TERCEIRA_CAMADA,
  alturasCanaliculos,
  barrasMoldura,
  cantosCelula,
  convexosSeCruzam,
  dentroHexagono,
  distanciaPoligono,
  distanciaPontoSegmento,
  distanciaSegmentoPoligono,
  estacoesSinusoides,
  fragmentos,
  geometriaLobulo,
  hepatocitos,
  hepatocitosTranslucidos,
  noSetorTranslucido,
  nucleosTranslucidos,
  tracosMoldura,
  verticesHexagono,
  type Ponto2,
  type Ponto3,
} from '../src/modules/histologia/modelos3d/geometria-lobulo.ts';
import { RAIO_ZONA_NUA, SARCOMERO, bandas, cabecasMiosina, comprimentoSarcomero, finosVizinhos, redeFilamentos } from '../src/modules/histologia/modelos3d/geometria-sarcomero.ts';
import {
  JUNCOES,
  RESSALTO_COMUNICANTE,
  bastonetesCaderina,
  centrosCelulas,
  centrosNucleos,
  conexons,
  geometriaFaixa,
  geometriaPlacaAdesao,
  microvilosidades,
  placasDesmossomo,
  placasHemidesmossomo,
  pontosDesmossomo,
  trajetosQueratina,
} from '../src/modules/histologia/modelos3d/geometria-juncoes.ts';
import { MODELOS_HISTO_B, legendaContracao } from '../src/modules/histologia/modelos3d/grupo-b.tsx';
import { resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { forcarNivel, NIVEIS, PARAMETROS, type NivelQualidade } from '../src/modules/tres3d/qualidade.ts';
import { contarCena, prepararMalhas } from '../src/modules/tres3d/refinar.ts';
import { excessos } from '../src/modules/tres3d/orcamento.ts';
import modelosB from '../content/histologia/modelos3d-b.json';

const GRAU = Math.PI / 180;
const angulo = (p: [number, number]) => Math.atan2(p[1], p[0]);
const difAngulo = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

describe('lóbulo hepático clássico', () => {
  const g = geometriaLobulo();
  const pegadas = g.placas.flatMap((p) => p.celulas.map(([a, b]) => ({ placa: p, poligono: cantosCelula(p.angulo, a, b) })));

  it('hexágono regular centrado na veia centrolobular, com uma tríade portal em cada vértice', () => {
    const v = verticesHexagono();
    const centro = v.reduce((s, p) => [s[0] + p[0] / 6, s[1] + p[1] / 6], [0, 0]);
    expect(Math.hypot(...centro)).toBeLessThan(1e-12);
    for (let k = 0; k < 6; k++) {
      expect(Math.hypot(...v[k])).toBeCloseTo(LOBULO.raioHex, 12);
      // hexágono regular: lado = raio
      const w = v[(k + 1) % 6];
      expect(Math.hypot(w[0] - v[k][0], w[1] - v[k][1])).toBeCloseTo(LOBULO.raioHex, 12);
    }
    expect(g.triades).toHaveLength(6);
    g.triades.forEach((t, k) => {
      expect(t.vertice[0]).toBeCloseTo(v[k][0], 12);
      expect(t.vertice[1]).toBeCloseTo(v[k][1], 12);
      expect(difAngulo(angulo(t.vertice), k * 60 * GRAU)).toBeLessThan(1e-9);
      const vasos = [t.veia, t.arteria, t.ducto];
      // os três elementos dentro do conjuntivo do espaço porta, sem se sobrepor
      for (const vaso of vasos) expect(Math.hypot(vaso.centro[0] - t.vertice[0], vaso.centro[1] - t.vertice[1]) + vaso.raioExterno).toBeLessThan(LOBULO.raioPorta - 0.02);
      for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 3; j++) {
          const [a, b] = [vasos[i], vasos[j]];
          expect(Math.hypot(a.centro[0] - b.centro[0], a.centro[1] - b.centro[1])).toBeGreaterThan(a.raioExterno + b.raioExterno);
        }
      }
      // ramo portal: o maior, de parede fina; artéria: parede espessa em relação à luz
      expect(t.veia.raioExterno).toBeGreaterThan(t.arteria.raioExterno);
      expect(t.veia.raioExterno).toBeGreaterThan(t.ducto.raioExterno);
      const parede = (x: typeof t.veia) => (x.raioExterno - x.raioInterno) / x.raioInterno;
      expect(parede(t.arteria)).toBeGreaterThan(1);
      expect(parede(t.veia)).toBeLessThan(0.2);
    });
  });

  it('moldura do lóbulo: seis barras nas arestas, de um espaço porta ao seguinte, sem entrar no conjuntivo', () => {
    const v = verticesHexagono();
    const barras = barrasMoldura();
    expect(barras).toHaveLength(6);
    barras.forEach(([a, b], k) => {
      // sobre a aresta k (entre os vértices k e k+1): alinhada e centrada
      const [p, q] = [v[k], v[(k + 1) % 6]];
      const meio = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      expect((a[0] + b[0]) / 2).toBeCloseTo(meio[0], 9);
      expect((a[1] + b[1]) / 2).toBeCloseTo(meio[1], 9);
      const cruz = (b[0] - a[0]) * (q[1] - p[1]) - (b[1] - a[1]) * (q[0] - p[0]);
      expect(Math.abs(cruz)).toBeLessThan(1e-9);
      // cada ponta para logo antes do conjuntivo do espaço porta mais próximo
      for (const ponta of [a, b]) {
        const d = Math.min(...v.map((w) => Math.hypot(ponta[0] - w[0], ponta[1] - w[1])));
        expect(d).toBeGreaterThan(LOBULO.raioPorta);
        expect(d).toBeLessThan(LOBULO.raioPorta + 0.03);
      }
    });
    // linha tracejada: os traços ocupam a barra inteira, com vãos entre eles
    const tracos = tracosMoldura();
    const total = LOBULO.raioHex - 2 * (LOBULO.raioPorta + 0.012);
    expect(tracos.length).toBeGreaterThanOrEqual(5);
    expect(tracos[0].centro - tracos[0].comprimento / 2).toBeCloseTo(-total / 2, 9);
    expect(tracos[tracos.length - 1].centro + tracos[0].comprimento / 2).toBeCloseTo(total / 2, 9);
    for (let i = 1; i < tracos.length; i++) expect(tracos[i].centro - tracos[i - 1].centro).toBeGreaterThan(tracos[i].comprimento * 1.2);
  });

  it('placas de uma célula de espessura, radiais a partir da veia, com forquilhas e passagens', () => {
    expect(g.placas.filter((p) => p.zona === 'A')).toHaveLength(6);
    expect(g.placas.filter((p) => p.zona === 'B')).toHaveLength(12);
    expect(g.placas.filter((p) => p.zona === 'C')).toHaveLength(24);
    expect(hepatocitos()).toHaveLength(pegadas.length * LOBULO.camadas);
    for (const { poligono } of pegadas) {
      for (const c of poligono) {
        expect(dentroHexagono(c)).toBe(true);
        expect(Math.hypot(...c)).toBeGreaterThan(LOBULO.raioVeia);
      }
      for (const v of verticesHexagono()) expect(distanciaPoligono(v, poligono)).toBeGreaterThan(LOBULO.raioPorta);
    }
    for (let i = 0; i < pegadas.length; i++) {
      for (let j = i + 1; j < pegadas.length; j++) expect(convexosSeCruzam(pegadas[i].poligono, pegadas[j].poligono, 1e-9), `${i} × ${j}`).toBe(false);
    }
    // Zona A encosta na veia; cada placa B/C começa encostada (forquilha) numa célula da placa-mãe.
    for (const p of g.placas.filter((x) => x.zona === 'A')) {
      expect(p.celulas[0][0] - LOBULO.raioVeia).toBeLessThanOrEqual(LOBULO.folga + 1e-9);
      expect(p.passagem).toBeNull();
      expect(fragmentos(p)).toHaveLength(1);
    }
    for (const p of g.placas.filter((x) => x.mae !== null)) {
      const mae = g.placas[p.mae!];
      const primeira = cantosCelula(p.angulo, ...p.celulas[0]);
      const distancia = Math.min(...mae.celulas.map(([a, b]) => Math.min(...cantosCelula(mae.angulo, a, b).map((c) => distanciaPoligono(c, primeira)))));
      expect(distancia, `placa ${p.indice}`).toBeLessThan(0.02);
      // numa das duas placas de cada forquilha, logo depois dela, uma passagem do tamanho de uma célula
      if (p.passagem === null) { expect(fragmentos(p)).toHaveLength(1); continue; }
      const meio = p.passagem;
      const [ini, fim] = [meio - LOBULO.comprimento / 2, meio + LOBULO.comprimento / 2];
      expect(p.celulas.every(([a, b]) => b <= ini + 1e-9 || a >= fim - 1e-9)).toBe(true);
      expect(p.celulas.some(([, b]) => b <= ini)).toBe(true);
      expect(p.celulas.some(([a]) => a >= fim)).toBe(true);
      expect(fragmentos(p)).toHaveLength(2);
    }
  });

  it('uma passagem por forquilha: cada placa-mãe tem uma filha com passagem e outra contínua', () => {
    for (const mae of g.placas.filter((p) => p.zona !== 'C')) {
      const filhas = g.placas.filter((p) => p.mae === mae.indice);
      expect(filhas).toHaveLength(2);
      expect(filhas.filter((p) => p.passagem !== null)).toHaveLength(1);
    }
  });

  it('terceira camada translúcida só no setor da frente, com núcleos dentro das células', () => {
    const translucidos = hepatocitosTranslucidos();
    const placasDoSetor = g.placas.filter(noSetorTranslucido);
    expect(placasDoSetor.length).toBeGreaterThan(0);
    expect(placasDoSetor.length).toBeLessThan(g.placas.length / 4);
    expect(translucidos).toHaveLength(placasDoSetor.reduce((n, p) => n + p.celulas.length, 0));
    for (const h of translucidos) {
      expect(noSetorTranslucido(g.placas[h.placa])).toBe(true);
      expect(h.centro[1] - LOBULO.altura / 2).toBeGreaterThan(ALTURA_FATIA / 2);
      expect(h.centro[1] + LOBULO.altura / 2).toBeCloseTo(TOPO_TERCEIRA_CAMADA, 9);
    }
    const nucleos = nucleosTranslucidos();
    // um núcleo por célula e algumas células binucleadas
    expect(nucleos.length).toBeGreaterThan(translucidos.length);
    expect(nucleos.length).toBeLessThanOrEqual(translucidos.length + 4);
    // cada núcleo inteiro dentro de uma célula translúcida (ao longo da placa, de lado e na altura)
    for (const n of nucleos) {
      const dentro = translucidos.some((h) => {
        const [dx, dz] = [n[0] - h.centro[0], n[2] - h.centro[2]];
        const ao = dx * Math.cos(h.angulo) + dz * Math.sin(h.angulo);
        const lado = -dx * Math.sin(h.angulo) + dz * Math.cos(h.angulo);
        const r = LOBULO.raioNucleo;
        return Math.abs(ao) <= LOBULO.comprimento / 2 - r + 1e-9 && Math.abs(lado) <= LOBULO.espessura / 2 - r + 1e-9 && Math.abs(n[1] - h.centro[1]) <= LOBULO.altura / 2 - r;
      });
      expect(dentro).toBe(true);
    }
  });

  const xz = (p: Ponto3): Ponto2 => [p[0], p[2]];
  const chave = (p: Ponto3) => `${Math.round(p[0] * 1e5)},${Math.round(p[2] * 1e5)}`;

  it('sinusoides de calibre quase constante, no plano médio, sem atravessar hepatócitos', () => {
    const raios = g.sinusoides.map((t) => t.raio);
    // luz ≈ 0,04 a 0,05 em toda a rede (sem funil); o tronco que chega à veia é o mais largo
    expect(Math.min(...raios)).toBeGreaterThanOrEqual(0.04);
    expect(Math.max(...raios)).toBeLessThanOrEqual(0.05);
    for (const t of g.sinusoides) expect(t.raio).toBe(t.tipo === 'tronco' ? LOBULO.luzTronco : LOBULO.luz);
    expect(LOBULO.luzTronco).toBeGreaterThan(LOBULO.luz);
    const contagem = (tipo: string) => g.sinusoides.filter((t) => t.tipo === tipo).length;
    expect(contagem('tronco')).toBe(6);
    expect(contagem('haste')).toBeGreaterThanOrEqual(24);
    expect(contagem('passagem')).toBe(18);
    expect(contagem('ponte')).toBe(36);
    for (const t of g.sinusoides) {
      expect(t.a[1]).toBe(0);
      expect(t.b[1]).toBe(0);
      for (const { poligono } of pegadas) expect(distanciaSegmentoPoligono(xz(t.a), xz(t.b), poligono), `${t.tipo}`).toBeGreaterThanOrEqual(t.raio + LOBULO.margem);
      for (const v of verticesHexagono()) expect(distanciaPontoSegmento(v, xz(t.a), xz(t.b))).toBeGreaterThanOrEqual(LOBULO.raioPorta);
      if (t.tipo !== 'tronco') for (const p of [t.a, t.b]) expect(dentroHexagono(xz(p), t.raio * 0.5)).toBe(true);
    }
  });

  it('onde o vão alarga há dois tubos junto das placas, unidos por pontes; passagens atravessam as placas', () => {
    const e = estacoesSinusoides(g.placas);
    const pares = new Set(g.sinusoides.filter((t) => t.tipo === 'par').flatMap((t) => [chave(t.a), chave(t.b)]));
    for (const t of g.sinusoides.filter((x) => x.tipo === 'ponte')) {
      // a ponte liga os dois tubos do par, simétricos em relação ao eixo do vão (múltiplo de 15°)
      expect(pares.has(chave(t.a))).toBe(true);
      expect(pares.has(chave(t.b))).toBe(true);
      const meio: Ponto2 = [(t.a[0] + t.b[0]) / 2, (t.a[2] + t.b[2]) / 2];
      const eixo = Math.atan2(meio[1], meio[0]) / (15 * GRAU);
      expect(Math.abs(eixo - Math.round(eixo))).toBeLessThan(1e-6);
      // cada ponta da ponte fica junto de uma placa: a célula mais próxima está a menos de um raio de tubo
      for (const p of [t.a, t.b]) {
        const d = Math.min(...pegadas.map(({ poligono }) => distanciaPoligono(xz(p), poligono)));
        expect(d - t.raio).toBeLessThan(LOBULO.luz);
        expect(d - t.raio).toBeGreaterThanOrEqual(LOBULO.margem);
      }
      // o par só existe onde cabem dois tubos lado a lado
      expect(Math.hypot(t.a[0] - t.b[0], t.a[2] - t.b[2])).toBeGreaterThan(2 * LOBULO.luz);
    }
    // passagens: cruzam a placa pela falta de uma célula, perpendiculares a ela, e ligam os nós dos dois vãos
    const passagens = g.sinusoides.filter((t) => t.tipo === 'passagem');
    const filhas = g.placas.filter((p) => p.passagem !== null);
    expect(passagens).toHaveLength(filhas.length);
    for (const p of filhas) {
      const centro: Ponto2 = [Math.cos(p.angulo) * p.passagem!, Math.sin(p.angulo) * p.passagem!];
      const t = passagens.find((x) => Math.hypot((x.a[0] + x.b[0]) / 2 - centro[0], (x.a[2] + x.b[2]) / 2 - centro[1]) < 1e-9);
      expect(t, `placa ${p.indice}`).toBeTruthy();
      const d: Ponto2 = [t!.b[0] - t!.a[0], t!.b[2] - t!.a[2]];
      expect(Math.abs(d[0] * Math.cos(p.angulo) + d[1] * Math.sin(p.angulo))).toBeLessThan(1e-9);
      // as duas pontas caem nos nós dos vãos vizinhos (a mesma distância do centro)
      const no = p.zona === 'B' ? e.noB : e.noC;
      for (const q of [t!.a, t!.b]) expect(Math.hypot(q[0], q[2])).toBeCloseTo(no, 9);
    }
  });

  it('a rede é contínua: todo sinusoide chega à veia centrolobular por um orifício e a uma ponta periférica', () => {
    // seis troncos entram na luz da veia pelos orifícios da parede, nos eixos dos vértices
    const troncos = g.sinusoides.filter((t) => t.tipo === 'tronco');
    expect(g.orificios).toHaveLength(6);
    expect(LOBULO.raioOrificio).toBeGreaterThan(LOBULO.luzTronco);
    troncos.forEach((t) => {
      const [dentro, fora] = Math.hypot(t.a[0], t.a[2]) < Math.hypot(t.b[0], t.b[2]) ? [t.a, t.b] : [t.b, t.a];
      expect(Math.hypot(dentro[0], dentro[2])).toBeLessThan(LOBULO.raioVeia - LOBULO.paredeVeia);
      expect(Math.hypot(fora[0], fora[2])).toBeGreaterThan(LOBULO.raioVeia);
      const ang = Math.atan2(fora[2], fora[0]);
      expect(g.orificios.some((o) => difAngulo(o, ang) < 1e-9)).toBe(true);
      expect(g.triades.some((tr) => difAngulo(tr.angulo, ang) < 1e-9)).toBe(true);
    });
    // grafo pelos extremos dos trechos: a partir das bocas na veia, alcança-se a rede inteira
    const vizinhos = new Map<string, Set<string>>();
    const liga = (a: string, b: string) => { (vizinhos.get(a) ?? vizinhos.set(a, new Set()).get(a)!).add(b); (vizinhos.get(b) ?? vizinhos.set(b, new Set()).get(b)!).add(a); };
    for (const t of g.sinusoides) liga(chave(t.a), chave(t.b));
    const visto = new Set<string>();
    const fila = troncos.map((t) => (Math.hypot(t.a[0], t.a[2]) < Math.hypot(t.b[0], t.b[2]) ? chave(t.a) : chave(t.b)));
    while (fila.length) {
      const n = fila.pop()!;
      if (visto.has(n)) continue;
      visto.add(n);
      for (const m of vizinhos.get(n) ?? []) fila.push(m);
    }
    expect(visto.size).toBe(vizinhos.size);
    // pontas periféricas: duas por vão da zona C (24 vãos), todas ligadas à veia
    expect(g.pontas).toHaveLength(48);
    for (const p of g.pontas) {
      expect(visto.has(chave(p))).toBe(true);
      expect(vizinhos.get(chave(p))!.size).toBe(1);
      expect(Math.hypot(p[0], p[2])).toBeGreaterThan(1.2);
    }
    // não há fundo cego: fora as bocas na veia e as pontas periféricas, todo nó tem ao menos dois trechos
    const pontas = new Set(g.pontas.map(chave));
    const bocas = new Set(troncos.map((t) => (Math.hypot(t.a[0], t.a[2]) < Math.hypot(t.b[0], t.b[2]) ? chave(t.a) : chave(t.b))));
    for (const [n, v] of vizinhos) if (!pontas.has(n) && !bocas.has(n)) expect(v.size, n).toBeGreaterThanOrEqual(2);
  });

  it('ramos terminais da veia porta e da artéria saem do espaço porta pelas arestas e abrem nos sinusoides', () => {
    const apotema = LOBULO.raioHex * Math.cos(30 * GRAU);
    for (const [ramos, vaso, raio, raioEntrada, y] of [
      [g.porta, 'veia', LOBULO.ramoPorta, LOBULO.entradaPorta, LOBULO.alturaRamoPorta],
      [g.arteria, 'arteria', LOBULO.ramoArteria, LOBULO.entradaArteria, LOBULO.alturaRamoArteria],
    ] as const) {
      // de cada tríade, um ramo para cada aresta vizinha: sai do vaso e corre por fora da aresta
      expect(ramos.ramos).toHaveLength(24);
      for (let i = 0; i < ramos.ramos.length; i += 2) {
        const [saida, aresta] = [ramos.ramos[i], ramos.ramos[i + 1]];
        const t = g.triades[Math.floor(i / 4)];
        expect(Math.hypot(saida.a[0] - t[vaso].centro[0], saida.a[2] - t[vaso].centro[1])).toBeLessThan(1e-9);
        expect(chave(saida.b)).toBe(chave(aresta.a));
        // dentro do conjuntivo na saída; depois, paralelo à aresta, a `afastamentoRamo` por fora dela
        expect(Math.hypot(aresta.a[0] - t.vertice[0], aresta.a[2] - t.vertice[1])).toBeLessThan(LOBULO.raioPorta);
        const normalDaAresta = [0, 1, 2, 3, 4, 5].map((k) => (30 + 60 * k) * GRAU).find((m) => Math.abs(aresta.a[0] * Math.cos(m) + aresta.a[2] * Math.sin(m) - apotema - LOBULO.afastamentoRamo) < 1e-9);
        expect(normalDaAresta).toBeDefined();
        expect(aresta.b[0] * Math.cos(normalDaAresta!) + aresta.b[2] * Math.sin(normalDaAresta!)).toBeCloseTo(apotema + LOBULO.afastamentoRamo, 9);
        for (const s of [saida, aresta]) for (const p of [s.a, s.b]) expect(p[1]).toBe(y);
      }
      // uma entrada por ponta de sinusoide: começa num ramo e termina na ponta
      expect(ramos.entradas).toHaveLength(g.pontas.length);
      for (const p of g.pontas) {
        const minhas = ramos.entradas.filter((en) => Math.hypot(en.b[0] - p[0], en.b[2] - p[2]) < 1e-9);
        expect(minhas).toHaveLength(1);
        const en = minhas[0];
        expect(Math.abs(en.b[1])).toBeLessThan(LOBULO.luz);
        expect(Math.min(...ramos.ramos.map((r) => distanciaPontoSegmento(xz(en.a), xz(r.a), xz(r.b))))).toBeLessThan(1e-9);
        expect(en.a[1]).toBe(y);
      }
      // nada disso atravessa hepatócitos
      for (const s of [...ramos.ramos, ...ramos.entradas]) for (const { poligono } of pegadas) expect(distanciaSegmentoPoligono(xz(s.a), xz(s.b), poligono)).toBeGreaterThan(raio);
      expect(raioEntrada).toBeLessThan(raio);
    }
    // vênula portal mais calibrosa que a arteríola, em alturas diferentes (não se cruzam)
    expect(LOBULO.ramoPorta).toBeGreaterThan(LOBULO.ramoArteria);
    expect(LOBULO.alturaRamoPorta - LOBULO.ramoPorta).toBeGreaterThan(LOBULO.alturaRamoArteria + LOBULO.ramoArteria);
  });

  it('células de Kupffer dentro da luz dos sinusoides', () => {
    expect(g.kupffer.length).toBeGreaterThanOrEqual(12);
    const [ax, tr] = LOBULO.kupffer;
    for (const k of g.kupffer) {
      const hastes = g.sinusoides.filter((t) => t.tipo === 'haste' && distanciaPontoSegmento(xz(k.centro), xz(t.a), xz(t.b)) < 1e-9);
      expect(hastes.length).toBeGreaterThanOrEqual(1);
      const t = hastes[0];
      // inteira dentro do tubo: de lado e ao longo dele
      expect(Math.abs(k.centro[1]) + tr).toBeLessThanOrEqual(t.raio);
      for (const p of [t.a, t.b]) expect(Math.hypot(k.centro[0] - p[0], k.centro[2] - p[2])).toBeGreaterThan(ax);
      expect(difAngulo(Math.atan2(t.b[2] - t.a[2], t.b[0] - t.a[0]), k.angulo)).toBeLessThan(1e-6);
    }
  });

  it('casca de Disse em volta de trechos de haste, por fora da luz e sem tocar hepatócitos', () => {
    expect(g.mangas.length).toBeGreaterThanOrEqual(24);
    for (const m of g.mangas) {
      const tubo = g.sinusoides.find((t) => (t.tipo === 'haste' || t.tipo === 'tronco') && distanciaPontoSegmento(xz(m.a), xz(t.a), xz(t.b)) < 1e-9 && distanciaPontoSegmento(xz(m.b), xz(t.a), xz(t.b)) < 1e-9);
      expect(tubo).toBeTruthy();
      expect(m.raio).toBeCloseTo(tubo!.raio + LOBULO.disse, 12);
      for (const { poligono } of pegadas) expect(distanciaSegmentoPoligono(xz(m.a), xz(m.b), poligono)).toBeGreaterThanOrEqual(m.raio + LOBULO.margem);
    }
  });

  it('canalículos só entre hepatócitos vizinhos, finos, longe das faces sinusoidais e das pontas das placas', () => {
    const meia = ALTURA_FATIA / 2;
    const alturas = alturasCanaliculos();
    // uma altura por face de contato entre camadas da fatia; nada sobre as faces de corte
    expect(alturas).toHaveLength(LOBULO.camadas - 1);
    for (const y of alturas) expect(Math.abs(y)).toBeLessThan(meia - LOBULO.altura / 2);
    expect(LOBULO.raioCanaliculo).toBeLessThanOrEqual(0.012);
    // no plano médio da placa, a mais de três raios de cada face sinusoidal
    expect(LOBULO.espessura / 2 - LOBULO.raioCanaliculo).toBeGreaterThan(3 * LOBULO.raioCanaliculo);
    // o recuo da ponta é maior que o chanfro do hepatócito (o tubo não aflora na ponta da placa)
    expect(LOBULO.recuoCanaliculo).toBeGreaterThan(0.022);
    let horizontais = 0;
    for (const { a, b } of g.canaliculos) {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const placa = g.placas.find((p) => Math.abs(-m[0] * Math.sin(p.angulo) + m[2] * Math.cos(p.angulo)) < 1e-9 && m[0] * Math.cos(p.angulo) + m[2] * Math.sin(p.angulo) > 0);
      expect(placa).toBeTruthy();
      const setor = noSetorTranslucido(placa!);
      const [ra, rb] = [Math.hypot(a[0], a[2]), Math.hypot(b[0], b[2])].sort((x, y) => x - y);
      if (Math.abs(a[1] - b[1]) > 1e-9) {
        // vertical: na folga entre duas células consecutivas do mesmo trecho da placa, da base ao topo das camadas
        expect(fragmentos(placa!).some((f) => f.some(([, fim], i) => i + 1 < f.length && ra > fim && ra < f[i + 1][0]))).toBe(true);
        expect(Math.min(a[1], b[1])).toBeCloseTo(-meia, 9);
        expect(Math.max(a[1], b[1])).toBeCloseTo(setor ? TOPO_TERCEIRA_CAMADA : meia, 9);
      } else {
        // horizontal: numa face de contato entre duas camadas existentes, recuado das pontas do trecho
        const entreCamadas = alturas.some((y) => Math.abs(y - a[1]) < 1e-9);
        const sobTranslucida = setor && Math.abs(a[1] - ALTURA_CANALICULO_SETOR) < 1e-9;
        expect(entreCamadas || sobTranslucida).toBe(true);
        expect(fragmentos(placa!).some((f) => ra >= f[0][0] + LOBULO.recuoCanaliculo - 1e-9 && rb <= f[f.length - 1][1] - LOBULO.recuoCanaliculo + 1e-9)).toBe(true);
        horizontais++;
      }
    }
    const trechos = g.placas.reduce((n, p) => n + fragmentos(p).length * (alturas.length + (noSetorTranslucido(p) ? 1 : 0)), 0);
    expect(horizontais).toBe(trechos);
  });

  it('canal de Hering: liga os canalículos de uma placa ao ducto biliar de cada espaço porta', () => {
    expect(g.hering).toHaveLength(g.triades.length);
    expect(LOBULO.raioHering).toBeGreaterThan(LOBULO.raioCanaliculo);
    g.hering.forEach((h, k) => {
      const t = g.triades[k];
      // começa na ponta periférica de um canalículo (entre as camadas) …
      const pontasDeCanaliculo = g.canaliculos.filter((c) => Math.abs(c.a[1] - c.b[1]) < 1e-9).flatMap((c) => [c.a, c.b]);
      expect(Math.min(...pontasDeCanaliculo.map((p) => Math.hypot(p[0] - h.a[0], p[1] - h.a[1], p[2] - h.a[2])))).toBeLessThan(1e-9);
      // … e termina dentro do ducto biliar da mesma tríade, atravessando o conjuntivo do espaço porta
      expect(Math.hypot(h.b[0] - t.ducto.centro[0], h.b[2] - t.ducto.centro[1])).toBeLessThan(t.ducto.raioInterno);
      expect(Math.hypot(h.a[0] - t.vertice[0], h.a[2] - t.vertice[1])).toBeGreaterThan(LOBULO.raioPorta);
      expect(Math.hypot(h.a[0] - t.vertice[0], h.a[2] - t.vertice[1])).toBeLessThan(LOBULO.raioPorta + 0.12);
      // sem cruzar sinusoides nem os vasos vizinhos da tríade
      for (const s of g.sinusoides) {
        const d = Math.min(distanciaPontoSegmento(xz(s.a), xz(h.a), xz(h.b)), distanciaPontoSegmento(xz(s.b), xz(h.a), xz(h.b)), distanciaPontoSegmento(xz(h.a), xz(s.a), xz(s.b)), distanciaPontoSegmento(xz(h.b), xz(s.a), xz(s.b)));
        expect(d).toBeGreaterThan(s.raio + LOBULO.raioHering);
      }
      for (const vaso of [t.veia, t.arteria]) expect(distanciaPontoSegmento(vaso.centro, xz(h.a), xz(h.b))).toBeGreaterThan(vaso.raioExterno + LOBULO.raioHering);
    });
  });
});

describe('sarcômero', () => {
  const k = SARCOMERO.escala;
  const niveis = [0, 0.25, 0.5, 0.75, 1];

  it('linhas Z nas extremidades, linha M no centro, banda A = comprimento dos filamentos grossos', () => {
    for (const c of niveis) {
      const b = bandas(c);
      const s = comprimentoSarcomero(c);
      expect(b.linhaZ[1] - b.linhaZ[0]).toBeCloseTo(s * k, 12);
      expect(b.linhaZ[0]).toBeCloseTo(-b.linhaZ[1], 12);
      expect(b.linhaM).toBe(0);
      expect(b.bandaA[1] - b.bandaA[0]).toBeCloseTo(SARCOMERO.grosso * k, 12);
      expect(b.bandaA[0] + b.bandaA[1]).toBeCloseTo(0, 12);
      // sarcômero = banda A + banda I (duas metades)
      expect(b.larguraA + b.larguraI).toBeCloseTo(s, 12);
    }
  });

  it('banda I só com finos e atravessada pela linha Z; banda H só com grossos, centrada na linha M', () => {
    for (const c of niveis) {
      const b = bandas(c);
      b.bandasI.forEach(([ini, fim], i) => {
        // a linha Z divide a banda I ao meio
        expect((ini + fim) / 2).toBeCloseTo(b.linhaZ[i], 12);
        expect(fim - ini).toBeCloseTo(b.larguraI * k, 12);
      });
      // a banda I começa onde terminam os grossos (junção A-I)
      expect(b.bandasI[0][1]).toBeCloseTo(b.bandaA[0], 12);
      expect(b.bandasI[1][0]).toBeCloseTo(b.bandaA[1], 12);
      // finos ancorados nas linhas Z, com o comprimento do filamento fino, terminando na borda da banda H
      expect(b.finos[0][0]).toBeCloseTo(b.linhaZ[0], 12);
      expect(b.finos[1][1]).toBeCloseTo(b.linhaZ[1], 12);
      for (const [ini, fim] of b.finos) expect(fim - ini).toBeCloseTo(SARCOMERO.fino * k, 12);
      expect(b.finos[0][1]).toBeCloseTo(b.bandaH[0], 12);
      expect(b.finos[1][0]).toBeCloseTo(b.bandaH[1], 12);
      expect(b.bandaH[0] + b.bandaH[1]).toBeCloseTo(0, 12);
      expect(b.bandaH[0]).toBeGreaterThan(b.bandaA[0]);
      expect(b.bandaH[1]).toBeLessThan(b.bandaA[1]);
    }
  });

  it('contração: a banda A fica constante; I, H e o sarcômero encurtam', () => {
    const lista = niveis.map(bandas);
    for (let i = 1; i < lista.length; i++) {
      expect(lista[i].larguraA).toBe(lista[0].larguraA);
      expect(lista[i].bandaA).toEqual(lista[0].bandaA);
      expect(lista[i].larguraI).toBeLessThan(lista[i - 1].larguraI);
      expect(lista[i].larguraH).toBeLessThan(lista[i - 1].larguraH);
      expect(lista[i].sarcomero).toBeLessThan(lista[i - 1].sarcomero);
      // a perda de I é igual à perda de H (deslizamento, sem encurtar filamentos)
      expect(lista[0].larguraI - lista[i].larguraI).toBeCloseTo(lista[0].larguraH - lista[i].larguraH, 12);
    }
    // valores de repouso dos livros-texto: 2,5 µm; A 1,6; I 0,9; H 0,5
    expect(lista[0].sarcomero).toBe(2.5);
    expect(lista[0].larguraI).toBeCloseTo(0.9, 12);
    expect(lista[0].larguraH).toBeCloseTo(0.5, 12);
    // no contraído, os finos dos dois lados ainda não se sobrepõem
    expect(lista[lista.length - 1].larguraH).toBeGreaterThan(0);
  });

  it('tríades na junção A-I, com uma cisterna de cada lado', () => {
    for (const c of niveis) {
      const b = bandas(c);
      expect(b.juncoesAI).toEqual(b.bandaA);
      for (const x of b.juncoesAI) {
        const cisternas = [x - SARCOMERO.afastamentoCisterna, x + SARCOMERO.afastamentoCisterna];
        // uma cisterna sobre a banda A e outra sobre a banda I, sem passar da linha Z
        expect(Math.abs(cisternas[0]) < Math.abs(x)).not.toBe(Math.abs(cisternas[1]) < Math.abs(x));
        for (const y of cisternas) expect(Math.abs(y)).toBeLessThan(b.linhaZ[1]);
        expect(SARCOMERO.afastamentoCisterna).toBeGreaterThan(SARCOMERO.tuboT + SARCOMERO.tuboCisterna);
      }
    }
  });

  it('rede hexagonal: seis finos em volta do grosso central e cada fino interno entre três grossos', () => {
    const { grossos, finos } = redeFilamentos();
    const D = SARCOMERO.rede;
    expect(grossos).toHaveLength(7);
    expect(finos).toHaveLength(12);
    const perto = (p: [number, number], lista: [number, number][]) => lista.filter((q) => Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1]) - D / Math.sqrt(3)) < 1e-9);
    expect(perto([0, 0], finos)).toHaveLength(6);
    for (const f of finos.filter((p) => Math.hypot(...p) < D)) expect(perto(f, grossos)).toHaveLength(3);
    // nada se toca no corte transversal
    for (const f of finos) for (const g of grossos) expect(Math.hypot(f[0] - g[0], f[1] - g[1])).toBeGreaterThan(SARCOMERO.raioFino + SARCOMERO.raioGrosso);
  });

  it('filamentos finos dos sarcômeros vizinhos intercalados, e não em linha com os do sarcômero central', () => {
    const centrais = redeFilamentos().finos;
    const vizinhos = finosVizinhos();
    expect(vizinhos).toHaveLength(centrais.length);
    for (const v of vizinhos) {
      // nenhum vizinho fica em linha com um filamento do sarcômero central (do outro lado da linha Z) …
      const perto = Math.min(...centrais.map((c) => Math.hypot(v[0] - c[0], v[1] - c[1])));
      expect(perto).toBeGreaterThan(2 * SARCOMERO.raioFino);
      // … e fica dentro do disco Z, à mesma distância do eixo que algum filamento central (giro de 30°)
      expect(Math.hypot(...v) + SARCOMERO.raioFino).toBeLessThan(SARCOMERO.raioDiscoZ);
      expect(centrais.some((c) => Math.abs(Math.hypot(...c) - Math.hypot(...v)) < 1e-9)).toBe(true);
    }
    // o conjunto é simétrico em z: vale igual para os dois lados (o lado direito é o esquerdo girado 180° em y)
    for (const v of vizinhos) expect(vizinhos.some((w) => Math.abs(w[0] - v[0]) < 1e-9 && Math.abs(w[1] + v[1]) < 1e-9)).toBe(true);
  });

  it('legenda do controle: valores do esquema, aproximados, com uma casa decimal', () => {
    expect(legendaContracao(0)).toBe('Esquema: sarcômero ≈ 2,5 µm · A ≈ 1,6 µm (constante) · I ≈ 0,9 µm · H ≈ 0,5 µm');
    expect(legendaContracao(1)).toBe('Esquema: sarcômero ≈ 2,1 µm · A ≈ 1,6 µm (constante) · I ≈ 0,5 µm · H ≈ 0,1 µm');
    expect(legendaContracao(0.5)).toMatch(/^Esquema: sarcômero ≈ \d,\d µm · A ≈ 1,6 µm \(constante\) · I ≈ \d,\d µm · H ≈ \d,\d µm$/);
  });

  it('zona nua do filamento grosso marcada por uma haste mais fina, sem cabeças', () => {
    expect(RAIO_ZONA_NUA).toBeLessThan(SARCOMERO.raioGrosso * 0.8);
    const meiaNua = (SARCOMERO.zonaNua / 2) * k;
    expect(cabecasMiosina().every((c) => Math.abs(c.x) > meiaNua)).toBe(true);
    // a zona nua fica dentro da banda H em todo o curso do controle
    for (const c of niveis) expect(bandas(c).bandaH[1]).toBeGreaterThan(0);
    expect(meiaNua).toBeLessThan(bandas(0).bandaH[1]);
  });

  it('cabeças de miosina fora da zona nua, voltadas para a linha Z do seu lado', () => {
    const cabecas = cabecasMiosina();
    expect(cabecas.length).toBeGreaterThan(30);
    for (const c of cabecas) {
      expect(Math.abs(c.x)).toBeGreaterThan((SARCOMERO.zonaNua / 2) * k);
      expect(Math.abs(c.x)).toBeLessThan((SARCOMERO.grosso / 2) * k);
      expect(Math.sign(c.x)).toBe(c.lado);
    }
    expect(cabecas.filter((c) => c.lado < 0)).toHaveLength(cabecas.length / 2);
  });
});

describe('junções celulares', () => {
  const [xa, xb] = centrosCelulas();

  it('complexo juncional na ordem apical → basal: oclusão, adesão, desmossomo; hemidesmossomo na base', () => {
    const topo = JUNCOES.base + JUNCOES.altura;
    const desmossomoApical = JUNCOES.desmossomos[0];
    const meiaPlaca = JUNCOES.placaDesmossomo.raio;
    expect(JUNCOES.oclusao[1]).toBeLessThan(topo);
    expect(JUNCOES.oclusao[0]).toBeGreaterThan(JUNCOES.adesao[1]);
    expect(JUNCOES.adesao[0]).toBeGreaterThan(desmossomoApical.y + meiaPlaca);
    // o desmossomo do complexo é o mais apical; os outros ficam abaixo
    for (const d of JUNCOES.desmossomos.slice(1)) expect(d.y).toBeLessThan(desmossomoApical.y);
    // junção comunicante na face lateral, abaixo do complexo e acima da base
    const { y, raioPlaca } = JUNCOES.comunicante;
    expect(y + raioPlaca).toBeLessThan(desmossomoApical.y - meiaPlaca);
    expect(y - raioPlaca).toBeGreaterThan(JUNCOES.base);
    // hemidesmossomos na base, acima da lâmina basal
    for (const h of placasHemidesmossomo()) {
      const meia = JUNCOES.placaHemidesmossomo.espessura / 2;
      expect(h.centro[1] - meia).toBeGreaterThan(JUNCOES.base);
      expect(h.centro[1] + meia).toBeLessThan(Math.min(...JUNCOES.desmossomos.map((d) => d.y - meiaPlaca)));
      expect(JUNCOES.laminaBasal[1]).toBeLessThan(JUNCOES.base);
    }
    // microvilosidades no ápice das duas células
    for (const [x, z] of microvilosidades()) {
      const c = Math.abs(x - xa) < Math.abs(x - xb) ? xa : xb;
      expect(Math.abs(x - c)).toBeLessThan(JUNCOES.largura / 2);
      expect(Math.abs(z)).toBeLessThan(JUNCOES.profundidade / 2);
    }
  });

  it('zônulas circundam cada célula e se encontram no meio da fenda', () => {
    expect(xa).toBeCloseTo(-xb, 12);
    expect(xb - JUNCOES.largura / 2).toBeCloseTo(JUNCOES.fenda / 2, 12);
    const faixa = geometriaFaixa(0.1);
    faixa.computeBoundingBox();
    const caixa = faixa.boundingBox!;
    // a forma (x, profundidade) vai da membrana até o meio da fenda em todos os lados
    expect(caixa.max.x).toBeCloseTo(JUNCOES.largura / 2 + JUNCOES.fenda / 2, 6);
    expect(caixa.min.x).toBeCloseTo(-(JUNCOES.largura / 2 + JUNCOES.fenda / 2), 6);
    expect(caixa.max.y).toBeCloseTo(JUNCOES.profundidade / 2 + JUNCOES.fenda / 2, 6);
    expect(xa + caixa.max.x).toBeCloseTo(0, 6);
    expect(xb + caixa.min.x).toBeCloseTo(0, 6);
    faixa.dispose();
  });

  it('zônula de adesão: placa por dentro da membrana, bastonetes cruzam a fenda e o vão fica à mostra', () => {
    const [fora, dentro] = JUNCOES.adesaoPlaca;
    // placa citoplasmática: lâmina fina inteiramente por dentro da membrana
    const placa = geometriaPlacaAdesao(0.1);
    placa.computeBoundingBox();
    expect(placa.boundingBox!.max.x).toBeCloseTo(JUNCOES.largura / 2 - fora, 6);
    expect(placa.boundingBox!.max.x).toBeLessThan(JUNCOES.largura / 2);
    expect(dentro - fora).toBeLessThan(0.03);
    placa.dispose();
    // cinturão de actina encostado na face citoplasmática da placa
    expect(JUNCOES.cinturao.recuo - JUNCOES.cinturao.raio).toBeCloseTo(dentro, 9);
    // bastonetes: da membrana até o meio da fenda, na altura da zônula
    const bastonetes = bastonetesCaderina();
    expect(bastonetes.length).toBeGreaterThan(40);
    for (const { a, b } of bastonetes) {
      expect(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])).toBeCloseTo(JUNCOES.fenda / 2, 9);
      expect(a[1]).toBeGreaterThan(JUNCOES.adesao[0]);
      expect(a[1]).toBeLessThan(JUNCOES.adesao[1]);
    }
    // na face comum, os bastonetes das duas células se encontram no meio: juntos, cruzam a fenda inteira
    const daA = bastonetes.filter(({ a, b }) => Math.abs(a[0] + JUNCOES.fenda / 2) < 1e-9 && Math.abs(b[0]) < 1e-9);
    const daB = bastonetes.filter(({ a, b }) => Math.abs(a[0] - JUNCOES.fenda / 2) < 1e-9 && Math.abs(b[0]) < 1e-9);
    expect(daA.length).toBeGreaterThanOrEqual(6);
    expect(daB).toHaveLength(daA.length);
    for (const r of daA) expect(daB.some((q) => Math.abs(q.b[1] - r.b[1]) < 1e-9 && Math.abs(q.b[2] - r.b[2]) < 1e-9)).toBe(true);
    // o espaço intercelular é mantido: por fileira, os bastonetes cobrem menos de metade da face
    const porFileira = daA.length / JUNCOES.caderina.fileiras.length;
    expect((porFileira * 2 * JUNCOES.caderina.raio) / (JUNCOES.profundidade - 2 * JUNCOES.canto)).toBeLessThan(0.5);
  });

  it('desmossomos com placa em cada célula e vão entre elas; junção comunicante com a fenda estreitada', () => {
    const placas = placasDesmossomo();
    expect(placas).toHaveLength(2 * JUNCOES.desmossomos.length);
    for (const p of placas) {
      const meia = JUNCOES.placaDesmossomo.espessura / 2;
      // placa no citoplasma da sua célula, junto à membrana lateral
      expect(Math.sign(p.centro[0])).toBe(p.lado);
      expect(Math.abs(p.centro[0]) - meia).toBeGreaterThan(JUNCOES.fenda / 2);
      expect(Math.abs(p.centro[0]) - meia - JUNCOES.fenda / 2).toBeLessThan(0.02);
    }
    // entre as placas, bastonetes separados cruzam a fenda (o vão não é preenchido)
    const pontos = pontosDesmossomo();
    expect(pontos.length).toBeGreaterThanOrEqual(5);
    for (const [dy, dz] of pontos) expect(Math.hypot(dy, dz)).toBeLessThan(JUNCOES.placaDesmossomo.raio);
    for (let i = 0; i < pontos.length; i++) for (let j = i + 1; j < pontos.length; j++) expect(Math.hypot(pontos[i][0] - pontos[j][0], pontos[i][1] - pontos[j][1])).toBeGreaterThan(0.04);
    // junção comunicante: cada membrana faz um ressalto, e a fenda cai a menos de um terço
    expect(2 * RESSALTO_COMUNICANTE + JUNCOES.fendaComunicante).toBeCloseTo(JUNCOES.fenda, 12);
    expect(JUNCOES.fendaComunicante).toBeLessThan(JUNCOES.fenda / 3);
    // cada canal em duas metades (um conexon de cada célula): quase se tocam no meio e entram na membrana
    const [x0, x1] = JUNCOES.meioConexon;
    expect(x0).toBeLessThan(JUNCOES.fendaComunicante / 2);
    expect(x1).toBeGreaterThan(JUNCOES.fenda / 2);
    const lista = conexons();
    expect(lista.length).toBeGreaterThanOrEqual(7);
    for (const [y, z] of lista) {
      expect(Math.hypot(y - JUNCOES.comunicante.y, z - JUNCOES.comunicante.z)).toBeLessThanOrEqual(JUNCOES.comunicante.raioPlaca);
      expect(Math.abs(z)).toBeLessThan(JUNCOES.profundidade / 2);
    }
  });

  it('filamentos de queratina no citoplasma, fora dos núcleos, presos às placas', () => {
    const nucleos = centrosNucleos();
    const [rx, ry, rz] = JUNCOES.nucleo.raios;
    const placas = [...placasDesmossomo().map((p) => p.centro), ...placasHemidesmossomo().map((h) => h.centro)];
    for (const pontos of trajetosQueratina()) {
      const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
      for (let i = 0; i <= 60; i++) {
        const p = curva.getPoint(i / 60);
        for (const n of nucleos) expect(((p.x - n[0]) / rx) ** 2 + ((p.y - n[1]) / ry) ** 2 + ((p.z - n[2]) / rz) ** 2).toBeGreaterThan(1);
        // dentro de uma das células (não atravessa a fenda)
        expect(Math.abs(p.x)).toBeGreaterThan(JUNCOES.fenda / 2);
        expect(p.y).toBeGreaterThan(JUNCOES.base);
      }
      // as duas pontas presas a uma placa (desmossomo ou hemidesmossomo)
      for (const extremo of [pontos[0], pontos[pontos.length - 1]]) {
        expect(Math.min(...placas.map((c) => Math.hypot(extremo[0] - c[0], extremo[1] - c[1], extremo[2] - c[2])))).toBeLessThan(0.12);
      }
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Montagem (renderer sem WebGL): orçamento por nível e toque de cada parte
// ---------------------------------------------------------------------------------------------
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
extend(THREE as unknown as Parameters<typeof extend>[0]);

function rendererStub(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const nada = () => {};
  return {
    domElement: canvas,
    render: nada,
    setPixelRatio: nada,
    getPixelRatio: () => 1,
    setSize: nada,
    setAnimationLoop: nada,
    dispose: nada,
    forceContextLoss: nada,
    shadowMap: { enabled: false, type: THREE.PCFShadowMap, autoUpdate: true, needsUpdate: false },
    xr: { enabled: false, isPresenting: false, addEventListener: nada, removeEventListener: nada, setAnimationLoop: nada, getSession: () => null },
    info: { render: {}, memory: {}, programs: [] },
    capabilities: {},
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.NoToneMapping,
  } as unknown as THREE.WebGLRenderer;
}

async function montar(id: string) {
  const canvas = document.createElement('canvas');
  const palco = document.createElement('div');
  palco.appendChild(canvas);
  document.body.appendChild(palco);
  const root = createRoot(canvas);
  await act(async () => {
    await root.configure({ gl: rendererStub(canvas), frameloop: 'never', size: { width: 390, height: 520, top: 0, left: 0 }, events: undefined });
    root.render(createElement('group', { name: 'modelo' }, createElement(MODELOS_HISTO_B[id].Componente)));
  });
  const cena = _roots.get(canvas)!.store.getState().scene as THREE.Scene;
  return {
    modelo: cena.getObjectByName('modelo')!,
    palco,
    desmontar: async () => {
      await act(async () => root.unmount());
      palco.remove();
    },
  };
}

function idDaParte(o: THREE.Object3D | null): string | null {
  for (let x = o; x; x = x.parent) if (x.userData?.parteId) return x.userData.parteId as string;
  return null;
}

/** Centros de até `n` triângulos de cada malha da parte, no mundo. */
function amostras(modelo: THREE.Object3D, id: string, n = 24): THREE.Vector3[] {
  const pontos: THREE.Vector3[] = [];
  modelo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || idDaParte(m) !== id) return;
    const pos = m.geometry.getAttribute('position');
    const indice = m.geometry.getIndex();
    const total = (indice ? indice.count : pos.count) / 3;
    const passo = Math.max(1, Math.floor(total / n));
    const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    for (let t = 0; t < total; t += passo) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(pos, indice ? indice.getX(3 * t + j) : 3 * t + j);
      pontos.push(v[0].clone().add(v[1]).add(v[2]).divideScalar(3).applyMatrix4(m.matrixWorld));
    }
  });
  return pontos;
}

const DIRECOES = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

describe('modelos do grupo B montados', () => {
  afterAll(() => forcarNivel(null));

  it('o texto lista exatamente as partes de cada modelo, em ordens 3, 4 e 5', () => {
    const textos = (modelosB as { modelos: { id: string; ordem: number; estruturas: { id: string }[]; revisao: { humano: unknown } }[] }).modelos;
    expect(textos.map((m) => m.ordem)).toEqual([3, 4, 5]);
    expect(new Set(textos.map((m) => m.id))).toEqual(new Set(Object.keys(MODELOS_HISTO_B)));
    for (const m of textos) {
      expect(new Set(m.estruturas.map((e) => e.id))).toEqual(new Set(MODELOS_HISTO_B[m.id].partes));
      expect(m.revisao.humano).toBeNull();
    }
  });

  for (const id of Object.keys(MODELOS_HISTO_B)) {
    it(`${id}: triângulos e malhas no orçamento de cada nível; todas as partes tocáveis`, async () => {
      const medidas = {} as Record<NivelQualidade, { triangulos: number; malhas: number }>;
      for (const nivel of NIVEIS) {
        forcarNivel(nivel);
        const { modelo, desmontar } = await montar(id);
        prepararMalhas(modelo, { raio: MODELOS_HISTO_B[id].raio, fator: PARAMETROS[nivel].fator });
        medidas[nivel] = contarCena(modelo);
        expect(excessos({ triangulos: medidas[nivel].triangulos, chamadas: medidas[nivel].malhas }, nivel), `${id} em ${nivel}`).toEqual([]);
        if (nivel === 'baixa') {
          // cada parte tem malha e é escolhida pelo toque em ao menos um raio de uma das 6 direções
          modelo.updateMatrixWorld(true);
          const raio = new THREE.Raycaster();
          const distancia = 10;
          for (const parte of MODELOS_HISTO_B[id].partes) {
            const pontos = amostras(modelo, parte);
            expect(pontos.length, parte).toBeGreaterThan(0);
            let acertou = false;
            for (const p of pontos) {
              for (const d of DIRECOES) {
                raio.set(p.clone().addScaledVector(d, distancia), d.clone().negate());
                if (resolverToque(raio.intersectObject(modelo, true)) === parte) { acertou = true; break; }
              }
              if (acertou) break;
            }
            expect(acertou, `${id}: ${parte} não é tocável`).toBe(true);
          }
        }
        await desmontar();
      }
      expect(medidas.alta.malhas).toBe(medidas.baixa.malhas);
      expect(medidas.media.triangulos).toBeGreaterThanOrEqual(medidas.baixa.triangulos);
      expect(medidas.alta.triangulos).toBeGreaterThan(medidas.baixa.triangulos);
      console.info(`${id}: ${medidas.baixa.triangulos} / ${medidas.media.triangulos} / ${medidas.alta.triangulos} triângulos (${medidas.baixa.malhas} malhas)`);
    }, 60000);
  }

  it('sarcômero: o controle de contração aparece fora do jogo e não deixa o toque passar', async () => {
    forcarNivel('baixa');
    const { palco, desmontar } = await montar('sarcomero');
    const entrada = palco.querySelector('input[type="range"]') as HTMLInputElement;
    expect(entrada).toBeTruthy();
    expect(palco.querySelector('output')!.textContent).toBe(legendaContracao(0));
    let vazou = false;
    palco.addEventListener('pointerdown', () => { vazou = true; });
    entrada.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(vazou).toBe(false);
    await act(async () => {
      entrada.value = '1';
      entrada.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(palco.querySelector('output')!.textContent).toBe(legendaContracao(1));
    await desmontar();
    expect(palco.querySelector('input')).toBeNull();
  });
});
