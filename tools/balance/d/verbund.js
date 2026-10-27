// Zweig D6 (L 27.10. 22 Uhr): Kurse für Bremsen und Rüstungsschaden im Verbund des eigenen Elements.
// Gemessen war „alle Türme bekommen das Merkmal“ mit Standardtürmen; im Spiel steht auf jeder Map nur ein Element, und Bremsen bzw.
// Rüstungsschaden helfen allen eigenen Türmen. Gesucht: Faktor auf den Merkmalswert (V − 1) so, dass das Element (Bezugs-Aufbau, Bodentage) bei 1,00 liegt.
// RUEST_K an Stein (größter Rüstungsschaden, keine Bremsen), danach SLOW_K an Eis (mit dem gefundenen RUEST_K). Intervallsuche auf log-Skala.
// Aufruf: SPIEGEL-Basis = spiegel-D6.json, schreibt spiegel-D6T.json. node tools/balance/d/verbund.js
const cp = require('child_process'), path = require('path'), dir = path.join(__dirname, '..', '..', '..');
function messe(env, el){ cp.execFileSync(process.execPath, [path.join(__dirname, 'd2.js')], { env:{ ...process.env, ...env, AUS:'spiegel-D6T.json' }, cwd:dir });
  const out = cp.execFileSync(process.execPath, [path.join(__dirname, 'elemente6.js')], { env:{ ...process.env, ...env, STAPEL_ALLE:'1', SPIEGEL:'tools/balance/spiegel-D6T.json', EL:String(el) }, cwd:dir, encoding:'utf8' });
  const m = out.match(/Boden ([\d.]+) \(Tag 1–12 ([\d.]+) · 13–24 ([\d.]+) · 25–36 ([\d.]+) · 37–48 ([\d.]+)\)/); return { g:+m[1], b:m.slice(2).map(Number) }; }
function suche(name, el, fest, lo, hi){ let best = null;
  for (let i = 0; i < 6; i++) { const k = Math.sqrt(lo * hi), r = messe({ ...fest, [name]:k.toFixed(3) }, el);
    console.log(`  ${name} ${k.toFixed(3)} → ${['Feuer', 'Eis', 'Schatten', 'Stein'][el]} ${r.g.toFixed(3)} (${r.b.join('/')})`);
    if (!best || Math.abs(Math.log(r.g)) < Math.abs(Math.log(best.r.g))) best = { k, r };
    if (r.g > 1) lo = k; else hi = k; }
  return best.k; }
const rk = suche('RUEST_K', 3, {}, 1, 12);
const sk = suche('SLOW_K', 1, { RUEST_K:rk.toFixed(3) }, 1, 40);
console.log(`Ergebnis: RUEST_K ${rk.toFixed(3)}, SLOW_K ${sk.toFixed(3)}`);
messe({ RUEST_K:rk.toFixed(3), SLOW_K:sk.toFixed(3) }, 0);   // spiegel-D6T.json mit beiden Werten schreiben
