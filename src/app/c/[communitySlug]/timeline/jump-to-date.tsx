"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { CalendarSearch } from "lucide-react";
import { parseJumpDate } from "@/lib/timeline/jump-date";
import { cn } from "@/lib/utils";

// JUMP TO DATE.
//
// The direct route to a moment, for the reader who knows where they want to
// be and should not have to drag there from wherever the strip happens to be.
// All the reading of what was typed lives in jump-date.ts; this is only the
// box, the button and the sentence that says what went wrong.
//
// THE DRAFT SURVIVES A REFRESH. What is typed is kept in sessionStorage until
// it is submitted, so a reload mid-typing does not lose it — the rule every
// form in this app should follow. It is a date, nothing sensitive, and
// sessionStorage ends with the tab.

// sessionStorage, read as an external store: "" on the server (which has no
// storage) and during hydration, the saved draft afterwards. Nothing else in
// the tab writes this key, so there is nothing to subscribe to.
const noSubscription = () => () => {};

function readDraft(key: string): string {
  try {
    return window.sessionStorage.getItem(key) ?? "";
  } catch {
    // Storage blocked (private mode, a sandboxed frame): the box simply
    // starts empty.
    return "";
  }
}

export function JumpToDate({
  communitySlug,
  onJump,
  className,
}: {
  communitySlug: string;
  onJump: (position: number) => void;
  className?: string;
}) {
  const draftKey = `timeline-jump-draft:${communitySlug}`;
  const inputId = useId();
  const errorId = useId();
  const savedDraft = useSyncExternalStore(noSubscription, () => readDraft(draftKey), () => "");
  // What the reader has typed this visit; until they type, the saved draft.
  const [typed, setTyped] = useState<string | null>(null);
  const text = typed ?? savedDraft;
  const [error, setError] = useState<string | null>(null);

  function update(next: string) {
    setTyped(next);
    setError(null);
    try {
      if (next) window.sessionStorage.setItem(draftKey, next);
      else window.sessionStorage.removeItem(draftKey);
    } catch {
      // As above: no draft, but the box still works.
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseJumpDate(text);
    if (!parsed.ok) {
      setError(parsed.reason);
      return;
    }
    onJump(parsed.position);
    // Submitted, so the draft has done its job.
    update("");
  }

  return (
    <form onSubmit={submit} className={cn("relative", className)} role="search" aria-label="Jump to a date">
      <div className="flex items-center gap-1 rounded-full bg-muted p-0.5">
        <label htmlFor={inputId} className="flex items-center gap-1.5 pl-2.5 text-xs font-medium text-muted-foreground">
          <CalendarSearch className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Jump to</span>
        </label>
        <input
          id={inputId}
          value={text}
          onChange={(event) => update(event.target.value)}
          placeholder="10,500 BCE"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-32 rounded-full bg-card px-3 py-1.5 text-sm text-foreground tabular-nums placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go
        </button>
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="absolute left-0 top-full z-30 mt-1 w-72 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground shadow-md"
        >
          {error}
        </p>
      )}
    </form>
  );
}
