// Visor do microscópio virtual: campo circular, objetivas, arrastar para percorrer, toque nas estruturas.
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { criarRng } from '../../core/random.ts';
import { H, W } from './he.tsx';
import { LAMINAS_RENDER } from './laminas/index.ts';

export const OBJETIVAS = [
  { nome: '4×', total: '40×', tamanho: 700 },
  { nome: '10×', total: '100×', tamanho: 300 },
  { nome: '40×', total: '400×', tamanho: 120 },
] as const;

export type Destaque = 'certo' | 'errado';

function semente(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface VisorProps {
  laminaId: string;
  selecionado?: string | null;
  destaques?: Record<string, Destaque>;
  onEscolher?: (id: string) => void;
  /** objetiva inicial (0, 1 ou 2) e centro inicial; mudam quando a chave muda */
  objetivaInicial?: number;
  centroInicial?: { x: number; y: number };
  /** esconde a troca de objetiva (jogo "Qual é o tecido?") */
  objetivaFixa?: boolean;
}

function limitar(c: { x: number; y: number }, tamanho: number) {
  const meia = tamanho / 2;
  const x = tamanho >= W ? W / 2 : Math.min(W - meia, Math.max(meia, c.x));
  const y = tamanho >= H ? H / 2 : Math.min(H - meia, Math.max(meia, c.y));
  return { x, y };
}

export function Visor({ laminaId, selecionado, destaques = {}, onEscolher, objetivaInicial = 0, centroInicial, objetivaFixa }: VisorProps) {
  const render = LAMINAS_RENDER[laminaId];
  const desenho = useMemo(() => render?.desenhar(criarRng(semente(laminaId))), [laminaId, render]);
  const [obj, setObj] = useState(objetivaInicial);
  const [centro, setCentro] = useState(() => limitar(centroInicial ?? { x: W / 2, y: H / 2 }, OBJETIVAS[objetivaInicial].tamanho));
  const caixa = useRef<HTMLDivElement>(null);
  const arraste = useRef<{ x: number; y: number; cx: number; cy: number; moveu: boolean } | null>(null);

  useEffect(() => {
    setObj(objetivaInicial);
    setCentro(limitar(centroInicial ?? { x: W / 2, y: H / 2 }, OBJETIVAS[objetivaInicial].tamanho));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laminaId, objetivaInicial, centroInicial?.x, centroInicial?.y]);

  const tamanho = OBJETIVAS[obj].tamanho;
  const vb = `${centro.x - tamanho / 2} ${centro.y - tamanho / 2} ${tamanho} ${tamanho}`;

  function trocarObjetiva(i: number) {
    setObj(i);
    setCentro((c) => limitar(c, OBJETIVAS[i].tamanho));
  }

  function aoPressionar(e: RPointerEvent) {
    arraste.current = { x: e.clientX, y: e.clientY, cx: centro.x, cy: centro.y, moveu: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function aoMover(e: RPointerEvent) {
    const a = arraste.current;
    if (!a || !caixa.current) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!a.moveu && Math.hypot(dx, dy) < 6) return;
    a.moveu = true;
    const escala = tamanho / caixa.current.getBoundingClientRect().width;
    setCentro(limitar({ x: a.cx - dx * escala, y: a.cy - dy * escala }, tamanho));
  }
  function aoSoltar(e: RPointerEvent) {
    const a = arraste.current;
    arraste.current = null;
    if (!a || a.moveu) return;
    const alvo = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-e]');
    const id = alvo?.getAttribute('data-e');
    if (id) onEscolher?.(id);
  }

  const estilos = [
    selecionado ? `.lamina [data-e]:not([data-e="${selecionado}"]) { opacity: .38 }` : '',
    selecionado ? `.lamina [data-e="${selecionado}"] { filter: drop-shadow(0 0 2px #0f766e) drop-shadow(0 0 5px #2dd4bf) }` : '',
    ...Object.entries(destaques).map(
      ([id, d]) => `.lamina [data-e="${id}"] { filter: drop-shadow(0 0 2px ${d === 'certo' ? '#15803d' : '#b91c1c'}) drop-shadow(0 0 6px ${d === 'certo' ? '#22c55e' : '#ef4444'}) }`,
    ),
  ].join('\n');

  if (!render) return <div className="aviso">Lâmina não encontrada.</div>;

  return (
    <div className="microscopio">
      <div
        ref={caixa}
        className="ocular"
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={() => (arraste.current = null)}
        role="img"
        aria-label="Campo do microscópio: arraste para percorrer a lâmina e toque numa estrutura"
      >
        <svg className="lamina" viewBox={vb} preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <style>{estilos}</style>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#efe6ec" />
          {desenho}
        </svg>
        <div className="vinheta" aria-hidden />
      </div>
      {!objetivaFixa && (
        <div className="objetivas" role="group" aria-label="Objetiva">
          {OBJETIVAS.map((o, i) => (
            <button key={o.nome} className={`btn pequeno ${i === obj ? 'primario' : ''}`} aria-pressed={i === obj} onClick={() => trocarObjetiva(i)}>
              {o.nome}
            </button>
          ))}
          <span className="muted pequeno">aumento total {OBJETIVAS[obj].total}</span>
        </div>
      )}
    </div>
  );
}
