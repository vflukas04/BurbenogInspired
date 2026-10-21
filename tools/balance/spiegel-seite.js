// Spielbare Seite des Spiegel-Stands (20.10., L): eingefrorene Basis + spiegel.json → spiegel.html im Repo-Wurzelordner.
// Live unter https://vflukas04.github.io/BurbenogInspired/spiegel.html – eigenes Online-Spiel (GAME_ID "spiegel1"),
// stört das normale Spiel (index.html, "spiel1") nicht. Archiv landet unter games/spiegel1/archiv.
// Spielzahlen kommen nur aus Basis + Spiegel. Einziger Code-Eingriff: Archiv-Fix 18g (F), damit Testspiele auswertbar sind.
// Aufruf: node tools/balance/spiegel-seite.js   (nach jeder Änderung an spiegel.json neu erzeugen und pushen)
//         SPIEGEL=tools/balance/spiegel-A.json ZIEL=spiegel-a.html SPIEL=spiegel2 node tools/balance/spiegel-seite.js   (Kandidat als eigene Seite)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const S = require('./spiegel'), { datei } = require('./sim');
const sp = S.lesen(), basis = sp._basis;
if (!basis) throw new Error('spiegel.json ohne _basis');
let html = require('./basis/patch')(fs.readFileSync(datei(), 'utf8'));   // Code-Änderungen des Spiegels (basis/patch.js)
const werte = Object.fromEntries(Object.entries(sp).filter(([k]) => !k.startsWith('_')));
const kenn = crypto.createHash('md5').update(JSON.stringify(werte)).digest('hex').slice(0, 6);

function ersetze(alt, neu){ if (!html.includes(alt)) throw new Error('nicht gefunden: ' + alt.slice(0, 60)); html = html.replace(alt, neu); }
// 1) eigenes Spiel, eigene Version
const SPIEL = process.env.SPIEL || 'spiegel1';
html = html.replace(/const GAME_ID = "[^"]*";/, `const GAME_ID = "${SPIEL}";`);
html = html.replace(/const VERSION = "([^"]*)";/, (m, v) => `const VERSION = "${v}-S${kenn}";`);
html = html.replace(/<title>([^<]*)<\/title>/, '<title>$1 · Spiegel-Test</title>');
// 2) Spiegel-Werte direkt nach den Monsterdaten anwenden (vor allem, was daraus berechnet wird)
const m = html.match(/\nconst MONSTERS = \[[\s\S]*?\n\];\n/); if (!m) throw new Error('MONSTERS-Block nicht gefunden');
const anwenden = `
/* SPIEGEL (L, Makrobalancing): Werte aus tools/balance/spiegel.json, Basis ${basis}, Stand ${sp._stand || '?'} – erzeugt von tools/balance/spiegel-seite.js, nicht von Hand ändern */
(function(){ const SP = ${JSON.stringify(werte)};
  const W = { CONFIG, ELEMENTS, MONSTERS, RESEARCH };
  for (const [p, v] of Object.entries(SP)) { const t = p.split('.'); let o = W[t[0]];
    for (let i = 1; i < t.length - 1; i++) { let k = t[i]; if (Array.isArray(o) && isNaN(+k)) k = o.findIndex(x => x && x.name === k); o = o[k]; }
    o[t[t.length - 1]] = v; } })();
`;
html = html.replace(m[0], m[0] + anwenden);
// 3) Archiv-Fix 18g (F): leere days/slots nicht schreiben (Firestore löschte sonst frühere Tage)
ersetze(`const archDoc = (g, arch) => JSON.parse(JSON.stringify({ cfg:g.cfg, version:VERSION, updated:Date.now(), day:g.day, slot:g.slot, over:g.over || null,
  gaveUp:!!g.gaveUp, passed:g.passed, earned:g.earned, kills:g.kills, ...arch }));`,
`const archDoc = (g, arch) => { const a = { ...arch }; ['days', 'slots'].forEach(k => { if (a[k] && !Object.keys(a[k]).length) delete a[k]; });
  return JSON.parse(JSON.stringify({ cfg:g.cfg, version:VERSION, updated:Date.now(), day:g.day, slot:g.slot, over:g.over || null,
    gaveUp:!!g.gaveUp, passed:g.passed, earned:g.earned, kills:g.kills, ...a })); };`);
// 3b) eigene Browser-Speicher-Schlüssel (Platz, gesehene Welle, lokales Spiel), damit das normale Spiel nicht durcheinanderkommt
html = html.replace(/'ww2-(?!holder)/g, `'ww2${SPIEL === 'spiegel1' ? 's' : SPIEL.slice(-1)}-`);
// 4) sichtbarer Hinweis, damit niemand die Seiten verwechselt
ersetze('<body>', '<body><div style="position:fixed;left:0;right:0;bottom:0;z-index:99;background:#7a3cff;color:#fff;font:12px sans-serif;text-align:center;padding:2px;pointer-events:none">Spiegel-Test (Makrobalancing L) · eigenes Spiel ' + SPIEL + '</div>');

const ziel = path.join(__dirname, '..', '..', process.env.ZIEL || 'spiegel.html');
fs.writeFileSync(ziel, html);
// Prüfen: Seite lädt in der Simulation, Werte sind angekommen
const G = require('./sim').load(ziel), bad = Object.entries(werte).filter(([p, v]) => {
  let o = G; for (let k of p.split('.')) { if (Array.isArray(o) && isNaN(+k)) k = o.findIndex(x => x && x.name === k); o = o[k]; } return JSON.stringify(o) !== JSON.stringify(v); });
console.log(`${path.basename(ziel)} erzeugt: Version ${G.VERSION}, ${Object.keys(werte).length} Spiegel-Werte, ${bad.length ? 'FEHLT: ' + bad.map(b => b[0]).join(', ') : 'alle angekommen'}`);
