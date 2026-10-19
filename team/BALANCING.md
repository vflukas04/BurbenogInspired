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
| P6 | Elemente gleich stark, **gesamt** (L, 18.10.) | ±5 % (Stein: Fliegertage mit Gewicht 0,25) |
| P6B | Elemente gleich stark **je 5er-Block** | ±10 % |
| P7 | Monstertypen (fliegend, Rüstung, viele Leben, nachtaktiv, schnell/langsam, Kombinationen) | jedes Element hat gewichtet nach Häufigkeit ähnlich viele schwere Tage |
| P8a | **Turmstufen** (analytisch): Zuwachs an Schaden/s je Gold beim Upgrade auf Stufe 2…6 relativ zum Bau desselben Turms | fallend, Ziel 0,95/0,9/0,8/0,7/0,6; Upgrade auf S4 nicht besser als Bau des nächsten Schadensturms (inkl. halbe Freischaltung); Turm 1 je Gold ≥ 60 % des nächsten Schadensturms (Einsteiger-Falle) |
| P8 | **Turmnutzung** (aus P2): neue Türme lohnen sich, kein Turm nutzlos | ab Runde 21 ≥ 35 % des Turm-Golds in Türmen 5–8; jeder Schadensturm in mindestens einem Block ≥ 5 % |
| P9 | Edelsteine (`p9.js`, nur Bericht) | die 3 besten Fähigkeiten je Element höchstens ×1,15 auseinander; keine unter +2 % |
| P10 | Forschung (nur Bericht) | Kaufzeitpunkt und -häufigkeit im P2-Lauf: „nie“ = zu teuer/nutzlos, „sofort“ = zu billig. Später: Wert je Gold gegen besten Turmkauf an Stichtagen; P2 mit/ohne Forschung |
| P11 | Kartenvarianz | < 5 % ignorieren, > 15 % ins Verfahren aufnehmen (zurückgestellt) |
| P12 | Gier-Lücke | zurückgestellt |
| P13 | Eichung an echten Spielen | zurückgestellt |

## Korridore = Schwierigkeitsstufen
Spielt man die beste gefundene Aufstellung, bleibt am Endboss je Stufe eine Reserve, z. B. Schwerste 5 %, Schwer 10 %, Normal 20 %, Leicht 40 %, Ganz leicht 60 % (Startwerte). Wird später als Auswahl beim Spielstart eingebaut (Faktor auf Monsterleben/-rüstung).

## Welche Stellschraube wofür
| Stellschraube | Aufgabe | gemessen an |
| --- | --- | --- |
| Monsterleben/-rüstung je Welle | Schwierigkeitskurve | P2, P4 |
| Kraftfaktor je Element | Element-Gleichgewicht über das ganze Spiel | P6, P7 |
| Kraft je Turm (`kraftT`) | Element-Gleichgewicht je Block (die Türme, die dort tragen); Nebenbedingung P8a | P6 je Block, P8a |
| Schadensfaktor je Upgrade-Stufe (`CONFIG.upgrade.steps`, Schatten `upDmg`) | Turmstufen | P8a |
| Kraft je Turm (`kraftT`), Freischaltkosten (`RESEARCH t5/t7`) | Turmnutzung | P8 |
| Fähigkeitswerte | knappe Edelstein-Wahl | P9 |
| Spielerfaktor 3/4 | mehr Spieler | P2/P4 mit 3/4 |
Gedreht wird nacheinander in Schleifen (Elemente → Kurve → Türme → wieder von vorn), bis sich nichts mehr bewegt.

