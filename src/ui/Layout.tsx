import { NavLink, Outlet, Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { nivelPorXP } from '../core/scoring.ts';

export function Layout({ semNav = false }: { semNav?: boolean }) {
  const xpTotal = useApp((s) => s.xpTotal);
  const sequencia = useApp((s) => s.sequenciaDias);
  const { nivel } = nivelPorXP(xpTotal);
  return (
    <div className={`app ${semNav ? 'sem-nav' : ''}`}>
      <header className="topbar">
        <Link to="/" className="marca" aria-label="MedLiga — início">
          <img src="./icons/icon.svg" alt="" />
          MedLiga
        </Link>
        <span className="espaco" />
        <span className="chip-xp fogo" title="Dias seguidos estudando" aria-label={`${sequencia} dias seguidos`}>
          🔥 {sequencia}
        </span>
        <span className="chip-xp" title="Nível e XP total" aria-label={`Nível ${nivel}, ${xpTotal} XP`}>
          Nv {nivel} · {xpTotal.toLocaleString('pt-BR')} XP
        </span>
      </header>
      <main className={`conteudo ${semNav ? '' : ''}`}>
        <Outlet />
      </main>
      {!semNav && (
        <nav className="navbar" aria-label="Navegação principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico" aria-hidden>🏠</span>Início
          </NavLink>
          <NavLink to="/disciplina/embriologia" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico" aria-hidden>📚</span>Estudar
          </NavLink>
          <NavLink to="/ranking" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico" aria-hidden>🏆</span>Ranking
          </NavLink>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico" aria-hidden>👤</span>Perfil
          </NavLink>
        </nav>
      )}
    </div>
  );
}
