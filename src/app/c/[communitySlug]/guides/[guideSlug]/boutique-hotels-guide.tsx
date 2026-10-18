import { BedDouble, CalendarCheck, Compass, ExternalLink, Gem, Heart, ListChecks, MessageCircleHeart, Pencil, Quote, Route, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { Community, EditorialGuide, EditorialGuideUpdate } from "@/types/database";
import type { FeedItemActionsProps } from "@/app/c/[communitySlug]/feed-item-actions";
import { FeedItemActions } from "@/app/c/[communitySlug]/feed-item-actions";
import type { ResolvedBoutiqueGuide } from "@/lib/guides/boutique-hotels/content";
import { BOUTIQUE_HOTELS_DESCRIPTION, BOUTIQUE_HOTELS_SUBTITLE, BOUTIQUE_HOTELS_TITLE, photoCount } from "@/lib/guides/boutique-hotels/content";
import {
  AREAS,
  BOOKING_ADVICE,
  CALL_TO_ACTION,
  CATEGORIES,
  CATEGORY_CAVEAT,
  EDITORIAL_STANDARDS,
  HOW_TO_READ,
  INTRODUCTION,
  ITINERARY,
} from "@/lib/guides/boutique-hotels/advice";
import { TRAVELLER_RECOMMENDATIONS, TRAVELLER_SOURCE } from "@/lib/guides/boutique-hotels/community";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { GuideImage } from "@/components/editorial-guide/guide-image";
import { PhotoCredit } from "@/components/editorial-guide/destination-section";
import { HotelSection } from "@/components/editorial-guide/hotel-section";

// /guides/best-boutique-hotels-zanzibar — "Zanzibar's Best Boutique Hotels &
// Hidden Gems". Server-rendered and public; the only client islands are the
// section nav, the photos and the comment thread, which is the guide's own
// feed card thread (comments here and on the feed card are the same).

const ROLE_LABELS = { traveller: "Traveller", "local-guide": "Local guide", "travel-tip": "Travel tip" } as const;

function jsonLd(value: unknown) {
  return { __html: JSON.stringify(value).replace(/</g, "\\u003c") };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function SectionTitle({ id, icon: Icon, children }: { id: string; icon: typeof Gem; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
      <Icon className="h-6 w-6 shrink-0 text-accent" aria-hidden /> {children}
    </h2>
  );
}

export function BoutiqueHotelsGuide({
  community,
  guide,
  content,
  updates,
  pageUrl,
  canEdit,
  signedIn,
  links,
  comments,
}: {
  community: Community;
  guide: EditorialGuide;
  content: ResolvedBoutiqueGuide;
  updates: EditorialGuideUpdate[];
  pageUrl: string | null;
  canEdit: boolean;
  signedIn: boolean;
  links: { recommend: string; stay: string; ask: string };
  comments: Omit<FeedItemActionsProps, "itemTitle">;
}) {
  const { featured, gems, heroPhoto, editorsNote } = content;
  const all = [...featured, ...gems];
  const byKey = new Map(all.map((h) => [h.key, h]));
  const reviewed = formatDate(guide.last_reviewed_on);
  const photos = photoCount(content);
  const withoutPhotos = all.filter((h) => h.photos.length === 0).length;
  const guidePath = `/c/${community.slug}/guides/${guide.slug}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: BOUTIQUE_HOTELS_TITLE,
      description: BOUTIQUE_HOTELS_DESCRIPTION,
      inLanguage: "en-GB",
      ...(heroPhoto ? { image: [heroPhoto.src] } : {}),
      ...(guide.last_reviewed_on ? { dateModified: guide.last_reviewed_on } : {}),
      publisher: { "@type": "Organization", name: community.name },
      ...(pageUrl ? { mainEntityOfPage: pageUrl } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: BOUTIQUE_HOTELS_TITLE,
      itemListElement: all.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Hotel",
          name: h.name,
          address: { "@type": "PostalAddress", addressLocality: h.area, addressRegion: "Zanzibar", addressCountry: "TZ" },
          ...(h.website ? { url: h.website } : {}),
        },
      })),
    },
  ];

  const sections: NavSection[] = [
    { id: "introduction", label: "Introduction", group: "Start here" },
    { id: "find-your-stay", label: "Find your perfect stay", group: "Start here" },
    ...featured.map((h, i) => ({ id: h.key, label: `${i + 1}. ${h.name}`, group: "Featured hotels" })),
    { id: "more-gems", label: "More boutique gems", group: "More hotels" },
    { id: "travellers", label: "Recommended by travellers", group: "More hotels" },
    { id: "before-you-book", label: "Before you book", group: "Plan your stay" },
    { id: "honeymoon", label: "Seven-night honeymoon", group: "Plan your stay" },
    { id: "hidden-gem", label: "Share a hidden gem", group: "Plan your stay" },
  ];

  return (
    <article className="pb-16">
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
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">{BOUTIQUE_HOTELS_TITLE}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90 sm:text-xl">{BOUTIQUE_HOTELS_SUBTITLE}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#find-your-stay" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-white/90">
              <Sparkles className="h-4 w-4" aria-hidden /> Find your perfect stay
            </a>
            <a href="#featured-hotels" className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/25">
              <BedDouble className="h-4 w-4" aria-hidden /> The hotels
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
            <div className="flex items-center gap-3">
              {guide.status === "draft" && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">Draft — only staff can see this</span>}
              {canEdit && (
                <a href={`${guidePath}/edit`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit guide
                </a>
              )}
            </div>
          </div>

          {/* Introduction */}
          <section id="introduction" aria-label="Introduction" className="mt-8 scroll-mt-24">
            <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-foreground">
              <p className="text-2xl font-medium leading-snug tracking-tight sm:text-[1.7rem]">{INTRODUCTION[0]}</p>
              {INTRODUCTION.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                Still deciding which part of the island suits you? Start with our{" "}
                <a href={`/c/${community.slug}/guides/where-to-stay-in-zanzibar`} className="font-medium text-accent hover:underline">
                  Where to Stay in Zanzibar
                </a>{" "}
                guide, which compares 14 beach destinations in depth.
              </p>
              {editorsNote && <p className="rounded-md border border-border bg-muted px-4 py-3 text-base">{editorsNote}</p>}
              {!signedIn && (
                <p className="rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-base">
                  <a href={`/signup?next=${encodeURIComponent(guidePath)}`} className="font-semibold text-accent hover:underline">
                    Join {community.name}
                  </a>{" "}
                  to share your own hidden gems and ask locals for advice. The guide itself is free to read.
                </p>
              )}
            </div>

            <div className="mt-8 rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> How to read this guide
              </h2>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                {HOW_TO_READ.map((item) => (
                  <div key={item.label}>
                    <dt className="text-sm font-semibold text-foreground">{item.label}</dt>
                    <dd className="mt-0.5 text-sm text-muted-foreground">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Find your perfect stay */}
          <section id="find-your-stay" aria-labelledby="find-your-stay-title" className="mt-16 scroll-mt-24">
            <SectionTitle id="find-your-stay-title" icon={Sparkles}>
              Find your perfect Zanzibar stay
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">{CATEGORY_CAVEAT}</p>
            <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <div key={c.id} id={c.id} className="scroll-mt-24 border-l-2 border-accent pl-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.blurb}</p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {c.hotelKeys.map((key) => {
                      const h = byKey.get(key);
                      if (!h) return null;
                      return (
                        <li key={key}>
                          <a href={`#${key}`} className="text-[15px] font-medium text-accent hover:underline">
                            {h.name}
                          </a>
                          <span className="text-xs text-muted-foreground"> · {h.area}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Featured hotels */}
          <section id="featured-hotels" aria-labelledby="featured-title" className="mt-16 scroll-mt-24">
            <SectionTitle id="featured-title" icon={BedDouble}>
              Featured boutique hotels
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Twelve exceptional small hotels and villa retreats, from an eight-room adults-only hideaway to architectural landmarks. Listed in no particular order of merit.
            </p>
            <div className="mt-8 space-y-16">
              {featured.map((h, i) => (
                <HotelSection key={h.key} hotel={h} number={i + 1} updates={updates.filter((u) => u.destination_key === h.key)} shareUrl={pageUrl ? `${pageUrl}#${h.key}` : null} />
              ))}
            </div>
          </section>

          {/* More gems */}
          <section id="more-gems" aria-labelledby="more-gems-title" className="mt-20 scroll-mt-24">
            <SectionTitle id="more-gems-title" icon={Gem}>
              More boutique gems worth discovering
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">Shorter entries for ten more characterful places to stay, from Stone Town to the quiet villages of the south-east.</p>
            <div className="mt-6 space-y-10">
              {gems.map((h, i) => (
                <HotelSection key={h.key} hotel={h} number={featured.length + i + 1} updates={updates.filter((u) => u.destination_key === h.key)} shareUrl={pageUrl ? `${pageUrl}#${h.key}` : null} />
              ))}
            </div>
          </section>

          {/* Travellers */}
          <section id="travellers" aria-labelledby="travellers-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
            <SectionTitle id="travellers-title" icon={Users}>
              Recommended by travellers who&apos;ve actually stayed
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-muted-foreground">{TRAVELLER_SOURCE}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {TRAVELLER_RECOMMENDATIONS.map((r) => (
                <li key={r.id} className="flex flex-col rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{ROLE_LABELS[r.role]}</p>
                  <p className="mt-1 font-semibold text-foreground">{r.person}</p>
                  <p className="text-xs text-muted-foreground">{r.context}</p>
                  {r.hotels.length > 0 && (
                    <p className="mt-2 text-sm text-foreground">
                      {r.hotels.map((h, i) => (
                        <span key={h.name}>
                          {i > 0 && " · "}
                          {h.guideKey ? (
                            <a href={`#${h.guideKey}`} className="font-medium text-accent hover:underline">
                              {h.name}
                            </a>
                          ) : h.website ? (
                            <a href={h.website} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                              {h.name}
                            </a>
                          ) : (
                            <span className="font-medium">{h.name}</span>
                          )}
                          {h.area && <span className="text-muted-foreground">, {h.area}</span>}
                        </span>
                      ))}
                    </p>
                  )}
                  {r.quotes.map((q) => (
                    <blockquote key={q} className="mt-3 flex gap-2 text-[15px] italic text-foreground">
                      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <span>&ldquo;{q}&rdquo;</span>
                    </blockquote>
                  ))}
                  <p className="mt-3 text-sm text-foreground/90">{r.summary}</p>
                  {r.link && (
                    <a href={r.link.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                      {r.link.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                  {r.note && <p className="mt-auto pt-3 text-xs text-muted-foreground">{r.note}</p>}
                </li>
              ))}
            </ul>
          </section>

          {/* Before you book */}
          <section id="before-you-book" aria-labelledby="before-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
            <SectionTitle id="before-title" icon={ListChecks}>
              Things you should know before booking
            </SectionTitle>
            <nav aria-label="Booking advice topics" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {BOOKING_ADVICE.map((b) => (
                <a key={b.id} href={`#advice-${b.id}`} className="text-accent hover:underline">
                  {b.title}
                </a>
              ))}
            </nav>
            <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {BOOKING_ADVICE.map((b, i) => (
                <div key={b.id} id={`advice-${b.id}`} className={`min-w-0 scroll-mt-24 ${b.id === "location" ? "md:col-span-2" : ""}`}>
                  <h3 className="text-lg font-semibold text-foreground">
                    <span className="mr-1.5 text-accent">{String.fromCharCode(65 + i)}.</span>
                    {b.title}
                  </h3>
                  {b.paragraphs.map((p) => (
                    <p key={p} className="mt-2 text-[15px] leading-relaxed text-foreground/90">
                      {p}
                    </p>
                  ))}
                  {b.id === "location" && (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
                      <table className="w-full min-w-[520px] text-left text-sm">
                        <caption className="sr-only">Zanzibar areas covered by this guide</caption>
                        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th scope="col" className="px-3 py-2.5">Area</th>
                            <th scope="col" className="px-3 py-2.5">Coast</th>
                            <th scope="col" className="px-3 py-2.5">What to expect</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AREAS.map((a) => (
                            <tr key={a.name} className="border-t border-border align-top">
                              <th scope="row" className="whitespace-nowrap px-3 py-2.5 font-medium text-foreground">{a.name}</th>
                              <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{a.coast}</td>
                              <td className="px-3 py-2.5 text-foreground/90">{a.summary}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Honeymoon */}
          <section id="honeymoon" aria-labelledby="honeymoon-title" className="mt-20 scroll-mt-24 rounded-2xl bg-muted p-5 sm:p-8">
            <SectionTitle id="honeymoon-title" icon={Heart}>
              The perfect seven-night Zanzibar honeymoon
            </SectionTitle>
            <p className="mt-2 max-w-3xl text-foreground/90">{ITINERARY.intro}</p>
            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {ITINERARY.legs.map((leg, i) => (
                <li key={leg.where} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Part {i + 1} · {leg.nights}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">{leg.where}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{leg.body}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Focus">
                    {leg.focus.map((f) => (
                      <li key={f} className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Places to consider:{" "}
                    {leg.suggestions
                      .map((k) => byKey.get(k))
                      .filter((h) => h !== undefined)
                      .map((h, j) => (
                        <span key={h.key}>
                          {j > 0 && ", "}
                          <a href={`#${h.key}`} className="font-medium text-accent hover:underline">
                            {h.name}
                          </a>
                        </span>
                      ))}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-foreground/90">
              <strong className="font-semibold text-foreground">Why split the stay?</strong> {ITINERARY.why}
            </p>
            <h3 className="mt-6 flex items-center gap-2 text-base font-semibold text-foreground">
              <Route className="h-4 w-4 text-accent" aria-hidden /> Prefer not to change hotels?
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-foreground/90">
              {ITINERARY.singleBase.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {/* Call to action + comments */}
          <section id="hidden-gem" aria-labelledby="hidden-gem-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
            <SectionTitle id="hidden-gem-title" icon={MessageCircleHeart}>
              {CALL_TO_ACTION.title}
            </SectionTitle>
            <div className="mt-3 max-w-3xl space-y-3 text-[17px] leading-relaxed text-foreground">
              {CALL_TO_ACTION.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={links.stay} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
                <BedDouble className="h-4 w-4" aria-hidden /> Recommend a place to stay
              </a>
              <a href={links.recommend} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                <Compass className="h-4 w-4" aria-hidden /> Share a local recommendation
              </a>
              <a href={links.ask} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                <Users className="h-4 w-4" aria-hidden /> Ask the community
              </a>
            </div>
            <div className="mt-8 max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
              <p className="px-4 pt-4 text-sm font-semibold text-foreground">Comments on this guide</p>
              <p className="px-4 text-xs text-muted-foreground">
                {comments.canInteract ? "Tell us about your favourite boutique hotel — it also appears on the guide's card in the community feed." : signedIn ? "Join the community to add a comment." : "Log in and join the community to add a comment."}
              </p>
              <FeedItemActions {...comments} itemTitle={guide.title} />
            </div>
          </section>

          <section aria-labelledby="standards-title" className="mt-16 rounded-lg border border-border bg-card p-5">
            <h2 id="standards-title" className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> How this guide is made
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{EDITORIAL_STANDARDS}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Photographs ({photos}) come from Wikimedia Commons under the free licences credited beneath each one. We only publish hotel photographs we are licensed to use, so{" "}
              {withoutPhotos === all.length ? "none of the hotels has its own photograph here yet" : `${withoutPhotos} of the ${all.length} hotels don't yet have one`} — follow each hotel&apos;s website link to see its own photos. Pictures labelled &ldquo;The area, not the hotel&rdquo; show the surrounding beach or village, and captions beginning &ldquo;UNVERIFIED&rdquo; show something relevant whose exact location we could not confirm.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
