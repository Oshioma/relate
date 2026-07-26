import { Fragment, createElement, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A dependency-free, allowlist-based HTML renderer. It parses a string of HTML
// into React elements — it never uses `dangerouslySetInnerHTML` for the body,
// so the XSS surface is limited to the exact tags, attributes and URL schemes
// we explicitly allow here. Everything else is dropped or unwrapped.
//
// This is the "paste real HTML" companion to <RichText> (Markdown). It lets a
// community owner drop a custom block — a styled footer, a hero, a table — into
// a space description and have it render, including a scoped <style> block so
// their own CSS classes actually take effect without leaking into the rest of
// the app.

// Elements with no closing tag.
const VOID_TAGS = new Set(["br", "hr", "img", "col", "wbr"]);

// Tags we render. Anything not here (and not in DROP_SUBTREE) is "unwrapped":
// we drop the tag but keep its children, matching how HTML sanitizers behave.
const ALLOWED_TAGS = new Set([
  // structure
  "div", "section", "article", "header", "footer", "main", "aside", "nav", "figure", "figcaption", "details", "summary",
  // text blocks
  "p", "span", "blockquote", "pre", "code", "br", "hr", "address",
  "h1", "h2", "h3", "h4", "h5", "h6",
  // lists
  "ul", "ol", "li", "dl", "dt", "dd",
  // inline
  "strong", "b", "em", "i", "u", "s", "strike", "small", "sub", "sup", "mark", "abbr",
  "time", "del", "ins", "q", "cite", "kbd", "samp", "var", "wbr",
  // links & media
  "a", "img",
  // tables
  "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "colgroup", "col",
]);

// Tags whose entire subtree is discarded — these can execute code, load remote
// content, or capture input, none of which belongs in a description.
const DROP_SUBTREE = new Set([
  "script", "iframe", "object", "embed", "noscript", "template", "form", "input", "button",
  "select", "textarea", "option", "optgroup", "label", "fieldset", "legend",
  "meta", "link", "base", "title", "head", "html", "body", "svg", "math", "canvas",
  "audio", "video", "source", "track", "picture", "frame", "frameset", "applet", "param", "dialog", "slot",
]);

// Attributes we pass through, with their React prop name. `class`, `style`,
// `href` and `src` are handled specially below and are not in this map.
const ATTR_MAP: Record<string, string> = {
  id: "id",
  title: "title",
  dir: "dir",
  lang: "lang",
  role: "role",
  name: "name",
  alt: "alt",
  width: "width",
  height: "height",
  loading: "loading",
  start: "start",
  reversed: "reversed",
  value: "value",
  align: "align",
  span: "span",
  scope: "scope",
  headers: "headers",
  cite: "cite",
  open: "open",
  datetime: "dateTime",
  colspan: "colSpan",
  rowspan: "rowSpan",
};

// Only turn these into real hrefs/srcs; anything else (javascript:, vbscript:,
// bare data: for links, etc.) is dropped.
function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("?")) return trimmed;
  // Reject protocol-relative-looking or scheme-bearing values we didn't allow.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  // Relative path with no scheme.
  return trimmed || null;
}

function safeImgSrc(url: string): string | null {
  const trimmed = url.trim();
  if (/^https?:/i.test(trimmed)) return trimmed;
  if (/^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  return trimmed || null;
}

// ---- Entity decoding (text nodes & attribute values) --------------------

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  copy: "©", reg: "®", trade: "™", hellip: "…",
  mdash: "—", ndash: "–", middot: "·", deg: "°",
  times: "×", divide: "÷", laquo: "«", raquo: "»",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  bull: "•", euro: "€", pound: "£", cent: "¢", sect: "§",
};

function fromCodePoint(cp: number): string {
  if (!Number.isFinite(cp) || cp <= 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return "";
  try {
    return String.fromCodePoint(cp);
  } catch {
    return "";
  }
}

function decodeEntities(input: string): string {
  if (!input.includes("&")) return input;
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, body: string) => {
    if (body[0] === "#") {
      const cp = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return fromCodePoint(cp) || whole;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
  });
}

// ---- Tokenizer -----------------------------------------------------------

