"""Stage 28: Plutarch, On Isis and Osiris (Moralia 351C-384C), in Frank Cole
Babbitt's English (Loeb Classical Library, Plutarch's Moralia vol. V, 1936).

Writes src/lib/timeline/texts/corpus/plutarch-isis-osiris-text.ts: the 80
chapters of the essay, each with the Stephanus sections (351C ...) and the Loeb
pages it runs over, and the eight of Babbitt's 403 footnotes that are imported.

    python3 -I scripts/texts/plutarch-isis-osiris.py THAYER_DIR OCR_DIR \
        > src/lib/timeline/texts/corpus/plutarch-isis-osiris-text.ts

Everything was fetched with the User-Agent
"relate-archive-research (repo Oshioma/relate)".

THE COPY TEXT
  B  Bill Thayer's LacusCurtius transcription of the Loeb translation,
     https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Moralia/Isis_and_Osiris*/
     in five pages, saved in THAYER_DIR as A.html (chapters 1-19), B.html
     (20-40), C.html (41-52), D.html (53-67) and E.html (68-80). Thayer typed
     the text himself from the 1936 printing and marks the Loeb pages and the
     Stephanus sections. His home page for the essay states: "The work is now
     in the public domain pursuant to the 1978 revision of the U. S. Copyright
     Code, since the copyright expired in 1964 and was not renewed at the
     appropriate time, which would have been that year or the year before."
     That is a United States public-domain status only.

THE WITNESSES (archive.org OCR, djvu.txt, in OCR_DIR)
  L  loeb306.txt   https://archive.org/details/plutarchs-moralia-vol.-5-loeb-306
                   the Loeb vol. V as reprinted 2003 ("First published 1936,
                   Reprinted 1957 ... 2003"); its page images were used for all
                   the proofreading below.
  T  tor1957.txt   https://archive.org/details/moraliainfiftee05plut
                   the Loeb vol. V, University of Toronto (Robarts) copy.
  P  pm05.txt      https://archive.org/details/plutarchsmoralia05plut
                   the Loeb vol. V; some leaves are bound out of order, so each
                   chapter is found anywhere in the volume, not in sequence.
  I  isisloeb.txt  https://archive.org/details/plutarch-isis-osiris-loeb
                   the Isis and Osiris pages of a 1999 printing.
  The reprints are photographic: the type and pages are those of 1936.

METHOD
  1. parse_thayer(): Thayer's HTML is cut into the 80 chapters, paragraphs and
     words, keeping his markers for the Loeb pages (PG), the Stephanus sections
     (ST) and Babbitt's note numbers (RF). His own notes, his mouse-over
     comments and corrections, and his "emend" mark-up are kept out of the
     text; Babbitt's notes are read separately.
  2. vote(): Thayer's words are aligned with each OCR, chapter by chapter
     (difflib on normalised words). Wherever at least three of the four OCRs
     agree on a reading other than Thayer's (letters, a stop after a word, or a
     diacritic), the place is flagged; so is any stretch the aligner could not
     anchor in three OCRs ("skipped"). 95 places are flagged: 54 letters, 29
     stops, 6 diacritics, 6 skipped.
  3. Every flag was looked at on the page image of L and has an entry in
     DECISIONS: "print" (the printed reading is taken; REPLACE gives it) or
     "thayer" (Thayer's reading stands: an OCR misreading, a note mark read as
     "?", an OCR that drops a diaeresis, and so on). The script stops if a flag
     has no decision or a decision is not used. TAKEN_COUNT pins the number of
     printed readings taken.
  4. FIXES holds every correction made by hand outside the vote (each one
     checked on the page image of L).
  5. Curly quotes; check_units() insists on chapters 1-80 in order, every
     chapter with a Stephanus section and a Loeb page, and no straight quote,
     stray mark or double space.

THAYER'S OWN INTERVENTIONS, AND WHAT WAS DONE WITH THEM
  - ch. 26: he marks as an emendation a closing double quote after "gained
    from the gods,"; the print closes the quotation with a single ’. The print
    is kept (FIXES "emend").
  - ch. 60: he supplies "her" ("we call her Isis"), "omitted in the printed
    edition"; the print is kept (DECISIONS).
  - he notes twice (ch. 42 and 43) that the Loeb does not mark section 368C;
    no mark is invented here, so ch. 43 is given as running from 368B to
    368D.
  - he supplies the reference mark of Babbitt's note 216, missing in the print;
    note marks are not imported, so this does not touch the text.
  - "(sic)" after "rarefication" (ch. 79, p. 187): so printed; kept.
  - Thayer's first Stephanus anchor reads "351a"; the essay begins at 351C
    (Babbitt's margin, p. 7), so the first section is given as 351C.
  - Thayer's page markers were checked against the first words of each English
    page of L: all agree except that p. 89 is unmarked; FIXES adds it at
    "Moreover, when they celebrate the festival of the Pamylia" (ch. 36).

WHAT IS NOT IMPORTED (listed in the corpus file)
  Babbitt's introduction (pp. 3-5), his Greek text (the left-hand pages), and
  395 of his 403 footnotes; Thayer's own notes. Only the eight short notes in
  IMPORTED_NOTES are imported, as printed.
"""

