"""The Book of the Heavenly Cow (Budge 1912, "The Legend of the Destruction of Mankind") -> section-by-section English.

Budge prints his English of the book in Legends of the Gods: The Egyptian
Texts, Edited with Translations (Books on Egypt and Chaldaea, Egyptian
Literature vol. I, 1912), pp.
14-41: the hieroglyphic text on the even pages, his English on the odd pages
15-41. His introduction summarises the legend (pp. xxiii-xxxiii); that summary
is his own retelling and is not imported.

Inputs (three copies of the same 1912 English):

  G  Project Gutenberg e-text no. 9411 ("Legends of the Gods", by E. A. Wallis
     Budge), as archive.org keeps it: item `legendsofthegods09411gut`, file
     8egpt10.txt. A transcription proofread by volunteers -- the base.
  E  the archive.org OCR (djvu.txt) of a scan of the printed book, Sandeman
     Library, Perth copy: item `egyptianliteratu0001eawa`.
  I  the archive.org OCR (djvu.txt) of a second scan of the printed book,
     Digital Library of India: item `india.history.resource.91924`.

E and I are two physical copies of the 1912 printing, so their OCR errors
mostly differ; G is an independent transcription. A fourth file on archive.org
(item `LegendsOfTheGods`) was looked at and set aside: it is an OCR of a
printout of the Gutenberg text (its header and "####" note are Gutenberg's),
so it is not independent of G.

Budge's earlier English of the same text, in The Gods of the Egyptians vol. I
(1904, archive.org `godsofegyptianso00budg`), is an interlinear word-for-word
version with transliteration under the hieroglyphs; it is a different
translation, not a copy of this one, so it is not used for the comparison.

METHOD. Each copy is cut from "[Here is the story of Ra,]" to the heading of
the next legend ("THE LEGEND OF RA AND ISIS."). In G, the transcriber's
headings ("THE LEGEND OF THE DESTRUCTION OF MANKIND", "CHAPTER I." ...),
footnotes ("[FN#58] ...") and footnote markers are dropped; Budge's printed
text has no chapter headings, only the numerals II.-V. at the head of a
section. In E and I, running heads, the printer's signature letters and
footnotes are dropped; the OCR of the hieroglyphic pages is left in and simply
fails to line up with anything.

The three are then compared word by word (difflib, on lower-case letters
only). Where G's words differ from E's and I's and those two agree, theirs is
taken (a stretch of up to four words, word for word). Within words that
agree, a difference of the punctuation outside the letters (not quotation
marks, which Budge repeats at the head of every line of a speech, and not his
rows of dots) is settled the same way. REJECT lists the few places where both
OCRs misread the same printed word alike (small capitals, italics, footnote
numbers), so that their agreement is not a reading. Every change, every
rejection and every longer disagreement is printed to stderr; a longer
disagreement is left as G has it unless FIXES says otherwise. FIXES holds
every correction made by hand, each checked against the two OCRs.

Budge's printed page of each part is read from E's running heads.

WHAT IS LEFT OUT. Budge's hieroglyphic text, his transliteration (except the
few Egyptian words he prints in brackets inside the English, which are kept,
without their long-vowel marks, as G gives them) and his footnotes. His marks
for gaps in the text (rows of dots) are kept as ". . . . .".

Usage:
  python3 -I scripts/texts/budge-heavenly-cow.py G.txt E.txt I.txt > src/lib/timeline/texts/corpus/heavenly-cow-text.ts
"""

import difflib
import json
import re
import sys

START = "[Here is the story of Ra,]"
END = re.compile(r"^\s*THE LEGEND OF RA AND ISIS\.\s*$")

