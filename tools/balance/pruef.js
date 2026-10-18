// Prüfpunkte für den Optimierer (team/BALANCING.md, Stand 18.10.): Fehler je Prüfpunkt + Vorschlag für seine Stellschrauben.
// Jede Funktion bekommt das geladene Spiel G (mit den Kandidatenwerten angewandt), den Kandidaten-Spiegel und – wo nötig – das P2-Ergebnis.
// Fehler: 0 = im Ziel; sonst mittlere logarithmische Abweichung außerhalb der Toleranz (0,05 ≈ 5 % daneben).
const { ziel, band } = require('./bericht');
const gm = (a, w) => { if (!a.length) return 1; w = w || a.map(() => 1); let s = 0, n = 0; a.forEach((v, i) => { s += w[i] * Math.log(Math.max(1e-3, v)); n += w[i]; }); return Math.exp(s / n); };
const rms = a => a.length ? Math.sqrt(a.reduce((x, v) => x + v * v, 0) / a.length) : 0;
const aus = (r, tol) => Math.max(0, Math.abs(Math.log(r)) - Math.log(1 + tol));   // Abweichung außerhalb der Toleranz
const DAEMPF = 0.7, clamp = (v, lo = 0.6, hi = 1.6) => Math.min(hi, Math.max(lo, v));
const ZIELE = {
  P6: 0.05,          // Elemente gesamt ±5 % (L, 18.10.)
  P6B: 0.10,         // Elemente je 5er-Block ±10 %
  STEIN_FLIEGER: 0.25,   // Stein: Tage mit Fliegenden zählen nur mit diesem Gewicht (L, 17.10.)
  // P8a: Zuwachs an Schaden/s je Gold beim Upgrade auf Stufe 2…6, relativ zum Bau desselben Turms. Fallend, damit neue Türme sich lohnen (L, 18.10.).
  Q: (process.env.ZIEL_Q || '0.95,0.9,0.8,0.7,0.6').split(',').map(Number),
  P8_SPAET: 0.35,    // P8: ab Runde 21 mindestens dieser Anteil des Turm-Golds in Türmen 5–8
  P8_GENUTZT: 0.05,  // P8: jeder Schadensturm bekommt in mindestens einem Block diesen Anteil
};
const blockOf = (G, i) => Math.ceil(G.MONSTERS[i].round / 5) - 1;
const fliegt = (G, i) => !!(G.MONSTERS[i].fly || G.MONSTERS[i].cocoon);
// R je Element und Tag (geometrisches Mittel über die Maps)
function rTabelle(erg){ const R = {}; for (const x in erg) R[x] = erg[x][0].tage.map((_, i) => gm(erg[x].map(m => m.tage[i].R))); return R; }
// Gold je Turm (Bau + Upgrades, ohne Gelände) je Element und Block, aus den Stufen-Texten des P2-Laufs
function anteile(G, erg){
  const out = {};
  for (const x in erg) { const e = G.ELEMENTS.findIndex(E => E.name === x); out[x] = [...Array(8)].map(() => Array(8).fill(0));
    for (const m of erg[x]) m.tage.forEach((t, i) => { const b = blockOf(G, i);
      for (const s of (t.stufen || '').split(' ')) { if (!s) continue; const [k, l] = s.replace('*', '').split('.').map(Number), c = G.towerBase(e, k - 1).cost;
        let inv = 0; for (let j = 0; j < l; j++) inv += c * Math.pow(G.CONFIG.upgradeCost, j); out[x][b][k - 1] += inv; } });
    out[x] = out[x].map(row => { const s = row.reduce((a, v) => a + v, 0) || 1; return row.map(v => v / s); }); }
  return out;
}

