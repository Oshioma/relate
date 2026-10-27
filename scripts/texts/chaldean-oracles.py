"""The Chaldaean Oracles, in the English of "The Chaldaean Oracles of
Zoroaster", edited and revised by Sapere Aude (W. Wynn Westcott), with an
introduction by L. O., Collectanea Hermetica vol. VI (London: Theosophical
Publishing Society, 1895), for the texts archive (Stage 26) ->
src/lib/timeline/texts/corpus/chaldean-oracles-text.ts.

Run:  python3 -I scripts/texts/chaldean-oracles.py DIR > \
          src/lib/timeline/texts/corpus/chaldean-oracles-text.ts
(the report goes to stderr; DUMP=path also writes the voted units, before the
hand fixes, as JSON). DIR holds the OCR inputs, fetched from archive.org with
the User-Agent "relate-archive-research (repo Oshioma/relate)":

  B_djvu.xml  https://archive.org/download/WestcottWWCollectaneaHermeticaVolume06/
              Westcott W W - Collectanea Hermetica - Volume 06_djvu.xml
              A scan of the volume itself (title page: "Collectanea Hermetica
              edited by W. Wynn Westcott, M.B., D.P.H. Volume VI. The
              Chaldaean Oracles of Zoroaster edited and revised by Sapere
              Aude. With an introduction by L. O."), 54 page images with no
              imprint or date; printed page = leaf + 1 (checked on the page
              numbers). The base, and the page images every unit was read
              against (Westcott W W - Collectanea Hermetica - Volume 06_jp2.zip).
  E_djvu.txt  https://archive.org/download/collectanea-hermetica/
              Collectanea Hermetica_djvu.txt
              A different scan: a modern compilation that reproduces the
              volumes of the Collectanea Hermetica in facsimile, with its own
              running page numbers beside the original ones, OCRed by another
              engine. The same 1895 setting, a different copy and a different
              OCR.
  A_djvu.txt  https://archive.org/download/w.-wynn-westcott-the-chaldaean-
              oracles-of-zoroaster-1895/W. Wynn Westcott - The Chaldaean
              Oracles of Zoroaster, 1895_djvu.txt
              Forgotten Books' reprint (2008), which says it was "scanned and
              reformatted from the original": a new typesetting of the 1895
              text (it quotes sacred-texts.com in its own preface), so an
              independent transcription. It ends at oracle 199: it does not
              have the "Oracles from Porphyry".
Also read, not voted: the OCR of the same 54 images as B in the archive.org
item westcott-w-w-collectanea-hermetica-volume-09 (the same PDF, OCRed
again; not an independent witness), and a printout of the hermetic.com
transcription (archive.org item the-chaldean-oracles), which stops at oracle
38. sacred-texts.com and hermetic.com answered 403 to this client and
Wikisource has no transcription; esotericarchives.com did not resolve.

WHY THREE WITNESSES. Two scans of the 1895 setting (B, E) and one
independent re-typesetting (A). Where A and E agree with each other against
B, their reading is taken (the majority of three); otherwise B is kept. Then
every unit was read against the page images of B (pp. 23-54), and every
difference is in FIXES below, with its kind.

METHOD.
1. B's words are taken line by line from its djvu.xml, page by page (pp.
   23-54, leaves 22-53); the page number at the head of each page is
   dropped. Lines ending in a hyphen are joined to the next; the hyphen is
   kept only where A or E prints the word with a hyphen inside a line.
2. Units. Westcott numbers the oracles 1-199 through five sections, and then
   numbers the two "Oracles from Porphyry" 1-2. A unit begins at its number
   (the next expected number at the start of a line). Where B's OCR misreads
   a number ("i." for 1, "r6." for 16, "668." for 68, "io8." for 108, "no."
   for 110 ...) NUMBERS gives the printed number; the section headings are
   found by their words (SECTIONS). A and E are cut into units the same way.
3. The vote. Each unit's words in A and E are aligned with B's by their
   letters (difflib). Where A and E agree with each other and not with B,
   E's reading is taken (TAKEN_COUNT of them); where only one differs, B is
   kept and the image decided in proofreading.
4. Each unit is then split into Westcott's three parts: the oracle; the
   source line, the reference he prints under it (the ancient source, in his
   abbreviations, with "Z.", "T." or "Z. or T." -- see below); and his note,
   in italic in the book, where there is one. The source line of every unit
   was read off the page images and is given in SOURCES (an empty string
   where none is printed); the split is made where that line stands in the
   voted text, and the generator stops if it is not found. Where a unit has
   a note and no source line, NOTE_START gives the note's first words.
5. Proofreading. Every page, 23 to 54, was read against B's page images.
   The differences are FIXES, each (unit, old => new, kind): 99 of them (85
   misread letters or words, 8 layout, 3 punctuation, 2 spacing, 1 asterisk),
   besides the spacing rules in SPACING (OCR spaces before stops and inside
   quotation marks, closed up as the book sets them).
   Kept as printed, and not corrected: "668." for oracle 68 (p. 34), "Ficinus
   de Immortalilate Animae" (77), "unintellible" (145, split "unintelli-/ble"
   over a line), "Nicephotus" (155, "Nicephorus" at 194), "Z or. T." (110),
   "Z, or T." (120), the unopened quotation mark in 11 ("withdrawn--Arpazo")
   and the unopened one closing 178, and the note to 1, which ends without a
   stop. Rendered: the rows of spaced dots in 18 as "..." (one character);
   the ligatures ae and oe, and the diaeresis (aerial, preexistent), as
   printed. In 99-100 the "T." stands to the right between the two lines;
   it is given to 100, where B's OCR puts it (E's OCR and A drop it).
6. Checks: oracles 1-199 and Porphyry 1-2 all present, in order; no stray
   OCR marks; every source line found; the count of readings taken in the
   vote is pinned (TAKEN_COUNT).

WESTCOTT'S SIGNS. In the source lines, "Z." marks an oracle Westcott
(following Taylor) takes to be "correctly attributed to a Chaldaean
Zoroaster of very early date", from the collection of Psellus; "T." one he
attributes "to a sect of philosophers named Theurgists, who flourished
during the reign of Marcus Antoninus, upon the authority of Proclus"; "Z. or
T." the rest (Preface, p. 5). "Taylor" in a source line means Taylor gives
the oracle. Asterisks in the oracles point to Westcott's footnotes, which are
kept with his note. Italic is not kept.

NOT IMPORTED (listed in the corpus file): the Preface by Sapere Aude (pp.
3-6), the Introduction by L. O. (pp. 7-22) with its three tables (the
"Chaldaean Scheme", the "Kabalistic Scheme" and the "Chaldaean Scheme of
Beings"). Westcott's notes are kept with each unit, not in its text.
"""

