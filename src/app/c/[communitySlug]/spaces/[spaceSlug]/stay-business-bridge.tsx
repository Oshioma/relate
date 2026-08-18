"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { createBusinessFromStay } from "./accommodation-actions";
import { businessCategoryOptions } from "@/lib/business-categories";
import type { BusinessCustomCategory, BusinessCategoryLabelOverride } from "@/types/database";

// The Accommodation → Business Directory bridge, and the mirror of
// business-stay-bridge.tsx. A hotel with a restaurant, a guesthouse with a
// dive shop, a hostel with a bar: places that belong in both halves of the
// community. If a directory listing is already linked, this points at it;
// otherwise whoever manages the stay picks a category and creates one, linked
// back, so the pair stay a single place rather than two unrelated copies.
export function StayBusinessBridge({
  listingId,
  communitySlug,
  linkedBusiness,
  canCreate,
  customCategories,
  labelOverrides,
}: {
  listingId: string;
  communitySlug: string;
  linkedBusiness: { spaceSlug: string; id: string; name: string } | null;
  // The viewer manages this stay and the community has a directory to add to.
  canCreate: boolean;
  customCategories: BusinessCustomCategory[];
  labelOverrides?: BusinessCategoryLabelOverride[];
}) {
  // Restaurant is the overwhelmingly common reason a stay also belongs in the
  // directory, so it leads — but every category the space offers is available.
  const [category, setCategory] = useState("restaurant");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createBusinessFromStay(listingId, category, communitySlug);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push(`/c/${communitySlug}/spaces/${result.spaceSlug}/businesses/${result.businessId}`);
      }
    });
  }

  if (linkedBusiness) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 text-accent" />
          This place is in the directory too, with its own hours and reviews.
        </p>
        <Link
          href={`/c/${communitySlug}/spaces/${linkedBusiness.spaceSlug}/businesses/${linkedBusiness.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View listing <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  if (!canCreate) return null;

  // Collapsed by default: this is a small piece of admin for the host, so it
  // sits at the foot of the page as one quiet line and only unfolds the
  // explanation and category picker when they're actually interested.
  if (!showForm) {
    return (
      <div className="border-t border-border pt-4">
        <button type="button" onClick={() => setShowForm(true)} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Is this a restaurant too?
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Building2 className="h-4 w-4 text-accent" />
        Is this a restaurant too?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Somewhere that also serves the public — a hotel restaurant, a beach bar, a dive shop — can appear in the directory as well, with its own opening hours and reviews. It stays linked to this listing.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Directory category"
          disabled={isPending}
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        >
          {businessCategoryOptions(customCategories, labelOverrides).map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={isPending}
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
        >
          <Building2 className="h-4 w-4" />
          {isPending ? "Adding…" : "Add to the directory"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowForm(false)}
          className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          Cancel
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
