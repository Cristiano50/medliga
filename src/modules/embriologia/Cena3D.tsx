import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CenaProvider, Tocavel, type EstadoDestaque } from './tres/nucleo.tsx';
import { MODELOS } from './modelos/index.ts';

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
}

export function Cena3D(p: Cena3DProps) {
  const modelo = MODELOS[p.estagioId];
  const Componente = modelo?.Componente;
  return (
    <div className={`palco3d ${p.telaCheia ? 'tela-cheia' : ''}`}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ fov: 40, near: 0.05, far: 100, position: modelo?.camera ?? [0, 0, 4] }}
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        onPointerMissed={() => p.onVazio?.()}
        aria-label="Modelo 3D interativo"
      >
        <color attach="background" args={['#0d1628']} />
        <hemisphereLight args={['#dbeafe', '#1e293b', 0.9]} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#93c5fd" />
        <ambientLight intensity={0.25} />
        <CenaProvider
          value={{
            rotulosVisiveis: p.rotulosVisiveis,
            selecionado: p.selecionado,
            destaques: p.destaques ?? {},
            nomes: p.nomes,
            modoJogo: !!p.modoJogo,
            onEscolher: p.onEscolher,
          }}
        >
          <Suspense fallback={null}>
            <Tocavel>{Componente && <Componente key={p.estagioId} />}</Tocavel>
          </Suspense>
        </CenaProvider>
        <OrbitControls makeDefault enableDamping dampingFactor={0.12} minDistance={1} maxDistance={16} enablePan={false} />
        <Camera estagioId={p.estagioId} versao={p.versaoCamera ?? 0} />
      </Canvas>
    </div>
  );
}
