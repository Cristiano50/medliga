// Renderizadores de cada tipo de questão. Controlados: o componente pai guarda a resposta.
import { useEffect, useState } from 'react';
import type { Questao, QuestaoAssociar, QuestaoMultipla, QuestaoOrdenar, QuestaoVF } from '../content/schema.ts';
import type { Resposta } from '../core/scoring.ts';
import { Icone } from '../ui/Icone.tsx';

interface Props<Q extends Questao> {
  questao: Q;
  ordemExibicao?: string[];
  resposta: Resposta | null;
  onResponder: (r: Resposta) => void;
  revelada: boolean; // mostrar certo/errado
  /** Plantão: um toque já confirma. */
  imediato?: boolean;
  onConfirmar?: () => void;
}

export function QuestaoView(p: Props<Questao>) {
  const q = p.questao;
  return (
    <div className="pilha">
      {q.tipo === 'multipla' && q.contexto && (
        <div className="card" style={{ background: 'var(--bg-elev)' }}>
          <span className="selo" style={{ marginBottom: 6 }}>Caso clínico</span>
          <p style={{ margin: '6px 0 0', color: 'var(--text-2)' }}>{q.contexto}</p>
        </div>
      )}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{q.enunciado}</h2>
      {q.tipo === 'multipla' && <Multipla {...(p as Props<QuestaoMultipla>)} />}
      {q.tipo === 'vf' && <VF {...(p as Props<QuestaoVF>)} />}
      {q.tipo === 'ordenar' && <Ordenar {...(p as Props<QuestaoOrdenar>)} />}
      {q.tipo === 'associar' && <Associar {...(p as Props<QuestaoAssociar>)} />}
    </div>
  );
}

function Multipla({ questao: q, ordemExibicao, resposta, onResponder, revelada, imediato, onConfirmar }: Props<QuestaoMultipla>) {
  const ordem = ordemExibicao ?? q.alternativas.map((a) => a.id);
  const escolhida = resposta?.tipo === 'multipla' ? resposta.escolhida : null;
  const letras = 'abcde';
  return (
    <div className="lista-opcoes" role="radiogroup">
      {ordem.map((id, i) => {
        const alt = q.alternativas.find((a) => a.id === id)!;
        let cls = '';
        if (revelada) {
          if (id === q.correta) cls = 'certa';
          else if (id === escolhida) cls = 'errada';
        } else if (id === escolhida) cls = 'selecionada';
        return (
          <button
            key={id}
            role="radio"
            aria-checked={id === escolhida}
            className={`opcao ${cls}`}
            disabled={revelada}
            onClick={() => {
              onResponder({ tipo: 'multipla', escolhida: id });
              if (imediato) setTimeout(() => onConfirmar?.(), 0);
            }}
          >
            <span className="letra">{letras[i]}</span>
            <span>{alt.texto}</span>
          </button>
        );
      })}
    </div>
  );
}

function VF({ questao: q, resposta, onResponder, revelada, imediato, onConfirmar }: Props<QuestaoVF>) {
  const escolhida = resposta?.tipo === 'vf' ? resposta.escolhida : null;
  return (
    <div className="grade g2" role="radiogroup">
      {[true, false].map((v) => {
        let cls = '';
        if (revelada) {
          if (v === q.correta) cls = 'certa';
          else if (v === escolhida) cls = 'errada';
        } else if (v === escolhida) cls = 'selecionada';
        return (
          <button
            key={String(v)}
            role="radio"
            aria-checked={v === escolhida}
            className={`opcao ${cls}`}
            style={{ justifyContent: 'center', fontWeight: 800, fontSize: '1.05rem' }}
            disabled={revelada}
            onClick={() => {
              onResponder({ tipo: 'vf', escolhida: v });
              if (imediato) setTimeout(() => onConfirmar?.(), 0);
            }}
          >
            {v ? 'Verdadeiro' : 'Falso'}
          </button>
        );
      })}
    </div>
  );
}

function Ordenar({ questao: q, ordemExibicao, resposta, onResponder, revelada }: Props<QuestaoOrdenar>) {
  const inicial = ordemExibicao ?? q.itens.map((i) => i.id);
  const ordem = resposta?.tipo === 'ordenar' ? resposta.ordem : inicial;
  useEffect(() => {
    if (!resposta) onResponder({ tipo: 'ordenar', ordem: inicial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);
  function mover(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= ordem.length) return;
    const nova = [...ordem];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    onResponder({ tipo: 'ordenar', ordem: nova });
  }
  return (
    <div className="pilha" style={{ gap: 8 }}>
      <p className="muted pequeno" style={{ margin: 0 }}>Use as setas para colocar do primeiro (topo) ao último.</p>
      {ordem.map((id, i) => {
        const item = q.itens.find((x) => x.id === id)!;
        const cls = revelada ? (q.ordemCorreta[i] === id ? 'certo' : 'errado') : '';
        return (
          <div key={id} className={`ordenavel ${cls}`}>
            <span className="pos">{i + 1}</span>
            <span className="texto">{item.texto}</span>
            {!revelada && (
              <span className="setas">
                <button aria-label={`Subir ${item.texto}`} onClick={() => mover(i, -1)} disabled={i === 0}><Icone nome="seta-cima" tamanho={18} /></button>
                <button aria-label={`Descer ${item.texto}`} onClick={() => mover(i, 1)} disabled={i === ordem.length - 1}><Icone nome="seta-baixo" tamanho={18} /></button>
              </span>
            )}
          </div>
        );
      })}
      {revelada && (
        <div className="card pequeno">
          <strong>Ordem correta:</strong>
          <ol className="markdown" style={{ marginBottom: 0 }}>
            {q.ordemCorreta.map((id) => <li key={id}>{q.itens.find((x) => x.id === id)!.texto}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}

function Associar({ questao: q, ordemExibicao, resposta, onResponder, revelada }: Props<QuestaoAssociar>) {
  const direitas = ordemExibicao ?? q.pares.map((p) => p.direita);
  const opcoesUnicas = [...new Set(direitas)];
  const pares = resposta?.tipo === 'associar' ? resposta.pares : {};
  const [, forcar] = useState(0);
  return (
    <div className="pilha" style={{ gap: 8 }}>
      {q.pares.map((p) => {
        const valor = pares[p.esquerda] ?? '';
        const cls = revelada ? (valor === p.direita ? 'certo' : 'errado') : '';
        return (
          <div key={p.esquerda} className={`ordenavel ${cls}`} style={{ flexWrap: 'wrap' }}>
            <span className="texto" style={{ minWidth: 140 }}><strong>{p.esquerda}</strong></span>
            <select
              className="input"
              style={{ flex: '1 1 180px', minHeight: 44 }}
              value={valor}
              disabled={revelada}
              aria-label={`Associação para ${p.esquerda}`}
              onChange={(e) => {
                onResponder({ tipo: 'associar', pares: { ...pares, [p.esquerda]: e.target.value } });
                forcar((x) => x + 1);
              }}
            >
              <option value="">Escolha…</option>
              {opcoesUnicas.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {revelada && valor !== p.direita && <span className="pequeno" style={{ width: '100%', color: 'var(--success)' }}>Correto: {p.direita}</span>}
          </div>
        );
      })}
    </div>
  );
}

export function respostaCompleta(q: Questao, r: Resposta | null): boolean {
  if (!r) return false;
  if (q.tipo === 'associar' && r.tipo === 'associar') return q.pares.every((p) => r.pares[p.esquerda]);
  return true;
}
