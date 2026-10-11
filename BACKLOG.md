# Merkliste BurbenogInspired

Stand: 11.10.2026, nach dem ersten Testabend.

## Offene Wünsche (vorgemerkt)
- [ ] Gold direkt aufs Konto, sobald ein Monster stirbt: nicht schon vor Rundenstart sichtbar, aber auch nicht erst am Rundenende. *Klären:* Gilt das auch, wenn niemand die Wiederholung anschaut?
- [ ] Stein trifft Fliegende erst ab Turm 4 (jetzt ab Turm 3).
- [ ] Schatten: Lichttürme, die in ihrem Umkreis die Nachteile durch Dunkelheit aufheben (19 Uhr, Bewölkt, Gewitter usw.).
- [ ] Stein: weniger Betäuben, höchstens 2 Türme mit dieser Fähigkeit.
- [ ] „Uffug-Vorhut“ umbenennen in „Uffug Vorhaut“.
- [ ] Chat in der Chronik, damit die Spieler sich schreiben können.
- [ ] „Verloren“ erst am Ende der Runde melden, nicht mitten am Tag.
- [ ] Grafik: echte Sprites statt Emojis (siehe unten).

## Erkenntnisse aus 54 simulierten Spielen (2, 3 und 4 Spieler, je 3 Wetter-Seeds und 3 Elementverteilungen)
Ein einfacher Computerspieler baut gierig: höchster bezahlbarer Turm, danach Upgrades, Forschung nach Priorität.

| Spieler | ohne Forschung gewonnen | mit Forschung gewonnen | typische Niederlage |
|---|---|---|---|
| 2 | 6/9 | 8/9 | Tag 13 (Oktopusse) |
| 3 | 6/9 | 9/9 | Tag 13 |
| 4 | 9/9 | 9/9 | – |

1. **Reiche werden reicher.** Ein Spieler sammelt fast alles Gold (z. B. 29.577 gegenüber 88–1.168 bei den anderen). Wer stark ist, tötet auch die Leaks der Nachbarn und kassiert deren Kopfgeld. Das Schenken mit 10 % Gebühr gleicht das nicht aus. Ideen: Kopfgeld für Leaks teilen (z. B. 50 % an den Spieler, dessen Welle es war), Mindesteinkommen pro Welle oder ein Teil jedes Kopfgelds automatisch in die Gemeinschaftskasse.
2. **Schwierigkeit verläuft flach und kippt dann.** Die Tage 1–12 haben fast nie Durchbrüche, an Tag 13 kommt die Klippe. Ideen: Monsterleben weniger steil wachsen lassen (×1,4 statt ×1,5), dafür frühe Runden etwas härter. Oder jede Runde einen kleinen Spezialeffekt einbauen (Fliegende, Rüstung, Schnelle), damit früh Entscheidungen zählen.
3. **Oktopusse (Tag 13) entscheiden fast jede Niederlage.** Feuer ist dort fast nutzlos, und wer Feuer spielt, kann sich kaum umstellen. Das ist als Rätsel gewollt, braucht aber eine Gegenmaßnahme, die man vorher sieht und planen kann, z. B. eine Vorschau auf die nächsten 2–3 Monster.
4. **Schatten ist dreifach benachteiligt:** schießt um 19 Uhr nicht, verliert bei Bewölkt/Regen/Gewitter und hat die schwächste Summe der Monster-Faktoren (Feuer 25,0 · Eis 27,25 · Schatten 19,5 · Stein 21,0). Die geplanten Lichttürme sind deshalb wichtig. Zusätzlich 1–2 Monster stärker anfällig für Schatten machen.
5. **Forschung ist zu billig.** Mit Forschung gewinnt der Bot fast immer. Später fallen 150–600 Gold kaum ins Gewicht. Ideen: Preise mit der Spielerzahl skalieren oder pro Tag nur eine Forschung erlauben.
6. **Zu viert ist es zu leicht**, trotz ×3,5 Monsterleben. Allerdings spielt der Bot gieriger und effizienter als Menschen. Euer Eindruck aus echten Tests zählt mehr.
7. **Wetter:** Sonnig und Bewölkt zusammen 42 %. Die Verteilung passt, Extremwetter bleiben selten.
8. **Karten:** Weglängen 27–32, Gelände 8–10 Wald/Sumpf. Kürzere Wege lassen weniger Zeit zum Schießen, bekommen aber weniger teures Gelände. Fair genug.

## Technik
- **Firestore-Testmodus läuft nach 30 Tagen ab (ca. 9. November).** Vorher die Regeln aus der README unter Firestore → Regeln eintragen, sonst hört das Online-Spiel auf zu funktionieren.
- Wer den Link kennt, kann den Spielstand verändern. Für Freunde okay. Für mehr Spieler bräuchte es eine Anmeldung.
- Wellen werden nur berechnet, wenn jemand die Seite offen hat. Bei echten Uhrzeiten heißt das: Die Welle läuft beim nächsten Öffnen nach. Das ist so gewollt, sollte aber im Spiel erklärt werden.
- `index.html` hat inzwischen rund 900 Zeilen. Vor großen Umbauten lohnt sich eine Aufteilung in Spieldaten, Simulation und Oberfläche.

## Grafik
- Jetzt: Emojis. Die Darstellung hängt vom Gerät ab, iPhone und Android sehen unterschiedlich aus.
- Schneller nächster Schritt: freie Grafikpakete (Kenney.nl, CC0) für Türme, Gelände und Effekte.
- Mit Civitai/Stable Diffusion: 20 Monster und 32 Türme in einheitlichem Stil generieren, Hintergrund entfernen, auf 64×64 px verkleinern. Das sind gut 2–3 Abende Arbeit. Es lohnt sich, wenn die Regeln (vor allem die Türme) stehen. Sonst zeichnet man vieles doppelt.
