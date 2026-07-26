"use client";

import { useActionState, useState } from "react";
import { ScanLine, Loader2, ArrowRight, CheckCircle2, Bug, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/components/ui/upload-button";
import { scanPlantAction, type PlantScanState } from "./crop-guides-actions";
import type { ScanConfidence, ScanFindingType } from "@/lib/ai/plant-scanner";

const TYPE_LABEL: Record<ScanFindingType, string> = {
  pest: "Pest",
  disease: "Disease",
  deficiency: "Nutrient deficiency",
  environmental: "Environmental stress",
};

function confidenceTone(c: ScanConfidence): "accent" | "neutral" | "danger" {
  if (c === "high") return "accent";
  if (c === "low") return "danger";
  return "neutral";
}

export function PlantScannerPanel({ communitySlug, spaceSlug }: { communitySlug: string; spaceSlug: string }) {
  const [state, formAction, isPending] = useActionState<PlantScanState, FormData>(scanPlantAction, undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const shownImage = imageUrl ?? state?.imageUrl ?? null;
  const result = state?.result;

  return (
    <section className="mb-5 rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <ScanLine className="h-4 w-4 text-accent" />
        Plant health scanner
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a photo of a plant and the assistant will identify it and diagnose likely pests, diseases, deficiencies or stress — with organic treatment.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="sm:w-56">
          {shownImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownImage} alt="Plant to diagnose" className="aspect-square w-full rounded-md border border-border object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-border bg-muted">
              <ScanLine className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <UploadButton kind="image" label={shownImage ? "Change photo" : "Upload photo"} onUploaded={(url) => setImageUrl(url)} />
          </div>
        </div>

        <form action={formAction} className="flex-1">
          <input type="hidden" name="image_url" value={shownImage ?? ""} />
          <Button type="submit" size="sm" className="w-auto" disabled={!shownImage || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
            {isPending ? "Analysing…" : "Diagnose"}
          </Button>

          {state?.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}

          {result && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Likely crop:</span>
                <span className="text-sm font-medium text-foreground">{result.crop_guess ?? "Not sure"}</span>
                {result.crop_guess && <Badge tone={confidenceTone(result.crop_confidence)}>{result.crop_confidence} confidence</Badge>}
                {state?.matchedSlug && (
                  <Link
                    href={`/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${state.matchedSlug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    Open {state.matchedName} guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {result.summary && <p className="text-sm text-foreground">{result.summary}</p>}

              {result.healthy ? (
                <p className="flex items-center gap-1.5 rounded-md bg-accent-soft p-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Looks healthy — no obvious problems detected.
                </p>
              ) : (
                <ul className="space-y-2">
                  {result.findings.map((f, i) => (
                    <li key={i} className="rounded-md border border-border p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {f.type === "pest" ? <Bug className="h-3.5 w-3.5 text-muted-foreground" /> : <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-sm font-semibold text-foreground">{f.name}</span>
                        <Badge tone="neutral">{TYPE_LABEL[f.type]}</Badge>
                        <Badge tone={confidenceTone(f.confidence)}>{f.confidence}</Badge>
                      </div>
                      {f.organic_treatment && (
                        <p className="mt-2 text-sm text-foreground">
                          <span className="font-medium">Organic treatment:</span> {f.organic_treatment}
                        </p>
                      )}
                      {f.prevention && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium">Prevention:</span> {f.prevention}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                AI estimate from one photo — confirm before treating.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
