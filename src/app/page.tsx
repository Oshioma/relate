import Link from "@/components/ui/link";
import { redirect } from "next/navigation";
import { Caveat, Outfit } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  Crown,
  Globe,
  Heart,
  IdCard,
  Lock,
  MessageCircle,
  Search,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { CommunityCarousel } from "@/components/layout/community-carousel";
import type { Community } from "@/types/database";
import { SHOWCASE_COUNT } from "@/lib/homepage-showcase";
import { communitySubdomainUrl } from "@/lib/custom-domain";
import { WHATSAPP_DISPLAY, WHATSAPP_HREF } from "@/lib/support-contact";
import { readTestimonials, testimonialPhoto } from "@/lib/testimonials";
import { readCreatorTestimonials, HOMEPAGE_TESTIMONIALS } from "@/lib/creator-testimonials";
import { getTestimonialMemberPhotos } from "@/lib/data/testimonial-photos";

// The homepage's own type: a rounded geometric face for the headings, and a
// handwritten one for the little notes scribbled beside the pictures.
const display = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const script = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-script" });

// How many public communities the showcase strip's fallback considers before
// ranking them. How many it renders is SHOWCASE_COUNT, shared with the platform
// admin's featured picker.
const SHOWCASE_POOL = 12;

// How much a community has to show on a card. The card renders a logo, a name
// and a description, so a description counts for most (it's the only line of
// copy) and a logo for the rest — together they're a decent proxy for "someone
// actually set this community up". Array.sort is stable, so communities that
// tie keep the newest-first order the query already applied.
function showcaseRank(community: Community): number {
  return (community.description?.trim() ? 2 : 0) + (community.logo_url ? 1 : 0);
}

// Icon colours from the design: forest green, terracotta and honey.
const GREEN = "bg-[#DCE8D9] text-[#326B42]";
const TERRACOTTA = "bg-[#F6E1D6] text-[#C96745]";
const HONEY = "bg-[#FBEBC8] text-[#C08A1E]";

const FEATURES: { icon: ReactNode; tone: string; title: string; description: string }[] = [
  { icon: <MessageCircle />, tone: GREEN, title: "Discussions", description: "Bring people together with conversations." },
  { icon: <Users />, tone: TERRACOTTA, title: "Spaces", description: "Create public, members-only or paid spaces." },
  { icon: <BookOpen />, tone: TERRACOTTA, title: "Courses", description: "Share knowledge with lessons and resources." },
  { icon: <CalendarDays />, tone: TERRACOTTA, title: "Events", description: "Online or in-person events with RSVPs." },
  { icon: <Store />, tone: HONEY, title: "Marketplace", description: "Buy, sell and support each other." },
  { icon: <IdCard />, tone: GREEN, title: "Directories", description: "Showcase people, businesses or resources." },
  { icon: <Crown />, tone: HONEY, title: "Memberships", description: "Free, paid or multi-tier access options." },
  { icon: <BarChart3 />, tone: GREEN, title: "Insights", description: "See what's working and grow your community." },
];

const ACCESS_OPTIONS: { icon: ReactNode; label: string }[] = [
  { icon: <Globe className="h-4 w-4" />, label: "Public" },
  { icon: <Lock className="h-4 w-4" />, label: "Members only" },
  { icon: <Crown className="h-4 w-4" />, label: "Paid membership" },
  { icon: <Sparkles className="h-4 w-4" />, label: "Free + premium" },
  { icon: <Users className="h-4 w-4" />, label: "Invite only" },
];

const WHY_POINTS = [
  "Public, private or invite-only",
  "Free and paid membership tiers",
  "Beautiful, mobile-friendly design",
  "Built-in courses, events and marketplace",
  "Grow your members and income",
  "Easy to manage (no tech skills needed)",
  "Your own web address",
  "Real support from a small, dedicated team",
];

