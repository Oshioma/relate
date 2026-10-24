"""The Virgin of the World of Hermes Mercurius Trismegistus, translated by Anna
Kingsford and Edward Maitland (London: George Redway, 1885), for the texts
archive (Stage 19) -> virgin-of-the-world-text.ts.

THE BOOK. "The Hermetic Works. The Virgin of the World of Hermes Mercurius
Trismegistus. [Greek motto] Now first rendered into English with Essay
Introductions and Notes by Dr. Anna Kingsford and Edward Maitland, authors of
'The Perfect Way'. London: George Redway, York Street, Covent Garden.
MDCCCLXXXV." (title page, seen on the scan). Before it, a frontispiece of a
many-breasted Isis, "Hermes Mercurius Trismegistus. Virgin of the World.
1885."; after it, a Note signed "Bath; May, 1885" and "Translated and
published for, and all rights reserved by, Robt. H. Fryar, Ed. Bath Occult
Reprint Series". xxx, 154 pp.:
  pp. i-viii     The Hermetic Books (signed E. M.)                   not imported
  pp. ix-xviii   The Hermetic System and the Significance of its
                 Present Revival (signed E. M.)                       not imported
  pp. xix-xxx    An Introduction to the Virgin of the World (A. K.)   its first section
  pp. 1-39       The Virgin of the World, Parts I-III                 whole
  pp. 45-94      A Treatise on Initiations; or, Asclepios, Parts I-XV whole
  pp. 101-113    The Definitions of Asclepios, Parts I-IV             whole
  pp. 119-140    Fragments of the Book of Hermes to his son Tatios, I-VIII   whole
  pp. 141-148    Fragments of the Writings of Hermes to Ammon, I-VI   whole
  pp. 148-154    Various Hermetic Fragments, I-VIII                   whole
(the pages of the text; each treatise but the last has a title leaf before it)
The translation is said (p. ii, footnote) to rest on Louis Ménard's French,
Hermès Trismégiste (Paris, 1866-7): "This translation has been used, but not
entirely followed, in the present work, as also have some of the notes,
those which are not initialled being Dr. Ménard's."

KINGSFORD'S INTRODUCTION is twelve close pages (xix-xxx) set without sections.
It is not short, so only its first section is imported, as the archive
divides it: from its opening to "the 'Ave' of Mary reverses the curse of Eva"
(pp. xix-xxi), where it has explained the title, Koré as the Soul, and turns
from the Mysteries to the soul's "apostacy" in the Korē Kosmou itself ("In
perfect accord with Kabbalistic doctrine ..."). The rest is described
in the corpus file. Maitland's two essays are described there and not imported.

WITNESSES. No proofread transcription of an 1885 copy, and no Gutenberg or
Wikisource text, could be reached (sacred-texts.com refused the requests).
  E  archive.org's OCR of the Global Grey e-book of 2018
     (virgin-of-the-world-of-hermes-mercurius-trismagistus_djvu.txt), a
     typeset reissue of an e-text of the 1885 book: its footnotes keep page
     markers of the 1885 edition ("p. 78"), as sacred-texts.com e-texts do.
     THE BASE: it is the only e-text that holds the Introduction as well as
     the treatises.
  T  archive.org's OCR of another PDF of the same kind (the-virgin-of-the-
     world-of-hermes-mercurius-trismagistus, the file "The Virgin of the World
     of Hermes Mercurius Trismagistus_djvu.txt"), with sacred-texts-style
     note marks ("[1]", "3:[1]", "--- p. 11,"). It begins at the motto of the
     Virgin of the World, so it has no Introduction, and it leaves out Part V
     of the Fragments to Tatios.
  V  archive.org's OCR of Google's scan of a copy of the 1885 book
     (1885-kingsford-maitland-virgin-of-the-world; the same scan is
     maitland___virgin_of_the_world_202012), read from its djvu.xml, with its
     page images (the PDF in the same item): leaf 38 is p. 1, leaf 24 p. xix.
E and T are two copies of what is very likely ONE transcription (they share
its page markers and its errors, below), so they are not independent of each
other; V is the only independent witness, and the only one of the 1885
printing itself. For the Introduction and Tatios V, E and V alone are compared.

THE VOTE. E's words are aligned with each witness (difflib, on letters and
figures only, so case and punctuation are not compared; V's page numbers,
catchwords, signature marks and footnotes, T's and E's note sections, note
marks and page markers, and the headings of all three are taken out first;
words broken at a line end are joined). Where T and V agree on a reading
other than E's, and no witness reads E's, the reading is taken: the count is
asserted (TAKEN_COUNT), and every reading taken is printed to stderr. Every
other place where E and V differ was printed and read; where V's reading is
a real word, the page image was looked at. The corrections that this made, and
those where T and E share an error, are in FIXES, each with its page.
  - The shared transcription drops the drop-capital of a part that opens with
    a word of one letter ("GREAT and divine power" for "A GREAT", Tatios IV;
    "MY son" for "O MY son"). The opening words of every part were read on
    the page images (FIXES).
  - Punctuation is not voted.

HOW THE TEXT IS GIVEN. E's words, with the majority readings and FIXES. A
paragraph break of E is kept only where V (not at the top of a page) or T
also breaks there, so E's own page breaks do not split paragraphs. "--" is
given as a closed-up dash. Small capitals, italic and the drop capitals are
not marked; the speakers' names that the book sets as small headings
("Hermes:", "Asclepios:", "Tatios.", "Trismegistos.") stand as paragraphs of
their own. The book's footnotes (Ménard's and the translators') are left
out, with their marks; the translators' notes printed in the text in square
brackets, after a part or inside it (most signed "A. K."), are kept, because
the book prints them in the run of the text. The two Greek words of the
note at the end of the Definitions (βασιλεύς, βαίνειν), which the e-text
garbles, are restored from p. 112 (FIXES). Words the e-text keeps with the
hyphen of a printed line-break are joined (JOINS); hyphens the book prints
inside a line are kept. The closing rubrics ("End of the Virgin of the
World." and the like) are left out.

Usage:
  python3 -I scripts/texts/virgin-of-the-world.py DIR > src/lib/timeline/texts/corpus/virgin-of-the-world-text.ts
where DIR holds E.txt, T.txt (the two djvu.txt files named above) and V.djvu.xml
(1885__kingsford_maitland___virgin_of_the_world_djvu.xml).
"""

