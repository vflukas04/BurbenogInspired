// Automatische Prüfung (2.11., F): node tools/pruefung.js
// Läuft bei jedem Push als GitHub Action (.github/workflows/pruefung.yml) und lässt sich auch lokal starten (ca. 1 Sekunde).
// Prüft nur, ob das Spiel kaputtgeht – nicht, ob es gut balanciert ist:
//   1. Das Spielskript in index.html lässt sich laden (keine Syntaxfehler, kein Absturz beim Start).
//   2. VERSION ist gesetzt.
//   3. Alle Türme, alle Stufen, alle erlaubten Edelstein-Fähigkeiten (auch auf Felsen): tdef + fxText laufen ohne Fehler, keine NaN-Werte.
//   4. Alle Monster mit 2/3/4 Spielern: monsterDef ohne Fehler, Leben und Kopfgeld sind Zahlen.
// Fehlermeldungen nennen Monster nur mit Nummer und Tag, nicht mit Namen (Runde 21–40 ist eine Überraschung für F).
// Danach startet die Action zusätzlich `node tools/balance.js zehn` (10 Testspiele, ca. 15 Sekunden) – nur auf Absturz geprüft, die Ergebnisse sind Tendenzen.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(process.env.INDEX || path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const game = scripts[scripts.length - 1];
const el = () => new Proxy({ style:{}, dataset:{}, classList:{ toggle(){} }, addEventListener(){}, querySelectorAll:() => [], clientWidth:0, oninput(){}, value:'10' },
  { get:(t,k) => k in t ? t[k] : undefined, set:(t,k,v) => (t[k] = v, true) });
const els = {};
global.document = { getElementById:id => els[id] || (els[id] = el()), querySelectorAll:() => [], documentElement:{}, fonts:null, addEventListener(){} };
global.window = { addEventListener(){} }; global.localStorage = { getItem:() => null, setItem(){}, removeItem(){} };
global.getComputedStyle = () => ({ getPropertyValue:() => '' }); global.performance = { now:() => 0 };
global.requestAnimationFrame = () => {}; global.location = { protocol:'file:' }; global.setInterval = () => {}; global.Image = function(){ return {}; };
global.__fehler = [];
try {
  eval(game + `
;(function(){
  const F = global.__fehler, bad = v => typeof v === 'number' && !isFinite(v);
  const probe = (wo, f) => { try { f(); } catch (e) { F.push(wo + ': ' + (e && e.message || e)); } };
  if (typeof VERSION !== 'string' || !VERSION) F.push('VERSION fehlt in index.html');
  ELEMENTS.forEach((E, e) => E.towers.forEach((_, k) => {
    probe(E.name + ' T' + (k + 1) + ' Grundwerte', () => { const b = towerBase(e, k); fxText(b); if (bad(b.dps) || bad(b.range)) throw new Error('NaN in Schaden/Reichweite'); });
    for (let lvl = 1; lvl <= CONFIG.maxLevel; lvl++) {
      const tw = { x:0, y:0, el:e, idx:k, lvl, invested:0 };
      probe(E.name + ' T' + (k + 1) + ' S' + lvl, () => { const d = tdef(tw); fxText(d); fxText(onRock({ ...d })); if (bad(d.dpsNow) || bad(d.range)) throw new Error('NaN in Schaden/Reichweite'); });
      for (const ab of gemOptions(e, k)) { const g = { ...tw, gem:true, ab };
        if (abilityBlocked(g, ab)) continue;
        probe(E.name + ' T' + (k + 1) + ' S' + lvl + ' Fähigkeit ' + ab, () => { const d = tdef(g); fxText(d); fxText(onRock({ ...d })); if (bad(d.dpsNow) || bad(d.range)) throw new Error('NaN in Schaden/Reichweite'); }); }
    }
  }));
  MONSTERS.forEach((M, t) => [2, 3, 4].forEach(p => probe('Monster Nr. ' + (t + 1) + ' (Tag ' + M.day + '), ' + p + ' Spieler', () => {
    const d = monsterDef(t, p); if (bad(d.hp) || !(d.hp > 0)) throw new Error('Leben ungültig: ' + d.hp); if (bad(d.bounty)) throw new Error('Kopfgeld ungültig'); })));
})();`);
} catch (e) { global.__fehler.unshift('Spielskript lässt sich nicht laden: ' + (e && e.stack || e)); }
const F = global.__fehler;
if (F.length) { console.log('PRÜFUNG FEHLGESCHLAGEN (' + F.length + ' Fehler):'); F.slice(0, 30).forEach(f => console.log(' - ' + f)); if (F.length > 30) console.log(' … und ' + (F.length - 30) + ' weitere'); process.exit(1); }
console.log('Prüfung ok: Spielskript lädt, alle Türme/Stufen/Fähigkeiten und Monster ohne Fehler.');