# The archive's parts: Budge's five sections (I has no numeral in print; II-V
# open with theirs), and within the two long sections, the cuts made for this
# archive at a change of scene. (section, part, label, the words the part
# begins with).
PARTS = [
    (1, 1, "Ra's council of the gods", "[Here is the story of Ra,]"),
    (1, 2, "The Eye of Ra goes out as Hathor", "Thereupon this goddess went forth"),
    (1, 3, "The beer that saves mankind", "Then the Majesty of Ra spake [saying], \"Cry out"),
    (1, 4, "Ra's weariness; Nut becomes a cow", "And the Majesty of Ra spake unto this goddess, [saying], \"I am smitten"),
    (1, 5, "Ra in the sky: the fields, the stars and the supports of heaven", "And the Majesty of this god said unto Nut"),
    (2, 0, "The Chapter of the Cow: how the picture is to be made", "II. This Chapter shall be said"),
    (3, 0, "Ra charges Seb with the serpents", "III. Then the majesty of this god spake unto Thoth"),
    (4, 0, "Ra makes Thoth his deputy", "IV. And the majesty of this god said"),
    (5, 1, "The rule for the reciter", "V. Whosoever shall recite the words"),
    (5, 2, "The soul of Ra", "Then the Aged One himself"),
    (5, 3, "The reciter's words of power", "Whosoever sayeth [these words]"),
    (5, 4, "Hymn to the lord of eternity, and the close", "Hail, thou lord of eternity"),
]

# The word-by-word pass takes E's and I's reading where they agree against G.
# These are the places where both OCRs misread the same printed word in the
# same way, so their agreement is not a reading and G's stands: (G's word,
# the OCRs' word, quotation marks taken off). Each was checked in context.
REJECT = [
    # A footnote number read as a mark of punctuation.
    ("thou", "thou!"),  # "Come thou¹ with them"
    ("weary", "weary?"),  # "exceedingly weary³"
    # Budge sets some names in small capitals and some Egyptian words in
    # italics with dots and macrons; both OCRs misread them alike.
    ("Khen;", "Kuen;"),
    ("(habi)", "(Aabi)"),
    ("Osiris,", "Qsiris,"),
    ("I", "T"),
    ("greater", "oreater"),
    # "of this [kind were brought": the bracket is the OCRs' alone; no copy
    # closes it.
    ("kind", "[kind"),
]
assert all(len(pair) == 2 for pair in REJECT)

# Corrections made by hand: (wrong, right), plain string replacement in the
# joined text before it is cut into parts, applied in order. Each is a reading
# of G that both printed copies contradict and that the word-by-word pass does
# not settle by itself (a quotation mark, a bracket, or a capital).
FIXES = [
    # G turns Budge's quotation marks at the head of a line into stray ' marks;
    # E and I: '“O son Shu, be thou the Eye / “for thy father ... and / “thou
    # goddess Nut'.
    ("be thou the Eye 'for thy father", "be thou the Eye for thy father"),
    ("him, and 'thou goddess Nut", "him, and thou goddess Nut"),
    # E and I: '“Your / “transgressions': one opening mark, not two.
    ('"Your "transgressions', '"Your transgressions'),
    # E and I: 'namely, “Shu himself.” A boat'.
    ('namely, Shu himself. "A boat', 'namely, "Shu himself." A boat'),
    # E and I: 'and “The Aged One to whom praise'; G drops the opening mark.
    ("and The Aged One to whom praise", 'and "The Aged One to whom praise'),
    # E and I: "[power] to embrace"; G capitalises.
    ("[Power] to embrace", "[power] to embrace"),
    # E and I: "at once.’”" (the single mark closes Seb's summons inside Ra's
    # speech); G sets the two marks the other way round.
    ("at once.\"'", "at once.'\""),
    # E and I: "avenge(?)"; G misreads it. (The word pass cannot line the
    # stretch up: E's OCR runs the dots into it.)
    ("and avenue (?) him", "and avenge (?) him"),
    # E and I: '... place him ...... ” And the goddess Nut said, “How can this
    # be then, / “O my father Nu?” “Hail,” said Nut .....': G closes neither
    # Nu's speech nor Nut's question, and adds a second row of dots.
    ("place him . . . . . ... And the goddess", 'place him . . . . . ..." And the goddess'),
    ('O my father Nu? Hail," said Nut', 'O my father Nu?" "Hail," said Nut'),
    # E: "And Ra said"; I: "And Ra.said" (a speck). G adds a comma after "Ra",
    # as it does three times elsewhere where both copies have none.
    ("And Ra, said,", "And Ra said,"),
]

# G's paragraph breaks that fall where it moved a footnote out of the text,
# and that the printed copies do not show (no break in E or I): joined.
JOIN_AFTER = [
    "say to me concerning it.\"",
    "because of the height.",
]


def read(path):
    return open(path, encoding="utf-8", errors="replace").read().split("\n")


def norm_chars(s):
    for a, b in (("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"), ("­", ""), ("—", "--")):
        s = s.replace(a, b)
    return s


def letters(t):
    return re.sub(r"[^a-z]", "", t.lower())


