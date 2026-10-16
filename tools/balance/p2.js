// P2 (Stand 16.10.): beste gefundene Aufstellung je Tag bei dem Gold, das man bis dahin hätte – die „Obergrenze“ (starker Bot).
// Je Element und Map: Tag für Tag, Start von der besten Aufstellung des Vortags (darf umgebaut werden: verschieben, abreißen = volles Gold zurück).
// Annahmen (team/BALANCING.md):
//   – 2 Spieler, gleiches Element auf beiden Maps; Tag = 10 Uhr frisch + 19 Uhr (dunkel) die Leaks des Nachbarn (runDay)
//   – Gold: Start + volles Kopfgeld aller Tage davor; Anteil KASSE geht in die Gemeinschaftskasse (beide zahlen ein)
//   – Forschung: die Suche kauft aus der Kasse, was je Gold am meisten bringt; Edelsteine: 1 je Spieler und Boss davor, die Suche wählt Turm und Option
//   – Maps: echte Wege mit gewürfeltem Gelände (Seeds unten), kein Wetter
// Aufruf: node tools/balance/p2.js [Element 0–3 | alle] [bisTag] [Maps z. B. 0:11,2:23]
const fs = require('fs'), path = require('path');
const C = require('./core'), B = require('./build'), { G } = C;
const KASSE = 0.25, SPIELER = 2;
const MAPS_STD = [[0, 11], [2, 23]];   // [Map, Gelände-Seed]

