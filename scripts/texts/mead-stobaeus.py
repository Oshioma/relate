"""The Hermetic excerpts in Stobaeus (Mead 1906, vol. III) -> paragraph-by-paragraph English.

Input: three archive.org OCRs ("Full text", saved as plain text) of G. R. S.
Mead, Thrice-Greatest Hermes, vol. III (1906), "Excerpts by Stobaeus":

  H  thricegreatesthe03hermuoft  (University of Toronto copy)       -- the base
  U  afx0734.0003.001.umich.edu  (University of Michigan copy)
  C  thrice-greatest-hermes-vol-1-2-3-grs-mead, vol. III file (a third scan)

All three are the same 1906 printing, so the line and page breaks agree; the
OCR errors mostly do not. Each copy is cut into Mead's twenty-seven excerpts
(EXCERPT I ... XXVII), from the end of Mead's source note "(Title ... Text:
Stob. ...; Menard ...)" to the next excerpt or to his "COMMENTARY", which is
never read. Running heads and lone page numbers are dropped, and on each page
everything from the first footnote ("1 ...") to the end of the page is
dropped, so the footnotes are not read. Footnote markers left in the text
(digits or stray signs after a word) are taken out.

The three copies are then compared word by word (difflib, on lower-case
letters only). Where H differs from the other two and they agree with each
other, theirs is taken -- a word, a run of words, or a run that H lacks or has
alone (a footnote let through, a line dropped). Everything else stays as H
has it. Every such change is printed to stderr, with the in-order agreement
of each copy with H, so the run can be checked. Certain misreadings that all
three share (Mead's "aeon" read as "seon", R read as K or E) are fixed by
FIXES, and only where the reading is certain.

Mead numbers the paragraphs of every excerpt ("I have numbered the
paragraphs in all the excerpts for convenience of reference"); each numbered
paragraph is a row. Short excerpts he does not number are one row with
paragraph 0. Line-end hyphens are kept only where the same word is printed
with a hyphen inside a line somewhere in the book.

Usage:
  python3 -I scripts/texts/mead-stobaeus.py H.txt U.txt C.txt > src/lib/timeline/texts/corpus/stobaeus-text.ts
"""

import difflib
import json
import re
import sys
from collections import Counter

HEAD_EVEN = re.compile(r"^\s*(\d{1,3})\s+THR[A-Z]*.?\s*GREATEST\s+HERMES\s*$", re.I)
HEAD_ODD = re.compile(r"^\s*[A-Z\[][A-Z\s,'’\[\]\-.\"“”;:()&]{6,}\s+(\d{1,3})\s*$")
LONE_NUM = re.compile(r"^\s*(\d{1,3})\s*$")
EXC = re.compile(r"^\s*EX[A-Z]{3,5}T\s+[IVXL]+")
COMM = re.compile(r"^\s*COMM[A-Z]*\s*$")
FOOT = re.compile(r"^\s*[1l]\s+(?!\d\.)[^\s.]")
# A footnote marker: digits or a stray sign straight after a word or a stop.
MARK = re.compile(r"(?<=[A-Za-z.,;:!?\]\)'\"—])\s?(?:\d{1,2}|[*®°¹²³⁴⁵⁶⁷⁸⁹†‡^~])(?=[\s,.;:!?\]\)'\"—]|$)")
PARA_NO = re.compile(r"^(\d{1,2})\.$")
# The page each excerpt starts on, from Mead's table of contents (p. v).
LAST_PAGE = 204  # the last page of Excerpt XXVII
FIRST_PAGE = {1: 3, 2: 14, 3: 17, 4: 24, 5: 26, 6: 28, 7: 30, 8: 34, 9: 45, 10: 55, 11: 58, 12: 60, 13: 61, 14: 63,
              15: 65, 16: 72, 17: 75, 18: 77, 19: 80, 20: 84, 21: 87, 22: 88, 23: 89, 24: 91, 25: 93, 26: 125, 27: 188}
# Mead numbers the second "Virgin of the World" on from the first (XXV ends at 38).
START = {26: 39}

