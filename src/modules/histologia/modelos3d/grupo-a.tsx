// Modelos 3D da histologia, grupo A (néfron e alvéolo). Textos em content/histologia/modelos3d-a.json.
// Esquemas fora de escala, com cores convencionais (não são cores de HE). Geometria pura e testável em
// geometria-nefron.ts e geometria-alveolo.ts; aqui só a montagem com <Parte>/<Malha> do núcleo 3D.
// Prioridade de toque: faixas e volumes translúcidos baixos; paredes e túbulos médios; células e vasos altos.
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { ModeloEstagio } from '../../embriologia/modelos/index.ts';
import { Malha, Parte } from '../../embriologia/tres/nucleo.tsx';
import { girarYPara, vec, type V3 } from './geometria-comum.ts';
import {
  CORPUSCULO,
  curvaAferente,
  curvaAscendenteEspesso,
  curvaDescendenteDelgado,
  curvaDistal,
  curvaEferente,
  curvaProximalContorcida,
  curvaProximalReta,
  curvasAlcasGlomerulares,
  curvasPontesGlomerulares,
  DUCTO_X,
  MACULA,
  perfilCapsula,
  perfilDuctoColetor,
  pontoMacula,
  posicoesMesangiaisExtraglomerulares,
  posicoesPodocitos,
  RAIO_CORPO_PODOCITO,
  RAIO_MESANGIAL_EXTRA,
  RAIO_PONTE,
  RAIO_PROLONGAMENTO,
  RAIOS,
  REGIOES,
  trechoJustaglomerular,
} from './geometria-nefron.ts';
import {
  ALVEOLOS,
  ANEL_DA_BOCA,
  anelDaBoca,
  BARREIRA,
  baseNoHeroi,
  BRONQUIOLO,
  capilaresHeroi,
  capilaresLocais,
  canalDoPoro,
  capilarDe,
  centroMacrofago,
  centroNucleoTipoI,
  centroPoro,
  centroTipoII,
  CORPOS_LAMELARES_LOCAIS,
  direcaoDoPoro,
  direcaoHeroi,
  DUCTO,
  HEROI,
  MACROFAGO,
  NUCLEOS_TIPO_I,
  RAIO_NUCLEO_TIPO_I,
  orientacaoAlveolo,
  orientacaoTipoII,
  perfilTaca,
  PORO,
  RAIO_CORPO_LAMELAR,
  SACO,
  TIPO_II,
  TIPO_II_DIMENSOES,
  type DefAlveolo,
} from './geometria-alveolo.ts';

type Geometrias = Record<string, THREE.BufferGeometry | THREE.BufferGeometry[]>;

/** Cria as geometrias uma vez por montagem e as libera no desmonte. */
function useGeometrias<T extends Geometrias>(fabrica: () => T): T {
  const g = useMemo(fabrica, []);
  useEffect(() => () => {
    for (const v of Object.values(g)) for (const x of Array.isArray(v) ? v : [v]) x.dispose();
  }, [g]);
  return g;
}

/** Junta várias geometrias transformadas numa só (uma chamada de desenho; não refinável — objetos pequenos). */
function unir(partes: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const unida = mergeGeometries(partes, false);
  if (!unida) throw new Error('geometrias incompatíveis para unir');
  for (const p of partes) p.dispose();
  unida.userData.semRefino = true;
  return unida;
}
const transformada = (g: THREE.BufferGeometry, posicao: THREE.Vector3, rotacao = new THREE.Quaternion(), escala: V3 = [1, 1, 1]) =>
  g.applyMatrix4(new THREE.Matrix4().compose(posicao, rotacao, vec(escala)));
const euler = (q: THREE.Quaternion) => new THREE.Euler().setFromQuaternion(q);

const COR_NEFRON = {
  cortex: '#f2b8a0',
  medula: '#b39ddb',
  capsula: '#7dd3fc',
  espaco: '#fde68a',
  glomerulo: '#e11d48',
  podocito: '#c4b5fd',
  aferente: '#b91c1c',
  eferente: '#fb7185',
  justaglomerular: '#facc15',
  mesangial: '#a3e635',
  macula: '#1d4ed8',
  proximal: '#f59e0b',
  delgado: '#67e8f9',
  espesso: '#22c55e',
  distal: '#a78bfa',
  coletor: '#94a3b8',
};

