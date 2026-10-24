"""Two nineteenth-century Atlantis books, for the texts archive (Stage 18):

  scott-elliot  W. Scott-Elliot, The Story of Atlantis (London: Theosophical
                Publishing Society, 1896), the whole book       -> scott-elliot-text.ts
  donnelly      Ignatius Donnelly, Atlantis: The Antediluvian World (New York:
                Harper & Brothers, 1882), a selection            -> donnelly-text.ts

THE METHOD (both books). No proofread transcription of a copy of the first
printing could be reached, so the base is the Project Gutenberg e-text (G), a
proofread transcription of a LATER printing, and it is voted word by word
against the archive.org OCRs of independent copies of the reference printing.
G's words are aligned with each witness (difflib, on letters and figures only,
so case and punctuation are not compared; running heads, page numbers and
chapter headings are taken out of the OCRs first, and words broken at a line
end are joined). Where at least three witnesses agree on a reading other
than G's, and outnumber those agreeing with G (G counting as one), the
majority reading is taken: with G and four witnesses, three is a majority of
all five voices, so two witnesses alone never overrule G. What the vote takes is asserted in EXPECTED_TAKEN, so a change in the
inputs cannot change the text unnoticed; every place where the vote ties or
loses is printed to stderr and was read. REJECT holds the majorities that are
wrong. FIXES holds the corrections made by hand, each checked on the page
images of a copy of the reference printing (the page is named in each entry).
Punctuation is not voted. Wikisource could not be reached (its API refused the
requests as too many, and the site did not resolve from the fetch tool), so no
Wikisource text was used for either book.

The printed pages are taken from the OCR of one copy whose page images were
read (U for Scott-Elliot, K for Donnelly): each of G's words is mapped through
the alignment to the page of that copy it was found on.

HOW THE TEXT IS GIVEN. G's paragraphs; its "--" given as a closed-up dash
(—), as the books set it; its italic marks (_) dropped; small capitals and
italic not marked. Lines of verse quoted inside a paragraph are joined with
" / ". A footnote is printed after its section's text as "[Footnote] ...",
with its reference mark taken out of the running text.

-------------------------------------------------------------------------------
SCOTT-ELLIOT. The Story of Atlantis: A Geographical, Historical, and
Ethnological Sketch, illustrated by four maps of the world's configuration at
different periods, by W. Scott-Elliot, with a preface by A. P. Sinnett.
London: Theosophical Publishing Society, 7, Duke Street, Adelphi, W.C.; The
Theosophical Publishing Society, Benares; "Theosophist" Office, Adyar,
Madras, India. 1896. xi, 71 pp. and four folding maps.

WITNESSES.
  G  Project Gutenberg eBook #21796, The Story of Atlantis and the Lost Lemuria
     (2007), from a later Theosophical Publishing House printing ("The Story of
     Atlantis first printed 1896"). THE BASE: proofread, but not the 1896
     setting. Only its Story of Atlantis is used; The Lost Lemuria (1904) is
     not part of this book.
  U  archive.org's OCR of the University of California (Los Angeles) copy of
     1896 (storyofatlantisg00scot), with its page images: read wherever the
     decision turned on the print. Its leaves 7-15 are the Preface, pp.
     iii-xi; leaves 17-87 are pp. 1-71; its two maps (leaves 92 and 94) are
     Nos. 3 and 4. Maps Nos. 1 and 2 are missing from this copy.
  D  archive.org's OCR of the Digital Library of India copy scanned at Pune
     (in.ernet.dli.2015.204900), dated 1896, Theosophical Publishing Society.
  M  archive.org's OCR of the Digital Library of India (Ministry) copy
     (dli.ministry.23349), whose title page is the 1896 one (7, Duke Street,
     Adelphi); no maps were scanned with it.
  E  archive.org's OCR of the "Second and revised edition" (London:
     Theosophical Publishing Society, 161 New Bond Street, 1909;
     in.ernet.dli.2015.38206). Not the 1896 setting; a witness only.
So three copies of 1896 (U, D, M) can outvote G and E together. Readings
where G and E (the later settings) agree against the three 1896 copies are
the 1896 text's and are taken; they are listed in EXPECTED_TAKEN.

THE MAPS. The book announces "four maps of the world's configuration at
different periods". Their titles as printed (MAPS below) were read on the
UCLA copy (Nos. 3 and 4) and the British Library copy's scans on Wikimedia
Commons (Nos. 3 and 4); Nos. 1 and 2 were not found in any 1896 copy reached,
and their titles are given as G prints them, from its later printing.

THE SECTIONS. The book has no chapters. It opens with Sinnett's Preface, then
announces five classes of corroborative evidence ("First ... Fifth") and,
after a row of stars, six heads ("1. Origin and territorial location of the
different sub-races ... 6. The rise and decline amongst them of religious
ideas"), which it marks with side-headings ("Political Institutions.",
"Emigrations.", "Arts and Sciences.", "Education.", "Manners and Customs.",
"Religion."). The archive divides the book at those places, and divides the
longer heads again at a paragraph where the subject changes (SE_SECTIONS:
each section begins at the paragraph whose opening words are given).

-------------------------------------------------------------------------------
DONNELLY. Atlantis: The Antediluvian World, by Ignatius Donnelly. Illustrated.
New York: Harper & Brothers, Franklin Square. "Entered according to Act of
Congress, in the year 1882, by Harper & Brothers". x, 490 pp.

A SELECTION, by chapter:
  Part I, chapter I     The Purpose of the Book            (the thirteen propositions)
  Part I, chapter II    Plato's History of Atlantis        (the Timaeus and Critias, quoted at length in Jowett's English)
  Part I, chapter III   The Probabilities of Plato's Story
  Part II, chapter I    The Destruction of Atlantis described in the Deluge Legends
                        (it ends by retelling the priest of Sais's 'great deluge of all')
  Part IV, chapter II   The Kings of Atlantis become the Gods of the Greeks
                        (it retells the Critias's Poseidon, Atlas and the ten kings
                        as the Greek gods, and quotes the Critias and the Timaeus)
Chapters I-III of Part I were asked for. The rest of the book was scanned
for direct quotations of the Timaeus or Critias attributed to Plato (a
quotation in quotation marks within a few lines of his name): the chapters
that retell or quote the dialogues' Atlantis story as their subject are taken
(Part II ch. I, Part IV ch. II); the chapters that quote only a phrase or a
sentence of Plato in passing are listed in the corpus file and not imported
(Part I ch. IV; Part II chs. V, VI; Part III chs. II, IV; Part IV ch. V;
Part V chs. II, IX, X).

WITNESSES. No copy of the very first printing was reached; the copies reached
are of the 1882 setting, which Harper reprinted as numbered "editions".
  G  Project Gutenberg eBook #4032 (2003, updated 2026), "produced by Norm
     Walcott, source from Mr. J.B. Hare". THE BASE. Its printing is not
     stated. (Project Gutenberg #3607, sometimes cited for this book, is Sir
     Samuel Baker's Ismailia.)
  K  archive.org's OCR of the Duke University copy (atlantisantedil00donn),
     "Eleventh Edition", with its page images (also on Wikimedia Commons as
     "Atlantis - The Antediluvian World (1882).djvu"): read wherever the
     decision turned on the print. Its pages are taken from archive.org's
     page-number list for the scan.
  U  archive.org's OCR of the Internet Archive's copy atlantisantedilu0000unse,
     "Eleventh Edition".
  A  archive.org's OCR of Google's scan of a copy (Atlantis1882), "Eleventh
     Edition".
  S  archive.org's OCR of the copy atlantisantedilu0000igna_s0m2,
     "Twenty-fourth Edition", New York and London, 1904: the same plates.
The University of Toronto copy (atlantisantedilu00donnuoft) could not be read:
archive.org returned an error for its text every time.

Usage:
  python3 -I scripts/texts/atlantis-authors.py scott-elliot DIR > src/lib/timeline/texts/corpus/scott-elliot-text.ts
  python3 -I scripts/texts/atlantis-authors.py donnelly DIR > src/lib/timeline/texts/corpus/donnelly-text.ts
where DIR holds, for scott-elliot: pg21796.txt, storyofatlantisg00scot_djvu.xml,
se_dli204900.txt (D), se_min.txt (M), se_1909.txt (E); for donnelly: pg4032.txt,
atlantisantedil00donn_djvu.xml, atlantisantedil00donn_page_numbers.json,
atlantisantedilu0000unse_djvu.txt (U), Atlantis1882_djvu.txt (A),
atlantisantedilu0000igna_s0m2_djvu.txt (S).
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


ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]


def roman_lower(n):
    return {3: "iii", 4: "iv", 5: "v", 6: "vi", 7: "vii", 8: "viii", 9: "ix", 10: "x", 11: "xi"}[n]


# ---------------------------------------------------------------------------
# G: the Gutenberg text, as paragraphs
# ---------------------------------------------------------------------------


def g_paragraphs(lines):
    """Paragraphs of G between two line indexes: lists of lines, with verse
    (indented lines) joined into the paragraph it belongs to."""
    paras, cur = [], []
    for line in lines:
        if not line.strip():
            if cur:
                paras.append(cur)
                cur = []
            continue
        cur.append(line)
    if cur:
        paras.append(cur)
    out = []
    for p in paras:
        verse = all(l.startswith("    ") for l in p)
        text = (" / " if verse else " ").join(l.strip() for l in p)
        out.append({"text": text, "verse": verse})
    return out


def clean_g(text):
    text = text.replace("_", "")
    text = re.sub(r"\s*--\s*", "—", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ---------------------------------------------------------------------------
# The witnesses
# ---------------------------------------------------------------------------

NUMBER = re.compile(r"\W*[\dIVXLivxl]{1,4}\W*")


def head_matcher(heads):
    hk = [key(h) for h in heads]

    def is_head(line):
        toks = line.split()
        if not toks or len(toks) > 12:
            return False
        words = "".join(key(t) for t in toks if not re.fullmatch(r"\W*\d{1,3}\W*", t))
        if not words:
            return True  # a page number alone
        if len(words) < 4:
            return False
        return max(difflib.SequenceMatcher(None, words, h).ratio() for h in hk) >= 0.8

    return is_head


def tokens_from_lines(pages, is_head):
    """pages: [(page label, [line, ...])]. Running heads and page numbers out,
    words broken at a line end joined. Returns [(token, page)]."""
    out = []
    for label, lines in pages:
        kept = []
        for n, line in enumerate(lines):
            if (n < 3 or n >= len(lines) - 2) and is_head(line):
                continue
            kept.append(line)
        text = "\n".join(kept)
        text = re.sub(r"(\w)[-¬][ \t]*\n\s*(\w)", r"\1\2", text)
        text = text.replace("--", " ").replace("—", " ").replace("–", " ")
        for t in text.split():
            if key(t):
                out.append((t, label))
    # a word broken across a page: joined when the halves end and begin so
    for i in range(len(out) - 1):
        a, b = out[i][0], out[i + 1][0]
        if a.endswith("-") and b[:1].islower() and out[i][1] != out[i + 1][1]:
            out[i] = (a[:-1] + b, out[i][1])
            out[i + 1] = ("", out[i + 1][1])
    return [t for t in out if key(t[0])]


def txt_pages(path):
    """A djvu.txt as one 'page' (its page breaks are not reliable)."""
    raw = open(path, encoding="utf-8", errors="replace").read()
    chunks = re.split(r"\n\s*\n\s*\n+", raw)
    return [(None, c.split("\n")) for c in chunks]


def xml_pages(path, labels):
    """A djvu.xml: one page per OBJECT, lines of words, labelled by leaf."""
    raw = open(path, encoding="utf-8", errors="replace").read()
    pages = []
    for leaf, obj in enumerate(re.findall(r"<OBJECT.*?</OBJECT>", raw, re.S), start=1):
        lines = []
        for line in re.findall(r"<LINE>(.*?)</LINE>", obj, re.S):
            words = [html.unescape(w).strip() for w in re.findall(r"<WORD[^>]*>(.*?)</WORD>", line, re.S)]
            lines.append(" ".join(w for w in words if w))
        pages.append((labels(leaf), lines))
    return pages


def align(g_keys, toks, name):
    """Where the witness differs from G: events [(i1, i2, witness text)];
    for each G word, whether it is covered without difference, and the
    witness's page for it."""
    sk = [key(t) for t, _ in toks]
    sm = difflib.SequenceMatcher(None, g_keys, sk, autojunk=False)
    events, covered, pages, agree = [], [False] * len(g_keys), [None] * len(g_keys), 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or (i2 > i1 and "".join(g_keys[i1:i2]) == "".join(sk[j1:j2])):
            if tag == "equal":
                agree += i2 - i1
                for d in range(i2 - i1):
                    pages[i1 + d] = toks[j1 + d][1]
            for i in range(i1, i2):
                covered[i] = True
            continue
        if tag == "replace" and i2 - i1 == j2 - j1:
            for d in range(i2 - i1):
                pages[i1 + d] = toks[j1 + d][1]
                if g_keys[i1 + d] == sk[j1 + d]:
                    covered[i1 + d] = True
                else:
                    events.append((i1 + d, i1 + d + 1, toks[j1 + d][0]))
            continue
        events.append((i1, i2, " ".join(t for t, _ in toks[j1:j2])))
    log(f"  {name}: {agree / max(1, len(g_keys)):.3f} of G's words matched in order; {len(events)} places differ")
    return events, covered, pages


