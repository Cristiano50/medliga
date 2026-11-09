// Painel do professor (plano institucional): desempenho agregado da turma por tópico.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { obterBackend, type LinhaPainel } from '../data/backend.ts';
import { carregarEscolas, topico } from '../content/index.ts';
import type { Escola } from '../content/schema.ts';
import { useApp } from '../data/store.ts';
import { Barra } from '../ui/comum.tsx';
import { Carregando } from '../ui/Carregando.tsx';

export function PainelTela() {
  const modoBackend = useApp((s) => s.modoBackend);
  const [escolas, setEscolas] = useState<{ escolaId: string; licencaAtiva: boolean }[] | null>(null);
  const [escolaId, setEscolaId] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<LinhaPainel[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [cadastro, setCadastro] = useState<Map<string, Escola>>(new Map());

  useEffect(() => {
    void carregarEscolas().then((l) => setCadastro(new Map(l.map((e) => [e.id, e]))));
    void obterBackend()
      .then((b) => b.escolasProfessor())
      .then((l) => {
        setEscolas(l);
        if (l[0]) setEscolaId(l[0].escolaId);
      });
  }, []);

  useEffect(() => {
    if (!escolaId) return;
    setLinhas(null);
    setErro(null);
    void obterBackend()
      .then((b) => b.painelEscola(escolaId))
      .then(setLinhas)
      .catch((e: Error) => setErro(e.message.includes('licença') ? 'A licença institucional desta escola não está ativa.' : 'Não foi possível carregar o painel.'));
  }, [escolaId]);

  const ordenadas = useMemo(() => (linhas ?? []).slice().sort((a, b) => a.acerto - b.acerto), [linhas]);
  const reforcar = ordenadas.filter((l) => l.acerto < 60).slice(0, 3);

  if (escolas === null) return <Carregando />;
  if (escolas.length === 0)
    return (
      <div className="card pilha" style={{ marginTop: 16 }}>
        <h1>Painel do professor</h1>
        <p className="muted">
          Disponível no plano institucional para professores vinculados a uma escola. Mostra o desempenho agregado da turma por tópico, sem identificar alunos.
        </p>
        <Link to="/planos" className="btn">Conhecer o plano para escolas</Link>
      </div>
    );

  return (
    <div className="pilha">
      <header>
        <h1>Painel do professor</h1>
        <p className="muted pequeno" style={{ margin: 0 }}>Últimas 4 semanas · dados agregados (tópicos com menos de 5 alunos ficam ocultos).</p>
      </header>
      {modoBackend === 'demo' && <div className="aviso">Modo demonstração: números fictícios.</div>}
      {escolas.length > 1 && (
        <select className="input" value={escolaId ?? ''} onChange={(e) => setEscolaId(e.target.value)} aria-label="Escola">
          {escolas.map((e) => <option key={e.escolaId} value={e.escolaId}>{cadastro.get(e.escolaId)?.sigla ?? e.escolaId}</option>)}
        </select>
      )}
      {escolaId && <h2 style={{ margin: 0 }}>{cadastro.get(escolaId)?.nome ?? escolaId}</h2>}
      {erro && <div className="aviso">{erro}</div>}
      {!erro && linhas === null && <Carregando texto="Carregando dados da turma…" />}
      {reforcar.length > 0 && (
        <div className="card destaque">
          <strong>Sugestão para a próxima aula</strong>
          <p className="muted pequeno" style={{ margin: '4px 0 0' }}>
            Tópicos com menor taxa de acerto: {reforcar.map((l) => topico(l.topicoId)?.titulo ?? l.topicoId).join(' · ')}.
          </p>
        </div>
      )}
      {linhas && linhas.length === 0 && <div className="aviso info">Ainda não há dados suficientes (mínimo de 5 alunos por tópico).</div>}
      {ordenadas.map((l) => (
        <div key={l.topicoId} className="card pilha" style={{ gap: 6 }}>
          <div className="linha entre">
            <strong>{topico(l.topicoId)?.titulo ?? l.topicoId}</strong>
            <span className="chip-xp" style={{ color: l.acerto < 60 ? 'var(--danger)' : l.acerto < 75 ? 'var(--warning)' : 'var(--success)' }}>
              {l.acerto.toLocaleString('pt-BR')}%
            </span>
          </div>
          <Barra valor={l.acerto / 100} rotulo={`Acerto em ${l.topicoId}`} />
          <span className="muted pequeno">{l.alunos} alunos · {l.respostas} respostas</span>
        </div>
      ))}
    </div>
  );
}
