"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ACCOMMODATION_TYPES } from "@/lib/accommodation-types";
import { NewAccommodationForm } from "./new-accommodation-form";
import { AccommodationCard } from "./accommodation-card";
import type { AccommodationListingWithBusiness } from "@/lib/data/accommodation";
import type { AccommodationType } from "@/types/database";

export function AccommodationView({
  listings,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  listings: AccommodationListingWithBusiness[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [type, setType] = useState<AccommodationType | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (type !== "all" && l.accommodation_type !== type) return false;
      if (!showUnavailable && l.status === "unavailable") return false;
      if (q && !l.name.toLowerCase().includes(q) && !(l.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, type, query, showUnavailable]);

  const countByType = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of listings) {
      if (l.status === "unavailable" && !showUnavailable) continue;
      counts.set(l.accommodation_type, (counts.get(l.accommodation_type) ?? 0) + 1);
    }
    return counts;
  }, [listings, showUnavailable]);

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
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Post a listing"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setType("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${type === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({listings.filter((l) => showUnavailable || l.status !== "unavailable").length})
        </button>
        {ACCOMMODATION_TYPES.map((t) => {
          const count = countByType.get(t.value) ?? 0;
          if (count === 0) return null;
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

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={showUnavailable} onChange={(e) => setShowUnavailable(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Show unavailable
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewAccommodationForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BedDouble className="h-6 w-6" />}
          title={listings.length === 0 ? "No places to stay yet" : "Nothing matches"}
          description={listings.length === 0 ? "Hotels, guesthouses, rentals and camping members list will show up here." : "Try a different search or type."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <AccommodationCard
              key={listing.id}
              listing={listing}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || listing.listed_by === userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