import difflib
import html
import re
import sys
import unicodedata
from collections import Counter


def log(*a):
    print(*a, file=sys.stderr)


# ---------------------------------------------------------------------------
# 1. THAYER'S TRANSCRIPTION
# ---------------------------------------------------------------------------


def parse_thayer(src):
    notes = {}
    body_all = ""
    for f in "ABCDE":
        s = open(f"{src}/{f}.html", encoding="utf-8").read()
        start = s.index("<H1>")
        end = s.index('<HR CLASS="endnotes"')
        body_all += s[start:end]
        tail = s[end:]
        cut = tail.find("Thayer's Notes:")
        loeb_notes = tail if cut < 0 else tail[:cut]
        for m in re.finditer(r'<A CLASS="note" ID="note(\d+)"[^>]*>\s*\d+\s*</A>(.*?)(?=<P CLASS="ivy">|<HR CLASS="endnotes"|$)', loeb_notes, re.S):
            t = re.sub(r"<A CLASS=\"(correction|comment)\".*?</A>", "", m.group(2), flags=re.S)
            t = re.sub(r"<[^>]+>", "", t)
            notes[int(m.group(1))] = html.unescape(re.sub(r"\s+", " ", t)).strip()

    b = body_all
    b = re.sub(r"<A CLASS=\"(correction|comment)\".*?</A>", "", b, flags=re.S)
    b = re.sub(r'<A CLASS="ref" ID="ref(\d+)(?:bis)?"[^>]*>.*?</A>', "\x01RF\\1\x02", b, flags=re.S)
    b = re.sub(r'<A CLASS="ref"[^>]*>.*?</A>', "", b, flags=re.S)
    b = re.sub(r"&#8288;|&shy;", "", b)
    b = re.sub(r'<SPAN CLASS="emend">(.*?)</SPAN>', "\x01EMEND\\1\x02", b, flags=re.S)
    b = re.sub(r'<A CLASS="sec"[^>]*>.*?</A>', "", b, flags=re.S)
    b = re.sub(r'<A CLASS="chapter" NAME="(\d+)">\d+</A>', "\x01CH\\1\x02", b)
    b = re.sub(r'<A CLASS="Tsec" NAME="T(\d+)([a-f])">[^<]*</A>', "\x01ST\\1\\2\x02", b)
    b = re.sub(r'<A CLASS="Tsubsec" NAME="T(\d+)([a-f])">[a-f]</A>', "\x01ST\\1\\2\x02", b)
    b = re.sub(r'<SPAN CLASS="pagenum">\s*p(\d+)\s*</SPAN>', "\x01PG\\1\x02", b)
    b = re.sub(r'<SPAN CLASS="pagenum">[^<]*</SPAN>', "", b)
    b = re.sub(r"<H1>.*?</H1>", lambda m: "".join(re.findall(r"\x01PG\d+\x02", m.group(0))), b, flags=re.S)
    b = re.sub(r"<H[24][^>]*>.*?</H[24]>", "", b, flags=re.S)
    b = re.sub(r"<TABLE CLASS=\"verse\">|<DIV CLASS=\"verse\">|<P CLASS=\"verse4\">", "\x01VERSE\x02", b)
    b = re.sub(r"</TABLE>|</DIV>", "\x01ENDBLOCK\x02", b)
    b = re.sub(r"<BR>|</TR>", "\x01LINE\x02", b)
    b = re.sub(r"<P[^>]*>", "\x01PARA\x02", b)
    # inline tags go without a space, so that "<I>cyphi</I>," stays one word
    b = re.sub(r"</?(I|SPAN|A|B|EM|SUP|SUB)\b[^>]*>", "", b, flags=re.S)
    b = re.sub(r"<[^>]+>", " ", b)
    b = html.unescape(b).replace("‑", "-")

    chapters, cur, paras, para, pending = [], None, [], [], []
    in_verse = False
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
                cur = {"n": int(tag[2:]), "markers": [mk + [0, 0] for mk in pending]}
                pending, paras = [], []
            elif tag[:2] in ("ST", "PG", "RF"):
                mk = [tag[:2], tag[2:]]
                if cur is None:
                    pending.append(mk)
                else:
                    cur["markers"].append(mk + [len(paras), len(para)])
            elif tag == "PARA":
                if para:
                    paras.append(para)
                para, in_verse = [], False
            elif tag == "VERSE":
                if para:
                    paras.append(para)
                para, in_verse = [], True
            elif tag == "ENDBLOCK":
                if in_verse and para:
                    paras.append(para)
                    para = []
                in_verse = False
            elif tag == "LINE":
                if in_verse and para and para[-1] != "\n":
                    para.append("\n")
            elif tag.startswith("EMEND"):
                for w in tag[5:].split():
                    para.append("\x03" + w)
            continue
        para.extend(ev.split())
    if para:
        paras.append(para)
    cur["paras"] = paras
    chapters.append(cur)
    for c in chapters:
        # paragraphs are kept even when only "\n" (none are), so marker indices hold
        for p in c["paras"]:
            while p and p[-1] == "\n":
                p.pop()
    return chapters, notes


