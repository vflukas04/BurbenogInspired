# Archiv: ältere Updates (neueste oben)

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
