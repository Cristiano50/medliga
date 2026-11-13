// Catálogo dos itens do avatar e de como cada um é liberado.
// Regras do produto:
// 1. Nada que represente a pessoa fica bloqueado: pele, cabelo, cobertura de cabeça, barba, óculos de uso pessoal,
//    aparelho auditivo, implante coclear e cordão de girassol são sempre livres.
// 2. Item de jogo não disputa vaga com item de identidade: touca, máscara, óculos de proteção e capelo ficam em
//    "paramento"; os itens de corpo ficam em "acessorio".
// 3. Nenhum nome amarra a peça a um gênero.
import type { Categoria, ItemAvatar } from './tipos.ts';

const nivel = (n: number) => ({ tipo: 'nivel', nivel: n }) as const;
const conquista = (id: string) => ({ tipo: 'conquista', id }) as const;

/** Cores de tecido (roupa e cobertura de cabeça). Cada uma é um passo mais escura que o fundo de mesmo nome (contraste ≥ 1,4). */
const TECIDOS: ItemAvatar[] = [
  { id: 'verde-agua', nome: 'Verde-água', cor: '#12a594' },
  { id: 'azul', nome: 'Azul', cor: '#3572c4' },
  { id: 'verde', nome: 'Verde', cor: '#2a977e' },
  { id: 'vinho', nome: 'Vinho', cor: '#8e3b56' },
  { id: 'coral', nome: 'Coral', cor: '#cf4f3c' },
  { id: 'ouro', nome: 'Ouro', cor: '#d9941a' },
  { id: 'violeta', nome: 'Violeta', cor: '#7c5cd6' },
  { id: 'cinza', nome: 'Cinza', cor: '#64748b' },
];

