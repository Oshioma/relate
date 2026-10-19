"""The Amduat and the Book of Gates (Budge 1905) -> hour-by-hour English.

Input (argument 1): the archive.org OCR (djvu.txt) of a printout of the
sacred-texts.com e-text of E. A. Wallis Budge, The Egyptian Heaven and Hell
(J. B. Hare, 2003), all three volumes in one file: archive.org item
`egyptian-heaven-and-hell-three-volumes-in-one`. sacred-texts.com itself sits
behind a browser check that cannot be passed from here, and archive.org's file
servers are blocked, so the text is read through archive.org's /stream/ page.

The e-text leaves out Budge's hieroglyphic text and his transliterations of
the names; so does this archive. It keeps Budge's printed page numbers ("p.6").

Cross-checks (arguments 2 and 3, optional): the archive.org OCR of the printed
book itself, vol. I (`egyptianheavenhe0001budg`) and vol. II
(`egyptianheavenhe0002budg`). Every passage is word-aligned against them and
the disagreements are reported on stderr; the e-text OCR's misreadings found
that way are fixed in FIXES below, and only where the printed book is clear.

Output: src/lib/timeline/texts/corpus/amduat-text.ts and
src/lib/timeline/texts/corpus/book-of-gates-text.ts (paths from arguments 4
and 5), each a list of hours with their sections, in Budge's words.

WHAT IS KEPT. Budge's own English, in his order: his description of each
scene and the translations he gives of its texts. WHAT IS LEFT OUT. The
hieroglyphs and transliterations (not in the e-text), the captions of his
illustrations (the illustrations are not reproduced), his footnotes, his
running heads and page numbers. In the Book of Gates, his Chapter I (on the
alabaster sarcophagus of Seti I and its other inscriptions) is an introduction,
not the Book, and is left out; Chapter II, the Ante-Chamber, is the first
division.
"""

import difflib
import json
import re
import sys

ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"]

# Line ranges in the OCR file (1-based, inclusive start, exclusive end), found
# by the chapter headings. Checked by eye against the headings.
AMDUAT_TITLE = (210, 242)
AMDUAT_CHAPTERS = [242, 603, 1100, 1539, 1834, 2215, 2751, 3225, 3788, 4235, 4768, 5337, 5840]
SHORT_HOURS = [6096, 6129, 6176, 6231, 6266, 6310, 6360, 6427, 6456, 6487, 6515, 6546, 6592]
# Book of Gates: chapters II-XIV (Ch. VII and VIII are both the sixth division).
GATES_CHAPTERS = [7398, 7507, 7775, 8125, 8504, 8879, 9091, 9476, 9976, 10344, 10825, 11309, 11822, 12044]

PAGE = re.compile(r"^\s*(p[.:;,']{1,3}\s*_?\s*\d+\s*)+$")
CONTINUES = re.compile(r"^[\[\(]\s*para\w*\s+\w+\s*[\]\)\}]\s*", re.I)


def read_lines(path):
    return open(path, encoding="utf-8").read().split("\n")


def blocks_of(lines):
    """Blocks separated by blank lines, with page markers noted."""
    blocks, current = [], []
    for line in lines:
        if line.strip():
            current.append(line.rstrip())
        elif current:
            blocks.append(current)
            current = []
    if current:
        blocks.append(current)
    return blocks


