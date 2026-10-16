# Balancing-Verfahren (L, Stand 15.10.)

Ziel: Zahlen nicht mehr von Hand drehen, sondern aus festen Prüfpunkten ableiten. Das Verfahren bleibt gleich, wenn Elemente, Fähigkeiten oder Wellen dazukommen – es ändern sich nur Daten und Zielwerte.
Das Skript schlägt vor (Tabelle alt → neu), es schreibt nichts selbst ins Spiel. Code kommt nach `tools/balance/` (Node, nutzt die Simulation aus `index.html` direkt).

**Spoiler-Regel:** Erkenntnisse zur besten Platzierung/Strategie stehen nur in `tools/balance/STRATEGIE.md`. Lukas und Friedrich lesen die nicht (Spielspaß). Berichte enthalten nur Zahlen und Vorschläge.

## Messgröße: Reservefaktor
Für eine Aufstellung und eine Welle (oder einen Boss) wird per Intervallsuche bestimmt, mit welchem Faktor auf Monsterleben/-rüstung sie die Welle **gerade noch** ohne Durchbruch schafft. 1,25 = hätte 25 % mehr verkraftet. Stetig, über Elemente und Wellen vergleichbar.

## Beste gefundene Aufstellung (Suche von grob nach fein)
1. **Bauplatz-Maske** je Karte und Reichweitenklasse: Wegstrecke in Reichweite (Kreuzung/Kurven doppelt). Irrlicht: Monsterstrecke im Lichtkreis (Mottenplage, Nachtsicht) plus Schatten-Türme darin. Felder unter ~60 % des besten fallen raus.
2. **Gieriger Aufbau:** jeweils die Aktion mit dem meisten Reservefaktor je Gold – bauen, upgraden oder Forschung kaufen (Forschungszeitpunkte ergeben sich so selbst).
3. **Lokale Verbesserung:** verschieben, Typ tauschen, Gold zwischen Upgrade und neuem Turm umschichten.
4. Nebenbedingung: ab dem Zeitpunkt, an dem sie bezahlbar sind, mindestens ein Turm jeder Stufe.
Optimal ist das nie bewiesen („beste gefundene“). Ist das Spiel am Ende zu leicht/schwer, wird global um ein paar Prozent korrigiert.

## Annahmen (erste Läufe)
- 2 Spieler als Ausgangspunkt, alle Elementpaare. 3/4 Spieler über Faktoren an Prüfpunkten.
- Alle Monster getötet → volles Kopfgeld (Obergrenze; Korridore fangen das ab).
- Wetter ignoriert. Eine Testkarte; Kartenvarianz ist eigener Prüfpunkt.
- Edelsteine: einer je Zwischenboss im eigenen Element, Fähigkeit wählt die Suche.
- Forschung: fester Anteil des Einkommens in die Kasse, so dass zum Endboss alles Sinnvolle erforscht ist (Wert steht nur im Skript).

