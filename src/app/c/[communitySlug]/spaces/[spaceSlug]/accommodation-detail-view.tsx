"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BedDouble, Building2, MapPin, Navigation, ExternalLink, Pencil, Trash2, RotateCcw, CircleCheck, Heart, Users, Bath, CalendarDays, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { accommodationTypeLabel, accommodationPhotos, formatAccommodationPrice, amenityLabel, formatAvailabilityWindow } from "@/lib/accommodation-types";
import { StarRatingDisplay } from "./star-rating";
import { ImageCarousel } from "./image-carousel";
import { EditAccommodationForm } from "./edit-accommodation-form";
import { AccommodationReviewForm } from "./accommodation-review-form";
import { AccommodationReviewItem } from "./accommodation-review-item";
import { deleteAccommodationListing, setAccommodationStatus, toggleSaveAccommodation } from "./accommodation-actions";
import type { AccommodationDetail } from "@/lib/data/accommodation";

const StaticMap = dynamic(() => import("@/components/map/static-map"), {
  ssr: false,
  loading: () => <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

function directionsUrl(lat: number | null, lng: number | null, label: string | null, name: string): string {
  const query = lat !== null && lng !== null ? `${lat},${lng}` : label || name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function AccommodationDetailView({
  detail,
  communitySlug,
  spaceSlug,
  userId,
  canManage,
  canSave,
  canReview,
  canReply,
  isStaff,
}: {
  detail: AccommodationDetail;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  canManage: boolean;
  canSave: boolean;
  // An active member who isn't the host — may review.
  canReview: boolean;
  // The host or staff — may reply to reviews.
  canReply: boolean;
  isStaff: boolean;
}) {
  const { listing, reviews, avgRating, ratingCount, viewerReview } = detail;
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(detail.saved);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSaveToggle() {
    const optimistic = !saved;
    setSaved(optimistic);
    startTransition(async () => {
      const result = await toggleSaveAccommodation(listing.id, communitySlug, spaceSlug);
      if ("saved" in result && typeof result.saved === "boolean") setSaved(result.saved);
      else setSaved(!optimistic);
    });
  }

  const photos = accommodationPhotos(listing).map((url, i) => ({ id: String(i), url, position: null }));
  const price = formatAccommodationPrice(listing);
  const isUnavailable = listing.status === "unavailable";
  const availability = formatAvailabilityWindow(listing);

  function toggleAvailability() {
    setError(null);
    startTransition(async () => {
      const result = await setAccommodationStatus(listing.id, isUnavailable ? "available" : "unavailable", communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Remove "${listing.name}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAccommodationListing(listing.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
    });
  }

  if (isEditing) {
    return (
      <EditAccommodationForm
        listing={listing}
        communitySlug={communitySlug}
        spaceSlug={spaceSlug}
        userId={userId}
        onDone={() => {
          setIsEditing(false);
          router.refresh();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        {photos.length > 0 ? (
          <ImageCarousel images={photos} alt={listing.name} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
            <BedDouble className="h-10 w-10" />
          </div>
        )}

        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{listing.name}</h1>
                {isUnavailable && <Badge tone="neutral">Unavailable</Badge>}
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <BedDouble className="h-4 w-4" />
                {accommodationTypeLabel(listing.accommodation_type)}
              </p>
              <div className="mt-1.5">
                <StarRatingDisplay value={avgRating} count={ratingCount} />
              </div>
              {price && <p className="mt-1.5 text-sm font-semibold text-foreground">{price}</p>}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {canSave && (
                <button
                  type="button"
                  onClick={handleSaveToggle}
                  disabled={isPending}
                  title={saved ? "Remove from saved" : "Save"}
                  aria-pressed={saved}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-60"
                >
                  <Heart className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
                </button>
              )}
              {canManage && (
                <>
                  <button type="button" onClick={() => setIsEditing(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Edit listing">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={toggleAvailability}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-60"
                    title={isUnavailable ? "Mark available" : "Mark unavailable"}
                  >
                    {isUnavailable ? <RotateCcw className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleDelete}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-60"
                    title="Remove listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {listing.business?.name && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {listing.business.name}
            </p>
          )}

          {(listing.bedrooms !== null || listing.bathrooms !== null || listing.max_guests !== null) && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground">
              {listing.bedrooms !== null && (
                <span className="flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-muted-foreground" /> {listing.bedrooms} {listing.bedrooms === 1 ? "bedroom" : "bedrooms"}
                </span>
              )}
              {listing.bathrooms !== null && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-muted-foreground" /> {listing.bathrooms} {listing.bathrooms === 1 ? "bathroom" : "bathrooms"}
                </span>
              )}
              {listing.max_guests !== null && (
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" /> Sleeps {listing.max_guests}
                </span>
              )}
            </div>
          )}

          {availability && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
              <CalendarDays className="h-4 w-4 text-muted-foreground" /> {availability}
            </p>
          )}

          {listing.description && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{listing.description}</p>}

          {listing.amenities.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {listing.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                    <Check className="h-3 w-3 text-accent" /> {amenityLabel(a)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {listing.booking_url && (
              <a
                href={listing.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent"
              >
                <ExternalLink className="h-4 w-4" /> Book
              </a>
            )}
            {(listing.location_label || (listing.lat !== null && listing.lng !== null)) && (
              <a
                href={directionsUrl(listing.lat, listing.lng, listing.location_label, listing.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            )}
          </div>

          {listing.location_label && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> {listing.location_label}
            </p>
          )}

          {listing.lat !== null && listing.lng !== null && (
            <div className="mt-4">
              <StaticMap lat={listing.lat} lng={listing.lng} emoji="🛏️" />
            </div>
          )}

          {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Reviews {ratingCount > 0 && `(${ratingCount})`}
        </h2>

        {canReview && (
          <div className="mb-4">
            <AccommodationReviewForm listingId={listing.id} communitySlug={communitySlug} spaceSlug={spaceSlug} existing={viewerReview} />
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((review) => (
            <AccommodationReviewItem
              key={review.id}
              review={review}
              listingId={listing.id}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canDeleteReview={isStaff || review.author_id === userId}
              canReply={canReply}
            />
          ))}
          {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first to leave one.</p>}
        </div>
      </div>
    </div>
  );
}
