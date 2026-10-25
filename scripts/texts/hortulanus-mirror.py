"""Hortulanus's commentary on the Emerald Tablet, and the Tablet itself, in the
English of The Mirror of Alchimy (London, 1597) -> hortulanus-text.ts.

THE BOOK. The mirror of alchimy, composed by the thrice-famous and learned
fryer, Roger Bachon ... With certaine other treatises of the like argument
(London: printed [by Thomas Creede] for Richard Oliue, 1597; STC 1182, ESTC
S100517). It prints, after Bacon's "Mirror" (pp. 1-16):

  pp. 16-17  "The Smaragdine Table of Hermes, Trismegistus of Alchimy."
  pp. 17-27  "A briefe Commentarie of Hortulanus the Philosopher, vpon the
             Smaragdine Table of Hermes of Alchimy": a prayer, a preface and
             thirteen chapters.

Those two are imported here, whole. The rest of the book (Bacon's "Mirror"
proper, the "Booke of the secrets of alchimie" of Calid, and Bacon's
"Admirable force and efficacie of Art and Nature") is not: see "WHAT IS NOT
IMPORTED" below. The translator is not named anywhere in the book.

WITNESSES (all public domain or CC0):

  T  EEBO-TCP A01683, the Text Creation Partnership's keyed transcription
     (phase I, CC0), from the microfilm of the Huntington Library copy (EEBO
     image set 619; Early English Books 1475-1640, reel 169:10), in the
     EarlyPrint Project's tokenised edition (blacklab
     morphadorner.northwestern.edu/blacklab/earlyprint/docs/A01683/contents,
     "not fully proofread"). The base: it keeps the print's spelling, u/v and
     i/j as printed. The original form of every word is used, never
     EarlyPrint's regularised spelling.
  M  Adam McLean's transcription on the Alchemy Web Site
     (alchemywebsite.com/hortulan.html; formerly levity.com/alchemy). A modern
     transcription, used only as a second witness: it prints u/v and i/j in
     the modern way, so it is compared on letters with u=v and i=j. It has
     the commentary only, not the Tablet.
  C  archive.org OCR (djvu.txt) of the Francis A. Countway Library of
     Medicine copy, scanned 2011 (mirrorofalchimy00baco): a second physical
     copy of the book.
  H  archive.org OCR (djvu.txt) of the EEBO microfilm of the Huntington copy
     (bim_early-english-books-1475-1640_the-mirror-of-alchimy-_bacon-roger_1597):
     the copy T was keyed from, read independently by a machine.

METHOD. T's words are lined up with each of M, C and H (difflib on letters
only: lower case, long s and f as s, u=v, i=j). In the commentary, where at
least two witnesses agree on a word against T, M among them, and more of them
read it so than as T does, their reading is taken in the spelling of the OCR
that has it (the print's spelling, long s made s), with T's capitals. (The
OCRs alone never change T: they agree with each other on misreadings such as
"arc" for "are" and "receyneth" for "receyueth", which are logged as "OCRs
only, not taken".) In the Tablet, which M does not have, the OCRs' agreements
are only logged for review. Every word on which M and T differ, with f and
long s told apart (so a "faith" for "saith" is caught), is logged "for
review", as are closing stops where M and an OCR agree against T. Every
logged place was read on the page images, and settled by REJECT or FIXES.

THE PAGE IMAGES. The microfilm images of the Huntington copy, the copy T was
keyed from (archive.org bim_..._1597, leaves n19-n30 = pp. 16-27), were read
in full, line by line, against the generated text; the scan of the Countway
copy (mirrorofalchimy00baco, leaves n25-n36 = pp. 16-27) was read for pp.
16-17, 21-23 and 26 and wherever the microfilm was faint. FIXES holds every
correction made by hand, each asserted to apply exactly the stated number of
times, with what it was checked against. The two copies are of different
states of the sheet: where they differ, the Huntington copy's reading (T's,
confirmed on its image) is kept and the Countway reading is listed in
VARIANTS; the copies were not collated in full, so VARIANTS lists the
differences seen, not all there are. Punctuation is T's, as checked by eye on
the images, with the FIXES given.

SPELLING AND TYPOGRAPHY. The 1597 spelling is kept ("vpon", "giuen",
"Iesus", "Philosophie", "shalt"), with these conventions, all of them the
TCP's: long s is printed s; the tilde of an abbreviation is expanded
("meditatiō" -> "meditation", "frō" -> "from"); a word divided at a line end
is joined; the large initial letter of a section and the capital that
follows it ("THe", "LAude") are given as T gives them. Italic, used for the
Tablet's words quoted in the commentary, is not marked. Running heads
("A briefe Commentarie of Hortulanus"), page numbers, signatures and
catchwords are left out. The printer's own misprints are kept: "beeause" (p. 21, in both copies),
"adatpations" (p. 17), "seperate" (p. 16), and the "and" printed twice
across the turn of pp. 16-17 ("into Heauen: and / and againe").

WHAT IS NOT IMPORTED.
  - Bacon's "Mirror of Alchimy" proper (pp. 1-16, seven chapters). The only
    second transcription found (McLean's, alchemywebsite.com/mirror.html) is
    in modernised spelling, so the old-spelling text would rest on T and two
    poor OCRs alone; left for a later stage.
  - The Latin of Hortulanus (De Alchemia, Nuremberg: Petreius, 1541). Only
    one copy's page images could be reached (e-rara, doi:10.3931/e-rara-5596),
    and no second copy or transcription to check a reading against, so it is
    cited, not transcribed.
  - Stanton J. Linden's edition (The Mirror of Alchimy, New York: Garland,
    1992) is in copyright: cited, never used as a witness.
  - No editorial apparatus is reproduced: there is none in the 1597 book
    beyond its headings, and the TCP and EarlyPrint markup (lemmas,
    regularised spellings, word ids) is dropped.

Usage:
  python3 -I scripts/texts/hortulanus-mirror.py A01683.xml hortulan.html \\
      countway_djvu.txt huntington_djvu.txt > src/lib/timeline/texts/corpus/hortulanus-text.ts
"""

