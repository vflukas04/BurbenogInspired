// Optimierer (L, 18.10.): geht die Prüfpunkte in zufälliger Reihenfolge immer wieder durch, bis jeder mindestens RUNDEN-mal dran war.
// Jeder Prüfpunkt hat feste Stellschrauben (tools/balance/pruef.js). Ein Vorschlag wird mit einem vollen P2-Lauf geprüft und nur übernommen,
// wenn der Gesamtfehler sinkt. Bei Strukturänderungen (Upgrades, Turmkraft) wird vor dem Verwerfen einmal die Kurve nachgeführt.
// Alles im Spiegel: index.html bleibt unverändert. Zwischenstand nach jedem Schritt (ergebnisse/opt-stand.json), Neustart rechnet dort weiter.
//   node tools/balance/optimierer.js              → läuft (Dauer: je Schritt ein P2-Lauf, mit 1 Map ca. 20 min)
//   OPT_MAPS=0:11,2:23 RUNDEN=2 SEED=7 PAR=2      → Maps, Durchgänge je Prüfpunkt, Zufallsreihenfolge, parallele Prozesse
//   node tools/balance/optimierer.js bericht       → nur den letzten Stand anzeigen
const fs = require('fs'), path = require('path'), cp = require('child_process');
const G = require('./sim').load(), S = require('./spiegel'), P = require('./pruef');
const OUT = path.join(__dirname, 'ergebnisse'), STAND = path.join(OUT, 'opt-stand.json'), KAND = path.join(OUT, 'opt-kandidat.json');
const MAPS = process.env.OPT_MAPS || '0:11', RUNDEN = +process.env.RUNDEN || 2, PAR = +process.env.PAR || 2;
// P8 nur mit 0,25: Im ersten Lauf (18.10.) hat P8 den Gesamtfehler beherrscht und einen Schritt durchgewinkt, der P6 verschlechterte
const PUNKTE = ['P2', 'P6', 'P6B', 'P8a', 'P8'], GEWICHT = { P2:1, P6:2, P6B:1, P8a:1, P8:0.25 };
const STRUKTUR = new Set(['P6B', 'P8a', 'P8']);   // ändern das Gefüge → vor dem Verwerfen Kurve und Elementkraft nachführen
fs.mkdirSync(OUT, { recursive:true });

let seed = +process.env.SEED || 7; const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const mischen = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const log = t => { const z = `${new Date().toISOString().slice(11, 16)} ${t}`; console.log(z); fs.appendFileSync(path.join(OUT, 'opt-log.txt'), z + '\n'); };

// Ein voller P2-Lauf mit dem Kandidaten-Spiegel (je Element ein Prozess)
async function p2(sp){
  fs.writeFileSync(KAND, JSON.stringify(sp, null, 1));
  const q = [0, 1, 2, 3], env = { ...process.env, SPIEGEL:KAND, NUR_JSON:'1', WEITER:'' };
  const eins = e => new Promise(r => cp.spawn(process.execPath, [path.join(__dirname, 'p2.js'), String(e), '0', MAPS], { stdio:['ignore', 'ignore', 'inherit'], env }).on('exit', r));
  await Promise.all([...Array(PAR)].map(async () => { while (q.length) await eins(q.shift()); }));
  const erg = {}; for (let e = 0; e < 4; e++) Object.assign(erg, JSON.parse(fs.readFileSync(path.join(OUT, `p2-${e}.json`))).erg);
  return erg;
}
const mitSp = (sp, fn) => S.mit(G, Object.fromEntries(Object.entries(sp).filter(([k]) => !k.startsWith('_'))), fn);
function bewerten(sp, erg){
  return mitSp(sp, () => { const r = {}; for (const k of [...PUNKTE, 'P10']) r[k] = P[k](G, sp, erg);
    const E = PUNKTE.reduce((a, k) => a + GEWICHT[k] * r[k].err * r[k].err, 0); return { E, r }; });
}
const kurz = b => PUNKTE.map(k => `${k} ${b.r[k].err.toFixed(3)}`).join(' · ') + ` → gesamt ${b.E.toFixed(4)}`;
const vorschlag = (k, sp, erg) => mitSp(sp, () => P[k](G, sp, erg).vor);

async function main(){
  let st = fs.existsSync(STAND) ? JSON.parse(fs.readFileSync(STAND)) : null;
  if (process.argv[2] === 'bericht') { if (!st) return console.log('Noch kein Stand.'); const b = bewerten(st.sp, st.erg);
    console.log(kurz(b)); for (const k of [...PUNKTE, 'P10']) console.log(`\n${k}: ${b.r[k].text}`); return; }
  if (!st) { const sp = S.lesen(); log(`Start mit spiegel.json (${Object.keys(sp).length} Werte), Maps ${MAPS}`);
    const erg = await p2(sp); st = { sp, erg, zaehler:Object.fromEntries(PUNKTE.map(k => [k, 0])), seed, plan:[], verlauf:[] };
    const b = bewerten(sp, erg); st.E = b.E; log('Ausgang: ' + kurz(b)); fs.writeFileSync(STAND, JSON.stringify(st)); }
  seed = st.seed;
  while (Math.min(...Object.values(st.zaehler)) < RUNDEN) {
    if (!st.plan.length) st.plan = mischen(PUNKTE);   // neue Runde: alle Prüfpunkte in zufälliger Reihenfolge
    const k = st.plan.shift(), vor = vorschlag(k, st.sp, st.erg);
    st.zaehler[k]++;
    if (!Object.keys(vor).length) { log(`${k}: im Ziel, nichts zu ändern`); st.seed = seed; fs.writeFileSync(STAND, JSON.stringify(st)); continue; }
    let cand = { ...st.sp, ...vor }, erg = await p2(cand), b = bewerten(cand, erg);
    log(`${k}: ${Object.keys(vor).length} Werte geändert → ${kurz(b)}`);
    if (b.E >= st.E && STRUKTUR.has(k)) {   // Nachführen: Kurve und Elementkraft an den neuen Stand anpassen, dann erneut prüfen
      const cand2 = { ...cand, ...vorschlag('P2', cand, erg), ...vorschlag('P6', cand, erg) }, erg2 = await p2(cand2), b2 = bewerten(cand2, erg2);
      log(`${k} + Kurve/Elemente nachgeführt → ${kurz(b2)}`);
      if (b2.E < b.E) { cand = cand2; erg = erg2; b = b2; }
    }
    const ok = b.E < st.E;
    st.verlauf.push({ k, ok, E:+b.E.toFixed(5), vor, sp:cand });   // sp: vollständiger Kandidat (mit Nachführen), damit jeder Zwischenstand wiederherstellbar ist
    if (ok) { st.sp = { ...cand, _stand:`Optimierer ${new Date().toISOString().slice(0, 16)}, Gesamtfehler ${b.E.toFixed(4)}` }; st.erg = erg; st.E = b.E; log(`${k}: übernommen`); }
    else log(`${k}: verworfen (Gesamtfehler ${b.E.toFixed(4)} ≥ ${st.E.toFixed(4)})`);
    st.seed = seed; fs.writeFileSync(STAND, JSON.stringify(st));
  }
  S.speichern(st.sp); log(`Fertig: jeder Prüfpunkt ${RUNDEN}× dran. Bester Stand in spiegel.json (nur Skript, nicht im Spiel).`);
  const b = bewerten(st.sp, st.erg); for (const k of [...PUNKTE, 'P10']) log(`${k}: ${b.r[k].text}`);
}
main();
