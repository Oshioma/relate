"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BUSINESS_CATEGORIES, businessCategoryLabel } from "@/lib/business-categories";
import { NewBusinessForm } from "./new-business-form";
import { BusinessCard } from "./business-card";
import type { Business, BusinessCategory } from "@/types/database";

export function BusinessDirectoryView({
  businesses,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  businesses: Business[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [category, setCategory] = useState<BusinessCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (q && !b.name.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [businesses, category, query]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of businesses) {
      counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    }
    return counts;
  }, [businesses]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add business"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${category === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({businesses.length})
        </button>
        {BUSINESS_CATEGORIES.map((c) => {
          const count = countByCategory.get(c.value) ?? 0;
          if (count === 0) return null;
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(isActive ? "all" : c.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {businessCategoryLabel(c.value)} ({count})
            </button>
          );
        })}
      </div>

      {showForm && (
        <div className="mb-5">
          <NewBusinessForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} userId={userId} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title={businesses.length === 0 ? "No businesses yet" : "Nothing matches"}
          description={businesses.length === 0 ? "Restaurants, cafes, shops and services members add will show up here." : "Try a different search or category."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || business.created_by === userId}
              isStaff={isStaff}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
