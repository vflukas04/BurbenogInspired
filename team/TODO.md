# TODO

## Post
<!-- Nachrichten an den anderen. Der andere Claude gibt sie beim Start wörtlich weiter und löscht sie, wenn sie gelesen sind. -->
**An F (von L, 14.10.):**
> Moin Friedrich! Drei Sachen von mir:
> 1. **Balancing-Skript:** Ich baue ein Skript, das unser ständiges Mikro-Balancing ersetzen soll. Mein Vorschlag: Du musst dir über kleine Zahlen keine Gedanken mehr machen und kannst dich ganz auf Spielprinzip und neue Mechaniken stürzen. Deine Eindrücke aus Testspielen („Schatten fühlt sich zu stark an“) bleiben trotzdem Gold wert – einfach in `IDEEN.md` oder hier unter „Post an L“ notieren. Das ist nur vorübergehend gedacht: Sobald das Skript steht, machen wir das Feintuning wieder gemeinsam. Passt dir das so?
> 2. **Edelsteine:** Ich mache einen Vorschlag für Edelsteine, die man bei Zwischenbossen sammelt. Entwurf und offene Fragen: `team/PLANUNG.md` – gern schon reinschreiben, was dir dazu einfällt.
> 3. **Claude-Projekt:** Ich habe mir in der App ein eigenes Projekt mit Anweisungen für BurbenogInspired angelegt. Hast du das auch schon? Falls nicht: Anleitung steht in `team/START.md` unter „Eigenes Claude-Projekt einrichten“ – dein Claude hilft dir beim Aufsetzen.
>
> Und zum Schluss, mit herzlichen Grüßen: Du bist ein alter Stinker aus Pupshausen und du putzt dir deine Zähne mit dem Klowasser nach Bierschiss. 💩🍺

**An L:** –

## Gerade dran
<!-- Eine Zeile je Person: Wer · was · seit wann. Nach der Arbeit löschen. -->
- (niemand)

## Als Nächstes
| Was | Wer | Notiz |
| --- | --- | --- |
| Testspiel mit Zwischenbossen und neuen Faktoren (VERSION 2026-10-13b) | L + F | danach Kurve 1,38 und Endboss bestätigen; Late Game war „noch etwas stark“ |
| Endboss gegen Schatten beobachten | L + F | seit 13.10. neutral; am 12.10. mit Irrlicht „zu einfach“ |
| Balancing-Skript planen und bauen (ersetzt Mikro-Balancing) | L | Entwurf in `PLANUNG.md`; Aufteilung mit F abstimmen (siehe Post) |
| Edelsteine bei Zwischenbossen: Vorschlag | L | Entwurf + offene Fragen in `PLANUNG.md`; könnte auch das kleine Boss-Kopfgeld lösen |
| Forschung früher relevant: jede Forschung in 3 Stufen teilen (Stufe 1 billig) | L | Vorschlag L 14.10.; Freischaltungen bleiben ungestuft, kosten aber mehr als ein Turm der freigeschalteten Stufe; evtl. mit Edelsteinen verknüpfen |
| Optik: Verkaufen mit Bestätigungsfenster wie beim Bauen | L | heute Doppelklick „Wirklich verkaufen?“ |
| Optik: Upgrade mit Vorschau (alt → neu) und Bestätigung | L | gleicher Dialog wie Bauen |
| Optik: Knopfleiste oben entschlacken | L | Vorschlag: Tempo als ein Knopf (1×→3×→10×), „Ende zeigen“ nur während Wiedergabe, „Neues Spiel“ ins ⋯-Menü (mit Rückfrage), Schenken in Fenster |
| Optik: Gold schenken bequemer | L | Fenster mit Knöpfen +10/+50/+100/Hälfte und Anzeige „kommt an“; „Senden“ ausgegraut bei zu wenig Gold; Bestätigung: Goldstand blinkt kurz farbig (bei jeder Änderung des Goldstands) |
| Optik: Wetter auf der Karte sichtbar | L | Symbol in jeder Feldecke (billig, klarer Nutzen); Regen/Gewitter-Animation nur leicht und abschaltbar (Safari-Hänger!) |
| Niederlage nicht vorab verraten | L | Ursache: `mayBuild` prüft `G.over` sofort, Upgrade-Knöpfe verschwinden vor der Wiedergabe. Vorschlag: auf `overShown()` umstellen |
| Vorhaut-Boss (Tag 23) streichen | L | Uffug ist ja schon der Boss nach der Uffug-Vorhaut. Offen: Spiel dann 23 Tage, 3 Zwischenbosse? |
| Zwischenbosse: Kopfgeld für 1 Boss klein – Bonus? | offen | evtl. über Edelsteine |
| Elemente: Feuer im Mittelspiel stark (Flammenwerfer), Stein oft schwach | offen | Analyse 12.10. im Archiv |
| `tools/balance.js` auf Runden statt Tage umstellen | L | deckt sonst nur Tag 1–20 ab; erster Schritt fürs Balancing-Skript |
| Firestore-Regeln setzen | L | **vor ca. 09.11.**, sonst stoppt das Online-Spiel (README) |
| Türme 4–8 abgleichen | offen | nur Türme 1–3 per Simulation geprüft |
| Monster 21–40 ausdenken | offen | Spiel ist auf 40 Runden ausgelegt |
| Handy-Hänger (Safari) beobachten | L + F | Speicher-Anzeige oben; beim nächsten Hänger erst Server lesen, dann neues Spiel |

## Erledigt (letzte 10)
- [x] 13.10. Zusammenarbeitsordner `team/` angelegt (L)
- [x] 13.10. Zwischenbosse nach Runde 5, 10, 15, 19 (F)
- [x] 13.10. Faktoren je 5er-Block ausgeglichen, Endboss neutral (F)
- [x] 13.10. `balance.js` repariert, Modus „zehn“ (F)
- [x] 12.10. Rüstungssystem, Irrlicht-Verstärker, nachtaktive Monster, Leben-Kurve 1,38 (L)
- [x] 12.10. Friedrich als Collaborator eingeladen (L)
