// Zweig D2 (L, 25.10.): Komplettversuch – alle 32 Türme als Grundturm + Merkmale, Schaden NUR aus den Wechselkursen (D1–D1c).
// Schaden/s = Standardturm (0,233 × Gold × 1,10^Turm, Upgrade-Kurve) ÷ Π Wert(Merkmal) × Design-Zuschlag (keine Fliegenden ×1,1, nur Fliegende ×1,5).
// Weg 2 (schwache Effekte, Wert ≈ 1,2–1,5) als Regel, Weg 1 (starker Effekt, wenig Schaden) als Ausnahme: Schwelbrand, Frosthauch, Erdbeben.
// Irrlicht bleibt vorerst ein normaler Fluch-Turm (Sonderturm folgt am Ende). Reichweite/Fläche in Feldern (neues Raster).
const fs = require('fs'), path = require('path'), S = require('../spiegel');
// Basis (27.10. abends): Standardtürme D6 (Preise bis 1000, Treppe ×1,08, Kurve 1/0,95/1,01/1,08/1,16/1,25, Reichweite 3,5 auf allen Stufen, Leben auf bezug3 kalibriert); BASIS=spiegel-D0.json = alte Preise
const D0 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', process.env.BASIS || 'spiegel-D6.json'))), sp = { ...D0 };
// ---- Wechselkurse ----
// D6 (27.10. abends, d/kurse6.js, Bezugs-Plan D6, alle Türme mit dem Merkmal, Stapelregel) – Standard; KURSE=D1 = alte Messungen D1b/D1c
const tab = P => x => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const [a, va] = P[i - 1], [b, vb] = P[i]; return va + (vb - va) * (x - a) / (b - a); }
  const [a, va] = P[P.length - 2], [b, vb] = P[P.length - 1]; return vb + (vb - va) / (b - a) * (x - b); };