# ---------------------------------------------------------------------------
# 2. THE VOTE
# ---------------------------------------------------------------------------

OCR = {"L": "loeb306.txt", "T": "tor1957.txt", "P": "pm05.txt", "I": "isisloeb.txt"}


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
        if not re.search(r"[A-Za-z]", w):
            # French-style spacing ("gods ;"): the stop belongs to the word before
            if re.fullmatch(r"[.,;:!?]+[’”\"']*", w) and toks:
                toks[-1] += w
            continue
        toks.append(re.sub(r"^[^A-Za-z0-9(\[‘“\"']+", "", w))
    return toks


def thayer_tokens(chapters):
    T = []
    for c in chapters:
        for pi, p in enumerate(c["paras"]):
            for wi, w in enumerate(p):
                w2 = w.lstrip("\x03")
                if w == "\n" or not re.search(r"[A-Za-z0-9]", w2):
                    continue
                T.append({"ch": c["n"], "p": pi, "i": wi, "w": w2})
    pg, st = "7", "351c"
    for c in chapters:
        mks = sorted(c["markers"], key=lambda m: (m[2], m[3]))
        for t in (t for t in T if t["ch"] == c["n"]):
            for kind, val, mp, mi in mks:
                if (mp, mi) <= (t["p"], t["i"]):
                    if kind == "PG":
                        pg = val
                    elif kind == "ST":
                        st = val
            t["page"], t["st"] = pg, st
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


