// Zweig D6 (27.10. nachts): Warum ist ein Element beim FREIEN Bau stärker als auf dem festen Aufbau?
// Nimmt den freien Plan des Elements (ergebnisse/d6t2-e<EL>/bezug3.json) und ersetzt je Turmtyp k dessen Türme durch Standardtürme
// gleicher Nummer und Stufe (Standard auf einem anderen Element zurückgesetzt, wie turm6.js). Wert = Reserve ÷ Reserve des freien Plans.
// Kleiner als 1 = dieser Turmtyp trägt die Stärke. Dazu: alle Türme Standard (= Wert des Aufbaus an sich).
// Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D6T.json EL=0 node tools/balance/d/frei6.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const e = +(process.env.EL || 0), eb = e === 0 ? 1 : 0;
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, '..', 'ergebnisse', `d6t2-e${e}`, 'bezug3.json'))));
const D6 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spiegel-D6.json'))), E = G.ELEMENTS[eb];
for (let k = 0; k < 8; k++) { E.towers[k] = JSON.parse(JSON.stringify(D6[`ELEMENTS.0.towers.${k}`])); E.kraftT[k] = D6[`ELEMENTS.0.kraftT.${k}`]; }
for (const p of ['armorDmg', 'dayOnly', 'noFly', 'weatherproof', 'terrainFree']) E[p] = D6[`ELEMENTS.0.${p}`]; E.splashCenter = undefined; E.splashEdge = undefined;
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN;
function wert(ersetze, alle){ const b = [];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed);
    mp.tage.forEach((t, d) => { if (G.MONSTERS[d].fly) return; if (!alle && !t.towers.some(x => ersetze(x))) return;
      const R = C.reserveDay({ el:e, towers:t.towers.map(x => ersetze(x) ? { ...x, el:eb } : { ...x, el:e }), res:[] }, { type:d, players:2 });
      b.push(R / (BASIS ? BASIS[b.length + OFF] : t.R)); }); }
  return [gm(b), b.length]; }
// 30.10.: Bezug ist die Reserve des Plans mit den AKTUELLEN Türmen (nicht die gespeicherte R aus dem Lauf, der mit anderen Werten gebaut wurde)
let BASIS = null, OFF = 0; const R0 = []; for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed); mp.tage.forEach((t, d) => { if (!G.MONSTERS[d].fly) R0.push({ d, lane:mp.lane, R:C.reserveDay({ el:e, towers:t.towers.map(x => ({ ...x, el:e })), res:[] }, { type:d, players:2 }) }); }); }
function wert2(ersetze){ const b = [];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed);
    mp.tage.forEach((t, d) => { if (G.MONSTERS[d].fly || !t.towers.some(x => ersetze(x))) return; const r0 = R0.find(x => x.d === d && x.lane === mp.lane).R;
      b.push(C.reserveDay({ el:e, towers:t.towers.map(x => ersetze(x) ? { ...x, el:eb } : { ...x, el:e }), res:[] }, { type:d, players:2 }) / r0); }); }
  return [gm(b), b.length]; }
if (process.env.AKTUELL) { const [a2, n2] = wert2(() => true); console.log(`alle Türme Standard (Bezug aktuell): ${a2.toFixed(3)} (${n2})`);
  for (let k = 0; k < 8; k++) { const [v, m] = wert2(x => x.idx === k); if (m) console.log(`${G.ELEMENTS[e].towers[k][0].padEnd(14)} → Standard: ${v.toFixed(3)} (${m})`); } process.exit(0); }
const [a, n] = wert(() => true); console.log(`alle Türme Standard: ${a.toFixed(3)} (${n} Tage×Maps, Bodentage)`);
for (let k = 0; k < 8; k++) { const [v, m] = wert(x => x.idx === k); if (m) console.log(`${G.ELEMENTS[e].towers[k][0].padEnd(14)} → Standard: ${v.toFixed(3)} (${m})`); }
