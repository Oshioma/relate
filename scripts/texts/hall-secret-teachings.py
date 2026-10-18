"""The Secret Teachings of All Ages (Hall 1928) -> chapter/section passages.

Input: the pages of Manly P. Hall, The Secret Teachings of All Ages (San
Francisco: H. S. Crocker, 1928), as published by sacred-texts.com
(https://sacred-texts.com/book/the-secret-teachings-of-all-ages/<slug>, one
page per chapter), saved as HTML. The site sits behind a browser check, so
the pages are fetched with a headless browser rather than here. Their
e-text was scanned from the 1928 first edition in 2001 (J. B. Hare), with
the book's Roman page numbers turned into Arabic ones; it says so on its
title page.

The site's current pages lose text: fourteen chapters stop after their
first page or so (see TRUNCATED, which the script also detects). For those,
the rest of the chapter is taken from an archive.org copy of the same e-text
(item the-secret-teachings-of-all-ages-by-manly-p.-hall-1928, "Full text":
an OCR of a printout of the sacred-texts pages, saved as plain text), with
the site's navigation, the printout's page breaks and the OCR's few
misreadings taken out. That OCR misses some of the e-text's page markers; a
second archive.org printout of the same e-text
(pdfy-NXrCfPe_e-QETRFj) has them, and they are put back from it. Every
chapter the site does give in full is also compared with the first OCR, word
by word, and any run of the OCR the site lacks is reported.

What is kept: Hall's text, his chapter titles, his section headings and the
captions of his illustrations, verbatim. What is left out: the site's
navigation, the "Click to enlarge" links, and the e-text's page markers,
which are kept beside the text as page numbers. The book has no footnotes
("all footnotes were eliminated", Preface). Italics are not kept. A
paragraph the foot of a page broke in two is joined again.

Hall's chapters are unnumbered; they are numbered here 1-45 in the order of
his table of contents, after the Introduction. The Dedication, Preface,
Introduction, Conclusion and the plates of the Celentano manuscript (which
the table of contents does not list) are kept under their own keys. Inside
a chapter, each of Hall's headings starts a section (section 0 is the text
before the first heading); a section over MAX_CHARS is cut, at paragraph
ends only, into parts of about TARGET_CHARS.

Usage:
  python3 -I scripts/texts/hall-secret-teachings.py <pages-dir> <ocr-a.txt> <ocr-b.txt> <out-dir>
writes <out-dir>/hall-secret-teachings-text-{1,2,3,4}.ts and reports to stderr.
"""

import difflib
import html
import json
import os
import re
import sys
import unicodedata

PREFIX = "book_the_secret_teachings_of_all_ages_"

# (key, page slug, title as the table of contents gives it, first page,
# last page). Pages are the e-text's (the book's Roman numerals in Arabic).
CHAPTERS = [
    ("dedication", "start_reading", "Dedication", 3, 3),
    ("preface", "preface", "Preface", 5, 7),
    # The table of contents gives p. 12; the e-text's page marks and figures
    # put the opening on p. 13.
    ("intro", "introduction", "Introduction", 13, 20),
    ("1", "the_ancient_mysteries_and_secret_societies_which_have_influenced_modern_masonic_sy",
     "The Ancient Mysteries and Secret Societies Which Have Influenced Modern Masonic Symbolism", 21, 24),
    ("2", "the_ancient_mysteries_and_secret_societies_part_two", "The Ancient Mysteries and Secret Societies, Part II", 25, 28),
    ("3", "the_ancient_mysteries_and_secret_societies_part_three", "The Ancient Mysteries and Secret Societies, Part III", 29, 32),
    ("4", "atlantis_and_the_gods_of_antiquity", "Atlantis and the Gods of Antiquity", 33, 36),
    ("5", "the_life_and_teachings_of_thoth_hermes_trismegistus", "The Life and Writings of Thoth Hermes Trismegistus", 37, 40),
    ("6", "the_initiation_of_the_pyramid", "The Initiation of the Pyramid", 41, 44),
    ("7", "isis_the_virgin_of_the_world", "Isis, the Virgin of the World", 45, 48),
    ("8", "the_sun_a_universal_deity", "The Sun, a Universal Deity", 49, 52),
    ("9", "the_zodiac_and_its_signs", "The Zodiac and Its Signs", 53, 56),
    ("10", "the_bembine_table_of_isis", "The Bembine Table of Isis", 57, 60),
    ("11", "wonders_of_antiquity", "Wonders of Antiquity", 61, 64),
    ("12", "the_life_and_philosophy_of_pythagoras", "The Life and Philosophy of Pythagoras", 65, 68),
    ("13", "pythagorean_mathematics", "Pythagorean Mathematics", 69, 72),
    ("14", "the_human_body_in_symbolism", "The Human Body in Symbolism", 73, 76),
    ("15", "the_hiramic_legend", "The Hiramic Legend", 77, 80),
    ("16", "the_pythagorean_theory_of_music_and_color", "The Pythagorean Theory of Music and Color", 81, 84),
    ("17", "fishes_insects_animals_reptiles_and_birds_part_one", "Fishes, Insects, Animals, Reptiles, and Birds", 85, 88),
    ("18", "fishes_insects_animals_reptiles_and_birds_part_two", "Fishes, Insects, Animals, Reptiles, and Birds, Part II", 89, 92),
    ("19", "flowers_plants_fruits_and_trees", "Flowers, Plants, Fruits, and Trees", 93, 96),
    ("20", "stones_metals_and_gems", "Stones, Metals, and Gems", 97, 100),
    ("21", "ceremonial_magic_and_sorcery", "Ceremonial Magic and Sorcery", 101, 104),
    ("22", "the_elements_and_their_inhabitants", "The Elements and Their Inhabitants", 105, 108),
    ("23", "hermetic_pharmacology_chemistry_and_therapeutics", "Hermetic Pharmacology, Chemistry, and Therapeutics", 109, 112),
    ("24", "the_qabbalah_the_secret_doctrine_of_israel", "The Qabbalah, the Secret Doctrine of Israel", 113, 116),
    ("25", "fundamentals_of_qabbalistic_cosmogony", "Fundamentals of Qabbalistic Cosmogony", 117, 120),
    ("26", "the_tree_of_the_sephiroth", "The Tree of the Sephiroth", 121, 124),
    ("27", "qabbalistic_keys_to_the_creation_of_man", "Qabbalistic Keys to the Creation of Man", 125, 128),
    ("28", "an_analysis_of_tarot_cards", "An Analysis of the Tarot Cards", 129, 132),
    ("29", "the_tabernacle_in_the_wilderness", "The Tabernacle in the Wilderness", 133, 136),
    ("30", "the_fraternity_of_the_rose_cross", "The Fraternity of the Rose Cross", 137, 140),
    ("31", "rosicrucian_doctrines_and_tenets", "Rosicrucian Doctrines and Tenets", 141, 144),
    ("32", "fifteen_rosicrucian_and_qabbalistic_diagrams", "Fifteen Rosicrucian and Qabbalistic Diagrams", 145, 148),
    ("33", "alchemy_and_its_exponents", "Alchemy and Its Exponents", 149, 152),
    ("34", "the_theory_and_practice_of_alchemy_part_one", "The Theory and Practice of Alchemy", 153, 156),
    ("35", "the_theory_and_practice_of_alchemy_part_two", "The Theory and Practice of Alchemy, Part II", 157, 160),
    ("celentano", "the_hermetic_and_alchemical_figures_of_claudius_de_dominico_celentano_vallis_novi",
     "The Hermetic and Alchemical Figures of Claudius de Dominico Celentano Vallis Novi", 160, 160),
    ("36", "the_chemical_marriage", "The Chemical Marriage", 161, 164),
    ("37", "bacon_shakspere_and_the_rosicrucians", "Bacon, Shakspere, and the Rosicrucians", 165, 168),
    ("38", "the_cryptogram_as_a_factor_in_symbolic_philosophy", "The Cryptogram as a Factor in Symbolic Philosophy", 169, 172),
    ("39", "freemasonic_symbolism", "Freemasonic Symbolism", 173, 176),
    ("40", "mystic_christianity", "Mystic Christianity", 177, 180),
    ("41", "the_cross_and_the_crucifixion", "The Cross and the Crucifixion", 181, 184),
    ("42", "the_mystery_of_the_apocalypse", "The Mystery of the Apocalypse", 185, 188),
    ("43", "the_faith_of_islam", "The Faith of Islam", 189, 192),
    ("44", "american_indian_symbolism", "American Indian Symbolism", 193, 196),
    ("45", "the_mysteries_and_their_emissaries", "The Mysteries and Their Emissaries", 197, 200),
    ("conclusion", "conclusion", "Conclusion", 201, 204),
]

# The titles the e-text prints at the head of each chapter page ("Next: ..."
# in the OCR printouts), where they differ from the table of contents.
OCR_TITLES = {
    "intro": "Introduction",
    "1": "The Ancient Mysteries and Secret Societies Which Have Influenced Modern Masonic Symbolism",
    "2": "The Ancient Mysteries and Secret Societies, Part Two",
    "3": "The Ancient Mysteries and Secret Societies, Part Three",
    "5": "The Life and Teachings of Thoth Hermes Trismegistus",
    "8": "The Sun, A Universal Deity",
    "17": "Fishes, Insects, Animals, Reptiles and Birds (Part One)",
    "18": "Fishes, Insects, Animals, Reptiles and Birds (Part Two)",
    "20": "Stones, Metals and Gems",
    "28": "An Analysis of Tarot Cards",
    "34": "The Theory and Practice of Alchemy: Part One",
    "35": "The Theory and Practice of Alchemy: Part Two",
    "celentano": "The Hermetic And Alchemical Figures of Claudius De Dominico Celentano Vallis Novi",
    "37": "Bacon, Shakspere, and the Rosicrucians",
    "38": "The Cryptogram as a factor in Symbolic Philosophy",
}

