"""Rudolf Steiner, The Submerged Continents of Atlantis and Lemuria (London, 1911),
the first English of his Lucifer-Gnosis articles "Aus der Akasha-Chronik"
(1904-08) -> steiner-text.ts.

THE BOOK. The Submerged Continents of Atlantis and Lemuria, Their History and
Civilization, Being Chapters from the Akashic Records, by Rudolf Steiner, Ph.D.
(Vienna). "Authorized translation from the German." London: Theosophical
Publishing Society, 1911 (title page, as transcribed in witness R; the verso
reads "Copyright 1911, Dr Weller Van Hook, in the United States of America" and
names "Max Gysi, Editor"). Its running head, and the short title it was sold
under ("Atlantis and Lemuria (3s 6d. net)", The Bookman, September 1911), is
"Atlantis and Lemuria". An American issue appeared the same year: "auth. tr.
from the German by Max Gysi. Chic., Rajput Press, '11" (Publishers Weekly,
21 October 1911). The title page names no translator; the trade listing names
Gysi, who edited the series. The page counts reported differ (202 pp. in the
Rudolf Steiner Archive's note, 204 pp. in an American advertisement of
January 1912, c. 241 p. in Publishers Weekly), and no page image of the book
was reached, so no page is cited.

It has ten chapters, all imported, in full:
   I  From the Akashic Records              VI  Humanity Before the Division of Sex
  II  Our Atlantean Forefathers            VII  The Beginnings of Sex Duality
 III  Transition of the Atlantean into     VIII  Man's First Ancestors
      the Aryan Root-Race                   IX  The First, or Polar, Race
  IV  The Lemurian Era                       X  The Second, or Hyperborean, Race
   V  Woman in the Third Root-Race
(The chapter titles are the ones the book's contents give, as transcribed in R
and as advertised in The Gates of Knowledge, 1912. The German chapters are
"Vorbemerkungen", "Unsere atlantischen Vorfahren", "Ubergang der vierten in
die funfte Wurzelrasse", "Die lemurische Rasse" (IV and V), "Die Trennung in
Geschlechter", "Die letzten Zeiten vor der Geschlechter-Trennung", "Die
hyperboraische und die polarische Epoche", "Anfang der gegenwartigen Erde:
Austritt der Sonne" and "Austritt des Mondes": the 1911 headings of IX and X
do not translate theirs.)

WITNESSES.

  R  The Rudolf Steiner Archive's e-text of the 1911 translation
     (rsarchive.org/Books/GA011/English/TPS1911/GA011_c01.html ... _c10.html;
     chapter V is the second half of _c04.html, from the anchor "Part-2"),
     read as saved in October 2026. A transcription of the 1911 book. THE BASE.
  S  The archive.org item ste-11_202012 ("THE SUBMERGED CONTINENTS OF ATLANTIS
     AND LEMURIA ... (1911)", uploaded December 2020): a PDF print-out of the
     same e-text as it stood when posted ("On-line since: 15th August, 2011"),
     read here through archive.org's OCR (Ste11_djvu.txt).
  B  The Bookman (London), vol. 40 no. 240, September 1911, p. 278 of the
     archive.org scan sim_bookman_the-bookman_1911-09_40_240 (OCR): a review
     that quotes four phrases of the book. Independent of R and S, but short.

ONLY ONE TRANSCRIPTION OF THE 1911 ENGLISH COULD BE REACHED. R and S are the
same transcription at two dates, not two copies of the book: S is not an
independent witness, and no majority of independent copies can be formed. No
scan of the 1911 book was reached: archive.org holds none (searched by title,
by creator and in full text for four distinctive sentences: every hit was S or
a later book quoting it); HathiTrust refused the request (403); Google Books
offers no full view of either issue; Project Gutenberg and Wikisource have no
copy; sacred-texts.com refused the request (403). So no reading could be
checked on a page image. What the comparison can do, and does:
  - R is compared word by word with S (difflib on letters and figures only).
    Every difference is printed to stderr and settled in REJECT (S is wrong:
    an OCR misreading of the print-out) or DISPUTED (it cannot be settled
    without the book). R's later editing of the e-text shows in one spelling
    ("palaeontology", S "paleontology") and in its paragraphing (below).
  - Errors R and S share (the e-text seems to have been made by OCR) were
    looked for by listing every word of the text not found in the archive's
    other English texts and by reading the whole text; the two found are
    corrected in FIXES, on the sense and on the German.
  - B's four quotations are asserted to stand in the result word for word.
  - The paragraph structure is checked against the German (the Archive's
    parallel pages, Compare_P1.php ... Compare_08.php?version=TPS, which set
    each German paragraph of the sixth German edition beside the 1911 English):
    every German paragraph of these chapters has a 1911 English counterpart
    except two. The last of "Die lemurische Rasse" the Archive marks "Not
    translated" (R's _c04.html paragraph [19]). The last of "Austritt des
    Mondes" (chapter X, [8]), which promises further instalments of the
    Akasha-Chronik, has in its place an English editor's note on An Outline
    of Occult Science. Nothing else was found missing.

PARAGRAPHING. R's paragraphs are numbered [1], [2] ... to match the German
edition's paragraphs, and to do so R joins paragraphs that S, the earlier
state of the same e-text, prints apart (for example, "But everything which
arises in time ..." in chapter I). The 1911 print's own paragraphing could
not be seen. Here S's paragraph breaks are restored inside R's paragraphs
wherever the two texts align on both sides of the break; a break S has at the
foot of a print-out page cannot be told from a page break and is not used.
Each section is still referred to by R's paragraph numbers, which are the only
stable numbers this text has.

WHAT IS LEFT OUT, AND HOW THE TEXT IS GIVEN.
  - The Archive's own matter: its description of the book, its permission
    note, its paragraph numbers and the "Not translated" placeholder.
  - Italic is not marked; "B.C." set in small capitals is given in capitals.
  - The book's three footnotes (all in chapter I: two advertisements for The
    Way of Initiation and Initiation and its Results, with their prices, and
    the publisher of Scott-Elliot's Story of Atlantis) are kept, each printed
    after the section's text as "[Footnote] ...".
  - The 1911 spellings are R's: "Âkâshic", "Âryan", "rôle", "to-day".
  - The closing note on An Outline of Occult Science (chapter X, R's [8]) is
    kept: it is in R and in S. S prints a row of stars before it (OCR "ook
    Ok"), which R does not; it is not reproduced.

Usage:
  python3 -I scripts/texts/steiner-atlantis.py RS_DIR Ste11_djvu.txt bookman_1911-09_djvu.txt \\
      > src/lib/timeline/texts/corpus/steiner-text.ts
where RS_DIR holds the saved pages GA011_c01.html ... GA011_c10.html (c05 is
not used: chapter V is in c04).
"""

