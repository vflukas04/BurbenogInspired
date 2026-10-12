# BurbenogInspired – Übergabe für Claude

Kooperatives Tower-Defense über mehrere Tage, gebaut von Lukas (Codename-Projekt im Hub „Zentrale“) mit seinem Freund Friedrich. Antworte auf Deutsch, kurz. Inspiriert von der Warcraft-3-Map „Burbenog TD“.

## Arbeitsweise
- Live-Spiel: https://vflukas04.github.io/BurbenogInspired/ (GitHub Pages, Branch `main`, ca. 1 Minute nach Push live).
- Claude pusht direkt nach `main` (die Claude-GitHub-App ist installiert). Nach jeder Änderung: `VERSION` in `index.html` hochzählen, Syntax prüfen, committen, pushen, kurz melden, was neu ist. **Keine Balance-Tests und keine Browser-Screenshots, außer Lukas bespricht es ausdrücklich** (sie dauern Minuten). Mehrere Wünsche in einem Commit bündeln.
- Friedrich hat kein Claude. Seine Wünsche kommen per WhatsApp (oft als Screenshot), Lukas kopiert sie herein.
- Beide testen auf Handys. Nach Regeländerungen immer daran erinnern: „Neues Spiel“ starten und neu laden.
- Offene Wünsche und Erkenntnisse: `BACKLOG.md`. Erledigtes dort abhaken.
- Hub-Leitplanken: Funke-Frist 13.10. hat Vorrang; Lukas freundlich an Pausen und Schlaf erinnern.

## Technik
- Alles in `index.html` (ca. 1.000 Zeilen, ein `<script>`). Oben: `FIREBASE_CONFIG`, `GAME_ID`, dann der Block **SPIELDATEN** (CONFIG, TERRAIN, RESEARCH, WEATHER, TOWER_COST/POWER, ELEMENTS mit je 8 Türmen, MONSTERS mit 20 Runden).
- Online-Speicher: Firebase Firestore (Projekt `burbenoginspired`), Pfade `games/<GAME_ID>` (Spielstand G) und `games/<GAME_ID>/lanes/p0..p3` (Feld je Spieler: Element, Türme, ausgegeben, Geschenke, Kasse, Forschung, `gid`). Jeder Spieler schreibt nur sein eigenes Feld. Wellen werden per Transaktion ausgewertet, wenn jemand die Seite nach der fälligen Zeit offen hat.
- Ohne Firebase-Werte: Ein-Gerät-Modus (localStorage).
- Simulation deterministisch in festen Schritten (DT = 1/30 s), Zufall nur mit festem Seed (Wetter aus `startAt`, Betäubung aus startAt/Tag/Welle/Spieler im Wellen-Input). Die Wiederholung spielt dieselbe Simulation in denselben Schritten ab.
- Grafik: Kenney „Tower Defense (top-down)“, CC0, in `assets/kenney/` (nur die benutzten Sprites). Graue Sprites werden je Element eingefärbt (`tinted`). Monster noch Emojis.
- `gid` = `cfg.startAt`: Felder aus alten Spielen werden ignoriert (verhinderte Minus-Gold).
- Firestore-Testmodus läuft ca. 09.11.2026 ab. Regeln aus der README müssen vorher gesetzt sein.
- Installierbar als Web-App (manifest.json, Icons).
- Versionen: `VERSION` steht im Code und beim Spielstart in `G.cfg.version`, Startgold in `G.cfg.startGold`. Jedes Handy fragt alle 5 Minuten und beim Zurückkehren die Seite ohne Cache ab und zeigt bei neuerer Version „Neu laden“. Alte Spielstände bekommen den Hinweis „Neues Spiel starten“.
- Verbindung: Neben den Firestore-Live-Listenern holt jedes Handy alle 10 s (wer auf „Bereit“ steht und wartet: alle 2 s, wegen Safari) sowie beim Zurückkehren (visibilitychange/focus/online) den Stand direkt vom Server (`refreshFromServer`), weil die Live-Verbindung auf Handys einschläft. Abfrage mit 8-s-Zeitlimit; Auswertung (`resolving`) gibt nach 20 s frei; Bereit-Auswertung wird alle 5–8 s wiederholt, bis sie klappt; Wiedergabe-Wächter (`kickLoop`, Schleifen-Nummer `tok`) stößt eine stehende Wiedergabe nach 3 s neu an.
- „Bereit“-Knopf (nur online): Feld `ready` = `startAt-Tag-Welle` im eigenen Lane-Dokument. Sind alle bereit, ruft jedes Handy `tryResolve(true, key)`; die Transaktion wertet nur aus, wenn der Spielstand noch bei genau dieser Welle steht (kein Doppelstart).
- Anzeige: Online steht das eigene Feld oben, dann die Nachfolger (CSS `order`). Kills je Spieler in `G.kills`, laufend im Feldkopf (⚔), Endfenster mit Statistik (Kills, Gold, Geschenke an wen, Kasse).
- Wiedergabe: Die Welle ist beim Auslösen schon fertig berechnet. Während die neueste Welle zum ersten Mal läuft (`runPending`), zeigen Durchbruch-Zähler, Verloren/Gewonnen-Banner und Chronik nur, was im Bild schon passiert ist (`lastRun.broke`, `lastRun.newLog`).
- Gold-Anzeige: Kopfgeld der laufenden Welle erscheint erst beim Sterben, aber nur beim ersten Ansehen (`replay.pending`). „Letzte Welle ansehen“ zieht nichts ab (war Ursache für Minus-Gold).
- Oberfläche: ein Dialog (`openDlg`) für Bau-Bestätigung (oben als Sheet), Monster-Info (`showMonster`) und Spielende (`showGameOver`).