import difflib
import html
import json
import os
import re
import sys
import unicodedata


def log(*a):
    print(*a, file=sys.stderr)


FIRST_PAGE, LAST_PAGE = 23, 54
LEAF_OFFSET = 1  # printed page = leaf + 1

# The six sections, in order: key, the heading as printed, the words under it,
# and the first words of the heading as B's OCR reads them (so the heading's
# lines can be dropped).
SECTIONS = [
    ("cause", "Cause. God.", "Father. Mind. Fire. Monad. Dyad. Triad.", ["THE", "ORACLES OF ZOROASTER.", "CAUSE. GOD.", "Fathp:r. Mind. Fire.", "Monad. Dyad. Triad."]),
    ("ideas", "Ideas.", "Intelligibles, Intellectuals, Iynges, Synoches, Teletarchæ, Fountains, Principles, Hecate and Dæmons.", ["IDEAS.", "InTEEEIGIBEES, Inteeeectuaes, Iynges, Synoches,", "Teeetarch^e, Fountains, Principees, Hecate", "and Daemons."]),
    ("souls", "Particular Souls.", "Soul, Life, Man.", ["PARTICULAR SOULS.", "Soul, Life, Man."]),
    ("matter", "Matter.", "The World—and Nature.", ["MATTER.", "The World — and Nature."]),
    ("precepts", "Magical and Philosophical Precepts.", "", ["MAGICAL AND PHILOSOPHICAL", "PRECEPTS."]),
    ("porphyry", "Oracles from Porphyry.", "", ["ORACLES FROM PORPHYRY."]),
]
SECTION_RANGES = {
    "cause": (1, 38),
    "ideas": (39, 77),
    "souls": (78, 98),
    "matter": (99, 143),
    "precepts": (144, 199),
    "porphyry": (1, 2),
}

# ---------------------------------------------------------------------------
# THE SCANS
# ---------------------------------------------------------------------------


def b_pages(path):
    """{page: [(x, line text)]} for pp. 23-54, the page number dropped."""
    xml = open(path, encoding="utf-8").read()
    objs = re.split(r"<OBJECT\b", xml)[1:]
    pages = {}
    for leaf, o in enumerate(objs):
        pg = leaf + LEAF_OFFSET
        if not FIRST_PAGE <= pg <= LAST_PAGE:
            continue
        lines = []
        for ln in re.findall(r"<LINE>(.*?)</LINE>", o, re.S):
            ws = re.findall(r'<WORD coords="(\d+),[^"]*"[^>]*>(.*?)</WORD>', ln, re.S)
            words = [html.unescape(w[1]).strip() for w in ws]
            words = [w for w in words if w]
            if words:
                lines.append((int(ws[0][0]), " ".join(words)))
        if lines and re.fullmatch(r"[\dIil«°oO ]{1,5}", lines[0][1]):
            lines = lines[1:]
        pages[pg] = lines
    return pages


# Unit numbers as B's OCR reads them, where it misreads them: (page, OCR, printed).
NUMBERS = [
    (23, "i.", "1."),
    (26, "13-", "13."),
    (26, "r6.", "16."),
    (26, "18", "18."),
    (29, "31 -", "31."),
    (33, "57-", "57."),
    (34, "668.", "68."),
    (35, "73-", "73."),
    (37, "85 -", "85."),
    (41, "io8.", "108."),
    (41, "no.", "110."),
    (41, "in.", "111."),
    (41, "1 13.", "113."),
    (41, "1 14.", "114."),
    (41, "1 15.", "115."),
    (41, "1 16.", "116."),
    (42, "1 17.", "117."),
    (42, "1 18.", "118."),
    (42, "1 19.", "119."),
    (42, "1 21.", "121."),
    (43, "13 1.", "131."),
    (44, "134-", "134."),
    (47, "15 1.", "151."),
    (49, "17 1.", "171."),
    (50, "175*", "175."),
    (50, "18 1.", "181."),
    (53, "i.", "1."),
]


