# -*- coding: utf-8 -*-
import re, io, sys

base = r"c:/Users/Administrator/Documents/GitHub/cascadavelodenovia/public"
html = io.open(base + "/index.html", encoding="utf-8").read()
js = io.open(base + "/js/i18n.js", encoding="utf-8").read()

html_keys = set(re.findall(r'data-t="([^"]+)"', html))
# keys declared in zh block and en block: property name then ':'
js_keys = set(re.findall(r'^\s{4}([A-Za-z_][A-Za-z0-9_]*):', js, re.M))

missing = sorted(html_keys - js_keys)
extra = sorted(js_keys - html_keys - {"_title", "_desc"})
print("HTML keys:", len(html_keys))
print("JS keys:", len(js_keys))
print("MISSING in i18n:", missing)
print("EXTRA not in html:", extra)