import difflib
import html
import json
import os
import re
import sys

CHAPTERS = {
    1: "From the Âkâshic Records",
    2: "Our Atlantean Forefathers",
    3: "Transition of the Atlantean into the Âryan Root-Race",
    4: "The Lemurian Era",
    5: "Woman in the Third Root-Race",
    6: "Humanity Before the Division of Sex",
    7: "The Beginnings of Sex Duality",
    8: "Man's First Ancestors",
    9: "The First, or Polar, Race",
    10: "The Second, or Hyperborean, Race",
}

# The archive's sections: (chapter, section, first and last of R's paragraph
# numbers). Chapter V's paragraphs keep R's numbers in _c04.html (8-18).
SECTIONS = [
    (1, 1, 1, 2),
    (2, 1, 1, 4), (2, 2, 5, 10), (2, 3, 11, 16), (2, 4, 17, 22),
    (3, 1, 1, 4), (3, 2, 5, 8), (3, 3, 9, 12),
    (4, 1, 1, 3), (4, 2, 4, 7),
    (5, 1, 8, 12), (5, 2, 13, 18),
    (6, 1, 1, 6), (6, 2, 7, 8), (6, 3, 9, 9),
    (7, 1, 1, 5), (7, 2, 6, 10), (7, 3, 11, 12),
    (8, 1, 1, 2), (8, 2, 3, 7), (8, 3, 8, 10),
    (9, 1, 1, 4), (9, 2, 5, 8),
    (10, 1, 1, 3), (10, 2, 4, 5), (10, 3, 6, 8),
]

