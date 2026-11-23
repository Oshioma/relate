// Plain-text copy of an HTML email.
//
// Every email the site sends goes out with both an HTML part and a plain-text
// part. Gmail and other filters treat HTML-only mail as a spam signal, and
// some readers (watches, screen readers, text-only clients) show only the
// text. This turns the HTML we already build into readable text: headings and
// paragraphs on their own lines, list items as "- ", links as
// "label (https://…)", pictures and styling dropped.

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  middot: "·",
  copy: "©",
  pound: "£",
  euro: "€",
};

export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name: string) => {
    if (name[0] === "#") {
      const code = name[1] === "x" || name[1] === "X" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[name.toLowerCase()] ?? match;
  });
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

export function htmlToText(html: string): string {
  let s = html;

  // Things that never show as words.
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<(head|style|script|title)\b[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Source line breaks mean nothing in HTML; only tags break lines.
  s = s.replace(/\s+/g, " ");

  // Links: keep the words, and the address when it adds something.
  s = s.replace(/<a\b[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi, (_m, _q, href: string, inner: string) => {
    const url = decodeEntities(href.trim());
    const label = decodeEntities(stripTags(inner)).replace(/\s+/g, " ").trim();
    if (!url || url.startsWith("#") || url.startsWith("cid:")) return label;
    const shownUrl = url.replace(/^mailto:/i, "");
    if (!label || label === url || label === shownUrl) return shownUrl;
    return `${label} (${shownUrl})`;
  });

  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<li\b[^>]*>/gi, "\n- ");
  s = s.replace(/<hr\b[^>]*>/gi, "\n\n");
  s = s.replace(/<\/?(p|div|h[1-6]|ul|ol|table|tr|blockquote|section|header|footer|body|html)\b[^>]*>/gi, "\n\n");
  s = s.replace(/<\/(td|th)>/gi, " ");

  s = decodeEntities(stripTags(s));

  // Tidy: trim each line, at most one blank line in a row.
  const lines = s.split("\n").map((line) => line.replace(/[ \t ]+/g, " ").trim());
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
