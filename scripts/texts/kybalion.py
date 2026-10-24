"""The Kybalion: A Study of the Hermetic Philosophy of Ancient Egypt and Greece,
by "Three Initiates" (Chicago: The Yogi Publication Society, 1908) -> kybalion-text.ts.

THE BOOK. The Kybalion: A Study of the Hermetic Philosophy of Ancient Egypt and
Greece, by Three Initiates. "The Lips of Wisdom are closed, except to the Ears
of Understanding." Chicago, Ill.: The Yogi Publication Society, Masonic
Temple. Verso: "Copyright 1908 by The Yogi Publication Society. Entered at
Stationer's Hall. All rights reserved." Dedicated "To Hermes Trismegistus,
known by the ancient Egyptians as 'The Great Great' and 'Master of Masters'".
223 pages: an Introduction (pp. 7-14) and fifteen chapters, as the book's
Contents lists them (I Hermetic Philosophy, 15; II Seven Hermetic Principles,
25; III Mental Transmutation, 43; IV The All, 53; V The Mental Universe, 65;
VI The Divine Paradox, 77; VII "The All" in All, 95; VIII Planes of
Correspondence, 113; IX Vibration, 137; X Polarity, 149; XI Rhythm, 159;
XII Causation, 171; XIII Gender, 183; XIV Mental Gender, 193; XV Hermetic
Axioms, 212). Chapter XV in fact begins on p. 213, a recto after a blank page
(seen on the BYU copy). The whole book is imported, and nothing is left out
but the chapter headings (which the archive gives as labels) and the title
page, dedication and Contents (described in the corpus file).

WITNESSES. All four 1908 copies below have the same title page and the
"Copyright 1908" verso.
  W  Wikisource, "The Kybalion" (en.wikisource.org/wiki/The_Kybalion/
     Introduction ... /Chapter_15), a proofread transcription of the scan of
     the Brigham Young University copy (Index: Kybalion - a study of the
     hermetic philosophy of ancient Egypt and Greece (1908).djvu, from
     archive.org kybalionstudyofh00init), read as saved in October 2026, with
     its page numbers. THE BASE: it is the only transcription of a 1908 copy
     that has been read by a person, and it gives the pages.
  B  archive.org's OCR of that same BYU copy (kybalionstudyofh00init_djvu.txt).
     Not an independent copy of the book, but an independent reading of it.
  T  archive.org's OCR of the Internet Archive's own 1908 copy, scanned at
     Shenzhen (kybalionstudyofh00thre).
  C  archive.org's OCR of the Claremont School of Theology's 1908 copy
     (kybalionstudyofh0000thre).
  K  archive.org's OCR of Google's scan of the Stanford copy
     (kybalionastudyh00unkngoog).
  G  Project Gutenberg eBook #14209 (2004, updated 2024), an independent
     e-text of a later printing ("Copyright 1912", with a modern ISBN), whose
     setting differs from 1908's in small ways (below).

THE VOTE. W's words are aligned with each witness (difflib, on letters and
figures only, so case and punctuation are not compared; the OCRs' running heads,
page numbers and chapter headings are taken out first, and words broken at a
line end are joined). Where witnesses agree on a reading other than W's, it is
taken if more witnesses read it than read W's (W counting as one): the majority
reading. It changed seven places, each asserted in EXPECTED_TAKEN and each one
of W's misreadings: "Kyhalion" twice, "EXILE" (the page has "RULE"),
"Kelative", "conscionsness", '"refusings"' (the page has "refusing"), and a
"to" W leaves out ("and on, and on, to higher and still higher"). REJECT holds
the one majority that is wrong (three OCRs read the "O," of '"O, let not the
flame die out!"' as a zero). Every place where the vote was tied or lost, or
where G alone differs, is printed to stderr and was read.

  - Words W splits in two at a page break ("let ting") or at a line-end
    hyphen it left in ("be- tween") are joined where G has the whole word (35
    places, each printed); all other page breaks were looked at and left.
  - FIXES holds the corrections by hand: three more "Kyhalion" (W, and two of
    the OCRs, read the italic b of "The Kybalion" as h, so the vote ties; the
    page image of p. 26 shows the b), "Eeality" (the vote ties for the same
    reason), "comers" (the page image of p. 90 has "corners"), a misplaced
    comma on p. 36 (the page has a low point and no space, "exist.in"), and
    four of W's quotation marks: punctuation is not voted, so every paragraph
    with an odd number of quotation marks was compared by hand with the other
    witnesses, and the four marks where the other 1908 copies all read otherwise are
    corrected (one of them closes the saying "But, the report of Reason must
    be hospitably received, and treated with respect.", making 39 sayings).
  - The misprints of the 1908 setting are kept, because all four 1908 copies
    have them; G, from the 1912 resetting, corrects most: "understading",
    "Princible", "phenomennon", "resistence", "Appollo", "They they", "steam
    of Vibratory Energy", "If the Universal is Mental", "no such things as
    Chance". G's other differences are the resetting's, not 1908's, and are
    not taken: Arabic numerals for the Roman in lists, "scepter" and
    "centers" for "sceptre" and "centres", and a few changed words ("printed
    herein, in italics" for 1908's "in quotation marks", "biggest" for
    "highest", "whenever" for "wherever"); 76 places in all, each printed.
  - The page images were read wherever the decision turned on the print
    (pp. 26, 27, 36, 39, 90, 213, 218 of the BYU copy). The text has not been
    proofread page by page against an image.

HOW THE TEXT IS GIVEN. W's paragraphs and punctuation, with its straight
quotation marks; dashes closed up as the book sets them (W spaces a few);
small capitals and italic not marked; W's "æ" kept. The book's lists (the
Seven Principles, the planes) are one paragraph to an item. The book repeats
the heading "VII. THE PRINCIPLE OF GENDER." on p. 39, before and after the
saying; both are kept, as printed. The Introduction's signature ("The Three
Initiates.") and the closing "Finis" are kept.

THE SAYINGS. Every passage the book prints as a quotation ending '—The
Kybalion.' is listed in KYBALION_SAYINGS with its chapter and page. They are
the book's "Hermetic axioms": the archive records that no ancient source for
them is known.

Usage:
  python3 -I scripts/texts/kybalion.py WS_DIR pg14209.txt kybalionstudyofh00init_djvu.txt \\
      kybalionstudyofh00thre_djvu.txt kybalionstudyofh0000thre_djvu.txt kybalionastudyh00unkngoog_djvu.txt \\
      > src/lib/timeline/texts/corpus/kybalion-text.ts
where WS_DIR holds the saved Wikisource pages Introduction.html, Chapter_1.html
... Chapter_15.html.
"""

