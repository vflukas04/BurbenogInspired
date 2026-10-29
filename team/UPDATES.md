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
### 29.10. 18:40 · F · 2026-10-29b – Entwurf „glatt“ (ohne Schachbrett)
Nur zum Ansehen: Adresse mit `?glatt=1` zeigt die Map ohne Karomuster (weiche Wiese, durchgehender Pfad statt Kästchen). Raster gilt weiter für die Türme. Normales Spiel unverändert. Vergleich: `assets/dorf-entwurf/_glatt-vergleich.png`.

### 29.10. 18:25 · F · 2026-10-29a – Kreativ: Spielerwahl
Im Kreativ-Modus gibt es oben wieder die Knöpfe „Spieler 1–4“ zum Wechseln (Antippen eines Feldes wechselt weiter auch). Neu laden.

### 28.10. 15:00 · F · 2026-10-28c – Gesandte nehmen den kürzesten Weg
Sie verlassen das Dorf dort Richtung Monsterweg, wo Weg + Reststrecke auf der Straße am kürzesten ist (Hinweg Richtung Ausgang, Rückweg ab Eingang getrennt gewählt). Nur Anzeige, neu laden.

### 28.10. 09:10 · F · 2026-10-28b – Eis: Arbeiter und Gesandte mit dunklem Rand
Im weißen Eis-Biom waren sie kaum zu sehen; jetzt dunkler Schimmer um die Figuren. Nur Anzeige, neu laden.

### 28.10. 09:20 · F · 2026-10-28a – Gesandte wandern über den Monsterweg zur Nachbar-Burg
Die Gesandten laufen jetzt wie die Monster: Dorf → Monsterweg → Ausgang rechts → Eingang links der nächsten Map → Burg des Nachbarn, handeln, dann zurück (ab Tag 28 mit Gespann, schneller). Läuft durchgehend, nicht nur zu Wellenzeiten. Nur Anzeige, neu laden.

### 28.10. 02:00 · L · Zweig D6T – echte Türme aus Wechselkursen, Elemente an Bodentagen ±8 % (nur Balancing-Werkzeuge)
- Fehler behoben: Effekt und Dauer wuchsen je Stufe mit, Nova-Kurs hing nicht am Radius. Kurse mit Platzwahl, Verbund-Kurse für Bremsen/Rüstungsschaden, Brennen/Fluch nachgezogen. Nachtaktive im Test neu verteilt (L). Spielcode unverändert.
- Freier Bau an Bodentagen: Feuer 1,04 · Eis 1,08 · Schatten 1,02 · Stein 1,00. Offen: Fliegertage, Drift am Anfang (≈ 0,85), Irrlicht zu stark, Wetter bis ±28 %. Details `team/ZWEIG-D.md`.


### 27.10. 23:05 · F · 2026-10-27x – Arbeiter arbeiten fast durchgehend
Holzhacken, Steinbau, Angeln dauern jetzt 30–50 s am Stück, nur noch selten ein kurzer Gang zum Dorf (vorher 7–9 s Arbeit, dann Rückweg). Nur Anzeige, neu laden.

### 27.10. 22:55 · F · 2026-10-27w – Gesandte auch ohne Turm, Schatten-Arbeiter heller
Gesandte brauchten einen Turm auf beiden Maps (im Kreativ-Modus oft keiner) – ohne Turm übergeben sie jetzt am nächsten Feld am Monsterweg. Arbeiter und Gesandte im Schatten-Biom bekommen einen hellen Schimmer. Nur Anzeige, neu laden.

### 27.10. 02:10 · F · 2026-10-27v – Gesandte zwischen den Dörfern
Ab Tag 12 laufen kleine Gesandte auf den Wegen zum ersten Turm, von dort zur Burg des nächsten Spielers, handeln und kehren mit einer Münze („+1“) zurück; ab Tag 24 zwei, ab Tag 28 mit Pferdegespann. Nur Anzeige, kein echtes Gold. Neu laden genügt.

### 28.10. 22:45 · F · 2026-10-27u – Arbeiter laufen um die Biome
- Arbeiter betreten keine Biomfelder (See, Wald, Fels) mehr und laufen auf freien Feldern um sie herum. Gibt es für ein Feld keinen freien Weg (ringsum Gelände), arbeitet der Arbeiter nur an seinem Platz. Nur Anzeige. Neu laden genügt.

