// Camada de servidor. Três modos:
//  - 'supabase': produção/homologação (variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY definidas);
//  - 'demo': só em desenvolvimento ou com ?demo=1 — ranking FICTÍCIO, sempre sinalizado na tela;
//  - 'offline': sem servidor configurado; o XP fica guardado no aparelho.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PontuacaoAluno, PontuacaoEscola } from '../core/ranking.ts';
import { rankingEscolas } from '../core/ranking.ts';
import { criarRng } from '../core/random.ts';
import type { Perfil, RegistroResposta, RegistroSessao, Reporte } from './db.ts';
import { MARCA } from '../config/marca.ts';
import { topicosDe } from '../content/index.ts';
import type { PlanoId } from '../core/planos.ts';

export type ModoBackend = 'supabase' | 'demo' | 'offline';

export interface UsuarioOnline {
  id: string;
  email: string | null;
}

export interface ResultadoEnvio {
  sessaoId: string;
  xpContabilizado: number;
  recusada?: string;
}

export interface Backend {
  modo: ModoBackend;
  usuarioAtual(): Promise<UsuarioOnline | null>;
  enviarCodigo(email: string): Promise<void>;
  confirmarCodigo(email: string, codigo: string): Promise<UsuarioOnline>;
  sair(): Promise<void>;
  salvarPerfil(p: Perfil): Promise<void>;
  planoAtual(): Promise<PlanoId | null>;
  enviarSessao(s: RegistroSessao, respostas: RegistroResposta[]): Promise<ResultadoEnvio>;
  rankingAlunos(semana: string, escolaId?: string | null): Promise<PontuacaoAluno[]>;
  rankingEscolas(semana: string): Promise<PontuacaoEscola[]>;
  enviarReporte(r: Reporte): Promise<void>;
  /** LGPD: apaga conta e dados no servidor. */
  excluirConta(): Promise<void>;
  /** Plano institucional: escolas em que o usuário é professor. */
  escolasProfessor(): Promise<{ escolaId: string; licencaAtiva: boolean }[]>;
  /** Desempenho agregado da turma por tópico (mínimo de 5 alunos por recorte). */
  painelEscola(escolaId: string, desde?: string): Promise<LinhaPainel[]>;
}

export interface LinhaPainel {
  topicoId: string;
  alunos: number;
  respostas: number;
  acerto: number; // %
}

const env = import.meta.env;

let instancia: Backend | null = null;

export async function obterBackend(): Promise<Backend> {
  if (instancia) return instancia;
  const url = env.VITE_SUPABASE_URL as string | undefined;
  const chave = env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const querDemo = typeof location !== 'undefined' && new URLSearchParams(location.search).has('demo');
  if (url && chave) {
    const { createClient } = await import('@supabase/supabase-js');
    instancia = new BackendSupabase(createClient(url, chave, { auth: { persistSession: true, autoRefreshToken: true } }));
  } else if (env.DEV || querDemo) {
    instancia = new BackendDemo();
  } else {
    instancia = new BackendOffline();
  }
  return instancia;
}

class BackendOffline implements Backend {
  modo: ModoBackend = 'offline';
  async usuarioAtual() {
    return null;
  }
  async enviarCodigo() {
    throw new Error('Servidor não configurado nesta versão.');
  }
  async confirmarCodigo(): Promise<UsuarioOnline> {
    throw new Error('Servidor não configurado nesta versão.');
  }
  async sair() {}
  async salvarPerfil() {}
  async planoAtual() {
    return null;
  }
  async enviarSessao(s: RegistroSessao): Promise<ResultadoEnvio> {
    return { sessaoId: s.id, xpContabilizado: 0, recusada: 'offline' };
  }
  async rankingAlunos() {
    return [];
  }
  async rankingEscolas() {
    return [];
  }
  async enviarReporte() {
    throw new Error('offline');
  }
  async excluirConta() {}
  async escolasProfessor() {
    return [];
  }
  async painelEscola(): Promise<LinhaPainel[]> {
    return [];
  }
}

