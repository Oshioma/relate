#!/usr/bin/env python3
"""Mead's Pistis Sophia (1921), chapter by chapter, for the ancient-texts archive.

    python3 -I scripts/texts/mead-pistis-sophia.py GLOBALGREY.txt CELEPHAIS.txt BYU.txt \\
        > src/lib/timeline/texts/corpus/pistis-sophia-text.ts 2> report.txt

Inputs (all of G. R. S. Mead, Pistis Sophia: A Gnostic Miscellany, 2nd ed.,
London: John M. Watkins, 1921; public domain):

  G  the Global Grey e-book (globalgrey.co.uk, 2013) as plain text: a clean
     transcription, the BASE. It prints Mead's marginal side-headings as lines
     of their own, has turned his dashes into hyphens and his quotation marks
     into straight ones, and drops his codex page numbers.
  C  the Celephais Press e-text (2007), an OCR of a scan of the 1921 book.
  B  the archive.org OCR of the BYU copy (pistissophiagnos1921mead).

C and B are independent of G and of each other (different scans, different
OCR), so where both agree against G, G is usually wrong. The script:

  1. cuts G into Mead's books and chapters (G lacks the heading of chapter
     19, placed from the CHAP. mark in C and B; it prints 144 as "Chapter");
  2. takes out Mead's side-headings (kept apart, for the notes), telling them
     from text by whether C's running text contains them;
  3. compares the whole text word by word with C and with B and lists in the
     report every short stretch where C and B agree with each other against
     G, and every stretch where G stands alone. These are NOT applied
     automatically: both OCRs splice words of Mead's margin into the text at
     the same places, so each reading was judged by hand;
  4. restores Mead's dashes from C and B, curls the quotation marks, and
     applies FIXES, the corrections made by hand after reading the report
     (only certain errors: misread letters, stray marks, run-together words
     and lines, hyphens left from line breaks, quotation marks and colons G
     dropped or set in the wrong order, side-headings G ran into the text,
     and a paragraph and a sentence G lost).

G (and so this text) drops the long-vowel marks Mead prints on the magical
names (e.g. "psinother" for his "psinōther"); the names are otherwise as G
gives them. Mead's footnotes, introduction and side-headings are not part of
the text.
"""

import difflib
import json
import re
import sys

