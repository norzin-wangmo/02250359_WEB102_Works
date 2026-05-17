"""Render simple report screenshots as PNG using Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
ROOT = OUT.parent / "tiktok-api"
W, H = 1100, 650
BG_DARK = (30, 30, 30)
BG_CODE = (30, 30, 30)
FG = (212, 212, 212)
TITLE = (255, 255, 255)
ACCENT = (156, 220, 254)
GREEN = (62, 207, 142)
BAR = (24, 24, 24)


def font(size, bold=False):
    names = [
        "/System/Library/Fonts/Menlo.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def save(name, img):
    p = OUT / f"{name}.png"
    img.save(p)
    print("Wrote", p)


def dash_shot(name, title, lines):
    img = Image.new("RGB", (W, H), BG_DARK)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 48], fill=BAR)
    d.text((20, 14), "Supabase", fill=FG, font=font(16))
    d.text((28, 70), title, fill=TITLE, font=font(22))
    y = 120
    f = font(14)
    for line in lines:
        if line.startswith("OK:"):
            d.text((28, y), line[3:], fill=GREEN, font=font(16))
        else:
            d.text((28, y), line, fill=FG, font=f)
        y += 28
    save(name, img)


def code_shot(name, title, path_label, code):
    img = Image.new("RGB", (W, max(H, 80 + len(code.splitlines()) * 16)), BG_CODE)
    d = ImageDraw.Draw(img)
    d.text((24, 20), title, fill=TITLE, font=font(18))
    d.text((24, 48), path_label, fill=ACCENT, font=font(13))
    y = 80
    f = font(12)
    for line in code.splitlines():
        d.text((24, y), line[:120], fill=FG, font=f)
        y += 16
    save(name, img.crop((0, 0, W, min(img.height, y + 24))))


dash_shot("01-project", "Project: tiktok", ["Status: Active", "WEB102 — Cloud Storage"])

dash_shot(
    "02-buckets",
    "Storage buckets",
    ["videos          Public", "thumbnails      Public"],
)

dash_shot(
    "03-api",
    "Project API",
    [
        "URL: https://birimypzqrgifklutgad.supabase.co",
        "anon public: eyJhbGci…••••••••••••",
        "(service_role hidden)",
    ],
)

dash_shot(
    "04-sql",
    "SQL Editor",
    [
        "OK:Success. No rows returned",
        "Storage policies for videos & thumbnails",
        'CREATE POLICY "Public read videos" ...',
        'CREATE POLICY "Allow upload videos" ...',
    ],
)

schema = (ROOT / "prisma/schema.prisma").read_text().splitlines()[34:48]
code_shot("05-prisma", "Prisma — Video model", "prisma/schema.prisma", "\n".join(schema))

code_shot(
    "06-storage",
    "storageService.js",
    "src/services/storageService.js",
    (ROOT / "src/services/storageService.js").read_text()[:2400],
)

code_shot(
    "07-upload-svc",
    "uploadService.js",
    "web/src/services/uploadService.js",
    (ROOT / "web/src/services/uploadService.js").read_text(),
)

code_shot(
    "08-upload-page",
    "upload/page.js",
    "web/src/app/upload/page.js",
    "\n".join((ROOT / "web/src/app/upload/page.js").read_text().splitlines()[:40]),
)

code_shot(
    "09-terminal",
    "Servers running",
    "Terminal",
    "cd tiktok-api && npm run dev\n→ listening on http://localhost:5050\n\ncd web && npm run dev\n→ Local: http://localhost:3000",
)
