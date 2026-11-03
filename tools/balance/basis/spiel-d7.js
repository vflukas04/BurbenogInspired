// Zweig D7 (L 01.11.): Spielregeln für die Testseite spiegel-d.html, die über Zahlen im Spiegel hinausgehen.
// Wird nur von spiegel-seite.js angewandt (SPIEL_D7=1), nach basis/patch.js. Messwerkzeuge (bots.js, elemente6.js) bleiben unberührt.
// Inhalt: Wetter nach Jahreszeit (WEATHER[k].wB je Block), Wind aus einer Richtung je Tag, Forschung neu (Preise je Spieler,
// Effekt-Leiter, Reichweite in Feldern, Schussgeschwindigkeit, Freischaltung 60/175), 2 % Zinsen je Tag auf die Kasse,
// Edelstein mit nur einem Basic, Schaden/s ohne Aufrunden.
const R = [];
// 1) Schaden/s ohne Aufrunden (wie in allen Messungen von Zweig D)
R.push([`const ceil1 = v => typeof process === 'object' && process.env && process.env.D_GENAU === '1' ? v : Math.ceil(v * 10 - 1e-6) / 10;`,
  `const ceil1 = v => v;   /* Zweig D7: ohne Aufrunden */`]);
// 2) Wetter nach Jahreszeit: Gewicht je Block (Tag 1–12 Winter, 13–24 Frühling, 25–36 Sommer, 37–48 Herbst)
R.push([`function pickWeather(r){ const tot = WEATHER.reduce((a,w) => a + w.w, 0); let x = r() * tot; for (let k = 0; k < WEATHER.length; k++) { x -= WEATHER[k].w; if (x < 0) return k; } return 0; }`,
  `function pickWeather(r, day){ const b = Math.min(3, Math.floor(((day || 1) - 1) / 12)), wt = w => w.wB ? w.wB[b] : w.w;   /* Zweig D7: Jahreszeiten */
  const tot = WEATHER.reduce((a,w) => a + wt(w), 0); let x = r() * tot; for (let k = 0; k < WEATHER.length; k++) { x -= wt(WEATHER[k]); if (x < 0) return k; } return 0; }
/* Zweig D7: Windrichtung je Tag aus dem Seed (8 Richtungen); dir = Richtung, in die der Wind weht (Bildschirm: x rechts, y unten) */
function windDirOf(g, day){ const r = rng(Math.floor(((g && g.cfg.startAt) || 1) / 1000) * 7 + day * 4271 + 13), a = Math.floor(r() * 8) * Math.PI / 4;
  return [+Math.cos(a).toFixed(3), +Math.sin(a).toFixed(3)]; }
const WIND_AUS = d => ['Westen', 'Nordwesten', 'Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten'][((Math.round(Math.atan2(d[1], d[0]) / (Math.PI / 4)) % 8) + 8) % 8];`],
  [`const r = rng(Math.floor((g.cfg.startAt || 1) / 1000) + day * 7919), out = [pickWeather(r)];`,
   `const r = rng(Math.floor((g.cfg.startAt || 1) / 1000) + day * 7919), out = [pickWeather(r, day)];`],
  [`out.push(r() < CONFIG.weatherChange ? pickWeather(r) : out[k-1]);`,
   `out.push(r() < CONFIG.weatherChange ? pickWeather(r, day) : out[k-1]);`],
  [`  if (W.flySpeed) p.push('Fliegende ' + (W.flySpeed > 1 ? 'schneller' : 'langsamer'));`,
   `  if (W.flySpeed) p.push('Fliegende ' + (W.flySpeed > 1 ? 'schneller' : 'langsamer'));
  if (W.wind) p.push((typeof G === 'object' && G ? 'Wind aus ' + WIND_AUS(windDirOf(G, Math.min(G.day, CONFIG.days))) + ': ' : 'Wind: ') + 'Monster mit dem Wind schneller, gegen den Wind langsamer (Fliegende stärker)');`],
  [`dark:isDark(SL[g.slot]), weather,`, `dark:isDark(SL[g.slot]), weather, wind:windDirOf(g, g.day),`],
  [`  const W = WEATHER[wIdx];`,
   `  const W0 = WEATHER[wIdx], W = W0.wind ? { ...W0, wind:{ ...W0.wind, dir:inp.wind || W0.wind.dir || [1, 0] } } : W0;   /* Zweig D7: Windrichtung des Tages */
  FX_STACK_NOW = resLvl(new Set(inp.res || []), 'fx') >= 3 ? FX_STACK : null;`]);
