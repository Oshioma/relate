"use client";

import { useActionState, useMemo, useState } from "react";
import { Search, Leaf, Sprout, CalendarClock, Settings2, Plus, X, Bookmark, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CropCard } from "./crop-card";
import { CropProposals } from "./crop-proposals";
import { CROP_CATEGORIES, cropCategoryLabel } from "@/lib/crop-categories";
import { createCommunityRegion, deleteCommunityRegion, type CropRegionFormState } from "./crop-guides-actions";
import type { CropListItem, MonthCalendarRow, ProposalWithAuthor } from "@/lib/data/crop-guides";
import type { CropRegion, CommunityCropRegion } from "@/types/database";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SOW_ACTIVITIES = new Set(["sow_indoors", "direct_sow", "transplant"]);

type RegionOption = { value: string; label: string; group: string; regionId: string | null };

export function CropGuidesView({
  crops,
  communitySlug,
  spaceSlug,
  communityId,
  isAdmin,
  regions,
  communityRegions,
  monthCalendar,
  currentMonth,
  savedIds,
  searchIndex,
  proposals,
  isMember,
  isStaff,
}: {
  crops: CropListItem[];
  communitySlug: string;
  spaceSlug: string;
  communityId: string;
  isAdmin: boolean;
  regions: CropRegion[];
  communityRegions: CommunityCropRegion[];
  monthCalendar: MonthCalendarRow[];
  currentMonth: number;
  savedIds: string[];
  // crop_id -> extra searchable terms (pests, diseases, companions, ailments).
  searchIndex: Record<string, string>;
  proposals: ProposalWithAuthor[];
  isMember: boolean;
  isStaff: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  // Faceted filters. Empty string = "any".
  const [difficulty, setDifficulty] = useState("");
  const [sun, setSun] = useState("");
  const [water, setWater] = useState("");
  const [ediblePart, setEdiblePart] = useState("");
  const [flags, setFlags] = useState({ beginner: false, pollinator: false, nitrogen: false, drought: false, organic: false });
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

  const cropsById = useMemo(() => new Map(crops.map((c) => [c.id, c])), [crops]);

  const regionOptions = useMemo<RegionOption[]>(() => {
    const community: RegionOption[] = communityRegions.map((r) => ({ value: `c:${r.id}`, label: r.name, group: "Your community", regionId: r.base_region_id }));
    const climate = regions.filter((r) => r.kind === "climate").map((r) => ({ value: `r:${r.id}`, label: r.name, group: "Climate", regionId: r.id }));
    const geographic = regions.filter((r) => r.kind === "geographic").map((r) => ({ value: `r:${r.id}`, label: r.name, group: "Region", regionId: r.id }));
    return [...community, ...climate, ...geographic];
  }, [regions, communityRegions]);

  const regionIdsWithData = useMemo(() => new Set(monthCalendar.map((r) => r.region_id)), [monthCalendar]);
  const defaultRegion = useMemo(() => (regionOptions.find((o) => o.regionId && regionIdsWithData.has(o.regionId)) ?? regionOptions[0])?.value ?? "", [regionOptions, regionIdsWithData]);
  const [regionValue, setRegionValue] = useState(defaultRegion);
  const selectedRegionId = (regionOptions.find((o) => o.value === regionValue) ?? regionOptions.find((o) => o.value === defaultRegion))?.regionId ?? null;

  const { sowNow, harvestNow } = useMemo(() => {
    const sow = new Map<string, CropListItem>();
    const harvest = new Map<string, CropListItem>();
    if (selectedRegionId) {
      for (const row of monthCalendar) {
        if (row.region_id !== selectedRegionId) continue;
        const crop = cropsById.get(row.crop_id);
        if (!crop) continue;
        if (SOW_ACTIVITIES.has(row.activity)) sow.set(crop.id, crop);
        else if (row.activity === "harvest") harvest.set(crop.id, crop);
      }
    }
    return { sowNow: [...sow.values()], harvestNow: [...harvest.values()] };
  }, [monthCalendar, selectedRegionId, cropsById]);

  const activeCategories = useMemo(() => {
    const present = new Set(crops.map((c) => c.category));
    const known = CROP_CATEGORIES.filter((c) => present.has(c.slug)).map((c) => c.slug);
    const extras = [...present].filter((slug) => !CROP_CATEGORIES.some((c) => c.slug === slug));
    return [...known, ...extras];
  }, [crops]);

  // Edible parts present in the library, for that facet's options.
  const edibleParts = useMemo(() => {
    const set = new Set<string>();
    for (const c of crops) if (c.edible_part) set.add(c.edible_part);
    return [...set].sort();
  }, [crops]);

  const activeFacetCount =
    (difficulty ? 1 : 0) + (sun ? 1 : 0) + (water ? 1 : 0) + (ediblePart ? 1 : 0) + Object.values(flags).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((c) => {
      if (savedOnly && !savedSet.has(c.id)) return false;
      if (category && c.category !== category) return false;
      if (difficulty && c.difficulty !== difficulty) return false;
      if (sun && c.sun !== sun) return false;
      if (water && c.water_need !== water) return false;
      if (ediblePart && c.edible_part !== ediblePart) return false;
      if (flags.beginner && !c.beginner_friendly) return false;
      if (flags.pollinator && !c.pollinator_friendly) return false;
      if (flags.nitrogen && !c.nitrogen_fixer) return false;
      if (flags.drought && !c.drought_tolerant) return false;
      if (flags.organic && !c.organic_favourite) return false;
      if (q) {
        // Includes the search index: pests, diseases, companions and ailments,
        // so "cough" or "whitefly" find the right crops.
        const haystack = `${c.common_name} ${c.scientific_name ?? ""} ${c.overview ?? ""} ${searchIndex[c.id] ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [crops, query, category, savedOnly, savedSet, difficulty, sun, water, ediblePart, flags, searchIndex]);

  const regionGroups = useMemo(() => {
    const seen = new Set<string>();
    return regionOptions.reduce<{ group: string; items: RegionOption[] }[]>((acc, o) => {
      if (!seen.has(o.group)) {
        seen.add(o.group);
        acc.push({ group: o.group, items: regionOptions.filter((x) => x.group === o.group) });
      }
      return acc;
    }, []);
  }, [regionOptions]);

  function cropChip(crop: CropListItem) {
    return (
      <Link
        key={crop.id}
        href={`/c/${communitySlug}/spaces/${spaceSlug}/crop-guides/${crop.slug}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground hover:border-accent hover:text-accent"
      >
        {crop.common_name}
      </Link>
    );
  }

  return (
    <div>
      {isAdmin && (
        <RegionManager
          communityId={communityId}
          communitySlug={communitySlug}
          spaceSlug={spaceSlug}
          regions={regions}
          communityRegions={communityRegions}
        />
      )}

      {/* Propose a crop (members) + review queue (staff) */}
      {(isMember || isStaff) && (proposals.length > 0 || isMember) && (
        <CropProposals ctx={{ communityId, communitySlug, spaceSlug }} proposals={proposals} canPropose={isMember} isStaff={isStaff} />
      )}

      {/* Search + filters */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, pest, disease or ailment…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex w-auto items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium ${
            showFilters || activeFacetCount > 0 ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters{activeFacetCount > 0 ? ` (${activeFacetCount})` : ""}
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FacetSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={[["beginner", "Beginner"], ["moderate", "Moderate"], ["advanced", "Advanced"]]} />
            <FacetSelect label="Sun" value={sun} onChange={setSun} options={[["full_sun", "Full sun"], ["partial_shade", "Partial shade"], ["full_shade", "Full shade"]]} />
            <FacetSelect label="Water" value={water} onChange={setWater} options={[["low", "Low"], ["moderate", "Moderate"], ["high", "High"]]} />
            {edibleParts.length > 0 && <FacetSelect label="Edible part" value={ediblePart} onChange={setEdiblePart} options={edibleParts.map((p) => [p, p] as [string, string])} />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["beginner", "Beginner friendly"],
                ["pollinator", "Pollinator friendly"],
                ["nitrogen", "Nitrogen fixer"],
                ["drought", "Drought tolerant"],
                ["organic", "Organic favourite"],
              ] as [keyof typeof flags, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFlags((f) => ({ ...f, [key]: !f[key] }))}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${flags[key] ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
              >
                {label}
              </button>
            ))}
            {activeFacetCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setDifficulty("");
                  setSun("");
                  setWater("");
                  setEdiblePart("");
                  setFlags({ beginner: false, pollinator: false, nitrogen: false, drought: false, organic: false });
                }}
                className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {(activeCategories.length > 0 || savedSet.size > 0) && (
        <div className="mb-5 flex flex-wrap gap-2">
          {savedSet.size > 0 && (
            <button
              type="button"
              onClick={() => setSavedOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${savedOnly ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              <Bookmark className={`h-3 w-3 ${savedOnly ? "fill-current" : ""}`} />
              Saved ({savedSet.size})
            </button>
          )}
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${category === null ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            All
          </button>
          {activeCategories.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setCategory(slug)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${category === slug ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {cropCategoryLabel(slug)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Leaf className="h-6 w-6" />}
          title={crops.length === 0 ? "No crop guides yet" : "Nothing matches"}
          description={crops.length === 0 ? "Growing guides will appear here as the crop library is published." : "Try a different search or category."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crop) => (
            <CropCard key={crop.id} crop={crop} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          ))}
        </div>
      )}

      {/* What can I grow now? */}
      {regionOptions.length > 0 && (
        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <CalendarClock className="h-4 w-4 text-accent" />
              What can I grow now?
              <span className="font-normal text-muted-foreground">· {MONTH_NAMES[currentMonth - 1]}</span>
            </h2>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Region</span>
              <select
                value={regionValue}
                onChange={(e) => setRegionValue(e.target.value)}
                className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {regionGroups.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          {sowNow.length === 0 && harvestNow.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No calendar data for this region yet — try another region.</p>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sow</span>
              {sowNow.length === 0 ? <span className="text-sm text-muted-foreground">nothing</span> : sowNow.map(cropChip)}
              <span className="text-border">·</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Harvest</span>
              {harvestNow.length === 0 ? <span className="text-sm text-muted-foreground">nothing</span> : harvestNow.map(cropChip)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// Admin-only: create and remove the community's own growing regions. Each
// inherits a reference region's calendar as its starting point.
function RegionManager({
  communityId,
  communitySlug,
  spaceSlug,
  regions,
  communityRegions,
}: {
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  regions: CropRegion[];
  communityRegions: CommunityCropRegion[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<CropRegionFormState, FormData>(createCommunityRegion, undefined);
  const regionName = (id: string | null) => regions.find((r) => r.id === id)?.name ?? null;

  return (
    <section className="mb-5 rounded-lg border border-dashed border-border p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        Community growing regions
        <span className="text-xs text-muted-foreground">({communityRegions.length})</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {communityRegions.length > 0 && (
            <ul className="space-y-2">
              {communityRegions.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
                  <span className="text-sm text-foreground">
                    {r.name}
                    {regionName(r.base_region_id) && <span className="ml-2 text-xs text-muted-foreground">based on {regionName(r.base_region_id)}</span>}
                  </span>
                  <form action={deleteCommunityRegion}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="community_slug" value={communitySlug} />
                    <input type="hidden" name="space_slug" value={spaceSlug} />
                    <button type="submit" className="text-muted-foreground hover:text-danger" aria-label={`Remove ${r.name}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}

          <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <input type="hidden" name="community_id" value={communityId} />
            <input type="hidden" name="community_slug" value={communitySlug} />
            <input type="hidden" name="space_slug" value={spaceSlug} />
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Region name</label>
              <input
                name="name"
                required
                placeholder="e.g. Kenya Highlands"
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Based on</label>
              <select name="base_region_id" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">No base calendar</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-auto shrink-0">
              <Plus className="h-4 w-4" />
              Add region
            </Button>
          </form>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sprout className="h-3 w-3" />
            Members can then pick your local region on any crop page.
          </p>
        </div>
      )}
    </section>
  );
}

// A labelled dropdown for one search facet. options is [value, label][].
function FacetSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Any</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
