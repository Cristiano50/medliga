// Schema do conteúdo didático (fonte da verdade: docs/conteudo-schema.md).
// Compatível com `node --experimental-strip-types` (usado no script de validação do build).
import { z } from 'zod';

const idKebab = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id deve ser kebab-case');

export const RevisaoAgenteSchema = z.object({
  area: z.string(),
  agente: z.string(),
  data: z.string(),
  veredito: z.enum(['aprovado', 'aprovado-com-correcoes', 'reprovado']),
  notas: z.string().optional(),
});

export const RevisaoHumanaSchema = z.object({
  conferidoPor: z.string(),
  conferidoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  registro: z.string().optional(), // ex.: CRM
  notas: z.string().optional(),
});

export const RevisaoSchema = z.object({
  autor: z.string(),
  data: z.string(),
  agentes: z.array(RevisaoAgenteSchema),
  humano: RevisaoHumanaSchema.nullable(),
});

const base = {
  id: z.string().min(3),
  enunciado: z.string().min(5),
  explicacao: z.string().min(10),
  dificuldade: z.number().int().min(1).max(5),
  bloom: z.enum(['lembrar', 'compreender', 'aplicar', 'analisar']),
  tags: z.array(z.string()).default([]),
  referencia: z.string().optional(),
};

export const QuestaoMultiplaSchema = z
  .object({
    ...base,
    tipo: z.literal('multipla'),
    contexto: z.string().optional(),
    alternativas: z.array(z.object({ id: z.string(), texto: z.string().min(1) })).min(4).max(5),
    correta: z.string(),
  })
  .refine((q) => q.alternativas.some((a) => a.id === q.correta), { message: 'correta não existe nas alternativas' })
  .refine((q) => new Set(q.alternativas.map((a) => a.id)).size === q.alternativas.length, {
    message: 'ids de alternativas repetidos',
  });

export const QuestaoVFSchema = z.object({ ...base, tipo: z.literal('vf'), correta: z.boolean() });

export const QuestaoOrdenarSchema = z
  .object({
    ...base,
    tipo: z.literal('ordenar'),
    itens: z.array(z.object({ id: z.string(), texto: z.string().min(1) })).min(3).max(8),
    ordemCorreta: z.array(z.string()),
  })
  .refine(
    (q) =>
      q.ordemCorreta.length === q.itens.length &&
      q.itens.every((i) => q.ordemCorreta.includes(i.id)) &&
      new Set(q.ordemCorreta).size === q.ordemCorreta.length,
    { message: 'ordemCorreta deve conter exatamente os ids dos itens' },
  );

export const QuestaoAssociarSchema = z
  .object({
    ...base,
    tipo: z.literal('associar'),
    pares: z.array(z.object({ esquerda: z.string().min(1), direita: z.string().min(1) })).min(3).max(8),
  })
  .refine((q) => new Set(q.pares.map((p) => p.esquerda)).size === q.pares.length, {
    message: 'itens da esquerda repetidos',
  });

export const QuestaoSchema = z.union([QuestaoMultiplaSchema, QuestaoVFSchema, QuestaoOrdenarSchema, QuestaoAssociarSchema]);

export const EstruturaSchema = z.object({
  id: idKebab,
  nome: z.string(),
  sinonimos: z.array(z.string()).default([]),
  definicao: z.string(),
  origem: z.string().optional(),
  destino: z.string().optional(),
});

export const EventoSchema = z.object({
  id: z.string(),
  descricao: z.string(),
  diaMin: z.number().optional(),
  diaMax: z.number().optional(),
  ordem: z.number(),
});

export const CorrelacaoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string(),
  mecanismo: z.string().optional(),
});

export const TopicoSchema = z.object({
  id: idKebab,
  disciplina: z.string(),
  ordem: z.number().int(),
  titulo: z.string(),
  subtitulo: z.string().optional(),
  periodo: z
    .object({
      diaInicio: z.number().optional(),
      diaFim: z.number().optional(),
      carnegie: z.array(z.number()).default([]),
    })
    .optional(),
  objetivos: z.array(z.string()).default([]),
  resumo: z.string().min(100),
  pontosChave: z.array(z.string()).min(3),
  estruturas: z.array(EstruturaSchema).default([]),
  eventos: z.array(EventoSchema).default([]),
  correlacoesClinicas: z.array(CorrelacaoSchema).default([]),
  questoes: z.array(QuestaoSchema).min(5),
  referencias: z.array(z.object({ obra: z.string(), capitulo: z.string().optional() })).min(1),
  notasDivergencia: z.array(z.string()).default([]),
  incertezas: z.array(z.string()).default([]),
  revisao: RevisaoSchema,
});

