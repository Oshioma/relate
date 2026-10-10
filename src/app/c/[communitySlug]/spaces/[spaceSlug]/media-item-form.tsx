"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SafeImage } from "@/components/ui/safe-image";
import { useFormDraftRef } from "@/lib/use-form-draft";
import {
  CONCERN_CATEGORIES,
  CONCERN_LEVELS,
  MEDIA_KINDS,
  MEDIA_VERDICTS,
  PROFANITY_LEVELS,
  MediaConcernSchema,
  type MediaItemRow,
} from "@/lib/media/media-types";
import type { MediaConcern } from "@/types/database";
import { createMediaItem, updateMediaItem, type MediaActionState } from "./books-media-actions";

// Adding (or editing) one item on the shelf.
//
// Paste a link, press "Review with AI", and every field below fills in from
// what Claude found — then the parent reads it, changes what they disagree
// with, and adds it. The model suggests; the person decides. Nothing reaches
// the database until "Add to shelf".
//
// The form is uncontrolled so the house draft rule applies (see
// src/lib/use-form-draft.ts): whatever is typed — or filled in by the review —
// survives a refresh, and is cleared once the item is added. The two bits
// that live in React state (the concern rows, and what the model said) are
// mirrored into hidden data-draft inputs so they come back too.

// What the review route answers with. Mirrors MediaAnalysis in
// src/lib/ai/analyse-media.ts, without importing a server-only module.
type Analysis = {
  url: string;
  kind: string;
  title: string;
  creator: string | null;
  description: string;
  image_url: string | null;
  age_min: number | null;
  age_max: number | null;
  verdict: string;
  reason: string | null;
  profanity: string;
  concerns: MediaConcern[];
  themes: string[];
  summary_for_parents: string;
  confidence: "low" | "medium" | "high";
  sources: string[];
};

type AiMeta = {
  analysis: Analysis;
  usage: { model: string; inputTokens: number; outputTokens: number };
};

const SELECT_CLASS =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function fill(form: HTMLFormElement, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
      el.value = value;
    }
  }
}

function parseConcerns(raw: unknown): MediaConcern[] {
  let value: unknown = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.flatMap((c) => {
    const parsed = MediaConcernSchema.safeParse(c);
    return parsed.success ? [parsed.data] : [];
  });
}

function parseAiMeta(raw: unknown): AiMeta | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const value = JSON.parse(raw) as AiMeta;
    return value && typeof value === "object" && value.analysis && value.usage ? value : null;
  } catch {
    return null;
  }
}

