// Depois do build: confere que a abertura do app não baixa o motor 3D (three.js) nem o cliente do servidor.
// Segue as importações estáticas a partir do ponto de entrada e do App (que o ponto de entrada carrega em seguida)
// e falha se algum desses pacotes aparecer. Uso: node scripts/verificar-pacotes.mjs [pasta do build]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pasta = process.argv[2] ?? 'dist';
const assets = join(pasta, 'assets');
const html = readFileSync(join(pasta, 'index.html'), 'utf8');
const entrada = html.match(/<script type="module"[^>]*src="\.\/assets\/([^"]+)"/)?.[1];
if (!entrada) throw new Error('ponto de entrada não encontrado no index.html');

const estaticas = (arquivo) => {
  const s = readFileSync(join(assets, arquivo), 'utf8');
  return [...s.matchAll(/(?:import|from)\s*"\.\/([^"]+\.js)"/g)].map((m) => m[1]);
};
// a lista de pré-carga que o ponto de entrada usa ao importar o App também é baixada na abertura
const preCargaDoApp = (() => {
  const s = readFileSync(join(assets, entrada), 'utf8');
  const lista = s.match(/m\.f=\[([^\]]*)\]/)?.[1] ?? '';
  return [...lista.matchAll(/"\.\/([^"]+\.js)"/g)].map((m) => m[1]);
})();

const vistos = new Set();
const fila = [entrada, ...preCargaDoApp];
while (fila.length) {
  const a = fila.shift();
  if (vistos.has(a)) continue;
  vistos.add(a);
  fila.push(...estaticas(a));
}
const proibidos = [...vistos].filter((a) => /^(tres|supabase)-/.test(a));
console.log(`abertura do app: ${vistos.size} arquivos JS (${[...vistos].sort().join(', ')})`);
if (proibidos.length) {
  console.error(`ERRO: a abertura do app baixa ${proibidos.join(', ')}. Confira manualChunks em vite.config.ts.`);
  process.exit(1);
}
console.log('OK: o motor 3D e o cliente do servidor ficam fora da abertura.');