import difflib
import json
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser

PAGES = ["Introduction"] + [f"Chapter_{n}" for n in range(1, 16)]
CHAPTER_IDS = ["intro"] + [str(n) for n in range(1, 16)]


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    return re.sub(r"[^a-z0-9]", "", w)


# --- W: Wikisource ---------------------------------------------------------------

BLOCK = {"p", "dd", "dt", "li", "h1", "h2", "h3", "h4", "div", "td"}
VOID = {"br", "img", "link", "meta", "hr", "wbr", "input"}
SKIP_CLASSES = ("ws-noexport", "pagenum", "mw-editsection", "noprint", "__ditto_hidden")


class WsParser(HTMLParser):
    """Blocks of text; a page break is kept as the token ⟨pN⟩."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.cur, self.stack, self.skip = [], [], [], 0

    def flush(self):
        t = re.sub(r"\s+", " ", "".join(self.cur)).strip()
        if t:
            self.out.append(t)
        self.cur = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            if tag == "br" and not self.skip:
                self.cur.append(" ")
            return
        a = dict(attrs)
        cls = a.get("class") or ""
        skipping = tag in ("style", "script") or any(c in cls.split() for c in SKIP_CLASSES) or "pagenum" in cls
        if a.get("data-page-number") and not self.skip:
            self.cur.append(f" ⟨p{a['data-page-number']}⟩ ")
        self.stack.append(skipping)
        if skipping:
            self.skip += 1
        if tag in BLOCK and not self.skip:
            self.flush()

    def handle_endtag(self, tag):
        if tag in VOID or not self.stack:
            return
        if self.stack.pop():
            self.skip -= 1
        if tag in BLOCK and not self.skip:
            self.flush()

    def handle_data(self, d):
        if not self.skip:
            self.cur.append(d)


def w_blocks(path):
    t = open(path, encoding="utf-8").read()
    start = t.index('<div class="mw-content-ltr mw-parser-output"')
    end = t.index('<div class="printfooter"')
    p = WsParser()
    p.feed(t[start:end])
    p.flush()
    return p.out


def split_dashes(word):
    """'Mental."—The' -> ['Mental."—', 'The']: a dash ends the word before it."""
    parts = [p for p in re.split(r"(?<=—)", word) if p]
    return parts


def w_chapters(ws_dir):
    """[(chapter id, heading lines, [paragraph]), ...]; a paragraph is a list of
    items: ['page', n] or [text, glued] (glued: no space before it)."""
    out = []
    for cid, page in zip(CHAPTER_IDS, PAGES):
        blocks = w_blocks(os.path.join(ws_dir, f"{page}.html"))
        heading, paras, pending = [], [], []
        for b in blocks:
            if re.fullmatch(r"⟨p\d+⟩", b):
                pending.append(["page", int(b[2:-1])])
                continue
            if len(heading) < (1 if cid == "intro" else 2):
                heading.append(b)
                continue
            items = list(pending)
            pending = []
            for word in b.split():
                m = re.fullmatch(r"⟨p(\d+)⟩", word)
                if m:
                    items.append(["page", int(m.group(1))])
                    continue
                for n, part in enumerate(split_dashes(word)):
                    items.append([part, n > 0])
            paras.append(items)
        out.append((cid, heading, paras))
    return out


# --- the other witnesses: plain text, one word per token ----------------------

HEADS = [key(h) for h in (
    "The Kybalion", "Introduction", "Hermetic Philosophy", "Seven Hermetic Principles", "Mental Transmutation", "The All",
    "The Mental Universe", "The Divine Paradox", "The All in All", "Planes of Correspondence", "Vibration", "Polarity",
    "Rhythm", "Causation", "Gender", "Mental Gender", "Hermetic Axioms",
)]
NUMBER = re.compile(r"\W*\d{1,3}\W*")


def is_running_head(line):
    """A page's running head and number as an OCR reads it ('Seven Hermetic Principles 27', '28 The Kybalion')."""
    toks = line.split()
    if not toks or len(toks) > 6 or not any(NUMBER.fullmatch(t) for t in toks):
        return False
    words = "".join(key(t) for t in toks if not NUMBER.fullmatch(t))
    return not words or max(difflib.SequenceMatcher(None, words, h).ratio() for h in HEADS) >= 0.75


