"use client";

import { useMemo, useState } from "react";
import { Search, Leaf } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { CropCard } from "./crop-card";
import { CROP_CATEGORIES, cropCategoryLabel } from "@/lib/crop-categories";
import type { CropListItem } from "@/lib/data/crop-guides";

export function CropGuidesView({
  crops,
  communitySlug,
  spaceSlug,
}: {
  crops: CropListItem[];
  communitySlug: string;
  spaceSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // Only show category chips that actually have crops behind them — the library
  // is meant to scale to thousands of crops across unlimited categories.
  const activeCategories = useMemo(() => {
    const present = new Set(crops.map((c) => c.category));
    const known = CROP_CATEGORIES.filter((c) => present.has(c.slug)).map((c) => c.slug);
    const extras = [...present].filter((slug) => !CROP_CATEGORIES.some((c) => c.slug === slug));
    return [...known, ...extras];
  }, [crops]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crops.filter((c) => {
      if (category && c.category !== category) return false;
      if (q) {
        const haystack = `${c.common_name} ${c.scientific_name ?? ""} ${c.overview ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [crops, query, category]);

  return (
    <div>
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crops by name…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {activeCategories.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              category === null ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
            }`}
          >
            All
          </button>
          {activeCategories.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setCategory(slug)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                category === slug ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
              }`}
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
          description={
            crops.length === 0
              ? "Growing guides will appear here as the crop library is published."
              : "Try a different search or category."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crop) => (
            <CropCard key={crop.id} crop={crop} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