# --- corrections made by hand after reading the report: (chapter, wrong, right)
# Chapter 0 = wherever it occurs. Each is a misreading in G where both C and
# B read otherwise (listed in the report), or plain debris.
FIXES = [
    (0, "below.1", "below.’"),  # C: "below.’"
    (0, "Pistis Sophis", "Pistis Sophia"),
    (0, " hi soul", " his soul"),
    (25, "everyone of them remained", "every one of them remained"),
    (0, "gone-down", "gone down"),
    (0, "powerfrom", "power from"),
    (0, "sp read", "spread"),
    (0, "Norl-and dragon-faced", "lion- and dragon-faced"),
    (0, "thon hast", "thou hast"),
    (0, "Fathergive", "Father give"),
    (0, "in Booth", "in sooth"),
    (0, "alreadysaid", "already said"),
    (0, "inthe ", "in the "),
    (0, "fareasierthan", "far easier than"),
    (0, "saviourand", "saviour and"),
    (0, "andrenounceth", "and renounceth"),
    (0, "ceaseth her light-power", "casteth her light-power"),
    (0, "‘lam come", "‘I am come"),
    (0, "overall", "over all"),
    (0, "cloth she", "doth she"),
    (127, "forever", "for ever"),
    (0, "theTreasury", "the Treasury"),
    (0, "Aberamenth6", "Aberamentho"),
    (0, "therdpsin dpsither", "theropsin opsither"),
    (0, "Ameute", "Amente"),
    (0, "play—acting", "play-acting"),
    # Dashes after punctuation that G turned into hyphens and the dash pass missed.
    (0, "mid-day,’-that is", "mid-day,’—that is"),
    (0, "mid-day,’-’mid-day", "mid-day,’—‘mid-day"),
    (0, "dwelling-place,’-it is", "dwelling-place,’—it is"),
    (0, "triple-powers,-those", "triple-powers,—those"),
    (0, "Light-kingdom, -then", "Light-kingdom,—then"),
    (0, "play-acting,-they", "play-acting,—they"),
    (0, "Light-kingdom, -now", "Light-kingdom,—now"),
    (0, "soul,-—those", "soul,—those"),
    (0, "Under-stand", "Understand"),
    # Mead's footnote 2 (on moving two sentences) is left out with its marker.
    (100, "unknowing?” 2", "unknowing?”"),
    (0, "deseendeth", "descendeth"),
    (0, "disciples for thee7", "disciples for thee?"),
    (0, "‘0 Mystery", "‘O Mystery"),  # C
    (0, "‘0 Light", "‘O Light"),
    (0, "It came, to pass", "It came to pass"),  # C
    (0, "Ariouth the /Ethiopian", "Ariouth the Ethiopian"),
    (0, "therefore fore will he", "therefore will he"),  # C: "there-/fore"
    (0, "cried unto, thee", "cried unto thee"),  # C
    (0, "ye have received, of my spirit", "ye have received of my spirit"),  # C
    (0, "and said.: Well", "and said: Well"),
    (0, "surrounded. Pistis Sophia, desiring to ‘take away", "surrounded Pistis Sophia, desiring to take away"),  # C
    (0, "all regions u from", "all regions from"),  # C
    (0, "Fulness,,", "Fulness,"),  # C
    (0, "aforetime, I when", "aforetime, when"),  # C: a margin bar
    (0, "he time of his investiture", "the time of his investiture"),  # C's contents
    (0, "f our-and-twenty", "four-and-twenty"),
    (0, "discourse anti said", "discourse and said"),
    (0, "emanations of my eon", "emanations of my aeon"),  # B
    (0, "generation of generation^]", "generation of generation[s]"),  # C, B
    (0, "Fate and Of the sphere", "Fate and of the sphere"),  # C, B
    # Full stops G puts in the middle of a sentence (C and B have none), and
    # two of the printed page numbers.
    (0, "she. had seen", "she had seen"),
    (0, "her. repentance", "her repentance"),
    (0, "his. mother", "his mother"),
    (0, "power to go. into", "power to go into"),
    (0, "make it. into", "make it into"),
    (0, "the. retributive", "the retributive"),
    (0, "songs of praise and. all", "songs of praise and all"),
    (0, "all the . sins", "all the sins"),
    (0, "come out of. the body", "come out of the body"),
    (0, "Light and. lead", "Light and lead"),
    (0, "light-stream 1 130. into", "light-stream into"),
    (0, "murderer who 1 382. hath", "murderer who hath"),
    (0, "Sell-willed", "Self-willed"),
    (57, "“7. Wash me", "“2. Wash me"),  # C: "2."  # C: "descendeth"
    (0, "little lao", "little Iao"),  # C: "Iao"
    (0, "great lao", "great Iao"),
    (0, "great I nvisible", "great Invisible"),
    (0, "lneffable", "Ineffable"),
    (0, "theirtwelve", "their twelve"),
    (0, "mightychastisement", "mighty chastisement"),
    (0, "fi rst", "first"),
    (0, "into the coons of", "into the aeons of"),
    (0, "into the peons of", "into the aeons of"),
    (0, "psindther therndps nopsither", "psinother thernops nopsither"),  # C, B
    (0, "dzo/’", "dzo’"),
    (0, "nethmomadth nepsiomadth", "nethmomaoth nepsiomaoth"),  # B; C has the first
    # Psalm numbers: G reads Mead's "l" as "I".
    (0, "Ixxxvii", "lxxxvii"),
    (0, "Ixxxiv", "lxxxiv"),
    (0, "Ixviii", "lxviii"),
    (0, "Ixix", "lxix"),
    (0, "Ixx", "lxx"),
    # Hyphens left in G where a word was broken at a line end (the joined form
    # is how Mead prints the word elsewhere).
    (0, "be-ginning", "beginning"),
    (0, "con-found", "confound"),
    (0, "de-creed", "decreed"),
    (0, "fore-fathers", "forefathers"),
    (0, "forget-fulness", "forgetfulness"),
    (0, "god-head", "godhead"),
    (0, "in-creased", "increased"),
    (0, "in-dweller", "indweller"),
    (0, "man-kind", "mankind"),
    (0, "out-going", "outgoing"),
    (0, "outer-most", "outermost"),
    (0, "pre-pared", "prepared"),
    (0, "straight-way", "straightway"),
    (0, "un-repentant", "unrepentant"),
    (0, "up-right", "upright"),
    (0, "your-selves", "yourselves"),
    # Chapter 143: Mead prints these letter-names in Greek; G, C and B each
    # garble the Greek differently, so the unreadable ones are marked, not guessed.
    (0, "aaa, 666;", "aaa, (Greek letters omitted);"),
    (0, "motion: /’/’/’.", "motion: (Greek letters omitted)."),
    (0, "mmm or 666", "mmm or (Greek letters omitted)"),
    (0, "its interpretation \\sfff;", "its interpretation is fff;"),
    (0, "which \\sfff,", "which is fff,"),
    (0, "isooo", "is ooo"),
    (0, "ps ps ps", "pspsps"),
    # Stray marks and letters in G (B and Mead's sense agree).
    (58, "thou art! my hope", "thou art my hope"),
    (60, "—l was above the chaos", "—I was above the chaos"),
    (63, "Treasury of the Light., and", "Treasury of the Light, and"),
    (63, "said unto—him", "said unto him"),
    (64, "when, it had taken", "when it had taken"),
    (67, "as a shield/—", "as a shield,’—"),
    # Opening quotation marks G drops (B has them).
    (61, "said unto me: Where is Jesus", "said unto me: ‘Where is Jesus"),
    (65, "spoken: It was led over", "spoken: ‘It was led over"),
    (65, "spoken: They have received again", "spoken: ‘They have received again"),
    (67, "spoken: He will not be afraid of an arrow", "spoken: ‘He will not be afraid of an arrow"),
    (69, "spoken: I was relieved", "spoken: ‘I was relieved"),
    (71, "spoken: Who hath smitten", "spoken: ‘Who hath smitten"),
    (70, "thou Wert with me", "thou wert with me"),
    (71, "to lead the out of", "to lead me out of"),
    (72, "uttered, Now, therefore", "uttered. Now, therefore"),
    (74, "removed, me", "removed me"),
    (77, "the twelve moons", "the twelve aeons"),
    (86, "in the E inheritances", "in the inheritances"),
    (86, "received the I eighth", "received the eighth"),
    (91, "which are above, him", "which are above him"),
    (95, "Thrice-spiritual-have rent", "Thrice-spiritual—have rent"),
    (95, "Thrice-spiritual-that is", "Thrice-spiritual—that is"),
    (98, "with a higher, seal", "with a higher seal"),
    (103, "\n\nAnd again they take pity", "\n\n“And again they take pity"),
    (104, "—l answered", "—I answered"),
    (105, "begin to, question", "begin to question"),
    (105, "hath turned; again", "hath turned again"),
    (111, "saying:\n\nSearch ever", "saying: Search ever"),
    (112, "Take your destiny!\n\nI come not", "Take your destiny! I come not"),
    (117, "in the type | of the baptisms", "in the type of the baptisms"),
    (117, "all the sine which", "all the sins which"),
    (119, "First Mystery, | having", "First Mystery, having"),
    (126, "with his name called Xarmaroch.’", "with his name called ‘Xarmaroch.’"),
    (126, "in his region Rochar.’", "in his region ‘Rochar.’"),
    (130, "when he I came forth", "when he came forth"),
    (130, "into I the everlasting", "into the everlasting"),
    (131, "And. I will tell", "And I will tell"),
    (132, "saying unto them: This is the type", "saying unto them: ‘This is the type"),
    (132, "forceth his death, upon him", "forceth his death upon him"),
    (134, "doctrines of error, I whence", "doctrines of error, whence"),
    (136, "What is this region in which we are?\n\nJesus said", "What is this region in which we are?”\n\nJesus said"),
    (137, "triple—powered", "triple-powered"),
    (138, "adored Jesus and said “Blessed", "adored Jesus and said: “Blessed"),
    (141, "kingdom of thy father?\n\nAnd Jesus said", "kingdom of thy father?”\n\nAnd Jesus said"),
    # Chapter 142: G runs a sentence of text into the side-heading beside it,
    # so it is restored here and taken off the side-heading (B, C).
    (142, "kingdom of my father.”\n\nJesus said unto them: “This is the manner",
     "kingdom of my father.”\n\nAnd when he said this, the disciples rejoiced in great joy.\n\nJesus said unto them: “This is the manner"),
    (142, "And when he said this, the disciples rejoiced in great joy. Directions as to", "Directions as to"),
    (142, "[of heaven)", "(of heaven)"),
    (142, "{have mercy upon me)", "(have mercy upon me)"),
    (142, "Hear me, 0 Father", "Hear me, O Father"),
    (142, "\n\nIf thou then, Father", "\n\n“If thou then, Father"),
    (144, "or what is, his chastisement", "or what is his chastisement"),
    (144, "into the chaos before. Yaldabaoth", "into the chaos before Yaldabaoth"),
    (145, "what is his chastisement?\n\nJesus answered", "what is his chastisement?”\n\nJesus answered"),
    (146, "overweening man.” Thomas said:", "overweening man.”\n\nThomas said:"),
    (147, "who path not been", "who hath not been"),
    (130, "Mary then answered and said “My Lord", "Mary then answered and said: “My Lord"),
    (100, "material refuse For this cause", "material refuse. For this cause"),
    (102, "pitch—and fire-coats", "pitch- and fire-coats"),
    (102, "sulphur—and pitch-seas", "sulphur- and pitch-seas"),
    (95, "mystery of, the Ineffable", "mystery of the Ineffable"),
    (0, "[pi.]", "[pl.]"),  # Mead's "plural"
    (93, "\n\nYet further, O my disciples, hearken", "\n\n“Yet further, O my disciples, hearken"),
    (87, "“It came to pass then, when Jesus had finished speaking these words, that Mary Magdalene started forward and said:\n\n“My Lord",
     "It came to pass then, when Jesus had finished speaking these words, that Mary Magdalene started forward and said: “My Lord"),
]
# Patterns corrected throughout: G sets the quotation marks that open a verse
# of a psalm or song in the wrong order ('" for Mead's “‘, as B shows), and
# reads Mead's "I" as the digit 1 before a verb.
REGEX_FIXES = [
    (r"(^|\s)‘“", r"\1“‘"),
    (r"\b1 (am|will|have|was|sing|gazed|sank|bowed|put|cried|chose)\b", r"I \1"),
    # a closing quotation mark curled the wrong way round
    (r"([.?!,;:])“$", r"\1”"),
    (r"’“$", r"’”"),
    (r" ‘([;,])", r"’\1"),
    # Lines G runs together without a paragraph break, where the quotation
    # marks then go astray.
    (r"dwelling-place\.’[“”]This then, my Lord", "dwelling-place.’\n\n“This then, my Lord"),
    (r"emanation of the Light-land\.[“”]It came to pass then", "emanation of the Light-land.\n\n“It came to pass then"),
    (r"rule with me in my kingdom\.[“”]He is a man in the world, but he is king in the Light\. [“”]He is a man in the world, but he is not one of the world\.[“”]And amen",
     "rule with me in my kingdom.\n\n“He is a man in the world, but he is king in the Light.\n\n“He is a man in the world, but he is not one of the world.\n\n“And amen"),
    (r"inheriteth the Light-kingdom\.[“”]And if ye say this", "inheriteth the Light-kingdom. And if ye say this"),
    (r"[“”]He continued in the discourse and said:[“”]The second order is called Ariouth the /?Ethiopian", "He continued in the discourse and said: “The second order is called Ariouth the Ethiopian"),
    # Chapter 57: G runs three lines together, and the quotation marks go astray.
    (r"judgest me\.[‘’“”]{1,2}This is then the solution of the words which Pistis Sophia hath uttered\.[‘’“”]Jesus said unto her:[‘’“”]Well said, finely, Martha, blessed \[one\]\.[‘’“”]",
     "judgest me.’\n\n“This is then the solution of the words which Pistis Sophia hath uttered.”\n\nJesus said unto her: “Well said, finely, Martha, blessed [one].”"),
    (r"([.?!,;:]) ?‘—", r"\1’—"),
    # G breaks a quotation off from its introduction ("… hath spoken:" ending a
    # paragraph) and often drops the ‘; Mead runs them on (B, C).
    (r"hath spoken:\n\n(?=[A-Z])", "hath spoken: ‘"),
    (r"hath spoken:\n\n‘", "hath spoken: ‘"),
    # G drops the colon after "I say unto you" before the saying (B, C have it).
    (r"I say unto you (?=[A-Z])", "I say unto you: "),
]
def mend_verses(paragraphs, number, log):
    """Verses of the psalms and odes open with Mead's “‘N. G often loses the ‘,
    and then reads ‘2 as 7 (“7. for “‘2., “70. for “‘20., as B shows). A leading
    7 is read as 2 only where that continues the count of the verse before."""
    out, prev = [], None
    # G runs some verses on into the one before ('… oppressed.”’18. Hear me');
    # Mead prints each as a paragraph of its own.
    split = []
    for t in paragraphs:
        pieces = [x for x in re.split(r"\s*[‘’“”]{1,2}(?=\d{1,2}\. [A-Z])", t) if x.strip()]
        if len(pieces) < 2:
            split.append(t)
            continue
        log.append(f"  chapter {number}: verses run together in G split apart: {len(pieces)}")
        split.extend([pieces[0]] + ["“‘" + x for x in pieces[1:]] if t.startswith(pieces[0]) else ["“‘" + x for x in pieces])
    for t in split:
        m = re.match(r"^“‘?(\d+)\. ", t)
        if not m:
            out.append(t)
            prev = None if not t.startswith("“") else prev
            continue
        n = int(m.group(1))
        digits = m.group(1)
        if digits.startswith("7") and prev is not None:
            as_two = int("2" + digits[1:])
            if prev < as_two <= prev + 3 and not (prev < n <= prev + 3):
                log.append(f"  chapter {number}: verse {digits} read as {as_two} (after {prev})")
                n = as_two
        t = f"“‘{n}. " + t[m.end():]
        out.append(t)
        prev = n
    return out


