// Zweig D (L, 25.10.): Schnelldurchlauf mit festem Ausbauplan.
// Pläne = Aufstellungen je Tag, die der Bot für die Standardtürme gefunden hat (ergebnisse/kandidat-d0, -d0b; je eine Map).
// Variation: Turmtypen in VAR (z. B. "3" oder "2,3") werden an ihren Plätzen entfernt und auf die besten freien Plätze ihrer eigenen
// Maske neu gesetzt (gleiche Stufe, gleiches Gold) – alles andere bleibt. Ergebnis: Reserve je Tag (wie P2: ganzer Tag, beide Spieler gleich).
// Aufruf: STAPEL_ALLE=1 SPIEGEL=<Spiegel> [VAR=3] node tools/balance/d/plan.js [Element 0] [Tage 1-48]
const C = require('../core'), { G } = C, path = require('path');
const PLAENE = (process.env.PLAENE || 'standard-map0,standard-map2').split(',').map(o => require(path.join(__dirname, 'plaene', o + '.json')).erg.Feuer[0]);   // Pläne liegen im Repo (d/plaene)
if (process.env.D_WETTER === '0') G.WEATHER.forEach(w => { w.el = {}; delete w.burnDecay; });   // Wetter ohne Element-Wirkung (Prüfung)
const VAR = process.env.VAR ? process.env.VAR.split(',').map(Number) : [];
const el = +(process.argv[2] || 0), [t0, t1] = (process.argv[3] || '1-48').split('-').map(Number);
// Reine Luftabwehr (L-Regel, D2): im Plan stehen Standardtürme, die alles treffen. Steht ein Luftabwehr-Typ im Plan,
// wird er an Tagen ohne Fliegende durch den nächsten Nicht-Luftturm mit möglichst gleichem Gold ersetzt (Stufe nach Gold).
const goldVon = (e, k, l) => { let g = G.towerBase(e, k).cost; for (let i = 1; i < l; i++) g += Math.round(G.towerBase(e, k).cost * Math.pow(G.CONFIG.upgradeCost, i)); return g; };
function ersatz(t, d){ if (!G.towerBase(el, t.idx).air || G.MONSTERS[d].fly) return t;
  const g = goldVon(el, t.idx, t.lvl); let best = null;
  for (let k = 0; k < 8; k++) { if (G.towerBase(el, k).air) continue; for (let l = 1; l <= 6; l++) { const q = Math.abs(Math.log(goldVon(el, k, l) / g)); if (!best || q < best.q) best = { q, idx:k, lvl:l }; } }
  return { ...t, idx:best.idx, lvl:best.lvl, _ersatz:true }; }
function umsetzen(towers, d){ towers = towers.map(t => ersatz(t, d));
  const VAR2 = [...new Set([...VAR, ...towers.filter(t => t._ersatz).map(t => t.idx)])];
  if (!VAR2.length) return towers.map(t => ({ ...t, el }));
  const bleib = towers.filter(t => !VAR2.includes(t.idx)).map(t => ({ ...t, el })), neu = towers.filter(t => VAR2.includes(t.idx));
  const used = new Set(bleib.map(t => t.x + ',' + t.y));
  for (const t of neu) { const c = C.mask(el, t.idx, t.lvl, 0).cells.find(c => !used.has(c.x + ',' + c.y)); used.add(c.x + ',' + c.y); bleib.push({ ...t, el, x:c.x, y:c.y }); }
  return bleib;
}
function lauf(){ const out = [];
  for (let d = t0 - 1; d < t1; d++) { if (process.env.TAGART === 'flieg' && !G.MONSTERS[d].fly) continue; if (process.env.TAGART === 'boden' && G.MONSTERS[d].fly) continue;   // TAGART: nur Flieger- bzw. Bodentage
    const r = PLAENE.map(p => { C.useMap(p.lane, p.seed); const s = p.tage[d].setup;
      return C.reserveDay({ el, towers:umsetzen(s.towers, d), res:(s.res || []).map(r => r.replace(/^el0:/, `el${el}:`)) }, { type:d, players:2 }); });   // Element-Forschung des Plans (Feuer) auf das geprüfte Element umschreiben
    out.push({ d, r, m:Math.sqrt(r[0] * r[1]) }); }
  return out; }
module.exports = { lauf };
if (require.main === module) { const o = lauf(), gm = Math.exp(o.reduce((a, x) => a + Math.log(x.m), 0) / o.length);
  console.log(o.map(x => `${x.d + 1} ${G.MONSTERS[x.d].name.slice(0, 16)} ${x.r.map(v => v.toFixed(2)).join('/')}`).join('\n'));
  console.log(`Mittel Reserve ${gm.toFixed(3)}`); }
