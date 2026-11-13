// Editor do avatar: prévia, grupos de categorias, itens com o motivo do bloqueio, sorteio e gravação.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../data/store.ts';
import { Carregando } from '../../ui/Carregando.tsx';
import { Avatar } from './Avatar.tsx';
import { CATALOGO, NOMES_CATEGORIA } from './catalogo.ts';
import type { AvatarConfig, Categoria } from './tipos.ts';
import { avisoDeContraste, chaveItem, comoLiberar, itensLiberados, itensNovos, liberado, normalizarAvatar, restringirAoLiberado, sortearAvatar } from './regras.ts';
import { COBERTURAS } from './pecas.ts';
import { useProgressoAvatar } from './useProgressoAvatar.ts';
import { Icone } from '../../ui/Icone.tsx';

const GRUPOS: { id: string; nome: string; categorias: Categoria[] }[] = [
  { id: 'rosto', nome: 'Rosto', categorias: ['pele', 'rosto', 'oculos', 'barba', 'apoio'] },
  { id: 'cabelo', nome: 'Cabelo', categorias: ['cabelo', 'corCabelo', 'cabeca', 'corCabeca'] },
  { id: 'roupa', nome: 'Roupa', categorias: ['roupa', 'corRoupa', 'acessorio', 'paramento'] },
  { id: 'fundo', nome: 'Fundo', categorias: ['fundo', 'moldura'] },
];

/** Explicação curta sob o título de algumas categorias. */
const NOTAS: Partial<Record<Categoria, string>> = {
  apoio: 'Aparelho auditivo, implante coclear e cordão de girassol. Sempre livres.',
  acessorio: 'Itens de jogo usados no corpo, liberados por nível e por conquistas.',
  paramento: 'Itens de jogo usados na cabeça ou no rosto. Ficam por cima do que você já usa: a touca vai sobre o hijab e os óculos de proteção sobre os seus óculos.',
};

