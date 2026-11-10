// Regras puras dos jogos do microscópio virtual ("Identifique na lâmina" e "Qual é o tecido?").
// Testes em tests/histologia-jogos.test.ts.
import { criarRng, embaralhar } from '../../core/random.ts';
import { AREA_PADRAO, type LaminaRender } from './laminas/index.ts';

type ComContem = Pick<LaminaRender, 'contem'> | undefined;

/** Partes contidas em `id`, direta ou indiretamente (`contem` é transitivo). */
export function partesDe(render: ComContem, id: string): Set<string> {
  const mapa = render?.contem ?? {};
  const vistas = new Set<string>();
  const fila = [...(mapa[id] ?? [])];
  while (fila.length) {
    const p = fila.pop()!;
    if (vistas.has(p) || p === id) continue;
    vistas.add(p);
    fila.push(...(mapa[p] ?? []));
  }
  return vistas;
}

/** Estruturas que contêm `id`, direta ou indiretamente. */
export function recipientesDe(render: ComContem, id: string): Set<string> {
  return new Set(Object.keys(render?.contem ?? {}).filter((k) => partesDe(render, k).has(id)));
}

/**
 * O toque em `tocado` vale quando o alvo é `alvo`?
 * - Vale se for o próprio alvo, ou uma parte dele declarada em `contem` (centro germinativo quando o alvo é o folículo).
 *   O inverso não vale (folículo quando o alvo é o centro germinativo).
 * - `pilha` (opcional): estruturas sob o ponto tocado, da mais alta para a mais baixa, como devolve o Visor. Serve para
 *   partes que existem em mais de um recipiente (célula epitelial reticular no córtex e na medula do timo; lacuna de
 *   osteócito no ósteon e nas lamelas intersticiais): vale o recipiente que está sob o toque. Se nenhum recipiente
 *   está sob o ponto (toque na borda de uma parte de limite, como o endotélio sobre a luz), vale a declaração, desde
 *   que ela não seja ambígua.
 */
export function toqueAceito(render: ComContem, alvo: string, tocado: string, pilha?: string[]): boolean {
  if (tocado === alvo) return true;
  const partesAlvo = partesDe(render, alvo);
  if (!partesAlvo.has(tocado)) return false;
  if (!pilha) return true;
  const recipientes = recipientesDe(render, tocado);
  // outro recipiente da parte, que não está dentro do alvo nem o contém
  const concorre = (k: string) => k !== alvo && !partesAlvo.has(k) && !partesDe(render, k).has(alvo);
  const sob = pilha.filter((k) => k !== tocado);
  const i = sob.indexOf(alvo);
  if (i >= 0) return !sob.slice(0, i).some((k) => recipientes.has(k) && concorre(k));
  return !sob.some((k) => recipientes.has(k)) && ![...recipientes].some(concorre);
}

/** "do folículo linfoide", "da túnica íntima", "das células cilíndricas ciliadas" (para o cartão de resposta). */
export function contracaoDe(nome: string): string {
  const primeira = nome.split(/[\s(]/)[0].toLowerCase();
  const artigo = primeira.endsWith('as') ? 'das' : primeira.endsWith('os') ? 'dos' : primeira.endsWith('a') ? 'da' : 'do';
  return `${artigo} ${nome.charAt(0).toLowerCase()}${nome.slice(1)}`;
}

// ---------------------------------------------------------------------------------------------
// "Qual é o tecido?"

export interface LaminaTecido {
  id: string;
  tecido: string;
}

/** Lâminas que podem aparecer como alternativa errada quando `l` é a resposta. */
export function distratoresPossiveis<T extends LaminaTecido>(l: LaminaTecido, laminas: T[], renders: Record<string, LaminaRender>): T[] {
  const excluidos = new Set(renders[l.id]?.distratoresExcluidos ?? []);
  return laminas.filter((x) => x.id !== l.id && x.tecido !== l.tecido && !excluidos.has(x.id));
}

export interface Rodada {
  laminaId: string;
  opcoes: string[]; // ids de lâminas
  centro: { x: number; y: number };
}

export function montarRodadas(semente: number, laminas: LaminaTecido[], renders: Record<string, LaminaRender>, rodadas = 10): Rodada[] {
  const rng = criarRng(semente);
  return embaralhar(laminas, rng)
    .slice(0, rodadas)
    .map((l) => {
      // distratores: tecido diferente do correto e fora das exclusões da lâmina (que também descreveriam o campo)
      const outras = embaralhar(distratoresPossiveis(l, laminas, renders), rng).slice(0, 3);
      // o centro do campo de 10× cai na área diagnóstica da lâmina (onde o tecido-resposta aparece)
      const [x0, y0, x1, y1] = renders[l.id]?.areaDiagnostica ?? AREA_PADRAO;
      return {
        laminaId: l.id,
        opcoes: embaralhar([l.id, ...outras.map((x) => x.id)], rng),
        centro: { x: x0 + rng() * (x1 - x0), y: y0 + rng() * (y1 - y0) },
      };
    });
}
