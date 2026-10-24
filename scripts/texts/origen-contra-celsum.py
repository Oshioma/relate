"""Origen, Against Celsus (Contra Celsum) VI.22-38, in the English of Frederick
Crombie as reprinted in The Ante-Nicene Fathers, vol. IV (Buffalo: The
Christian Literature Publishing Company, 1885), pp. 583-590, for the texts
archive (Stage 22) -> src/lib/timeline/texts/corpus/origen-contra-celsum-text.ts.

WHAT IS IMPORTED. Book VI, chapters XXII to XXXVIII, whole: 17 chapters, each
one paragraph in the edition, which prints no section numbers and no chapter
titles in Against Celsus (only "CHAP. XXII." and so on). They hold Celsus's
account of the Mithraic ladder of seven gates (XXII), Origen's description of
the Ophite diagram he says he saw (XXIV-XXVI, XXX, XXXIII, XXXV, XXXVIII),
the "seal" and the "accursed" god (XXVII-XXIX), the seven ruling demons
(XXX), the prayers spoken at each gate (XXXI), Origen's account of where the
names came from (XXXII), and Celsus's mockery of "circles upon circles" and
the "tree of life" (XXXIV-XXXVII).

THE PRINTING. The ANF of 1885 is the "American reprint of the Edinburgh
edition, revised and chronologically arranged, with brief prefaces and
occasional notes, by A. Cleveland Coxe" (title page). Crombie's translation
of Against Celsus first appeared in the Ante-Nicene Christian Library, vols.
X (1869) and XXIII (1872, "Origen contra Celsum", vol. II, which holds Book
VI); Coxe's notes are in square brackets. The text here follows the 1885
printing; the 1872 printing (E) is compared word by word (compare(), on
stderr).

WITNESSES.
  C  The Christian Classics Ethereal Library's transcription of ANF vol. IV
     (ccel.org/ccel/schaff/anf04.vi.ix.vi.xxii.html to .xxxviii.html), saved
     as ccel_xxii.html ... ccel_xxxviii.html. THE BASE: it keeps the edition's
     footnotes apart from the text, its Æ and its italics, and it carries
     Coxe's bracketed notes, so it is a transcription of the 1885 American
     printing. Its page-break anchors in these chapters are one higher than
     the printed page numbers (its "Page_585" falls where p. 584 begins on the
     page image, "the book of Moses entitled Numbers"), and it has none for
     p. 584's own start; so the pages here are its anchors less one, checked
     on the page images (PAGE_OFFSET), with p. 583 for the start of XXII.
  T  archive.org's OCR of the University of Toronto (Robarts) copy, title
     page "Buffalo ... 1885" (antenicenefather04robeuoft), djvu.txt. Its page
     images are the ones the text was read against: leaves n594-n601 =
     pp. 583-590 (archive.org/download/antenicenefather04robeuoft/page/n594.jpg
     and so on).
  Q  archive.org's OCR (tesseract) of a second copy with the title page
     "Buffalo ... 1885" (antenicenefather0004reva_q8u8), djvu.txt.
  B  archive.org's OCR (tesseract) of a third copy with the title page
     "Buffalo ... 1885", stamped by the University of the Pacific library
     (bwb_S0-AWY-298_4), djvu.txt.
Three scans of three copies of the 1885 printing, each with its own OCR.
Two later printings from the same plates were found (New York, 1890,
antenicenefather0004unse_k0t2; New York: Scribner's, 1913,
antenicenefather04robe); they are not used.
Compared and reported, not voted:
  N  New Advent's text (newadvent.org/fathers/04166.htm, chapters 22-38),
     "Revised and edited for New Advent by Kevin Knight": the same
     translation, silently modernised; every difference is printed to stderr;
     it is not used as a witness of the printing.
  E  archive.org's OCR of the Edinburgh first printing, Ante-Nicene Christian
     Library vol. XXIII (1872; writingsoforigen02origuoft), djvu.txt.

THE VOTE. C's text (footnote markers, page breaks and italic marks taken out)
is split into words; each of T, Q and B is cut to the seventeen chapters (from
the "CHAP. XXII." before "Persian mysteries" to the next "CHAP. XXXIX."), its
running heads and page numbers taken out and its line-end hyphens joined, and
aligned with C word by word (difflib, on letters only). Between places where C
and all three scans agree, if two or three of the scans agree with each other
(by letters) against C, and their reading is no more than one word longer or
shorter than C's, theirs is taken (with C's punctuation where the letters are
the same). Every reading taken is printed to stderr, and the count is
asserted (TAKEN_COUNT); readings the page images show to be the OCRs' are
rejected (VOTE_REJECTED). The footnotes, which the scans print at the foot
of the column, are never inside such a place. Where all three scans agree on
a stop that C lacks, the place is printed ("STOPS"), never applied; each was
looked up on the page image and the real ones are in FIXES.

RESULT OF THE VOTE. One reading taken: VI.22 "that which takes place" for
C's "take" (all three scans; the page image, p. 583, reads "takes"). Before
the vote, footnote marks set apart by a space or read as a letter after a
stop are dropped from the scans, and the OCRs' Æ is normalised (OCR_EQUIV,
counted on stderr). Five places where all three scans agree on a stop that C
lacks were looked up: two are real and in FIXES ("uttered," VI.26; the full
stop after "different" that ends VI.32); in the other three ("'works of
darkness,'", "'tree,'", "'a greater and a less,'") the page images print
the single quotation marks C has, which the OCRs lost.

THE PROOFREADING. Every column of pp. 583-590 was then read against T's page
images, and every remaining difference was corrected by hand in FIXES with
its page. ITALICS: C marks four words in italic in these chapters ("rational",
XXVII; "name", XXVIII; "not", XXIX; "we", XXX), as the edition prints them;
the archive keeps plain text, so the marks are dropped and the places listed
here. The edition also prints "seven" in italic in XXVII ("of seven angels"),
which C does not mark (seen on the page image, p. 585). Small capitals
("LORD", XXXVI) are not marked. The edition's dashes are closed up ("—"). Round brackets in the text
are the translator's supplements ("(in their meetings)", "(entitled)") and
are kept.

THE FOOTNOTES are the editors', not Origen's: 79 in all. Crombie's (most of
them the Greek words behind his English, with conjectures of Boherellus,
Gelenius, Guietus and Spencer, Spencer's Latin notes, and scripture
references) and, in square brackets, notes added in the American edition of
1885 (three of them signed "S.", whose author is not identified here; the
volume's title page names A. Cleveland Coxe for its "brief prefaces and
occasional notes"). Two of the American notes are bracketed additions to a
translator's note (by "both"). They are
listed, not imported: the generated file keeps each one's place, page and
author. Those that tell the reader the Greek is uncertain or emended at that
point, or that the English rests on a conjecture, are ESSENTIAL
(ESSENTIAL_NOTES) and are quoted in the passage notes.

THE TWO PRINTINGS. Compared word by word with the 1872 OCR (E), the 1885
text differs in three readings, each confirmed on both printings' page
images (1872: writingsoforigen02origuoft, leaves n408 and n414 = pp. 367
and 373): VI.28 1885 "or omit even that He was a wise man", 1872 "or admit
even" (1885 looks like a misprint, since "admit" fits the sense; the text
keeps 1885, and the plain words note 1872); VI.34 1885 "a carpenter by
craft", 1872 "by trade"; VI.35 1885 "show from the prophetic writings the
events", 1872 "writings that the events". 1872 prints the translator's
supplements in square brackets ("[is mention made]", "[invented]"), 1885
in round ones. Every other difference printed is the 1872 OCR's noise.

NEW ADVENT silently modernises Crombie's English ("You have" for "Thou
hast", "your" for "thy", "various lusts" for "divers lusts", "leaped over"
for "overleap", "among" for "amongst", "color" for "colour") and drops the
quotation marks that set off Celsus's words; it keeps C's misprint "take".
It is not used.

Usage:
  python3 -I scripts/texts/origen-contra-celsum.py DIR > src/lib/timeline/texts/corpus/origen-contra-celsum-text.ts
where DIR holds ccel_xxii.html ... ccel_xxxviii.html, T.txt, Q.txt, B.txt,
na_book6.html and E.txt (the files named above).
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


NUMERALS = ["XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX", "XXXI", "XXXII", "XXXIII", "XXXIV", "XXXV", "XXXVI", "XXXVII", "XXXVIII"]
FIRST = 22

# C's page anchors are one higher than the printed page (see WITNESSES).
PAGE_OFFSET = -1
FIRST_PAGE = 583

# ---------------------------------------------------------------------------
# C: THE CCEL TRANSCRIPTION
# ---------------------------------------------------------------------------


class CcelChapter(HTMLParser):
    """The chapter's heading paragraph, its text paragraphs (with ⟦fn:ID⟧,
    ⟦pb:N⟧ and ⟦i⟧ marks) and its footnotes (from the list at the foot)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.paras = []
        self.notes = {}
        self.mode = None  # 'content' | 'p' | 'note'
        self.cur = []
        self.note_id = None
        self.skip = 0
        self.in_sup_note = False
        self.in_pb = 0
        self.in_content = False
        self.done = False
        self.italics = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if self.skip:
            if tag == "span":
                self.skip += 1
            return
        if tag == "div" and "book-content" in cls.split():
            self.in_content = True
        if tag == "span" and "mnote" in cls.split():
            self.skip = 1
            return
        if tag == "hr" and "footnotes-hr" in cls:
            self.done = True
        if tag == "p" and self.in_content and not self.done:
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
        elif tag in ("i", "em") and self.mode == "p":
            self.cur.append("⟦i⟧")

    def handle_endtag(self, tag):
        if self.skip:
            if tag == "span":
                self.skip -= 1
            return
        if tag == "sup":
            self.in_sup_note = False
        if tag == "span" and self.in_pb:
            self.in_pb -= 1
        if tag in ("i", "em") and self.mode == "p":
            self.cur.append("⟦/i⟧")
        if tag == "p" and self.mode == "p":
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
# T, Q, B: THE SCANS
# ---------------------------------------------------------------------------

