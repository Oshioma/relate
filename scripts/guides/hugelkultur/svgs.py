"""Generate the original illustrations for the Hügelkultur guide.

Every file is an original, hand-built SVG (no traced or copied imagery).
Run: python3 svgs.py OUTDIR
"""
import math
import os
import random
import sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
INK = "#262622"
MUTED = "#6b685f"
CREAM = "#faf9f5"
CARD = "#ffffff"
GREEN = "#4d6a52"
GREEN_L = "#7fa583"
GREEN_SOFT = "#e7ede7"
LEAF = "#5f8f4e"
LEAF_D = "#3f6b35"
SOIL_TOP = "#4a3426"
SOIL = "#6b4a35"
SOIL_L = "#8a6448"
SUBSOIL = "#a98a68"
WOOD = "#c79a62"
WOOD_D = "#8c6239"
BARK = "#5b3d27"
RED = "#b6503a"
RED_SOFT = "#f6e3dd"
AMBER = "#b7832f"
AMBER_SOFT = "#f7ecd6"
BLUE = "#3f7aa6"
BLUE_SOFT = "#e2eef6"
METAL = "#8e959c"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def text(x, y, s, size=22, weight=400, fill=INK, anchor="start", style=""):
    return (
        f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
        f'fill="{fill}" text-anchor="{anchor}" {style}>{esc(s)}</text>'
    )


def lines(x, y, rows, size=22, lh=1.3, **kw):
    return "".join(text(x, y + i * size * lh, r, size=size, **kw) for i, r in enumerate(rows))


def svg(name, w, h, body, title, bg=CREAM):
    out = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
        f"<title>{esc(title)}</title>"
        f'<rect width="{w}" height="{h}" rx="0" fill="{bg}"/>' + body + "</svg>"
    )
    with open(os.path.join(OUT, name), "w") as f:
        f.write(out)


def speckle(x, y, w, h, color, n, seed, r=(1.2, 3.0)):
    rnd = random.Random(seed)
    return "".join(
        f'<circle cx="{x + rnd.random() * w:.1f}" cy="{y + rnd.random() * h:.1f}" r="{rnd.uniform(*r):.1f}" fill="{color}" opacity="{rnd.uniform(.35, .8):.2f}"/>'
        for _ in range(n)
    )


def soil_band(x, y, w, h, color, seed, dots=None, n=None):
    n = n if n is not None else int(w * h / 900)
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"/>' + speckle(
        x, y, w, h, dots or "#00000033", n, seed
    )


def log_end(cx, cy, r, wood=WOOD, bark=BARK, rings=4, seed=0, rot=False):
    """A log seen end-on: bark ring, heartwood, growth rings, a crack."""
    s = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{bark}"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="{r * 0.86:.1f}" fill="{wood}"/>'
    for i in range(1, rings + 1):
        rr = r * 0.86 * i / (rings + 1)
        s += f'<circle cx="{cx}" cy="{cy}" r="{rr:.1f}" fill="none" stroke="{WOOD_D}" stroke-width="{max(1, r / 40):.1f}" opacity=".55"/>'
    rnd = random.Random(seed)
    a = rnd.uniform(0, math.pi * 2)
    s += (
        f'<line x1="{cx}" y1="{cy}" x2="{cx + math.cos(a) * r * 0.8:.1f}" y2="{cy + math.sin(a) * r * 0.8:.1f}" '
        f'stroke="{WOOD_D}" stroke-width="{max(1.5, r / 28):.1f}" opacity=".7"/>'
    )
    if rot:
        s += f'<circle cx="{cx + r * 0.2:.1f}" cy="{cy - r * 0.15:.1f}" r="{r * 0.35:.1f}" fill="#6d5236" opacity=".75"/>'
        s += speckle(cx - r * 0.5, cy - r * 0.5, r, r, "#3b2a1c", 10, seed + 9, (1.5, 3.5))
    return s


def log_side(x, y, w, h, wood=WOOD, bark=BARK, seed=0):
    """A log lying on its side, end visible on the right."""
    rnd = random.Random(seed)
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="{bark}"/>'
    for i in range(5):
        yy = y + h * (0.2 + 0.15 * i)
        s += f'<path d="M{x + h * 0.4:.1f} {yy:.1f} q {w * 0.3:.1f} {rnd.uniform(-4, 4):.1f} {w - h:.1f} 0" stroke="#3e2a1b" stroke-width="2" fill="none" opacity=".5"/>'
    s += log_end(x + w - h / 2, y + h / 2, h / 2, wood, bark, rings=3, seed=seed)
    return s


def plant(x, y, scale=1.0, color=LEAF):
    s = f'<path d="M{x} {y} v{-34 * scale:.1f}" stroke="{LEAF_D}" stroke-width="{3 * scale:.1f}" stroke-linecap="round"/>'
    s += f'<ellipse cx="{x - 12 * scale:.1f}" cy="{y - 26 * scale:.1f}" rx="{13 * scale:.1f}" ry="{7 * scale:.1f}" fill="{color}" transform="rotate(-30 {x - 12 * scale:.1f} {y - 26 * scale:.1f})"/>'
    s += f'<ellipse cx="{x + 12 * scale:.1f}" cy="{y - 34 * scale:.1f}" rx="{13 * scale:.1f}" ry="{7 * scale:.1f}" fill="{color}" transform="rotate(30 {x + 12 * scale:.1f} {y - 34 * scale:.1f})"/>'
    s += f'<ellipse cx="{x:.1f}" cy="{y - 44 * scale:.1f}" rx="{7 * scale:.1f}" ry="{12 * scale:.1f}" fill="{LEAF_D}"/>'
    return s


def label_line(x1, y1, x2, y2, color=INK):
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2"/>'
        f'<circle cx="{x1}" cy="{y1}" r="5" fill="{color}"/>'
    )


def pill(x, y, w, h, fill, stroke=None):
    st = f' stroke="{stroke}" stroke-width="2"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}"{st}/>'


def card(x, y, w, h, fill=CARD, stroke="#e7e3d8"):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'


def bed_frame(x, y, w, h, board="#9c7a52"):
    """Side walls of a raised bed (cut-away), drawn over the contents."""
    t = 18
    return (
        f'<rect x="{x - t}" y="{y}" width="{t}" height="{h}" fill="{board}"/>'
        f'<rect x="{x + w}" y="{y}" width="{t}" height="{h}" fill="{board}"/>'
        f'<rect x="{x - t}" y="{y}" width="{t}" height="{h}" fill="none" stroke="#6e5434" stroke-width="2"/>'
        f'<rect x="{x + w}" y="{y}" width="{t}" height="{h}" fill="none" stroke="#6e5434" stroke-width="2"/>'
    )


