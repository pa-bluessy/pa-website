"""Make pa-wax-seal.png truly transparent (remove black plate / fringe)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "pa-wax-seal.png"
SRC_CANDIDATES = [
    Path(
        r"C:\Users\USER\.cursor\projects\c-Users-USER-pa-website\assets"
        r"\c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
        r"fe05fb64935a42281eb7a120b36a800e_images_ChatGPT_Image_2026_7_23__"
        r"18_41_37-08495c21-db98-4a62-b632-a7e73042c4c2.png"
    ),
    OUT,
]


def is_wax(r: int, g: int, b: int) -> bool:
    """Burgundy wax / highlight — keep these."""
    if r >= 55 and r > g + 12 and r > b + 12:
        return True
    # Specular highlight on wax rim
    if min(r, g, b) >= 90 and abs(r - g) < 35 and abs(g - b) < 35:
        return True
    return False


def is_backdrop(r: int, g: int, b: int) -> bool:
    mx = max(r, g, b)
    if is_wax(r, g, b):
        return False
    # Near-black / charcoal plate
    if mx <= 55:
        return True
    # Dark desaturated fringe
    if mx <= 80 and (mx - min(r, g, b)) <= 18 and r < 70:
        return True
    return False


def main() -> None:
    src = next((p for p in SRC_CANDIDATES if p.exists()), None)
    if src is None:
        raise SystemExit("source not found")

    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    # Pass 1: hard key non-wax dark pixels
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_backdrop(r, g, b):
                px[x, y] = (0, 0, 0, 0)

    # Pass 2: flood-fill remaining dark edge from borders
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            return
        r, g, b, a = px[x, y]
        if a == 0:
            visited[y][x] = True
            q.append((x, y))
            return
        if is_backdrop(r, g, b) or (not is_wax(r, g, b) and max(r, g, b) <= 90):
            visited[y][x] = True
            px[x, y] = (0, 0, 0, 0)
            q.append((x, y))

    for x in range(w):
        enqueue(x, 0)
        enqueue(x, h - 1)
    for y in range(h):
        enqueue(0, y)
        enqueue(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            enqueue(nx, ny)

    # Pass 3: feather semi-dark fringe next to transparency
    src_px = img.copy().load()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = src_px[x, y]
            if a == 0 or is_wax(r, g, b):
                continue
            if max(r, g, b) > 95:
                continue
            near_clear = False
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if src_px[nx, ny][3] == 0:
                    near_clear = True
                    break
            if near_clear:
                px[x, y] = (0, 0, 0, 0)

    img.save(OUT, "PNG")

    # Crop to opaque content so empty plate space doesn't remain
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
        pad = 8
        cw, ch = cropped.size
        packed = Image.new("RGBA", (cw + pad * 2, ch + pad * 2), (0, 0, 0, 0))
        packed.paste(cropped, (pad, pad), cropped)
        packed.save(OUT, "PNG")
        img = packed

    check = Image.open(OUT)
    cpx = check.load()
    cw, ch = check.size
    blackish = 0
    opaque = 0
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = cpx[x, y]
            if a > 200:
                opaque += 1
                if max(r, g, b) < 40:
                    blackish += 1
    print("mode", check.mode, "size", check.size)
    print("corner", check.getpixel((2, 2)))
    print("center", check.getpixel((cw // 2, ch // 2)))
    print("opaque", opaque, "blackish_opaque", blackish)
    print("bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