def window(toks, first_keys, last_keys, length):
    """The part of a witness from a unit's first words to its last."""
    sk = [key(t) for t, _ in toks]

    G = 6  # words in a matching run: four proved too few to place a unit

    # the start: of the places where one of the unit's first runs stands, the
    # one followed by most of the unit's first words (a phrase such as "the
    # City of the Golden Gates" recurs, so the first place found is not enough)
    head = set(first_keys)
    a, best = None, -1
    for n in range(0, 38):
        gram = first_keys[n:n + G]
        if len(gram) < G:
            break
        for i in range(len(sk) - G + 1):
            if sk[i:i + G] == gram:
                score = sum(1 for k in sk[i - n:i - n + len(first_keys)] if k in head)
                if score > best:
                    a, best = i - n, score
    assert a is not None, ("unit not found in witness", first_keys[:6])
    a = max(0, a)
    # the end: of the places where one of the unit's last runs stands after
    # the start, the one nearest to where the unit's length puts its end
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
        b = a + length  # the end not found (a revised passage): the unit's length from its start
    return toks[max(0, a - 30): b + 30]


def vote(units, witnesses, page_witness, expected, reject, label):
    """units: [{'id', 'paras': [[ [text, glued], ...], ...]}]. Applies the
    majority readings in place; returns {unit id: (first page, last page)}."""
    flat = []
    for u, unit in enumerate(units):
        for p, items in enumerate(unit["paras"]):
            for n, it in enumerate(items):
                if key(it[0]):
                    flat.append((u, p, n))
    word = lambda i: units[flat[i][0]]["paras"][flat[i][1]][flat[i][2]][0]
    g_keys = [key(word(i)) for i in range(len(flat))]
    starts = {}
    for i, (u, _, _) in enumerate(flat):
        starts.setdefault(u, [i, i])[1] = i
    log(f"G: {len(flat)} words in {len(units)} units ({label})")

    by_event = defaultdict(dict)
    covered = {}
    page_of = [None] * len(flat)
    for sig, toks in witnesses:
        cov_all = [False] * len(flat)
        for u, (a, b) in sorted(starts.items()):
            sub = window(toks, g_keys[a:a + 44], g_keys[max(a, b - 43):b + 1], b + 1 - a)
            events, cov, pages = align(g_keys[a:b + 1], sub, f"{sig} {units[u]['id']}")
            for i1, i2, text in events:
                if i1 == i2 and i1 in (0, b + 1 - a):
                    continue  # the margin of the window: the neighbouring unit's words
                by_event[(a + i1, a + i2, key(text))][sig] = text
            for i, c in enumerate(cov):
                cov_all[a + i] = c
            if sig == page_witness:
                for i, pg in enumerate(pages):
                    page_of[a + i] = pg
        covered[sig] = cov_all

    accepted, rejected = [], Counter()
    for (i1, i2, k), wits in sorted(by_event.items()):
        span = range(i1, max(i2, i1 + 1))
        for_g = [s for s in covered if s not in wits and all(covered[s][i] for i in span if i < len(flat))]
        ours = " ".join(word(i) for i in range(i1, i2))
        ctx = " ".join(word(i) for i in range(max(0, i1 - 4), i1)) + " [" + ours + "] " + " ".join(word(i) for i in range(i2, min(len(flat), i2 + 3)))
        surface = Counter(re.sub(r"[\^*]", "", t) for t in wits.values()).most_common(1)[0][0]
        tally = f"{len(wits)}:{1 + len(for_g)} {''.join(sorted(wits))}"
        if len(wits) > 1 + len(for_g) and len(wits) >= 3:
            if (key(ours), k) in reject:
                rejected[(key(ours), k)] += 1
                log(f"  rejected {tally}: {ctx!r} -> {surface!r}")
                continue
            accepted.append((i1, i2, surface))
            log(f"  TAKEN {tally}: {ctx!r} -> {surface!r}")
        elif len(wits) >= 2:
            log(f"  not taken {tally} (G with {''.join(for_g)}): {ctx!r} -> {surface!r}")
    for pair in reject:
        assert rejected[pair] >= 1, ("REJECT entry not met", pair)
    if os.environ.get("SHOW_TAKEN"):
        for i1, i2, surface in accepted:
            print(f"    ({json.dumps(' '.join(word(i) for i in range(i1, i2)))}, {json.dumps(surface)}),", file=sys.stderr)
    assert len(accepted) == len(expected), ("EXPECTED_TAKEN differs", len(accepted), len(expected))
    for (i1, i2, surface), (ours, theirs) in zip(accepted, expected):
        assert key(" ".join(word(i) for i in range(i1, i2))) == key(ours) and key(surface) == key(theirs), (ours, theirs)

    for i1, i2, surface in sorted(accepted, reverse=True):
        new = surface.split()
        u, p, n = flat[i1]
        items = units[u]["paras"][p]
        if i2 > i1:
            last = flat[i2 - 1][2]
            assert flat[i2 - 1][:2] == (u, p), "a reading taken across paragraphs"
            if len(new) == 1 and i2 - i1 == 1:
                old = items[n][0]
                m = re.match(r"^(\W*)(.*?)(\W*)$", old)
                core = re.match(r"^\W*(.*?)\W*$", new[0]).group(1).replace("\u2019", "'")
                items[n][0] = m.group(1) + core + m.group(3)
            else:
                glued = items[n][1]
                items[n:last + 1] = [[w, glued if j == 0 else False] for j, w in enumerate(new)]
        else:
            items[n:n] = [[w, False] for w in new]

    pages = {}
    for u, (a, b) in starts.items():
        known = [page_of[i] for i in range(a, b + 1) if page_of[i] is not None]
        pages[units[u]["id"]] = (known[0], known[-1])
    return pages


