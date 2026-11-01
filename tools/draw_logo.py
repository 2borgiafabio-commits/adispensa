"""Logo A'Dispensa: la mensola della dispensa della nonna."""
import sys
from PIL import Image, ImageDraw

S = 1024
u = S / 100


def P(*v):
    return [x * u for x in v]


def shade(c, f):
    return tuple(max(0, min(255, int(x * f))) for x in c)


def draw_logo(bg, wood, outline=None):
    img = Image.new('RGB', (S, S), bg)
    d = ImageDraw.Draw(img)
    ol = outline or shade(wood, 0.55)

    def rr(box, r, fill, line=True):
        d.rounded_rectangle(P(*box), radius=r * u, fill=fill, outline=ol if line else None, width=int(1.1 * u) if line else 0)

    # --- Mensole (assi di legno con mensoline) ---
    def shelf(y):
        for bx in (19, 81):
            d.polygon(P(bx - 3, y + 4.5, bx + 3, y + 4.5, bx, y + 10), fill=shade(wood, 0.75))
        rr((8, y, 92, y + 5), 1.2, wood)
        d.line(P(10, y + 1.6, 90, y + 1.6), fill=shade(wood, 1.15), width=int(0.8 * u))

    # --- Oggetti ---
    def can(x0, x1, y1, h, label, top=(200, 200, 205)):
        y0 = y1 - h
        rr((x0, y0, x1, y1), 1.6, (214, 214, 220))
        d.rectangle(P(x0 + 0.6, y0 + h * 0.28, x1 - 0.6, y1 - h * 0.2), fill=label)
        d.ellipse(P(x0 + (x1 - x0) * 0.32, y0 + h * 0.43, x1 - (x1 - x0) * 0.32, y0 + h * 0.43 + (x1 - x0) * 0.36), fill=(255, 255, 255))
        d.line(P(x0 + 0.8, y0 + 2, x1 - 0.8, y0 + 2), fill=shade(top, 0.8), width=int(0.7 * u))

    def jar(x0, x1, y1, h, content, lid=(196, 62, 48), cloth=True):
        y0 = y1 - h
        rr((x0, y0 + 4, x1, y1), 3, (236, 243, 246))
        rr((x0 + 1.4, y0 + 8, x1 - 1.4, y1 - 1.4), 2.2, content, line=False)
        if cloth:  # copri-barattolo a quadretti con lo spago
            rr((x0 - 1.2, y0, x1 + 1.2, y0 + 5.5), 1.5, lid)
            for i in range(4):
                cx = x0 - 0.2 + i * (x1 - x0 + 1.4) / 4
                d.rectangle(P(cx, y0 + 0.8, cx + 1.4, y0 + 4.7), fill=(250, 240, 230))
            d.line(P(x0 + 0.5, y0 + 5.6, x1 - 0.5, y0 + 5.6), fill=shade(lid, 0.5), width=int(0.9 * u))
        else:
            rr((x0 + 0.5, y0 + 1, x1 - 0.5, y0 + 5), 1.2, lid)
        rr((x0 + 2.4, y0 + h * 0.48, x1 - 2.4, y0 + h * 0.72), 0.8, (252, 248, 236), line=False)

    def bottle(x0, x1, y1, h, glass):
        y0 = y1 - h
        w = x1 - x0
        rr((x0, y0 + h * 0.38, x1, y1), 2.4, glass)
        d.polygon(P(x0 + 0.6, y0 + h * 0.42, x0 + w * 0.36, y0 + h * 0.22, x1 - w * 0.36, y0 + h * 0.22, x1 - 0.6, y0 + h * 0.42), fill=glass, outline=ol)
        rr((x0 + w * 0.34, y0 + h * 0.06, x1 - w * 0.34, y0 + h * 0.26), 0.6, glass)
        rr((x0 + w * 0.3, y0, x1 - w * 0.3, y0 + h * 0.08), 0.6, (196, 160, 110))
        rr((x0 + 1.4, y0 + h * 0.58, x1 - 1.4, y0 + h * 0.8), 0.6, (246, 238, 214), line=False)

    def bag(x0, x1, y1, h, paper=(206, 168, 116)):
        y0 = y1 - h
        pts = [x0, y1, x0 + 0.8, y0 + 4]
        n = 5
        for i in range(n + 1):
            pts += [x0 + 0.8 + i * (x1 - x0 - 1.6) / n, y0 + (0 if i % 2 else 2.4)]
        pts += [x1 - 0.8, y0 + 4, x1, y1]
        d.polygon(P(*pts), fill=paper, outline=ol)
        d.line(P(x0 + 1, y0 + 6.5, x1 - 1, y0 + 6.5), fill=shade(paper, 0.78), width=int(0.9 * u))
        d.text((0, 0), '')
        rr((x0 + 2.5, y0 + h * 0.48, x1 - 2.5, y0 + h * 0.74), 0.6, (250, 245, 232), line=False)
        d.line(P(x0 + 4, y0 + h * 0.61, x1 - 4, y0 + h * 0.61), fill=(120, 96, 70), width=int(0.8 * u))

    def box(x0, x1, y1, h, color):
        y0 = y1 - h
        rr((x0, y0, x1, y1), 1, color)
        rr((x0 + 2.2, y0 + h * 0.36, x1 - 2.2, y0 + h * 0.72), 1, (246, 214, 120), line=False)
        d.line(P(x0 + 2, y0 + h * 0.18, x1 - 2, y0 + h * 0.18), fill=(255, 255, 255), width=int(1 * u))

    # Mensola alta
    shelf(48)
    jar(12, 30, 48, 30, (226, 112, 44))           # marmellata di albicocche
    can(33, 47, 48, 20, (204, 54, 44))           # pelati
    bottle(50, 61, 48, 34, (78, 120, 54))        # olio
    bag(64, 88, 48, 25)                           # farina
    # Mensola bassa
    shelf(84)
    box(12, 26, 84, 25, (40, 92, 168))           # pasta
    can(29, 42, 84, 15, (226, 170, 40))          # tonno
    can(29, 42, 69, 15, (204, 54, 44))           # pelati impilati
    jar(46, 62, 84, 22, (226, 168, 44), lid=(52, 110, 74))  # miele
    jar(66, 87, 84, 26, (176, 40, 52))           # sugo / ciliegie
    # centro verticalmente: alzo tutto di 4 unità
    out = Image.new('RGB', (S, S), bg)
    out.paste(img.crop((0, int(4 * u), S, S)), (0, 0))
    return out


VARIANTS = {
    'A-crema': dict(bg=(244, 234, 214), wood=(166, 106, 60)),
    'B-verde': dict(bg=(46, 125, 91), wood=(186, 128, 76), outline=(70, 44, 24)),
    'C-legno': dict(bg=(58, 42, 32), wood=(196, 140, 84), outline=(30, 20, 14)),
}

if __name__ == '__main__':
    out = sys.argv[1]
    tiles = []
    for name, v in VARIANTS.items():
        im = draw_logo(**v)
        im.save(f'{out}/{name}.png')
        tiles.append(im)
    # Anteprima: grande + piccolo come sull'iPhone (60 px) con angoli arrotondati
    sheet = Image.new('RGB', (3 * 380 + 40, 520), (255, 255, 255))
    for i, im in enumerate(tiles):
        for size, y in ((340, 20), (120, 380)):
            t = im.resize((size, size), Image.LANCZOS)
            m = Image.new('L', (size, size), 0)
            ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.225), fill=255)
            x = 20 + i * 380 + (340 - size) // 2
            sheet.paste(t, (x, y), m)
    sheet.save(f'{out}/anteprima.png')
    print('ok')