def clean_lines(lines):
    """Drop page markers, illustration captions, OCR debris and footnotes, line by line.

    Returns lines with "" for paragraph breaks and ("PAGE", n) markers.
    """
    out = []
    skip_caption = False
    in_footnotes = False
    stripped = [raw.strip() for raw in lines]
    for index, line in enumerate(stripped):
        if in_footnotes:
            # The e-text prints footnotes after "Footnotes" at the foot of a
            # web page; they run to the next chapter heading.
            continue
        if line == "Footnotes":
            in_footnotes = True
            continue
        if not line:
            out.append("")
            continue
        if PAGE.match(line):
            out.append(("PAGE", int(re.findall(r"\d+", line)[-1])))
            continue
        if line in ("pls", "pl?"):
            continue
        if line == "Click to view":
            skip_caption = True
            if out and isinstance(out[-1], str) and 0 < len(out[-1]) <= 4:
                out.pop()
            continue
        if skip_caption:
            if len(line) <= 4 and not re.search(r"[a-z]{2}", line):
                continue
            skip_caption = False
            # The line after "Click to view" is the illustration's caption when
            # it stands alone (a blank line, a page marker or another picture
            # follows). Where the e-text has no caption, the line is Budge's
            # text running on, or an item of a list, and is kept.
            following = stripped[index + 1] if index + 1 < len(stripped) else ""
            alone = not following or PAGE.match(following) or following == "Click to view"
            if alone and not re.match(r"^([a-z]|\d+\. )", line):
                continue
        if re.match(r"^\((Left|Right|Above|Below)\)", line):
            skip_caption = False
            out.append("")
            out.append("CAPTION")
            continue
        if len(line) <= 4 and not re.search(r"[a-z]{2}|^\d+\.$", line):
            continue
        # A register heading always starts a paragraph, even where the e-text
        # runs it straight on from the line above (vol. I, p. 146).
        if re.match(r"^In the (upper|lower|middle) register", line) and out and out[-1] != "":
            out.append("")
        out.append(line)
    # A caption that runs onto a second line ("(Left) ... sing to" / "RA.").
    cleaned = []
    in_caption = False
    for item in out:
        if item == "CAPTION":
            in_caption = True
            continue
        if in_caption:
            if item == "":
                in_caption = False
                cleaned.append("")
            continue
        cleaned.append(item)
    return cleaned


def blocks_with_pages(lines, page=None):
    blocks, current, start = [], [], None
    for item in clean_lines(lines):
        if isinstance(item, tuple):
            page = item[1]
            if current:
                current.append(item)
            continue
        if item:
            if not current:
                start = page
            current.append(item)
        elif current:
            blocks.append((current, start))
            current = []
    if current:
        blocks.append((current, start))
    return blocks


def paragraphs_of(lines, fixes, page=None):
    """Budge's paragraphs; `page` is the printed page in force where `lines` begin."""
    out = []  # list of dicts {text, pages}
    for block, page in blocks_with_pages(lines, page):
        pages = [x[1] for x in block if isinstance(x, tuple)]
        text = " ".join(x for x in block if isinstance(x, str)).strip()
        if not text:
            continue
        cont = False
        m = CONTINUES.match(text)
        if m:
            text = text[m.end():]
            cont = True
        # Hyphenated line ends: the e-text keeps real hyphens ("Sun- god" in the
        # OCR is "Sun-god"); join "word- word" only where a hyphen ended the line.
        text = re.sub(r"(\w)- (\w)", r"\1-\2", text)
        text = re.sub(r"\s+", " ", text)
        # "[paragraph continues]" left inside a paragraph, in its OCR variants.
        text = re.sub(r"\s*[\[\(]\s*para\w*\s+c\w*\s*[\]\)\}!]?\s*", " ", text).strip()
        # Budge's own page references, "(see p._80)", "(see p..99)", "(see p.103)".
        text = re.sub(r"\bp\.[._\s]*(\d)", r"p. \1", text)
        for wrong, right in fixes:
            text = text.replace(wrong, right)
        text = text.replace(":--", ":—").replace("--", "—")
        if out:
            prev = out[-1]["text"]
            joins = cont or re.match(r"^[a-z(\[]", text) or not re.search(r"[.!?:;\"”'\])—]$", prev)
            if re.match(r"^In the (upper|lower|middle) register", text):
                joins = False
            if joins:
                out[-1]["text"] = prev + " " + text
                out[-1]["pages"] += [p for p in pages if p not in out[-1]["pages"]]
                continue
        out.append({"text": text, "pages": pages, "startPage": page})
    return out


def cut_at_end(paragraphs):
    """Volume II ends inside the last chapter; the e-text then starts Volume III."""
    for i, p in enumerate(paragraphs):
        if p["text"].startswith("END OF VOL"):
            return paragraphs[:i]
    return paragraphs


