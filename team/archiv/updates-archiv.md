# Archiv: ältere Updates (neueste oben)

### 21.10. 10:40 · L · 2026-10-21c – Monster-Bilder nachgeschärft
- Jetzt haben alle Monster Bilder. Fliegende in der Seitenansicht waagerecht gedreht, zu große Vorderansichten einzelner Tiere verkleinert (kein Größensprung mehr in Kurven). Neu laden reicht.

### 21.10. 10:00 · L · 2026-10-21b – Monster größer, Trefferreaktion
- Monster-Bilder ca. 30 % größer, Lebensbalken über dem Bild. Alle Bilder werden beim Start geladen (vorher kurz Emojis, wenn eine Ansicht zum ersten Mal kam, z. B. in Kurven).
- Treffer: Monster blitzt kurz weiß auf und wird leicht zurückgestoßen (nur Anzeige). Ein Monster ab Runde 21 hat eine kleine optische Überraschung.
- Nur Anzeige, keine Regeländerung; neu laden reicht.

### 21.10. 06:30 · L · (keine Spieländerung) – Turm-Prüfstand, Kandidat A
- `node tools/balance/turm.js` misst Kraft je Gold je Turm und Stufe (Ebene A). Kandidat `tools/balance/spiegel-A.json`: Turmwerte und Upgrade-Schwerpunkt je Stufe (Code-Patch nur im Spiegel, `basis/patch.js`), Abweichung 16 %. Spielbar: `spiegel-a.html` (eigenes Spiel `spiegel2`).
- Befund: Upgrades waren vor allem über die Reichweite zu stark. Erster Bericht vom 20.10. hatte einen Messfehler (Referenzturm verfluchte), Zahlen dort überhöht.
### 21.10. 01:30 · L · 2026-10-21a – Bilder für (fast) alle Monster
- Alle Monster außer einem haben jetzt Bilder (Seite/vorne/hinten nach Laufrichtung, Emoji nur noch als Rückfall). Fehlt eine Ansicht, kommt die Seitenansicht.
- Betty läuft mit echten Laufbildern (8 Bilder), alle anderen wippen wie bisher. Details `GRAFIK.md`. Nur Anzeige, keine Regeländerung; neu laden reicht.
### 20.10. 19:00 · L · (keine Spieländerung) – Makrobalancing: Basis eingefroren, Testseite, neuer Bot
- Spiegel-Läufe rechnen nur noch auf der eingefrorenen Basis 044d8c0 (`tools/balance/basis/`). Spielbar: `spiegel.html` (eigenes Spiel `spiegel1`).
- Bot: Konsolidieren (baut jetzt teure Türme), Freischaltung nur mit Neubau, Edelsteine je Turmtyp. Ergebnis Basis + Spiegel: Feuer 0,69 / Eis 1,26 / Schatten 0,93 / Stein 1,22, ab Runde 26 viel zu leicht, Paare mit Feuer verlieren am Bot. Details `BALANCING.md` → „Stand 20.10. abends“.
### 20.10. 03:00 · L · (keine Spieländerung) – Balancing-Bot mit Vorausschau und gemischten Paaren
- `VORAUS=1 node tools/balance/p2.js alle`: Bot plant heute/morgen/übermorgen, kauft Freischaltungen als Investition (vorher nie). `node tools/balance/paare.js <Ordner>`: gemischte Paare, prüft F's Ringregel (fängt der Partner auf?).
- Befund (Spiel 19f, ohne Spiegel): Türme 5–8 werden jetzt gebaut, aber nur 0–18 % des Turmgolds; Feuer wird mit Vorausschau schwächer (0,79). Malus-Tage fängt meist mindestens ein Partner auf; Problemtage: Fliegende und Betty. Details `BALANCING.md`.
### 19.10. 22:50 · F · 2026-10-19f – Block 1 auf die Spielweise der Menschen eingestellt
- Testspiel 19e (Stein + Feuer): Der Stein-Spieler baute nur Kiesel und hob ihn an (Schleuder erst Tag 5), verdiente ab Tag 3 ein Drittel des Feuer-Spielers (Kills im ersten Durchlauf Tag 2–5: Stein 3/0/2/3, Feuer 1/12/13/13). Der Bot kaufte bisher sofort den teuersten Turm und sah das nicht.
- Neu im Test: Menschen-Strategie (`HUM=3`: nur Turm 1, höchstens 3 Türme, danach Upgrades). Damit bildet der Bot das echte Spiel nach. Faktoren (Feuer/Eis/Schatten/Stein): Tag 2 0,7/1,1/1,3/1,5; Tag 3 1,2/1,75/1,2/0,6; Tag 4 0,6/0,4/1,1/0,8; Tag 5 1,2/0,9/0,7/1,2. Stein: Block-Faktor 0,5 → 0,3 und Kiesel 0,95 → 1,58 (Kiesel netto 0,47), damit Schleuder & Co. in Block 1 nicht davonlaufen.
- Kills im ersten Durchlauf (Mensch, Feuer/Eis/Schatten/Stein): Tag 2 2/8/5/14; Tag 3 6/15/7/2; Tag 4 5/2/16/8; Tag 5 14/6/2/6. Neues Spiel + neu laden.

