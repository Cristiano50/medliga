// Jogo "Identifique no 3D", genérico por disciplina: encontre no modelo a estrutura pedida. 3 vidas, 10 alvos.
// A embriologia (embriologia/Identifique.tsx) e a histologia usam este componente com o catálogo de cada uma.
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { salvarMinijogo, type Jogada } from '../../games/minijogo.ts';
import { Barra } from '../../ui/comum.tsx';
import { Cena3D } from '../embriologia/Cena3D.tsx';
import type { EstadoDestaque } from '../embriologia/tres/nucleo.tsx';
import { CATALOGOS, sortearAlvos, type Disciplina3D } from './catalogo.ts';

export const ALVOS_IDENTIFIQUE = 10;
export const VIDAS_IDENTIFIQUE = 3;

export function Identifique3D({ disciplina }: { disciplina: Disciplina3D }) {
  const catalogo = CATALOGOS[disciplina];
  const [params] = useSearchParams();
  const itemFixo = params.get(catalogo.parametro);
  const [partida, setPartida] = useState(0);
  const alvos = useMemo(() => sortearAlvos(catalogo, itemFixo, ALVOS_IDENTIFIQUE), [catalogo, itemFixo, partida]);
  const [i, setI] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_IDENTIFIQUE);
  const [jogadas, setJogadas] = useState<Jogada[]>([]);
  const [resultado, setResultado] = useState<{ tocado: string; certo: boolean } | null>(null);
  const [xpFinal, setXpFinal] = useState<number | null>(null);
  const inicio = useRef(Date.now());
  const inicioAlvo = useRef(Date.now());

  const alvo = alvos[i];
  const nomes = useMemo(() => (alvo ? catalogo.nomes(alvo.itemId) : {}), [catalogo, alvo]);
  const item = alvo ? catalogo.itens.find((e) => e.id === alvo.itemId)! : null;

  async function terminar(js: Jogada[]) {
    setXpFinal(await salvarMinijogo('identifique', inicio.current, js, catalogo.disciplina));
  }

  function escolher(id: string) {
    if (resultado || !alvo) return;
    const certo = id === alvo.estruturaId;
    const j: Jogada = { id: `identifique:${alvo.itemId}:${alvo.estruturaId}`, topicoId: alvo.topicoId, correta: certo, tempoMs: Date.now() - inicioAlvo.current };
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
    setVidas(VIDAS_IDENTIFIQUE);
    setJogadas([]);
    setResultado(null);
    setXpFinal(null);
    inicio.current = Date.now();
    inicioAlvo.current = Date.now();
  }

  if (alvos.length === 0)
    return (
      <div className="card centro pilha" style={{ marginTop: 24 }}>
        <h2>Sem estruturas para este {catalogo.rotuloItem}</h2>
        <Link to={catalogo.rotaLab} className="btn primario">Voltar ao laboratório</Link>
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
          <Link to={catalogo.rotaLab} className="btn">Ir ao laboratório</Link>
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
        <span className="vidas" aria-label={`${vidas} vidas`}>{'❤️'.repeat(Math.max(0, vidas))}{'🤍'.repeat(VIDAS_IDENTIFIQUE - Math.max(0, vidas))}</span>
      </div>
      <div className="card" style={{ padding: '12px 16px' }}>
        <span className="muted pequeno">{item?.titulo} · {item?.subtitulo}</span>
        <h2 style={{ margin: '4px 0 0' }}>Toque em: <span style={{ color: 'var(--primary)' }}>{nomes[alvo.estruturaId]}</span></h2>
      </div>
      <Cena3D
        estagioId={alvo.itemId}
        rotulosVisiveis={false}
        selecionado={null}
        destaques={destaques}
        nomes={nomes}
        modoJogo
        onEscolher={escolher}
        modelo={catalogo.modeloExplicito ? catalogo.modelos[alvo.itemId] : undefined}
        perfil={catalogo.perfil(alvo.itemId)}
      />
      {resultado && (
        <div className={`feedback ${resultado.certo ? 'ok' : 'erro'}`} role="status">
          <h3>{resultado.certo ? '✅ Encontrou!' : `❌ Você tocou em: ${nomes[resultado.tocado] ?? resultado.tocado}`}</h3>
          <p style={{ margin: 0, color: 'var(--text-2)' }}>
            {item?.estruturas.find((s) => s.id === alvo.estruturaId)?.descricao}
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
