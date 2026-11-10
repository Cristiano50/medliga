// Valida todo o conteúdo didático. Roda antes do build: qualquer erro interrompe.
// Uso: npm run validar-conteudo
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TopicoSchema,
  EstagiosArquivoSchema,
  DerivadosArquivoSchema,
  EscolasArquivoSchema,
  LaminasArquivoSchema,
} from '../src/content/schema.ts';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const erros: string[] = [];
const avisos: string[] = [];

function ler(caminho: string): unknown {
  try {
    return JSON.parse(readFileSync(caminho, 'utf8'));
  } catch (e) {
    erros.push(`${caminho}: JSON inválido (${(e as Error).message})`);
    return null;
  }
}

function formatarIssues(arquivo: string, issues: { path: PropertyKey[]; message: string }[]) {
  for (const i of issues.slice(0, 20)) erros.push(`${arquivo}: ${i.path.join('.')} — ${i.message}`);
  if (issues.length > 20) erros.push(`${arquivo}: … mais ${issues.length - 20} problemas`);
}

const idsQuestoes = new Map<string, string>();
const idsTopicos = new Set<string>();
const disciplinas = readdirSync(join(raiz, 'content'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(raiz, 'content', d.name, 'topicos')))
  .map((d) => d.name);

let totalQuestoes = 0;
for (const disc of disciplinas) {
  const pasta = join(raiz, 'content', disc, 'topicos');
  for (const nome of readdirSync(pasta).filter((f) => f.endsWith('.json')).sort()) {
    const arq = join(pasta, nome);
    const dado = ler(arq);
    if (!dado) continue;
    const r = TopicoSchema.safeParse(dado);
    if (!r.success) {
      formatarIssues(`content/${disc}/topicos/${nome}`, r.error.issues);
      continue;
    }
    const t = r.data;
    if (`${t.id}.json` !== nome) erros.push(`${nome}: id "${t.id}" diferente do nome do arquivo`);
    if (t.disciplina !== disc) erros.push(`${nome}: disciplina "${t.disciplina}" ≠ pasta "${disc}"`);
    idsTopicos.add(t.id);
    for (const q of t.questoes) {
      const prev = idsQuestoes.get(q.id);
      if (prev) erros.push(`${nome}: questão ${q.id} duplicada (também em ${prev})`);
      idsQuestoes.set(q.id, nome);
      totalQuestoes++;
      if (q.tipo === 'multipla') {
        const textos = q.alternativas.map((a) => a.texto.trim().toLowerCase());
        if (new Set(textos).size !== textos.length) erros.push(`${nome}: ${q.id} tem alternativas com texto repetido`);
        if (textos.some((x) => /todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)/.test(x)))
          erros.push(`${nome}: ${q.id} usa "todas/nenhuma das anteriores" (proibido pela especificação)`);
      }
    }
    // "ordem" repetida = eventos simultâneos ou de ordem controversa (permitido: o jogo usa só um evento por posição).
    const ordens = t.eventos.map((e) => e.ordem);
    if (new Set(ordens).size < 4 && t.eventos.length >= 4)
      avisos.push(`${nome}: menos de 4 posições distintas na linha do tempo (o minijogo não usa este tópico)`);
    if (t.revisao.humano && t.revisao.autor.startsWith('agente')) {
      // Permitido: o humano revisa conteúdo escrito por agente. Só registramos.
    }
  }
}

// Estágios 3D
const arqEstagios = join(raiz, 'content/embriologia/estagios.json');
if (existsSync(arqEstagios)) {
  const r = EstagiosArquivoSchema.safeParse(ler(arqEstagios));
  if (!r.success) formatarIssues('content/embriologia/estagios.json', r.error.issues);
  else {
    const ids = r.data.estagios.map((e) => e.id);
    if (new Set(ids).size !== ids.length) erros.push('estagios.json: ids de estágio repetidos');
    for (const e of r.data.estagios)
      for (const tp of e.topicos)
        if (!idsTopicos.has(tp)) avisos.push(`estagios.json: estágio ${e.id} cita tópico inexistente ${tp}`);
  }
}

const arqDerivados = join(raiz, 'content/embriologia/derivados.json');
if (existsSync(arqDerivados)) {
  const r = DerivadosArquivoSchema.safeParse(ler(arqDerivados));
  if (!r.success) formatarIssues('content/embriologia/derivados.json', r.error.issues);
  else {
    const cats = new Set(r.data.categorias.map((c) => c.id));
    for (const i of r.data.itens)
      if (!cats.has(i.categoria)) erros.push(`derivados.json: item ${i.id} com categoria inexistente ${i.categoria}`);
  }
}

// Lâminas: laminas.json (geral) + laminas-*.json (sistemas), validadas em conjunto (ids e ordens únicos).
const dirHis = join(raiz, 'content/histologia');
const arquivosLaminas = existsSync(dirHis) ? readdirSync(dirHis).filter((f) => /^laminas.*\.json$/.test(f)).sort() : [];
const todasLaminas: { id: string; ordem: number; topicos: string[] }[] = [];
for (const f of arquivosLaminas) {
  const r = LaminasArquivoSchema.safeParse(ler(join(dirHis, f)));
  if (!r.success) { formatarIssues(`content/histologia/${f}`, r.error.issues); continue; }
  for (const l of r.data.laminas) {
    todasLaminas.push(l);
    for (const tp of l.topicos) if (!idsTopicos.has(tp)) avisos.push(`${f}: lâmina ${l.id} cita tópico inexistente ${tp}`);
  }
}
{
  const ids = todasLaminas.map((l) => l.id);
  if (new Set(ids).size !== ids.length) erros.push('lâminas: ids repetidos entre os arquivos laminas*.json');
  const ordens = todasLaminas.map((l) => l.ordem);
  if (new Set(ordens).size !== ordens.length) erros.push('lâminas: valores de "ordem" repetidos entre os arquivos laminas*.json');
}

const arqEscolas = join(raiz, 'content/escolas/escolas-medicas-br.json');
let totalEscolas = 0;
if (existsSync(arqEscolas)) {
  const r = EscolasArquivoSchema.safeParse(ler(arqEscolas));
  if (!r.success) formatarIssues('content/escolas/escolas-medicas-br.json', r.error.issues);
  else {
    const ids = r.data.escolas.map((e) => e.id);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) erros.push(`escolas: ids repetidos: ${[...new Set(dup)].join(', ')}`);
    totalEscolas = ids.length;
  }
}

for (const a of avisos) console.warn('AVISO', a);
if (erros.length) {
  for (const e of erros) console.error('ERRO', e);
  console.error(`\n${erros.length} erro(s) no conteúdo.`);
  process.exit(1);
}
console.log(
  `Conteúdo OK — disciplinas: ${disciplinas.join(', ') || '(nenhuma)'}; tópicos: ${idsTopicos.size}; questões: ${totalQuestoes}; escolas: ${totalEscolas}.`,
);
