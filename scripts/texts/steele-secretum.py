"""The Secret of Secrets (Sirr al-asrar) in the English of Ismail Ali (Steele 1920) -> passage-by-passage English.

Robert Steele's edition of Roger Bacon's Secretum secretorum (Opera hactenus
inedita Rogeri Baconi, fasc. V, Oxford: Clarendon Press, 1920) prints, after
the Latin, "The Translation from the Arabic: The Secret of Secrets",
pp. 176-266: "a literal translation of the original Arabic made under my
supervision by Mr. Ismail Ali and edited by Mr. Fulton, of the Oriental
Department of the British Museum" (Steele, introduction, p. vii). It is
translated from MS. Gotha 1869 (A), with variants from Gotha 1870 (B), B.M.
Or. 3118 (C), B.M. Or. 6421 (D), Laud. Or. 210 (W) and Gaster's Hebrew (H),
which Steele gives in footnotes. The book was published in 1920 and is in the
public domain in the United States.

Inputs: the archive.org OCR word files (*_djvu.xml) of three scans of three
physical copies of the 1920 book:

  T  operahactenusin05baco    University of Toronto (Robarts) copy  -- the base
  B  operahactenusine05baco   Boston College Libraries copy
  R  secretumsecretor0005robe a third copy, scanned by the Internet Archive
                              in 2026 (its first page bears a Chicago
                              library stamp)

The three are the same printing, so the page and line breaks agree; their
OCR errors mostly do not. A fourth item that may hold the same fascicle
(operahactenusine00baco) returned a server error and was not used.

WHAT IS READ. The 91 pages from "In the name of God, the Merciful" (p. 176)
to "... Lord of the worlds. Amen." (p. 266); Steele's notes on the text that
follow are not read. On each page the word positions in the OCR are used to
leave out, without reading them:
  - the running page number at the head and the printer's signature at the
    foot;
  - Steele's footnotes (the manuscripts' variant readings and his
    remarks): the block at the foot of the page set in smaller type and
    closer lines than the text, found by line spacing and type height;
  - Steele's marginal notes (the Latin "Section b", "p. 43" and the like,
    which point to the Latin text printed earlier in the book): every word
    that stands wholly outside the text column;
  - footnote reference marks: a word set above the line in small type, and
    digits or stray signs fastened to the end of a word.
On the first page the heading and Steele's note naming the manuscripts are
left out too. Headings printed in the text ("DISCOURSE II.", "On the Kinds of
Kings.", "The Spring Season" and so on) are kept, each as its own paragraph.

THE COMPARISON. Each copy becomes a list of words (a line-end hyphen is
joined; it is kept only where the same word is printed with a hyphen inside a
line somewhere in the three copies). The three lists are lined up word by
word (difflib, on lower-case letters and digits only). Where B and R agree
with each other against T, theirs is taken: a word, its punctuation, a word T
lacks (both B and R have it) or a word T alone has (neither B nor R has it).
A word with no letters (a stray mark, a lone digit) is kept only where at
least two copies have it. Everything else stays as T has it. Every change is
printed to stderr, with each copy's in-order agreement with T, so the run can
be checked; FIXES holds the corrections made by hand, each one a reading on
which the three OCRs disagree or which all three misread, settled by the
sense and by the OCRs' letters. Where the OCRs could not settle a reading
(the fractions of hours and of drug weights on pp. 199-216, which all three
OCRs drop or garble, the quotation marks left by footnote marks, "leads" or
"lends" on p. 183, and the like) it was read from the page images of the T
copy at archive.org. Each FIXES entry states how many times it must apply,
and the run fails if the count differs.

WHAT IS NOT CORRECTED. The printer's own misprints are kept as printed ("phys
cal" p. 208, "Likwise" p. 209, "mattter" and "strategetic" p. 249, "smiths
The" p. 234, "they mayest" p. 247). A line-end hyphen is also kept in four
compounds that are not printed whole inside a line anywhere (KEEP_HYPHEN,
where the reason is given); every hyphen decision is logged. The long-vowel marks of the transliteration (a, i, u with macrons)
are not reproduced, because the OCRs drop them unevenly and a partial set
would mislead; the dotted consonants of the letter table are given. The
letter-number table of p. 251, set in Arabic letters with their transliteration
and value, comes out of the OCR as five broken paragraphs; it is replaced by
LETTER_TABLE, which gives the transliteration and value of each letter as
printed and leaves out the Arabic letters (the last, for 1,000, is printed
in Arabic only, so only its number stands). The places where the English prints
"(cabalistic signs)" for the Arabic signs are given as printed.

TYPOGRAPHY. The book sets a space before ; : ? and ! ; it is closed up here.
Quotation marks are made curly; dashes are an em dash with no spaces. The
translator's square brackets (his explanations) and round brackets are kept.

Usage:
  python3 -I scripts/texts/steele-secretum.py T_djvu.xml B_djvu.xml R_djvu.xml > src/lib/timeline/texts/corpus/secretum-text.ts
"""

