// Infraestrutura de renderização do 3D (todos os modelos): resolução adaptativa própria para frameloop="demand",
// ambiente PMREM local, sombras estáticas/de contato, refino de geometria e diagnóstico.
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { addAfterEffect, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  alvoDpr,
  assinarQualidade,
  diagnosticoLigado,
  DPR_MINIMO,
  gravarReducaoDprMovimento,
  lerReducaoDprMovimento,
  nivelAtual,
  PARAMETROS,
  rebaixarNivel,
  type NivelQualidade,
} from './qualidade.ts';
import { prepararMalhas, type ResultadoRefino } from './refinar.ts';

/** Estado exposto pelo diagnóstico (window.__diag3d). */
const diagnostico: {
  emMovimento: boolean;
  monitor: { amostras: number; ultimaMediana: number | null; reducao: number; rebaixamentos: number };
  refino: ResultadoRefino | null;
  sombra: string;
} = { emMovimento: false, monitor: { amostras: 0, ultimaMediana: null, reducao: 0, rebaixamentos: 0 }, refino: null, sombra: 'nenhuma' };

export function useNivelQualidade(): NivelQualidade {
  return useSyncExternalStore(assinarQualidade, nivelAtual, () => 'baixa');
}

/** dpr para o primeiro quadro (o palco ainda não foi medido): estimativa pelo tamanho típico do palco. */
export function dprInicial(nivel: NivelQualidade): number {
  if (typeof window === 'undefined') return 1;
  const largura = Math.min(window.innerWidth || 390, 960);
  const altura = Math.min((window.innerHeight || 844) * 0.62, 560);
  return alvoDpr({ width: largura, height: altura }, window.devicePixelRatio || 1, nivel, false);
}

const mediana = (xs: number[]) => {
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor(o.length / 2)];
};

/** Depois do último movimento da câmera, quanto esperar para voltar ao dpr parado. */
const PAUSA_MS = 140;
const LIMITE_QUADRO_MS = 28;
/** Depois de soltar, o amortecimento do OrbitControls ainda gira a câmera por cerca de 1 s. */
const INERCIA_MS = 2000;

/**
 * Resolução adaptativa própria. O PerformanceMonitor/AdaptiveDpr do drei não servem com frameloop="demand":
 * o tempo parado entre quadros conta como quadro lento. Aqui o dpr é decidido dentro do useFrame e aplicado
 * com setDpr no mesmo quadro (sem quadro em branco): alto parado, mais baixo durante o giro.
 * `dprRef` é o valor passado como prop `dpr` do Canvas, para a reconfiguração do Canvas não desfazer a escolha.
 * O monitor só amostra quadros consecutivos (< 100 ms) durante o arraste; mediana > 28 ms rebaixa o dpr de
 * movimento em 0,25 e lembra a escolha. Perda de contexto WebGL rebaixa o nível.
 */