def witness_tokens(path, start_pat, end_pat):
    raw = open(path, encoding="utf-8").read()
    raw = raw[re.search(start_pat, raw, re.M).end():]
    e = re.search(end_pat, raw, re.M)
    raw = raw[: e.end()] if e else raw
    raw = "\n".join("" if is_running_head(line) else line for line in raw.split("\n"))
    # The chapter headings and titles, which the text here leaves out.
    raw = re.sub(r"^[ \t]*CHAPTER [IVXLTl1n.,: ]+[ \t]*\n\s*[^\n]*\n", "\n", raw, flags=re.M)
    raw = re.sub(r"(\w)-[ \t]*\n\s*(\w)", r"\1-\2", raw)  # a word broken at the end of a line or page
    raw = re.sub(r"(\w)- (\w)", r"\1-\2", raw)
    raw = raw.replace("--", " ").replace("—", " ")
    return [t for t in raw.split() if key(t)]


WITNESSES = [
    # (siglum, argument, start of the body, end of the body)
    ("G", 2, r"^INTRODUCTION\s*$", r"^\s*FINIS\s*$"),
    ("B", 3, r"^INTEODUCTION\.\s*$", r"^FINIS\s*$"),
    ("T", 4, r"^INTRODUCTION\.\s*$", r"^FINIS\s*$"),
    ("C", 5, r"^INTRODUCTION\.\s*$", r"^FINIS\s*$"),
    ("K", 6, r"^INTRODUCTION\.\s*$", r"^(?=STANFORD UNIVERSITY LIBRARIES)"),
]


def align(w_keys, s_toks, name):
    """Where the witness differs from W: events [(i1, i2, witness text)], and
    the spans of W it covers without difference."""
    sk = [key(t) for t in s_toks]
    sm = difflib.SequenceMatcher(None, w_keys, sk, autojunk=False)
    events, covered, agree = [], [False] * len(w_keys), 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or "".join(w_keys[i1:i2]) == "".join(sk[j1:j2]):
            agree += i2 - i1 if tag == "equal" else 0
            for i in range(i1, i2):
                covered[i] = True
            continue
        if tag == "replace" and i2 - i1 == j2 - j1:
            for d in range(i2 - i1):
                if w_keys[i1 + d] == sk[j1 + d]:
                    covered[i1 + d] = True
                else:
                    events.append((i1 + d, i1 + d + 1, s_toks[j1 + d]))
            continue
        events.append((i1, i2, " ".join(s_toks[j1:j2])))
    log(f"  {name}: {agree / len(w_keys):.3f} of W's words matched in order; {len(events)} places differ")
    return events, covered


