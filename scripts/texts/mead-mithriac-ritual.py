"""The "Mithras Liturgy" (PGM IV 475-829) in G. R. S. Mead's English, A Mithriac
Ritual (Echoes from the Gnosis, vol. VI; London and Benares: Theosophical
Publishing Society, 1907), for the texts archive (Stage 20) ->
src/lib/timeline/texts/corpus/mithras-liturgy-text.ts.

THE BOOK. "Echoes from the Gnosis by G. R. S. Mead. Vol. VI. A Mithriac
Ritual. The Theosophical Publishing Society, London and Benares, 1907" (title
page, seen on the Toronto scan). 77 pp.:
  pp. 9-17    Preamble                                         whole
  pp. 18-33   The Ritual, sections I-XIV                       whole
  pp. 34-77   Comments (Mead's commentary, section by section)   not imported
Before the Preamble: a list of the series (vols. I-VI and "some proposed
subjects"), Mead's note on the series signed "G. R. S. M.", the contents, and
a one-line note on the text: "Text: Dieterich (A.), Eine Mithrasliturgie
(Leipzig, 1903)." Mead's translation is made from Dieterich's Greek; he says
(p. 12) that the "mantric formulae" inserted by "the Egyptian magical school"
"are, of course, entirely eliminated from the translation, while the former"
(the names of power he takes to be original) "are marked by obeli" (printed
as †). One run of vowels is printed in full in section VII (p. 26).

The Comments are 44 pages, longer than the Ritual itself, and read it as a
"yoga-rite" in Theosophical terms; they are listed, not imported. The Preamble
is nine small pages, and it is where Mead gives the papyrus, its date and
Dieterich's dating, and his method, so it is imported whole.

WITNESSES. No proofread transcription of the 1907 book, and no Gutenberg or
Wikisource text, could be reached (sacred-texts.com and gallica.bnf.fr refused
the requests). Three independent scans of three copies of the 1907 printing,
each with archive.org's OCR, were compared:
  H  amythicritu06meaduoft (University of Toronto, Robarts Library), djvu.txt.
     THE BASE. Its page images (the PDF in the same item) are the ones the
     text was read against: PDF page = printed page + 5.
  G  amithriacritual00meadgoog (Google's scan of a copy from an unnamed
     library), djvu.txt.
  S  ult.mithriacritualvo0000grsm (Servants of Knowledge scan, scanning
     centre tt_sok), djvu.txt.
A fourth item, MeadGRSEchoesFromTheGnosisVolVIAMithriacRitual1907, carries
on its cover the same Robarts call number as H ("BT 1390 .M44 1906 v. 6"), so
it is another OCR of the Toronto copy, not an independent witness; it was not
used.

THE VOTE. Each witness is cut to the Preamble and the Ritual (from "PREAMBLE."
to "COMMENTS."), page numbers, signature marks, the section headings and
Mead's marginal running head ("A / MITHRIAC / RITUAL.", which the OCR of H
runs into the first lines of every page) are taken out, and words broken at a
line end are joined. H's words are then aligned with G's and with S's
(difflib, on letters only). Between any two places where all three agree,
if G and S have the same words (by letters) and H has others, theirs are
taken; otherwise H's stay. Every reading taken is printed to stderr, and the
count is asserted (TAKEN_COUNT).

THE PROOFREADING. Because the text is short, every page of the Preamble and
the Ritual (pp. 9-33) was then read against H's page images, line by line, and
every remaining difference corrected by hand in FIXES, each with its page. The
OCRs share some errors: Mead's obelus (†) is read as "f", "4" or "/", the
italic capital I as "/", Æ as "JE" or "M", and his macrons on the vowels of
p. 26 are lost; all of these were restored from the images. Punctuation was
checked on the images too. Italic is not marked (Mead prints the prayers and
utterances in italic and the rubrics in roman, p. 17).

HOW THE TEXT IS GIVEN. One unit for the Preamble and one for each of Mead's
fourteen sections; each section's heading (numeral and title, Mead's square
brackets kept) is given apart from its text. Mead's numbered paragraphs keep
their numbers ("1.", "2."). Paragraphs are as printed, read on the images.
"—" is a closed-up dash. Mead's square brackets (his supplements) and round
brackets are his. The vowels of p. 26 are given with his macrons (ē, ō) and
raised points (·).

Usage:
  python3 -I scripts/texts/mead-mithriac-ritual.py DIR > src/lib/timeline/texts/corpus/mithras-liturgy-text.ts
where DIR holds H.txt, G.txt and S.txt (the three djvu.txt files named above).
"""

