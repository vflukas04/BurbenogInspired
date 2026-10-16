// Vorwärtspfad (P2/P3, Stand 16.10.): ein ganzes Spiel je Element, Tag für Tag.
// Jeden Tag wird mit dem vorhandenen Gold gierig weitergebaut (kein Verkaufen, kein Verschieben), dann gemessen:
//   R = glatte Reserve gegen die Welle des Tages (1,25 = hätte 25 % mehr Leben/Rüstung verkraftet), Kills bei Faktor 1.
// Annahmen (vereinfacht, siehe team/BALANCING.md):
//   – 2 Spieler mit demselben Element, jeder auf der Testkarte; nur die frische 10-Uhr-Welle, keine Leaks vom Nachbarn, kein Wetter, keine Dunkelheit
//   – Einkommen = volles Kopfgeld (Annahme „alle Monster getötet“, sonst Todesspirale ohne Partner; ECHT=1: nur eigene Kills); Anteil KASSE geht in die Gemeinschaftskasse (beide Spieler zahlen ein)
//   – Forschung in fester Reihenfolge, sobald die Kasse reicht; Edelsteine noch nicht berücksichtigt
// Aufruf: node tools/balance/pfad.js [Element 0–3 | alle] [bisTag]
const fs = require('fs'), path = require('path');
const C = require('./core'), B = require('./build'), { G } = C;
const KASSE = 0.25, SPIELER = 2;
const FORSCHUNG = e => ['gold:1', `el${e}:1`, 't5:1', `el${e}:2`, 'rng:1', 'cheap:1', 'gold:2', `el${e}:3`, 'dur:1', 't7:1', 'rng:2', 'cheap:2', 'dur:2', 'gold:3', 'rng:3', 'cheap:3', 'dur:3'];

