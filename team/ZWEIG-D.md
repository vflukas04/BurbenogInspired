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

## D1 Fläche im Schnelldurchlauf (25.10. mittags, `d/merkmal.js`: alle Standardtürme bekommen das Merkmal bei gleichem Schaden/s)
| Radius (Felder) | 0,5 | 1 | 1,5 | 2 |
|---|---|---|---|---|
| Wert, Abfall wie heute (Mitte 100 %, Rand 70 %) | 0,84 | 0,90 | 1,19 | 1,52 |
| Wert, **anvisiertes Monster voll** (`D_PRIMAER=1`) | 0,97 | 1,04 | 1,32 | 1,65 |

- Ursache des Knicks bei kleiner Fläche: nicht die Wurfgeschwindigkeit (die ist bei kleinem Radius schon hoch, `lobSpeedOf`), sondern der **Abfall zum Rand** – das anvisierte Monster ist bis zum Aufschlag weitergelaufen und bekommt nur 70–90 %. Vorschlag für D: das anvisierte Monster bekommt immer vollen Schaden, die übrigen im Radius mit Abfall. Damit ist Fläche nie schlechter als keine.
- Wechselkurs Fläche (mit `D_PRIMAER`): Wert ≈ 1 + 0,5 × (Radius − 0,75)^1,25 (Radius in Feldern; 0,5 → 1,0, 1 → 1,09, 1,5 → 1,35, 2 → 1,66).

## D1 Merkmale im Schnelldurchlauf (alle Türme der Map haben das Merkmal, gleicher Schaden/s, `D_PRIMAER=1`, Stapelregel)
| Merkmal | Wert |
|---|---|
| Reichweite 3 / 4 / 5 / 6 Felder (Standard 3,5) | 0,97 / 1,02 / 1,06 / 1,09 |
| Rate ×0,5 / ×2 | 1,03 / 0,97 |
| 2 / 3 Geschosse | 0,89 / 0,80 |
| Bremsen 20 % 2 s / 40 % 4 s | 1,23 / 1,49 |
| Fluch 10 % 4 s / 20 % 4 s / 30 % 8 s | 1,51 / 1,86 / 2,26 |
| Brennen 15 % 3 s / 30 % 6 s / 15 % ganzer Tag | 1,73 / 3,00 / 2,53 |
| Fläche 1,5 + Bremsen 20 % 2 s / 30 % 4 s | 3,04 / 3,38 |
| keine Fliegenden / nur Fliegende | 0,50 / 0,04 (Mittel über alle Tage – muss je Tagart gerechnet werden) |

- Reichweite und Rate sind fast neutral (±10 %), mehrere Geschosse kosten (Schaden verteilt sich).
- **Effekte sind sehr viel wert, wenn alle eigenen Türme sie tragen** (das ist die Lage im Spiel: ein Element = ein Effekt). Mit Stapelregel addieren sich die Effekte der vielen eigenen Türme. Brennen 30 % 6 s verdreifacht die Leistung, Bremsen mit Fläche ebenso.
- Folge für die Annäherung an die heutigen Türme: Effekt-Türme müssen deutlich weniger Direktschaden haben – oder die Effektstärken werden so gewählt, dass der Wechselkurs moderat bleibt (≈ 1,2–1,5). Das ist die zentrale Designentscheidung für D2.

## Beschlüsse L (25.10. mittags)
- **Kein „anvisiertes Monster immer voll“** – Abfall zum Rand bleibt (langsame Flächentürme treffen das Ziel kaum, dafür andere). Kleine Fläche ist dann einfach weniger wert → über den Wechselkurs mehr Schaden. Kopplung Wurfgeschwindigkeit ↔ Radius bestimmt, wie weit das Ziel bis zum Aufschlag läuft.
- **Effekte: beide Wege, je Turm.** Weg 2 (schwächere Effekte, Wert ≈ 1,2–1,5, mehr Direktschaden) als Regel; Weg 1 (starker Effekt, wenig Schaden) als seltene Ausnahme – bei Eis gut, bei Feuer selten, bei Schatten eher nicht (Irrlicht ist schon ein Sonderturm).
- **Mehrere Geschosse seltener** (heute 22 von 32 Türmen mit 2–6 Geschossen): insgesamt 5–8 Türme, 4–6 Geschosse nur als Ausnahme (L).
- **Extremturm mit Reichweite 1,5** erwünscht (L) – Wert 0,75 → entsprechend mehr Schaden.
- Kombinierte Effekte: jeder fertige Turm wird als Ganzes im Schnelldurchlauf gemessen, nicht nur aus Einzelkursen zusammengesetzt.
- **Reichweite** darf kleiner werden – kleinsten sinnvollen Wert messen.
- **Idee L: Schatten-Leuchtfackel** (Standard-Turm oder Kristall): Treffer erleuchtet das Monster kurz, es kann dann auch nachts außerhalb von Irrlichtern getroffen werden.

## D1b ohne Primär-Regel (Abfall bleibt), kleine Reichweiten, schwache Effekte (Weg 2), Tagarten
| Merkmal (alle Türme, gleicher Schaden/s) | Wert |
|---|---|
| Reichweite 1,5 / 2 / 2,5 / 3 / 3,5 / 4 / 5 / 6 Felder | 0,75 / 0,87 / 0,94 / 0,97 / 1 / 1,02 / 1,06 / 1,09 |
| Fläche 0,5 / 1 / 1,5 / 2 Felder | 0,84 / 0,90 / 1,19 / 1,52 |
| Bremsen 10 % 2 s (Einzelziel) | 1,04 |
| Fluch 5 % 4 s | 1,28 |
| Brennen 8 % 3 s / 5 % ganzer Tag | 1,40 / 1,53 |
| Fläche 1 + Bremsen 10 % 2 s / Fläche 1,5 + Bremsen 10 % 2 s | 1,55 / 1,93 |
| keine Fliegenden: Bodentage / Fliegertage | 0,97 / 0,02 |
| nur Fliegende: Fliegertage / Bodentage | 1,00 / 0,02 |

- **Kleinste sinnvolle Reichweite ≈ 2 Felder** (−13 %); bei 1,5 schon −25 %. Formel: Wert ≈ (r ÷ 3,5)^0,3 unter 3,5, (r ÷ 3,5)^0,16 darüber.
- **Weg-2-Stärken für Wert ≈ 1,3–1,5:** Fluch ≈ 5 %, Brennen ≈ 8 % 3 s bzw. 5 % ganzer Tag. **Bremsen mit Fläche ist auch bei 10 % schon ×1,6–1,7** (gebremste Monster ballen sich → mehr Flächentreffer) – für Eis mit Fläche reichen ≈ 5 %.
- Fliegende: „keine Fliegenden“ kostet an Bodentagen nichts, ist an Fliegertagen wertlos; „nur Fliegende“ umgekehrt. Der Wechselkurs ist damit eine Designfrage (Häufigkeit der Fliegertage, Partner fängt auf): bleibt bei L-Regel +10 % bzw. +50 % an Fliegertagen.

## D1c restliche Merkmale (alle Türme, gleicher Schaden/s)
| Merkmal | Wert |
|---|---|
| Betäuben 15 % Chance, 1 s / 30 %, 2 s (Einzelziel) | 1,86 / 2,96 |
| Nova (Fläche 2 Felder um den Turm, 1 Puls je 4 s) / mit Betäuben 30 % 2 s | 0,56 / 0,87 |
| Rüstungsschaden 0,5 / 1,5 (Element) | 1,07 / 1,18 |
| Nachtregel (trifft nachtaktive um 19 Uhr nur im Licht) | 0,86 |
| Reichweite 1,5 | 0,75 |
| Fläche 1 + Brennen 8 % 3 s (einzeln 0,90 × 1,40 = 1,26) | 1,31 |
| Fläche 1 + Fluch 5 % 4 s (einzeln 0,90 × 1,28 = 1,15) | 1,15 |

- **Betäuben ist der stärkste Effekt**, wenn alle Türme ihn haben: schon 15 % für 1 s fast ×1,9 (die ganze Welle steht immer wieder). Für Weg 2 eher 5 % / 0,5 s.
- **Nova ist schwach** (nur Monster direkt um den Turm, seltene Pulse) – braucht Betäuben/Einfrieren, um sich zu lohnen.
- **Kombinationen** liegen nahe am Produkt der Einzelwerte (Fluch genau, Brennen mit Fläche +4 %). Gute Nachricht für das Modell: Wert ≈ Produkt der Einzelkurse, kleine Zuschläge für Synergien.

## D2 Komplettversuch (25.10. nachmittags, `d/d2.js` → `spiegel-D2.json`)
32 Türme als Grundturm + Merkmale (Weg 2 als Regel; Mehrfachgeschosse 7 Türme; Reichweiten 1,5–6; Irrlicht vorerst normaler Fluch-Turm), **Schaden nur aus den Wechselkursen**. Schnelldurchlauf je Element, alle Turmtypen auf eigene Plätze neu gesetzt.
- Korrekturen am Werkzeug: Luftabwehr-Typen im Plan an Bodentagen durch Gold-gleichen Bodenturm ersetzen; Element-Forschung des Plans (Feuer) auf das geprüfte Element umschreiben.
- **Befund Wetter:** Mit identischen Standardtürmen liegen die Elemente ohne Wetter bei 0,99–1,03, mit Wetter bei 0,99–1,14 – das heutige Wetter bevorzugt Feuer um ≈ 12 % (Sonnig ×3 Gewicht, Hitze), benachteiligt Stein (wetterfest heißt: nie Bonus). → Vorschlag: Wetterwirkungen je Element so normieren, dass das gewichtete Mittel 1 ist.
- **Befund Bremsen:** Im gemischten Aufbau ist Bremsen etwa doppelt so viel wert wie in der Einzelmessung (es hilft den stärkeren anderen Türmen) → Wechselkurs Bremsen (V − 1) × 2 (`SLOW_K`).
- **Ergebnis ohne Wetter (Plan-Reserve, D0 mit Standardtürmen 0,99–1,03):** Feuer 0,98 · Eis 1,03 · Schatten 0,97 · Stein 0,93. **Alle Elemente innerhalb ±5 % aus reinen Wechselkursen** (Stein −5 %: Fläche/Betäuben leicht überbewertet). Mit heutigem Wetter: 1,14 / 1,01 / 1,04 / 0,93.
- Noch nicht drin: Irrlicht als Sonderturm, Paare (Partner fängt auf), Fliegertage im Detail, Kristalle.
- **Korrektur (L 25.10. nachts):** Türme werden nicht abgerissen – die tageweise Ersetzung der Luftabwehr war falsch (sie ließ Luftabwehr nur an Fliegertagen stehen und schönte Feuer). Jetzt durchgehend ersetzt: Feuer 0,88 · Eis 1,02 · Schatten 0,97 · Stein 0,93 (ohne Wetter). Feuer fiel, weil der Ersatz teils Türme ohne Luftangriff wählte (Glutbecken/Lavaturm). **Lösung (26.10., ohne neue Bauregel):** Plan wird 1:1 übersetzt (gleicher Turm, gleiche Stufe); nur reine Luftabwehr wird durch einen **Allzweckturm** (trifft Boden und Luft) mit möglichst gleichem Gold ersetzt. Ergebnis ohne Wetter: Feuer 1,05 · Eis 1,02 · Schatten 0,97 · Stein 0,93.
- **Element-Spezifikation (Idee L):** jedes Element bekommt einen eigenen Nachteil/Vorteil als eigenen Parameter, erst nach dem übrigen Balancing: Schatten Nachtrunde; Stein Wetter neutral + Gelände-Vorteil (Baukosten bis dahin normal); Feuer Wetter (tendenziell kürzeres Brennen); Eis keine Effekte auf Fliegende. Wetter darf mehr Geschmack haben (Nebel/Reichweite gut) – L macht einen Vorschlag.
- **Irrlicht:** im Code (Basis und aktuelles Spiel) wirkt die Verstärkung auf **Schatten-Türme im Lichtkreis**, die Nachtsicht auf **Monster im Lichtkreis**. L erinnert eine Absprache „wirkt auf die Monster“ – klären.

## D2b Luftspezialist (L 26.10.)
Brandpfeil und Eiszapfen treffen jetzt auch Bodenmonster: Boden 50 %, Fliegende 250 % (`groundHalf`/`flyMul` als Turmoption, `basis/patch.js`); Wechselkurs = geometrisches Mittel über die Tage (8 von 46 Fliegertage). Kein Ersatz mehr im Plan nötig.

Plan-Reserve ohne Wetter, alle Tage / nur Fliegertage (D0 Standardtürme: Fliegertage 0,90–1,02):
| | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| alle Tage | 1,08 | 1,02 | 0,97 | 0,93 |
| nur Fliegertage | 1,56 | 0,80 | 0,48 | **0,08** |

- **Befund:** Die Fliegertage kippen stark zwischen den Elementen. Nicht wegen der Luftspezialisten, sondern wegen der Türme **ohne** Luftangriff: Stein (Kiesel, Schleuder, Felsbrocken, Erdbeben, Lawine) und Schatten (Fluchstein) stehen im Plan auf Plätzen, die an Fliegertagen nichts treffen. Der Zuschlag ×1,1 gleicht das über das Spiel ungefähr aus, an Fliegertagen aber nicht. Feuer ist dort mit 250 % klar zu stark.
- Entscheidung offen (L): wie viele Türme ohne Luftangriff je Element, Stein-Regel „Fliegende nur Turm 3/6/8“ beibehalten?

## D2c Stein 3/4/6/8, Luftspezialist 60/180, Fluchstein (26.10. nachmittags)
- L: Stein trifft Fliegende mit Turm 3/4/6/8 (Felsbrocken neu); Luftspezialist Boden 60 % / Fliegende 180 %.
- **Warum Schatten an Fliegertagen so schwach war:** nicht der Fluch, sondern der Fluchstein (Turm 4, kein Luftangriff) – Turm 4 ist im Plan der meistgebaute Turm (Map 0). Test: Fluchstein trifft Fliegende → Schatten-Fliegertage 0,48 → 1,05. Gleiches galt für Stein-Felsbrocken. Als Vorschlag im Stand (L entscheidet).
- **Stein war an Bodentagen viel zu stark (≈ 1,5)**, verdeckt durch den Einbruch an Fliegertagen: Ursachen Stein-Flächenabfall 120/80 % (≈ +17 %), Rüstungsschaden, Betäuben und Zuschlag ohne Luftangriff je ≈ +4 %. In D: Stein-Abfall wie alle (100/70 %), Korrektur `STEIN_K` = 0,8.
- Ergebnis ohne Wetter:

| | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Bodentage | 0,97 | 1,06 | 1,08 | 1,00 |
| Fliegertage | 1,15 | 0,73 | 1,05 | 0,33 |

- Bodentage ±5 %. Fliegertage bleiben Element-Eigenschaft: Stein (nur 4 von 8 Türmen) und Eis (kein Bremsen auf Fliegende) schwach, dort muss der Partner tragen.

## D2d Fluchstein zurück, Luftspezialist bei Schatten (L 26.10. 17 Uhr)
- Fluchstein wieder ohne Luftangriff; Brandpfeil wird normaler Fernkampf-Brandturm, der Luftspezialist (60/180) wandert zu Schatten (Nachtauge).
- Stein-Variante Schleuder (2/3/6/8) statt Felsbrocken getestet: Fliegertage 0,12 (Turm 2 wird im Plan seltener gebaut als Turm 4) → Felsbrocken bleibt; ggf. nur Name/Bild anpassen.

| ohne Wetter | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Bodentage | 1,06 | 1,06 | 1,07 | 1,00 |
| Fliegertage | 0,65 | 0,73 | 0,59 | 0,33 |
| alle Tage | 0,98 | 1,00 | 0,97 | 0,84 |

- Damit Stein über alle Tage bei 1 landet, müsste es bei Fliegertagen 0,33 an Bodentagen ≈ 1,26 haben (8 von 46 Fliegertagen, geometrisches Mittel).

## D2e Stein: Turm 4 ohne Luftangriff, Schleuder schwach gegen Fliegende (L 26.10. abends)
- Neue Turmoption `groundMul` (Boden × Wert) – die Luftspezialisten machten vorher am Boden 50 % statt 60 % (nur „halber Schaden“ möglich).
- Schleuder: Boden 100 %, Fliegende 50 % („schwach gegen Fliegende“).

| ohne Wetter | Feuer | Eis | Schatten | Stein (2 schwach/3/6/8) | Stein Variante 2/4/6/8 |
|---|---|---|---|---|---|
| Bodentage | 1,06 | 1,08 | 1,10 | 1,05 | 1,01 |
| Fliegertage, Plan 1:1 | 0,65 | 0,73 | 0,59 | 0,09 | 0,39 |
| Fliegertage, vorbereitet | 0,81 | 0,87 | 1,45 | 0,50 | – |

- „Plan 1:1“ hängt stark davon ab, welche Turmnummer der Bot im Standard-Plan oft gebaut hat (Turm 4) – für Fliegertage wenig aussagekräftig. **„Vorbereitet“** (`FLIEG_VORBEREITET=1`): an Fliegertagen sind Türme ohne Luftangriff durch fliegertaugliche gleichen Golds ersetzt – entspricht dem „Rennen zu den Fliegend-Türmen“ (L). Dieses Maß für Fliegertage verwenden.
- Vorbereitet: Schatten zu stark (Nachtauge 180 % in Masse), Stein zu schwach (Schleuder schwach, Katapult/Granitwächter/Bergkönig nur normal).

## D2f Querschnitts-Aufbau und Stein-Varianten (27.10. morgens)
- **Bot-Endaufbau (Standardtürme, Tag 48, 11 934 Gold je Spieler):** Map 0: 11 × Turm 1 S6, 1 × T2 S3, 4 × T3 (S2–S6), 6 × T4 (S2–S5); Forschung 660 Gold (Element-Schaden, Kopfgeld, Reichweite je 3 Stufen, Upgrades billiger 1). Map 2: T2 S6, T3 S2, 2 × T4 (S5/S6), 2 × T5 S4, 2 × T6 S3; Forschung 910 (dazu Türme 5–6). Türme 7–8 nie.
- **Querschnitt (`QUER=1`):** Gold des Tages gleichmäßig auf alle bezahlbaren Turmtypen (je höchste passende Stufe, bis 4 Kopien). Werte relativ zu D0 (Standardtürme, gleicher Querschnitt):

| | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Bodentage | 1,08 | 1,09 | 0,98 | 1,05 |
| Fliegertage | 0,68 | 0,80 | 1,10 | 0,23 |
| fliegertaugliche Türme | 6 von 8 | 6 (Eiszapfen stark) | 7 (Nachtauge stark) | 3 + Schleuder schwach |

- **Bot-Plan, Stein-Varianten (L):** L-Regel (2 schwach, 3/6/8): Boden 1,05 / Flieger 0,09 · Katapult ohne Luft, Felsbrocken normal: 1,02 / 0,33 · Katapult ohne Luft, **Felsbrocken stark** (60/180): **0,94 / 0,71**.
- Deutung: Im Querschnitt hängen die Fliegertage fast nur an der **Zahl** fliegertauglicher Türme; im Bot-Plan an Turm 4 (meistgebaut). Felsbrocken stark hilft nur im Bot-Plan. Zuschlag ×1,1 für „keine Fliegenden“ gleicht den Ausfall an Fliegertagen nicht aus (rechnerisch ≈ ×1,2 nötig).

## D3 Bot-Vergleich: Standardtürme, festes Gold, alles freigeschaltet (L 27.10. vormittags)
**Beschlüsse L:** Preise gerafft auf **10/45/70/120/200/340/580/1000** (`d/d3.js` → `spiegel-D3.json`, Schaden weiter 0,233 × Gold × 1,10^Turm). Stein in D: **2 (schwach)/4/6/8**, Namen wie vor dem 17.10.: **T3 Felsbrocken** (keine Fliegenden), **T4 Katapult** (trifft Fliegende) – `d/d2.js` baut jetzt auf D3 auf. Forschung wird ausgeklammert und später nach Mehrwert bepreist, Preise dann je Spielerzahl.
**Aufbau (`d/bots.js`, Übersicht `d/bots-uebersicht.js`):** Gold vor Tag d = 30 + **90 %** des Kopfgelds aller Tage davor (alle Monster getötet; 10 % = fairer Kassen-Anteil). Gold hängt nicht vom Abschneiden ab. Alle Türme frei, keine Forschung, keine Steine, kein Abriss, ohne Wetter, Faktoren neutral, Map 0 (Seed 11) und Map 2 (Seed 23). Bewertung: Reserve je Tag (ganzer Tag), relativ zum **alten P2-Plan** (Forschung, Steine, Umbau, volles Kopfgeld; liegt in dieser Umgebung bei 0,89 × Ziel-Kurve).

| Bot | Vorgehen | gesamt | T1–12 | 13–24 | 25–36 | 37–48 | Türme Tag 48 | Upgr.-Anteil |
|---|---|---|---|---|---|---|---|---|
| hoch | ≤ 6 Türme, jeder bis S6, neu = höchste bezahlbare Stufe | **0,62** | 0,83 | 0,64 | 0,57 | 0,50 | 4 (T1/T3/T4 S6, T6 S5) | 94 % |
| sim | gierig mit Simulation (heute) | 0,60 | 0,76 | 0,70 | 0,55 | 0,45 | 30 (22 × T1, fast alle S6) | 86 % |
| simVoraus | gierig, Simulation heute/morgen/übermorgen, spart 1 Tag | 0,60 | 0,79 | 0,65 | 0,54 | 0,47 | 29 (18 × T1) | 79 % |
| hoch5 | jeder Turm bis S5, dann nächster | 0,59 | 0,78 | 0,60 | 0,53 | 0,50 | 6 | 91 % |
| hoch4 | jeder Turm bis S4 | 0,56 | 0,68 | 0,58 | 0,53 | 0,49 | 7 | 87 % |
| **kern** (Mensch A) | 3 × T1 → S6, je Stufe 1 Turm bis S3, Billigstes zuerst | **0,56** | 0,69 | 0,63 | 0,49 | 0,45 | 10 (T1–T8) | 71 % |
| **breit** (Mensch B) | 2 × T1 → S4, je Stufe 2 Türme bis S3, spart 2 Tage | 0,53 | 0,65 | 0,56 | 0,50 | 0,43 | 12 (T1–T6) | 82 % |
| hoch3 | jeder Turm bis S3 | 0,53 | 0,64 | 0,56 | 0,48 | 0,44 | 14 | 85 % |
| leiter3 | größter Turm (≤ 2 Tage sparen), je bis S3 | 0,52 | 0,55 | 0,58 | 0,48 | 0,48 | 5 (2 × T8) | 74 % |
| **sparer** (Mensch C) | 3 × T1 → S3, spart auf T2…T8 je 1 × | 0,51 | 0,61 | 0,53 | 0,47 | 0,44 | 10 (T1–T8) | 73 % |
| quer | Gold gleichmäßig auf alle Stufen | 0,50 | 0,54 | 0,56 | 0,48 | 0,44 | 14 (2 100 Gold übrig) | 62 % |
| nurT1 | nur Turm 1, Billigstes zuerst | 0,47 | 0,66 | 0,53 | 0,40 | 0,35 | 94 × T1 | 90 % |
| proxySpar | gierig nach Schaden × Abdeckung je Gold, spart 2 Tage | 0,47 | 0,31 | 0,60 | 0,53 | 0,51 | 26, fast alle S1 | 2 % |
| leiter | immer größter Turm auf S1, Upgrades erst ab 14 Türmen | 0,42 | 0,19 | 0,58 | 0,54 | 0,49 | 14 | 70 % |
| proxy | wie proxySpar, spart nie | 0,40 | 0,54 | 0,47 | 0,35 | 0,28 | 89, fast alle S1 | 9 % |

- **Typisch für starke Aufbauten:** 80–94 % des Golds in Upgrades, wenige Türme auf den besten Plätzen. Zwei Wege sind gleich gut: wenige Türme ganz hoch (hoch) oder viele Turm-1 auf S6 (sim). Neue Türme auf Stufe 1 und Sparen auf große Türme verlieren (proxy, leiter).
- **Grund:** Das einzelne Upgrade bringt je Gold S2–S6 0,83/1,11/1,24/1,36/1,47 (Kurve 1/0,9/1/1,1/1,2/1,3 gilt für den ganzen Turm), ein neuer Turm T2–T5 1,10/1,21/1,33/1,46. Dazu sind gute Plätze knapp.
- **Mensch-Bots** erreichen 0,51–0,56, also **82–90 % des besten Bots**. Die Maps unterscheiden sich kaum (Map 0/2 je ±0,03).
- T7/T8 bauen nur die Mensch-, Leiter- und Querschnitt-Bots (S1–S3), die Sim-Bots nie.
- Alle liegen bei etwa 0,6 des alten Plans. Erwartet: Der alte Plan hatte +32 % Gold (volles Kopfgeld + Kopfgeld-Forschung), +25 % Element-Schaden, Steine und freien Umbau. **Die Leben müssen auf den neuen Bezug nachkalibriert werden**, sobald der Bezugs-Bot feststeht.
- **Flachere Upgrade-Kurve 1/0,95/1/1,075/1,15/1,2** (`spiegel-D3-flach.json`, je Upgrade 0,92/1,06/1,18/1,27/1,29): hoch 0,62 → 0,59, hoch5 0,59 → 0,58, kern 0,56 → 0,55, breit und leiter3 gleich. Die Reihenfolge bleibt, der Abstand Bester ÷ Mensch A sinkt von 1,11 auf 1,07.
- **Upgrade-Kurven im Vergleich (27.10. mittags, alle 15 Bots bzw. Sim-Bots neu simuliert):**

| Kurve (ganzer Turm) | je Upgrade S2–S6 | bester Bot | sim | Mensch A / B / C | Mensch A ÷ bester |
|---|---|---|---|---|---|
| 1/0,9/1/1,1/1,2/1,3 (D3) | 0,83/1,11/1,24/1,36/1,47 | 0,62 (hoch) | 0,60 | 0,56 / 0,53 / 0,51 | 90 % |
| **1/0,92/1/1,08/1,16/1,25 (L, `spiegel-D3-k2.json`)** | 0,87/1,09/1,19/1,29/1,41 | 0,61 (hoch) | 0,60 | 0,56 / 0,53 / 0,52 | 92 % |
| 1/0,95/1/1,075/1,15/1,2 (`spiegel-D3-flach.json`) | 0,92/1,06/1,18/1,27/1,29 | 0,59 (hoch) | 0,58 | 0,55 / 0,53 / 0,52 | 93 % |

  Bei allen drei Kurven bauen die Sim-Bots 15–26 × Turm 1 auf S6, dazu einzelne T2–T6. Grund ist die Platzknappheit: Turm 1 steht früh auf den besten Feldern, Abriss gibt es nicht, deshalb schlägt das Aufrüsten dort einen neuen großen Turm auf schlechterem Feld. **Ohne Reichweiten-Zuwachs bei Upgrades** (Test `spiegel-D3-k2r0.json`) ist es genauso (sim weiter 17–18 × T1 S6), alle Bots verlieren 10–18 %. Die Kurve ist also nicht der Hebel für vielfältigere Aufbauten. Möglich wären die Turm-Treppe (1,10 je Stufe, z. B. 1,15) oder weniger gute Plätze.
- **Turm-Treppe und Obergrenze (L 27.10. mittags, Kurve 1/0,92/1/1,08/1,16/1,25):** Schaden je Gold steigt je Turmtyp um ×1,10 / ×1,12 / ×1,15 (`spiegel-D3-k2.json`, `-k2t112`, `-k2t115`; Leben nicht nachkalibriert, deshalb steigen die Werte). Neu: **sim3 / simVoraus3** = gierig mit Simulation, aber höchstens 3 Türme je Turmtyp.

| Treppe | bester (hoch) | sim3 / simVoraus3 | sim (ohne Grenze) | Mensch A / B / C | Mensch A ÷ bester |
|---|---|---|---|---|---|
| ×1,10 | 0,61 | 0,60 / 0,59 | 0,60 (31 Türme, 22–26 × T1) | 0,56 / 0,53 / 0,52 | 92 % |
| ×1,12 | 0,63 | 0,61 / 0,62 | 0,60 (27, 17 × T1) | 0,57 / 0,55 / 0,54 | 90 % |
| ×1,15 | 0,66 | 0,63 / 0,63 | 0,61 (28, 20 × T1) | 0,60 / 0,59 / 0,58 | 91 % |

  - **Die Obergrenze kostet nichts**, ab ×1,12 ist sie sogar besser als ohne. Die Masse an Turm 1 ist also nicht optimal, sondern Kurzsichtigkeit des gierigen Bots (jeden Tag ist das nächste T1-Upgrade knapp am besten). Mit Grenze baut der Bot von T1–T5 je 3, dazu 1–2 × T6; Upgrades vor allem auf T1–T4. T7/T8: bei ×1,10 nie, bei ×1,12 einmal T8, bei ×1,15 2 × T7 und 1 × T8 (simVoraus3).
  - Die Treppe ändert die Turm-Masse ohne Grenze nicht. Sie entscheidet vor allem, ob große Türme spät lohnen: Bei ×1,15 liegen die Großturm-Bots (hoch, hoch5, leiter3) vorne, und die Mensch-Bots holen im letzten Block auf.
