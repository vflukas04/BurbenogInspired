// Zweig D3 (L, 27.10.): Bot-Vergleich mit Standardtürmen bei festem Gold-Budget.
// – Alle Türme freigeschaltet, keine Forschung. Gold vor Tag d = Start + ANTEIL × Kopfgeld aller Tage davor (alle Monster getötet);
//   der Rest (1 − ANTEIL, Standard 10 %) ist der faire Anteil an der Gemeinschaftskasse und fehlt hier.
// – Gold hängt also NICHT vom Abschneiden ab: Bots planen ohne Simulation (Regel-Bots) bzw. mit (Sim-Bots), bewertet wird danach.
// – Türme bleiben stehen (kein Abriss), es wird nur gebaut und aufgerüstet. Plätze: beste freie Felder nach Wegabdeckung, Geländeaufschlag zählt.
// – Bewertung je Tag: Reserve (ganzer Tag, 10 + 19 Uhr, wie P2) auf Map 0 (Seed 11) und Map 2 (Seed 23), ohne Wetter,
//   Monster-Faktoren neutral (wie die Kalibrierung ziel.js), verglichen mit der Ziel-Kurve R(d) = 1,52 × d^−0,096.
// Aufruf: SPIEGEL=tools/balance/spiegel-D3.json BOT=kern node tools/balance/d/bots.js  (BOT=alle: nacheinander; Liste: BOTS unten)
const fs = require('fs'), path = require('path'), C = require('../core'), B = require('../build'), { G } = C;
for (const k in G.LOCKS) delete G.LOCKS[k];                       // alles freigeschaltet
G.WEATHER.forEach(w => { w.el = {}; delete w.burnDecay; });        // ohne Wetter-Wirkung
G.MONSTERS.forEach(m => { m.weak = [1, 1, 1, 1]; });               // neutrale Faktoren
const EL = 0, SPIELER = 2, ANTEIL = +(process.env.ANTEIL || 0.9), MAPS = [[0, 11], [2, 23]], N = G.MONSTERS.length;
// Ziel-Kurve: aus dem Spiegel (_ziel, gesetzt von d/ziel4.js), sonst die D0-Kurve 1,52 × Tag^−0,096
const ZK = C.SPIEGEL._ziel || { R1:1.52, a:0.096 }, ZIEL = d => ZK.R1 * Math.pow(d + 1, -ZK.a);
const einkommen = d => d < N ? ANTEIL * G.monsterDef(d, SPIELER).bounty * (G.MONSTERS[d].count || G.CONFIG.perWave) : 0;
const budget = d => { let g = G.CONFIG.startGold; for (let i = 0; i < d; i++) g += einkommen(i); return Math.floor(g); };
// ---------- Bausteine ----------
const used = st => new Set(st.towers.map(t => t.x + ',' + t.y));
const upCost = t => B.upCost(t, []);
// Platzwahl (27.10. nachm.): bestes freies Feld; ist es mit dem freien Gold (FREI) wegen Geländeaufschlag nicht bezahlbar,
// nimmt der Bot das beste bezahlbare Feld mit mindestens 80 % der Abdeckung (vorher wartete er dann – Mensch-Bots an Tag 1 nur 1 Turm)
let FREI = Infinity;
function zelle(st, k, minAnteil = 0){ const m = C.mask(EL, k, 1, 0), u = used(st), kost = c => G.buildCost(EL, k, C.LANE, c.x, c.y);
  const frei = m.cells.filter(c => !u.has(c.x + ',' + c.y) && c.c >= minAnteil * m.best); if (!frei.length) return null;
  const c = frei.find(c => c.c >= 0.8 * frei[0].c && kost(c) <= FREI) || frei[0]; return { x:c.x, y:c.y, cost:kost(c) }; }
const bau = (st, k, min) => { const c = zelle(st, k, min); return c ? { kind:'bau', k, c, cost:c.cost } : null; };
const up = t => t && (t.lvl || 1) < 6 ? { kind:'up', t, cost:upCost(t) } : null;
const vom = (st, k) => st.towers.filter(t => t.idx === k);
const niedrigster = arr => [...arr].sort((a, b) => a.lvl - b.lvl || upCost(a) - upCost(b))[0];
const billigste = list => list.filter(Boolean).sort((a, b) => a.cost - b.cost)[0] || null;
const preis = k => G.towerBase(EL, k).cost;
function ausfuehren(st, a){
  if (a.kind === 'bau') st.towers.push({ x:a.c.x, y:a.c.y, el:EL, idx:a.k, lvl:1, inv:a.cost });
  else { a.t.lvl = (a.t.lvl || 1) + 1; a.t.inv += a.cost; }
  st.spent += a.cost; }
// Wirkung ohne Simulation: Schaden/s × Wegstrecke in Reichweite (Proxy für verursachten Schaden)
const wirk = t => { const d = G.tdef(t, C.LANE); return d.dps * C.coverage(t.x, t.y, d.range); };
function proxyWert(st, a){ if (a.kind === 'bau') return wirk({ x:a.c.x, y:a.c.y, el:EL, idx:a.k, lvl:1 }) / a.cost;
  return (wirk({ ...a.t, lvl:a.t.lvl + 1 }) - wirk(a.t)) / a.cost; }