import difflib
import html
import json
import os
import re
import sys
from collections import Counter, defaultdict


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    w = re.sub(r"[àáâä]", "a", w)
    w = re.sub(r"[èéêë]", "e", w)
    w = re.sub(r"[ìíîï]", "i", w)
    w = re.sub(r"[òóôö]", "o", w)
    w = re.sub(r"[ùúûü]", "u", w)
    return re.sub(r"[^a-z0-9]", "", w)


# ---------------------------------------------------------------------------
# THE UNITS: (id, treatise, numeral, opening words in E after cleaning).
# The opening words are E's (with its dropped drop-capitals); the printed
# opening is restored by FIXES.
# ---------------------------------------------------------------------------

UNITS = [
    ("intro", "intro", "", "THE mystic title of the celebrated Hermetic fragment"),
    ("kore.1", "kore", "I", "HAVING thus spoken, Isis first pours out"),
    ("kore.2", "kore", "II", "MY illustrious son, if thou wilt know"),
    ("kore.3", "kore", "III", "THOU hast given me admirable instruction"),
    ("ascl.1", "ascl", "I", "Hermes: IT is a God who hath brought thee to us"),
    ("ascl.2", "ascl", "II", "HEAVEN--God manifest--regulates all bodies"),
    ("ascl.3", "ascl", "III", "MAN, then, Asclepios, is a great marvel"),
    ("ascl.4", "ascl", "IV", "Asclepios: WHY then, O Trismegistos, was it necessary"),
    ("ascl.5", "ascl", "V", "BUT I perceive, O Asclepios, that thou art anxious"),
    ("ascl.6", "ascl", "VI", "THE Master of Eternity is the first God"),
    ("ascl.7", "ascl", "VII", "LET us begin to speak of Mind"),
    ("ascl.8", "ascl", "VIII", "Asclepios: WHAT, O Trismegistos, are the primordial"),
    ("ascl.9", "ascl", "IX", "AND since we are brought to speak of the relationship"),
    ("ascl.10", "ascl", "X", "Hermes: LET us speak now of that which is immortal"),
    ("ascl.11", "ascl", "XI", "SINCE such is the state of the universe"),
    ("ascl.12", "ascl", "XII", "CONCERNING the Void"),
    ("ascl.13", "ascl", "XIII", "LET us return to man"),
    ("ascl.14", "ascl", "XIV", "Asclepios: O TRISMEGISTOS, what is the part taken"),
    ("ascl.15", "ascl", "XV", "AND now, inasmuch as it is given to man"),
    ("def.1", "def", "I", "Asclepios to the King Ammon."),
    ("def.2", "def", "II", "IF thou reflectest, O King"),
    ("def.3", "def", "III", "WHEN a musician, desiring to conduct a melody"),
    ("def.4", "def", "IV", "THIS discourse ends where it began"),
    ("tat.1", "tat", "I", "Trismegistos. IT is for the love of men"),
    ("tat.2", "tat", "II", "Tatios. THOU hast well explained to me these things"),
    ("tat.3", "tat", "III", "THE Lord, the Creator of immortal forms"),
    ("tat.4", "tat", "IV", "GREAT and divine power is established"),
    ("tat.5", "tat", "V", "HERE, then, is that which can be said of the three tenses"),
    ("tat.6", "tat", "VI", "MY son, matter becomes"),
    ("tat.7", "tat", "VII", "TO speak of the Real with certainty"),
    ("tat.8", "tat", "VIII", "TO understand God is difficult"),
    ("ammon.1", "ammon", "I", "THAT which rules the universe is Providence"),
    ("ammon.2", "ammon", "II", "ALL things are produced by Nature and Destiny"),
    ("ammon.3", "ammon", "III", "THE soul is, then, an incorporeal essence, and even when"),
    ("ammon.4", "ammon", "IV", "THE soul is then an incorporeal essence; if she had a body"),
    ("ammon.5", "ammon", "V", "THE soul is then, O Ammon, an essence"),
    ("ammon.6", "ammon", "VI", "THE soul is, then, an eternal and intelligent essence"),
    ("frag.1", "frag", "I", "THERE are, then, essential spirit, reason"),
    ("frag.2", "frag", "II", "THERE is, then, a state of Being superior"),
    ("frag.3", "frag", "III", "WHEREFORE the incorporeal vision comes forth"),
    ("frag.4", "frag", "IV", "IF thou understandest this one and only Good"),
    ("frag.5", "frag", "V", "BENEATH nature and the ideal world"),
    ("frag.6", "frag", "VI", "\"THUS the Ideal Light was before"),
    ("frag.7", "frag", "VII", "SEVEN Planets revolve"),
    ("frag.8", "frag", "VIII", "HERMES affirms that those who know God"),
]

