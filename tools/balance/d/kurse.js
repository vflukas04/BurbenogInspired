// Zweig D, Schritt D2 (L, 24.10.): Wechselkurse Rate, Reichweite, Fläche gegenüber dem Grundturm (gleicher Schaden/s, gleiches Gold).
// Wert = Reserve (echte Leben, 10-Uhr-Welle, Budget des Tages ganz in diesem Turm), Mittel über Tage und Maps 0–3, relativ zum Grundturm.
// Kurs = 1 ÷ Wert: so viel Schaden/s müsste der Turm mit diesem Merkmal haben, um gleich viel zu leisten.
const { G } = require('../core'), { wert } = require('./grund');
const alle = G.MONSTERS.map((m, i) => i).filter(i => !G.MONSTERS[i].boss && !G.MONSTERS[i].mini);
const tage = process.env.TAGE ? process.env.TAGE.split(',').map(x => +x - 1) : alle.filter(i => !G.MONSTERS[i].fly);
const block = b => tage.filter(d => Math.ceil(G.MONSTERS[d].round / 10) === b);   // 4 Abschnitte à 10 Runden
const basis = [1, 2, 3, 4].map(b => wert({}, block(b)));
const zeile = (n, m) => { const v = [1, 2, 3, 4].map((b, i) => wert(m, block(b)) / basis[i]);
  console.log(n.padEnd(22) + v.map(x => x.toFixed(2).padStart(7)).join('') + '   Mittel ' + Math.exp(v.reduce((a, x) => a + Math.log(x), 0) / 4).toFixed(2)); };
console.log('Merkmal (Schaden/s gleich)   R 1–10  11–20  21–30  31–40');
for (const r of [0.35, 0.5, 2, 4]) zeile(`Rate ×${r}`, { rate:r });
for (const s of [2, 3]) zeile(`${s} Geschosse`, { shots:s });
for (const r of [3, 5, 6, 7]) zeile(`Reichweite ${r} (statt 4)`, { range:r });
for (const s of [0.5, 1, 1.5, 2]) zeile(`Fläche ${s}`, { splash:s });
