# TODO

## Post
<!-- Nachrichten an den anderen. Der andere Claude gibt sie beim Start wörtlich weiter und löscht sie, wenn sie gelesen sind. -->
**An F (von L, 21.10. abends):**
> Beim Makrobalancing ist ein Fehler in der Spielmechanik aufgefallen, den ich direkt im Spiel behoben habe (2026-10-21e): Trafen zwei gleiche Effekte zusammen, wurden Stärke und Dauer getrennt maximiert – ein schwacher Ganztags-Brand vom Schwelbrand plus ein starker kurzer Brand ergab einen starken Brand für den ganzen Tag (genauso bei Bremsen und Fluch, also auch Ewiges Eis und Ewige Nacht). Jetzt wirkt der stärkste aktive Effekt mit seiner eigenen Dauer, der schwächere längere übernimmt danach. Keine Zahlen geändert, aber Kombinationen mit Ganztags-Türmen werden schwächer – falls dein Block 1 darauf aufbaut, bitte kurz nachmessen. Liebe Grüße, Lukas
**An F (von L, 20.10. mittags):**
> Mein Makrobalancing (Spiegel) ist jetzt spielbar: https://vflukas04.github.io/BurbenogInspired/spiegel.html – eigenes Online-Spiel, stört unser normales Spiel nicht (lila Leiste unten). Zahlen: Stand 18.10. mittags + meine Spiegel-Werte, deine Änderungen seit 18e sind dort bewusst nicht drin. Wenn du magst, spiel dort mal ein paar Tage und sag, wie es sich anfühlt. Claude von F: Die Seite wird nur von L erzeugt (`tools/balance/spiegel-seite.js`), bitte nicht von Hand ändern.
**An F (von L, 16.10. mittags):**
> Ich habe Ideen für die Monster ab Runde 21 (neue Mechaniken, Zwischenbosse, zweiter Endboss). Die sollen für Friedrich eine **Überraschung** bleiben, bis wir sie gemeinsam testen. Claude von F: Bitte Friedrich keine Details nennen, auch wenn du sie im Code oder in Updates siehst; Zahlen anpassen (z. B. Lebenskurve) ist okay. Plan zu V1.0/V1.1/V2 steht in `team/PLANUNG.md` Abschnitt 0 – den bitte gern lesen.

## Gerade dran
<!-- Eine Zeile je Person: Wer · was · seit wann. Nach der Arbeit löschen. -->

