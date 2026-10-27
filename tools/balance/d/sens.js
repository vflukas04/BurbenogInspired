// Zweig D6 (L 27.10. 22:20): Empfindlichkeit – jeder Kurs einzeln ±10 % (auf V − 1), Türme neu zusammengesetzt (d2.js → Arbeitsdatei),
// dann alle 4 Elemente auf dem festen Bezugs-Aufbau (alle 48 Tage, beide Maps, Bodentage je Abschnitt). Ergebnis-Zeilen → ergebnisse/sens-*.txt
// Aufruf: RUEST_K=… SLOW_K=… node tools/balance/d/sens.js <name,name,…>
const cp = require('child_process'), path = require('path'), fs = require('fs'), dir = path.join(__dirname, '..', '..', '..');
const namen = (process.argv[2] || '').split(',').filter(Boolean), aus = path.join(__dirname, '..', 'ergebnisse', `sens-${process.pid}.txt`);
const datei = `spiegel-sens-${process.pid}.json`;
function lauf(sens){ cp.execFileSync(process.execPath, [path.join(__dirname, 'd2.js')], { env:{ ...process.env, SENS:sens, AUS:datei }, cwd:dir });
  const out = cp.execFileSync(process.execPath, [path.join(__dirname, 'elemente6.js')], { env:{ ...process.env, STAPEL_ALLE:'1', SPIEGEL:'tools/balance/' + datei, EL:'0,1,2,3' }, cwd:dir, encoding:'utf8' });
  return out.trim().split('\n').map(z => z.replace(/\| \d+ s$/, '').replace(/\s+/g, ' ')).join(' || '); }
for (const n of namen) for (const k of [0.9, 1.1]) { const z = `${n} ×${k}: ${lauf(n + ':' + k)}`; console.log(z); fs.appendFileSync(aus, z + '\n'); }
fs.unlinkSync(path.join(__dirname, '..', datei));
