"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, ExternalLink, MoreVertical, Trash2, RotateCcw, CircleCheck, BedDouble } from "lucide-react";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import { deleteAccommodationListing, setAccommodationStatus } from "./accommodation-actions";
import type { AccommodationListingWithBusiness } from "@/lib/data/accommodation";

function formatPricePerNight(listing: AccommodationListingWithBusiness): string | null {
  if (listing.price_per_night === null) return null;
  try {
    const amount = new Intl.NumberFormat(undefined, { style: "currency", currency: listing.currency || "USD", maximumFractionDigits: 0 }).format(
      listing.price_per_night
    );
    return `${amount} / night`;
  } catch {
    return `${listing.currency ?? ""} ${listing.price_per_night} / night`.trim();
  }
}

export function AccommodationCard({
  listing,
  communitySlug,
  spaceSlug,
  canManage,
}: {
  listing: AccommodationListingWithBusiness;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const isUnavailable = listing.status === "unavailable";
  const price = formatPricePerNight(listing);

  function toggleAvailability() {
    setMenuOpen(false);
    startTransition(async () => {
      await setAccommodationStatus(listing.id, isUnavailable ? "available" : "unavailable", communitySlug, spaceSlug);
      router.refresh();
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm(`Remove "${listing.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteAccommodationListing(listing.id, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  return (
    <div className={`group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md ${isPending ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
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

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <span className="rounded-md bg-card px-3 py-1 text-sm font-bold tracking-wide text-foreground shadow-lg">UNAVAILABLE</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">{listing.name}</h3>
          {canManage && (
            <div className="relative shrink-0">
              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" title="Manage listing">
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-10 w-44 overflow-hidden rounded-md border border-border bg-card shadow-lg">
                  <button type="button" disabled={isPending} onClick={toggleAvailability} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:opacity-60">
                    {isUnavailable ? <RotateCcw className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                    {isUnavailable ? "Mark available" : "Mark unavailable"}
                  </button>
                  <button type="button" disabled={isPending} onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/10 disabled:opacity-60">
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {listing.business?.name && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {listing.business.name}
          </p>
        )}

        {listing.description && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{listing.description}</p>}

        {listing.location_label && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.location_label}
          </p>
        )}

        {listing.booking_url && (
          <a
            href={listing.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 border-t border-border pt-2.5 text-xs font-medium text-accent hover:underline"
          >
            Book
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
