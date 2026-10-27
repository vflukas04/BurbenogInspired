// Zweig D6 (27.10. abends): Diagnose je Turm – im Bezugs-Aufbau werden NUR die Türme eines Turmtyps durch den Element-Turm ersetzt,
// alle anderen bleiben Standardtürme. Wert = Reserve ÷ Standard, nur an Tagen, an denen der Turmtyp im Plan steht (Boden/Flieger getrennt).
// Zeigt, welche Wechselkurse im gemischten Aufbau (einzelne Türme mit dem Merkmal) nicht passen. Aufruf wie elemente6.js.
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, 'plaene', 'd6k', 'bezug3.json'))));
// Standardtürme: In spiegel-D6T sind alle 4 Elemente echte Türme. Für den Vergleich wird ein anderes Element (Feuer, für Feuer selbst Eis)
// auf die Standardtürme aus spiegel-D6.json zurückgesetzt (Turmzeilen, kraftT, Element-Merkmale) und trägt die übrigen Türme.
const D6 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spiegel-D6.json')));
function standard(eb){ const E = G.ELEMENTS[eb];
  for (let k = 0; k < 8; k++) { E.towers[k] = JSON.parse(JSON.stringify(D6[`ELEMENTS.0.towers.${k}`])); E.kraftT[k] = D6[`ELEMENTS.0.kraftT.${k}`]; }
  for (const p of ['armorDmg', 'dayOnly', 'noFly', 'weatherproof', 'terrainFree']) E[p] = D6[`ELEMENTS.0.${p}`];
  E.splashCenter = undefined; E.splashEdge = undefined; }
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN;
const EB = (process.env.EL || '0,1,2,3').split(',').map(Number);
if (EB.includes(0) && EB.length > 1) throw new Error('Feuer einzeln rechnen (EL=0), sonst wird Feuer als Standard überschrieben');
const eb = EB[0] === 0 ? 1 : 0; standard(eb);
for (const e of EB) for (let k = 0; k < 8; k++) { const b = [], f = [];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed);
    mp.tage.forEach((t, d) => { if (!t.towers.some(x => x.idx === k)) return;
      const R = C.reserveDay({ el:eb, towers:t.towers.map(x => x.idx === k ? { ...x, el:e } : { ...x, el:eb }), res:[] }, { type:d, players:2 });
      (G.MONSTERS[d].fly ? f : b).push(R / t.R); }); }
  console.log(`${G.ELEMENTS[e].towers[k][0].padEnd(14)} Boden ${gm(b).toFixed(3)} (${b.length}) | Flieger ${gm(f).toFixed(3)}`); }