def b_stream(pages):
    """B as one list of (page, line), headings marked '§key', numbers mended."""
    out = []
    heads = {k: list(lines) for k, _, _, lines in SECTIONS}
    pending = [k for k, *_ in SECTIONS]
    fixes = {(p, o): n for p, o, n in NUMBERS}
    used = set()
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        for x, line in pages[pg]:
            if pending and line in heads[pending[0]]:
                if line == heads[pending[0]][0]:
                    out.append((pg, "§" + pending[0]))
                heads[pending[0]].remove(line)
                if not heads[pending[0]]:
                    pending.pop(0)
                continue
            for (p, o), n in fixes.items():
                if p == pg and (line.startswith(o + " ") or line == o):
                    line = n + line[len(o):]
                    used.add((p, o))
                    break
            out.append((pg, line))
    assert not pending, ("a heading was not found", pending)
    unused = set(fixes) - used
    if unused:
        log("unused NUMBERS", sorted(unused))
    return out


def b_units(stream):
    """[{section, number, firstPage, lastPage, lines}] from B."""
    units = []
    section = None
    expect = None
    for pg, line in stream:
        if line.startswith("§"):
            section = line[1:]
            expect = SECTION_RANGES[section][0]
            continue
        m = re.match(r"(\d+) ?\.\s*(.*)$", line)
        if section and m and int(m.group(1)) == expect:
            units.append({"section": section, "number": str(expect), "firstPage": pg, "lastPage": pg, "lines": [m.group(2)] if m.group(2) else []})
            expect += 1
            continue
        if units:
            units[-1]["lines"].append(line)
            units[-1]["lastPage"] = pg
    return units


def join_lines(lines, hyphenated):
    """Lines joined into one string; a line-end hyphen is dropped unless the
    joined word is printed with a hyphen elsewhere (in A or E)."""
    text = ""
    for line in lines:
        line = line.strip()
        if not text:
            text = line
            continue
        if text.endswith("-") and not text.endswith("--") and not text.endswith(" -"):
            left = re.search(r"(\S+)-$", text).group(1)
            right = line.split(" ")[0]
            joined = f"{left}-{right}"
            if key(joined) and joined.lower().strip(".,;:!?") in hyphenated:
                text = text + line
            else:
                text = text[:-1] + line
        else:
            text = text + " " + line
    return text


# ---------------------------------------------------------------------------
# A AND E
# ---------------------------------------------------------------------------

A_JUNK = re.compile(r"ForgottenBooks|Forgotten Books|forgottenbooks|Copyrighted material|The Chald\S* Oracles of Zoroaster|^\s*\d+\s*$")
E_JUNK = re.compile(r"^\s*\d{1,3}\s+\d{1,3}\s*$|^\s*\d{1,3}\s*$")


def witness_text(path, start, stop, junk):
    """The plain-text witness between the line matching `start` and the one
    matching `stop`, its running heads and page numbers dropped."""
    raw = open(path, encoding="utf-8", errors="replace").read().split("\n")
    i0 = next(i for i, l in enumerate(raw) if re.search(start, l))
    i1 = next(i for i, l in enumerate(raw) if i > i0 and re.search(stop, l))
    return "\n".join(l for l in raw[i0:i1] if not junk.search(l))


def hyphenated_words(*texts):
    out = set()
    for t in texts:
        for m in re.finditer(r"\b[A-Za-zÆæ]+-[A-Za-zÆæ]+\b", t):
            out.add(m.group(0).lower())
    return out


def clean_witness(t):
    t = re.sub(r"-\n(?=[a-z])", "", t)
    t = t.replace("--", "—")
    return " ".join(t.split())


# ---------------------------------------------------------------------------
# THE VOTE
# ---------------------------------------------------------------------------


def key(w):
    w = w.lower().replace("æ", "ae").replace("œ", "oe")
    w = unicodedata.normalize("NFKD", w)
    return re.sub(r"[^a-z0-9]", "", w)


def aligned(b, x):
    """For each token of b, the token of x aligned with it (or None)."""
    sm = difflib.SequenceMatcher(None, [key(t) for t in b], [key(t) for t in x], autojunk=False)
    out = [None] * len(b)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal" or (op == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                out[i1 + k] = x[j1 + k]
    return out


TAKEN = []


def vote(units, a_text, e_text):
    """Vote over the whole text at once: B's words, unit by unit, aligned
    with A's and E's; where A and E agree against B, E's word is taken."""
    b, owner = [], []
    for i, u in enumerate(units):
        for t in u["b_text"].split():
            b.append(t)
            owner.append(i)
    a = aligned(b, a_text.split())
    e = aligned(b, e_text.split())
    out = [[] for _ in units]
    for i, t in enumerate(b):
        ta, te = a[i], e[i]
        if ta is not None and te is not None and key(ta) == key(te) and key(ta) != key(t) and key(te) and not re.fullmatch(r"\d+\.", te):
            u = units[owner[i]]
            TAKEN.append((u["section"], u["number"], t, te))
            out[owner[i]].append(te)
        else:
            out[owner[i]].append(t)
    for u, words in zip(units, out):
        u["voted"] = " ".join(words)