# --- G ----------------------------------------------------------------------


def g_paragraphs(lines):
    """G's text as paragraphs, with its headings, footnotes and markers out.
    None stands where a footnote stood."""
    s = next(i for i, l in enumerate(lines) if l.strip().startswith(START))
    e = next(i for i in range(s, len(lines)) if END.match(lines[i]))
    paras, cur = [], []
    for l in lines[s:e] + [""]:
        t = l.strip()
        if not t:
            if cur:
                paras.append(cur)
                cur = []
            continue
        if re.fullmatch(r"THE LEGEND OF THE DESTRUCTION OF MANKIND\.?|CHAPTER [IVX]+\.", t):
            continue
        cur.append(t)
    out = []
    for p in paras:
        if p[0].startswith("[FN#"):
            out.append(None)
            continue
        # A line ending in a hyphen runs on into the next with no space.
        text = ""
        for line in p:
            if text.endswith("-") and not text.endswith("--"):
                text += line
            else:
                text += (" " if text else "") + line
        text = re.sub(r"\[FN#\d+\]", "", norm_chars(text))
        out.append(re.sub(r"\s+", " ", text).strip())
    return out


# --- E and I ----------------------------------------------------------------

HEAD_ODD = re.compile(r"^\s*T\S{1,3}\s+DESTRUCTION\s+OF\s+MANKIND\b")
HEAD_EVEN = re.compile(r"^\s*\d*\s*EGYPTIAN\s+LITERATURE\s*$")
NOTE = re.compile(r"^\s*(?:[1-4l]\s+|[1-4l]?\s*(?:Or,|[IiLlT]\.\s?e\.|Literally|There are mistakes|\"the fair))")
SIGNATURE = re.compile(r"^\s*[A-Z][a-z]?\s*$")


def ocr_tokens(lines):
    """[(word, page, first-on-its-line)] of an OCR copy, footnotes and heads
    out. A run of punctuation standing alone is joined to the word before."""
    s = next(i for i, l in enumerate(lines) if START in l)
    e = next(i for i in range(s, len(lines)) if END.match(lines[i]))
    toks, page, in_note = [], 15, False
    for l in lines[s:e]:
        t = norm_chars(l).strip()
        if not t:
            in_note = False
            continue
        if HEAD_ODD.match(t):
            page += 2
            in_note = False
            continue
        if HEAD_EVEN.match(t) or SIGNATURE.match(t):
            continue
        if NOTE.match(t) and not re.match(r"^\s*I\s+(will|have|am|live|pray|decree|give|moreover|myself|must)\b", t):
            in_note = True
        if in_note:
            continue
        for k, w in enumerate(t.split()):
            if toks and not letters(w) and not re.search(r"\d", w):
                pw, pp, pf = toks[-1]
                toks[-1] = (pw + w, pp, pf)
            else:
                toks.append((w, page, k == 0))
    # A word split at a line end ("know-" + "“ledge") is joined, with its
    # hyphen; Budge's quotation mark at the head of the line is dropped.
    out = []
    for w, p, first in toks:
        bare = w.lstrip("\"'")
        if out and out[-1][0].endswith("-") and not out[-1][0].endswith("--") and re.match(r"^[a-z]", bare):
            pw, pp, pf = out[-1]
            out[-1] = (pw + bare, pp, pf)
        else:
            out.append((w, p, first))
    return [t for t in out if letters(t[0])]


# --- comparison -------------------------------------------------------------

EDGES = re.compile(r"^([^A-Za-z]*)(.*?)([^A-Za-z]*)$")


def stops(t):
    """A word's punctuation outside its letters, without quotation marks,
    hyphens or rows of dots: (before, after)."""
    m = EDGES.match(re.sub(r"[\"']", "", t))
    before = m.group(1).replace("-", "")
    after = re.sub(r"\.{2,}", "", m.group(3)).replace("-", "")
    return before, after


def set_stops(word, before, after):
    """G's word with its punctuation outside the letters replaced, its quotation marks kept."""
    m = EDGES.match(word)
    lead_q = re.sub(r"[^\"']", "", m.group(1))
    trail_q = re.sub(r"[^\"']", "", m.group(3))
    return lead_q + before + m.group(2) + after + trail_q


def align(gn, other):
    sm = difflib.SequenceMatcher(None, gn, [letters(w) for w, _, _ in other], autojunk=False)
    at = {}
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                at[i1 + k] = j1 + k
    return sm, at