def vote(T, ocr_dir):
    tk = [key(t["w"]) for t in T]
    O = {s: ocr_tokens(f"{ocr_dir}/{f}") for s, f in OCR.items()}
    chs = sorted({t["ch"] for t in T})
    first = {ch: next(i for i, t in enumerate(T) if t["ch"] == ch) for ch in chs}
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
                log("chapter not found", sig, ch)
                continue
            j2 = starts.get(chs[ci + 1]) if ci + 1 < len(chs) else None
            span = int(2.2 * (i2 - i1)) + 200
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
        if best and best[1] >= 3:
            src = next(s for s in present if rk[s] == best[0])
            flags.append({"kind": "letters", "ch": T[b1]["ch"], "at": (b1, b2), "thayer": " ".join(t["w"] for t in seg), "ocr": " ".join(rd[src])})
            continue
        if len(seg) == 1:
            def acc(w):
                return "".join(ch for ch in w if ch.isalpha() and not ch.isascii())
            da = Counter(bool(acc(rd[s][-1])) for s in present if rd[s] and rk[s] == segk)
            if da.get(not bool(acc(seg[0]["w"])), 0) >= 3:
                flags.append({"kind": "accent", "ch": seg[0]["ch"], "at": (b1, b2), "thayer": seg[0]["w"], "ocr": rd[present[0]][-1]})
            st = Counter(stop(rd[s][-1]) if rd[s] and rk[s] == segk else None for s in present)
            st.pop(None, None)
            ts = stop(seg[0]["w"])
            cand = [(v, n) for v, n in st.items() if v != ts]
            if cand:
                v, n = max(cand, key=lambda x: x[1])
                if n >= 3:
                    flags.append({"kind": "stop", "ch": seg[0]["ch"], "at": (b1, b2), "thayer": seg[0]["w"], "ocr": v or "(none)"})
    XS = {s: " " + " ".join(key(w) for w in O[s]) + " " for s in sigs}
    for b1, b2 in skipped:
        p1 = " " + " ".join(tk[max(0, b1 - 3):b2]) + " "
        p2 = " " + " ".join(tk[b1:min(len(tk), b2 + 3)]) + " "
        if sum(1 for s in sigs if p1 in XS[s] or p2 in XS[s]) < 3:
            flags.append({"kind": "skipped", "ch": T[b1]["ch"], "at": (b1, b2), "thayer": " ".join(t["w"] for t in T[b1:b2]), "ocr": "?"})
    return flags


# ---------------------------------------------------------------------------
# 3. DECISIONS: one for every flag, each checked on the page image of L
#    (chapter, kind, Thayer's words) -> ("print", the printed words) or ("thayer", why)
# ---------------------------------------------------------------------------

