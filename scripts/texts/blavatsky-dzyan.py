"""Blavatsky: the Stanzas of Dzyan (The Secret Doctrine, 1888) and selected passages
from Isis Unveiled (1877) and The Secret Doctrine -> blavatsky-text.ts.

WHAT IS IMPORTED.

  1. The Secret Doctrine, vol. I (Cosmogenesis), "Cosmic Evolution. In Seven
     Stanzas translated from the Book of Dzyan", pp. 27-34: Stanzas I-VII, as
     Blavatsky first printed them together, before the commentary that repeats
     them sloka by sloka (pp. 35 ff.). Her closing sentence on p. 34 ("Thus ends
     this portion of the archaic narrative ...") is her own and is left out.
  2. The Secret Doctrine, vol. II (Anthropogenesis), "Stanzas from the Book of
     Dzyan. Anthropogenesis in the Secret Volume. (Verbatim extracts.)",
     pp. 15-21: Stanzas I-XII, slokas 1-49, numbered straight through.
  3. Twenty passages of her own prose (SELECTIONS below) on the claimed
     ancient book, Hermes and Egypt, the Smaragdine (Emerald) Tablet, Atlantis
     and the root races, from Isis Unveiled (1877) and The Secret Doctrine
     (1888), each cut at the start and end phrases given and located by volume
     and page of the first edition.

Footnotes are left out (the Stanzas' two footnotes, and her note on the
forty-nine slokas, are recorded in the corpus file's notes), except where a
footnote is itself part of a selected passage ("note" spans, printed after the
text with "[Footnote]"). Her commentary on the Stanzas is not imported except
where a selected passage is commentary.

INPUTS (all public domain; first-edition pagination).

  T  the Theosophical University Press online edition (theosociety.org/pasadena),
     which reproduces the first editions page for page ("Vol. 1, Page 27";
     "507 -- THE SACRED TETRAGRAM."). A proofread transcription: the base.
     Its HTML pages are read as saved (sd1-1-01.htm, iu1-13.htm ...: the
     names of the TUP pages) and turned into text here, keeping the page lines.
  OCRs (archive.org djvu.txt) of scans of separate printed copies:
     Secret Doctrine vol. I:
       W  secretdoctrinesy0001hpbl_w8r1  (a copy whose title page reads 1888)
       F  bwb_C0-ADX-874                 (Theosophical University Press, 1977,
                                          "A Facsimile of the Original Edition of 1888")
       D  in.ernet.dli.2015.62045        (Theosophy Company, 1925 facsimile of
                                          the 1888 edition, both volumes)
     Secret Doctrine vol. II:
       L  b24886142                      (Wellcome Library copy, 1888)
       O  secretdoctrinesy0002hpbl_o5q6  (a copy whose title page reads 1888)
       F  bwb_Y0-BMG-596                 (TUP 1977 facsimile)
       D  in.ernet.dli.2015.62045        (as above)
     Isis Unveiled vol. I / vol. II:
       C  cu31924092304579 / cu31924092304587  (Cornell, J. W. Bouton, New York, 1877)
       W  b24886154_0001 / b24886154_0002      (Wellcome, Bouton, 1878 printing)
       I  india.history.resource.85990 / 85989 (Bouton, 1877, "2nd ed." in the
                                                record; same plates and pages)
  The Third and Revised Edition (1893) is not used: its text was revised and
  its pages differ (archive.org secretdoctrinesy01blav, -02blav were looked at
  and set aside for that reason).

METHOD. Each passage is cut from T and its page lines and footnote blocks are
removed. Each OCR is located by its best match to the passage (difflib), and
T's words are aligned with each OCR word by word on letters only (case,
accents, hyphens and ligatures ignored). Where at least two OCRs agree on a
word against T, and more OCRs read it so than as T does, their word is taken
(T's capitals are kept, since the OCRs read small capitals as capitals). The
same is done for a word's closing punctuation (. , ; : ? !). Figures and the
roman numerals of the slokas are never changed. REJECT lists the places where
the OCRs agree on a misreading. FIXES holds every correction made by hand, each
asserted to apply exactly the stated number of times, with what it was checked
against. Every change and every rejection is printed to stderr.

Misprints of the first edition are kept where the OCRs and the page image agree:
"brillant" (vol. I p. 29), "heard ot the book of Dzyan" (vol. I p. viii, page
image of copy W), "autara" (Isis I p. 590).

The print's circumflexes (Svabhavat is printed with them) and other accents
are not reproduced: the text follows T's spellings. Small capitals are given
in the case T gives them, which follows the print's capitals (checked on the
page images of vol. II p. 15 and vol. I p. 31).

Usage:
  python3 -I scripts/texts/blavatsky-dzyan.py TUP_DIR OCR_DIR > src/lib/timeline/texts/corpus/blavatsky-text.ts
"""

