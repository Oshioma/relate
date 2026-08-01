"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Search, X, BedDouble, Heart, LayoutGrid, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ACCOMMODATION_TYPES, ACCOMMODATION_AMENITIES, amenityLabel, STAY_TERMS, stayTermForType, type StayTerm } from "@/lib/accommodation-types";
import { NewAccommodationForm } from "./new-accommodation-form";
import { AccommodationCard } from "./accommodation-card";
import type { AccommodationListingWithStats, BusinessLinkOption } from "@/lib/data/accommodation";
import type { AccommodationType } from "@/types/database";

// Leaflet touches `window` at import, so the map only loads in the browser.
const AccommodationMap = dynamic(() => import("./accommodation-map"), {
  ssr: false,
  loading: () => <div className="flex h-[65vh] min-h-[420px] items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

type SortKey = "newest" | "price_asc" | "price_desc" | "top_rated";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "top_rated", label: "Top rated" },
];

export function AccommodationView({
  listings,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  userId,
  businesses,
  importUrl,
}: {
  listings: AccommodationListingWithStats[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  userId: string;
  businesses: BusinessLinkOption[];
  // Arriving from the directory's add form with a link to autofill from.
  importUrl?: string;
}) {
  const [term, setTerm] = useState<StayTerm | "all">("all");
  const [type, setType] = useState<AccommodationType | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(Boolean(importUrl) && canPost);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const savedCount = useMemo(() => listings.filter((l) => l.saved).length, [listings]);

  // Only offer amenity chips for amenities at least one listing advertises.
  const amenitiesInUse = useMemo(() => {
    const present = new Set(listings.flatMap((l) => l.amenities));
    return ACCOMMODATION_AMENITIES.filter((a) => present.has(a.value));
  }, [listings]);

  function toggleAmenity(value: string) {
    setAmenityFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    const filtered = listings.filter((l) => {
      if (term !== "all" && stayTermForType(l.accommodation_type) !== term) return false;
      if (type !== "all" && l.accommodation_type !== type) return false;
      if (savedOnly && !l.saved) return false;
      if (!showUnavailable && l.status === "unavailable") return false;
      if (q && !l.name.toLowerCase().includes(q) && !(l.description ?? "").toLowerCase().includes(q)) return false;
      if (min !== null && Number.isFinite(min) && (l.price_per_night === null || l.price_per_night < min)) return false;
      if (max !== null && Number.isFinite(max) && (l.price_per_night === null || l.price_per_night > max)) return false;
      if (amenityFilters.length > 0 && !amenityFilters.every((a) => l.amenities.includes(a))) return false;
      return true;
    });

    // Listings with no price (or no rating) sort last within their key.
    const byPrice = (dir: 1 | -1) => (a: AccommodationListingWithStats, b: AccommodationListingWithStats) => {
      if (a.price_per_night === null) return 1;
      if (b.price_per_night === null) return -1;
      return (a.price_per_night - b.price_per_night) * dir;
    };
    const sorted = [...filtered];
    if (sort === "price_asc") sorted.sort(byPrice(1));
    else if (sort === "price_desc") sorted.sort(byPrice(-1));
    else if (sort === "top_rated")
      sorted.sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1) || b.ratingCount - a.ratingCount);
    // "newest" keeps the created_at-desc order the query already returned.
    return sorted;
  }, [listings, term, type, query, showUnavailable, savedOnly, minPrice, maxPrice, amenityFilters, sort]);

  const countByType = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of listings) {
      if (l.status === "unavailable" && !showUnavailable) continue;
      counts.set(l.accommodation_type, (counts.get(l.accommodation_type) ?? 0) + 1);
    }
    return counts;
  }, [listings, showUnavailable]);

  const countByTerm = useMemo(() => {
    const counts = new Map<StayTerm, number>();
    for (const l of listings) {
      if (l.status === "unavailable" && !showUnavailable) continue;
      const t = stayTermForType(l.accommodation_type);
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return counts;
  }, [listings, showUnavailable]);

  // Picking a term narrows the type chips to that term's types, and clears a
  // type selection that no longer belongs to it.
  function chooseTerm(next: StayTerm | "all") {
    setTerm(next);
    if (next !== "all" && type !== "all" && stayTermForType(type) !== next) setType("all");
  }

  // Both terms in play is what makes the split worth showing; a space that only
  // ever lists holiday rentals shouldn't carry a toggle that does nothing.
  const showTermToggle = STAY_TERMS.filter((t) => (countByTerm.get(t.value) ?? 0) > 0).length > 1;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places to stay…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              title="List view"
              className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium ${viewMode === "list" ? "bg-accent-soft text-accent" : "text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              aria-pressed={viewMode === "map"}
              title="Map view"
              className={`flex items-center gap-1 border-l border-border px-2.5 py-2 text-xs font-medium ${viewMode === "map" ? "bg-accent-soft text-accent" : "text-muted-foreground hover:bg-muted"}`}
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
          {canPost && (
            <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Cancel" : "Post a listing"}
            </Button>
          )}
        </div>
      </div>

      {showTermToggle && (
        <div className="mb-3 inline-flex overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            onClick={() => chooseTerm("all")}
            aria-pressed={term === "all"}
            className={`px-3.5 py-1.5 text-xs font-medium ${term === "all" ? "bg-accent-soft text-accent" : "text-muted-foreground hover:bg-muted"}`}
          >
            All stays
          </button>
          {STAY_TERMS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => chooseTerm(t.value)}
              aria-pressed={term === t.value}
              title={t.description}
              className={`border-l border-border px-3.5 py-1.5 text-xs font-medium ${term === t.value ? "bg-accent-soft text-accent" : "text-muted-foreground hover:bg-muted"}`}
            >
              {t.label} ({countByTerm.get(t.value) ?? 0})
            </button>
          ))}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setType("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${type === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({term === "all" ? listings.filter((l) => showUnavailable || l.status !== "unavailable").length : countByTerm.get(term) ?? 0})
        </button>
        {ACCOMMODATION_TYPES.map((t) => {
          const count = countByType.get(t.value) ?? 0;
          if (count === 0) return null;
          if (term !== "all" && stayTermForType(t.value) !== term) return null;
          const isActive = type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(isActive ? "all" : t.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {t.label} ({count})
            </button>
          );
        })}

        {savedCount > 0 && (
          <button
            type="button"
            onClick={() => setSavedOnly((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${savedOnly ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            <Heart className={`h-3 w-3 ${savedOnly ? "fill-accent" : ""}`} />
            Saved ({savedCount})
          </button>
        )}

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={showUnavailable} onChange={(e) => setShowUnavailable(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Show unavailable
        </label>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort listings"
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className="w-20 rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-20 rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {amenitiesInUse.map((a) => {
          const active = amenityFilters.includes(a.value);
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => toggleAmenity(a.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${active ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {amenityLabel(a.value)}
            </button>
          );
        })}
      </div>

      {showForm && (
        <div className="mb-5">
          <NewAccommodationForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} userId={userId} businesses={businesses} importUrl={importUrl} onDone={() => setShowForm(false)} />
        </div>
      )}

      {viewMode === "map" ? (
        visible.some((l) => l.lat !== null && l.lng !== null) ? (
          <AccommodationMap listings={visible} communitySlug={communitySlug} spaceSlug={spaceSlug} />
        ) : (
          <EmptyState
            icon={<MapIcon className="h-6 w-6" />}
            title="Nothing to map"
            description="None of the matching stays have a location set yet. Add coordinates when posting to show them here."
          />
        )
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<BedDouble className="h-6 w-6" />}
          title={listings.length === 0 ? "No places to stay yet" : "Nothing matches"}
          description={listings.length === 0 ? "Hotels, guesthouses, rentals and camping members list will show up here." : "Try a different search or type."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing) => (
            <AccommodationCard key={listing.id} listing={listing} communitySlug={communitySlug} spaceSlug={spaceSlug} canSave={canPost} />
          ))}
        </div>
      )}
    </div>
  );
}
