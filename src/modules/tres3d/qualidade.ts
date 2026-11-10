// Nível de qualidade do 3D (baixa / média / alta): fator de segmentação das geometrias e resolução do desenho.
// Sem React: os geradores de geometria (embriões) leem o fator daqui quando o argumento não é passado.

export type NivelQualidade = 'baixa' | 'media' | 'alta';
export const NIVEIS: readonly NivelQualidade[] = ['baixa', 'media', 'alta'];

/** Override manual do nível (valores de NIVEIS). */
export const CHAVE_QUALIDADE = 'medliga:qualidade3d';
/** Nível rebaixado automaticamente (perda de contexto WebGL); vale enquanto não houver override manual. */
export const CHAVE_QUALIDADE_AUTO = 'medliga:qualidade3d:auto';
/** Redução lembrada do dpr em movimento (múltiplos de 0,25), decidida pelo monitor de tempo de quadro. */
export const CHAVE_DPR_MOVIMENTO = 'medliga:dprMovimento';
/** "1" liga o diagnóstico (window.__diag3d). */
export const CHAVE_DIAGNOSTICO = 'medliga:diag3d';

export interface ParametrosNivel {
  /** multiplica os segmentos das geometrias paramétricas */
  fator: number;
  /** teto do dpr com a câmera parada */
  dprParado: number;
  /** teto do dpr durante o giro */
  dprMovimento: number;
  /** superamostragem parada em relação ao dpr da tela (limitada por dprParado) */
  superamostragem: number;
  /** teto de megapixels do buffer de desenho (parado / em movimento) */
  megapixelsParado: number;
  megapixelsMovimento: number;
  /** lado do mapa de sombra estática */
  mapaSombra: number;
}

export const PARAMETROS: Record<NivelQualidade, ParametrosNivel> = {
  baixa: { fator: 1, dprParado: 2, dprMovimento: 1, superamostragem: 1, megapixelsParado: 2, megapixelsMovimento: 0.9, mapaSombra: 1024 },
  media: { fator: 1.5, dprParado: 2.5, dprMovimento: 1.5, superamostragem: 1.25, megapixelsParado: 3.2, megapixelsMovimento: 1.4, mapaSombra: 2048 },
  alta: { fator: 2, dprParado: 3, dprMovimento: 2, superamostragem: 1.5, megapixelsParado: 4.5, megapixelsMovimento: 2.1, mapaSombra: 2048 },
};

/** Menor dpr admitido em movimento depois das reduções do monitor. */
export const DPR_MINIMO = 0.75;

const ehNivel = (v: unknown): v is NivelQualidade => typeof v === 'string' && (NIVEIS as readonly string[]).includes(v);

function ler(chave: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(chave);
  } catch {
    return null;
  }
}
function gravar(chave: string, valor: string | null) {
  try {
    if (typeof localStorage === 'undefined') return;
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    /* armazenamento indisponível (modo privado): só a sessão atual */
  }
}

/** jsdom/Node (testes): sem WebGL, geometria no fator 1. */
export function semWebGL(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  if (/jsdom/i.test(navigator.userAgent ?? '')) return true;
  return (import.meta as { env?: { MODE?: string } }).env?.MODE === 'test';
}

export interface Dispositivo {
  memoriaGB?: number;
  nucleos?: number;
  toque?: boolean;
  economia?: boolean;
}

function dispositivoAtual(): Dispositivo {
  if (typeof navigator === 'undefined') return {};
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  let toque = false;
  try {
    toque = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  } catch {
    toque = false;
  }
  return { memoriaGB: nav.deviceMemory, nucleos: nav.hardwareConcurrency, toque, economia: !!nav.connection?.saveData };
}

/** Escolha automática, sem override. deviceMemory só existe no Chromium; ausente, não pesa contra. */
export function nivelPorDispositivo(d: Dispositivo): NivelQualidade {
  const memoria = d.memoriaGB;
  const nucleos = d.nucleos ?? 4;
  if (d.economia) return 'baixa';
  if ((memoria !== undefined && memoria <= 2) || nucleos <= 2) return 'baixa';
  if (d.toque) {
    if (memoria !== undefined && memoria < 4) return 'baixa';
    if ((memoria ?? 4) >= 8 && nucleos >= 8) return 'alta';
    return 'media';
  }
  if (memoria !== undefined && memoria < 4) return 'media';
  return nucleos >= 4 ? 'alta' : 'media';
}