RUNNING_HEAD = re.compile(
    r"^\s*ORIGEN\s+AGAINST\s+CELSUS\.?\s*$|^\s*\[?\s*B[O0]{2}K\s+VI\.?\s*$|^\s*CHAP\.\s+[XVILT]+\.?\]\s*$|^\s*[,;.]?\s*5[89]\d\s*$"
    r"|^\s*5[89]\d\s+ORIGEN.*$|^.*ORIGEN\s+AGAINST\s+CELSUS\.?\s+5[89]\d\s*$|^.*ORIGEN\s+AGAINST\s+CELSUS\.?\s+\[?B[O0]{2}K\s+VI\.?\s*$"
)

# The OCRs' systematic misreadings of letters the edition prints and C keeps:
# the ligature Æ (read "^", "/E", "JE" or "AE"). Seen on T's page images; made
# in the scans before the vote and counted on stderr.
OCR_EQUIV = [
    (r"(Astaph|Alo|Hor|Elo|Adon|Ph)(?:ae|ze|ee|eze|z|\^e|/E|\^)(us|non)([.,;:]?)", r"\1æ\2\3"),
    (r"(?:\^|/E|JE|AE)gina([.,;:]?)", r"Ægina\1"),
]
EQUIV_USED = Counter()


def scan_tokens(path):
    lines = open(path, encoding="utf-8", errors="replace").read().split("\n")
    persian = next(i for i, l in enumerate(lines) if re.search(r"Persian\s+mysteries,\s+where", l))
    a = max(i for i, l in enumerate(lines[:persian]) if re.match(r"^\s*CHAP\.\s+XXII\.\s*$", l))
    b = next(i for i, l in enumerate(lines) if i > persian and re.match(r"^\s*CHAP\.\s+XXXIX\.", l))
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
            words[-1] += w
            continue
        if re.fullmatch(r"CHAP\.", w) or re.fullmatch(r"[XVIL]+[.,]", w):
            continue  # the chapter headings, which C keeps apart
        if re.fullmatch(r"\d{1,2}[.,;:]?|[*^]", w):
            continue  # a footnote mark set apart by a space (C's text has no figures)
        w = re.sub(r"(?<=[.,;:!?\"'])[\d^*'\-]+$", "", w)
        w = re.sub(r"(?<=[.,;:!?])[a-z]$", "", w)  # a footnote mark read as a letter after a stop
        for pattern, repl in OCR_EQUIV:
            if re.fullmatch(pattern, w):
                EQUIV_USED[(os.path.basename(path), pattern)] += 1
                w = re.sub(pattern, repl, w)
                break
        if key(w):
            words.append(w)
    log(f"{os.path.basename(path)}: {len(words)} words")
    return words


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
# OCRs', not the book's: (the six words before, C's reading) -> why.
VOTE_REJECTED = {}


