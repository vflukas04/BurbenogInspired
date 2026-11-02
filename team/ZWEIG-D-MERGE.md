# Zweig D7 ins Spiel übernehmen – Merge-Liste mit Diskussionspunkten (L, 02.11.)

Heute: Das Spiel (`index.html`, F) und Zweig D (Testseite `spiegel-d.html`) haben eine gemeinsame Basis `044d8c0` (18.10.). Seitdem hat F im Spiel Balance-Regeln geändert (unten Teil B), Zweig D hat fast alle Spielzahlen neu hergeleitet (Teil A). F's Grafik ist in beiden gleich (02.11. in die Testseiten übernommen).
Ablauf-Vorschlag: (1) Punkte unten gemeinsam durchgehen und je Punkt entscheiden (übernehmen / anpassen / weglassen). (2) L's Claude baut die beschlossenen Teile als normalen Code in `index.html` ein (heute liegen sie als Patch in `tools/balance/basis/patch.js`, `irrlicht.js`, `spiel-d7.js` und als Zahlen in `tools/balance/spiegel-D7T.json`). (3) Prüfung (`tools/pruefung.js`, Simulation gleich wie Testseite), dann ein Testspiel zu zweit.
Regeln im Detail: `team/ZWEIG-D-REGELN.md`, Herleitung: `team/ZWEIG-D.md`.

## A. Was Zweig D ändert

| # | Bereich | Spiel heute | D7 | Zu klären |
|---|---|---|---|---|
| A1 | Türme (alle 32) | Werte von Hand/Bot eingestellt, `kraft`/`kraftT`/`kraftBlock` je Element | Standardturm + feste Umrechnungsfaktoren je Merkmal (Reichweite, Rate, Geschosse, Fläche, Effekt …); Preise 10/45/70/120/200/340/580/1000, Funke 8, Irrlicht 30 | Namen und Bilder bleiben (nach Turmnummer). Passen F's Animationen zu den neuen Raten/Reichweiten? |
| A2 | Upgrades | Schaden ×2,1, Reichweite +0,2, Dauer ×1,3, Effekt ×1,15 | **nur Schaden** (Kraft je Gold S1–S6 1/0,95/1,01/1,08/1,16/1,25) | Gefühl: Türme wachsen nicht mehr in Reichweite/Effekt |
| A3 | Effekte stapeln | stärkster wirkt, längerer als Rückfall (21e) | stärkster voll, weitere mit Anteil (Brennen 35 %, Bremsen 25 %, Fluch 5 %), höchstens 6; Bremsen je Turm ≤ 40 % (Fläche 30 %) | Größte Regeländerung; ersetzt 21e |
| A4 | Stein | Fliegende nur T3/6/8, Betäuben Erdbeben/Bergkönig, Kiesel mit Fläche | wetterfest, Baubonus; schwach gegen Fliegende (70 %): Kiesel, Schleuder, Bergkönig; normal: Katapult, Granitwächter; keine: Felsbrocken, Erdbeben, Lawine. Kiesel ohne Fläche (trifft immer). Betäuben nur Erdbeben 10 %, Lawine 15 %. Flächenrand 60 % | Spielcode: Chance 0 heißt „immer betäuben“ → beim Einbau als „nie“ behandeln |
| A5 | Irrlicht | ×1,3–1,8 Schaden im Licht, ignoriert 30–100 % Rüstung (26a) | Licht 2 Felder, ×1,05–1,15, keine Rüstung ignorieren, 30 Gold | Schatten-Gefühl nachts |
| A6 | Luftspezialisten | Brandpfeil/Eiszapfen nur Fliegende | Boden 80 %, Fliegende 120 % | |
| A7 | Monster-Leben | Kurve × hpMul, Ringregel-Faktoren, `kraftBlock` | je Tag auf Bezugs-Bot + Mittel der 4 Elemente (02.11.), Forschungsweg eingerechnet (Tag 36 ×1,06, Tag 48 ×1,15) | Spielerzahl 3/4 (noch offen, siehe C1) |
| A8 | Faktoren je Monster (Ringregel) | F's Werte bis 24c | D7 nutzt die Faktoren von C12; D-Messungen laufen mit neutralen Faktoren (Faktoren ändern das Gesamtbild kaum) | F's Änderungen 22b–24c übernehmen oder C12-Werte behalten? |
| A9 | Rüstung | wie 18.10. | Tag 1–12 +15 % / +0,15 Punkte; Rüstungsschaden nach Messung bepreist | |
| A10 | Fliegende | Tempo/Rüstung wie 18.10. | eigenes Tempo (Spatzen 1,2 … Looping-Louie 1,7), drei gepanzert; **Looping-Louie-Tiefflug** (⅓ des Wegs tief) | Tiefflug braucht Anzeige auf der Karte |
| A11 | Nachtaktive | Liste 18.10. | Füchse und Eifersüchtige Geliebte tagsüber, Krieger und Lindner-Spezialisten nachts | |
| A12 | Wetter | 8 Arten, max. ±25 % | eigene Noten, max. ±10 % je Element, **Jahreszeiten** (Gewicht je Block), **Wind aus einer Richtung** je Tag (Windhose als Anzeige geplant) | F's Feuer-Wetter (24a) entfällt |
| A13 | Forschung | Preise fest, Effekte länger | Preise je Spieler, Element-Schaden 80/180/360 fest, Effekt-Leiter (Stein eigene Stufen), Reichweite in Feldern, Schussgeschwindigkeit, Freischaltung 60/175 × Spieler (in T5–T8 eingerechnet), **2 % Zinsen je Tag** auf die Kasse | Kasse speichert Einzahlungen mit Tag (`potLog`) – neues Feld im Lane-Dokument |
| A14 | Edelsteine | 2 Basics + 2 Uniques | **1 Basic** (Schaden +30 %, Irrlicht Licht +30 %) + 2 Uniques | Uniques noch nicht an D7 angepasst (offen) |
| A15 | Anzeige Schaden/s | auf 0,1 aufgerundet | ohne Runden (Runden verschob T1 je Element um bis zu 4 %) | Anzeige mit einer Nachkommastelle, Rechnung genau |
| A16 | Fehler | flyMul (Luftspezialist, „schwach gegen Fliegende“) wurde nie angewandt | behoben | im Spiel ebenfalls beheben |

