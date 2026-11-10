// Explorador 3D genérico (laboratório da histologia e de outras disciplinas): lista de modelos, marcadores
// numerados, seleção com painel da estrutura, isolar, ocultar/restaurar, corte, tela cheia e recentralizar.
// Reproduz os recursos do Lab3D da embriologia sem alterá-lo; o modelo escolhido vem da URL (?modelo=…).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { topico } from '../../content/index.ts';
import { SeloRevisao } from '../../ui/comum.tsx';
import { Cena3D } from '../embriologia/Cena3D.tsx';
import { CATALOGOS, topicoDaEstrutura, type Disciplina3D } from './catalogo.ts';

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR').trim();

export function Explorador3D({ disciplina }: { disciplina: Disciplina3D }) {
  const catalogo = CATALOGOS[disciplina];
  const [params, setParams] = useSearchParams();
  const itens = catalogo.itens;
  // O modelo vem da URL (fonte única): links, voltar/avançar do navegador e os botões ficam em sincronia.
  const item = itens.find((e) => e.id === params.get(catalogo.parametro)) ?? itens[0];
  const indice = item ? itens.findIndex((e) => e.id === item.id) : -1;
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [rotulos, setRotulos] = useState(false);
  const [versaoCamera, setVersaoCamera] = useState(0);
  const [ocultos, setOcultos] = useState<string[]>([]);
  const [isolado, setIsolado] = useState<string | null>(null);
  const [corte, setCorte] = useState<number | null>(null);
  const [telaCheia, setTelaCheia] = useState(false);
  const [busca, setBusca] = useState('');
  const palco = useRef<HTMLDivElement>(null);
  const nomes = useMemo(() => (item ? catalogo.nomes(item.id) : {}), [catalogo, item]);
  const modelo = item ? catalogo.modelos[item.id] : undefined;
  const raioCorte = Math.max(1, Math.ceil((modelo?.raio ?? 2) * 1.3 * 20) / 20);
  useEffect(() => { setSelecionado(null); setOcultos([]); setIsolado(null); setCorte(null); setBusca(''); }, [item?.id]);
  useEffect(() => { if (telaCheia) palco.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, [telaCheia]);

  if (!item || !modelo)
    return (
      <div className="card centro pilha" style={{ marginTop: 24 }}>
        <h2>Laboratório 3D em preparação</h2>
        <p className="muted">Ainda não há modelos 3D publicados para {catalogo.nome.toLocaleLowerCase('pt-BR')}.</p>
        <Link to={`/disciplina/${catalogo.disciplina}`} className="btn primario">Voltar</Link>
      </div>
    );

  const lista = item.estruturas.filter((s) => normalizar(s.nome).includes(normalizar(busca)));
  const avisos = catalogo.avisos(item);

  function restaurar() {
    setSelecionado(null); setOcultos([]); setIsolado(null); setCorte(null); setVersaoCamera((v) => v + 1);
  }
  function escolher(id: string) {
    setSelecionado((s) => (s === id ? null : id));
    setOcultos((l) => l.filter((s) => s !== id));
    if (isolado) setIsolado(id);
  }
  function irPara(i: number) {
    const n = Math.max(0, Math.min(itens.length - 1, i));
    setParams({ [catalogo.parametro]: itens[n].id }, { replace: true });
  }

  const estruturaSel = selecionado ? item.estruturas.find((s) => s.id === selecionado) : undefined;
  const topicoSel = selecionado ? topicoDaEstrutura(item, selecionado) : undefined;
  const numero = (id: string) => modelo.partes.indexOf(id) + 1;

  return (
    <div className="pilha lab3d">
      <div className="linha entre quebra">
        <div>
          <Link to={`/disciplina/${catalogo.disciplina}`} className="muted pequeno">‹ {catalogo.nome}</Link>
          <h1 style={{ margin: '4px 0 0' }}>Laboratório 3D</h1>
        </div>
        <SeloRevisao revisao={item.revisao} />
      </div>

      <div className="card pilha" style={{ gap: 6 }}>
        <div className="linha entre">
          <button className="btn pequeno" onClick={() => irPara(indice - 1)} disabled={indice <= 0} aria-label="Modelo anterior">◀</button>
          <div className="centro" style={{ flex: 1 }}>
            <strong>{item.titulo}</strong>
            <div className="muted pequeno">{indice + 1} de {itens.length} modelos</div>
          </div>
          <button className="btn pequeno" onClick={() => irPara(indice + 1)} disabled={indice >= itens.length - 1} aria-label="Próximo modelo">▶</button>
        </div>
        {itens.length > 1 && (
          <div className="linha quebra" role="group" aria-label="Modelos" style={{ justifyContent: 'center', gap: 6 }}>
            {itens.map((e, i) => (
              <button key={e.id} className={`btn pequeno ${i === indice ? 'primario' : ''}`} onClick={() => irPara(i)} aria-pressed={i === indice}>
                {e.titulo}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="contexto3d" aria-label="Como interpretar o modelo">
        <strong>{avisos.titulo}</strong>
        {avisos.linhas.map((l, i) => <span key={i}>{l}</span>)}
      </div>

      <div className="ferramentas3d" role="group" aria-label="Explorar o modelo">
        <button className="btn pequeno" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos}>{rotulos ? 'Ocultar marcadores' : 'Mostrar marcadores'}</button>
        <button className="btn pequeno" disabled={!selecionado && !isolado} aria-pressed={!!isolado} onClick={() => setIsolado(isolado ? null : selecionado)}>{isolado ? 'Sair do isolamento' : 'Isolar seleção'}</button>
        <button className="btn pequeno" disabled={!selecionado} onClick={() => { if (selecionado) setOcultos((s) => [...s, selecionado]); setSelecionado(null); setIsolado(null); }}>Ocultar seleção</button>
        <button className="btn pequeno" onClick={restaurar}>Restaurar vista</button>
        <button className="btn pequeno" onClick={() => setTelaCheia((t) => !t)} aria-pressed={telaCheia}>{telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}</button>
        <label className="controle-corte"><input type="checkbox" checked={corte !== null} onChange={(e) => setCorte(e.target.checked ? 0 : null)} /> Corte de exploração</label>
        {corte !== null && <label className="controle-corte">Profundidade <input type="range" min={-raioCorte} max={raioCorte} step={0.05} value={corte} onChange={(e) => setCorte(Number(e.target.value))} /></label>}
      </div>
      {(isolado || ocultos.length > 0 || corte !== null) && (
        <p className="aviso info" role="status">
          {isolado ? 'Estrutura isolada: relações com vizinhos temporariamente ocultas. ' : ''}
          {ocultos.length ? `${ocultos.length} estrutura(s) oculta(s). ` : ''}
          {corte !== null ? 'Corte de exploração fixo no modelo: superfícies abertas, sem reconstrução do tecido cortado. Marcadores de porções cortadas ficam ocultos; use também a lista de estruturas.' : ''}
        </p>
      )}
      <div ref={palco}>
        <Cena3D
          estagioId={item.id}
          rotulosVisiveis={rotulos}
          selecionado={selecionado}
          nomes={nomes}
          onEscolher={escolher}
          onVazio={() => setSelecionado(null)}
          versaoCamera={versaoCamera}
          telaCheia={telaCheia}
          ocultos={ocultos}
          isolado={isolado}
          corte={corte}
          modelo={catalogo.modeloExplicito ? modelo : undefined}
          perfil={catalogo.perfil(item.id)}
        />
        <div className="instrucoes3d">
          Arraste para girar · pinça/roda para aproximar · toque numa estrutura
          {telaCheia && <> · <button className="btn pequeno fantasma" onClick={() => setTelaCheia(false)}>Sair da tela cheia</button></>}
        </div>
      </div>

      {selecionado && (
        <section className="card pilha selecao3d" aria-label="Estrutura selecionada" aria-live="polite">
          <div className="linha entre">
            <div className="linha">
              {modelo.partes.includes(selecionado) && <span className="numero3d">{numero(selecionado)}</span>}
              <div><span className="muted pequeno">Estrutura selecionada</span><h2>{nomes[selecionado] ?? selecionado}</h2></div>
            </div>
            <button className="btn pequeno fantasma" onClick={() => setSelecionado(null)} aria-label="Fechar">✕</button>
          </div>
          {estruturaSel?.descricao && <p className="muted" style={{ margin: 0 }}>{estruturaSel.descricao}</p>}
          {topicoSel && topico(topicoSel) && (
            <Link to={`/topico/${topicoSel}`} className="pequeno">Estudar: {topico(topicoSel)!.titulo} ›</Link>
          )}
        </section>
      )}

      <p className="muted pequeno" style={{ margin: 0 }}>Selecione pelo modelo ou pela lista. Os números ligam cada marcador ao nome; uma linha pode atravessar tecidos no esquema. Marcadores com ponto de referência fora da vista ficam ocultos. Use Restaurar vista para recuperar o enquadramento; a lista continua disponível.</p>
      <div className="pilha busca-estruturas3d">
        <label className="campo pequeno">Buscar estrutura neste modelo
          <input type="search" className="input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite o nome da estrutura" aria-describedby="resultado-busca3d" />
        </label>
        <div className="linha entre quebra">
          <span id="resultado-busca3d" className="muted pequeno" role="status">{lista.length} de {item.estruturas.length} estruturas na lista. A busca não oculta partes do modelo.</span>
          {busca && <button className="btn pequeno" onClick={() => setBusca('')}>Limpar busca</button>}
        </div>
        {lista.length === 0 && <p className="muted pequeno">Nenhum nome corresponde à busca. Tente outro termo ou limpe a busca para ver a lista completa.</p>}
      </div>
      <div className="lista-estruturas3d" role="group" aria-label="Estruturas deste modelo">
        {lista.map((s) => (
          <button key={s.id} className={`estrutura3d ${selecionado === s.id ? 'ativa' : ''}`} aria-pressed={selecionado === s.id} onClick={() => escolher(s.id)}>
            <span className="numero3d">{numero(s.id)}</span>{' '}
            <span>{s.nome}{ocultos.includes(s.id) && <small> · oculta — selecionar para mostrar</small>}</span>
          </button>
        ))}
      </div>

      <div className="card pilha">
        <p style={{ margin: 0, color: 'var(--text-2)' }}>{item.descricao}</p>
        <ul className="markdown" style={{ margin: 0 }}>
          {item.destaques.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>

      <div className="grade g2">
        <Link to={`${catalogo.rotaJogo}?${catalogo.parametro}=${item.id}`} className="btn primario">🎯 Desafio: identifique neste modelo</Link>
        {item.topicos[0] && topico(item.topicos[0]) && (
          <Link to={`/topico/${item.topicos[0]}`} className="btn">📘 Estudar o tópico</Link>
        )}
      </div>
    </div>
  );
}
