"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { updateCommunityTestimonials, type CommunityTestimonialsState } from "./actions";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { MAX_TESTIMONIALS, MAX_TESTIMONIAL_NAME, MAX_TESTIMONIAL_QUOTE, readTestimonials } from "@/lib/testimonials";
import type { Community, CommunityTestimonial } from "@/types/database";

// The quotes from members on the signed-out landing page. The rows live in
// React state and travel as one JSON hidden input, which is also what the
// draft saves — so added, removed and reordered rows survive a refresh too.
export function CommunityTestimonialsForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityTestimonialsState, FormData>(updateCommunityTestimonials, undefined);
  const [rows, setRows] = useState<CommunityTestimonial[]>(() => readTestimonials(community.testimonials));
  const formRef = useRef<HTMLFormElement>(null);
  // Only save a draft once the admin has changed something, so an untouched
  // form never pins an old copy over a newer save.
  const touched = useRef(false);

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    const raw = values.testimonials;
    if (typeof raw !== "string") return;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setRows(
        parsed.map((t) => ({
          quote: typeof t?.quote === "string" ? t.quote : "",
          name: typeof t?.name === "string" ? t.name : "",
        }))
      );
    } catch {
      // A broken draft: keep what's saved.
    }
  }, []);
  const { clear: clearDraft, saveNow } = useFormDraftRef(formRef, `community-testimonials:${community.id}`, { onRestore });

  useEffect(() => {
    if (touched.current) saveNow();
  }, [rows, saveNow]);

  useEffect(() => {
    if (state && "ok" in state) {
      touched.current = false;
      clearDraft();
    }
  }, [state, clearDraft]);

  function change(next: CommunityTestimonial[]) {
    touched.current = true;
    setRows(next);
  }
  function update(i: number, patch: Partial<CommunityTestimonial>) {
    change(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }
  function move(i: number, by: -1 | 1) {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />
      <input type="hidden" name="testimonials" value={JSON.stringify(rows)} data-draft />

      <p className="text-sm text-muted-foreground">
        Quotes from members, shown on the page visitors see before they sign in. Leave the list empty to hide the
        section.
      </p>

      {rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <div>
            <Label htmlFor={`testimonial_quote_${i}`}>Testimonial {i + 1}</Label>
            <Textarea
              id={`testimonial_quote_${i}`}
              rows={4}
              maxLength={MAX_TESTIMONIAL_QUOTE}
              value={row.quote}
              onChange={(e) => update(i, { quote: e.target.value })}
              placeholder="What they said, in their own words"
            />
          </div>
          <div>
            <Label htmlFor={`testimonial_name_${i}`}>Name</Label>
            <Input
              id={`testimonial_name_${i}`}
              maxLength={MAX_TESTIMONIAL_NAME}
              value={row.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Tanya"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
              Up
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4" />
              Down
            </button>
            <button
              type="button"
              onClick={() => change(rows.filter((_, j) => j !== i))}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-danger hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ))}

      {rows.length < MAX_TESTIMONIALS && (
        <button
          type="button"
          onClick={() => change([...rows, { quote: "", name: "" }])}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Add a testimonial
        </button>
      )}

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save testimonials
      </SubmitButton>
    </form>
  );
}
