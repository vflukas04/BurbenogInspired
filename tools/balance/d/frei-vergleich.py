# Zweig D (28.10.): freier Bau je Element (bezug3) ÷ freier Bau mit Standardtürmen, je Block (Bodentage) und Fliegertage.
# Aufruf: python3 tools/balance/d/frei-vergleich.py <Standard-Ordner> <Element-Ordner>... (Ordner unter ergebnisse/, je mit bezug3.json)
import json, math, sys, os
B = os.path.join(os.path.dirname(__file__), '..', 'ergebnisse')
gm = lambda a: math.exp(sum(map(math.log, a)) / len(a)) if a else float('nan')
FLY = {10, 13, 23, 28, 30, 34, 40, 46}   # Fliegertage (Spatzen, …)
std = json.load(open(os.path.join(B, sys.argv[1], 'bezug3.json')))
for d in sys.argv[2:]:
  e = json.load(open(os.path.join(B, d, 'bezug3.json'))); blk = [[], [], [], []]; fl = []
  for ms, me in zip(std['maps'], e['maps']):
    for i, (ts, te) in enumerate(zip(ms['tage'], me['tage'])):
      q = te['R'] / ts['R']; (fl if i + 1 in FLY else blk[min(3, i // 12)]).append(q)
  b = sum(blk, [])
  print(f"{d:10} Boden {gm(b):.2f} ({' / '.join(f'{gm(x):.2f}' for x in blk)}) | Flieger {gm(fl):.2f}")
