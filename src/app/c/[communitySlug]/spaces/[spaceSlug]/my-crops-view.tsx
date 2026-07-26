"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Sprout, ExternalLink, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import type { CropListItem } from "@/lib/data/crop-guides";
import type { FarmCrop, PublicFarm } from "@/lib/farm-bridge";
import { setFarmVisibility } from "./my-crops-actions";

export function MyCropsView({
  farmCrops,
  farmAppUrl,
  crops,
  communitySlug,
  spaceSlug,
  cropGuidesSpaceSlug,
  canShare,
  isPublic,
  publicFarms,
}: {
  farmCrops: FarmCrop[];
  farmAppUrl: string | null;
  crops: CropListItem[];
  communitySlug: string;
  spaceSlug: string;
  // The community's Crop Guides space to deep-link a matched crop into, if any.
  cropGuidesSpaceSlug: string | null;
  // Whether the farm bridge is configured — the share toggle only appears then.
  canShare: boolean;
  // Whether the viewer has opted their own farm public.
  isPublic: boolean;
  // Other members of this community who have opted their farms public.
  publicFarms: PublicFarm[];
}) {
  const slugByName = useMemo(() => new Map(crops.map((c) => [c.common_name.toLowerCase(), c.slug])), [crops]);
  const guideSlugFor = (cropName: string) => slugByName.get(cropName.toLowerCase()) ?? null;

  // Distinct farms for the filter (a member can belong to more than one).
  const farms = useMemo(() => {
    const set = new Set<string>();
    for (const c of farmCrops) if (c.farm_name) set.add(c.farm_name);
    return [...set].sort();
  }, [farmCrops]);

  const [farm, setFarm] = useState<string | null>(null);
  const filtered = useMemo(() => (farm ? farmCrops.filter((c) => c.farm_name === farm) : farmCrops), [farmCrops, farm]);

  const hasCommunityFarms = publicFarms.length > 0;

  return (
    <div>
      {canShare && (
        <ShareToggle communitySlug={communitySlug} spaceSlug={spaceSlug} initialPublic={isPublic} />
      )}

      {/* ---- Your crops ------------------------------------------------- */}
      {hasCommunityFarms && farmCrops.length > 0 && (
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Your crops</h2>
      )}

      {farmCrops.length === 0 ? (
        <EmptyState
          icon={<Sprout className="h-6 w-6" />}
          title="No crops to show"
          description="Your crops from the shamba.online farm app will appear here once they're linked to your account."
        />
      ) : (
        <>
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
            {filtered.map((fc) => (
              <FarmCropCard key={fc.id} crop={fc} communitySlug={communitySlug} cropGuidesSpaceSlug={cropGuidesSpaceSlug} guideSlug={guideSlugFor(fc.crop_name)} showFarmName />
            ))}
          </div>
        </>
      )}

      {/* ---- Community farms ------------------------------------------- */}
      {hasCommunityFarms && (
        <section className="mt-10">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">Community farms</h2>
          <p className="mb-5 text-sm text-muted-foreground">Crops shared by other members who made their farms public.</p>

          <div className="space-y-8">
            {publicFarms.map((pf) => (
              <div key={pf.profileId}>
                <div className="mb-3 flex items-center gap-2">
                  <Avatar src={pf.avatarUrl} name={pf.fullName || pf.username} size={28} />
                  <Link href={`/c/${communitySlug}/members/${pf.username}`} className="text-sm font-semibold text-foreground hover:underline">
                    {pf.fullName || pf.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    · {pf.crops.length} crop{pf.crops.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pf.crops.map((fc) => (
                    <FarmCropCard key={fc.id} crop={fc} communitySlug={communitySlug} cropGuidesSpaceSlug={cropGuidesSpaceSlug} guideSlug={guideSlugFor(fc.crop_name)} showFarmName />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// The public/private switch at the top of the page. Optimistically flips, then
// persists via the server action; reverts and surfaces the error on failure.
function ShareToggle({ communitySlug, spaceSlug, initialPublic }: { communitySlug: string; spaceSlug: string; initialPublic: boolean }) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !isPublic;
    setIsPublic(next);
    setError(null);
    const fd = new FormData();
    fd.set("is_public", String(next));
    fd.set("community_slug", communitySlug);
    fd.set("space_slug", spaceSlug);
    startTransition(async () => {
      const res = await setFarmVisibility(undefined, fd);
      if (res && "error" in res) {
        setIsPublic(!next); // revert
        setError(res.error);
      }
    });
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 ${isPublic ? "text-accent" : "text-muted-foreground"}`}>
            {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{isPublic ? "Your farm is public" : "Your farm is private"}</p>
            <p className="text-sm text-muted-foreground">
              {isPublic
                ? "Other members of this community can browse your crops here."
                : "Only you can see your crops. Turn on to let other members browse them."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          aria-label="Make my farm public"
          onClick={toggle}
          disabled={pending}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${isPublic ? "bg-accent" : "bg-muted"}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

// A single crop card, shared between the viewer's own crops and browsed public
// farms. Links to the community Crop Guide for the crop when one matches.
function FarmCropCard({
  crop: fc,
  communitySlug,
  cropGuidesSpaceSlug,
  guideSlug,
  showFarmName,
}: {
  crop: FarmCrop;
  communitySlug: string;
  cropGuidesSpaceSlug: string | null;
  guideSlug: string | null;
  showFarmName: boolean;
}) {
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
          {showFarmName && fc.farm_name && <span>· {fc.farm_name}</span>}
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
    <Link href={`/c/${communitySlug}/spaces/${cropGuidesSpaceSlug}/crop-guides/${guideSlug}`} className="block hover:opacity-90">
      {inner}
    </Link>
  ) : (
    inner
  );
}
