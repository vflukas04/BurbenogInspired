// Zweig D6 (L 27.10. abends): Element-Vergleich der zusammengesetzten Türme (d/d2.js → spiegel-D6T.json).
// Fester Aufbau des Bezugs-Bots (Standardtürme, d/plaene/d6k/bezug3.json): jeder Turm wird durch den Turm gleicher Nummer und Stufe
// des Elements ersetzt (gleiches Feld). Wert = Reserve ÷ Reserve der Standardtürme (aus dem Plan), getrennt nach Boden- und Fliegertagen.
// Umgebung wie bots.js (ohne Wetter, neutrale Faktoren). Aufruf: STAPEL_ALLE=1 SPIEGEL=tools/balance/spiegel-D6T.json node tools/balance/d/elemente6.js
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C;
require('./bots');
const PLAN = JSON.parse(fs.readFileSync(path.resolve(process.env.PLAN || path.join(__dirname, 'plaene', 'd6k', 'bezug3.json'))));
const gm = a => a.length ? Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length) : NaN, NAME = ['Feuer', 'Eis', 'Schatten', 'Stein'];
// ABL (Ablation, 27.10.): Merkmal des geprüften Elements im Speicher abschalten (Schaden bleibt) – zeigt, welches Merkmal die Drift trägt:
// slow0 / curse0 / burn0 / stun0 (Effekt aus), splash0 (Fläche 0), armor0 (Rüstungsschaden 0), night0 (Nachtregel aus), nova0 (Nova → Einzelschuss)
function abl(e, a){ if (!a) return; const E = G.ELEMENTS[e];
  E.towers.forEach(r => { const o = r[9];
    if ({ slow0:'slow', curse0:'curse', burn0:'burn', stun0:'stun' }[a] === o.effect) { o.effect = 'none'; r[6] = 0; }
    if (a === 'splash0' && !o.nova) r[8] = 0; if (a === 'nova0' && o.nova) { o.nova = false; r[8] = 0; } });
  if (a === 'armor0') E.armorDmg = 0; if (a === 'night0') E.dayOnly = false; }
// IRRLICHT=1 (27.10. nachts): Schatten-T2 ist das echte Irrlicht (schießt nicht; Monster im Lichtkreis nehmen von Schatten-Türmen ×buff Schaden,
// pierce ihrer Rüstung zählt nicht; nachts sieht Schatten nachtaktive nur im Licht). BUFF_K: Faktor auf (buff − 1), LICHT: Radius in Feldern (Spiel 4,4),
// FEST=1: buff/pierce auf allen Stufen wie Stufe 1 (Standard-Regel „Upgrades ändern nur den Schaden“ – beim Irrlicht gibt es keinen Schaden)
if (process.env.IRRLICHT) { const k = +(process.env.BUFF_K || 1), b = [1.3, 1.4, 1.5, 1.6, 1.7, 1.8].map(x => +(1 + (x - 1) * k).toFixed(3)), p = [0.3, 0.45, 0.6, 0.75, 0.9, 1].map(x => +(x * +(process.env.PIERCE_K ?? 1)).toFixed(3));   // PIERCE_K: Faktor auf pierce
  G.ELEMENTS[2].towers[1] = ['Irrlicht', 'Licht', 1.8, 1, 1, 0, 0, 0, 0, { effect:'none', fly:true, light:(+(process.env.LICHT || 4.4)) / G.GRID,
    buff:process.env.FEST ? [b[0]] : b, pierce:process.env.FEST ? [p[0]] : p }]; }
// UMPLATZ=1 (28.10.): Element-Türme auf die besten Felder ihrer eigenen Reichweite (große Turmtypen zuerst) statt auf die Plätze des Standard-Plans
const UMPLATZ = !!process.env.UMPLATZ;
function umplatz(tw, e){ const used = new Set(), out = [];
  for (const t of [...tw].sort((a, b) => b.idx - a.idx || b.lvl - a.lvl)) { const c = C.mask(e, t.idx, t.lvl, 0).cells.find(c => !used.has(c.x + ',' + c.y));
    used.add(c.x + ',' + c.y); out.push({ ...t, el:e, x:c.x, y:c.y }); }
  return out; }