import difflib
import html
import json
import re
import statistics as st
import sys
from collections import Counter

FIRST_PAGE = 176
DEBUG_MARGIN = False
START_LINE = re.compile(r"In\s+th[ec]\s+name\s+of\s+God")
LAST_PAGE_MARK = re.compile(r"family\s+and\s+Companions")
END_TEXT = "Lord of the worlds. Amen."

# --- reading one copy ---------------------------------------------------------


def read_pages(path):
    """Each page of the OCR as lines of words (left, bottom, right, top, text), top to bottom."""
    x = open(path, encoding="utf-8").read()
    out = []
    for o in re.split(r"<OBJECT", x)[1:]:
        lines = []
        for ln in re.findall(r"<LINE>(.*?)</LINE>", o, re.S):
            ws = []
            for a, b, c, d, t in re.findall(r'<WORD coords="(\d+),(\d+),(\d+),(\d+)[^"]*"[^>]*>(.*?)</WORD>', ln, re.S):
                a, b, c, d = int(a), int(b), int(c), int(d)
                parts = html.unescape(t).split()
                # The OCR sometimes runs two words into one box: share it out.
                step = (c - a) / max(1, len(parts))
                for n, part in enumerate(parts):
                    ws.append((int(a + n * step), b, int(a + (n + 1) * step), d, part))
            if ws:
                lines.append(sorted(ws))
        lines.sort(key=lambda l: st.median([w[1] for w in l]))
        out.append(lines)
    return out


def text_of(line):
    return " ".join(w[4] for w in line)


def height(line):
    return st.median([w[1] - w[3] for w in line])


def base(line):
    return st.median([w[1] for w in line])


def fit_edge(points):
    """A straight line x = a + b*y through the points, refitted without those far from it."""
    pts = list(points)
    a, b = st.median([x for _, x in pts]), 0.0
    for _ in range(5):
        near = [(y, x) for y, x in pts if abs(x - (a + b * y)) < 25] or pts
        if len(near) < 3:
            break
        my = st.mean(y for y, _ in near)
        mx = st.mean(x for _, x in near)
        vy = sum((y - my) ** 2 for y, _ in near)
        b = sum((y - my) * (x - mx) for y, x in near) / vy if vy else 0.0
        a = mx - b * my
    return lambda y: a + b * y


SIGNATURE = re.compile(r"^(?:\d{4}\s*[A-Z]{1,2}|[A-Z]{1,2}\s*\d?|[A-Z]\s?[a-z]?)$")
FOOT_START = re.compile(r"^(?:[1-9*?!°^■•»§]{1,2}\s|[0-9]\s?[A-Z]|[BCDWAH]\s(?:reads|adds|inserts|omits))")


