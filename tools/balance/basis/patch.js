// Code-Änderungen am Spiegel (L, 21.10.): Die eingefrorene Basis bleibt unverändert; diese Ersetzungen werden beim Laden
// (sim.js) und beim Erzeugen der Testseite (spiegel-seite.js) angewandt. Beim Zusammenführen mit dem Spiel müssen sie in index.html übernommen werden.
//  1) Upgrades mit Schwerpunkt je Stufe: CONFIG.upgrade.rangeSteps / durSteps / effSteps (je 5 Werte für Stufe 2–6).
//     Fehlen sie, gilt wie bisher +range je Stufe, ×dur je Stufe, ×eff je Stufe.
const ERSETZEN = [
  ['const ceil1 = v => Math.ceil(v * 10 - 1e-6) / 10;',
   'const ceil1 = v => Math.ceil(v * 10 - 1e-6) / 10;\n// 21.10. (L, Spiegel): Upgrade-Schwerpunkt je Stufe\nconst upProd = (a, d, n) => a ? a.slice(0, n).reduce((x, v) => x * v, 1) : Math.pow(d, n), upSum = (a, d, n) => a ? a.slice(0, n).reduce((x, v) => x + v, 0) : d * n;'],
  ['  let eff = b.eff * Math.pow(U.eff, n);', '  let eff = b.eff * upProd(U.effSteps, U.eff, n);'],
  ['light: b.light ? b.light + U.range * GRID * n : 0', 'light: b.light ? b.light + upSum(U.rangeSteps, U.range, n) * GRID : 0'],
  ['dur: b.dur === DAY ? DAY : b.dur * Math.pow(U.dur, n), range: b.range + U.range * GRID * n,',
   'dur: b.dur === DAY ? DAY : b.dur * upProd(U.durSteps, U.dur, n), range: b.range + upSum(U.rangeSteps, U.range, n) * GRID,'],
];
module.exports = html => { for (const [a, b] of ERSETZEN) { if (!html.includes(a)) throw new Error('Patch passt nicht: ' + a.slice(0, 60)); html = html.replace(a, b); } return html; };
