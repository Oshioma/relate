"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace-categories";
import { NewListingForm } from "./new-listing-form";
import { ListingCard } from "./listing-card";
import type { ListingWithSeller } from "@/lib/data/marketplace";
import type { MarketplaceListingType } from "@/types/database";

export function MarketplaceView({
  listings,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  listings: ListingWithSeller[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [category, setCategory] = useState<MarketplaceListingType | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSold, setShowSold] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (category !== "all" && l.listing_type !== category) return false;
      if (!showSold && l.status === "sold") return false;
      if (q && !l.title.toLowerCase().includes(q) && !(l.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, category, query, showSold]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of listings) {
      if (l.status === "sold" && !showSold) continue;
      counts.set(l.listing_type, (counts.get(l.listing_type) ?? 0) + 1);
    }
    return counts;
  }, [listings, showSold]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings…"
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
          onClick={() => setCategory("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${category === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({listings.filter((l) => showSold || l.status !== "sold").length})
        </button>
        {MARKETPLACE_CATEGORIES.map((c) => {
          const count = countByCategory.get(c.value) ?? 0;
          if (count === 0) return null;
          const Icon = c.icon;
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(isActive ? "all" : c.value)}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              <Icon className="h-3 w-3" />
              {c.label} ({count})
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Show sold
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewListingForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title={listings.length === 0 ? "No listings yet" : "Nothing matches"}
          description={listings.length === 0 ? "Goods, services, property and more that members list will show up here." : "Try a different search or category."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || listing.seller_id === userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
