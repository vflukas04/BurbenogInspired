# Updates (neueste oben, höchstens 15 Einträge)

Format: `### 18.10. 11:30 · F · 2026-10-18c – Zweite einzigartige Edelstein-Fähigkeit je Turm
- Jeder Turm hat jetzt **4 Edelstein-Wahlmöglichkeiten** (2 Basics, 2 Uniques): neu `ABILITIES[e][8..15]` = Nummer 8 + Turmnummer. Beispiele: Funkenregen, Dauerglut, Stichflamme, Flächenbrand, Zenit (Feuer); Tiefschnee, Frostbiss, Nullpunkt (Eis); Schattenstreich, Todesblick, Entkräften (Schatten); Streuschuss, Zerschmettern, Königlicher Befehl (Stein). Irrlicht: Geisterlicht.
- Neue Merkmale in `hit`/`kill`: `burnBonus`, `chillBonus`, `sun`, `crit`, `execute`, `fresh`, `drain`, `curseSlow`, `freeze`, `burnWave`; Rest über vorhandene Hebel (Schüsse, Reichweite, Pool, Explosion, Rüstungsschaden).
- Zahlen sind Startwerte, nur auf Abstürze geprüft (32 Türme × Stufe 1–6, Kurzsimulation). **Wenn L das nicht will: Commit 18c rückgängig machen.** Neu laden; bestehende Steine bleiben unverändert.

### 18.10. 02:15 · L · 2026-10-18a – (keine Regeländerung) Balancing-Lauf A verworfen
- `kraftT` für Feuer neutral angelegt, sonst nichts im Spiel geändert.
- Test „Kraft je Turm“ für Feuer/Stein verbessert das Band je Block nicht (16,0 % statt 15,3 % Abweichung) → verworfen. Befund: Der Bot baut fast nur Turm 1–4 und rüstet auf; höhere Türme lohnen sich zu wenig. Details `BALANCING.md`.

### 18.10. 10:05 · F · 2026-10-18b – Katapult: Salve statt Weitwurf
- Das einzigartige Edelstein-Talent von Stein Turm 3 (Katapult) ist jetzt **Salve**: jeder 2. Wurf schickt zwei weitere Brocken seitlich neben das Ziel (voller Schaden, Abstand 0,9 × Fläche; `d.salvo` in `gemMods`, `launch`). Weitwurf entfällt.
- Der Katapult wirft nur alle 4 s, deshalb „jeder 2." statt „jeder 4.". Kurztest (1 Katapult, Tag 7): ungefähr so stark wie Weitblick. Zahlen sind Startwerte. Neu laden; bereits eingesetzte Weitwurf-Steine (`ab` 3) wirken nun als Salve.
### TT.MM. HH:MM · L|F · VERSION – Titel` + höchstens 5 Zeilen: was, warum, worauf achten. Details stehen im Commit.

### 17.10. 22:15 · L · 2026-10-17j – Betty länger „censored“, Git-Verlauf umgeschrieben
- Endboss 2: Pause beim „Ausziehen“ 1,5 s statt 1,2 s (bleibt so lange stehen). Neues Spiel + neu laden.
- Stärkenband je Block: Stein zählt Fliegertage mit Gewicht 0,25 statt gar nicht.
- **Git-Verlauf neu geschrieben** (Autor-Adressen ersetzt), alle Commit-IDs haben sich geändert → siehe Post an F.

### 17.10. 22:00 · L · 2026-10-17i – Feinschliff Runde 21–40, Balancing-Prüfungen
- Drei Monster ab Runde 21 wirken jetzt versetzt statt alle an derselben Stelle (Inhalt bleibt Überraschung für F). Neues Spiel + neu laden.
- Balancing-Skript prüft neu: **Stärkenband je 5er-Block** (alle Elemente ±10 % um das Block-Mittel) und **Kraft je Gold je Turmstufe** (darf mit der Stufe nicht fallen). Erster Befund: Stein Turm 5–8 liegen je Gold unter Katapult/Felsbrocken, Feuer Turm 2–6 unter dem billigeren Funken. Noch keine Werte geändert.
- Kopf von `UPDATES.md` repariert.

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

### 16.10. 17:45 · L · 2026-10-16f – gemischte Welle angepasst
- Zusammensetzung und Darstellung der gemischten Welle (Runde 36) geändert (Farbe/Größe statt Buchstabe). Neues Spiel + neu laden.
- Balancing-Skript: Ziel jetzt Endboss 40 % Bot-Reserve, Band nach oben offen bis 2,0; Spiegel testet schwächere Upgrades (×1,8 statt ×2,1) – noch nichts im Spiel.

### 16.10. 17:10 · L · 2026-10-16e – gemischte Welle, Stellschrauben fürs Skript
- Runde 36 ist jetzt eine gemischte Welle (Überraschung für F). Neue, noch neutrale Stellschrauben: `ELEMENTS[e].kraft`, `CONFIG.hpBlock` – Werte setzt das Balancing-Skript, nicht von Hand.
- Neues Spiel + neu laden.

### 16.10. 16:20 · L · 2026-10-16d – Feuer-Turm 7 heißt jetzt Sonnenturm
- Turm 7 Feuer: **Sonnenturm** (vorher Phönix), seine Fähigkeit **Sonnenfeuer** (vorher Phönixflug). Werte unverändert. Betty-Platzhalter 👩‍🦱. Neu laden genügt.

### 16.10. 15:30 · L · 2026-10-16b – 40 Runden, Edelstein-Kompromiss, „immun“ ohne Effekt
- Spiel hat jetzt 48 Tage (40 Runden, 6 Zwischenbosse, 2 Endbosse). Runde 21–40 mit neuen Mechaniken – **Überraschung für F**, Werte sind Startwerte.
- Edelstein: je Turm 3 Optionen (2 Basics +30 %, 1 Unique des Turms), „einmal je Map“ entfällt.
- „Immun“ (Faktor 0) = 50 % Schaden und kein Effekt des Elements (auch kein Bremsen, Fluch, Betäuben). Neues Spiel + neu laden.
