# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->
### 26.10. 18:45 · F · 2026-10-26v – Eisdrache gefährlicher
Dunklere Farben, wütender Blick mit leuchtend blauem Auge, Reißzähne, lange Hörner, Krallen, Stacheln, eckige Flügel mit Knochenfingern. Mündungspunkt für den Eisatem angepasst. Nur Anzeige.

### 26.10. 18:30 · F · 2026-10-26u – Eis: Speerwurf, dicker Eisspeer, Schneewolke, Eisdrache
Schneekönig wirft seinen Eisspeer (dreht sich zum Ziel, Speer-Teilbild neu, Geschoss mit Frostschweif). Eisspeer-Geschoss deutlich dicker. Blizzard: Schneewolke über dem Ziel (`drawSnowCloud`), aus der es auf die Monster schneit. Ewiges Eis heißt jetzt **Eisdrache** (nur Anzeige, `spiegel.html` behält den alten Namen): neu gezeichneter Drache auf Eisscholle, Kopf und Flügel als Teilbilder, Eisatem wie beim Flammenwerfer (`drawFlame(..., ice)`, `JETS['1:…']`). `TOWER_H` eis[3] = 62, eis[7] = 60. Nur Anzeige.

### 26.10. 18:10 · F · 2026-10-26t – Höllenfeuer schießt brennende Kometen
Geschoss (`shot25`, Feuer Nr. 8): Komet mit glühendem Kern und langem, welligem Flammenschweif, der der Flugbahn (Bogen) folgt; startet an der Turmspitze (`drawShot`, `ang25`). Beim Schuss steigen Glut und Funken vom Turm auf. Nur Anzeige.

### 26.10. 17:55 · F · 2026-10-26s – Lavaturm: Turm im Lavasee mit Lava-Zinnen
Lavaturm neu gezeichnet: dunkler Steinturm mitten in einem Lavasee, oben Zinnen aus glühender Lava, nur zwei kurze Rinnsale. Teilbilder: Zinnen (pulsieren), Funken (steigen beim Schuss). `TOWER_H` feuer[5] = 69,5. Nur Anzeige.

### 26.10. 17:40 · F · 2026-10-26r – Feuerteufel wirft brennenden Dreizack
Der Feuerteufel dreht sich zum Ziel (Dreizack-Seite zeigt zum Monster), der Dreizack dreht sich zum Ziel und verschwindet beim Wurf, ein neuer erscheint nach kurzer Zeit. Geschoss (`shot25`, Feuer Nr. 5): brennender Dreizack mit Flammenschweif, startet in der Hand. Nur Anzeige.

### 26.10. 17:20 · F · 2026-10-26q – Brandpfeil: Bogen zielt, brennender Pfeil fliegt nach vorn
Brandpfeil neu gezeichnet (Holzbogen auf Dreibein, 2 Teilbilder: Bogen, Pfeil; `PARTN`, `TOWER_H` angepasst). Dreht sich zum Ziel (Spiegelung wie Glumanda/Flammenwerfer), Bogen neigt sich zum Ziel, Pfeil fliegt vorn ab und wird neu aufgelegt. Geschoss (`shot25`, `feuer` Nr. 4): brennender Pfeil mit Flammenschweif, startet vorn am Bogen. Nur Anzeige.

### 26.10. 17:00 · F · 2026-10-26p – Flammenwerfer: ein Feld groß, zusammenhängende Flamme
Flammenwerfer neu gezeichnet (Tank + Düse, passt auf ein Feld; `tools/turm/tuerme.html`, Bilder neu erzeugt, `TOWER_H` feuer[2] = 26). Die Flamme (`drawFlame`, gezeichnet im Turm anhand `JETS`) ist ein welliges Band in drei Schichten von der Mündung bis zum Monster, mit Funken und Glut am Ziel. Nur Anzeige.

### 26.10. 16:40 · F · 2026-10-26o – Kreativ-Modus: Element jederzeit wechseln
Im Kreativ-Modus (`KREATIV`) zeigt `canSwitchEl` die Element-Knöpfe immer; bestehende Türme des Feldes wechseln mit (gleiche Nummer und Stufe, ohne Edelstein). Normales Spiel unverändert.

### 26.10. 16:25 · F · 2026-10-26n – Flammenwerfer: Feuerstrahl aus der Mündung bis zum Ziel
Der Flammenwerfer dreht sich zum Ziel, der Feuerstrahl (`drawShot`, `p.el === 0 && p.idx === 2`) beginnt an der Mündung und reicht bis zum Monster. Nur Anzeige.

### 26.10. 16:10 · F · 2026-10-26m – Glumanda schießt aus dem Maul
Der Salamander dreht sich beim Schuss zum Ziel (Spiegelung in `drawTower25`, nur `feuer1`), Mündungsglühen sitzt am Maul, das Geschoss startet dort (`drawShot`, `p.el === 0 && p.idx === 1`). Nur Anzeige.

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
