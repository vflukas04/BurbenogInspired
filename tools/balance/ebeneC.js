// Ebene B+C (L, 22.10.): aus einem fertigen P2-Lauf mit Paaren (paare.json) einen Schritt ableiten:
//   B) Kraft je Element auf das Mittel der Elemente (wie ebeneB.js, gedämpft)
//   C) Leben je Tag (hpMul des Monsters) so, dass das SCHWÄCHSTE der 6 Paare den Tag gerade mit Reserve ZIEL schafft
//      (C2, L 20.10.: jedes Paar schafft jeden Tag, höchstens ~1 Durchbruch je Tag). Normale Tage werden dadurch schwerer,
//      Problemtage (Fliegende, Bosse) leichter – statt die ganze Kurve je Block zu verschieben.
// Annahme: Paar-R wächst etwa mit √(Kraft A × Kraft B) und fällt mit den Leben. Danach mit neuem P2-Lauf bestätigen.
//   Form (22.10., L): Turmpreise je Element so verschieben, dass ein Element nicht früh zu stark und spät zu schwach ist (oder umgekehrt):
//      Stärke je Block (nach Ausgleich des Niveaus) × Anteil des Golds, das im Block in diesem Turm steckt → Preisfaktor je Turm (gedämpft ^0,5,
//      0,7–1,4); die Form je Block ist je Element auf Mittel 1 bezogen, das Niveau regelt die Kraft je Element. Z. B. Feuer spät schwach → Türme 5–8 billiger.
//   Ziele (L 22.10.): schwächstes Paar normale Tage 1,2 (Standard ZIEL), Uffug 1,15, Betty 1,1 – Endbosse als schwerere Spitzen;
//   insgesamt schwerer/leichter über die Schwierigkeitsstufe.
//   Alle Tage inklusive Runde 1–5 (L 22.10.: im Makrobalancing erlaubt).
// Aufruf: SPIEGEL=<Eingang.json> node tools/balance/ebeneC.js <Ordner unter ergebnisse/> <Ausgang.json> [Dämpfung 0,7] [ZIEL 1,15]
const fs = require('fs'), path = require('path');
const C = require('./core'), { G } = C, S = require('./spiegel');
const [ordner, aus, dmp, zl] = process.argv.slice(2), D = +dmp || 0.7, ZIEL = +zl || 1.2, ZIEL_BOSS = { 'Uffug (Boss)':1.15, 'Betty (Boss)':1.1 }, FORM = process.env.FORM !== '0', FORMEXP = +process.env.FORMEXP || 0.5;
const dir = path.join(__dirname, 'ergebnisse', ordner);
const daten = JSON.parse(fs.readFileSync(path.join(dir, 'p2-alle.json'), 'utf8')), P = JSON.parse(fs.readFileSync(path.join(dir, 'paare.json'), 'utf8'));
const gm = a => Math.exp(a.reduce((x, v) => x + Math.log(Math.max(1e-3, v)), 0) / a.length);
const ZS = 2.0, ZE = 1.4, ziel = r => ZE + (ZS - ZE) * Math.sin(Math.PI * Math.min(1, Math.max(0, (r - 1) / 39)));
const namen = Object.keys(daten.erg), nT = daten.erg[namen[0]][0].tage.length;
const sp = { ...C.SPIEGEL }, alt = {};
// B: Kraft je Element
const Q = namen.map(x => gm([...Array(nT)].map((_, d) => gm(daten.erg[x].map(m => m.tage[d].R)) / ziel(G.MONSTERS[d].round))));
const mittel = gm(Q), kf = Q.map(q => Math.pow(mittel / q, D));
namen.forEach((x, e) => { const p = `ELEMENTS.${e}.kraft`; alt[p] = G.ELEMENTS[e].kraft; sp[p] = +(G.ELEMENTS[e].kraft * kf[e]).toFixed(4); });
// C: Leben je Tag aus dem schwächsten Paar (nach der Kraft-Änderung geschätzt)
const zeilen = [];
for (let d = 0; d < nT; d++) {
  const r = Object.entries(P.R).map(([k, v]) => { const [a, b] = k.split('+').map(n => namen.indexOf(n)); return gm(v[d]) * Math.sqrt(kf[a] * kf[b]); });
  const zielTag = ZIEL_BOSS[G.MONSTERS[d].name] || ZIEL;
  const min = Math.min(...r), f = Math.min(2, Math.max(0.5, Math.pow(min / zielTag, D)));
  const M = G.MONSTERS[d], p = `MONSTERS.${M.name}.hpMul`, h = M.hpMul || 1;
  alt[p] = h; sp[p] = +(h * f).toFixed(4);
  zeilen.push(`  Tag ${String(d + 1).padStart(2)} ${M.name.slice(0, 22).padEnd(22)} schwächstes Paar R ${min.toFixed(2)} → Leben ×${f.toFixed(2)}`);
}
// Form über Turmpreise
const formZeilen = [];
if (FORM) {
  const block = d => Math.ceil(G.MONSTERS[d].round / 5) - 1;
  const q = namen.map(x => [...Array(nT)].map((_, d) => gm(daten.erg[x].map(m => m.tage[d].R)) / ziel(G.MONSTERS[d].round)));
  const L = q.map(a => gm(a));
  const sb = [...Array(8)].map((_, b) => { const ds = [...Array(nT).keys()].filter(d => block(d) === b);
    const v = q.map((a, e) => gm(ds.map(d => a[d])) / L[e]); const mv = gm(v); return v.map(x => x / mv); });   // Form je Element und Block
  namen.forEach((x, e) => {
    const u = [...Array(8)].map(() => Array(8).fill(0));   // Gold je Turm k und Block b
    // neu investiertes Gold je Turmtyp und Block (Zuwachs gegenüber dem Vortag), nicht der Bestand – sonst zählen frühe Türme, die stehen bleiben, nur spät
    for (const m of daten.erg[x]) { let vor = Array(8).fill(0);
      m.tage.forEach((t, d) => { if (!t.setup) return; const jetzt = Array(8).fill(0);
        for (const tw of t.setup.towers) if (tw.el === e) jetzt[tw.idx] += tw.inv || 0;
        for (let k = 0; k < 8; k++) u[k][block(d)] += Math.max(0, jetzt[k] - vor[k]); vor = jetzt; }); }
    const pf = [], gew = [];
    for (let k = 0; k < 8; k++) { const sum = u[k].reduce((a, v) => a + v, 0); gew.push(sum);
      if (!sum) {   // nie gebaut: Block, ab dem man ihn sich zweimal leisten könnte
        const { budget } = require('./p2'); const d0 = [...Array(nT).keys()].find(d => budget(d).gold >= 2 * G.towerBase(e, k).cost);
        pf.push(d0 === undefined ? 1 : Math.pow(sb[block(d0)][e], FORMEXP)); continue; }
      const lg = u[k].reduce((a, v, b) => a + (v / sum) * Math.log(sb[b][e]), 0); pf.push(Math.exp(FORMEXP * lg)); }
    const norm = 1;   // keine Gold-Normierung: das Gold steckt fast ganz in späten Türmen und würde den Effekt aufheben; das Niveau regelt die Kraft je Element
    const co = { ...(G.ELEMENTS[e].costOverride || {}) }, z = [];
    for (let k = 0; k < 8; k++) { const f = Math.min(1.4, Math.max(0.7, pf[k] / norm)), alt = G.towerBase(e, k).cost, neu = Math.max(5, Math.round(alt * f / 5) * 5 || alt);
      if (k === 0) { co[k] = Math.max(5, Math.round(alt * f)); } else co[k] = neu;
      z.push(`${G.towerBase(e, k).name} ${alt}→${co[k]}`); }
    sp[`ELEMENTS.${e}.costOverride`] = co;
    formZeilen.push(`  ${x.padEnd(9)} Form je Block ${sb.map(r => r[e].toFixed(2)).join('/')} | ${z.join(', ')}`);
  });
}
sp._stand = `Ebene B+C aus ${ordner} (Dämpfung ${D}, Ziel schwächstes Paar ${ZIEL}), ${new Date().toISOString().slice(0, 16)}`;
S.speichern(sp, path.isAbsolute(aus) ? aus : path.join(process.cwd(), aus));
console.log('Kraft je Element:'); namen.forEach((x, e) => console.log(`  ${x.padEnd(9)} ×${kf[e].toFixed(2)} → ${sp[`ELEMENTS.${e}.kraft`]}`));
if (formZeilen.length) { console.log('Form über Turmpreise:'); console.log(formZeilen.join('\n')); }
console.log('Leben je Tag:'); console.log(zeilen.join('\n'));
