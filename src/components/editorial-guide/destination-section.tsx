import { Suspense } from "react";
import { CalendarClock, Lightbulb, MessageCircleQuestion, BedDouble, UtensilsCrossed, Info } from "lucide-react";
import type { Destination } from "@/lib/guides/where-to-stay/types";
import {
  ACCOMMODATION_LABELS,
  ATMOSPHERE_LABELS,
  BUDGET_LABELS,
  NIGHTLIFE_LABELS,
  RESTAURANT_LABELS,
  SWIMMING_LABELS,
  TAG_LABELS,
  TIDE_LABELS,
} from "@/lib/guides/where-to-stay/labels";
import { listingKey, listingsInArea, type GuideDirectory, type GuideListing } from "@/lib/data/editorial-guides";
import type { EditorialGuideUpdate } from "@/types/database";
import { ShareMenu } from "@/components/ui/share-menu";
import { GuideImage } from "./guide-image";
import { PhotoCredit } from "./photo-credit";
import { PhotoGallery, PhotoOpener } from "./photo-viewer";

export { PhotoCredit };
import { PANEL_ICONS, TAG_ICONS } from "./guide-icons";
import { RestaurantCard, StayCard, DirectoryChips } from "./recommendation-cards";
import { ZanzibarRoomsStays } from "./zanzibar-rooms-stays";

import { Anchor } from "@/components/ui/link";
export type CommunityLinks = {
  tip: string;
  restaurant: string;
  stay: string;
  ask: string;
  listBusiness: string | null;
  listStay: string | null;
};

