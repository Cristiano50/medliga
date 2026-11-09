// Gera supabase/seed.sql com o cadastro de escolas e o catálogo de questões (id, tópico, tipo, dificuldade).
// O servidor usa o catálogo para recalcular o XP; rode a cada nova versão do conteúdo.
// Uso: node --experimental-strip-types scripts/gerar-seed.ts
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const linhas: string[] = ['-- Gerado por scripts/gerar-seed.ts — não editar à mão.', 'begin;'];

const escolas = JSON.parse(readFileSync(join(raiz, 'content/escolas/escolas-medicas-br.json'), 'utf8')).escolas as {
  id: string; sigla: string; nome: string; cidade: string; uf: string; natureza: string;
}[];
linhas.push('insert into public.escolas (id, sigla, nome, cidade, uf, natureza) values');
linhas.push(
  escolas.map((e) => `  (${q(e.id)}, ${q(e.sigla)}, ${q(e.nome)}, ${q(e.cidade)}, ${q(e.uf)}, ${q(e.natureza)})`).join(',\n') +
    '\non conflict (id) do update set sigla = excluded.sigla, nome = excluded.nome, cidade = excluded.cidade, uf = excluded.uf, natureza = excluded.natureza;',
);

const questoes: string[] = [];
for (const disc of readdirSync(join(raiz, 'content'))) {
  const pasta = join(raiz, 'content', disc, 'topicos');
  if (!existsSync(pasta)) continue;
  for (const f of readdirSync(pasta).filter((x) => x.endsWith('.json'))) {
    const t = JSON.parse(readFileSync(join(pasta, f), 'utf8'));
    for (const x of t.questoes) questoes.push(`  (${q(x.id)}, ${q(disc)}, ${q(t.id)}, ${q(x.tipo)}, ${Number(x.dificuldade)})`);
  }
}
linhas.push('insert into public.questoes (id, disciplina, topico_id, tipo, dificuldade) values');
linhas.push(
  questoes.join(',\n') +
    '\non conflict (id) do update set disciplina = excluded.disciplina, topico_id = excluded.topico_id, tipo = excluded.tipo, dificuldade = excluded.dificuldade;',
);
linhas.push('commit;');
writeFileSync(join(raiz, 'supabase/seed.sql'), linhas.join('\n') + '\n');
console.log(`seed.sql: ${escolas.length} escolas, ${questoes.length} questões`);