def para_items(text):
    items = []
    for w in text.split(" "):
        if not w:
            continue
        for n, part in enumerate(p for p in re.split(r"(?<=—)", w) if p):
            items.append([part, n > 0])
    return items


def join_items(items):
    buf = ""
    for text, glued in items:
        buf += text if (glued or not buf) else " " + text
    return buf


def apply_fixes(texts, fixes):
    applied = Counter()
    for uid in texts:
        for n, (unit, old, new, _count, _why) in enumerate(fixes):
            if unit in (uid, "*") and old in texts[uid]:
                applied[n] += texts[uid].count(old)
                texts[uid] = texts[uid].replace(old, new)
                log(f"  fix {uid}: {old[:60]!r} -> {new[:60]!r}")
    for n, (unit, old, _new, count, _why) in enumerate(fixes):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", unit, old[:50], applied[n])


# ---------------------------------------------------------------------------
# SCOTT-ELLIOT
# ---------------------------------------------------------------------------

# (id, the book's side-heading or None, opening words of the section's first paragraph)
SE_SECTIONS = [
    ("preface", None, "For readers unacquainted with the progress"),
    ("1", None, "The general scope of the subject before us"),
    ("2", "First", "In the first place, then, the testimony of the deep-sea soundings"),
    ("3", "Second", "Second.—The proved existence on continents"),
    ("4", "Third", "Third.—From the fauna and flora we now turn to man."),
    ("5", "Fourth", "Fourth.—Nothing seems to have surprised"),
    ("6", "Fifth", "Fifth.—It only remains now to summarize"),
    ("7", None, "But enough space has now been devoted"),
    ("8", None, "Some reference to the very mystical subject of the Manus"),
    ("9", "Political Institutions", "Political Institutions.—In such a summary"),
    ("10", None, "Having dealt at some length with the state of things under the Toltecs"),
    ("11", "Emigrations", "Emigrations.—Three causes contributed"),
    ("12", None, "Egypt must now be referred to"),
    ("13", None, "The Turanians who in the first map period"),
    ("14", "Arts and Sciences", "Arts and Sciences.—It must primarily be recognized"),
    ("15", "Education", "Education.—A few words on the subject of language"),
    ("16", None, "In such an empire as the Toltec, agriculture"),
    ("17", None, "The \"City of the Golden Gates\" and its surroundings must be described"),
    ("18", None, "If the system of water supply in the \"City of the Golden Gates\" was"),
    ("19", "Manners and Customs", "Manners and Customs.—There was doubtless"),
    ("20", None, "But the system of land tenure is the most important subject"),
    ("21", "Religion", "Religion.—The only subject that now remains"),
    ("22", None, "It must be remembered that every true religious idea"),
    ("23", None, "In conclusion, it would be vain to attempt to summarize"),
]