# Whole paragraphs of G that are not Mead's text: (chapter, start).
DROPS = [
    (101, "2 These two sentences are placed"),  # Mead's footnote, run into the text
    (101, "[THE CONCLUSION OF ANOTHER BOOK]"),  # Mead's heading; it names the book passage
]
# Text G has lost, restored from C and B (which agree): (chapter, before the
# paragraph starting with ..., or None = at the start, the restored text).
INSERTS = [
    (
        20,
        None,
        "It came to pass then, when Mary had finished saying these words, that he said: “Well said, Mary, for thou art blessed before all women on the earth, because thou shalt be the fulness of all fulnesses and the perfection of all perfections.” Now when Mary had heard the Saviour speak these words, she exulted greatly, and she came before Jesus, fell down before him, adored his feet and said unto him: “My Lord, hearken unto me, that I may question thee on this word, before that thou discoursest with us about the regions whither thou didst go.” Jesus answered and said unto Mary: “Discourse in openness and fear not; all things on which thou questionest, I will reveal unto thee.”",
    ),
]

# Placement of the chapter heading G lacks: (chapter, first words in G).
MISSING_CHAPTERS = [
    # C and B print "CHAP. 19." in the margin of p. 21, beside the paragraph
    # that resumes Mary's reading of Isaiah.
    (19, '"The power then which was in the prophet Isaiah, prophesied before thou didst come'),
]

