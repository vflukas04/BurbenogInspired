# TODO

## Post
<!-- Nachrichten an den anderen. Der andere Claude gibt sie beim Start wörtlich weiter und löscht sie, wenn sie gelesen sind. -->
**An F (von L, 15.10. 23:50):**
> 1. **Fähigkeit frei wählbar:** Da bin ich noch dagegen. Die Fähigkeiten sind bewusst auf einzelne Türme zugeschnitten; verallgemeinert verlieren sie ihren Sinn. Bitte lass es erst mal so, wir besprechen es zusammen (WhatsApp), bevor weiter daran gebaut wird.
> 2. **Edelsteine als kleiner Buff (+15 %):** Ich wollte eher einen deutlichen Mehrwert über einem Upgrade. Prellstein/Weitwurf übernehme ich wie von dir getestet – den Rest besprechen wir.
> 3. **Stein bremst:** gut, dass es raus ist – war mir zu nah an Eis.
> 4. **Balance-Pause:** Ich baue jetzt das Balancing-Skript (Verfahren in `team/BALANCING.md`). Bitte bis dahin keine Zahlen mehr drehen (Faktoren, Kopfgeld, Fähigkeitswerte) – sonst rechnet das Skript gegen ein bewegliches Ziel. Fehler beheben und neue Funktionen ohne Zahlenänderung sind natürlich okay. Deine Eindrücke gern weiter in `IDEEN.md`.
> 5. **Spoiler:** `tools/balance/STRATEGIE.md` (kommt noch) enthält Erkenntnisse zur besten Platzierung – bitte nicht lesen, sonst ist der Spielspaß weg.
> 6. **Archiv:** Jedes Online-Spiel wird jetzt automatisch in Firestore mitgeschrieben (`games/spiel1/archiv`), auslesen mit `node tools/archiv.js`. Danke für die Referenzläufe – genau so etwas brauchen wir zum Eichen, jetzt ohne Abschreiben.

**An F (von L, 16.10. mittags):**
> Ich habe Ideen für die Monster ab Runde 21 (neue Mechaniken, Zwischenbosse, zweiter Endboss). Die sollen für Friedrich eine **Überraschung** bleiben, bis wir sie gemeinsam testen. Claude von F: Bitte Friedrich keine Details nennen, auch wenn du sie im Code oder in Updates siehst; Zahlen anpassen (z. B. Lebenskurve) ist okay. Plan zu V1.0/V1.1/V2 steht in `team/PLANUNG.md` Abschnitt 0 – den bitte gern lesen.

## Gerade dran
<!-- Eine Zeile je Person: Wer · was · seit wann. Nach der Arbeit löschen. -->
- L · Balancing-Skript (glatte Bewertung, lokale Verbesserung, Spiegel, Wissen, Vorwärtspfad) · seit 16.10. 12:50

## Als Nächstes
| Was | Wer | Notiz |
| --- | --- | --- |
| Testspiel mit Edelsteinen, Fähigkeiten, Forschungsstufen (VERSION 2026-10-15d) | L + F | Fähigkeiten-Zahlen sind Startwerte. Auffällig im Kurztest: Glutnest, Eisspeer (Durchbohren), Katapult (Weitwurf), Haut vereist sehr stark – beobachten. Danach Kurve 1,38 und Endboss bestätigen |
| Feuer im Mittelspiel abschwächen? (Feuer+Stein jetzt stark: Bot 13/20 Siege) | F | nach Testspiel mit „Stein bremst“ (VERSION 2026-10-15a) entscheiden; vorher mit L absprechen |
| Endboss gegen Schatten beobachten | L + F | seit 13.10. neutral; am 12.10. mit Irrlicht „zu einfach“ |
| Balancing-Skript bauen (ersetzt Mikro-Balancing) | L | Verfahren in `team/BALANCING.md` (Prüfpunkte P1–P13). Stand 16.10.: Grundgerüst + P1. Nächstes: glatte Bewertung, lokale Verbesserung, Wissensspeicher, Spiegel-Datei, Forschung/Edelsteine, P2/P4/P5. Balance-Pause gilt weiter |
| Fähigkeit frei wählbar (15e) besprechen | L + F | L ist dagegen: Fähigkeiten sind auf Türme zugeschnitten |
| Schwierigkeitsstufen beim Spielstart | L | Faktor auf Monsterleben/-rüstung, Werte aus dem Balancing-Skript |
| Elemente: Feuer im Mittelspiel stark (Flammenwerfer), Stein oft schwach | offen | Analyse 12.10. im Archiv |
| `tools/balance.js` auf Runden statt Tage umstellen | L | deckt sonst nur Tag 1–20 ab; erster Schritt fürs Balancing-Skript |
| Skilltree bei Türmen? | offen | Idee, noch nicht beschlossen: erst Konzept, dann ggf. nach `IDEEN.md` |
| Grafikupdates für Türme | offen | Kenney-Sprites, graue Sprites werden je Element eingefärbt (`tinted`) |
| Edelsteine überarbeiten | offen | Anlass: Testspiel 14.10. (Amethyst auf Fluchsteinen Stufe 1, die Fliegende nicht treffen); Stein-Liste bleibt bei L oder F. **Umgesetzt 15.10. (F, 15e): Fähigkeit frei wählbar, siehe `PLANUNG.md`.** Noch offen: Rest der Überarbeitung, Balance der frei wählbaren Fähigkeiten testen (starke Fähigkeit auf billigem Turm).  |
| Firestore-Regeln setzen | L | **vor ca. 09.11.**, sonst stoppt das Online-Spiel (README) |
| Türme 4–8 abgleichen | offen | nur Türme 1–3 per Simulation geprüft |
| Gemeinsame Map statt je einer Map pro Spieler | offen | Idee F, 15.10.: Statt jeweils eine separate Map pro Spieler eine gemeinsame. Noch nicht besprochen oder beschlossen. |
| Upgrades bei Türmen sind zu stark | offen | Idee F, 16.10.: Beispiel Schatten T1 – Upgrade 2→3 kostet 38 Gold, macht aber so viel Schaden wie 5 Türme. Hebel: Schadensfaktor je Stufe (aktuell ×2,2 / ×2,1), Kosten ×1,5 je Stufe. Erst nach Balancing-Skript angehen (Balance-Pause, siehe Post). |
| Effekt-Abstufung der einzelnen Elemente | offen | Idee F, 16.10.: Wie stark die Effekte (Brennen, Verlangsamen, Fluch, Betäuben usw.) je Stufe wachsen, je Element prüfen und abstufen. Noch nicht besprochen. |
| Monster 21–40 ausdenken | L | Ideen für neue Mechaniken liegen bei L und bleiben bis zum Testlauf eine Überraschung für F. Zwischenbosse bleiben große Varianten der Vorwelle |
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
