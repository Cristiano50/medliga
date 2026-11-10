// Perfis de iluminação por tipo de modelo (substitui os ternários `organico ? :` do Cena3D).
// Tone mapping Neutral (Khronos PBR Neutral): preserva matiz e saturação das cores convencionais das
// camadas germinativas (ectoderma azul, mesoderma vermelho, endoderma amarelo), que o ACES dessatura.
import * as THREE from 'three';

export type TipoPerfil = 'esquema' | 'organico' | 'cascas';
export type TipoSombra = 'pcf' | 'contato' | 'nenhuma';

export interface Luz {
  posicao: [number, number, number];
  intensidade: number;
  cor: string;
}

export interface Perfil3D {
  tipo: TipoPerfil;
  fundo: string;
  toneMapping: THREE.ToneMapping;
  exposicao: number;
  /** scene.environmentIntensity do RoomEnvironment (PMREM local) */
  ambiente: number;
  hemisferio: { ceu: string; chao: string; intensidade: number };
  principal: Luz;
  preenchimento: Luz;
  luzAmbiente: number;
  /** pcf: sombra estática projetada; contato: ContactShadows assada uma vez; nunca com corte/isolamento/seleção */
  sombra: TipoSombra;
  /** opacidade da sombra de contato */
  sombraContato?: number;
}

const BASE_ESQUEMA: Perfil3D = {
  tipo: 'esquema',
  fundo: '#0d1628',
  toneMapping: THREE.NeutralToneMapping,
  exposicao: 1.12,
  ambiente: 0.32,
  hemisferio: { ceu: '#dbeafe', chao: '#1e293b', intensidade: 0.62 },
  principal: { posicao: [3, 4, 5], intensidade: 1.55, cor: '#ffffff' },
  preenchimento: { posicao: [-4, 2, -3], intensidade: 0.55, cor: '#ffffff' },
  luzAmbiente: 0.16,
  sombra: 'nenhuma',
};

export const PERFIS: Record<TipoPerfil, Perfil3D> = {
  esquema: BASE_ESQUEMA,
  // Cascas translúcidas (zona pelúcida, pericárdio, membranas): menos reflexo especular, para não "leitar" as cascas.
  cascas: {
    ...BASE_ESQUEMA,
    tipo: 'cascas',
    ambiente: 0.22,
    hemisferio: { ceu: '#dbeafe', chao: '#1e293b', intensidade: 0.7 },
    luzAmbiente: 0.18,
  },
  // Embriões (semanas 4, 6 e 8): fundo quente escuro, luz principal mais forte que o ambiente, sombra estática.
  organico: {
    tipo: 'organico',
    fundo: '#24151c',
    toneMapping: THREE.NeutralToneMapping,
    exposicao: 1.12,
    ambiente: 0.26,
    hemisferio: { ceu: '#fff5ef', chao: '#47323d', intensidade: 0.3 },
    principal: { posicao: [3, 4, 5], intensidade: 1.3, cor: '#fff8f2' },
    preenchimento: { posicao: [-4, 2, -3], intensidade: 0.42, cor: '#ffffff' },
    luzAmbiente: 0.08,
    sombra: 'pcf',
  },
};

/** Tipo de cada modelo de embriologia (ids de content/embriologia/estagios.json). */
const TIPO_DO_MODELO: Record<string, TipoPerfil> = {
  zigoto: 'cascas',
  clivagem: 'cascas',
  morula: 'cascas',
  blastocisto: 'cascas',
  implantacao: 'cascas',
  'disco-bilaminar': 'cascas',
  'placenta-membranas': 'cascas',
  'coracao-tubular': 'cascas',
  'coracao-alca': 'cascas',
  gastrulacao: 'esquema',
  neurulacao: 'esquema',
  'aparelho-faringeo': 'esquema',
  'septacao-cardiaca': 'esquema',
  'arcos-aorticos': 'esquema',
  'circulacao-fetal': 'esquema',
  'semana-4': 'organico',
  'semana-6': 'organico',
  'semana-8': 'organico',
};

/** Modelos opacos que optam pela sombra de contato (assada num quadro). */
const SOMBRA_CONTATO: Record<string, number> = {
  gastrulacao: 0.5,
  neurulacao: 0.45,
};

export function perfilDoModelo(id: string): Perfil3D {
  const perfil = PERFIS[TIPO_DO_MODELO[id] ?? 'esquema'];
  const contato = SOMBRA_CONTATO[id];
  return contato ? { ...perfil, sombra: 'contato', sombraContato: contato } : perfil;
}
