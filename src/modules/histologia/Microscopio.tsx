// Microscópio virtual: escolha a lâmina, troque a objetiva, percorra e toque nas estruturas.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LAMINAS, topico } from '../../content/index.ts';
import { SeloRevisao } from '../../ui/comum.tsx';
import { Visor } from './Visor.tsx';
import { Icone } from '../../ui/Icone.tsx';

export default function MicroscopioTela() {
  const [params, setParams] = useSearchParams();
  const lamina = LAMINAS.find((l) => l.id === params.get('lamina')) ?? LAMINAS[0];
  const indice = LAMINAS.indexOf(lamina);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  useEffect(() => setSelecionado(null), [lamina.id]);

  function irPara(i: number) {
    const n = Math.max(0, Math.min(LAMINAS.length - 1, i));
    setParams({ lamina: LAMINAS[n].id }, { replace: true });
  }

  const estrutura = selecionado ? lamina.estruturas.find((e) => e.id === selecionado) : null;
  const t = topico(lamina.topicos[0] ?? '');

  return (
    <div className="pilha">
      <div className="linha entre quebra">
        <div>
          <Link to="/disciplina/histologia" className="muted pequeno"><Icone nome="seta-esquerda" tamanho={14} /> Histologia</Link>
          <h1 style={{ margin: '4px 0 0' }}>Microscópio virtual</h1>
        </div>
        <SeloRevisao revisao={lamina.revisao} />
      </div>

      <div className="card pilha" style={{ gap: 8 }}>
        <div className="linha entre">
          <button className="btn pequeno" onClick={() => irPara(indice - 1)} disabled={indice === 0} aria-label="Lâmina anterior"><Icone nome="anterior" tamanho={16} /></button>
          <div className="centro" style={{ flex: 1, minWidth: 0 }}>
            <strong>{lamina.titulo}</strong>
            <div className="muted pequeno">{lamina.orgao} · {lamina.coloracao}</div>
          </div>
          <button className="btn pequeno" onClick={() => irPara(indice + 1)} disabled={indice === LAMINAS.length - 1} aria-label="Próxima lâmina"><Icone nome="proximo" tamanho={16} /></button>
        </div>
        <select className="input" value={lamina.id} onChange={(e) => setParams({ lamina: e.target.value }, { replace: true })} aria-label="Escolher lâmina">
          {LAMINAS.map((l) => (
            <option key={l.id} value={l.id}>{l.ordem}. {l.titulo} — {l.tecido}</option>
          ))}
        </select>
      </div>

      <Visor laminaId={lamina.id} selecionado={selecionado} onEscolher={(id) => setSelecionado((s) => (s === id ? null : id))} />
      <p className="muted pequeno centro" style={{ margin: 0 }}>Arraste para percorrer · troque a objetiva para aproximar · toque numa estrutura</p>

      <div className="linha quebra" role="group" aria-label="Estruturas desta lâmina" style={{ gap: 6 }}>
        {lamina.estruturas.map((e) => (
          <button
            key={e.id}
            className={`selo ${selecionado === e.id ? 'ia' : ''}`}
            style={{ cursor: 'pointer', minHeight: 32, fontSize: '0.8rem' }}
            aria-pressed={selecionado === e.id}
            onClick={() => setSelecionado((x) => (x === e.id ? null : e.id))}
          >
            {e.nome}
          </button>
        ))}
      </div>

      {estrutura ? (
        <div className="card pilha" role="status" aria-live="polite">
          <div className="linha entre">
            <h2 style={{ margin: 0 }}>{estrutura.nome}</h2>
            <button className="btn pequeno fantasma" onClick={() => setSelecionado(null)} aria-label="Fechar"><Icone nome="fechar" tamanho={16} /></button>
          </div>
          <p className="muted" style={{ margin: 0 }}>{estrutura.descricao}</p>
        </div>
      ) : (
        <div className="card pilha">
          <span className="selo" style={{ alignSelf: 'flex-start' }}>{lamina.tecido}</span>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{lamina.descricao}</p>
          <ul className="markdown" style={{ margin: 0 }}>
            {lamina.destaques.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          <p className="muted pequeno" style={{ margin: 0 }}>Esquema didático com aspecto de {lamina.coloracao}, desenhado para o jogo; não é fotografia de lâmina real.</p>
        </div>
      )}

      <div className="grade g2">
        <Link to={`/jogar/identifique-lamina?lamina=${lamina.id}`} className="btn primario"><Icone nome="alvo" /> Desafio: identifique nesta lâmina</Link>
        {t && <Link to={`/topico/${t.id}`} className="btn"><Icone nome="livro" /> Estudar: {t.titulo}</Link>}
      </div>
    </div>
  );
}
