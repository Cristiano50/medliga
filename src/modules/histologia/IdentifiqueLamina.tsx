// Jogo "Identifique na lâmina": encontre a estrutura pedida no microscópio. 3 vidas, 10 alvos.
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LAMINAS } from '../../content/index.ts';
import { embaralhar } from '../../core/random.ts';
import { salvarMinijogo, type Jogada } from '../../games/minijogo.ts';
import { Barra } from '../../ui/comum.tsx';
import { Visor, type Destaque } from './Visor.tsx';
import { LAMINAS_RENDER } from './laminas/index.ts';
import { contracaoDe, toqueAceito } from './regras.ts';
import { Icone } from '../../ui/Icone.tsx';
import { Cena } from '../../ui/Cena.tsx';
import { humorPorAcertos } from '../../ui/cenas.ts';

const ALVOS = 10;
const VIDAS = 3;

interface Alvo {
  laminaId: string;
  estruturaId: string;
  topicoId: string;
}

function sortear(fixa: string | null): Alvo[] {
  const fonte = fixa ? LAMINAS.filter((l) => l.id === fixa) : LAMINAS;
  const todos = fonte.flatMap((l) => l.estruturas.map((e) => ({ laminaId: l.id, estruturaId: e.id, topicoId: l.topicos[0] ?? 'histologia' })));
  const ordem = new Map(LAMINAS.map((l, i) => [l.id, i]));
  return embaralhar(todos)
    .slice(0, ALVOS)
    .sort((a, b) => (ordem.get(a.laminaId) ?? 0) - (ordem.get(b.laminaId) ?? 0));
}

export default function IdentifiqueLaminaTela() {
  const [params] = useSearchParams();
  const fixa = params.get('lamina');
  const [partida, setPartida] = useState(0);
  const alvos = useMemo(() => sortear(fixa), [fixa, partida]);
  const [i, setI] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [resultado, setResultado] = useState<{ tocado: string; certo: boolean } | null>(null);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioAlvo = useRef(Date.now());
  const alvo = alvos[i];
  const lamina = alvo ? LAMINAS.find((l) => l.id === alvo.laminaId)! : null;
  const nome = (id: string) => lamina?.estruturas.find((e) => e.id === id)?.nome ?? id;

  function escolher(id: string, pilha?: string[]) {
    if (resultado || !alvo) return;
    // vale também uma parte do alvo (centro germinativo quando o alvo é o folículo linfoide); o inverso não
    const certo = toqueAceito(LAMINAS_RENDER[alvo.laminaId], alvo.estruturaId, id, pilha);
    setJogadas((j) => [...j, { id: `lamina:${alvo.laminaId}:${alvo.estruturaId}`, topicoId: alvo.topicoId, correta: certo, tempoMs: Date.now() - inicioAlvo.current }]);
    setResultado({ tocado: id, certo });
    if (!certo) setVidas((v) => v - 1);
  }

  async function proximo() {
    if (vidas <= 0 || i + 1 >= alvos.length) {
      setXpFinal(await salvarMinijogo('microscopio', inicio.current, jogadas, 'histologia'));
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

  if (xpFinal !== null) {
    const acertos = jogadas.filter((j) => j.correta).length;
    // sem vidas, a cena é calma, qualquer que seja a conta dos acertos
    const humor = vidas > 0 ? humorPorAcertos(acertos, jogadas.length) : 'calmo';
    return (
      <div className="pilha" style={{ marginTop: 12 }}>
        <div className="card destaque centro pilha">
          <Cena humor={humor} icone={vidas <= 0 ? 'coracao-partido' : humor === 'comemorar' ? 'ranking' : 'microscopio'} />
          <h1 style={{ margin: 0 }}>+{xpFinal} XP</h1>
          <p className="muted" style={{ margin: 0 }}>{acertos} de {jogadas.length} estruturas encontradas</p>
        </div>
        <div className="grade g2">
          <button className="btn primario" onClick={reiniciar}>Jogar de novo</button>
          <Link to="/microscopio" className="btn">Ir ao microscópio</Link>
        </div>
      </div>
    );
  }
  if (!alvo || !lamina) return <div className="aviso">Sem estruturas para esta lâmina.</div>;

  const destaques: Record<string, Destaque> = {};
  if (resultado) {
    destaques[alvo.estruturaId] = 'certo';
    destaques[resultado.tocado] = resultado.certo ? 'certo' : 'errado';
  }
  const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const titulo = !resultado
    ? ''
    : !resultado.certo
      ? `Você tocou em: ${nome(resultado.tocado)}`
      : resultado.tocado === alvo.estruturaId
        ? 'Encontrou!'
        : `Isso! (${minuscula(nome(resultado.tocado))}, parte ${contracaoDe(nome(alvo.estruturaId))})`;

  return (
    <div className="pilha">
      <div className="linha entre">
        <Link to="/" className="btn fantasma pequeno" aria-label="Sair"><Icone nome="fechar" tamanho={16} /></Link>
        <div style={{ flex: 1 }}><Barra valor={i / alvos.length} rotulo="Progresso" /></div>
        <span className="vidas" role="img" aria-label={`${Math.max(0, vidas)} de ${VIDAS} vidas`}>{Array.from({ length: VIDAS }, (_, i) => <Icone key={i} nome={i < vidas ? 'coracao' : 'coracao-vazio'} tamanho={18} />)}</span>
      </div>
      <div className="card" style={{ padding: '12px 16px' }}>
        <span className="muted pequeno">{lamina.titulo} · {lamina.coloracao}</span>
        <h2 style={{ margin: '4px 0 0' }}>Toque em: <span style={{ color: 'var(--primary)' }}>{nome(alvo.estruturaId)}</span></h2>
      </div>
      <Visor laminaId={lamina.id} destaques={destaques} onEscolher={escolher} objetivaInicial={0} />
      {resultado && (
        <div className={`feedback ${resultado.certo ? 'ok' : 'erro'}`} role="status">
          <h3>{titulo}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{lamina.estruturas.find((e) => e.id === alvo.estruturaId)?.descricao}</p>
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
