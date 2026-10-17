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
function load(file){
  const html = fs.readFileSync(file || process.env.INDEX || path.join(__dirname, '..', '..', 'index.html'), 'utf8');
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
  stubs();
  // typeof: fehlt ein Name in einer älteren Spielversion, gibt es undefined statt eines Fehlers
  return new Function(code + '\n;return {' + NAMES.map(n => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(',') + '};')();
}
module.exports = { load };