class Copy:
    def __init__(self, path):
        self.pages = read_pages(path)
        s = next(k for k, p in enumerate(self.pages) if any(START_LINE.search(text_of(l)) for l in p) and any("Commander" in text_of(l) for l in p))
        e = next(k for k in range(s, len(self.pages)) if any(LAST_PAGE_MARK.search(text_of(l)) for l in self.pages[k]))
        assert e - s + 1 == 91, (path, s, e)
        self.s, self.e = s, e
        ps = []
        for p in self.pages[s : e + 1]:
            bs = [base(l) for l in p]
            ps += [b - a for a, b in zip(bs, bs[1:]) if b > a]
        self.pitch = st.median(ps)
        self.height = st.median([height(l) for p in self.pages[s : e + 1] for l in p if len(l) >= 6])

    def page_lines(self, k):
        """The text lines of one page: page number, signature and footnotes out."""
        lines = list(self.pages[k])
        t0 = text_of(lines[0])
        if len(t0) <= 6 and len(lines[0]) <= 2:
            lines = lines[1:]
        while lines and len(lines[-1]) <= 3 and SIGNATURE.match(text_of(lines[-1]).strip()):
            lines = lines[:-1]
        if k == self.s:
            lines = lines[next(i for i, l in enumerate(lines) if START_LINE.search(text_of(l))) :]
        bs = [base(l) for l in lines]
        n = len(lines)
        # Each line votes on whether it is set as a footnote: closer to its
        # neighbours than the text's line spacing, and (a line of four words or
        # more) in smaller type.
        votes = []
        for i in range(n):
            ds = ([bs[i] - bs[i - 1]] if i > 0 else []) + ([bs[i + 1] - bs[i]] if i + 1 < n else [])
            v = 1 if ds and min(ds) < 0.89 * self.pitch else -1
            if len(lines[i]) >= 4:
                v += 1 if height(lines[i]) < 0.88 * self.height else -1
            votes.append(v)
        # The footnotes are the run at the foot of the page, after a wider gap
        # (the space above the notes) or starting with a note number, that the
        # votes most favour; none if no run is favoured.
        best, foot = 0, n
        for f in range(1, n):
            start = FOOT_START.match(text_of(lines[f]))
            if bs[f] - bs[f - 1] < self.pitch and not start:
                continue
            score = sum(votes[f:]) + (1.5 if start else 0)
            if score > best:
                best, foot = score, f
        return lines[:foot]

    def words(self):
        """[(word, page, para, heading)]: para marks the first word of a paragraph."""
        out = []
        for k in range(self.s, self.e + 1):
            page = FIRST_PAGE + k - self.s
            lines = self.page_lines(k)
            full = [l for l in lines if len(l) >= 6]
            # The text column's edges, as straight lines down the page (a scan
            # can be skewed): fitted to the lines' ends, leaving out lines that
            # begin in the margin, are indented or end short.
            edge_l = fit_edge([(base(l), min(w[0] for w in l)) for l in full])
            edge_r = fit_edge([(base(l), max(w[2] for w in l)) for l in full])
            for line in lines:
                y = base(line)
                col_l, col_r = edge_l(y), edge_r(y)
                width = col_r - col_l
                kept = []
                for w in line:
                    # Steele's marginal notes stand outside the text column.
                    # (A word's box runs on to the next word, so only its left edge is used.)
                    # A word a little left of the column on a skewed page is
                    # kept if it looks like a word of the text (three or more
                    # small letters); the notes are page and section numbers.
                    near = w[0] >= col_l - 60 and re.fullmatch(r"\W*[a-z]{3,}\W*", w[4])
                    if (w[0] < col_l - 15 and not near) or w[0] > col_r - 4:
                        if DEBUG_MARGIN: print("MARGIN", page, round(w[0] - col_l), round(w[0] - col_r), w[4], file=sys.stderr)
                        continue
                    kept.append(w)
                # Debris with no letters at the head of a line does not set its indent.
                lettered = [w for w in kept if re.search(r"[A-Za-z0-9]", w[4])]
                if not kept or not lettered:
                    continue
                left = min(w[0] for w in lettered)
                right = max(w[2] for w in kept)
                heading = left > col_l + 0.08 * width and right < col_r - 0.08 * width
                para = heading or left > col_l + 0.025 * width
                # After a line-end hyphen the OCR's box for the rest of the word
                # starts late: such a line is never a heading or a new paragraph.
                if out and out[-1][0].endswith("-") and not out[-1][0].endswith("--"):
                    heading = para = False
                for j, w in enumerate(kept):
                    out.append([w[4], page, para and j == 0, heading, j == 0, j == len(kept) - 1])
        return out


# --- normalising the words ----------------------------------------------------

QUOTES = (("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"), ("„", '"'), ("—", "--"), ("–", "-"), ("­", ""))
# Digits or a stray sign fastened to the end of a word: a footnote mark.
MARK = re.compile(r"(?<=[A-Za-z.,;:!?\]\)'\"])(?:\d{1,2}|[*®°¹²³⁴⁵⁶⁷⁸⁹†‡^~■•»«§]+)$")


def norm(t):
    for a, b in QUOTES:
        t = t.replace(a, b)
    return t


def tokens(copy):
    """The copy's words, line-end hyphens joined, marks out, lone punctuation joined to the word before."""
    raw = []
    for w, page, para, heading, first, last in copy.words():
        # A dash belongs to the word before it; the words either side are kept apart.
        pieces = [x for x in re.split(r"(?<=--)", norm(w).replace("----", "--")) if x]
        for n, piece in enumerate(pieces):
            raw.append([piece, page, para and n == 0, heading, first and n == 0, last and n == len(pieces) - 1])
    out = []
    for w, page, para, heading, first, last in raw:
        # A line-end hyphen before a capital is not a broken word (the OCR's
        # "may-" / "He"): the two stay apart and the hyphen goes.
        if out and out[-1]["hyph"] and first and w[:1].isupper():
            out[-1]["w"] = out[-1]["w"][:-1]
            out[-1]["hyph"] = False
        if out and out[-1]["hyph"] and first:
            prev = out[-1]
            prev["w"] = prev["w"][:-1] + "­" + w
            prev["hyph"] = last and w.endswith("-") and not w.endswith("--")
            continue
        out.append({"w": w, "page": page, "para": para, "head": heading, "hyph": last and w.endswith("-") and not w.endswith("--") and len(w) > 1})
    # Lone punctuation (the book sets a space before ; : ? !) and lone dashes
    # join the word before. A lone quotation mark closes a quotation if one is
    # open in the paragraph, else it opens one on the next word.
    final = []
    open_q = {"'": False, '"': False}
    pending = None
    for t in out:
        if t["para"]:
            open_q = {"'": False, '"': False}
        if pending is not None:
            t["w"] = pending["w"] + t["w"]
            t["para"] = t["para"] or pending["para"]
            pending = None
        w = t["w"]
        if final and not t["para"] and re.fullmatch(r"[;:?!.,)\]]+|--", w):
            final[-1]["w"] += w
            continue
        if re.fullmatch(r"['\"]", w):
            if open_q[w] and final and not t["para"]:
                final[-1]["w"] += w
                open_q[w] = False
            else:
                pending = t
                open_q[w] = True
            continue
        for q in "'\"":
            if w.startswith(q):
                open_q[q] = True
            if len(w) > 1 and w.rstrip(".,;:?!)]-").endswith(q):
                open_q[q] = False
        final.append(t)
    for t in final:
        t["w"] = MARK.sub("", t["w"])
    return [t for t in final if t["w"]]