## B. Was F seit der Basis im Spiel geändert hat (Balance/Regeln)

| # | Änderung (F) | Verhältnis zu D7 | Vorschlag |
|---|---|---|---|
| B1 | 18h–19f, 22b–24c: Faktoren/`kraftBlock` Block 1–2, Feuer-Rollen, Stein-Malus | D7 ersetzt `kraft`/`kraftBlock`/`kraftT` ganz | entfällt, außer F möchte einzelne Ringregel-Tage behalten (A8) |
| B2 | 21e: stärkster Effekt + Rückfall | ersetzt durch Stapelregel (A3) | entfällt |
| B3 | 24d: Zwischenboss-Tage wie Live | unabhängig von D7 | **behalten** (Leben der Zwischenbosse ggf. nachmessen) |
| B4 | 26a: Irrlicht auf Monster im Licht | D7 nutzt die Regel, aber kleinere Werte (A5) | Regel behalten, Werte aus D7 |
| B5 | 02.11a: große Seen und Wälder; 27q: Dorffeld nicht bebaubar | D7 wurde mit altem Gelände gemessen; Unterschied nur bei Bauaufschlägen | behalten |
| B6 | Kreativ-Modus, Verbindungswächter, Grafik | unabhängig | behalten (schon in den Testseiten) |

## C. Vor dem Einbau noch offen (Zweig D)
- C1 **3 und 4 Spieler:** Messungen bisher mit 2 Spielern. Erster Befund (`d/spiel4.js`): mit 4 Spielern viel leichter (Durchbrüche 4–19 statt 350–590 bei den Menschen-Bots) und Schatten zu stark (Gold 26–33 % statt 25 %; vermutlich Nachtregel: nur 1 von 4 Wellen dunkel). Umrechnung je Spielerzahl folgt.
- C2 Edelstein-Uniques an D7 anpassen.
- C3 Anzeige: Windhose, Tiefflug-Strecken.
- C4 Testspiele mit anderen Paaren (Eis/Schatten …) und mit 3–4 Spielern.