MAX_CHARS = 4200
TARGET_CHARS = 2600
MIN_PART = 900

# Misreadings in the OCR (only where it is used), checked against the sense
# and against the same words elsewhere in the e-text.
OCR_FIXES = [
    (r"\bIam\b", "I am"),
    (r"\bif net\b", "if not"),
    (r"\bmodem\b", "modern"),
    # The OCR reads the ligatures æ and œ as z, e or ee; the word is certain
    # from the sense and from the same name elsewhere in the book.
    (r"\bJudzeus\b", "Judæus"),
    (r"\bAndre[ez]\b", "Andreæ"),
    (r"\bformule\b", "formulæ"),
    (r"\bmedizval\b", "mediæval"),
    (r"\bNicza\b", "Nicæa"),
    (r"\bIranzus\b", "Iranæus"),
    (r"\bAineid\b", "Æneid"),
    (r"\bAZsop's\b", "Æsop's"),
    (r"\bAésculapius\b", "Æsculapius"),
    (r"\besthetic\b", "æsthetic"),
    (r"\bCesar's\b", "Cæsar's"),
    (r"\bguardian demon\b", "guardian dæmon"),
    (r"\bure[e]?us\b", "uræus"),
    (r"\bpheenix\b", "phœnix"),
    (r"\bManichean\b", "Manichæan"),
    (r"\bTurbe Philosophorum\b", "Turbæ Philosophorum"),
    (r"\bLuneburg\b", "Lunæburg"),
    (r"\bAEneas\b", "Æneas"),
    # Letters the OCR misread, certain from the sense.
    (r"\binto Jight\b", "into light"),
    (r"/ ifted\b", "lifted"),
    (r"\brdle\b", "rôle"),
    (r"\bAfziluth\b", "Atziluth"),
    (r"\bthe / shim\b", "the Ishim"),
    (r"[/\[] sis Unveiled", "Isis Unveiled"),
    (r"\bTannaim \?", "Tannaim?"),
    (r"/ nternational\b", "International"),
    (r"\bwhich man calls Jove\b", "which man calls love"),
    (r"\bThe circle fis named\b", "The circle f is named"),
    (r"\bIIlumined\b", "Illumined"),
    (r"\ba pny line\b", "a tiny line"),
    (r"\bLésung\b", "Lösung"),
    (r"\bRdtsels\b", "Rätsels"),
    (r"\bTYNX\b", "IYNX"),
    (r"\bNumeérales\b", "Numérales"),
    (r"(?<=[A-Za-z] )\|(?= )", "1"),  # "Figure |", "A |": a figure 1
    (r"\[paragraph continues\}", "[paragraph continues]"),
    # Greek and Hebrew the OCR could not read at all: marked, not guessed.
    (r"sno0\*¢ Xptotoc Oeov Yeo Y@tep", "[…]"),
    (r"\bIXOYY\b", "[…]"),
    (r"\* OpTNVv\b", "[…]"),
    (r"\*1000G\b", "[…]"),
    (r"^T 300 A 30 A 1 .*?C 200 C 200 (?=666)", "[…] "),
    # Kircher's book, whose Œ and Æ the OCR cannot read; the title is certain.
    (r"\S*dipus\s+(?:A[^\sg]{0,3}|4\.|AZ )gyptiacus", "Œdipus Ægyptiacus"),
    (r"\(eee eeeeeee\)", "([…])"),
    (r"\beeeeeeeeeto\b", "[…] to"),
    (r"he was @eoe mae;", "he was […];"),
    # Letters the OCR read off the cipher plate in chapter 38.
    (r"^\| VOL AREA$", ""),
    # The OCR dropped the line "Ægyptiacus.)" and ran the chapter title on.
    (r"\(See Gdipus The Bembine Table of Isis$", "(See Œdipus Ægyptiacus.)"),
    # The second printout reads "table." where the first has picture noise.
    (r"read with the aid of the above ae$", "read with the aid of the above table."),
    (r"\bA2sculapius\b", "Æsculapius"),
    (r"\bMvuptoyeveote\b", "[…]"),
    (r"\bB(?:6|O|oO)hme\b", "Böhme"),
    (r"\bA 1toA 10\b", "A 1 to A 10"),
    (r"\bin r618\b", "in 1618"),
    (r"^\. (?=[A-Z])", ""),
    (r"\bwhich means J Am \[", "which means I Am ["),
    (r"\bB 2 carne B 3\b", "B 2 came B 3"),
    (r"\bB 4' the second Mercy\b", "B 4, the second Mercy"),
    (r"\bINGREAT MEASURE\b", "IN GREAT MEASURE"),
    (r"/nternational\b", "International"),
    (r"\bJdea\b", "Idea"),
    (r"\bzether\b", "æther"),
    (r"\brode forth aman upon\b", "rode forth a man upon"),
    (r"\bwas ina proper\b", "was in a proper"),
    (r"\bSpeershiittlers\b", "Speershüttlers"),
]

# A run of characters the OCR made of Hebrew letters ("¢", "eee*", "¢**s").
GARBLED = re.compile(r"(?<![\w*])(?:[¢€«@][\w¢*€«@]*|eee\*|\*[¢€«][\w¢*€«]*|¢\w*)(?:[ ,]*(?:[¢€«@][\w¢*€«@]*|eee\*|\*+))*")

TERMINAL = re.compile(r"[.!?:;\"'”’)\]]\s*$")


def norm_words(text):
    return re.findall(r"[a-z0-9]+", text.lower().replace("æ", "e").replace("œ", "oe"))


def tidy(text):
    text = text.replace(" ", " ").replace("​", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r" +([,;:.?!])(?=\s|$)", r"\1", text)
    return text.strip()


# ---------------------------------------------------------------------------
# THE WEB PAGES
# ---------------------------------------------------------------------------


def prose(page):
    start = page.find('data-slot="reader-prose"')
    if start < 0:
        raise SystemExit("no reader-prose in a page")
    end = page.find("</article>", start)
    body = page[start:end]
    body = body[body.find(">") + 1 :]
    body = re.sub(r'<div data-ad-vro.*?</div></div>', "", body, flags=re.S)
    # The site's navigation: a rule, the breadcrumb, and a table of links.
    body = re.sub(r"<hr>\s*<p>\s*<a href=\"/\">Sacred Texts</a>.*", "", body, flags=re.S)
    return body


def cell_text(cell):
    cell = re.sub(r"<br\s*/?>", " ", cell)
    cell = re.sub(r"<[^>]+>", " ", cell)
    return re.sub(r"\s+", " ", html.unescape(cell)).strip()


