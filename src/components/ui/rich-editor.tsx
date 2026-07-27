"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Heading, List, ListOrdered, Link as LinkIcon, Code, Eye, Pencil } from "lucide-react";
import { RichText } from "./rich-text";
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
}) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>("write");
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

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

  function syncFromEditor() {
    if (editorRef.current) setValue(normalize(editorRef.current.innerHTML));
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncFromEditor();
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
          {value.trim() ? <RichText content={value} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
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
            className={cn(
              "px-3 py-2 text-sm leading-relaxed text-foreground focus:outline-none",
              "[&_h2]:text-base [&_h2]:font-semibold [&_h1]:text-lg [&_h1]:font-semibold",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
              "[&_a]:text-accent [&_a]:underline",
              className
            )}
            style={{ minHeight }}
          />
        </div>
      )}

      <input ref={hiddenRef} type="hidden" name={name} value={value} />
      <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
        Select text and use the buttons to format it — bold, italic, headings and lists, no symbols needed. Or switch to{" "}
        <span className="font-medium">HTML</span> to paste your own markup (images, video, embeds), then{" "}
        <span className="font-medium">Preview</span> to see the page.
      </p>
    </div>
  );
}
