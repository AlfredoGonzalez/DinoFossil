#!/usr/bin/env python3
"""Optimiza los iconos subidos a assets/art/icons/.

Para cada PNG/JPG: corrige extensiones duplicadas (`ad.png.png`), recorta el borde
transparente, lo centra en un lienzo cuadrado con un 5 % de margen, lo reduce a
256 px (384 px los `shop-*`) y lo guarda como WebP, borrando el original.

Uso: python3 scripts/optimize-icons.py   (requiere Pillow: pip install pillow)
"""
import os
import sys

from PIL import Image

ICONS_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'art', 'icons')


def base_name(filename: str) -> str:
    name = filename
    while os.path.splitext(name)[1].lower() in ('.png', '.jpg', '.jpeg', '.webp'):
        name = os.path.splitext(name)[0]
    return name


def optimize(path: str) -> None:
    name = base_name(os.path.basename(path))
    size = 384 if name.startswith('shop-') else 256
    im = Image.open(path).convert('RGBA')
    alpha = im.split()[3].point(lambda v: 255 if v > 16 else 0)
    bbox = alpha.getbbox() or (0, 0, *im.size)
    crop = im.crop(bbox)
    side = int(max(crop.size) * 1.1)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(crop, ((side - crop.size[0]) // 2, (side - crop.size[1]) // 2))
    square = square.resize((size, size), Image.LANCZOS)
    out = os.path.join(os.path.dirname(path), name + '.webp')
    square.save(out, 'WEBP', quality=90, alpha_quality=95, method=6)
    if os.path.abspath(out) != os.path.abspath(path):
        os.remove(path)
    print(f'{os.path.basename(path)} -> {name}.webp ({os.path.getsize(out) // 1024} KB)')


def main() -> int:
    for filename in sorted(os.listdir(ICONS_DIR)):
        path = os.path.join(ICONS_DIR, filename)
        ext = os.path.splitext(filename)[1].lower()
        if ext in ('.png', '.jpg', '.jpeg') or filename.count('.') > 1:
            try:
                optimize(path)
            except OSError as error:
                print(f'{filename}: no es una imagen válida ({error})', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
