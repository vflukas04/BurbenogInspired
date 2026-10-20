// Turm-Prüfstand, Ebene A (L, 20.10.; Verfahren team/BALANCING.md → „Neuer Plan“). Ohne gierigen Bot, ohne Edelsteine.
// Kraft eines Turms = mittlerer Schaden je Welle, den EIN Turm (optimal platziert) auf der eigenen Map anrichtet, gemittelt über die Tage.
//   – Monster sterben nicht (Leben ×1000, Rüstungspunkte normal), sonst sättigt der Wert; Brennen zählt, solange das Monster auf der Map ist
//   – Effekte (Bremsen, Fluch, Betäuben, Licht …): Wert = Mehrschaden eines Referenzturms (Schatten-Schemen, Stufe 1) mit ÷ ohne diesen Turm,
//     umgerechnet in Schaden, den dasselbe Gold in Referenztürmen machen würde: Kraft = eigener Schaden + (m − 1) × Referenzschaden je Gold × Gold
//   – Tage: alle außer Bossen/Zwischenbossen; reine Luftabwehr nur Fliegertage, Türme ohne Luftangriff nur die übrigen; 10 Uhr, Wetter 0
//   – Maps 0 und 2 als Wiese (ohne Gelände), Mittel
// Kraft je Gold = Kraft ÷ investiertes Gold (Bau + Upgrades). Ziele:
//   A1 Upgrades: KjG(Stufe s) ÷ KjG(Stufe 1) = 1 / 0,9 / 1,0 / 1,1 / 1,2 / 1,3
//   A2 Turmtreppe: KjG(Turm k, Stufe 1) ÷ KjG(Turm k−1, Stufe 1) = 1,055
//   A3 nur Luftabwehr ×1,5 (an Fliegertagen), ohne Luftangriff ×1,1 (an den übrigen Tagen), jeweils gegenüber der Treppe
// Aufruf: node tools/balance/turm.js [bericht | anpassen]   (Spiegel wird angewandt; anpassen schreibt tools/balance/spiegel-A.json, nie spiegel.json)
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C, S = require('./spiegel');
// REAL=1 (Variante): echte Leben (Monster sterben, Überschuss zählt nicht), nur Tage im Einsatzfenster des Turms
//   (ab dem Tag, an dem man sich den Turm auf dieser Stufe zweimal leisten könnte, bis Spielende)
const REAL = !!process.env.REAL;
const UP = [1, 0.9, 1.0, 1.1, 1.2, 1.3], TREPPE = 1.055, LUFT = 1.5, BODEN = 1.1, HP = REAL ? 1 : 1000;
const BUDGET = (() => { const { budget } = require('./p2'); return G.MONSTERS.map((_, d) => budget(d).gold); })();
const TAGE = G.MONSTERS.map((m, i) => i).filter(i => !G.MONSTERS[i].boss && !G.MONSTERS[i].mini);
const FLIEG = new Set(TAGE.filter(i => G.MONSTERS[i].fly)), MAPS = [0, 2];
const REF = { el:2, idx:0 };   // Referenzturm für Effekte: Schatten-Schemen (Einzelziel, kein Effekt)

function welle(d){   // 20 Monster des Tages (gemischte Wellen mit Varianten), unsterblich
  const M = G.monsterDef(d, 2), n = G.MONSTERS[d].count || G.CONFIG.perWave, mix = G.waveMix ? G.waveMix(d, n) : [];
  return [...Array(n)].map((_, k) => { const v = mix[k], q = v ? G.variantDef(M, v) : M;
    return v ? { type:d, hops:0, v, hp:q.hp * HP, ap:q.armorPts } : { type:d, hops:0, hp:M.hp * HP, ap:M.armorPts }; });
}
function schaden(towers, d){
  const inc = welle(d), hpIn = inc.reduce((a, m) => a + m.hp, 0);
  const s = G.simulate({ lane:C.LANE, players:2, towers, res:[], incoming:inc, dark:false, weather:0, seed:7 });
  return hpIn - s.leaked.reduce((a, m) => a + m.hp, 0);
}
const gold = (e, k, lvl) => { let g = G.towerBase(e, k).cost; for (let l = 1; l < lvl; l++) g += Math.round(G.towerBase(e, k).cost * Math.pow(G.CONFIG.upgradeCost, l)); return g; };
const tageVon = (e, k, lvl = 1) => { const b = G.towerBase(e, k); let t = b.air ? [...FLIEG] : b.hitsFly ? TAGE : TAGE.filter(d => !FLIEG.has(d));
  if (REAL) { const g = gold(e, k, lvl), ab = BUDGET.findIndex(x => x >= 2 * g); t = t.filter(d => ab >= 0 && d >= ab); if (!t.length) t = [TAGE[TAGE.length - 1]]; }
  return t; };
