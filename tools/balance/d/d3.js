// Zweig D3 (L, 27.10.): Standardtürme wie D0, Turmpreise gerafft (letzter Turm 1000): 10/45/70/120/200/340/580/1000.
// Schaden/s bleibt 0,233 × Gold × 1,10^Turm (× Upgrade-Kurve) → kraftT skaliert mit dem neuen Preis. Monster (Leben je Tag) wie D0.
// UPKURVE=1,0.95,1,1.075,1.15,1.2 (optional): Kraft je Gold des GANZEN Turms (alles investierte Gold) auf Stufe 1–6, relativ zu Stufe 1
// (D0: 1/0,9/1,0/1,1/1,2/1,3 – das einzelne Upgrade ist damit deutlich effizienter: Stufe 6 allein ×1,47 je Gold).
// Aufruf: node tools/balance/d/d3.js [AUS=spiegel-D3.json]
const fs = require('fs'), path = require('path'), S = require('../spiegel');
const D0 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spiegel-D0.json'))), sp = { ...D0 };
const PREIS = (process.env.PREIS || '10,45,70,120,200,340,580,1000').split(',').map(Number);
const ALT = D0['ELEMENTS.0.costOverride'];
// Upgrade-Kurve: Stufe s kostet Basis × 1,5^(s−1); Gold gesamt bis Stufe s × kurve[s−1] = Schaden/s (Basis = 1) → Faktor je Stufe
function upDmg(kurve){ const out = []; let gold = 1, prev = 1;
  for (let s = 2; s <= 6; s++) { gold += Math.pow(1.5, s - 1); const dps = gold * kurve[s - 1]; out.push(+(dps / prev).toFixed(4)); prev = dps; }
  return out; }
const grenz = u => { let gold = 1, dps = 1; return u.map((f, i) => { const g = Math.pow(1.5, i + 1), n = dps * f, m = (n - dps) / g; gold += g; dps = n; return +m.toFixed(2); }); };   // Kraft je Gold des einzelnen Upgrades
// TREPPE=1.15 (L 27.10.): Schaden je Gold steigt je Turmtyp um diesen Faktor (D0: 1,10)
const TREPPE = +(process.env.TREPPE || 1.10);
const KURVE = process.env.UPKURVE ? [1, ...process.env.UPKURVE.split(',').map(Number).slice(1)] : null;
for (let e = 0; e < 4; e++) {
  sp[`ELEMENTS.${e}.costOverride`] = Object.fromEntries(PREIS.map((p, k) => [k, p]));
  for (let k = 0; k < 8; k++) sp[`ELEMENTS.${e}.kraftT.${k}`] = +(D0[`ELEMENTS.${e}.kraftT.${k}`] * PREIS[k] / ALT[k] * Math.pow(TREPPE / 1.10, k)).toFixed(5);
  if (KURVE) sp[`ELEMENTS.${e}.upDmg`] = upDmg(KURVE);
}
sp._stand = `Zweig D3 (L, 27.10.): wie D0, Preise ${PREIS.join('/')}` + (KURVE ? `, Upgrade-Kurve ${KURVE.join('/')}` : '') + (TREPPE !== 1.10 ? `, Treppe ×${TREPPE} je Turmtyp` : '') + '; Monster wie D0';
S.speichern(sp, path.resolve(__dirname, '..', process.env.AUS || 'spiegel-D3.json'));
const u = sp['ELEMENTS.0.upDmg']; console.log(sp._stand, u, 'je Upgrade (Kraft je Gold):', grenz(u).join('/'));
