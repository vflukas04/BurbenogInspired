// Balancing-Skript, Einstieg. Verfahren und Prüfpunkte: team/BALANCING.md
//   node tools/balance/run.js p1      Prüfpunkt P1 (Start): beste Startaufstellung je Element, Runde 1
//   node tools/balance/run.js maske   Bauplatz-Maske: Kandidatenfelder je Turm (Anzahl, keine Positionen)
// Ausgaben enthalten bewusst keine Positionen (Spoiler-Regel); Platzierungs-Erkenntnisse nur in tools/balance/STRATEGIE.md.
const C = require('./core'), B = require('./build'), { G } = C;
const EL = G.ELEMENTS.map(E => E.name), cmd = process.argv[2] || 'p1';
const pad = (s, n) => String(s).padEnd(n);

if (cmd === 'p1') {
  // Ziel (seit 11.10.): mit dem Startgold schafft ein Spieler in Runde 1 ca. 12/8/6 von 20 (2/3/4 Spieler)
  const target = { 2:12, 3:8, 4:6 };
  console.log(`P1 Start · Version ${G.VERSION} · Testkarte · Startgold ${G.CONFIG.startGold}\n`);
  console.log(pad('Element', 10) + [2, 3, 4].map(p => pad(`${p} Sp. (Ziel ${target[p]})`, 18)).join('') + 'Aufbau (2 Sp.)');
  for (let e = 0; e < EL.length; e++) {
    const row = [2, 3, 4].map(p => { const w = { type:0, players:p }, r = B.greedy(e, G.CONFIG.startGold, [w], { q:target[p] / 20 });
      return { k:C.runWave(r.setup, w).kills, r }; });
    const build = row[0].r.setup.towers.map(t => `${G.ELEMENTS[t.el].towers[t.idx][0]} S${t.lvl}`).join(', ');
    console.log(pad(EL[e], 10) + row.map((x, i) => pad(`${x.k}/20 ${x.k > target[i + 2] + 2 ? '↑' : x.k < target[i + 2] - 2 ? '↓' : '✓'}`, 18)).join('') + build);
  }
  console.log('\n✓ = Ziel ±2, ↑ = zu leicht, ↓ = zu schwer');
}
if (cmd === 'maske') {
  for (let e = 0; e < EL.length; e++) console.log(pad(EL[e], 10) + G.ELEMENTS[e].towers.map((t, k) => { const m = C.mask(e, k, 1, 0.8); return `${t[0]} ${m.cells.length}`; }).join(' · '));
  console.log(`\nKandidatenfelder (≥ 80 % der besten Wegabdeckung) von ${C.free.length} freien Feldern`);
}
