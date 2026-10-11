# Merkliste BurbenogInspired

Stand: 11.10.2026, nach dem ersten Testabend.

## Offene Wünsche (vorgemerkt)
### Aus Lukas' Rückmeldung 11.10. vormittags
- [ ] Vorschau: Name der nächsten Runde anzeigen, mit Info-Knopf (Stärken/Schwächen je Element, fliegend, Rüstung, Leben).
- [ ] Türme leicht abschwächen: bei jedem Turm genau einen Wert senken (Feuerrate, Reichweite, Schaden oder Geschosse), nicht überall alles. Danach Monster ggf. +20 % Leben. Mit `tools/balance.js` prüfen.
- [ ] Forschung leicht teurer (nicht zu teuer).
- [ ] Monsterleben zu viert ×4 oder ×4,5 (jetzt ×3,5). Lukas schwankt; Vorschlag: ×4, dann testen.
- [ ] Element-Balance mit Tests prüfen (Lukas: „unumgänglich“). Siehe Analyse unten: Stein ist im Bot-Test deutlich zu stark, Schatten zu schwach. Das widerspricht dem Eindruck aus echten Spielen (dort war Schatten stark).
- [ ] Grafik (höchste Priorität): Türme und Geschosse. Pfeile, Feuerbälle, kurzes Aufleuchten, Erdbeben-Wackeln. Geschosse als Objekte mit Flugzeit; langsame Flächen-Geschosse zielen auf die aktuelle Position und treffen deshalb oft nicht mittig; Flächenschaden fällt nach außen ab.
- [ ] Freies Grafikpaket einbauen: Lukas hat das Kenney-ZIP (Tower Defense, CC0) in seinem Download-Ordner. In der neuen Sitzung anhängen lassen oder über den verknüpften Rechner holen. Grafiken nach `assets/` legen, Lizenzhinweis in die README.

### Vom Testabend
- [ ] Gold direkt aufs Konto, sobald ein Monster stirbt: nicht schon vor Rundenstart sichtbar, aber auch nicht erst am Rundenende. *Klären:* Gilt das auch, wenn niemand die Wiederholung anschaut?
- [ ] Fliegende: Pro Element dürfen höchstens 3 Türme Fliegende angreifen, **zusätzlich** zur Regel „Stein erst ab Turm 4“. Beispiele für Stein: Turm 4, 6, 8 oder 4, 5, 7. Für die anderen Elemente je 3 Türme festlegen (Eis bleibt ohne Verlangsamung gegen Fliegende).
- [ ] Betäubung: höchstens 2 Betäubungstürme (Stein). Dafür **Zufall**: Jeder Treffer betäubt nur mit 10–40 % Wahrscheinlichkeit (je nach Turm und Stufe), die Dauer darf dafür **länger** sein. Wichtig: Den Zufall mit festem Seed würfeln (z. B. aus `startAt`, Tag, Welle, Spieler), damit Berechnung und Wiederholung auf allen Handys gleich bleiben.
- [ ] Schatten: Lichttürme, die in ihrem Umkreis die Nachteile durch Dunkelheit aufheben (19 Uhr, Bewölkt, Gewitter usw.).
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

## Element-Analyse 11.10. (Bot, `tools/balance.js`)
- Anteil am Gold bei 3–4 Spielern: Stein 87 %, Feuer 15 %, Eis 8 %, Schatten 4 %. Der reichste Spieler war in 7 von 8 Spielen Stein.
- Zwei Spieler mit demselben Element: Stein gewinnt ohne Durchbruch, Feuer verliert an Tag 13, Eis an Tag 9, Schatten an Tag 6.
- Kills von 10 Monstern (je 2 gleich starke Türme): Ab Runde 9–12 bricht Eis und Schatten ein, Stein und Feuer halten länger. Gegen die späten Runden kommt mit diesen Türmen niemand an. Erwartbar, weil der Test ohne Upgrades und Forschung läuft.
- Vermutete Ursachen: (1) 20 Monster dicht hintereinander (spawnGap 0,5 s) machen Flächenschaden extrem stark. (2) Stein betäubt mit fast allen Türmen und hält Gruppen dauerhaft fest (geplant: höchstens 2 Betäubungstürme). (3) Bei 2 Spielern fällt für Schatten die Hälfte der Wellen weg (19 Uhr). (4) Die Rüstung wächst sehr steil, Turmschaden bleibt dadurch gegen Rüstung hängen. Schatten müsste davon profitieren, kommt aber wegen (3) und Bewölkt/Regen nicht dazu.
- Ideen: spawnGap auf 0,8–1,0 s, Flächenschaden mit Abfall nach außen (passt zu eurer Geschoss-Idee), Betäuben auf 2 Türme begrenzen, Lichttürme für Schatten.
- Lukas' Sicht zu „Reiche werden reicher“: gewollt, solange die Elemente klare Schwächen haben und der Reiche teilen muss. Dafür muss aber jedes Element irgendwo schwach sein. Stein ist es im Moment kaum.

## Technik
- **Firestore-Testmodus läuft nach 30 Tagen ab (ca. 9. November).** Vorher die Regeln aus der README unter Firestore → Regeln eintragen, sonst hört das Online-Spiel auf zu funktionieren.
- Wer den Link kennt, kann den Spielstand verändern. Für Freunde okay. Für mehr Spieler bräuchte es eine Anmeldung.
- Wellen werden nur berechnet, wenn jemand die Seite offen hat. Bei echten Uhrzeiten heißt das: Die Welle läuft beim nächsten Öffnen nach. Das ist so gewollt, sollte aber im Spiel erklärt werden.
- `index.html` hat inzwischen rund 900 Zeilen. Vor großen Umbauten lohnt sich eine Aufteilung in Spieldaten, Simulation und Oberfläche.

## Grafik
- Jetzt: Emojis. Die Darstellung hängt vom Gerät ab, iPhone und Android sehen unterschiedlich aus.
- Schneller nächster Schritt: freie Grafikpakete (Kenney.nl, CC0) für Türme, Gelände und Effekte.
- Mit Civitai/Stable Diffusion: 20 Monster und 32 Türme in einheitlichem Stil generieren, Hintergrund entfernen, auf 64×64 px verkleinern. Das sind gut 2–3 Abende Arbeit. Es lohnt sich, wenn die Regeln (vor allem die Türme) stehen. Sonst zeichnet man vieles doppelt.
