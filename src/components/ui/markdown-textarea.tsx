"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Bold, Italic, Heading, List, ListOrdered, Link as LinkIcon, Eye, Pencil } from "lucide-react";
import { Textarea } from "./input";
import { RichText } from "./rich-text";
import { cn } from "@/lib/utils";

// A Textarea with a small formatting toolbar. The buttons wrap or prefix the
// current selection with Markdown syntax, and a Preview toggle renders the
// result with <RichText>, so members can lay out a long "About" description
// without knowing Markdown. The value is kept in React state and submitted via
// the `name` prop, so it drops into a plain <form action> the same way a bare
// Textarea does.

type Wrap = { before: string; after: string; placeholder: string };
type LinePrefix = { prefix: string; placeholder: string };

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children}
    </button>
  );
}

export function MarkdownTextarea({
  name,
  defaultValue = "",
  className,
  ...props
}: { name: string; defaultValue?: string } & Omit<ComponentProps<"textarea">, "name" | "defaultValue" | "value">) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Keep in step with a native form reset (e.g. the new-space form clears
  // itself after a successful submit) — controlled state won't otherwise.
  useEffect(() => {
    const form = hiddenRef.current?.form;
    if (!form) return;
    const onReset = () => setValue(defaultValue);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue]);

  // Replace the current selection and restore a sensible caret/selection.
  function applyReplacement(replacement: string, selectFrom: number, selectTo: number) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + replacement + value.slice(end);
    setValue(next);
    // Restore focus/selection after React re-renders.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectFrom, selectTo);
    });
  }

  function wrapSelection({ before, after, placeholder }: Wrap) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const replacement = before + selected + after;
    applyReplacement(replacement, start + before.length, start + before.length + selected.length);
  }

  function prefixLine({ prefix, placeholder }: LinePrefix) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    if (selected.includes("\n")) {
      // Prefix every selected line (turns a block into a list).
      const replacement = selected
        .split("\n")
        .map((line) => (line.trim() ? prefix + line : line))
        .join("\n");
      applyReplacement(replacement, start, start + replacement.length);
    } else {
      const text = selected || placeholder;
      const atLineStart = start === 0 || value[start - 1] === "\n";
      const replacement = (atLineStart ? "" : "\n") + prefix + text;
      applyReplacement(replacement, end + replacement.length - text.length, end + replacement.length - text.length + text.length);
    }
  }

  function insertLink() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "link text";
    const replacement = `[${selected}](https://)`;
    // Drop the caret inside the empty URL parens so they can paste it.
    const urlPos = start + replacement.length - 1;
    applyReplacement(replacement, urlPos, urlPos);
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
        <ToolbarButton label="Bold" onClick={() => wrapSelection({ before: "**", after: "**", placeholder: "bold text" })}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => wrapSelection({ before: "_", after: "_", placeholder: "italic text" })}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading" onClick={() => prefixLine({ prefix: "## ", placeholder: "Heading" })}>
          <Heading className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bulleted list" onClick={() => prefixLine({ prefix: "- ", placeholder: "List item" })}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => prefixLine({ prefix: "1. ", placeholder: "List item" })}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={insertLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="min-h-[6rem] px-3 py-2">
          {value.trim() ? (
            <RichText content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn("rounded-none border-0 bg-transparent focus:ring-0", className)}
          {...props}
        />
      )}

      {/* Always submit the raw markdown, even while previewing. */}
      <input ref={hiddenRef} type="hidden" name={name} value={value} />
      <p className="px-3 pb-2 text-xs text-muted-foreground">
        Formatting supported — use the buttons above, or type <span className="font-medium">**bold**</span>,{" "}
        <span className="font-medium">_italic_</span>, <span className="font-medium">## headings</span> and{" "}
        <span className="font-medium">- lists</span>. You can also paste custom{" "}
        <span className="font-medium">HTML</span> — including images, video and YouTube/Vimeo embeds, and a{" "}
        <span className="font-medium">&lt;style&gt;</span> block. Toggle Preview to check it.
      </p>
    </div>
  );
}