function spiel(e, bisTag){
  let setup = { el:e, towers:[], res:[] }, gold = G.CONFIG.startGold, kasse = 0, durch = 0;
  const tage = [], n = Math.min(bisTag || G.MONSTERS.length, G.MONSTERS.length);
  for (let d = 0; d < n; d++) {
    const M = G.MONSTERS[d], w = { type:d, players:SPIELER, tag:true };
    // Forschung kaufen
    for (const id of FORSCHUNG(e)) { if (setup.res.includes(id)) continue; const R = G.RESEARCH.find(x => x.id === id);
      if (R.need && !setup.res.includes(R.need)) break;
      if (kasse < R.cost) break; kasse -= R.cost; setup = { ...setup, res:[...setup.res, id] }; }
    // Vorausschau: Die Monster der nächsten Tage sind im Spiel einsehbar, gebaut wird für heute und die zwei folgenden Tage
    const morgen = [d + 1, d + 2].filter(x => x < G.MONSTERS.length).map((x, i) => ({ type:x, players:SPIELER, tag:true, wt:i ? 0.25 : 0.5 }));
    // Sparen erlaubt bis zum Einkommen der nächsten zwei Tage (z. B. für den ersten Turm gegen Fliegende)
    const spar = morgen.reduce((a, x) => a + G.monsterDef(x.type, SPIELER).bounty * (G.MONSTERS[x.type].count || G.CONFIG.perWave) * (1 - KASSE), 0);
    const g = B.greedy(e, gold + B.spent(setup), [w, ...morgen], { cells:3, spar }, setup);
    setup = g.setup; gold = g.left;
    const R = C.reserveDay(setup, w), r1 = C.runDay(setup, w, 1); durch += r1.durch;
    const verdient = Math.round(G.monsterDef(d, SPIELER).bounty * (process.env.ECHT ? r1.kills : r1.n) * (1 + G.resVal(new Set(setup.res), 'gold')));
    gold += Math.round(verdient * (1 - KASSE)); kasse += Math.round(verdient * KASSE) * SPIELER;
    tage.push({ tag:d + 1, monster:M.name, R:+R.toFixed(3), kills:r1.kills, n:r1.n, durch:r1.durch, summe:durch, gold, kasse, wert:B.spent(setup), tuerme:setup.towers.length,
      stufen:setup.towers.map(t => (t.idx + 1) + '.' + (t.lvl || 1)).sort().join(' '), forschung:setup.res.length });
    if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} Tag ${d + 1} R ${R.toFixed(2)} Kills ${r1.kills}/${r1.n} durch ${r1.durch} (Σ ${durch}) Wert ${B.spent(setup)}`);
  }
  return tage;
}

if (require.main === module) {
  const arg = process.argv[2] || 'alle', bis = +process.argv[3] || 0;
  const out = path.join(__dirname, 'ergebnisse'); fs.mkdirSync(out, { recursive:true });
  let erg = {};
  if (arg === 'alle') {   // vier Elemente parallel in eigenen Prozessen
    const cp = require('child_process');
    const kids = [0, 1, 2, 3].map(e => cp.spawn(process.execPath, [__filename, String(e), String(bis)], { stdio:['ignore', 'ignore', 'inherit'], env:{ ...process.env, NUR_JSON:'1' } }));
    // (setInterval ist im Skript stillgelegt, siehe sim.js → auf das Ende der Prozesse warten)
    return Promise.all(kids.map(k => new Promise(r => k.on('exit', r)))).then(() => { for (let e = 0; e < 4; e++) Object.assign(erg, JSON.parse(fs.readFileSync(path.join(out, `pfad-${e}.json`))).erg); ausgabe(erg); });
  }
  erg[G.ELEMENTS[+arg].name] = spiel(+arg, bis);
  fs.writeFileSync(path.join(out, `pfad-${arg}.json`), JSON.stringify({ version:G.VERSION, spiegel:C.SPIEGEL, erg }, null, 1));
  if (!process.env.NUR_JSON) ausgabe(erg);
}
function ausgabe(erg){
  // Tabelle: R je Element und Tag, geometrisches Mittel
  const namen = Object.keys(erg), pad = (s, k) => String(s).padEnd(k);
  console.log(`Vorwärtspfad · Version ${G.VERSION} · 2 Spieler · R = glatte Reserve (1 = gerade geschafft), Kills bei Faktor 1\n`);
  console.log(pad('Tag', 4) + pad('Monster', 19) + namen.map(x => pad(x, 15)).join('') + 'Mittel');
  for (let i = 0; i < erg[namen[0]].length; i++) {
    const rs = namen.map(x => erg[x][i]), gm = Math.exp(rs.reduce((a, t) => a + Math.log(t.R), 0) / rs.length);
    console.log(pad(rs[0].tag, 4) + pad(rs[0].monster, 19) + rs.map(t => pad(`${t.R.toFixed(2)}${t.kills < t.n ? ` (${t.kills}/${t.n})` : ''}`, 15)).join('') + gm.toFixed(2));
  }
  console.log('\nDurchbrüche gesamt bei Faktor 1 (verloren ab 31): ' + namen.map(x => `${x} ${erg[x][erg[x].length - 1].summe}`).join(' · '));
  console.log('Turmwert am Ende: ' + namen.map(x => `${x} ${erg[x][erg[x].length - 1].wert}`).join(' · '));
  if (namen.length < 2) return;
  // Vorschläge (nur Richtwerte, nichts wird geändert): Element-Kraft und Kurve
  const gmE = x => Math.exp(erg[x].reduce((a, t) => a + Math.log(t.R), 0) / erg[x].length);
  const alle = Math.exp(namen.reduce((a, x) => a + Math.log(gmE(x)), 0) / namen.length);
  console.log('\nElement-Kraft (Mittel aller Tage, 1 = Durchschnitt; Vorschlag = Kraftfaktor, der auf den Durchschnitt brächte):');
  for (const x of namen) console.log(`  ${pad(x, 10)} ${(gmE(x) / alle).toFixed(2)}  → Kraft ×${(alle / gmE(x)).toFixed(2)}`);
  const ZIEL = +process.env.ZIEL || 1.2;
  console.log(`\nKurve: Leben je Tag ×(Mittel / ${ZIEL}) brächte das Mittel auf den Zielkorridor „Normal“ (${ZIEL}). Blöcke:`);
  const tage = erg[namen[0]].length;
  for (let a = 0; a < tage; a += 6) { const b = Math.min(tage, a + 6);
    let s = 0, k = 0; for (const x of namen) for (let i = a; i < b; i++) { s += Math.log(erg[x][i].R); k++; }
    console.log(`  Tag ${a + 1}–${b}: Mittel ${Math.exp(s / k).toFixed(2)} → Leben ×${(Math.exp(s / k) / ZIEL).toFixed(2)}`); }
}
module.exports = { spiel };
