// Núcleo dos modelos 3D: cada estrutura anatômica é uma <Parte id="..."> com material próprio.
// Seleção: o toque é resolvido no nível da cena, escolhendo entre todas as interseções a parte de maior
// "prioridade" (cascas transparentes têm prioridade baixa, para que estruturas internas possam ser tocadas).
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Outlines } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useRegistroRotulos } from './rotulos.tsx';

export type EstadoDestaque = 'normal' | 'selecionado' | 'certo' | 'errado' | 'apagado';

export interface CenaCtx {
  rotulosVisiveis: boolean;
  selecionado: string | null;
  destaques: Record<string, EstadoDestaque>;
  nomes: Record<string, string>;
  numeros?: Record<string, string>;
  /** em modo jogo, rótulos ficam escondidos para não entregar a resposta */
  modoJogo: boolean;
  ocultos?: string[];
  isolado?: string | null;
  corte?: number | null;
  onEscolher?: (id: string) => void;
}

const Ctx = createContext<CenaCtx>({ rotulosVisiveis: true, selecionado: null, destaques: {}, nomes: {}, modoJogo: false });
const MaterialCtx = createContext<THREE.Material | null>(null);
const ContornoCtx = createContext<string | null>(null);

export const CenaProvider = Ctx.Provider;
export const useCena = () => useContext(Ctx);

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
  const registro = useRegistroRotulos();
  const visivel = !cena.ocultos?.includes(id) && (!cena.isolado || cena.isolado === id);
  const grupo = useRef<THREE.Group>(null);
  const [ancora, setAncora] = useState<[number, number, number] | null>(rotulo ?? null);
  const { invalidate } = useThree();

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: cor,
      roughness: rugosidade,
      metalness: 0,
      transparent: opacidade < 1,
      opacity: opacidade,
      depthWrite: opacidade >= 0.98,
      side: THREE.DoubleSide,
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
    if (estado === 'apagado') {
      op = Math.min(opacidade, opacidade * 0.35 + 0.05);
    }
    m.opacity = op;
    m.transparent = op < 1;
    m.depthWrite = op >= 0.98;
    m.needsUpdate = true;
    invalidate();
  }, [estado, material, opacidade, invalidate]);

  useLayoutEffect(() => {
    if (!grupo.current) return;
    // Nas cascas, o centro da caixa fica no vazio. A dica de rótulo escolhe um vértice
    // da própria superfície, para não apontar miométrio/âmnio ao centro do feto.
    if (rotulo) {
      grupo.current.updateWorldMatrix(true, true);
      const inversa = grupo.current.matrixWorld.clone().invert();
      const alvo = new THREE.Vector3(...rotulo);
      let distancia = Infinity;
      const melhor = new THREE.Vector3();
      const ponto = new THREE.Vector3();
      grupo.current.traverse((o) => {
        const malha = o as THREE.Mesh;
        if (!malha.isMesh || malha.material !== material) return;
        const vertices = malha.geometry.getAttribute('position');
        const matriz = new THREE.Matrix4().multiplyMatrices(inversa, malha.matrixWorld);
        for (let i = 0; i < vertices.count; i++) {
          ponto.fromBufferAttribute(vertices, i).applyMatrix4(matriz);
          const d = ponto.distanceToSquared(alvo);
          if (d < distancia) { distancia = d; melhor.copy(ponto); }
        }
      });
      if (Number.isFinite(distancia)) setAncora([melhor.x, melhor.y, melhor.z]);
      return;
    }
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
  }, [rotulo, children, material]);

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
    visivel && !!ancora && ((cena.rotulosVisiveis && !cena.modoJogo && !!cena.numeros?.[id]) || estado === 'selecionado' || estado === 'certo' || estado === 'errado');
  const contorno = estado === 'selecionado' ? '#2dd4bf' : estado === 'certo' ? '#4ade80' : estado === 'errado' ? '#f87171' : null;
  useLayoutEffect(() => {
    if (mostrarRotulo && ancora && grupo.current) {
      registro.set(id, { objeto: grupo.current, ponto: new THREE.Vector3(...ancora), numero: cena.numeros?.[id] ?? '•', nome: cena.nomes[id] ?? id, estado });
    } else registro.delete(id);
    invalidate();
    return () => { registro.delete(id); };
  }, [mostrarRotulo, ancora, id, registro, cena.nomes, cena.numeros, estado, invalidate]);

  return (
    <group ref={grupo} position={posicao} rotation={rotacao} scale={escala} visible={visivel}>
      <MaterialCtx.Provider value={material}><ContornoCtx.Provider value={contorno}>{children}</ContornoCtx.Provider></MaterialCtx.Provider>
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
  const contorno = useContext(ContornoCtx);
  const { gl } = useThree();
  return (
    <mesh
      geometry={geometria}
      material={material ?? undefined}
      position={posicao as THREE.Vector3}
      rotation={rotacao as THREE.Euler}
      scale={escala as THREE.Vector3}
    >
      {contorno && <Outlines thickness={2} color={contorno} clippingPlanes={gl.clippingPlanes} />}
    </mesh>
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
export function resolverToque(intersecoes: THREE.Intersection[], planos: THREE.Plane[] = []): string | null {
  let melhor: { id: string; prioridade: number; distancia: number } | null = null;
  for (const it of intersecoes) {
    if (planos.some((p) => p.distanceToPoint(it.point) < 0)) continue;
    let visivel = true;
    for (let o: THREE.Object3D | null = it.object; o; o = o.parent) if (!o.visible) visivel = false;
    if (!visivel) continue;
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
        const id = resolverToque(e.intersections, gl.clippingPlanes);
        if (id) cena.onEscolher?.(id);
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        gl.domElement.style.cursor = resolverToque(e.intersections, gl.clippingPlanes) ? 'pointer' : 'grab';
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = 'grab';
      }}
    >
      {children}
    </group>
  );
}
