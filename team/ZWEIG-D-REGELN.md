# Zweig D: Regeln für die Übernahme ins Spiel (Stand 29.10.)

Nur die Regeln, die man im Spiel spürt oder einbauen muss. Herleitung und Messungen: `ZWEIG-D.md`. Zahlenwerte: `tools/balance/spiegel-D7T.json` (Elementtürme) und `spiegel-D7.json` (Monster, Leben). Alles ist bisher nur im Spiegel (Basis `044d8c0` + `tools/balance/basis/patch.js`), das Live-Spiel ist unverändert.

## Türme
- 32 Türme neu: Standardturm (Reichweite 3,5, 1 Schuss/s, 1 Geschoss) plus Merkmale, Schaden aus festen Umrechnungsfaktoren.
- Preise 10/45/70/120/200/340/580/1000, Turmtyp-Treppe ×1,08.
- **Upgrades ändern nur den Schaden** (Kraft je Gold 1/0,95/1,01/1,08/1,16/1,25 für S1–S6). Reichweite, Effekt, Dauer bleiben gleich.
- Stein gegen Fliegende: T2 Schleuder schwach (50 %), T4 Katapult/T6/T8 normal, T1/T3/T5/T7 gar nicht. Türme ohne Fliegende machen am Boden ×1,17 Schaden (Preis-Zuschlag).
- Luftspezialisten (Eiszapfen, Nachtauge): Boden 60 %, Fliegende 180 %.

## Effekte
- Gleiche Effekte stapeln: der stärkste voll, jeder weitere mit **Brennen 35 %, Bremsen 5 %, Fluch 10 %**, höchstens 6.
- Bremsen je Turm höchstens 40 % (mit Fläche 30 %).
- Brennen geht durch Rüstung (wie bisher).

## Stein
- Wetterfest (wirkt nur Wind/Gewitter über das Tempo der Monster) und **Baubonus** (kein Geländeaufschlag, auf Felsen ×1,3).

## Wetter (Jahreszeiten)
- Jedes Wetter höchstens ±10 % je Element, eigene Noten (Tabelle in `ZWEIG-D.md`, Abschnitt „Wetter D7“).
- **Gewichte je Block** statt eines Gewichts: Tag 1–12 Winter (Regen, Frost), 13–24 Frühling (Regen, Bewölkt, Hitze), 25–36 Sommer (Sonnig, Hitze), 37–48 Herbst (Nebel, Wind, Hitze). Im Spiel: `WEATHER[k].wB` in `pickWeather` nach Block wählen.
- **Wind aus einer Richtung** (je Tag aus dem Seed): mit dem Wind schneller, gegen den Wind langsamer (Boden +5/−7 %, Fliegende +8/−10 %).

## Monster
- **Rüstung Tag 1–12 höher** (+30 % und +0,3 Punkte, nicht die Spatzen).
- **Nachtaktiv:** Tag 5 Mäuse, 9 Katzen, 16 Wildschweine, 19 Besoffene Penner, 27 Würfel, 31 Krieger, 33 Albträume, 37 E-Scooter-Fahrer, 38 Lindner-Spezialisten, 40 Fledermäuse, 44 Heisenbergs (Füchse und Eifersüchtige Geliebte jetzt tagsüber).
- **Fliegende:** Tempo Spatzen 1,2 · Habichte 1,6 · Uffug-Vorhaut 0,8 · Phönixe 1,1 · Looping-Louie 1,7 · Fledermäuse 1,0 · Nazgul 0,9. Gepanzert: Uffug-Vorhaut, Looping-Louie, Nazgul.
- **Looping-Louie-Tiefflug:** auf etwa ⅓ des Wegs tief (dort Bodenmonster für alle Türme), in den Übergängen fliegend ohne Malus „schwach gegen Fliegende“, sonst Hochflug. Höhe hängt vom Ort ab, alle fliegen in einer Reihe.
- Leben je Tag neu kalibriert (`MONSTERS.*.hpMul` in `spiegel-D7.json`).

## Noch offen
- Irrlicht als echter Lichtturm (Lichtkreis 2, Upgrades Licht/Verstärkung) – im Spiegel ist T2 Schatten noch ein normaler Fluchturm.
- Forschung (Wert je Freischaltung, Preis nach Spielerzahl), Edelsteine.
- Anzeige: Wettertexte, Wind-Richtung, Tiefflug-Strecken auf der Karte.