import difflib
import json
import os
import re
import sys
from collections import Counter


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    for a, b in (("àáâäã", "a"), ("èéêëē", "e"), ("ìíîï", "i"), ("òóôöõō", "o"), ("ùúûü", "u")):
        w = re.sub(f"[{a}]", b, w)
    return re.sub(r"[^a-z0-9]", "", w)


# ---------------------------------------------------------------------------
# THE UNITS: (id, numeral, heading as printed, first words of the text, pages).
# The headings and pages were read on H's page images.
# ---------------------------------------------------------------------------

UNITS = [
    ("preamble", "", "Preamble", "The last little volume gave the reader", "9", "17"),
    ("1", "I", "[The Father's Prayer.]", "O Providence, O Fortune, bestow on me", "18", "18"),
    ("2", "II", "The Invocatory Utterance (Logos).", "O Primal Origin of my origination", "18", "21"),
    ("3", "III", "[The First Instruction.]", "Take from the [Sun-]rays breath", "21", "22"),
    ("4", "IV", "[The First Utterance.]", "O Silence! Silence! Silence!", "22", "23"),
    ("5", "V", "[The Second Instruction.]", "When, then, thou see'st the Upper", "23", "23"),
    ("6", "VI", "The [Second] Utterance (Logos).", "O Silence! Silence!", "24", "24"),
    ("7", "VII", "The Third Utterance (Logos).", "Hear me, give ear to me", "25", "27"),
    ("8", "VIII", "[The Fourth Utterance.]", "Draw nigh, O Lord!", "27", "27"),
    ("9", "IX", "[The Fifth Utterance.]", "Hail Lord! O Thou of mighty", "28", "29"),
    ("10", "X", "[The Sixth Utterance.]", "Protect me!", "29", "29"),
    ("11", "XI", "[The Seventh Utterance.]", "Hail Heaven's Seven Fortunes", "30", "30"),
    ("12", "XII", "[The Eighth Utterance.]", "Hail Guardians of the Pivot", "31", "32"),
    ("13", "XIII", "[The Ninth Utterance.]", "Lord] of me", "33", "33"),
    ("14", "XIV", "[The Tenth Utterance.]", "Hail Lord, Thou Master of the Water", "33", "33"),
]

# The heading lines, in capitals as printed, and the running head; lines
# whose letters match one of these (closely) are taken out of every witness.
HEADING_LINES = [
    "A MITHRIAC RITUAL", "PREAMBLE", "THE RITUAL", "THE FATHERS PRAYER", "THE INVOCATORY", "UTTERANCE LOGOS",
    "THE FIRST INSTRUCTION", "THE FIRST UTTERANCE", "THE SECOND INSTRUCTION", "THE SECOND", "THE THIRD",
    "THE FOURTH UTTERANCE", "THE FIFTH UTTERANCE", "THE SIXTH UTTERANCE", "THE SEVENTH UTTERANCE",
    "THE EIGHTH UTTERANCE", "THE NINTH UTTERANCE", "THE TENTH UTTERANCE", "MITHRIAC", "RITUAL", "A MITHRIAC",
    "MITHRIAC RITUAL", "A", "A RITUAL", "THE SECOND UTTERANCE LOGOS", "THE THIRD UTTERANCE LOGOS", "THE INVOCATORY UTTERANCE LOGOS",
]
HEADING_KEYS = [re.sub(r"[^a-z]", "", h.lower()) for h in HEADING_LINES]
ROMAN_LINE = re.compile(r"^\s*[\[(|]?\s*[IVXLl1!|]{1,5}\s*[.,:]?\s*[\])|]?\s*$")
PAGE_LINE = re.compile(r"^\s*[A-Za-z]?\s*[\dIl!][\dIl!]?\s*$|^\s*[a-z]?\d{1,2}\s*$|^\s*(c|C|D|a)\s*\d{1,2}\s*$")