PAGE_OF_CHAPTER = {1: "c01", 2: "c02", 3: "c03", 4: "c04", 5: "c04", 6: "c06", 7: "c07", 8: "c08", 9: "c09", 10: "c10"}

# S's chapter headings, as its OCR reads them (the order is the book's).
S_HEADINGS = [
    (1, r"^Chapter I - From The Akashic Records\s*$"),
    (2, r"^Chapter II - Our Atlantean Forefathers\s*$"),
    (3, r"^Chapter III — Transition Of The Atlantean Into The Aryan\s*$"),
    (4, r"^Chapter IV — The Lemurian Era\s*$"),
    (5, r"^Chapter V — Woman In The Third Root-Race\s*$"),
    (6, r"^Chapter VI — Humanity Before The Division Of Sex\s*$"),
    (7, r"^Chapter VII — The Beginnings Of Sex Duality\s*$"),
    (8, r"^Chapter VIII — Man's First Ancestors\s*$"),
    (9, r"^Chapter IX — The First, Or Polar, Race\s*$"),
    (10, r"^Chapter X — The Second, Or Hyperborean, Race\s*$"),
]


# B: The Bookman, September 1911, quoting the book (the quotation marks are the
# reviewer's): (chapter, the Bookman's words, R's words). Each of R's must
# stand in the result and each of the Bookman's in its OCR, compared on
# letters only. Where they differ, the place is disputed: R is kept, since the
# page image could not be read, and the difference is recorded in DISPUTED.
BOOKMAN = [
    (1, "It is but a small part of prehistoric human experience which can be learnt by the methods of ordinary history",
     "It is but a small part of prehistoric human experience which can be learnt by the methods of ordinary history"),
    (1, "look back into a far more distant past than that which external history depicts",
     "look back into a far more distant past than that which external history depicts"),
    (1, "by direct spiritual perception describe those matters which history relates, in a far more trustworthy manner than is possible by the latter",
     "by direct spiritual perception, describe those matters which history relates in a far more trustworthy manner than is possible by the latter"),
    (4, "knowledge and mastery of natural forces were learnt by immediate perception",
     "knowledge and mastery of natural forces was learnt by immediate perception"),
]

# Places where S differs from R and S is wrong: (chapter, R's words, S's words,
# why), compared as letters-only keys. Each must be met at least once.
REJECT = [
    (3, "own thoughts,", "ownthoughts,", "S's OCR runs two words together."),
    (9, "a new", "anew", "S's OCR runs two words together ('anew group of animals')."),
    (4, "", "ok ok", "S's OCR of a row of stars marking a break in the chapter (R marks it with a rule); not text."),
    (10, "", "ook Ok", "S's OCR of a row of stars before the closing note on An Outline of Occult Science (R has none); not text."),
]

# Readings that could not be settled: no page image of the 1911 book was
# reached. R's reading is kept; the other is recorded here and in the passage
# notes. (chapter, R's reading, the other reading, where the other comes from.)
DISPUTED = [
    (1, "palaeontology", "paleontology", "S, the 2011 state of the same e-text"),
    (4, "mastery of natural forces was learnt", "mastery of natural forces were learnt", "The Bookman's quotation (September 1911)"),
]

# Corrections by hand to R: (chapter, old, new, expected count, why). R and S
# agree on both readings, so they are errors of the e-text as first made (it
# appears to have been made by OCR from the print), not of the later editing;
# each is corrected on the sense and on the German of the sixth edition, and
# neither could be checked on a page image of the 1911 book.
FIXES = [
    (5, "what had been clone by the leaders", "what had been done by the leaders", 1,
     "'clone' is an OCR misreading of 'done' (cl for d). The German reads 'durch das, was die Führer getan hatten' ('by what the leaders had done')."),
    (10, "is, of course, on which merely approaches", "is, of course, one which merely approaches", 1,
     "A letter dropped: the sentence needs 'one which'. The German reads 'Nur ist diese Vorstellung natürlich eine solche, die sich der Wirklichkeit ganz äußerlich nähert'."),
]

