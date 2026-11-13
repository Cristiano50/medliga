import { NavLink, Outlet, Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { nivelPorXP } from '../core/scoring.ts';
import { armazenamentoTemporario } from '../data/armazenamento.ts';
import { Avatar } from '../modules/avatar/Avatar.tsx';
import { itensNovos } from '../modules/avatar/regras.ts';
import { useProgressoAvatar } from '../modules/avatar/useProgressoAvatar.ts';
import { Icone } from './Icone.tsx';

/** Ícone do item Perfil: o avatar do jogador (se já montou) e a marca de item novo liberado. */
function IconePerfil() {
  const avatar = useApp((s) => s.perfil?.avatar);
  const vistos = useApp((s) => s.perfil?.avatarItensVistos);
  const progresso = useProgressoAvatar();
  const novos = progresso ? itensNovos(progresso, vistos).length : 0;
  return (
    <span className="ico">
      {avatar ? <Avatar config={avatar} tamanho={24} decorativo /> : <Icone nome="perfil" tamanho={22} />}
      {novos > 0 && <span className="ponto-novo" role="img" aria-label="itens novos para o avatar" />}
    </span>
  );
}

export function Layout({ semNav = false }: { semNav?: boolean }) {
  const xpTotal = useApp((s) => s.xpTotal);
  const sequencia = useApp((s) => s.sequenciaDias);
  const disciplinaAtual = useApp((s) => s.perfil?.disciplinaAtual ?? 'embriologia');
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
          <Icone nome="fogo" tamanho={16} /> {sequencia}
        </span>
        <span className="chip-xp" title="Nível e XP total" aria-label={`Nível ${nivel}, ${xpTotal} XP`}>
          Nv {nivel} · {xpTotal.toLocaleString('pt-BR')} XP
        </span>
      </header>
      <main className="conteudo">
        {armazenamentoTemporario && (
          <div className="aviso" style={{ marginBottom: 12 }}>
            Este navegador bloqueou o armazenamento local: dá para jogar, mas o progresso some ao fechar a página.
          </div>
        )}
        <Outlet />
      </main>
      {!semNav && (
        <nav className="navbar" aria-label="Navegação principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico"><Icone nome="inicio" tamanho={22} /></span>Início
          </NavLink>
          <NavLink to={`/disciplina/${disciplinaAtual}`} className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico"><Icone nome="estudar" tamanho={22} /></span>Estudar
          </NavLink>
          <NavLink to="/ranking" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <span className="ico"><Icone nome="ranking" tamanho={22} /></span>Ranking
          </NavLink>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <IconePerfil />Perfil
          </NavLink>
        </nav>
      )}
    </div>
  );
}
