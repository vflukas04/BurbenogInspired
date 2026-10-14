# Start hier – für beide Claudes

**Bei jeder Sitzung zuerst lesen, in dieser Reihenfolge (zusammen < 200 Zeilen):**
1. `team/START.md` (diese Datei)
2. `team/TODO.md` – vor allem „Gerade dran“
3. `team/UPDATES.md` – nur die obersten 5 Einträge

**Post:** Steht in `TODO.md` unter „Post“ etwas für deinen Menschen (an L oder an F), gib es ihm **als Erstes und wörtlich** weiter, vor allem anderen. Erst wenn er es gelesen hat, den Eintrag löschen.

Mehr nur bei Bedarf: `CLAUDE.md` (Technik, alle Regeldetails), `team/PLANUNG.md` (Entwürfe in Arbeit), `team/IDEEN.md` (noch nicht beschlossen), `team/archiv/` (alte Protokolle), `index.html` (die echten Zahlen).

## Wer ist wer
- **L** = Lukas und sein Claude · **F** = Friedrich und sein Claude. Beide Claudes ändern Code und pushen nach `main`.
- Live-Spiel: https://vflukas04.github.io/BurbenogInspired/ (ca. 1 Minute nach dem Push).

## Das Spiel in 10 Zeilen (Stand 13.10.)
- Koop-Tower-Defense über mehrere Tage, 2–4 Spieler, jeder hat ein eigenes Feld (16 × 16).
- 24 Spieltage: 20 Runden mit je einem Monstertyp (20 Stück) + Zwischenbosse an Tag 6, 12, 18, 23; Tag 24 Endboss Uffug.
- Spielart „Uhrzeiten“ (10 Uhr neue Welle, Durchgelassene laufen später beim Nachbarn weiter) oder „Live“ (sofort weiter). Mehr als 30 ganz durchgebrochen = verloren.
- Elemente: Feuer brennt · Eis bremst · Schatten verflucht (mehr Schaden, weniger Rüstung) + Irrlicht verstärkt · Stein Fläche, zertrümmert Rüstung, wetterfest.
- Monster: Leben 14 × Runde^1,38; Rüstung = Prozent + Punkte; nachtaktive Monster sieht Schatten um 19 Uhr nur im Irrlicht-Kreis.
- Faktoren: je 5er-Block erste Runde neutral, danach hat jedes Element genau einmal Vor- und Nachteil.
- Gold: Start 30, Kopfgeld 2/3/5/8 je 5 Runden; Schenken (10 % Gebühr); Gemeinschaftskasse für Forschung.
- Türme: 8 je Element (10 … 1200 Gold), Upgrades bis Stufe 6.
- Gelände: Wald +10, Sumpf +20, Felsen (6–8, +30 Gold für alle, +15 % Reichweite, Stein ×1,3 Schaden); wird je neuem Spiel neu gewürfelt.
- Leitlinie: Spielgefühl der beiden > Simulation. Lieber wenige Regler auf einmal drehen und eine Weile testen.

## Regeln der Zusammenarbeit
1. **Vor der Arbeit:** `git pull`, dann in `TODO.md` unter „Gerade dran“ eintragen: wer, was, seit wann. Steht dort schon jemand am selben Thema oder an denselben Werten → erst absprechen (WhatsApp).
2. **Nach der Arbeit:** oben in `UPDATES.md` ein Eintrag (höchstens 5 Zeilen), `TODO.md` abhaken/ergänzen, die eigene Zeile unter „Gerade dran“ löschen. Dann `git pull --rebase`, pushen.
3. Spielcode geändert → `VERSION` in `index.html` hochzählen, Turm-/Monstertexte prüfen (siehe `CLAUDE.md` → Testen), Spieler an „Neues Spiel + neu laden“ erinnern.
4. Ideen, die noch nicht beschlossen sind → `IDEEN.md`, nicht `TODO.md`.
5. Neue Grundregel des Spiels → hier unter „Das Spiel in 10 Zeilen“ anpassen **und** in `CLAUDE.md` → Regeln.
6. **Kurz halten:** `UPDATES.md` höchstens 15 Einträge, ältere ans Ende von `team/archiv/` verschieben. Erledigtes in `TODO.md` höchstens 10 Zeilen.
7. Keine privaten Inhalte ins Repo – es ist öffentlich.
8. Nachrichten an den anderen → in `TODO.md` unter „Post“ (an L / an F). Der andere Claude gibt sie beim Start weiter.

## Eigenes Claude-Projekt einrichten (empfohlen)
- In der Claude-App ein Projekt „BurbenogInspired“ anlegen. In die Projekt-Anweisungen ungefähr: *„Antworte auf Deutsch, kurz. Zu Beginn jeder Sitzung das GitHub-Repo vflukas04/BurbenogInspired mit Schreibzugriff anhängen, klonen bzw. pullen und team/START.md, team/TODO.md und die obersten 5 Einträge von team/UPDATES.md lesen. CLAUDE.md ist das Nachschlagewerk. Änderungen nach den Regeln in team/START.md, Kürzel (F) bzw. (L). Keine Repo-Dateien ins Projektwissen kopieren. Nichts Privates ins Repo.“*
- Persönliches (Ton, Pausen, Arbeitszeiten) gehört in diese Anweisungen, nicht ins Repo.
- Ins Projektwissen höchstens ein kurzes Dokument mit Links (Repo, Live-Spiel, welche Datei wofür) – keine Kopien, die veralten.
- Jede neue Sitzung mit dem Startprompt unten beginnen.

## Startprompt für einen neuen Chat
> Wir arbeiten an BurbenogInspired. Hol den neuesten Stand und lies team/START.md, team/TODO.md und die obersten 5 Einträge von team/UPDATES.md. Gib mir zuerst wörtlich, was in TODO.md unter „Post“ an mich steht. Dann sag mir in 3 Zeilen, was zuletzt passiert ist, wer gerade woran arbeitet und was als Nächstes ansteht. Dann warte auf meinen Wunsch.
