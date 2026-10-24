# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->

### 24.10. 18:10 · F · 2026-10-24b – Katzen: Anzeige wieder „Schatten neutral“
- Mit Schatten 1,3 (24a) hätte die Anzeige am Tag 9 zwei effektive Elemente gezeigt (Eis und Schatten). `eff:[-1, 1, 0, 0]` legt die Rollen fest, an den Werten ändert sich nichts.

### 24.10. 13:40 · F · 2026-10-24a – Feuer-Wetter enger, Katzen für Schatten
- Nachbau mit den echten Feuer-Türmen (5 Spieler, Tag 8): Sonnig/Hitze 13, Regen/Gewitter 4 Kills. Sonnig 1,075/1,075, Hitze 1,15/1,1, Regen und Gewitter Schaden 0,95, Dauer 0,8, Brennen erlischt 1,5 bzw. 1,35. Abstand Tag 8: 9,8 → 7,0; gewichtetes Mittel unverändert (~8,4).
- Katzen (Tag 9, nachtaktiv): Schatten-Faktor 1,0 → 1,3, weil Schatten nachts nur im Lichtkreis trifft (beide Feuer+Schatten-Läufe kippten dort).
- Neues Spiel + neu laden.

### 24.10. 11:20 · F · 2026-10-23d – Block 2 (Tag 7–12) nach fünf Testspielen
- Fünf Testspiele auf 23c (Schatten+Eis, Feuer+Stein, Eis+Feuer ×2, Stein+Schatten). Der Nachbau mit den echten Türmen trifft die echten Kills; danach Werte aus dem Mittel über Wetter und Spiele.
- `kraftBlock[1]` (Block 2): Feuer 1 → 1,25 (fiel beim Blockwechsel um ein Drittel ab, Tag 8 nur 2 statt 12–18), Eis 1 → 1,2, Schatten 1 → 0,65 (mit Irrlicht 17–18 Kills an neutralen Tagen, Ziel 5–8). Katzen (Tag 9) Eis 1,75 → 1,4; Ratten (Tag 8) Stein 0,75 → 0,55.
- Flieger-Tag 10 (Spatzen) entschied drei Spiele: Feuer/Eis ohne Luftabwehr (Brandpfeil/Eiszapfen) bekommen bis 35 Durchbrüche an einem Tag. Zahlen nicht angefasst, Vorschlag zur Warnung im TODO. Neues Spiel + neu laden.

### 23.10. 12:45 · F · 2026-10-23c – Block 2: Tag 7 leichter, Stein-Faktor Block 2
- Testspiel 22a: Tag 7 (Kleine Hunde, alle neutral) nur 1 und 2 von 20 Kills. Hunde `hpMul` 1 → 0,85 (Nachbau mit den echten Türmen: Schatten/Eis etwa 5–8 über Wetter 0/1/2). Tag 8–11 im Testspiel im Rahmen, nicht angefasst.
- Stein `kraftBlock[1]` 1 → 0,6: Der Bot (Kiesel 1,58) machte in Block 2 an jedem Tag 12–15 Kills, auch am Malus-Tag 8. Mit 0,6: Tag 8 etwa 2–4, Tag 11 (Bonus) etwa 10–11, Tag 7 5–11. Tag 9 (Katzen) bleibt für Stein bei 1 (zu schwer, Katzen Tempo 1,6), offen.
- Bot ist nur Tendenz (Stein im Spiel noch nicht gegengeprüft). Neues Spiel + neu laden.

### 23.10. 11:05 · F · 2026-10-23b – Laufbilder folgen der Schrittphase, Werkzeug `tools/lauf.py`
- Laufbilder (`MONSTER_ANIM`) laufen jetzt nach Strecke statt nach Uhr (steht ein Monster, steht das Bild). Betty läuft dadurch in ihrem eigenen Tempo.
- Neu `tools/lauf.py`: baut aus Video/Einzelbildern die Dateien `<name>-lauf-N.png` (freigestellt, 192 px, 128 Farben, gleicher Ausschnitt). Mit einem künstlichen Test geprüft, noch kein echtes Monster. Ablauf und Prompt in `GRAFIK.md`. Die Bilder selbst muss L oder F in Krea erzeugen (ich kann hier keine erzeugen). Neu laden reicht.

### 23.10. 10:50 · F · 2026-10-23a – Monster gehen im Schritt (nur Anzeige)
- Das Wippen hängt jetzt an der zurückgelegten Strecke statt an der Uhr: Schnecken trippeln langsam, Hunde schnell, ein stehendes Monster steht still. Dazu Aufsetzen (kleiner Hüpfer) und leichtes Kippen. Keine Regel- und keine Balance-Änderung.
- Echte Beinbewegung bräuchte Laufbilder wie bei Betty (`MONSTER_ANIM`). Mit L abgestimmt: erst mit wenigen Monstern mit sichtbaren Beinen (Hunde, Ratten, Katzen, Füchse) testen, 4 Bilder, nur Seitenansicht. Neu laden reicht.

### 22.10. 23:50 · F · 2026-10-22b – Schatten Tag 3 und 5 an echtes Spiel angepasst
- Auswertung Testspiel 22a (Schatten + Eis): Die Simulation bildet das Spiel mit den echten Türmen exakt nach. Schatten machte an Tag 3 (neutral) 20 statt 5–8 und an Tag 5 (Malus) 8 statt 1–3; der Bot unterschätzt hier die Platzierung der Spieler.
- Nacktschnecken Schatten-Faktor 1,2 → 0,9, Mäuse Schatten 0,7 → 0,55 (Nachbau: Tag 3 etwa 10/7/8, Tag 5 etwa 3 Kills über Wetter 0/1/2). Tag 4 unverändert (20/20 ist die Obergrenze).
- Schatten-Spieler hatte Irrlicht und Nachtaktivität vergessen: Tag 5/6 um 19 Uhr 15 Durchbrüche, nicht zu werten. Auch ohne das wäre das Spiel in Block 2 verloren (Tag 7: 1–2 Kills) – mit L besprechen. Neues Spiel + neu laden.

### 22.10. 00:15 · L · 2026-10-22a – Eigene Bilder für zwei Varianten
- Zwei Monster-Varianten haben eigene Bilder statt eines gemeinsamen (eine Rückansicht fehlt noch, dort Seitenansicht). Neu laden reicht.

### 21.10. 23:50 · L · 2026-10-21e – Fuchs und Dachs von hinten
- Letzte fehlende Ansichten ergänzt (Fuchs und Dachs laufen jetzt auch nach oben mit Rückansicht). Neu laden reicht.

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