// Rest-Ausgabe der Sim-Bots: beste Wirkung je Gold, mit Obergrenze je Turmtyp
const capVon = (cap, k) => cap === undefined ? 1e9 : Array.isArray(cap) ? cap[k] : cap;   // Obergrenze je Turmtyp: Zahl oder Liste [T1 … T8]
const rest = (st, frei, cap) => { const a = alleAktionen(st).filter(a => a.cost <= frei && (a.kind !== 'bau' || vom(st, a.k).length < capVon(cap, a.k))); if (!a.length) return null;
  return a.map(x => ({ x, v:proxyWert(st, x) })).sort((p, q) => q.v - p.v)[0].x; };
const alleAktionen = st => [...[...Array(8).keys()].map(k => bau(st, k)), ...st.towers.map(up)].filter(Boolean);
// ---------- Bots: next(st, d, frei) → gewünschte Aktion (zu teuer = heute sparen) oder null ----------
const BOTS = {
  // Mensch A (L): 3 × T1 bis S6; von jeder weiteren Stufe ein Turm bis S3; immer das Billigste zuerst; höchstens 10 Türme; danach höchste Stufen bis S6
  kern: { txt:'Mensch A: 3×T1→S6, je Stufe 1 Turm bis S3, Billigstes zuerst', next(st){ const t1 = vom(st, 0);
    if (t1.length < 3) return bau(st, 0);
    const da = new Set(st.towers.map(t => t.idx)), nx = [1, 2, 3, 4, 5, 6, 7].find(k => !da.has(k)), c = [up(niedrigster(t1))];
    if (st.towers.length < 10 && nx !== undefined) c.push(bau(st, nx));
    st.towers.filter(t => t.idx > 0 && t.lvl < 3).forEach(t => c.push(up(t)));
    return billigste(c) || up([...st.towers].filter(t => t.lvl < 6).sort((a, b) => b.idx - a.idx)[0]); } },
  // Mensch B (L, Stein-Spiel): 2 × T1 bis S4, dann von jeder Stufe 2 Türme (neueste zuerst, spart bis 2 Tage), sonst Upgrades bis S3; höchstens 12 Türme
  breit: { txt:'Mensch B: 2×T1→S4, je Stufe 2 Türme bis S3, spart auf die nächste Stufe', next(st, d, frei){ const t1 = vom(st, 0);
    if (t1.length < 2) return bau(st, 0);
    if (niedrigster(t1).lvl < 4) return up(niedrigster(t1));
    const k = st.towers.length < 12 ? [1, 2, 3, 4, 5, 6, 7].find(k => vom(st, k).length < 2) : undefined;
    if (k !== undefined && preis(k) <= frei + 2 * einkommen(d)) return bau(st, k);
    return billigste(st.towers.filter(t => t.lvl < 3).map(up)) || (k !== undefined ? bau(st, k) : billigste(st.towers.map(up))); } },
  // Mensch C: 3 × T1 bis S3, dann spart er auf die nächste Stufe (T2 … T8 je einmal, gleich auf S2); solange die zu weit weg ist, T1 Richtung S6
  sparer: { txt:'Mensch C: 3×T1→S3, spart auf T2…T8 je 1× (S2), dazwischen T1→S6', next(st, d, frei){ const t1 = vom(st, 0);
    if (t1.length < 3) return bau(st, 0);
    const lo = niedrigster(t1); if (lo.lvl < 3) return up(lo);
    const neu = st.towers.find(t => t.idx > 0 && t.lvl < 2); if (neu) return up(neu);
    const da = new Set(st.towers.map(t => t.idx)), nx = [1, 2, 3, 4, 5, 6, 7].find(k => !da.has(k));
    if (nx !== undefined) return preis(nx) <= frei + 3 * einkommen(d) || lo.lvl >= 6 ? bau(st, nx) : up(lo);
    return billigste(st.towers.map(up)); } },
  // Nur Turm 1: so viele T1 wie gute Plätze (≥ 60 % der besten Abdeckung), Billigstes zuerst
  nurT1: { txt:'nur T1, Billigstes zuerst (bauen oder aufrüsten)', next(st){ return billigste([bau(st, 0, 0.6), up(niedrigster(vom(st, 0)))]); } },
  // Upgrade zuerst: höchstens 6 Türme; neuer Turm erst, wenn alle S6 sind; neue Türme = höchste Stufe, die man sich gerade leisten kann
  hoch: { txt:'Upgrade zuerst: ≤ 6 Türme, alle bis S6, neu = höchste bezahlbare Stufe', next(st, d, frei){
    const offen = st.towers.filter(t => t.lvl < 6); if (offen.length) return up(niedrigster(offen));
    if (st.towers.length >= 6 && st.towers.length < 12 && st.towers.every(t => t.lvl >= 6) || st.towers.length < 6) {
      const k = [7, 6, 5, 4, 3, 2, 1, 0].find(k => preis(k) <= frei) ?? 0; return bau(st, k); }
    return null; } },
  // Stufen-Bots (27.10.): jeder Turm erst bis Stufe S (neueste zuerst), dann neuer Turm = höchste bezahlbare Stufe; ab 14 Türmen alles bis S6
  ...Object.fromEntries([3, 4, 5].map(S => ['hoch' + S, { txt:`Stufe ${S} zuerst: jeder Turm bis S${S}, dann neuer = höchste bezahlbare Stufe`, next(st, d, frei){
    const offen = st.towers.filter(t => t.lvl < S); if (offen.length) return up(niedrigster(offen));
    if (st.towers.length < 14) { const k = [7, 6, 5, 4, 3, 2, 1, 0].find(k => preis(k) <= frei) ?? 0; return bau(st, k); }
    return billigste(st.towers.map(up)); } }])),
  // Leiter: immer der größte Turm, auf den man höchstens 2 Tage sparen muss, auf S1; Upgrades erst ab 14 Türmen
  leiter: { txt:'Leiter: immer größter Turm (≤ 2 Tage sparen) auf S1, Upgrades erst ab 14 Türmen', next(st, d, frei){
    if (st.towers.length < 14) { const k = [7, 6, 5, 4, 3, 2, 1, 0].find(k => preis(k) <= frei + (st.towers.length ? 2 * einkommen(d) : 0)) ?? 0; return bau(st, k); }
    return billigste(st.towers.map(up)); } },
  // Leiter S3: wie Leiter, aber jeder Turm erst auf S3
  leiter3: { txt:'Leiter S3: größter Turm (≤ 2 Tage sparen), jeder Turm erst auf S3', next(st, d, frei){
    const offen = st.towers.filter(t => t.lvl < 3); if (offen.length) return up(niedrigster(offen));
    if (st.towers.length < 14) { const k = [7, 6, 5, 4, 3, 2, 1, 0].find(k => preis(k) <= frei + (st.towers.length ? 2 * einkommen(d) : 0)) ?? 0; return bau(st, k); }
    return billigste(st.towers.map(up)); } },
  // Querschnitt: Gold gleichmäßig auf alle Stufen, die man sich (mit 2 Tagen Sparen) leisten kann; je Stufe bis 3 Türme, Upgrades im Wechsel
  quer: { txt:'Querschnitt: Gold gleichmäßig auf alle bezahlbaren Stufen', next(st, d, frei){
    const ks = [...Array(8).keys()].filter(k => preis(k) <= frei + 2 * einkommen(d) || vom(st, k).length);
    const inv = k => vom(st, k).reduce((a, t) => a + t.inv, 0), k = ks.sort((a, b) => inv(a) - inv(b))[0], v = vom(st, k);
    if (!v.length || (niedrigster(v).lvl >= 3 && v.length < 3)) return bau(st, k) || up(niedrigster(v));
    return up(niedrigster(v)); } },
  // Proxy-gierig: größte Wirkung (Schaden/s × Wegstrecke in Reichweite) je Gold, nur was heute bezahlbar ist
  proxy: { txt:'gierig nach Schaden/s × Abdeckung je Gold, spart nie', next(st, d, frei){
    const a = alleAktionen(st).filter(a => a.cost <= frei); if (!a.length) return null;
    return a.map(x => ({ x, v:proxyWert(st, x) })).sort((p, q) => q.v - p.v)[0].x; } },
  // Proxy-sparend: wie proxy, aber auch Aktionen bis 2 Tage Einkommen über dem freien Gold (dann wird gespart)
  proxySpar: { txt:'gierig nach Schaden/s × Abdeckung je Gold, spart bis 2 Tage', next(st, d, frei){
    const a = alleAktionen(st).filter(a => a.cost <= frei + (st.towers.length ? 2 * einkommen(d) : 0)); if (!a.length) return null;
    return a.map(x => ({ x, v:proxyWert(st, x) })).sort((p, q) => q.v - p.v)[0].x; } },
  // Sim-gierig (wie P2 ohne Umbau): Simulation der heutigen Welle, größter Zuwachs je Gold
  sim: { txt:'gierig mit Simulation der heutigen Welle', sim:d => [{ type:d, players:SPIELER, tag:true }], spar:0 },
  // Sim mit Vorausschau: heute ×1, morgen ×0,5, übermorgen ×0,25; darf ein Tageseinkommen lang sparen
  // Bezug: alter P2-Plan (25.10., D0-Preise): mit Forschung, Edelsteinen, Umbau erlaubt und vollem Kopfgeld – nur zum Vergleich
  p2alt: { txt:'Bezug: alter P2-Plan (Forschung, Edelsteine, Umbau, volles Kopfgeld)', fest:true },
  // Mit Obergrenze (L 27.10.): wie sim/simVoraus, aber höchstens 3 Türme je Turmtyp (T1 … T8)
  sim3: { txt:'gierig mit Simulation (heute), höchstens 3 Türme je Turmtyp', sim:d => [{ type:d, players:SPIELER, tag:true }], spar:0, cap:3 },
  simVoraus3: { txt:'gierig mit Simulation heute/morgen/übermorgen, spart 1 Tag, höchstens 3 je Turmtyp', sim:d => [0, 1, 2].filter(i => d + i < N).map(i => ({ type:d + i, players:SPIELER, tag:true, wt:[1, 0.5, 0.25][i] })), spar:1, cap:3 },
  // Bezugs-Bot (L 27.10.): wie simVoraus3, aber Turm 1 bis zu 4-mal
  bezug: { txt:'Bezug: gierig mit Simulation heute/morgen/übermorgen, spart 1 Tag, T1 höchstens 4, sonst 3 je Turmtyp', sim:d => [0, 1, 2].filter(i => d + i < N).map(i => ({ type:d + i, players:SPIELER, tag:true, wt:[1, 0.5, 0.25][i] })), spar:1, cap:[4, 3, 3, 3, 3, 3, 3, 3] },
  // Sparsame Bots (L 27.10. nachm.): nur so viel bauen wie heute nötig, Rest auf die effizientesten Käufe sparen (bis 5 Tage)
  sparsam: { txt:'sparsam: heute nur das Nötige (Reserve ≥ Ziel), sonst sparen auf den besten Kauf je Gold (Tag +3/+6), T1 ≤ 4, sonst ≤ 3', sparsam:true, cap:[4, 3, 3, 3, 3, 3, 3, 3], horizont:5 },
  sparsamX: { txt:'sparsam, Bewertung exakt (Reserve-Zuwachs je Gold), T1 ≤ 4, sonst ≤ 3', sparsam:true, exakt:true, cap:[4, 3, 3, 3, 3, 3, 3, 3], horizont:5 },
  sparsamFreiX: { txt:'sparsam, Bewertung exakt, ohne Obergrenze', sparsam:true, exakt:true, horizont:5 },
  // L 27.10. 14 Uhr: spart so viel wie möglich, ohne die Reserve 1,05 an der heutigen Welle zu unterschreiten
  spar105: { txt:'spart so viel wie möglich, heute nur bis Reserve 1,05; Rest auf den besten Kauf je Gold (exakt, bis 5 Tage), T1 ≤ 4, sonst ≤ 3', sparsam:true, exakt:true, schwelle:1.05, cap:[4, 3, 3, 3, 3, 3, 3, 3], horizont:5 },
  spar105Frei: { txt:'wie spar105, ohne Obergrenze', sparsam:true, exakt:true, schwelle:1.05, horizont:5 },
  // Planer (L 27.10. 15 Uhr): wie spar105 ohne Obergrenze, zusätzlich Bündel (mehrere Stufen auf einmal), Vorauswahl 4 je Art, exakt bewertet
  planer: { txt:'Planer: spart bis 5 Tage, heute nur bis Reserve 1,05, bewertet auch mehrstufige Käufe (Bündel) exakt; ohne Obergrenze', sparsam:true, exakt:true, schwelle:1.05, horizont:5, buendel:true, vorwahl:4 },
  // Claude-Plan (27.10.): Regeln aus den Messungen – je Gold sind größere Turmtypen besser als Upgrades → immer auf den nächstgrößeren
  // Turmtyp sparen (bis 3 Tage), heute nur nachkaufen, wenn die Reserve unter 1,05 fällt (dann das Bezahlbare mit der größten Wirkung je Gold);
  // ab T8: neuer T8 oder T8-Upgrade, je nach Wirkung je Gold
  claude: { txt:'Claude-Plan: spart auf den nächstgrößeren Turmtyp (bis 3 Tage), Nachkauf nur unter Reserve 1,05; ab T8 neue T8 / Upgrades', claude:true },
  // Rückwärts-Bot (L 27.10. 15 Uhr): Ziel = optimaler Endaufbau (OPTIMUM=…), rückwärts auf jeden Tag heruntergerechnet, vorwärts nachgebaut
  rueck: { txt:'Rückwärts: Tagesziele aus dem optimalen Endaufbau, Nachkauf nur unter Reserve 1,05', rueck:true },
  sparsamFrei: { txt:'sparsam wie oben, ohne Obergrenze je Turmtyp', sparsam:true, horizont:5 },
  // Bezugs-Bot mit längerem Sparen (L): bis 3 Tageseinkommen
  bezug3: { txt:'wie Bezug, spart bis 3 Tage', sim:d => [0, 1, 2].filter(i => d + i < N).map(i => ({ type:d + i, players:SPIELER, tag:true, wt:[1, 0.5, 0.25][i] })), spar:3, cap:[4, 3, 3, 3, 3, 3, 3, 3] },
  bezug3Frei: { txt:'wie Bezug, spart bis 3 Tage, ohne Obergrenze', sim:d => [0, 1, 2].filter(i => d + i < N).map(i => ({ type:d + i, players:SPIELER, tag:true, wt:[1, 0.5, 0.25][i] })), spar:3 },
  simVoraus: { txt:'gierig mit Simulation heute/morgen/übermorgen, spart 1 Tag', sim:d => [0, 1, 2].filter(i => d + i < N).map(i => ({ type:d + i, players:SPIELER, tag:true, wt:[1, 0.5, 0.25][i] })), spar:1 },
};
// Gieriger Aufbau wie build.js (greedy), aber neue Türme nur, solange vom Turmtyp weniger als cap stehen
const resvW = (s, w) => w.tag ? C.reserveDay(s, w) : C.reserveHp(s, w);
const runW = (s, w, f) => w.tag ? C.runDay(s, w, f) : C.runWave(s, w, f);
const quickW = (s, waves, fRef) => { let v = 0, n = 0; waves.forEach((w, i) => { v += (w.wt || 1) * runW(s, w, fRef[i]).hpShare; n += w.wt || 1; }); return v / n; };
function greedyCap(gold, waves, start, cap, spar){ let setup = start, left = gold - B.spent(setup);
  for (let guard = 0; guard < 300; guard++) {
    const acts = B.actions(setup, left, { cells:3, keep:0.8, spar }).filter(a => { if (a.kind !== 'bau') return true; const k = a.apply(setup).towers.at(-1).idx; return setup.towers.filter(t => t.idx === k).length < capVon(cap, k); });
    if (!acts.length) break;
    const R = waves.map(w => resvW(setup, w)), fRef = R.map(r => Math.max(r * 1.25, 0.05)), base = quickW(setup, waves, fRef);
    let cand = acts.map(a => { const s = a.apply(setup), v = quickW(s, waves, fRef); return { a, s, v, gain:(v - base) / a.cost }; });
    const sat = cand.filter(c => c.v >= 0.999);
    if (sat.length > 1) { const s0 = B.score(setup, waves); cand = sat.map(c => ({ ...c, gain:Math.log(B.score(c.s, waves) / s0) / c.a.cost })); }
    cand.sort((x, y) => y.gain - x.gain); const best = cand[0];
    if (!best || best.gain <= 0 && setup.towers.length) break;
    if (best.a.cost > left) break;   // sparen
    setup = best.s; left -= best.a.cost; }
  return { setup }; }
