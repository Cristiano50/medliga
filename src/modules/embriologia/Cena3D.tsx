import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CenaProvider, Tocavel, type CenaCtx, type EstadoDestaque } from './tres/nucleo.tsx';
import { MODELOS, type ModeloEstagio } from './modelos/index.ts';
import { CamadaMarcadores, RotulosProvider, type QuadroMarcadores } from './tres/rotulos.tsx';
import { perfilDoModelo, type Perfil3D } from '../tres3d/perfis.ts';
import { PARAMETROS, semWebGL } from '../tres3d/qualidade.ts';
import { AcabamentoContext, acabamentoDoPerfil, type AmbienteAcabamento } from '../tres3d/materiais.ts';
import {
  AmbientePMREM,
  Diagnostico3D,
  PreCompilar,
  dprInicial,
  RefinarCena,
  ResolucaoAdaptativa,
  SombraContato,
  SombrasEstaticas,
  useNivelQualidade,
} from '../tres3d/render.tsx';

/** Tone mapping e exposição do perfil (o R3F aplica ACES por padrão). */
function Exposicao({ perfil }: { perfil: Perfil3D }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    gl.toneMapping = perfil.toneMapping;
    gl.toneMappingExposure = perfil.exposicao;
    invalidate();
  }, [gl, perfil.toneMapping, perfil.exposicao, invalidate]);
  return null;
}

/** Aplica ao renderer os planos de corte que o Cena3D já entregou às partes pelo contexto (mesma lista). */
function Corte({ posicao, plano, planos }: { posicao: number | null; plano: THREE.Plane; planos: THREE.Plane[] }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    plano.constant = posicao ?? 0;
    gl.clippingPlanes = planos;
    invalidate();
    return () => { gl.clippingPlanes = []; invalidate(); };
  }, [posicao, plano, planos, gl, invalidate]);
  return null;
}

function Camera({ estagioId, modelo: m, versao }: { estagioId: string; modelo?: ModeloEstagio; versao: number }) {
  const { camera, invalidate, size } = useThree();
  const controles = useThree((s) => s.controls) as OrbitControlsImpl | null;
  useEffect(() => {
    if (!m) return;
    // Enquadra o modelo inteiro considerando o campo de visão vertical e horizontal (telas em pé ou deitadas).
    const pc = camera as THREE.PerspectiveCamera;
    const vfov = THREE.MathUtils.degToRad(pc.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (size.width / Math.max(1, size.height)));
    const distancia = (m.raio * 1.08) / Math.sin(Math.min(vfov, hfov) / 2);
    const dir = new THREE.Vector3(...m.camera).normalize();
    camera.position.copy(dir.multiplyScalar(distancia));
    camera.lookAt(0, 0, 0);
    if (controles) {
      controles.target.set(0, 0, 0);
      controles.update();
    }
    invalidate();
  }, [estagioId, m, versao, camera, controles, invalidate, size.width, size.height]);
  return null;
}

export interface Cena3DProps {
  estagioId: string;
  rotulosVisiveis: boolean;
  selecionado: string | null;
  destaques?: Record<string, EstadoDestaque>;
  nomes: Record<string, string>;
  modoJogo?: boolean;
  onEscolher?: (id: string) => void;
  onVazio?: () => void;
  /** incrementar para recentralizar a câmera */
  versaoCamera?: number;
  telaCheia?: boolean;
  ocultos?: string[];
  isolado?: string | null;
  corte?: number | null;
  /** modelo fora do registro da embriologia (ex.: laboratório de histologia); padrão MODELOS[estagioId] */
  modelo?: ModeloEstagio;
  /** perfil de iluminação; padrão pelo tipo do modelo */
  perfil?: Perfil3D;
}

const SEM_DESTAQUES: Record<string, EstadoDestaque> = {};
const SEM_OCULTOS: string[] = [];
const SEM_PLANOS: THREE.Plane[] = [];

