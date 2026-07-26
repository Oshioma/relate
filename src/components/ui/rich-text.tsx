import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SafeHtml, looksLikeHtml, htmlToPlainText } from "./safe-html";

// A tiny, dependency-free renderer for the safe subset of Markdown we let
// members use in long-form text (space "About" descriptions, and anywhere else
// we want light formatting). It parses to React elements rather than HTML, so
// there is no `dangerouslySetInnerHTML` and no XSS surface — anything we don't
// recognise is rendered as plain text.
//
// Supported:
//   # / ## / ###   headings
//   **bold**  __bold__
//   *italic*  _italic_
//   `code`
//   [label](https://…)   links (http/https/mailto/relative only)
//   - or *  bullet lists      1.  numbered lists
//   blank line = new paragraph, single newline = line break

// Only allow hrefs we're comfortable turning into a real anchor; everything
// else (javascript:, data:, etc.) falls back to plain text.
function safeHref(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  return null;
}

const INLINE = /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*\n]+)\*)|(_([^_\n]+)_)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

// Parse inline markers (bold/italic/code/links) within a single run of text.
function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const k = `${keyPrefix}-${key++}`;
    if (match[2] !== undefined || match[4] !== undefined) {
      nodes.push(<strong key={k}>{match[2] ?? match[4]}</strong>);
    } else if (match[6] !== undefined || match[8] !== undefined) {
      nodes.push(<em key={k}>{match[6] ?? match[8]}</em>);
    } else if (match[10] !== undefined) {
      nodes.push(
        <code key={k} className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
          {match[10]}
        </code>
      );
    } else if (match[12] !== undefined) {
      const href = safeHref(match[13]);
      nodes.push(
        href ? (
          <a
            key={k}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="font-medium text-accent underline underline-offset-2"
          >
            {match[12]}
          </a>
        ) : (
          match[0]
        )
      );
    }
    lastIndex = INLINE.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

type Block =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "p"; lines: string[] };

// Group raw lines into block-level structures.
function toBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: "p", lines: paragraph });
      paragraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "ul") last.items.push(bullet[1]);
      else blocks.push({ kind: "ul", items: [bullet[1]] });
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "ol") last.items.push(numbered[1]);
      else blocks.push({ kind: "ol", items: [numbered[1]] });
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

// Strip the Markdown markers for plain-text contexts (list previews, meta
// tags) so descriptions read cleanly where we can't render formatting.
export function toPlainText(source: string): string {
  // Pasted HTML descriptions read as HTML — strip tags rather than markers.
  if (looksLikeHtml(source)) return htmlToPlainText(source);
  return source
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();
}

export function RichText({ content, className }: { content: string; className?: string }) {
  // A description that contains real HTML tags is rendered as (sanitised) HTML;
  // everything else stays on the Markdown path.
  if (looksLikeHtml(content)) {
    return <SafeHtml html={content} className={cn("text-sm leading-relaxed", className)} />;
  }

  const blocks = toBlocks(content);

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed", className)}>
      {blocks.map((block, i) => {
        const key = `b-${i}`;
        switch (block.kind) {
          case "heading": {
            const Tag = (["h2", "h3", "h4"] as const)[block.level - 1];
            const size = ["text-lg font-semibold", "text-base font-semibold", "text-sm font-semibold"][block.level - 1];
            return (
              <Tag key={key} className={cn("text-foreground", size)}>
                {parseInline(block.text, key)}
              </Tag>
            );
          }
          case "ul":
            return (
              <ul key={key} className="list-disc space-y-1 pl-5">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{parseInline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="list-decimal space-y-1 pl-5">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{parseInline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "p":
            return (
              <p key={key}>
                {block.lines.map((line, j) => (
                  <Fragment key={`${key}-${j}`}>
                    {j > 0 && <br />}
                    {parseInline(line, `${key}-${j}`)}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