export const UPDATE_KIND_LABELS: Record<EditorialGuideUpdate["kind"], string> = {
  restaurant: "Restaurant news",
  beach_access: "Beach access",
  accommodation: "Accommodation",
  seasonal: "Seasonal conditions",
  event: "Local event",
  road: "Roads and transport",
  other: "Local update",
};

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function Gallery({ destination }: { destination: Destination }) {
  const [hero, ...rest] = destination.photos;
  if (!hero) {
    return (
      <div className="flex aspect-[21/9] items-center justify-center rounded-lg border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
        We have not yet found a suitably licensed photograph of {destination.name}. Have one you took yourself? Share it with the community below.
      </div>
    );
  }
  // Clicking any photo opens the viewer on all of the destination's photos.
  return (
    <PhotoGallery photos={destination.photos} title={destination.name}>
      <div className="space-y-3">
        <figure>
          <div className="relative">
            <GuideImage src={hero.src} alt={hero.alt} width={hero.width} sizes="(min-width: 1024px) 960px, 100vw" className="aspect-[16/9] rounded-lg sm:aspect-[21/9]" />
            <PhotoOpener index={0} alt={hero.alt} />
          </div>
          <figcaption className="mt-1.5 text-xs text-muted-foreground">
            <PhotoCredit photo={hero} />
          </figcaption>
        </figure>
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {rest.slice(0, 4).map((photo, i) => (
              <figure key={photo.src}>
                <div className="relative">
                  <GuideImage src={photo.src} alt={photo.alt} width={photo.width} sizes="(min-width: 768px) 240px, 50vw" className="aspect-[4/3] rounded-md" />
                  <PhotoOpener index={i + 1} alt={photo.alt} />
                </div>
                <figcaption className="mt-1 line-clamp-3 text-[11px] leading-snug text-muted-foreground">
                  <PhotoCredit photo={photo} />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </PhotoGallery>
  );
}

function InfoPanel({ destination }: { destination: Destination }) {
  const p = destination.panel;
  const rows: { icon: keyof typeof PANEL_ICONS; label: string; value: string }[] = [
    { icon: "swimming", label: "Swimming", value: SWIMMING_LABELS[p.swimming] },
    { icon: "tides", label: "Tidal impact", value: TIDE_LABELS[p.tides] },
    { icon: "atmosphere", label: "Atmosphere", value: ATMOSPHERE_LABELS[p.atmosphere] },
    { icon: "nightlife", label: "Nightlife", value: NIGHTLIFE_LABELS[p.nightlife] },
    { icon: "restaurants", label: "Restaurants", value: RESTAURANT_LABELS[p.restaurants] },
    { icon: "accommodation", label: "Places to stay", value: ACCOMMODATION_LABELS[p.accommodation] },
    { icon: "budget", label: "Budget", value: BUDGET_LABELS[p.budget] },
    { icon: "nights", label: "Recommended stay", value: p.nights },
  ];
  return (
    <aside aria-label={`${destination.name} at a glance`} className="rounded-lg border border-border bg-card p-4">
      <h4 className="text-sm font-semibold text-foreground">{destination.name} at a glance</h4>
      <dl className="mt-3 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
        {rows.map((row) => {
          const Icon = PANEL_ICONS[row.icon];
          return (
            <div key={row.label} className="flex items-start gap-2">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <div>
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="font-medium text-foreground">{row.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">Best for</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {destination.bestFor.map((tag) => {
            const Icon = TAG_ICONS[tag];
            return (
              <li key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                <Icon className="h-3 w-3" aria-hidden /> {TAG_LABELS[tag]}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function Prose({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

export function DestinationSection({
  destination: d,
  directory,
  updates,
  links,
  shareUrl,
}: {
  destination: Destination;
  directory: GuideDirectory;
  updates: EditorialGuideUpdate[];
  links: CommunityLinks;
  shareUrl: string | null;
}) {
  const resolve = (ref: { kind: "business" | "stay"; slug: string } | null | undefined): GuideListing | null =>
    ref ? directory.bySlug.get(listingKey(ref)) ?? null : null;

  const used = new Set<string>(
    [...d.restaurants.map((r) => r.listing), ...d.stays.map((s) => s.listing)].filter(Boolean).map((ref) => listingKey(ref!))
  );
  const moreRestaurants = listingsInArea(directory.restaurants, d.name, used);
  const moreStays = listingsInArea(directory.stays, d.name, used);

  return (
    <section id={d.key} aria-labelledby={`${d.key}-title`} className="scroll-mt-24 border-t border-border pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {d.rank}. {d.coast}
          </p>
          <h2 id={`${d.key}-title`} className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {d.name}
          </h2>
          <p className="mt-1 text-base text-muted-foreground">{d.category}</p>
        </div>
        <ShareMenu url={shareUrl ?? undefined} title={`Where to stay in Zanzibar: ${d.name}`} text={d.summary} />
      </div>

      <div className="mt-5">
        <Gallery destination={d} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-foreground">{d.intro}</p>
          {d.editorialNote && (
            <p className="flex items-start gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {d.editorialNote}
            </p>
          )}
          <Prose title="Why people love it" body={d.whyPeopleLoveIt} />
          <Prose title="What makes it different" body={d.whatMakesItDifferent} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Prose title="Who should stay here" body={d.whoShouldStay} />
            <Prose title="Who might not enjoy it" body={d.whoMightNot} />
          </div>
          <Prose title="What visitors often misunderstand" body={d.misunderstandings} />
          <Prose title="The beach" body={d.beach} />
          <Prose title="Eating out and exploring" body={d.eatingOut} />
          {d.notes.map((note) => (
            <Prose key={note.title} title={note.title} body={note.body} />
          ))}
        </div>
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <InfoPanel destination={d} />
        </div>
      </div>

      {updates.length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="h-4 w-4 text-accent" aria-hidden /> Local knowledge updates
          </h3>
          <ul className="mt-2 space-y-2">
            {updates.map((u) => (
              <li key={u.id} className="text-sm">
                <span className="font-medium text-foreground">{UPDATE_KIND_LABELS[u.kind]}</span>{" "}
                <span className="text-xs text-muted-foreground">· noted {formatDate(u.noted_on)}</span>
                <p className="text-foreground/90">{u.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <UtensilsCrossed className="h-5 w-5 text-accent" aria-hidden /> Where to eat in {d.name}
        </h3>
        {d.restaurants.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">We have not yet found two restaurants here we can recommend with confidence.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {d.restaurants.map((r) => (
              <RestaurantCard key={r.name} rec={r} listing={resolve(r.listing)} listYourBusinessHref={links.listBusiness} />
            ))}
          </div>
        )}
        <DirectoryChips title={`More places to eat in ${d.name} from our directory`} listings={moreRestaurants} />
      </div>

      <div id={`${d.key}-stay`} className="mt-10 scroll-mt-24">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <BedDouble className="h-5 w-5 text-accent" aria-hidden /> Where to stay in {d.name}
        </h3>
        {d.stays.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Accommodation recommendations for {d.name} are still being researched.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.stays.map((s) => (
              <StayCard key={s.name} rec={s} listing={resolve(s.listing)} listYourStayHref={links.listStay} />
            ))}
          </div>
        )}
        <DirectoryChips title={`More places to stay in ${d.name} from our community`} listings={moreStays} />
        <p className="mt-3 text-xs text-muted-foreground">
          Price categories are relative ($ budget-friendly, $$ mid-range, $$$ upper range); we do not quote nightly rates, which change constantly.
        </p>
        <Suspense fallback={null}>
          <ZanzibarRoomsStays place={d} />
        </Suspense>
      </div>

      <div className="mt-10 rounded-xl border border-accent/30 bg-accent-soft p-5">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Lightbulb className="h-5 w-5 text-accent" aria-hidden /> Know this part of Zanzibar?
        </h3>
        <p className="mt-1 text-sm text-foreground/90">
          Residents and recent visitors keep this guide honest. Share what you know about {d.name} — posts go through the community&apos;s usual moderation, and our editors review suggestions before anything changes here.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Anchor href={links.tip} className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Lightbulb className="h-4 w-4" aria-hidden /> Share a local tip
          </Anchor>
          <Anchor href={links.restaurant} className={chipButton}>
            <UtensilsCrossed className="h-4 w-4" aria-hidden /> Recommend a restaurant
          </Anchor>
          <Anchor href={links.stay} className={chipButton}>
            <BedDouble className="h-4 w-4" aria-hidden /> Suggest somewhere to stay
          </Anchor>
          <Anchor href={links.ask} className={chipButton}>
            <MessageCircleQuestion className="h-4 w-4" aria-hidden /> Ask the community
          </Anchor>
        </div>
      </div>
    </section>
  );
}

const chipButton = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted";
