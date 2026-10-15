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

**An L (von F, 15.10. abends):**
> Oscar hat weitere Elemente vorgeschlagen: **Blitz** (Kettenreaktion?), **Pflanze**, **Licht** und **Sand**. Als Idee in `IDEEN.md` eingetragen, nichts beschlossen. Außerdem heute gepusht (Balance, bitte „Neues Spiel“ + neu laden): Silberfische Tempo 1,0, schwache Tage Runde 2–5, Lavapfütze nur einmal je Schuss, Edelsteine als kleiner Buff, Spiel aufgeben im Menü, Upgrade/Verkaufen über dem Turm. Details in `UPDATES.md`, Referenzlauf in `REFERENZLAUF.md`.

**An L (von F, 15.10. mittags):**
> Du hattest geschrieben, du meldest dich zur Idee „Fähigkeit frei wählbar“. Friedrich wollte sie gleich haben, deshalb ist sie in VERSION 2026-10-15e drin: Stein einsetzen → eine der 8 Fähigkeiten des Elements für jeden Turm wählen (Dialog am Turm). Einige Fähigkeiten sind dafür verallgemeinert, Liste in `PLANUNG.md` (Abschnitt „Fähigkeit frei wählbar“). Gesperrt sind sinnlose Kombinationen. Balance ist nicht gemessen. Wenn dir eine Verallgemeinerung nicht passt, bitte direkt dort ändern.

**An L (von F, 15.10.):**
> Neu von mir (alles gepusht, VERSION 2026-10-15c, bitte „Neues Spiel“ + neu laden):
> 1. **Forschung „Stein bremst“** (Elementlabor, 20/35/50 Gold): ab Runde 6 bremst jeder Stein-Turm alle Monster in Reichweite um 18/25/32 % (auch Fliegende). Bot-Test (20 Läufe je Spiel): Siege 57 → 65 von 160, fast alles aus Feuer+Stein (5 → 13 von 20). Eis+Stein und Schatten+Stein unverändert.
> 2. **Edelstein-Fähigkeiten bei Bossen nur halb** (Schwelglut, Glutnest, Haut vereist, Rüstungsschaden ×2, Hunger, Durchdringen Schatten T6); Eisblock, Absturz, Angst, Todesstoß waren schon halb.
> 3. **Banner vor Fliegenden** (Tag 10, 13, 22): zeigt, welche Türme des eigenen Elements treffen und wie viele man hat. Anlass: Testspiel verloren an Tag 13 (Habichte) mit ca. 200 ungenutztem Gold.
> 4. **Offen, bitte mit dir absprechen:** Feuer im Mittelspiel abschwächen? Feuer+Stein ist jetzt stark. Ich würde vorher ein, zwei echte Testspiele abwarten.
> Hinweis: Bot-Zahlen sind nur Tendenzen (Bot kommt ca. 5 Tage weiter als wir echt).

**An L (von F, 14.10.):**
> Moin Lukas! Zu deinen drei Punkten:
> 1. **Balancing-Skript:** Ja, passt. Ich notiere meine Testeindrücke in `IDEEN.md` oder hier. Eine Bitte: Meine Schatten-Kurve vom 13.10. (`upDmg`, Schaden je Upgrade ab Stufe 5 nur ×1,8) bitte nicht einfach überschreiben, erst anschauen, ob sie noch passt.
> 2. **Edelsteine:** Schau ich mir in `PLANUNG.md` an und schreibe meine Ideen dazu rein. Vorhaut-Boss streichen und Zwischenbosse ohne Gold ist okay.
> 3. **Felsen +30 für alle:** Passt so.

## Gerade dran
<!-- Eine Zeile je Person: Wer · was · seit wann. Nach der Arbeit löschen. -->
- L · Balancing-Skript (`tools/balance/`, `team/BALANCING.md`) · seit 15.10. 23:50 – bitte keine Zahlen drehen, siehe Post

## Als Nächstes
| Was | Wer | Notiz |
| --- | --- | --- |
| Testspiel mit Edelsteinen, Fähigkeiten, Forschungsstufen (VERSION 2026-10-15d) | L + F | Fähigkeiten-Zahlen sind Startwerte. Auffällig im Kurztest: Glutnest, Eisspeer (Durchbohren), Katapult (Weitwurf), Haut vereist sehr stark – beobachten. Danach Kurve 1,38 und Endboss bestätigen |
| Feuer im Mittelspiel abschwächen? (Feuer+Stein jetzt stark: Bot 13/20 Siege) | F | nach Testspiel mit „Stein bremst“ (VERSION 2026-10-15a) entscheiden; vorher mit L absprechen |
| Endboss gegen Schatten beobachten | L + F | seit 13.10. neutral; am 12.10. mit Irrlicht „zu einfach“ |
| Balancing-Skript bauen (ersetzt Mikro-Balancing) | L | Verfahren in `team/BALANCING.md` (Prüfpunkte P1–P13) |
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
| Monster 21–40 ausdenken | offen | Spiel ist auf 40 Runden ausgelegt |
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
