// Estado global do app (perfil, XP, uso diário) com persistência local.
import { create } from 'zustand';
import { db, uuid, type Perfil, type RegistroResposta, type RegistroSessao } from './db.ts';
import type { EstadoItem } from '../core/srs.ts';
import { hojeLocal, type UsoDiario } from '../core/planos.ts';
import { semanaAtual } from '../core/ranking.ts';
import { obterBackend, type ModoBackend } from './backend.ts';
import { sincronizar } from './sync.ts';
import type { AvatarConfig } from '../modules/avatar/tipos.ts';
import { conquistasNovas } from '../core/conquistas.ts';

interface EstadoApp {
  carregado: boolean;
  perfil: Perfil | null;
  xpTotal: number;
  xpSemana: number;
  xpHoje: number;
  sequenciaDias: number;
  uso: UsoDiario;
  modoBackend: ModoBackend;
  pendentesSync: number;
  carregar(): Promise<void>;
  salvarPerfil(p: Partial<Omit<Perfil, 'chave' | 'idLocal' | 'criadoEm'>>): Promise<Perfil>;
  /** Grava o avatar no aparelho e, com conta online, envia ao servidor (aparece no ranking e nos duelos). */
  salvarAvatar(avatar: AvatarConfig): Promise<void>;
  /** Envia ao servidor o avatar que ficou pendente (ou, com `forcar`, o avatar atual). */
  enviarAvatarPendente(forcar?: boolean): Promise<void>;
  /** Marca como vistos os itens desbloqueados (tira a etiqueta "Novo"). */
  marcarItensVistos(chaves: string[]): Promise<void>;
  /**
   * Guarda no aparelho as conquistas obtidas, para que não se percam quando a sequência de dias cair.
   * A primeira chamada depois de abrir o app só confere o que já existia; as seguintes põem em `medalhasNovas`
   * o que foi obtido com o app aberto, para o aviso na tela.
   */
  registrarConquistas(ids: string[]): Promise<void>;
  /** Conquistas obtidas com o app aberto e ainda não dispensadas pelo jogador (só na memória). */
  medalhasNovas: string[];
  /** A conferência inicial das conquistas já foi feita nesta abertura do app. */
  conquistasConferidas: boolean;
  dispensarMedalhas(): void;
  concluirSessao(s: RegistroSessao, respostas: RegistroResposta[], estados: EstadoItem[]): Promise<void>;
  contarUso(tipo: 'estudo' | 'plantao'): Promise<void>;
  atualizarSync(): Promise<void>;
}

function usoVazio(): UsoDiario {
  return { data: hojeLocal(), sessoesEstudo: 0, plantoesRanqueados: 0 };
}

export function calcularSequencia(diasComAtividade: Set<string>, hoje = Date.now()): number {
  let n = 0;
  let t = hoje;
  // Se ainda não jogou hoje, a sequência conta até ontem.
  if (!diasComAtividade.has(hojeLocal(t))) t -= 86400000;
  while (diasComAtividade.has(hojeLocal(t))) {
    n++;
    t -= 86400000;
  }
  return n;
}

async function totais() {
  const sessoes = await db.sessoes.toArray();
  const semana = semanaAtual();
  let xpTotal = 0;
  let xpSemana = 0;
  let xpHoje = 0;
  const hoje = hojeLocal();
  const dias = new Set<string>();
  for (const s of sessoes) {
    xpTotal += s.xp;
    if (semanaAtual(s.fim) === semana) xpSemana += s.xp;
    dias.add(hojeLocal(s.fim));
    if (hojeLocal(s.fim) === hoje) xpHoje += s.xp;
  }
  const pendentesSync = sessoes.filter((s) => s.sincronizada === 0 && s.ranqueada).length;
  return { xpTotal, xpSemana, xpHoje, sequenciaDias: calcularSequencia(dias), pendentesSync };
}

