// A membership plan's description is typed into a plain textarea. To show it
// as a readable page rather than one grey paragraph, split it into blocks:
// paragraphs on blank lines, a short line ending in ":" ("What to expect:") as
// a heading, and lines starting with -, *, • or a number as a bulleted list.
export type PlanDescriptionBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

const BULLET = /^\s*(?:[-*•–]|\d+[.)])\s+/;

export function planDescriptionBlocks(raw: string | null | undefined): PlanDescriptionBlock[] {
  const blocks: PlanDescriptionBlock[] = [];
  const lines = String(raw ?? "").replace(/\r\n?/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    if (list.length) blocks.push({ kind: "list", items: list });
    paragraph = [];
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
    } else if (BULLET.test(rawLine)) {
      if (paragraph.length) flush();
      list.push(rawLine.replace(BULLET, "").trim());
    } else if (line.endsWith(":") && line.length <= 60) {
      flush();
      blocks.push({ kind: "heading", text: line.slice(0, -1).trim() });
    } else {
      if (list.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}