- **Später (Forschung):** Wert je Freischaltung = Gold-Äquivalent (Budget-Aufschlag, der dieselbe Reserve bringt; mit festem Budget direkt messbar), Preis = Anteil davon, gemeinsame Forschung × Spielerzahl/2, Summe gegen das 10-%-Ziel prüfen, dann Leben nachziehen.

## D4 Leben auf den Bezugs-Bot kalibriert (L 27.10. mittags, `spiegel-D4.json`)
- **Beschlüsse L:** Treppe **×1,12** je Turmtyp (×1,13 wäre auch möglich), Upgrade-Kurve **1/0,92/1/1,08/1,16/1,25**, Preise bis 1000. Begriffe: **Turmtyp** (T1–T8), **Stufe** (S1–S6). **Bezugs-Bot** `bezug`: gierig mit Simulation heute/morgen/übermorgen, spart 1 Tag, höchstens **4 × T1, sonst 3 je Turmtyp**.
- **Kalibrierung (`d/ziel4.js`):** Ziel-Reserve 1,55 × Tag^−0,101. Tag 1: Leben so, dass der Menschen-Start (3 × T1 S1) im ersten Durchlauf 12 von 20 schafft. Betty: 1,05 für den Bezugs-Bot. Festes Gold, ohne Forschung, ohne Wetter, neutrale Faktoren. Zwei Runden: Bot erzeugen, Leben anpassen, Bot neu erzeugen. Danach liegt der Bezugs-Bot bei 1,02 des Ziels (Blöcke 1,02–1,03, schwächster Tag 0,91). Die Leben sinken dadurch im Mittel auf **×0,53** gegenüber D0, weil D0 auf den alten Plan mit Forschung, Steinen, Umbau und mehr Gold kalibriert war. **Mit der Forschung später steigen sie wieder.**
- **Alle Bots auf D4** (1,00 = Ziel): hoch 1,05 · **bezug 1,02** · hoch5 1,01 · sim 1,00 · **Mensch A 0,96 · Mensch B 0,93 · Mensch C 0,91** · leiter3 0,95 · quer 0,89 · nurT1 0,79. Die Mensch-Bots liegen in Tag 1–12 bei 0,80–0,88 (Start mit 3 × T1 ist Absicht) und holen bis Tag 37–48 auf (0,96–1,03).
- Bezugs-Bot Tag 48: 4 × T1 S6, 3 × T2 (S2–S3), 3 × T3 (S2–S6), 3 × T4, 3 × T5, 2 × T6 (Map 0).
- **Offen:** Map 0 ist etwa 20 % schwerer als Map 2 (Bezugs-Bot 0,92 / 1,13). Das ist Kartenvarianz (Wegführung/Gelände), Prüfpunkt für später. Der Regel-Bot „hoch“ (wenige Türme ganz hoch) ist etwas stärker als der gierige Bezugs-Bot. Der Bezug ist also stark, aber nicht optimal.

## D5 Standardtürme ohne Reichweiten-Zuwachs (L 27.10. nachmittags, `spiegel-D5.json`)
- **Beschluss L:** Standardtürme (auch ihre Upgrades) haben auf allen Stufen dieselben Standardwerte (Reichweite 3,5 Felder, 1 Schuss/s, 1 Geschoss, kein Effekt). Nur der Schaden je Gold steigt mit Turmtyp (Treppe) und Stufe (Upgrade-Kurve). Bisher galt die allgemeine Spielregel „Reichweite +0,2 (alte Felder) je Stufe“ auch für sie: S6 = 5,5 statt 3,5 Felder. Merkmale wie Reichweiten-Zuwachs kommen erst bei den echten Türmen über die Umrechnungsfaktoren dazu.
- **Warum das wichtig war:** Mit Zuwachs ist das billige T1-Upgrade je Gold das Beste (Tag 21, exakt: T1 → S5 1,20, neuer T6/T7/T8 0,73–0,76 je 1000 Gold); ohne Zuwachs drehen sich die Werte um (T6/T7 1,02, T8 0,94, T1-Upgrade 0,90; Tag 33: T8 0,50 gegen 0,15). Die Abdeckung der besten Felder ist fast gleich (25 beste: 15,4 bis 13,0), Platzknappheit ist also **nicht** der Grund (frühere Aussage korrigiert). Zusätzlich unterschätzt die Schnellbewertung der gierigen Bots große Käufe (Tag 33, T8: 0,21 statt 0,50) → sparsame Bots bewerten exakt (Reserve-Zuwachs je Gold).
- **Bezug neu:** `bezug3` (wie bezug, spart bis 3 Tage; war mit 1,05 am stärksten). Leben auf D5 kalibriert (2 Runden, `d/ziel4.js`): Reserve 1,52 × Tag^−0,096, Bezug danach 1,00 in allen Blöcken (schwächster Tag 0,92).
- **Ergebnis D5 (Treppe ×1,12):** Bezug 1,00 · ohne Obergrenze (`bezug3Frei`) 1,00 · wenige Türme ganz hoch 0,99 · Mensch A/B/C 0,95/0,94/0,91. **Ohne Obergrenze entsteht jetzt von selbst eine Mischung:** Tag 48 Map 0: 10 × T1 (2 × S6), 2 × T2, 2 × T4, 4 × T5, 3 × T6, 3 × T7, 1 × T8. Bezug mit Grenze: 4 × T1 (S5–S6), je 3 × T2–T7, 2 × T8. T7/T8 kommen jetzt bei allen Treppen.
- **Neue Auffälligkeit:** Die Bots rüsten kaum noch auf (Upgrade-Anteil 30–45 % statt 80–90 %), die meisten Türme bleiben auf S1. Grund: Das erste Upgrade bringt je Gold 0,87, ein neuer Turm des nächsten Typs ×1,12 mehr als der eigene. → Upgrade-Kurve am Anfang prüfen.
- **Treppe neu geprüft (Leben wie D5, nicht je Treppe kalibriert):**

| Treppe | Bezug | ohne Grenze | wenige ganz hoch | Mensch A / B / C | Mensch A ÷ Bezug |
|---|---|---|---|---|---|
| ×1,10 | 0,96 | 0,96 | 0,97 | 0,92 / 0,90 / 0,87 | 96 % |
| **×1,12** | 1,00 | 1,00 | 0,99 | 0,95 / 0,94 / 0,91 | 95 % |
| ×1,15 | 1,07 | 1,06 | 1,02 | 1,00 / 1,00 / 0,97 | 93 % |

  Die Zusammensetzung ändert sich wenig. T7/T8 kommen bei allen drei Treppen (×1,10: 3 × T7 / 2 × T8 ohne Grenze; ×1,15: 3 × T7, 1 × T8).
- **Sparer mit Schwelle 1,05 (L, `spar105`):** Er kauft heute nur, bis die Reserve 1,05 erreicht ist, und spart sonst auf den besten Kauf je Gold (exakt, bis 5 Tage). Ergebnis 1,02 (Tag 1–12 1,08, 37–48 0,96). Er spart kaum, weil der beste Kauf je Gold meist schon bezahlbar ist (kleine Käufe sind je Gold ähnlich gut wie große). Tag 48 Map 0: 4 × T1 S6, je 3 × T2–T6 (S1–S5), 2 × T7.
- **Platz-Fix der Regel-Bots:** Ist das beste Feld wegen Wald/Sumpf nicht bezahlbar, nehmen sie das beste bezahlbare mit ≥ 80 % Abdeckung. Vorher bauten die Mensch-Bots an Tag 1 nur einen Turm.

## D5b Weitsichtige Bots, optimaler Endaufbau, Rückwärts-Bot, D6 (L 27.10. nachmittags)
- **Optimaler Endaufbau ohne Pfad** (`d/optimum.js`, Gold von Tag 48, bewertet an Tag 44–48, Suche von mehreren Startpunkten mit vorab gesetzten T8/T7): Map 0 Reserve **1,53** (T8 × 5, T7 × 3, dazu kleine Lückenfüller auf schlechteren Feldern), Map 2 **1,78** (T8 × 6, T7, T1). Fast alles auf S1. Zum Vergleich der Endaufbau des Bezugs-Bots an denselben Tagen: 1,21 / 1,34. **Der Pfad kostet also etwa 20–25 %:** frühe kleine Türme besetzen die besten Felder, Abriss gibt es im Bot nicht.
- **Planer** (`planer`: spart bis 5 Tage, heute nur bis Reserve 1,05, bewertet auch mehrstufige Käufe exakt): 1,01, also nicht besser als der Bezug (1,00). Am Ende schwach (0,95).
- **Claude-Plan** (Regel-Bot: immer auf den nächstgrößeren Turmtyp sparen, Nachkauf nach Papierwert): **0,84**, verloren. Die Nachkäufe ohne Simulation erzeugen Massen an Stufe-1-Türmen.
- **Rückwärts-Bot** (`rueck`, L): Tagesziele = Teilmengen des optimalen Endaufbaus (rückwärts heruntergerechnet), vorwärts nachgebaut, Nachkauf nur unter Reserve 1,05. Reiner Rückwärtsplan: Tag 1–12 bei 0,02 – die kleinen Türme des Endaufbaus sind Lückenfüller auf schlechten Feldern und tragen den Anfang nicht. Mit Nachkäufen (Zielturm wandert auf das beste freie Feld, wenn sein Feld belegt ist): **0,94** (Map 0 am Ende 29 × T1). Die einfache Version bringt also nichts. L's Erweiterung (Tagesziel darf vom Folgetag abweichen, Folgetage passen sich an) wäre nötig.
- **D6** (`spiegel-D6.json`: Treppe ×1,08, Kurve 1/0,95/1,01/1,08/1,16/1,25, Leben noch von D5): Bezug 0,93 (Upgrade-Anteil **48 %**, vorher 32 %), ohne Grenze 0,93 (51 %), wenige ganz hoch 0,94, **Mensch A/B/C 0,90/0,87/0,85 = 97/94/91 % des Bezugs**. T7/T8 bleiben (Bezug Map 0: 3 × T7, 1 × T8, T4/T5 auf S3–S5).
- **Hinweis:** Im Spiel kann man für 50 % verkaufen (`sellRefund`), die Bots verkaufen nie. Gerade beim Endaufbau (kleiner Turm räumt das beste Feld für T8) könnte Verkaufen einen Teil der 20–25 % holen.

## D6 kalibriert (L 27.10. abends, `spiegel-D6.json`)
- **Beschlüsse L:** Treppe ×1,08, Kurve 1/0,95/1,01/1,08/1,16/1,25, Reichweite 3,5 Felder auf allen Stufen. Bezugs-Bot `bezug3` (spart bis 3 Tage, T1 ≤ 4, sonst ≤ 3 je Turmtyp). Upgrade-Anteil um 50 % ist gut, L vermutet **2/3 als Optimum**. Verkaufen soll der Bot nicht (erlaubt ja, sollte aber schlechter sein).
- **Leben auf D6 kalibriert** (2 Runden): Ziel 1,53 × Tag^−0,098. Kontrolle: Bezug **1,01** (Blöcke 1,04/1,01/1,00/0,99), wenige Türme ganz hoch 1,03, **Mensch A/B/C 0,98/0,95/0,92**. Upgrade-Anteil Bezug 52 %. Endaufbau Bezug Map 0: 4 × T1 (S4–S6), 3 × T2, 3 × T3, 3 × T4, 2 × T5, 3 × T6, 2 × T7, 1 × T8.
- **Ersetzen erlaubt** (`bezug3V`: verkaufen 50 % + größerer Turmtyp auf dem Feld): 1,02, also kaum besser (+1 %). Der Endaufbau verschiebt sich stark zu großen Türmen (Map 0: je 3 × T4–T8, kaum T1–T3). Verkaufen bleibt deshalb aus dem Bezug heraus.

## D6 Wechselkurse neu gemessen (L 27.10. abends, `d/kurse6.js`)
Fester Aufbau des Bezugs-Bots (D6, beide Maps, alle 48 Tage), alle Türme mit demselben Merkmal bei gleichem Schaden/s, Stapelregel. Wert = Reserve mit ÷ ohne. Alte Werte aus D1b/D1c (Basis D0, damals mit Reichweiten-Zuwachs je Stufe).

| Merkmal | gesamt | Boden | Flieger | alt |
|---|---|---|---|---|
| Reichweite 1,5 / 2 / 2,5 / 3 Felder | 0,49 / 0,64 / 0,90 / 0,96 | | | 0,75 / 0,87 / 0,94 / 0,97 |
| Reichweite 4 / 5 / 6 Felder | 1,03 / 1,08 / 1,11 | | | 1,02 / 1,06 / 1,09 |
| Reichweite-Zuwachs +0,4 / +0,2 Felder je Stufe | 1,05 / 1,03 | | | – |
| Rate ×0,25 / ×0,5 / ×2 / ×3 | 0,80 / 1,03 / 0,96 / 0,93 | | | – / 1,03 / 0,97 / – |
| 2 / 3 / 5 Geschosse | 0,87 / 0,76 / 0,53 | | | 0,89 / 0,80 / – |
| Fläche 0,5 / 1 / 1,5 / 2 Felder | 0,82 / 0,93 / 1,20 / 1,55 | 0,83 / 0,94 / 1,26 / 1,59 | 0,79 / 0,87 / 0,96 / 1,36 | 0,84 / 0,90 / 1,19 / 1,52 |
| Bremsen 10 % 2 s / 20 % 2 s / 40 % 4 s | 1,02 / 1,17 / 1,32 | 1,02 / 1,20 / 1,40 | 1,00 (wirkt nicht) | 1,04 / 1,23 / 1,49 |
| Fläche 1 + Bremsen 10 % 2 s | 1,38 | 1,52 | 0,87 | 1,55 |
| Fluch 5 / 10 / 20 % (4 s) | 1,24 / 1,45 / 1,78 | | 1,23 / 1,41 / 1,72 | 1,28 / 1,51 / 1,86 |
| Brennen 8 % 3 s / 15 % 3 s / 30 % 6 s | 1,46 / 1,83 / 3,38 | 1,48 / 1,87 / 3,51 | 1,37 / 1,66 / 2,78 | 1,40 / 1,73 / 3,0 |
| Brennen 5 % ganzer Tag | 1,60 | 1,65 | 1,38 | 1,53 |
| Betäuben 5 % 0,5 s / 15 % 1 s / 30 % 2 s / 100 % 1 s | 1,00 / 1,07 / 1,77 / 1,51 | | | – / 1,86 / 2,96 / – |
| Nova 2 Felder, Rate ×0,25 | 0,60 | | | 0,56 |
| Rüstungsschaden 0,5 / 1,5 | 1,07 / 1,18 | 1,08 / 1,20 | 1,05 / 1,09 | 1,07 / 1,18 |
| Nachtregel (nachtaktive nur im Licht) | 0,86 | | | 0,86 |
| keine Fliegenden | 0,50 | 0,96 | 0,02 | 0,97 / 0,02 |
| Luftspezialist 60 % / 180 % | 0,73 | 0,61 | 1,80 | – |
| schwach gegen Fliegende (100 / 50 %) | 0,88 | 0,99 | 0,50 | – |

