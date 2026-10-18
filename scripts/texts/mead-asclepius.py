"""Asclepius (Mead 1906, "The Perfect Sermon") -> section-by-section English.

Input: a directory of the pages of G. R. S. Mead, Thrice-Greatest
Hermes, vol. II (1906), "The Perfect Sermon, or the Asclepius", as published
by sacred-texts.com (https://sacred-texts.com/book/thrice-greatest-hermes-
vol-2/part-i ... part-xv, and thrice-greatest-hermes-vol-2-part-xv, which
alone carries XL.4), saved as HTML. The site sits behind a browser check, so
they are fetched with a headless browser rather than here.

Mead numbers the chapters I-XLI in Roman figures and, inside a chapter, the
paragraphs 1., 2., ... ("I have added numbers to the paragraphs for greater
convenience of reference"). Each numbered paragraph is a section here; a
chapter with only one is kept whole (section 0). His marks of Menard's fifteen
parts ("[III. M.]") are taken out of the text and kept beside it. Footnote
markers are dropped and the footnotes are never read: they are on the page
in a separate list. Page numbers are kept beside the text, so a reader can
find a passage in the book.

The web edition lost seven passages (see OCR_SEGMENTS); they are taken from
the archive.org OCR of the same book (thricegreatesthe02hermuoft, "Full
text", saved as plain text), with its page headers and footnotes removed.
Mead prints no paragraph 4 in chapter XXIX (1, 2, 3, 5); that is reported,
and kept as he prints it.

Thomas's Latin (1908) is not taken: the only copies found are Google scans
on archive.org whose OCR is too corrupt to reproduce without re-editing it.

Usage:
  python3 -I scripts/texts/mead-asclepius.py <pages-dir> <ocr.txt> > src/lib/timeline/texts/corpus/asclepius-text.ts
"""

import html
import json
import os
import re
import sys

PREFIX = "book_thrice_greatest_hermes_vol_2_"
PAGES = ["part_" + p for p in "i ii iii iv v vi vii viii ix x xi xii xiii xiv".split()] + [
    # The site's "part-xv" starts at XLI and lacks XL.4; this copy of the same
    # page begins at XL.4 ([XV. M.]) and is used instead.
    "thrice_greatest_hermes_vol_2_part_xv",
]

ROMAN = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}


def roman(numeral):
    total = 0
    for i, ch in enumerate(numeral):
        value = ROMAN[ch]
        total += -value if i + 1 < len(numeral) and ROMAN[numeral[i + 1]] > value else value
    return total


PAGE = re.compile(r"^p\. (\d+)$")
SECTION = re.compile(r"^(\d{1,2})\. (.*)$", re.S)
MENARD = re.compile(r"\s*\[([IVX]+)\. M\.\s*\]\s*")
SITE_HEADER = re.compile(r"^Thrice-Greatest Hermes, Vol\. 2\s*, by G\.R\.S\. Mead, \[1906\], at sacred-texts\.com$")


def blocks(page):
    """The page's prose as a list of ('h', roman) | ('p', page) | ('t', text)."""
    start = page.find('data-slot="reader-prose"')
    end = page.find('data-slot="reader-footnotes"', start)  # the list of footnotes
    end = page.rfind("<section", start, end) if end > 0 else page.find("</article>", start)
    body = page[start:end]
    body = body[body.find(">") + 1 :]
    body = re.sub(r'<div data-ad-vro.*?</div></div>', "", body, flags=re.S)
    body = re.sub(r'<a href="#fn[^"]*"[^>]*>.*?</a>', "", body)  # footnote markers
    body = re.sub(r"<small>.*?</small>", "", body, flags=re.S)  # Mead's note on his Latin text
    body = re.sub(r"<h[1-3]>.*?</h[1-3]>", "", body, flags=re.S)
    body = re.sub(r"<h4>(.*?)</h4>", lambda m: f"\n@@H{m.group(1).strip()}@@\n", body, flags=re.S)
    body = re.sub(r"<a(?: [^>]*)?>(p\. \d+)</a>", r"\n@@P\1@@\n", body)
    body = re.sub(r"<br\s*/?>", " ", body)
    body = re.sub(r"</?(p|div|section|details|ol|li|hr)[^>]*>", "\n", body)
    body = re.sub(r"<img[^>]*>", "", body)
    body = re.sub(r"<[^>]+>", "", body)
    body = html.unescape(body).replace("\xa0", " ").replace("\u200b", "")
    out = []
    for line in body.split("\n"):
        line = re.sub(r"\s+", " ", line).strip()
        if not line or SITE_HEADER.match(line) or line == "*":
            continue
        m = re.fullmatch(r"@@H(.*)@@", line)
        if m:
            if re.fullmatch(r"[IVXL]+", m.group(1)):
                out.append(("h", m.group(1)))
            continue  # "OR THE ASCLEPIUS", the second line of the title
        m = re.fullmatch(r"@@Pp\. (\d+)@@", line)
        if m:
            out.append(("p", int(m.group(1))))
            continue
        out.append(("t", line))
    return out


