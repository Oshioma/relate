"""Book of the Dead (Budge 1895, Papyrus of Ani) -> chapter-by-chapter English.

Input: a directory of pages of E. A. Wallis Budge, The Book of the Dead: The
Papyrus of Ani in the British Museum (1895), as published by sacred-texts.com
(https://sacred-texts.com/book/the-book-of-the-dead/<slug>), saved as HTML.
The site sits behind a browser check, so they are fetched with a headless
browser rather than here. The pages needed are "the-versions-of-the-book-of-
the-dead" (Budge's list of the chapters of the Theban version),
"the-papyrus-of-ani" (his List of Chapters of the papyrus) and the
translation, one page per plate or group of plates (PLATES below).

Output: src/lib/timeline/texts/corpus/book-of-the-dead-text.ts on stdout, and
a report on stderr so the split can be checked by eye.

THE THREE THINGS IT EXTRACTS.

  BD_THEBAN  Budge's list of the chapters of the Theban version (pp. xxxi-xlvi),
             in Lepsius's numbering, each with his title for it and the
             asterisk he puts on chapters he counts as Saite additions. Entries
             that only say a number has been renumbered ("This Chapter is now
             known as Chapter IX.") go to BD_RENUMBERED instead. Where he lists
             several numbers under one title ("Chapters LX., LXI., LXII.") each
             number gets the title.
  BD_ANI     His List of Chapters of the Papyrus of Ani (pp. cxlvi-clii): which
             chapters the papyrus carries, as he prints each entry.
  BD_TEXT    His running translation (pp. 245-369), cut by chapter.

HOW THE TRANSLATION IS CUT UP. Budge translates the papyrus plate by plate.
Each plate has "Vignette" paragraphs (his description of the pictures),
"Text" paragraphs (the translation, each chapter opening with its number in
brackets, "[CHAPTER CXXV.]") and "Appendix" paragraphs (his notes, and
versions from other papyri). Footnotes are printed in brackets at the foot of
each printed page. This script keeps the Text of each chapter, in Budge's
words, and drops the vignette descriptions, the appendices, the footnotes,
the footnote numbers and the page numbers. Exceptions:
  * a whole chapter that the Papyrus of Ani lacks and Budge supplies from
    another papyrus under its own number is kept, and marked with that
    other papyrus as its source (SUPPLIED);
  * the speeches of Thoth, the gods, Horus and Ani in the judgement scene
    (Plates III-IV), which Budge prints after Chapter XXXB but which belong
    to no numbered chapter, are kept under the key 'judgement';
  * the few places where the web edition's chapter number is a misprint of
    the number in Budge's own List of Chapters are corrected (FIXES).
Budge's line numbers of the papyrus ("(1)", "(2)" ...) are kept, so a reader
can find a line in any edition. Hieroglyphs the web edition cannot show
("###") are written "[hieroglyphs]". Nothing else in his wording is changed,
scanning errors included.

Usage:
  python3 -I scripts/texts/budge-book-of-the-dead.py <pages-dir> > src/lib/timeline/texts/corpus/book-of-the-dead-text.ts
"""

import html
import json
import os
import re
import sys

PREFIX = "book_the_book_of_the_dead_"

# Budge's plates, in the order of the book (pp. 245-369).
PLATES = [
    ("plate_i", "I"), ("plate_ii", "II"), ("plate_iii", "III"), ("plate_iv", "IV"),
    ("plates_v_and_vi", "V-VI"), ("plates_vii_x", "VII-X"), ("plates_xi_and_xii", "XI-XII"),
    ("plate_xiii", "XIII"), ("plate_xiv", "XIV"), ("plate_xv", "XV"), ("plate_xvi", "XVI"),
    ("plate_xvii", "XVII"), ("plate_xviii", "XVIII"), ("plate_xix", "XIX"), ("plate_xx", "XX"),
    ("plate_xxi", "XXI"), ("plate_xxii", "XXII"), ("plate_xxiii_and_plate_xxiv", "XXIII-XXIV"),
    ("plate_xxv", "XXV"), ("plate_xxvi", "XXVI"), ("plate_xxvii", "XXVII"), ("plate_xxviii", "XXVIII"),
    ("plates_xxix_and_xxx", "XXIX-XXX"), ("plates_xxxi_and_xxxii", "XXXI-XXXII"), ("plate_xxxii", "XXXII"),
    ("plate_xxxiii", "XXXIII"), ("plates_xxxiii_and_xxxiv", "XXXIII-XXXIV"),
    ("plates_xxxv_and_xxxvi", "XXXV-XXXVI"), ("plate_xxxvii", "XXXVII"),
]

