// Zweig D (L, 25.10.): Leben je Tag nach Ziel-Reserve, die nach Potenzgesetz sinkt.
// Tag 1: im ersten Durchlauf je Spieler ca. 12 von 20 Kills (Menschen-Start: 3 × Turm 1); Tag 2: 4–7 (Mitte 5,5); Betty (Tag 48) nur knapp schaffbar (Reserve 1,05).
// Dazwischen Reserve(d) = R2 × (d/2)^(−a). Grundlage: Standard-Pläne (d/plaene), Reserve wie P2 (ganzer Tag).
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C, S = require('../spiegel');
const PL = ['standard-map0', 'standard-map2'].map(o => require(path.join(__dirname, 'plaene', o + '.json')).erg.Feuer[0]);
const ZIEL48 = +process.env.ZIEL48 || 1.05;
// Kills am Menschen-Start (L): Tag 1 drei Turm 1 Stufe 1 (30 Gold), Tag 2 drei Turm 1 Stufe 2 (75 Gold ≈ Budget 70); Maps 0–3 (Wiese), beste Plätze
const start = (lvl) => ({ el:0, towers:C.mask(0, 0, lvl, 0).cells.slice(0, 3).map(c => ({ x:c.x, y:c.y, el:0, idx:0, lvl })), res:[] });
const kills = (d, f) => { let s = 0; for (let l = 0; l < 4; l++) { C.useMap(l, null); s += C.runWave(start(d + 1), { type:d, players:2 }, f).kills; } return s / 4; };
const res = d => Math.sqrt(PL.map(p => { C.useMap(p.lane, p.seed); return C.reserveDay(p.tage[d].setup, { type:d, players:2 }); }).reduce((a, b) => a * b, 1));
function fuerKills(d, ziel){ let lo = 0.05, hi = 20; for (let i = 0; i < 30; i++) { const m = Math.sqrt(lo * hi); if (kills(d, m) >= ziel) lo = m; else hi = m; } return Math.sqrt(lo * hi); }
const sp = { ...C.SPIEGEL }, n = G.MONSTERS.length, R = [...Array(n)].map((_, d) => res(d));
const f1 = fuerKills(0, 12), f2 = fuerKills(1, 5.5);
const R1 = R[0] / f1, R2 = R[1] / f2, a = Math.log(R2 / ZIEL48) / Math.log((n) / 2);
console.log(`Tag 1: Leben ×${f1.toFixed(2)} für 12 Kills → Reserve ${R1.toFixed(2)} · Tag 2: ×${f2.toFixed(2)} für 5,5 Kills → Reserve ${R2.toFixed(2)} · Potenz a = ${a.toFixed(3)} (Betty ${ZIEL48})`);
const zeile = [];
G.MONSTERS.forEach((m, d) => { const ziel = d === 0 ? R1 : R2 * Math.pow((d + 1) / 2, -a), p = `MONSTERS.${m.name}.hpMul`, h = sp[p] ?? m.hpMul ?? 1;
  sp[p] = +(h * R[d] / ziel).toFixed(4); zeile.push(`${d + 1} ${m.name.slice(0, 12)} ${ziel.toFixed(2)}`); });
sp._stand = (sp._stand || '').replace(/ · Leben je Tag:.*$/, '') + ` · Leben je Tag: Ziel-Reserve nach Potenzgesetz (Tag 1: 12 Kills, Tag 2: 5,5 Kills, Betty ${ZIEL48}, a = ${a.toFixed(3)}), Standard-Pläne`;
S.speichern(sp, path.join(__dirname, '..', process.env.AUS || 'spiegel-D0.json'));
console.log(zeile.join(' | '));
