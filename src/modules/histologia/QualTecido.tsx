// Jogo "Qual é o tecido?": um campo do microscópio aparece e o jogador escolhe o tecido/órgão.
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LAMINAS } from '../../content/index.ts';
import { salvarMinijogo, type Jogada } from '../../games/minijogo.ts';
import { Barra } from '../../ui/comum.tsx';
import { Visor } from './Visor.tsx';
import { LAMINAS_RENDER } from './laminas/index.ts';
import { montarRodadas } from './regras.ts';
import { Icone } from '../../ui/Icone.tsx';

const RODADAS = 10;

// distratores: tecido diferente do correto e fora de `distratoresExcluidos` da lâmina (ver regras.ts)
const montar = (semente: number) => montarRodadas(semente, LAMINAS, LAMINAS_RENDER, RODADAS);

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
          <div className="confete"><Icone nome={acertos >= 8 ? 'ranking' : 'microscopio'} tamanho={64} /></div>
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
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair"><Icone nome="fechar" tamanho={16} /></Link>
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
          <h3><Icone nome={escolha === rod.laminaId ? 'certo' : 'errado'} className={escolha === rod.laminaId ? 'ok' : 'erro'} /> {escolha === rod.laminaId ? 'Isso!' : `É ${certa.tecido.toLowerCase()}`}</h3>
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