// ---------- P2: Kurve (Leben je Block) ----------
function P2(G, sp, erg){
  const R = rTabelle(erg), namen = Object.keys(R), dev = [], vor = {};
  for (let b = 1; b < 8; b++) {
    const idx = G.MONSTERS.map((_, i) => i).filter(i => blockOf(G, i) === b); if (!idx.length) continue;
    const v = gm(idx.flatMap(i => namen.map(x => band(R[x][i], G.MONSTERS[i].round)))); dev.push(Math.log(v));
    const key = `CONFIG.hpBlock.${b}`, a = sp[key] ?? G.CONFIG.hpBlock[b]; vor[key] = +Math.max(1, a * clamp(Math.pow(v, DAEMPF))).toFixed(3);
  }
  return { err:rms(dev), vor, text:'Kurve je Block (R im Band): ' + dev.map((d, b) => `${b * 5 + 6}–${b * 5 + 10}: ${Math.exp(d).toFixed(2)}`).join(' · ') };
}
// ---------- P6: Elemente gesamt ±5 % ----------
function staerke(G, R, x, idx){ return gm(idx.map(i => R[x][i] / ziel(G.MONSTERS[i].round)), idx.map(i => x === 'Stein' && fliegt(G, i) ? ZIELE.STEIN_FLIEGER : 1)); }
function P6(G, sp, erg){
  const R = rTabelle(erg), namen = Object.keys(R), alle = G.MONSTERS.map((_, i) => i);
  const kr = Object.fromEntries(namen.map(x => [x, staerke(G, R, x, alle)])), m = gm(Object.values(kr)), vor = {};
  for (const x of namen) { const e = G.ELEMENTS.findIndex(E => E.name === x), key = `ELEMENTS.${e}.kraft`, a = sp[key] ?? G.ELEMENTS[e].kraft ?? 1;
    vor[key] = +(a * clamp(Math.pow(m / kr[x], DAEMPF))).toFixed(3); }
  return { err:rms(namen.map(x => aus(kr[x] / m, ZIELE.P6))), vor, text:'Elemente gesamt: ' + namen.map(x => `${x} ${(kr[x] / m).toFixed(2)}`).join(' · ') };
}
// ---------- P6B: Elemente je Block ±10 %, Stellschraube Kraft je Turm (gewichtet nach Gold-Anteil des Turms im Block) ----------
function P6B(G, sp, erg){
  const R = rTabelle(erg), namen = Object.keys(R), A = anteile(G, erg), dev = {}, errs = [], zeilen = [], vor = {};
  for (const x of namen) dev[x] = [];
  for (let b = 0; b < 8; b++) {
    const idx = G.MONSTERS.map((_, i) => i).filter(i => blockOf(G, i) === b); if (!idx.length) continue;
    const w = namen.map(x => staerke(G, R, x, idx)), mw = gm(w);
    namen.forEach((x, j) => { dev[x][b] = w[j] / mw; errs.push(aus(w[j] / mw, ZIELE.P6B)); });
    zeilen.push(`${b * 5 + 1}–${b * 5 + 5}: ` + namen.map((x, j) => `${x[0]}${(w[j] / mw).toFixed(2)}`).join(' '));
  }
  for (const x of namen) { const e = G.ELEMENTS.findIndex(E => E.name === x);
    for (let k = 0; k < 8; k++) { const ws = A[x].map(r => r[k]), sum = ws.reduce((a, v) => a + v, 0); if (sum < 0.05) continue;
      const f = gm(dev[x].map(d => d || 1), ws.map(v => v || 1e-6)), key = `ELEMENTS.${e}.kraftT.${k}`, a = sp[key] ?? (G.ELEMENTS[e].kraftT ? G.ELEMENTS[e].kraftT[k] : 1);
      if (Math.abs(Math.log(f)) > 0.02) vor[key] = +(a * clamp(Math.pow(1 / f, DAEMPF * 0.7))).toFixed(3); } }
  return { err:rms(errs), vor, text:'Elemente je Block: ' + zeilen.join(' | ') };
}
// ---------- P8a: Upgrades je Gold fallend (analytisch, ohne Simulation) ----------
// q_L = (Schaden/s Stufe L − Stufe L−1) / Upgradekosten  ÷  (Schaden/s Stufe 1 / Baukosten). Ziel ZIELE.Q.
// Zusätzlich gemeldet: Upgrade auf Stufe ≥ 4 von Turm k bringt je Gold mehr als der Bau von Turm k+1 (inkl. halbe Freischaltung) → „neuer Turm lohnt nicht“.
function qProfil(G, e, k){ const c = G.towerBase(e, k).cost, d = l => G.tdef({ el:e, idx:k, lvl:l, x:0, y:0 }).dpsNow, b = d(1) / c;
  return [2, 3, 4, 5, 6].map(l => (d(l) - d(l - 1)) / (c * Math.pow(G.CONFIG.upgradeCost, l - 1)) / b); }