def key(w):
    return re.sub(r"[^a-z0-9]", "", w.lower().replace("­", ""))


# --- comparison ---------------------------------------------------------------


def align(tk, other):
    a = [key(t["w"]) for t in tk]
    b = [key(t["w"]) for t in other]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    at = {}  # T index -> other index (equal or same-length replace)
    ins = {}  # T gap index -> list of other tokens inserted before T index
    dele = set()
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal" or (op == "replace" and i2 - i1 == j2 - j1):
            for d in range(i2 - i1):
                at[i1 + d] = j1 + d
        elif op == "delete":
            dele.update(range(i1, i2))
        elif op == "insert":
            ins[i1] = other[j1:j2]
        else:
            ins.setdefault(i1, [])
            ins[i1] = ins[i1] + [{"w": "\x00REPLACED", "span": (i1, i2), "other": other[j1:j2]}]
    return sm, at, ins, dele


def has_letters(w):
    return bool(re.search(r"[A-Za-z]", w))


def consensus(T, B, R, log):
    smb, atb, insb, delb = align(T, B)
    smr, atr, insr, delr = align(T, R)
    log.append(f"words: T {len(T)}, B {len(B)}, R {len(R)}; in-order agreement with T (letters only): B {smb.ratio():.4f}, R {smr.ratio():.4f}")
    out = []
    for i, t in enumerate(T):
        # Words both other copies have here and T lacks.
        ib, ir = insb.get(i, []), insr.get(i, [])
        if ib and ir and all("span" not in x for x in ib + ir) and [x["w"] for x in ib] == [x["w"] for x in ir]:
            add = [x["w"] for x in ib]
            log.append(f"  added before T@{i} p.{t['page']}: [{' '.join(add)}] (T: ...{' '.join(x['w'] for x in T[max(0, i - 3):i + 3])}...)")
            for w in add:
                out.append(dict(t, w=w, para=False, head=t["head"]))
        w = t["w"]
        if i in delb and i in delr:
            log.append(f"  dropped T@{i} p.{t['page']}: [{w}] (in neither B nor R)")
            if t["para"] and i + 1 < len(T):
                T[i + 1]["para"] = True
            continue
        if i in atb and i in atr:
            wb, wr = B[atb[i]]["w"], R[atr[i]]["w"]
            if wb == wr and wb != w and not (w.replace("­", "") == wb.replace("­", "")):
                log.append(f"  changed T@{i} p.{t['page']}: [{w}] -> [{wb}]")
                w = wb
            elif not has_letters(w) and not (w == wb or w == wr):
                log.append(f"  dropped mark T@{i} p.{t['page']}: [{w}] (B [{wb}] R [{wr}])")
                continue
            elif len({w, wb, wr}) == 3 and key(w) != key(wb) and key(w) != key(wr):
                log.append(f"  three readings T@{i} p.{t['page']}: T [{w}] B [{wb}] R [{wr}] (T kept)")
        else:
            if not has_letters(w) and not ((i in atb and B[atb[i]]["w"] == w) or (i in atr and R[atr[i]]["w"] == w)):
                log.append(f"  dropped mark T@{i} p.{t['page']}: [{w}]")
                continue
            if not (i in atb or i in atr):
                log.append(f"  unaligned T@{i} p.{t['page']}: [{w}] (kept)")
        # A sign that is never text here, whatever the copies agree on: a footnote mark.
        if re.fullmatch(r"[*^°■•»«§†‡~|_]+", w):
            log.append(f"  dropped mark T@{i} p.{t['page']}: [{w}] (a sign, not text)")
            continue
        out.append(dict(t, w=w))
    return out


