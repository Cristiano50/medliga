import { PLANOS, type PlanoId } from '../core/planos.ts';
import { useApp } from '../data/store.ts';
import { MARCA } from '../config/marca.ts';

const ORDEM: PlanoId[] = ['gratuito', 'premium', 'institucional'];

function preco(v: number | null) {
  if (v === null) return 'Sob consulta';
  if (v === 0) return 'Grátis';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function PlanosTela() {
  const atual = useApp((s) => s.perfil)!.plano;
  return (
    <div className="pilha">
      <header>
        <h1>Planos</h1>
        <p className="muted">Comece grátis. Assine para estudar sem limites, ou leve o MedLiga para a sua escola ou liga acadêmica.</p>
      </header>
      <div className="grade g3">
        {ORDEM.map((id) => {
          const p = PLANOS[id];
          const destaque = id === 'premium';
          return (
            <div key={id} className={`card pilha ${destaque ? 'destaque' : ''}`} style={destaque ? { borderColor: 'var(--accent)' } : undefined}>
              <div className="linha entre">
                <h2 style={{ margin: 0 }}>{p.nome}</h2>
                {id === atual && <span className="selo">Seu plano</span>}
              </div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{preco(p.precoMensalBRL)}</span>
                {p.precoMensalBRL ? <span className="muted"> /mês</span> : null}
                {p.precoAnualBRL ? <div className="muted pequeno">ou {preco(p.precoAnualBRL)} por ano</div> : null}
              </div>
              <ul className="markdown" style={{ margin: 0 }}>
                {p.destaques.map((d) => <li key={d}>{d}</li>)}
              </ul>
              {id === 'premium' && (
                <button className="btn ouro" disabled title="Pagamentos serão ativados no lançamento">
                  Assinar (em breve)
                </button>
              )}
              {id === 'institucional' && (
                MARCA.emailComercial ? (
                  <a className="btn" href={`mailto:${MARCA.emailComercial}?subject=MedLiga%20para%20minha%20escola`}>
                    Falar com a equipe
                  </a>
                ) : (
                  <button className="btn" disabled title="Contato comercial a definir">Falar com a equipe (em breve)</button>
                )
              )}
            </div>
          );
        })}
      </div>
      <p className="muted pequeno">Preços de lançamento em validação. Assinaturas pelas lojas (Google Play / App Store) ou pelo site.</p>
    </div>
  );
}
