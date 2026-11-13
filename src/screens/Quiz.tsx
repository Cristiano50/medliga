import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { topico as buscarTopico, topicosDe } from '../content/index.ts';
import { disciplinaDoTopico } from '../content/disciplinas.ts';
import { DIFICULDADE_AVANCADA, montarSessao, type ItemSessao, type ModoSessao } from '../core/session.ts';
import { calcularXP, corrigir, TEMPO_MINIMO_MS, type Resposta } from '../core/scoring.ts';
import { novoEstado, registrarResposta, type EstadoItem } from '../core/srs.ts';
import { podeIniciar } from '../core/planos.ts';
import { db, uuid, type RegistroResposta } from '../data/db.ts';
import { useApp } from '../data/store.ts';
import { QuestaoView, respostaCompleta } from '../games/questoes.tsx';
import { Barra, Dificuldade } from '../ui/comum.tsx';
import { Carregando } from '../ui/Carregando.tsx';
import { ReportarErro } from '../ui/ReportarErro.tsx';
import { obterBackend, vencedorDuelo, type Duelo } from '../data/backend.ts';
import { Avatar } from '../modules/avatar/Avatar.tsx';
import { Icone } from '../ui/Icone.tsx';

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
  const codigoDuelo = params.get('duelo');
  const modo = (codigoDuelo ? 'duelo' : (params.get('modo') ?? 'estudo')) as ModoSessao;
  const [duelo, setDuelo] = useState<Duelo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const topicoId = params.get('topico');
  const avancado = modo === 'estudo' && params.get('nivel') === 'avancado';
  const nav = useNavigate();
  const perfil = useApp((s) => s.perfil)!;
  const disciplinaId =
    params.get('disciplina') ?? (topicoId ? disciplinaDoTopico(topicoId) : undefined) ?? perfil.disciplinaAtual ?? 'embriologia';
  const uso = useApp((s) => s.uso);
  const contarUso = useApp((s) => s.contarUso);
  const concluirSessao = useApp((s) => s.concluirSessao);

  const topicos = useMemo(() => {
    if (topicoId) {
      const t = buscarTopico(topicoId);
      return t ? [t] : [];
    }
    return topicosDe(disciplinaId);
  }, [topicoId, disciplinaId]);

  const tipoUso = modo === 'plantao' ? 'plantao' : 'estudo';
  // Duelos não consomem o limite diário: são o principal convite para novos jogadores.
  const [liberado] = useState(() => !!codigoDuelo || podeIniciar(perfil.plano, uso, tipoUso).ok);
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
      if (codigoDuelo) {
        try {
          const d = await (await obterBackend()).entrarDuelo(codigoDuelo);
          if (!vivo) return;
          setDuelo(d);
          if (d.meuResultado) {
            // já jogou: vai direto para o placar
            salvo.current = true;
            setItens([]);
            setFim(true);
            return;
          }
          const porId = new Map(topicosDe(d.disciplina).flatMap((t) => t.questoes.map((q) => [q.id, { questao: q, topicoId: t.id }] as const)));
          const s: ItemSessao[] = d.questoes.flatMap((id) => {
            const x = porId.get(id);
            if (!x) return [];
            return [{ ...x, ordemExibicao: x.questao.tipo === 'multipla' ? x.questao.alternativas.map((a) => a.id) : undefined }];
          });
          setItens(s);
        } catch (e) {
          if (vivo) setErro((e as Error).message);
          return;
        }
      } else {
        const tamanho = modo === 'plantao' ? 40 : 10;
        const s = montarSessao(topicos, { modo, tamanho, estados: mapa, dificuldadeMinima: avancado ? DIFICULDADE_AVANCADA : undefined });
        if (!vivo) return;
        setItens(s);
        await contarUso(tipoUso);
      }
      inicioSessao.current = Date.now();
      inicioQuestao.current = Date.now();
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
        disciplina: duelo?.disciplina ?? disciplinaId,
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
    if (codigoDuelo && registros.length) {
      void obterBackend()
        .then((b) =>
          b.registrarResultadoDuelo(codigoDuelo, {
            acertos: registros.filter((r) => r.correta).length,
            total: registros.length,
            tempoMs: registros.reduce((s, r) => s + r.tempoMs, 0),
          }),
        )
        .then(setDuelo)
        .catch((e: Error) => setErro(`Não foi possível enviar o resultado do duelo: ${e.message}`));
    }
  }, [fim, itens, registros, modo, concluirSessao, codigoDuelo, duelo, disciplinaId]);

  if (erro && !fim)
    return (
      <div className="card pilha centro" style={{ marginTop: 24 }}>
        <h2>Duelo indisponível</h2>
        <p className="muted">{erro}</p>
        <Link to="/duelos" className="btn primario">Voltar aos duelos</Link>
      </div>
    );
  if (!liberado)
    return (
      <div className="card pilha centro" style={{ marginTop: 24 }}>
        <div className="confete"><Icone nome="pausa" tamanho={64} /></div>
        <h2>Limite diário do plano gratuito atingido</h2>
        <p className="muted">
          Você já usou suas {modo === 'plantao' ? 'partidas de plantão' : 'sessões de questões'} de hoje. Volte amanhã ou assine o Premium para jogar sem limites.
        </p>
        <Link to="/planos" className="btn ouro">Conhecer o Premium</Link>
        <Link to="/" className="btn fantasma">Voltar ao início</Link>
      </div>
    );
  if (!itens) return <Carregando texto="Montando sua sessão…" />;
  if (codigoDuelo && fim) return <PlacarDuelo duelo={duelo} registros={registros} erro={erro} />;
  if (itens.length === 0)
    return (
      <div className="card pilha centro" style={{ marginTop: 24 }}>
        {modo === 'revisao' && <div className="confete"><Icone nome="festa" tamanho={64} /></div>}
        <h2>{modo === 'revisao' ? 'Nada para revisar agora' : 'Sem questões disponíveis'}</h2>
        <p className="muted">{modo === 'revisao' ? 'Você está em dia com a revisão espaçada.' : 'O conteúdo deste tópico ainda está sendo preparado.'}</p>
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
        <button className="btn fantasma pequeno" onClick={() => (registros.length ? setFim(true) : nav(-1))} aria-label="Encerrar sessão"><Icone nome="fechar" tamanho={16} /></button>
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
        <span><Icone nome={modo === 'plantao' ? 'raio' : modo === 'revisao' ? 'revisao' : avancado ? 'fogo' : 'livro'} tamanho={16} /> {modo === 'plantao' ? 'Plantão relâmpago' : modo === 'revisao' ? 'Revisão do dia' : avancado ? 'Desafio avançado' : 'Estudo'} · dificuldade <Dificuldade nivel={q.dificuldade} /></span>
        <span>{combo >= 2 && <><Icone nome="fogo" tamanho={16} className="acento" /> combo ×{combo} · </>}{xpSessao} XP</span>
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
          <h3><Icone nome={ultimo.correta ? 'certo' : 'errado'} className={ultimo.correta ? 'ok' : 'erro'} /> {ultimo.correta ? `Correto! +${ultimo.xp} XP` : 'Não foi dessa vez'}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{q.explicacao}</p>
          {q.referencia && <p className="muted pequeno" style={{ margin: '8px 0 0' }}>Fonte: {q.referencia}</p>}
          <div style={{ marginTop: 8 }}><ReportarErro key={q.id} questaoId={q.id} /></div>
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
        <div className="confete"><Icone nome={pct >= 80 ? 'ranking' : pct >= 50 ? 'tendencia' : 'estudar'} tamanho={64} /></div>
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
              <p className="muted" style={{ margin: '8px 0' }}>{r.item.questao.explicacao}</p>
              <ReportarErro questaoId={r.item.questao.id} />
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

function segundos(ms: number) {
  return `${Math.round(ms / 1000)} s`;
}

function PlacarDuelo({ duelo, registros, erro }: { duelo: Duelo | null; registros: Registro[]; erro: string | null }) {
  const meuAvatar = useApp((s) => s.perfil?.avatar);
  const meuNome = useApp((s) => s.perfil?.nome ?? '');
  if (erro) return <div className="aviso" style={{ marginTop: 16 }}>{erro}</div>;
  if (!duelo || !duelo.meuResultado) return <Carregando texto="Enviando seu resultado…" />;
  const v = vencedorDuelo(duelo);
  const eu = duelo.meuResultado;
  const ele = duelo.resultadoAdversario;
  const erros = registros.filter((r) => !r.correta);
  return (
    <div className="pilha" style={{ marginTop: 12 }}>
      <div className="card destaque centro pilha">
        <div className="confete"><Icone nome={v === 'eu' ? 'ranking' : v === 'adversario' ? 'medalha' : v === 'empate' ? 'empate' : 'ampulheta'} tamanho={64} /></div>
        <h1 style={{ margin: 0 }}>
          {v === 'eu' ? 'Você venceu!' : v === 'adversario' ? 'Não foi dessa vez' : v === 'empate' ? 'Empate' : 'Aguardando o adversário'}
        </h1>
        <p className="muted" style={{ margin: 0 }}>Duelo {duelo.codigo}{duelo.adversario ? ` · contra ${duelo.adversario}` : ''}</p>
      </div>
      <div className="grade" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card centro">
          <Avatar config={meuAvatar} nome={meuNome} tamanho={56} decorativo className="no-centro" />
          <span className="muted pequeno">Você</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{eu.acertos}/{eu.total}</div>
          <span className="muted pequeno">{segundos(eu.tempoMs)}</span>
        </div>
        <div className="card centro">
          <Avatar config={duelo.adversarioAvatar} nome={duelo.adversario ?? ''} tamanho={56} decorativo className="no-centro" />
          <span className="muted pequeno">{duelo.adversario ?? 'Adversário'}</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{ele ? `${ele.acertos}/${ele.total}` : '—'}</div>
          <span className="muted pequeno">{ele ? segundos(ele.tempoMs) : 'ainda não jogou'}</span>
        </div>
      </div>
      {!ele && (
        <p className="muted pequeno centro" style={{ margin: 0 }}>
          Mande o código <strong style={{ color: 'var(--text)' }}>{duelo.codigo}</strong> para o seu colega. O placar aparece aqui quando ele jogar.
        </p>
      )}
      {erros.length > 0 && (
        <section className="pilha">
          <h2>Revise o que errou</h2>
          {erros.map((r) => (
            <div key={r.item.questao.id} className="card">
              <strong>{r.item.questao.enunciado}</strong>
              <p className="muted" style={{ margin: '8px 0' }}>{r.item.questao.explicacao}</p>
              <ReportarErro questaoId={r.item.questao.id} />
            </div>
          ))}
        </section>
      )}
      <div className="grade g2">
        <Link to="/duelos" className="btn primario">Novo duelo</Link>
        <Link to="/" className="btn">Sair</Link>
      </div>
    </div>
  );
}
