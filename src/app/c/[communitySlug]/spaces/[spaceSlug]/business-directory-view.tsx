"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X, Building2, Pin, PinOff, Trash2, Pencil, Heart, MapPin, LayoutGrid, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { businessCategoryOptions, businessCategoryLabel } from "@/lib/business-categories";
import { NewBusinessForm } from "./new-business-form";
import { BusinessCard } from "./business-card";
import { BUSINESS_CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "./business-category-icon";
import { setCategoryFeatured, addBusinessCategory, deleteBusinessCategory, renameBusinessCategory } from "./business-directory-actions";
import type { BusinessWithStats } from "@/lib/data/businesses";
import type { BusinessCategory, BusinessCustomCategory, BusinessCategoryLabelOverride } from "@/types/database";

type SortKey = "featured" | "rating" | "newest" | "name";

function countLabel(count: number): string {
  return `${count} ${count === 1 ? "listing" : "listings"}`;
}

/**
 * One category, as a target rather than a chip.
 *
 * The row of 12px pills gave a directory's most important choice — what kind of
 * thing am I looking for — the same weight as "Saved", the same weight as a
 * staff rename control, and a hit area you had to aim at on a phone. A tile
 * carries the icon the listing cards already use, the name at a readable size,
 * and how much is in there.
 */
function CategoryTile({
  Icon,
  label,
  detail,
  active,
  dimmed,
  pinned,
  onClick,
}: {
  Icon: LucideIcon;
  label: string;
  detail: string;
  active: boolean;
  // Empty, and only visible because staff need to reach it.
  dimmed?: boolean;
  pinned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col gap-2.5 rounded-lg border p-4 text-left transition-colors ${
        active ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
      } ${dimmed ? "opacity-60" : ""}`}
    >
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
          active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className={`flex items-center gap-1.5 truncate text-[15px] font-semibold tracking-tight ${active ? "text-accent" : "text-foreground"}`}>
          {pinned && <Pin className="h-3 w-3 shrink-0" />}
          {label}
        </span>
        <span className={`mt-0.5 block truncate text-[13px] ${active ? "text-accent/75" : "text-muted-foreground"}`}>{detail}</span>
      </span>
    </button>
  );
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name" },
];

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
  labelOverrides,
}: {
  businesses: BusinessWithStats[];
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
  // Staff relabellings of built-in categories for this space (Activity →
  // Experiences); applied to the chips, form and headings.
  labelOverrides: BusinessCategoryLabelOverride[];
}) {
  const [category, setCategory] = useState<BusinessCategory | "all">(initialCategory ?? "all");
  const [location, setLocation] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [savedOnly, setSavedOnly] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [featured, setFeatured] = useState<BusinessCategory[]>(featuredCategories);
  const [chipError, setChipError] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [renamingCategory, setRenamingCategory] = useState<BusinessCategory | null>(null);
  // Staff-only category management, folded away until asked for: it is four
  // controls that only staff can use, and it was sitting in the middle of the
  // row everyone uses to browse.
  const [showCategoryTools, setShowCategoryTools] = useState(false);
  const [renameLabel, setRenameLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Built-in categories (with staff relabellings applied) + this space's customs.
  const categoryOptions = useMemo(
    () => businessCategoryOptions(customCategories, labelOverrides),
    [customCategories, labelOverrides]
  );

  // A pinned category has to stay reachable even after it drops out of the
  // option list — a custom category that was deleted, or the retired
  // "accommodation" slug, both of which keep their nav sub-link because
  // featured_business_categories is keyed by slug and outlives them. Unpinning
  // is only offered for the *selected* category, so a pin with no chip is a nav
  // link that can never be removed.
  const chipOptions = useMemo(() => {
    const known = new Set(categoryOptions.map((c) => c.value));
    const stranded = featured
      .filter((f) => !known.has(f))
      .map((f) => ({ value: f, label: businessCategoryLabel(f, customCategories, labelOverrides) }));
    return [...categoryOptions, ...stranded];
  }, [categoryOptions, featured, customCategories, labelOverrides]);

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

  function startRename(target: BusinessCategory) {
    setChipError(null);
    setAddingCategory(false);
    setRenameLabel(chipOptions.find((o) => o.value === target)?.label ?? "");
    setRenamingCategory(target);
  }

  function handleRename() {
    if (renamingCategory === null) return;
    const target = renamingCategory;
    setChipError(null);
    startTransition(async () => {
      const result = await renameBusinessCategory(spaceId, communityId, target, renameLabel, communitySlug);
      if (result.error) {
        setChipError(result.error);
      } else {
        setRenamingCategory(null);
        router.refresh();
      }
    });
  }

  const savedCount = useMemo(() => businesses.filter((b) => b.saved).length, [businesses]);
  const localCount = useMemo(() => businesses.filter(({ business: b }) => b.is_local).length, [businesses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter(({ business: b, saved }) => {
      if (savedOnly && !saved) return false;
      // Local is a cross-cutting filter: it narrows whatever category is active
      // rather than replacing it, so "Restaurant" + "Local" = local restaurants.
      if (localOnly && !b.is_local) return false;
      if (category !== "all" && b.category !== category) return false;
      if (location !== "all" && b.location_label !== location) return false;
      if (q && !b.name.toLowerCase().includes(q) && !(b.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [businesses, category, location, query, savedOnly, localOnly]);

  // Order within each location group by the chosen sort. "Featured" keeps the
  // server's featured-first, name order; the rest re-sort the whole group.
  const sortItems = useMemo(() => {
    return (items: BusinessWithStats[]): BusinessWithStats[] => {
      const copy = [...items];
      copy.sort((a, b) => {
        if (sort === "rating") return (b.avgRating ?? -1) - (a.avgRating ?? -1) || a.business.name.localeCompare(b.business.name);
        if (sort === "newest") return b.business.created_at.localeCompare(a.business.created_at);
        if (sort === "name") return a.business.name.localeCompare(b.business.name);
        // featured
        if (a.business.featured !== b.business.featured) return a.business.featured ? -1 : 1;
        return a.business.name.localeCompare(b.business.name);
      });
      return copy;
    };
  }, [sort]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { business: b } of businesses) {
      counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    }
    return counts;
  }, [businesses]);

  const locations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { business: b } of businesses) {
      if (!b.location_label) continue;
      counts.set(b.location_label, (counts.get(b.location_label) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [businesses]);

  const groups = useMemo(() => {
    const byLocation = new Map<string, BusinessWithStats[]>();
    const unlabeled: BusinessWithStats[] = [];
    for (const item of filtered) {
      if (!item.business.location_label) {
        unlabeled.push(item);
        continue;
      }
      const list = byLocation.get(item.business.location_label) ?? [];
      list.push(item);
      byLocation.set(item.business.location_label, list);
    }
    const sorted = [...byLocation.entries()].sort(([a], [b]) => a.localeCompare(b));
    if (unlabeled.length > 0) sorted.push(["Other", unlabeled]);
    return sorted.map(([label, items]) => [label, sortItems(items)] as [string, BusinessWithStats[]]);
  }, [filtered, sortItems]);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses…"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <label className="sr-only" htmlFor="business_sort">
            Sort businesses
          </label>
          <select
            id="business_sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="shrink-0 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add business"}
          </Button>
        )}
      </div>

      {/* Categories are the page's main navigation, not another filter chip: a
          directory is browsed by kind first — restaurants, fundis, taxis — so
          the kinds are the biggest thing on it and each carries its own count. */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <CategoryTile
          Icon={LayoutGrid}
          label="Everything"
          detail={countLabel(businesses.length)}
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {chipOptions.map((c) => {
          const count = countByCategory.get(c.value) ?? 0;
          const isCustom = customCategories.some((cc) => cc.slug === c.value);
          const isActive = category === c.value;
          // An empty category is a dead end for a visitor, so it isn't shown at
          // all. Staff keep seeing their own empty categories and anything
          // pinned to the nav, dimmed — otherwise a category could never be
          // reached again to be renamed, deleted or unpinned.
          const staffOnly = isCustom || featured.includes(c.value);
          if (count === 0 && !isActive && !(isStaff && staffOnly)) return null;
          return (
            <CategoryTile
              key={c.value}
              Icon={BUSINESS_CATEGORY_ICONS[c.value] ?? DEFAULT_CATEGORY_ICON}
              label={c.label}
              detail={count > 0 ? countLabel(count) : "Nothing listed yet"}
              active={isActive}
              dimmed={count === 0 && !isActive}
              pinned={featured.includes(c.value)}
              onClick={() => setCategory(isActive ? "all" : c.value)}
            />
          );
        })}
        {isStaff && (
          <button
            type="button"
            onClick={() => {
              setChipError(null);
              setShowCategoryTools((v) => !v);
            }}
            className={`flex flex-col justify-center gap-1.5 rounded-lg border border-dashed p-4 text-left text-sm font-medium ${showCategoryTools ? "border-accent text-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}
          >
            <span className="inline-flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              {showCategoryTools ? "Done editing" : "Edit categories"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">Add, rename, pin to the nav</span>
          </button>
        )}
      </div>

      {/* The staff controls themselves, once asked for. They act on whichever
          category is selected, which is why picking one comes first. */}
      {isStaff && showCategoryTools && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-border p-3">
          {category === "all" && renamingCategory === null && !addingCategory && (
            <span className="text-xs text-muted-foreground">Pick a category above to rename, pin or delete it — or</span>
          )}
          {category !== "all" && renamingCategory === null && (
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
          {category !== "all" && renamingCategory === null && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => startRename(category)}
              title="Rename how this category shows in the nav, tiles and headings"
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <Pencil className="h-3 w-3" />
              Rename
            </button>
          )}
          {renamingCategory !== null && (
            <span className="inline-flex items-center gap-1.5">
              <input
                autoFocus
                value={renameLabel}
                onChange={(e) => setRenameLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRename();
                  }
                  if (e.key === "Escape") setRenamingCategory(null);
                }}
                maxLength={40}
                placeholder="Experiences"
                className="w-36 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                disabled={isPending || !renameLabel.trim()}
                onClick={handleRename}
                className="rounded-full border border-accent bg-accent-soft px-3 py-1 text-xs font-medium text-accent disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setRenamingCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {category !== "all" &&
            renamingCategory === null &&
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
          {!addingCategory && renamingCategory === null && (
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
          {addingCategory && (
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
      )}

      {/* Refinements, below the categories and visibly quieter than them: these
          narrow whatever kind is selected rather than choosing one. */}
      {(canPost && savedCount > 0) || localCount > 0 ? (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {canPost && savedCount > 0 && (
            <button
              type="button"
              onClick={() => setSavedOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${savedOnly ? "border-accent bg-accent-soft text-accent" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              <Heart className={`h-3.5 w-3.5 ${savedOnly ? "fill-accent" : ""}`} />
              Saved <span className="text-muted-foreground/70">{savedCount}</span>
            </button>
          )}
          {localCount > 0 && (
            <button
              type="button"
              onClick={() => setLocalOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${localOnly ? "border-accent bg-accent-soft text-accent" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              <MapPin className={`h-3.5 w-3.5 ${localOnly ? "fill-accent" : ""}`} />
              Locally owned <span className="text-muted-foreground/70">{localCount}</span>
            </button>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            {filtered.length === businesses.length ? countLabel(businesses.length) : `${filtered.length} of ${businesses.length} shown`}
          </span>
        </div>
      ) : null}

      {chipError && <p className="-mt-3 mb-3 text-xs text-danger">{chipError}</p>}

      {/* Where, under what: a narrowing of the chosen kind, so it reads below
          the tiles — but still a comfortable target rather than a 12px pill. */}
      {locations.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLocation("all")}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${location === "all" ? "border-accent bg-accent-soft text-accent" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"}`}
          >
            Anywhere
          </button>
          {locations.map(([label, count]) => {
            const isActive = location === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setLocation(isActive ? "all" : label)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"}`}
              >
                {label} <span className="text-muted-foreground/70">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <NewBusinessForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} userId={userId} customCategories={customCategories} labelOverrides={labelOverrides} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title={businesses.length === 0 ? "No businesses yet" : "Nothing matches"}
          description={businesses.length === 0 ? "Restaurants, cafes, shops and services members add will show up here." : "Try a different search or category."}
        />
      ) : (
        <div className="space-y-8">
          {groups.map(([label, group]) => (
            <div key={label}>
              {/* The place name has to carry the scroll: at card-title size it
                  disappeared between the listings above and below it. It reads
                  as a section header now — large, pinned to a rule, with the
                  count so a group's size is clear before scrolling it. */}
              {groups.length > 1 && (
                <div className="mb-3 border-b border-border pb-1.5">
                  <h3 className="flex items-baseline gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <MapPin className="h-5 w-5 shrink-0 self-center text-accent sm:h-6 sm:w-6" />
                    {label}
                    <span className="text-base font-medium text-muted-foreground">({group.length})</span>
                  </h3>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {group.map((item) => (
                  <BusinessCard
                    key={item.business.id}
                    data={item}
                    communitySlug={communitySlug}
                    spaceSlug={spaceSlug}
                    canSave={canPost}
                    customCategories={customCategories}
                    labelOverrides={labelOverrides}
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