import difflib
import json
import os
import re
import sys
import unicodedata
from collections import Counter

COPIES = {
    "sd1": [("W", "secretdoctrinesy0001hpbl_w8r1"), ("F", "bwb_C0-ADX-874"), ("D", "in.ernet.dli.2015.62045")],
    "sd2": [("L", "b24886142"), ("O", "secretdoctrinesy0002hpbl_o5q6"), ("F", "bwb_Y0-BMG-596"), ("D", "in.ernet.dli.2015.62045")],
    "iu1": [("C", "cu31924092304579"), ("W", "b24886154_0001"), ("I", "india.history.resource.85990")],
    "iu2": [("C", "cu31924092304587"), ("W", "b24886154_0002"), ("I", "india.history.resource.85989")],
}

# The selected passages: id, book, volume, TUP file, spans (start phrase, end
# phrase, kind). "text" spans are the body; "note" spans are her footnotes,
# kept only where the passage needs them.
SELECTIONS = [
    ("iu.1.1", "isis", 1, "iu1-01", [("There exists somewhere in this wide world an old Book", "until upon touching the ground it is as black as night.", "text")]),
    ("iu.1.3", "isis", 1, "iu1-01", [("The Astor Library of New York has recently been enriched", "how can we know what sunshine may be let in upon the dark crypts of history by an equally accidental meeting between some other prosperous Egyptian and another enterprising student of antiquity!", "text")]),
    ("iu.1.xxxi", "isis", 1, "iu1-00in", [
        ("If we only carefully compare the verses from this Mandala", "Separate the earth from the", "text"),
        ("fire, the subtile from the gross. . . . What I had to say", "and also that of Pythagoras and Plato.", "text"),
    ]),
    ("iu.1.507", "isis", 1, "iu1-13", [("Tradition declares that on the dead body of Hermes, at Hebron", "\"By it the world was formed.\"", "text")]),
    ("iu.1.589", "isis", 1, "iu1-15", [
        ("Tradition says, and the records of the Great Book explain", "revealed to them the ineffable, and now lost \"word.\"", "text"),
        ("This word, which is no word, has travelled once around the globe", "subterranean ways.", "text"),
        ("Who can tell but the lost Atlantis", "Who can tell but the lost Atlantis — which is also", "text"),
        ("mentioned in the Secret Book, but, again, under another name", "to disconnect himself from a story which the obligations imposed at initiation forbade him to divulge.", "text"),
    ]),
    ("iu.1.592", "isis", 1, "iu1-15", [
        ("To continue the tradition, we have to add that the class of hiero", "To continue the tradition, we have to add that the class of hiero-", "text"),
        ("phants was divided into two distinct categories", "like the Hindu Noah — Vaiswasvata.", "text"),
    ]),
    ("iu.2.360", "isis", 2, "iu2-08a", [("Until the end comes, well may sincere Christians remember", "the sacred mysteries of Isis.\"", "text")]),
    ("iu.2.361", "isis", 2, "iu2-08a", [
        ("Baron Bunsen shows that the origin of the ancient prayers", "is as old as this", "text"),
        ("period\" (Tablet, Brit. Mus., 562).", "period\" (Tablet, Brit. Mus., 562).", "text"),
    ]),
    ("iu.2.364", "isis", 2, "iu2-08a", [("In Egypt every city of importance was separated from its burial place", "the probable solemn drama which was then taking place in the invisible realm whither the soul had fled.", "text")]),
    ("sd.1.viii", "sd", 1, "sd1-0-co", [("It is more than probable that the book will be regarded", "and follows the laws of uniformity and analogy.", "text")]),
    ("sd.1.xx", "sd", 1, "sd1-0-in", [("Dan, now become in modern Chinese and Tibetan phonetics", "Hence Dzan, Djan phonetically, the “Book of Dzyan.”", "note")]),
    ("sd.1.xxii", "sd", 1, "sd1-0-in", [("One of the greatest, and, withal, the most serious objection", "and of checking most of the quotations.", "text")]),
    ("sd.1.xliii", "sd", 1, "sd1-0-in", [("The “very old Book” is the original work from which the many volumes of Kiu-ti were compiled.", "the once living hero and reformer.", "text")]),
    ("sd.1.1", "sd", 1, "sd1-0-pr", [("An Archaic Manuscript — a collection of palm leaves", "the germ within the latter which will become the Universe, the all, the boundless, periodical Kosmos, this germ being latent and active, periodically and by turns.", "text")]),
    ("sd.2.1", "sd", 2, "sd2-0-pn", [
        ("As regards the evolution of mankind, the Secret Doctrine postulates", "in the animal kingdom.", "text"),
        ("The Secret Doctrine is not alone in speaking of primeval men", "Seven kings, brothers of the same family.”", "text"),
        ("Thus saith Pymander", "the translator wonders “for whom these seven men are intended?”", "note"),
    ]),
    ("sd.2.6", "sd", 2, "sd2-0-pn", [("Therefore, in view of the possible, and even very probable confusion", "were divulged to the men of the secret science, but not to the geographers.”", "text")]),
    ("sd.2.109", "sd", 2, "sd2-1-06", [("(a) Remember in this connection the Tabula Smaragdina of Hermes", "“and Spiritual Fire is its instructor (Guru).”", "text")]),
    ("sd.2.113", "sd", 2, "sd2-1-06", [("Hence in the Smaragdine Tablet, disfigured by Christian hands", "is the Universal Agent or Lapis Philosophorum.", "text")]),
    ("sd.2.556", "sd", 2, "sd2-2-09", [("Isarim, an Initiate, is said to have found at Hebron", "and its double mystery is solved — to the Occultist.", "text")]),
    ("sd.2.743", "sd", 2, "sd2-3-07", [("“You do not know which was the best and most handsome generation", "The Greeks were but the dwarfed and weak remnant of that once glorious nation. . . .”", "text")]),
]

