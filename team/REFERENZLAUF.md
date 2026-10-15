# Referenzlauf: Feuer + Schatten, 2 Spieler (15.10.2026, Version 15k/15l)

Erster Sieg (Tag 23, 11 von 30 Durchbrüchen). Dient als Maßstab für spätere Läufe. Ein Computerspieler (Simulator-Greedy mit Schenken) war schlechter (18 Durchbrüche, Schatten hungert), deshalb gilt dieser Lauf als Referenz und nicht ein berechnetes Optimum.

**Maßstab für neue Läufe:** (1) ganze Durchbrüche (hier 11, alle in Tag 1–8), (2) Treffer in der eigenen 10-Uhr-Welle an normalen Tagen (ohne Boss-Tage 6/12/18/23), Tag 9–23: Feuer 180/240 = 75 %, Schatten 188/240 = 78 %.

## Treffer in der eigenen 10-Uhr-Welle (von 20), Tag 9–23
| Tag | Monster | Feuer | Schatten |
|---|---|---|---|
| 9 | Katzen | 2 | 9 |
| 10 | Spatzen | 12 | 20 |
| 11 | Füchse | 5 | 17 |
| 13 | Habichte | 20 | 12 |
| 14 | Dachse | 20 | 5 |
| 15 | Oktopusse | 4 | 20 |
| 16 | Wildschweine | 20 | 20 |
| 17 | Schäferhunde | 20 | 15 |
| 19 | Besoffene Penner | 20 | 17 |
| 20 | Wütende Partnerin | 20 | 20 |
| 21 | Wütende Nachbarn | 17 | 20 |
| 22 | Uffug-Vorhaut | 20 | 13 |
Bosse: Tag 12 beide, Tag 18 nur Schatten, Tag 23 beide (am Partner, 19 Uhr). Der Partner fing in Tag 9–23 jeden Leak auf.

## Endaufbau (Stufe, Ort x,y; investiertes Gold)
Feuer (1203 Gold, Forschung t5:1): Funke S6 5,6 (162, Edelstein Fähigkeit 7) · Funke S2 9,1 (20) · Schemen S6 4,9 (187, durch Stein umgewandelt) · Funke S6 12,9 (162) · Funke S3 9,13 (38) · Flammenwerfer S3 11,6 (314, Edelstein Fähigkeit 6) · Brandpfeil S1 5,8 (120) · Schwelbrand S1 5,4 (200)
Schatten (1617 Gold, Forschung cheap:1): Schemen S6 4,8 (204) · Schemen S2 10,12 (25) · Schemen S6 6,4 (209, Edelstein) · Irrlicht S3 5,6 (135) · Nachtauge S3 7,4 (314, Edelstein) · Irrlicht S2 8,3 (72) · Fluchstein S1 6,5 (120) · Fluchstein S3 7,3 (538, Edelstein)

## Einzelfeld-Schätzung (Simulator, gleiches Gold, nur eigenes Feld, Tag 14/17/19)
Anteil der erreichbaren Stärke: Feuer ca. 63 % (53 % ohne Edelsteine), Schatten ca. 83 % (77 %). Pfadabdeckung der Türme: Feuer ca. 70 %, Schatten ca. 79 % der besten Lage. Auffällig: viele Upgrades auf Stufe 6 statt billige Türme nah am Weg. Grobe Schätzung, Zeitpunkte der Käufe nicht messbar.

---

# Lauf 2: Schatten + Feuer, 2 Spieler (15.10.2026 22:27, Version 15m) – Sieg mit 2 Durchbrüchen

Ausgelesen aus Firestore kurz vor dem Überschreiben durch das nächste Spiel (Tag 1–8 im Log waren schon weggekürzt, Log hält nur ca. 60 Einträge). Beide Durchbrüche fielen vor Tag 9. Gold verdient: 1723 / 1731. Kills 371 / 395. Spieler 1 Schatten, Spieler 2 Feuer, Testmodus.

## Treffer in der eigenen 10-Uhr-Welle (von 20), Tag 9–22
| Tag | Monster | Schatten (S1) | Feuer (S2) |
|---|---|---|---|
| 9 | Katzen | 7 | 5 |
| 10 | Spatzen | 19 | 13 |
| 11 | Füchse | 11 | 20 |
| 13 | Habichte | 10 | 20 |
| 14 | Dachse | 6 | 20 |
| 15 | Oktopusse | 20 | 3 |
| 16 | Wildschweine | 20 | 17 |
| 17 | Schäferhunde | 15 | 20 |
| 19 | Besoffene Penner | 14 | 9 |
| 20 | Wütende Partnerin | 20 | 15 |
| 21 | Wütende Nachbarn | 20 | 20 |
| 22 | Uffug-Vorhaut | 20 | 20 |
Summe 182/240 = 76 % bei beiden (Lauf 1: 75 % / 78 %). Alle 116 durchgelassenen Monster fing der Partner um 19:00 ab (0 Durchbrüche in Tag 9–23). Bosse: Tag 12 beide selbst besiegt; Tag 18 und 23 kam der Feuer-Boss durch und Schatten besiegte ihn (Schatten besiegte 5 von 6 Bossen).