DECISIONS = {
    # letters
    (1, "letters", "All"): ("thayer", "small capitals, OCR 'Att'"),
    (3, "letters", "intimation,"): ("print", "intimations,"),
    (5, "letters", "die,"): ("print", "die there,"),
    (8, "letters", "luxury,"): ("print", "luxury, lavishness,"),
    (10, "letters", "Pythagoras,"): ("print", "Pythagoras, as"),  # "Pythagoras, as it seems,"
    (12, "letters", "or"): ("print", "or any"),  # "in any month or any year"
    (15, "letters", "Nemanûs,"): ("thayer", "OCR misreads the circumflex"),
    (19, "letters", "be"): ("print", "but"),  # "but laid hands"
    (20, "letters", "Much"): ("print", "Much need"),
    (20, "letters", "in"): ("print", "in the"),  # "in the least"
    (24, "letters", "by"): ("print", "but"),  # "flourished but a brief time"
    (25, "letters", "judgment"): ("print", "judgement"),
    (25, "letters", "and"): ("print", "and of"),  # "of virtue and of vice"
    (28, "letters", "for"): ("print", "from"),  # "came from Sinope"
    (29, "letters", "that"): ("print", "that the"),
    (30, "letters", "their"): ("print", "the"),  # "upon the worshippers"
    (30, "letters", "Zeus,"): ("print", "Zeus, and"),
    (31, "letters", "early"): ("print", "earlier"),
    (32, "letters", "symbolises"): ("print", "symbolizes"),
    (34, "letters", "(hysai);"): ("thayer", "OCR i/t"),
    (35, "letters", "For"): ("thayer", "OCR drops the word at the line start"),
    (36, "letters", "member,"): ("print", "nature,"),  # "of a phallic nature"
    (42, "letters", "equal"): ("print", "equal to"),
    (44, "letters", "among"): ("print", "among the"),
    (48, "letters", "the"): ("print", "to"),  # "belong to Olympian Zeus"
    (48, "letters", "vanish"): ("print", "vanish away"),
    (48, "letters", "quarreling\""): ("print", "quarrelling\""),
    (48, "letters", "opposite"): ("print", "opposing"),
    (49, "letters", "season,"): ("print", "seasons,"),
    (50, "letters", "can"): ("thayer", "OCR 'ean'"),
    (51, "letters", "his"): ("print", "its"),  # "the keenness of its vision"
    (51, "letters", "good."): ("thayer", "OCR reads the note mark as 4"),
    (52, "letters", "On"): ("print", "On the 8th of"),  # "On the 8th of the waning"
    (52, "letters", "circumambulation"): ("thayer", "OCR c/e"),
    (52, "letters", "now"): ("print", ""),  # "But let us now take up"
    (52, "letters", "us"): ("print", "us now"),
    (54, "letters", "take"): ("print", "takes"),
    (57, "letters", "events."): ("thayer", "chapter-boundary artefact of the aligner"),
    (58, "letters", "We"): ("thayer", "chapter-boundary artefact of the aligner"),
    (58, "letters", "as"): ("print", "as if"),  # "as if it were"
    (60, "letters", "her"): ("print", ""),  # "we call Isis": Thayer supplied "her"
    (60, "letters", "(isia)."): ("thayer", "OCR misses the Latin-letter word"),
    (60, "letters", "(an-ia)."): ("thayer", "OCR reads the note mark as 4"),
    (61, "letters", "(hosion)"): ("thayer", "OCR i/z"),
    (62, "letters", "means"): ("print", "reason"),  # "by reason of motion"
    (63, "letters", "the"): ("print", ""),  # "at the time of full moon"
    (70, "letters", "the"): ("print", "their"),  # "filled their minds"
    (70, "letters", "them"): ("print", "these"),
    (72, "letters", "eating"): ("print", "eating the"),
    (73, "letters", "Eileithiya"): ("print", "Eileithyia"),
    # Thayer's line skip: "The consecrations of the animals held in honour,
    # however, were secret, and took place ..." (p. 171)
    (73, "letters", "animals"): ("print", "animals held in honour, however, were secret, and"),
    (73, "letters", "in"): ("print", "in the"),  # "in the presence of all"
    (76, "letters", "are"): ("print", "are the"),  # "are the clearer mirrors"
    (78, "letters", "which"): ("print", "what"),  # "in what manner"
    # stops (a "?" from the OCR is Babbitt's superior note mark)
    (1, "stop", "thought:"): ("thayer", "colon printed before the verse"),
    (10, "stop", "sceptre;"): ("thayer", "note mark"),
    (12, "stop", "intercalated"): ("thayer", "note mark"),
    (13, "stop", "it"): ("thayer", "note mark"),
    (13, "stop", "Ethiopia"): ("thayer", "note mark"),
    (14, "stop", "sister"): ("thayer", "note mark"),
    (24, "stop", "Plato"): ("thayer", "note mark"),
    (26, "stop", "daemon;"): ("thayer", "semicolon faint in the print"),
    (29, "stop", "Plato"): ("thayer", "note mark"),
    (33, "stop", "heart;"): ("thayer", "semicolon faint in the print"),
    (35, "stop", "bull;"): ("thayer", "note mark"),
    (35, "stop", "Pindar"): ("thayer", "note mark"),
    (36, "stop", "Air"): ("print", "Air,"),  # "Earth, Air, and Fire"
    (42, "stop", "twenty-eight;"): ("thayer", "semicolon faint in the print"),
    (46, "stop", "Mithras:"): ("print", "Mithras;"),
    (46, "stop", "omomi"): ("print", "omomi,"),
    (47, "stop", "inside;"): ("thayer", "semicolon faint in the print"),
    (47, "stop", "Theopompus"): ("thayer", "note mark"),
    (48, "stop", "Homer"): ("thayer", "note mark"),
    (50, "stop", "crocodile;"): ("thayer", "semicolon faint in the print"),
    (51, "stop", "power;"): ("thayer", "semicolon faint in the print"),
    (54, "stop", "Horus;"): ("thayer", "semicolon faint in the print"),
    (59, "stop", "her;"): ("thayer", "note mark"),
    (60, "stop", "evil;"): ("print", "evil:"),
    (64, "stop", "Isis;"): ("thayer", "semicolon faint in the print"),
    (64, "stop", "Eudoxus"): ("thayer", "note mark"),
    (65, "stop", "amulet"): ("thayer", "note mark"),
    (68, "stop", "amulet"): ("thayer", "note mark"),
    (77, "stop", "Plato"): ("thayer", "note mark"),
    # diacritics
    (9, "accent", "Saïs"): ("thayer", "the OCRs drop the diaeresis"),
    (10, "accent", "Saïs,"): ("thayer", "the OCRs drop the diaeresis"),
    (15, "accent", "Athenaïs."): ("thayer", "the OCRs drop the diaeresis"),
    (32, "accent", "Saïs"): ("thayer", "the OCRs drop the diaeresis"),
    (43, "accent", "Xoïs,"): ("thayer", "the OCRs drop the diaeresis"),
    (66, "accent", "Phersephone;"): ("print", "Phersephonê;"),
    # stretches across a page break the aligner could not anchor; all as printed
    (24, "skipped", "Macedonians,"): ("thayer", "as printed"),
    (30, "skipped", "they"): ("thayer", "as printed"),
    (35, "skipped", "Furthermore,"): ("thayer", "as printed"),
    (48, "skipped", "Concord"): ("thayer", "as printed"),
    (61, "skipped", "Serapis;"): ("thayer", "as printed"),
    (73, "skipped", "persists,"): ("thayer", "as printed"),
}
TAKEN_COUNT = 47