def packed_logs(x, y, w, h, seed, tight=True, rot=False):
    """Logs filling a region; tight packing leaves soil-filled gaps, loose leaves voids."""
    rnd = random.Random(seed)
    s = ""
    rows = 3 if h > 140 else 2
    rh = h / rows
    for r in range(rows):
        cx = x + rh * 0.5 + (rh * 0.45 if r % 2 else 0)
        while cx < x + w - rh * 0.35:
            rad = rh * (0.47 if tight else rnd.uniform(0.3, 0.42))
            cy = y + rh * (r + 0.5) + (0 if tight else rnd.uniform(-8, 8))
            s += log_end(cx, cy, rad, seed=rnd.randint(0, 999), rot=rot and rnd.random() < 0.3)
            cx += rad * 2 + (2 if tight else rnd.uniform(18, 40))
    return s


# ---------------------------------------------------------------- cover

def cover():
    w, h = 1600, 1000
    b = ""
    # sky and ground
    b += f'<rect width="{w}" height="{h}" fill="#eef1e8"/>'
    b += f'<circle cx="1360" cy="170" r="90" fill="#f3d58a" opacity=".85"/>'
    b += f'<rect y="760" width="{w}" height="240" fill="{SUBSOIL}"/>' + speckle(0, 760, w, 240, "#00000022", 260, 3)
    # bed cut-away
    bx, by, bw, bh = 260, 300, 1080, 460
    b += soil_band(bx, by, bw, 70, SOIL_TOP, 1, "#00000044")
    b += soil_band(bx, by + 70, bw, 90, SOIL, 2, "#00000033")
    b += soil_band(bx, by + 160, bw, 70, SOIL_L, 4, "#00000030")
    # twigs layer
    rnd = random.Random(5)
    for _ in range(70):
        x0 = bx + rnd.random() * (bw - 70)
        y0 = by + 170 + rnd.random() * 50
        a = rnd.uniform(-0.5, 0.5)
        b += f'<line x1="{x0:.0f}" y1="{y0:.0f}" x2="{x0 + 60 * math.cos(a):.0f}" y2="{y0 + 60 * math.sin(a):.0f}" stroke="{WOOD_D}" stroke-width="5" stroke-linecap="round"/>'
    b += soil_band(bx, by + 230, bw, 230, SOIL_L, 6, "#00000030")
    b += packed_logs(bx + 4, by + 236, bw - 8, 222, 7)
    b += bed_frame(bx, by - 10, bw, bh + 10)
    # plants
    for i in range(9):
        b += plant(bx + 70 + i * 118, by + 4, 1.9 if i % 2 else 1.5)
    # mulch
    b += f'<rect x="{bx}" y="{by - 6}" width="{bw}" height="12" fill="#b88c55"/>'
    b += text(80, 120, "Hügelkultur raised beds", 64, 700, GREEN)
    b += text(80, 180, "Fill the bottom with wood. Save soil. Grow more.", 34, 400, INK)
    svg("cover.svg", w, h, b, "Cut-away of a raised bed with logs at the bottom and vegetables on top")


# ---------------------------------------------------------------- 1. traditional mound vs tall bed

def mound_vs_bed():
    w, h = 900, 560
    b = card(20, 20, 420, 520) + card(460, 20, 420, 520)
    b += text(230, 70, "Traditional hügel mound", 26, 700, anchor="middle")
    b += text(670, 70, "Tall raised bed", 26, 700, anchor="middle")
    # mound
    b += f'<rect x="40" y="420" width="380" height="30" fill="{SUBSOIL}"/>'
    b += f'<path d="M50 420 Q230 120 410 420 Z" fill="{SOIL}"/>'
    b += f'<path d="M110 420 Q230 230 350 420 Z" fill="{SOIL_L}"/>'
    for cx, cy, r in [(180, 395, 26), (235, 390, 30), (290, 395, 26), (205, 345, 22), (262, 345, 22), (235, 305, 18)]:
        b += log_end(cx, cy, r, seed=cx)
    for px in [130, 190, 250, 310]:
        b += plant(px, 235 + abs(px - 230) * 0.9, 0.9)
    b += lines(230, 486, ["Logs piled on the ground,", "covered with soil and turf"], 20, fill=MUTED, anchor="middle")
    # tall bed
    bx, by, bw, bh = 520, 150, 300, 270
    b += f'<rect x="480" y="420" width="380" height="30" fill="{SUBSOIL}"/>'
    b += soil_band(bx, by, bw, 80, SOIL_TOP, 11)
    b += soil_band(bx, by + 80, bw, 50, SOIL, 12)
    b += soil_band(bx, by + 130, bw, 140, SOIL_L, 13)
    b += packed_logs(bx + 2, by + 134, bw - 4, 134, 14)
    b += bed_frame(bx, by - 6, bw, bh + 6)
    for px in [560, 640, 720, 790]:
        b += plant(px, by + 2, 0.9)
    b += lines(670, 486, ["The same idea inside walls:", "wood low, good soil high"], 20, fill=MUTED, anchor="middle")
    svg("mound-vs-bed.svg", w, h, b, "A traditional hügel mound compared with a tall raised bed filled with logs")


# ---------------------------------------------------------------- 2. the numbers from the video

