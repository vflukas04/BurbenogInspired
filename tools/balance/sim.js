// Lädt die Spiel-Simulation direkt aus index.html (keine Kopie, damit Skript und Spiel nie auseinanderlaufen).
// Gibt ein Objekt mit den benötigten Spielfunktionen und -daten zurück.
const fs = require('fs'), path = require('path');
const NAMES = ['fxText', 'CONFIG', 'ELEMENTS', 'MONSTERS', 'MAPS', 'GRID', 'COLS', 'ROWS', 'TERRAIN', 'TOWER_COST', 'TOWER_POWER', 'RESEARCH', 'RESEARCH_GROUPS',
  'LOCKS', 'ABILITIES', 'GEMS', 'towerBase', 'tdef', 'upgradeCost', 'monsterDef', 'waveSpecs', 'simulate', 'makeSim', 'step', 'simBusy', 'posAt',
  'buildCost', 'bountyFor', 'DT', 'resVal', 'VERSION', 'genTerrain', 'gemOptions', 'BASICS', 'abilityBlocked', 'waveMix', 'variantDef'];
function stubs(){
  const el = () => new Proxy({ style:{}, dataset:{}, classList:{ toggle(){}, add(){}, remove(){} }, addEventListener(){}, querySelectorAll:() => [], clientWidth:0, value:'10' },
    { get:(t, k) => k in t ? t[k] : undefined, set:(t, k, v) => (t[k] = v, true) });
  const els = {};
  Object.assign(global, {
    document:{ getElementById:id => els[id] || (els[id] = el()), querySelectorAll:() => [], documentElement:{}, fonts:null, addEventListener(){}, hidden:false },
    window:{ addEventListener(){} }, localStorage:{ getItem:() => null, setItem(){}, removeItem(){} },
    getComputedStyle:() => ({ getPropertyValue:() => '' }), performance:{ now:() => 0 }, requestAnimationFrame:() => {},
    location:{ protocol:'file:' }, setInterval:() => 0, Image:function(){ return {}; } });
}
// Welche index.html? (20.10., L) Explizit (file / INDEX=…) geht vor. Sonst: Ist der Spiegel an und hat er eine Basis ("_basis"),
// rechnet alles auf der eingefrorenen Kopie tools/balance/basis/index-<basis>.html – F's laufende Änderungen im Spiel fließen nicht ein.
// SPIEGEL=aus → aktuelles Spiel (index.html).
function datei(){
  if (process.env.INDEX) return process.env.INDEX;
  const sp = process.env.SPIEGEL || path.join(__dirname, 'spiegel.json');
  if (sp !== 'aus' && fs.existsSync(sp)) { const b = JSON.parse(fs.readFileSync(sp, 'utf8'))._basis;
    if (b) { const f = path.join(__dirname, 'basis', `index-${b}.html`); if (!fs.existsSync(f)) throw new Error('Basis fehlt: ' + f); return f; } }
  return path.join(__dirname, '..', '..', 'index.html');
}
function load(file){
  const f = file || datei();
  let html = fs.readFileSync(f, 'utf8');
  if (path.dirname(path.resolve(f)) === path.join(__dirname, 'basis')) html = require('./basis/patch')(html);   // Code-Änderungen des Spiegels
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
  stubs();
  // typeof: fehlt ein Name in einer älteren Spielversion, gibt es undefined statt eines Fehlers
  return new Function(code + '\n;return {' + NAMES.map(n => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(',') + '};')();
}
module.exports = { load, datei };