# ---------------------------------------------------------------------------
# 4. FIXES made by hand, each checked on the page image of L
#    (kind, chapter, find, replace) on the chapter's text; "page" adds a marker
# ---------------------------------------------------------------------------

FIXES = [
    # 2 of 4 OCRs only, so not flagged by the vote; the print (p. 49) reads "as"
    ("ocr", 20, "framed) and if such", "framed) as if such"),
    # Thayer marks his closing quote as an emendation; the print has a single ’
    ("emend", 26, "gained from the gods, \x03\"", "gained from the gods,’"),
    # Thayer puts his note mark (note 102) after the hyphen of "persea-tree",
    # which splits the word in his text; the print has "persea-" at a line end
    # with the note mark, then "tree", and Babbitt's note itself spells
    # "persea-tree" (both read in the OCR of L, T, P and I)
    ("hyphen", 20, "persea- tree", "persea-tree"),
    # Thayer has no marker for p. 89; it begins "Moreover, when they celebrate"
    ("page", 36, "Moreover, when they celebrate the festival of the Pamylia", "89"),
    # Thayer's first anchor reads 351a; Babbitt's margin gives 351C
    ("section", 1, "351a", "351c"),
]

IMPORTED_NOTES = [1, 8, 77, 147, 264, 303, 385, 403]


