# Updates (neueste oben, höchstens 15 Einträge)

Format: `### 16.10. 16:20 · L · 2026-10-16d – Feuer-Turm 7 heißt jetzt Sonnenturm
- Turm 7 Feuer: **Sonnenturm** (vorher Phönix), seine Fähigkeit **Sonnenfeuer** (vorher Phönixflug). Werte unverändert. Betty-Platzhalter 👩‍🦱. Neu laden genügt.

### 16.10. 15:30 · L · 2026-10-16b – 40 Runden, Edelstein-Kompromiss, „immun“ ohne Effekt
- Spiel hat jetzt 48 Tage (40 Runden, 6 Zwischenbosse, 2 Endbosse). Runde 21–40 mit neuen Mechaniken – **Überraschung für F**, Werte sind Startwerte.
- Edelstein: je Turm 3 Optionen (2 Basics +30 %, 1 Unique des Turms), „einmal je Map“ entfällt.
- „Immun“ (Faktor 0) = 50 % Schaden und kein Effekt des Elements (auch kein Bremsen, Fluch, Betäuben). Neues Spiel + neu laden.

### 16.10. 14:00 · L · 2026-10-16a – 5. Monster in Block 4, Begriffe Map/Feld
- Neu vor der Uffug-Vorhaut: **Eifersüchtige Geliebte** (Runde 19, Tag 22; Stein ×1,5, Schatten ×0,75, Rüstung 25 %). Vorhaut jetzt Runde 20, Uffug Tag 24 (teilt sich Runde 20, Leben unverändert). Spiel hat 24 Tage.
- Begriffe: **Map** = Karte eines Spielers, **Feld** = einzelnes Kästchen. Edelstein-Kompromiss in `PLANUNG.md`.
- Neues Spiel + neu laden.

### 16.10. 13:40 · L · (kein Spielcode) – Balancing-Skript: glatte Bewertung, Tagesmodell, Vorwärtspfad
- `node tools/balance/pfad.js alle`: ganzes Spiel je Element (2 Spieler, Tag mit 10- und 19-Uhr-Welle), Vorschläge für Element-Kraft und Kurve. Spiegel-Datei für Teständerungen ohne `index.html`.
- Erste Tendenz: Feuer klar zu stark, Stein zu schwach, späte Tage zu leicht. Noch keine Zahlen geändert, Balance-Pause gilt weiter.

### 16.10. 12:20 · L · (kein Spielcode) – Plan V1.0 / V1.1 / V2
- `team/PLANUNG.md` Abschnitt 0: V1.0 bis Do 22.10. (40 Runden, 4 Elemente, Balancing-Skript einmal angewendet), V1.1 (8 Elemente, Grafik, Schwierigkeit), V2 (große Umbauten). Bitte lesen, Details bespricht L mit F.
- Gelesene Post nach `team/archiv/post-archiv.md` verschoben.

### TT.MM. HH:MM · L|F · VERSION – Titel` + höchstens 5 Zeilen: was, warum, worauf achten. Details stehen im Commit.

### 16.10. 00:30 · L · (kein Spielcode) – Balancing-Skript: Grundgerüst
- `tools/balance/`: lädt die Simulation direkt aus `index.html`, Testkarte, Reservefaktor, Bauplatz-Maske, gieriger Aufbau. Aufruf: `node tools/balance/run.js p1` bzw. `maske`.
- Erster Prüfpunkt P1 (Start, Runde 1): Feuer zu stark (17 statt 12 von 20 zu zweit), Stein zu schwach (6). Noch keine Zahlen geändert – Vorschläge kommen gesammelt.