ROMAN = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}


def roman(numeral):
    total = 0
    for i, ch in enumerate(numeral):
        value = ROMAN[ch]
        total += -value if i + 1 < len(numeral) and ROMAN[numeral[i + 1]] > value else value
    return total


def key_of(numeral, letter=""):
    return f"{roman(numeral)}{letter.lower()}"


# A chapter tag at the start of a line: "[Chapter XV.]", "[CHAPTER XLIV]:",
# "[CHAPTER XXIXA.]:", "[CHAPTER II. (1) ..." (the bracket never closed).
TAG = re.compile(r"^\[(?:CHAPTER|Chapter) ([IVXLC]+)([AB])?(?:\.|\b)\]?[:.]?\s*")
# Tags the general pattern cannot read, as printed, with the chapter meant.
ODD_TAGS = {
    "[CHAPTER LXXXVI L]:": "87",  # "Changing into Seta" is LXXXVII in Budge's list
    "[CHAPTER X. [XLVIII.]:": "48",  # Budge: "Chapter X. [See Chapter XLVIII.]"
    "[CHAPTER XVIII.--INTRODUCTION]": "18",
    "[CHAPTER CLXXXV. (?)]": "185",
    "[Rubric of Chapter LXXII.]": "72",
}
# Misprinted numbers, by the words that follow the tag, checked against the
# title Budge gives the chapter in his List of Chapters.
FIXES = {
    "(1) CHAPTER OF GIVING A HEART UNTO OSIRIS ANI": ("27", "26"),
    "(I) THE CHAPTER OF NOT ENTERING IN UNTO THE BLOCK": ("40", "50"),
}
# A run of a chapter's text that Budge breaks with a fresh heading for the
# same chapter on the next plate: carry on rather than start a new piece.
CONTINUES = {("plate_xiii", "18"), ("plate_xiv", "18")}
# Untagged lines that begin a passage of their own: (plate, opening words) -> key.
STARTS = {
    ("plate_ii", "(1) [HYMN TO OSIRIS.]"): "15",
    ("plate_iii", "Thoth, the righteous judge"): "judgement",
    ("plate_xxxii", "(1) The hair of Osiris Ani"): "42",
    # Budge prints this rubric at the head of Plate XXXIII with no number. His
    # account of the papyrus's contents (p. cxlvi) runs "... XLII., CXXV.,
    # Rubric, CLV. ...", so it is kept with Chapter CXXV.
    ("plate_xxxiii", "Rubric: (1) Osiris Ani, triumphant, is girt"): "125",
    # Budge supplies the text of Chapter LXXII from a Louvre papyrus, untagged.
    ("plates_v_and_vi", "(1) CHAPTER OF COMING FORTH BY DAY AND OF PASSING THROUGH THE AMMAHET"): "72",
}
# Where Budge says a supplied chapter comes from, by (plate, key).
SUPPLIED = {
    ("plates_v_and_vi", "1b"): "Budge's version from the two copies published by Pleyte and by Birch (papyrus of Nekht-Amen)",
    ("plates_v_and_vi", "72"): "a papyrus in the Louvre, as given by Naville, Todtenbuch I, Bl. 84",
    ("plate_xv", "25"): "the Papyrus of Nebseni (British Museum EA 9900)",
    ("plate_xv", "55"): "Naville, Todtenbuch I",
    ("plate_xv", "56"): "the Papyrus of Nebseni (British Museum EA 9900)",
    ("plate_xv", "63a"): "Naville, Todtenbuch I, Bll. 73-74",
    ("plate_xv", "63b"): "Naville, Todtenbuch I, Bll. 73-74",
    ("plate_xvi", "29a"): "Naville, Todtenbuch I",
    ("plate_xvi", "30a"): "Naville, Todtenbuch I",
    ("plate_xvi", "28"): "Naville, Todtenbuch I",
    # Not in Budge's List of Chapters of the papyrus; the text names no owner
    # ("[The deceased] saith"), and Budge does not say where it comes from.
    ("plate_xxvii", "79"): "a copy Budge does not name (the chapter is not in his List of Chapters of the Papyrus of Ani)",
    ("plate_xxxii", "42"): "Naville, Todtenbuch I, Bl. 56 (the complete version of the chapter)",
}
# Pieces under a SUPPLIED (plate, chapter) that are nevertheless Ani's own,
# by their opening words: the rubric of LXXII and Ani's short form of XLII.
ANI_OWN = {
    ("plates_v_and_vi", "72", "(I). If this writing be"),
    ("plate_xxxii", "42", "(1) The hair of Osiris Ani"),
}

