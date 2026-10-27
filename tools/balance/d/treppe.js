// Treppe einer Basis ändern (L 27.10.): kraftT[k] × (NEU / ALT)^k für alle Elemente, Rest bleibt (Leben, Kurve, Preise).
// Aufruf: node tools/balance/d/treppe.js <Basis.json> <ALT> <NEU> <Ausgabe.json>
const fs = require('fs'), path = require('path'), S = require('../spiegel');
const [, , ein, alt, neu, aus] = process.argv, sp = JSON.parse(fs.readFileSync(path.resolve(ein)));
for (let e = 0; e < 4; e++) for (let k = 0; k < 8; k++) { const p = `ELEMENTS.${e}.kraftT.${k}`; sp[p] = +(sp[p] * Math.pow(+neu / +alt, k)).toFixed(5); }
sp._stand = sp._stand.replace(/Treppe ×[0-9.]+ je Turmtyp/, `Treppe ×${neu} je Turmtyp`);
S.speichern(sp, path.resolve(aus)); console.log(sp._stand.slice(0, 160));