def clean_surface(text):
    return re.sub(r"[\^*]", "", text)


def main():
    ws_dir = sys.argv[1]
    chapters = w_chapters(ws_dir)
    g_tokens = witness_tokens(sys.argv[2], WITNESSES[0][2], WITNESSES[0][3])
    vocab = Counter(key(t) for t in g_tokens)

    # 1. Words W splits in two at a page break or a leftover line-end hyphen
    #    ('let ⟨p216⟩ ting', 'be- tween'): joined when G has the whole word.
    joins = 0
    for cid, _, paras in chapters:
        for items in paras:
            words = [n for n, it in enumerate(items) if it[0] != "page"]
            for a, b in zip(words, words[1:]):
                x, y = items[a][0], items[b][0]
                page_between = b - a > 1
                if not y[:1].isalpha() or (not y[0].islower() and not x.endswith("-")):
                    continue
                if not (x.endswith("-") or page_between) or re.search(r"[.,;:!?”\"')—]$", x):
                    continue
                whole = key(x) + key(y)
                if not vocab[whole] or (not x.endswith("-") and vocab[key(x)] and vocab[key(y)] and vocab[whole] < 2):
                    if x.endswith("-") or page_between:
                        log(f"  not joined {cid}: {x!r} + {y!r}")
                    continue
                hyphenated = x.endswith("-") and vocab_hyphen(g_tokens, x, y)
                items[a][0] = (x if hyphenated else x.rstrip("-")) + y
                items[b][0] = ""
                joins += 1
                log(f"  joined {cid}: {x!r} + {y!r} -> {items[a][0]!r}")
        for items in paras:
            items[:] = [it for it in items if it[0] != ""]
    log(f"{joins} words joined")

    flat = []  # (chapter, paragraph, item) of each word of W
    for c, (_, _, paras) in enumerate(chapters):
        for p, items in enumerate(paras):
            for n, it in enumerate(items):
                if it[0] != "page" and key(it[0]):
                    flat.append((c, p, n))
    word = lambda i: chapters[flat[i][0]][2][flat[i][1]][flat[i][2]][0]
    w_keys = [key(word(i)) for i in range(len(flat))]
    log(f"W: {len(flat)} words")

    # 2. The vote.
    by_event = defaultdict(dict)
    covered = {}
    for sig, arg, start, end in WITNESSES:
        toks = g_tokens if sig == "G" else witness_tokens(sys.argv[arg], start, end)
        events, cov = align(w_keys, toks, sig)
        covered[sig] = cov
        for i1, i2, text in events:
            by_event[(i1, i2, key(text))][sig] = text
    accepted = []
    rejected = Counter()
    for (i1, i2, k), wits in sorted(by_event.items()):
        span = range(i1, max(i2, i1 + 1))
        for_w = [s for s in covered if s not in wits and all(covered[s][i] for i in span if i < len(flat))]
        ours = " ".join(word(i) for i in range(i1, i2))
        ctx = " ".join(word(i) for i in range(max(0, i1 - 4), i1)) + " [" + ours + "] " + " ".join(word(i) for i in range(i2, min(len(flat), i2 + 3)))
        surface = wits.get("G") or Counter(clean_surface(t) for t in wits.values()).most_common(1)[0][0]
        tally = f"{len(wits)}:{1 + len(for_w)} {''.join(sorted(wits))}"
        if len(wits) > 1 + len(for_w) and len(wits) >= 2:
            if (key(ours), k) in REJECT:
                rejected[(key(ours), k)] += 1
                log(f"  rejected {tally}: {ctx!r} -> {surface!r}")
                continue
            accepted.append((i1, i2, surface))
            log(f"  TAKEN {tally}: {ctx!r} -> {surface!r}")
        elif "G" in wits and len(wits) == 1:
            log(f"  1912 only {tally}: {ctx!r} -> {surface!r}")
        elif len(wits) >= 2:
            log(f"  not taken {tally} (W with {''.join(for_w)}): {ctx!r} -> {surface!r}")
    for pair in REJECT:
        assert rejected[pair] >= 1, ("REJECT entry not met", pair)
    assert len(accepted) == len(EXPECTED_TAKEN), [word(i1) for i1, _, _ in accepted]
    for (i1, i2, surface), (ours, theirs) in zip(accepted, EXPECTED_TAKEN):
        assert key(" ".join(word(i) for i in range(i1, i2))) == key(ours) and key(surface) == key(theirs), (ours, theirs)

    # 3. Apply the vote, from the end so the indexes stay good.
    for i1, i2, surface in sorted(accepted, reverse=True):
        new = surface.split()
        if i2 > i1:
            c, p, n = flat[i1]
            items = chapters[c][2][p]
            glued = items[n][1]
            last = flat[i2 - 1][2]
            ours = items[n:last + 1]
            # Keep W's punctuation around the word: replace only its letters.
            if len(new) == 1 and i2 - i1 == 1:
                old = items[n][0]
                m = re.match(r"^(\W*)(.*?)(\W*)$", old)
                core = re.match(r"^\W*(.*?)\W*$", new[0]).group(1)
                items[n][0] = m.group(1) + core + m.group(3)
            else:
                items[n:last + 1] = [[w, glued if j == 0 else False] for j, w in enumerate(new)]
                assert all(it[0] != "page" for it in ours)
        else:
            c, p, n = flat[i1]
            items = chapters[c][2][p]
            items[n:n] = [[w, False] for w in new]

    # 5. The text.
    out = []
    axioms = []
    applied = Counter()
    for (cid, heading, paras), numeral in zip(chapters, ["Introduction"] + ROMAN[1:]):
        first = last = None
        texts = []
        page = None
        for items in paras:
            buf = ""
            starts = None
            for it in items:
                if it[0] == "page":
                    page = it[1]
                    first = first or page
                    last = page
                    continue
                starts = starts or page
                buf += (it[0] if it[1] or not buf else " " + it[0])
            # The book sets its dashes closed up; W spaces some of them.
            buf = re.sub(r" ?— ?", "—", buf)
            # 4. Corrections by hand.
            for n, (ch, old, new, _count, _why) in enumerate(FIXES):
                if ch in (cid, "*") and old in buf:
                    applied[n] += buf.count(old)
                    buf = buf.replace(old, new)
                    log(f"  fix {cid}: {old!r} -> {new!r}")
            texts.append(buf)
            for m in re.finditer(r"(?:^|(?<=[\s:]))\"([^\"]+?)\"—The Kybalion\.", buf):
                axioms.append({"chapter": cid, "page": starts, "text": m.group(1)})
        title = heading[-1].rstrip(".") if cid != "intro" else "Introduction"
        out.append({"id": cid, "numeral": numeral, "title": title, "firstPage": first, "lastPage": last, "text": "\n\n".join(texts)})
        log(f"chapter {cid}: pp. {first}–{last}, {len(texts)} paragraphs, heading {heading}")
    for n, (ch, old, _new, count, _why) in enumerate(FIXES):
        assert applied[n] == count, ("FIXES entry applied the wrong number of times", old, applied[n])
    for x in out:
        assert "  " not in x["text"] and "⟨" not in x["text"] and "Kyhalion" not in x["text"], x["id"]
    log(f"{len(axioms)} sayings quoted as '—The Kybalion.'")
    write(out, axioms)


ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"]

