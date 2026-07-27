"use client";

import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { aiFindCropImage, aiGenerateCropImage } from "./crop-guides-actions";

// "Find photo" (web) and "Generate" (image model) buttons shared by the
// super-admin editor and the propose-a-crop form. Each produces a hosted image
// URL and hands it back via onImage; the caller decides what to do with it
// (persist to the crop, or drop it into the proposal's photo field).
export function CropImageAiButtons({
  commonName,
  scientificName,
  category,
  ediblePart,
  generateEnabled,
  onImage,
}: {
  commonName: string;
  scientificName?: string | null;
  category?: string | null;
  ediblePart?: string | null;
  generateEnabled: boolean;
  onImage: (url: string) => void | Promise<void>;
}) {
  const [busy, setBusy] = useState<null | "find" | "generate">(null);
  const [error, setError] = useState<string | null>(null);
  const [credit, setCredit] = useState<string | null>(null);

  const nameReady = commonName.trim().length > 0;

  async function run(kind: "find" | "generate") {
    if (busy || !nameReady) return;
    setBusy(kind);
    setError(null);
    setCredit(null);
    const res =
      kind === "find"
        ? await aiFindCropImage({ commonName, scientificName, ediblePart })
        : await aiGenerateCropImage({ commonName, scientificName, category, ediblePart });
    setBusy(null);
    if (res.error || !res.imageUrl) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setCredit(res.credit ?? null);
    await onImage(res.imageUrl);
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => run("find")} disabled={!!busy || !nameReady} className={btn}>
          {busy === "find" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Find photo with AI
        </button>
        {generateEnabled && (
          <button type="button" onClick={() => run("generate")} disabled={!!busy || !nameReady} className={btn}>
            {busy === "generate" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
            Generate image
          </button>
        )}
      </div>
      {!nameReady && <p className="mt-1 text-xs text-muted-foreground">Enter the crop name first.</p>}
      {busy && <p className="mt-1 text-xs text-muted-foreground">{busy === "find" ? "Searching for a photo…" : "Generating an image…"} this can take a few seconds.</p>}
      {credit && !busy && <p className="mt-1 text-xs text-muted-foreground">Source: {credit}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
