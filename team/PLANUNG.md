# Planung (Entwürfe, an denen gerade gedacht wird)

Größere Vorhaben, bevor sie umgesetzt werden. Kommentare beider willkommen, mit Kürzel (L/F). Beschlossenes wandert nach `TODO.md`, Verworfenes nach `IDEEN.md`.

## 1. Balancing-Skript – L, 14.10.
**Ziel:** Statt vieler kleiner Handänderungen schlägt ein Skript Zahlen vor, die messbare Ziele treffen. F kann sich auf Spielprinzip und neue Mechaniken konzentrieren.

**Idee für den Ablauf (Entwurf):**
1. `tools/balance.js` auf Runden statt Tage umstellen, Zwischenbosse und Felsen mit abdecken.
2. Ziele festlegen, z. B.: Anfangstürme schaffen in Runde 1 ca. 12/8/6 von 20 (wie `kalibrieren.js`); Gold-Bedarf je Element und Runde ungefähr gleich (`bedarf`); Gewinnquote des Bots in einem festen Band.
3. Wenige Regler, die das Skript verändern darf (z. B. Leben-Kurve, Element-Faktoren je Runde, Turmkraft je Element). Alles andere bleibt Handarbeit.
4. Ausgabe: eine Vorschlagstabelle (alt → neu, Wirkung). Das Skript schreibt nichts selbst in `index.html`; ein Mensch entscheidet.

**Offene Fragen:**
- Der Bot spielt gierig und schlechter als wir. Wie übersetzen wir Testspiel-Eindrücke in Zielwerte, damit das Skript nicht auf den Bot optimiert?
- Welche Regler genau, und wie oft laufen lassen (nach jeder Mechanik-Änderung? vor jedem Testabend?)
- Laufzeit: Volltest dauert ca. 8 Minuten – reicht `zehn` als Schnellcheck?
- Aufteilung mit F bestätigen: F meldet Spielgefühl, das Skript (L) setzt die Zahlen – **vorübergehend**, bis das Skript steht; danach Feintuning wieder gemeinsam.

## 2. Edelsteine bei Zwischenbossen – L, 14.10.
**Konzept (L, mit Claude abgestimmt):**
- An Zwischenboss-Tagen kommt bei jedem Spieler ein Zwischenboss. Wer einen tötet, bekommt einen Edelstein in der Farbe des Turms, der ihn getötet hat. Wer zwei erledigt (weil ein anderer seinen durchlässt), bekommt zwei.
- Edelsteine lassen sich ohne Gebühr tauschen und verschenken. Ungleich verteilte Farben (z. B. wenig Quarz, weil Stein Fliegende schwer trifft) gleicht faires Tauschen aus.
- Steine je Element: Feuer **Rubin** · Eis **Saphir** · Schatten **Amethyst** · Stein **Quarz**.
- **Einsatz A – Turm-Fähigkeit:** Ein Turm bekommt mit einem Stein seines Elements eine besondere Fähigkeit, je Turm individuell (mehr Reichweite, schnellere Schüsse, neuer Effekt …). **Für alle 8 Türme je Element**, auch Turm 1, weil man nach den ersten Zwischenbossen oft noch keine hohen Türme hat. Arbeitsversion: eine Fähigkeit je Turm; später evtl. zwei zur Wahl (A/B).
- **Einsatz B – Umwandeln:** Ein Turm wird mit einem Stein eines anderen Elements in den Turm gleicher Nummer und Stufe dieses Elements umgewandelt. Der investierte Wert bleibt. So kommt z. B. Stein über umgewandelte Luftabwehr (Brandpfeil, Eiszapfen) auch an fliegende Bosse, und andere Elemente können ein Irrlicht nutzen.
- Irrlicht schießt nicht und tötet daher nie – es erzeugt selbst keine Steine.
- Verkauft man einen Turm, ist sein Stein weg.

**Technik (Claude):**
- „Wer hat getötet“ ist einfach: Der tödliche Treffer läuft durch `hit()` (kennt das Element des Turms), Tod durch Brennen ist immer Feuer. `kill()` bekommt das Element mit und zählt Boss-Kills je Element; die Auswertung schreibt die Steine ins Feld des Spielers.
- Neu im Feld je Spieler: Steinvorrat; je Turm: eingesetzte Fähigkeit.

