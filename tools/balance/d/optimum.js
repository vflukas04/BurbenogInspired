// Zweig D (L 27.10. 15 Uhr): optimaler Aufbau OHNE Pfad – für das Gold eines Tages das beste Setup aus dem Nichts (wie P2 zu Beginn).
// Bewertung: genaue Reserve (ganzer Tag) an den Wellen TAGE (Standard 44–48), geometrisches Mittel. Suche: gierig (build.js) von mehreren
// Startpunkten (0–4 × T8, 0–3 × T7 auf den besten Feldern vorab, weil die Schnellbewertung große Käufe unterschätzt), bester Start → lokale
// Verbesserung (verschieben, entfernen + neu verteilen). Umgebung wie bots.js (festes Gold, alles frei, ohne Wetter, neutrale Faktoren).
// Aufruf: SPIEGEL=<Spiegel> [TAGE=44-48] [GOLDTAG=48] node tools/balance/d/optimum.js → ergebnisse/optimum/<Spiegel>-t<GOLDTAG>.json
const fs = require('fs'), path = require('path'), C = require('../core'), B = require('../build'), { G } = C;
const bots = require('./bots');
const [a, b] = (process.env.TAGE || '44-48').split('-').map(Number), goldTag = +(process.env.GOLDTAG || 48);
const waves = []; for (let d = a; d <= b; d++) waves.push({ type:d - 1, players:2, tag:true });
const MAPS = [[0, 11], [2, 23]], opt = { cells:3, keep:0.8 }, gold = bots.budget(goldTag - 1);
const txt = tw => bots.aufbauText(tw), erg = { spiegel:process.env.SPIEGEL, tage:[a, b], goldTag, gold, maps:[] };
const vorab = (k, n, used) => { const out = []; for (const c of C.mask(0, k, 1, 0).cells) { if (out.length >= n) break; if (used.has(c.x + ',' + c.y)) continue;
  used.add(c.x + ',' + c.y); out.push({ x:c.x, y:c.y, el:0, idx:k, lvl:1, inv:G.buildCost(0, k, C.LANE, c.x, c.y) }); } return out; };
for (const [lane, seed] of MAPS) { C.useMap(lane, seed); const t0 = Date.now(); let best = null;
  for (const [n8, n7] of [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 2], [0, 3], [3, 2]]) {
    const used = new Set(), start = { el:0, towers:[...vorab(7, n8, used), ...vorab(6, n7, used)], res:[] };
    if (B.spent(start) > gold) continue;
    const g = B.greedy(0, gold, waves, opt, start);
    console.log(`  Map ${lane} Start ${n8} × T8, ${n7} × T7: ${g.score.toFixed(3)} | ${txt(g.setup.towers)}`);
    if (!best || g.score > best.score) best = g; }
  const r = B.improve(best, gold, waves, { ...opt, passes:+(process.env.PASSES || 1) });
  const R = waves.map(w => C.reserveDay(r.setup, w));
  console.log(`Map ${lane}: Reserve ${r.score.toFixed(3)} (je Tag ${R.map(x => x.toFixed(2)).join('/')}) · ${txt(r.setup.towers)} · Gold ${B.spent(r.setup)}/${gold} · ${Math.round((Date.now() - t0) / 1000)} s`);
  erg.maps.push({ lane, seed, score:r.score, R, towers:r.setup.towers }); }
const dir = path.join(__dirname, '..', 'ergebnisse', 'optimum'); fs.mkdirSync(dir, { recursive:true });
fs.writeFileSync(path.join(dir, `${path.basename(process.env.SPIEGEL || 'x', '.json')}-t${goldTag}.json`), JSON.stringify(erg));
