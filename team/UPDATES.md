# Updates (neueste oben, höchstens 15 Einträge)

<!-- So geht ein neuer Eintrag: direkt UNTER der Zeile „NEUE EINTRÄGE HIER“ einfügen (nie über ihr, nie in diesen Kopf).

### 27.10. 21:00 · F · 2026-10-27i – Wald als Tannengruppe
- Waldfelder zeigen jetzt eine Gruppe aus 4–5 kleinen Tannen (Entwurf aus tools/dorf) statt einer einzelnen Tanne, ohne Wiesenfleck am Boden. Nur Optik, Boni und Karten unverändert. Neu laden genügt.
- Entwurfsbilder Dorf/Arbeiter: Dorf = 1 Feld breit, Arbeiter ≈ ¼ Feld hoch (Montage in assets/dorf-entwurf/_insitu-karte.png).

### 27.10. 20:30 · F · 2026-10-27h – Verbindung schneller prüfen
- Rund um die Startzeit einer Welle (±90 s) fragt jedes Gerät alle 2 s den Stand ab (sonst weiter alle 10 s). Bleibt dann 5 s lang der Stand aus, baut die Seite die Verbindung neu auf; sonst nach 25 s.
- Schlägt eine Abfrage fehl oder dauert über 5 s, wird sofort neu verbunden.

### 27.10. 20:20 · F · 2026-10-27g – Verbindungswächter + Fehleranzeige
- Laptop-Hänger (Welle startet nur beim Mitspieler) trat ohne neue Version auf. Statuszeile zeigt jetzt Fehler der letzten 3 Minuten (Abfrage, Auswertung, Seitenfehler).
- Wächter: Kommt >40 s kein Stand vom Server (Seite sichtbar), baut die Seite die Firestore-Verbindung neu auf; nach 3 Minuten ohne Stand lädt sie sich in Ruhe neu.

### 27.10. 20:00 · F · 2026-10-27f – Seite lädt sich bei neuer Version selbst neu
- Laptop war dauerhaft offen, Wiedergabe-Hänger war es nicht. Neue Vermutung: veralteter Code (stundenlang offene Seite bei vielen Pushes). Jetzt lädt sich die Seite bei neuer Version selbst neu, wenn Ruhe herrscht (keine Wiedergabe, kein Dialog, 45 s ohne Eingabe, nichts am Speichern).
- Fehler beim Starten einer Wiedergabe werden als Meldung mit Versionsnummer gezeigt statt stumm zu hängen.

### 27.10. 19:40 · F · 2026-10-27e – Welle startet nicht am Laptop
- Vermutete Ursache: Eine stehende Wiedergabe (Tab im Hintergrund, Laptop schlief) blockierte neue Wellen und das Auslösen. Jetzt wird sie beendet, sobald eine neuere Welle da ist oder man nach >20 s zurückkehrt.
- Statuszeile oben zeigt Tag.Welle, „Stand vor N s“ und ob eine Wiedergabe läuft (zur Fehlersuche, bitte bei Wiederholung Screenshot).

### 27.10. 18:15 · F · 2026-10-27d – Onyx spuckt Felsbrocken
- Onyx streckt sich nicht mehr bis zum Ziel, sondern spuckt einen großen Felsbrocken aus dem Maul (Kopf stößt kurz vor).

### 27.10. 18:00 · F · 2026-10-27c – Bergkönig: Riss schneller
- Der Riss läuft doppelt so schnell und ist beim Einschlag schon am Monster (vorher kam der Schaden vor dem Riss).

### 27.10. 17:50 · F · 2026-10-27b – Stein-Animationen nachgebessert
- Animation startet jetzt mit dem Schuss selbst (vorher bei schnellem Bildwechsel manchmal übersprungen: Katapult lud nur jeden 2. Schuss nach).
- Onyx streckt sich bis zum Monster und beißt zu (kein Geschoss mehr). Lawine: Steine lösen sich vom Haufen, rollen am Boden zum Ziel, Haufen wächst nach. Bergkönig: großer Hammer, Riss vom Einschlag bis zum Monster.

