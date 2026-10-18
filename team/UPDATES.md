# Updates (neueste oben, höchstens 15 Einträge)

Format: `### 18.10. 23:45 · F · 2026-10-18k – Stein-Block-Faktor 0,34 → 0,6
- Grund: Testspiel 18j (Stein + Feuer, zwei Spiele, beide nach Tag 2 verloren): Beide Spieler hatten nur Turm 1 (Gold reichte nicht für mehr), Stein-Kiesel mit Kraft ×0,4 × Block ×0,34 schaffte in Tag 2 (10 Uhr) 0 Kills. Der Bot kauft sofort Schleuder und sieht das nicht.
- `ELEMENTS.Stein.kraftBlock[0]` 0,6. Bot (Tendenz): Stein Tag 2–5 jetzt 0,68 / 0,90 / 0,90 / 0,98, also zu leicht; Stein-Malus an Tag 3 ist damit weg. Wird nach dem nächsten Testspiel feiner gestellt (Kiesel-Anteil `kraftT` eher als Block-Faktor). Neues Spiel + neu laden.

### 18.10. 23:30 · F · 2026-10-18j – Block 1 (Tag 1–6) neu abgestimmt, Anzeige ohne Zahlen
- Ziel: Jedes Element hat genau einen schweren Tag (Malus, Bedarf ÷ verfügbar höchstens etwa 2) und einen leichten (Bonus, etwa 1,0); an dem Tag ist nur dieses eine Element schwer, die anderen etwa 1,5, damit der Partner auffängt. Ringregel als Ganzes (Leben, Rüstung, Faktoren), nicht nur der Schadensfaktor.
- Gemessen (Bot, Tendenz): Feuer Tag 2 2,09, Stein Tag 3 2,23, Eis Tag 4 1,90, Schatten Tag 5 2,13; Bonus-Tage Stein T2 0,89, Eis T3 1,07, Schatten T4 1,28, Feuer T5 1,08; Maus-Boss etwa 1,6–2,0. Neue Stellschraube `kraftBlock` (Feuer 1,466 / Eis 1,12 / Schatten 1 / Stein 0,34 in Runde 1–5), Faktoren Tag 2–5 und Boss in MONSTERS, Kellerasseln Rüstung 13 %, Maus-Boss Leben ×5,5. Faktorspanne jetzt 0,5–1,75.
- Anzeige: Monster-Info und Kopfzeile nennen nur noch „effektiv / neutral / ineffektiv“ (`eff` am Monster). Neues Spiel + neu laden. Lukas: Kiesel ist in Tag 1–5 durch Stein ×0,34 sehr schwach (Einsteiger-Falle P8a); bei Bedarf `kraftBlock[0]` zurück auf 1 und die Faktoren aus 18g nehmen.

### 18.10. 23:00 · F · 2026-10-18i – Tag 2 und 4 etwas leichter
- Kellerasseln: Rüstung 20 % → 13 % (Schatten ignoriert Rüstung nicht, daher traf es ihn am meisten): Schatten Tag 2 Bedarf 1,75 → 1,4. Ohrenkneifer: Stein-Faktor 1,0 → 1,1 (Stein Tag 4 1,71 → 1,55). Bot-Tendenz. Neues Spiel + neu laden.

### 18.10. 23:10 · F · 2026-10-18h – Tag 1–6: Malus/Bonus kräftiger, neue Stellschraube kraftBlock
- Neu: `ELEMENTS[e].kraftBlock` (Schaden je Element und 5er-Block, neutral 1; Zwischenbosse neutral). Block 1: Feuer ×1,466, Eis ×1,12, Schatten ×1, Stein ×0,34 (Kiesel wird in Tag 1–5 damit noch schwächer, Stein-Fläche bleibt vorn).
- Faktoren Tag 2–5 (Ringregel bleibt): Malus 0,75, Bonus 1,75 (T2 Feuer 0,75/Stein 1,75; T3 Stein 0,75/Eis 1,3; T4 Eis 0,8/Schatten 1,75; T5 Schatten 0,75/Feuer 1,75).
- Gemessen (Bot, Bedarf ÷ verfügbares Gold): Ø Tag 1–5 etwa 1,5 je Element; Malus-Zellen 1,3–2,4. Grenzen: Eis T4 bleibt bei 2,4 (Stufenwerte des Bots), Stein T3 nur 1,5. Tendenz, kein Spielgefühl. Neues Spiel + neu laden.

### 18.10. 21:50 · F · 2026-10-18g – Archiv: Türme zu jedem Tagesende statt nur am letzten
- Fehler im Archiv: `days` (Türme am Tagesende) enthielt meist nur den letzten Tag. Ursache (wahrscheinlich): Jede Welle schrieb `days: {}` mit `merge:true`, und Firestore ersetzt eine leere Map als Ganzes, löschte also die früheren Tage. `archDoc` lässt leere `days`/`slots` jetzt weg. Gilt ab neuem Spiel; alte Archive bleiben lückenhaft.
- Keine Spielregel geändert.

### 18.10. 21:15 · F · 2026-10-18f – Archiv: Zeitpunkt der Geschenke
- Jedes Geschenk (Gold und Edelsteine) merkt sich Tag, Welle und Uhrzeit (`d`, `s`, `at`). Im Archiv stehen sie je Spieler als `giftLog` und `gemGiftLog` in `days[Tag].lanes[i]` (die Summe `gifts` bleibt). Für die Auswertung von Testspielen. Bereits laufende Spiele haben die Angaben nicht; neu laden, neues Spiel.

### 18.10. 12:30 · L · 2026-10-18d – Monster-Bilder, Faktor-Regel, Balancing-Optimierer
- **Erste Monster-Bilder im Spiel** (Besoffene Penner, Uffug, Mehlmotten mit Kokon und Motte, Betty): Ansicht nach Laufrichtung, Emoji als Rückfall. Prompts und Vorgehen: `team/GRAFIK.md`.
- Faktor-Regel je Block geprüft: nur Block 7 verletzt (Stein ohne Malus) → Wargreiter Schatten 1,5 / Stein 0,75. Neues Spiel + neu laden.
- Balancing: neue Prüfpunkte P6 ±5 %, P8a Turmstufen, P8 Turmnutzung, P9 Edelsteine, P10 Forschung; `optimierer.js` (zufällige Reihenfolge, nur Verbesserungen werden übernommen) läuft, alles im Spiegel. Befund: Upgrades schlagen höhere Türme je Gold. Stein-Fläche/Kiesel: Vorschlag nur im Spiegel, **erst mit F absprechen**.
- Einwände aus Testspielen werden in `BALANCING.md` als Learning fürs Skript eingetragen (F's Kiesel-Einwand ist der erste).

### 18.10. 11:30 · F · 2026-10-18c – Zweite einzigartige Edelstein-Fähigkeit je Turm
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
