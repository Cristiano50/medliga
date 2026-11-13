// Ícone do conjunto próprio (src/ui/icones.ts). Decorativo por padrão; com `rotulo`, vira imagem com nome acessível.
import { ICONES, type NomeIcone, type ParteIcone } from './icones.ts';

export interface IconeProps {
  nome: NomeIcone;
  /** lado, em px */
  tamanho?: number;
  className?: string;
  /** nome acessível; sem ele, o ícone fica fora da leitura de tela (o texto ao lado já diz o que é) */
  rotulo?: string;
}

export function Icone({ nome, tamanho = 20, className, rotulo }: IconeProps) {
  const partes = ICONES[nome] as ParteIcone[];
  const acess = rotulo ? ({ role: 'img', 'aria-label': rotulo } as const) : ({ 'aria-hidden': true } as const);
  return (
    <svg className={`icone-svg ${className ?? ''}`.trim()} width={tamanho} height={tamanho} viewBox="0 0 24 24" {...acess}>
      {partes.map((p, i) =>
        typeof p === 'string' ? (
          <path key={i} d={p} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ) : p.p === 'suave' ? (
          <path key={i} d={p.d} fill="currentColor" fillOpacity={0.2} />
        ) : (
          <path key={i} d={p.d} fill="currentColor" />
        ),
      )}
    </svg>
  );
}
