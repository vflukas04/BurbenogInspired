// Zweig D (31.10.): Reserve der Standardtürme auf dem festen Bezugs-Aufbau je Tag (deterministisch, ohne Bot-Streuung) –
// z. B. um die Leben nach einer Änderung an allen Türmen (Freischaltungs-Einrechnung) nachzustellen. Aufruf: SPIEGEL=… AUS=datei.json node tools/balance/d/fest-std.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'plaene', 'd6k', 'bezug3.json')));
const out = G.MONSTERS.map(() => []);
for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed); mp.tage.forEach((t, d) => out[d].push(C.reserveDay({ el:0, towers:t.towers.map(x => ({ ...x, el:0 })), res:[] }, { type:d, players:2 }))); }
fs.writeFileSync(path.resolve(process.env.AUS), JSON.stringify(out));
