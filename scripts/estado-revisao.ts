// Mostra o estado de revisão de todo o conteúdo: agentes por área e conferência médica.
// Uso: npm run revisao
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
type Rev = { agentes: { area: string; veredito: string }[]; humano: { conferidoPor: string; conferidoEm: string } | null };

const linhas: string[][] = [];
let totalQ = 0;
let conferidas = 0;
for (const disc of readdirSync(join(raiz, 'content'))) {
  const pasta = join(raiz, 'content', disc, 'topicos');
  if (!existsSync(pasta)) continue;
  for (const f of readdirSync(pasta).filter((x) => x.endsWith('.json')).sort()) {
    const t = JSON.parse(readFileSync(join(pasta, f), 'utf8')) as { id: string; questoes: unknown[]; revisao: Rev };
    totalQ += t.questoes.length;
    if (t.revisao.humano) conferidas += t.questoes.length;
    linhas.push([
      t.id,
      String(t.questoes.length),
      t.revisao.agentes.map((a) => `${a.area}:${a.veredito}`).join(', ') || '—',
      t.revisao.humano ? `${t.revisao.humano.conferidoPor} (${t.revisao.humano.conferidoEm})` : 'pendente',
    ]);
  }
}
for (const extra of ['content/embriologia/estagios.json', 'content/embriologia/derivados.json', 'content/histologia/modelos3d-a.json', 'content/histologia/modelos3d-b.json']) {
  if (!existsSync(join(raiz, extra))) continue;
  const d = JSON.parse(readFileSync(join(raiz, extra), 'utf8'));
  const lista = d.estagios ?? d.modelos;
  const revs: Rev[] = lista ? lista.map((e: { revisao: Rev }) => e.revisao) : [d.revisao];
  const agentes = [...new Set(revs.flatMap((r) => r.agentes.map((a) => `${a.area}:${a.veredito}`)))].join(', ') || '—';
  const humanos = revs.filter((r) => r.humano).length;
  linhas.push([extra.split('/').pop()!, '—', agentes, `${humanos}/${revs.length} conferidos`]);
}
const larg = [0, 1, 2, 3].map((i) => Math.min(60, Math.max(...linhas.map((l) => l[i].length), 8)));
const cab = ['tópico', 'questões', 'revisão por agentes', 'conferência médica'];
console.log(cab.map((c, i) => c.padEnd(larg[i])).join(' | '));
for (const l of linhas) console.log(l.map((c, i) => (c.length > larg[i] ? c.slice(0, larg[i] - 1) + '…' : c.padEnd(larg[i]))).join(' | '));
console.log(`\nQuestões conferidas por médico: ${conferidas} de ${totalQ}.`);
