import { BadgeCheck, CalendarClock, CircleAlert, ExternalLink, ImageOff, MapPin, UtensilsCrossed, Waves, Compass, Sparkles } from "lucide-react";
import type { Hotel } from "@/lib/guides/boutique-hotels/types";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import type { EditorialGuideUpdate } from "@/types/database";
import { ShareMenu } from "@/components/ui/share-menu";
import { GuideImage } from "./guide-image";
import { PhotoCredit, UPDATE_KIND_LABELS, formatDate } from "./destination-section";

// One hotel on the boutique hotels guide. "featured" hotels get the full
// magazine treatment (large photo, gallery, every editorial section);
// "gem" hotels a shorter entry. The venue's own photos lead, credited to it;
// photos of the surrounding beach or village follow, always labelled as the
// area, and stand in when a venue has no photos of its own.

const PRICE_LABELS: Record<Hotel["price"], string> = {
  $$: "$$ · Mid-range boutique",
  $$$: "$$$ · Upscale",
  $$$$: "$$$$ · Top-end luxury",
};

const VERIFICATION_LABELS: Record<Hotel["verification"]["status"], string> = {
  verified: "Details checked",
  partial: "Partly checked",
  unverified: "Not yet verified",
};

function AreaBadge() {
  return <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white">The area, not the hotel</span>;
}

// Said wherever the hotel itself has no photo, so an area photo is never
// mistaken for the hotel.
function NoHotelPhotoNote({ hotel }: { hotel: Hotel }) {
  return (
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
      <ImageOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        {`We don't have photographs of ${hotel.name} yet${hotel.areaPhotos.length > 0 ? `, so these show the surrounding area instead` : ""}.`}
        {hotel.website && (
          <>
            {" "}
            <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
              {hotel.websiteLabel ? "See photos on its listing" : "See the hotel's own photos"}
            </a>
            .
          </>
        )}
      </span>
    </p>
  );
}

function Figure({ photo, area, sizes, className, clamp }: { photo: GuidePhoto; area: boolean; sizes: string; className: string; clamp?: boolean }) {
  return (
    <figure>
      <div className="relative">
        <GuideImage src={photo.src} alt={photo.alt} width={photo.width} sizes={sizes} className={className} />
        {area && <AreaBadge />}
      </div>
      <figcaption className={`mt-1 text-[11px] leading-snug text-muted-foreground ${clamp ? "line-clamp-3" : ""}`}>
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}

function Gallery({ hotel }: { hotel: Hotel }) {
  const own = hotel.photos.length > 0;
  const photos = own ? hotel.photos : hotel.areaPhotos;
  const [main, ...rest] = photos;
  if (!main) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-border bg-muted px-4">
        <NoHotelPhotoNote hotel={hotel} />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {!own && <NoHotelPhotoNote hotel={hotel} />}
      <Figure photo={main} area={!own} sizes="(min-width: 1024px) 860px, 100vw" className="aspect-[16/9] rounded-lg" />
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {rest.slice(0, 4).map((photo) => (
            <Figure key={photo.src} photo={photo} area={!own} sizes="(min-width: 768px) 210px, 50vw" className="aspect-[4/3] rounded-md" clamp />
          ))}
        </div>
      )}
      {own && hotel.areaPhotos.length > 0 && <AroundStrip hotel={hotel} />}
    </div>
  );
}

// The surrounding beach or village, under a venue's own photos.
function AroundStrip({ hotel }: { hotel: Hotel }) {
  return (
    <div className="border-t border-border pt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Around {hotel.area}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {hotel.areaPhotos.slice(0, 2).map((photo) => (
          <Figure key={photo.src} photo={photo} area sizes="(min-width: 768px) 210px, 50vw" className="aspect-[4/3] rounded-md" clamp />
        ))}
      </div>
    </div>
  );
}

