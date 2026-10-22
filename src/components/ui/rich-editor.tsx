"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Heading, List, ListOrdered, Link as LinkIcon, Code, Eye, Pencil, ImagePlus, Film, MonitorPlay, Loader2 } from "lucide-react";
import { checkMemberFile, uploadMemberFile } from "./upload-button";
import { useUploadTarget } from "./upload-target";
import { parseVideoLink } from "@/lib/school/video-links";
import { RichText } from "./rich-text";
import { PROSE_CLASS } from "@/lib/prose";
import { cn } from "@/lib/utils";

// A small WYSIWYG editor for long-form text (space "About" descriptions and
// custom pages). Three modes:
//
//   • Write   — a contenteditable surface. Select text and click Bold/Italic
//               (or press ⌘/Ctrl+B) and it goes bold *visually* — no Markdown
//               markers. Output is HTML.
//   • HTML    — a raw textarea for pasting/editing HTML by hand.
//   • Preview — renders the current value with <RichText> (which sanitises
//               HTML and also still understands Markdown), so authors see the
//               real page before saving.
//
// The value is kept in React state and submitted via a hidden input under
// `name`, so it drops into a plain <form action> like a bare textarea. Nothing
// is ever rendered with dangerouslySetInnerHTML on display — <RichText> parses
// to React elements — so the stored HTML is only ever shown sanitised.
//
// We use document.execCommand for the formatting buttons. It's technically
// deprecated but remains universally supported and needs no dependency, which
// fits this codebase's hand-rolled, dependency-free approach to rich text.

type Mode = "write" | "html" | "preview";

// Treat a contenteditable that only holds line-break scaffolding as empty, so
// an "untouched" field saves as "" (and the empty-page hint can show).
function normalize(html: string): string {
  const stripped = html.replace(/\s|&nbsp;/gi, "");
  if (stripped === "" || stripped === "<br>" || stripped === "<div><br></div>" || stripped === "<div></div>" || stripped === "<p></p>" || stripped === "<p><br></p>") {
    return "";
  }
  return html;
}

// ---- Paste handling ------------------------------------------------------
// Pasting from a rich source (a ChatGPT answer, a Google Doc, a web page)
// should keep the *structure* — headings, bold, lists, links — but drop the
// source's own colours, fonts and wrapper cruft so the content adopts this
// app's styling. Pasting plain text should still gain sensible structure
// (paragraphs, bullet lists, numbered section headings) rather than collapsing
// into one blob. Both paths below produce clean HTML from our own allow-list.

// Structural tags we keep from a rich paste. Everything else (span, div, font,
// style-carrying wrappers) is unwrapped — its text is kept, the tag dropped.
const PASTE_KEEP_TAGS = new Set([
  "H1", "H2", "H3", "H4", "P", "UL", "OL", "LI",
  "STRONG", "B", "EM", "I", "U", "A", "BR", "HR", "BLOCKQUOTE", "CODE", "PRE",
]);

function escapeTextForHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeTextForHtml(value).replace(/"/g, "&quot;");
}

// Only keep hrefs we'd actually render (mirrors SafeHtml's link policy).
function safePasteHref(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  return null;
}

// Walk pasted DOM and re-emit only allow-listed tags with no attributes (except
// a vetted href). Unknown tags are unwrapped so their text survives.
function sanitizePastedHtml(html: string): string {
  const container = document.createElement("div");
  container.innerHTML = html;

  const render = (node: Node): string => {
    let out = "";
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        out += escapeTextForHtml(child.textContent ?? "");
        return;
      }
      if (child.nodeType !== 1) return;
      const el = child as HTMLElement;
      let tag = el.tagName;
      if (tag === "H5" || tag === "H6") tag = "H4"; // clamp deep headings
      if (tag === "B") tag = "STRONG";
      if (tag === "I") tag = "EM";

      if (!PASTE_KEEP_TAGS.has(tag)) {
        out += render(el); // unwrap
        return;
      }
      const lower = tag.toLowerCase();
      if (tag === "BR" || tag === "HR") {
        out += `<${lower}>`;
        return;
      }
      const inner = render(el);
      if (tag === "A") {
        const href = safePasteHref(el.getAttribute("href") ?? "");
        out += href ? `<a href="${escapeTextForHtml(href)}">${inner}</a>` : inner;
        return;
      }
      out += `<${lower}>${inner}</${lower}>`;
    });
    return out;
  };

  return render(container).replace(/(?:<br>\s*){3,}/g, "<br><br>").trim();
}

