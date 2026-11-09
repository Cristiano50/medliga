// Catálogo de disciplinas. Cada uma tem uma jogabilidade própria.
// Ordem = semestre mais comum de cada disciplina nas escolas pesquisadas (docs/pesquisa-curricular.md).
export interface Disciplina {
  id: string;
  nome: string;
  status: 'disponivel' | 'em-breve';
  cor: string;
  icone: string; // emoji provisório até a arte final
  jogabilidade: string;
  descricao: string;
}

export const DISCIPLINAS: Disciplina[] = [
  {
    id: 'embriologia',
    nome: 'Embriologia',
    status: 'disponivel',
    cor: '#2dd4bf',
    icone: '🌱',
    jogabilidade: 'Laboratório 3D semana a semana',
    descricao: 'Da fertilização ao período fetal: modelos 3D manipuláveis, linha do tempo e camadas germinativas.',
  },
  {
    id: 'histologia',
    nome: 'Histologia',
    status: 'em-breve',
    cor: '#c084fc',
    icone: '🔬',
    jogabilidade: 'Microscópio virtual',
    descricao: 'Lâminas com zoom; reconheça tecidos e células.',
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
