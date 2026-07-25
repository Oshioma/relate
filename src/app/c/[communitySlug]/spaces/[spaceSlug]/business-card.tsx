"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BadgeCheck, Store, Images, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { businessCategoryLabel } from "@/lib/business-categories";
import { StarRatingDisplay } from "./star-rating";
import { toggleSaveBusiness } from "./business-directory-actions";
import type { BusinessWithStats } from "@/lib/data/businesses";
import type { BusinessCustomCategory, BusinessCategoryLabelOverride } from "@/types/database";

// A directory card is now a link into the listing's own page (like guide-card).
// It shows the cover photo with a photo count, the name/category, review score,
// verified/featured badges and a save toggle. All management (edit, delete,
// verify, feature) lives on the detail page.
export function BusinessCard({
  data,
  communitySlug,
  spaceSlug,
  canSave,
  customCategories,
  labelOverrides,
}: {
  data: BusinessWithStats;
  communitySlug: string;
  spaceSlug: string;
  canSave: boolean;
  customCategories: BusinessCustomCategory[];
  labelOverrides?: BusinessCategoryLabelOverride[];
}) {
  const { business, avgRating, ratingCount, imageCount } = data;
  const [saved, setSaved] = useState(data.saved);
  const [isPending, startTransition] = useTransition();

  function handleSaveToggle(e: React.MouseEvent) {
    // The card is a Link — keep the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    const optimistic = !saved;
    setSaved(optimistic);
    startTransition(async () => {
      const result = await toggleSaveBusiness(business.id, communitySlug, spaceSlug);
      if ("saved" in result && typeof result.saved === "boolean") {
        setSaved(result.saved);
      } else {
        setSaved(!optimistic); // revert on error
      }
    });
  }

  return (
    <Link href={`/c/${communitySlug}/spaces/${spaceSlug}/businesses/${business.id}`} className="block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-sm">
        <div className="relative h-44 w-full bg-muted">
          {business.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.image_url}
              alt={business.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: business.image_position ?? "50% 50%" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Store className="h-8 w-8" />
            </div>
          )}
          {imageCount > 1 && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
              <Images className="h-3 w-3" />
              {imageCount}
            </span>
          )}
          {canSave && (
            <button
              type="button"
              onClick={handleSaveToggle}
              disabled={isPending}
              title={saved ? "Remove from saved" : "Save"}
              aria-pressed={saved}
              className="absolute right-2 top-2 rounded-full bg-black/45 p-1.5 text-white transition hover:bg-black/65 disabled:opacity-60"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
            </button>
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">{business.name}</h3>
            {business.verified && (
              <span title="Verified" className="text-accent">
                <BadgeCheck className="h-4 w-4" />
              </span>
            )}
            {business.featured && <Badge tone="accent">Featured</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{businessCategoryLabel(business.category, customCategories, labelOverrides)}</p>

          {business.description && <p className="mt-2 line-clamp-2 text-sm text-foreground">{business.description}</p>}

          <div className="mt-3 flex items-center justify-between gap-2">
            <StarRatingDisplay value={avgRating} count={ratingCount} />
            {business.location_label && <span className="truncate text-xs text-muted-foreground">{business.location_label}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
