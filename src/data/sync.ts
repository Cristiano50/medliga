// Sincronização: envia ao servidor as sessões ranqueadas ainda não sincronizadas.
// Idempotente: o servidor ignora sessão com id já recebido.
import { db } from './db.ts';
import { obterBackend } from './backend.ts';

let emAndamento: Promise<number> | null = null;

export function sincronizar(): Promise<number> {
  if (!emAndamento) emAndamento = executar().finally(() => (emAndamento = null));
  return emAndamento;
}

async function executar(): Promise<number> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 0;
  const backend = await obterBackend();
  if (backend.modo === 'offline') return 0;
  const usuario = await backend.usuarioAtual();
  if (!usuario) return 0;
  const pendentes = await db.sessoes.where('sincronizada').equals(0).toArray();
  let enviadas = 0;
  for (const s of pendentes) {
    if (!s.ranqueada) {
      await db.sessoes.update(s.id, { sincronizada: 1 });
      continue;
    }
    const respostas = await db.respostas.where('sessaoId').equals(s.id).toArray();
    try {
      await backend.enviarSessao(s, respostas);
      await db.sessoes.update(s.id, { sincronizada: 1 });
      enviadas++;
    } catch {
      break; // tenta de novo na próxima oportunidade
    }
  }
  return enviadas;
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => void sincronizar());
}