/* Sparsamer Bot (L 27.10. nachm.): gibt nur aus, was er braucht, um die heutige Welle zu schaffen (Reserve ≥ Ziel × marge),
   und spart den Rest für die Käufe mit dem größten Zuwachs je Gold auf künftigen Wellen (Tag +3 und +6) – das dürfen auch große
   Türme sein, die erst in einigen Tagen bezahlbar sind (Sparziel bis HORIZONT Tageseinkommen). Ist das Sparziel bezahlbar, kauft er es.
   Muss er heute nachkaufen, nimmt er unter dem Bezahlbaren das Beste für die Zukunft. Obergrenze je Turmtyp optional (cap). */
/* Bündel (Planer, L 27.10.): mehrstufige Käufe als EINE Aktion, damit sich Vorleistung zeigt – Turm um 2…5 Stufen auf einmal,
   neuer Turm gleich auf S2/S3. Kosten = Summe der Einzelschritte. */
function buendel(setup, gold, cap){ const out = [], used = new Set(setup.towers.map(t => t.x + ',' + t.y));
  setup.towers.forEach((t, i) => { let cost = 0, lvl = t.lvl || 1;
    for (let j = lvl + 1; j <= 6; j++) { cost += B.upCost({ ...t, lvl:j - 1 }, []); if (j < lvl + 2) continue; if (cost > gold) break;
      const c = cost, ziel = j; out.push({ kind:'up', buendel:true, cost:c, txt:`T${t.idx + 1} → S${ziel}`, apply:s => ({ ...s, towers:s.towers.map((u, k) => k === i ? { ...u, lvl:ziel, inv:(u.inv || 0) + c } : u) }) }); } });
  for (let k = 0; k < 8; k++) { if (setup.towers.filter(t => t.idx === k).length >= capVon(cap, k)) continue;
    const z = C.mask(EL, k, 1, 0.8).cells.find(c => !used.has(c.x + ',' + c.y)); if (!z) continue;
    let cost = G.buildCost(EL, k, C.LANE, z.x, z.y);
    for (let j = 2; j <= 3; j++) { cost += B.upCost({ el:EL, idx:k, lvl:j - 1 }, []); if (cost > gold) break;
      const c = cost, ziel = j; out.push({ kind:'bau', buendel:true, cost:c, txt:`T${k + 1} neu auf S${ziel}`, apply:s => ({ ...s, towers:[...s.towers, { x:z.x, y:z.y, el:EL, idx:k, lvl:ziel, inv:c }] }) }); } }
  return out; }
