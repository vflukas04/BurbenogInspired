// Code-Änderungen am Spiegel (L, 21.10.): Die eingefrorene Basis bleibt unverändert; diese Ersetzungen werden beim Laden
// (sim.js) und beim Erzeugen der Testseite (spiegel-seite.js) angewandt. Beim Zusammenführen mit dem Spiel müssen sie in index.html übernommen werden.
//  1) Upgrades mit Schwerpunkt je Stufe: CONFIG.upgrade.rangeSteps / durSteps / effSteps (je 5 Werte für Stufe 2–6).
//     Fehlen sie, gilt wie bisher +range je Stufe, ×dur je Stufe, ×eff je Stufe.
//  2) Steigung je Turm: ELEMENTS[e].upT[k] = Zusatzfaktor auf den Schaden je Upgrade-Stufe (1 = neutral), weil Türme eines Elements
//     verschieden stark von Reichweite/Fläche/Effekten profitieren und ein Faktor je Element nicht für alle passt.
//  3) Effekte (21.10., L): Bisher wurden Stärke und Dauer getrennt maximiert („stärkerer Wert gewinnt, längere Dauer gewinnt“).
//     Dadurch machte ein schwacher Dauereffekt (z. B. Schwelbrand: ganzer Tag) jeden starken kurzen Effekt anderer Türme zum
//     starken Dauereffekt. Neu: Der stärkste aktive Effekt wirkt mit seiner eigenen Dauer; ein schwächerer, aber längerer bleibt als
//     Rückfall (v2/t2) und übernimmt, wenn der starke abläuft. Gilt für alle Effekte (Brennen, Bremsen, Fluch …), auch über Leaks.
//  4) Brennen stapelt sich teilweise (21.10., L): Jeder brennende Turm hat seinen eigenen Brand am Monster (Liste fx.burn.L je Turm);
//     wirksam ist die Summe nach Stärke sortiert mit 100 % / 50 % / 25 % / 10 % / danach je 5 %. Läuft ein starker Brand ab,
//     rücken die anderen nach. Jeder Treffer ist ein eigener Brand, auch vom selben Turm; gewertet werden die 10 stärksten (höchstens ×2,3). Vorher wirkte nur der stärkste (Feuer verlor mit vielen Türmen ~30 % je Turm). Brände wandern mit den Leaks.
const ERSETZEN = [
  ['const ceil1 = v => Math.ceil(v * 10 - 1e-6) / 10;',
   'const ceil1 = v => Math.ceil(v * 10 - 1e-6) / 10;\n// 21.10. (L, Spiegel): Upgrade-Schwerpunkt je Stufe\nconst upProd = (a, d, n) => a ? a.slice(0, n).reduce((x, v) => x * v, 1) : Math.pow(d, n), upSum = (a, d, n) => a ? a.slice(0, n).reduce((x, v) => x + v, 0) : d * n;'],
  ['  let eff = b.eff * Math.pow(U.eff, n);', '  if (ELEMENTS[tw.el].upT) dpsNow = ceil1(dpsNow * Math.pow(ELEMENTS[tw.el].upT[tw.idx], n));\n  let eff = b.eff * upProd(U.effSteps, U.eff, n);'],
  ['light: b.light ? b.light + U.range * GRID * n : 0', 'light: b.light ? b.light + upSum(U.rangeSteps, U.range, n) * GRID : 0'],
  ['dur: b.dur === DAY ? DAY : b.dur * Math.pow(U.dur, n), range: b.range + U.range * GRID * n,',
   'dur: b.dur === DAY ? DAY : b.dur * upProd(U.durSteps, U.dur, n), range: b.range + upSum(U.rangeSteps, U.range, n) * GRID,'],
  [`  if (!c || c.t <= 0) m.fx[kind] = w ? { v:val, t, w:true } : { v:val, t };
  else { c.v = Math.max(c.v, val); c.t = Math.max(c.t, t); if (w) c.w = true; }`,
   `  if (!c || c.t <= 0) { m.fx[kind] = w ? { v:val, t, w:true } : { v:val, t }; return; }
  if (w) c.w = true;   // 21.10. (L, Spiegel): stärkster aktiver Effekt wirkt, längerer schwächerer bleibt als Rückfall
  const L = [[c.v, c.t], [val, t]]; if (c.t2 > 0) L.push([c.v2, c.t2]);
  L.sort((a, b) => b[0] - a[0] || b[1] - a[1]); c.v = L[0][0]; c.t = L[0][1];
  const r = L.slice(1).filter(x => x[1] > c.t).sort((a, b) => b[0] - a[0])[0];
  if (r) { c.v2 = r[0]; c.t2 = r[1]; } else { delete c.v2; delete c.t2; }`],
  [`    for (const k in m.fx) m.fx[k].t -= dt * (k === 'burn' && s.W.burnDecay ? s.W.burnDecay : 1);`,
   `    for (const k in m.fx) { const c = m.fx[k], dec = dt * (k === 'burn' && s.W.burnDecay ? s.W.burnDecay : 1); c.t -= dec;
      if (c.t2 !== undefined) { c.t2 -= dec; if (c.t <= 0 && c.t2 > 0) { c.v = c.v2; c.t = c.t2; delete c.v2; delete c.t2; } }
      if (c.L) { for (const i in c.L) { c.L[i][1] -= dec; if (c.L[i][1] <= 0) delete c.L[i]; } c.v = burnSum(c); c.t = Math.max(0, ...Object.values(c.L).map(x => x[1])); } }`],
  [`keep[k] = { v:+fx[k].v.toFixed(3), t:Math.round(fx[k].t * 10) / 10 };`,
   `{ keep[k] = { v:+fx[k].v.toFixed(3), t:Math.round(fx[k].t * 10) / 10 }; if (fx[k].t2 > 0) { keep[k].v2 = +fx[k].v2.toFixed(3); keep[k].t2 = Math.round(fx[k].t2 * 10) / 10; }
        if (fx[k].kind) keep[k].kind = fx[k].kind; if (fx[k].L) { keep[k].L = {}; for (const [i, e] of Object.entries(fx[k].L)) if (e[1] > 0) keep[k].L['x' + i] = [+e[0].toFixed(3), Math.round(e[1] * 10) / 10]; } }`],
  [`function hit(s, m, def, dmg){`,
   `// 21.10. (L, Spiegel): teilweise stapelndes Brennen
// 23.10. (L, ab C8): stärkster Brand voll, jeder weitere 20 %, höchstens die 6 stärksten (×2,0). Bis C7: 1/0,5/0,25/0,1, Rest 0,05, höchstens 10
// (alt nachstellen: BURN_W=1,0.5,0.25,0.1 BURN_REST=0.05 BURN_MAX=10)
const BURN_W = ${process.env.BURN_W ? JSON.stringify(process.env.BURN_W.split(',').map(Number)) : '[1]'}, BURN_REST = ${process.env.BURN_REST || 0.2}, BURN_MAX = ${process.env.BURN_MAX || 6}; let BURN_ID = 0;
function burnSum(c){ const a = Object.values(c.L).filter(x => x[1] > 0).map(x => x[0]).sort((p, q) => q - p); let v = 0; const R = c.kind && CONFIG.stackRest && CONFIG.stackRest[c.kind] !== undefined ? CONFIG.stackRest[c.kind] : BURN_REST; a.forEach((x, i) => v += x * (i < BURN_W.length ? BURN_W[i] : R));   /* 28.10.: Anteil je Effekt (CONFIG.stackRest) */ return c.cap ? Math.min(c.cap, v) : v; }
// Zweig D (L, 24.10.): dieselbe Stapelregel für Bremsen und Fluch (STAPEL_ALLE=1), mit Deckel wie im Spiel (Bremsen 0,85, Fluch 1,5)
function addStack(m, kind, id, val, t, w, cap){
  if (!(val > 0) || !(t > 0)) return;
  let c = m.fx[kind];
  if (!c || c.t <= 0 || !c.L) { const alt = c && c.t > 0 ? [c.v, c.t] : null; c = m.fx[kind] = { v:0, t:0, L:{}, cap, kind }; if (alt) c.L.alt = alt; }
  if (w) c.w = true;
  const e = c.L[id]; c.L[id] = e ? [Math.max(e[0], val), Math.max(e[1], t)] : [val, t];
  const ks = Object.keys(c.L); if (ks.length > BURN_MAX) ks.sort((p, q) => c.L[q][0] - c.L[p][0] || c.L[q][1] - c.L[p][1]).slice(BURN_MAX).forEach(k => delete c.L[k]);
  c.v = burnSum(c); c.t = Math.max(...Object.values(c.L).map(x => x[1]));
}
function addBurn(m, id, val, t, w){
  if (!(val > 0) || !(t > 0)) return;
  let c = m.fx.burn;
  if (!c || c.t <= 0 || !c.L) { const alt = c && c.t > 0 ? [c.v, c.t] : null; c = m.fx.burn = { v:0, t:0, L:{}, kind:'burn' }; if (alt) c.L.alt = alt; }
  if (w) c.w = true;
  const e = c.L[id]; c.L[id] = e ? [Math.max(e[0], val), Math.max(e[1], t)] : [val, t];
  const ks = Object.keys(c.L); if (ks.length > BURN_MAX) ks.sort((a, b) => c.L[b][0] - c.L[a][0] || c.L[b][1] - c.L[a][1]).slice(BURN_MAX).forEach(k => delete c.L[k]);   // nur die stärksten behalten
  c.v = burnSum(c); c.t = Math.max(...Object.values(c.L).map(x => x[1]));
}
function hit(s, m, def, dmg){`],
  [`.sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([o]) => addFx(o, 'burn', bn.v, bn.t));`,
   `.sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([o]) => addBurn(o, 'welle', bn.v, bn.t));`],
  [`    if (def.burnStack && on(m, 'burn')) { const c = m.fx.burn; c.v = Math.min(c.v + v, (1 + (def.burnStack - 1) * bh) * Math.max(c.v, v)); c.t = Math.max(c.t, t); if (def.burnWave) c.w = true; }
    else addFx(m, 'burn', v, t, def.burnWave);`,
   `    // 21.10. (L): jeder Treffer ist ein eigener Brand (auch vom selben Turm); gewertet werden die BURN_MAX stärksten
    const bid = (def._bid || (def._bid = ++BURN_ID)) + ${process.env.BURN_JE_TURM ? "''" : "':' + (def._bc = (def._bc || 0) + 1)"};
    addBurn(m, bid, v, t, def.burnWave);
    if (def.burnStack && on(m, 'burn')) addBurn(m, 'g' + def._bid, v * (def.burnStack - 1) * bh, t, def.burnWave);   // Glutnest: zusätzlicher eigener Brand`],
];
// Zweig D (L 25.10.): Flächen-Geschoss trifft das anvisierte Monster immer voll (wenn es im Radius ist), die anderen mit Abfall zum Rand (D_PRIMAER=1)
if (process.env.D_PRIMAER) ERSETZEN.push(
  [`function splashAt(s, def, x, y, R){   // Flächenschaden um einen Punkt
  for (const o of s.monsters) { if (o.dead || !canHit(def, o)) continue;
    const r = Math.hypot(o.x - x, o.y - y), E = ELEMENTS[def.el], c = E.splashCenter || 1, e = E.splashEdge ?? CONFIG.splashEdge;
    if (r <= R) hit(s, o, def, def.dmg * (c - (c - e) * r / R)); }`,
   `function splashAt(s, def, x, y, R, prim){   // Flächenschaden um einen Punkt
  for (const o of s.monsters) { if (o.dead || !canHit(def, o)) continue;
    const r = Math.hypot(o.x - x, o.y - y), E = ELEMENTS[def.el], c = E.splashCenter || 1, e = E.splashEdge ?? CONFIG.splashEdge;
    if (r <= R) hit(s, o, def, def.dmg * (o === prim ? c : (c - (c - e) * r / R))); }`],
  [`if (def.splash) { splashAt(s, def, p.tx, p.ty, def.splash);`,
   `if (def.splash) { splashAt(s, def, p.tx, p.ty, def.splash, p.tgt);`]);
