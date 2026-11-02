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
  let g = G.newGameState(cfg); const tag = [];
  while (!g.over) { const d = g.day, k0 = [...g.kills];
    const lanes = els.map((e, i) => ({ el:e, towers:towersOf(e, b, i, d), gid:startAt, research:[] }));
    g = G.resolveSlot(g, lanes); (tag[d - 1] = tag[d - 1] || Array(n).fill(0)).forEach((_, i) => tag[d - 1][i] += g.kills[i] - k0[i]); }
  return { kills:g.kills, earned:g.earned, passed:g.passed, tag };
}
const fmt = a => a.map(x => (x * 100).toFixed(0).padStart(3) + ' %').join(' ');
const share = a => { const s = a.reduce((p, q) => p + q, 0) || 1; return a.map(x => x / s); };
const aufstellungen = (process.env.SPIELE || '0123,01,02,03,12,13,23').split(',');
for (const b of BOTS) for (const a of aufstellungen) { const els = a.split('').map(Number), R = [];
  for (const st of [1793615622211, 1794000000000]) R.push(spiel(els, b, st));
  const k = els.map((_, i) => R.reduce((s, r) => s + r.kills[i], 0)), gold = els.map((_, i) => R.reduce((s, r) => s + r.earned[i], 0));
  const blk = [0, 1, 2, 3].map(q => share(els.map((_, i) => R.reduce((s, r) => s + r.tag.slice(q * 12, q * 12 + 12).reduce((p, t) => p + (t ? t[i] : 0), 0), 0))));
  console.log(`${b.padEnd(7)} ${els.map(e => N[e]).join('+').padEnd(26)} Kills ${fmt(share(k))} | Gold ${fmt(share(gold))} | Blöcke ${blk.map(fmt).join(' / ')} | durch ${R.map(r => r.passed).join('/')}`); }
