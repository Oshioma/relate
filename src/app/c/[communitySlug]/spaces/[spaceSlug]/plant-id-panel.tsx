"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, Loader2, ArrowRight, Info, Utensils, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { identifyPlantAction, type PlantIdState } from "./crop-guides-actions";
import type { IdConfidence } from "@/lib/ai/plant-id";

function confidenceTone(c: IdConfidence): "accent" | "neutral" | "danger" {
  if (c === "high") return "accent";
  if (c === "low") return "danger";
  return "neutral";
}

// A Plant ID space can be public, so this panel works for signed-out visitors
// too. The photo is submitted straight to the server action (which forwards it
// to the model and stores nothing) rather than uploaded to the members-only
// 'uploads' bucket — the preview is a local object URL, never a stored file.
export function PlantIdPanel({ communitySlug, cropGuidesSpaceSlug }: { communitySlug: string; cropGuidesSpaceSlug: string | null }) {
  const [state, formAction, isPending] = useActionState<PlantIdState, FormData>(identifyPlantAction, undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Free the object URL when it changes or the panel unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setHasFile(Boolean(file));
  }

  const result = state?.result;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Camera className="h-4 w-4 text-accent" />
        Plant ID
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Upload a photo and the assistant will identify the plant, note whether it&apos;s edible, and link to its guide.</p>

      <form action={formAction} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <input type="hidden" name="community_slug" value={communitySlug} />

        <div className="sm:w-56">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Plant to identify" className="aspect-square w-full rounded-md border border-border object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-border bg-muted">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              {hasFile ? "Change photo" : "Upload photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        <div className="flex-1">
          <Button type="submit" size="sm" className="w-auto" disabled={!hasFile || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {isPending ? "Identifying…" : "Identify"}
          </Button>

          {state?.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}

          {result && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-foreground">{result.common_name ?? "Not sure"}</span>
                {result.common_name && <Badge tone={confidenceTone(result.confidence)}>{result.confidence} confidence</Badge>}
                {result.category && <Badge tone="neutral">{result.category}</Badge>}
                {state?.matchedSlug && cropGuidesSpaceSlug && (
                  <Link
                    href={`/c/${communitySlug}/spaces/${cropGuidesSpaceSlug}/crop-guides/${state.matchedSlug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    Open {state.matchedName} guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
              {result.scientific_name && <p className="text-sm italic text-muted-foreground">{result.scientific_name}</p>}
              {result.description && <p className="text-sm text-foreground">{result.description}</p>}
              {result.edible && (
                <p className="flex items-start gap-1.5 rounded-md bg-accent-soft p-3 text-sm text-foreground">
                  <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {result.edible}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                AI estimate from one photo — never eat a wild plant on an ID alone.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