def rejected(g, w):
    return (g, re.sub(r"[\"']", "", w)) in REJECT


def consensus(gwords, e, i, log):
    """G's words, corrected where E and I agree against it; and each word's
    page. Words with no letters (G's rows of dots) are passed through."""
    idx = [k for k, w in enumerate(gwords) if letters(w)]
    gn = [letters(gwords[k]) for k in idx]
    sme, ate = align(gn, e)
    smi, ati = align(gn, i)
    log.append(
        f"words with letters: G {len(gn)}, E {len(e)}, I {len(i)}; "
        f"in-order agreement with G: E {sme.ratio():.3f}, I {smi.ratio():.3f} (the OCRs carry the hieroglyphic pages too); "
        f"G's words found in line in E {len(ate) / len(gn):.3f}, in I {len(ati) / len(gn):.3f}, in both {len(set(ate) & set(ati)) / len(gn):.3f}"
    )
    out = list(gwords)
    pages = [None] * len(gwords)
    for n, k in enumerate(idx):
        if n in ate:
            pages[k] = e[ate[n]][1]
        if n in ate and n in ati:
            g, we, wi = gwords[k], e[ate[n]][0], i[ati[n]][0]
            # G's marks standing apart after the word ("united (?)", "wind
            # . . . .;") count as its own, and such a word is never changed.
            after = []
            for j in range(k + 1, len(gwords)):
                if letters(gwords[j]):
                    break
                after.append(gwords[j])
            se, si, sg = stops(we), stops(wi), stops(g + "".join(after))
            if se == si != sg and "i.e" not in g:
                if after:
                    log.append(f"  punct NOT APPLIED @{n}: [{g} {' '.join(after)}] E [{we}] I [{wi}]")
                    continue
                new = set_stops(g, *se)
                if rejected(g, we):
                    log.append(f"  punct REJECTED @{n}: [{g}] -> [{new}]")
                else:
                    log.append(f"  punct @{n}: [{g}] -> [{new}]")
                    out[k] = new
            # Quotation marks inside a line differing in both copies: reported only.
            qe, qi, qg = (re.sub(r"[^\"']", "", x) for x in (we, wi, g))
            if not e[ate[n]][2] and not i[ati[n]][2] and qe == qi != qg:
                log.append(f"  QUOTES @{n}: G [{g}] E [{we}] I [{wi}] (not applied)")
    # Words: stretches where G differs from both.
    opi = {(i1, i2): (j1, j2) for op, i1, i2, j1, j2 in smi.get_opcodes() if op != "equal"}
    for op, i1, i2, j1, j2 in sme.get_opcodes():
        if op == "equal":
            continue
        g_seg = [gwords[idx[n]] for n in range(i1, i2)]
        e_seg = [w for w, _, _ in e[j1:j2]]
        span = opi.get((i1, i2))
        i_seg = [w for w, _, _ in i[span[0] : span[1]]] if span else None
        same = i_seg is not None and [letters(w) for w in e_seg] == [letters(w) for w in i_seg]
        if same and op == "replace" and len(e_seg) == len(g_seg) <= 4:
            pairs = list(zip(g_seg, e_seg))
            if any(rejected(g, w) for g, w in pairs):
                log.append(f"  words REJECTED @{i1}: [{' '.join(g_seg)}] -> [{' '.join(e_seg)}]")
                continue
            for n, (g, w) in zip(range(i1, i2), pairs):
                # The printed letters, with G's punctuation round them.
                m = EDGES.match(g)
                out[idx[n]] = m.group(1) + EDGES.match(w).group(2) + m.group(3)
            log.append(f"  words @{i1}: [{' '.join(g_seg)}] -> [{' '.join(out[idx[n]] for n in range(i1, i2))}]")
        elif len(g_seg) + len(e_seg) <= 40:
            shown = " ".join(i_seg) if i_seg is not None else "(differs)"
            log.append(f"  unresolved @{i1}: G [{' '.join(g_seg)}] E [{' '.join(e_seg)}] I [{shown}]")
        else:
            log.append(f"  unresolved @{i1}: G [{' '.join(g_seg)[:120]}] E [{len(e_seg)} words: OCR of a hieroglyphic page or a note]")
    # A word that did not line up (the numeral heading a section, a row of
    # dots) takes the page of the next word that did.
    nxt = 41
    for k in range(len(pages) - 1, -1, -1):
        if pages[k] is None:
            pages[k] = nxt
        nxt = pages[k]
    return out, pages


