// Zweig D, Schritt D3b (L, 25.10.): aus den Turm-Werten (d/turm-d.js, Stufen 1/3/6) Schaden je Turm/Stufe so setzen, dass
// Wert je Gold = Ziel: Treppe 1,10^k × Upgrade-Kurve (1 / 1,0 / 1,3 auf Stufe 1/3/6) × Luftabwehr 1,5 bzw. ohne Luftangriff 1,1, gleiche Konstante für alle Elemente.
// Annahme: Wert etwa ∝ Schaden/s (Effekte hängen am Schaden: Brennen). kraftT × e^a, upT × e^b aus log-Gerade über die Stufen.
// Türme 6–8 Stufe 6 sind praktisch nie bezahlbar (Messung nur mit Ersatztag) → Gerade nur aus Stufe 1/3.
// Aufruf: SPIEGEL=<Eingang> node tools/balance/d/fit-d.js <td-01.json> <td-23.json> <Ausgang.json>
const fs = require('fs'), path = require('path'), C = require('../core'), { G } = C, S = require('../spiegel');
const [a, b, aus] = process.argv.slice(2), M = { ...JSON.parse(fs.readFileSync(a)).out, ...JSON.parse(fs.readFileSync(b)).out }, ST = [1, 3, 6], UP = { 1:1, 3:1.0, 6:1.3 };
const ziel = (e, k, l) => { const t = G.towerBase(e, k); return Math.pow(1.10, k) * UP[l] * (t.air ? 1.5 : t.hitsFly ? 1 : 1.1); };
const lg = [], sp = { ...C.SPIEGEL };
for (const [key, v] of Object.entries(M)) { const [e, k] = key.split(',').map(Number); v.forEach((x, i) => { if (k < 5 || ST[i] < 6) lg.push(Math.log(x / ziel(e, k, ST[i]))); }); }
const K = Math.exp(lg.reduce((s, x) => s + x, 0) / lg.length);   // gemeinsame Konstante (Wert je Gold eines „Treppe-1“-Turms)
console.log(`Gemeinsame Konstante K = ${K.toFixed(3)} (Wert je Gold Turm 1 Stufe 1 im Ziel)`);
for (const [key, v] of Object.entries(M)) { const [e, k] = key.split(',').map(Number);
  const pts = v.map((x, i) => ({ s:ST[i] - 1, y:Math.log(K * ziel(e, k, ST[i]) / x) })).filter((p, i) => k < 5 || ST[i] < 6);
  const mx = pts.reduce((s, p) => s + p.s, 0) / pts.length, my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const bb0 = pts.length > 1 ? pts.reduce((s, p) => s + (p.s - mx) * (p.y - my), 0) / pts.reduce((s, p) => s + (p.s - mx) ** 2, 0) : 0, bb = k >= 5 ? Math.max(Math.log(0.93), Math.min(Math.log(1.07), bb0)) : bb0, aa = my - bb * mx;   // Türme 6–8: nur 2 Stufen gemessen → Steigung je Stufe auf 0,93–1,07 begrenzt
  const pK = `ELEMENTS.${e}.kraftT.${k}`, kt = sp[pK] ?? (G.ELEMENTS[e].kraftT || [])[k] ?? 1; sp[pK] = +(kt * Math.exp(aa)).toFixed(4);
  const pU = `ELEMENTS.${e}.upT`, u = [...(sp[pU] || G.ELEMENTS[e].upT || Array(8).fill(1))]; u[k] = +(u[k] * Math.exp(bb)).toFixed(4); sp[pU] = u;
  console.log(`${G.ELEMENTS[e].name.padEnd(9)}${G.towerBase(e, k).name.padEnd(15)} Wert/Ziel ${v.map((x, i) => (x / (K * ziel(e, k, ST[i]))).toFixed(2)).join(' ')} → Schaden ×${Math.exp(aa).toFixed(2)}, je Stufe ×${Math.exp(bb).toFixed(3)}`);
}
sp._stand = `Zweig D1 (L, 25.10.): Türme aus Paar-Kontext-Messung auf Treppe 1,10 × Upgrade 1/1,0/1,3 gesetzt (Stapelregel STAPEL_ALLE), Monster wie C12f`;
S.speichern(sp, path.isAbsolute(aus) ? aus : path.join(process.cwd(), aus));
