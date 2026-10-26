// Rendert dorf.html: Übersichtsbild (dorf-sheet.png) und je Bild eine PNG nach assets/dorf-entwurf/
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const outDir = path.join(__dirname, '..', '..', 'assets', 'dorf-entwurf'); fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1700, height: 900 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'dorf.html'));
  await p.screenshot({ path: path.join(outDir, '_uebersicht.png'), fullPage: true });
  await p.addStyleTag({ content: 'body,.sp{background:transparent!important}' });   // Einzelbilder ohne Hintergrund
  for (const el of await p.$$('.sp')) { const n = await el.getAttribute('data-name'); const sv = await el.$('svg'); await sv.screenshot({ path: path.join(outDir, n + '.png'), omitBackground: true }); }
  await b.close();
})();
