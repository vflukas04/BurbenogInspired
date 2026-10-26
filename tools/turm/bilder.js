const { chromium } = require('playwright'); const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const T0 = src.match(/const T=\{[\s\S]*?\n\};\n/)[0];
const MAP = { f:'feuer', e:'eis', s:'schatten', st:'stein' };
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:300, height:400 }, deviceScaleFactor:4 });
  await p.setContent('<body style="margin:0;background:transparent"><div id="x"></div></body>');
  const res = {};
  for (const k of Object.keys(MAP)) { res[MAP[k]] = [];
    for (let i = 0; i < 8; i++) {
      const top = await p.evaluate(([T0, k, i]) => { const t = eval(T0 + ';T')[k][i]; document.getElementById('x').innerHTML =
        `<svg id="sv" width="88" height="102" viewBox="-44 -92 88 102" style="display:block;filter:drop-shadow(0 0 .6px #000) drop-shadow(0 0 .6px #000)"><g id="gg">${t[5]()}</g></svg>`;
        const bb = document.getElementById('gg').getBBox(); return [-bb.y, bb.width]; }, [T0, k, i]);
      await (await p.$('#sv')).screenshot({ path: `assets/turm/${MAP[k]}-${i+1}.png`, omitBackground: true });
      res[MAP[k]].push(Math.round(top[0]*10)/10);
    } }
  console.log(JSON.stringify(res)); await b.close(); })();
