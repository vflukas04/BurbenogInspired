# BurbenogInspired

Kooperatives Tower-Defense über mehrere Tage für 2–4 Spieler. Jeden Tag kommt um 10 Uhr eine Welle bei allen gleichzeitig. Was einer durchlässt, läuft um 13, 16 und 19 Uhr beim Nachbarn weiter. Sind mehr als 30 Monster bei allen durchgebrochen, ist das Spiel verloren.

Alles steckt in einer Datei: `index.html`.

## Einmal einrichten (ca. 15 Minuten)

### 1. Online-Spielstand: Firebase (kostenlos)
1. Auf https://console.firebase.google.com mit einem Google-Konto ein neues Projekt anlegen (Google Analytics kann aus bleiben).
2. Links **Build → Firestore Database → Datenbank erstellen**, Standort `eur3 (Europe)`, **Testmodus** wählen.
3. Unter **Regeln** diesen Text einfügen und veröffentlichen:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /games/{document=**} { allow read, write: if true; }
     }
   }
   ```
   Das heißt: Wer den Link kennt, kann mitspielen. Für ein Spiel unter Freunden reicht das.
4. **Projekteinstellungen (Zahnrad) → Deine Apps → Web (`</>`)**: App registrieren, Hosting nicht ankreuzen. Aus dem angezeigten `firebaseConfig` die Werte `apiKey`, `authDomain`, `projectId`, `appId` oben in `index.html` bei `FIREBASE_CONFIG` eintragen.

### 2. Link zum Teilen: GitHub Pages (kostenlos)
1. Auf https://github.com ein Konto anlegen und ein neues **öffentliches** Repository anlegen, `BurbenogInspired`.
2. **Add file → Upload files**: `index.html` (und diese README) hochladen, „Commit changes“.
3. **Settings → Pages**: Source „Deploy from a branch“, Branch `main`, Ordner `/ (root)`, speichern.
4. Nach 1–2 Minuten läuft das Spiel unter `https://vflukas04.github.io/BurbenogInspired/`. Diesen Link per WhatsApp verschicken.

Änderungen: neue `index.html` wieder hochladen, nach einer Minute ist sie live.

## Spielen
- Einer öffnet den Link und legt ein Spiel an (Spielerzahl, Test-Takt oder echte Uhrzeiten).
- Jeder wählt oben „Ich spiele: Spieler X“ und baut auf seinem Feld. Pro Spieler zählt nur das Gold.
- Die Welle wird berechnet, sobald jemand die Seite nach der fälligen Uhrzeit offen hat. Danach sieht jeder die Wiederholung.
- „Jetzt auslösen“ startet die nächste Welle sofort (zum Testen).
- Ein zweites Spiel parallel: `GAME_ID` in `index.html` ändern.

## Aufs Handy installieren
Link im Handy-Browser öffnen, dann:
- **Android (Chrome):** Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“
- **iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“

Danach startet das Spiel wie eine App mit eigenem Symbol, ohne Browserleiste.

## Inhalte ändern
Im Block **SPIELDATEN** oben im Skript stehen Elemente, Türme, Monster und Wellen. Effekte: `burn`, `slow`, `pierce`, `splash`, `chain`, `gold`, `aura`.