## Optimierer (seit 18.10.)
`node tools/balance/optimierer.js` (Prüfpunkte in `pruef.js`). Je Runde alle Prüfpunkte mit Stellschraube (P2, P6, P6B, P8a, P8) in **zufälliger Reihenfolge**; je Prüfpunkt ein Vorschlag für seine Stellschrauben (gedämpft ^0,7) → voller P2-Lauf → **nur übernommen, wenn der Gesamtfehler sinkt** (Summe der gewichteten Fehlerquadrate, P6 doppelt). Bei Strukturänderungen (P6B, P8a, P8) wird vor dem Verwerfen einmal Kurve und Elementkraft nachgeführt. Ende, wenn jeder Prüfpunkt `RUNDEN` (2) Mal dran war; bester Stand → `spiegel.json`. Zwischenstand `ergebnisse/opt-stand.json`, Protokoll `opt-log.txt`, Neustart rechnet weiter. `node tools/balance/optimierer.js bericht` zeigt den Stand. P9, P10 sind Berichte (P9: `node tools/balance/p9.js`).
- **Abstand Spiegel ↔ Spiel** (19.10.): `node tools/balance/abstand.js` (Tabelle) bzw. `… kurz` (Fazit, bei jedem Sitzungsstart). Vergleicht die Spiegel-Werte mit dem Spielstand, auf dem der Spiegel aufsetzt (`_basis` in `spiegel.json`), und mit dem Spiel jetzt; ⚠ = F hat einen Spiegel-Wert geändert; dazu alle übrigen Spieländerungen seit der Basis und Elemente, an denen beide mit verschiedenen Stellschrauben drehen. Wird der Spiegel auf einen neueren Spielstand gesetzt, `_basis` mitziehen.
- Dauer: je Schritt ein P2-Lauf (1 Map ca. 20–25 min, `OPT_MAPS=0:11,2:23` doppelt so lang).
- Zufällige statt fester Reihenfolge bringt allein nichts; der Gewinn kommt aus Annehmen/Verwerfen (kein Pendeln wie Lauf A) und dem Nachführen. Grenzen bleiben die des Bots (nur heutige Welle, volles Kopfgeld, beide Spieler gleiches Element).

## Einwände aus Testspielen → Learning fürs Skript
Jeder Einwand von L oder F wird hier eingetragen: Was fiel auf, woran lag es, welcher Prüfpunkt hätte es zeigen müssen, was wurde am Skript geändert.

| Datum | Einwand | Ursache | Prüfpunkt | Änderung am Skript |
| --- | --- | --- | --- | --- |
| 16.10. | F: Upgrades zu stark (Schatten T1 → S3 so stark wie 5 Türme) | Schaden je Stufe ×1,6–2,35 bei Kosten ×1,5 → Upgrade je Gold wird nie schlechter | fehlte | P8a (Turmstufen) |
| 18.10. | F: Stein-Kiesel ist eine Falle („nur Kiesel hochgezogen, kaum etwas geschafft“) | `kraftT` Kiesel 0,4 (17g), weil der Bot mit Kiesel-Massen Stein in Runde 1–5 zu stark machte; der Bot baut ab Tag 2 Schleuder, Menschen ziehen Kiesel hoch | fehlte (Bot spielt anders als Menschen) | P8a: Turm 1 je Gold ≥ 60 % des nächsten Schadensturms |
| 18.10. | L: Bot baut fast nur Turm 1–4 | wie 16.10.; dazu Freischaltung 250/700 | P8 fehlte | P8 (Turmnutzung) |

