"use client";

import { useState } from "react";
import { ChevronDown, Copy, Check, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ageBandLabel } from "@/lib/school/lesson-types";

// What the writer was told, for a lesson that already exists.
//
// Staff only, and computed server-side so it never reaches anybody else's page
// payload. It is a debugging tool first: when a lesson comes out wrong, the
// question is almost always "what was it actually asked to do", and reading
// that from the source tree while holding a lesson in your head is slower than
// reading it beside the lesson.
//
// It shows two things because a generation has two inputs: the RULES (derived
// from the age band and whether it went beyond the source) and the MATERIAL
// (kept on the row since the beginning, so a lesson can be rewritten). Neither
// alone explains an output.
export function LessonRulesPanel({
  rules,
  sourceText,
  ageBand,
  beyondSource,
}: {
  rules: string;
  sourceText: string;
  ageBand: string;
  beyondSource: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"rules" | "source" | null>(null);

  async function copy(what: "rules" | "source", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // A blocked clipboard is not worth an error state — the text is on
      // screen and selectable either way.
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <FileCode2 className="h-3.5 w-3.5" />
        Source rules
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            What the writer was told when this lesson was made — reconstructed from
            its age band ({ageBandLabel(ageBand)})
            {beyondSource ? " and its go-deeper setting" : ""}.{" "}
            <span className="text-foreground">
              These are the rules as the app stands today.
            </span>{" "}
            If the prompt has changed since the lesson was written, this is what it
            would be written under now rather than what it was written under then.
          </p>

          <Block
            label="System prompt"
            text={rules}
            copied={copied === "rules"}
            onCopy={() => copy("rules", rules)}
          />

          {sourceText.trim() ? (
            <Block
              label={`Source material — ${sourceText.length.toLocaleString()} characters`}
              text={sourceText}
              copied={copied === "source"}
              onCopy={() => copy("source", sourceText)}
              // Long, and the rules are the thing being debugged nine times in
              // ten. Scrolls rather than pushing the lesson off the page.
              tall
            />
          ) : (
            <p className="text-xs text-muted-foreground">
              This lesson kept no source material, so it can&apos;t be rewritten or
              compared against one. Imported lessons are usually the reason.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Block({
  label,
  text,
  copied,
  onCopy,
  tall = false,
}: {
  label: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
  tall?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "mt-1.5 overflow-auto rounded-lg bg-muted/60 p-3 text-[11px] leading-relaxed text-foreground",
          // Wraps rather than scrolling sideways: these are sentences, and a
          // horizontal scrollbar on prose is unreadable.
          "whitespace-pre-wrap break-words",
          tall ? "max-h-72" : "max-h-96"
        )}
      >
        {text}
      </pre>
    </div>
  );
}