type Token =
  | { t: "text"; value: string }
  | { t: "open"; tag: string; attrs: Record<string, string>; selfClose: boolean }
  | { t: "close"; tag: string }
  | { t: "style"; css: string };

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    attrs[name] = decodeEntities(value);
  }
  return attrs;
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const n = html.length;
  let i = 0;

  while (i < n) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      tokens.push({ t: "text", value: html.slice(i) });
      break;
    }
    if (lt > i) tokens.push({ t: "text", value: html.slice(i, lt) });

    // Comments.
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? n : end + 3;
      continue;
    }
    // Doctypes / declarations / processing instructions.
    if (html[lt + 1] === "!" || html[lt + 1] === "?") {
      const end = html.indexOf(">", lt);
      i = end === -1 ? n : end + 1;
      continue;
    }
    // Closing tag.
    if (html[lt + 1] === "/") {
      const end = html.indexOf(">", lt);
      if (end === -1) {
        tokens.push({ t: "text", value: html.slice(lt) });
        break;
      }
      const tag = /^[a-z][a-z0-9]*/i.exec(html.slice(lt + 2, end).trim())?.[0];
      if (tag) tokens.push({ t: "close", tag: tag.toLowerCase() });
      i = end + 1;
      continue;
    }

    const tagMatch = /^<([a-z][a-z0-9]*)/i.exec(html.slice(lt, lt + 40));
    if (!tagMatch) {
      // A stray "<" that isn't a tag — keep it as literal text.
      tokens.push({ t: "text", value: "<" });
      i = lt + 1;
      continue;
    }
    const tag = tagMatch[1].toLowerCase();

    // Find the end of the open tag, respecting quoted attribute values.
    let j = lt + 1 + tagMatch[1].length;
    let quote = "";
    while (j < n) {
      const c = html[j];
      if (quote) {
        if (c === quote) quote = "";
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === ">") {
        break;
      }
      j++;
    }
    const inner = html.slice(lt + 1 + tagMatch[1].length, j);
    i = j + 1;
    const selfClose = /\/\s*$/.test(inner);

    // Raw-text elements: consume up to the matching close tag.
    if (tag === "script" || tag === "style" || tag === "textarea" || tag === "title") {
      const rest = html.slice(i);
      const close = new RegExp(`</${tag}\\s*>`, "i").exec(rest);
      const raw = close ? rest.slice(0, close.index) : rest;
      i = close ? i + close.index + close[0].length : n;
      if (tag === "style") tokens.push({ t: "style", css: raw });
      // script/textarea/title content is dropped.
      continue;
    }

    tokens.push({ t: "open", tag, attrs: parseAttrs(inner), selfClose: selfClose || VOID_TAGS.has(tag) });
  }

  return tokens;
}

// ---- Tree ----------------------------------------------------------------

type ElNode = { type: "el"; tag: string; attrs: Record<string, string>; children: TreeNode[] };
type TextNode = { type: "text"; value: string };
type StyleNode = { type: "style"; css: string };
type TreeNode = ElNode | TextNode | StyleNode;

function buildTree(tokens: Token[]): TreeNode[] {
  const root: ElNode = { type: "el", tag: "#root", attrs: {}, children: [] };
  const stack: ElNode[] = [root];

  for (const tok of tokens) {
    const top = stack[stack.length - 1];
    if (tok.t === "text") {
      top.children.push({ type: "text", value: tok.value });
    } else if (tok.t === "style") {
      top.children.push({ type: "style", css: tok.css });
    } else if (tok.t === "open") {
      const el: ElNode = { type: "el", tag: tok.tag, attrs: tok.attrs, children: [] };
      top.children.push(el);
      if (!tok.selfClose) stack.push(el);
    } else {
      // Pop to the nearest matching open tag; tolerate mismatched/stray closers.
      for (let k = stack.length - 1; k >= 1; k--) {
        if (stack[k].tag === tok.tag) {
          stack.length = k;
          break;
        }
      }
    }
  }

  return root.children;
}

// ---- Inline style attribute ---------------------------------------------