// One quote card on the page, whoever it came from.
type Quote = { quote: string; name: string; detail: string; photo: string | null };

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  // The showcase strip. A super admin picks what belongs here (Platform admin →
  // Communities), most recent pick first — this is the platform's own front
  // door, so it shows the communities we'd choose to show.
  const { data: picked } = await supabase
    .from("communities")
    .select("*")
    .eq("is_public", true)
    .not("featured_at", "is", null)
    .order("featured_at", { ascending: false })
    .limit(SHOWCASE_COUNT);

  // Typed explicitly: the query above narrows featured_at to non-null, which
  // makes its rows a different type from the fallback's.
  let featuredCommunities: Community[] = picked ?? [];

  // Nothing picked yet — fall back to the heuristic the strip used before, so
  // it's never empty. Ordered newest-first because it used to be oldest-first
  // with a limit of 3, which pinned the strip to the same three communities
  // forever — a community created today could never appear on the platform's
  // own front door, no matter how public it was.
  //
  // Newest-first on its own would happily feature three empty shells created
  // minutes ago, so over-fetch a small pool and prefer the ones with something
  // to show (see showcaseRank).
  if (featuredCommunities.length === 0) {
    const { data: recentPublic } = await supabase
      .from("communities")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(SHOWCASE_POOL);

    featuredCommunities = [...(recentPublic ?? [])]
      .sort((a, b) => showcaseRank(b) - showcaseRank(a))
      .slice(0, SHOWCASE_COUNT);
  }

  const hasShowcase = featuredCommunities.length > 0;

  // The pictures come from the showcased communities' own covers, so the page
  // shows real communities rather than stock people. The first one with a cover
  // is the community in the hero's preview window.
  const withCovers = featuredCommunities.filter((c) => c.cover_image_url);
  const heroCommunity = withCovers[0] ?? null;
  const whyPhoto = (withCovers[1] ?? withCovers[0])?.cover_image_url ?? null;
  const closingPhoto = (withCovers[2] ?? withCovers[1] ?? withCovers[0])?.cover_image_url ?? null;

  const quotes = await getQuotes(supabase, featuredCommunities);

  // The page's own footer is the app-wide SiteFooter from the root layout.
  return (
    <div className={`${display.variable} ${script.variable} min-h-screen bg-[#F7F4EC] text-[#222A25]`}>
      <header className="sticky top-0 z-30 border-b border-[#326B42]/10 bg-[#F7F4EC]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl" aria-label="relate.click home">
            <Heart className="h-6 w-6 text-[#326B42] sm:h-7 sm:w-7" strokeWidth={2.5} />
            relate.click
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {hasShowcase && (
              <a href="#communities" className="hover:text-[#326B42]">
                Communities
              </a>
            )}
            <a href="#features" className="hover:text-[#326B42]">
              Features
            </a>
            <Link href="/pricing" className="hover:text-[#326B42]">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-[#326B42]">
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-sm font-semibold sm:gap-3">
            <Link href="/login" className="whitespace-nowrap rounded-lg border border-[#222A25]/15 bg-white px-3 py-2.5 hover:border-[#326B42] hover:text-[#326B42]">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#326B42] px-3 py-2.5 text-white transition sm:px-4 hover:bg-[#255333]"
            >
              <span className="sm:hidden">Get started</span>
              <span className="hidden sm:inline">Create your community</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F4EC] via-[#F5F1E6] to-[#E4EBDD]">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-14 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pb-20 lg:pt-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Communities for real people</p>
              <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
                Build your community.
                <br />
                <span className="text-[#326B42]">Bring your people together.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#4D5A50]">
                relate.click makes it easy to create beautiful online communities with the tools you need to connect,
                share, learn and grow — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#326B42] px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-[#255333]"
                >
                  Create your community <ArrowRight className="h-4 w-4" />
                </Link>
                {hasShowcase && (
                  <a
                    href="#communities"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#C96745] bg-white/60 px-6 py-3.5 font-semibold text-[#C96745] hover:bg-white"
                  >
                    <Search className="h-4 w-4" /> Explore communities
                  </a>
                )}
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#526452]">
                {["Simple to set up", "Flexible access options", "All the tools you need", "Grow at your own pace"].map((point) => (
                  <li key={point} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#326B42]" /> {point}
                  </li>
                ))}
              </ul>
            </div>
            <HeroPreview community={heroCommunity} />
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y border-[#326B42]/10 bg-[#FBFAF6]">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
            <h2 className="sr-only">Everything your community needs</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {FEATURES.map((feature) => (
                <Feature key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {hasShowcase && (
          <section id="communities" className="scroll-mt-24 bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Real communities</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Explore communities on relate.click
              </h2>
              <p className="mt-3 text-[#526452]">
                From local groups to global movements — discover communities built around shared interests, places and
                purpose.
              </p>
              <div className="mt-9">
                <CommunityCarousel>
                  {featuredCommunities.map((community) => (
                    <CommunityPreview key={community.id} community={community} />
                  ))}
                </CommunityCarousel>
              </div>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-[#EEF1E8] to-[#F7F4EC]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
            <div className="relative pb-6 pr-6 sm:pr-16">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#DCE8D9] to-[#F6E6D6] shadow-xl">
                {whyPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={whyPhoto} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="absolute -right-0 top-8 w-52 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                <p className="text-sm font-bold">Create a space</p>
                <ul className="mt-3 space-y-2.5 text-sm text-[#4D5A50]">
                  {ACCESS_OPTIONS.map((option) => (
                    <li key={option.label} className="flex items-center gap-2.5">
                      <span className="text-[#326B42]">{option.icon}</span>
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Why relate.click</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Powerful community tools.
                <br />
                <span className="text-[#326B42]">Without the complexity.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[#526452]">
                Whether you&apos;re a creator, business, local group or global movement, relate.click gives you
                everything you need to build a thriving community.
              </p>
              <ul className="mt-7 grid gap-x-8 gap-y-3 text-sm text-[#3B463E] sm:grid-cols-2">
                {WHY_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#326B42]" /> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {quotes.length > 0 && (
          <section className="bg-[#FBFAF6] px-6 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">
                What our communities say
              </p>
              <h2 className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Real people. Real impact.
              </h2>
              <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
                {quotes.map((q, i) => (
                  <figure key={i} className="flex flex-col gap-4 rounded-2xl border border-[#E7E7DC] bg-white p-6 shadow-sm">
                    <Avatar src={q.photo} name={q.name || q.detail} size={56} />
                    <div>
                      <blockquote className="whitespace-pre-line leading-7 text-[#3B463E]">&ldquo;{q.quote}&rdquo;</blockquote>
                      <figcaption className="mt-4 text-sm">
                        {q.name && <span className="block font-semibold">{q.name}</span>}
                        {q.detail && <span className="block text-[#637067]">{q.detail}</span>}
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-[#326B42]/10 bg-[#FBFAF6]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-8 sm:px-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
                24 hour support. Call us for improvements.
              </h2>
              <p className="mt-1 text-sm text-[#526452]">
                Let&apos;s make this work together. You want good service, but you don&apos;t want to pay the world.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[#326B42]">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#326B42]/30 bg-white px-4 py-2.5 hover:border-[#326B42]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
              <Link href="/contact" className="underline underline-offset-4 hover:text-[#255333]">
                Or send a message
              </Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#F6E6D6] to-[#DCE8D9]">
          {closingPhoto && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={closingPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FBF3E8] via-[#FBF3E8]/90 to-[#FBF3E8]/10" />
            </>
          )}
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-6 py-20 sm:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Ready to build something meaningful?</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
                Start your community today.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-[#4D5A50]">
                Bring your people together, share what you love, and make a real impact.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#326B42] px-6 py-3.5 font-semibold text-white hover:bg-[#255333]"
                >
                  Create your community <ArrowRight className="h-4 w-4" />
                </Link>
                {hasShowcase && (
                  <a
                    href="#communities"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#222A25]/20 bg-white/80 px-6 py-3.5 font-semibold hover:bg-white"
                  >
                    <Search className="h-4 w-4" /> Explore communities
                  </a>
                )}
              </div>
            </div>
            <p
              aria-hidden
              className="hidden rotate-[-6deg] font-[family-name:var(--font-script)] text-3xl leading-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] md:block"
            >
              People
              <br />
              Places
              <br />
              Ideas
              <br />
              Real connections
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// Up to HOMEPAGE_TESTIMONIALS quotes: the creator quotes the super admin wrote
// (Platform admin → Homepage) first, then real member quotes from the
// showcased communities' own landing pages. Nothing here is made up, so with
// no quotes anywhere the section simply isn't shown. Fails soft: a missing
// column or a failed photo lookup costs the quotes or the photos, never the
// page.
async function getQuotes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  communities: Community[]
): Promise<Quote[]> {
  const { data: settings } = await supabase.from("platform_settings").select("creator_testimonials").eq("id", 1).maybeSingle();
  const quotes: Quote[] = readCreatorTestimonials(settings?.creator_testimonials).map((t) => ({
    quote: t.quote,
    name: t.name,
    detail: t.role,
    photo: null,
  }));

  for (const community of communities) {
    if (quotes.length >= HOMEPAGE_TESTIMONIALS) break;
    const members = readTestimonials(community.testimonials).slice(0, HOMEPAGE_TESTIMONIALS - quotes.length);
    if (members.length === 0) continue;
    const photos = await getTestimonialMemberPhotos(
      community.id,
      members.flatMap((t) => (t.memberId ? [t.memberId] : []))
    );
    for (const t of members) {
      quotes.push({ quote: t.quote, name: t.name, detail: `Member, ${community.name}`, photo: testimonialPhoto(t, photos) });
    }
  }

  return quotes.slice(0, HOMEPAGE_TESTIMONIALS);
}

// The big picture beside the hero copy: a browser window and a phone showing a
// real showcased community (its cover, logo, name and tagline). Without one it
// shows a generic "Your community" instead. The feed below the cover is drawn
// as placeholder lines, never as made-up posts.
function HeroPreview({ community }: { community: Community | null }) {
  const name = community?.name ?? "Your community";
  const tagline = community?.tagline || community?.description || "Connect · Share · Grow";
  const cover = community?.cover_image_url ?? null;

  return (
    <div className="relative mx-auto w-full max-w-2xl pb-10 lg:pr-16">
      <p
        aria-hidden
        className="absolute -top-8 right-0 z-10 hidden rotate-[-4deg] font-[family-name:var(--font-script)] text-2xl leading-6 text-[#3B463E] sm:block"
      >
        Your community.
        <br />
        <span className="pl-6">Your way.</span>
      </p>

      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex">
          <div className="hidden w-36 shrink-0 border-r border-[#EDEDE4] bg-[#FBFAF6] p-3 text-xs text-[#4D5A50] sm:block">
            <p className="mb-3 flex items-center gap-1.5 font-bold text-[#222A25]">
              <Heart className="h-3.5 w-3.5 text-[#326B42]" /> relate.click
            </p>
            {["Home", "Feed", "Spaces", "Events", "Courses", "Directory", "Members"].map((item, i) => (
              <p key={item} className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-[#E9EEE4] font-semibold text-[#326B42]" : ""}`}>
                {item}
              </p>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="h-32 bg-gradient-to-br from-[#9CC3A5] to-[#E9C9A8] sm:h-40">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex items-center gap-3 px-4 pt-3">
              <Avatar
                src={community?.logo_url}
                name={name}
                initials={community?.logo_initials}
                size={52}
                className="-mt-8 border-4 border-white bg-white"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-[family-name:var(--font-display)] text-lg font-bold">{name}</p>
                <p className="truncate text-xs text-[#637067]">{tagline}</p>
              </div>
              <span className="rounded-md bg-[#326B42] px-3 py-1.5 text-xs font-semibold text-white">+ Join</span>
            </div>
            <div className="mt-3 flex gap-4 overflow-hidden border-b border-[#EDEDE4] px-4 text-xs text-[#637067]">
              {["Discussion", "Guides", "Events", "Directory", "Marketplace"].map((tab, i) => (
                <span key={tab} className={`whitespace-nowrap pb-2 ${i === 0 ? "border-b-2 border-[#326B42] font-semibold text-[#326B42]" : ""}`}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="space-y-3 p-4">
              {[0, 1].map((row) => (
                <div key={row} className="rounded-xl border border-[#EDEDE4] p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-[#E9EEE4]" />
                    <span className="h-2.5 w-24 rounded-full bg-[#E4E4DA]" />
                  </div>
                  <span className="mt-3 block h-2 w-full rounded-full bg-[#EFEFE6]" />
                  <span className="mt-2 block h-2 w-2/3 rounded-full bg-[#EFEFE6]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 right-0 hidden w-40 overflow-hidden rounded-[1.75rem] border-[6px] border-[#222A25] bg-white shadow-2xl sm:block">
        <div className="h-24 bg-gradient-to-br from-[#9CC3A5] to-[#E9C9A8]">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-bold">{name}</p>
          <span className="mt-2 block rounded-md bg-[#326B42] py-1 text-center text-[11px] font-semibold text-white">+ Join</span>
          {["Home", "Discussion", "Guides", "Events"].map((item) => (
            <p key={item} className="mt-2 text-[11px] text-[#637067]">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, tone, title, description }: { icon: ReactNode; tone: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-[#E7E7DC]">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${tone}`}>{icon}</div>
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#637067]">{description}</p>
    </div>
  );
}

// Where a showcase card goes: the community's own front door — its verified
// custom domain, else its subdomain, else the path on this site. Opened in a
// new tab so the platform homepage stays where the visitor left it.
function communityFrontDoor(community: Community): string {
  if (community.custom_domain && community.custom_domain_verified_at) return `https://${community.custom_domain}`;
  return communitySubdomainUrl(community.slug) ?? `/c/${community.slug}`;
}

function CommunityPreview({ community }: { community: Community }) {
  return (
    <a
      href={communityFrontDoor(community)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#E7E7DC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#326B42] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
    >
      <div className="h-36 bg-gradient-to-br from-[#DCE8D9] to-[#F6E6D6]">
        {community.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={community.cover_image_url} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Avatar
          src={community.logo_url}
          name={community.name}
          initials={community.logo_initials}
          size={48}
          className="-mt-11 mb-3 border-4 border-white bg-white"
        />
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold group-hover:text-[#326B42]">
          {community.name}
        </h3>
        {(community.tagline || community.description) && (
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-[#637067]">{community.tagline || community.description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#326B42]">
          Visit community <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}