# Places where two or more OCRs agree on a misreading: (passage id, T's word).
REJECT = {
    # Small capitals misread alike by the OCRs of W and F (F is a photographic
    # facsimile of the same printing): the page images read HOLY, FOHAT, LHA, WISDOM.
    ("cosmo.5", "Holy"),
    ("cosmo.7", "Fohat."),
    ("cosmo.7", "Lha."),
    ("anthro.1", "Wisdom."),
    # Isis: capital I read as l, and the ligature ae read as e.
    ("iu.1.3", "Iamblichus,"),
    ("iu.1.3", "archaeologist"),
    # The l of "lessons" is broken in the print (page image of IU II p. 361,
    # Cornell copy); all three OCRs read "essons". T's "lessons" is kept.
    ("iu.2.361", "lessons"),
    # SD II: OCR line-break and Greek artefacts. "black, swarthy" is read
    # "blacks, warthy"; "terra" as "tevva"; the Greek word gar (in T's
    # transliteration) as "yap"; and "Timæus" loses its ligature.
    ("sd.2.1", "(black,"),
    ("sd.2.1", "swarthy"),
    ("sd.2.6", "terra"),
    ("sd.2.6", "gar"),
    ("sd.2.743", "(Timaeus)."),
}

# Corrections by hand: (passage id or stanza key, old, new, expected count, why).
FIXES = [
    ("cosmo.4", "enclosed within the are the sacred four", "enclosed within the ◯ are the sacred four", 1,
     "The print has a circle here (page image of vol. I p. 31, copy W); T leaves it out. The commentary on the sloka repeats it as 'within the ◯ (boundless circle)'."),
    ("anthro.4", "were i to give it mine", "were I to give it mine", 1,
     "The print has a small capital I (page image of vol. II p. 17, copy L); T has a lower-case i."),
    ("anthro.4", "were I to give it mine,” said", "were I to give it mine.” said", 1,
     "The print has a full stop inside the quotation mark (page image of vol. II p. 17, copy L), as three of the four OCRs read it; T has a comma."),
    ("anthro.10", "42. they built temples", "42. They built temples", 1,
     "The print begins the sloka with a capital (page image of vol. II p. 20, copy L)."),
    ("cosmo.4", "the Oeaohoo, which is: 5. “Darkness”", "the Oeaohoo, which is:\n\n5. “Darkness”", 1,
     "Sloka 5 begins a new paragraph at the head of vol. I p. 31 (OCRs W, F, D); joining across the page put it inside sloka 4."),
    ("cosmo.6", "How does Fohat build them? he collects", "How does Fohat build them? He collects", 1,
     "A new sentence; the OCR of copy D reads 'HE' (the stanza is set in small capitals), and the commentary's repetition reads 'He collects'."),
    ("sd.2.6", "[[Eggus gar nuktos te kai ematos eisi keleuthoi]]", "[Greek, given in the online edition's transliteration: Eggus gar nuktos te kai ematos eisi keleuthoi]", 1,
     "The print has the line of the Odyssey in Greek type; T gives a transliteration in double brackets. It is marked as such rather than re-set in Greek, which was not checked letter by letter."),
]

