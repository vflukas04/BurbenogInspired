# Merkliste BurbenogInspired

Stand: 12.10.2026, 01:15 – Ende des langen Testabends (11.10. vormittags bis 12.10. nachts).

## Für die nächste Sitzung (zuerst lesen)
**Aktueller Stand (live, VERSION 2026-10-12o, Schatten-Nachtregel nur für nachtaktive Monster):** Karte 16 × 16 mit Schleife und Kreuzung, flache Baukurve (Türme 10/45/70/120/200/350/650/1200, Kopfgeld 2/3/5/8 … je 5 Runden), Startgold 30, Leben 14 × Runde^1,5, Spielarten „Uhrzeiten“ und „Live“, Bau-Bestätigung, Monster-Info, Bereit-Knopf, Endstatistik. Turm 1 auf Stufe 1: Funke 1,6 · Frostsplitter 2,2 · Schemen 2,2 · Kiesel 1,1 (Fläche). Erstes Upgrade ×2,1, danach ×2.

**Offen / als Nächstes:**
1. Prüfen, ob Handy 2 neue Wellen jetzt ohne Neuladen zeigt (Fix 01:06: Stand alle 10 s vom Server). Falls nicht: Springen Tag/Uhrzeit ohne Neuladen? Welches Handy/Browser?
2. Firestore-Regeln vor ca. 09.11. setzen (README).
3. Türme 4–8 sind nach der neuen Preis-Kurve nicht abgeglichen (nur Türme 1–3 per Simulation).
4. Monster 21–40 ausdenken (Spiel ist auf 40 Runden ausgelegt, gespielt werden 20).
5. Lukas testet bewusst eine Zeit lang das feine, häufige Nachjustieren einzelner Werte. Später auswerten: Hat es geholfen oder nur hin- und hergeschwankt (Funke heute: 0,6 → 1,2 → 1,0 → 1,1 → 2,0 → 1,8 → 1,3 → 1,6)?
6. Auf Hold: Forschung teurer, Gold sofort beim Tod, „Verloren“ erst am Tagesende, Chat, Monster-Sprites, „Reiche werden reicher“.
7. Zwischenfazit (12.10. 00:55): Ideen stark (v. a. zeitversetztes Weiterreichen der Monster), Kritik: zu viele Regler gleichzeitig, Komplexität > Lesbarkeit am Handy, Snowball ungelöst, Online-Speicher offen.

**Hilfsmittel:** `tools/kalibrieren.js` (Sekunden: Leben auf Ziel 12/8/6 von 20 kalibrieren, `pruefen` zeigt Kills je Runde). Echten Spielstand zum Debuggen nur lesen: Firestore-REST `games/spiel1` (+ `/lanes`).

## Offene Wünsche (vorgemerkt)
### 12.10. vormittags (VERSION 2026-10-12o)
- [x] Schatten-Nachtregel gilt nur noch für **nachtaktive** Monster: Tag 5 Mäuse, 8 Katzen, 10 Füchse, 14 Wildschweine, 16 Besoffene Penner. Alle anderen trifft Schatten um 19 Uhr normal. Anzeige „(nachtaktiv)“ bei Heute/Nächstes und in der Monster-Info.
- [x] Faktoren Runde 1–5 fair: R1 alles ×1; R2 Kellerasseln Stein 1,2/Feuer 0,8; R3 Nacktschnecken Eis 1,2/Stein 0,8; R4 Ohrenkneifer Schatten 1,2/Eis 0,8; R5 Mäuse Feuer 1,2/Schatten 0,8 (10:44 umgestellt, VERSION 2026-10-12p).
- Offen: Ab Runde 6 bleiben die alten, stärkeren Faktoren (0,6–1,75). Schatten profitiert jetzt deutlich – im Spiel beobachten, ob er zu stark wird.

