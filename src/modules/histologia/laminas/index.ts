// Registro das lâminas do microscópio virtual (ids = content/histologia/laminas.json).
import type { ReactNode } from 'react';
import type { Rng } from '../he.tsx';
import * as Ep from './epitelios.tsx';
import * as Cj from './conjuntivos.tsx';
import * as Mn from './musculo-nervo.tsx';
import { LAMINAS_SISTEMAS_A } from './sistemas-a.tsx';
import { LAMINAS_SISTEMAS_B } from './sistemas-b.tsx';
import { LAMINAS_SISTEMAS_C } from './sistemas-c.tsx';

export interface LaminaRender {
  desenhar: (rng: Rng) => ReactNode;
  partes: string[];
  /**
   * Retângulo [x0, y0, x1, y1] (coordenadas do SVG 1000×700) onde o jogo "Qual é o tecido?" pode sortear o centro
   * do campo de 10× (300 un). Serve para lâminas em que um campo sorteado fora dele mostraria só conjuntivo ou
   * só neurópilo, sem o aspecto diagnóstico. Sem ele, vale AREA_PADRAO.
   */
  areaDiagnostica?: [number, number, number, number];
  /**
   * Estruturas desenhadas dentro de outra e que fazem parte dela (estrutura → partes). No "Identifique na lâmina",
   * tocar numa parte conta como acerto quando o alvo é a estrutura que a contém (centro germinativo × folículo);
   * o inverso continua erro. Vale transitivamente; quando uma parte está em mais de uma estrutura (célula epitelial
   * reticular no córtex e na medula), decide a posição do toque (ver `toqueAceito` em ../regras.ts).
   */
  contem?: Record<string, string[]>;
  /**
   * Ids de outras lâminas cujo `tecido` não pode aparecer como alternativa no "Qual é o tecido?" quando esta lâmina é a
   * resposta, porque também descreve o campo sorteado na área diagnóstica (ex.: pele fina × "Epitélio estratificado
   * pavimentoso queratinizado").
   */
  distratoresExcluidos?: string[];
}

/** Área de sorteio padrão do centro do campo no jogo "Qual é o tecido?". */
export const AREA_PADRAO: [number, number, number, number] = [250, 200, 750, 500];

