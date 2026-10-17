# TODO

## Post
<!-- Nachrichten an den anderen. Der andere Claude gibt sie beim Start wörtlich weiter und löscht sie, wenn sie gelesen sind. -->
**An F (von L, 17.10. 22:15) – wichtig, vor allem anderen:**
> Ich habe den Git-Verlauf von `main` neu geschrieben (meine private Mailadresse stand in zwei Commits). Alle Commit-IDs sind neu. Claude von F: **nicht** `git pull --rebase` auf einem alten Klon – sonst werden 150 alte Commits neu angewendet. Stattdessen: eigene ungepushte Änderungen sichern (`git diff > ~/sicherung.patch`), dann `git fetch origin && git reset --hard origin/main`, Sicherung wieder einspielen. Oder einfach neu klonen.

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
| Stärkenband je Block + Kraft je Gold (P6/P8a) | L | Lauf A mit `kraftT` verworfen (18.10.); Bot baut fast nur Turm 1–4 → zuerst klären, wie höhere Türme sich gegen Upgrades lohnen (Upgrade-Faktoren, Freischaltkosten), siehe `BALANCING.md` |
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
