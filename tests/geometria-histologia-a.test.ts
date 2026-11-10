// Relações espaciais dos modelos 3D da histologia, grupo A (néfron e alvéolo), na geometria pura.
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  ALCA,
  CORPUSCULO,
  centroFaceMacula,
  curvaAferente,
  curvaAscendenteEspesso,
  curvaDescendenteDelgado,
  curvaDistal,
  curvaEferente,
  curvaProximalContorcida,
  curvaProximalReta,
  curvasAlcasGlomerulares,
  curvasPontesGlomerulares,
  DIRECAO_POLO_URINARIO,
  DIRECAO_POLO_VASCULAR,
  DISTANCIA_CORPO_PODOCITO,
  DUCTO_X,
  MACULA,
  pontoMacula,
  polovascular,
  poloUrinario,
  posicoesMesangiaisExtraglomerulares,
  posicoesPodocitos,
  RAIO_CORPO_PODOCITO,
  RAIO_MESANGIAL_EXTRA,
  RAIO_PONTE,
  RAIOS,
  REGIOES,
} from '../src/modules/histologia/modelos3d/geometria-nefron.ts';
import {
  ALVEOLOS,
  ANEL_DA_BOCA,
  anelDaBoca,
  BARREIRA,
  BRONQUIOLO,
  canalDoPoro,
  capilarDe,
  capilaresNoModelo,
  POLARES_CAPILARES_HEROI,
  centroMacrofago,
  centroNucleoTipoI,
  centroPoro,
  centroTipoII,
  direcaoDoPoro,
  direcaoHeroi,
  DUCTO,
  eixoCapilarHeroi,
  FOLGA_BARREIRA,
  HEROI,
  ID_VIZINHO_DO_PORO,
  luzesAlveolares,
  MACROFAGO,
  NUCLEOS_TIPO_I,
  perfilTaca,
  PORO,
  SACO,
  TIPO_II,
  TIPO_II_DIMENSOES,
  TIPO_II_EMBUTIDO,
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
  });

  it('podócitos colados ao tufo: corpo apoiado numa alça e prolongamentos sobre o capilar, tudo dentro do espaço capsular', () => {
    const alcas = curvasAlcasGlomerulares();
    const amostras = alcas.map((a) => amostrar(a, 400));
    const ateAlca = (p: THREE.Vector3, k: number) => Math.min(...amostras[k].map((q) => q.distanceTo(p)));
    const podocitos = posicoesPodocitos();
    // dois ou três por par de alças, e não um só na ponta de cada uma
    expect(podocitos.length).toBeGreaterThan(alcas.length);
    for (const pd of podocitos) {
      // o corpo encosta na parede do capilar (eixo da alça + raio do tubo + meia espessura do corpo achatado)
      expect(ateAlca(pd.corpo, pd.alca)).toBeCloseTo(RAIOS.alcaCapilar + DISTANCIA_CORPO_PODOCITO, 2);
      expect(pd.corpo.distanceTo(C) + RAIO_CORPO_PODOCITO).toBeLessThan(CORPUSCULO.raioEspaco);
      // do lado de fora do capilar (voltado para o espaço capsular)
      expect(pd.normal.dot(pd.corpo.clone().sub(C))).toBeGreaterThan(0);
      expect(pd.prolongamentos).toHaveLength(4);
      // prolongamentos sobre a superfície do capilar (nada de "gaiola" solta no espaço capsular)
      for (const pts of pd.prolongamentos)
        for (const q of pts) {
          const d = ateAlca(q, pd.alca);
          expect(d).toBeGreaterThan(RAIOS.alcaCapilar - 0.004);
          expect(d).toBeLessThan(RAIOS.alcaCapilar + 0.02);
        }
    }
  });

  it('pontes entre alças do glomérulo: ligam pontos de duas alças diferentes, dentro da cápsula', () => {
    const alcas = curvasAlcasGlomerulares().map((a) => amostrar(a, 400));
    const pontes = curvasPontesGlomerulares();
    expect(pontes.length).toBeGreaterThanOrEqual(3);
    for (const ponte of pontes) {
      const extremos = [ponte.getPoint(0), ponte.getPoint(1)];
      const donas = extremos.map((e) => alcas.findIndex((pts) => pts.some((q) => q.distanceTo(e) < 0.01)));
      expect(donas[0]).toBeGreaterThanOrEqual(0);
      expect(donas[1]).toBeGreaterThanOrEqual(0);
      expect(donas[0]).not.toBe(donas[1]);
      expect(ponte.getLength()).toBeLessThan(0.25);
      for (const p of amostrar(ponte, 20)) expect(p.distanceTo(C) + RAIO_PONTE).toBeLessThan(CORPUSCULO.raioParietalInterno);
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
    const tcp = amostrar(curvaProximalContorcida(), 600);
    expect(tcp[0].distanceTo(C)).toBeLessThan(CORPUSCULO.raioParietalExterno);
    const saida = tcp.find((p) => p.distanceTo(C) > CORPUSCULO.raioParietalExterno)!;
    expect(saida.distanceTo(poloUrinario())).toBeLessThan(0.08);
    // depois de sair, o túbulo proximal não volta a atravessar o corpúsculo
    const fora = tcp.slice(tcp.indexOf(saida) + 16);
    for (const p of fora) expect(p.distanceTo(C)).toBeGreaterThan(CORPUSCULO.raioParietalExterno + RAIOS.proximal * 0.9);
  });

  it('túbulo proximal: porção contorcida com voltas, toda no córtex, e porção reta retilínea descendo à medula', () => {
    const contorcida = amostrar(curvaProximalContorcida(), 800);
    const reta = amostrar(curvaProximalReta(), 20);
    // contorcida: só no córtex, sem cruzar a si mesma (pontos distantes ao longo da curva não se tocam)
    expect(Math.min(...contorcida.map((p) => p.y))).toBeGreaterThan(REGIOES.juncao);
    const passo = curvaProximalContorcida().getLength() / 800;
    const salto = Math.ceil((4 * RAIOS.proximal) / passo);
    let menor = Infinity;
    for (let i = 0; i < contorcida.length; i += 4)
      for (let j = i + salto; j < contorcida.length; j += 4) menor = Math.min(menor, contorcida[i].distanceTo(contorcida[j]));
    expect(menor).toBeGreaterThan(2 * RAIOS.proximal);
    // várias voltas: quatro passadas em serpentina e o retorno (o sentido em x inverte pelo menos 5 vezes)
    const sentidos: number[] = [];
    for (let i = 10; i < contorcida.length; i += 10) {
      const dx = contorcida[i].x - contorcida[i - 10].x;
      if (Math.abs(dx) > 0.02 && sentidos.at(-1) !== Math.sign(dx)) sentidos.push(Math.sign(dx));
    }
    expect(sentidos.length - 1).toBeGreaterThanOrEqual(5);
    // reta: vertical, começa onde a contorcida termina (no córtex) e acaba na medula
    for (const p of reta) {
      expect(p.x).toBeCloseTo(ALCA.xDescendente, 6);
      expect(p.z).toBeCloseTo(0, 6);
    }
    expect(reta[0].distanceTo(contorcida.at(-1)!)).toBeLessThan(1e-6);
    expect(reta[0].y).toBeGreaterThan(REGIOES.juncao);
    expect(reta.at(-1)!.y).toBeLessThan(REGIOES.juncao - 0.3);
    // a contorcida chega à reta já quase na vertical (passagem marcada só pelo trecho reto e pelo calibre)
    const chegada = curvaProximalContorcida().getTangentAt(1);
    expect(chegada.y).toBeLessThan(-0.95);
    expect(RAIOS.proximalReto).toBeLessThan(RAIOS.proximal);
    expect(RAIOS.proximalReto).toBeGreaterThan(RAIOS.delgado);
    // continua no ramo descendente delgado, na mesma vertical
    const delgado = amostrar(curvaDescendenteDelgado(), 20);
    expect(delgado[0].distanceTo(reta.at(-1)!)).toBeLessThan(1e-6);
    for (const p of delgado) expect(p.x).toBeCloseTo(ALCA.xDescendente, 6);
  });

  it('comprimentos: o túbulo proximal é o segmento mais longo; o contorcido proximal é bem mais longo que o distal', () => {
    const contorcido = curvaProximalContorcida().getLength();
    const proximal = contorcido + curvaProximalReta().getLength();
    const distal = curvaDistal().getLength();
    const espesso = curvaAscendenteEspesso().getLength();
    const delgado = curvaDescendenteDelgado().getLength();
    expect(contorcido).toBeGreaterThan(1.5 * distal);
    expect(proximal).toBeGreaterThan(espesso);
    expect(proximal).toBeGreaterThan(distal);
    expect(proximal).toBeGreaterThan(delgado);
    // o distal continua contorcido (não é um tubo reto até o ducto coletor)
    expect(distal).toBeGreaterThan(1.4 * curvaDistal().getPoint(0).distanceTo(curvaDistal().getPoint(1)));
  });

  it('alça de Henle em grampo: o ramo ascendente espesso sobe paralelo e junto ao descendente até o córtex', () => {
    const espesso = amostrar(curvaAscendenteEspesso(), 800);
    const separacao = ALCA.xAscendente - ALCA.xDescendente;
    // perto: de 1,5 a 3 diâmetros do túbulo proximal reto
    expect(separacao).toBeGreaterThan(RAIOS.proximalReto + RAIOS.espesso);
    expect(separacao).toBeLessThan(0.3);
    // trecho ascendente da alça, da medula até y = 0,3: sempre na mesma vertical, a menos de 0,35 do descendente
    const subida = espesso.filter((p) => p.y > ALCA.fimDelgado && p.y < 0.3 && p.x > (ALCA.xDescendente + ALCA.xAscendente) / 2);
    expect(subida.length).toBeGreaterThan(100);
    for (const p of subida) {
      expect(Math.abs(p.x - ALCA.xAscendente)).toBeLessThan(0.02);
      expect(Math.hypot(p.x - ALCA.xDescendente, p.z)).toBeLessThan(0.35);
      expect(Math.hypot(p.x - ALCA.xDescendente, p.z)).toBeGreaterThan(RAIOS.proximal + RAIOS.espesso);
    }
    // na medula, os dois ramos ficam a 0,2 um do outro
    for (const p of subida.filter((q) => q.y < REGIOES.juncao)) expect(Math.hypot(p.x - ALCA.xDescendente, p.z)).toBeLessThan(0.22);
    // e o ramo espesso não atravessa a porção contorcida do proximal nem o corpúsculo
    const contorcida = amostrar(curvaProximalContorcida(), 500);
    let menor = Infinity;
    for (const p of espesso) for (const q of contorcida) menor = Math.min(menor, p.distanceTo(q));
    expect(menor).toBeGreaterThan(RAIOS.proximal + RAIOS.espesso);
    for (const p of espesso) expect(p.distanceTo(C)).toBeGreaterThan(CORPUSCULO.raioParietalExterno + RAIOS.espesso);
  });

  it('mácula densa a menos de 0,15 do polo vascular do próprio corpúsculo, entre as arteríolas', () => {
    const pv = polovascular();
    const face = centroFaceMacula();
    // 0,15 ≈ um terço do raio da cápsula: só cabem ali as células mesangiais extraglomerulares
    expect(face.distanceTo(pv)).toBeLessThan(0.15);
    expect(face.distanceTo(pv)).toBeLessThan(CORPUSCULO.raioParietalExterno / 3);
    // a placa fica no fim do ramo ascendente espesso; a cor do contorcido distal começa logo depois dela
    const m = pontoMacula();
    const fimEspesso = curvaAscendenteEspesso().getPoint(1);
    expect(curvaDistal().getPoint(0).distanceTo(fimEspesso)).toBeLessThan(1e-6);
    expect(fimEspesso.z - m.z).toBeGreaterThanOrEqual(MACULA.comprimento / 2);
    expect(fimEspesso.z - m.z).toBeLessThan(MACULA.comprimento / 2 + 0.03);
    expect(Math.hypot(fimEspesso.x - m.x, fimEspesso.y - m.y)).toBeLessThan(0.01);
    // a placa inteira (ao longo de z) está sobre o ramo espesso
    const espessoPts = amostrar(curvaAscendenteEspesso(), 800);
    for (const dz of [-MACULA.comprimento / 2, 0, MACULA.comprimento / 2]) {
      const alvo = new THREE.Vector3(m.x, m.y, m.z + dz);
      expect(Math.min(...espessoPts.map((p) => p.distanceTo(alvo)))).toBeLessThan(0.01);
    }
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
    for (const c of [curvaProximalContorcida(), curvaProximalReta(), curvaDescendenteDelgado(), curvaAscendenteEspesso()])
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

  it('pneumócitos na parede: tipo I no revestimento; tipo II embutido na parede, espalhado, um junto ao encontro com o alvéolo de trás', () => {
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
      // embutido na parede: a base passa do revestimento (raio da luz) para dentro do septo, sem chegar aos
      // capilares; o ápice faz saliência na luz
      const base = d + TIPO_II_DIMENSOES[1] / 2;
      const apice = d - TIPO_II_DIMENSOES[1] / 2;
      expect(base - HEROI.raio).toBeCloseTo(TIPO_II_EMBUTIDO, 6);
      expect(base).toBeLessThan(capilarDe(HEROI.raio, HEROI.parede).eixo - capilarDe(HEROI.raio, HEROI.parede).raio);
      expect(apice).toBeLessThan(HEROI.raio - 0.03);
      expect(naParede(p[0] + 12)).toBe(true); // a célula inteira fica na parede, longe da borda da boca
      expect(centro.z).toBeLessThanOrEqual(0);
    }
    // espalhados pela parede, e não em fila junto à boca
    const polaresII = TIPO_II.map((p) => p[0]);
    expect(Math.max(...polaresII) - Math.min(...polaresII)).toBeGreaterThan(60);
    // um deles junto ao encontro com o alvéolo de trás (onde os dois septos se tocam, perto do poro)
    const vizinho = luzes.find((l) => l.id === ID_VIZINHO_DO_PORO)!;
    const rumoAoVizinho = vizinho.centro.clone().sub(c).normalize();
    const angulos = TIPO_II.map((p) => (direcaoHeroi(p[0], p[1]).angleTo(rumoAoVizinho) * 180) / Math.PI);
    expect(Math.min(...angulos)).toBeLessThan(40);
    // e nenhum em cima do poro, da barreira ou do macrófago
    for (const p of TIPO_II) {
      const meio = TIPO_II_DIMENSOES[0] / 2;
      expect(centroTipoII(p).distanceTo(centroPoro())).toBeGreaterThan(meio + PORO.raioAnel + PORO.tubo);
      expect(centroTipoII(p).distanceTo(centroMacrofago())).toBeGreaterThan(meio + MACROFAGO.raio);
      expect(centroTipoII(p).distanceTo(c.clone().addScaledVector(direcaoHeroi(BARREIRA.polar, BARREIRA.azimute), HEROI.raio))).toBeGreaterThan(meio + BARREIRA.abertura * HEROI.raio);
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

  it('macrófago na luz, encostado no revestimento; poro no septo comum com o alvéolo de trás do saco', () => {
    const c = v(HEROI.centro);
    expect(centroMacrofago().distanceTo(c)).toBeLessThan(HEROI.raio);
    expect(centroMacrofago().distanceTo(c)).toBeGreaterThan(HEROI.raio * 0.7);
    const poro = centroPoro();
    expect(Math.abs(poro.distanceTo(c) - HEROI.raio)).toBeLessThan(0.01);
    // o vizinho do poro é um alvéolo desenhado, que se abre no mesmo saco alveolar (nenhum alvéolo abre para o vazio)
    const vizinho = ALVEOLOS.find((a) => a.id === ID_VIZINHO_DO_PORO)!;
    expect(vizinho.grupo).toBe('saco');
    for (const a of ALVEOLOS) expect(['ducto', 'saco', 'bronquiolo']).toContain(a.grupo);
    const cv = v(vizinho.centro);
    // o poro aponta para o vizinho (a poucos graus da linha entre os centros) e fica na parede, fora da boca
    const dir = cv.clone().sub(c).normalize();
    expect((dir.angleTo(direcaoDoPoro()) * 180) / Math.PI).toBeLessThan(6);
    const bordaDaBoca = 180 - (HEROI.meiaAbertura * 180) / Math.PI;
    const meioAnguloDoAnel = ((PORO.raioAnel + PORO.tubo) / HEROI.raio) * (180 / Math.PI);
    expect(PORO.polar + meioAnguloDoAnel).toBeLessThan(bordaDaBoca);
    // septo comum: as luzes não se tocam, mas as paredes se encostam (ou se interpenetram) ali
    const distancia = cv.distanceTo(c);
    expect(distancia).toBeGreaterThan(HEROI.raio + vizinho.raio);
    expect(distancia).toBeLessThan(HEROI.raio + HEROI.parede + vizinho.raio + vizinho.parede);
    // o canal é curto (um orifício no septo): vai do revestimento à luz do vizinho
    const canal = canalDoPoro();
    expect(canal.comprimento).toBeGreaterThan(0.03);
    expect(canal.comprimento).toBeLessThan(HEROI.parede + vizinho.parede);
    const fim = canal.centro.clone().addScaledVector(direcaoDoPoro(), canal.comprimento / 2);
    expect(fim.distanceTo(cv)).toBeCloseTo(vizinho.raio, 3);
    // anel fino (bem menor que a boca de um alvéolo)
    expect(PORO.raioAnel).toBeLessThan(0.05);
    expect(PORO.tubo).toBeLessThan(0.012);
    // e os capilares em anel do alvéolo em corte não passam por dentro do orifício
    for (const polar of POLARES_CAPILARES_HEROI) expect(Math.abs(polar - PORO.polar)).toBeGreaterThan(meioAnguloDoAnel + 4);
  });

  it('ducto alveolar: luz do bronquíolo ao saco e um anel fino na boca de cada alvéolo que se abre nele', () => {
    expect(DUCTO.inicio).toBeCloseTo(BRONQUIOLO.fim, 6);
    expect(DUCTO.fim).toBeCloseTo(SACO.centro[0] - SACO.raio, 6);
    const doDucto = ALVEOLOS.filter((a) => a.grupo === 'ducto');
    expect(doDucto).toHaveLength(6);
    for (const a of doDucto) {
      const anel = anelDaBoca(a);
      // o anel fica na borda da boca: no meio da espessura da parede, no plano da abertura
      expect(Math.hypot(anel.raio, anel.altura)).toBeCloseTo(a.raio + a.parede / 2, 6);
      expect(Math.atan2(anel.raio, anel.altura)).toBeCloseTo(a.meiaAbertura, 6);
      // a boca encosta na luz do ducto: o centro do anel fica a menos de um raio de luz do eixo (x), dentro do trecho do ducto
      const centroAnel = v(a.centro).addScaledVector(v(a.abertura), anel.altura);
      expect(Math.hypot(centroAnel.y, centroAnel.z)).toBeLessThan(DUCTO.raioLuz);
      expect(centroAnel.x).toBeGreaterThan(DUCTO.inicio);
      expect(centroAnel.x).toBeLessThan(DUCTO.fim);
      // fino: nada de toro grosso em volta da luz
      expect(ANEL_DA_BOCA.tubo).toBeLessThan(a.parede / 2);
      expect(anel.raio).toBeLessThan(a.raio);
    }
  });

  it('taças vizinhas encostadas: sem vãos grandes entre as paredes ao longo do ducto e do saco', () => {
    const paredeExterna = (a: { raio: number; parede: number }) => a.raio + a.parede;
    const todos = [...ALVEOLOS, { ...HEROI, grupo: 'saco' as const }];
    for (const a of todos) {
      // vão até a parede do vizinho mais próximo (negativo = paredes interpenetradas, o septo comum do esquema)
      const vao = Math.min(...todos.filter((b) => b !== a).map((b) => v(a.centro).distanceTo(v(b.centro)) - paredeExterna(a) - paredeExterna(b)));
      expect(vao, a.id).toBeLessThan(0.06);
    }
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
    // exatamente sobre o capilar: sob a mancha, o capilar em anel encosta no revestimento (parte delgada do
    // septo), e entre o ar e o sangue sobra só a espessura esquemática da barreira
    const sobAMancha = eixoCapilarHeroi(BARREIRA.polar, BARREIRA.azimute);
    expect(sobAMancha - raio - HEROI.raio).toBeCloseTo(FOLGA_BARREIRA, 6);
    expect(FOLGA_BARREIRA).toBeGreaterThan(0);
    expect(FOLGA_BARREIRA).toBeLessThan(HEROI.parede / 10);
    // longe da mancha, o mesmo capilar volta para junto da face externa da parede (parte espessa)
    expect(eixoCapilarHeroi(BARREIRA.polar, BARREIRA.azimute + 60)).toBeCloseTo(eixo, 3);
    expect(eixoCapilarHeroi(POLARES_CAPILARES_HEROI.find((p) => p !== BARREIRA.polar)!, BARREIRA.azimute)).toBe(eixo);
    // a mancha cobre o trecho em que o capilar está junto do revestimento
    const meiaLargura = (BARREIRA.abertura * 180) / Math.PI / Math.sin((BARREIRA.polar * Math.PI) / 180);
    expect(eixoCapilarHeroi(BARREIRA.polar, BARREIRA.azimute + meiaLargura / 2) - raio - HEROI.raio).toBeLessThan(HEROI.parede / 3);
  });

  it('luzes alveolares não se sobrepõem', () => {
    for (let i = 0; i < luzes.length; i++)
      for (let j = i + 1; j < luzes.length; j++)
        expect(luzes[i].centro.distanceTo(luzes[j].centro), `${luzes[i].id} × ${luzes[j].id}`).toBeGreaterThan(luzes[i].raio + luzes[j].raio);
  });
});
