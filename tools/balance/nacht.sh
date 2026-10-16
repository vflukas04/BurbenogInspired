#!/bin/sh
# Rechnet P2 bis zum Ende, auch nach Abbrüchen (Zwischenstände in ergebnisse/ck-*.json). Aufruf: sh tools/balance/nacht.sh
cd "$(dirname "$0")/../.."
for i in 1 2 3 4 5 6; do
  WEITER=1 LAUT=1 node tools/balance/p2.js alle > tools/balance/ergebnisse/p2-lauf.txt 2>> tools/balance/ergebnisse/p2-log.txt && [ -s tools/balance/ergebnisse/p2-lauf.txt ] && break
done