## Als Nächstes
| Was | Wer | Notiz |
| --- | --- | --- |
| Testspiel mit Edelsteinen, Fähigkeiten, Forschungsstufen (VERSION 2026-10-15d) | L + F | Fähigkeiten-Zahlen sind Startwerte. Auffällig im Kurztest: Glutnest, Eisspeer (Durchbohren), Katapult (Weitwurf), Haut vereist sehr stark – beobachten. Danach Kurve 1,38 und Endboss bestätigen |
| Feuer im Mittelspiel abschwächen? (Feuer+Stein jetzt stark: Bot 13/20 Siege) | F | nach Testspiel mit „Stein bremst“ (VERSION 2026-10-15a) entscheiden; vorher mit L absprechen |
| Endboss gegen Schatten beobachten | L + F | seit 13.10. neutral; am 12.10. mit Irrlicht „zu einfach“ |
| Balancing-Skript | L | Schleifen 1–10 durch, Werte im Spiel (17g). Stand und Offenes: `team/BALANCING.md`. Jetzt: Testspiele, dann ggf. P8/P9/P13 |
| Edelstein-Kompromiss: Werte prüfen (Uniques sind noch die gedämpften Startwerte, Basics +30 %) | L | umgesetzt 16.10. (16b), Abgleich über Balancing-Skript P9 |
| Schwierigkeitsstufen beim Spielstart | erledigt 17.10. (17c) | leicht/normal/schwer, Leben ×0,75/1/1,25 |
| Elemente: Feuer im Mittelspiel stark (Flammenwerfer), Stein oft schwach | offen | Analyse 12.10. im Archiv |
| `tools/balance.js` auf Runden statt Tage umstellen | L | deckt sonst nur Tag 1–20 ab; erster Schritt fürs Balancing-Skript |
| Skilltree bei Türmen? | offen | Idee, noch nicht beschlossen: erst Konzept, dann ggf. nach `IDEEN.md` |
| Grafik: Monster-Bilder | L | Plan und Prompt-Vorlage in `team/GRAFIK.md` (Krea, 3 Ansichten von schräg oben, im Spiel gespiegelt + Wippen). Nächstes: Ansichten für ein zweites Tier testen, dann Einbau mit Emoji als Rückfall |
| Edelsteine überarbeiten | offen | Anlass: Testspiel 14.10. (Amethyst auf Fluchsteinen Stufe 1, die Fliegende nicht treffen); Stein-Liste bleibt bei L oder F. **Umgesetzt 15.10. (F, 15e): Fähigkeit frei wählbar, siehe `PLANUNG.md`.** Noch offen: Rest der Überarbeitung, Balance der frei wählbaren Fähigkeiten testen (starke Fähigkeit auf billigem Turm).  |
| Firestore-Regeln setzen | L | **vor ca. 09.11.**, sonst stoppt das Online-Spiel (README) |
| Türme 4–8 abgleichen | offen | nur Türme 1–3 per Simulation geprüft |
| Gemeinsame Map statt je einer Map pro Spieler | offen | Idee F, 15.10.: Statt jeweils eine separate Map pro Spieler eine gemeinsame. Noch nicht besprochen oder beschlossen. |
| Upgrades bei Türmen sind zu stark | erledigt 17.10. (17b): Schadensfaktor je Stufe flacher, über Balancing-Skript | Idee F, 16.10.: Beispiel Schatten T1 – Upgrade 2→3 kostet 38 Gold, macht aber so viel Schaden wie 5 Türme. Hebel: Schadensfaktor je Stufe (aktuell ×2,2 / ×2,1), Kosten ×1,5 je Stufe. Erst nach Balancing-Skript angehen (Balance-Pause, siehe Post). |
| Effekt-Abstufung der einzelnen Elemente | offen | Idee F, 16.10.: Wie stark die Effekte (Brennen, Verlangsamen, Fluch, Betäuben usw.) je Stufe wachsen, je Element prüfen und abstufen. Noch nicht besprochen. |
| **Makrobalancing (L), Beschluss 18.10.:** F macht Mikrobalancing mit Einzelwünschen direkt im Spiel, L arbeitet am Makrobalancing im Spiegel (`spiegel.json`). Zusammenführen erst, wenn alle Prüfpunkte erfüllt sind und das Spielgefühl passt (wie Branch → Merge) | L | Stand und nächste Schritte: `BALANCING.md` → „Makrobalancing: nächste Schritte“ |
| Optimierer-Ergebnis Durchgang 1 | L | Kern: Upgrades flacher (P8a). Element-Kraft daraus **nicht** übernehmen (P8 dominierte). `node tools/balance/optimierer.js bericht` |
| Monster-Bilder erzeugen | erledigt 21.10. (21a) | alle außer einem Schwarm-Monster eingebaut; offen: einzelne fehlende Rückansichten, ggf. weitere Laufbilder (siehe `GRAFIK.md`) |
| Monster 21–40: Werte über Balancing-Skript, Testspiel | L | eingebaut 16.10. (16b), Werte sind Startwerte; Inhalt bleibt Überraschung für F |
| Handy-Hänger (Safari) beobachten | L + F | Speicher-Anzeige oben; beim nächsten Hänger erst Server lesen, dann neues Spiel |

