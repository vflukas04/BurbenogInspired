// Zweig D2 (L, 25.10.): Komplettversuch – alle 32 Türme als Grundturm + Merkmale, Schaden NUR aus den Wechselkursen (D1–D1c).
// Schaden/s = Standardturm (0,233 × Gold × 1,10^Turm, Upgrade-Kurve) ÷ Π Wert(Merkmal) × Design-Zuschlag (keine Fliegenden ×1,1, nur Fliegende ×1,5).
// Weg 2 (schwache Effekte, Wert ≈ 1,2–1,5) als Regel, Weg 1 (starker Effekt, wenig Schaden) als Ausnahme: Schwelbrand, Frosthauch, Erdbeben.
// Irrlicht bleibt vorerst ein normaler Fluch-Turm (Sonderturm folgt am Ende). Reichweite/Fläche in Feldern (neues Raster).
const fs = require('fs'), path = require('path'), S = require('../spiegel');
// Basis (27.10. abends): Standardtürme D6 (Preise bis 1000, Treppe ×1,08, Kurve 1/0,95/1,01/1,08/1,16/1,25, Reichweite 3,5 auf allen Stufen, Leben auf bezug3 kalibriert); BASIS=spiegel-D0.json = alte Preise
const D0 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', process.env.BASIS || (process.env.D7 !== '0' ? 'spiegel-D7.json' : 'spiegel-D6.json')))), sp = { ...D0 };
// D7-Niveaus (28.10., d/fit1.js mit Platzwahl, mit Wetter-Mitteln in kraftBlock): Rüstungsschaden 3,6 (Stein 1,00), Bremsen 10,77, Brennen ×0,834 (Feuer/Eis fest 0,97), Fluch ×1,29
if (process.env.D7 !== '0') { process.env.RUEST_K ??= '3.6'; process.env.SLOW_K ??= process.env.D7_SLOW || '10.77'; process.env.NOFLY_Z ??= process.env.D7_NOFLY || '1.36'; }   // 28.10.: Feuer fest 0,97 (frei ≈ 1,03), Eis fest 0,94 (frei war 10 % über fest)

// ---- Wechselkurse ----
// D6 (27.10. abends, d/kurse6.js, Bezugs-Plan D6, alle Türme mit dem Merkmal, Stapelregel) – Standard; KURSE=D1 = alte Messungen D1b/D1c
const tab = P => x => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const [a, va] = P[i - 1], [b, vb] = P[i]; return va + (vb - va) * (x - a) / (b - a); }
  const [a, va] = P[P.length - 2], [b, vb] = P[P.length - 1]; return vb + (vb - va) / (b - a) * (x - b); };
