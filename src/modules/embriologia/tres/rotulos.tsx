import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface AncoraRotulo {
  objeto: THREE.Object3D;
  ponto: THREE.Vector3;
  numero: string;
  nome: string;
  estado: string;
  /** 'texto': rótulo fixo (ex.: Cranial/Caudal) desenhado no próprio ponto, fora da distribuição em colunas. */
  tipo?: 'marcador' | 'texto';
}
const Registro = createContext<Map<string, AncoraRotulo>>(new Map());
export const useRegistroRotulos = () => useContext(Registro);
export interface Projetado { id: string; x: number; y: number; numero: string; nome: string; estado: string; tipo?: 'marcador' | 'texto' }

/** Uma âncora fora do enquadramento não deve gerar uma linha para fora do palco. */
export function ancoraNoEnquadramento(p: { x: number; y: number; z: number }) {
  return [p.x, p.y, p.z].every((v) => Number.isFinite(v) && v >= -1 && v <= 1);
}

/** Duas colunas de marcadores numerados, separadas do modelo; nomes completos ficam na lista acessível. */
export function distribuirRotulos<T extends { x: number; y: number }>(pontos: T[], largura: number, altura: number) {
  const lados = pontos.map((p, i) => ({ ...p, indice: i })).reduce<{ esquerda: (T & { indice: number })[]; direita: (T & { indice: number })[] }>(
    (lados, p) => { lados[p.x < largura / 2 ? 'esquerda' : 'direita'].push(p); return lados; },
    { esquerda: [], direita: [] },
  );
  const capacidade = Math.floor((altura - 80) / 28);
  if (lados.esquerda.length > capacidade || lados.direita.length > capacidade) {
    const ordenados = [...lados.esquerda, ...lados.direita].sort((a, b) => a.x - b.x);
    lados.esquerda = ordenados.slice(0, Math.ceil(ordenados.length / 2));
    lados.direita = ordenados.slice(Math.ceil(ordenados.length / 2));
  }
  return Object.entries(lados).flatMap(([lado, itens]) => itens.sort((a, b) => a.y - b.y).map((p, i) => {
    const passo = Math.min(34, (altura - 80) / Math.max(1, itens.length));
    return { ...p, marcadorX: lado === 'esquerda' ? 22 : largura - 22, marcadorY: altura / 2 + (i - (itens.length - 1) / 2) * passo };
  }));
}

export interface QuadroMarcadores { pontos: Projetado[]; largura: number; altura: number }

/** Dentro do canvas: projeta as âncoras registradas e entrega as posições de tela para fora (sem raiz React aninhada). */
function Projetor({ onQuadro }: { onQuadro: (q: QuadroMarcadores) => void }) {
  const registro = useRegistroRotulos();
  const { size } = useThree();
  const anterior = useRef('');
  useFrame(({ camera, gl }) => {
    const novos: Projetado[] = [];
    for (const [id, r] of registro) {
      r.objeto.updateWorldMatrix(true, false);
      const mundo = r.objeto.localToWorld(r.ponto.clone());
      if (gl.clippingPlanes.some((p) => p.distanceToPoint(mundo) < 0)) continue;
      const p = mundo.project(camera);
      if (!ancoraNoEnquadramento(p)) continue;
      novos.push({ id, x: Math.round((p.x + 1) * size.width / 2), y: Math.round((1 - p.y) * size.height / 2), numero: r.numero, nome: r.nome, estado: r.estado, tipo: r.tipo });
    }
    const chave = `${size.width}x${size.height}:${JSON.stringify(novos)}`;
    if (chave !== anterior.current) { anterior.current = chave; onQuadro({ pontos: novos, largura: size.width, altura: size.height }); }
  });
  useEffect(() => () => onQuadro({ pontos: [], largura: 0, altura: 0 }), [onQuadro]);
  return null;
}

/** Texto preso a um ponto do modelo (ex.: orientação Cranial/Caudal), projetado pela mesma camada dos marcadores. */
export function TextoAncorado({ id, posicao, texto }: { id: string; posicao: [number, number, number]; texto: string }) {
  const registro = useRegistroRotulos();
  const grupo = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  useLayoutEffect(() => {
    if (!grupo.current) return;
    registro.set(id, { objeto: grupo.current, ponto: new THREE.Vector3(), numero: '', nome: texto, estado: 'normal', tipo: 'texto' });
    invalidate();
    return () => { registro.delete(id); invalidate(); };
  }, [id, texto, registro, invalidate]);
  return <group ref={grupo} position={posicao} />;
}

/** Fora do canvas: guias, marcadores numerados e textos ancorados (DOM comum, sem raiz React aninhada). */
export function CamadaMarcadores({ quadro }: { quadro: QuadroMarcadores }) {
  if (!quadro.pontos.length || !quadro.largura) return null;
  const marcadores = quadro.pontos.filter((p) => p.tipo !== 'texto');
  const textos = quadro.pontos.filter((p) => p.tipo === 'texto');
  const distribuidos = distribuirRotulos(marcadores, quadro.largura, quadro.altura);
  return (
    <div className="camada3d" style={{ width: quadro.largura, height: quadro.altura }}>
      {textos.map((t) => (
        <span key={t.id} className="orientacao3d" style={{ left: t.x, top: t.y }}>{t.nome}</span>
      ))}
      <svg width={quadro.largura} height={quadro.altura} className="guias3d" aria-hidden="true">
        {distribuidos.map((p) => {
          const x = p.marcadorX;
          const y = p.marcadorY;
          const simbolo = p.estado === 'certo' ? '✓' : p.estado === 'errado' ? '×' : p.numero;
          return <g key={p.id} className={`guia3d ${p.estado}`}>
            <title>{p.nome}</title>
            <path d={`M ${x} ${y} L ${p.x} ${p.y}`} />
            <circle cx={p.x} cy={p.y} r={3} />
            <circle className="marcador" cx={x} cy={y} r={13} />
            <text x={x} y={y} dy=".35em" textAnchor="middle">{simbolo}</text>
          </g>;
        })}
      </svg>
    </div>
  );
}

export function RotulosProvider({ children, onQuadro }: { children: ReactNode; onQuadro: (q: QuadroMarcadores) => void }) {
  const registro = useMemo(() => new Map<string, AncoraRotulo>(), []);
  return <Registro.Provider value={registro}>{children}<Projetor onQuadro={onQuadro} /></Registro.Provider>;
}
