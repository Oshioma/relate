// Section list for long-form posts (guides, articles). Any <h2> in an HTML
// post body that carries an id becomes an entry in the post page's section
// sidebar, so an author gets navigation just by giving headings ids.

export type PostSection = { id: string; label: string };

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘",
};

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body: string) => {
    if (body[0] === "#") {
      const cp = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      try {
        return String.fromCodePoint(cp);
      } catch {
        return whole;
      }
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });
}

export function postSections(html: string): PostSection[] {
  const sections: PostSection[] = [];
  const seen = new Set<string>();
  const re = /<h2\b([^>]*)>([\s\S]*?)<\/h2\s*>/gi;
  for (const match of html.matchAll(re)) {
    const idMatch = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(match[1]);
    const id = (idMatch?.[1] ?? idMatch?.[2] ?? idMatch?.[3] ?? "").trim();
    if (!id || seen.has(id)) continue;
    const label = decode(match[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!label) continue;
    seen.add(id);
    sections.push({ id, label });
  }
  return sections;
}
