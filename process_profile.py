#!/usr/bin/env python3
"""
Simple image crop & resize utility.
Usage:
  python scripts/process_profile.py input.jpg
This will produce:
  assets/profile.jpg      -> 256x256
  assets/profile@2x.jpg  -> 512x512

Requires: Pillow (pip install pillow)
"""
import sys
from PIL import Image
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parents[1] / 'assets'

def center_crop(im):
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def main():
    if len(sys.argv) < 2:
        print('Usage: python scripts/process_profile.py path/to/input.jpg')
        sys.exit(1)
    src = Path(sys.argv[1])
    if not src.exists():
        print('File not found:', src)
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert('RGB')
    cropped = center_crop(im)

    # auto-adjust: autocontrast, slight color/contrast boost, and sharpen
    try:
        from PIL import ImageOps, ImageEnhance, ImageFilter
        cropped = ImageOps.autocontrast(cropped, cutoff=1)
        cropped = ImageEnhance.Color(cropped).enhance(1.03)
        cropped = ImageEnhance.Contrast(cropped).enhance(1.04)
        # apply a light sharpen
        cropped = cropped.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=3))
    except Exception:
        # if enhancements fail, continue with the cropped image
        pass

    out1 = OUT_DIR / 'profile.jpg'
    out2 = OUT_DIR / 'profile@2x.jpg'

    cropped.resize((256,256), Image.LANCZOS).save(out1, quality=86, optimize=True)
    cropped.resize((512,512), Image.LANCZOS).save(out2, quality=86, optimize=True)

    print('Wrote:', out1)
    print('Wrote:', out2)

if __name__ == '__main__':
    main()
