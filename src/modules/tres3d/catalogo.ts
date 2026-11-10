// Catálogo dos laboratórios 3D por disciplina: itens (textos do conteúdo), registro de modelos, perfil de
// iluminação, nomes das estruturas e sorteio dos alvos do jogo "Identifique no 3D".
//   embriologia = ESTAGIOS (content/embriologia/estagios.json) + MODELOS (embriologia/modelos)
//   histologia  = MODELOS_HISTOLOGIA_3D (content/histologia/modelos3d-*.json) + MODELOS_HISTOLOGIA
import type { Revisao } from '../../content/schema.ts';
import { ESTAGIOS, MODELOS_HISTOLOGIA_3D, estruturas, topico } from '../../content/index.ts';
import { embaralhar } from '../../core/random.ts';
import { MODELOS, type ModeloEstagio } from '../embriologia/modelos/index.ts';
import { nomesDoEstagio } from '../embriologia/Lab3D.tsx';
import { MODELOS_HISTOLOGIA } from '../histologia/modelos3d/index.ts';
import { PERFIS, type Perfil3D, type TipoPerfil } from './perfis.ts';

export type Disciplina3D = 'embriologia' | 'histologia';

export interface Estrutura3D {
  id: string;
  nome: string;
  descricao: string;
}

export interface Item3D {
  id: string;
  titulo: string;
  /** linha curta junto do título (embriologia: dias; histologia: aviso de escala) */
  subtitulo: string;
  descricao: string;
  destaques: string[];
  topicos: string[];
  estruturas: Estrutura3D[];
  revisao: Revisao;
  /** histologia: aviso de escala, sempre exibido junto do modelo */
  escala?: string;
  /** histologia: avisos de interpretação (o que o esquema simplifica) */
  contexto?: string[];
}

export interface Catalogo3D {
  disciplina: Disciplina3D;
  nome: string;
  /** parâmetro da URL que escolhe o item */
  parametro: 'estagio' | 'modelo';
  /** como o jogo chama um item ("estágio", "modelo") */
  rotuloItem: string;
  rotaLab: string;
  rotaJogo: string;
  itens: Item3D[];
  modelos: Record<string, ModeloEstagio>;
  /** o Cena3D recebe o modelo por prop (fora do registro da embriologia) */
  modeloExplicito: boolean;
  /** perfil de iluminação; undefined = padrão do Cena3D pelo id */
  perfil: (id: string) => Perfil3D | undefined;
  /** nomes exibidos de todas as partes do modelo */
  nomes: (id: string) => Record<string, string>;
  /** aviso de interpretação exibido acima do modelo */
  avisos: (item: Item3D) => { titulo: string; linhas: string[] };
}

// ------------------------------------------------------------------------------------- embriologia
const ITENS_EMBRIOLOGIA: Item3D[] = ESTAGIOS.map((e) => ({
  id: e.id,
  titulo: e.titulo,
  subtitulo: e.dias,
  descricao: e.descricao,
  destaques: e.destaques,
  topicos: e.topicos,
  estruturas: e.estruturas.map((s) => ({ id: s.id, nome: s.nome, descricao: s.descricao })),
  revisao: e.revisao,
}));

/** Mesmos avisos do Lab3D da embriologia (ver Lab3D.tsx). */
function avisosEmbriologia(item: Item3D) {
  const linhas = ['Idades de desenvolvimento após a fertilização; a idade gestacional obstétrica é aproximadamente duas semanas maior.'];
  linhas.push(
    item.id === 'gastrulacao'
      ? 'Vista explodida: camadas afastadas para estudo. As membranas não são colunas de tecido.'
      : ['implantacao', 'disco-bilaminar', 'neurulacao', 'placenta-membranas', 'septacao-cardiaca'].includes(item.id)
        ? 'Modelo em corte: superfícies abertas revelam estruturas internas.'
        : 'Formas, proporções e cores simplificadas para identificação.',
  );
  if (item.id.startsWith('coracao-') || ['septacao-cardiaca', 'arcos-aorticos', 'circulacao-fetal'].includes(item.id))
    linhas.push('Cores identificam estruturas; não representam oxigenação. Conexões são esquemáticas, não uma simulação de fluxo em um dia exato.');
  return { titulo: 'Esquema didático · sem escala comparável entre modelos', linhas };
}

export const CATALOGO_EMBRIOLOGIA: Catalogo3D = {
  disciplina: 'embriologia',
  nome: 'Embriologia',
  parametro: 'estagio',
  rotuloItem: 'estágio',
  rotaLab: '/lab3d',
  rotaJogo: '/jogar/identifique',
  itens: ITENS_EMBRIOLOGIA,
  modelos: MODELOS,
  modeloExplicito: false,
  perfil: () => undefined,
  nomes: nomesDoEstagio,
  avisos: avisosEmbriologia,
};