function CompactPhoto({ hotel }: { hotel: Hotel }) {
  const own = hotel.photos[0];
  const photo = own ?? hotel.areaPhotos[0];
  return (
    <div className="space-y-2">
      {photo ? (
        <Figure photo={photo} area={!own} sizes="(min-width: 768px) 256px, 100vw" className="aspect-[4/3] rounded-lg" clamp />
      ) : (
        <div className="aspect-[4/3] rounded-lg border border-dashed border-border bg-muted" aria-hidden />
      )}
      {own && hotel.photos.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {hotel.photos.slice(1, 3).map((p) => (
            <figure key={p.src}>
              <GuideImage src={p.src} alt={p.alt} width={p.width} sizes="(min-width: 768px) 125px, 50vw" className="aspect-[4/3] rounded-md" />
              <figcaption className="sr-only">
                <PhotoCredit photo={p} />
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {!own && <NoHotelPhotoNote hotel={hotel} />}
    </div>
  );
}

function AtAGlance({ hotel }: { hotel: Hotel }) {
  const v = hotel.verification;
  return (
    <aside aria-label={`${hotel.name} at a glance`} className="rounded-lg border border-border bg-card p-4 text-sm">
      <dl className="space-y-2.5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Style</dt>
          <dd className="font-medium text-foreground">{hotel.style}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Atmosphere</dt>
          <dd className="font-medium text-foreground">{hotel.atmosphere}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Best for</dt>
          <dd className="font-medium text-foreground">{hotel.bestFor.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Price</dt>
          <dd className="font-medium text-foreground">{PRICE_LABELS[hotel.price]}</dd>
        </div>
        {hotel.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
            <dd className="font-medium text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
        {hotel.website && (
          <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
            <ExternalLink className="h-4 w-4" aria-hidden /> {hotel.websiteLabel ?? "Official website"}
          </a>
        )}
        <a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
          <MapPin className="h-4 w-4" aria-hidden /> View on map
        </a>
      </div>
      <p className="mt-3 flex items-start gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        {v.status === "verified" ? <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden /> : <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />}
        <span>
          {VERIFICATION_LABELS[v.status]} {formatDate(v.checkedOn)}.{v.gaps.length > 0 && <> Not confirmed: {v.gaps.join("; ")}.</>}
        </span>
      </p>
    </aside>
  );
}

function Prose({ icon: Icon, title, children }: { icon?: typeof Waves; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-base font-semibold text-foreground">
        {Icon && <Icon className="h-4 w-4 text-accent" aria-hidden />} {title}
      </h4>
      <div className="mt-1 text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function Updates({ updates }: { updates: EditorialGuideUpdate[] }) {
  if (updates.length === 0) return null;
  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarClock className="h-4 w-4 text-accent" aria-hidden /> Local knowledge updates
      </h4>
      <ul className="mt-2 space-y-2">
        {updates.map((u) => (
          <li key={u.id} className="text-sm">
            <span className="font-medium text-foreground">{UPDATE_KIND_LABELS[u.kind]}</span> <span className="text-xs text-muted-foreground">· noted {formatDate(u.noted_on)}</span>
            <p className="text-foreground/90">{u.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HotelSection({
  hotel,
  number,
  updates,
  shareUrl,
}: {
  hotel: Hotel;
  number: number;
  updates: EditorialGuideUpdate[];
  shareUrl: string | null;
}) {
  const featured = hotel.tier === "featured";

  return (
    <section id={hotel.key} aria-labelledby={`${hotel.key}-title`} className={`scroll-mt-24 border-t border-border ${featured ? "pt-12" : "pt-8"}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {number}. {hotel.area} · {hotel.coast}
          </p>
          <h3 id={`${hotel.key}-title`} className={`mt-1 font-semibold tracking-tight text-foreground ${featured ? "text-3xl" : "text-2xl"}`}>
            {hotel.name}
          </h3>
          <p className="mt-1 text-lg italic text-muted-foreground">{hotel.positioning}</p>
        </div>
        <ShareMenu url={shareUrl ?? undefined} title={`${hotel.name}, ${hotel.area}`} text={hotel.positioning} />
      </div>

      {featured ? (
        <>
          <div className="mt-6">
            <Gallery hotel={hotel} />
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="space-y-6">
              <div className="space-y-4 text-[17px] leading-relaxed text-foreground">
                {hotel.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {hotel.whyIncluded && (
                <Prose icon={Sparkles} title="Why it's in this guide">
                  <p>{hotel.whyIncluded}</p>
                </Prose>
              )}
              {hotel.whatsDifferent && (
                <Prose title="What makes it different">
                  <p>{hotel.whatsDifferent}</p>
                </Prose>
              )}
              <Prose icon={UtensilsCrossed} title="Food and dining">
                <p>{hotel.food}</p>
              </Prose>
              <Prose icon={Waves} title="Beach and swimming">
                <p>{hotel.beach}</p>
              </Prose>
              {hotel.nearby && (
                <Prose icon={Compass} title="Nearby">
                  <p>{hotel.nearby}</p>
                </Prose>
              )}
              <Prose icon={CircleAlert} title="Honest considerations">
                <ul className="list-disc space-y-1 pl-5">
                  {hotel.considerations.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Prose>
            </div>
            <div className="space-y-3">
              <AtAGlance hotel={hotel} />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
          <CompactPhoto hotel={hotel} />
          <div className="space-y-4">
            {hotel.description.map((p) => (
              <p key={p} className="text-[16px] leading-relaxed text-foreground">
                {p}
              </p>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <Prose icon={UtensilsCrossed} title="Food">
                <p>{hotel.food}</p>
              </Prose>
              <Prose icon={Waves} title="Beach and swimming">
                <p>{hotel.beach}</p>
              </Prose>
            </div>
            <Prose icon={CircleAlert} title="Worth knowing">
              <ul className="list-disc space-y-1 pl-5">
                {hotel.considerations.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Prose>
            <AtAGlance hotel={hotel} />
          </div>
        </div>
      )}

      <Updates updates={updates} />
    </section>
  );
}
