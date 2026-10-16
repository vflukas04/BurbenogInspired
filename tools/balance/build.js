// Aufstellungssuche (Schritt 2 im Verfahren): gierig aufbauen, dann lokal verbessern.
// Seit 16.10.: glatte Bewertung. Gesucht wird ohne Kill-Schwelle (Anteil vernichteter Leben bzw. glatte Reserve),
// die Kills werden erst danach gemessen. Siehe team/BALANCING.md → Grundsätze.
const C = require('./core'), { G } = C;
const key = t => t.x + ',' + t.y;
const Q = 0.97;   // glatte Reserve: Anteil der Gesamt-Leben, der vernichtet sein muss
// Welle mit tag:true = ganzer Tag (10 Uhr frisch + 19 Uhr Leaks des Nachbarn), sonst nur die frische Welle
const run = (s, w, f) => w.tag ? C.runDay(s, w, f) : C.runWave(s, w, f);
const resv = (s, w, q) => w.tag ? C.reserveDay(s, w, q) : C.reserveHp(s, w, q);

// Bewertung (genau): geometrisches Mittel der glatten Reserven über die Prüfwellen
// Gewicht je Welle: w.wt (Standard 1), z. B. heute 1, morgen 0,5, übermorgen 0,25
const wsum = waves => waves.reduce((a, w) => a + (w.wt || 1), 0);
function score(setup, waves, q = Q){ let s = 0; for (const w of waves) s += (w.wt || 1) * Math.log(Math.max(1e-3, resv(setup, w, q))); return Math.exp(s / wsum(waves)); }
// Bewertung (schnell, für die Suche): Anteil vernichteter Leben bei festen Faktoren fRef je Welle – eine Simulation je Welle
function quick(setup, waves, fRef){ let s = 0; waves.forEach((w, i) => s += (w.wt || 1) * run(setup, w, fRef[i]).hpShare); return s / wsum(waves); }

const invest = t => t.inv || 0;
const spent = setup => setup.towers.reduce((a, t) => a + invest(t), 0);
// Upgradekosten ohne Spielzustand (curRes im Spiel braucht laufende Felder); Forschung „Upgrades billiger“ aus setup.res
const upCost = (t, res) => Math.round(G.towerBase(t.el, t.idx).cost * Math.pow(G.CONFIG.upgradeCost, t.lvl || 1) * (1 - G.resVal(new Set(res || []), 'cheap')));

// Mögliche Aktionen: Turm k auf eines der besten freien Felder seiner Maske bauen, oder einen Turm upgraden
function actions(setup, gold, opt){
  const out = [], used = new Set(setup.towers.map(key)), res = new Set(setup.res || []), el = setup.el;
  for (let k = 0; k < 8; k++) {
    if (G.LOCKS[k] && !res.has(G.LOCKS[k])) continue;
    // Felder mit Geländeaufschlag kosten mehr (Wald/Sumpf/Felsen); je Turm die besten Felder seiner Maske
    C.mask(el, k, 1, opt.keep || 0.8).cells.filter(c => !used.has(c.x + ',' + c.y)).slice(0, opt.cells || 4)
      .forEach(c => { const cost = G.buildCost(el, k, C.LANE, c.x, c.y); if (cost > gold + (opt.spar || 0)) return;
        out.push({ kind:'bau', cost, apply:s => ({ ...s, towers:[...s.towers, { x:c.x, y:c.y, el, idx:k, lvl:1, inv:cost }] }), txt:`${G.ELEMENTS[el].towers[k][0]} bauen` }); });
  }
  setup.towers.forEach((t, i) => { if ((t.lvl || 1) >= G.CONFIG.maxLevel) return;
    const cost = upCost(t, setup.res); if (cost > gold + (opt.spar || 0)) return;
    out.push({ kind:'up', cost, apply:s => ({ ...s, towers:s.towers.map((u, j) => j === i ? { ...u, lvl:(u.lvl || 1) + 1, inv:invest(u) + cost } : u) }), txt:`${G.ELEMENTS[t.el].towers[t.idx][0]} → S${(t.lvl || 1) + 1}` }); });
  return out;
}
/* Gieriger Aufbau: solange Gold da ist, die Aktion mit dem größten Zuwachs je Gold.
   Schnellbewertung: Anteil vernichteter Leben bei fRef = 1,25 × aktuelle Reserve (die aktuelle Aufstellung schafft das gerade nicht,
   jede Verbesserung zählt also stetig). Schaffen mehrere Aktionen fast alles, entscheidet die genaue Reserve. */
function greedy(el, gold, waves, opt = {}, start){
  let setup = start || { el, towers:[], res:opt.res || [] }, left = gold - spent(setup);
  const log = [];
  for (let guard = 0; guard < 300; guard++) {
    const acts = actions(setup, left, opt); if (!acts.length) break;
    const R = waves.map(w => resv(setup, w, Q)), fRef = R.map(r => Math.max(r * 1.25, 0.05));
    const base = quick(setup, waves, fRef);
    let cand = acts.map(a => { const s = a.apply(setup), v = quick(s, waves, fRef); return { a, s, v, gain:(v - base) / a.cost }; });
    const sat = cand.filter(c => c.v >= 0.999);
    if (sat.length > 1) cand = sat.map(c => ({ ...c, gain:Math.log(score(c.s, waves) / Math.exp(R.reduce((x, r, i) => x + (waves[i].wt || 1) * Math.log(r), 0) / wsum(waves))) / c.a.cost }));
    cand.sort((x, y) => y.gain - x.gain);
    const best = cand[0]; if (!best || best.gain <= 0 && setup.towers.length) break;
    // Sparen: Ist die beste Aktion noch nicht bezahlbar (opt.spar = erwartetes Einkommen), wird nichts mehr gekauft
    if (best.a.cost > left) { log.push(`spart für ${best.a.txt}`); break; }
    setup = best.s; left -= best.a.cost; log.push(`${best.a.txt} (−${best.a.cost})`);
  }
  return { setup, score:score(setup, waves), left, log };
}
/* Lokale Verbesserung (nur für die freie Suche je Welle, P2): Turm verschieben; Turm entfernen und das Gold neu gierig verteilen.
   Übernommen wird nur, was die genaue Bewertung um mehr als 1 % verbessert. */
function improve(r, gold, waves, opt = {}){
  let { setup } = r, cur = score(setup, waves), tries = 0;
  for (let pass = 0; pass < (opt.passes || 2); pass++) {
    let better = false;
    for (let i = 0; i < setup.towers.length; i++) {
      const t = setup.towers[i], used = new Set(setup.towers.map(key));
      // a) verschieben
      for (const c of C.mask(t.el, t.idx, t.lvl || 1, 0.7).cells.filter(c => !used.has(c.x + ',' + c.y)).slice(0, 6)) {
        const s = { ...setup, towers:setup.towers.map((u, j) => j === i ? { ...u, x:c.x, y:c.y } : u) }, v = score(s, waves); tries++;
        if (v > cur * 1.01) { setup = s; cur = v; better = true; break; }
      }
      // b) entfernen und neu verteilen
      const rest = { ...setup, towers:setup.towers.filter((_, j) => j !== i) }, g = greedy(setup.el, gold, waves, opt, rest); tries++;
      if (g.score > cur * 1.01) { setup = g.setup; cur = g.score; better = true; }
    }
    if (!better) break;
  }
  return { ...r, setup, score:cur, left:gold - spent(setup), tries };
}
module.exports = { score, quick, actions, greedy, improve, spent, upCost, Q };