export const LAMINAS_RENDER: Record<string, LaminaRender> = {
  // o interstício (fundo de conjuntivo frouxo) é 50–70% de todo campo de 10× e a resposta é um tecido: "conjuntivo frouxo" também vale;
  // o campo são túbulos renais, então "Rim (córtex renal)" também vale
  'epitelio-cubico-rim': { desenhar: Ep.LaminaEpitelioCubico, partes: Ep.PARTES_EPITELIO_CUBICO, distratoresExcluidos: ['conjuntivo-frouxo', 'rim-cortex'] },
  // a lâmina própria (conjuntivo frouxo) chega a 55% do campo e é a maior estrutura em 44% dos campos
  'epitelio-cilindrico-intestino': {
    desenhar: Ep.LaminaEpitelioCilindrico,
    partes: Ep.PARTES_EPITELIO_CILINDRICO,
    contem: { 'epitelio-simples-cilindrico': ['borda-em-escova'], 'lamina-propria': ['capilar'] },
    distratoresExcluidos: ['conjuntivo-frouxo'],
  },
  // epitélio entre y≈175 e 394: o campo precisa pegar cílios e células, não só a lâmina própria
  'epitelio-pseudoestratificado-traqueia': {
    desenhar: Ep.LaminaPseudoestratificado,
    partes: Ep.PARTES_PSEUDOESTRATIFICADO,
    areaDiagnostica: [250, 210, 750, 310],
    // "epitelio-pseudoestratificado" = células cilíndricas ciliadas; os cílios são delas
    contem: { 'epitelio-pseudoestratificado': ['cilios'] },
  },
  // o campo precisa incluir o estrato córneo espesso e o lúcido (y < 200), não só espinhoso e derme
  'pele-espessa': { desenhar: Ep.LaminaEpiderme, partes: Ep.PARTES_EPIDERME, areaDiagnostica: [250, 200, 750, 290] },
  // urotélio entre y≈160 e 420: o campo precisa pegar as células em guarda-chuva
  'epitelio-transicao-bexiga': { desenhar: Ep.LaminaTransicao, partes: Ep.PARTES_TRANSICAO, areaDiagnostica: [250, 200, 750, 310] },
  // septo + estroma entre os ácinos: 13–56% do campo, e mais que os ácinos em 11% dos campos
  'glandula-submandibular': { desenhar: Ep.LaminaGlandula, partes: Ep.PARTES_GLANDULA, distratoresExcluidos: ['conjuntivo-frouxo'] },
  'conjuntivo-frouxo': { desenhar: Cj.LaminaConjuntivo, partes: Cj.PARTES_CONJUNTIVO },
  'tecido-adiposo': { desenhar: Cj.LaminaAdiposo, partes: Cj.PARTES_ADIPOSO },
  // os condrócitos jovens sob o pericôndrio ficam fora dos grupos isógenos: ali, tocar o condrócito não vale pelo grupo
  'cartilagem-hialina': { desenhar: Cj.LaminaCartilagem, partes: Cj.PARTES_CARTILAGEM, contem: { 'grupo-isogeno': ['lacuna', 'condrocito'], lacuna: ['condrocito'] } },
  // lacunas e canalículos existem no ósteon e nas lamelas intersticiais: vale a estrutura sob o toque
  'osso-compacto': {
    desenhar: Cj.LaminaOsso,
    partes: Cj.PARTES_OSSO,
    contem: { osteon: ['canal-de-havers', 'lamelas-concentricas', 'osteocito', 'canaliculos'], 'lamelas-intersticiais': ['osteocito', 'canaliculos'] },
  },
  'esfregaco-sanguineo': { desenhar: Cj.LaminaSangue, partes: Cj.PARTES_SANGUE },
  'musculo-esqueletico': { desenhar: Mn.LaminaMusculoEsqueletico, partes: Mn.PARTES_MUSCULO_ESQUELETICO, contem: { 'fibra-muscular-esqueletica': ['estriacoes-transversais'] } },
  'musculo-cardiaco': { desenhar: Mn.LaminaMusculoCardiaco, partes: Mn.PARTES_MUSCULO_CARDIACO, contem: { 'fibra-muscular-cardiaca': ['disco-intercalar'] } },
  'musculo-liso': { desenhar: Mn.LaminaMusculoLiso, partes: Mn.PARTES_MUSCULO_LISO },
  // o campo precisa mostrar o pericário do neurônio principal (460, 330), não só neurópilo e glia
  'neuronio-medula': {
    desenhar: Mn.LaminaNeuronio,
    partes: Mn.PARTES_NEURONIO,
    areaDiagnostica: [370, 250, 580, 430],
    // "neuronio-multipolar" = corpo (pericário); o Nissl também está na porção proximal dos dendritos
    contem: { 'neuronio-multipolar': ['corpusculos-de-nissl', 'nucleolo', 'cone-de-implantacao'], dendrito: ['corpusculos-de-nissl'] },
  },
  // o fascículo (círculo até a borda externa do perineuro) quase não aparece sozinho: o que se vê dele são perineuro, endoneuro e fibras
  'nervo-periferico': { desenhar: Mn.LaminaNervo, partes: Mn.PARTES_NERVO, contem: { 'fasciculo-nervoso': ['perineuro', 'endoneuro', 'fibra-mielinizada'] } },
  // histologia dos sistemas: um arquivo por grupo, cada um com seu laminas-sistemas-*.json
  ...LAMINAS_SISTEMAS_A,
  ...LAMINAS_SISTEMAS_B,
  ...LAMINAS_SISTEMAS_C,
};