- **Stabil:** Fläche, Fluch, Brennen, Rüstungsschaden, Nova, Nachtregel, Rate und Geschosse liegen innerhalb weniger Prozent der alten Werte.
- **Neu deutlich anders:** **kleine Reichweiten sind viel teurer** (2 Felder 0,64 statt 0,87; 1,5 Felder 0,49 statt 0,75). Früher hob der Reichweiten-Zuwachs je Stufe kleine Türme auf S5/S6 über 4 Felder. Für den Flammenwerfer (1,5) und das Glutbecken (2) wird der Ausgleich also deutlich größer.
- **Reichweiten-Zuwachs je Stufe ist als Merkmal wenig wert** (+0,4 Felder je Stufe: ×1,05). Er hat aber die Wahl zwischen Upgrade und neuem Turm stark verschoben. Wenn er für echte Türme wiederkommt, dann eher klein.
- **Betäuben viel schwächer als in D1c** (15 % 1 s: 1,07 statt 1,86). [Vermutung] Die alte Messung hatte einen Fehler bei der Betäubungschance; 100 % 1 s (1,51) < 30 % 2 s (1,77) zeigt, dass die Dauer zählt, nicht die Häufigkeit. Vor der Übersetzung der Stein-Türme gegenprüfen.
- **Bremsen** wirkt nur am Boden; an Fliegertagen ×1,00 (Eis bremst keine Fliegenden). Bremsen mit Fläche wirkt an Fliegertagen wie reine Fläche.

## D6T Türme aus den D6-Kursen (27.10. abends, `d/d2.js` → `spiegel-D6T.json`, `d/elemente6.js`)
- Kurse in `d2.js` auf D6 umgestellt (`V_D6`; `KURSE=D1` = alt). Korrekturen wie D2 (SLOW_K 2, STEIN_K 0,8, keine Fliegenden ×1,1). Stein 2s/4/6/8.
- **Bezugs-Aufbau, Turm für Turm durch das Element ersetzt** (1,00 = Standardturm), Bodentage: Feuer 0,96 · Eis 1,25 · Schatten 1,01 · Stein 1,34. Starke Drift über das Spiel: Tag 1–12 / 37–48 Feuer 1,06/0,94, Eis 0,93/1,63, Schatten 0,72/1,20, Stein 0,84/1,71. Fliegertage 0,71 / 0,66 / 0,79 / 0,21.
- **Bezugs-Bot frei je Element** (1,00 = Ziel): **Feuer 1,52** · Eis 1,31 · Schatten 1,10 · Stein 1,07 (Tag 1–12: 1,27 / 1,00 / 0,84 / 0,77).
- **Grund für Feuer frei 1,52 [Vermutung, sehr wahrscheinlich]:** versteckter Upgrade-Bonus wie beim Reichweiten-Zuwachs: Effekt ×1,15 und Dauer ×1,3 je Stufe (`CONFIG.upgrade.eff/dur`) – auf S6 Effekt ×2,0, Dauer ×3,7. Brennen 8 % 3 s wird auf S6 zu 16 % 11 s (Wert nach Kurs 2,66 statt 1,45). Der freie Bot rüstet deshalb Effekttürme besonders hoch.
- Stapelregel Fluch/Bremsen gilt (stärkster voll, weitere je 20 %, höchstens 6) – erklärt einen Teil der Drift (mit vielen Türmen bis ×2 des stärksten).

## D6T ohne Effekt-Wachstum (27.10. 21–22 Uhr)
- **Fehler korrigiert (Claude):** Neben der Reichweite wuchsen beim Aufrüsten auch Effektstärke (×1,15) und Effektdauer (×1,3) je Stufe (allgemeine Regel `CONFIG.upgrade.eff/dur`). Bei Standardtürmen wirkungslos, bei echten Türmen ein versteckter Upgrade-Bonus. In `spiegel-D6.json` jetzt beide = 1 (Leben und Standardtürme unverändert). Weitere Stufen-Regeln (Schussrate, Betäubungschance, Irrlicht-Werte) kommen in den zusammengesetzten Türmen nicht vor.
- **Effekt-Kurse ohne Wachstum** (alle Türme, gleicher Schaden/s): Bremsen 10 % 2 s 1,00 · 20 % 2 s 1,02 · 40 % 4 s 1,20 · Fläche 1 + Bremsen 10 % 1,07 · Fluch 5/10/20 % 1,14/1,27/1,49 · Brennen 8 % 3 s 1,16 · 15 % 3 s 1,29 · 30 % 6 s 1,97 · 5 % ganzer Tag 1,41 · Betäuben 15 % 1 s 1,05. Übrige Kurse unverändert. In `d2.js` eingesetzt (SLOW_K jetzt 1).
- **Element-rein (Bezugs-Aufbau, alle Türme des Elements), Bodentage:** **Feuer 0,99** (flach: 1,01/0,98/0,99/1,00) · Eis 1,34 (1,00 → 1,57) · Schatten 1,05 (0,77 → 1,21) · Stein 1,35 (0,84 → 1,68).
- **Diagnose je Turm im gemischten Aufbau** (`d/turm6.js`, nur ein Turmtyp ersetzt, Rest Standardtürme): fast alle 0,96–1,05. Ausreißer: **Erdbeben 1,68, Frostnova 1,23** (beide Nova mit Betäuben → Nova-Kurs im gemischten Aufbau zu streng), Schatten-Türme 1,02–1,18 (Fluch hilft auch den anderen Türmen).
- **Deutung [Vermutung]:** Eis und Stein sind einzeln richtig bepreist, aber **zusammen** stärker: Bremsen hilft allen eigenen Türmen (gemessen: Fläche + Bremsen 1,07 statt Produkt 0,94), Rüstungsschaden ebenso. Diese Zusammenarbeit wächst mit der Zahl der Türme → Drift.

## Drift-Prüfung (L 27.10. 22 Uhr; alte Korrekturen SLOW_K/STEIN_K aus)
- **Kurse je Spielabschnitt** (alle Türme mit dem Merkmal, Bodentage Tag 1–12/13–24/25–36/37–48): flach sind Fläche 1/2, Bremsen, Brennen, Reichweite 5. Mit Drift: **Nova 0,42/0,67/0,68/0,71**, **Rate ×0,25 0,37/1,05/1,03/1,04**, Rüstungsschaden 1,5 1,08/1,29/1,23/1,22, Fluch 10 % 1,15/1,35/1,32/1,29, Fläche 1,5 1,19/1,21/1,36/1,28, Reichweite 2 0,70 → 0,56, 3 Geschosse 0,80 → 0,66. Abschnitt 1 (wenige Türme, wenig Leben) weicht oft ab.
- **Element-rein mit abgeschaltetem Merkmal** (Schaden bleibt, Bodentage gesamt und Tag 1–12 → 37–48):

| Element | alles | ohne Bremsen / Fluch | ohne Fläche | ohne Nova | ohne Rüstungsschaden | ohne Nachtregel |
|---|---|---|---|---|---|---|
| Eis | 1,34 (1,00 → 1,57) | 1,15 (0,96 → 1,29) | 1,26 (1,00 → 1,38) | 1,18 (1,00 → 1,33) | – | – |
| Stein (STEIN_K 1) | 1,66 (1,03 → 2,08) | – | 1,71 (1,23 → 1,92) | 1,31 (1,03 → 1,50) | 1,37 (0,94 → 1,59) | – |
| Schatten | 1,05 (0,77 → 1,21) | 0,88 (0,71 → 0,96) | – | – | – | 1,24 (1,09 → 1,30) |

- **Deutung:** (1) **Nova** (Frostnova, Erdbeben) ist zu billig bepreist: Der Kurs wurde mit „alle Türme Nova“ gemessen (0,60); als einzelner Turmtyp ist sie viel mehr wert (Diagnose 1,23/1,68). Größter Einzelposten bei Stein, deutlicher bei Eis. (2) **Unterstützungs-Effekte** (Bremsen, Rüstungsschaden, Fluch) helfen allen eigenen Türmen und wachsen mit ihrer Zahl: je etwa +20–25 % am Ende, wenig am Anfang. (3) **Nachtregel** trifft Schatten vor allem am Anfang (Tag 1–12: 0,77 statt 1,09), weil in Block 1–2 viele nachtaktive Monster laufen. (4) Ein Rest bleibt auch ohne die Merkmale.

## Nova-Kurs nach Radius (L 27.10. 22:30)
- **Fehler gefunden (Claude):** In `d2.js` galt für jede Nova der feste Kurs 0,60, gemessen mit Radius 2. Der Wert hängt aber stark am Radius (alle Türme Nova, Rate ×0,25): **Radius 2 0,60 · 2,5 1,13 · 3 1,49 · 3,5 1,87**. Rate: ×1/6 → ×0,78, ×0,5 → ×1,245. Betäuben in der Nova: Frostnova (45 % 2 s) ×1,47, Erdbeben (20 % 1 s) ×1,22 (→ 1 + 0,5 × √(Chance × Dauer)). Erdbeben (Radius 3) war damit um etwa das 2,5-Fache zu billig bepreist.
- Jetzt `V.novaWert(r, q)` und `V.novaStun` in `d2.js` (ohne zusätzlichen Reichweiten- und Ratenkurs): Erdbeben Schaden ×0,51 (vorher ×1,84), Frostnova ×0,79 (vorher ×1,32).
- **Element-rein danach** (Bodentage, Tag 1–12 → 37–48): Feuer 0,99 (flach) · Eis **1,20** (1,00 → 1,35; vorher 1,34) · Schatten 1,05 (0,77 → 1,21) · Stein **1,23** (1,03 → 1,34; vorher 1,66).
- **„Nur ein Turmtyp“ gemessen** (nur Turm 5 mit dem Merkmal): alle Werte kleiner, weil nur ein Teil der Türme das Merkmal hat (Fläche 2: 1,16 statt 1,55). Kein Hinweis, dass einzelne Kurse im gemischten Aufbau grundsätzlich anders sind – der Nova-Fehler war der Radius.
- **Nachtaktive Monster (L: gleichmäßiger verteilen):** heute Tag 5, 6, 9, 11, 12, 16, 19, 33, 40, 44 – sieben in den ersten 19 Tagen, drei in den letzten 29.

## Verbund-Kurse und Nachtaktive neu (L 27.10. 22:20)
- **Nachtaktive (im Test, `spiegel-D6.json`):** Tag 5 Mäuse, 9 Katzen, 11 Füchse, 16 Wildschweine, 19 Besoffene Penner, 22 Eifersüchtige Geliebte, 27 Würfel, 33 Albträume, 37 E-Scooter-Fahrer, 40 Fledermäuse, 44 Heisenbergs. Zwischenbosse tagsüber (Boss-Tage laufen im Spiel wie Live, ohne Nacht).
- **Verbund-Kurse (`d/verbund.js`):** Faktor auf (Wert − 1), sodass das Element im eigenen Verbund (Bezugs-Aufbau) bei 1,00 liegt. Früher dasselbe Prinzip als SLOW_K = 2 (25.10.) und STEIN_K = 0,8. Neu: **Rüstungsschaden ×2,64** (an Stein gesucht, gilt für alle Elemente mit Rüstungsschaden), **Bremsen ×4,74** (an Eis).
- **Ergebnis** (Bodentage, Tag 1–12/13–24/25–36/37–48): Feuer **0,93** (0,96/0,91/0,92/0,92) · Eis **1,00** (0,87/1,04/1,03/1,10) · Schatten **1,03** (0,87/1,03/1,16/1,13) · Stein **1,00** (0,84/0,98/1,17/1,07). Fliegertage 0,69 / 0,61 / 0,80 / 0,21.
- **Neuer Haken:** Feuer fällt von 0,99 auf 0,93, weil der Rüstungs-Kurs für alle gilt (Feuer hat Rüstungsschaden 0,5). [Vermutung] Bei Stein wirkt der Rüstungsschaden zusammen mit der Fläche (ein Wurf senkt die Rüstung vieler Monster), bei Feuer kaum.
- **Drift** jetzt bei allen Effekt-Elementen ähnlich: Anfang ≈ 0,85, Ende ≈ 1,1–1,17. Schatten am Anfang durch die neuen Nächte 0,87 statt 0,77.
- **Empfindlichkeit** (L): jeder Kurs ±10 % (auf Wert − 1), alle 4 Elemente auf dem festen Bezugs-Aufbau über 48 Tage (`d/sens.js`, ca. 4–5 min je Variante).

## Empfindlichkeit der Kurse (27.10. nachts, `d/sens.js`)
Jeder Kurs einzeln ±10 % (auf Wert − 1), Türme neu zusammengesetzt, alle 4 Elemente auf dem festen Bezugs-Aufbau (Bodentage). Ausgang: Feuer 0,927 · Eis 1,002 · Schatten 1,034 · Stein 0,999.

| Kurs | ×0,9 | ×1,1 | betroffen |
|---|---|---|---|
| Reichweite | Feuer 0,924 · Eis 0,983 · Stein 0,986 | Eis 1,007 · Stein 0,997 | alle schwach |
| Geschosse | Schatten 1,025 | Schatten 1,043 · Eis 1,008 | Schatten, Eis |
| Rate | – | – | kaum |
| Fläche | Stein 0,985 | Stein 1,002 | Stein |
| **Brennen** | Feuer 0,942 | **Feuer 0,884** | nur Feuer |
| **Fluch** | Schatten 1,055 | Schatten 1,025 | nur Schatten |
| **Bremsen** | Eis 1,009 | Eis 0,972 | nur Eis |
| **Rüstungsschaden** | Feuer 0,935 · Eis 1,013 · Stein 1,018 | Feuer 0,893 · Eis 0,972 · Stein 0,967 | Feuer, Eis, Stein |
| Nova / Nova-Betäuben | Eis/Stein ±1 % | | Eis, Stein |
| Betäuben | – | – | keine Wirkung (keine Einzelziel-Betäuber mehr) |
| Nachtregel | Schatten 1,023 | Schatten 1,056 | nur Schatten |