SE_FOOTNOTE = (
    "Students of geology and palæontology will know that these sciences regard the \"Cro-Magnon man\" as prior to the "
    "\"Furfooz,\" and seeing that the two races ran alongside each other for vast periods of time, it may quite well be that "
    "the individual \"Cro-Magnon\" skeleton, though representative of the second race, was deposited in the quaternary strata "
    "thousands of years before the individual Furfooz man lived on the earth."
)

# The maps, as their titles are printed on them.
SE_MAPS = [
    (1, "The World about 1,000,000 years ago, during many previous ages, and up to the catastrophe of about 800,000 years ago", "Atlantis at its Prime",
     "Not found in any 1896 copy reached (the UCLA and Ministry scans lack it); the title as Project Gutenberg's later printing gives it."),
    (2, "The World after the catastrophe of 800,000 years ago and up to the catastrophe of about 200,000 years ago", "Atlantis in its Decadence",
     "Not found in any 1896 copy reached; the title as Project Gutenberg's later printing gives it."),
    (3, "The World after the catastrophe of 200,000 years ago and up to the catastrophe of about 80,000 years ago", "Ruta & Daitya",
     "Read on the UCLA copy (leaf 92) and on the British Library copy's scan on Wikimedia Commons."),
    (4, "The World after the catastrophe of 80,000 years ago and up to the final submergence of Poseidonis in 9,564 B.C.", "Poseidonis",
     "Read on the UCLA copy (leaf 94) and on the British Library copy's scan on Wikimedia Commons."),
]