const tagWelle = d => ({ type:d, players:SPIELER, tag:true });
function budget(d){                      // Gold eines Spielers und Kasse vor Tag d (0-basiert)
  let g = G.CONFIG.startGold, k = 0, gems = 0;
  for (let i = 0; i < d; i++) { const M = G.MONSTERS[i], b = G.monsterDef(i, SPIELER).bounty * (M.count || G.CONFIG.perWave);
    g += b * (1 - KASSE); k += b * KASSE * SPIELER; if (M.mini || M.boss) gems++; }
  return { gold:Math.floor(g), kasse:Math.floor(k), gems };
}
const resCost = res => res.reduce((a, id) => a + G.RESEARCH.find(x => x.id === id).cost, 0);
// Forschung: solange die Kasse reicht, die Forschung mit dem größten Zuwachs je Gold (Freischaltungen zählen über den besten Turm, den sie erlauben)
function forschung(setup, kasse, waves){
  for (let guard = 0; guard < 20; guard++) {
    const left = kasse - resCost(setup.res); let best = null;
    const R = waves.map(w => C.reserveDay(setup, w)), fRef = R.map(r => r * 1.25), base = B.quick(setup, waves, fRef);
    for (const F of G.RESEARCH) { if (setup.res.includes(F.id) || F.cost > left || (F.need && !setup.res.includes(F.need))) continue;
      if (F.grp === 'gold') continue;                       // Kopfgeld-Forschung wirkt erst später, im Budget nicht abgebildet
      const s = { ...setup, res:[...setup.res, F.id] };
      const v = F.grp === 't5' || F.grp === 't7' ? 0.001 : B.quick(s, waves, fRef) - base;   // Freischaltung: nur kaufen, wenn sonst nichts lohnt
      if (v > 0 && (!best || v / F.cost > best.g)) best = { s, g:v / F.cost }; }
    if (!best) break; setup = best.s;
  }
  return setup;
}
// Edelsteine: neue Steine auf die Türme mit dem meisten Gold, jeweils die Option mit dem größten Zuwachs
function steine(setup, n, waves){
  for (let k = setup.towers.filter(t => t.gem).length; k < n; k++) {
    const R = waves.map(w => C.reserveDay(setup, w)), fRef = R.map(r => r * 1.25), base = B.quick(setup, waves, fRef);
    const top = setup.towers.map((t, i) => [t, i]).filter(([t]) => !t.gem).sort((a, b) => (b[0].inv || 0) - (a[0].inv || 0)).slice(0, 4);
    let best = null;
    for (const [t, i] of top) for (const ab of G.gemOptions(t.el, t.idx)) {
      if (typeof ab === 'number' && G.abilityBlocked(t, ab)) continue;
      const s = { ...setup, towers:setup.towers.map((u, j) => j === i ? { ...u, gem:true, ab } : u) }, v = B.quick(s, waves, fRef) - base;
      if (!best || v > best.v) best = { s, v }; }
    if (!best) break; setup = best.s;
  }
  return setup;
}
function lauf(e, lane, seed, bis){
  C.useMap(lane, seed);
  let setup = { el:e, towers:[], res:[] };
  const tage = [], n = Math.min(bis || G.MONSTERS.length, G.MONSTERS.length);
  for (let d = 0; d < n; d++) {
    const w = tagWelle(d), bu = budget(d), waves = [w];
    setup = forschung(setup, bu.kasse, waves);
    let r = B.greedy(e, bu.gold, waves, { cells:3 }, setup);
    // Umbau: die zwei billigsten Türme ohne Stein abreißen und neu verteilen (nur übernehmen, wenn besser)
    const cheap = r.setup.towers.map((t, i) => [t, i]).filter(([t]) => !t.gem).sort((a, b) => (a[0].inv || 0) - (b[0].inv || 0)).slice(0, 2);
    for (const [t] of cheap) { const rest = { ...r.setup, towers:r.setup.towers.filter(u => u !== t) }, g = B.greedy(e, bu.gold, waves, { cells:3 }, rest);
      if (g.score > r.score * 1.01) r = g; }
    setup = steine(r.setup, bu.gems, waves);
    const R = C.reserveDay(setup, w), r1 = C.runDay(setup, w, 1);
    tage.push({ tag:d + 1, monster:G.MONSTERS[d].name, R:+R.toFixed(3), kills:r1.kills, n:r1.n, durch:r1.durch, gold:bu.gold, kasse:bu.kasse,
      wert:B.spent(setup), tuerme:setup.towers.length, stufen:setup.towers.map(t => (t.idx + 1) + '.' + (t.lvl || 1) + (t.gem ? '*' : '')).sort().join(' '), forschung:setup.res.join(' ') });
    if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} Map ${lane} Tag ${d + 1} R ${R.toFixed(2)} Wert ${B.spent(setup)}/${bu.gold}`);
  }
  return tage;
}
const out = path.join(__dirname, 'ergebnisse');
if (require.main === module) {
  const arg = process.argv[2] || 'alle', bis = +process.argv[3] || 0;
  const maps = process.argv[4] ? process.argv[4].split(',').map(x => x.split(':').map(Number)) : MAPS_STD;
  fs.mkdirSync(out, { recursive:true });
  if (arg === 'alle') {   // je Element ein Prozess (2 Kerne: je zwei gleichzeitig)
    const cp = require('child_process'), lauf1 = e => new Promise(r => cp.spawn(process.execPath, [__filename, String(e), String(bis), maps.map(m => m.join(':')).join(',')], { stdio:['ignore', 'inherit', 'inherit'], env:{ ...process.env, NUR_JSON:'1' } }).on('exit', r));
    return (async () => { const par = +process.env.PAR || 2, q = [0, 1, 2, 3];
      await Promise.all([...Array(par)].map(async () => { while (q.length) await lauf1(q.shift()); }));
      const erg = {}; for (let e = 0; e < 4; e++) Object.assign(erg, JSON.parse(fs.readFileSync(path.join(out, `p2-${e}.json`))).erg);
      fs.writeFileSync(path.join(out, 'p2-alle.json'), JSON.stringify({ version:G.VERSION, spiegel:C.SPIEGEL, maps, erg }, null, 1));
      require('./bericht').p2(erg); })();
  }
  const e = +arg, erg = { [G.ELEMENTS[e].name]: maps.map(([lane, seed]) => ({ lane, seed, tage:lauf(e, lane, seed, bis) })) };
  fs.writeFileSync(path.join(out, `p2-${e}.json`), JSON.stringify({ version:G.VERSION, spiegel:C.SPIEGEL, maps, erg }, null, 1));
  if (!process.env.NUR_JSON) require('./bericht').p2(erg);
}
module.exports = { lauf, budget };
