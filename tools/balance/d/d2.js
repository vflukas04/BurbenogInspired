// Zweig D2 (L, 25.10.): Komplettversuch – alle 32 Türme als Grundturm + Merkmale, Schaden NUR aus den Wechselkursen (D1–D1c).
// Schaden/s = Standardturm (0,233 × Gold × 1,10^Turm, Upgrade-Kurve) ÷ Π Wert(Merkmal) × Design-Zuschlag (keine Fliegenden ×1,1, nur Fliegende ×1,5).
// Weg 2 (schwache Effekte, Wert ≈ 1,2–1,5) als Regel, Weg 1 (starker Effekt, wenig Schaden) als Ausnahme: Schwelbrand, Frosthauch, Erdbeben.
// Irrlicht bleibt vorerst ein normaler Fluch-Turm (Sonderturm folgt am Ende). Reichweite/Fläche in Feldern (neues Raster).
const fs = require('fs'), path = require('path'), S = require('../spiegel');
const D0 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spiegel-D0.json'))), sp = { ...D0 };
// ---- Wechselkurse (Messungen D1b/D1c, alle Türme der Map mit dem Merkmal, Stapelregel) ----
const V = {
  reichweite: r => r < 3.5 ? Math.pow(r / 3.5, 0.3) : Math.pow(r / 3.5, 0.16),
  geschosse: n => Math.pow(n, -0.18),
  rate: q => Math.pow(q, -0.04),
  flaeche: r => { const P = [[0, 1], [0.5, 0.84], [1, 0.9], [1.5, 1.19], [2, 1.52]]; if (r >= 2) return 1.52 + 0.66 * (r - 2);
    for (let i = 1; i < P.length; i++) if (r <= P[i][0]) { const [a, va] = P[i - 1], [b, vb] = P[i]; return va + (vb - va) * (r - a) / (b - a); } },
  brennen: (e, d) => 1 + e * (d === 'Tag' ? 10.4 : 5 * Math.pow(d / 3, 0.42)),
  fluch: e => 1 + 5.8 * e / (1 + 2.2 * e),
  bremsen: (s, fl) => 1 + (+process.env.SLOW_K || 2) * (fl > 0 ? 9 * s / (1 + 2 * s) : 1.2 * s),   // SLOW_K: Korrektur aus dem Komplettversuch
  betaeuben: (c, t, nova) => 1 + (nova ? 1.8 : 5.7) * c * Math.pow(t, 0.2),
  nova: 0.56, ruestung: a => 1 + 0.12 * a, nacht: 0.86,
};
const LUFT = (process.env.LUFT || '0.6,1.8').split(',').map(Number);   // Luftspezialist Boden/Fliegende (L 26.10.: 60 % / 180 %)
// ---- Türme: r Reichweite, q Rate, n Geschosse, f Fläche, eff/dur Effekt, nova, noFly, air ----
const T = {
  0: [ ['Funke', { r:3, eff:0.08, dur:3 }], ['Glutbecken', { r:2, q:0.8, n:2, eff:0.1, dur:4, noFly:1 }], ['Flammenwerfer', { r:1.5, q:3, eff:0.06, dur:2 }],
       ['Brandpfeil', { r:6, eff:0.08, dur:3, luft:LUFT }], ['Schwelbrand', { r:4, q:0.5, eff:0.15, dur:'Tag' }], ['Lavaturm', { r:3.5, q:0.35, f:1.5, eff:0.08, dur:3, noFly:1 }],
       ['Sonnenturm', { r:5, q:0.6, n:2, eff:0.08, dur:4 }], ['Höllenfeuer', { r:4, q:0.5, f:2, eff:0.1, dur:'Tag' }] ],
  1: [ ['Frostsplitter', { r:3, eff:0.1, dur:2 }], ['Schneeball', { r:3, f:1, eff:0.05, dur:2 }], ['Eiszapfen', { r:5, eff:0.1, dur:2, luft:LUFT, slowFly:1 }],
       ['Frosthauch', { r:2.5, q:2, eff:0.3, dur:3 }], ['Frostnova', { r:2.5, q:1 / 6, nova:1, stun:[0.45, 2], noFly:1 }], ['Eisspeer', { r:6, q:0.5, eff:0.1, dur:2 }],
       ['Blizzard', { r:4, n:5, eff:0.05, dur:2 }], ['Ewiges Eis', { r:4, f:2, eff:0.1, dur:4, noFly:1 }] ],
  2: [ ['Schemen', { r:3, eff:0.05, dur:4 }], ['Irrlicht', { r:3, eff:0.05, dur:4 }], ['Nachtauge', { r:5, eff:0.05, dur:5 }],
       ['Fluchstein', { r:3, q:0.5, n:3, eff:0.08, dur:8 }]   /* Vorschlag 26.10.: trifft Fliegende */, ['Seelenfresser', { r:3, q:1.5, eff:0.04, dur:4 }], ['Phantom', { r:4, n:4, eff:0.05, dur:6 }],
       ['Leerenturm', { r:4, f:1.5, eff:0.06, dur:6 }], ['Ewige Nacht', { r:5, q:0.5, eff:0.1, dur:'Tag' }] ],
  3: [ ['Kiesel', { r:3, f:0.5, noFly:1 }], ['Schleuder', { r:3.5, n:2, f:0.5, noFly:1 }], ['Katapult', { r:5, f:1 }],
       ['Felsbrocken', { r:3, q:0.5, f:1.5 }]   /* L 26.10.: Stein trifft Fliegende mit Turm 3/4/6/8 */, ['Erdbeben', { r:3, q:0.25, nova:1, stun:[0.2, 1], noFly:1 }], ['Granitwächter', { r:3, f:1 }],
       ['Lawine', { r:4, q:0.4, f:2, noFly:1 }], ['Bergkönig', { r:5, n:2, f:1, stun:[0.1, 1] }] ] };
