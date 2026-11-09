import { Fragment, type ReactNode } from 'react';
import { seloRevisao, type Revisao } from '../content/schema.ts';

export function SeloRevisao({ revisao }: { revisao: Revisao }) {
  const s = seloRevisao(revisao);
  if (s === 'conferido-medico')
    return (
      <span className="selo medico" title={`Conferido por ${revisao.humano?.conferidoPor} em ${revisao.humano?.conferidoEm}`}>
        ✔ Conferido por médico
      </span>
    );
  if (s === 'revisado-ia')
    return (
      <span className="selo ia" title={`Revisado por agentes: ${revisao.agentes.map((a) => a.area).join(', ')}. Conferência médica pendente.`}>
        ◆ Revisado por IA · conferência médica pendente
      </span>
    );
  return <span className="selo pendente">Revisão pendente</span>;
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