def is_dropped(line):
    s = line.strip()
    if not s:
        return False
    if ROMAN_LINE.match(s) or PAGE_LINE.match(s):
        return True
    letters = re.sub(r"[^a-z]", "", s.lower())
    if not letters:
        return True  # stray marks
    if len(letters) <= 30:
        for h in HEADING_KEYS:
            if letters == h or (len(letters) >= 6 and difflib.SequenceMatcher(None, letters, h).ratio() >= 0.85):
                return True
    return False


MARGIN_WORDS = ["MITHRIAC", "RITUAL", "RITUALAC", "AMITHRIAC"]


def is_margin_token(tok):
    """The OCR of the running head printed in the margin beside the first lines of
    every page: 'A', 'MITHRIAC', 'RITUAL.' and their garbles ('^ITHRIAC',
    'ATTHPTAr', 'MTTWPTAP', 'A/TTTT-TRT')."""
    if tok == "A":
        return True
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) < 3:
        return False
    upper = sum(1 for c in letters if c.isupper()) / len(letters)
    if upper < 0.6:
        return False
    return max(difflib.SequenceMatcher(None, letters.upper(), m).ratio() for m in MARGIN_WORDS) >= 0.45


MARGIN_OUT = Counter()


def strip_margin(line, name):
    """Running-head tokens at the end of a line, or at its start before a word in
    lower case, are taken out (the text's own capitals are never at such places
    on these pages; every removal is logged)."""
    toks = line.split()
    out = list(toks)
    while out and is_margin_token(out[-1]) and len(out) > 1:
        MARGIN_OUT[name] += 1
        log(f"  {name} margin out (end): {out[-1]!r} in {line.strip()!r}")
        out.pop()
    while len(out) > 1 and is_margin_token(out[0]) and out[0] != "A" and out[1][:1].islower():
        MARGIN_OUT[name] += 1
        log(f"  {name} margin out (start): {out[0]!r} in {line.strip()!r}")
        out.pop(0)
    if len(out) > 1 and out[0] == "A" and re.match(r"^\s*A {2,}", line) and out[1][:1].islower():
        MARGIN_OUT[name] += 1
        log(f"  {name} margin out (start): 'A' in {line.strip()!r}")
        out.pop(0)
    return " ".join(out) if out != toks else line


def region(lines):
    """From the body's 'PREAMBLE.' to the body's 'COMMENTS.'."""
    a = next(i for i, l in enumerate(lines) if l.strip() == "PREAMBLE." and any("last little volume" in " ".join(x.split()) for x in lines[i:i + 8]))
    b = next(i for i, l in enumerate(lines) if i > a and l.strip().startswith("COMMENTS"))
    return lines[a + 1:b]