# CHECKED OCR FIXES. Each is a misreading in the e-text OCR where the
# archive.org OCRs of the printed book (vol. I: egyptianheavenhe0001budg and
# india.history.resource.92915; vol. II: egyptianheavenhe0002budg and
# india.history.resource.92916) agree on the other reading, or where the
# printed reading is certain from the sense. Regular expressions.
FIXES = [
    (r"\b1\s?\.\s?[e€6]\s?\.", "i.e."),
    (r"\(\.e\.,", "(i.e.,"),
    (r"\bLe\. \"", "i.e., \""),
    (r"\b1s\b", "is"),
    (r"\bts\b", "is"),
    (r"upon tt\.", "upon it."),
    (r"rain-headed", "ram-headed"),
    (r"hawk-beaded", "hawk-headed"),
    (r"\bHorns (made|or RA)", r"Horus \1"),
    (r"Hawk of Horns", "Hawk of Horus"),
    (r"\bbe worketh", "he worketh"),
    (r"recetve", "receive"),
    (r"HOUR of the Right", "HOUR of the Night"),
    (r"seal lip", "seal up"),
    (r"basket or bow\]", "basket or bowl"),
    (r"formulz", "formulae"),
    (r"MER-EX-AAUI-F", "MER-EN-AAUI-F"),
    (r"HAT-EM-TAUL-S", "HAT-EM-TAUI-S"),
    (r"KEKIJU", "KEKIU"),
    (r"BAIJU", "BAIU"),
    (r"AMENTTI", "AMENTI"),
    # A line the e-text OCR drops at the start of the Fifth Division (vol. I, p. 89).
    (r"seven goddesses \(see away, but", "seven goddesses (see pp. 91, 95, 99, 103, 107). The legend over the seven gods is partly broken away, but"),
    (r"on his tall\b", "on his tail"),
    (r"doom bath been", "doom hath been"),
    (r"heads core uncovered", "heads are uncovered"),
    (r"the third axe NEHESU", "the third are NEHESU"),
    (r"On each stop stands", "On each step stands"),
    (r"arms are bidden", "arms are hidden"),
    (r"MAMU; bail to you", "MAMU; hail to you"),
    (r"be backed in pieces", "be hacked in pieces"),
    (r"knife in his bands", "knife in his hands"),
    (r"the crate proper", "the gate proper"),
    (r"reyoiceth", "rejoiceth"),
    (r"The our beings", "The four beings"),
    (r"strong intent in our souls", "strong intent in your souls"),
    (r"\bitis granted", "it is granted"),
    (r"your ahenfu cakes", "your khenfu cakes"),
    (r"The stablishing of L1Me", "The stablishing of Time"),
    (r"in the folds ofa\b", "in the folds of a"),
    (r"\blhe text", "the text"),
    (r"\bdut he openeth", "but he openeth"),
    (r"Seti l\.", "Seti I."),
    (r"(?<![a-z(])\.e\.,", "i.e.,"),
    (r"\b(1\.6|t\.e\.),", "i.e.,"),
    (r"\(7\??\)", "(?)"),
    (r"\(see p(\d)", r"(see p. \1"),
    (r"\(see pp\. 91, 4\. The god", "(see pp. 91, 95). 4. The god"),
    (r"\"Seb of the two corners\.$", "\"Seb of the two corners.\""),
    (r"^A ram-headed god, with a similar attribute, called KHNEMU", "3. A ram-headed god, with a similar attribute, called KHNEMU"),
    (r"\bpi 57 ", ""),
    (r" pil\?", ""),
    (r"The enemies c who", "The enemies who"),
    (r"\{It maketh", "[It maketh"),
    # "[" and "]" the OCR read as "|".
    (r"\[([^\]|\n]{1,40}?)\s*\|", r"[\1]"),
    (r"\"\| (This|These)", '"[\\1'),
    (r"NEBT-NEBT\. Goddesses of the Hours\. 4\.", "NEBT-NEBT. 4."),
    # Ends of chapters the e-text OCR cuts short (the printed OCRs have them).
    (r"NU-RA,\"$", "NU-RA.\""),
    (r"The name of this hour is SESHET-MAKET-NEB-$", "The name of this hour is SESHET-MAKET-NEB-S."),
    (r"remain in their places\.\"\]: \[", "remain in their places.\"] ["),
    (r"remaineth in his place\.\"\] 1$", "remaineth in his place.\"]"),
    (r"place of destruction\.\] :$", "place of destruction.]"),
    (r", -i\.e\.,", ", i.e.,"),
    (r"divided into two parts, \{< alll ,", "divided into two parts, [hieroglyphs],"),
    # Hieroglyphs. The e-text gives them as images (shown as "###" in its
    # printout); the OCR turns some into debris. Each becomes "[hieroglyphs]".
    (r"###", "[hieroglyphs]"),
    (r"the utchat, <= with which", "the utchat, [hieroglyphs] with which"),
    (r"full moon read > — IN i IN and", "full moon read [hieroglyphs], and"),
    (r"is written > \{ \\ mmy iN \{ and over", "is written [hieroglyphs], and over"),
    (r"the signs (&|a) and b v (The|Above)", r"the signs [hieroglyphs]. \2"),
    (r"we have = 7\) tae \| \| 1 — Ge — \+\+\+ 225! the foremost sceptre a \| Pec , and immediately in cm ey \| 1 AR front is <> —= and under the front of the boatis !!\"!2 \\\\,",
     "we have [hieroglyphs], the foremost sceptre [hieroglyphs], and immediately in front is [hieroglyphs], and under the front of the boat is [hieroglyphs]."),
    (r"hate\} Hiro HUB SHO .*? ir(?= \"|$)", "[hieroglyphs]"),
    (r"horizon of the west, Gmail J or", "horizon of the west, [hieroglyphs] or"),
    (r"is written Tf he @” Se OSS\.", "is written [hieroglyphs]."),
    (r"AUTU-MAAMU-KHERU-MAAT >\.", "AUTU-MAAMU-KHERU-MAAT."),
    (r"an elongated ellipse, Cc and", "an elongated ellipse, [hieroglyphs], and"),
    (r"the goddess is called and lives upon", "the goddess is called [hieroglyphs], and \"lives upon"),
    (r"\(paaerapheontines\) ", "[hieroglyphs] "),
    (r"HET-TEMTET-RA\. The texts read:$", "HET-TEMTET-RA. The texts read: [hieroglyphs]"),
    # Vol. I, pp. 129-130: the e-text OCR interleaves items 13-15 with a caption.
    (r"goddess\.\.\.\.\. 7 13\. The lion", "goddess.....\n\n13. The lion"),
    (r"Utchats, between 14\. (A form of the goddess Isis, in a sitting position, but without a throne\.) which is the sign 15\.",
     "Utchats, between which is the sign [hieroglyphs].\n\n14. \\1\n\n15."),
    # Vol. I, pp. 188-229.
    (r"^Click to vi Akhem-hep-f\. Akhem-khemes-f\.$", ""),
    (r" iew Khen-unnui t-f\. Hepti-ta-f\.", ""),
    (r"reads: tstlerda Tekait\. \.\.\.\.\. Khut-Tuat\. rer Aat-Aru\. Nebt-uauau\. Nebt-Rekeh\. \" ", "reads: [hieroglyphs]. \""),
    (r"a zone of sand, Cc or perhaps", "a zone of sand, [hieroglyphs], or perhaps"),
    (r"^Two serpents, standing on their tails", "3. Two serpents, standing on their tails"),
    (r"Five : lakes", "Five lakes"),
    (r"Three » lakes", "Three lakes"),
    (r"HERU-KHENTI\. :$", "HERU-KHENTI."),
    # Vol. I, pp. 232-278.
    (r"i\.e\., \"1ts body", "i.e., \"Its body"),
    (r"The god TEPUL, i\.e\., the '\"Two-headed\"", "The god TEPUI, i.e., the \"Two-headed\""),
    (r"THE TWELFTH DIVISION ; of", "THE TWELFTH DIVISION of"),
    (r"KHEP\[RJA", "KHEP[R]A"),
    (r"KA-EM-ANKH-NETERU,;", "KA-EM-ANKH-NETERU;"),
    (r"KHERUT-TEP \(2\)", "KHERUT-TEP (?)"),
    (r"SESHETA-BAIU \(2\)", "SESHETA-BAIU (?)"),
    (r"is against YOU,", "is against you,"),
    (r"^END OF VOL\. I\.$", ""),
    # Vol. II, Short Form.
    (r"in Ament of the Tuat-now the beginning", "in Ament of the Tuat—now the beginning"),
    (r"words of power of SEMSU RUTI-ASAR is", "words of power of SEMSU (?).\n\nRUTI-ASAR is"),
    # Vol. II, pp. 79-117 (the Book of Gates).
    (r"the other SET, om, and represents", "the other SET, [hieroglyphs], and represents"),
    (r"folds of a In it are the Twelve Gods of the Funeral Mountain\. serpent", "folds of a serpent"),
    (r"habitations, my In it are the twelve Gods of Set-Amentet\. splendours", "habitations, my splendours"),
    (r"NEPEMEH \., NENHA, 2, BA,", "NEPEMEH, NENHA, BA,"),
    (r"gods of the Tuat \(in order to make", "gods of the Tuat in order to make"),
    (r"among the gods\. who are in the Tuat", "among the gods who are in the Tuat"),
    (r"upon, their thrones", "upon their thrones"),
    (r"ye \[have\] \(what is yours", "ye [have] what is yours"),
    (r"\(/iterally, made\)", "(literally, made)"),
    (r"offerings are with him\. who is therein", "offerings are with him who is therein"),
    (r"Ra\. saith unto them", "Ra saith unto them"),
    (r"carried out therein\., ENNURKHATA", "carried out therein.' ENNURKHATA"),
    (r"'0 ye UTAU", "'O ye UTAU"),
    (r"peace \(or, crest\)", "peace (or, rest)"),
    (r"the holy gods who are in the Luat\.\"”", "the holy gods who are in the Tuat.\""),
    (r"^\"Those who are in\] their shrines", "\"[Those who are in] their shrines"),
    (r"^Those who are in\] their shrines", "\"[Those who are in] their shrines"),
    (r"^\"\(Here is\]", "\"[Here is]"),
    (r"\[tO guard\]", "[to guard]"),
    # Vol. II, pp. 119-156.
    (r"\bLhe text", "The text"),
    (r"in a \(right state", "in a right state"),
    (r"^\"\(These are\]", "\"[These are]"),
    (r"\bte\., \"the souls", "i.e., \"the souls"),
    (r"\(i\.e\., this \(gateway\)", "(i.e., this gateway)"),
    (r"the tears : of", "the tears of"),
    (r"The hieroglyphic text which relates to these groups reads:—$", "The hieroglyphic text which relates to these groups reads:— [hieroglyphs]"),
    # Vol. II, pp. 158-189.
    (r"heads of gazelle ; or oxen", "heads of gazelle or oxen"),
    (r"SAR, Li\.e\., Osiris", "SAR, i.e., Osiris"),
    (r"Seti L\.,", "Seti I.,"),
    (r"at Paris, : as well", "at Paris, as well"),
    (r"\b1\.¢e\.,", "i.e.,"),
    (r"\"enigmatic\" writing, : a fact", "\"enigmatic\" writing, a fact"),
    (r"the ordinary values, 2 and this", "the ordinary values, and this"),
    (r"\"HS enemies", "\"His enemies"),
    (r"the Eater of the Arm\)\.\":$", "the Eater of the Arm).\""),
    (r"the legend : which", "the legend which"),
    (r"they read ::—", "they read:—"),
    (r"called SAR, \(Osiris\)\. :$", "called SAR (Osiris)."),
    (r"what yedo\.", "what ye do."),
    (r"Champollion, :and", "Champollion, and"),
    (r"^\"\(These are they who have offered", "\"[These are they who have offered"),
    (r"and-who dwell", "and who dwell"),
    (r"They perform\. their work", "They perform their work"),
    (r"the gods in \"the NAY 5 a sek Ghee AMENTI \.\.\.\.", "the gods in the Tuat....... AMENTI ...."),
    (r"projecting elbows, called, or MET \.\.", "projecting elbows, called [hieroglyphs], or MET .."),
    (r"which are in your Lake sas os m A few years ago", "which are in your Lake\n\nA few years ago"),
    (r"¢tchesert", "tchesert"),
    (r"THIRD HOUR, : includes", "THIRD HOUR, includes"),
    (r"sceptres of the form f each", "sceptres of the form [hieroglyphs] each"),
    (r"\bIt 18 he who", "It is he who"),
    (r"\(or, seats\)\.\"\] :$", "(or, seats).\"]"),
    # Vol. II, pp. 190-235.
    (r"can be restored with certainty\. » In the middle of this Division", "can be restored with certainty.\n\nIn the middle of this Division"),
    (r"AKHA-EN-MAAT ::—", "AKHA-EN-MAAT:—"),
    (r"illumine the hidden habitation! This door", "illumine the hidden habitation.' This door"),
    (r"lord of \(offerings\.", "lord of offerings."),
    (r"the EIGHTH O DIVISION", "the EIGHTH DIVISION"),
    (r"\(\.i\.e\., blazing fire\)", "(i.e., blazing fire)"),
    (r"in his right hand, and in his left\. The portion", "in his right hand, and [hieroglyphs] in his left.\n\nThe portion"),
    (r"for 1am the Great One", "for I am the Great One"),
    (r"refresh themselves are cool Offerings", "refresh themselves are cool. Offerings"),
    (r"^\"\(This scene representeth\]", "\"[This scene representeth]"),
    (r"it should end thus:- -\"Offerings", "it should end thus:—\"Offerings"),
    # Vol. II, pp. 237-277.
    (r"^Four women, who stand upright, and hold a bent rod", "3. Four women, who stand upright, and hold a bent rod"),
    (r"O serpent SESSL\"™ \"Those who", "O serpent SESSI.'\"\n\n\"Those who"),
    (r"that of And is a crown", "that of ANA is a crown"),
    (r"the human head of And\.", "the human head of ANA."),
    (r"other side of 1t wail", "other side of it wail"),
    (r"keep ward \(over those who", "keep ward over those who"),
    (r"and it guideth the Gods of Light and Fire\. Star-gods\. Face of the Disk\. Semi\. ! Well-doing god", "and it guideth the Well-doing god"),
    (r"Of the god BEST it is said", "Of the god BESI it is said"),
    (r"MEHEN serpent of the urae1,", "MEHEN serpent of the uraei,"),
    (r"HORUS -SET", "HORUS-SET"),
    (r"by the gods of the 'Tuat,", "by the gods of the Tuat,"),
    (r"\bVAMEMTI\b", "UAMEMTI"),
    (r"keep guard \(over the deadly chain", "keep guard over the deadly chain"),
    (r"by means of his 'fetters", "by means of his fetters"),
    (r"^The god BANTI, with the head", "3. The god BANTI, with the head"),
    (r"who tow alone, ", "who tow along "),
    # Vol. II, pp. 279-305.
    (r"it is said ::—", "it is said:—"),
    (r"it is-said", "it is said"),
    (r"heaven,, and they lead", "heaven, and they lead"),
    (r"lay their hands \(on the body", "lay their hands on the body"),
    (r"\[ Dut\] he openeth", "[but] he openeth"),
]


