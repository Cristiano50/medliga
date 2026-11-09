import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { buscarEscolas, carregarEscolas } from '../content/index.ts';
import type { Escola } from '../content/schema.ts';
import { obterBackend } from '../data/backend.ts';
import { nivelPorXP, tituloDoNivel } from '../core/scoring.ts';
import { PLANOS } from '../core/planos.ts';
import { db } from '../data/db.ts';
import { Barra } from '../ui/comum.tsx';
import { MARCA } from '../config/marca.ts';

export function PerfilTela() {
  const perfil = useApp((s) => s.perfil)!;
  const salvarPerfil = useApp((s) => s.salvarPerfil);
  const xpTotal = useApp((s) => s.xpTotal);
  const sequencia = useApp((s) => s.sequenciaDias);
  const modoBackend = useApp((s) => s.modoBackend);
  const atualizarSync = useApp((s) => s.atualizarSync);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [trocando, setTrocando] = useState(false);
  const [busca, setBusca] = useState('');
  const [stats, setStats] = useState({ respostas: 0, acertos: 0, sessoes: 0 });
  const niv = nivelPorXP(xpTotal);

  useEffect(() => {
    void carregarEscolas().then(setEscolas);
    void (async () => {
      const r = await db.respostas.toArray();
      const s = await db.sessoes.count();
      setStats({ respostas: r.length, acertos: r.filter((x) => x.correta).length, sessoes: s });
    })();
  }, []);
  const resultados = useMemo(() => buscarEscolas(escolas, busca, 20), [escolas, busca]);
  const minha = escolas.find((e) => e.id === perfil.escolaId);

  return (
    <div className="pilha">
      <div className="card destaque pilha">
        <div className="linha">
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--surface-3)', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 800 }}>
            {perfil.nome.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0 }}>{perfil.nome}</h1>
            <span className="muted">{tituloDoNivel(niv.nivel)} · Nível {niv.nivel}</span>
          </div>
        </div>
        <Barra valor={niv.progresso} rotulo="Progresso até o próximo nível" />
        <div className="grade g3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <Stat rotulo="XP total" valor={xpTotal.toLocaleString('pt-BR')} />
          <Stat rotulo="Sequência" valor={`${sequencia} 🔥`} />
          <Stat rotulo="Acertos" valor={stats.respostas ? `${Math.round((stats.acertos / stats.respostas) * 100)}%` : '—'} />
        </div>
      </div>

      <div className="card pilha">
        <div className="linha entre">
          <div>
            <span className="muted pequeno">Escola</span>
            <div><strong>{minha ? `${minha.sigla} — ${minha.nome}` : 'Nenhuma escola escolhida'}</strong></div>
          </div>
          <button className="btn pequeno" onClick={() => setTrocando((x) => !x)}>{trocando ? 'Fechar' : 'Trocar'}</button>
        </div>
        {trocando && (
          <>
            <input className="input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Busque sua escola" aria-label="Buscar escola" />
            <div className="lista-opcoes" style={{ maxHeight: 280, overflowY: 'auto' }}>
              {resultados.map((e) => (
                <button key={e.id} className="opcao" onClick={async () => { await salvarPerfil({ escolaId: e.id }); setTrocando(false); }}>
                  <span className="letra" style={{ width: 'auto', padding: '0 6px' }}>{e.uf}</span>
                  <span><strong>{e.sigla}</strong> — {e.nome} <span className="muted pequeno">({e.cidade})</span></span>
                </button>
              ))}
            </div>
            <p className="muted pequeno" style={{ margin: 0 }}>A troca de escola vale a partir da próxima temporada semanal no ranking online.</p>
          </>
        )}
      </div>

      <ContaOnline modoBackend={modoBackend} onSync={atualizarSync} />

      <AcessoProfessor />

      <div className="card linha entre">
        <div>
          <span className="muted pequeno">Plano</span>
          <div><strong>{PLANOS[perfil.plano].nome}</strong></div>
        </div>
        <Link to="/planos" className="btn pequeno ouro">Ver planos</Link>
      </div>

      <Privacidade />

      <p className="muted pequeno centro">{MARCA.nome} v{MARCA.versao} · ferramenta de estudo; não use para decisões clínicas.</p>
    </div>
  );
}

function Stat({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="centro">
      <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{valor}</div>
      <div className="muted pequeno">{rotulo}</div>
    </div>
  );
}