def tokens(path):
    """A witness -> [word or '¶'] for the Preamble and the Ritual."""
    lines = open(path, encoding="utf-8", errors="replace").read().split("\n")
    kept = []
    dropped = Counter()
    for line in region(lines):
        if is_dropped(line):
            dropped["lines"] += 1
            kept.append("")  # a dropped line ends a block, like a blank one
            continue
        kept.append(strip_margin(line.rstrip(), os.path.basename(path)))
    text = "\n".join(kept)
    for a, b in (("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"), ("—", " — "), ("--", " — "), ("■", " "), ("­", "")):
        text = text.replace(a, b)
    # a word broken at a line end: joined, with "¦" where the hyphen was (see KEEP_HYPHEN)
    text = re.sub(r"(\w)[-¬][ \t]*\n[ \t]*(?=\w)", r"\1¦", text)
    out = []
    quote_open = False
    for block in re.split(r"\n[ \t]*\n", text):
        # the OCR reads the vocative "O" as a nought; the book has no lone "0"
        raw = [re.sub(r"^0(?=\W*$)", "O", w) for w in block.split() if w.strip()]
        # Stops and quotation marks set apart by a space are put back on their
        # word: a stop on the word before; a lone double quotation mark on the
        # next word if it opens a quotation, on the word before if it closes one.
        ws = []
        for w in raw:
            if w == '"' or w == "''":
                if quote_open and ws:
                    ws[-1] += '"'
                else:
                    ws.append('"\u0002')
                quote_open = not quote_open
                continue
            quote_open ^= w.count('"') % 2 == 1
            if ws and ws[-1].endswith("\u0002"):
                ws[-1] = ws[-1][:-1] + w
            elif re.fullmatch(r"[;:,.!?]+", w) and ws and ws[-1] not in ("—",):
                ws[-1] += w
            else:
                ws.append(w)
        ws = [w.replace("\u0002", "") for w in ws]
        ws = [w for w in ws if key(w) or w in ("—", "!", "?", "·")]
        if ws:
            out.append("¶")
            out.extend(ws)
    log(f"{os.path.basename(path)}: {sum(1 for t in out if t != '¶')} words; {dropped['lines']} lines dropped")
    return out


# ---------------------------------------------------------------------------
# THE VOTE
# ---------------------------------------------------------------------------


def words_only(toks):
    return [t for t in toks if t != "¶"]


def anchors(hk, xk):
    """For each boundary of H (0..n), the boundary in X where both sides agree, else None."""
    sm = difflib.SequenceMatcher(None, hk, xk, autojunk=False)
    at = [None] * (len(hk) + 1)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for d in range(i2 - i1 + 1):
                at[i1 + d] = j1 + d
    at[0] = 0
    at[len(hk)] = len(xk)
    return at, sm.ratio()


TAKEN = []


def vote(h, g, s):
    """H's tokens with the readings G and S agree on against H."""
    hw = words_only(h)
    gw, sw = words_only(g), words_only(s)
    hk, gk, sk = [key(w) for w in hw], [key(w) for w in gw], [key(w) for w in sw]
    ag, rg = anchors(hk, gk)
    as_, rs = anchors(hk, sk)
    log(f"agreement of H with G {rg:.3f}, with S {rs:.3f}")
    # the paragraph marks of H, by the index of the word they stand before
    marks = set()
    n = 0
    for t in h:
        if t == "¶":
            marks.add(n)
        else:
            n += 1
    bounds = [b for b in range(len(hw) + 1) if ag[b] is not None and as_[b] is not None]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        hseg = hw[b1:b2]
        gseg, sseg = gw[ag[b1]:ag[b2]], sw[as_[b1]:as_[b2]]
        hks, gks, sks = [key(w) for w in hseg], [key(w) for w in gseg], [key(w) for w in sseg]
        new = hseg
        if gks == sks and gks != hks:
            new = sseg
            ctx = " ".join(hw[max(0, b1 - 5):b1])
            TAKEN.append((ctx, " ".join(hseg), " ".join(sseg)))
            log(f"  TAKEN: ...{ctx} [{' '.join(hseg)}] -> [{' '.join(sseg)}] (G: {' '.join(gseg)})")
        elif "".join(gks) != "".join(hks) or "".join(sks) != "".join(hks):
            ctx = " ".join(hw[max(0, b1 - 5):b1])
            log(f"  differ, H kept: ...{ctx} H[{' '.join(hseg)}] G[{' '.join(gseg)}] S[{' '.join(sseg)}]")
        if b1 in marks:
            out.append("¶")
        out.extend(new)
    return out