SE_HEADS = ["The Story of Atlantis", "Preface", "Story of Atlantis", "The Story of Atlantis Preface"]

# Majority readings that are wrong: (G's word, the witnesses' reading) as keys.
SE_REJECT = [
    ("11th", "nth"),  # OCR of "11" (D, E, U); U leaf 32, p. 16, reads "11th"
    ("1", "i"),  # OCR of the figure 1 (Map No. 1)
    ("1st", "ist"),  # OCR of the figure 1
]

# Corrections by hand: (section, old, new, expected count, why).
SE_FIXES = [
    # G divides or joins words that the vote, which compares letters only,
    # cannot see; both were read on the UCLA page images.
    ("preface", "with which he him self is", "with which he himself is", 1, "U leaf 11, p. vii: 'with which he himself is in'"),
    ("14", "The window-spaces were-filled", "The window-spaces were filled", 1, "U leaf 59, p. 43: 'The window-spaces were filled'"),
]
# Misprints of 1896 kept as printed, in all three 1896 copies: "goverment"
# (p. 61, taken by the vote), "an Intitiate emperor" (p. 31), "the various
# savages races" and "while other travelled west" (p. 8).

SE_EXPECTED_TAKEN = [
    # all three 1896 copies, and the 1909 edition, against G (U leaf 17, p. 1)
    ("colonial", "colonized"),
    # the 1896 misprint, in all three 1896 copies (U leaf 77, p. 61 reads
    # "goverment."); the 1909 edition and G correct it. Kept as printed.
    ("government.", "goverment."),
]


