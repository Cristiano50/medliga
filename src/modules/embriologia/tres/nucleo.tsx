// Núcleo dos modelos 3D: cada estrutura anatômica é uma <Parte id="..."> com material próprio.
// Seleção: o toque é resolvido no nível da cena, escolhendo entre todas as interseções a parte de maior
// "prioridade" (cascas transparentes têm prioridade baixa, para que estruturas internas possam ser tocadas).
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export type EstadoDestaque = 'normal' | 'selecionado' | 'certo' | 'errado' | 'apagado';

export interface CenaCtx {
  rotulosVisiveis: boolean;
  selecionado: string | null;
  destaques: Record<string, EstadoDestaque>;
  nomes: Record<string, string>;
  /** em modo jogo, rótulos ficam escondidos para não entregar a resposta */
  modoJogo: boolean;
  onEscolher?: (id: string) => void;
}

const Ctx = createContext<CenaCtx>({ rotulosVisiveis: true, selecionado: null, destaques: {}, nomes: {}, modoJogo: false });
const MaterialCtx = createContext<THREE.Material | null>(null);

export const CenaProvider = Ctx.Provider;
export const useCena = () => useContext(Ctx);

const COR_SELECIONADO = new THREE.Color('#2dd4bf');
const COR_CERTO = new THREE.Color('#22c55e');
const COR_ERRADO = new THREE.Color('#ef4444');

export interface ParteProps {
  id: string;
  cor: string;
  opacidade?: number;
  /** Cascas e volumes envolventes: prioridade baixa no toque. Padrão 5. */
  prioridade?: number;
  rotulo?: [number, number, number];
  ladoDuplo?: boolean;
  rugosidade?: number;
  sombreamentoPlano?: boolean;
  children: ReactNode;
  posicao?: [number, number, number];
  rotacao?: [number, number, number];
  escala?: number | [number, number, number];
}

export function Parte({
  id,
  cor,
  opacidade = 1,
  prioridade = 5,
  rotulo,
  ladoDuplo,
  rugosidade = 0.62,
  sombreamentoPlano,
  children,
  posicao,
  rotacao,
  escala,
}: ParteProps) {
  const cena = useCena();
  const grupo = useRef<THREE.Group>(null);
  const [ancora, setAncora] = useState<[number, number, number] | null>(rotulo ?? null);
  const { invalidate } = useThree();

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: cor,
      roughness: rugosidade,
      metalness: 0.02,
      transparent: opacidade < 1,
      opacity: opacidade,
      depthWrite: opacidade >= 0.98,
      side: ladoDuplo || opacidade < 1 ? THREE.DoubleSide : THREE.FrontSide,
      flatShading: !!sombreamentoPlano,
    });
    return m;
  }, [cor, opacidade, ladoDuplo, rugosidade, sombreamentoPlano]);

  useEffect(() => () => material.dispose(), [material]);

  const estado: EstadoDestaque = cena.destaques[id] ?? (cena.selecionado === id ? 'selecionado' : cena.selecionado ? 'apagado' : 'normal');

  useEffect(() => {
    const m = material;
    m.emissive.set('#000000');
    m.emissiveIntensity = 0;
    let op = opacidade;
    if (estado === 'selecionado') {
      m.emissive.copy(COR_SELECIONADO);
      m.emissiveIntensity = 0.45;
    } else if (estado === 'certo') {
      m.emissive.copy(COR_CERTO);
      m.emissiveIntensity = 0.6;
    } else if (estado === 'errado') {
      m.emissive.copy(COR_ERRADO);
      m.emissiveIntensity = 0.6;
    } else if (estado === 'apagado') {
      op = Math.min(opacidade, opacidade * 0.35 + 0.05);
    }
    m.opacity = op;
    m.transparent = op < 1;
    m.depthWrite = op >= 0.98;
    m.needsUpdate = true;
    invalidate();
  }, [estado, material, opacidade, invalidate]);

  useLayoutEffect(() => {
    if (rotulo || !grupo.current) return;
    // Âncora: centro da primeira malha (em partes bilaterais, um dos lados), convertido para o espaço do grupo.
    let primeira: THREE.Object3D | null = null;
    grupo.current.traverse((o) => {
      if (!primeira && (o as THREE.Mesh).isMesh) primeira = o;
    });
    if (!primeira) return;
    grupo.current.updateWorldMatrix(true, true);
    const caixa = new THREE.Box3().setFromObject(primeira);
    if (caixa.isEmpty()) return;
    const c = grupo.current.worldToLocal(caixa.getCenter(new THREE.Vector3()));
    setAncora([c.x, c.y, c.z]);
  }, [rotulo]);

  useLayoutEffect(() => {
    grupo.current?.traverse((o) => {
      o.userData.parteId = id;
      o.userData.prioridade = prioridade;
      if ((o as THREE.Mesh).isMesh) {
        // translúcidas: cascas externas (prioridade baixa) primeiro, internas por cima
        (o as THREE.Mesh).renderOrder = opacidade < 1 ? 2 + prioridade : 0;
      }
    });
  });

  const mostrarRotulo =
    !!ancora && ((cena.rotulosVisiveis && !cena.modoJogo) || estado === 'selecionado' || estado === 'certo' || estado === 'errado');

  return (
    <group ref={grupo} position={posicao} rotation={rotacao} scale={escala}>
      <MaterialCtx.Provider value={material}>{children}</MaterialCtx.Provider>
      {mostrarRotulo && ancora && (
        <Html position={ancora} center={false} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`rotulo3d ${estado === 'selecionado' ? 'ativo' : ''}`}>{cena.nomes[id] ?? id}</div>
        </Html>
      )}
    </group>
  );
}

