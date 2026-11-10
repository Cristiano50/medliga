#!/usr/bin/env node
// Medição do laboratório 3D: percorre modelo × nível de qualidade no build de produção (vite preview),
// registra renderer.info (via window.__diag3d) e uma contagem independente feita no próprio contexto WebGL
// (chamadas de desenho, triângulos, programas vivos), tira capturas do palco em deviceScaleFactor 2 e
// grava os tempos de quadro de um giro simulado com o mouse.
//
// Uso: npm run build && npm run medir-3d -- [opções]
//   --url http://127.0.0.1:4173   usa um servidor já aberto (senão sobe `vite preview` em --porta com --dist)
//   --dist dist                    pasta do build servida pelo preview
//   --porta 4173
//   --saida medicoes-3d            pasta de saída (JSON, tabela em Markdown e capturas)
//   --modelos zigoto,semana-8      padrão: todos os estágios de content/embriologia/estagios.json
//   --niveis baixa,media,alta      níveis de src/modules/tres3d/qualidade.ts; "auto" = sem override
//   --viewport 390x844             tamanho da janela (CSS px)
//   --escala 2                     deviceScaleFactor
//   --sem-giro --sem-capturas --com-marcadores
//
// Playwright não é dependência do projeto: o script usa o pacote instalado no sistema (NODE_PATH) ou no projeto.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : padrao;
};
const marcado = (nome) => args.includes(`--${nome}`);

function carregarPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright'); } catch { /* tenta o pacote global */ }
  for (const base of (process.env.NODE_PATH ?? '').split(':').filter(Boolean).concat(['/opt/node-tools/node_modules'])) {
    try { return createRequire(join(base, 'x.js'))('playwright'); } catch { /* próximo */ }
  }
  console.error('Playwright não encontrado. Instale com `npm i -g playwright && npx playwright install chromium`.');
  process.exit(2);
}

const estagios = JSON.parse(readFileSync(join(raiz, 'content/embriologia/estagios.json'), 'utf8'));
const listaEstagios = (Array.isArray(estagios) ? estagios : estagios.estagios ?? []).map((e) => e.id);
const modelos = (opcao('modelos', '') || listaEstagios.join(',')).split(',').filter(Boolean);
const niveis = opcao('niveis', 'baixa,media,alta').split(',').filter(Boolean);
const saida = resolve(opcao('saida', join(raiz, 'medicoes-3d')));
const [vw, vh] = opcao('viewport', '390x844').split('x').map(Number);
const escala = Number(opcao('escala', '2'));
const porta = Number(opcao('porta', '4173'));
const dist = resolve(opcao('dist', join(raiz, 'dist')));

/** Instrumentação do contexto WebGL: independe do código do app, então vale também para a medição de base. */
const INSTRUMENTO = () => {
  const est = { quadro: 0, quadros: [], vivos: 0, criados: 0 };
  window.__glMedida = est;
  let atual = null;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => { est.quadro++; return cb(t); });
  const registrar = (modo, n, instancias) => {
    const agora = performance.now();
    if (!atual || atual.id !== est.quadro) {
      atual = { id: est.quadro, inicio: agora, fim: agora, chamadas: 0, triangulos: 0 };
      est.quadros.push(atual);
      if (est.quadros.length > 900) est.quadros.shift();
    }
    atual.chamadas++;
    atual.fim = agora;
    if (modo === 4) atual.triangulos += Math.floor(n / 3) * instancias;
  };
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
    const ctx = original.call(this, tipo, ...resto);
    if (ctx && /webgl/.test(String(tipo)) && !ctx.__medido) {
      ctx.__medido = true;
      const de = ctx.drawElements.bind(ctx);
      ctx.drawElements = (m, n, t, o) => { registrar(m, n, 1); return de(m, n, t, o); };
      const da = ctx.drawArrays.bind(ctx);
      ctx.drawArrays = (m, p, n) => { registrar(m, n, 1); return da(m, p, n); };
      if (ctx.drawElementsInstanced) {
        const dei = ctx.drawElementsInstanced.bind(ctx);
        ctx.drawElementsInstanced = (m, n, t, o, k) => { registrar(m, n, k); return dei(m, n, t, o, k); };
        const dai = ctx.drawArraysInstanced.bind(ctx);
        ctx.drawArraysInstanced = (m, p, n, k) => { registrar(m, n, k); return dai(m, p, n, k); };
      }
      const cp = ctx.createProgram.bind(ctx);
      ctx.createProgram = () => { est.vivos++; est.criados++; return cp(); };
      const dp = ctx.deleteProgram.bind(ctx);
      ctx.deleteProgram = (p) => { if (p) est.vivos--; return dp(p); };
    }
    return ctx;
  };
};

