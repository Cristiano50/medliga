// Fila de reportes da equipe de conteúdo (v0.2): ver o que os alunos reportaram, com a questão ao lado, e registrar
// a situação. Corrigir o conteúdo continua sendo no repositório, com a revisão em etapas; nada aqui marca conteúdo
// como conferido por médico.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { obterBackend } from '../data/backend.ts';
import { useApp } from '../data/store.ts';
import { topicosDe } from '../content/index.ts';
import { DISCIPLINAS_DISPONIVEIS } from '../content/disciplinas.ts';
import type { Questao, Topico } from '../content/schema.ts';
import { LIMITE_NOTA, STATUS_REPORTE, rotuloMotivo, type ReporteFila, type StatusReporte } from '../core/reportes.ts';
import { Carregando } from '../ui/Carregando.tsx';
import { EstadoVazio } from '../ui/Cena.tsx';
import { Icone } from '../ui/Icone.tsx';

const dataCurta = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const VAZIO: Record<StatusReporte, string> = {
  aberto: 'Nenhum reporte aberto. Quando um aluno reportar um erro, ele aparece aqui.',
  procedente: 'Nenhum reporte marcado como procedente.',
  improcedente: 'Nenhum reporte marcado como improcedente.',
  corrigido: 'Nenhum reporte marcado como corrigido.',
};

export function EquipeTela() {
  const modoBackend = useApp((s) => s.modoBackend);
  const [equipe, setEquipe] = useState<boolean | null>(null);
  const [aba, setAba] = useState<StatusReporte>('aberto');
  const [lista, setLista] = useState<ReporteFila[] | null>(null);
  const [contagem, setContagem] = useState<Record<StatusReporte, number> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const questoes = useMemo(() => {
    const m = new Map<string, { q: Questao; t: Topico }>();
    for (const d of DISCIPLINAS_DISPONIVEIS) for (const t of topicosDe(d)) for (const q of t.questoes) m.set(q.id, { q, t });
    return m;
  }, []);

  useEffect(() => {
    void obterBackend()
      .then((b) => b.souEquipe())
      .then(setEquipe)
      .catch(() => setEquipe(false));
  }, []);

  const carregar = useCallback(async (status: StatusReporte) => {
    setErro(null);
    try {
      const b = await obterBackend();
      const [l, c] = await Promise.all([b.filaReportes(status), b.contagemReportes()]);
      setLista(l);
      setContagem(c);
    } catch {
      setErro('Não foi possível carregar a fila. Verifique a conexão e tente de novo.');
    }
  }, []);

  useEffect(() => {
    if (!equipe) return;
    setLista(null);
    void carregar(aba);
  }, [equipe, aba, carregar]);

  const tratar = async (r: ReporteFila, status: StatusReporte, nota: string, mesmaQuestao: boolean) => {
    setAviso(null);
    try {
      const n = await (await obterBackend()).tratarReporte(r.id, status, nota, mesmaQuestao);
      const rotulo = STATUS_REPORTE.find((s) => s.id === status)!.rotulo.toLowerCase();
      setAviso(status === 'aberto' ? 'Reporte reaberto.' : n > 1 ? `${n} reportes da questão ${r.questaoId} movidos para ${rotulo}.` : `Reporte movido para ${rotulo}.`);
      await carregar(aba);
    } catch {
      setAviso('Não foi possível salvar. Verifique a conexão e tente de novo.');
    }
  };

  if (equipe === null) return <Carregando />;
  if (!equipe)
    return (
      <div className="pilha" style={{ marginTop: 16 }}>
        <h1>Fila de reportes</h1>
        <EstadoVazio icone="cadeado" titulo="Acesso da equipe de conteúdo">
          <p className="muted" style={{ margin: 0 }}>
            {modoBackend === 'offline'
              ? 'A fila de reportes precisa do servidor, disponível quando as contas online forem ativadas.'
              : 'Esta tela é só para quem revisa o conteúdo do jogo. Se você encontrou um erro numa questão, use "Reportar erro" na própria questão.'}
          </p>
          <Link to="/perfil" className="btn">Voltar ao perfil</Link>
        </EstadoVazio>
      </div>
    );

  return (
    <div className="pilha">
      <header className="pilha" style={{ gap: 4 }}>
        <Link to="/perfil" className="link-voltar muted pequeno"><Icone nome="seta-esquerda" /> Perfil</Link>
        <h1 style={{ margin: 0 }}>Fila de reportes</h1>
        <p className="muted pequeno" style={{ margin: 0 }}>
          O que os alunos reportaram nas questões, sem identificar quem reportou. Aqui só se registra a situação do reporte: a correção do conteúdo é feita no
          repositório, com a revisão em etapas, e nada nesta tela marca conteúdo como conferido por médico.
        </p>
      </header>

      {modoBackend === 'demo' && (
        <p className="aviso info" style={{ margin: 0 }}>
          Modo de demonstração: os reportes são fictícios, sobre questões reais, e as mudanças valem só até fechar o app.
        </p>
      )}

      <div className="abas abas-grade" role="tablist" aria-label="Situação dos reportes">
        {STATUS_REPORTE.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`aba-${s.id}`}
            aria-selected={s.id === aba}
            aria-controls="painel-reportes"
            className={s.id === aba ? 'ativa' : ''}
            onClick={() => {
              setAviso(null);
              setAba(s.id);
            }}
          >
            {s.rotulo}
            {contagem && <span className="contador">{contagem[s.id]}</span>}
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite">
        {aviso && <p className="aviso info" style={{ margin: 0 }}>{aviso}</p>}
      </div>

      <div id="painel-reportes" role="tabpanel" aria-labelledby={`aba-${aba}`} className="pilha">
        {erro ? (
          <div className="card pilha">
            <p style={{ margin: 0 }}>{erro}</p>
            <button type="button" className="btn" onClick={() => void carregar(aba)}>Tentar de novo</button>
          </div>
        ) : lista === null ? (
          <Carregando />
        ) : lista.length === 0 ? (
          <EstadoVazio icone="visto" titulo="Nada por aqui">
            <p className="muted" style={{ margin: 0 }}>{VAZIO[aba]}</p>
          </EstadoVazio>
        ) : (
          lista.map((r) => <CartaoReporte key={r.id} r={r} conteudo={questoes.get(r.questaoId)} aoTratar={tratar} />)
        )}
      </div>
    </div>
  );
}

