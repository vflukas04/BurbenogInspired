# Zusammenführen: ein gemeinsamer Stand für Spiel und Balancing (Vorbereitung L, 03.11.)

Zum gemeinsamen Durchgehen mit F. Je Punkt entscheiden: **übernehmen / anpassen / weglassen**. Danach baut ein Claude den beschlossenen Stand als normalen Code in `index.html` ein; Testseiten und eingefrorene Basis entfallen dann.
Regeln im Detail: `team/ZWEIG-D-REGELN.md` · Herleitung und alle Messungen: `team/ZWEIG-D.md` · Verfahren der C-Kette: `team/BALANCING.md`.

## 0. Kurzfassung
- Heute gibt es **vier Balancing-Stände**: das Spiel von F (`index.html`, Mikrobalancing nach Testspielen), den Optimierer (`spiegel.html`), die C-Kette (`spiegel-a.html`, C12f) und Zweig D7 (`spiegel-d.html`). Alle drei Testseiten laufen auf der Basis vom 18.10. plus F's Grafik.
- **Empfehlung L:** D7 als Zahlen- und Regelstand, F's Regeln und Funktionen seit dem 18.10. dazu, soweit sie nicht Balance sind (Teil B). Begründung in Teil 1: D7 ist am gleichmäßigsten zwischen den Elementen und über die Spielerzahlen, und es ist als einziger Stand aus festen Regeln hergeleitet (nachvollziehbar, wenige Stellschrauben).
- Vor dem Einbau offen: Teil 3 (Designfragen) und die Edelstein-Uniques.

## 1. Bewertung der vier Balancing-Wege

Gleiche Umgebung für alle (Bots auf den echten Seiten, ohne Forschung). Zahlen: Element ÷ Mittel der vier Elemente bzw. Gold-Anteil je Spieler in ganzen Spielen.

| | Spiel F (29c) | Optimierer | C12f | **D7 (02.11. abends)** |
|---|---|---|---|---|
| Spanne der Elemente am Boden, einfache Bauweisen (stärkstes ÷ schwächstes) | 3,15 | 2,17 | 1,12 | **1,07** |
| … gut planender Bot | – | – | 1,24 | 1,18 |
| Spanne je Block (einfache Bauweisen) | 1,2–6,2 | 1,2–3,4 | 1,11–1,49 | **≈ 1,1** |
| Gold je Spieler in Duos (ganze Spiele) | **18–82 %** | – | 36–64 % | **47–53 %** |
| Gold je Spieler zu viert | 10–47 % | – | 19–34 % | **22–28 %** |
| Fliegertage | Stein 0,70 | Stein 0,64 | Stein 0,35 | Stein 0,6 (gewollt am schwächsten), Schatten am stärksten |
| 2 / 3 / 4 Spieler gleich schwer? | nein (4 Spieler viel leichter) | nein | nein | **ja** (Leben ×1 / 1,51 / 2,03) |
| Herleitung | Testspiele, Faktoren von Hand | Optimierer über Prüfpunkte | Bot-Paare, Ebene B+C | Standardturm + feste Umrechnungsfaktoren, Leben je Tag gemessen |
| Testspiele | viele (bis 29.10.) | wenige | 6 (22.–24.10.) | 7 (01.–03.11.) |

- **Spiel F:** gute Einzeltage nach Testspielen, aber Elemente weit auseinander (Feuer schwach, Stein stark), und Gold je Spieler sehr ungleich (Feuer+Stein: 18/82 %).
- **Optimierer:** besser als das Spiel, aber Feuer weiter schwach (0,65); nicht weiterverfolgt seit 18.10.
- **C12f:** über das ganze Spiel gut, aber deutliche Sprünge zwischen Blöcken, Stein an Fliegertagen fast nutzlos, Gold in Duos 36–64 %.
- **D7:** in allen Messungen am gleichmäßigsten. Schwächen: hängt stärker an der Bauweise (gut planende Spieler: Feuer 1,08, Stein 0,91), Testspiele zeigen noch einzelne Gefühlsfragen (Teil 3).
- **Vorschlag:** D7 übernehmen, die anderen drei Stände archivieren (Spiegel-Dateien bleiben im Repo, Testseiten werden entfernt).

