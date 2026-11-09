// Minijogo: triagem dos derivados das camadas germinativas.
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DERIVADOS } from '../content/index.ts';
import { embaralhar } from '../core/random.ts';
import { salvarMinijogo, type Jogada } from './minijogo.ts';
import { Barra, SeloRevisao } from '../ui/comum.tsx';

const POR_RODADA = 12;

export function CamadasTela() {
  const [rodada, setRodada] = useState(0);
  const itens = useMemo(() => embaralhar(DERIVADOS.itens).slice(0, POR_RODADA), [rodada]);
  const [i, setI] = useState(0);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioItem = useRef(Date.now());
  const item = itens[i];
  const cats = DERIVADOS.categorias;

  function escolher(cat: string) {
    if (escolha) return;
    setEscolha(cat);
    setJogadas((j) => [...j, { id: `camadas:${item.id}`, topicoId: 'emb-07-semanas4a8', correta: cat === item.categoria, tempoMs: Date.now() - inicioItem.current }]);
  }

  async function proximo() {
    if (i + 1 >= itens.length) {
      setXpFinal(await salvarMinijogo('camadas', inicio.current, jogadas));
      return;
    }
    setI(i + 1);
    setEscolha(null);
    inicioItem.current = Date.now();
  }

  if (xpFinal !== null) {
    const acertos = jogadas.filter((j) => j.correta).length;
    return (
      <div className="pilha" style={{ marginTop: 12 }}>
        <div className="card destaque centro pilha">
          <div className="confete" aria-hidden>{acertos >= 10 ? '🏆' : '🧩'}</div>
          <h1 style={{ margin: 0 }}>+{xpFinal} XP</h1>
          <p className="muted" style={{ margin: 0 }}>{acertos} de {jogadas.length} na camada certa</p>
        </div>
        <div className="grade g2">
          <button className="btn primario" onClick={() => { setRodada((r) => r + 1); setI(0); setJogadas([]); setEscolha(null); setXpFinal(null); inicio.current = Date.now(); }}>Jogar de novo</button>
          <Link to="/" className="btn">Sair</Link>
        </div>
      </div>
    );
  }

  const correta = escolha ? escolha === item.categoria : null;
  const catCerta = cats.find((c) => c.id === item.categoria)!;
  return (
    <div className="pilha">
      <div className="linha entre">
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair">✕</Link>
        <div style={{ flex: 1 }}><Barra valor={i / itens.length} rotulo="Progresso" /></div>
        <span className="chip-xp">{i + 1}/{itens.length}</span>
      </div>
      <div className="linha entre quebra">
        <h2 style={{ margin: 0 }}>De qual origem embriológica?</h2>
        <SeloRevisao revisao={DERIVADOS.revisao} />
      </div>
      <div className="carta-grande" aria-live="polite">{item.texto}</div>
      <div className="bins">
        {cats.map((c) => {
          let estilo: React.CSSProperties = { ['--c' as string]: c.cor };
          if (escolha) {
            if (c.id === item.categoria) estilo = { ...estilo, borderStyle: 'solid', background: '#0f2a1d' };
            else if (c.id === escolha) estilo = { ...estilo, borderStyle: 'solid', background: '#2e1416' };
          }
          return (
            <button key={c.id} className="bin" style={estilo} onClick={() => escolher(c.id)} disabled={!!escolha}>
              {c.nome}
            </button>
          );
        })}
      </div>
      {escolha && (
        <div className={`feedback ${correta ? 'ok' : 'erro'}`} role="status">
          <h3>{correta ? '✅ Isso!' : `❌ É ${catCerta.nome.toLowerCase()}`}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{item.explicacao}</p>
          {item.referencia && <p className="muted pequeno" style={{ margin: '6px 0 0' }}>Fonte: {item.referencia}</p>}
        </div>
      )}
      {escolha && (
        <div className="rodape-acao">
          <button className="btn primario bloco" onClick={proximo} autoFocus>{i + 1 >= itens.length ? 'Ver resultado' : 'Próximo'}</button>
        </div>
      )}
    </div>
  );
}
