"""Irenaeus, Against Heresies I.29-31, in the English of Alexander Roberts and
W. H. Rambaut as reprinted in The Ante-Nicene Fathers, vol. I (Buffalo: The
Christian Literature Publishing Company, 1885), pp. 353-358, for the texts
archive (Stage 21) -> src/lib/timeline/texts/corpus/irenaeus-text.ts.

WHAT IS IMPORTED. Book I, chapters 29, 30 and 31, whole, divided by the
ANF's chapter and section numbers:
  I.29.1-4   p. 353-354   "Doctrines of various other Gnostic sects, and
                          especially of the Barbeliotes or Borborians"
  I.30.1-15  p. 354-358   "Doctrines of the Ophites and Sethians"
  I.31.1-4   p. 358       "Doctrines of the Cainites"
23 sections. The chapter headings are the edition's (printed in small
capitals after "CHAP."); the section numbers are the edition's.

THE PRINTING. The ANF of 1885 is the "American reprint of the Edinburgh
edition, revised and chronologically arranged, with brief prefaces and
occasional notes, by A. Cleveland Coxe" (title page): Roberts and Rambaut's
translation first appeared in the Ante-Nicene Christian Library, vol. V
(Edinburgh: T. and T. Clark, 1868), and was reset for the American edition,
which adds Coxe's notes in square brackets. The text here follows the 1885
printing, not the 1868 one. Compared word by word (compare(), on stderr), the
two printings differ in these chapters in one place only: I.29.1, 1868 "in
the conception", 1885 "in conception"; the text has the 1885 reading.

WITNESSES.
  C  The Christian Classics Ethereal Library's transcription of ANF vol. I
     (ccel.org/ccel/schaff/anf01/anf01.ix.ii.xxx.html, .xxxi.html and
     .xxxii.html), saved as ccel_29.html, ccel_30.html, ccel_31.html. THE BASE: it keeps the
     edition's page breaks (353-358), its footnotes apart from the text, and
     its Æ and œ. It carries Coxe's bracketed notes, so it is a transcription
     of the 1885 American printing.
  T  archive.org's OCR of the University of Toronto (PIMS) copy, title page
     "Buffalo ... 1885" (antenicenefather01buff), djvu.txt. Its page images
     are the ones the text was read against: leaves n370-n375 = pp. 353-358
     (archive.org/download/antenicenefather01buff/page/n370.jpg and so on).
  R  archive.org's OCR of the UCLA copy, title page "Buffalo ... 1887", the
     same plates ("Copyright, 1885"; antenicenefathers01robe), djvu.txt.
  S  archive.org's OCR of a copy from the Vennard College library, title page
     "Buffalo ... 1885" (antenicenefather0001unse_s4g9), djvu.txt.
Three scans of three copies of the same plates, each with its own OCR (S's is
a later engine than T's and R's). Compared and reported, not voted:
  N  New Advent's text (newadvent.org/fathers/0103129.htm, 0103130.htm,
     0103131.htm), "Revised and edited for New Advent by Kevin Knight". It
     follows the same translation but silently modernises: "begot" for the
     printed "begat" (four times), "you"/"your" for "ye"/"thy" and the like,
     "carcass" for "carcase", "Son of Nun" for "son of Nun"; it drops some
     quotation marks and sets scripture references into the text. It keeps
     C's misprint "begin" (I.30.3, where the book prints "begirt") and C's
     three wrong stops corrected in FIXES. 39 places differ in all, every one
     printed to stderr; it is not used as a witness of the printing.
  E  archive.org's OCR of the Edinburgh first printing, Ante-Nicene Christian
     Library vol. V (1868; AnteNiceneChristianLibraryV05), djvu.txt: the
     translators' own printing, compared to see which printing C follows.

THE VOTE. C's text (footnote markers and page breaks taken out) is split
into words; each of T, R and S is cut to the three chapters (from "CHAP.
XXIX." to "BOOK II."), its running heads and page numbers taken out and its
line-end hyphens joined, and aligned with C word by word (difflib, on letters
only). Between places where C and all three scans agree, if two or three of
the scans agree with each other (by letters) against C, and their reading is
no more than one word longer or shorter than C's, theirs is taken (with C's
punctuation where the letters are the same). Every reading taken is printed
to stderr, and the count is asserted (TAKEN_COUNT). The footnotes, which the
scans print at the foot of the column, are never inside such a place, so
they cannot be taken into the text. Before the vote the scans' systematic
letter misreadings (OCR_EQUIV: the ligature Æ, œ, capital I read as l) are
normalised and counted on stderr. Result: one reading taken (I.30.3 "begin"
-> "begirt", C's misprint; the page image reads "begirt"), one rejected on
the page image (VOTE_REJECTED: I.29.1 "conception", where the scans read the
footnote mark 5 as an "s"). Where all three scans agree on a stop that C
lacks, the place is printed ("STOPS"), never applied; each was looked up on
the page image and the real ones are in FIXES.

THE PROOFREADING. Every column of pp. 353-358 was then read line by line
against T's page images, and every remaining difference was corrected by hand
in FIXES with its page: three stops, each also in the 1868 printing. There
is no italic in these chapters' text. The edition's dashes are closed up
("—"). Square brackets in the text are the translators' supplements, printed
in the 1868 and the 1885 printings alike; they are kept.

THE FOOTNOTES are the editors' own, not Irenaeus's: the 1868 translators'
(citing the Latin and the editions of Grabe, Massuet and Harvey) and, in
square brackets, Coxe's of 1885. 23 in all: 19 by the translators alone, 2
by Coxe alone, and 2 by the translators with a bracketed addition by Coxe.
Every unbracketed note was found in the 1868 OCR (E). They are listed, not
imported: the generated file keeps each one's place, page and author. Eight
that warn the reader that the Latin or the translation is doubtful at that
point are ESSENTIAL (ESSENTIAL_NOTES) and are quoted in the passage notes,
because without them the English reads as surer than it is.

Usage:
  python3 -I scripts/texts/irenaeus-against-heresies.py DIR > src/lib/timeline/texts/corpus/irenaeus-text.ts
where DIR holds ccel_29.html, ccel_30.html, ccel_31.html, T.txt, R.txt, S.txt,
na_129.html, na_130.html, na_131.html and E.txt (the files named above).
"""

