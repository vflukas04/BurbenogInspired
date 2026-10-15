// Grundbausteine des Balancing-Skripts (Verfahren: team/BALANCING.md)
//  – Testkarte: Karte 0, Gelände leer (Wiese), damit Ergebnisse nicht vom gewürfelten Gelände abhängen (Kartenvarianz = eigener Prüfpunkt P11)
//  – Reservefaktor: mit welchem Faktor auf Leben UND Rüstung eine Aufstellung eine Welle gerade noch schafft
//  – Bauplatz-Maske: Wegstrecke in Reichweite je Feld und Turmtyp
const G = require('./sim').load();
const { MAPS, COLS, ROWS, GRID, ELEMENTS } = G;

// ---------- Testkarte ----------
const LANE = 0, MAP = MAPS[LANE];
for (let y = 0; y < ROWS; y++) MAP.terrain[y] = Array(COLS).fill(0);   // nur Wiese
const free = []; for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (!MAP.cells.has(x + ',' + y)) free.push([x, y]);
// Wegpunkte im Abstand 0,1 (für Abdeckung)
const PATH = []; for (let d = 0; d <= MAP.len; d += 0.1) PATH.push(G.posAt(MAP, d));

// ---------- Simulation einer Welle auf einem Feld ----------
/* setup = { el, towers:[{x,y,el,idx,lvl,gem,ab}], res:[ids] }
   wave  = { type (Monster-Index), count, players, dark, weather }
   f     = Faktor auf Leben und Rüstung */
function runWave(setup, wave, f = 1){
  const M = G.monsterDef(wave.type, wave.players || 2), n = wave.count || G.MONSTERS[wave.type].count || G.CONFIG.perWave;
  const incoming = [...Array(n)].map(() => ({ type:wave.type, hops:0, hp:M.hp * f, ap:Math.round(M.armorPts * f) }));
  const s = G.simulate({ lane:LANE, players:wave.players || 2, towers:setup.towers, res:setup.res || [], incoming,
    dark:!!wave.dark, weather:wave.weather || 0, seed:wave.seed || 7 });
  const hpLeft = s.leaked.reduce((a, m) => a + m.hp, 0);
  return { kills:s.kills, n, leaked:s.leaked.length, hpShare:1 - hpLeft / (M.hp * f * n), gems:s.gems };
}
/* Reservefaktor: größtes f, bei dem mindestens der Anteil q der Monster stirbt (q = 1: keiner kommt durch).
   Intervallsuche auf log-Skala, Genauigkeit ~2 %. Für Bosse (count 1) ist q = 1 sinnvoll; „halbes Leben“ prüft hpShare. */
function reserve(setup, wave, q = 1, lo = 0.02, hi = 50){
  const ok = f => runWave(setup, wave, f).kills >= Math.ceil(q * (wave.count || G.MONSTERS[wave.type].count || G.CONFIG.perWave) - 1e-9);
  if (!ok(lo)) return 0;
  if (ok(hi)) return hi;
  for (let i = 0; i < 14 && hi / lo > 1.02; i++) { const m = Math.sqrt(lo * hi); if (ok(m)) lo = m; else hi = m; }
  return lo;
}

// ---------- Bauplatz-Maske ----------
// Wegstrecke (in Feldern) innerhalb Radius r um das Feld; Kreuzung/Kurven zählen automatisch mehrfach, weil der Weg dort mehrfach vorbeiläuft
function coverage(x, y, r){ const cx = x + .5, cy = y + .5; let c = 0; for (const [px, py] of PATH) if (Math.hypot(px - cx, py - cy) <= r) c++; return c * 0.1; }
/* Maske für einen Turm: alle freien Felder mit Abdeckung, sortiert; behalten wird, was mindestens keep × bestes Feld erreicht.
   Reichweite = Grundreichweite auf Stufe lvl (Upgrades vergrößern sie). Irrlicht: Lichtkreis (Motten, Nachtsicht wirken auf Monster darin). */
function mask(el, idx, lvl = 1, keep = 0.6){
  const d = G.tdef({ el, idx, lvl, x:0, y:0 }), r = d.buff ? d.light : d.nova ? d.splash : d.range;
  const all = free.map(([x, y]) => ({ x, y, c:coverage(x, y, r) })).sort((a, b) => b.c - a.c);
  const best = all[0].c; return { r, best, cells:all.filter(o => o.c >= keep * best) };
}
// Gold bis einschließlich Tag `day` bei vollständigem Abschuss (Obergrenze), 1 Spieler, ohne Forschungsbonus
function incomeUntil(day, players = 2){
  let g = G.CONFIG.startGold;
  for (let d = 1; d < day; d++) { const M = G.MONSTERS[d - 1]; if (!M) break; g += G.monsterDef(d - 1, players).bounty * (M.count || G.CONFIG.perWave); }
  return g;
}
module.exports = { G, MAP, LANE, free, PATH, runWave, reserve, coverage, mask, incomeUntil };
