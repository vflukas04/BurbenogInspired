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

**Offen:**
- Die 32 Fähigkeiten entwerfen (Claude macht einen ersten Vorschlag).
- Ersetzt das den „Kopfgeld-Bonus für Zwischenbosse“ (Idee F, 13.10.)?
- Umwandeln: Geländeaufschlag (Stein auf Felsen +30 Gold) nachzahlen oder entfällt er?
