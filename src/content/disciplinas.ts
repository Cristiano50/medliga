// Catálogo de disciplinas. Cada uma tem uma jogabilidade própria.
// Ordem = semestre mais comum de cada disciplina nas escolas pesquisadas (docs/pesquisa-curricular.md).
export interface JogoDisciplina {
  rota: string;
  icone: string;
  nome: string;
  descricao: string;
  cor: string;
}

export interface Disciplina {
  id: string;
  /** prefixo dos ids de tópicos (ex.: 'emb' em 'emb-06-semana3') */
  prefixo?: string;
  nome: string;
  status: 'disponivel' | 'em-breve';
  cor: string;
  icone: string; // emoji provisório até a arte final
  jogabilidade: string;
  descricao: string;
  /** jogos próprios da disciplina (além de questões, plantão, revisão e duelo, que são comuns a todas) */
  jogos?: JogoDisciplina[];
}

export const DISCIPLINAS: Disciplina[] = [
  {
    id: 'embriologia',
    prefixo: 'emb',
    nome: 'Embriologia',
    status: 'disponivel',
    cor: '#2dd4bf',
    icone: '🌱',
    jogabilidade: 'Laboratório 3D semana a semana',
    descricao: 'Da fertilização ao período fetal: modelos 3D manipuláveis, linha do tempo e camadas germinativas.',
    jogos: [
      { rota: '/lab3d', icone: '🧫', nome: 'Laboratório 3D', descricao: 'Do zigoto à 8ª semana e órgãos em formação: gire, aproxime e toque nas estruturas.', cor: 'var(--primary)' },
      { rota: '/jogar/identifique', icone: '🎯', nome: 'Identifique', descricao: 'Encontre a estrutura pedida no modelo 3D antes de perder as vidas.', cor: 'var(--info)' },
      { rota: '/jogar/linha-do-tempo', icone: '⏳', nome: 'Linha do tempo', descricao: 'Coloque os eventos do desenvolvimento na ordem certa.', cor: 'var(--crista)' },
      { rota: '/jogar/camadas', icone: '🧩', nome: 'Camadas germinativas', descricao: 'De onde vem cada tecido? Ectoderma, mesoderma, endoderma ou crista neural.', cor: 'var(--meso)' },
    ],
  },
  {
    id: 'histologia',
    prefixo: 'his',
    nome: 'Histologia',
    status: 'disponivel', // 10 tópicos com duas etapas de revisão por agentes; conferência médica pendente
    cor: '#c084fc',
    icone: '🔬',
    jogabilidade: 'Microscópio virtual',
    descricao: 'Lâminas em HE com objetivas de 4×, 10× e 40×: reconheça tecidos, células e estruturas.',
    jogos: [
      { rota: '/microscopio', icone: '🔬', nome: 'Microscópio virtual', descricao: 'Troque a objetiva, percorra a lâmina e toque nas células e estruturas.', cor: '#c084fc' },
      { rota: '/jogar/identifique-lamina', icone: '🎯', nome: 'Identifique na lâmina', descricao: 'Ache a estrutura pedida na lâmina antes de perder as vidas.', cor: 'var(--info)' },
      { rota: '/jogar/qual-tecido', icone: '❓', nome: 'Qual é o tecido?', descricao: 'Veja um campo do microscópio e diga o tecido ou órgão.', cor: 'var(--accent)' },
    ],
  },
  {
    id: 'anatomia',
    nome: 'Anatomia',
    status: 'em-breve',
    cor: '#f87171',
    icone: '🦴',
    jogabilidade: 'Dissecção 3D por camadas',
    descricao: 'Peças 3D por regiões; identifique estruturas, relações e inervação.',
  },
  {
    id: 'bioquimica',
    nome: 'Bioquímica',
    status: 'em-breve',
    cor: '#facc15',
    icone: '⚗️',
    jogabilidade: 'Montagem de vias metabólicas',
    descricao: 'Monte as vias, ache a enzima bloqueada e a doença correspondente.',
  },
  {
    id: 'genetica',
    nome: 'Genética',
    status: 'em-breve',
    cor: '#38bdf8',
    icone: '🧬',
    jogabilidade: 'Heredogramas e cariótipos',
    descricao: 'Monte heredogramas, leia cariótipos e ligue mutação, herança e fenótipo.',
  },
  {
    id: 'fisiologia',
    nome: 'Fisiologia',
    status: 'em-breve',
    cor: '#60a5fa',
    icone: '❤️',
    jogabilidade: 'Simulador de sistemas',
    descricao: 'Mexa em variáveis (pressão, volume, hormônios) e preveja a resposta do organismo.',
  },
  {
    id: 'patologia',
    nome: 'Patologia',
    status: 'em-breve',
    cor: '#f472b6',
    icone: '🧫',
    jogabilidade: 'Do tecido ao diagnóstico',
    descricao: 'Lesões celulares, inflamação, neoplasias: reconheça o padrão e o mecanismo.',
  },
  {
    id: 'farmacologia',
    nome: 'Farmacologia',
    status: 'em-breve',
    cor: '#a3e635',
    icone: '💊',
    jogabilidade: 'Alvo e mecanismo',
    descricao: 'Receptores, mecanismos de ação, efeitos adversos e interações.',
  },
  {
    id: 'semiologia',
    nome: 'Semiologia',
    status: 'em-breve',
    cor: '#34d399',
    icone: '🩺',
    jogabilidade: 'Exame físico interativo',
    descricao: 'Anamnese guiada, ausculta e manobras; colete os achados certos.',
  },
  {
    id: 'fisiopatologia',
    nome: 'Fisiopatologia',
    status: 'em-breve',
    cor: '#fb923c',
    icone: '🔥',
    jogabilidade: 'Cascata de mecanismos',
    descricao: 'Encadeie causa → mecanismo → manifestação.',
  },
  {
    id: 'cirurgia',
    nome: 'Cirurgia',
    status: 'em-breve',
    cor: '#94a3b8',
    icone: '🔪',
    jogabilidade: 'Centro cirúrgico 3D',
    descricao: 'Escolha a técnica, aponte planos e estruturas, antecipe complicações.',
  },
];

export function disciplina(id: string): Disciplina | undefined {
  return DISCIPLINAS.find((d) => d.id === id);
}

/** Disciplina de um tópico pelo prefixo do id (ex.: 'his-02-...' → histologia). */
export function disciplinaDoTopico(topicoId: string): string | undefined {
  const prefixo = topicoId.split('-')[0];
  return DISCIPLINAS.find((d) => d.prefixo === prefixo)?.id;
}

export const DISCIPLINAS_DISPONIVEIS = DISCIPLINAS.filter((d) => d.status === 'disponivel').map((d) => d.id);