# ---------------------------------------------------------------------------
# Units and paragraphs
# ---------------------------------------------------------------------------


def split_units(toks):
    ks = [key(t) if t != "¶" else "¶" for t in toks]
    starts = []
    for uid, _num, _head, opening, _a, _b in UNITS:
        ok = [key(w) for w in opening.split() if key(w)]
        hit = None
        for i in range(starts[-1] + 1 if starts else 0, len(ks)):
            run = [k for k in ks[i:i + len(ok) * 3] if k not in ("¶", "")][: len(ok)]
            if ks[i] == ok[0] and run == ok:
                hit = i
                break
        assert hit is not None, ("unit opening not found", uid, opening)
        # Mead's paragraph number "1." before the opening (read "i." or "!." by the OCR)
        j = hit - 1
        while j >= 0 and toks[j] == "¶":
            j -= 1
        if j >= 0 and re.fullmatch(r"[1il!If]\.?", toks[j]):
            hit = j
        # a unit begins a paragraph: back to it (over an obelus or a "[O" before the opening words)
        back = next((k for k in range(hit, max(-1, hit - 4), -1) if toks[k] == "¶"), None)
        if back is not None:
            hit = back
        starts.append(hit)
    units = {}
    for n, (uid, *_rest) in enumerate(UNITS):
        a = starts[n]
        b = starts[n + 1] if n + 1 < len(UNITS) else len(toks)
        units[uid] = toks[a:b]
    return units


def paragraphs(toks):
    """A '¶' of the OCR is kept where the word before ends a sentence or an
    utterance and the next begins with a capital, a figure or a bracket.
    PARAGRAPH_FIXES then sets the rest as printed."""
    paras, cur = [], []
    for i, t in enumerate(toks):
        if t == "¶":
            if cur:
                prev = cur[-1]
                nxt = next((x for x in toks[i + 1:] if x != "¶"), "")
                if re.search(r"[.!?:;)\]]['\"]?$", prev) and re.match(r"^['\"\[(]?[A-Z0-9/]", nxt):
                    paras.append(cur)
                    cur = []
            continue
        cur.append(t)
    if cur:
        paras.append(cur)
    out = []
    for p in paras:
        s = " ".join(p)
        s = re.sub(r"\s*—\s*", "—", s)
        s = re.sub(r"\s+([,.;:!?)\]])", r"\1", s)
        s = re.sub(r"([(\[])\s+", r"\1", s)
        out.append(s)
    return out


# Line-end hyphens. Where the book breaks a word at a line end, the hyphen
# is taken out when the break falls inside a simple word or before a suffix
# (com-manded, parent-age, un-articulated, heaven-wards, Arch-angel); it is
# kept when the word is a compound of two words, as the book's style is (it
# prints Fire-loosener, Fire-whirler, root-sounds, root-substance, life-breaths
# inside the line, and "birth-and-death" inside a line on p. 77). These are the
# words kept so, each read on the page images; the others printed only at a
# line end are a choice of this edition, not a reading. (word, expected count)
KEEP_HYPHEN = [
    ("vowel-combinations", 1),  # p. 10
    ("lyre-strings", 1),  # p. 15
    ("awe-struck", 1),  # p. 15
    ("root-idea", 1),  # p. 16 (root-sounds, root-substance inside the line, pp. 14, 17)
    ("Earth-essence", 1),  # p. 19
    ("thunder-clap", 1),  # p. 23
    ("Fire-sower", 1),  # p. 25 (Fire-loosener, Fire-whirler, Fire-hearted inside the line)
    ("horn-note", 1),  # p. 29
    ("serpent-faces", 1),  # p. 29
    ("birth-and-death", 1),  # p. 33 (inside a line on p. 77)
]

# The readings the vote takes (G and S agreeing against H): every one is
# printed to stderr, and was checked on the page images.
TAKEN_COUNT = 42

