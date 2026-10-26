"""The Book of the Secrets of Enoch (2 Enoch, "Slavonic Enoch"), chapters
I-LXVIII, in the English of W. R. Morfill, edited by R. H. Charles: The Book
of the Secrets of Enoch, translated from the Slavonic by W. R. Morfill, M.A.,
and edited, with introduction, notes and indices by R. H. Charles, M.A.
(Oxford: at the Clarendon Press, 1896), pp. 1-84, for the texts archive
(Stage 24) -> src/lib/timeline/texts/corpus/secrets-of-enoch-text.ts.

Run:  python3 -I scripts/texts/secrets-of-enoch.py DIR IMAGES > \
          src/lib/timeline/texts/corpus/secrets-of-enoch-text.ts
(needs numpy and Pillow; the report goes to stderr; DUMP=path also writes
the voted text, page by page, before the hand fixes). IMAGES holds the page
images of the Cornell copy, p001.jpg ... p084.jpg, from
https://archive.org/download/cu31924014633568/page/n{page+51}.jpg (1424 x 2392
pixels). DIR holds the three OCR inputs; everything was fetched with the
User-Agent "relate-archive-research (repo Oshioma/relate)":

  C_djvu.xml  https://archive.org/download/cu31924014633568/cu31924014633568_djvu.xml
              (Cornell University Library copy, the gift of Alfred C. Barnes)
  W_djvu.xml  https://archive.org/download/bookofsecretsofe00morf/bookofsecretsofe00morf_djvu.xml
              (Wellesley College Library copy)
  G_djvu.xml  https://archive.org/download/booksecretsenoc00morfgoog/booksecretsenoc00morfgoog_djvu.xml
              (University of Michigan copy, scanned by Google)
In all three, printed page = leaf - 51 (checked on the running heads).

WHY THREE SCANS OF THE ONE PRINTING. No proofread transcription of the 1896
book with its signs was reachable: Wikisource answered HTTP 429; sacred-texts
.com answered 403 to this client; pseudepigrapha.com did not resolve; the
earlychristianwritings.com page for 2 Enoch does not exist. The three
archive.org scans are three copies of the one printing, OCRed separately, so
a reading two of them share against the third is taken (the majority of three
witnesses), and every page was then read against the page images.

METHOD.
1. Lines. The words of each page (djvu.xml) are grouped into visual lines by
   their vertical middle (the OCR splits a printed line into several when a
   word has only descenders or ascenders). The running head is dropped. The
   text ends at the first line set clearly smaller than the text (under 0.82
   of the text's line height, scaled to the page image) that is followed by
   another such line, or is the last, or stands after a gap: the critical and
   exegetical notes, which are set smaller, follow the text on every page.
2. Tokens. Words broken over a line with a hyphen are joined. A token with
   no letters is attached to its neighbour before the vote: an asterisk (or
   what the OCR reads for one, '#') to the word after it, and a stray mark or
   number after a word without punctuation (a misread raised note number) to
   the word before it. A bare number after a stop is left alone (a verse
   number), and so is a number all three scans read alike before a word (a
   number in the text, e.g. '165 years').
3. The vote. Per page, C is the base; W and G are aligned with it by their
   letters. Where W and G agree with each other against C (by letters and
   digits) W's reading is taken (TAKEN_COUNT of them). Where all three differ,
   C is kept and the page image decided (step 6).
4. Charles's apparatus signs. Charles marks the places where the manuscripts
   differ (see TYPOGRAPHY below) with an asterisk before the words and a
   raised note number after them, or with a raised number alone after a single
   word. The OCR reads them badly (the raised numbers as digits or as ? ! ' ’
   ” ° ® ™ and the like), so they are found on the page image of the Cornell
   copy instead (raised_marks): along each text line, cut along its fitted
   baseline, a run of ink that stands clear of the baseline and reaches the
   height of a capital is a raised mark; a wide single run is an asterisk,
   narrower runs side by side a note number, a still narrower one a quotation
   mark (left alone). A note number goes to the word it follows, an asterisk
   to the word it stands before. The OCR's own marks after a word are then
   dropped, keeping the punctuation two scans agree on; where two scans
   suggest a raised number the image does not show, it is logged (MISSED) and
   was looked at. The raised numbers are numbered 1, 2, 3 ... on each page,
   as Charles numbers his notes, and written as superscript digits; where
   Charles points a second place back to an earlier note (p. 2 'snow³') the
   fix writes the number he prints.
5. Chapters and verses: by Charles's chapter numerals (I.-LXVIII.) and verse
   numbers, a number being taken as a verse only where it is the next one
   expected and stands after a stop (or a comma: xxxi. 8 is printed after
   one) (split, then check_units). A verse number the OCR misread as a
   letter ('g.' for 9. at xlviii. 9) is mended in FIXES. A's chapter
   titles, in [ ], go with the verse they stand before.
6. Proofreading. Every page, 1 to 84, was read against the page images of the
   Cornell copy, words, signs and raised numbers alike. The differences are
   the FIXES list below, each with its kind.

TYPOGRAPHY. Charles's text is one text made from several witnesses, not two
recensions side by side. He follows the longer Slavonic manuscript A
(Khludov's, published by Popov, 1880) in the main; B (the shorter Serbian
recension, published by Novakovic, 1884) where it has the better reading; and
Sokolov's text ("Sok.", made from all the other manuscripts) where A and B are
both corrupt. The readings he rejects are in his critical notes. In the text:
  *  ... n   an asterisk opens, and a raised number closes, the words to
             which critical note n on that page gives the other readings;
             a raised number with no asterisk refers to the one word before it;
  [ ]        the chapter titles of A (which "have no claim to antiquity") and
             passages he holds to be later additions in A (B lacks most of
             them);
  ( )        words supplied in the translation.
They are kept as printed. The notes themselves are not imported.

NOT IMPORTED. The critical notes (variants of A, B and Sokolov's text) and
the exegetical notes at the foot of each page; the Preface, Contents and
Introduction (pp. vii-xlvii); the Appendix, the Melchizedekian fragment
(pp. 85-93), of which Morfill says "this legend does not belong to this Book
of Enoch" (p. xiii); the
Additional Note on the Phoenixes (p. 94); the indices (pp. 95-100).
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


FIRST_PAGE, LAST_PAGE = 1, 84
LEAF_OFFSET = 51
SIGLA = ("C", "W", "G")

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
    lines = []
    for w in sorted(words, key=lambda w: (w[1] + w[3]) / 2):
        mid = (w[1] + w[3]) / 2
        if lines and abs(mid - lines[-1]["mid"]) < 0.6 * h:
            ln = lines[-1]
            ln["w"].append(w)
            ln["mid"] += (mid - ln["mid"]) / len(ln["w"])
        else:
            lines.append({"mid": mid, "w": [w]})
    for ln in lines:
        ln["w"].sort(key=lambda w: w[0])
        hh = sorted(w[1] - w[3] for w in ln["w"])
        ln["h"] = hh[len(hh) // 2]
        ln["text"] = " ".join(w[4] for w in ln["w"])
    return sorted(lines, key=lambda l: l["mid"])


def xml_pages(path):
    x = open(path, encoding="utf-8").read()
    out = []
    for o in re.findall(r"<OBJECT.*?</OBJECT>", x, re.S):
        ph = int(re.search(r'height="(\d+)"', o).group(1))
        out.append((ph, visual_lines(page_words(o))))
    return out


HEAD = re.compile(r"Book of|Secrets|Enoch\.|Chapter|^\W*\d{1,2}\W*$|^[\w\s.,—-]{0,6}$")


def text_lines(page, scale, has_head=True):
    """The lines of the text: the running head dropped (p. 1 has none), and
    the notes, set in smaller type, cut off."""
    ph, lines = page
    H = scale[1] * ph / scale[0]
    i = 0
    while has_head and i < len(lines) and i < 2 and HEAD.search(lines[i]["text"]) and lines[i]["mid"] < lines[0]["mid"] + 1.5 * H:
        i += 1
    body = [l for l in lines[i:] if 0.5 * H <= l["h"] <= 1.7 * H]
    small = [l["h"] < 0.82 * H for l in body]
    end = len(body)
    for j in range(len(body)):
        gap = body[j]["mid"] - body[j - 1]["mid"] if j else 0
        if small[j] and (j + 1 == len(body) or small[j + 1] or gap > 2.2 * H):
            end = j
            break
    return body[:end], body[end:]


def scan_pages(path):
    """{page: text lines}, {page: the lines of the notes below the text}."""
    ps = xml_pages(path)
    pages = [ps[pg + LEAF_OFFSET] for pg in range(FIRST_PAGE, LAST_PAGE + 1)]
    ph = statistics.median(p[0] for p in pages)
    h = statistics.median(l["h"] for p in pages[1:] if p[0] == ph for l in p[1][1:4])
    split = {pg: text_lines(ps[pg + LEAF_OFFSET], (ph, h), pg != 1) for pg in range(FIRST_PAGE, LAST_PAGE + 1)}
    return {pg: s[0] for pg, s in split.items()}, {pg: s[1] for pg, s in split.items()}


# ---------------------------------------------------------------------------
# TOKENS
# ---------------------------------------------------------------------------

# Latin letters, and the Cyrillic and Greek letters the OCR puts in their
# place (C's OCR often reads 'the' as 'Ше', 'me' as 'пе'): a word of them is
# still a word, for the vote to replace.
LETTER = re.compile(r"[A-Za-zÀ-ÿĀ-žА-яЁёΑ-ωἀ-ῼ]")
LATIN = re.compile(r"[A-Za-zÀ-ÿĀ-ž]")
OPENERS = set("‘“([")


def key(word):
    """Latin letters (and, for a bare number, its digits) for the alignment."""
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    for a, b in (("àáâäãā", "a"), ("èéêëē", "e"), ("ìíîïī", "i"), ("òóôöõō", "o"), ("ùúûüū", "u")):
        w = re.sub(f"[{a}]", b, w)
    letters = re.sub(r"[^a-z]", "", w)
    if letters:
        return letters
    if LETTER.search(w):
        return "?" + w  # a word in the wrong script: never equal to a Latin one
    return re.sub(r"[^0-9]", "", w)


def raw_tokens(lines):
    """(text, box, line) tokens; a word broken over two lines is joined."""
    toks = []
    for li, ln in enumerate(lines):
        for w in ln["w"]:
            # the OCR reads Charles's closing square bracket as '|' or '}'
            text = re.sub(r"[|}]$", "]", w[4]) if not re.fullmatch(r"[|}]", w[4]) else "]"
            for part in text.replace("—", " — ").replace("­", "").split():
                m = re.fullmatch(r"([*#]+)(\d.*)", part)  # '#165': an asterisk and a number
                if m:
                    toks.append([m.group(1), (w[0], w[1], w[2], w[3]), li])
                    part = m.group(2)
                toks.append([part, (w[0], w[1], w[2], w[3]), li])
    out = []
    for t in toks:
        if out and out[-1][2] != t[2] and re.search(r"\w[-¬]$", out[-1][0]) and re.match(r"[a-z]", t[0]):
            out[-1][0] = out[-1][0][:-1] + t[0]
            continue
        out.append(t)
    return out


def is_word(t):
    return bool(LETTER.search(t))


def attach(tokens):
    """Attach tokens without letters to a neighbour (method step 2)."""
    out = []
    pending = None
    for t, box, li in tokens:
        if is_word(t) or t == "—" or re.fullmatch(r"\d+[.,;:]?|\(\d\)", t):
            # a word, or a number: a verse number, a number in the text, a
            # bracketed count such as "(1)" in xxx. 8, or a raised note
            # number the OCR read as digits (the image decides)
            if pending:
                t = pending + t
                pending = None
            out.append([t, box, li])
            continue
        if set(t) <= set("*#×¥+") or set(t) <= OPENERS:
            pending = (pending or "") + t
            continue
        if out:
            out[-1][0] += t
        else:
            out.append([t, box, li])
    if pending:
        out.append([pending, tokens[-1][1], tokens[-1][2]])
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
DIFFERED = []


def vote_page(pg, toks):
    """A list of {"forms": (C, W, G), "box": C's box or None, "line": C's line}
    per word. A witness that does not align one to one has None."""
    base = toks["C"]
    bk = [key(t[0]) for t in base]
    others = ("W", "G")
    ks = {n: [key(t[0]) for t in toks[n]] for n in others}
    ats = {n: anchors(bk, ks[n]) for n in others}
    bounds = [b for b in range(len(base) + 1) if all(ats[n][b] is not None for n in others)]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = base[b1:b2]
        rd = {n: [t[0] for t in toks[n][ats[n][b1] : ats[n][b2]]] for n in others}
        segk = "".join(bk[b1:b2])
        rk = {n: "".join(ks[n][ats[n][b1] : ats[n][b2]]) for n in others}
        ctx = " ".join(t[0] for t in base[max(0, b1 - 5) : b1])
        if rk["W"] == rk["G"] and rk["W"] != segk and abs(len(rd["W"]) - len(seg)) <= 2:
            TAKEN.append((pg, ctx, " ".join(t[0] for t in seg), " ".join(rd["W"])))
            log(f"  TAKEN p.{pg} (W+G): ...{ctx} [{' '.join(t[0] for t in seg)}] -> [{' '.join(rd['W'])}]")
            n = len(rd["W"])
            g = rd["G"] if len(rd["G"]) == n else [None] * n
            for i in range(n):
                c = seg[i] if len(seg) == n else (seg[0] if seg and i == 0 else None)
                out.append({"forms": (None, rd["W"][i], g[i]), "box": c[1] if c else None, "line": c[2] if c else None})
            continue
        if any(rk[n] != segk for n in others):
            DIFFERED.append((pg, ctx))
            log(f"  differ p.{pg}, C kept: ...{ctx} C[{' '.join(t[0] for t in seg)}] W[{' '.join(rd['W'])}] G[{' '.join(rd['G'])}]")
        cols = {n: rd[n] if len(rd[n]) == len(seg) else [None] * len(seg) for n in others}
        for i, t in enumerate(seg):
            out.append({"forms": (t[0], cols["W"][i], cols["G"][i]), "box": t[1], "line": t[2]})
    return out


# ---------------------------------------------------------------------------
# CHARLES'S APPARATUS SIGNS, READ ON THE PAGE IMAGES (method step 4)
# ---------------------------------------------------------------------------


def ink_runs(cols):
    out, start = [], None
    for i, v in enumerate(cols):
        if v and start is None:
            start = i
        if not v and start is not None:
            out.append((start, i))
            start = None
    if start is not None:
        out.append((start, len(cols)))
    return out


DESCENDERS = re.compile(r"[gjpqy,;()\[\]]")


def raised_marks(image_path, lines):
    """The raised marks of each text line of a page image: asterisks and
    raised note numbers, as (line, x, kind). A mark is a run of ink columns
    with no ink near the baseline, reaching up to the height of a capital;
    an asterisk is a single run about as wide as a capital letter, a note
    number one or two narrower runs side by side, and a quotation mark is
    narrower and shorter still and is left alone."""
    import numpy as np
    from PIL import Image

    im = np.array(Image.open(image_path).convert("L")) < 140
    marks = []
    for li, ln in enumerate(lines):
        ws = ln["w"]
        x0 = max(0, min(w[0] for w in ws) - 30)
        x1 = min(im.shape[1], max(w[2] for w in ws) + 40)
        # the baseline under each word: the row below which its ink falls away
        # most sharply (only descenders go on below it); the scans are a
        # little skewed, so a straight line is fitted through the words'
        # baselines and the strip is cut along it
        pts = []
        for w in ws:
            if len(LATIN.findall(w[4])) < 3:
                continue
            counts = im[w[3] - 4 : w[1] + 4, w[0] : w[2]].sum(axis=1).astype(int)
            if len(counts) < 12:
                continue
            drops = [counts[r] - counts[r + 2] for r in range(len(counts) // 3, len(counts) - 2)]
            pts.append(((w[0] + w[2]) / 2, w[3] - 4 + len(counts) // 3 + max(range(len(drops)), key=lambda r: drops[r])))
        if not pts:
            continue
        if len(pts) >= 3:
            xs = np.array([p[0] for p in pts])
            ys = np.array([p[1] for p in pts])
            slope = float(np.median([(ys[j] - ys[i]) / (xs[j] - xs[i]) for i in range(len(xs)) for j in range(i + 1, len(xs)) if xs[j] - xs[i] > 100] or [0.0]))
            icpt = float(np.median(ys - slope * xs))
        else:
            slope, icpt = 0.0, float(np.median([p[1] for p in pts]))
        strip = np.zeros((41, x1 - x0), dtype=bool)
        for c in range(x0, x1):
            b = int(round(icpt + slope * c))
            strip[:, c - x0] = im[b - 32 : b + 9, c]
        anyink = strip.any(axis=0)
        lower = strip[32 - 6 :, :].any(axis=0)
        runs = []
        for s, e in ink_runs(anyink):
            if lower[s:e].any():
                continue
            rows = [r for r in range(strip.shape[0]) if strip[r, s:e].any()]
            top, bot = rows[0], rows[-1]
            hgt = bot - top + 1
            if top > 12 or hgt < 10:
                continue  # a hyphen, a dash, a speck or a quotation mark
            runs.append([s, e, hgt])
        # an asterisk: one wide run; a number: narrow runs close together
        i = 0
        while i < len(runs):
            s, e, hgt = runs[i]
            if e - s >= 17:
                marks.append((li, x0 + s, "star"))
                i += 1
                continue
            if e - s < 9:
                i += 1
                continue
            j = i
            while j + 1 < len(runs) and runs[j + 1][0] - runs[j][1] <= 5 and runs[j + 1][1] - runs[j + 1][0] < 17:
                j += 1
            marks.append((li, x0 + s, "num"))
            i = j + 1
    return marks


JUNK = re.compile(r"[^.,;:?!’”)\]]")
SUP = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")


def split_form(t):
    """lead (marks before the first letter), core, tail (marks after the last)."""
    L = "A-Za-zÀ-ÿĀ-žА-яЁёΑ-ωἀ-ῼ"
    m = re.match(rf"^(.*?)([{L}].*[{L}]|[{L}])(.*)$", t)
    if not m:
        return t, "", ""
    return m.group(1), m.group(2), m.group(3)


def majority(xs):
    c = Counter(xs).most_common()
    return c[0][0] if c and (c[0][1] * 2 > len(xs) or len(xs) == 1) else None


MISSED = []


def resolve(entry, pg):
    """The word, with its asterisk and raised number placed by the image."""
    forms = [f for f in entry["forms"] if f is not None]
    main = forms[0]
    lead, core, _ = split_form(main)
    if not core:
        # a number in the text, or a verse number: its asterisk is the image's
        return ("*" * entry.get("star", 0)) + re.sub(r"^[*#×¥+]+", "", main)
    tails = [split_form(f)[2] for f in forms]
    clean = [JUNK.sub("", t) for t in tails]
    if entry.get("num"):
        # the marks the OCR made of the number are dropped; stops kept
        clean = [re.sub(r"[?!’”]", "", t) for t in clean]
    tail = majority(clean)
    if tail is None:
        tail = clean[0]
    if not entry.get("num") and sum(1 for t in tails if re.search(r"[0-9°®™'‘\"“%&§|^~{}]|[’”][.,;:]|[?!]{2}", t)) >= 2:
        MISSED.append((pg, main, tails))
    opener = "".join(c for c in lead if c in OPENERS)
    if entry.get("star") and opener and any(re.search(r"[*#][‘“(\[]", split_form(f)[0]) for f in forms):
        return "*" + opener + core + "{R}" * entry.get("num", 0) + tail + entry.get("after", "")
    sup = "{R}" * entry.get("num", 0)
    return opener + ("*" * entry.get("star", 0)) + core + sup + tail + entry.get("after", "")


def apply_signs(pg, entries, lines, image_path):
    marks = raised_marks(image_path, lines)
    by_line = {}
    for k, e in enumerate(entries):
        if e["box"] is not None:
            by_line.setdefault(e["line"], []).append((e["box"][0], k))
    stars_ocr = sum(1 for e in entries if any(c in "*#" for c in split_form(e["forms"][0] or e["forms"][1] or "")[0]))
    for li, x, kind in marks:
        cands = sorted(by_line.get(li, []))
        if kind == "num":
            before = [k for bx, k in cands if bx <= x]
            if before:
                entries[before[-1]]["num"] = entries[before[-1]].get("num", 0) + 1
            else:
                log(f"  p.{pg}: raised number at line {li} x {x} has no word before it")
        else:
            # the word the asterisk stands in front of (the OCR may have read
            # the asterisk into it, '[*and')
            after = [k for bx, k in cands if entries[k]["box"][2] > x + 8]
            if not after and li + 1 in by_line:
                after = [min(by_line[li + 1])[1]]
            if after:
                entries[after[0]]["star"] = 1
            else:
                log(f"  p.{pg}: asterisk at line {li} x {x} has no word after it")
    stars_img = sum(1 for e in entries if e.get("star"))
    if stars_img != stars_ocr:
        log(f"  p.{pg}: {stars_img} asterisks on the image, {stars_ocr} in C's OCR")
    # A number the OCR read as a word of its own, where the image shows a
    # raised number, is that raised number: it goes to the word before, and
    # any stop after it is kept there.
    kept = []
    for e in entries:
        main = next(f for f in e["forms"] if f is not None)
        if e.get("num") and not is_word(main) and kept:
            prev = kept[-1]
            prev["num"] = prev.get("num", 0) + e["num"]
            prev["after"] = prev.get("after", "") + re.sub(r"[^.,;:]", "", main)
            continue
        kept.append(e)
    return [resolve(e, pg) for e in kept]


def number_raised(words):
    """{R} is numbered 1, 2, 3 ... through the page. Where Charles prints
    another number (he sometimes points a second passage to an earlier note,
    as 'snow³' on p. 2, pointing back to note 3), the fix writes it, {R3}, and
    the count goes on unchanged."""
    n = 0
    out = []
    for w in words:
        while "{R" in w:
            m = re.search(r"\{R(\d*)\}", w)
            if m.group(1):
                num = m.group(1)
            else:
                n += 1
                num = str(n)
            w = w[: m.start()] + num.translate(SUP) + w[m.end() :]
        out.append(w)
    return out, n


# ---------------------------------------------------------------------------
# THE HAND FIXES
# ---------------------------------------------------------------------------

# FIXES: (page, the words before, what the vote gave, what the page image of
# the Cornell copy shows, kind). The kinds: "ocr" (a misread word or mark),
# "sign" (an asterisk or a raised note number put in, taken out or moved, or
# a bracket), "spacing", "note" (lines of the notes, or the running head, that
# the page split took for text, or text it cut off), "type" (the opening word
# set in small capitals, 'THERE', written as an ordinary word). A raised number is
# written {R}: they are numbered afterwards, 1, 2, 3 ... on each page. The
# words before are as the vote gave them, so that each fix is found exactly
# once in its page.
FIXES = [
# FIXES-BEGIN
    (1, 'WISE AND BELOVED OF', 'GOD’.]', 'GOD{R}.', 'sign'),
    (1, 'OF GOD’.]', '*Concerning', '[*Concerning', 'sign'),
    (1, 'Dream of Enoch{R}.]', 'THERE', 'There', 'type'),
    (1, 'THERE was', 'avery{R}', 'a very{R}', 'spacing'),
    (1, 'the wise, great,', 'incon сета е', 'inconceivable', 'ocr'),
    (1, 'the immeasurable world.', 'J.', 'I.', 'ocr'),
    (2, '*their hands whiter than', 'snow{R}.', 'snow{R3}.', 'sign'),
    (3, '', 'g.', '9.', 'ocr'),
    (3, 'not know whither', 'Iam', 'I am', 'spacing'),
    (5, 'round all (the stars) as they', 'float{R}.', 'float{R1}.', 'sign'),
    (5, '*and they shut and open', 'them{R}.', 'them{R10}.', 'sign'),
    (5, 'into the second', 'Heaven{R},]', 'Heaven{R}.]', 'ocr'),
    (6, 'reserved for (and)', 'awaiting{R}', 'awaiting{R3}', 'sign'),
    (6, 'than the darkness of the', 'еа{R}.', 'earth{R3}.', 'ocr'),
    (6, 'are these men', 'continually{R}', 'continually{R3}', 'sign'),
    (6, 'man of God!', '*pray-for', '*pray for', 'ocr'),
    (6, '*pray-for us to the', 'Lord{R},', 'Lord{R}.”', 'ocr'),
    (6, 'answered{R} them:', '‘“Who', '“Who', 'ocr'),
    (7, 'or who prays *for', 'me{R}.', 'me{R}?”.’', 'ocr'),
    (7, 'prays *for me{R}.', '*Of', '[*Of', 'sign'),
    (7, 'the midst of a', 'garden{R} *— a', 'garden{R}—*a', 'spacing'),
    (7, '*the goodliness of its', 'appearance{R}', 'appearance{R}.', 'ocr'),
    (7, 'their fruits ripe *and', 'fragrant{R},', 'fragrant{R6},', 'sign'),
    (7, '*excellence and sweet', 'odour{R}', 'odour{R}.', 'ocr'),
    (8, 'an olive tree always', 'distilling{R}.', 'distilling oil{R}.', 'ocr'),
    (9, 'and accomplish a', 'rightcous', 'righteous', 'ocr'),
    (9, 'who walk *without', 'blame{R}', 'blame{R4}', 'sign'),
    (9, 'and various Tortures.] X.', 'г.', '1.', 'ocr'),
    (9, 'in that place.', 'Savage{R}', 'Savage{R7}', 'sign'),
    (9, 'darkness and', 'impenetrable{R}', 'impenetrable{R7}', 'sign'),
    (9, 'is no light', 'there{R},', 'there{R7},', 'sign'),
    (10, 'a fiery river goes', 'Кота{R}', 'forth{R}.', 'ocr'),
    (10, '*thus it burns and', 'freezes{R}. And', 'freezes{R}. 3. *And', 'ocr'),
    (10, 'the prisoners are very', 'savage{R}.', 'savage{R2}.', 'sign'),
    (10, 'without pity, carrying', 'savage{R}', 'savage{R2}', 'sign'),
    (10, 'their torture was unmerciful.', '4,', '4.', 'ocr'),
    (10, 'And I said:', '*Woe{R}, woe{R}', '*‘Woe, woe{R2}!', 'sign'),
    (10, 'How terrible is this', 'place{R}', 'place{R}!’', 'ocr'),
    (11, 'boast of their', 'evil{R}', 'evil{R2}', 'sign'),
    (11, 'fornication, and', 'murder{R}.', 'murder{R2}.', 'sign'),
    (11, 'the souls of', 'wretched{R}', 'wretched{R2}', 'sign'),
    (11, 'spoiling them of their', 'possessions”,', 'possessions{R2},', 'sign'),
    (11, 'of other men’s', 'possessions,', 'possessions{R},', 'sign'),
    (11, 'neither see nor hear,', 'being{R}', 'being{R2}', 'sign'),
    (11, 'thing, made with', 'hands{R};', 'hands{R2};', 'sign'),
    (11, 'for an eternal inheritance.', '*Here', '[*Here', 'sign'),
    (12, 'a thousand', 'stars{R}', 'stars{R6}', 'sign'),
    (12, 'altogether eight', 'thousand{R}', 'thousand{R6}.', 'sign'),
    (12, 'by night one', 'thousand{R}.', 'thousand{R6}.', 'sign'),
    (12, 'before the chariot of the', 'sun{R}', 'sun{R}.', 'ocr'),
    (12, 'and light up the', 'sun{R}. 2', 'sun{R}.', 'note'),
    (12, 'Creatures of the Sun.] XII.', '3.', '1.', 'ocr'),
    (14, 'and go with', 'him’,', 'him{R},', 'sign'),
    (15, '[The Angels', 'tok', 'took', 'ocr'),
    (15, 'number of the hours,', 'dayand', 'day and', 'spacing'),
    (15, 'a quarter of one', 'stadium{R};', 'stadium{R6};', 'sign'),
    (15, 'he proceeds through all the', 'months{R}.', 'months{R6}.', 'sign'),
    (15, 'by the fifth gates', 'thirtyfive;', 'thirty-five;', 'spacing'),
    (15, 'by the sixth', 'gates{R}', 'gates{R8}', 'sign'),
    (15, 'in the course of', 'time{R}:', 'time{R6}:', 'sign'),
    (15, 'third gates during', 'thirtyfive', 'thirty-five', 'spacing'),
    (15, 'by the second gates', 'thirty-five{R}.', 'thirty-five{R10}.', 'sign'),
    (17, 'bring it to the', 'Lord{R},', 'Lord{R}.', 'ocr'),
    (17, 'his brightness to *the whole', 'то{R}.', 'world{R}.', 'ocr'),
    (19, 'of one', 'day{R},', 'day{R}.', 'ocr'),
    (19, 'making twelve months of', 'twentynine', 'twenty-nine', 'spacing'),
    (19, 'two others to', 'diminish{R}', 'diminish{R}.', 'ocr'),
    (20, 'the Angels, which cannot be', 'described.', 'described.]', 'ocr'),
    (20, 'taking up of', '‘Enoch', 'Enoch', 'ocr'),
    (22, 'their works, and their', 'great{R}', 'great{R1}', 'sign'),
    (23, 'And I said:', '‘Why{R}', '‘Why', 'sign'),
    (23, 'to the end.’', 'g.', '9.', 'ocr'),
    (23, 'sun. *They are', 'resplendent{R},', 'resplendent{R7},', 'sign'),
    (24, 'both in heaven and', 'earth{R},', 'earth{R}.', 'ocr'),
    (24, 'the seventh Heaven{R}.]', 'ХХ. г.', 'XX. 1.', 'ocr'),
    (25, 'and powers; cherubim and seraphim,', 'thrones{R}', 'thrones{R1}', 'sign'),
    (25, 'trembled *with a great', 'terror{R}.', 'terror{R1}.', 'sign'),
    (25, 'having approached', 'stood{R}', 'stood{R1}', 'sign'),
    (25, 'stood{R} on the', 'ten{R}', 'ten{R1}', 'sign'),
    (25, '*according to their rank:', 'and{R}', 'and{R1}', 'sign'),
    (26, 'and departed from him', 'invisibly.)', 'invisibly.]', 'ocr'),
    (26, 'singing *with a soft', 'voice{R}', 'voice{R6}', 'sign'),
    (26, 'face of the Lord:', '*Holy,', '*‘Holy,', 'ocr'),
    (26, 'are full of Thy', 'glory{R}', 'glory{R6}!’', 'sign'),
    (26, '*these men said unto', 'me{R}:', 'me:', 'sign'),
    (26, 'accompany thee.’', 'And{R}', 'And{R6}', 'sign'),
    (26, 'what has come upon', 'me{R},', 'me!{R}.’', 'ocr'),
    (26, 'one of His glorious', 'archangels{R},', 'archangels{R6},', 'sign'),
    (26, 'with fear *and', 'trembling{R}', 'trembling{R6}!', 'sign'),
    (28, 'proceed according to Thy', 'word{R}', 'word{R}!’', 'ocr'),
    (28, 'the Lord said to Michael:', '*Go', '‘*Go', 'ocr'),
    (28, 'raiment of My glory.’', 'g.', '9.', 'ocr'),
    (28, 'like one of His glorious', 'ones{R},', 'ones{R}.', 'ocr'),
    (28, 'And the Lord said to', 'Vretil{R},', 'Vretil{R8},', 'sign'),
    (29, 'interpret to him the', 'books{R}.', 'books{R}.’', 'ocr'),
    (29, 'gave me a reed from his', 'hand{R}', 'hand{R}.', 'ocr'),
    (29, 'the remarks{R}. 4. And', 'Vretil{R}{R}', 'Vretil{R}', 'sign'),
    (29, 'said to me:', '*All', '*‘All', 'ocr'),
    (29, 'down and *write all', 'about{R}{R}', 'about{R}', 'sign'),
    (31, 'were completed by', 'me{R}', 'me{R}.', 'ocr'),
    (31, 'what things I created from the', 'nonexistent,', 'non-existent,', 'spacing'),
    (32, 'Darkness, there comes', 'Jorth', 'forth', 'ocr'),
    (32, 'the visible and the invisible.] XXV.', '1.‘* *And', '1. ‘*And', 'sign'),
    (32, '*revealing all the', 'creation{R},', 'creation{R3},', 'sign'),
    (33, 'come forth from the', 'invisible{R}.', 'invisible{R}.’', 'ocr'),
    (33, 'very red.] XXVI.', 'т.', '1.', 'ocr'),
    (33, 'firm{R} and', 'heavy{R}', 'heavy{R3}', 'sign'),
    (33, 'And I said to him:', '*Go', '‘*Go', 'ocr'),
    (33, 'below’; and it', 'wasso. Andit', 'was so. And it', 'spacing'),
    (33, 'nothing else below the', 'darkness{R},', 'darkness{R12}.', 'sign'),
    (33, 'Seven Islands.]', 'ХХУП. г', 'XXVII. 1.', 'ocr'),
    (34, 'a thick substance,’ and it was', 'sol{R}. а. *Ж And', 'so{R}. 2. *And', 'ocr'),
    (34, 'to the light: ‘Let it be', 'day{R};', 'day{R}’;', 'ocr'),
    (34, 'the first day{R}. XXVIII. 1.', 'And{R}', '{R5}And', 'sign'),
    (35, 'it was the second', 'day{R}', 'day{R}.', 'ocr'),
    (35, 'the spiritual hosts, ten', 'thcusand', 'thousand', 'ocr'),
    (36, 'from the heights with his', 'angels, And', 'angels. And', 'ocr'),
    (36, 'continually, above the', 'abyss{R}.', 'abyss{R1}.', 'sign'),
    (38, 'how they take place{R}.', '7:', '7.', 'ocr'),
    (38, '*On the fifth day{R}', '7', '', 'note'),
    (39, 'and morning the sixth', 'day{R}.', 'day{R1}.', 'sign'),
    (39, '*On the sixth', 'day{R}', 'day{R1}', 'sign'),
    (40, 'from My spirit and from the wind.', 'g.', '9.', 'ocr'),
    (43, 'on account of his sin{R}.', '17,', '17.', 'ocr'),
    (44, 'Angels singing a Song of', 'Trinmph.] ХХХТ. г', 'Triumph.] XXXI. 1.', 'ocr'),
    (44, 'Adam had a life on', 'earth{R},...', 'earth{R}, . . .', 'spacing'),
    (45, 'to the Earth,', '‘From{R}', '‘From', 'sign'),
    (45, 'which I took', 'thee,', 'thee,’', 'ocr'),
    (47, 'lowest, *and to the', 'end{R}.', 'end{R1}.', 'sign'),
    (47, '*nor inheritor of My', 'works{R}.', 'works{R1}.', 'sign'),
    (47, 'works{R}.', 'Iam', 'I am', 'spacing'),
    (47, '*if I look to all', 'things{R}', 'things{R3}', 'sign'),
    (47, 'fast{R}.', 'IfI', 'If I', 'spacing'),
    (47, 'brought thee *to', 'Me{R}', 'Me{R3}.', 'sign'),
    (48, 'from the lowest heaven up to My throne.', '4.', '7.', 'ocr'),
    (48, 'God beside Me{R}.', 'g.', '9.', 'ocr'),
    (48, 'Jared, thy father{R}.', 'It.', '11.', 'ocr'),
    (48, 'upon the earth as their guardians.', '12,', '12.', 'ocr'),
    (49, 'the Workers of', 'Inigquity,', 'Iniquity,', 'ocr'),
    (49, 'brings the Deluge upon', 'them.]]', 'them.]', 'ocr'),
    (49, 'God according to His', 'Will.', 'Will.]', 'ocr'),
    (50, 'these, many will', 'be{R}', 'be{R1}', 'sign'),
    (50, 'take My name in', 'vain{R}.', 'vain{R1}.', 'sign'),
    (50, 'these *having read', 'them{R},', 'them{R1},', 'sign'),
    (50, 'the books written out by', 'thee{R}', 'thee{R6}.', 'sign'),
    (51, '*terrible and', 'ам{R},', 'awful{R},', 'ocr'),
    (51, 'no man can look upon thy', 'face{R}.]', 'face{R}.’]', 'ocr'),
    (51, 'his Bed, Day and', 'Night.) XXXVIII{R}..', 'Night.] XXXVIII. 1{R}.', 'ocr'),
    (52, 'a sign for you{R}.', '*ЖТ', '*I', 'ocr'),
    (52, 'the right hand of a', 'man{R}', 'man{R3}', 'sign'),
    (52, 'And now, *my', 'children{R},', 'children{R3},', 'sign'),
    (52, 'your earthly', 'father{R}.', 'father{R3}.', 'sign'),
    (52, 'of an earthly', 'prince — terrible and very awful{R}', 'prince—*terrible and very awful{R3}', 'sign'),
    (54, 'and *the rain-drops, I investigated all.', 'g.', '9.', 'ocr'),
    (54, 'down the course of', 'the{R}', 'the{R7}', 'sign'),
    (54, 'thunder *and', 'lightning{R},', 'lightning{R7},', 'sign'),
    (54, 'are let go in', 'bonds{R},', 'bonds{R1},', 'sign'),
    (54, 'and the cool breezes.', 'And', '*And', 'sign'),
    (54, '*and I observed and', 'saw{R}', 'saw{R7}', 'sign'),
    (54, 'and measures, and in', '‘the', 'the', 'ocr'),
    (54, 'in measure *moderately, with', 'care{R}', 'care{R7}', 'sign'),
    (55, 'and down to the lowest', 'hell{R},', 'hell{R1},', 'sign'),
    (55, 'lamentation. And I saw', 'how{R}', 'how{R1}', 'sign'),
    (55, 'and all their', 'deeds{R}.', 'deeds{R1}.', 'sign'),
    (56, 'the beginning with Adam and', 'Ете{R},', 'Eve{R},', 'ocr'),
    (56, 'infirmity and that of my', 'forefathers{R}.', 'forefathers{R1}.', 'sign'),
    (56, '2. And', '*T', '*I', 'ocr'),
    (57, 'stripped to the', 'waist{R},', 'waist{R}.', 'ocr'),
    (57, 'had never come to', 'you{R}', 'you{R}!', 'ocr'),
    (57, 'suffer in the eternal', 'life{R}.', 'life{R}.’', 'ocr'),
    (57, 'before the dwelling of that', 'man{R},', 'man{R7},', 'sign'),
    (58, 'shall afterwards come to', 'him{R}.', 'him{R3}.', 'sign'),
    (58, 'leads to eternal', 'life{R}.', 'life{R3}.', 'sign'),
    (59, 'the Judgements of God.]', 'XLII. 1,', 'XLIII. 1.', 'ocr'),
    (60, 'Blessed is the man who', 'does', '*does', 'sign'),
    (60, 'assists the man who is', '*injnred,', '*injured,', 'ocr'),
    (60, 'the prayer of him who', 'asks{R}', 'asks{R}!', 'ocr'),
    (61, 'nor any other sacrifice{R},', '*Ж for', '*for', 'ocr'),
    (61, 'God requires a pure', 'heart{R},', 'heart{R4},', 'sign'),
    (62, 'his unrighteousness will be evident to', 'all{R}', 'all{R}?', 'ocr'),
    (63, 'are not fixed{R}. Who has', 'ereated', 'created', 'ocr'),
    (63, 'breath of the', 'wind{R}', 'wind{R}?', 'ocr'),
    (63, 'midst of them *so', 'that{R}.', 'that{R11}.', 'sign'),
    (64, 'the seventeenth day of', 'Thevad{R}', 'Thevad{R4}', 'sign'),
    (64, 'all the courses of the', 'heaven{R};', 'heaven{R3};', 'sign'),
    (65, 'XLIX. 1.', 'For{R}', 'For{R5}', 'sign'),
    (66, 'my children, be not', 'deceived{R}', 'deceived{R1}', 'sign'),
    (66, 'there for every soul of', 'шап{R}.', 'man{R}.', 'ocr'),
    (66, 'L. 1.', 'Ihave', 'I have', 'spacing'),
    (66, 'the actions of every man,', '“*and', '*and', 'ocr'),
    (68, '', '68 The Book of Ше Secrets of Enoch.', '', 'ocr'),
    (68, 'endure all for the', 'Lord’s{R} sake{R},', 'Lord’s sake{R},', 'sign'),
    (68, '*the Creator of all{R}. 5.', 'Wherefore', 'Wherefore{R}', 'sign'),
    (68, 'how they are to praise', 'Ив Name.] LIT.', 'His Name.] LII.', 'ocr'),
    (69, 'the beginning{R}.', 'то.', '10.', 'ocr'),
    (69, 'peace and', 'love{R},', 'love{R}.', 'ocr'),
    (69, 'there is peace to', 'all{R}', 'all{R}!', 'ocr'),
    (69, 'and will plead', 'Jor', 'for', 'ocr'),
    (69, 'us at the Day of', 'Judgement,', 'Judgement.', 'ocr'),
    (69, 'a Son a Father.] LIII.', 'т.', '1.', 'ocr'),
    (70, 'any man who has', 'sinned{R},', 'sinned{R}.', 'ocr'),
    (70, 'works of every man', 'before his creation{R},', '*before his creation{R2},', 'sign'),
    (70, 'his creation{R},', '*which{R}', '*which is{R3}', 'ocr'),
    (70, 'all men for', 'ever{R}.', 'ever{R2}.', 'sign'),
    (70, 'And no man', 'can', '*can', 'sign'),
    (70, 'say or', 'unsay{R}', 'unsay{R4}', 'sign'),
    (70, 'the thoughts of wicked', 'men{R},', 'men{R5},', 'sign'),
    (70, 'storeplaces of the', 'heart{R}.', 'heart{R2}.', 'sign'),
    (71, 'I should go to', 'Heaven, Lo!', 'Heaven. Lo!', 'ocr'),
    (71, 'Angels stand before', 'me!”]', 'me!’]', 'ocr'),
    (71, 'constrain me to', 'depart{R},', 'depart{R}.', 'ocr'),
    (71, 'his father Enoch', 'said{R};', 'said{R}:', 'ocr'),
    (71, 'in thine eyes,', '*my *father{R}, let', '*my father{R}, *let', 'sign'),
    (72, '*as God hath', 'said{R},', 'said{R}.’', 'ocr'),
    (72, 'there has been', 'no{R}', 'no{R2}', 'sign'),
    (72, 'desire *anything', 'earthly{R}', 'earthly{R}.', 'ocr'),
    (72, 'call all his Brothers.]', 'ТУП.', 'LVII.', 'ocr'),
    (72, '*as is appointed for', 'те{R}.', 'me{R8}.', 'ocr'),
    (72, 'Ukhan{R}, Khermion,', '[Gaidal and{R}{R}', '[Gaidal{R8}], and{R}', 'sign'),
    (72, 'Enoch to his Sons.]', 'ТУШ.', 'LVIII.', 'ocr'),
    (73, 'air{R}, and brought them', 'all{R}', 'all{R1}', 'sign'),
    (76, 'neither with Weapon nor with', 'Tongue{R}.', 'Tongue{R}.]', 'ocr'),
    (76, 'do to every living', 'soul{R},', 'soul{R}.', 'ocr'),
    (76, '*For in the world to', 'come{R},', 'come{R2},', 'sign'),
    (77, 'he has no success.', '(Шош', '[How', 'ocr'),
    (77, 'no Repentance after Death.] LXII.', 'г.', '1.', 'ocr'),
    (77, 'the Lord of his', 'labours — if', 'labours—if', 'spacing'),
    (78, 'the recompense of his sin. 2.', 'If', '*If', 'sign'),
    (78, 'which a man does', '*unseasonably{R}', '*unseasonably is{R}', 'ocr'),
    (78, 'into the fire, and burns for', 'ever И{R}.', 'ever{R}.', 'ocr'),
    (79, 'men assembled to the number', 'of{R},', 'of 2000{R},', 'ocr'),
    (79, 'Enoch, and said to him:', '*Enoch, our father{R};', '‘*Enoch, our father{R9};', 'sign'),
    (79, '*sons, and all', 'the{R}', 'the{R9}', 'sign'),
    (79, 'For thou art', 'glorified{R}', 'glorified{R9}', 'sign'),
    (79, 'face of the Lord *for', 'ever{R};', 'ever{R1};', 'sign'),
    (79, 'and has appointed', 'thee{R}', 'thee{R9}', 'sign'),
    (79, 'visible and invisible things,', 'ап{R}', 'and{R9}', 'ocr'),
    (79, 'a succour to thy', 'family{R}', 'family{R9}!’', 'sign'),
    (79, 'answered all his people', 'saying{R}:', 'saying{R9}:', 'sign'),
    (80, 'image *after', 'His{R}', 'His{R1}', 'sign'),
    (80, 'and made all the', '*creation for', 'creation *for', 'sign'),
    (80, 'his sake{R}, and', '*divided it', 'divided *it', 'sign'),
    (80, 'divided them into small', 'portions{R},', 'portions{R1},', 'sign'),
    (80, 'from generation to', 'generation{R}.', 'generation{R1}.', 'sign'),
    (81, 'and they shall be', 'eternal{R}..', 'eternal{R}.', 'ocr'),
    (81, 'but a great{R} light.', 'to.', '10.', 'ocr'),
    (81, 'cannot be broken', 'down{R};', 'down{R2};', 'sign'),
    (81, 'bright{R} *and', 'incorruptible{R}', 'incorruptible{R2}', 'sign'),
    (81, 'corruptible things shall', 'vanish{R},', 'vanish{R2},', 'sign'),
    (82, 'in long suffering, in', 'humility в{R},', 'humility{R},', 'ocr'),
    (82, 'who shall escape the great', 'judgement{R}', 'judgement{R}!', 'ocr'),
    (83, 'was Light in the Heavens.]', 'ЪХУП.', 'LXVII.', 'ocr'),
    (83, 'sixth day of the month', 'Tsivan{R}', 'Tsivan{R}!', 'ocr'),
    (84, 'on the *same day', 'the{R}', 'the{R2}', 'sign'),
    (84, 'departure from this', 'life, In', 'life. In', 'ocr'),
    (84, 'Methusalem hasted, and', 'all{R}', 'all{R5}', 'sign'),
    (84, 'was taken up *to', 'heaven{R}.', 'heaven{R5}.', 'sign'),
    (84, 'for ever.', 'Amen{R}.', 'Amen{R5}.', 'sign'),
    (65, 'await them{R}.', 'g.', '9.', 'ocr'),
# FIXES-END
]


def apply_fixes(pages):
    todo = {}
    for n, (pg, ctx, old, new, _kind) in enumerate(FIXES):
        words = pages[pg]
        c, o = ctx.split(), old.split()
        hits = [i for i in range(len(words) - len(c) - len(o) + 1) if words[i : i + len(c) + len(o)] == c + o]
        if not c and len(hits) > 1:
            hits = [h for h in hits if h == 0]
        assert len(hits) == 1, ("FIXES entry not found exactly once", n, pg, ctx, old, len(hits))
        todo.setdefault(pg, []).append((hits[0] + len(c), len(o), new.split()))
    for pg, edits in todo.items():
        edits.sort(reverse=True)
        p = pages[pg]
        last = len(p) + 1
        for at, ln, new in edits:
            assert at + ln <= last, ("FIXES entries overlap", pg, at)
            last = at
            p[at : at + ln] = new
    kinds = Counter(f[4] for f in FIXES)
    log(f"{len(FIXES)} hand fixes: " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))


# ---------------------------------------------------------------------------
# CHAPTERS AND VERSES
# ---------------------------------------------------------------------------

ROMAN = {"I": 1, "V": 5, "X": 10, "L": 50}


def roman(s):
    n = 0
    for a, b in zip(s, s[1:] + " "):
        v = ROMAN[a]
        n += -v if b != " " and ROMAN[b] > v else v
    return n


CHAPTER = re.compile(r"(\[?)([IVXL]+)\.")
VERSE = re.compile(r"(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)\.")
# (a comma too: xxxi. 7-8 is printed 'curse⁴,  8. nor man')
STOPPED = re.compile(r"([.,;:!?’”\])][⁰¹²³⁴⁵⁶⁷⁸⁹]*|[⁰¹²³⁴⁵⁶⁷⁸⁹])$")

# Bracketed words in the text that are not one of A's chapter titles: Charles
# prints them in roman type within the verse, as words he holds to be a later
# addition (the titles are in italic, on lines of their own).
INLINE_BRACKETS = ("[Thus the great circle", "[Gaidal")

# xxii begins at verse 4 in Charles's text (p. 27).
FIRST_VERSE = {22: 4}


def split(pages):
    """The heading, the prologue and the verses, from the numbered words of
    pp. 1-84. A's chapter titles (in [ ]) go with the verse they stand
    before."""
    words = [(pg, w) for pg in sorted(pages) for w in pages[pg]]
    i = 0
    heading = []
    while not words[i][1].startswith("["):
        heading.append(words[i][1])
        i += 1
    units = []
    prologue = None
    cur = None
    title = None
    chapter, verse = 0, 0

    def start(ch, vs, pg, lead):
        nonlocal cur, title
        cur = {"chapter": str(ch), "verse": str(vs), "firstPage": str(pg), "lastPage": str(pg), "words": [lead] if lead else []}
        if title:
            cur["title"] = title
            title = None
        units.append(cur)

    while i < len(words):
        pg, w = words[i]
        ahead = " ".join(x for _, x in words[i : i + 4])
        if w.startswith("[") and not CHAPTER.fullmatch(w) and not ahead.startswith(INLINE_BRACKETS):
            j = i
            while "]" not in words[j][1]:
                j += 1
            nxt = words[j + 1][1] if j + 1 < len(words) else ""
            m = VERSE.fullmatch(nxt)
            if CHAPTER.fullmatch(nxt) or (m and int(m.group(1)) == verse + 1) or chapter == 0:
                title = " ".join(x for _, x in words[i : j + 1])
                i = j + 1
                continue
        m = CHAPTER.fullmatch(w)
        if m and roman(m.group(2)) == chapter + 1:
            chapter += 1
            v = VERSE.fullmatch(words[i + 1][1])
            if v:
                verse = int(v.group(1))
                start(chapter, verse, pg, m.group(1) + v.group(2))
                i += 2
            else:  # LIV has no verse number: it is one verse
                verse = 1
                start(chapter, verse, pg, m.group(1))
                i += 1
            continue
        m = VERSE.fullmatch(w)
        if m and cur and int(m.group(1)) == verse + 1 and STOPPED.search(cur["words"][-1] if cur["words"] else "."):
            verse += 1
            start(chapter, verse, pg, m.group(2))
            i += 1
            continue
        if chapter == 0:
            if prologue is None:
                prologue = {"title": title, "firstPage": str(pg), "lastPage": str(pg), "words": []}
                title = None
            prologue["words"].append(w)
            prologue["lastPage"] = str(pg)
        else:
            cur["words"].append(w)
            cur["lastPage"] = str(pg)
        i += 1
    for u in units + [prologue]:
        # a raised note number on the verse number itself (xxxviii. 1⁷) is
        # kept at the head of the verse, as is the [ of a bracketed chapter
        u["text"] = re.sub(r"^([⁰¹²³⁴⁵⁶⁷⁸⁹\[]+) ", r"\1", " ".join(u.pop("words")).strip())
    return " ".join(heading), prologue, units


def check_units(units):
    """Every chapter I-LXVIII is there, its verses run on without a gap, no
    verse number is left inside a verse, and no stray letter or mark is
    left."""
    assert sorted({int(u["chapter"]) for u in units}) == list(range(1, 69)), "a chapter is missing"
    for ch in range(1, 69):
        vs = [int(u["verse"]) for u in units if u["chapter"] == str(ch)]
        first = FIRST_VERSE.get(ch, 1)
        assert vs == list(range(first, first + len(vs))), ("verses do not run on", ch, vs)
    for u in units:
        for m in re.finditer(r"(?:^|[.;:!?’”\]] )(\d+)\. ", u["text"]):
            log(f"  a number inside {u['chapter']}.{u['verse']}: {m.group(0)!r}")
        assert not re.search(r"[А-яЁёΑ-ωἀ-ῼ{}_|]", u["text"] + u.get("title", "")), ("a stray letter or mark", u)


# ---------------------------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------------------------


def write(heading, prologue, units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/secrets-of-enoch.py from the archive.org OCR of\n")
    w("// three scans of W. R. Morfill and R. H. Charles, The Book of the Secrets of\n")
    w("// Enoch (Oxford, 1896), voted and then read against the page images of the\n")
    w("// Cornell copy. Do not edit by hand: correct the generator (its FIXES list\n")
    w("// holds every correction made by hand) and run it again.\n\n")
    w("export type SecretsOfEnochUnit = {\n")
    w("  /** Charles's chapter, '1' to '68' (his I. to LXVIII.). */\n  chapter: string;\n")
    w("  /** Charles's verse; LIV, printed without verse numbers, is one verse, '1'; xxii begins at '4'. */\n  verse: string;\n")
    w("  /** The printed pages of Charles (1896) the verse runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The chapter title of manuscript A that Charles prints before this verse, in [ ], when there is one. */\n  title?: string;\n")
    w("  /** The verse as printed, with Charles's signs kept: * (opening words that a critical note covers), the raised note numbers, [ ] and ( ). */\n  text: string;\n};\n\n")
    w(f"export const SECRETS_OF_ENOCH_HEADING = {json.dumps(heading, ensure_ascii=False)};\n\n")
    w("/** The opening before chapter I (Charles's notes call it the Introduction; B lacks it). */\n")
    w("export const SECRETS_OF_ENOCH_PROLOGUE = {\n")
    for k in ("title", "firstPage", "lastPage", "text"):
        w(f"  {k}: {json.dumps(prologue[k], ensure_ascii=False)},\n")
    w("};\n\n")
    w("export const SECRETS_OF_ENOCH_UNITS: SecretsOfEnochUnit[] = [\n")
    for u in units:
        t = f", title: {json.dumps(u['title'], ensure_ascii=False)}" if u.get("title") else ""
        w(f"  {{ chapter: {json.dumps(u['chapter'])}, verse: {json.dumps(u['verse'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}{t}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n")


TAKEN_COUNT = 187


def main():
    d = sys.argv[1]
    images = sys.argv[2]
    both = {n: scan_pages(os.path.join(d, f"{n}_djvu.xml")) for n in SIGLA}
    scans = {n: both[n][0] for n in SIGLA}
    pages = {}
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        toks = {n: attach(raw_tokens(scans[n][pg])) for n in SIGLA}
        entries = vote_page(pg, toks)
        pages[pg] = apply_signs(pg, entries, scans["C"][pg], os.path.join(images, f"p{pg:03d}.jpg"))
    log(f"{len(TAKEN)} readings taken; {len(DIFFERED)} places where W or G differ and C is kept")
    log(f"{len(MISSED)} words where two scans suggest a raised number the image did not show:")
    for m in MISSED:
        log(f"  MISSED? p.{m[0]} {m[1]} {m[2]}")
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    if os.environ.get("DUMP"):
        with open(os.environ["DUMP"], "w") as f:
            for pg in sorted(pages):
                words, n = number_raised(list(pages[pg]))
                f.write(f"=== p.{pg} ({n} raised)\n{' '.join(words)}\n")
    apply_fixes(pages)
    for pg in pages:
        pages[pg] = number_raised(pages[pg])[0]
    heading, prologue, units = split(pages)
    check_units(units)
    log(f"{len(units)} verses in {len({u['chapter'] for u in units})} chapters; {sum(1 for u in units if u.get('title'))} titles")
    write(heading, prologue, units)


if __name__ == "__main__":
    main()
