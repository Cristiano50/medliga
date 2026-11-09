import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { DISCIPLINAS, disciplina as buscarDisciplina } from '../content/disciplinas.ts';
import { topicosDe } from '../content/index.ts';
import { useProgresso } from '../data/progresso.ts';
import { Barra } from '../ui/comum.tsx';
import { nivelPorXP, tituloDoNivel } from '../core/scoring.ts';
import { PLANOS } from '../core/planos.ts';

const META_DIARIA_XP = 60;

export function Inicio() {
  const perfil = useApp((s) => s.perfil)!;
  const salvarPerfil = useApp((s) => s.salvarPerfil);
  const xpHoje = useApp((s) => s.xpHoje);
  const xpTotal = useApp((s) => s.xpTotal);
  const xpSemana = useApp((s) => s.xpSemana);
  const uso = useApp((s) => s.uso);
  const discId = perfil.disciplinaAtual ?? 'embriologia';
  const disc = buscarDisciplina(discId) ?? DISCIPLINAS[0];
  const topicos = useMemo(() => topicosDe(disc.id), [disc.id]);
  const progresso = useProgresso(topicos);
  const niv = nivelPorXP(xpTotal);
  const proximo = topicos.find((t) => (progresso.get(t.id)?.dominio ?? 0) < 0.6) ?? topicos[0];
  const vencidas = [...progresso.values()].reduce((s, p) => s + p.vencidas, 0);
  const plano = PLANOS[perfil.plano];
  const plantoesRestantes = Number.isFinite(plano.plantoesRanqueadosPorDia) ? Math.max(0, plano.plantoesRanqueadosPorDia - uso.plantoesRanqueados) : null;
  const disponiveis = DISCIPLINAS.filter((d) => d.status === 'disponivel');

  return (
    <div className="pilha">
      <section className="card destaque">
        <div className="linha entre quebra">
          <div>
            <p className="muted pequeno" style={{ margin: 0 }}>Olá, {perfil.nome.split(' ')[0]} · {tituloDoNivel(niv.nivel)}</p>
            <h1 style={{ margin: '4px 0 8px' }}>Meta do dia</h1>
          </div>
          <span className="chip-xp">{Math.min(xpHoje, META_DIARIA_XP)} / {META_DIARIA_XP} XP</span>
        </div>
        <Barra valor={xpHoje / META_DIARIA_XP} rotulo="Meta diária de XP" />
        <p className="muted pequeno" style={{ marginTop: 8, marginBottom: 0 }}>
          Nível {niv.nivel}: faltam {niv.proximo - xpTotal} XP para o próximo · {xpSemana} XP nesta semana
        </p>
      </section>

      {disponiveis.length > 1 && (
        <div className="abas" role="tablist" aria-label="Disciplina em foco">
          {disponiveis.map((d) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={d.id === disc.id}
              className={d.id === disc.id ? 'ativa' : ''}
              onClick={() => void salvarPerfil({ disciplinaAtual: d.id })}
            >
              {d.icone} {d.nome}
            </button>
          ))}
        </div>
      )}

      {proximo && (
        <Link to={`/topico/${proximo.id}`} className="card topico-item" style={{ borderColor: '#1f4d5a' }}>
          <span className="num">{String(proximo.ordem).padStart(2, '0')}</span>
          <span style={{ flex: 1 }}>
            <span className="muted pequeno">Continuar estudando · {disc.nome}</span>
            <br />
            <strong>{proximo.titulo}</strong>
            <Barra valor={progresso.get(proximo.id)?.dominio ?? 0} rotulo="Domínio do tópico" />
          </span>
          <span aria-hidden>›</span>
        </Link>
      )}
      {!proximo && <div className="aviso info">O conteúdo de {disc.nome} está sendo preparado.</div>}

      <section>
        <h2>Jogar agora</h2>
        <div className="grade g2">
          <Link to={`/jogar/quiz?modo=plantao&disciplina=${disc.id}`} className="card disc-card" style={{ ['--cor' as string]: 'var(--accent)' }}>
            <span className="icone" aria-hidden>⚡</span>
            <strong>Plantão relâmpago</strong>
            <span className="muted pequeno">90 segundos de questões rápidas de {disc.nome.toLowerCase()}. Vale pontos para o ranking da sua escola.</span>
            {plantoesRestantes !== null && <span className="selo">{plantoesRestantes} plantão(ões) hoje no plano gratuito</span>}
          </Link>
          {(disc.jogos ?? []).map((j) => (
            <Link key={j.rota} to={j.rota} className="card disc-card" style={{ ['--cor' as string]: j.cor }}>
              <span className="icone" aria-hidden>{j.icone}</span>
              <strong>{j.nome}</strong>
              <span className="muted pequeno">{j.descricao}</span>
            </Link>
          ))}
          <Link to="/duelos" className="card disc-card" style={{ ['--cor' as string]: 'var(--danger)' }}>
            <span className="icone" aria-hidden>⚔️</span>
            <strong>Duelo</strong>
            <span className="muted pequeno">Desafie um colega com um código: mesmas 10 questões, vence quem acertar mais.</span>
          </Link>
          {vencidas > 0 && (
            <Link to={`/jogar/quiz?modo=revisao&disciplina=${disc.id}`} className="card disc-card" style={{ ['--cor' as string]: 'var(--success)' }}>
              <span className="icone" aria-hidden>🔁</span>
              <strong>Revisão do dia</strong>
              <span className="muted pequeno">{vencidas} questão(ões) de {disc.nome.toLowerCase()} para revisar hoje (revisão espaçada).</span>
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2>Disciplinas</h2>
        <div className="grade g3">
          {DISCIPLINAS.map((d) =>
            d.status === 'disponivel' ? (
              <Link key={d.id} to={`/disciplina/${d.id}`} className="card disc-card" style={{ ['--cor' as string]: d.cor }}>
                <span className="icone" aria-hidden>{d.icone}</span>
                <strong>{d.nome}</strong>
                <span className="muted pequeno">{d.jogabilidade}</span>
              </Link>
            ) : (
              <div key={d.id} className="card disc-card bloqueado" style={{ ['--cor' as string]: d.cor }} aria-disabled>
                <span className="icone" aria-hidden>{d.icone}</span>
                <strong>{d.nome}</strong>
                <span className="muted pequeno">{d.jogabilidade}</span>
                <span className="selo breve">Em breve</span>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