### 15.10. 23:59 · F · 2026-10-15t – „Nichts im Anmarsch"-Wellen werden übersprungen
- Im Uhrzeiten-Modus fällt eine Welle weg, wenn bei keinem Spieler etwas ankommt (nur Leaks der Vorwelle zählen). Die Chronik vermerkt „übersprungen"; folgen nur leere Wellen, geht es direkt zum nächsten Tag (oder zum Sieg).
- Live-Modus unverändert. Regeländerung im Ablauf: neu laden, laufende Spiele sind nicht betroffen, bis die nächste Welle ausgewertet wird.
### 15.10. 23:50 · L · 2026-10-15s – Spiel-Archiv, Balancing-Verfahren
- Jedes Online-Spiel wird automatisch mitgeschrieben: `games/spiel1/archiv/<Spielstart>` (je Welle Kills/Gold/Durchbrüche, je Tagesende alle Türme). Auslesen: `node tools/archiv.js` bzw. `node tools/archiv.js <Spielstart>`. Fehlspiele werden beim Auslesen markiert.
- Neu: `team/BALANCING.md` (Verfahren und Prüfpunkte des Balancing-Skripts). Bitte Balance-Pause bis zum Skript (siehe Post an F).
- Keine Regeländerung, nur neu laden.

### 15.10. 22:55 · F · 2026-10-15q – Forschung „Stein bremst" entfernt
- Die Elementlabor-Forschung „Stein bremst" (−18/25/32 % Tempo ab Runde 6) ist raus: aus der Forschungsliste und aus der Simulation. Alte Spielstände mit gekaufter Stufe laufen ohne den Effekt weiter (kein Absturz).
- Stein ist an Tag 7–10 über die Faktoren (15m) angehoben; die Bremse war damit doppelt. Wirkung bitte im Testspiel prüfen.
- Neues Spiel nicht nötig, nur neu laden.

### 15.10. 22:35 · F · 2026-10-15p – Akademie: Kopfgeld-Bonus auf die ganze Welle gerundet
- Bisher wurde der Bonus (+7/14/20 %) je Monster gerundet: Bei Kopfgeld 2–5 kam bis Runde 15 oft nichts an (Stufe 1 = +0 bis Runde 15). Jetzt: Summe der Kopfgelder einer Welle × (1 + Bonus), einmal gerundet. Beispiel Runde 1, 20 Kills: 40 → 43 Gold bei +7 %.
- Gewinn über das ganze Spiel jetzt ca. +125 / +250 / +360 Gold (Stufe 1/2/3) statt +100 / +200 / +400, dafür gleichmäßig. Preise (60/100/140) bleiben, bitte im Spiel prüfen: Stufe 1 könnte früh zu günstig sein.
- Neues Spiel nicht nötig, nur neu laden (wirkt ab der nächsten Welle).