function CartaoReporte({
  r,
  conteudo,
  aoTratar,
}: {
  r: ReporteFila;
  conteudo?: { q: Questao; t: Topico };
  aoTratar: (r: ReporteFila, status: StatusReporte, nota: string, mesmaQuestao: boolean) => Promise<void>;
}) {
  const [nota, setNota] = useState('');
  const [todos, setTodos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const idTitulo = `reporte-${r.id}`;
  const acoes = STATUS_REPORTE.filter((s) => s.id !== r.status && (r.status !== 'aberto' || s.id !== 'aberto'));
  const agir = async (s: StatusReporte) => {
    setSalvando(true);
    await aoTratar(r, s, nota, todos && r.status === 'aberto');
    setSalvando(false);
  };

  return (
    <article className="card pilha reporte" aria-labelledby={idTitulo}>
      <header className="pilha" style={{ gap: 2 }}>
        <h2 id={idTitulo} className="h3" style={{ margin: 0 }}>{rotuloMotivo(r.motivo)}</h2>
        <p className="muted pequeno" style={{ margin: 0 }}>
          Questão <code>{r.questaoId}</code>
          {conteudo ? ` · ${conteudo.t.titulo}` : ' · não encontrada nesta versão do app'}
          {' · '}
          {dataCurta(r.criadoEm)}
          {r.versaoApp ? ` · app ${r.versaoApp}` : ''}
        </p>
        {r.reportesDaQuestao > 1 && (
          <p className="pequeno" style={{ margin: 0 }}>
            <strong>{r.reportesDaQuestao} reportes</strong> nesta questão
          </p>
        )}
      </header>

      {r.texto ? <blockquote className="citacao-reporte">{r.texto}</blockquote> : <p className="muted pequeno" style={{ margin: 0 }}>Sem comentário do aluno.</p>}

      {conteudo && (
        <details>
          <summary>Ver a questão</summary>
          <QuestaoResumo q={conteudo.q} />
        </details>
      )}

      {r.nota && (
        <p className="pequeno" style={{ margin: 0 }}>
          <strong>Nota da equipe:</strong> {r.nota}
        </p>
      )}
      {r.tratadoEm && <p className="muted pequeno" style={{ margin: 0 }}>Tratado em {dataCurta(r.tratadoEm)}.</p>}

      <label className="pilha" style={{ gap: 4 }}>
        <span className="pequeno">{r.nota ? 'Nova nota (substitui a anterior)' : 'Nota da equipe (opcional)'}</span>
        <textarea value={nota} maxLength={LIMITE_NOTA} rows={2} onChange={(e) => setNota(e.target.value)} placeholder="Ex.: gabarito conferido no Moore, cap. 4; enunciado reescrito na versão seguinte." />
      </label>
      {r.status === 'aberto' && r.reportesDaQuestao > 1 && (
        <label className="linha pequeno" style={{ gap: 8 }}>
          <input type="checkbox" checked={todos} onChange={(e) => setTodos(e.target.checked)} />
          Aplicar aos {r.reportesDaQuestao} reportes abertos desta questão
        </label>
      )}
      <div className="linha quebra" style={{ gap: 8 }}>
        {acoes.map((s) => (
          <button key={s.id} type="button" className="btn pequeno" disabled={salvando} onClick={() => void agir(s.id)}>
            {s.acao}
          </button>
        ))}
      </div>
    </article>
  );
}

function QuestaoResumo({ q }: { q: Questao }) {
  return (
    <div className="pilha questao-resumo" style={{ gap: 8, marginTop: 8 }}>
      {'contexto' in q && q.contexto && <p className="muted" style={{ margin: 0 }}>{q.contexto}</p>}
      <p style={{ margin: 0 }}><strong>{q.enunciado}</strong></p>
      {q.tipo === 'multipla' && (
        <ul className="lista-resumo">
          {q.alternativas.map((a) => (
            <li key={a.id} className={a.id === q.correta ? 'certa' : undefined}>
              {a.id.toUpperCase()}) {a.texto}
              {a.id === q.correta && <strong> · gabarito</strong>}
            </li>
          ))}
        </ul>
      )}
      {q.tipo === 'vf' && <p style={{ margin: 0 }}>Gabarito: <strong>{q.correta ? 'Verdadeiro' : 'Falso'}</strong></p>}
      {q.tipo === 'ordenar' && (
        <ol className="lista-resumo">
          {q.ordemCorreta.map((id) => (
            <li key={id}>{q.itens.find((i) => i.id === id)?.texto}</li>
          ))}
        </ol>
      )}
      {q.tipo === 'associar' && (
        <ul className="lista-resumo">
          {q.pares.map((p) => (
            <li key={p.esquerda}>{p.esquerda} → {p.direita}</li>
          ))}
        </ul>
      )}
      <p className="pequeno" style={{ margin: 0 }}><strong>Explicação:</strong> {q.explicacao}</p>
      {q.referencia && <p className="muted pequeno" style={{ margin: 0 }}>Referência: {q.referencia}</p>}
    </div>
  );
}

export default EquipeTela;