## Endaufbau (Stufe, Ort x,y; investiertes Gold; Forschung beider: cheap:1, el2:1, el2:2, el0:1, el0:2, gold:1, t5:1)
Schatten (1374 Gold, Pfadabdeckung 75 %): Schemen S6 6,10 (200, Edelstein Fähigkeit 0) · Funke S6 7,10 (200, per Stein umgewandelt) · Irrlicht S5 5,10 (373) · Nachtauge S3 8,9 (314, Edelstein Fähigkeit 6) · Fluchstein S2 6,11 (287, Edelstein Fähigkeit 7).
Feuer (1557 Gold, Pfadabdeckung 98 %): Funke S4 6,3 (62) · Schemen S6 8,4 (162, umgewandelt) · Funke S6 8,11 (156) · Funke S5 7,8 (100) · Glutbecken S4 6,6 (343, Fähigkeit 2) · Flammenwerfer S4 7,5 (534, Fähigkeit 6) · Schwelbrand S1 8,6 (200).
Auffällig: 4 von 12 Türmen sind Turm 1 auf Stufe 6; Turm 5 (Schwelbrand) nur Stufe 1 trotz 250 Gold Freischaltung; beide Felder haben je einen Turm des anderen Elements (Umwandlung).

---

# Lauf 3: Eis + Stein, 2 Spieler (15.10.2026 22:27–23:04, Version 15o) – Sieg mit 29 von 30 Durchbrüchen

Spieler 1 Eis, Spieler 2 Stein. Gespielt mit Version 15o (noch mit „Stein bremst“ brk:1+2, ohne Akademie-Fix). Log hält nur Tag 9–23; die 29 Durchbrüche passen genau zu Tag 10 (20) und Tag 13 (9), in Tag 1–9 und allen anderen Tagen gab es keine. Gold verdient 1639 / 1552, Kills 378 / 361. Forschung: Eis +25 %, Stein +25 %, Effekte länger 1, Upgrades billiger 1, Stein bremst 2 (keine Türme 5–8).

## Treffer in der eigenen 10-Uhr-Welle (von 20) und Durchbrüche um 19:00
| Tag | Monster | Eis | Stein | ganz durch (19:00) |
|---|---|---|---|---|
| 9 | Katzen | 16 | 19 | 0 |
| 10 | Spatzen (fliegen) | 4 | 1 | **20** |
| 11 | Füchse | 2 | 16 | 0 |
| 13 | Habichte (fliegen) | 10 | 0 | **9** |
| 14 | Dachse | 18 | 20 | 0 |
| 15 | Oktopusse | 20 | 20 | 0 |
| 16 | Wildschweine | 2 | 5 | 0 |
| 17 | Schäferhunde | 20 | 13 | 0 |
| 19–21 | Penner, Partnerin, Nachbarn | 20 | 20 | 0 |
| 22 | Uffug-Vorhaut (fliegt) | 20 | 16 | 0 |
Summe Eis 172/240 = 72 %, Stein 170/240 = 71 %. Bosse (Tag 12, 18, 23) alle besiegt, Tag 12 kam der Stein-Boss durch und Eis fing ihn ab. Bei einem Ausfall beider Felder am selben Tag (Tag 10, 13) fängt die zweite Linie nicht mehr ab: sie sieht 16–20 Monster bei gleicher Stärke.

## Endaufbau (Stufe, Ort x,y; investiert)
Eis (1567 Gold): Frostsplitter S6 6,11 (200, Fähigkeit 2) · Frostsplitter S6 7,11 (200, Fähigkeit 1) · Schneeball S5 7,9 (560, Fähigkeit 0) · Turm 4 S2 5,9 (287, Fähigkeit 7) · Eiszapfen S1 8,10 und 8,11 (je 70) · Schneeball S1 4,6 / 5,6 / 4,10 / 2,9 (je 45).
Stein (ca. 1278 Gold): Kiesel S6 6,4 (204) · Frostsplitter S6 7,4 (195, per Stein zu Eis umgewandelt, Fähigkeit 2) · Schleuder S4 8,8 (348) · Turm 4 S2 7,8 (287) · Kiesel S4 8,6 (76) · Felsbrocken S2 6,6 (168).
Mit diesem Endaufbau schaffen beide Felder in der Simulation fast alle Tage mit 20/20 (außer Stein Tag 22: 13). Die Ausfälle in Tag 10–16 kamen also vom Goldstand zu dem Zeitpunkt, nicht von der Turmwahl.
