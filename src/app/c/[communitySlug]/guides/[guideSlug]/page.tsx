import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowDown, CalendarCheck, Columns3, Compass, Map as MapIcon, Pencil, Sparkles, Waves, CloudSun, ListChecks, Route, CircleHelp, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { getEditorialGuide, getGuideDirectory } from "@/lib/data/editorial-guides";
import { WHERE_TO_STAY_SLUG, WHERE_TO_STAY_TITLE, parseOverrides, resolveGuideContent } from "@/lib/guides/where-to-stay/content";
import { communityLinksFor, guideUrl, loadGuide } from "@/lib/guides/where-to-stay/page-data";
import { TAG_LABELS, SWIMMING_LABELS, ATMOSPHERE_LABELS } from "@/lib/guides/where-to-stay/labels";
import {
  EDITORIAL_STANDARDS,
  FAQS,
  ITINERARIES,
  RANKING_EXPLAINER,
  SEVEN_THINGS,
  TIDES_SECTION,
  WEATHER_CAVEAT,
  WHEN_TO_VISIT,
} from "@/lib/guides/where-to-stay/visitor-info";
import { GuideImage } from "@/components/editorial-guide/guide-image";
import { DestinationComparison } from "@/components/editorial-guide/destination-comparison";
import { FindYourZanzibar } from "@/components/editorial-guide/find-your-zanzibar";
import { GuideMapLoader } from "@/components/editorial-guide/guide-map-loader";
import { DestinationSection, PhotoCredit } from "@/components/editorial-guide/destination-section";
import { LinkedText, plainText } from "@/components/editorial-guide/linked-text";
import { TAG_ICONS } from "@/components/editorial-guide/guide-icons";
import { summarise } from "@/components/editorial-guide/types";

// /guides/where-to-stay-in-zanzibar on the community's host.
//
// One long, curated page rather than fourteen thin ones: hero, comparison
// table and side-by-side compare, destination cards, the "Find Your Zanzibar"
// matcher, a map, then a full section per destination and the essential
// visitor information. Public — no login needed — and server-rendered, with
// only the comparison, the matcher and the map hydrating on the client.

type Params = Promise<{ communitySlug: string; guideSlug: string }>;

