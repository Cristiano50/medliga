// Cena de resultado e estado vazio (desenho em src/ui/cenas.ts; movimento em styles.css).
import type { CSSProperties, ReactNode } from 'react';
import type { NomeIcone } from './icones.ts';
import { CAIXA_CENA, cenaPartes, type Humor } from './cenas.ts';
import { Formas } from './Insignias.tsx';

export interface CenaProps {
  humor: Humor;
  icone: NomeIcone;
  /** lado, em px */
  tamanho?: number;
}

/**
 * Ilustração do topo das telas de resultado. É decorativa: o resultado vem escrito logo abaixo.
 * O movimento é curto e termina no desenho pronto; com "reduzir movimento" ligado, a cena já aparece pronta.
 */
export function Cena({ humor, icone, tamanho = 120 }: CenaProps) {
  const p = cenaPartes(humor, icone);
  return (
    <svg className={`cena ${humor}`} width={tamanho} height={tamanho} viewBox={CAIXA_CENA} aria-hidden="true">
      <g className="cena-halo">
        <Formas formas={p.halo} />
      </g>
      {p.pecas.map(({ dx, dy, ...f }, i) => (
        <g key={`p${i}`} className="cena-peca" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${0.12 + i * 0.03}s` } as CSSProperties}>
          <Formas formas={[f]} />
        </g>
      ))}
      {p.brilhos.map((f, i) => (
        <g key={`b${i}`} className="cena-brilho" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
          <Formas formas={[f]} />
        </g>
      ))}
      <g className="cena-icone">
        <Formas formas={p.icone} />
      </g>
    </svg>
  );
}

/** Tela (ou trecho) sem conteúdo: a cena em tom calmo, um título, um texto curto e as ações. */
export function EstadoVazio({ icone, humor = 'calmo', titulo, children }: { icone: NomeIcone; humor?: Humor; titulo: string; children?: ReactNode }) {
  return (
    <div className="card pilha centro estado-vazio">
      <Cena humor={humor} icone={icone} tamanho={104} />
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}