## 2. Erkenntnisse aus den Testspielen (01.–03.11., `spiegel-d.html`)

| Spiel | Ergebnis | Gelernt → umgesetzt |
|---|---|---|
| Feuer+Stein (3×) | verloren Tag 7–13 | gepanzerte Tage zu leicht → Leben je Tag aufs Element-Mittel; Stein an Fliegertagen zu schwach → „schwach gegen Fliegende“ 70 %; viel Gold früh in die Kasse (Forschung lohnt sich früh nicht) |
| Schatten+Eis | verloren Tag 16 | Schatten am Anfang viel zu stark, Irrlicht zu klein, Tag/Nacht zu krass → Nacht 70 % statt gar nicht, Irrlicht 3 Felder; **Fehler:** Wetter-Mittel galt im Spiel doppelt zum echten Wetter (behoben) |
| Feuer+Schatten | verloren Tag 24 (Endboss) | Schwierigkeit angenehm (L); Zwischenbosse dürfen durchrutschen (L) → Bosse unverändert |
| Eis (Bremsen) | Auswertung brach ab | **Fehler** „process is not defined“ in der Testseite (behoben) |
| 4 Spieler (läuft, Tag 32) | 14 durch | siehe unten |

**4-Spieler-Spiel (Feuer, Eis, Stein, Schatten; läuft, Stand Tag 32, nur gelesen):**
- 14 Durchbrüche: 6 vom Fuchs-Boss (Tag 12), 6 an Tag 28 (Fliegertag), sonst fast nichts.
- Zwischenbosse sterben erst auf der 4. Map (20 Uhr), die Edelsteine gehen damit immer an denselben Platz in der Reihe.
- Erster Durchlauf je Spieler nur 1–8 % – bei 4 Spielern so gewollt (jede Map ¼ der Arbeit), fühlt sich aber leer an (siehe 3.2).
- Gold: Feuer 27 % · **Eis 18 %** · Stein 26 % · Schatten 29 %. Eis lag auf Map 1 (kurzer Weg, schwerer), Schatten auf Map 3 (langer Weg, leichter) → Map-Unterschied (3.5) wirkt hier mit. Eis hat am meisten verbaut (3137 Gold bis Tag 30), also Geschenke bekommen – Schenken gleicht aus wie gedacht.
- Forschung: 11 Stufen erforscht, Kassen bis 800 Gold.
- **Bug „Monster werden gar nicht beschossen“:** In 5 Neustarts zwischen 21:07 und 21:18 hatte Welle 1 überall 0 Kills, die zweite Welle dann Kills. Ob zu dem Zeitpunkt Türme standen, speichert das Archiv nicht. Nach dem Neustart um 21:20 nicht mehr aufgetreten. Vorschlag: Archiv speichert künftig die Türme je Welle (für die Fehlersuche).

## 3. Designfragen (vor dem Einbau entscheiden)