### Aus Lukas' Rückmeldung 11.10. vormittags
- [x] Vorschau: nächstes Monster mit Info-Knopf (auch für heute), Dialog mit Leben, Rüstung, Tempo, Fliegen, Faktoren (11.10.).
- [ ] Türme leicht abschwächen: bei jedem Turm genau einen Wert senken (Feuerrate, Reichweite, Schaden oder Geschosse), nicht überall alles. Danach Monster ggf. +20 % Leben. Mit `tools/balance.js` prüfen.
- [ ] Forschung leicht teurer (nicht zu teuer).
- [ ] Monsterleben zu viert ×4 oder ×4,5 (jetzt ×3,5). Lukas schwankt; Vorschlag: ×4, dann testen.
- [x] Element-Balance mit Tests prüfen (11.10., siehe „Element-Balance 11.10. nachmittags“ unten).
- [x] Grafik: Türme und Geschosse. Pfeile, Feuerbälle, kurzes Aufleuchten, Erdbeben-Wackeln, Geschosse mit Flugzeit, Wurf-Geschosse treffen nicht immer mittig, Flächenschaden fällt nach außen ab (11.10.).
- [x] Kenney-Paket eingebaut (`assets/kenney/`, nur benutzte Sprites, Lizenz in README). Monster bleiben Emojis: Das Paket hat nur Panzer und Flugzeuge.

### Aus Lukas' Rückmeldung 11.10. mittags (Feuer + Eis zu zweit gewonnen, nur 1 Uffug durch → etwas zu leicht)
- [x] Bauen mit Bestätigung: Dialog oben mit Kosten, Gold danach, Schaden/s, Reichweite, Wirkung; Turm und Reichweite als Vorschau im Feld. Daneben tippen = abbrechen.
- [x] Gewonnen/Verloren als Fenster im Vordergrund (einmal je Spiel).
- [x] Kopfgeld × 0,8, gerundet, mindestens 2 (`CONFIG.bountyMul`). Runde 1–20: 2 2 3 4 6 7 9 10 12 14 17 19 22 24 27 30 34 37 40 43.
- [x] Upgrade: Schaden ×2,0 statt ×1,8 pro Stufe.
- [x] Eis: Eiszapfen (Turm 3) ist jetzt Luftabwehr und bremst Fliegende auch.
- [x] Fliegende: Spatzen (9), Habichte (11), Uffug-Vorhaut (19).
- [x] Feuer leicht schwächer: Brennen −15 %. Funke bleibt bei 3 Gold, dafür Schaden 0,4→0,3 und Brennen 0,26→0,2 (Lukas 13:16).
- [x] Startgold 15 statt 30. Boss nicht mit erhöht, sondern 10 % weniger als vorher (hpMul 24 → 17,3).
- [x] Monsterleben +25 % (baseHp 3 → 3,75): Am Anfang soll nicht jeder alle 20 schaffen, man soll sich helfen müssen.
- Hinweis: spawnGap 0,9 s (statt 0,5) hatte Claude ohne Absprache umgesetzt; stand nur als Idee in der Analyse. Lukas fragt nach – ggf. zurück auf 0,5–0,7.
- Bot-Test nach diesen Änderungen: gemischt 0/9 gewonnen. Der Bot spielt aber deutlich schlechter als Lukas und Friedrich (die haben gewonnen, als der Bot nur 3/9 schaffte). Echtes Spielgefühl abwarten.
- Auf Hold (Wiedervorlage): Türme allgemein abschwächen, Forschung teurer, Monsterleben ×4 zu viert, Gold sofort beim Tod, Verloren erst am Rundenende, Chat, Monster-Sprites.

### 11.10. nachmittags
- [x] „Bereit“-Knopf online: Wenn alle bereit sind, startet die nächste Welle. „Jetzt auslösen“ bleibt als „Sofort auslösen“.
- [x] Frostnova (Eis Turm 5) friert nur mit 45–65 % Wahrscheinlichkeit (je Stufe +4 %).

### 11.10. abends (Stein wirkt zu schwach, Faktoren zu extrem)
- [x] Flächenschaden weniger extrem: Rand 70 % statt 40 %, Stein-Würfe schneller (5,5 statt 4,5 Felder/s), treffen also öfter mittig. Hinweis: Die Stein-Türme haben seit der Balance nur noch halben Grundschaden – falls Stein weiter schwach wirkt, dort ansetzen (z. B. ×1,25).
- [x] Monster-Faktoren auf 0,6–1,75 gestaucht, „immun“ = 50 % statt 25 % Schaden.
- [x] Irrlicht: Wirkt nicht mehr auf Nachbartürme. Nachts treffen Schatten-Türme nur Monster im Lichtkreis. Der Wettermalus gilt jetzt auch im Licht.