### 27.10. 17:30 · F · 2026-10-27a – Stein-Animationen
- Schleuder spannt das Gummi und schnellt zurück; Katapult schwingt den Wurfarm über den Kopf; Onyx beißt zu und dehnt den Hals; Erdbeben: gezackter Riss im Kreis; Granitwächter wirft den Speer (neuer wächst nach); Lawine: Steine rollen mit Staub; Bergkönig schlägt mit dem Hammer, ein Riss läuft zu den Monstern.
- Katapult/Onyx/Wächter/Bergkönig drehen sich zum Ziel (spiegeln). Türmbilder unverändert, nur Teile (Katapult-Stein, Wächter-Speer) getrennt.

### 26.10. 19:30 · F · 2026-10-26w – Schatten: Schattenturm, Seelenfresser-Silhouette, Phantom, Schattendrache
- Fluchstein heißt jetzt Schattenturm (dunkler Turm im Schattensee, wie der Lavaturm); Ewige Nacht heißt Schattendrache und speit schwarzes Feuer. Namen nur in der Anzeige.
- Seelenfresser: durchsichtige Silhouette des Monsters fliegt vom Ziel zum Turm. Phantom schießt ein kleines schwarzes Phantom.
Überschrift: drei Rauten, Datum Uhrzeit · L oder F · VERSION – Titel; darunter höchstens 5 Zeilen: was, warum, worauf achten.
Mehr als 15 Einträge → die ältesten oben in team/archiv/updates-archiv.md einfügen. -->
<!-- NEUE EINTRÄGE HIER -->

### 27.10. 21:30 · F · 2026-10-27j – See statt Sumpf
- Sumpf-Felder sind jetzt kleine Seen (Wasser, Glanz, Wellen, ab und zu Seerosenblatt), ohne Strand und ohne Trauerweide; benachbarte Seefelder fließen zu Teichen/Flüssen zusammen. Name in der Anzeige „See“, Bonus (+20 Gold) und Karten unverändert. spiegel.html behält „Sumpf“. Neu laden genügt.
### 26.10. 18:45 · F · 2026-10-26v – Eisdrache gefährlicher
Dunklere Farben, wütender Blick mit leuchtend blauem Auge, Reißzähne, lange Hörner, Krallen, Stacheln, eckige Flügel mit Knochenfingern. Mündungspunkt für den Eisatem angepasst. Nur Anzeige.

### 26.10. 18:30 · F · 2026-10-26u – Eis: Speerwurf, dicker Eisspeer, Schneewolke, Eisdrache
Schneekönig wirft seinen Eisspeer (dreht sich zum Ziel, Speer-Teilbild neu, Geschoss mit Frostschweif). Eisspeer-Geschoss deutlich dicker. Blizzard: Schneewolke über dem Ziel (`drawSnowCloud`), aus der es auf die Monster schneit. Ewiges Eis heißt jetzt **Eisdrache** (nur Anzeige, `spiegel.html` behält den alten Namen): neu gezeichneter Drache auf Eisscholle, Kopf und Flügel als Teilbilder, Eisatem wie beim Flammenwerfer (`drawFlame(..., ice)`, `JETS['1:…']`). `TOWER_H` eis[3] = 62, eis[7] = 60. Nur Anzeige.

### 26.10. 18:10 · F · 2026-10-26t – Höllenfeuer schießt brennende Kometen
Geschoss (`shot25`, Feuer Nr. 8): Komet mit glühendem Kern und langem, welligem Flammenschweif, der der Flugbahn (Bogen) folgt; startet an der Turmspitze (`drawShot`, `ang25`). Beim Schuss steigen Glut und Funken vom Turm auf. Nur Anzeige.

### 26.10. 17:55 · F · 2026-10-26s – Lavaturm: Turm im Lavasee mit Lava-Zinnen
Lavaturm neu gezeichnet: dunkler Steinturm mitten in einem Lavasee, oben Zinnen aus glühender Lava, nur zwei kurze Rinnsale. Teilbilder: Zinnen (pulsieren), Funken (steigen beim Schuss). `TOWER_H` feuer[5] = 69,5. Nur Anzeige.
