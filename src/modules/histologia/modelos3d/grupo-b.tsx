// Modelos 3D da histologia, grupo B (lóbulo hepático, sarcômero e junções celulares). Textos em content/histologia/modelos3d-b.json.
// Esquemas fora de escala, com cores convencionais (não HE). Geometria pura e testável em geometria-*.ts.
// Toque: regiões translúcidas (espaço porta, bandas, células epiteliais) com prioridade baixa; estruturas
// (células, filamentos, vasos, junções) com prioridade alta e, entre si, empate → a mais próxima ganha.
// Elementos repetidos (hepatócitos, filamentos, cabeças de miosina, conexons...) vão mesclados numa malha por
// parte, com a resolução pelo fator do nível de qualidade; as peças paramétricas grandes ficam intactas
// para o refino automático (refinar.ts).
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type DependencyList } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ModeloEstagio } from '../../embriologia/modelos/index.ts';
import { Malha, Parte, useCena } from '../../embriologia/tres/nucleo.tsx';
import { assinarQualidade, fatorSegmentos } from '../../tres3d/qualidade.ts';
import {
  ALTURA_FATIA,
  LOBULO,
  geometriaCanaliculos,
  geometriaKupffer,
  geometriaLobulo,
  geometriaMoldura,
  geometriaPlacas,
  geometriaTrechos,
  geometriaTuboOco,
} from './geometria-lobulo.ts';
import {
  DESVIO_TITINA,
  SARCOMERO,
  bandas,
  geometriaCabecas,
  geometriaFinos,
  geometriaMolasTitina,
  geometriaReticulo,
  geometriaTitinaBandaA,
  redeFilamentos,
} from './geometria-sarcomero.ts';
import {
  JUNCOES,
  centrosCelulas,
  centrosNucleos,
  geometriaCelula,
  geometriaCinturao,
  geometriaConexons,
  geometriaDesmossomos,
  geometriaFaixa,
  geometriaHemidesmossomos,
  geometriaLamina,
  geometriaMicrovilosidades,
  geometriaQueratina,
} from './geometria-juncoes.ts';

type V3 = [number, number, number];

/** Fator de segmentos do nível de qualidade (1 em testes sem WebGL, salvo nível forçado). */
function useFator(): number {
  return useSyncExternalStore(assinarQualidade, fatorSegmentos, () => 1);
}

/** Geometria memorizada e descartada quando muda ou no desmonte. */
function useGeo<T extends THREE.BufferGeometry>(fabrica: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const g = useMemo(fabrica, deps);
  useEffect(() => () => g.dispose(), [g]);
  return g;
}

/** Eixo +y das geometrias de cilindro/toro deitado ao longo de x. */
const AO_LONGO_DE_X: V3 = [0, 0, -Math.PI / 2];

// =============================================================================================
// 1) Lóbulo hepático clássico
// =============================================================================================
const COR_LOBULO = {
  moldura: '#a9bcff',
  veiaCentral: '#3b82f6',
  hepatocito: '#d9a27c',
  sinusoide: '#d9534f',
  disse: '#f2cf5b',
  kupffer: '#33e0f0',
  canaliculo: '#2fbf6a',
  conjuntivo: '#e9e2d0',
  veiaPorta: '#8b5cf6',
  arteria: '#c8243f',
  ducto: '#178a4a',
};

export const PARTES_LOBULO = [
  'lobulo-hepatico',
  'veia-centrolobular',
  'placas-de-hepatocitos',
  'sinusoide-hepatico',
  'espaco-perissinusoidal',
  'celula-de-kupffer',
  'canaliculo-biliar',
  'triade-portal',
  'ramo-da-veia-porta',
  'ramo-da-arteria-hepatica',
  'ducto-biliar',
];

