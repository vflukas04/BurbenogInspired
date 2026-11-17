// Balance-Werte ins Spiel übernehmen (17.11., L): ersetzt die Werte im BALANCE-Block von index.html durch die aus einem Spiegel
// (Standard tools/balance/spiegel-D7T.json, erzeugt von tools/balance/d/d2.js). Der übrige Spielcode bleibt unverändert.
// Aufruf: node tools/balance/einspielen.js            (danach VERSION in index.html hochzählen, node tools/pruefung.js, pushen)
//         SPIEGEL=tools/balance/spiegel-X.json node tools/balance/einspielen.js
const fs = require('fs'), path = require('path');
const ziel = path.join(__dirname, '..', '..', 'index.html');
const sp = JSON.parse(fs.readFileSync(path.resolve(process.env.SPIEGEL || path.join(__dirname, 'spiegel-D7T.json')), 'utf8'));
const NAMEN_NEU = { 'Sommer-Schneebälle':'Eiswürfel', 'Heisenbergs':'The one who knocks' };   // Spiel-Namen zweier Monster
const werte = Object.fromEntries(Object.entries(sp).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k.split('.').map(t => NAMEN_NEU[t] || t).join('.'), v]));
let html = fs.readFileSync(ziel, 'utf8');
const re = /(\/\* BALANCE \(Zweig D7[\s\S]*?\*\/\n\(function\(\)\{ const SP = )(\{[\s\S]*?\});\n/;
if (!re.test(html)) throw new Error('BALANCE-Block in index.html nicht gefunden');
const alt = JSON.parse(html.match(re)[2]);
html = html.replace(re, (m, a) => a + JSON.stringify(werte) + ';\n');
fs.writeFileSync(ziel, html);
const geaendert = Object.keys(werte).filter(k => JSON.stringify(werte[k]) !== JSON.stringify(alt[k])), weg = Object.keys(alt).filter(k => !(k in werte));
console.log(`index.html: ${Object.keys(werte).length} Werte, geändert ${geaendert.length}${geaendert.length ? ' (' + geaendert.slice(0, 8).join(', ') + (geaendert.length > 8 ? ' …' : '') + ')' : ''}${weg.length ? ', entfernt ' + weg.length : ''}. VERSION hochzählen nicht vergessen.`);
