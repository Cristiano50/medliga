import { Fragment, type ReactNode } from 'react';
import { seloRevisao, type Revisao } from '../content/schema.ts';
import { Icone } from './Icone.tsx';

export function SeloRevisao({ revisao }: { revisao: Revisao }) {
  const s = seloRevisao(revisao);
  if (s === 'conferido-medico')
    return (
      <span className="selo medico" title={`Conferido por ${revisao.humano?.conferidoPor} em ${revisao.humano?.conferidoEm}`}>
        <Icone nome="visto" tamanho={12} /> Conferido por médico
      </span>
    );
  if (s === 'revisado-ia')
    return (
      <span className="selo ia" title={`Revisado por agentes: ${revisao.agentes.map((a) => a.area).join(', ')}. Conferência médica pendente.`}>
        <Icone nome="losango" tamanho={12} /> Revisado por IA · conferência médica pendente
      </span>
    );
  return <span className="selo pendente">Revisão pendente</span>;
}

/** Dificuldade da questão (1 a 5) em pontos cheios e vazados. */
export function Dificuldade({ nivel }: { nivel: number }) {
  return (
    <svg className="dificuldade" width={46} height={10} viewBox="0 0 46 10" role="img" aria-label={`${nivel} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={5 + i * 9} cy={5} r={3.2} fill={i < nivel ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.4} />
      ))}
    </svg>
  );
}

export function Barra({ valor, ouro = false, rotulo }: { valor: number; ouro?: boolean; rotulo?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, valor)) * 100);
  return (
    <div className={`barra ${ouro ? 'ouro' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={rotulo}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Markdown mínimo e seguro (sem HTML): parágrafos, listas com "-" ou "1.", **negrito** e *itálico*. */
export function Markdown({ texto }: { texto: string }) {
  const blocos = texto.replace(/\r/g, '').split(/\n{2,}/);
  return (
    <div className="markdown">
      {blocos.map((b, i) => {
        const linhas = b.split('\n').filter((l) => l.trim());
        if (linhas.length && linhas.every((l) => /^\s*[-*•]\s+/.test(l)))
          return (
            <ul key={i}>
              {linhas.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*•]\s+/, ''))}</li>
              ))}
            </ul>
          );
        if (linhas.length && linhas.every((l) => /^\s*\d+[.)]\s+/.test(l)))
          return (
            <ol key={i}>
              {linhas.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
              ))}
            </ol>
          );
        const titulo = b.match(/^#{1,4}\s+(.*)$/);
        if (titulo) return <h3 key={i}>{inline(titulo[1])}</h3>;
        return <p key={i}>{inline(linhas.join(' '))}</p>;
      })}
    </div>
  );
}

function inline(s: string): ReactNode {
  const partes = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return partes.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}
