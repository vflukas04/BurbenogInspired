@echo off
rem Balancing-Schleife auf dem eigenen PC (Windows). Braucht Node.js (nodejs.org, LTS).
rem Doppelklick genuegt. Rechnet weiter, wo ein abgebrochener Lauf aufgehoert hat (Zwischenstaende in tools\balance\ergebnisse\ck-*.json).
cd /d "%~dp0\..\.."
set WEITER=1
set LAUT=1
powercfg /change standby-timeout-ac 0 >nul 2>&1
node tools\balance\p2.js alle > tools\balance\ergebnisse\p2-lauf.txt
node tools\balance\schleife.js > tools\balance\ergebnisse\schleife.txt
echo Fertig. Ergebnis: tools\balance\ergebnisse\p2-lauf.txt und schleife.txt
pause
