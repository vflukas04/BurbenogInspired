# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->

### 21.10. 23:20 · L · 2026-10-21e – Effekte: stärkster aktiver wirkt (Fehler behoben)
- Fehler: Trafen zwei gleiche Effekte zusammen, wurden Stärke und Dauer getrennt maximiert. Ein schwacher Ganztags-Effekt (Schwelbrand, Ewiges Eis, Ewige Nacht) machte so jeden starken kurzen Brand/Bremsen/Fluch anderer Türme ganztägig.
- Neu (`addFx`, Effekt-Ablauf in `step`, Leaks): Der stärkste aktive Effekt wirkt mit seiner eigenen Dauer; ein schwächerer, aber längerer bleibt als Rückfall (`v2`/`t2`) und übernimmt, wenn der starke abläuft – auch beim Nachbarn.
- Folge: Kombinationen mit Ganztags-Türmen werden schwächer (vorher bis zu ×30 im Prüfstand). Keine Zahlen geändert. Neues Spiel + neu laden.

### 21.10. 10:15 · L · 2026-10-21d – Zwischenbosse mit Krone
- Maus-, Fuchs- und Schäferhund-Boss tragen eine Krone und schimmern golden (sonst sahen sie aus wie das normale Monster). Nur Anzeige; neu laden reicht.

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