export function MediaItemForm({
  communitySlug,
  spaceId,
  spaceSlug,
  item,
  aiConfigured,
  onDone,
  onCancel,
}: {
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  // Present when editing an existing item; absent when adding.
  item?: MediaItemRow;
  aiConfigured: boolean;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [concerns, setConcerns] = useState<MediaConcern[]>(item?.concerns ?? []);
  const [imageUrl, setImageUrl] = useState<string>(item?.image_url ?? "");
  const [aiMeta, setAiMeta] = useState<AiMeta | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const draftKey = item ? `media-item:${item.id}` : `media-item:new:${spaceId}`;
  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.concerns === "string") setConcerns(parseConcerns(values.concerns));
    if (typeof values.image_url === "string") setImageUrl(values.image_url);
    if (typeof values.ai_meta === "string") setAiMeta(parseAiMeta(values.ai_meta));
  }, []);
  const { clear, saveNow } = useFormDraftRef(formRef, draftKey, { onRestore });

  // The React-held parts change their hidden inputs without firing an event,
  // so they are saved by hand once the new values have rendered.
  useEffect(() => {
    saveNow();
  }, [concerns, imageUrl, aiMeta, saveNow]);

  async function analyse() {
    const form = formRef.current;
    if (!form) return;
    const url = (form.elements.namedItem("url") as HTMLInputElement | null)?.value.trim() ?? "";
    if (!url) {
      setError("Paste a link first.");
      return;
    }
    setError(null);
    setNotice(null);
    setAnalysing(true);
    try {
      const response = await fetch("/api/media/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, url }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; analysis?: Analysis; usage?: AiMeta["usage"] };
      if (!response.ok || !body.analysis || !body.usage) {
        setError(body.error ?? "Couldn't get a review just now.");
        return;
      }
      const a = body.analysis;
      fill(form, {
        url: a.url,
        kind: a.kind,
        title: a.title,
        creator: a.creator ?? "",
        description: a.description,
        age_min: a.age_min == null ? "" : String(a.age_min),
        age_max: a.age_max == null ? "" : String(a.age_max),
        verdict: a.verdict,
        reason: a.reason ?? "",
        profanity: a.profanity,
        themes: a.themes.join(", "),
      });
      setConcerns(a.concerns);
      setImageUrl(a.image_url ?? "");
      setAiMeta({ analysis: a, usage: body.usage });
      setNotice(
        a.confidence === "high"
          ? "Filled in from several sources that agree. Check it over, then add it."
          : a.confidence === "medium"
            ? "Filled in from what could be found. Worth a read-through before adding."
            : "Not much was found beyond the page itself — treat these as a starting point and check the gaps."
      );
    } catch {
      setError("Couldn't reach the reviewer just now.");
    } finally {
      setAnalysing(false);
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result: MediaActionState = item ? await updateMediaItem(undefined, formData) : await createMediaItem(undefined, formData);
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      clear();
      formRef.current?.reset();
      setConcerns([]);
      setImageUrl("");
      setAiMeta(null);
      setNotice(null);
      onDone?.();
    });
  }

  function updateConcern(index: number, patch: Partial<MediaConcern>) {
    setConcerns((list) => list.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  const busy = analysing || isPending;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      {item && <input type="hidden" name="item_id" value={item.id} />}
      <input type="hidden" name="concerns" value={JSON.stringify(concerns)} data-draft />
      <input type="hidden" name="image_url" value={imageUrl} data-draft />
      <input type="hidden" name="ai_meta" value={aiMeta ? JSON.stringify(aiMeta) : ""} data-draft />
      <input type="hidden" name="ai_analysis" value={aiMeta ? JSON.stringify(aiMeta.analysis) : ""} />
      <input type="hidden" name="ai_model" value={aiMeta?.usage.model ?? ""} />
      <input type="hidden" name="ai_input_tokens" value={aiMeta ? String(aiMeta.usage.inputTokens) : ""} />
      <input type="hidden" name="ai_output_tokens" value={aiMeta ? String(aiMeta.usage.outputTokens) : ""} />

      <div>
        <Label htmlFor="media_url">Link to the book, video or show</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="media_url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=…  or a book's page"
            defaultValue={item?.url ?? ""}
            required
            disabled={busy}
          />
          {aiConfigured && (
            <Button type="button" variant="secondary" onClick={analyse} disabled={busy} className="w-auto shrink-0">
              {analysing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {analysing ? "Reviewing…" : "Review with AI"}
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {aiConfigured
            ? "The review reads the page and searches for ratings and parent guides, then fills in everything below for you to check. It can take up to a minute."
            : "Fill in the details below."}
        </p>
      </div>

      {notice && <p className="rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">{notice}</p>}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="media_title">Title</Label>
              <Input id="media_title" name="title" defaultValue={item?.title ?? ""} required maxLength={200} disabled={busy} />
            </div>
            <div>
              <Label htmlFor="media_creator">Author, channel or maker</Label>
              <Input id="media_creator" name="creator" defaultValue={item?.creator ?? ""} maxLength={200} disabled={busy} />
            </div>
            <div>
              <Label htmlFor="media_kind">What is it?</Label>
              <select id="media_kind" name="kind" defaultValue={item?.kind ?? "book"} className={SELECT_CLASS} disabled={busy}>
                {MEDIA_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {imageUrl && (
          <div className="flex flex-col items-center gap-1">
            <SafeImage srcs={[imageUrl]} alt="" className="h-28 w-20 rounded-md object-cover" fallback={null} />
            <button type="button" onClick={() => setImageUrl("")} className="text-xs text-muted-foreground hover:text-danger" disabled={busy}>
              Remove picture
            </button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="media_description">What it&apos;s about</Label>
        <Textarea id="media_description" name="description" rows={3} defaultValue={item?.description ?? ""} maxLength={2000} disabled={busy} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="media_age_min">Suggested from age</Label>
          <Input id="media_age_min" name="age_min" type="number" min={0} max={21} defaultValue={item?.age_min ?? ""} disabled={busy} />
        </div>
        <div>
          <Label htmlFor="media_age_max">Up to age</Label>
          <Input id="media_age_max" name="age_max" type="number" min={0} max={21} defaultValue={item?.age_max ?? ""} disabled={busy} />
        </div>
        <div>
          <Label htmlFor="media_profanity">Bad language</Label>
          <select id="media_profanity" name="profanity" defaultValue={item?.profanity ?? "unknown"} className={SELECT_CLASS} disabled={busy}>
            {PROFANITY_LEVELS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="media_verdict">Our verdict</Label>
          <select id="media_verdict" name="verdict" defaultValue={item?.verdict ?? "suitable"} className={SELECT_CLASS} disabled={busy}>
            {MEDIA_VERDICTS.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">Not suitable goes on its own shelf, with the reason beside it.</p>
        </div>
        <div>
          <Label htmlFor="media_reason">Why? (needed unless it&apos;s simply good)</Label>
          <Textarea id="media_reason" name="reason" rows={2} defaultValue={item?.reason ?? ""} maxLength={1000} disabled={busy} />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label className="mb-0">Things a parent should know</Label>
          <button
            type="button"
            onClick={() => setConcerns((list) => [...list, { category: "other", level: "mild", note: "" }])}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline disabled:opacity-60"
            disabled={busy}
          >
            <Plus className="h-3.5 w-3.5" /> Add a note
          </button>
        </div>
        {concerns.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nothing noted yet. The AI review fills these in; you can add your own.</p>
        ) : (
          <div className="space-y-2">
            {concerns.map((c, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[11rem_7rem_1fr_auto]">
                <select
                  aria-label="Category"
                  value={c.category}
                  onChange={(e) => updateConcern(index, { category: e.target.value })}
                  className={SELECT_CLASS}
                  disabled={busy}
                  data-no-draft
                >
                  {CONCERN_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                  {!CONCERN_CATEGORIES.some((cat) => cat.key === c.category) && <option value={c.category}>{c.category}</option>}
                </select>
                <select
                  aria-label="How much"
                  value={c.level}
                  onChange={(e) => updateConcern(index, { level: e.target.value as MediaConcern["level"] })}
                  className={SELECT_CLASS}
                  disabled={busy}
                  data-no-draft
                >
                  {CONCERN_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <Input
                  aria-label="Note"
                  value={c.note}
                  onChange={(e) => updateConcern(index, { note: e.target.value })}
                  placeholder="What, specifically"
                  maxLength={400}
                  disabled={busy}
                  data-no-draft
                />
                <button
                  type="button"
                  aria-label="Remove note"
                  onClick={() => setConcerns((list) => list.filter((_, i) => i !== index))}
                  className="self-center text-muted-foreground hover:text-danger disabled:opacity-60"
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="media_themes">What&apos;s good about it (comma-separated)</Label>
        <Input id="media_themes" name="themes" defaultValue={item?.themes.join(", ") ?? ""} placeholder="friendship, nature, problem-solving" disabled={busy} />
      </div>

      {aiMeta && (
        <details className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">What the review said, in full</summary>
          <p className="mt-2 text-muted-foreground">{aiMeta.analysis.summary_for_parents}</p>
          {aiMeta.analysis.sources.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {aiMeta.analysis.sources.map((s) => (
                <li key={s} className="truncate">
                  <a href={s} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </details>
      )}

      <label className="flex items-start gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="share_with_other_communities"
          value="1"
          defaultChecked={item?.share_with_other_communities ?? true}
          className="mt-0.5 h-4 w-4 rounded border-border"
          disabled={busy}
        />
        <span>
          Share this review with other homeschool communities
          <span className="block text-xs text-muted-foreground">They see the review and your community&apos;s name, never who added it.</span>
        </span>
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={busy} className="w-auto">
          {isPending ? "Saving…" : item ? "Save changes" : "Add to shelf"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy} className="w-auto">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
