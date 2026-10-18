@echo off
rem Balancing-Optimierer auf dem eigenen PC (Windows, Node.js LTS). Doppelklick genuegt; PC darf nicht schlafen gehen.
rem Rechnet weiter, wo ein abgebrochener Lauf aufgehoert hat (tools\balance\ergebnisse\opt-stand.json). Protokoll: opt-log.txt
cd /d "%~dp0\..\.."
node tools\balance\optimierer.js
node tools\balance\p9.js alle > tools\balance\ergebnisse\p9.txt
echo Fertig. Bester Stand in tools\balance\spiegel.json, Bericht: node tools\balance\optimierer.js bericht
pause
