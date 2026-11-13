import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { obterBackend } from '../data/backend.ts';
import { carregarEscolas } from '../content/index.ts';
import type { Escola } from '../content/schema.ts';
import { semanaAtual, TOP_N_ESCOLA, type PontuacaoAluno, type PontuacaoEscola } from '../core/ranking.ts';
import { Avatar } from '../modules/avatar/Avatar.tsx';
import { item as itemDoAvatar } from '../modules/avatar/catalogo.ts';
import { normalizarAvatar } from '../modules/avatar/regras.ts';
import { Icone } from '../ui/Icone.tsx';

function NomeDaMoldura({ avatar }: { avatar: unknown }) {
  const c = normalizarAvatar(avatar);
  if (!c || c.moldura === 'nenhuma') return null;
  return <span className="so-leitor">, moldura {itemDoAvatar('moldura', c.moldura)?.nome}</span>;
}

type Aba = 'escola' | 'escolas' | 'geral';

export function RankingTela() {
  const perfil = useApp((s) => s.perfil)!;
  const modoBackend = useApp((s) => s.modoBackend);
  const xpSemana = useApp((s) => s.xpSemana);
  const pendentes = useApp((s) => s.pendentesSync);
  const [aba, setAba] = useState<Aba>(perfil.escolaId ? 'escola' : 'escolas');
  const [alunos, setAlunos] = useState<PontuacaoAluno[] | null>(null);
  const [escolasRank, setEscolasRank] = useState<PontuacaoEscola[] | null>(null);
  const [escolas, setEscolas] = useState<Map<string, Escola>>(new Map());
  const [erro, setErro] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const semana = semanaAtual();

  useEffect(() => {
    void carregarEscolas().then((l) => setEscolas(new Map(l.map((e) => [e.id, e]))));
  }, []);

  useEffect(() => {
    let vivo = true;
    setErro(null);
    setAlunos(null);
    setEscolasRank(null);
    void (async () => {
      try {
        const b = await obterBackend();
        const u = await b.usuarioAtual();
        if (!vivo) return;
        setUsuarioId(u?.id ?? null);
        if (b.modo === 'offline') return;
        if (aba === 'escolas') setEscolasRank(await b.rankingEscolas(semana));
        else setAlunos(await b.rankingAlunos(semana, aba === 'escola' ? perfil.escolaId : null));
      } catch {
        if (vivo) setErro('Não foi possível carregar o ranking agora. Verifique a conexão.');
      }
    })();
    return () => {
      vivo = false;
    };
  }, [aba, semana, perfil.escolaId, xpSemana]);

  const minhaEscola = perfil.escolaId ? escolas.get(perfil.escolaId) : undefined;
  const fimSemana = new Date(new Date(semana + 'T03:00:00Z').getTime() + 7 * 86400000 - 1);

  return (
    <div className="pilha">
      <header>
        <h1><Icone nome="ranking" tamanho={28} className="acento" /> Ranking da semana</h1>
        <p className="muted pequeno" style={{ margin: 0 }}>
          Temporada encerra {fimSemana.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })} às 23h59 (Brasília).
        </p>
      </header>

      {modoBackend === 'demo' && (
        <div className="aviso">Modo demonstração: os nomes e pontos dos outros jogadores são fictícios.</div>
      )}
      {modoBackend === 'offline' && (
        <div className="aviso info">
          Esta versão ainda não está ligada ao servidor de ranking. Seus {xpSemana} XP da semana estão guardados no aparelho
          {pendentes > 0 ? ` (${pendentes} sessão(ões) aguardando envio)` : ''} e entram no ranking quando a conta online for ativada.
        </div>
      )}

      <div className="card linha entre">
        <div>
          <span className="muted pequeno">Seus pontos nesta semana</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{xpSemana.toLocaleString('pt-BR')} XP</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="muted pequeno">Jogando por</span>
          <div style={{ fontWeight: 800 }}>{minhaEscola ? minhaEscola.sigla : '—'}</div>
          {!minhaEscola && <Link to="/perfil" className="pequeno">Escolher escola</Link>}
        </div>
      </div>

      <div className="abas" role="tablist">
        <button role="tab" aria-selected={aba === 'escola'} className={aba === 'escola' ? 'ativa' : ''} onClick={() => setAba('escola')} disabled={!perfil.escolaId}>
          Minha escola
        </button>
        <button role="tab" aria-selected={aba === 'escolas'} className={aba === 'escolas' ? 'ativa' : ''} onClick={() => setAba('escolas')}>
          Entre escolas
        </button>
        <button role="tab" aria-selected={aba === 'geral'} className={aba === 'geral' ? 'ativa' : ''} onClick={() => setAba('geral')}>
          Geral
        </button>
      </div>

      {aba === 'escolas' && (
        <p className="muted pequeno" style={{ margin: 0 }}>
          Pontuação da escola = soma dos {TOP_N_ESCOLA} melhores alunos da semana. Cada colega que joga ajuda o time.
        </p>
      )}

      {erro && <div className="aviso">{erro}</div>}
      {modoBackend !== 'offline' && !erro && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabela-rank">
            <tbody>
              {aba === 'escolas' &&
                (escolasRank ?? []).slice(0, 100).map((e, i) => {
                  const esc = escolas.get(e.escolaId);
                  return (
                    <tr key={e.escolaId} className={e.escolaId === perfil.escolaId ? 'eu' : ''}>
                      <td className={`pos p${i + 1}`}>{i + 1}</td>
                      <td>
                        <strong>{esc?.sigla ?? e.escolaId}</strong>
                        <div className="muted pequeno">{esc ? `${esc.cidade}-${esc.uf}` : ''} · {e.membrosAtivos} ativos</div>
                      </td>
                      <td className="pts">{e.pontos.toLocaleString('pt-BR')}</td>
                    </tr>
                  );
                })}
              {aba !== 'escolas' &&
                (alunos ?? []).slice(0, 100).map((a, i) => (
                  <tr key={a.usuarioId} className={a.usuarioId === usuarioId ? 'eu' : ''}>
                    <td className={`pos p${i + 1}`}>{i + 1}</td>
                    <td>
                      <div className="nome-com-avatar">
                        <Avatar config={a.avatar} nome={a.nome} tamanho={32} decorativo />
                        <div style={{ minWidth: 0 }}>
                          <strong>{a.nome}</strong>
                          {/* a moldura informa nível ou conquista: vai também em texto, para leitor de tela */}
                          <NomeDaMoldura avatar={a.avatar} />
                          {aba === 'geral' && a.escolaId && <div className="muted pequeno">{escolas.get(a.escolaId)?.sigla ?? ''}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="pts">{a.xpSemana.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {((aba === 'escolas' && escolasRank === null) || (aba !== 'escolas' && alunos === null)) && (
            <p className="muted centro" style={{ padding: 16 }}>Carregando…</p>
          )}
        </div>
      )}
    </div>
  );
}
