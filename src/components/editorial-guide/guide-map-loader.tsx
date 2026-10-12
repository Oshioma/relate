"use client";

import dynamic from "next/dynamic";
import type { DestinationSummary } from "./types";

// Leaflet touches `window` at import time, so the map only loads in the
// browser — and only its own chunk, so the rest of the guide stays light.
const GuideMap = dynamic(() => import("./guide-map"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>,
});

export function GuideMapLoader({ destinations }: { destinations: DestinationSummary[] }) {
  return (
    <div className="h-[60vh] min-h-[360px] overflow-hidden rounded-lg border border-border bg-muted">
      <GuideMap destinations={destinations} />
    </div>
  );
}
