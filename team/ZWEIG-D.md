# Zweig D – deterministisches Balancing (L, ab 24.10.)

Eigener Zweig, wird **nicht** mit der C-Kette (`spiegel-C*.json`) vermischt, solange er nicht überzeugt. Dateien: `tools/balance/d/`, Spiegel `tools/balance/spiegel-D*.json`.

## Idee (L)
- **Grundturm:** keine Effekte, alle gleiche Schussrate und Reichweite, Schaden/Schuss ∝ Gold. Schon ausdifferenziert nach Turm (Treppe, höhere Türme etwas mehr je Gold) und Upgrades (0,9/1,0/1,1/1,2/1,3).
- **Wechselkurse:** Jede Abweichung vom Grundturm wird mit Schaden/Schuss bezahlt (oder bekommt mehr, z. B. nur Fliegende / keine Fliegende): Schussrate, Reichweite, Fläche, Brennen, Bremsen/Frieren, Fluch, Stein-Rüstungsschaden. Pro Merkmal **ein Übersetzungsfaktor** (bzw. eine kleine Kurve), den der Bot später nachjustiert – statt jeden Turm einzeln.
- **Zielbild:** die heutigen Türme. Sie werden über die Wechselkurse so beschrieben, dass sie ihnen möglichst entsprechen (das neue Balancing wird trotzdem spürbar). Sondertürme (Irrlicht, Frostnova, Nacht, Stein-Luftabwehr) erst am Ende, wenn der Rest stabil ist.
- **Monster:** Leben, Rüstung, Tempo in Relation zum bis dahin verdienten Gold. Sondereffekte (Blinken, Teleport, Herz, Reiter …) möglichst in Tempo/Leben übersetzen. Fliegend: vermutlich über die Turmfaktoren abgedeckt. Immunität nur mit festem Aufschlag, wenn nicht ein Partner entsprechend profitiert.
- **Faktoren:** nach Block wachsend wie in C9 (Bonus 1,10 … 1,45, Malus 0,90 … 0,55).

## Merkmale und Messweg
| Merkmal | Übersetzung (Ansatz) | Messung |
|---|---|---|
| Schussrate | Schaden/s gleich, aber Überschuss: hoher Schaden/Schuss verschwendet mehr an fast toten Monstern (L) → Faktor > 1 für langsame Türme nötig | echte Leben, Wellen aller Tage |
| Reichweite | Wirkzeit ≈ Wellendauer + abgedeckte Wegstrecke ÷ Tempo (Hypothese, siehe unten) | D2a (Wegstrecke, fertig) + Simulation |
| Fläche | Treffer je Wurf × Rand-/Mittelanteil, hängt am Monsterabstand | Simulation, normaler Abstand und Schwarm |
| Bremsen/Frieren | relative Zusatzschüsse je Wegstück für die anderen Türme: 1 ÷ (1 − Bremsung) im gebremsten Anteil | Simulation mit Bezugstürmen |
| Fluch | +Schaden für alle Türme × Anteil der verfluchten Zeit, Rüstung − | Simulation mit Bezugstürmen |
| Brennen | Brennschaden × Dauer (eigene Map + Partner), gedeckelt durch Stapelung | Simulation, Anteil eigene/Partner-Map |
| Stein-Rüstungsschaden | entfernte Rüstungspunkte × Wert der Rüstung für alle Türme | Simulation |
| nur / keine Fliegende | Aufschlag auf Schaden/Schuss (bisher +50 % / +10 %) | Fliegertage / übrige Tage |

## D2a Reichweite ↔ Wegstrecke (24.10., `d/reichweite.js`)
Mittel der 5 besten Bauplätze (≥ 2 Felder auseinander), Maps 0–3 als Wiese:

| Reichweite (Felder) | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|
| Wegstrecke (Felder) | 6,7 | 11,5 | 15,8 | 22,5 | 29,7 | 37,9 |