// Rüstung umverteilen (L 28.10.): RUEST=0 alle Rüstungen aus · RUEST_ADD=p,q (Prozent + p, Punkte + q als Anteil der Leben, auch für Monster ohne Rüstung)
// · RUEST_MUL=k (Prozent und Punkte × k). Das Verhältnis Element ÷ Standard hängt nicht von den Leben ab, die Leben müssen dafür nicht neu kalibriert werden.
const RT = (process.env.RUEST_TAGE || '1-48').split('-').map(Number), inRT = d => d + 1 >= RT[0] && d + 1 <= RT[1];   // RUEST_TAGE=1-12: nur diese Tage
if (process.env.RUEST === '0') G.MONSTERS.forEach((m, d) => { if (inRT(d)) delete m.ar; });
if (process.env.RUEST_ADD) { const [p, q] = process.env.RUEST_ADD.split(',').map(Number); G.MONSTERS.forEach((m, d) => { if (!inRT(d)) return; const a = m.ar || [0, 0]; m.ar = [Math.min(0.9, a[0] + p), a[1] + q]; }); }
// RUEST_BLOCK='p,q,k;p,q,k;…' (28.10.): je Block (Tag 1–12/13–24/25–36/37–48) Prozent + p, Punkte + q (Anteil der Leben), danach × k (Prozent und Punkte); leer = unverändert
if (process.env.RUEST_BLOCK) process.env.RUEST_BLOCK.split(';').forEach((b, i) => { if (!b) return; const [p = 0, q = 0, k = 1] = b.split(',').map(Number);
  G.MONSTERS.forEach((m, d) => { if (Math.min(3, Math.floor(d / 12)) !== i) return; const a = m.ar || [0, 0]; const n = [Math.min(0.9, (a[0] + p) * k), (a[1] + q) * k]; if (n[0] > 0 && n[1] > 0) m.ar = n; else delete m.ar; }); });
if (process.env.RUEST_MUL) { const k = +process.env.RUEST_MUL; G.MONSTERS.forEach((m, d) => { if (!inRT(d)) return; if (m.ar) m.ar = [Math.min(0.9, m.ar[0] * k), m.ar[1] * k]; }); }
// KRAFT_BLOCK='e:f1,f2,f3,f4;…' (28.10.): Schaden des Elements je Block × f (z. B. Wetter-Mittel je Block nachstellen); der Standard-Vergleich bleibt unverändert
const KB = {}; (process.env.KRAFT_BLOCK || '').split(';').filter(Boolean).forEach(x => { const [e, f] = x.split(':'); KB[+e] = f.split(',').map(Number); });
// NACHT='11:0,31:1' (28.10.): Nachtaktiv je Tag umstellen (Schatten-Drift über die Verteilung der Nächte)
(process.env.NACHT || '').split(',').filter(Boolean).forEach(x => { const [d, v] = x.split(':').map(Number); G.MONSTERS[d - 1].night = !!v; });
// MON='Spatzen.speed=1.2;Spatzen.ar=null;Nazgul.ar=[0.4,0.5]' (28.10.): Monster-Werte für die Messung überschreiben (JSON-Werte, null löscht)
(process.env.MON || '').split(';').filter(Boolean).forEach(x => { const [k, v] = x.split('='), i = k.lastIndexOf('.'), n = k.slice(0, i), f = k.slice(i + 1), m = G.MONSTERS.find(q => q.name === n);
  if (!m) throw new Error('Monster fehlt: ' + n); const w = JSON.parse(v); if (w === null) delete m[f]; else m[f] = w; });
// RES='elEL:1,dur:1' (31.10.): Forschung für die Element-Türme (EL = Element), Standard-Vergleich ohne
const RES = (process.env.RES || '').split(',').filter(Boolean);
// RNG_STEPS='0.25,0.5,0.75' (Reichweiten-Forschung in alten Feldern je Stufe) · AREA_MUL=1.3 (Fläche der Element-Türme × Wert, Vorschlag Forschung „Fläche größer“)
if (process.env.RNG_STEPS) G.RESEARCH_GROUPS.find(R => R.grp === 'rng').steps = process.env.RNG_STEPS.split(',').map(Number);
// RATE_MUL=1.3 (Forschung Schussgeschwindigkeit: mehr Schüsse/s bei gleichem Schaden je Schuss) · EFF_MUL=1.25 (Effekte stärker) · DUR_STEPS (Forschung Effektdauer je Stufe)
if (process.env.RATE_MUL) for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) { const k = +process.env.RATE_MUL; G.ELEMENTS[e].towers.forEach(r => { r[3] *= k; }); G.ELEMENTS[e].kraft = (G.ELEMENTS[e].kraft || 1) * k; }
if (process.env.EFF_MUL) for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) G.ELEMENTS[e].towers.forEach(r => { if (r[9].effect && r[9].effect !== 'none') { if (r[9].effect === 'stun') r[9].chance = (r[9].chance || 0) * +process.env.EFF_MUL; else r[6] *= +process.env.EFF_MUL; } });
if (process.env.DUR_STEPS) G.RESEARCH_GROUPS.find(R => R.grp === 'dur').steps = process.env.DUR_STEPS.split(',').map(Number);
if (process.env.AREA_MUL) for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) G.ELEMENTS[e].towers.forEach(r => { if (r[8] && !r[9].nova) r[8] *= +process.env.AREA_MUL; });
const t0 = Date.now(), tage = (process.env.TAGE || '1-48').split('-').map(Number);
// Mit UMPLATZ wird auch der Vergleich (Standardtürme) umgesetzt: Standard-Zeilen aus spiegel-D6.json kurz auf das Element legen
const D6 = UMPLATZ ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spiegel-D6.json'))) : null;
function standardR(e, towers, d){ const E = G.ELEMENTS[e], keep = { towers:E.towers, kraftT:E.kraftT, kraftBlock:E.kraftBlock, armorDmg:E.armorDmg, dayOnly:E.dayOnly, splashCenter:E.splashCenter, splashEdge:E.splashEdge };
  E.towers = E.towers.map((_, k) => JSON.parse(JSON.stringify(D6[`ELEMENTS.0.towers.${k}`]))); E.kraftT = E.kraftT.map((_, k) => D6[`ELEMENTS.0.kraftT.${k}`]);
  E.armorDmg = 0; E.dayOnly = false; E.splashCenter = undefined; E.splashEdge = undefined; E.kraftBlock = null; C.useMap(C.LANE, CUR_SEED);   // Maske neu (Reichweiten); Standard ohne kraftBlock
  const R = C.reserveDay({ el:e, towers:umplatz(towers, e), res:[] }, { type:d, players:2, weather:+(process.env.WETTER || 0) });
  Object.assign(E, keep); C.useMap(C.LANE, CUR_SEED); return R; }