- **±10 % auf einen Kurs verschieben ein Element um höchstens etwa 4 %, die Drift-Form (Anfang ≈ 0,85, Ende ≈ 1,1) ändert sich praktisch nicht.** Mit den Kursen lassen sich die Mittelwerte einstellen, die Drift nicht.
- Saubere Hebel je Element: Feuer → Brennen, Schatten → Fluch, Eis → Bremsen, Stein → Fläche / Rüstungsschaden.

## Nacht 27./28.10.: freier Bau, Maps 1/3, Platzwahl, Irrlicht
- **Kurse eingestellt:** Brennen ×0,65 und Fluch ×1,27 (auf Wert − 1, `d/fit1.js`), dazu Rüstungsschaden ×2,64, Bremsen ×4,74 (Verbund). Fester Bezugs-Aufbau (Bodentage): **Feuer 1,01 · Eis 1,00 · Schatten 1,01 · Stein 1,00**; Drift Tag 1–12 / 37–48: Feuer 1,00/1,03 · Eis 0,87/1,10 · Schatten 0,87/1,09 · Stein 0,84/1,07.
- **Freier Bau je Element** (alle 48 Tage inkl. Fliegertage, 1,00 = Ziel; Standardtürme: Bezug 1,00, Mensch A/B/C 0,98/0,95/0,92):

| Element | Bezugs-Bot | Mensch A | Mensch B | Mensch C |
|---|---|---|---|---|
| Feuer | **1,26** | 0,98 | 0,92 | 0,95 |
| Eis | 1,12 | 0,96 | 0,99 | 0,88 |
| Schatten | 1,10 | 0,98 | 0,97 | 0,94 |
| Stein | 0,87 | 0,73 | 0,76 | 0,72 (Fliegertage!) |

- **Feuer frei:** getragen von **Flammenwerfer** (im freien Aufbau durch Standard ersetzt: 0,78) und **Brandpfeil** (0,83); übrige Feuer-Türme 0,96–1,00. Schatten frei: kein einzelner Turm, Verbund insgesamt.
- **Kombinationen** (alle Türme): Flammenwerfer-Merkmale zusammen 0,57 statt Produkt der Einzelkurse ≈ 0,48 (zu billig bepreist, ×1,18); Brandpfeil 1,26 statt ≈ 1,22.
- **Platzwahl (`UMPLATZ=1`, Türme auf die besten Felder ihrer eigenen Reichweite):** Reichweite 1,5 / 2 / 2,5 / 3 / 4 / 5 / 6 = **0,67 / 0,77 / 0,91 / 0,96 / 1,03 / 1,14 / 1,21** (ohne Platzwahl 0,49 / 0,64 / 0,90 / 0,96 / 1,03 / 1,08 / 1,11). Kurze und lange Reichweite sind mehr wert, wenn der Turm passend steht – erklärt den Flammenwerfer im freien Bau. Für die Übersetzung sind die Kurse mit Platzwahl die richtigen (Spieler und Bot stellen Türme passend).
- **Maps 1 und 3** (Bezugs-Bot, Standardtürme, D6): Map 0 0,93 · Map 1 1,02 · Map 2 1,09 · Map 3 1,09. Map 0 ist der Ausreißer; im Mittel aller vier Maps liegt das Spiel etwa 3 % leichter als kalibriert (auf Map 0 + 2).
- **Irrlicht als Sonderturm** (Schatten element-rein, T2 = echtes Irrlicht wie im Spiel: Licht 4,4 Felder, ×1,3…1,8, Rüstung 30…100 %): Schatten **1,41** statt 1,01 (Tag 1–12 1,03 → 37–48 1,73). Werte fest auf Stufe 1: 1,31; Verstärkung halb: 1,27; doppelt: 1,68; Licht 3 Felder: 1,32. **Das Irrlicht ist im heutigen Spiel-Entwurf deutlich zu stark** (für 45 Gold).

## Stand 28.10. früh: Kurse mit Platzwahl, freier Bau ausgeglichen
- **Kurse mit Platzwahl** (Reichweite 1,5 → 0,67, 2 → 0,77, 5 → 1,14, 6 → 1,21; Nova Radius 2/2,5/3/3,5 → 0,79/1,16/1,53/1,93) in `d2.js`. Element-Test jetzt auch mit Platzwahl (`elemente6.js UMPLATZ=1`, Standard und Element werden auf die besten Felder ihrer eigenen Reichweite gesetzt).
- **Neu eingestellt** (`d/verbund.js`, `d/fit1.js`): Rüstungsschaden ×2,97, Bremsen ×9,47, Brennen ×0,59, Fluch ×1,29 (jeweils auf Wert − 1; jetzt Standard in `d2.js`). Fester Aufbau: Feuer 1,00 · Eis 1,00 · Schatten 1,01 · Stein 1,00 (Bodentage). Drift Tag 1–12 / 37–48: Feuer 0,98/1,02 · Eis 0,84/1,07 · Schatten 0,88/1,05 · Stein 0,82/1,03.
- **Freier Bau** (Bezugs-Bot frei je Element; Mensch-Bots A/B/C; Ziel = 1,00; Standardtürme: Bezug 1,01 Boden / 0,99 Flieger, Mensch 0,98/0,95/0,92):

| Element | Bezug Boden | Bezug Flieger | Mensch A/B/C Boden | Mensch A/B/C Flieger |
|---|---|---|---|---|
| Feuer | **1,04** (vorher 1,26) | 0,86 | 0,97 / 0,93 / 0,93 | 0,70 / 0,50 / 0,64 |
| Eis | 1,08 | 1,18 | 0,92 / 0,93 / 0,84 | 0,74 / 0,71 / 0,65 |
| Schatten | 1,02 | **1,48** | 0,96 / 0,95 / 0,93 | 0,99 / 1,06 / 0,93 |
| Stein | 1,00 | **0,28** | 0,94 / 0,93 / 0,88 | 0,15 / 0,21 / 0,19 |

- **An Bodentagen sind die Elemente beim freien Bau jetzt innerhalb von +8 %** (Eis am stärksten). Die Mensch-Bots liegen bei Eis etwas tiefer als bei den anderen.
- **Fliegertage sind die größte Baustelle:** Schatten zu stark (Nachtauge als Luftspezialist), Stein sehr schwach (2s/4/6/8, von L in Kauf genommen), Mensch-Bots bei Feuer/Eis schwach (sie bauen viele Türme ohne Luftangriff).

## Wetter je Element (28.10. nachts, `elemente6.js MIT_WETTER=1 WETTER_REL=1`, Bezugs-Aufbau mit Platzwahl, heutige Wetter-Werte)
Wert = dieselben Element-Türme mit ÷ ohne dieses Wetter (Bodentage; in Klammern Fliegertage, wo abweichend).

| Wetter (Gewicht) | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Sonnig (3) | **1,15** | 0,98 | 1,07 | 1,00 |
| Bewölkt (3) | 1,00 | 1,00 | **0,84** | 1,00 |
| Regen (2) | **0,87** | 1,06 | 0,93 | 1,00 |
| Gewitter (1) | **0,87** | 1,01 | **0,81** | 1,00 (Flieger 1,28) |
| Nebel (1,5) | 0,96 | 0,94 | 1,10 | 0,93 |
| Frost (1) | 0,93 | 1,08 | 1,00 | 1,00 |
| Hitze (1) | **1,28** | 0,95 | 1,00 | 1,00 |
| Wind (1,5) | 0,98 (Flieger 0,87) | 0,99 (0,90) | 1,00 (0,91) | 0,99 (**0,62**) |
| **gewichtetes Mittel** | ×1,005 | ×0,998 | **×0,962** | ×0,992 |

- Im Mittel fast neutral (Schatten −4 %), aber **einzelne Wetter weit über der 10-%-Grenze** (L): Feuer bei Hitze +28 %, Sonnig +15 %, Regen/Gewitter −13 %; Schatten bei Gewitter −19 %, Bewölkt −16 %.
- Stein ist in D nicht wetterfest (`weatherproof` aus D0 = false): Nebel (Reichweite) trifft ihn mit −7 %. Wind macht Fliegende schneller (Stein an Fliegertagen 0,62), Gewitter langsamer (1,28).
- Grundlage für L's Wetter-Entwurf (höchstens 10 %, ausgeglichen).

## Irrlicht (28.10. nachts, Fortsetzung)
- Aufgeteilt (Schatten element-rein, Bodentage): nur Licht (keine Verstärkung, keine Rüstung) **1,06** · + Rüstung ignorieren **1,13** · Verstärkung ×0,5 ohne Rüstung 1,19 · volle Verstärkung ohne Rüstung 1,32 · alles (Spiel) **1,41**. Bezug: Schatten mit normalem Fluch-T2 1,01.
- Schon das reine Licht (Nachtsicht) ist mehr wert als der Fluch-Turm an seiner Stelle. Die Nachtregel ist im Kurs mit 0,86 bezahlt, mit Irrlicht fällt sie weitgehend weg. **Vorschlag (Entscheidung L):** Nachtregel-Kurs für Schatten mit Irrlicht neu bestimmen und die Verstärkung des Irrlichts so wählen, dass Schatten mit Irrlicht bei 1,00 liegt (Messung: etwa ×0,1–0,2 der heutigen Verstärkung, ohne Rüstungsanteil), oder das Irrlicht teurer machen.

## Drift-Experiment: frühe Türme mit kurzer Reichweite (28.10. nachts, `d/exp-drift.sh`, Kurse unverändert, mit Platzwahl)
Bodentage, Tag 1–12 / 13–24 / 25–36 / 37–48 (Spanne = größter − kleinster Abschnitt):

| Variante | Eis | Schatten | Stein |
|---|---|---|---|
| heute (T1 Reichweite 3) | 0,84/1,04/1,08/1,07 (0,24) | 0,88/1,01/1,14/1,05 (0,26) | 0,82/1,04/1,19/1,03 (0,37) |
| A: T1 Reichweite 2 | 0,87/0,96/1,06/1,02 (0,19) | 0,91/0,99/1,11/1,03 (0,20) | 0,85/1,03/1,14/1,02 (0,29) |
| B: T1 und T2 Reichweite 2 | 0,86/0,94/0,99/1,05 (0,19) | 0,91/0,97/1,08/1,00 (0,17) | 0,81/1,02/1,11/0,99 (0,30) |
| C: T1 Reichweite 1,5 | 0,90/0,95/1,06/1,08 (0,18) | 0,92/1,01/1,14/1,03 (0,22) | 0,89/1,09/1,15/1,02 (0,26) |

| D: T1 2 Geschosse | 0,88/1,05/1,11/1,04 (0,23) | 0,93/1,02/1,16/1,04 (0,23) | 0,88/1,02/1,17/1,03 (0,29) |
| E: T1 3 Geschosse | 0,89/1,04/1,16/1,05 (0,27) | 0,93/1,01/1,17/1,04 (0,24) | 0,86/1,01/1,18/1,01 (0,32) |

- Mehrere Geschosse heben vor allem den Anfang (bis 0,93), verkleinern die Spanne aber kaum.
- Kurze Reichweite an den frühen Türmen verringert die Drift um etwa ein Viertel. Tag 1–12 bleibt bei 0,86–0,92: Mit wenigen Türmen wirken Bremsen, Fluch und Rüstungsschaden kaum. Ganz weg bekommt man die Drift mit Turm-Merkmalen allein nicht.

## Irrlicht mit kleinem Lichtkreis (28.10. morgens, L: so klein, dass man am Anfang zwei braucht; mit Platzwahl)
Schatten element-rein, Bodentage (Tag 1–12/13–24/25–36/37–48):

| Licht | Verstärkung | Rüstung ignorieren | Schatten |
|---|---|---|---|
| 2,5 Felder | aus | wie Spiel | 1,13 (0,90/1,20/1,31/1,20) |
| 2,5 | halb | aus | 1,19 (0,93/1,26/1,40/1,27) |
| 2,5 | wie Spiel (1,3–1,8) | aus | 1,31 (0,97/1,37/1,55/1,48) |
| 2 | wie Spiel | aus | 1,10 (0,94/1,18/1,23/1,11) |
| 2 | aus | aus | **1,02** (0,89/1,08/1,17/1,00) |

- Mit 2 Feldern Licht ist das reine Licht (Nachtsicht) etwa so viel wert wie der Fluch-Turm, den es ersetzt. Jede Verstärkung kommt obendrauf: volle Verstärkung +8 %.

## Nächste Schritte
1. D1 Grundturm im Simulator (Kopie eines Turms ohne Effekt, Rate/Reichweite fest, Schaden ∝ Gold).
2. D2 Wechselkurse messen: Rate, Reichweite, Fläche, dann Effekte (echte Leben, mehrere Tage, Maps 0–3).
3. D3 heutige Türme als Grundturm + Merkmale beschreiben, Schaden/Schuss folgt → `spiegel-D1.json`.
4. D4 Monster nach Einkommen, D5 Bot-Lauf nur zur Prüfung.