function Marcado() {
  return (
    <svg className="marcado" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="var(--primary)" />
      <path d="M5 9.4 7.8 12 13 6.4" fill="none" stroke="var(--primary-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EditorAvatar() {
  const perfil = useApp((s) => s.perfil)!;
  const salvarAvatar = useApp((s) => s.salvarAvatar);
  const marcarItensVistos = useApp((s) => s.marcarItensVistos);
  const progresso = useProgressoAvatar();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const primeiroAcesso = params.has('inicio');
  const [config, setConfig] = useState<AvatarConfig | null>(() => normalizarAvatar(perfil.avatar));
  const [grupo, setGrupo] = useState(GRUPOS[0].id);
  const [aviso, setAviso] = useState('');
  const [salvando, setSalvando] = useState(false);
  // Itens liberados desde a última visita: a etiqueta "Novo" fica visível durante esta visita.
  const [novos, setNovos] = useState<ReadonlySet<string> | null>(null);
  const vistosAoEntrar = useRef(perfil.avatarItensVistos);

  useEffect(() => {
    if (!progresso || novos) return;
    setNovos(new Set(itensNovos(progresso, vistosAoEntrar.current)));
    void marcarItensVistos(itensLiberados(progresso));
    // Quem ainda não montou o avatar começa por um sorteio entre os itens livres: nenhum rosto é "o padrão".
    setConfig((c) => c ?? sortearAvatar(progresso));
  }, [progresso, novos, marcarItensVistos]);

  const contraste = useMemo(() => (config && progresso ? avisoDeContraste(config, progresso) : null), [config, progresso]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const atual = GRUPOS.find((g) => g.id === grupo) ?? GRUPOS[0];
  const alterado = useMemo(() => JSON.stringify(config) !== JSON.stringify(normalizarAvatar(perfil.avatar)), [config, perfil.avatar]);

  if (!progresso || !config) return <Carregando />;

  function escolher(cat: Categoria, id: string) {
    const it = CATALOGO[cat].find((i) => i.id === id);
    if (!it || !progresso) return;
    if (!liberado(it, progresso)) {
      setAviso(`${it.nome} ainda não está liberado. ${comoLiberar(it)}.`);
      return;
    }
    setAviso('');
    setConfig((c) => (c ? { ...c, [cat]: id } : c));
  }

  async function salvar() {
    if (!config || !progresso) return;
    setSalvando(true);
    await salvarAvatar(restringirAoLiberado(config, progresso));
    window.scrollTo(0, 0);
    nav(primeiroAcesso ? '/' : '/perfil', { replace: true });
  }

  const semMudanca = salvando || (!alterado && !!perfil.avatar);

  return (
    <div className="pilha">
      <div className="linha entre">
        <h1 style={{ margin: 0 }}>Seu avatar</h1>
        <Link to={primeiroAcesso ? '/' : '/perfil'} className="btn fantasma pequeno">
          {primeiroAcesso ? 'Pular por agora' : 'Voltar'}
        </Link>
      </div>

      <div className="editor-avatar">
        <div className="previa card">
          <Avatar config={config} nome={perfil.nome} tamanho={176} />
          <div className="como-aparece" aria-hidden="true">
            <Avatar config={config} tamanho={32} decorativo />
            <span>{perfil.nome}</span>
            <span className="muted pequeno">no ranking</span>
          </div>
          <div className="linha" style={{ width: '100%' }}>
            <button
              type="button"
              className="btn"
              style={{ flex: 1 }}
              onClick={() => {
                setAviso('');
                // mantém o que representa a pessoa (pele, óculos, cobertura de cabeça, apoio) e sorteia o resto
                setConfig((c) => sortearAvatar(progresso, Math.random, c));
              }}
            >
              Sortear
            </button>
            <button type="button" className="btn primario salvar-largo" style={{ flex: 1 }} disabled={semMudanca} onClick={() => void salvar()}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
          <p className="muted pequeno centro" style={{ margin: 0 }}>
            O avatar aparece no seu perfil, no ranking (que é público) e nos duelos. Novos itens são liberados por nível e por conquistas.
          </p>
        </div>

        <div className="pilha">
          <div className="abas" role="tablist" aria-label="Partes do avatar">
            {GRUPOS.map((g) => {
              const temNovo = !!novos && g.categorias.some((cat) => CATALOGO[cat].some((it) => novos.has(chaveItem(cat, it.id))));
              return (
                <button key={g.id} type="button" role="tab" id={`aba-${g.id}`} aria-selected={g.id === grupo} aria-controls="painel-avatar" className={g.id === grupo ? 'ativa' : ''} onClick={() => setGrupo(g.id)}>
                  {g.nome}
                  {temNovo && <span className="ponto-novo" role="img" aria-label="itens novos" />}
                </button>
              );
            })}
          </div>

          <div role="status" aria-live="polite" className="pilha" style={{ gap: 8 }}>
            {aviso && (
              <p className="aviso info" style={{ margin: 0 }}>
                {aviso}
              </p>
            )}
            {contraste && (
              <div className="aviso info linha entre quebra">
                <span>Neste fundo, {contraste.parte} pode se confundir com a cor de trás.</span>
                <button type="button" className="btn pequeno" onClick={() => setConfig((c) => (c ? { ...c, fundo: contraste.fundo } : c))}>
                  Usar fundo com mais contraste
                </button>
              </div>
            )}
          </div>

          <div id="painel-avatar" role="tabpanel" aria-labelledby={`aba-${atual.id}`} className="pilha">
            {atual.categorias
              .filter((cat) => cat !== 'corCabeca' || config.cabeca !== 'nenhum')
              .map((cat) => (
              <section key={cat} className="pilha" style={{ gap: 8 }} aria-labelledby={`cat-${cat}`}>
                <h2 id={`cat-${cat}`} style={{ margin: 0, fontSize: '1rem' }}>
                  {NOMES_CATEGORIA[cat]}
                </h2>
                {NOTAS[cat] && (
                  <p className="muted pequeno" style={{ margin: 0 }}>
                    {NOTAS[cat]}
                  </p>
                )}
                {(cat === 'cabelo' || cat === 'corCabelo') && (config.paramento === 'touca' || (config.cabeca !== 'nenhum' && !COBERTURAS[config.cabeca]?.mantemCabelo)) && (
                  <p className="muted pequeno" style={{ margin: 0 }}>
                    {config.paramento === 'touca' ? 'A touca cirúrgica esconde o cabelo.' : 'A cobertura de cabeça escolhida esconde o cabelo.'} As amostras abaixo mostram o cabelo sem ela.
                  </p>
                )}
                {cat === 'paramento' && COBERTURAS[config.cabeca]?.semCapelo && (
                  <p className="muted pequeno" style={{ margin: 0 }}>
                    O capelo não assenta sobre o turbante nem sobre o dastar. A mesma conquista libera o Canudo, em Acessório.
                  </p>
                )}
                <div className="avatar-itens" role="group" aria-labelledby={`cat-${cat}`}>
                  {CATALOGO[cat].map((it) => {
                    const bloqueado = !liberado(it, progresso);
                    const selecionado = config[cat] === it.id;
                    const regra = comoLiberar(it);
                    // Nas amostras de cabelo, a cobertura e a touca saem para a forma do cabelo aparecer.
                    const amostra: AvatarConfig = { ...config, [cat]: it.id, ...(cat === 'cabelo' || cat === 'corCabelo' ? { cabeca: 'nenhum', paramento: config.paramento === 'touca' ? 'nenhum' : config.paramento } : {}) };
                    return (
                      <button
                        key={it.id}
                        type="button"
                        className={`avatar-item${bloqueado ? ' bloqueado' : ''}`}
                        aria-pressed={selecionado}
                        aria-disabled={bloqueado}
                        onClick={() => escolher(cat, it.id)}
                      >
                        {selecionado && <Marcado />}
                        {novos?.has(chaveItem(cat, it.id)) && <span className="selo novo">Novo</span>}
                        <Avatar config={amostra} tamanho={64} decorativo />
                        <span className="nome">
                          {it.nome}
                          {cat === 'pele' && <span className="so-leitor"> de {CATALOGO.pele.length}</span>}
                        </span>
                        {bloqueado && regra && (
                          <span className="regra">
                            <Icone nome="cadeado" tamanho={12} />
                            <span>
                              <span className="so-leitor">Bloqueado. </span>
                              {regra}
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* No celular, a prévia sai da tela ao rolar: a barra mantém o avatar e o botão de salvar à vista. */}
      <div className="barra-salvar">
        <Avatar config={config} tamanho={44} decorativo />
        <button type="button" className="btn primario" disabled={semMudanca} onClick={() => void salvar()}>
          {salvando ? 'Salvando…' : alterado || !perfil.avatar ? 'Salvar avatar' : 'Avatar salvo'}
        </button>
      </div>
    </div>
  );
}