def page_before(et, line_no, default=None):
    """The printed page in force at a line: the last page marker above it in the same volume."""
    for i in range(line_no - 2, -1, -1):
        line = et[i].strip()
        if line.startswith("Scanned at Sacred-texts"):
            return default
        if PAGE.match(line):
            return int(re.findall(r"\d+", line)[-1])
    return default


def apply_fixes(paragraphs):
    """Apply FIXES; a fix that inserts a paragraph break splits the paragraph."""
    out = []
    for p in paragraphs:
        for wrong, right in FIXES:
            p["text"] = re.sub(wrong, right, p["text"])
        for part in p["text"].split("\n\n"):
            if part.strip():
                out.append({**p, "text": part.strip()})
    return out


def split_heading(paragraphs):
    """Chapter headings are the leading all-capitals paragraphs; return (heading, body)."""
    heading = []
    body = list(paragraphs)
    while body and not re.search(r"[a-z]", body[0]["text"]):
        heading.append(body.pop(0)["text"])
    if body:
        m = re.match(r"^([^a-z]*?[A-Z.])\s+([A-Z]+ [a-z].*)$", body[0]["text"])
        if m and len(m.group(1)) > 12:
            heading.append(m.group(1))
            body[0] = {**body[0], "text": m.group(2)}
    return " ".join(heading), body


