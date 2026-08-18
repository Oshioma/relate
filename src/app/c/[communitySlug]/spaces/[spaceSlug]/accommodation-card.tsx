"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MapPin, Building2, Images, BedDouble, Heart } from "lucide-react";
import { accommodationTypeLabel, accommodationPhotos, formatAccommodationPrice, accommodationFactsSummary } from "@/lib/accommodation-types";
import { StarRatingDisplay } from "./star-rating";
import { toggleSaveAccommodation } from "./accommodation-actions";
import type { AccommodationListingWithStats } from "@/lib/data/accommodation";

// A stay card is a link into the listing's own page (like business-card and
// guide-card). It shows the cover photo with a photo count, the type, price,
// name, a short description and a save toggle. Editing, availability and
// deletion all live on the detail page.
export function AccommodationCard({
  listing,
  communitySlug,
  spaceSlug,
  canSave,
}: {
  listing: AccommodationListingWithStats;
  communitySlug: string;
  spaceSlug: string;
  canSave: boolean;
}) {
  const isUnavailable = listing.status === "unavailable";
  const price = formatAccommodationPrice(listing);
  const photos = accommodationPhotos(listing);
  const facts = accommodationFactsSummary(listing);
  const [saved, setSaved] = useState(listing.saved);
  const [isPending, startTransition] = useTransition();

  function handleSaveToggle(e: React.MouseEvent) {
    // The card is a Link — keep the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    const optimistic = !saved;
    setSaved(optimistic);
    startTransition(async () => {
      const result = await toggleSaveAccommodation(listing.id, communitySlug, spaceSlug);
      if ("saved" in result && typeof result.saved === "boolean") setSaved(result.saved);
      else setSaved(!optimistic); // revert on error
    });
  }

  return (
    <Link
      href={`/c/${communitySlug}/spaces/${spaceSlug}/stays/${listing.slug ?? listing.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {photos.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[0]}
            alt={listing.name}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isUnavailable ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft to-muted">
            <BedDouble className="h-10 w-10 text-accent/50" />
          </div>
        )}

        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          <BedDouble className="h-3 w-3" />
          {accommodationTypeLabel(listing.accommodation_type)}
        </span>

        {price && (
          <span className="absolute right-2 top-2 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">{price}</span>
        )}

        {canSave && (
          <button
            type="button"
            onClick={handleSaveToggle}
            disabled={isPending}
            title={saved ? "Remove from saved" : "Save"}
            aria-pressed={saved}
            className={`absolute p-1.5 text-white transition disabled:opacity-60 ${price ? "right-2 top-10" : "right-2 top-2"} rounded-full bg-black/45 hover:bg-black/65`}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
          </button>
        )}

        {photos.length > 1 && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
            <Images className="h-3 w-3" />
            {photos.length}
          </span>
        )}

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <span className="rounded-md bg-card px-3 py-1 text-sm font-bold tracking-wide text-foreground shadow-lg">UNAVAILABLE</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">{listing.name}</h3>

        {listing.ratingCount > 0 && (
          <div className="mt-1">
            <StarRatingDisplay value={listing.avgRating} count={listing.ratingCount} />
          </div>
        )}

        {listing.business?.name && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {listing.business.name}
          </p>
        )}

        {facts && <p className="mt-1 text-xs text-muted-foreground">{facts}</p>}

        {listing.description && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{listing.description}</p>}

        {listing.location_label && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.location_label}
          </p>
        )}
      </div>
    </Link>
  );
}