function platz(e, k, lvl, besetzt){ return C.mask(e, k, lvl, 0.5).cells.find(c => !besetzt.has(c.x + ',' + c.y)); }

// Kraft je Gold für Turm (e,k) auf Stufe lvl, gemittelt über Maps und Tage
function kjg(e, k, lvl){
  let sum = 0, n = 0;
  for (const lane of MAPS) {
    C.useMap(lane, null);
    const ref = platz(REF.el, REF.idx, 1, new Set()), refT = { x:ref.x, y:ref.y, el:REF.el, idx:REF.idx, lvl:1 };
    let c = platz(e, k, lvl, new Set([ref.x + ',' + ref.y]));
    if (G.towerBase(e, k).light || G.towerBase(e, k).buff) {   // Irrlicht: neben den Referenzturm (Licht wirkt nur im Kreis)
      const frei = C.free.filter(([x, y]) => !(x === ref.x && y === ref.y)).sort((a, b) => Math.hypot(a[0] - ref.x, a[1] - ref.y) - Math.hypot(b[0] - ref.x, b[1] - ref.y));
      c = { x:frei[0][0], y:frei[0][1] }; }
    const t = { x:c.x, y:c.y, el:e, idx:k, lvl }, g = gold(e, k, lvl), refGold = G.towerBase(REF.el, REF.idx).cost;
    for (const d of tageVon(e, k, lvl)) {
      const eigen = schaden([t], d), r0 = schaden([refT], d), r1 = schaden([refT, t], d) - eigen;   // Referenzschaden mit diesem Turm daneben
      const m = r0 > 0 ? r1 / r0 : 1;
      sum += (eigen + Math.max(0, m - 1) * (r0 / refGold) * g) / g; n++;
    }
  }
  return sum / n;
}
function tabelle(){
  const T = [];
  for (let e = 0; e < 4; e++) { T[e] = [];
    for (let k = 0; k < 8; k++) { T[e][k] = []; for (let l = 1; l <= 6; l++) T[e][k][l] = kjg(e, k, l);
      if (process.env.LAUT) console.error(`${G.ELEMENTS[e].name} ${G.towerBase(e, k).name}: ${T[e][k].slice(1).map(v => v.toFixed(3)).join(' ')}`); } }
  return T;
}
// Abweichung von den Zielen
function auswerten(T){
  const z = [], gew = (e, k) => { const b = G.towerBase(e, k); return b.air ? LUFT : b.hitsFly ? 1 : BODEN; };
  let err = 0, nErr = 0;
  for (let e = 0; e < 4; e++) {
    const basis = T[e][0][1] / gew(e, 0);
    const zeile = { el:G.ELEMENTS[e].name, tuerme:[] };
    for (let k = 0; k < 8; k++) {
      const soll = basis * Math.pow(TREPPE, k) * gew(e, k), ist = T[e][k][1], a2 = ist / soll;
      const a1 = UP.map((u, i) => T[e][k][i + 1] / T[e][k][1] / u);
      zeile.tuerme.push({ name:G.towerBase(e, k).name, a2, a1 });
      if (k) { err += Math.log(a2) ** 2; nErr++; }
      for (let i = 1; i < 6; i++) { err += Math.log(a1[i]) ** 2; nErr++; }
    }
    z.push(zeile);
  }
  return { z, rms:Math.sqrt(err / nErr) };
}
function drucken(A){
  console.log(`Turm-Prüfstand · Version ${G.VERSION} · Spiegel ${Object.keys(C.SPIEGEL).length} Werte · mittlere Abweichung ${(100 * A.rms).toFixed(0)} %`);
  console.log('A2 = Kraft je Gold (Stufe 1) ÷ Soll der Treppe (1 = im Ziel, inkl. A3); A1 = je Stufe 2–6 Ist ÷ Soll (1 = im Ziel)\n');
  for (const z of A.z) { console.log(z.el);
    for (const t of z.tuerme) console.log(`  ${t.name.padEnd(14)} A2 ${t.a2.toFixed(2)}${Math.abs(Math.log(t.a2)) > 0.1 ? ' ✗' : '  '}   A1 ${t.a1.slice(1).map(v => v.toFixed(2) + (Math.abs(Math.log(v)) > 0.1 ? '✗' : ' ')).join(' ')}`); }
}
// Anpassen: kraftT je Turm (A2/A3) und Upgrade-Faktoren je Element (A1, ELEMENTS[e].upDmg), einige Runden Fixpunkt-Iteration
function anpassen(){
  const sp = { ...C.SPIEGEL };
  const set = (p, v) => { sp[p] = +v.toFixed(4); S.anwenden(G, { [p]:sp[p] }); };
  const upOf = e => G.ELEMENTS[e].upDmg ? [...G.ELEMENTS[e].upDmg] : [...G.CONFIG.upgrade.steps];
  let T = tabelle(), A = auswerten(T); console.error(`Start: ${(100 * A.rms).toFixed(1)} %`);
  for (let runde = 0; runde < (+process.env.RUNDEN || 4); runde++) {
    for (let e = 0; e < 4; e++) {
      // A1: Upgrade-Faktoren je Element aus dem Median über die Türme (Stufe s braucht Faktor × Soll/Ist relativ zur Vorstufe)
      const up = upOf(e);
      for (let s = 1; s < 6; s++) {
        const q = A.z[e].tuerme.map(t => t.a1[s] / t.a1[s - 1]).filter(Number.isFinite).sort((a, b) => a - b), med = q[q.length >> 1];
        up[s - 1] = Math.max(1.05, up[s - 1] / Math.pow(med, 0.8));
      }
      // als ganzes Feld speichern (Elemente ohne eigenes upDmg in der Basis nutzen sonst CONFIG.upgrade.steps)
      Object.keys(sp).filter(p => p.startsWith(`ELEMENTS.${e}.upDmg.`)).forEach(p => delete sp[p]);
      sp[`ELEMENTS.${e}.upDmg`] = up.map(v => +v.toFixed(4)); G.ELEMENTS[e].upDmg = sp[`ELEMENTS.${e}.upDmg`];
      // A2/A3: kraftT je Turm (Turm 1 bleibt Anker)
      for (let k = 1; k < 8; k++) { const a = A.z[e].tuerme[k].a2; if (Number.isFinite(a) && a > 0) set(`ELEMENTS.${e}.kraftT.${k}`, Math.min(4, Math.max(0.25, G.ELEMENTS[e].kraftT[k] / Math.pow(a, 0.8)))); }
    }
    T = tabelle(); A = auswerten(T); console.error(`Runde ${runde + 1}: ${(100 * A.rms).toFixed(1)} %`);
  }
  sp._stand = `Turm-Prüfstand ${new Date().toISOString().slice(0, 16)}, Abweichung ${(100 * A.rms).toFixed(1)} %`;
  S.speichern(sp, path.join(__dirname, 'spiegel-A.json'));
  return A;
}
const arg = process.argv[2] || 'bericht';
if (arg === 'probe') { const [e, k, l] = process.argv.slice(3).map(Number), t0 = Date.now(); console.log(kjg(e, k, l).toFixed(4), ((Date.now() - t0) / 1000).toFixed(1) + ' s'); process.exit(0); }
const A = arg === 'anpassen' ? anpassen() : auswerten(tabelle());
drucken(A);
fs.mkdirSync(path.join(__dirname, 'ergebnisse'), { recursive:true });
fs.writeFileSync(path.join(__dirname, 'ergebnisse', `turm-${arg}${REAL ? '-real' : ''}.json`), JSON.stringify(A, null, 1));
