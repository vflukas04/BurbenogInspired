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
**Konzept (L):**
- Wer einen Zwischenboss tötet, bekommt einen Edelstein in der Farbe des Turms, der den Boss getötet hat. Nur dieser Spieler. Wer zwei Bosse erledigt (weil ein anderer seinen nicht schafft), bekommt zwei.
- Edelsteine lassen sich ohne Gebühr tauschen und verschenken.
- Steine je Element (Vorschlag): Feuer **Rubin** · Eis **Saphir** · Schatten **Amethyst** · Stein **Bernstein** (passt zu den Element-Farben).
- **Einsatz A – Turm-Fähigkeit:** Ein Turm bekommt mit einem Stein seines Elements eine besondere Fähigkeit, je Turm individuell (mehr Reichweite, schnellere Schüsse, neuer Effekt …). Offen: je Turm eine Option (Arbeitsversion) oder zwei zur Wahl (A/B).
- **Einsatz B – Umwandeln:** Ein Turm wird mit einem Stein eines anderen Elements in den Turm gleicher Nummer und Stufe dieses Elements umgewandelt.

**Anmerkungen und offene Fragen (Claude):**
- **Menge:** 4 Zwischenbosse = höchstens 4 Steine im ganzen Spiel (nicht je Spieler). Der Stein von Tag 23 hilft nur noch für den Endboss. Bei 3–4 Spielern sehr knapp. Idee: Boss lässt so viele Steine fallen, wie es Spieler gibt – alle in der Farbe des tötenden Turms, alle an den Töter (verteilt wird per Tausch).
- **Wer hat getötet:** Kills werden heute nur je Feld gezählt. Solange jeder nur ein Element hat, ist Feld = Element. Nach Umwandlungen muss das Element des tötenden Turms (bzw. des Brandes) mitgespeichert werden.
- **Stein-Edelsteine werden selten:** Vorhaut-Boss fliegt, Stein trifft Fliegende nur mit Turm 4/6/8.
- **Umwandeln:** Schatten-Türme brauchen Irrlichter; Irrlicht (Schatten T2) schießt nicht selbst – Umwandlung von/nach T2 klären. Bleibt die investierte Gold-Summe gleich? Gilt der Geländeaufschlag (Stein auf Felsen +30)?
- **Fähigkeiten:** 32 Türme × 1 Option ist viel Arbeit. Vorschlag: Türme 3–6 zuerst (die hat man zur Zeit der Bosse), Rest später.
- **Verkaufen:** Geht der Stein mit dem Turm verloren oder kommt er zurück?
- Ersetzt den „Kopfgeld-Bonus für Zwischenbosse“ (Idee F, 13.10.)?