let forcado: NivelQualidade | null = null;
let rebaixado: NivelQualidade | null = null;
let emCache: NivelQualidade | null = null;
const ouvintes = new Set<() => void>();

function avisar() {
  emCache = null;
  for (const f of ouvintes) f();
}

/** Nível em uso: forçado (testes/medição) → rebaixado nesta sessão → override → automático. */
export function nivelAtual(): NivelQualidade {
  if (forcado) return forcado;
  if (emCache) return emCache;
  const override = ler(CHAVE_QUALIDADE);
  const auto = ler(CHAVE_QUALIDADE_AUTO);
  let nivel: NivelQualidade = ehNivel(override) ? override : ehNivel(auto) ? auto : nivelPorDispositivo(dispositivoAtual());
  if (rebaixado && NIVEIS.indexOf(rebaixado) < NIVEIS.indexOf(nivel)) nivel = rebaixado;
  emCache = nivel;
  return nivel;
}

/** Fator de segmentos das geometrias paramétricas (1 / 1,5 / 2); 1 sem WebGL, salvo nível forçado. */
export function fatorSegmentos(): number {
  if (!forcado && semWebGL()) return 1;
  return PARAMETROS[nivelAtual()].fator;
}

/** Os embriões já são densos: o fator geral vira 1 / 1,25 / 1,5 (lados 48 → 72; grade 40×64×40 → 60×96×60). */
export function fatorEmbriao(fator = fatorSegmentos()): number {
  return 1 + (fator - 1) / 2;
}

/** Testes e medições: fixa o nível (null desfaz). */
export function forcarNivel(nivel: NivelQualidade | null) {
  forcado = nivel;
  avisar();
}

/** Override manual persistente (null volta ao automático). */
export function definirNivel(nivel: NivelQualidade | null) {
  gravar(CHAVE_QUALIDADE, nivel);
  rebaixado = null;
  avisar();
}

/** Perda de contexto WebGL: desce um nível nesta sessão e lembra para a escolha automática. */
export function rebaixarNivel(): NivelQualidade {
  const atual = nivelAtual();
  const novo = NIVEIS[Math.max(0, NIVEIS.indexOf(atual) - 1)];
  rebaixado = novo;
  if (!ehNivel(ler(CHAVE_QUALIDADE))) gravar(CHAVE_QUALIDADE_AUTO, novo);
  avisar();
  return novo;
}

export function assinarQualidade(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function lerReducaoDprMovimento(): number {
  const v = Number(ler(CHAVE_DPR_MOVIMENTO));
  return Number.isFinite(v) && v > 0 ? Math.min(v, 2) : 0;
}
export function gravarReducaoDprMovimento(reducao: number) {
  gravar(CHAVE_DPR_MOVIMENTO, reducao > 0 ? String(reducao) : null);
}

export function diagnosticoLigado(): boolean {
  return ler(CHAVE_DIAGNOSTICO) === '1';
}

const passo = (v: number) => Math.floor(v * 4 + 1e-9) / 4;

/**
 * dpr do desenho para um palco de `tamanho` (px CSS). Parado: superamostragem até o teto do nível;
 * em movimento: nunca acima do dpr da tela nem do teto de movimento (menos a redução do monitor).
 * Os dois respeitam o teto de megapixels e ficam em múltiplos de 0,25 (evita redimensionar por ruído).
 */
export function alvoDpr(
  tamanho: { width: number; height: number },
  dprTela: number,
  nivel: NivelQualidade,
  emMovimento: boolean,
  reducaoMovimento = 0,
): number {
  const p = PARAMETROS[nivel];
  const tela = Number.isFinite(dprTela) && dprTela > 0 ? dprTela : 1;
  const area = Math.max(1, tamanho.width) * Math.max(1, tamanho.height);
  const tetoPixels = (mp: number) => Math.sqrt((mp * 1e6) / area);
  const parado = Math.max(1, Math.min(p.dprParado, tela * p.superamostragem, tetoPixels(p.megapixelsParado)));
  if (!emMovimento) return Math.max(DPR_MINIMO, passo(parado));
  const teto = Math.max(DPR_MINIMO, p.dprMovimento - reducaoMovimento);
  const movimento = Math.min(teto, tela, tetoPixels(p.megapixelsMovimento), parado);
  return Math.max(DPR_MINIMO, passo(movimento));
}