- [x] Stein (22:18): Würfe wieder langsam (4,5), dafür Mitte 120 %, Rand 80 %. Andere Flächen-Türme: Mitte 100 %, Rand 70 %.
- [x] Brennen −15 % (alle Feuer-Türme).

### 11.10. nachts (großer Umbau)
- [x] Eigener Spieler oben (online), danach die Nachfolger.
- [x] Minus-Gold: Ursache 1 „Letzte Welle ansehen“ zog schon ausgegebenes Gold nochmal ab (behoben). Ursache 2: Spiele, die vor der Versionsprüfung gestartet wurden, rechnen mit dem aktuellen Startgold (Startgold-Änderung 30→15 ergab Minus). Neue Spiele speichern ihr Startgold.
- [x] Kills je Spieler laufend im Feldkopf, Endfenster mit Statistik (Kills, Gold, Geschenke an wen, Kasse).
- [x] Spielart „Live“: Leaks laufen sofort beim Nachbarn weiter, Wellen können sich überlappen. Eine Welle am Tag, keine Dunkelheit.
- [x] Flache Baukurve: Kopfgeld 2/3/5/8/12/17/23/30 je 5 Runden, Türme 10/45/70/120/200/350/650/1200 (Feuer T1 8), Startgold 30.
- [x] 40-Runden-Auslegung (Leben-Kurve Runde^1,5, Kopfgeld bis 40). Gespielt werden 20. **Offen: Monster 21–40 ausdenken.**
- [x] Raster 24 × 16, Wege als Schleifen nach innen, alle 86 Felder lang (vorher ca. 60 in feinen Feldern), mehr Gelände.
- [x] Leben kalibriert (`tools/kalibrieren.js`): Anfangstürme schaffen in Runde 1 ca. 12/8/6 von 20. Delle um Runde 5 (dort eher 5 von 20 im Test), danach 9–13 von 20.
- Hinweis: Auf dem Handy sind die Felder jetzt nur ca. 15 px groß. Falls Tippen schwierig wird: Querformat oder Zoom-Funktion überlegen.

### 12.10. kurz nach Mitternacht
- [x] „Verloren“ und „Ganz durchgebrochen“ kamen zu früh (Welle war schon fertig berechnet): Anzeige zählt jetzt während der Wiedergabe mit, Banner/Chronik erst danach.
- [x] Wege als echte Schleife: Eingang links, eine Runde mit Kreuzung, Ausgang rechts (84–86 Felder).
- [x] Funke (Feuer Turm 1): 1,1 Schaden/s auf Stufe 1 (vorher 0,6), Brennen unverändert.
- [x] Türme 1–3 aller Elemente angeglichen (00:32, Simulation mit Startgold bzw. 2 Türmen): vorher schaffte Eis mit 3× Turm 1 alle 20, Feuer 3. Turm 1 danach auf Lukas' Wunsch etwas weniger stark korrigiert (Brennen ist ein Bonus): Funke 1,8 / Frostsplitter 2,1 / Schemen 2,2 / Kiesel 1,1 Fläche. 00:49: Feuer zu stark (alle 20) → Funke 1,3, Frostsplitter 2,2. Turm 2 und 3 je ca. 10–12 (Glutbecken ×3, Schneeball −15 %, Schleuder +27 %, Flammenwerfer +50 %, Nachtauge −16 %, Felsbrocken −40 %). Irrlicht und Eiszapfen (Sonderrollen) unverändert.
- [x] Ein Handy zeigte die 19-Uhr-Welle erst nach Neuladen: Kam die neue Welle, während die vorige noch abgespielt wurde (Mitspieler drückt „Bereit“), wurde sie übersprungen. Jetzt startet sie direkt danach. Zusätzlich prüft jedes Handy alle 5 s, ob es eine Welle noch nicht gezeigt hat (Theorie „gleichzeitig Bereit“, 00:49).
- [x] Karte quadratisch 16 × 16 (00:28), Wege 62–64 Felder mit Kreuzung, Leben neu kalibriert (baseHp 14).
- [x] **Ursache des Hängers gefunden (00:26):** Zeichenfehler bei Wurf-Geschossen (Schneeball usw.) seit dem Raster-Umbau – die Wiedergabe blieb beim ersten Wurf stehen. Behoben, und Zeichenfehler halten die Wiedergabe jetzt grundsätzlich nicht mehr an. Gefunden durch Nachrechnen des echten Spielstands aus Firestore (nur gelesen).
- [x] „Hängt bei den Ohrenkneifern“ (00:16): Simulation hängt in keiner getesteten Konstellation. Zeichnen auf dem feinen Raster war aber langsam (17 ms/Bild am PC) → Hintergrund wird jetzt zwischengespeichert (0,8 ms). Live: fast tote Monster kamen mit vollem Leben beim Nachbarn an (behoben). Falls es weiter hängt: genauer nachfragen (ganzes Handy eingefroren? Welle startet nicht? Online oder Ein Gerät, Live oder Uhrzeiten?).
- Offen (auf Hold): „Verloren“ erst am Ende des Tages statt nach der Welle, in der die Grenze überschritten wird.

