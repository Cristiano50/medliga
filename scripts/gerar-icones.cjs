// Gera os ícones PNG do app a partir de public/icons/icon.svg (usa o Playwright/Chromium do ambiente).
// Uso: node scripts/gerar-icones.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const svg = fs.readFileSync(path.join(__dirname, '../public/icons/icon.svg'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const alvos = [
    { nome: 'icon-192.png', tam: 192, margem: 0 },
    { nome: 'icon-512.png', tam: 512, margem: 0 },
    { nome: 'icon-maskable-512.png', tam: 512, margem: 0.12 },
  ];
  for (const a of alvos) {
    const interno = Math.round(a.tam * (1 - 2 * a.margem));
    await page.setViewportSize({ width: a.tam, height: a.tam });
    await page.setContent(
      `<html><body style="margin:0;background:#0b1220;display:grid;place-items:center;width:${a.tam}px;height:${a.tam}px">` +
        `<div style="width:${interno}px;height:${interno}px">${svg.replace('<svg ', `<svg width="${interno}" height="${interno}" `)}</div></body></html>`,
    );
    await page.screenshot({ path: path.join(__dirname, '../public/icons', a.nome) });
  }
  await browser.close();
  console.log('ícones gerados');
})();