if (process.env.STAPEL_ALLE) ERSETZEN.push(
  [`if (def.effect === 'slow' && (!flying(m) || def.slowFly)) addFx(m, 'slow', Math.min(0.85, def.eff * f), t);`,
   // Bremsen (L 24.10.): Prozent wie bisher, je Turm höchstens 40 % ohne Fläche (BREMS_MAX) bzw. 30 % mit Fläche/Nova (BREMS_MAX_FL) → gestapelt höchstens 80 % bzw. 60 % (kein eigener Deckel)
   `if (def.effect === 'slow' && (!flying(m) || def.slowFly)) addStack(m, 'slow', (def._bid || (def._bid = ++BURN_ID)) + ':s' + (def._bc = (def._bc || 0) + 1), Math.min(def.splash || def.nova ? +(process.env.BREMS_MAX_FL || 0.3) : +(process.env.BREMS_MAX || 0.4), def.eff * f), t, false, 0);`],
  [`    else addFx(m, 'curse', def.eff * f, t, def.curseWave);`,
   `    else addStack(m, 'curse', (def._bid || (def._bid = ++BURN_ID)) + ':c' + (def._bc = (def._bc || 0) + 1), def.eff * f, t, def.curseWave, 0);`]);   // Fluch ohne Deckel: Stapelregel begrenzt auf 2 × stärksten
