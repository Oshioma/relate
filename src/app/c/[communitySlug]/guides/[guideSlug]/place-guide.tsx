import { BookOpen, CalendarCheck, Camera, Compass, ListChecks, MapPinned, MessageCircleHeart, Pencil, Route, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import type { Community, EditorialGuide, EditorialGuideUpdate } from "@/types/database";
import type { FeedItemActionsProps } from "@/app/c/[communitySlug]/feed-item-actions";
import { FeedItemActions } from "@/app/c/[communitySlug]/feed-item-actions";
import type { PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { placePhotoCount, type ResolvedPlaceGuide } from "@/lib/guides/place-guide/content";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { GuideImage } from "@/components/editorial-guide/guide-image";
import { PhotoCredit } from "@/components/editorial-guide/photo-credit";
import { PlaceSection, KIND_LABELS, DEFAULT_PLACE_LABELS } from "@/components/editorial-guide/place-section";
import { PhotoGallery, PhotoOpener, type ViewerPhoto } from "@/components/editorial-guide/photo-viewer";
import { GuideViewBeacon } from "@/components/editorial-guide/guide-view-beacon";
import { GuideViewStatsBadge } from "@/components/editorial-guide/guide-view-stats";
import { AreaCards, AreaFilteredPlaces } from "@/components/editorial-guide/area-finder";
import { listingKey, type GuideDirectory, type GuideViewStats } from "@/lib/data/editorial-guides";

// A place guide page (/guides/most-picturesque-places-zanzibar): the same
// layout for every PlaceGuideDefinition. Server-rendered and public; the only
// client islands are the section nav, the photos and the comment thread,
// which is the guide's own feed card thread.

function jsonLd(value: unknown) {
  return { __html: JSON.stringify(value).replace(/</g, "\\u003c") };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function SectionTitle({ id, icon: Icon, children }: { id: string; icon: typeof Compass; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
      <Icon className="h-6 w-6 shrink-0 text-accent" aria-hidden /> {children}
    </h2>
  );
}

export function PlaceGuide({
  def,
  community,
  guide,
  content,
  updates,
  pageUrl,
  canEdit,
  viewStats,
  signedIn,
  links,
  comments,
  directory = null,
}: {
  def: PlaceGuideDefinition;
  community: Community;
  guide: EditorialGuide;
  content: ResolvedPlaceGuide;
  updates: EditorialGuideUpdate[];
  pageUrl: string | null;
  canEdit: boolean;
  viewStats: GuideViewStats | null;
  signedIn: boolean;
  links: { recommend: string; ask: string };
  comments: Omit<FeedItemActionsProps, "itemTitle">;
  // The community directory, when this guide links to it (restaurant guides).
  directory?: GuideDirectory | null;
}) {
  const { places, heroPhoto, editorsNote } = content;
  const byKey = new Map(places.map((p) => [p.key, p]));
  const reviewed = formatDate(guide.last_reviewed_on);
  const photos = placePhotoCount(content);
  const unverified = new Set(places.flatMap((p) => p.photos).filter((p) => p.identificationStatus === "unverified").map((p) => p.src)).size;
  const contactHref = `/c/${community.slug}/contact`;
  // The photo row at the top: one picture from each of a few places, each
  // labelled with (and linking to) its place.
  const mosaic = def.mosaic.flatMap(({ placeKey, photo = 0 }) => {
    const place = byKey.get(placeKey);
    const picture = place?.photos[photo] ?? place?.photos[0];
    return place && picture ? [{ place, picture }] : [];
  });
  const mosaicPhotos: ViewerPhoto[] = mosaic.map((m) => m.picture);
  const guidePath = `/c/${community.slug}/guides/${guide.slug}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: def.title,
      description: def.description,
      inLanguage: "en-GB",
      ...(heroPhoto ? { image: [heroPhoto.src] } : {}),
      ...(guide.last_reviewed_on ? { dateModified: guide.last_reviewed_on } : {}),
      publisher: { "@type": "Organization", name: community.name },
      ...(pageUrl ? { mainEntityOfPage: pageUrl } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: def.title,
      itemListElement: places.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: p.name,
          address: { "@type": "PostalAddress", addressLocality: p.area, addressRegion: "Zanzibar", addressCountry: "TZ" },
          ...(p.website ? { url: p.website } : {}),
        },
      })),
    },
  ];

  const labels = { ...DEFAULT_PLACE_LABELS, ...def.labels };
  const listingFor = (ref: (typeof places)[number]["listing"]) => (ref && directory ? (directory.bySlug.get(listingKey(ref)) ?? null) : null);
  // Every directory listing in the section's category, live — a listing
  // added to the directory tomorrow appears here without a code change.
  const directoryListings =
    def.directorySection && directory
      ? [...directory.bySlug.values()].filter((l) => l.kind === "business" && l.category === def.directorySection!.category).sort((a, b) => a.name.localeCompare(b.name))
      : [];
  const directoryHref = directory?.directorySpaceSlug ? `/c/${community.slug}/spaces/${directory.directorySpaceSlug}` : null;

  const placeIndex = (
    <ol className="mt-6 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3" aria-label="All places">
      {places.map((p, i) => (
        <li key={p.key}>
          <a href={`#${p.key}`} className="text-accent hover:underline">
            {i + 1}. {p.name}
          </a>
          <span className="text-xs text-muted-foreground"> · {KIND_LABELS[p.kind]}</span>
        </li>
      ))}
    </ol>
  );
  const placeSection = (p: (typeof places)[number], i: number) => (
    <PlaceSection
      key={p.key}
      place={p}
      number={i + 1}
      updates={updates.filter((u) => u.destination_key === p.key)}
      shareUrl={pageUrl ? `${pageUrl}#${p.key}` : null}
      labels={labels}
      listing={listingFor(p.listing)}
    />
  );

  const sections: NavSection[] = [
    { id: "introduction", label: "Introduction", group: "Start here" },
    { id: "find-your-spot", label: "Find your spot", group: "Start here" },
    ...places.map((p, i) => ({ id: p.key, label: `${i + 1}. ${p.name}`, group: def.placesSection.navGroup })),
    ...(def.directorySection && directoryListings.length > 0 ? [{ id: "directory", label: def.directorySection.navLabel, group: def.placesSection.navGroup }] : []),
    { id: "before-you-go", label: "Before you go", group: "Plan your trip" },
    { id: "routes", label: def.routes.navLabel, group: "Plan your trip" },
    { id: "share", label: def.callToAction.navLabel, group: "Plan your trip" },
  ];

  return (
    <article className="pb-16">
      <GuideViewBeacon guideId={guide.id} />
      {structuredData.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      ))}

      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        {heroPhoto ? (
          <GuideImage src={heroPhoto.src} alt={heroPhoto.alt} width={heroPhoto.width} priority sizes="100vw" className="absolute inset-0 -z-10 h-full w-full" />
        ) : (
          <div className="absolute inset-0 -z-10 bg-accent" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10" aria-hidden />
        <div className="mx-auto flex min-h-[68vh] max-w-5xl flex-col justify-end px-4 pb-10 pt-24 text-white sm:px-6 sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">{community.name} guide</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">{def.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90 sm:text-xl">{def.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#find-your-spot" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-white/90">
              <Sparkles className="h-4 w-4" aria-hidden /> Find your spot
            </a>
            <a href="#places" className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/25">
              <MapPinned className="h-4 w-4" aria-hidden /> {def.heroCta ?? "The places"}
            </a>
          </div>
          {heroPhoto && (
            <p className="mt-6 text-[11px] text-white/70">
              <PhotoCredit photo={heroPhoto} />
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <SectionNav sections={sections} label="Guide sections" />

        <div className="min-w-0">
          {/* Editorial bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              {reviewed ? <>Last reviewed by our editors on {reviewed}</> : <>Written by the {community.name} editors</>}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {canEdit && <GuideViewStatsBadge stats={viewStats} />}
              {guide.status === "draft" && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">Draft — only staff can see this</span>}
              {canEdit && (
                <a href={`${guidePath}/edit`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit guide
                </a>
              )}
            </div>
          </div>

          {/* Area cards ("what's around me?"), or the photo row */}
          {def.areaFinder ? (
            <AreaCards
              noun={def.areaFinder.noun}
              areas={def.areaFinder.areas.map((a) => {
                const first = byKey.get(a.placeKeys[0])?.photos[0];
                return { id: a.id, label: a.label, count: a.placeKeys.length, photo: first ? { src: first.src, alt: first.alt, width: first.width } : null };
              })}
            />
          ) : mosaic.length > 0 && (
            <PhotoGallery photos={mosaicPhotos} title={def.title}>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="A taste of the places in this guide">
                {mosaic.map(({ place, picture }, i) => (
                  <li key={place.key} className="min-w-0">
                    <div className="relative">
                      <GuideImage src={picture.src} alt={picture.alt} width={picture.width} priority={i < 4} sizes="(min-width: 1024px) 230px, (min-width: 640px) 25vw, 50vw" className="aspect-[4/3] rounded-md" />
                      <PhotoOpener index={i} alt={picture.alt} />
                    </div>
                    <a href={`#${place.key}`} className="mt-1 block truncate text-xs font-medium text-accent hover:underline">
                      {place.name}
                    </a>
                  </li>
                ))}
              </ul>
            </PhotoGallery>
          )}

          {/* Introduction */}
          <section id="introduction" aria-label="Introduction" className="mt-8 scroll-mt-24">
            <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-foreground">
              <p className="text-2xl font-medium leading-snug tracking-tight sm:text-[1.7rem]">{def.introduction[0]}</p>
              {def.introduction.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
              {editorsNote && <p className="rounded-md border border-border bg-muted px-4 py-3 text-base">{editorsNote}</p>}
              {!signedIn && (
                <p className="rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-base">
                  <a href={`/signup?next=${encodeURIComponent(guidePath)}`} className="font-semibold text-accent hover:underline">
                    Join {community.name}
                  </a>{" "}
                  {def.callToAction.joinPrompt}
                </p>
              )}
            </div>

            <div className="mt-8 rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> How to read this guide
              </h2>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                {def.howToRead.map((item) => (
                  <div key={item.label}>
                    <dt className="text-sm font-semibold text-foreground">{item.label}</dt>
                    <dd className="mt-0.5 text-sm text-muted-foreground">{item.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">About the photographs.</span> {def.photoNote}{" "}
                <a href={contactHref} className="font-medium text-accent hover:underline">
                  contact {community.name}
                </a>
                .
              </p>
            </div>
          </section>

          {/* Find your spot */}
          <section id="find-your-spot" aria-labelledby="find-your-spot-title" className="mt-16 scroll-mt-24">
            <SectionTitle id="find-your-spot-title" icon={Sparkles}>
              Find your spot
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">{def.categoryCaveat}</p>
            <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {def.categories.map((c) => (
                <div key={c.id} id={c.id} className="scroll-mt-24 border-l-2 border-accent pl-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.blurb}</p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {c.hotelKeys.map((key) => {
                      const p = byKey.get(key);
                      if (!p) return null;
                      return (
                        <li key={key}>
                          <a href={`#${key}`} className="text-[15px] font-medium text-accent hover:underline">
                            {p.name}
                          </a>
                          <span className="text-xs text-muted-foreground"> · {p.area}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* The places */}
          <section id="places" aria-labelledby="places-title" className="mt-16 scroll-mt-24">
            <SectionTitle id="places-title" icon={Camera}>
              {def.placesSection.title}
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">{def.placesSection.blurb}</p>
            {def.areaFinder ? (
              <AreaFilteredPlaces
                noun={def.areaFinder.noun}
                areas={def.areaFinder.areas}
                coords={Object.fromEntries(places.map((p) => [p.key, p.coords]))}
                index={placeIndex}
                items={places.map((p, i) => ({ key: p.key, node: placeSection(p, i) }))}
              />
            ) : (
              <>
                {placeIndex}
                <div className="mt-10 space-y-16">{places.map(placeSection)}</div>
              </>
            )}
          </section>
          {/* Everything in the community directory */}
          {def.directorySection && directoryListings.length > 0 && (
            <section id="directory" aria-labelledby="directory-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
              <SectionTitle id="directory-title" icon={BookOpen}>
                {def.directorySection.title}
              </SectionTitle>
              <p className="mt-2 max-w-3xl text-muted-foreground">{def.directorySection.blurb}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {directoryListings.map((l) => (
                  <li key={l.slug}>
                    <a href={l.href} className="group flex h-full gap-3 rounded-lg border border-border bg-card p-3 hover:shadow-md">
                      {l.imageUrl ? (
                        <GuideImage src={l.imageUrl} alt="" sizes="64px" className="h-16 w-16 shrink-0 rounded-md" />
                      ) : (
                        <div className="h-16 w-16 shrink-0 rounded-md bg-muted" aria-hidden />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground group-hover:text-accent">{l.name}</span>
                        {l.locationLabel && <span className="block truncate text-xs text-muted-foreground">{l.locationLabel}</span>}
                        {l.avgRating !== null && l.ratingCount > 0 && (
                          <span className="mt-0.5 inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" aria-hidden /> {l.avgRating.toFixed(1)} ({l.ratingCount})
                          </span>
                        )}
                        {places.some((p) => p.listing?.slug === l.slug) && <span className="mt-0.5 block text-xs font-medium text-accent">In this guide</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {directoryHref && (
                <p className="mt-4 text-sm">
                  <a href={directoryHref} className="font-medium text-accent hover:underline">
                    See the whole directory
                  </a>
                </p>
              )}
            </section>
          )}

          {/* Before you go */}
          <section id="before-you-go" aria-labelledby="before-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
            <SectionTitle id="before-title" icon={ListChecks}>
              Before you go
            </SectionTitle>
            <nav aria-label="Advice topics" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {def.advice.map((b) => (
                <a key={b.id} href={`#advice-${b.id}`} className="text-accent hover:underline">
                  {b.title}
                </a>
              ))}
            </nav>
            <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {def.advice.map((b, i) => (
                <div key={b.id} id={`advice-${b.id}`} className="min-w-0 scroll-mt-24">
                  <h3 className="text-lg font-semibold text-foreground">
                    <span className="mr-1.5 text-accent">{String.fromCharCode(65 + i)}.</span>
                    {b.title}
                  </h3>
                  {b.paragraphs.map((p) => (
                    <p key={p} className="mt-2 text-[15px] leading-relaxed text-foreground/90">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Routes */}
          <section id="routes" aria-labelledby="routes-title" className="mt-20 scroll-mt-24 rounded-2xl bg-muted p-5 sm:p-8">
            <SectionTitle id="routes-title" icon={Route}>
              {def.routes.title}
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-foreground/90">{def.routes.intro}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {def.routes.items.map((r) => (
                <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-xl font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-1 text-[15px] text-foreground/90">{r.summary}</p>
                  <ol className="mt-4 space-y-3">
                    {r.stops.map((s) => {
                      const p = byKey.get(s.placeKey);
                      if (!p) return null;
                      return (
                        <li key={s.placeKey} className="border-l-2 border-accent pl-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{s.when}</p>
                          <a href={`#${p.key}`} className="font-medium text-foreground hover:text-accent hover:underline">
                            {p.name}
                          </a>
                          <p className="text-sm text-muted-foreground">{s.note}</p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Call to action + comments */}
          <section id="share" aria-labelledby="share-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
            <SectionTitle id="share-title" icon={MessageCircleHeart}>
              {def.callToAction.title}
            </SectionTitle>
            <div className="mt-3 max-w-3xl space-y-3 text-[17px] leading-relaxed text-foreground">
              {def.callToAction.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={links.recommend} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
                <Compass className="h-4 w-4" aria-hidden /> Share a local recommendation
              </a>
              <a href={links.ask} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                <Users className="h-4 w-4" aria-hidden /> Ask the community
              </a>
            </div>
            <div className="mt-8 max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
              <p className="px-4 pt-4 text-sm font-semibold text-foreground">Comments on this guide</p>
              <p className="px-4 text-xs text-muted-foreground">
                {comments.canInteract ? def.callToAction.commentPrompt : signedIn ? "Join the community to add a comment." : "Log in and join the community to add a comment."}
              </p>
              <FeedItemActions {...comments} itemTitle={guide.title} />
            </div>
          </section>

          <section aria-labelledby="standards-title" className="mt-16 rounded-lg border border-border bg-card p-5">
            <h2 id="standards-title" className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> How this guide is made
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{def.editorialStandards}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This guide has {photos} photographs. {def.photoNote}{" "}
              <a href={contactHref} className="font-medium text-accent hover:underline">
                contact us
              </a>
              .
              {unverified > 0 && (
                <>
                  {" "}
                  {unverified === 1 ? "One caption begins" : `${unverified} captions begin`}{" "}
                  &ldquo;UNVERIFIED&rdquo;: the photo is relevant, but we couldn&apos;t confirm it shows the exact spot.
                </>
              )}
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