### 15.10. 22:10 · F · 2026-10-15o – Edelstein-Fähigkeit nur einmal je Feld
- Hat ein Turm schon Fähigkeit X, ist X für die anderen Türme dieses Feldes im Edelstein-Dialog gesperrt („schon bei einem anderen Turm vergeben"). Wird der Turm verkauft oder umgewandelt, ist sie wieder frei.
- Gilt nur für neue Wahlen; bereits vergebene doppelte Fähigkeiten bleiben bestehen.
- Neues Spiel nicht nötig, nur neu laden.

### 15.10. 21:50 · F · 2026-10-15n – „verdient" im Feldkopf
- Neben Gold und Kills zeigt jeder Feldkopf, wie viel Gold der Spieler insgesamt verdient hat (ohne Ausgaben, Geschenke, Kasse). Wächst wie das Gold erst, wenn die Monster in der Wiedergabe sterben.
- Neues Spiel nicht nötig, nur neu laden.

### 15.10. 21:30 · F · 2026-10-15m – Stein Tag 7–10 leichter
- Stein-Faktor: Kleine Hunde 1,75 (vorher 1), Ratten 1,4 (1), Katzen 1,4 (1), Spatzen 1,25 (0,75). Grund: Stein brauchte an Tag 7–10 2,4–2,9× das real verfügbare Gold (die anderen 1,2–1,6×). Ziel jetzt ca. 1,4–1,7×.
- Block-2-Regel „je Element ein Bonus/Malus" gilt für Stein damit nicht mehr. Maus-Boss (Tag 6, Stein 3,7×) bewusst unverändert. Werte sind Bot-Tendenzen.
- Neues Spiel + neu laden.

### 15.10. 19:30 · F · 2026-10-15l – Lavapfütze nur einmal je Schuss
- Feuer-Edelstein „Lavapfütze“: Hat der Turm mehrere Geschosse je Schuss, legt nur das erste eine Pfütze (vorher eine je Geschoss). Gilt nur für Feuer, Stein-Geröll unverändert.
- Neues Spiel + neu laden.

### 15.10. 18:40 · F · 2026-10-15k – Schwache Tage in Runde 2–5 auf Gold-Bedarf 1,5
- Pro Element ein bewusst schwacher Tag (Bot `bedarf` ≈ 1,5): Schatten Kellerasseln (Faktor 1,05, vorher 1), Feuer Nacktschnecken (0,9, vorher 1), Eis Ohrenkneifer (1,1, vorher 0,8; Messwert 1,6), Stein Mäuse (0,7, vorher 1). Die Regel „je Runde ein Bonus/Malus ±20 %" gilt in Block 1 damit nicht mehr streng.
- Stein 0,7 liegt knapp unter der bisherigen Spanne (0,75–1,75). Werte sind Bot-Tendenzen, bitte im Spiel prüfen.
- Neues Spiel + neu laden.

### 15.10. 17:45 · F · 2026-10-15j – Silberfische langsamer
- Silberfische Tempo 1,2 → 1,0. Grund: Stein brauchte an Tag 1 ca. das Doppelte an Gold (Bot `bedarf`: 1,9 gegen 0,8–0,9), weil geworfene Steine schnelle Ziele schlecht treffen. Mit 1,0 liegen alle Elemente bei 0,7–0,8. Kiesel-Kosten/-Schaden waren nicht der Hebel.
- Noch offen (Vorschlag, nicht eingebaut): Faktoren Block 1 neu verteilen (Stein-Malus von Runde 3 auf Runde 5), Schatten Tag 2/3 schwach (1,9/1,6, Rüstung der Kellerasseln).
- Neues Spiel + neu laden.

### 15.10. 16:50 · F · 2026-10-15i – Spiel aufgeben
- Menü ⋯ → „Spiel aufgeben …“ (mit Rückfrage): beendet das Spiel für alle als verloren, die Statistik erscheint, danach „Neues Spiel“. Vorher musste man alle Türme verkaufen und eine Welle durchlassen.
- Neu laden.

### 15.10. 14:00 · F · 2026-10-15h – Upgrade/Verkaufen über dem Turm
- Beim angewählten Turm erscheinen direkt darüber ein roter Pfeil ⬆ (Upgrade, mit Preis) und ein Goldtopf 💰 (Verkaufen, mit Erlös), bei Edelstein zusätzlich 💎. Tippen öffnet wie bisher das Bestätigungsfenster. Die Knöpfe unter der Karte entfallen. Am oberen Rand erscheinen sie unter dem Turm.
- Neu laden.

### 15.10. 13:40 · F · 2026-10-15g – Edelsteine als kleiner Buff
- Ziel: Edelstein-Fähigkeit ≈ +15 % Wirkung (Tag 5: etwa +1 Kill bei 6–7). Zu starke Fähigkeiten gedämpft: Eis Großer Ball (+30 % Fläche), Großer Sturm (+25 % Fläche, +20 % Schaden), Eisblock 0,35 s, Haut vereist 3 s; Schatten Nachtjäger +25 %; Stein Prellstein 30/15 %, Reichweite +0,5 Felder, Nachbeben 25 %.
- Messung grob (nur 7 brauchbare Test-Türme): Median Schadensgewinn Tag 5 jetzt meist 0–25 %, Stein liegt noch eher bei ~20 %. Bedingte Fähigkeiten (Fliegende, Kill-Auslöser) nicht gemessen.
- Neues Spiel + neu laden.

### 15.10. 13:10 · F · 2026-10-15f – Lavapfütze schwächer
- Lavapfütze macht 20 % statt 40 % des Turm-Schadens/s (Wunsch F, nach freier Fähigkeitswahl wirkt sie auf jedem Turm). Sonst nichts geändert. Neues Spiel + neu laden.
