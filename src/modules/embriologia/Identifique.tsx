// Jogo "Identifique": encontre no modelo 3D a estrutura pedida. 3 vidas, 10 alvos.
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ESTAGIOS } from '../../content/index.ts';
import { embaralhar } from '../../core/random.ts';
import { salvarMinijogo, type Jogada } from '../../games/minijogo.ts';
import { Barra } from '../../ui/comum.tsx';
import { Cena3D } from './Cena3D.tsx';
import { MODELOS } from './modelos/index.ts';
import { nomesDoEstagio } from './Lab3D.tsx';
import type { EstadoDestaque } from './tres/nucleo.tsx';

const ALVOS = 10;
const VIDAS = 3;

interface Alvo {
  estagioId: string;
  estruturaId: string;
  topicoId: string;
}

function sortearAlvos(estagioFixo: string | null): Alvo[] {
  const estagios = estagioFixo ? ESTAGIOS.filter((e) => e.id === estagioFixo) : ESTAGIOS;
  const todos: Alvo[] = [];
  for (const e of estagios) {
    const partes = new Set(MODELOS[e.id]?.partes ?? []);
    for (const s of e.estruturas) if (partes.has(s.id)) todos.push({ estagioId: e.id, estruturaId: s.id, topicoId: e.topicos[0] ?? 'embriologia' });
  }
  const sorteados = embaralhar(todos).slice(0, ALVOS);
  // agrupa por estágio para não trocar de modelo a cada pergunta
  const ordemEstagio = new Map(ESTAGIOS.map((e, i) => [e.id, i]));
  return sorteados.sort((a, b) => (ordemEstagio.get(a.estagioId) ?? 0) - (ordemEstagio.get(b.estagioId) ?? 0));
}

export default function IdentifiqueTela() {
  const [params] = useSearchParams();
  const estagioFixo = params.get('estagio');
  const [partida, setPartida] = useState(0);
  const alvos = useMemo(() => sortearAlvos(estagioFixo), [estagioFixo, partida]);
  const [i, setI] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [resultado, setResultado] = useState<{ tocado: string; certo: boolean } | null>(null);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioAlvo = useRef(Date.now());

  const alvo = alvos[i];
  const nomes = useMemo(() => (alvo ? nomesDoEstagio(alvo.estagioId) : {}), [alvo]);
  const estagio = alvo ? ESTAGIOS.find((e) => e.id === alvo.estagioId)! : null;

  async function terminar(js: Jogada[]) {
    setXpFinal(await salvarMinijogo('identifique', inicio.current, js));
  }

  function escolher(id: string) {
    if (resultado || !alvo) return;
    const certo = id === alvo.estruturaId;
    const j: Jogada = { id: `identifique:${alvo.estagioId}:${alvo.estruturaId}`, topicoId: alvo.topicoId, correta: certo, tempoMs: Date.now() - inicioAlvo.current };
    setJogadas((x) => [...x, j]);
    setResultado({ tocado: id, certo });
    if (!certo) setVidas((v) => v - 1);
  }

  function proximo() {
    const js = jogadas;
    if (vidas <= 0 || i + 1 >= alvos.length) {
      void terminar(js);
      return;
    }
    setI(i + 1);
    setResultado(null);
    inicioAlvo.current = Date.now();
  }

  function reiniciar() {
    setPartida((p) => p + 1);
    setI(0);
    setVidas(VIDAS);
    setJogadas([]);
    setResultado(null);
    setXpFinal(null);
    inicio.current = Date.now();
    inicioAlvo.current = Date.now();
  }

  if (alvos.length === 0)
    return (
      <div className="card centro pilha" style={{ marginTop: 24 }}>
        <h2>Sem estruturas para este estágio</h2>
        <Link to="/lab3d" className="btn primario">Voltar ao laboratório</Link>
      </div>
    );

  if (xpFinal !== null) {
    const acertos = jogadas.filter((j) => j.correta).length;
    return (
      <div className="pilha" style={{ marginTop: 12 }}>
        <div className="card destaque centro pilha">
          <div className="confete" aria-hidden>{vidas > 0 ? '🎯' : '💔'}</div>
          <h1 style={{ margin: 0 }}>+{xpFinal} XP</h1>
          <p className="muted" style={{ margin: 0 }}>{acertos} de {jogadas.length} estruturas encontradas</p>
        </div>
        <div className="grade g2">
          <button className="btn primario" onClick={reiniciar}>Jogar de novo</button>
          <Link to="/lab3d" className="btn">Ir ao laboratório</Link>
        </div>
      </div>
    );
  }

  const destaques: Record<string, EstadoDestaque> = {};
  if (resultado) {
    destaques[alvo.estruturaId] = 'certo';
    if (!resultado.certo) destaques[resultado.tocado] = 'errado';
  }

  return (
    <div className="pilha">
      <div className="linha entre">
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair">✕</Link>
        <div style={{ flex: 1 }}><Barra valor={i / alvos.length} rotulo="Progresso" /></div>
        <span className="vidas" aria-label={`${vidas} vidas`}>{'❤️'.repeat(Math.max(0, vidas))}{'🤍'.repeat(VIDAS - Math.max(0, vidas))}</span>
      </div>
      <div className="card" style={{ padding: '12px 16px' }}>
        <span className="muted pequeno">{estagio?.titulo} · {estagio?.dias}</span>
        <h2 style={{ margin: '4px 0 0' }}>Toque em: <span style={{ color: 'var(--primary)' }}>{nomes[alvo.estruturaId]}</span></h2>
      </div>
      <Cena3D
        estagioId={alvo.estagioId}
        rotulosVisiveis={false}
        selecionado={null}
        destaques={destaques}
        nomes={nomes}
        modoJogo
        onEscolher={escolher}
      />
      {resultado && (
        <div className={`feedback ${resultado.certo ? 'ok' : 'erro'}`} role="status">
          <h3>{resultado.certo ? '✅ Encontrou!' : `❌ Você tocou em: ${nomes[resultado.tocado] ?? resultado.tocado}`}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>
            {estagio?.estruturas.find((s) => s.id === alvo.estruturaId)?.descricao}
          </p>
        </div>
      )}
      {resultado && (
        <div className="rodape-acao">
          <button className="btn primario bloco" onClick={proximo} autoFocus>
            {vidas <= 0 || i + 1 >= alvos.length ? 'Ver resultado' : 'Próxima'}
          </button>
        </div>
      )}
    </div>
  );
}
