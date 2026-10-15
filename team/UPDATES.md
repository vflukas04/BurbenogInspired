# Updates (neueste oben, höchstens 15 Einträge)

Format: `### TT.MM. HH:MM · L|F · VERSION – Titel` + höchstens 5 Zeilen: was, warum, worauf achten. Details stehen im Commit.

### 15.10. 18:40 · F · 2026-10-15k – Schwache Tage in Runde 2–5 auf Gold-Bedarf 1,5
- Pro Element ein bewusst schwacher Tag (Bot `bedarf` ≈ 1,5): Schatten Kellerasseln (Faktor 1,05, vorher 1), Feuer Nacktschnecken (0,9, vorher 1), Eis Ohrenkneifer (1,1, vorher 0,8; Messwert 1,6), Stein Mäuse (0,7, vorher 1). Die Regel „je Runde ein Bonus/Malus ±20 %" gilt in Block 1 damit nicht mehr streng.
- Stein 0,7 liegt knapp unter der bisherigen Spanne (0,75–1,75). Werte sind Bot-Tendenzen, bitte im Spiel prüfen.
- Neues Spiel + neu laden.

### 15.10. 17:45 · F · 2026-10-15j – Silberfische langsamer
- Silberfische Tempo 1,2 → 1,0. Grund: Stein brauchte an Tag 1 ca. das Doppelte an Gold (Bot `bedarf`: 1,9 gegen 0,8–0,9), weil geworfene Steine schnelle Ziele schlecht treffen. Mit 1,0 liegen alle Elemente bei 0,7–0,8. Kiesel-Kosten/-Schaden waren nicht der Hebel.
- Noch offen (Vorschlag, nicht eingebaut): Faktoren Block 1 neu verteilen (Stein-Malus von Runde 3 auf Runde 5), Schatten Tag 2/3 schwach (1,9/1,6, Rüstung der Kellerasseln).
- Neues Spiel + neu laden.

### 15.10. 16:50 · F · 2026-10-15i – Spiel aufgeben
- Menü ⋯ → „Spiel aufgeben …“ (mit Rückfrage): beendet das Spiel für alle als verloren, die Statistik erscheint, danach „Neues Spiel“. Vorher musste man alle Türme verkaufen und eine Welle durchlassen.
- Neu laden.

### 15.10. 14:00 · F · 2026-10-15h – Upgrade/Verkaufen über dem Turm
- Beim angewählten Turm erscheinen direkt darüber ein roter Pfeil ⬆ (Upgrade, mit Preis) und ein Goldtopf 💰 (Verkaufen, mit Erlös), bei Edelstein zusätzlich 💎. Tippen öffnet wie bisher das Bestätigungsfenster. Die Knöpfe unter der Karte entfallen. Am oberen Rand erscheinen sie unter dem Turm.
- Neu laden.

### 15.10. 13:40 · F · 2026-10-15g – Edelsteine als kleiner Buff
- Ziel: Edelstein-Fähigkeit ≈ +15 % Wirkung (Tag 5: etwa +1 Kill bei 6–7). Zu starke Fähigkeiten gedämpft: Eis Großer Ball (+30 % Fläche), Großer Sturm (+25 % Fläche, +20 % Schaden), Eisblock 0,35 s, Haut vereist 3 s; Schatten Nachtjäger +25 %; Stein Prellstein 30/15 %, Reichweite +0,5 Felder, Nachbeben 25 %.
- Messung grob (nur 7 brauchbare Test-Türme): Median Schadensgewinn Tag 5 jetzt meist 0–25 %, Stein liegt noch eher bei ~20 %. Bedingte Fähigkeiten (Fliegende, Kill-Auslöser) nicht gemessen.
- Neues Spiel + neu laden.

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

