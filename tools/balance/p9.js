// P9 Edelsteine (L, 18.10.): Liegen die besten Fähigkeiten je Element nah beieinander? Gibt es Fähigkeiten ohne Wirkung?
// Vorgehen: je Element und Stichtag (Runde ~10, ~20, ~30) die beste gefundene Aufstellung zum Budget dieses Tages (gieriger Aufbau, ohne Forschung).
// Auf die 3 Türme mit dem meisten Gold wird jede Option ihres Edelsteins gesetzt und die Reserve R des Tages gemessen (Zuwachs = R mit Stein / R ohne).
// Ziel: die 3 stärksten Fähigkeiten je Element höchstens 15 % auseinander; keine Fähigkeit unter +2 %.
// Aufruf: node tools/balance/p9.js [Element 0–3 | alle]   (Spiegel wird angewandt; Dauer einige Minuten je Element)
// Grenzen: Fähigkeiten, die nur gegen Bosse oder bestimmte Monster wirken, werden am Stichtag ggf. unterschätzt; Umwandeln in andere Elemente nicht geprüft.
const C = require('./core'), B = require('./build'), { G } = C, { budget } = require('./p2');
const TAGE = (process.env.P9_TAGE || '10,21,34').split(',').map(Number);   // 0-basiert: Füchse (R10), Eifersüchtige Geliebte (R19), Magier-Novizen (R30) – keine Bosstage
const arg = process.argv[2] || 'alle', els = arg === 'alle' ? [0, 1, 2, 3] : [+arg];
const name = (t, ab) => typeof ab === 'string' ? `${G.ELEMENTS[t.el].towers[t.idx][0]}: ${({ dmg:'Schaden', rng:'Reichweite', eff:'Effekt', area:'Fläche', light:'Licht', buff:'Verstärkung' })[ab] || ab} +30 %`
  : `${G.ELEMENTS[t.el].towers[t.idx][0]}: ${(G.ABILITIES[t.el][ab] || ['Unique ' + ab])[0]}`;   // ABILITIES[el]: 0–7 erstes, 8–15 zweites Unique (18.10., F)
C.useMap(0, 11);
for (const e of els) {
  const best = {};
  for (const d of TAGE) {
    const w = { type:d, players:2, tag:true }, gold = budget(d).gold;
    const r = B.greedy(e, gold, [w], { cells:3 }), base = C.reserveDay(r.setup, w);
    const top = r.setup.towers.map((t, i) => [t, i]).sort((a, b) => (b[0].inv || 0) - (a[0].inv || 0)).slice(0, 3);
    for (const [t, i] of top) for (const ab of G.gemOptions(t.el, t.idx)) {
      if (typeof ab === 'number' && G.abilityBlocked && G.abilityBlocked(t, ab)) continue;
      const s = { ...r.setup, towers:r.setup.towers.map((u, j) => j === i ? { ...u, gem:true, ab } : u) }, g = C.reserveDay(s, w) / base, k = name(t, ab);
      if (!best[k] || g > best[k].g) best[k] = { g, tag:d + 1 };
    }
    if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} Tag ${d + 1}: ${r.setup.towers.length} Türme, R ${base.toFixed(2)}`);
  }
  const liste = Object.entries(best).sort((a, b) => b[1].g - a[1].g);
  const t3 = liste.slice(0, 3), spread = t3.length === 3 ? t3[0][1].g / t3[2][1].g : 1, schwach = liste.filter(([, v]) => v.g < 1.02);
  console.log(`\n${G.ELEMENTS[e].name}: Top 3 ${t3.map(([k, v]) => `${k} +${((v.g - 1) * 100).toFixed(0)} %`).join(' · ')}  → Abstand ×${spread.toFixed(2)} ${spread <= 1.15 ? '✓' : '✗'}`);
  console.log('  alle: ' + liste.map(([k, v]) => `${k} ${v.g >= 1 ? '+' : ''}${((v.g - 1) * 100).toFixed(0)} % (Tag ${v.tag})`).join(' · '));
  if (schwach.length) console.log('  ohne messbare Wirkung (< +2 %): ' + schwach.map(([k]) => k).join(', '));
}
