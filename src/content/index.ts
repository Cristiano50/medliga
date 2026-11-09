// Carregamento do conteúdo empacotado no build (funciona offline).
// A validação completa acontece antes do build (scripts/validar-conteudo.ts); aqui só tipamos e indexamos.
import type { Topico, Estagio, DerivadosArquivo, Escola, Estrutura } from './schema.ts';
import estagiosJson from '../../content/embriologia/estagios.json';
import derivadosJson from '../../content/embriologia/derivados.json';

const modulosTopicos = import.meta.glob('../../content/*/topicos/*.json', { eager: true, import: 'default' });

const TOPICOS: Topico[] = Object.values(modulosTopicos as Record<string, Topico>).sort(
  (a, b) => a.disciplina.localeCompare(b.disciplina) || a.ordem - b.ordem,
);

const POR_ID = new Map(TOPICOS.map((t) => [t.id, t]));

export function topicosDe(disciplina: string): Topico[] {
  return TOPICOS.filter((t) => t.disciplina === disciplina);
}

export function topico(id: string): Topico | undefined {
  return POR_ID.get(id);
}

export function todosTopicos(): Topico[] {
  return TOPICOS;
}

export const ESTAGIOS: Estagio[] = (estagiosJson as { estagios: Estagio[] }).estagios.slice().sort((a, b) => a.ordem - b.ordem);
export const DERIVADOS = derivadosJson as DerivadosArquivo;

/** Registro de estruturas: primeiro as definições dos tópicos, complementadas pelas dos estágios 3D. */
export const ESTRUTURAS: Map<string, Estrutura & { topicoId?: string }> = (() => {
  const m = new Map<string, Estrutura & { topicoId?: string }>();
  for (const t of TOPICOS) for (const e of t.estruturas) if (!m.has(e.id)) m.set(e.id, { ...e, topicoId: t.id });
  for (const s of ESTAGIOS)
    for (const e of s.estruturas)
      if (!m.has(e.id)) m.set(e.id, { id: e.id, nome: e.nome, sinonimos: [], definicao: e.descricao });
  return m;
})();

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
