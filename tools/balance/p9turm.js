// P9 je Turm (20.10., L): Sind alle Edelstein-Fähigkeiten (2 Basics, 2 Uniques je Turm) ähnlich stark?
// Anders als p9.js (nur die 3 teuersten Türme einer gierigen Aufstellung) bekommt hier JEDER Turm einen eigenen Prüfaufbau:
//   – Stichtage je Turmnummer (Turm 1–2 ab Runde ~8, 3–4 ~17, 5–6 ~27, 7–8 ~39), je 2 normale Tage; reine Luftabwehr an Fliegertagen
//   – Aufbau: der Turm selbst auf seinem besten Feld, so hoch gestuft, wie es mit ~35 % des Tagesbudgets geht; Rest gierig aufgefüllt
//     (Freischaltungen gratis, damit Türme 5–8 prüfbar sind)
//   – je Option: Reserve des Tages mit Stein auf diesem Turm ÷ ohne Stein (geometrisches Mittel der 2 Tage)
// Bewertung: relativ zur Basic „Schaden +30 %“ desselben Turms (Licht-Turm: „Verstärkung“). 1,0 = so stark wie +30 % Schaden.
// Ziel (Vorschlag L, 20.10.): jede Option 0,75–1,33 (Faktor 1,33 um 1 herum); Basics und Uniques eines Elements ähnlich.
// Aufruf: node tools/balance/p9turm.js [Element 0–3 | alle]   (Spiegel an; alle = 2 Prozesse parallel)
const fs = require('fs'), path = require('path');
if (process.argv[2] === 'alle' || !process.argv[2]) {
  const cp = require('child_process'), q = [0, 1, 2, 3], out = {};
  return (async () => { await Promise.all([0, 1].map(async () => { while (q.length) { const e = q.shift();
    await new Promise(r => cp.spawn(process.execPath, [__filename, String(e)], { stdio:['ignore', 'inherit', 'inherit'] }).on('exit', r)); } }));
  })();
}
const C = require('./core'), B = require('./build'), { G } = C, { budget } = require('./p2');
const e = +process.argv[2], N = G.MONSTERS.length;
const LUFT = G.MONSTERS.map((m, i) => m.fly ? i : -1).filter(i => i >= 0);
const NORMAL = G.MONSTERS.map((m, i) => !m.fly && !m.mini && !m.boss ? i : -1).filter(i => i >= 0);
const START = [7, 7, 16, 16, 26, 26, 38, 38];   // 0-basiert, je Turmnummer
const naechste = (liste, d) => [...liste].sort((a, b) => Math.abs(a - d) - Math.abs(b - d) || a - b).slice(0, 2).sort((a, b) => a - b);
const name = ab => typeof ab === 'string' ? ({ dmg:'Schaden', rng:'Reichweite', eff:'Effekt', area:'Fläche', light:'Licht', buff:'Verstärkung' })[ab] + ' +30 %'
  : (G.ABILITIES[e][ab] || ['Unique ' + ab])[0];
const ALLE_RES = G.RESEARCH.filter(F => F.grp === 't5' || F.grp === 't7').map(F => F.id);
C.useMap(0, 11);
const erg = [];
for (let k = 0; k < 8; k++) {
  const tb = G.towerBase(e, k), tage = naechste(tb.air ? LUFT : NORMAL, START[k]);
  const opts = G.gemOptions(e, k), ref = opts.includes('dmg') ? 'dmg' : opts.includes('buff') ? 'buff' : opts[0];
  const g = {}; opts.forEach(ab => g[ab] = []);
  for (const d of tage) {
    const w = { type:d, players:2, tag:true }, gold = budget(d).gold;
    const c = C.mask(e, k, 1, 0.8).cells[0];
    let lvl = 1, inv = G.buildCost(e, k, C.LANE, c.x, c.y);
    while (lvl < G.CONFIG.maxLevel) { const up = Math.round(tb.cost * Math.pow(G.CONFIG.upgradeCost, lvl)); if (inv + up > 0.35 * gold) break; inv += up; lvl++; }
    const start = { el:e, towers:[{ x:c.x, y:c.y, el:e, idx:k, lvl, inv }], res:ALLE_RES };
    const s = B.greedy(e, Math.max(gold, inv), [w], { cells:2 }, start).setup, base = C.reserveDay(s, w);
    for (const ab of opts) {
      if (typeof ab === 'number' && G.abilityBlocked(s.towers[0], ab)) { g[ab].push(null); continue; }
      const s2 = { ...s, towers:s.towers.map((t, i) => i === 0 ? { ...t, gem:true, ab } : t) };
      g[ab].push(C.reserveDay(s2, w) / base);
    }
    if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} ${tb.name} Tag ${d + 1} S${lvl} R ${base.toFixed(2)}`);
  }
  const gm = a => { a = a.filter(x => x); return a.length ? Math.exp(a.reduce((x, v) => x + Math.log(v), 0) / a.length) : null; };
  const G1 = Object.fromEntries(opts.map(ab => [ab, gm(g[ab])])), r0 = G1[ref] - 1;
  erg.push({ turm:tb.name, k, tage:tage.map(d => d + 1), ref:name(ref), refPlus:r0,
    opt:opts.map(ab => ({ ab, name:name(ab), unique:typeof ab === 'number', plus:G1[ab] === null ? null : G1[ab] - 1, rel:G1[ab] === null || r0 < 0.02 ? null : (G1[ab] - 1) / r0 })) });
}
const out = path.join(__dirname, 'ergebnisse'); fs.mkdirSync(out, { recursive:true });
fs.writeFileSync(path.join(out, `p9turm-${e}.json`), JSON.stringify({ version:G.VERSION, spiegel:C.SPIEGEL, erg }, null, 1));
const f = v => v === null ? '–' : (v >= 0 ? '+' : '') + (v * 100).toFixed(0) + ' %';
let txt = `\n${G.ELEMENTS[e].name} (rel = Wirkung ÷ „${'Schaden +30 %'}“ desselben Turms; Ziel 0,75–1,33):\n`;
for (const t of erg) txt += `  ${t.turm.padEnd(14)} Tage ${t.tage.join('/')}: ` + t.opt.map(o => `${o.unique ? '★' : ''}${o.name} ${f(o.plus)}${o.rel === null ? '' : ` (rel ${o.rel.toFixed(2)}${o.rel < 0.75 || o.rel > 1.33 ? ' ✗' : ''})`}`).join(' · ') + '\n';
console.log(txt);