NOTE_OPEN, NOTE_CLOSE = "⟦", "⟧"
SENTENCE_END = re.compile(r"[.!?:][”’\")\]]*$")


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower()
    for a, b in (("â", "a"), ("ô", "o"), ("é", "e"), ("è", "e"), ("ê", "e"), ("ä", "a"), ("ö", "o"), ("ü", "u"), ("æ", "ae"), ("œ", "oe")):
        w = w.replace(a, b)
    return re.sub(r"[^a-z0-9]", "", w)


def clean(text):
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


# --- R: the Rudolf Steiner Archive's pages ------------------------------------


def r_paragraphs(rsdir, page):
    """[(number, text)] of one saved page; footnotes inline between ⟦ and ⟧."""
    raw = open(os.path.join(rsdir, f"GA011_{page}.html"), encoding="utf-8").read()
    body = raw[raw.index('<div class="contentBegins">') : raw.index("<!-- End of Content -->")]
    out = []
    for m in re.finditer(r"<p[^>]*>(.*?)</p>", body, re.S):
        inner = m.group(1)
        num = re.search(r'<span class="paragraphMarker">\[ (\d+) \]', inner)
        n = int(num.group(1))
        if re.search(r'<span class="paragraphMarker">\[ \d+ \] Not translated</span>', inner):
            out.append((n, "Not translated"))
            continue
        inner = re.sub(r'<span class="paragraphMarker">.*?</span>', "", inner, count=1, flags=re.S)
        inner = re.sub(
            r'<sup class="footnote">\d+<span class="footnoteText">(.*?)</span></sup>',
            lambda fm: f" {NOTE_OPEN}{re.sub(r'<[^>]+>', '', fm.group(1))}{NOTE_CLOSE} ",
            inner,
            flags=re.S,
        )
        inner = inner.replace("<b>V. Woman in the Third Root-Race:</b><br>", "")
        out.append((n, clean(re.sub(r"<[^>]+>", "", inner))))
    return out


def r_chapter(rsdir, chapter):
    paras = r_paragraphs(rsdir, PAGE_OF_CHAPTER[chapter])
    if chapter == 4:
        paras = [p for p in paras if p[0] <= 7]
    if chapter == 5:
        paras = [p for p in paras if p[0] >= 8]
    for n, text in paras:
        if text == "Not translated":
            log(f"  R chapter {chapter} [{n}]: 'Not translated' (a German paragraph the 1911 English lacks); left out")
    return [p for p in paras if p[1] != "Not translated"]


# --- S: the 2011 print-out, through archive.org's OCR --------------------------

HEADER = re.compile(r"\n[ \t]*\n+RUDOLF STEINER — ATLANTIS AND LEMURIA[ \t]*\n[ \t]*\n+")


def s_chapters(path):
    """{chapter: [paragraph text]}."""
    raw = open(path, encoding="utf-8").read()
    # The body starts at the second "Chapter I" heading (the first is S's contents).
    starts = [m.start() for m in re.finditer(r"^Chapter I - From The Akashic Records\s*$", raw, re.M)]
    raw = raw[starts[1]:]
    # A print-out page header inside a paragraph: the paragraph runs on. (A
    # paragraph that ends at the foot of a page cannot be told apart.)
    raw = HEADER.sub("\n", raw)
    bounds = []
    for ch, pat in S_HEADINGS:
        m = re.search(pat, raw, re.M)
        assert m, pat
        bounds.append((ch, m.start(), m.end()))
    out = {}
    for i, (ch, _, end) in enumerate(bounds):
        stop = bounds[i + 1][1] if i + 1 < len(bounds) else len(raw)
        part = raw[end:stop]
        if ch == 3:
            part = re.sub(r"^\s*Root-Race\s*\n", "", part)  # the heading's second line
        paras = []
        for p in re.split(r"\n[ \t]*\n+", part):
            p = re.sub(r"\s+", " ", p).strip()
            if not p:
                continue
            p = re.sub(r"\s*—\s*", "—", p)  # the print-out spaces its dashes
            p = re.sub(r"(\w)- (?!und\b|and\b)(\w)", r"\1-\2", p)  # a compound broken at its hyphen
            p = re.sub(r" \)", ")", p)
            paras.append(p)
        out[ch] = paras
    return out


