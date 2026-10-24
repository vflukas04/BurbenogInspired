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
        if (fx[k].L) { keep[k].L = {}; for (const [i, e] of Object.entries(fx[k].L)) if (e[1] > 0) keep[k].L['x' + i] = [+e[0].toFixed(3), Math.round(e[1] * 10) / 10]; } }`],
  [`function hit(s, m, def, dmg){`,
   `// 21.10. (L, Spiegel): teilweise stapelndes Brennen
// 23.10. (L, ab C8): stärkster Brand voll, jeder weitere 20 %, höchstens die 6 stärksten (×2,0). Bis C7: 1/0,5/0,25/0,1, Rest 0,05, höchstens 10
// (alt nachstellen: BURN_W=1,0.5,0.25,0.1 BURN_REST=0.05 BURN_MAX=10)
const BURN_W = ${process.env.BURN_W ? JSON.stringify(process.env.BURN_W.split(',').map(Number)) : '[1]'}, BURN_REST = ${process.env.BURN_REST || 0.2}, BURN_MAX = ${process.env.BURN_MAX || 6}; let BURN_ID = 0;
function burnSum(c){ const a = Object.values(c.L).filter(x => x[1] > 0).map(x => x[0]).sort((p, q) => q - p); let v = 0; a.forEach((x, i) => v += x * (i < BURN_W.length ? BURN_W[i] : BURN_REST)); return c.cap ? Math.min(c.cap, v) : v; }
// Zweig D (L, 24.10.): dieselbe Stapelregel für Bremsen und Fluch (STAPEL_ALLE=1), mit Deckel wie im Spiel (Bremsen 0,85, Fluch 1,5)
function addStack(m, kind, id, val, t, w, cap){
  if (!(val > 0) || !(t > 0)) return;
  let c = m.fx[kind];
  if (!c || c.t <= 0 || !c.L) { const alt = c && c.t > 0 ? [c.v, c.t] : null; c = m.fx[kind] = { v:0, t:0, L:{}, cap }; if (alt) c.L.alt = alt; }
  if (w) c.w = true;
  const e = c.L[id]; c.L[id] = e ? [Math.max(e[0], val), Math.max(e[1], t)] : [val, t];
  const ks = Object.keys(c.L); if (ks.length > BURN_MAX) ks.sort((p, q) => c.L[q][0] - c.L[p][0] || c.L[q][1] - c.L[p][1]).slice(BURN_MAX).forEach(k => delete c.L[k]);
  c.v = burnSum(c); c.t = Math.max(...Object.values(c.L).map(x => x[1]));
}
function addBurn(m, id, val, t, w){
  if (!(val > 0) || !(t > 0)) return;
  let c = m.fx.burn;
  if (!c || c.t <= 0 || !c.L) { const alt = c && c.t > 0 ? [c.v, c.t] : null; c = m.fx.burn = { v:0, t:0, L:{} }; if (alt) c.L.alt = alt; }
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
if (process.env.STAPEL_ALLE) ERSETZEN.push(
  [`if (def.effect === 'slow' && (!flying(m) || def.slowFly)) addFx(m, 'slow', Math.min(0.85, def.eff * f), t);`,
   // Bremsen (L 24.10.): Prozent wie bisher, je Turm höchstens 30 % (BREMS_MAX) → mit der Stapelregel höchstens 60 % (kein eigener Deckel)
   `if (def.effect === 'slow' && (!flying(m) || def.slowFly)) addStack(m, 'slow', (def._bid || (def._bid = ++BURN_ID)) + ':s' + (def._bc = (def._bc || 0) + 1), Math.min(+(process.env.BREMS_MAX || 0.3), def.eff * f), t, false, 0);`],
  [`    else addFx(m, 'curse', def.eff * f, t, def.curseWave);`,
   `    else addStack(m, 'curse', (def._bid || (def._bid = ++BURN_ID)) + ':c' + (def._bc = (def._bc || 0) + 1), def.eff * f, t, def.curseWave, 0);`]);   // Fluch ohne Deckel: Stapelregel begrenzt auf 2 × stärksten
module.exports = html => { for (const [a, b] of ERSETZEN) { if (!html.includes(a)) throw new Error('Patch passt nicht: ' + a.slice(0, 60)); html = html.replace(a, b); } return html; };
