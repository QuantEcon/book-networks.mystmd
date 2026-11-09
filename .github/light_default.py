#!/usr/bin/env python3
"""Make the light theme the default on a built MyST site.

The book theme shows the dark theme when the reader's operating system prefers
dark, unless the reader has chosen with the theme toggle (stored in
localStorage as "myst:theme"). This inserts, first in every page's <head>, a
script that stores "light" when no choice has been made. The theme's own head
script then applies it, and the toggle keeps working.

Usage: python3 light_default.py _build/html
"""
import pathlib
import re
import sys

TAG = ('<script>try{if(!localStorage.getItem("myst:theme"))'
       'localStorage.setItem("myst:theme","light")}catch(e){}</script>')

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '_build/html')
n = 0
for page in root.rglob('*.html'):
    s = page.read_text(encoding='utf-8')
    if TAG in s:
        continue
    t = re.sub(r'<head(\s[^>]*)?>', lambda m: m.group(0) + TAG, s, count=1)
    if t != s:
        page.write_text(t, encoding='utf-8')
        n += 1
print(f'light_default: {n} pages')