const DESCRIPTION =
  "Where to stay in Zanzibar: compare Kendwa, Nungwi, Paje, Jambiani, Stone Town and nine more beach destinations for swimming, tides, atmosphere, restaurants and accommodation — with local recommendations.";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { communitySlug, guideSlug } = await params;
  if (guideSlug !== WHERE_TO_STAY_SLUG) return {};
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return {};
  const guide = await getEditorialGuide(supabase, community.id, guideSlug);
  if (!guide) return {};
  const { heroPhoto } = resolveGuideContent(parseOverrides(guide.content));
  const host = (await headers()).get("host");
  const { absolute } = guideUrl(host, community.slug);
  const title = "Where to Stay in Zanzibar: The Complete Guide to 14 Best Beach Destinations";
  return {
    title,
    description: DESCRIPTION,
    alternates: absolute ? { canonical: absolute } : undefined,
    robots: guide.status === "published" ? undefined : { index: false, follow: false },
    openGraph: {
      type: "article",
      title,
      description: DESCRIPTION,
      url: absolute ?? undefined,
      siteName: community.name,
      locale: "en_GB",
      ...(heroPhoto ? { images: [{ url: heroPhoto.src, alt: heroPhoto.alt }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DESCRIPTION,
      ...(heroPhoto ? { images: [heroPhoto.src] } : {}),
    },
  };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function jsonLd(value: unknown) {
  return { __html: JSON.stringify(value).replace(/</g, "\\u003c") };
}

export default async function EditorialGuidePage({ params }: { params: Params }) {
  const { communitySlug, guideSlug } = await params;
  // One guide is built today; the route is shaped for more.
  if (guideSlug !== WHERE_TO_STAY_SLUG) notFound();

  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const guide = await getEditorialGuide(supabase, community.id, guideSlug);
  if (!guide) notFound();

  const [membership, { content, updates }, directory, community_links] = await Promise.all([
    user ? getMembership(supabase, community.id, user.id) : Promise.resolve(null),
    loadGuide(supabase, guide),
    getGuideDirectory(supabase, community.id, community.slug),
    communityLinksFor(supabase, community, Boolean(user)),
  ]);
  const { links, tidesHref, accommodationHref } = community_links;
  const canEdit = isCommunityAdmin(community, membership, user?.id);

  const host = (await headers()).get("host");
  const { absolute: pageUrl } = guideUrl(host, community.slug);

  const { destinations, heroPhoto, editorsNote } = content;
  const summaries = destinations.map(summarise);
  const names = Object.fromEntries(destinations.map((d) => [d.key, d.name]));
  const reviewed = formatDate(guide.last_reviewed_on);
  const photoCount = destinations.reduce((n, d) => n + d.photos.length, 0);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: WHERE_TO_STAY_TITLE,
      description: DESCRIPTION,
      inLanguage: "en-GB",
      ...(heroPhoto ? { image: [heroPhoto.src] } : {}),
      ...(guide.last_reviewed_on ? { dateModified: guide.last_reviewed_on } : {}),
      publisher: { "@type": "Organization", name: community.name },
      ...(pageUrl ? { mainEntityOfPage: pageUrl } : {}),
      about: destinations.map((d) => ({ "@type": "Place", name: `${d.name}, Zanzibar`, geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(f.answer, names) },
      })),
    },
  ];

  const toc = [
    { href: "#which-part", label: "Which part of Zanzibar is right for you?" },
    { href: "#destinations", label: "The 14 destinations" },
    { href: "#find-your-zanzibar", label: "Find your Zanzibar" },
    { href: "#map", label: "Map" },
    ...destinations.map((d) => ({ href: `#${d.key}`, label: `${d.rank}. ${d.name}` })),
    { href: "#tides", label: "Understanding Zanzibar's tides" },
    { href: "#when-to-visit", label: "When to visit" },
    { href: "#before-you-book", label: "Seven things to know before booking" },
    { href: "#itineraries", label: "Suggested itineraries" },
    { href: "#faq", label: "Frequently asked questions" },
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
        <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-end px-4 pb-10 pt-24 text-white sm:px-6 sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">{community.name} guide</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">Where to stay in Zanzibar</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90 sm:text-xl">
            14 incredible destinations. One island. Find the one that&apos;s right for you.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            The complete guide to Zanzibar&apos;s 14 best beach destinations: compare beaches, swimming conditions, atmosphere, accommodation, restaurants and local experiences.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#destinations" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-white/90">
              <Compass className="h-4 w-4" aria-hidden /> Explore destinations
            </a>
            <a href="#find-your-zanzibar" className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/25">
              <Sparkles className="h-4 w-4" aria-hidden /> Find my perfect beach
            </a>
            <a href="#which-part" className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/25">
              <Columns3 className="h-4 w-4" aria-hidden /> Compare locations
            </a>
          </div>
          {heroPhoto && (
            <p className="mt-6 text-[11px] text-white/70">
              <PhotoCredit photo={heroPhoto} />
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Editorial bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4" aria-hidden />
            {reviewed ? <>Last reviewed by our editors on {reviewed}</> : <>Written by the {community.name} editors</>}
          </p>
          <div className="flex items-center gap-3">
            {guide.status === "draft" && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">Draft — only staff can see this</span>}
            {canEdit && (
              <a href={`/c/${community.slug}/guides/${guide.slug}/edit`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit guide
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4 text-[17px] leading-relaxed text-foreground">
            <p>
              The single biggest decision in planning a Zanzibar holiday is not which hotel to book — it is which part of the island to stay in. The north-west has easy, all-day swimming and sunsets; the east coast has dramatic tides, wide lagoons and village life; Stone Town is history, food and culture.
            </p>
            <p>
              This guide compares 14 destinations honestly, including who each one does <em>not</em> suit, and points you to restaurants and places to stay that our community knows and rates. {RANKING_EXPLAINER}
            </p>
            {editorsNote && <p className="rounded-md border border-border bg-muted px-4 py-3 text-base">{editorsNote}</p>}
            {!user && (
              <p className="rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-base">
                <a href={`/signup?next=${encodeURIComponent(`/c/${community.slug}/guides/${guide.slug}`)}`} className="font-semibold text-accent hover:underline">
                  Join {community.name}
                </a>{" "}
                to save places, review restaurants and stays, and ask locals for advice. The guide itself is free to read.
              </p>
            )}
          </div>
          <nav aria-label="Table of contents" className="rounded-lg border border-border bg-card p-4 text-sm lg:sticky lg:top-6 lg:max-h-[80vh] lg:self-start lg:overflow-y-auto">
            <p className="font-semibold text-foreground">In this guide</p>
            <ol className="mt-2 space-y-1">
              {toc.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-muted-foreground hover:text-accent hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Comparison */}
        <section id="which-part" aria-labelledby="which-part-title" className="mt-14 scroll-mt-24">
          <h2 id="which-part-title" className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Which part of Zanzibar is right for you?
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Every destination at a glance. Filter by what matters to you, then compare two or three side by side. These are our editors&apos; judgements from local knowledge and recent traveller reviews — not scores.
          </p>
          <div className="mt-5">
            <DestinationComparison destinations={summaries} />
          </div>
        </section>

        {/* Destination cards */}
        <section id="destinations" aria-labelledby="destinations-title" className="mt-16 scroll-mt-24">
          <h2 id="destinations-title" className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            The 14 destinations
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">{RANKING_EXPLAINER}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => {
              const photo = d.photos[0];
              return (
                <li key={d.key}>
                  <a
                    href={`#${d.key}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative">
                      {photo ? (
                        <GuideImage src={photo.src} alt={photo.alt} width={photo.width} priority={i < 3} sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" imgClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]" />
                      ) : (
                        <div className="aspect-[4/3] bg-muted" />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">#{d.rank}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent">{d.name}</h3>
                      <p className="text-xs font-medium uppercase tracking-wide text-accent">{d.category}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{d.summary}</p>
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Best for">
                        {d.bestFor.slice(0, 4).map((tag) => {
                          const Icon = TAG_ICONS[tag];
                          return (
                            <li key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                              <Icon className="h-3 w-3" aria-hidden /> {TAG_LABELS[tag]}
                            </li>
                          );
                        })}
                      </ul>
                      <dl className="mt-auto grid grid-cols-3 gap-2 pt-4 text-xs">
                        <div><dt className="text-muted-foreground">Swimming</dt><dd className="font-medium text-foreground">{SWIMMING_LABELS[d.panel.swimming]}</dd></div>
                        <div><dt className="text-muted-foreground">Atmosphere</dt><dd className="font-medium text-foreground">{ATMOSPHERE_LABELS[d.panel.atmosphere]}</dd></div>
                        <div><dt className="text-muted-foreground">Budget</dt><dd className="font-medium text-foreground">{d.panel.budget}</dd></div>
                      </dl>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Explore {d.name} <ArrowDown className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Find your Zanzibar */}
        <section id="find-your-zanzibar" aria-labelledby="fyz-title" className="mt-16 scroll-mt-24 rounded-2xl bg-muted p-5 sm:p-8">
          <h2 id="fyz-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <Sparkles className="h-6 w-6 text-accent" aria-hidden /> Find your Zanzibar
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Answer five questions and discover which part of Zanzibar suits you best. The matching is simple and transparent: each answer earns destinations points from the same labels you see in the comparison table.
          </p>
          <div className="mt-6">
            <FindYourZanzibar destinations={summaries} accommodationHref={accommodationHref} />
          </div>
        </section>

        {/* Map */}
        <section id="map" aria-labelledby="map-title" className="mt-16 scroll-mt-24">
          <h2 id="map-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <MapIcon className="h-6 w-6 text-accent" aria-hidden /> Where everything is
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Pins mark the approximate centre of each area. Tap one for a summary and a link to its guide. For individual restaurants and hotels, use the community&apos;s Explore Map and directory listings.
          </p>
          <div className="mt-5">
            <GuideMapLoader destinations={summaries} />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {destinations.map((d) => (
              <li key={d.key}>
                <a href={`#${d.key}`} className="text-muted-foreground hover:text-accent hover:underline">
                  {d.rank}. {d.name} <span className="text-xs">· {d.coast}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Destination guides */}
        <div className="mt-16 space-y-16">
          {destinations.map((d) => (
            <DestinationSection
              key={d.key}
              destination={d}
              directory={directory}
              updates={updates.filter((u) => u.destination_key === d.key)}
              links={links}
              shareUrl={pageUrl ? `${pageUrl}#${d.key}` : null}
            />
          ))}
        </div>

        {/* Essential visitor information */}
        <section id="tides" aria-labelledby="tides-title" className="mt-20 scroll-mt-24 border-t border-border pt-12">
          <h2 id="tides-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <Waves className="h-6 w-6 text-accent" aria-hidden /> Understanding Zanzibar&apos;s tides
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {TIDES_SECTION.map((block) => (
              <div key={block.heading}>
                <h3 className="text-base font-semibold text-foreground">{block.heading}</h3>
                {block.paragraphs.map((p) => (
                  <p key={p} className="mt-1 text-[15px] leading-relaxed text-foreground/90">
                    <LinkedText text={p} names={names} tidesHref={tidesHref} />
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="when-to-visit" aria-labelledby="when-title" className="mt-16 scroll-mt-24">
          <h2 id="when-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <CloudSun className="h-6 w-6 text-accent" aria-hidden /> When to visit Zanzibar
          </h2>
          <div className="mt-5 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Zanzibar weather and travel by month</caption>
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2.5">Months</th>
                  <th scope="col" className="px-3 py-2.5">In short</th>
                  <th scope="col" className="px-3 py-2.5">What to expect</th>
                </tr>
              </thead>
              <tbody>
                {WHEN_TO_VISIT.map((row) => (
                  <tr key={row.months} className="border-t border-border align-top">
                    <th scope="row" className="whitespace-nowrap px-3 py-2.5 font-medium text-foreground">{row.months}</th>
                    <td className="px-3 py-2.5 font-medium text-foreground">{row.summary}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{WEATHER_CAVEAT}</p>
        </section>

        <section id="before-you-book" aria-labelledby="seven-title" className="mt-16 scroll-mt-24">
          <h2 id="seven-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <ListChecks className="h-6 w-6 text-accent" aria-hidden /> Seven things to know before choosing accommodation
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {SEVEN_THINGS.map((item, i) => (
              <li key={item.title} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">
                  <span className="mr-1.5 text-accent">{i + 1}.</span>
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="itineraries" aria-labelledby="itin-title" className="mt-16 scroll-mt-24">
          <h2 id="itin-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <Route className="h-6 w-6 text-accent" aria-hidden /> Suggested itineraries
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ITINERARIES.map((it) => (
              <div key={it.title} className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">{it.title}</h3>
                <p className="mt-1 text-sm text-foreground/90">
                  <LinkedText text={it.body} names={names} tidesHref={tidesHref} />
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title" className="mt-16 scroll-mt-24">
          <h2 id="faq-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <CircleHelp className="h-6 w-6 text-accent" aria-hidden /> Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group p-4">
                <summary className="cursor-pointer list-none font-medium text-foreground marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="mr-2 inline-block text-accent motion-safe:transition-transform group-open:rotate-90">›</span>
                  {faq.question}
                </summary>
                <p className="mt-2 pl-5 text-sm text-foreground/90">
                  <LinkedText text={faq.answer} names={names} tidesHref={tidesHref} />
                </p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="standards-title" className="mt-16 rounded-lg border border-border bg-card p-5">
          <h2 id="standards-title" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> How this guide is made
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{EDITORIAL_STANDARDS}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Destination photographs ({photoCount}) come from Wikimedia Commons under the free licences credited beneath each one; restaurant and hotel photos come from their {community.name} listings. Captions beginning &ldquo;UNVERIFIED&rdquo; show something relevant whose exact location we could not confirm.
          </p>
        </section>
      </div>
    </article>
  );
}