## Wetter-Entwurf, Wind mit Richtung, Baubonus Stein (28.10. vormittags, L: Vorteile überwiegen, Stein wetterfest + Baubonus)
- **Nur Schaden:** Wetter, das nur den Schaden eines Elements ändert, wirkt exakt (Schaden ×1,08 → Reserve ×1,077). Entwurf daher ohne Reichweite/Dauer/Effekt, keine Messung nötig.
- **Entwurf** (je Wetter höchstens +8 % / −4 %, Gewichte wie heute): Sonnig Feuer +8 · Bewölkt Schatten +7 · Regen Eis +8, Feuer −3 · Gewitter Schatten +6, Feuer −4 · Nebel Eis +5, Schatten +3 · Frost Eis +8, Feuer −4 · Hitze Feuer +8, Eis −4 · Wind Feuer +7 + Richtung. Gewichtetes Mittel: Feuer +2,0 %, Eis +2,0 %, Schatten +2,3 %, Stein 0 (wetterfest).
- **Wind mit Richtung** (`basis/patch.js` `windMul`, `elemente6.js WIND=dx,dy,mitBoden,gegenBoden,mitFlug,gegenFlug`): Tempo × (1 + mit·cos) bzw. (1 − gegen·|cos|) je Wegstück. Symmetrisch ±10 %/±20 % ist fast neutral (Feuer 0,985–1,016). Asymmetrisch Boden +10/−20 %, Flug +20/−40 %: Feuer Boden 0,99–1,05 (Mittel 1,016), Flieger 1,02–1,13. Stein reagiert deutlich stärker (Würfe treffen langsame Monster besser): Boden +10/−20, Flug +20/−30: 0,97/1,12/1,03/1,04 (Osten/Westen/Süden/Norden), Flieger 0,80–1,32. Schwächer (Boden +6/−10 %, Flug +10/−15 %): Stein Boden 0,98/1,055/1,01/1,02 (Mittel 1,02), Flieger 0,88–1,15. → Für ±10 % je Wetter (L) Flug auf etwa +8/−10 % und Wind-Feuer auf +5 %, damit Feuer bei Gegenwind nicht über 1,10 kommt.
- **Baubonus Stein** (`terrainFree` in D bisher aus; freier Bau bezug3, Stein, mit ÷ ohne): Tag 1–12 1,00 · 13–24 1,05 · 25–36 1,15 · 37–48 1,03, gesamt **+5 %** (Bot-Streuung ±5 %). Gleicht den Wetter-Vorteil der anderen (+2 %) mehr als aus; hilft am Anfang nicht.
- **Wetter gegen Drift:** Mit je einem Bonus-Element je Wetter kann ein Element im Mittel höchstens um ≈ 8 %/3 ≈ 2,7 % angehoben werden (Lösung mit Jahreszeiten-Gewichten: Block 1 Eis +2 %, Schatten +3 %). Die Drift ist 15–35 % → Wetter fängt höchstens ein Zehntel auf.

## Rüstung und Drift (28.10. vormittags, L: Relation Rüstung zu Leben, `elemente6.js RUEST=0 / RUEST_ADD=p,q / RUEST_MUL=k / RUEST_TAGE`)
Mechanik: Standardtürme haben keinen Rüstungsschaden, die Punkte bleiben → für sie wirkt Rüstung dauerhaft als −Prozent. Feuer (Brennen geht durch), Eis/Stein (Punkte abtragen) und Schatten (Fluch senkt Prozent) gewinnen dagegen. Element ÷ Standard hängt nicht von den Leben ab. Bodentage, Tag 1–12 / 13–24 / 25–36 / 37–48:

| Variante | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| heute | 0,98/1,01/0,99/1,02 | 0,84/1,04/1,08/1,07 | 0,88/1,01/1,14/1,05 | 0,82/1,04/1,19/1,03 |
| keine Rüstung | 0,94/0,90/0,91/0,89 | 0,80/0,91/0,98/0,98 | 0,85/0,89/1,02/0,95 | 0,76/0,81/0,97/0,87 |
| alle +15 % / +0,3 Punkte | 1,00/1,06/1,05/1,03 | 0,85/1,05/1,10/1,06 | 0,90/1,06/1,21/1,11 | 0,90/1,18/1,36/1,13 |
| alle ×1,5 | 0,97/1,10/1,06/1,03 | 0,84/1,12/1,13/1,07 | 0,88/1,07/1,20/1,07 | 0,84/1,23/1,38/1,11 |
| nur Tag 1–12: +30 % / +0,05 Punkte | 1,25 | 1,08 | 0,91 | 1,13 |
| nur Tag 1–12: +30 % / +0,3 Punkte | 1,09 | 0,96 | 0,91 | 1,07 |

- Rüstung trägt einen großen Teil des Buckels in Tag 13–36 (ohne Rüstung: Schatten 1,02 statt 1,14, Stein 0,97 statt 1,19).
- **Hohe Prozent mit dünnen Punkten** am Anfang heben Eis und Stein stark (über 1), Feuer aber noch mehr (Brennen geht durch), Schatten kaum (wenige Fluch-Türme). Dicke Punkte dämpfen Eis/Stein, nicht Feuer.

## Code-Prüfung (28.10., Claude)
- Keine versteckten Upgrade-Zuwächse mehr: Reichweite, Rate, Geschosse, Fläche, Effekt, Dauer, Chance, Licht, Verstärkung, Rüstung ignorieren sind für alle 32 Türme auf S1–S6 gleich. Kraft je Gold folgt der Kurve 1/0,95/1,01/1,08/1,16/1,25.
- **Gefunden: Aufrunden des Schadens/s auf 0,1** (`ceil1`) verschob T1 je Element unterschiedlich (Feuer +0,7 %, Standard +3,0 %, Eis +3,9 %, Schatten +4,1 %, Stein +3,7 %) und T1 auf S6 um bis zu +2,3 % gegenüber der Kurve. Behoben: `D_GENAU=1` (Standard in `d/bots.js`) rechnet in Zweig D ohne Aufrunden (`basis/patch.js`). Wirkung auf die Element-Werte ≤ 1 %.
- Kleinigkeit: Rüstungspunkte werden auf ganze Punkte gerundet (Tag 2: 7 % zu viel), Rest < 5 %.
- Offen gelassen (bewusst): Stein in D noch nicht wetterfest und ohne Baubonus (`weatherproof`/`terrainFree` aus, kommt mit Wetter und Gelände).

## Rüstungsregeln (28.10., L: entscheide)
- Zerlegung Feuer Tag 1–12 mit +30 % Rüstung/dünne Punkte: normal 0,98 → 1,24; ohne Brennen 0,84 → 1,06; **ohne Rüstungsschaden 0,96 → 0,99**. Feuer hängt über den Rüstungsschaden an der Rüstung, nicht über das Brennen – relativ steigen Feuer (+27 %) und Eis (+29 %) gleich, Stein stärker (+38 %), Schatten kaum (+3 %).
- **Entscheidung:** Brennen bleibt rüstungsfrei (Option `CONFIG.burnArmor`/`BRENN_RUEST` bleibt, Standard 0). Schatten ohne Rüstungsschaden: mit 0,2 (`RUEST_EL=0.5,0.6,0.2,1.5`) fällt Schatten auf 0,94 (der Verbund-Kurs aus Stein bepreist es zu teuer), gewinnt bei Rüstung am Anfang aber nur +11 %.
- Folge: Rüstung je Block ist vor allem ein **Stein-Hebel** (und hebt Feuer/Eis gemeinsam). Den Abstand Eis–Feuer am Anfang schließt sie nicht.

## Weitere Drift-Hebel (28.10.)
| Experiment (Bodentage, Tag 1–12/13–24/25–36/37–48) | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Ausgang (D_GENAU) | 0,99/1,01/0,99/1,02 | 0,83/1,03/1,08/1,07 | 0,87/1,00/1,14/1,05 | 0,81/1,03/1,18/1,04 |
| Stapelanteil weiterer Effekte 0,1 statt 0,2 | 0,98/1,00/0,97/0,99 | 0,81/0,97/1,06/1,03 | 0,86/0,97/1,10/1,01 | – |
| Stapelanteil 0,35 | 0,99/1,04/1,03/1,05 | 0,88/1,13/1,12/1,20 | 0,88/1,05/1,20/1,11 | – |
| T1 ohne Effekt | – | 0,86/0,97/1,06/1,06 | 0,95/1,04/1,16/1,05 | – |
| T1 + T2 ohne Effekt | – | 0,90/1,05/1,09/1,12 | 0,95/1,04/1,16/1,06 | – |
- Stapelanteil: Drift positiv (hinten stärker), für Feuer schwach (+6 % Steigung von 0,1 auf 0,35), für Eis/Schatten stark. Heute ein Wert für alle drei Effekte; je Effekt getrennt wäre ein sauberer Drift-Hebel.
- Frühe Turmtypen ohne Unterstützungs-Effekt (reiner Schaden) heben den Anfang um 3–8 %.

## Drift-Form angleichen (28.10. vormittags, L: erst Form gleich, dann gemeinsame Drift über die Leben)
Werkzeug: `d/exp-form.sh <Varianten>` (Name|d2-Umgebung|elemente6-Umgebung, alle 4 Elemente mit Platzwahl) und `d/form.py <log>`: **Form-Rest** = Abweichung je Element und Block, nachdem Niveau je Element und gemeinsame Drift herausgerechnet sind (das, was die Leben nicht abtragen können). Neue Schalter: `STAPEL_EL=Brennen,Bremsen,Fluch` (d2, `CONFIG.stackRest`), `RUEST_BLOCK='p,q,k;…'` und `KRAFT_BLOCK='e:f1,…'` und `NACHT='Tag:0/1,…'` (elemente6).

| Variante (kumulativ) | Form-Rest | gemeinsam (Block 1–4) | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|---|---|
| A heute | 5,2 % | 0,87/1,01/1,09/1,04 | +14/−1/−9/−2 | −4/+2/−1/+3 | −1/−2/+3/0 | −7/+1/+8/−1 |
| B Rüstung: Block 1 +30 %/+0,3 Punkte, Block 3 ×0,5 | 4,6 % | 0,97/0,99/1,02/1,02 | +10/0/−7/−2 | −5/+2/+1/+3 | −8/0/+7/+2 | +4/−1/0/−3 |
| C + Stapelanteil Brennen 0,35, Bremsen/Fluch 0,15 | 4,1 % | 0,97/0,99/1,02/1,02 | +9/0/−7/−2 | −4/+1/+1/+3 | −8/0/+6/+2 | +4/−1/0/−3 |
| D + Eis T1/T2 und Schatten T1 ohne Effekt | 3,2 % | 0,99/0,99/1,01/1,01 | +6/0/−5/0 | −1/+1/−2/+2 | −6/0/+7/−1 | +1/−1/+1/−1 |
| E + Feuer-Wetter im Mittel Block 1 −4 %, Block 3 +4 % | 2,5 % | 0,98/0,99/1,02/1,01 | +3/0/−3/0 | −1/+1/−3/+3 | −5/0/+5/−1 | +2/−1/0/−1 |
| F + Fluch-Stapel 0,1 | 2,2 % | 0,98/0,99/1,02/1,00 | +3/0/−3/0 | −1/+1/−3/+3 | −4/+1/+5/−1 | +2/−1/0/−1 |
| H wie F, Feuer-Wetter −6 %/+6 % | 2,2 % | 0,97/1,00/1,03/1,01 | +1/0/−1/0 | 0/+1/−3/+2 | −4/0/+5/−1 | +3/−1/0/−1 |
| **I** = H + Füchse (Tag 11) tagaktiv, Krieger (Tag 31) nachtaktiv | **1,3 %** | **0,99/1,00/1,01/1,01** | −1/0/+1/0 | −2/+1/−1/+3 | +2/+1/−1/−1 | +1/−1/+2/−1 |

- **I absolut** (Bodentage): Feuer 1,05 (1,03/1,04/1,06/1,05) · Eis 1,04 (1,01/1,04/1,03/1,07) · Schatten 1,02 (1,03/1,02/1,01/1,01) · Stein 1,05 (1,05/1,03/1,07/1,04). Die Drift ist im festen Aufbau praktisch weg; die Niveaus (1,02–1,05) stellen die Kurse ein.
- Stärkste Hebel: **Rüstung je Block** (gemeinsame Drift und Stein), **frühe Turmtypen ohne Effekt** (Eis, Schatten), **Feuer-Wetter je Block**, **ein Nacht-Tausch** (je Tausch ≈ ±8 % in den beiden Blöcken für Schatten; zwei Tausche schießen über). Stapelanteil je Effekt wirkt schwach.
- Offen: echtes Wetter statt `KRAFT_BLOCK` (Feuer im Mittel −6 % in Block 1, +6 % in Block 3), Prüfung im freien Bau, Kurse neu einstellen, Leben neu kalibrieren (Rüstung geändert), Entscheidungen L (Nacht-Tausch, frühe Türme ohne Effekt).

### Ohne frühe Türme ohne Effekt und ohne halbe Rüstung (L 28.10. 10:46: Bremsen früh bleibt; Rüstung hinten möglichst unverändert)
Alle mit Stapel 0,35/0,15/0,1, Feuer-Wetter 0,94/1/1,06/1, Nacht-Tausch Füchse ↔ Krieger:

| Variante | Form-Rest | gemeinsam | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|---|---|
| J Block 1 +15 %/+0,15 | 2,9 % | 0,92/1,00/1,07/1,02 | +4/0/−2/−1 | −4/+1/0/+3 | +4/−1/−3/0 | −4/0/+6/−2 |
| K Block 1 +30 %/+0,3 | 2,3 % | 0,96/0,98/1,06/1,01 | +2/+1/−2/−1 | −4/+1/0/+3 | 0/0/−2/+2 | +2/−2/+4/−4 |
| L wie J, Block 3 ×0,75 | 2,5 % | 0,92/1,00/1,05/1,03 | +4/0/−2/−2 | −4/+1/0/+3 | +4/−1/−3/0 | −4/0/+5/−1 |
| M wie J, Block 4 +10 %/+0,1 | 2,7 % | 0,91/0,98/1,06/1,06 | +4/0/−3/−1 | −3/+1/0/+2 | +5/−1/−3/−1 | −5/−1/+5/0 |
| **N** = K + Eis-Wetter 1,04/1/1/0,97 | **1,8 %** | 0,97/0,98/1,06/1,00 | +1/+1/−2/0 | −1/+1/0/+1 | −1/0/−2/+2 | +1/−2/+4/−3 |

- Mehr Rüstung hinten (M) hebt **alle** Elemente hinten (gemeinsam 1,02 → 1,06), flacht Eis/Stein nicht ab: Elemente mit Rüstungsschaden gewinnen gegenüber dem Standardturm, je mehr Rüstung.
- **N** absolut: Feuer 1,05 (1,03/1,04/1,09/1,05) · Eis 1,01 (0,97/1,00/1,07/1,02) · Schatten 0,99 (0,95/0,97/1,02/1,01) · Stein 1,07 (1,05/1,03/1,18/1,04). Die gemeinsame Delle (Block 3 +6 %) tragen die Leben ab.
- Wetter-Mittel je Block damit: Feuer −6/0/+6/0 %, Eis +4/0/0/−3 % (Winter → Sommer → Herbst).

