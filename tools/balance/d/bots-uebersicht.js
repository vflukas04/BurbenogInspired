// Übersicht zum Bot-Vergleich (d/bots.js): Reserve ÷ Ziel je Block, schwächster Tag, Aufbau an Tag 12/24/36/48 (Map 0), Anteil Upgrades.
// Aufruf: node tools/balance/d/bots-uebersicht.js [Ordner, Standard ergebnisse/d3-bots]
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'ergebnisse', 'd3-bots'));
const gm = a => Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length);
const txt = tw => { const z = {}; tw.forEach(t => (z[t.idx] = z[t.idx] || []).push(t.lvl));
  return Object.keys(z).sort((a, b) => a - b).map(k => `T${+k + 1}×${z[k].length}(${z[k].sort((a, b) => b - a).join('')})`).join(' '); };
const preis = [10, 45, 70, 120, 200, 340, 580, 1000];
// Bezug (27.10.): Reserve des alten P2-Plans (p2alt.json) je Tag und Map – 1,00 = so stark wie der alte Bot mit Forschung, Steinen, Umbau, vollem Kopfgeld.
// Ohne p2alt.json: Ziel-Kurve 1,52 × Tag^−0,096 (liegt in dieser Umgebung etwa ×1,3 über dem alten Plan).
const alle = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f))));
const ref = alle.find(e => e.bot === 'p2alt'), bez = (m, d, t) => ref ? ref.maps[m].tage[d].R : t.Z;
const zeilen = alle.map(e => {
  const [a, b] = e.maps, q = a.tage.map((t, d) => Math.sqrt(t.R * b.tage[d].R / bez(0, d, t) / bez(1, d, b.tage[d]))), qa = a.tage.map((t, d) => t.R / bez(0, d, t)), qb = b.tage.map((t, d) => t.R / bez(1, d, t));
  const end = a.tage[47].towers, basis = end.reduce((s, t) => s + preis[t.idx], 0), inv = end.reduce((s, t) => s + t.inv, 0);
  return { e, g:gm(q), bl:[0, 12, 24, 36].map(i => gm(q.slice(i, i + 12))), min:Math.min(...q), minT:q.indexOf(Math.min(...q)) + 1, m0:gm(qa), m2:gm(qb),
    up:1 - basis / inv, n:end.length, rest:a.tage[47].gold - a.tage[47].spent, auf:[11, 23, 35, 47].map(d => txt(a.tage[d].towers)) };
}).sort((x, y) => y.g - x.g);
console.log(ref ? 'Bezug: alter P2-Plan = 1,00' : 'Bezug: Ziel-Kurve'); console.log('Bot        gesamt | T1–12 13–24 25–36 37–48 | min (Tag) | Map0/Map2 | Türme Upg.-Anteil Rest');
for (const z of zeilen) console.log(`${z.e.bot.padEnd(10)} ${z.g.toFixed(2)}   | ${z.bl.map(v => v.toFixed(2)).join('  ')} | ${z.min.toFixed(2)} (${z.minT}) | ${z.m0.toFixed(2)}/${z.m2.toFixed(2)} | ${String(z.n).padStart(2)} ${Math.round(z.up * 100)} % ${z.rest}`);
console.log('');
for (const z of zeilen) console.log(`${z.e.bot}: ${z.e.txt}\n  Tag 12: ${z.auf[0]}\n  Tag 24: ${z.auf[1]}\n  Tag 36: ${z.auf[2]}\n  Tag 48: ${z.auf[3]}`);
