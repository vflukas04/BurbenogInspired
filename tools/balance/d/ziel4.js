// Zweig D4 (L 27.10.): Leben je Tag auf den Bezugs-Bot kalibrieren (d/bots.js, Bot „bezug“: Simulation mit Vorausschau, T1 ≤ 4, sonst ≤ 3 je Turmtyp).
// Ziel wie D0 (ziel.js): Reserve(d) = R1 × Tag^−a. Tag 1: Leben so, dass der Menschen-Start (3 × Turm 1, Stufe 1) im ersten Durchlauf ca. 12 von 20 schafft;
// Betty (Tag 48): Reserve ZIEL48 (Standard 1,05) für den Bezugs-Bot. Umgebung wie bots.js: festes Gold, alles frei, ohne Wetter, neutrale Faktoren.
// Die Reserven je Tag stehen schon im Plan (gerechnet mit demselben Spiegel) → nur die Tag-1-Kills werden neu simuliert.
// Aufruf: SPIEGEL=<Spiegel> PLAN=<bezug.json, mit diesem Spiegel erzeugt> AUS=spiegel-D4.json node tools/balance/d/ziel4.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C, S = require('../spiegel');
require('./bots');   // setzt die Umgebung (Freischaltungen, Wetter, Faktoren) im Speicher
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN)));
const ZIEL48 = +process.env.ZIEL48 || 1.05, n = G.MONSTERS.length;
const R = [...Array(n)].map((_, d) => Math.exp(PLAN.maps.reduce((a, m) => a + Math.log(m.tage[d].R), 0) / PLAN.maps.length));
const start = { el:0, towers:[], res:[] };
const kills = f => { let s = 0; for (let l = 0; l < 4; l++) { C.useMap(l, null);
  const tw = C.mask(0, 0, 1, 0).cells.slice(0, 3).map(c => ({ x:c.x, y:c.y, el:0, idx:0, lvl:1 })); s += C.runWave({ ...start, towers:tw }, { type:0, players:2 }, f).kills; } return s / 4; };
let lo = 0.05, hi = 20; for (let i = 0; i < 30; i++) { const m = Math.sqrt(lo * hi); if (kills(m) >= 12) lo = m; else hi = m; }
const f1 = Math.sqrt(lo * hi), R1 = R[0] / f1, a = Math.log(R1 / ZIEL48) / Math.log(n);
const sp = { ...C.SPIEGEL }, aend = [];
G.MONSTERS.forEach((m, d) => { const z = R1 * Math.pow(d + 1, -a), p = `MONSTERS.${m.name}.hpMul`, h = sp[p] ?? m.hpMul ?? 1;
  sp[p] = +(h * R[d] / z).toFixed(4); aend.push(R[d] / z); });
sp._ziel = { R1:+R1.toFixed(4), a:+a.toFixed(4), bot:PLAN.bot, ziel48:ZIEL48 };
sp._stand = (sp._stand || '').replace(/ · Leben D4:.*$/, '') + ` · Leben D4: Bezugs-Bot ${PLAN.bot} (T1 ≤ 4, sonst ≤ 3 je Turmtyp), Reserve ${R1.toFixed(2)} × Tag^−${a.toFixed(3)} (Tag 1: 12 Kills Menschen-Start, Betty ${ZIEL48})`;
S.speichern(sp, path.resolve(__dirname, '..', process.env.AUS || 'spiegel-D4.json'));
const gm = x => Math.exp(x.reduce((s, v) => s + Math.log(v), 0) / x.length);
console.log(`Tag 1: Leben ×${f1.toFixed(2)} für 12 Kills → R1 ${R1.toFixed(3)}, a ${a.toFixed(3)} · Leben-Änderung je Tag: Mittel ×${gm(aend).toFixed(3)}, min ×${Math.min(...aend).toFixed(2)}, max ×${Math.max(...aend).toFixed(2)}`);
