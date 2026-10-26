"""The Turba Philosophorum ("The Assembly of the Philosophers") in the English
of A. E. Waite: The Turba Philosophorum, or Assembly of the Sages, called also
the Book of Truth in the Art and the Third Pythagorical Synod. An ancient
alchemical treatise translated from the Latin, the chief readings of the
shorter codex, parallels from the Greek alchemists, and explanations of
obscure terms, by Arthur Edward Waite (London: George Redway, 1896), pp.
1-207, for the texts archive (Stage 25) ->
src/lib/timeline/texts/corpus/turba-philosophorum-text.ts.

Run:  python3 -I scripts/texts/turba-philosophorum.py DIR IMAGES > \
          src/lib/timeline/texts/corpus/turba-philosophorum-text.ts
(the report goes to stderr; DUMP=path also writes the voted text, page by
page, before the hand fixes; DIFFS=path writes every place where the voted
text and the transcription differ). IMAGES holds the page images of the
Cornell copy, p001.jpg ... p207.jpg, from
https://archive.org/download/cu31924012366088/page/n{page+13}.jpg (1218 x 1940
pixels). DIR holds the inputs; everything was fetched with the User-Agent
"relate-archive-research (repo Oshioma/relate)":

  C_djvu.xml  https://archive.org/download/cu31924012366088/cu31924012366088_djvu.xml
              (Cornell University Library copy, the gift of C. W. Snoad)
  R_djvu.xml  https://archive.org/download/alchemyturbaphil00waitrich/alchemyturbaphil00waitrich_djvu.xml
              (University of California Libraries copy)
  L_djvu.xml  https://archive.org/download/turbaphilosophor00gratiala/turbaphilosophor00gratiala_djvu.xml
              (a second University of California Libraries copy)
  AW1.html, AW2.html  https://www.alchemywebsite.com/turba.html and turba2.html
              (Adam McLean's transcription of Waite's text on the Alchemy Web
              Site, without Waite's notes; the fourth witness)
Printed page = leaf - 13 in C and leaf - 12 in R and L (the leaf is the
number in each page's djvu file name; checked on the running heads).

WHY THESE WITNESSES. Three archive.org scans of the one printing, OCRed
separately, and one independent transcription. sacred-texts.com answered 403
to this client and Wikisource answered 429, so neither was read.

METHOD.
1. Lines. The words of each page (djvu.xml) are grouped into visual lines by
   their vertical middle; a drop capital's word (p. 1, ARISLEUS) is put on the
   line its top is level with. The running head (page number and "The Turba
   Philosophorum") is dropped. The text ends at the first line set clearly
   smaller than the text (under 0.8 of the text's line height) that is
   followed by another such line, or is the last, or stands after a gap:
   Waite's notes, set smaller below a rule, follow the text on most pages. A
   printer's signature at the foot (B, B 2 ...) is dropped.
2. Tokens. Words broken over a line with a hyphen are joined (the hyphen is
   kept only where the transcription keeps it, as in co-adunation); a token
   with no letters is attached to its neighbour.
3. The vote. Per page, C is the base; R and L are aligned with it by their
   letters. Where R and L agree with each other against C, R's reading is
   taken (TAKEN_COUNT of them). Where all three differ, C is kept and the page
   image decided (step 6).
4. Waite's note marks. Waite's notes are not imported, so the marks in the
   text that point to them (*, the dagger, the double dagger, the section
   sign, || and the paragraph sign; the OCR reads them as * • t f J I X } § %
   and the like) are dropped: a mark after a word's last letter, or after its
   punctuation, and a token of one such character standing alone where the
   transcription has no word. The marks dropped on each page are counted and
   compared with the notes that begin on that page (a note begins on a line
   indented beyond the notes' margin); a page where the counts differ is
   logged and was looked at.
5. The fourth witness. The voted text is aligned with the transcription,
   dictum by dictum; every place where they differ in letters or in
   punctuation (case and spacing aside) is written to DIFFS, and every one of
   them was decided on the page image of the Cornell copy (step 6).
6. Proofreading. Every page, 1 to 207, was read against the page images of
   the Cornell copy. The differences are the FIXES list below, each with its
   kind.
7. Typography. Speakers' names set in capitals and small capitals
   (IXIMIDRUS, TURBA) and the drop capital (ARISLEUS) are written in ordinary
   capitals and lower case; Waite's italic is not marked; a space before
   : ; ! ? (the printer's French spacing) is closed up, and the dash after a
   colon (":—") is kept. The text is one block per Dictum: Waite runs the
   dialogue on (The TURBA answereth :— ... And he : ...) without new
   paragraphs. Waite's square brackets, which enclose his own alternative
   renderings and supplied words ('the things [or the copper]'), are kept.

THE BOOK. Waite translates the longer of the two Latin recensions, as printed
in the collections (his Preface names the Theatrum Chemicum, Manget's
Bibliotheca Chemica Curiosa and the Artis Auriferae), and gives "the chief
readings of the shorter codex", the second recension, in his notes; where the
longer text was "so corrupt as to be quite untranslatable" he "occasionally
substituted that of the alternative version" and "in most cases indicated the
course pursued" (Preface, pp. i-ii). The second recension is not printed as a
text of its own, except its last Dictum, which Waite prints after the
Seventy-Second as the Conclusion (Agmon's speech, pp. 206-207: "This
constitutes the last Dictum in the second recension, and is omitted from the
longer version").

IMPORTED. The book's heading (p. 1), the Epistle of Arisleus (pp. 1-3), the
seventy-two Dicta (pp. 3-206) and the Conclusion (pp. 206-207).

NOT IMPORTED. The title page and Preface (pp. i-iv); Waite's notes at the foot
of the pages (the readings of the second recension, the French version of
Salmon, parallels from Berthelot's Greek alchemists, explanations of obscure
terms and his own comments); the Index (pp. 209-210).
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


FIRST_PAGE, LAST_PAGE = 1, 207
LEAF_OFFSET = {"C": 13, "R": 12, "L": 12}
SIGLA = ("C", "R", "L")

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
    {"h": median word height, "mid": middle, "w": words sorted by x}. A word
    much taller than the text (a drop capital's) is placed by its top."""
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