KEEP_HYPHEN = set()

PAGE_SD = re.compile(r"^Vol\. (\d), Page\s+([0-9ivxlc]+)\b.*$", re.M)
PAGE_IU = re.compile(r"^([0-9ivxlc]+) — [A-Z][^\n]*$", re.M)
FOOTBLOCK = re.compile(r"Footnote\(s\) —+.*?(?=^Vol\. \d, Page |\Z)", re.S | re.M)


def html_text(path):
    """A TUP page as plain text: paragraphs and line breaks kept, tags dropped."""
    import html as htmlmod

    h = open(path, encoding="utf-8", errors="replace").read()
    h = h[h.find("<body"):]
    h = re.sub(r"<br\s*/?>", "\n", h)
    h = re.sub(r"</p>|</h\d>|<hr[^>]*>", "\n\n", h)
    t = htmlmod.unescape(re.sub(r"<[^>]+>", "", h)).replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n[ \t]+", "\n", t)
    return re.sub(r"\n\s*\n+", "\n\n", t)


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = unicodedata.normalize("NFKD", word)
    w = w.replace("æ", "ae").replace("Æ", "ae").replace("œ", "oe").replace("Œ", "oe")
    w = "".join(c for c in w if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]", "", w.lower())


def page_at(raw, pos, pattern):
    """The printed page at a position: the last page line before it. Before the
    first page line of a TUP file (Isis Unveiled vol. I, p. 1 has none), the page
    before the first one given."""
    page = None
    first = None
    for m in pattern.finditer(raw):
        number = m.group(2) if pattern is PAGE_SD else m.group(1)
        first = first or number
        if m.start() > pos:
            break
        page = number
    if page is None and first and first.isdigit():
        page = str(int(first) - 1)
    return page


def find(raw, phrase, start=0):
    i = raw.find(phrase, start)
    if i < 0:
        # allow straight quotes in the spec where T has curly ones
        alt = phrase.replace('"', "“", 1)
        pat = re.escape(phrase).replace('"', '["“”]').replace("'", "['‘’]")
        m = re.compile(pat).search(raw, start)
        if not m:
            raise SystemExit(f"phrase not found: {phrase[:70]!r}")
        return m.start(), m.end()
    return i, i + len(phrase)