## Stand
- 16.10. (L): Grundgerüst in `tools/balance/`: `sim.js` (lädt die Simulation aus `index.html`), `core.js` (Testkarte, Reservefaktor, Bauplatz-Maske), `build.js` (gieriger Aufbau), `run.js` (Aufruf). `node tools/balance/run.js p1` prüft P1 in ~5 s.
- Erstes Ergebnis P1 (Version 15t, beste Startaufstellung, Runde 1, Kills von 20; Ziel 12/8/6): Feuer 17/12/4 · Eis 7/9/4 · Schatten 14/8/3 · Stein 6/4/2. Feuer startet zu stark, Stein zu schwach. Noch nichts geändert.
- Erkenntnis 16.10.: Die Kill-Kurve hat Kipppunkte (Eis zu zweit: Faktor 0,94 → 18 Kills, 0,97 → 7). Ein Ziel mit fester Kill-Schwelle lässt die Suche auf solche Kanten optimieren. Nächster Schritt: glattere Bewertung (Mittel über mehrere Schwellen bzw. Schadensanteil) + lokale Verbesserung. Spiegel-Prinzip: Änderungsvorschläge werden nur im Speicher an der geladenen Simulation getestet, nie in `index.html` geschrieben.
- 16.10. mittags (L): **glatte Bewertung** (`reserveHp`: Anteil vernichteter Leben statt Kill-Schwelle), **lokale Verbesserung** (verschieben, entfernen + neu verteilen), **Spiegel** (`spiegel.js` + `spiegel.json`, nur im Speicher), **Tagesmodell** (`runDay`: 10 Uhr frisch, 19 Uhr dunkel die Leaks des Nachbarn) und **Vorwärtspfad** (`node tools/balance/pfad.js alle`, ~3 min, 4 Prozesse): ganzes Spiel je Element, Aufbau mit Vorausschau (heute, morgen ×0,5, übermorgen ×0,25), Sparen erlaubt, Forschung in fester Reihenfolge, volles Kopfgeld. Ergebnisse nach `tools/balance/ergebnisse/` (nicht im Repo).
- Erste Pfad-Ergebnisse (15t): Feuer deutlich am stärksten (Mittel ×1,9 des Durchschnitts), Stein am schwächsten (×0,64, v. a. Fliegende und Bosse), Schatten ×0,8, Eis ×1,0. Ab Tag 13 zu leicht (Mittel 1,6–2,3 statt Ziel 1,2). **Vorsicht:** Der Pfad schwankt stark von Tag zu Tag, weil der Bot je nach Sparen/Vorausschau anders baut. Für Zahlenentscheidungen ist P2 (freie beste Aufstellung je Welle bei gegebenem Gold) stabiler – das ist der nächste Schritt.
- 16.10. nachmittags (L): **P2** (`node tools/balance/p2.js alle`, ~25 min auf 2 Kernen): je Element, Map (0:11, 2:23, mit Gelände) und Tag die beste gefundene Aufstellung zum Budget (volles Kopfgeld, Forschung und Edelsteine wählt die Suche). Bericht `bericht.js`: Reserve je Tag gegen Zielkurve 1,5 → 1,15.
- Erster P2-Lauf (16c, 48 Tage): Feuer ×2,05, Eis ×1,07, Schatten ×1,04, Stein ×0,44 (Stein gegen Fliegende fast 0). Kurve: Runde 1–10 passt (×1,0–1,1), danach immer leichter: 11–15 ×1,4, 16–20 ×2,2, 21–25 ×3,6, 26–30 ×5,4, 31–35 ×8,1, 36–40 ×11 (Leben). **Offen:** Der Bot ist hier viel stärker als echte Spiele (Referenzlauf mit Durchbrüchen bei R ≈ 2–4 des Bots) → vor dem Anwenden P13 (Eichung) klären.
- 16.10. abends (L): Schleifen 1–3 (`schleife.js` schreibt `spiegel.json`). Ziel: Band unten 1,4 (Endboss 40 % Bot-Reserve), oben Bogen bis 2,0 um Runde 20, Runde 1–5 bleibt bei P1, Leben nie unter Startwert. Upgrades gestuft genervt (Spiegel: ×2,2/2,1/1,9/1,7/1,6). Stand nach Schleife 3: Elemente ±2 % (Stein ohne Fliegende), Stein bei Fliegenden 28 % der anderen (Grenze 25 %), Leben je Block ab Runde 16 ×1,36 … ×7,2. Offen: Betty (Endboss 2) zu schwer (R ≈ 1,0), Nazgul/Fledermäuse knapp.
- 17.10. (L): Schleifen 4–10. Forschung im Bot neu (Kasse nur für Forschung, Kopfgeld nur bei 3-facher Rückzahlung), Zwischenstände je Tag (`ck-*.json`, `WEITER=1`), `nacht.sh` (startet nach Abbruch neu), `nacht.bat` (Windows). Ins Spiel übernommen: Element-Kraft, Upgrade-Stufen, Leben je Block (17b, d, f), Stein-Kraft je Turm `kraftT` (17e, g), Stein Katapult = Turm 3 (17c), Faktoren Runde 2–10 nach Regel (17c).
- **Stand nach Schleife 10 (Spiel 17g):** Elemente innerhalb ±7 %, Kurve ab Runde 6 ca. 10–15 % unter dem Bogen (im Band), Runde 1–5 ca. +10 %. Stein gegen Fliegende ca. 45 % der anderen (Grenze 25 %); einzelne Fliegertage für den Bot schwach (Spatzen ~0,6), mit früh gebauten Katapulten schaffbar. Weitere Schleifen pendeln nur noch; nächster Schritt sind Testspiele, nicht mehr Schleifen.
- 17.10. abends (L): `schleife.js` und `bericht.js` zeigen jetzt das **Stärkenband je Block** und **Kraft je Gold je Turmstufe** (nur Anzeige, kein Automatismus). Befund P8a (Spiel 17i): Stein Turm 5–8 je Gold 1,17–1,33 gegenüber Katapult 1,43 / Felsbrocken 1,50 (relativ zu Turm 1 = 1) – teure Stein-Türme lohnen sich zu wenig; Feuer Turm 2–6 unter dem Funken (8 Gold, 1,25). Stärkenband je Block braucht einen neuen P2-Lauf (Ergebnisse liegen nicht im Repo).
- 18.10. 00:30 (L), P2-Lauf mit Spiel 17j: Kurve passt (R/Ziel je Block 1,00–1,11). Elemente gesamt Feuer 0,90 · Eis 0,94 · Schatten 1,02 · Stein 1,16. **Stärkenband je Block verletzt:** Stein Runde 11–25 und 31–35 ca. +30–36 %, Feuer Runde 11–20 ca. −30 %, Eis Runde 21–25 −27 %. Stein an Fliegertagen 97 % der anderen (alte Grenze 25 % längst erfüllt). Nächster Schritt: `kraftT` je Element so setzen, dass Band und P8a gleichzeitig halten (bei Stein eher Katapult/Felsbrocken senken als Turm 5–8 heben). Noch nichts geändert.
- 18.10. nachts (L, Claude allein): **Lauf A** mit Kraft je Turm Feuer [1; 1,15 ×7] und Stein [0,4; 1; 1,1; 1,15 ×5] (P8a bis auf den 8-Gold-Funken erfüllt). Ergebnis: Stein Runde 11–25 besser (1,18–1,25 statt 1,34), aber Runde 36–40 0,66 statt 0,85; Feuer Runde 11–20 kaum besser (0,71/0,75), dafür Runde 26–40 1,5 zu stark. Mittlere Abweichung vom Band 16,0 % statt 15,3 % → **verworfen, nichts ins Spiel.**
- **Befund dazu:** Der Bot baut das ganze Spiel fast nur Turm 1–4 und rüstet sie auf (Eis vereinzelt Turm 5/6; Freischaltung Turm 7–8 nie gekauft). Dieselben Türme tragen also alle Blöcke, deshalb lässt sich das Band je Block über `kraftT` kaum formen: Wer einen Turm stärkt, verschiebt alle Blöcke ab seinem Einsatz. Das bestätigt auch F's/L's Sorge: Neue Türme lohnen sich gegenüber Upgrades zu wenig. Mögliche Hebel (noch nicht beschlossen): Upgrade-Faktoren je Element (`upDmg`, z. B. Feuer später Stufen stärker), Upgrades ab Stufe 4 flacher, damit höhere Türme sich lohnen, Freischaltkosten 250/700 prüfen.
- 18.10. vormittags (L): Faktoren je Monster geprüft – Regel überall erfüllt außer Block 7 (Lehrer gemischt → Stein ohne Malus, Schatten ohne Bonus); Wargreiter auf Schatten 1,5 / Stein 0,75 getauscht (im Spiel, 18d). Stein-Fläche getestet (Runde 1–20, Kraft je Turm zurück auf 1): Randwert regelt nur das **Niveau** von Stein, nicht die Form (Runde 1–5 zu stark, 6–10 zu schwach bleibt bei jedem Randwert, Spreizung ×1,7–2,1). Bester Kompromiss im Spiegel: Mitte 1,0, Rand 0,5, Kiesel 0,7, Kraft 2,01 (Spreizung ×1,72 statt ×1,82). Kiesel ganz auf 1 geht nur, wenn Stein in Runde 1–5 anders gebremst wird. Ins Spiel erst nach Absprache mit F.
- 18.10. (L): P9 erster Lauf: Feuer Glutnest (Glutbecken) +200–370 % R, weit vor allen anderen (Abstand ×2,4); Eis Frosthauch-Effekt +68 % (×1,5); Schatten und Stein im Ziel, Stein-Steine aber insgesamt schwach (+7 %). Ohne Wirkung u. a. Weite Flamme, Tiefschnee, Belagerung, Steilschuss (an den Stichtagen).
- 18.10. (L): P10 aus P2 (Spiel 17j): Freischaltung Türme 5–6 in 1 von 8 Läufen (Tag 40), Türme 7–8 nie; Kopfgeld 1–3 immer (Tag 8/14/20); Element-Schaden immer früh (Tag 4–17).
- 18.10. abends (F): **Zwei Testspiele Feuer gegen Stein, 2 Spieler** (Archiv, Version 17j und 18f). Spiel 1 (Tag 13, verloren): eigene Welle Kills Feuer 43, Stein 138; Spiel 2 (Plätze getauscht, Tag 24, verloren): Feuer 23, Stein 271. Gold erklärt es nicht: In Spiel 2 hatte Feuer 1836 verfügbar (591 Kopfgeld + 1215 Geschenk), Stein 1583; ausgegeben 1650 gegen 1399. Eigene Kills je ausgegebenem Gold Feuer 0,014, Stein 0,19. Reihenfolge spielt keine Rolle (Ring: jeder bekommt die Durchbrüche des anderen). Stein ist ab Tag 3 stark (20/13/20 gegen 2/1/1), schwach nur an Flieger-Tagen (Tag 10, 13, 23), dort aber Feuer ebenso. Einschränkung: beide Male derselbe Spieler auf Feuer, 3 Brandpfeile (nur Fliegende) und 2 Funken auf Stufe 4 gebaut. Widerspruch zum Bot (Feuer ×2,05): Der Bot setzt den Flammenwerfer (Reichweite 1,5) optimal, Menschen nicht. Offen: Feuer für Menschen stärken (Reichweite/Kraft) oder Stein dämpfen? Sauberer Test: Feuer mit Glutbecken/Flammenwerfer direkt am Weg, keine Funken hochziehen. Geschenk-Zeitpunkte stehen seit 18f im Archiv (`giftLog`).
- 18.10. abends (L): **Optimierer, Durchgang 1** (1 Map, 5 Schritte, ca. 6 h): Gesamtfehler 3,00 → 2,29, Stand in `spiegel.json` (nicht im Spiel). Gewirkt hat vor allem P8a (Upgrades flacher: Zuwachs je Gold Stufe 2–6 jetzt ca. 1,0/1,0/0,95/0,85/0,74 statt 0,93/1,20/1,30/1,32/1,29). **Nicht übernehmen:** P8 (Turm 5–8 ab Runde 21 nur 1–7 % statt 35 %) hat den Gesamtfehler beherrscht; der letzte Schritt wurde angenommen, obwohl P6 schlechter wurde (Feuer 0,83, Eis 1,15). P8 zählt deshalb nur noch ×0,25, der Verlauf speichert jeden vollständigen Zwischenstand. P8 bewegt sich mit Kraft je Turm +10 % und Freischaltung 210/600 nicht – der Bot plant nur den heutigen Tag und baut Freischaltungen praktisch nie; ob das am Spiel oder am Bot liegt, ist offen.
- **Beschluss 18.10. abends (L + F):** F macht Mikrobalancing (Einzelwünsche direkt im Spiel), L Makrobalancing im Spiegel. Zusammengeführt wird erst, wenn alle Prüfpunkte erfüllt sind und das Spielgefühl passt. Vor dem Zusammenführen: F's Änderungen seit 18.10. in den Spiegel übernehmen (der Spiegel überschreibt nur die Werte, die er enthält).
- **Makrobalancing: nächste Schritte (Stand 18.10. 23 Uhr):**
  1. Runde 11–15: Bot und F's Testspiele stimmen überein (Feuer ≈ 0,65, Stein ≈ +30 %). Runde 1–10 widersprechen sich (Bot: Stein ausgeglichen, Feuer in R6–10 vorn; F: Stein ab Tag 3 dominant) → F's „sauberen Test“ abwarten (Feuer an Kreuzung/Kurven, hochgezogen, keine Brandpfeile außer für Flieger), dann P13 (Eichung Bot ↔ Mensch).
  2. Feuer-Strategie: Brand stapelt sich nicht (stärkerer gewinnt) → Feuer = wenige Türme hochziehen, Stein = Masse. Der Bot baut genau so. Hinweis im Baumenü erwägen.
  3. Kills „leaken“: Brennende Monster sterben oft beim Nachbarn (Kill und Kopfgeld gehen an ihn). L: eigene Kills machen mehr Spaß → Idee: Brennen etwas schwächer, Direktschaden höher (`IDEEN.md`). Vorher im Bot messen, wie viel Feuer-Schaden beim Nachbarn als Kill landet.
  4. Optimierer Durchgang 2 erst nach Entscheidung zu P8 (Turm 5–8 werden auch mit flacheren Upgrades kaum gebaut; Bot plant nur heute → ggf. Bot erweitern: Vorausschau, Freischaltung als Investition).