HEAD = re.compile(r"Turb|Tiirb|Phil|^\W*[\dio]{1,3}\W*$|^[\w\s.,]{0,5}$")
SIGNATURE = re.compile(r"^[A-Z]{1,2}( ?[0-9])?$")


def text_lines(page, H, pg):
    """The lines of the text, and the lines of the notes below it."""
    ph, lines = page
    i = 0
    if pg != 1:
        while i < len(lines) and i < 2 and HEAD.search(lines[i]["text"]) and lines[i]["mid"] < lines[0]["mid"] + 1.5 * H:
            i += 1
    body = [l for l in lines[i:] if l["h"] >= 0.45 * H]
    small = [l["h"] < 0.8 * H for l in body]
    end = len(body)
    # p. 1: the heading and the Epistle's rubric, set smaller, are text
    first = next((j + 1 for j, l in enumerate(body) if "follows" in l["text"]), 0) if pg == 1 else 0
    for j in range(first, len(body)):
        gap = body[j]["mid"] - body[j - 1]["mid"] if j else 0
        if small[j] and (j + 1 == len(body) or small[j + 1] or gap > 2.2 * H):
            end = j
            break
    text, notes = body[:end], body[end:]
    while text and SIGNATURE.match(text[-1]["text"].strip()):
        text = text[:-1]
    while notes and SIGNATURE.match(notes[-1]["text"].strip()):
        notes = notes[:-1]
    return text, notes


def scan_pages(path, siglum):
    """{page: text lines}, {page: the lines of the notes below the text}."""
    ps = xml_pages(path, LEAF_OFFSET[siglum])
    pages = [ps[pg] for pg in range(FIRST_PAGE, LAST_PAGE + 1)]
    ph = statistics.median(p[0] for p in pages)
    H = statistics.median(l["h"] for p in pages[2:] if p[0] == ph for l in p[1][2:6])
    split = {pg: text_lines(ps[pg], H, pg) for pg in range(FIRST_PAGE, LAST_PAGE + 1)}
    return {pg: s[0] for pg, s in split.items()}, {pg: s[1] for pg, s in split.items()}


def note_starts(notes, text):
    """How many of Waite's notes begin among these note lines: a note begins
    on a line set in from the left margin, which the notes share with the
    text."""
    if not notes or not text:
        return 0
    margin = statistics.median(l["x0"] for l in text)
    starts = 0
    for l in notes:
        first = l["w"][0][4]
        if l["x0"] > margin + 35 and re.match(r"^([*•■§¶+%|}tfJIX]{1,2}$|[*•■§¶+%|}tfJX][A-Z“\"])", first):
            starts += 1
    return starts