Im Bereich der Türme (3–7) wächst die Wegstrecke etwa mit Reichweite^1,4 (lokal 1,0–1,6). Die Maps unterscheiden sich kaum (±5 %).
**Wichtig [Hypothese]:** Bei 20 Monstern im Abstand 0,9 s ist meist mehr als ein Monster in Reichweite – ein Turm schießt dann ohnehin ununterbrochen. Reichweite bringt dann nicht „mehr Schüsse je Monster“, sondern vor allem längere **Wirkzeit** je Welle (vorne früher, hinten länger) und mehr Zeit für Nachzügler/Leaks. Erwarteter Wert ≈ (Wellendauer + Wegstrecke ÷ Tempo) – deutlich flacher als die Wegstrecke selbst. Muss per Simulation geprüft werden.

## D2 Wechselkurse Rate, Geschosse, Reichweite, Fläche (24.10. früh, `d/kurse.js`)
Grundturm: Rate 1, Reichweite 4, 1 Geschoss, 70 Gold, Budget des Tages ganz in diesem Turm, echte Leben, 10-Uhr-Welle, alle Nicht-Flieger-Tage ohne Bosse, Maps 0–3. Wert relativ zum Grundturm bei **gleichem Schaden/s** (Wert > 1 = Merkmal ist etwas wert, Schaden/s müsste um diesen Faktor sinken):

| Merkmal | Runde 1–10 | 11–20 | 21–30 | 31–40 | Mittel |
|---|---|---|---|---|---|
| Rate ×0,35 | 0,29 | 1,00 | 1,03 | 1,05 | 0,75 |
| Rate ×0,5 | 0,87 | 1,03 | 1,04 | 1,05 | 0,99 |
| Rate ×2 | 0,99 | 0,96 | 0,96 | 0,95 | 0,96 |
| Rate ×4 | 1,01 | 0,96 | 0,96 | 0,94 | 0,97 |
| 2 Geschosse | 1,01 | 0,98 | 0,97 | 0,93 | 0,98 |
| 3 Geschosse | 0,98 | 0,94 | 0,91 | 0,83 | 0,91 |
| Reichweite 3 | 0,97 | 0,97 | 0,89 | 0,86 | 0,92 |
| Reichweite 5 | 1,09 | 1,04 | 1,05 | 1,14 | 1,08 |
| Reichweite 6 | 1,11 | 1,09 | 1,12 | 1,23 | 1,14 |
| Reichweite 7 | 1,07 | 1,10 | 1,16 | 1,28 | 1,15 |
| Fläche 0,5 | 0,84 | 0,85 | 0,86 | 0,80 | 0,84 |
| Fläche 1 | 0,92 | 0,92 | 0,93 | 1,01 | 0,94 |
| Fläche 1,5 | 1,21 | 1,33 | 1,47 | 1,47 | 1,37 |
| Fläche 2 | 1,74 | 1,78 | 1,85 | 1,84 | 1,80 |

Deutung:
- **Rate** ist bei gleichem Schaden/s fast neutral (±5 %). Ausnahme: sehr langsame Türme am Anfang (Rate ×0,35 in Runde 1–10: 0,29) – Überschuss an schwachen Monstern, wie L vermutet. Schnelle Türme sind leicht schlechter (0,95), Ursache offen [Vermutung: Flugzeit/Zielwechsel].
- **Reichweite** ist viel flacher als die Wegstrecke (Hypothese bestätigt): etwa Wert ≈ (Reichweite ÷ 4)^0,3, sättigt ab 6–7, wächst in späten Runden etwas (Leaks/lange Wellen).
- **Fläche** ist nicht linear: kleine Fläche (0,5–1) ist **schlechter als keine** (Würfe landen dort, wo das Ziel beim Abschuss war, und verfehlen), ab 1,5 deutlich mehr wert (×1,4–1,8). Das trifft heute alle Türme mit kleiner Fläche.
- Gemessen bei Reserve ≈ 0,4 (Grundturm ohne Boni); bei höherer Reserve kann sich der Überschuss-Effekt verschieben → später mit Reserve ≈ 1,3 wiederholen.

