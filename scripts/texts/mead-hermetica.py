"""Corpus Hermeticum (Mead 1906) -> section-by-section English.

Input: the archive.org OCR text of Thrice-Greatest Hermes vol. II
(thricegreatesthe02hermuoft, "Full text" view, saved as plain text).
Output: src/lib/timeline/texts/corpus/hermetica-text.ts on stdout, rows of
[treatise, section, english] (section 0 = a treatise Mead prints whole);
a report of gaps on stderr.

The body of each treatise runs from its "(Text: ...)" line to the next
COMMENTARY heading. Page headers, page numbers and footnote blocks are
dropped; footnote markers are stripped from the running text; sections
split on the "N." that opens a paragraph.

Usage:
  python3 -I scripts/texts/mead-hermetica.py <ocr.txt> > src/lib/timeline/texts/corpus/hermetica-text.ts
"""

import json
import re
import sys

# Line of each treatise's "(Text: ...)" line, in order, with its number in
# Nock-Festugiere (Mead's first numeral; his parenthetical is Parthey's).
TREATISES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XVI", "XVII", "XVIII"]

COMMENTARY = re.compile(r"^COMMENT\s*A[RKE][YT]")
PAGE_HEADER = re.compile(r"^(\d+\s+[A-Z(][A-Z\-\s,'\.()&;:]+|[A-Z(][A-Z\-\s,'\.()&;:]+\s+\d+)\s*$")
FOOTNOTE_START = re.compile(r"^[1-9l]\d?\s+\S")
SECTION_START = re.compile(r"^\[?([1-9l](?: ?\d)?)\.\]?\s+(.*)$")  # OCR gives "1 3." for "13."
LONE_NUMBER = re.compile(r"^\d{1,3}\s*$")
FIXES = [
    # Footnote text the page layout let through into the running text.
    ("\n\nand rb jter avrov \"xodv, the writer is evidently dealing with the Cosmos as the one life, the avrtfoov, from which all other lives are derived; and if he did not write avrtfyov, he assuredly wrote £$ov. He wrote sense and not the nonsense of the present text.\n\n", " "),
    ("\n\ncompare §.\n\n", " "),
    ("\n\nstruck thy tent and left the tomb of thy daimonic soul\" (y\\>v 5' #T 5$; (T/cfjf oy nfi> e\\u(Too, (TTjjua 5' f\\€ityas tyvxy Sai/Aoyfrjj). Porphyry, Plotini Vita, xxii.; c/. Ex. vii.; Ex. iii..", ""),
    ("\n\nels d\\A^)\\ovs <f>i\\rpov.\n\n,— the Higher Love. Sc. the King.\n\n", " "),
    # OCR misreadings, checked against the page images' sense.
    ("\\Hermes.~]", "[Hermes.]"),
    ("Her* ", "Her. "),
    ("spirit from Miher", "spirit from Æther"),
    ("how shall / come", "how shall I come"),
    ("\" four/'", "\"four\""),
    ("\" man/'", "\"man\""),
    ("without an end >", "without an end;"),
    ("Good alone \\ ", "Good alone? "),
    ("my word (logos) \\ ", "my word (logos)! "),
    ("do vl see myself", "do I see myself"),
    ("well, 0 [my]", "well, O [my]"),
    ("[that of) fullness", "[that of] fullness"),
    ("Eighteousness", "Righteousness"), ("Eegard", "Regard"), ("Eoot", "Root"), ("Koot", "Root"),
    ("Kashness", "Rashness"), ("Keceive", "Receive"), ("G-od-gnosis", "God-gnosis"), ("rnaketh", "maketh"),
    ("monstraus", "monstrous"), ("gavesfc", "gavest"), ("theD", "the"), ("realities4", "realities"), ("sung,4", "sung,"),
    ("in.ZEon", "in Æon"), (";.ZEon", "; Æon"), ("through.Eon", "through Æon"), ("j5Con", "Æon"),
    ("thingof-life", "thing-of-life"), ("senseand-thought", "sense-and-thought"), ("thought-andsense", "thought-and-sense"),
    ("things-thatare-not", "things-that-are-not"), ("evermaking-new-again", "ever-making-new-again"), ("out-1", "out-"),
    ("Above.as", "Above. As"),
]
DROPPED = []  # footnote lines, for checking nothing of the text went with them


def bodies(lines):
    starts = [i for i, line in enumerate(lines) if line.startswith("(Text")]
    # The last "(Text" belongs to the Asclepius, not the Corpus.
    starts = starts[: len(TREATISES)]
    out = []
    for number, start in zip(TREATISES, starts):
        end = next(i for i in range(start + 1, len(lines)) if COMMENTARY.match(lines[i].strip()))
        out.append((number, lines[start + 1 : end]))
    return out


def clean_lines(lines):
    """Drop page headers, page numbers and footnotes; keep paragraphs."""
    kept = []
    in_notes = False
    previous_blank = True
    started = False
    for raw in lines:
        line = raw.strip()
        if line and not started:
            # The body opens with section 1, whose number OCR sometimes
            # leaves without its point ("1  Hermes."): never a footnote.
            started = True
            line = re.sub(r"^[1l]\s+", "1. ", line)
        if not line:
            kept.append("")
            previous_blank = True
            continue
        if (PAGE_HEADER.match(line) or len(line) > 6) and line.upper() == line:  # running heads
            in_notes = False
            previous_blank = True
            continue
        if LONE_NUMBER.match(line):  # a page number: the notes end with the page
            in_notes = False
            previous_blank = True
            continue
        if previous_blank and FOOTNOTE_START.match(line) and not SECTION_START.match(line):
            in_notes = True
        previous_blank = False
        if in_notes:
            DROPPED.append(line)
            continue
        kept.append(line)
    return kept


