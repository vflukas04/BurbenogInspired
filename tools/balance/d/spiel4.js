// Zweig D7 (L 02.11.): Ganze Spiele mit 2–4 Spielern über die echte Spiel-Auswertung (resolveSlot), um zu prüfen,
// ob alle Spieler über das Spiel ähnlich viele Kills/Gold bekommen. Türme je Spieler und Tag aus Bot-Plänen (d/bots.js, je Element
// und Map; Gold fest wie dort, nicht aus den Kills). Ohne Forschung, ohne Edelsteine, Verlieren abgeschaltet.
// Aufruf: SEITE=spiegel-d.html PLAENE=<Ordner mit e<EL>/<BOT>.json> BOT=kern node tools/balance/d/spiel4.js
const fs = require('fs'), path = require('path'), sim = require('../sim');
const G = sim.load(path.resolve(process.env.SEITE || 'spiegel-d.html'));
G.CONFIG.lossLimit = 1e9;
const DIR = path.resolve(process.env.PLAENE), BOTS = (process.env.BOT || 'kern').split(','), N = ['Feuer', 'Eis', 'Schatten', 'Stein'];
const plan = {}; for (let e = 0; e < 4; e++) for (const b of BOTS) plan[e + b] = JSON.parse(fs.readFileSync(path.join(DIR, 'e' + e, b + '.json')));
const towersOf = (e, b, lane, d) => { const m = plan[e + b].maps.find(x => x.lane === lane); return m.tage[Math.min(d, m.tage.length) - 1].towers.map(t => ({ ...t, el:e })); };
function spiel(els, b, startAt){
  const n = els.length, cfg = { players:n, timing:'manual', interval:3, startAt, live:false, diff:'normal', startGold:30, version:G.VERSION, slots:G.CONFIG.slotPlan[n] };
  let g = G.newGameState(cfg); const tag = [], erst = [];
  while (!g.over) { const d = g.day, sl = g.slot, k0 = [...g.kills];
    const lanes = els.map((e, i) => ({ el:e, towers:towersOf(e, b, i, d), gid:startAt, research:[] }));
    g = G.resolveSlot(g, lanes); (tag[d - 1] = tag[d - 1] || Array(n).fill(0)).forEach((_, i) => tag[d - 1][i] += g.kills[i] - k0[i]);
    if (sl === 0) erst[d - 1] = els.map((_, i) => g.kills[i] - k0[i]); }   // 02.11.: Kills im ersten Durchlauf (eigene Welle)
  return { kills:g.kills, earned:g.earned, passed:g.passed, tag, erst };
}
const fmt = a => a.map(x => (x * 100).toFixed(0).padStart(3) + ' %').join(' ');
const share = a => { const s = a.reduce((p, q) => p + q, 0) || 1; return a.map(x => x / s); };
const aufstellungen = (process.env.SPIELE || '0123,01,02,03,12,13,23').split(',');
for (const b of BOTS) for (const a of aufstellungen) { const els = a.split('').map(Number), R = [];
  for (const st of [1793615622211, 1794000000000]) R.push(spiel(els, b, st));
  const k = els.map((_, i) => R.reduce((s, r) => s + r.kills[i], 0)), gold = els.map((_, i) => R.reduce((s, r) => s + r.earned[i], 0));
  const blk = [0, 1, 2, 3].map(q => share(els.map((_, i) => R.reduce((s, r) => s + r.tag.slice(q * 12, q * 12 + 12).reduce((p, t) => p + (t ? t[i] : 0), 0), 0))));
  console.log(`${b.padEnd(7)} ${els.map(e => N[e]).join('+').padEnd(26)} Kills ${fmt(share(k))} | Gold ${fmt(share(gold))} | Blöcke ${blk.map(fmt).join(' / ')} | durch ${R.map(r => r.passed).join('/')}`); }
// ERST=1 (02.11.): je Element Anteil der eigenen Welle, der im ersten Durchlauf stirbt (Mittel über alle Aufstellungen, Bodentage ohne Bosse), je Block – das „Gefühl“
if (process.env.ERST) { const FLY = new Set([10, 13, 23, 28, 30, 34, 40, 46]), acc = [0, 1, 2, 3].map(() => [0, 1, 2, 3].map(() => [0, 0]));
  for (const b of BOTS) for (const a of aufstellungen) { const els = a.split('').map(Number);
    for (const st of [1793615622211, 1794000000000]) { const r = spiel(els, b, st);
      r.erst.forEach((k, d) => { if (!k || FLY.has(d + 1) || G.MONSTERS[d].mini || G.MONSTERS[d].boss) return; const n = G.MONSTERS[d].count || G.CONFIG.perWave;
        els.forEach((e, i) => { const q = acc[e][Math.min(3, Math.floor(d / 12))]; q[0] += k[i] / n; q[1]++; }); }); } }
  console.log('Erster Durchlauf, Anteil getötet (Bodentage ohne Bosse), Block 1/2/3/4:');
  acc.forEach((bl, e) => console.log('  ' + N[e].padEnd(9) + bl.map(([s, c]) => (100 * s / (c || 1)).toFixed(0).padStart(4) + ' %').join(''))); }