BOOKS = [
    # (key, Mead's heading, first chapter, last chapter)
    ("book-1", "The First Book of Pistis Sophia", 1, 62),
    ("book-2", "The Second Book of Pistis Sophia", 63, 100),
    ("another-book", "A Portion of the Books of the Saviour: the conclusion of another book", 101, 101),
    ("book-3", "A Third Book", 102, 125),
    ("book-4", "A Fourth Book", 126, 135),
    ("book-5", "A Fifth Book", 136, 143),
    ("book-6", "A Sixth Book", 144, 148),
]

FURNITURE = re.compile(r"^\s*(www\.globalgrey\.co\.uk|Pistis\s+Sophia\s+By\s+G\.R\.S\.\s+Mead|\d{1,3})\s*$")
HEADINGS = {
    "THE FIRST BOOK OF PISTIS SOPHIA",
    "THE SECOND BOOK OF PISTIS SOPHIA",
    "A THIRD BOOK",
    "A FOURTH BOOK",
    "A FIFTH BOOK",
    "A SIXTH BOOK",
    "A PORTION OF THE BOOKS OF THE SAVIOUR",
    "THE END.",
}
# Mead's bracketed editorial lines that open the extra passages.
EXTRA_STARTS = {
    "[THE NOTE OF A SCRIBE]": "scribe-note",
    "[SUB-SCRIPTION:]": "subscription",
    "[A LATER POSTSCRIPT]": "postscript",
}


def sp(s):
    return re.sub(r"\s+", " ", s).strip()


def norm(w):
    return re.sub(r"[^a-z]", "", w.lower().replace("æ", "ae"))