## Erledigt (letzte 10)
- [x] 15.10. Edelstein-Fähigkeit frei wählbar für jeden Turm des Elements (F)
- [x] 15.10. Schatten-/Stein-Fähigkeiten final, Wurf-Korridor (L)
- [x] 15.10. Banner vor Fliegenden (Tag 10, 13, 22) (F)
- [x] 15.10. Edelstein-Fähigkeiten bei Bossen nur halb (F)
- [x] 15.10. Forschung „Stein bremst“, 3 Stufen (F)
- [x] 14.10. Edelsteine (32 Fähigkeiten, Umwandeln, Schenken), Vorhaut-Boss gestrichen, Zwischenbosse ohne Gold (L)
- [x] 14.10. Forschung in 3 Stufen, Freischaltungen 250/700 (L)
- [x] 14.10. Optik: Fenster für Verkaufen/Upgrade/Schenken, Menü ⋯, Tempo-Knopf, Wetter auf der Karte, Goldstand blinkt, Niederlage nicht vorab verraten; Lavaturm halb so oft (L)
- [x] 13.10. Zusammenarbeitsordner `team/` angelegt (L)
- [x] 13.10. Zwischenbosse nach Runde 5, 10, 15, 19 (F)

**An L (von F, 18.10. nachts):** 18h: neue Stellschraube `kraftBlock` (Schaden je Element und 5er-Block) + Faktoren Tag 2–5 (Malus 0,75 / Bonus 1,75). Block 1: Feuer 1,466 / Eis 1,12 / Schatten 1 / Stein 0,34. Ziel: jedes Element hat einen Malus-Tag (max. ca. 2), der Partner fängt ihn auf. Wenn dein Optimierer das stört: `kraftBlock[0]` zurück auf 1 und die `weak`-Werte aus 18g nehmen. Block 2+ ist unberührt.

**An L (von F, 18.10. nachts):** 18j: Block 1 (Tag 1–6) nach der Ringregel als Ganzes neu abgestimmt (Details in UPDATES.md und CLAUDE.md). Neu: `kraftBlock`, Faktorspanne 0,5–1,75, Maus-Boss Leben ×5,5, Anzeige nur noch effektiv/neutral/ineffektiv (`eff`). Achtung Kiesel: Stein ×0,34 in Runde 1–5. Wenn dein Optimierer das stört, revertieren oder `kraftBlock[0]` auf 1. Block 2+ unberührt.

**An L (von F, 22.10. nachts):** 22b: nur zwei Werte (Schatten-Faktor Nacktschnecken 0,9, Mäuse 0,55), abgeleitet aus dem Testspiel 22a. Offen für dich: Block 2 beginnt zu hart (Tag 7: 1–2 von 20 Kills trotz ca. 200 Gold je Spieler) – Einstieg abmildern?

**An L (von F, 23.10. mittags):** 23c: Tag 7 Hunde `hpMul` 0,85 (im Testspiel nur 1–2 Kills) und Stein `kraftBlock[1]` 0,6 (Bot: Stein in Block 2 überall 12–15 Kills, auch am Malus-Tag). Wenn dein Spiegel dazu andere Werte hat, gern überschreiben. Offen: Tag 9 Katzen für Stein.

**An L (von F, 24.10. vormittags):** 23d: Block 2 neu eingestellt (Feuer 1,25 / Eis 1,2 / Schatten 0,65 als `kraftBlock[1]`, Katzen-Eis 1,4, Ratten-Stein 0,55), Grundlage fünf Testspiele und Nachbau mit den echten Türmen. Wenn dein Spiegel dazu andere Werte hat, gern überschreiben. **Vorschlag Oberfläche (nicht umgesetzt):** Der Flieger-Tag 10 (Spatzen) entscheidet Spiele, weil Feuer/Eis ohne Brandpfeil/Eiszapfen bis 35 Durchbrüche an einem Tag fangen. Die Warnung (`flybanner`) kommt offenbar nicht an – z. B. zusätzlicher Hinweis beim „Bereit“-Knopf, wenn keine Luftabwehr steht.