# Mead's titles, from his table of contents (p. v), with his square brackets
# where the title is his own (the excerpt heading prints them so).
TITLES = {
    1: "Of Piety and [True] Philosophy",
    2: "[Of the Ineffability of God]",
    3: "Of Truth",
    4: "[God, Nature and the Gods]",
    5: "[Of Matter]",
    6: "Of Time",
    7: "Of Bodies Everlasting and Bodies Perishable",
    8: "Of Energy and Feeling",
    9: "Of the Decans and the Stars",
    10: "Concerning the Rule of Providence, Necessity and Fate",
    11: "[Of Justice]",
    12: "Of Providence and Fate",
    13: "Of the Whole Economy",
    14: "[Of Soul, I.]",
    15: "[Of Soul, II.]",
    16: "[Of Soul, III.]",
    17: "[Of Soul, IV.]",
    18: "[Of Soul, V.]",
    19: "[Of Soul, VI.]",
    20: "[The Power of Choice]",
    21: "[Of Isis to Horus]",
    22: "[An Apophthegm]",
    23: "From \"Aphrodite\"",
    24: "[A Hymn of the Gods]",
    25: "The Virgin of the World, I.",
    26: "The Virgin of the World, II.",
    27: "From the Sermon of Isis to Horus",
}

# Where the copies disagree three ways and H is wrong, which copy to follow:
# (excerpt, words in H's stretch, "U" or "C"). Each was checked by reading
# the three copies side by side.
OVERRIDES = [
    # H and U both took the line "I was brought forth" for a footnote ("1
    # was ...") and lost the rest of p. 121, with paragraph 33; C has it.
    (25, "what Next", "C"),
    # H let footnotes through (Greek and notes 2-3); U has the text alone.
    (8, "its being", "U"),
    (9, "concerning lice", "U"),
    # H let footnotes through; C has Mead's row of asterisks after the speech.
    (25, "contemplative science", "C"),
]

# Misreadings shared by the OCRs, fixed where the reading is certain:
# (excerpt or 0 for all, wrong, right). Plain string replacement in the
# finished paragraph text.
FIXES = [
    # Mead's paragraph number "1." read as "I." at the head of a paragraph.
    (1, "I. Her. Both", "Her. Both"),
    (25, "I. So speaking", "So speaking"),
    (7, "I. [Her.] The Lord", "[Her.] The Lord"),
    (27, "I. In wondrous fashion", "In wondrous fashion"),
    # C reads "Ne-|cessity[’s]" and "Fortune[’s]"; H and U lost the bracket.
    (1, "Necessity] handmaiden", "Necessity[’s] handmaiden"),
    (1, "Fortune[7s]", "Fortune[’s]"),
    (3, "he riot true", "he not true"),  # U and C: "not"
    (3, "“same,”:—how", "“same,”—how"),
    (9, "TanSs", "Tanês"),  # C "Tanés"; that copy prints Mead's circumflex as é (Hermés, Kaméphis)
    (9, "Six-andthirty", "Six-and-thirty"),
    (9, "[Bear] $ above", "[Bear] above"),
    (10, "grasp l;", "grasp;"),
    (11, "Tis over", "’Tis over"),  # U: "'Tis"
    (13, "[encompasses the Cosmos]. 5", "[encompasses the Cosmos]."),
    (13, "sway of\n\nProvidence", "sway of Providence"),
    (14, "[to bej", "[to be]"),
    (14, "qud body", "quâ body"),  # C "qué"
    (14, "“” because of something,“", "“because of something,”"),
    (20, "Fate does not reach it ^WW", "Fate does not reach it."),  # U: "reach it.4" (a footnote number)
    (23, "[ ] How", "[——] How"),  # C "[——]": Mead leaves the speaker unnamed
    (23, "[Aphrodite.~\\", "[Aphrodite.]"),
    (24, "setherial", "ætherial"),  # C "ztherial"
    (25, "deathless- ness", "deathlessness"),
    (25, "mighty Mon,", "mighty Æon,"),
    (25, "-ZEther", "Æther"),
    (25, "zEther", "Æther"),
    (0, "^Ether", "Æther"),
    (25, "Heaven/ said God", "Heaven,’ said God"),  # all three copies: the closing ’ read as "/"
    (25, "‘ Soul of My Soul", "‘Soul of My Soul"),
    (25, "eyes I s gazed", "eyes I gazed"),
    (0, "in aether floating", "in æther floating"),
    (25, "(Water and Earth *)", "(Water and Earth)"),
    (25, "com- plaint", "complaint"),
    (25, "thou\n\nName", "thou Name"),
    (25, "hast Thou,\n\nO Daimon", "hast Thou, O Daimon"),
    (25, "O son!?", "O son!"),
    (26, "son,... -1", "son, . . ."),
    (27, "noble- natured", "noble-natured"),
    (27, "ruling them l;", "ruling them;"),
    (25, "Either, Air", "Æther, Air"),
    (25, "unto the full.“", "unto the full.”"),
    (27, "THE SouL", "THE SOUL"),
    # Mead gives three Greek words in brackets; no copy reads them, so they are marked as left out.
    (6, "(rn;jce)", "(Greek word omitted)"),
    (6, "(eVeo-TO)?)", "(Greek word omitted)?"),
    (6, "(ea-rdvai)", "(Greek word omitted)"),
]
# Footnotes the OCR ran into the text, cut out whole: (excerpt, regex, replacement).
DROPS = [
    (5, r"\n\n2 a/j\.op.*$", ""),
    (9, r" the text is faulty.*?xxviii\. \.\n\n", " "),
    (25, r" severally adapted to them.*?cf also § below\.", ""),
    (25, r"\n\n3 Cf\. Tim\., B:.*?Egyptian tradition\.", ""),
    (25, r" skin\. The phrase “as is the nature of the Gods”.*?growing young of the Gods\.", ""),
]


