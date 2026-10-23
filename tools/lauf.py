#!/usr/bin/env python3
"""Laufbilder für ein Monster bauen (Seitenansicht), wie bei Betty.

Aufruf:
  python3 tools/lauf.py <monsterdatei-name> <eingabe> [--n 4] [--von 0] [--bis 2] [--hell 40]
  z. B. python3 tools/lauf.py hund hund-video.mp4 --von 1 --bis 2.2 --n 4
        python3 tools/lauf.py hund frames/          (Ordner mit png/jpg, alphabetisch)

<eingabe>  Video (ffmpeg nötig; es werden --n gleichmäßig verteilte Bilder zwischen --von und --bis Sekunden
           genommen, am besten genau ein Schrittzyklus) oder Ordner mit fertigen Einzelbildern.
Ergebnis   assets/monster/<name>-lauf-0..n-1.png (192 px, freigestellt, 128 Farben).
Alle Bilder bekommen denselben Ausschnitt und stehen auf derselben Fußlinie, damit nichts springt.
Danach in index.html:  MONSTER_ANIM = { betty:[8, 8], hund:[4, 6] }   (Anzahl, Bilder je Sekunde)
"""
import sys, os, glob, shutil, subprocess, tempfile, argparse
from PIL import Image, ImageDraw

SIZE = 192
ap = argparse.ArgumentParser()
ap.add_argument('name'); ap.add_argument('eingabe')
ap.add_argument('--n', type=int, default=4); ap.add_argument('--von', type=float, default=0.0)
ap.add_argument('--bis', type=float, default=2.0); ap.add_argument('--hell', type=int, default=40,
    help='Toleranz der Freistellung (weißer Hintergrund, Flutfüllung von den Ecken)')
a = ap.parse_args()
out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'monster')

tmp = tempfile.mkdtemp()
if os.path.isdir(a.eingabe):
    files = sorted(glob.glob(os.path.join(a.eingabe, '*.png')) + glob.glob(os.path.join(a.eingabe, '*.jpg')) + glob.glob(os.path.join(a.eingabe, '*.jpeg')))
    if len(files) < a.n: sys.exit('Zu wenige Bilder im Ordner: %d' % len(files))
    step = len(files) / a.n
    files = [files[int(i * step)] for i in range(a.n)]
else:
    fps = a.n / max(0.01, a.bis - a.von)
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(a.von), '-t', str(a.bis - a.von),
                           '-i', a.eingabe, '-vf', 'fps=%f' % fps, os.path.join(tmp, 'f%03d.png')])
    files = sorted(glob.glob(os.path.join(tmp, 'f*.png')))[:a.n]
    if len(files) < a.n: sys.exit('Video liefert nur %d Bilder' % len(files))

def freistellen(p):
    im = Image.open(p).convert('RGBA')
    w, h = im.size
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if im.getpixel(pt)[3] > 0:
            ImageDraw.floodfill(im, pt, (0, 0, 0, 0), thresh=a.hell)
    return im

frames = [freistellen(f) for f in files]
boxes = [im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox() for im in frames]
if not all(boxes): sys.exit('Ein Bild ist nach der Freistellung leer – Toleranz --hell senken')
x0 = min(b[0] for b in boxes); y0 = min(b[1] for b in boxes); x1 = max(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
bw, bh = x1 - x0, y1 - y0; s = (SIZE - 4) / max(bw, bh)           # ein gemeinsamer Maßstab
nw, nh = max(1, round(bw * s)), max(1, round(bh * s))
for i, im in enumerate(frames):
    c = im.crop((x0, y0, x1, y1)).resize((nw, nh), Image.LANCZOS)
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    canvas.paste(c, ((SIZE - nw) // 2, SIZE - nh - 2), c)             # Füße unten, mittig
    q = canvas.quantize(128, method=Image.FASTOCTREE)               # 128 Farben mit Transparenz, wie die anderen Bilder
    path = os.path.join(out_dir, '%s-lauf-%d.png' % (a.name, i))
    q.save(path, optimize=True)
    print(path)
shutil.rmtree(tmp, ignore_errors=True)
print('Fertig. In index.html eintragen: MONSTER_ANIM = { ..., %s:[%d, 6] }' % (a.name, a.n))