# --------------------------------------------------------------------------- G
def read_g(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    start = next(i for i, l in enumerate(lines) if sp(l) == "THE FIRST BOOK OF PISTIS SOPHIA")
    end = next(i for i, l in enumerate(lines) if sp(l) == "THE END.")
    paras, cur, page_break = [], [], False
    for l in lines[start:end]:
        if FURNITURE.match(l):
            page_break = True
            continue
        if not l.strip():
            if cur:
                paras.append({"lines": cur, "after_page": False})
                cur = []
            continue
        if not cur and page_break and paras:
            paras[-1]["after_page"] = True
        page_break = False
        if is_heading(sp(l)):
            # A heading printed on the line after text, with no blank line between.
            if cur:
                paras.append({"lines": cur, "after_page": False})
                cur = []
            paras.append({"lines": [sp(l)], "after_page": False})
            continue
        cur.append(sp(l))
    if cur:
        paras.append({"lines": cur, "after_page": False})
    # A paragraph cut by a page break: the next block starts in mid-sentence.
    out = []
    for p in paras:
        text = join_lines(p["lines"])
        if out and out[-1]["after_page"] and (re.match(r"^[a-z,;:.)\]-]", text) or not re.search(r"[.!?:;\"')\]]$", out[-1]["text"])):
            if not is_heading(text) and not is_heading(out[-1]["text"]):
                out[-1]["text"] = join_lines([out[-1]["text"], text])
                out[-1]["after_page"] = p["after_page"]
                out[-1]["lines"] += p["lines"]
                continue
        out.append({"text": text, "after_page": p["after_page"], "lines": p["lines"]})
    return out


def join_lines(lines):
    text = ""
    for l in lines:
        if not text:
            text = l
        elif text.endswith("-") and not text.endswith("--") and re.search(r"[A-Za-z]-$", text):
            text += l  # G keeps a real hyphen at its own line end ("light-" / "power")
        else:
            text += " " + l
    return text


def is_heading(text):
    return bool(re.match(r"^CHAPTER \d+\.?$", text, re.I)) or text in HEADINGS or text in EXTRA_STARTS or text.startswith("[") and text.upper() == text


# ------------------------------------------------------------------ C and B
def read_ocr(path, first_words):
    lines = open(path, encoding="utf-8", errors="replace").read().split("\n")
    key = norm(first_words)
    start = next(i for i, l in enumerate(lines) if norm(l).startswith(key))
    body, margin = [], []
    for l in lines[start:]:
        t = l.rstrip()
        if not t.strip():
            continue
        if re.match(r"^\s*(\d+\s+)?PISTIS\s+SOPHIA(\s+\d+)?\s*$", t) or re.match(r"^\s*[A-Z ]+\s+\d+\s*$", t):
            continue  # running head
        if len(t.strip()) < 24:
            margin.append(t.strip())  # side-headings, page and chapter numbers
        else:
            body.append(t.strip())
    text = ""
    for l in body:
        l = l.replace("|", " ")
        if text.endswith("-") and re.search(r"[a-z]-$", text):
            text = text[:-1] + l
        else:
            text += " " + l
    return text, " ".join(margin)


def tokens(text):
    return [w for w in text.split() if norm(w)]


# --------------------------------------------------------------------- dashes
def dash_pairs(texts):
    """(word before, word after) around an em dash in C and B; and around a real hyphen."""
    dash, hyph = set(), set()
    for t in texts:
        for m in re.finditer(r"([A-Za-zæ’'\]\)]+)[,;:.!?’'”\"\]\)]*\s*[—–]+\s*[“\"‘']?\s*([A-Za-zæ\[]+)", t):
            dash.add((norm(m.group(1)), norm(m.group(2))))
        for m in re.finditer(r"([A-Za-zæ]+)-([A-Za-zæ]+)", t):
            hyph.add((norm(m.group(1)), norm(m.group(2))))
    return dash, hyph


def restore_dashes(text, dash, hyph, log, where):
    # "--" and " -x" / "x- " / ",-x" are dashes in G.
    text = re.sub(r"\s*--\s*", "—", text)

    def one(m):
        a, b = m.group(1), m.group(3)
        pair = (norm(re.sub(r"[^A-Za-zæ]+$", "", a)), norm(b))
        punct_before = bool(re.search(r"[,;:.!?'\")\]]$", a))
        spaced = m.group(2) != "-"
        if punct_before or spaced:
            return f"{a}—{b}"
        if pair in dash and pair not in hyph:
            return f"{a}—{b}"
        if pair in dash and pair in hyph:
            log.append(f"  {where}: '{a}-{b}' is both dash and hyphen in C/B; kept hyphen")
        return f"{a}-{b}"

    return re.sub(r"(\S+?)(\s*-\s*|-)([\[\"'A-Za-zæ(][^\s-]*)", one, text)


# --------------------------------------------------------------------- quotes
def curl(text):
    out, open_ = [], False
    for ch in text:
        if ch == '"':
            ch = "”" if open_ else "“"
            open_ = not open_
        out.append(ch)
    text = "".join(out)
    text = re.sub(r"“\s+", "“", text)
    text = re.sub(r"\s+”", "”", text)
    text = re.sub(r"(^|[\s(\[—“])'", r"\1‘", text)
    text = text.replace("'", "’")
    text = re.sub(r"‘\s+", "‘", text)
    text = re.sub(r"\s+’(?=[\s,.;:!?—”)]|$)", "’", text)
    return text


# ------------------------------------------------------------------ chapters
def split_chapters(paras, log):
    """[(chapter, [paragraph texts])], extras {key: [texts]} and book of each chapter."""
    # Insert the two missing headings.
    for chapter, first in MISSING_CHAPTERS:
        idx = next(i for i, p in enumerate(paras) if p["text"].startswith(first))
        paras.insert(idx, {"text": f"CHAPTER {chapter}", "after_page": False, "lines": []})
    chapters, extras, cur, extra = [], {}, None, None
    sub_n = 0
    for p in paras:
        t = p["text"]
        m = re.match(r"^CHAPTER (\d+)\.?$", t, re.I)
        if m:
            cur = [int(m.group(1)), []]
            chapters.append(cur)
            extra = None
            continue
        if t in EXTRA_STARTS:
            kind = EXTRA_STARTS[t]
            if kind == "subscription":
                sub_n += 1
                kind = f"subscription-{sub_n}"
            extra = kind
            extras[extra] = []
            if kind == "postscript" or kind == "scribe-note":
                continue
            continue
        if t in HEADINGS:
            if extra and extra.startswith("subscription") and t == "A PORTION OF THE BOOKS OF THE SAVIOUR":
                extras[extra].append(t)
            continue
        if extra:
            extras[extra].append(t)
            continue
        if cur is None:
            log.append(f"  text before chapter 1: {t[:60]}")
            continue
        cur[1].append(t)
    numbers = [c[0] for c in chapters]
    assert numbers == list(range(1, 149)), numbers
    return chapters, extras


def read_contents(path, first_words):
    """Mead's table of contents in C, which lists every side-heading, one per line."""
    text = open(path, encoding="utf-8", errors="replace").read()
    front = text[: text.index(first_words)]
    return {norm(line) for line in front.split("\n") if 8 < len(line.strip()) < 120}


# Side-headings G sets inside a paragraph: (chapter, heading).
INLINE_HEADINGS = [
    (8, "More concerning the light-powers in the disciples."),
    (62, "Of the spiritual and material bodies of Jesus."),
    (52, "Jesus is sent to help her."),
    (140, "Of Ariouth the Ethiopian."),
    (62, "Mary, the mother, again further interpreteth the same scripture from the meeting of herself with Elizabeth, mother of John the Baptizer."),
    (86, "Of the twelve saviours and their regions in the Inheritance."),
    (118, "Mary interpreteth the same from Psalm xxxi."),
    (66, "Sophia again crieth to the Light"),
    (66, "Jesus, the First Mystery looking without, causeth Sophia to triumph"),
    (98, "Of the mysteries of the three spaces"),
    (99, "Of those of the third space, the first from without"),
    (119, "Of such initiated who sin and die without repentance"),
]

# Side-headings run onto the end of a paragraph that the contents list in C
# does not give legibly.
EXTRA_TAILS = {"Such souls are one with the First Mystery"}


def heading_suffix(t, contents):
    """The side-heading G has run onto the end of a paragraph, if any: a
    contents line, starting with a capital, after a sentence end or in the
    middle of a sentence (G's "… that Of the glory of the Treasury")."""
    words = t.split(" ")
    for k in range(min(len(words) - 1, 16), 1, -1):
        tail = " ".join(words[-k:])
        if tail in EXTRA_TAILS:
            return " ".join(words[:-k]), tail
        if not tail[:1].isupper() or k < 3 or len(norm(tail)) < 12 or norm(tail) not in contents:
            continue
        head = " ".join(words[:-k])
        if head[-1:] in ".?!:”’;" or head.split(" ")[-1][:1].islower():
            return head, tail
    return None


def mend_breaks(paragraphs, contents, side, number, log):
    """Join a paragraph that G broke round a side-heading, and take out a
    side-heading G ran onto the end of a paragraph."""
    out = []
    for t in paragraphs:
        for ex, heading in INLINE_HEADINGS:
            if ex == number and heading in t:
                t = re.sub(r"\s*" + re.escape(heading) + r"\s*", " ", t).strip()
                side.append(heading)
        if not t:
            continue
        found = heading_suffix(t, contents)
        if found:
            t, tail = found
            side.append(tail)
            log.append(f"  chapter {number}: side-heading taken off the end of a paragraph: {tail}")
        if out and (t[:1].islower() or (t[:1].isupper() and out[-1][-1:].isalpha() and out[-1][-1:].islower())):
            out[-1] = out[-1] + " " + t
        else:
            out.append(t)
    return out


def is_side_note(t, c_body_norm, margin_norm, contents=frozenset()):
    """Mead's side-heading: a short line of G that C's running text does not contain."""
    if len(t) > 120 or t.startswith('"') or t.startswith("'") or t.startswith("[") or t.startswith(". . ."):
        return None
    n = norm(t)
    if len(n) < 6:
        return None
    if n in contents:
        return True  # listed as a side-heading in Mead's table of contents
    if n in c_body_norm:
        return False
    if n[:40] in margin_norm or n[-30:] in margin_norm:
        return True
    if '"' in t or ":" in t or t.startswith("And ") or t.startswith("When then ") or t.startswith("("):
        return False  # a short paragraph of text, which C splits round its margin
    return "unconfirmed"


# Lines of G that join a sentence of text to the side-heading beside it.
SPLITS = {
    'Jesus said unto her: "Well said, Mary." The repentance of Sophia is accepted.': ('Jesus said unto her: "Well said, Mary."', "The repentance of Sophia is accepted."),
    "And the First Mystery continued again and said: Sophia continueth to sing": ("And the First Mystery continued again and said:", "Sophia continueth to sing"),
    "And the sign which Jesus had said [? besought] happened. The rite is consummated.": ("And the sign which Jesus had said [? besought] happened.", "The rite is consummated."),
    "Mary questioneth Jesus.lt": (None, "Mary questioneth Jesus."),
    "Sophia singeth a song of praise": (None, "Sophia singeth a song of praise"),
    "Of the glory of the Inheritance": (None, "Of the glory of the Inheritance"),
    "Of the first Commandment": (None, "Of the first Commandment"),
    'And when he had said this, he said: "Under-stand ye what I say?" Mary interpreteth the words of Jesus.': ('And when he had said this, he said: "Under-stand ye what I say?"', "Mary interpreteth the words of Jesus."),
}


def lis(pairs):
    """Longest chain of (g, o) pairs increasing in both."""
    import bisect

    tails, idx, prev = [], [], [None] * len(pairs)
    for k, (_, o) in enumerate(pairs):
        pos = bisect.bisect_left(tails, o)
        if pos == len(tails):
            tails.append(o)
            idx.append(k)
        else:
            tails[pos] = o
            idx[pos] = k
        prev[k] = idx[pos - 1] if pos > 0 else None
    out, k = [], idx[-1] if idx else None
    while k is not None:
        out.append(pairs[k])
        k = prev[k]
    return out[::-1]


def align(g, o):
    """Opcodes aligning two long word lists: anchored on five-word runs found
    once in each (as in patience diff), with difflib in the gaps between."""
    def grams(seq):
        seen = {}
        for i in range(len(seq) - 4):
            key = tuple(seq[i : i + 5])
            seen[key] = -1 if key in seen else i
        return seen

    gg, og = grams(g), grams(o)
    pairs = sorted((i, og[k]) for k, i in gg.items() if i >= 0 and og.get(k, -1) >= 0)
    anchors = lis(pairs)
    ops = []
    gi = oi = 0
    for ga, oa in anchors + [(len(g), len(o))]:
        if ga < gi or oa < oi:
            continue
        if ga - gi or oa - oi:
            if (ga - gi) * (oa - oi) <= 4_000_000:
                sm = difflib.SequenceMatcher(None, g[gi:ga], o[oi:oa], autojunk=False)
                for op, i1, i2, j1, j2 in sm.get_opcodes():
                    ops.append((op, gi + i1, gi + i2, oi + j1, oi + j2))
            else:
                ops.append(("replace", gi, ga, oi, oa))
        if ga < len(g):
            ops.append(("equal", ga, ga + 5, oa, oa + 5))
        gi, oi = ga + 5, oa + 5
    return ops


def compare(chapters, c_tokens, b_tokens, log):
    """Word-by-word comparison of the whole text with C and with B; returns
    per-chapter replacements where C and B agree against G."""
    g, owner = [], []
    for ci, (number, paras) in enumerate(chapters):
        start = len(g)
        for w in (w for p in paras for w in tokens(p)):
            g.append(w)
            owner.append((number, len(g) - 1 - start))
    gn = [norm(w) for w in g]
    cn = [norm(w) for w in c_tokens]
    bn = [norm(w) for w in b_tokens]
    oc = align(gn, cn)
    ob = align(gn, bn)
    stats = {"words": len(gn), "agree_c": sum(i2 - i1 for op, i1, i2, _, _ in oc if op == "equal"), "agree_b": sum(i2 - i1 for op, i1, i2, _, _ in ob if op == "equal"), "fixed": 0, "alone": 0}
    bmap = {(i1, i2): bn[j1:j2] for op, i1, i2, j1, j2 in ob if op != "equal"}
    bequal = [False] * (len(gn) + 1)
    for op, i1, i2, _, _ in ob:
        if op == "equal":
            for i in range(i1, i2):
                bequal[i] = True
    changes = {}
    for op, i1, i2, j1, j2 in oc:
        if op == "equal":
            continue
        creading = cn[j1:j2]
        if i2 > i1 and all(bequal[i] for i in range(i1, i2)):
            continue  # B agrees with G: C misread
        if i2 == i1 and i1 > 0 and bequal[i1 - 1] and bequal[min(i1, len(gn) - 1)]:
            continue  # C alone has extra words (margin notes, page numbers)
        breading = bmap.get((i1, i2))
        number, local = owner[min(i1, len(owner) - 1)]
        if i2 == i1 and i1 < len(owner) and i1 > 0 and owner[i1 - 1][0] != number:
            number, local = owner[i1 - 1][0], owner[i1 - 1][1] + 1
        same_chapter = i2 == i1 or owner[i2 - 1][0] == number
        if breading is not None and breading == creading and creading and max(i2 - i1, j2 - j1) > 4:
            log.append(f"  chapter {number} @{local} C=B LONG: G[{' '.join(g[i1:i2])[:300]}] C[{' '.join(c_tokens[j1:j2])[:300]}]")
        if breading is not None and breading == creading and creading and max(i2 - i1, j2 - j1) <= 4 and same_chapter:
            raw = c_tokens[j1:j2]
            changes.setdefault(number, []).append((local, local + (i2 - i1), raw))
            stats["fixed"] += 1
            log.append(f"  chapter {number} @{local}: G[{' '.join(g[i1:i2])}] -> C=B[{' '.join(raw)}]")
        else:
            stats["alone"] += 1
            if max(i2 - i1, j2 - j1) <= 6:
                log.append(f"  chapter {number} @{local} G differs: G[{' '.join(g[i1:i2])}] C[{' '.join(creading)}] B[{' '.join(breading) if breading is not None else '(other split)'}]")
    return changes, stats


def apply_changes(paras, changes):
    """Replace G's words i1:i2 (counted over the chapter) with the C=B reading."""
    flat = []  # (paragraph index, word)
    for pi, p in enumerate(paras):
        for w in tokens(p):
            flat.append([pi, w])
    for i1, i2, raw in sorted(changes, reverse=True):
        clean = [re.sub(r"[|]", "", w) for w in raw]
        if i2 > i1:
            pi = flat[i1][0]
            # keep G's punctuation around the first and last word
            lead = re.match(r"^[^A-Za-zæ]*", flat[i1][1]).group(0)
            trail = re.search(r"[^A-Za-zæ]*$", flat[i2 - 1][1]).group(0)
            words = [re.sub(r"^[^A-Za-zæ]+|[^A-Za-zæ]+$", "", w) for w in clean]
            words[0] = lead + words[0]
            words[-1] = words[-1] + trail
            flat[i1:i2] = [[pi, w] for w in words]
        else:
            pi = flat[i1][0] if i1 < len(flat) else flat[-1][0]
            words = [re.sub(r"^[^A-Za-zæ\[]+|[^A-Za-zæ\]]+$", "", w) for w in clean]
            flat[i1:i1] = [[pi, w] for w in words]
    out = [[] for _ in paras]
    for pi, w in flat:
        out[pi].append(w)
    return [" ".join(ws) for ws in out]


def main():
    g_path, c_path, b_path = sys.argv[1:4]
    log = []
    paras = read_g(g_path)
    c_text, c_margin = read_ocr(c_path, "IT came to pass, when Jesus had risen from the")
    b_text, b_margin = read_ocr(b_path, "IT came to pass, when Jesus had risen from the")
    chapters, extras = split_chapters(paras, log)

    c_body_norm = norm(c_text)
    margin_norm = norm(c_margin + " " + b_margin)
    contents = read_contents(c_path, "IT came to pass, when Jesus had risen from the")
    side = {}
    counts = {True: 0, False: 0, "unconfirmed": 0}
    for ch in chapters:
        keep = []
        for t in ch[1]:
            for head, (text_part, note_part) in SPLITS.items():
                if t == head or t.startswith(head + " "):
                    side.setdefault(ch[0], []).append(note_part)
                    t = (text_part or "") + t[len(head):]
                    if head.endswith(".lt"):
                        t = "It" + t
                    break
            if not t.strip():
                continue
            verdict = is_side_note(t, c_body_norm, margin_norm, contents)
            if verdict is None or verdict is False:
                keep.append(t)
                if verdict is False and len(t) < 110 and '"' not in t:
                    pass
                continue
            counts[verdict] += 1
            if verdict is True and ('"' in t or ":" in t):
                log.append(f"  chapter {ch[0]}: CHECK side-heading with quote or colon: {t}")
            if verdict == "unconfirmed":
                log.append(f"  chapter {ch[0]}: side-heading not found in C or B margins, taken as one: {t}")
            side.setdefault(ch[0], []).append(t)
        ch[1] = mend_breaks(keep, contents, side.setdefault(ch[0], []), ch[0], log)

    c_tokens = tokens(c_text)
    b_tokens = tokens(b_text)
    changes, stats = compare(chapters, c_tokens, b_tokens, log)
    # The C=B readings are listed in the report, not applied: both OCRs splice
    # Mead's margin into the text at the same places, so each was judged by
    # hand and the real corrections are in FIXES.

    dash, hyph = dash_pairs([c_text, b_text])

    def finish(t, where):
        t = restore_dashes(t, dash, hyph, log, where)
        t = curl(t)
        t = re.sub(r"\s{2,}", " ", t).strip()
        return t

    used = set()

    def fix_text(text, number):
        for ex, wrong, right in FIXES:
            if ex in (0, number) and wrong in text:
                used.add(wrong)
                text = text.replace(wrong, right)
        for pattern, right in REGEX_FIXES:
            text = re.sub(pattern, right, text, flags=re.M)
        return text

    rows = []
    for number, ps in chapters:
        texts = [finish(t, f"chapter {number}") for t in ps]
        for ex, start in DROPS:
            if ex == number:
                kept = [t for t in texts if not t.startswith(start)]
                if len(kept) == len(texts):
                    log.append(f"  DROP not applied in chapter {number}: {start}")
                texts = kept
        for ex, before, para in INSERTS:
            if ex == number:
                at = 0 if before is None else next(i for i, t in enumerate(texts) if t.startswith(before))
                texts.insert(at, para)
        text = "\n\n".join(mend_verses(fix_text("\n\n".join(texts), number).split("\n\n"), number, log))
        book = next(k for k, _, a, b in BOOKS if a <= number <= b)
        rows.append([number, book, text.split("\n\n"), [fix_text(t, number) for t in side.get(number, [])]])
    extra_rows = {k: [fix_text(finish(t, k), None) for t in v] for k, v in extras.items()}
    unused = [w for _, w, _ in FIXES if w not in used]
    if unused:
        log.append(f"  FIXES never applied: {unused}")

    print(f"words in G: {stats['words']}; matching C: {stats['agree_c']} ({stats['agree_c'] / stats['words']:.3f}); matching B: {stats['agree_b']} ({stats['agree_b'] / stats['words']:.3f})", file=sys.stderr)
    print(f"short readings where C and B agree against G (listed, judged by hand): {stats['fixed']}; G alone with C and B differing: {stats['alone']}", file=sys.stderr)
    print(f"side-headings: confirmed in C/B margins or Mead's contents {counts[True]}, unconfirmed {counts['unconfirmed']}", file=sys.stderr)
    for line in log:
        print(line, file=sys.stderr)

    out = sys.stdout
    out.write("// GENERATED by scripts/texts/mead-pistis-sophia.py from G. R. S. Mead,\n")
    out.write("// Pistis Sophia: A Gnostic Miscellany (2nd ed., 1921): the Global Grey e-text,\n")
    out.write("// checked word by word against two independent OCRs of the printed book.\n")
    out.write("// Do not edit by hand: correct the generator (its FIXES list holds every\n")
    out.write("// correction made by hand) and run it again.\n//\n")
    out.write("// PISTIS_SOPHIA_CHAPTERS: [chapter, book key, Mead's paragraphs, Mead's\n")
    out.write("// side-headings in that chapter (marginal summaries, not part of the text)].\n")
    out.write("// PISTIS_SOPHIA_EXTRAS: the scribe's note, the two subscriptions and the\n")
    out.write("// later postscript. Mead's footnotes and introduction are left out.\n\n")
    out.write("export const PISTIS_SOPHIA_CHAPTERS: [number, string, string[], string[]][] = [\n")
    for row in rows:
        out.write("  " + json.dumps(row, ensure_ascii=False) + ",\n")
    out.write("];\n\nexport const PISTIS_SOPHIA_EXTRAS: Record<string, string[]> = ")
    out.write(json.dumps(extra_rows, ensure_ascii=False, indent=2))
    out.write(";\n")


if __name__ == "__main__":
    main()
