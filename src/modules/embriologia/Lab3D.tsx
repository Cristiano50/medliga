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
  const nomes = useMemo(() => nomesDoEstagio(estagio.id), [estagio.id]);
  const modelo = MODELOS[estagio.id];
  const temSistemas = ESTAGIOS.some((e) => e.grupo === 'sistemas');
  useEffect(() => setSelecionado(null), [estagio.id]);

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
    <div className="pilha">
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
              {estagio.carnegie.length ? ` · Carnegie ${estagio.carnegie.join('–')}` : ''}
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
            <div className="marcas-tempo" aria-hidden>
              <span>Dia 1</span>
              <span>Sem. 2</span>
              <span>Sem. 3</span>
              <span>Sem. 4</span>
              <span>Sem. 8</span>
              <span>Fetal</span>
            </div>
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

      <div style={{ position: 'relative' }}>
        <Cena3D
          estagioId={estagio.id}
          rotulosVisiveis={rotulos}
          selecionado={selecionado}
          nomes={nomes}
          onEscolher={(id) => setSelecionado((s) => (s === id ? null : id))}
          onVazio={() => setSelecionado(null)}
          versaoCamera={versaoCamera}
        />
        <div className="sobreposto linha" style={{ top: 10, right: 10 }}>
          <button className="btn pequeno" onClick={() => setRotulos((r) => !r)} aria-pressed={rotulos}>
            {rotulos ? 'Ocultar nomes' : 'Mostrar nomes'}
          </button>
          <button className="btn pequeno" onClick={() => setVersaoCamera((v) => v + 1)} aria-label="Recentralizar">⟲</button>
        </div>
        <div className="sobreposto muted pequeno" style={{ left: 12, bottom: 10, pointerEvents: 'none' }}>
          Arraste para girar · pinça/roda para aproximar · toque numa estrutura
        </div>
      </div>

      <div className="linha quebra" role="group" aria-label="Estruturas deste estágio" style={{ gap: 6 }}>
        {estagio.estruturas.map((s) => (
          <button
            key={s.id}
            className={`selo ${selecionado === s.id ? 'ia' : ''}`}
            style={{ cursor: 'pointer', minHeight: 32, fontSize: '0.8rem' }}
            aria-pressed={selecionado === s.id}
            onClick={() => setSelecionado((x) => (x === s.id ? null : s.id))}
          >
            {s.nome}
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

      {info ? (
        <div className="card pilha" role="status" aria-live="polite">
          <div className="linha entre">
            <h2 style={{ margin: 0 }}>{info.nome}</h2>
            <button className="btn pequeno fantasma" onClick={() => setSelecionado(null)} aria-label="Fechar">✕</button>
          </div>
          {info.texto && <p className="muted" style={{ margin: 0 }}>{info.texto}</p>}
          {info.topicoId && topico(info.topicoId) && (
            <Link to={`/topico/${info.topicoId}`} className="pequeno">Estudar: {topico(info.topicoId)!.titulo} ›</Link>
          )}
        </div>
      ) : (
        <div className="card pilha">
          <p style={{ margin: 0, color: 'var(--text-2)' }}>{estagio.descricao}</p>
          <ul className="markdown" style={{ margin: 0 }}>
            {estagio.destaques.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}

      <div className="grade g2">
        <Link to={`/jogar/identifique?estagio=${estagio.id}`} className="btn primario">🎯 Desafio: identifique neste estágio</Link>
        {estagio.topicos[0] && topico(estagio.topicos[0]) && (
          <Link to={`/topico/${estagio.topicos[0]}`} className="btn">📘 Estudar o tópico</Link>
        )}
      </div>
    </div>
  );
}