- [x] 01:06: Handy 2 zeigt neue Wellen erst nach Neuladen. Nachgestellt: Kommt der neue Stand an, startet die Wiedergabe sofort → vermutlich schläft die Firestore-Live-Verbindung ein (App-Wechsel/Bildschirm aus). Jetzt holt jedes Handy alle 10 s und beim Zurückkehren den Stand direkt vom Server. Falls es weiter auftritt: Sieht Handy 2 den neuen Tag/die Uhrzeit ohne Neuladen? Welches Handy/Browser?
- [x] 01:03: Funke 1,6 Schaden/s. Erstes Upgrade (Stufe 1→2) Schaden ×2,1 statt ×2 (spätere Stufen weiter ×2). Lukas testet bewusst eine Zeit lang das feine, häufige Nachjustieren.
- [x] Leaks starten beim Nachbarn in denselben Abständen, in denen sie beim Vorgänger ins Ziel kamen (00:52; z. B. nach Eis weiter auseinander).

### Vom Testabend
- [ ] Gold direkt aufs Konto, sobald ein Monster stirbt: nicht schon vor Rundenstart sichtbar, aber auch nicht erst am Rundenende. *Klären:* Gilt das auch, wenn niemand die Wiederholung anschaut?
- [x] Fliegende: Die Begrenzung gilt **nur für Stein**: erst ab Turm 4 und insgesamt höchstens 3 Türme (z. B. 4, 6, 8 oder 4, 5, 7). Feuer, Eis und Schatten: Die meisten Türme treffen Fliegende, je Element nur 1–3 Türme nicht. Im ganzen Spiel darf es außerdem 1–2 Spezialtürme geben, die **nur** Fliegende angreifen.
- [x] Betäubung: höchstens 2 Betäubungstürme (Stein). Dafür **Zufall**: Jeder Treffer betäubt nur mit 10–40 % Wahrscheinlichkeit (je nach Turm und Stufe), die Dauer darf dafür **länger** sein. Wichtig: Den Zufall mit festem Seed würfeln (z. B. aus `startAt`, Tag, Welle, Spieler), damit Berechnung und Wiederholung auf allen Handys gleich bleiben.
- [x] Schatten: Lichttürme (Irrlicht ersetzt Dolchgeist als Turm 2), heben Dunkelheit und Wettermalus im Umkreis 2,2 auf.
- [x] „Uffug-Vorhut“ heißt jetzt „Uffug-Vorhaut“ und fliegt (11.10.).
- [ ] Chat in der Chronik, damit die Spieler sich schreiben können.
- [ ] „Verloren“ erst am Ende der Runde melden, nicht mitten am Tag.
- [ ] Grafik: echte Sprites statt Emojis – Türme erledigt, **Monster fehlen noch** (siehe unten).

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

