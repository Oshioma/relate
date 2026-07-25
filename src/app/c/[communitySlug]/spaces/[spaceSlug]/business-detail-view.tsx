"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Store, BadgeCheck, Star, Pencil, Trash2, Globe, Phone, MapPin, Clock, Navigation, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { businessCategoryLabel } from "@/lib/business-categories";
import { getListingOpenState } from "@/lib/opening-hours";
import { StarRatingDisplay } from "./star-rating";
import { ImageCarousel } from "./image-carousel";
import { EditBusinessForm } from "./edit-business-form";
import { BusinessReviewForm } from "./business-review-form";
import { BusinessReviewItem } from "./business-review-item";
import { BusinessClaimSection } from "./business-claim-section";
import { deleteBusiness, setBusinessBadge, toggleSaveBusiness } from "./business-directory-actions";
import type { BusinessDetail } from "@/lib/data/businesses";
import type { BusinessCustomCategory, BusinessCategoryLabelOverride } from "@/types/database";

// Leaflet touches `window` at import time, so the map only loads in the browser —
// same pattern as the location picker in the form fields.
const StaticMap = dynamic(() => import("@/components/map/static-map"), {
  ssr: false,
  loading: () => <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground">Loading map…</div>,
});

// Google Maps directions link — prefer precise coordinates, fall back to the
// typed address so the button still works for listings without a pin.
function directionsUrl(lat: number | null, lng: number | null, address: string | null, name: string): string {
  const query = lat !== null && lng !== null ? `${lat},${lng}` : address || name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function BusinessDetailView({
  detail,
  communityId,
  communitySlug,
  spaceSlug,
  userId,
  canManage,
  isStaff,
  canReview,
  canReply,
  canSave,
  canClaim,
  customCategories,
  labelOverrides,
}: {
  detail: BusinessDetail;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  // May edit/delete and manage photos: the owner (claimed_by), or the adder
  // while unclaimed, plus staff and super admins. Verify/feature stay staff-only.
  canManage: boolean;
  isStaff: boolean;
  // An active member who didn't add and doesn't own the listing — may review.
  canReview: boolean;
  // Whoever manages the listing — may reply to reviews on its behalf.
  canReply: boolean;
  // Any active member — may bookmark the listing.
  canSave: boolean;
  // Active member, listing unclaimed, and no existing claim of their own.
  canClaim: boolean;
  customCategories: BusinessCustomCategory[];
  labelOverrides?: BusinessCategoryLabelOverride[];
}) {
  const { business, images, reviews, avgRating, ratingCount, viewerReview, viewerClaim, pendingClaims } = detail;
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(detail.saved);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openState = getListingOpenState(business.opening_hours_structured, business.opening_hours);

  function toggleBadge(field: "verified" | "featured") {
    setError(null);
    startTransition(async () => {
      const result = await setBusinessBadge(business.id, field, !business[field], communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Remove "${business.name}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBusiness(business.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
    });
  }

  function handleSaveToggle() {
    const optimistic = !saved;
    setSaved(optimistic);
    startTransition(async () => {
      const result = await toggleSaveBusiness(business.id, communitySlug, spaceSlug);
      if ("saved" in result && typeof result.saved === "boolean") setSaved(result.saved);
      else setSaved(!optimistic);
    });
  }

  if (isEditing) {
    return (
      <EditBusinessForm
        business={business}
        images={images}
        communitySlug={communitySlug}
        spaceSlug={spaceSlug}
        userId={userId}
        customCategories={customCategories}
        labelOverrides={labelOverrides}
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
        {images.length > 0 ? (
          <ImageCarousel images={images} alt={business.name} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
            <Store className="h-10 w-10" />
          </div>
        )}

        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{business.name}</h1>
                {business.verified && (
                  <span title="Verified" className="text-accent">
                    <BadgeCheck className="h-5 w-5" />
                  </span>
                )}
                {business.featured && <Badge tone="accent">Featured</Badge>}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{businessCategoryLabel(business.category, customCategories, labelOverrides)}</p>
              <div className="mt-1.5">
                <StarRatingDisplay value={avgRating} count={ratingCount} />
              </div>
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
                <button type="button" onClick={() => setIsEditing(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Edit listing">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {canManage && (
                <button type="button" disabled={isPending} onClick={handleDelete} className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-60" title="Remove listing">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {business.description && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{business.description}</p>}

          {/* Quick actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent">
                <Phone className="h-4 w-4" /> Call
              </a>
            )}
            {(business.address || (business.lat !== null && business.lng !== null)) && (
              <a
                href={directionsUrl(business.lat, business.lng, business.address, business.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent"
              >
                <Navigation className="h-4 w-4" /> Directions
              </a>
            )}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
          </div>

          {/* Details */}
          <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {business.location_label && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {business.location_label}
              </p>
            )}
            {business.address && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {business.address}
              </p>
            )}
            {business.opening_hours && (
              <p className="flex flex-wrap items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" /> {business.opening_hours}
                {openState === "open" && <Badge tone="accent">Open now</Badge>}
                {openState === "closed" && <Badge tone="neutral">Closed</Badge>}
              </p>
            )}
          </div>

          {business.lat !== null && business.lng !== null && (
            <div className="mt-4">
              <StaticMap lat={business.lat} lng={business.lng} />
            </div>
          )}

          {isStaff && (
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => toggleBadge("verified")}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {business.verified ? "Unverify" : "Verify"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => toggleBadge("featured")}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
              >
                <Star className="h-3.5 w-3.5" />
                {business.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        </CardContent>
      </Card>

      {/* Reviews */}
      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Reviews {ratingCount > 0 && `(${ratingCount})`}
        </h2>

        {canReview && (
          <div className="mb-4">
            <BusinessReviewForm businessId={business.id} communitySlug={communitySlug} spaceSlug={spaceSlug} existing={viewerReview} />
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((review) => (
            <BusinessReviewItem
              key={review.id}
              review={review}
              businessId={business.id}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canDeleteReview={isStaff || review.author_id === userId}
              canReply={canReply}
            />
          ))}
          {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first to leave one.</p>}
        </div>

        <BusinessClaimSection
          businessId={business.id}
          communityId={communityId}
          communitySlug={communitySlug}
          spaceSlug={spaceSlug}
          canClaim={canClaim}
          isStaff={isStaff}
          viewerClaim={viewerClaim}
          pendingClaims={pendingClaims}
        />
      </div>
    </div>
  );
}