function P8a(G, sp){
  const errs = [], zeilen = [], schlecht = [];
  G.ELEMENTS.forEach((E, e) => { const q = qProfil(G, e, 0); q.forEach((v, j) => errs.push(Math.log(v / ZIELE.Q[j])));
    zeilen.push(`${E.name} ${q.map(v => v.toFixed(2)).join('/')}`);
    // Vergleich nur unter Schadenstürmen (Effekt- und Lichttürme haben andere Aufgaben); Ziel: nächster Schadensturm
    const schaden = k => !['Licht', 'Effekt'].includes(E.towers[k][1]);
    for (let k = 0; k < 7; k++) { if (!schaden(k)) continue; let j = k + 1; while (j < 8 && !schaden(j)) j++; if (j >= 8) continue;
      const c = G.towerBase(e, k).cost, d = l => G.tdef({ el:e, idx:k, lvl:l, x:0, y:0 }).dpsNow;
      const lock = G.LOCKS[j] && G.LOCKS[j] !== G.LOCKS[k] ? G.RESEARCH.find(r => r.id === G.LOCKS[j]).cost / 2 : 0;
      const neu = G.tdef({ el:e, idx:j, lvl:1, x:0, y:0 }).dpsNow / (G.towerBase(e, j).cost + lock), up4 = (d(4) - d(3)) / (c * Math.pow(G.CONFIG.upgradeCost, 3));
      if (up4 > neu * 1.05 && neu > 0) schlecht.push(`${E.name} T${k + 1}→S4 ${(up4 / neu).toFixed(1)}× besser als T${j + 1}`); }
    // Einsteiger-Falle (Einwand F, 18.10.: „nur Kiesel hochgezogen“): Turm 1 je Gold nicht unter 60 % des nächsten Schadensturms
    let j = 1; while (j < 8 && !schaden(j)) j++;
    const je = k => G.tdef({ el:e, idx:k, lvl:1, x:0, y:0 }).dpsNow / G.towerBase(e, k).cost;
    if (j < 8 && je(0) < 0.6 * je(j)) schlecht.push(`${E.name} T1 je Gold nur ${(je(0) / je(j) * 100).toFixed(0)} % von T${j + 1} (Falle)`); });
  // Vorschlag: Schadensfaktor je Stufe direkt aus dem Ziel q rechnen (s_L = 1 + q_L · 1,5^(L−1) / dps_{L−1}, dps relativ zu Stufe 1)
  const vor = {}, U = G.CONFIG.upgradeCost; let dps = 1;
  ZIELE.Q.forEach((q, j) => { const s = 1 + q * Math.pow(U, j + 1) / dps, key = `CONFIG.upgrade.steps.${j}`, a = sp[key] ?? G.CONFIG.upgrade.steps[j];
    vor[key] = +(a * Math.pow(s / a, DAEMPF)).toFixed(3); dps *= vor[key]; });
  G.ELEMENTS.forEach((E, e) => { if (E.upDmg) E.upDmg.forEach((_, j) => { vor[`ELEMENTS.${e}.upDmg.${j}`] = vor[`CONFIG.upgrade.steps.${j}`]; }); });   // Schatten: eigene Stufen folgen derselben Regel
  return { err:rms(errs) + 0.02 * schlecht.length, vor, text:'Upgrade je Gold (Turm 1, Stufe 2–6): ' + zeilen.join(' · ') + (schlecht.length ? ' | lohnt nicht: ' + schlecht.slice(0, 6).join(', ') + (schlecht.length > 6 ? ` (+${schlecht.length - 6})` : '') : '') };
}
// ---------- P8: Turmnutzung (aus dem P2-Lauf): neue Türme werden gebaut, kein Schadensturm bleibt ungenutzt ----------
function P8(G, sp, erg){
  const A = anteile(G, erg), errs = [], zeilen = [], vor = {}, ungenutzt = [];
  for (const x in A) { const e = G.ELEMENTS.findIndex(E => E.name === x), E = G.ELEMENTS[e];
    const spaet = gm([4, 5, 6, 7].map(b => Math.max(0.01, A[x][b].slice(4).reduce((a, v) => a + v, 0))));
    errs.push(Math.max(0, Math.log(ZIELE.P8_SPAET / spaet))); zeilen.push(`${x} ${(spaet * 100).toFixed(0)} %`);
    for (let k = 0; k < 8; k++) { if (E.towers[k][1] === 'Licht') continue; const best = Math.max(...A[x].map(r => r[k]));
      if (best < ZIELE.P8_GENUTZT) { ungenutzt.push(`${x} T${k + 1}`); errs.push(0.1);
        const key = `ELEMENTS.${e}.kraftT.${k}`, a = sp[key] ?? (E.kraftT ? E.kraftT[k] : 1); vor[key] = +(a * 1.1).toFixed(3); } } }
  // Freischaltungen billiger, wenn die späten Türme zu wenig gebaut werden
  if (errs.slice(0, 4).some(v => v > 0)) for (const id of ['t5:1', 't7:1']) { const i = G.RESEARCH.findIndex(r => r.id === id), key = `RESEARCH.${i}.cost`, a = sp[key] ?? G.RESEARCH[i].cost;
    vor[key] = Math.round(a * 0.85 / 10) * 10; }
  return { err:rms(errs), vor, text:`Anteil Türme 5–8 ab Runde 21 (Ziel ≥ ${ZIELE.P8_SPAET * 100} %): ${zeilen.join(' · ')}` + (ungenutzt.length ? ` | ungenutzt: ${ungenutzt.join(', ')}` : '') };
}
// ---------- P10: Forschung (nur Bericht): wann kauft der Bot was? ----------
function P10(G, sp, erg){
  const tag = {};
  for (const x in erg) for (const m of erg[x]) { const seen = new Set(); m.tage.forEach(t => (t.forschung || '').split(' ').forEach(id => { if (id && !seen.has(id)) { seen.add(id); (tag[id] = tag[id] || []).push(t.tag); } })); }
  const n = Object.values(erg).reduce((a, v) => a + v.length, 0), zeilen = [];
  for (const F of G.RESEARCH) { const t = tag[F.id] || [], m = /^el(\d)/.exec(F.id), nn = m ? (erg[G.ELEMENTS[+m[1]].name] || []).length : n;
    zeilen.push(`${F.id} ${t.length}/${nn}${t.length ? ' ab Tag ' + Math.min(...t) + ' (Mittel ' + Math.round(t.reduce((a, v) => a + v, 0) / t.length) + ')' : ' nie'}`); }
  return { err:0, vor:{}, text:'Forschung (gekauft in x von n Läufen, Tag): ' + zeilen.join(' · ') };
}
module.exports = { P2, P6, P6B, P8a, P8, P10, ZIELE, rTabelle, anteile, qProfil };
