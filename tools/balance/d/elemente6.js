// Zweig D6 (L 27.10. abends): Element-Vergleich der zusammengesetzten Türme (d/d2.js → spiegel-D6T.json).
// Fester Aufbau des Bezugs-Bots (Standardtürme, d/plaene/d6k/bezug3.json): jeder Turm wird durch den Turm gleicher Nummer und Stufe
// des Elements ersetzt (gleiches Feld). Wert = Reserve ÷ Reserve der Standardtürme (aus dem Plan), getrennt nach Boden- und Fliegertagen.
// Umgebung wie bots.js (ohne Wetter, neutrale Faktoren). Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D6T.json node tools/balance/d/elemente6.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, 'plaene', 'd6k', 'bezug3.json'))));
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN, NAME = ['Feuer', 'Eis', 'Schatten', 'Stein'];
const t0 = Date.now(), tage = (process.env.TAGE || '1-48').split('-').map(Number);
for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) { const b = [], f = [], blk = [[], [], [], []];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed);
    mp.tage.forEach((t, d) => { if (d + 1 < tage[0] || d + 1 > tage[1]) return;
      const R = C.reserveDay({ el:e, towers:t.towers.map(x => ({ ...x, el:e })), res:[] }, { type:d, players:2 }), q = R / t.R;
      (G.MONSTERS[d].fly ? f : b).push(q); if (!G.MONSTERS[d].fly) blk[Math.min(3, Math.floor(d / 12))].push(q); }); }
  console.log(`${NAME[e].padEnd(9)} Boden ${gm(b).toFixed(3)} (Tag 1–12 ${gm(blk[0]).toFixed(2)} · 13–24 ${gm(blk[1]).toFixed(2)} · 25–36 ${gm(blk[2]).toFixed(2)} · 37–48 ${gm(blk[3]).toFixed(2)}) | Flieger ${gm(f).toFixed(3)} | ${Math.round((Date.now() - t0) / 1000)} s`); }
