import re,sys,math
# liest Zeilen "<Variante> <Element> ... (Tag 1–12 a · 13–24 b · 25–36 c · 37–48 d)" und gibt Form-Abweichung (ohne Niveau je Element und ohne gemeinsame Drift)
V={}
for l in open(sys.argv[1]):
  m=re.match(r'(\S+)\s+(Feuer|Eis|Schatten|Stein).*?Boden ([\d.]+) \(Tag 1–12 ([\d.]+) · 13–24 ([\d.]+) · 25–36 ([\d.]+) · 37–48 ([\d.]+)',l)
  if m: V.setdefault(m[1],{})[m[2]]=[float(x) for x in m.groups()[2:]]
for v,E in V.items():
  if len(E)<4: continue
  L={e:[math.log(x) for x in E[e][1:]] for e in E}
  rm={e:sum(L[e])/4 for e in L}; cm=[sum(L[e][b] for e in L)/len(L) for b in range(4)]; g=sum(rm.values())/len(L)
  res={e:[L[e][b]-rm[e]-cm[b]+g for b in range(4)] for e in L}
  rms=math.sqrt(sum(x*x for e in res for x in res[e])/16)
  print(f"{v:12} Form-Rest {rms*100:4.1f} % | gemeinsam "+'/'.join(f'{math.exp(c-g):.2f}' for c in cm)+' | '+' · '.join(f"{e[:2]} {E[e][0]:.2f} ("+'/'.join(f'{x:+.0%}' for x in [math.exp(r)-1 for r in res[e]])+')' for e in ['Feuer','Eis','Schatten','Stein'] if e in E))