def clean(text, kind):
    """Remove page lines and footnote blocks from a span; join a paragraph broken by a page."""
    if kind == "text":
        text = FOOTBLOCK.sub("", text)
    text = re.sub(r"\[\[Footnote continued [^\]]*\]\]", "", text)
    text = PAGE_SD.sub("\x00", text)
    text = PAGE_IU.sub("\x00", text)
    text = re.sub(r"^—{3,}\s*$", "", text, flags=re.M)

    def join(m):
        before = m.group(1)
        if before.endswith("-") and not before.endswith("--"):
            return before[:-1]
        if re.search(r"[A-Za-z,;:—]$", before):
            return before + " "
        return before + "\n\n"

    # Footnote marks attached to a word (not the "* * *" of an omission),
    # removed first so that a paragraph broken by a page after a mark is joined.
    text = re.sub(r"(?<=[^\s*])[*†‡§¶]+", "", text)
    text = re.sub(r"(\S)\s*\x00\s*", join, text)
    text = text.replace("\x00", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    # A lone line break inside a paragraph (T's own line breaks) is a space.
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def pages_label(first, last):
    return f"p. {first}" if first == last else f"pp. {first}–{last}"


# ---------------------------------------------------------------- OCR side

def ocr_tokens(path):
    raw = open(path, encoding="utf-8", errors="replace").read()
    raw = raw.replace("­", "")
    raw = re.sub(r"(\w)-[ \t]*\n\s*(\w)", r"\1-\2", raw)
    raw = raw.replace("—", " — ").replace("--", " -- ")
    toks = raw.split()
    out = []  # (key, text, trailing punctuation)
    for i, t in enumerate(toks):
        k = key(t)
        if not k:
            if out and out[-1][2] is not None and re.fullmatch(r"[.,;:?!]+", t):
                out[-1] = (out[-1][0], out[-1][1], out[-1][2] + t)
            continue
        out.append((k, t, trail(t)))
    return out


def trail(t):
    """The punctuation closing an OCR word, or None when a bracket or quotation mark follows it."""
    m = re.search(r"[A-Za-z0-9]([^A-Za-z0-9]*)$", t)
    rest = m.group(1) if m else ""
    return rest if re.fullmatch(r"[.,;:?!]*", rest) else None


OCR_CACHE = {}


def ocr(ident, ocrdir):
    if ident not in OCR_CACHE:
        toks = ocr_tokens(os.path.join(ocrdir, ident + ".txt"))
        grams = {}
        for i in range(len(toks) - 3):
            grams.setdefault(tuple(t[0] for t in toks[i : i + 4]), []).append(i)
        OCR_CACHE[ident] = (toks, grams)
    return OCR_CACHE[ident]


def locate(base_keys, ident, ocrdir):
    toks, grams = ocr(ident, ocrdir)
    keys = [t[0] for t in toks]
    n = len(base_keys)
    cands = set()
    for j in range(0, max(1, min(n - 3, 60))):
        for p in grams.get(tuple(base_keys[j : j + 4]), []):
            cands.add(max(0, p - j))
    best = None
    for s in sorted(cands):
        window = keys[max(0, s - 20) : s + int(n * 1.6) + 40]
        sm = difflib.SequenceMatcher(None, base_keys, window, autojunk=False)
        score = sum(b.size for b in sm.get_matching_blocks())
        if best is None or score > best[0]:
            best = (score, max(0, s - 20))
    if best is None or best[0] < n * 0.5:
        log(f"  {ident}: not found (best {best and best[0]}/{n})")
        return None
    s = best[1]
    window = toks[s : s + int(n * 1.6) + 40]
    sm = difflib.SequenceMatcher(None, base_keys, [t[0] for t in window], autojunk=False)
    aligned = [None] * n
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1 and i2 - i1 <= 4):
            for d in range(i2 - i1):
                aligned[i1 + d] = window[j1 + d]
    agree = sum(1 for i in range(n) if aligned[i] and aligned[i][0] == base_keys[i]) / max(n, 1)
    log(f"  {ident}: agreement {agree:.3f}")
    return aligned


ROMAN = re.compile(r"^(?:[ivxl]+|\d+)$")


def apply_case(base_core, alt_key):
    if base_core.isupper() and len(base_core) > 1:
        return alt_key.upper()
    if base_core[:1].isupper():
        return alt_key[:1].upper() + alt_key[1:]
    return alt_key


