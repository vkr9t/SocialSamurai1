"""Rebuild public/fonts/samurai-jp.woff2 with only the kanji/kana used on the site.

Run after adding Japanese text to src/components/Site:
    npm i -D @fontsource/noto-serif-jp   (temporarily)
    pip install fonttools brotli
    python3 scripts/subset-jp-font.py
"""
import glob, os, re
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.merge import Merger

text = ''.join(open(f, encoding='utf-8').read() for f in glob.glob('src/components/Site/**/*.ts*', recursive=True))
need = {ord(c) for c in text if 0x3040 <= ord(c) <= 0x30FF or 0x4E00 <= ord(c) <= 0x9FFF}
base = 'node_modules/@fontsource/noto-serif-jp/'
css = open(base + '600.css').read()
parts = []
for i, block in enumerate(re.findall(r'@font-face\s*{[^}]*}', css)):
    url = re.search(r'url\(\./files/([^)]+\.woff2)\)', block)
    rng = re.search(r'unicode-range:\s*([^;]+);', block)
    if not url or not rng:
        continue
    cps = set()
    for p in rng.group(1).split(','):
        p = p.strip().replace('U+', '')
        a, _, z = p.partition('-')
        cps.update(range(int(a, 16), int(z or a, 16) + 1))
    hit = cps & need
    if not hit:
        continue
    font = TTFont(base + 'files/' + url.group(1))
    sub = subset.Subsetter(options=subset.Options(layout_features=[]))
    sub.populate(unicodes=hit)
    sub.subset(font)
    font.flavor = None
    out = f'/tmp/jp_part{i}.ttf'
    font.save(out)
    parts.append(out)
merged = Merger().merge(parts)
merged.flavor = 'woff2'
merged.save('public/fonts/samurai-jp.woff2')
print(f'{len(need)} glyphs -> public/fonts/samurai-jp.woff2 ({os.path.getsize("public/fonts/samurai-jp.woff2")} bytes)')
