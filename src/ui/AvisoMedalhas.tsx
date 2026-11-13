// Aviso de medalha nova: aparece quando uma conquista é obtida com o app aberto (em geral, ao fim de uma sessão).
import { Link } from 'react-router-dom';
import { CONQUISTAS } from '../core/conquistas.ts';
import { useApp } from '../data/store.ts';
import { useProgressoAvatar } from '../modules/avatar/useProgressoAvatar.ts';
import { Icone } from './Icone.tsx';
import { Medalha } from './Insignias.tsx';

export function AvisoMedalhas() {
  // Mantém a conferência das conquistas ligada em todas as telas, inclusive nas de jogo (sem a barra de navegação).
  useProgressoAvatar();
  const ids = useApp((s) => s.medalhasNovas);
  const dispensar = useApp((s) => s.dispensarMedalhas);
  const novas = ids.map((id) => CONQUISTAS.find((c) => c.id === id)).filter((c) => c !== undefined);
  if (!novas.length) return null;
  return (
    <div className="aviso-medalha" role="status">
      <div className="medalhas">
        {novas.map((c) => (
          <Medalha key={c.id} id={c.id} icone={c.icone} nome={c.nome} obtida progresso={1} tamanho={48} />
        ))}
      </div>
      <div className="texto">
        <strong>{novas.length === 1 ? 'Nova medalha' : `${novas.length} novas medalhas`}</strong>
        <span>{novas.map((c) => c.nome).join(' · ')}</span>
        <Link to="/perfil" className="pequeno" onClick={dispensar}>Ver no perfil</Link>
      </div>
      <button className="btn fantasma pequeno" onClick={dispensar} aria-label="Fechar o aviso de medalha nova">
        <Icone nome="fechar" tamanho={16} />
      </button>
    </div>
  );
}
