// Abstand Spiegel ↔ Spiel (Makrobalancing L im Spiegel, Mikrobalancing F im Spiel, Beschluss 18.10.).
// Zeigt, wie weit beide Stände auseinanderlaufen, ohne etwas zu ändern:
//   A) Werte im Spiegel: Basis (Spielstand, auf dem der Spiegel aufsetzt) | Spiel jetzt | Spiegel.
//      „⚠“ = seit der Basis im Spiel geändert → der Spiegel überschreibt diese Änderung von F.
//   B) Seit der Basis im Spiel geänderte Werte, die der Spiegel nicht enthält (wirken in Spiegel-Läufen mit).
//   C) Kurzfazit.
// Aufruf: node tools/balance/abstand.js [basis-commit]   (sonst "_basis" aus spiegel.json)
//         node tools/balance/abstand.js kurz              (nur Fazit, für den Start jeder Sitzung)
const fs = require('fs'), path = require('path'), os = require('os'), { execSync } = require('child_process');
const { load } = require('./sim'), S = require('./spiegel');

const ROOT = path.join(__dirname, '..', '..');
const DATEN = ['CONFIG', 'ELEMENTS', 'MONSTERS', 'RESEARCH', 'RESEARCH_GROUPS', 'TOWER_COST', 'TOWER_POWER', 'TERRAIN', 'GEMS', 'ABILITIES', 'BASICS'];
const arg = process.argv[2], KURZ = arg === 'kurz';
const sp = S.lesen(), BASIS = (!KURZ && arg) || sp._basis;
if (!BASIS) { console.log('Keine Basis: "_basis" (Commit) in spiegel.json eintragen oder als Argument angeben.'); process.exit(1); }

const jetzt = load(path.join(ROOT, 'index.html'));
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'abstand-')), 'index.html');
fs.writeFileSync(tmp, execSync(`git -C "${ROOT}" show ${BASIS}:index.html`, { maxBuffer:1 << 26 }));
const basis = load(tmp);

// Wert an einem Spiegel-Pfad lesen (Monster auch per Name, wie in spiegel.js)
function lies(G, p){
  let o = G; for (let k of p.split('.')) {
    if (o == null) return undefined;
    if (Array.isArray(o) && isNaN(+k)) { const j = o.findIndex(x => x && x.name === k); if (j < 0) return undefined; k = j; }
    o = o[k];
  }
  return o;
}
// Alle Blätter eines Datenblocks als { Pfad: Wert }; Monster per Name statt Index (Einfügen verschiebt sonst alles)
function blaetter(o, p, aus){
  if (typeof o === 'function') return aus;
  if (o === null || typeof o !== 'object') { aus[p] = o; return aus; }
  if (Array.isArray(o)) o.forEach((x, i) => blaetter(x, p + '.' + (p === 'MONSTERS' && x && x.name ? x.name : i), aus));
  else for (const k of Object.keys(o)) blaetter(o[k], p + '.' + k, aus);
  return aus;
}
const flach = G => Object.assign({}, ...DATEN.filter(n => G[n] !== undefined).map(n => blaetter(G[n], n, {})));
const fmt = v => v === undefined ? '–' : typeof v === 'number' ? String(+v.toFixed(3)).replace('.', ',') : JSON.stringify(v);
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rel = (a, b) => typeof a === 'number' && typeof b === 'number' && a ? Math.abs(b / a - 1) : null;

