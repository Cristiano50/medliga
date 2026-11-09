// Armazenamento local (IndexedDB via Dexie). Tudo o que o jogador faz é gravado aqui primeiro:
// o jogo funciona offline e a sincronização com o servidor acontece quando houver conexão.
import Dexie, { type Table } from 'dexie';
import type { EstadoItem } from '../core/srs.ts';
import type { PlanoId, UsoDiario } from '../core/planos.ts';
import type { ModoSessao } from '../core/session.ts';

export interface Perfil {
  chave: 'eu';
  idLocal: string; // uuid gerado no aparelho
  nome: string;
  escolaId: string | null;
  /** texto livre quando a escola não está no cadastro (enviado para moderação) */
  escolaSugerida?: string | null;
  semestre: number | null;
  curso: 'medicina' | 'outro';
  criadoEm: number;
  plano: PlanoId;
  usuarioOnlineId: string | null;
  email: string | null;
  aceitouTermosEm: number | null;
}

export interface RegistroResposta {
  id?: number;
  sessaoId: string;
  questaoId: string;
  topicoId: string;
  correta: boolean;
  fracao: number;
  xp: number;
  tempoMs: number;
  criadoEm: number;
}

export interface RegistroSessao {
  id: string;
  modo: ModoSessao | 'identifique' | 'linha-do-tempo' | 'camadas';
  disciplina: string;
  topicoIds: string[];
  inicio: number;
  fim: number;
  xp: number;
  acertos: number;
  total: number;
  ranqueada: boolean;
  sincronizada: 0 | 1;
}

export interface Reporte {
  id: string; // uuid local (idempotência no servidor)
  questaoId: string;
  motivo: 'gabarito' | 'explicacao' | 'enunciado' | 'portugues' | 'outro';
  texto: string;
  criadoEm: number;
  enviado: 0 | 1;
}

export interface CacheRemoto {
  chave: string;
  dado: unknown;
  atualizadoEm: number;
}

class BancoMedLiga extends Dexie {
  perfil!: Table<Perfil, string>;
  estados!: Table<EstadoItem, string>;
  respostas!: Table<RegistroResposta, number>;
  sessoes!: Table<RegistroSessao, string>;
  uso!: Table<UsoDiario, string>;
  cache!: Table<CacheRemoto, string>;
  reportes!: Table<Reporte, string>;

  constructor() {
    super('medliga');
    this.version(1).stores({
      perfil: 'chave',
      estados: 'questaoId, proximaRevisao, caixa',
      respostas: '++id, sessaoId, questaoId, topicoId, criadoEm',
      sessoes: 'id, modo, inicio, sincronizada',
      uso: 'data',
      cache: 'chave',
    });
    this.version(2).stores({ reportes: 'id, questaoId, enviado' });
  }
}

export const db = new BancoMedLiga();

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
