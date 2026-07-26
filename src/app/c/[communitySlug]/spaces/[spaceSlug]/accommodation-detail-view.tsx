"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BedDouble, Building2, MapPin, Navigation, ExternalLink, Pencil, Trash2, RotateCcw, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { accommodationTypeLabel, accommodationPhotos, formatAccommodationPrice } from "@/lib/accommodation-types";
import { ImageCarousel } from "./image-carousel";
import { EditAccommodationForm } from "./edit-accommodation-form";
import { deleteAccommodationListing, setAccommodationStatus } from "./accommodation-actions";
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
}: {
  detail: AccommodationDetail;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  canManage: boolean;
}) {
  const { listing } = detail;
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const photos = accommodationPhotos(listing).map((url, i) => ({ id: String(i), url, position: null }));
  const price = formatAccommodationPrice(listing);
  const isUnavailable = listing.status === "unavailable";

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
              {price && <p className="mt-1.5 text-sm font-semibold text-foreground">{price}</p>}
            </div>

            {canManage && (
              <div className="flex shrink-0 items-center gap-1.5">
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
              </div>
            )}
          </div>

          {listing.business?.name && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {listing.business.name}
            </p>
          )}

          {listing.description && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{listing.description}</p>}

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
    </div>
  );
}
