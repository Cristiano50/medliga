import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CenaProvider, Tocavel, type EstadoDestaque } from './tres/nucleo.tsx';
import { MODELOS } from './modelos/index.ts';
import { CamadaMarcadores, RotulosProvider, type QuadroMarcadores } from './tres/rotulos.tsx';

/** Reflexos amplos de estúdio gerados localmente; não carrega imagens ou HDR externos. */
function AmbienteSuperficie() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const anterior = scene.environment;
    const intensidadeAnterior = scene.environmentIntensity;
    const sala = new RoomEnvironment();
    const gerador = new THREE.PMREMGenerator(gl);
    const ambiente = gerador.fromScene(sala, 0.04);
    scene.environment = ambiente.texture;
    scene.environmentIntensity = 0.2;
    sala.dispose(); gerador.dispose(); invalidate();
    return () => { scene.environment = anterior; scene.environmentIntensity = intensidadeAnterior; ambiente.dispose(); invalidate(); };
  }, [gl, scene, invalidate]);
  return null;
}

function Corte({ posicao }: { posicao: number | null }) {
  const { gl, invalidate } = useThree();
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), []);
  useEffect(() => {
    plano.constant = posicao ?? 0;
    gl.clippingPlanes = posicao === null ? [] : [plano];
    invalidate();
    return () => { gl.clippingPlanes = []; invalidate(); };
  }, [posicao, plano, gl, invalidate]);
  return null;
}

function Camera({ estagioId, versao }: { estagioId: string; versao: number }) {
  const { camera, invalidate, size } = useThree();
  const controles = useThree((s) => s.controls) as OrbitControlsImpl | null;
  useEffect(() => {
    const m = MODELOS[estagioId];
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
  }, [estagioId, versao, camera, controles, invalidate, size.width, size.height]);
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
}

export function Cena3D(p: Cena3DProps) {
  const modelo = MODELOS[p.estagioId];
  const Componente = modelo?.Componente;
  const organico = p.estagioId === 'semana-8';
  const sombras = organico && !p.selecionado && !p.isolado && !p.ocultos?.length && p.corte == null;
  const [quadro, setQuadro] = useState<QuadroMarcadores>({ pontos: [], largura: 0, altura: 0 });
  return (
    <div className={`palco3d ${p.telaCheia ? 'tela-cheia' : ''}`}>
      <Canvas
        frameloop="demand"
        shadows={organico ? { type: THREE.PCFShadowMap } : false}
        dpr={[1, 2]}
        camera={{ fov: 40, near: 0.05, far: 100, position: modelo?.camera ?? [0, 0, 4] }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        onPointerMissed={() => p.onVazio?.()}
        aria-label="Modelo 3D interativo"
      >
        <color attach="background" args={[organico ? '#24151c' : '#0d1628']} />
        {organico && <AmbienteSuperficie />}
        <hemisphereLight args={[organico ? '#fff5ef' : '#dbeafe', organico ? '#47323d' : '#1e293b', organico ? 0.35 : 0.9]} />
        <directionalLight position={[3, 4, 5]} intensity={organico ? 1.2 : 1.6} castShadow={sombras}
          shadow-mapSize={[1024, 1024]} shadow-camera-left={-2} shadow-camera-right={2}
          shadow-camera-top={2} shadow-camera-bottom={-2} shadow-normalBias={0.025} shadow-bias={-0.0001} />
        <directionalLight position={[-4, 2, -3]} intensity={organico ? 0.4 : 0.65} color="#ffffff" />
        <ambientLight intensity={organico ? 0.1 : 0.25} />
        <CenaProvider
          value={{
            rotulosVisiveis: p.rotulosVisiveis,
            selecionado: p.selecionado,
            destaques: p.destaques ?? {},
            nomes: p.nomes,
            numeros: Object.fromEntries((modelo?.partes ?? []).map((id, i) => [id, String(i + 1)])),
            modoJogo: !!p.modoJogo,
            ocultos: p.modoJogo ? [] : p.ocultos,
            isolado: p.modoJogo ? null : p.isolado,
            corte: p.modoJogo ? null : p.corte,
            onEscolher: p.onEscolher,
          }}
        >
          <Suspense fallback={null}>
            <RotulosProvider key={p.estagioId} onQuadro={setQuadro}>
              <Tocavel>{Componente && <Componente />}</Tocavel>
            </RotulosProvider>
          </Suspense>
        </CenaProvider>
        <OrbitControls makeDefault enableDamping dampingFactor={0.12} minDistance={1} maxDistance={16} enablePan={false} />
        <Camera estagioId={p.estagioId} versao={p.versaoCamera ?? 0} />
        <Corte posicao={p.modoJogo ? null : p.corte ?? null} />
      </Canvas>
      <CamadaMarcadores quadro={quadro} />
    </div>
  );
}
