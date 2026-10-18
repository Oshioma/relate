"""Pyramid Texts (Mercer 1952) -> utterance-by-utterance English.

Input: a directory of the chapter pages of "The Pyramid Texts" on
sacred-texts.com (https://sacred-texts.com/book/the-pyramid-texts/<n>-...),
saved as HTML. The site sits behind a browser check, so they are fetched
with a headless browser rather than here.
Output: src/lib/timeline/texts/corpus/pyramid-texts-text.ts on stdout, rows of
[first utterance, last utterance, chapter, chapter title, English] — Mercer
prints a few utterances together ("Utterances 273-274") — and a report of
gaps on stderr.

Each line of the translation keeps Sethe's paragraph reference ("1a.") at
its start, so a reader can find it in any edition. Mercer's page markers
("p. 21") are dropped.

Usage:
  python3 -I scripts/texts/mercer-pyramid.py <pages-dir> > src/lib/timeline/texts/corpus/pyramid-texts-text.ts
"""

import glob
import html
import json
import os
import re
import sys

# "Utterance 20." / "Utterance, 299." / "Utterances 26-28." / "Heading to Utterances 72-78." /
# "Utterances 97-99. Heading." — a heading, sometimes followed by text.
HEADING = re.compile(r"^(Heading to )?Utterances?,?\s+(\d+)(?:\s*[-–]\s*(\d+))?\s*\.?(\s*Heading\.)?\s*(.*)$", re.S)
# Inside a group, each utterance is marked by its bare number: "27."
MARKER = re.compile(r"^(\d+)\.(?:\s+(.*))?$", re.S)
# Mercer interleaves the offering lists: "End of 143." resumes utterance 143.
RESUME = re.compile(r"^End of (\d+)\.\s*(.*)$", re.S)

# The chapter title's range: "..., UTTERANCES 705-714".
TITLE_RANGE = re.compile(r"UTTERANCES (\d+)-(\d+)\s*\.?$")

MISPRINTS = {(22, 497): 457, (35, 979): 575}


def paragraphs(page):
    start = page.find('data-slot="reader-prose"')
    end = page.find("</article>", start)
    body = page[start:end]
    title = re.search(r"<h3>(.*?)</h3>", body, re.S)
    out = []
    for raw in re.findall(r"<p>(.*?)</p>", body, re.S):
        text = re.sub(r"<[^>]+>", "", raw)
        text = html.unescape(text).replace("\xa0", " ")
        text = re.sub(r"\bp\. \d+\s*", "", text)  # Mercer's page numbers
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            out.append(text)
    return (html.unescape(re.sub(r"<[^>]+>", "", title.group(1))).strip() if title else ""), out


def main(directory):
    rows, report = [], []
    files = glob.glob(os.path.join(directory, "book_the_pyramid_texts_[0-9]*.html"))
    chapters = sorted(files, key=lambda f: int(re.search(r"texts_(\d+)_", f).group(1)))
    for path in chapters:
        chapter = int(re.search(r"texts_(\d+)_", path).group(1))
        title, paras = paragraphs(open(path, encoding="utf-8").read())
        order, text, spans = [], {}, {}
        current, group, group_used = None, None, False

        carry = None  # (first, last, lines): a heading waiting for its first utterance

        def begin(n, last=None):
            nonlocal current, carry
            n = MISPRINTS.get((chapter, n), n)
            if n not in text:
                order.append(n)
                text[n] = []
            spans[n] = max(spans.get(n, n), last or n)
            current = n
            if carry and carry[0] <= n <= carry[1]:
                text[n].extend(carry[2])
                carry = None

        def close_group(next_first):
            # A heading with no numbered utterances under it is either the
            # heading of the groups that follow (carried to their first
            # utterance) or, when nothing follows inside its range, one passage
            # covering the whole run (Utterances 273-274).
            nonlocal carry
            if not group or group_used:
                return
            if next_first is not None and group[0] <= next_first <= group[1]:
                carry = (group[0], group[1], (carry[2] if carry else []) + group[2])
            elif current is not None and group[0] <= current <= group[1]:
                text[current].extend(group[2])
            else:
                begin(group[0], group[1])
                text[group[0]].extend(group[2])

        for para in paras:
            heading = HEADING.match(para)
            marker = MARKER.match(para) if not heading else None
            resume = RESUME.match(para)
            if heading:
                first = int(heading.group(2))
                close_group(first)
                last = int(heading.group(3)) if heading.group(3) else first
                rest = heading.group(5).strip()
                if last == first and not heading.group(1):
                    group = None
                    begin(first)
                    if rest:
                        text[current].append(rest)
                    continue
                group, group_used, current = (first, last, []), False, None
                inner = MARKER.match(rest) if rest else None
                if inner:
                    group_used = True
                    begin(int(inner.group(1)))
                    if inner.group(2):
                        text[current].append(inner.group(2))
                elif rest:
                    group[2].append(rest)
            elif resume:
                begin(int(resume.group(1)))
                if resume.group(2):
                    text[current].append(resume.group(2))
            elif marker and group and group[0] <= MISPRINTS.get((chapter, int(marker.group(1))), int(marker.group(1))) <= group[1]:
                n = int(marker.group(1))
                if not group_used and group[2]:
                    carry = (group[0], group[1], (carry[2] if carry else []) + group[2])
                begin(n)
                group_used = True
                if marker.group(2):
                    text[current].append(marker.group(2))
            elif current is not None:
                text[current].append(para)
            elif group is not None:
                group[2].append(para)
            elif TITLE_RANGE.search(title) and para.upper() != para:
                # The fragments (Utterances 705-714) open without a heading:
                # the text before the first number is the first utterance of
                # the chapter's range.
                span = TITLE_RANGE.search(title)
                group, group_used = (int(span.group(1)), int(span.group(2)), []), True
                begin(group[0])
                text[current].append(para)
            elif para.upper() != para:
                report.append(f"chapter {chapter}: text before the first utterance: {para[:60]}")
        close_group(None)
        for n in order:
            rows.append([n, spans[n], chapter, title, "\n".join(text[n])])
    seen = [n for r in rows for n in range(r[0], r[1] + 1)]
    for n in range(1, max(seen) + 1):
        if n not in seen:
            report.append(f"utterance {n} missing")
    for n in {x for x in seen if seen.count(x) > 1}:
        report.append(f"utterance {n} appears more than once")
    for line in report:
        print(line, file=sys.stderr)
    sys.stdout.write(
        "// GENERATED by scripts/texts/mercer-pyramid.py from the chapter pages of\n"
        "// S. A. B. Mercer, The Pyramid Texts in Translation and Commentary (1952), as\n"
        "// published by sacred-texts.com. Do not edit by hand: re-run the script.\n"
        "// Each row is one utterance in Sethe's numbering, or a run Mercer prints\n"
        "// together: [first, last, Mercer's chapter, its title, English with\n"
        "// Sethe's paragraph references].\n\n"
        "export const PYRAMID_UTTERANCES: [number, number, number, string, string][] = "
    )
    json.dump(rows, sys.stdout, ensure_ascii=False)
    sys.stdout.write(";\n")


if __name__ == "__main__":
    main(sys.argv[1])