export function ResolucaoAdaptativa({ nivel, dprRef }: { nivel: NivelQualidade; dprRef: { current: number } }) {
  const controles = useThree((s) => s.controls) as THREE.EventDispatcher<{ start: object; change: object; end: object }> | null;
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const estado = useRef({ arrastando: false, ultimaInteracao: -Infinity, ultimaMudanca: -Infinity, ultimoQuadro: 0, amostras: [] as number[], reducao: lerReducaoDprMovimento() });

  // Mediana dos quadros do giro acima do limite: desce 0,25 no dpr de movimento e lembra a escolha.
  const avaliar = (minimo: number) => {
    const e = estado.current;
    if (e.amostras.length < minimo) return;
    const m = mediana(e.amostras);
    e.amostras = [];
    diagnostico.monitor.ultimaMediana = m;
    if (m > LIMITE_QUADRO_MS && PARAMETROS[nivel].dprMovimento - e.reducao - 0.25 >= DPR_MINIMO - 1e-9) {
      e.reducao += 0.25;
      gravarReducaoDprMovimento(e.reducao);
      diagnostico.monitor.rebaixamentos++;
    }
  };
  const avaliarRef = useRef(avaliar);
  avaliarRef.current = avaliar;

  useEffect(() => {
    const e = estado.current;
    if (!controles) return;
    let espera: ReturnType<typeof setTimeout> | undefined;
    const voltarAoParado = () => {
      clearTimeout(espera);
      espera = setTimeout(() => invalidate(), PAUSA_MS + 30);
    };
    const inicio = () => { e.arrastando = true; e.ultimoQuadro = 0; e.ultimaInteracao = performance.now(); };
    // Só movimento do usuário (arraste, roda/pinça e a inércia que segue): o recentrar da câmera não baixa o dpr.
    const mudanca = () => {
      const agora = performance.now();
      if (!e.arrastando && agora - e.ultimaInteracao > INERCIA_MS) return;
      e.ultimaMudanca = agora;
      voltarAoParado();
    };
    const fim = () => { e.arrastando = false; e.ultimoQuadro = 0; e.ultimaInteracao = performance.now(); avaliarRef.current(12); voltarAoParado(); };
    controles.addEventListener('start', inicio);
    controles.addEventListener('change', mudanca);
    controles.addEventListener('end', fim);
    return () => {
      clearTimeout(espera);
      controles.removeEventListener('start', inicio);
      controles.removeEventListener('change', mudanca);
      controles.removeEventListener('end', fim);
    };
  }, [controles, invalidate]);

  useEffect(() => {
    const perdeu = () => { rebaixarNivel(); };
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', perdeu);
    return () => canvas.removeEventListener('webglcontextlost', perdeu);
  }, [gl]);

  useFrame((state) => {
    const e = estado.current;
    const agora = performance.now();
    const emMovimento = agora - e.ultimaMudanca < PAUSA_MS;
    if (e.arrastando && emMovimento) {
      if (e.ultimoQuadro) {
        const dt = agora - e.ultimoQuadro;
        if (dt < 100) e.amostras.push(dt);
      }
      e.ultimoQuadro = agora;
      avaliar(30);
    }
    diagnostico.emMovimento = emMovimento;
    diagnostico.monitor.amostras = e.amostras.length;
    diagnostico.monitor.reducao = e.reducao;
    const alvo = alvoDpr(state.size, window.devicePixelRatio || 1, nivel, emMovimento, e.reducao);
    if (Math.abs(alvo - state.viewport.dpr) > 1e-3) {
      dprRef.current = alvo;
      state.setDpr(alvo);
    }
  });
  return null;
}

const ambientes = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

/** PMREM do RoomEnvironment (gerado localmente, sem HDR externo), um por renderer. */
export function texturaAmbiente(gl: THREE.WebGLRenderer): THREE.Texture {
  let textura = ambientes.get(gl);
  if (!textura) {
    const sala = new RoomEnvironment();
    const gerador = new THREE.PMREMGenerator(gl);
    textura = gerador.fromScene(sala, 0.04).texture;
    sala.dispose();
    gerador.dispose();
    ambientes.set(gl, textura);
  }
  return textura;
}

export function AmbientePMREM({ intensidade }: { intensidade: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const [versao, setVersao] = useState(0);
  useEffect(() => {
    // O conteúdo de render targets se perde com o contexto: refaz o PMREM na restauração.
    const restaurado = () => { ambientes.delete(gl); setVersao((v) => v + 1); };
    gl.domElement.addEventListener('webglcontextrestored', restaurado);
    return () => gl.domElement.removeEventListener('webglcontextrestored', restaurado);
  }, [gl]);
  useLayoutEffect(() => {
    const anterior = scene.environment;
    scene.environment = texturaAmbiente(gl);
    invalidate();
    return () => { scene.environment = anterior; invalidate(); };
  }, [gl, scene, invalidate, versao]);
  useLayoutEffect(() => {
    const anterior = scene.environmentIntensity;
    scene.environmentIntensity = intensidade;
    invalidate();
    return () => { scene.environmentIntensity = anterior; };
  }, [scene, intensidade, invalidate]);
  return null;
}

const ehMaterialDoModelo = (m: THREE.Material | THREE.Material[]) => !Array.isArray(m) && !!(m as THREE.MeshStandardMaterial).isMeshStandardMaterial;

/**
 * Sombra projetada estática (PCF): o mapa só é refeito quando o modelo muda (montagem, refino, estado de
 * exploração), não a cada quadro do giro. Recebe sombra sempre (sem troca de programa ao selecionar);
 * projeta só na exploração livre — nunca com corte (o clipping é global e não vale no passe de sombra),
 * isolamento, seleção ou estruturas ocultas.
 */
export function SombrasEstaticas({ raiz, projetar, versao }: { raiz: RefObject<THREE.Object3D | null>; projetar: boolean; versao: string }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    diagnostico.sombra = projetar ? 'pcf' : 'pcf (sem projeção)';
    invalidate();
    return () => { diagnostico.sombra = 'nenhuma'; };
  }, [gl, invalidate, projetar, versao]);
  useFrame(() => {
    const r = raiz.current;
    if (!r) return;
    let mudou = false;
    r.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !ehMaterialDoModelo(m.material)) return;
      if (!m.receiveShadow) { m.receiveShadow = true; mudou = true; }
      if (m.castShadow !== projetar) { m.castShadow = projetar; mudou = true; }
    });
    if (mudou) gl.shadowMap.needsUpdate = true;
  });
  return null;
}

