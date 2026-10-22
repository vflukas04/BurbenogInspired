// P13 Eichung Bot ↔ Mensch (L, 22.10.): Wie viel Reserve hatten die echten Aufbauten eines Testspiels, verglichen mit dem Bot?
// Liest ein Spiel aus tools/archiv-daten/<startAt>.json (vorher: SPIEL=… node tools/archiv.js), nimmt je Tag die Türme beider
// Spieler (Stand Tagesende) auf ihren echten Maps mit dem echten Gelände und rechnet die Paar-Reserve R wie paare.js
// (10 Uhr frisch, 19 Uhr die Leaks des Partners). Dazu das Gold, das der Bot an diesem Tag gehabt hätte.
// Aufruf: SPIEGEL=<Spiegel des Spielstands> node tools/balance/p13.js <startAt> [Bot-Ordner mit paare.json]
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C;
const [startAt, botOrdner] = process.argv.slice(2);
const g = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'archiv-daten', startAt + '.json'), 'utf8'));
const seed = Math.floor(g.cfg.startAt / 1000), Q = 0.97;
const { budget } = require('./p2');
const gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
function welle(setup, lane, d, f, incoming){
  C.useMap(lane, seed);
  return C.runWave(setup, incoming ? { type:d, players:2, incoming, dark:true, hpIn:1 } : { type:d, players:2 }, f);
}
function tag(A, B, d, f){
  const a = welle(A, 0, d, f), b = welle(B, 1, d, f), hpIn = a.hpIn + b.hpIn;
  const a2 = a.out.length ? welle(B, 1, d, 1, a.out) : null, b2 = b.out.length ? welle(A, 0, d, 1, b.out) : null;
  const rest = [a2, b2].filter(Boolean).reduce((x, r) => x + r.out.reduce((y, m) => y + m.hp, 0), 0);
  return { share:1 - rest / hpIn, durch:((a2 ? a2.leaked : 0) + (b2 ? b2.leaked : 0)) * (G.MONSTERS[d].lives || 1), k1:[a.kills, b.kills] };
}
function reserve(A, B, d){
  const ok = f => tag(A, B, d, f).share >= Q; let lo = 0.02, hi = 50; if (!ok(lo)) return lo; if (ok(hi)) return hi;
  for (let i = 0; i < 16 && hi / lo > 1.01; i++) { const m = Math.sqrt(lo * hi); if (ok(m)) lo = m; else hi = m; } return lo;
}
const EL = G.ELEMENTS.map(e => e.name), tage = Object.keys(g.days || {}).map(Number).sort((a, b) => a - b);
let bot = null;
if (botOrdner) { const P = JSON.parse(fs.readFileSync(path.join(__dirname, 'ergebnisse', botOrdner, 'paare.json'), 'utf8'));
  const l = g.days[tage[tage.length - 1]].lanes, k1 = EL[l[0].el] + '+' + EL[l[1].el], k2 = EL[l[1].el] + '+' + EL[l[0].el]; bot = P.R[k1] || P.R[k2]; }
console.log(`P13 · Spiel ${startAt} · ${g.days[tage[0]].lanes.map(l => EL[l.el]).join('+')} · Version ${g.cfg.version} · Schwierigkeit ${g.cfg.diff || 'normal'}`);
console.log('Tag Monster                 Gold Mensch/Bot   R Mensch  R Bot   Verhältnis  (Durchbrüche im Spiel)');
const verh = [];
for (const t of tage) {
  const d = t - 1, L = g.days[t].lanes; if (!L || L.length < 2 || !L[0] || !L[1]) continue;
  const S = l => ({ el:l.el, towers:l.towers.map(x => ({ ...x, lvl:x.lvl || 1 })), res:l.research || [] });
  const A = S(L[0]), B = S(L[1]), R = reserve(A, B, d), rb = bot ? gm(bot[d]) : null;
  const gold = (L[0].spent || 0) + (L[1].spent || 0), sl = [0, 1].map(s => (g.slots || {})[`${t}-${s}`]).filter(Boolean);
  const durch = sl.reduce((a, s) => a + (s.broke || s.durch || 0), 0);
  if (rb) verh.push(R / rb);
  console.log(`${String(t).padEnd(4)}${G.MONSTERS[d].name.slice(0, 22).padEnd(24)}${String(Math.round(gold / 2)).padStart(5)}/${String(budget(d).gold).padEnd(10)}${R.toFixed(2).padEnd(10)}${rb ? rb.toFixed(2).padEnd(8) : '–'.padEnd(8)}${rb ? (R / rb).toFixed(2) : ''}`);
}
if (verh.length) console.log(`\nMensch ÷ Bot (geometrisches Mittel): ${gm(verh).toFixed(2)}`);