const V_D6 = {
  reichweite: tab([[1.5, 0.49], [2, 0.64], [2.5, 0.90], [3, 0.96], [3.5, 1], [4, 1.03], [5, 1.08], [6, 1.11]]),
  geschosse: tab([[1, 1], [2, 0.87], [3, 0.76], [5, 0.53]]),
  rate: q => tab([[-2, 0.80], [-1, 1.03], [0, 1], [1, 0.96], [Math.log2(3), 0.93]])(Math.log2(q)),   // über log2(Rate)
  flaeche: tab([[0, 1], [0.5, 0.82], [1, 0.93], [1.5, 1.20], [2, 1.55]]),
  // Effekte OHNE Wachstum je Stufe (27.10. 21 Uhr, CONFIG.upgrade.eff/dur = 1): Brennen 8 % 3 s 1,16 · 15 % 3 s 1,29 · 30 % 6 s 1,97 · 5 % Tag 1,41
  brennen: (e, d) => 1 + e * (d === 'Tag' ? 8.1 : 1.94 * Math.pow(d / 3, 0.74)),
  fluch: e => 1 + 2.8 * e / (1 + 0.7 * e),                                       // 5 % 1,135 · 10 % 1,265 · 20 % 1,494
  // Bremsen: Einzelziel 10 % 2 s 1,004 · 20 % 2 s 1,02 · 40 % 4 s 1,20; mit Fläche 1: 10 % ×1,15 auf die Fläche. SLOW_K (Standard 1 = wie gemessen)
  bremsen: (s, fl) => { const k = +process.env.SLOW_K || 1, ein = tab([[0, 0], [0.1, 0.004], [0.2, 0.02], [0.4, 0.198]])(s); return 1 + k * (fl > 0 ? 1.48 * s : ein); },
  betaeuben: (c, t) => 1 + Math.max(0, c * t - 0.1),                            // 15 % 1 s 1,05 · 5 % 0,5 s 1,00
  // Nova (27.10. 22 Uhr): Wert hängt stark am Radius – alle Türme Nova, Rate ×0,25: Radius 2 0,60 · 2,5 1,13 · 3 1,49 · 3,5 1,87;
  // Rate: ×1/6 → ×0,78, ×0,5 → ×1,245 (gegenüber ×0,25). Betäuben in der Nova: Frostnova (45 % 2 s) ×1,47, Erdbeben (20 % 1 s) ×1,22 → 1 + 0,5 × √(Chance × Dauer)
  novaWert: (r, q) => tab([[2, 0.60], [2.5, 1.13], [3, 1.49], [3.5, 1.87]])(r) * tab([[Math.log2(1 / 6), 0.78], [-2, 1], [-1, 1.245]])(Math.log2(q)),
  novaStun: (c, t) => 1 + 0.5 * Math.sqrt(c * t),
  nova: 0.60, ruestung: a => 1 + 0.12 * a, nacht: 0.86,
};
const V_D1 = {
  reichweite: r => r < 3.5 ? Math.pow(r / 3.5, 0.3) : Math.pow(r / 3.5, 0.16),
  geschosse: n => Math.pow(n, -0.18),
  rate: q => Math.pow(q, -0.04),
  flaeche: tab([[0, 1], [0.5, 0.84], [1, 0.9], [1.5, 1.19], [2, 1.52]]),
  brennen: (e, d) => 1 + e * (d === 'Tag' ? 10.4 : 5 * Math.pow(d / 3, 0.42)),
  fluch: e => 1 + 5.8 * e / (1 + 2.2 * e),
  bremsen: (s, fl) => 1 + (+process.env.SLOW_K || 2) * (fl > 0 ? 9 * s / (1 + 2 * s) : 1.2 * s),
  betaeuben: (c, t, nova) => 1 + (nova ? 1.8 : 5.7) * c * Math.pow(t, 0.2),
  nova: 0.56, ruestung: a => 1 + 0.12 * a, nacht: 0.86,
};
const V = process.env.KURSE === 'D1' ? V_D1 : V_D6;
const LUFT = (process.env.LUFT || '0.6,1.8').split(',').map(Number);   // Luftspezialist Boden/Fliegende (L 26.10.: 60 % / 180 %)
// Stein und Fliegende (L 27.10.): 2 (schwach)/4/6/8 – Schleuder (T2) schwach gegen Fliegende (Boden 100 %, Fliegende SCHWACH),
// Katapult (T4, Namen wie vor dem 17.10.) und T6/T8 treffen Fliegende normal, T1/T3/T5/T7 gar nicht. Kein starker Fliegerturm bei Stein.
const SCHWACH = +(process.env.SCHWACH || 0.5);
const NOFLY_Z = +(process.env.NOFLY_Z || 1.1);
const SCHL_DEF = { r:3.5, n:2, f:0.5, luft:[1, SCHWACH] };
// ---- Türme: r Reichweite, q Rate, n Geschosse, f Fläche, eff/dur Effekt, nova, noFly, air ----
const T = {
  0: [ ['Funke', { r:3, eff:0.08, dur:3 }], ['Glutbecken', { r:2, q:0.8, n:2, eff:0.1, dur:4, noFly:1 }], ['Flammenwerfer', { r:1.5, q:3, eff:0.06, dur:2 }],
       ['Brandpfeil', { r:6, eff:0.08, dur:3 }]   /* L 26.10.: Luftspezialist wandert zu Schatten (Nachtauge) */, ['Schwelbrand', { r:4, q:0.5, eff:0.15, dur:'Tag' }], ['Lavaturm', { r:3.5, q:0.35, f:1.5, eff:0.08, dur:3, noFly:1 }],
       ['Sonnenturm', { r:5, q:0.6, n:2, eff:0.08, dur:4 }], ['Höllenfeuer', { r:4, q:0.5, f:2, eff:0.1, dur:'Tag' }] ],
  1: [ ['Frostsplitter', { r:3, eff:0.1, dur:2 }], ['Schneeball', { r:3, f:1, eff:0.05, dur:2 }], ['Eiszapfen', { r:5, eff:0.1, dur:2, luft:LUFT, slowFly:1 }],
       ['Frosthauch', { r:2.5, q:2, eff:0.3, dur:3 }], ['Frostnova', { r:2.5, q:1 / 6, nova:1, stun:[0.45, 2], noFly:1 }], ['Eisspeer', { r:6, q:0.5, eff:0.1, dur:2 }],
       ['Blizzard', { r:4, n:5, eff:0.05, dur:2 }], ['Ewiges Eis', { r:4, f:2, eff:0.1, dur:4, noFly:1 }] ],
  2: [ ['Schemen', { r:3, eff:0.05, dur:4 }], ['Irrlicht', { r:3, eff:0.05, dur:4 }], ['Nachtauge', { r:5, eff:0.05, dur:5, luft:LUFT }],
       ['Fluchstein', { r:3, q:0.5, n:3, eff:0.08, dur:8, noFly:1 }], ['Seelenfresser', { r:3, q:1.5, eff:0.04, dur:4 }], ['Phantom', { r:4, n:4, eff:0.05, dur:6 }],
       ['Leerenturm', { r:4, f:1.5, eff:0.06, dur:6 }], ['Ewige Nacht', { r:5, q:0.5, eff:0.1, dur:'Tag' }] ],
  3: [ ['Kiesel', { r:3, f:0.5, noFly:1 }], ['Schleuder', SCHL_DEF], ['Felsbrocken', { r:3, q:0.5, f:1.5, noFly:1 }],
       ['Katapult', { r:5, f:1 }], ['Erdbeben', { r:3, q:0.25, nova:1, stun:[0.2, 1], noFly:1 }], ['Granitwächter', { r:3, f:1 }],
       ['Lawine', { r:4, q:0.4, f:2, noFly:1 }], ['Bergkönig', { r:5, n:2, f:1, stun:[0.1, 1] }] ] };
