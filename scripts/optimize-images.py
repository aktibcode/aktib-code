"""Génère les variantes WebP utilisées par les images responsives."""

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
WIDTHS = (640, 960, 1400)


def article_covers() -> list[str]:
    script = (
        "process.stdout.write(JSON.stringify("
        "require('./assets/js/data.js').ARTICLES.map((article) => article.cover)))"
    )
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def main() -> None:
    for cover in article_covers():
        source = ROOT / cover
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            if image.width < max(WIDTHS):
                raise ValueError(
                    f"{cover} est trop petite : largeur minimale {max(WIDTHS)} px."
                )
            for width in WIDTHS:
                height = round(image.height * width / image.width)
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                target = source.with_name(f"{source.stem}-{width}.webp")
                resized.save(target, "WEBP", quality=82, method=6)
                print(f"{target.relative_to(ROOT)} ({target.stat().st_size / 1024:.1f} Ko)")


if __name__ == "__main__":
    main()