AMDUAT_TRIGGERS = [
    (re.compile(r"^In the upper register"), "upper", "The upper register"),
    (re.compile(r"^In the lower register"), "lower", "The lower register"),
    (re.compile(r"^In the middle register"), "middle", "The middle register"),
    (re.compile(r"^The Address which"), "address", "Ra's address and the gods' reply"),
]
GATES_TRIGGERS = [
    (re.compile(r"^(In the centre|Along the middle|In the middle|In front of the divine to)"), "middle", "The boat of the sun"),
    (re.compile(r"^(On the right|In the upper register)"), "upper", "The upper register"),
    (re.compile(r"^(On the left|In the lower register)"), "lower", "The lower register"),
]

# Chapter VIII (the Sixth Division continued) gives first the fragments on Seti I's
# sarcophagus, then the complete scenes from the tomb of Rameses VI.
SIXTH_TRIGGERS = [
    (re.compile(r"^In the middle register are"), "seti-middle", "The middle register (Seti I)"),
    (re.compile(r"^The upper register is much mutilated"), "seti-upper", "The upper register (Seti I)"),
    (re.compile(r"^In the lower register are:"), "seti-lower", "The lower register (Seti I)"),
    (re.compile(r"^The text which describes the middle register"), "rvi-middle", "The middle register (Rameses VI)"),
    (re.compile(r"^In the upper register are twelve gods"), "rvi-upper", "The upper register (Rameses VI)"),
    (re.compile(r"^In the lower register are the figures"), "rvi-lower", "The lower register (Rameses VI)"),
]