export function Cena3D(p: Cena3DProps) {
  const modelo = p.modelo ?? MODELOS[p.estagioId];
  const Componente = modelo?.Componente;
  const perfil = useMemo(() => p.perfil ?? perfilDoModelo(p.estagioId), [p.perfil, p.estagioId]);
  const nivel = useNivelQualidade();
  const qualidade = PARAMETROS[nivel];
  const fator = semWebGL() ? 1 : qualidade.fator;
  const ocultos = p.modoJogo ? SEM_OCULTOS : p.ocultos;
  const isolado = p.modoJogo ? null : p.isolado;
  const corte = p.modoJogo ? null : p.corte;
  // Sombras só na exploração livre: o clipping do corte é global e o isolamento/ocultação mudam a silhueta.
  const exploracaoLivre = !p.selecionado && !isolado && !ocultos?.length && corte == null;
  const raio = modelo?.raio ?? 1.5;
  const raiz = useRef<THREE.Group>(null);
  const dpr = useRef(dprInicial(nivel));
  const versao = `${p.estagioId}:${nivel}`;
  const [quadro, setQuadro] = useState<QuadroMarcadores>({ pontos: [], largura: 0, altura: 0 });
  const meia = raio * 1.25;
  // Acabamento das superfícies pelo perfil (materiais.ts); as partes podem pedir outro pela prop `acabamento`.
  const acabamento = useMemo<AmbienteAcabamento>(
    () => ({ ...acabamentoDoPerfil(perfil.tipo), nivel, saturacao: perfil.ajusteCor?.saturacao, luminosidade: perfil.ajusteCor?.luminosidade }),
    [perfil, nivel],
  );
  // Contexto estável: a atualização dos marcadores (setQuadro) re-renderiza só o Cena3D. Com um objeto novo a
  // cada render, todas as partes re-renderizavam e pediam mais um quadro inteiro por seleção ou marcador.
  const numeros = useMemo(() => Object.fromEntries((modelo?.partes ?? []).map((id, i) => [id, String(i + 1)])), [modelo]);
  // Planos de corte no fluxo do React: as partes (contorno de seleção) recebem a lista no mesmo render em que
  // o corte liga ou desliga, sem depender de um re-render posterior para ler gl.clippingPlanes.
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), []);
  const cortando = corte != null;
  const planos = useMemo(() => (cortando ? [plano] : SEM_PLANOS), [cortando, plano]);
  const destaques = p.destaques ?? SEM_DESTAQUES;
  const cena = useMemo<CenaCtx>(
    () => ({ rotulosVisiveis: p.rotulosVisiveis, selecionado: p.selecionado, destaques, nomes: p.nomes, numeros, modoJogo: !!p.modoJogo, ocultos, isolado, corte, planosCorte: planos, onEscolher: p.onEscolher }),
    [p.rotulosVisiveis, p.selecionado, destaques, p.nomes, numeros, p.modoJogo, ocultos, isolado, corte, planos, p.onEscolher],
  );
  // Manipulador estável: uma função nova a cada render altera o estado do R3F, e toda alteração pede um quadro.
  const aoVazio = useRef(p.onVazio);
  aoVazio.current = p.onVazio;
  const toqueNoVazio = useCallback(() => aoVazio.current?.(), []);
  return (
    <div className={`palco3d ${p.telaCheia ? 'tela-cheia' : ''}`}>
      <Canvas
        frameloop="demand"
        shadows={{ type: THREE.PCFShadowMap, autoUpdate: false }}
        dpr={dpr.current}
        camera={{ fov: 40, near: 0.05, far: 100, position: modelo?.camera ?? [0, 0, 4] }}
        gl={{ antialias: true, preserveDrawingBuffer: false, toneMapping: perfil.toneMapping, toneMappingExposure: perfil.exposicao }}
        onPointerMissed={toqueNoVazio}
        aria-label="Modelo 3D interativo"
      >
        <color attach="background" args={[perfil.fundo]} />
        <Exposicao perfil={perfil} />
        <AmbientePMREM intensidade={perfil.ambiente} />
        <hemisphereLight args={[perfil.hemisferio.ceu, perfil.hemisferio.chao, perfil.hemisferio.intensidade]} />
        <directionalLight
          position={perfil.principal.posicao}
          intensity={perfil.principal.intensidade}
          color={perfil.principal.cor}
          castShadow={perfil.sombra === 'pcf'}
          shadow-mapSize={[qualidade.mapaSombra, qualidade.mapaSombra]}
          shadow-camera-left={-meia}
          shadow-camera-right={meia}
          shadow-camera-top={meia}
          shadow-camera-bottom={-meia}
          shadow-camera-near={1}
          shadow-camera-far={16}
          shadow-radius={3}
          shadow-normalBias={0.025}
          shadow-bias={-0.0001}
        />
        <directionalLight position={perfil.preenchimento.posicao} intensity={perfil.preenchimento.intensidade} color={perfil.preenchimento.cor} />
        <ambientLight intensity={perfil.luzAmbiente} />
        <CenaProvider value={cena}>
          <AcabamentoContext.Provider value={acabamento}>
            <Suspense fallback={null}>
              <RotulosProvider key={versao} onQuadro={setQuadro}>
                <group ref={raiz}>
                  <Tocavel>{Componente && <Componente />}</Tocavel>
                </group>
              </RotulosProvider>
            </Suspense>
          </AcabamentoContext.Provider>
        </CenaProvider>
        <RefinarCena raiz={raiz} raio={raio} fator={fator} />
        {perfil.sombra === 'pcf' && <SombrasEstaticas raiz={raiz} projetar={exploracaoLivre} versao={versao} />}
        {perfil.sombra === 'contato' && exploracaoLivre && (
          <SombraContato key={versao} raiz={raiz} opacidade={perfil.sombraContato ?? 0.5} nivel={nivel} versao={versao} />
        )}
        <ResolucaoAdaptativa nivel={nivel} dprRef={dpr} />
        <PreCompilar raiz={raiz} versao={versao} />
        <Diagnostico3D nivel={nivel} modelo={p.estagioId} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.12} minDistance={1} maxDistance={16} enablePan={false} />
        <Camera estagioId={p.estagioId} modelo={modelo} versao={p.versaoCamera ?? 0} />
        <Corte posicao={corte ?? null} plano={plano} planos={planos} />
      </Canvas>
      <CamadaMarcadores quadro={quadro} />
    </div>
  );
}
