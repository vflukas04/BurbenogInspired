// Zweig D, Schritt D1 (L, 24.10.): Grundturm im Simulator.
// Ein neutraler Turm (Platz 8 von Schatten, ohne Fluch, ohne Rüstungsschaden, nur 10-Uhr-Wellen = keine Nachtregeln):
// Schaden/s ∝ Gold (DPS_JE_GOLD), Rate, Reichweite, Geschosse, Fläche frei wählbar. Merkmale werden später einzeln dazugeschaltet.
const C = require('../core'), { G } = C;
const SL = 8, E = G.ELEMENTS[2];
const DPS_JE_GOLD = G.TOWER_POWER[0] / G.TOWER_COST[0] * (+process.env.DPSMUL || 1);   // DPSMUL: Kontext auf spielnahe Reserve heben   // Schaden/s je Gold wie Turm 1 der Grunddaten (2 / 10)
const GRUND = { rate:1, range:4, shots:1, splash:0, cost:70 };   // Reichweite in Feldern (neues Raster), Kosten etwa Turm 3
// Turm definieren: m = Abweichungen vom Grundturm; dpsMul = Schaden/s-Faktor (der „Preis“ der Merkmale)
function setze(m = {}){
  const t = { ...GRUND, ...m }, opt = { effect:'none', ...(t.opt || {}) };
  E.towers[SL] = ['Grundturm', 'Schaden', t.range / G.GRID, t.rate, t.shots, 1, t.eff || 0, t.dur || 1, (t.splash || 0) / G.GRID, opt];
  G.TOWER_COST[SL] = t.cost; if (E.costOverride) E.costOverride[SL] = t.cost;
  G.TOWER_POWER[SL] = DPS_JE_GOLD * t.cost * (t.dpsMul || 1) / ((E.kraft || 1) * 1);
  if (E.kraftT) E.kraftT[SL] = 1; if (E.kraftBlock) E.kraftBlock = null;
  return t;
}
// n Kopien auf den besten freien Plätzen (eigene Maske), Map lane
function aufbau(n){ const used = new Set(), cells = C.mask(2, SL, 1, 0).cells, tw = [];
  for (const c of cells) { if (tw.length >= n) break; if ([...used].some(u => { const [x, y] = u.split(',').map(Number); return x === c.x && y === c.y; })) continue;
    used.add(c.x + ',' + c.y); tw.push({ x:c.x, y:c.y, el:2, idx:SL, lvl:1 }); }
  return { el:2, towers:tw, res:[] }; }
// Wert eines Turmtyps an Tag d: Reserve (Leben-Faktor, bei dem 97 % der Leben fallen), wenn das ganze Budget des Tages in diesem Turm steckt
const { budget } = require('../p2');
function wert(m, tage, maps = [0, 1, 2, 3]){
  const t = setze(m), r = [];
  for (const d of tage) for (const lane of maps) { C.useMap(lane, null); const n = Math.max(1, Math.round(budget(d).gold / t.cost));
    r.push(C.reserveHp(aufbau(n), { type:d, players:2 })); }
  return Math.exp(r.reduce((a, v) => a + Math.log(v), 0) / r.length);
}
module.exports = { setze, aufbau, wert, GRUND, DPS_JE_GOLD };
if (require.main === module) {
  const tage = (process.env.TAGE || '2,10,20').split(',').map(x => +x - 1), t0 = Date.now();
  console.log('Grundturm R:', wert({}, tage).toFixed(3), ((Date.now() - t0) / 1000).toFixed(0) + ' s');
}
