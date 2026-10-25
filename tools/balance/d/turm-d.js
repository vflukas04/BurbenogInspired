// Zweig D, Schritt D3a (L, 25.10.): Wert jedes echten Turms im Paar-Kontext (Lebensanteil-Reserve, ganzer Tag, Durchbrüche mit).
// Kontext wie D2f: eigene Hälfte des Tagesbudgets in Kopien des geprüften Turms (Element e, Turm k, Stufe l), Partner-Hälfte in Grundtürmen
// (neutral, Stein-Platz 8 ohne Fläche/Rüstungsschaden). Wert = Reserve ÷ Reserve mit Grundtürmen auf beiden Hälften (gleiches Gold).
// Faktoren je Element neutral. Rüstungsschaden, Fläche, Effekte, Fliegende des Turms zählen (das sind seine Merkmale).
// Tage: reine Luftabwehr nur Fliegertage, Türme ohne Luftangriff nur übrige, sonst alle (ohne Bosse); jeder 2. Tag, Maps 0 und 2.
// Aufruf: STAPEL_ALLE=1 SPIEGEL=… node tools/balance/d/turm-d.js [Elemente 0,1,2,3] [Stufen 1,3,6] > Ausgabe
const C = require('../core'), { G } = C, { budget } = require('../p2');
const SL = 8, GP = G.TOWER_POWER[0] / G.TOWER_COST[0] * (+process.env.DPSMUL || 5), GC = 70;
G.MONSTERS.forEach(m => { m.weak = [1, 1, 1, 1]; delete m.eff; });
const S = G.ELEMENTS[3]; S.towers[SL] = ['Grund', 'Schaden', 4 / G.GRID, 1, 1, 1, 0, 1, 0, { effect:'none', fly:true }];
if (S.kraftT) S.kraftT[SL] = 1; G.TOWER_COST[SL] = GC; if (S.costOverride) S.costOverride[SL] = GC;
G.TOWER_POWER[SL] = GP * GC / ((S.kraft || 1) * (S.kraftBlock ? 1 : 1));
const armorStein = S.armorDmg, sc = [S.splashCenter, S.splashEdge];
const grundAn = () => { S.armorDmg = 0; S.splashCenter = 1; S.splashEdge = 1; }, grundAus = () => { S.armorDmg = armorStein; S.splashCenter = sc[0]; S.splashEdge = sc[1]; };
const B0 = require('../sim').load(), preis = (e, k) => G.towerBase(e, k).cost;
const gold = (e, k, l) => { let g = preis(e, k); for (let i = 1; i < l; i++) g += Math.round(preis(e, k) * Math.pow(G.CONFIG.upgradeCost, i)); return g; };
const ALLE = G.MONSTERS.map((m, i) => i).filter(i => !G.MONSTERS[i].boss && !G.MONSTERS[i].mini), FL = new Set(ALLE.filter(i => G.MONSTERS[i].fly));
const tageVon = (e, k) => { const b = G.towerBase(e, k); const t = b.air ? [...FL] : b.hitsFly ? ALLE : ALLE.filter(d => !FL.has(d)); return t.filter((_, i) => i % 2 === 0); };
function aufbau(e, k, l, nT, nG){ const used = new Set(), tw = [];
  const add = (el, idx, lvl, n) => { for (const c of C.mask(el, idx, lvl, 0).cells) { if (n <= 0) break; const q = c.x + ',' + c.y; if (used.has(q)) continue; used.add(q); tw.push({ x:c.x, y:c.y, el, idx, lvl }); n--; } };
  if (nT) add(e, k, l, nT); add(3, SL, 1, nG); return { el:e, towers:tw, res:[] }; }
const R0 = {};
// Einsatzfenster (25.10.): nur Tage, an denen die eigene Budget-Hälfte 1–8 Kopien bezahlt (sonst unbezahlbar bzw. Plätze gehen aus)
function fenster(e, k, l){ const g = gold(e, k, l), alle = (() => { const b = G.towerBase(e, k); return b.air ? [...FL] : b.hitsFly ? ALLE : ALLE.filter(d => !FL.has(d)); })();
  let t = alle.filter(d => { const q = budget(d).gold / 2 / g; return q >= 1 && q <= 8; });
  if (!t.length) t = [alle.reduce((a, d) => Math.abs(Math.log(budget(d).gold / 2 / g / 3)) < Math.abs(Math.log(budget(a).gold / 2 / g / 3)) ? d : a, alle[0])];
  if (t.length > 12) t = t.filter((_, i) => i % Math.ceil(t.length / 12) === 0);
  return t; }
function wert(e, k, l){ const r = [], dq = []; const g = gold(e, k, l);
  for (const d of fenster(e, k, l)) for (const lane of [0, 2]) { C.useMap(lane, null); const half = budget(d).gold / 2, nT = Math.max(1, Math.round(half / g)), nG = Math.max(1, Math.round(half / GC));
    const w = { type:d, players:2 }, key = d + ':' + lane + ':' + nG;
    if (!(key in R0)) { grundAn(); R0[key] = C.reserveDay(aufbau(0, 0, 1, 0, 2 * nG), w); }
    grundAn(); const x = C.reserveDay(aufbau(e, k, l, nT, nG), w) / R0[key];
    // Gold-Ausgleich: nT Kopien kosten nT·g statt half → auf gleiches Gold umrechnen (Reserve etwa ∝ Gold)
    r.push(x * half / (nT * g)); }
  return Math.exp(r.reduce((a, v) => a + Math.log(v), 0) / r.length); }
const EL = (process.argv[2] || '0,1,2,3').split(',').map(Number), ST = (process.argv[3] || '1,3,6').split(',').map(Number);
console.log(`Turm-Wert im Paar-Kontext (1 = Grundturm gleichen Golds) · Stufen ${ST.join('/')} · STAPEL_ALLE=${process.env.STAPEL_ALLE ? 1 : 0}`);
const out = {};
for (const e of EL) for (let k = 0; k < 8; k++) { const b = G.towerBase(e, k); if (b.light || b.buff) { console.log(`${G.ELEMENTS[e].name} ${b.name}: Licht-Turm, später`); continue; }
  const v = ST.map(l => wert(e, k, l)); out[e + ',' + k] = v;
  console.log(`${G.ELEMENTS[e].name} ${b.name}: ${v.map(x => x.toFixed(3)).join(' ')}`); }
require('fs').writeFileSync(process.env.AUS || '/dev/null', JSON.stringify({ ST, out }));
