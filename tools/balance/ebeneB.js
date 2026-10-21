// Ebene B (L, 21.10.): Kraft je Element und Leben je Block aus einem fertigen P2-Lauf ableiten (ohne neuen Lauf).
// Annahme: Bei gleicher Aufstellung wächst die Reserve R etwa proportional zur Kraft eines Elements und umgekehrt zu den Leben eines Blocks.
// Der Bot würde mit geänderten Werten etwas anders bauen → danach mit einem P2-Lauf bestätigen (eine Schleife = ein Lauf).
// Aufruf: SPIEGEL=<Eingang.json> node tools/balance/ebeneB.js <P2-Ordner unter ergebnisse/> <Ausgang.json> [Dämpfung, Standard 0,7]
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C, S = require('./spiegel');
const [ordner, aus, dmp] = process.argv.slice(2), D = +dmp || 0.7;
const daten = JSON.parse(fs.readFileSync(path.join(__dirname, 'ergebnisse', ordner, 'p2-alle.json'), 'utf8'));
// Zielkurve wie bericht.js (Band unten 1,4, Bogen bis 2,0)
const ZS = +process.env.ZIEL_START || 2.0, ZE = +process.env.ZIEL_ENDE || 1.4;
const ziel = r => ZE + (ZS - ZE) * Math.sin(Math.PI * Math.min(1, Math.max(0, (r - 1) / 39)));
const gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
const namen = Object.keys(daten.erg), nT = daten.erg[namen[0]][0].tage.length;
const Q = {}; for (const x of namen) Q[x] = [...Array(nT)].map((_, d) => gm(daten.erg[x].map(m => m.tage[d].R)) / ziel(G.MONSTERS[d].round));
const sp = { ...C.SPIEGEL }, alt = {};
// Kraft je Element: auf das Mittel der Elemente
const kr = namen.map(x => gm(Q[x])), mittel = gm(kr);
namen.forEach((x, e) => { const f = Math.pow(mittel / kr[e], D), p = `ELEMENTS.${e}.kraft`; alt[p] = G.ELEMENTS[e].kraft; sp[p] = +(G.ELEMENTS[e].kraft * f).toFixed(4); });
// Leben je Block: Mittel aller Elemente R/Ziel je Block (Zwischenbosse zählen zum Block ihrer Runde); Block 1 (Runde 1–5) bleibt (P1/F)
for (let b = 1; b < 8; b++) {
  const idx = [...Array(nT).keys()].filter(d => Math.ceil(G.MONSTERS[d].round / 5) === b + 1); if (!idx.length) continue;
  const v = gm(idx.flatMap(d => namen.map(x => Q[x][d] * mittel / gm(Q[x]) )));   // nach dem Element-Ausgleich
  const p = `CONFIG.hpBlock.${b}`; alt[p] = G.CONFIG.hpBlock[b]; sp[p] = +(G.CONFIG.hpBlock[b] * Math.pow(v, D)).toFixed(4);
}
sp._stand = `Ebene B aus ${ordner} (Dämpfung ${D}), ${new Date().toISOString().slice(0, 16)}`;
S.speichern(sp, path.isAbsolute(aus) ? aus : path.join(process.cwd(), aus));
console.log('Ebene B: alt → neu');
for (const p of Object.keys(alt)) console.log(`  ${p.padEnd(22)} ${alt[p].toFixed(3)} → ${sp[p].toFixed(3)}  (×${(sp[p] / alt[p]).toFixed(2)})`);
