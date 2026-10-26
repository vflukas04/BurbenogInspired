// Erzeugt je Turm das Grundbild (ohne bewegliche Teile) und je Teil ein eigenes Bild gleicher Größe.
// Aufruf im Repo-Hauptordner: node tools/turm/bilder.js tools/turm/tuerme.html
const { chromium } = require('playwright'); const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const T0 = src.match(/const T=\{[\s\S]*?\n\};\n/)[0];
const MAP = { f:'feuer', e:'eis', s:'schatten', st:'stein' };
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:300, height:400 }, deviceScaleFactor:4 });
  await p.setContent('<body style="margin:0;background:transparent"><div id="x"></div></body>');
  const res = {}, parts = {};
  for (const k of Object.keys(MAP)) { res[MAP[k]] = []; parts[MAP[k]] = [];
    for (let i = 0; i < 8; i++) {
      const info = await p.evaluate(([T0, k, i]) => { const t = eval(T0 + ';T')[k][i]; document.getElementById('x').innerHTML =
        `<style id="st"></style><svg id="sv" width="88" height="102" viewBox="-44 -92 88 102" style="display:block;filter:drop-shadow(0 0 .6px #000) drop-shadow(0 0 .6px #000)"><g id="gg">${t[5]()}</g></svg>`;
        const bb = document.getElementById('gg').getBBox();
        const ids = [...new Set([...document.querySelectorAll('[data-p]')].map(e => +e.dataset.p))].sort((a,b)=>a-b);
        return { top: -bb.y, ids }; }, [T0, k, i]);
      const el = await p.$('#sv'), n = `assets/turm/${MAP[k]}-${i+1}`;
      await p.evaluate(() => { document.getElementById('st').textContent = '[data-p]{display:none}'; });
      await el.screenshot({ path: n + '.png', omitBackground: true });
      for (const id of info.ids) {
        await p.evaluate(id => { document.getElementById('st').textContent = `[data-p]{display:none}[data-p="${id}"]{display:inline}#gg>:not([data-p]){display:none}`; }, id);
        await el.screenshot({ path: `${n}p${id}.png`, omitBackground: true });
      }
      res[MAP[k]].push(Math.round(info.top*10)/10); parts[MAP[k]].push(info.ids.length);
    } }
  console.log(JSON.stringify(res)); console.log('TEILE', JSON.stringify(parts)); await b.close(); })();
