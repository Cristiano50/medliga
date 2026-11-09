// Registro de partidas dos minijogos (linha do tempo, camadas, identifique) no mesmo formato das sessões de questões.
// Cada "jogada" vira uma resposta com id prefixado (ex.: "camadas:hepatocitos"), para o servidor recalcular o XP.
import { uuid, type RegistroResposta, type RegistroSessao } from '../data/db.ts';
import { useApp } from '../data/store.ts';

export const XP_POR_ACERTO_MINIJOGO = 4;

export interface Jogada {
  id: string; // ex.: "camadas:hepatocitos"
  topicoId: string;
  correta: boolean;
  tempoMs: number;
}

export function xpMinijogo(jogadas: Jogada[]): number {
  let xp = 0;
  let combo = 0;
  for (const j of jogadas) {
    if (j.correta) {
      xp += Math.round(XP_POR_ACERTO_MINIJOGO * (1 + Math.min(0.5, combo * 0.1)));
      combo++;
    } else combo = 0;
  }
  return xp;
}

export async function salvarMinijogo(modo: RegistroSessao['modo'], inicio: number, jogadas: Jogada[]): Promise<number> {
  if (jogadas.length === 0) return 0;
  const id = uuid();
  const fim = Date.now();
  const xp = xpMinijogo(jogadas);
  let combo = 0;
  const respostas: RegistroResposta[] = jogadas.map((j) => {
    const x = j.correta ? Math.round(XP_POR_ACERTO_MINIJOGO * (1 + Math.min(0.5, combo * 0.1))) : 0;
    combo = j.correta ? combo + 1 : 0;
    return { sessaoId: id, questaoId: j.id, topicoId: j.topicoId, correta: j.correta, fracao: j.correta ? 1 : 0, xp: x, tempoMs: j.tempoMs, criadoEm: fim };
  });
  await useApp.getState().concluirSessao(
    {
      id,
      modo,
      disciplina: 'embriologia',
      topicoIds: [...new Set(jogadas.map((j) => j.topicoId))],
      inicio,
      fim,
      xp,
      acertos: jogadas.filter((j) => j.correta).length,
      total: jogadas.length,
      ranqueada: true,
      sincronizada: 0,
    },
    respostas,
    [],
  );
  return xp;
}