# Majority readings the rule would take that are wrong: (W's word, the
# witnesses' reading), compared as letters-only keys. Each must be met.
REJECT = [
    ("o", "0"),  # '"O, let not the flame die out!"': three OCRs read the capital O as a zero.
]

# What the vote takes, in order (W's reading, the majority's): asserted, so a
# change in the inputs cannot change the text unnoticed.
EXPECTED_TAKEN = [
    ("Kyhalion.", "Kybalion."),
    ("Kyhalion.", "Kybalion."),
    ("EXILE", "RULE"),
    ("Kelative", "Relative"),
    ("", "to"),
    ("conscionsness", "consciousness"),
    ('"refusings"', '"refusing"'),
]

# Corrections by hand to W: (chapter, old, new, expected count, why).
FIXES = [
    ("*", "Kyhalion", "Kybalion", 3,
     "W reads the italic b of 'The Kybalion' as h in five places, two of which the vote corrects; the three left are ties, because the OCR of the same copy (B) and of the Stanford copy (K) misread the italic in the same way. The page image of p. 26 (BYU copy) shows the italic b, and G, T and C read 'Kybalion'."),
    ("*", "Eeality", "Reality", 1,
     "W keeps an OCR misreading of the capital R as E ('the Underlying Eeality of the Universe'); G and C read 'Reality'. The other OCRs make the same misreading of this R elsewhere, so the vote ties."),
    ("6", "dark comers.", "dark corners.", 1,
     "W, B and K read 'comers'; G, T and C read 'corners'. The page image of p. 90 (BYU copy) shows 'corners', the r and n set close."),
    ("2", "exist ,in accordance", "exist, in accordance", 1,
     "W gives 'which exist ,in accordance'. The page image of p. 36 (BYU copy) shows a low point after 'exist' and no space before 'in', a fault of the setting; it is given here as G reads it, 'exist, in'. Punctuation is not voted, so the vote cannot see it."),
    # Quotation marks. Punctuation is not voted, so every paragraph with an odd
    # number of quotation marks was compared by hand with the five other
    # witnesses; at these four the other 1908 copies and G all read otherwise.
    ("2", '? "What is the difference between', "? What is the difference between", 1,
     "W opens a quotation before 'What is the difference between \"Large and Small\"?' that is never closed; T, C, K and G have no mark there."),
    ("4", "ever 'not been,\"", 'ever "not been,"', 1,
     "W opens the quotation 'not been,' with a single mark and closes it with a double; T, C, B, K and G have double marks at both ends."),
    ("4", "with respect.—The Kybalion.", 'with respect."—The Kybalion.', 1,
     "W leaves the saying '\"But, the report of Reason must be hospitably received, and treated with respect.' unclosed; T, C, B, K and G close it before '—The Kybalion.'"),
    ("5", 'projects its "Will toward the Feminine', "projects its Will toward the Feminine", 1,
     "W opens a quotation before 'Will toward the Feminine Principle' that is never closed; B (the same copy) shows a mark there, but the other three 1908 copies (T, C, K) and G have none, so it is taken for a speck on the BYU page."),
]



