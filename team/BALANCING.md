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
| P12 | Gier-Lücke: gieriger Aufbau vs. verbesserter | spürbar (Idee L: Gier soll nicht die beste Strategie sein) |
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

## Plan
1. Grundgerüst: Simulation laden, Reservefaktor, Testkarte, Bauplatz-Maske.
2. Aufstellungssuche (gierig + lokale Verbesserung), Nebenbedingungen.
3. Forschung, Edelsteine, Pfad (P3).
4. Prüfpunkte P1–P12, Schleifen, Bericht.
5. Eichung (P13) mit Archiv und Referenzläufen.
