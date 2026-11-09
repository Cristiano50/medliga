// Minijogo: ordenar eventos do desenvolvimento. Usa os eventos dos tópicos (campo "ordem" = sequência correta).
import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { topico, topicosDe } from '../content/index.ts';
import type { Evento, Topico } from '../content/schema.ts';
import { embaralhar } from '../core/random.ts';
import { salvarMinijogo, type Jogada } from './minijogo.ts';
import { Barra } from '../ui/comum.tsx';

const RODADAS = 3;
const EVENTOS_POR_RODADA = 5;

interface Rodada {
  topico: Topico;
  corretos: Evento[]; // em ordem
  exibicao: string[]; // ids em ordem atual
}

function montarRodadas(fixo: Topico | undefined): Rodada[] {
  const candidatos = (fixo ? [fixo] : topicosDe('embriologia')).filter((t) => new Set(t.eventos.map((e) => e.ordem)).size >= 4);
  const escolhidos = fixo ? Array(RODADAS).fill(fixo) : embaralhar(candidatos).slice(0, RODADAS);
  return escolhidos.map((t: Topico) => {
    // Um evento por valor de "ordem" (evita empates ambíguos).
    const porOrdem = new Map<number, Evento>();
    for (const e of embaralhar(t.eventos)) if (!porOrdem.has(e.ordem)) porOrdem.set(e.ordem, e);
    const amostra = embaralhar([...porOrdem.values()]).slice(0, EVENTOS_POR_RODADA).sort((a, b) => a.ordem - b.ordem);
    let exibicao = embaralhar(amostra.map((e) => e.id));
    if (exibicao.join() === amostra.map((e) => e.id).join()) exibicao = [...exibicao].reverse();
    return { topico: t, corretos: amostra, exibicao };
  });
}

function textoDia(e: Evento): string | null {
  if (e.diaMin === undefined && e.diaMax === undefined) return null;
  const a = e.diaMin ?? e.diaMax!;
  const b = e.diaMax ?? e.diaMin!;
  return a === b ? `dia ${a}` : `dias ${a}–${b}`;
}

export function LinhaDoTempoTela() {
  const [params] = useSearchParams();
  const fixo = params.get('topico') ? topico(params.get('topico')!) : undefined;
  const [rodadas, setRodadas] = useState(() => montarRodadas(fixo));
  const [r, setR] = useState(0);
  const [conferida, setConferida] = useState(false);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioRodada = useRef(Date.now());

  if (rodadas.length === 0)
    return (
      <div className="card centro pilha" style={{ marginTop: 24 }}>
        <h2>Linha do tempo indisponível</h2>
        <p className="muted">Os eventos deste conteúdo ainda estão sendo preparados.</p>
        <Link to="/" className="btn primario">Voltar</Link>
      </div>
    );

  if (xpFinal !== null) {
    const acertos = jogadas.filter((j) => j.correta).length;
    return (
      <div className="pilha" style={{ marginTop: 12 }}>
        <div className="card destaque centro pilha">
          <div className="confete" aria-hidden>⏳</div>
          <h1 style={{ margin: 0 }}>+{xpFinal} XP</h1>
          <p className="muted" style={{ margin: 0 }}>{acertos} de {jogadas.length} eventos na posição certa</p>
        </div>
        <div className="grade g2">
          <button className="btn primario" onClick={() => { setRodadas(montarRodadas(fixo)); setR(0); setJogadas([]); setConferida(false); setXpFinal(null); inicio.current = Date.now(); }}>Jogar de novo</button>
          <Link to="/" className="btn">Sair</Link>
        </div>
      </div>
    );
  }

  const rod = rodadas[r];
  const mapa = new Map(rod.corretos.map((e) => [e.id, e]));

  function mover(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= rod.exibicao.length) return;
    const nova = [...rod.exibicao];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setRodadas((rs) => rs.map((x, k) => (k === r ? { ...x, exibicao: nova } : x)));
  }

  function conferir() {
    const dt = Date.now() - inicioRodada.current;
    const novas = rod.exibicao.map((id, i) => ({
      id: `linha:${rod.topico.id}:${id}`,
      topicoId: rod.topico.id,
      correta: rod.corretos[i].id === id,
      tempoMs: Math.round(dt / rod.exibicao.length),
    }));
    setJogadas((j) => [...j, ...novas]);
    setConferida(true);
  }

  async function proxima() {
    if (r + 1 >= rodadas.length) {
      setXpFinal(await salvarMinijogo('linha-do-tempo', inicio.current, jogadas));
      return;
    }
    setR(r + 1);
    setConferida(false);
    inicioRodada.current = Date.now();
  }

  return (
    <div className="pilha">
      <div className="linha entre">
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair">✕</Link>
        <div style={{ flex: 1 }}><Barra valor={r / rodadas.length} rotulo="Progresso" /></div>
        <span className="chip-xp">{r + 1}/{rodadas.length}</span>
      </div>
      <div>
        <p className="muted pequeno" style={{ margin: 0 }}>{rod.topico.titulo}</p>
        <h2>Ordene do primeiro ao último</h2>
      </div>
      <div className="pilha" style={{ gap: 8 }}>
        {rod.exibicao.map((id, i) => {
          const e = mapa.get(id)!;
          const cls = conferida ? (rod.corretos[i].id === id ? 'certo' : 'errado') : '';
          return (
            <div key={id} className={`ordenavel ${cls}`}>
              <span className="pos">{i + 1}</span>
              <span className="texto">
                {e.descricao}
                {conferida && textoDia(e) && <span className="muted pequeno"> · {textoDia(e)}</span>}
              </span>
              {!conferida && (
                <span className="setas">
                  <button aria-label={`Subir ${e.descricao}`} onClick={() => mover(i, -1)} disabled={i === 0}>▲</button>
                  <button aria-label={`Descer ${e.descricao}`} onClick={() => mover(i, 1)} disabled={i === rod.exibicao.length - 1}>▼</button>
                </span>
              )}
            </div>
          );
        })}
      </div>
      {conferida && (
        <div className="card pequeno">
          <strong>Sequência correta</strong>
          <ol className="markdown" style={{ marginBottom: 0 }}>
            {rod.corretos.map((e) => <li key={e.id}>{e.descricao}{textoDia(e) ? ` (${textoDia(e)})` : ''}</li>)}
          </ol>
        </div>
      )}
      <div className="rodape-acao">
        {!conferida ? (
          <button className="btn primario bloco" onClick={conferir}>Conferir</button>
        ) : (
          <button className="btn primario bloco" onClick={proxima} autoFocus>{r + 1 >= rodadas.length ? 'Ver resultado' : 'Próxima rodada'}</button>
        )}
      </div>
    </div>
  );
}