TREATISES = {
    "intro": "An Introduction to the Virgin of the World",
    "kore": "The Virgin of the World",
    "ascl": "A Treatise on Initiations; or, Asclepios",
    "def": "The Definitions of Asclepios",
    "tat": "Fragments of the Book of Hermes to his Son Tatios",
    "ammon": "Fragments of the Writings of Hermes to Ammon",
    "frag": "Various Hermetic Fragments",
}

# Heading lines, taken out of all three witnesses (compared as keys).
HEADING_KEYS = {key(h) for h in [
    "The Virgin of the World", "The Virgin of the World I", "A Treatise on Initiations; or,", "Asclepios.",
    "A Treatise on Initiations; or, Asclepios", "Treatise on Initiations;", "The Definitions of Asclepios",
    "Definitions of Asclepios", "Fragments of the Book of Hermes", "to his son Tatios", "of Hermes",
    "Fragments of the Book of Hermes to his son Tatios", "Fragments of the Writings of", "Hermes to Ammon",
    "Fragments of the Writings of Hermes to Ammon", "Various Hermetic Fragments", "Hermetic Fragments", "Various",
    "An Introduction to the Virgin of the World", "An Introduction", "Virgin of the World",
    "The Definitions of", "Ascleptos", "Fragments of the Writings", "of Hermes to Ammon",
]}
PART_LINE = re.compile(r"^\s*[.,]?\s*PAR[TI]\S*(\s+[A-Za-z0-9.]{1,6})?\s*\.?\s*$")
END_LINE = re.compile(r"^\s*(End|Eno) of ", re.I)


def is_heading(line):
    s = line.strip()
    if not s:
        return False
    if PART_LINE.match(s) or END_LINE.match(s) or s in ("I.", "THE VIRGIN OF THE WORLD."):
        return True
    # 'Asclepios.' as a title (the speaker's name is 'Asclepios:' or 'Asclepios :')
    return key(s) in HEADING_KEYS and len(s) < 60 and not s.endswith(":")


# ---------------------------------------------------------------------------
# Note marks and page markers
# ---------------------------------------------------------------------------

MARKS = Counter()


def strip_marks(text, name):
    """E's and T's note marks and page markers out of a line of the text."""
    t = re.sub(r"\s*\d{1,3}:\s?\[\d+\]", "", text)  # T: '3:[1]'
    t = re.sub(r"\s*\[\d{1,2}\]", "", t)  # T: '[1]'
    t = re.sub(r"\s*-*\s*\bp\. ?\d{1,3},?(?=\s|$)", "", t)  # E and T: 'p. 78', '--- p. 11,'
    # E: a superscript note figure, read as a figure or as '!', '?', '©', '°', glued to a word or its point
    t2 = re.sub(r"(?<=[A-Za-zé.,;:'\"’”)])(\d{1,2}|[©®°])(?=[\s.,;:]|$)", "", t)
    t2 = re.sub(r"(?<=[.,;:])[!?](?=\s|$)", "", t2)
    t2 = re.sub(r"(?<=[,;:]['\"’”])[!?](?=\s|$)", "", t2)
    t2 = re.sub(r"(?<=[.]['\"’”])[!?](?=\s|$)", "", t2)
    if t2 != t:
        MARKS[name] += 1
        log(f"  {name} mark out: {t.strip()[-50:]!r} -> {t2.strip()[-50:]!r}")
    return t2


def blocks_of(lines):
    out, cur = [], []
    for line in lines:
        if line.strip():
            cur.append(line)
        elif cur:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    return out


def words_of(text):
    text = re.sub(r"(\w)-[ \t]*\n\s*(\w)", r"\1-\2", text)  # a compound broken at a line end
    text = text.replace("---", " -- ").replace("--", " -- ").replace("—", " -- ")
    return [w for w in text.split() if key(w) or w == "--"]


# ---------------------------------------------------------------------------
# E: the base
# ---------------------------------------------------------------------------

FOOTNOTE_START = re.compile(r"^\s*\d{1,2}\s*[A-Z\"'“‘(a-z]")


