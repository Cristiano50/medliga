// Acabamentos de superfície dos modelos 3D (padrão, orgânico, úmido, membrana, fibroso).
// MeshPhysicalMaterial com sheen/clearcoat moderados; nunca `transmission` (custa um passe extra por quadro
// e quebra a ordenação das cascas translúcidas). No nível baixo, MeshStandardMaterial equivalente.
// Cor, opacidade, depthWrite e os estados de destaque (selecionado/certo/errado/apagado) seguem iguais:
// quem aplica o estado é a <Parte>, sobre qualquer material desta fábrica.
import { createContext } from 'react';
import * as THREE from 'three';
import type { NivelQualidade } from './qualidade.ts';
import type { TipoPerfil } from './perfis.ts';

export type Acabamento = 'padrao' | 'organico' | 'umido' | 'membrana' | 'fibroso';
export const ACABAMENTOS: readonly Acabamento[] = ['padrao', 'organico', 'umido', 'membrana', 'fibroso'];

export interface ParametrosMaterial {
  cor: string;
  opacidade: number;
  rugosidade: number;
  sombreamentoPlano?: boolean;
}

interface Receita {
  /** rugosidade final a partir da pedida pela parte */
  rugosidade: (r: number) => number;
  fisico: Omit<THREE.MeshPhysicalMaterialParameters, 'color' | 'roughness' | 'opacity' | 'transparent' | 'depthWrite' | 'side' | 'flatShading'>;
  /** clareia a cor do brilho aveludado (sheen) em direção ao branco */
  sheenClaro?: number;
}

const RECEITAS: Record<Acabamento, Receita> = {
  // Superfície de esquema: leve verniz para ler a forma, sem aspecto plástico.
  padrao: { rugosidade: (r) => r, fisico: { specularIntensity: 0.5, clearcoat: 0.06, clearcoatRoughness: 0.6 } },
  // Pele/epitélio: brilho aveludado na borda (sheen) e verniz fosco.
  organico: { rugosidade: (r) => Math.max(r, 0.5), fisico: { specularIntensity: 0.35, sheen: 0.3, sheenRoughness: 0.75, clearcoat: 0.1, clearcoatRoughness: 0.6 }, sheenClaro: 0.45 },
  // Mucosa/líquido: verniz mais liso e reflexo mais definido.
  umido: { rugosidade: (r) => Math.min(r, 0.4), fisico: { specularIntensity: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.3 } },
  // Cascas e membranas (translúcidas): realce de borda pelo sheen, que ajuda a ler a casca sem a "leitar".
  membrana: { rugosidade: (r) => Math.min(Math.max(r, 0.35), 0.55), fisico: { specularIntensity: 0.4, sheen: 0.35, sheenRoughness: 0.5, clearcoat: 0.12, clearcoatRoughness: 0.4 }, sheenClaro: 0.7 },
  // Fibras/tecido conjuntivo: sheen de tecido, sem verniz.
  fibroso: { rugosidade: (r) => Math.max(r, 0.72), fisico: { specularIntensity: 0.3, sheen: 0.5, sheenRoughness: 0.9 }, sheenClaro: 0.3 },
};

function base(p: ParametrosMaterial, cor: THREE.Color, rugosidade: number) {
  return {
    color: cor,
    roughness: rugosidade,
    metalness: 0,
    transparent: p.opacidade < 1,
    opacity: p.opacidade,
    depthWrite: p.opacidade >= 0.98,
    side: THREE.DoubleSide,
    flatShading: !!p.sombreamentoPlano,
  };
}

/** Material de hoje (sem contexto de acabamento): Standard, ou Physical discreto com `acabamentoOrganico`. */
export function materialLegado(p: ParametrosMaterial, acabamentoOrganico: boolean): THREE.MeshStandardMaterial {
  const parametros = base(p, new THREE.Color(p.cor), p.rugosidade);
  const m = acabamentoOrganico
    ? new THREE.MeshPhysicalMaterial({ ...parametros, specularIntensity: 0.35, clearcoat: 0.08, clearcoatRoughness: 0.65, envMapIntensity: 0.15 })
    : new THREE.MeshStandardMaterial(parametros);
  m.userData.organico = acabamentoOrganico;
  return m;
}

/** Ajuste de cor do perfil (ex.: pele menos saturada sob o tone mapping Neutral), sem tocar nos modelos. */
export function ajustarCor(cor: string, saturacao = 1, luminosidade = 1): THREE.Color {
  const c = new THREE.Color(cor);
  if (saturacao === 1 && luminosidade === 1) return c;
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  return c.setHSL(hsl.h, Math.min(1, hsl.s * saturacao), Math.min(1, hsl.l * luminosidade));
}

