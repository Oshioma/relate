"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, ExternalLink, MoreVertical, Pencil, Trash2, RotateCcw, CircleCheck, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import { deleteAccommodationListing, setAccommodationStatus } from "./accommodation-actions";
import { EditAccommodationForm } from "./edit-accommodation-form";
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

// Prefer the gallery; fall back to the denormalised cover for rows created
// before photo_urls existed and not yet backfilled.
function listingPhotos(listing: AccommodationListingWithBusiness): string[] {
  if (listing.photo_urls.length > 0) return listing.photo_urls;
  return listing.photo_url ? [listing.photo_url] : [];
}

export function AccommodationCard({
  listing,
  communitySlug,
  spaceSlug,
  canManage,
  userId,
}: {
  listing: AccommodationListingWithBusiness;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const router = useRouter();
  const isUnavailable = listing.status === "unavailable";
  const price = formatPricePerNight(listing);
  const photos = listingPhotos(listing);
  const current = Math.min(photoIndex, Math.max(0, photos.length - 1));

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

  if (editing) {
    return (
      <div className="sm:col-span-2 lg:col-span-3">
        <EditAccommodationForm
          listing={listing}
          communitySlug={communitySlug}
          spaceSlug={spaceSlug}
          userId={userId}
          onDone={() => {
            setEditing(false);
            router.refresh();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md ${isPending ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {photos.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[current]}
            alt={listing.name}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isUnavailable ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft to-muted">
            <BedDouble className="h-10 w-10 text-accent/50" />
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setPhotoIndex((current - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/65"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setPhotoIndex((current + 1) % photos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/65"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => setPhotoIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
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
                  <button type="button" onClick={() => { setMenuOpen(false); setEditing(true); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
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
