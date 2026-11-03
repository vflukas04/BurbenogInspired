// Zweig D (L 04.11.): Testspiel aus dem Archiv in anderer Sitzreihenfolge nachspielen (Türme aus dem Archiv, Stand Tagesende; VAR=mix: erste Welle mit den Türmen vom Vortag).
// Aufruf: SEITE=<Seite der gespielten Version> VAR=mix node tools/balance/d/reihe.js   (NUR=1: nur die gespielte Reihenfolge, TAGE=1: Kills je Tag echt/nachgespielt)
// Spiel nachspielen mit anderer Sitzreihenfolge: jeder behält seine Map und seine Türme (Archiv, Stand Tagesende), nur wer wessen Durchgelassene bekommt, ändert sich
const G = require('/home/claude/burbenoginspired/tools/balance/sim').load(process.env.SEITE || '/home/claude/burbenoginspired/spiegel-d.html');
const A = require('/home/claude/burbenoginspired/tools/archiv-daten/1793650824777.json');
const n = 4, cfg = A.cfg, SL = cfg.slots, N = ['Feuer', 'Eis', 'Schatten', 'Stein'];
const g = { cfg }, startAt = cfg.startAt;
function spiel(order){   // order[p] = Spieler (= Map) auf Platz p
  const kills = Array(n).fill(0), earned = Array(n).fill(0); let broke = 0; const proTag = [];
  for (let day = 1; day <= 48; day++) { const D = A.days[day]; if (!D) break; const wd = G.weatherDay(g, day), wind = G.windDirOf(g, day);
    const res = [...new Set(D.lanes.flatMap(l => l.research || []))];
    let leaked = null;
    for (let slot = 0; slot < SL.length; slot++) {
      const inc = order.map((pl, p) => slot === 0 ? G.waveSpecs(day) : (leaked[(p - 1 + n) % n] || []));
      if (slot > 0 && !inc.some(x => x.length)) break;
      const VAR = process.env.VAR || 'ende', Dp = A.days[day - 1] || D, Dx = VAR === 'vortag' || (VAR === 'mix' && slot === 0) ? Dp : D;
      const inputs = order.map((pl, p) => { const l = Dx.lanes[pl]; return { lane:pl, players:n, res, el:l.el, towers:l.towers.map(t => ({ x:t.x, y:t.y, el:l.el, idx:t.idx, lvl:t.lvl, gem:t.gem, ab:t.ab ?? undefined })),
        incoming:JSON.parse(JSON.stringify(inc[p])), dark:SL[slot] >= G.CONFIG.darkFrom, weather:wd[slot], wind, tseed:startAt, seed:(Math.floor(startAt / 1000) * 31 + day * 977 + slot * 131 + p * 17) >>> 0 }; });
      const sims = G.simulateWorld({ inputs, live:false }).sims; leaked = [];
      sims.forEach((r, p) => { const pl = order[p]; kills[pl] += r.kills; earned[pl] += r.earned;
        const pass = r.leaked.filter(m => m.hops < n), outs = r.leaked.filter(m => m.hops >= n);
        if (pass.length) { const t0 = Math.min(...pass.map(m => m.at || 0)); pass.forEach(m => m.at = +((m.at || 0) - t0).toFixed(2)); pass.sort((a, b) => a.at - b.at); }
        (proTag[day] = proTag[day] || Array(n).fill(0))[pl] += r.kills; leaked[p] = pass; broke += outs.reduce((a, m) => a + (G.MONSTERS[m.type].lives || 1), 0); }); } }
  return { kills, earned, broke, proTag };
}
const els = A.days[48].lanes.map(l => l.el), name = order => order.map(pl => N[els[pl]]).join(' → ');
const real = [0, 1, 2, 3].map(i => Object.values(A.slots).reduce((s, x) => s + x.earned[i], 0)), realK = [0, 1, 2, 3].map(i => Object.values(A.slots).reduce((s, x) => s + x.kills[i], 0));
console.log('Echtes Spiel (' + name([0, 1, 2, 3]) + '): Gold ' + real.join('/') + ' · Kills ' + realK.join('/') + ' · durch ' + A.passed);
if (process.env.TAGE) { const r = spiel([0, 1, 2, 3]); for (let d = 1; d <= 48; d++) { const real = [0,1,2,3].map(i => [0,1,2,3].reduce((s, w) => s + ((A.slots[d + '-' + w] || {}).kills || [0,0,0,0])[i], 0)); console.log(d, 'echt', real.join('/'), 'nach', (r.proTag[d] || []).join('/')); } process.exit(0); }
const orders = process.env.NUR ? [[0, 1, 2, 3]] : [[0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1]], out = [];
for (const o of orders) { const r = spiel(o); out.push({ order:name(o), earned:r.earned, kills:r.kills, broke:r.broke }); console.log(name(o).padEnd(36), 'Gold', r.earned.join('/'), '· Kills', r.kills.join('/'), '· durch', r.broke); }
require('fs').writeFileSync('/tmp/claude-0/-home-claude/cb61455d-aedd-5259-aca4-e301840c7098/scratchpad/reihe.json', JSON.stringify({ els, out, real, realK }));
