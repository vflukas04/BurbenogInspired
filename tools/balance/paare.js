// Gemischte Paare (19.10., L): Ringregel prüfen – fängt der Partner den Malus-Tag eines Elements auf?
// P2 baut je Element allein (beide Spieler gleiches Element). Hier werden die gespeicherten Tages-Aufstellungen
// zweier Elemente gegeneinander gesetzt: 10 Uhr frische Welle bei beiden, 19 Uhr (dunkel) laufen die Leaks
// von A bei B weiter und umgekehrt. Gemessen: Paar-Reserve (glatt, wie P2) und Durchbrüche bei Faktor 1.
// Aufruf: node tools/balance/paare.js [Ordner unter ergebnisse/, z. B. voraus]   (liest p2-alle.json mit gespeicherten Aufstellungen)
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C;
const dir = path.join(__dirname, 'ergebnisse', process.argv[2] || '');
const daten = JSON.parse(fs.readFileSync(path.join(dir, 'p2-alle.json'), 'utf8'));
const namen = Object.keys(daten.erg);
if (!daten.erg[namen[0]][0].tage[0].setup) { console.log('Diese P2-Ergebnisse enthalten keine Aufstellungen (vor 19.10.). Bitte P2 neu rechnen.'); process.exit(1); }
const Q = 0.97, pad = (s, k) => String(s).padEnd(k), gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);

// Ein Tag zu zweit mit verschiedenen Aufstellungen; hpShare = Anteil vernichteter Leben beider Wellen am Tagesende
function paarTag(sA, sB, d, f){
  const w = { type:d, players:2 };
  const a = C.runWave(sA, w, f), b = C.runWave(sB, w, f), hpIn = a.hpIn + b.hpIn;
  const a2 = a.out.length ? C.runWave(sB, { ...w, incoming:a.out, dark:true, hpIn:a.hpIn }, 1) : null;
  const b2 = b.out.length ? C.runWave(sA, { ...w, incoming:b.out, dark:true, hpIn:b.hpIn }, 1) : null;
  const rest = [a2, b2].filter(Boolean).reduce((x, r) => x + r.out.reduce((y, m) => y + m.hp, 0), 0);
  const lives = G.MONSTERS[d].lives || 1;
  return { hpShare:1 - rest / hpIn, durch:((a2 ? a2.leaked : 0) + (b2 ? b2.leaked : 0)) * lives,
    ersterA:a.kills, ersterB:b.kills };
}
function paarReserve(sA, sB, d){
  const ok = f => paarTag(sA, sB, d, f).hpShare >= Q;
  let lo = 0.02, hi = 50; if (!ok(lo)) return lo; if (ok(hi)) return hi;
  for (let i = 0; i < 16 && hi / lo > 1.01; i++) { const m = Math.sqrt(lo * hi); if (ok(m)) lo = m; else hi = m; }
  return lo;
}

const paare = []; for (let i = 0; i < namen.length; i++) for (let j = i + 1; j < namen.length; j++) paare.push([namen[i], namen[j]]);
const nT = daten.erg[namen[0]][0].tage.length, maps = daten.erg[namen[0]].map(m => [m.lane, m.seed]);
const R = {}, D = {};   // R[paar][tag] (geom. Mittel über Maps), D = Durchbrüche (Summe über Maps)
for (const [a, b] of paare) { const k = a + '+' + b; R[k] = []; D[k] = []; }
maps.forEach(([lane, seed], mi) => {
  C.useMap(lane, seed);
  for (let d = 0; d < nT; d++) for (const [a, b] of paare) {
    const k = a + '+' + b, sA = { el:namen.indexOf(a), ...daten.erg[a][mi].tage[d].setup }, sB = { el:namen.indexOf(b), ...daten.erg[b][mi].tage[d].setup };
    (R[k][d] = R[k][d] || []).push(paarReserve(sA, sB, d));
    D[k][d] = (D[k][d] || 0) + paarTag(sA, sB, d, 1).durch;
    if (process.env.LAUT) console.error(`Map ${lane} Tag ${d + 1} ${k}`);
  }
});
const solo = x => d => gm(daten.erg[x].map(m => m.tage[d].R));
console.log(`Gemischte Paare · Version ${daten.version} · Spiegel ${Object.keys(daten.spiegel || {}).length ? 'an' : 'aus'} · Maps ${maps.map(m => m.join(':')).join(', ')}`);
console.log('R = Paar-Reserve (1 = gerade geschafft), in Klammern Durchbrüche bei Faktor 1 (Summe beider Maps). Solo = beide Spieler gleiches Element (P2).\n');
console.log(pad('Tag', 4) + pad('Monster', 22) + paare.map(([a, b]) => pad(a.slice(0, 3) + '+' + b.slice(0, 3), 12)).join('') + 'Solo ' + namen.map(x => x.slice(0, 3)).join('/'));
for (let d = 0; d < nT; d++) {
  const zeile = paare.map(([a, b]) => { const k = a + '+' + b, r = gm(R[k][d]); return pad(r.toFixed(2) + (D[k][d] ? ` (${D[k][d]})` : '') + (r < 1 ? '!' : ''), 12); }).join('');
  console.log(pad(d + 1, 4) + pad(G.MONSTERS[d].name.slice(0, 21), 22) + zeile + namen.map(x => solo(x)(d).toFixed(2)).join('/'));
}
// Ringregel: Tage, an denen ein Element solo nicht schafft (R < 1) – schafft es das Paar?
console.log('\nRingregel: Solo-Tage mit R < 1 und ob der Partner auffängt (Paar-R ≥ 1):');
for (const x of namen) {
  const tage = [...Array(nT).keys()].filter(d => solo(x)(d) < 1);
  if (!tage.length) { console.log(`  ${pad(x, 9)} keine`); continue; }
  console.log(`  ${pad(x, 9)} ` + tage.map(d => { const p = paare.filter(q => q.includes(x)).map(([a, b]) => { const o = a === x ? b : a; return `${o.slice(0, 3)} ${gm(R[a + '+' + b][d]).toFixed(2)}`; });
    return `Tag ${d + 1} (${solo(x)(d).toFixed(2)}): ${p.join(', ')}`; }).join(' · '));
}
fs.writeFileSync(path.join(dir, 'paare.json'), JSON.stringify({ version:daten.version, paare, R, D }, null, 1));