ERSETZEN.push(...require('./irrlicht'));
// Zweig D (L 26.10.): Luftspezialist – Turmoptionen groundMul (Bodenmonster × Wert) und flyMul (Fliegende × Wert); vorher nur über Edelsteine
ERSETZEN.push([`    chance:opt.chance || 0, chanceUp:opt.chanceUp || 0, chanceMax:opt.chanceMax || 0.4, idx, el };`,
  `    chance:opt.chance || 0, chanceUp:opt.chanceUp || 0, chanceMax:opt.chanceMax || 0.4, flyMul:opt.flyMul || 0, groundMul:opt.groundMul || 0, idx, el };`],
  [`  if (def.groundHalf && !flying(m)) dmg *= 0.5;               // Feuerregen: Bodenmonster halb`,
   `  if (def.groundHalf && !flying(m)) dmg *= 0.5;               // Feuerregen: Bodenmonster halb\n  if (def.groundMul && !flying(m)) dmg *= def.groundMul;      // Zweig D: Luftspezialist / schwach gegen Fliegende`]);   // 26.10. (L): Irrlicht wirkt auf die Monster im Lichtkreis (auch im Spiel umgesetzt, 26a)
// Zweig D (L 28.10.): Wind aus einer Richtung – Monster, die mit dem Wind laufen, werden schneller, gegen den Wind langsamer.
// WEATHER[k].wind = { dir:[dx, dy] (Richtung, in die der Wind weht), ground:[mit, gegen], fly:[mit, gegen] } (Anteile, mit cos der Laufrichtung gewichtet).
// Ohne wind wie bisher (flySpeed). Richtung im Spiel später je Tag aus dem Seed; für Messungen fest (elemente6.js WIND=…).
ERSETZEN.push([`    const v = GRID * spd * (flying(m) && s.W.flySpeed ? s.W.flySpeed : 1) * (1 - slow) * dt;`,
  `    const v = GRID * spd * windMul(s, m) * (1 - slow) * dt;`],
  [`const isBossy = m => !!(m.def.mini || m.def.boss);`,
  `const isBossy = m => !!(m.def.mini || m.def.boss);
function windMul(s, m){ const W = s.W, f = flying(m), k = f && W.flySpeed ? W.flySpeed : 1, w = W.wind; if (!w) return k;
  const sg = s.map.seg.find(g => m.d <= g.start + g.len) || s.map.seg[s.map.seg.length - 1], dx = sg.bx - sg.ax, dy = sg.by - sg.ay, L = Math.hypot(dx, dy) || 1;
  const c = (dx * w.dir[0] + dy * w.dir[1]) / (L * (Math.hypot(w.dir[0], w.dir[1]) || 1)) * (m.back ? -1 : 1), p = f ? w.fly : w.ground;
  return k * (c >= 0 ? 1 + p[0] * c : 1 + p[1] * c); }`]);