def load_e(path, vocab):
    lines = open(path, encoding="utf-8").read().split("\n")
    a = next(i for i, l in enumerate(lines) if l.startswith("THE mystic title"))
    b = next(i for i, l in enumerate(lines) if "curse of Eva." in l)
    c = [i for i, l in enumerate(lines) if l.strip() == "THE VIRGIN OF THE WORLD"][-1]
    d = next(i for i, l in enumerate(lines) if l.strip() == "The End.")
    intro = lines[a:b] + [lines[b][: lines[b].index("curse of Eva.") + len("curse of Eva.")]]
    region = intro + [""] + lines[c + 1:d]
    paras = []
    dropped = Counter()
    for block in blocks_of(region):
        if FOOTNOTE_START.match(block[0]) and not re.match(r"^\s*\(\d", block[0]):
            dropped["footnotes"] += 1
            log(f"  E footnote out: {block[0][:70]!r} (+{len(block) - 1} lines)")
            continue
        # The OCR of the e-book's ornaments: blocks of short lines that are
        # mostly not words of the text.
        def junky(line):
            toks = [key(t) for t in line.split() if key(t)]
            real = [t for t in toks if t in vocab]
            return bool(toks) and len(line) < 70 and (len(real) * 2 < len(toks) or (not real and len(toks) <= 3))

        lines_ = [l for l in block if not is_heading(l)]
        if lines_ and all(junky(l) for l in lines_):
            dropped["ornament blocks"] += 1
            log(f"  E ornament out: {' / '.join(l.strip() for l in lines_)!r}")
            continue
        kept = []
        for line in lines_:
            if junky(line):
                log(f"  E line kept, though not all words: {line.strip()!r}")
            kept.append(strip_marks(line, "E"))
        text = "\n".join(kept)
        # E's OCR splits a word after its capital J ("J ustice", "J udæa").
        text, n = re.subn(r"\bJ (?=[a-zæ])", "J", text)
        dropped["J split"] += n
        words = words_of(text)
        if words:
            paras.append(words)
    log(f"E: {sum(len(p) for p in paras)} words, {len(paras)} blocks; dropped {dict(dropped)}")
    return paras


# ---------------------------------------------------------------------------
# T: the second copy of the transcription
# ---------------------------------------------------------------------------