# --- the comparison -------------------------------------------------------------


def compare(chapter, r_paras, s_paras, rejected):
    """The chapter as [(R paragraph number of each word, words)], paragraphed as S is."""
    r_words, r_num, r_end = [], [], set()
    for num, text in r_paras:
        for w in text.split():
            r_words.append(w)
            r_num.append(num)
        r_end.add(len(r_words) - 1)
    s_words, s_end = [], set()
    for p in s_paras:
        s_words.extend(p.split())
        s_end.add(len(s_words) - 1)
    rk = [key(w) for w in r_words]
    sk = [key(w) for w in s_words]
    sm = difflib.SequenceMatcher(None, rk, sk, autojunk=False)
    s_to_r = {}
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for d in range(i2 - i1):
                s_to_r[j1 + d] = i1 + d
            continue
        pair = (chapter, "".join(rk[i1:i2]), "".join(sk[j1:j2]))
        if pair[1] == pair[2] == "":
            continue  # punctuation only (a bracket S sets apart)
        if pair in rejected:
            rejected[pair] += 1
            log(f"  rejected ch {chapter}: S {' '.join(s_words[j1:j2])!r} for R {' '.join(r_words[i1:i2])!r}")
            continue
        log(f"  DIFF ch {chapter}: R {' '.join(r_words[i1:i2])!r} | S {' '.join(s_words[j1:j2])!r}")
    r_to_s = {r: s for s, r in s_to_r.items()}
    # Where a paragraph ends: where S ends one, if R's words on both sides of
    # the break are matched to consecutive S words; otherwise where R does.
    ends = set()
    for i in range(len(r_words) - 1):
        a, b = r_to_s.get(i), r_to_s.get(i + 1)
        aligned = a is not None and b is not None and b == a + 1
        if aligned:
            if a in s_end and not SENTENCE_END.search(r_words[i]):
                log(f"  break ch {chapter} [{r_num[i]}]: S breaks after {r_words[i]!r} inside a sentence (a print-out artefact); not used")
                if i in r_end:
                    ends.add(i)
            elif a in s_end:
                ends.add(i)
                if i not in r_end:
                    log(f"  break ch {chapter} [{r_num[i]}]: S's paragraph break after {r_words[i]!r} restored")
            elif i in r_end:
                log(f"  break ch {chapter} [{r_num[i]}]→[{r_num[i + 1]}]: R's break after {r_words[i]!r}, where S runs on, removed")
        elif i in r_end:
            ends.add(i)
            log(f"  break ch {chapter} [{r_num[i]}]: R's break after {r_words[i]!r} kept (S not aligned there)")
    ends.add(len(r_words) - 1)
    paras, cur, nums = [], [], []
    for i, w in enumerate(r_words):
        cur.append(w)
        nums.append(r_num[i])
        if i in ends:
            paras.append((nums, cur))
            cur, nums = [], []
    return paras


def to_text(words):
    text = " ".join(words)
    notes = re.findall(f"{NOTE_OPEN}(.*?){NOTE_CLOSE}", text)
    text = re.sub(f" ?{NOTE_OPEN}.*?{NOTE_CLOSE} ?", " ", text)
    text = re.sub(r" ([,.;:])", r"\1", text).strip()
    return text, notes


def sections_of(chapter, paras):
    out = []
    for ch, sec, first, last in SECTIONS:
        if ch != chapter:
            continue
        body, notes = [], []
        for nums, words in paras:
            inside = [first <= n <= last for n in nums]
            if not any(inside):
                continue
            assert all(inside), f"chapter {chapter} section {sec}: a paragraph of S runs across the section's edge ({nums[0]}–{nums[-1]})"
            text, fn = to_text(words)
            body.append(text)
            notes.extend(fn)
        text = "\n\n".join(body)
        for f in notes:
            text += "\n\n[Footnote] " + f.strip()
        out.append((sec, first, last, text))
    return out