def join_paragraphs(lines, vocabulary):
    paragraphs, current = [], []
    for line in lines + [""]:
        if line and SECTION_START.match(line) and current:
            paragraphs.append(current)
            current = [line]
        elif line:
            current.append(line)
        elif current:
            paragraphs.append(current)
            current = []
    out = []
    for para in paragraphs:
        text = ""
        for line in para:
            line = re.sub(r"\s+", " ", line)
            if text.endswith("-") and line[:1].islower():
                head = re.search(r"(\w+)-$", text)
                tail = re.match(r"(\w+)", line)
                joined = (head.group(1) + tail.group(1)).lower() if head and tail else ""
                hyphenated = f"{head.group(1)}-{tail.group(1)}".lower() if head and tail else ""
                if joined in vocabulary or hyphenated not in vocabulary:
                    text = text[:-1] + line
                else:
                    text = text + line
            else:
                text = (text + " " + line).strip()
        out.append(text)
    return out


def strip_markers(text):
    text = re.sub(r"\^Eon|JEon|AEon|\bMon\b|\bMou\b", "Æon", text)  # OCR of the ligature
    text = re.sub(r"(?<![\d.,])\b0 (?=[A-Za-z])", "O ", text)  # "0 King"
    text = re.sub(r"(\w) - (\w)", r"\1-\2", text)  # "Self - control"
    text = re.sub(r"(\w) -(\w)", r"\1-\2", text)  # "Man -Shepherd"
    text = re.sub(r"\s?\*(?=[\s\]\.;,?!]|$)", "", text)  # "*" is how the OCR read many note marks
    text = re.sub(r"(\w)- (\w)", r"\1-\2", text)  # "Man- Shepherd"
    text = re.sub(r"(?<=[A-Za-z\.,;:\)\]!?'\"])[1-9]\d?(?=[\s,;:\.\)]|$)", "", text)  # "are,2"
    text = re.sub(r"(?<=\S) (?:[1-9]\d?|l)(?=[\s,;:\.\)]|$)", "", text)  # "(Logos) 2", "masterhood l"
    text = re.sub(r"\s+([,;:\.\?!])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def curl_quotes(text):
    """The OCR spaces quotation marks on both sides; pair them up and curl them."""
    parts = text.split('"')
    if len(parts) % 2 == 0:  # unbalanced: leave alone
        return text
    out = parts[0]
    for i, part in enumerate(parts[1:]):
        if i % 2 == 0:
            out = out.rstrip(" ") + (" " if out and not out.endswith(("(", "[", "\n")) else "") + "\u201c" + part.lstrip(" ")
        else:
            out = out.rstrip(" ") + "\u201d" + part
    return out


def sections(number, paragraphs, report):
    out, current_no, current = [], None, []
    for para in paragraphs:
        match = SECTION_START.match(para)
        if match:
            raw = match.group(1).replace("l", "1").replace(" ", "")
            n = int(raw)
            if current_no is not None:
                out.append([number, current_no, current])
            current_no, current = n, [match.group(2)]
        elif current_no is None:
            report.append(f"{number}: text before section 1 dropped: {para[:60]}")
        else:
            current.append(para)
    if current_no is not None:
        out.append([number, current_no, current])
    if not out:
        # Mead prints XVII without section numbers: keep it whole, as 0.
        report[:] = [line for line in report if not line.startswith(f"{number}:")]
        out.append([number, 0, [p for p in paragraphs if p.strip("* ")]])
    expected = 1
    for _, n, _ in out:
        if n and n != expected:
            report.append(f"{number}: expected section {expected}, found {n}")
        expected = n + 1
    rows = []
    for t, n, ps in out:
        text = "\n\n".join(curl_quotes(strip_markers(p)) for p in ps)
        for wrong, right in FIXES:
            loose = re.sub(r"(?:\\ |\\\n)+", r"\\s+", re.escape(wrong))  # any run of spaces or newlines
            text = re.sub(loose, lambda _: right, text)
        rows.append([t, n, re.sub(r"\n{3,}", "\n\n", text).strip()])
    return rows


def main(path):
    lines = open(path, encoding="utf-8").read().splitlines()
    vocabulary = set(w.lower() for w in re.findall(r"[A-Za-z][A-Za-z\-]+", " ".join(lines)))
    report, rows = [], []
    for number, body in bodies(lines):
        rows.extend(sections(number, join_paragraphs(clean_lines(body), vocabulary), report))
    if len(sys.argv) > 2:
        open(sys.argv[2], "w", encoding="utf-8").write("\n".join(DROPPED))
    for line in report:
        print(line, file=sys.stderr)
    sys.stdout.write(
        "// GENERATED by scripts/texts/mead-hermetica.py from the archive.org OCR of\n"
        "// G. R. S. Mead, Thrice-Greatest Hermes, vol. II (1906). Do not edit by hand:\n"
        "// fix the script (its FIXES list) and re-run it. Each row is one section as\n"
        "// Mead numbers it: [treatise in Nock-Festugiere numbering, section (0 = a\n"
        "// treatise Mead prints without sections), English]. Headings, summaries\n"
        "// and themes are written in hermetica.ts.\n\n"
        "export const HERMETICA_SECTIONS: [string, number, string][] = "
    )
    json.dump(rows, sys.stdout, ensure_ascii=False)
    sys.stdout.write(";\n")


if __name__ == "__main__":
    main(sys.argv[1])