def norm_chars(s):
    for a, b in (("“", '"'), ("”", '"'), ("„", '"'), ("‘", "'"), ("’", "'"), ("\u00ad", ""), ("■", ""), ("«", ""), ("»", "")):
        s = s.replace(a, b)
    return s


def read(path):
    return open(path, encoding="utf-8", errors="replace").read().split("\n")


def excerpt_spans(lines):
    starts = [i for i, l in enumerate(lines) if EXC.match(l)][:27]
    assert len(starts) == 27, len(starts)
    spans = []
    for n, s in enumerate(starts):
        nxt = starts[n + 1] if n + 1 < 27 else len(lines)
        end = next((i for i in range(s + 1, nxt) if COMM.match(lines[i])), nxt)
        spans.append((s, end))
    return spans


def split_note(lines, s, e):
    """(source note lines, body lines with their line numbers)."""
    i = s + 1
    while i < e and not lines[i].strip().startswith("("):
        i += 1
    j, depth = i, 0
    while j < e:
        line = lines[j].replace("M($nard", "Ménard")  # H's misreading of Ménard opens a bracket
        depth += line.count("(") - line.count(")")
        if depth <= 0 and re.search(r"\)\.?[\"”]?\s*$", lines[j].strip()):
            break
        j += 1
    return lines[i : j + 1], list(range(j + 1, e))


def page_of_header(line):
    """The page number a running head or page number gives; -1 for a running
    head whose number the OCR lost; None for any other line."""
    for rx in (HEAD_EVEN, HEAD_ODD, LONE_NUM):
        m = rx.match(line)
        if m:
            return int(m.group(1))
    letters = re.sub(r"[^A-Za-z]", "", line).upper()
    if len(letters) >= 10 and (
        letters in RUNNING_HEADS
        or any(difflib.SequenceMatcher(None, letters, h).ratio() >= 0.85 for h in RUNNING_HEADS)
    ):
        return -1
    return None


# The running heads of the book (set by load() from the heads that carry a
# page number), to recognise one whose number the OCR lost. Any other line
# in capitals is Mead's own sub-heading and is kept.
RUNNING_HEADS = set()


def collect_running_heads(lines):
    for l in lines:
        for rx in (HEAD_EVEN, HEAD_ODD):
            if rx.match(l):
                letters = re.sub(r"[^A-Za-z]", "", l).upper()
                if len(letters) >= 10:
                    RUNNING_HEADS.add(letters)