def tidy(text):
    """One paragraph as printed: dashes, Budge's rows of dots, curled quotes."""
    text = text.replace("--", "—")
    text = re.sub(r"\s+—", "—", text)
    text = re.sub(r"(?:\. ?){4,}\.?", ". . . . . ", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    text = re.sub(r"\. \. \. \. \. ([,;.])", r". . . . .\1", text)
    text = re.sub(r"\. \. \. \. \. \"(?= |$)", ". . . . .”", text)
    text = re.sub(r'(^|[\s(\[—])"', r"\1“", text)
    text = text.replace('"', "”")
    text = re.sub(r"(^|[\s(\[—“])'", r"\1‘", text)
    return text.replace("'", "’")


def main():
    g_lines, e_lines, i_lines = (read(p) for p in sys.argv[1:4])
    # G's paragraphs, rejoined where it broke one only to set a footnote.
    joined = []
    for p in g_paragraphs(g_lines):
        if p is None:
            continue
        if joined and any(joined[-1].endswith(j) for j in JOIN_AFTER):
            joined[-1] += " " + p
        else:
            joined.append(p)
    gwords, breaks = [], set()
    for p in joined:
        if gwords:
            breaks.add(len(gwords))
        gwords.extend(p.split())
    log = []
    words, pages = consensus(gwords, ocr_tokens(e_lines), ocr_tokens(i_lines), log)
    # One string with ¶ at the paragraph breaks; each token keeps its page.
    tokens = []
    for k, w in enumerate(words):
        if k in breaks:
            tokens.append(("¶", pages[k]))
        tokens.append((w, pages[k]))
    text = " ".join(w for w, _ in tokens)
    for wrong, right in FIXES:
        if wrong not in text:
            log.append(f"  FIX NOT FOUND: {wrong}")
        text = text.replace(wrong, right)
    starts = [text.find(first) for _, _, _, first in PARTS]
    assert all(s >= 0 for s in starts), [p[3] for p, s in zip(PARTS, starts) if s < 0]
    assert starts == sorted(starts), "parts out of order"
    # The FIXES change no word count, so a part's pages are those of its first
    # and last tokens.
    assert len(text.split()) == len(tokens), "a FIX changed the number of words"

    def page_at(offset):
        return tokens[len(text[: offset + 1].split()) - 1][1]

    rows = []
    for n, (section, part, label, first) in enumerate(PARTS):
        a = starts[n]
        b = starts[n + 1] if n + 1 < len(PARTS) else len(text)
        chunk = text[a:b].strip().strip("¶").strip()
        p1, p2 = page_at(a), page_at(a + len(chunk) - 1)
        body = "\n\n".join(tidy(p) for p in chunk.split("¶") if p.strip())
        rows.append({"section": section, "part": part, "label": label, "pages": f"p. {p1}" if p1 == p2 else f"pp. {p1}–{p2}", "text": body})
    for line in log:
        print(line, file=sys.stderr)
    out = sys.stdout
    out.write("// GENERATED by scripts/texts/budge-heavenly-cow.py from three copies of\n")
    out.write("// E. A. Wallis Budge, Legends of the Gods (1912), \"The Legend of the\n")
    out.write("// Destruction of Mankind\", pp. 15-41 (his English only). Do not edit by\n")
    out.write("// hand: correct the generator (its FIXES and REJECT lists hold every\n")
    out.write("// decision made by hand) and run it again.\n\n")
    out.write("export type CowPart = {\n")
    out.write("  /** Budge's section, 1-5 (he prints no numeral on the first). */\n  section: number;\n")
    out.write("  /** The archive's part within a long section; 0 for a section kept whole. */\n  part: number;\n")
    out.write("  label: string;\n")
    out.write("  /** Budge's printed pages, read from a scanned copy's running heads. */\n  pages: string;\n")
    out.write("  /** Budge's English, paragraphs separated by blank lines. */\n  text: string;\n};\n\n")
    out.write("export const COW_PARTS: CowPart[] = [\n")
    for r in rows:
        out.write("  " + json.dumps(r, ensure_ascii=False) + ",\n")
    out.write("];\n")


if __name__ == "__main__":
    main()