## Regeln (Stand 12.10.2026 nachts: flache Baukurve, feines Raster, Live-Variante)
- Spielart beim Start: **Uhrzeiten** (wie bisher) oder **Live** (`cfg.live`): eine Welle am Tag um 10 Uhr, alle Felder werden gemeinsam simuliert (`simulateWorld`/`stepWorld`), wer durchkommt, erscheint sofort beim nächsten Spieler (Wellen können sich überlappen). Live hat keine Dunkelheit.
- 2–4 Spieler. Wellen je Spielerzahl: 2 → 10 + 19 Uhr, 3 → 10/16/19, 4 → 10/13/16/19. 10 Uhr: neue Welle bei allen. Danach laufen die Leaks zum nächsten Spieler und behalten Leben und Effekte. Wer nach der letzten Welle noch durchkommt, „bricht ganz durch“. Bei mehr als 30 ist das Spiel verloren.
- Ausgelegt auf 40 Runden, gespielt werden zurzeit 20 (je Tag ein Monstertyp mit 20 Stück, Boss 1; Monster 21–40 fehlen noch). Leben 14 × Runde^1,3 (bis 12.10. mittags ^1,5) × hpMul × Spielerfaktor {2:1, 3:1,25, 4:1,5} – kalibriert mit `tools/kalibrieren.js` auf: Anfangstürme schaffen in Runde 1 ca. 12/8/6 von 20 (2/3/4 Spieler), später mit dem verdienten Gold ähnlich. Rüstung 0,004 × (r−1) × Grundleben. Kopfgeld je Monster flach: R1–5: 2, 6–10: 3, 11–15: 5, 16–20: 8, 21–25: 12, 26–30: 17, 31–35: 23, 36–40: 30. Boss: hpMul 17,3, zählt 5 Durchbrüche. Ab Runde 3 alle Leben ×0,95 (`hpCut`).
- Nachtaktive Monster (`night`): Tag 5 Mäuse, 8 Katzen, 10 Füchse, 14 Wildschweine, 16 Besoffene Penner (ab Runde 5 etwa jede dritte, ungleichmäßig).
- Faktoren Runde 1–5: Runde 1 überall ×1; Runde 2–5 je ein Element ×1,2 und eins ×0,8 (R2 Stein+/Feuer−, R3 Eis+/Stein−, R4 Schatten+/Eis−, R5 Feuer+/Schatten−), danach ist jedes Element einmal Bonus und einmal Malus.
- Monster haben Faktoren je Element (`weak`), Spanne 0,6–1,75 (3→1,75, 2→1,5, 1,5→1,25, 0,5→0,75, 0,25→0,6); 0 = „immun“: 50 % Schaden (`CONFIG.immune`) und brennt nicht.
- Elemente: Feuer (brennt), Eis (verlangsamt, nicht gegen Fliegende; Frostnova friert 3 s im Umkreis mit 45–65 % je Stufe, alle 8→6 s), Schatten (Fluch = mehr Schaden von allen, ignoriert Rüstung; um 19 Uhr trifft er **nachtaktive** Monster nur im Lichtkreis eines Irrlichts (Turm 2, Radius 2,2), alle anderen normal; Irrlicht schießt nicht selbst, Schatten-Türme in seinem Lichtkreis machen immer ×1,5 Schaden (+0,1 je Stufe, mehrere Irrlichter: das stärkste zählt, Option `buff`); Wettermalus gilt immer), Stein (Fläche, wetterfest, kein Geländeaufschlag, Fliegende nur mit Turm 4/6/8, betäuben nur Erdbeben (15–40 %) und Bergkönig (25–40 %), Zufall mit festem Seed).
- Fliegende (Tag 9, 11, 19): Feuer Glutbecken/Lavaturm, Eis Frostnova/Ewiges Eis, Schatten Fluchstein treffen keine. Luftabwehr nur Fliegende: Feuer Brandpfeil, Eis Eiszapfen (bremst Fliegende auch).
- Geschosse fliegen (gezielt 9 Felder/s, folgen dem Ziel). Flächen-Geschosse werden geworfen (6,5, Stein 4,5) und landen dort, wo das Ziel beim Abschuss war. Flächenschaden: Mitte 100 %, Rand 70 %; Stein Mitte 120 %, Rand 80 % (`splashCenter`/`splashEdge` am Element). Monster einer neuen Welle kommen alle 0,9 s; Leaks starten beim Nachbarn in denselben Abständen, in denen sie beim Vorgänger ins Ziel kamen (`at`).
- Türme: [Name, Rolle, Reichweite, Schüsse/s, Geschosse, Schadensanteil, Effektstärke, Effektdauer (s oder DAY = ganzer Tag), Fläche, Optionen {fly, air, chance, chanceUp, nova, light, effect, rateUp}]. Preise 10/45/70/120/200/350/650/1200 (Feuer T1 8, Schatten T2 Irrlicht 30), Kraft 2/9,45/15,4/27,6/47/86/166/319. Upgrades bis Stufe 6, Kosten ×1,5 je Stufe, Schaden ×2,1 (erstes Upgrade ×2,2), Schaden/s je Stufe auf 0,1 aufgerundet (`ceil1`), Reichweite +0,2, Dauer ×1,3, Effekt ×1,15.
- Raster 16 × 16, quadratisch (`GRID = 2`, COLS = ROWS = 16): Reichweite, Fläche, Licht, Tempo, Geschosse stehen in den Daten in alten Feldern und werden mit GRID umgerechnet. Wege: Eingang links, eine Runde mit genau einer Kreuzung, Ausgang rechts; 62–64 Felder lang. Gelände: Wald +10, Sumpf +20 Gold, ca. 26 Felder je Karte (skaliert mit Weglänge). Jeder Spieler hat eine eigene Karte (MAP_WPS).
- Wetter: 8 Arten, kann vor jeder Welle umschlagen (35 %). Wirkungen seit 12.10. halbiert (max. ±25 %).
- Gold: Start 30, Kopfgeld wird während der Wiedergabe sichtbar. Schenken in 10er-Schritten mit 10 % Gebühr. Gemeinschaftskasse ohne Gebühr für die Forschung (Bauhütte, Elementlabor, Akademie). Türme 5–8 sind gesperrt, bis sie erforscht sind.

## Testen
`node tools/balance.js` (vollständig, ca. 8 Minuten), `schnell` (ca. 4 Minuten), `bedarf` (Gold-Bedarf je Element und Runde, beste Messgröße für Element-Balance) oder `elemente`. Beim Testen im Browser niemals mit dem echten Firebase-Spiel verbinden: Kopie mit leerer `projectId` verwenden. Der Bot baut gierig. Seine Ergebnisse sind Tendenzen, das Spielgefühl der beiden zählt mehr.
