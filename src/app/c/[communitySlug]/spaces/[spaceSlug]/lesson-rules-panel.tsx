"use client";

import { useState } from "react";
import { ChevronDown, Copy, Check, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ageBandLabel } from "@/lib/school/lesson-types";

// Where a lesson came from: the rules the writer was given, and the material
// it was given them for.
//
// A generation has two inputs and neither alone explains an output, so staff
// get both. It is a debugging tool first: when a lesson comes out wrong the
// question is almost always "what was it actually asked to do", and reading
// that from the source tree while holding a lesson in your head is slower than
// reading it beside the lesson.
//
// The two halves are not equally private, so they are separately gated. The
// MATERIAL is the author's to publish — a community showing its working is a
// good thing — and when they do, this panel appears for everyone who can see
// the lesson, showing the material alone. The RULES stay staff-only: they are
// the app's own workings, not the lesson's, and they are computed server-side
// only for staff, so for anybody else they are absent from the page payload
// rather than hidden in it.
export function LessonRulesPanel({
  rules,
  rulesAreOriginal,
  sourceText,
  ageBand,
  beyondSource,
}: {
  // Null for everyone who isn't staff. The panel then shows the material only,
  // and calls itself by what it holds.
  rules: string | null;
  // True when this is the prompt AS SENT, recorded on the row at generation
  // time. False when it had to be rebuilt from the age band, which is the case
  // for every lesson written before prompt_used existed. The difference is
  // stated on screen rather than left for somebody to discover.
  rulesAreOriginal: boolean;
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
        {rules ? "Source rules" : "Source material"}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {!rules ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="text-foreground">What this lesson was built from.</span>{" "}
              Published by whoever wrote it, so you can hold the lesson against
              its material and see what was used.
            </p>
          ) : rulesAreOriginal ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="text-foreground">
                The exact prompt this lesson was written under,
              </span>{" "}
              recorded when it was made. Age band {ageBandLabel(ageBand)}
              {beyondSource ? ", written past its source" : ""}. It stays as it is
              even if the prompt changes later.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="text-foreground">Rebuilt, not recorded.</span> This
              lesson predates lessons keeping a copy of their own prompt, so this is
              what its age band ({ageBandLabel(ageBand)}
              {beyondSource ? ", written past its source" : ""}) would produce{" "}
              <em>today</em> — useful for &quot;what would happen if I ran it
              again&quot;, and not proof of what it was written under then.
            </p>
          )}

          {rules && (
            <Block
              label={rulesAreOriginal ? "System prompt (as sent)" : "System prompt (rebuilt)"}
              text={rules}
              copied={copied === "rules"}
              onCopy={() => copy("rules", rules)}
            />
          )}

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