import difflib
import html
import json
import os
import re
import sys
from collections import Counter
from html.parser import HTMLParser


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    for a, b in (("àáâäã", "a"), ("èéêëē", "e"), ("ìíîï", "i"), ("òóôöõō", "o"), ("ùúûü", "u")):
        w = re.sub(f"[{a}]", b, w)
    return re.sub(r"[^a-z0-9]", "", w)


CHAPTERS = [("29", "XXIX"), ("30", "XXX"), ("31", "XXXI")]

# ---------------------------------------------------------------------------
# C: THE CCEL TRANSCRIPTION
# ---------------------------------------------------------------------------


class CcelChapter(HTMLParser):
    """The chapter's heading, its paragraphs (with ⟦fn:ID⟧ and ⟦pb:N⟧ marks) and
    its footnotes (from the list at the foot of the page)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.heading = ""
        self.paras = []
        self.notes = {}
        self.stack = []  # (tag, kind)
        self.mode = None  # 'h3' | 'p' | 'note'
        self.cur = []
        self.note_id = None
        self.skip = 0  # depth inside span.mnote (the inline copy of a note)
        self.in_sup_note = False
        self.in_pb = 0
        self.done = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if self.skip:
            if tag == "span":
                self.skip += 1
            return
        if tag == "span" and "mnote" in cls.split():
            self.skip = 1
            return
        if tag == "hr" and "footnotes-hr" in cls:
            self.done = True
        if tag == "h3" and not self.done and not self.heading:
            self.mode, self.cur = "h3", []
        elif tag == "p" and not self.done and self.heading:
            self.mode, self.cur = "p", []
        elif tag == "div" and "footer_note" in cls:
            self.mode, self.cur, self.note_id = "note", [], a.get("id", "").replace("fnf_", "")
        elif tag == "sup" and "Note" in cls.split() and self.mode == "p":
            self.in_sup_note = True
            self.cur.append(f"⟦fn:{a.get('id', '').replace('fna_', '')}⟧")
        elif tag == "span" and "pb" in cls.split() and self.mode == "p":
            num = re.search(r"Page_(\d+)", a.get("id", ""))
            self.cur.append(f" ⟦pb:{num.group(1)}⟧ ")
            self.in_pb = 1
        elif tag == "span" and self.in_pb:
            self.in_pb += 1
        elif tag == "sup" and self.mode == "note":
            self.in_sup_note = True

    def handle_endtag(self, tag):
        if self.skip:
            if tag == "span":
                self.skip -= 1
            return
        if tag == "sup":
            self.in_sup_note = False
        if tag == "span" and self.in_pb:
            self.in_pb -= 1
        if tag == "h3" and self.mode == "h3":
            self.heading = " ".join("".join(self.cur).split())
            self.mode = None
        elif tag == "p" and self.mode == "p":
            self.paras.append("".join(self.cur))
            self.mode = None
        elif tag == "div" and self.mode == "note":
            self.notes[self.note_id] = " ".join("".join(self.cur).split())
            self.mode = None

    def handle_data(self, data):
        if self.skip or self.in_sup_note or self.in_pb:
            return
        if self.mode:
            self.cur.append(data)


def ccel(path):
    p = CcelChapter()
    p.feed(open(path, encoding="utf-8").read())
    return p


def clean_space(s):
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"\s+([,.;:!?)\]])", r"\1", s)
    return s


# ---------------------------------------------------------------------------
# T, R, S: THE SCANS
# ---------------------------------------------------------------------------

RUNNING_HEAD = re.compile(r"^\s*IREN.{1,4}US\s+AGAINST\s+HERESIES\.?\s*$|^\s*[,;.]?\s*\d{3}\s*$|^\s*;?\d{2}\s*$")


def scan_tokens(path):
    lines = open(path, encoding="utf-8", errors="replace").read().split("\n")
    a = next(i for i, l in enumerate(lines) if re.search(r"DOCTRINES\s+OF\s+VARIOUS\s+OTHER", l) and "XXIX" in l)
    b = next(i for i, l in enumerate(lines) if i > a and re.match(r"^\s*BOOK\s+II[.,]", l))
    kept = []
    for line in lines[a + 1 : b]:
        if RUNNING_HEAD.match(line):
            kept.append("")
            continue
        kept.append(line.rstrip())
    text = "\n".join(kept)
    for x, y in (("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"), ("—", " — "), ("--", " — "), ("■", " "), ("­", "")):
        text = text.replace(x, y)
    text = re.sub(r"(\w)[-¬][ \t]*\n[ \t]*(?=\w)", r"\1", text)
    words = []
    for w in text.split():
        if re.fullmatch(r"[;:,.!?]+", w) and words:
            words[-1] += w  # a stop set apart by a space
            continue
        if re.fullmatch(r"\d{1,2}\.", w):
            continue  # the edition's section numbers, which C keeps apart
        w = re.sub(r"(?<=[.,;:!?\"'])[\d^*'\-]+$", "", w)  # a footnote mark after a stop
        for pattern, repl in OCR_EQUIV:
            if re.fullmatch(pattern, w):
                EQUIV_USED[(os.path.basename(path), pattern)] += 1
                w = re.sub(pattern, repl, w)
                break
        if key(w):
            words.append(w)
    log(f"{os.path.basename(path)}: {len(words)} words")
    return words


# The OCRs' systematic misreadings of letters the edition prints and C keeps:
# the ligature Æ (read "^", "/E" or "JE"), œ (read "c"), and the capital I of
# Ialdabaoth and Iao (read "l"). Each was seen on T's page images; the
# substitutions are made in the scans before the vote and counted on stderr.
OCR_EQUIV = [
    (r"[\^/]E?on([.,;:]?)", r"Æon\1"),
    (r"JEon([.,;:]?)", r"Æon\1"),
    (r"\^ons([.,;:]?)", r"Æons\1"),
    (r"Ennc[eE]a([.,;:]?)", r"Ennœa\1"),
    (r"(\(?)lald(abaoth\)?[.,;:]?)", r"\1Iald\2"),
    (r"lao([.,;:]?)", r"Iao\1"),
]
EQUIV_USED = Counter()


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
    return at, sm.ratio()


TAKEN = []
STOPS = []
REJECTED = []
DIFFERED = []

# Readings two scans agree on against C that the page images show to be the
# OCR's, not the book's: (the six words before, C's reading) -> why.
VOTE_REJECTED = {
    ("and contemplating their greatness, and in", "conception"): "p. 353: the book prints 'conception' with the footnote mark 5, which T and R read as 's'",
}


def vote(base, owner, scans):
    """base: C's words; owner: the unit of each. scans: {name: words}. ->
    [(unit, word)]: C's words with the scans' majority readings taken."""
    bk = [key(w) for w in base]
    ats = {}
    for name, words in scans.items():
        ats[name], ratio = anchors(bk, [key(w) for w in words])
        log(f"agreement of C with {name}: {ratio:.3f}")
    bounds = [b for b in range(len(base) + 1) if all(ats[n][b] is not None for n in scans)]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = base[b1:b2]
        segk = [key(w) for w in seg]
        readings = {n: scans[n][ats[n][b1] : ats[n][b2]] for n in scans}
        rk = {n: tuple(key(w) for w in readings[n]) for n in scans}
        votes = Counter(rk.values())
        best, count = votes.most_common(1)[0]
        new = seg
        if count >= 2 and list(best) != segk and seg and abs(len(best) - len(seg)) <= 1:
            who = [n for n in scans if rk[n] == best]
            ctx = " ".join(base[max(0, b1 - 6) : b1])
            reading = readings[who[0]]
            if (ctx, " ".join(seg)) in VOTE_REJECTED:
                REJECTED.append(ctx)
                log(f"  REJECTED ({'+'.join(who)}): ...{ctx} [{' '.join(seg)}] -> [{' '.join(reading)}]: {VOTE_REJECTED[(ctx, ' '.join(seg))]}")
            else:
                new = reading
                TAKEN.append((ctx, " ".join(seg), " ".join(new), who))
                log(f"  TAKEN ({'+'.join(who)}): ...{ctx} [{' '.join(seg)}] -> [{' '.join(new)}]")
        elif any("".join(rk[n]) != "".join(segk) for n in scans):
            ctx = " ".join(base[max(0, b1 - 6) : b1])
            DIFFERED.append(ctx)
            shown = " ".join(f"{n}[{' '.join(readings[n])[:80]}]" for n in scans)
            log(f"  differ, C kept: ...{ctx} C[{' '.join(seg)}] {shown}")
        if new is seg and len(seg) == 1 and all(len(readings[n]) == 1 for n in scans):
            # same letters: are the stops the same? (reported, never applied)
            marks = {n: re.sub(r"[\w\s\"-]", "", readings[n][0]).replace("'", "’") for n in scans}
            mine = re.sub(r"[\w\s“”—-]", "", seg[0])
            if len(set(marks.values())) == 1 and marks["T"] != mine:
                ctx = " ".join(base[max(0, b1 - 6) : b1])
                STOPS.append(ctx)
                log(f"  STOPS differ (all scans): ...{ctx} C[{seg[0]}] scans[{readings['T'][0]}]")
        out.extend((owner[b1], w) for w in new)
    return out


# ---------------------------------------------------------------------------
# THE UNITS
# ---------------------------------------------------------------------------


def build(d):
    chapters = []
    units = []
    notes = []
    page = 353
    for num, numeral in CHAPTERS:
        c = ccel(os.path.join(d, f"ccel_{num}.html"))
        m = re.match(rf"Chapter {numeral}\.—(.+)$", c.heading)
        assert m, c.heading
        first_page = page
        for para in c.paras:
            text = " ".join(para.split())
            sm = re.match(r"^(\d+)\.\s+(.*)$", text)
            assert sm, text[:60]
            sec = sm.group(1)
            body = sm.group(2)
            start = page
            # footnote marks: the words before each, for the list
            for fm in re.finditer(r"⟦fn:([^⟧]+)⟧", body):
                before = re.sub(r"⟦[^⟧]*⟧", "", body[: fm.start()]).split()[-4:]
                pages_before = re.findall(r"⟦pb:(\d+)⟧", body[: fm.start()])
                on = int(pages_before[-1]) if pages_before else page
                notes.append({"chapter": num, "section": sec, "page": str(on), "ccel": fm.group(1), "after": " ".join(before), "text": c.notes[fm.group(1)]})
            for pb in re.findall(r"⟦pb:(\d+)⟧", body):
                page = int(pb)
            body = clean_space(re.sub(r"⟦[^⟧]*⟧", " ", body))
            units.append({"chapter": num, "section": sec, "firstPage": str(start), "lastPage": str(page), "text": body})
        chapters.append({"chapter": num, "numeral": numeral, "heading": m.group(1).strip(), "firstPage": str(first_page), "lastPage": str(page)})
    return chapters, units, notes


# The readings the vote takes (two or three scans agreeing against C): every
# one is printed to stderr, and every one was checked on T's page images.
TAKEN_COUNT = 1

# Corrections by hand after the vote: (chapter.section, old, new, expected
# count, why). Every one was read on T's page images (leaves n370-n375).
FIXES = [
    ("29.4", "to the uttermost and looked down", "to the uttermost, and looked down", 1, "p. 354, left column: the comma (also in 1868)"),
    ("30.11", "Joel, and Zechariah to Sabaoth", "Joel, and Zechariah, to Sabaoth", 1, "p. 357, left column: the comma (also in 1868)"),
    ("30.11", "maintain that Sophia, herself has", "maintain that Sophia herself has", 1, "p. 357, left column: no comma (none in 1868)"),
]

# The footnotes that say the Latin or the translation is doubtful at that
# point; they are quoted in the passages' notes. (CCEL note id -> why)
ESSENTIAL_NOTES = {
    "ix.ii.xxx-p2.2": "I.29.1: the text and meaning of 'in conception [thus formed]' are doubtful",
    "ix.ii.xxxi-p2.1": "I.30.2: the punctuation, and so the sense, is doubtful",
    "ix.ii.xxxi-p8.2": "I.30.5: the Latin 'evertisse' implies more than 'imparted'",
    "ix.ii.xxxi-p17.2": "I.30.9: the English follows Grabe's emendation",
    "ix.ii.xxxi-p19.1": "I.30.10: 'ex quibus' is obscure and the next sentence 'seems unintelligible'",
    "ix.ii.xxxi-p21.1": "I.30.11: words of the common Latin text are left out as a gloss",
    "ix.ii.xxxi-p28.1": "I.30.15: the sentence is 'hopelessly corrupt'",
    "ix.ii.xxxii-p3.1": "I.31.2: the text is imperfect and the translation 'only conjectural'",
}


def main():
    d = sys.argv[1]
    chapters, units, notes = build(d)
    base = []
    owner = []  # unit index of each base word
    for i, u in enumerate(units):
        ws = re.sub(r"—(?=\S)", "— ", u["text"]).split()
        base.extend(ws)
        owner.extend([i] * len(ws))
    scans = {n: scan_tokens(os.path.join(d, f"{n}.txt")) for n in "TRS"}
    for (f, pattern), c in sorted(EQUIV_USED.items()):
        log(f"OCR_EQUIV {f} {pattern}: {c}")
    assert len(notes) == 23, len(notes)
    assert set(ESSENTIAL_NOTES) <= {n["ccel"] for n in notes}, "an ESSENTIAL_NOTES id is not a note"
    voted = vote(base, owner, scans)
    log(f"{len(TAKEN)} readings taken by the vote; {len(REJECTED)} rejected on the page images; {len(DIFFERED)} places where the scans differ and C is kept")
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    assert len(REJECTED) == len(VOTE_REJECTED), ("a VOTE_REJECTED entry was not met", REJECTED)
    texts = []
    for i in range(len(units)):
        ws = [w for o, w in voted if o == i]
        texts.append(re.sub(r"— ", "—", " ".join(ws)))
    applied = Counter()
    for u, text in zip(units, texts):
        ref = f"{u['chapter']}.{u['section']}"
        for n, (fu, old, new, _count, _why) in enumerate(FIXES):
            if fu == ref and old in text:
                applied[n] += text.count(old)
                text = text.replace(old, new)
        u["text"] = text
        log(f"I.{ref}: pp. {u['firstPage']}-{u['lastPage']}, {len(text.split())} words")
    for n, (fu, old, _new, count, _why) in enumerate(FIXES):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", fu, old, applied[n])
    compare(d, units)
    write(chapters, units, notes)


def looks_like_ocr(a, b):
    """A difference from the 1868 OCR that is the OCR's noise, not a reading:
    near-identical letters, or a stray scrap of one or two letters."""
    ka = re.sub(r"\d", "", key(" ".join(a)))
    kb = re.sub(r"\d", "", key(" ".join(b)))
    if ka == kb:
        return True  # spacing, stops or a footnote mark
    if not ka or not kb:
        return len(ka + kb) <= 2  # a whole word in one and not the other is a reading
    return difflib.SequenceMatcher(None, ka, kb).ratio() >= 0.7


def compare(d, units):
    """N (New Advent) and E (the 1868 printing), word by word against the
    result; differences are printed, not applied."""
    ours = " ".join(u["text"] for u in units).split()
    na = []
    for num in ("129", "130", "131"):
        src = open(os.path.join(d, f"na_{num}.html"), encoding="utf-8").read()
        for m in re.finditer(r"<p>(\d+\..*?)</p>", src, re.S):
            t = html.unescape(re.sub(r"<[^>]+>", "", m.group(1)))
            na.extend(re.sub(r"^\d+\.\s*", "", " ".join(t.split())).split())
    report("New Advent", ours, na, exact=True)
    lines = open(os.path.join(d, "E.txt"), encoding="utf-8", errors="replace").read().split("\n")
    a = next(i for i, l in enumerate(lines) if "Doctrines of various other Gnostic sects" in l)
    b = next(i for i, l in enumerate(lines) if i > a and re.match(r"^\s*BOOK II\.", l))
    e = re.sub(r"(\w)-[ \t]*\n[ \t]*(?=\w)", r"\1", "\n".join(lines[a + 2 : b])).split()
    report("1868", ours, e, exact=False)


def report(name, ours, other, exact):
    ok = [key(w) if not exact else w for w in ours]
    xk = [key(w) if not exact else w for w in other]
    sm = difflib.SequenceMatcher(None, ok, xk, autojunk=False)
    n = 0
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        if not exact and (i2 - i1 > 8 or j2 - j1 > 8):
            continue  # a footnote or a running head in the OCR
        if not exact and looks_like_ocr(ours[i1:i2], other[j1:j2]):
            continue
        n += 1
        log(f"  {name}: ...{' '.join(ours[max(0, i1 - 5):i1])} [{' '.join(ours[i1:i2])}] / [{' '.join(other[j1:j2])}]")
    log(f"{name}: {n} places differ")


def write(chapters, units, notes):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/irenaeus-against-heresies.py from the CCEL\n")
    w("// transcription of The Ante-Nicene Fathers, vol. I (Buffalo, 1885), voted against\n")
    w("// the archive.org OCR of three scans of that printing and then read against the\n")
    w("// page images of the Toronto copy. Do not edit by hand: correct the generator (its\n")
    w("// FIXES list holds every correction made by hand) and run it again.\n\n")
    w("export type IrenaeusChapter = {\n")
    w("  /** Book I's chapter number: '29', '30' or '31'. */\n  chapter: string;\n")
    w("  numeral: string;\n")
    w("  /** The edition's heading after 'CHAP.' (in small capitals in the book). */\n  heading: string;\n")
    w("  firstPage: string;\n  lastPage: string;\n};\n\n")
    w("export type IrenaeusUnit = {\n  chapter: string;\n  /** The edition's section number within the chapter. */\n  section: string;\n")
    w("  /** The printed pages of ANF vol. I (1885) the section runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** One paragraph, without the section number or the footnote marks. */\n  text: string;\n};\n\n")
    w("/** The edition's footnotes: listed, not imported (see the generator). */\n")
    w("export type IrenaeusNote = {\n  chapter: string;\n  section: string;\n  page: string;\n")
    w("  /** The words the note's mark follows. */\n  after: string;\n")
    w("  /** 'translators' (Roberts and Rambaut, 1868), 'coxe' (in square brackets, 1885) or 'both'. */\n  by: string;\n")
    w("  /** True where the note warns that the Latin or the translation is doubtful at that point. */\n  essential: boolean;\n")
    w("  text: string;\n};\n\n")
    w("export const IRENAEUS_CHAPTERS: IrenaeusChapter[] = [\n")
    for c in chapters:
        w(f"  {{ chapter: {json.dumps(c['chapter'])}, numeral: {json.dumps(c['numeral'])}, heading: {json.dumps(c['heading'], ensure_ascii=False)}, firstPage: {json.dumps(c['firstPage'])}, lastPage: {json.dumps(c['lastPage'])} }},\n")
    w("];\n\n")
    w("export const IRENAEUS_UNITS: IrenaeusUnit[] = [\n")
    for u in units:
        w(f"  {{ chapter: {json.dumps(u['chapter'])}, section: {json.dumps(u['section'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n\n")
    w("export const IRENAEUS_NOTES: IrenaeusNote[] = [\n")
    for n in notes:
        t = n["text"]
        by = "coxe" if t.startswith("[") else ("both" if "[" in t else "translators")
        w(f"  {{ chapter: {json.dumps(n['chapter'])}, section: {json.dumps(n['section'])}, page: {json.dumps(n['page'])}, after: {json.dumps(n['after'], ensure_ascii=False)}, by: {json.dumps(by)}, essential: {json.dumps(n['ccel'] in ESSENTIAL_NOTES)}, text: {json.dumps(t, ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
