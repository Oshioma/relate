"""Stage 29: Claudius Ptolemy, Tetrabiblos (Apotelesmatika), in Frank Egleston
Robbins's English (Loeb Classical Library, "Manetho. Ptolemy, Tetrabiblos",
1940).

Writes src/lib/timeline/texts/corpus/ptolemy-tetrabiblos-text.ts: the 61
chapters of the four books, in Robbins's book and chapter numbering, each with
its heading and the Loeb pages it runs over, and the few of Robbins's notes
that are imported.

    python3 -I scripts/texts/ptolemy-tetrabiblos.py THAYER_DIR OCR_DIR \
        > src/lib/timeline/texts/corpus/ptolemy-tetrabiblos-text.ts

Everything was fetched with the User-Agent
"relate-archive-research (repo Oshioma/relate)".

THE COPY TEXT
  R  Bill Thayer's LacusCurtius transcription of the Loeb translation,
     https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ptolemy/Tetrabiblos/
     in twelve pages, saved in THAYER_DIR as 1A.html (I.1-3), 1B.html
     (I.4-24), 2A.html (II.1-3), 2B.html (II.4-9), 2C.html (II.10-13),
     3A.html (III.1-9), 3B.html (III.10), 3C.html (III.11-12), 3D.html
     (III.13-14), 4A.html (IV.1-4), 4B.html (IV.5-7) and 4C.html (IV.8-10).
     Thayer typed the text himself and marks the Loeb pages and Robbins's note
     numbers (numbered through each book, as Thayer numbers them; Robbins
     numbers his footnotes page by page). His home page for the work states:
     "It is now in the public domain pursuant to the 1978 revision of the
     U. S. Copyright Code, since the copyright was not renewed at the
     appropriate time, which would have been that year or the year before."
     That is a United States public-domain status only.

THE WITNESSES (archive.org OCR, djvu.txt, in OCR_DIR)
  T  tor.txt     https://archive.org/details/manethowithengli00maneuoft
                 a University of Toronto (Robarts) copy of the Loeb volume
                 "Manetho ... Ptolemy, Tetrabiblos", reprint of 1964 ("First
                 printed 1940, Reprinted 1948, 1956, 1964" as its OCR reads);
                 its page images were used for all the proofreading below.
  D  dli.txt     https://archive.org/details/dli.ernet.471573
                 the same volume, a Digital Library of India copy (1964).
  L  l350.txt    https://archive.org/details/L350ManethoHistoryOfEgyptPtolemyTetrabiblos
                 the same volume (1964), a scan of unstated origin in the
                 folkscanomy collection (an identical item, ..._201312, is the
                 same file and is not counted twice).
  F  fringe.txt  https://archive.org/details/ptolemy-tetrabiblos-four-books-of-the-influence-of-the-stars
                 a retyped or cleaned electronic copy of Robbins's English (its
                 opening is Ashmand's Book I proem, then Robbins); its origin is
                 not stated. It is not Thayer's text (it reads "philosophical"
                 with the print at I.1 where Thayer has "physical").
  The reprints are photographic: the type and pages are those of 1940.

METHOD
  1. parse_thayer(): Thayer's HTML is cut into the 61 chapters (book from the
     file, chapter from his anchors), paragraphs and words, keeping his markers
     for the Loeb pages (PG) and Robbins's note numbers (RF). His mouse-over
     comments and corrections, his marginal pages of Camerarius's second
     edition (approximate, he says, and of the Greek), and his own notes are
     kept out; Robbins's notes are read separately, without Thayer's own
     additions to them.
  2. vote(): Thayer's words are aligned with each of the four witnesses,
     chapter by chapter. Wherever at least three of the four agree on a
     reading other than Thayer's (letters, a stop after a word, or a
     diacritic), the place is flagged; so is any stretch the aligner could not
     anchor in three ("skipped"). The two tables of terms (I.20 and I.21) are
     left out of the vote, since the OCRs cannot read the planetary signs, and
     were read on the page images instead (TABLES_CHECKED).
  3. Every flag was looked at on the page image of T and has an entry in
     DECISIONS: "print" (the printed reading is taken) or "thayer" (Thayer's
     reading stands). The script stops if a flag has no decision or a
     decision is not used. TAKEN_COUNT pins the number of printed readings
     taken.
  4. FIXES holds every correction made by hand outside the vote (each one
     checked on the page image of T).
  5. Curly quotes; check_units() insists on the 61 chapters in order, every
     chapter with a Loeb page, and no straight quote, stray mark or double
     space.

LAYOUT
  - Robbins's chapter headings are kept as each unit's heading, not in its
    text.
  - The two tables of terms are given one row to a line: the sign, a colon,
    then each planet's sign and its number of degrees, separated by commas
    (the Loeb prints them as columns).
  - The headings inside a chapter (the titles of the two tables; the two
    alternative conclusions at the end of IV.10, "Conclusion according to
    ...") are kept as paragraphs of their own.
  - Robbins's footnote marks are not reproduced.

WHAT IS NOT IMPORTED (listed in the corpus file)
  Robbins's introduction, his Greek text (the left-hand pages)
  and its apparatus, and all but the few notes in IMPORTED_NOTES; Thayer's
  own notes and comments.
"""

import difflib
import html
import re
import sys
import unicodedata
from collections import Counter


def log(*a):
    print(*a, file=sys.stderr)


PAGES = ["1A", "1B", "2A", "2B", "2C", "3A", "3B", "3C", "3D", "4A", "4B", "4C"]
CHAPTERS_PER_BOOK = {1: 24, 2: 13, 3: 14, 4: 10}

# ---------------------------------------------------------------------------
# 1. THAYER'S TRANSCRIPTION
# ---------------------------------------------------------------------------


