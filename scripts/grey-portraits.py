"""Cut out team portraits and place them on a grey studio backdrop.

Usage: python scripts/grey-portraits.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
OUT_W, OUT_H = 1000, 1150  # matches the 4 / 4.6 card aspect ratio

# (source, output, cutout already transparent?)
PORTRAITS = [
    ("glory.png", "glory-grey.png", True),
    ("takunda.jpeg", "takunda-grey.png", False),
    ("sam.jpeg", "sam-grey.png", False),
]


def grey_backdrop(w, h):
    """Soft grey studio gradient, lighter behind the subject's head."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w * 0.5, h * 0.38
    d = np.sqrt(((x - cx) / (w * 0.75)) ** 2 + ((y - cy) / (h * 0.8)) ** 2)
    center, edge = np.array([138, 138, 144]), np.array([72, 72, 78])
    t = np.clip(d, 0, 1)[..., None]
    rgb = center * (1 - t) + edge * t
    noise = np.random.default_rng(7).normal(0, 2.2, (h, w, 1))
    return Image.fromarray(np.clip(rgb + noise, 0, 255).astype(np.uint8), "RGB")


def frame_subject(cutout):
    """Crop around the subject so head and shoulders fill the frame."""
    alpha = np.array(cutout.getchannel("A"))
    ys, xs = np.where(alpha > 40)
    top, bottom = ys.min(), ys.max()
    left, right = xs.min(), xs.max()
    subject_h = bottom - top
    subject_w = right - left

    head_room = int(subject_h * 0.08)
    crop_h = max(int(subject_w * 1.25 * OUT_H / OUT_W), int(subject_h * 0.9))
    y0 = top - head_room
    if bottom >= cutout.height - 3:
        # Body is cut off by the photo edge; never reveal backdrop below it.
        crop_h = min(crop_h, cutout.height - y0)
    crop_w = int(crop_h * OUT_W / OUT_H)
    cx = (left + right) // 2
    x0 = cx - crop_w // 2
    return cutout.crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize(
        (OUT_W, OUT_H), Image.LANCZOS
    )


def main():
    session = new_session("isnet-general-use")
    for src, dst, is_cutout in PORTRAITS:
        img = Image.open(ASSETS / src).convert("RGBA")
        if is_cutout:
            cutout = img
        else:
            cutout = remove(img, session=session, post_process_mask=True)
            # Pull the edge in slightly so the old bright background doesn't halo.
            alpha = cutout.getchannel("A").filter(ImageFilter.MinFilter(5))
            cutout.putalpha(alpha.filter(ImageFilter.GaussianBlur(1)))
        framed = frame_subject(cutout)

        bg = grey_backdrop(OUT_W, OUT_H).convert("RGBA")
        shadow = Image.new("RGBA", framed.size, (0, 0, 0, 0))
        shadow.putalpha(framed.getchannel("A").point(lambda a: int(a * 0.35)))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        bg.alpha_composite(shadow, (14, 10))
        bg.alpha_composite(framed)
        bg.convert("RGB").save(ASSETS / dst, optimize=True)
        print(f"wrote {dst}")


if __name__ == "__main__":
    main()
