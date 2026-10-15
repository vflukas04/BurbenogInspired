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

## 2. Edelsteine bei Zwischenbossen – L, 14.10. – **umgesetzt in VERSION 2026-10-14c**
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
| 1 Frostsplitter | Zersplittern | Tod durch Schuss: Explosion mit Schaden + Verlangsamung in 1 Feld (gleicher Baustein wie Zündschnur). Verlangsamung stapelt nicht – Wert liegt darin, dass Nachbarn überhaupt verlangsamt werden (T1 trifft sonst nur ein Ziel) | mittel (Tod-Auslöser) |
| 2 Schneeball | Großer Ball | Fläche +50 %, verlangsamt auch Fliegende | leicht |
| 3 Eiszapfen | Absturz | Getroffene Fliegende fallen 2 s zu Boden und sind dort langsamer. Nutzen für Eis selbst: Am Boden wirken alle Eis-Verlangsamungen, Frostnova und Ewiges Eis treffen. Variante auch für einen Stein-Turm, der Fliegende trifft (offen) | mittel |
| 4 Frosthauch | Haut vereist | 4 s lang wirkt Rüstungsschaden aller Türme zusätzlich auf die Leben (starke Kombi mit Stein, Rüstungsschaden ×1,5) | leicht |
| 5 Frostnova | Dauerfrost | Einfrieren 4,5 statt 3 s, trifft auch Fliegende | leicht |
| 6 Eisspeer | Durchbohren | Speer fliegt in gerader Linie über die ganze Karte und trifft alles darauf. Zielt bevorzugt so, dass die Linie möglichst viele Monster trifft. Lohnt sich an Enden gerader Wegstücke – Platzierungsrätsel | mittel |
| 7 Blizzard | Großer Sturm | Fläche +50 %, 8 statt 5 Geschosse (Standard) | leicht |
| 8 Ewiges Eis | Eisblock | Treffer auf bereits verlangsamte Monster frieren sie 0,5 s ein (Bosse 0,25 s). Schussabstand 2 s → Stop-and-go | leicht |

**🌑 Schatten – Amethyst** (final, L 15.10., VERSION 2026-10-15d)
| Turm | Fähigkeit | Wirkung |
| --- | --- | --- |
| 1 Schemen | Angst | 10 % je Treffer: Monster läuft 1,5 s rückwärts (Bosse halb). Von Nachtauge hierher getauscht, damit es früh verfügbar ist |
| 2 Irrlicht | Mottenplage | Motten im Lichtkreis treffen bis zu 3 Monster, 2× je Sekunde; Schaden wächst mit der Stufe (Stufe 1: 4,7/s je Monster). Irrlicht kann damit selbst Bosse töten (Amethyst). Ersetzt Leuchtfeuer (andere Elemente im eigenen Feld sind selten) |
| 3 Nachtauge | Nachtjäger | Schussrate ×1,5 und trifft nachtaktive Monster nachts ohne Irrlicht |
| 4 Fluchstein | Fluchwelle | stirbt ein so verfluchtes Monster, springt der Fluch auf 2 Nachbarn (Kette). Flüche stapeln sonst nicht |
| 5 Seelenfresser | Hunger | +20 % je Kill dieses Turms in der Welle, höchstens +200 %. Zählt nur letzte Treffer → hinten am Weg platzieren. Welle oder Tag: testen (L tendiert zu Welle) |
| 6 Phantom | Geisterpfeile | ignoriert die ganze Rüstung, auch ohne Irrlicht |
| 7 Leerenturm | Todesstoß | 3 % je Treffer Sofort-Tod, Bosse −5 % Leben |
| 8 Ewige Nacht | Tiefe Nacht | Fluch addiert sich zu anderen Flüchen (bis +200 %). Ersetzt Finsternis (kaum Mehrwert, da ohnehin fast alles verflucht) |

**🪨 Stein – Quarz** (final, L 15.10.)
| Turm | Fähigkeit | Wirkung |
| --- | --- | --- |
| 1 Kiesel | Prellstein | hüpft an derselben Stelle nach 0,4 s und 0,8 s nach (60 % / 30 %) – Nachfolgende laufen in die Mitte |
| 2 Schleuder | Steilschuss | trifft Fliegende mit vollem Schaden |
| 3 Felsbrocken | Erschütterung | 10 % je getroffenem Monster: 2 s betäubt (Bosse 1 s) |
| 4 Katapult | Weitwurf | Reichweite +2 Felder, Fläche +20 % |
| 5 Erdbeben | Nachbeben | 1 s später zweites Beben, 50 %, gleicher Radius |
| 6 Granitwächter | Flügelbruch | 10 % je Treffer (Bosse 5 %): Flieger stürzt ab, bis Wellenende am Boden und 30 % langsamer (beim Nachbarn fliegt er wieder). Unterschied zu Eiszapfen: selten, aber dauerhaft |
| 7 Lawine | Geröll | Einschlagstelle bremst 3 s um 30 % |
| 8 Bergkönig | Gipfelstoß | Betäubungschance +15 Prozentpunkte |

