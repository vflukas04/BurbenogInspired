// Zweig D, Schritt D2b (L, 24.10.): Wechselkurse der Effekte (Bremsen, Fluch, Brennen) im festen Kontext.
// Kontext: Budget des Tages in Grundtürmen (70 Gold); ein Drittel davon wird durch Effekt-Türme mit GLEICHEM Schaden/s ersetzt.
// Wert = Reserve mit Effekt-Türmen ÷ Reserve nur mit Grundtürmen. Rüstungsschaden der Elemente für die Messung aus (nur der Effekt zählt).
// Effekt-Türme: Platz 8 des Elements (Feuer = Brennen, Eis = Bremsen, Schatten = Fluch), Grundturm: Platz 8 von Stein ohne Fläche.
const C = require('../core'), { G } = C, { budget } = require('../p2');
const DPS = G.TOWER_POWER[0] / G.TOWER_COST[0] * (+process.env.DPSMUL || 1), COST = 70, SL = 8;   // DPSMUL: Kontext auf spielnahe Reserve heben
G.ELEMENTS.forEach(E => { E.armorDmg = 0; }); G.MONSTERS.forEach(m => { m.weak = [1, 1, 1, 1]; delete m.eff; });   // Faktoren je Element neutral
G.ELEMENTS[3].splashCenter = 1; G.ELEMENTS[3].splashEdge = 1;
function turm(el, t){ const E = G.ELEMENTS[el];
  E.towers[SL] = ['D-Turm', 'Schaden', 4 / G.GRID, 1, 1, 1, t.eff || 0, t.dur || 1, (t.splash || 0) / G.GRID, { effect:t.effect || 'none', fly:true }];
  if (E.costOverride) E.costOverride[SL] = COST; if (E.kraftT) E.kraftT[SL] = 1; E.kraftBlock = null;
  E._pw = DPS * COST / (E.kraft || 1); }
function power(){ G.TOWER_COST[SL] = COST; }   // Kosten gleich; Schaden/s je Element über kraft ausgeglichen (TOWER_POWER gilt für alle Elemente)
// TOWER_POWER[SL] ist für alle Elemente gleich → kraft je Element für die Messung auf 1, kraftT[SL] = 1
G.ELEMENTS.forEach(E => { E.kraft = 1; }); G.TOWER_POWER[SL] = DPS * COST; G.TOWER_COST[SL] = COST;
turm(3, {});   // Grundturm (Stein-Platz 8, ohne Fläche, ohne Rüstungsschaden)
function aufbau(n, k, el){ const used = new Set(), tw = [];
  const add = (e, cnt) => { for (const c of C.mask(e, SL, 1, 0).cells) { if (cnt <= 0) break; const key = c.x + ',' + c.y; if (used.has(key)) continue; used.add(key); tw.push({ x:c.x, y:c.y, el:e, idx:SL, lvl:1 }); cnt--; } };
  add(el, k); add(3, n - k); return { el:3, towers:tw, res:[] }; }
const TAG = !!process.env.TAG;   // TAG=1: ganzer Tag (10 Uhr + Leaks um 19 Uhr durch dieselbe Aufstellung, Effekte wandern mit)
const alle = G.MONSTERS.map((m, i) => i).filter(i => !G.MONSTERS[i].boss && !G.MONSTERS[i].mini && !G.MONSTERS[i].fly);
const tage = process.env.TAGE ? process.env.TAGE.split(',').map(x => +x - 1) : alle.filter((_, i) => i % 2 === 0);
function wert(el, t){ if (el !== null) turm(el, t); const r = [];
  for (const d of tage) for (const lane of [0, 2]) { C.useMap(lane, null); const n = Math.max(3, Math.round(budget(d).gold / COST)), k = el === null ? 0 : Math.round(n / 3);
    r.push(TAG ? C.reserveDay(aufbau(n, k, el === null ? 3 : el), { type:d, players:2 }) : C.reserveHp(aufbau(n, k, el === null ? 3 : el), { type:d, players:2 })); }
  return Math.exp(r.reduce((a, v) => a + Math.log(v), 0) / r.length); }
const basis = wert(null, {}), ctrl = [0, 1, 2].map(el => wert(el, { effect:'none' }) / basis);
console.log(`Kontext: Grundtürme, ⅓ ersetzt durch Effekt-Türme gleichen Schadens/s · ${tage.length} Tage × Maps 0/2 · Reserve ohne Effekt ${basis.toFixed(3)}`);
console.log(`Kontrolle ohne Effekt je Element (Rest-Unterschiede, werden herausgerechnet): Feuer ${ctrl[0].toFixed(3)} · Eis ${ctrl[1].toFixed(3)} · Schatten ${ctrl[2].toFixed(3)}`);
const z = (n, el, t) => console.log(n.padEnd(30) + (wert(el, t) / basis / ctrl[el]).toFixed(3));
if (process.env.FLAECHE) { for (const s of [1.5, 2]) { z(`Fläche ${s} ohne Effekt`, 1, { splash:s }); for (const [e, d] of [[0.2, 2], [0.35, 4]]) z(`Fläche ${s} + Bremsen ${e * 100} %, ${d} s`, 1, { effect:'slow', eff:e, dur:d, splash:s }); z(`Fläche ${s} + Fluch 20 %, 4 s`, 2, { effect:'curse', eff:0.2, dur:4, splash:s }); z(`Fläche ${s} + Brennen 30 %, 6 s`, 0, { effect:'burn', eff:0.3, dur:6, splash:s }); } process.exit(0); }
for (const [e, d] of [[0.2, 2], [0.35, 2], [0.35, 4], [0.5, 4]]) z(`Bremsen ${e * 100} %, ${d} s`, 1, { effect:'slow', eff:e, dur:d });
for (const [e, d] of [[0.1, 4], [0.2, 4], [0.2, 8], [0.35, 8]]) z(`Fluch ${e * 100} %, ${d} s`, 2, { effect:'curse', eff:e, dur:d });
for (const [e, d] of [[0.15, 3], [0.3, 3], [0.3, 6], [0.15, 1e9]]) z(`Brennen ${e * 100} %, ${d > 1e6 ? 'ganzer Tag' : d + ' s'}`, 0, { effect:'burn', eff:e, dur:d > 1e6 ? 'Tag' : d });
