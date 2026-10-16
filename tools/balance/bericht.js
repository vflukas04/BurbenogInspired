// Berichte für die Prüfpunkte (nur Zahlen und Vorschläge, keine Positionen – Spoiler-Regel).
const C = require('./core'), { G } = C;
const pad = (s, k) => String(s).padEnd(k), gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
// Zielkurve (16.10., L): Anfang lockerer, Ende knapper; „Normal“ = 15 % Reserve am Ende. Linear über die Runde.
const ZIEL_START = +process.env.ZIEL_START || 1.5, ZIEL_ENDE = +process.env.ZIEL_ENDE || 1.15;
const ziel = round => ZIEL_START + (ZIEL_ENDE - ZIEL_START) * (round - 1) / 39;

function p2(erg){
  const namen = Object.keys(erg), nT = erg[namen[0]][0].tage.length;
  // R je Element und Tag: geometrisches Mittel über die Maps
  const R = {}; for (const x of namen) R[x] = [...Array(nT)].map((_, i) => gm(erg[x].map(m => m.tage[i].R)));
  console.log(`P2 · beste gefundene Aufstellung je Tag · Version ${G.VERSION} · 2 Spieler · Maps ${erg[namen[0]].map(m => m.lane + ':' + m.seed).join(', ')}`);
  console.log(`R = Reserve (1 = gerade geschafft), Ziel linear ${ZIEL_START} → ${ZIEL_ENDE}\n`);
  console.log(pad('Tag', 4) + pad('Monster', 24) + namen.map(x => pad(x, 10)).join('') + pad('Mittel', 8) + 'Ziel');
  for (let i = 0; i < nT; i++) {
    const M = G.MONSTERS[i], rs = namen.map(x => R[x][i]);
    console.log(pad(i + 1, 4) + pad(M.name.slice(0, 23), 24) + rs.map(v => pad(v.toFixed(2), 10)).join('') + pad(gm(rs).toFixed(2), 8) + ziel(M.round).toFixed(2));
  }
  console.log('\nElement-Kraft (Mittel von R/Ziel über alle Tage; Vorschlag = Kraftfaktor, der aufs Mittel der Elemente brächte):');
  const kr = {}; for (const x of namen) kr[x] = gm(R[x].map((v, i) => v / ziel(G.MONSTERS[i].round)));
  const alle = gm(Object.values(kr));
  for (const x of namen) console.log(`  ${pad(x, 10)} ${(kr[x] / alle).toFixed(2)}  → Kraft ×${(alle / kr[x]).toFixed(2)}`);
  console.log('\nKurve je Block (Mittel aller Elemente R/Ziel; Vorschlag Leben ×Wert, 1 = passt):');
  for (let b = 0; b < 8; b++) { const idx = [...Array(nT).keys()].filter(i => Math.ceil(G.MONSTERS[i].round / 5) === b + 1); if (!idx.length) continue;
    const v = gm(idx.flatMap(i => namen.map(x => R[x][i] / ziel(G.MONSTERS[i].round)))); console.log(`  Runde ${b * 5 + 1}–${b * 5 + 5}: ×${v.toFixed(2)}`); }
  const aus = []; for (const x of namen) R[x].forEach((v, i) => { const q = v / ziel(G.MONSTERS[i].round) / (kr[x]); if (q < 0.6 || q > 1.8) aus.push(`${G.MONSTERS[i].name} ${x} ${q.toFixed(2)}`); });
  if (aus.length) console.log('\nAusreißer je Tag (R/Ziel relativ zur Element-Kraft, < 0,6 oder > 1,8):\n  ' + aus.join('\n  '));
}
module.exports = { p2, ziel };