function sparsam(bot, st, d){ const heute = { type:d, players:SPIELER, tag:true }, Z = bot.schwelle || ZIEL(d) * (bot.marge || 1);   // schwelle (L 27.10.): feste Reserve, z. B. 1,05
  const zuk = [3, 6].map(h => ({ type:Math.min(N - 1, d + h), players:SPIELER, tag:true }));
  for (let guard = 0; guard < 60; guard++) {
    const setup = { el:EL, towers:st.towers, res:[] }, frei = budget(d) - st.spent, noetig = C.reserveDay(setup, heute) < Z;
    const acts = B.actions(setup, frei + (bot.horizont || 5) * einkommen(d), { cells:3, keep:0.8 })
      .filter(a => a.kind !== 'bau' || st.towers.filter(t => t.idx === a.apply(setup).towers.at(-1).idx).length < capVon(bot.cap, a.apply(setup).towers.at(-1).idx));
    if (bot.buendel) acts.push(...buendel(setup, frei + (bot.horizont || 5) * einkommen(d), bot.cap));
    if (!acts.length) break;
    const R0 = zuk.map(w => C.reserveDay(setup, w)), fRef = R0.map(r => Math.max(r * 1.25, 0.05)), base = quickW(setup, zuk, fRef);
    // Vorauswahl (Planer): Schnellbewertung je Art (bauen / einzelnes Upgrade / Bündel), je die besten 4 werden exakt bewertet
    if (bot.vorwahl) { const q = acts.map(a => ({ a, v:(quickW(a.apply(setup), zuk, fRef) - base) / a.cost }));
      const art = a => a.buendel ? 'b' : a.kind; acts.length = 0;
      for (const k of ['bau', 'up', 'b']) acts.push(...q.filter(x => art(x.a) === k).sort((x, y) => y.v - x.v).slice(0, bot.vorwahl).map(x => x.a)); }
    // exakt (27.10. nachm.): Zuwachs der Reserve (log) je Gold statt Schnellbewertung – die Schnellbewertung (Anteil Leben bei festem
    // Faktor, höchstens 100 %) unterschätzt große Käufe; gemessen Tag 33: T8 schnell 0,22 ≈ T5-Upgrade 0,22, Reserve 0,30 gegen 0,26
    const wert = a => { const s = a.apply(setup); if (!bot.exakt) return (quickW(s, zuk, fRef) - base) / a.cost;
      return zuk.reduce((v, w, i) => v + Math.log(C.reserveDay(s, w, 0.97, R0[i] * 0.95, R0[i] * 4) / R0[i]), 0) / zuk.length / a.cost; };
    const cand = acts.map(a => ({ a, g:wert(a) })).sort((x, y) => y.g - x.g);
    const ziel = cand[0], bezahlbar = cand.filter(c => c.a.cost <= frei);
    const wahl = ziel.a.cost <= frei ? ziel : noetig ? bezahlbar[0] : null;
    if (!wahl || wahl.g <= 0 && st.towers.length) break;
    const s2 = wahl.a.apply(setup); st.towers = s2.towers.map(t => ({ ...t })); st.spent = B.spent(s2);
  } }
