// Jogo "Qual é o tecido?": um campo do microscópio aparece e o jogador escolhe o tecido/órgão.
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LAMINAS } from '../../content/index.ts';
import { criarRng, embaralhar } from '../../core/random.ts';
import { salvarMinijogo, type Jogada } from '../../games/minijogo.ts';
import { Barra } from '../../ui/comum.tsx';
import { Visor } from './Visor.tsx';
import { AREA_PADRAO, LAMINAS_RENDER } from './laminas/index.ts';

const RODADAS = 10;

interface Rodada {
  laminaId: string;
  opcoes: string[]; // ids de lâminas
  centro: { x: number; y: number };
}

function montar(semente: number): Rodada[] {
  const rng = criarRng(semente);
  return embaralhar(LAMINAS, rng)
    .slice(0, RODADAS)
    .map((l) => {
      // distratores com nome de tecido diferente do correto
      const outras = embaralhar(LAMINAS.filter((x) => x.tecido !== l.tecido), rng).slice(0, 3);
      // o centro do campo de 10× cai na área diagnóstica da lâmina (onde o tecido-resposta aparece)
      const [x0, y0, x1, y1] = LAMINAS_RENDER[l.id]?.areaDiagnostica ?? AREA_PADRAO;
      return {
        laminaId: l.id,
        opcoes: embaralhar([l.id, ...outras.map((x) => x.id)], rng),
        centro: { x: x0 + rng() * (x1 - x0), y: y0 + rng() * (y1 - y0) },
      };
    });
}

export default function QualTecidoTela() {
  const [semente, setSemente] = useState(() => Date.now() % 100000);
  const rodadas = useMemo(() => montar(semente), [semente]);
  const [r, setR] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioRodada = useRef(Date.now());
  const rod = rodadas[r];
  const certa = LAMINAS.find((l) => l.id === rod.laminaId)!;

  function responder(id: string) {
    if (escolha) return;
    setEscolha(id);
    setJogadas((j) => [...j, { id: `tecido:${rod.laminaId}`, topicoId: certa.topicos[0] ?? 'histologia', correta: id === rod.laminaId, tempoMs: Date.now() - inicioRodada.current }]);
  }

  async function proxima() {
    if (r + 1 >= rodadas.length) {
      setXpFinal(await salvarMinijogo('qual-tecido', inicio.current, jogadas, 'histologia'));
      return;
    }
    setR(r + 1);
    setEscolha(null);
    inicioRodada.current = Date.now();
  }

  if (xpFinal !== null) {
    const acertos = jogadas.filter((j) => j.correta).length;
    return (
      <div className="pilha" style={{ marginTop: 12 }}>
        <div className="card destaque centro pilha">
          <div className="confete" aria-hidden>{acertos >= 8 ? '🏆' : '🔬'}</div>
          <h1 style={{ margin: 0 }}>+{xpFinal} XP</h1>
          <p className="muted" style={{ margin: 0 }}>{acertos} de {jogadas.length} tecidos reconhecidos</p>
        </div>
        <div className="grade g2">
          <button className="btn primario" onClick={() => { setSemente((s) => s + 1); setR(0); setEscolha(null); setJogadas([]); setXpFinal(null); inicio.current = Date.now(); inicioRodada.current = Date.now(); }}>Jogar de novo</button>
          <Link to="/microscopio" className="btn">Estudar no microscópio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pilha">
      <div className="linha entre">
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair">✕</Link>
        <div style={{ flex: 1 }}><Barra valor={r / rodadas.length} rotulo="Progresso" /></div>
        <span className="chip-xp">{r + 1}/{rodadas.length}</span>
      </div>
      <h2 style={{ margin: 0 }}>Qual é o tecido (ou órgão) neste campo?</h2>
      <Visor key={`${semente}-${r}`} laminaId={rod.laminaId} objetivaInicial={1} centroInicial={rod.centro} objetivaFixa />
      <div className="lista-opcoes" role="radiogroup">
        {rod.opcoes.map((id, k) => {
          const l = LAMINAS.find((x) => x.id === id)!;
          let cls = '';
          if (escolha) {
            if (id === rod.laminaId) cls = 'certa';
            else if (id === escolha) cls = 'errada';
          }
          return (
            <button key={id} role="radio" aria-checked={escolha === id} className={`opcao ${cls}`} disabled={!!escolha} onClick={() => responder(id)}>
              <span className="letra">{'abcd'[k]}</span>
              <span>{l.tecido}</span>
            </button>
          );
        })}
      </div>
      {escolha && (
        <div className={`feedback ${escolha === rod.laminaId ? 'ok' : 'erro'}`} role="status">
          <h3>{escolha === rod.laminaId ? '✅ Isso!' : `❌ É ${certa.tecido.toLowerCase()}`}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{certa.titulo}: {certa.descricao}</p>
        </div>
      )}
      {escolha && (
        <div className="rodape-acao">
          <button className="btn primario bloco" onClick={proxima} autoFocus>{r + 1 >= rodadas.length ? 'Ver resultado' : 'Próxima'}</button>
        </div>
      )}
    </div>
  );
}