## Element-Balance 11.10. nachmittags
Umgesetzt: Monster alle 0,9 s statt 0,5 s, Flächenschaden fällt nach außen auf 40 % ab, Wurf-Geschosse landen am alten Zielpunkt, Stein betäubt nur noch mit Erdbeben (jetzt Turm 5) und Bergkönig per Zufall, Stein trifft Fliegende nur mit Katapult (jetzt Turm 4), Granitwächter, Bergkönig. Irrlicht für Schatten. Werte: Stein ×0,5 (früh etwas mehr), Eis ×1,5, Feuer früh schwächer und spät stärker (Phönix/Höllenfeuer mit weniger, dafür härteren Treffern gegen Rüstung). Monster: Silberfische Stein 1, Nacktschnecken Eis 0,5, Dachse und Penner Schatten 1,5, Wütende Nachbarn Eis 1,5 / Stein 1.

Neue Messung `node tools/balance.js bedarf`: Wie viel Gold braucht ein Element je Runde, um 18 von 20 zu töten (Mittel aus Sonnig/Bewölkt/Regen, Tageslicht). Kleiner = stärker.

| | Schnitt | früh 1–8 | mitte 9–14 | spät 15–20 | schwache Tage |
|---|---|---|---|---|---|
| vorher Stein | 0,32 | | | | keine |
| Feuer | 0,68 | 0,44 | 0,51 | 1,61 | 13, 16, 17, 20 |
| Eis | 0,49 | 0,38 | 0,67 | 0,53 | 5, 6, 14, 20 |
| Schatten | 0,53 | 0,46 | 0,26 | 1,32 | 17, 18, 20 (+ Dunkelheit ohne Irrlicht) |
| Stein | 0,57 | 0,40 | 0,80 | 0,62 | 9, 11 (Fliegende), 1, 7, 15 leicht |

Offen / Beobachtung:
- Insgesamt deutlich schwerer: Bot gewinnt gemischt nur noch 3/9 (2 Spieler), 5/9 (3), 6/9 (4). Vorher fast immer. Daher die Punkte „Türme abschwächen“ und „Monsterleben ×4“ erst nach einem echten Testabend angehen.
- Im Bot-Spiel bekommt Feuer weiter das meiste Gold: Wer früh alles tötet, kassiert auch die Leaks der Nachbarn. Die Goldverteilung schwankt aber stark mit kleinen Änderungen, der Bot ist dafür kein gutes Maß.
- Stein + Schatten zu zweit fällt an Tag 9 (Spatzen um 19 Uhr): Stein schwach gegen Fliegende, Schatten ohne Irrlicht dunkel. Gewollte Schwäche, aber Vorschau auf Fliegende wäre hilfreich.
- Alte Spielstände: Türme behalten Index. Wer Stein-Turm 4/5 oder Schatten-Turm 2 gebaut hat, hat jetzt Katapult/Erdbeben bzw. Irrlicht. Neues Spiel starten.

## Technik
- **Firestore-Testmodus läuft nach 30 Tagen ab (ca. 9. November).** Vorher die Regeln aus der README unter Firestore → Regeln eintragen, sonst hört das Online-Spiel auf zu funktionieren.
- Wer den Link kennt, kann den Spielstand verändern. Für Freunde okay. Für mehr Spieler bräuchte es eine Anmeldung.
- Wellen werden nur berechnet, wenn jemand die Seite offen hat. Bei echten Uhrzeiten heißt das: Die Welle läuft beim nächsten Öffnen nach. Das ist so gewollt, sollte aber im Spiel erklärt werden.
- `index.html` hat inzwischen rund 900 Zeilen. Vor großen Umbauten lohnt sich eine Aufteilung in Spieldaten, Simulation und Oberfläche.

## Grafik
- Jetzt: Emojis. Die Darstellung hängt vom Gerät ab, iPhone und Android sehen unterschiedlich aus.
- Schneller nächster Schritt: freie Grafikpakete (Kenney.nl, CC0) für Türme, Gelände und Effekte.
- Mit Civitai/Stable Diffusion: 20 Monster und 32 Türme in einheitlichem Stil generieren, Hintergrund entfernen, auf 64×64 px verkleinern. Das sind gut 2–3 Abende Arbeit. Es lohnt sich, wenn die Regeln (vor allem die Türme) stehen. Sonst zeichnet man vieles doppelt.
