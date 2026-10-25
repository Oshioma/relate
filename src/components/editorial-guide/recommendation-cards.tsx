import { BedDouble, ExternalLink, Info, MapPin, Navigation, Star, Store, UtensilsCrossed, Waves, AtSign } from "lucide-react";
import type { RestaurantRecommendation, StayRecommendation } from "@/lib/guides/where-to-stay/types";
import { POSITION_LABELS } from "@/lib/guides/where-to-stay/labels";
import type { GuideListing } from "@/lib/data/editorial-guides";
import { GuideImage } from "./guide-image";

import { Anchor } from "@/components/ui/link";
// Restaurant and accommodation recommendation cards.
//
// When a recommendation matches one of the community's own listings, the
// listing is the canonical record: its photo, its location and its real
// community reviews, and the card links straight to it (where people can save
// and review it). When it doesn't, the card still recommends the place on
// its merits — website, directions — and separately invites the business to
// list itself. Being recommended never depends on being listed.

function directionsUrl(name: string, area: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}, Zanzibar`)}`;
}

function CommunityRating({ listing }: { listing: GuideListing }) {
  if (!listing.ratingCount || listing.avgRating === null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden />
      {listing.avgRating.toFixed(1)} from {listing.ratingCount} community {listing.ratingCount === 1 ? "review" : "reviews"}
    </span>
  );
}

function CardShell({
  image,
  imageAlt,
  fallbackIcon,
  children,
}: {
  image: string | null;
  imageAlt: string;
  fallbackIcon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {image ? (
        <GuideImage src={image} alt={imageAlt} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
      ) : (
        <div className="flex h-14 items-center gap-2 border-b border-border bg-muted px-4 text-muted-foreground" aria-hidden>
          {fallbackIcon}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </article>
  );
}

function Notes({ disclosure, verificationNote }: { disclosure?: string | null; verificationNote?: string | null }) {
  return (
    <>
      {disclosure && (
        <p className="mt-3 rounded-md bg-accent-soft px-2.5 py-1.5 text-xs text-accent">
          <span className="font-semibold">Disclosure:</span> {disclosure}
        </p>
      )}
      {verificationNote && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {verificationNote}
        </p>
      )}
    </>
  );
}

const linkClass = "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted";

export function RestaurantCard({
  rec,
  listing,
  listYourBusinessHref,
}: {
  rec: RestaurantRecommendation;
  listing: GuideListing | null;
  listYourBusinessHref: string | null;
}) {
  const website = rec.website ?? listing?.website ?? null;
  const directions = rec.mapsUrl ?? listing?.mapsUrl ?? directionsUrl(rec.name, rec.area);
  return (
    <CardShell image={listing?.imageUrl ?? null} imageAlt={`${rec.name}, ${rec.area}`} fallbackIcon={<><UtensilsCrossed className="h-4 w-4" /><span className="text-xs">Restaurant</span></>}>
      <h4 className="text-base font-semibold text-foreground">{rec.name}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {rec.cuisine} · <span className="font-medium text-foreground">{rec.price}</span>
      </p>
      <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          {rec.area}
          {rec.nearby && <span className="font-medium text-foreground"> · Nearby: {rec.nearby}</span>}
        </span>
      </p>
      {listing && <div className="mt-1"><CommunityRating listing={listing} /></div>}
      <p className="mt-3 text-sm text-foreground">
        <span className="font-medium">Why we recommend it: </span>
        {rec.why}
      </p>
      {rec.bestFor.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Best for:</span> {rec.bestFor.join(", ")}
        </p>
      )}
      <Notes disclosure={rec.disclosure} verificationNote={rec.verificationNote} />
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {listing && (
          <Anchor href={listing.href} className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:opacity-90">
            <Store className="h-3.5 w-3.5" aria-hidden /> Save, review &amp; details
          </Anchor>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Website
          </a>
        )}
        {rec.social && (
          <a href={rec.social} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <AtSign className="h-3.5 w-3.5" aria-hidden /> Social
          </a>
        )}
        <a href={directions} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Navigation className="h-3.5 w-3.5" aria-hidden /> Directions
        </a>
      </div>
      {!listing && listYourBusinessHref && (
        <p className="mt-3 text-xs text-muted-foreground">
          Run {rec.name}?{" "}
          <Anchor href={listYourBusinessHref} className="font-medium text-accent hover:underline">
            Add it to the Mzungu Zanzibar directory
          </Anchor>{" "}
          — free, and never a condition of being recommended.
        </p>
      )}
    </CardShell>
  );
}

export function StayCard({
  rec,
  listing,
  listYourStayHref,
}: {
  rec: StayRecommendation;
  listing: GuideListing | null;
  listYourStayHref: string | null;
}) {
  const website = rec.website ?? listing?.website ?? null;
  return (
    <CardShell image={listing?.imageUrl ?? null} imageAlt={`${rec.name}`} fallbackIcon={<><BedDouble className="h-4 w-4" /><span className="text-xs">{rec.type}</span></>}>
      <h4 className="text-base font-semibold text-foreground">{rec.name}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {rec.type} · <span className="font-medium text-foreground">{rec.price}</span>
      </p>
      <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
        <Waves className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          <span className="font-medium text-foreground">{POSITION_LABELS[rec.position]}</span>
          {rec.positionNote && <> — {rec.positionNote}</>}
        </span>
      </p>
      {listing && <div className="mt-1"><CommunityRating listing={listing} /></div>}
      <p className="mt-3 text-sm text-foreground">
        <span className="font-medium">Worth considering: </span>
        {rec.why}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Suits:</span> {rec.suits}
      </p>
      <Notes disclosure={rec.disclosure} verificationNote={rec.verificationNote} />
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {listing && (
          <Anchor href={listing.href} className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:opacity-90">
            <BedDouble className="h-3.5 w-3.5" aria-hidden /> Save, review &amp; details
          </Anchor>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Official website
          </a>
        )}
      </div>
      {!listing && listYourStayHref && (
        <p className="mt-3 text-xs text-muted-foreground">
          Run {rec.name}?{" "}
          <Anchor href={listYourStayHref} className="font-medium text-accent hover:underline">
            List it on Mzungu Zanzibar
          </Anchor>
          .
        </p>
      )}
    </CardShell>
  );
}

export function DirectoryChips({ title, listings }: { title: string; listings: GuideListing[] }) {
  if (listings.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {listings.map((l) => (
          <li key={`${l.kind}:${l.slug}`}>
            <Anchor href={l.href} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-muted">
              {l.kind === "stay" ? <BedDouble className="h-3 w-3" aria-hidden /> : <Store className="h-3 w-3" aria-hidden />}
              {l.name}
            </Anchor>
          </li>
        ))}
      </ul>
    </div>
  );
}
