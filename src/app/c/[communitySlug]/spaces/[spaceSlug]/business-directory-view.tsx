"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X, Building2, Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { businessCategoryOptions } from "@/lib/business-categories";
import { NewBusinessForm } from "./new-business-form";
import { BusinessCard } from "./business-card";
import { setCategoryFeatured, addBusinessCategory, deleteBusinessCategory } from "./business-directory-actions";
import type { Business, BusinessCategory, BusinessCustomCategory } from "@/types/database";

export function BusinessDirectoryView({
  businesses,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
  initialCategory,
  featuredCategories,
  customCategories,
}: {
  businesses: Business[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
  // Pre-selected category from a ?category= nav sub-link.
  initialCategory?: BusinessCategory;
  // Categories staff have pinned as nav sub-links for this space.
  featuredCategories: BusinessCategory[];
  // Categories staff added beyond the built-ins, scoped to this space.
  customCategories: BusinessCustomCategory[];
}) {
  const [category, setCategory] = useState<BusinessCategory | "all">(initialCategory ?? "all");
  const [location, setLocation] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [featured, setFeatured] = useState<BusinessCategory[]>(featuredCategories);
  const [chipError, setChipError] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleFeatured(target: BusinessCategory) {
    const makeFeatured = !featured.includes(target);
    setChipError(null);
    startTransition(async () => {
      const result = await setCategoryFeatured(spaceId, communityId, target, makeFeatured, communitySlug);
      if (result?.error) {
        setChipError(result.error);
      } else {
        setFeatured((prev) => (makeFeatured ? [...prev, target] : prev.filter((c) => c !== target)));
        router.refresh();
      }
    });
  }

  function handleAddCategory() {
    setChipError(null);
    startTransition(async () => {
      const result = await addBusinessCategory(spaceId, communityId, newCategoryLabel, communitySlug, spaceSlug);
      if (result.error) {
        setChipError(result.error);
      } else {
        setNewCategoryLabel("");
        setAddingCategory(false);
        if (result.slug) setCategory(result.slug);
        router.refresh();
      }
    });
  }

  function handleDeleteCategory(target: BusinessCustomCategory) {
    if (!window.confirm(`Delete "${target.label}"? Businesses in it move to Other.`)) return;
    setChipError(null);
    startTransition(async () => {
      const result = await deleteBusinessCategory(target.id, communitySlug);
      if (result.error) {
        setChipError(result.error);
      } else {
        setCategory("all");
        setFeatured((prev) => prev.filter((c) => c !== target.slug));
        router.refresh();
      }
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (location !== "all" && b.location_label !== location) return false;
      if (q && !b.name.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [businesses, category, location, query]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of businesses) {
      counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    }
    return counts;
  }, [businesses]);

  const locations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of businesses) {
      if (!b.location_label) continue;
      counts.set(b.location_label, (counts.get(b.location_label) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [businesses]);

  const groups = useMemo(() => {
    const byLocation = new Map<string, Business[]>();
    const unlabeled: Business[] = [];
    for (const b of filtered) {
      if (!b.location_label) {
        unlabeled.push(b);
        continue;
      }
      const list = byLocation.get(b.location_label) ?? [];
      list.push(b);
      byLocation.set(b.location_label, list);
    }
    const sorted = [...byLocation.entries()].sort(([a], [b]) => a.localeCompare(b));
    if (unlabeled.length > 0) sorted.push(["Other", unlabeled]);
    return sorted;
  }, [filtered]);

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
        {businessCategoryOptions(customCategories).map((c) => {
          const count = countByCategory.get(c.value) ?? 0;
          const isCustom = customCategories.some((cc) => cc.slug === c.value);
          // Built-ins only clutter the row once something uses them; customs
          // were added deliberately, so they show right away.
          if (count === 0 && !isCustom) return null;
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(isActive ? "all" : c.value)}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {featured.includes(c.value) && <Pin className="h-3 w-3" />}
              {c.label} ({count})
            </button>
          );
        })}
        {isStaff && category !== "all" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => toggleFeatured(category)}
            title="Featured categories appear as links under this directory in the left nav"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {featured.includes(category) ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
            {featured.includes(category) ? "Remove nav link" : "Add to nav"}
          </button>
        )}
        {isStaff &&
          category !== "all" &&
          (() => {
            const activeCustom = customCategories.find((cc) => cc.slug === category);
            if (!activeCustom) return null;
            return (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDeleteCategory(activeCustom)}
                title="Delete this category — its businesses move to Other"
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-danger hover:text-danger disabled:opacity-60"
              >
                <Trash2 className="h-3 w-3" />
                Delete category
              </button>
            );
          })()}
        {isStaff && !addingCategory && (
          <button
            type="button"
            onClick={() => {
              setChipError(null);
              setAddingCategory(true);
            }}
            title="Add a category beyond the built-ins, e.g. Fundi"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent"
          >
            <Plus className="h-3 w-3" />
            New category
          </button>
        )}
        {isStaff && addingCategory && (
          <span className="inline-flex items-center gap-1.5">
            <input
              autoFocus
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
                if (e.key === "Escape") setAddingCategory(false);
              }}
              maxLength={40}
              placeholder="Fundi"
              className="w-32 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              disabled={isPending || !newCategoryLabel.trim()}
              onClick={handleAddCategory}
              className="rounded-full border border-accent bg-accent-soft px-3 py-1 text-xs font-medium text-accent disabled:opacity-60"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingCategory(false);
                setNewCategoryLabel("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}
      </div>

      {chipError && <p className="-mt-3 mb-3 text-xs text-danger">{chipError}</p>}

      {locations.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLocation("all")}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${location === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            All locations
          </button>
          {locations.map(([label, count]) => {
            const isActive = location === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setLocation(isActive ? "all" : label)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="mb-5">
          <NewBusinessForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} userId={userId} customCategories={customCategories} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title={businesses.length === 0 ? "No businesses yet" : "Nothing matches"}
          description={businesses.length === 0 ? "Restaurants, cafes, shops and services members add will show up here." : "Try a different search or category."}
        />
      ) : (
        <div className="space-y-6">
          {groups.map(([label, group]) => (
            <div key={label}>
              {groups.length > 1 && <h3 className="mb-3 text-sm font-semibold text-foreground">{label}</h3>}
              <div className="grid gap-4 sm:grid-cols-2">
                {group.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    communitySlug={communitySlug}
                    spaceSlug={spaceSlug}
                    canManage={isStaff || business.created_by === userId}
                    isStaff={isStaff}
                    userId={userId}
                    customCategories={customCategories}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