const mediana = (xs) => {
  if (!xs.length) return null;
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.floor(o.length / 2)];
};
const percentil = (xs, p) => {
  if (!xs.length) return null;
  const o = [...xs].sort((a, b) => a - b);
  return o[Math.min(o.length - 1, Math.floor(o.length * p))];
};

async function esperarServidor(url, limiteMs = 30000) {
  const fim = Date.now() + limiteMs;
  while (Date.now() < fim) {
    try { if ((await fetch(url)).ok) return true; } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

async function main() {
  const { chromium } = carregarPlaywright();
  let servidor = null;
  let base = opcao('url', '');
  if (!base) {
    if (!existsSync(join(dist, 'index.html'))) {
      console.error(`Build não encontrado em ${dist}. Rode \`npm run build\` antes.`);
      process.exit(2);
    }
    base = `http://127.0.0.1:${porta}`;
    servidor = spawn('npx', ['vite', 'preview', '--port', String(porta), '--strictPort', '--host', '127.0.0.1', '--outDir', dist], { cwd: raiz, stdio: 'ignore' });
    if (!(await esperarServidor(base))) { servidor.kill(); throw new Error('vite preview não respondeu'); }
  }
  base = base.replace(/\/$/, '');
  mkdirSync(saida, { recursive: true });

  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const resultados = [];
  const erros = [];
  try {
    for (const nivel of niveis) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: escala, serviceWorkers: 'block' });
      await ctx.addInitScript(INSTRUMENTO);
      await ctx.addInitScript((n) => {
        try {
          localStorage.setItem('medliga:diag3d', '1');
          if (n === 'auto') localStorage.removeItem('medliga:qualidade3d'); else localStorage.setItem('medliga:qualidade3d', n);
          localStorage.removeItem('medliga:dprMovimento');
        } catch { /* sem armazenamento */ }
      }, nivel);
      const page = await ctx.newPage();
      page.on('pageerror', (e) => erros.push(`${nivel}: ${e.message}`));
      // Perfil semeado pelo próprio onboarding (o laboratório exige um perfil).
      await page.goto(`${base}/`);
      await page.waitForSelector('#nome', { timeout: 30000 });
      await page.fill('#nome', 'Medição 3D');
      await page.click('text=Continuar');
      await page.click('text=Pular por agora');
      await page.check('input[type=checkbox]');
      await page.click('text=Começar a jogar');
      await page.waitForSelector('text=Meta do dia', { timeout: 30000 });
      mkdirSync(join(saida, nivel), { recursive: true });

      for (const id of modelos) {
        await page.goto('about:blank');
        await page.goto(`${base}/#/lab3d?estagio=${id}`);
        await page.waitForSelector('.palco3d canvas', { timeout: 30000 });
        await page.evaluate(() => document.querySelector('.palco3d')?.scrollIntoView({ block: 'center' }));
        // Estável: um quadro desenhado e nenhum quadro novo por 600 ms.
        const estavel = async (limite = 20000) => {
          const fim = Date.now() + limite;
          let ultimo = -1, desde = Date.now();
          while (Date.now() < fim) {
            const q = await page.evaluate(() => window.__glMedida?.quadros.at(-1)?.id ?? -1);
            if (q !== ultimo) { ultimo = q; desde = Date.now(); } else if (q >= 0 && Date.now() - desde > 600) return true;
            await page.waitForTimeout(100);
          }
          return false;
        };
        const t0 = Date.now();
        await estavel();
        const carregamentoMs = Date.now() - t0;
        const parado = await page.evaluate(() => {
          const c = document.querySelector('.palco3d canvas');
          const g = window.__glMedida;
          const q = g?.quadros.at(-1);
          return {
            dpr: c ? +(c.width / c.getBoundingClientRect().width).toFixed(3) : null,
            canvas: c ? [c.width, c.height] : null,
            gl: q ? { chamadas: q.chamadas, triangulos: q.triangulos, programasVivos: g.vivos } : null,
            diag: window.__diag3d ? JSON.parse(JSON.stringify(window.__diag3d)) : null,
          };
        });
        if (!marcado('sem-capturas')) await page.locator('.palco3d').screenshot({ path: join(saida, nivel, `${id}.png`) });
        let giro = null;
        if (!marcado('sem-giro')) {
          await page.evaluate(() => document.querySelector('.palco3d')?.scrollIntoView({ block: 'center' }));
          await page.waitForTimeout(100);
          const caixa = await page.locator('.palco3d canvas').boundingBox();
          const x0 = caixa.x + caixa.width / 2, y0 = caixa.y + caixa.height / 2;
          const antes = await page.evaluate(() => window.__glMedida.quadro);
          await page.mouse.move(x0, y0);
          await page.mouse.down();
          let dprMovimento = null;
          for (let i = 1; i <= 45; i++) {
            await page.mouse.move(x0 + Math.sin(i / 45 * Math.PI * 2) * caixa.width * 0.3, y0 + Math.sin(i / 15) * 12);
            await page.waitForTimeout(16);
            if (i === 30) dprMovimento = await page.evaluate(() => { const c = document.querySelector('.palco3d canvas'); return +(c.width / c.getBoundingClientRect().width).toFixed(3); });
          }
          await page.mouse.up();
          const fimGiro = await page.evaluate(() => window.__glMedida.quadro);
          await estavel(8000);
          giro = await page.evaluate(([a, b]) => {
            const qs = window.__glMedida.quadros.filter((q) => q.id > a && q.id <= b);
            const intervalos = qs.slice(1).map((q, i) => q.inicio - qs[i].inicio);
            const c = document.querySelector('.palco3d canvas');
            return { quadros: qs.length, intervalos, envio: qs.map((q) => q.fim - q.inicio), dprDepois: +(c.width / c.getBoundingClientRect().width).toFixed(3), diag: window.__diag3d?.monitor ?? null };
          }, [antes, fimGiro]);
          giro.dprMovimento = dprMovimento;
          giro.medianaMs = mediana(giro.intervalos);
          giro.p95Ms = percentil(giro.intervalos, 0.95);
          giro.envioMedianoMs = mediana(giro.envio);
          delete giro.envio;
        }
        if (!marcado('sem-capturas') && marcado('com-marcadores')) {
          // Volta à vista inicial para comparar a posição dos marcadores entre versões.
          await page.click('text=Restaurar vista');
          await page.click('text=Mostrar marcadores');
          await estavel(5000);
          await page.evaluate(() => document.querySelector('.palco3d')?.scrollIntoView({ block: 'center' }));
          await page.locator('.palco3d').screenshot({ path: join(saida, nivel, `${id}-m.png`) });
          await page.click('text=Ocultar marcadores');
        }
        const r = { nivel, id, carregamentoMs, ...parado, giro };
        resultados.push(r);
        const info = r.diag?.render;
        console.log(`${nivel.padEnd(5)} ${id.padEnd(20)} dpr ${r.dpr} (giro ${giro?.dprMovimento ?? '-'}) · GL ${r.gl?.chamadas} chamadas ${r.gl?.triangulos} tri ${r.gl?.programasVivos} prog`
          + (info ? ` · info ${info.calls}/${info.triangles} prog ${r.diag.programs}` : '')
          + (giro ? ` · giro mediana ${giro.medianaMs?.toFixed(1)} ms p95 ${giro.p95Ms?.toFixed(1)} ms` : ''));
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    servidor?.kill();
  }

  writeFileSync(join(saida, 'medicao.json'), JSON.stringify({ data: new Date().toISOString(), viewport: [vw, vh], escala, niveis, resultados, erros }, null, 1));
  const linhas = ['| nível | modelo | dpr parado | dpr giro | chamadas (GL) | triângulos (GL) | programas | info.calls | info.triangles | giro mediana (ms) |', '|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of resultados) {
    linhas.push(`| ${r.nivel} | ${r.id} | ${r.dpr} | ${r.giro?.dprMovimento ?? '-'} | ${r.gl?.chamadas ?? '-'} | ${r.gl?.triangulos ?? '-'} | ${r.gl?.programasVivos ?? '-'} | ${r.diag?.render?.calls ?? '-'} | ${r.diag?.render?.triangles ?? '-'} | ${r.giro?.medianaMs?.toFixed(1) ?? '-'} |`);
  }
  writeFileSync(join(saida, 'medicao.md'), linhas.join('\n') + '\n');
  console.log(erros.length ? `Erros de página:\n${erros.join('\n')}` : 'sem erros de página');
  console.log(`Resultados em ${saida}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