## D2b Effekte (24.10. früh, `d/effekte.js`, Kontext schwach: Reserve 0,2)
Kontext: Budget in Grundtürmen, ⅓ ersetzt durch Effekt-Türme mit gleichem Schaden/s, Faktoren je Element neutral, Rüstungsschaden aus, 17 Tage × Maps 0/2. Wert relativ zum Kontext ohne Effekt:

| Effekt | Wert |
|---|---|
| Bremsen 20 % 2 s / 35 % 2 s / 35 % 4 s / 50 % 4 s | 0,99 / 0,99 / 1,00 / 1,05 |
| Fluch 10 % 4 s / 20 % 4 s / 20 % 8 s / 35 % 8 s | 1,13 / 1,25 / 1,27 / 1,43 |
| Brennen 15 % 3 s / 30 % 3 s / 30 % 6 s / 15 % ganzer Tag | 1,08 / 1,16 / 1,24 / 1,04 |

Deutung (vorläufig): Fluch ≈ 1 + 1,2 × Fluchwert (wirkt auf alle Türme, Dauer kaum wichtig). Brennen ≈ 1 + Stärke × Dauer-Anteil auf der eigenen Map (ganztägig hier nur eigene Map gemessen, Partner fehlt; Wert für „ganzer Tag“ unplausibel niedrig → prüfen). **Bremsen fast wertlos** in dichten 10-Uhr-Wellen: die Türme schießen ohnehin ununterbrochen (wie bei der Reichweite) – Bremsen wirkt vermutlich erst bei Leaks/Nachzüglern und bei Reserve nahe 1. Wird mit spielnaher Reserve (DPSMUL=5) wiederholt, ebenso D2.

## D2c Wiederholung bei spielnaher Reserve (DPSMUL = 5) und mit ganzem Tag (24.10. morgens)
- Rate/Reichweite/Fläche bei Reserve ≈ 1,9 (statt 0,4): **praktisch identisch** mit D2 → die Kurse hängen kaum an der Gesamtstärke und können als feste Faktoren gelten.
- Effekte, 10 Uhr (Reserve 1,0) bzw. ganzer Tag mit Leaks um 19 Uhr (Reserve 2,0, Effekte wandern mit):

| Effekt | 10 Uhr | ganzer Tag |
|---|---|---|
| Bremsen 20 % 2 s | 0,99 | 0,97 |
| Bremsen 50 % 4 s | 1,05 | 1,04 |
| Fluch 10 % 4 s | 1,13 | 1,12 |
| Fluch 20 % 4 s | 1,25 | 1,24 |
| Fluch 35 % 8 s | 1,43 | 1,43 |
| Brennen 15 % 3 s | 1,08 | 1,09 |
| Brennen 30 % 6 s | 1,24 | 1,28 |
| Brennen 15 % ganzer Tag | 1,25 | 1,32 |

(Der Wert „ganzer Tag“ in D2b war ein Skriptfehler: 1 s statt Tag.)
- **Fluch** ≈ 1 + 1,2 × Fluchwert, Dauer zweitrangig. **Brennen** ≈ 1 + Stärke × wirksame Dauer; ganztägig wirkt über die Leaks weiter (+7 %).
- **Bremsen auf Einzelziel ist fast nichts wert** – geprüft, dass es wirkt (Test: 4 Bremstürme 50 %, letzte Ankunft 56,5 → 62,9 s, Schaden +4 %). Grund: in dichten Wellen trifft ein Turm immer nur ein Monster, die anderen laufen ungebremst; die Türme schießen ohnehin ununterbrochen. **Bremsen bekommt seinen Wert erst über Fläche** (Schneeball, Frostnova) → als Kombination Bremsen × Fläche messen.

