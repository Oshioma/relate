"""The Ascension of Isaiah, chapters VI-XI (the "Vision of Isaiah"), in the
English of R. H. Charles, The Ascension of Isaiah, translated from the
Ethiopic version (London: Adam and Charles Black, 1900), pp. 42-82, for the
texts archive (Stage 23) -> src/lib/timeline/texts/corpus/ascension-of-isaiah-text.ts.

Run:  python3 -I scripts/texts/ascension-of-isaiah.py DIR > \
          src/lib/timeline/texts/corpus/ascension-of-isaiah-text.ts
(the report goes to stderr; DUMP=path also writes the voted text, page by
page, before the hand fixes). DIR holds the three inputs, fetched with the
User-Agent "relate-archive-research (repo Oshioma/relate)":

  C_djvu.xml  https://archive.org/download/cu31924014590529/cu31924014590529_djvu.xml
              (Cornell University Library copy; printed page = leaf - 79)
  P_djvu.xml  https://archive.org/download/ascensionofisaia00unse/ascensionofisaia00unse_djvu.xml
              (Princeton Theological Seminary copy; printed page = leaf - 77)
  ecw.html    https://www.earlychristianwritings.com/text/ascension.html
              (Peter Kirby's site: an unsigned transcription of Charles's 1900
              English, without his signs, with modern double quotes; it has its
              own slips, e.g. "Macaiah", "descent" for "descend", "forth" for
              "fourth", "astonished" for "astonied")

WHY THREE WITNESSES OF THE ONE PRINTING. There is no proofread transcription
of Charles (1900) with his critical signs. The two archive.org scans are two
copies of the same printing, OCRed separately; the web transcription is a third,
independent typing. Wikisource was not reachable (HTTP 429) and was not used;
sacred-texts.com has no copy; Charles's revised version (SPCK, 1917) was not
found as a scan and was not used.

METHOD.
1. The text block of each page (pp. 42-82) is taken from each scan's djvu.xml:
   the running head (first line) is dropped, and the text ends at the first
   line set clearly smaller than the text (under 0.82 of its median word
   height) and followed by two more such lines, i.e. at the footnotes. On P
   pp. 58 and 62 a speck stands above the running head, so the head stays in
   P's text there; P is only a witness, so this does no harm.
2. The vote: C is the base. Where P and E agree with each other against C (by
   letters and digits only, and within one word in length) their reading is
   taken. 20 readings were taken (TAKEN_COUNT); 89 places where P or E differ
   are left as C has them and were settled on the page images in step 4.
3. The text is cut to the Vision: from the heading on p. 42 (above it stands
   the end of chapter V, the Martyrdom, not imported) to the colophon on p. 82.
4. Proofreading: every page, 42 to 82, was read line by line against the page
   images of the Cornell copy (https://archive.org/download/cu31924014590529/
   page/n{page+79}.jpg), and the Princeton copy where the Cornell image was
   unclear (p. 77: two marks around "Him and" in xi. 14 are specks, absent from
   the Princeton copy). The differences between the voted text and the page
   images are the FIXES list below, 291 entries: 204 of Charles's signs, which
   the OCR reads as quotation marks, T, f, + or (TM) or drops; 41 spacings; 40
   misread words or marks; 6 runs of footnote or margin-note lines.
5. Chapters and verses (split()): by Charles's inline numbers. 197 units:
   vi. 1-17, vii. 1-37, viii. 1-28, ix. 1-42 (12 and 13 printed together,
   '12, 13.', one unit), x. 1-31, xi. 1-43.
6. The check (compare()): the result against E, word by word, reported and
   not applied: 45 places differ, every one an E slip or an omission in E
   (e.g. E drops "for these are great things" in xi. 34) on the page images.

TYPOGRAPHY. Charles's raised double half-brackets (his sign for words in
the first Greek recension, G1, from which E, the Ethiopic, comes, but absent
from the second, G2, behind the Slavonic and the second Latin version) are
written ⸢ and ⸣ (U+2E22, U+2E23); a pair may open in one verse and close in a
later one, as printed. * * (Charles's emendations), † † (corrupt), [ ]
(interpolated or a doublet) and ( ) (words he supplied) are kept as printed;
the printer's spaces inside them, and inside quotation marks and before colons,
are closed up. Curly quotation marks as printed. "astonied" (xi. 8-10) is
Charles's word. The ellipsis at xi. 40 (". . .") marks words lost before "*Such
things*" (his note: a clause like the Slavonic's is lost).

NOT IMPORTED. Chapters i-v (the Martyrdom of Isaiah, with the Testament of
Hezekiah, iii. 13b-iv. 18); Charles's footnotes (the archive quotes or reports
those that explain a sign, in the passages' notes); his margin notes (e.g.
"vi.-xi. 40 = Vision of Isaiah", "xi. 41-43 = editorial additions"); his
critical notes and appendices; the Ethiopic, Greek, Latin (L1, L2) and Slavonic
texts printed in the same book. Laurence's English (Oxford, 1819), made from
the Bodleian Ethiopic MS alone, was compared on chapter xi and differs
throughout as a translation (xi. 8, Laurence: "while Mary was attentively
gazing on the ground, she suddenly perceived with astonishment a small infant";
Charles: "Mary straightway looked with her eyes and saw a small babe, and she
was astonied"); it is not imported.
"""

import difflib
import html
import json
import os
import re
import statistics
import sys
from collections import Counter


def log(*a):
    print(*a, file=sys.stderr)


def key(word):
    w = word.lower().replace("æ", "ae").replace("œ", "oe")
    for a, b in (("àáâäãā", "a"), ("èéêëē", "e"), ("ìíîïī", "i"), ("òóôöõō", "o"), ("ùúûüū", "u")):
        w = re.sub(f"[{a}]", b, w)
    return re.sub(r"[^a-z0-9]", "", w)


