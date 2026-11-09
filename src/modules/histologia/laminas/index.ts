// Registro das lâminas do microscópio virtual (ids = content/histologia/laminas.json).
import type { ReactNode } from 'react';
import type { Rng } from '../he.tsx';
import * as Ep from './epitelios.tsx';
import * as Cj from './conjuntivos.tsx';
import * as Mn from './musculo-nervo.tsx';

export interface LaminaRender {
  desenhar: (rng: Rng) => ReactNode;
  partes: string[];
  /**
   * Retângulo [x0, y0, x1, y1] (coordenadas do SVG 1000×700) onde o jogo "Qual é o tecido?" pode sortear o centro
   * do campo de 10× (300 un). Serve para lâminas em que um campo sorteado fora dele mostraria só conjuntivo ou
   * só neurópilo, sem o aspecto diagnóstico. Sem ele, vale AREA_PADRAO.
   */
  areaDiagnostica?: [number, number, number, number];
}

/** Área de sorteio padrão do centro do campo no jogo "Qual é o tecido?". */
export const AREA_PADRAO: [number, number, number, number] = [250, 200, 750, 500];

export const LAMINAS_RENDER: Record<string, LaminaRender> = {
  'epitelio-cubico-rim': { desenhar: Ep.LaminaEpitelioCubico, partes: Ep.PARTES_EPITELIO_CUBICO },
  'epitelio-cilindrico-intestino': { desenhar: Ep.LaminaEpitelioCilindrico, partes: Ep.PARTES_EPITELIO_CILINDRICO },
  // epitélio entre y≈175 e 394: o campo precisa pegar cílios e células, não só a lâmina própria
  'epitelio-pseudoestratificado-traqueia': { desenhar: Ep.LaminaPseudoestratificado, partes: Ep.PARTES_PSEUDOESTRATIFICADO, areaDiagnostica: [250, 210, 750, 310] },
  // o campo precisa incluir o estrato córneo espesso e o lúcido (y < 200), não só espinhoso e derme
  'pele-espessa': { desenhar: Ep.LaminaEpiderme, partes: Ep.PARTES_EPIDERME, areaDiagnostica: [250, 200, 750, 290] },
  // urotélio entre y≈160 e 420: o campo precisa pegar as células em guarda-chuva
  'epitelio-transicao-bexiga': { desenhar: Ep.LaminaTransicao, partes: Ep.PARTES_TRANSICAO, areaDiagnostica: [250, 200, 750, 310] },
  'glandula-submandibular': { desenhar: Ep.LaminaGlandula, partes: Ep.PARTES_GLANDULA },
  'conjuntivo-frouxo': { desenhar: Cj.LaminaConjuntivo, partes: Cj.PARTES_CONJUNTIVO },
  'tecido-adiposo': { desenhar: Cj.LaminaAdiposo, partes: Cj.PARTES_ADIPOSO },
  'cartilagem-hialina': { desenhar: Cj.LaminaCartilagem, partes: Cj.PARTES_CARTILAGEM },
  'osso-compacto': { desenhar: Cj.LaminaOsso, partes: Cj.PARTES_OSSO },
  'esfregaco-sanguineo': { desenhar: Cj.LaminaSangue, partes: Cj.PARTES_SANGUE },
  'musculo-esqueletico': { desenhar: Mn.LaminaMusculoEsqueletico, partes: Mn.PARTES_MUSCULO_ESQUELETICO },
  'musculo-cardiaco': { desenhar: Mn.LaminaMusculoCardiaco, partes: Mn.PARTES_MUSCULO_CARDIACO },
  'musculo-liso': { desenhar: Mn.LaminaMusculoLiso, partes: Mn.PARTES_MUSCULO_LISO },
  // o campo precisa mostrar o pericário do neurônio principal (460, 330), não só neurópilo e glia
  'neuronio-medula': { desenhar: Mn.LaminaNeuronio, partes: Mn.PARTES_NEURONIO, areaDiagnostica: [370, 250, 580, 430] },
  'nervo-periferico': { desenhar: Mn.LaminaNervo, partes: Mn.PARTES_NERVO },
};