// Zweig D (L 28.10.): (1) D_GENAU=1 (Standard in d/bots.js): Schaden/s ohne Aufrunden auf 0,1 – das Aufrunden verschob T1 je Element um 0,7–4 %.
// (2) CONFIG.burnArmor: Brennen wird durch Rüstung gemindert (× (1 − burnArmor × Prozent), solange Punkte übrig sind; Fluch senkt die Prozent auch hier).
//     Vorher ging Brennen ganz durch – dadurch hing Feuer stärker an der Rüstung als die anderen Elemente.
ERSETZEN.push([`const ceil1 = v => Math.ceil(v * 10 - 1e-6) / 10;`, `const ceil1 = v => typeof process === 'object' && process.env && process.env.D_GENAU === '1' ? v : Math.ceil(v * 10 - 1e-6) / 10;`],
  [`    if (on('burn')) m.hp -= fx.burn.v * (1 + (on('curse') ? fx.curse.v : 0) + (on('smolder') ? fx.smolder.v : 0)) * dt;`,
   `    if (on('burn')) { const bp = CONFIG.burnArmor && m.ap > 0 ? Math.max(0, Math.min(0.95, armorPctOf(m) + (m.aura || 0)) - (on('curse') ? fx.curse.v : 0)) : 0;
      m.hp -= fx.burn.v * (1 + (on('curse') ? fx.curse.v : 0) + (on('smolder') ? fx.smolder.v : 0)) * (1 - (CONFIG.burnArmor || 0) * bp) * dt; }`]);
