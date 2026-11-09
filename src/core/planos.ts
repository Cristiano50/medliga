// Modelo comercial: freemium + plano institucional (escolas e ligas acadêmicas).
// Os limites ficam aqui, num só lugar, para ajuste de produto sem mexer nas telas.
// O servidor é a fonte da verdade do plano (tabela `assinaturas`); offline vale o último plano sincronizado.

export type PlanoId = 'gratuito' | 'premium' | 'institucional';

export interface Plano {
  id: PlanoId;
  nome: string;
  precoMensalBRL: number | null; // null = sob consulta
  precoAnualBRL: number | null;
  sessoesEstudoPorDia: number; // Infinity = ilimitado
  plantoesRanqueadosPorDia: number;
  revisaoEspacada: boolean;
  estatisticasDetalhadas: boolean;
  lab3dCompleto: boolean;
  painelProfessor: boolean;
  destaques: string[];
}

// Preços são HIPÓTESES de lançamento para validar (ver docs/negocio.md), não valores definitivos.
export const PLANOS: Record<PlanoId, Plano> = {
  gratuito: {
    id: 'gratuito',
    nome: 'Gratuito',
    precoMensalBRL: 0,
    precoAnualBRL: 0,
    sessoesEstudoPorDia: 5,
    plantoesRanqueadosPorDia: 3,
    revisaoEspacada: false,
    estatisticasDetalhadas: false,
    lab3dCompleto: true,
    painelProfessor: false,
    destaques: ['Todo o conteúdo de estudo', 'Laboratório 3D', '5 sessões de questões por dia', '3 plantões ranqueados por dia'],
  },
  premium: {
    id: 'premium',
    nome: 'Premium',
    precoMensalBRL: 29.9,
    precoAnualBRL: 239.9,
    sessoesEstudoPorDia: Infinity,
    plantoesRanqueadosPorDia: Infinity,
    revisaoEspacada: true,
    estatisticasDetalhadas: true,
    lab3dCompleto: true,
    painelProfessor: false,
    destaques: ['Sessões e plantões ilimitados', 'Revisão espaçada do dia', 'Estatísticas por tópico e tipo de erro', 'Duelos com colegas (em breve)'],
  },
  institucional: {
    id: 'institucional',
    nome: 'Escola / Liga',
    precoMensalBRL: null,
    precoAnualBRL: null,
    sessoesEstudoPorDia: Infinity,
    plantoesRanqueadosPorDia: Infinity,
    revisaoEspacada: true,
    estatisticasDetalhadas: true,
    lab3dCompleto: true,
    painelProfessor: true,
    destaques: ['Premium para toda a turma', 'Painel do professor (desempenho por tópico)', 'Torneios internos da escola', 'Conteúdo alinhado ao PPC da escola'],
  },
};

export interface UsoDiario {
  data: string; // AAAA-MM-DD local
  sessoesEstudo: number;
  plantoesRanqueados: number;
}

export function podeIniciar(plano: PlanoId, uso: UsoDiario, tipo: 'estudo' | 'plantao'): { ok: boolean; restante: number } {
  const p = PLANOS[plano];
  const limite = tipo === 'estudo' ? p.sessoesEstudoPorDia : p.plantoesRanqueadosPorDia;
  const usado = tipo === 'estudo' ? uso.sessoesEstudo : uso.plantoesRanqueados;
  return { ok: usado < limite, restante: Math.max(0, limite - usado) };
}

export function hojeLocal(t = Date.now()): string {
  const d = new Date(t);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}