// -------------------------------------------------------------------------------------- histologia
/** Perfil de iluminação de cada modelo da histologia (perfis.ts). Modelos sem entrada usam 'esquema'. */
export const PERFIL_HISTOLOGIA: Record<string, TipoPerfil> = {
  // túbulos e vasos opacos sobre faixas translúcidas de córtex e medula
  nefron: 'esquema',
  // paredes alveolares e espaços aéreos translúcidos: menos reflexo especular nas cascas
  alveolo: 'cascas',
};

const ITENS_HISTOLOGIA: Item3D[] = MODELOS_HISTOLOGIA_3D
  // só modelos com desenho registrado (um texto sem modelo ainda em produção não aparece)
  .filter((m) => MODELOS_HISTOLOGIA[m.id])
  .map((m) => ({
    id: m.id,
    titulo: m.titulo,
    subtitulo: m.escala,
    descricao: m.descricao,
    destaques: m.destaques,
    topicos: m.topicos,
    estruturas: m.estruturas,
    revisao: m.revisao,
    escala: m.escala,
    contexto: m.contexto,
  }));

function nomesHistologia(id: string): Record<string, string> {
  const item = ITENS_HISTOLOGIA.find((m) => m.id === id);
  const nomes: Record<string, string> = {};
  for (const parte of MODELOS_HISTOLOGIA[id]?.partes ?? []) nomes[parte] = estruturas().get(parte)?.nome ?? parte;
  for (const s of item?.estruturas ?? []) nomes[s.id] = s.nome;
  return nomes;
}

export const CATALOGO_HISTOLOGIA: Catalogo3D = {
  disciplina: 'histologia',
  nome: 'Histologia',
  parametro: 'modelo',
  rotuloItem: 'modelo',
  rotaLab: '/lab3d/histologia',
  rotaJogo: '/jogar/identifique/histologia',
  itens: ITENS_HISTOLOGIA,
  modelos: MODELOS_HISTOLOGIA,
  modeloExplicito: true,
  perfil: (id) => PERFIS[PERFIL_HISTOLOGIA[id] ?? 'esquema'],
  nomes: nomesHistologia,
  avisos: (item) => ({ titulo: item.escala ?? 'Esquema fora de escala', linhas: item.contexto ?? [] }),
};

export const CATALOGOS: Record<Disciplina3D, Catalogo3D> = {
  embriologia: CATALOGO_EMBRIOLOGIA,
  histologia: CATALOGO_HISTOLOGIA,
};

// ------------------------------------------------------------------------------------------ apoio
/** Tópico para o link "Estudar" de uma estrutura: primeiro um dos tópicos do próprio item, senão o registro geral. */
export function topicoDaEstrutura(item: Item3D, estruturaId: string): string | undefined {
  for (const t of item.topicos) if (topico(t)?.estruturas.some((e) => e.id === estruturaId)) return t;
  return estruturas().get(estruturaId)?.topicoId;
}

/** Itens de um catálogo que citam um tópico (link "Ver no laboratório 3D" da tela do tópico). */
export function itensDoTopico(catalogo: Catalogo3D, topicoId: string): Item3D[] {
  return catalogo.itens.filter((i) => i.topicos.includes(topicoId));
}

export interface Alvo3D {
  itemId: string;
  estruturaId: string;
  topicoId: string;
}

/** Todos os alvos possíveis: estruturas do texto que existem como parte do modelo. */
export function alvosPossiveis(catalogo: Catalogo3D, itemFixo: string | null): Alvo3D[] {
  const itens = itemFixo ? catalogo.itens.filter((e) => e.id === itemFixo) : catalogo.itens;
  const todos: Alvo3D[] = [];
  for (const e of itens) {
    const partes = new Set(catalogo.modelos[e.id]?.partes ?? []);
    for (const s of e.estruturas) if (partes.has(s.id)) todos.push({ itemId: e.id, estruturaId: s.id, topicoId: e.topicos[0] ?? catalogo.disciplina });
  }
  return todos;
}

/** Sorteia `quantos` alvos e os agrupa pela ordem dos itens (para não trocar de modelo a cada pergunta). */
export function sortearAlvos(catalogo: Catalogo3D, itemFixo: string | null, quantos: number, rng?: () => number): Alvo3D[] {
  const sorteados = embaralhar(alvosPossiveis(catalogo, itemFixo), rng).slice(0, quantos);
  const ordem = new Map(catalogo.itens.map((e, i) => [e.id, i]));
  return sorteados.sort((a, b) => (ordem.get(a.itemId) ?? 0) - (ordem.get(b.itemId) ?? 0));
}