// Zweig D (L 28.10.): ELEMENTS[e].kraftBlock[i] = Schaden des Elements in den Runden 5i+1 … 5i+5 (Runde der Welle, z. B. Wetter-Mittel je Abschnitt nachstellen)
ERSETZEN.push([`  const towers = raw.map(tw => ({ ...tw, cd:0, def: wdef(tdef(tw, inp.lane || 0), W, res) }));`,
  `  const kbR = inp.incoming && inp.incoming[0] && MONSTERS[inp.incoming[0].type] ? MONSTERS[inp.incoming[0].type].round : 0;
  const kbOf = el => { const a = ELEMENTS[el].kraftBlock; return a && kbR ? (a[Math.min(a.length - 1, Math.floor((kbR - 1) / 5))] || 1) : 1; };
  const towers = raw.map(tw => { const d = wdef(tdef(tw, inp.lane || 0), W, res), k = kbOf(tw.el); return { ...tw, cd:0, def: k === 1 ? d : { ...d, dpsNow:d.dpsNow * k, dmg:d.dmg * k } }; });`]);
module.exports = html => { for (const [a, b] of ERSETZEN) { if (!html.includes(a)) throw new Error('Patch passt nicht: ' + a.slice(0, 60)); html = html.replace(a, b); } return html; };
