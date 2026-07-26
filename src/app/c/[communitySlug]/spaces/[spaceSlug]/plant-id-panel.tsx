"use client";

import { useActionState, useState } from "react";
import { Camera, Loader2, ArrowRight, Info, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/components/ui/upload-button";
import { identifyPlantAction, type PlantIdState } from "./crop-guides-actions";
import type { IdConfidence } from "@/lib/ai/plant-id";

function confidenceTone(c: IdConfidence): "accent" | "neutral" | "danger" {
  if (c === "high") return "accent";
  if (c === "low") return "danger";
  return "neutral";
}

export function PlantIdPanel({ communitySlug, cropGuidesSpaceSlug }: { communitySlug: string; cropGuidesSpaceSlug: string | null }) {
  const [state, formAction, isPending] = useActionState<PlantIdState, FormData>(identifyPlantAction, undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const shownImage = imageUrl ?? state?.imageUrl ?? null;
  const result = state?.result;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Camera className="h-4 w-4 text-accent" />
        Plant ID
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Upload a photo and the assistant will identify the plant, note whether it&apos;s edible, and link to its guide.</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="sm:w-56">
          {shownImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownImage} alt="Plant to identify" className="aspect-square w-full rounded-md border border-border object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-border bg-muted">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <UploadButton kind="image" label={shownImage ? "Change photo" : "Upload photo"} onUploaded={(url) => setImageUrl(url)} />
          </div>
        </div>

        <form action={formAction} className="flex-1">
          <input type="hidden" name="image_url" value={shownImage ?? ""} />
          <Button type="submit" size="sm" className="w-auto" disabled={!shownImage || isPending}>
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
        </form>
      </div>
    </section>
  );
}