def se_labels(leaf):
    if 7 <= leaf <= 15:
        return roman_lower(leaf - 4)
    if 17 <= leaf <= 87:
        return str(leaf - 16)
    return None


def scott_elliot(d):
    g = open(os.path.join(d, "pg21796.txt"), encoding="utf-8-sig").read().split("\n")
    a = g.index("PREFACE.")
    b = next(i for i in range(a, len(g)) if g[i].strip() == "FOOTNOTES:")
    paras = []
    for p in g_paragraphs(g[a + 1:b]):
        t = clean_g(p["text"])
        if t in ("The Story of Atlantis", "A Geographical, Historical and Ethnological Sketch.") or set(t) <= set("* "):
            continue
        if t == "A. P. SINNETT.":
            t = "A. P. Sinnett."
        paras.append(t)
    # the sections
    units, cur = [], None
    starts = {opening: (sid, head) for sid, head, opening in SE_SECTIONS}
    for t in paras:
        hit = next((o for o in starts if t.startswith(o)), None)
        if hit:
            sid, head = starts.pop(hit)
            cur = {"id": sid, "heading": head, "paras": []}
            units.append(cur)
        assert cur is not None, t[:40]
        if "[1]" in t:
            t = t.replace("[1]", "")
            cur["footnote"] = SE_FOOTNOTE
        cur["paras"].append(para_items(t))
    assert not starts, ("sections not found", list(starts))
    is_head = head_matcher(SE_HEADS)
    wit = []
    wit.append(("U", tokens_from_lines(xml_pages(os.path.join(d, "storyofatlantisg00scot_djvu.xml"), se_labels), is_head)))
    for sig, f in [("D", "se_dli204900.txt"), ("M", "se_min.txt"), ("E", "se_1909.txt")]:
        wit.append((sig, tokens_from_lines(txt_pages(os.path.join(d, f)), is_head)))
    pages = vote(units, wit, "U", SE_EXPECTED_TAKEN, SE_REJECT, "Scott-Elliot")
    texts = {}
    for u in units:
        texts[u["id"]] = "\n\n".join(join_items(items) for items in u["paras"])
    apply_fixes(texts, SE_FIXES)
    out = []
    for u in units:
        text = texts[u["id"]]
        if u.get("footnote"):
            text += "\n\n[Footnote] " + u["footnote"]
        first, last = pages[u["id"]]
        out.append({"id": u["id"], "heading": u["heading"], "firstPage": first, "lastPage": last, "text": text})
        log(f"section {u['id']}: pp. {first}–{last}, {len(u['paras'])} paragraphs")
    for x in out:
        assert "  " not in x["text"] and "_" not in x["text"] and "--" not in x["text"], x["id"]
    write_se(out)


def write_se(sections):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/atlantis-authors.py (scott-elliot) from Project\n")
    w("// Gutenberg #21796, a later printing of The Story of Atlantis, voted word by word\n")
    w("// against the archive.org OCRs of three copies of the 1896 first edition and of\n")
    w("// the revised edition of 1909. Do not edit by hand: correct the generator (its\n")
    w("// SE_FIXES list holds every correction made by hand) and run it again.\n\n")
    w("export type ScottElliotSection = {\n  /** 'preface', or the archive's section number, '1' to '23'. */\n  id: string;\n")
    w("  /** The book's own side-heading where the section begins at one ('Political Institutions'), else null. */\n  heading: string | null;\n")
    w("  /** The printed pages of the 1896 edition (the Preface in roman numerals). */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** Paragraphs separated by blank lines; a footnote after them as \"[Footnote] ...\". */\n  text: string;\n};\n\n")
    w("/** One of the book's four maps: its number, its title and its name, as printed on it. */\n")
    w("export type ScottElliotMap = { number: number; title: string; name: string; seen: string };\n\n")
    w("export const SCOTT_ELLIOT_SECTIONS: ScottElliotSection[] = [\n")
    for x in sections:
        w(f"  {{ id: {json.dumps(x['id'])}, heading: {json.dumps(x['heading'])}, firstPage: {json.dumps(x['firstPage'])}, lastPage: {json.dumps(x['lastPage'])}, text: {json.dumps(x['text'], ensure_ascii=False)} }},\n")
    w("];\n\nexport const SCOTT_ELLIOT_MAPS: ScottElliotMap[] = [\n")
    for n, title, name, seen in SE_MAPS:
        w(f"  {{ number: {n}, title: {json.dumps(title)}, name: {json.dumps(name)}, seen: {json.dumps(seen)} }},\n")
    w("];\n")


