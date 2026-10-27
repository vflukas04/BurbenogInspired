// Bot-Ergebnisse getrennt nach Boden- und Fliegertagen (R ÷ Ziel, beide Maps). Aufruf: node tools/balance/d/boden.js <Ordner> …
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN;
for (const dir of process.argv.slice(2)) for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) { const e = JSON.parse(fs.readFileSync(path.join(dir, f)));
  const b = [], fl = []; e.maps.forEach(m => m.tage.forEach((t, d) => (G.MONSTERS[d].fly ? fl : b).push(t.R / t.Z)));
  console.log(`${path.basename(dir).padEnd(10)} ${e.bot.padEnd(8)} Boden ${gm(b).toFixed(2)} · Flieger ${gm(fl).toFixed(2)} · alle ${gm([...b, ...fl]).toFixed(2)}`); }
