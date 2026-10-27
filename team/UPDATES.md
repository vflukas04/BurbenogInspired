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
### 27.10. 18:00 · L · Zweig D6 – Standardtürme ohne Reichweiten-Zuwachs, Treppe ×1,08, Leben kalibriert (nur Balancing-Werkzeuge)
- Standardtürme: Reichweite 3,5 auf allen Stufen, Upgrades ändern nur Schaden je Gold (Kurve 1/0,95/1,01/1,08/1,16/1,25). Bezugs-Bot spart bis 3 Tage. Mensch-Bots 92–98 % des Bezugs, Upgrade-Anteil ≈ 50 %, T7/T8 werden gebaut. Spielcode unverändert.

### 27.10. 13:00 · L · Zweig D4 – Leben auf Bezugs-Bot kalibriert (nur Balancing-Werkzeuge)
- Treppe ×1,12 je Turmtyp, Upgrade-Kurve 1/0,92/1/1,08/1,16/1,25, Bezugs-Bot mit Vorausschau (≤ 4 × T1, sonst ≤ 3 je Turmtyp). Mensch-Bots 0,91–0,96 des Ziels. Neue Begriffe: **Turmtyp** (T1–T8), **Stufe** (S1–S6). Spielcode unverändert.

### 27.10. 12:00 · L · Zweig D3 – Bot-Vergleich Standardtürme (nur Balancing-Werkzeuge)
- Preise in D gerafft (10/45/70/120/200/340/580/1000), Stein in D 2 (schwach)/4/6/8 mit T3 Felsbrocken, T4 Katapult. Spielcode unverändert.
- 15 Bots mit festem Gold (90 % des Kopfgelds, alles frei, ohne Forschung): Am stärksten sind Aufbauten mit 80–94 % Upgrades; Mensch-Bots erreichen 82–90 % des besten. Tabelle in `team/ZWEIG-D.md` (D3).


### 27.10. 01:30 · F · 2026-10-27s – Arbeiter, Biom-Abbau, Wege wachsen Stück für Stück
- Arbeiter sind jetzt im Spiel (nur Anzeige): ab Tag 2 alle 2 Tage ein neuer (Holzfäller am Wald, Bergarbeiter am Felsen, Angler am See), nächstgelegene Felder zuerst, je 8 Tage Arbeit. Wald verliert Bäume (Stümpfe, am Ende Holzstapel), Felsen schrumpfen zu Geröll, Angler graben Kanäle zum nächsten See. Arbeiter ≈ ¼ Feld hoch; Geländebonus bleibt unverändert, auch wenn das Feld abgebaut ist. Bilder `assets/dorf/arbeiter-*`.
- Dorfwege wachsen Stück für Stück: Weg Nr. q ist am Tag 4 + q/0,6 am Turm fertig und wächst 3 Tage lang. Neu laden genügt.

### 27.10. 00:55 · F · 2026-10-27r – Baumleichen ohne Glut
- Die verbrannten Bäume im Feuer-Boden haben keine Glutpunkte mehr (war zu unübersichtlich). Nur Anzeige. Neu laden genügt.

### 27.10. 00:40 · F · 2026-10-27q – Dorffeld gesperrt, Feuer-/Stein-Bäume, schwarze Wüste
- Auf dem Dorffeld gibt es kein Gelände mehr und man kann dort keinen Turm bauen (bestehende Türme bleiben). Das ändert genau ein Feld je Map gegenüber früher gewürfeltem Gelände (Karte unten rechts bzw. oben links, siehe `villageCell`): für laufende Spiele „Neues Spiel + neu laden" empfohlen.
- Im umgewandelten Boden: Wälder werden bei Feuer zu verbrannten Baumleichen mit Glut, bei Stein zu Kakteen. Schatten-Boden ist jetzt eine schwarze Wüste (Dünen, dunkle Steinchen) statt Violett. Nur Anzeige.

### 27.10. 00:10 · F · 2026-10-27p – Dörfer: Sockel, Eisburg blau, Spieler 2–4 oben links
- Alle Dörfer stehen auf einem dunklen Sockel (Feuer Basalt, Eis Eisscholle, Schatten Platte, Stein Steinplatte), die Eisburg hat sattere blaue Wände und hebt sich vom Schnee ab. Neue Bilder in `assets/dorf/` (Quelle `tools/dorf/dorf.html`).
- Spieler 1 hat das Dorf unten rechts, Spieler 2–4 oben links (zweite Reihe, damit die Burg ins Bild passt). Boden, Wege und zugefrorene Seen richten sich nach der jeweiligen Ecke. Nur Anzeige. Neu laden genügt.

### 27.10. 23:50 · F · 2026-10-27o – Seen frieren im Eis-Gebiet zu
- Auf einer Eis-Map frieren Seen zu (hellblaue Eisfläche mit Rissen), sobald sie im umgewandelten Schnee-Gebiet um das Dorf liegen. Nur Anzeige, der Geländebonus bleibt. Neu laden genügt.