def write(chapters, axioms):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/kybalion.py from Wikisource's proofread transcription\n")
    w("// of The Kybalion (Chicago: Yogi Publication Society, 1908), voted word by word\n")
    w("// against Project Gutenberg #14209 and the archive.org OCRs of three other 1908\n")
    w("// copies and of the copy Wikisource transcribed. Do not edit by hand: correct\n")
    w("// the generator (its FIXES list holds every correction made by hand) and run it\n")
    w("// again.\n\n")
    w("export type KybalionChapter = {\n  /** 'intro', or the chapter's number, '1' to '15'. */\n  id: string;\n  /** 'Introduction', or the chapter's Roman numeral. */\n  numeral: string;\n  /** The heading as the chapter prints it. */\n  title: string;\n  /** The printed pages of the 1908 edition the chapter runs over. */\n  firstPage: number;\n  lastPage: number;\n  /** Paragraphs separated by blank lines. */\n  text: string;\n};\n\n")
    w("/** A saying the book prints as a quotation from 'The Kybalion' (ending '—The Kybalion.'). */\n")
    w("export type KybalionSaying = { chapter: string; page: number; text: string };\n\n")
    w("export const KYBALION_CHAPTERS: KybalionChapter[] = [\n")
    for x in chapters:
        w(f"  {{ id: {json.dumps(x['id'])}, numeral: {json.dumps(x['numeral'])}, title: {json.dumps(x['title'], ensure_ascii=False)}, firstPage: {x['firstPage']}, lastPage: {x['lastPage']}, text: {json.dumps(x['text'], ensure_ascii=False)} }},\n")
    w("];\n\nexport const KYBALION_SAYINGS: KybalionSaying[] = [\n")
    for a in axioms:
        w(f"  {{ chapter: {json.dumps(a['chapter'])}, page: {a['page']}, text: {json.dumps(a['text'], ensure_ascii=False)} }},\n")
    w("];\n")


def vocab_hyphen(g_tokens, x, y):
    whole = (x + y).lower()
    return any(t.lower().strip('.,;:"!?()') == whole.strip('.,;:"!?()') for t in g_tokens)


if __name__ == "__main__":
    main()
