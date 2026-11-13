// Duelos: crie um desafio de 10 questões e mande o código para um colega, ou entre num desafio recebido.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { topicosDe } from '../content/index.ts';
import { montarSessao } from '../core/session.ts';
import { obterBackend } from '../data/backend.ts';
import { useApp } from '../data/store.ts';
import { DISCIPLINAS } from '../content/disciplinas.ts';
import { Icone } from '../ui/Icone.tsx';

const QUESTOES_POR_DUELO = 10;

export function DuelosTela() {
  const nav = useNavigate();
  const modoBackend = useApp((s) => s.modoBackend);
  const [logado, setLogado] = useState<boolean | null>(null);
  const [topicoId, setTopicoId] = useState('');
  const [codigoCriado, setCodigoCriado] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const perfil = useApp((s) => s.perfil);
  const [disciplinaId, setDisciplinaId] = useState(perfil?.disciplinaAtual ?? 'embriologia');
  const topicos = topicosDe(disciplinaId);

  useEffect(() => {
    void obterBackend()
      .then((b) => b.usuarioAtual())
      .then((u) => setLogado(!!u));
  }, []);

  async function criar() {
    setOcupado(true);
    setMsg(null);
    try {
      const fonte = topicoId ? topicos.filter((t) => t.id === topicoId) : topicos;
      const itens = montarSessao(fonte, { modo: 'plantao', tamanho: QUESTOES_POR_DUELO });
      if (itens.length < 5) throw new Error('Este tópico ainda não tem questões rápidas suficientes para um duelo.');
      const b = await obterBackend();
      setCodigoCriado(await b.criarDuelo(disciplinaId, itens.map((i) => i.questao.id)));
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setMsg('Convite copiado.');
    } catch {
      setMsg('Não deu para copiar automaticamente; selecione o código e copie.');
    }
  }

  if (modoBackend === 'offline' || logado === false)
    return (
      <div className="pilha">
        <h1><Icone nome="duelo" tamanho={28} /> Duelos</h1>
        <div className="card pilha">
          <p style={{ margin: 0 }}>
            Desafie um colega: vocês respondem as mesmas 10 questões e vence quem acertar mais (no empate, quem for mais rápido).
          </p>
          {modoBackend === 'offline' ? (
            <div className="aviso info">Duelos precisam de conta online, disponível quando o servidor de ranking for ativado.</div>
          ) : (
            <Link to="/perfil" className="btn primario">Entrar com e-mail para duelar</Link>
          )}
        </div>
      </div>
    );

  const convite = codigoCriado ? `Te desafio no MedLiga! Código do duelo: ${codigoCriado}` : '';

  return (
    <div className="pilha">
      <header>
        <h1><Icone nome="duelo" tamanho={28} /> Duelos</h1>
        <p className="muted" style={{ margin: 0 }}>Mesmas 10 questões para os dois. Vence quem acertar mais; no empate, quem for mais rápido. Vale XP para o ranking.</p>
      </header>
      {modoBackend === 'demo' && <div className="aviso">Modo demonstração: o adversário é fictício.</div>}

      <div className="card pilha">
        <h2 style={{ margin: 0 }}>Criar desafio</h2>
        {!codigoCriado ? (
          <>
            <div className="campo">
              <label htmlFor="duelo-disciplina">Disciplina</label>
              <select id="duelo-disciplina" className="input" value={disciplinaId} onChange={(e) => { setDisciplinaId(e.target.value); setTopicoId(''); }}>
                {DISCIPLINAS.filter((x) => x.status === 'disponivel').map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="duelo-topico">Assunto</label>
              <select id="duelo-topico" className="input" value={topicoId} onChange={(e) => setTopicoId(e.target.value)}>
                <option value="">Todos os tópicos</option>
                {topicos.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </div>
            <button className="btn primario" onClick={criar} disabled={ocupado}>{ocupado ? 'Criando…' : 'Criar e gerar código'}</button>
          </>
        ) : (
          <>
            <div className="centro">
              <span className="muted pequeno">Código do duelo</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: 6, userSelect: 'all' }}>{codigoCriado}</div>
              <span className="muted pequeno">Vale por 48 horas.</span>
            </div>
            <div className="grade g2">
              <button className="btn" onClick={() => copiar(convite)}>Copiar convite</button>
              <button className="btn primario" onClick={() => nav(`/jogar/quiz?duelo=${codigoCriado}`)}>Jogar minha parte agora</button>
            </div>
          </>
        )}
      </div>

      <div className="card pilha">
        <h2 style={{ margin: 0 }}>Recebi um código</h2>
        <div className="linha">
          <input
            id="duelo-codigo"
            className="input"
            style={{ flex: 1, minWidth: 0, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700 }}
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder="ABC234"
            aria-label="Código do duelo"
          />
          <button className="btn primario" disabled={codigo.length !== 6} onClick={() => nav(`/jogar/quiz?duelo=${codigo}`)}>
            Aceitar
          </button>
        </div>
      </div>
      {msg && <p className="muted pequeno" role="status" style={{ margin: 0 }}>{msg}</p>}
    </div>
  );
}
