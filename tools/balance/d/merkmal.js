// Zweig D (L, 25.10.): Wechselkurs eines Merkmals im Schnelldurchlauf.
// Alle Standardtürme (alle Elemente, alle 8 Stufen) bekommen dasselbe Merkmal bei gleichem Schaden/s; Wert = Plan-Reserve mit ÷ ohne.
// Merkmal als JSON: Feld-Nummer der Turmzeile → Wert (2 Reichweite, 3 Rate, 4 Geschosse, 6 Effektstärke, 7 Dauer, 8 Fläche, alles in alten Feldern), "opt" → Optionen.
// Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D0.json node tools/balance/d/merkmal.js '{"8":0.5}' '{"8":1}' ...
const fs = require('fs'), path = require('path'), cp = require('child_process');
const basis = JSON.parse(fs.readFileSync(process.env.SPIEGEL)), tmp = path.join(require('os').tmpdir(), 'merkmal-' + process.pid + '.json');
function lauf(m){ const sp = { ...basis };
  for (let e = 0; e < 4; e++) for (let k = 0; k < 8; k++) { const key = `ELEMENTS.${e}.towers.${k}`, row = [...sp[key]]; row[9] = { ...row[9] };
    for (const [i, v] of Object.entries(m)) { if (i === 'opt') Object.assign(row[9], v); else row[+i] = v; } sp[key] = row; }
  fs.writeFileSync(tmp, JSON.stringify(sp));
  const out = cp.execFileSync(process.execPath, [path.join(__dirname, 'plan.js'), '0'], { env:{ ...process.env, SPIEGEL:tmp }, encoding:'utf8' });
  return +out.match(/Mittel Reserve ([\d.]+)/)[1]; }
const r0 = lauf({});
console.log(`ohne Merkmal: Reserve ${r0.toFixed(3)}`);
for (const a of process.argv.slice(2)) { const r = lauf(JSON.parse(a)); console.log(`${a.padEnd(40)} Wert ${(r / r0).toFixed(3)}`); }
fs.unlinkSync(tmp);