def vote(base, owner, scans):
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
        if count >= 2 and "".join(best) != "".join(segk) and seg and abs(len(best) - len(seg)) <= 1:
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

ITALICS = []


def build(d):
    units = []
    notes = []
    page = FIRST_PAGE
    for n, numeral in enumerate(NUMERALS):
        num = str(FIRST + n)
        c = ccel(os.path.join(d, f"ccel_{numeral.lower()}.html"))
        paras = [" ".join(p.split()) for p in c.paras]
        head = re.sub(r"⟦pb:(\d+)⟧", "", paras[0]).strip()
        for pb in re.findall(r"⟦pb:(\d+)⟧", paras[0]):
            page = int(pb) + PAGE_OFFSET
        assert head == f"Chapter {numeral}.", head
        assert len(paras) == 2, (numeral, len(paras))
        body = paras[1]
        start = page
        for fm in re.finditer(r"⟦fn:([^⟧]+)⟧", body):
            before = re.sub(r"⟦[^⟧]*⟧", "", body[: fm.start()]).split()[-4:]
            pages_before = re.findall(r"⟦pb:(\d+)⟧", body[: fm.start()])
            on = int(pages_before[-1]) + PAGE_OFFSET if pages_before else page
            notes.append({"chapter": num, "page": str(on), "ccel": fm.group(1), "after": " ".join(before), "text": c.notes[fm.group(1)]})
        for m in re.finditer(r"⟦i⟧(.*?)⟦/i⟧", body):
            ITALICS.append((num, m.group(1)))
        for pb in re.findall(r"⟦pb:(\d+)⟧", body):
            page = int(pb) + PAGE_OFFSET
        body = re.sub(r"⟦/?i⟧", "", body)
        body = clean_space(re.sub(r"⟦[^⟧]*⟧", " ", body))
        units.append({"chapter": num, "numeral": numeral, "firstPage": str(start), "lastPage": str(page), "text": body})
    return units, notes