export const CATALOGO: Record<Categoria, ItemAvatar[]> = {
  // Em ordem de luminância. Três subtons: rosado/alaranjado e oliva (amarelado). Nomes neutros.
  pele: [
    { id: 'p1', nome: 'Tom 1', cor: '#fbe4d2' },
    { id: 'p2', nome: 'Tom 2', cor: '#f4cfae' },
    { id: 'o1', nome: 'Tom 3', cor: '#e6c9a0' },
    { id: 'p3', nome: 'Tom 4', cor: '#e6b58c' },
    { id: 'p4', nome: 'Tom 5', cor: '#d29a6c' },
    { id: 'o2', nome: 'Tom 6', cor: '#c49b68' },
    { id: 'p5', nome: 'Tom 7', cor: '#b97d52' },
    { id: 'o3', nome: 'Tom 8', cor: '#8f6a42' },
    { id: 'p6', nome: 'Tom 9', cor: '#99613c' },
    { id: 'm1', nome: 'Tom 10', cor: '#885436' },
    { id: 'p7', nome: 'Tom 11', cor: '#77472c' },
    { id: 'p8', nome: 'Tom 12', cor: '#55301e' },
    { id: 'p9', nome: 'Tom 13', cor: '#3a2015' },
  ],
  rosto: [
    { id: 'sorriso', nome: 'Sorriso', alt: 'sorrindo' },
    { id: 'serio', nome: 'Neutra', alt: 'neutra' },
    { id: 'confiante', nome: 'Confiante', alt: 'confiante' },
    { id: 'alegre', nome: 'Alegre', alt: 'alegre' },
    { id: 'sono', nome: 'Pós-plantão', alt: 'de sono', desbloqueio: conquista('plantonista') },
  ],
  cabelo: [
    { id: 'curto', nome: 'Curto', alt: 'cabelo curto {cor}' },
    { id: 'topete', nome: 'Topete', alt: 'topete {cor}' },
    { id: 'lateral-raspada', nome: 'Lateral raspada', alt: 'cabelo {cor} com a lateral raspada' },
    { id: 'raspado', nome: 'Raspado', alt: 'cabelo raspado {cor}' },
    { id: 'entradas', nome: 'Com entradas', alt: 'cabelo {cor} com entradas' },
    { id: 'calvo-lateral', nome: 'Calvície com laterais', alt: 'calvície com laterais {cores-f}' },
    { id: 'careca', nome: 'Sem cabelo', alt: 'sem cabelo' },
    { id: 'curto-crespo', nome: 'Crespo curto', alt: 'cabelo crespo curto {cor}' },
    { id: 'black-power', nome: 'Black power', alt: 'cabelo black power {cor}' },
    { id: 'crespo-preso', nome: 'Crespo preso', alt: 'cabelo crespo {cor} preso no alto' },
    { id: 'cacheado', nome: 'Cacheado', alt: 'cabelo cacheado {cor}' },
    { id: 'trancas', nome: 'Tranças', alt: 'tranças {cores-f}' },
    { id: 'dreads', nome: 'Dreads', alt: 'dreads {cores-m}' },
    { id: 'ondulado', nome: 'Ondulado', alt: 'cabelo ondulado {cor}' },
    { id: 'liso-medio', nome: 'Liso médio', alt: 'cabelo liso médio {cor}' },
    { id: 'liso-longo', nome: 'Liso longo', alt: 'cabelo liso longo {cor}' },
    { id: 'longo-franja', nome: 'Longo com franja', alt: 'cabelo longo {cor} com franja' },
    { id: 'rabo', nome: 'Rabo de cavalo', alt: 'rabo de cavalo {cor}' },
    { id: 'coque', nome: 'Coque', alt: 'coque {cor}' },
  ],
  corCabelo: [
    { id: 'preto', nome: 'Preto', cor: '#1f1a1e', formas: ['preto', 'pretas', 'pretos'] },
    { id: 'castanho-escuro', nome: 'Castanho-escuro', cor: '#3d2a22', formas: ['castanho-escuro', 'castanho-escuras', 'castanho-escuros'] },
    { id: 'castanho', nome: 'Castanho', cor: '#6b452d', formas: ['castanho', 'castanhas', 'castanhos'] },
    { id: 'ruivo', nome: 'Ruivo', cor: '#b5532a', formas: ['ruivo', 'ruivas', 'ruivos'] },
    { id: 'loiro', nome: 'Loiro', cor: '#dbb46c', formas: ['loiro', 'loiras', 'loiros'] },
    { id: 'grisalho', nome: 'Grisalho', cor: '#aab0ba', formas: ['grisalho', 'grisalhas', 'grisalhos'] },
    { id: 'branco', nome: 'Branco', cor: '#e6e9ee', formas: ['branco', 'brancas', 'brancos'] },
    { id: 'azul', nome: 'Azul', cor: '#2a9bb8', formas: ['azul', 'azuis', 'azuis'], desbloqueio: nivel(5) },
    { id: 'rosa', nome: 'Rosa', cor: '#e05a9c', formas: ['rosa', 'rosa', 'rosa'], desbloqueio: nivel(15) },
    { id: 'violeta', nome: 'Violeta', cor: '#7c5cd6', formas: ['violeta', 'violeta', 'violeta'], desbloqueio: nivel(20) },
  ],
  cabeca: [
    { id: 'nenhum', nome: 'Sem cobertura' },
    { id: 'hijab', nome: 'Hijab', alt: 'hijab' },
    { id: 'turbante', nome: 'Turbante', alt: 'turbante' },
    { id: 'dastar', nome: 'Dastar', alt: 'dastar' },
    { id: 'quipa', nome: 'Quipá', alt: 'quipá' },
  ],
  corCabeca: [
    { id: 'preto', nome: 'Preto', cor: '#23262f' },
    { id: 'branco', nome: 'Branco', cor: '#f4f1ea' },
    { id: 'areia', nome: 'Areia', cor: '#d9c3a5' },
    { id: 'marinho', nome: 'Marinho', cor: '#27407a' },
    ...TECIDOS,
  ],
  barba: [
    { id: 'nenhuma', nome: 'Sem barba' },
    { id: 'bigode', nome: 'Bigode', alt: 'bigode' },
    { id: 'cavanhaque', nome: 'Cavanhaque', alt: 'cavanhaque' },
    { id: 'barba-curta', nome: 'Barba curta', alt: 'barba curta' },
    { id: 'barba-cheia', nome: 'Barba cheia', alt: 'barba cheia' },
  ],
  oculos: [
    { id: 'nenhum', nome: 'Sem óculos' },
    { id: 'redondo', nome: 'Redondos', alt: 'óculos redondos' },
    { id: 'retangular', nome: 'Retangulares', alt: 'óculos retangulares' },
    { id: 'aro-fino', nome: 'Aro fino', alt: 'óculos de aro fino' },
    { id: 'escuros', nome: 'Lentes escuras', alt: 'óculos de lentes escuras' },
  ],
  apoio: [
    { id: 'nenhum', nome: 'Nenhum' },
    { id: 'aparelho-auditivo', nome: 'Aparelho auditivo (um lado)', alt: 'aparelho auditivo' },
    { id: 'aparelho-auditivo-2', nome: 'Aparelhos auditivos (dois lados)', alt: 'aparelhos auditivos' },
    { id: 'implante-coclear', nome: 'Implante coclear (um lado)', alt: 'implante coclear' },
    { id: 'implante-coclear-2', nome: 'Implantes cocleares (dois lados)', alt: 'implantes cocleares' },
    { id: 'girassol', nome: 'Cordão de girassol', alt: 'cordão de girassol' },
  ],
  roupa: [
    { id: 'camiseta', nome: 'Camiseta', alt: 'camiseta' },
    { id: 'jaleco', nome: 'Jaleco', alt: 'jaleco', desbloqueio: nivel(5) },
    { id: 'moletom', nome: 'Moletom da liga', alt: 'moletom da liga', desbloqueio: nivel(15) },
    { id: 'pijama', nome: 'Pijama cirúrgico', alt: 'pijama cirúrgico', desbloqueio: nivel(20) },
    { id: 'capote', nome: 'Capote cirúrgico', alt: 'capote cirúrgico', desbloqueio: nivel(30) },
    { id: 'jaleco-titular', nome: 'Jaleco de titular', alt: 'jaleco de titular', desbloqueio: nivel(50) },
  ],
  corRoupa: TECIDOS,
  acessorio: [
    { id: 'nenhum', nome: 'Sem acessório' },
    { id: 'cracha', nome: 'Crachá', alt: 'crachá', desbloqueio: conquista('primeiro-passo') },
    { id: 'fones', nome: 'Fones', alt: 'fones', desbloqueio: conquista('sequencia-3') },
    { id: 'lanterna', nome: 'Lanterna clínica', alt: 'lanterna clínica', desbloqueio: conquista('dominio-1') },
    { id: 'estetoscopio', nome: 'Estetoscópio', alt: 'estetoscópio', desbloqueio: nivel(10) },
    { id: 'lupa', nome: 'Lupa', alt: 'lupa', desbloqueio: conquista('revisor') },
    { id: 'martelo', nome: 'Martelo de reflexos', alt: 'martelo de reflexos', desbloqueio: conquista('dominio-10') },
    { id: 'canudo', nome: 'Canudo', alt: 'canudo de formatura', desbloqueio: conquista('dominio-todos') },
  ],
  paramento: [
    { id: 'nenhum', nome: 'Nenhum' },
    { id: 'protecao', nome: 'Óculos de proteção', alt: 'óculos de proteção', desbloqueio: conquista('olho-clinico') },
    { id: 'mascara', nome: 'Máscara cirúrgica', alt: 'máscara cirúrgica', desbloqueio: conquista('plantao-perfeito') },
    { id: 'touca', nome: 'Touca cirúrgica', alt: 'touca cirúrgica', desbloqueio: nivel(30) },
    { id: 'capelo', nome: 'Capelo', alt: 'capelo', desbloqueio: conquista('dominio-todos') },
  ],
  // cor: a cor que fica atrás do rosto, usada para avisar quando o avatar se confunde com o fundo
  fundo: [
    { id: 'verde-agua', nome: 'Verde-água', cor: '#2dd4bf' },
    { id: 'ouro', nome: 'Ouro', cor: '#f5b942' },
    { id: 'azul', nome: 'Azul', cor: '#4f8ef7' },
    { id: 'coral', nome: 'Coral', cor: '#f0705a' },
    { id: 'violeta', nome: 'Violeta', cor: '#8b7cf0' },
    { id: 'verde', nome: 'Verde', cor: '#34b98a' },
    { id: 'rosa', nome: 'Rosa', cor: '#ee7fb0' },
    { id: 'ceu', nome: 'Céu', cor: '#7dd3fc' },
    { id: 'ardosia', nome: 'Ardósia', cor: '#33456e' },
    { id: 'noite', nome: 'Noite', cor: '#1a2540' },
    { id: 'faixa', nome: 'Faixa da liga', cor: '#1a2540', desbloqueio: conquista('vestiu-a-camisa') },
    { id: 'folhetos', nome: 'Três folhetos', cor: '#e5534b', desbloqueio: conquista('camadas') },
    { id: 'tempo', nome: 'Mostrador', cor: '#131c30', desbloqueio: conquista('cronologista') },
    { id: 'liga', nome: 'Escudo da liga', cor: '#0f3b46', desbloqueio: conquista('nivel-10') },
  ],
  moldura: [
    { id: 'nenhuma', nome: 'Sem moldura' },
    { id: 'monitor', nome: 'Monitoria', desbloqueio: nivel(5) },
    { id: 'chama', nome: 'Semana cheia', desbloqueio: conquista('sequencia-7') },
    { id: 'ligante', nome: 'Ligante', desbloqueio: nivel(10) },
    { id: 'diretor', nome: 'Diretoria de Liga', desbloqueio: nivel(15) },
    { id: 'interno', nome: 'Internato', desbloqueio: nivel(20) },
    { id: 'chama-dourada', nome: 'Hábito de residente', desbloqueio: conquista('sequencia-30') },
    { id: 'residente', nome: 'Residente', desbloqueio: nivel(30) },
    { id: 'dez-mil', nome: 'Dez mil', desbloqueio: conquista('xp-10000') },
    { id: 'preceptor', nome: 'Preceptoria', desbloqueio: nivel(40) },
    { id: 'titular', nome: 'Titular', desbloqueio: nivel(50) },
  ],
};

export const NOMES_CATEGORIA: Record<Categoria, string> = {
  pele: 'Pele',
  rosto: 'Expressão',
  cabelo: 'Cabelo',
  corCabelo: 'Cor do cabelo',
  cabeca: 'Cobertura de cabeça',
  corCabeca: 'Cor da cobertura',
  barba: 'Barba',
  oculos: 'Óculos',
  apoio: 'Apoio',
  roupa: 'Roupa',
  corRoupa: 'Cor da roupa',
  acessorio: 'Acessório',
  paramento: 'Paramento',
  fundo: 'Fundo',
  moldura: 'Moldura',
};

export function item(categoria: Categoria, id: string): ItemAvatar | undefined {
  return CATALOGO[categoria].find((i) => i.id === id);
}
