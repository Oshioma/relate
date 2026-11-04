// Tidy text someone typed into a multi-line box (a bio, a checkout message,
// a description) WITHOUT losing their paragraphs: spaces and tabs inside a
// line are squeezed to one, each line is trimmed, Windows line endings become
// plain ones, and three or more line breaks in a row become one blank line.
// The whole thing is trimmed at the ends. Show the result with
// `whitespace-pre-line` (or RichText) so the breaks appear on the page.
export function tidyMultilineText(raw: string | null | undefined): string {
  return String(raw ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