// Turn a plain-text paste into structured HTML: blank lines separate blocks;
// a block whose lines all start with "*" / "-" / "•" becomes a bullet list; a
// short "12. Heading" line becomes a heading; anything else is a paragraph
// (single newlines within it kept as <br>).
function plainTextToHtml(text: string): string {
  const blocks = text.replace(/\r\n?/g, "\n").split(/\n{2,}/);
  const parts: string[] = [];

  for (const raw of blocks) {
    const lines = raw.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;

    const isBulleted = lines.every((l) => /^\s*[*\-•]\s+/.test(l));
    if (isBulleted) {
      const items = lines.map((l) => `<li>${escapeTextForHtml(l.replace(/^\s*[*\-•]\s+/, "").trim())}</li>`).join("");
      parts.push(`<ul>${items}</ul>`);
      continue;
    }

    // A lone short "N. Title" line reads as a section heading.
    if (lines.length === 1) {
      const line = lines[0].trim();
      if (/^\d{1,2}\.\s+\S/.test(line) && line.length <= 60 && !/[.:;]$/.test(line)) {
        parts.push(`<h2>${escapeTextForHtml(line)}</h2>`);
        continue;
      }
    }

    parts.push(`<p>${lines.map((l) => escapeTextForHtml(l.trim())).join("<br>")}</p>`);
  }

  return parts.join("");
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      // Keep the editor's selection while clicking the button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function RichEditor({
  name,
  defaultValue = "",
  id,
  rows = 4,
  placeholder,
  className,
  onChange,
  allowMedia = false,
}: {
  name: string;
  defaultValue?: string;
  id?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
  /** Called with the current HTML whenever it changes. For callers that build
   *  their own FormData instead of relying on the hidden input. */
  onChange?: (value: string) => void;
  /** Adds Image, Video and Video-link buttons to the toolbar. Files go to the
   *  writer's own folder of the 'uploads' bucket, or of the space's private
   *  folder inside a space visitors can't open (see upload-target.tsx). */
  allowMedia?: boolean;
}) {
  const uploadTarget = useUploadTarget();
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>("write");
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  // Where the caret was when a media button was pressed: the file dialog takes
  // focus away, so the picture lands there rather than at the end.
  const savedRangeRef = useRef<Range | null>(null);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onChangeRef.current?.(value);
  }, [value]);

  // Populate the contenteditable when we (re)enter Write mode. Deliberately
  // NOT keyed on `value` — re-writing innerHTML on every keystroke would reset
  // the caret to the start.
  useEffect(() => {
    if (mode === "write" && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Keep in step with a native form reset (e.g. the new-space form clears
  // itself after a successful submit).
  useEffect(() => {
    const form = hiddenRef.current?.form;
    if (!form) return;
    const onReset = () => {
      setValue(defaultValue);
      if (editorRef.current) editorRef.current.innerHTML = defaultValue;
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue]);

  // Bulletproof the submitted value: when the form builds its FormData, write
  // the editor's *current* content straight in, so a save never depends on the
  // controlled hidden input having caught the last keystroke/paste. In Write
  // mode the contenteditable's innerHTML is the source of truth; otherwise the
  // `value` state (HTML textarea / preview) is. This is what makes a large
  // pasted Privacy/Terms doc reliably persist.
  useEffect(() => {
    const form = hiddenRef.current?.form;
    if (!form) return;
    const onFormData = (event: FormDataEvent) => {
      const current = mode === "write" && editorRef.current ? normalize(editorRef.current.innerHTML) : value;
      event.formData.set(name, current);
    };
    form.addEventListener("formdata", onFormData);
    return () => form.removeEventListener("formdata", onFormData);
  }, [name, mode, value]);

  function syncFromEditor() {
    if (editorRef.current) setValue(normalize(editorRef.current.innerHTML));
  }

  // Insert HTML at the caret using the Range API rather than the deprecated
  // execCommand("insertHTML"), which silently fails on large pastes (a long
  // Terms/Privacy doc) — leaving the editor, and the saved value, empty.
  function insertHtmlAtCaret(html: string) {
    const editor = editorRef.current;
    if (!editor) return;

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const frag = document.createDocumentFragment();
    let lastNode: ChildNode | null = null;
    while (temp.firstChild) lastNode = frag.appendChild(temp.firstChild);

    const selection = window.getSelection();
    // No caret inside the editor (e.g. selection lost) — append to the end.
    if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
      editor.appendChild(frag);
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  // Intercept paste so rich content keeps its structure but sheds the source's
  // colours/fonts, and plain text gains sensible structure.
  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    if (!html && !text) return;

    event.preventDefault();
    const clean = html ? sanitizePastedHtml(html) : plainTextToHtml(text);
    insertHtmlAtCaret(clean || escapeTextForHtml(text));
    syncFromEditor();
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncFromEditor();
  }

  function saveCaret() {
    const selection = window.getSelection();
    const editor = editorRef.current;
    savedRangeRef.current =
      selection && selection.rangeCount > 0 && editor?.contains(selection.anchorNode) ? selection.getRangeAt(0).cloneRange() : null;
  }

  // Inserts a block of media (with an empty paragraph after it, so typing can
  // carry on below) where the caret was saved.
  function insertMedia(html: string) {
    const selection = window.getSelection();
    if (savedRangeRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }
    savedRangeRef.current = null;
    insertHtmlAtCaret(`${html}<p><br></p>`);
    syncFromEditor();
  }

  async function handleMediaFile(kind: "image" | "video", event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const invalid = checkMemberFile(file, kind === "image" ? "image" : "media");
    if (invalid || (kind === "video" && !file.type.startsWith("video/"))) {
      setMediaError(invalid ?? "Please choose a video (MP4, WebM or MOV).");
      return;
    }
    setMediaError(null);
    setUploading(kind);
    try {
      const url = escapeAttr(await uploadMemberFile(file, uploadTarget));
      insertMedia(kind === "image" ? `<img src="${url}" alt="">` : `<video controls preload="metadata" src="${url}"></video>`);
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(null);
    }
  }

  // A YouTube or Vimeo link becomes an embedded player; a link to a video file
  // plays inline; anything else (a TikTok, say, which can't be embedded) is
  // kept as a plain link so it isn't lost.
  function insertVideoLink() {
    saveCaret();
    const raw = window.prompt("Paste a YouTube or Vimeo link", "https://");
    if (!raw || raw.trim() === "https://") return;
    const link = parseVideoLink(raw.trim());
    const embedHost = link?.embedUrl ? new URL(link.embedUrl).hostname : null;
    if (link?.embedUrl && embedHost && /(^|\.)(youtube-nocookie\.com|youtube\.com|vimeo\.com)$/.test(embedHost)) {
      insertMedia(`<iframe src="${escapeAttr(link.embedUrl)}" allowfullscreen></iframe>`);
    } else if (/^https:\/\/\S+\.(mp4|webm|mov)(\?\S*)?$/i.test(raw.trim())) {
      insertMedia(`<video controls preload="metadata" src="${escapeAttr(raw.trim())}"></video>`);
    } else if (/^https?:\/\//i.test(raw.trim())) {
      const href = escapeAttr(raw.trim());
      insertMedia(`<p><a href="${href}">${href}</a></p>`);
    } else {
      setMediaError("That doesn't look like a link.");
    }
  }

  function insertLink() {
    const url = window.prompt("Link URL", "https://");
    if (url) exec("createLink", url);
  }

  const isEmpty = normalize(value) === "";
  const minHeight = `${Math.max(rows, 3) * 1.6}rem`;
  const inWrite = mode === "write";

  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
        <ToolbarButton label="Bold" disabled={!inWrite} onClick={() => exec("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" disabled={!inWrite} onClick={() => exec("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading" disabled={!inWrite} onClick={() => exec("formatBlock", "h2")}>
          <Heading className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bulleted list" disabled={!inWrite} onClick={() => exec("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" disabled={!inWrite} onClick={() => exec("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" disabled={!inWrite} onClick={insertLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        {allowMedia && (
          <>
            <span className="mx-1 h-4 w-px bg-border" aria-hidden />
            <ToolbarButton
              label="Add image"
              disabled={!inWrite || uploading !== null}
              onClick={() => {
                saveCaret();
                imageInputRef.current?.click();
              }}
            >
              {uploading === "image" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            </ToolbarButton>
            <ToolbarButton
              label="Add video"
              disabled={!inWrite || uploading !== null}
              onClick={() => {
                saveCaret();
                videoInputRef.current?.click();
              }}
            >
              {uploading === "video" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
            </ToolbarButton>
            <ToolbarButton label="Add a YouTube or Vimeo video" disabled={!inWrite || uploading !== null} onClick={insertVideoLink}>
              <MonitorPlay className="h-4 w-4" />
            </ToolbarButton>
            <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" data-no-draft onChange={(e) => handleMediaFile("image", e)} />
            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" data-no-draft onChange={(e) => handleMediaFile("video", e)} />
          </>
        )}

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "html" ? "write" : "html"))}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              mode === "html" ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            <Code className="h-3.5 w-3.5" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "preview" ? "write" : "preview"))}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              mode === "preview" ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            {mode === "preview" ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {mode === "preview" ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {mode === "preview" ? (
        <div className="px-3 py-2" style={{ minHeight }}>
          {value.trim() ? <RichText content={value} className={PROSE_CLASS} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
        </div>
      ) : mode === "html" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your HTML here…"
          spellCheck={false}
          className="w-full resize-y bg-transparent px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
          style={{ minHeight }}
        />
      ) : (
        <div className="relative">
          {isEmpty && placeholder && (
            <div className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">{placeholder}</div>
          )}
          <div
            id={id}
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={placeholder}
            onInput={syncFromEditor}
            onBlur={syncFromEditor}
            onPaste={handlePaste}
            className={cn(
              "px-3 py-2 text-sm leading-relaxed text-foreground focus:outline-none",
              "[&_h2]:text-base [&_h2]:font-semibold [&_h1]:text-lg [&_h1]:font-semibold",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
              "[&_a]:text-accent [&_a]:underline",
              "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-md [&_video]:my-2 [&_video]:max-w-full [&_video]:rounded-md [&_iframe]:my-2 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-md",
              className
            )}
            style={{ minHeight }}
          />
        </div>
      )}

      {mediaError && <p className="border-t border-border px-3 py-1.5 text-xs text-danger">{mediaError}</p>}
      <input ref={hiddenRef} type="hidden" name={name} value={value} />
    </div>
  );
}