# ---------------------------------------------------------------------------
# DONNELLY
# ---------------------------------------------------------------------------

# (id, part, chapter, title as printed, G's line of the chapter heading)
DON_CHAPTERS = [
    ("1.1", "I", "I", "The Purpose of the Book"),
    ("1.2", "I", "II", "Plato's History of Atlantis"),
    ("1.3", "I", "III", "The Probabilities of Plato's Story"),
    ("2.1", "II", "I", "The Destruction of Atlantis described in the Deluge Legends"),
    ("4.2", "IV", "II", "The Kings of Atlantis become the Gods of the Greeks"),
]

DON_HEADS = [
    "Atlantis: The Antediluvian World", "The Purpose of the Book", "Plato's History of Atlantis",
    "The Probabilities of Plato's Story", "Was such a Catastrophe Possible", "The Destruction of Atlantis described in the Deluge Legends",
    "The Deluge of the Bible", "The Kings of Atlantis become the Gods of the Greeks", "Traditions of Atlantis",
    "The Gods of the Phoenicians also Kings of Atlantis", "The Antediluvian World",
    "The Destruction of Atlantis", "The Deluge Legends",
]

# Illustration captions G sets inside the text, which are not part of it.
DON_CAPTIONS = ["THE EMPIRE OF ATLANTIS.", "POSEIDON, OR NEPTUNE."]

DON_REJECT = []

# G sets Oppert's two tables (Part I ch. III) as ASCII boxes; they are given
# here from the print, K p. 29 (the sum) and p. 30 (the two cycles), as lines
# joined with " / ". G's "1,822" in the second is a misprint for the "1,322"
# printed (the year 1322 B.C. of the text above it).
DON_TABLE_MARKS = ["†‡", "‡†"]

DON_FIXES = [
    ("1.3", "†‡", "12 × 1460 = 17,520 / 12 × 1805 = 21,660 / [together] = 39,180.", 1,
     "K p. 29: the two products printed one above the other, braced, '= 39,180.'"),
    ("1.3", "‡†",
     "Zodiacal Cycle. — Lunar Cycle. / 1,460 — 1,805 / 1,322 — 712 / [rule] / 2,782 — 2,517 / 4,242 — 4,322 / "
     "5,702 — 6,127 / 7,162 — 7,932 / 8,622 — 9,737 / 10,082 — 11,542 / 11,542", 1,
     "K p. 30: two columns joined by leader dots, a rule under the second row; G's '1,822' is '1,322' in the print"),
    ("1.2", "gave judgement,", "gave judgment,", 1,
     "K p. 20 reads 'gave judg-ment' (all four copies read 'judgment', two of them misread by the OCR)"),
    # Punctuation and capitals are not voted; these were seen on the page images.
    ("1.1", "our fundamental ideas-the men", "our fundamental ideas—the men", 1, "K p. 3 prints a dash, 'ideas—the men'"),
    ("1.2", "fable, or Poem ever had", "fable, or poem ever had", 1, "K p. 5: 'story, fable, or poem ever had'"),
    ("2.1", "that Population the ancestors", "that population the ancestors", 1, "K p. 65: 'that population the ancestors'"),
    ("2.1", "the Rev. R. p. Bellynck", "the Rev. R. P. Bellynck", 1, "K p. 67: 'the Rev. R. P. Bellynck, S.J.'"),
]

DON_EXPECTED_TAKEN = [
    # all four copies against G (G's slips of transcription)
    ("bearing", "hearing"),  # Timaeus 22a, Jowett
    ("617,", "517,"),  # Donnelly's reference to Jowett's Dialogues, vol. ii
    ("bear", "hear"),  # Critias 113a, Jowett, twice
    ("bear", "hear"),
    # Critias 116c, Jowett: G has moved "the royal palace; and then" a line down
    ("", "the royal palace; and then"),
    ("the royal palace; and then", ""),
    ("Poiseidon's", "Poseidon's"),
    ("other", "others"),  # three copies; S, the 1904 printing, misread by its OCR
    ("Idea,", "Hea,"),  # K p. 283 reads "Hea, Anu, and Bel"
    ("\"Mannal", "Manual"),
    ("failing", "falling"),
    ("slip,", "ship,"),
]


def don_labels_factory(d):
    pn = json.load(open(os.path.join(d, "atlantisantedil00donn_page_numbers.json")))["pages"]
    known = {p["leafNum"]: int(p["pageNumber"]) for p in pn if re.fullmatch(r"\d+", p["pageNumber"] or "")}

    def label(leaf):
        if leaf in known:
            return str(known[leaf])
        before = [l for l in known if l < leaf]
        after = [l for l in known if l > leaf]
        if before and after:
            lb, la = max(before), min(after)
            if known[la] - known[lb] == la - lb:
                return str(known[lb] + leaf - lb)
        if after and not before or after and leaf < min(known):
            # pp. 1-2 carry no number in the list (leaves 19-20): counted back
            la = min(after)
            n = known[la] - (la - leaf)
            return str(n) if n >= 1 else None
        return None

    return label