# ---------------------------------------------------------------------------
# HAND-READ PARTS AND FIXES
# ---------------------------------------------------------------------------

SPACING = [
    # The OCR spaces out punctuation and quotation marks that the book sets
    # close (or with a hair space, as was usual in 1895); these rules close
    # them up, and the count of each is logged.
    (r" +([,.;:!?)\]’”])", r"\1"),
    (r"([(\[‘“]) +", r"\1"),
    (r" *— *", "—"),
    (r"(\w)- +(?=[a-z])", r"\1-"),
]


def normalise(text):
    for pat, rep in SPACING:
        text, n = re.subn(pat, rep, text)
        SPACED[pat] = SPACED.get(pat, 0) + n
    return text


SPACED = {}


def table(block, fields):
    """Rows of a hand-written table: 'section number | field | field ...'."""
    out = []
    for line in block.strip("\n").split("\n"):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        head, *rest = [x.strip() for x in line.split(" | ")]
        sec, num = head.split()
        assert len(rest) == fields, ("bad row", line)
        out.append(((sec, num), *rest))
    return out


def parse_fixes():
    out = []
    for uid, change, kind in table(FIXES, 2):
        old, new = change.split(" => ")
        out.append((uid, old.replace("\\s", " "), new.replace("\\s", " ").replace("<nothing>", ""), kind))
    return out


def split_unit(uid, text, sources, notes):
    src = "" if sources[uid] == "<none>" else sources[uid]
    if src:
        i = text.rfind(src)
        assert i >= 0, ("source line not found", uid, src, text)
        body, rest = text[:i].strip(), text[i + len(src):].strip()
        assert body, ("nothing before the source line", uid)
    else:
        body, rest = text, ""
        if uid in notes:
            i = text.find(notes[uid])
            assert i > 0, ("note start not found", uid, notes[uid], text)
            body, rest = text[:i].strip(), text[i:].strip()
    return body, src, rest


def apply_fixes(units):
    by = {(u["section"], u["number"]): u for u in units}
    counts = {}
    for uid, old, new, kind in parse_fixes():
        u = by[uid]
        assert kind in ("ocr", "spacing", "punct", "sign", "layout", "number"), (uid, kind)
        n = u["voted"].count(old)
        assert n == 1, ("fix does not apply once", uid, old, n, u["voted"])
        u["voted"] = u["voted"].replace(old, new)
        counts[kind] = counts.get(kind, 0) + 1
    return counts


def check(units):
    want = [(s, str(n)) for s, (a, b) in SECTION_RANGES.items() for n in range(a, b + 1)]
    have = [(u["section"], u["number"]) for u in units]
    assert have == want, ("units missing or out of order", sorted(set(want) - set(have)))
    for u in units:
        for part in ("text", "source", "note"):
            assert not re.search(r"[{}_|■■^~\\]|  |\?[a-z]|[a-z]\d|\d[a-z]{2}", u[part]), ("stray mark", u["section"], u["number"], part, u[part])
            assert '"' not in u[part], ("straight quotation mark", u["section"], u["number"], part)
        assert u["text"], ("empty", u)


# ---------------------------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------------------------