# Corrections by hand, applied in order to the paragraphs: (wrong, right,
# how many times it occurs). Each was checked against the page image (archive.org
# page scans of the Toronto copy) unless marked "sense", where the reading is
# plain from the context and the OCR's letters. Misprints of the book itself are
# kept as printed: "phys cal" (p. 208, a letter missing in the type), "Likwise"
# (p. 209), "mattter" and "strategetic" (p. 249), "smiths The" (p. 234, no stop),
# "they mayest" (p. 247).
FIXES = [
    # p. 176
    ("Dhu ‘1-Karnain", "Dhu ’l-Karnain", 1),
    # OCR "0" for the vocative O
    ("0 Alexander", "O Alexander", 4),
    ("fc<” Alexander", "O Alexander", 1),
    ("deficiency in jt.", "deficiency in it.", 1),
    ("the mirror * of", "the mirror of", 1),
    ("which lends to love", "which leads to love", 1),  # p. 183
    ("On the Quality ‘of the King", "On the Quality of the King", 1),  # p. 184
    ("Proper to him?", "Proper to him.", 1),  # p. 184
    ("with the common people.’", "with the common people.", 1),  # p. 185: a note mark
    ("[Persians B]: l Let", "[Persians B]: Let", 1),
    ("to Jaw.", "to law.", 1),
    ("replies to them ‘He", "replies to them: ‘He", 1),
    ("forfeit 7 the", "forfeit the", 1),
    ("to die! a natural", "to die a natural", 1),
    ("physicians/ as", "physicians as", 1),
    ("painting’ on", "painting on", 1),
    ("sense of sight] rejoices", "sense of sight rejoices", 1),  # p. 196
    # pp. 199-201: the fractions the OCR lost
    ("23 hours and of an hour", "23 hours and ¼ of an hour", 1),  # p. 199
    ("23^ hours", "23⅓ hours", 1),  # p. 200
    ("88 days and hours", "88 days and 17 1/12 hours", 1),  # p. 201
    ("(Ailul) to the 22nd of December (Kanun", "(Ailul) to the 22nd of December (Kanun 1).", 1),  # p. 201
    ("89 days and hours", "89 days and 14 1/12 hours", 1),  # p. 201
    ("as are l warm", "as are warm", 1),  # p. 201
    ("pains in the temples! and", "pains in the temples and", 1),  # p. 203
    ("pain in’ the hips", "pain in the hips", 1),  # p. 203
    ("Indian Myrobalan.’", "Indian Myrobalan.", 1),  # p. 204
    ("(Assafcetida)", "(Assafœtida)", 1),  # p. 204
    ("corruption of the being And,", "corruption of the being. And,", 1),  # p. 204
    ("sprinkle rose-water ‘on that", "sprinkle rose-water on that", 1),  # p. 208: a note mark
    ("[to snake -bites]", "[to snake-bites]", 1),
    # pp. 210-216: the medicines; the OCR lost most fractions
    ("half a rati of", "half a ratl of", 1),  # p. 210
    ("And r r. no one", "And no one", 1),  # p. 211
    ("treasure of the sages ‘.", "treasure of the sages’.", 1),  # p. 212
    ("and ratl of violets", "and ¾ ratl of violets", 1),  # p. 212
    ("mixing with it ratl of the water", "mixing with it ½ ratl of the water", 1),  # p. 212
    ("Bahn-gentle), ratl of sweet", "Bahn-gentle), ¼ ratl of sweet", 1),  # p. 213
    ("and i ounce of cloves", "and 1 ounce of cloves", 1),  # p. 213
    ("leaven it with dirhams of musk, dirham of", "leaven it with 1½ dirhams of musk, 1 dirham of", 1),  # p. 213
    ("stone, ratl of the kernel", "stone, ¼ ratl of the kernel", 1),  # p. 213
    ("seeds of myrtle s in", "seeds of myrtle in", 1),  # p. 213
    ("and ounce of Tabashir", "and ¼ ounce of Tabashir", 1),  # p. 213
    ("soak them in io ratls", "soak them in 10 ratls", 1),  # p. 213
    ("Ansaj, ratl of the juice of Karafs (celery), and ratl of", "Ansaj, ½ ratl of the juice of Karafs (celery), and ½ ratl of", 1),  # p. 214
    ("Take ratl of fresh Ustukhudus (French lavender) and ratl of Barbarls", "Take ½ ratl of fresh Ustukhudus (French lavender) and ½ ratl of Barbaris", 1),  # p. 214
    ("Anlsun", "Anisun", 1),  # p. 214
    ("Take ratl of the juice of Bazarkatuna (fleawort), ratl of", "Take ½ ratl of the juice of Bazarkatuna (fleawort), ½ ratl of", 1),  # p. 214
    ("and ounce each of round", "and ½ ounce each of round", 1),  # p. 215
    ("[i-| ounce of the three kinds of sandal wood C only] and \\\\ ounce of", "[1½ ounce of the three kinds of sandal wood C only] and 1½ ounce of", 1),  # p. 215
    ("Then take ounce of the oil", "Then take 1 ounce of the oil", 1),  # p. 215
    ("Then add \\ oz. of", "Then add ½ oz. of", 1),  # p. 215
    ("‘under the rays ‘.", "‘under the rays’.", 1),  # p. 216
    # pp. 218-220
    ("Akllmun", "Aklimun", 1),  # p. 218
    ("replied to them: Aklimun is right", "replied to them: ‘Aklimun is right", 1),  # p. 219
    ("the pot for the food,’ therefore", "the pot for the food, therefore", 1),  # p. 219
    ("such pecple", "such people", 1),  # p. 220
    ("Circle OF THE Sphere.", "Circle of the Sphere.", 1),
    ("become obedient,’ savages", "become obedient, savages", 1),  # sense: a note mark
    ("thejDerceptions", "the perceptions", 1),
    ("isnot", "is not", 1),
    ("thestars", "the stars", 1),
    ("aboveTmentioned", "above-mentioned", 1),  # p. 234
    ("it wili", "it will", 1),
    ("to thee,’ then", "to thee, then", 1),  # sense: a note mark
    ("anddirhems", "and dirhems", 1),
    ("Wazlr", "Wazir", 1),
    ("wazlr", "wazir", 1),
    ("‘Discourse V.", "Discourse V.", 1),  # p. 242: a note mark
    ("JAnd if", "And if", 1),
    ("ka id", "ka’id", 2),
    ("‘arlfs", "‘arifs", 1),
    ("1 Discourse IX.", "Discourse IX.", 1),  # p. 247: a note mark
    ("the ene?ny", "the enemy", 1),  # p. 247
    ("Talk to them, familiarly", "Talk to them familiarly", 1),  # p. 247
    ("keep up a lookout", "keep up a look-out", 1),  # p. 247
    (" hy enemies", " thy enemies", 1),
    ("On the Victorious and the Defeated}", "On the Victorious and the Defeated.", 1),  # p. 250
    ("2 and 2, the aggressor shall be victorious, 2 and two shall", "2 and 2, the aggressor shall be victorious, 2 and 1, two shall", 1),  # p. 251
    ("eight shall win, and 7 left, seven", "eight shall win, 6 and 7 left, seven", 1),  # p. 252
    ("eight shall win, and 7, the aggressor", "eight shall win, 7 and 7, the aggressor", 1),  # p. 252
    ("winning hearts,", "winning of hearts,", 1),  # p. 252
    ("plants, &*c.", "plants, &c.", 1),  # p. 252
    ("any other (in detail) Make", "any other (in detail). Make", 1),  # p. 259
    ("whose length was yards", "whose length was 10 yards", 1),  # p. 260
]