HEADER = re.compile(r"^@@(.*?)@@\s*:?\s*(.*)$", re.S)
PAGE = re.compile(r"^\{p\. ?([0-9ivxlc]+)[}\]]$")
FOOTNOTE_START = re.compile(r"^\[(\d+|l|\*)[.,\s]")
NOTE_REF = re.compile(r"\[(\d{1,2}|l)\]")


def lines_of(page):
    start = page.find('data-slot="reader-prose"')
    end = page.find("</article>", start)
    body = page[start:end]
    body = re.sub(r'<div data-ad-vro.*?</div></div>', "", body, flags=re.S)
    body = re.sub(r"<b><p>(.*?)</p></b>", r"\n@@\1@@ ", body, flags=re.S)
    body = re.sub(r"<img[^>]*>", "\n[IMG]\n", body)
    body = re.sub(r"</?(p|h\d|br|div)[^>]*>", "\n", body)
    body = re.sub(r"<[^>]+>", "", body)
    body = html.unescape(body).replace("\xa0", " ")
    out = []
    for line in body.split("\n"):
        line = re.sub(r"\s+", " ", line).strip()
        if line and not line.startswith('data-slot="reader-prose"'):
            out.append(line)
    return out


def read(directory, slug):
    return open(os.path.join(directory, PREFIX + slug + ".html"), encoding="utf-8").read()


def drop_footnotes(lines):
    """Footnotes run from '[1.' to a line ending ']', or to the page number."""
    kept, inside, report = [], False, []
    for line in lines:
        if line == "[IMG]":
            continue
        if inside:
            if PAGE.match(line) or line.startswith("@@"):
                inside = False
                if line.startswith("@@"):
                    report.append(f"footnote ran into a heading: {line[:60]}")
            else:
                if line.endswith("]"):
                    inside = False
                continue
        if line == "]":
            continue
        if FOOTNOTE_START.match(line):
            inside = not line.endswith("]")
            continue
        kept.append(line)
    return kept, report


def clean(text):
    # The web edition lost the ligature in "phœnix" (U+FFFD in the page).
    text = text.replace("ph�nix", "phœnix")
    text = NOTE_REF.sub("", text)
    text = text.replace("###", "[hieroglyphs]")
    text = re.sub(r"\{footnote p\. \d+\}|\{continued next plate\}|\{p\. \d+\}", "", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" ([,;:.!?])", r"\1", text)
    return text.strip()


# ---------------------------------------------------------------------------
# Budge's list of the chapters of the Theban version
# ---------------------------------------------------------------------------

# "Chapter XVB. 1. A Hymn ...", "Chapters LX., LXI., LXII. The Chapters ...",
# "Chapters CXLI-CXLIII. The Book ...", "CLIIIB. The Chapter ..." (no word
# "Chapter"), "Chapter CLVII*. The Chapter ...".
THEBAN_ENTRY = re.compile(
    r"^(?:Chapters? )?((?:[IVXLC]+[AB]?(?:\.\*|\*\.|\.|\*)?(?:,? |-))*[IVXLC]+[AB]?)(\.?\*?\.?)\s+(?:(\d)\.\s+)?(.*)$"
)
# Budge prints "Chapter CL.*" for the chapter between C and CII ("protecting
# the boat of Ra"); the number meant is CI. CL itself follows CXLIX.
THEBAN_FIXES = {("CL", "The Chapter of protecting the boat of Ra."): "CI"}