# The readings the vote takes (two or three scans agreeing against C): every
# one is printed to stderr, and every one was checked on T's page images.
TAKEN_COUNT = 1

# Corrections by hand after the vote: (chapter, old, new, expected count,
# why). Every one was read on T's page images (leaves n594-n601).
FIXES = [
    ("26", "they never uttered instead", "they never uttered, instead", 1, "p. 585, left column: the comma (also in the 1872 OCR)"),
    ("32", "such mat ters.", "such matters.", 1, "pp. 587-588: C splits the word at its page anchor"),
    ("32", "was also different", "was also different.", 1, "p. 588, left column: the full stop that ends the chapter"),
    ("35", "an efflu ent", "an effluent", 1, "pp. 588-589: C splits the word at its page anchor"),
]

# The footnotes that tell the reader the Greek is uncertain or emended at that
# point, or that the English follows a conjecture; quoted in the passages'
# notes. (CCEL note id -> why)
ESSENTIAL_NOTES = {
    "vi.ix.vi.xxii-p3.2": "VI.22: 'lofty gates' renders a word Boherellus would emend to 'seven-gated'",
    "vi.ix.vi.xxii-p7.2": "VI.22: 'matter' has a variant reading, 'gate'",
    "vi.ix.vi.xxii-p8.4": "VI.22: the English follows Spencer's change to the Greek",
    "vi.ix.vi.xxix-p3.2": "VI.29: 'as you say' rests on Boherellus's proposed reading",
    "vi.ix.vi.xxxi-p13.2": "VI.31: 'sculptured' is Boherellus's conjecture, adopted in the translation",
    "vi.ix.vi.xxxiii-p3.2": "VI.33: a word (perhaps 'sword') seems to have dropped out",
    "vi.ix.vi.xxxvi-p9.1": "VI.36: Origen's statement is open to question (Mark vi. 3)",
    "vi.ix.vi.xxxviii-p3.2": "VI.38: the English follows Gelenius's emendation",
}


def main():
    d = sys.argv[1]
    units, notes = build(d)
    log(f"ITALICS dropped: {ITALICS}")
    base = []
    owner = []
    for i, u in enumerate(units):
        ws = re.sub(r"—(?=\S)", "— ", u["text"]).split()
        base.extend(ws)
        owner.extend([i] * len(ws))
    scans = {n: scan_tokens(os.path.join(d, f"{n}.txt")) for n in "TQB"}
    for (f, pattern), c in sorted(EQUIV_USED.items()):
        log(f"OCR_EQUIV {f} {pattern}: {c}")
    log(f"{len(notes)} footnotes")
    if os.environ.get("NOTES"):
        for n in notes:
            log(f"  NOTE {n['ccel']} ch.{n['chapter']} p.{n['page']} after '{n['after']}': {n['text']}")
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
        for n, (fu, old, new, _count, _why) in enumerate(FIXES):
            if fu == u["chapter"] and old in text:
                applied[n] += text.count(old)
                text = text.replace(old, new)
        u["text"] = text
        log(f"VI.{u['chapter']}: pp. {u['firstPage']}-{u['lastPage']}, {len(text.split())} words")
    for n, (fu, old, _new, count, _why) in enumerate(FIXES):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", fu, old, applied[n])
    compare(d, units)
    write(units, notes)