def apply_fixes(chapter, text, applied):
    for n, (ch, old, new, _count, _why) in enumerate(FIXES):
        if ch != chapter or old not in text:
            continue
        applied[n] += text.count(old)
        text = text.replace(old, new)
        log(f"  fix ch {chapter}: {old!r} -> {new!r}")
    return text


def main():
    rsdir, s_path, bookman_path = sys.argv[1], sys.argv[2], sys.argv[3]
    s = s_chapters(s_path)
    applied = [0] * len(FIXES)
    rejected = {(ch, "".join(key(w) for w in r.split()), "".join(key(w) for w in sr.split())): 0 for ch, r, sr, _ in REJECT}
    sections = []
    for chapter in CHAPTERS:
        r_paras = r_chapter(rsdir, chapter)
        paras = compare(chapter, r_paras, s[chapter], rejected)
        log(f"chapter {chapter}: {len(r_paras)} R paragraphs, {len(s[chapter])} S paragraphs, {len(paras)} here")
        for sec, first, last, text in sections_of(chapter, paras):
            text = apply_fixes(chapter, text, applied)
            sections.append({"chapter": chapter, "section": sec, "paragraphs": f"{first}" if first == last else f"{first}–{last}", "text": text})
    for (ch, old, _new, count, _why), n in zip(FIXES, applied):
        assert n == count, ("FIXES entry applied the wrong number of times", ch, old, n)
    for pair, n in rejected.items():
        assert n >= 1, ("REJECT entry not met", pair)
    bookman = key(open(bookman_path, encoding="utf-8").read())
    for chapter, theirs, ours in BOOKMAN:
        whole = key(" ".join(x["text"] for x in sections if x["chapter"] == chapter))
        assert key(ours) in whole, ("not in the text", ours)
        assert key(theirs) in bookman, ("not in the Bookman's OCR", theirs)
        log(f"  Bookman 1911 {'agrees' if key(theirs) == key(ours) else 'DIFFERS'}: {theirs!r}")
    for chapter, ours, other, _ in DISPUTED:
        whole = " ".join(x["text"] for x in sections if x["chapter"] == chapter)
        assert ours in whole, ours
        log(f"  disputed ch {chapter}: kept {ours!r}, not {other!r}")
    for x in sections:
        assert "  " not in x["text"] and NOTE_OPEN not in x["text"], x["chapter"]
    assert len(sections) == len(SECTIONS)
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/steiner-atlantis.py from the Rudolf Steiner Archive's\n")
    w("// e-text of The Submerged Continents of Atlantis and Lemuria (London, 1911),\n")
    w("// compared word by word with an earlier state of the same e-text (archive.org\n")
    w("// ste-11_202012) and with the quotations of The Bookman (September 1911). Only\n")
    w("// one transcription of the 1911 English could be reached, and no page image.\n")
    w("// Do not edit by hand: correct the generator (its FIXES list holds every\n")
    w("// correction made by hand) and run it again.\n\n")
    w("export type SteinerSection = {\n  /** The 1911 book's chapter, I–X. */\n  chapter: number;\n  /** The archive's section within the chapter. */\n  section: number;\n  /** The Rudolf Steiner Archive's paragraph numbers ([1], [2] ...) the section covers. */\n  paragraphs: string;\n  /** Paragraphs separated by blank lines; footnotes after them as \"[Footnote] ...\". */\n  text: string;\n};\n\n")
    w("export const STEINER_CHAPTER_TITLES: Record<number, string> = {\n")
    for ch, title in CHAPTERS.items():
        w(f"  {ch}: {json.dumps(title, ensure_ascii=False)},\n")
    w("};\n\nexport const STEINER_SECTIONS: SteinerSection[] = [\n")
    for x in sections:
        w(f"  {{ chapter: {x['chapter']}, section: {x['section']}, paragraphs: {json.dumps(x['paragraphs'], ensure_ascii=False)}, text: {json.dumps(x['text'], ensure_ascii=False)} }},\n")
    w("];\n")


if __name__ == "__main__":
    main()