import difflib
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter

NS = "{http://www.tei-c.org/ns/1.0}"
XID = "{http://www.w3.org/XML/1998/namespace}id"

# TCP page images are two-page openings; A01683-011-a is p. 16 and each half
# after it the next page (checked: 011-a ends "... eternally to be praised",
# the foot of the Countway copy's p. 16; 016-b is p. 27, the commentary's end).
FIRST_IMAGE, FIRST_PAGE = 11, 16
LAST_IMAGE = 16


def page_of(word_id):
    _, img, side = word_id.split("-")[:3]
    return FIRST_PAGE + 2 * (int(img) - FIRST_IMAGE) + (1 if side == "b" else 0)


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    """The letters compared: lower case, long s and f as s, u=v, i=j, tildes dropped."""
    w = word.lower().replace("ſ", "s").replace("f", "s").replace("v", "u").replace("j", "i")
    w = w.replace("ō", "o").replace("ā", "a").replace("ē", "e").replace("ū", "u").replace("á", "a")
    return re.sub(r"[^a-z0-9&]", "", w)


# --- T: the TCP transcription, as blocks of words ------------------------------


def tcp_blocks(path):
    """The Tablet and the commentary as [kind, first page, last page, [words]]."""
    root = ET.parse(path).getroot()
    text = root.find(f"{NS}text")
    blocks = []
    started = False

    def visit(el, kind):
        nonlocal started
        tag = el.tag.replace(NS, "")
        if tag in ("w", "pc"):
            wid = el.get(XID)
            img = int(wid.split("-")[1])
            if img < FIRST_IMAGE or img > LAST_IMAGE or not started:
                return
            tok = el.text or ""
            blocks[-1][3].append((tok, tag == "pc", page_of(wid)))
            return
        if tag == "head" and not started:
            if "".join(el.itertext()).split()[:2] == ["The", "Smaragdine"]:
                started = True
        if tag in ("head", "p", "trailer", "closer") and started:
            blocks.append([tag, None, None, []])
        for c in el:
            visit(c, tag if tag in ("head", "p", "trailer", "closer") else kind)

    visit(text, None)
    out = []
    for kind, _, _, toks in blocks:
        if not toks:
            continue
        out.append([kind, toks[0][2], toks[-1][2], toks])
        if kind == "trailer" and toks[0][0] == "Thus":  # "Thus endeth the Commentarie ..."
            break
    return out