def looks_like_ocr(a, b):
    ka = re.sub(r"\d", "", key(" ".join(a)))
    kb = re.sub(r"\d", "", key(" ".join(b)))
    if ka == kb:
        return True
    if not ka or not kb:
        return len(ka + kb) <= 2
    return difflib.SequenceMatcher(None, ka, kb).ratio() >= 0.7


def compare(d, units):
    """N (New Advent) and E (the 1872 printing), word by word against the
    result; differences are printed, not applied."""
    ours = " ".join(u["text"] for u in units).split()
    src = open(os.path.join(d, "na_book6.html"), encoding="utf-8").read()
    na = []
    for n in range(22, 39):
        m = re.search(rf"<h2>Chapter {n}</h2>(.*?)(?=<h2>|<div class=\"pub\"|$)", src, re.S)
        t = html.unescape(re.sub(r"<[^>]+>", " ", m.group(1)))
        na.extend(t.split())
    report("New Advent", ours, na, exact=True)
    lines = open(os.path.join(d, "E.txt"), encoding="utf-8", errors="replace").read().split("\n")
    persian = next(i for i, l in enumerate(lines) if re.search(r"Persian\s+mysteries,\s+where", l))
    a = max(i for i, l in enumerate(lines[:persian]) if re.match(r"^\s*Chapter\s+xxii\.", l))
    b = next(i for i, l in enumerate(lines) if i > persian and re.match(r"^\s*Chapter\s+xxxix\.", l))
    e = re.sub(r"(\w)-[ \t]*\n[ \t]*(?=\w)", r"\1", "\n".join(lines[a + 1 : b])).split()
    report("1872", ours, e, exact=False)


def report(name, ours, other, exact):
    ok = [key(w) if not exact else w for w in ours]
    xk = [key(w) if not exact else w for w in other]
    sm = difflib.SequenceMatcher(None, ok, xk, autojunk=False)
    n = 0
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        if not exact and (i2 - i1 > 8 or j2 - j1 > 8):
            continue
        if not exact and looks_like_ocr(ours[i1:i2], other[j1:j2]):
            continue
        n += 1
        log(f"  {name}: ...{' '.join(ours[max(0, i1 - 5):i1])} [{' '.join(ours[i1:i2])}] / [{' '.join(other[j1:j2])}]")
    log(f"{name}: {n} places differ")


def note_by(text):
    if text.startswith("["):
        return "american"
    return "both" if "[" in text else "translator"


def write(units, notes):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/origen-contra-celsum.py from the CCEL transcription\n")
    w("// of The Ante-Nicene Fathers, vol. IV (Buffalo, 1885), voted against the\n")
    w("// archive.org OCR of three scans of that printing and then read against the page\n")
    w("// images of the Toronto copy. Do not edit by hand: correct the generator (its\n")
    w("// FIXES list holds every correction made by hand) and run it again.\n\n")
    w("export type OrigenUnit = {\n")
    w("  /** Book VI's chapter number, '22' to '38'. */\n  chapter: string;\n")
    w("  numeral: string;\n")
    w("  /** The printed pages of ANF vol. IV (1885) the chapter runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The chapter's one paragraph, without the footnote marks. */\n  text: string;\n};\n\n")
    w("/** The edition's footnotes: listed, not imported (see the generator). */\n")
    w("export type OrigenNote = {\n  chapter: string;\n  page: string;\n")
    w("  /** The words the note's mark follows. */\n  after: string;\n")
    w("  /** 'translator' (Crombie, 1872), 'american' (in square brackets, added in the 1885 edition) or 'both'. */\n  by: string;\n")
    w("  /** True where the note says the Greek is uncertain or emended, or the English conjectural, at that point. */\n  essential: boolean;\n")
    w("  text: string;\n};\n\n")
    w("export const ORIGEN_UNITS: OrigenUnit[] = [\n")
    for u in units:
        w(f"  {{ chapter: {json.dumps(u['chapter'])}, numeral: {json.dumps(u['numeral'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n\n")
    w("export const ORIGEN_NOTES: OrigenNote[] = [\n")
    for n in notes:
        t = n["text"]
        w(f"  {{ chapter: {json.dumps(n['chapter'])}, page: {json.dumps(n['page'])}, after: {json.dumps(n['after'], ensure_ascii=False)}, by: {json.dumps(note_by(t))}, essential: {json.dumps(n['ccel'] in ESSENTIAL_NOTES)}, text: {json.dumps(t, ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
