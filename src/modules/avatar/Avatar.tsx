// Componente do avatar. Com `config`, desenha o avatar montado; sem ele, uma silhueta neutra com a cor do nome
// (quem ainda não montou o avatar não recebe pele nem cabelo escolhidos pelo app).
import { useId, useMemo } from 'react';
import type { AvatarConfig, Forma } from './tipos.ts';
import { corDe, montarAvatar, type AvatarMontado } from './montar.ts';
import { corDoNome, descricaoAvatar, normalizarAvatar } from './regras.ts';

function Desenho({ f, cores }: { f: Forma; cores: AvatarMontado['cores'] }) {
  const p = {
    fill: corDe(f.f, cores) ?? 'none',
    stroke: f.s ? corDe(f.s, cores) : undefined,
    strokeWidth: f.s ? (f.sw ?? 3) : undefined,
    strokeLinecap: f.s ? ('round' as const) : undefined,
    strokeLinejoin: f.s ? ('round' as const) : undefined,
    opacity: f.o,
    fillRule: f.par ? ('evenodd' as const) : undefined,
    strokeDasharray: f.dash,
  };
  if (f.d) return <path d={f.d} {...p} />;
  if (f.c) return <circle cx={f.c[0]} cy={f.c[1]} r={f.c[2]} {...p} />;
  if (f.e) return <ellipse cx={f.e[0]} cy={f.e[1]} rx={f.e[2]} ry={f.e[3]} {...p} />;
  if (f.r) return <rect x={f.r[0]} y={f.r[1]} width={f.r[2]} height={f.r[3]} rx={f.r[4]} {...p} />;
  return null;
}

export interface AvatarProps {
  /** escolhas do jogador; aceita dado não confiável (servidor): ids desconhecidos são trocados pelo item inicial */
  config?: unknown;
  /** nome do jogador, para a cor da silhueta padrão e para o texto alternativo */
  nome?: string;
  /** lado, em px */
  tamanho?: number;
  className?: string;
  /** quando o nome já está escrito ao lado, o avatar é decorativo */
  decorativo?: boolean;
}

export function Avatar({ config, nome = '', tamanho = 40, className, decorativo = false }: AvatarProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const c: AvatarConfig | null = useMemo(() => normalizarAvatar(config), [config]);
  const montado = useMemo(() => (c ? montarAvatar(c) : null), [c]);
  const rotulo = c ? descricaoAvatar(c) : 'Avatar padrão';
  const acess = decorativo ? ({ 'aria-hidden': true } as const) : ({ role: 'img', 'aria-label': nome ? `${rotulo} (${nome})` : rotulo } as const);
  return (
    <svg className={`avatar ${className ?? ''}`.trim()} width={tamanho} height={tamanho} viewBox="0 0 200 200" {...acess}>
      <clipPath id={`av${id}`}>
        <circle cx="100" cy="100" r="100" />
      </clipPath>
      {montado ? (
        <>
          <g clipPath={`url(#av${id})`}>
            {montado.dentro.map((f, i) => (
              <Desenho key={i} f={f} cores={montado.cores} />
            ))}
          </g>
          {montado.fora.map((f, i) => (
            <Desenho key={i} f={f} cores={montado.cores} />
          ))}
        </>
      ) : (
        <g clipPath={`url(#av${id})`}>
          <circle cx="100" cy="100" r="100" fill={corDoNome(nome)} />
          <circle cx="100" cy="210" r="120" fill="#ffffff" opacity="0.14" />
          <path d="M26 200 C26 168 50 151 78 147 L122 147 C150 151 174 168 174 200 Z" fill="#0b1220" opacity="0.55" />
          <path d="M86 116 H114 V150 H86 Z" fill="#0b1220" opacity="0.55" />
          <path d="M63 84 C63 52 137 52 137 84 V96 C137 122 119 131 100 131 C81 131 63 122 63 96 Z" fill="#0b1220" opacity="0.55" />
        </g>
      )}
    </svg>
  );
}