## Prüfpunkte
| # | Prüfpunkt | Ziel (Startwerte, werden geeicht) |
| --- | --- | --- |
| P1 | Start: Startgold, Runde 1 | 12/8/6 von 20 (2/3/4 Spieler) – man fühlt sich allein im Griff |
| P2 | Kurve: beste Aufstellung je Welle (freie Suche je Welle, „Stärke je Gold“) | Reservefaktor im Korridor der Schwierigkeitsstufe |
| P3 | Pfad: durchgehender Vorwärts-Aufbau ohne Verkaufen vs. P2 | Verlust ≤ ~15 % |
| P4 | Endboss, 2 Spieler | schaffbar mit Korridor; 1 Spieler allein ≈ halbes Leben |
| P5 | Niemand nutzlos am Endboss | jeder ≥ ~30 % des Boss-Schadens (2 Spieler; bei 4 weniger) |
| P6 | Elemente gleich stark, vor allem am Ende | Reservefaktoren der Elemente ±10 % |
| P7 | Monstertypen (fliegend, Rüstung, viele Leben, nachtaktiv, schnell/langsam, Kombinationen) | jedes Element hat gewichtet nach Häufigkeit ähnlich viele schwere Tage |
| P8 | Turmrelevanz: Aufstellung ohne einen Turm; gleiches Gold in Turm k vs. k+1 | jeder Turm fehlt spürbar; höhere Stufe meist knapp vorn (nicht strikt, frühe Upgrades dürfen kippen) |
| P9 | Edelsteine | die 3 besten Fähigkeiten je Element liegen nah beieinander |
| P10 | Forschung | lohnt sich zu passenden Zeitpunkten (früh dürfen Türme besser sein) |
| P11 | Kartenvarianz | < 5 % ignorieren, > 15 % ins Verfahren aufnehmen |
| P12 | Gier-Lücke (nur im Pfadtest): gieriger Vorwärts-Aufbau vs. verbesserter | spürbar (L: Gier soll nicht die beste Strategie sein); bei Einzeltests je Stufe ist gierig + Verbesserung einfach das Suchverfahren |
| P13 | Eichung an echten Spielen (`tools/archiv.js`, `REFERENZLAUF.md`) | Abstand Skript ↔ echt bestimmt die Korridore |

## Korridore = Schwierigkeitsstufen
Spielt man die beste gefundene Aufstellung, bleibt am Endboss je Stufe eine Reserve, z. B. Schwerste 5 %, Schwer 10 %, Normal 20 %, Leicht 40 %, Ganz leicht 60 % (Startwerte). Wird später als Auswahl beim Spielstart eingebaut (Faktor auf Monsterleben/-rüstung).

## Welche Stellschraube wofür
| Stellschraube | Aufgabe | gemessen an |
| --- | --- | --- |
| Monsterleben/-rüstung je Welle | Schwierigkeitskurve | P2, P4 |
| Kraftfaktor je Element | Element-Gleichgewicht | P6, P7 |
| Turmwerte je Stufe | Relevanz | P8 |
| Fähigkeitswerte | knappe Edelstein-Wahl | P9 |
| Spielerfaktor 3/4 | mehr Spieler | P2/P4 mit 3/4 |
Gedreht wird nacheinander in Schleifen (Elemente → Kurve → Türme → wieder von vorn), bis sich nichts mehr bewegt.

