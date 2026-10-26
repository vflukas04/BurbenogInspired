# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->
### 26.10. 14:45 · F · 2026-10-26l – Kreativ-Modus: alle 48 Tage wählbar
`KREATIV_MAXTAG` von 24 auf 48 (Friedrich will auch Tag 25+ sehen). Hinweis: Wer die Überraschung Runde 21–40 behalten will, setzt die Konstante wieder auf 24.

### 26.10. 14:30 · F · 2026-10-26k – Kreativ-Modus, Fix der Turm-Symbole
Neues Spiel → Spielart „Kreativ“ öffnet `?kreativ=1`: nur dieses Gerät, kein Firebase, eigene Speicher-Schlüssel (`ww2k-…`), echtes Spiel bleibt unberührt. Alle Türme und Stufen gratis (`KREATIV` in `buildCost`/`upgradeCost`/`goldOf`), vier Felder (Feuer, Eis, Schatten, Stein), Welle über Auswahl Tag 1–24 (`KREATIV_MAXTAG`, Tag 25+ bleibt Überraschung), Auslösen wiederholt dieselbe Welle, kein Gold. Fix: 26j hatte durch einen Kommentar mitten in `loadImg` alle Turm-Bilder abgeschaltet; Symbole in der Leiste zeigten nur das Grundbild ohne Teile.

### 26.10. 13:55 · F · 2026-10-26j – Turm-Bilder laden robuster (iPhone)
Fehlende Symbole auf dem iPhone gemeldet. Bilder, die nicht laden, werden bis zu 3-mal neu versucht; ein endgültig fehlendes Teilbild blockiert den Turm nicht mehr. Ursache am Handy noch nicht bestätigt (am Laptop nicht nachstellbar).

### 26.10. 13:30 · F · 2026-10-26i – Türme mit beweglichen Teilen (Schräg-Ansicht)
Alle 32 Türme sind in Grundbild + Teilbilder zerlegt (`assets/turm/<element>-<nr>p<id>.png`, 79 Dateien). `PARTS` in index.html: Drehpunkt + Bewegung je Teil (Leerlauf-Wackeln, beim Schuss Ausschlag): z. B. Katapult-Arm schwingt, Bergkönig hebt beide Arme, Granitwächter stößt mit dem Speer, Seelenfresser klappt das Maul, Sonne dreht sich, Schleuder-Stein fliegt weg. Nur Anzeige. Neu laden.

### 26.10. 13:00 · F · 2026-10-26h – Angriffe der Türme passend zu den Bildern (Schräg-Ansicht)
Geschosse je Turm eigene Optik (`shot25`: Funke, Feuerball, Flammenstrahl, Eissplitter, Schneeflocke, Speer, Seelen-Orb, Runenstein, Felsbrocken, Onyx-Splitter u. a.), Türme reagieren beim Schuss (`drawTower25`): Rückstoß, Speerstoß beim Granitwächter, Aufstampfen beim Bergkönig, Kippen beim Katapult, Flamme beim Flammenwerfer, Lavafunken beim Lavaturm, Irrlicht schwebt. Nur Anzeige, nur Schräg-Ansicht.

### 26.10. 12:30 · F · 2026-10-26g – Richtige Bäume, Bauleiste für alle Elemente
Wald: Tannen mit Stamm, Sumpf: Trauerweiden (`drawTree`, beide Ansichten) statt runder Kronen, die wie Büsche aussahen. Turm-Bilder werden beim Start vorgeladen, damit die Bauleiste bei jedem Element (nicht nur Feuer) die neuen Symbole zeigt.

### 26.10. 12:00 · F · 2026-10-26f – Bauleiste mit den neuen Turm-Bildern
In der Schräg-Ansicht zeigen Bauleiste und Dialoge (`towerIcon`) das zugeschnittene Turm-Bild statt des alten Kenney-Symbols (Symbolgröße 30 px). Das Felsen-Zeichen auf Türmen ist jetzt ein Felsbrocken statt eines Bergs. Draufsicht behält die alten Symbole.

### 26.10. 11:30 · F · 2026-10-26e – Biome: Sumpf mit Bäumen, Felsen als große Felsbrocken
Sumpf: statt kleiner Büsche dunkelgrüne Sumpfbäume (in der Schräg-Ansicht aufrecht, nach Tiefe sortiert). Felsen: statt Berg mit Schneekappe zwei große Felsbrocken (`drawMountain`, beide Ansichten). Regeln und Gold unverändert (Felsen +30, Reichweite +15 %).

### 26.10. 11:00 · F · 2026-10-26d – Türme aller Elemente als freie Bilder, vier Umbenennungen
Schräg-Ansicht: alle 32 Türme als freistehende Bilder (`assets/turm/<element>-<nr>.png`, `towerImg`, `TOWER_H`). Quelle/Entwürfe: `tools/turm/tuerme.html`, Bilder neu erzeugen mit `node tools/turm/bilder.js tools/turm/tuerme.html` (aus dem Repo-Wurzelordner, Playwright nötig). **Umbenannt (nur Anzeige, Zahlen unverändert):** Glutbecken → Glumanda, Schwelbrand → Feuerteufel, Frosthauch → Schneekönig, Felsbrocken → Onyx. `spiegel.html` und die Balancing-Skripte (`basis/`) behalten die alten Namen. Draufsicht unverändert.