| # | Frage | Optionen | Vorschlag L |
|---|---|---|---|
| 3.1 | Wie viel soll jeder in seiner **eigenen Welle** schaffen? Heute kalibriert auf „97 % sterben über den ganzen Tag“; zu zweit schafft jeder im ersten Durchlauf ab Tag 13 nur 0–6 von 20 | (a) so lassen – das Abräumen beim Partner ist das Spiel; (b) auf „eigene Welle etwa zur Hälfte“ kalibrieren (Spiel insgesamt leichter) | offen – Gefühl von L und F entscheidet |
| 3.2 | **4 Spieler:** erste Welle fühlt sich leer an (Starttürme töten ~1 von 20) | (a) so lassen + Hinweis auf der Seite; (b) Leben bei 4 Spielern ×1,75 statt ×2,03 (dann leichter als zu zweit); (c) nur Tag 1–3 bei 3–4 Spielern leichter | (c) |
| 3.3 | **Schatten tagsüber / nachts** | heute: nachts außerhalb des Lichts 70 %, Irrlicht 3 Felder; bei 4 Spielern zwei Nachtwellen (17 und 20 Uhr) | so lassen, nach Testspielen nachstellen |
| 3.4 | **Feuer tötet über Brennen oft erst beim Partner** (der bekommt das Gold) | (a) so lassen, Ausgleich über Stärke (heute Feuer ×1,06); (b) Tod durch Brennen zählt für den Brandstifter | (a); (b) wäre eine neue Regel |
| 3.5 | **Maps ungleich lang** (Map 0/1: 62 Felder, Map 2/3: 64 → ≈ 8 % leichter) | (a) Wege angleichen (F, Karten); (b) Leben je Map | (a) |
| 3.6 | **Forschung früh ist eine Falle** (40–55 % des Golds bis Tag 6–9 in der Kasse) | (a) Hinweis „lohnt sich ab etwa X Gold in Türmen“; (b) Stufe 1 billiger | (a) |
| 3.7 | **Edelstein-Uniques** sind noch die Werte vom 18.10. | jede Fähigkeit messen und an D7 anpassen (aufwendig) oder erst im Testspiel beobachten | messen, aber nach dem Einbau |
| 3.8 | **Upgrades:** S6 hat 25 % mehr Kraft je Gold als S1, wenige große Türme lohnen sich | flacher machen oder so lassen | so lassen (Belohnung fürs Sparen) |
| 3.9 | **Ringregel (Faktoren je Monster):** D7 nutzt die Faktoren von C12, F hat seitdem Block 1–2 geändert (22b–24c) | C12-Faktoren behalten oder F's Werte übernehmen (dann Leben je Tag nachmessen) | C12-Faktoren, F's Tage im Testspiel prüfen |
| 3.9b | **Sitzreihenfolge** entscheidet stark über das Gold (Testspiel nachgespielt: max ÷ min 1,28 bis 1,99 je nach Reihenfolge) | (a) so lassen, Ausgleich übers Schenken; (b) Reihenfolge je Tag wechseln (Ring dreht sich); (c) Archiv speichert Türme je Welle, dann genauer messen | (c), danach entscheiden |
| 3.10 | Anzeige | Tiefflug-Strecken (Looping-Louie), Wettertexte, Windhose (gezeichnet, KI-Bild möglich) | nach dem Einbau |

## 4. Was D7 gegenüber dem Spiel ändert (Kurzliste)

| # | Bereich | Spiel heute (F) | D7 | Hinweis beim Einbau |
|---|---|---|---|---|
| A1 | Türme (alle 32) | Werte von Hand, `kraft`/`kraftT`/`kraftBlock` | Standardturm + Umrechnungsfaktoren; Preise 10/45/70/120/200/340/580/1000, Funke 8, Irrlicht 30; Feinabstimmung `kraft` 1,06/1,03/1,03/0,97 und T1 | Namen und Bilder bleiben (nach Turmnummer); Animationen auf neue Raten prüfen |
| A2 | Upgrades | Schaden, Reichweite, Dauer, Effekt wachsen | nur Schaden | |
| A3 | Effekte | stärkster + Rückfall (21e) | Stapeln: stärkster voll, weitere Brennen 35 % · Bremsen 25 % · Fluch 5 %, höchstens 6; Bremsen je Turm ≤ 40 % (Fläche 30 %) | ersetzt 21e |
| A4 | Stein | Fliegende T3/6/8, Betäuben Erdbeben/Bergkönig | wetterfest, Baubonus, schwach gegen Fliegende 70 % (T1, T2, T8), Kiesel ohne Fläche, Betäuben Erdbeben 10 % / Lawine 15 %, Rand 60 % | Spielcode: Chance 0 = „immer“ → als „nie“ behandeln |
| A5 | Schatten/Nacht | nachts nachtaktive nur im Licht; Irrlicht ×1,3–1,8, Rüstung ignorieren | nachts außerhalb des Lichts 70 %; Irrlicht 3 Felder, ×1,05–1,15, keine Rüstung ignorieren | |
| A6 | Luftspezialisten | nur Fliegende | Boden 80 %, Fliegende 120 % | |
| A7 | Leben | Kurve × hpMul × Spielerfaktor 1/1,25/1,5 | je Tag gemessen (Element-Mittel), Forschungsweg eingerechnet, Spielerfaktor 1/1,51/2,03; 4 Spieler mit Wellen 10/13/17/20, dunkel ab 17 | |
| A8 | Rüstung | Stand 18.10. | Tag 1–12 +15 % / +0,15 Punkte | |
| A9 | Fliegende | Stand 18.10. | eigenes Tempo, drei gepanzert, Looping-Louie-Tiefflug | Tiefflug braucht Anzeige |
| A10 | Nachtaktive | Stand 18.10. | Füchse, Eifersüchtige Geliebte tagsüber; Krieger, Lindner-Spezialisten nachts | |
| A11 | Wetter | max. ±25 % | max. ±10 %, Jahreszeiten, Wind mit Richtung + Windhose | `kraftBlock` darf im Spiel **nicht** zusätzlich wirken |
| A12 | Forschung | feste Preise | Preise je Spieler, Element-Schaden 80/180/360, Effekt-Leiter, Reichweite in Feldern, Schussgeschwindigkeit, Freischaltung 60/175 × Spieler, 2 % Zinsen je Tag | neue Felder im Lane-Dokument: `potLog` (Liste von Objekten), `resDay` |
| A13 | Edelsteine | 2 Basics + 2 Uniques | 1 Basic + 2 Uniques | Uniques offen (3.7) |
| A14 | Schaden/s | auf 0,1 aufgerundet | genau | |
| A15 | Fehler | `flyMul` wurde nie angewandt | behoben | |

