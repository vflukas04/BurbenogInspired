// P2 (Stand 16.10.): beste gefundene Aufstellung je Tag bei dem Gold, das man bis dahin hätte – die „Obergrenze“ (starker Bot).
// Je Element und Map: Tag für Tag, Start von der besten Aufstellung des Vortags (darf umgebaut werden: verschieben, abreißen = volles Gold zurück).
// Annahmen (team/BALANCING.md):
//   – 2 Spieler, gleiches Element auf beiden Maps; Tag = 10 Uhr frisch + 19 Uhr (dunkel) die Leaks des Nachbarn (runDay)
//   – Gold: Start + volles Kopfgeld aller Tage davor (mit Kopfgeld-Forschung); die Kasse bekommt nur, was die Forschung kostet (je Spieler die Hälfte)
//   – Forschung: siehe forschung(); Edelsteine: 1 je Spieler und Boss davor, die Suche wählt Turm und Option
//   – Maps: echte Wege mit gewürfeltem Gelände (Seeds unten), kein Wetter
// Aufruf: node tools/balance/p2.js [Element 0–3 | alle] [bisTag] [Maps z. B. 0:11,2:23]
const fs = require('fs'), path = require('path');
const C = require('./core'), B = require('./build'), { G } = C;
const SPIELER = 2;
const MAPS_STD = [[0, 11], [2, 23]];   // [Map, Gelände-Seed]

const tagWelle = d => ({ type:d, players:SPIELER, tag:true });
const einkommen = d => G.monsterDef(d, SPIELER).bounty * (G.MONSTERS[d].count || G.CONFIG.perWave);   // Kopfgeld eines Spielers an Tag d (alle getötet)
function budget(d){                      // Gold eines Spielers (ohne Forschung) und Edelsteine vor Tag d (0-basiert)
  let g = G.CONFIG.startGold, gems = 0;
  for (let i = 0; i < d; i++) { g += einkommen(i); if (G.MONSTERS[i].mini || G.MONSTERS[i].boss) gems++; }
  return { gold:Math.floor(g), gems };
}
const resCost = res => res.reduce((a, id) => a + G.RESEARCH.find(x => x.id === id).cost, 0);
/* Forschung (17.10.): Die Kasse bekommt nur, was die Forschung kostet (je Spieler die Hälfte), der Rest geht in Türme.
   – Element-Schaden, Reichweite, Effektdauer: gekauft, wenn der Zuwachs je Gold mindestens so groß ist wie beim besten Turmkauf
   – Freischaltungen und „Upgrades billiger“: Vergleich gieriger Aufbau mit und ohne (alle 3 Tage geprüft)
   – Kopfgeld: gekauft, wenn sich der Bonus über die restlichen Tage mindestens 3-fach bezahlt macht */
