# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->
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

### 24.10. 13:40 · F · 2026-10-24a – Feuer-Wetter enger, Katzen für Schatten
- Nachbau mit den echten Feuer-Türmen (5 Spieler, Tag 8): Sonnig/Hitze 13, Regen/Gewitter 4 Kills. Sonnig 1,075/1,075, Hitze 1,15/1,1, Regen und Gewitter Schaden 0,95, Dauer 0,8, Brennen erlischt 1,5 bzw. 1,35. Abstand Tag 8: 9,8 → 7,0; gewichtetes Mittel unverändert (~8,4).
- Katzen (Tag 9, nachtaktiv): Schatten-Faktor 1,0 → 1,3, weil Schatten nachts nur im Lichtkreis trifft (beide Feuer+Schatten-Läufe kippten dort).
- Neues Spiel + neu laden.

### 24.10. 11:20 · F · 2026-10-23d – Block 2 (Tag 7–12) nach fünf Testspielen
- Fünf Testspiele auf 23c (Schatten+Eis, Feuer+Stein, Eis+Feuer ×2, Stein+Schatten). Der Nachbau mit den echten Türmen trifft die echten Kills; danach Werte aus dem Mittel über Wetter und Spiele.
- `kraftBlock[1]` (Block 2): Feuer 1 → 1,25 (fiel beim Blockwechsel um ein Drittel ab, Tag 8 nur 2 statt 12–18), Eis 1 → 1,2, Schatten 1 → 0,65 (mit Irrlicht 17–18 Kills an neutralen Tagen, Ziel 5–8). Katzen (Tag 9) Eis 1,75 → 1,4; Ratten (Tag 8) Stein 0,75 → 0,55.
- Flieger-Tag 10 (Spatzen) entschied drei Spiele: Feuer/Eis ohne Luftabwehr (Brandpfeil/Eiszapfen) bekommen bis 35 Durchbrüche an einem Tag. Zahlen nicht angefasst, Vorschlag zur Warnung im TODO. Neues Spiel + neu laden.

### 23.10. 12:45 · F · 2026-10-23c – Block 2: Tag 7 leichter, Stein-Faktor Block 2
- Testspiel 22a: Tag 7 (Kleine Hunde, alle neutral) nur 1 und 2 von 20 Kills. Hunde `hpMul` 1 → 0,85 (Nachbau mit den echten Türmen: Schatten/Eis etwa 5–8 über Wetter 0/1/2). Tag 8–11 im Testspiel im Rahmen, nicht angefasst.
- Stein `kraftBlock[1]` 1 → 0,6: Der Bot (Kiesel 1,58) machte in Block 2 an jedem Tag 12–15 Kills, auch am Malus-Tag 8. Mit 0,6: Tag 8 etwa 2–4, Tag 11 (Bonus) etwa 10–11, Tag 7 5–11. Tag 9 (Katzen) bleibt für Stein bei 1 (zu schwer, Katzen Tempo 1,6), offen.
- Bot ist nur Tendenz (Stein im Spiel noch nicht gegengeprüft). Neues Spiel + neu laden.

### 23.10. 11:05 · F · 2026-10-23b – Laufbilder folgen der Schrittphase, Werkzeug `tools/lauf.py`
- Laufbilder (`MONSTER_ANIM`) laufen jetzt nach Strecke statt nach Uhr (steht ein Monster, steht das Bild). Betty läuft dadurch in ihrem eigenen Tempo.
- Neu `tools/lauf.py`: baut aus Video/Einzelbildern die Dateien `<name>-lauf-N.png` (freigestellt, 192 px, 128 Farben, gleicher Ausschnitt). Mit einem künstlichen Test geprüft, noch kein echtes Monster. Ablauf und Prompt in `GRAFIK.md`. Die Bilder selbst muss L oder F in Krea erzeugen (ich kann hier keine erzeugen). Neu laden reicht.

### 23.10. 10:50 · F · 2026-10-23a – Monster gehen im Schritt (nur Anzeige)
- Das Wippen hängt jetzt an der zurückgelegten Strecke statt an der Uhr: Schnecken trippeln langsam, Hunde schnell, ein stehendes Monster steht still. Dazu Aufsetzen (kleiner Hüpfer) und leichtes Kippen. Keine Regel- und keine Balance-Änderung.
- Echte Beinbewegung bräuchte Laufbilder wie bei Betty (`MONSTER_ANIM`). Mit L abgestimmt: erst mit wenigen Monstern mit sichtbaren Beinen (Hunde, Ratten, Katzen, Füchse) testen, 4 Bilder, nur Seitenansicht. Neu laden reicht.

### 22.10. 23:50 · F · 2026-10-22b – Schatten Tag 3 und 5 an echtes Spiel angepasst
- Auswertung Testspiel 22a (Schatten + Eis): Die Simulation bildet das Spiel mit den echten Türmen exakt nach. Schatten machte an Tag 3 (neutral) 20 statt 5–8 und an Tag 5 (Malus) 8 statt 1–3; der Bot unterschätzt hier die Platzierung der Spieler.
- Nacktschnecken Schatten-Faktor 1,2 → 0,9, Mäuse Schatten 0,7 → 0,55 (Nachbau: Tag 3 etwa 10/7/8, Tag 5 etwa 3 Kills über Wetter 0/1/2). Tag 4 unverändert (20/20 ist die Obergrenze).
- Schatten-Spieler hatte Irrlicht und Nachtaktivität vergessen: Tag 5/6 um 19 Uhr 15 Durchbrüche, nicht zu werten. Auch ohne das wäre das Spiel in Block 2 verloren (Tag 7: 1–2 Kills) – mit L besprechen. Neues Spiel + neu laden.

### 22.10. 00:15 · L · 2026-10-22a – Eigene Bilder für zwei Varianten
- Zwei Monster-Varianten haben eigene Bilder statt eines gemeinsamen (eine Rückansicht fehlt noch, dort Seitenansicht). Neu laden reicht.

