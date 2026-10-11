# BurbenogInspired – Übergabe für Claude

Kooperatives Tower-Defense über mehrere Tage, gebaut von Lukas (Codename-Projekt im Hub „Zentrale“) mit seinem Freund Friedrich. Antworte auf Deutsch, kurz. Inspiriert von der Warcraft-3-Map „Burbenog TD“.

## Arbeitsweise
- Live-Spiel: https://vflukas04.github.io/BurbenogInspired/ (GitHub Pages, Branch `main`, ca. 1 Minute nach Push live).
- Claude pusht direkt nach `main` (die Claude-GitHub-App ist installiert). Nach jeder Änderung: Syntax prüfen, `node tools/balance.js schnell`, committen, pushen, kurz melden, was neu ist.
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
- Oberfläche: ein Dialog (`openDlg`) für Bau-Bestätigung (oben als Sheet), Monster-Info (`showMonster`) und Spielende (`showGameOver`).

## Regeln (Stand 11.10.2026, nach Element-Balance)
- 2–4 Spieler. Wellen je Spielerzahl: 2 → 10 + 19 Uhr, 3 → 10/16/19, 4 → 10/13/16/19. 10 Uhr: neue Welle bei allen. Danach laufen die Leaks zum nächsten Spieler und behalten Leben und Effekte. Wer nach der letzten Welle noch durchkommt, „bricht ganz durch“. Bei mehr als 30 ist das Spiel verloren.
- 20 Runden = 20 Tage, je Tag ein Monstertyp mit 20 Stück (Boss 1). Leben 3,75 × 1,5^(Runde−1) × hpMul × Spielerfaktor {2:1, 3:2, 4:3,5}. Rüstung 0,2·(r−1)·1,3^(r−1). Kopfgeld 2, +1/Runde, ab R5 +2, ab R10 +3, ab R15 +4, dann × 0,8 gerundet (min. 2). Boss: hpMul 17,3 (= 10 % weniger als vor der +25 %-Erhöhung), zählt 5 Durchbrüche.
- Monster haben Faktoren je Element (`weak`), 0 = nur 25 % Schaden und brennt nicht.
- Elemente: Feuer (brennt), Eis (verlangsamt, nicht gegen Fliegende; Frostnova friert 3 s im Umkreis, alle 8→6 s), Schatten (Fluch = mehr Schaden von allen, ignoriert Rüstung, schießt um 19 Uhr nur im Licht eines Irrlichts (Turm 2, Radius 2,2); im Licht entfällt auch der Wettermalus), Stein (Fläche, wetterfest, kein Geländeaufschlag, Fliegende nur mit Turm 4/6/8, betäuben nur Erdbeben (15–40 %) und Bergkönig (25–40 %), Zufall mit festem Seed).
- Fliegende (Tag 9, 11, 19): Feuer Glutbecken/Lavaturm, Eis Frostnova/Ewiges Eis, Schatten Fluchstein treffen keine. Luftabwehr nur Fliegende: Feuer Brandpfeil, Eis Eiszapfen (bremst Fliegende auch).
- Geschosse fliegen (gezielt 9 Felder/s, folgen dem Ziel). Flächen-Geschosse werden geworfen (6,5, Stein 4,5) und landen dort, wo das Ziel beim Abschuss war. Flächenschaden fällt nach außen auf 40 % ab. Monster kommen alle 0,9 s.
- Türme: [Name, Rolle, Reichweite, Schüsse/s, Geschosse, Schadensanteil, Effektstärke, Effektdauer (s oder DAY = ganzer Tag), Fläche, Optionen {fly, air, chance, chanceUp, nova, light, effect, rateUp}]. Preise 5/12/29/69/166/398/955/2290 (Feuer T1 3). Upgrades bis Stufe 6, Kosten ×1,5 je Stufe, Schaden ×2, Reichweite +0,2, Dauer ×1,3, Effekt ×1,15.
- Gelände: Wald +10, Sumpf +20 Gold beim Bauen, je Karte bis 10 Felder (skaliert mit Weglänge). Jeder Spieler hat eine eigene Karte (MAP_WPS).
- Wetter: 8 Arten, kann vor jeder Welle umschlagen (35 %).
- Gold: Start 15, Kopfgeld wird während der Wiedergabe sichtbar. Schenken in 10er-Schritten mit 10 % Gebühr. Gemeinschaftskasse ohne Gebühr für die Forschung (Bauhütte, Elementlabor, Akademie). Türme 5–8 sind gesperrt, bis sie erforscht sind.

## Testen
`node tools/balance.js` (vollständig, ca. 8 Minuten), `schnell` (ca. 4 Minuten), `bedarf` (Gold-Bedarf je Element und Runde, beste Messgröße für Element-Balance) oder `elemente`. Beim Testen im Browser niemals mit dem echten Firebase-Spiel verbinden: Kopie mit leerer `projectId` verwenden. Der Bot baut gierig. Seine Ergebnisse sind Tendenzen, das Spielgefühl der beiden zählt mehr.
