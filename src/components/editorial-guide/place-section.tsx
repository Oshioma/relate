import { BadgeCheck, Camera, CircleAlert, Clock, ExternalLink, MapPin, Navigation, Sparkles, Waves } from "lucide-react";
import type { Place, PlaceKind } from "@/lib/guides/place-guide/types";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import type { EditorialGuideUpdate } from "@/types/database";
import { ShareMenu } from "@/components/ui/share-menu";
import { GuideImage } from "./guide-image";
import { UPDATE_KIND_LABELS, formatDate } from "./destination-section";
import { PhotoCredit } from "./photo-credit";
import { PhotoGallery, PhotoOpener } from "./photo-viewer";

// One place on a place guide ("Zanzibar's Most Picturesque Places"): a
// gallery that opens in the photo viewer, the editors' description, when to
// go (light and tide), how to visit, photography tips and honest caveats,
// with an at-a-glance panel of the checked practicalities.

export const KIND_LABELS: Record<PlaceKind, string> = {
  beach: "Beach",
  sandbank: "Sandbank",
  island: "Island",
  reef: "Reef and sea",
  town: "Old town",
  historic: "Historic site",
  nature: "Nature",
  cave: "Cave",
  viewpoint: "Viewpoint",
};

const VERIFICATION_LABELS: Record<Place["verification"]["status"], string> = {
  verified: "Details checked",
  partial: "Partly checked",
  unverified: "Not yet verified",
};

function Figure({ photo, index, sizes, className, clamp }: { photo: GuidePhoto; index: number; sizes: string; className: string; clamp?: boolean }) {
  return (
    <figure>
      <div className="relative">
        <GuideImage src={photo.src} alt={photo.alt} width={photo.width} sizes={sizes} className={className} />
        <PhotoOpener index={index} alt={photo.alt} />
      </div>
      <figcaption className={`mt-1 text-[11px] leading-snug text-muted-foreground ${clamp ? "line-clamp-3" : ""}`}>
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}

function Gallery({ place }: { place: Place }) {
  const [main, ...rest] = place.photos;
  if (!main) {
    return <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-border bg-muted px-4 text-sm text-muted-foreground">We don&apos;t have photographs of {place.name} yet.</div>;
  }
  return (
    <PhotoGallery photos={place.photos} title={place.name}>
      <div className="space-y-3">
        <Figure photo={main} index={0} sizes="(min-width: 1024px) 860px, 100vw" className="aspect-[16/9] rounded-lg" />
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {rest.slice(0, 4).map((photo, i) => (
              <Figure key={photo.src} photo={photo} index={i + 1} sizes="(min-width: 768px) 210px, 50vw" className="aspect-[4/3] rounded-md" clamp />
            ))}
          </div>
        )}
        {place.photos.length > 5 && <p className="text-xs text-muted-foreground">Tap any photo to see all {place.photos.length}.</p>}
      </div>
    </PhotoGallery>
  );
}

function AtAGlance({ place }: { place: Place }) {
  const v = place.verification;
  return (
    <aside aria-label={`${place.name} at a glance`} className="rounded-lg border border-border bg-card p-4 text-sm">
      <dl className="space-y-2.5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Type</dt>
          <dd className="font-medium text-foreground">{KIND_LABELS[place.kind]}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Best for</dt>
          <dd className="font-medium text-foreground">{place.bestFor.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">From Stone Town</dt>
          <dd className="font-medium text-foreground">{place.fromStoneTown}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Tide matters?</dt>
          <dd className="font-medium text-foreground">{place.tide ? "Yes — see When to go" : "No"}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
        {place.website && (
          <a href={place.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
            <ExternalLink className="h-4 w-4" aria-hidden /> {place.websiteLabel ?? "Official website"}
          </a>
        )}
        <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
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

function Prose({ icon: Icon, title, children }: { icon: typeof Waves; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Icon className="h-4 w-4 text-accent" aria-hidden /> {title}
      </h4>
      <div className="mt-1 text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

export function PlaceSection({ place, number, updates, shareUrl }: { place: Place; number: number; updates: EditorialGuideUpdate[]; shareUrl: string | null }) {
  return (
    <section id={place.key} aria-labelledby={`${place.key}-title`} className="scroll-mt-24 border-t border-border pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {number}. {place.area} · {place.coast}
          </p>
          <h3 id={`${place.key}-title`} className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {place.name}
          </h3>
          <p className="mt-1 text-lg italic text-muted-foreground">{place.tagline}</p>
        </div>
        <ShareMenu url={shareUrl ?? undefined} title={`${place.name}, Zanzibar`} text={place.tagline} />
      </div>

      <div className="mt-6">
        <Gallery place={place} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-6">
          <div className="space-y-4 text-[17px] leading-relaxed text-foreground">
            {place.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Prose icon={Sparkles} title="Why it's in this guide">
            <p>{place.whyGo}</p>
          </Prose>
          <Prose icon={Clock} title="When to go">
            <p>{place.bestTime}</p>
            {place.tide && (
              <p className="mt-2 flex gap-1.5">
                <Waves className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-medium text-foreground">Tide: </span>
                  {place.tide}
                </span>
              </p>
            )}
          </Prose>
          <Prose icon={Navigation} title="How to visit">
            <p>{place.howToVisit}</p>
          </Prose>
          <Prose icon={Camera} title="Photography tips">
            <p>{place.photoTips}</p>
          </Prose>
          <Prose icon={CircleAlert} title="Worth knowing">
            <ul className="list-disc space-y-1 pl-5">
              {place.considerations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Prose>
        </div>
        <div>
          <AtAGlance place={place} />
        </div>
      </div>

      {updates.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold text-foreground">Local knowledge updates</h4>
          <ul className="mt-2 space-y-2">
            {updates.map((u) => (
              <li key={u.id} className="text-sm">
                <span className="font-medium text-foreground">{UPDATE_KIND_LABELS[u.kind]}</span> <span className="text-xs text-muted-foreground">· noted {formatDate(u.noted_on)}</span>
                <p className="text-foreground/90">{u.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