## Stand
- 16.10. (L): Grundgerüst in `tools/balance/`: `sim.js` (lädt die Simulation aus `index.html`), `core.js` (Testkarte, Reservefaktor, Bauplatz-Maske), `build.js` (gieriger Aufbau), `run.js` (Aufruf). `node tools/balance/run.js p1` prüft P1 in ~5 s.
- Erstes Ergebnis P1 (Version 15t, beste Startaufstellung, Runde 1, Kills von 20; Ziel 12/8/6): Feuer 17/12/4 · Eis 7/9/4 · Schatten 14/8/3 · Stein 6/4/2. Feuer startet zu stark, Stein zu schwach. Noch nichts geändert.
- Erkenntnis 16.10.: Die Kill-Kurve hat Kipppunkte (Eis zu zweit: Faktor 0,94 → 18 Kills, 0,97 → 7). Ein Ziel mit fester Kill-Schwelle lässt die Suche auf solche Kanten optimieren. Nächster Schritt: glattere Bewertung (Mittel über mehrere Schwellen bzw. Schadensanteil) + lokale Verbesserung. Spiegel-Prinzip: Änderungsvorschläge werden nur im Speicher an der geladenen Simulation getestet, nie in `index.html` geschrieben.
- 16.10. mittags (L): **glatte Bewertung** (`reserveHp`: Anteil vernichteter Leben statt Kill-Schwelle), **lokale Verbesserung** (verschieben, entfernen + neu verteilen), **Spiegel** (`spiegel.js` + `spiegel.json`, nur im Speicher), **Tagesmodell** (`runDay`: 10 Uhr frisch, 19 Uhr dunkel die Leaks des Nachbarn) und **Vorwärtspfad** (`node tools/balance/pfad.js alle`, ~3 min, 4 Prozesse): ganzes Spiel je Element, Aufbau mit Vorausschau (heute, morgen ×0,5, übermorgen ×0,25), Sparen erlaubt, Forschung in fester Reihenfolge, volles Kopfgeld. Ergebnisse nach `tools/balance/ergebnisse/` (nicht im Repo).
- Erste Pfad-Ergebnisse (15t): Feuer deutlich am stärksten (Mittel ×1,9 des Durchschnitts), Stein am schwächsten (×0,64, v. a. Fliegende und Bosse), Schatten ×0,8, Eis ×1,0. Ab Tag 13 zu leicht (Mittel 1,6–2,3 statt Ziel 1,2). **Vorsicht:** Der Pfad schwankt stark von Tag zu Tag, weil der Bot je nach Sparen/Vorausschau anders baut. Für Zahlenentscheidungen ist P2 (freie beste Aufstellung je Welle bei gegebenem Gold) stabiler – das ist der nächste Schritt.
- 16.10. nachmittags (L): **P2** (`node tools/balance/p2.js alle`, ~25 min auf 2 Kernen): je Element, Map (0:11, 2:23, mit Gelände) und Tag die beste gefundene Aufstellung zum Budget (volles Kopfgeld, Forschung und Edelsteine wählt die Suche). Bericht `bericht.js`: Reserve je Tag gegen Zielkurve 1,5 → 1,15.
- Erster P2-Lauf (16c, 48 Tage): Feuer ×2,05, Eis ×1,07, Schatten ×1,04, Stein ×0,44 (Stein gegen Fliegende fast 0). Kurve: Runde 1–10 passt (×1,0–1,1), danach immer leichter: 11–15 ×1,4, 16–20 ×2,2, 21–25 ×3,6, 26–30 ×5,4, 31–35 ×8,1, 36–40 ×11 (Leben). **Offen:** Der Bot ist hier viel stärker als echte Spiele (Referenzlauf mit Durchbrüchen bei R ≈ 2–4 des Bots) → vor dem Anwenden P13 (Eichung) klären.
- Idee „Lernen“: kein neuronales Netz (zu wenig Daten), sondern ein Wissensspeicher bester Aufstellungen (Warmstart für die nächste Suche) und für den Endboss-Prüfpunkt eine stärkere evolutionäre Suche (mehr Rechenzeit, Ergebnis wird gespeichert).

## Grundsätze (L, 16.10.)
- **Spiegel-Spiel:** Änderungen werden beim Durchwandern der Prüfpunkte im Spiegel fortlaufend hinterlegt (eigene Datei mit Änderungen, z. B. `tools/balance/spiegel.json`, auf die geladene Simulation angewandt). Ins Spiel kommt erst ein abgesegnetes Paket.
- **Suche optimiert auf das Optimum, nicht auf das Ziel:** Die Suche bewertet ohne Kill-Schwelle (glatt: Schaden/Reserve), danach wird gemessen, wie viele Kills die beste Aufstellung schafft. Erst dann zählen Zielwerte wie 12/8/6 – beim Nerfen/Buffen.
- **Lernen:** Wissensspeicher bester Aufstellungen (`tools/balance/wissen.json`); jede Suche startet von der bisher besten und übernimmt bessere Funde, damit die Aufstellungen besser werden und am Ende wenig schwanken.
- 12/8/6 bleibt vorerst Maßgabe; später lockerbar, wenn viel Schaden gemacht wird und Leaks nicht mit vollem Leben weiterlaufen.

## Plan
1. Grundgerüst: Simulation laden, Reservefaktor, Testkarte, Bauplatz-Maske.
2. Aufstellungssuche (gierig + lokale Verbesserung), Nebenbedingungen.
3. Forschung, Edelsteine, Pfad (P3).
4. Prüfpunkte P1–P12, Schleifen, Bericht.
5. Eichung (P13) mit Archiv und Referenzläufen.