def join_tokens(toks):
    s = ""
    for tok, is_pc, _ in toks:
        if not s:
            s = tok
        elif is_pc and tok in ",.;:?!)":
            s += tok
        elif s.endswith("("):
            s += tok
        else:
            s += " " + tok
    return s


# --- the witnesses --------------------------------------------------------------


def trail(t):
    m = re.search(r"[A-Za-z0-9ſ&]([^A-Za-z0-9ſ&]*)$", t)
    rest = m.group(1) if m else ""
    return rest if re.fullmatch(r"[.,;:?!]*", rest) else None


def tokens_of(raw):
    raw = raw.replace("­", "")
    raw = re.sub(r"(\w)[-¬][ \t]*\n\s*(\w)", r"\1\2", raw)  # a word divided at a line end
    out = []
    for t in raw.split():
        k = key(t)
        if not k:
            if out and re.fullmatch(r"[.,;:?!]+", t) and out[-1][2] is not None:
                out[-1] = (out[-1][0], out[-1][1], out[-1][2] + t)
            continue
        out.append((k, t, trail(t)))
    return out


def mclean_tokens(path):
    t = open(path, encoding="latin-1").read()
    t = re.sub(r"<script.*?</script>", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    a = t.index("A briefe Commentarie of Hortulanus")
    b = t.index("father of Philosophers.", a) + len("father of Philosophers.")
    return tokens_of(t[a:b])


def ocr_tokens(path):
    return tokens_of(open(path, encoding="utf-8", errors="replace").read())


def align(base_keys, toks, name):
    """For each word of T, the witness's word lined up with it, or None."""
    keys = [t[0] for t in toks]
    # Find the stretch of the witness that matches T best (T is short; the OCR is the whole book).
    probe = difflib.SequenceMatcher(None, keys, base_keys, autojunk=False)
    blocks = [b for b in probe.get_matching_blocks() if b.size >= 3]
    if not blocks:
        log(f"  {name}: not found")
        return [None] * len(base_keys)
    centre = sorted(b.a for b in blocks)[len(blocks) // 2]
    lo = max(0, min(b.a for b in blocks if abs(b.a - centre) < 4 * len(base_keys)) - 40)
    hi = max(b.a + b.size for b in blocks if abs(b.a - centre) < 4 * len(base_keys)) + 40
    window = toks[lo:hi]
    sm = difflib.SequenceMatcher(None, base_keys, [t[0] for t in window], autojunk=False)
    aligned = [None] * len(base_keys)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1 and i2 - i1 <= 3):
            for d in range(i2 - i1):
                aligned[i1 + d] = window[j1 + d]
    agree = sum(1 for i, a in enumerate(aligned) if a and a[0] == base_keys[i]) / max(1, len(base_keys))
    log(f"  {name}: in-order agreement with T {agree:.3f}")
    return aligned


def apply_case(base, alt):
    if base.isupper() and len(base) > 1:
        return alt.upper()
    if base[:2].isupper():  # "THe", "LAude": the initial and the capital after it
        return alt[:2].upper() + alt[2:]
    if base[:1].isupper():
        return alt[:1].upper() + alt[1:]
    return alt


def spelled(witness_word):
    """An OCR word in the print's spelling: long s made s, punctuation off."""
    w = witness_word.replace("ſ", "s")
    m = re.search(r"[A-Za-z&][A-Za-z&]*", w)
    return m.group(0) if m else w


def strict(word):
    """Letters only, with f and long s kept apart: for listing M's disagreements."""
    w = word.lower().replace("ſ", "s").replace("v", "u").replace("j", "i")
    return re.sub(r"[^a-z0-9&]", "", w)


def collate(blocks, wits, needs_m):
    """Take the majority readings into T. With needs_m, a change needs M among the majority."""
    words = []  # (block index, token index)
    for bi, b in enumerate(blocks):
        for ti, (tok, is_pc, _) in enumerate(b[3]):
            if not is_pc and key(tok):
                words.append((bi, ti))
    base_keys = [key(blocks[bi][3][ti][0]) for bi, ti in words]
    aligned = [(name, align(base_keys, toks, name)) for name, toks in wits]
    changes = 0
    for n, (bi, ti) in enumerate(words):
        tok, is_pc, page = blocks[bi][3][ti]
        bk = base_keys[n]
        if bk.isdigit():
            continue
        votes = Counter(a[n][0] for _, a in aligned if a[n])
        alt = [(k, c) for k, c in votes.items() if k != bk]
        for name, a in aligned:
            if name == "M" and a[n] and strict(a[n][1]) != strict(tok):
                log(f"  for review p.{page}: T [{tok}] M [{a[n][1]}] ({dict(votes)})")
        if alt:
            k2, c2 = max(alt, key=lambda x: x[1])
            m_agrees = any(name == "M" and a[n] and a[n][0] == k2 for name, a in aligned)
            if c2 >= 2 and c2 > votes.get(bk, 0) and needs_m and not m_agrees:
                log(f"  OCRs only, not taken p.{page}: [{tok}] -> {k2} ({dict(votes)})")
            elif c2 >= 2 and c2 > votes.get(bk, 0) and not needs_m:
                log(f"  OCRs agree, for review p.{page}: [{tok}] -> {k2} ({dict(votes)})")
            elif c2 >= 2 and c2 > votes.get(bk, 0):
                if (tok, k2) in REJECT:
                    log(f"  rejected p.{page}: [{tok}] -> {k2} ({dict(votes)})")
                else:
                    forms = [spelled(a[n][1]) for name, a in aligned if a[n] and a[n][0] == k2 and name != "M"]
                    new = apply_case(tok, forms[0])
                    ctx = " ".join(blocks[bi][3][j][0] for j in range(max(0, ti - 4), min(len(blocks[bi][3]), ti + 4)))
                    log(f"  changed p.{page}: [{tok}] -> [{new}] ({dict(votes)}) in '{ctx}'")
                    blocks[bi][3][ti] = (new, is_pc, page)
                    changes += 1
        # Closing punctuation (the token after the word, or the word's own
        # final stop, as in "I."): reported where M and an OCR agree against T;
        # every report was checked on the page image and settled in FIXES.
        nxt = blocks[bi][3][ti + 1] if ti + 1 < len(blocks[bi][3]) else None
        own = re.search(r"[.,;:?!]+$", tok)
        bt = own.group(0) if own else (nxt[0] if nxt and nxt[1] and nxt[0] in ",.;:?!" else "")
        pv = Counter(a[n][2] for _, a in aligned if a[n] and a[n][0] == bk and a[n][2] is not None)
        palt = [(p, c) for p, c in pv.items() if p != bt and p in {"", ".", ",", ";", ":", "?", "!"}]
        if palt and needs_m:
            p2, c2 = max(palt, key=lambda x: x[1])
            m_agrees = any(name == "M" and a[n] and a[n][0] == bk and a[n][2] == p2 for name, a in aligned)
            if c2 >= 2 and c2 > pv.get(bt, 0) and m_agrees:
                log(f"  punctuation, for review p.{page}: [{tok}] {bt!r} -> {p2!r} ({dict(pv)})")
    log(f"  {changes} changes by majority")


# Majority readings refused: (T's word, the majority's key) -- the witnesses
# agree, but the page images show T is right.
REJECT = {

}
REJECT_PUNCT = set()

# Corrections made by hand: (old, new, count, what it was checked against).
# "H image" is the Huntington copy's microfilm at archive.org (leaf n = page + 3,
# the copy T was keyed from); "C image" the Countway copy (leaf n = page + 9).
FIXES = [
    # The Tablet
    ("this onething", "this one thing", 1, "p. 16: the print sets 'onething' close here and in 'of onething', which T divides; divided in both"),
    ("ofallthe", "of all the", 1, "p. 16: T's run-together keying; H and C images 'of all the', set close"),
    # The commentary
    ("for somuch", "forsomuch", 1, "p. 18: one word in H and C images ('forsomuch'), as M"),
    ("mutuallic", "mutuallie", 1, "p. 21: H image 'mutuallie'; M 'mutuallie'"),
    ("shal be like", "shalbe like", 1, "p. 21: one word in H image, as M"),
    ("sixt", "fixt", 1, "p. 22, Chapter VI's title: H image 'fixt' (long s and f told apart by the bar); M 'fixt'"),
    ("bread a little", "bread, a little", 1, "p. 22: comma in H and C images"),
    ("sermenteth", "fermenteth", 1, "p. 22: H and C images 'fermenteth'; M 'fermenteth'"),
    ("first ne setteth", "first he setteth", 1, "p. 23: C image 'he'; the ascender of h is faint on the H microfilm, which T keyed as 'ne'; M 'he'"),
    ("and list it up", "and lift it vp", 1, "p. 23, Chapter VIII's title: H image 'lift it vp'; M 'lift it up'"),
    ("multiplication ct easie", "multiplication & easie", 1, "p. 23: the ampersand (an italic-style &) in H image; T keyed it 'ct'; M 'and'"),
    ("into the beauen", "into the heauen", 1, "p. 24: italic h in H image, read as b by T; M 'heaven', C OCR 'heauen'"),
    ("adaptations that is, Is thou", "adaptations: that is, If thou", 1, "p. 26: colon after the italic 'adaptations' in C image (faint in H); 'If' in H and C images, as M"),
    ("V Vherof", "Wherof", 1, "p. 26: the print's 'VV' for W, H and C images; M 'Whereof'"),
    ("ishere", "is here", 1, "p. 26: two words in H and C images"),
    ("the soure elements", "the foure elements", 2, "pp. 26 and 27: 'foure' in H image both times; M 'foure'"),
    ("toncheth", "toucheth", 1, "p. 26: H image 'toucheth'; M 'toucheth'"),
    ("hee faith, Hauing", "hee saith, Hauing", 1, "p. 27: H image 'saith'; M 'saith'"),
    ("Philosophic of", "Philosophie of", 1, "p. 27: H image 'Philosophie'; M 'Philosophie'"),
    ("nátures", "natures", 1, "p. 27: no accent in H image; M 'natures'"),
]

# Where the two physical copies differ, T's reading (the Huntington copy,
# confirmed on its microfilm image) is kept; the Countway copy's reading is
# recorded here and in the corpus file's notes. The copies were not collated
# in full: these are the differences seen where the Countway images were read
# (pp. 16-17, 21-23, 26 in full; elsewhere at the points under review).
VARIANTS = [
    ("p. 16", "and that gently", "Countway: 'and tha gently'"),
    ("p. 17", "it descendeth into the earth", "Countway: 'it discendeth into the earth'"),
    ("p. 17", "maruailous adatpations", "Countway: 'maruailous adabtations'"),
]


def finish(blocks):
    paras = []
    for kind, p1, p2, toks in blocks:
        paras.append([kind, toks[0][2], toks[-1][2], join_tokens(toks)])
    for old, new, count, _why in FIXES:
        found = sum(p[3].count(old) for p in paras)
        assert found == count, (old, found)
        for p in paras:
            p[3] = p[3].replace(old, new)
    # A chapter's heading is printed in two lines, "CHAP. I." and its title:
    # kept as two paragraphs.
    out = []
    for p in paras:
        m = re.match(r"^(CHAP\.? [IVX]+\.) (.*)$", p[3]) if p[0] == "head" else None
        if m:
            out.append([p[0], p[1], p[2], m.group(1)])
            out.append([p[0], p[1], p[2], m.group(2)])
        else:
            out.append(p)
    return out


# The archive's units: the Tablet; the commentary's prayer, preface and
# thirteen chapters. Each is found by the heading that opens it.
UNITS = [
    ("tablet", "The Smaragdine Table of Hermes", "The Smaragdine Table of Hermes"),
    ("prayer", "The praier of Hortulanus", "The praier of Hortulanus"),
    ("preface", "The Preface", "The Preface"),
] + [(str(n), f"Chapter {n}", f"CHAP. {r}") for n, r in enumerate("I II III IIII V VI VII VIII IX X XI XII XIII".split(), 1)]

HEADER = """// GENERATED by scripts/texts/hortulanus-mirror.py from the EEBO-TCP
// transcription A01683 of The Mirror of Alchimy (London, 1597; STC 1182),
// collated word by word with Adam McLean's transcription and the archive.org
// OCRs of two copies (Countway Library; the Huntington copy's EEBO microfilm),
// every doubtful reading checked on the page images of the Countway copy.
// Do not edit by hand: correct the generator (its FIXES list holds every
// correction made by hand) and run it again. Spelling as printed in 1597; long
// s printed s, abbreviations expanded; running heads, page numbers,
// signatures and catchwords left out.

export type HortulanusUnit = {
  /** "tablet", "prayer", "preface", or the chapter's number. */
  unit: string;
  /** The printed pages of the 1597 book. */
  pages: string;
  /** The 1597 English, paragraphs (heading, text, closing line) separated by blank lines. */
  text: string;
};

"""


def emit(paras, out):
    starts = []
    for unit, _, head in UNITS:
        hits = [i for i, p in enumerate(paras) if p[0] == "head" and re.match(re.escape(head) + r"\b", p[3].replace("CHAP X", "CHAP. X"))]
        assert len(hits) == 1, (head, hits)
        starts.append(hits[0])
    # The commentary's own title stands before the prayer: it goes with the prayer.
    title = next(i for i, p in enumerate(paras) if p[3].startswith("A briefe Commentarie"))
    assert starts[1] == title + 1
    starts[1] = title
    assert starts == sorted(starts) and starts[0] == 0
    out.write(HEADER)
    out.write("export const HORTULANUS_UNITS: HortulanusUnit[] = [\n")
    for n, (unit, _, _) in enumerate(UNITS):
        chunk = paras[starts[n] : starts[n + 1] if n + 1 < len(UNITS) else len(paras)]
        p1, p2 = chunk[0][1], chunk[-1][2]
        row = {"unit": unit, "pages": f"p. {p1}" if p1 == p2 else f"pp. {p1}–{p2}", "text": "\n\n".join(p[3] for p in chunk)}
        out.write("  " + json.dumps(row, ensure_ascii=False) + ",\n")
    out.write("];\n")


def main():
    tcp, mclean, countway, huntington = sys.argv[1:5]
    blocks = tcp_blocks(tcp)
    log(f"T: {len(blocks)} blocks, pp. {blocks[0][1]}-{blocks[-1][2]}")
    # M has the commentary only: the Tablet is collated with C and H alone.
    tablet_end = next(i for i, b in enumerate(blocks) if b[0] == "head" and join_tokens(b[3]).startswith("A briefe Commentarie"))
    log("The Tablet (C, H):")
    collate(blocks[:tablet_end], [("C", ocr_tokens(countway)), ("H", ocr_tokens(huntington))], False)
    log("The commentary (M, C, H):")
    collate(blocks[tablet_end:], [("M", mclean_tokens(mclean)), ("C", ocr_tokens(countway)), ("H", ocr_tokens(huntington))], True)
    paras = finish(blocks)
    emit(paras, sys.stdout)
    if VARIANTS:
        log("Variants between copies (T kept):")
        for v in VARIANTS:
            log("  " + " | ".join(v))


if __name__ == "__main__":
    main()
