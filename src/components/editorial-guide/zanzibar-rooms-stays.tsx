import type { ReactNode } from "react";
import Image from "next/image";
import { BedDouble, ExternalLink, MapPin, Users } from "lucide-react";
import { formatFromPrice, getZanzibarRoomsStays, LIST_YOUR_ROOM_URL, stayQueryFor, type ZanzibarRoomsStay } from "@/lib/zanzibar-rooms/stays";

// "Stay with Zanzibar Rooms": a few partner listings from
// www.zanzibarrooms.com under a destination's own stay recommendations.
// Fetched on the server (cached, 3s timeout); render it inside <Suspense> so a
// slow feed never holds up the page. Any failure renders nothing at all.
// One photo per card, each linking out, so no photo viewer here.
export async function ZanzibarRoomsStays({ place }: { place: { name: string; lat?: number | null; lng?: number | null } }) {
  const stays = await getZanzibarRoomsStays(stayQueryFor(place));
  if (!stays) return null;
  return (
    <ZanzibarRoomsStayCards
      stays={stays}
      heading="Stay with Zanzibar Rooms"
      headingId={`zr-stays-${place.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      note="Listed and priced by their hosts on Zanzibar Rooms, a separate site; prices can change. Not reviewed by our editors."
      action={<ListYourRoom prompt="Have a room or home to let in Zanzibar?" />}
    />
  );
}

// The partner cards themselves, shared with the "Long Term" section of the
// community accommodation directory.
export function ZanzibarRoomsStayCards({
  stays,
  heading,
  headingId,
  headingLevel = "h4",
  note,
  action,
  className = "mt-8",
}: {
  stays: ZanzibarRoomsStay[];
  heading: string;
  headingId: string;
  headingLevel?: "h2" | "h3" | "h4";
  note: string;
  // Shown under the note, e.g. a link for hosts to list their own place.
  action?: ReactNode;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <section aria-labelledby={headingId} className={`${className} rounded-lg border border-border bg-card p-4`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Heading id={headingId} className="flex items-center gap-2 text-base font-semibold text-foreground">
          <BedDouble className="h-4 w-4 text-accent" aria-hidden /> {heading}
        </Heading>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Partner listings from Zanzibar Rooms</p>
      </div>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stays.map((stay) => (
          <li key={stay.id}>
            <a
              href={stay.url}
              target="_blank"
              rel="noopener"
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background hover:border-accent/50"
            >
              <div className="relative aspect-[16/10] bg-muted">
                {stay.photoUrl ? (
                  <Image src={stay.photoUrl} alt={stay.photoAlt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground" aria-hidden>
                    <BedDouble className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="text-sm font-semibold text-foreground group-hover:text-accent">{stay.name}</p>
                {stay.area && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden /> {stay.area}
                  </p>
                )}
                {stay.summary && <p className="mt-2 line-clamp-2 text-xs text-foreground/80">{stay.summary}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 text-xs">
                  <span className="font-medium text-foreground">{formatFromPrice(stay)}</span>
                  {stay.maxGuests && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" aria-hidden /> Up to {stay.maxGuests} {stay.maxGuests === 1 ? "guest" : "guests"}
                    </span>
                  )}
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
                  View on Zanzibar Rooms <ExternalLink className="h-3 w-3" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
      {action}
    </section>
  );
}

// The link for hosts to list their own place, under the partner cards.
export function ListYourRoom({ prompt }: { prompt: string }) {
  return (
    <p className="mt-3 text-sm text-foreground">
      {prompt}{" "}
      <a
        href={LIST_YOUR_ROOM_URL}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
      >
        Add your room to ZanzibarRooms.com <ExternalLink className="h-3 w-3" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </p>
  );
}
