import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { DISCIPLINAS, disciplina as buscarDisciplina } from '../content/disciplinas.ts';
import { topicosDe } from '../content/index.ts';
import { useProgresso } from '../data/progresso.ts';
import { Barra } from '../ui/comum.tsx';
import { nivelPorXP, tituloDoNivel } from '../core/scoring.ts';
import { SeloNivel } from '../ui/Insignias.tsx';
import { PLANOS } from '../core/planos.ts';
import { Avatar } from '../modules/avatar/Avatar.tsx';
import { Icone } from '../ui/Icone.tsx';
import { CartaoEmBreve, CartaoJogo } from '../ui/cartoes.tsx';

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
          <div className="nome-com-avatar">
            <Link to="/perfil/avatar" className="avatar-link" aria-label={perfil.avatar ? 'Editar avatar' : 'Montar avatar'}>
              <Avatar config={perfil.avatar} nome={perfil.nome} tamanho={48} decorativo />
            </Link>
            <div>
              <p className="muted pequeno" style={{ margin: 0 }}>Olá, {perfil.nome.split(' ')[0]} · <SeloNivel nivel={niv.nivel} tamanho={18} /> {tituloDoNivel(niv.nivel)}</p>
              <h1 style={{ margin: '4px 0 8px' }}>Meta do dia</h1>
            </div>
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
              <Icone nome={d.icone} tamanho={18} /> {d.nome}
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
          <Icone nome="seta-direita" tamanho={18} />
        </Link>
      )}
      {!proximo && <div className="aviso info">O conteúdo de {disc.nome} está sendo preparado.</div>}

      <section>
        <h2>Jogar agora</h2>
        <div className="pilha" style={{ gap: 10 }}>
          <CartaoJogo
            destaque
            to={`/jogar/quiz?modo=plantao&disciplina=${disc.id}`}
            icone="raio"
            cor="var(--accent)"
            nome="Plantão relâmpago"
            descricao={`90 segundos de questões rápidas de ${disc.nome.toLowerCase()}. Vale pontos para o ranking da sua escola.`}
          >
            {plantoesRestantes !== null && <span className="selo">{plantoesRestantes} plantão(ões) hoje no plano gratuito</span>}
          </CartaoJogo>
          <div className="grade g2 jogos">
            {vencidas > 0 && (
              <CartaoJogo
                to={`/jogar/quiz?modo=revisao&disciplina=${disc.id}`}
                icone="revisao"
                cor="var(--success)"
                nome="Revisão do dia"
                descricao={`${vencidas} questão(ões) de ${disc.nome.toLowerCase()} para revisar hoje (revisão espaçada).`}
              />
            )}
            {(disc.jogos ?? []).map((j) => (
              <CartaoJogo key={j.rota} to={j.rota} icone={j.icone} cor={j.cor} nome={j.nome} descricao={j.descricao} />
            ))}
            <CartaoJogo to="/duelos" icone="duelo" cor="var(--danger)" nome="Duelo" descricao="Desafie um colega com um código: mesmas 10 questões, vence quem acertar mais." />
          </div>
        </div>
      </section>

      <section>
        <h2>Disciplinas</h2>
        <div className="grade g2 jogos">
          {disponiveis.map((d) => (
            <CartaoJogo key={d.id} to={`/disciplina/${d.id}`} icone={d.icone} cor={d.cor} nome={d.nome} descricao={d.jogabilidade}>
              {d.id === disc.id && <span className="selo foco">Em foco</span>}
            </CartaoJogo>
          ))}
        </div>
        {DISCIPLINAS.some((d) => d.status !== 'disponivel') && (
          <>
            <h3 className="subtitulo">Em breve</h3>
            <div className="grade breve">
              {DISCIPLINAS.filter((d) => d.status !== 'disponivel').map((d) => (
                <CartaoEmBreve key={d.id} icone={d.icone} cor={d.cor} nome={d.nome} descricao={d.jogabilidade} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
