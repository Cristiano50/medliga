import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface AncoraRotulo {
  objeto: THREE.Object3D;
  ponto: THREE.Vector3;
  numero: string;
  nome: string;
  estado: string;
}
const Registro = createContext<Map<string, AncoraRotulo>>(new Map());
export const useRegistroRotulos = () => useContext(Registro);
interface Projetado { id: string; x: number; y: number; numero: string; nome: string; estado: string }

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

function Marcadores() {
  const registro = useRegistroRotulos();
  const { size } = useThree();
  const [pontos, setPontos] = useState<Projetado[]>([]);
  const anterior = useRef('');
  useFrame(({ camera, gl }) => {
    const novos: Projetado[] = [];
    for (const [id, r] of registro) {
      r.objeto.updateWorldMatrix(true, false);
      const mundo = r.objeto.localToWorld(r.ponto.clone());
      if (gl.clippingPlanes.some((p) => p.distanceToPoint(mundo) < 0)) continue;
      const p = mundo.project(camera);
      if (p.z < -1 || p.z > 1) continue;
      novos.push({ id, x: Math.round((p.x + 1) * size.width / 2), y: Math.round((1 - p.y) * size.height / 2), numero: r.numero, nome: r.nome, estado: r.estado });
    }
    const chave = JSON.stringify(novos);
    if (chave !== anterior.current) { anterior.current = chave; setPontos(novos); }
  });
  const distribuidos = distribuirRotulos(pontos, size.width, size.height);
  return <Html fullscreen zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
    <svg width={size.width} height={size.height} className="guias3d" aria-hidden="true">
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
  </Html>;
}

export function RotulosProvider({ children }: { children: ReactNode }) {
  const registro = useMemo(() => new Map<string, AncoraRotulo>(), []);
  return <Registro.Provider value={registro}>{children}<Marcadores /></Registro.Provider>;
}