// 3) Forschung neu (Preise ×2, je Spieler; Element-Schaden fest, weil er nur einem Spieler hilft)
R.push([/const RESEARCH_GROUPS = \[[\s\S]*?\n\];\n/, `const RESEARCH_GROUPS = [   /* Zweig D7 (L 01.11.): pp = Preis × Spielerzahl */
  { grp:'t5',    house:'Bauhütte',     name:'Türme 5–6 freischalten', costs:[60], pp:true },
  { grp:'t7',    house:'Bauhütte',     name:'Türme 7–8 freischalten', costs:[175], need:'t5:1', pp:true },
  { grp:'cheap', house:'Bauhütte',     name:'Upgrades billiger',      costs:[40, 80, 130],  steps:[0.07, 0.14, 0.2],  fmt:v => '−' + Math.round(v*100) + ' %', pp:true },
  { grp:'el0',   house:'Elementlabor', name:'Feuer Schaden',          costs:[80, 180, 360], steps:[0.08, 0.16, 0.25], fmt:v => '+' + Math.round(v*100) + ' %', el:0 },
  { grp:'el1',   house:'Elementlabor', name:'Eis Schaden',            costs:[80, 180, 360], steps:[0.08, 0.16, 0.25], fmt:v => '+' + Math.round(v*100) + ' %', el:1 },
  { grp:'el2',   house:'Elementlabor', name:'Schatten Schaden',       costs:[80, 180, 360], steps:[0.08, 0.16, 0.25], fmt:v => '+' + Math.round(v*100) + ' %', el:2 },
  { grp:'el3',   house:'Elementlabor', name:'Stein Schaden',          costs:[80, 180, 360], steps:[0.08, 0.16, 0.25], fmt:v => '+' + Math.round(v*100) + ' %', el:3 },
  { grp:'fx',    house:'Akademie',     name:'Effekte',                costs:[20, 70, 130],  steps:[1, 2, 3], fmt:v => ['Dauer +50 % (Stein: Betäubung)', '+ Stärke +25 % (Stein: Fläche 105/68 %)', '+ Stapeln +10 % (Stein: Betäubung +5 %)'][v-1], pp:true },
  { grp:'rng',   house:'Akademie',     name:'Reichweite',             costs:[40, 80, 160],  steps:[0.25, 0.5, 0.75], fmt:v => '+' + String(v * GRID_D).replace('.', ',') + ' Felder', pp:true },
  { grp:'rate',  house:'Akademie',     name:'Schussgeschwindigkeit',  costs:[170, 360, 640], steps:[0.1, 0.2, 0.3], fmt:v => '+' + Math.round(v*100) + ' %', pp:true },
  { grp:'gold',  house:'Akademie',     name:'Kopfgeld',               costs:[60, 100, 140], steps:[0.07, 0.14, 0.2],  fmt:v => '+' + Math.round(v*100) + ' %', pp:true }
];
const GRID_D = 2, POT_INTEREST = 0.02;   /* Zweig D7: Raster (wie GRID, hier schon gebraucht); Zinsen der Kasse je Tag */
const FX_STACK = { burn:0.1, slow:0.1, curse:0.1 }; let FX_STACK_NOW = null;   /* Effekt-Forschung Stufe 3: Stapelanteil + Wert */
`],
  [`house:R.house, cost,`, `house:R.house, get cost(){ return cost * (R.pp && typeof G === 'object' && G && G.cfg ? G.cfg.players : 1); },`]);
// Forschung anwenden (gemessen in d/elemente6.js: RES, DUR_MUL, EFF_MUL, STACK_ADD, SPLASH3, STUN_DUR_MUL, STUN_ADD, RATE_MUL, RNG_STEPS)
R.push([`    if (d.dur !== DAY) d.dur *= 1 + resVal(res, 'dur');`,
  `    const fxL = resLvl(res, 'fx'), q = 1 + resVal(res, 'rate');   /* Zweig D7 */
    if (q > 1) { d.rate *= q; d.dpsNow *= q; }
    if (fxL && d.effect && d.effect !== 'none') {
      if (d.effect === 'stun') { if (def.el === 3) { d.eff = Math.min(CONFIG.stunMax, d.eff * 1.5); if (fxL >= 3) d.chance = (d.chance || 0) + 0.05; } else if (fxL >= 2) d.chance = (d.chance || 0) * 1.25; }
      else { if (d.dur !== DAY) d.dur *= 1.5; if (fxL >= 2) d.eff *= 1.25; } }
    if (fxL >= 2 && def.el === 3) { d.splashC = 1.05; d.splashE = 0.68; }`],
  [`c = E.splashCenter || 1, e = E.splashEdge ?? CONFIG.splashEdge;`, `c = def.splashC || E.splashCenter || 1, e = def.splashE ?? E.splashEdge ?? CONFIG.splashEdge;`],
  [`const R = c.kind && CONFIG.stackRest && CONFIG.stackRest[c.kind] !== undefined ? CONFIG.stackRest[c.kind] : BURN_REST;`,
   `const R = (c.kind && CONFIG.stackRest && CONFIG.stackRest[c.kind] !== undefined ? CONFIG.stackRest[c.kind] : BURN_REST) + (FX_STACK_NOW && c.kind ? FX_STACK_NOW[c.kind] || 0 : 0);`]);
