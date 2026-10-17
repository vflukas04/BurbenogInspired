// Berichte für die Prüfpunkte (nur Zahlen und Vorschläge, keine Positionen – Spoiler-Regel).
const C = require('./core'), { G } = C;
const pad = (s, k) => String(s).padEnd(k), gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
// Zielkurve (16.10., L): Anfang lockerer, Ende knapper; Endboss ca. 50 % Reserve für den (fast perfekten) Bot, davor mehr. Linear über die Runde.
// Eichung grob (Referenzläufe 15.10.): Menschen erreichen ca. 65–85 % der Bot-Stärke → bei R 1,5 bleibt für echte Spieler ungefähr 1,0–1,25.
const ZIEL_START = +process.env.ZIEL_START || 2.0, ZIEL_ENDE = +process.env.ZIEL_ENDE || 1.4;   // 16.10. (L): Endboss 40 % Bot-Reserve → für echte Spieler etwa −10 % bis +15 %
// Zielband (16.10., L): untere Grenze überall ZIEL_ENDE (Endboss 40 % Bot-Reserve); nach oben öffnet es sich in der Mitte des Spiels
// bis ZIEL_START und schließt sich zum Endboss wieder (Bogen). Runde 1–5 regelt P1 (Start), nicht die Kurve.
const ziel = round => ZIEL_ENDE + (ZIEL_START - ZIEL_ENDE) * Math.sin(Math.PI * Math.min(1, Math.max(0, (round - 1) / 39)));
// Verhältnis zum Band: < 1 zu schwer (unter der Untergrenze), > 1 zu leicht (über dem Bogen), dazwischen 1.
const band = (R, round) => R < ZIEL_ENDE ? R / ZIEL_ENDE : R > ziel(round) ? R / ziel(round) : 1;

function p2(erg){
  const namen = Object.keys(erg), nT = erg[namen[0]][0].tage.length;
  // R je Element und Tag: geometrisches Mittel über die Maps
  const R = {}; for (const x of namen) R[x] = [...Array(nT)].map((_, i) => gm(erg[x].map(m => m.tage[i].R)));
  console.log(`P2 · beste gefundene Aufstellung je Tag · Version ${G.VERSION} · 2 Spieler · Maps ${erg[namen[0]].map(m => m.lane + ':' + m.seed).join(', ')}`);
  console.log(`R = Reserve (1 = gerade geschafft), Band: unten ${ZIEL_ENDE}, oben Bogen bis ${ZIEL_START} (Mitte), Endboss ${ZIEL_ENDE}\n`);
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
  elementeJeBlock(R, namen);
  const aus = []; for (const x of namen) R[x].forEach((v, i) => { const q = v / ziel(G.MONSTERS[i].round) / (kr[x]); if (q < 0.6 || q > 1.8) aus.push(`${G.MONSTERS[i].name} ${x} ${q.toFixed(2)}`); });
  if (aus.length) console.log('\nAusreißer je Tag (R/Ziel relativ zur Element-Kraft, < 0,6 oder > 1,8):\n  ' + aus.join('\n  '));
}
// Stärkenband je Block (L, 17.10.): in jedem 5er-Block sollen alle Elemente ähnlich stark sein (±10 % um das Block-Mittel).
// Stein zählt hier ohne Tage mit Fliegenden (eigene Grenze 25 %). Hebel bei Abweichung: Kraft je Turm (kraftT) der Türme, die in dem Block tragen.
const BAND_EL = +process.env.BAND_EL || 0.10;
function elementeJeBlock(R, namen){
  const nT = R[namen[0]].length, fl = i => !!(G.MONSTERS[i].fly || G.MONSTERS[i].cocoon), raus = [];
  console.log(`\nStärkenband je Block (R/Ziel relativ zum Block-Mittel, Ziel ±${BAND_EL * 100} %; Stein ohne Fliegende):`);
  console.log('  ' + pad('Runden', 9) + namen.map(x => pad(x, 10)).join(''));
  for (let b = 0; b < 8; b++) {
    const idx = [...Array(nT).keys()].filter(i => Math.ceil(G.MONSTERS[i].round / 5) === b + 1); if (!idx.length) continue;
    const w = namen.map(x => gm(idx.filter(i => !(x === 'Stein' && fl(i))).map(i => R[x][i] / ziel(G.MONSTERS[i].round)))), mw = gm(w);
    console.log('  ' + pad(`${b * 5 + 1}–${b * 5 + 5}`, 9) + w.map((v, j) => { const r = v / mw, ok = Math.abs(r - 1) <= BAND_EL; if (!ok) raus.push(`Runde ${b * 5 + 1}–${b * 5 + 5} ${namen[j]} ${r.toFixed(2)}`); return pad(r.toFixed(2) + (ok ? '' : ' ✗'), 10); }).join(''));
  }
  console.log(raus.length ? '  außerhalb: ' + raus.join(' · ') : '  alle Blöcke im Band ✓');
  return raus;
}
// Kraft je Gold je Turmstufe (L, 17.10.): darf mit der Stufe nicht fallen, sonst lohnen sich teure Türme nicht.
// Grundwert TOWER_POWER/Kosten steigt leicht; kraftT verschiebt das je Element. Geprüft wird nur die Stellschraube, nicht die Rolle des Turms
// (Effekt- und Lichttürme machen absichtlich wenig Schaden – ob sie sich lohnen, misst P8).
function kraftJeGold(){
  console.log('\nKraft je Gold je Turmstufe (TOWER_POWER × kraftT / Kosten, relativ zu Turm 1; soll mit der Stufe nicht fallen):');
  const raus = [];
  G.ELEMENTS.forEach((E, e) => { if (!E.towers) return;
    const w = G.TOWER_COST.map((c, k) => G.TOWER_POWER[k] * (E.kraftT ? E.kraftT[k] : 1) / ((E.costOverride && E.costOverride[k]) || c)), w0 = G.TOWER_POWER[0] / G.TOWER_COST[0];
    let mx = 0; const zeile = w.map((v, k) => { if (E.towers[k][1] === 'Licht') return '(Licht)';   // Lichttürme schießen nicht
      const f = v < mx * 0.999; if (f) raus.push(`${E.name} Turm ${k + 1}`); mx = Math.max(mx, v); return (v / w0).toFixed(2) + (f ? '✗' : ''); });
    console.log('  ' + pad(E.name, 9) + zeile.map(z => pad(z, 8)).join(''));
  });
  console.log(raus.length ? '  fällt ab bei: ' + raus.join(', ') : '  überall steigend ✓');
  return raus;
}
module.exports = { p2, ziel, band, elementeJeBlock, kraftJeGold };
