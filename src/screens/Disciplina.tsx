import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DISCIPLINAS } from '../content/disciplinas.ts';
import { carregarDisciplina, topicosDe } from '../content/index.ts';
import { useProgresso } from '../data/progresso.ts';
import { Barra, SeloRevisao } from '../ui/comum.tsx';

export function DisciplinaTela() {
  const { id = '' } = useParams();
  const d = DISCIPLINAS.find((x) => x.id === id);
  const [topicos, setTopicos] = useState(() => topicosDe(id));
  useEffect(() => {
    void carregarDisciplina(id).then(setTopicos);
  }, [id]);
  const progresso = useProgresso(topicos);
  if (!d || d.status !== 'disponivel') return <Navigate to="/" replace />;
  const total = topicos.reduce((s, t) => s + t.questoes.length, 0);
  const dominioMedio = topicos.length ? [...progresso.values()].reduce((s, p) => s + p.dominio, 0) / topicos.length : 0;

  return (
    <div className="pilha">
      <header>
        <p className="muted pequeno" style={{ margin: 0 }}>{d.jogabilidade}</p>
        <h1>{d.icone} {d.nome}</h1>
        <p className="muted">{d.descricao}</p>
        <Barra valor={dominioMedio} rotulo="Domínio da disciplina" />
        <p className="muted pequeno" style={{ marginTop: 6 }}>
          {topicos.length} tópicos · {total} questões · domínio {Math.round(dominioMedio * 100)}%
        </p>
      </header>

      <div className="grade g2">
        <Link to="/lab3d" className="btn primario">🧫 Laboratório 3D</Link>
        <Link to="/jogar/quiz?modo=plantao" className="btn ouro">⚡ Plantão relâmpago</Link>
      </div>

      <section className="pilha">
        <h2>Trilha</h2>
        {topicos.length === 0 && <div className="aviso">Conteúdo em preparação.</div>}
        {topicos.map((t) => {
          const p = progresso.get(t.id);
          const feito = (p?.dominio ?? 0) >= 0.6;
          return (
            <Link key={t.id} to={`/topico/${t.id}`} className="card topico-item">
              <span className={`num ${feito ? 'feito' : ''}`}>{feito ? '✓' : String(t.ordem).padStart(2, '0')}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong>{t.titulo}</strong>
                {t.subtitulo && <span className="muted pequeno"> — {t.subtitulo}</span>}
                <div className="linha quebra" style={{ margin: '6px 0' }}>
                  <span className="muted pequeno">{t.questoes.length} questões</span>
                  <SeloRevisao revisao={t.revisao} />
                </div>
                <Barra valor={p?.dominio ?? 0} rotulo={`Domínio de ${t.titulo}`} />
              </span>
              <span aria-hidden>›</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
