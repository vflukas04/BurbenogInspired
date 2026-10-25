// Zweig D (L, 25.10.): Schnelldurchlauf mit festem Ausbauplan.
// Pläne = Aufstellungen je Tag, die der Bot für die Standardtürme gefunden hat (ergebnisse/kandidat-d0, -d0b; je eine Map).
// Variation: Turmtypen in VAR (z. B. "3" oder "2,3") werden an ihren Plätzen entfernt und auf die besten freien Plätze ihrer eigenen
// Maske neu gesetzt (gleiche Stufe, gleiches Gold) – alles andere bleibt. Ergebnis: Reserve je Tag (wie P2: ganzer Tag, beide Spieler gleich).
// Aufruf: STAPEL_ALLE=1 SPIEGEL=<Spiegel> [VAR=3] node tools/balance/d/plan.js [Element 0] [Tage 1-48]
const C = require('../core'), { G } = C, path = require('path');
const PLAENE = (process.env.PLAENE || 'standard-map0,standard-map2').split(',').map(o => require(path.join(__dirname, 'plaene', o + '.json')).erg.Feuer[0]);   // Pläne liegen im Repo (d/plaene)
const VAR = process.env.VAR ? process.env.VAR.split(',').map(Number) : [];
const el = +(process.argv[2] || 0), [t0, t1] = (process.argv[3] || '1-48').split('-').map(Number);
function umsetzen(towers){
  if (!VAR.length) return towers.map(t => ({ ...t, el }));
  const bleib = towers.filter(t => !VAR.includes(t.idx)).map(t => ({ ...t, el })), neu = towers.filter(t => VAR.includes(t.idx));
  const used = new Set(bleib.map(t => t.x + ',' + t.y));
  for (const t of neu) { const c = C.mask(el, t.idx, t.lvl, 0).cells.find(c => !used.has(c.x + ',' + c.y)); used.add(c.x + ',' + c.y); bleib.push({ ...t, el, x:c.x, y:c.y }); }
  return bleib;
}
function lauf(){ const out = [];
  for (let d = t0 - 1; d < t1; d++) { if (process.env.TAGART === 'flieg' && !G.MONSTERS[d].fly) continue; if (process.env.TAGART === 'boden' && G.MONSTERS[d].fly) continue;   // TAGART: nur Flieger- bzw. Bodentage
    const r = PLAENE.map(p => { C.useMap(p.lane, p.seed); const s = p.tage[d].setup;
      return C.reserveDay({ el, towers:umsetzen(s.towers), res:s.res }, { type:d, players:2 }); });
    out.push({ d, r, m:Math.sqrt(r[0] * r[1]) }); }
  return out; }
module.exports = { lauf };
if (require.main === module) { const o = lauf(), gm = Math.exp(o.reduce((a, x) => a + Math.log(x.m), 0) / o.length);
  console.log(o.map(x => `${x.d + 1} ${G.MONSTERS[x.d].name.slice(0, 16)} ${x.r.map(v => v.toFixed(2)).join('/')}`).join('\n'));
  console.log(`Mittel Reserve ${gm.toFixed(3)}`); }