def apply(chapters, T, flags):
    used, taken = set(), 0
    for f in flags:
        k = (f["ch"], f["kind"], f["thayer"])
        if k not in DECISIONS:
            sys.exit(f"no decision for flag {k} (OCR: {f['ocr']!r})")
        if k in used:
            sys.exit(f"two flags share the decision {k}")
        used.add(k)
        what, val = DECISIONS[k]
        if what != "print":
            continue
        taken += 1
        b1, b2 = f["at"]
        byc = {c["n"]: c for c in chapters}
        for j, t in enumerate(T[b1:b2]):
            p = byc[t["ch"]]["paras"][t["p"]]
            p[t["i"]] = val if j == 0 else ""
    unused = set(DECISIONS) - used
    if unused:
        sys.exit(f"decisions not used: {sorted(unused)}")
    if taken != TAKEN_COUNT:
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
    out = ""
    for w in p:
        if w == "":
            continue
        if w == "\n":
            out = out.rstrip(" ") + "\n"
            continue
        out += ("" if out == "" or out.endswith("\n") else " ") + w
    return out


def sec(v):
    return v[:-1] + v[-1].upper()


def build(chapters, notes):
    fixes_used = 0
    for kind, ch, find, repl in FIXES:
        c = next(c for c in chapters if c["n"] == ch)
        if kind == "section":
            hit = [m for m in c["markers"] if m[0] == "ST" and m[1] == find]
            if len(hit) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find}")
            hit[0][1] = repl
        elif kind == "page":
            words = find.split()
            hits = [(pi, wi) for pi, p in enumerate(c["paras"]) for wi in range(len(p)) if p[wi:wi + len(words)] == words]
            if len(hits) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find}")
            c["markers"].append(["PG", repl, hits[0][0], hits[0][1]])
        else:
            text = "\n\n".join(para_text(p) for p in c["paras"])
            if text.count(find) != 1:
                sys.exit(f"fix not found once: {kind} {ch} {find!r}")
            c.setdefault("fix", []).append((find, repl))
        fixes_used += 1

    units = []
    pg, st = "7", "351c"
    for c in chapters:
        mks = sorted(c["markers"], key=lambda m: (m[2], m[3]))
        start = [m for m in mks if (m[2], m[3]) == (0, 0)]
        for m in start:
            if m[0] == "PG":
                pg = m[1]
            elif m[0] == "ST":
                st = m[1]
        pages, sections, refs = [pg], [st], []
        for kind, val, mp, mi in mks:
            if (mp, mi) == (0, 0) and kind != "RF":
                continue
            # a page or section marker after the chapter's last word belongs to
            # the next chapter (a note mark after it belongs to this one)
            if kind != "RF" and (mp >= len(c["paras"]) or (mp == len(c["paras"]) - 1 and mi >= len(c["paras"][mp]))):
                continue
            if kind == "PG":
                pg = val
                if val not in pages:
                    pages.append(val)
            elif kind == "ST":
                st = val
                if val not in sections:
                    sections.append(val)
            elif int(val) not in refs:
                refs.append(int(val))
        # markers after the end still move the running page / section on
        for kind, val, mp, mi in mks:
            if mp >= len(c["paras"]) or (mp == len(c["paras"]) - 1 and mi >= len(c["paras"][mp])):
                if kind == "PG":
                    pg = val
                elif kind == "ST":
                    st = val
        text = "\n\n".join(para_text(p) for p in c["paras"])
        for find, repl in c.get("fix", []):
            text = text.replace(find, repl)
        text = curly(text)
        units.append({"chapter": c["n"], "sections": [sec(s) for s in sections], "firstPage": pages[0], "lastPage": pages[-1], "noteRefs": refs, "text": text})
    return units


