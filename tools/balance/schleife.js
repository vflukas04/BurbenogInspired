// Eine Schleife des Verfahrens (team/BALANCING.md): aus dem letzten P2-Ergebnis Element-Kraft und Lebensfaktor je Block ableiten
// und in den Spiegel schreiben (tools/balance/spiegel.json). index.html bleibt unverändert.
//   node tools/balance/schleife.js        → Vorschlag anzeigen und in spiegel.json übernehmen
//   TROCKEN=1 node tools/balance/schleife.js → nur anzeigen
// Gedämpft: Änderung je Schleife = (Zielverhältnis)^DAEMPFUNG, begrenzt auf ×MIN…×MAX; Anker bleiben die Startwerte im Spiel.
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C, S = require('./spiegel'), { ziel, band } = require('./bericht');
const DAEMPFUNG = +process.env.DAEMPFUNG || 0.7, MIN = 0.5, MAX = 2.5, HP_MIN = 1;   // Leben nie unter die Startwerte (L 16.10.: der Anfang soll nicht leichter werden)
const gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length), clamp = v => Math.min(MAX, Math.max(MIN, v));

const erg = JSON.parse(fs.readFileSync(path.join(__dirname, 'ergebnisse', 'p2-alle.json'))).erg;
const namen = Object.keys(erg), nT = erg[namen[0]][0].tage.length;
const R = {}; for (const x of namen) R[x] = [...Array(nT)].map((_, i) => gm(erg[x].map(m => m.tage[i].R)));
const q = (x, i) => band(R[x][i], G.MONSTERS[i].round);   // Kurve: > 1 zu leicht, < 1 zu schwer, im Band 1
const qk = (x, i) => R[x][i] / ziel(G.MONSTERS[i].round);   // Elemente: Verhältnis zur Kurve (ohne Band, damit Unterschiede sichtbar bleiben)
const fliegt = i => !!(G.MONSTERS[i].fly || G.MONSTERS[i].cocoon);
const alt = S.lesen(), neu = { ...alt };

// 1. Kurve je Block: Leben ×(Mittel aller Elemente R/Ziel)
console.log('Lebensfaktor je Block (CONFIG.hpBlock):');
for (let b = 0; b < 8; b++) {
  const idx = [...Array(nT).keys()].filter(i => Math.ceil(G.MONSTERS[i].round / 5) === b + 1); if (!idx.length) continue;
  const v = gm(idx.flatMap(i => namen.map(x => q(x, i)))), key = `CONFIG.hpBlock.${b}`, a = alt[key] ?? G.CONFIG.hpBlock[b];
  neu[key] = +Math.max(HP_MIN, a * clamp(Math.pow(v, DAEMPFUNG))).toFixed(3);
  console.log(`  Runde ${b * 5 + 1}–${b * 5 + 5}: R/Ziel ${v.toFixed(2)} → ${a} → ${neu[key]}`);
}
// 2. Element-Kraft: Mittel R/Ziel je Element (Stein ohne Tage mit Fliegenden – Stein darf gegen Fliegende deutlich schwächer sein, L 16.10.)
console.log('\nKraft je Element (ELEMENTS[e].kraft):');
const kr = {}; for (const x of namen) kr[x] = gm([...Array(nT).keys()].filter(i => !(x === 'Stein' && fliegt(i))).map(i => qk(x, i)));
// Ziel Stein (L 16.10.): ohne Fliegende leicht über dem Schnitt (×1,05)
const ZIEL_EL = { Stein:1.05 }, mittel = gm(Object.values(kr));
for (const x of namen) { const e = G.ELEMENTS.findIndex(E => E.name === x), key = `ELEMENTS.${e}.kraft`, a = alt[key] ?? (G.ELEMENTS[e].kraft || 1);
  neu[key] = +(a * clamp(Math.pow(mittel * (ZIEL_EL[x] || 1) / kr[x], DAEMPFUNG))).toFixed(3);
  console.log(`  ${x.padEnd(9)} relativ ${(kr[x] / mittel).toFixed(2)} → ${a} → ${neu[key]}`); }
// Prüfung Stein gegen Fliegende (L 16.10.): an Tagen mit Fliegenden mindestens 25 % des Schnitts der anderen Elemente
const fl = [...Array(nT).keys()].filter(fliegt);
if (fl.length && namen.includes('Stein')) { const st = gm(fl.map(i => R.Stein[i])), andere = gm(fl.flatMap(i => namen.filter(x => x !== 'Stein').map(x => R[x][i])));
  console.log(`\nStein an Tagen mit Fliegenden: ${(st / andere * 100).toFixed(0)} % der anderen Elemente (Grenze 25 %) ${st / andere >= 0.25 ? '✓' : '✗ – Stein-Luftabwehr nachbessern (Türme 4/6/8), nicht über die Element-Kraft'}`);
  fl.forEach(i => console.log(`  ${G.MONSTERS[i].name.padEnd(24)} Stein ${R.Stein[i].toFixed(2)} · andere ${gm(namen.filter(x => x !== 'Stein').map(x => R[x][i])).toFixed(2)}`)); }
neu._stand = `Schleife nach P2 vom ${new Date().toISOString().slice(0, 16)}, Dämpfung ${DAEMPFUNG}`;
if (!process.env.TROCKEN) { S.speichern(neu); console.log('\n→ in spiegel.json übernommen (nur Skript, nicht im Spiel)'); }