def write(units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/chaldean-oracles.py from the archive.org OCR of\n")
    w("// two scans of Westcott's Chaldaean Oracles of Zoroaster (Collectanea\n")
    w("// Hermetica VI, 1895) and of Forgotten Books' reprint of it, voted and then\n")
    w("// read against the page images. Do not edit by hand: correct the generator\n")
    w("// (its FIXES list holds every correction made by hand) and run it again.\n\n")
    w("export type ChaldeanOracleUnit = {\n")
    w("  /** Westcott's section: cause, ideas, souls, matter, precepts or porphyry. */\n  section: string;\n")
    w("  /** Westcott's number: 1-199 through the first five sections, 1-2 in the Oracles from Porphyry. */\n  number: string;\n")
    w("  /** The printed pages of the 1895 volume the unit runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The oracle as printed (an asterisk points to Westcott's footnote, which is in `note`). */\n  text: string;\n")
    w("  /** Westcott's source line as printed, with his Z. / T. / Z. or T.; empty where he prints none. */\n  source: string;\n")
    w("  /** Westcott's note (in italic in the book), and any footnote; empty where there is none. */\n  note: string;\n};\n\n")
    w("export const CHALDEAN_ORACLE_SECTIONS: { key: string; heading: string; subheading: string; firstNumber: number; lastNumber: number }[] = [\n")
    for k, h, sub, _ in SECTIONS:
        a, b = SECTION_RANGES[k]
        w(f"  {{ key: {json.dumps(k)}, heading: {json.dumps(h)}, subheading: {json.dumps(sub, ensure_ascii=False)}, firstNumber: {a}, lastNumber: {b} }},\n")
    w("];\n\n")
    w("export const CHALDEAN_ORACLE_UNITS: ChaldeanOracleUnit[] = [\n")
    for u in units:
        w("  { " + ", ".join(f"{k}: {json.dumps(str(u[k]), ensure_ascii=False)}" for k in ("section", "number", "firstPage", "lastPage", "text", "source", "note")) + " },\n")
    w("];\n")


TAKEN_COUNT = 58


def main():
    d = sys.argv[1]
    pages = b_pages(os.path.join(d, "B_djvu.xml"))
    units = b_units(b_stream(pages))
    a_text = witness_text(os.path.join(d, "A_djvu.txt"), r"^THE ORACLES OF ZOROASTER", r"Read these similar books", A_JUNK)
    e_text = witness_text(os.path.join(d, "E_djvu.txt"), r"^ORACLES OF ZOROASTER\.", r"^EUPHRATES", E_JUNK)
    hy = hyphenated_words(a_text, e_text)
    for u in units:
        u["b_text"] = join_lines(u.pop("lines"), hy)
    vote(units, clean_witness(a_text), clean_witness(e_text))
    log(f"{len(units)} units; {len(TAKEN)} readings taken from A and E against B")
    for t in TAKEN:
        log("  TAKEN", t)
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    for u in units:
        u["voted"] = normalise(u["voted"])
    log("spacing closed up:", SPACED)
    counts = apply_fixes(units)
    log(f"{sum(counts.values())} fixes by hand:", counts)
    if os.environ.get("DUMP"):
        with open(os.environ["DUMP"], "w") as f:
            json.dump([{k: u[k] for k in ("section", "number", "firstPage", "lastPage", "voted")} for u in units], f, ensure_ascii=False, indent=1)
    sources = {uid: src for uid, src in table(SOURCES, 1)}
    notes = {uid: start for uid, start in table(NOTE_START, 1)}
    if len(sources) < len(units):
        log(f"only {len(sources)} source lines so far")
        return
    for u in units:
        uid = (u["section"], u["number"])
        del u["b_text"]
        u["text"], u["source"], u["note"] = split_unit(uid, u.pop("voted"), sources, notes)
    check(units)
    write(units)


# ---------------------------------------------------------------------------
# PROOFREADING: every page read against B's page images
# ---------------------------------------------------------------------------

# Each row: the unit, then 'old => new' in the voted text (\\s stands for a
# space at either end, <nothing> for an empty replacement), then the kind:
# ocr (a misread letter, word or mark), punct (a stop or quotation mark),
# spacing, sign (an asterisk), layout (words the OCR took out of order or
# split oddly where the page sets them in two columns or over a page).
FIXES = r"""
# p. 23
cause 1 | Prceparatio => Præparatio | ocr
cause 1 | mediceval => mediæval | ocr
cause 1 | ha.ve => have | ocr
cause 1 | Zo 7 'oaster => Zoroaster | ocr
cause 2 | Timceus => Timæus | ocr
# p. 24
cause 2 | Horns,—a => Horus—a | ocr
cause 2 | Ura?ios => Uranos | ocr
cause 2 | husba?id => husband | ocr
cause 4 | External i^on* => Eternal Æon* | ocr
cause 4 | ZEon => Æon | ocr
cause 6 | Chaldseans => Chaldæans | ocr
cause 6 | Phoenician => Phœnician | ocr
# p. 25
cause 6 | L,ydus => Lydus | ocr
cause 6 | T. This word => T. * This word | sign
cause 6 | SHBOH] => SHBOH, | ocr
cause 7 | ge 7 ierally => generally | ocr
cause 7 | “Subsistence Hupar => “Subsistence.” Hupar | punct
cause 8 | words f is => words,” is | punct
cause 9 | bid => but | ocr
cause 9 | ema?iation => emanation | ocr
cause 10 | Z. j. => Z. | ocr
# p. 26
cause 11 | “hastily and => “hastily,” and | punct
cause 18 | After the Paternal => … After the Paternal | layout
cause 18 | all things..... For => all things. … For | layout
# p. 27
cause 18 | Kven => Even | ocr
cause 21 | therein.she performetli => therein she performeth | ocr
# p. 28
cause 24 | 17 1 and => 171 and | ocr
cause 29 | Timceus => Timæus | ocr
# p. 29 (the OCR read the first line of 31 and of 32 after both "Triad." lines)
cause 31 | Triad. => All things are supplied from the bosom of this Triad. Lydus, De Mensibus, 20. Taylor. | layout
cause 32 | Triad. All things are supplied from the bosom of this Eydus, De Mensibus, 20. Taylor. All things are governed and subsist in this => All things are governed and subsist in this Triad. | layout
cause 34 | preexistent => preëxistent | ocr
cause 36 | in j Parmenidem => in Parmenidem | ocr
# p. 30
ideas 39 | ofthe => of the | spacing
ideas 40 | Pa? r menide?n => Parmenidem | ocr
# p. 31
ideas 44 | Th. PI., => Th. Pl., | ocr
# p. 32
ideas 53 | Triad T Among the Chaldceans => Triad.” Among the Chaldæans | ocr
ideas 53 | Fozmtains, Fo?ital => Fountains, Fontal | ocr
ideas 53 | of the Chaldceans. => of the Chaldæans. | ocr
ideas 54 | lynges => Iynges | ocr
ideas 55 | Hecate; => Hecaté; | ocr
# p. 33
ideas 65 | the Hecate => the Hecaté | ocr
# p. 34
ideas 66 | Hecate Father => Hecaté Father | ocr
ideas 67 | Empyrsean => Empyræan | ocr
ideas 70 | Damons => Dæmons | ocr
# p. 35
ideas 74 | Chaldsean => Chaldæan | ocr
ideas 74 | Plued. => Phæd. | ocr
ideas 75 | the Aerial Rulers => the Aërial Rulers | ocr
ideas 75 | the Aerial, Terrestrial => the Aërial, Terrestrial | ocr
ideas 75 | PJuzd. => Phæd. | ocr
ideas 77 | Animce => Animæ | ocr
# p. 37
souls 85 | Paean. The Oracle saith that Ascending Souls sing a Olymp. => The Oracle saith that Ascending Souls sing a Pæan. Olymp. | layout
souls 85 | Phced. => Phæd. | ocr
souls 86 | superlatively "blessed => superlatively blessed | ocr
souls 90 | empyrsean => empyræan | ocr
souls 90 | Z. orT. => Z. or T. | spacing
souls 91 | various Daemon => various Dæmon | ocr
# p. 38
souls 91 | word Demon => word Dæmon | ocr
souls 92 | Barth => Earth | ocr
# p. 39
souls 98 | (Rhea),.from => (Rhea), from | ocr
souls 98 | Grceca. => Græca. | ocr
# p. 40
matter 103 | aerial => aërial | ocr
matter 106 | PL Polit. => Pl. Polit. | ocr
# p. 41
matter 112 | there. The Ethers of the Elements therefore are Olytnpiodorus => The Ethers of the Elements therefore are there. Olytnpiodorus | layout
matter 112 | Olytnpiodorus in Phcsd. => Olympiodorus in Phæd. | ocr
matter 113 | Simp, in => Simp. in | ocr
matter 114 | Simp, in => Simp. in | ocr
# p. 42
matter 122 | Zones. Suspending their disorder in Well-disposed => Suspending their disorder in Well-disposed Zones. | layout
# p. 43
matter 128 | PL Pol. => Pl. Pol. | ocr
matter 129 | Aerial => Aërial | ocr
matter 130 | Chaldaeans => Chaldæans | ocr
# p. 44
matter 135 | Aerial => Aërial | ocr
matter 141 | lim., => Tim., | ocr
# p. 45
matter 142 | Daemons => Dæmons | ocr
matter 142 | Anon, in => Anon. in | ocr
matter 142 | bad Spirits => bad Spirit.” | ocr
matter 143 | de Vit, Ccel. => de Vit. Cœl. | ocr
precepts 144 | aerial => aërial | ocr
# p. 46
precepts 146 | P let ho => Pletho | ocr
precepts 149 | Took not => Look not | ocr
# p. 47
precepts 151 | Bring her not tain something. forth, lest in departing she rePsell., 3; Piet ho => Bring her not forth, lest in departing she retain something. Psell., 3; Pletho | layout
precepts 152 | Piet ho => Pletho | ocr
precepts 154 | Isidore, ap. => Isidore. ap. | ocr
precepts 157 | Phaed. => Phæd. | ocr
# p. 49
precepts 169 | Crat. 7 j. or T. => Crat. Z. or T. | ocr
precepts 170 | empyrsean => empyræan | ocr
precepts 174 | Eet => Let | ocr
# p. 50
precepts 177 | 33 1. => 331. | ocr
precepts 178 | Ctat. => Crat. | ocr
precepts 179 | /. Ale. => I. Alc. | ocr
precepts 180 | 21 1. => 211. | ocr
# p. 51
precepts 187 | virgin it}’. Psell.y => virginity. Psell., | ocr
# p. 52
precepts 188 | Piet ho => Pletho | ocr
precepts 190 | Test being => Lest being | ocr
precepts 191 | Demons => Dæmons | ocr
precepts 193 | vSo => So | ocr
precepts 194 | Eabourthou around the Strophalos of Hecate. => Labour thou around the Strophalos of Hecaté. | ocr
precepts 195 | Daemon => Dæmon | ocr
precepts 196 | Psell., io; => Psell., 10; | ocr
# p. 53
porphyry 1 | producetli => produceth | ocr
"""

# The source line Westcott prints under each oracle, read off the page images
# and written as the corrected voted text has it ('<none>' where he prints
# none); the unit is split there into oracle, source line and note.
SOURCES = r"""
cause 1 | Eusebius. Præparatio Evangelica, liber. I., chap. X.
cause 2 | Proclus on the Timæus of Plato, 244. Z. or T.
cause 3 | <none>
cause 4 | Taylor.—T.
cause 5 | Proclus in Theologiam Platonis, 321. T.
cause 6 | Lydus, De Mensibus, 83. T.
cause 7 | Proclus in Theologiam Platonis, 212. T.
cause 8 | Proclus in Theologiam Platonis, 386. T.
cause 9 | Psellus, 38; Pletho. Z.
cause 10 | Pletho. Z.
cause 11 | Psellus, 30; Pletho, 33. Z.
cause 12 | Proc. in Tim., 167. T.
cause 13 | Psellus, 24; Pletho, 30. Z.
cause 14 | Damascius, De Principiis. T.
cause 15 | Psellus, 35. Z.
cause 16 | Proclus in Platonis Theologiam, 365. T.
cause 17 | Proclus on the Cratylus of Plato. T.
cause 18 | Proclus in Tim. Plat., 124. Z. or T.
cause 19 | Proclus in Tim., 106. Z. or T.
cause 20 | Psellus, 28; Pletho, 11. Z.
cause 21 | Proclus in Politica, p. 399. Z. or T.
cause 22 | Proclus in Theologiam, 333, and Tim., 157. T.
cause 23 | Proclus in Parm. Platonis. T.
cause 24 | Proclus in Theologiam Platonis, 171 and 172. T.
cause 25 | Proclus in Euclidem, 27. T.
cause 26 | Proclus in Euclidem, 27. T.
cause 27 | Proclus in Platonis Theologiam, 376. T.
cause 28 | Proclus in Parmen. T.
cause 29 | Proclus, Timæus of Plato. T.
cause 30 | Lydus, De Mensibus, 20. Taylor.
cause 31 | Lydus, De Mensibus, 20. Taylor.
cause 32 | Proclus in I. Alcibiades. T.
cause 33 | Damascius, De Principiis. T.
cause 34 | Anon. Z. or T.
cause 35 | Anon. Z. or T.
cause 36 | Damascius in Parmenidem. T.
cause 37 | Anon. Z. or T.
cause 38 | Simplicius in his Physica, 143. Z. or T.
ideas 39 | Proclus in Parmenidem. Z. or T.
ideas 40 | Damascius in Parmenidem. T.
ideas 41 | Proclus in Theologiam Platonis, 205. T.
ideas 42 | Damascius, De Principiis. T.
ideas 43 | Damascius. Z. or T.
ideas 44 | Proclus, Th. Pl., 172. Z. or T.
ideas 45 | <none>
ideas 46 | Proclus in Crat. T.
ideas 47 | Proclus in Cratylum. T.
ideas 48 | Dam., De Prin. T.
ideas 49 | Damascius, De Principiis. T.
ideas 50 | Dam., De Prin. T.
ideas 51 | Proclus in Cratylum. T.
ideas 52 | Proclus in Cratylum. T.
ideas 53 | Proclus, Theologiam Platonis. T.
ideas 54 | Psellus, 41; Pletho, 31. Z.
ideas 55 | Proclus in Tim., 128. T.
ideas 56 | Dam., De Prin. T.
ideas 57 | T.
ideas 58 | Dam., De Prin. T.
ideas 59 | Proc. in Crat. T.
ideas 60 | Dam., De Prin. T.
ideas 61 | Dam. T.
ideas 62 | Dam. T.
ideas 63 | Proc. in Parm. T.
ideas 64 | <none>
ideas 65 | T.
ideas 66 | Proc. in Crat. T.
ideas 67 | Proc. in Tim. Z. or T.
ideas 68 | Dam., De Prin.
ideas 69 | Dam., De Prin. T.
ideas 70 | Dam. in Parm. Z. or T.
ideas 71 | Proc. in Tim., 242.
ideas 72 | Proc. in Parm. Z. or T.
ideas 73 | Dam., De Prin. Z. or T.
ideas 74 | Olymp. in Phæd. T.
ideas 75 | Olymp. in Phæd. T.
ideas 76 | Proc. in Tim., 270. T.
ideas 77 | Ficinus de Immortalilate Animæ, 123. T.
souls 78 | Proc. in Tim., 336. T.
souls 79 | <none>
souls 80 | Psell., 26; Pletho, 6. Z.
souls 81 | Lyd. De Men., 3.
souls 82 | Proc. in Pl. Theol, 4. Z or T.
souls 83 | Psellus, 17; Pletho, 10. Z.
souls 84 | Proclus in I. Alc. Z.
souls 85 | Olymp. in Phæd. Z or T.
souls 86 | Synes. De Insom, 153. Z or T.
souls 87 | Psellus, 27. Z.
souls 88 | Psellus, 32; Pletho, 8. Z.
souls 89 | Z. or T.
souls 90 | Proc. in Tim., 321. Z. or T.
souls 91 | Synesius De Insom. Z. or T.
souls 92 | Z. or T.
souls 93 | Proc. in Tim., 318. Z.
souls 94 | Psell., 12; Pletho, 21. Z.
souls 95 | Psell., 36; Pletho, 7. Z.
souls 96 | Ficin. De Im. An., 129. Z.
souls 97 | Ficin. De Im. An., 131. Z.
souls 98 | Proclus de Providentia apud Fabricium in Biblioth. Græca., vol. 8, 486. Z. or T.
matter 99 | <none>
matter 100 | T.
matter 101 | Proc. in Tim., 118. T.
matter 102 | Dam, De Prin. T.
matter 103 | Lydus., p. 32.
matter 104 | Proc. de Prov. Z. or T.
matter 105 | Proc., Tim., 142. Z. or T.
matter 106 | Proc. in Pl. Polit., 359. Z. or T.
matter 107 | Proc. in Tim., 155. T.
matter 108 | Proc. in Tim., 154. Z. or T.
matter 109 | <none>
matter 110 | Proc. in Tim., 87. Z or. T.
matter 111 | Proc. in Crat. Z. or T.
matter 112 | Olympiodorus in Phæd. Z. or T.
matter 113 | Simp. in Phys., 144. Z. or T.
matter 114 | Simp. in Phys., 143. Z. or T.
matter 115 | <none>
matter 116 | Proc. in Tim., 339. Z. or T.
matter 117 | Z. or T.
matter 118 | Z. or T.
matter 119 | Proc. in Tim., 280. Z. or T.
matter 120 | Dam. in Parm. Z, or T.
matter 121 | Z. or T.
matter 122 | Z. or T.
matter 123 | Proc. in Tim., 280. Z. or T.
matter 124 | Proc. in Euclidem.
matter 125 | Proc. in Plat. Th., 317. Z. or T.
matter 126 | Proc. in Tim., 236. T.
matter 127 | <none>
matter 128 | Proc. in Pl. Pol. 387. T.
matter 129 | Proc. in Tim., 257. Z. or T.
matter 130 | Proc. in Tim., 264. Z. or T.
matter 131 | Proc. in Tim., 249. Z. or T.
matter 132 | Jul., Crat., 5, 334. Z. or T.
matter 133 | Proc. in Tim., 141. Z. or T.
matter 134 | <none>
matter 135 | Proclus in Tim., 257. Z. or T.
matter 136 | Proc. in Tim., 257. Z. or T.
matter 137 | Proc. in Tim., 257. Z. or T.
matter 138 | <none>
matter 139 | <none>
matter 140 | Proc. in Tim., 4, 323. Z. or T.
matter 141 | Proc. in Tim., 4. T.
matter 142 | Anon. in Theologumenis Arithmeticis. Z.
matter 143 | Ficinus, de Vit. Cœl. Comp. Z.
precepts 144 | Psel., 4. Z.
precepts 145 | Synes., de Insom., 140. Z. or T.
precepts 146 | Psell., 6; Pletho, 2. Z.
precepts 147 | Psell., 1, 2; Pletho, 14; Synesius, 140. Z.
precepts 148 | Psell., 15; Pletho, 23. Z.
precepts 149 | Proc. in Plat. Th., 143. Z.
precepts 150 | Proc. in I. Alcib. Z. or T.
precepts 151 | Psell., 3; Pletho, 15. Z.
precepts 152 | Psell., 19; Pletho, 13. Z.
precepts 153 | Psell., 37; Pletho, 4.
precepts 154 | Dam. in Vitam Isidore. ap. Suidam Z. or T.
precepts 155 | Psell., 7. Nicephotus. Z. or T.
precepts 156 | Picus de Mirandula, Concl. Z.
precepts 157 | Olymp. in Phæd. Proc. in Alcib. Z. or T.
precepts 158 | Proc. in Tim., 65. Z. or T.
precepts 159 | Proc. in Crat. Z. or T.
precepts 160 | Psell., 33. Pletho, 6. Z.
precepts 161 | Psell., 41. Pletho, 27. Z.
precepts 162 | Psell., 41. Pletho, 27. Z.
precepts 163 | Psell., 31. Pletho, 28. Z.
precepts 164 | Psell., 39. Pletho, 5. Z.
precepts 165 | Synes., de Insomn, 135. Z. or T.
precepts 166 | Dam. T.
precepts 167 | Damascius, de primis principiis. T.
precepts 168 | Dam. Z. or T.
precepts 169 | Proc. in Crat. Z. or T.
precepts 170 | <none>
precepts 171 | Proc. in Pl. Th., 324. T.
precepts 172 | Psell., 5. Pletho, 1. Z.
precepts 173 | Psell., 11. Pletho, 24. Z.
precepts 174 | Psell., 11. Pletho, 20.
precepts 175 | Lyd., De Men., 2.
precepts 176 | Psell., 22. Pletho, 16. Z.
precepts 177 | Proc. in Tim., 331. Taylor.
precepts 178 | Jul., Crat. v., p. 334. Z. or T.
precepts 179 | Proc. in I. Alc. Z. or T.
precepts 180 | I. Pic., p. 211. Z.
precepts 181 | Proc., de Prov., p. 483. Z. or T.
precepts 182 | <none>
precepts 183 | Proc. in Parm. Z. or T.
precepts 184 | Proc. in Platonis Pol., 355. Z. or T.
precepts 185 | Lyd., De men. Taylor.
precepts 186 | Lyd., p. 121.
precepts 187 | Psell., 13; Pletho, 9. Z.
precepts 188 | Psell., 21; Pletho, 3. Z.
precepts 189 | Psell., 26; Pletho, 19. Z.
precepts 190 | Proc. in Theol., 297. Z. or T.
precepts 191 | Psell., 16; Pletho, 18. Z.
precepts 192 | Pic. Concl. Z.
precepts 193 | Proc. in Crat. Z. or T.
precepts 194 | Psell., 9. Nicephorus.
precepts 195 | Psell., 40. Z.
precepts 196 | Psell., 10; Pletho, 22. Z.
precepts 197 | Psell, 23; Pletho, 10. Z.
precepts 198 | Proc. in Pl. Polit., 380; Stanley Hist. Philos. Z. or T.
precepts 199 | Psell., 14; Pletho, 25. Z.
porphyry 1 | <none>
porphyry 2 | <none>
"""

# Where a unit has a note but no source line: the note's first words.
NOTE_START = r"""
cause 3 | Cory includes this Oracle
"""


if __name__ == "__main__":
    main()