def check_units(units, notes):
    if [u["chapter"] for u in units] != list(range(1, 81)):
        sys.exit("chapters are not 1-80 in order")
    for u in units:
        t = u["text"]
        if not u["sections"] or not u["firstPage"]:
            sys.exit(f"chapter {u['chapter']} lacks a section or page")
        bad = re.findall(r"[\"'\x01\x02\x03]|  | ,| \.|\[|\]", t)
        if bad:
            sys.exit(f"chapter {u['chapter']}: stray {bad[:5]}")
    if len(notes) != 403:
        sys.exit(f"expected 403 notes, found {len(notes)}")
    pages = [int(u["firstPage"]) for u in units]
    if pages != sorted(pages) or units[0]["firstPage"] != "7" or units[-1]["lastPage"] != "191":
        sys.exit(f"page run wrong: {units[0]['firstPage']}..{units[-1]['lastPage']}")
    if units[0]["sections"][0] != "351C" or units[-1]["sections"][-1] != "384C":
        sys.exit(f"section run wrong: {units[0]['sections'][0]}..{units[-1]['sections'][-1]}")
    for n in IMPORTED_NOTES:
        if not any(n in u["noteRefs"] for u in units):
            sys.exit(f"note {n} has no reference in the text")


def ts(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def main():
    thayer_dir, ocr_dir = sys.argv[1], sys.argv[2]
    chapters, notes = parse_thayer(thayer_dir)
    T = thayer_tokens(chapters)
    flags = vote(T, ocr_dir)
    apply(chapters, T, flags)
    units = build(chapters, notes)
    check_units(units, notes)
    imported = {}
    for n in IMPORTED_NOTES:
        t = re.sub(r"\s*\(p\d+\)", " ", notes[n])
        imported[n] = curly(re.sub(r"\s+", " ", t).replace("‑", "-")).strip()
    out = []
    out.append("// GENERATED by scripts/texts/plutarch-isis-osiris.py from Bill Thayer's")
    out.append("// LacusCurtius transcription of Babbitt's Loeb translation (1936), voted")
    out.append("// against four archive.org OCRs of the Loeb volume and read against the page")
    out.append("// images of one of them. Do not edit by hand: correct the generator (its")
    out.append("// DECISIONS and FIXES hold every choice made by hand) and run it again.")
    out.append("")
    out.append("export type PlutarchIsisUnit = {")
    out.append("  /** The chapter number, 1-80 (Babbitt's chapters, as in the Loeb). */")
    out.append("  chapter: number;")
    out.append("  /** The Stephanus sections the chapter runs over, first to last, e.g. [\"351C\", \"351D\"]. */")
    out.append("  sections: string[];")
    out.append("  /** The Loeb pages (English, odd numbers) the chapter runs over. */")
    out.append("  firstPage: string;")
    out.append("  lastPage: string;")
    out.append("  /** The numbers of Babbitt's footnotes referred to in the chapter (the marks are not in the text). */")
    out.append("  noteRefs: number[];")
    out.append("  /** The chapter as printed; paragraphs separated by a blank line. */")
    out.append("  text: string;")
    out.append("};")
    out.append("")
    out.append("/** Printed readings taken over Thayer's where the OCRs and the page images agree. */")
    out.append(f"export const PLUTARCH_ISIS_TAKEN_COUNT = {TAKEN_COUNT};")
    out.append("")
    out.append("/** Babbitt's footnotes to the essay (only those in PLUTARCH_ISIS_NOTES are imported). */")
    out.append(f"export const PLUTARCH_ISIS_NOTE_COUNT = {len(notes)};")
    out.append("")
    out.append("/** The footnotes of Babbitt that are imported, as printed, by number. */")
    out.append("export const PLUTARCH_ISIS_NOTES: Record<number, string> = {")
    for n, t in imported.items():
        out.append(f"  {n}: {ts(t)},")
    out.append("};")
    out.append("")
    out.append("export const PLUTARCH_ISIS_UNITS: PlutarchIsisUnit[] = [")
    for u in units:
        secs = ", ".join(ts(s) for s in u["sections"])
        refs = ", ".join(str(r) for r in u["noteRefs"])
        out.append(f"  {{ chapter: {u['chapter']}, sections: [{secs}], firstPage: {ts(u['firstPage'])}, lastPage: {ts(u['lastPage'])}, noteRefs: [{refs}], text: {ts(u['text'])} }},")
    out.append("];")
    print("\n".join(out))
    log("units", len(units), "words", sum(len(u["text"].split()) for u in units))


main()