// 4) Kasse mit 2 % Zinsen je Tag: Einzahlungen und Forschungskäufe mit Tag gespeichert (potLog = [{d, a}] – Firestore erlaubt keine Listen in Listen –, resDay), Stand wird nachgerechnet
R.push([`function potOf(){ const lanes = L.map((_,k) => laneOf(k)), r = researchSet(lanes);
  return lanes.reduce((a,l) => a + (l.pot || 0), 0) - [...r].reduce((a,id) => a + (RESEARCH.find(x => x.id === id) || {cost:0}).cost, 0); }`,
  `function potOf(){ const lanes = L.map((_,k) => laneOf(k)), r = researchSet(lanes), ev = [], rd = {};   /* Zweig D7: Zinsen */
  lanes.forEach(l => { if (!l) return; let sum = 0; (l.potLog || []).forEach(({ d, a }) => { ev.push([d, a]); sum += a; }); if ((l.pot || 0) > sum) ev.push([1, (l.pot || 0) - sum]); Object.assign(rd, l.resDay || {}); });
  [...r].forEach(id => { const X = RESEARCH.find(x => x.id === id); if (X) ev.push([rd[id] || 1, -X.cost]); });
  ev.sort((a, b) => a[0] - b[0] || b[1] - a[1]); const now = G ? Math.min(G.day, CONFIG.days) : 1; let bal = 0, last = 1;
  for (const [d, a] of ev) { if (d > last) { bal *= Math.pow(1 + POT_INTEREST, d - last); last = d; } bal += a; }
  return Math.floor(bal * Math.pow(1 + POT_INTEREST, Math.max(0, now - last)) + 1e-6); }`],
  [`const l = laneOf(i); L[i] = { ...l, pot:(l.pot || 0) + amt };`,
   `const l = laneOf(i); L[i] = { ...l, pot:(l.pot || 0) + amt, potLog:[...(l.potLog || []), { d:Math.min(G.day, CONFIG.days), a:amt }] };`],
  [`const l = laneOf(i); L[i] = { ...l, research:[...(l.research || []), id] };`,
   `const l = laneOf(i); L[i] = { ...l, research:[...(l.research || []), id], resDay:{ ...(l.resDay || {}), [id]:Math.min(G.day, CONFIG.days) } };`],
  [`<span class="muted">Einzahlen (ohne Gebühr):</span>`, `<span class="muted">Einzahlen (ohne Gebühr, 2 % Zinsen je Tag):</span>`]);
// 5) Edelstein (L 01.11.): nur noch ein Basic (Schaden +30 %, Irrlicht: Lichtkreis +30 %) plus die beiden Uniques = 3 Optionen.
//    Das zweite Basic (Reichweite/Effekt/Fläche +30 %) war gemessen nur ≈ ×1,05–1,13 wert und damit klar schwächer als Schaden +30 %.
R.push([`const gemOptions = (el, idx) => [...BASIC_BY_ROLE[ELEMENTS[el].towers[idx][1]], uniqOf(el, idx), 8 + idx];`,
  `const gemOptions = (el, idx) => [BASIC_BY_ROLE[ELEMENTS[el].towers[idx][1]][0], uniqOf(el, idx), 8 + idx];   /* Zweig D7: ein Basic */`]);
