# Grafik (Stand 21.10., L)

## Entscheidungen
- **Türme** bleiben Kenney (CC0), wie bisher.
- **Monster** werden mit KI erzeugt (Krea 2/3 auf krea.ai). Illustrious (Civitai) und die getesteten LoRAs passten nicht (zu eigenwillig, Pixelart oder nur Menschen).
- **Lizenz:** Krea erlaubt kommerzielle Nutzung je nach Plan; Krea kann Regeln ändern. Wir starten so; falls wir das Spiel veröffentlichen, wird das Paket ggf. neu erzeugt. Deshalb: Bilder austauschbar einbauen, Prompts hier sammeln, Herkunft (Modell, Datum) je Bild notieren.
- **Perspektive:** von schräg oben (ca. 45°), passend zur Draufsicht der Karte. Je Monster 3 Bilder: Seite (Blick rechts, im Spiel gespiegelt für links), von vorne (läuft nach unten), von hinten (läuft nach oben). Gehen = leichtes Wippen/Stauchen im Code, keine Animationsbilder.
- Getestet mit dem Fuchs: Ansichten aus *einem* Modell mit *gleicher* Kamerahöhe passen gut zusammen. Referenzbilder in Krea waren zu stark (zweiköpfige Füchse) → lieber ohne Referenz, gleiche Farbangaben im Text.
- Freistellen: weißer Hintergrund wird automatisch entfernt (Flutfüllung von den Ecken).

## Stand 18.10.: eingebaut
- Modell: **Krea 3 auf Civitai** (txt2img + img2img-Edit), 17./18.10. Ansichten je Monster in `assets/monster/<name>-seite|vorne|hinten.png`, freigestellt (Flutfüllung vom Rand), 192 px.
- Im Spiel (`MONSTER_IMG` in `index.html`): Besoffene Penner, Uffug (Boss), Mehlmottenraupen (Raupe; Kokon = Raupe mit weißer Hülle; Motte im Flug), Betty (Boss). Ansicht nach Laufrichtung, Seite nach links gespiegelt, leichtes Wippen. Fehlt ein Bild → Emoji.
- Gewählte Bilder (Civitai-Datei-Anfang): Penner cfadda41 / 4d325694 / 58430d4f · Uffug cfddba46 / 432c7240 / 999c1ea8 · Raupe d7eeacb9 / 927bbc60 / 17aa92be · Motte 41f955d6 / 5e2bcfaf / c8754065 · Betty ee4cfb5d / 4759880c / 22aacaff.
- Figuren über Kleidung, Haltung, Requisiten beschreiben, **nicht über Herkunft oder Hautfarbe** (öffentliches Spiel; Edits an der Hautfarbe kosteten außerdem viele Versuche und Farbstiche).

## Stand 21.10.: alle Monster eingebaut
- Alle Monster haben Bilder (Krea 3 auf Civitai, 19.–21.10.). Zwischenbosse nutzen die Bilder ihres Monsters, Varianten (z. B. Reiter/Reittier) haben eigene. Auswahl und Dateinamen ab Runde 21 im Claude-Projekt (Überraschung für F).
- Fehlt eine Ansicht (z. B. Asseln und Dachse von hinten, Füchse von hinten), nimmt das Spiel die Seitenansicht (`MIMG[...] = null` vorbelegt). Alle Bilder werden beim Start geladen (`preloadMonsterImgs`).
- 21.10. (21c): Bilder neu aus den Originalen erzeugt: Seitenansicht fliegender Monster waagerecht gedreht (vor dem Verkleinern, kein Qualitätsverlust); Vorder-/Rückansichten, deren Fläche mehr als 1,25× über dem Median der drei Ansichten liegt, verkleinert (min. ×0,6, Seite nie), damit Monster in Kurven nicht springen. Fehlende Rückansicht der Asseln = Vorderansicht gespiegelt.
- 21.10. (21b): Zeichengröße `r * 3.2` (vorher 2,5), Trefferreaktion (weiße Silhouette `whiteOf` + kleiner Rückstoß, `m.hitT` aus `hit`, nur Anzeige).
- Erstes **Laufbild**: Betty (Endboss) hat 8 Laufbilder für die Seitenansicht (`betty-lauf-0..7.png`, aus einem Krea-Video, `MONSTER_ANIM` = [Anzahl, Bilder/s]). Andere Monster wippen weiter.
- Bilder auf 128 Farben verkleinert (alle zusammen ca. 0,9 MB).
- Gewählt Runde 1–20 (Datei-Anfang Seite/Vorne/Hinten): siehe Claude-Projekt „Grafik-Prompts (alle Monster)“; Auswahl nach Perspektive (Blick rechts, Kamera leicht von oben) und gleicher Figur über alle Ansichten.
- Gelernt: Bei Menschen kippt die Kamera im Edit oft in reine Draufsicht; „hinten“ brauchte die meisten Versuche. Bekannte Figuren (Film/Serie) nicht nachbauen lassen, auch nicht über Hut + Brille + Bart: lieber eine eigene Figur.