def load_t(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    out, skipping = [], False
    for line in lines:
        s = line.strip()
        if s == "Footnotes":
            skipping = True
            continue
        if skipping and is_heading(line):
            skipping = False
        if skipping:
            continue
        if re.fullmatch(r"\d{1,3}", s) or s == "The End." or is_heading(line):
            out.append("")
            continue
        out.append(strip_marks(line, "T"))
    toks = []
    for block in blocks_of(out):
        for n, w in enumerate(w for w in words_of("\n".join(block)) if key(w)):
            toks.append({"w": w, "page": None, "para": n == 0, "top": False})
    log(f"T: {len(toks)} words")
    return toks


# ---------------------------------------------------------------------------
# V: the OCR of the 1885 scan, page by page
# ---------------------------------------------------------------------------


def page_label(leaf):
    """Leaf 24 is p. xix; leaf 38 is p. 1 (read on the page images)."""
    if leaf <= 35:
        n, out = leaf - 5, ""
        for v, s in [(10, "x"), (9, "ix"), (5, "v"), (4, "iv"), (1, "i")]:
            while n >= v:
                out += s
                n -= v
        return out
    return str(leaf - 37)


NOTE_START = re.compile(r"^([*†‡§]\s*[A-Z\"“'‘(\[]|\|\||t\s+[A-Z]|\.\s*[\"“])")


def load_v(path):
    raw = open(path, encoding="utf-8").read()
    objs = re.findall(r"<OBJECT.*?</OBJECT>", raw, re.S)
    toks = []
    for leaf in list(range(24, 27)) + list(range(38, 192)):
        paras = []
        for para in re.findall(r"<PARAGRAPH>(.*?)</PARAGRAPH>", objs[leaf - 1], re.S):
            lines = []
            for ln in re.findall(r"<LINE>(.*?)</LINE>", para, re.S):
                ws = [html.unescape(w).strip() for w in re.findall(r"<WORD[^>]*>(.*?)</WORD>", ln, re.S)]
                lines.append(" ".join(w for w in ws if w))
            paras.append(lines)
        # the page number at the head
        while paras and re.fullmatch(r"[^A-Za-z]{0,3}[\(\[]?\s*[\dxivjlIJmtrnE?.]{1,7}\s*[\)\]]?\.?", " ".join(paras[0]).strip()):
            paras = paras[1:]
        # the catchword (with the signature mark) at the foot
        while paras and len(" ".join(paras[-1]).split()) <= 4 and ("[" in " ".join(paras[-1]) or not re.search(r"[a-z]{3}", " ".join(paras[-1]))):
            paras = paras[:-1]
        body = []
        for p in paras:
            first = (p[0] if p else "").strip()
            if body and NOTE_START.match(first):
                break  # the footnotes, to the foot of the page
            if all(is_heading(l) for l in p):
                continue
            body.append(p)
        for n, p in enumerate(body):
            text = "\n".join(p)
            text = re.sub(r"(\w)[-¬][ \t]*\n\s*(\w)", r"\1\2", text)
            text = re.sub(r"(?<=[A-Za-z,.;:])[*†‡](?=\s|$)", "", text)
            ws = [w for w in words_of(text) if key(w)]
            for m, w in enumerate(ws):
                toks.append({"w": w, "page": page_label(leaf), "para": m == 0, "top": n == 0})
    for i in range(len(toks) - 1):  # a word broken across a page
        a, b = toks[i], toks[i + 1]
        if a["w"].endswith("-") and b["w"][:1].islower() and a["page"] != b["page"]:
            a["w"] = a["w"][:-1] + b["w"]
            b["w"] = ""
    toks = [t for t in toks if key(t["w"])]
    log(f"V: {len(toks)} words")
    return toks


# ---------------------------------------------------------------------------
# Units, alignment and the vote
# ---------------------------------------------------------------------------


def split_units(paras):
    """E's paragraphs -> units: [{'id', 'treatise', 'numeral', 'toks': [[word, new paragraph], ...]}]."""
    flat = []
    for p in paras:
        for n, w in enumerate(p):
            flat.append([w, n == 0])
    keys = [key(w) for w, _ in flat]
    starts = []
    for uid, _, _, opening in UNITS:
        ok = [key(w) for w in words_of(opening) if key(w)]
        hits = [i for i in range(len(keys) - len(ok)) if [k for k in keys[i:i + len(ok) + 3] if k][: len(ok)] == ok and keys[i] == ok[0]]
        hits = [i for i in hits if not starts or i > starts[-1]]
        assert hits, ("unit opening not found in E", uid, opening)
        starts.append(hits[0])
    units = []
    for n, (uid, tr, num, _) in enumerate(UNITS):
        a = starts[n]
        b = starts[n + 1] if n + 1 < len(UNITS) else len(flat)
        toks = [list(t) for t in flat[a:b]]
        toks[0][1] = True
        units.append({"id": uid, "treatise": tr, "numeral": num, "toks": toks})
    return units


def split_t(t_toks):
    """T's words, cut at the same openings: {unit id: [token, ...]}; a unit T
    does not have (the Introduction, Tatios V) is left out."""
    keys = [key(t["w"]) for t in t_toks]
    found = []
    for uid, _, _, opening in UNITS:
        ok = [key(w) for w in words_of(opening) if key(w)]
        after = found[-1][1] if found else 0
        hit = next((i for i in range(after, len(keys) - len(ok)) if keys[i:i + len(ok)] == ok), None)
        if hit is None:
            log(f"  T has no {uid}")
            continue
        found.append((uid, hit))
    out = {}
    for n, (uid, a) in enumerate(found):
        b = found[n + 1][1] if n + 1 < len(found) else len(t_toks)
        out[uid] = t_toks[a:b]
    return out


def window(toks, first_keys, last_keys, length):
    """The part of a witness from a unit's first words to its last, or None."""
    sk = [key(t["w"]) for t in toks]
    G = 6
    head = set(first_keys)
    a, best = None, -1
    for n in range(0, 30):
        gram = first_keys[n:n + G]
        if len(gram) < G:
            break
        for i in range(len(sk) - G + 1):
            if sk[i:i + G] == gram:
                score = sum(1 for k in sk[max(0, i - n):i - n + len(first_keys)] if k in head)
                if score > best:
                    a, best = i - n, score
        if a is not None:
            break
    if a is None:
        return None
    a = max(0, a)
    b, best = None, None
    for n in range(0, 30):
        gram = last_keys[len(last_keys) - G - n:len(last_keys) - n]
        if len(gram) < G:
            break
        for i in range(a, len(sk) - G + 1):
            if sk[i:i + G] == gram:
                end = i + G + n
                if best is None or abs(end - a - length) < best:
                    b, best = end, abs(end - a - length)
    if b is None or best > length // 5 + 50:
        b = a + length
    return toks[max(0, a - 3): b + 3]


def align(e_keys, toks):
    """Events where the witness differs from E [(i1, i2, text)]; for each E word
    whether the witness covers it without difference, and the witness token it
    stands against."""
    sk = [key(t["w"]) for t in toks]
    sm = difflib.SequenceMatcher(None, e_keys, sk, autojunk=False)
    events, covered, at = [], [False] * len(e_keys), [None] * len(e_keys)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (i2 > i1 and "".join(e_keys[i1:i2]) == "".join(sk[j1:j2])):
            for d in range(i2 - i1):
                covered[i1 + d] = True
                if tag == "equal":
                    at[i1 + d] = toks[j1 + d]
            continue
        if tag == "replace" and i2 - i1 == j2 - j1:
            for d in range(i2 - i1):
                at[i1 + d] = toks[j1 + d]
                if e_keys[i1 + d] == sk[j1 + d]:
                    covered[i1 + d] = True
                else:
                    events.append((i1 + d, i1 + d + 1, toks[j1 + d]["w"]))
            continue
        events.append((i1, i2, " ".join(t["w"] for t in toks[j1:j2])))
    return events, covered, at


NOTES_OUT = []
QUOTES_OUT = []


def run(units, t_units, v_toks, vocab):
    taken = []
    v_only = []
    for unit in units:
        t_seg = t_units.get(unit["id"])
        for attempt in (1, 2):
            toks = unit["toks"]
            words = [i for i, t in enumerate(toks) if key(t[0])]
            e_keys = [key(toks[i][0]) for i in words]
            ref = [key(t["w"]) for t in t_seg] if t_seg else e_keys
            by_event = defaultdict(dict)
            covered, at = {}, {}
            for sig in ("T", "V"):
                if sig == "T":
                    sub = t_seg
                else:
                    sub = window(v_toks, ref[:40], ref[-40:], len(ref))
                if sub is None:
                    log(f"  {unit['id']}: not in {sig}")
                    continue
                events, cov, att = align(e_keys, sub)
                agree = sum(cov) / max(1, len(cov))
                log(f"  {unit['id']} {sig} (pass {attempt}): {agree:.3f} of E's words matched; {len(events)} places differ")
                covered[sig], at[sig] = cov, att
                for i1, i2, text in events:
                    if i1 == i2 and i1 in (0, len(e_keys)):
                        continue
                    by_event[(i1, i2, key(text))][sig] = text
            if attempt == 2:
                break
            # E's footnotes that run on to a second page of the e-book (their
            # first block is taken out by load_e): a run of twelve words or
            # more that T does not have and V does not have in its text.
            # Also, at any length, what T does not have and is only the OCR of an
            # ornament, a stray note figure, or the 'A.K.' signing a footnote.
            cut = []
            for (i1, i2, k), ws in by_event.items():
                if "T" not in ws or i2 <= i1 or len(k) >= 20:
                    continue
                gone_words = [toks[words[i]][0] for i in range(i1, i2)]
                v_cov = sum(1 for i in range(i1, i2) if "V" in covered and covered["V"][i]) / (i2 - i1)
                stray = [w for w in gone_words if re.fullmatch(r"\W*(A\.?\s?K\.?|AK|\d{1,2}|t)\W*", w) or key(w) not in vocab]
                residue = re.fullmatch(r"\d*", k) and len(stray) * 2 >= len(gone_words) and not any(len(key(w)) > 3 and key(w) in vocab for w in gone_words)
                if (i2 - i1 >= 12 and v_cov < 0.5) or residue:
                    cut.append((i1, i2, "footnote run-on" if not residue else "ornament or note residue"))
            for i1, i2, why in sorted(cut, reverse=True):
                gone = " ".join(toks[words[i]][0] for i in range(i1, i2))
                NOTES_OUT.append((unit["id"], gone))
                log(f"  {unit['id']}: E's {why} out ({i2 - i1} words): {gone[:90]!r} ... {gone[-40:]!r}")
                del toks[words[i1]:words[i2 - 1] + 1]
            if not cut:
                break
        # each E word keeps the T and V words it stands against
        for n, i in enumerate(words):
            toks[i][2:] = [{sig: at[sig][n] for sig in at}]
        for i, t in enumerate(toks):
            if len(t) < 3:
                t[2:] = [{}]
        accepted = []
        for (i1, i2, k), ws in sorted(by_event.items()):
            span = range(i1, max(i2, i1 + 1))
            for_e = [s for s in covered if s not in ws and all(covered[s][i] for i in span if i < len(e_keys))]
            ours = " ".join(toks[words[i]][0] for i in range(i1, i2))
            ctx = " ".join(toks[words[i]][0] for i in range(max(0, i1 - 5), i1)) + " [" + ours + "] " + " ".join(toks[words[i]][0] for i in range(i2, min(len(words), i2 + 4)))
            surface = ws.get("T") or ws.get("V")
            tally = f"{''.join(sorted(ws))} against E{'+' + ''.join(for_e) if for_e else ''}"
            if len(ws) >= 2 and len(ws) > 1 + len(for_e):
                if (key(ours), k) in REJECT:
                    log(f"  rejected {unit['id']} {tally}: {ctx!r} -> {surface!r}")
                    continue
                accepted.append((i1, i2, surface))
                log(f"  TAKEN {unit['id']} {tally}: {ctx!r} -> {surface!r}")
            else:
                vtext = ws.get("V")
                flag = ""
                if vtext is not None and all(key(w) in vocab for w in vtext.split() if key(w)):
                    flag = " REAL-WORD"
                    v_only.append((unit["id"], ctx, vtext))
                log(f"  not taken {unit['id']} {tally}{flag}: {ctx!r} -> {ws}")
        # apply, from the end
        for i1, i2, surface in sorted(accepted, reverse=True):
            new = surface.split()
            if i2 > i1:
                pos = words[i1]
                last = words[i2 - 1]
                para = toks[pos][1]
                if len(new) == 1 and i2 - i1 == 1:
                    old = toks[pos][0]
                    m = re.match(r"^(\W*)(.*?)(\W*)$", old)
                    core = re.match(r"^\W*(.*?)\W*$", new[0]).group(1)
                    toks[pos][0] = m.group(1) + core + m.group(3)
                else:
                    refs = toks[pos][2]
                    toks[pos:last + 1] = [[w, para if j == 0 else False, refs if j == 0 else {}] for j, w in enumerate(new)]
            else:
                pos = words[i1] if i1 < len(words) else len(toks)
                toks[pos:pos] = [[w, False, {}] for w in new]
            taken.append((unit["id"], " ".join(surface.split())))
    return taken, v_only


def paragraphs(unit):
    """Keep E's paragraph breaks only where V (not at a page top) or T breaks too."""
    toks = unit["toks"]
    paras, cur = [], []
    first_page = last_page = None
    for i, t in enumerate(toks):
        refs = t[2]
        page = refs["V"]["page"] if refs.get("V") else None
        if page:
            first_page = first_page or page
            last_page = page
        # E's OCR reads a stray opening quotation mark before many a capital
        # ("‘That which he thought"); it goes where T has none.
        if t[0].startswith("‘") and refs.get("T") and not refs["T"]["w"].startswith(("‘", "'")):
            QUOTES_OUT.append((unit["id"], t[0]))
            t[0] = t[0][1:]
        if t[1] and cur:
            keep = False
            for sig in ("V", "T"):
                w = refs.get(sig)
                if w is not None and w["para"] and not w["top"]:
                    keep = True
            # A speaker's name or a heading-like line set on its own
            if re.fullmatch(r"(Hermes|Asclepios|Tatios|Trismegistos|Isis|Horos)\s*[:.]", " ".join(x[0] for x in cur)) or re.fullmatch(r"(Hermes|Asclepios|Tatios|Trismegistos)\s*[:.]", t[0]):
                keep = True
            if keep:
                paras.append(cur)
                cur = []
        cur.append(t[0])
    if cur:
        paras.append(cur)
    out = []
    for p in paras:
        s = " ".join(p)
        s = re.sub(r"\s*--\s*", "—", s)
        s = re.sub(r"\s+([,.;:?!])", r"\1", s)
        # The book sets each speaker's name ('Hermes:', 'Asclepios:') as a
        # line of its own; E sometimes runs it into the paragraph before or
        # after. Give every such name its own paragraph.
        s = re.sub(r"(?:^|(?<=[.?!\"”—] ))(Hermes|Asclepios|Tatios|Trismegistos):\s*", lambda m: "\n\n" + m.group(1) + ":\n\n", s)
        # In the fragments to Tatios the names are set with a full stop.
        s = re.sub(r"(?:^|(?<=[.?!\"”—] ))(Tatios|Trismegistos)\.(?:\s+(?=[A-Z])|$)", lambda m: "\n\n" + m.group(1) + ".\n\n", s)
        out.extend(x.strip() for x in s.split("\n\n") if x.strip())
    return out, first_page, last_page


# Majority readings the rule would take that are wrong: (E's word, the
# witnesses' reading), as keys. Each must be met.
REJECT = {
    # p. 61 prints "Hylé"; T and V both lose the accent (FIXES restores it).
    ("hylee", "hyle"),
    # p. 154 prints "Stobæus"; "Stobzus" is the OCR of the ligature.
    ("stobaeus", "stobzus"),
}

# One reading is taken by the vote: kore.1, p. 9, '"I will illumine
# mankind"' for E's '"T]'.
TAKEN_COUNT = 1

# Corrections by hand: (unit, old, new, expected count, why). Every one was
# read on the page images of the 1885 copy (V).
FIXES = [
    # Openings: E drops a one-letter word set before the drop capital.
    ("kore.2", "MY illustrious son, if thou", "O MY illustrious son, if thou", 1, "p. 23 opens 'O MY illustrious son'"),
    ("kore.1", "answered Isis.\n\nO", "answered Isis. . . .", 1, "p. 22 ends 'answered Isis. . . .'; the 'O' is kore.2's"),
    ("tat.4", "GREAT and divine power", "A GREAT and divine power", 1, "p. 132 opens 'A GREAT and divine power'"),
    ("tat.5", "one and identical. O", "one and identical.", 1, "the trailing 'O' belongs to tat.6"),
    ("tat.6", "MY son, matter becomes", "O MY son, matter becomes", 1, "p. 133 opens 'O MY son'"),
    # Words that E and T share wrongly
    ("kore.1", "halt Thou decreed", "hast Thou decreed", 1, "p. 18 prints 'hast'"),
    ("tat.7", "air. Put our bodies", "air. But our bodies", 1, "p. 135 prints 'But'"),
    ("intro", "cucurhbite", "cucurbite", 1, "p. xxi prints 'cucurbite'"),
    ("def.1", "genii. I n some", "genii. In some", 1, "a space the e-text puts inside 'In'"),
    ("ascl.10", "is complete for the binding- power", "is complete—for the binding-power", 1, "p. 76 prints 'complete—for the binding-power'"),
    ("ascl.4", "dwelling- place", "dwelling-place", 1, "a hyphen the e-text splits"),
    ("ascl.6", "so that- the", "so that the", 1, "a stray hyphen in the e-text"),
    ("def.4", "all- powerful", "all-powerful", 1, "a hyphen the e-text splits"),
    ("tat.5", "three tenses. ‘They", "three tenses. They", 1, "p. 133 has no quotation mark"),
    ("tat.7", "Heis not real", "He is not real", 1, "a space the e-text drops"),
    ("def.1", "from acommon origin", "from a common origin", 1, "a space the e-text drops"),
    ("kore.1", "shall bea benefit", "shall be a benefit", 1, "a space the e-text drops"),
    ("ascl.1", "Fora discourse", "For a discourse", 1, "a space the e-text drops"),
    ("ascl.10", "as arampart", "as a rampart", 1, "a space the e-text drops"),
    ("ascl.12", "for nowit brings", "for now it brings", 1, "a space the e-text drops"),
    ("tat.7", "and howis it possible", "and how is it possible", 1, "a space the e-text drops"),
    ("ascl.7", "Hyleé", "Hylé", 1, "p. 61 prints 'Hylé'"),
    ("frag.7", "Kythereea", "Kytheræa", 1, "p. 154 prints 'Kytheræa'"),
    ("tat.8", "Stobzeus.", "Stobæus.]", 1, "p. 140 prints 'Stobæus.]'"),
    ("ammon.6", "of Stobaeus.", "of Stobæus.]", 1, "p. 148 prints 'Stobæus.]'"),
    ("frag.2", "Stobeeus'", "Stobæus'", 1, "p. 151 prints 'Stobæus''"),
    ("def.4", "to Baouedc (the king)", "to βασιλεύς (the king)", 1, "p. 112 prints the Greek βασιλεύς"),
    ("def.4", "from (Baivew (to advance)", "from βαίνειν (to advance)", 1, "p. 112 prints the Greek βαίνειν"),
    # Closing brackets the e-text loses
    ("ascl.1", "[Asclepios proposes to call Ammon.", "[Asclepios proposes to call Ammon.]", 1, "p. 46"),
    ("ascl.1", "the divine Love thus begins:—", "the divine Love thus begins:—]", 1, "p. 47"),
    ("frag.5", "from Cyril.", "from Cyril.]", 1, "p. 152"),
    ("frag.6", "cited by Suidas.", "cited by Suidas.]", 1, "p. 153"),
    ("frag.7", "teaching.—A.K.", "teaching.—A.K.]", 1, "p. 154"),
    # Footnote figures, OCR of ornaments, and a closing rubric left at a unit's end
    ("ascl.3", "rampart of the body. 1", "rampart of the body.", 1, "a footnote figure"),
    ("ascl.10", "\n\nro 2 rite", "", 1, "OCR of an ornament, p. 80"),
    ("ascl.15", " A.K. ON S A y Gyrn ee EO aT a ea", "", 1, "the signature of a footnote and the OCR of an ornament, p. 94"),
    ("def.4", " “End of the Definitions of Ascleptos.", "", 1, "the closing rubric, like the other treatises' rubrics, is not part of the text"),
]

# Last pages that the V word positions get wrong (the unit's last words were
# found in V's word boxes, and the pages checked): unit -> (as computed, as printed).
LAST_PAGE_FIXES = {
    "ascl.13": ("89", "90"),
    "def.4": ("119", "113"),
    "ammon.3": ("143", "144"),
}

# Words the e-text keeps with the hyphen of a line-break in the printed book.
# Each was checked in the word boxes of V: the first half ends a printed line,
# and the word is nowhere printed with a hyphen inside a line. Hyphens that
# the book prints inside a line (re-birth, new-born, to-morrow, co-ordinated,
# ever-eternal, sum-total, at-one-ment) are kept. (word, expected count)
JOINS = [
    ("know-ledge", 2), ("to-wards", 1), ("there-fore", 1), ("re-mains", 1), ("re-main", 1),
    ("deter-mined", 1), ("conform-able", 1), ("any-thing", 1), ("self-hood", 1), ("ever-lasting", 2),
]


def main():
    d = sys.argv[1]
    t_toks = load_t(os.path.join(d, "T.txt"))
    vocab = Counter(key(t["w"]) for t in t_toks)
    vocab = {k for k, c in vocab.items() if c >= 1}
    e_paras = load_e(os.path.join(d, "E.txt"), vocab)
    v_toks = load_v(os.path.join(d, "V.djvu.xml"))
    units = split_units(e_paras)
    taken, v_only = run(units, split_t(t_toks), v_toks, vocab)
    log(f"{len(taken)} readings taken by the vote; {len(v_only)} places where V alone reads a real word")
    if TAKEN_COUNT is not None:
        assert len(taken) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(taken))
    applied = Counter()
    joined = Counter()
    out = []
    for unit in units:
        paras, first, last = paragraphs(unit)
        text = "\n\n".join(paras)
        for n, (uid, old, new, count, _why) in enumerate(FIXES):
            if uid == unit["id"] and old in text:
                applied[n] += text.count(old)
                text = text.replace(old, new)
        if unit["id"] in LAST_PAGE_FIXES:
            computed, printed = LAST_PAGE_FIXES[unit["id"]]
            assert last == computed, ("LAST_PAGE_FIXES out of date", unit["id"], last)
            last = printed
        for word, _count in JOINS:
            pattern = r"\b" + word + r"\b"
            joined[word] += len(re.findall(pattern, text))
            text = re.sub(pattern, word.replace("-", ""), text)
        out.append({"id": unit["id"], "treatise": unit["treatise"], "numeral": unit["numeral"], "firstPage": first, "lastPage": last, "text": text})
        log(f"unit {unit['id']}: pp. {first}-{last}, {len(paras)} paragraphs, {len(text.split())} words")
    for n, (uid, old, _new, count, _why) in enumerate(FIXES):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", uid, old, applied[n])
    for word, count in JOINS:
        assert joined[word] == count, ("JOINS entry met the wrong number of times", word, joined[word])
    write(out)


