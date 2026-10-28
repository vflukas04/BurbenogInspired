#!/bin/bash
# Drift-Experiment (28.10. nachts): frühe Türme von Eis/Schatten/Stein mit „früh starkem“ Merkmal (kurze Reichweite), Kurse unverändert.
# Aufruf: bash tools/balance/d/exp-drift.sh <Name> '<AENDERN>'
cd "$(dirname "$0")/../../.." && AENDERN="$2" AUS="spiegel-exp-$1.json" node tools/balance/d/d2.js > /dev/null &&
STAPEL_ALLE=1 UMPLATZ=1 SPIEGEL="tools/balance/spiegel-exp-$1.json" EL=1,2,3 node tools/balance/d/elemente6.js | sed "s/^/$1: /"