const V_D6 = {
  // Reichweite mit Platzwahl (28.10. nachts, UMPLATZ=1: jeder Turm auf den besten Feldern seiner eigenen Reichweite); ohne Platzwahl war 1,5 → 0,49, 2 → 0,64, 6 → 1,11
  reichweite: tab([[1.5, 0.67], [2, 0.77], [2.5, 0.91], [3, 0.96], [3.5, 1], [4, 1.03], [5, 1.14], [6, 1.21]]),
  geschosse: tab([[1, 1], [2, 0.87], [3, 0.76], [5, 0.53]]),
  rate: q => tab([[-2, 0.80], [-1, 1.03], [0, 1], [1, 0.96], [Math.log2(3), 0.93]])(Math.log2(q)),   // über log2(Rate)
  flaeche: tab([[0, 1], [0.5, 0.82], [1, 0.93], [1.5, 1.20], [2, 1.55]]),
  // Effekte OHNE Wachstum je Stufe (27.10. 21 Uhr, CONFIG.upgrade.eff/dur = 1): Brennen 8 % 3 s 1,16 · 15 % 3 s 1,29 · 30 % 6 s 1,97 · 5 % Tag 1,41
  brennen: (e, d) => 1 + e * (d === 'Tag' ? 8.1 : 1.94 * Math.pow(d / 3, 0.74)),
  fluch: e => 1 + 2.8 * e / (1 + 0.7 * e),                                       // 5 % 1,135 · 10 % 1,265 · 20 % 1,494
  // Bremsen: Einzelziel 10 % 2 s 1,004 · 20 % 2 s 1,02 · 40 % 4 s 1,20; mit Fläche 1: 10 % ×1,15 auf die Fläche. SLOW_K (Standard 1 = wie gemessen)
  bremsen: (s, fl) => { const k = +process.env.SLOW_K || 9.47, ein = tab([[0, 0], [0.1, 0.004], [0.2, 0.02], [0.4, 0.198]])(s); return 1 + k * (fl > 0 ? 1.48 * s : ein); },
  betaeuben: (c, t) => 1 + Math.max(0, c * t - 0.1),                            // 15 % 1 s 1,05 · 5 % 0,5 s 1,00
  // Nova (27.10. 22 Uhr): Wert hängt stark am Radius – alle Türme Nova, Rate ×0,25: Radius 2 0,60 · 2,5 1,13 · 3 1,49 · 3,5 1,87;
  // Rate: ×1/6 → ×0,78, ×0,5 → ×1,245 (gegenüber ×0,25). Betäuben in der Nova: Frostnova (45 % 2 s) ×1,47, Erdbeben (20 % 1 s) ×1,22 → 1 + 0,5 × √(Chance × Dauer)
  // mit Platzwahl (28.10.): Radius 2 0,79 · 2,5 1,16 · 3 1,53 · 3,5 1,93; Rate ×1/6 → ×0,71, ×0,5 → ×1,26; Betäuben Frostnova ×1,51, Erdbeben ×1,26
  novaWert: (r, q) => tab([[2, 0.79], [2.5, 1.16], [3, 1.53], [3.5, 1.93]])(r) * tab([[Math.log2(1 / 6), 0.71], [-2, 1], [-1, 1.26]])(Math.log2(q)),
  novaStun: (c, t) => 1 + 0.53 * Math.sqrt(c * t),
  nova: 0.60, ruestung: a => 1 + (+process.env.RUEST_K || 2.97) * 0.12 * a, nacht: 0.86,   // RUEST_K: Rüstungsschaden im Verbund des eigenen Elements (27.10.)
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
// SENS=name:k (27.10., Empfindlichkeit): Merkmalswert (V − 1) des Kurses name mit k multiplizieren, z. B. SENS=fluch:1.1
// Verbund-/Element-Kurse (28.10. nachts, mit Platzwahl, d/verbund.js und d/fit1.js): Brennen ×0,59, Fluch ×1,29 auf (Wert − 1); RUEST_K 2,97, SLOW_K 9,47 (Standard unten)
const SENS = process.env.SENS ?? (process.env.KURSE === 'D1' ? '' : process.env.D7 !== '0' ? 'brennen:1.08,fluch:1.29,nacht:0.687' : 'brennen:0.59,fluch:1.29');
if (SENS) for (const t of SENS.split(',')) { const [n, k] = t.split(':'); const o = V[n];
  V[n] = typeof o === 'function' ? (...a) => 1 + (o(...a) - 1) * +k : 1 + (o - 1) * +k; }
const LUFT = (process.env.LUFT || (process.env.D7 !== '0' ? '0.8,1.2' : '0.6,1.8'))   /* 29.10. (L): Luftspezialist Boden 80 %, Fliegende 120 % */.split(',').map(Number);   // Luftspezialist Boden/Fliegende (L 26.10.: 60 % / 180 %)
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
// AENDERN (28.10., Experimente): 'e.k.feld=wert;…' ändert Turm-Merkmale vor dem Zusammensetzen, z. B. '1.0.r=2;2.0.r=2' (Eis- und Schatten-T1 Reichweite 2)
if (process.env.AENDERN) for (const a of process.env.AENDERN.split(';').filter(Boolean)) { const [ek, v] = a.split('='), [e, k, f] = ek.split('.'); T[+e][+k][1] = { ...T[+e][+k][1], [f]:(() => { try { return JSON.parse(v); } catch (x) { return v; } })() }; }
const STEIN_K = +process.env.STEIN_K || 1;   // 27.10. abends (L): alte Korrektur aus (vorher 0,8)   // 26.10.: Korrektur aus dem Komplettversuch (Bodentage Stein 1,26 bei neutralem Flächenabfall)
const LUFT_ANTEIL = +process.env.LUFT_ANTEIL || 8 / 46;   // Fliegertage ÷ Tage ohne Bosse (8 von 46)
const D7 = process.env.D7 !== '0', D7_RUEST = {"Silberfische":[0.3,0.3],"Kellerasseln":[0.5,0.6],"Nacktschnecken":[0.3,0.3],"Ohrenkneifer":[0.45,0.6],"Mäuse":[0.3,0.3],"Maus-Boss":[0.3,0.3],"Kleine Hunde":[0.4,0.5],"Ratten":[0.45,0.6],"Katzen":[0.4,0.5],"Füchse":[0.5,0.7],"Fuchs-Boss":[0.5,0.7]};   // Rüstung Tag 1–12 (D6 + 30 % / + 0,3)
const EFF = { 0:'burn', 1:'slow', 2:'curse', 3:'stun' }, RUEST = Object.assign({}, (process.env.RUEST_EL || '0.5,0.6,0,1.5').split(',').map(Number))   /* RUEST_EL (28.10.): Rüstungsschaden je Element */, G0 = 2;   // GRID
// Stein-Drift (29.10. nachmittags, L): Kiesel schwach gegen Fliegende statt „keine Fliegenden“ (kein Zuschlag mehr am Anfang), Bergkönig stärker betäubend (driftet nach hinten), Granitwächter keine Fliegenden
if (D7 && process.env.STEIN_D7 !== '0') { T[3][0][1] = { ...T[3][0][1], noFly:0, luft:[1, SCHWACH] }; T[3][5][1] = { ...T[3][5][1], noFly:1 }; T[3][1][1] = { ...T[3][1][1], noFly:1, luft:undefined }; T[3][2][1] = { ...T[3][2][1], noFly:0 };   /* L 19:16: Schleuder keine Fliegenden, Felsbrocken normal gegen Fliegende (früher Luftschutz für 70) */ T[3][7][1] = { ...T[3][7][1], stun:[0.35, 1] }; }   // L 16:30: Betäubung nur auf einem Turm (Bergkönig 35 %), dafür Granitwächter keine Fliegenden (Stein-Gefühl; Zuschlag hinten)
const zeilen = [];
for (let e = 0; e < 4; e++) T[e].forEach(([name, m], k) => {
  const q = m.q || 1, n = m.n || 1, f = m.f || 0;
  let w = (m.nova && V.novaWert ? V.novaWert(m.r, q) * (m.stun ? V.novaStun(...m.stun) : 1) : V.reichweite(m.r) * V.geschosse(n) * V.rate(q) * (m.nova ? V.nova * (m.stun ? V.betaeuben(...m.stun, true) : 1) : V.flaeche(f))) * V.ruestung(RUEST[e]) * (e === 2 ? V.nacht : 1);   // Nova D6: eigener Kurs nach Radius und Rate (ohne Reichweiten-/Ratenkurs)
  if (m.nova) w *= +(process.env.NOVA_K || (D7 ? 1.2 : 1));   // 29.10.: Nova als einzelner Turmtyp im gemischten Aufbau mehr wert als gemessen (freier Bau: Frostnova trägt 23 % von Eis, Erdbeben 15 % von Stein)
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
// D7 (L 28.10., Drift-Form, Variante N in ZWEIG-D.md; D7=0 schaltet ab): Rüstung Tag 1–12 +30 % / +0,3 Punkte, Füchse tagaktiv, Krieger nachtaktiv,
// Stapelanteil Brennen 0,35 / Bremsen 0,15 / Fluch 0,1, Wetter-Mittel als kraftBlock (je 5 Runden): Feuer −6 % (Runde 1–10), +6 % (21–30); Eis +4 % (1–10), −3 % (31–40)
if (D7) { Object.entries(D7_RUEST).forEach(([n, a]) => { sp[`MONSTERS.${n}.ar`] = a; }); sp['MONSTERS.Füchse.night'] = false; sp['MONSTERS.Krieger.night'] = true; // Fliegende (L 28.10. spät): Tempo meist wie am Boden, einzelne sehr schnell/langsam; drei gepanzert; Looping-Louie mit Tiefflug (⅓ des Wegs tief, Übergänge ohne Malus)
  Object.entries({ 'Spatzen':1.2, 'Habichte':1.6, 'Uffug-Vorhaut':0.8, 'Phönixe':1.1, 'Looping-Louie-Flugzeuge':1.7, 'Fledermäuse':1.0, 'Nazgul':0.9 }).forEach(([n, v]) => { sp[`MONSTERS.${n}.speed`] = v; });
  sp['MONSTERS.Spatzen.ar'] = null; sp['MONSTERS.Uffug-Vorhaut.ar'] = [0.35, 0.5]; sp['MONSTERS.Looping-Louie-Flugzeuge.ar'] = [0.4, 0.5]; sp['MONSTERS.Nazgul.ar'] = [0.45, 0.6];
  sp['MONSTERS.Looping-Louie-Flugzeuge.lowFly'] = { low:[[0.18, 0.34], [0.55, 0.72]], mid:0.04 };
  sp['MONSTERS.Eifersüchtige Geliebte.night'] = false; sp['MONSTERS.Lindner-Spezialisten.night'] = true;   // 2. Tausch (L 28.10. abends)
  sp['ELEMENTS.3.weatherproof'] = true; sp['ELEMENTS.3.terrainFree'] = true;   // Stein wetterfest + Baubonus (L)
  // Wetter D7 (28.10. nachmittags): eigene Noten, je Wetter höchstens ±10 % je Element (gemessen mit WETTER_REL), Gewichte je Block wB (Tag 1–12 Winter, 13–24 Frühling, 25–36 Sommer, 37–48 Herbst).
  // kraftBlock = gewichtetes Mittel des Wetters je Block (Tests laufen ohne Wetter, das Mittel steht dafür in kraftBlock; im Spiel wirkt das echte Wetter)
  const WD7 = [
    { name:'Sonnig',   sym:'☀', w:3,   wB:[0.04, 0.04, 0.29, 0.11], el:{ 0:{ dmg:1.075, eff:1.05 }, 2:{ dmg:0.96 } } },
    { name:'Bewölkt',  sym:'☁', w:3,   wB:[0.04, 0.22, 0.14, 0.04], el:{ 2:{ dmg:1.07 } } },
    { name:'Regen',    sym:'☂', w:2,   wB:[0.35, 0.33, 0.06, 0.04], el:{ 0:{ dur:0.8 }, 1:{ eff:1.15, dmg:1.045 } } },
    { name:'Gewitter', sym:'ϟ', w:1,   wB:[0.10, 0.04, 0.04, 0.07], el:{ 0:{ dur:0.8 }, 2:{ dmg:1.06 } }, flySpeed:0.96 },
    { name:'Nebel',    sym:'≡', w:1.5, wB:[0.04, 0.04, 0.04, 0.35], el:{ 2:{ dmg:1.08 } }, range:0.92 },
    { name:'Frost',    sym:'❄', w:1,   wB:[0.35, 0.04, 0.04, 0.04], el:{ 0:{ dmg:0.92 }, 1:{ eff:1.15, dur:1.2, dmg:1.05 } } },
    { name:'Hitze',    sym:'♨', w:1,   wB:[0.04, 0.25, 0.35, 0.17], el:{ 0:{ dmg:1.08, eff:1.1 }, 1:{ dur:0.8, dmg:0.98 } } },
    { name:'Wind',     sym:'≋', w:1.5, wB:[0.04, 0.04, 0.04, 0.18], el:{ 0:{ eff:1.1 } }, wind:{ ground:[0.05, 0.07], fly:[0.08, 0.1] } } ];   // Wind: Richtung je Tag (Spiel), Tempo × (1 + mit·cos) bzw. (1 − gegen·|cos|)
  WD7.forEach((w, k) => { sp[`WEATHER.${k}`] = w; });
  sp['ELEMENTS.0.kraftBlock'] = [0.971, 0.971, 1.018, 1.018, 1.053, 1.053, 1.02, 1.02]; sp['ELEMENTS.1.kraftBlock'] = [1.049, 1.049, 1.017, 1.017, 0.996, 0.996, 0.989, 0.989];
  sp['ELEMENTS.2.kraftBlock'] = [1.009, 1.009, 1.018, 1.018, 1.003, 1.003, 1.021, 1.021]; sp['ELEMENTS.3.kraftBlock'] = null; }
// Irrlicht (29.10., L: echter Lichtturm, etwas günstiger, kleinerer Effekt): T2 Schatten schießt nicht; Schatten-Türme treffen Monster in seinem Lichtkreis
// (2 Felder) mit ×buff (S1 1,10 … S6 1,20) und sehen dort nachtaktive Monster; keine Rüstung ignorieren. Preis 30. IRRLICHT_D7=0 = alter Fluchturm.
if (D7 && process.env.IRRLICHT_D7 !== '0') { const L = +(process.env.IRR_LICHT || 2), b0 = +(process.env.IRR_BUFF || 0.05), b6 = +(process.env.IRR_BUFF6 || 0.15);
  sp['ELEMENTS.2.towers.1'] = ['Irrlicht', 'Licht', L / G0, 1, 1, 0, 0, 0, 0, { effect:'none', fly:true, light:L / G0, buff:[0, 1, 2, 3, 4, 5].map(i => +(1 + b0 + (b6 - b0) * i / 5).toFixed(3)), pierce:[0, 0, 0, 0, 0, 0] }];
  sp['ELEMENTS.2.costOverride'] = { ...(sp['ELEMENTS.2.costOverride'] || {}), 1:+(process.env.IRR_PREIS || 30) }; }
sp['CONFIG.stackRest'] = Object.fromEntries(['burn', 'slow', 'curse'].map((k, i) => [k, +((process.env.STAPEL_EL || (D7 ? '0.35,0.05,0.05' : '0.2,0.2,0.2')).split(',')[i])]));   // 28.10.: Stapelanteil je Effekt (Brennen, Bremsen, Fluch)
sp['CONFIG.burnArmor'] = +(process.env.BRENN_RUEST ?? 0);   // 28.10.: Option Brennen durch Rüstung mindern – gemessen unnötig (Feuer hängt über den Rüstungsschaden an der Rüstung, nicht über das Brennen)
sp['ELEMENTS.3.splashCenter'] = 1; sp['ELEMENTS.3.splashEdge'] = 0.7;   // Stein-Flächenabfall wie alle (Mitte 100 %, Rand 70 %); eigene Stein-Fläche ggf. später als Element-Spezifikation
sp._stand = `Zweig D2-Methode (L, 25.10.; 27.10. abends Basis ${process.env.BASIS || 'spiegel-D6.json'}, Kurse ${process.env.KURSE || 'D6'}, Stein 2s/4/6/8): 32 Türme aus Standardturm + Merkmale, Schaden nur aus Wechselkursen (d/d2.js); Monster wie Basis`;
S.speichern(sp, path.join(__dirname, '..', process.env.AUS || 'spiegel-D2.json'));
console.log(zeilen.join('\n'));