function ModeloLobulo() {
  const fator = useFator();
  const lob = geometriaLobulo();
  const placas = useGeo(() => geometriaPlacas(lob), [lob]);
  const disse = useGeo(() => geometriaTrechos(lob.sinusoides, 0, fator), [lob, fator]);
  const luz = useGeo(() => geometriaTrechos(lob.sinusoides, LOBULO.disse, fator), [lob, fator]);
  const kupffer = useGeo(() => geometriaKupffer(lob, fator), [lob, fator]);
  const canaliculos = useGeo(() => geometriaCanaliculos(lob, fator), [lob, fator]);
  const moldura = useGeo(() => geometriaMoldura(), []);
  const veia = useGeo(() => geometriaTuboOco(LOBULO.raioVeia - LOBULO.paredeVeia, LOBULO.raioVeia, LOBULO.alturaVasos, 40), []);
  const t0 = lob.triades[0];
  const veiaPorta = useGeo(() => geometriaTuboOco(t0.veia.raioInterno, t0.veia.raioExterno, LOBULO.alturaVasos, 32), [t0]);
  const arteria = useGeo(() => geometriaTuboOco(t0.arteria.raioInterno, t0.arteria.raioExterno, LOBULO.alturaVasos, 24), [t0]);
  const ducto = useGeo(() => geometriaTuboOco(t0.ducto.raioInterno, t0.ducto.raioExterno, LOBULO.alturaVasos * 0.94, 24), [t0]);
  const conjuntivo = useGeo(() => new THREE.CylinderGeometry(LOBULO.raioPorta, LOBULO.raioPorta, LOBULO.alturaPorta, 40), []);

  const topo = ALTURA_FATIA / 2;
  const yMoldura = topo + 0.021;
  const apotema = LOBULO.raioHex * Math.cos(Math.PI / 6);
  // Âncoras dos marcadores: pontos voltados para a câmera padrão (de +z, por cima), no corpo de cada parte.
  const kFrente = lob.kupffer.reduce((m, k) => (k.centro[2] > m.centro[2] ? k : m), lob.kupffer[0]);
  const frente = lob.triades[1];
  const ao = (p: [number, number], y: number): V3 => [p[0], y, p[1]];
  /** parede externa do vaso voltada para a câmera, acima da fatia */
  const paredeDaFrente = (v: { centro: [number, number]; raioExterno: number }): V3 => [v.centro[0], 0.17, v.centro[1] + v.raioExterno];
  // Conjuntivo do espaço porta: borda de fora de uma coluna de trás (atrás dela não há parênquima no raio do toque).
  const atras = lob.triades[4].vertice;
  const fora = (LOBULO.raioHex + LOBULO.raioPorta) / LOBULO.raioHex;
  return (
    <group>
      {/* Moldura: limite imaginário entre os espaços porta (no ser humano não há septo em volta do lóbulo). */}
      <Parte id="lobulo-hepatico" cor={COR_LOBULO.moldura} opacidade={0.6} prioridade={6} rotulo={[0, yMoldura + 0.009, apotema]}>
        <Malha geometria={moldura} posicao={[0, yMoldura, 0]} />
        <Malha geometria={moldura} posicao={[0, -yMoldura, 0]} />
      </Parte>
      <Parte id="veia-centrolobular" cor={COR_LOBULO.veiaCentral} prioridade={6} rugosidade={0.5} rotulo={[0, LOBULO.alturaVasos / 2, LOBULO.raioVeia]}>
        <Malha geometria={veia} />
      </Parte>
      <Parte id="placas-de-hepatocitos" cor={COR_LOBULO.hepatocito} prioridade={6} rugosidade={0.7} rotulo={[0.25, topo, 0.95]}>
        <Malha geometria={placas} />
      </Parte>
      <Parte id="sinusoide-hepatico" cor={COR_LOBULO.sinusoide} opacidade={0.38} prioridade={6} rotulo={[0, 0.12, 0.6]}>
        <Malha geometria={luz} />
      </Parte>
      {/* Casca de Disse em volta da luz: prioridade menor que a do sinusoide que ela envolve. */}
      <Parte id="espaco-perissinusoidal" cor={COR_LOBULO.disse} opacidade={0.22} prioridade={5} rotulo={[0.14, 0.02, 1.07]}>
        <Malha geometria={disse} />
      </Parte>
      <Parte id="celula-de-kupffer" cor={COR_LOBULO.kupffer} prioridade={7} rugosidade={0.45} rotulo={kFrente?.centro}>
        <Malha geometria={kupffer} />
      </Parte>
      <Parte id="canaliculo-biliar" cor={COR_LOBULO.canaliculo} prioridade={6} rotulo={[-0.2, topo, 1.05]}>
        <Malha geometria={canaliculos} />
      </Parte>
      <Parte id="triade-portal" cor={COR_LOBULO.conjuntivo} opacidade={0.34} prioridade={2} rotulo={[atras[0] * fora, LOBULO.alturaPorta / 2, atras[1] * fora]}>
        {lob.triades.map((t, i) => (
          <Malha key={i} geometria={conjuntivo} posicao={ao(t.vertice, 0)} />
        ))}
      </Parte>
      <Parte id="ramo-da-veia-porta" cor={COR_LOBULO.veiaPorta} prioridade={6} rugosidade={0.5} rotulo={paredeDaFrente(frente.veia)}>
        {lob.triades.map((t, i) => (
          <Malha key={i} geometria={veiaPorta} posicao={ao(t.veia.centro, 0)} />
        ))}
      </Parte>
      <Parte id="ramo-da-arteria-hepatica" cor={COR_LOBULO.arteria} prioridade={6} rugosidade={0.45} rotulo={paredeDaFrente(frente.arteria)}>
        {lob.triades.map((t, i) => (
          <Malha key={i} geometria={arteria} posicao={ao(t.arteria.centro, 0)} />
        ))}
      </Parte>
      <Parte id="ducto-biliar" cor={COR_LOBULO.ducto} prioridade={6} rugosidade={0.5} rotulo={paredeDaFrente(frente.ducto)}>
        {lob.triades.map((t, i) => (
          <Malha key={i} geometria={ducto} posicao={ao(t.ducto.centro, 0)} />
        ))}
      </Parte>
    </group>
  );
}