## D2d Effekte mit Fläche (ganzer Tag, Reserve 2,0)
| | ohne Effekt | + Bremsen 20 % 2 s | + Bremsen 35 % 4 s | + Fluch 20 % 4 s | + Brennen 30 % 6 s |
|---|---|---|---|---|---|
| Fläche 1,5 | 1,14 | 1,29 | 1,49 | 1,44 | 1,48 |
| Fläche 2 | 1,32 | 1,46 | 1,70 | 1,70 | 1,72 |

Zusatzwert des Effekts gegenüber „nur Fläche“: Bremsen 35 % 4 s ×1,31/1,29 (einzeln 0,99), Fluch 20 % ×1,27/1,29 (einzeln 1,24), Brennen 30 % 6 s ×1,30/1,31 (einzeln 1,28).
→ **Bremsen wirkt nur in der Fläche**, dort etwa so stark wie Fluch/Brennen. Fluch und Brennen gewinnen durch Fläche nur wenig. Für das Modell: Wert(Effekt) = 1 + k_Effekt × Stärke × f(Dauer) × (Flächenfaktor nur bei Bremsen).

## Stapelregel (L 24.10.)
Alle Effekte außer Stein stapeln wie Brennen: stärkster voll, jeder weitere 20 %, höchstens 6; Deckel wie im Spiel (Bremsen 0,85, Fluch 1,5). Im Spiegel per `STAPEL_ALLE=1` (`basis/patch.js`), nur für Zweig D. Faktor je Effekt wird bei ⅙, ⅓ und ½ Anteil Effekt-Türme gemessen (`ANTEIL=`).

## D2e Effekte mit gemeinsamer Stapelregel, Anteil ⅙ / ⅓ / ½ (ganzer Tag, Reserve 2,0)
| Effekt | ⅙ | ⅓ | ½ |
|---|---|---|---|
| Bremsen 35 % 4 s | 0,99 | 1,03 | 1,08 |
| Bremsen 50 % 4 s | 1,06 | 1,16 | 1,32 |
| Fluch 10 % 4 s | 1,15 | 1,19 | 1,23 |
| Fluch 20 % 4 s | 1,28 | 1,36 | 1,43 |
| Fluch 35 % 8 s | 1,51 | 1,61 | 1,70 |
| Brennen 15 % 3 s | 1,07 | 1,09 | 1,11 |
| Brennen 30 % 6 s | 1,23 | 1,28 | 1,34 |
| Brennen 15 % ganzer Tag | 1,30 | 1,32 | 1,36 |

Wert je Effekt-Turm hängt am Anteil – drei verschiedene Formen:
- **Fluch: früh gesättigt.** Schon wenige Fluch-Türme bringen fast alles (⅙ → +28 %, ½ → +43 % bei 20 %); jeder weitere bringt weniger. Mit Stapelung steigt der Wert gegenüber „nur der stärkste“ (⅓: 1,36 statt 1,24).
- **Brennen: etwa linear, leicht fallend** (+23/+28/+34 % bei 30 % 6 s).
- **Bremsen (ohne Fläche): braucht Masse** – erst ab hohem Anteil und hoher Stärke spürbar (50 % 4 s: +6/+16/+32 %).
→ Ein fester Faktor je Effekt gilt nur für einen Bezugs-Anteil. Vorschlag: Bezug ⅓, dazu je Effekt die Steigung als zweiter Wert (Fluch fallend, Bremsen steigend). Für das Spielgefühl heißt das: ein, zwei Fluch-Türme lohnen immer, viele kaum; Bremsen lohnt nur flächig oder in Masse.

