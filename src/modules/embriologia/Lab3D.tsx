// Laboratório 3D: linha do tempo do desenvolvimento com modelos manipuláveis.
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ESTAGIOS, estruturas, topico } from '../../content/index.ts';
import { SeloRevisao } from '../../ui/comum.tsx';
import { Cena3D } from './Cena3D.tsx';
import { MODELOS, NOMES_EXTRAS } from './modelos/index.ts';

export function nomesDoEstagio(estagioId: string): Record<string, string> {
  const e = ESTAGIOS.find((x) => x.id === estagioId);
  const nomes: Record<string, string> = { ...NOMES_EXTRAS };
  for (const id of MODELOS[estagioId]?.partes ?? []) nomes[id] = estruturas().get(id)?.nome ?? id;
  for (const s of e?.estruturas ?? []) nomes[s.id] = s.nome;
  return nomes;
}

export default function Lab3DTela() {
  const [params, setParams] = useSearchParams();
  // O estágio vem da URL (fonte única): links, voltar/avançar do navegador e o controle deslizante ficam em sincronia.
  const estagio = ESTAGIOS.find((e) => e.id === params.get('estagio')) ?? ESTAGIOS[0];
  const grupo = estagio.grupo ?? 'desenvolvimento';
  const doGrupo = ESTAGIOS.filter((e) => (e.grupo ?? 'desenvolvimento') === grupo);
  const indice = doGrupo.findIndex((e) => e.id === estagio.id);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [rotulos, setRotulos] = useState(false);
  const [versaoCamera, setVersaoCamera] = useState(0);
  const [ocultos, setOcultos] = useState<string[]>([]);
  const [isolado, setIsolado] = useState<string | null>(null);
  const [corte, setCorte] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  const lista = estagio.estruturas.filter((s) => normalizar(s.nome).includes(normalizar(busca)));
  const nomes = useMemo(() => nomesDoEstagio(estagio.id), [estagio.id]);
  const modelo = MODELOS[estagio.id];
  const temSistemas = ESTAGIOS.some((e) => e.grupo === 'sistemas');
  useEffect(() => { setSelecionado(null); setOcultos([]); setIsolado(null); setCorte(null); setBusca(''); }, [estagio.id]);

  function restaurar() {
    setSelecionado(null); setOcultos([]); setIsolado(null); setCorte(null); setVersaoCamera((v) => v + 1);
  }
  function escolher(id: string) {
    setSelecionado((s) => s === id ? null : id);
    setOcultos((lista) => lista.filter((s) => s !== id));
    if (isolado) setIsolado(id);
  }

  function irPara(i: number) {
    const n = Math.max(0, Math.min(doGrupo.length - 1, i));
    setParams({ estagio: doGrupo[n].id }, { replace: true });
  }
  function irParaGrupo(g: 'desenvolvimento' | 'sistemas') {
    const primeiro = ESTAGIOS.find((e) => (e.grupo ?? 'desenvolvimento') === g);
    if (primeiro) setParams({ estagio: primeiro.id }, { replace: true });
  }

  const info = selecionado
    ? {
        nome: nomes[selecionado] ?? selecionado,
        texto:
          estagio.estruturas.find((s) => s.id === selecionado)?.descricao ??
          estruturas().get(selecionado)?.definicao ??
          (selecionado === 'corpo' ? 'Toque nas saliências e estruturas do embrião para identificá-las.' : ''),
        topicoId: estruturas().get(selecionado)?.topicoId,
      }
    : null;

  return (
    <div className="pilha lab3d">
      <div className="linha entre quebra">
        <div>
          <Link to="/disciplina/embriologia" className="muted pequeno">‹ Embriologia</Link>
          <h1 style={{ margin: '4px 0 0' }}>Laboratório 3D</h1>
        </div>
        <SeloRevisao revisao={estagio.revisao} />
      </div>

      {temSistemas && (
        <div className="abas" role="tablist" aria-label="Tipo de modelo">
          <button role="tab" aria-selected={grupo === 'desenvolvimento'} className={grupo === 'desenvolvimento' ? 'ativa' : ''} onClick={() => irParaGrupo('desenvolvimento')}>
            Desenvolvimento
          </button>
          <button role="tab" aria-selected={grupo === 'sistemas'} className={grupo === 'sistemas' ? 'ativa' : ''} onClick={() => irParaGrupo('sistemas')}>
            Órgãos e sistemas
          </button>
        </div>
      )}

      <div className="card pilha" style={{ gap: 6 }}>
        <div className="linha entre">
          <button className="btn pequeno" onClick={() => irPara(indice - 1)} disabled={indice === 0} aria-label="Modelo anterior">◀</button>
          <div className="centro" style={{ flex: 1 }}>
            <strong>{estagio.titulo}</strong>
            <div className="muted pequeno">
              {estagio.dias}
              {estagio.carnegie.length
                ? ` · Carnegie ${estagio.carnegie.length > 1 ? `${Math.min(...estagio.carnegie)}–${Math.max(...estagio.carnegie)}` : estagio.carnegie[0]}`
                : ''}
              {estagio.tamanho ? ` · ${estagio.tamanho}` : ''}
            </div>
          </div>
          <button className="btn pequeno" onClick={() => irPara(indice + 1)} disabled={indice === doGrupo.length - 1} aria-label="Próximo modelo">▶</button>
        </div>
        {grupo === 'desenvolvimento' ? (
          <>
            <input
              type="range"
              className="slider-tempo"
              min={0}
              max={doGrupo.length - 1}
              step={1}
              value={indice}
              onChange={(e) => irPara(Number(e.target.value))}
              aria-label="Linha do tempo do desenvolvimento"
              aria-valuetext={`${estagio.titulo}, ${estagio.dias}`}
            />
            <label className="campo pequeno">Escolher estágio
              <select className="input" value={indice} onChange={(e) => irPara(Number(e.target.value))}>
                {doGrupo.map((e, i) => <option key={e.id} value={i}>{e.titulo} · {e.dias}</option>)}
              </select>
            </label>
            <span className="muted pequeno">Sequência de estágios; os intervalos do controle não representam duração.</span>
          </>
        ) : (
          <div className="linha quebra" style={{ justifyContent: 'center', gap: 6 }}>
            {doGrupo.map((e, i) => (
              <button key={e.id} className={`btn pequeno ${i === indice ? 'primario' : ''}`} onClick={() => irPara(i)} aria-pressed={i === indice}>
                {e.titulo}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="contexto3d" aria-label="Como interpretar o modelo">
        <strong>Esquema didático · sem escala comparável entre modelos</strong>
        <span>Idades de desenvolvimento após a fertilização; a idade gestacional obstétrica é aproximadamente duas semanas maior.</span>
        <span>{estagio.id === 'gastrulacao' ? 'Vista explodida: camadas afastadas para estudo. As membranas não são colunas de tecido.' : ['implantacao', 'disco-bilaminar', 'neurulacao', 'placenta-membranas'].includes(estagio.id) ? 'Modelo em corte: superfícies abertas revelam estruturas internas.' : 'Formas, proporções e cores simplificadas para identificação.'}</span>
        {estagio.id.startsWith('coracao-') && <span>Cores identificam estruturas; não representam oxigenação. Conexões são esquemáticas, não uma simulação de fluxo em um dia exato.</span>}
      </div>

      <div className="ferramentas3d" role="group" aria-label="Explorar o modelo">
        <button className="btn pequeno" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos}>{rotulos ? 'Ocultar marcadores' : 'Mostrar marcadores'}</button>
        <button className="btn pequeno" disabled={!selecionado && !isolado} aria-pressed={!!isolado} onClick={() => setIsolado(isolado ? null : selecionado)}>{isolado ? 'Sair do isolamento' : 'Isolar seleção'}</button>
        <button className="btn pequeno" disabled={!selecionado} onClick={() => { if (selecionado) setOcultos((s) => [...s, selecionado]); setSelecionado(null); setIsolado(null); }}>Ocultar seleção</button>
        <button className="btn pequeno" onClick={restaurar}>Restaurar vista</button>
        <label className="controle-corte"><input type="checkbox" checked={corte !== null} onChange={(e) => setCorte(e.target.checked ? 0 : null)} /> Corte de exploração</label>
        {corte !== null && <label className="controle-corte">Profundidade <input type="range" min={-2.5} max={2.5} step={0.05} value={corte} onChange={(e) => setCorte(Number(e.target.value))} /></label>}
      </div>
      {(isolado || ocultos.length > 0 || corte !== null) && <p className="aviso info" role="status">{isolado ? 'Estrutura isolada: relações com vizinhos temporariamente ocultas. ' : ''}{ocultos.length ? `${ocultos.length} estrutura(s) oculta(s). ` : ''}{corte !== null ? 'Corte de exploração fixo no modelo: superfícies abertas, sem reconstrução do tecido cortado. Não representa lesão. Marcadores de porções cortadas ficam ocultos; use também a lista de estruturas.' : ''}</p>}
      <div>
        <Cena3D
          estagioId={estagio.id}
          rotulosVisiveis={rotulos}
          selecionado={selecionado}
          nomes={nomes}
          onEscolher={escolher}
          onVazio={() => setSelecionado(null)}
          versaoCamera={versaoCamera}
          ocultos={ocultos}
          isolado={isolado}
          corte={corte}
        />
        <div className="instrucoes3d">
          Arraste para girar · pinça/roda para aproximar · toque numa estrutura
        </div>
      </div>

      {info && (
        <section className="card pilha selecao3d" aria-label="Estrutura selecionada" aria-live="polite">
          <div className="linha entre">
            <div className="linha">
              {modelo.partes.includes(selecionado!) && <span className="numero3d">{modelo.partes.indexOf(selecionado!) + 1}</span>}
              <div><span className="muted pequeno">Estrutura selecionada</span><h2>{info.nome}</h2></div>
            </div>
            <button className="btn pequeno fantasma" onClick={() => setSelecionado(null)} aria-label="Fechar">✕</button>
          </div>
          {info.texto && <p className="muted" style={{ margin: 0 }}>{info.texto}</p>}
          {info.topicoId && topico(info.topicoId) && (
            <Link to={`/topico/${info.topicoId}`} className="pequeno">Estudar: {topico(info.topicoId)!.titulo} ›</Link>
          )}
        </section>
      )}

      <p className="muted pequeno" style={{ margin: 0 }}>Selecione pelo modelo ou pela lista. Os números ligam cada marcador ao nome; uma linha pode atravessar tecidos no esquema. Marcadores e indicações de orientação com ponto de referência fora da vista ficam ocultos. Use Restaurar vista para recuperar o enquadramento; a lista continua disponível.</p>
      <div className="pilha busca-estruturas3d">
        <label className="campo pequeno">Buscar estrutura neste estágio
          <input type="search" className="input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite o nome da estrutura" aria-describedby="resultado-busca3d" />
        </label>
        <div className="linha entre quebra">
          <span id="resultado-busca3d" className="muted pequeno" role="status">{lista.length} de {estagio.estruturas.length} estruturas na lista. A busca não oculta partes do modelo.</span>
          {busca && <button className="btn pequeno" onClick={() => setBusca('')}>Limpar busca</button>}
        </div>
        {lista.length === 0 && <p className="muted pequeno">Nenhum nome corresponde à busca. Tente outro termo ou limpe a busca para ver a lista completa.</p>}
      </div>
      <div className="lista-estruturas3d" role="group" aria-label="Estruturas deste estágio">
        {lista.map((s) => (
          <button
            key={s.id}
            className={`estrutura3d ${selecionado === s.id ? 'ativa' : ''}`}
            aria-pressed={selecionado === s.id}
            onClick={() => escolher(s.id)}
          >
            <span className="numero3d">{modelo.partes.indexOf(s.id) + 1}</span>{' '}
            <span>{s.nome}{ocultos.includes(s.id) && <small> · oculta — selecionar para mostrar</small>}</span>
          </button>
        ))}
      </div>

      {modelo?.legendaCamadas && (
        <div className="legenda-camadas">
          <span style={{ ['--c' as string]: 'var(--ecto)' }}>Ectoderma</span>
          <span style={{ ['--c' as string]: 'var(--neuro)' }}>Neuroectoderma</span>
          <span style={{ ['--c' as string]: 'var(--crista)' }}>Crista neural</span>
          <span style={{ ['--c' as string]: 'var(--meso)' }}>Mesoderma</span>
          <span style={{ ['--c' as string]: 'var(--endo)' }}>Endoderma</span>
          <span style={{ ['--c' as string]: '#f472b6' }}>Notocorda</span>
        </div>
      )}

        <div className="card pilha">
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{estagio.descricao}</p>
          <ul className="markdown" style={{ margin: 0 }}>
            {estagio.destaques.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>

      <div className="grade g2">
        <Link to={`/jogar/identifique?estagio=${estagio.id}`} className="btn primario">🎯 Desafio: identifique neste estágio</Link>
        {estagio.topicos[0] && topico(estagio.topicos[0]) && (
          <Link to={`/topico/${estagio.topicos[0]}`} className="btn">📘 Estudar o tópico</Link>
        )}
      </div>
    </div>
  );
}
