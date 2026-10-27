// Zweig D6 (L 27.10. abends): Element-Vergleich der zusammengesetzten Türme (d/d2.js → spiegel-D6T.json).
// Fester Aufbau des Bezugs-Bots (Standardtürme, d/plaene/d6k/bezug3.json): jeder Turm wird durch den Turm gleicher Nummer und Stufe
// des Elements ersetzt (gleiches Feld). Wert = Reserve ÷ Reserve der Standardtürme (aus dem Plan), getrennt nach Boden- und Fliegertagen.
// Umgebung wie bots.js (ohne Wetter, neutrale Faktoren). Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D6T.json node tools/balance/d/elemente6.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, 'plaene', 'd6k', 'bezug3.json'))));
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN, NAME = ['Feuer', 'Eis', 'Schatten', 'Stein'];
// ABL (Ablation, 27.10.): Merkmal des geprüften Elements im Speicher abschalten (Schaden bleibt) – zeigt, welches Merkmal die Drift trägt:
// slow0 / curse0 / burn0 / stun0 (Effekt aus), splash0 (Fläche 0), armor0 (Rüstungsschaden 0), night0 (Nachtregel aus), nova0 (Nova → Einzelschuss)
function abl(e, a){ if (!a) return; const E = G.ELEMENTS[e];
  E.towers.forEach(r => { const o = r[9];
    if ({ slow0:'slow', curse0:'curse', burn0:'burn', stun0:'stun' }[a] === o.effect) { o.effect = 'none'; r[6] = 0; }
    if (a === 'splash0' && !o.nova) r[8] = 0; if (a === 'nova0' && o.nova) { o.nova = false; r[8] = 0; } });
  if (a === 'armor0') E.armorDmg = 0; if (a === 'night0') E.dayOnly = false; }
const t0 = Date.now(), tage = (process.env.TAGE || '1-48').split('-').map(Number);
for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) { abl(e, process.env.ABL); const b = [], f = [], blk = [[], [], [], []];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed);
    mp.tage.forEach((t, d) => { if (d + 1 < tage[0] || d + 1 > tage[1]) return;
      const R = C.reserveDay({ el:e, towers:t.towers.map(x => ({ ...x, el:e })), res:[] }, { type:d, players:2, weather:+(process.env.WETTER || 0) }), q = R / t.R;   // WETTER=Index (mit MIT_WETTER=1)
      (G.MONSTERS[d].fly ? f : b).push(q); if (!G.MONSTERS[d].fly) blk[Math.min(3, Math.floor(d / 12))].push(q); }); }
  console.log(`${NAME[e].padEnd(9)}${process.env.ABL ? ' ohne ' + process.env.ABL : ''}${process.env.MIT_WETTER ? ' Wetter ' + G.WEATHER[+(process.env.WETTER || 0)].name : ''} Boden ${gm(b).toFixed(3)} (Tag 1–12 ${gm(blk[0]).toFixed(2)} · 13–24 ${gm(blk[1]).toFixed(2)} · 25–36 ${gm(blk[2]).toFixed(2)} · 37–48 ${gm(blk[3]).toFixed(2)}) | Flieger ${gm(f).toFixed(3)} | ${Math.round((Date.now() - t0) / 1000)} s`); }
