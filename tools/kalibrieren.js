// Leben kalibrieren: node tools/kalibrieren.js
// Ziel (Lukas, 11.10.): Mit den Anfangstürmen (Startgold) schafft ein Spieler in Runde 1 ca. 12 von 20 (2 Spieler),
// 8 (3 Spieler), 6 (4 Spieler). Später: mit dem bis dahin verdienten Gold ebenfalls ca. 12 von 20 (2 Spieler).
// node tools/kalibrieren.js pruefen → Kills je Runde und Spielerzahl mit den aktuellen Werten.
// Rechnet mit einem neutralen Monster (alle Faktoren 1, Tempo 1), Mittel über alle Elemente, 2 Karten, Sonnig + Bewölkt.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const el = () => new Proxy({ style:{}, dataset:{}, classList:{ toggle(){} }, addEventListener(){}, querySelectorAll:() => [], clientWidth:0, oninput(){}, value:'10' },
  { get:(t,k) => k in t ? t[k] : undefined, set:(t,k,v) => (t[k] = v, true) });
const els = {};
global.document = { getElementById:id => els[id] || (els[id] = el()), querySelectorAll:() => [], documentElement:{}, fonts:null, addEventListener(){} };
global.window = { addEventListener(){} }; global.localStorage = { getItem:() => null, setItem(){}, removeItem(){} };
global.getComputedStyle = () => ({ getPropertyValue:() => '' }); global.performance = { now:() => 0 };
global.requestAnimationFrame = () => {}; global.setInterval = () => {}; global.location = { protocol:'file:' };
eval(scripts[scripts.length - 1] + `
;(function(){
const ROUNDS = +(process.argv[2]) || 20;
// einfacher Bauer: teuerster bezahlbarer Turm (Fliegende/Licht/Luftabwehr übersprungen) auf das Feld mit dem meisten Weg in Reichweite, danach Upgrades
function build(el, lane, gold){
  const towers = [], taken = new Set();
  const best = (k) => { const R = towerBase(el, k).range; let b = null, bs = -1;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const id = x + ',' + y; if (MAPS[lane].cells.has(id) || taken.has(id)) continue;
      let c = 0; MAPS[lane].cells.forEach(q => { const [a, bb] = q.split(',').map(Number); if (Math.hypot(a - x, bb - y) <= R) c++; });
      c -= MAPS[lane].terrain[y][x] ? 3 : 0; if (c > bs) { bs = c; b = [x, y]; } }
    return b; };
  for (let guard = 0; guard < 200; guard++) {
    let pick = -1;
    for (let k = 7; k >= 0; k--) { const b = towerBase(el, k); if (b.air || b.light) continue; if (b.cost <= gold) { pick = k; break; } }
    const up = towers.filter(t => t.lvl < 6).sort((a, b) => b.idx - a.idx || a.lvl - b.lvl)[0];
    const upc = up ? Math.round(towerBase(el, up.idx).cost * Math.pow(CONFIG.upgradeCost, up.lvl)) : Infinity;
    if (pick >= 0 && (towers.length < 6 || towerBase(el, pick).cost >= upc)) { const c = best(pick); if (!c) break;
      taken.add(c[0] + ',' + c[1]); towers.push({ x:c[0], y:c[1], el, idx:pick, lvl:1 }); gold -= towerBase(el, pick).cost; }
    else if (up && upc <= gold) { up.lvl++; gold -= upc; }
    else break;
  }
  return towers;
}
const budget = r => { let g = CONFIG.startGold; for (let k = 1; k < r; k++) g += (MONSTERS[k - 1].count || 20) * bountyFor(MONSTERS[k - 1].round); return g; };   // r = Tag (seit 13.10. mit Zwischenbosse), Kopfgeld nach Runde
const neutral = r => { const M = MONSTERS[r - 1]; MONSTERS[r - 1] = { ...M, weak:[1,1,1,1], speed:1, hpMul:1, fly:false, count:20 }; return M; };
const BUILDS = {};
function kills(r, players, mul){
  const orig = neutral(r), base = CONFIG.baseHp; CONFIG.baseHp = base * mul; let sum = 0, cnt = 0;
  for (let e = 0; e < 4; e++) for (const lane of [0, 2]) {
    const key = e + '-' + lane + '-' + r; const towers = BUILDS[key] || (BUILDS[key] = build(e, lane, budget(r)));
    for (const weather of [0, 1]) { sum += simulate({ lane, players, towers, incoming:waveSpecs(r), weather, seed:r }).kills; cnt++; } }
  CONFIG.baseHp = base; MONSTERS[r - 1] = orig; return sum / cnt;
}
function solve(r, players, goal){ let lo = 0.001, hi = 1000;
  for (let it = 0; it < 30; it++) { const mid = Math.sqrt(lo * hi); if (kills(r, players, mid) > goal) lo = mid; else hi = mid; } return Math.sqrt(lo * hi); }
if (process.argv[2] === 'pruefen') { for (const r of [1,2,3,5,8,10,13,16,20]) console.log('Runde ' + r + ': ' + [2,3,4].map(n => n + ' Spieler ' + kills(r, n, 1).toFixed(1)).join(' · ') + ' von 20'); return; }
const m1 = solve(1, 2, 12);
console.log('Runde 1, 2 Spieler: baseHp ' + (CONFIG.baseHp * m1).toFixed(2) + ' (jetzt ' + CONFIG.baseHp + ')');
CONFIG.baseHp *= m1;
for (const [n, goal] of [[3, 8], [4, 6]]) { const f = solve(1, n, goal) * (CONFIG.playerHp[n] || 1); console.log('Spielerfaktor ' + n + ': ' + f.toFixed(2) + ' (jetzt ' + CONFIG.playerHp[n] + ')'); }
const rel = [];
for (let r = 1; r <= ROUNDS; r++) { const m = solve(r, 2, 12) * Math.pow(MONSTERS[r - 1].round, CONFIG.hpExp); rel.push(m); console.log('Runde ' + String(r).padStart(2) + ': Gold ' + String(budget(r)).padStart(5) + ', Leben-Faktor ' + m.toFixed(2)); }
// Wachstum pro Runde: log-lineare Ausgleichsgerade durch die Runden 1..ROUNDS
let sx = 0, sy = 0, sxx = 0, sxy = 0; rel.forEach((m, i) => { const x = i, y = Math.log(m); sx += x; sy += y; sxx += x * x; sxy += x * y; });
const k = rel.length, slope = (k * sxy - sx * sy) / (k * sxx - sx * sx), icpt = (sy - slope * sx) / k;
console.log('Leben-Faktor relativ zu baseHp × Runde^hpExp: Steigung je Runde ' + Math.exp(slope).toFixed(3) + ' (1 = Kurve passt)');
})();`);