# The table of the letters' numbers on p. 251, which the OCR could not read
# (Arabic letters beside Latin transliterations), is replaced by the
# transliterations and numbers read from the page image. The Arabic letters
# are left out; the last, for 1,000, is printed in Arabic only, so only its
# number stands.
LETTER_TABLE_FIRST = "I A M B (2)."
LETTER_TABLE_LAST = "(900)."
LETTER_TABLE = (
    "A (1). B (2). J (3). D (4). H (5). W (6). Z (7). Ḥ (8). Ṭ (9). Y (10). K (20). L (30). "
    "M (40). N (50). S (60). ‘ (70). F (80). Ṣ (90). Q (100). R (200). SH (300). T (400). "
    "TH (500). KH (600). DH (700). Ḍ (800). Ẓ (900). (1,000)."
)

# Compounds broken at a line end whose hyphen is kept, though the same word is
# not printed hyphened inside a line (the book hyphenates such compounds:
# "half-|cooked" p. 200, "fine-|tempered" p. 234, "well-|wisher" p. 242,
# "stone-|throwing" p. 249).
KEEP_HYPHEN = {"half-cooked", "fine-tempered", "well-wisher", "stone-throwing"}


def dehyphen(words, lexicon, log):
    """A line-end hyphen is kept where the hyphened word is printed inside a line somewhere,
    or where KEEP_HYPHEN says the book's compound keeps it."""
    out = []
    for t in words:
        w = t["w"]
        if "­" in w:
            a, b = w.split("­", 1)
            hy = re.sub(r"[^a-z\-]", "", (a + "-" + b).lower())
            keep = hy in lexicon or hy in KEEP_HYPHEN
            w = a + "-" + b if keep else a + b
            log.append(f"  line-end hyphen p.{t['page']}: {w}")
        out.append(dict(t, w=w))
    return out