function claudePlan(st, d){ const heute = { type:d, players:SPIELER, tag:true };
  const zielKauf = frei => { const maxK = Math.max(-1, ...st.towers.map(t => t.idx));
    if (maxK < 7) { const k = [7, 6, 5, 4, 3, 2, 1, 0].find(k => k > maxK && preis(k) <= frei + (st.towers.length ? 3 * einkommen(d) : 0)); return k === undefined ? null : bau(st, k); }
    const c = [bau(st, 7), ...vom(st, 7).map(up)].filter(Boolean); return c.length ? c.map(x => ({ x, v:proxyWert(st, x) })).sort((p, q) => q.v - p.v)[0].x : null; };
  for (let guard = 0; guard < 80; guard++) { const frei = budget(d) - st.spent; FREI = frei;
    const z = zielKauf(frei); if (z && z.cost <= frei) { ausfuehren(st, z); FREI = Infinity; continue; }
    if (C.reserveDay({ el:EL, towers:st.towers, res:[] }, heute) >= 1.05) { FREI = Infinity; break; }   // sparen
    const a = rest(st, frei); FREI = Infinity; if (!a) break; ausfuehren(st, a); } }
/* Rückwärts-Bot (L 27.10. 15 Uhr): 1) optimaler Endaufbau ohne Pfad (d/optimum.js, Datei OPTIMUM). 2) Rückwärts: Aufbau für Tag d =
   Teilmenge des Aufbaus von Tag d+1 (Türme weglassen oder Stufen zurücknehmen), bis er ins Gold von Tag d passt – jeweils das, was an
   der Welle von Tag d am wenigsten Reserve je Gold kostet. 3) Vorwärts (der eigentliche Bot): jeden Tag die Schritte zum Ziel des Tages
   kaufen (billigste zuerst); fällt die Reserve unter SCHWELLE (1,05), Nachkauf außerhalb des Plans (bester Zuwachs je Gold, exakt). */