**Entschieden (L, 14.10.):**
- Zwischenbosse geben kein Gold mehr, nur den Edelstein (ersetzt die Idee „Kopfgeld-Bonus für Zwischenbosse“). Bosse (Endboss, später bei 40/60 Runden auch Bosse dazwischen) geben Gold **und** Edelstein – beim letzten Boss nur noch als Erinnerungsstück.
- Vorhaut-Boss fällt weg → 23 Tage, 3 Zwischenbosse (Tag 6, 12, 18).
- Umwandeln: Geländekosten (Wald/Sumpf/Felsen) werden nicht nachgezahlt.

### Fähigkeiten – erster Entwurf (Claude, 14.10.)
Alle Zahlen sind Platzhalter fürs Balancing-Skript. Aufwand: **leicht** = nur Werte/vorhandene Effekte; **mittel** = neuer Baustein, der mehrfach genutzt wird (in Klammern). Einfrieren/Rückstoß wirken auf Bosse nur halb.

**🔥 Feuer – Rubin**
| Turm | Fähigkeit | Wirkung | Aufwand |
| --- | --- | --- | --- |
| 1 Funke | Zündschnur | Stirbt ein Monster durch einen Funke-Schuss (nicht durchs Brennen), explodiert es: Flächenschaden in 1 Feld und setzt in Brand | mittel (Tod-Auslöser) |
| 2 Glutbecken | Glutnest | Brand stapelt sich bis 2×: Heute zählt bei mehreren Bränden nur der stärkste; mit Glutnest addieren sich zwei Brände | leicht |
| 3 Flammenwerfer | Weite Flamme | Reichweite +50 % (Standard; Breitstrahl verworfen: Feuer setzt ohnehin fast alles in Brand) | leicht |
| 4 Brandpfeil | Feuerregen | Trifft auch Bodenmonster mit 50 % Schaden – sonst steht der Turm in Runden ohne Fliegende nutzlos herum | leicht |
| 5 Schwelbrand | Schwelglut | Monster, die durch Schwelbrand brennen, nehmen +15 % Schaden von allen Türmen | leicht |
| 6 Lavaturm | Lavapfütze | Einschlagstelle bleibt 4 s Lava: Schaden + Brennen. Mehrere Pfützen stapeln nicht (ein Monster in 2 Pfützen zählt einmal) | mittel (Bodenfeld) |
| 6 Lavaturm (Grundturm) | – | Vorschlag L: langsamer bei gleichem Schaden/s (z. B. 0,35 statt 0,7 Schüsse/s, doppelter Schaden je Schuss). Ändert den Turm für alle, auch ohne Stein – mit dem Balancing-Skript prüfen | leicht |
| 7 Phönix | Phönixflug | Geschoss springt nach dem Treffer aufs nächste Monster (60 %) | mittel (Sprung) |
| 8 Höllenfeuer | Fegefeuer | Brand wirkt auch auf feuer-immune Monster (50 %) | leicht |

**❄️ Eis – Saphir**
| Turm | Fähigkeit | Wirkung | Aufwand |
| --- | --- | --- | --- |
| 1 Frostsplitter | Zersplittern | Stirbt das Ziel, verlangsamt es alles in 1 Feld für 2 s | mittel (Tod-Auslöser) |
| 2 Schneeball | Großer Ball | Fläche +50 %, verlangsamt auch Fliegende | leicht |
| 3 Eiszapfen | Absturz | Getroffene Fliegende fallen 2 s zu Boden – dann treffen sie auch Bodentürme | mittel |
| 4 Frosthauch | Sprödes Eis | Ziele nehmen 25 % mehr Rüstungsschaden von allen Türmen | leicht |
| 5 Frostnova | Dauerfrost | Einfrieren 4,5 statt 3 s, trifft auch Fliegende | leicht |
| 6 Eisspeer | Durchbohren | Speer trifft bis zu 3 Monster in einer Linie | mittel (Sprung) |
| 7 Blizzard | Schneesturm | Dauerhaft: alle Monster in Reichweite 10 % langsamer, auch Fliegende | mittel (Aura) |
| 8 Ewiges Eis | Permafrost | Wer 3 s am Stück verlangsamt ist, friert 1 s ein | mittel |

