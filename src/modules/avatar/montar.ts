// Monta as camadas do avatar a partir das escolhas do jogador. Puro: serve ao app, aos testes e às pranchas do canvas.
import type { AvatarConfig, Forma } from './tipos.ts';
import { ACESSORIOS, APOIOS, BARBAS, CABELOS, COBERTURAS, FUNDOS, MOLDURAS, OCULOS, PARAMENTOS, PESCOCO, ROSTO_BASE, ROSTOS, ROUPAS } from './pecas.ts';
import { item } from './catalogo.ts';
import { contraste } from './cor.ts';

const TINTA = '#0b1220';

export interface CoresAvatar {
  pele: string;
  cabelo: string;
  roupa: string;
  /** cor da cobertura de cabeça */
  cabeca: string;
  /** marca sobre o cabelo: clara no cabelo escuro, escura no claro */
  marca: string;
}

export interface AvatarMontado {
  /** disco de fundo (não é ampliado no modo compacto) */
  fundo: Forma[];
  /** a pessoa, de trás para a frente; recortada pelo mesmo círculo do fundo */
  pessoa: Forma[];
  /** formas desenhadas por cima do recorte (moldura) */
  fora: Forma[];
  cores: CoresAvatar;
}

/** Até este tamanho (px), o avatar é desenhado no modo compacto. */
export const LADO_COMPACTO = 40;
/**
 * Modo compacto: em tamanhos pequenos (linha do ranking), a pessoa é ampliada 1,3× em torno da cabeça; o fundo e a
 * moldura ficam como estão. A 32 px um olho passa de 1,3 para 1,7 px e o rosto continua legível.
 */
export const TRANSFORMACAO_COMPACTA = 'translate(100 100) scale(1.3) translate(-100 -92)';

export function montarAvatar(c: AvatarConfig): AvatarMontado {
  const corCabelo = item('corCabelo', c.corCabelo)?.cor ?? '#3d2a22';
  const corRoupa = item('corRoupa', c.corRoupa)?.cor ?? '#12a594';
  const cores: CoresAvatar = {
    pele: item('pele', c.pele)?.cor ?? '#d29a6c',
    cabelo: corCabelo,
    roupa: corRoupa,
    cabeca: item('corCabeca', c.corCabeca)?.cor ?? corRoupa,
    marca: contraste(corCabelo, '#ffffff') >= 4.5 ? '#ffffff' : TINTA,
  };

  const paramento = PARAMENTOS[c.paramento];
  const touca = c.paramento === 'touca';
  // A touca cobre o quipá. Sobre o hijab, vai por cima do pano. Sobre o turbante e o dastar ela não cabe:
  // o próprio pano veste a cor da touca (a da roupa) e ganha a faixa na testa.
  const cobertura = touca && COBERTURAS[c.cabeca]?.mantemCabelo ? undefined : COBERTURAS[c.cabeca];
  const toucaNoPano = touca && !!cobertura?.faixaTouca;
  if (toucaNoPano) cores.cabeca = cores.roupa;

  const cabeloBase = CABELOS[c.cabelo] ?? CABELOS.curto;
  const escondeCabelo = touca || (!!cobertura && !cobertura.mantemCabelo);
  // O capelo não assenta sobre turbante nem dastar; o volume do coque some dentro dele.
  const capelo = c.paramento === 'capelo' && !cobertura?.semCapelo;
  const cabelo = escondeCabelo ? { atras: [], frente: [] } : { atras: capelo && cabeloBase.volumeNoTopo ? [] : cabeloBase.atras, frente: cabeloBase.frente };

  // Sombra de raiz: a borda do cabelo sobre a testa, deslocada, em tinta a 20% (separa cabelo e pele de mesma luminância).
  const sombraRaiz: Forma[] = cabelo.frente.filter((f) => f.f === 'cabelo' && f.o === undefined).map((f) => ({ ...f, f: TINTA, o: 0.2, tr: 'translate(0 2.4)' }));

  // O quipá assenta sobre o cabelo, na altura do topo dele.
  const dyQuipa = cobertura?.mantemCabelo && cabeloBase.topo < 59 ? cabeloBase.topo - 43 : 0;
  const frenteCobertura = cobertura ? (dyQuipa ? cobertura.frente.map((f) => ({ ...f, tr: `translate(0 ${dyQuipa})` })) : cobertura.frente) : [];

  const temOmbros = !!cobertura?.ombros.length;
  // Com o pano do hijab sobre os ombros, as pontas dos cordões do moletom não aparecem por baixo dele.
  const roupa = (ROUPAS[c.roupa] ?? ROUPAS.camiseta).filter((f) => !(temOmbros && f.tag === 'cordao'));
  const apoio = APOIOS[c.apoio];
  // O cordão de girassol já leva o cartão: com ele, o crachá não é desenhado por cima.
  const acessorio = c.acessorio === 'cracha' && apoio?.corpo.length ? [] : (ACESSORIOS[c.acessorio] ?? []);
  const noCorpo = [...(apoio?.corpo ?? []), ...acessorio];
  const rosto = ROSTOS[c.rosto] ?? ROSTOS.sorriso;
  const sobre = !paramento ? [] : touca ? (toucaNoPano ? cobertura!.faixaTouca! : paramento.sobre) : c.paramento === 'capelo' && !capelo ? [] : paramento.sobre;

  const pessoa: Forma[] = [
    ...cabelo.atras,
    ...(cobertura?.atras ?? []),
    ...(touca && !toucaNoPano ? paramento.atras : []),
    ...roupa,
    ...PESCOCO,
    // com cobertura de ombros (hijab), o que se usa no corpo vai por cima do pano
    ...(temOmbros ? [] : noCorpo),
    ...(cobertura?.ombros ?? []),
    ...(temOmbros ? noCorpo : []),
    ...ROSTO_BASE,
    ...(apoio?.orelha ?? []),
    ...sombraRaiz,
    ...rosto.olhos,
    ...(BARBAS[c.barba] ?? []),
    ...rosto.boca,
    ...cabelo.frente,
    ...frenteCobertura,
    ...(paramento?.sobOculos ?? []),
    ...(OCULOS[c.oculos] ?? []),
    ...sobre,
  ];
  return { fundo: FUNDOS[c.fundo] ?? FUNDOS.ceu, pessoa, fora: MOLDURAS[c.moldura] ?? [], cores };
}

