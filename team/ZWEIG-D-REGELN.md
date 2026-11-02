# Zweig D: Regeln für die Übernahme ins Spiel (Stand 01.11.)

Nur die Regeln, die man im Spiel spürt oder einbauen muss. Herleitung und Messungen: `ZWEIG-D.md`. Zahlenwerte: `tools/balance/spiegel-D7T.json` (Elementtürme) und `spiegel-D7.json` (Monster, Leben). Alles ist bisher nur im Spiegel (Basis `044d8c0` + `tools/balance/basis/patch.js`), das Live-Spiel ist unverändert. **Testseite:** `spiegel-d.html` (Spiel `spiegel3`), erzeugt mit `SPIEL_D7=1 SPIEGEL=tools/balance/spiegel-D7T.json ZIEL=spiegel-d.html SPIEL=spiegel3 node tools/balance/spiegel-seite.js`; Spielregeln über die Zahlen hinaus in `tools/balance/basis/spiel-d7.js`.

## Türme
- 32 Türme neu: Standardturm (Reichweite 3,5, 1 Schuss/s, 1 Geschoss) plus Merkmale, Schaden aus festen Umrechnungsfaktoren.
- Preise 10/45/70/120/200/340/580/1000, Turmtyp-Treppe ×1,08. **Feuer T1 (Funke) 8 Gold** wie im alten Spiel (02.11., eigenes Gefühl: mehr, kleinere Türme), Schaden × 0,8, Wert je Gold gleich. Irrlicht 30.
- Feuer-Schaden × 1,03 (`kraftBlock`, 02.11.: Feuer lag ≈ 3 % unter dem Mittel).
- **Upgrades ändern nur den Schaden** (Kraft je Gold 1/0,95/1,01/1,08/1,16/1,25 für S1–S6). Reichweite, Effekt, Dauer bleiben gleich.
- Stein gegen Fliegende: T1 Kiesel, T2 Schleuder und T8 Bergkönig schwach (**70 %**, 02.11.; vorher 50 %), T4 Katapult und T6 Granitwächter normal, T3 Felsbrocken, T5 Erdbeben und T7 Lawine gar nicht. Türme ohne Fliegende machen am Boden ×46/38 ≈ ×1,21 Schaden (hergeleitet: an 8 von 46 Tagen nutzlos).
- Kiesel ohne Fläche, gezieltes Geschoss (trifft immer das anvisierte Monster).
- Betäubung bei Stein: Erdbeben (Nova, 10 %) und Lawine (15 %), je 1 s. Bergkönig ohne Betäubung (Alleskönner: Fläche, 2 Geschosse, schwach gegen Fliegende). Bepreist nach Treffern je s (1 + 0,33 × Chance × Dauer × Rate × Geschosse). **Spielcode: Chance 0 heißt dort „immer“ – beim Übernehmen 0 als „nie“ behandeln.**
- Luftspezialisten (Eiszapfen, Nachtauge): Boden 80 %, Fliegende 120 %.
- **Irrlicht** (Schatten T2): schießt nicht, Lichtkreis 2 Felder; Schatten sieht darin nachts nachtaktive Monster und macht dort ×1,05 (S1) bis ×1,15 (S6) Schaden; keine Rüstung ignorieren; Preis 30.
- Nova-Türme (Frostnova, Erdbeben) etwas teurer bepreist (×1,2).

## Effekte
- Umrechnungsfaktoren D7 (Stand): Brennen ×1,54, Bremsen 15,16, Fluch ×1,29, Nachtregel ×1,105 (Faktoren auf Wert − 1, siehe `d/d2.js`).
- Gleiche Effekte stapeln: der stärkste voll, jeder weitere mit **Brennen 35 %, Bremsen 25 %, Fluch 5 %**, höchstens 6 (Bremsen 01.11. von 5 auf 25 %: einfache Bauweisen mit mehreren Eis-Bremsern lagen sonst 10 % unter dem Mittel).
- Bremsen je Turm höchstens 40 % (mit Fläche 30 %).
- Brennen geht durch Rüstung (wie bisher).

## Stein
- Eigener Flächenabfall: Mitte 100 %, **Rand 60 %** (alle anderen 70 %; 01.11.: Stein lag bei einfachen Bauweisen 17 % über dem Mittel).
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
- Leben je Tag (`MONSTERS.*.hpMul` in `spiegel-D7.json`): auf den Bezugs-Bot kalibriert, dann an Bodentagen mit der gemeinsamen Drift der vier Elemente angehoben, an Fliegertagen auf das Mittel der vier Elemente gestellt. **02.11.:** zusätzlich jeder Tag auf das Mittel der vier Elemente (Mitte aus Menschen-Bots und Bezugs-Bot, Grenzen ×0,75–1,35). Grund: Die Leben waren an Standardtürmen eingestellt, die keine Rüstung abtragen; alle Elementtürme tun das, daher waren gepanzerte Tage zu leicht (Tag 2, 8, 11: ×1,18–1,30) und Bosse zu schwer (×0,8). Streuung je Tag (Menschen-Bots) ±22 % → ±7 %.

## Forschung (Stand 01.11., Werte vorläufig)
- Preise je Spieler; Forschung, die allen hilft, × Spielerzahl; Element-Schaden fest (hilft nur einem Spieler).
- Element-Schaden +8 / +16 / +25 %: 80 / 180 / 360 (fest).
- Effekte (Leiter): Dauer +50 % / Stärke +25 % / Stapelanteil +0,1: 20 / 70 / 130 × Spieler. Stein: Betäubung länger +50 % / Flächenabfall 105/68 % / Betäubungs-Chance +5 Punkte (gemessen ×1,01/1,06/1,08 wie Eis und Schatten; Feuer 1,04/1,10/1,12 bleibt, weil Feuer am Boden leicht unter dem Mittel liegt).
- Reichweite +0,5 / +1 / +1,5 Felder: 40 / 80 / 160 × Spieler.
- Schussgeschwindigkeit +10 / +20 / +30 %: 170 / 360 / 640 × Spieler.
- Kopfgeld, Upgrades billiger: wie bisher × Spieler.
- Freischaltung T5–T6 / T7–T8: 60 / 175 × Spieler; in den Schaden von T5–T8 eingerechnet (×1,05).
- Kasse: 2 % Zinsen je Tag, ohne Deckel.
- Leben enthalten die Wurzel eines Forschungs-Referenzwegs (Kasse 10 %, obige Preise): bis Tag 24 ×1,00, Tag 36 ×1,06, Tag 48 ×1,15 – ein halb so gut forschendes Team liegt im Ziel.

## Edelsteine (01.11.)
- Nur noch **ein Basic** (Schaden +30 %, Irrlicht: Lichtkreis +30 %) plus die beiden Uniques = 3 Optionen. Das zweite Basic (Reichweite/Effekt/Fläche +30 %) war nur ≈ ×1,05–1,13 wert; Schussrate +30 % wäre fast dasselbe wie Schaden +30 %.

## Noch offen
- Uniques der Edelsteine an D7 anpassen (Werte noch aus dem alten Spiel).
- Anzeige: Wettertexte, Wind-Richtung, Tiefflug-Strecken auf der Karte.