MAX_PART = 3800


def sections_of(body, triggers, first_key, first_label):
    sections = [{"key": first_key, "label": first_label, "paras": []}]
    used = {first_key}
    for p in body:
        for rx, key, label in triggers:
            if rx.match(p["text"]) and key not in used:
                sections.append({"key": key, "label": label, "paras": []})
                used.add(key)
                break
        sections[-1]["paras"].append(p)
    sections = [s for s in sections if s["paras"]]
    # Long sections are cut into parts of whole paragraphs.
    out = []
    for s in sections:
        total = sum(len(p["text"]) for p in s["paras"])
        if total <= MAX_PART * 1.25:
            out.append(s)
            continue
        n = -(-total // MAX_PART)
        target = total / n
        parts, current, size = [], [], 0
        for p in s["paras"]:
            if current and size + len(p["text"]) / 2 > target and len(parts) < n - 1:
                parts.append(current)
                current, size = [], 0
            current.append(p)
            size += len(p["text"])
        parts.append(current)
        for i, paras in enumerate(parts):
            out.append({"key": f"{s['key']}-{i + 1}", "label": f"{s['label']} ({i + 1} of {len(parts)})", "paras": paras})
    return out


def page_range(paras):
    pages = []
    for p in paras:
        if p.get("startPage") is not None:
            pages.append(p["startPage"])
        pages += p["pages"]
    pages = [x for x in pages if x]
    if not pages:
        return ""
    lo, hi = min(pages), max(pages)
    return f"p. {lo}" if lo == hi else f"pp. {lo}–{hi}"


def ts_string(text):
    return json.dumps(text, ensure_ascii=False)


def section_ts(s):
    text = "\n\n".join(p["text"] for p in s["paras"])
    return f"      {{ key: {ts_string(s['key'])}, label: {ts_string(s['label'])}, pages: {ts_string(page_range(s['paras']))}, text: {ts_string(text)} }},\n"


TYPES = """export type BudgeSection = {
  /** Unique within the hour: 'opening', 'upper', 'lower-2' … */
  key: string;
  label: string;
  /** Budge's printed page numbers, as the e-text gives them. */
  pages: string;
  /** Budge's English, paragraphs separated by blank lines. */
  text: string;
};

export type BudgeHour = {
  hour: number;
  /** Budge's chapter number. */
  chapter: string;
  /** His chapter heading. */
  heading: string;
  sections: BudgeSection[];
};
"""


def main():
    et = read_lines(sys.argv[1])
    out_amduat, out_gates = sys.argv[2], sys.argv[3]
    report = []

    title = apply_fixes(paragraphs_of(et[AMDUAT_TITLE[0] - 1 : AMDUAT_TITLE[1] - 1], []))
    title_text = " ".join(p["text"] for p in title if re.search(r"WRITINGS|TO THEM", p["text"]))
    title_text = re.sub(r"^THE BOOK AM-TUAT THE TITLE OF THE WORK\s*", "", title_text)

    amduat = []
    for i, (a, b) in enumerate(zip(AMDUAT_CHAPTERS, AMDUAT_CHAPTERS[1:])):
        heading, body = split_heading(apply_fixes(paragraphs_of(et[a - 1 : b - 1], [], page_before(et, a))))
        amduat.append((i + 1, ROMAN[i], heading, sections_of(body, AMDUAT_TRIGGERS, "opening", "The opening scene")))

    short = []
    for i, (a, b) in enumerate(zip(SHORT_HOURS, SHORT_HOURS[1:])):
        heading, body = split_heading(apply_fixes(paragraphs_of(et[a - 1 : b - 1], [], page_before(et, a, 1))))
        short.append((i + 1, heading, body))

    gates = []
    for i, (a, b) in enumerate(zip(GATES_CHAPTERS, GATES_CHAPTERS[1:])):
        heading, body = split_heading(apply_fixes(cut_at_end(paragraphs_of(et[a - 1 : b - 1], [], page_before(et, a)))))
        gates.append((ROMAN[i + 1], heading, body))

    with open(out_amduat, "w") as f:
        f.write("// GENERATED by scripts/texts/budge-underworld.py from the e-text of Budge,\n")
        f.write("// The Egyptian Heaven and Hell, vol. I (1905). Do not edit by hand: change the\n")
        f.write("// generator (its FIXES list holds every OCR correction) and run it again.\n\n")
        f.write(TYPES)
        f.write(f"\nexport const AMDUAT_TITLE = {{ pages: \"pp. 1–2\", text: {ts_string(title_text)} }};\n\n")
        f.write("export const AMDUAT_HOURS: BudgeHour[] = [\n")
        for hour, chapter, heading, sections in amduat:
            f.write(f"  {{\n    hour: {hour},\n    chapter: {ts_string(chapter)},\n    heading: {ts_string(heading)},\n    sections: [\n")
            for s in sections:
                f.write(section_ts(s))
                report.append(f"amduat {hour} {s['key']} {sum(len(p['text']) for p in s['paras'])} {page_range(s['paras'])}")
            f.write("    ],\n  },\n")
        f.write("];\n\n")
        f.write("/** The Short Amduat (vol. II, pp. 1–40), hour by hour. */\n")
        f.write("export const SHORT_AMDUAT: { hour: number; heading: string; pages: string; text: string }[] = [\n")
        for hour, heading, body in short:
            text = "\n\n".join(p["text"] for p in body)
            f.write(f"  {{ hour: {hour}, heading: {ts_string(heading)}, pages: {ts_string(page_range(body))}, text: {ts_string(text)} }},\n")
            report.append(f"short {hour} {len(text)} {page_range(body)}")
        f.write("];\n")

    with open(out_gates, "w") as f:
        f.write("// GENERATED by scripts/texts/budge-underworld.py from the e-text of Budge,\n")
        f.write("// The Egyptian Heaven and Hell, vol. II (1905). Do not edit by hand: change the\n")
        f.write("// generator (its FIXES list holds every OCR correction) and run it again.\n\n")
        f.write('import type { BudgeHour } from "./amduat-text";\n\n')
        f.write("export const GATES_DIVISIONS: BudgeHour[] = [\n")
        # Chapters VII and VIII are both the Sixth Division: one hour, two parts.
        division = 0
        pending = None
        for chapter, heading, body in gates:
            first_key, first_label = ("gate", "The gate") if "GATE" in heading else ("opening", "The opening scene")
            sections = sections_of(body, SIXTH_TRIGGERS if chapter == "VIII" else GATES_TRIGGERS, first_key, first_label)
            if chapter == "VII":
                for s in sections:
                    s["key"] = s["key"].replace("opening", "hall") if s["key"].startswith("opening") else f"hall-{s['key']}"
                    s["label"] = s["label"].replace("The opening scene", "The Judgment Hall of Osiris")
                pending = (chapter, heading, sections)
                continue
            if chapter == "VIII":
                _, prev_heading, prev_sections = pending
                sections = prev_sections + sections
                chapter = "VII–VIII"
                heading = f"{prev_heading} / {heading}"
            division += 1
            f.write(f"  {{\n    hour: {division},\n    chapter: {ts_string(chapter)},\n    heading: {ts_string(heading)},\n    sections: [\n")
            for s in sections:
                f.write(section_ts(s))
                report.append(f"gates {division} {s['key']} {sum(len(p['text']) for p in s['paras'])} {page_range(s['paras'])}")
            f.write("    ],\n  },\n")
        f.write("];\n")
    print("\n".join(report), file=sys.stderr)


if __name__ == "__main__":
    main()