def body_tokens(lines, idx, start_page):
    """Tokens of the excerpt body: '¶' between paragraphs, each word with its page."""
    pages, cur, page = [], [], start_page
    for i in idx:
        l = lines[i]
        p = page_of_header(l)
        if p is not None:
            # A running head names the page it heads; a lone number ends its page.
            pages.append((page, cur))
            if p == -1:
                page = page + 1 if page is not None else None
            elif LONE_NUM.match(l):
                page = p + 1
            else:
                page = p
            cur = []
            continue
        if "Digitized" in l or "Microsoft" in l:
            continue
        # "1 5." is Mead's paragraph 15 with a space read into it.
        cur.append(re.sub(r"^(\s*)(\d) (\d\.\s)", r"\1\2\3", l.rstrip()))
    pages.append((page, cur))
    toks = []
    for page, p in pages:
        cut = next((k for k, l in enumerate(p) if k > 0 and FOOT.match(l)), len(p))
        text = norm_chars("\n".join(p[:cut]))
        # A numbered paragraph always starts a new block, blank line or not.
        text = re.sub(r"\n(\s*\d{1,2}\.\s)", r"\n\n\1", text)
        text = re.sub(r"(\w)-\s*\n\s*(?=\w)", "\\1-\u0001", text)
        text = re.sub(r"(\w)- (?=[a-z])", "\\1-\u0001", text)  # a split with the line end read as a space
        for para_i, para in enumerate(re.split(r"\n\s*\n", text)):
            para = MARK.sub("", para)
            para = re.sub(r"\s*(—|--)\s*", "—", para)
            para = re.sub(r"\s+([,;:!?.])", r"\1", para)
            ws = para.split()
            if not ws:
                continue
            # A paragraph broken by the page carries on (the next page starts mid-sentence).
            if not (para_i == 0 and toks and ws[0][0].islower()):
                toks.append(("¶", page))
            toks.extend((w, page) for w in ws)
    return toks


def norm(t):
    return re.sub(r"[^a-z]", "", t.lower())


def load(path):
    lines = read(path)
    collect_running_heads(lines)
    out = []
    for n, (s, e) in enumerate(excerpt_spans(lines), start=1):
        note, idx = split_note(lines, s, e)
        out.append({"note": note, "toks": body_tokens(lines, idx, FIRST_PAGE[n])})
    return out


def _aligned(hn, other):
    """For a copy: its words with their ¶ marks, and where each boundary of H's
    word sequence falls in it (None where the boundary is inside a difference)."""
    words, marks = [], []  # marks[j]: tokens (¶ and words) before word j's own token
    pending = []
    for t in other:
        if t[0] == "¶":
            pending.append(t)
        else:
            marks.append(pending)
            pending = []
            words.append(t)
    marks.append(pending)
    sm = difflib.SequenceMatcher(None, hn, [norm(w) for w, _ in words], autojunk=False)
    at = [None] * (len(hn) + 1)
    raw = {}
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1 + 1):
                at[i1 + k] = j1 + k
            for k in range(i2 - i1):
                raw[i1 + k] = words[j1 + k][0]
    at[0] = 0 if at[0] is None and not hn else at[0]
    at[len(hn)] = len(words) if at[len(hn)] is None else at[len(hn)]
    if at[0] is None:
        at[0] = 0
    return words, marks, at, raw, sm.ratio()


def _segment(words, marks, j1, j2):
    """The copy's tokens for words j1..j2, with the ¶ marks inside the run."""
    out = []
    for j in range(j1, j2):
        if j > j1:
            out.extend(marks[j])
        out.append(words[j])
    return out