let RESERVIERT = new Set(), VERLEGT = new Map();   // Felder des Endziels: Nachkäufe außerhalb des Plans bauen dort nicht
const tkey = t => t.x + ',' + t.y + ',' + t.idx, kostenBis = (t, lvl) => { let c = G.buildCost(EL, t.idx, C.LANE, t.x, t.y); for (let l = 1; l < lvl; l++) c += B.upCost({ ...t, lvl:l }, []); return c; };
function rueckPlan(){ const O = JSON.parse(fs.readFileSync(path.resolve(process.env.OPTIMUM))), m = O.maps.find(x => x.lane === C.LANE);
  const plan = []; plan[N - 1] = m.towers.map(t => ({ x:t.x, y:t.y, el:EL, idx:t.idx, lvl:t.lvl }));
  for (let d = N - 2; d >= 0; d--) { let S = plan[d + 1].map(t => ({ ...t })); const w = { type:d, players:SPIELER, tag:true };
    const kost = S2 => S2.reduce((a, t) => a + kostenBis(t, t.lvl), 0);
    while (kost(S) > budget(d) && S.length) { const R0 = C.reserveDay({ el:EL, towers:S, res:[] }, w); let best = null;
      S.forEach((t, i) => { const S2 = t.lvl > 1 ? S.map((u, j) => j === i ? { ...u, lvl:u.lvl - 1 } : u) : S.filter((_, j) => j !== i);
        const zur = kost(S) - kost(S2), R = C.reserveDay({ el:EL, towers:S2, res:[] }, w, 0.97, 0.02, R0 * 1.01), v = (Math.log(R0) - Math.log(R)) / zur;
        if (!best || v < best.v) best = { v, S2 }; });
      S = best.S2; }
    plan[d] = S; }
  return plan; }
