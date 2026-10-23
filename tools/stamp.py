#!/usr/bin/env python3
"""Writes today's date into the homepage footer ("last changed ...").

Run by the pre-commit hook in .githooks/, or by hand:  python3 tools/stamp.py
One-time setup so the hook runs:  git config core.hooksPath .githooks
"""
import datetime, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
page = root / "index.html"
html = page.read_text(encoding="utf-8")

today = datetime.date.today()
stamp = f"{today.strftime('%B')} {today.day}, {today.year}"

new, n = re.subn(
    r'(<span id="ftStamp">)[^<]*(</span>)',
    lambda m: m.group(1) + stamp + m.group(2),
    html,
)
if n != 1:
    sys.exit("stamp.py: expected exactly one #ftStamp span in index.html, found %d" % n)
if new != html:
    page.write_text(new, encoding="utf-8")
    print("stamp.py: footer now says", stamp)
