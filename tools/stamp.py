#!/usr/bin/env python3
"""Pre-commit housekeeping for therapistweb.design.

1. Writes today's date into the homepage footer ("Last changed ...").
2. Puts a fresh ?v= on every assets/site.css and assets/site.js link, so a
   push shows up immediately instead of after GitHub Pages' 10-minute cache.

Runs from .githooks/pre-commit, or by hand:  python3 tools/stamp.py
One-time setup so the hook runs:  git config core.hooksPath .githooks
"""
import datetime, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
now = datetime.datetime.now()
stamp = f"{now.strftime('%B')} {now.day}, {now.year}"
ver = now.strftime("%Y%m%d%H%M")
changed = []

# 1. footer date on the homepage
page = root / "index.html"
html = page.read_text(encoding="utf-8")
new, n = re.subn(r'(<span id="ftStamp">)[^<]*(</span>)', lambda m: m.group(1) + stamp + m.group(2), html)
if n != 1:
    sys.exit("stamp.py: expected one #ftStamp span in index.html, found %d" % n)
if new != html:
    page.write_text(new, encoding="utf-8"); changed.append("index.html footer -> " + stamp)

# 2. cache-busting version on shared css/js, every page (client previews under work/preview/ left alone)
pat = re.compile(r'((?:href|src)="(?:\.\./)*/?assets/site\.(?:css|js))(?:\?v=\d+)?(")')
for f in root.rglob("*.html"):
    if "work/preview" in f.as_posix() or "/.git/" in f.as_posix():
        continue
    s = f.read_text(encoding="utf-8")
    t = pat.sub(lambda m: m.group(1) + "?v=" + ver + m.group(2), s)
    if t != s:
        f.write_text(t, encoding="utf-8"); changed.append(str(f.relative_to(root)))

if changed:
    print("stamp.py:", len(changed), "file(s) touched, assets now ?v=" + ver)
