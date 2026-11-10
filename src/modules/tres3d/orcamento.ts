// Orçamento de desenho por nível de qualidade (por modelo, num quadro).
// Calibração (medição de base, 10/11/2026, build de produção, fator 1, scripts/medir-3d.mjs):
//   maior quadro = semana-8 com 109,5 mil triângulos (sombra refeita a cada quadro, cada malha desenhada 2×),
//   mais chamadas = placenta-membranas com 114, no máximo 5 programas WebGL vivos.
// Com o refino, os tetos de triângulos ficam em 100 mil / 200 mil / 350 mil; chamadas e programas não
// dependem do nível (o refino não cria malhas; a sombra estática não redesenha a cena a cada quadro).
import type { NivelQualidade } from './qualidade.ts';

export interface Orcamento {
  triangulos: number;
  chamadas: number;
  programas: number;
}

export const ORCAMENTO: Record<NivelQualidade, Orcamento> = {
  baixa: { triangulos: 100_000, chamadas: 150, programas: 12 },
  media: { triangulos: 200_000, chamadas: 150, programas: 12 },
  alta: { triangulos: 350_000, chamadas: 150, programas: 12 },
};

export interface MedidaQuadro {
  triangulos: number;
  chamadas: number;
  programas?: number;
}

/** Lista o que estourou o orçamento do nível (vazia = dentro). */
export function excessos(medida: MedidaQuadro, nivel: NivelQualidade): string[] {
  const o = ORCAMENTO[nivel];
  const fora: string[] = [];
  if (medida.triangulos > o.triangulos) fora.push(`triângulos ${medida.triangulos} > ${o.triangulos}`);
  if (medida.chamadas > o.chamadas) fora.push(`chamadas ${medida.chamadas} > ${o.chamadas}`);
  if (medida.programas !== undefined && medida.programas > o.programas) fora.push(`programas ${medida.programas} > ${o.programas}`);
  return fora;
}