def clean_note(t):
    t = re.sub(r"<DIV CLASS=\"mynote(Wide)?\">.*?</DIV>", "", t, flags=re.S)
    t = re.sub(r"<A CLASS=\"(correction|comment)\".*?</A>", "", t, flags=re.S)
    t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
    t = re.sub(r'<SPAN CLASS="pagenum">[^<]*</SPAN>', "", t)
    t = re.sub(r'<SPAN CLASS="emend">(.*?)</SPAN>', "\\1", t, flags=re.S)
    t = re.sub(r"</?(I|SPAN|A|B|EM|SUP|SUB)\b[^>]*>", "", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t).replace("‑", "-").replace("\u2060", "").replace("\xad", "")
    return re.sub(r"\s+", " ", t).strip()


def parse_thayer(src):
    notes = {}
    chapters = []
    for f in PAGES:
        book = int(f[0])
        s = open(f"{src}/{f}.html", encoding="utf-8").read()
        start = s.index("<H1>")
        end = s.index('<HR CLASS="endnotes"')
        tail = s[end:]
        cut = tail.find('<A ID="endnotes_T"', 10)
        robbins_notes = tail if cut < 0 else tail[:cut]
        for m in re.finditer(r'<A CLASS="note" ID="note(\d+)"[^>]*>\s*\d+\s*</A>(.*?)(?=<P CLASS="ivy">|<HR CLASS="endnotes"|<TABLE CLASS="footer"|$)', robbins_notes, re.S):
            notes[(book, int(m.group(1)))] = clean_note(m.group(2))
        b = s[start:end]
        b = re.sub(r"<!--.*?-->", "", b, flags=re.S)
        b = re.sub(r"<A CLASS=\"(correction|comment)\".*?</A>", "", b, flags=re.S)
        b = re.sub(r'<A CLASS="ref" ID="ref(\d+)"[^>]*>.*?</A>', "\x01RF\\1\x02", b, flags=re.S)
        # Thayer's own note marks (lettered, for his notes at the foot of the page)
        b = re.sub(r'<A CLASS="ref"[^>]*>.*?</A>', "", b, flags=re.S)
        b = re.sub(r"&#8288;|&shy;", "", b)
        b = re.sub(r'<SPAN CLASS="emend">(.*?)</SPAN>', "\x01EMEND\\1\x02", b, flags=re.S)
        # Camerarius's pages: <SPAN CLASS="Camerarius">Cam.<SPAN ...>2</SPAN> p1</SPAN> or p84 or 187
        b = re.sub(r'<SPAN CLASS="Camerarius">(?:[^<]|<SPAN[^>]*>[^<]*</SPAN>)*</SPAN>', "", b)
        b = re.sub(r'<SPAN CLASS="pagenum">\s*p(\d+)\s*</SPAN>', "\x01PG\\1\x02", b)
        b = re.sub(r'<SPAN CLASS="pagenum">[^<]*</SPAN>', "", b)
        b = re.sub(r"<H1>.*?</H1>", lambda m: "".join(re.findall(r"\x01PG\d+\x02", m.group(0))), b, flags=re.S)

        def h2(m):
            inner = m.group(0)
            pgs = "".join(re.findall(r"\x01PG\d+\x02", inner))
            ch = re.search(r'<A NAME="(\d+)"></A>', inner)
            title = re.sub(r"</?(I|SPAN|A|B)\b[^>]*>", "", inner)
            title = re.sub(r"<[^>]+>|\x01[^\x02]*\x02", " ", title)
            title = html.unescape(re.sub(r"\s+", " ", title)).strip()
            if ch:
                return pgs + f"\x01CH{ch.group(1)}|{title}\x02"
            # a heading inside a chapter (IV.10's two conclusions): a paragraph
            return pgs + "\x01PARA\x02" + title + "\x01PARA\x02"

        b = re.sub(r"<H2[^>]*>.*?</H2>", h2, b, flags=re.S)
        b = re.sub(r"<H3[^>]*>(.*?)</H3>", "\x01PARA\x02\\1\x01PARA\x02", b, flags=re.S)
        # tables of terms: one row a line, "Sign: ♃ 6, ♀ 6, ..."
        def table(m):
            rows = []
            for r in re.findall(r"<TR[^>]*>(.*?)</TR>", m.group(1), re.S):
                cells = [html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c))).strip() for c in re.findall(r"<TD[^>]*>(.*?)</TD>", r, re.S)]
                cells = [c for c in cells if c]
                if cells:
                    rows.append(cells[0] + ": " + ", ".join(cells[1:]) if len(cells) > 1 else cells[0])
            return "\x01TABLE" + "\x03".join(rows) + "\x02"

        b = re.sub(r"<TABLE>(.*?)</TABLE>", table, b, flags=re.S)
        b = re.sub(r"<DIV[^>]*>|</DIV>", " ", b)
        b = re.sub(r"<IMG[^>]*>", " ", b)
        b = re.sub(r"<P[^>]*>", "\x01PARA\x02", b)
        b = re.sub(r"<BR>", " ", b)
        b = re.sub(r"</?(I|SPAN|A|B|EM|SUP|SUB)\b[^>]*>", "", b, flags=re.S)
        b = re.sub(r"<[^>]+>", " ", b)
        b = html.unescape(b).replace("‑", "-")

        cur, paras, para, pending = None, [], [], []
        for ev in re.split(r"(\x01[^\x02]*\x02)", b):
            if ev.startswith("\x01"):
                tag = ev[1:-1]
                if tag.startswith("CH"):
                    if para:
                        paras.append(para)
                    para = []
                    if cur is not None:
                        cur["paras"] = paras
                        chapters.append(cur)
                    n, title = tag[2:].split("|", 1)
                    cur = {"book": book, "n": int(n), "title": title, "markers": [mk + [0, 0] for mk in pending]}
                    pending, paras = [], []
                elif tag[:2] in ("PG", "RF"):
                    mk = [tag[:2], tag[2:]]
                    if cur is None:
                        pending.append(mk)
                    else:
                        cur["markers"].append(mk + [len(paras), len(para)])
                elif tag == "PARA":
                    if para:
                        paras.append(para)
                    para = []
                elif tag.startswith("TABLE"):
                    if para:
                        paras.append(para)
                    para = []
                    paras.append({"table": tag[5:].split("\x03")})
                elif tag.startswith("EMEND"):
                    for w in tag[5:].split():
                        para.append("\x04" + w)
                continue
            para.extend(ev.split())
        if para:
            paras.append(para)
        cur["paras"] = paras
        chapters.append(cur)
    return chapters, notes