let CUR_SEED = null;
// WETTER_REL=1 (mit MIT_WETTER=1, WETTER=i): Vergleich derselben Element-Türme mit und ohne dieses Wetter (Wirkung des Wetters je Element)
const WREL = !!process.env.WETTER_REL;
// WETTER_DEF='{"el":{"1":{"dmg":1.08}}}' (28.10.): Wetter WETTER für die Messung überschreiben (Entwurf)
if (process.env.WETTER_DEF) { const w = +(process.env.WETTER || 0); G.WEATHER[w] = { name:G.WEATHER[w].name, sym:G.WEATHER[w].sym, w:G.WEATHER[w].w, el:{}, ...JSON.parse(process.env.WETTER_DEF) }; }
// WIND=dx,dy,mitBoden,gegenBoden,mitFlug,gegenFlug (28.10.): Wind (Index 7) mit Richtung statt flySpeed, ohne Element-Wirkung
if (process.env.WIND) { const [dx, dy, a, b, c, d] = process.env.WIND.split(',').map(Number); G.WEATHER[7] = { ...G.WEATHER[7], el:{}, flySpeed:undefined, wind:{ dir:[dx, dy], ground:[a, b], fly:[c, d] } }; }
function ohneWetter(e, towers, d){ const w = +(process.env.WETTER || 0), W = G.WEATHER[w]; G.WEATHER[w] = { ...W, el:{}, burnDecay:undefined, range:undefined, flySpeed:undefined, wind:undefined };
  const R = C.reserveDay({ el:e, towers:UMPLATZ ? umplatz(towers, e) : towers.map(x => ({ ...x, el:e })), res:[] }, { type:d, players:2, weather:w }); G.WEATHER[w] = W; return R; }
for (const e of (process.env.EL || '0,1,2,3').split(',').map(Number)) { abl(e, process.env.ABL); const b = [], f = [], blk = [[], [], [], []];
  for (const mp of PLAN.maps) { C.useMap(mp.lane, mp.seed); CUR_SEED = mp.seed;
    mp.tage.forEach((t, d) => { if (d + 1 < tage[0] || d + 1 > tage[1]) return; const R0 = WREL ? ohneWetter(e, t.towers, d) : UMPLATZ ? standardR(e, t.towers, d) : t.R;
      const kb = KB[e] ? KB[e][Math.min(3, Math.floor(d / 12))] : 1, k0 = G.ELEMENTS[e].kraft; G.ELEMENTS[e].kraft = k0 * kb;
      const R = C.reserveDay({ el:e, towers:UMPLATZ ? umplatz(t.towers, e) : t.towers.map(x => ({ ...x, el:e })), res:RES.map(r => r.replace('EL', e)) }, { type:d, players:2, weather:+(process.env.WETTER || 0) }), q = R / R0; G.ELEMENTS[e].kraft = k0;   // WETTER=Index (mit MIT_WETTER=1)
      (G.MONSTERS[d].fly ? f : b).push(q); if (!G.MONSTERS[d].fly) blk[Math.min(3, Math.floor(d / 12))].push(q); }); }
  console.log(`${NAME[e].padEnd(9)}${process.env.ABL ? ' ohne ' + process.env.ABL : ''}${process.env.RUEST ? ' Rüstung ' + process.env.RUEST : ''}${process.env.RUEST_ADD ? ' Rüstung +' + process.env.RUEST_ADD : ''}${process.env.RUEST_MUL ? ' Rüstung ×' + process.env.RUEST_MUL : ''}${process.env.MIT_WETTER ? ' Wetter ' + G.WEATHER[+(process.env.WETTER || 0)].name : ''}${process.env.IRRLICHT ? ` Irrlicht (buff×${process.env.BUFF_K || 1}, Licht ${process.env.LICHT || 4.4}${process.env.FEST ? ', fest' : ''})` : ''} Boden ${gm(b).toFixed(3)} (Tag 1–12 ${gm(blk[0]).toFixed(2)} · 13–24 ${gm(blk[1]).toFixed(2)} · 25–36 ${gm(blk[2]).toFixed(2)} · 37–48 ${gm(blk[3]).toFixed(2)}) | Flieger ${gm(f).toFixed(3)} | ${Math.round((Date.now() - t0) / 1000)} s`); }