def tidy(text):
    text = text.replace("--", "—")
    text = re.sub(r"\s*—\s*", "—", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    text = re.sub(r'(^|[\s(\[—])"', r"\1“", text)
    text = text.replace('"', "”")
    text = re.sub(r"(^|[\s(\[—“])'", r"\1‘", text)
    return text.replace("'", "’")


def paragraphs(words):
    """[[page of first word, page of last word, text]]. A line set as a
    heading (centred) is a paragraph of its own."""
    paras = []
    for t in words:
        if t["para"] or not paras or (t["head"] != paras[-1]["head"]):
            paras.append({"p1": t["page"], "p2": t["page"], "head": t["head"], "w": []})
        paras[-1]["w"].append(t["w"])
        paras[-1]["p2"] = t["page"]
    return [[p["p1"], p["p2"], tidy(" ".join(p["w"]))] for p in paras]


# The archive's passages: (discourse, part, label, the start of its first
# paragraph). Discourse 0 is the translator's preface and Aristotle's
# introductory letter, before Discourse I. A part is 0 where a discourse is
# kept whole; long discourses are cut at the book's own headings or at a
# change of subject, so that no passage runs much past 6,000 characters.
PARTS = [
    (0, 1, "The translator's preface: Aristotle, Alexander and the finding of the book", "In the name of God, the Merciful"),
    (0, 2, "Aristotle's letter to Alexander, and the ten discourses", "I have acquainted myself, O gifted son"),
    (1, 1, "The four kinds of kings; liberality and avarice", "Discourse I."),
    (1, 2, "Reason, good name, and the lusts", "O Alexander, an essential part of liberality"),
    (2, 1, "The king's person, dress and bearing", "Discourse II."),
    (2, 2, "The king among his people", "A king should participate in amusements"),
    (2, 3, "Punishment, perfidy and oaths", "O Alexander, the most emphatic command"),
    (2, 4, "Grief, women, poison, and the science of the stars", "O Alexander, never grieve for what is past"),
    (2, 5, "The secret of health: moderation", "I am writing for thee a secret of the science of therapeutics"),
    (2, 6, "The Superior Degree of Counsel: the king's day and his meals", "THE SUPERIOR DEGREE OF COUNSEL."),
    (2, 7, "Digestion, sleep and habit", "When he has finished eating he should walk"),
    (2, 8, "The seasons: spring and summer", "And it is also necessary for us to mention in this chapter"),
    (2, 9, "The seasons: autumn and winter", "The Autumn Season."),
    (2, 10, "The four parts of the body, and the remedies of an ancient book", "The following is the chapter of the Parts of the Body."),
    (2, 11, "Diet and waters", "Diet."),
    (2, 12, "Wine", "Wine."),
    (2, 13, "What strengthens, fattens and dries the body", "O Alexander, of the things I have mentioned"),
    (2, 14, "The bath", "The Bath."),
    (2, 15, "The 'guard', the great medicine: its honey and the first three medicines", "This is, O Alexander, what will make thee independent"),
    (2, 16, "The fourth to the eighth medicines, and the great compound", "The Fourth Medicine."),
    (2, 17, "Times for bleeding and medicine; music", "O Alexander, neither take medicine"),
    (2, 18, "Divination, and Aklimun's reading of Hippocrates", "And one of those things which thou must know"),
    (2, 19, "A short chapter on physiognomy: the face", "A Short Chapter on Physiognomy."),
    (2, 20, "Physiognomy: the body, and the best of men", "He whose face is small inclining to sallow"),
    (3, 1, "On the form of justice", "Discourse III."),
    (3, 2, "The Circle of the Sphere", "O Alexander, I have invented for thee a diagram"),
    (4, 1, "The order of creation", "Discourse IV."),
    (4, 2, "Man, the soul, and the five ministers", "Man is the noblest of all animals"),
    (4, 3, "The five senses", "The faculty of the eyes is to see"),
    (4, 4, "Counsel and nativity: the weaver's son and the smith", "Therefore, O Alexander, consider this speech"),
    (4, 5, "Choosing and trying ministers", "O Alexander, do not despise small (humble) men."),
    (4, 6, "The fifteen qualities of a minister", "Firstly: His limbs"),
    (4, 7, "Man among the animals; the Jew and the Mage", "O Alexander, God has not created any being more powerful than man"),
    (5, 0, "On the writers of royal warrants", "Discourse V."),
    (6, 0, "On ambassadors", "Discourse VI."),
    (7, 0, "On the superintendents of the subjects and their taxes", "Discourse VII."),
    (8, 0, "On the officers of the army and the soldiers", "Discourse VIII."),
    (9, 1, "The conduct of war: battle and the camp", "Discourse IX."),
    (9, 2, "Sieges, the nations in war, and the astrology of campaigns", "And if thou art laying siege"),
    (9, 3, "The victorious and the defeated: the numbers of names", "On the Victorious and the Defeated."),
    (10, 1, "On talismans: the spiritual world and the forms of bodies", "Discourse X."),
    (10, 2, "Nativity, and the ring of sovereignty", "Thou must particularly know how to find out the correct nativity"),
    (10, 3, "The talisman of the egg and the names of the planets", "And know, O Alexander, that I am going to impart"),
    (10, 4, "Talismans Aristotle made for Alexander", "And the wonders of Talismans, O Alexander, are many."),
    (10, 5, "The golden tomb and its emerald tablet", "Some historians say that there was found in this treasure"),
    (10, 6, "The stone that is not a stone", "Information on the sublimation of hard substances"),
    (10, 7, "Hermes Trismegistus: the Emerald Tablet", "And truly has our ancestor Hermes Trismegistus said:"),
    (10, 8, "The properties of stones", "Some wonderful properties of stones"),
    (10, 9, "On vegetables; the end of the book", "On Vegetables."),
]


def emit(paras, out):
    starts = []
    for d, part, label, first in PARTS:
        # A heading is matched whole; anything else by its opening words.
        hits = [i for i, p in enumerate(paras) if p[2] == first] or [i for i, p in enumerate(paras) if p[2].startswith(first)]
        assert len(hits) == 1, (first, hits)
        starts.append(hits[0])
    assert starts == sorted(starts) and starts[0] == 0, "parts out of order"
    rows = []
    for n, (d, part, label, first) in enumerate(PARTS):
        chunk = paras[starts[n] : starts[n + 1] if n + 1 < len(PARTS) else len(paras)]
        p1, p2 = chunk[0][0], chunk[-1][1]
        rows.append(
            {
                "discourse": d,
                "part": part,
                "label": label,
                "pages": f"p. {p1}" if p1 == p2 else f"pp. {p1}–{p2}",
                "text": "\n\n".join(p[2] for p in chunk),
            }
        )
    out.write(HEADER)
    out.write("export const SECRETUM_PARTS: SecretumPart[] = [\n")
    for r in rows:
        out.write("  " + json.dumps(r, ensure_ascii=False) + ",\n")
    out.write("];\n")


HEADER = """// GENERATED by scripts/texts/steele-secretum.py from three archive.org OCRs of
// three copies of R. Steele (ed.), Opera hactenus inedita Rogeri Baconi,
// fasc. V: Secretum secretorum (Oxford, 1920), "The Translation from the
// Arabic: The Secret of Secrets", pp. 176-266: Ismail Ali's English of the
// Arabic, from MS Gotha 1869. Do not edit by hand: correct the generator (its
// FIXES list holds every correction made by hand) and run it again. Steele's
// footnotes (the variants of the other manuscripts) and marginal notes are
// left out.

export type SecretumPart = {
  /** The book's discourse, I-X; 0 for the translator's preface and Aristotle's letter before Discourse I. */
  discourse: number;
  /** The archive's part within a long discourse; 0 for a discourse kept whole. */
  part: number;
  label: string;
  /** Steele's printed pages. */
  pages: string;
  /** Ismail Ali's English, paragraphs separated by blank lines. */
  text: string;
};

"""


# Titles printed over two lines whose second line starts with a capital.
TITLE_FIRST_LINES = {
    "On the Quality of the King, and the Nature and Conduct",
}


def finish(paras, log):
    """The letter table, the FIXES, and paragraphs the layout broke rejoined."""
    a = next(i for i, p in enumerate(paras) if p[2].startswith(LETTER_TABLE_FIRST))
    b = next(i for i in range(a, len(paras)) if paras[i][2].endswith(LETTER_TABLE_LAST))
    assert b - a == 4, (a, b)
    paras[a : b + 1] = [[paras[a][0], paras[b][1], LETTER_TABLE]]
    for wrong, right, count in FIXES:
        found = sum(p[2].count(wrong) for p in paras)
        assert found == count, (wrong, found)
        for p in paras:
            p[2] = p[2].replace(wrong, right)
    # A paragraph that starts with a small letter after one that does not end
    # a sentence is the same paragraph: the list of the ten discourses and the
    # discourses' titles are set with hanging indents, which the layout reads
    # as new paragraphs. Likewise a title printed over two lines.
    out = []
    for p in paras:
        if out and ((p[2][:1].islower() and not re.search(r"[.?!:’]$", out[-1][2])) or out[-1][2] in TITLE_FIRST_LINES):
            log.append(f"  joined p.{p[0]}: [...{out[-1][2][-40:]}] + [{p[2][:40]}...]")
            out[-1] = [out[-1][0], p[1], out[-1][2] + " " + p[2]]
        else:
            out.append(list(p))
    return out


def main():
    copies = [Copy(p) for p in sys.argv[1:4]]
    T, B, R = (tokens(c) for c in copies)
    lexicon = Counter()
    for tk in (T, B, R):
        for t in tk:
            if "­" not in t["w"] and "-" in t["w"]:
                lexicon[re.sub(r"[^a-z\-]", "", t["w"].lower())] += 1
    log = []
    words = dehyphen(consensus(T, B, R, log), lexicon, log)
    # Stop at the end of the book.
    text_words = []
    for t in words:
        text_words.append(t)
        if " ".join(x["w"] for x in text_words[-5:]).endswith(END_TEXT):
            break
    paras = finish(paragraphs(text_words), log)
    for line in log:
        print(line, file=sys.stderr)
    if len(sys.argv) > 4 and sys.argv[4] == "--list":
        for n, (p1, p2, text) in enumerate(paras):
            print(f"{n}\t{p1}-{p2}\t{len(text)}\t{text}")
        return
    emit(paras, sys.stdout)


if __name__ == "__main__":
    main()