function parseStyleAttr(value: string): CSSProperties | undefined {
  const style: Record<string, string> = {};
  for (const decl of value.split(";")) {
    const idx = decl.indexOf(":");
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) continue;
    if (/expression\s*\(|javascript:|behavior\s*:|-moz-binding|<\/?/i.test(val)) continue;
    if (/url\s*\(/i.test(val) && !/url\s*\(\s*['"]?(https?:|data:image\/|\/|#|['"]?\))/i.test(val)) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[key] = val;
  }
  return Object.keys(style).length ? (style as CSSProperties) : undefined;
}

// ---- Scoped <style> ------------------------------------------------------

// Strip declarations that could reach out of CSS into script or remote loads.
function sanitizeDeclarations(body: string): string {
  return body
    .split(";")
    .map((d) => d.trim())
    .filter((d) => {
      if (!d) return false;
      if (/expression\s*\(|javascript:|behavior\s*:|-moz-binding|<\/?/i.test(d)) return false;
      if (/url\s*\(/i.test(d) && !/url\s*\(\s*['"]?(https?:|data:image\/|\/|#|['"]?\))/i.test(d)) return false;
      return true;
    })
    .join("; ");
}

function scopeSelector(sel: string, scope: string): string {
  const s = sel.trim();
  if (!s) return "";
  if (/^(html|body|:root)\b/i.test(s)) return s.replace(/^(html|body|:root)/i, `.${scope}`);
  return `.${scope} ${s}`;
}

// Prefix every selector with the scope class so pasted CSS only styles the
// pasted markup, never the surrounding app. At-rules are handled recursively.
function scopeBlock(css: string, scope: string): string {
  let out = "";
  const n = css.length;
  let i = 0;

  while (i < n) {
    let j = i;
    while (j < n && css[j] !== "{" && css[j] !== "}" && css[j] !== ";") j++;
    const prelude = css.slice(i, j).trim();
    const ch = css[j];

    if (ch === "{") {
      let depth = 1;
      let k = j + 1;
      while (k < n && depth > 0) {
        if (css[k] === "{") depth++;
        else if (css[k] === "}") depth--;
        if (depth === 0) break;
        k++;
      }
      const body = css.slice(j + 1, k);
      i = k + 1;

      if (prelude.startsWith("@")) {
        const at = prelude.slice(1).split(/[\s({]/)[0].toLowerCase();
        if (at === "media" || at === "supports" || at === "container" || at === "layer" || at === "scope") {
          out += `${prelude}{${scopeBlock(body, scope)}}`;
        } else if (at === "keyframes" || at === "font-face" || at === "page" || /keyframes$/.test(at)) {
          // Inner selectors here aren't element selectors — leave them alone.
          out += `${prelude}{${body}}`;
        }
        // Any other block at-rule (@import with a block, etc.) is dropped.
      } else {
        const scoped = prelude
          .split(",")
          .map((sel) => scopeSelector(sel, scope))
          .filter(Boolean)
          .join(", ");
        const decls = sanitizeDeclarations(body);
        if (scoped && decls) out += `${scoped}{${decls}}`;
      }
    } else {
      // A statement (`@import ...;`, `@charset ...;`) — drop it.
      i = j + 1;
    }
  }

  return out;
}

function scopeCss(css: string, scope: string): string {
  return scopeBlock(css.replace(/\/\*[\s\S]*?\*\//g, ""), scope);
}

function collectStyles(nodes: TreeNode[], out: string[]): void {
  for (const node of nodes) {
    if (node.type === "style") out.push(node.css);
    else if (node.type === "el") collectStyles(node.children, out);
  }
}

// ---- Render to React -----------------------------------------------------

function buildProps(tag: string, attrs: Record<string, string>, key: string): Record<string, unknown> {
  const props: Record<string, unknown> = { key };
  for (const [name, value] of Object.entries(attrs)) {
    if (name.startsWith("on")) continue; // no event handlers
    if (name === "class") {
      props.className = value;
    } else if (name === "style") {
      const style = parseStyleAttr(value);
      if (style) props.style = style;
    } else if (name === "href" && tag === "a") {
      const href = safeUrl(value);
      if (href) {
        props.href = href;
        if (/^https?:/i.test(href)) {
          props.target = "_blank";
          props.rel = "noopener noreferrer nofollow";
        }
      }
    } else if (name === "src" && tag === "img") {
      const src = safeImgSrc(value);
      if (src) props.src = src;
    } else if (name.startsWith("aria-") || name.startsWith("data-")) {
      props[name] = value;
    } else if (ATTR_MAP[name]) {
      props[ATTR_MAP[name]] = value;
    }
  }
  if (tag === "img") {
    if (!props.src) return props; // handled by caller: skip src-less images
    if (props.alt === undefined) props.alt = "";
  }
  return props;
}

function renderNodes(nodes: TreeNode[], keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  nodes.forEach((node, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (node.type === "text") {
      const text = decodeEntities(node.value);
      if (text) out.push(text);
      return;
    }
    if (node.type === "style") return; // rendered separately, scoped

    const { tag, attrs, children } = node;
    if (DROP_SUBTREE.has(tag)) return;

    if (!ALLOWED_TAGS.has(tag)) {
      // Unknown tag: keep its content, drop the wrapper.
      out.push(<Fragment key={key}>{renderNodes(children, key)}</Fragment>);
      return;
    }

    const props = buildProps(tag, attrs, key);
    if (tag === "img" && !props.src) return; // dropped unsafe/empty src

    if (VOID_TAGS.has(tag)) {
      out.push(createElement(tag, props));
    } else {
      out.push(createElement(tag, props, renderNodes(children, key)));
    }
  });
  return out;
}

// Small stable hash so the scope class is deterministic across server/client
// renders (no Math.random / Date, which would break hydration).
function hashString(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function SafeHtml({ html, className }: { html: string; className?: string }) {
  const tokens = tokenize(html);
  const tree = buildTree(tokens);

  const rawStyles: string[] = [];
  collectStyles(tree, rawStyles);

  const scope = `rc-${hashString(html)}`;
  const scopedCss = rawStyles.map((css) => scopeCss(css, scope)).join("\n").trim();

  return (
    <div className={cn(scope, className)}>
      {scopedCss ? createElement("style", { key: "scoped-style" }, scopedCss) : null}
      {renderNodes(tree, "h")}
    </div>
  );
}

// Whether a string contains HTML we should render as HTML (rather than
// Markdown). Matches an opening or closing tag whose name we recognise, so
// incidental "<" characters ("a < b", "<3") don't flip the renderer.
const HTML_TAG_RE = new RegExp(
  `</?(?:${[...ALLOWED_TAGS, ...DROP_SUBTREE].join("|")})(?:\\s|/?>|$)`,
  "i"
);

export function looksLikeHtml(source: string): boolean {
  return HTML_TAG_RE.test(source);
}

// Strip HTML tags/entities for plain-text contexts (list previews, meta tags).
export function htmlToPlainText(source: string): string {
  return decodeEntities(source.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}
