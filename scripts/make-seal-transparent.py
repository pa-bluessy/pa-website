from PIL import Image
import os

src_candidates = [
    r"C:\Users\USER\.cursor\projects\c-Users-USER-pa-website\assets\c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_fe05fb64935a42281eb7a120b36a800e_images_ChatGPT_Image_2026_7_23__18_41_37-08495c21-db98-4a62-b632-a7e73042c4c2.png",
    r"c:\Users\USER\テスト用\pa-website\public\images\pa-wax-seal.png",
]

src_use = next((p for p in src_candidates if os.path.exists(p)), None)
if not src_use:
    raise SystemExit("source not found")

img = Image.open(src_use).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        # Pure / near-black background (no red chroma of wax)
        if mx <= 18 and (mx - mn) <= 8:
            pixels[x, y] = (0, 0, 0, 0)
        elif mx <= 42 and (mx - mn) <= 12 and r <= 30:
            alpha = int(255 * (mx - 18) / 24)
            pixels[x, y] = (r, g, b, max(0, min(255, alpha)))

out = r"c:\Users\USER\テスト用\pa-website\public\images\pa-wax-seal.png"
img.save(out, "PNG")
check = Image.open(out)
print(check.mode, check.size)
print("corner", check.getpixel((2, 2)))
print("center", check.getpixel((check.size[0] // 2, check.size[1] // 2)))
print("size", os.path.getsize(out))