**Wurfgeschwindigkeit (L, 15.10.):** Mittelwert aus heute/A/B = Korridor: bisheriger Wert, aber mindestens so schnell, dass Tempo-1,4-Monster bei voller Reichweite am Rand getroffen werden, höchstens so schnell wie für Tempo 1,8 nötig. Ergebnis: Kiesel, Schleuder, Schneeball unverändert; Katapult schneller (5,3); Felsbrocken, Granitwächter, Lawine, Bergkönig, Lavaturm, Blizzard langsamer (Flugzeit bis 1,4 s beim Bergkönig). Schadenskurve der Fläche im Balancing-Skript prüfen.

**Standard-Fähigkeiten (L, 14.10.):** Es dürfen auch viele schlichte Verbesserungen dabei sein: doppelter Schaden, +50 % Reichweite, doppelte Schussrate. Bei Stein z. B.: Geschoss wird nicht geworfen, sondern schlägt direkt ein bzw. zielt dorthin, wo das Monster ankommt (Zielvorhersage). Beim weiteren Durchgehen schwache Spezial-Fähigkeiten durch Standards ersetzen.

**Fähigkeit frei wählbar (F, 15.10., VERSION 2026-10-15e):** Mit dem Stein wählt man eine der 8 Fähigkeiten des Elements für **einen beliebigen Turm** des Elements (vorher: Turmnummer = Fähigkeit). Damit jede Fähigkeit auf jedem Turm etwas tut, wurden einige angepasst:
- Feuerregen: Luftabwehr trifft auch Boden, Bodenturm (Glutbecken, Lavaturm) auch Fliegende, jeweils halber Schaden; gesperrt bei Türmen, die schon beides treffen.
- Lavapfütze: Schaden/s = 0,2 × Turm-Schaden/s (15.10. F: vorher 0,4), mindestens kleiner Kreis (0,9 Felder), auch ohne Fläche. Großer Ball: ohne Fläche kleine Fläche (0,6). Großer Sturm: +60 % Geschosse (mindestens +1) statt „8 Geschosse“; Frostnova 50 % öfter. Durchbohren: Frostnova wird zum Speer.
- Absturz und Flügelbruch: Turm trifft zusätzlich Fliegende. Steilschuss: gesperrt bei Türmen, die Fliegende schon treffen.
- Mottenplage: Radius = Lichtkreis (Irrlicht) oder 1,6 Felder. Irrlicht kann nur Mottenplage bekommen (schießt nicht).
- Erschütterung: +10 Punkte Betäubungschance, mindestens 2 s. Gipfelstoß: +15 Punkte (ohne Betäubung 1,5 s). Nachbeben und Prellstein wirken auch bei Wurf-/Beben-Türmen, Geröll auch beim Erdbeben.
Offen: Balance (starke Fähigkeit auf billigem Turm, z. B. Hunger oder Geisterpfeile auf Turm 1).

**Weitere Idee (L):** „Explosion bei Tod durch Brennen“ – nur für langsam schießende Türme, nicht zwingend Feuer.

Gedanken dahinter: Jede Fähigkeit ändert, *wie* der Turm spielt, nicht nur *wie stark*. Einige verbinden Elemente (Absturz hilft Stein gegen Fliegende, Sprödes Eis hilft Stein, Leuchtfeuer hilft allen). 18 sind leicht, 14 nutzen 5 neue Bausteine (Tod-Auslöser, Bodenfeld, Sprung, Aura, Einzelfälle) – mit den Bausteinen kommt der Rest schnell.

**Umsetzung 14.10. (Claude, Entscheidungen für den Test):** Todesstoß 3 % (Bosse −5 % Leben statt Sofort-Tod), Angst 10 %/1,5 s, Fluchwelle springt weiter (Kette), Absturz nur Eiszapfen (Stein-Variante offen), Lavapfütze 40 % des Turm-Schadens/s, Weitwurf Reichweite +2 Felder, Umwandeln löscht eine eingesetzte Fähigkeit. Alle Werte stehen in `gemMods` in `index.html`.

**Offen:**
- Alle vier Listen durchgesprochen (L, 15.10.). Offen: Idee F „Fähigkeit frei wählbar“ (siehe TODO).
- Darstellung: Woran sieht man am Turm, dass er eine Fähigkeit hat?

## Edelsteine = kleiner Buff (F, 15.10., 2026-10-15g)
Richtwert: eine Fähigkeit bringt ≈ +15 % (Tag 5: +1 Kill bei 6–7). Gedämpft: Eis Großer Ball/Sturm, Eisblock 0,35 s, Haut vereist 3 s, Schatten Nachtjäger ×1,25, Stein Prellstein [0,3/0,15], Reichweite +0,5 Felder/Fläche +10 %, Nachbeben 0,25. Messung grob, bitte im echten Spiel prüfen.