## Stapelregel überarbeitet (L 24.10. mittags)
- Im Spiel tragen **alle** Türme eines Elements den Effekt → Bezug für die Kurse: eigene Hälfte nur Effekt-Türme, Partner-Hälfte Grundtürme (`ANTEIL=0.5`).
- Für Brennen, Bremsen und Fluch dieselbe Regel: Effekte je Monster **nach Stärke sortiert**, stärkster voll, jeder weitere 20 %, höchstens 6 → nie mehr als 2 × der stärkste; **keine eigenen Deckel** mehr.
- **Bremsen (L, ersetzt die Bremspunkte):** Prozent wie bisher, je Turm höchstens 30 % (`BREMS_MAX`, flexibel) → mit der Stapelregel höchstens 60 % (Zeit in Reichweite ×2,5). 40 % (→ 80 %) war mit Fläche zu stark: Fläche 2 + Bremsen 35 % 4 s ×5,1 statt ×2,1 mit „nur stärkster“, weil die Zeit in Reichweite mit 1 ÷ (1 − Bremsung) wächst. Viele Türme bremsen nur 10–15 %, das Maximum wird selten erreicht (L). ohne eigenen Deckel und ohne Umrechnungsformel (die Formel hätte zusammen mit der Stapelung doppelt geschwächt). Türme mit mehr als 40 % werden über den Wechselkurs entschädigt.
- Mehr als 6 Türme lohnen weiter: der Direktschaden addiert sich ohne Grenze, die Grenze gilt je Monster (6 Türme können nicht alle Monster gleichzeitig belegen), und stärkere Effekte (Upgrades) heben die Grenze, weil sie am stärksten Effekt hängt. Effektlastige Türme verlieren mit vielen Kopien an Grenzwert – gewollt (Mischung lohnt).

## D2f Effekte im Paar-Kontext (eigene Hälfte nur Effekt-Türme), Stapelregel, Bremsen max. 30 %
| | ohne Fläche | Fläche 1,5 | Fläche 2 | Fläche 2, alte Regel (nur stärkster) |
|---|---|---|---|---|
| kein Effekt | 1 | 1,20 | 1,49 | 1,49 |
| Bremsen 20 % 2 s | 0,97 | 1,81 | 2,14 | 1,72 |
| Bremsen 35 % 4 s (→ 30 %) | 1,01 | 3,24 | 3,57 | 2,11 (40 %-Regel: 5,08) |
| Fluch 20 % 4 s | 1,43 | 1,77 | 2,24 | 1,95 |
| Brennen 30 % 6 s | 1,34 | 1,61 | 1,96 | 1,96 |

- Ohne Fläche: Bremsen ≈ wertlos, Fluch ×1,43 (20 %), Brennen ×1,34 (30 % 6 s).
- Mit Fläche: Bremsen gestapelt bleibt der stärkste Effekt (×2,4 gegenüber „nur Fläche“ bei 30 % 4 s), Fluch ×1,5, Brennen ×1,3. Bei schwachen Bremsern (10–20 %) deutlich weniger.

## D2g Durchbrüche statt Lebensanteil (KILLS=1, Paar-Kontext, Stapelregel, Bremsen max. 30 %)
Fester Leben-Faktor je Tag/Map (1,15 × Reserve des Kontexts ohne Effekt, dort brechen 54 % der Monster durch). Umrechnung über „Schaden aller Türme ×q“: ×1,05 → 45 %, ×1,1 → 34 %, ×1,2 → 10 %, ×1,35 → 0 %.

| Effekt (ohne Fläche) | Durchbrüche (ohne Effekt ≈ 52 %) | entspricht Schaden aller Türme | zum Vergleich Lebensanteil-Messung |
|---|---|---|---|
| Bremsen 35 % 4 s (→ 30 %) | 34 % | ≈ ×1,10 | ×1,01 |
| Fluch 20 % 4 s | 10 % | ≈ ×1,19 | ×1,43 |
| Brennen 30 % 6 s | 2 % | ≈ ×1,3 | ×1,34 |

