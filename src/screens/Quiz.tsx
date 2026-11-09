import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { topico as buscarTopico, topicosDe } from '../content/index.ts';
import { montarSessao, type ItemSessao, type ModoSessao } from '../core/session.ts';
import { calcularXP, corrigir, TEMPO_MINIMO_MS, type Resposta } from '../core/scoring.ts';
import { novoEstado, registrarResposta, type EstadoItem } from '../core/srs.ts';
import { podeIniciar } from '../core/planos.ts';
import { db, uuid, type RegistroResposta } from '../data/db.ts';
import { useApp } from '../data/store.ts';
import { QuestaoView, respostaCompleta } from '../games/questoes.tsx';
import { Barra } from '../ui/comum.tsx';
import { Carregando } from '../ui/Carregando.tsx';

const DURACAO_PLANTAO_MS = 90_000;
const LIMITE_QUESTAO_PLANTAO_MS = 15_000;

interface Registro {
  item: ItemSessao;
  resposta: Resposta | null;
  correta: boolean;
  xp: number;
  tempoMs: number;
}

export function QuizTela() {
  const [params] = useSearchParams();
  const modo = (params.get('modo') ?? 'estudo') as ModoSessao;
  const topicoId = params.get('topico');
  const nav = useNavigate();
  const perfil = useApp((s) => s.perfil)!;
  const uso = useApp((s) => s.uso);
  const contarUso = useApp((s) => s.contarUso);
  const concluirSessao = useApp((s) => s.concluirSessao);

  const topicos = useMemo(() => {
    if (topicoId) {
      const t = buscarTopico(topicoId);
      return t ? [t] : [];
    }
    return topicosDe('embriologia');
  }, [topicoId]);

  const tipoUso = modo === 'plantao' ? 'plantao' : 'estudo';
  const [liberado] = useState(() => podeIniciar(perfil.plano, uso, tipoUso).ok);
  const [itens, setItens] = useState<ItemSessao[] | null>(null);
  const estadosRef = useRef(new Map<string, EstadoItem>());
  const acertosRecentesRef = useRef(new Map<string, number>());
  const sessaoId = useRef(uuid());
  const inicioSessao = useRef(Date.now());
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [revelada, setRevelada] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [combo, setCombo] = useState(0);
  const [fim, setFim] = useState(false);
  const inicioQuestao = useRef(Date.now());
  const [agora, setAgora] = useState(Date.now());
  const salvo = useRef(false);

  // Monta a sessão
  useEffect(() => {
    if (!liberado) return;
    let vivo = true;
    void (async () => {
      const estados = await db.estados.toArray();
      const mapa = new Map(estados.map((e) => [e.questaoId, e]));
      estadosRef.current = mapa;
      const desde = Date.now() - 86400000;
      const recentes = await db.respostas.where('criadoEm').above(desde).toArray();
      const ar = new Map<string, number>();
      for (const r of recentes) if (r.correta) ar.set(r.questaoId, (ar.get(r.questaoId) ?? 0) + 1);
      acertosRecentesRef.current = ar;
      const tamanho = modo === 'plantao' ? 40 : 10;
      const s = montarSessao(topicos, { modo, tamanho, estados: mapa });
      if (!vivo) return;
      setItens(s);
      inicioSessao.current = Date.now();
      inicioQuestao.current = Date.now();
      await contarUso(tipoUso);
    })();
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cronômetro do plantão
  useEffect(() => {
    if (modo !== 'plantao' || !itens || fim) return;
    const t = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(t);
  }, [modo, itens, fim]);
  const restanteMs = modo === 'plantao' ? Math.max(0, DURACAO_PLANTAO_MS - (agora - inicioSessao.current)) : Infinity;
  useEffect(() => {
    if (modo === 'plantao' && itens && restanteMs <= 0 && !fim) setFim(true);
  }, [restanteMs, modo, itens, fim]);

  // Salva ao terminar
  useEffect(() => {
    if (!fim || salvo.current || !itens) return;
    salvo.current = true;
    const agoraFim = Date.now();
    const respostas: RegistroResposta[] = registros.map((r) => ({
      sessaoId: sessaoId.current,
      questaoId: r.item.questao.id,
      topicoId: r.item.topicoId,
      correta: r.correta,
      fracao: r.correta ? 1 : 0,
      xp: r.xp,
      tempoMs: r.tempoMs,
      criadoEm: agoraFim,
    }));
    const estados: EstadoItem[] = [];
    for (const r of registros) {
      const atual = estadosRef.current.get(r.item.questao.id) ?? novoEstado(r.item.questao.id, agoraFim);
      const novo = registrarResposta(atual, r.correta, agoraFim);
      estadosRef.current.set(novo.questaoId, novo);
      estados.push(novo);
    }
    void concluirSessao(
      {
        id: sessaoId.current,
        modo,
        disciplina: 'embriologia',
        topicoIds: [...new Set(registros.map((r) => r.item.topicoId))],
        inicio: inicioSessao.current,
        fim: agoraFim,
        xp: registros.reduce((s, r) => s + r.xp, 0),
        acertos: registros.filter((r) => r.correta).length,
        total: registros.length,
        ranqueada: true,
        sincronizada: 0,
      },
      respostas,
      estados,
    );
  }, [fim, itens, registros, modo, concluirSessao]);

  if (!liberado)
    return (
      <div className="card pilha centro" style={{ marginTop: 24 }}>
        <div className="confete" aria-hidden>⏸️</div>
        <h2>Limite diário do plano gratuito atingido</h2>
        <p className="muted">
          Você já usou suas {modo === 'plantao' ? 'partidas de plantão' : 'sessões de questões'} de hoje. Volte amanhã ou assine o Premium para jogar sem limites.
        </p>
        <Link to="/planos" className="btn ouro">Conhecer o Premium</Link>
        <Link to="/" className="btn fantasma">Voltar ao início</Link>
      </div>
    );
  if (!itens) return <Carregando texto="Montando sua sessão…" />;
  if (itens.length === 0)
    return (
      <div className="card pilha centro" style={{ marginTop: 24 }}>
        <h2>{modo === 'revisao' ? 'Nada para revisar agora' : 'Sem questões disponíveis'}</h2>
        <p className="muted">{modo === 'revisao' ? 'Você está em dia com a revisão espaçada. 🎉' : 'O conteúdo deste tópico ainda está sendo preparado.'}</p>
        <Link to="/" className="btn primario">Voltar ao início</Link>
      </div>
    );

  if (fim) return <Resumo registros={registros} modo={modo} onSair={() => nav(topicoId ? `/topico/${topicoId}` : '/')} />;

  const item = itens[indice];
  const q = item.questao;

  function confirmar(r: Resposta | null = resposta) {
    if (!r || revelada) return;
    const tempoMs = Math.max(TEMPO_MINIMO_MS, Date.now() - inicioQuestao.current);
    const c = corrigir(q, r);
    const xp = calcularXP({
      dificuldade: q.dificuldade,
      correta: c.correta,
      comboAnterior: combo,
      tempoMs: modo === 'plantao' ? tempoMs : undefined,
      limiteMs: modo === 'plantao' ? LIMITE_QUESTAO_PLANTAO_MS : undefined,
      acertosRecentes24h: acertosRecentesRef.current.get(q.id) ?? 0,
    });
    setRegistros((rs) => [...rs, { item, resposta: r, correta: c.correta, xp, tempoMs }]);
    setCombo(c.correta ? combo + 1 : 0);
    setRevelada(true);
    if (modo === 'plantao') setTimeout(avancar, c.correta ? 450 : 900);
  }

  function avancar() {
    if (indice + 1 >= itens!.length) {
      setFim(true);
      return;
    }
    setIndice((i) => i + 1);
    setResposta(null);
    setRevelada(false);
    inicioQuestao.current = Date.now();
  }

  const ultimo = registros[registros.length - 1];
  const xpSessao = registros.reduce((s, r) => s + r.xp, 0);

  return (
    <div className="pilha">
      <div className="linha entre">
        <button className="btn fantasma pequeno" onClick={() => (registros.length ? setFim(true) : nav(-1))} aria-label="Encerrar sessão">✕</button>
        <div style={{ flex: 1 }}>
          {modo === 'plantao' ? (
            <Barra valor={restanteMs / DURACAO_PLANTAO_MS} ouro rotulo="Tempo restante" />
          ) : (
            <Barra valor={indice / itens.length} rotulo="Progresso da sessão" />
          )}
        </div>
        {modo === 'plantao' ? (
          <span className="chip-xp cronometro" aria-live="off">{Math.ceil(restanteMs / 1000)}s</span>
        ) : (
          <span className="chip-xp">{indice + 1}/{itens.length}</span>
        )}
      </div>
      <div className="linha entre pequeno muted">
        <span>{modo === 'plantao' ? '⚡ Plantão relâmpago' : modo === 'revisao' ? '🔁 Revisão do dia' : '📘 Estudo'} · dificuldade {'●'.repeat(q.dificuldade)}{'○'.repeat(5 - q.dificuldade)}</span>
        <span>{combo >= 2 ? `🔥 combo ×${combo} · ` : ''}{xpSessao} XP</span>
      </div>

      <QuestaoView
        key={q.id}
        questao={q}
        ordemExibicao={item.ordemExibicao}
        resposta={resposta}
        onResponder={(r) => {
          setResposta(r);
          if (modo === 'plantao') confirmar(r);
        }}
        revelada={revelada}
      />

      {revelada && modo !== 'plantao' && ultimo && (
        <div className={`feedback ${ultimo.correta ? 'ok' : 'erro'}`} role="status">
          <h3>{ultimo.correta ? `✅ Correto! +${ultimo.xp} XP` : '❌ Não foi dessa vez'}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{q.explicacao}</p>
          {q.referencia && <p className="muted pequeno" style={{ margin: '8px 0 0' }}>Fonte: {q.referencia}</p>}
        </div>
      )}

      {modo !== 'plantao' && (
        <div className="rodape-acao">
          {!revelada ? (
            <button className="btn primario bloco" disabled={!respostaCompleta(q, resposta)} onClick={() => confirmar()}>
              Confirmar
            </button>
          ) : (
            <button className="btn primario bloco" onClick={avancar} autoFocus>
              {indice + 1 >= itens.length ? 'Ver resultado' : 'Próxima'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Resumo({ registros, modo, onSair }: { registros: Registro[]; modo: ModoSessao; onSair: () => void }) {
  const xp = registros.reduce((s, r) => s + r.xp, 0);
  const acertos = registros.filter((r) => r.correta).length;
  const erros = registros.filter((r) => !r.correta);
  const pct = registros.length ? Math.round((acertos / registros.length) * 100) : 0;
  const modoBackend = useApp((s) => s.modoBackend);
  return (
    <div className="pilha" style={{ marginTop: 12 }}>
      <div className="card destaque centro pilha">
        <div className="confete" aria-hidden>{pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <h1 style={{ margin: 0 }}>+{xp} XP</h1>
        <p className="muted" style={{ margin: 0 }}>
          {acertos} de {registros.length} corretas ({pct}%)
        </p>
        <p className="pequeno muted" style={{ margin: 0 }}>
          {modoBackend === 'offline'
            ? 'Pontos guardados no aparelho. Entram no ranking quando você criar sua conta.'
            : 'Pontos enviados para o ranking da semana (você e sua escola).'}
        </p>
      </div>
      {erros.length > 0 && (
        <section className="pilha">
          <h2>Revise o que errou</h2>
          {erros.map((r) => (
            <div key={r.item.questao.id} className="card">
              <strong>{r.item.questao.enunciado}</strong>
              <p className="muted" style={{ margin: '8px 0 0' }}>{r.item.questao.explicacao}</p>
            </div>
          ))}
        </section>
      )}
      <div className="grade g2">
        <button className="btn primario" onClick={() => location.reload()}>{modo === 'plantao' ? 'Jogar de novo' : 'Nova sessão'}</button>
        <button className="btn" onClick={onSair}>Sair</button>
      </div>
    </div>
  );
}