def consensus(n, h, u, c, log):
    """H's tokens, corrected where U and C agree against it.

    The two other copies are aligned with H word by word. Wherever either
    differs from H, the smallest stretch of H whose two ends line up in all
    three copies is compared: if U and C have the same words there (by
    letters), and they are not H's, theirs are taken; if they are nearly the
    same and H's are quite different (a line or a page H lost or let in),
    U's are taken and the change is logged as fuzzy for checking."""
    words = [t for t in h if t[0] != "¶"]
    marks = []
    pending = []
    for t in h:
        if t[0] == "¶":
            pending.append(t)
        else:
            marks.append(pending)
            pending = []
    marks.append(pending)
    hn = [norm(w) for w, _ in words]
    wu, mu, au, ru, qu = _aligned(hn, u)
    wc, mc, ac, rc, qc = _aligned(hn, c)
    log.append(f"excerpt {n}: {len(words)} words; agreement with U {qu:.3f}, with C {qc:.3f}")

    def clean(i):
        """Boundary i lines up in both copies, with no difference touching it."""
        if au[i] is None or ac[i] is None:
            return False
        if 0 < i < len(words):
            return (
                au[i - 1] is not None and au[i - 1] + 1 == au[i]
                and ac[i - 1] is not None and ac[i - 1] + 1 == ac[i]
            )
        return True

    out = []
    i = 0
    while i < len(words):
        if clean(i) and clean(i + 1) and ru.get(i) is not None and rc.get(i) is not None:
            out.extend(marks[i])
            w = words[i][0]
            if ru[i] == rc[i] and ru[i] != w and "\u0001" not in w:
                w = ru[i]  # punctuation: U and C agree on a different form
            out.append((w, words[i][1]))
            i += 1
            continue
        # A stretch of differences: from boundary i to the next clean boundary.
        k = i + 1
        while k < len(words) and not (clean(k) and (k + 1 > len(words) or clean(k + 1))):
            k += 1
        if au[i] is None or au[k] is None or ac[i] is None or ac[k] is None:
            k = len(words)
        seg_h = words[i:k]
        seg_u = _segment(wu, mu, au[i], au[k])
        seg_c = _segment(wc, mc, ac[i], ac[k])
        nh = [norm(w) for w, _ in seg_h]
        nu = [norm(w) for w, _ in seg_u if w != "¶"]
        nc = [norm(w) for w, _ in seg_c if w != "¶"]
        old = " ".join(w for w, _ in seg_h)
        new = " ".join(w for w, _ in seg_u)
        page = words[i][1] if i < len(words) else words[-1][1]
        if nu == nc and nu != nh:
            out.extend(marks[i])
            out.extend((w, page) for w, _ in seg_u)
            log.append(f"  {n} @{i}: [{old}] -> [{new}]")
        elif nu != nh and nc != nh and difflib.SequenceMatcher(None, nu, nc, autojunk=False).ratio() >= 0.85 and difflib.SequenceMatcher(None, nh, nu, autojunk=False).ratio() < 0.6 and abs(len(nu) - len(nh)) >= 3:
            out.extend(marks[i])
            out.extend((w, page) for w, _ in seg_u)
            log.append(f"  {n} @{i} FUZZY: [{old}] -> [{new}] (C: {' '.join(w for w, _ in seg_c)})")
        else:
            choice = next((copy for ex, snippet, copy in OVERRIDES if ex == n and snippet in old), None)
            if choice:
                out.extend(marks[i])
                out.extend((w, page) for w, _ in (seg_u if choice == "U" else seg_c))
                log.append(f"  {n} @{i} OVERRIDE {choice}: [{old[:120]}] -> [{' '.join(w for w, _ in (seg_u if choice == 'U' else seg_c))[:300]}]")
                i = k
                continue
            for j in range(i, k):
                out.extend(marks[j])
                out.append(words[j])
            if max(len(nh), len(nu), len(nc)) - min(len(nh), len(nu), len(nc)) >= 3:
                log.append(f"  {n} @{i} UNRESOLVED: H[{old[:200]}] U[{new[:200]}] C[{' '.join(w for w, _ in seg_c)[:200]}]")
        i = k
    out.extend(marks[len(words)])
    return out


CLEAN_TEXTS = [
    # Proofread English already in the archive, for telling a word from a
    # line-end split: Mead's own Corpus Hermeticum and Asclepius, Jowett's
    # Plato, Hall.
    "hermetica-text.ts",
    "asclepius-text.ts",
    "plato-timaeus-text.ts",
    "plato-critias-text.ts",
    "hall-secret-teachings-text.ts",
    "hall-secret-teachings-text-1.ts",
    "hall-secret-teachings-text-2.ts",
    "hall-secret-teachings-text-3.ts",
    "hall-secret-teachings-text-4.ts",
]