function forschung(setup, frei, waves, d, opt){
  for (let guard = 0; guard < 20; guard++) {
    let best = null;
    const R = waves.map(w => C.reserveDay(setup, w)), fRef = R.map(r => r * 1.25), base = B.quick(setup, waves, fRef);
    const turm = B.actions(setup, frei, { cells:3 }).reduce((m, a) => Math.max(m, (B.quick(a.apply(setup), waves, fRef) - base) / a.cost), 0);
    for (const F of G.RESEARCH) {
      const anteil = F.cost / SPIELER;
      if (setup.res.includes(F.id) || anteil > frei || (F.need && !setup.res.includes(F.need))) continue;
      const s = { ...setup, res:[...setup.res, F.id] };
      if (F.grp === 'gold') { if (d < 3 || anteil > 0.5 * frei) continue;   // nicht auf Kosten der heutigen Welle
        const rest = G.MONSTERS.slice(d).reduce((a, _, i) => a + einkommen(d + i), 0), stufe = G.RESEARCH_GROUPS.find(x => x.grp === 'gold').steps;
        const plus = (stufe[F.lvl - 1] - (F.lvl > 1 ? stufe[F.lvl - 2] : 0)) * rest; if (plus > 3 * anteil) { best = { s, g:Infinity, F }; break; } continue; }
      if (F.grp === 't5' || F.grp === 't7' || F.grp === 'cheap') {
        if (d % 3) continue;
        const ohne = B.greedy(setup.el, frei + B.spent(setup), waves, { cells:2 }, setup).score, mit = B.greedy(setup.el, frei - anteil + B.spent(setup), waves, { cells:2 }, s).score;
        if (mit > ohne * 1.01) { const g = Math.log(mit / ohne) / anteil * 1e3; if (!best || g > best.g) best = { s, g, F }; } continue; }
      const v = (B.quick(s, waves, fRef) - base) / anteil;
      if (v > 0 && v >= turm && (!best || v > best.g)) best = { s, g:v, F };
    }
    if (!best) break; setup = best.s; frei -= best.F.cost / SPIELER;
  }
  return setup;
}
// Edelsteine: neue Steine auf die Türme mit dem meisten Gold, jeweils die Option mit dem größten Zuwachs
function steine(setup, n, waves){
  // KONVERT=1 (Sonderprüfung 16.10.): Steine dürfen auch Türme in ein anderes Element umwandeln (gleiche Nummer und Stufe, Gold bleibt)
  const konv = !!process.env.KONVERT;
  for (let k = setup.used || 0; k < n; k++) {
    const R = waves.map(w => C.reserveDay(setup, w)), fRef = R.map(r => r * 1.25), base = B.quick(setup, waves, fRef);
    const top = setup.towers.map((t, i) => [t, i]).filter(([t]) => !t.gem && !t.conv).sort((a, b) => (b[0].inv || 0) - (a[0].inv || 0)).slice(0, konv ? 8 : 4);
    let best = null;
    const tryS = s => { const v = B.quick(s, waves, fRef) - base; if (!best || v > best.v) best = { s:{ ...s, used:k + 1 }, v }; };
    for (const [t, i] of top) {
      if (t.el === setup.el) for (const ab of G.gemOptions(t.el, t.idx)) {
        if (typeof ab === 'number' && G.abilityBlocked(t, ab)) continue;
        tryS({ ...setup, towers:setup.towers.map((u, j) => j === i ? { ...u, gem:true, ab } : u) }); }
      if (konv) for (let e2 = 0; e2 < 4; e2++) if (e2 !== t.el)
        tryS({ ...setup, towers:setup.towers.map((u, j) => j === i ? { ...u, el:e2, gem:false, ab:undefined, conv:true } : u) });
    }
    if (!best) break; setup = best.s;
    if (konv && process.env.LAUT) { const c = setup.towers.filter(t => t.conv).map(t => G.ELEMENTS[t.el].towers[t.idx][0]); if (c.length) console.error('  umgewandelt: ' + c.join(', ')); }
  }
  return setup;
}
function lauf(e, lane, seed, bis){
  C.useMap(lane, seed);
  let setup = { el:e, towers:[], res:[] }, gesamt = G.CONFIG.startGold, gems = 0;
  const tage = [], n = Math.min(bis || G.MONSTERS.length, G.MONSTERS.length);
  for (let d = 0; d < n; d++) {
    const w = tagWelle(d), waves = [w];
    const frei = () => gesamt - resCost(setup.res) / SPIELER - B.spent(setup);
    setup = forschung(setup, frei(), waves, d);
    const turmGold = gesamt - resCost(setup.res) / SPIELER;
    let r = B.greedy(e, turmGold, waves, { cells:3 }, setup);
    // Umbau: die zwei billigsten Türme ohne Stein abreißen und neu verteilen (nur übernehmen, wenn besser)
    const cheap = r.setup.towers.map((t, i) => [t, i]).filter(([t]) => !t.gem).sort((a, b) => (a[0].inv || 0) - (b[0].inv || 0)).slice(0, 2);
    for (const [t] of cheap) { const rest = { ...r.setup, towers:r.setup.towers.filter(u => u !== t) }, g = B.greedy(e, turmGold, waves, { cells:3 }, rest);
      if (g.score > r.score * 1.01) r = g; }
    setup = steine(r.setup, gems, waves);
    const R = C.reserveDay(setup, w), r1 = C.runDay(setup, w, 1);
    tage.push({ tag:d + 1, monster:G.MONSTERS[d].name, R:+R.toFixed(3), kills:r1.kills, n:r1.n, durch:r1.durch, gold:Math.round(gesamt), kasse:resCost(setup.res),
      wert:B.spent(setup), tuerme:setup.towers.length, stufen:setup.towers.map(t => (t.idx + 1) + '.' + (t.lvl || 1) + (t.gem ? '*' : '')).sort().join(' '), forschung:setup.res.join(' ') });
    if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} Map ${lane} Tag ${d + 1} R ${R.toFixed(2)} Wert ${B.spent(setup)}/${Math.round(gesamt)} Forschung ${setup.res.length}`);
    // Einkommen des Tages (mit Kopfgeld-Forschung), Edelstein nach Bossen
    gesamt += einkommen(d) * (1 + G.resVal(new Set(setup.res), 'gold'));
    if (G.MONSTERS[d].mini || G.MONSTERS[d].boss) gems++;
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
  fs.writeFileSync(path.join(out, `p2-${e}${process.env.KONVERT ? '-konv' : ''}.json`), JSON.stringify({ version:G.VERSION, spiegel:C.SPIEGEL, maps, erg }, null, 1));
  if (!process.env.NUR_JSON) require('./bericht').p2(erg);
}
module.exports = { lauf, budget };