def collate(pid, text, vol, ocrdir):
    """Return T's text with the majority readings of the OCRs taken."""
    spans = [(m.start(), m.end()) for m in re.finditer(r"[^\s—]+", text)]
    words = [text[a:b] for a, b in spans]
    keyed = [i for i, w in enumerate(words) if key(w)]
    base_keys = [key(words[i]) for i in keyed]
    if not base_keys:
        return text
    readings = []
    for siglum, ident in COPIES[vol]:
        al = locate(base_keys, ident, ocrdir)
        if al is not None:
            readings.append((siglum, al))
    out = list(words)
    for n, i in enumerate(keyed):
        w = words[i]
        m = re.match(r"^(.*?)([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9'’\-]*[A-Za-zÀ-ÿ0-9]|[A-Za-zÀ-ÿ0-9])(.*)$", w)
        if not m:
            continue
        lead, core, tail = m.groups()
        bk = base_keys[n]
        votes = Counter(r[1][n][0] for r in readings if r[1][n])
        alt = [(k, c) for k, c in votes.items() if k != bk]
        if alt and not ROMAN.match(bk) and "-" not in core and "’" not in core and "'" not in core:
            k2, c2 = max(alt, key=lambda x: x[1])
            if c2 >= 2 and c2 > votes.get(bk, 0):
                if (pid, w) in REJECT:
                    log(f"  rejected {pid}: {w} -> {k2} ({dict(votes)})")
                else:
                    new = apply_case(core, k2)
                    context = " ".join(words[max(0, i - 4) : i + 4])
                    log(f"  changed {pid}: [{w}] -> [{lead}{new}{tail}] ({dict(votes)}) in '{context}'")
                    core = new
        # closing punctuation
        # closing punctuation, only where T's word ends in plain punctuation
        # (not a bracket or quotation mark) and is not a sloka's number
        if not re.fullmatch(r"[.,;:?!]*", tail) or ROMAN.match(bk):
            out[i] = lead + core + tail
            continue
        bt = tail
        pv = Counter(r[1][n][2] for r in readings if r[1][n] and r[1][n][0] == bk and r[1][n][2] is not None)
        palt = [(p, c) for p, c in pv.items() if p != bt and p in {".", ",", ";", ":", "?", "!"}]
        if palt:
            p2, c2 = max(palt, key=lambda x: x[1])
            if c2 >= 2 and c2 > pv.get(bt, 0) and (pid, w) not in REJECT:
                log(f"  punctuation {pid}: [{w}] {bt!r} -> {p2!r} ({dict(pv)})")
                tail = p2 + tail[len(bt):]
        out[i] = lead + core + tail
    res = []
    last = 0
    for (a, b), w in zip(spans, out):
        res.append(text[last:a])
        res.append(w)
        last = b
    res.append(text[last:])
    return "".join(res)


def apply_fixes(pid, text):
    for fid, old, new, count, _why in FIXES:
        if fid != pid:
            continue
        found = text.count(old)
        assert found == count, (pid, old, found)
        text = text.replace(old, new)
        log(f"  fix {pid}: {old!r} -> {new!r}")
    return text


# ---------------------------------------------------------------- the Stanzas

def stanzas(tupdir, ocrdir):
    out = []
    raw = html_text(os.path.join(tupdir, "sd1-1-01.htm"))
    a, _ = find(raw, "STANZA I.\n")
    b, _ = find(raw, "Thus ends this portion of the archaic narrative")
    heads = list(re.finditer(r"^STANZA ([IVX]+)\.\s*$", raw[a:b], re.M))
    for n, h in enumerate(heads):
        s = a + h.end()
        e = a + heads[n + 1].start() if n + 1 < len(heads) else b
        out.append(("cosmo", 1, n + 1, raw, s, e))
    raw2 = html_text(os.path.join(tupdir, "sd2-1-01.htm"))
    a, _ = find(raw2, "I.\n\n1. The Lha")
    _, b = find(raw2, "who taught and instructed it. . . . . .")
    heads = list(re.finditer(r"^([IVX]+)\.\s*$", raw2[a:b], re.M))
    for n, h in enumerate(heads):
        s = a + h.end()
        e = a + heads[n + 1].start() if n + 1 < len(heads) else b
        out.append(("anthro", 2, n + 1, raw2, s, e))
    result = []
    for book, vol, num, raw, s, e in out:
        pid = f"{book}.{num}"
        first, last = page_at(raw, s, PAGE_SD), page_at(raw, e - 1, PAGE_SD)
        text = clean(raw[s:e], "text")
        log(f"{pid} ({pages_label(first, last)})")
        text = collate(pid, text, f"sd{vol}", ocrdir)
        text = apply_fixes(pid, text)
        result.append({"book": book, "volume": vol, "stanza": num, "pages": pages_label(first, last), "text": text})
    return result


