"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { importSourceFromLink } from "./actions";
import type { LinkedSource } from "@/lib/timeline/source-link";

// "Paste a link and we'll fill this in."
//
// One component for both places that offer it — step 1 of the add flow, where
// it fills the event and its source together, and the source panel, where it
// fills just the source. What it fills is the caller's business; waiting for
// the page, and being honest about that wait, is this component's.
//
// THE WAIT IS THE HARD PART. Most pages answer in under a second, but a site
// that is slow-walking a server-side request will take the full timeout, and
// eight seconds of spinner with no way out feels broken. So: after three
// seconds it says it is still going and offers to stop, and stopping abandons
// the answer rather than cancelling anything — a late reply for a read somebody
// gave up on must never leap in and overwrite what they have since typed.

const SLOW_AFTER_MS = 3_000;

export function LinkFillBox({
  communitySlug,
  label,
  placeholder = "A YouTube video, a Wikipedia article, a news story, a paper…",
  hint,
  onFilled,
}: {
  communitySlug: string;
  label: string;
  placeholder?: string;
  hint: string;
  /** Returns the human-readable list of what it managed to fill. */
  onFilled: (source: LinkedSource) => string[];
}) {
  const [link, setLink] = useState("");
  const [reading, setReading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[] | null>(null);

  // Bumped on every new read and on skip. A response whose token no longer
  // matches is dropped on the floor.
  const token = useRef(0);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (slowTimer.current) clearTimeout(slowTimer.current);
  }, []);

  function stopWaiting() {
    token.current += 1;
    setReading(false);
    setSlow(false);
    if (slowTimer.current) clearTimeout(slowTimer.current);
  }

  async function run() {
    const trimmed = link.trim();
    if (!trimmed) return;

    const mine = ++token.current;
    setReading(true);
    setSlow(false);
    setError(null);
    setFilled(null);
    slowTimer.current = setTimeout(() => {
      if (token.current === mine) setSlow(true);
    }, SLOW_AFTER_MS);

    const result = await importSourceFromLink(communitySlug, trimmed);

    if (token.current !== mine) return;
    if (slowTimer.current) clearTimeout(slowTimer.current);
    setReading(false);
    setSlow(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setFilled(onFilled(result.source));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        <Input
          aria-label={label}
          value={link}
          onChange={(event) => setLink(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void run();
            }
          }}
          placeholder={placeholder}
          className="min-w-[16rem] flex-1"
        />
        {reading ? (
          <Button type="button" variant="ghost" onClick={stopWaiting}>
            <Loader2 className="h-4 w-4 animate-spin" /> Stop waiting
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={() => void run()} disabled={!link.trim()}>
            <Link2 className="h-4 w-4" /> Fill in
          </Button>
        )}
      </div>

      {slow && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          This page is being slow. Carry on filling the form in yourself — it won&apos;t overwrite anything you type.
        </p>
      )}
      {filled && (
        <p className="mt-1.5 text-xs text-accent">
          Filled in {filled.join(", ")}. Check it over and correct anything the page got wrong.
        </p>
      )}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      {!reading && !filled && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