export const useApp = create<EstadoApp>((set, get) => ({
  carregado: false,
  perfil: null,
  xpTotal: 0,
  xpSemana: 0,
  xpHoje: 0,
  sequenciaDias: 0,
  uso: usoVazio(),
  modoBackend: 'offline',
  pendentesSync: 0,
  medalhasNovas: [],
  conquistasConferidas: false,

  async carregar() {
    const perfil = (await db.perfil.get('eu')) ?? null;
    const uso = (await db.uso.get(hojeLocal())) ?? usoVazio();
    const backend = await obterBackend();
    set({ perfil, uso, ...(await totais()), modoBackend: backend.modo, carregado: true });
    if (perfil) void get().atualizarSync();
  },

  async salvarPerfil(parcial) {
    const atual = get().perfil;
    const perfil: Perfil = {
      chave: 'eu',
      idLocal: atual?.idLocal ?? uuid(),
      criadoEm: atual?.criadoEm ?? Date.now(),
      nome: '',
      escolaId: null,
      semestre: null,
      curso: 'medicina',
      plano: 'gratuito',
      usuarioOnlineId: null,
      email: null,
      aceitouTermosEm: null,
      ...atual,
      ...parcial,
    };
    await db.perfil.put(perfil);
    set({ perfil });
    try {
      const b = await obterBackend();
      if (await b.usuarioAtual()) await b.salvarPerfil(perfil);
    } catch {
      // Offline: o perfil é reenviado na próxima sincronização.
    }
    // Quem montou o avatar antes de criar a conta envia o avatar na primeira gravação online.
    if (perfil.avatar && parcial.usuarioOnlineId) await get().enviarAvatarPendente(true);
    return perfil;
  },

  async salvarAvatar(avatar) {
    const perfil = get().perfil;
    if (!perfil) return;
    const novo: Perfil = { ...perfil, avatar, avatarPendente: true };
    await db.perfil.put(novo);
    set({ perfil: novo });
    await get().enviarAvatarPendente();
  },

  async enviarAvatarPendente(forcar = false) {
    const perfil = get().perfil;
    if (!perfil?.avatar || (!perfil.avatarPendente && !forcar)) return;
    try {
      const b = await obterBackend();
      if (b.modo === 'offline' || !(await b.usuarioAtual())) return; // sem conta: fica só no aparelho
      await b.salvarAvatar(perfil.avatar);
      const atual = get().perfil;
      if (!atual) return;
      const novo: Perfil = { ...atual, avatarPendente: false };
      await db.perfil.put(novo);
      set({ perfil: novo });
    } catch {
      // sem conexão: tenta de novo na próxima sincronização
    }
  },

  async marcarItensVistos(chaves) {
    const perfil = get().perfil;
    if (!perfil) return;
    const vistos = new Set(perfil.avatarItensVistos ?? []);
    const antes = vistos.size;
    for (const k of chaves) vistos.add(k);
    if (vistos.size === antes) return;
    // Só no aparelho: não é dado de perfil do servidor.
    const novo = { ...perfil, avatarItensVistos: [...vistos] };
    await db.perfil.put(novo);
    set({ perfil: novo });
  },

  async registrarConquistas(ids) {
    const perfil = get().perfil;
    if (!perfil) return;
    const novas = conquistasNovas(perfil.conquistasObtidas, ids);
    const avisar = get().conquistasConferidas;
    if (!novas.length) {
      if (!avisar) set({ conquistasConferidas: true });
      return;
    }
    const novo = { ...perfil, conquistasObtidas: [...(perfil.conquistasObtidas ?? []), ...novas] };
    await db.perfil.put(novo);
    set({ perfil: novo, conquistasConferidas: true, medalhasNovas: avisar ? [...get().medalhasNovas, ...novas] : get().medalhasNovas });
  },

  dispensarMedalhas() {
    set({ medalhasNovas: [] });
  },

  async concluirSessao(s, respostas, estados) {
    await db.transaction('rw', db.sessoes, db.respostas, db.estados, async () => {
      await db.sessoes.put(s);
      await db.respostas.bulkAdd(respostas);
      await db.estados.bulkPut(estados);
    });
    set(await totais());
    void get().atualizarSync();
  },

  async contarUso(tipo) {
    const hoje = hojeLocal();
    const atual = get().uso.data === hoje ? get().uso : usoVazio();
    const uso: UsoDiario = {
      ...atual,
      sessoesEstudo: atual.sessoesEstudo + (tipo === 'estudo' ? 1 : 0),
      plantoesRanqueados: atual.plantoesRanqueados + (tipo === 'plantao' ? 1 : 0),
    };
    await db.uso.put(uso);
    set({ uso });
  },

  async atualizarSync() {
    try {
      await sincronizar();
      await get().enviarAvatarPendente();
      // O servidor é a fonte da verdade do plano (assinatura individual ou licença da escola).
      const b = await obterBackend();
      if (b.modo === 'supabase' && (await b.usuarioAtual())) {
        const plano = await b.planoAtual();
        const perfil = get().perfil;
        if (plano && perfil && perfil.plano !== plano) {
          const novo = { ...perfil, plano };
          await db.perfil.put(novo);
          set({ perfil: novo });
        }
      }
    } catch {
      // sem conexão: tenta de novo depois
    } finally {
      set(await totais());
    }
  },
}));
