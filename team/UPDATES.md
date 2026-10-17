# Updates (neueste oben, höchstens 15 Einträge)

Format: `### 16.10. 17:45 · L · 2026-10-16f – gemischte Welle angepasst
- Zusammensetzung und Darstellung der gemischten Welle (Runde 36) geändert (Farbe/Größe statt Buchstabe). Neues Spiel + neu laden.
- Balancing-Skript: Ziel jetzt Endboss 40 % Bot-Reserve, Band nach oben offen bis 2,0; Spiegel testet schwächere Upgrades (×1,8 statt ×2,1) – noch nichts im Spiel.

### 17.10. 20:40 · F · 2026-10-17h – Spiel pausieren (Menü ⋯)
- Menü ⋯ → „Spiel pausieren": pausiert für alle (`G.paused`). Keine Auswertung, kein Bereit/Auslösen, kein Bauen; Banner „⏸ Spiel pausiert" mit Knopf „Weiter spielen" (auch im Menü).
- Beim Weiterspielen werden die Wellenzeiten verschoben (Uhrzeiten: ganze Tage, bis die aktuelle Welle wieder in der Zukunft liegt; Testzeit: um die Pausendauer, `cfg.shift`). Stand und Gold bleiben. Keine Zahlenänderung, nur neu laden.
### 17.10. 16:40 · L · 2026-10-17g – Stein: Delle in Runde 6–9 behoben
- Stein Kiesel ×0,4 (vorher 0,5), Schleuder ×1,0 (vorher 0,8). Laut Bot jetzt Runde 1–5 ca. 1,4–2,4 und Runde 6–9 ca. 1,2–1,5 Reserve, also nah an den anderen Elementen. Neues Spiel + neu laden.

### 17.10. 15:30 · L · 2026-10-17f – Balancing nach Schleife 9, Stein-Kurve
- Stein: Kiesel ×0,5, Schleuder ×0,8, Katapult und Felsbrocken ×1,3 (je Turm); Element-Kraft Feuer 0,62 · Eis 0,86 · Schatten 1,08 · Stein 2,26; Leben je Block leicht angepasst.
- Laut Bot: Stein in Runde 1–5 noch ca. +10 % über den anderen, in Runde 6–9 eher zu schwach (Delle bleibt). Neues Spiel + neu laden.

### 17.10. 14:10 · L · 2026-10-17e – Stein am Anfang schwächer
- F hatte recht: Stein war in Runde 1–5 etwa doppelt so stark wie die anderen (Kiesel-Massen mit Element-Kraft ×2). Neu: Kraft je Turm (`kraftT`), Stein Kiesel ×0,65, Schleuder ×0,9; die teuren Türme bleiben. Laut Bot liegt Stein in Runde 1–5 jetzt ungefähr bei den anderen. Neues Spiel + neu laden.

### 17.10. 10:25 · L · 2026-10-17d – Balancing nach Schleife 6
- Element-Kraft Feuer 0,69 · Eis 0,81 · Schatten 1,07 · Stein 2,04 (Elemente laut Bot jetzt innerhalb ±4 %; Stein gegen Fliegende 49 % der anderen).
- Leben ab Runde 16 höher (Runde 36–40 ×14,4). Ab Runde 21 noch etwas zu leicht, Schleife 7 läuft. Neues Spiel + neu laden.

### 17.10. 10:10 · L · 2026-10-17c – Schwierigkeit, Stein-Katapult früher, Faktoren nach Regel
- Beim Spielstart wählbar: **Schwierigkeit** leicht (Leben −25 %), normal, schwer (+25 %).
- Stein: **Katapult ist jetzt Turm 3** (70 Gold, trifft Fliegende), Felsbrocken Turm 4. Fähigkeiten bleiben beim jeweiligen Turm.
- Faktoren Runde 2–10 wieder streng nach der Regel (je Element ein Bonus und ein Malus je Block); die vielen Stein-Boni sind raus.
- Lebensbalken am oberen Rand sichtbar; „verdient“ und ⚔ kleiner in eigener Zeile. Neues Spiel + neu laden.

### 17.10. 09:35 · L · 2026-10-17b – erstes Balancing-Paket im Spiel
- Werte aus Balancing-Schleife 5: Element-Kraft Feuer 0,71 · Eis 0,83 · Schatten 1,04 · Stein 1,93; Upgrades flacher (×2,35/2,1/1,85/1,7/1,6, Schatten ×2,35/2,1/1,85/1,6/1,5); Stein-Katapult 100.
- Leben je 5er-Block ab Runde 11 höher (bis ×12 in Runde 36–40); Betty und späte Fliegende etwas weniger Leben.
- Runde 1–20 gelten als verlässlich, Runde 21–40 folgen nach Schleife 6. Neues Spiel + neu laden.

### 16.10. 17:10 · L · 2026-10-16e – gemischte Welle, Stellschrauben fürs Skript
- Runde 36 ist jetzt eine gemischte Welle (Überraschung für F). Neue, noch neutrale Stellschrauben: `ELEMENTS[e].kraft`, `CONFIG.hpBlock` – Werte setzt das Balancing-Skript, nicht von Hand.
- Neues Spiel + neu laden.

### 16.10. 16:20 · L · 2026-10-16d – Feuer-Turm 7 heißt jetzt Sonnenturm
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
