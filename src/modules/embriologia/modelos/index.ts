// Registro dos modelos 3D por estágio (ids = content/embriologia/estagios.json).
import type { ComponentType } from 'react';
import { ModeloZigoto, ModeloClivagem, ModeloMorula, ModeloBlastocisto, PARTES_ZIGOTO, PARTES_CLIVAGEM, PARTES_MORULA, PARTES_BLASTOCISTO } from './inicio.tsx';
import { ModeloImplantacao, ModeloDiscoBilaminar, PARTES_IMPLANTACAO, PARTES_DISCO_BILAMINAR } from './implantacao.tsx';
import { ModeloGastrulacao, ModeloNeurulacao, PARTES_GASTRULACAO, PARTES_NEURULACAO } from './disco.tsx';
import { ModeloSemana4, ModeloSemana6, ModeloSemana8, PARTES_SEMANA_4, PARTES_SEMANA_6, PARTES_SEMANA_8 } from './embriao.tsx';
import { ModeloPlacenta, PARTES_PLACENTA } from './placenta.tsx';

export interface ModeloEstagio {
  Componente: ComponentType;
  partes: string[];
  /** direção de onde a câmera olha (normalizada no uso) */
  camera: [number, number, number];
  /** raio aproximado do modelo, para enquadrar automaticamente */
  raio: number;
  /** legenda de cores das camadas germinativas */
  legendaCamadas?: boolean;
}

export const MODELOS: Record<string, ModeloEstagio> = {
  zigoto: { Componente: ModeloZigoto, partes: PARTES_ZIGOTO, camera: [0, 0.6, 3.6], raio: 1.3 },
  clivagem: { Componente: ModeloClivagem, partes: PARTES_CLIVAGEM, camera: [0, 0.6, 3.6], raio: 1.3 },
  morula: { Componente: ModeloMorula, partes: PARTES_MORULA, camera: [0, 0.6, 3.6], raio: 1.3 },
  blastocisto: { Componente: ModeloBlastocisto, partes: PARTES_BLASTOCISTO, camera: [0, 0.4, 3.6], raio: 1.3 },
  implantacao: { Componente: ModeloImplantacao, partes: PARTES_IMPLANTACAO, camera: [0.4, 0.9, 3.8], raio: 1.75 },
  'disco-bilaminar': { Componente: ModeloDiscoBilaminar, partes: PARTES_DISCO_BILAMINAR, camera: [0.5, 1.5, 4.2], raio: 1.8 },
  gastrulacao: { Componente: ModeloGastrulacao, partes: PARTES_GASTRULACAO, camera: [0.9, 1.6, 3.2], raio: 1.6, legendaCamadas: true },
  neurulacao: { Componente: ModeloNeurulacao, partes: PARTES_NEURULACAO, camera: [0.6, 1.6, 3.6], raio: 1.75, legendaCamadas: true },
  'semana-4': { Componente: ModeloSemana4, partes: PARTES_SEMANA_4, camera: [0, 0.2, 3.6], raio: 1.35 },
  'semana-6': { Componente: ModeloSemana6, partes: PARTES_SEMANA_6, camera: [0, 0.2, 3.8], raio: 1.55 },
  'semana-8': { Componente: ModeloSemana8, partes: PARTES_SEMANA_8, camera: [0, 0.2, 3.6], raio: 1.45 },
  'placenta-membranas': { Componente: ModeloPlacenta, partes: PARTES_PLACENTA, camera: [0.2, 0.4, 5.4], raio: 2.1 },
};

/** Nomes de partes que não são estruturas do conteúdo (só exibição). */
export const NOMES_EXTRAS: Record<string, string> = {
  corpo: 'Corpo do embrião',
};