def hyphen_vocab(all_lines):
    """Words printed with a hyphen inside a line, and words printed whole
    (inside a line in the OCRs, or anywhere in the archive's proofread texts)."""
    import os

    hyph, whole = Counter(), Counter()
    for l in all_lines:
        l = norm_chars(l).strip()
        inner = re.sub(r"^\S+\s*|\s*\S+$", "", l)  # not the first or last word of the line
        for w in re.findall(r"[A-Za-zæ]+(?:-[A-Za-zæ]+)+", inner):
            hyph[w.lower()] += 1
        for w in re.findall(r"(?<![-A-Za-z])[A-Za-zæ]+(?![-A-Za-z])", inner):
            whole[w.lower()] += 1
    here = os.path.dirname(os.path.abspath(__file__))
    corpus = os.path.join(here, "..", "..", "src", "lib", "timeline", "texts", "corpus")
    for name in CLEAN_TEXTS:
        path = os.path.join(corpus, name)
        if os.path.exists(path):
            for w in re.findall(r"(?<![-A-Za-z])[A-Za-zæ]+(?![-A-Za-z])", open(path, encoding="utf-8").read()):
                whole[w.lower()] += 1
    return hyph, whole


# Words split at a line end that Mead prints with a hyphen, though the book
# never shows them whole inside a line (checked in the three copies).
KEEP_HYPHEN = {"co-uniting", "co-unites", "co-nurslings", "after-the", "self-grown", "body-texture", "all-encircling", "thirty-six", "full-filling", "and-thirty", "tent-fellows"}


def join_hyphen(w, hyph, whole):
    """A word split at a line end ('co-\u0001uniting'): keep the hyphen if the
    book prints the word so inside a line or KEEP_HYPHEN lists it; else join."""
    if "\u0001" not in w:
        return w

    def one(m):
        pair = f"{m.group(1)}-{m.group(2)}".lower()
        whole_word = (m.group(1) + m.group(2)).lower()
        if pair in KEEP_HYPHEN or (pair in hyph and hyph[pair] >= whole[whole_word]):
            return f"{m.group(1)}-{m.group(2)}"
        return m.group(1) + m.group(2)

    return re.sub(r"([A-Za-zæ]+)-\u0001([A-Za-zæ]+)", one, w).replace("\u0001", "")


SPEAKER = re.compile(r"[\[\\{(]\s*(Her|Tat)[^\]\s]{0,3}\s*[\]\}\\)]?(?=\s)")


def tidy(text):
    """One block of Mead's text, as printed: OCR debris out, quotes curled."""
    text = re.sub(r"(?<![A-Za-z])0(?![0-9])", "O", text)  # "0 Tat": the vocative O read as a zero
    text = re.sub(r"(?<=\s)\d{1,2}(?=[\s,.;:])", "", text)  # a footnote number left standing alone
    text = SPEAKER.sub(lambda m: f"[{m.group(1)}.]", text)  # "[Her.~\", "[HerJ]", "\Tat.]"
    text = re.sub(r"\s{2,}", " ", text).strip()
    out, open_ = [], False
    for k, ch in enumerate(text):
        if ch == '"':
            ch = "”" if open_ else "“"
            open_ = not open_
        out.append(ch)
    text = "".join(out)
    text = re.sub(r"“\s+", "“", text)
    text = re.sub(r"\s+”", "”", text)
    text = re.sub(r"(^|[\s(\[—“])'(?=(tis|twas|twere|twill|twould)\b)", r"\1’", text, flags=re.I)
    text = re.sub(r"(^|[\s(\[—“])'", r"\1‘", text)
    text = text.replace("'", "’").replace("[‘s]", "[’s]")
    return text