/** Dados fictícios e determinísticos para desenvolvimento e demonstrações. Nunca usado em produção. */
class BackendDemo implements Backend {
  modo: ModoBackend = 'demo';
  private usuario: UsuarioOnline | null = { id: 'demo-voce', email: 'voce@demo.medliga' };
  private alunos: PontuacaoAluno[];
  private meuXp = 0;
  private minhaEscola: string | null = null;
  private meuNome = 'Você';

  constructor() {
    const rng = criarRng(20261109);
    const escolas = ['escs', 'unb', 'uniceub', 'ucb', 'unicamp', 'ufmg', 'usp', 'unifesp', 'ufrj', 'ufrgs'];
    const nomes = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olívia', 'Pedro', 'Rafaela', 'Samuel', 'Tainá', 'Vitor'];
    const sobrenomes = ['A.', 'B.', 'C.', 'D.', 'F.', 'G.', 'L.', 'M.', 'P.', 'R.', 'S.', 'T.'];
    this.alunos = [];
    let n = 0;
    for (const e of escolas) {
      const membros = 8 + Math.floor(rng() * 30);
      for (let i = 0; i < membros; i++) {
        this.alunos.push({
          usuarioId: `demo-${n++}`,
          nome: `${nomes[Math.floor(rng() * nomes.length)]} ${sobrenomes[Math.floor(rng() * sobrenomes.length)]}`,
          escolaId: e,
          xpSemana: Math.round(Math.pow(rng(), 2.2) * 2400),
        });
      }
    }
  }
  async usuarioAtual() {
    return this.usuario;
  }
  async enviarCodigo() {}
  async confirmarCodigo(email: string) {
    this.usuario = { id: 'demo-voce', email };
    return this.usuario;
  }
  async sair() {
    this.usuario = null;
  }
  async salvarPerfil(p: Perfil) {
    this.minhaEscola = p.escolaId;
    this.meuNome = p.nome || 'Você';
  }
  async planoAtual() {
    return null;
  }
  async enviarSessao(s: RegistroSessao): Promise<ResultadoEnvio> {
    if (s.ranqueada) this.meuXp += s.xp;
    return { sessaoId: s.id, xpContabilizado: s.ranqueada ? s.xp : 0 };
  }
  private todos(): PontuacaoAluno[] {
    return [...this.alunos, { usuarioId: 'demo-voce', nome: this.meuNome, escolaId: this.minhaEscola, xpSemana: this.meuXp }];
  }
  async rankingAlunos(_semana: string, escolaId?: string | null) {
    return this.todos()
      .filter((a) => !escolaId || a.escolaId === escolaId)
      .sort((a, b) => b.xpSemana - a.xpSemana);
  }
  async rankingEscolas() {
    return rankingEscolas(this.todos());
  }
  async enviarReporte() {}
  async excluirConta() {
    this.usuario = null;
  }
  async escolasProfessor() {
    return this.minhaEscola ? [{ escolaId: this.minhaEscola, licencaAtiva: true }] : [];
  }
  async painelEscola(): Promise<LinhaPainel[]> {
    const rng = criarRng(42);
    return topicosDe('embriologia').map((t) => {
      return { topicoId: t.id, alunos: 8 + Math.floor(rng() * 30), respostas: 60 + Math.floor(rng() * 400), acerto: Math.round((45 + rng() * 45) * 10) / 10 };
    });
  }
}

class BackendSupabase implements Backend {
  modo: ModoBackend = 'supabase';
  private sb: SupabaseClient;
  constructor(sb: SupabaseClient) {
    this.sb = sb;
  }

  async usuarioAtual() {
    const { data } = await this.sb.auth.getUser();
    return data.user ? { id: data.user.id, email: data.user.email ?? null } : null;
  }