// ------------------------------------------------------------------------------------------- néfron
export const PARTES_NEFRON = [
  'cortex-renal',
  'medula-renal',
  'arteriola-aferente',
  'glomerulo',
  'arteriola-eferente',
  'capsula-glomerular',
  'espaco-urinario',
  'podocito',
  'tubulo-contorcido-proximal',
  'ramo-descendente-delgado',
  'ramo-ascendente-espesso',
  'macula-densa',
  'celulas-justaglomerulares',
  'celulas-mesangiais-extraglomerulares',
  'tubulo-contorcido-distal',
  'ducto-coletor',
];

/** Néfron cortical (alça curta), corpúsculo aberto em janela e ducto coletor à parte. */
export function ModeloNefron() {
  const g = useGeometrias(() => {
    const largura = REGIOES.xMax - REGIOES.xMin;
    const profundidade = REGIOES.zMax - REGIOES.zMin;
    const podocitos = posicoesPodocitos();
    const anelColetor = (y: number, r: number) => transformada(new THREE.TorusGeometry(r, 0.012, 6, 24), new THREE.Vector3(DUCTO_X, y, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)));
    const perfil = perfilDuctoColetor();
    const raioColetorEm = (y: number) => {
      // interpolação linear do perfil (pontos de raio > 0, de cima para baixo)
      const pts = perfil.filter((p) => p.x > 0);
      for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]];
        if (y <= a.y && y >= b.y) return a.x + ((b.x - a.x) * (a.y - y)) / (a.y - b.y);
      }
      return pts[pts.length - 1].x;
    };
    return {
      cortex: new THREE.BoxGeometry(largura, REGIOES.topo - REGIOES.juncao, profundidade),
      medula: new THREE.BoxGeometry(largura, REGIOES.juncao - REGIOES.base, profundidade),
      capsula: new THREE.LatheGeometry(perfilCapsula(), 48),
      espaco: new THREE.SphereGeometry(CORPUSCULO.raioEspaco, 40, 28),
      alcas: curvasAlcasGlomerulares().map((c) => new THREE.TubeGeometry(c, 36, RAIOS.alcaCapilar, 8, false)),
      // pontes curtas entre alças vizinhas (o tufo é uma rede); pequenas, numa só malha
      pontes: unir(curvasPontesGlomerulares().map((c) => new THREE.TubeGeometry(c, 8, RAIO_PONTE, 6, false))),
      // corpos achatados apoiados nos capilares, com prolongamentos ao longo deles e em volta deles
      podocitos: unir(
        podocitos.flatMap((p) => [
          transformada(new THREE.SphereGeometry(RAIO_CORPO_PODOCITO, 12, 8), p.corpo, girarYPara(p.normal), [1, 0.5, 1]),
          ...p.prolongamentos.map((pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 6, RAIO_PROLONGAMENTO, 5, false)),
        ]),
      ),
      aferente: new THREE.TubeGeometry(curvaAferente(), 48, RAIOS.aferente, 12, false),
      eferente: new THREE.TubeGeometry(curvaEferente(), 48, RAIOS.eferente, 10, false),
      tampa: new THREE.SphereGeometry(1, 16, 12),
      justaglomerular: new THREE.TubeGeometry(trechoJustaglomerular(), 16, RAIOS.aferente + 0.024, 12, false),
      mesangial: unir(posicoesMesangiaisExtraglomerulares().map((p) => transformada(new THREE.SphereGeometry(RAIO_MESANGIAL_EXTRA, 10, 8), p, undefined, [1, 0.8, 1]))),
      // setor de cilindro fechado: a face da frente aparece como um crescente sob o túbulo
      macula: new THREE.CylinderGeometry(MACULA.raio, MACULA.raio, MACULA.comprimento, 16, 1, false, -MACULA.arco / 2, MACULA.arco),
      // túbulo proximal: porção contorcida (voltas) e porção reta, retilínea e um pouco mais fina
      proximal: new THREE.TubeGeometry(curvaProximalContorcida(), 300, RAIOS.proximal, 14, false),
      proximalReto: new THREE.TubeGeometry(curvaProximalReta(), 8, RAIOS.proximalReto, 14, false),
      delgado: new THREE.TubeGeometry(curvaDescendenteDelgado(), 8, RAIOS.delgado, 10, false),
      espesso: new THREE.TubeGeometry(curvaAscendenteEspesso(), 200, RAIOS.espesso, 12, false),
      distal: new THREE.TubeGeometry(curvaDistal(), 100, RAIOS.distal, 12, false),
      // ducto coletor em estilo distinto: prisma facetado com anéis (não faz parte do néfron)
      coletor: new THREE.LatheGeometry(perfil, 12),
      aneisColetor: unir([1.5, 1.05, 0.6, 0.15, -0.3, -0.75, -1.2].map((y) => anelColetor(y, raioColetorEm(y) + 0.004))),
    };
  });
  const c = CORPUSCULO.centro;
  const fimContorcido = curvaProximalContorcida().getPoint(1);
  const fimProximal = curvaProximalReta().getPoint(1);
  const inicioEspesso = curvaAscendenteEspesso().getPoint(0);
  const fimAferente = curvaAferente().getPoint(1);
  const fimEferente = curvaEferente().getPoint(1);
  const m = pontoMacula();
  const meiaAlturaCortex = (REGIOES.topo + REGIOES.juncao) / 2;
  const meiaAlturaMedula = (REGIOES.juncao + REGIOES.base) / 2;
  const xMeio = (REGIOES.xMin + REGIOES.xMax) / 2;
  return (
    <group position={[0, -0.015, 0]}>
      <Parte id="cortex-renal" cor={COR_NEFRON.cortex} opacidade={0.1} prioridade={0.5} rotulo={[REGIOES.xMin, REGIOES.topo, REGIOES.zMax]}>
        <Malha geometria={g.cortex} posicao={[xMeio, meiaAlturaCortex, 0]} />
      </Parte>
      <Parte id="medula-renal" cor={COR_NEFRON.medula} opacidade={0.12} prioridade={0.5} rotulo={[REGIOES.xMin, REGIOES.base, REGIOES.zMax]}>
        <Malha geometria={g.medula} posicao={[xMeio, meiaAlturaMedula, 0]} />
      </Parte>
      <Parte id="arteriola-aferente" cor={COR_NEFRON.aferente} prioridade={6} acabamentoOrganico>
        <Malha geometria={g.aferente} />
        <Malha geometria={g.tampa} posicao={fimAferente} escala={RAIOS.aferente} />
      </Parte>
      <Parte id="glomerulo" cor={COR_NEFRON.glomerulo} prioridade={6} acabamentoOrganico rotulo={[c[0], c[1] - 0.25, c[2] + 0.12]}>
        {g.alcas.map((a, i) => <Malha key={i} geometria={a} />)}
        <Malha geometria={g.pontes} />
      </Parte>
      <Parte id="arteriola-eferente" cor={COR_NEFRON.eferente} prioridade={6} acabamentoOrganico>
        <Malha geometria={g.eferente} />
        <Malha geometria={g.tampa} posicao={fimEferente} escala={RAIOS.eferente} />
      </Parte>
      <Parte id="capsula-glomerular" cor={COR_NEFRON.capsula} opacidade={0.42} prioridade={3} rotulo={[c[0] - CORPUSCULO.raioParietalExterno, c[1], c[2]]}>
        {/* torno em torno do eixo da janela (+y local → +z) */}
        <Malha geometria={g.capsula} posicao={c} rotacao={[Math.PI / 2, 0, 0]} />
      </Parte>
      <Parte id="espaco-urinario" cor={COR_NEFRON.espaco} opacidade={0.16} prioridade={3} rotulo={[c[0] + 0.2, c[1] - 0.2, c[2] + 0.33]}>
        <Malha geometria={g.espaco} posicao={c} />
      </Parte>
      <Parte id="podocito" cor={COR_NEFRON.podocito} prioridade={7} acabamentoOrganico>
        <Malha geometria={g.podocitos} />
      </Parte>
      <Parte id="tubulo-contorcido-proximal" cor={COR_NEFRON.proximal} prioridade={6} acabamentoOrganico rotulo={[-1.18, 0.4, 0.42]}>
        <Malha geometria={g.proximal} />
        {/* ombro arredondado onde a porção contorcida passa à reta */}
        <Malha geometria={g.tampa} posicao={fimContorcido} escala={RAIOS.proximal} />
        <Malha geometria={g.proximalReto} />
        <Malha geometria={g.tampa} posicao={fimProximal} escala={RAIOS.proximalReto} />
      </Parte>
      <Parte id="ramo-descendente-delgado" cor={COR_NEFRON.delgado} prioridade={6} acabamentoOrganico>
        <Malha geometria={g.delgado} />
      </Parte>
      <Parte id="ramo-ascendente-espesso" cor={COR_NEFRON.espesso} prioridade={6} acabamentoOrganico rotulo={[-0.8, -0.4, 0.04]}>
        <Malha geometria={g.espesso} />
        <Malha geometria={g.tampa} posicao={inicioEspesso} escala={RAIOS.espesso} />
      </Parte>
      <Parte id="macula-densa" cor={COR_NEFRON.macula} prioridade={8} acabamentoOrganico>
        <Malha geometria={g.macula} posicao={m} rotacao={[Math.PI / 2, 0, 0]} />
      </Parte>
      <Parte id="celulas-justaglomerulares" cor={COR_NEFRON.justaglomerular} prioridade={8} acabamentoOrganico>
        <Malha geometria={g.justaglomerular} />
      </Parte>
      <Parte id="celulas-mesangiais-extraglomerulares" cor={COR_NEFRON.mesangial} prioridade={8} acabamentoOrganico>
        <Malha geometria={g.mesangial} />
      </Parte>
      <Parte id="tubulo-contorcido-distal" cor={COR_NEFRON.distal} prioridade={6} acabamentoOrganico rotulo={[0.6, 1.14, 0.25]}>
        <Malha geometria={g.distal} />
      </Parte>
      <Parte id="ducto-coletor" cor={COR_NEFRON.coletor} prioridade={6} sombreamentoPlano rugosidade={0.8} rotulo={[DUCTO_X + 0.1, -1.0, 0]}>
        <Malha geometria={g.coletor} posicao={[DUCTO_X, 0, 0]} />
        <Malha geometria={g.aneisColetor} />
      </Parte>
    </group>
  );
}