export interface OpcoesMaterial {
  nivel: NivelQualidade;
  saturacao?: number;
  luminosidade?: number;
  /** marca de sombras do Malha (semana 8): partes com o antigo `acabamentoOrganico` */
  organicoLegado?: boolean;
}

/** Fábrica: Physical com o acabamento pedido; no nível baixo, Standard com a mesma cor e rugosidade. */
export function criarMaterial(acabamento: Acabamento, p: ParametrosMaterial, o: OpcoesMaterial): THREE.MeshStandardMaterial {
  const receita = RECEITAS[acabamento];
  const cor = ajustarCor(p.cor, o.saturacao, o.luminosidade);
  const parametros = base(p, cor, receita.rugosidade(p.rugosidade));
  let m: THREE.MeshStandardMaterial;
  if (o.nivel === 'baixa') {
    m = new THREE.MeshStandardMaterial(parametros);
  } else {
    const fisico = new THREE.MeshPhysicalMaterial({ ...parametros, ...receita.fisico });
    if (receita.sheenClaro !== undefined) fisico.sheenColor.copy(cor).lerp(new THREE.Color('#ffffff'), receita.sheenClaro);
    m = fisico;
  }
  m.userData.organico = !!o.organicoLegado;
  m.userData.acabamento = acabamento;
  return m;
}

/** Acabamento por id de parte (vale para qualquer modelo, quando há contexto de acabamento). */
export const ACABAMENTO_POR_PARTE: Record<string, Acabamento> = {
  // membranas e cascas
  amnio: 'membrana',
  'cavidade-amniotica': 'membrana',
  'corio-liso': 'membrana',
  'corio-frondoso': 'membrana',
  'zona-pelucida': 'membrana',
  'saco-vitelino': 'membrana',
  'cavidade-pericardica': 'membrana',
  'membrana-bucofaringea': 'membrana',
  'membrana-cloacal': 'membrana',
  'membranas-faringeas': 'membrana',
  'lamina-basal': 'membrana',
  // cavidades com líquido e mucosas
  blastocele: 'umido',
  'celoma-extraembrionario': 'umido',
  'celoma-intraembrionario': 'umido',
  'lacunas-trofoblasticas': 'umido',
  endometrio: 'umido',
  'decidua-basal': 'umido',
  'decidua-capsular': 'umido',
  'decidua-parietal': 'umido',
  'cordao-umbilical': 'umido',
  // tecidos fibrosos e musculares
  miometrio: 'fibroso',
  'mesoderma-extraembrionario': 'fibroso',
  'pediculo-de-conexao': 'fibroso',
  'filamento-fino': 'fibroso',
  'filamento-grosso': 'fibroso',
  titina: 'fibroso',
  'filamentos-de-queratina': 'fibroso',
};

/** Acabamento padrão da cena, por perfil, fornecido pelo Cena3D. */
export interface AmbienteAcabamento {
  opaco: Acabamento;
  translucido: Acabamento;
  nivel: NivelQualidade;
  saturacao?: number;
  luminosidade?: number;
}

/** orgânico → orgânico; cascas → membrana nas translúcidas; esquema → padrão. */
export function acabamentoDoPerfil(tipo: TipoPerfil): Pick<AmbienteAcabamento, 'opaco' | 'translucido'> {
  if (tipo === 'organico') return { opaco: 'organico', translucido: 'organico' };
  if (tipo === 'cascas') return { opaco: 'padrao', translucido: 'membrana' };
  return { opaco: 'padrao', translucido: 'padrao' };
}

/** Sem provedor (testes, telas antigas): null = material de hoje. */
export const AcabamentoContext = createContext<AmbienteAcabamento | null>(null);

/**
 * Ordem de escolha: prop `acabamento` → tabela por id → antigo `acabamentoOrganico` → padrão do perfil
 * (opaco/translúcido). Sem contexto e sem prop, devolve null (material de hoje).
 */
export function resolverAcabamento(
  id: string,
  opcoes: { prop?: Acabamento; acabamentoOrganico?: boolean; opacidade: number },
  ambiente: AmbienteAcabamento | null,
): Acabamento | null {
  if (opcoes.prop) return opcoes.prop;
  if (!ambiente) return null;
  return ACABAMENTO_POR_PARTE[id] ?? (opcoes.acabamentoOrganico ? 'organico' : opcoes.opacidade < 1 ? ambiente.translucido : ambiente.opaco);
}
