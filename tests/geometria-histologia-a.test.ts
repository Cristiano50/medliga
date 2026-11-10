// Relações espaciais dos modelos 3D da histologia, grupo A (néfron e alvéolo), na geometria pura.
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  CORPUSCULO,
  centroFaceMacula,
  curvaAscendenteEspesso,
  curvaDistal,
  curvaProximal,
  curvasAlcasGlomerulares,
  DIRECAO_POLO_URINARIO,
  DIRECAO_POLO_VASCULAR,
  pontoMacula,
  polovascular,
  poloUrinario,
  posicoesMesangiaisExtraglomerulares,
  posicoesPodocitos,
  RAIO_CORPO_PODOCITO,
  RAIOS,
  REGIOES,
  curvaAferente,
  curvaEferente,
  curvaDescendenteDelgado,
  DUCTO_X,
  MACULA,
  RAIO_MESANGIAL_EXTRA,
} from '../src/modules/histologia/modelos3d/geometria-nefron.ts';
import {
  ALVEOLOS,
  BARREIRA,
  capilarDe,
  capilaresNoModelo,
  POLARES_CAPILARES_HEROI,
  centroMacrofago,
  centroNucleoTipoI,
  centroPoro,
  centroTipoII,
  direcaoHeroi,
  HEROI,
  luzesAlveolares,
  NUCLEOS_TIPO_I,
  perfilTaca,
  TIPO_II,
  TIPO_II_DIMENSOES,
} from '../src/modules/histologia/modelos3d/geometria-alveolo.ts';

const v = (p: [number, number, number]) => new THREE.Vector3(...p);
const amostrar = (c: THREE.Curve<THREE.Vector3>, n = 200) => c.getSpacedPoints(n);

describe('néfron', () => {
  const C = v(CORPUSCULO.centro);

  it('glomérulo dentro da cápsula: toda alça capilar (eixo + raio do tubo) fica dentro do folheto parietal', () => {
    let maior = 0;
    for (const alca of curvasAlcasGlomerulares())
      for (const p of amostrar(alca)) maior = Math.max(maior, p.distanceTo(C) + RAIOS.alcaCapilar);
    expect(maior).toBeLessThan(CORPUSCULO.raioParietalInterno);
    // e os podócitos (folheto visceral) também, sobre as alças, dentro do espaço capsular
    for (const { corpo } of posicoesPodocitos()) {
      expect(corpo.distanceTo(C) + RAIO_CORPO_PODOCITO).toBeLessThan(CORPUSCULO.raioEspaco);
      expect(corpo.distanceTo(C)).toBeGreaterThan(0.2);
    }
  });

  it('polos opostos: arteríolas no polo vascular; túbulo proximal começa no polo urinário', () => {
    expect(v(DIRECAO_POLO_VASCULAR).dot(v(DIRECAO_POLO_URINARIO))).toBeLessThan(-0.9);
    const pv = polovascular();
    for (const arteriola of [curvaAferente(), curvaEferente()]) {
      const pts = amostrar(arteriola);
      // começa dentro da cápsula (no hilo do tufo), sai perto do polo vascular
      expect(pts[0].distanceTo(C)).toBeLessThan(CORPUSCULO.raioParietalInterno);
      const saida = pts.find((p) => p.distanceTo(C) > CORPUSCULO.raioParietalExterno)!;
      expect(saida.distanceTo(pv)).toBeLessThan(0.12);
    }
    const tcp = amostrar(curvaProximal());
    expect(tcp[0].distanceTo(C)).toBeLessThan(CORPUSCULO.raioParietalExterno);
    const saida = tcp.find((p) => p.distanceTo(C) > CORPUSCULO.raioParietalExterno)!;
    expect(saida.distanceTo(poloUrinario())).toBeLessThan(0.08);
    // depois de sair, o túbulo proximal não volta a atravessar o corpúsculo
    const fora = tcp.slice(tcp.indexOf(saida) + 4);
    for (const p of fora) expect(p.distanceTo(C)).toBeGreaterThan(CORPUSCULO.raioParietalExterno + RAIOS.proximal * 0.9);
  });

  it('mácula densa a menos de 0,15 do polo vascular do próprio corpúsculo, entre as arteríolas', () => {
    const pv = polovascular();
    const face = centroFaceMacula();
    // 0,15 ≈ um terço do raio da cápsula: só cabem ali as células mesangiais extraglomerulares
    expect(face.distanceTo(pv)).toBeLessThan(0.15);
    expect(face.distanceTo(pv)).toBeLessThan(CORPUSCULO.raioParietalExterno / 3);
    // a mácula está no ponto em que o ramo ascendente espesso termina e o túbulo distal começa
    const m = pontoMacula();
    expect(curvaAscendenteEspesso().getPoint(1).distanceTo(m)).toBeLessThan(0.01);
    expect(curvaDistal().getPoint(0).distanceTo(m)).toBeLessThan(0.01);
    // muito mais perto do polo vascular que do polo urinário
    expect(face.distanceTo(poloUrinario())).toBeGreaterThan(5 * face.distanceTo(pv));
    // o túbulo passa no ângulo entre as arteríolas, sem atravessá-las
    for (const [arteriola, r] of [[curvaAferente(), RAIOS.aferente], [curvaEferente(), RAIOS.eferente]] as const) {
      const menor = Math.min(...amostrar(arteriola, 400).map((p) => p.distanceTo(m)));
      expect(menor).toBeGreaterThan(MACULA.raio + r);
    }
    // células mesangiais extraglomerulares entre o polo vascular e a mácula, fora da cápsula
    for (const p of posicoesMesangiaisExtraglomerulares()) {
      expect(p.y).toBeGreaterThan(pv.y);
      expect(p.y + RAIO_MESANGIAL_EXTRA * 0.8).toBeLessThan(m.y - MACULA.raio + 0.01);
      expect(p.distanceTo(C)).toBeGreaterThan(CORPUSCULO.raioParietalExterno);
    }
  });

  it('córtex em cima, medula embaixo; alça de Henle desce à medula; ducto coletor atravessa as duas regiões fora do néfron', () => {
    expect(C.y).toBeGreaterThan(REGIOES.juncao);
    const delgado = amostrar(curvaDescendenteDelgado());
    expect(Math.max(...delgado.map((p) => p.y))).toBeLessThan(REGIOES.juncao);
    const espesso = amostrar(curvaAscendenteEspesso());
    // alça curta de néfron cortical: a curva fica na metade externa da medula, longe da papila
    const fundo = Math.min(...espesso.map((p) => p.y));
    expect(fundo).toBeLessThan(REGIOES.juncao - 0.5);
    expect(fundo).toBeGreaterThan((REGIOES.juncao + REGIOES.base) / 2 - 0.2);
    expect(espesso.at(-1)!.y).toBeGreaterThan(REGIOES.juncao);
    // o túbulo distal termina no ducto coletor
    expect(Math.abs(curvaDistal().getPoint(1).x - DUCTO_X)).toBeLessThan(RAIOS.coletor[0] + 0.01);
    // nenhum segmento do néfron cruza o eixo do ducto coletor, salvo a chegada do túbulo distal
    for (const c of [curvaProximal(), curvaDescendenteDelgado(), curvaAscendenteEspesso()])
      for (const p of amostrar(c)) expect(Math.hypot(p.x - DUCTO_X, p.z)).toBeGreaterThan(0.3);
  });
});