// 6) Windhose (L 02.11.): bei Wind neben dem Wettersymbol eine rot-weiße Windhose, die in die Windrichtung des Tages zeigt und flattert (nur Anzeige)
R.push(["  c.fillStyle = '#fff'; c.font = `${r*.62}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(Wx.sym, x + r/2, y + r/2 + 1);",
  "  c.fillStyle = '#fff'; c.font = `${r*.62}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(Wx.sym, x + r/2, y + r/2 + 1);" + `
  if (Wx.wind) { const inp = replay && replay.run && replay.run.inputs[i], dir = (inp && inp.wind) || (G ? windDirOf(G, Math.min(G.day, CONFIG.days)) : [1, 0]), t = time || 0;   /* Zweig D7: Windhose */
    const bx = x - r * 1.15, L = r * .62, a = Math.atan2(dir[1], dir[0]) + Math.sin(t * 5) * .1;
    c.fillStyle = '#000a'; c.beginPath(); c.roundRect(bx, y, r, r, r * .25); c.fill();
    c.save(); c.translate(bx + r / 2 - Math.cos(a) * L * .5, y + r / 2 - Math.sin(a) * L * .5);
    c.fillStyle = '#cfcfcf'; c.beginPath(); c.arc(0, 0, r * .07, 0, 7); c.fill(); c.rotate(a);
    for (let k = 0; k < 4; k++) { const x0 = k * L / 4, x1 = (k + 1) * L / 4, h0 = r * .17 * (1 - k * .15), h1 = r * .17 * (1 - (k + 1) * .15), w0 = Math.sin(t * 9 - k * 1.3) * r * .02 * k, w1 = Math.sin(t * 9 - (k + 1) * 1.3) * r * .02 * (k + 1);
      c.fillStyle = k % 2 ? '#f4f4f4' : '#ff5a2a'; c.beginPath(); c.moveTo(x0, -h0 + w0); c.lineTo(x1, -h1 + w1); c.lineTo(x1, h1 + w1); c.lineTo(x0, h0 + w0); c.closePath(); c.fill(); }
    c.restore(); }`]);
// 7) FEHLER behoben (02.11. abends): kraftBlock ist in Zweig D das Wetter-Mittel je Block für die Messungen ohne Wetter. Im Spiel wirkt das echte Wetter –
//    kraftBlock darf dort nicht zusätzlich gelten (sonst zählte das Wetter doppelt: z. B. Schatten im Winter +7 % statt +3,5 %, Feuer −6 % statt −3 %).
R.push([`const kbOf = el => { const a = ELEMENTS[el].kraftBlock;`, `const kbOf = el => 1, kbOfMess = el => { const a = ELEMENTS[el].kraftBlock;   /* Zweig D7: im Spiel ohne kraftBlock (echtes Wetter) */`]);
// 8) L 03.11.: Stein-Bilder T3/T4 getauscht (D7-T3 Onyx ohne Fliegende, D7-T4 Katapult; F's Bild 3 ist das Katapult, Bild 4 der Onyx) – nur Anzeige
R.push([`function drawTower25(c, tw, x, y, cs, aim, glow){`, `function drawTower25(c, tw, x, y, cs, aim, glow){
  if (tw.el === 3 && (tw.idx === 2 || tw.idx === 3)) tw = { ...tw, idx:5 - tw.idx };   /* Zweig D7: Bilder Onyx/Katapult */`],
  [`function drawShot(c, p, cs, time){`, `function drawShot(c, p, cs, time){
  if (p.el === 3 && (p.idx === 2 || p.idx === 3)) p = { ...p, idx:5 - p.idx };   /* Zweig D7: Geschosse Onyx/Katapult */`],
  [`function towerIcon(el, k){
  if (view25) {`, `function towerIcon(el, k){
  if (view25) { if (el === 3 && (k === 2 || k === 3)) k = 5 - k;   /* Zweig D7: Bilder Onyx/Katapult */`]);
