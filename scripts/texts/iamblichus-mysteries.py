"""Stage 27: Iamblichus, On the Mysteries, in Thomas Taylor's English (1821).

Writes src/lib/timeline/texts/corpus/iamblichus-mysteries-text.ts: Porphyry's
Epistle to Anebo (Taylor pp. 1-16) and the whole of the reply ascribed to
"Abammon" (pp. 17-336), in Taylor's ten Sections and 140 Chapters. Taylor
prints no Parthey pages and no Greek, so the units are keyed by Taylor's own
numbering ("epistle", then "S.C") and carry Taylor's printed page numbers.

    python3 -I scripts/texts/iamblichus-mysteries.py SRC_DIR PAGE_IMAGE_DIR \
        > src/lib/timeline/texts/corpus/iamblichus-mysteries-text.ts

SRC_DIR holds the archive.org OCR (djvu XML) of five scans, fetched with the
User-Agent "relate-archive-research (repo Oshioma/relate)":

  W  b29338888_0002              Taylor, Iamblichus on the Mysteries of the
     https://archive.org/details/b29338888_0002
                                 Egyptians, Chaldeans, and Assyrians,
                                 Chiswick: C. Whittingham, 1821. Wellcome
                                 Library; Public Domain Mark. THE COPY TEXT.
  G  iamblichusonmys00taylgoog   the 1895 reprint (London: Bertram Dobell, and
     https://archive.org/details/iamblichusonmys00taylgoog
                                 Reeves and Turner), Harvard copy scanned by
                                 Google; NOT_IN_COPYRIGHT.
  B  b24884170                   the 1895 reprint, Wellcome copy; PDM.
     https://archive.org/details/b24884170
  I  iamblichusonmyst0000iamb    the 1895 reprint (xxvi, 365 pp.), Claremont
     https://archive.org/details/iamblichusonmyst0000iamb
                                 School of Theology copy.
  T  taylor-on-the-mysteries-en-1905
     https://archive.org/details/taylor-on-the-mysteries-en-1905
                                 catalogued as 1905 but the scan is the 1895
                                 "second edition" (London: B. Dobell); PDM;
                                 tesseract OCR.

The 1895 reprint is set page for page with 1821 (pp. 1-336 the same), so the
five scans can be read side by side. LEAF_OFFSET gives printed page = leaf -
offset for each, checked on the running page numbers.

PAGE_IMAGE_DIR holds the page images of W (p001.jpg ... p336.jpg, from
https://archive.org/download/b29338888_0002/page/n{leaf}_w800.jpg), used to
find indented (paragraph) lines and for the proofreading.

METHOD
  1. Each page of each scan is cut into text lines and footnote lines (a
     footnote is found by its smaller type and the note mark that begins it;
     OVERRIDE_NOTES fixes the eight pages where that rule misjudges).
     Footnotes are not imported.
  2. The words of each page of W are aligned with the four 1895 scans and
     voted. W's reading is kept unless at least three of the four 1895 scans
     agree on another (TAKEN: 299 places); a reading of a different length is
     taken only when all four agree (LONG: 3 places); words only W has (specks
     and show-through, 23) are dropped; words W's OCR ran together or split
     are divided as the 1895 scans divide them (REDIVIDED, 73). The 1,209
     places where some 1895 scan differs but there is no majority keep W.
  3. Line-end hyphens are kept only where the word is printed with a hyphen
     inside a line somewhere in the scans and never printed whole.
  4. The whole text (pp. 1-336) was then read against the page images of W,
     two pages at a time, and every correction made by hand is in FIXES: 314
     in all (ocr 234, type 40, mark 11, spacing 12, para 9, hyphen 4, sic 3,
     line 1). The three "sic" entries keep Taylor's own misprints (essense,
     acording, fimly) where the vote had silently corrected them.
  5. typography(): Taylor's æ in dæmon (which the OCR spells many ways), the
     other æ/œ words, the capitals and small capitals that open each chapter
     (normalised to an initial capital), curly quotes.
  6. The text is split at the SECTION and CHAP. headings; check_units()
     insists on the Epistle and all 140 chapters in order, and on no stray
     mark, straight quote or double space. TAKEN_COUNT pins the vote.

WHAT IS NOT IMPORTED (listed in the corpus file, kept out of the text):
  Taylor's Introduction (1821 pp. [v]-xxiv), his footnotes on every page, his
  Additional Notes (pp. 337-365), and the list of his works at the end. The
  Greek is not imported: Taylor prints none of the text, and the critical
  editions (Parthey 1857; des Places 1966; Saffrey and Segonds 2013; Clarke,
  Dillon and Hershbell 2003, English) were not read for this stage.
"""

import difflib
import html
import json
import os
import re
import statistics
import sys
from collections import Counter


def log(*a):
    print(*a, file=sys.stderr)


FIRST_PAGE, LAST_PAGE = 1, int(os.environ.get("LAST_PAGE", "336"))
# printed page = leaf - offset (the leaf is the number in each page's djvu
# file name; checked on the page numbers at the head of the pages)
LEAF_OFFSET = {"W": 28, "G": 32, "B": 32, "I": 32, "T": 22}
SIGLA = ("W", "G", "B", "I", "T")
FILES = {
    "W": "W_djvu.xml",
    "G": "G_djvu.xml",
    "B": "B_djvu.xml",
    "I": "I_djvu.xml",
    "T": "T_djvu.xml",
}

# ---------------------------------------------------------------------------
# THE SCANS
# ---------------------------------------------------------------------------


def page_words(o):
    ws = re.findall(r'<WORD coords="(\d+),(\d+),(\d+),(\d+)"[^>]*>(.*?)</WORD>', o, re.S)
    out = []
    for a, b, c, d, t in ws:
        t = html.unescape(t).strip()
        if t:
            out.append((int(a), int(b), int(c), int(d), t))
    return out