- **Plan 19.10. (L):** (1) Abstandsskript ✔. (2) P2-Basislauf auf 19a mit Spiegel als Referenz vor der Bot-Änderung. (3) Bot: Vorausschau und Freischaltung als Investition (P8). (4) P13: L testet selbst (Spiel 19a), Bot-Vergleich auf derselben Version. (5) Danach Optimierer-Durchgang 2, P9 inkl. Uniques aus 18c. Getrennte Wege bleiben (kein Einfrieren von Block 1); P6B (Block ±10 %) und F's Ringregel (Spreizung je Tag) vertragen sich, solange jedes Element je Block einen Malus- und einen Bonus-Tag hat.
- 19.10. (L): **P2-Basislauf Spiel 19a + Spiegel** (Referenz vor der Bot-Änderung). Elemente gesamt Feuer 1,09 · Eis 0,99 · Schatten 1,01 · Stein 0,92 (P6 ±5 % knapp verfehlt). Kurve je Block ab Runde 6 ×0,71–0,92, also für den Bot **zu schwer** (18.10. ohne F's Block-1-Änderungen: 1,00–1,11). Stärkenband: 17 von 32 Zellen außerhalb ±10 %, am stärksten Runde 1–5 (Feuer 1,30, Stein 0,65), 11–15 Feuer 0,65, 26–30 Feuer 1,45. Tage mit R < 1 (Bot schafft es nicht) u. a. Nacktschnecken Stein 0,41, Spatzen Stein 0,39, Habichte Stein 0,53, Lehrer Feuer 0,28, Nazgul alle Elemente, Betty Eis/Stein 0,6. Achtung Wechselwirkung: Spiegel hat Stein-Fläche 1,0/0,5 statt 1,2/0,8 im Spiel. Vergleichslauf ohne Spiegel folgt.
- Bekannte Bot-Schwäche: plant nur den heutigen Tag und baut höchstens 2 billige Türme um → unterschätzt Elemente, die vorausplanen müssen (Stein vor Fliegertagen).
- Offen: P9 (Edelstein-Uniques gegen Basics), P8 (Türme 4–8 einzeln), P13 (Eichung mit echten Spielen aus dem Archiv).
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

- 18.10. nachts (F): **Ringregel als Ganzes.** Ziel pro Tag: ein Element effektiv (Bedarf ÷ verfügbar etwa 1,0), eines ineffektiv (höchstens etwa 2), zwei neutral (etwa 1,5). Das Skript soll die Faktoren nicht mehr nur als Bonus/Malus/Rest 1 prüfen, sondern diese Bedarfs-Rollen. Messwerte Block 1 (2026-10-18j): T1 1,41/1,33/1,17/1,59; T2 2,09/0,98/1,40/0,89; T3 1,56/1,07/1,50/2,23; T4 1,55/1,90/1,28/1,55; T5 1,08/1,44/2,13/1,46; T6 1,80/1,62/1,98/1,78 (Feuer/Eis/Schatten/Stein). Der Bot kauft in Stufen: Bedarf springt (z. B. Eis Tag 4 2,40 oder 1,90, nichts dazwischen), feine Zielwerte sind nicht erreichbar.
