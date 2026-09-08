// Turning a dropped file into source material.
//
// The formats that matter are the ones people actually end up holding. A .txt
// or .md is already the material. A .srt or .vtt is not: it is the material
// wrapped in about twice its own weight of timing data, and it is exactly what
// comes out of Whisper, YouTube's transcript download, and most caption
// exports. Pasting one raw means the writer reads a wall of timestamps, and
// the character budget is spent on numbers.
//
// So subtitles are unwrapped here, in the browser, before the text ever
// reaches the box. No upload, no parsing on the server, no new dependency —
// the whole conversion is string handling.
//
// It removes only structure, never words. Timings, cue numbers, caption
// markup and the rolling duplicates that auto-generated captions are full of
// all go; every word that was spoken survives.

// A timing line, in every one of these formats, is the line with the arrow.
const TIMING = /-->/;
// What can sit on the line directly above a timing line: an SRT cue number, or
// a VTT cue identifier. Both are single tokens. Requiring no whitespace is
// what keeps a spoken line out of it — see the label check below.
const LABEL = /^\S+$/;
// WEBVTT's header and its block markers. NOTE and STYLE introduce blocks we
// drop wholesale; the rest are single lines.
const VTT_HEADER = /^(WEBVTT|Kind:|Language:|X-TIMESTAMP-MAP)/i;
const VTT_BLOCK = /^(NOTE|STYLE|REGION)\b/;
// Caption markup: <c.colorE5E5E5>, </c>, <i>, and the per-word timing tags
// <00:00:01.234> that YouTube's auto-captions interleave with the words.
const INLINE_TAG = /<[^>]*>/g;
// A handful of entities that show up in caption text. Deliberately not a full
// HTML entity decoder — these files are text, not markup, and anything else
// left as-is is readable.
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

// Roughly a paragraph. Captions break lines every few words to fit the screen,
// which means nothing once the timings are gone, so the lines are re-joined
// and a break is taken at the first sentence end past this.
// Cosmetic only: it changes where the newlines fall, never the words.
const PARAGRAPH_CHARS = 500;
// The break taken when no sentence end arrives. Auto-generated captions
// frequently contain no punctuation AT ALL — an hour of speech came back as a
// single 51,000-character line, which is unreadable and unusable to edit. Past
// this, the next caption line ends the paragraph whatever it ends with.
const HARD_PARAGRAPH_CHARS = 1200;

export function isSubtitleFile(name: string): boolean {
  return /\.(srt|vtt|sbv)$/i.test(name);
}

export function isTextFile(name: string): boolean {
  return /\.(txt|md|markdown|text|srt|vtt|sbv)$/i.test(name);
}

// The extensions offered in the file picker, as an accept attribute.
export const TEXT_FILE_ACCEPT = ".txt,.md,.markdown,.text,.srt,.vtt,.sbv,text/plain";

function decodeEntities(line: string): string {
  return line.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, (match) => ENTITIES[match] ?? match);
}

// Strips the timing scaffolding out of an SRT/VTT/SBV file.
export function subtitleToText(raw: string): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const kept: string[] = [];
  let skippingBlock = false;
  // The VTT header only exists before the first cue. After that, a line
  // beginning "Language:" is somebody talking about languages.
  let seenCue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // NOTE and STYLE blocks run until a blank line.
    if (skippingBlock) {
      if (!line) skippingBlock = false;
      continue;
    }
    if (VTT_BLOCK.test(line)) {
      skippingBlock = true;
      continue;
    }

    if (!line) continue;
    if (!seenCue && VTT_HEADER.test(line)) continue;

    if (TIMING.test(line)) {
      seenCue = true;
      continue;
    }

    // A cue number or identifier is defined by its POSITION — the line
    // immediately above a timing line — not by looking like a number. Testing
    // for digits alone ate any line that was only a year: a transcript saying
    // "1984" on its own lost the word. The whitespace test is the second half:
    // a cue label is one token, so a spoken line survives even in a file
    // written without blank lines between its cues.
    if (LABEL.test(line) && TIMING.test(lines[i + 1] ?? "")) continue;

    const text = decodeEntities(line.replace(INLINE_TAG, "")).trim();
    if (!text) continue;

    // Auto-generated captions repeat the previous line on almost every cue as
    // the caption box scrolls. Left in, an hour of speech triples in length
    // and reads as a stutter.
    if (kept.length > 0 && kept[kept.length - 1] === text) continue;

    kept.push(text);
  }

  return reflow(kept);
}

// Joins caption lines back into sentences, breaking a paragraph at the first
// sentence end past PARAGRAPH_CHARS.
function reflow(lines: string[]): string {
  const paragraphs: string[] = [];
  let current = "";

  for (const line of lines) {
    current = current ? `${current} ${line}` : line;
    const atSentenceEnd = current.length >= PARAGRAPH_CHARS && /[.!?]["')\]]?$/.test(line);
    if (atSentenceEnd || current.length >= HARD_PARAGRAPH_CHARS) {
      paragraphs.push(current);
      current = "";
    }
  }
  if (current) paragraphs.push(current);

  return paragraphs.join("\n\n");
}

// One entry point for a dropped or picked file: subtitles are unwrapped,
// everything else is already the material.
export function fileTextToSource(name: string, raw: string): string {
  const text = isSubtitleFile(name) ? subtitleToText(raw) : raw.replace(/\r\n?/g, "\n");
  return text.trim();
}