def theban_list(page):
    lines = lines_of(page)
    start = next(i for i, l in enumerate(lines) if l == "Theban version: list of chapters.")
    end = next(i for i, l in enumerate(lines) if l.startswith("Chapter CLXXXVI."))
    page_no = [PAGE.match(l).group(1) for l in lines[:start] if PAGE.match(l)][-1]
    lines, _ = drop_footnotes(lines[start : end + 1])
    entries, renumbered, report = [], [], []
    current = None
    for line in lines:
        m = PAGE.match(line)
        if m:
            page_no = m.group(1)
            continue
        if line == "Theban version: list of chapters." or line.startswith("Vignette") or line.startswith("This Chapter has no"):
            current = None if not (current and not re.search(r"[.\])]$", current["title"])) else current
            continue
        m = THEBAN_ENTRY.match(line)
        if m and (line.startswith("Chapter") or re.match(r"^[IVXLC]+[AB]?\. ", line)):
            numbers, star, sub, title = m.group(1), m.group(2), m.group(3), m.group(4)
            saite = "*" in line[: m.start(4)]
            title = re.sub(r"\s*(Vignette: .*|This Chapter has no vignette\.)$", "", title).strip()
            title = NOTE_REF.sub("", title).strip()
            parts = [p for p in re.split(r"[.,*\s]+", numbers.replace("-", " - ")) if p]
            keys = []
            for i, part in enumerate(parts):
                if part == "-":
                    continue
                if i > 0 and parts[i - 1] == "-":
                    lo, hi = roman(re.sub("[AB]$", "", parts[i - 2])), roman(part)
                    keys += [str(n) for n in range(lo + 1, hi + 1)]
                    continue
                numeral = THEBAN_FIXES.get((part, title), part)
                if numeral != part:
                    report.append(f"Theban list: {part} read as {numeral} ({title})")
                mm = re.match(r"^([IVXLC]+)([AB])?$", numeral)
                keys.append(key_of(mm.group(1), mm.group(2) or ""))
            if sub:
                keys = [f"{k}-{sub}" for k in keys]
            renum = re.match(r"^\(This Chapter (?:is|in) now known as Chapter ([IVXLC]+)\.\)$", title)
            if renum:
                for k in keys:
                    renumbered.append([k, str(roman(renum.group(1)))])
                current = None
                continue
            current = {"keys": keys, "printed": line[: m.start(4)].strip(), "title": title, "saite": saite, "page": page_no}
            entries.append(current)
            continue
        if current and not re.search(r"[.\])]$", current["title"]):
            # A title that runs on to the next line (or over a page break).
            joiner = "" if current["title"].endswith("under") and line.startswith("world") else " "
            current["title"] = clean(current["title"] + joiner + line)
            continue
        report.append(f"Theban list: line not read: {line[:80]}")
    rows = []
    for e in entries:
        for k in e["keys"]:
            rows.append([k, e["printed"], clean(e["title"]), e["saite"], e["page"]])
    return rows, renumbered, report


# ---------------------------------------------------------------------------
# Budge's List of Chapters of the Papyrus of Ani
# ---------------------------------------------------------------------------


def ani_list(page):
    """[key, the entry as he prints it]."""
    entries = []
    for line in lines_of(page):
        m = re.match(r"^Chapter ((?:[IVXLC]+ ?)+?)([AB])?(?:\.|,|-|\s)\s*(.*)$", line)
        if not m or not re.search(r"pl\.|pll\.|Pll\.|See Chapter|vignette only|Rubric|title", line):
            continue
        numeral = m.group(1).replace(" ", "")
        entries.append([key_of(numeral, m.group(2) or ""), line.replace("ph�nix", "phœnix")])
    return entries


# ---------------------------------------------------------------------------
# The translation
# ---------------------------------------------------------------------------


def tag_of(text):
    """(key, rest) for a line opening with a chapter tag, else None."""
    lead = ""
    m = re.match(r"^(\(\w+\)\s*)(\[.*)$", text)
    if m and m.group(2).startswith(("[CHAPTER", "[Chapter")):
        lead, text = m.group(1), m.group(2)
    for odd, key in ODD_TAGS.items():
        if text.startswith(odd):
            return key, lead + text[len(odd):].strip()
    m = TAG.match(text)
    if not m:
        return None
    key, rest = key_of(m.group(1), m.group(2) or ""), lead + text[m.end():]
    for words, (wrong, right) in FIXES.items():
        if rest.startswith(words) and key == wrong:
            key = right
    return key, rest.strip()