def visual_lines(words):
    """Words grouped into printed lines by their vertical middle, each line
    {"h": median word height, "mid": middle, "w": words sorted by x}."""
    if not words:
        return []
    hs = sorted(w[1] - w[3] for w in words)
    h = hs[len(hs) // 2]

    def middle(w):
        if w[1] - w[3] > 2.2 * h:
            return w[3] + h / 2
        return (w[1] + w[3]) / 2

    lines = []
    for w in sorted(words, key=middle):
        mid = middle(w)
        if lines and abs(mid - lines[-1]["mid"]) < 0.6 * h:
            ln = lines[-1]
            ln["w"].append(w)
            ln["mid"] += (mid - ln["mid"]) / len(ln["w"])
        else:
            lines.append({"mid": mid, "w": [w]})
    for ln in lines:
        ln["w"].sort(key=lambda w: w[0])
        hh = sorted(min(w[1] - w[3], 2 * h) for w in ln["w"])
        ln["h"] = hh[len(hh) // 2]
        ln["x0"] = ln["w"][0][0]
        ln["text"] = " ".join(w[4] for w in ln["w"])
    return sorted(lines, key=lambda l: l["mid"])


def xml_pages(path, offset):
    x = open(path, encoding="utf-8").read()
    out = {}
    for o in re.findall(r"<OBJECT.*?</OBJECT>", x, re.S):
        leaf = int(re.search(r'usemap="[^"]*_(\d+)\.djvu"', o).group(1))
        ph = int(re.search(r'height="(\d+)"', o).group(1))
        out[leaf - offset] = (ph, visual_lines(page_words(o)))
    return out


# the page number at the head of the page, as the OCR reads it
HEAD = re.compile(r"^\W*[\dIiloOSsZz]{1,4}\W*$|^[\w\s.,]{0,3}$")
SIGNATURE = re.compile(r"^[A-Z]{1,2}( ?[0-9])?\.?$|^[a-z]$|^\d$|^[a-zA-Z]{1,2} ?\d$")


def text_lines(page, H, pg, siglum):
    """The lines of the text, and the lines of Taylor's footnotes below it."""
    ph, lines = page
    i = 0
    while i < len(lines) and i < 1 and HEAD.search(lines[i]["text"]) and not re.match(r"CHAP|SECT", lines[i]["text"]):
        i += 1
    body = [l for l in lines[i:] if l["h"] >= 0.45 * H]
    while body and SIGNATURE.match(body[-1]["text"].strip()):
        body = body[:-1]
    # Taylor's notes: the run of lines set smaller than the text at the foot
    # of the page (a line of Greek among them, whose accents make it look
    # taller, is counted with them)
    small = [l["h"] < 0.82 * H or density(l) > 1.15 * DENSITY[siglum] for l in body]
    gaps = [body[j]["mid"] - body[j - 1]["mid"] for j in range(1, len(body))]
    pitch = PITCH[siglum]
    end = len(body)
    for j in range(1, len(body)):
        block = small[j:]
        if gaps[j - 1] > 1.3 * pitch and small[j] and sum(block) >= 0.6 * len(block):
            end = j
            break
    else:
        # no gap: a run of small lines at the foot
        while end > 1 and small[end - 1]:
            end -= 1
    end = OVERRIDE_NOTES.get(pg, end) if not isinstance(OVERRIDE_NOTES.get(pg), str) else next(j for j, l in enumerate(body) if l["text"].startswith(OVERRIDE_NOTES[pg]))
    text, notes = body[:end], body[end:]
    if siglum == "W" and notes and not re.match(r"^\W{0,2}[*•■§¶+%|}tfJIX‘'†‡]", notes[0]["text"]):
        NOTE_NO_MARK.append((pg, notes[0]["text"][:50]))
    # a line with no Latin letter (the rule under a heading, a speck)
    junk = [l for l in text if not re.search(r"[A-Za-z]", l["text"])]
    for l in junk if siglum == "W" else []:
        DROPPED.append((pg, l["text"]))
    text = [l for l in text if re.search(r"[A-Za-z]", l["text"])]
    return text, notes


DROPPED = []
PITCH = {}
DENSITY = {}


def density(l):
    """Letters per pixel of a line: the notes are set in a smaller type, so
    more letters go into the same width."""
    width = l["w"][-1][2] - l["w"][0][0]
    return len(l["text"].replace(" ", "")) / max(width, 1) if width > 400 else 0
NOTE_NO_MARK = []
# Pages where the rule for the notes is overridden, read on the page images:
# page -> the number of text lines, or the words that begin the first line
# of the notes.
OVERRIDE_NOTES = {
    17: "* The following",
    # pages with no notes whose short last line (the end of a chapter,
    # after a gap) the rule above would take for a note
    190: 99,
    244: 99,
    274: 99,
    283: 99,
    # the first line of the note (Greek and transliterated names) is
    # set like the text and the rule would take it for one
    290: 16,
    313: 99,
    335: 99,
}


def scan_pages(path, siglum):
    """{page: text lines}, {page: the lines of the notes below the text}."""
    ps = xml_pages(path, LEAF_OFFSET[siglum])
    pages = [ps[pg] for pg in range(FIRST_PAGE, LAST_PAGE + 1) if pg in ps]
    H = statistics.median(l["h"] for p in pages[20:] for l in p[1][2:6])
    DENSITY[siglum] = statistics.median(density(l) for p in pages[20:] for l in p[1][2:6])
    PITCH[siglum] = statistics.median(p[1][k]["mid"] - p[1][k - 1]["mid"] for p in pages[20:] for k in range(3, min(8, len(p[1]))))
    split = {pg: text_lines(ps.get(pg, (0, [])), H, pg, siglum) for pg in range(FIRST_PAGE, LAST_PAGE + 1)}
    return {pg: s[0] for pg, s in split.items()}, {pg: s[1] for pg, s in split.items()}


def note_starts(notes, text):
    """How many of Taylor's notes begin among these note lines: a note begins
    on a line set in from the left margin, which the notes share with the
    text, with a mark."""
    if not notes or not text:
        return 0
    margin = statistics.median(l["x0"] for l in text)
    starts = 0
    for l in notes:
        first = l["w"][0][4]
        if l["x0"] > margin + 35 and re.match(r"^(['‘’*•■§¶+%|}tfJIX]{1,2}$|[*•■§¶+%|}tfJX][A-Z“\"])", first):
            starts += 1
    return starts


def indented_lines(image_path, lines):
    """The text lines of a page image that begin a paragraph: those whose ink
    begins well to the right of the page's left margin."""
    import numpy as np
    from PIL import Image

    im = np.array(Image.open(image_path).convert("L")) < 140
    starts = []
    for ln in lines:
        y0 = int(ln["mid"] - 0.45 * ln["h"])
        y1 = int(ln["mid"] + 0.35 * ln["h"])
        band = im[max(0, y0) : y1, 60 : im.shape[1] // 2].sum(axis=0)
        cols = np.where(band > 2)[0]
        starts.append(60 + int(cols[0]) if len(cols) else None)
    xs = [x for x in starts if x is not None]
    if not xs:
        return set()
    margin = sorted(xs)[len(xs) // 3]
    return {i for i, x in enumerate(starts) if x is not None and x > margin + 45}


# ---------------------------------------------------------------------------
# TOKENS
# ---------------------------------------------------------------------------

LETTER = re.compile(r"[A-Za-zÀ-ÿĀ-ž]")


def key(word):
    """Lower-case letters (and, for a bare number, its digits) for the alignment."""
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    for a, b in (("àáâäãā", "a"), ("èéêëē", "e"), ("ìíîïī", "i"), ("òóôöõō", "o"), ("ùúûüū", "u")):
        w = re.sub(f"[{a}]", b, w)
    letters = re.sub(r"[^a-z]", "", w)
    if letters:
        return letters
    return re.sub(r"[^0-9]", "", w)


def raw_tokens(lines):
    """[text, line, hyphenated form] tokens; a word broken over two lines is joined."""
    toks = []
    for li, ln in enumerate(lines):
        for w in ln["w"]:
            for part in w[4].replace("—", " — ").replace("­", "").split():
                toks.append([part, li, None])
    out = []
    for t in toks:
        if out and out[-1][1] != t[1] and re.search(r"[A-Za-z][-¬]$", out[-1][0]) and re.match(r"[_.·‘']?[a-z]", t[0]):
            t[0] = re.sub(r"^[_.·‘']", "", t[0])
            out[-1][2] = out[-1][0][:-1] + "-" + t[0]
            out[-1][0] = out[-1][0][:-1] + t[0]
            out[-1][1] = t[1]
            continue
        out.append(t)
    return out


def is_word(t):
    return bool(LETTER.search(t))


def attach(tokens):
    """Attach tokens without letters to a neighbour; a dash stands alone."""
    out = []
    for t, li, hy in tokens:
        if re.fullmatch(r"[.,;:!?]*[tfJX}][.,;:!?]*", t) and out:
            out[-1][0] += "†" + t if not re.match(r"[.,;:!?]", t) else t
            continue
        if is_word(t) or t in ("—", "-") or re.fullmatch(r"\d+[.,;:]?", t):
            out.append([t, li, hy])
            continue
        if out:
            out[-1][0] += t
        else:
            out.append([t, li, hy])
    return out


# ---------------------------------------------------------------------------
# THE VOTE
# ---------------------------------------------------------------------------


def anchors(bk, xk):
    sm = difflib.SequenceMatcher(None, bk, xk, autojunk=False)
    at = [None] * (len(bk) + 1)
    for op, i1, i2, j1, _j2 in sm.get_opcodes():
        if op == "equal":
            for d in range(i2 - i1 + 1):
                at[i1 + d] = j1 + d
    at[0] = 0
    at[len(bk)] = len(xk)
    return at


TAKEN = []
HEADINGS = []
DIFFERED = []
W_ONLY = []
REDIVIDED = []
LONG = []
STRAY_QUOTE = []
MIXED_CAPS = []
OTHERS = ("G", "B", "I", "T")


def vote_page(pg, toks):
    """A list of {"forms": (W, G, B, I, T), "hy": hyphenated form or None} per
    word. W is the base; where at least three of the four 1895 scans agree
    with each other against W, their reading is taken."""
    base = toks["W"]
    bk = [key(t[0]) for t in base]
    ks = {n: [key(t[0]) for t in toks[n]] for n in OTHERS}
    ats = {n: anchors(bk, ks[n]) for n in OTHERS}
    # a witness whose page is missing or does not align is left out of the page
    present = [n for n in OTHERS if toks[n]]
    bounds = [b for b in range(len(base) + 1) if all(ats[n][b] is not None for n in present)]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = base[b1:b2]
        rd = {n: toks[n][ats[n][b1] : ats[n][b2]] for n in present}
        segk = "".join(bk[b1:b2])
        rk = {n: "".join(ks[n][ats[n][b1] : ats[n][b2]]) for n in present}
        ctx = " ".join(t[0] for t in base[max(0, b1 - 5) : b1])
        counts = Counter(v for v in rk.values() if v != segk)
        best = counts.most_common(1)[0] if counts else None
        if best and best[1] >= 3 and best[0]:
            src = next(n for n in present if rk[n] == best[0])
            # a reading much longer or shorter than W's is taken only when all
            # four 1895 scans agree on it: a line W's OCR lost (p.49), or a
            # word broken over a line with specks between the halves
            long = abs(len(rd[src]) - len(seg)) > 2
            if long:
                LONG.append((pg, ctx, " ".join(t[0] for t in seg), " ".join(t[0] for t in rd[src])))
            if not long or best[1] == len(present) == 4:
                TAKEN.append((pg, ctx, " ".join(t[0] for t in seg), " ".join(t[0] for t in rd[src])))
                log(f"  TAKEN p.{pg} ({best[1]} of 4): ...{ctx} [{' '.join(t[0] for t in seg)}] -> [{' '.join(t[0] for t in rd[src])}]")
                n = len(rd[src])
                for i in range(n):
                    forms = [None] + [rd[m][i][0] if rk[m] == best[0] and len(rd[m]) == n else None for m in OTHERS if m in present]
                    out.append({"forms": tuple(f for f in forms), "hy": rd[src][i][2], "line": seg[min(i, len(seg) - 1)][1] if seg else None, "doubt": False})
                continue
        # words only in W, where every 1895 scan has nothing: show-through
        # from the facing page or a speck that W's OCR read as letters
        if len(present) >= 3 and segk and all(rk[n] == "" for n in present):
            W_ONLY.append((pg, ctx, " ".join(t[0] for t in seg)))
            continue
        # the same letters, divided differently: a word broken over a line
        # that W's OCR did not join (a speck after the hyphen), or two words
        # it ran together; the division of at least three 1895 scans is taken
        # (a join only where W shows a hyphen: the 1895 scans' OCR sometimes
        # runs two words together, and Taylor prints "every where" as two)
        agree = [n for n in present if rk[n] == segk]
        if len(agree) >= 3:
            lens = Counter(len(rd[n]) for n in agree)
            n_best, c = lens.most_common(1)[0]
            joined_at_hyphen = n_best < len(seg) and any(re.search(r"[-¬~_|]", t[0]) for t in seg)
            if segk and c >= 3 and (n_best > len(seg) or joined_at_hyphen):
                src = next(n for n in agree if len(rd[n]) == n_best)
                REDIVIDED.append((pg, " ".join(t[0] for t in seg), " ".join(t[0] for t in rd[src])))
                for i in range(n_best):
                    forms = [rd[m][i][0] for m in agree if len(rd[m]) == n_best]
                    out.append({"forms": tuple(forms), "hy": rd[src][i][2], "line": seg[min(i, len(seg) - 1)][1], "doubt": False})
                continue
        doubt = any(rk[n] != segk for n in present)
        if doubt:
            DIFFERED.append((pg, ctx))
        cols = {n: [t[0] for t in rd[n]] if len(rd[n]) == len(seg) else [None] * len(seg) for n in present}
        for i, t in enumerate(seg):
            out.append({"forms": (t[0], *[cols[n][i] for n in present]), "hy": t[2], "line": t[1], "doubt": doubt})
    return out


# ---------------------------------------------------------------------------
# TAYLOR'S NOTE MARKS
# ---------------------------------------------------------------------------

PUNCT = ".,;:!?"


def majority(xs):
    c = Counter(xs).most_common()
    return c[0][0] if c and (c[0][1] * 2 > len(xs) or len(xs) == 1) else None


def clean_word(forms):
    """The word with any note mark after it dropped, and the punctuation the
    scans agree on kept: (word, marks dropped)."""
    parsed = []
    for f in forms:
        m = re.match(r"^([(\[‘“\"']*)(.*?[A-Za-zÀ-ÿĀ-ž0-9])([^A-Za-zÀ-ÿĀ-ž0-9]*)$", f)
        if not m:
            parsed.append(None)
            continue
        lead, core, tail = m.groups()
        if re.match(r"^[^A-Za-z0-9(\[‘“\"']+", core):
            core = re.sub(r"^[^A-Za-z0-9(\[‘“\"']+", "", core)
        mm = re.match(r"^(.*?[A-Za-z])([.,;:!?)\]]*)†([.,;:!?]*[tfJX}][.,;:!?]*)$", core) or re.match(r"^(.*?[A-Za-z])([.,;:!?)\]]+)([tfJIX}]{1,2})$", core)
        mark = bool(mm)
        if mm:
            core, tail = mm.group(1), mm.group(2) + re.sub(r"[^.,;:!?]", "", mm.group(3)) + tail
        kept = "".join(ch for ch in tail if ch in PUNCT + ")]’”'\"—-")
        mark = mark or any(ch not in PUNCT + ")]’”'\"—- " for ch in tail)
        parsed.append((lead, core, kept, mark))
    good = [p for p in parsed if p]
    if not good:
        return forms[0], 0
    lead, core = good[0][0], good[0][1]
    tail = majority([p[2] for p in good])
    if tail is None:
        tail = good[0][2]
    marks = 1 if majority([p[3] for p in good]) else 0
    return lead + core + tail, marks


def resolve_page(entries):
    """The words of a page, with the note marks dropped: (words, marks)."""
    words, marks = [], 0
    for e in entries:
        forms = [f for f in e["forms"] if f is not None]
        main = forms[0]
        if (not is_word(main) and main not in ("—", "-") and not re.fullmatch(r"\d+[.,;:]?", main)) or re.fullmatch(r"[tfJXl}][.,;:]?", main):
            marks += 1
            continue
        w, n = clean_word(forms)
        marks += n
        alts = sorted({f for f in forms[1:] if key(f) != key(forms[0])})
        words.append({"w": w, "hy": e["hy"], "line": e["line"], "doubt": e["doubt"], "alts": alts})
    return words, marks


# ---------------------------------------------------------------------------
# HYPHENS
# ---------------------------------------------------------------------------


def midline_forms(scans):
    """Every word printed with a hyphen inside a line, and every word printed
    whole, in any of the scans: the evidence for a hyphen at a line end."""
    hyph, whole = set(), set()
    for n in SIGLA:
        for pg, lines in scans[n].items():
            for ln in lines:
                ws = ln["w"]
                for i, w in enumerate(ws):
                    t = w[4].lower().strip(".,;:!?()[]‘’“”'\"*")
                    if i == len(ws) - 1 and t.endswith("-"):
                        continue
                    if re.fullmatch(r"[a-z]+-[a-z]+", t):
                        hyph.add(t)
                    elif re.fullmatch(r"[a-z]+", t):
                        whole.add(t)
    return hyph, whole


# ---------------------------------------------------------------------------
# THE HAND FIXES
# ---------------------------------------------------------------------------

# FIXES: (page, the words before, what the vote gave, what the page image of
# the 1821 copy shows, kind). The kinds: "ocr" (a misread word or stop),
# "mark" (a note mark the rules left, or a word the rules took for one),
# "hyphen" (a hyphen kept or dropped where a word is broken over a line),
# "spacing", "line" (words the page split misplaced), "type" (capitals and
# small capitals written as ordinary words: the first word of each chapter),
# "ligature" (Taylor's æ, which the OCR spells e or ae), "sic" (Taylor's own
# misprint kept where the vote corrected it), "para" (a paragraph
# break added or removed). The words before are as the vote gave them, so
# that each fix is found exactly once in its page.
FIXES = [
# FIXES-BEGIN
    (3, 'conformably to what Homer says,', '¶ And', '¶ “And', 'ocr'),
    (3, 'are e’en the Gods themselves.”', 'But', '¶ But', 'para'),
    (3, 'But the things which are', 'Offered', 'offered', 'ocr'),
    (4, 'the truth respecting these', 'particulars”.', 'particulars.]', 'ocr'),
    (4, '¶', '(And,', '[And,', 'ocr'),
    (9, 'and the souls of the deceased;', '-', '', 'ocr'),
    (9, 'striving to be virtuous.', '‘They', 'They', 'ocr'),
    (14, 'as the only dissolvers of fate.', '—', '', 'ocr'),
    (15, 'whether this demon', 'ts', 'is', 'ocr'),
    (20, 'conceptions of mankind.', '‘These', 'These', 'ocr'),
    (23, 'In the first place, therefore, you', 'say 2é', 'say, “it', 'ocr'),
    (23, 'granted that there are Gods.”', '‘Thus', 'Thus', 'ocr'),
    (26, '', 'Wiru', 'With', 'type'),
    (26, 'respect to your inquiry,', 'what the peculiarties', '“what the peculiarities', 'ocr'),
    (27, 'something is added concerning', 'efficacious', '“efficacious', 'ocr'),
    (28, 'That also which is added by you,', 'or of', '“or of', 'ocr'),
    (28, 'afterwards acceding to essences.', 'for', 'For', 'ocr'),
    (28, 'all things must be conceived in', '6.', 'τῳ ειναι, i. e.', 'ocr'),
    (29, 'For your question asks,', 'How', '“How', 'ocr'),
    (30, 'according to essence; I mean the', 'essence', 'essense', 'sic'),
    (34, '', 'Wauart,', 'What,', 'type'),
    (35, 'because what remains,', '7. e.', 'i. e.', 'ocr'),
    (36, '', 'Or', 'Of', 'type'),
    (38, '', 'Bur', 'But', 'type'),
    (38, 'that cause of the', '¶ distinction', 'distinction', 'para'),
    (38, 'genera which you', '¶ subjoin, viz. that wz ts', 'subjoin, viz. “that it is', 'ocr'),
    (38, 'an arrangement with', '¶ reference', 'reference', 'para'),
    (40, 'the nature of their receptacles.', 'It', '¶ It', 'para'),
    (41, 'and the souls of the', 'worlds[2. e. of', 'worlds [i. e. of', 'ocr'),
    (41, 'must not be admitted,', 'vez.', 'viz.', 'ocr'),
    (44, 'for it is your inquiry,', 'Why,', '“Why,', 'ocr'),
    (45, 'You also inquire,', 'How', '“How', 'ocr'),
    (48, 'another division for yourself,', '“i', '“in', 'ocr'),
    (51, '', 'How therefore,” you ask, are', '“How therefore,” you ask, “are', 'ocr'),
    (55, 'You also say,', 'that', '“that', 'ocr'),
    (55, 'likewise the Gods.”', '‘This,', 'This,', 'ocr'),
    (57, 'Moreover,', 'the pacifications', '“the pacifications', 'ocr'),
    (58, '¶ But', 'the oblation', '“the oblation', 'ocr'),
    (58, 'which may accede from the calamities.', '‘Those', 'Those', 'ocr'),
    (59, '', 'Farruer', 'Farther', 'type'),
    (60, 'For you say,', 'that the Gods are pure intellects;?', '“that the Gods are pure intellects;”', 'ocr'),
    (60, 'adopted by certain persons.', 'And — you infer, that', 'And you infer, “that', 'ocr'),
    (61, 'with sensibles,” you doubt,', 'whether wt', '“whether it', 'ocr'),
    (62, '¶', 'Supplications, however,” you say, are', '“Supplications, however,” you say, “are', 'ocr'),
    (63, 'certain respect, they possess the same', 'power, — how', 'power,—how', 'spacing'),
    (63, 'You say, however,', 'that the things', '“that the things', 'ocr'),
    (63, 'For there', '1s', 'is', 'ocr'),
    (63, 'in the smallest degree', '1s adapted tothe', 'is adapted to the', 'ocr'),
    (64, 'Gods themselves [as Gods,', '2. e. as Superessential', 'i. e. as superessential', 'ocr'),
    (64, '', 'Tue', 'The', 'type'),
    (64, 'difference which separates', 'Gods from', '“Gods from', 'ocr'),
    (64, 'For', 'ifin', 'if in', 'spacing'),
    (65, 'against the present opinion.', 'For,”', '“For,”', 'ocr'),
    (65, 'alone incorporeal?”', '‘T\'o', 'To', 'ocr'),
    (68, 'next inquiry doubts,', 'how some', '“how some', 'ocr'),
    (68, 'but others malefic.”', '"This', 'This', 'ocr'),
    (69, 'and, in short, participates of them', 'according', 'acording', 'sic'),
    (69, '[or has a subsistence in becoming', 'to be,', 'to be,]', 'ocr'),
    (69, 'participate of the immaterial', 'aud', 'and', 'ocr'),
    (71, 'shall answer your question,', 'What', '“What', 'ocr'),
    (71, 'heavens with the incorporeal', 'G\'ods.”', 'Gods.”', 'ocr'),
    (74, 'and also every thing which is in them is', 'one, — hence', 'one,—hence', 'spacing'),
    (74, 'whatever it may be, is this', 'onet', 'one', 'mark'),
    (76, 'For you doubt', 'what at is', '“what it is', 'ocr'),
    (81, 'for they are human and', 'corporeal-formed', 'corporeal-formed;', 'ocr'),
    (84, 'and is elevated to a greater,', 'to the angelic', 'i. e. to the angelic', 'ocr'),
    (84, 'heroes, and', '¶ souls', 'souls', 'para'),
    (84, 'no longer proper to', '¶ doubt,', 'doubt,', 'para'),
    (85, 'For you inquire,', 'by what', '“by what', 'ocr'),
    (85, 'or a certain archon [i. e.', 'ruler,', 'ruler],', 'ocr'),
    (86, 'who govern the sublunary', 'element,', 'elements,', 'ocr'),
    (87, 'presenting themselves to the view,', 'firmly', 'fimly', 'sic'),
    (87, 'but those of souls resemble, indeed,', '¶ Morphe pertains to the colour, figure, and magnitude of superficies.', '', 'line'),
    (88, 'the latter exhibits fortitude.', '‘The', 'The', 'ocr'),
    (93, 'Angels alone dissolve the', 'bond', 'bonds', 'ocr'),
    (96, '', 'xhibits', 'exhibits', 'ocr'),
    (99, 'in each of these three genera.', '—', '', 'ocr'),
    (100, 'who survey divine fire are not', '‘able', 'able', 'ocr'),
    (102, 'imparts truth and', 'power, —', 'power,', 'ocr'),
    (104, 'mentioned by you', 'of speakingly', '“of speakingly', 'ocr'),
    (104, 'a certain error happens in', '‘the theurgic art, and not such autopiie,', 'the theurgic art, and not such autoptic,', 'ocr'),
    (107, 'But that which you now say,', 'that wt 1s', '“that it is', 'ocr'),
    (107, 'fictitious images, and to speak', 'boastengly', 'boastingly', 'ocr'),
    (109, 'ignorance which is hurried along to', '‘nonbeing,', 'nonbeing,', 'ocr'),
    (111, 'in which you say,', 'that the science', '“that the science', 'ocr'),
    (112, 'to explain to you distinctly,', 'what that 1s', '“what that is', 'ocr'),
    (115, 'you say as follows:', 'We Frequently', '“We frequently', 'ocr'),
    (115, 'future events, not being', 'an an', 'in an', 'ocr'),
    (115, 'dreams which are denominated', 'theopemptoz,', 'theopemptoi,', 'ocr'),
    (117, 'also divination is contained,', 'the being', '“the being', 'ocr'),
    (117, 'and also the assertion,', 'that we', '“that we', 'ocr'),
    (121, 'also, you say,', 'that many,', '“that many,', 'ocr'),
    (123, 'For either divinity possesses us,', 'Or', 'or', 'ocr'),
    (124, 'contraries of these.', 'Hither', 'Either', 'ocr'),
    (124, '', 'Tuat,', 'That,', 'type'),
    (125, 'Let such, therefore, be the divine', 'in- —', 'indications', 'ocr'),
    (126, '', 'dications', '', 'hyphen'),
    (126, '', 'Ir', 'It', 'type'),
    (127, '', 'Ir,', 'If,', 'type'),
    (129, 'but exterminates entirely our', 'Own', 'own', 'ocr'),
    (129, '', 'Wuar', 'What', 'type'),
    (129, 'afterwards say is as follows:', 'That', '“That', 'ocr'),
    (132, 'such as are the melodies of', 'Olympus,”', 'Olympus,', 'mark'),
    (134, '', 'Ler', 'Let', 'type'),
    (140, 'about which you say as follows:', 'There', '“There', 'ocr'),
    (143, 'brazen tripod, or on a stool with four', 'feet.', 'feet,', 'ocr'),
    (144, 'rejoicing for a considerable', 'time — all', 'time—all', 'spacing'),
    (145, '', 'Ir', 'It', 'type'),
    (147, 'which you say,', 'that some', '“that some', 'ocr'),
    (147, 'as those that are filled', 'Srom', 'from', 'ocr'),
    (149, 'For when you say,', 'some standing', '“some standing', 'ocr'),
    (149, 'and the inspector', '(erorrys),', '(εποπτης),', 'ocr'),
    (150, 'you say as follows:', 'Others', '“Others', 'ocr'),
    (150, 'certain potions, but others', 'in cantations', 'incantations', 'hyphen'),
    (151, 'The whole, however, of this', 'Kind', 'kind', 'ocr'),
    (151, 'the etherial and luciform', 'vehiclet', 'vehicle', 'mark'),
    (154, 'or from some other celestial', 'sphere, — this', 'sphere,—this', 'spacing'),
    (154, 'this you say as', 'follows:(6: Some', 'follows: “Some', 'ocr'),
    (154, 'And there are, indeed,', '¶ many', 'many', 'para'),
    (154, 'to the signs which', '¶ are', 'are', 'para'),
    (155, 'Heraclitus says,', 'neither', '“neither', 'ocr'),
    (155, 'the Gods generate all things through', 'formst,', 'forms,', 'mark'),
    (155, 'impressed as it were by a', 'seal).', 'seal (δια συνθηματων).', 'ocr'),
    (157, 'is adapted to be', 'enkindled. e. is', 'enkindled [i. e. is', 'ocr'),
    (158, 'In the next place you inquire', 'concerning the', '“concerning the', 'ocr'),
    (158, 'represent diviners as asserting,', 'that all', '“that all', 'ocr'),
    (158, 'foreknowledge of future events', 'thr ough', 'through', 'spacing'),
    (159, 'Afterwards you doubt,', 'whether', '“whether', 'ocr'),
    (161, '¶', 'if,', 'If,', 'ocr'),
    (163, 'concerning the causes of divination,', 'whether', '“whether', 'ocr'),
    (165, '', 'that they affect', '“that they affect', 'ocr'),
    (166, '', 'Bur', 'But', 'type'),
    (169, 'particulars:', 'viz. that the soul', 'viz. “that the soul', 'ocr'),
    (169, 'they are the passions of', 'tt,', 'it,', 'ocr'),
    (172, 'what you add in the third place more true; viz.', 'that there', '“that there', 'ocr'),
    (176, 'You say, therefore,', 'that the soul', '“that the soul', 'ocr'),
    (177, 'liberating them from a corporeal', '- condition', 'condition', 'ocr'),
    (178, 'Whence, also, does the imagination,', 'receiv ing', 'receiving', 'spacing'),
    (179, 'the former of these doubts.', 'For in sleep,', '“For in sleep,', 'ocr'),
    (179, 'Not that the cause', '- of', 'of', 'ocr'),
    (181, 'in support of this opinion.', '‘That the senses', 'That “the senses', 'ocr'),
    (181, 'human phantasm is then excited.', 'But the', 'But “the', 'ocr'),
    (181, 'but not to the soul of the spectator.', 'And the', 'And “the', 'ocr'),
    (181, 'alone known to the God whom they invoke.', 'But that not', 'But that “not', 'ocr'),
    (182, '', 'sumple', 'simple', 'ocr'),
    (182, 'young are more adapted to', 'divination,’', 'divination,”', 'ocr'),
    (182, 'that the influx of it, in the', 'Same', 'same', 'ocr'),
    (182, 'to a worse condition, and absurdly says,', 'that', '“that', 'ocr'),
    (184, 'differ [in a transcendent', 'degree', 'degree]', 'ocr'),
    (184, 'And if you ascribe a sacred', 'sobriety', '“sobriety', 'ocr'),
    (184, 'Nor again, must you compare an ambiguous', 'state,’', 'state,”', 'ocr'),
    (184, 'Nor again, must you compare', 'an', '“an', 'ocr'),
    (184, 'things that are seen, but extend', '-', '', 'ocr'),
    (185, 'we do not think it requisite to discuss them any', 'further,', 'farther,', 'ocr'),
    (187, 'neither is it sufficient to assert,', 'that nature,', '“that nature,', 'ocr'),
    (188, 'is a thing of this kind,', '2. 6.', 'i. e.', 'ocr'),
    (189, 'no human work is proposed [to be', 'effected,', 'effected],', 'ocr'),
    (189, 'there will not be a preparative from nature.', '‘There', 'There', 'ocr'),
    (190, 'For you say,', 'that those', '“that those', 'ocr'),
    (191, 'to be despised,', 'the artificers', '“the artificers', 'ocr'),
    (194, '', 'Way,', 'Why,', 'type'),
    (196, 'pay attention to these useless', 'delusions?,', 'delusions? I,', 'ocr'),
    (197, 'You say, however,', 'that the makers', '“that the makers', 'ocr'),
    (198, 'For you say,', 'that no God', '“that no God', 'ocr'),
    (198, 'and', 'a-demon?', 'a dæmon?', 'ocr'),
    (199, 'as the cause of divination,', 'a certain', '“a certain', 'ocr'),
    (199, 'a certain genus of demons, which', '1s', 'is', 'ocr'),
    (200, 'like a', '- circle', 'circle', 'ocr'),
    (200, 'and at one time, as it seems,', 'Cause One', 'cause one', 'ocr'),
    (200, 'whom they call equal to the Gods', '(avzove) — such', '(αντιθεους)—such', 'ocr'),
    (203, 'and I will answer you. Say then,', '2', '“it', 'ocr'),
    (204, 'through the wish of what is', 'béautiful,', 'beautiful,', 'ocr'),
    (206, '', 'CHAP. IT.', 'CHAP. II.', 'ocr'),
    (209, 'that which is more and that which', '“is', 'is', 'ocr'),
    (209, 'them will be left.', 'CHAP. TV.', 'CHAP. IV.', 'ocr'),
    (209, '', 'Wuar', 'What', 'type'),
    (209, '“why the powers who are', 'envoked', 'invoked', 'ocr'),
    (211, '', 'Scope', 'scope', 'ocr'),
    (211, 'proposed to them as to men.', 'for', 'For', 'ocr'),
    (48, 'into the world.', 'CHAP..', 'CHAP. X.', 'ocr'),
    (103, 'for these questions.', 'CHAP..', 'CHAP. X.', 'ocr'),
    (134, 'be assigned in common.', 'CHAP..', 'CHAP. X.', 'ocr'),
    (216, '', 'CHAP.. the', 'CHAP. IX. After the', 'ocr'),
    (215, 'present with them greater.', 'ach,', 'Each,', 'ocr'),
    (215, 'nor destitute of', '—', '', 'ocr'),
    (217, 'molestation of this kind.', '‘CHAP..', 'CHAP. X.', 'ocr'),
    (218, 'not the cause of evils and unjust deeds.', 'CHAP.', 'CHAP. XI.', 'ocr'),
    (218, 'and at the same time doubt,', 'how tt', '“how it', 'ocr'),
    (218, 'to lead any one to illegal', 'venery.’', 'venery.”', 'ocr'),
    (219, 'is perverted by', '- those', 'those', 'ocr'),
    (219, 'to the contrary.', 'CHAP. XII. Ir', 'CHAP. XII. It', 'type'),
    (220, 'their mutual', 'connection', 'connexion', 'ocr'),
    (220, 'in most of them,', 'desiré', 'desire', 'ocr'),
    (223, 'unadapted to the whole generation of what is', 'beautful,', 'beautiful,', 'ocr'),
    (223, 'energies of nature to more excellent', 'beings[7. e. to', 'beings [i. e. to', 'ocr'),
    (225, 'I mean concerning sacrifices,', 'what utility', '“what utility', 'ocr'),
    (225, 'another objection occurs, viz.', 'that the', '“that the', 'ocr'),
    (230, 'it is not fit to suspect of the Gods', '[vez.', '[viz.', 'ocr'),
    (233, '', 'Bur', 'But', 'type'),
    (233, '', 'Tue', 'The', 'type'),
    (234, '', 'Tue', 'The', 'type'),
    (235, 'for instance, of the', 'dogt,', 'dog,', 'mark'),
    (236, 'and the', 'weaselt,', 'weasel,', 'mark'),
    (240, '', 'Ir', 'It', 'type'),
    (242, '', 'CHAP..', 'CHAP. X.', 'ocr'),
    (243, 'than what you suspect to be the case, viz.', 'that the Gods', '“that the Gods', 'ocr'),
    (245, 'question errs in another respect. For it is', 'ignornant', 'ignorant', 'ocr'),
    (245, 'to what you assert. For superior', 'beings[2.. e.', 'beings [i. e.', 'ocr'),
    (246, 'And they elevate us through sacrifices and the', 'sacrifice fire', 'sacrific fire', 'ocr'),
    (248, '', 'SuBVERTING,', 'Subverting,', 'type'),
    (252, '', '¶ proper,', 'proper,', 'para'),
    (252, 'should be chosen adapted to itself;', 'ez.', 'viz.', 'ocr'),
    (252, '', 'FarTHER', 'Farther', 'type'),
    (253, 'immoderately disturbed. We also', 'ferquently', 'frequently', 'ocr'),
    (253, '', 'Wuat,', 'What,', 'type'),
    (253, 'with respect to sterility, or', 'abundance or', 'abundance, or', 'ocr'),
    (255, '', 'AccorpDING', 'According', 'type'),
    (256, 'the universe, who', 'lived', 'live', 'ocr'),
    (256, 'manner, labour in the paths of', 'sancity.', 'sanctity.', 'ocr'),
    (257, 'And others are the', 'mediat', 'media', 'mark'),
    (260, '', 'THINK,', 'think,', 'type'),
    (263, '', 'Wuar', 'What', 'type'),
    (263, 'principles that are [rooted and concentred]', 'init?', 'in it?', 'spacing'),
    (265, '', 'THe', 'The', 'type'),
    (269, '', 'ir,', 'If,', 'type'),
    (271, 'the first species of prayer is', 'collectwe;', 'collective;', 'ocr'),
    (272, 'pertains to', 'ilumination;', 'illumination;', 'ocr'),
    (272, 'But some times it', 'wntercedes', 'intercedes', 'ocr'),
    (275, 'next doubt which you propose, viz.', 'Why at ts', '“Why it is', 'ocr'),
    (275, 'requisite that the inspector', 'who presides', '[who presides', 'ocr'),
    (275, 'this is not attended with any contrariety.', '-', '', 'ocr'),
    (277, 'of the doubt. CHAP. III.', 'a', '', 'ocr'),
    (278, '', 'iv', 'It', 'type'),
    (279, 'which, as you say, is accompanied with', 'violent threats.”', '“violent threats.”', 'ocr'),
    (279, 'about the multitude of threats.', 'For it threatens', '“For it threatens', 'ocr'),
    (281, '', 'THeEsE', 'These', 'type'),
    (282, 'do not descend into body which is', 'born', 'borne', 'ocr'),
    (285, 'but elevating yourself to intellectual truth.', 'By mire,”', 'By “mire,”', 'ocr'),
    (285, 'wholly derived from himself, and concealed in', 'himself, — this', 'himself,—this', 'spacing'),
    (286, 'When the God, also, is represented as', 'sailing', '“sailing', 'ocr'),
    (288, 'the symbolical mode of signification represents these also, indicating', 'that the sun is diverstfied', '“that the sun is diversified', 'ocr'),
    (289, 'concerning them with brevity. For you inquire', 'what efficacy', '“what efficacy', 'ocr'),
    (293, 'and when elevated conjoin it as much as possible with them. But you ask,', 'Why,', '“Why,', 'ocr'),
    (294, 'You object, however,', 'that he who', '“that he who', 'ocr'),
    (295, 'which fall off from the truth, viz.', 'if', '“if', 'ocr'),
    (295, 'he who is invoked is', 'ecther', 'either', 'ocr'),
    (296, 'sacred operation can be effected? But neither', 'do these', '“do these', 'ocr'),
    (296, 'veils [by which arcana are', 'concealed', 'concealed]', 'ocr'),
    (297, '', 'toa', 'to a', 'spacing'),
    (297, 'we make use of words adapted to them.', 'Nor do', '“Nor do', 'ocr'),
    (297, 'persevere in our conceptions of divinity. For', 'af', 'if', 'ocr'),
    (297, 'like sacred asyla, should be preserved', 'envariably', 'invariably', 'ocr'),
    (297, 'neither taking any thing', 'Srom', 'from', 'ocr'),
    (297, 'nor adding any thing to them which', 'as elsewhere', 'is elsewhere', 'ocr'),
    (299, 'and whether it', '1s', 'is', 'ocr'),
    (300, 'which have different orders, were delivered by different ancient', 'priests,', 'priests.', 'ocr'),
    (300, 'the principles that rank as wholes in two', 'myriadst', 'myriads', 'mark'),
    (300, 'or, as we are informed by', 'Manethof,', 'Manetho,', 'mark'),
    (301, 'believed to be] the first God and king,', '1mmoveable,', 'immoveable,', 'ocr'),
    (302, '', 'AccorpInG', 'According', 'type'),
    (302, 'he arranges the God', 'Hmeph', 'Emeph', 'ocr'),
    (302, 'and which he denominates', 'Acton.', 'Eicton.', 'ocr'),
    (303, 'into two, or four, or twelve, or', 'six-andthirty', 'six-and-thirty', 'hyphen'),
    (304, '', 'TuEse', 'These', 'type'),
    (306, '', 'Tats', 'This', 'type'),
    (306, 'but Bitys, the prophet of King', 'Ammon,”', 'Ammon,', 'mark'),
    (306, 'having found it in the adyta of', 'Saist', 'Saïs', 'mark'),
    (308, 'You say, therefore,', 'that according', '“that according', 'ocr'),
    (309, 'Hence that of which you are dubious is not true,', 'that all', '“that all', 'ocr'),
    (309, 'contact with real being, and that which is divine.', 'Nor must', '“Nor must', 'ocr'),
    (310, '', 'Wuart', 'What', 'type'),
    (314, 'from the greater and lesser bear, from the whole', 'ele. ments,', 'elements,', 'hyphen'),
    (314, 'one of the things proposed to be considered, you inquire', 'how the', '“how the', 'ocr'),
    (314, 'calculation of nativities, and ask', 'whether', '“whether', 'ocr'),
    (314, 'concerning the invention of the lord of the geniture,', 'whether', '“whether', 'ocr'),
    (315, 'You say, then,', 'that he', '“that he', 'ocr'),
    (315, 'a knowledge of the demon imparted to us by', '—', '', 'ocr'),
    (316, 'adduced by you in the next place, concerning', 'the enumeration', '“the enumeration', 'ocr'),
    (316, 'or are', 'incom prehensible,', 'incomprehensible,', 'spacing'),
    (317, '', 'Ir,', 'If,', 'type'),
    (317, 'the truth, you do not rightly infer', '‘that', '“that', 'ocr'),
    (317, 'obtained, because there', 'ts', 'is', 'ocr'),
    (317, 'of the truth, contradict it. This,', 'however', 'however,', 'ocr'),
    (319, 'You say then, in your epistle,', 'that the', '“that the', 'ocr'),
    (319, 'of the lord or lords of the geniture,', 'tf', 'if', 'ocr'),
    (321, '', 'Ir,', 'If,', 'type'),
    (322, 'For that which it appears to you proper to add as an indication', 'that', '“that', 'ocr'),
    (322, 'and that there', 'ts', 'is', 'ocr'),
    (323, 'For you speak as if', 'some', '“some', 'ocr'),
    (323, 'concerning the peculiar demon. For if [as you say]', 'this', '“this', 'ocr'),
    (324, 'which represents', 'some', '“some', 'ocr'),
    (324, 'sameness of things essentially incorporeal.', 'Why', '“Why', 'ocr'),
    (325, '', 'CHAP..', 'CHAP. X.', 'ocr'),
    (327, '', 'SECTION.', 'SECTION X.', 'ocr'),
    (327, '', 'Ir', 'It', 'type'),
    (327, 'You inquire, then,', "''whether", '“whether', 'ocr'),
    (328, 'you in vain doubt,', 'that it', '“that it', 'ocr'),
    (328, 'Nor do you rightly doubt in what follows, viz.', 'that the soul', '“that the soul', 'ocr'),
    (329, 'CHAP. III. I', 'wisH,', 'wish,', 'type'),
    (329, 'For you compare with it', 'certain', '“certain', 'ocr'),
    (331, 'Hence those who possess this divination', 'do not,”', '“do not,”', 'ocr'),
    (331, 'as you conjecture,', 'foresee', '“foresee', 'ocr'),
    (331, 'For all divine foreknowledge is boniform. Nor', 'do they', '“do they', 'ocr'),
    (335, '', 'Wiru', 'With', 'type'),
    (335, 'but is divinely delivered by them. Nor do', 'theurgists', '“theurgists', 'ocr'),
    (335, 'Nor, in the last place, are', 'they deceived', '“they deceived', 'ocr'),
    (50, 'and do not wholly', '[z. e.', '[i. e.', 'ocr'),
    (218, 'if he is impure', 'Srom', 'from', 'ocr'),
    (211, 'define justice to be the', "soul's", 'soul’s', 'type'),
    (198, 'is drawn down by', 'zdols.”', 'idols.”', 'ocr'),
    (50, 'excellent order of beings,', 'véz.', 'viz.', 'ocr'),
    (51, 'which follow them [and the', 'Gods]', 'Gods].', 'ocr'),
    (56, 'implore the Gods to', 'zncline', 'incline', 'ocr'),
    (308, 'likewise, as leads to', 'an.unbegotten', 'an unbegotten', 'spacing'),
# FIXES-END
]

# Paragraph breaks the image rule (an indented first line) missed or wrongly
# made: (page, the words that begin the line, "add" or "remove").
PARAS = [
]


def apply_fixes(pages):
    todo = {}
    for n, (pg, ctx, old, new, _kind) in enumerate(FIXES):
        words = [w["w"] for w in pages[pg]]
        c, o = ctx.split(), old.split()
        hits = [i for i in range(len(words) - len(c) - len(o) + 1) if words[i : i + len(c) + len(o)] == c + o]
        if not c and len(hits) > 1:
            hits = [h for h in hits if h == 0]
        if os.environ.get("LENIENT") and len(hits) != 1:
            log("  FIXES entry not found exactly once", n, pg, ctx, old, len(hits))
            continue
        assert len(hits) == 1, ("FIXES entry not found exactly once", n, pg, ctx, old, len(hits))
        first = pages[pg][hits[0] + len(c)] if hits[0] + len(c) < len(pages[pg]) else {}
        repl = [{"w": x, "hy": None, "line": first.get("line"), "doubt": False, "alts": []} for x in new.split()]
        if repl and first.get("start"):
            # a replaced word that began a line still begins it (the chapter
            # headings are found by 'CHAP.' at the start of a line)
            repl[0]["start"] = True
        todo.setdefault(pg, []).append((hits[0] + len(c), len(o), repl))
    for pg, edits in todo.items():
        edits.sort(key=lambda e: e[0], reverse=True)
        p = pages[pg]
        last = len(p) + 1
        for at, ln, new in edits:
            assert at + ln <= last, ("FIXES entries overlap", pg, at)
            last = at
            p[at : at + ln] = new
    kinds = Counter(f[4] for f in FIXES)
    log(f"{len(FIXES)} hand fixes: " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))
    return kinds


# ---------------------------------------------------------------------------
# TYPOGRAPHY
# ---------------------------------------------------------------------------

# Taylor prints dæmon and its derivatives with the ligature throughout (read
# on the page images); the OCR reads it as "demon", "daemon" or "damon".
# (not "demonstrate", which Taylor spells with a plain e)
DAEMON = re.compile(r"\b([Dd])(?:e|ae|a|æ|ee|se|ze|z|ce|œ)mon(?!strat)")


# Other words Taylor prints with æ, each read on the page images where it
# first occurs; the OCR gives e, ae, se, ze and the like for the ligature.
LIGATURE_WORDS = [
    (re.compile(r"\bCh(?:e|ae|se|ze|ee|æ)remon"), "Chæremon"),
    (re.compile(r"\bBranchid(?:e|ae|se|æ)\b"), "Branchidæ"),
    # pp. 155, 205
    (re.compile(r"\b([Pp])h(?:e|ae|ee|se|æ)nomen"), r"\1hænomen"),
    # spelt so by Taylor on pp. 141 and 144 (read on the page images)
    (re.compile(r"\bBrandchid(?:e|ae|se|æ)\b"), "Brandchidæ"),
]


def typography(w):
    w = DAEMON.sub(lambda m: m.group(1) + "æmon", w)
    for pat, rep in LIGATURE_WORDS:
        w = pat.sub(rep, w)
    # the first word of a chapter, in capitals and small capitals: AFTER -> After
    m = re.match(r"^([^A-Za-z]*)([A-Za-z]+)(.*)$", w)
    if m and len(m.group(2)) >= 2 and m.group(2).isupper() and not re.fullmatch(r"[IVXLC]+", m.group(2)):
        w = m.group(1) + m.group(2)[0] + m.group(2)[1:].lower() + m.group(3)
    # ... which the OCR often reads in mixed case: ConcERNING, MoREOVER, AnD
    elif m and len(m.group(2)) >= 3 and m.group(2)[0].isupper() and any(c.isupper() for c in m.group(2)[1:]) and any(c.islower() for c in m.group(2)[1:]):
        MIXED_CAPS.append(w)
        w = m.group(1) + m.group(2)[0] + m.group(2)[1:].lower() + m.group(3)
    # the OCR reads the capital T of The, This, Those, To and the like as
    # "‘T" (the kern of the T), and a speck in the margin before a line as
    # "‘"; Taylor's text opens no single quote with such a word, nor with a
    # small letter (each case listed in the log and checked on the page images)
    if re.match(r"‘(T[oh]|[a-z])", w) and "’" not in w:
        STRAY_QUOTE.append(w)
        w = w[1:]
    w = w.replace("‘‘", "“").replace("’’", "”").replace("``", "“").replace("''", "”")
    return w


def join(words):
    words = list(words)
    while words and words[0] == "¶":
        words.pop(0)
    while words and words[-1] == "¶":
        words.pop()
    s = " ".join(words)
    s = re.sub(r" ([,.;:!?)\]])", r"\1", s)
    s = re.sub(r"([(\[]) ", r"\1", s)
    s = re.sub(r"“ ", "“", s)
    s = re.sub(r" ”", "”", s)
    s = re.sub(r" ?— ?", "—", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" ?¶ ?", "\n\n", s)
    return s.strip()


# ---------------------------------------------------------------------------
# THE UNITS
# ---------------------------------------------------------------------------

ROMAN = {r: i for i, r in enumerate("I II III IV V VI VII VIII IX X XI XII XIII XIV XV XVI XVII XVIII XIX XX XXI XXII XXIII XXIV XXV XXVI XXVII XXVIII XXIX XXX XXXI".split(), 1)}
# chapters in each Section, as printed (counted on the page images)
CHAPTERS = {1: 21, 2: 11, 3: 31, 4: 13, 5: 26, 6: 7, 7: 5, 8: 8, 9: 10, 10: 8}

# The heading of the reply, p. 17, as printed (in capitals).
ANSWER_HEADING = "The Answer of the Preceptor Abammon to the Epistle of Porphyry to Anebo, and a Solution of the Doubts Contained in It."
EPISTLE_HEADING = "The Epistle of Porphyry to the Egyptian Anebo."


def split(pages):
    """The Epistle (pp. 1-16) and the chapters of Sections I-X (pp. 17-336).
    The headings are found by their words: 'SECTION' and 'CHAP.' at the
    start of a line, in the order the book prints them."""
    words = [(pg, w) for pg in sorted(pages) for w in pages[pg]]
    units = []
    k = 0

    def numeral(i):
        """1 if the word at i is the heading's Roman numeral (as the OCR
        reads it), else 0 (the vote may have dropped it as a note mark)."""
        return 1 if i < len(words) and re.fullmatch(r"[IVXLYTl1|]{1,6}[.,:]*", words[i][1]["w"]) else 0
    # p. 1: the heading, then the salutation and the letter
    while not (words[k][1]["w"] == "Porphyry" and words[k + 1][1]["w"] == "to"):
        k += 1
    units.append({"key": "epistle", "section": 0, "chapter": 0, "firstPage": "1", "words": []})
    sect, chap = 0, 0
    while k < len(words):
        pg, w = words[k]
        t = w["w"]
        if pg == 17 and sect == 0:
            # the half-title and the heading of the reply, down to SECTION I.
            if t == "SECTION":
                sect, chap = 1, 0
                k += 1 + numeral(k + 1)
                continue
            if units[-1]["key"] == "epistle" and "lastPage" not in units[-1]:
                units[-1]["lastPage"] = "16"
            k += 1
            continue
        if re.match(r"^\W*SECTION\b", t) and w.get("start"):
            sect += 1
            chap = 0
            k += 1 + numeral(k + 1)
            HEADINGS.append((pg, f"SECTION {sect}"))
            continue
        if re.fullmatch(r"\W*CHAP[.,]*", t) and w.get("start"):
            chap += 1
            assert chap <= CHAPTERS[sect], ("too many chapters", sect, chap, pg)
            if "lastPage" not in units[-1]:
                units[-1]["lastPage"] = str(words[k - 1][0])
            units.append({"key": f"{sect}.{chap}", "section": sect, "chapter": chap, "firstPage": str(pg), "words": []})
            k += 1 + numeral(k + 1)
            HEADINGS.append((pg, f"CHAP. {chap}"))
            continue
        units[-1]["words"].append(t)
        k += 1
    units[-1]["lastPage"] = str(words[-1][0])
    for u in units:
        u["text"] = join(typography(x) for x in u.pop("words"))
    return units


def check_units(units):
    want = ["epistle"] + [f"{s}.{c}" for s, n in CHAPTERS.items() for c in range(1, n + 1)]
    have = [u["key"] for u in units]
    assert have == want, ("a chapter is missing or out of order", [x for x in want if x not in have], [x for x in have if x not in want])
    for u in units:
        bad = re.search(r".{0,30}([*•■♦°^®™%§¶|{}_]|\s[tfJX]\s|\s[,.;:]|  ).{0,30}", u["text"])
        assert not bad, ("a stray mark", u["key"], bad.group(0))
        assert '"' not in u["text"], ("a straight quotation mark", u["key"], re.search(r'.{0,30}".{0,30}', u["text"]).group(0))
        assert u["text"], ("empty", u["key"])


# ---------------------------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------------------------


def write(units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/iamblichus-mysteries.py from the archive.org OCR\n")
    w("// of the Wellcome copy of Taylor's Iamblichus on the Mysteries (Chiswick,\n")
    w("// 1821) and of four scans of the 1895 reprint, voted and then read against\n")
    w("// the page images of the 1821 copy. Do not edit by hand: correct the\n")
    w("// generator (its FIXES list holds every correction made by hand) and run it\n")
    w("// again.\n\n")
    w("export type IamblichusUnit = {\n")
    w("  /** 'epistle' (Porphyry's letter), or 'S.C', Taylor's Section S (1-10) and Chapter C. */\n  key: string;\n")
    w("  /** Taylor's Section (0 for the Epistle). */\n  section: number;\n")
    w("  /** Taylor's Chapter within the Section (0 for the Epistle). */\n  chapter: number;\n")
    w("  /** The printed pages of the 1821 volume the unit runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The unit as printed, without Taylor's footnote marks; paragraphs separated by a blank line. */\n  text: string;\n};\n\n")
    w(f"/** The heading of Porphyry's letter (p. 1). */\nexport const IAMBLICHUS_EPISTLE_HEADING = {json.dumps(EPISTLE_HEADING)};\n\n")
    w(f"/** The heading of the reply (p. 17). */\nexport const IAMBLICHUS_ANSWER_HEADING = {json.dumps(ANSWER_HEADING)};\n\n")
    w("/** The chapters in each of Taylor's ten Sections. */\n")
    w("export const IAMBLICHUS_CHAPTERS: Record<number, number> = " + json.dumps({str(k): v for k, v in CHAPTERS.items()}).replace('"', "") + ";\n\n")
    w("export const IAMBLICHUS_UNITS: IamblichusUnit[] = [\n")
    for u in units:
        w(
            f"  {{ key: {json.dumps(u['key'])}, section: {u['section']}, chapter: {u['chapter']}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n"
        )
    w("];\n")


TAKEN_COUNT = 299


def main():
    d, imgs = sys.argv[1], sys.argv[2]
    both = {n: scan_pages(os.path.join(d, FILES[n]), n) for n in SIGLA}
    scans = {n: both[n][0] for n in SIGLA}
    notes = both["W"][1]
    hyph, whole = midline_forms(scans)
    pages = {}
    mark_report = []
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        toks = {n: attach(raw_tokens(scans[n][pg])) for n in SIGLA}
        entries = vote_page(pg, toks)
        words, marks = resolve_page(entries)
        indents = indented_lines(os.path.join(imgs, f"p{pg:03d}.jpg"), scans["W"][pg])
        heads = {i for i, ln in enumerate(scans["W"][pg]) if re.match(r"^(SECTION|CHAP)", ln["text"])}
        marked, seen = [], set()
        for wd in words:
            if wd["line"] not in seen:
                wd["start"] = True
                if wd["line"] in indents and wd["line"] not in heads and (wd["line"] - 1) not in heads:
                    marked.append({"w": "¶", "hy": None, "line": wd["line"], "doubt": False, "alts": []})
            seen.add(wd["line"])
            marked.append(wd)
        words = marked
        starts = note_starts(notes[pg], scans["W"][pg])
        if marks != starts:
            mark_report.append((pg, marks, starts))
        pages[pg] = words
    for pg, m, s in mark_report:
        log(f"  p.{pg}: {m} marks dropped from the text, {s} notes begin below it")
    # a word broken over two pages is joined on the first
    for pg in range(FIRST_PAGE, LAST_PAGE):
        if not pages[pg] or not pages[pg + 1]:
            continue
        last = pages[pg][-1]
        nxt = next((w for w in pages[pg + 1] if w["w"] != "¶"), None)
        if nxt and re.search(r"[A-Za-z]-$", last["w"]) and re.match(r"[a-z]", nxt["w"]):
            last["hy"] = last["w"] + nxt["w"]
            last["w"] = last["w"][:-1] + nxt["w"]
            pages[pg + 1].remove(nxt)
    log(f"{len(TAKEN)} readings taken; {len(DIFFERED)} places where a 1895 scan differs and W is kept")
    log(f"{len(REDIVIDED)} places where W's words are divided as the 1895 scans divide them: " + "; ".join(f"p.{p} [{a}] -> [{b}]" for p, a, b in REDIVIDED))
    log(f"{len(W_ONLY)} words only in W dropped: " + "; ".join(f"p.{p} ...{c[-20:]} [{w}]" for p, c, w in W_ONLY))
    log(f"{len(LONG)} readings of a different length from W's (taken only where all four 1895 scans agree): " + "; ".join(f"p.{p} ...{c[-20:]} [{w}] -> [{r}]" for p, c, w, r in LONG))
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    # hyphens at a line end: kept where the word is printed with a hyphen
    # inside a line somewhere in the scans and never printed whole
    kept = []
    for pg in pages:
        for wd in pages[pg]:
            if wd["hy"]:
                h = wd["hy"].lower().strip(".,;:!?()[]‘’“”'\"")
                j = wd["w"].lower().strip(".,;:!?()[]‘’“”'\"")
                # Taylor always prints the compounds of "self" with a hyphen
                if (h in hyph and j not in whole) or h.startswith("self-"):
                    wd["w"] = wd["hy"]
                    kept.append((pg, wd["hy"]))
    log(f"{len(kept)} line-end hyphens kept: " + ", ".join(f"p.{p} {w}" for p, w in kept))
    log(f"{len(NOTE_NO_MARK)} pages whose notes do not begin with a mark: " + "; ".join(f"p.{p} {t!r}" for p, t in NOTE_NO_MARK))
    log(f"{len(DROPPED)} lines without a Latin letter dropped: " + "; ".join(f"p.{p} {t!r}" for p, t in DROPPED))
    if os.environ.get("DUMP"):
        with open(os.environ["DUMP"], "w") as f:
            for pg in sorted(pages):
                f.write(f"=== p.{pg}\n{' '.join(w['w'] for w in pages[pg])}\n")
    apply_fixes(pages)
    if os.environ.get("PROOF"):
        with open(os.environ["PROOF"], "w") as f:
            for pg in sorted(pages):
                f.write(f"=== p.{pg}\n")
                lines = []
                for w in pages[pg]:
                    if not lines or (w["line"] is not None and w["line"] != lines[-1][0]):
                        lines.append((w["line"], []))
                    tag = w["w"]
                    if w.get("doubt") and w.get("alts"):
                        tag = f"{w['w']}⟦{'|'.join(w['alts'])}⟧"
                    lines[-1][1].append(tag)
                for _, ws in lines:
                    f.write(" ".join(ws) + "\n")
                if notes[pg]:
                    f.write("    [notes: " + " / ".join(l["text"][:40] for l in notes[pg]) + "]\n")
    units = split(pages)
    log(f"{len(MIXED_CAPS)} chapter-opening words in mixed capitals and small capitals normalised: " + ", ".join(MIXED_CAPS))
    log(f"{len(STRAY_QUOTE)} stray quotes before a capital T removed: " + ", ".join(STRAY_QUOTE))
    if os.environ.get("LENIENT"):
        try:
            check_units(units)
        except AssertionError as e:
            log("CHECK FAILED", e)
    else:
        check_units(units)
    log(f"{len(units)} units: the Epistle and {len(units) - 1} chapters")
    write(units)


if __name__ == "__main__":
    main()
