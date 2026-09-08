# -*- coding: utf-8 -*-
"""Resize downloaded Wikimedia photos and generate PWA icons."""
import os
from PIL import Image, ImageOps, ImageEnhance

BASE = r"c:/Users/Administrator/Documents/GitHub/cascadavelodenovia/images"


def resize_photo(name, max_dim):
    path = os.path.join(BASE, name)
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    img = img.convert("RGB")
    img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    print("resized", name, img.size, os.path.getsize(path))


def square_icon(src_name, out_name, size):
    src = os.path.join(BASE, src_name)
    out = os.path.join(BASE, out_name)
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = int((h - side) * 0.15)
    top = max(0, min(top, h - side))
    box = (left, top, left + side, top + side)
    icon = img.crop(box).convert("RGB").resize((size, size), Image.LANCZOS)
    icon.save(out, "PNG", optimize=True)
    print("icon", out_name, icon.size, os.path.getsize(out))


for f, m in (("hero.jpg", 1600), ("fall-main.jpg", 1400),
             ("lake-avandaro.jpg", 1400), ("viewpoint.jpg", 1400)):
    resize_photo(f, m)

square_icon("hero.jpg", "icon-512.png", 512)
square_icon("hero.jpg", "icon-192.png", 192)
square_icon("hero.jpg", "apple-touch-icon.png", 180)
print("done")