// 9) L 03.11.: Spielernamen (Feld name im eigenen Lane-Dokument, im Menü eingeben) und Kill-Tabelle oben rechts (gesamt, heute; antippen: alle Tage)
R.push([`  g.leaked = leaked; g.passed += broke;`, `  g.leaked = leaked; g.passed += broke;
  g.killsByDay = g.killsByDay || {}; g.killsByDay[g.day] = (g.killsByDay[g.day] || Array(n).fill(0)).map((v, i) => v + ((res[i] && res[i].kills) || 0));   /* Zweig D7: Kills je Tag */`],
  ["log.push(`Spieler ${i+1}: ", "log.push(`${String((lanes[i] && lanes[i].name) || '').replace(/[<>&\"'\\x60]/g, '') || 'Spieler ' + (i+1)}: "],
  ["` → Spieler ${(i+1)%n+1}", "` → ${String((lanes[(i+1)%n] && lanes[(i+1)%n].name) || '').replace(/[<>&\"'\\x60]/g, '') || 'Spieler ' + ((i+1)%n+1)}"],
  [`<span class="name">Spieler \${i+1}</span>`, `<span class="name">\${esc(pname(i))}</span>`],
  ['data-seat="${i}">Spieler ${i+1}</button>', 'data-seat="${i}">${esc(pname(i))}</button>'],
  ['Bauen für <b>Spieler ${seat+1}</b>', 'Bauen für <b>${esc(pname(seat))}</b>'],
  ['data-to="${k}">Spieler ${k+1}</button>', 'data-to="${k}">${esc(pname(k))}</button>'],
  ['an Spieler ${to+1} geschenkt', 'an ${esc(pname(to))} geschenkt'],
  ['Spieler ${to+1} bekommt', '${esc(pname(to))} bekommt'],
  [`  if (lanesBuilt !== NP()) buildLanes();
  const n = NP();`, `  if (lanesBuilt !== NP()) buildLanes();
  const n = NP(); renderKillTab(n);`],
  [`    <button class="btn" id="mNew">Neues Spiel …</button>`, `    \${G ? '<button class="btn" id="mName">Mein Name: ' + esc(pname(seat)) + '</button>' : ''}
    <button class="btn" id="mNew">Neues Spiel …</button>`],
  [`  $('mWx').onclick = () => { wxAnim = !wxAnim;`, `  const mn = $('mName'); if (mn) mn.onclick = () => { openDlg(\`<h2>Name</h2><p class="muted" style="margin:0">Wird allen in der Kill-Tabelle und auf der Karte angezeigt.</p>
    <input id="nmIn" maxlength="16" value="\${esc(laneOf(seat).name || '')}" style="width:100%;font-size:16px;margin:8px 0">
    <div class="acts"><button class="btn" id="nmNo">Abbrechen</button><button class="btn primary" id="nmOk">Speichern</button></div>\`);
    $('nmNo').onclick = closeDlg; $('nmOk').onclick = () => { const v = ($('nmIn').value || '').replace(/[<>&"'\\x60]/g, '').trim().slice(0, 16); L[seat] = { ...laneOf(seat), name:v }; lanesBuilt = 0; closeDlg(); render(); saveLane(seat); }; };
  $('mWx').onclick = () => { wxAnim = !wxAnim;`],
  [`<header class="top">`, `<header class="top"><div id="killtab" hidden></div>`],
  [`</head>`, `<style>#killtab{position:fixed;top:6px;right:6px;z-index:60;background:#000c;color:#fff;font:11px/1.3 system-ui,sans-serif;border-radius:8px;padding:4px 7px;max-height:70vh;overflow:auto;cursor:pointer}
#killtab table{border-collapse:collapse}#killtab td,#killtab th{padding:1px 4px;text-align:right;white-space:nowrap}#killtab th{font-weight:600;opacity:.75}
#killtab td:first-child,#killtab th:first-child{text-align:left}#killtab tr.sum td{border-top:1px solid #fff4;font-weight:600}</style>
</head>`]);
R.push([`function render(){`, `const esc = v => String(v).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const pname = i => { const l = laneOf(i); return (l && l.name && String(l.name).trim()) || 'Spieler ' + (i + 1); };
let killTabOpen = false;
function renderKillTab(n){ const t = $('killtab'); if (!t) return; if (!G) { t.hidden = true; return; } t.hidden = false;
  const kd = G.killsByDay || {}, today = Math.min(G.day, CONFIG.days), pend = i => pendingOf(i, 'kills');
  const dayK = (d, i) => ((kd[d] || [])[i] || 0) - (d === today ? pend(i) : 0);
  const head = '<tr><th></th>' + [...Array(n)].map((_, i) => '<th>' + esc(pname(i)) + '</th>').join('') + '</tr>';
  const row = (lab, f, cls) => '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + lab + '</td>' + [...Array(n)].map((_, i) => '<td>' + Math.max(0, f(i)) + '</td>').join('') + '</tr>';
  const days = killTabOpen ? Object.keys(kd).map(Number).filter(d => d <= today).sort((a, b) => b - a) : [];
  t.innerHTML = '<table>' + head + row('⚔ Tag ' + today, i => dayK(today, i)) + days.filter(d => d !== today).map(d => row('Tag ' + d, i => dayK(d, i))).join('') + row('Gesamt', i => killsOf(i), 'sum') + '</table>' + (killTabOpen ? '' : '<div style="opacity:.6;font-size:10px">antippen: alle Tage</div>');
  t.onclick = () => { killTabOpen = !killTabOpen; renderKillTab(n); }; }
function render(){`]);
module.exports = html => { for (const [a, b] of R) { if (typeof a === 'string' ? !html.includes(a) : !a.test(html)) throw new Error('Spiel-D7 passt nicht: ' + String(a).slice(0, 70)); html = html.replace(a, b); } return html; };