/** Malha que usa o material da <Parte> em que está. */
export function Malha({
  geometria,
  posicao,
  rotacao,
  escala,
}: {
  geometria: THREE.BufferGeometry;
  posicao?: [number, number, number] | THREE.Vector3;
  rotacao?: [number, number, number] | THREE.Euler;
  escala?: number | [number, number, number] | THREE.Vector3;
}) {
  const material = useContext(MaterialCtx);
  return (
    <mesh
      geometry={geometria}
      material={material ?? undefined}
      position={posicao as THREE.Vector3}
      rotation={rotacao as THREE.Euler}
      scale={escala as THREE.Vector3}
    />
  );
}

function parteDoObjeto(o: THREE.Object3D | null): { id: string; prioridade: number } | null {
  let x: THREE.Object3D | null = o;
  while (x) {
    if (x.userData?.parteId) return { id: x.userData.parteId as string, prioridade: (x.userData.prioridade as number) ?? 5 };
    x = x.parent;
  }
  return null;
}

/** Escolhe a parte tocada: maior prioridade; empate → mais próxima. */
export function resolverToque(intersecoes: THREE.Intersection[]): string | null {
  let melhor: { id: string; prioridade: number; distancia: number } | null = null;
  for (const it of intersecoes) {
    const p = parteDoObjeto(it.object);
    if (!p) continue;
    if (!melhor || p.prioridade > melhor.prioridade || (p.prioridade === melhor.prioridade && it.distance < melhor.distancia)) {
      melhor = { ...p, distancia: it.distance };
    }
  }
  return melhor?.id ?? null;
}

/** Grupo raiz que captura toques e hover de toda a cena. */
export function Tocavel({ children }: { children: ReactNode }) {
  const cena = useCena();
  const { gl } = useThree();
  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.delta > 6) return; // foi um arraste (girar a câmera), não um toque
        e.stopPropagation();
        const id = resolverToque(e.intersections);
        if (id) cena.onEscolher?.(id);
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        gl.domElement.style.cursor = resolverToque(e.intersections) ? 'pointer' : 'grab';
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = 'grab';
      }}
    >
      {children}
    </group>
  );
}
