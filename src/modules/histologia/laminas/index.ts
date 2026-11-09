// Registro das lâminas do microscópio virtual (ids = content/histologia/laminas.json).
import type { ReactNode } from 'react';
import type { Rng } from '../he.tsx';
import * as Ep from './epitelios.tsx';
import * as Cj from './conjuntivos.tsx';
import * as Mn from './musculo-nervo.tsx';

export interface LaminaRender {
  desenhar: (rng: Rng) => ReactNode;
  partes: string[];
}

export const LAMINAS_RENDER: Record<string, LaminaRender> = {
  'epitelio-cubico-rim': { desenhar: Ep.LaminaEpitelioCubico, partes: Ep.PARTES_EPITELIO_CUBICO },
  'epitelio-cilindrico-intestino': { desenhar: Ep.LaminaEpitelioCilindrico, partes: Ep.PARTES_EPITELIO_CILINDRICO },
  'epitelio-pseudoestratificado-traqueia': { desenhar: Ep.LaminaPseudoestratificado, partes: Ep.PARTES_PSEUDOESTRATIFICADO },
  'pele-espessa': { desenhar: Ep.LaminaEpiderme, partes: Ep.PARTES_EPIDERME },
  'epitelio-transicao-bexiga': { desenhar: Ep.LaminaTransicao, partes: Ep.PARTES_TRANSICAO },
  'glandula-submandibular': { desenhar: Ep.LaminaGlandula, partes: Ep.PARTES_GLANDULA },
  'conjuntivo-frouxo': { desenhar: Cj.LaminaConjuntivo, partes: Cj.PARTES_CONJUNTIVO },
  'tecido-adiposo': { desenhar: Cj.LaminaAdiposo, partes: Cj.PARTES_ADIPOSO },
  'cartilagem-hialina': { desenhar: Cj.LaminaCartilagem, partes: Cj.PARTES_CARTILAGEM },
  'osso-compacto': { desenhar: Cj.LaminaOsso, partes: Cj.PARTES_OSSO },
  'esfregaco-sanguineo': { desenhar: Cj.LaminaSangue, partes: Cj.PARTES_SANGUE },
  'musculo-esqueletico': { desenhar: Mn.LaminaMusculoEsqueletico, partes: Mn.PARTES_MUSCULO_ESQUELETICO },
  'musculo-cardiaco': { desenhar: Mn.LaminaMusculoCardiaco, partes: Mn.PARTES_MUSCULO_CARDIACO },
  'musculo-liso': { desenhar: Mn.LaminaMusculoLiso, partes: Mn.PARTES_MUSCULO_LISO },
  'neuronio-medula': { desenhar: Mn.LaminaNeuronio, partes: Mn.PARTES_NEURONIO },
  'nervo-periferico': { desenhar: Mn.LaminaNervo, partes: Mn.PARTES_NERVO },
};