// A) Spiegel-Werte
const zeilenA = [], konflikt = [];
const abstaende = [];
for (const [p, v] of Object.entries(sp)) {
  if (p.startsWith('_')) continue;
  const b = lies(basis, p), j = lies(jetzt, p), f = !gleich(b, j);
  if (f) konflikt.push(p);
  const r = rel(j, v); if (r !== null) abstaende.push(r);
  zeilenA.push(`| ${p} | ${fmt(b)} | ${fmt(j)}${f ? ' ⚠' : ''} | ${fmt(v)} |`);
}
// B) Spieländerungen seit der Basis außerhalb des Spiegels
const fb = flach(basis), fj = flach(jetzt), imSpiegel = new Set(Object.keys(sp));
const geaendert = [...new Set([...Object.keys(fb), ...Object.keys(fj)])].filter(p => !gleich(fb[p], fj[p]) && !imSpiegel.has(p) && !(fb[p] === undefined && fj[p] === 1));   // neu angelegt und neutral = keine Änderung
// nach Bereich bündeln (z. B. alle Faktoren eines Monsters in eine Zeile)
const gruppen = {};
for (const p of geaendert) { const k = p.split('.').slice(0, p.startsWith('MONSTERS') ? 2 : 3).join('.'); (gruppen[k] = gruppen[k] || []).push(p); }

// Wechselwirkung: Spiegel und F drehen am selben Element mit verschiedenen Stellschrauben (z. B. Spiegel kraftT, F kraftBlock)
const NAMEN = jetzt.ELEMENTS.map(e => e.name || e.key || '?');
const elSp = new Set(Object.keys(sp).map(p => p.match(/^ELEMENTS\.(\d)\./)).filter(Boolean).map(m => +m[1]));
const elF = new Set(geaendert.map(p => p.match(/^ELEMENTS\.(\d)\./)).filter(Boolean).map(m => +m[1]));
const monF = Object.keys(gruppen).filter(k => k.startsWith('MONSTERS.'));
const wechsel = [...elSp].filter(e => elF.has(e)).map(e => NAMEN[e]);

const vB = basis.VERSION, vJ = jetzt.VERSION;
const mittel = abstaende.length ? abstaende.reduce((a, b) => a + b, 0) / abstaende.length : 0;
const fazit = [
  `Spiegel (${Object.keys(sp).filter(k => !k.startsWith('_')).length} Werte) setzt auf ${BASIS} (${vB}) auf, Spiel ist bei ${vJ}.`,
  `Spiegel weicht im Mittel ${(mittel * 100).toFixed(0)} % vom Spiel ab (bei seinen eigenen Werten).`,
  konflikt.length ? `⚠ ${konflikt.length} Spiegel-Werte hat F seit der Basis im Spiel geändert (Spiegel überschreibt sie): ${konflikt.join(', ')}`
                  : 'Keine Überschneidung: F hat keinen der Spiegel-Werte geändert.',
  wechsel.length ? `Wechselwirkung: Spiegel und Spiel drehen bei ${wechsel.join(', ')} an verschiedenen Stellschrauben desselben Elements – Wirkung multipliziert sich, Ergebnisse nur gemeinsam deuten.` : '',
  monF.length ? `F hat ${monF.length} Monster geändert (${monF.map(k => k.slice(9)).join(', ')}).` : '',
  `${geaendert.length} weitere Spielwerte in ${Object.keys(gruppen).length} Bereichen seit der Basis geändert (wirken in Spiegel-Läufen mit).`
];
const fz = fazit.filter(Boolean);
if (KURZ) { console.log(fz.join('\n')); process.exit(0); }

console.log(`# Abstand Spiegel ↔ Spiel\n\n${fz.map(z => '- ' + z).join('\n')}\n`);
console.log('## A) Werte im Spiegel\n| Pfad | Basis | Spiel jetzt | Spiegel |\n| --- | --- | --- | --- |\n' + zeilenA.join('\n'));
console.log('\n## B) Im Spiel seit der Basis geändert, nicht im Spiegel');
for (const [k, ps] of Object.entries(gruppen)) {
  const teil = ps.slice(0, 6).map(p => `${p.slice(k.length + 1) || p}: ${fmt(fb[p])} → ${fmt(fj[p])}`).join(' · ');
  console.log(`- ${k}: ${teil}${ps.length > 6 ? ` · … (+${ps.length - 6})` : ''}`);
}