### 19.10. 22:10 · F · 2026-10-19e – Tag 2–5 nach Kills im ersten Durchlauf eingestellt
- Ziel (F): Auf neutralen Tagen macht ein Element im ersten Durchlauf etwa 5–8 von 20 Kills, der Partner räumt den Rest auf; Bonus 12–18, Malus 1–3. Messung: Bot mit dem verfügbaren Gold je Tag (30/70/110/150/190), Mittel über Wetter 0/1/2.
- Faktoren (Feuer/Eis/Schatten/Stein): Tag 2 0,6/0,8/0,7/1,0; Tag 3 1,2/0,8/0,8/0,2; Tag 4 0,7/0,7/1,75/0,6; Tag 5 1,2/0,95/0,7/0,7. Ohrenkneifer (Tag 4): Leben ×0,7, Rüstung 8 %/15 % (sonst schaffte kein Element mehr als ~6). Faktorspanne jetzt 0,2–1,75.
- Ergebnis (Kills, Mittel): Tag 2 2/7/6/18, Tag 3 7/16/6/3, Tag 4 6/2/15/6, Tag 5 15/6/1/5. Anzeige unverändert über `eff`. Neues Spiel + neu laden.

### 19.10. 21:40 · F · 2026-10-19d – Tag 1: Anfangstürme schaffen etwa 5–8 von 20
- Testspiel 19c (Stein + Feuer): Stein-Kiesel schaffte in Tag 1 nur 2 von 20, Feuer 18 (der Partner räumte auf). Ziel jetzt: Auf neutralen Tagen macht jedes Element im ersten Durchlauf etwa 5–8 Kills, den Rest räumt der Partner auf.
- Kiesel `kraftT` 0,48 → 0,95 (Bot, 30 Gold: Stein 7/20; bei 1,0 springt er auf 15). Silberfische: Faktoren 1/1/1/1 → 1,1 / 0,85 / 0,7 / 1 (Anzeige weiter neutral, `eff`), weil Schatten (20) und Eis (9) mit 30 Gold sonst viel zu viel schaffen. Bot (30 Gold, Wetter 0/1/2): Feuer 8/5/3, Eis 6/6/6, Schatten 5/3/4, Stein 7/7/7.
- Tag 2–5 nicht angefasst: Dort stimmen die Kills im ersten Durchlauf noch nicht überall (z. B. Schatten Tag 3 17, Eis und Stein Tag 5 je ~20). Nächster Schritt. Neues Spiel + neu laden.

### 19.10. 21:25 · F · 2026-10-19c – Tag 2 näher an Tag 1
- Kellerasseln: Eis-Faktor 1 → 0,7, Stein 1,75 → 1,0 (Anzeige bleibt: Feuer ineffektiv, Stein effektiv, Eis/Schatten neutral). Bot (Tendenz): Tag 2 Feuer 2,09 / Eis 1,40 / Schatten 1,40 / Stein 1,08 (vorher 2,09 / 0,98 / 1,40 / 0,68); Ø 1,49 gegen Tag 1 Ø 1,37. Neues Spiel + neu laden.

