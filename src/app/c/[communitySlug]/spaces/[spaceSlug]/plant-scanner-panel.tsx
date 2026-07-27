"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ScanLine, Loader2, ArrowRight, CheckCircle2, Bug, AlertTriangle, Info, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { scanPlantAction, type PlantScanState } from "./crop-guides-actions";
import { shrinkImageForUpload, type PreparedImage } from "@/lib/image-resize";
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

// Mirrors PlantIdPanel: a public Plant Scanner space works for signed-out
// visitors too, so the photo is shrunk in the browser and posted straight to
// the server action (which forwards it to the model and stores nothing) rather
// than uploaded to the members-only 'uploads' bucket.
export function PlantScannerPanel({
  communitySlug,
  cropGuidesSpaceSlug,
}: {
  communitySlug: string;
  // The community's Crop Guides space to deep-link a matched crop into, or null
  // when there's no such space to link to.
  cropGuidesSpaceSlug: string | null;
}) {
  const [state, formAction, isPending] = useActionState<PlantScanState, FormData>(scanPlantAction, undefined);
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (prepared) URL.revokeObjectURL(prepared.url);
    };
  }, [prepared]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setIsProcessing(true);
    const next = await shrinkImageForUpload(file);
    setPrepared((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return next;
    });
    setIsProcessing(false);
  }

  function diagnose() {
    if (!prepared) return;
    const formData = new FormData();
    formData.set("community_slug", communitySlug);
    formData.set("image", prepared.blob, prepared.filename);
    formAction(formData);
  }

  const result = state?.result;
  const busy = isProcessing || isPending;

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
          {prepared ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prepared.url} alt="Plant to diagnose" className="aspect-square w-full rounded-md border border-border object-cover" />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-border bg-muted">
              <ScanLine className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              {prepared ? "Change photo" : "Upload photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        <div className="flex-1">
          <Button type="button" size="sm" className="w-auto" disabled={!prepared || busy} onClick={diagnose}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
            {isProcessing ? "Preparing…" : isPending ? "Analysing…" : "Diagnose"}
          </Button>

          {state?.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}

          {result && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Likely crop:</span>
                <span className="text-sm font-medium text-foreground">{result.crop_guess ?? "Not sure"}</span>
                {result.crop_guess && <Badge tone={confidenceTone(result.crop_confidence)}>{result.crop_confidence} confidence</Badge>}
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
        </div>
      </div>
    </section>
  );
}