def selections(tupdir, ocrdir):
    result = []
    for pid, work, vol, fname, spans in SELECTIONS:
        raw = html_text(os.path.join(tupdir, fname + ".htm"))
        pattern = PAGE_SD if work == "sd" else PAGE_IU
        parts, notes, pages = [], [], []
        for start, end, kind in spans:
            s, _ = find(raw, start)
            _, e = find(raw, end, s)
            pages += [page_at(raw, s, pattern), page_at(raw, e - 1, pattern)]
            (notes if kind == "note" else parts).append(clean(raw[s:e], kind))
        # Spans that break mid-sentence (at a footnote) continue the same paragraph.
        text = ""
        for p in parts:
            if not text:
                text = p
            elif text.endswith("-"):
                text = text[:-1] + p
            elif re.search(r"[A-Za-z,;:—]$", text):
                text += " " + p
            else:
                text += "\n\n" + p
        log(f"{pid} ({pages_label(pages[0], pages[-1])})")
        text = collate(pid, text, f"{work[:2] if work == 'sd' else 'iu'}{vol}", ocrdir)
        if notes:
            notes = [collate(pid + "/note", n, f"{work[:2] if work == 'sd' else 'iu'}{vol}", ocrdir) for n in notes]
            text = "\n\n".join([text] * bool(text) + [f"[Footnote] {n}" for n in notes])
        text = apply_fixes(pid, text)
        first, last = pages[0], pages[-1]
        result.append({"id": pid, "work": work, "volume": vol, "pages": pages_label(first, last), "text": text})
    return result


def main():
    tupdir, ocrdir = sys.argv[1], sys.argv[2]
    st = stanzas(tupdir, ocrdir)
    se = selections(tupdir, ocrdir)
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/blavatsky-dzyan.py from the Theosophical University\n")
    w("// Press online edition of Isis Unveiled (1877) and The Secret Doctrine (1888),\n")
    w("// which keeps the first editions' pages, collated word by word with the\n")
    w("// archive.org OCRs of three or four printed copies of each volume. Do not edit by\n")
    w("// hand: correct the generator (its FIXES list holds every correction made by\n")
    w("// hand) and run it again. Footnotes are left out unless marked [Footnote].\n\n")
    w("export type HpbStanza = {\n  book: \"cosmo\" | \"anthro\";\n  /** The Secret Doctrine's volume: I (Cosmogenesis) or II (Anthropogenesis). */\n  volume: 1 | 2;\n  stanza: number;\n  /** First-edition pages. */\n  pages: string;\n  /** The slokas, numbered as printed, separated by blank lines. */\n  text: string;\n};\n\n")
    w("export type HpbSelection = {\n  id: string;\n  work: \"isis\" | \"sd\";\n  volume: 1 | 2;\n  /** First-edition pages. */\n  pages: string;\n  text: string;\n};\n\n")
    w("export const HPB_STANZAS: HpbStanza[] = [\n")
    for s in st:
        w(f"  {{ book: {json.dumps(s['book'])}, volume: {s['volume']}, stanza: {s['stanza']}, pages: {json.dumps(s['pages'])}, text: {json.dumps(s['text'], ensure_ascii=False)} }},\n")
    w("];\n\nexport const HPB_SELECTIONS: HpbSelection[] = [\n")
    for s in se:
        w(f"  {{ id: {json.dumps(s['id'])}, work: {json.dumps(s['work'])}, volume: {s['volume']}, pages: {json.dumps(s['pages'])}, text: {json.dumps(s['text'], ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