/** Sombra de contato assada num único quadro, logo abaixo da caixa real do modelo (modelos opacos). */
export function SombraContato({ raiz, opacidade, nivel, versao }: { raiz: RefObject<THREE.Object3D | null>; opacidade: number; nivel: NivelQualidade; versao: string }) {
  const [caixa, setCaixa] = useState<{ centro: [number, number, number]; lado: number; altura: number } | null>(null);
  useLayoutEffect(() => {
    const r = raiz.current;
    if (!r) return;
    r.updateWorldMatrix(true, true);
    const b = new THREE.Box3().setFromObject(r);
    if (b.isEmpty()) return;
    const c = b.getCenter(new THREE.Vector3());
    const t = b.getSize(new THREE.Vector3());
    setCaixa({ centro: [c.x, b.min.y - 0.01, c.z], lado: Math.max(t.x, t.z) * 1.6, altura: t.y });
    diagnostico.sombra = 'contato';
    return () => { diagnostico.sombra = 'nenhuma'; };
  }, [raiz, versao]);
  if (!caixa) return null;
  return (
    <ContactShadows
      key={versao}
      frames={1}
      position={caixa.centro}
      scale={caixa.lado}
      far={caixa.altura * 0.6}
      blur={2.2}
      opacity={opacidade}
      resolution={nivel === 'baixa' ? 256 : 512}
      color="#000000"
    />
  );
}

/** Refino das geometrias pelo fator do nível, antes do desenho do mesmo quadro (sem piscar em baixa resolução). */
export function RefinarCena({ raiz, raio, fator }: { raiz: RefObject<THREE.Object3D | null>; raio: number; fator: number }) {
  const gl = useThree((s) => s.gl);
  const assinatura = useRef('');
  useFrame(() => {
    const r = raiz.current;
    if (!r) return;
    let n = 0, h = 0;
    r.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      n++;
      h = (h * 31 + m.id * 7 + (m.geometry?.id ?? 0)) % 2147483647;
    });
    const atual = `${n}:${h}:${fator}:${raio}`;
    if (atual === assinatura.current) return;
    assinatura.current = atual;
    const resultado = prepararMalhas(r, { raio, fator });
    if (resultado.mudou) gl.shadowMap.needsUpdate = true;
    diagnostico.refino = resultado;
  });
  return null;
}

/** Com localStorage medliga:diag3d = "1", publica renderer.info em window.__diag3d depois de cada quadro. */
export function Diagnostico3D({ nivel, modelo }: { nivel: NivelQualidade; modelo: string }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (!diagnosticoLigado()) return;
    let quadros = 0;
    return addAfterEffect(() => {
      quadros++;
      (window as unknown as { __diag3d: unknown }).__diag3d = {
        quadro: quadros,
        modelo,
        nivel,
        fator: PARAMETROS[nivel].fator,
        dpr: gl.getPixelRatio(),
        buffer: [gl.domElement.width, gl.domElement.height],
        render: { ...gl.info.render },
        programs: gl.info.programs?.length ?? 0,
        memory: { ...gl.info.memory },
        emMovimento: diagnostico.emMovimento,
        monitor: { ...diagnostico.monitor },
        refino: diagnostico.refino,
        sombra: diagnostico.sombra,
      };
    });
  }, [gl, nivel, modelo]);
  return null;
}
