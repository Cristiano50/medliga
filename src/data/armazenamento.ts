// Garante armazenamento local. Se o IndexedDB estiver bloqueado (aba anônima de alguns navegadores,
// visualizadores embutidos), usa um banco em memória para o jogo funcionar — e avisa que o progresso não fica salvo.
import Dexie from 'dexie';

export let armazenamentoTemporario = false;

function testarIndexedDB(): Promise<boolean> {
  return new Promise((ok) => {
    try {
      if (typeof indexedDB === 'undefined') return ok(false);
      const r = indexedDB.open('medliga-teste-armazenamento');
      r.onsuccess = () => {
        r.result.close();
        ok(true);
      };
      r.onerror = () => ok(false);
      r.onblocked = () => ok(true);
      setTimeout(() => ok(false), 3000);
    } catch {
      ok(false);
    }
  });
}

export async function prepararArmazenamento(): Promise<void> {
  if (await testarIndexedDB()) return;
  const fake = await import('fake-indexeddb');
  Dexie.dependencies.indexedDB = fake.indexedDB;
  Dexie.dependencies.IDBKeyRange = fake.IDBKeyRange;
  armazenamentoTemporario = true;
}
