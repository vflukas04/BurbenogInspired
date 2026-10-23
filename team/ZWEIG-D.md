# Zweig D – deterministisches Balancing (L, ab 24.10.)

Eigener Zweig, wird **nicht** mit der C-Kette (`spiegel-C*.json`) vermischt, solange er nicht überzeugt. Dateien: `tools/balance/d/`, Spiegel `tools/balance/spiegel-D*.json`.

## Idee (L)
- **Grundturm:** keine Effekte, alle gleiche Schussrate und Reichweite, Schaden/Schuss ∝ Gold. Schon ausdifferenziert nach Turm (Treppe, höhere Türme etwas mehr je Gold) und Upgrades (0,9/1,0/1,1/1,2/1,3).
- **Wechselkurse:** Jede Abweichung vom Grundturm wird mit Schaden/Schuss bezahlt (oder bekommt mehr, z. B. nur Fliegende / keine Fliegende): Schussrate, Reichweite, Fläche, Brennen, Bremsen/Frieren, Fluch, Stein-Rüstungsschaden. Pro Merkmal **ein Übersetzungsfaktor** (bzw. eine kleine Kurve), den der Bot später nachjustiert – statt jeden Turm einzeln.
- **Zielbild:** die heutigen Türme. Sie werden über die Wechselkurse so beschrieben, dass sie ihnen möglichst entsprechen (das neue Balancing wird trotzdem spürbar). Sondertürme (Irrlicht, Frostnova, Nacht, Stein-Luftabwehr) erst am Ende, wenn der Rest stabil ist.
- **Monster:** Leben, Rüstung, Tempo in Relation zum bis dahin verdienten Gold. Sondereffekte (Blinken, Teleport, Herz, Reiter …) möglichst in Tempo/Leben übersetzen. Fliegend: vermutlich über die Turmfaktoren abgedeckt. Immunität nur mit festem Aufschlag, wenn nicht ein Partner entsprechend profitiert.
- **Faktoren:** nach Block wachsend wie in C9 (Bonus 1,10 … 1,45, Malus 0,90 … 0,55).

## Merkmale und Messweg
| Merkmal | Übersetzung (Ansatz) | Messung |
|---|---|---|
| Schussrate | Schaden/s gleich, aber Überschuss: hoher Schaden/Schuss verschwendet mehr an fast toten Monstern (L) → Faktor > 1 für langsame Türme nötig | echte Leben, Wellen aller Tage |
| Reichweite | Wirkzeit ≈ Wellendauer + abgedeckte Wegstrecke ÷ Tempo (Hypothese, siehe unten) | D2a (Wegstrecke, fertig) + Simulation |
| Fläche | Treffer je Wurf × Rand-/Mittelanteil, hängt am Monsterabstand | Simulation, normaler Abstand und Schwarm |
| Bremsen/Frieren | relative Zusatzschüsse je Wegstück für die anderen Türme: 1 ÷ (1 − Bremsung) im gebremsten Anteil | Simulation mit Bezugstürmen |
| Fluch | +Schaden für alle Türme × Anteil der verfluchten Zeit, Rüstung − | Simulation mit Bezugstürmen |
| Brennen | Brennschaden × Dauer (eigene Map + Partner), gedeckelt durch Stapelung | Simulation, Anteil eigene/Partner-Map |
| Stein-Rüstungsschaden | entfernte Rüstungspunkte × Wert der Rüstung für alle Türme | Simulation |
| nur / keine Fliegende | Aufschlag auf Schaden/Schuss (bisher +50 % / +10 %) | Fliegertage / übrige Tage |

## D2a Reichweite ↔ Wegstrecke (24.10., `d/reichweite.js`)
Mittel der 5 besten Bauplätze (≥ 2 Felder auseinander), Maps 0–3 als Wiese:

| Reichweite (Felder) | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|
| Wegstrecke (Felder) | 6,7 | 11,5 | 15,8 | 22,5 | 29,7 | 37,9 |

Im Bereich der Türme (3–7) wächst die Wegstrecke etwa mit Reichweite^1,4 (lokal 1,0–1,6). Die Maps unterscheiden sich kaum (±5 %).
**Wichtig [Hypothese]:** Bei 20 Monstern im Abstand 0,9 s ist meist mehr als ein Monster in Reichweite – ein Turm schießt dann ohnehin ununterbrochen. Reichweite bringt dann nicht „mehr Schüsse je Monster“, sondern vor allem längere **Wirkzeit** je Welle (vorne früher, hinten länger) und mehr Zeit für Nachzügler/Leaks. Erwarteter Wert ≈ (Wellendauer + Wegstrecke ÷ Tempo) – deutlich flacher als die Wegstrecke selbst. Muss per Simulation geprüft werden.

## Nächste Schritte
1. D1 Grundturm im Simulator (Kopie eines Turms ohne Effekt, Rate/Reichweite fest, Schaden ∝ Gold).
2. D2 Wechselkurse messen: Rate, Reichweite, Fläche, dann Effekte (echte Leben, mehrere Tage, Maps 0–3).
3. D3 heutige Türme als Grundturm + Merkmale beschreiben, Schaden/Schuss folgt → `spiegel-D1.json`.
4. D4 Monster nach Einkommen, D5 Bot-Lauf nur zur Prüfung.