// =============================================================================================
// 2) Sarcômero (músculo esquelético de mamífero) com controle de contração
// =============================================================================================
const COR_SARCOMERO = {
  fino: '#e2483d',
  grosso: '#3f7fe0',
  titina: '#3fbf6a',
  linhaZ: '#f3f4f6',
  linhaM: '#fbbf24',
  bandaA: '#7c8cf8',
  bandaI: '#a5f3fc',
  bandaH: '#f9a8d4',
  tubuloT: '#c084fc',
  reticulo: '#2dd4bf',
  cota: '#e5e7eb',
};

export const PARTES_SARCOMERO = [
  'sarcomero',
  'linha-z',
  'linha-m',
  'banda-a',
  'banda-i',
  'banda-h',
  'filamento-fino',
  'filamento-grosso',
  'titina',
  'tubulo-t',
  'reticulo-sarcoplasmatico',
];

const virgula = (v: number) => v.toFixed(2).replace('.', ',');

/**
 * Controle de contração: um <input type="range"> em DOM comum sobre o palco (sem raiz React aninhada),
 * fora do modo jogo. Os eventos param no painel, para não girar a câmera nem tocar o modelo atrás dele.
 */
function ControleContracao({ valor, onMudar }: { valor: number; onMudar: (v: number) => void }) {
  const gl = useThree((s) => s.gl);
  const { modoJogo } = useCena();
  const mudar = useRef(onMudar);
  mudar.current = onMudar;
  const elementos = useRef<{ entrada: HTMLInputElement; legenda: HTMLElement } | null>(null);

  useEffect(() => {
    const pai = gl.domElement.parentElement;
    if (!pai || modoJogo) return;
    const caixa = document.createElement('div');
    caixa.className = 'controle-contracao3d';
    Object.assign(caixa.style, {
      position: 'absolute',
      left: '8px',
      right: '8px',
      bottom: '8px',
      zIndex: '5',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '4px 10px',
      padding: '6px 10px',
      border: '1px solid #4b607d',
      borderRadius: '8px',
      background: '#0b1220e0',
      color: '#d8e4f5',
      fontSize: '12px',
      lineHeight: '1.3',
    } satisfies Partial<CSSStyleDeclaration>);
    const rotulo = document.createElement('label');
    Object.assign(rotulo.style, { display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px', minHeight: '32px' });
    const nome = document.createElement('span');
    nome.textContent = 'Repouso';
    const entrada = document.createElement('input');
    entrada.type = 'range';
    entrada.min = '0';
    entrada.max = '1';
    entrada.step = '0.02';
    entrada.setAttribute('aria-label', 'Contração do sarcômero (0 = repouso, 1 = contraído)');
    Object.assign(entrada.style, { flex: '1', minWidth: '90px', accentColor: '#2dd4bf' });
    const fim = document.createElement('span');
    fim.textContent = 'Contraído';
    rotulo.append(nome, entrada, fim);
    const legenda = document.createElement('output');
    legenda.setAttribute('aria-live', 'polite');
    Object.assign(legenda.style, { flex: '1 1 220px', fontVariantNumeric: 'tabular-nums' });
    caixa.append(rotulo, legenda);
    entrada.addEventListener('input', () => mudar.current(Number(entrada.value)));
    const parar = (e: Event) => e.stopPropagation();
    for (const tipo of ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'click', 'dblclick', 'wheel', 'touchstart', 'touchmove']) {
      caixa.addEventListener(tipo, parar);
    }
    pai.appendChild(caixa);
    elementos.current = { entrada, legenda };
    return () => {
      elementos.current = null;
      caixa.remove();
    };
  }, [gl, modoJogo]);

  useEffect(() => {
    const el = elementos.current;
    if (!el) return;
    const b = bandas(valor);
    if (Number(el.entrada.value) !== valor) el.entrada.value = String(valor);
    el.legenda.textContent = `Sarcômero ${virgula(b.sarcomero)} µm · A ${virgula(b.larguraA)} µm (constante) · I ${virgula(b.larguraI)} µm · H ${virgula(b.larguraH)} µm`;
  }, [valor, modoJogo]);
  return null;
}

function ModeloSarcomero() {
  const fator = useFator();
  const [contracao, setContracao] = useState(0);
  const b = bandas(contracao);
  const k = SARCOMERO.escala;
  const rede = useMemo(() => redeFilamentos(), []);
  const comprimentoFino = SARCOMERO.fino * k;
  const meiaA = (SARCOMERO.grosso / 2) * k;
  const meiaI = (b.larguraI / 2) * k;
  const [zEsq, zDir] = b.linhaZ;

  const finos = useGeo(() => geometriaFinos(rede.finos, comprimentoFino, fator), [rede, comprimentoFino, fator]);
  // Meias bandas I dos sarcômeros vizinhos (filamentos finos do outro lado de cada linha Z, cortados).
  const vizinhos = useGeo(() => geometriaFinos(rede.finos, meiaI, fator), [rede, meiaI, fator]);
  const cabecas = useGeo(() => geometriaCabecas(rede.grossos, fator), [rede, fator]);
  const haste = useGeo(() => new THREE.CylinderGeometry(SARCOMERO.raioGrosso, SARCOMERO.raioGrosso, 2 * meiaA, 16, 1), [meiaA]);
  // Mola da titina: da linha Z até a ponta do filamento grosso (= meia banda I); comprime na contração.
  const molas = useGeo(() => geometriaMolasTitina(rede.grossos, meiaI, fator), [rede, meiaI, fator]);
  const titinaA = useGeo(() => geometriaTitinaBandaA(rede.grossos, fator), [rede, fator]);
  const reticulo = useGeo(() => geometriaReticulo(fator), [fator]);
  const discoZ = useGeo(() => new THREE.CylinderGeometry(SARCOMERO.raioDiscoZ, SARCOMERO.raioDiscoZ, 0.035, 48), []);
  const discoM = useGeo(() => new THREE.CylinderGeometry(SARCOMERO.raioDiscoM, SARCOMERO.raioDiscoM, 0.025, 48), []);
  // Quatro segmentos ao longo do eixo: anéis de vértices fora das pontas, para as âncoras dos marcadores.
  const faixa = useGeo(() => new THREE.CylinderGeometry(SARCOMERO.raioBandas, SARCOMERO.raioBandas, 1, 48, 4), []);
  const tuboT = useGeo(() => new THREE.TorusGeometry(SARCOMERO.raioAnel, SARCOMERO.tuboT, 8, 56), []);
  const barra = useGeo(() => new THREE.CylinderGeometry(0.035, 0.035, 1, 12), []);
  const marca = useGeo(() => new THREE.CylinderGeometry(0.028, 0.028, 0.2, 12), []);

  const yCota = SARCOMERO.alturaCota;
  const anelEmX: V3 = [0, Math.PI / 2, 0];
  // Âncora das bandas: na borda de cima voltada para a câmera (30° do topo), onde o raio do toque passa por
  // cima da rede de filamentos e só atravessa a banda.
  const bordaBanda = (x: number): V3 => [x, SARCOMERO.raioBandas * Math.cos(Math.PI / 6), SARCOMERO.raioBandas * Math.sin(Math.PI / 6)];
  const frenteFino = rede.finos.reduce((m, f) => (f[1] > m[1] ? f : m), rede.finos[0]);
  const frenteGrosso = rede.grossos.reduce((m, g) => (g[1] + g[0] * 0.1 > m[1] + m[0] * 0.1 ? g : m), rede.grossos[0]);
  return (
    <group>
      <ControleContracao valor={contracao} onMudar={setContracao} />
      <Parte id="sarcomero" cor={COR_SARCOMERO.cota} prioridade={8} rotulo={[0, yCota, 0.035]}>
        <Malha geometria={barra} rotacao={AO_LONGO_DE_X} escala={[1, zDir - zEsq, 1]} posicao={[0, yCota, 0]} />
        <Malha geometria={marca} posicao={[zEsq, yCota, 0]} />
        <Malha geometria={marca} posicao={[zDir, yCota, 0]} />
      </Parte>
      <Parte id="linha-z" cor={COR_SARCOMERO.linhaZ} opacidade={0.82} prioridade={8} rotulo={[zDir, 0.12, SARCOMERO.raioDiscoZ]}>
        <Malha geometria={discoZ} rotacao={AO_LONGO_DE_X} posicao={[zEsq, 0, 0]} />
        <Malha geometria={discoZ} rotacao={AO_LONGO_DE_X} posicao={[zDir, 0, 0]} />
      </Parte>
      <Parte id="linha-m" cor={COR_SARCOMERO.linhaM} opacidade={0.82} prioridade={8} rotulo={[0, -0.12, SARCOMERO.raioDiscoM]}>
        <Malha geometria={discoM} rotacao={AO_LONGO_DE_X} />
      </Parte>
      <Parte id="banda-a" cor={COR_SARCOMERO.bandaA} opacidade={0.13} prioridade={1} rotulo={bordaBanda(-meiaA / 2)}>
        <Malha geometria={faixa} rotacao={AO_LONGO_DE_X} escala={[1, 2 * meiaA, 1]} />
      </Parte>
      <Parte id="banda-i" cor={COR_SARCOMERO.bandaI} opacidade={0.13} prioridade={1.5} rotulo={bordaBanda(zEsq - meiaI / 2)}>
        <Malha geometria={faixa} rotacao={AO_LONGO_DE_X} escala={[1, 2 * meiaI, 1]} posicao={[zEsq, 0, 0]} />
        <Malha geometria={faixa} rotacao={AO_LONGO_DE_X} escala={[1, 2 * meiaI, 1]} posicao={[zDir, 0, 0]} />
      </Parte>
      <Parte id="banda-h" cor={COR_SARCOMERO.bandaH} opacidade={0.2} prioridade={2} rotulo={bordaBanda((b.bandaH[1] - b.bandaH[0]) / 4)}>
        <Malha geometria={faixa} rotacao={AO_LONGO_DE_X} escala={[1.002, Math.max(1e-3, b.bandaH[1] - b.bandaH[0]), 1.002]} />
      </Parte>
      <Parte id="filamento-fino" cor={COR_SARCOMERO.fino} prioridade={8} rugosidade={0.5} rotulo={[zDir + meiaI / 2, frenteFino[0], frenteFino[1] + SARCOMERO.raioFino]}>
        {/* Ancorados na linha Z esquerda (para +x) e na direita (girados 180° em y, para −x). */}
        <Malha geometria={finos} posicao={[zEsq, 0, 0]} />
        <Malha geometria={finos} posicao={[zDir, 0, 0]} rotacao={[0, Math.PI, 0]} />
        <Malha geometria={vizinhos} posicao={[zEsq, 0, 0]} rotacao={[0, Math.PI, 0]} />
        <Malha geometria={vizinhos} posicao={[zDir, 0, 0]} />
      </Parte>
      <Parte id="filamento-grosso" cor={COR_SARCOMERO.grosso} prioridade={8} rugosidade={0.5} rotulo={[0.42, frenteGrosso[0], frenteGrosso[1] + 0.1]}>
        {rede.grossos.map((g, i) => (
          <Malha key={i} geometria={haste} rotacao={AO_LONGO_DE_X} posicao={[0, g[0], g[1]]} />
        ))}
        <Malha geometria={cabecas} />
      </Parte>
      <Parte id="titina" cor={COR_SARCOMERO.titina} prioridade={8} rotulo={[zEsq + meiaI * 0.35, frenteGrosso[0] + DESVIO_TITINA[0], frenteGrosso[1] + DESVIO_TITINA[1] + 0.03]}>
        {/* Mola da banda I (da linha Z à ponta do filamento grosso) e segmento preso ao grosso até a linha M. */}
        <Malha geometria={molas} posicao={[zEsq, 0, 0]} />
        <Malha geometria={molas} posicao={[zDir, 0, 0]} rotacao={[0, Math.PI, 0]} />
        <Malha geometria={titinaA} />
      </Parte>
      <Parte id="tubulo-t" cor={COR_SARCOMERO.tubuloT} prioridade={8} rotulo={[meiaA, 0.2, SARCOMERO.raioAnel + SARCOMERO.tuboT]}>
        <Malha geometria={tuboT} rotacao={anelEmX} posicao={[-meiaA, 0, 0]} />
        <Malha geometria={tuboT} rotacao={anelEmX} posicao={[meiaA, 0, 0]} />
      </Parte>
      <Parte id="reticulo-sarcoplasmatico" cor={COR_SARCOMERO.reticulo} prioridade={8} rotulo={[-meiaA + SARCOMERO.afastamentoCisterna, -0.2, SARCOMERO.raioAnel + SARCOMERO.tuboCisterna]}>
        <Malha geometria={reticulo} />
      </Parte>
    </group>
  );
}

// =============================================================================================
// 3) Junções celulares (complexo juncional, junção comunicante, hemidesmossomo)
// =============================================================================================
const COR_JUNCOES = {
  celula: '#f3cfae',
  microvilos: '#f4a259',
  oclusao: '#0f9488',
  adesao: '#5fb7f0',
  actina: '#e02424',
  desmossomo: '#8b5cf6',
  queratina: '#2fbf6a',
  comunicante: '#ec4899',
  hemidesmossomo: '#f59e0b',
  lamina: '#94a3b8',
};

export const PARTES_JUNCOES = [
  'epitelio-simples-cilindrico',
  'microvilosidades',
  'zonula-de-oclusao',
  'zonula-de-adesao',
  'cinturao-de-actina',
  'desmossomo',
  'filamentos-de-queratina',
  'juncao-comunicante',
  'hemidesmossomo',
  'lamina-basal',
];

function ModeloJuncoes() {
  const fator = useFator();
  const celula = useGeo(() => geometriaCelula(), []);
  const nucleo = useGeo(() => new THREE.SphereGeometry(1, 32, 24), []);
  const oclusao = useGeo(() => geometriaFaixa(JUNCOES.oclusao[1] - JUNCOES.oclusao[0]), []);
  const adesao = useGeo(() => geometriaFaixa(JUNCOES.adesao[1] - JUNCOES.adesao[0]), []);
  const cinturao = useGeo(() => geometriaCinturao(), []);
  const microvilos = useGeo(() => geometriaMicrovilosidades(fator), [fator]);
  const desmossomos = useGeo(() => geometriaDesmossomos(fator), [fator]);
  const queratina = useGeo(() => geometriaQueratina(fator), [fator]);
  const conexons = useGeo(() => geometriaConexons(fator), [fator]);
  const hemidesmossomos = useGeo(() => geometriaHemidesmossomos(fator), [fator]);
  const lamina = useGeo(() => geometriaLamina(), []);

  const [xa, xb] = centrosCelulas();
  const deitada: V3 = [-Math.PI / 2, 0, 0]; // extrusão (+z da forma) → +y
  const yCinturao = (JUNCOES.adesao[0] + JUNCOES.adesao[1]) / 2;
  const frente = JUNCOES.profundidade / 2 + JUNCOES.fenda / 2;
  const d0 = JUNCOES.desmossomos[0];
  const c = JUNCOES.comunicante;
  const [la, lb] = JUNCOES.laminaBasal;
  return (
    <group>
      <Parte id="epitelio-simples-cilindrico" cor={COR_JUNCOES.celula} opacidade={0.34} prioridade={2} rotulo={[xb + JUNCOES.largura / 2, 0.25, JUNCOES.profundidade / 2]}>
        <Malha geometria={celula} rotacao={deitada} posicao={[xa, JUNCOES.base, 0]} />
        <Malha geometria={celula} rotacao={deitada} posicao={[xb, JUNCOES.base, 0]} />
        {centrosNucleos().map((p, i) => (
          <Malha key={i} geometria={nucleo} posicao={p} escala={JUNCOES.nucleo.raios} />
        ))}
      </Parte>
      <Parte id="microvilosidades" cor={COR_JUNCOES.microvilos} prioridade={7} rotulo={[xa, JUNCOES.base + JUNCOES.altura + 0.25, 0.2]}>
        <Malha geometria={microvilos} />
      </Parte>
      <Parte id="zonula-de-oclusao" cor={COR_JUNCOES.oclusao} prioridade={7} rotulo={[xb, JUNCOES.oclusao[1], frente]}>
        <Malha geometria={oclusao} rotacao={deitada} posicao={[xa, JUNCOES.oclusao[0], 0]} />
        <Malha geometria={oclusao} rotacao={deitada} posicao={[xb, JUNCOES.oclusao[0], 0]} />
      </Parte>
      {/* Translúcida, para mostrar o cinturão de actina por dentro da célula, na mesma altura. */}
      <Parte id="zonula-de-adesao" cor={COR_JUNCOES.adesao} opacidade={0.3} prioridade={7} acabamento="padrao" rotulo={[xa, JUNCOES.adesao[0], frente]}>
        <Malha geometria={adesao} rotacao={deitada} posicao={[xa, JUNCOES.adesao[0], 0]} />
        <Malha geometria={adesao} rotacao={deitada} posicao={[xb, JUNCOES.adesao[0], 0]} />
      </Parte>
      {/* Visto através da faixa translúcida da zônula de adesão: prioridade um pouco maior que a dela. */}
      <Parte id="cinturao-de-actina" cor={COR_JUNCOES.actina} prioridade={7.5} rotulo={[xb, yCinturao, JUNCOES.profundidade / 2 - JUNCOES.cinturao.recuo]}>
        <Malha geometria={cinturao} posicao={[xa, yCinturao, 0]} />
        <Malha geometria={cinturao} posicao={[xb, yCinturao, 0]} />
      </Parte>
      <Parte id="desmossomo" cor={COR_JUNCOES.desmossomo} prioridade={7} rotulo={[JUNCOES.fenda, d0.y, d0.z]}>
        <Malha geometria={desmossomos} />
      </Parte>
      <Parte id="filamentos-de-queratina" cor={COR_JUNCOES.queratina} prioridade={7} rotulo={[0.4, -0.06, 0.3]}>
        <Malha geometria={queratina} />
      </Parte>
      <Parte id="juncao-comunicante" cor={COR_JUNCOES.comunicante} prioridade={7} rotulo={[0, c.y, c.z + c.raioPlaca]}>
        <Malha geometria={conexons} />
      </Parte>
      <Parte id="hemidesmossomo" cor={COR_JUNCOES.hemidesmossomo} prioridade={7} rotulo={[xb - JUNCOES.hemidesmossomos[0].dx, JUNCOES.base, 0.25]}>
        <Malha geometria={hemidesmossomos} />
      </Parte>
      <Parte id="lamina-basal" cor={COR_JUNCOES.lamina} prioridade={6} rugosidade={0.8} rotulo={[xb + 0.3, la, JUNCOES.profundidade / 2 + 0.1]}>
        <Malha geometria={lamina} posicao={[0, (la + lb) / 2, 0]} />
      </Parte>
    </group>
  );
}

export const MODELOS_HISTO_B: Record<string, ModeloEstagio> = {
  'lobulo-hepatico': { Componente: ModeloLobulo, partes: PARTES_LOBULO, camera: [0, 1.55, 1.3], raio: 1.85 },
  sarcomero: { Componente: ModeloSarcomero, partes: PARTES_SARCOMERO, camera: [0.45, 0.6, 3], raio: 1.7 },
  'juncoes-celulares': { Componente: ModeloJuncoes, partes: PARTES_JUNCOES, camera: [1.1, 0.45, 2.6], raio: 1.55 },
};