def tidy(text):
    text = re.sub(r"\s+\*\s+", " ", text)  # a stray asterisk in the web edition
    text = re.sub(r"\s+([,;:.?!])", r"\1", text)  # space left by a dropped footnote marker
    text = re.sub(r"\s+—", "—", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def english(directory, report):
    rows = []  # [chapter, section, first page, last page, menard, text]
    # Chapter and page carry over from one web page to the next: the last
    # page opens with XL.4, under the heading of XL on the page before.
    chapter = None
    page = None
    current = None
    for slug in PAGES:
        with open(os.path.join(directory, PREFIX + slug + ".html"), encoding="utf-8") as f:
            content = f.read()
        if "security service" in content or "Just a moment" in content:
            raise SystemExit(f"{slug}: saved a browser-check page, not the text; fetch it again")
        items = blocks(content)
        # Text before a web page's first page number is on the page before it.
        first_marker = next((value for kind, value in items if kind == "p"), None)
        if first_marker is not None:
            page = first_marker - 1
        for kind, value in items:
            if kind == "p":
                page = value
                continue
            if kind == "h":
                chapter = roman(value)
                current = None
                continue
            if chapter is None:
                report.append(f"{slug}: text before the first chapter heading: {value[:60]}")
                continue
            text = value
            continues = text.startswith("[paragraph continues]")
            text = text.replace("[paragraph continues]", "").strip()
            m = SECTION.match(text)
            if m and not continues:
                section = int(m.group(1))
                text = m.group(2)
                current = [chapter, section, page, page, None, "web", []]
                rows.append(current)
            elif current is None:
                report.append(f"{chapter}: text before its first numbered paragraph: {text[:60]}")
                continue
            menard = MENARD.search(text)
            if menard:
                current[4] = menard.group(1)
                text = MENARD.sub(" ", text, count=1).strip()
            current[3] = page
            if continues and current[6]:
                current[6][-1] = current[6][-1] + " " + text
            else:
                current[6].append(tidy(text))
    return rows


# THE PASSAGES THE WEB EDITION LOST. sacred-texts.com's current pages each
# begin at a chapter heading, so where one of Menard's parts begins inside a
# chapter, the text from Mead's "[II. M.]" to the next chapter heading is on
# no page (only XL.4 survives, on the extra copy of part XV). Those passages
# are taken from the archive.org OCR of the same book
# (thricegreatesthe02hermuoft): (Menard's part, Mead's chapter, the opening
# words of the line it starts on, as the OCR spaces them).
OCR_SEGMENTS = [
    ("II", 3, "2.  [II.  M.]  Heaven,  then,  God  Sensible"),
    ("IV", 7, "3.  [IV.  M.]  Asc.  What,  then,  Thrice-greatest"),
    ("VI", 10, "2.  [VI.  M.]      The  Lord  of  the  Eternity"),
    ("VII", 14, "2.  [VII.  M.]     And  now  let  us  begin"),
    ("IX", 23, "[IX.  M.]  And *  since  our  sermon"),
    ("X", 27, "4.  [X.  M.]  But  now  the  question"),
    ("XI", 30, "3.  [XL    M.]   All   things,    then,"),
]
OCR_PAGE_HEADER = re.compile(r"^(?:(\d+)\s+THRICE\s*-\s*GREATEST\s+HERMES|THE\s+PERFECT\s+SERMON\s+(\d+))\s*$")
OCR_FOOTNOTE = re.compile(r"^(?:[1-9]|l|f\)|G)\s+\S")
OCR_SECTION = re.compile(r"^(\d{1,2})\.\s+(.*)$")
OCR_MENARD = re.compile(r"\s*\[(?:[IVX]+|XL)\.?\s+M\.\]\s*")
# Footnote text the page layout lets through: a note carried over from the
# page before has no number to start it.
OCR_DROP = [
    "never again make itself visible to the perfect",  # end of a note on p. 367 (Hippolytus on the Cross)
]
# OCR misreadings in these passages, checked against the sense and against
# the same words elsewhere in Mead's text.
OCR_FIXES = [
    ("Tmmoveable", "Immoveable"),
    ("Kuler", "Ruler"),
    ("Keason", "Reason"),
    ("Eeason", "Reason"),
    ("seonian", "æonian"),
]


def ocr_lines(lines, opening, report):
    """The OCR lines from the opening line to the next chapter heading, with
    page headers and footnotes taken out: [(page, line)]."""
    want = re.sub(r"\s+", " ", opening)
    start = next((i for i, l in enumerate(lines) if re.sub(r"\s+", " ", l.strip()).startswith(want)), None)
    if start is None:
        report.append(f"OCR: opening not found: {opening}")
        return []
    page = None
    for j in range(start, -1, -1):
        m = OCR_PAGE_HEADER.match(lines[j].strip())
        if m:
            page = int(m.group(1) or m.group(2))
            break
    out, in_notes, previous_blank = [], False, False
    for raw in lines[start:]:
        line = raw.strip()
        if re.fullmatch(r"[IVXL]+", line) and out:
            break
        m = OCR_PAGE_HEADER.match(line)
        if m:
            page = int(m.group(1) or m.group(2))
            in_notes, previous_blank = False, True
            continue
        if not line:
            out.append((page, ""))
            previous_blank = True
            continue
        if re.fullmatch(r"\d{1,3}", line):
            previous_blank = True
            continue
        if previous_blank and OCR_FOOTNOTE.match(line) and not OCR_SECTION.match(line) and out:
            in_notes = True
        previous_blank = False
        if not in_notes:
            out.append((page, line))
    return out


def ocr_paragraphs(pairs, vocabulary):
    paragraphs, current = [], []
    for page, line in pairs + [(None, "")]:
        if line:
            current.append((page, line))
        elif current:
            paragraphs.append(current)
            current = []
    out = []
    for para in paragraphs:
        if any(re.sub(r"\s+", " ", para[0][1]).startswith(drop) for drop in OCR_DROP):
            continue
        text = ""
        for _, line in para:
            line = re.sub(r"\s+", " ", line)
            if text.endswith("-") and not text.endswith(" -") and line[:1].islower():
                head = re.search(r"(\w+)-$", text)
                tail = re.match(r"(\w+)", line)
                joined = (head.group(1) + tail.group(1)).lower() if head and tail else ""
                if joined in vocabulary:
                    text = text[:-1] + line
                else:
                    text = text + line
            else:
                text = (text + " " + line).strip()
        # A paragraph the foot of a page broke in two: the first half ends
        # without a full stop and the second begins in lower case.
        if out and text[:1].islower() and not re.search(r"[.!?]\W*$", out[-1][2]):
            out[-1] = (out[-1][0], para[-1][0], out[-1][2] + " " + text)
        else:
            out.append((para[0][0], para[-1][0], text))
    return out


def ocr_clean(text):
    text = re.sub(r"\[Tris\.~?\\?\]?(?=\s)", "[Tris.]", text)  # "[Tris.~\"
    text = re.sub(r"(?<=\w) - (?=\w)", "-", text)  # "life - powers"
    text = re.sub(r"\s?\*(?=[\s\]\.;,?!]|$)", "", text)  # "*" is how the OCR read a note mark
    text = re.sub(r"(?<=[A-Za-z\.,;:\)\]!?'\"])[1-9]\d?(?=[\s,;:\.\)\]]|$)", "", text)  # "Eternity3"
    text = re.sub(r"(?<=\S) (?:[1-9]\d?|l)(?=[\s,;:\.\)\]]|$)", "", text)  # "ruleth 6"
    text = re.sub(r"\b0 (?=[A-Z\[])", "O ", text)  # "0 Asclepius"
    for wrong, right in OCR_FIXES:
        text = text.replace(wrong, right)
    text = re.sub(r"\s*—\s*", "—", text)
    text = re.sub(r"\s+([,;:\.\?!])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    # Quotation marks: the OCR spaces straight ones on both sides; pair and curl them.
    parts = text.split('"')
    if len(parts) % 2 == 1:
        out = parts[0]
        for i, part in enumerate(parts[1:]):
            if i % 2 == 0:
                out = out.rstrip(" ") + (" " if out and not out.endswith(("(", "[", "—")) else "") + "\u201c" + part.lstrip(" ")
            else:
                out = out.rstrip(" ") + "\u201d" + part
        text = out
    return text.replace("'", "\u2019")


def ocr_supplement(path, rows, vocabulary, report):
    lines = open(path, encoding="utf-8").read().splitlines()
    for part, chapter, opening in OCR_SEGMENTS:
        paragraphs = ocr_paragraphs(ocr_lines(lines, opening, report), vocabulary)
        # The rows of this chapter the web edition does have.
        idx = max(i for i, r in enumerate(rows) if r[0] == chapter)
        current = rows[idx]
        for first, last, text in paragraphs:
            m = OCR_SECTION.match(text)
            if m:
                current = [chapter, int(m.group(1)), first, last, None, "ocr", []]
                idx += 1
                rows.insert(idx, current)
                text = m.group(2)
            elif current[5] == "web":
                current[5] = "web+ocr"
            menard = OCR_MENARD.search(text)
            if menard:
                current[4] = part
                text = OCR_MENARD.sub(" ", text, count=1).strip()
            current[3] = last
            current[6].append(ocr_clean(text))
    return rows


def finish(rows, report):
    out = []
    seen = set()
    for chapter, section, first, last, menard, source, paras in rows:
        key = (chapter, section)
        if key in seen:
            report.append(f"duplicate section {chapter}.{section}")
            continue
        seen.add(key)
        joined = []
        for para in (tidy(p) for p in paras):
            # A paragraph the foot of a printed page broke in two: the first
            # part ends without a full stop and the next begins in lower case.
            if joined and para[:1].islower() and not re.search(r"[.!?][\"”’)\]]*$", joined[-1]):
                joined[-1] = joined[-1] + " " + para
            else:
                joined.append(para)
        out.append([chapter, section, first, last, menard, source, "\n\n".join(joined)])
    # Number check: chapters 1-41, sections from 1 without gaps.
    chapters = sorted({r[0] for r in out})
    if chapters != list(range(1, 42)):
        report.append(f"chapters found: {chapters}")
    for chapter in chapters:
        sections = [r[1] for r in out if r[0] == chapter]
        if sections != list(range(1, len(sections) + 1)):
            report.append(f"chapter {chapter}: sections {sections}")
    # A chapter with a single paragraph is kept whole.
    counts = {}
    for r in out:
        counts[r[0]] = counts.get(r[0], 0) + 1
    for r in out:
        if counts[r[0]] == 1:
            r[1] = 0
    return out


def main(directory, ocr_path):
    report = []
    rows = english(directory, report)
    with open(ocr_path, encoding="utf-8") as f:
        vocabulary = {w.lower() for w in re.findall(r"[A-Za-z]+", f.read())}
    rows = ocr_supplement(ocr_path, rows, vocabulary, report)
    rows = finish(rows, report)
    for line in report:
        print(line, file=sys.stderr)
    print(f"{len(rows)} rows, {len({r[0] for r in rows})} chapters", file=sys.stderr)
    sys.stdout.write(
        "// GENERATED by scripts/texts/mead-asclepius.py from the pages of G. R. S.\n"
        "// Mead, Thrice-Greatest Hermes, vol. II (1906), \"The Perfect Sermon, or the\n"
        "// Asclepius\", as published by sacred-texts.com. Do not edit by hand: re-run\n"
        "// the script.\n"
        "//\n"
        "// ASCLEPIUS_SECTIONS: one row per numbered paragraph of Mead's, [chapter,\n"
        "// section (0 = a chapter he does not divide), first page, last page, the\n"
        "// part of Menard's division that begins in it (else null), where the text\n"
        "// was taken from ('web' = sacred-texts.com; 'ocr' = the archive.org OCR of\n"
        "// the book, for passages the web edition lost; 'web+ocr' = both), English].\n"
        "// His footnotes and commentary are left out. Headings, summaries and themes\n"
        "// are written in asclepius.ts.\n\n"
        "export const ASCLEPIUS_SECTIONS: [number, number, number, number, string | null, \"web\" | \"ocr\" | \"web+ocr\", string][] = "
    )
    json.dump(rows, sys.stdout, ensure_ascii=False)
    sys.stdout.write(";\n")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
