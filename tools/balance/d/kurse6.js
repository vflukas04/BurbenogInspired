// Zweig D6 (L 27.10. abends): Wechselkurse der Merkmale auf der Basis D6.
// Fester Aufbau: Plan des Bezugs-Bots (d/plaene/d6k/bezug3.json, beide Maps, alle 48 Tage). Alle Standardtürme bekommen dasselbe
// Merkmal bei GLEICHEM Schaden/s; Wert = Reserve mit ÷ ohne (geometrisches Mittel über Tage und Maps), dazu getrennt Boden- und Fliegertage.
// Umgebung wie bots.js (ohne Wetter, neutrale Faktoren, alles frei). Stapelregel STAPEL_ALLE=1 (Brennen/Bremsen/Fluch sortiert nach Stärke).
// Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D6.json node tools/balance/d/kurse6.js [Gruppe: reichweite|rate|flaeche|effekte|sonst|alle]
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, 'plaene', 'd6k', 'bezug3.json'))));
const E = G.ELEMENTS[0], ROWS = E.towers.map(r => JSON.parse(JSON.stringify(r))), GR = G.GRID, UPR = G.CONFIG.upgrade.range;
const ELK = ['armorDmg', 'dayOnly'], EL0 = Object.fromEntries(ELK.map(k => [k, E[k]]));
// Merkmal: r Reichweite (Felder), q Rate-Faktor, n Geschosse, f Fläche (Felder), effect/eff/dur, stun [Chance, Dauer], nova, noFly, luft [Boden, Flieger], el {…}, upR (Reichweite je Stufe, alte Felder)
function setze(m){ E.towers.forEach((row, k) => { const r = JSON.parse(JSON.stringify(ROWS[k])), o = r[9];
    if (m.r) r[2] = m.r / GR; if (m.q) r[3] = m.q; if (m.n) r[4] = m.n; if (m.f) r[8] = m.f / GR;
    if (m.effect) { o.effect = m.effect; r[6] = m.eff; r[7] = m.dur; }
    if (m.stun) { o.effect = 'stun'; o.chance = m.stun[0]; r[6] = m.stun[1]; r[7] = 1; }
    if (m.nova) { o.nova = true; r[2] = m.nova / GR; r[8] = m.nova / GR; }
    if (m.noFly) o.fly = false; if (m.luft) { o.groundMul = m.luft[0]; o.flyMul = m.luft[1]; }
    E.towers[k] = r; });
  ELK.forEach(k => { E[k] = m.el && k in m.el ? m.el[k] : EL0[k]; });
  G.CONFIG.upgrade.range = m.upR ?? UPR; }
const gm = a => Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length);
const flieg = d => !!G.MONSTERS[d].fly;
function reserven(m){ setze(m); const out = [];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed); mp.tage.forEach((t, d) => out.push({ d, R:C.reserveDay({ el:0, towers:t.towers, res:[] }, { type:d, players:2 }) })); }
  setze({}); return out; }
const R0 = reserven({});
function wert(name, m){ const R = reserven(m), q = R.map((x, i) => x.R / R0[i].R);
  const b = q.filter((_, i) => !flieg(R[i].d)), f = q.filter((_, i) => flieg(R[i].d));
  console.log(`${name.padEnd(40)} ${gm(q).toFixed(3)} | Boden ${gm(b).toFixed(3)} | Flieger ${gm(f).toFixed(3)}`); }
const GRUPPEN = {
  reichweite: [['Reichweite 1,5 Felder', { r:1.5 }], ['Reichweite 2', { r:2 }], ['Reichweite 2,5', { r:2.5 }], ['Reichweite 3', { r:3 }], ['Reichweite 4', { r:4 }], ['Reichweite 5', { r:5 }], ['Reichweite 6', { r:6 }],
    ['Reichweite +0,4 Felder je Stufe (alt)', { upR:0.2 }], ['Reichweite +0,2 Felder je Stufe', { upR:0.1 }]],
  rate: [['Rate ×0,25', { q:0.25 }], ['Rate ×0,5', { q:0.5 }], ['Rate ×2', { q:2 }], ['Rate ×3', { q:3 }], ['2 Geschosse', { n:2 }], ['3 Geschosse', { n:3 }], ['5 Geschosse', { n:5 }]],
  flaeche: [['Fläche 0,5', { f:0.5 }], ['Fläche 1', { f:1 }], ['Fläche 1,5', { f:1.5 }], ['Fläche 2', { f:2 }]],
  effekte: [['Bremsen 10 % 2 s', { effect:'slow', eff:0.1, dur:2 }], ['Bremsen 20 % 2 s', { effect:'slow', eff:0.2, dur:2 }], ['Bremsen 40 % 4 s', { effect:'slow', eff:0.4, dur:4 }],
    ['Fläche 1 + Bremsen 10 % 2 s', { f:1, effect:'slow', eff:0.1, dur:2 }],
    ['Fluch 5 % 4 s', { effect:'curse', eff:0.05, dur:4 }], ['Fluch 10 % 4 s', { effect:'curse', eff:0.1, dur:4 }], ['Fluch 20 % 4 s', { effect:'curse', eff:0.2, dur:4 }],
    ['Brennen 8 % 3 s', { effect:'burn', eff:0.08, dur:3 }], ['Brennen 15 % 3 s', { effect:'burn', eff:0.15, dur:3 }], ['Brennen 30 % 6 s', { effect:'burn', eff:0.3, dur:6 }], ['Brennen 5 % ganzer Tag', { effect:'burn', eff:0.05, dur:'Tag' }],
    ['Betäuben 15 % 1 s', { stun:[0.15, 1] }], ['Betäuben 5 % 0,5 s', { stun:[0.05, 0.5] }]],
  pruef: [['Betäuben 100 % 1 s', { stun:[1, 1] }], ['Betäuben 30 % 2 s', { stun:[0.3, 2] }]],
  sonst: [['Nova 2 Felder, Rate ×0,25', { nova:2, q:0.25 }], ['Rüstungsschaden 0,5', { el:{ armorDmg:0.5 } }], ['Rüstungsschaden 1,5', { el:{ armorDmg:1.5 } }], ['Nachtregel (nur Licht)', { el:{ dayOnly:true } }],
    ['keine Fliegenden', { noFly:true }], ['Luftspezialist 60 % / 180 %', { luft:[0.6, 1.8] }], ['schwach gegen Fliegende (100 / 50 %)', { luft:[1, 0.5] }]] };
const w = process.argv[2] || 'alle', t0 = Date.now();
console.log(`Basis D6, Plan ${PLAN.bot}, ${R0.length} Tage×Maps, Reserve ohne Merkmal ${gm(R0.map(x => x.R)).toFixed(3)}`);
for (const g of w === 'alle' ? Object.keys(GRUPPEN) : w.split(',')) for (const [n, m] of GRUPPEN[g]) wert(n, m);
console.log(`${Math.round((Date.now() - t0) / 1000)} s`);