# ---------------------------------------------------------------------------
# 2. THE VOTE
# ---------------------------------------------------------------------------

OCR = {"T": "tor.txt", "D": "dli.txt", "L": "l350.txt", "F": "fringe.txt"}


def key(w):
    w = unicodedata.normalize("NFKD", w.lower())
    w = "".join(ch for ch in w if not unicodedata.combining(ch))
    w = w.replace("æ", "ae").replace("œ", "oe")
    return re.sub(r"[^a-z0-9]", "", w)


def stop(w):
    m = re.search(r"([.,;:!?])[^A-Za-z0-9]*$", w)
    return m.group(1) if m else ""


def ocr_tokens(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    s = re.sub(r"([A-Za-z])[-¬]\s*\n\s*([a-z])", r"\1\2", s)
    toks = []
    for w in s.split():
        if not re.search(r"[A-Za-z0-9]", w):
            if re.fullmatch(r"[.,;:!?]+[’”\"']*", w) and toks:
                toks[-1] += w
            continue
        toks.append(re.sub(r"^[^A-Za-z0-9(\[‘“\"']+", "", w))
    return toks


def is_word(w):
    return isinstance(w, str) and w != "\n" and re.search(r"[A-Za-z0-9]", w.lstrip("\x04"))


def thayer_tokens(chapters):
    T = []
    for ci, c in enumerate(chapters):
        # the heading is voted on too (the OCRs read it in the run of the text),
        # with its number, and "BOOK II" etc. before a book's first chapter;
        # these only steer the alignment (p -2) and are not printed from here
        if c["n"] == 1 and c["book"] > 1:
            for w in ("BOOK", ["I", "II", "III", "IV"][c["book"] - 1] + "."):
                T.append({"ci": ci, "ch": (c["book"], c["n"]), "p": -2, "i": 0, "w": w, "ref": False})
        T.append({"ci": ci, "ch": (c["book"], c["n"]), "p": -2, "i": 0, "w": c["title"].split()[0], "ref": False})
        c["head"] = c["title"].split()[1:]
        for wi, w in enumerate(c["head"]):
            T.append({"ci": ci, "ch": (c["book"], c["n"]), "p": -1, "i": wi, "w": w, "ref": False})
        refs_at = {(m[2], m[3]) for m in c["markers"] if m[0] == "RF"}
        for pi, p in enumerate(c["paras"]):
            if isinstance(p, dict):
                continue
            for wi, w in enumerate(p):
                if not is_word(w):
                    continue
                T.append({"ci": ci, "ch": (c["book"], c["n"]), "p": pi, "i": wi, "w": w.lstrip("\x04"), "ref": (pi, wi + 1) in refs_at})
    return T


def anchors(bk, xk):
    sm = difflib.SequenceMatcher(None, bk, xk, autojunk=False)
    at = [None] * (len(bk) + 1)
    for op, i1, i2, j1, _ in sm.get_opcodes():
        if op == "equal":
            for d in range(i2 - i1 + 1):
                at[i1 + d] = j1 + d
    at[0], at[len(bk)] = 0, len(xk)
    return at


def vote(T, ocr_dir, need=3):
    tk = [key(t["w"]) for t in T]
    O = {s: ocr_tokens(f"{ocr_dir}/{f}") for s, f in OCR.items()}
    chs = sorted({t["ci"] for t in T})
    first = {ch: next(i for i, t in enumerate(T) if t["ci"] == ch) for ch in chs}
    ATS = {}
    for sig in OCR:
        xk = [key(w) for w in O[sig]]
        at = [None] * (len(tk) + 1)
        idx = {}
        for j in range(len(xk) - 2):
            idx.setdefault((xk[j], xk[j + 1], xk[j + 2]), []).append(j)

        def find(i):
            hits = Counter()
            for d in range(12):
                for j in idx.get(tuple(tk[i + d:i + d + 3]), []):
                    hits[j - d] += 1
            if hits and hits.most_common(1)[0][1] >= 3:
                return hits.most_common(1)[0][0]
            return None

        starts = {ch: find(first[ch]) for ch in chs}
        for ci, ch in enumerate(chs):
            i1 = first[ch]
            i2 = first[chs[ci + 1]] if ci + 1 < len(chs) else len(tk)
            j1 = starts[ch]
            if j1 is None:
                log("chapter not found", sig, T[i1]["ch"])
                continue
            j2 = starts.get(chs[ci + 1]) if ci + 1 < len(chs) else None
            span = int(2.2 * (i2 - i1)) + 400
            if j2 is None or not (j1 < j2 <= j1 + span):
                j2 = min(len(xk), j1 + span)
            sub = anchors(tk[i1:i2], xk[j1:j2])
            for d, v in enumerate(sub[:-1]):
                if v is not None:
                    at[i1 + d] = j1 + v
            if sub[i2 - i1 - 1] is not None and tk[i2 - 1] == xk[j1 + sub[i2 - i1 - 1]]:
                at[i2] = j1 + sub[i2 - i1 - 1] + 1
        ATS[sig] = at
    sigs = list(OCR)
    bounds = [b for b in range(len(tk) + 1) if sum(ATS[s][b] is not None for s in sigs) >= 3]
    flags, skipped = [], []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = T[b1:b2]
        segk = "".join(tk[b1:b2])
        present = [s for s in sigs if ATS[s][b1] is not None and ATS[s][b2] is not None
                   and 0 <= ATS[s][b2] - ATS[s][b1] <= 2 * (b2 - b1) + 6]
        if len(present) < 3:
            skipped.append((b1, b2))
            continue
        rd = {s: O[s][ATS[s][b1]:ATS[s][b2]] for s in present}
        rk = {s: "".join(key(w) for w in rd[s]) for s in present}
        c = Counter(v for v in rk.values() if v != segk)
        best = c.most_common(1)[0] if c else None
        if best and best[1] >= need:
            src = next(s for s in present if rk[s] == best[0])
            flags.append({"kind": "letters", "ch": T[b1]["ch"], "at": (b1, b2), "thayer": " ".join(t["w"] for t in seg), "ocr": " ".join(rd[src]), "who": "".join(s for s in present if rk[s] == best[0])})
            continue
        if len(seg) == 1:
            def acc(w):
                return "".join(ch for ch in w if ch.isalpha() and not ch.isascii())
            da = Counter(bool(acc(rd[s][-1])) for s in present if rd[s] and rk[s] == segk)
            if da.get(not bool(acc(seg[0]["w"])), 0) >= 3:
                flags.append({"kind": "accent", "ch": seg[0]["ch"], "at": (b1, b2), "thayer": seg[0]["w"], "ocr": rd[present[0]][-1], "who": ""})
            st = Counter(stop(rd[s][-1]) if rd[s] and rk[s] == segk else None for s in present)
            st.pop(None, None)
            ts = stop(seg[0]["w"])
            # an OCR reads Robbins's superior note mark as "!" or "?"; a heading's
            # stops are not voted on
            if seg[0]["ref"]:
                st.pop("!", None)
                st.pop("?", None)
            if seg[0]["p"] < 0:
                st.clear()
            cand = [(v, n) for v, n in st.items() if v != ts]
            if cand:
                v, n = max(cand, key=lambda x: x[1])
                if n >= need:
                    flags.append({"kind": "stop", "ch": seg[0]["ch"], "at": (b1, b2), "thayer": seg[0]["w"], "ocr": v or "(none)", "who": ""})
    XS = {s: " " + " ".join(key(w) for w in O[s]) + " " for s in sigs}
    for b1, b2 in skipped:
        p1 = " " + " ".join(tk[max(0, b1 - 3):b2]) + " "
        p2 = " " + " ".join(tk[b1:min(len(tk), b2 + 3)]) + " "
        if sum(1 for s in sigs if p1 in XS[s] or p2 in XS[s]) < 3:
            flags.append({"kind": "skipped", "ch": T[b1]["ch"], "at": (b1, b2), "thayer": " ".join(t["w"] for t in T[b1:b2]), "ocr": "?", "who": ""})
    return flags


# ---------------------------------------------------------------------------
# 3. DECISIONS: one for every flag, each checked on the page image of T
#    ((book, chapter), kind, Thayer's words) -> ("print", the printed words) or ("thayer", why)
# ---------------------------------------------------------------------------

#    Where the same words are flagged twice in a chapter, the second key ends "#2".
#    The witnesses are of the 1964 reprint; where Thayer notes a reading of
#    "the Loeb edition" (1940), it is the reprint's too (IV.5 "or with"; the
#    spelling "succedant" in IV.6-7), which bears out that the reprint is
#    photographic.

DECISIONS = {
    # ---- letters: Thayer's slips of the keyboard or of the eye
    ((1, 1), "letters", "Of"): ("thayer", "small capitals 'OF', read 'Or' by three OCRs"),
    ((1, 1), "letters", "physical"): ("print", "philosophical"),  # "in a properly philosophical way"
    ((1, 2), "letters", "all"): ("print", "all the"),
    ((1, 3), "letters", "further"): ("print", "future"),  # "if future happenings to men are not known"
    ((1, 3), "letters", "a"): ("print", ""),  # "in the case of defensive practice"
    ((1, 4), "letters", "and"): ("print", "and the"),  # "to the sun and the moon"
    ((1, 7), "letters", "the"): ("print", ""),  # "to the warmth of day"
    ((1, 7), "letters", "the", "#2"): ("print", ""),  # "to the moisture of night"
    ((1, 9), "letters", "Venus,"): ("print", "Venus and,"),  # "like that of Venus and, to a less degree, of Saturn"
    ((1, 12), "letters", "assign"): ("print", "assigned"),
    ((1, 17), "letters", "terms,"): ("print", "terms, and"),  # "exaltations, terms, and the like"
    ((1, 17), "letters", "diametral"): ("print", "diametrical"),
    # Thayer's line skip: "of eastern constitution, because of Saturn,
    # but by admixture north-eastern, because ..."
    ((1, 18), "letters", "constitution,"): ("print", "constitution, because of Saturn, but by admixture north-eastern,"),
    ((1, 19), "letters", "to"): ("print", "to the"),  # "opposite to the sun"
    ((1, 19), "letters", "the"): ("print", ""),  # "coming to conjunction"
    ((1, 20), "letters", "this"): ("print", "this same"),
    ((1, 21), "letters", "those"): ("print", "these"),  # "the degrees of these terms"
    ((1, 21), "letters", "of"): ("print", "or"),  # "or their number"
    ((1, 22), "letters", "as"): ("print", "as the"),  # "as the twelfth part of a sign"
    ((1, 23), "letters", "\"rejoice\""): ("thayer", "the OCRs read the note mark as 1"),
    ((1, 23), "letters", "signs"): ("print", "stars"),  # "with the stars of the same"
    ((2, 2), "letters", "the"): ("print", ""),  # "oppressed by heat"
    ((2, 3), "letters", "Capricorn"): ("print", "Capricornus"),
    ((2, 3), "letters", "Capricorn,"): ("print", "Capricornus,"),
    ((2, 3), "letters", "though"): ("print", "through"),
    ((2, 3), "letters", "treacherous,"): ("print", "treachery,"),
    ((2, 6), "letters", "lies"): ("print", "lie"),
    ((2, 6), "letters", "deduced"): ("print", "deduce"),
    ((2, 7), "letters", "recessions,"): ("print", "recessions, and"),
    ((2, 8), "letters", "changes"): ("print", "change"),
    ((2, 8), "letters", "the"): ("print", "their"),  # "either of their luminaries"
    ((2, 10), "letters", "who"): ("print", "who are"),
    ((3, 1), "letters", "this"): ("print", "the"),  # "him who conducts the investigation"
    ((3, 2), "letters", "ascensions."): ("thayer", "the OCRs read the note mark"),
    ((3, 2), "letters", "reasoning"): ("print", "reckoning"),
    ((3, 3), "letters", "election"): ("print", "relation"),
    ((3, 4), "letters", "profit"): ("print", "benefit"),
    ((3, 4), "letters", "injury"): ("print", "injuries"),
    ((3, 4), "letters", "characteristics"): ("print", "characters"),
    ((3, 8), "letters", "look"): ("print", ""),  # "one should at once look for"
    ((3, 8), "letters", "once"): ("print", "once look"),
    ((3, 10), "letters", "stars."): ("thayer", "the OCRs read the note mark as 4"),
    ((3, 10), "letters", "ascendant"): ("print", "ascendant sign"),
    ((3, 11), "letters", "ruler"): ("print", "rulers"),
    ((3, 12), "letters", "of"): ("print", "of the"),  # "diseases of the body"
    ((3, 12), "letters", "blow,"): ("print", "blow, a"),  # "from a blow, a thrust, iron"
    ((3, 12), "letters", "and"): ("print", "or"),  # "through riches or honours"
    ((3, 13), "letters", "afflictions"): ("print", "affections"),  # "bodily affections"
    ((3, 13), "letters", "suffer"): ("print", "suffer from"),
    ((3, 13), "letters", "them"): ("print", "then"),  # "makes then insolent": so printed
    ((3, 14), "letters", "influences;"): ("print", "influences; for"),
    ((3, 14), "letters", "before,"): ("print", "above,"),  # "as we said above"
    ((3, 14), "letters", "Mars"): ("thayer", "the 's' has dropped from the type in the reprint ('Mar  when'), leaving its space"),
    ((3, 14), "letters", "Mars", "#2"): ("print", "Mars aid"),  # "the sun and Mars aid in causing madness"
    ((3, 14), "letters", "have"): ("print", "have a"),
    ((4, 3), "letters", "will"): ("print", "will merely"),  # "they will merely be generals"
    ((4, 3), "letters", "merely"): ("print", ""),
    ((4, 4), "letters", "appear"): ("print", ""),  # "through which they happen to be passing"
    ((4, 4), "letters", "assume"): ("print", "assume the"),
    ((4, 5), "letters", "Mercury"): ("print", "Mercury alone"),  # "If Mercury alone is with them"
    ((4, 5), "letters", "alone"): ("print", ""),
    # Thayer drops "with" ("The Loeb edition has 'or with'"); the print is kept
    ((4, 5), "letters", "or"): ("print", "or with"),
    ((4, 5), "letters", "and"): ("print", "and is"),
    # Thayer: "From this point on the Loeb edition spells succedant: after this
    # I correct it tacitly." The print is kept.
    ((4, 6), "letters", "succedent,"): ("print", "succedant,"),
    ((4, 6), "letters", "succedent."): ("print", "succedant."),
    ((4, 6), "letters", "garden;"): ("print", "given;"),  # "the children which are given"
    ((4, 7), "letters", "of"): ("print", "or"),  # "disjunct signs or opposite signs"
    ((4, 7), "letters", "succedent"): ("print", "succedant"),
    ((4, 7), "letters", "and"): ("print", "or"),  # "friendship or enmity"
    ((4, 8), "letters", "a"): ("print", ""),  # "or of double form"
    ((4, 8), "letters", "ingresses"): ("thayer", "the OCRs read the note mark as 2"),
    ((4, 9), "letters", "haemorrhages,"): ("thayer", "printed with the ligature æ, which Thayer writes ae throughout; the OCRs read 'he'"),
    ((4, 9), "letters", "in"): ("print", "in the"),  # "but in the ascendant"
    ((4, 10), "letters", "whatever,"): ("print", "whatsoever,"),
    ((4, 10), "letters", "the"): ("print", ""),  # "the similarity of genitures"
    ((4, 10), "letters", "unwitting generally"): ("print", "unwittingly"),
    ((4, 10), "letters", "properties"): ("print", "proprieties"),
    ((4, 10), "letters", "quadriennium,"): ("print", "quadrennium,"),
    ((4, 10), "letters", "and"): ("print", "and of"),  # "both of body and of soul"
    ((4, 10), "letters", "above;"): ("print", "abroad;"),  # "journeys abroad"
    # Thayer's line skip: "badness of body, soul, property, dignity,
    # and companions, ..."
    ((4, 10), "letters", "body,"): ("print", "body, soul, property, dignity, and companions,"),
    ((4, 10), "letters", "ingresses"): ("thayer", "the OCRs read the note mark as 4"),
    # ---- stops
    ((1, 3), "stop", "iron;"): ("print", "iron:"),
    ((1, 3), "stop", "prized"): ("print", "prized."),  # "welcomed and prized. and regarded": so printed
    ((1, 9), "stop", "degree,"): ("print", "degree."),  # "in some degree. Mercury.": so printed
    ((1, 9), "stop", "Jupiter;"): ("print", "Jupiter:"),
    ((1, 9), "stop", "and,"): ("thayer", "a comma whose tail printed faintly; read as a point by the OCRs"),
    ((1, 9), "stop", "Australis,"): ("thayer", "a comma whose tail printed faintly; read as a point by the OCRs"),
    ((1, 20), "stop", "fashion:—"): ("thayer", "printed ':—', which the OCRs split"),
    ((1, 21), "stop", "follows:—"): ("thayer", "printed ':—', which the OCRs split"),
    ((1, 24), "stop", "this"): ("print", "this,"),  # "From all this, then,"
    ((2, 3), "stop", "and"): ("print", "and,"),  # "Saturn and Jupiter and, ..."
    ((2, 10), "stop", "natures;"): ("thayer", "printed ';' before a note mark"),
    ((3, 13), "stop", "occultations"): ("print", "occultations,"),
    ((3, 14), "stop", "seizures"): ("print", "seizures,"),
    ((4, 5), "stop", "husbands;"): ("thayer", "printed ' ;', which the OCRs split"),
    ((4, 9), "stop", "criminals"): ("print", "criminals;"),
    # ---- stretches the aligner could not anchor in three witnesses (page
    #      breaks, footnotes between, a hyphen at a page end): each was read
    #      on the page image and against F, and stands as printed
    ((1, 2), "skipped", "relations"): ("thayer", "as printed ('rela-' at the foot of a page)"),
    ((1, 3), "skipped", "would"): ("thayer", "as printed (across a page break)"),
    ((3, 10), "skipped", "each of the surrounding angles, and we shall find, since the beginning of Aries was assumed to be beyond the mid-heaven above the earth, between mid-heaven and the occident, that the corresponding equinoctial times up to the first of Gemini from mid-heaven are 58 and from the occident"): ("thayer", "as printed"),
    ((3, 10), "skipped", "and if the removal by two hours had been assumed to be from the mid-heaven, we would have added them to the 58 times, but if it was measured from the occident we would have subtracted them from 70. The method of ascertaining the amount of the temporal intervals ought in this way consistently to be followed. For the rest, we shall determine in each of the aforesaid cases of approach or setting, in the order of those that ascend more rapidly, those which are destructive, climacteric, or otherwise transitional, according as the meeting is afflicted or assisted in the way we have already explained, and by means of the particular significance of the predictions made from the temporal ingresses of the meeting. For when at the same time the places are afflicted and the transit of the stars relative to the ingress of the years of life afflicts the governing places, we must understand that death is definitely signified; if one of them is benignant, great and dangerous crises; if both are benignant, only sluggishness, injuries, or transitory disasters. In these matters the special quality is ascertained from the familiarity of the occurrent places with the circumstances of the nativity. Sometimes, when it is doubtful which ought to take over the destroying power, there is nothing to prevent our calculating the occourses of each and then either following, in predicting the future, the occourses which most agree with past events, or observing them all, as having equal power, determining as before the question of their degree."): ("thayer", "as printed (footnotes between the lines defeat the aligner; F agrees word for word)"),
    ((3, 12), "skipped", "haemorrhoids,"): ("thayer", "printed 'hæmorrhoids,' at the foot of a page (ligature, as Thayer writes it throughout)"),
    # the first word of a page: "that peculiar natural quality" (T, D, L, F)
    ((3, 13), "skipped", "particular"): ("print", "peculiar"),
    ((3, 13), "skipped", "compassionate,"): ("thayer", "as printed ('com-' at the foot of a page)"),
    ((4, 9), "skipped", "conditions"): ("thayer", "as printed ('con-' at the foot of a page)"),
}
TAKEN_COUNT = 84

# ---------------------------------------------------------------------------
# 4. FIXES made by hand, each checked on the page image of T
#    (kind, (book, chapter), find, replace) on the chapter's text
# ---------------------------------------------------------------------------

FIXES = [
    # IV.10, the last words of p. 457: the print has "is of this fashion,"
    # with a note mark, and goes on at the top of p. 459 with the two
    # conclusions; Thayer has a full stop (only two OCRs read the comma)
    ("stop", (4, 10), "is of this fashion.", "is of this fashion,"),
    # I.17's heading: the print has "Planets" with a capital, as Thayer's own
    # table of contents does (the vote does not compare capitals)
    ("title", (1, 17), "Several planets", "Several Planets"),
    # I.21, the table of the terms according to Ptolemy (p. 107): Libra's
    # fifth term is Mars's (♂ 6); Thayer repeats Saturn's sign
    ("table", (1, 21), "Libra: ♄ 6, ♀ 5, ☿ 5, ♃ 8, ♄ 6", "Libra: ♄ 6, ♀ 5, ☿ 5, ♃ 8, ♂ 6"),
]

# The two tables of terms, read cell by cell on the page images of T.
TABLES_CHECKED = {
    (1, 20): "p. 97, the terms according to the Egyptians: all 60 cells agree with Thayer",
    (1, 21): "p. 107, the terms according to Ptolemy: 59 cells agree; Libra's fifth is corrected (FIXES)",
}

# The notes imported: short ones the reader needs, each copied as it was read
# on the page image of T (Thayer writes "p96" where the print has "p. 96", and
# so on); the script checks that each is the same note as Thayer's, letter for
# letter.
IMPORTED_NOTES = {
    (1, 1): "Astronomy proper.",  # p. 3, on "One, which is first"
    (1, 2): "The Almagest.",  # p. 3, on "its own treatise"
    (1, 108): "The Greek tables on p. 96 show also, within each sign, the cumulative totals up to 30°; these have been omitted in the translation. Cf. p. 107, n. 1, and for the symbols p. xxv.",  # p. 97
    (1, 118): "The Greek tables contain, under each sign, (1) the name of the planet, (2) the number of its terms in this sign, and (3) the cumulative totals of terms, up to the 30° of the sign. The third detail has been omitted in the English tables. The anonymous commentator (pp. 44-47, ed. Wolf) demonstrates in detail how the assignment of terms is made.",  # p. 107
    (2, 7): "In the astrological ethnography which follows Ptolemy probably depends upon the Stoic Posidonius. Boll, Studien, pp. 181-238, enumerates many details in which, for this reason, Ptolemy here diverges from views expressed in the Geography.",  # p. 121
    (4, 85): "The original ending of the treatise is in doubt; see the Introduction, pp. xviii-xx.",  # p. 457
    (4, 86): "Parallels to many of the words and expressions used in the conclusion which appears in PL can be found in iii. 1; see the Introduction, p. xx, n. 1.",  # p. 459
    (4, 87): "This concluding paragraph, found in MAD among the MSS. studied, seems to have been borrowed bodily from the Paraphrase of Proclus. Camerarius used it in both his editions.",  # p. 459
}


def flag_keys(flags):
    seen = Counter()
    keys = []
    for f in flags:
        k = (f["ch"], f["kind"], f["thayer"])
        seen[k] += 1
        keys.append(k if seen[k] == 1 else k + (f"#{seen[k]}",))
    return keys


def apply(chapters, T, flags):
    used, taken = set(), 0
    for f, k in zip(flags, flag_keys(flags)):
        if k not in DECISIONS:
            if "--list" in sys.argv:
                continue
            sys.exit(f"no decision for flag {k} (OCR: {f['ocr']!r})")
        if k in used:
            sys.exit(f"two flags share the decision {k}")
        used.add(k)
        what, val = DECISIONS[k]
        if what != "print":
            continue
        taken += 1
        b1, b2 = f["at"]
        for j, t in enumerate(T[b1:b2]):
            c = chapters[t["ci"]]
            if t["p"] == -2:
                sys.exit(f"a decision would change a heading number: {k}")
            p = c["head"] if t["p"] == -1 else c["paras"][t["p"]]
            p[t["i"]] = val if j == 0 else ""
    unused = set(DECISIONS) - used
    if unused:
        sys.exit(f"decisions not used: {sorted(unused)}")
    if taken != TAKEN_COUNT and "--list" not in sys.argv:
        sys.exit(f"TAKEN_COUNT is {TAKEN_COUNT} but {taken} printed readings were taken")
    log("flags", len(flags), dict(Counter(f["kind"] for f in flags)), "taken", taken)


# ---------------------------------------------------------------------------
# 5. RENDERING
# ---------------------------------------------------------------------------


def curly(s):
    s = re.sub(r"(^|[\s(\[—\n])\"", "\\1“", s)
    s = s.replace("\"", "”")
    s = re.sub(r"(^|[\s(\[—\n])'", "\\1‘", s)
    s = s.replace("'", "’")
    return s


def para_text(p):
    if isinstance(p, dict):
        return "\n".join(p["table"])
    out = ""
    for w in p:
        if w == "":
            continue
        w = w.lstrip("\x04")
        out += ("" if out == "" else " ") + w
    return out


def heading(c):
    num = c["title"].split()[0]
    words = " ".join(w for w in c["head"] if w)
    # IV.1's heading is printed in square brackets, "[1. Introduction.]"
    if num == f"[{c['n']}." and words.endswith(".]"):
        return "[" + words[:-2] + "]"
    if num != f"{c['n']}.":
        sys.exit(f"heading of {c['book']}.{c['n']} not understood: {c['title']!r}")
    return words.rstrip(".")


def build(chapters):
    for kind, ch, find, repl in FIXES:
        c = next(c for c in chapters if (c["book"], c["n"]) == ch)
        if kind == "page":
            words = find.split()
            hits = [(pi, wi) for pi, p in enumerate(c["paras"]) if not isinstance(p, dict) for wi in range(len(p)) if p[wi:wi + len(words)] == words]
            if len(hits) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find}")
            c["markers"].append(["PG", repl, hits[0][0], hits[0][1]])
        elif kind == "title":
            if find not in " ".join(c["head"]):
                sys.exit(f"fix not found once: {kind} {ch} {find}")
            c["head"] = " ".join(c["head"]).replace(find, repl).split()
        elif kind == "unpage":
            hit = [m for m in c["markers"] if m[0] == "PG" and m[1] == find]
            if len(hit) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find}")
            c["markers"].remove(hit[0])
        else:
            text = "\n\n".join(para_text(p) for p in c["paras"])
            if text.count(find) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find!r}")
            c.setdefault("fix", []).append((find, repl))

    units = []
    pg = "3"
    for c in chapters:
        mks = sorted(c["markers"], key=lambda m: (m[2], m[3]))
        for m in mks:
            if (m[2], m[3]) == (0, 0) and m[0] == "PG":
                pg = m[1]
        pages, refs = [pg], []
        nparas = len(c["paras"])

        def after_end(mp, mi):
            if mp >= nparas:
                return True
            p = c["paras"][mp]
            return mp == nparas - 1 and not isinstance(p, dict) and mi >= len(p)

        for kind, val, mp, mi in mks:
            if (mp, mi) == (0, 0) and kind != "RF":
                continue
            if kind != "RF" and after_end(mp, mi):
                continue
            if kind == "PG":
                pg = val
                if val not in pages:
                    pages.append(val)
            elif int(val) not in refs:
                refs.append(int(val))
        for kind, val, mp, mi in mks:
            if kind == "PG" and after_end(mp, mi):
                pg = val
        text = "\n\n".join(para_text(p) for p in c["paras"] if para_text(p))
        for find, repl in c.get("fix", []):
            text = text.replace(find, repl)
        text = curly(text)
        units.append({"book": c["book"], "chapter": c["n"], "title": curly(heading(c)), "firstPage": pages[0], "lastPage": pages[-1], "noteRefs": refs, "text": text})
    return units