function rueckVorwaerts(st, d, ziel){ const heute = { type:d, players:SPIELER, tag:true }, schwelle = +(process.env.SCHWELLE || 1.05);
  for (let guard = 0; guard < 80; guard++) { const frei = budget(d) - st.spent, hier = new Map(st.towers.map(t => [tkey(t), t]));
    // Zielplätze: ist das Feld eines Zielturms schon von einem anderen Turm belegt, wandert das Ziel auf das beste freie, nicht reservierte Feld
    const belegt = new Set(st.towers.map(t => t.x + ',' + t.y)), reserviert = new Set(ziel.map(z => z.x + ',' + z.y));
    const schritte = []; for (const z0 of ziel) { const z = VERLEGT.get(tkey(z0)) || z0, t = hier.get(tkey(z));
      if (!t) { let c = { x:z.x, y:z.y };
        if (belegt.has(c.x + ',' + c.y)) { c = C.mask(EL, z.idx, 1, 0).cells.find(q => !belegt.has(q.x + ',' + q.y) && !reserviert.has(q.x + ',' + q.y)); if (!c) continue;
          VERLEGT.set(tkey(z0), { ...z0, x:c.x, y:c.y }); }
        const cost = G.buildCost(EL, z.idx, C.LANE, c.x, c.y); schritte.push({ kind:'bau', k:z.idx, c:{ x:c.x, y:c.y, cost }, cost }); }
      else if (t.lvl < z0.lvl) schritte.push(up(t)); }
    const s = schritte.filter(a => a && a.cost <= frei).sort((a, b) => a.cost - b.cost)[0];
    if (s) { ausfuehren(st, s); continue; }
    const setup = { el:EL, towers:st.towers, res:[] }, R0 = C.reserveDay(setup, heute); if (R0 >= schwelle) break;
    const acts = B.actions(setup, frei, { cells:6, keep:0.6 }).filter(a => a.kind !== 'bau' || !RESERVIERT.has((t => t.x + ',' + t.y)(a.apply(setup).towers.at(-1)))); if (!acts.length) break;
    const fRef = Math.max(R0 * 1.25, 0.05), base = C.runDay(setup, heute, fRef).hpShare;
    const vor = acts.map(a => ({ a, v:(C.runDay(a.apply(setup), heute, fRef).hpShare - base) / a.cost })).sort((x, y) => y.v - x.v).slice(0, 8);
    const best = vor.map(x => ({ a:x.a, g:Math.log(C.reserveDay(x.a.apply(setup), heute, 0.97, R0 * 0.95, R0 * 4) / R0) / x.a.cost })).sort((x, y) => y.g - x.g)[0];
    if (!best || best.g <= 0) break; const s2 = best.a.apply(setup); st.towers = s2.towers.map(t => ({ ...t })); st.spent = B.spent(s2); } }