FIRST_PAGE, LAST_PAGE = 42, 82
# archive.org leaf = printed page + offset (checked on the running heads).
LEAF_OFFSET = {"C": 79, "P": 77}

# ---------------------------------------------------------------------------
# THE SCANS: C (Cornell) and P (Princeton), archive.org djvu.xml
# ---------------------------------------------------------------------------


def xml_pages(path):
    x = open(path, encoding="utf-8").read()
    out = []
    for o in re.findall(r"<OBJECT.*?</OBJECT>", x, re.S):
        lines = []
        for line in re.findall(r"<LINE>(.*?)</LINE>", o, re.S):
            ws = re.findall(r'<WORD coords="(\d+),(\d+),(\d+),(\d+)"[^>]*>(.*?)</WORD>', line, re.S)
            if not ws:
                continue
            heights = sorted(int(w[1]) - int(w[3]) for w in ws)
            lines.append((heights[len(heights) // 2], " ".join(html.unescape(w[4]) for w in ws)))
        out.append(lines)
    return out


def text_lines(lines):
    """The lines of the text, without the running head and the notes, which
    are set in a smaller type: the text ends at the first line that is
    clearly smaller than the text's and is followed by two more such lines."""
    if len(lines) < 3:
        return lines[1:]
    h = statistics.median(l[0] for l in lines[1:7])
    small = [l[0] < 0.82 * h for l in lines]
    end = len(lines)
    for i in range(1, len(lines) - 1):
        if small[i] and all(small[i + 1 : i + 3]):
            end = i
            break
    return lines[1:end]


def scan_pages(path, name):
    ps = xml_pages(path)
    out = {}
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        lines = ps[pg + LEAF_OFFSET[name]]
        head = lines[0][1]
        if not re.search(r"ASCENSION|CHAPTER", head):
            log(f"{name} p.{pg}: running head not found: {head!r}")
        out[pg] = [l[1] for l in text_lines(lines)]
    return out


def tokens(lines):
    text = "\n".join(lines)
    for x, y in (("“", '"'), ("”", '"'), ("—", " — "), ("­", "")):
        text = text.replace(x, y)
    text = re.sub(r"(\w)[-¬][ \t]*\n[ \t]*(?=\w)", r"\1", text)
    return text.split()


# ---------------------------------------------------------------------------
# E: THE EARLY CHRISTIAN WRITINGS TRANSCRIPTION
# ---------------------------------------------------------------------------


def ecw_tokens(path):
    t = open(path, encoding="latin-1").read()
    paras = [" ".join(html.unescape(re.sub(r"<[^>]+>", "", p)).split()) for p in re.findall(r"<p>(.*?)</p>", t, re.S)]
    words = []
    ch = None
    for p in paras:
        m = re.match(r"CHAPTER (\d+)$", p)
        if m:
            ch = int(m.group(1))
            continue
        if ch and 6 <= ch <= 11 and p:
            words.extend(p.split())
        if ch == 11 and p.startswith("43."):
            break
    return words


# ---------------------------------------------------------------------------
# THE VOTE
# ---------------------------------------------------------------------------


def anchors(bk, xk):
    sm = difflib.SequenceMatcher(None, bk, xk, autojunk=False)
    at = [None] * (len(bk) + 1)
    for op, i1, i2, j1, _j2 in sm.get_opcodes():
        if op == "equal":
            for d in range(i2 - i1 + 1):
                at[i1 + d] = j1 + d
    at[0] = 0
    at[len(bk)] = len(xk)
    return at, sm.ratio()


TAKEN = []
DIFFERED = []


def vote(base, owner, others):
    bk = [key(w) for w in base]
    ats = {}
    for name, words in others.items():
        ats[name], ratio = anchors(bk, [key(w) for w in words])
        log(f"agreement of C with {name}: {ratio:.3f}")
    bounds = [b for b in range(len(base) + 1) if all(ats[n][b] is not None for n in others)]
    out = []
    for b1, b2 in zip(bounds, bounds[1:]):
        seg = base[b1:b2]
        segk = "".join(key(w) for w in seg)
        readings = {n: others[n][ats[n][b1] : ats[n][b2]] for n in others}
        rk = {n: "".join(key(w) for w in readings[n]) for n in others}
        new = seg
        ctx = " ".join(base[max(0, b1 - 6) : b1])
        if rk["P"] == rk["E"] and rk["P"] != segk and seg and abs(len(readings["P"]) - len(seg)) <= 1:
            new = readings["P"]
            TAKEN.append((owner[b1], ctx, " ".join(seg), " ".join(new)))
            log(f"  TAKEN p.{owner[b1]} (P+E): ...{ctx} [{' '.join(seg)}] -> [{' '.join(new)}]")
        elif any(rk[n] != segk for n in others):
            DIFFERED.append(ctx)
            log(f"  differ p.{owner[b1]}, C kept: ...{ctx} C[{' '.join(seg)}] " + " ".join(f"{n}[{' '.join(readings[n])[:80]}]" for n in others))
        out.extend((owner[b1 + i] if b1 + i < len(owner) else owner[-1], w) for i, w in enumerate(new))
    return out


# ---------------------------------------------------------------------------
# THE TEXT'S LIMITS, AND THE HAND FIXES
# ---------------------------------------------------------------------------


def trim(pages):
    """p. 42 begins with the end of chapter V (the Martyrdom, not imported):
    the Vision starts at its heading. p. 82 ends with the colophon."""
    p = pages[42]
    # the OCR reads the first word of the heading, THE, as "Tur" (fixed below).
    start = next(i for i in range(1, len(p) - 1) if p[i][1] == "VISION" and p[i + 1][1] == "WHICH") - 1
    pages[42] = p[start:]


# FIXES: (page, the words before, what the vote gave, what the page image of
# the Cornell copy shows, kind). Every one was made by reading the page image;
# the kinds are: "sign" (Charles's critical signs, which the OCR reads as
# quotation marks, T, f, + or ™, or drops), "spacing" (the printer's spaces
# inside quotation marks, sign pairs and before colons, closed up as elsewhere
# in the archive, and words broken over lines), "footnote" (lines of the notes,
# and the margin notes, that the page split took for text) and "ocr" (a misread
# word or mark). The words before are as the vote gave them, so that each fix
# is found exactly once in its page; all are found in the voted text first and
# then applied together.
FIXES = [
# FIXES-BEGIN
    (42, '', 'Tur', 'THE', 'ocr'),
    (42, 'SON OF AMOS', 'SAY. vi-xir-4o Vi.', 'SAW. vi.', 'ocr'),
    (42, 'the reign of', 'bran', '', 'ocr'),
    (43, 'Jerusalem', '"from Galgala™', '⸢from Galgalâ⸣.', 'sign'),
    (43, 'of the king,', '"and', '⸢and', 'sign'),
    (43, 'would not sit', '(thereon)".', '(thereon)⸣.', 'sign'),
    (43, 'sit (thereon)". 3.', '"And', '⸢And', 'sign'),
    (43, 'truth with King', 'Hezekiah"', 'Hezekiah⸣,', 'sign'),
    (43, 'there were there', '"forty"', '⸢forty⸣', 'sign'),
    (43, 'was coming from', 'Galgalé', 'Galgalâ', 'ocr'),
    (43, 'to Hezekiah. 4.', '"And', '⸢And', 'sign'),
    (43, '"And they had', 'come"to', 'come⸣ to', 'sign'),
    (43, 'come"to salute him', '"and', '⸢and', 'sign'),
    (43, 'his hands upon', 'them,"', 'them,⸣', 'sign'),
    (44, 'hear their prophecy:', '"and', '⸢and', 'sign'),
    (44, 'were all before', 'Isaiah."', 'Isaiah.⸣', 'sign'),
    (44, 'Isaiah was speaking', '"to Hezekiah"', '⸢to Hezekiah⸣', 'sign'),
    (44, 'they all heard', 'ta', '†a', 'sign'),
    (44, 'one had opened', 'and f', 'and†', 'sign'),
    (44, 'Ananias and Joel', '"and Josab"', '⸢and Josab⸣', 'sign'),
    (44, 'his right hand', '(and‘on', '(and on', 'ocr'),
    (44, 'hand (and‘on the', 'left),', 'left).', 'ocr'),
    (44, 'glorified the God', 'Tof truth",', '⸢of truth⸣,', 'sign'),
    (44, 'the Most High', '"who', '⸢who', 'sign'),
    (44, 'the Holy One', 'and"', 'and⸣', 'sign'),
    (44, 'His holy ones.', 'g. "And', '9. ⸢And', 'sign'),
    (44, 'gave glory to', 'Him™+ who', 'Him⸣ †who', 'sign'),
    (44, 'in an alien', 'quae ventura erant.’ 0’s text is therefore secondary: ‘that he might prophesy, that they might hear his prophecy.’', '', 'footnote'),
    (45, '(it) on a', 'mant.', 'man†.', 'sign'),
    (45, 'he became silent', '"and', '⸢and', 'sign'),
    (45, 'taken up from', 'him™', 'him⸣', 'sign'),
    (45, 'lips were silent', '"and', '⸢and', 'sign'),
    (45, 'taken up from', 'him."', 'him.⸣', 'sign'),
    (45, 'was in him;', '"for', '⸢for', 'sign'),
    (45, 'was seeing a', 'vision,', 'vision.', 'ocr'),
    (45, 'from the seventh', 'heaven."', 'heaven.⸣', 'sign'),
    (45, '(not) think, but', 'jthe', '†the', 'sign'),
    (45, 'of the prophets', '(did)},', '(did)†,', 'sign'),
    (46, 'world which is', 'hidden.', 'hidden', 'ocr'),
    (46, 'Josab his son', '"and', '⸢and', 'sign'),
    (46, 'the scribe, and', '+ {jéaqém, and +', '†Îjôaqêm, and†', 'sign'),
    (46, 'righteousness, and the', '+ sweet smell}', '†sweet smell†', 'sign'),
    (47, 'and Josab his', 'son"', 'son⸣', 'sign'),
    (47, '(and) said: 2.', '* At', '*At', 'spacing'),
    (47, 'such glory and', 'tpositiont', '†position†', 'sign'),
    (47, 'tpositiont that I', 'cannot.describe "the glory" of', 'cannot describe ⸢the glory⸣ ⸢of', 'sign'),
    (47, 'glory" of that', 'angel’.', 'angel⸣.', 'sign'),
    (47, 'by my hand', '* he', '*he', 'spacing'),
    (47, 'raised me on', 'high *,', 'high*,', 'spacing'),
    (47, 'said unto him:', '‘ Who', '‘Who', 'spacing'),
    (47, '[through the (various)', 'degrees|', 'degrees]', 'sign'),
    (47, 'thou wilt see;', '"for', '⸢for', 'sign'),
    (47, 'have I been', 'sent."', 'sent.’⸣', 'sign'),
    (47, 'said unto me:', '‘ Hast', '‘Hast', 'spacing'),
    (48, 'and peaceably with', 'thee. 8,', 'thee.’ 8.', 'ocr'),
    (48, 'thee. 8, And', '+His', '†His', 'sign'),
    (48, 'also who is', 'greater', 'greater†', 'sign'),
    (48, 'envying one another.', 'zo,', '10.', 'ocr'),
    (48, 'is this envying?’', '12,', '12.', 'ocr'),
    (49, 'were angels. 15.', '"And', '⸢And', 'sign'),
    (49, 'the angels who', 'stood’', 'stood', 'ocr'),
    (49, 'stood’ on the', 'right",', 'right⸣,', 'sign'),
    (49, 'with one voice,', '"and', '⸢and', 'sign'),
    (49, 'throne in the', 'midst",', 'midst⸣,', 'sign'),
    (49, 'gave praise after', 'them ; Destroy him. Of. x. 12. S L? add ‘with the breath of His power.’', 'them;', 'footnote'),
    (50, 'this praise sent?’', '17,', '17.', 'ocr'),
    (50, 'heaven: to Him', '+ who', '†who', 'sign'),
    (50, 'in the holy', 'world f,', 'world†,', 'sign'),
    (50, 'on the left,', '"and', '⸢and', 'sign'),
    (51, 'than all (the', 'rest)" 20,', 'rest).⸣ 20.', 'sign'),
    (51, 'said unto me:', '‘ Worship', '‘Worship', 'spacing'),
    (51, 'to the six', 'heavens — for', 'heavens—for', 'spacing'),
    (51, 'sent to conduct', 'thee — until', 'thee—until', 'spacing'),
    (51, 'I tell thee', '"in', '⸢in', 'sign'),
    (51, '"in the seventh', 'heaven",', 'heaven⸣.', 'sign'),
    (52, 'unheard of. 25.', '"And', '⸢And', 'sign'),
    (52, 'who was with', 'me ;"', 'me;⸣', 'sign'),
    (52, 'appearance was undergoing', 'trans-_ formation', 'transformation', 'ocr'),
    (52, 'each heaven in', 'turn :', 'turn:', 'spacing'),
    (52, 'turn : ‘Nothing', '"of', '⸢of', 'sign'),
    (52, '‘Nothing "of the', 'vanity"', 'vanity⸣', 'sign'),
    (52, 'said unto me:', '‘ Nothing', '‘Nothing', 'spacing'),
    (52, 'what is done.’', '27." And', '27. ⸢And', 'sign'),
    (52, 'and from the', 'angels."', 'angels.’⸣', 'sign'),
    (53, 'throne was great,', '"and', '⸢and', 'sign'),
    (53, 'which was below', 'them™.', 'them⸣.', 'sign'),
    (53, 'on the left,', '"and', '⸢and', 'sign'),
    (53, 'was in the', 'midst",', 'midst⸣,', 'sign'),
    (53, 'again I saw', '"those', '⸢those', 'sign'),
    (53, 'of the fourth', 'heaven".', 'heaven⸣.', 'sign'),
    (53, 'that of those', '"on', '⸢on', 'sign'),
    (54, 'on the right', 'hand".', 'hand⸣.', 'sign'),
    (54, 'fourth heaven. 37.', '"And', '⸢And', 'sign'),
    (54, 'named and the', 'Only-begotten"', 'Only-begotten⸣', 'sign'),
    (54, 'the several heavens,', '"and', '⸢and', 'sign'),
    (54, 'sitteth on the', 'throne™.', 'throne⸣.', 'sign'),
    (54, 'who conducted me:', '‘ What', '‘What', 'spacing'),
    (54, 'And he said:', '‘Iam', '‘I am', 'spacing'),
    (55, 'thy fellow servant.’', '"6,', '⸢6.', 'sign'),
    (55, 'servants (on the', 'left)?"', 'left)?’⸣', 'sign'),
    (55, 'is not named', '"and', '⸢and', 'sign'),
    (55, 'can learn His', 'name.', 'name⸣.', 'sign'),
    (55, 'answer. I have', '"therefore', '⸢therefore', 'sign'),
    (55, '"therefore been empowered', 'and"', 'and⸣', 'sign'),
    (56, '', "'", '', 'ocr'),
    (56, 'these thrones, 10.', '"Undergoing', '⸢Undergoing', 'sign'),
    (56, '10. "Undergoing (successive)', '/', '', 'ocr'),
    (56, 'your form and', 'likeness? "11.', 'likeness.⸣ 11.', 'sign'),
    (56, 'that world has', 'ascended or"seen', '⸢ascended or⸣ seen', 'sign'),
    (56, 'And he said:', '"Hear,', '⸢Hear,', 'sign'),
    (56, 'from thy fellow', 'servant";', 'servant⸣;', 'sign'),
    (56, 'receive the garment', '"which', '⸢which', 'sign'),
    (57, '(there) thou wilt', 'see",', 'see⸣,', 'sign'),
    (57, 'And there they', '+ all', '†all', 'sign'),
    (57, 'named the primal', 'Father +', 'Father†', 'sign'),
    (57, 'and His Beloved,', '"the Christ"', '⸢the Christ⸣', 'sign'),
    (58, 'say indeed unto', 'you," Hezekiah', 'you, ⸢Hezekiah', 'sign'),
    (58, 'Hezekiah and Josab', 'my.', 'my', 'ocr'),
    (58, 'my. son and', 'Micaiah"', 'Micaiah⸣', 'sign'),
    (58, 'to be called', '"Son"', '“Son”', 'ocr'),
    (58, 'for the righteous,', '"for', '⸢for', 'sign'),
    (59, 'is great and', 'wonderful', 'wonderful⸣.', 'sign'),
    (59, 'fulfilled for coming', 'here."', 'here.’', 'ocr'),
    (59, 'dwelleth *in the', 'flesh *?’', 'flesh*?’', 'spacing'),
    (59, 'trembled. 2. And', '"when', '⸢when', 'sign'),
    (59, '"when I trembled,', 'behold" * I heard *', 'behold⸣ *I heard*', 'sign'),
    (59, 'hence another voice', '"being', '⸢being', 'sign'),
    (59, '"being sent forth,', 'and"', 'and⸣', 'sign'),
    (59, 'was with me', '"and said":', '⸢and said⸣:', 'sign'),
    (59, 'is he who', '* permitted *', '*permitted*', 'spacing'),
    (59, 'this is he', '* who', '*who', 'spacing'),
    (59, 'And He who', '* permitted *', '*permitted*', 'spacing'),
    (60, 'this is', '"thy', '⸢thy', 'sign'),
    (60, 'will be called', '" Jesus"', '“Jesus”', 'ocr'),
    (60, 'Jesus" in the', 'world",', 'world⸣,', 'sign'),
    (60, 'all the righteous', '"from', '⸢from', 'sign'),
    (60, 'who were with', 'him,', 'him⸣,', 'sign'),
    (60, 'I saw them', '-in', 'in', 'ocr'),
    (60, 'and they were', '"like angels",', '⸢like angels⸣,', 'sign'),
    (61, 'was with me:', '‘ How', '‘How', 'spacing'),
    (61, 'and the crowns?’', '12,13.', '12, 13.', 'spacing'),
    (61, 'see Him descend', '"[will', '⸢[will', 'sign'),
    (61, 'last days the', 'civ. 4; Matt. xxii. 30; Apoc. Bar. li. 5, 9, 12. L’S omit this phrase.', '', 'footnote'),
    (62, 'will be called', 'Christ".', 'Christ⸣.', 'sign'),
    (62, 'Christ". Nevertheless they', '"see and™', '⸢see and⸣', 'sign'),
    (62, 'in your form,', '"and', '⸢and', 'sign'),
    (62, 'and is a', 'man™', 'man⸣.', 'sign'),
    (62, 'will stretch forth', '* his', '*his', 'spacing'),
    (62, 'tree, and will', '* slay *', '*slay*', 'spacing'),
    (62, 'not knowing who', 'Heis.', 'He is.', 'spacing'),
    (62, 'thus His descent,', '"as', '⸢as', 'sign'),
    (62, 'known who He', 'is%.', 'is⸣.', 'sign'),
    (63, 'garments till the', '"Lord Christ"', '⸢Lord Christ⸣', 'sign'),
    (64, 'they will receive', 'their[ garments and ]thrones', 'their [garments and] thrones', 'spacing'),
    (64, 'ascended into the', '"seventh"', '⸢seventh⸣', 'sign'),
    (64, '20. ‘*Show me', 'how *', 'how*', 'spacing'),
    (65, 'done in this', 'world"', 'world.’', 'ocr'),
    (65, 'of That One,', '"who', '⸢who', 'sign'),
    (65, '"who shall be', 'named"', 'named⸣', 'sign'),
    (65, 'I told thee,', '"and', '⸢and', 'sign'),
    (65, 'are *these* laid', 'up™’', 'up⸣.’', 'sign'),
    (65, 'a certain One', '"standing,', '⸢standing,', 'sign'),
    (65, 'surpassed that of', 'all,"', 'all,⸣', 'sign'),
    (65, 'glory was great', '"and', '⸢and', 'sign'),
    (65, 'I had seen', 'Him’,', 'Him⸣,', 'sign'),
    (65, 'I had seen', '"and', '⸢and', 'sign'),
    (65, 'whom I had', 'seen™', 'seen⸣', 'sign'),
    (66, 'Him.', '"And', '⸢And', 'sign'),
    (66, 'righteous first drew', 'near"', 'near⸣', 'sign'),
    (66, 'with one voice,', '"and', '⸢and', 'sign'),
    (66, 'gave praise with', 'them",', 'them⸣,', 'sign'),
    (66, 'said to me:', '‘ Worship', '‘Worship', 'spacing'),
    (66, '‘ Worship this', 'One,', 'One,’', 'ocr'),
    (67, 'with them. But', '* my *', '*my*', 'spacing'),
    (67, 'said unto me:', '‘ Worship', '‘Worship', 'spacing'),
    (68, '', '* speaketh *', '*speaketh*', 'spacing'),
    (68, 'of that One.', '39:', '39.', 'ocr'),
    (68, 'of the Spirit', 'Tand', '⸢and', 'sign'),
    (68, 'who is with', 'thee.', 'thee.’', 'ocr'),
    (68, 'angel of the', 'Spirit"', 'Spirit⸣', 'sign'),
    (68, 'both together praised', '"God".', '⸢God⸣.', 'sign'),
    (68, 'all the righteous', '"drew', '⸢drew', 'sign'),
    (68, 'righteous "drew near', 'and"', 'and⸣', 'sign'),
    (68, 'And the angels', '"drew', '⸢drew', 'sign'),
    (68, 'angels "drew near', 'and"', 'and⸣', 'sign'),
    (69, 'six heavens, ascending', '* and', '*and', 'spacing'),
    (69, '* and being', 'heard *', 'heard*', 'spacing'),
    (69, '2. And all', '"were', '⸢were', 'sign'),
    (69, 'to that Glorious', 'One"', 'One⸣', 'sign'),
    (69, 'not behold. 3.', '"And', '⸢And', 'sign'),
    (69, 'all and hearing', 'all™', 'all⸣.', 'sign'),
    (69, 'seen. 6. And', '"T heard"', '⸢I heard⸣', 'sign'),
    (69, 'heard" the angel', '"who', '⸢who', 'sign'),
    (69, '"who conducted me', 'and"', 'and⸣', 'sign'),
    (69, 'of the righteous', '"the', '⸢the', 'sign'),
    (69, 'Father of the', 'Lord™’ 7,', 'Lord⸣.’ 7.', 'sign'),
    (69, 'the Most High', '"the', '⸢the', 'sign'),
    (69, 'Father of my', 'Lord"', 'Lord⸣', 'sign'),
    (69, 'to my Lord', '"Christ', '⸢Christ', 'sign'),
    (69, 'who will be', 'X. 1. Ascending * and being heard* there. Emended with L?, E = ‘which I had heard ascending hither’ (6) or ‘when ascending hither ’ (ac).', '', 'footnote'),
    (70, 'called', 'Jesus":', 'Jesus⸣:', 'sign'),
    (70, 'wilt descend to', '"the', '⸢the', 'sign'),
    (70, 'to "the firmament', 'and"', 'and⸣', 'sign'),
    (70, 'thou wilt descend,', '"but', '⸢but', 'sign'),
    (70, 'thou wilt not', 'go"', 'go⸣.', 'sign'),
    (70, 'And thou wilt', 'become.like', 'become like', 'ocr'),
    (70, 'wilt become.like unto', 'thelikeness_of', 'the likeness of', 'spacing'),
    (70, 'thelikeness_of all who', '_', '', 'spacing'),
    (70, 'five heavens. 10.', '"And', '⸢And', 'sign'),
    (70, 'thou wilt be', 'careiil', 'careful', 'ocr'),
    (70, 'who are in', 'Sheol]. iz.', 'Sheol]⸣. 11.', 'sign'),
    (70, 'world shall know', '"that', '⸢that', 'sign'),
    (70, 'art with Me,', '* till *', '*till*', 'spacing'),
    (70, '* with a', '* loud *', '*loud*', 'spacing'),
    (71, 'order that you', 'mayst "judge "and destroy"', 'mayst⸣ judge ⸢and destroy⸣', 'sign'),
    (71, '"and destroy" the', '+ princes +', '†princes†', 'sign'),
    (71, '+ and angels', '"and gods"', '⸢and gods⸣', 'sign'),
    (71, 'Me and said:', '"We', '“We', 'ocr'),
    (71, 'is none beside', 'us."', 'us.”', 'ocr'),
    (72, '', 'tof', '†of', 'sign'),
    (72, 'tof that', 'world +', 'world†', 'sign'),
    (72, '+ will worship', 'Thee.', 'Thee.’', 'ocr'),
    (72, 'worship Thee. 16.', 'These/', 'These', 'ocr'),
    (72, 'Lord. 17. And', '+sot+', '†so†', 'sign'),
    (72, 'the sixth heaven.', '18,', '18.', 'ocr'),
    (72, 'said unto me:', '‘Under stand,', '‘Understand,', 'spacing'),
    (72, 'of the Lord', '* will appear *.', '*will appear*.', 'spacing'),
    (72, 'angels saw Him,', '"thereupon', '⸢thereupon', 'sign'),
    (72, 'in the sixth', 'heaven"', 'heaven⸣', 'sign'),
    (72, 'praised and lauded', 'Him ;', 'Him;', 'spacing'),
    (72, 'the angels there,', '"and', '⸢and', 'sign'),
    (72, '"and they praised', 'Him™', 'Him⸣', 'sign'),
    (72, 'I saw when', 'He:', 'He', 'ocr'),
    (73, 'there. 22. And', '"when', '⸢when', 'sign'),
    (73, '"when they saw', 'Him",', 'Him⸣,', 'sign'),
    (73, 'did not praise', '"or', '⸢or', 'sign'),
    (73, 'praise "or laud', 'Him";', 'Him⸣;', 'sign'),
    (73, 'the third heaven,', '"and', '⸢and', 'sign'),
    (73, '25. And again I saw when He', 'descended"', 'descended⸣', 'sign'),
    (73, 'the second heaven,', '"and', '⸢and', 'sign'),
    (73, '27. And again I saw when He', 'descended"', 'descended⸣', 'sign'),
    (73, 'the first heaven,', 'Tand', '⸢and', 'sign'),
    (73, 'gate, and He', 'made.', 'made', 'ocr'),
    (74, 'left of that', 'throne",', 'throne⸣,', 'sign'),
    (74, 'unto their form.', '"28,', '⸢28.', 'sign'),
    (74, 'angel who conducted', 'me".', 'me⸣.', 'sign'),
    (74, 'into the firmament', '"where', '⸢where', 'sign'),
    (74, 'ruler of this', 'world",', 'world⸣,', 'sign'),
    (74, 'gave the password', '"to', '⸢to', 'sign'),
    (74, 'those on the', 'left,"', 'left,⸣', 'sign'),
    (74, 'not praise Him', 'there ; "but', 'there; ⸢but', 'sign'),
    (74, 'one another and', 'fighting ;', 'fighting;', 'spacing'),
    (74, 'and envying about', 'trifles"', 'trifles⸣.', 'sign'),
    (74, 'when He descended', '"and', '⸢and', 'sign'),
    (74, '"and made Himself', 'like"', 'like⸣', 'sign'),
    (74, 'He gave no', 'password ; "for', 'password; ⸢for', 'sign'),
    (74, '"for one was', 'plun- - dering', 'plundering', 'ocr'),
    (74, 'doing violence to', 'another."', 'another.⸣', 'sign'),
    (74, '1. After this', '"I', '⸢I', 'sign'),
    (74, 'this "I saw,', 'and"', 'and⸣', 'sign'),
    (74, 'and" the angel', '"who', '⸢who', 'sign'),
    (74, 'me, who conducted', 'me",', 'me⸣,', 'sign'),
    (74, 'from God.’ 2.', '"And', '⸢And', 'sign'),
    (76, 'though with child.', '6,', '6.', 'ocr'),
    (76, 'she was astonied.', 'g.', '9.', 'ocr'),
    (76, 'she was married', 'glorified the God of Israel, who had given him this grace and kept her’ («at épvaacoey airqy). And did not reveal this matter to any one. In Protev. xv-xvi Joseph refuses to answer the questions of the priest regarding Mary’s condition: Kat ‘Iwahp éotynoev (xv. 4).-', '', 'footnote'),
    (77, 'all blinded respecting', '‘Him ‘and', 'Him and', 'ocr'),
    (78, 'of Israel against', 'Him",', 'Him⸣,', 'sign'),
    (78, 'who He was,', 'Tand', '⸢and', 'sign'),
    (78, 'conducted me said:', '‘ Understand, Isaiah :’', '‘Understand, Isaiah:’', 'spacing'),
    (78, 'Twelve Apostles and', 'ascended', 'ascended⸣.', 'sign'),
    (79, 'of the firmament', '"and', '⸢and', 'sign'),
    (79, 'firmament "and the', 'Satans™', 'Satans⸣', 'sign'),
    (79, 'worshipped. 24. And', '"there', '⸢there', 'sign'),
    (79, 'much sorrow there,', 'while"', 'while⸣', 'sign'),
    (79, 'descend *in our', 'midst *,', 'midst*,', 'spacing'),
    (80, 'the third heaven,', '"and', '⸢and', 'sign'),
    (80, 'said in like', 'manner."', 'manner.⸣', 'sign'),
    (80, 'in the fifth', '"also', '⸢also', 'sign'),
    (80, 'saw when He', 'ascended"', 'ascended⸣', 'sign'),
    (80, 'the sixth heaven,', '"and', '⸢and', 'sign'),
    (80, 'worshipped and glorified', 'Him"', 'Him⸣.', 'sign'),
    (80, 'son of Amoz,', '* it', '*it', 'spacing'),
    (80, 'is enough for', 'thee *; "for', 'thee*; ⸢for', 'sign'),
    (80, 'these are great', 'things";', 'things⸣;', 'sign'),
    (81, '', '35-', '35.', 'ocr'),
    (81, 'thou wilt come', 'hither.', 'hither.’', 'ocr'),
    (81, 'Hezekiah the King', '"and said":', '⸢and said⸣:', 'sign'),
    (81, 'man to transcribe.', '40....*Such things *', '40. . . . *Such things*', 'spacing'),
    (81, 'up in the', '"seventh"', '⸢seventh⸣', 'sign'),
    (81, 'of these visions', 'Se =', '', 'footnote'),
# FIXES-END
]


def apply_fixes(pages):
    todo = {}
    for n, (pg, ctx, old, new, _kind) in enumerate(FIXES):
        words = [w for _, w in pages[pg]]
        c, o = ctx.split(), old.split()
        hits = [i for i in range(len(words) - len(c) - len(o) + 1) if words[i : i + len(c) + len(o)] == c + o]
        if not c and len(hits) > 1:
            hits = [h for h in hits if h == 0]
        assert len(hits) == 1, ("FIXES entry not found exactly once", n, pg, ctx, old, len(hits))
        todo.setdefault(pg, []).append((hits[0] + len(c), len(o), new.split()))
    for pg, edits in todo.items():
        edits.sort(reverse=True)
        p = pages[pg]
        last = len(p) + 1
        for at, ln, new in edits:
            assert at + ln <= last, ("FIXES entries overlap", pg, at)
            last = at
            p[at : at + ln] = [(pg, w) for w in new]
    kinds = Counter(f[4] for f in FIXES)
    log(f"{len(FIXES)} hand fixes: " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))


# ---------------------------------------------------------------------------
# CHAPTERS AND VERSES
# ---------------------------------------------------------------------------

CHAPTERS = {"vi.": 6, "vii.": 7, "viii.": 8, "ix.": 9, "x.": 10, "xi.": 11}
VERSES = {6: 17, 7: 37, 8: 28, 9: 42, 10: 31, 11: 43}
HEADING = "THE VISION WHICH ISAIAH THE SON OF AMOS SAW."
COLOPHON = "Here endeth the vision of Isaiah the prophet with his ascension."


def split(stream):
    """Charles prints the chapter numeral ('vi. 1.') and the verse numbers
    ('2.', '3.') inline. A number is taken as a verse only where it is the next
    one expected, so no other number in the text can start a verse. ix. 12 and
    13 are printed together ('12, 13.'), Charles having restored and transposed
    them (see his note there): they are one unit, '12-13'."""
    words = [w for _, w in stream]
    head = HEADING.split()
    assert words[: len(head)] == head, words[:12]
    colo = COLOPHON.split()
    assert words[-len(colo) :] == colo, words[-12:]
    body = stream[len(head) : len(stream) - len(colo)]
    units = []
    ch, nxt, cur = None, None, None
    i = 0
    while i < len(body):
        pg, w = body[i]
        after = body[i + 1][1] if i + 1 < len(body) else ""
        if w in CHAPTERS and after == "1.":
            if ch is not None:
                assert nxt == VERSES[ch] + 1, ("chapter ends early", ch, nxt)
            ch, nxt = CHAPTERS[w], 2
            cur = {"chapter": str(ch), "verse": "1", "pages": [], "words": []}
            units.append(cur)
            i += 2
            continue
        if ch == 9 and nxt == 12 and w == "12," and after == "13.":
            cur = {"chapter": "9", "verse": "12-13", "pages": [], "words": []}
            units.append(cur)
            nxt = 14
            i += 2
            continue
        # Where a half-bracket opens just before a verse number (vii. 28,
        # viii. 6: '⸢6.') it is kept at the start of that verse's text.
        if ch is not None and w.lstrip("⸢") == f"{nxt}." and nxt <= VERSES[ch]:
            cur = {"chapter": str(ch), "verse": str(nxt), "pages": [], "words": []}
            units.append(cur)
            nxt += 1
            i += 1
            if w.startswith("⸢"):
                pg, w = body[i]
                body[i] = (pg, "⸢" + w)
            continue
        assert cur is not None, ("words before vi. 1", w)
        cur["words"].append(w)
        cur["pages"].append(pg)
        i += 1
    assert ch == 11 and nxt == 44, (ch, nxt)
    out = [
        {
            "chapter": u["chapter"],
            "verse": u["verse"],
            "firstPage": str(min(u["pages"])),
            "lastPage": str(max(u["pages"])),
            "text": " ".join(u["words"]).replace("— ", "—").replace(" —", "—"),
        }
        for u in units
    ]
    assert len(out) == sum(VERSES.values()) - 1
    return out


# ---------------------------------------------------------------------------
# THE CHECK: THE RESULT AGAINST E, WORD BY WORD (REPORTED, NOT APPLIED)
# ---------------------------------------------------------------------------


def compare(units, ecw):
    ours = HEADING.split() + [w for u in units for w in u["text"].replace("—", " ").split()] + COLOPHON.split()
    ok = [key(w) for w in ours if key(w)]
    ek = [key(w) for w in ecw if key(w) and not re.fullmatch(r"\d+", key(w))]
    ok = [k for k in ok if not re.fullmatch(r"\d+", k)]
    sm = difflib.SequenceMatcher(None, ok, ek, autojunk=False)
    n = 0
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            continue
        n += 1
        log(f"  E differs: ...{' '.join(ok[max(0, i1 - 4):i1])} [{' '.join(ok[i1:i2])}] / E[{' '.join(ek[j1:j2])}]")
    log(f"E: {n} places differ from the result (agreement {sm.ratio():.3f})")


def write(units):
    w = sys.stdout.write
    w("// GENERATED by scripts/texts/ascension-of-isaiah.py from the archive.org OCR of\n")
    w("// two scans of R. H. Charles, The Ascension of Isaiah (London, 1900), voted\n")
    w("// against an independent web transcription and then read against the page images\n")
    w("// of the Cornell copy. Do not edit by hand: correct the generator (its FIXES list\n")
    w("// holds every correction made by hand) and run it again.\n\n")
    w("export type AscensionUnit = {\n")
    w("  /** Charles's chapter, '6' to '11'. */\n  chapter: string;\n")
    w("  /** Charles's verse; ix. 12 and 13 are printed together and are one unit, '12-13'. */\n  verse: string;\n")
    w("  /** The printed pages of Charles (1900) the verse runs over. */\n  firstPage: string;\n  lastPage: string;\n")
    w("  /** The verse as printed, with Charles's signs kept: ⸢ ⸣ (his raised double half-brackets), * *, † †, [ ] and ( ). */\n  text: string;\n};\n\n")
    w(f"export const ASCENSION_HEADING = {json.dumps(HEADING)};\n")
    w(f"export const ASCENSION_COLOPHON = {json.dumps(COLOPHON)};\n\n")
    w("export const ASCENSION_UNITS: AscensionUnit[] = [\n")
    for u in units:
        w(f"  {{ chapter: {json.dumps(u['chapter'])}, verse: {json.dumps(u['verse'])}, firstPage: {json.dumps(u['firstPage'])}, lastPage: {json.dumps(u['lastPage'])}, text: {json.dumps(u['text'], ensure_ascii=False)} }},\n")
    w("];\n")


TAKEN_COUNT = 20


def main():
    d = sys.argv[1]
    C = scan_pages(os.path.join(d, "C_djvu.xml"), "C")
    P = scan_pages(os.path.join(d, "P_djvu.xml"), "P")
    base, owner, ptoks = [], [], []
    for pg in range(FIRST_PAGE, LAST_PAGE + 1):
        ct, pt = tokens(C[pg]), tokens(P[pg])
        base.extend(ct)
        owner.extend([pg] * len(ct))
        ptoks.extend(pt)
    E = ecw_tokens(os.path.join(d, "ecw.html"))
    log(f"C {len(base)} words, P {len(ptoks)}, E {len(E)}")
    voted = vote(base, owner, {"P": ptoks, "E": E})
    log(f"{len(TAKEN)} readings taken; {len(DIFFERED)} places where the others differ and C is kept")
    assert len(TAKEN) == TAKEN_COUNT, ("TAKEN_COUNT differs", len(TAKEN))
    pages = {}
    for pg, w in voted:
        pages.setdefault(pg, []).append((pg, w))
    trim(pages)
    if os.environ.get("DUMP"):
        with open(os.environ["DUMP"], "w") as f:
            for pg in sorted(pages):
                f.write(f"=== p.{pg}\n{' '.join(w for _, w in pages[pg])}\n")
    apply_fixes(pages)
    stream = []
    for pg in sorted(pages):
        p = list(pages[pg])
        # A word broken over a page (the only one is 'like-' / 'wise', viii. 14,
        # pp. 56-57; Charles writes 'likewise', as E has it) is joined.
        if stream and re.fullmatch(r"[a-z]+-", stream[-1][1]):
            log(f"joined over pp. {stream[-1][0]}-{pg}: {stream[-1][1]}{p[0][1]}")
            stream[-1] = (stream[-1][0], stream[-1][1][:-1] + p[0][1])
            p = p[1:]
        stream.extend(p)
    units = split(stream)
    compare(units, E)
    write(units)


if __name__ == "__main__":
    main()
