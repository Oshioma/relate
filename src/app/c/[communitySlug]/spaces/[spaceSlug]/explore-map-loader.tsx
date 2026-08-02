"use client";

import dynamic from "next/dynamic";
import type { MapCategory, Landmark } from "@/types/database";
import type { MapPinnedBusiness } from "@/lib/data/map";
import type { MapItem } from "@/lib/map-item-kinds";

// Leaflet touches `window` at import time, so it can only load in the
// browser — ssr: false is only valid inside a Client Component, hence this
// thin wrapper around the real map in explore-map.tsx.
const ExploreMap = dynamic(() => import("./explore-map"), {
  ssr: false,
  loading: () => <div className="flex h-[65vh] min-h-[420px] items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground">Loading map…</div>,
});

export function ExploreMapLoader(props: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  categories: MapCategory[];
  landmarks: Landmark[];
  businesses: MapPinnedBusiness[];
  items: MapItem[];
  canPost: boolean;
  isAdmin: boolean;
  userId: string;
}) {
  return <ExploreMap {...props} />;
}