const STEIN_K = +process.env.STEIN_K || 1;   // 27.10. abends (L): alte Korrektur aus (vorher 0,8)   // 26.10.: Korrektur aus dem Komplettversuch (Bodentage Stein 1,26 bei neutralem Flächenabfall)
const LUFT_ANTEIL = +process.env.LUFT_ANTEIL || 8 / 46;   // Fliegertage ÷ Tage ohne Bosse (8 von 46)
const EFF = { 0:'burn', 1:'slow', 2:'curse', 3:'stun' }, RUEST = { 0:0.5, 1:0.6, 2:0, 3:1.5 }, G0 = 2;   // GRID
const zeilen = [];
for (let e = 0; e < 4; e++) T[e].forEach(([name, m], k) => {
  const q = m.q || 1, n = m.n || 1, f = m.f || 0;
  let w = (m.nova && V.novaWert ? V.novaWert(m.r, q) * (m.stun ? V.novaStun(...m.stun) : 1) : V.reichweite(m.r) * V.geschosse(n) * V.rate(q) * (m.nova ? V.nova * (m.stun ? V.betaeuben(...m.stun, true) : 1) : V.flaeche(f))) * V.ruestung(RUEST[e]) * (e === 2 ? V.nacht : 1);   // Nova D6: eigener Kurs nach Radius und Rate (ohne Reichweiten-/Ratenkurs)
  if (m.eff) w *= e === 0 ? V.brennen(m.eff, m.dur) : e === 1 ? V.bremsen(m.eff, f) : V.fluch(m.eff);
  if (m.stun && !m.nova) w *= V.betaeuben(...m.stun, false);
  // Luftspezialist (L 26.10.): Boden × luft[0], Fliegende × luft[1]; Wert = geometrisches Mittel über die Tage (Fliegertage ≈ LUFT_ANTEIL)
  if (m.luft) w *= Math.exp((1 - LUFT_ANTEIL) * Math.log(m.luft[0]) + LUFT_ANTEIL * Math.log(m.luft[1]));
  const zuschlag = m.air ? 1.5 : m.noFly ? NOFLY_Z : 1;
  const opt = { effect:m.stun ? 'stun' : m.eff ? EFF[e] : 'none', fly:!m.noFly };
  if (m.air) opt.air = true; if (m.luft) { opt.groundMul = m.luft[0]; opt.flyMul = m.luft[1]; } if (m.slowFly) opt.slowFly = true; if (m.nova) opt.nova = true; if (m.stun) opt.chance = m.stun[0];
  const effWert = m.stun ? m.stun[1] : m.eff || 0, dur = m.stun ? 1 : m.dur || 1;
  sp[`ELEMENTS.${e}.towers.${k}`] = [name, 'Schaden', (m.nova ? m.r : m.r) / G0, q, n, 1, effWert, dur, (m.nova ? m.r : f) / G0, opt];
  const korr = e === 3 ? STEIN_K : 1;   // Stein: Fläche + Rüstungsschaden + Betäuben wirken im gemischten Aufbau stärker als einzeln gemessen (wie Bremsen)
  sp[`ELEMENTS.${e}.kraftT.${k}`] = +(D0[`ELEMENTS.${e}.kraftT.${k}`] * zuschlag * korr / w).toFixed(5);
  zeilen.push(`${name.padEnd(14)} Wert ${w.toFixed(2)} × Zuschlag ${zuschlag} → Schaden ×${(zuschlag / w).toFixed(2)}`);
});
for (let e = 0; e < 4; e++) { sp[`ELEMENTS.${e}.armorDmg`] = RUEST[e]; sp[`ELEMENTS.${e}.dayOnly`] = e === 2; }
sp['ELEMENTS.3.splashCenter'] = 1; sp['ELEMENTS.3.splashEdge'] = 0.7;   // Stein-Flächenabfall wie alle (Mitte 100 %, Rand 70 %); eigene Stein-Fläche ggf. später als Element-Spezifikation
sp._stand = `Zweig D2-Methode (L, 25.10.; 27.10. abends Basis ${process.env.BASIS || 'spiegel-D6.json'}, Kurse ${process.env.KURSE || 'D6'}, Stein 2s/4/6/8): 32 Türme aus Standardturm + Merkmale, Schaden nur aus Wechselkursen (d/d2.js); Monster wie Basis`;
S.speichern(sp, path.join(__dirname, '..', process.env.AUS || 'spiegel-D2.json'));
console.log(zeilen.join('\n'));
