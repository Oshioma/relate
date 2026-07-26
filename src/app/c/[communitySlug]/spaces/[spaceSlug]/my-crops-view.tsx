"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sprout, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { CropListItem } from "@/lib/data/crop-guides";
import type { FarmCrop } from "@/lib/farm-bridge";

export function MyCropsView({
  farmCrops,
  farmAppUrl,
  crops,
  communitySlug,
  cropGuidesSpaceSlug,
}: {
  farmCrops: FarmCrop[];
  farmAppUrl: string | null;
  crops: CropListItem[];
  communitySlug: string;
  // The community's Crop Guides space to deep-link a matched crop into, if any.
  cropGuidesSpaceSlug: string | null;
}) {
  const slugByName = useMemo(() => new Map(crops.map((c) => [c.common_name.toLowerCase(), c.slug])), [crops]);

  // Distinct farms for the filter (a member can belong to more than one).
  const farms = useMemo(() => {
    const set = new Set<string>();
    for (const c of farmCrops) if (c.farm_name) set.add(c.farm_name);
    return [...set].sort();
  }, [farmCrops]);

  const [farm, setFarm] = useState<string | null>(null);
  const filtered = useMemo(() => (farm ? farmCrops.filter((c) => c.farm_name === farm) : farmCrops), [farmCrops, farm]);

  if (farmCrops.length === 0) {
    return (
      <EmptyState
        icon={<Sprout className="h-6 w-6" />}
        title="No crops to show"
        description="Your crops from the shamba.online farm app will appear here once they're linked to your account."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {farmCrops.length} crop{farmCrops.length === 1 ? "" : "s"} from your shamba.online farm{farms.length > 1 ? "s" : ""}.
        </p>
        {farmAppUrl && (
          <a href={farmAppUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            Manage in shamba.online
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Farm filter — only when the member has more than one farm. */}
      {farms.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFarm(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${farm === null ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            All farms
          </button>
          {farms.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFarm(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${farm === f ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fc) => {
          const guideSlug = slugByName.get(fc.crop_name.toLowerCase()) ?? null;
          const inner = (
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex aspect-[3/2] items-center justify-center bg-accent-soft">
                {fc.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fc.image_url} alt={fc.crop_name} className="h-full w-full object-cover" />
                ) : (
                  <Sprout className="h-10 w-10 text-accent" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{fc.crop_name}</span>
                  {fc.status && <Badge tone="neutral">{fc.status}</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {fc.variety && <span>{fc.variety}</span>}
                  {fc.farm_name && <span>· {fc.farm_name}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {fc.planted_on && <span>Planted {fc.planted_on}</span>}
                  {fc.expected_harvest_start && <span>Harvest ~{fc.expected_harvest_start}</span>}
                  {fc.actual_yield_kg != null && <span>Yield {fc.actual_yield_kg} kg</span>}
                </div>
                {guideSlug && cropGuidesSpaceSlug && <span className="mt-2 text-xs font-medium text-accent">Open guide →</span>}
              </div>
            </div>
          );
          return guideSlug && cropGuidesSpaceSlug ? (
            <Link key={fc.id} href={`/c/${communitySlug}/spaces/${cropGuidesSpaceSlug}/crop-guides/${guideSlug}`} className="block hover:opacity-90">
              {inner}
            </Link>
          ) : (
            <div key={fc.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
