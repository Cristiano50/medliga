// Carregamento do conteúdo empacotado no build (funciona offline).
// A validação completa acontece antes do build (scripts/validar-conteudo.ts); aqui só tipamos e indexamos.
import type { Topico, Estagio, DerivadosArquivo, Escola, Estrutura, Lamina } from './schema.ts';
import estagiosJson from '../../content/embriologia/estagios.json';
import derivadosJson from '../../content/embriologia/derivados.json';
import laminasJson from '../../content/histologia/laminas.json';

// Cada tópico vira um arquivo separado no build e só é baixado quando a disciplina é aberta
// (com o service worker, fica em cache para uso offline). Assim o app não cresce a cada disciplina nova.
const carregadores = import.meta.glob('../../content/*/topicos/*.json', { import: 'default' }) as Record<string, () => Promise<Topico>>;

const PORDISCIPLINA = new Map<string, Topico[]>();
const POR_ID = new Map<string, Topico>();
const emCarga = new Map<string, Promise<Topico[]>>();
let estruturasCache: Map<string, Estrutura & { topicoId?: string }> | null = null;

export function carregarDisciplina(disciplina: string): Promise<Topico[]> {
  const pronto = PORDISCIPLINA.get(disciplina);
  if (pronto) return Promise.resolve(pronto);
  let p = emCarga.get(disciplina);
  if (!p) {
    const entradas = Object.entries(carregadores).filter(([caminho]) => caminho.includes(`/content/${disciplina}/topicos/`));
    p = Promise.all(entradas.map(([, f]) => f())).then((ts) => {
      const ordenados = ts.slice().sort((a, b) => a.ordem - b.ordem);
      PORDISCIPLINA.set(disciplina, ordenados);
      for (const t of ordenados) POR_ID.set(t.id, t);
      estruturasCache = null;
      return ordenados;
    });
    emCarga.set(disciplina, p);
  }
  return p;
}

/** Tópicos de uma disciplina já carregada (chame carregarDisciplina antes; o App pré-carrega a embriologia). */
export function topicosDe(disciplina: string): Topico[] {
  return PORDISCIPLINA.get(disciplina) ?? [];
}

export function topico(id: string): Topico | undefined {
  return POR_ID.get(id);
}

export const ESTAGIOS: Estagio[] = (estagiosJson as unknown as { estagios: (Omit<Estagio, 'grupo'> & { grupo?: Estagio['grupo'] })[] }).estagios
  .map((e) => ({ ...e, grupo: e.grupo ?? 'desenvolvimento' }))
  .sort((a, b) => a.ordem - b.ordem);
export const DERIVADOS = derivadosJson as DerivadosArquivo;
export const LAMINAS: Lamina[] = (laminasJson as { laminas: Lamina[] }).laminas.slice().sort((a, b) => a.ordem - b.ordem);

/** Registro de estruturas: primeiro as definições dos tópicos carregados, complementadas pelas dos estágios 3D. */
export function estruturas(): Map<string, Estrutura & { topicoId?: string }> {
  if (estruturasCache) return estruturasCache;
  const m = new Map<string, Estrutura & { topicoId?: string }>();
  for (const t of POR_ID.values()) for (const e of t.estruturas) if (!m.has(e.id)) m.set(e.id, { ...e, topicoId: t.id });
  for (const s of ESTAGIOS)
    for (const e of s.estruturas)
      if (!m.has(e.id)) m.set(e.id, { id: e.id, nome: e.nome, sinonimos: [], definicao: e.descricao });
  estruturasCache = m;
  return m;
}

let escolasCache: Escola[] | null = null;
/** Lista de escolas é carregada sob demanda (arquivo maior; só usado no cadastro e no ranking). */
export async function carregarEscolas(): Promise<Escola[]> {
  if (escolasCache) return escolasCache;
  const mod = (await import('../../content/escolas/escolas-medicas-br.json')) as { default: { escolas: Escola[] } };
  escolasCache = mod.default.escolas;
  return escolasCache;
}

export function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function buscarEscolas(lista: Escola[], termo: string, limite = 30): Escola[] {
  const t = normalizar(termo.trim());
  if (!t) return lista.slice(0, limite);
  const pontuar = (e: Escola) => {
    const sigla = normalizar(e.sigla);
    const nome = normalizar(e.nome);
    const cidade = normalizar(e.cidade);
    if (sigla === t) return 0;
    if (sigla.startsWith(t)) return 1;
    if (nome.split(/\s+/).some((p) => p.startsWith(t))) return 2;
    if (nome.includes(t) || cidade.includes(t)) return 3;
    return 9;
  };
  return lista
    .map((e) => [pontuar(e), e] as const)
    .filter(([p]) => p < 9)
    .sort((a, b) => a[0] - b[0] || a[1].sigla.localeCompare(b[1].sigla))
    .slice(0, limite)
    .map(([, e]) => e);
}