HAILS = "\n\n".join(f"Hail thou, the {n}, †!" for n in ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"])

# Corrections by hand: (unit, old, new, expected count, why). Every one was
# read on the page images of H (PDF page = printed page + 5); after them the
# text of every page was read against its image.
FIXES = [
    # The Preamble
    ("preamble", "take Part' whereas", "take part, whereas", 1, "p. 10"),
    ("preamble", "(Supplement grec de la Bibliotheque nationale)", "(Supplément grec de la Bibliothèque nationale)", 1, "p. 10: the accents"),
    ("preamble", "now ^unintelligible", "now unintelligible", 1, "p. 10"),
    ("preamble", "(aV^a ovo^ara,", "(ἄσημα ὀνόματα,", 1, "p. 10: the Greek, which no OCR reads"),
    ("preamble", "(voces mystica)", "(voces mysticæ)", 1, "p. 11"),
    ("preamble", "theurgic language which", "theurgic language, which", 1, "p. 11: the comma before the margin's 'A'"),
    ("preamble", "Egypt and Chaldaea", "Egypt and Chaldæa", 1, "p. 11"),
    ("preamble", "mantra-vidya,", "mantra-vidyā,", 1, "p. 11: the macron"),
    ("preamble", "mantrah,", "mantrāḥ,", 1, "p. 11: the macron and the dot below"),
    ("preamble", "mysticcz voces", "mysticæ voces", 1, "p. 11"),
    ("preamble", "from Chaldsea?", "from Chaldæa?", 1, "p. 12"),
    ("preamble", "mantric formulae", "māntric formulæ", 1, "p. 12"),
    ("preamble", "members of j i... -o'j. i the most", "members of the most", 1, "p. 13: OCR of the margin"),
    ("preamble", "On RITUAL Interpretation", "On Interpretation", 1, "p. 14: the margin"),
    ("preamble", "crf/oty/xo? and TroTTTrucr/xo?,", "συριγμὸς and ποππυσμός,", 1, "p. 15: the Greek, which no OCR reads"),
    ("preamble", "means of hissings and poppings and", "means of 'hissings' and 'poppings' and", 1, "p. 15: single quotation marks"),
    ("preamble", "onomatopoiia or onomatopoiesis", "onomatopoiía or onomatopoíēsis", 1, "p. 16: the accents and the macron"),
    ("preamble", "psychic aurae,", "psychic auræ,", 1, "p. 17"),
    ("preamble", "or pranks,", "or prāṇa's,", 1, "p. 17"),
    ("preamble", "or Atmic Energy", "or Ātmic Energy", 1, "p. 17"),
    ("preamble", "(hatha-yoga)", "(haṭha-yoga)", 1, "p. 17: the dot below"),
    # II
    ("2", "i. O Primal", "1. O Primal", 1, "p. 18: the paragraph number"),
    ("2", "my substance;\n\nFirst Breath", "my substance; First Breath", 1, "pp. 18-19: the page break is not a paragraph"),
    ("2", "son of N. N. (fern.)", "son of N. N. (fem.)", 1, "p. 19"),
    ("2", "the Deep MI AC of the", "the Deep of the", 1, "p. 20: the margin"),
    ("2", "JEther", "Æther", 1, "p. 20"),
    ("2", "—{I am", "—[I am", 1, "p. 20"),
    ("2", "JEon,", "Æon,", 1, "p. 20"),
    ("2", "[now'] purified", "[now] purified", 1, "p. 20"),
    # III
    ("3", "heavenwards. the other", "heavenwards, the other", 1, "p. 21"),
    ("3", "mY Father's", "my Father's", 1, "p. 22"),
    # IV: the run of short lines on p. 23, read whole
    ("4", "The Symbol of the Living God beyond Protect me, Silence! f!\n\nNext \"hiss\" forth long: S S! Then \"puff\" saying:",
     "The Symbol of the Living God beyond Decay.\n\nProtect me, Silence! †!\n\nNext \"hiss\" forth long: S̄! S̄!\n\nThen \"puff\" saying: †!", 1,
     "p. 23: 'Decay.' (in the margin's line), the obeli, and the S with a bar above"),
    # VI
    ("6", "i. O Silence! Silence!\n\nI am a Star", "1. O Silence! Silence! I am a Star", 1, "p. 24: one paragraph, two lines"),
    ("6", "Depth f.", "Depth †.", 1, "p. 24: the obelus"),
    # VII
    ("7", "(fern.)—O Lord, who w^ Thy Breath", "(fem.)—O Lord, who with Thy Breath", 1, "p. 25"),
    ("7", "Beau teous", "Beauteous", 1, "p. 25"),
    ("7", "settfst", "sett'st", 1, "p. 25"),
    ("7", "Star-tamer 2. Oh!", "Star-tamer!\n\n2. Oh!", 1, "p. 25"),
    ("7", "made A/TTTT-TRT Af articulate", "made articulate", 1, "p. 26: the margin"),
    ("7", "Fed oeeo ibb oe eed eed oeeo ibb oeee dee doe ie ed od oe ieb oe doe iedoe ieed ee id oe ioe ded eoe oed die bleed oi Hi eoe due ed oee edeia aeaeea eeee eee eee ieb eed oeeeoe eeo eud oe eid ed de de de ee ooouide!",
     "Ēeō · oēeō · iōō · oē · ēeō · ēeō · oēeō · iōō · oēēe · ōēe · ōoē · iē · ēō · oō · oē · ieō · oē · ōoē · ieōoē · ieeō · eē · iō · oē · ioē · ōēō · eoē · oeō · ōiē · ōiēeō · oi · iii · ēoē · ōuē · ēō · oēe · eōēia · aēaeēa · ēeeē · eeē · eeē · ieō · ēeō · oēeeoē · ēeō · euō · oē · eiō · ēō · ōē · ōē · ōē · ee · ooouiōē!", 1,
     "p. 26: the vowels, read on the page image at 500 dpi, with Mead's macrons and raised points"),
    ("7", "re stored", "restored", 1, "p. 27"),
    # VIII
    ("8", "Salu tation", "Salutation", 1, "p. 27"),
    # IX
    ("9", "A!. Hail Lord!", "1. Hail Lord!", 1, "p. 28: the margin and the paragraph number"),
    ("9", "N.N. (fern.), born", "N.N. (fem.), born", 1, "p. 28"),
    ("9", "spermatic ichor,", "spermatic ichōr,", 1, "p. 28: the macron"),
    ("9", "[ichor']", "[ichōr]", 1, "p. 28"),
    ("9", "re-birth—one,", "re-birth—, one,", 1, "p. 28: the comma after the dash"),
    ("9", "Good—[a man", "Good—, [a man", 1, "p. 28: the comma after the dash"),
    ("9", "3- Upon", "3. Upon", 1, "p. 29"),
    # X
    ("10", "Protect me! f!", "Protect me! †!", 1, "p. 29: the obelus"),
    # XI
    ("11", "MITHRIAC If Hail Heaven's", "1. Hail Heaven's", 1, "p. 30: the margin and the paragraph number"),
    ("11", "eat with f!", "eat with †!", 1, "p. 30: the obelus"),
    ("11", "Hail thou, the First, f! Hail thou, the Second, f!\n\nHail thou, the Third, f!\n\nHail thou, the Fourth, f!\n\nHail thou, the Fifth, f/ Hail thou, the Sixth, f!\n\nHail thou, the Seventh, 4!",
     HAILS, 1, "p. 30: seven lines, each ending with an obelus"),
    # XII
    ("12", "i. Hail Guardians of the Pivot, y^^TTHPTAr sacred", "1. Hail Guardians of the Pivot, ye sacred", 1, "p. 31: the margin"),
    ("12", "at once,™™™^ revolve", "at once, revolve", 1, "p. 31: the margin"),
    ("12", "Hail thou, the First, f!\n\nHail thou, the Second, f!\n\nHail thou, the Third, f!\n\nHail thou, the Fourth, f!\n\nHail thou, the Fifth, f!\n\nHail thou, the Sixth, f!\n\nHail thou, the Seventh, A TuoTAr 2t ^ow wnen tneY [an<] are present in their order> here and there> gaze",
     HAILS + "\n\n2. Now when they [all] are present in their order, here and there, gaze", 1,
     "pp. 31-32: the obeli, and the first line of p. 32, which the OCR runs into the margin"),
    ("12", "a bellowing' prolonged", "a \"bellowing\" prolonged", 1, "p. 32"),
    # XIII
    ("13", "f, [0 Lord]", "†, [O Lord]", 1, "p. 33: the obelus"),
    ("13", "learn me not! R For f bids", "leave me not! For † bids", 1, "p. 33: 'leave' (H misreads 'learn'), the margin, the obelus"),
    # XIV
    ("14", "[mortal}", "[mortal]", 1, "p. 33"),
]


def main():
    d = sys.argv[1]
    h, g, s = (tokens(os.path.join(d, f"{x}.txt")) for x in "HGS")
    voted = vote(h, g, s)
    log(f"{len(TAKEN)} readings taken by the vote")
    if TAKEN_COUNT is not None:
        assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    units = split_units(voted)
    applied = Counter()
    kept = Counter()
    out = []
    for uid, num, head, _opening, first, last in UNITS:
        text = "\n\n".join(paragraphs(units[uid]))
        for m in re.finditer(r"\S*¦\S*", text):
            log(f"  line-end break in {uid}: {m.group(0)}")

        def unbreak(m):
            word = m.group(0)
            hyphened = word.replace("¦", "-")
            bare = re.sub(r"^\W+|\W+$", "", hyphened)
            if bare in dict(KEEP_HYPHEN):
                kept[bare] += 1
                return hyphened
            return word.replace("¦", "")

        text = re.sub(r"\S*¦\S*", unbreak, text)
        for n, (fu, old, new, _count, _why) in enumerate(FIXES):
            if fu == uid and old in text:
                applied[n] += text.count(old)
                text = text.replace(old, new)
        out.append({"id": uid, "numeral": num, "heading": head, "firstPage": first, "lastPage": last, "text": text})
        log(f"unit {uid}: pp. {first}-{last}, {len(text.split())} words")
    for word, count in KEEP_HYPHEN:
        assert kept[word] == count, ("KEEP_HYPHEN entry met the wrong number of times", word, kept[word])
    for n, (fu, old, _new, count, _why) in enumerate(FIXES):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", fu, old, applied[n])
    write(out)


def write(units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/mead-mithriac-ritual.py from the archive.org OCR of\n")
    w("// three scans of G. R. S. Mead, A Mithriac Ritual (London, 1907), voted word by\n")
    w("// word and then read against the page images of the Toronto copy. Do not edit by\n")
    w("// hand: correct the generator (its FIXES list holds every correction made by hand)\n")
    w("// and run it again.\n\n")
    w("export type MithriacUnit = {\n")
    w("  /** 'preamble', or Mead's section of the Ritual: '1' ... '14'. */\n  id: string;\n")
    w("  /** The section's Roman numeral as printed ('' for the Preamble). */\n  numeral: string;\n")
    w("  /** The heading as printed (in capitals in the book), with Mead's square brackets. */\n  heading: string;\n")
    w("  /** The printed pages of the 1907 book the unit runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** Paragraphs separated by blank lines. */\n  text: string;\n};\n\n")
    w("export const MITHRIAC_UNITS: MithriacUnit[] = [\n")
    for u in units:
        w(f"  {{ id: {json.dumps(u['id'])}, numeral: {json.dumps(u['numeral'])}, heading: {json.dumps(u['heading'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
