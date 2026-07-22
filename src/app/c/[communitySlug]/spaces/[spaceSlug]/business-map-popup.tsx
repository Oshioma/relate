"use client";

import { useEffect, useState, useTransition } from "react";
import { BadgeCheck, Clock, ExternalLink, Globe, MapPin, Navigation, Phone, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { businessCategoryLabel } from "@/lib/business-categories";
import { getBusinessGoogleInfo, type BusinessGoogleInfo } from "./business-google-actions";
import type { Business } from "@/types/database";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
    </span>
  );
}

function GoogleSection({ info, loading }: { info: BusinessGoogleInfo | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="mt-3 space-y-2 border-t border-border pt-3" aria-hidden>
        <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!info || (info.rating === null && info.reviews.length === 0)) return null;

  return (
    <div className="mt-3 border-t border-border pt-3">
      {info.rating !== null && (
        <div className="flex items-center gap-1.5">
          <Stars value={info.rating} />
          <span className="text-xs font-medium text-foreground">{info.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            {info.reviewCount !== null ? `(${info.reviewCount}) ` : ""}on Google
          </span>
        </div>
      )}

      {info.reviews.slice(0, 2).map((review, i) => (
        <figure key={i} className="mt-2 rounded-md bg-muted px-2.5 py-2">
          <blockquote className="line-clamp-3 text-xs leading-relaxed text-foreground">“{review.text}”</blockquote>
          <figcaption className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {review.rating} · {review.author}
            {review.relative_time && ` · ${review.relative_time}`}
          </figcaption>
        </figure>
      ))}

      {info.mapsUrl && (
        <a
          href={info.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          More on Google
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

// Rich card shown when a business pin is clicked. Leaflet mounts popup
// content on open, so the effect below doubles as an "on open" hook — it
// serves the cached google_* columns instantly and lets the server action
// refresh them when stale.
export function BusinessMapPopup({ business }: { business: Business }) {
  const [isPending, startTransition] = useTransition();
  const [info, setInfo] = useState<BusinessGoogleInfo | null>(() =>
    business.google_synced_at !== null
      ? {
          rating: business.google_rating,
          reviewCount: business.google_review_count,
          reviews: business.google_reviews ?? [],
          mapsUrl: business.google_maps_url,
        }
      : null
  );

  useEffect(() => {
    startTransition(async () => {
      const fresh = await getBusinessGoogleInfo(business.id);
      if (fresh) setInfo(fresh);
    });
  }, [business.id]);

  const directionsUrl =
    business.lat !== null && business.lng !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`
      : null;

  return (
    <div className="w-[280px] font-sans">
      <div className="h-28 w-full bg-muted">
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
            <Store className="h-7 w-7" />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="text-sm font-semibold leading-snug text-foreground">{business.name}</h3>
          {business.verified && (
            <span title="Verified" className="text-accent">
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
          {business.featured && <Badge tone="accent">Featured</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{businessCategoryLabel(business.category)}</p>

        {business.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground">{business.description}</p>}

        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {(business.address || business.location_label) && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{business.address ?? business.location_label}</span>
            </p>
          )}
          {business.opening_hours && (
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{business.opening_hours}</span>
            </p>
          )}
        </div>

        <GoogleSection info={info} loading={isPending && info === null} />

        <div className="mt-3 flex gap-1.5">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium hover:opacity-90"
              style={{ color: "var(--accent-foreground)" }}
            >
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </a>
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
