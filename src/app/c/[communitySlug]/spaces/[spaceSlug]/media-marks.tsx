"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import { doneVerb, familiesLine, type MediaMarks } from "@/lib/media/media-types";
import type { MediaKind } from "@/types/database";
import { setMediaMark } from "./books-media-actions";

// A family's tick and note on an item, in two pieces that sit in different
// places on the card: the tick and the "3 families have read it" line go in
// the card's bottom row; the note editor and other families' notes go in the
// open panel beneath.

export function MarkToggle({
  itemId,
  kind,
  marks,
  canMark,
  communitySlug,
  spaceSlug,
}: {
  itemId: string;
  kind: MediaKind;
  marks: MediaMarks;
  canMark: boolean;
  communitySlug: string;
  spaceSlug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const verb = doneVerb(kind);
  const done = marks.mine?.done ?? false;
  const line = familiesLine(marks.doneCount, verb.past);

  function toggle() {
    start(async () => {
      const result = await setMediaMark(itemId, { done: !done, note: marks.mine?.note ?? "" }, communitySlug, spaceSlug);
      if (!result.error) router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      {canMark && (
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={done}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-60",
            done ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
          )}
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          {done ? verb.done : verb.notDone}
        </button>
      )}
      {line && <span>{line}</span>}
    </span>
  );
}

export function FamilyNotes({
  itemId,
  kind,
  marks,
  canMark,
  communitySlug,
  spaceSlug,
}: {
  itemId: string;
  kind: MediaKind;
  marks: MediaMarks;
  canMark: boolean;
  communitySlug: string;
  spaceSlug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [note, setNote] = useState(marks.mine?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const verb = doneVerb(kind);
  const saved = marks.mine?.note ?? "";
  const others = marks.notes.filter((n) => n.note);

  function save() {
    setError(null);
    start(async () => {
      const result = await setMediaMark(itemId, { done: marks.mine?.done ?? false, note }, communitySlug, spaceSlug);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  if (!canMark && others.length === 0) return null;

  return (
    <section>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What families here thought</h4>
      {others.length > 0 ? (
        <ul className="mt-1.5 space-y-2">
          {others.map((n) => (
            <li key={n.userId} className="flex items-start gap-2">
              <Avatar src={n.avatarUrl} name={n.name} size={20} />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{n.note}</p>
                <p className="text-xs text-muted-foreground">
                  {n.name ?? "A family"}
                  {n.done && ` · ${verb.past} it`} · {formatRelativeTime(n.updatedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted-foreground">No notes yet.</p>
      )}
      {canMark && (
        <div className="mt-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={600}
            placeholder="Your family's note — who liked it, who didn't, and why"
            aria-label="Your family's note"
            disabled={pending}
            data-no-draft
          />
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
          {note.trim() !== saved.trim() && (
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" size="sm" onClick={save} disabled={pending} className="w-auto">
                {pending ? "Saving…" : "Save note"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setNote(saved)} disabled={pending} className="w-auto">
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