/** Troca as referências ('pele', 'cabelo', 'roupa', 'cabeca', 'marca') pela cor escolhida. */
export function corDe(cor: string | undefined, cores: CoresAvatar): string | undefined {
  if (cor === 'pele' || cor === 'cabelo' || cor === 'roupa' || cor === 'cabeca' || cor === 'marca') return cores[cor];
  return cor;
}

const num = (n: number) => String(+n.toFixed(2));

/** SVG como texto (prévias, pranchas do canvas e testes). O app usa o componente Avatar, que desenha as mesmas formas. */
export function formaParaSvg(f: Forma, cores: CoresAvatar): string {
  const a: string[] = [];
  a.push(`fill="${corDe(f.f, cores) ?? 'none'}"`);
  if (f.s) a.push(`stroke="${corDe(f.s, cores)}" stroke-width="${num(f.sw ?? 3)}" stroke-linecap="round" stroke-linejoin="round"`);
  if (f.o !== undefined) a.push(`opacity="${num(f.o)}"`);
  if (f.par) a.push('fill-rule="evenodd"');
  if (f.dash) a.push(`stroke-dasharray="${f.dash}"`);
  if (f.tr) a.push(`transform="${f.tr}"`);
  const attrs = a.join(' ');
  if (f.d) return `<path d="${f.d}" ${attrs}/>`;
  if (f.c) return `<circle cx="${num(f.c[0])}" cy="${num(f.c[1])}" r="${num(f.c[2])}" ${attrs}/>`;
  if (f.e) return `<ellipse cx="${num(f.e[0])}" cy="${num(f.e[1])}" rx="${num(f.e[2])}" ry="${num(f.e[3])}" ${attrs}/>`;
  if (f.r) return `<rect x="${num(f.r[0])}" y="${num(f.r[1])}" width="${num(f.r[2])}" height="${num(f.r[3])}" rx="${num(f.r[4])}" ${attrs}/>`;
  return '';
}

/** `lado` (px) liga o modo compacto quando o avatar vai ser mostrado pequeno. */
export function avatarParaSvg(c: AvatarConfig, idRecorte = 'recorte-avatar', lado = 200): string {
  const m = montarAvatar(c);
  const svg = (f: Forma) => formaParaSvg(f, m.cores);
  const pessoa = m.pessoa.map(svg).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<clipPath id="${idRecorte}"><circle cx="100" cy="100" r="100"/></clipPath>` +
    `<g clip-path="url(#${idRecorte})">${m.fundo.map(svg).join('')}${lado <= LADO_COMPACTO ? `<g transform="${TRANSFORMACAO_COMPACTA}">${pessoa}</g>` : pessoa}</g>` +
    m.fora.map(svg).join('') +
    `</svg>`
  );
}
