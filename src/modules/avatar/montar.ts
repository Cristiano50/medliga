// Monta as camadas do avatar a partir das escolhas do jogador. Puro: serve ao app, aos testes e às pranchas do canvas.
import type { AvatarConfig, Forma } from './tipos.ts';
import { ACESSORIOS, BARBAS, CABELOS, COBERTURAS, FUNDOS, MOLDURAS, OCULOS, PESCOCO, ROSTO_BASE, ROSTOS, ROUPAS } from './pecas.ts';
import { item } from './catalogo.ts';

export interface AvatarMontado {
  /** formas recortadas pelo círculo da moldura, de trás para a frente */
  dentro: Forma[];
  /** formas desenhadas por cima do recorte (moldura) */
  fora: Forma[];
  cores: { pele: string; cabelo: string; roupa: string };
}

export function montarAvatar(c: AvatarConfig): AvatarMontado {
  const cores = {
    pele: item('pele', c.pele)?.cor ?? '#d29a6c',
    cabelo: item('corCabelo', c.corCabelo)?.cor ?? '#3d2a22',
    roupa: item('corRoupa', c.corRoupa)?.cor ?? '#2dd4bf',
  };
  const cobertura = COBERTURAS[c.cabeca];
  // A cobertura de cabeça esconde o cabelo; a barba continua aparecendo.
  const cabelo = cobertura ? { atras: [], frente: [] } : (CABELOS[c.cabelo] ?? CABELOS.curto);
  const rosto = ROSTOS[c.rosto] ?? ROSTOS.sorriso;
  const acessorio = ACESSORIOS[c.acessorio];
  const dentro: Forma[] = [
    ...(FUNDOS[c.fundo] ?? FUNDOS['verde-agua']),
    ...cabelo.atras,
    ...(cobertura?.atras ?? []),
    ...(ROUPAS[c.roupa] ?? ROUPAS.camiseta),
    ...PESCOCO,
    ...(acessorio?.corpo ?? []),
    ...(cobertura?.ombros ?? []),
    ...ROSTO_BASE,
    ...rosto.olhos,
    ...(BARBAS[c.barba] ?? []),
    ...rosto.boca,
    ...cabelo.frente,
    ...(cobertura?.frente ?? []),
    ...(OCULOS[c.oculos] ?? []),
    ...(acessorio?.rosto ?? []),
  ];
  return { dentro, fora: MOLDURAS[c.moldura] ?? [], cores };
}

/** Troca as referências 'pele', 'cabelo' e 'roupa' pela cor escolhida. */
export function corDe(cor: string | undefined, cores: AvatarMontado['cores']): string | undefined {
  if (cor === 'pele' || cor === 'cabelo' || cor === 'roupa') return cores[cor];
  return cor;
}

const num = (n: number) => String(+n.toFixed(2));

/** SVG como texto (prévias, pranchas do canvas e testes). O app usa o componente Avatar, que desenha as mesmas formas. */
export function formaParaSvg(f: Forma, cores: AvatarMontado['cores']): string {
  const a: string[] = [];
  a.push(`fill="${corDe(f.f, cores) ?? 'none'}"`);
  if (f.s) a.push(`stroke="${corDe(f.s, cores)}" stroke-width="${num(f.sw ?? 3)}" stroke-linecap="round" stroke-linejoin="round"`);
  if (f.o !== undefined) a.push(`opacity="${num(f.o)}"`);
  if (f.par) a.push('fill-rule="evenodd"');
  if (f.dash) a.push(`stroke-dasharray="${f.dash}"`);
  const attrs = a.join(' ');
  if (f.d) return `<path d="${f.d}" ${attrs}/>`;
  if (f.c) return `<circle cx="${num(f.c[0])}" cy="${num(f.c[1])}" r="${num(f.c[2])}" ${attrs}/>`;
  if (f.e) return `<ellipse cx="${num(f.e[0])}" cy="${num(f.e[1])}" rx="${num(f.e[2])}" ry="${num(f.e[3])}" ${attrs}/>`;
  if (f.r) return `<rect x="${num(f.r[0])}" y="${num(f.r[1])}" width="${num(f.r[2])}" height="${num(f.r[3])}" rx="${num(f.r[4])}" ${attrs}/>`;
  return '';
}

export function avatarParaSvg(c: AvatarConfig, idRecorte = 'recorte-avatar'): string {
  const m = montarAvatar(c);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<clipPath id="${idRecorte}"><circle cx="100" cy="100" r="100"/></clipPath>` +
    `<g clip-path="url(#${idRecorte})">${m.dentro.map((f) => formaParaSvg(f, m.cores)).join('')}</g>` +
    m.fora.map((f) => formaParaSvg(f, m.cores)).join('') +
    `</svg>`
  );
}
