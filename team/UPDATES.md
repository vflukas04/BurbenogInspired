# Updates (neueste oben, höchstens 15 Einträge)

Format: `### TT.MM. HH:MM · L|F · VERSION – Titel` + höchstens 5 Zeilen: was, warum, worauf achten. Details stehen im Commit.

### 15.10. 13:10 · F · 2026-10-15f – Lavapfütze schwächer
- Lavapfütze macht 20 % statt 40 % des Turm-Schadens/s (Wunsch F, nach freier Fähigkeitswahl wirkt sie auf jedem Turm). Sonst nichts geändert. Neues Spiel + neu laden.

### 15.10. 12:50 · F · 2026-10-15e – Edelstein-Fähigkeit frei wählbar
- Mit dem Stein wählt man eine der 8 Fähigkeiten des Elements für einen beliebigen Turm des Elements (Auswahlliste im Edelstein-Dialog). Alte Steine behalten die Fähigkeit ihrer Turmnummer.
- Einige Fähigkeiten für jeden Turm angepasst (Liste in `PLANUNG.md`), sinnlose Kombinationen sind gesperrt (Irrlicht nur Mottenplage u. a.). Alle 241 möglichen Kombinationen laufen ohne Fehler durch die Simulation, Balance nicht gemessen. Neues Spiel + neu laden.

### 15.10. 01:50 · L · 2026-10-15d – Schatten- und Stein-Fähigkeiten final, Wurf-Korridor
- Schatten: Schemen Angst, Irrlicht Mottenplage (Motten im Lichtkreis schaden), Nachtauge Nachtjäger (×1,5 + Nachtsicht), Hunger +20 %/Kill bis +200 %, Geisterpfeile ganze Rüstung, Ewige Nacht Tiefe Nacht (Fluch addiert sich).
- Stein: Prellstein hüpft an der Stelle nach (60/30 %), Steilschuss voller Schaden, Erschütterung 2 s, Weitwurf Fläche +20 %, Granitwächter Flügelbruch.
- Wurfgeschwindigkeit im Korridor (`lobSpeedOf`): einige Würfe langsamer, Katapult schneller. F: deine Boss-Halbierung (`bh`) ist übernommen. Neues Spiel + neu laden.

### 15.10. 00:05 · F · 2026-10-15c – Warnung vor Fliegenden
- Neues Banner über dem Spielfeld: am Vortag und vor der 10-Uhr-Welle (Tag 10 Spatzen, 13 Habichte, 22 Uffug-Vorhaut) steht, dass Fliegende kommen, welche Türme des eigenen Elements sie treffen und wie viele man davon hat (rot bei weniger als 2). Anlass: Testspiel verloren an Tag 13 mit ca. 200 ungenutztem Gold. Keine Balance-Änderung.

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

### 14.10. 00:15 · F · 2026-10-14a – Felsen sehen aus wie kleine Berge
- Felsen-Felder werden als kleiner Berg mit Schneekappe gezeichnet. Türme auf Felsen tragen oben rechts ein kleines Berg-Symbol (gelber Rand).
- Nur Optik, keine Regeländerung. Auf dem Handy prüfen, ob das Symbol bei kleinen Feldern gut erkennbar ist (nicht per Screenshot getestet).

### 13.10. 00:10 · F · 2026-10-13d – Schatten: flachere Schadenskurve ab Stufe 4
- Schaden je Upgrade bei Schatten: Stufe 2/3/4 wie bisher (×2,2 / ×2,1 / ×2,1), Stufe 5 und 6 nur ×1,8 (`ELEMENTS.Schatten.upDmg`). Stufe 6 ca. −27 % gegenüber vorher, Stufe 5 −14 %, Stufe 4 und darunter unverändert.
- Grund (F): Schatten ist ab Runde 10 zu stark (Irrlicht-Verstärkung ×1,8 + ignoriert Rüstung). Der Bot spielt ohne hohe Stufen und zeigt die Änderung nicht. Im echten Spiel beobachten. Neues Spiel + neu laden.

### 13.10. 23:55 · F · 2026-10-13c – Felsen als neues Gelände
- 6–8 Felsen je Karte (nahe am Weg): alle Türme +15 % Reichweite, +15 Gold Bau; Stein +30 Gold, dafür Schaden ×1,3. Wald/Sumpf bleiben für Stein gratis.
- Gelände wird bei jedem neuen Spiel aus `startAt` neu gewürfelt (Seed `tseed` in den Wellen-Eingaben). Werte in `ROCK`/`TERRAIN`. Neues Spiel + neu laden.
- Annahme F: ×1,3 und +15 Gold für Nicht-Stein. Bot nutzt noch festes Gelände. Wirkung auf Stein im echten Spiel beobachten.

### 13.10. 10:50 · L · (kein Spielcode) – Ordner `team/` für die Zusammenarbeit
- Neu: `team/START.md` (Einstieg + Startprompt), `TODO.md` (mit „Gerade dran“), `IDEEN.md`, `UPDATES.md`. Die lange Merkliste liegt jetzt in `team/archiv/merkliste-bis-2026-10-13.md`.
- Zweck: weniger Kontext pro Sitzung, und keiner arbeitet versehentlich gegen den anderen.

### 13.10. 10:40 · F · 2026-10-13b – Zwischenbosse
- Nach Runde 5, 10, 15, 19 ein Zwischenboss (letztes Monster als Boss, Leben ×5, zählt 2 Durchbrüche, neutral). Spiel hat jetzt 24 Tage.
- `MONSTERS[k].day` = Tag, `.round` = Runde. Neues Spiel nötig.

### 13.10. 10:35 · F · (kein Spielcode) – `balance.js` repariert
- Brach seit der Versionsprüfung ab. Neu: `node tools/balance.js zehn` = 10 feste Testspiele in ca. 15 s, `INDEX=<Pfad>` zum Vergleich.