→ **Bremsen auf Einzelziel wirkt über die Kills** (L vermutete das): es verteilt den Schaden so, dass weniger Monster knapp überleben – im Lebensanteil kaum sichtbar, bei den Durchbrüchen etwa +10 % Schaden wert. Fluch ist nach Durchbrüchen weniger wert als nach Lebensanteil. **Beschluss (L):** Lebensanteil bleibt Hauptmaß, Durchbrüche werden immer mitgemessen.
- **Bremsen (L):** Einzelziel höchstens 40 % je Turm (gestapelt 80 %; 45 % hätte mit 90 % fast Stillstand ergeben – Einzelziel-Bremser stapeln am vordersten Monster; bei Endbossen gerade wertvoll), Fläche/Nova höchstens 30 % (gestapelt 60 %); Flächenbremser und starke Bremser machen über den Wechselkurs weniger Schaden.

## D3 Türme (25.10. morgens)
- **D3a `d/turm-d.js`:** Wert jedes echten Turms (Stufe 1/3/6) im Paar-Kontext, Stapelregel an, nur im Einsatzfenster (eigene Budget-Hälfte bezahlt 1–8 Kopien). Rohwerte: `d/turmwerte-01.txt`, `d/turmwerte-23.txt`. Erste Messung ohne Fenster war verzerrt (unbezahlbare teure Türme früh, 60+ billige Türme spät).
- Auffällig: Schneeball (Bremsen + Fläche) Wert/Ziel 1,3–1,7, Katapult/Fluchstein 1,1–1,4 → zu stark; Eiszapfen 0,5–0,6, Bergkönig 0,4–0,7, Frostsplitter S1 0,76 → zu schwach. Türme 6–8 auf Stufe 6 sind nie bezahlbar (Budget) – ihre Werte sind Schätzungen.
- **D3b `d/fit-d.js` → `spiegel-D1.json`:** Ziel Wert je Gold = K × 1,10^Turm × Upgrade (1/1,0/1,3) × Luftabwehr 1,5 / ohne Luftangriff 1,1, eine Konstante K für alle Elemente. Schaden je Turm (kraftT) und je Stufe (upT) über log-Gerade; Türme 6–8 Steigung je Stufe auf 0,93–1,07 begrenzt. Größte Änderungen: Eiszapfen ×1,88, Bergkönig ×1,48, Ewiges Eis ×1,31, Schneeball ×0,72, Katapult ×0,79.
- Monster in D1 noch wie C12f (D4 folgt). Bot-Prüflauf `kandidat-d1` nach Feuer abgebrochen.
- **Kritik L (25.10.), angenommen:** D3b widerspricht der Idee – es wurden wieder Faktoren je Turm eingepasst statt Türme aus Grundturm × Wechselkursen zusammenzusetzen. Richtig: Schaden/s eines Turms = Gold × Grundwert × Treppe × Upgrade ÷ Π(Wechselkurs seiner Merkmale); Parameter sind nur die Wechselkurse. Die Messung je Turm (D3a) dient als **Prüfung**: Abweichungen zeigen fehlende oder falsche Wechselkurse (z. B. Schneeball → Bremsen × Fläche zu billig, Eiszapfen → „nur Fliegende“ zu teuer). `spiegel-D1.json` ist damit verworfen.
- **Testläufe (L):** statt voller Bot-Läufe gezielte Prüfszenarien mit bestimmten Monstertypen (schnell, gepanzert, Schwarm, Fliegende, Boss, Leaks am Abend); voller Bot-Lauf erst am Ende.
- **Geschossgeschwindigkeit:** gezielte Geschosse fliegen fest 9 Felder/s und folgen dem Ziel (kein Merkmal). Wurfgeschosse landen dort, wo das Ziel beim Abschuss war – daher verfehlt kleine Fläche (Wert 0,84 bei 0,5). Vorschlag: Wurfgeschwindigkeit an den Flächenradius koppeln (feste Regel, kein eigener Wechselkurs).

