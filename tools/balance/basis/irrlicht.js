// Irrlicht wirkt auf die Monster im Lichtkreis (L 26.10., so war es gedacht): Schatten-Türme machen gegen Monster, die gerade in einem
// Lichtkreis sind, mehr Schaden (×buff) und ignorieren dort Rüstung (pierce) – egal, wo der Turm steht. Mehrere Kreise: der stärkste zählt.
// Leuchtfeuer (allBuff): Monster im Licht nehmen auch von anderen Elementen mehr Schaden (ohne Rüstung zu ignorieren).
// Vorher: Verstärkung für Schatten-Türme, die IM Lichtkreis standen. Nachtsicht (nachtaktive nur im Licht) unverändert.
// Als Ersetzungen geschrieben, damit dieselbe Änderung für index.html (einmalig) und für den Spiegel (basis/patch.js) gilt.
module.exports = [
  [`  // Verstärker (Irrlicht): Schatten-Türme in seinem Lichtkreis machen mehr Schaden, zu jeder Tageszeit. Mehrere Kreise: der stärkste zählt.
  const amps = towers.filter(t => t.def.buff);
  // Leuchtfeuer (Amethyst): verstärkt auch Türme anderer Elemente (ohne Rüstung zu ignorieren)
  for (const t of towers) { if (t.def.buff) continue;
    const near = amps.filter(a => (a.el === t.el || a.def.allBuff) && Math.hypot(a.x - t.x, a.y - t.y) <= a.def.light + 1e-6);
    if (near.length) { const m = Math.max(...near.map(a => a.el === t.el ? a.def.buff : a.def.allBuff)), p = Math.max(t.def.pierce || 0, ...near.map(a => a.el === t.el ? a.def.pierce : 0));
      t.def = { ...t.def, dpsNow:t.def.dpsNow * m, dmg:t.def.dmg * m, amp:m, pierce:p }; } }`,
   `  // Verstärker (Irrlicht, 26.10. L): wirkt auf die MONSTER im Lichtkreis – Schatten-Türme machen gegen sie mehr Schaden und ignorieren Rüstung,
  // egal wo der Turm steht (zu jeder Tageszeit). Mehrere Kreise: der stärkste zählt. Leuchtfeuer (allBuff): auch andere Elemente, ohne Rüstung zu ignorieren.
  const amps = towers.filter(t => t.def.buff).map(t => ({ x:t.x + .5, y:t.y + .5, r:t.def.light, el:t.el, buff:t.def.buff, pierce:t.def.pierce || 0, allBuff:t.def.allBuff || 0 }));`],
  [`lights, monsters:[], shots:[]`, `lights, amps, monsters:[], shots:[]`],
  [`  if (def.hunger) dmg *= 1 + Math.min(def.hungerMax || 0.45, def.hunger * (def.feast || 0)) * bh;`,
   `  if (def.hunger) dmg *= 1 + Math.min(def.hungerMax || 0.45, def.hunger * (def.feast || 0)) * bh;
  let litP = 0;   // Irrlicht (26.10.): Monster im Lichtkreis nimmt mehr Schaden, Schatten ignoriert dort Rüstung
  if (s.amps && s.amps.length) { let mul = 1;
    for (const a of s.amps) if (Math.hypot(m.x - a.x, m.y - a.y) <= a.r + 1e-6) { if (a.el === def.el) { mul = Math.max(mul, a.buff); litP = Math.max(litP, a.pierce); } else if (a.allBuff) mul = Math.max(mul, a.allBuff); }
    dmg *= mul; }`],
  [`  if (pct > 0) { if (on(m, 'curse')) pct = Math.max(0, pct - m.fx.curse.v); pct *= 1 - (def.pierce || 0) * (def.gemAb === 5 && def.el === 2 ? bh : 1); m.ap -= ad; }`,
   `  if (pct > 0) { if (on(m, 'curse')) pct = Math.max(0, pct - m.fx.curse.v); pct *= 1 - Math.max((def.pierce || 0) * (def.gemAb === 5 && def.el === 2 ? bh : 1), litP); m.ap -= ad; }`],
  [`  if (d.buff) return \`schießt nicht · Lichtkreis \${num(d.light)}: Schatten-Türme darin ×\${String(+d.buff.toFixed(2)).replace('.', ',')} Schaden und ignorieren \${Math.round(d.pierce*100)} % Rüstung, nachts treffen sie dort auch nachtaktive Monster\`;`,
   `  if (d.buff) return \`schießt nicht · Lichtkreis \${num(d.light)}: Monster darin nehmen von Schatten-Türmen ×\${String(+d.buff.toFixed(2)).replace('.', ',')} Schaden, \${Math.round(d.pierce*100)} % ihrer Rüstung zählen nicht, nachts sind dort auch nachtaktive Monster zu treffen\`;`],
];
