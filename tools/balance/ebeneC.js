// Ebene B+C (L, 22.10.): aus einem fertigen P2-Lauf mit Paaren (paare.json) einen Schritt ableiten:
//   B) Kraft je Element auf das Mittel der Elemente (wie ebeneB.js, gedämpft)
//   C) Leben je Tag (hpMul des Monsters) so, dass das SCHWÄCHSTE der 6 Paare den Tag gerade mit Reserve ZIEL schafft
//      (C2, L 20.10.: jedes Paar schafft jeden Tag, höchstens ~1 Durchbruch je Tag). Normale Tage werden dadurch schwerer,
//      Problemtage (Fliegende, Bosse) leichter – statt die ganze Kurve je Block zu verschieben.
// Annahme: Paar-R wächst etwa mit √(Kraft A × Kraft B) und fällt mit den Leben. Danach mit neuem P2-Lauf bestätigen.
// Aufruf: SPIEGEL=<Eingang.json> node tools/balance/ebeneC.js <Ordner unter ergebnisse/> <Ausgang.json> [Dämpfung 0,7] [ZIEL 1,15]
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C, S = require('./spiegel');
const [ordner, aus, dmp, zl] = process.argv.slice(2), D = +dmp || 0.7, ZIEL = +zl || 1.15;
const dir = path.join(__dirname, 'ergebnisse', ordner);
const daten = JSON.parse(fs.readFileSync(path.join(dir, 'p2-alle.json'), 'utf8')), P = JSON.parse(fs.readFileSync(path.join(dir, 'paare.json'), 'utf8'));
const gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
const ZS = 2.0, ZE = 1.4, ziel = r => ZE + (ZS - ZE) * Math.sin(Math.PI * Math.min(1, Math.max(0, (r - 1) / 39)));
const namen = Object.keys(daten.erg), nT = daten.erg[namen[0]][0].tage.length;
const sp = { ...C.SPIEGEL }, alt = {};
// B: Kraft je Element
const Q = namen.map(x => gm([...Array(nT)].map((_, d) => gm(daten.erg[x].map(m => m.tage[d].R)) / ziel(G.MONSTERS[d].round))));
const mittel = gm(Q), kf = Q.map(q => Math.pow(mittel / q, D));
namen.forEach((x, e) => { const p = `ELEMENTS.${e}.kraft`; alt[p] = G.ELEMENTS[e].kraft; sp[p] = +(G.ELEMENTS[e].kraft * kf[e]).toFixed(4); });
// C: Leben je Tag aus dem schwächsten Paar (nach der Kraft-Änderung geschätzt)
const zeilen = [];
for (let d = 0; d < nT; d++) {
  const r = Object.entries(P.R).map(([k, v]) => { const [a, b] = k.split('+').map(n => namen.indexOf(n)); return gm(v[d]) * Math.sqrt(kf[a] * kf[b]); });
  const min = Math.min(...r), f = Math.min(2, Math.max(0.5, Math.pow(min / ZIEL, D)));
  const M = G.MONSTERS[d], p = `MONSTERS.${M.name}.hpMul`, h = M.hpMul || 1;
  alt[p] = h; sp[p] = +(h * f).toFixed(4);
  zeilen.push(`  Tag ${String(d + 1).padStart(2)} ${M.name.slice(0, 22).padEnd(22)} schwächstes Paar R ${min.toFixed(2)} → Leben ×${f.toFixed(2)}`);
}
sp._stand = `Ebene B+C aus ${ordner} (Dämpfung ${D}, Ziel schwächstes Paar ${ZIEL}), ${new Date().toISOString().slice(0, 16)}`;
S.speichern(sp, path.isAbsolute(aus) ? aus : path.join(process.cwd(), aus));
console.log('Kraft je Element:'); namen.forEach((x, e) => console.log(`  ${x.padEnd(9)} ×${kf[e].toFixed(2)} → ${sp[`ELEMENTS.${e}.kraft`]}`));
console.log('Leben je Tag:'); console.log(zeilen.join('\n'));