def table_text(table):
    rows = []
    for row in re.findall(r"<tr>(.*?)</tr>", table, flags=re.S):
        cells = [cell_text(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", row, flags=re.S)]
        cells = [c for c in cells]
        while cells and not cells[-1]:
            cells.pop()
        if any(cells):
            rows.append(" | ".join(cells))
    return "\n".join(rows)


def web_blocks(body):
    """[('page', n) | ('head', text) | ('para', text) | ('figstart', title, image) | ('subtitle', text)]"""
    tables = []

    def keep_table(m):
        tables.append(table_text(m.group(0)))
        return f"<p>@@TABLE{len(tables) - 1}@@</p>"

    body = re.sub(r"<table>.*?</table>", keep_table, body, flags=re.S)
    # A figure: an empty anchor, then the picture, "Click to enlarge" and its title.
    body = re.sub(r"<p><a(?: id=\"img_[^\"]*\" name=\"[^\"]*\")?></a>\s*</p>", "\n@@FIG@@\n", body)
    body = re.sub(
        r"(?:<a href=\"[^\"]*\">)?<img[^>]*src=\"[^\"]*/tn/([^\"/]+)\.jpg\"[^>]*>(?:<br>)?\s*Click to enlarge(?:</a>)?(?:<br>([^<]*)<br>)?",
        lambda m: f"\n@@IMG {m.group(1)}|{(m.group(2) or '').strip()}@@\n",
        body,
    )
    body = re.sub(r"<a[^>]*>(p\. \d+)</a>", r"\n@@P\1@@\n", body)
    body = re.sub(r"<h1>.*?</h1>", "", body, flags=re.S)
    body = re.sub(r"<h2>(.*?)</h2>", lambda m: f"\n@@SUB{cell_text(m.group(1))}@@\n", body, flags=re.S)
    body = re.sub(r"<h[34]>(.*?)</h[34]>", lambda m: f"\n@@H{cell_text(m.group(1))}@@\n", body, flags=re.S)
    body = re.sub(r"<br\s*/?>", "\n", body)
    body = re.sub(r"</?(p|div|section|hr|tbody)[^>]*>", "\n\n", body)
    body = re.sub(r"<[^>]+>", "", body)
    body = html.unescape(body)
    out = []

    def marker(line):
        m = re.fullmatch(r"@@Pp\. (\d+)@@", line)
        if m:
            return ("page", m.group(1))
        m = re.fullmatch(r"@@IMG ([^|]*)\|(.*)@@", line)
        if m:
            return ("img", m.group(1), m.group(2))
        if line == "@@FIG@@":
            return ("fig",)
        m = re.fullmatch(r"@@H(.*)@@", line)
        if m:
            return ("head", m.group(1))
        m = re.fullmatch(r"@@SUB(.*)@@", line)
        if m:
            return ("subtitle", m.group(1))
        m = re.fullmatch(r"@@TABLE(\d+)@@", line)
        if m:
            return ("para", tables[int(m.group(1))])
        return None

    for chunk in re.split(r"\n\s*\n", body):
        chunk = tidy(chunk)
        if not chunk:
            continue
        text = []
        for line in chunk.split("\n"):
            line = line.strip()
            found = marker(line)
            if found is None:
                if line and line != "Click to enlarge":
                    text.append(line)
                continue
            if text:
                out.append(("para", "\n".join(text)))
                text = []
            out.append(found)
        if text:
            out.append(("para", "\n".join(text)))
    return out


# ---------------------------------------------------------------------------
# THE ARCHIVE.ORG PRINTOUTS
# ---------------------------------------------------------------------------


def flat(text):
    text = text.lower().replace("\u00e6", "ae").replace("\u0153", "oe")
    text = unicodedata.normalize("NFKD", text)
    return re.sub(r"[^a-z]", "", text)


def ocr_chapter_lines(text, key, report):
    """The lines of one chapter in an OCR printout, from its title to the next 'Next:'."""
    title = OCR_TITLES.get(key) or next(c[2] for c in CHAPTERS if c[0] == key)
    lines = text.splitlines()
    want = flat(title)
    scored = [
        (difflib.SequenceMatcher(None, flat(l.strip()[6:]), want).ratio(), i)
        for i, l in enumerate(lines)
        if l.strip().startswith("Next: ")
    ]
    best, start = max(scored)
    if best < 0.9:
        report.append(f"{key}: no 'Next: {title}' in the OCR")
        return []
    end = next((i for i in range(start + 1, len(lines)) if lines[i].strip().startswith("Next: ")), len(lines))
    if key == "conclusion":
        # The printout ends with plates and the e-text's errata page.
        end = next(i for i in range(start, len(lines)) if "the philosophers of the ages invite YOU" in lines[i]) + 1
    return lines[start + 1 : end]


def transplant_pages(lines_a, lines_b, key, report):
    """Put back into the first OCR the page markers only the second one has."""
    marker = re.compile(r"^\s*p\.\s*(\d+)\s*$")
    have = {marker.match(l).group(1) for l in lines_a if marker.match(l)}
    for i, line in enumerate(lines_b):
        m = marker.match(line)
        if not m or m.group(1) in have:
            continue
        nxt = next((l for l in lines_b[i + 1 :] if l.strip()), "")
        probe = flat(nxt)[:40]
        if len(probe) < 15:
            report.append(f"{key}: page {m.group(1)}: no line to place it by")
            continue
        at = next((j for j, l in enumerate(lines_a) if flat(l).startswith(probe)), None)
        if at is None:
            report.append(f"{key}: page {m.group(1)}: its first line is not in the first OCR")
            continue
        lines_a.insert(at, f"p. {m.group(1)}")
        have.add(m.group(1))
    return lines_a


def junction(before, after):
    """A key for the meeting of two pieces of text: four words either side."""
    return " ".join(norm_words(before)[-4:]) + "|" + " ".join(norm_words(after)[:4])


def paragraph_breaks(text):
    """Every place the printout has a blank line between two lines of text."""
    keys = set()
    lines = [l.strip() for l in text.splitlines()]
    for i, line in enumerate(lines):
        if line or i == 0:
            continue
        before = next((l for l in reversed(lines[max(0, i - 3) : i]) if l), "")
        after = next((l for l in lines[i + 1 : i + 4] if l), "")
        if before and after:
            keys.add(junction(before, after))
    return keys


def ocr_blocks(lines, real, breaks):
    """The same blocks as web_blocks, from the printout's lines. `real` tells
    a line of text from a line the OCR read off a picture; `breaks` holds the
    blank lines of the second printout. A blank line in the first is a new
    paragraph if the second printout has one at the same place too (two
    printouts do not break their pages at the same words), or if the line
    before it is short and ends a sentence; otherwise it is the foot of a
    printed page and the paragraph goes on."""
    out = []
    para = []
    previous_len = 0
    fig_title_next = False

    def flush():
        if para:
            out.append(("para", " ".join(para)))
            para.clear()

    blank_run = 0
    for at, raw in enumerate(lines):
        line = raw.strip()
        if not line:
            blank_run += 1
            continue
        if line in ("=", "Sacred Texts Esoteric Index Previous Next") or line.startswith("Sacred Texts "):
            continue
        if len(line) < 50 and not real(line) and not re.fullmatch(r"p[.;,:]\s*\d+", line) and not line.endswith("enlarge"):
            continue
        m = re.fullmatch(r"p[.;,:]\s*(\d+)", line)
        if m:
            flush()
            out.append(("page", m.group(1)))
            blank_run = 0
            previous_len = 0
            continue
        if re.fullmatch(r"Click\b.{0,6}\benlarge", line) or re.fullmatch(r"\W{0,3}\s*to enlarge", line):
            flush()
            out.append(("fig",))
            out.append(("img", "", ""))
            fig_title_next = True
            blank_run = 0
            continue
        following = next((l.strip() for l in lines[at + 1 : at + 4] if l.strip()), "")
        if (
            not fig_title_next
            and re.fullmatch(r"[A-Z][A-Z0-9 ,'\-&:\"()]*(?:'s)?[A-Z0-9 ,'\-&:\"()]*\.", line)
            and len(line.split()) >= 2
            and following.startswith("From ")
        ):
            # A figure title whose "Click to enlarge" line this printout lost.
            flush()
            out.append(("fig",))
            out.append(("img", "", line))
            blank_run = 0
            continue
        if fig_title_next:
            out[-1] = ("img", "", line)
            fig_title_next = False
            blank_run = 0
            continue
        if blank_run and para:
            ends = TERMINAL.search(para[-1]) is not None
            if junction(para[-1], line) in breaks or (ends and previous_len < 80) or not ends and previous_len < 50:
                flush()
        blank_run = 0
        para.append(line)
        previous_len = len(raw.rstrip())
    flush()
    # Headings: a one-line paragraph in capitals that is not a figure title.
    result = []
    for block in out:
        if block[0] == "para" and len(block[1]) < 120 and re.fullmatch(r"[A-Z0-9 ,.;:'\-Æ&()]+", block[1]) and not block[1].endswith(".") and re.search(r"[A-Z]{3}", block[1]):
            result.append(("head", block[1]))
        else:
            result.append(block)
    return result


# Scanning errors in the e-text itself (so in the web pages and both OCRs
# alike), corrected only where the right word is certain from the sense. Each
# pattern carries enough context to match once.
ETEXT_FIXES = [
    (r"masquerading in malt attire", "masquerading in male attire"),
    (r"upon a checker-hoard floor", "upon a checker-board floor"),
    (r"whether the maid is dosing or opening", "whether the maid is closing or opening"),
    (r"the failing figure in the foreground", "the falling figure in the foreground"),
    (r"\bthe seven planers\b", "the seven planets"),
    (r"and an orb n his left", "and an orb in his left"),
    (r"the skirt forms s right-angled", "the skirt forms a right-angled"),
    (r"the Hanged Man, an portrays", "the Hanged Man, and portrays"),
    (r"as rain, to drawn up and fall", "as rain, to be drawn up and fall"),
    (r"Smyth's Life and Wok at", "Smyth's Life and Work at"),
    (r"Far this reason it is said to refute", "For this reason it is said to refute"),
    (r"17 felt wide", "17 feet wide"),
    (r"passing mere than 100 feet", "passing more than 100 feet"),
    (r"walls grooved far purposes", "walls grooved for purposes"),
    (r"Presuming that the capstone as originally", "Presuming that the capstone was originally"),
    (r"in exchange far a princely ransom", "in exchange for a princely ransom"),
    (r"Small pieces a the old drape", "Small pieces of the old drape"),
]


# More certain e-text misreadings, found while reading every passage for the
# plain-words layer. Literal strings with enough context to be unambiguous;
# readings that were not certain are left as Hall's e-text prints them.
LITERAL_FIXES = [
    ('ford of the sun', 'lord of the sun'),
    ('was scatted', 'was started'),
    ('prayed and medicated', 'prayed and meditated'),
    ('emblematic of the planers', 'emblematic of the planets'),
    ('ahs not been', 'has not been'),
    ('birch into the physical', 'birth into the physical'),
    ('Rice of Serapis', 'Rites of Serapis'),
    ('during steep', 'during sleep'),
    ('Our of the ashes', 'Out of the ashes'),
    ('far evolution is', 'for evolution is'),
    ('At me time', 'At one time'),
    ('the planer Venus', 'the planet Venus'),
    ('Ashterorh', 'Ashtoreth'),
    ('bur the guardian', 'but the guardian'),
    ('were nor looked', 'were not looked'),
    ('should nor be confused', 'should not be confused'),
    ('law, arc, astrology', 'law, art, astrology'),
    ('Thcsmophoria', 'Thesmophoria'),
    ('gold cannot he sullied', 'gold cannot be sullied'),
    ('must nor confuse', 'must not confuse'),
    ('completely dosed', 'completely closed'),
    ('At the paint where', 'At the point where'),
    ('torch of Herm.', 'torch of Hermes'),
    ('the most: famous', 'the most famous'),
    ('rose straightway our of', 'rose straightway out of'),
    ('his material body from. his', 'his material body from his'),
    ('fire, hear, and motion', 'fire, heat, and motion'),
    ('God the Son he Illuminating', 'God the Son the Illuminating'),
    ('to wandering the lower', 'to wander the lower'),
    ('other planers being', 'other planets being'),
    ('the planers as embryos', 'the planets as embryos'),
    ('could nor possibly', 'could not possibly'),
    ('did nor actually', 'did not actually'),
    ('earth bring powerless', 'earth being powerless'),
    ('to he reflections', 'to be reflections'),
    ('can he proved', 'can be proved'),
    ('lower par, of his', 'lower part of his'),
    ('unlawful to cat', 'unlawful to eat'),
    ('cop per', 'copper'),
    ('they posses a', 'they possess a'),
    ('consisted often houses', 'consisted of ten houses'),
    ('brightest scars', 'brightest stars'),
    ('in a medal lion', 'in a medallion'),
    ('as maybe learnt', 'as may be learnt'),
    ('and the done the world', 'and the dome the world'),
    ('poured our the whole', 'poured out the whole'),
    ('invisible i,. made', 'invisible is made'),
    ('temples or combs', 'temples or tombs'),
    ('Mysteries .Thus', 'Mysteries. Thus'),
    ('communicated c to', 'communicated to'),
    ('that: it was a votive', 'that it was a votive'),
    ('it: was naturally', 'it was naturally'),
    ('(e) a flat plate', '(3) a flat plate'),
    ('momentarily irritate over', 'momentarily irritated over'),
    ('he had dome.', 'he had done.'),
    ('fox it bears', 'for it bears'),
    ('stars and planers', 'stars and planets'),
    ('dated not divulge', 'dared not divulge'),
    ('died with diem', 'died with them'),
    ('made no effort: to', 'made no effort to'),
    ('the stationary pare', 'the stationary part'),
    ('light must he cast', 'light must be cast'),
    ('called in, composite', 'called incomposite'),
    ('at: the top', 'at the top'),
    ('he took with his supply', 'he took with him his supply'),
    ('It is possible that: at', 'It is possible that at'),
    ('motion of the planers about', 'motion of the planets about'),
    ('experiences of the fast', 'experiences of the past'),
    ('called the called the', 'called the'),
    ('was nor born of', 'was not born of'),
    ('far the purpose of segregating', 'for the purpose of segregating'),
    ('spherical in farm', 'spherical in form'),
    ('with in the narrow', 'within the narrow'),
    ('and it: finally', 'and it finally'),
    ('but: spirit is more', 'but spirit is more'),
    ('the multi form', 'the multiform'),
    ('The Mysteries caught that', 'The Mysteries taught that'),
    ('do not elate to', 'do not relate to'),
    ('creative breach', 'creative breath'),
    ('and the Faces, Furies', 'and the Fates, Furies'),
    ('and soon. The first odd', 'and so on. The first odd'),
    ('a Tyrian by birch', 'a Tyrian by birth'),
    ('physical birch actually', 'physical birth actually'),
    ('secretly home through', 'secretly borne through'),
    ('Fiery Architect: of', 'Fiery Architect of'),
    ('/ifted up', 'lifted up'),
    ('trestleboad', 'trestleboard'),
    ('Macrocosm an the', 'Macrocosm and the'),
    ('these soul are', 'these souls are'),
    ('ancient plane of cosmic', 'ancient planet of cosmic'),
    ('philosophical reaching', 'philosophical teaching'),
    ('profound effect: of', 'profound effect of'),
    ('encourage only s that', 'encourage only that'),
    ('three--headed', 'three-headed'),
    ('Ruach, 1. e.', 'Ruach, i. e.'),
    ('Sigismund Bastrom', 'Sigismund Bacstrom'),
    ('that: famous', 'that famous'),
    ('it: extended', 'it extended'),
    ('(See The Canon.)This', '(See The Canon.) This'),
    ('CHiram. represents', 'CHiram represents'),
    ('Modem Masonic', 'Modern Masonic'),
    ('The allowing arrangement', 'The following arrangement'),
    ('have the same time, the', 'have the same tone, the'),
    ('substance predominate over', 'substance predominates over'),
    ('ate the scarab', 'are the scarab'),
    ('dwelling in medication', 'dwelling in meditation'),
    ('great snake o the', 'great snake of the'),
    ('the oracle; of Delphi', 'the oracle of Delphi'),
    ('tail in its month', 'tail in its mouth'),
    ('Among other strange fears', 'Among other strange feats'),
    ('should became "fishers', 'should become "fishers'),
    ('having aflame-colored', 'having a flame-colored'),
    ('used as, a symbol', 'used as a symbol'),
    ('H. P, Blavatsky', 'H. P. Blavatsky'),
    ('composite animals. and', 'composite animals and'),
    ('It is signifies', 'It signifies'),
    ('scorpion).The', 'scorpion). The'),
    ('four a relationship', 'four--a relationship'),
    ('and Horns are often', 'and Horus are often'),
    ('and atone time almost', 'and at one time almost'),
    ('the author Of the fourth', 'the author of the fourth'),
    ('and it exhibition', 'and its exhibition'),
    ('composed of 13 stars,,', 'composed of 13 stars,'),
    ('their flight was, accompanied', 'their flight was accompanied'),
    ('described the Greeks as', 'described by the Greeks as'),
    ('This biform, creature', 'This biform creature'),
    ('Front this is derived', 'From this is derived'),
    ('lead them in and our of the form', 'lead them in and out of the form'),
    ('doctrine against, which', 'doctrine against which'),
    ('the locus blossom', 'the lotus blossom'),
    ('sixteen-petaled locus', 'sixteen-petaled lotus'),
    ('thousand-petaled locus', 'thousand-petaled lotus'),
    ("Nature's per feet achievement", "Nature's perfect achievement"),
    ('the mate date palm', 'the male date palm'),
    ('seeking co lead man', 'seeking to lead man'),
    ('polypi do in die sea', 'polypi do in the sea'),
    ('Dionysos, Arys, and Adonis', 'Dionysos, Atys, and Adonis'),
    ('symbolizes the hem of salvation', 'symbolizes the horn of salvation'),
    ('Dionysiac planes; that is', 'Dionysiac plants; that is'),
    ('The alchemists were went to', 'The alchemists were wont to'),
    ('winds upward through he four', 'winds upward through the four'),
    ('its antitypc or', 'its antitype or'),
    ('between primitive man and modem', 'between primitive man and modern'),
    ('the collet was turned in ward', 'the collet was turned inward'),
    ('to Virgo the emerald, camelian', 'to Virgo the emerald, carnelian'),
    ('to Sagittarius die hyacinth', 'to Sagittarius the hyacinth'),
    ('desiring to rest the accuracy', 'desiring to test the accuracy'),
    ('pact with the elemental demon maybe fully', 'pact with the elemental demon may be fully'),
    ('her sixth child substituted', 'her sixth child, substituted'),
    ('house, cc cetera', 'house, et cetera'),
    ('might serve in alike future', 'might serve in a like future'),
    ('written m virgin Parchment', 'written on virgin Parchment'),
    ('must not lost confidence', 'must not lose confidence'),
    ('asks nor requires nothing', 'asks or requires nothing'),
    ('The seven large circle are', 'The seven large circles are'),
    ('they cat and talk', 'they eat and talk'),
    ('There areas many ethers', 'There are as many ethers'),
    ('spend a great part of the rime', 'spend a great part of the time'),
    ('with the coming of the modem Celts', 'with the coming of the modern Celts'),
    ('the salamanders as their drone', 'the salamanders as their throne'),
    ('In the last: discourse', 'In the last discourse'),
    ('others (elementals]', 'others [elementals]'),
    ('sight and bearing and smell', 'sight and hearing and smell'),
    ('More over, the temperament', 'Moreover, the temperament'),
    ('the rulers and controlled than', 'the rulers and controlled them'),
    ('science was philosophic and religious I religion', 'science was philosophic and religious; religion'),
    ('if the later make room', 'if the latter make room'),
    ('and a there are others', 'and there are others'),
    ('care a great: deal more', 'care a great deal more'),
    ('"etheric doubles, "seen', '"etheric doubles," seen'),
    ('nearly all modern arcs and', 'nearly all modern arts and'),
    ('Modem mediums, while', 'Modern mediums, while'),
    ('the secret: significance', 'the secret significance'),
    ('records and formula: which', 'records and formulae which'),
    ('Among the-American Indians', 'Among the American Indians'),
    ('after which I had same dizziness', 'after which I had some dizziness'),
    ('less profitable tome', 'less profitable to me'),
    ('forms one syllables of', 'forms one syllable of'),
    ('students of Qabbalism. have', 'students of Qabbalism have'),
    ('regain its lost a estate', 'regain its lost estate'),
    ('by the late Win. Wynn Westcott', 'by the late Wm. Wynn Westcott'),
    ('the rest, bur the controversy', 'the rest, but the controversy'),
    ('are called "Mothers," sewn', 'are called "Mothers," seven'),
    ('if your month opens', 'if your mouth opens'),
    ('Comprehend this great, wisdom', 'Comprehend this great wisdom'),
    ('cojoined as', 'conjoined as'),
    ('the month liar in', 'the month Iyar in'),
    ('to predominate infertility', 'to predominate in fertility'),
    ('twelve chief organs in ` human', 'twelve chief organs in the human'),
    ('fertility life, power', 'fertility, life, power'),
    ('4, The signs', '4. The signs'),
    ('the gall, and the tongues', 'the gall, and the tongue'),
    ('Bible students ham revered', 'Bible students have revered'),
    ('withה י ו', 'with ה י ו'),
    ('the letter. ב', 'the letter ב'),
    ('four symbolical trees, each hearing', 'four symbolical trees, each bearing'),
    ('C 1 toC 10', 'C 1 to C 10'),
    ('nine others which conic out', 'nine others which come out'),
    ('or first manifested. God', 'or first manifested God'),
    ('intelligences, planers, and elements', 'intelligences, planets, and elements'),
    ('the order of the spheres is the Name', 'the order of the spheres is the same'),
    ('the Scat of the Sons', 'the Seat of the Sons'),
    ('the /shim, the Souls', 'the Ishim, the Souls'),
    ('(if equilibrated forces', '(of equilibrated forces'),
    ('divisions areas follows', 'divisions are as follows'),
    ('the numbers 1 to 20 and', 'the numbers 1 to 10 and'),
    ('which is modification of', 'which is a modification of'),
    ('is pronounce Jehovah', 'is pronounced Jehovah'),
    ('the a Yod is in reality', 'the Yod is in reality'),
    ('(See /sis Unveiled', '(See Isis Unveiled'),
    ('(See [sis Unveiled', '(See Isis Unveiled'),
    ('mighty living one E/-Chai', 'mighty living one El-Chai'),
    ('Encyclopedia, 1s representative', 'Encyclopedia, is representative'),
    ('sacred books..', 'sacred books.'),
    ('Chochmah; is the true', 'Chochmah, is the true'),
    ('the Causal sphere With its', 'the Causal sphere with its'),
    ('androgynous and nor subject', 'androgynous and not subject'),
    ('The Ignaratitine Friars', 'The Ignorantine Friars'),
    ('He who is aware, JS!', 'He who is aware, IS!'),
    ('Get thee behind me, rempter', 'Get thee behind me, tempter'),
    ('"IT am the Lord', '"I am the Lord'),
    ('I have led thee our of', 'I have led thee out of'),
    ('The early Church Father--notably', 'The early Church Fathers--notably'),
    ('the remaining four cress sections', 'the remaining four cross sections'),
    ('saved his own family Christ', 'saved his own family; Christ'),
    ('Westcott, and Schuré-are', 'Westcott, and Schuré--are'),
    ('divisions of the human body..', 'divisions of the human body.'),
    ('forefinger other left hand', 'forefinger of her left hand'),
    ('forehead is adorned wit the', 'forehead is adorned with the'),
    ('the Urim. and Thummim', 'the Urim and Thummim'),
    ('The sphinxes drawing the chariot resent', 'The sphinxes drawing the chariot represent'),
    ('the full countenance truth', 'the full countenance of truth'),
    ('a parent parts of all', 'apparent parts of all'),
    ('upper into the lower, In some', 'upper into the lower. In some'),
    ('winged like a bar, showing', 'winged like a bat, showing'),
    ('nocturnal, or shadow inferior', 'nocturnal, or shadowy inferior'),
    ('The lighting bolt sometimes', 'The lightning bolt sometimes'),
    ('other on and, her body', 'other on land, her body'),
    ('from the solar face Levi', 'from the solar face. Levi'),
    ('powers reside.', 'powers preside.'),
    ('rather than resurrection, In philosophy', 'rather than resurrection. In philosophy'),
    ('in the form Of the emblem', 'in the form of the emblem'),
    ('in his hat-are', 'in his hat--are'),
    ('(43) Venus; (45) the Sun', '(44) Venus; (45) the Sun'),
    ('Music, (27)', 'Music; (27)'),
    ('Wisdom and ~as gone', 'Wisdom and has gone'),
    ('The Tabernacle of: the Jews', 'The Tabernacle of the Jews'),
    ('greatest, minds', 'greatest minds'),
    ('Nor only was the Tabernacle', 'Not only was the Tabernacle'),
    ('onix stones, and stories to be set', 'onix stones, and stones to be set'),
    ('secret doctrine also caught the priests', 'secret doctrine also taught the priests'),
    ('Th. robe of the High Priest', 'The robe of the High Priest'),
    ('Josephus tells its that', 'Josephus tells us that'),
    ('C.R.C! continued', 'C.R.C. continued'),
    ('during n the philosophic', 'during the philosophic'),
    ('give tip their secret', 'give up their secret'),
    ('We must not forger', 'We must not forget'),
    ('visible world bur in', 'visible world but in'),
    ("favorite subject's for", 'favorite subjects for'),
    ('two covers-the lower', 'two covers--the lower'),
    ('High Priest: in the affirmative', 'High Priest in the affirmative'),
    ('weakness. just as Nature', 'weakness. Just as Nature'),
    ('the learned of out day', 'the learned of our day'),
    ('they do nor realize', 'they do not realize'),
    ('spreading die doctrine', 'spreading the doctrine'),
    ('London the some day', 'London the same day'),
    ('they caught me excellent predictions', 'they taught me excellent predictions'),
    ('liberate the maws from', 'liberate the masses from'),
    ('whet a man has partaken', 'when a man has partaken'),
    ('and that: which heals', 'and that which heals'),
    ('which have net been cleared', 'which have not been cleared'),
    ('these two principle, were', 'these two principles were'),
    ('difficult to tract from', 'difficult to extract from'),
    ('circle of he minerals', 'circle of the minerals'),
    ('as signified in Figure 2:', 'as signified in Figure 25.'),
    ('and Figure M (the same inverted)', 'and Figure 31 (the same inverted)'),
    ('in the one river, Figure W,', 'in the one river, Figure 10,'),
    ('TABLE Ill, Figure 52', 'TABLE III, Figure 52'),
    ('g (Taurus), / (Pisces)', 'g (Taurus), h (Pisces)'),
    ('k (Cancer), / (Virgo)', 'k (Cancer), l (Virgo)'),
    ("A represents the Father Principle, F' the", 'A represents the Father Principle, F the'),
    ('letters H, J, J, K', 'letters H, I, J, K'),
    ('space from k to 7 contains', 'space from k to l contains'),
    ('Mars; / to m,', 'Mars; l to m,'),
    ('written: J Shall Be That', 'written: I Shall Be That'),
    ('Nicholas Flarnmel', 'Nicholas Flammel'),
    ('extracting gold and silver our of', 'extracting gold and silver out of'),
    ('5,000, 000', '5,000,000'),
    ('four different: alchemists', 'four different alchemists'),
    ('His barred for physicians', 'His hatred for physicians'),
    ('but: the most credible', 'but the most credible'),
    ("Philosopher's Scone", "Philosopher's Stone"),
    ('women at: the court', 'women at the court'),
    ('came in contact: with Arnold', 'came in contact with Arnold'),
    ('the principles or alchemy', 'the principles of alchemy'),
    ('and or, the way the physician', 'and on the way the physician'),
    ('By arc it is possible', 'By art it is possible'),
    ('either extensiveness; or', 'either extensiveness or'),
    ('living. beings', 'living beings'),
    ('his since service', 'his sincere service'),
    ('Albertus, had prepare', 'Albertus had prepared'),
    ('Albertus, uttered', 'Albertus uttered'),
    ('certain that m abbot', 'certain that an abbot'),
    ('nothing to the uniformed', 'nothing to the uninformed'),
    ('thoughts, words. and acts', 'thoughts, words, and acts'),
    ('published in Ultona in 1785', 'published in Altona in 1785'),
    ('rotations; of augmentations', 'rotations of augmentations'),
    ('with the ace of the solar disc', 'with the face of the solar disc'),
    ('lunar crescent: much after', 'lunar crescent, much after'),
    ('I n the documents which follow', 'In the documents which follow'),
    ('1.e. Chiram', 'i.e. Chiram'),
    ('1.e. our third', 'i.e. our third'),
    ('when it muse become', 'when it must become'),
    ('(..e., in Chiram', '(i.e., in Chiram'),
    ('to find Out this way', 'to find out this way'),
    ('Be resolute and rake heed', 'Be resolute and take heed'),
    ('there shall follow afire', 'there shall follow a fire'),
    ('as your Guide shall reach you', 'as your Guide shall teach you'),
    ('(when it: comes)', '(when it comes)'),
    ('Insist upon the way that: leads', 'Insist upon the way that leads'),
    ('in the mall spiral', 'in the small spiral'),
    ("From Phililethales' Lumen", "From Philalethes' Lumen"),
    ('(as a I am told by the Magi)', '(as I am told by the Magi)'),
    ('(Set accompanying letter.)', '(See accompanying letter.)'),
    ('being who concerned with', 'being wholly concerned with'),
    ('the u per half black', 'the upper half black'),
    ('To the right if the devouring', 'To the right of the devouring'),
    ('Let them believe that. everything', 'Let them believe that everything'),
    ('would threw the Stone', 'would throw the Stone'),
    ('reads:," This Stone', 'reads: "This Stone'),
    ('bounteously. without sin', 'bounteously, without sin'),
    ('the exclamation; "O Sages', 'the exclamation: "O Sages'),
    ('without a proceeding coagulation', 'without a preceding coagulation'),
    ('a secret: not generally', 'a secret not generally'),
    ("practice of the Philosopher's Some", "practice of the Philosopher's Stone"),
    ('fruit will in such away be', 'fruit will in such a way be'),
    ('I shall net die but', 'I shall not die but'),
    ('black, the gradually changes', 'black, then gradually changes'),
    ('The four capitals. I A A T', 'The four capitals, I A A T'),
    ('The initial, I A A T appear', 'The initials I A A T appear'),
    ('could be safety weighed', 'could be safely weighed'),
    ('Date et dabitur volis', 'Date et dabitur vobis'),
    ("placed the if Moor's head", "placed the Moor's head"),
    ('Here the globe were suspended', 'Here the globe was suspended'),
    ('in the history or literature created', 'in the history of literature created'),
    ('rendered illegible being covered', 'rendered illegible, being covered'),
    ('defacing the volume, While', 'defacing the volume. While'),
    ('the Deity surround Himself', 'the Deity surrounds Himself'),
    ('could have conceived, A Midsummer', 'could have conceived A Midsummer'),
    ('writes: " It will eventually', 'writes: "It will eventually'),
    ('identify these volumes bur also', 'identify these volumes but also'),
    ('dissemination of s the arcana', 'dissemination of the arcana'),
    ("title page of Montaigue's Essays", "title page of Montaigne's Essays"),
    ('confronted by this difficultly', 'confronted by this difficulty'),
    ('counting both / and J as 9', 'counting both I and J as 9'),
    ('Albert: Pike describes', 'Albert Pike describes'),
    ('be: EF, T, A, O', 'be: E, T, A, O'),
    ('may form words: A, J, O', 'may form words: A, I, O'),
    ('discover [he letters', 'discover the letters'),
    ('the word WISDOM become baabaa', 'the word WISDOM becomes baabaa'),
    ('Scientiarum (g.v.)', 'Scientiarum (q.v.)'),
    ('The F and M, the P, and Y,', 'The F and M, the P and Y,'),
    ('volume on cryptogram, and ciphers', 'volume on cryptograms and ciphers'),
    ('Contrast the "1" in "wisdom"', 'Contrast the "i" in "wisdom"'),
    ('thinner ie more angular', 'thinner and more angular'),
    ('opposite any me of he letters', 'opposite any one of the letters'),
    ('In some, cases the inner', 'In some cases the inner'),
    ('connects the throne, of divine', 'connects the throne of divine'),
    ('the divine source, of law--', 'the divine source of law--'),
    ('The second Circle', 'The second circle'),
    ('intended m conceal Baconian', 'intended to conceal Baconian'),
    ('Not also the peculiar line', 'Note also the peculiar line'),
    ('that the face itself a mask', 'that the face itself is a mask'),
    ('The date, 1623, Plus the', 'The date, 1623, plus the'),
    ('1 became A, 6 becomes F', '1 becomes A, 6 becomes F'),
    ('a member of me of those', 'a member of one of those'),
    ("considered me of Britain's", "considered one of Britain's"),
    ("Ralegh's enemies, Playing upon", "Ralegh's enemies, playing upon"),
    ('The engraving is a mass Rosicrucian', 'The engraving is a mass of Rosicrucian'),
    ('he had consecrate his life', 'he had consecrated his life'),
    ("the Latin farm of Bacon's name", "the Latin form of Bacon's name"),
    ('derived from he word beech', 'derived from the word beech'),
    ('marginal figures 4, 5;, 6, and 7', 'marginal figures 4, 5, 6, and 7'),
    ('his head resting upon his hand. is', 'his head resting upon his hand, is'),
    ('century after his b death', 'century after his death'),
    ('as it is noted in the Chap, aforesaid', 'as it is noted in the Chap. aforesaid'),
    ('Constitution there upon declares', 'Constitution thereupon declares'),
    ('children of Seth there fore raised', 'children of Seth therefore raised'),
    ('he engraved the secret reaching', 'he engraved the secret teaching'),
    ('translated from the brow Of Mount', 'translated from the brow of Mount'),
    ('the document States that', 'the document states that'),
    ('Propriety is that: perfection', 'Propriety is that perfection'),
    ('Temple of Civilization-that vast', 'Temple of Civilization--that vast'),
    ('the human body-the Little House', 'the human body--the Little House'),
    ('containing amass of pagan', 'containing a mass of pagan'),
    ('on successively lower planes ate five', 'on successively lower planes are five'),
    ('A hundred religious have brought', 'A hundred religions have brought'),
    ('and ii seemed to me', 'and it seemed to me'),
    ('the spirit: of Egyptian', 'the spirit of Egyptian'),
    ('which is given into me, as a wise', 'which is given unto me, as a wise'),
    ("bear testimony as to the'(validity", 'bear testimony as to the (validity'),
    ('called of God an high prim after', 'called of God an high priest after'),
    ('banks of Lake Maoris', 'banks of Lake Moeris'),
    ('which were later con fused', 'which were later confused'),
    ('did not: ask for the return', 'did not ask for the return'),
    ('evil which had dcstroyed', 'evil which had destroyed'),
    ('fountain of natural re source', 'fountain of natural resource'),
    ('quest for the Holy Grad', 'quest for the Holy Grail'),
    ('"the first bishop of Christendom." just as', '"the first bishop of Christendom." Just as'),
    ('it cast him not only his own life', 'it cost him not only his own life'),
    ('motto of the Order of the Carter', 'motto of the Order of the Garter'),
    ('had four children One day', 'had four children. One day'),
    ('a valuation which he was all that', 'a valuation which was all that'),
    ('fixed his yes upon the youth', 'fixed his eyes upon the youth'),
    ('For thou ust endure', 'For thou must endure'),
    ('persevere, far God loves', 'persevere, for God loves'),
    ('his labors were reworded', 'his labors were rewarded'),
    ('it symbolizes a, harmonious', 'it symbolizes a harmonious'),
    ('by Jacobus de Vorgaine. The Story', 'by Jacobus de Voragine. The story'),
    ('overlaid with golden places', 'overlaid with golden plates'),
    ('Morals and Dogma, by Albeit Pike', 'Morals and Dogma, by Albert Pike'),
    ('the place of death) After it', 'the place of death). After it'),
    ('exile in the Isle of Parmos', 'exile in the Isle of Patmos'),
    ('the sword of Arcs', 'the sword of Ares'),
    ('riding forth at: their appointed', 'riding forth at their appointed'),
    ('original sacred number 1.44', 'original sacred number 144'),
    ('swallow up the immortal part: of human', 'swallow up the immortal part of human'),
    ('as given by Iranæus', 'as given by Irenaeus'),
    ('another angel (Bodotes)', 'another angel (Bootes)'),
    ('mediæval mystics in o the Three Nails', 'mediæval mystics in the Three Nails'),
    ('in which it: stands', 'in which it stands'),
    ('The seven spirit, of God', 'The seven spirits of God'),
    ('clothed wit h the sun', 'clothed with the sun'),
    ('appointed it own initiator', 'appointed its own initiator'),
    ('holy rite, of the philosophic life', 'holy rites of the philosophic life'),
    ('the declare that virtuous', 'they declare that virtuous'),
    ('ever- increasing', 'ever-increasing'),
    ('he is crowed.', 'he is crowned.'),
    ('As he descend into', 'As he descends into'),
    ('which 1s his', 'which is his'),
    ('eleventh ),ear', 'eleventh year'),
    ('There is no God bur God', 'There is no God but God'),
    ('shook t on its foundations', 'shook on its foundations'),
    ('his actions at: home', 'his actions at home'),
    ('Upon this incident-called', 'Upon this incident--called'),
    ('was nor, a sensual man', 'was not a sensual man'),
    ('right palm supporting the right check', 'right palm supporting the right cheek'),
    ('sacred to the planer Venus', 'sacred to the planet Venus'),
    ('were to he mastered', 'were to be mastered'),
    ("'I- Masabih", "'l-Masabih"),
    ('may- veiled God', 'many-veiled God'),
    ('separating he earth', 'separating the earth'),
    ('At the gate of each sphere stood me of the Patriarchs', 'At the gate of each sphere stood one of the Patriarchs'),
    ('upon reaching this Point', 'upon reaching this point'),
    ('but late, it became black', 'but later it became black'),
    ('Like most: aboriginal', 'Like most aboriginal'),
    ('Mythology of All Paces', 'Mythology of All Races'),
    ('earth plane, The theory', 'earth plane. The theory'),
    ('cowards the sanctuary', 'towards the sanctuary'),
    ('would he burned to death', 'would be burned to death'),
    ('Huge bars fluttered', 'Huge bats fluttered'),
    ('perform their strange fears', 'perform their strange feats'),
    ('from the tower nature', 'from the lower nature'),
    ('that he was cold was the Tree', 'that he was told was the Tree'),
    ('river of fire-and those', 'river of fire--and those'),
    ('in these mantles, Allegory', 'in these mantles. Allegory'),
    ('hastened to Khadijah, fearing the vision to have been inspired by the same evil spirits who served the pagan magicians so greatly despised by him, Khadijah', 'hastened to Khadijah, fearing the vision to have been inspired by the same evil spirits who served the pagan magicians so greatly despised by him. Khadijah'),
    ('prepared far the healing', 'prepared for the healing'),
    ('two hunchback god, at the right', 'two hunchback gods at the right'),
    ('Indian baskets pottery,', 'Indian baskets, pottery,'),
    ('it is net only significant', 'it is not only significant'),
    ('understood them profundities', 'understood the profundities'),
    ('scientific-are ignorant', 'scientific--are ignorant'),
    ('Francis Bacon, patient. under', 'Francis Bacon, patient under'),
    ('From this long fist of', 'From this long list of'),
    ('maybe noted his puerile', 'may be noted his puerile'),
    ('in modem history', 'in modern history'),
    ('from the modem orders', 'from the modern orders'),
    ('Trowbridge(loc. cit.)', 'Trowbridge (loc. cit.)'),
    ('talking nor only to', 'talking not only to'),
    ('He was ambidextrous to such a degree that: he', 'He was ambidextrous to such a degree that he'),
    ('was home witness to by', 'was borne witness to by'),
    ('On the subject: of his', 'On the subject of his'),
    ('prime of his life He was', 'prime of his life. He was'),
    ('and be was seemingly', 'and he was seemingly'),
    ('come he myriads of', 'come the myriads of'),
    ('deceit (4)', 'deceit; (4)'),
    ('Rue d, la Sourdière', 'Rue de la Sourdière'),
    ('Iliad of Horner', 'Iliad of Homer'),
    ('that of the modern, world', 'that of the modern world'),
    ('smoke, and hate-a world', 'smoke, and hate--a world'),
    ('mighty, juggernaut', 'mighty juggernaut'),
    ('changed to stone, Fascinated', 'changed to stone. Fascinated'),
    ('physical limitation, Religion', 'physical limitation. Religion'),
    ('can tend the veil', 'can rend the veil'),
    ('slower processes of Nature, This', 'slower processes of Nature. This'),
    ('strife through future ages, But', 'strife through future ages. But'),
    ('superficial may he allowed', 'superficial may be allowed'),
    ('of his own-a world', 'of his own--a world'),
    ('illusions of the senses-arbitrary', 'illusions of the senses--arbitrary'),
    ('love and hate; Some still', 'love and hate; some still'),
    ('these friend, of God', 'these friends of God'),
    ('Colonel Carrick Mallery', 'Colonel Garrick Mallery'),
    ('against: grave robbers', 'against grave robbers'),
    ('each of the four world but', 'each of the four worlds but'),
    ('that be can never be poor', 'that he can never be poor'),
    ('the Sun and Mon. is accompanied by the wards', 'the Sun and Moon is accompanied by the words'),
    ('in about ]\n\n25,920 years', 'in about 25,920 years'),
]


def etext_fix(text):
    for wrong, right in ETEXT_FIXES:
        text = re.sub(wrong, right, text)
    for wrong, right in LITERAL_FIXES:
        text = text.replace(wrong, right)
    return text


# Credit lines that the e-text joins to the caption after them.
RUN_ON_CREDITS = ["From Montfaucon's Antiquities", "Courtesy of Alice Palmer Henderson"]


def ocr_clean(text):
    text = text.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    for wrong, right in OCR_FIXES:
        text = re.sub(wrong, right, text, flags=re.M)
    text = GARBLED.sub("[…]", text)

    def token(m):
        core = m.group(1)
        if core != "*" and re.fullmatch(r"(?:e|\*|\[…\]|¢)+s?", core) and ("*" in core or "eee" in core or "[…]" in core):
            return "[…]" + m.group(2)
        return m.group(0)

    text = re.sub(r"(?<!\S)(\S+?)([,.;:)]*)(?!\S)", token, text)
    # A lone asterisk is a Hebrew letter the OCR lost; three in a row are Hall's ellipsis.
    text = re.sub(r"(?<![*] )(?<![*])\*(?! ?[*])(?<! [*] [*])", "[…]", text)
    text = re.sub(r"\[…\](?:[ ,]*\[…\])+", "[…]", text)
    return tidy(text)


# ---------------------------------------------------------------------------
# BLOCKS -> SECTIONS AND FIGURES
# ---------------------------------------------------------------------------


def structure(key, blocks, first_page, last_page, source_of, report):
    """Walk the blocks: main text into sections by heading, figures apart.

    Returns (sections, figures, subtitle). sections: [heading, first page,
    last page, [paragraphs], sources]; figures: [page, image, title,
    [paragraphs], source]."""
    sections = [[None, first_page, first_page, [], set(), []]]
    figures = []
    subtitle = None
    page = first_page
    in_fig = None
    for i, block in enumerate(blocks):
        kind = block[0]
        src = source_of(i)
        if kind == "page":
            n = block[1]
            value = int(n)
            if n.startswith("0"):
                # An image anchor printed as a page. Once (the Apis, ch. 18) the
                # e-text has lost the picture and its credit and caption follow
                # the anchor in the middle of a sentence; they are a figure.
                in_fig = [page, "", "", [], src]
                figures.append(in_fig)
                continue
            if value == page:
                continue  # a repeated marker
            if value != page + 1:
                report.append(f"{key}: page marker {n} after page {page}; read as {page + 1}")
                value = page + 1
            page = value
            in_fig = None
            continue
        if kind == "subtitle":
            subtitle = block[1]
            continue
        if kind == "fig":
            in_fig = [page, "", "", [], src]
            figures.append(in_fig)
            continue
        if kind == "img":
            if in_fig is None:
                in_fig = [page, "", "", [], src]
                figures.append(in_fig)
            in_fig[1] = block[1] or in_fig[1]
            in_fig[2] = block[2] or in_fig[2]
            continue
        if kind == "head" and re.fullmatch(r"\(?Part (One|Two|Three)\)?", block[1]):
            subtitle = block[1].strip("()")
            continue
        if kind == "head":
            in_fig = None
            sections.append([block[1], page, page, [], set(), []])
            continue
        text = block[1]
        continues = text.startswith("[paragraph continues]")
        text = text.replace("[paragraph continues]", "").strip()
        if in_fig is not None and continues:
            in_fig = None  # the main text goes on after the figure
        if in_fig is not None and re.fullmatch(r"_{5,}", text):
            in_fig = None  # the e-text's rule after a figure, where no page mark follows
            continue
        if in_fig is not None:
            if in_fig[3] and re.search(r"[a-z,;]$", in_fig[3][-1]) and text[:1].isalpha():
                in_fig[3][-1] += " " + text  # a caption paragraph broken by a page
            else:
                in_fig[3].append(text)
            continue
        current = sections[-1]
        current[2] = page
        current[4].add(src)
        paras, meta = current[3], current[5]
        # A paragraph broken by a figure or a page: the first part has no end
        # stop and the next goes on.
        if paras and continues:
            paras[-1] = paras[-1] + ("" if text[:1] in tuple(".,;:)") else " ") + text
        elif paras and not TERMINAL.search(paras[-1]) and not text.startswith(("\"", "'")) and "\n" not in paras[-1]:
            paras[-1] = paras[-1] + " " + text
        elif paras and src == "ocr" and text[:1].islower() and not re.search(r"[.!?]['\"]?$", paras[-1]):
            paras[-1] = paras[-1] + ("" if paras[-1].endswith("-") else " ") + text
        elif paras and paras[-1].endswith("-") and text[:1].islower():
            paras[-1] = paras[-1] + text
        else:
            paras.append(text)
            meta.append([page, page, set()])
        meta[-1][1] = page
        meta[-1][2].add(src)
    if page > last_page:
        report.append(f"{key}: ends on page {page}, table of contents gives {last_page}")
    # Drop empty figures (an anchor with nothing after it) and empty sections.
    figures = [f for f in figures if f[1] or f[2] or f[3]]
    sections = [s for s in sections if s[3] or s[0]]
    return sections, figures, subtitle


def split_parts(paras):
    """Paragraph groups of about TARGET_CHARS; never a cut inside a paragraph."""
    total = sum(len(p) for p in paras)
    if total <= MAX_CHARS:
        return [paras]
    n = max(2, round(total / TARGET_CHARS))
    goal = total / n
    groups, current, size = [], [], 0
    for p in paras:
        if current and size + len(p) / 2 > goal and len(groups) < n - 1:
            groups.append(current)
            current, size = [], 0
        current.append(p)
        size += len(p)
    groups.append(current)
    if len(groups) > 1 and sum(len(p) for p in groups[-1]) < MIN_PART:
        groups[-2].extend(groups.pop())
    return groups


# ---------------------------------------------------------------------------
# THE CROSS-CHECK
# ---------------------------------------------------------------------------


def missing_runs(web_text, ocr_text, minimum=12):
    """Runs of at least `minimum` words in the OCR that the web text lacks."""
    a, b = norm_words(web_text), norm_words(ocr_text)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    runs = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op in ("insert", "replace") and (j2 - j1) - (i2 - i1) >= minimum:
            runs.append((i1, " ".join(b[j1:j2])))
    return runs, len(a)


def main(pages_dir, ocr_a_path, ocr_b_path, out_dir):
    report = []
    ocr_a = open(ocr_a_path, encoding="utf-8").read()
    ocr_b = open(ocr_b_path, encoding="utf-8").read()
    chapters_out, rows, figures_out = [], [], []
    # Every word the web pages use: OCR lines made mostly of other "words"
    # are the OCR reading a picture, not text.
    vocabulary = set()
    for _, slug, *_ in CHAPTERS:
        with open(os.path.join(pages_dir, PREFIX + slug + ".html"), encoding="utf-8") as f:
            vocabulary.update(norm_words(re.sub(r"<[^>]+>", " ", prose(f.read()))))

    breaks_b = paragraph_breaks(ocr_b)
    common = set(norm_words(ocr_a)) & set(norm_words(ocr_b))
    vocabulary |= {w for w in common if len(w) > 2 or w in ("a", "i", "o", "an", "as", "at", "be", "by", "do", "he", "if", "in", "is", "it", "me", "my", "no", "of", "on", "or", "so", "to", "up", "us", "we")}

    def real(text):
        words = norm_words(text)
        return bool(words) and sum(w in vocabulary or w.isdigit() for w in words) / len(words) >= 0.7

    for key, slug, title, first_page, last_page in CHAPTERS:
        with open(os.path.join(pages_dir, PREFIX + slug + ".html"), encoding="utf-8") as f:
            page = f.read()
        if "security service" in page or "Just a moment" in page:
            raise SystemExit(f"{slug}: saved a browser-check page, not the text; fetch it again")
        h1 = re.search(r"<h1>(.*?)</h1>", page[page.find('data-slot="reader-prose"') :], flags=re.S)
        printed_title = cell_text(h1.group(1)) if h1 else title
        blocks = web_blocks(prose(page))
        if key == "dedication":
            # The site's first page is the title page; the dedication follows p. 3.
            i = next(i for i, b in enumerate(blocks) if b == ("page", "3"))
            blocks = blocks[i + 1 :]
        web_text = " ".join(b[-1] for b in blocks if b[0] in ("para", "head"))
        sources = ["web"] * len(blocks)

        lines_a = ocr_chapter_lines(ocr_a, key, report) if key != "dedication" else []
        lines_b = ocr_chapter_lines(ocr_b, key, report) if key != "dedication" else []
        o_blocks = [b if b[0] not in ("para",) else ("para", ocr_clean(b[1])) for b in ocr_blocks(transplant_pages(list(lines_a), lines_b, key, report), real, breaks_b)]
        # Drop what the OCR read from pictures and the site's banner, and the
        # chapter title (the web page gives it as a heading of its own).
        titles = {flat(title), flat(printed_title), flat(OCR_TITLES.get(key, ""))} - {""}
        kept = []
        for b in o_blocks:
            if b[0] in ("para", "head"):
                if len(b[1]) < 300 and not real(b[1]) or len(b[1].strip()) < 6:
                    continue  # read off a picture: "woe", "of", "tie"
                f_b = flat(b[1])
                if f_b and any(f_b in t or (t in f_b and len(f_b) < len(t) + 20) for t in titles):
                    continue
            if b[0] == "img" and b[2] and not real(b[2]):
                b = ("img", b[1], "")
            kept.append(b)
        o_blocks = kept
        o_text = " ".join(b[-1] for b in o_blocks if b[0] in ("para", "head"))
        runs, web_len = missing_runs(web_text, o_text)
        runs = [r for r in runs if real(r[1])]
        truncated = False
        if runs and runs[-1][0] >= web_len - 2:
            # The web page stops early: everything after its last words comes from the OCR.
            truncated = True
            tail_words = norm_words(web_text)[-10:]
            cut = None
            toks = [
                (m.group(0), i, m.end())
                for i, b in enumerate(o_blocks)
                if b[0] in ("para", "head")
                for m in re.finditer(r"[a-z0-9]+", b[1].lower())
            ]
            words = [t[0] for t in toks]
            for j in range(len(words) - len(tail_words) + 1):
                if words[j : j + len(tail_words)] == tail_words:
                    cut = toks[j + len(tail_words) - 1][1:]
            if cut is None:
                raise SystemExit(f"{key}: cannot find where the web page stops in the OCR")
            i, consumed = cut
            # The remainder of the paragraph the web page breaks off in.
            rest = o_blocks[i][1][consumed:].strip()
            if rest[:1] in tuple(".,;:)") or rest[:1].islower():
                rest = "[paragraph continues]" + rest  # the web page stops mid-sentence
            while blocks and blocks[-1][0] in ("fig", "img"):
                blocks.pop()
                sources.pop()
            tail = ([("para", rest)] if rest else []) + o_blocks[i + 1 :]
            blocks = blocks + tail
            sources = sources + ["ocr"] * len(tail)
            runs = runs[:-1]
        for at, words in runs:
            if not real(words):
                continue
            report.append(f"{key}: the OCR has {len(words.split())} words the web page lacks, near web word {at}: {words[:120]}")

        sections, figures, subtitle = structure(key, blocks, first_page, last_page, lambda i: sources[i], report)
        # Illustrations the web page leaves out, from the OCR.
        _, o_figures, _ = structure(key, o_blocks, first_page, last_page, lambda i: "ocr", [])
        if key == "celentano":
            o_figures = []  # its leaves have no titles to match; the web page has all 26
        have = [flat(f[2]) for f in figures if f[2]]
        known = " ".join(flat(f[2] + " ".join(f[3])) for f in figures)
        body = flat(web_text)
        for f in o_figures:
            # The OCR caption runs on into the main text when the chapter
            # title that ends it was dropped: stop at the first paragraph the
            # web page has as main text.
            for j, para in enumerate(f[3]):
                probe = flat(para)[:80]
                if len(probe) >= 40 and probe in body:
                    report.append(f"{key}: OCR figure '{f[2]}' caption cut before main text at paragraph {j}")
                    del f[3][j:]
                    break
            caption = flat(" ".join(f[3]))
            if caption[:30] and caption[20:80] in known:
                continue
            if f[2] and f[3] and not any(difflib.SequenceMatcher(None, flat(f[2]), h).ratio() > 0.8 for h in have):
                report.append(f"{key}: illustration on p. {f[0]} '{f[2]}' is not on the web page; taken from the OCR")
                figures.append(f)
        figures.sort(key=lambda f: f[0])
        source = "web+ocr" if truncated else "web"
        chapters_out.append([key, printed_title, subtitle, first_page, last_page, source])
        for n, (heading, first, last, paras, srcs, meta) in enumerate(sections):
            paras = [tidy(p) for p in paras]
            groups = split_parts(paras)
            at = 0
            for part, group in enumerate(groups, start=1 if len(groups) > 1 else 0):
                spans = meta[at : at + len(group)] or [[first, last, {"web"}]]
                at += len(group)
                used = set().union(*(m[2] for m in spans))
                src = "web+ocr" if len(used) > 1 else next(iter(used))
                rows.append([key, n, part, heading if part <= 1 else None, spans[0][0], spans[-1][1], src, etext_fix("\n\n".join(group))])
        for n, (fpage, image, ftitle, paras, src) in enumerate(figures, start=1):
            # The e-text's page markers ("p. A2") for the colour-plate leaves.
            paras = [tidy(p) for p in paras if not re.fullmatch(r"p\. A\d+", p.strip())]
            if not ftitle and paras and re.match(r"Leaf \d+\.", paras[0]):
                ftitle = re.match(r"(Leaf \d+)\.", paras[0]).group(1)
            credit = paras[0] if paras and re.match(r"(From|Reproduced|After|Courtesy|By courtesy|Drawn|Redrawn)\b", paras[0], re.I) else None
            body = paras[1:] if credit else paras
            if not ftitle and body and re.fullmatch(r"[A-Z][A-Z ,'Æ\-]+\.", body[0]):
                # A title printed as a capitals line of the caption (no picture).
                small = {"of", "or", "and", "the", "a", "an", "in", "on"}
                words = body[0].rstrip(".").lower().split()
                ftitle = " ".join(w if i and w.strip(",") in small else w[:1].upper() + w[1:] for i, w in enumerate(words))
                body = body[1:]
            for joined in RUN_ON_CREDITS:
                # The e-text runs a credit line into the caption with no break.
                if credit and credit.startswith(joined + " ") and len(credit) > 120:
                    body = [credit[len(joined) + 1 :]] + body
                    credit = joined
            figures_out.append([key, n, fpage, image or None, ftitle.rstrip("."), credit and etext_fix(credit), src, etext_fix("\n\n".join(body))])
            if any(p[:1].islower() for p in body):
                report.append(f"{key} figure {n} ({ftitle}): a caption paragraph starts in lower case")
        if truncated:
            report.append(f"{key}: web page truncated; completed from the OCR")

    # Checks: every chapter has text; headings are reported for review.
    for key, *_ in CHAPTERS:
        if not any(r[0] == key and r[7].strip() for r in rows):
            report.append(f"{key}: no text")
    for line in report:
        print(line, file=sys.stderr)
    print(f"{len(chapters_out)} chapters, {len(rows)} text rows, {len(figures_out)} figures, "
          f"{sum(len(r[7]) for r in rows) + sum(len(f[7]) for f in figures_out)} characters", file=sys.stderr)

    if os.environ.get("HALL_DUMP"):
        with open(os.environ["HALL_DUMP"], "w", encoding="utf-8") as f:
            json.dump({"chapters": chapters_out, "rows": rows, "figures": figures_out}, f, ensure_ascii=False)
    header = (
        "// GENERATED by scripts/texts/hall-secret-teachings.py from the pages of\n"
        "// Manly P. Hall, The Secret Teachings of All Ages (San Francisco, 1928),\n"
        "// as published by sacred-texts.com, with the chapters the site cuts short\n"
        "// completed from an archive.org OCR of the same e-text. Do not edit by\n"
        "// hand: re-run the script.\n"
    )
    # Split the rows into four files of about equal size, at chapter ends.
    total = sum(len(r[7]) for r in rows)
    files, current, size = [], [], 0
    for key, *_ in CHAPTERS:
        chunk = [r for r in rows if r[0] == key]
        current.extend(chunk)
        size += sum(len(r[7]) for r in chunk)
        if size >= total / 4 * (len(files) + 1) and len(files) < 3:
            files.append(current)
            current = []
    files.append(current)
    for i, chunk in enumerate(files, start=1):
        with open(os.path.join(out_dir, f"hall-secret-teachings-text-{i}.ts"), "w", encoding="utf-8") as f:
            f.write(header)
            f.write(
                "//\n"
                f"// HALL_TEXT_{i}: part {i} of 4 of the text, one row per passage: [chapter\n"
                "// key, section (0 = the text before the first heading), part (0 = the\n"
                "// section whole), Hall's heading (on the first part only), first page,\n"
                "// last page, where the text was taken from ('web' = sacred-texts.com;\n"
                "// 'ocr' = the archive.org OCR; 'web+ocr' = both), text].\n\n"
                f"export const HALL_TEXT_{i}: [string, number, number, string | null, number, number, \"web\" | \"ocr\" | \"web+ocr\", string][] = "
            )
            rows_out = [[r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]] for r in chunk]
            json.dump(rows_out, f, ensure_ascii=False, indent=0)
            f.write(";\n")
    with open(os.path.join(out_dir, "hall-secret-teachings-text.ts"), "w", encoding="utf-8") as f:
        f.write(header)
        f.write(
            "//\n"
            "// HALL_CHAPTERS: [key, the title as the chapter page prints it, its\n"
            "// subtitle (else null), first page, last page, where the text was taken\n"
            "// from]. HALL_FIGURES: the captions of Hall's illustrations, [chapter key,\n"
            "// number in the chapter, page, the e-text's image name (else null), title,\n"
            "// credit line (else null), source, caption]. HALL_TEXT: the text, from the\n"
            "// four files beside this one.\n\n"
        )
        for i in range(1, 5):
            f.write(f'import {{ HALL_TEXT_{i} }} from "./hall-secret-teachings-text-{i}";\n')
        f.write("\nexport const HALL_CHAPTERS: [string, string, string | null, number, number, \"web\" | \"web+ocr\"][] = ")
        json.dump(chapters_out, f, ensure_ascii=False, indent=0)
        f.write(";\n\nexport const HALL_FIGURES: [string, number, number, string | null, string, string | null, \"web\" | \"ocr\", string][] = ")
        json.dump(figures_out, f, ensure_ascii=False, indent=0)
        f.write(";\n\nexport const HALL_TEXT = [...HALL_TEXT_1, ...HALL_TEXT_2, ...HALL_TEXT_3, ...HALL_TEXT_4];\n")


if __name__ == "__main__":
    main(*sys.argv[1:5])
