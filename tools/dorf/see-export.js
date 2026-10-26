const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 700 } }); p.on('pageerror', e => console.log('ERR', e.message));
 await p.goto('file://' + path.join(__dirname, 'see.html'));
 const out = path.join(__dirname, '..', '..', 'assets', 'dorf-entwurf');
 await p.screenshot({ path: path.join(out, '_see-vorschlaege.png'), fullPage: true });
 for (const el of await p.$$('.c')) { const n = await el.getAttribute('data-name'); await (await el.$('canvas')).screenshot({ path: path.join(out, n + '.png') }); }
 await b.close(); })();
