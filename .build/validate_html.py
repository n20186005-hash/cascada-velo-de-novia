# -*- coding: utf-8 -*-
import re, io, json, os, sys
from html.parser import HTMLParser

base = r"c:/Users/Administrator/Documents/GitHub/cascadavelodenovia/public"
html = io.open(base + "/index.html", encoding="utf-8").read()

class P(HTMLParser):
    VOID = {"meta", "link", "br", "img", "input", "hr", "source", "iframe", "wbr", "embed", "track", "area", "base", "col", "rect", "path"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.h1 = 0
        self.h2 = 0
    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append("unexpected close </%s>" % tag)
            return
        if self.stack[-1] == tag:
            self.stack.pop()
        else:
            if tag in self.stack:
                while self.stack and self.stack[-1] != tag:
                    self.errors.append("mismatch: <" + self.stack.pop() + "> closed by </%s>" % tag)
                if self.stack:
                    self.stack.pop()
            else:
                self.errors.append("close </%s> without open" % tag)
    def handle_data(self, d):
        pass

p = P()
p.feed(html)
p.close()
print("HTML parse:", "OK" if not p.errors and not p.stack else ("ERRORS " + str(p.errors[:6]) + " unclosed " + str(p.stack[:6])))
print("h1 count:", html.count("<h1"), "| h2 count:", len(re.findall(r"<h2\b", html)), "| h3:", len(re.findall(r"<h3\b", html)))

# JSON-LD
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
print("JSON-LD blocks:", len(blocks))
for i, b in enumerate(blocks):
    try:
        data = json.loads(b)
        types = data.get("@type") if isinstance(data, dict) else ""
        print("  block", i, "type:", types, "OK")
    except Exception as e:
        print("  block", i, "JSON ERROR:", e)

# referenced local assets
refs = set(re.findall(r'(?:href|src)="(/[^"]+)"', html))
missing = []
for r in refs:
    if r.startswith("//") or r.startswith("http") or r.startswith("mailto"):
        continue
    if "?" in r: r = r.split("?")[0]
    fp = os.path.normpath(os.path.join(base, r.lstrip("/")))
    if not os.path.exists(fp):
        missing.append(r)
print("local refs missing:", missing or "none")

# duplicate ids
ids = re.findall(r'id="([^"]+)"', html)
dups = sorted({x for x in ids if ids.count(x) > 1})
print("duplicate ids:", dups or "none")