## D7 (28.10. mittags): Drift-Form und Niveaus fest eingebaut
- `d/d2.js` erzeugt jetzt standardmäßig D7 (`D7=0` = alter Stand): Rüstung Tag 1–12 +30 %/+0,3 Punkte, Füchse tagaktiv, Krieger nachtaktiv, Stapelanteil Brennen 0,35/Bremsen 0,15/Fluch 0,1, Wetter-Mittel als `kraftBlock` (Feuer 0,94 in Runde 1–10, 1,06 in 21–30; Eis 1,04 in 1–10, 0,97 in 31–40; neu in `basis/patch.js`, je 5 Runden nach der Runde der Welle).
- Niveaus neu (`d/fit1.js`, mit Platzwahl): **Rüstungsschaden 3,6** (vorher 2,97; wirkt je Element konstant, ändert die Form nicht – damit Stein auf 1,00), **Bremsen 7,45** (vorher 9,47), **Brennen ×0,67** (vorher 0,59), Fluch ×1,29. Fläche taugt nicht als Stein-Hebel: ändert vor allem den Anfang (×0,45 → 0,94/0,96/1,14/1,02).
- Spiegel: `spiegel-D7T.json` (Elementtürme), `spiegel-D7.json` (Standardtürme mit denselben Monstern, für Bots und Leben).
- **Fester Aufbau** (Bodentage): Feuer 1,00 (0,99/0,99/1,03/0,99) · Eis 1,00 (0,95/0,98/1,05/1,03) · Schatten 0,99 (0,95/0,97/1,02/1,01) · Stein 1,00 (0,98/0,96/1,10/0,96). Form-Rest 2,2 %, gemeinsam 0,97/0,98/1,05/1,00. Auffällig nur Stein in Tag 25–36 (+5 %).
- **Freier Bau** (bezug3 je Element ÷ bezug3 mit Standardtürmen auf `spiegel-D7.json`, `d/frei-vergleich.py`), Bodentage (Tag 1–12/13–24/25–36/37–48): Feuer **1,06** (1,02/1,07/1,10/1,05) · Eis **1,06** (1,05/0,97/1,12/1,11) · Schatten **0,98** (1,01/0,86/0,99/1,06) · Stein **1,00** (1,04/1,03/0,98/0,96). Fliegertage 0,89 / 1,25 / 1,40 / 0,33. Der Anfang ist kein Problem mehr; die Blöcke streuen im freien Bau ±5–10 % (Bot-Pfad). Feuer und Eis sind frei etwa 6 % stärker als fest (Kombination der Türme).
- Standardtürme auf D7 (mehr Rüstung Tag 1–12): Bezugs-Bot 0,89 der Ziel-Kurve, Tag 1–12 0,65 → **Leben neu kalibrieren** (`d/ziel4.js` auf D7).

## Wetter D7 mit eigenen Noten und Jahreszeiten (28.10. nachmittags)
Gemessen je Wetter mit `elemente6.js MIT_WETTER=1 WETTER_REL=1` (Bodentage, Wind über 4 Richtungen gemittelt). Stein ist wieder **wetterfest** (nur Wind/Gewitter wirken über das Monster-Tempo) und hat den **Baubonus** (`terrainFree`).

| Wetter | Mechanik | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|---|
| Sonnig | Feuer Schaden +7,5 %, Effekt +5 %; Schatten −4 % | 1,08 | 1,00 | 0,96 | 1,00 |
| Bewölkt | Schatten +7 % | 1,00 | 1,00 | 1,07 | 1,00 |
| Regen | Brennen kürzer (×0,8); Eis Bremsen +15 %, Schaden +4,5 % | 0,98 | 1,06 | 1,00 | 1,00 |
| Gewitter | Brennen kürzer; Schatten +6 %; Fliegende ×0,96 | 0,98 | 1,00 | 1,06 | 1,00 (Flieger höher) |
| Nebel | Reichweite ×0,92 (nicht Stein); Schatten +8 % | 0,99 | 0,97 | 1,05 | 1,00 |
| Frost | Feuer −8 %; Eis Bremsen +15 %, Dauer +20 %, Schaden +5 % | 0,92 | 1,07 | 1,00 | 1,00 |
| Hitze | Feuer +8 %, Effekt +10 %; Eis Dauer ×0,8, Schaden −2 % | 1,10 | 0,97 | 1,00 | 1,00 |
| Wind | Richtung je Tag: Boden +5/−7 %, Flug +8/−10 %; Feuer Effekt +10 % | 1,02 (1,02–1,03) | 1,00 (0,97–1,03) | 1,00 | 1,01 (0,98–1,04; Flieger 0,90–1,12) |

Gewichte je Block (`WEATHER[k].wB`, Anteil der Tage; im Spiel noch einzubauen):

| Block | Sonnig | Bewölkt | Regen | Gewitter | Nebel | Frost | Hitze | Wind | Mittel Feuer / Eis / Schatten |
|---|---|---|---|---|---|---|---|---|---|
| Tag 1–12 Winter | 4 | 4 | 35 | 10 | 4 | 35 | 4 | 4 | 0,97 / 1,05 / 1,01 |
| Tag 13–24 Frühling | 4 | 22 | 33 | 4 | 4 | 4 | 25 | 4 | 1,02 / 1,02 / 1,02 |
| Tag 25–36 Sommer | 29 | 14 | 6 | 4 | 4 | 4 | 35 | 4 | 1,05 / 1,00 / 1,00 |
| Tag 37–48 Herbst | 11 | 4 | 4 | 7 | 35 | 4 | 17 | 18 | 1,02 / 0,99 / 1,02 |

- Die Mittel stehen in den Tests als `kraftBlock` (Tests laufen ohne Wetter). Im Mittel über das Spiel: Feuer +1,5 %, Eis +1,4 %, Schatten +1,3 %, Stein 0 (Baubonus gleicht aus, frei ≈ +5 %).
- Feuer-Kontrast Block 3 − Block 1 nur 8 % statt der gewünschten 12 % (mehr ginge nur mit fast nur einem Wetter je Block).
- Niveaus danach (fester Aufbau, Ziel L: Feuer/Eis 0,97 fest, damit frei ≈ 1,03): Brennen ×0,834, Bremsen 10,77, Rüstungsschaden 3,6, Fluch ×1,29.
- **Leben neu kalibriert** (`d/ziel4.js`, zwei Runden auf `spiegel-D7.json`): Bezugs-Bot mit Standardtürmen 1,00 der Ziel-Kurve in allen Blöcken (schwächster Tag 0,88, Tag 39). Leben im Mittel ×0,89 gegenüber D6, Tag 1 ×0,68 (wegen der neuen Rüstung in Tag 1–12).
- Stein T3/T7 „schwach gegen Fliegende“ statt „keine Fliegenden“ (L, Idee): fest Boden 0,998 statt 0,995, Flieger 0,20 statt 0,18 → kaum Wirkung, bleibt wie bisher.

## Ergebnis D7 (28.10. abends): fester Aufbau und freier Bau
| Bodentage (Tag 1–12/13–24/25–36/37–48) | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| fester Aufbau (Ziel L: Feuer/Eis 0,97) | 0,97 (1,01/0,96/0,97/0,96) | 0,97 (0,93/0,96/1,01/0,99) | 1,00 (0,97/0,99/1,02/1,03) | 1,00 (0,99/0,95/1,10/0,97) |
| freier Bau ÷ Standard-Bot | **1,03** (1,01/1,07/0,97/1,08) | **1,07** (1,03/1,00/1,13/1,13) | **1,00** (1,00/0,87/1,00/1,16) | **1,06** (1,05/1,01/1,12/1,09) |
| Fliegertage frei | 0,86 | 1,20 | 1,43 | 0,32 |

- Form-Rest fest 2,8 % (gemeinsam 0,99/0,98/1,04/1,00). Feuer am Anfang +5 %, weil das echte Wetter den Feuer-Kontrast nur zu zwei Dritteln schafft.
- Standard-Bot nach der Lebens-Kalibrierung: 1,00 (1,02/1,00/0,99/0,99), schwächster Tag 0,91.
- Stein frei mit Baubonus 1,06 (vorher ohne 1,00) – leicht stärker als Ausgleich für die Fliegertage (L).
- **Auffällig:** Eis frei 1,07 (10 % über fest, hinten 1,13); Schatten frei Tag 13–24 0,87 in zwei Läufen gleich (drei Nächte in Block 2: Wildschweine, Penner, Geliebte), Tag 37–48 1,16. Vorschlag: Eis −3 %, einen Nacht-Tausch Block 2 → Block 4.
- Laufzeiten (2 Kerne): Element-Bot frei 13–36 min, Standard-Bot 10 min, fester Aufbau 1,5 min je Element.