### 19.10. 21:15 · F · 2026-10-19b – Stein Tag 2/4/5 schwerer, Kiesel gleicht aus
- Stein-Block-Faktor 0,6 → 0,5; zum Ausgleich Kiesel `kraftT` 0,4 → 0,48 (Kiesel bleibt netto bei 0,24, Schleuder & Co. werden in Runde 1–5 schwächer). Stein-Faktoren: Tag 3 0,3 → 0,4, Tag 4 1,1 → 0,75, Tag 5 1,3 → 0,9. Faktorspanne 0,4–1,75.
- Bot (Tendenz, Bedarf ÷ verfügbar): Stein Tag 2 0,68, Tag 3 1,99, Tag 4 1,58, Tag 5 1,46; die anderen Elemente unverändert. Neues Spiel + neu laden.

### 19.10. 17:30 · L · (keine Spieländerung) – UPDATES-Kopf repariert, Abstandsskript
- Ursache für den kaputten Kopf: Die Format-Zeile begann selbst mit `###`, neue Einträge landeten darin. Jetzt Einfügemarke `<!-- NEUE EINTRÄGE HIER -->`, Format als Kommentar, Regel 2 in `START.md` angepasst. 6 alte Einträge ins Archiv.
- Neu `node tools/balance/abstand.js [kurz]`: wie weit Spiegel (L, Makro) und Spiel (F, Mikro) auseinanderliegen, Basis in `spiegel.json` → `_basis`. Stand: keine Überschneidung, aber beide drehen an Feuer/Eis/Stein (z. B. Spiegel Kiesel 0,66 statt 0,4 mal F's Block-Faktor 0,6).

### 19.10. 09:20 · F · 2026-10-19a – Stein Tag 3 wieder Malus
- Mit Stein-Block-Faktor 0,6 (18k) war Stein an Tag 3 mit Faktor 0,5 nur noch bei 0,9 (Bot). Damit Tag 3 wieder der Stein-Malus ist: Nacktschnecken Stein-Faktor 0,5 → 0,3 (Bot: Bedarf ÷ verfügbar 2,23). Faktorspanne jetzt 0,3–1,75. Stein Tag 2/4/5 liegen bei 0,68/0,90/0,98 (leicht), Feuer wird weiter getestet. Neues Spiel + neu laden.

### 18.10. 23:45 · F · 2026-10-18k – Stein-Block-Faktor 0,34 → 0,6
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

### 18.10. 10:05 · F · 2026-10-18b – Katapult: Salve statt Weitwurf
- Das einzigartige Edelstein-Talent von Stein Turm 3 (Katapult) ist jetzt **Salve**: jeder 2. Wurf schickt zwei weitere Brocken seitlich neben das Ziel (voller Schaden, Abstand 0,9 × Fläche; `d.salvo` in `gemMods`, `launch`). Weitwurf entfällt.
- Der Katapult wirft nur alle 4 s, deshalb „jeder 2." statt „jeder 4.". Kurztest (1 Katapult, Tag 7): ungefähr so stark wie Weitblick. Zahlen sind Startwerte. Neu laden; bereits eingesetzte Weitwurf-Steine (`ab` 3) wirken nun als Salve.

### 18.10. 02:15 · L · 2026-10-18a – (keine Regeländerung) Balancing-Lauf A verworfen
- `kraftT` für Feuer neutral angelegt, sonst nichts im Spiel geändert.
- Test „Kraft je Turm“ für Feuer/Stein verbessert das Band je Block nicht (16,0 % statt 15,3 % Abweichung) → verworfen. Befund: Der Bot baut fast nur Turm 1–4 und rüstet auf; höhere Türme lohnen sich zu wenig. Details `BALANCING.md`.

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

### 16.10. 00:30 · L · (kein Spielcode) – Balancing-Skript: Grundgerüst
- `tools/balance/`: lädt die Simulation direkt aus `index.html`, Testkarte, Reservefaktor, Bauplatz-Maske, gieriger Aufbau. Aufruf: `node tools/balance/run.js p1` bzw. `maske`.
- Erster Prüfpunkt P1 (Start, Runde 1): Feuer zu stark (17 statt 12 von 20 zu zweit), Stein zu schwach (6). Noch keine Zahlen geändert – Vorschläge kommen gesammelt.

### 15.10. 23:59 · F · 2026-10-15t – „Nichts im Anmarsch"-Wellen werden übersprungen
- Im Uhrzeiten-Modus fällt eine Welle weg, wenn bei keinem Spieler etwas ankommt (nur Leaks der Vorwelle zählen). Die Chronik vermerkt „übersprungen"; folgen nur leere Wellen, geht es direkt zum nächsten Tag (oder zum Sieg).
- Live-Modus unverändert. Regeländerung im Ablauf: neu laden, laufende Spiele sind nicht betroffen, bis die nächste Welle ausgewertet wird.



### 15.10. 01:50 · L · 2026-10-15d – Schatten- und Stein-Fähigkeiten final, Wurf-Korridor
- Schatten: Schemen Angst, Irrlicht Mottenplage (Motten im Lichtkreis schaden), Nachtauge Nachtjäger (×1,5 + Nachtsicht), Hunger +20 %/Kill bis +200 %, Geisterpfeile ganze Rüstung, Ewige Nacht Tiefe Nacht (Fluch addiert sich).
- Stein: Prellstein hüpft an der Stelle nach (60/30 %), Steilschuss voller Schaden, Erschütterung 2 s, Weitwurf Fläche +20 %, Granitwächter Flügelbruch.
- Wurfgeschwindigkeit im Korridor (`lobSpeedOf`): einige Würfe langsamer, Katapult schneller. F: deine Boss-Halbierung (`bh`) ist übernommen. Neues Spiel + neu laden.


### 14.10. 23:50 · F · 2026-10-15b – Edelsteine bei Bossen nur halb
- Gegen Zwischenbosse und Endboss wirken die zahlenbasierten Edelstein-Fähigkeiten halb: Schwelglut (+15 %), Glutnest (Stapel), Haut vereist, Granitwächter (Rüstungsschaden ×2), Hunger, Schatten-Durchdringen (Turm 6). Schon vorher halb: Eisblock, Absturz, Angst, Todesstoß. Ungeändert: Explosionen/Sprünge/Pfützen. Neues Spiel + neu laden.

### 14.10. 23:30 · F · 2026-10-15a – Forschung „Stein bremst“
- Neue Forschung im Elementlabor, 3 Stufen (20/35/50 Gold): ab Runde 6 bremst jeder Stein-Turm alle Monster in seiner Reichweite um 18/25/32 % – auch Fliegende, ohne dass er trifft (`brk`, Stärkstes zählt). Gedacht gegen das Tempo-/Spatzen-Problem von Stein.
- Bot-Messung (20 Läufe je Spiel, mit Edelsteinen): Siege 57 → 65 von 160, Stein 12 → 20 von 80; fast alles aus Feuer+Stein (5 → 13 von 20). Eis+Stein und Schatten+Stein unverändert (sterben vor Runde 6–7). Nur Tendenz.
- Als Nächstes: Feuer evtl. abschwächen (profitiert am meisten). Neues Spiel + neu laden.

### 14.10. 17:40 · L · 2026-10-14c – Edelsteine, Forschung in Stufen, Optik-Paket
- Edelsteine: Zwischenbosse (jetzt nur Tag 6/12/18, Vorhaut-Boss gestrichen, 23 Tage) geben kein Gold, sondern einen Stein in der Farbe des tötenden Turms; Endboss Gold + Stein. Einsatz: Fähigkeit (32, je Turm eine) oder Umwandeln in anderes Element. Schenken ohne Gebühr.
- Forschung: jede Verbesserung in 3 Stufen (Stufe 1 ab 25 Gold), Freischaltung Türme 5–6: 250, 7–8: 700. Lavaturm 0,35 Schüsse/s bei gleichem Schaden/s.
- Optik: Fenster für Verkaufen, Upgrade (Vorschau), Schenken (Knöpfe +10/+50/+100/Hälfte); Menü ⋯ (Neues Spiel, Wetter-Animation); Tempo als ein Knopf; Wetter-Symbol auf der Karte; Goldstand blinkt; Bauen erst gesperrt, wenn die Niederlage im Bild ist.
- Fähigkeiten-Zahlen sind Startwerte (Kurztest: Glutnest, Durchbohren, Weitwurf, Haut vereist stark). Neues Spiel + neu laden.

### 14.10. 11:50 · L · 2026-10-14b – Felsen kosten für alle +30
- Felsen: alle Elemente zahlen +30 Gold (vorher +15, nur Stein +30). Reichweite +15 % für alle und ×1,3 Schaden nur für Stein bleiben. Neues Spiel + neu laden.

### 14.10. 09:30 · L · (kein Spielcode) – Post-Fach, Planung, Projekt-Anleitung
- Neu in `TODO.md`: Abschnitt „Post“ – Nachrichten an den anderen, sein Claude gibt sie beim Start wörtlich weiter. Startprompt in `START.md` entsprechend ergänzt. **F: Post für dich liegt dort.**
- Neu: `team/PLANUNG.md` mit Entwürfen für Balancing-Skript und Edelsteine.
- `START.md`: Anleitung „Eigenes Claude-Projekt einrichten“.

### 13.10. 10:25 · F · 2026-10-13a – Faktoren je 5er-Block, Endboss neutral
- Je Block erste Runde neutral, danach jedes Element einmal Vor- und Nachteil. Endboss wieder neutral (vorher Schatten ×0,7) – beobachten.

### 12.10. 15:38 · L · 2026-10-12zg – Nach Testspiel steiler
- Leben-Kurve Runde^1,38 (vorher 1,3). Rückmeldung: „vieles klappt schon sehr gut“, etwas zu leicht.
### 12.10. 14:07 · L · 2026-10-12za – Neues Rüstungssystem
- Rüstung = Prozent + Punkte; Rüstungsschaden je Element (Feuer 0,5 · Eis 0,6 · Schatten 0 · Stein 1,5). Fluch senkt Rüstung für alle, Irrlicht ×1,3–1,8 und ignoriert 30–100 %.

### 13.10. 10:35 · F · (kein Spielcode) – `balance.js` repariert
- Brach seit der Versionsprüfung ab. Neu: `node tools/balance.js zehn` = 10 feste Testspiele in ca. 15 s, `INDEX=<Pfad>` zum Vergleich.

### 13.10. 10:40 · F · 2026-10-13b – Zwischenbosse
- Nach Runde 5, 10, 15, 19 ein Zwischenboss (letztes Monster als Boss, Leben ×5, zählt 2 Durchbrüche, neutral). Spiel hat jetzt 24 Tage.
- `MONSTERS[k].day` = Tag, `.round` = Runde. Neues Spiel nötig.

### 13.10. 10:50 · L · (kein Spielcode) – Ordner `team/` für die Zusammenarbeit
- Neu: `team/START.md` (Einstieg + Startprompt), `TODO.md` (mit „Gerade dran“), `IDEEN.md`, `UPDATES.md`. Die lange Merkliste liegt jetzt in `team/archiv/merkliste-bis-2026-10-13.md`.
- Zweck: weniger Kontext pro Sitzung, und keiner arbeitet versehentlich gegen den anderen.

### 13.10. 23:55 · F · 2026-10-13c – Felsen als neues Gelände
- 6–8 Felsen je Karte (nahe am Weg): alle Türme +15 % Reichweite, +15 Gold Bau; Stein +30 Gold, dafür Schaden ×1,3. Wald/Sumpf bleiben für Stein gratis.
- Gelände wird bei jedem neuen Spiel aus `startAt` neu gewürfelt (Seed `tseed` in den Wellen-Eingaben). Werte in `ROCK`/`TERRAIN`. Neues Spiel + neu laden.
- Annahme F: ×1,3 und +15 Gold für Nicht-Stein. Bot nutzt noch festes Gelände. Wirkung auf Stein im echten Spiel beobachten.

### 13.10. 00:10 · F · 2026-10-13d – Schatten: flachere Schadenskurve ab Stufe 4
- Schaden je Upgrade bei Schatten: Stufe 2/3/4 wie bisher (×2,2 / ×2,1 / ×2,1), Stufe 5 und 6 nur ×1,8 (`ELEMENTS.Schatten.upDmg`). Stufe 6 ca. −27 % gegenüber vorher, Stufe 5 −14 %, Stufe 4 und darunter unverändert.
- Grund (F): Schatten ist ab Runde 10 zu stark (Irrlicht-Verstärkung ×1,8 + ignoriert Rüstung). Der Bot spielt ohne hohe Stufen und zeigt die Änderung nicht. Im echten Spiel beobachten. Neues Spiel + neu laden.

### 14.10. 00:15 · F · 2026-10-14a – Felsen sehen aus wie kleine Berge
- Felsen-Felder werden als kleiner Berg mit Schneekappe gezeichnet. Türme auf Felsen tragen oben rechts ein kleines Berg-Symbol (gelber Rand).
- Nur Optik, keine Regeländerung. Auf dem Handy prüfen, ob das Symbol bei kleinen Feldern gut erkennbar ist (nicht per Screenshot getestet).
