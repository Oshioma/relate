import Image from "next/image";
import { BedDouble, ExternalLink, MapPin, Users } from "lucide-react";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import type { PlacedPartnerStay } from "@/lib/zanzibar-rooms/directory";

// A Zanzibar Rooms stay in the accommodation directory's grid: laid out like
// AccommodationCard, but badged as a partner listing and linking out to the
// stay on Zanzibar Rooms in a new tab (no save, share or detail page here).
export function PartnerStayCard({ stay }: { stay: PlacedPartnerStay }) {
  return (
    <a
      href={stay.url}
      target="_blank"
      rel="noopener"
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {stay.photoUrl ? (
          <Image
            src={stay.photoUrl}
            alt={stay.photoAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft to-muted">
            <BedDouble className="h-10 w-10 text-accent/50" />
          </div>
        )}

        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          <BedDouble className="h-3 w-3" />
          {accommodationTypeLabel(stay.type)}
        </span>

        <span className="absolute right-2 top-2 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">{stay.priceLabel}</span>

        <span className="absolute bottom-2 left-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white shadow-sm">Zanzibar Rooms</span>
      </div>

      <div className="p-3.5">
        <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">{stay.name}</h3>

        {stay.maxGuests !== null && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            Up to {stay.maxGuests} {stay.maxGuests === 1 ? "guest" : "guests"}
          </p>
        )}

        {stay.summary && <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{stay.summary}</p>}

        {stay.area && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {stay.area}
          </p>
        )}

        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
          View on Zanzibar Rooms <ExternalLink className="h-3 w-3" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </span>
      </div>
    </a>
  );
}