### 2. Nacht-Tausch und Eis −3 % (28.10. abends, L: Geliebte tagsüber, Lindner-Spezialisten nachts)
- Nachtaktiv jetzt: Tag 5, 9, 16, 19, 27, 31, 33, 37, 38, 40, 44 (Block 1: 2, Block 2: 2, Block 3: 3, Block 4: 4 inkl. Fledermäuse).
- Schatten frei: **1,00** (1,00/**0,93**/1,00/**1,07**), vorher 0,87 und 1,16 in Block 2 und 4. Fliegertage 1,47.
- Eis: Bremsen 13,53 (fest 0,94: 0,91/0,93/0,98/0,95). Frei aber nur 1,07 → **1,06** (1,03/1,05/1,08/1,07, flacher). Der Bot gleicht die teureren Bremsen über die Kombination aus; der Abstand fest–frei wächst auf 12 %. Weiter senken bringt frei wenig und drückt den festen Aufbau.

## Fliegende: Tempo und Rüstung (28.10. spät, fester Aufbau, Fliegertage, Element ÷ Standard; `elemente6.js MON=…`)
Heute: Spatzen 1,5 · Habichte 1,8 · Uffug-Vorhaut 1,0 · Phönixe 1,4 · Looping-Louie 1,7 · Fledermäuse 1,6 (nachts) · Nazgul 1,5 (Boden im Mittel 1,12).

| Variante | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| V0 heute (D7, Spatzen mit Zusatzrüstung 30 %/0,3) | 0,71 | 0,51 | 0,77 | 0,180 |
| V1 Spatzen ohne Rüstung | 0,69 | 0,50 | 0,77 | 0,175 |
| V2 = V1 + Tempo Spatzen 1,2 · Habichte 1,6 · Uffug-Vorhaut 0,8 · Phönixe 1,1 · Looping-Louie 1,3 · Fledermäuse 1,0 · Nazgul 0,9 | 0,75 | 0,51 | 0,81 | **0,219** |
| V3 = V2 + Rüstung Uffug-Vorhaut 35 %/0,5 · Looping-Louie 40 %/0,5 · Nazgul 45 %/0,6 | 0,77 | 0,53 | 0,81 | **0,233** |

- Langsamere Fliegende helfen Stein am meisten (+25 %, Würfe treffen), Feuer +8 %, Schatten +5 %, Eis +3 % – jeweils gegenüber dem Standardturm, der ebenfalls profitiert. Die Leben je Tag gleicht die Kalibrierung danach wieder aus.
- Gepanzerte Fliegende helfen den Elementen mit Rüstungsschaden etwas (Stein +6 %, Feuer/Eis +3 %), Schatten kaum.

## D7 mit Fliegenden neu (29.10. nachts)
- **Fehler gefunden (Claude):** `flyMul` (Luftspezialist Fliegende 180 %, Schleuder 50 %) stand in den Turmwerten, wurde aber in `hit` nie angewandt. Behoben in `basis/patch.js`. Folge: Eis und Schatten an Fliegertagen deutlich stärker, Stein-Schleuder schwächer.
- Neu: Looping-Louie-Tiefflug (`lowFly`, ⅓ des Wegs tief), Fliegende mit Tempo und Rüstung wie oben, Spatzen ohne Rüstung, Stapel Bremsen 0,05.
- Runde 1 (fest: Stein 1,03 über „keine Fliegenden“ ×1,17, Feuer 0,96, Schatten 0,96 über Nacht ×0,683, Eis 0,945; Leben neu kalibriert, Standard-Bot 0,99–1,00): **frei** Feuer 1,04 (1,03/1,06/0,97/1,08) · Eis 1,05 (1,05/1,02/1,03/1,12) · Schatten 0,94 (0,97/0,88/0,89/1,00) · Stein 1,01 (1,02/0,99/1,04/0,99). **Fliegertage** 0,90 / **1,80** / **2,05** / 0,36.
- Abstand fest → frei streut je Element: Feuer +8 %, Eis +10 %, Schatten −2 %, Stein −2 % (mit Baubonus!). Runde 2 mit verschobenen festen Zielen (Stein 1,11 → „keine Fliegenden“ ×1,30; Feuer 0,94 → Brennen ×1,08; Schatten 0,98 → Nacht ×0,687; Eis 0,89 → Bremsen 23,1).
- Fliegertage nach dem Fehler-Fix: Spanne Schatten 2,05 bis Stein 0,36. Das Mittel der vier liegt bei 1,05 (Leben an Fliegertagen müssen dafür kaum angepasst werden). **Entscheidung L:** Luftspezialisten von 180 % auf etwa 140 % senken?
- **Runde 2 frei:** Feuer 1,04 (1,00/1,02/1,08/1,07) · Eis 1,07 (1,02/1,01/1,07/1,19) · Schatten 0,92 (0,92/0,88/0,89/1,01) · Stein 1,15 (1,17/1,18/1,17/1,10). Fliegertage 0,84 / 1,71 / 2,40 / 0,27. Doppelt so teures Bremsen (23,1) änderte Eis frei nicht.
- **Diagnose (`d/frei6.js`, Turmtyp im freien Plan durch Standard ersetzt):** Eis ohne Frostnova 0,77, Stein ohne Erdbeben 0,855 – die **Nova-Türme** tragen die Stärke im freien Bau (als einzelner Turmtyp im gemischten Aufbau mehr wert als der Kurs „alle Türme Nova“). Übrige Turmtypen 0,92–1,02.
- Runde 3: Nova-Kurs ×1,2 (`NOVA_K`), Bremsen zurück auf 10,77.
- **Runde 3 frei** (Nova ×1,2, Bremsen 10,77; Feuer/Schatten aus Runde 2): Feuer 1,04 (1,00/1,02/1,08/1,07) · Eis **1,03** (1,05/1,00/1,03/1,03) · Schatten **0,92** (0,92/0,88/0,89/1,01) · Stein **1,11** (1,17/1,12/1,11/1,04). Fliegertage 0,84 / 2,00 / 2,40 / 0,31 (geometrisches Mittel 1,06 → Leben an Fliegertagen passen im Mittel).
- Ziele (L): Stein 1,08–1,10, Feuer ≈ 1,02, Eis ≈ 0,98, Schatten ≈ 0,96. Abweichung jetzt +1…+5 %, Schatten −4 %. Der freie Bau streut je Lauf etwa ±3–5 % (2 Maps); feiner einstellen lohnt erst mit mehr Maps (doppelte Laufzeit).
- Offen (L): Luftspezialisten 180 % (Schatten an Fliegertagen 2,4, Eis 2,0) senken? Schatten Tag 13–36 schwach (0,88/0,89).

## Luftspezialist 140 % und echtes Irrlicht (29.10. morgens, L)
- Diagnose Schatten frei (Runde 2, `elemente6.js PLAN=<freier Plan> ABL=…`): ohne Nachtregel +14/+14/+27/+24 %, ohne Fluch −9/−16/−18/−18 % – keins von beiden erklärt die Delle Tag 13–36; der Bot baute ab Tag 13 drei Nachtaugen (Luftspezialist, Boden 60 %).
- Neu: Luftspezialist Fliegende 140 % (Boden 60 %); **Irrlicht** als echter Lichtturm (Licht 2 Felder, Schatten ×1,10 → ×1,20 auf S1–S6, keine Rüstung ignorieren, Preis 30).
- Frei: **Eis 1,05** (1,06/1,00/1,04/1,08), Fliegertage 1,43 (vorher 2,00) · **Schatten 1,04** (**0,87**/0,97/1,15/**1,22**), Fliegertage 1,86 (vorher 2,40). Feuer 1,04 / Stein 1,11 (Fliegertage 0,84 / 0,31) aus den letzten Läufen.
- Das Irrlicht bringt die Drift bei Schatten zurück: Die Verstärkung wirkt auf alle Schatten-Türme im Lichtkreis und wächst mit ihrer Zahl. Am Anfang fehlt dafür der frühe Fluch des alten T2.

## Irrlicht kleiner, Luftspezialist 80/120, Fliegertage (29.10. mittags, L)
- Luftspezialisten Boden 80 %, Fliegende 120 % (L). Der Bot baute die Nachtaugen bewusst (Vorausschau auf die Fliegertage), nicht aus dem festen Aufbau.
- Irrlicht: Verstärkung steigt mit den Upgrades, aber kleiner (×1,05 auf S1 bis ×1,15 auf S6); Fluch-Stapel 0,05 statt 0,10 als Gegengewicht.
- Frei: **Eis 1,04** (1,06/1,01/1,04/1,06), Fliegertage 1,02 · **Schatten 1,00** (0,93/0,95/1,07/1,08), Fliegertage 1,11. Feuer 1,04 (Fliegertage 0,84), Stein 1,11 (0,31) aus den letzten Läufen.
- **Leben an Fliegertagen** mit dem geometrischen Mittel der vier Elemente (freier Bau) skaliert: Spatzen ×0,74, Habichte ×0,65, Uffug-Vorhaut ×0,66, Phönixe ×0,61, El Schlucko ×0,82, Looping-Louie ×0,80, Fledermäuse ×0,67, Nazgul ×1,05. Damit liegt ein durchschnittliches Element an Fliegertagen bei 1,00; die Verhältnisse zwischen den Elementen bleiben (Feuer 1,13 · Eis 1,38 · Schatten 1,50 · Stein 0,42, grob umgerechnet).

## Stein-Drift und Leben hinten (29.10. nachmittags, L)
- Stein-Varianten frei (÷ Standard, Bodentage): Kiesel schwach gegen Fliegende 1,01 (1,02/1,00/1,03/0,98), Fliegertage 0,31 → 0,56 · + Betäubung T6–T8 1,06 (…/1,18) · + Fläche T6/T8 ohne Wirkung (selten gebaut).
- Umgesetzt (L): Kiesel schwach gegen Fliegende, Betäubung nur Bergkönig (35 %), Granitwächter keine Fliegenden, „keine Fliegenden“ ×1,36; Leben an Bodentagen × Mittel der vier Elemente je Block (1,00/0,99/1,06/1,10, weich).
- **Ergebnis frei, gegen die Ziel-Kurve** (Bodentage Tag 1–12/13–24/25–36/37–48 | Fliegertage): Standard 1,00/1,04/0,96/0,92 | 1,33 · **Feuer** 0,98/1,08/1,06/0,98 = 1,03 | 0,83 · **Eis** 1,06/1,06/1,05/1,05 = 1,05 | 1,32 · **Schatten** 0,93/0,98/1,01/1,01 = 0,98 | 1,53 · **Stein** 1,02/1,04/1,04/1,19 = 1,07 | 0,66.
- Offen: Bergkönig 35 % hebt Stein in Tag 37–48 zu stark (1,19) → etwa 25 %; Schatten am Anfang 0,93.

## Stein gegen Fliegende und Bergkönig (29.10. abends, L)
Stein frei gegen die Ziel-Kurve (Bodentage Tag 1–12/13–24/25–36/37–48 = gesamt | Fliegertage, davon Tag 10/13/23):
- bisher (T1/T2 schwach, T3 keine): 1,02/1,04/1,04/1,19 = 1,07 | 0,66 (0,54)
- T2 keine Fliegenden, T3 normal (L): 1,17/1,08/1,05/1,31 = 1,15 | 0,58 (0,37) – die Schleuder bekam den Zuschlag, der Bot baute früh drei davon statt Luftabwehr. Betäuben-Faktor ×2: …/1,20, ×3: …/1,14.
- **Gewählt:** T2 schwach, **T3 Felsbrocken normal**, Betäuben-Faktor ×3: **1,05/1,02/1,00/1,09 = 1,04 | 0,68 (0,62)**.

## Stein gegen Fliegende neu (30.10. vormittags, L)
Version A: T1/T2 schwach, T3 keine, T4 normal, T5 keine, T6 normal, T7 keine, T8 schwach (Bergkönig als Alleskönner). B: T2 normal, T4 schwach. Stein frei gegen die Ziel-Kurve (Bodentage Tag 1–12/13–24/25–36/37–48 = gesamt | Fliegertage):
- A, Felsbrocken 10 %, Erdbeben 20 %, Bergkönig 15 %: 1,10/1,09/1,03/0,99 = 1,05 | 0,50 · B: 1,11/1,00/0,99/0,99 = 1,02 | 0,51 (frühe Fliegertage 0,35)
- A, Felsbrocken 10 %, Bergkönig 25 %: 1,10/1,09/1,03/1,09 = 1,07 | 0,52
- A, Felsbrocken ohne, Erdbeben 10 % (L), Bergkönig 15 %: 1,02/1,02/0,94/0,91 = 0,97 | 0,52 · Bergkönig 25 %: 1,02/1,02/0,93/0,96 = 0,98 | 0,54
- … Bergkönig 25 %, Betäuben-Faktor ×1: 1,02/1,02/0,95/1,22 = 1,05 | 0,58 · zusätzlich „keine Fliegenden“ ×1,45: 1,02/1,10/0,96/1,12 = 1,05 | 0,46
- **Achtung Spielcode:** Betäubungs-Chance 0 bedeutet „betäubt immer“ (`!def.chance || rand < chance`). Beim Übernehmen 0 als „nie“ behandeln.
- Befund: Der Zuschlag „keine Fliegenden“ liegt bei Version A auf T3/T5/T7 → Stein vorne/Mitte stark, hinten schwach. Begründeter Zuschlag wäre 46/38 ≈ ×1,21 (Fliegertage-Anteil, wie bei „schwach“ und Luftspezialisten); ×1,36 war als Stein-Niveau-Hebel missbraucht.

## Hergeleitete Faktoren und Stein-Niveau (30.10. vormittags)
- „Keine Fliegenden“ war als Stein-Niveau von Hand hochgesetzt (1,1 → 1,36). Jetzt hergeleitet ×46/38 = 1,21; „schwach“ und Luftspezialisten ebenso als Mittel über die Tage.
- Betäuben neu gemessen (`kurse6.js stunF`, nur ein Turmtyp): T7 Fläche 2, Rate 0,4: +2–3 % (10–25 %); T8 Fläche 1, 2 Geschosse: 15 % → +7–9 %. Neue Formel 1 + 0,33 × Chance × Dauer × Rate × Geschosse (die alte hing nicht an der Trefferzahl; ×3-Korrektur entfällt). Betäubung: Erdbeben 10 %, Lawine 15 %, Bergkönig keine (L).
- Frei gegen Ziel danach: Feuer 1,03 (0,99/1,09/1,06/0,99), Fliegertage 1,21 (Bot baut jetzt Sonnentürme statt Glutbecken) · Eis 1,03 (1,06/1,05/1,02/0,98), 1,31 · Schatten 0,98 (0,92/0,98/1,01/1,00), 1,50 · Stein 0,94 (1,01/0,99/0,89/0,88), 0,50.
- Stein-Flächenabfall (Element-Spezifikation aus dem Spiel, unbepreist wie Baubonus): 110/75 % → 1,00 (1,09/1,04/0,95/0,93); **120/80 % → 1,09 (1,15/1,14/1,04/1,04)**, Fliegertage 0,60. Hebt das Niveau, nicht die Form. Übernommen.
- Mehr Rüstungsschaden für Stein (2,0 / 2,5, bepreist): 0,98 / 0,91, Form unverändert – der Rüstungs-Kurs (3,6) bepreist ihn für Stein zu teuer; kein Form-Hebel.
- Offen: Stein fällt nach hinten um etwa 10 % (vorne stark).

## Rüstungsschaden gemessen statt gesucht (30.10. mittags)
- `kurse6.js ruest` (alle Türme, D7-Monster, mit Platzwahl): Rüstungsschaden 0,5 → ×1,10 · 0,6 → ×1,14 · 1,5 → ×1,28 · 2,0 → ×1,30 (mit Fläche 1 gleich). **Drift jetzt negativ** (1,5: 1,44/1,29/1,22/1,22), weil D7 die Rüstung in Tag 1–12 erhöht hat. Der gesuchte Kurs 3,6 bepreiste Stein mit ×1,65 statt ×1,28, Feuer/Eis mit ×1,22/1,26 statt ×1,10/1,14.
- Mit dem gemessenen Kurs (`RUEST_GEMESSEN=1`): fest Feuer 1,03 · Eis 1,02 · Schatten 0,97 · **Stein 1,43** (Form-Rest 4,5 %).
- Stein-Diagnose im eigenen freien Plan (`frei6.js AKTUELL=1`): alle Türme Standard 0,661 (Stein ×1,51); je Turmtyp → Standard 0,88–1,00 (Kiesel 0,88, Erdbeben 0,89, Katapult 0,92, Lawine 0,93). Abschalten im festen Aufbau: ohne Rüstungsschaden 1,07, ohne eigenen Flächenabfall 1,21, ohne Betäubung 1,33, ohne Nova 1,23.
- Deutung: Der gesuchte Rüstungs-Kurs war in Wahrheit ein **Stein-Verbund-Kurs** – er hat die nicht bepreisten Stein-Stärken (Flächenabfall, Verbund von Fläche + Rüstungsschaden + Betäubung) aufgefangen. Standard bleibt vorerst der alte Kurs (3,6); Entscheidung L.

## Drift abgetragen (30.10. abends)
Schritte: gemessener Rüstungsschaden-Kurs, Zusatzrüstung Tag 1–12 +15 %, Kiesel gezielt ohne Fläche (L), Winter-Wetter mit mehr Bewölkt/Gewitter, Stein-Flächenabfall 100/70 %, Niveaus (Brennen ×1,54, Bremsen 15,16), Leben je Block × gemeinsame Drift (1,00/1,12/1,06/1,06), Schatten-Niveau über Nachtregel ×1,105.
- **Frei gegen die Ziel-Kurve** (Bodentage Tag 1–12/13–24/25–36/37–48 = gesamt | Fliegertage): Feuer 1,00/1,04/1,04/0,98 = **1,02** | 1,27 · Eis 1,04/1,04/0,99/1,00 = **1,01** | 1,44 · Schatten 0,99/0,96/1,01/1,00 = **0,99** | 1,59 · Stein 1,02/1,13/1,00/1,10 = **1,06** | 0,68. Standard-Bot 0,92 (Leben jetzt auf die Elemente gestellt).
- Form-Rest vor dem letzten Schritt (d16): alle Elemente je Block innerhalb ±6 %, meist ±4 % – etwa die Bot-Streuung.
- Danach Leben an Fliegertagen erneut auf das Mittel der Elemente (×1,02–1,36).

## Forschung bewertet (31.10. nachts, fester Aufbau D7, `elemente6.js RES=…`)
Wert = Reserve mit ÷ ohne Forschung (Bodentage), je Element:

| Forschung | Feuer | Eis | Schatten | Stein |
|---|---|---|---|---|
| Element-Schaden +8 % (Stufe 1) | ×1,08 | ×1,08 | ×1,08 | ×1,08 |
| Element-Schaden +25 % (Stufe 3) | ×1,25 | ×1,25 | ×1,25 | ×1,25 |
| Effekte länger +10 % / +30 % | ×1,01 / ×1,02 | ×0,99 / ×0,99 | ×1,00 / ×1,00 | ×1,00 / ×1,00 |
| Reichweite heute +0,2 / +0,6 Felder | ×1,02 / ×1,04 | ×1,01 / ×1,04 | ×1,03 / ×1,06 | ×1,02 / ×1,04 |
| Reichweite Vorschlag +1,5 Felder (Stufe 3) | ×1,08 | ×1,09 | ×1,13 | ×1,07 |
| Vorschlag „Fläche größer“ ×1,3 | ×1,03 | ×1,00 | ×1,01 | **×1,08** |

- **Gold-Gegenwert** (Bezugs-Bot mit Standardtürmen, 9,4 % mehr Gold): Reserve ×1,12 → +1 % Gold ≈ +1,3 % Reserve. Eine Forschung mit Wert ×(1 + b) ist also so viel wert wie b/1,3 des bis dahin verbauten Golds.
- Verbautes Gold je Spieler (zu zweit, Bezugs-Bot): Tag 12 ≈ 480 · Tag 24 ≈ 1.600 · Tag 36 ≈ 4.200 · Tag 48 ≈ 9.000. Kasse (10 % des Kopfgelds) je Spieler: ≈ 50 / 180 / 470 / 1.000.
- Beispiel Element-Schaden Stufe 1 (25 Gold): Tag 12 ≈ 30 Gold wert, Tag 24 ≈ 100, Tag 36 ≈ 260 → ab etwa Tag 12 ein sehr gutes Geschäft. „Effekte länger“ ist praktisch wertlos (≤ 2 %).