def translation(directory, in_ani):
    report = []
    segments = []  # dicts: key, plates, first, last, supplied, lines
    current = None
    mode = "none"  # text | vignette | appendix | none
    pending = None  # a chapter named in a vignette heading, for the Text that follows

    def begin(key, plate, page, slug, opening):
        nonlocal current
        supplied = SUPPLIED.get((slug, key))
        if supplied and any(s == slug and k == key and opening.startswith(w) for s, k, w in ANI_OWN):
            supplied = None
        current = {"key": key, "plates": [plate], "first": page, "last": page, "supplied": supplied, "lines": []}
        segments.append(current)

    for slug, plate in PLATES:
        raw = lines_of(read(directory, slug))
        lines, notes = drop_footnotes(raw)
        report += [f"Plate {plate}: {n}" for n in notes]
        markers = [int(PAGE.match(l).group(1)) for l in lines if PAGE.match(l)]
        # A plate with no page marker of its own lies wholly on the page after
        # the last marker seen.
        page = markers[0] - 1 if markers else (current["last"] if current else None)
        after_page = False
        for line in lines:
            m = PAGE.match(line)
            if m:
                page = int(m.group(1))
                after_page = True
                continue
            # A sentence that runs over a page break (or a footnote, or the
            # edge of a plate) is one line, not two.
            run_on = re.match(r"^(\(\d+\)\s*)?[a-z]", line)
            after_page = False
            if re.match(r"^PLATES? [IVXL]", line) or line in ("THE BOOK OF THE DEAD.", "Translation"):
                continue
            kind, text = None, line
            h = HEADER.match(line)
            if h:
                label = h.group(1).strip().lower()
                kind = "vignette" if label.startswith("vignette") else "appendix" if label.startswith("appendix") else "text" if label.startswith("text") else None
                text = h.group(2).strip()
                if kind is None:
                    report.append(f"Plate {plate}: unknown heading {h.group(1)!r}")
            elif re.match(r"^Vignettes?\b", line) or re.match(r"^\W?[A-Z1]\. Vignette:", line):
                # "§A. Vignette: ..." heads each section of Chapter XVIII
                # (the "§" is lost in the web edition).
                kind, text = "vignette", ""
            elif re.match(r"^Appendix\b", line):
                kind, text = "appendix", ""
            elif re.match(r"^Text\b\s*[:\[]", line):
                kind, text = "text", re.sub(r"^Text\b\s*:?\s*", "", line)
            text = re.sub(r"^\[\d+\]\s*", "", text)  # a note number before a heading's text

            if kind == "vignette":
                mode = "vignette"
                tag = tag_of(re.sub(r"^\[\d+\]\s*", "", text))
                if tag:
                    pending = tag[0]
                continue
            if kind == "appendix":
                mode = "appendix"
                continue

            start = next((key for (p, words), key in STARTS.items() if p == slug and text.startswith(words)), None)
            tag = None if start else tag_of(text)
            if start or tag:
                key, rest = (start, text) if start else tag
                supplied = (slug, key) in SUPPLIED
                if not supplied and key not in in_ani and key != "judgement":
                    report.append(f"Plate {plate}: chapter {key} is neither in Budge's list nor marked as supplied")
                if not supplied and mode == "appendix" and kind != "text" and not start:
                    report.append(f"Plate {plate}: chapter {key} tagged inside an appendix but not marked as supplied")
                if current and current["key"] == key and (slug, key) in CONTINUES:
                    if plate not in current["plates"]:
                        current["plates"].append(plate)
                else:
                    begin(key, plate, page, slug, rest)
                mode, pending = "text", None
                if rest:
                    current["lines"].append(rest)
                continue
            if kind == "text":
                if pending:
                    begin(pending, plate, page, slug, text)
                    pending = None
                mode = "text"
                if text:
                    current["lines"].append(text)
                    current["last"] = page
                    if plate not in current["plates"]:
                        current["plates"].append(plate)
                continue
            if line.startswith("Rubric") and mode == "vignette" and current:
                mode = "text"
            if mode == "text" and current:
                previous = current["lines"][-1] if current["lines"] else ""
                if (run_on and previous and not re.search(r"[.!?]['\"]?$", previous)) or re.search(r"[a-z,;]$", previous):
                    report.append(f"joined: …{previous[-30:]!r} + {text[:30]!r}")
                    current["lines"][-1] += " " + text
                else:
                    current["lines"].append(text)
                current["last"] = page
                if plate not in current["plates"]:
                    current["plates"].append(plate)
            elif re.match(r"^\(\d+\)", line):
                report.append(f"Plate {plate}: numbered line dropped ({mode}): {line[:70]}")

    rows = []
    for seg in segments:
        english = "\n".join(c for c in (clean(l) for l in seg["lines"]) if c)
        plates = seg["plates"][0] if len(seg["plates"]) == 1 else f"{seg['plates'][0]}–{seg['plates'][-1]}"
        rows.append([seg["key"], plates, seg["first"], seg["last"], seg["supplied"], english])
        report.append(
            f"{seg['key']:>9} pl. {plates:<14} pp. {seg['first']}-{seg['last']} {'SUPPLIED ' if seg['supplied'] else ''}"
            f"{len(english):>6}  {english[:70]!r} … {english[-50:]!r}"
        )
    return rows, report