// ------------------------------------------------------------------------------------------ alvéolo
const COR_ALVEOLO = {
  bronquiolo: '#e7b18f',
  ducto: '#e76f51',
  saco: '#bae6fd',
  alveolo: '#f9c5d1',
  septo: '#e08fa5',
  capilar: '#dc2626',
  tipoI: '#fecdd3',
  tipoII: '#38bdf8',
  lamelar: '#f8fafc',
  macrofago: '#a16207',
  barreira: '#facc15',
  poro: '#7c3aed',
};

export const PARTES_ALVEOLO = [
  'bronquiolo-respiratorio',
  'ducto-alveolar',
  'saco-alveolar',
  'alveolo',
  'septo-interalveolar',
  'capilar',
  'pneumocito-tipo-i',
  'pneumocito-tipo-ii',
  'corpos-lamelares',
  'macrofago-alveolar',
  'barreira-hematoaerea',
  'poro-alveolar',
];

/**
 * Enquadramento: o eixo bronquíolo → saco fica em diagonal (cerca de 45°), que aproveita igualmente a tela em pé
 * do celular e a tela larga; o ponto entre o saco e o alvéolo em corte vai para a origem, para onde a
 * aproximação (pinça/roda) converge.
 */
const GIRO_ALVEOLO: V3 = [0.2, -0.18, 0.78];
const FOCO_ALVEOLO: V3 = [SACO.centro[0] + 0.08, 0, -0.1];
const chaveTaca = (a: DefAlveolo) => `${a.raio}:${a.parede}:${a.meiaAbertura.toFixed(4)}`;
const chaveCapilar = (a: DefAlveolo) => `${a.raio}:${a.parede}`;

