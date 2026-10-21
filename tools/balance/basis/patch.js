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
      if (c.t2 !== undefined) { c.t2 -= dec; if (c.t <= 0 && c.t2 > 0) { c.v = c.v2; c.t = c.t2; delete c.v2; delete c.t2; } } }`],
  [`keep[k] = { v:+fx[k].v.toFixed(3), t:Math.round(fx[k].t * 10) / 10 };`,
   `{ keep[k] = { v:+fx[k].v.toFixed(3), t:Math.round(fx[k].t * 10) / 10 }; if (fx[k].t2 > 0) { keep[k].v2 = +fx[k].v2.toFixed(3); keep[k].t2 = Math.round(fx[k].t2 * 10) / 10; } }`],
];
module.exports = html => { for (const [a, b] of ERSETZEN) { if (!html.includes(a)) throw new Error('Patch passt nicht: ' + a.slice(0, 60)); html = html.replace(a, b); } return html; };