def donnelly(d):
    g = open(os.path.join(d, "pg4032.txt"), encoding="utf-8-sig").read().split("\n")
    units = []
    for cid, part, ch, title in DON_CHAPTERS:
        # find "PART <part>" ... "CHAPTER <ch>" after the Contents
        p0 = next(i for i in range(150, len(g)) if re.match(rf"^PART {part}\b\.?", g[i]))
        c0 = next(i for i in range(p0, len(g)) if re.match(rf"^CHAPTER {ch}\b\.?", g[i]))
        c1 = next(i for i in range(c0 + 1, len(g)) if re.match(r"^(CHAPTER [IVX]+|PART [IVX]+)\b", g[i]))
        body = g[c0 + 1:c1]
        paras = []
        for p in g_paragraphs(body):
            t = clean_g(p["text"])
            if key(t) == key(title) or key(t) == key(f"CHAPTER {ch} {title}") or key(t).startswith(key(title)) and len(t) < len(title) + 5:
                continue
            if t in DON_CAPTIONS or t.startswith("TRADITIONS OF ATLANTIS"):
                continue
            if t.startswith("+"):
                # one of G's two ASCII tables (Part I ch. III): a placeholder,
                # left out of the vote, for the table as DON_FIXES gives it
                t = DON_TABLE_MARKS[sum(1 for q in paras if q in DON_TABLE_MARKS)]
            paras.append(t)
        units.append({"id": cid, "part": part, "chapter": ch, "title": title, "paras": paras})
    # a caption set inside a paragraph splits it in two: join the halves
    for u in units:
        joined = []
        for t in u["paras"]:
            if joined and re.search(r"[a-z,;]$", joined[-1]) and t[:1].islower():
                joined[-1] += " " + t
            else:
                joined.append(t)
        u["paras"] = [para_items(t) for t in joined]
    is_head = head_matcher(DON_HEADS)
    labels = don_labels_factory(d)
    wit = [("K", tokens_from_lines(xml_pages(os.path.join(d, "atlantisantedil00donn_djvu.xml"), labels), is_head))]
    for sig, f in [("U", "atlantisantedilu0000unse_djvu.txt"), ("A", "Atlantis1882_djvu.txt"), ("S", "atlantisantedilu0000igna_s0m2_djvu.txt")]:
        wit.append((sig, tokens_from_lines(txt_pages(os.path.join(d, f)), is_head)))
    pages = vote(units, wit, "K", DON_EXPECTED_TAKEN, DON_REJECT, "Donnelly")
    texts = {u["id"]: "\n\n".join(join_items(items) for items in u["paras"]) for u in units}
    apply_fixes(texts, DON_FIXES)
    out = []
    for u in units:
        first, last = pages[u["id"]]
        out.append({"id": u["id"], "part": u["part"], "chapter": u["chapter"], "title": u["title"], "firstPage": int(first), "lastPage": int(last), "text": texts[u["id"]]})
        log(f"chapter {u['id']}: pp. {first}–{last}, {len(u['paras'])} paragraphs")
    for x in out:
        assert "  " not in x["text"] and "_" not in x["text"] and "--" not in x["text"] and "+-" not in x["text"], x["id"]
    write_don(out)


def write_don(chapters):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/atlantis-authors.py (donnelly) from Project Gutenberg\n")
    w("// #4032, voted word by word against the archive.org OCRs of four printed copies of\n")
    w("// the 1882 setting of Atlantis: The Antediluvian World. A selection of five\n")
    w("// chapters. Do not edit by hand: correct the generator (its DON_FIXES list holds\n")
    w("// every correction made by hand) and run it again.\n\n")
    w("export type DonnellyChapter = {\n  /** '<part>.<chapter>', as '1.2' for Part I, chapter II. */\n  id: string;\n")
    w("  /** The part and chapter as Roman numerals. */\n  part: string;\n  chapter: string;\n  /** The heading as the chapter prints it, in ordinary capitals. */\n  title: string;\n")
    w("  /** The printed pages of the 1882 setting the chapter runs over. */\n  firstPage: number;\n  lastPage: number;\n  /** Paragraphs separated by blank lines. */\n  text: string;\n};\n\n")
    w("export const DONNELLY_CHAPTERS: DonnellyChapter[] = [\n")
    for x in chapters:
        w(f"  {{ id: {json.dumps(x['id'])}, part: {json.dumps(x['part'])}, chapter: {json.dumps(x['chapter'])}, title: {json.dumps(x['title'])}, firstPage: {x['firstPage']}, lastPage: {x['lastPage']}, text: {json.dumps(x['text'], ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    {"scott-elliot": scott_elliot, "donnelly": donnelly}[sys.argv[1]](sys.argv[2])