## Erkenntnisse aus den Metadaten (17./18.10.)
1. Erst **Seite per txt2img**, dann die anderen Ansichten per **Edit** („The same …, same style. …“). Hält die Figur stabil; getrennte txt2img-Bilder ergaben verschiedene Tiere.
2. „walking **directly** to the right … seen from the side and slightly from above“ gibt saubere Profile zum Spiegeln. „Isometric … we see side and back from above“ gab schräge Posen.
3. **Eine Änderung je Edit** („Only add a bottle of beer into his right hand.“ klappte sofort). Mehrere Änderungen auf einmal färbten das ganze Bild.
4. Menschen werden malerischer als Tiere → „cel shading with two tones“ ergänzen (noch nicht getestet).
5. „pure white background“, weil einzelne Bilder grauen Hintergrund hatten (stört das Freistellen).
6. Die Straße ist braun: braune Monster brauchen farbige Akzente oder die dunkle Kontur.

## Alte Prompt-Vorlage (Krea, 17.10.)
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

## Prompts für die nächsten Monster (18.10., aus den Erfahrungen vom 17./18.10.)
Ablauf je Monster: 1. Seite per txt2img (Krea 3, 1:1). 2. Das beste Seitenbild als Vorlage, dann Vorne und Hinten per Edit. 3. Bei Abweichungen nur **eine** Änderung je Edit.

