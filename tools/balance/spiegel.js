// Spiegel-Prinzip (team/BALANCING.md): Änderungsvorschläge werden nur im Speicher an der geladenen Simulation getestet,
// nie in index.html geschrieben. Die Änderungen stehen in tools/balance/spiegel.json als { "Pfad": Wert }.
//   Pfade: "CONFIG.hpExp", "MONSTERS.3.hpMul", "MONSTERS.3.weak.1", "ELEMENTS.0.towers.2.5" (Index im Turm-Array)
//   Monster dürfen auch per Name angesprochen werden: "MONSTERS.Mäuse.hpMul"
// Aufruf: anwenden(G) einmal nach dem Laden; SPIEGEL=pfad/zur/datei.json nimmt eine andere Datei, SPIEGEL=aus lässt ihn weg.
const fs = require('fs'), path = require('path');
const DATEI = path.join(__dirname, 'spiegel.json');

function lesen(file){
  const f = file || process.env.SPIEGEL || DATEI;
  if (f === 'aus' || !fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}
function ziel(G, p){
  const teile = p.split('.'); let o = G[teile[0]];
  for (let i = 1; i < teile.length - 1; i++) {
    let k = teile[i];
    if (Array.isArray(o) && isNaN(+k)) { const j = o.findIndex(x => x && x.name === k); if (j < 0) throw new Error('Spiegel: unbekannt ' + p); k = j; }
    o = o[k]; if (o === undefined) throw new Error('Spiegel: unbekannt ' + p);
  }
  return [o, teile[teile.length - 1]];
}
// Wendet alle Einträge an und gibt die alten Werte zurück (für die Tabelle alt → neu)
function anwenden(G, aenderungen){
  const a = aenderungen || lesen(), alt = {};
  for (const [p, v] of Object.entries(a)) { if (p.startsWith('_')) continue; const [o, k] = ziel(G, p); alt[p] = o[k]; o[k] = v; }
  return alt;
}
// Vorübergehend ändern (für Suchen): setzt, ruft fn, setzt zurück
function mit(G, aenderungen, fn){ const alt = anwenden(G, aenderungen); try { return fn(); } finally { anwenden(G, alt); } }
function speichern(a, file){ fs.writeFileSync(file || DATEI, JSON.stringify(a, null, 2) + '\n'); }
module.exports = { lesen, anwenden, mit, speichern, DATEI };