def write(units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/virgin-of-the-world.py from an e-text of The Virgin\n")
    w("// of the World (Kingsford and Maitland, London, 1885), voted word by word against\n")
    w("// a second copy of that e-text and the archive.org OCR of Google's scan of an 1885\n")
    w("// copy. Do not edit by hand: correct the generator (its FIXES list holds every\n")
    w("// correction made by hand) and run it again.\n\n")
    w("export type VirginUnit = {\n")
    w("  /** 'intro', or the treatise and part: 'kore.1', 'ascl.12', 'def.3', 'tat.5', 'ammon.2', 'frag.8'. */\n  id: string;\n")
    w("  /** The treatise: 'intro', 'kore', 'ascl', 'def', 'tat', 'ammon' or 'frag'. */\n  treatise: string;\n")
    w("  /** The part's Roman numeral as printed ('' for the Introduction). */\n  numeral: string;\n")
    w("  /** The printed pages of the 1885 edition the unit runs over (Roman for the Introduction). */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** Paragraphs separated by blank lines. */\n  text: string;\n};\n\n")
    w("export const VIRGIN_TREATISE_TITLES: Record<string, string> = ")
    w(json.dumps(TREATISES, ensure_ascii=False, indent=2) + ";\n\n")
    w("export const VIRGIN_UNITS: VirginUnit[] = [\n")
    for u in units:
        w(f"  {{ id: {json.dumps(u['id'])}, treatise: {json.dumps(u['treatise'])}, numeral: {json.dumps(u['numeral'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