def main(directory):
    theban, renumbered, report = theban_list(read(directory, "the_versions_of_the_book_of_the_dead"))
    ani = ani_list(read(directory, "the_papyrus_of_ani"))
    rows, more = translation(directory, {key for key, _ in ani})
    report += more

    found = {row[0] for row in rows}
    for key, entry in ani:
        if key not in found:
            report.append(f"in Budge's Ani list but no text: {key}: {entry[:80]}")
    listed = {row[0] for row in theban}
    for key in sorted(found - listed - {"judgement"}):
        report.append(f"translated but not in the Theban list: {key}")
    report.append(f"Theban list: {len(theban)} numbers, {len(renumbered)} renumbered, "
                  f"{sum(1 for r in theban if r[3])} marked Saite")
    for line in report:
        print(line, file=sys.stderr)

    sys.stdout.write(
        "// GENERATED by scripts/texts/budge-book-of-the-dead.py from the pages of\n"
        "// E. A. Wallis Budge, The Book of the Dead: The Papyrus of Ani in the British\n"
        "// Museum (1895), as published by sacred-texts.com. Do not edit by hand:\n"
        "// re-run the script.\n"
        "//\n"
        "// Keys are Lepsius's chapter numbers, with Budge's letter for a variant\n"
        "// ('30b') and his sub-number where he lists several under one ('15b-1').\n"
        "//\n"
        "// BD_THEBAN: Budge's list of the chapters of the Theban version (pp. xxxi-xlvi):\n"
        "// [key, the number as he prints it, his title, marked Saite (*), page].\n"
        "// BD_RENUMBERED: numbers he lists only to say they are now known by another:\n"
        "// [key, the number it is now known as].\n"
        "// BD_ANI: his List of Chapters of the Papyrus of Ani (pp. cxlvi-clii):\n"
        "// [key, his entry as printed].\n"
        "// BD_TEXT: his translation, cut by chapter in the order of the plates:\n"
        "// [key, plates, first page, last page, the papyrus he supplied it from when\n"
        "// the Papyrus of Ani lacks it (else null), English with his line numbers].\n"
        "// The key 'judgement' holds the speeches of the judgement scene, which\n"
        "// belong to no numbered chapter.\n\n"
    )
    for name, data, kind in (
        ("BD_THEBAN", theban, "[string, string, string, boolean, string | null][]"),
        ("BD_RENUMBERED", renumbered, "[string, string][]"),
        ("BD_ANI", ani, "[string, string][]"),
        ("BD_TEXT", rows, "[string, string, number, number, string | null, string][]"),
    ):
        sys.stdout.write(f"export const {name}: {kind} = ")
        json.dump(data, sys.stdout, ensure_ascii=False)
        sys.stdout.write(";\n\n")


if __name__ == "__main__":
    main(sys.argv[1])
