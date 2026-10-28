// Zweig D6 (27.10. nachts): einen Kurs (SENS-Faktor auf Wert − 1) so suchen, dass ein Element auf dem festen Bezugs-Aufbau (Bodentage) bei 1,00 liegt.
// Aufruf: RUEST_K=… SLOW_K=… [SENS_FEST=fluch:1.3] node tools/balance/d/fit1.js <kurs> <Element 0–3> <lo> <hi>
// Ausgabe: Suchschritte und bester Faktor. Arbeitsdatei spiegel-fit-<pid>.json (wird gelöscht).
const cp = require('child_process'), path = require('path'), fs = require('fs'), dir = path.join(__dirname, '..', '..', '..');
const [kurs, el, lo0, hi0] = process.argv.slice(2), datei = `spiegel-fit-${process.pid}.json`, NAME = ['Feuer', 'Eis', 'Schatten', 'Stein'];
function messe(k){ const sens = [process.env.SENS_FEST, `${kurs}:${k}`].filter(Boolean).join(',');
  cp.execFileSync(process.execPath, [path.join(__dirname, 'd2.js')], { env:{ ...process.env, SENS:sens, AUS:datei }, cwd:dir });
  const out = cp.execFileSync(process.execPath, [path.join(__dirname, 'elemente6.js')], { env:{ ...process.env, STAPEL_ALLE:'1', SPIEGEL:'tools/balance/' + datei, EL:el }, cwd:dir, encoding:'utf8' });
  return { g:+out.match(/Boden ([\d.]+)/)[1], z:out.trim() }; }
let lo = +lo0, hi = +hi0, best = null; const ZIEL = +(process.env.ZIEL || 1);   // ZIEL (28.10.): Zielwert; RICHTUNG=- wenn ein größerer Faktor das Element stärker macht
for (let i = 0; i < 6; i++) { const k = Math.sqrt(lo * hi), r = messe(k.toFixed(3));
  console.log(`  ${kurs} ×${k.toFixed(3)} → ${NAME[el]} ${r.g.toFixed(3)} | ${r.z.replace(/\s+/g, ' ').slice(0, 140)}`);
  if (!best || Math.abs(Math.log(r.g / ZIEL)) < Math.abs(Math.log(best.g / ZIEL))) best = { k, g:r.g };
  if ((r.g > ZIEL) === (process.env.RICHTUNG !== '-')) lo = k; else hi = k; }
console.log(`Ergebnis ${kurs}: ×${best.k.toFixed(3)} → ${best.g.toFixed(3)}`);
fs.unlinkSync(path.join(__dirname, '..', datei));