def indented_lines(image_path, lines):
    """The text lines of a page image that begin a paragraph: those whose ink
    begins well to the right of the page's left margin (method step 7)."""
    import numpy as np
    from PIL import Image

    im = np.array(Image.open(image_path).convert("L")) < 140
    starts = []
    for ln in lines:
        y0 = int(ln["mid"] - 0.45 * ln["h"])
        y1 = int(ln["mid"] + 0.35 * ln["h"])
        band = im[max(0, y0) : y1, 60 : im.shape[1] // 2].sum(axis=0)
        cols = np.where(band > 1)[0]
        starts.append(60 + int(cols[0]) if len(cols) else None)
    xs = [x for x in starts if x is not None]
    if not xs:
        return set()
    margin = statistics.median(xs)
    return {i for i, x in enumerate(starts) if x is not None and x > margin + 30}


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
    """[text, joined-from-a-hyphen] tokens; a word broken over two lines is joined."""
    toks = []
    for li, ln in enumerate(lines):
        for w in ln["w"]:
            for part in w[4].replace("—", " — ").replace("­", "").split():
                toks.append([part, li, None])
    out = []
    for t in toks:
        if out and out[-1][1] != t[1] and re.search(r"[A-Za-z][-¬]$", out[-1][0]) and re.match(r"[a-z]", t[0]):
            out[-1][2] = out[-1][0][:-1] + "-" + t[0]  # the hyphenated form, if the hyphen is to stay
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
        # a note mark the OCR read as a letter, standing apart: ':t', '.J', 'f'
        if re.fullmatch(r"[.,;:!?]*[tfJX}][.,;:!?]*", t) and out:
            out[-1][0] += "\u2020" + t if not re.match(r"[.,;:!?]", t) else t
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
DIFFERED = []


def vote_page(pg, toks):
    """A list of {"forms": (C, R, L), "hy": hyphenated form or None} per word.
    A witness that does not align one to one has None."""
    base = toks["C"]
    bk = [key(t[0]) for t in base]
    others = ("R", "L")
    ks = {n: [key(t[0]) for t in toks[n]] for n in others}
    ats = {n: anchors(bk, ks[n]) for n in others}
    bounds = [b for b in range(len(base) + 1) if all(ats[n][b] is not None for n in others)]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = base[b1:b2]
        rd = {n: toks[n][ats[n][b1] : ats[n][b2]] for n in others}
        segk = "".join(bk[b1:b2])
        rk = {n: "".join(ks[n][ats[n][b1] : ats[n][b2]]) for n in others}
        ctx = " ".join(t[0] for t in base[max(0, b1 - 5) : b1])
        if rk["R"] == rk["L"] and rk["R"] != segk and abs(len(rd["R"]) - len(seg)) <= 2:
            TAKEN.append((pg, ctx, " ".join(t[0] for t in seg), " ".join(t[0] for t in rd["R"])))
            log(f"  TAKEN p.{pg} (R+L): ...{ctx} [{' '.join(t[0] for t in seg)}] -> [{' '.join(t[0] for t in rd['R'])}]")
            n = len(rd["R"])
            lcol = rd["L"] if len(rd["L"]) == n else [None] * n
            for i in range(n):
                out.append({"forms": (None, rd["R"][i][0], lcol[i][0] if lcol[i] else None), "hy": rd["R"][i][2], "line": seg[min(i, len(seg) - 1)][1] if seg else None})
            continue
        if any(rk[n] != segk for n in others):
            DIFFERED.append((pg, ctx))
            log(f"  differ p.{pg}, C kept: ...{ctx} C[{' '.join(t[0] for t in seg)}] R[{' '.join(t[0] for t in rd['R'])}] L[{' '.join(t[0] for t in rd['L'])}]")
        cols = {n: [t[0] for t in rd[n]] if len(rd[n]) == len(seg) else [None] * len(seg) for n in others}
        for i, t in enumerate(seg):
            out.append({"forms": (t[0], cols["R"][i], cols["L"][i]), "hy": t[2], "line": t[1]})
    return out


# ---------------------------------------------------------------------------
# WAITE'S NOTE MARKS (method step 4)
# ---------------------------------------------------------------------------

# What the OCR makes of *, †, ‡, §, || and ¶ standing alone.
MARK_ALONE = re.compile(r"^[*•■♦°^®™%§¶|}{\]\[tfJIXl+!1]+$")
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
        # a mark read as a letter after the word's punctuation: 'said:t',
        # 'Beak.J', or standing apart and attached here (marked with a dagger)
        mm = re.match(r"^(.*?[A-Za-z])([.,;:!?)\]]*)\u2020([.,;:!?]*[tfJX}][.,;:!?]*)$", core) or re.match(r"^(.*?[A-Za-z])([.,;:!?)\]]+)([tfJIX}]{1,2})$", core)
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
        words.append({"w": w, "hy": e["hy"], "line": e["line"]})
    return words, marks


# ---------------------------------------------------------------------------
# THE TRANSCRIPTION (method step 5)
# ---------------------------------------------------------------------------


def transcription(d):
    out = []
    for name, first in (("AW1.html", "The Epistle of Arisleus"), ("AW2.html", "The Twenty-Sixth Dictum")):
        t = open(os.path.join(d, name), encoding="latin-1").read()
        t = re.sub(r"(?is)<script.*?</script>|<style.*?</style>", " ", t)
        t = re.sub(r"(?i)<br\s*/?>|</p>|<p[^>]*>", "\n", t)
        s = html.unescape(re.sub(r"<[^>]+>", " ", t))
        start = s.index(first)
        end = s.index("If you have problems understanding")
        out.append(s[start:end])
    words = " ".join(out).replace("—", " — ").replace(":-", ": — ").split()
    return [w for w in words if w != "-"]


def norm(w):
    """For comparing with the transcription: letters and the stops, case and
    the transcription's typing of the dash aside."""
    w = w.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[^A-Za-z0-9.,;:!?'\"()\[\]]", "", w).lower()


def compare(words, aw):
    """Every place where the voted words and the transcription differ."""
    ia = [i for i, w in enumerate(words) if norm(w["w"])]
    jb = [j for j, x in enumerate(aw) if norm(x)]
    a = [norm(words[i]["w"]) for i in ia]
    b = [norm(aw[j]) for j in jb]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    diffs = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        s1 = ia[i1] if i1 < len(ia) else len(words)
        s2 = ia[i2 - 1] + 1 if i2 > i1 else s1
        diffs.append((s1, s2, " ".join(aw[jb[j]] for j in range(j1, j2))))
    return diffs


# ---------------------------------------------------------------------------
# THE HAND FIXES
# ---------------------------------------------------------------------------

# FIXES: (page, the words before, what the vote gave, what the page image of
# the Cornell copy shows, kind). The kinds: "ocr" (a misread word or stop),
# "mark" (a note mark the rules left, or a word the rules took for one),
# "hyphen" (a hyphen kept or dropped where a word is broken over a line),
# "spacing", "line" (words the page split misplaced: a line of the notes or
# the running head taken for text, or text cut off), "type" (capitals and
# small capitals written as ordinary words), "misprint" (a slip of the 1896
# printer, mended and named: p. 24 prints the figure 1 for the pronoun I),
# "ligature" (Waite's æ, which the OCR spells ae). The words before are as the
# vote gave them, so that each fix is found exactly once in its page.
FIXES = [
# FIXES-BEGIN
    (1, 'Ancient Manuscript Codex,', 'mobe', 'more', 'ocr'),
    (8, 'and thereunto', 'Cometh', 'cometh', 'ocr'),
    (10, 'Thou hast said', 'well;;', 'well;', 'ocr'),
    (13, 'The Sixth Dictum. Lucas', 'saiih:', 'saith:', 'ocr'),
    (14, 'natures! Then', 'sailh', 'saith', 'ocr'),
    (15, '', '"known', 'known', 'ocr'),
    (15, 'nor smooth from rough unless', 'Democritus, who, accordingly, figures merely as a promisby', 'by', 'line'),
    (16, 'which is not known, or', 'described,.', 'described,', 'ocr'),
    (21, 'water, and air. Whereat the', 'Turba.', 'Turba', 'ocr'),
    (22, 'and this is death.', 'Under, stand,', 'Understand,', 'ocr'),
    (24, 'for the advantage of posterity,', '1', 'I', 'misprint'),
    (27, 'another thing. Over these', 'Jet', 'let', 'ocr'),
    (28, 'turn the aforesaid', 'coppert', 'copper', 'mark'),
    (30, 'which is permanent', 'Water,!', 'Water,', 'mark'),
    (30, 'become waters or', 'Etheliae,', 'Etheliæ,', 'ligature'),
    (31, 'stir in its water of', 'Etheliae', 'Etheliæ', 'ligature'),
    (31, 'it becomes red', 'Etheliae.', 'Etheliæ.', 'ligature'),
    (38, 'equable fire until it be', 'whitened,', 'whitened.', 'ocr'),
    (38, 'for Nature converts Nature.', 'Take,therefore,', 'Take, therefore,', 'spacing'),
    (39, 'smoke with its', 'faeces', 'fæces', 'ligature'),
    (39, 'or the shadow of', 'coppert', 'copper', 'mark'),
    (42, 'And this same thing, which', 'foUowst', 'follows', 'mark'),
    (43, 'The Turba', 'answer eth:', 'answereth:', 'spacing'),
    (45, '', 'scoriae,', 'scoriæ,', 'ligature'),
    (45, 'and with the', 'fseces', 'fæces', 'ligature'),
    (46, 'reward thee! Pythagoras', 'sai/A:', 'saith:', 'ocr'),
    (46, 'in humidity. The Turba', 'answereih:', 'answereth:', 'ocr'),
    (48, 'marine water until', 'itshall becomedry.', 'it shall become dry.', 'spacing'),
    (49, 'water of desiccated calx;', "t'cobk", 'cook', 'mark'),
    (53, 'to those who possess', 'rea son', 'reason', 'spacing'),
    (55, 'all bodies, renders all', 'unchange- able,', 'unchangeable,', 'hyphen'),
    (57, 'the work of gold', 'proceedsout', 'proceeds out', 'spacing'),
    (61, 'applications, and they find', 'cer. tain', 'certain', 'hyphen'),
    (69, 'and that no tingeing', 'venoml', 'venom', 'mark'),
    (70, 'who knows the hidden', 'Cambart', 'Cambar', 'mark'),
    (71, 'clean; finally place', 'itinitsvessel,', 'it in its vessel,', 'spacing'),
    (72, 'fixed exalted alum, or', 'Tj;', '♄;', 'type'),  # the sign of Saturn (lead)
    (73, 'seven times until the other', 'twothirds', 'two-thirds', 'hyphen'),
    (76, 'manifest. This, therefore,', 's', 'is', 'ocr'),  # the i is displaced above the line
    (76, 'extracts (or contains in', 'itselt)', 'itself)', 'misprint'),  # the f prints as t
    (79, 'no affinity between', 'tinf', 'tin', 'mark'),
    (79, 'quicksilver? The Turba', 'answereih:', 'answereth:', 'ocr'),
    (79, 'believe you! The Turba', 'answer eth:', 'answereth:', 'spacing'),
    (81, 'your purpose. ¶ The', 'Twenty fourth', 'Twenty-fourth', 'hyphen'),
    (83, 'Afterwards cook it', 'dil igently', 'diligently', 'spacing'),
    (83, 'coagulated, and then', 'poundt', 'pound', 'mark'),
    (88, 'and imposed upon', 'coins:i', 'coins:', 'mark'),
    (89, 'Twenty-Seventh Dictum. Gregorius', 'saiih:', 'saith:', 'ocr'),
    (91, 'water which the', 'envioust', 'envious', 'mark'),
    (91, 'and ye shall imbibe', 'themJ', 'them', 'mark'),
    (91, 'by no body appear unto', 'youJ', 'you.', 'mark'),
    (92, 'earth make the same', 'intense,!', 'intense,', 'mark'),
    (93, 'be produced the said', 'coinlike', 'coin-like', 'hyphen'),  # as printed whole on the same page
    (97, 'endure! Bacsen saith:', '0', 'O', 'ocr'),
    (97, 'disposition! He answereth:', '1', 'I', 'ocr'),
    (98, 'but I do not see that', 'concerned; always with royal personages. Compare the', '', 'line'),  # a note line taken for text
    (110, 'Except ye turn bodies into', 'notbodies,', 'not-bodies,', 'hyphen'),  # as printed whole on the same page
    (112, 'equal, wherefore the', 'envioust', 'envious', 'mark'),
    (114, 'spirit and vapour. The', 'TvRBX', 'Turba', 'ocr'),
    (117, 'ye will by no means', 'ses', 'see', 'ocr'),  # the last letter is damaged in this copy
    (119, 'have said: Let the venom', 'yellow." M. Berthelot explains that honey signifies', '', 'line'),  # a note line taken for text
    (120, 'that which you purpose. The', 'TvRBA', 'Turba', 'ocr'),
    (121, 'until nothing remains except', 'faeces.', 'fæces.', 'ligature'),
    (123, 'of which one consists in', 'rustt', 'rust', 'mark'),
    (124, 'to all thy words! The', 'TvRBA', 'Turba', 'ocr'),
    (126, 'when it has all been poured', 'in', 'in,', 'ocr'),
    (127, 'without a patient,', 'laborious,!', 'laborious,', 'mark'),
    (130, '', '130 The Tuvha PMlosophorum.', '', 'line'),  # the running head taken for text
    (132, 'The Forty-First Dictum.', 'ZiMONt', 'ZiMON', 'mark'),
    (133, 'concerning the rotundum. Then', 'he.-', 'he:', 'ocr'),
    (138, 'by three names!', 'Darbakis', 'Dardaris', 'ocr'),
    (142, 'contains Nature. ¶ The', 'Forty Sixth', 'Forty-Sixth', 'hyphen'),
    (149, 'therefore,', 'G', 'O', 'ocr'),
    (153, 'Art, first to burn', 'coppert', 'copper', 'mark'),
    (153, 'on all sides, so that its', 'colour? heat]', 'colour [? heat]', 'ocr'),
    (153, 'tingeing spirit be', 'extracted,!', 'extracted,', 'mark'),
    (154, 'one, bodies are made', 'notbodies,', 'not-bodies,', 'hyphen'),  # as printed whole on the same line
    (154, 'is now made sulphur', 'not- volatile,', 'not-volatile,', 'hyphen'),
    (156, 'Fifty-Second Dictum. IxuMDRUS', 'saiih:', 'saith:', 'ocr'),
    (160, 'in our coin. ¶ The', 'Fifty Third', 'Fifty-Third', 'hyphen'),
    (160, 'Dictum.', 'ExuMENust', 'ExuMENus', 'mark'),
    (168, 'of the Sun and the', 'Spumet', 'Spume', 'mark'),
    (174, 'wounded, the dew of the', 'death dealer is joined,!', 'death-dealer is joined,', 'hyphen'),  # hyphen and mark
    (175, 'And Balgus: Thou speakest', 'truly', 'truly.', 'ocr'),
    (178, 'God make perfect the', 'foetus,', 'fœtus,', 'ligature'),
    (180, 'dissolved, nor the', 'foetus', 'fœtus', 'ligature'),
    (180, 'the sperm until the', 'foetus', 'fœtus', 'ligature'),
    (181, 'formation, simulating, deceiving', 'prosterity,', 'posterity,', 'misprint'),  # the print reads prosterity
    (182, 'than the powder of', 'Alociae,', 'Alociæ,', 'ligature'),
    (187, 'The Sixty-Fourth', 'DictumA', 'Dictum.', 'mark'),
    (190, 'not-liquefied, the humid becomes', 'dry.', 'dry,', 'ocr'),
    (199, 'nor known except by the', '"Wise.', 'Wise.', 'ocr'),
    (204, 'Take iron, lead, and', 'albart', 'albar', 'mark'),
    (152, 'find your design accomplished.', 'from colophon, and not known to the ancients under this designation.', '', 'line'),  # two note lines taken for text
    (84, 'in the fire and digest', '¶ The Byzantine fragment upon The Philosophical', '', 'line'),  # a note line taken for text
# FIXES-END
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
        line = pages[pg][hits[0] + len(c)]["line"] if hits[0] + len(c) < len(pages[pg]) else None
        todo.setdefault(pg, []).append((hits[0] + len(c), len(o), [{"w": x, "hy": None, "line": line} for x in new.split()]))
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


# ---------------------------------------------------------------------------
# TYPOGRAPHY (method step 7)
# ---------------------------------------------------------------------------


def typography(w):
    # capitals and small capitals: IXIMIDRUS, IxiMiDRUS, TURBA -> Iximidrus, Turba
    m = re.match(r"^([^A-Za-z]*)([A-Za-z]+)(.*)$", w)
    if m and len(m.group(2)) > 2 and re.search(r"[A-Z]", m.group(2)[1:]) and not re.fullmatch(r"[IVXLC]+", m.group(2)):
        w = m.group(1) + m.group(2)[0].upper() + m.group(2)[1:].lower() + m.group(3)
    return w


def join(words):
    words = list(words)
    while words and words[0] == "¶":
        words.pop(0)
    while words and words[-1] == "¶":
        words.pop()
    s = " ".join(words)
    s = re.sub(r" ([:;!?])", r"\1", s)
    s = re.sub(r"([:;]) ?— ?", r"\1—", s)
    s = re.sub(r" — ", "—", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" ?¶ ?", "\n\n", s)
    return s.strip()


# ---------------------------------------------------------------------------
# THE UNITS
# ---------------------------------------------------------------------------

ORDINALS = (
    "First Second Third Fourth Fifth Sixth Seventh Eighth Ninth Tenth Eleventh Twelfth Thirteenth Fourteenth Fifteenth "
    "Sixteenth Seventeenth Eighteenth Nineteenth Twentieth"
).split()
TENS = {"Twenty": 20, "Thirty": 30, "Forty": 40, "Fifty": 50, "Sixty": 60, "Seventy": 70}


def ordinal(words):
    """'Twenty-third' -> 23; None if the words are not an ordinal."""
    w = "-".join(words).replace("--", "-")
    parts = [p.capitalize() for p in w.split("-")]
    if len(parts) == 1 and parts[0] in ORDINALS:
        return ORDINALS.index(parts[0]) + 1
    if len(parts) == 1 and parts[0].endswith("ieth") and parts[0][:-4] + "y" in TENS:
        return TENS[parts[0][:-4] + "y"]
    if len(parts) == 2 and parts[0] in TENS and parts[1] in ORDINALS[:9]:
        return TENS[parts[0]] + ORDINALS.index(parts[1]) + 1
    return None


def split(pages):
    """The heading, the Epistle (with its rubric), the Dicta and the Conclusion."""
    words = [(pg, w["w"]) for pg in sorted(pages) for w in pages[pg]]
    # on p. 1 the heading and rubric are centred or hang: no paragraphs there
    words = [(pg, w) for pg, w in words if not (pg == 1 and w == "¶")]
    texts = [w for _, w in words]
    # the heading runs to the rubric of the Epistle
    i = texts.index("The", 1)
    while not (texts[i] == "The" and texts[i + 1] == "Epistle"):
        i = texts.index("The", i + 1)
    heading = texts[:i]
    j = i
    while not texts[j].endswith("follows:—") and not texts[j].endswith("follows:"):
        j += 1
    rubric = texts[i : j + 1]
    units = [{"key": "epistle", "number": 0, "heading": "The Epistle of Arisleus", "title": join(rubric), "firstPage": str(words[j + 1][0]), "words": []}]
    k = j + 1
    while k < len(words):
        pg, w = words[k]
        # 'The Twenty-Second Dictum.' / 'The Sixty-Fourth Dictum.'
        if w == "The" and k + 2 < len(words):
            m = None
            for span in (1, 2, 3):
                cand = texts[k + 1 : k + 1 + span]
                nxt = texts[k + 1 + span] if k + 1 + span < len(texts) else ""
                if nxt in ("Dictum.", "Dictum", "Dictum,") or nxt.startswith("Dictum"):
                    n = ordinal(cand)
                    if n == units[-1]["number"] + 1:
                        m = (n, span)
                        break
            if m:
                n, span = m
                units[-1]["lastPage"] = str(words[k - 1][0])
                units.append({"key": str(n), "number": n, "heading": join(texts[k : k + 2 + span]).rstrip(",") , "firstPage": str(pg), "words": []})
                k += 2 + span
                continue
        if w.startswith("Conclusion") and units[-1]["number"] == 72:
            units[-1]["lastPage"] = str(words[k - 1][0])
            units.append({"key": "conclusion", "number": 73, "heading": "Conclusion.", "firstPage": str(pg), "words": []})
            k += 1
            continue
        units[-1]["words"].append(w)
        k += 1
    units[-1]["lastPage"] = str(words[-1][0])
    for u in units:
        # the dash after the Epistle's rubric ('as here follows:—') belongs to the rubric
        u["text"] = re.sub(r"^— ?", "", join(typography(x) for x in u.pop("words")))
        m = re.match(r"^(.{1,40}?) saith", u["text"])
        # the name only: 'But Zimon saith' (35th), 'But Plato saith' (45th),
        # 'Afflontus, the Philosopher, saith' (36th)
        u["speaker"] = re.sub(r"^But |, the Philosopher,$", "", m.group(1)) if m else None
    return join(typography(x) for x in heading), units


def check_units(units):
    """The Epistle, every Dictum from the First to the Seventy-Second, and the
    Conclusion, each with its speaker; no stray mark is left."""
    nums = [u["number"] for u in units]
    assert nums == list(range(0, 74)), ("a Dictum is missing or out of order", nums)
    for u in units:
        if u["number"]:
            assert u["speaker"], ("no speaker", u["key"], u["text"][:80])
        assert not re.search(r"[*•■♦°^®™%§¶|{}_]|\s[tfJX]\s", u["text"]), ("a stray mark", u["key"], re.search(r".{0,30}([*•■♦°^®™%§¶|{}_]|\s[tfJX]\s).{0,30}", u["text"]).group(0))


# ---------------------------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------------------------


def write(heading, units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/turba-philosophorum.py from the archive.org OCR\n")
    w("// of three scans of A. E. Waite, The Turba Philosophorum (London, 1896),\n")
    w("// voted, compared with the Alchemy Web Site transcription, and read against\n")
    w("// the page images of the Cornell copy. Do not edit by hand: correct the\n")
    w("// generator (its FIXES list holds every correction made by hand) and run it\n")
    w("// again.\n\n")
    w("export type TurbaUnit = {\n")
    w("  /** 'epistle', '1' to '72' (Waite's First to Seventy-Second Dictum), or 'conclusion'. */\n  key: string;\n")
    w("  /** Waite's heading: 'The Epistle of Arisleus', 'The First Dictum.', ... 'Conclusion.'. */\n  heading: string;\n")
    w("  /** The printed pages of Waite (1896) the unit runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The name before 'saith' at the head of the unit, as Waite prints it. */\n  speaker: string | null;\n")
    w("  /** The Epistle's rubric, printed in italic before it. */\n  title?: string;\n")
    w("  /** The unit as printed, without Waite's note marks. */\n  text: string;\n};\n\n")
    w(f"/** The heading over the whole text (p. 1). */\nexport const TURBA_HEADING = {json.dumps(heading, ensure_ascii=False)};\n\n")
    w("export const TURBA_UNITS: TurbaUnit[] = [\n")
    for u in units:
        t = f", title: {json.dumps(u['title'], ensure_ascii=False)}" if u.get("title") else ""
        w(
            f"  {{ key: {json.dumps(u['key'])}, heading: {json.dumps(u['heading'], ensure_ascii=False)}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, speaker: {json.dumps(u['speaker'], ensure_ascii=False)}{t}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n"
        )
    w("];\n")


TAKEN_COUNT = 74


def main():
    d = sys.argv[1]
    both = {n: scan_pages(os.path.join(d, f"{n}_djvu.xml"), n) for n in SIGLA}
    scans = {n: both[n][0] for n in SIGLA}
    notes = both["C"][1]
    pages = {}
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        toks = {n: attach(raw_tokens(scans[n][pg])) for n in SIGLA}
        entries = vote_page(pg, toks)
        words, marks = resolve_page(entries)
        # paragraphs: a pilcrow before the first word of an indented line
        indents = indented_lines(os.path.join(sys.argv[2], f"p{pg:03d}.jpg"), scans["C"][pg])
        marked, seen = [], set()
        for wd in words:
            if wd["line"] in indents and wd["line"] not in seen and pg != 1:
                marked.append({"w": "¶", "hy": None, "line": wd["line"]})
            seen.add(wd["line"])
            marked.append(wd)
        words = marked
        starts = note_starts(notes[pg], scans["C"][pg])
        if marks != starts:
            log(f"  p.{pg}: {marks} marks dropped from the text, {starts} notes begin below it")
        pages[pg] = words
    # a word broken over two pages is joined on the first
    for pg in range(FIRST_PAGE, LAST_PAGE):
        last, nxt = pages[pg][-1], pages[pg + 1][0] if pages[pg + 1] else None
        if nxt and re.search(r"[A-Za-z]-$", last["w"]) and re.match(r"[a-z]", nxt["w"]):
            last["hy"] = last["w"] + nxt["w"]
            last["w"] = last["w"][:-1] + nxt["w"]
            pages[pg + 1].pop(0)
    log(f"{len(TAKEN)} readings taken; {len(DIFFERED)} places where R or L differ and C is kept")
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    # hyphens: kept where the transcription keeps them
    aw = transcription(d)
    awset = set(norm(x) for x in aw)
    awkeys = set(key(x) for x in aw)
    # a speck at the end of a line that the OCR read as a hyphen (C, p. 10:
    # 'the·' / 'water'): two words where the joined form is no word of the
    # transcription and both halves are
    SPLIT = []
    for pg in pages:
        out = []
        for wd in pages[pg]:
            if wd["hy"]:
                a, b = wd["hy"].split("-", 1)
                if key(wd["w"]) not in awkeys and key(a) in awkeys and key(b) in awkeys:
                    SPLIT.append((pg, wd["hy"]))
                    out.append({"w": a, "hy": None, "line": wd["line"]})
                    out.append({"w": b, "hy": None, "line": wd["line"]})
                    continue
                if norm(wd["hy"]) in awset and norm(wd["w"]) not in awset:
                    wd["w"] = wd["hy"]
            out.append(wd)
        pages[pg] = out
    log(f"{len(SPLIT)} words the OCR joined over a line end split again: " + ", ".join(f"p.{p} {w}" for p, w in SPLIT))
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
                    lines[-1][1].append(w["w"])
                for _, ws in lines:
                    f.write(" ".join(ws) + "\n")
    if os.environ.get("DIFFS"):
        flat = [dict(w, pg=pg) for pg in sorted(pages) for w in pages[pg]]
        diffs = compare(flat, aw)
        with open(os.environ["DIFFS"], "w") as f:
            for i1, i2, theirs in diffs:
                pg = flat[min(i1, len(flat) - 1)]["pg"]
                before = " ".join(w["w"] for w in flat[max(0, i1 - 6) : i1] if w["pg"] == pg)
                f.write(f"p.{pg} | {before} | {' '.join(w['w'] for w in flat[i1:i2])} | AW: {theirs}\n")
        log(f"{len(diffs)} differences from the transcription written to {os.environ['DIFFS']}")
    heading, units = split(pages)
    check_units(units)
    log(f"{len(units)} units: the Epistle, {sum(1 for u in units if u['key'].isdigit())} Dicta and the Conclusion")
    write(heading, units)


if __name__ == "__main__":
    main()
