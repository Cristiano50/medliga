import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { DISCIPLINAS } from '../content/disciplinas.ts';
import { topicosDe } from '../content/index.ts';
import { useProgresso } from '../data/progresso.ts';
import { Barra } from '../ui/comum.tsx';
import { nivelPorXP, tituloDoNivel } from '../core/scoring.ts';
import { PLANOS } from '../core/planos.ts';

const META_DIARIA_XP = 60;

export function Inicio() {
  const perfil = useApp((s) => s.perfil)!;
  const xpHoje = useApp((s) => s.xpHoje);
  const xpTotal = useApp((s) => s.xpTotal);
  const xpSemana = useApp((s) => s.xpSemana);
  const uso = useApp((s) => s.uso);
  const TOPICOS_EMB = useMemo(() => topicosDe('embriologia'), []);
  const progresso = useProgresso(TOPICOS_EMB);
  const niv = nivelPorXP(xpTotal);
  const proximo = TOPICOS_EMB.find((t) => (progresso.get(t.id)?.dominio ?? 0) < 0.6) ?? TOPICOS_EMB[0];
  const vencidas = [...progresso.values()].reduce((s, p) => s + p.vencidas, 0);
  const plano = PLANOS[perfil.plano];
  const plantoesRestantes = Number.isFinite(plano.plantoesRanqueadosPorDia) ? Math.max(0, plano.plantoesRanqueadosPorDia - uso.plantoesRanqueados) : null;

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

      {proximo && (
        <Link to={`/topico/${proximo.id}`} className="card topico-item" style={{ borderColor: '#1f4d5a' }}>
          <span className="num">{String(proximo.ordem).padStart(2, '0')}</span>
          <span style={{ flex: 1 }}>
            <span className="muted pequeno">Continuar estudando · Embriologia</span>
            <br />
            <strong>{proximo.titulo}</strong>
            <Barra valor={progresso.get(proximo.id)?.dominio ?? 0} rotulo="Domínio do tópico" />
          </span>
          <span aria-hidden>›</span>
        </Link>
      )}

      <section>
        <h2>Jogar agora</h2>
        <div className="grade g2">
          <Link to="/jogar/quiz?modo=plantao" className="card disc-card" style={{ ['--cor' as string]: 'var(--accent)' }}>
            <span className="icone" aria-hidden>⚡</span>
            <strong>Plantão relâmpago</strong>
            <span className="muted pequeno">90 segundos, questões rápidas. Vale pontos para o ranking da sua escola.</span>
            {plantoesRestantes !== null && <span className="selo">{plantoesRestantes} plantão(ões) hoje no plano gratuito</span>}
          </Link>
          <Link to="/lab3d" className="card disc-card" style={{ ['--cor' as string]: 'var(--primary)' }}>
            <span className="icone" aria-hidden>🧫</span>
            <strong>Laboratório 3D</strong>
            <span className="muted pequeno">Do zigoto à 8ª semana: gire, aproxime e toque nas estruturas.</span>
          </Link>
          <Link to="/jogar/identifique" className="card disc-card" style={{ ['--cor' as string]: 'var(--info)' }}>
            <span className="icone" aria-hidden>🎯</span>
            <strong>Identifique</strong>
            <span className="muted pequeno">Encontre a estrutura pedida no modelo 3D antes de perder as vidas.</span>
          </Link>
          <Link to="/jogar/linha-do-tempo" className="card disc-card" style={{ ['--cor' as string]: 'var(--crista)' }}>
            <span className="icone" aria-hidden>⏳</span>
            <strong>Linha do tempo</strong>
            <span className="muted pequeno">Coloque os eventos do desenvolvimento na ordem certa.</span>
          </Link>
          <Link to="/jogar/camadas" className="card disc-card" style={{ ['--cor' as string]: 'var(--meso)' }}>
            <span className="icone" aria-hidden>🧩</span>
            <strong>Camadas germinativas</strong>
            <span className="muted pequeno">De onde vem cada tecido? Ectoderma, mesoderma, endoderma ou crista neural.</span>
          </Link>
          {vencidas > 0 && (
            <Link to="/jogar/quiz?modo=revisao" className="card disc-card" style={{ ['--cor' as string]: 'var(--success)' }}>
              <span className="icone" aria-hidden>🔁</span>
              <strong>Revisão do dia</strong>
              <span className="muted pequeno">{vencidas} questão(ões) para revisar hoje (revisão espaçada).</span>
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
