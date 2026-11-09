import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ESTAGIOS, LAMINAS, topico } from '../content/index.ts';
import { disciplina } from '../content/disciplinas.ts';
import { useProgresso } from '../data/progresso.ts';
import { Barra, Markdown, SeloRevisao } from '../ui/comum.tsx';

type Aba = 'estudo' | 'estruturas' | 'clinica' | 'fontes';

export function TopicoTela() {
  const { id = '' } = useParams();
  const t = topico(id);
  const [aba, setAba] = useState<Aba>('estudo');
  const progresso = useProgresso(t ? [t] : []);
  if (!t) return <Navigate to="/" replace />;
  const p = progresso.get(t.id);
  const estagios = ESTAGIOS.filter((e) => e.topicos.includes(t.id));
  const laminas = LAMINAS.filter((l) => l.topicos.includes(t.id));

  return (
    <div className="pilha">
      <header>
        <Link to={`/disciplina/${t.disciplina}`} className="muted pequeno">‹ {disciplina(t.disciplina)?.nome ?? 'Voltar'}</Link>
        <h1 style={{ marginTop: 6 }}>{t.titulo}</h1>
        {t.subtitulo && <p className="muted">{t.subtitulo}</p>}
        <div className="linha quebra">
          <SeloRevisao revisao={t.revisao} />
          {t.periodo?.carnegie && t.periodo.carnegie.length > 0 && (
            <span className="selo">Carnegie {t.periodo.carnegie.join(', ')}</span>
          )}
        </div>
      </header>

      <div className="card pilha">
        <div className="linha entre">
          <strong>Seu domínio</strong>
          <span className="muted pequeno">{p?.vistas ?? 0}/{t.questoes.length} questões vistas</span>
        </div>
        <Barra valor={p?.dominio ?? 0} />
        <div className="grade g2">
          <Link to={`/jogar/quiz?modo=estudo&topico=${t.id}`} className="btn primario">Praticar questões</Link>
          {estagios.length > 0 && (
            <Link to={`/lab3d?estagio=${estagios[0].id}`} className="btn">Ver no laboratório 3D</Link>
          )}
          {laminas.length > 0 && (
            <Link to={`/microscopio?lamina=${laminas[0].id}`} className="btn">Ver no microscópio</Link>
          )}
          {t.eventos.length >= 4 && (
            <Link to={`/jogar/linha-do-tempo?topico=${t.id}`} className="btn">Linha do tempo</Link>
          )}
        </div>
      </div>

      <div className="abas" role="tablist">
        {(
          [
            ['estudo', 'Resumo'],
            ['estruturas', `Estruturas (${t.estruturas.length})`],
            ['clinica', `Clínica (${t.correlacoesClinicas.length})`],
            ['fontes', 'Fontes'],
          ] as [Aba, string][]
        ).map(([k, r]) => (
          <button key={k} role="tab" aria-selected={aba === k} className={aba === k ? 'ativa' : ''} onClick={() => setAba(k)}>
            {r}
          </button>
        ))}
      </div>

      {aba === 'estudo' && (
        <div className="pilha">
          {t.objetivos.length > 0 && (
            <div className="card">
              <h3>Objetivos</h3>
              <ul className="markdown">{t.objetivos.map((o, i) => <li key={i}>{o}</li>)}</ul>
            </div>
          )}
          <div className="card"><Markdown texto={t.resumo} /></div>
          <div className="card">
            <h3>Pontos-chave</h3>
            <ul className="markdown">{t.pontosChave.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </div>
        </div>
      )}

      {aba === 'estruturas' && (
        <div className="pilha">
          {t.estruturas.map((e) => (
            <div key={e.id} className="card">
              <strong>{e.nome}</strong>
              {e.sinonimos.length > 0 && <span className="muted pequeno"> ({e.sinonimos.join(', ')})</span>}
              <p className="muted" style={{ marginTop: 6 }}>{e.definicao}</p>
              {e.origem && <p className="pequeno"><strong>Origem:</strong> <span className="muted">{e.origem}</span></p>}
              {e.destino && <p className="pequeno" style={{ marginBottom: 0 }}><strong>Destino:</strong> <span className="muted">{e.destino}</span></p>}
            </div>
          ))}
        </div>
      )}

      {aba === 'clinica' && (
        <div className="pilha">
          {t.correlacoesClinicas.map((c) => (
            <div key={c.id} className="card">
              <strong>{c.titulo}</strong>
              <p className="muted" style={{ marginTop: 6 }}>{c.descricao}</p>
              {c.mecanismo && <p className="pequeno" style={{ marginBottom: 0 }}><strong>Base embriológica:</strong> <span className="muted">{c.mecanismo}</span></p>}
            </div>
          ))}
        </div>
      )}

      {aba === 'fontes' && (
        <div className="card pilha">
          <ul className="markdown">
            {t.referencias.map((r, i) => (
              <li key={i}>{r.obra}{r.capitulo ? ` — cap. ${r.capitulo}` : ''}</li>
            ))}
          </ul>
          {t.notasDivergencia.length > 0 && (
            <>
              <h3>Onde as fontes divergem</h3>
              <ul className="markdown">{t.notasDivergencia.map((n, i) => <li key={i}>{n}</li>)}</ul>
            </>
          )}
          <h3>Revisão</h3>
          <ul className="markdown">
            {t.revisao.agentes.length === 0 && <li>Aguardando revisão dos agentes especialistas.</li>}
            {t.revisao.agentes.map((a, i) => (
              <li key={i}>{a.area}: {a.veredito.replace(/-/g, ' ')} ({a.data})</li>
            ))}
            <li>{t.revisao.humano ? `Conferido por ${t.revisao.humano.conferidoPor} em ${t.revisao.humano.conferidoEm}` : 'Conferência médica: pendente'}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