describe('alvéolo', () => {
  const luzes = luzesAlveolares();

  it('capilares fora da luz alveolar: distância ao centro de todo alvéolo maior que o raio da luz (com o raio do tubo)', () => {
    let pior = Infinity;
    for (const { curva, raio, matriz } of capilaresNoModelo())
      for (const p of curva.getSpacedPoints(120)) {
        const q = p.clone().applyMatrix4(matriz);
        for (const l of luzes) pior = Math.min(pior, q.distanceTo(l.centro) - raio - l.raio);
      }
    expect(pior).toBeGreaterThan(0);
  });

  it('capilares no septo: perto da parede do seu alvéolo (a menos de uma espessura de parede da luz)', () => {
    for (const a of ALVEOLOS) {
      const centro = v(a.centro);
      const matriz = new THREE.Matrix4().makeTranslation(centro.x, centro.y, centro.z);
      const meus = capilaresNoModelo().filter((c) => c.matriz.elements[12] === matriz.elements[12] && c.matriz.elements[13] === matriz.elements[13] && c.matriz.elements[14] === matriz.elements[14]);
      expect(meus.length, a.id).toBe(2);
      for (const { curva, raio, matriz: m } of meus)
        for (const p of curva.getSpacedPoints(60)) {
          const d = p.clone().applyMatrix4(m).distanceTo(centro);
          expect(d - raio, a.id).toBeGreaterThan(a.raio);
          expect(d - raio, a.id).toBeLessThan(a.raio + a.parede);
        }
    }
    const heroi = v(HEROI.centro);
    const deHeroi = capilaresNoModelo().filter((c) => c.matriz.equals(new THREE.Matrix4()));
    expect(deHeroi.length).toBeGreaterThan(3);
    for (const { curva, raio } of deHeroi)
      for (const p of curva.getSpacedPoints(60)) {
        const d = p.distanceTo(heroi);
        expect(d - raio).toBeGreaterThan(HEROI.raio);
        expect(d - raio).toBeLessThan(HEROI.raio + HEROI.parede);
      }
  });

  it('pneumócitos na parede: tipo I no revestimento e tipo II apoiado nele, na metade cortada e fora da boca', () => {
    const c = v(HEROI.centro);
    const naParede = (polar: number) => polar < 180 - (HEROI.meiaAbertura * 180) / Math.PI;
    for (const p of NUCLEOS_TIPO_I) {
      const d = centroNucleoTipoI(p).distanceTo(c);
      expect(Math.abs(d - HEROI.raio)).toBeLessThan(0.02);
      expect(naParede(p[0])).toBe(true);
      expect(centroNucleoTipoI(p).z).toBeLessThanOrEqual(0);
    }
    for (const p of TIPO_II) {
      const centro = centroTipoII(p);
      const d = centro.distanceTo(c);
      // apoiado no revestimento, voltado para a luz
      expect(d).toBeLessThan(HEROI.raio);
      expect(d).toBeGreaterThan(HEROI.raio - TIPO_II_DIMENSOES[1]);
      expect(naParede(p[0])).toBe(true);
      expect(centro.z).toBeLessThanOrEqual(0);
      // "nos cantos": junto de uma borda da parede — a da boca (encontro com o saco e os vizinhos) ou a do corte
      const juntoDaBoca = p[0] > 95;
      const juntoDoCorte = Math.abs(centro.z) < 0.12;
      expect(juntoDaBoca || juntoDoCorte, `${p}`).toBe(true);
    }
    // tipo I: menos células que o tipo II, espalhadas pelo revestimento (que cobre a superfície inteira)
    expect(TIPO_II.length).toBeGreaterThan(NUCLEOS_TIPO_I.length);
    const polares = NUCLEOS_TIPO_I.map((p) => p[0]);
    expect(Math.max(...polares) - Math.min(...polares)).toBeGreaterThan(60);
    // nenhuma célula do tipo II atravessa o plano do corte nem cobre outra
    for (const p of TIPO_II) expect(centroTipoII(p).z).toBeLessThan(-TIPO_II_DIMENSOES[0] / 2);
    for (let i = 0; i < TIPO_II.length; i++)
      for (let j = i + 1; j < TIPO_II.length; j++) expect(centroTipoII(TIPO_II[i]).distanceTo(centroTipoII(TIPO_II[j]))).toBeGreaterThan(TIPO_II_DIMENSOES[0] * 1.5);
  });

  it('macrófago na luz, encostado no revestimento; poro na parede, voltado para o alvéolo de trás', () => {
    const c = v(HEROI.centro);
    expect(centroMacrofago().distanceTo(c)).toBeLessThan(HEROI.raio);
    expect(centroMacrofago().distanceTo(c)).toBeGreaterThan(HEROI.raio * 0.7);
    const poro = centroPoro();
    expect(Math.abs(poro.distanceTo(c) - HEROI.raio)).toBeLessThan(0.01);
    const vizinho = luzes.find((l) => l.id === 'vizinho')!;
    const dir = vizinho.centro.clone().sub(c).normalize();
    expect(dir.angleTo(direcaoHeroi(80, 270))).toBeLessThan(1e-6);
    // septo entre o alvéolo aberto e o vizinho: as luzes não se tocam
    expect(vizinho.centro.distanceTo(c)).toBeGreaterThan(HEROI.raio + vizinho.raio);
  });

  it('parede dos alvéolos intactos: face interna no raio da luz, capilares escondidos na espessura da parede', () => {
    for (const a of ALVEOLOS) {
      const raios = perfilTaca(a.raio, a.parede, a.meiaAbertura).map((p) => Math.hypot(p.x, p.y));
      expect(Math.min(...raios), a.id).toBeCloseTo(a.raio, 6);
      expect(Math.max(...raios), a.id).toBeCloseTo(a.raio + a.parede, 6);
      const c = capilarDe(a.raio, a.parede);
      // o capilar não aparece dentro da luz e faz relevo na face externa
      expect(c.eixo - c.raio, a.id).toBeGreaterThan(a.raio);
      expect(c.eixo + c.raio, a.id).toBeGreaterThan(a.raio + a.parede);
    }
  });

  it('barreira hematoaérea sobre um capilar do septo, na face interna do alvéolo em corte', () => {
    // a mancha fica no revestimento, em cima de um dos capilares em anel (a parte delgada do septo)
    expect(POLARES_CAPILARES_HEROI).toContain(BARREIRA.polar);
    const d = direcaoHeroi(BARREIRA.polar, BARREIRA.azimute);
    expect(d.z).toBeLessThan(0); // na metade que existe (z ≤ 0)
    expect(BARREIRA.polar).toBeLessThan(180 - (HEROI.meiaAbertura * 180) / Math.PI);
    const { eixo, raio } = capilarDe(HEROI.raio, HEROI.parede);
    // entre o ar (face interna, raio da luz) e o sangue (capilar) sobra só a espessura esquemática da barreira
    expect(eixo - raio - HEROI.raio).toBeGreaterThan(0);
    expect(eixo - raio - HEROI.raio).toBeLessThan(HEROI.parede / 2);
  });

  it('luzes alveolares não se sobrepõem', () => {
    for (let i = 0; i < luzes.length; i++)
      for (let j = i + 1; j < luzes.length; j++)
        expect(luzes[i].centro.distanceTo(luzes[j].centro), `${luzes[i].id} × ${luzes[j].id}`).toBeGreaterThan(luzes[i].raio + luzes[j].raio);
  });
});
