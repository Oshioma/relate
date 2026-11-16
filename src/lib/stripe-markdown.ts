// The line under the Pay button on a Stripe Checkout page is written in our
// rich text editor (HTML), but Stripe takes plain text with a little Markdown:
// **bold**, _italic_ and [links](https://…). This turns the editor's HTML
// into that: paragraphs and line breaks become new lines, list items become
// "- " lines, headings become bold, and every other tag is dropped. Plain
// text (anything saved before the editor) passes through unchanged.

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (match, name: string) => {
    const lower = name.toLowerCase();
    if (lower in ENTITIES) return ENTITIES[lower];
    if (lower.startsWith("#x")) return String.fromCodePoint(parseInt(lower.slice(2), 16) || 32);
    if (lower.startsWith("#")) return String.fromCodePoint(parseInt(lower.slice(1), 10) || 32);
    return match;
  });
}

export function looksLikeRichHtml(text: string): boolean {
  return /<\/?(p|br|div|strong|b|em|i|u|a|ul|ol|li|h[1-6]|span|blockquote)(\s|\/?>)/i.test(text);
}

// Wraps inline text in a Markdown marker, keeping spaces outside it (Stripe,
// like Markdown, won't treat "** bold **" as bold).
function wrap(marker: string, inner: string): string {
  const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m || !m[2]) return inner;
  return `${m[1]}${marker}${m[2]}${marker}${m[3]}`;
}

export function htmlToStripeMarkdown(input: string | null | undefined): string {
  const source = String(input ?? "");
  if (!looksLikeRichHtml(source)) return source.trim();

  let out = source
    .replace(/\r\n?/g, "\n")
    // Source newlines inside HTML are just spacing.
    .replace(/\s*\n\s*/g, " ")
    .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/(ul|ol)>/gi, "\n")
    .replace(/<(ul|ol)\b[^>]*>/gi, "\n");

  // Links, bold, italic, headings: innermost first so nesting works.
  out = out.replace(/<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi, (_m, _q, dq, sq, label) => {
    const href = decode(String(dq ?? sq ?? "")).trim();
    const text = String(label).replace(/<[^>]+>/g, "").trim();
    if (!/^(https?:|mailto:)/i.test(href)) return text;
    return text && text !== href ? `[${text}](${href})` : href;
  });
  for (let i = 0; i < 3; i++) {
    out = out
      .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner) => wrap("**", inner))
      .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner) => wrap("_", inner));
  }
  out = out
    .replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_m, inner) => `\n${wrap("**", String(inner).replace(/<[^>]+>/g, ""))}\n`)
    .replace(/<\/(p|div|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  return decode(out)
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .join("\n")
    .replace(/\*\*\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
