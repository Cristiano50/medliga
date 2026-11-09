import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store.ts';
import { buscarEscolas, carregarEscolas } from '../content/index.ts';
import type { Escola } from '../content/schema.ts';
import { Markdown } from '../ui/comum.tsx';
import termosTexto from '../../docs/legal/termos-de-uso.md?raw';
import privacidadeTexto from '../../docs/legal/politica-de-privacidade.md?raw';

export function BoasVindas() {
  const salvarPerfil = useApp((s) => s.salvarPerfil);
  const perfil = useApp((s) => s.perfil);
  const nav = useNavigate();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState(perfil?.nome ?? '');
  const [semestre, setSemestre] = useState<number | null>(perfil?.semestre ?? 1);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [busca, setBusca] = useState('');
  const [escolaId, setEscolaId] = useState<string | null>(perfil?.escolaId ?? null);
  const [aceite, setAceite] = useState(false);
  const [naoAchou, setNaoAchou] = useState(false);
  const [sugestao, setSugestao] = useState(perfil?.escolaSugerida ?? '');
  const [docAberto, setDocAberto] = useState<null | 'termos' | 'privacidade'>(null);

  useEffect(() => {
    void carregarEscolas().then(setEscolas);
  }, []);
  const resultados = useMemo(() => buscarEscolas(escolas, busca, 40), [escolas, busca]);
  const escolhida = escolas.find((e) => e.id === escolaId);

  async function concluir() {
    await salvarPerfil({
      nome: nome.trim(),
      semestre,
      escolaId,
      escolaSugerida: !escolaId && sugestao.trim().length >= 3 ? sugestao.trim() : null,
      aceitouTermosEm: Date.now(),
    });
    nav('/', { replace: true });
  }

  return (
    <div className="app sem-nav">
      <main className="conteudo" style={{ maxWidth: 560 }}>
        <div className="centro" style={{ margin: '24px 0' }}>
          <img src="./icons/icon.svg" alt="" width={72} height={72} />
          <h1 style={{ marginTop: 12 }}>MedLiga</h1>
          <p className="muted">Estude medicina jogando. Some pontos para você e para a sua escola.</p>
        </div>

        {passo === 0 && (
          <div className="card pilha">
            <div className="campo">
              <label htmlFor="nome">Como quer aparecer no ranking?</label>
              <input id="nome" className="input" value={nome} maxLength={40} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Ana S." autoComplete="nickname" />
              <span className="muted pequeno">Use um apelido se preferir. Não use dados de pacientes ou de terceiros.</span>
            </div>
            <div className="campo">
              <label htmlFor="sem">Semestre atual</label>
              <select id="sem" className="input" value={semestre ?? ''} onChange={(e) => setSemestre(e.target.value ? Number(e.target.value) : null)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}º semestre</option>
                ))}
                <option value="">Já me formei / outro</option>
              </select>
            </div>
            <button className="btn primario bloco" disabled={nome.trim().length < 2} onClick={() => setPasso(1)}>
              Continuar
            </button>
          </div>
        )}

        {passo === 1 && (
          <div className="card pilha">
            <div className="campo">
              <label htmlFor="busca">Sua escola de medicina</label>
              <input id="busca" className="input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Busque por sigla, nome ou cidade (ex.: ESCS, UnB, Unicamp)" autoFocus />
            </div>
            <div className="lista-opcoes" style={{ maxHeight: 340, overflowY: 'auto' }} role="listbox" aria-label="Escolas">
              {resultados.map((e) => (
                <button key={e.id} role="option" aria-selected={escolaId === e.id} className={`opcao ${escolaId === e.id ? 'selecionada' : ''}`} onClick={() => setEscolaId(e.id)}>
                  <span className="letra" style={{ width: 'auto', padding: '0 6px', minWidth: 28 }}>{e.uf}</span>
                  <span>
                    <strong>{e.sigla}</strong> — {e.nome}
                    <br />
                    <span className="muted pequeno">{e.cidade}</span>
                  </span>
                </button>
              ))}
              {escolas.length > 0 && resultados.length === 0 && <p className="muted">Nenhuma escola encontrada com esse termo.</p>}
            </div>
            {!naoAchou ? (
              <button className="btn fantasma pequeno" onClick={() => { setNaoAchou(true); setEscolaId(null); }}>
                Minha escola não está na lista
              </button>
            ) : (
              <div className="campo">
                <label htmlFor="sug">Nome da escola, cidade e UF</label>
                <input id="sug" className="input" value={sugestao} maxLength={160} onChange={(e) => setSugestao(e.target.value)} placeholder="Ex.: Faculdade X de Medicina — Cidade/UF" />
                <span className="muted pequeno">Vamos conferir e incluir no cadastro. Até lá, você joga sem escola e seus pontos individuais contam normalmente.</span>
              </div>
            )}
            <p className="muted pequeno">
              Sua escola forma um time: há disputa interna entre colegas e, no ranking geral, a escola soma os pontos dos seus 20 melhores alunos da semana.
            </p>
            <div className="linha">
              <button className="btn fantasma" onClick={() => setPasso(0)}>Voltar</button>
              <button className="btn fantasma" onClick={() => { setEscolaId(null); setPasso(2); }}>Pular por agora</button>
              <span className="espaco" style={{ flex: 1 }} />
              <button className="btn primario" disabled={!escolaId && sugestao.trim().length < 3} onClick={() => setPasso(2)}>Continuar</button>
            </div>
          </div>
        )}

        {passo === 2 && (
          <div className="card pilha">
            <h2>Antes de começar</h2>
            <p className="muted">
              {escolhida ? <>Você vai jogar por <strong style={{ color: 'var(--text)' }}>{escolhida.sigla}</strong>. </> : null}
              O conteúdo é escrito com base nos livros-texto de referência e auditado por agentes de IA especializados por área; itens ainda sem conferência de um médico aparecem com o selo correspondente.
            </p>
            <div className="aviso info">
              O MedLiga é uma ferramenta de estudo. Não substitui aulas, livros-texto nem orientação profissional, e não deve ser usado para decisões clínicas.
            </div>
            <label className="linha" style={{ alignItems: 'flex-start' }}>
              <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} style={{ width: 22, height: 22, marginTop: 2 }} />
              <span className="pequeno">
                Li e aceito os termos de uso e a política de privacidade (LGPD). Seus dados de jogo ficam no aparelho; só são enviados ao servidor se você criar uma conta para o ranking.
              </span>
            </label>
            <div className="linha quebra">
              <button className="btn fantasma pequeno" onClick={() => setDocAberto(docAberto === 'termos' ? null : 'termos')} aria-expanded={docAberto === 'termos'}>
                Termos de uso
              </button>
              <button className="btn fantasma pequeno" onClick={() => setDocAberto(docAberto === 'privacidade' ? null : 'privacidade')} aria-expanded={docAberto === 'privacidade'}>
                Política de privacidade
              </button>
            </div>
            {docAberto && (
              <div className="card" style={{ maxHeight: 320, overflowY: 'auto', background: 'var(--bg-elev)' }}>
                <Markdown texto={docAberto === 'termos' ? termosTexto : privacidadeTexto} />
              </div>
            )}
            <div className="linha">
              <button className="btn fantasma" onClick={() => setPasso(1)}>Voltar</button>
              <span style={{ flex: 1 }} />
              <button className="btn primario" disabled={!aceite} onClick={concluir}>Começar a jogar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