## D0 Standardtürme und Monster (25.10. vormittags, L)
- **Standardtürme** (`spiegel-D0.json`): je Element gleich, 8 Stufen, Rate 1, 1 gezieltes Geschoss, Reichweite 3,5 Felder (L: Reichweiten im Spiel eher zu groß), kein Effekt, trifft Fliegende. Schaden/s = 0,233 × Gold × 1,10^Turm, Upgrades so, dass Kraft je Gold 1/0,9/1,0/1,1/1,2/1,3 (Stufe 1–6). Elemente ohne Sondermerkmale (kein Rüstungsschaden, keine Nachtregel, Gelände/Wetter normal). Faktoren der Monster wie C12.
- Monster-Änderungen (nur D, L): Betty – verliebte Türme schießen 4,5 s nicht (statt 3), Magier-Novizen alle 6 s für 2,5 s unsichtbar (statt 4/1,5), Motten fliegen 2,4 s und Kokon 6 s (statt 1,2/3).
- **Ausbauplan (L):** Der Bot sucht einmal den besten Ausbau mit Standardtürmen (Feuer, Maps 0:11 und 2:23, 35 min) → `d/plaene/standard-map0.json`, `standard-map2.json`. Map 0: viele Turm-1 auf Stufe 6 plus Turm 3/4; Map 2: wenige höhere Türme (4–6). Zwei sehr verschiedene Spielweisen – gut gegen Einseitigkeit; weitere Pläne („hochziehen“, „breit“) folgen.
- **Leben je Tag** = Leben × Reserve des Plans ÷ 1,5 (Reserve ist genau der Leben-Faktor) → Plan-Reserve 1,50 im Mittel (Map 0 ≈ 1,3, Map 2 ≈ 1,7). Leben liegen bei 0,2–1,1 × C12f (Standardtürme schwächer als die heutigen).
- **Schnelldurchlauf `d/plan.js`:** fester Plan, nur variierte Turmtypen (`VAR=`) werden auf eigene beste Plätze neu gesetzt. Ganzes Spiel, beide Pläne: **17 Sekunden** (statt Stunden).

## D0 Ziel-Reserve (L 25.10.): sinkt nach Potenzgesetz (`d/ziel.js`)
- Tag 1: Menschen-Start (3 × Turm 1, Stufe 1) schafft im ersten Durchlauf je Spieler ca. 12 von 20 → Reserve 1,52. Betty (Tag 48): 1,05. **Saubere Kurve ab Tag 1 (L):** Reserve = 1,52 × Tag^−0,096 (Tag 2: 1,42, 5: 1,30, 10: 1,22, 24: 1,12, 36: 1,08). Tag 2 fügt sich ein und wird dadurch etwas schwerer: Menschen-Start mit 3 × Turm 1 Stufe 2 schafft 4/4/6/6 Kills.
- Achtung Kippkante: Bei 20 gleichen Monstern im gleichen Abstand kippen die Kills fast sprunghaft (Tag 1: 15–20 Kills bei Leben ×1,0, 3–6 bei ×1,2). „12“ liegt genau an der Kante – im Spiel streuen Gelände und Wetter das.
- Silberfische bleiben wie sie sind (L), 12 Kills an der Kippkante; im Testspiel beobachten.

## Nächste Schritte
1. D1 Grundturm im Simulator (Kopie eines Turms ohne Effekt, Rate/Reichweite fest, Schaden ∝ Gold).
2. D2 Wechselkurse messen: Rate, Reichweite, Fläche, dann Effekte (echte Leben, mehrere Tage, Maps 0–3).
3. D3 heutige Türme als Grundturm + Merkmale beschreiben, Schaden/Schuss folgt → `spiegel-D1.json`.
4. D4 Monster nach Einkommen, D5 Bot-Lauf nur zur Prüfung.
