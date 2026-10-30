# Zweig D: Regeln für die Übernahme ins Spiel (Stand 30.10. abends)

Nur die Regeln, die man im Spiel spürt oder einbauen muss. Herleitung und Messungen: `ZWEIG-D.md`. Zahlenwerte: `tools/balance/spiegel-D7T.json` (Elementtürme) und `spiegel-D7.json` (Monster, Leben). Alles ist bisher nur im Spiegel (Basis `044d8c0` + `tools/balance/basis/patch.js`), das Live-Spiel ist unverändert.

## Türme
- 32 Türme neu: Standardturm (Reichweite 3,5, 1 Schuss/s, 1 Geschoss) plus Merkmale, Schaden aus festen Umrechnungsfaktoren.
- Preise 10/45/70/120/200/340/580/1000, Turmtyp-Treppe ×1,08.
- **Upgrades ändern nur den Schaden** (Kraft je Gold 1/0,95/1,01/1,08/1,16/1,25 für S1–S6). Reichweite, Effekt, Dauer bleiben gleich.
- Stein gegen Fliegende: T1 Kiesel, T2 Schleuder und T8 Bergkönig schwach (50 %), T4 Katapult und T6 Granitwächter normal, T3 Felsbrocken, T5 Erdbeben und T7 Lawine gar nicht. Türme ohne Fliegende machen am Boden ×46/38 ≈ ×1,21 Schaden (hergeleitet: an 8 von 46 Tagen nutzlos).
- Kiesel ohne Fläche, gezieltes Geschoss (trifft immer das anvisierte Monster).
- Betäubung bei Stein: Erdbeben (Nova, 10 %) und Lawine (15 %), je 1 s. Bergkönig ohne Betäubung (Alleskönner: Fläche, 2 Geschosse, schwach gegen Fliegende). Bepreist nach Treffern je s (1 + 0,33 × Chance × Dauer × Rate × Geschosse). **Spielcode: Chance 0 heißt dort „immer“ – beim Übernehmen 0 als „nie“ behandeln.**
- Luftspezialisten (Eiszapfen, Nachtauge): Boden 80 %, Fliegende 120 %.
- **Irrlicht** (Schatten T2): schießt nicht, Lichtkreis 2 Felder; Schatten sieht darin nachts nachtaktive Monster und macht dort ×1,05 (S1) bis ×1,15 (S6) Schaden; keine Rüstung ignorieren; Preis 30.
- Nova-Türme (Frostnova, Erdbeben) etwas teurer bepreist (×1,2).

## Effekte
- Umrechnungsfaktoren D7 (Stand): Brennen ×1,54, Bremsen 15,16, Fluch ×1,29, Nachtregel ×1,105 (Faktoren auf Wert − 1, siehe `d/d2.js`).
- Gleiche Effekte stapeln: der stärkste voll, jeder weitere mit **Brennen 35 %, Bremsen 5 %, Fluch 5 %**, höchstens 6.
- Bremsen je Turm höchstens 40 % (mit Fläche 30 %).
- Brennen geht durch Rüstung (wie bisher).

## Stein
- Flächenabfall wie alle (Mitte 100 %, Rand 70 %); Stein-Niveau kann später über den eigenen Flächenabfall (Spiel: 120/80 %) gestellt werden.
- Wetterfest (wirkt nur Wind/Gewitter über das Tempo der Monster) und **Baubonus** (kein Geländeaufschlag, auf Felsen ×1,3).

## Wetter (Jahreszeiten)
- Jedes Wetter höchstens ±10 % je Element, eigene Noten (Tabelle in `ZWEIG-D.md`, Abschnitt „Wetter D7“).
- **Gewichte je Block** statt eines Gewichts: Tag 1–12 Winter (Frost, Bewölkt, Gewitter, etwas Regen), 13–24 Frühling (Regen, Bewölkt, Hitze), 25–36 Sommer (Sonnig, Hitze), 37–48 Herbst (Nebel, Wind, Hitze). Im Spiel: `WEATHER[k].wB` in `pickWeather` nach Block wählen.
- **Wind aus einer Richtung** (je Tag aus dem Seed): mit dem Wind schneller, gegen den Wind langsamer (Boden +5/−7 %, Fliegende +8/−10 %).

## Monster
- **Rüstung Tag 1–12 höher** (+15 % und +0,15 Punkte, nicht die Spatzen).
- Rüstungsschaden ist nach Messung bepreist (Abtrag 0,5: ×1,10 · 0,6: ×1,14 · 1,5: ×1,28).
- **Nachtaktiv:** Tag 5 Mäuse, 9 Katzen, 16 Wildschweine, 19 Besoffene Penner, 27 Würfel, 31 Krieger, 33 Albträume, 37 E-Scooter-Fahrer, 38 Lindner-Spezialisten, 40 Fledermäuse, 44 Heisenbergs (Füchse und Eifersüchtige Geliebte jetzt tagsüber).
- **Fliegende:** Tempo Spatzen 1,2 · Habichte 1,6 · Uffug-Vorhaut 0,8 · Phönixe 1,1 · Looping-Louie 1,7 · Fledermäuse 1,0 · Nazgul 0,9. Gepanzert: Uffug-Vorhaut, Looping-Louie, Nazgul.
- **Looping-Louie-Tiefflug:** auf etwa ⅓ des Wegs tief (dort Bodenmonster für alle Türme), in den Übergängen fliegend ohne Malus „schwach gegen Fliegende“, sonst Hochflug. Höhe hängt vom Ort ab, alle fliegen in einer Reihe.
- Leben je Tag (`MONSTERS.*.hpMul` in `spiegel-D7.json`): auf den Bezugs-Bot kalibriert, dann an Bodentagen mit der gemeinsamen Drift der vier Elemente angehoben, an Fliegertagen auf das Mittel der vier Elemente gestellt.

## Noch offen
- Forschung (Wert je Freischaltung, Preis nach Spielerzahl), Edelsteine.
- Anzeige: Wettertexte, Wind-Richtung, Tiefflug-Strecken auf der Karte.