### 26.10. 10:20 · F · 2026-10-26c – Schatten-Türme als freie Bilder (Schräg-Ansicht)
In der Schräg-Ansicht stehen die 8 Schatten-Türme ohne Sockel als Bilder (`assets/turm/schatten-1..8.png`, `towerImg`, `drawTower25`); Zahl, Edelstein und Stufen liegen flach auf dem Feld. Entwürfe für Feuer/Eis/Stein sind noch in Überarbeitung (F), bis dahin Block-Türme. Draufsicht unverändert. Nur Anzeige.

### 26.10. 10:00 · F · 2026-10-26b – Schräg-Ansicht (2,5D) für die Maps
Menü ⋯ → „Ansicht“: Draufsicht oder Schräg. Boden um 0,68 gestaucht (Reichweiten, Explosionen, Licht werden Ellipsen), Türme als Blöcke mit Schatten, Bäume/Berge/Monster stehen aufrecht und werden nach Tiefe sortiert. Nur Anzeige (`view25`, `CUR`, `gyOf`, `drawTower25`), Simulation unberührt; Standard bleibt Draufsicht. Tippen: aufragende Türme zählen zum Feld davor.


### 26.10. 08:40 · L · 2026-10-26a – Irrlicht wirkt auf die Monster im Lichtkreis
- So war es gedacht (L): Schatten-Türme machen gegen Monster, die gerade in einem Lichtkreis sind, mehr Schaden (×buff) und ignorieren dort Rüstung (pierce) – egal, wo der Turm steht. Vorher galt die Verstärkung nur für Schatten-Türme, die im Kreis standen. Nachtsicht unverändert.
- Umsetzung in `tools/balance/basis/irrlicht.js` (dieselbe Änderung gilt im Spiegel über `basis/patch.js`); `amps` jetzt am Sim-Objekt, Wirkung in `hit` (`litP`). Leuchtfeuer (allBuff) analog für andere Elemente.
- Geprüft: Syntax, `fxText` aller Türme, Testaufbau 2 Schemen S3 + Irrlicht S3: ×1,47 Schaden.
- Neues Spiel + neu laden. F: Falls es dein Mikro-Balancing stört, gern zurückdrehen – bitte kurz in TODO melden.

### 24.10. 23:15 · F · 2026-10-24d – Boss-Tage laufen wie Live
- Zwischenboss-Tage (6, 12, 18, …): Ein durchgebrochener Boss erscheint sofort beim nächsten Spieler (`bossLive`), der 19-Uhr-Slot entfällt. Grund: Zwischenbosse geben kein Kopfgeld, in der Pause gibt es also nichts zu bauen.
- Geprüft: Syntax und ein Lauf mit absichtlich schwachen Türmen (Boss geht über beide Maps, danach Tag 7). Nicht geprüft: Nachtaktive Bosse (Maus-/Fuchs-Boss) werden nicht mehr bei Dunkelheit gespielt, Schatten braucht dort keinen Irrlicht-Kreis mehr.
- Neues Spiel + neu laden. Regeländerung, Absprache mit L läuft privat.

### 24.10. 19:35 · F · 2026-10-24c – Feuer-Rollen schärfer, Stein-Malus tiefer (Nachbau aller Paare)
- Nachbau mit dem Bauverhalten aus dem Eis-Stein-Spiel (6 Paare, beide Rollen, 12 Wetterfolgen, Tag 1–12, mit Edelsteinen): Feuer neutral 11 / ineffektiv 10 Kills (Ziel 5–8 / 1–3), Stein ineffektiv 6,5.
- Feuer `kraftBlock` 1,466/1,25 → 1,30/1,15. `weak` Feuer: Kellerasseln 0,7 → 0,55, Katzen 0,75 → 0,55, Mäuse 1,2 → 1,65, Ratten 1,5 → 1,75. Stein: Nacktschnecken 0,6 → 0,45, Ratten 0,55 → 0,4.
- Erwartet: Feuer eff ~10 / neutral ~7,6 / ineffektiv ~3; Stein ineffektiv ~3,6. Eis und Schatten unverändert.
- Neues Spiel + neu laden. Block 1 betroffen, Absprache mit L läuft privat.

### 24.10. 18:10 · F · 2026-10-24b – Katzen: Anzeige wieder „Schatten neutral“
- Mit Schatten 1,3 (24a) hätte die Anzeige am Tag 9 zwei effektive Elemente gezeigt (Eis und Schatten). `eff:[-1, 1, 0, 0]` legt die Rollen fest, an den Werten ändert sich nichts.
