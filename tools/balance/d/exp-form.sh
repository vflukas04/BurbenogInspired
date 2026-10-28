#!/bin/bash
# Zweig D (28.10.): Form-Experimente gegen die Drift. Je Zeile in der Variantendatei: Name|Umgebung für d2.js|Umgebung für elemente6.js
# Misst alle 4 Elemente (feste Bezugs-Aufbauten mit Platzwahl, Bodentage), Auswertung: python3 tools/balance/d/form.py <log>
# Aufruf: bash tools/balance/d/exp-form.sh varianten.txt > log
cd "$(dirname "$0")/../../.."
while IFS='|' read -r name d2env elenv; do
  [ -z "$name" ] && continue; [[ "$name" == \#* ]] && continue
  sp=spiegel-exp-form-$name.json
  env $d2env AUS=$sp node tools/balance/d/d2.js > /dev/null
  for el in 0 1 2 3; do env STAPEL_ALLE=1 SPIEGEL=tools/balance/$sp UMPLATZ=1 EL=$el $elenv node tools/balance/d/elemente6.js | sed "s/^/$name /" & [ $el = 1 ] && wait; done; wait
  rm -f tools/balance/$sp
done < "$1"