// ---------- Plan erzeugen ----------
function plan(name){ const bot = BOTS[name], st = { towers:[], spent:0 }, tage = [];
  if (bot.fest) { const P = require(path.join(__dirname, 'plaene', `standard-map${C.LANE}.json`)).erg.Feuer[0];
    return P.tage.map((t, d) => ({ gold:t.gold, spent:B.spent(t.setup), res:t.setup.res || [], towers:t.setup.towers })); }
  const RP = bot.rueck ? rueckPlan() : null; RESERVIERT = new Set(RP && process.env.RESERV ? RP[N - 1].map(z => z.x + ',' + z.y) : []);   // RESERV=1: Zielfelder für Notkäufe sperren (27.10.: führt zu Einbruch am Anfang, Standard aus) VERLEGT = new Map();
  if (RP && process.env.NUR_RUECK) return RP.map((S, d) => ({ gold:budget(d), spent:S.reduce((a, t) => a + kostenBis(t, t.lvl), 0), towers:S.map(t => ({ ...t, inv:kostenBis(t, t.lvl) })) }));
  for (let d = 0; d < N; d++) {
    if (RP) rueckVorwaerts(st, d, RP[d]); else
    if (bot.sim) { const start = { el:EL, towers:st.towers.map(t => ({ ...t })), res:[] };
      const g = bot.cap ? greedyCap(budget(d), bot.sim(d), start, bot.cap, bot.spar * einkommen(d)) : B.greedy(EL, budget(d), bot.sim(d), { cells:3, keep:0.8, spar:bot.spar * einkommen(d) }, start);
      st.towers = g.setup.towers.map(t => ({ ...t })); st.spent = B.spent(g.setup);
      // 27.10.: Findet die Schnellbewertung keinen Zuwachs mehr (sättigt), bliebe Gold liegen → Rest nach Wirkung je Gold ausgeben (nicht bei Sparen)
      //         (bei sparenden Bots nur, was über die erlaubte Sparsumme von spar × Tageseinkommen hinausgeht)
      for (let guard = 0; guard < 300; guard++) { const frei = budget(d) - st.spent - bot.spar * einkommen(d), a = rest(st, frei, bot.cap); if (!a) break; ausfuehren(st, a); } }
    else if (bot.sparsam) sparsam(bot, st, d);
    else if (bot.claude) claudePlan(st, d);
    else for (let guard = 0; guard < 300; guard++) { const frei = budget(d) - st.spent; FREI = frei; const a = bot.next(st, d, frei); FREI = Infinity; if (!a || a.cost > frei) break; ausfuehren(st, a); }
    tage.push({ gold:budget(d), spent:st.spent, towers:st.towers.map(t => ({ x:t.x, y:t.y, el:EL, idx:t.idx, lvl:t.lvl, inv:t.inv })) });
  }
  return tage; }
const aufbauText = tw => { const z = {}; tw.forEach(t => (z[t.idx] = z[t.idx] || []).push(t.lvl));
  return Object.keys(z).sort((a, b) => a - b).map(k => `T${+k + 1}×${z[k].length}(${z[k].sort((a, b) => b - a).join('')})`).join(' '); };
function lauf(name){ const t0 = Date.now(), erg = { bot:name, txt:BOTS[name].txt, anteil:ANTEIL, spiegel:process.env.SPIEGEL || '', maps:[] };
  for (const [lane, seed] of MAPS) { C.useMap(lane, seed); const p = plan(name);
    const r = p.map((t, d) => C.reserveDay({ el:EL, towers:t.towers, res:t.res || [] }, { type:d, players:SPIELER }));
    erg.maps.push({ lane, seed, tage:p.map((t, d) => ({ ...t, R:+r[d].toFixed(3), Z:+ZIEL(d).toFixed(3) })) }); }
  erg.sek = Math.round((Date.now() - t0) / 1000);
  const aus = path.resolve(process.env.AUSDIR || path.join(__dirname, '..', 'ergebnisse', 'd3-bots'));
  fs.mkdirSync(aus, { recursive:true }); fs.writeFileSync(path.join(aus, name + '.json'), JSON.stringify(erg));
  const q = erg.maps[0].tage.map((_, d) => Math.sqrt(erg.maps[0].tage[d].R * erg.maps[1].tage[d].R) / ZIEL(d));
  const gm = a => Math.exp(a.reduce((s, x) => s + Math.log(x), 0) / a.length);
  console.log(`${name.padEnd(10)} gesamt ${gm(q).toFixed(2)} | Tag 1–12 ${gm(q.slice(0, 12)).toFixed(2)} 13–24 ${gm(q.slice(12, 24)).toFixed(2)} 25–36 ${gm(q.slice(24, 36)).toFixed(2)} 37–48 ${gm(q.slice(36)).toFixed(2)} | min ${Math.min(...q).toFixed(2)} (Tag ${q.indexOf(Math.min(...q)) + 1}) | ${erg.sek} s`);
  erg.maps.forEach(m => console.log(`   Map ${m.lane} Tag 48: ${aufbauText(m.tage[N - 1].towers)} · Gold ${m.tage[N - 1].spent}/${m.tage[N - 1].gold}`));
  return erg; }
module.exports = { BOTS, plan, budget, einkommen, ZIEL, aufbauText };
if (require.main === module) { const w = process.env.BOT || 'alle'; for (const n of w === 'alle' ? Object.keys(BOTS).filter(n => !BOTS[n].sim && !BOTS[n].fest) : w.split(',')) lauf(n); }