**Silberfische**
```
Game sprite of a single silverfish insect with a long tapered silvery-grey scaly body, three long tail bristles and long thin antennae, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same insect, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same insect, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Kellerasseln**
```
Game sprite of a single woodlouse with a dark slate-grey segmented shell with pale edges and many short legs, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same woodlouse, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same woodlouse, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Nacktschnecken**
```
Game sprite of a single bright orange slug without a shell, glossy body, two eye stalks on its head, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same slug, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same slug, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Ohrenkneifer**
```
Game sprite of a single earwig with a glossy reddish-brown body, pale yellow legs and large curved pincers at its tail end, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same earwig, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same earwig, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Mäuse**
```
Game sprite of a single small grey house mouse with large pink ears, pink feet and a long thin pink tail, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same mouse, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same mouse, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Kleine Hunde**
```
Game sprite of a single small white terrier dog with a brown patch over one eye, a red collar and a short upright tail, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same dog, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same dog, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Ratten**
```
Game sprite of a single large dark grey rat with scruffy fur, small red eyes and a long bare pink tail, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same rat, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same rat, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Katzen**
```
Game sprite of a single ginger tabby cat with white paws, sneaking low with its tail raised, walking directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same cat, same style. It walks directly towards the viewer. Seen slightly from above.
```
```
The same cat, same style. It walks directly away from the viewer - up. Seen slightly from behind and above.
```

**Spatzen**
```
Game sprite of a single house sparrow with spread wings, brown back with dark streaks, grey cap and black bib, flying directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same bird, same style. It flies directly towards the viewer. Seen slightly from above.
```
```
The same bird, same style. It flies directly away from the viewer - up. Seen from behind and above, wings spread.
```

**Habichte**
```
Game sprite of a single goshawk with wings fully spread, slate-grey back, white chest with fine grey barring and yellow feet, flying directly to the right, seen from the side and slightly from above, full body, flat vector style like a mobile strategy game unit, simple shapes, soft colors, cel shading with two tones, thin dark outline, isolated on a pure white background, no shadow, no ground, no text.
```
```
The same bird, same style. It flies directly towards the viewer. Seen slightly from above.
```
```
The same bird, same style. It flies directly away from the viewer - up. Seen from behind and above, wings spread.
```


## Laufbilder (Weg 1, seit 23.10., F; mit L abgestimmt)
- Ziel: Seitenansicht mit echten Beinschritten, 4 Bilder je Monster, zuerst nur Hund, Ratte, Katze, Fuchs (sichtbare Beine). Vorne/hinten bleiben beim Wippen (`m.ph`, Schrittphase aus der Strecke).
- Bauen: Video (oder Einzelbilder) auf weißem Hintergrund erzeugen, genau ein Schrittzyklus, dann `python3 tools/lauf.py <name> <video|ordner> --n 4 --von <s> --bis <s>` (z. B. `hund`). Es entstehen `assets/monster/<name>-lauf-0..3.png` (192 px, freigestellt, 128 Farben, gleicher Ausschnitt und Fußlinie).
- Einbauen: in `index.html` `MONSTER_ANIM = { betty:[8, 8], hund:[4, 6] }` (Anzahl, zweiter Wert ungenutzt). Das Bild folgt der Schrittphase: steht das Monster, steht das Bild. Fehlt ein Laufbild, zeigt das Spiel die Seitenansicht.
- Videoprompt-Vorschlag (Krea): „The same <Tier> as in the reference image, walking directly to the right in a seamless loop, one full walking cycle, side view slightly from above, plain white background, camera static, no zoom.“ Nur einen Schrittzyklus nehmen, die Ränder müssen ineinander übergehen.


## Türme der Schräg-Ansicht (26.10., F)
- Selbst gezeichnete Vektor-Bilder (kein KI-Bild), freistehend ohne Sockel, Fußpunkt unten in der Feldmitte, Größe wächst mit der Turmnummer (`u` in `drawTower25`). Aufsatz dreht sich nicht.
- Fertig (26d): alle vier Elemente, `assets/turm/<feuer|eis|schatten|stein>-<1..8>.png` (88×102-Raster, Fuß bei y=92). Quelle: `tools/turm/tuerme.html` (SVG-Zeichnungen je Turm), Erzeugung `tools/turm/bilder.js`; `TOWER_H` in `index.html` = Höhe über dem Fuß (Ausgabe des Skripts). Eigene Zeichnungen, keine bekannten Figuren nachzeichnen.
- Umbenennungen im Spiel (26d): Glumanda (vorher Glutbecken), Feuerteufel (Schwelbrand), Schneekönig (Frosthauch), Onyx (Felsbrocken).

**Bewegliche Teile (26i, F):** In `tools/turm/tuerme.html` sind die bewegten Teile eines Turms mit `<g data-p="n">` markiert. `node tools/turm/bilder.js tools/turm/tuerme.html` (Playwright, im Repo-Hauptordner) schreibt das Grundbild ohne Teile (`<element>-<nr>.png`) und je Teil `<element>-<nr>p<n>.png` im selben Raster. In index.html: `PARTN` (Anzahl Teile je Turm, muss zum Generator passen), `PARTS` (Drehpunkt und Bewegung je Teil), gezeichnet in `drawTower25`. Neuer Turm oder neues Teil: Markierung setzen, Bilder neu erzeugen, `PARTN` und `PARTS` ergänzen.
