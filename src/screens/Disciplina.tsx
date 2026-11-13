import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DISCIPLINAS } from '../content/disciplinas.ts';
import { carregarDisciplina, topicosDe } from '../content/index.ts';
import { useProgresso } from '../data/progresso.ts';
import { useApp } from '../data/store.ts';
import { contarAvancadas } from '../core/session.ts';
import { Barra, SeloRevisao } from '../ui/comum.tsx';
import { Icone } from '../ui/Icone.tsx';

export function DisciplinaTela() {
  const { id = '' } = useParams();
  const d = DISCIPLINAS.find((x) => x.id === id);
  const [topicos, setTopicos] = useState(() => topicosDe(id));
  useEffect(() => {
    void carregarDisciplina(id).then(setTopicos);
  }, [id]);
  const progresso = useProgresso(topicos);
  const perfil = useApp((s) => s.perfil);
  const salvarPerfil = useApp((s) => s.salvarPerfil);
  useEffect(() => {
    if (d?.status === 'disponivel' && perfil && perfil.disciplinaAtual !== id) void salvarPerfil({ disciplinaAtual: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (!d || d.status !== 'disponivel') return <Navigate to="/" replace />;
  const total = topicos.reduce((s, t) => s + t.questoes.length, 0);
  const avancadas = contarAvancadas(topicos);
  const dominioMedio = topicos.length ? [...progresso.values()].reduce((s, p) => s + p.dominio, 0) / topicos.length : 0;

  return (
    <div className="pilha">
      <header>
        <p className="muted pequeno" style={{ margin: 0 }}>{d.jogabilidade}</p>
        <h1><Icone nome={d.icone} tamanho={28} /> {d.nome}</h1>
        <p className="muted">{d.descricao}</p>
        <Barra valor={dominioMedio} rotulo="Domínio da disciplina" />
        <p className="muted pequeno" style={{ marginTop: 6 }}>
          {topicos.length} tópicos · {total} questões · domínio {Math.round(dominioMedio * 100)}%
        </p>
      </header>

      <div className="grade g2">
        {d.jogos?.[0] && <Link to={d.jogos[0].rota} className="btn primario"><Icone nome={d.jogos[0].icone} /> {d.jogos[0].nome}</Link>}
        <Link to={`/jogar/quiz?modo=plantao&disciplina=${d.id}`} className="btn ouro"><Icone nome="raio" /> Plantão relâmpago</Link>
        {avancadas >= 10 && (
          <Link to={`/jogar/quiz?modo=estudo&disciplina=${d.id}&nivel=avancado`} className="btn"><Icone nome="fogo" /> Desafio avançado · {avancadas} questões difíceis</Link>
        )}
      </div>

      {(d.jogos?.length ?? 0) > 1 && (
        <section className="pilha">
          <h2>Jogos de {d.nome.toLowerCase()}</h2>
          <div className="grade g2">
            {d.jogos!.map((j) => (
              <Link key={j.rota} to={j.rota} className="card disc-card" style={{ ['--cor' as string]: j.cor }}>
                <span className="icone" style={{ color: j.cor }}><Icone nome={j.icone} tamanho={32} /></span>
                <strong>{j.nome}</strong>
                <span className="muted pequeno">{j.descricao}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="pilha">
        <h2>Trilha</h2>
        {topicos.length === 0 && <div className="aviso">Conteúdo em preparação.</div>}
        {topicos.map((t) => {
          const p = progresso.get(t.id);
          const feito = (p?.dominio ?? 0) >= 0.6;
          return (
            <Link key={t.id} to={`/topico/${t.id}`} className="card topico-item">
              <span className={`num ${feito ? 'feito' : ''}`}>{feito ? <Icone nome="visto" tamanho={18} rotulo="Tópico dominado" /> : String(t.ordem).padStart(2, '0')}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong>{t.titulo}</strong>
                {t.subtitulo && <span className="muted pequeno"> — {t.subtitulo}</span>}
                <div className="linha quebra" style={{ margin: '6px 0' }}>
                  <span className="muted pequeno">{t.questoes.length} questões</span>
                  <SeloRevisao revisao={t.revisao} />
                </div>
                <Barra valor={p?.dominio ?? 0} rotulo={`Domínio de ${t.titulo}`} />
              </span>
              <Icone nome="seta-direita" tamanho={18} />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
