// Conquistas (medalhas). Calculadas a partir do histórico local; puras e testáveis.
import type { NomeIcone } from '../ui/icones.ts';

export interface EstatisticasJogador {
  sessoes: { modo: string; acertos: number; total: number }[];
  sequenciaDias: number;
  xpTotal: number;
  nivel: number;
  topicosDominados: number; // domínio ≥ 60%
  totalTopicos: number;
  temEscola: boolean;
  reportesEnviados: number;
}

export interface Conquista {
  id: string;
  /** nome do ícone em src/ui/icones.ts */
  icone: NomeIcone;
  nome: string;
  descricao: string;
  /** progresso de 0 a 1 */
  progresso: (e: EstatisticasJogador) => number;
}

const perfeita = (e: EstatisticasJogador, modo: string, minimo: number) =>
  e.sessoes.some((s) => s.modo === modo && s.total >= minimo && s.acertos === s.total) ? 1 : 0;
const contar = (e: EstatisticasJogador, modo: string) => e.sessoes.filter((s) => s.modo === modo).length;

export const CONQUISTAS: Conquista[] = [
  { id: 'primeiro-passo', icone: 'pegadas', nome: 'Primeiro passo', descricao: 'Conclua sua primeira sessão.', progresso: (e) => Math.min(1, e.sessoes.length) },
  { id: 'vestiu-a-camisa', icone: 'camisa', nome: 'Vestiu a camisa', descricao: 'Escolha a escola pela qual você joga.', progresso: (e) => (e.temEscola ? 1 : 0) },
  { id: 'sequencia-3', icone: 'fogo', nome: 'Pegando o ritmo', descricao: 'Estude 3 dias seguidos.', progresso: (e) => Math.min(1, e.sequenciaDias / 3) },
  { id: 'sequencia-7', icone: 'fogo', nome: 'Semana cheia', descricao: 'Estude 7 dias seguidos.', progresso: (e) => Math.min(1, e.sequenciaDias / 7) },
  { id: 'sequencia-30', icone: 'medalha', nome: 'Hábito de residente', descricao: 'Estude 30 dias seguidos.', progresso: (e) => Math.min(1, e.sequenciaDias / 30) },
  { id: 'plantonista', icone: 'raio', nome: 'Plantonista', descricao: 'Jogue 10 plantões relâmpago.', progresso: (e) => Math.min(1, contar(e, 'plantao') / 10) },
  { id: 'plantao-perfeito', icone: 'estrela', nome: 'Plantão impecável', descricao: 'Feche um plantão com pelo menos 10 respostas, todas certas.', progresso: (e) => perfeita(e, 'plantao', 10) },
  { id: 'olho-clinico', icone: 'alvo', nome: 'Olho clínico', descricao: 'Encontre as 10 estruturas do Identifique sem errar.', progresso: (e) => perfeita(e, 'identifique', 10) },
  { id: 'camadas', icone: 'quebra-cabeca', nome: 'Três folhetos, zero dúvidas', descricao: 'Acerte todas as origens numa rodada de Camadas germinativas.', progresso: (e) => perfeita(e, 'camadas', 12) },
  { id: 'cronologista', icone: 'ampulheta', nome: 'Cronologista', descricao: 'Feche a Linha do tempo sem nenhum evento fora do lugar.', progresso: (e) => perfeita(e, 'linha-do-tempo', 10) },
  { id: 'dominio-1', icone: 'livro', nome: 'Primeiro tópico', descricao: 'Alcance 60% de domínio em um tópico.', progresso: (e) => Math.min(1, e.topicosDominados) },
  { id: 'dominio-10', icone: 'estudar', nome: 'Meio caminho', descricao: 'Alcance 60% de domínio em 10 tópicos.', progresso: (e) => Math.min(1, e.topicosDominados / 10) },
  { id: 'dominio-todos', icone: 'capelo', nome: 'Embriologia fechada', descricao: 'Alcance 60% de domínio em todos os tópicos de embriologia.', progresso: (e) => (e.totalTopicos ? Math.min(1, e.topicosDominados / e.totalTopicos) : 0) },
  { id: 'nivel-10', icone: 'estetoscopio', nome: 'Ligante', descricao: 'Chegue ao nível 10.', progresso: (e) => Math.min(1, e.nivel / 10) },
  { id: 'xp-10000', icone: 'ranking', nome: 'Dez mil', descricao: 'Some 10.000 XP.', progresso: (e) => Math.min(1, e.xpTotal / 10000) },
  { id: 'revisor', icone: 'lupa', nome: 'Revisor', descricao: 'Reporte um possível erro de conteúdo.', progresso: (e) => Math.min(1, e.reportesEnviados) },
];

export function conquistasDe(e: EstatisticasJogador) {
  return CONQUISTAS.map((c) => {
    const p = Math.max(0, Math.min(1, c.progresso(e)));
    return { ...c, valor: p, obtida: p >= 1 };
  });
}