## 5. Was F seit dem 18.10. im Spiel geändert hat

| # | Änderung | Vorschlag |
|---|---|---|
| B1 | Balance 18h–19f, 22b–24c (Faktoren, `kraftBlock`, Feuer-Rollen, Stein-Malus) | entfällt durch D7 (außer 3.9) |
| B2 | 21e Effekt-Rückfall | entfällt (Stapelregel A3) |
| B3 | 24d Zwischenboss-Tage wie Live | **behalten**; Leben der Zwischenbosse danach im Testspiel prüfen (D7 wurde ohne 24d gemessen) |
| B4 | 26a Irrlicht wirkt auf Monster im Licht | Regel behalten, Werte aus D7 |
| B5 | Gelände: große Seen/Wälder, Dorffeld gesperrt | behalten (D7 mit altem Gelände gemessen, Unterschied nur bei Bauaufschlägen) |
| B6 | Grafik, Animationen, Dorf, Arbeiter, Gesandte, Schräg-Ansicht, Kreativ-Modus, Verbindungswächter, Auto-Neuladen | behalten (schon in den Testseiten) |
| B7 | Automatische Prüfung bei jedem Push | behalten, um eine Prüfung „Simulation = Testseite“ ergänzen |

## 6. Technischer Ablauf
1. Termin L + F: Teil 3 entscheiden, Teil 4/5 bestätigen. Ergebnis hier eintragen.
2. Ein Claude baut ein (in `TODO.md` → „Gerade dran“ eintragen, F pausiert Spielcode-Änderungen so lange):
   - Zahlen aus `tools/balance/spiegel-D7T.json` direkt in die Spieldaten von `index.html`.
   - Code aus `tools/balance/basis/patch.js`, `irrlicht.js` und `spiel-d7.js` als normalen Code einbauen (ohne die nur für Messungen gedachten Schalter, `kraftBlock` nur in den Messwerkzeugen).
   - Prüfen: Simulation von `index.html` = Simulation von `spiegel-d.html` für feste Testwellen; `tools/pruefung.js`; Browser-Test mit allen vier Elementen ohne Firebase.
   - `VERSION` hoch, „Neues Spiel starten“ für alle laufenden Spiele.
3. Messwerkzeuge auf `index.html` umstellen (kein eingefrorener Basis-Stand mehr), Testseiten `spiegel*.html` entfernen, CLAUDE.md und START.md auf den neuen Stand bringen.
4. Testspiel zu zweit und zu viert, danach Edelstein-Uniques (3.7).

Hinweis: Es gibt nur den Branch `main`. „Zweige“ meint hier die Arbeitsstände (Spiel / Optimierer / C-Kette / D).
