# Grafik (Stand 17.10., L)

## Entscheidungen
- **Türme** bleiben Kenney (CC0), wie bisher.
- **Monster** werden mit KI erzeugt (Krea 2/3 auf krea.ai). Illustrious (Civitai) und die getesteten LoRAs passten nicht (zu eigenwillig, Pixelart oder nur Menschen).
- **Lizenz:** Krea erlaubt kommerzielle Nutzung je nach Plan; Krea kann Regeln ändern. Wir starten so; falls wir das Spiel veröffentlichen, wird das Paket ggf. neu erzeugt. Deshalb: Bilder austauschbar einbauen, Prompts hier sammeln, Herkunft (Modell, Datum) je Bild notieren.
- **Perspektive:** von schräg oben (ca. 45°), passend zur Draufsicht der Karte. Je Monster 3 Bilder: Seite (Blick rechts, im Spiel gespiegelt für links), von vorne (läuft nach unten), von hinten (läuft nach oben). Gehen = leichtes Wippen/Stauchen im Code, keine Animationsbilder.
- Getestet mit dem Fuchs: Ansichten aus *einem* Modell mit *gleicher* Kamerahöhe passen gut zusammen. Referenzbilder in Krea waren zu stark (zweiköpfige Füchse) → lieber ohne Referenz, gleiche Farbangaben im Text.
- Freistellen: weißer Hintergrund wird automatisch entfernt (Flutfüllung von den Ecken).

## Prompt-Vorlage (Krea, 1:1)
Seite:
```
Isometric game sprite of a single [TIER + FARBEN] walking to the right, high angle view from above, we see its side and its back from above, the far legs are partly hidden behind the body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, thin dark outline, isolated on a plain white background, no shadow, no ground, no text.
```
Vorne:
```
Isometric game sprite of a single [TIER + FARBEN] walking towards the viewer and slightly down, high angle view from above, we see the top of its head, its face, its back foreshortened behind the head, flat vector style like a mobile strategy game unit, simple shapes, soft colors, thin dark outline, isolated on a plain white background, no shadow, no ground, no text.
```
Hinten:
```
Isometric game sprite of a single [TIER + FARBEN] walking away from the viewer and slightly up, high angle view from above, we see its back from above, the tail in front, the back of the head behind, face not visible, flat vector style like a mobile strategy game unit, simple shapes, soft colors, thin dark outline, isolated on a plain white background, no shadow, no ground, no text.
```
Beispiel `[TIER + FARBEN]`: `red fox with orange fur, white chest, dark brown legs and a bushy tail with white tip`.

## Nächste Schritte
1. Zweites Tier (z. B. Maus) mit der Vorlage testen – hält der Stil?
2. Einbau: Bilder in `assets/monster/<name>-seite|vorne|hinten.png`, fehlt ein Bild → Emoji; Wippen; Blickrichtung aus der Laufrichtung.
3. Danach alle Monster der Reihe nach (Bosse größer, Fliegende ggf. nur Draufsicht).
