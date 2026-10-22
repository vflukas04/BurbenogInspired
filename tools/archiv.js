// Archiv auslesen: node tools/archiv.js            → Übersicht aller gespeicherten Spiele
//                  node tools/archiv.js <startAt>  → ein Spiel ausführlich (Kills/Gold je Welle, Türme je Tag)
// Holt games/<GAME_ID>/archiv aus Firestore (REST, nur lesen) und legt die Rohdaten in tools/archiv-daten/ ab (nicht im Repo).
// Fehlspiele werden markiert, nicht gelöscht: aufgegeben vor Tag 5, weniger als 3 Tage gespielt, ohne Türme.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const PROJECT = 'burbenoginspired', GAME_ID = process.env.SPIEL || 'spiel1';   // SPIEL=spiegel2 für die Spiegel-Testseite
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/games/${GAME_ID}/archiv`;
const get = url => JSON.parse(execFileSync('curl', ['-s', '-m', '20', url], { encoding:'utf8', maxBuffer:64 << 20 }));
// Firestore-REST-Werte in normales JSON umwandeln
const val = v => v.mapValue ? obj(v.mapValue.fields || {}) : v.arrayValue ? (v.arrayValue.values || []).map(val)
  : 'integerValue' in v ? +v.integerValue : 'doubleValue' in v ? v.doubleValue : 'booleanValue' in v ? v.booleanValue
  : 'nullValue' in v ? null : 'stringValue' in v ? v.stringValue : v.timestampValue || null;
const obj = f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, val(v)]));
function load(){
  const out = []; let token = '';
  do { const r = get(BASE + '?pageSize=300' + (token ? '&pageToken=' + token : ''));
    (r.documents || []).forEach(d => out.push(obj(d.fields || {}))); token = r.nextPageToken || ''; } while (token);
  const dir = path.join(__dirname, 'archiv-daten'); fs.mkdirSync(dir, { recursive:true });
  out.forEach(g => fs.writeFileSync(path.join(dir, g.cfg.startAt + '.json'), JSON.stringify(g, null, 1)));
  return out.sort((a, b) => a.cfg.startAt - b.cfg.startAt);
}
const EL = ['Feuer', 'Eis', 'Schatten', 'Stein'];
const elsOf = g => { const d = g.days || {}, last = d[Object.keys(d).sort((a, b) => b - a)[0]]; return last ? last.lanes.map(l => l ? EL[l.el] : '?') : []; };
function fehl(g){
  const towers = Object.values(g.days || {}).some(d => d.lanes.some(l => l && l.towers.length));
  if (g.gaveUp && g.day < 5) return 'früh aufgegeben';
  if (g.day < 3 && g.over) return 'zu kurz';
  if (!towers) return 'ohne Türme';
  return '';
}
const games = load(), one = process.argv[2];
if (!one) {
  console.log(`${games.length} Spiele im Archiv\n`);
  for (const g of games) console.log([new Date(g.cfg.startAt).toLocaleString('de-DE'), g.cfg.players + ' Sp.', elsOf(g).join('+'), 'V ' + g.version,
    g.over ? (g.over === 'won' ? 'GEWONNEN' : 'verloren') + ' Tag ' + g.day : 'läuft (Tag ' + g.day + ')', 'durch ' + g.passed, fehl(g) ? '[' + fehl(g) + ']' : '', g.cfg.startAt].join(' · '));
} else {
  const g = games.find(x => String(x.cfg.startAt) === one); if (!g) { console.log('nicht gefunden'); process.exit(1); }
  console.log(`Spiel ${one}: ${elsOf(g).join('+')}, ${g.over || 'läuft'}, Tag ${g.day}, durch ${g.passed}\n\nWelle: Kills / Gold / weitergegeben, Durchbrüche`);
  Object.entries(g.slots || {}).sort((a, b) => { const [d1, s1] = a[0].split('-').map(Number), [d2, s2] = b[0].split('-').map(Number); return d1 - d2 || s1 - s2; })
    .forEach(([k, s]) => console.log(`${k.padEnd(5)} ${s.kills.join('/')} · ${s.earned.join('/')} · ${s.leaked.join('/')} · +${s.broke} (=${s.passed})`));
  Object.entries(g.days || {}).sort((a, b) => a[0] - b[0]).forEach(([d, x]) => console.log(`Tag ${d}: ` + x.lanes.map(l => l ? `${EL[l.el]} ${l.towers.length} Türme, ${l.towers.reduce((a, t) => a + t.inv, 0)} Gold verbaut` : '–').join(' | ')));
}
