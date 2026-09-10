// HOW LONG A QUOTATION MAY BE.
//
// One definition, imported by the form, the schema and the link reader, so the
// three can never disagree about where the line is — a form that lets somebody
// type 5,000 words into a schema that refuses them is a save button that fails
// with no explanation.
//
// THE LIMIT IS IN WORDS, because that is the unit the person pasting is
// thinking in. A whole shared conversation runs to a few thousand words and is
// worth keeping whole; "2,000 characters" cut most of them off mid-argument.
//
// The character ceiling underneath it is a different thing and is NOT the
// limit: it is the backstop for the one case a word count cannot catch, which
// is a pasted megabyte of base64 arriving as a single unbroken "word".
//
// So it is set high enough that prose can never reach it. Twenty characters a
// word sounds absurdly generous until you write the test: five thousand
// repetitions of "conversation" is sixty-five thousand characters, and a
// twelve-a-word ceiling refused it. English averages nearer five, but an
// average is not a guarantee, and a limit whose whole justification is "no
// genuine extract trips this" has to be true of transcripts full of long
// technical words too. A blob is still refused by a factor of fifty.

export const QUOTATION_MAX_WORDS = 5_000;
export const QUOTATION_MAX_CHARS = QUOTATION_MAX_WORDS * 20;

/** Words, counted the way a person would: runs of non-space separated by space. */
export function countWords(text: string | null | undefined): number {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * The first `max` words of a text, with the whitespace between them preserved.
 *
 * Cuts on a word boundary rather than a character one, so an extract never ends
 * mid-word — and returns the text untouched when it is already short enough,
 * which is nearly always.
 */
export function trimToWords(text: string, max: number = QUOTATION_MAX_WORDS): string {
  if (countWords(text) <= max) return text;

  // Walk the string counting words rather than splitting and rejoining: a
  // rejoin would normalise every run of whitespace, silently reformatting a
  // transcript somebody may have pasted for its line breaks.
  const pattern = /\S+/g;
  let seen = 0;
  let end = text.length;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    seen += 1;
    if (seen === max) {
      end = match.index + match[0].length;
      break;
    }
  }
  return text.slice(0, end);
}