// Estágios 3D (content/embriologia/estagios.json)
export const EstagioSchema = z.object({
  id: idKebab,
  /** 'desenvolvimento' = linha do tempo do embrião; 'sistemas' = modelos de órgãos (coração, faringe…) */
  grupo: z.enum(['desenvolvimento', 'sistemas']).default('desenvolvimento'),
  ordem: z.number().int(),
  titulo: z.string(),
  dias: z.string(), // texto, ex.: "≈ 26–28 dias após a fertilização"
  diaReferencia: z.number(), // para o controle deslizante
  carnegie: z.array(z.number()),
  tamanho: z.string().optional(),
  descricao: z.string(),
  destaques: z.array(z.string()),
  topicos: z.array(z.string()), // ids de tópicos relacionados
  estruturas: z.array(
    z.object({ id: idKebab, nome: z.string(), descricao: z.string(), camada: z.string().optional() }),
  ),
  revisao: RevisaoSchema,
});

export const EstagiosArquivoSchema = z.object({ estagios: z.array(EstagioSchema) });

// Triagem de camadas germinativas (content/embriologia/derivados.json)
export const DerivadosArquivoSchema = z.object({
  categorias: z.array(z.object({ id: idKebab, nome: z.string(), cor: z.string() })),
  itens: z.array(
    z.object({
      id: idKebab,
      texto: z.string(),
      categoria: z.string(),
      explicacao: z.string(),
      referencia: z.string().optional(),
    }),
  ),
  revisao: RevisaoSchema,
});

// Lâminas do microscópio virtual (content/histologia/laminas.json)
export const LaminaSchema = z.object({
  id: idKebab,
  ordem: z.number().int(),
  titulo: z.string(),
  /** nome do tecido/órgão usado como resposta no jogo "Qual é o tecido?" */
  tecido: z.string(),
  orgao: z.string(),
  coloracao: z.string(),
  descricao: z.string(),
  destaques: z.array(z.string()),
  topicos: z.array(z.string()),
  estruturas: z.array(z.object({ id: idKebab, nome: z.string(), descricao: z.string() })).min(1),
  revisao: RevisaoSchema,
});
export const LaminasArquivoSchema = z.object({ laminas: z.array(LaminaSchema) });
export type Lamina = z.infer<typeof LaminaSchema>;

export const EscolaSchema = z.object({
  id: idKebab,
  sigla: z.string(),
  nome: z.string(),
  mantenedora: z.string().optional(),
  cidade: z.string(),
  uf: z.string().length(2),
  natureza: z.enum(['publica-federal', 'publica-estadual', 'publica-municipal', 'privada', 'comunitaria']),
  site: z.string().optional(),
});

export const EscolasArquivoSchema = z.object({
  atualizadoEm: z.string(),
  fontes: z.array(z.string()),
  escolas: z.array(EscolaSchema),
});

export type Questao = z.infer<typeof QuestaoSchema>;
export type QuestaoMultipla = z.infer<typeof QuestaoMultiplaSchema>;
export type QuestaoVF = z.infer<typeof QuestaoVFSchema>;
export type QuestaoOrdenar = z.infer<typeof QuestaoOrdenarSchema>;
export type QuestaoAssociar = z.infer<typeof QuestaoAssociarSchema>;
export type Topico = z.infer<typeof TopicoSchema>;
export type Estrutura = z.infer<typeof EstruturaSchema>;
export type Evento = z.infer<typeof EventoSchema>;
export type Estagio = z.infer<typeof EstagioSchema>;
export type DerivadosArquivo = z.infer<typeof DerivadosArquivoSchema>;
export type Escola = z.infer<typeof EscolaSchema>;
export type Revisao = z.infer<typeof RevisaoSchema>;

/** Situação de revisão exibida ao jogador (selo). */
export function seloRevisao(r: Revisao): 'conferido-medico' | 'revisado-ia' | 'pendente' {
  if (r.humano) return 'conferido-medico';
  if (r.agentes.some((a) => a.veredito !== 'reprovado')) return 'revisado-ia';
  return 'pendente';
}