  async enviarCodigo(email: string) {
    const { error } = await this.sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) throw error;
  }

  async confirmarCodigo(email: string, codigo: string) {
    const { data, error } = await this.sb.auth.verifyOtp({ email, token: codigo, type: 'email' });
    if (error || !data.user) throw error ?? new Error('Código inválido');
    return { id: data.user.id, email: data.user.email ?? null };
  }

  async sair() {
    await this.sb.auth.signOut();
  }

  async salvarPerfil(p: Perfil) {
    const { error } = await this.sb.rpc('salvar_perfil', {
      p_nome: p.nome,
      p_escola_id: p.escolaId,
      p_semestre: p.semestre,
      p_curso: p.curso,
    });
    if (error) throw error;
    if (!p.escolaId && p.escolaSugerida) {
      // Não bloqueia o fluxo: a sugestão vai para moderação; limite de 3 por dia no servidor.
      await this.sb.rpc('sugerir_escola', { p_texto: p.escolaSugerida, p_uf: null });
    }
  }

  async planoAtual(): Promise<PlanoId | null> {
    const { data, error } = await this.sb.rpc('plano_atual');
    if (error) return null;
    return (data as PlanoId) ?? 'gratuito';
  }

  async enviarSessao(s: RegistroSessao, respostas: RegistroResposta[]): Promise<ResultadoEnvio> {
    const { data, error } = await this.sb.rpc('registrar_sessao', {
      p_sessao: {
        id: s.id,
        modo: s.modo,
        disciplina: s.disciplina,
        inicio: new Date(s.inicio).toISOString(),
        fim: new Date(s.fim).toISOString(),
        ranqueada: s.ranqueada,
      },
      p_respostas: respostas.map((r) => ({
        questao_id: r.questaoId,
        topico_id: r.topicoId,
        correta: r.correta,
        tempo_ms: r.tempoMs,
        criado_em: new Date(r.criadoEm).toISOString(),
      })),
    });
    if (error) throw error;
    const d = data as { xp_contabilizado: number; recusada: string | null };
    return { sessaoId: s.id, xpContabilizado: d.xp_contabilizado, recusada: d.recusada ?? undefined };
  }

  async rankingAlunos(semana: string, escolaId?: string | null) {
    const { data, error } = await this.sb.rpc('ranking_alunos', { p_semana: semana, p_escola_id: escolaId ?? null, p_limite: 100 });
    if (error) throw error;
    return (data as { usuario_id: string; nome: string; escola_id: string | null; xp_semana: number }[]).map((r) => ({
      usuarioId: r.usuario_id,
      nome: r.nome,
      escolaId: r.escola_id,
      xpSemana: r.xp_semana,
    }));
  }

  async enviarReporte(r: Reporte) {
    const { error } = await this.sb.rpc('reportar_conteudo', {
      p_id_local: r.id,
      p_questao_id: r.questaoId,
      p_motivo: r.motivo,
      p_texto: r.texto,
      p_versao_app: MARCA.versao,
    });
    if (error) throw error;
  }

  async excluirConta() {
    const { error } = await this.sb.rpc('excluir_minha_conta');
    if (error) throw error;
    await this.sb.auth.signOut();
  }

  async escolasProfessor() {
    const { data, error } = await this.sb.rpc('minhas_escolas_professor');
    if (error) return [];
    return (data as { escola_id: string; licenca_ativa: boolean }[]).map((r) => ({ escolaId: r.escola_id, licencaAtiva: r.licenca_ativa }));
  }

  async painelEscola(escolaId: string, desde?: string): Promise<LinhaPainel[]> {
    const { data, error } = await this.sb.rpc('painel_escola', { p_escola_id: escolaId, ...(desde ? { p_desde: desde } : {}) });
    if (error) throw error;
    return (data as { topico_id: string; alunos: number; respostas: number; acerto: number }[]).map((r) => ({
      topicoId: r.topico_id,
      alunos: r.alunos,
      respostas: r.respostas,
      acerto: Number(r.acerto),
    }));
  }

  async rankingEscolas(semana: string) {
    const { data, error } = await this.sb.rpc('ranking_escolas', { p_semana: semana, p_limite: 100 });
    if (error) throw error;
    return (data as { escola_id: string; pontos: number; contribuintes: number; membros_ativos: number }[]).map((r) => ({
      escolaId: r.escola_id,
      pontos: r.pontos,
      contribuintes: r.contribuintes,
      membrosAtivos: r.membros_ativos,
    }));
  }
}