/** Bronquíolo respiratório → ducto alveolar → saco alveolar; o alvéolo maior, à direita, aberto em corte. */
export function ModeloAlveolo() {
  const g = useGeometrias(() => {
    const comp = BRONQUIOLO.fim - BRONQUIOLO.inicio;
    const { raioExterno: re, raioInterno: ri } = BRONQUIOLO;
    const tacas: Record<string, THREE.BufferGeometry> = {};
    for (const a of ALVEOLOS) {
      const k = chaveTaca(a);
      // taça de parede dupla (face externa + revestimento no raio da luz), aberta na boca (+y local)
      tacas[k] ??= new THREE.LatheGeometry(perfilTaca(a.raio, a.parede, a.meiaAbertura), 32);
    }
    const capilares: Record<string, THREE.BufferGeometry[]> = {};
    for (const a of ALVEOLOS) {
      const k = chaveCapilar(a);
      capilares[k] ??= capilaresLocais(a.raio, a.parede).map((c, i) => new THREE.TubeGeometry(c, i === 0 ? 64 : 40, capilarDe(a.raio, a.parede).raio, 8, i === 0));
    }
    const h = HEROI;
    const th = h.meiaAbertura;
    const heroi = capilaresHeroi();
    const celula = (p: [number, number]) => new THREE.Matrix4().compose(centroTipoII(p), orientacaoTipoII(p), new THREE.Vector3(1, 1, 1));
    const mac = baseNoHeroi(MACROFAGO.polar, MACROFAGO.azimute);
    const cm = centroMacrofago();
    const dPoro = direcaoDoPoro();
    const canal = canalDoPoro();
    // botões de músculo liso do ducto: anel fino na borda da boca de cada alvéolo que se abre nele
    const aneis = ALVEOLOS.filter((a) => a.grupo === 'ducto').map((a) => {
      const anel = anelDaBoca(a);
      return new THREE.TorusGeometry(anel.raio, ANEL_DA_BOCA.tubo, 8, 40)
        .rotateX(Math.PI / 2)
        .translate(0, anel.altura, 0)
        .applyMatrix4(new THREE.Matrix4().compose(vec(a.centro), orientacaoAlveolo(a), new THREE.Vector3(1, 1, 1)));
    });
    return {
      bronquiolo: new THREE.LatheGeometry(
        [new THREE.Vector2(re, -comp / 2), new THREE.Vector2(re, comp / 2), new THREE.Vector2(ri, comp / 2), new THREE.Vector2(ri, -comp / 2), new THREE.Vector2(re, -comp / 2)],
        40,
      ),
      // luz do ducto alveolar (volume translúcido, do bronquíolo ao saco) e os anéis das bocas
      luzDucto: new THREE.CylinderGeometry(DUCTO.raioLuz, DUCTO.raioLuz, DUCTO.fim - DUCTO.inicio, 32, 1, false),
      aneisDaBoca: unir(aneis),
      saco: new THREE.SphereGeometry(SACO.raio, 40, 28),
      tacas: Object.values(tacas),
      capilares: Object.values(capilares).flat(),
      // alvéolo em corte (referencial local: +y = boca, metade z ≤ 0)
      revestimento: new THREE.SphereGeometry(h.raio, 48, 32, Math.PI, Math.PI, th, Math.PI - th),
      nucleosI: unir(NUCLEOS_TIPO_I.map((p) => transformada(new THREE.SphereGeometry(RAIO_NUCLEO_TIPO_I, 12, 8), centroNucleoTipoI(p), girarYPara(direcaoHeroi(p[0], p[1])), [1, 0.3, 1]))),
      septoExterno: new THREE.SphereGeometry(h.raio + h.parede, 48, 32, Math.PI, Math.PI, th, Math.PI - th),
      septoCorte: new THREE.RingGeometry(h.raio, h.raio + h.parede, 48, 1, Math.PI / 2 + th, 2 * Math.PI - 2 * th),
      septoBorda: new THREE.LatheGeometry(
        [new THREE.Vector2(h.raio * Math.sin(th), h.raio * Math.cos(th)), new THREE.Vector2((h.raio + h.parede) * Math.sin(th), (h.raio + h.parede) * Math.cos(th))],
        24,
        Math.PI / 2,
        Math.PI,
      ),
      capilaresHeroi: heroi.curvas.map((c) => new THREE.TubeGeometry(c, 64, heroi.raio, 10, false)),
      tampasCapilares: unir(heroi.tampas.map((t) => transformada(new THREE.CircleGeometry(heroi.raio, 16), t.centro))),
      tipoII: unir(TIPO_II.map((p) => new RoundedBoxGeometry(...TIPO_II_DIMENSOES, 2, 0.03).applyMatrix4(celula(p)))),
      lamelares: unir(TIPO_II.flatMap((p) => CORPOS_LAMELARES_LOCAIS.map((l) => transformada(new THREE.SphereGeometry(RAIO_CORPO_LAMELAR, 10, 8), vec(l).applyMatrix4(celula(p)))))),
      macrofago: unir([
        transformada(new THREE.SphereGeometry(MACROFAGO.raio, 16, 12), cm, girarYPara(mac.normal), [1, 0.75, 1]),
        ...[mac.t1, mac.t2, mac.t1.clone().negate(), mac.t2.clone().negate()].map((t, i) => {
          const dir = t.clone().addScaledVector(mac.normal, -0.25 + 0.15 * (i % 2)).normalize();
          return transformada(new THREE.CapsuleGeometry(0.02, 0.06 + 0.012 * i, 4, 8), cm.clone().addScaledVector(dir, MACROFAGO.raio + 0.024), girarYPara(dir));
        }),
      ]),
      barreira: new THREE.SphereGeometry(h.raio - 0.004, 16, 6, 0, Math.PI * 2, 0, BARREIRA.abertura),
      poroAnel: transformada(new THREE.TorusGeometry(PORO.raioAnel, PORO.tubo, 10, 32), centroPoro(), new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dPoro)),
      poroCanal: transformada(new THREE.CylinderGeometry(PORO.raioCanal, PORO.raioCanal, canal.comprimento, 16, 1, true), canal.centro, girarYPara(dPoro)),
    };
  });
  // índice da geometria compartilhada de cada alvéolo (mesma ordem de inserção usada na fábrica)
  const indices = useMemo(() => {
    const tacas = [...new Set(ALVEOLOS.map(chaveTaca))];
    const capilares = [...new Set(ALVEOLOS.map(chaveCapilar))];
    return ALVEOLOS.map((a) => ({ taca: tacas.indexOf(chaveTaca(a)), capilar: capilares.indexOf(chaveCapilar(a)) }));
  }, []);
  const orientacoes = useMemo(() => ALVEOLOS.map((a) => euler(orientacaoAlveolo(a))), []);
  const giroBarreira = useMemo(() => euler(girarYPara(direcaoHeroi(BARREIRA.polar, BARREIRA.azimute))), []);
  const h = HEROI;
  // +y local da taça → −x (boca para o saco); o plano do corte fica em z = 0
  const giroHeroi: [number, number, number] = [0, 0, Math.PI / 2];
  const centroBronquiolo = (BRONQUIOLO.inicio + BRONQUIOLO.fim) / 2;
  const centroDucto = (DUCTO.inicio + DUCTO.fim) / 2;
  return (
    <group rotation={GIRO_ALVEOLO}>
    <group position={[-FOCO_ALVEOLO[0], -FOCO_ALVEOLO[1], -FOCO_ALVEOLO[2]]}>
      <Parte id="bronquiolo-respiratorio" cor={COR_ALVEOLO.bronquiolo} prioridade={4} acabamentoOrganico>
        <Malha geometria={g.bronquiolo} posicao={[centroBronquiolo, 0, 0]} rotacao={[0, 0, -Math.PI / 2]} />
      </Parte>
      {/* O ducto alveolar tem duas peças com o mesmo id (uma <Parte> tem um só material): a luz, translúcida,
          com a prioridade das paredes (a mais baixa do modelo; vence quando está à frente), e os anéis finos das
          bocas dos alvéolos, opacos. Seleção, ocultação e marcador valem para as duas. */}
      <Parte id="ducto-alveolar" cor={COR_ALVEOLO.ducto} opacidade={0.16} prioridade={4} rotulo={[centroDucto, 0, DUCTO.raioLuz]}>
        <Malha geometria={g.luzDucto} posicao={[centroDucto, 0, 0]} rotacao={[0, 0, -Math.PI / 2]} />
      </Parte>
      <Parte id="ducto-alveolar" cor={COR_ALVEOLO.ducto} prioridade={5} acabamentoOrganico rotulo={[centroDucto, 0, DUCTO.raioLuz]}>
        <Malha geometria={g.aneisDaBoca} />
      </Parte>
      <Parte id="saco-alveolar" cor={COR_ALVEOLO.saco} opacidade={0.18} prioridade={4} rotulo={[SACO.centro[0], SACO.centro[1] + 0.1, SACO.centro[2] + SACO.raio]}>
        <Malha geometria={g.saco} posicao={SACO.centro} />
      </Parte>
      <Parte id="alveolo" cor={COR_ALVEOLO.alveolo} prioridade={4} acabamentoOrganico>
        {ALVEOLOS.map((a, i) => <Malha key={a.id} geometria={g.tacas[indices[i].taca]} posicao={a.centro} rotacao={orientacoes[i]} />)}
      </Parte>
      <Parte id="septo-interalveolar" cor={COR_ALVEOLO.septo} prioridade={4} acabamentoOrganico rotulo={[h.centro[0], h.centro[1] - h.raio - h.parede / 2, 0]}>
        <Malha geometria={g.septoExterno} posicao={h.centro} rotacao={giroHeroi} />
        <Malha geometria={g.septoCorte} posicao={h.centro} rotacao={giroHeroi} />
        <Malha geometria={g.septoBorda} posicao={h.centro} rotacao={giroHeroi} />
      </Parte>
      <Parte id="capilar" cor={COR_ALVEOLO.capilar} prioridade={7} acabamentoOrganico>
        {ALVEOLOS.flatMap((a, i) =>
          g.capilares.slice(indices[i].capilar * 2, indices[i].capilar * 2 + 2).map((c, j) => <Malha key={`${a.id}-${j}`} geometria={c} posicao={a.centro} rotacao={orientacoes[i]} />),
        )}
        {g.capilaresHeroi.map((c, i) => <Malha key={`h-${i}`} geometria={c} />)}
        <Malha geometria={g.tampasCapilares} />
      </Parte>
      <Parte id="pneumocito-tipo-i" cor={COR_ALVEOLO.tipoI} opacidade={0.82} prioridade={4} acabamentoOrganico>
        <Malha geometria={g.revestimento} posicao={h.centro} rotacao={giroHeroi} />
        <Malha geometria={g.nucleosI} />
      </Parte>
      <Parte id="pneumocito-tipo-ii" cor={COR_ALVEOLO.tipoII} opacidade={0.78} prioridade={8} acabamentoOrganico>
        <Malha geometria={g.tipoII} />
      </Parte>
      <Parte id="corpos-lamelares" cor={COR_ALVEOLO.lamelar} prioridade={9}>
        <Malha geometria={g.lamelares} />
      </Parte>
      <Parte id="macrofago-alveolar" cor={COR_ALVEOLO.macrofago} prioridade={8} acabamentoOrganico>
        <Malha geometria={g.macrofago} />
      </Parte>
      <Parte id="barreira-hematoaerea" cor={COR_ALVEOLO.barreira} prioridade={8}>
        <Malha geometria={g.barreira} posicao={h.centro} rotacao={giroBarreira} />
      </Parte>
      <Parte id="poro-alveolar" cor={COR_ALVEOLO.poro} prioridade={8}>
        <Malha geometria={g.poroAnel} />
        <Malha geometria={g.poroCanal} />
      </Parte>
    </group>
    </group>
  );
}

export const MODELOS_HISTO_A: Record<string, ModeloEstagio> = {
  nefron: { Componente: ModeloNefron, partes: PARTES_NEFRON, camera: [0.35, -0.08, 1], raio: 1.75 },
  alveolo: { Componente: ModeloAlveolo, partes: PARTES_ALVEOLO, camera: [0.15, 0.3, 1], raio: 1.55 },
};