def paragraphs(n, toks, hyph, whole, log):
    """Mead's numbered paragraphs: [(number, first page, last page, text)]."""
    paras, cur = [], None
    blocks = []  # [(page, [words])]
    for w, p in toks:
        if w == "¶":
            blocks.append([p, []])
        else:
            if not blocks:
                blocks.append([p, []])
            blocks[-1][1].append((w, p))
    expected = START.get(n, 1)
    for page, ws in blocks:
        if not ws:
            continue
        words = [join_hyphen(w, hyph, whole) for w, _ in ws]
        if all(re.fullmatch(r"[*^#•■~\-VWKr4fc&.d]+", w) for w in words) and sum(w == "*" for w in words) >= 2:
            words = ["*", "*", "*", "*", "*"]  # Mead's row of asterisks: a gap in the text
        else:
            words = [w for w in words if not re.fullmatch(r"[l1*^~#•®°\\/|]+", w)]
        if not words:
            continue
        m = PARA_NO.match(words[0])
        number = int(m.group(1)) if m else None
        if number is not None and number in (expected, expected + 1):
            if number != expected:
                if paras and paras[-1][0] == 0 and number == 2 and len(paras) == 1:
                    paras[-1][0] = 1  # Mead prints no "1." before the first paragraph
                else:
                    log.append(f"  {n}: Mead prints no paragraph {expected}; {number} follows {expected - 1}")
            cur = [number, ws[0][1], ws[-1][1], []]
            paras.append(cur)
            expected = number + 1
            words = words[1:]
        elif number is not None:
            log.append(f"  {n}: paragraph number {number} out of order (expected {expected})")
        if cur is None:
            cur = [0, ws[0][1], ws[-1][1], []]
            paras.append(cur)
        cur[2] = ws[-1][1]
        cur[3].append(" ".join(words))
    out = []
    for number, first, last, texts in paras:
        blocks = []
        for t in texts:
            t = tidy(t)
            # A block that starts in mid-sentence was cut by the page.
            if blocks and re.match(r"^([a-z]|—|\[[a-z]|[,;:])", t):
                blocks[-1] = blocks[-1] + ("" if t.startswith("—") else " ") + t
            else:
                blocks.append(t)
        text = "\n\n".join(blocks)
        for ex, wrong, right in FIXES:
            if ex in (0, n):
                if wrong not in text and ex != 0:
                    continue
                text = text.replace(wrong, right)
        for ex, pattern, repl in DROPS:
            if ex == n:
                text = re.sub(pattern, repl, text, flags=re.S)
        # A page number misread by the OCR ("26-2"): keep pages inside the excerpt.
        lo, hi = FIRST_PAGE[n], FIRST_PAGE.get(n + 1, LAST_PAGE)
        first = min(max(first, lo), hi)
        last = min(max(last, first), hi)
        out.append((number, first, last, text))
    return out


def main():
    paths = sys.argv[1:4]
    copies = [load(p) for p in paths]
    all_lines = [l for p in paths for l in read(p)]
    hyph, whole = hyphen_vocab(all_lines)
    log = []
    rows = []
    for n in range(1, 28):
        h, u, c = (cp[n - 1]["toks"] for cp in copies)
        toks = consensus(n, h, u, c, log)
        for number, first, last, text in paragraphs(n, toks, hyph, whole, log):
            rows.append([n, number, first, last, text])
    for line in log:
        print(line, file=sys.stderr)
    out = sys.stdout
    out.write("// GENERATED by scripts/texts/mead-stobaeus.py from three archive.org OCRs of\n")
    out.write("// G. R. S. Mead, Thrice-Greatest Hermes, vol. III (1906), \"Excerpts by\n")
    out.write("// Stobaeus\". Do not edit by hand: correct the generator (its FIXES list\n")
    out.write("// holds every correction made by hand) and run it again.\n//\n")
    out.write("// STOBAEUS_PARAGRAPHS: one row per numbered paragraph of Mead's, [excerpt\n")
    out.write("// (Mead's number), paragraph (0 = an excerpt he does not number), first page,\n")
    out.write("// last page, English]. His source notes, footnotes and commentary are left\n")
    out.write("// out. Titles, summaries and the rest are written in stobaeus.ts.\n\n")
    out.write("export const STOBAEUS_TITLES: Record<number, string> = ")
    out.write(json.dumps({str(k): v for k, v in TITLES.items()}, ensure_ascii=False, indent=2))
    out.write(";\n\nexport const STOBAEUS_PARAGRAPHS: [number, number, number, number, string][] = [\n")
    for row in rows:
        out.write("  " + json.dumps(row, ensure_ascii=False) + ",\n")
    out.write("];\n")


if __name__ == "__main__":
    main()