function ContaOnline({ modoBackend, onSync }: { modoBackend: string; onSync: () => Promise<void> }) {
  const salvarPerfil = useApp((s) => s.salvarPerfil);
  const perfil = useApp((s) => s.perfil)!;
  const [email, setEmail] = useState(perfil.email ?? '');
  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [msg, setMsg] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    void obterBackend().then((b) => b.usuarioAtual()).then((u) => setUsuario(u?.email ?? null));
  }, []);

  if (modoBackend === 'offline')
    return (
      <div className="card">
        <strong>Conta online</strong>
        <p className="muted pequeno" style={{ margin: '4px 0 0' }}>
          Disponível quando o servidor de ranking for ativado. Até lá, tudo funciona offline e fica salvo no aparelho.
        </p>
      </div>
    );

  if (usuario)
    return (
      <div className="card linha entre">
        <div>
          <span className="muted pequeno">Conta online</span>
          <div><strong>{usuario}</strong></div>
        </div>
        <button className="btn pequeno" onClick={() => void onSync()}>Sincronizar</button>
      </div>
    );

  return (
    <div className="card pilha">
      <strong>Entre para aparecer no ranking</strong>
      <p className="muted pequeno" style={{ margin: 0 }}>Enviamos um código de 6 dígitos para o seu e-mail. Use o e-mail institucional para ganhar o selo de aluno verificado.</p>
      {etapa === 'email' ? (
        <div className="linha">
          <input className="input" style={{ flex: 1 }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" aria-label="E-mail" />
          <button
            className="btn primario"
            disabled={!/^\S+@\S+\.\S+$/.test(email)}
            onClick={async () => {
              try {
                const b = await obterBackend();
                await b.enviarCodigo(email);
                setEtapa('codigo');
                setMsg('Código enviado. Confira sua caixa de entrada.');
              } catch (e) {
                setMsg((e as Error).message);
              }
            }}
          >
            Enviar código
          </button>
        </div>
      ) : (
        <div className="linha">
          <input className="input" style={{ flex: 1 }} inputMode="numeric" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} placeholder="000000" aria-label="Código" />
          <button
            className="btn primario"
            disabled={codigo.length !== 6}
            onClick={async () => {
              try {
                const b = await obterBackend();
                const u = await b.confirmarCodigo(email, codigo);
                await salvarPerfil({ usuarioOnlineId: u.id, email: u.email });
                setUsuario(u.email);
                await onSync();
              } catch {
                setMsg('Código inválido ou expirado.');
              }
            }}
          >
            Entrar
          </button>
        </div>
      )}
      {msg && <p className="muted pequeno" style={{ margin: 0 }}>{msg}</p>}
    </div>
  );
}

function Privacidade() {
  const [confirmar, setConfirmar] = useState<null | 'conta' | 'aparelho'>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [temConta, setTemConta] = useState(false);
  useEffect(() => {
    void obterBackend().then((b) => b.usuarioAtual()).then((u) => setTemConta(!!u && u.id !== 'demo-voce'));
  }, []);
  return (
    <div className="card pilha">
      <strong>Privacidade e dados (LGPD)</strong>
      <p className="muted pequeno" style={{ margin: 0 }}>
        Guardamos só apelido, escola, semestre e seu desempenho. Você pode apagar tudo a qualquer momento.
      </p>
      {confirmar === null && (
        <div className="linha quebra">
          {temConta && <button className="btn pequeno" onClick={() => setConfirmar('conta')}>Excluir minha conta online</button>}
          <button className="btn pequeno" onClick={() => setConfirmar('aparelho')}>Apagar dados deste aparelho</button>
        </div>
      )}
      {confirmar && (
        <div className="aviso">
          {confirmar === 'conta'
            ? 'Isto apaga sua conta, perfil, sessões e pontos no servidor (inclusive do ranking). Não dá para desfazer.'
            : 'Isto apaga perfil, progresso, revisão espaçada e pontos guardados neste aparelho. Não dá para desfazer.'}
          <div className="linha" style={{ marginTop: 8 }}>
            <button className="btn pequeno fantasma" onClick={() => setConfirmar(null)}>Cancelar</button>
            <button
              className="btn pequeno"
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              onClick={async () => {
                try {
                  if (confirmar === 'conta') {
                    const b = await obterBackend();
                    await b.excluirConta();
                    setMsg('Conta online excluída.');
                  } else {
                    await db.delete();
                    location.hash = '#/';
                    location.reload();
                  }
                } catch {
                  setMsg('Não foi possível concluir agora. Verifique a conexão e tente de novo.');
                }
                setConfirmar(null);
              }}
            >
              Confirmar exclusão
            </button>
          </div>
        </div>
      )}
      {msg && <p className="muted pequeno" style={{ margin: 0 }}>{msg}</p>}
    </div>
  );
}

function AcessoProfessor() {
  const [eh, setEh] = useState(false);
  useEffect(() => {
    void obterBackend().then((b) => b.escolasProfessor()).then((l) => setEh(l.length > 0));
  }, []);
  if (!eh) return null;
  return (
    <Link to="/painel" className="card linha entre" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div>
        <span className="muted pequeno">Plano institucional</span>
        <div><strong>📊 Painel do professor</strong></div>
      </div>
      <span aria-hidden>›</span>
    </Link>
  );
}
