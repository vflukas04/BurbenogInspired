// Aufstellungssuche (Schritt 2 im Verfahren): gierig aufbauen, dann lokal verbessern.
// Bewertet wird immer mit dem Reservefaktor gegen eine oder mehrere Prüfwellen (Mittel der log-Reserven).
const C = require('./core'), { G } = C;
const key = t => t.x + ',' + t.y;

// Bewertung einer Aufstellung gegen Prüfwellen: geometrisches Mittel der Reservefaktoren
function score(setup, waves, q){ let s = 0; for (const w of waves) s += Math.log(Math.max(1e-3, C.reserve(setup, w, q, 0.02, 50))); return Math.exp(s / waves.length); }

const invest = t => t.inv || 0;
const spent = setup => setup.towers.reduce((a, t) => a + invest(t), 0);
// Mögliche Aktionen: Turm k auf eines der besten freien Felder seiner Maske bauen, oder einen Turm upgraden
function actions(setup, gold, opt){
  const out = [], used = new Set(setup.towers.map(key)), res = new Set(setup.res || []), el = setup.el;
  for (let k = 0; k < 8; k++) {
    if (G.LOCKS[k] && !res.has(G.LOCKS[k])) continue;
    const cost = G.buildCost(el, k, C.LANE, 0, 0); if (cost > gold) continue;
    C.mask(el, k, 1, opt.keep || 0.8).cells.filter(c => !used.has(c.x + ',' + c.y)).slice(0, opt.cells || 4)
      .forEach(c => out.push({ kind:'bau', cost, apply:s => ({ ...s, towers:[...s.towers, { x:c.x, y:c.y, el, idx:k, lvl:1, inv:cost }] }), txt:`${G.ELEMENTS[el].towers[k][0]} @${c.x},${c.y}` }));
  }
  setup.towers.forEach((t, i) => { if ((t.lvl || 1) >= G.CONFIG.maxLevel) return;
    const cost = G.upgradeCost(t); if (cost > gold) return;
    out.push({ kind:'up', cost, apply:s => ({ ...s, towers:s.towers.map((u, j) => j === i ? { ...u, lvl:(u.lvl || 1) + 1, inv:invest(u) + cost } : u) }), txt:`${G.ELEMENTS[t.el].towers[t.idx][0]} → S${(t.lvl || 1) + 1}` }); });
  return out;
}
/* Gieriger Aufbau: solange Gold da ist, die Aktion mit dem größten Zuwachs an log(Reserve) je Gold.
   Beginnt bei `start` (Vorwärtspfad) oder leer. log, damit Zuwächse bei kleiner und großer Reserve vergleichbar sind. */
function greedy(el, gold, waves, opt = {}, start){
  let setup = start || { el, towers:[], res:opt.res || [] }, cur = score(setup, waves, opt.q || 1), left = gold - spent(setup);
  const log = [];
  for (let guard = 0; guard < 200; guard++) {
    const acts = actions(setup, left, opt); if (!acts.length) break;
    let best = null;
    for (const a of acts) { const s = a.apply(setup), v = score(s, waves, opt.q || 1), gain = (Math.log(v) - Math.log(cur)) / a.cost;
      if (!best || gain > best.gain) best = { a, s, v, gain }; }
    if (!best || best.gain <= 0 && setup.towers.length) {
      // kein Zuwachs mehr messbar (z. B. Reserve schon am Anschlag): billigste sinnvolle Aktion nehmen, damit das Gold nicht liegen bleibt
      if (!best) break;
    }
    setup = best.s; cur = best.v; left -= best.a.cost; log.push(`${best.a.txt} (−${best.a.cost}) → ${cur.toFixed(2)}`);
  }
  return { setup, score:cur, left, log };
}
module.exports = { score, actions, greedy, spent };