def check_units(units, notes):
    want = [(b, n) for b, k in CHAPTERS_PER_BOOK.items() for n in range(1, k + 1)]
    if [(u["book"], u["chapter"]) for u in units] != want:
        sys.exit("chapters are not I.1-IV.10 in order")
    for u in units:
        t = u["text"]
        if not u["firstPage"]:
            sys.exit(f"chapter {u['book']}.{u['chapter']} lacks a page")
        bad = re.findall(r"[\"'\x01\x02\x03\x04]|  | ,| \.", t)
        if bad:
            sys.exit(f"chapter {u['book']}.{u['chapter']}: stray {bad[:5]}")
    pages = [int(u["firstPage"]) for u in units]
    if pages != sorted(pages) or units[0]["firstPage"] != "3" or units[-1]["lastPage"] != "459":
        sys.exit(f"page run wrong: {units[0]['firstPage']}..{units[-1]['lastPage']}")
    for b, n in IMPORTED_NOTES:
        if not any(u["book"] == b and n in u["noteRefs"] for u in units):
            sys.exit(f"note {b}.{n} has no reference in the text")


def ts(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def main():
    thayer_dir, ocr_dir = sys.argv[1], sys.argv[2]
    chapters, notes = parse_thayer(thayer_dir)
    T = thayer_tokens(chapters)
    flags = vote(T, ocr_dir)
    if "--list" in sys.argv:
        for f, k in zip(flags, flag_keys(flags)):
            if k not in DECISIONS:
                print(repr(k), "|", f["ocr"], "|", f["who"], "|", T[f["at"][0]]["p"])
        apply(chapters, T, flags)
        return
    apply(chapters, T, flags)
    units = build(chapters)
    check_units(units, notes)
    imported = {}
    for (b, n), printed in IMPORTED_NOTES.items():
        if key(printed) != key(notes[(b, n)]):
            sys.exit(f"imported note {b}.{n} is not Thayer's note {notes[(b, n)]!r}")
        imported[(b, n)] = curly(printed)
    out = []
    out.append("// GENERATED by scripts/texts/ptolemy-tetrabiblos.py from Bill Thayer's")
    out.append("// LacusCurtius transcription of Robbins's Loeb translation (1940), voted")
    out.append("// against four archive.org copies of the Loeb volume and read against the")
    out.append("// page images of one of them. Do not edit by hand: correct the generator (its")
    out.append("// DECISIONS and FIXES hold every choice made by hand) and run it again.")
    out.append("")
    out.append("export type TetrabiblosUnit = {")
    out.append("  /** The book, 1-4. */")
    out.append("  book: number;")
    out.append("  /** The chapter within the book, as Robbins numbers it. */")
    out.append("  chapter: number;")
    out.append("  /** Robbins's chapter heading, without its number. */")
    out.append("  title: string;")
    out.append("  /** The Loeb pages (English, odd numbers) the chapter runs over. */")
    out.append("  firstPage: string;")
    out.append("  lastPage: string;")
    out.append("  /** Robbins's notes referred to in the chapter, by Thayer's numbering through the book (the marks are not in the text). */")
    out.append("  noteRefs: number[];")
    out.append("  /** The chapter as printed; paragraphs separated by a blank line, table rows by a line break. */")
    out.append("  text: string;")
    out.append("};")
    out.append("")
    out.append("/** Printed readings taken over Thayer's where the witnesses and the page images agree. */")
    out.append(f"export const TETRABIBLOS_TAKEN_COUNT = {TAKEN_COUNT};")
    out.append("")
    out.append("/** Robbins's notes to the translation (only those in TETRABIBLOS_NOTES are imported). */")
    out.append(f"export const TETRABIBLOS_NOTE_COUNT = {len(notes)};")
    out.append("")
    out.append("/** The notes of Robbins that are imported, as printed, keyed \"book.number\" (Thayer's numbering). */")
    out.append("export const TETRABIBLOS_NOTES: Record<string, string> = {")
    for (b, n), t in imported.items():
        out.append(f"  {ts(f'{b}.{n}')}: {ts(t)},")
    out.append("};")
    out.append("")
    out.append("export const TETRABIBLOS_UNITS: TetrabiblosUnit[] = [")
    for u in units:
        refs = ", ".join(str(r) for r in u["noteRefs"])
        out.append(f"  {{ book: {u['book']}, chapter: {u['chapter']}, title: {ts(u['title'])}, firstPage: {ts(u['firstPage'])}, lastPage: {ts(u['lastPage'])}, noteRefs: [{refs}], text: {ts(u['text'])} }},")
    out.append("];")
    print("\n".join(out))
    log("units", len(units), "words", sum(len(u["text"].split()) for u in units), "notes", len(notes))


if __name__ == "__main__":
    main()
