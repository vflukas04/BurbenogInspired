// Zweig D, Schritt D2a (L, 24.10.): Reichweite ↔ abgedeckte Wegstrecke. Ohne Simulation.
// Je Map (Wiese) und Reichweite: die 5 besten Bauplätze, die mindestens 2 Felder auseinander liegen (wo man sinnvoll baut), Mittel der Abdeckung.
// Ergebnis: Wegstrecke in Feldern je Reichweite und Exponent a in Abdeckung ∝ Reichweite^a (lokal und gesamt).
const C = require('../core'), { G } = C;
const R = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7];   // Reichweite in Feldern (neues Raster)
const zeilen = R.map(r => {
  const je = [0, 1, 2, 3].map(lane => {
    C.useMap(lane, null);
    const all = C.free.map(([x, y]) => ({ x, y, c:C.coverage(x, y, r) })).sort((a, b) => b.c - a.c), pick = [];
    for (const o of all) { if (pick.every(p => Math.hypot(p.x - o.x, p.y - o.y) >= 2)) pick.push(o); if (pick.length === 5) break; }
    return pick.reduce((a, o) => a + o.c, 0) / pick.length;
  });
  return { r, maps:je, m:je.reduce((a, b) => a + b) / 4 };
});
console.log('Reichweite  Wegstrecke (Mittel der 5 besten Plätze, Map 0–3)   Mittel   lokaler Exponent');
zeilen.forEach((z, i) => { const v = zeilen[i - 1], a = v ? Math.log(z.m / v.m) / Math.log(z.r / v.r) : NaN;
  console.log(String(z.r).padEnd(12) + z.maps.map(c => c.toFixed(1).padStart(6)).join('') + '     ' + z.m.toFixed(1).padStart(6) + '   ' + (isNaN(a) ? '' : a.toFixed(2))); });
const lx = zeilen.map(z => Math.log(z.r)), ly = zeilen.map(z => Math.log(z.m)), mx = lx.reduce((a, b) => a + b) / lx.length, my = ly.reduce((a, b) => a + b) / ly.length;
const a = lx.reduce((s, x, i) => s + (x - mx) * (ly[i] - my), 0) / lx.reduce((s, x) => s + (x - mx) ** 2, 0);
console.log(`Gesamt: Abdeckung ∝ Reichweite^${a.toFixed(2)}`);
// Reichweiten der echten Türme (Stufe 1) zur Einordnung
console.log('\nTürme (Stufe 1): ' + G.ELEMENTS.map((e, ei) => e.towers.slice(0, 8).map((t, k) => `${t[0]} ${G.tdef({ el:ei, idx:k, lvl:1, x:0, y:0 }).range.toFixed(1)}`).join(', ')).join(' | '));