const STEIN_K = +process.env.STEIN_K || 0.8;   // 26.10.: Korrektur aus dem Komplettversuch (Bodentage Stein 1,26 bei neutralem Flächenabfall)
const LUFT_ANTEIL = +process.env.LUFT_ANTEIL || 8 / 46;   // Fliegertage ÷ Tage ohne Bosse (8 von 46)
const EFF = { 0:'burn', 1:'slow', 2:'curse', 3:'stun' }, RUEST = { 0:0.5, 1:0.6, 2:0, 3:1.5 }, G0 = 2;   // GRID
const zeilen = [];
for (let e = 0; e < 4; e++) T[e].forEach(([name, m], k) => {
  const q = m.q || 1, n = m.n || 1, f = m.f || 0;
  let w = V.reichweite(m.r) * V.geschosse(n) * V.rate(q) * (m.nova ? V.nova * (m.stun ? V.betaeuben(...m.stun, true) : 1) : V.flaeche(f)) * V.ruestung(RUEST[e]) * (e === 2 ? V.nacht : 1);
  if (m.eff) w *= e === 0 ? V.brennen(m.eff, m.dur) : e === 1 ? V.bremsen(m.eff, f) : V.fluch(m.eff);
  if (m.stun && !m.nova) w *= V.betaeuben(...m.stun, false);
  // Luftspezialist (L 26.10.): Boden × luft[0], Fliegende × luft[1]; Wert = geometrisches Mittel über die Tage (Fliegertage ≈ LUFT_ANTEIL)
  if (m.luft) w *= Math.exp((1 - LUFT_ANTEIL) * Math.log(m.luft[0]) + LUFT_ANTEIL * Math.log(m.luft[1]));
  const zuschlag = m.air ? 1.5 : m.noFly ? 1.1 : 1;
  const opt = { effect:m.stun ? 'stun' : m.eff ? EFF[e] : 'none', fly:!m.noFly };
  if (m.air) opt.air = true; if (m.luft) { opt.groundHalf = true; opt.flyMul = m.luft[1]; } if (m.slowFly) opt.slowFly = true; if (m.nova) opt.nova = true; if (m.stun) opt.chance = m.stun[0];
  const effWert = m.stun ? m.stun[1] : m.eff || 0, dur = m.stun ? 1 : m.dur || 1;
  sp[`ELEMENTS.${e}.towers.${k}`] = [name, 'Schaden', (m.nova ? m.r : m.r) / G0, q, n, 1, effWert, dur, (m.nova ? m.r : f) / G0, opt];
  const korr = e === 3 ? STEIN_K : 1;   // Stein: Fläche + Rüstungsschaden + Betäuben wirken im gemischten Aufbau stärker als einzeln gemessen (wie Bremsen)
  sp[`ELEMENTS.${e}.kraftT.${k}`] = +(D0[`ELEMENTS.${e}.kraftT.${k}`] * zuschlag * korr / w).toFixed(5);
  zeilen.push(`${name.padEnd(14)} Wert ${w.toFixed(2)} × Zuschlag ${zuschlag} → Schaden ×${(zuschlag / w).toFixed(2)}`);
});
for (let e = 0; e < 4; e++) { sp[`ELEMENTS.${e}.armorDmg`] = RUEST[e]; sp[`ELEMENTS.${e}.dayOnly`] = e === 2; }
sp['ELEMENTS.3.splashCenter'] = 1; sp['ELEMENTS.3.splashEdge'] = 0.7;   // Stein-Flächenabfall wie alle (Mitte 100 %, Rand 70 %); eigene Stein-Fläche ggf. später als Element-Spezifikation
sp._stand = 'Zweig D2 (L, 25.10.): Komplettversuch – 32 Türme aus Grundturm + Merkmale, Schaden nur aus Wechselkursen (d/d2.js), Weg 2 als Regel; Monster wie D0';
S.speichern(sp, path.join(__dirname, '..', 'spiegel-D2.json'));
console.log(zeilen.join('\n'));
