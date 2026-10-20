# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->

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
