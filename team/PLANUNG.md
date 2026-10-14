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
- Aufteilung mit F bestätigen: F meldet Spielgefühl, das Skript (L) setzt die Zahlen.

## 2. Edelsteine bei Zwischenbossen – L, 14.10.
**Ziel:** Zwischenbosse (Tag 6, 12, 18, 23) lassen Edelsteine fallen, die man sammelt. Vorschlag folgt von L.

**Offene Fragen für den Vorschlag:**
- Wofür sind sie? z. B. in Türme einsetzen (Element-Effekt verstärken), Forschung freischalten, besondere Türme, einmalige Fähigkeiten.
- Wer bekommt sie? Wer den Boss tötet, alle, oder die Gemeinschaftskasse? Gibt es einen, wenn der Boss durchbricht?
- Eine Sorte oder je Element/Boss eine eigene Farbe?
- Tauschbar/schenkbar wie Gold?
- Bezug: ersetzt oder ergänzt den „Kopfgeld-Bonus für Zwischenbosse“ (Idee F, 13.10., `IDEEN.md`).
