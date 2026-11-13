// Medalha de conquista e selo de título de nível (desenho em src/ui/insignias.ts).
import type { NomeIcone } from './icones.ts';
import { CAIXA_MEDALHA, CAIXA_SELO, LADO_SELO_COMPACTO, descricaoMedalha, indiceDoSelo, medalhaFormas, seloFormas, type FormaInsignia } from './insignias.ts';

export function Formas({ formas }: { formas: FormaInsignia[] }) {
  return (
    <>
      {formas.map((f, i) => (
        <path
          key={i}
          d={f.d}
          fill={f.f ?? 'none'}
          fillOpacity={f.fo}
          stroke={f.s}
          strokeWidth={f.s ? (f.sw ?? 2) : undefined}
          strokeLinecap={f.s ? (f.reto ? 'butt' : 'round') : undefined}
          strokeLinejoin={f.s ? 'round' : undefined}
          strokeDasharray={f.dash}
          opacity={f.o}
          transform={f.tr}
        />
      ))}
    </>
  );
}

export interface MedalhaProps {
  /** id da conquista (src/core/conquistas.ts) */
  id: string;
  icone: NomeIcone;
  nome: string;
  obtida: boolean;
  /** de 0 a 1 */
  progresso: number;
  /** largura, em px (a altura acompanha a caixa do desenho) */
  tamanho?: number;
}

/** Medalha de uma conquista. O texto alternativo diz se foi obtida ou quanto do caminho já foi feito. */
export function Medalha({ id, icone, nome, obtida, progresso, tamanho = 56 }: MedalhaProps) {
  const estado = { obtida, progresso };
  const [, , w, h] = CAIXA_MEDALHA.split(' ').map(Number);
  return (
    <svg className="medalha" width={tamanho} height={Math.round((tamanho * h) / w)} viewBox={CAIXA_MEDALHA} role="img" aria-label={descricaoMedalha(nome, estado)}>
      <Formas formas={medalhaFormas(id, icone, estado)} />
    </svg>
  );
}

export interface SeloNivelProps {
  /** nível do jogador; o selo é o do título a que o nível pertence */
  nivel?: number;
  /** ou a posição do título (0 = primeiro), para mostrar um título específico */
  indice?: number;
  /** lado, em px; até 22 px o selo é desenhado sem o emblema */
  tamanho?: number;
  /** falso para um título ainda não alcançado */
  ativo?: boolean;
  /** nome acessível; sem ele, o selo fica fora da leitura de tela (o título vem escrito ao lado) */
  rotulo?: string;
}

/** Selo do título de nível. Decorativo por padrão. */
export function SeloNivel({ nivel = 1, indice, tamanho = 24, ativo = true, rotulo }: SeloNivelProps) {
  const i = indice ?? indiceDoSelo(nivel);
  const acess = rotulo ? ({ role: 'img', 'aria-label': rotulo } as const) : ({ 'aria-hidden': true } as const);
  return (
    <svg className="selo-nivel" width={tamanho} height={tamanho} viewBox={CAIXA_SELO} {...acess}>
      <Formas formas={seloFormas(i, { ativo, compacto: tamanho <= LADO_SELO_COMPACTO })} />
    </svg>
  );
}