def numbers():
    w, h = 900, 520
    b = text(450, 60, "The example bed in the video", 30, 700, anchor="middle")
    items = [
        ("4 × 8 ft", "30 in tall", "1.2 × 2.4 m, 76 cm tall"),
        ("≈ 80 ft³", "to fill", "about 2.3 m³"),
        ("40–50 bags", "of bagged soil", "the presenter's count"),
        ("$400–1,000", "in premium soil", "his estimate, US prices"),
    ]
    for i, (big, mid, small) in enumerate(items):
        x = 30 + (i % 2) * 430
        y = 90 + (i // 2) * 170
        b += card(x, y, 410, 150)
        b += text(x + 205, y + 62, big, 44, 700, GREEN, "middle")
        b += text(x + 205, y + 98, mid, 22, 600, INK, "middle")
        b += text(x + 205, y + 128, small, 19, 400, MUTED, "middle")
    b += pill(30, 440, 840, 60, GREEN_SOFT)
    b += text(450, 479, "Presenter's estimate: up to about 60% less soil to buy", 24, 700, GREEN, "middle")
    svg("video-numbers.svg", w, h, b, "Key numbers from the video: a 4 by 8 foot bed, 30 inches tall, about 80 cubic feet")


# ---------------------------------------------------------------- 3. recommended woods

def woods_good():
    w, h = 900, 760
    b = text(450, 56, "Woods recommended in the video", 30, 700, anchor="middle")
    b += text(450, 92, "Untreated, ideally already ageing. Illustrations, not photos.", 20, 400, MUTED, "middle")
    woods = [
        ("Oak", "#c9a26b", "#4f3a28", "Dense hardwood, slow"),
        ("Maple", "#e0c393", "#6e6156", "Hardwood"),
        ("Birch", "#ead8b4", "#e9e4da", "Rots relatively fast"),
        ("Poplar", "#e6d5ae", "#8d8a78", "Light, rots fast"),
        ("Apple", "#d6a97a", "#5d4a3a", "Fruit-tree prunings"),
        ("Pine", "#e2bf7f", "#7a4b2c", "Softwood, resinous"),
        ("Fir", "#e5c995", "#6d5a48", "Softwood"),
    ]
    for i, (name, wood, bark, note) in enumerate(woods):
        col, row = i % 2, i // 2
        x = 30 + col * 430
        y = 120 + row * 155
        if i == 6:
            x = 245
        b += card(x, y, 410, 140)
        b += log_end(x + 75, y + 70, 52, wood, bark, 4, seed=i)
        if name == "Birch":
            b += f'<path d="M{x + 40} {y + 40} h14 M{x + 95} {y + 108} h12 M{x + 112} {y + 52} h10" stroke="#2c2a26" stroke-width="4"/>'
        b += text(x + 150, y + 62, name, 30, 700)
        b += text(x + 150, y + 96, note, 19, 400, MUTED)
    svg("woods-recommended.svg", w, h, b, "End-grain illustrations of oak, maple, birch, poplar, apple, pine and fir logs")


# ---------------------------------------------------------------- 4. woods to avoid - two kinds of problem

def woods_avoid():
    w, h = 900, 700
    b = text(450, 56, "Woods the video says to avoid", 30, 700, anchor="middle")
    b += text(450, 92, "Two different problems. Neither group is simply 'poisonous'.", 20, 400, MUTED, "middle")
    # left: juglone
    b += card(30, 120, 410, 550, AMBER_SOFT, "#e6cf9f")
    b += text(235, 166, "Juglone concern", 26, 700, AMBER, "middle")
    b += lines(235, 200, ["Can hold back the growth", "of some plants"], 20, fill=INK, anchor="middle")
    for j, (name, wood, bark) in enumerate([("Black walnut", "#6d4a2e", "#2e2119"), ("Butternut", "#b58a5c", "#5b4a3d"), ("Pecan", "#a97d55", "#4c3a2c")]):
        y = 270 + j * 130
        b += log_end(110, y + 40, 46, wood, bark, 4, seed=40 + j)
        b += text(180, y + 50, name, 26, 600)
    # right: decay resistant
    b += card(460, 120, 410, 550, BLUE_SOFT, "#bfd6e6")
    b += text(665, 166, "Resists rotting", 26, 700, BLUE, "middle")
    b += lines(665, 200, ["Breaks down so slowly it", "doesn't feed the bed"], 20, fill=INK, anchor="middle")
    for j, (name, wood, bark) in enumerate([("Cedar", "#c2744a", "#6d3e28"), ("Redwood", "#a8503a", "#5a2d22"), ("Black locust", "#c9b25a", "#4d4433")]):
        y = 270 + j * 130
        b += log_end(540, y + 40, 46, wood, bark, 4, seed=60 + j)
        b += text(610, y + 50, name, 26, 600)
    svg("woods-avoid.svg", w, h, b, "Woods to avoid: black walnut, butternut and pecan for juglone; cedar, redwood and black locust because they resist decay")


# ---------------------------------------------------------------- 5. never bury

def never_bury():
    w, h = 900, 640
    b = text(450, 56, "Never bury these", 30, 700, RED, "middle")
    b += text(450, 92, "Additional advice: chemicals and glues can leach into food-growing soil", 20, 400, MUTED, "middle")
    items = [
        ("Pressure-treated", "green-tinged timber"),
        ("Painted or varnished", "unknown coatings"),
        ("Creosote", "old sleepers, posts"),
        ("Plywood & MDF", "chipboard too: glues, resins"),
        ("Unknown pallets", "check stamps; skip if unsure"),
        ("Diseased or infested", "can spread problems"),
    ]
    for i, (a, bb) in enumerate(items):
        x = 30 + (i % 2) * 430
        y = 120 + (i // 2) * 170
        b += card(x, y, 410, 150, RED_SOFT, "#ebc4b8")
        cx, cy = x + 70, y + 75
        b += f'<rect x="{cx - 40}" y="{cy - 22}" width="80" height="44" rx="6" fill="#b49a77"/>'
        if i == 0:
            b += f'<rect x="{cx - 40}" y="{cy - 22}" width="80" height="44" rx="6" fill="#7e9b6a"/>'
            b += f'<path d="M{cx - 30} {cy - 8} h22 M{cx - 30} {cy + 4} h40 M{cx - 30} {cy + 14} h30" stroke="#5d7a4c" stroke-width="3"/>'
        if i == 1:
            b += f'<rect x="{cx - 40}" y="{cy - 22}" width="80" height="20" rx="4" fill="#4b7fb3"/>'
        if i == 2:
            b += f'<rect x="{cx - 40}" y="{cy - 22}" width="80" height="44" rx="6" fill="#2d2620"/>'
        if i == 3:
            for k in range(4):
                b += f'<line x1="{cx - 40}" y1="{cy - 14 + k * 10}" x2="{cx + 40}" y2="{cy - 14 + k * 10}" stroke="#8a7357" stroke-width="3"/>'
        if i == 4:
            b += f'<rect x="{cx - 44}" y="{cy - 24}" width="88" height="12" fill="#b49a77"/><rect x="{cx - 44}" y="{cy + 12}" width="88" height="12" fill="#b49a77"/><rect x="{cx - 34}" y="{cy - 12}" width="14" height="24" fill="#9a805f"/><rect x="{cx + 20}" y="{cy - 12}" width="14" height="24" fill="#9a805f"/>'
        if i == 5:
            b += speckle(cx - 36, cy - 18, 72, 36, "#3b2a1c", 14, 77, (2, 4))
        b += f'<circle cx="{cx}" cy="{cy}" r="52" fill="none" stroke="{RED}" stroke-width="7"/>'
        b += f'<line x1="{cx - 37}" y1="{cy + 37}" x2="{cx + 37}" y2="{cy - 37}" stroke="{RED}" stroke-width="7"/>'
        b += text(x + 140, y + 68, a, 22, 700)
        b += text(x + 140, y + 100, bb, 19, 400, MUTED)
    svg("never-bury.svg", w, h, b, "Materials never to bury: pressure-treated, painted, creosoted, plywood or MDF, unknown pallets, diseased wood")


# ---------------------------------------------------------------- 6. sourcing

def sourcing():
    w, h = 900, 520
    b = text(450, 56, "Where to find logs", 30, 700, anchor="middle")
    items = [
        ("Arborists & tree surgeons", "Often glad to drop a load", "Presenter's source for 15+ beds"),
        ("Hardwood workshops", "Solid, untreated offcuts only", "Ask what the timber is"),
        ("Firewood suppliers", "Seasoned splits work well", "Confirm species"),
        ("Your own garden", "Prunings and fallen branches", "Free, and you know the history"),
    ]
    for i, (a, bb, c) in enumerate(items):
        x = 30 + (i % 2) * 430
        y = 90 + (i // 2) * 210
        b += card(x, y, 410, 190)
        b += f'<circle cx="{x + 60}" cy="{y + 62}" r="34" fill="{GREEN_SOFT}"/>'
        b += text(x + 60, y + 74, str(i + 1), 32, 700, GREEN, "middle")
        b += lines(x + 110, y + 56, [a], 22, weight=700)
        b += text(x + 110, y + 90, bb, 19, 400, INK)
        b += text(x + 30, y + 150, c, 18, 400, MUTED)
    svg("sourcing.svg", w, h, b, "Four places to source logs: arborists, hardwood workshops, firewood suppliers and your own garden")


# ---------------------------------------------------------------- 7. nitrogen boundary (required)

def nitrogen():
    w, h = 900, 640
    b = text(450, 56, "Where nitrogen gets locked up", 30, 700, anchor="middle")
    b += soil_band(40, 90, 820, 500, SOIL_L, 21, "#00000025")
    # log
    b += f'<rect x="140" y="250" width="620" height="180" rx="90" fill="{BARK}"/>'
    b += f'<rect x="160" y="268" width="580" height="144" rx="72" fill="{WOOD}"/>'
    for k in range(5):
        b += f'<path d="M190 {290 + k * 25} Q450 {282 + k * 25} 710 {290 + k * 25}" stroke="{WOOD_D}" stroke-width="2" fill="none" opacity=".5"/>'
    # boundary zone
    b += f'<rect x="110" y="220" width="680" height="240" rx="120" fill="none" stroke="{AMBER}" stroke-width="26" opacity=".45"/>'
    # fungal threads
    rnd = random.Random(8)
    for _ in range(40):
        x0 = rnd.uniform(140, 760)
        y0 = rnd.choice([rnd.uniform(215, 250), rnd.uniform(430, 465)])
        b += f'<path d="M{x0:.0f} {y0:.0f} q {rnd.uniform(-20, 20):.0f} {rnd.uniform(-14, 14):.0f} {rnd.uniform(-30, 30):.0f} {rnd.uniform(-10, 10):.0f}" stroke="#f4efe2" stroke-width="2" fill="none" opacity=".9"/>'
    # N arrows
    for x0 in [220, 380, 540, 700]:
        b += f'<g><circle cx="{x0}" cy="150" r="20" fill="{GREEN}"/>' + text(x0, 158, "N", 22, 700, "#fff", "middle") + "</g>"
        b += f'<path d="M{x0} 172 V212" stroke="{GREEN}" stroke-width="4" marker-end="url(#ah)"/>'
    b += '<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#4d6a52"/></marker></defs>'
    # roots
    for x0 in [300, 600]:
        b += f'<path d="M{x0} 90 q -10 60 10 120 q 8 20 -6 30" stroke="#e9dcc3" stroke-width="5" fill="none" stroke-linecap="round"/>'
    b += text(450, 350, "Wood: roughly 400 parts carbon to 1 nitrogen", 24, 700, INK, "middle")
    b += pill(60, 520, 780, 56, "#ffffffee")
    b += text(450, 556, "Microbes at the wood-soil edge take nitrogen from the soil around them", 21, 600, AMBER, "middle")
    b += text(80, 130, "Soil nitrogen", 20, 600, "#fff")
    b += text(830, 130, "Roots reaching down", 20, 600, "#fff", "end")
    svg("nitrogen-boundary.svg", w, h, b, "Diagram of nitrogen being drawn from soil into the microbe-rich zone around a buried log")


# ---------------------------------------------------------------- 8. termite distance

def termites():
    w, h = 900, 520
    b = text(450, 56, "Keep wood-filled beds away from the house", 30, 700, anchor="middle")
    b += f'<rect y="360" width="{w}" height="70" fill="{SUBSOIL}"/>'
    # house
    b += f'<rect x="60" y="170" width="220" height="190" fill="#e9e1d1" stroke="#9c8c72" stroke-width="3"/>'
    b += f'<path d="M40 175 L170 90 L300 175 Z" fill="#9c6b4b"/>'
    b += f'<rect x="150" y="270" width="50" height="90" fill="#8c6239"/>'
    b += f'<rect x="90" y="210" width="44" height="40" fill="#bcd3e0"/>'
    # bed
    b += soil_band(600, 270, 240, 90, SOIL, 31)
    b += packed_logs(602, 312, 236, 46, 32)
    b += bed_frame(600, 262, 240, 98)
    for px in [630, 690, 750, 810]:
        b += plant(px, 272, 0.8)
    # dimension
    b += f'<path d="M290 400 H590" stroke="{INK}" stroke-width="3" marker-start="url(#a2)" marker-end="url(#a2)"/>'
    b += '<defs><marker id="a2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#262622"/></marker></defs>'
    b += text(440, 470, "10–15 ft (about 3–4.5 m)", 26, 700, INK, "middle")
    b += text(440, 502, "Video suggestion. Lowers risk; not a guarantee.", 19, 400, MUTED, "middle")
    svg("termite-distance.svg", w, h, b, "A raised bed placed 10 to 15 feet from a house to reduce termite risk")


# ---------------------------------------------------------------- 9. mesh barrier

def mesh():
    w, h = 900, 560
    b = text(450, 56, "Hardware cloth under the bed", 30, 700, anchor="middle")
    b += f'<rect y="330" width="{w}" height="230" fill="{SUBSOIL}"/>' + speckle(0, 330, w, 230, "#00000022", 120, 41)
    # mesh perimeter beyond bed
    b += f'<rect x="150" y="322" width="600" height="14" fill="none"/>'
    for k in range(0, 601, 16):
        b += f'<line x1="{150 + k}" y1="320" x2="{150 + k}" y2="338" stroke="{METAL}" stroke-width="2"/>'
    b += f'<line x1="150" y1="322" x2="750" y2="322" stroke="{METAL}" stroke-width="3"/><line x1="150" y1="336" x2="750" y2="336" stroke="{METAL}" stroke-width="3"/>'
    # bed
    b += soil_band(220, 150, 460, 170, SOIL, 42)
    b += packed_logs(222, 240, 456, 78, 43)
    b += bed_frame(220, 140, 460, 182)
    for px in [260, 340, 420, 500, 580, 650]:
        b += plant(px, 152, 0.85)
    # mole tunnel
    b += f'<path d="M40 470 Q200 520 330 450 Q420 400 440 350" stroke="#5b4430" stroke-width="22" fill="none" stroke-linecap="round" opacity=".8"/>'
    b += f'<ellipse cx="445" cy="352" rx="26" ry="16" fill="#3b3330"/><circle cx="462" cy="347" r="3" fill="#fff"/>'
    b += label_line(750, 329, 800, 250)
    b += lines(800, 230, ["¼ in (6 mm)", "heavy-duty"], 20, weight=700, anchor="middle")
    b += text(110, 250, "Mesh extends", 19, 600, INK, "middle")
    b += text(110, 274, "past the walls", 19, 600, INK, "middle")
    b += label_line(150, 329, 120, 286)
    b += pill(470, 470, 400, 62, "#ffffffdd")
    b += text(670, 509, "Moles, voles and gophers stop here", 21, 700, GREEN, "middle")
    svg("mesh-barrier.svg", w, h, b, "Quarter-inch hardware cloth laid under a raised bed and extending past its walls, blocking a burrowing animal")


# ---------------------------------------------------------------- 10. packing comparison (required)

def packing():
    w, h = 900, 620
    b = text(450, 56, "Loose logs vs tightly packed logs", 30, 700, anchor="middle")
    for side in (0, 1):
        x = 30 + side * 440
        b += card(x, 90, 400, 500, RED_SOFT if side == 0 else GREEN_SOFT, "#ebc4b8" if side == 0 else "#c7d6c8")
        bx, by, bw, bh = x + 50, 160, 300, 300
        b += soil_band(bx, by, bw, 110, SOIL, 50 + side)
        if side == 0:
            b += f'<rect x="{bx}" y="{by + 110}" width="{bw}" height="190" fill="#2d241d"/>'
            b += packed_logs(bx + 4, by + 114, bw - 8, 182, 52, tight=False)
            b += f'<rect x="{bx}" y="{by}" width="{bw}" height="40" fill="{CARD}" opacity=".85"/>'
            b += text(bx + bw / 2, by + 28, "soil sinks 6–12 in", 20, 700, RED, "middle")
        else:
            b += soil_band(bx, by + 110, bw, 190, SOIL_L, 53)
            b += packed_logs(bx + 2, by + 112, bw - 4, 186, 54, tight=True)
        b += bed_frame(bx, by - 4, bw, bh + 4)
        title = "Loose: air pockets" if side == 0 else "Tight: soil in every gap"
        b += text(x + 200, 136, title, 24, 700, RED if side == 0 else GREEN, "middle")
        sub = ["Dark gaps collapse later,", "so the bed sinks"] if side == 0 else ["Big logs first, fitted", "like Jenga, then watered in"]
        b += lines(x + 200, 510, sub, 20, fill=INK, anchor="middle")
    svg("packing-compare.svg", w, h, b, "Comparison: loosely placed logs leave air pockets that collapse, tightly fitted logs with soil washed into the gaps stay level")


# ---------------------------------------------------------------- 11. drainage

def drainage():
    w, h = 900, 560
    b = text(450, 56, "Moist is good. Waterlogged is not.", 30, 700, anchor="middle")
    for side in (0, 1):
        x = 30 + side * 440
        b += card(x, 90, 400, 440, GREEN_SOFT if side == 0 else RED_SOFT, "#c7d6c8" if side == 0 else "#ebc4b8")
        bx, by, bw = x + 50, 170, 300
        b += soil_band(bx, by, bw, 90, SOIL, 60 + side)
        b += soil_band(bx, by + 90, bw, 150, SOIL_L, 62 + side)
        b += packed_logs(bx + 2, by + 92, bw - 4, 146, 64)
        if side == 1:
            b += f'<rect x="{bx}" y="{by + 150}" width="{bw}" height="90" fill="{BLUE}" opacity=".55"/>'
            for k in range(6):
                b += f'<circle cx="{bx + 40 + k * 45}" cy="{by + 140 - (k % 2) * 14}" r="6" fill="none" stroke="#fff" stroke-width="2"/>'
        else:
            for k in range(14):
                b += f'<circle cx="{bx + 20 + (k * 41) % 280}" cy="{by + 100 + (k * 23) % 130}" r="4" fill="{BLUE}" opacity=".7"/>'
            for k in range(4):
                b += f'<path d="M{bx + 50 + k * 70} {by + 245} v28" stroke="{BLUE}" stroke-width="3" marker-end="url(#ad)"/>'
        b += bed_frame(bx, by - 4, bw, 244)
        b += f'<rect x="{x + 10}" y="{by + 240}" width="380" height="30" fill="{SUBSOIL if side == 0 else "#7d7a73"}"/>'
        b += text(x + 200, 136, "Free-draining" if side == 0 else "Standing water", 24, 700, GREEN if side == 0 else RED, "middle")
        sub = ["Wood holds some moisture,", "extra water drains away"] if side == 0 else ["No oxygen: sour smell,", "roots struggle"]
        b += lines(x + 200, 470, sub, 20, anchor="middle")
    b += '<defs><marker id="ad" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#3f7aa6"/></marker></defs>'
    svg("drainage.svg", w, h, b, "A free-draining wood-filled bed compared with a waterlogged one with standing water around the logs")


# ---------------------------------------------------------------- 12-15. build steps, four 2x2 panels

def step_panel(x, y, n, title, draw):
    s = card(x, y, 410, 400)
    s += f'<circle cx="{x + 40}" cy="{y + 40}" r="24" fill="{GREEN}"/>' + text(x + 40, y + 49, str(n), 24, 700, "#fff", "middle")
    s += text(x + 76, y + 50, title, 23, 700)
    s += draw(x + 25, y + 80, 360, 290)
    return s


def mini_bed(x, y, w, h, fill_to=0.0, logs=0, tight=True, seed=0, extra=""):
    """A small bed cut-away filled from the bottom; fill_to 0..1 is soil height."""
    s = f'<rect x="{x}" y="{y + h}" width="{w}" height="18" fill="{SUBSOIL}"/>'
    s += f'<rect x="{x + 30}" y="{y}" width="{w - 60}" height="{h}" fill="#f1ece0"/>'
    if fill_to:
        fh = h * fill_to
        s += soil_band(x + 30, y + h - fh, w - 60, fh, SOIL_L, seed + 1)
    if logs:
        s += packed_logs(x + 32, y + h - logs, w - 64, logs - 2, seed + 2, tight=tight)
    s += extra
    s += bed_frame(x + 30, y, w - 60, h)
    return s


def steps():
    BX, BY, BW, BH = 0, 0, 0, 0  # noqa

    def site(x, y, w, h):
        s = f'<rect x="{x}" y="{y + 160}" width="{w}" height="90" fill="{SUBSOIL}"/>'
        s += f'<path d="M{x} {y + 160} H{x + w}" stroke="{LEAF}" stroke-width="10"/>'
        s += f'<rect x="{x + 60}" y="{y + 60}" width="240" height="100" fill="none" stroke="{INK}" stroke-width="3" stroke-dasharray="10 8"/>'
        s += f'<circle cx="{x + 320}" cy="{y + 30}" r="26" fill="#f3d58a"/>'
        for k in range(5):
            s += f'<path d="M{x + 80 + k * 50} {y + 180} v40" stroke="{BLUE}" stroke-width="3" marker-end="url(#as)"/>'
        s += text(x + w / 2, y + 285, "Level, sunny, drains freely", 19, 600, MUTED, "middle")
        return s

    def mesh_(x, y, w, h):
        s = f'<rect x="{x}" y="{y + 200}" width="{w}" height="50" fill="{SUBSOIL}"/>'
        s += bed_frame(x + 70, y + 60, 220, 140)
        for k in range(0, 281, 12):
            s += f'<line x1="{x + 40 + k}" y1="{y + 192}" x2="{x + 40 + k}" y2="{y + 206}" stroke="{METAL}" stroke-width="2"/>'
        s += f'<line x1="{x + 40}" y1="{y + 194}" x2="{x + 320}" y2="{y + 194}" stroke="{METAL}" stroke-width="3"/><line x1="{x + 40}" y1="{y + 204}" x2="{x + 320}" y2="{y + 204}" stroke="{METAL}" stroke-width="3"/>'
        s += text(x + w / 2, y + 285, "Extend past the walls; fix securely", 19, 600, MUTED, "middle")
        return s

    def biglogs(x, y, w, h):
        s = mini_bed(x + 20, y + 20, 320, 220, 0, 0, seed=3)
        for i, cx in enumerate([86, 154, 222, 290]):
            s += log_end(x + cx, y + 204, 34, seed=i)
        s += text(x + w / 2, y + 285, "Largest logs on the bottom", 19, 600, MUTED, "middle")
        return s

    def jenga(x, y, w, h):
        s = mini_bed(x + 20, y + 20, 320, 220, 0, 160, True, seed=4)
        s += text(x + w / 2, y + 285, "Fit them close, like Jenga", 19, 600, MUTED, "middle")
        return s

    def wet(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0, 140, True, seed=5)
        s += f'<path d="M{x + 40} {y + 20} q 60 -20 120 20" stroke="#4f7a3d" stroke-width="10" fill="none" stroke-linecap="round"/>'
        for k in range(8):
            s += f'<path d="M{x + 160 + k * 8} {y + 44} l {k * 4 - 10} 60" stroke="{BLUE}" stroke-width="3" opacity=".8"/>'
        s += text(x + w / 2, y + 285, "Soak logs; pre-soaking optional", 19, 600, MUTED, "middle")
        return s

    def soil_(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.55, 140, True, seed=6)
        s += f'<path d="M{x + 210} {y + 20} l 90 -10 l -10 40 z" fill="#9a9a9a"/>'
        s += speckle(x + 200, y + 40, 60, 40, SOIL, 16, 66, (2, 5))
        s += text(x + w / 2, y + 285, "Pour soil between the logs", 19, 600, MUTED, "middle")
        return s

    def shake(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.7, 140, True, seed=7)
        for k in range(3):
            s += f'<path d="M{x + 10 + k * 8} {y + 120} q 6 20 0 40" stroke="{INK}" stroke-width="3" fill="none"/>'
            s += f'<path d="M{x + 350 - k * 8} {y + 120} q -6 20 0 40" stroke="{INK}" stroke-width="3" fill="none"/>'
        s += text(x + w / 2, y + 285, "Shake soil down into crevices", 19, 600, MUTED, "middle")
        return s

    def jet(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.75, 140, True, seed=8)
        s += f'<path d="M{x + 330} {y + 10} L{x + 250} {y + 40}" stroke="#4f7a3d" stroke-width="12" stroke-linecap="round"/>'
        s += f'<path d="M{x + 248} {y + 42} L{x + 180} {y + 150}" stroke="{BLUE}" stroke-width="6" opacity=".8"/>'
        s += f'<path d="M{x + 248} {y + 42} L{x + 200} {y + 160}" stroke="{BLUE}" stroke-width="3" opacity=".6"/>'
        s += text(x + w / 2, y + 285, "Hose jet washes soil into gaps", 19, 600, MUTED, "middle")
        return s

    def fert(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.8, 140, True, seed=9)
        s += speckle(x + 40, y + 90, 280, 20, "#f1e6c8", 40, 99, (2, 3.5))
        s += f'<rect x="{x + 150}" y="{y + 6}" width="60" height="60" rx="8" fill="{GREEN_SOFT}" stroke="{GREEN}" stroke-width="2"/>'
        s += text(x + 180, y + 44, "N", 26, 700, GREEN, "middle")
        s += text(x + w / 2, y + 285, "A light sprinkle of fertiliser", 19, 600, MUTED, "middle")
        return s

    def twigs(x, y, w, h):
        extra = ""
        rnd = random.Random(10)
        for _ in range(30):
            x0 = x + 40 + rnd.random() * 260
            y0 = y + 100 + rnd.random() * 26
            extra += f'<line x1="{x0:.0f}" y1="{y0:.0f}" x2="{x0 + 34:.0f}" y2="{y0 + rnd.uniform(-8, 8):.0f}" stroke="{WOOD_D}" stroke-width="4" stroke-linecap="round"/>'
        for _ in range(26):
            x0 = x + 40 + rnd.random() * 260
            y0 = y + 92 + rnd.random() * 10
            extra += f'<path d="M{x0:.0f} {y0:.0f} l 4 -12" stroke="{LEAF}" stroke-width="3"/>'
        s = mini_bed(x + 20, y + 60, 320, 180, 0.8, 140, True, seed=11, extra=extra)
        s += text(x + w / 2, y + 285, "Twigs, clippings, garden debris", 19, 600, MUTED, "middle")
        return s

    def scraps(x, y, w, h):
        extra = ""
        for k, c in enumerate(["#e58b3a", "#c6d26b", "#d9534f", "#f2d98d", "#8bb174"]):
            extra += f'<ellipse cx="{x + 90 + k * 45}" cy="{y + 112}" rx="14" ry="9" fill="{c}"/>'
        extra += soil_band(x + 32, y + 96, 296, 10, SOIL_L, 120)
        s = mini_bed(x + 20, y + 60, 320, 180, 0.8, 140, True, seed=12, extra=extra)
        s += text(x + w / 2, y + 285, "Scraps: buried deep, plant-based", 19, 600, MUTED, "middle")
        return s

    def cheap(x, y, w, h):
        s = mini_bed(x + 20, y + 30, 320, 210, 0.85, 120, True, seed=13)
        s += f'<rect x="{x + 32}" y="{y + 62}" width="296" height="40" fill="{SOIL}"/>'
        s += text(x + 180, y + 88, "budget soil", 18, 700, "#fff", "middle")
        s += text(x + w / 2, y + 285, "Cheaper soil for the middle", 19, 600, MUTED, "middle")
        return s

    def premium(x, y, w, h):
        s = mini_bed(x + 20, y + 30, 320, 210, 0.9, 120, True, seed=14)
        s += f'<rect x="{x + 32}" y="{y + 50}" width="296" height="54" fill="{SOIL_TOP}"/>'
        s += text(x + 180, y + 84, "best soil on top", 18, 700, "#fff", "middle")
        s += text(x + w / 2, y + 285, "Premium planting mix on top", 19, 600, MUTED, "middle")
        return s

    def overfill(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 1.0, 120, True, seed=15)
        s += f'<path d="M{x + 32} {y + 62} Q{x + 180} {y + 20} {x + 328} {y + 62} Z" fill="{SOIL_TOP}"/>'
        s += text(x + w / 2, y + 285, "Mound slightly above the rim", 19, 600, MUTED, "middle")
        return s

    def water(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 1.0, 120, True, seed=16)
        s += f'<rect x="{x + 230}" y="{y + 6}" width="70" height="44" rx="8" fill="{GREEN}"/><path d="M{x + 230} {y + 22} l -60 10" stroke="{GREEN}" stroke-width="8"/>'
        for k in range(10):
            s += f'<line x1="{x + 160 - k * 9}" y1="{y + 34}" x2="{x + 130 - k * 9}" y2="{y + 56}" stroke="{BLUE}" stroke-width="2"/>'
        s += text(x + w / 2, y + 285, "Water thoroughly", 19, 600, MUTED, "middle")
        return s

    def settle(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.95, 120, True, seed=17)
        s += f'<circle cx="{x + 300}" cy="{y + 24}" r="22" fill="#d8d3c4"/><circle cx="{x + 310}" cy="{y + 18}" r="20" fill="{CARD}"/>'
        for k in range(3):
            s += text(x + 60 + k * 30, y + 30 - k * 8, "z", 22 + k * 4, 700, MUTED)
        s += text(x + w / 2, y + 285, "Let it settle, ideally overnight", 19, 600, MUTED, "middle")
        return s

    def top_up(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.95, 120, True, seed=18)
        for k in range(5):
            s += plant(x + 70 + k * 55, y + 70, 0.8)
        s += text(x + w / 2, y + 285, "Top up the low spots, then plant", 19, 600, MUTED, "middle")
        return s

    def org(x, y, w, h):
        s = mini_bed(x + 20, y + 60, 320, 180, 0.95, 120, True, seed=19)
        s += speckle(x + 40, y + 70, 280, 12, "#e8d9a8", 36, 191, (2, 3.5))
        s += text(x + w / 2, y + 285, "Optional organic feed near the top", 19, 600, MUTED, "middle")
        return s

    defs = (
        '<defs><marker id="as" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">'
        '<path d="M0 0 L10 5 L0 10 z" fill="#3f7aa6"/></marker></defs>'
    )
    groups = [
        ("steps-1-4.svg", "Build steps 1 to 4: choose the site, lay mesh, place large logs, fit them tightly",
         [(1, "Pick a well-drained site", site), (2, "Lay the mesh (if needed)", mesh_), (3, "Largest logs first", biglogs), (4, "Pack them tightly", jenga)]),
        ("steps-5-8.svg", "Build steps 5 to 8: wet the logs, add soil, shake it down, wash it into gaps",
         [(5, "Wet the logs", wet), (6, "Add soil between logs", soil_), (7, "Shake it down", shake), (8, "Use the hose jet", jet)]),
        ("steps-9-12.svg", "Build steps 9 to 12: light fertiliser, twigs and clippings, food scraps, second light feed",
         [(9, "Light fertiliser", fert), (10, "Twigs and clippings", twigs), (11, "Food scraps (with care)", scraps), (12, "Second light feed", fert)]),
        ("steps-13-16.svg", "Build steps 13 to 16: budget soil, premium soil, optional organic feed, slight overfill",
         [(13, "Budget soil mix", cheap), (14, "High-quality soil", premium), (15, "Optional organic feed", org), (16, "Overfill slightly", overfill)]),
    ]
    for name, title, panels in groups:
        b = defs
        for i, (n, t, fn) in enumerate(panels):
            b += step_panel(30 + (i % 2) * 430, 30 + (i // 2) * 420, n, t, fn)
        svg(name, 900, 880, b, title)
    # standalone settle panel and plant panel for the last steps
    b = defs + step_panel(30, 30, 17, "Water thoroughly", water) + step_panel(460, 30, 18, "Settle overnight", settle)
    b += step_panel(245, 450, 19, "Check level and plant", top_up)
    svg("steps-17-19.svg", 900, 880, b, "Build steps 17 to 19: water thoroughly, let the bed settle overnight, then top up and plant")


# ---------------------------------------------------------------- 16. layer cross-section 76 cm (required)

def layers():
    w, h = 900, 980
    b = text(450, 56, "Layers in a 76 cm (30 in) bed", 30, 700, anchor="middle")
    b += text(450, 92, "Suggested depths for illustration. The video gives no exact layer depths.", 19, 400, MUTED, "middle")
    bx, by, bw = 90, 150, 440
    scale = 9.0  # px per cm
    bands = [
        ("Surface mulch", 3, "#b88c55", "1–2 in", "3–5 cm"),
        ("High-quality growing soil", 20, SOIL_TOP, "8 in+", "20 cm+"),
        ("Additional growing soil", 15, SOIL, "6 in", "15 cm"),
        ("Twigs, clippings, compost", 10, "#7a5a3f", "4 in", "10 cm"),
        ("Large logs packed with soil", 28, SOIL_L, "11 in", "28 cm"),
    ]
    y = by
    for i, (name, cm, col, imp, met) in enumerate(bands):
        hh = cm * scale
        b += soil_band(bx, y, bw, hh, col, 70 + i, "#00000033")
        if i == 3:
            rnd = random.Random(73)
            for _ in range(45):
                x0 = bx + rnd.random() * (bw - 40)
                y0 = y + 8 + rnd.random() * (hh - 16)
                b += f'<line x1="{x0:.0f}" y1="{y0:.0f}" x2="{x0 + 36:.0f}" y2="{y0 + rnd.uniform(-6, 6):.0f}" stroke="{WOOD}" stroke-width="5" stroke-linecap="round"/>'
        if i == 4:
            b += packed_logs(bx + 2, y + 2, bw - 4, hh - 4, 74)
        if i == 0:
            rnd = random.Random(75)
            for _ in range(60):
                x0 = bx + rnd.random() * (bw - 20)
                b += f'<line x1="{x0:.0f}" y1="{y + 6 + rnd.random() * 14:.0f}" x2="{x0 + 16:.0f}" y2="{y + 6 + rnd.random() * 14:.0f}" stroke="#8c6239" stroke-width="3"/>'
        ly = y + hh / 2
        b += f'<line x1="{bx + bw + 22}" y1="{ly}" x2="{bx + bw + 48}" y2="{ly}" stroke="{INK}" stroke-width="2"/>'
        b += text(bx + bw + 58, ly - 4, name, 21, 700)
        b += text(bx + bw + 58, ly + 22, f"{imp}  ·  {met}", 19, 400, MUTED)
        y += hh
    # mesh and ground
    for k in range(0, int(bw) + 41, 14):
        b += f'<line x1="{bx - 20 + k}" y1="{y - 2}" x2="{bx - 20 + k}" y2="{y + 10}" stroke="{METAL}" stroke-width="2"/>'
    b += f'<line x1="{bx - 20}" y1="{y}" x2="{bx + bw + 20}" y2="{y}" stroke="{METAL}" stroke-width="3"/><line x1="{bx - 20}" y1="{y + 8}" x2="{bx + bw + 20}" y2="{y + 8}" stroke="{METAL}" stroke-width="3"/>'
    b += f'<line x1="{bx + bw + 22}" y1="{y + 4}" x2="{bx + bw + 48}" y2="{y + 4}" stroke="{INK}" stroke-width="2"/>'
    b += text(bx + bw + 58, y + 10, "Optional metal mesh", 21, 700)
    b += soil_band(40, y + 12, 820, 110, SUBSOIL, 79, "#00000022")
    for k in range(6):
        b += f'<path d="M{bx + 40 + k * 70} {y + 30} v40" stroke="{BLUE}" stroke-width="3" marker-end="url(#al)"/>'
    b += text(bx + bw + 58, y + 70, "Free-draining ground", 21, 700)
    b += '<defs><marker id="al" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#3f7aa6"/></marker></defs>'
    b += bed_frame(bx, by - 10, bw, y - by + 10)
    for k in range(6):
        b += plant(bx + 40 + k * 72, by + 2, 1.0)
    # height ruler
    b += f'<path d="M50 {by} V{y}" stroke="{INK}" stroke-width="2"/>'
    b += f'<path d="M42 {by} H58 M42 {y} H58" stroke="{INK}" stroke-width="2"/>'
    b += text(36, (by + y) / 2, "76 cm / 30 in", 20, 700, INK, "middle", f'transform="rotate(-90 36 {(by + y) / 2})"')
    svg("layers-76cm.svg", w, h, b, "Labelled cross-section of a 76 centimetre raised bed: mulch, two soil layers, twigs and compost, logs, optional mesh, free-draining ground")


# ---------------------------------------------------------------- 17. decomposition stages

def decomposition():
    w, h = 900, 560
    b = text(450, 56, "What happens to the wood over time", 30, 700, anchor="middle")
    b += text(450, 90, "Timescales vary widely with species, size, climate and moisture", 19, 400, MUTED, "middle")
    stages = [
        ("Early", "Fungi and microbes", "move in; nitrogen", "is borrowed", 0),
        ("Middle", "Wood softens and", "darkens; the bed", "settles", 1),
        ("Later", "Crumbly, spongy", "organic matter that", "can hold water", 2),
    ]
    for i, (name, a, bb, c, stage) in enumerate(stages):
        x = 30 + i * 290
        b += card(x, 120, 260, 400)
        cx, cy = x + 130, 250
        if stage == 0:
            b += log_end(cx, cy, 80, seed=80)
            rnd = random.Random(81)
            for _ in range(14):
                a0 = rnd.uniform(0, 6.28)
                b += f'<path d="M{cx + math.cos(a0) * 80:.0f} {cy + math.sin(a0) * 80:.0f} l {math.cos(a0) * 16:.0f} {math.sin(a0) * 16:.0f}" stroke="#d9cfb8" stroke-width="3"/>'
        elif stage == 1:
            b += log_end(cx, cy, 76, "#a67c52", "#4a3324", seed=82, rot=True)
            b += f'<path d="M{cx - 30} {cy - 90} q 10 -24 22 0 z" fill="#c9a36a"/><rect x="{cx - 21}" y="{cy - 92}" width="4" height="14" fill="#e8dcc2"/>'
        else:
            b += f'<circle cx="{cx}" cy="{cy}" r="72" fill="#5e4532"/>' + speckle(cx - 60, cy - 60, 120, 120, "#2f2218", 50, 83, (2, 5))
            b += f'<circle cx="{cx}" cy="{cy}" r="72" fill="none" stroke="#3f2d20" stroke-width="6" stroke-dasharray="14 10"/>'
        b += text(cx, 370, name, 26, 700, GREEN, "middle")
        b += lines(cx, 408, [a, bb, c], 20, anchor="middle")
        if i < 2:
            b += f'<path d="M{x + 262} 250 h24" stroke="{MUTED}" stroke-width="4" marker-end="url(#ae)"/>'
    b += '<defs><marker id="ae" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#6b685f"/></marker></defs>'
    svg("decomposition-stages.svg", w, h, b, "Three stages of buried wood decomposing: early colonisation, softening, and crumbly organic matter")


# ---------------------------------------------------------------- 18. tropical bed

def tropical():
    w, h = 900, 680
    b = text(450, 56, "Adapting the bed for Zanzibar and the tropics", 30, 700, anchor="middle")
    b += f'<ellipse cx="420" cy="120" rx="80" ry="30" fill="#9fb3c2"/><ellipse cx="465" cy="104" rx="54" ry="27" fill="#b6c6d2"/>'
    for k in range(7):
        b += f'<line x1="{372 + k * 16}" y1="156" x2="{362 + k * 16}" y2="186" stroke="{BLUE}" stroke-width="3"/>'
    b += f'<circle cx="640" cy="118" r="38" fill="#f2c14e"/>'
    b += f'<rect y="470" width="{w}" height="80" fill="#b77b52"/>' + speckle(0, 470, w, 80, "#00000022", 70, 91)
    bx, by, bw = 260, 280, 380
    b += f'<rect x="{bx - 40}" y="470" width="{bw + 80}" height="26" fill="#c9b89a"/>'
    b += soil_band(bx, by, bw, 90, SOIL_TOP, 92)
    b += soil_band(bx, by + 90, bw, 100, SOIL_L, 93)
    b += packed_logs(bx + 2, by + 92, bw - 4, 96, 94)
    b += f'<rect x="{bx}" y="{by - 14}" width="{bw}" height="18" fill="#c6a56b"/>'
    b += bed_frame(bx, by - 16, bw, 206)
    for k in range(6):
        b += plant(bx + 36 + k * 62, by - 10, 1.0)
    b += label_line(bx + 20, by - 6, 230, 250) + lines(30, 230, ["Thick mulch for", "shade and moisture"], 20, weight=600)
    b += label_line(bx + 30, by + 140, 230, 400) + lines(30, 395, ["Check for termites;", "site away from buildings"], 20, weight=600)
    b += label_line(bx + bw - 20, by + 40, 680, 250) + lines(690, 240, ["Taller beds stay", "above rainy-season", "puddles"], 20, weight=600)
    b += label_line(bx + bw + 30, 483, 690, 420) + lines(690, 410, ["Gravel or a slope", "sheds heavy rain"], 20, weight=600)
    b += pill(60, 580, 780, 70, GREEN_SOFT)
    b += text(450, 610, "Warmth and humidity speed up decay: expect faster settling", 21, 700, GREEN, "middle")
    b += text(450, 636, "and plan to top up the bed more often", 21, 700, GREEN, "middle")
    svg("tropical-bed.svg", w, h, b, "A tropical raised bed with thick mulch, packed wood and good drainage under heavy rain and strong sun")


for fn in [cover, mound_vs_bed, numbers, woods_good, woods_avoid, never_bury, sourcing, nitrogen, termites, mesh,
           packing, drainage, steps, layers, decomposition, tropical]:
    fn()
print("\n".join(sorted(os.listdir(OUT))))