**🌑 Schatten – Amethyst**
| Turm | Fähigkeit | Wirkung | Aufwand |
| --- | --- | --- | --- |
| 1 Schemen | Nachtsicht | Trifft nachtaktive Monster nachts auch ohne Irrlicht | leicht |
| 2 Irrlicht | Leuchtfeuer | Lichtkreis +50 %, verstärkt auch Türme anderer Elemente (×1,15) | mittel (Aura) |
| 3 Nachtauge | Seherblick | Zielt immer aufs Monster mit den meisten Leben, Reichweite +0,8 | leicht |
| 4 Fluchstein | Fluchwelle | Stirbt ein verfluchtes Monster, springt der Fluch auf 2 Nachbarn | mittel (Tod-Auslöser) |
| 5 Seelenfresser | Hunger | +3 % Schaden je Kill in dieser Welle (höchstens +45 %) | leicht |
| 6 Phantom | Geisterpfeile | Ignoriert 50 % Rüstung, auch ohne Irrlicht | leicht |
| 7 Leerenturm | Sog | Treffer ziehen das Ziel 0,5 Felder zurück | mittel |
| 8 Ewige Nacht | Finsternis | Fluch trifft alle Monster in 1 Feld ums Ziel | leicht |

**🪨 Stein – Quarz**
| Turm | Fähigkeit | Wirkung | Aufwand |
| --- | --- | --- | --- |
| 1 Kiesel | Prellstein | Springt nach dem Aufprall einmal weiter (50 %) | mittel (Sprung) |
| 2 Schleuder | Steilschuss | Trifft auch Fliegende (60 % Schaden) | leicht |
| 3 Felsbrocken | Erschütterung | 10 % Chance, 0,5 s zu betäuben | leicht |
| 4 Katapult | Weitwurf | Reichweite +1, Fläche +30 % | leicht |
| 5 Erdbeben | Nachbeben | Nach 1 s ein zweites Beben mit 50 % | mittel |
| 6 Granitwächter | Panzerbrecher | Rüstungsschaden ×2 | leicht |
| 7 Lawine | Geröll | Einschlagstelle 3 s lang: Monster dort 30 % langsamer | mittel (Bodenfeld) |
| 8 Bergkönig | Gipfelstoß | Betäubungschance +15 Prozentpunkte, wirkt auf Bosse voll | leicht |

**Standard-Fähigkeiten (L, 14.10.):** Es dürfen auch viele schlichte Verbesserungen dabei sein: doppelter Schaden, +50 % Reichweite, doppelte Schussrate. Bei Stein z. B.: Geschoss wird nicht geworfen, sondern schlägt direkt ein bzw. zielt dorthin, wo das Monster ankommt (Zielvorhersage). Beim weiteren Durchgehen schwache Spezial-Fähigkeiten durch Standards ersetzen.

**Weitere Idee (L):** „Explosion bei Tod durch Brennen“ – nur für langsam schießende Türme, nicht zwingend Feuer.

Gedanken dahinter: Jede Fähigkeit ändert, *wie* der Turm spielt, nicht nur *wie stark*. Einige verbinden Elemente (Absturz hilft Stein gegen Fliegende, Sprödes Eis hilft Stein, Leuchtfeuer hilft allen). 18 sind leicht, 14 nutzen 5 neue Bausteine (Tod-Auslöser, Bodenfeld, Sprung, Aura, Einzelfälle) – mit den Bausteinen kommt der Rest schnell.

**Offen:**
- Fähigkeiten-Entwurf prüfen: Feuer durchgesehen und bestätigt (L, 14.10.), Eis/Schatten/Stein noch offen.
- Darstellung: Woran sieht man am Turm, dass er eine Fähigkeit hat?
