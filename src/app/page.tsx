import Link from "@/components/ui/link";
import { redirect } from "next/navigation";
import localFont from "next/font/local";
import {
  ArrowRight,
  Briefcase,
  Check,
  Crown,
  Globe,
  GraduationCap,
  Handshake,
  Headset,
  Heart,
  Leaf,
  Lock,
  MapPin,
  MessageCircle,
  Quote as QuoteMark,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { CommunityCarousel } from "@/components/layout/community-carousel";
import { ProductDemo } from "@/components/landing/product-demo";
import { MobileMenu } from "@/components/landing/mobile-menu";
import { getActivePlatformPlans } from "@/lib/data/platform-plans";
import { planFeatureEnforcement, planFeatureLabel, planLimitLabel } from "@/lib/features";
import { formatMoney } from "@/lib/utils";
import type { Community, PlatformPlan } from "@/types/database";
import { SHOWCASE_COUNT } from "@/lib/homepage-showcase";
import { communitySubdomainUrl } from "@/lib/custom-domain";
import { WHATSAPP_DISPLAY, WHATSAPP_HREF } from "@/lib/support-contact";
import { readTestimonials, testimonialPhoto } from "@/lib/testimonials";
import { readCreatorTestimonials, HOMEPAGE_TESTIMONIALS } from "@/lib/creator-testimonials";
import { getTestimonialMemberPhotos } from "@/lib/data/testimonial-photos";
import { pickHomepagePhotos } from "@/lib/homepage-photos";

// The homepage's own type: a rounded geometric face for the headings, and a
// handwritten one for the little notes scribbled beside the pictures.
// Bundled (Outfit and Caveat, latin, variable weight; SIL Open Font License)
// rather than fetched from Google Fonts at build time, where a failed download
// failed the whole build.
const display = localFont({ src: "./fonts/outfit-latin.woff2", weight: "600 800", variable: "--font-display" });
const script = localFont({ src: "./fonts/caveat-latin.woff2", weight: "500 600", variable: "--font-script" });

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

// Who Relate is for: one line each, no essay.
const AUDIENCES: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <Handshake className="h-5 w-5" />, title: "Networking groups", description: "Introductions, events and a directory of who's who." },
  { icon: <Target className="h-5 w-5" />, title: "Masterminds", description: "A private room for a small group that meets often." },
  { icon: <MapPin className="h-5 w-5" />, title: "Local communities", description: "Neighbours, places, a marketplace and what's on." },
  { icon: <UsersRound className="h-5 w-5" />, title: "Clubs and interest groups", description: "Meetups, photos and chat around what you love." },
  { icon: <GraduationCap className="h-5 w-5" />, title: "Educators and course creators", description: "Courses, live lessons and a place for questions." },
  { icon: <Crown className="h-5 w-5" />, title: "Membership businesses", description: "Free and paid tiers, with paid spaces for extras." },
  { icon: <Leaf className="h-5 w-5" />, title: "Wellness and mindfulness", description: "A calm home for sessions, practice and support." },
  { icon: <Briefcase className="h-5 w-5" />, title: "Professional communities", description: "Knowledge, jobs and peers in one private place." },
];

// The access models a host can mix, from the community's privacy and join
// policy down to each space's own visibility and price.
const ACCESS_MODELS: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <Globe className="h-4 w-4" />, title: "Open", description: "Anyone can find it and join." },
  { icon: <Lock className="h-4 w-4" />, title: "Private", description: "People ask to join and you approve, or join by invitation only." },
  { icon: <Crown className="h-4 w-4" />, title: "Paid membership", description: "Members choose a tier you've priced." },
  { icon: <Sparkles className="h-4 w-4" />, title: "Free + premium", description: "A free community with paid spaces or courses inside." },
  { icon: <SlidersHorizontal className="h-4 w-4" />, title: "Your own mix", description: "Set who can see and post in each space." },
];

const STEPS: { title: string; description: string }[] = [
  { title: "Create your community", description: "Choose a name, add your branding and select how people join." },
  { title: "Make it your own", description: "Add discussions, courses, events, directories, guides, resources and other spaces." },
  { title: "Bring your people together", description: "Invite members, share content, build relationships and grow." },
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

  // The super admin's homepage picks (Platform admin → Homepage). select("*")
  // so a column that isn't deployed yet just reads as unset, never an error.
  const { data: settings } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();

  // The picked hero community, if it's still there and still public.
  const { data: pickedHero } = settings?.hero_community_id
    ? await supabase.from("communities").select("*").eq("id", settings.hero_community_id).eq("is_public", true).maybeSingle()
    : { data: null };

  // Pictures not picked come from the showcased communities' own covers, so the
  // page shows real communities rather than stock people.
  const { heroCommunity, whyPhoto, closingPhoto } = pickHomepagePhotos(settings, featuredCommunities, pickedHero ?? null);

  const quotes = await getQuotes(settings?.creator_testimonials, featuredCommunities);
  const testimonial = quotes[0] ?? null;

  // The live price list, the same rows /pricing renders. Never fail the
  // homepage over it: no plans just shows a "talk to us" line instead.
  let plans: PlatformPlan[] = [];
  try {
    plans = await getActivePlatformPlans(supabase);
  } catch {
    plans = [];
  }

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
            <a href="#how-it-works" className="hover:text-[#326B42]">
              How it works
            </a>
            <Link href="/pricing" className="hover:text-[#326B42]">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-[#326B42]">
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-sm font-semibold sm:gap-3">
            <Link href="/login" className="hidden whitespace-nowrap rounded-lg border border-[#222A25]/15 bg-white px-3 py-2.5 hover:border-[#326B42] hover:text-[#326B42] sm:inline-block">
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
            {/* Below lg the inline nav is hidden; on phones Log in lives in here too. */}
            <MobileMenu
              links={[
                ...(hasShowcase ? [{ href: "#communities", label: "Communities" }] : []),
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How it works" },
                { href: "/pricing", label: "Pricing" },
                { href: "/contact", label: "Support" },
                { href: "/login", label: "Log in" },
              ]}
            />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F4EC] via-[#F5F1E6] to-[#E4EBDD]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-14 pt-10 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pb-16 lg:pt-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Communities for real people</p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl">
                Build your community.
                <br />
                <span className="text-[#326B42]">Bring your people together.</span>
              </h1>
              <p className="mt-5 font-[family-name:var(--font-display)] text-xl font-semibold text-[#222A25] sm:text-2xl">
                A calm, private home for your community.
              </p>
              <p className="mt-3 max-w-xl leading-7 text-[#4D5A50]">
                Whether you run a networking group, mastermind, co-working space, membership, or local community,
                Relate helps your audience connect like never before — creating stronger relationships that keep people
                coming back.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#326B42] px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-[#255333]"
                >
                  Create your community <ArrowRight className="h-4 w-4" />
                </Link>
                {hasShowcase && (
                  <a
                    href="#communities"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#C96745] bg-white/60 px-6 py-3.5 font-semibold text-[#B35A3A] hover:bg-white"
                  >
                    <Search className="h-4 w-4" /> Explore communities
                  </a>
                )}
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-[#526452]">
                <Check className="h-4 w-4 shrink-0 text-[#326B42]" />
                Spend less time managing your community and more time growing it.
              </p>
            </div>
            <HeroPreview community={heroCommunity} />
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-y border-[#326B42]/10 bg-[#FBFAF6] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">See how it works</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Everything your community needs, in one place.
              </h2>
              <p className="mt-3 text-[#526452]">Pick a feature to see it. Turn on only the ones you want.</p>
            </div>
            <div className="mt-8">
              <ProductDemo />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Your community, up and running in minutes.
            </h2>
            <ol className="relative mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {/* The thread joining the three steps on wide screens. */}
              <span aria-hidden className="absolute left-[16%] right-[16%] top-6 hidden border-t-2 border-dashed border-[#326B42]/25 md:block" />
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#326B42] font-[family-name:var(--font-display)] text-lg font-bold text-white ring-8 ring-[#F7F4EC]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold md:mt-2">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#526452]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 text-center">
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-[#326B42] hover:underline">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {hasShowcase && (
          <section id="communities" className="scroll-mt-20 bg-white py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Real communities</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Explore communities on relate.click
              </h2>
              <p className="mt-3 text-[#526452]">
                From local groups to global movements — discover communities built around shared interests, places and
                purpose.
              </p>
              <div className="mt-8">
                <CommunityCarousel>
                  {featuredCommunities.map((community) => (
                    <CommunityPreview key={community.id} community={community} />
                  ))}
                </CommunityCarousel>
              </div>
            </div>
          </section>
        )}

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              A home for every kind of community.
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8 sm:gap-y-7 lg:grid-cols-4">
              {AUDIENCES.map((audience, i) => (
                <li key={audience.title} className="flex items-center gap-3 sm:items-start">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      ["bg-[#DCE8D9] text-[#326B42]", "bg-[#F6E1D6] text-[#C96745]", "bg-[#FBEBC8] text-[#A87512]"][i % 3]
                    }`}
                  >
                    {audience.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold sm:text-base">{audience.title}</h3>
                    <p className="mt-0.5 hidden text-sm leading-6 text-[#526452] sm:block">{audience.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#EEF1E8] to-[#F7F4EC]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:py-16">
            <div className="relative pb-6 pr-6 sm:pr-16">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#DCE8D9] to-[#F6E6D6] shadow-xl">
                {whyPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={whyPhoto} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="absolute right-0 top-8 w-56 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
                <p className="text-sm font-bold">Who can join?</p>
                <ul className="mt-3 space-y-2.5 text-sm text-[#4D5A50]">
                  {ACCESS_MODELS.map((model, i) => (
                    <li key={model.title} className="flex items-center gap-2.5">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          i === 0 ? "border-[#326B42] bg-[#326B42]" : "border-[#222A25]/25"
                        }`}
                      >
                        {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      {model.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Memberships</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Start free.
                <br />
                <span className="text-[#326B42]">Grow your way.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[#526452]">
                Choose how people join, and change it whenever you like. On plans that include paid memberships you can
                charge for membership tiers, paid spaces and courses, and members pay you directly through your own
                Stripe account.
              </p>
              <ul className="mt-6 space-y-3">
                {ACCESS_MODELS.map((model) => (
                  <li key={model.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#326B42] shadow-sm ring-1 ring-[#326B42]/10">
                      {model.icon}
                    </span>
                    <p className="text-sm leading-6 text-[#3B463E]">
                      <span className="font-semibold text-[#222A25]">{model.title}.</span> {model.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#326B42]">Pricing</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need. Without paying the world.
              </h2>
              <p className="mt-3 text-[#526452]">
                {plans.length > 0 ? `${startingPrice(plans)}, priced per community and billed monthly. ` : ""}
                You pay for your community&apos;s plan; your members never get a Relate bill.
              </p>
            </div>
            {plans.length > 0 ? (
              <>
                <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {plans.map((plan) => (
                    <PlanPreview key={plan.id} plan={plan} />
                  ))}
                </div>
                <p className="mt-6 text-center text-sm">
                  <Link href="/pricing" className="inline-flex items-center gap-1 font-semibold text-[#326B42] hover:underline">
                    Compare plans and add-ons <ArrowRight className="h-4 w-4" />
                  </Link>
                </p>
              </>
            ) : (
              <p className="mt-8 text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#326B42] px-5 py-3 font-semibold text-white hover:bg-[#255333]"
                >
                  Ask us about pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </p>
            )}
          </div>
        </section>

        {testimonial && (
          <section className="bg-[#FBFAF6] px-6 py-14 sm:px-8 sm:py-16">
            <figure className="mx-auto max-w-3xl text-center">
              <QuoteMark aria-hidden className="mx-auto h-9 w-9 text-[#C96745]" />
              <blockquote className="mt-4 whitespace-pre-line font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-center gap-3 text-left text-sm">
                <Avatar src={testimonial.photo} name={testimonial.name || testimonial.detail} size={48} />
                <span>
                  {testimonial.name && <span className="block font-semibold">{testimonial.name}</span>}
                  {testimonial.detail && <span className="block text-[#637067]">{testimonial.detail}</span>}
                </span>
              </figcaption>
            </figure>
          </section>
        )}

        <section className="px-6 py-10 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#326B42]/10 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DCE8D9] text-[#326B42]">
              <Headset className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold sm:text-2xl">
                24 hour support. Call us for improvements.
              </h2>
              <p className="mt-1 text-[#526452]">
                Let&apos;s make this work together. You want good service, but you don&apos;t want to pay the world.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-[#326B42]">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#326B42] px-4 py-2.5 text-white hover:bg-[#255333]"
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
              <img src={closingPhoto} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              {/* On a phone the words cover the whole photo, so it's faded evenly there. */}
              <div className="absolute inset-0 bg-[#FBF3E8]/85 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#FBF3E8] sm:via-[#FBF3E8]/90 sm:to-[#FBF3E8]/10" />
            </>
          )}
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-6 py-16 sm:px-8 lg:py-20">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
                Your people are out there.
                <br />
                <span className="text-[#326B42]">Bring them together.</span>
              </h2>
              <p className="mt-4 max-w-xl text-lg text-[#4D5A50]">
                A calm, private home for your community, with the tools to help it grow.
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

// Up to HOMEPAGE_TESTIMONIALS quotes (one, today): the creator quotes the super admin wrote
// (Platform admin → Homepage) first, then real member quotes from the
// showcased communities' own landing pages. Nothing here is made up, so with
// no quotes anywhere the section simply isn't shown. Fails soft: a missing
// column or a failed photo lookup costs the quotes or the photos, never the
// page.
async function getQuotes(creatorTestimonials: unknown, communities: Community[]): Promise<Quote[]> {
  const quotes: Quote[] = readCreatorTestimonials(creatorTestimonials).map((t) => ({
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

// The cheapest plan, said plainly: "Start free" when there's a free plan.
function startingPrice(plans: PlatformPlan[]): string {
  const cheapest = [...plans].sort((a, b) => a.price_cents - b.price_cents)[0];
  return cheapest.price_cents === 0 ? "Start free" : `From ${formatMoney(cheapest.price_cents, cheapest.currency)} a month`;
}

// One plan, compact. Lists only the features the product actually enforces
// (see PLAN_FEATURE_ENFORCEMENT) and the plan's own caps, so the homepage
// never promises more than /pricing can deliver.
function PlanPreview({ plan }: { plan: PlatformPlan }) {
  const features = plan.features.filter((key) => planFeatureEnforcement(key));
  const limits = Object.entries(plan.limits ?? {});
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#E7E7DC]">
      <h3 className="font-bold">{plan.name}</h3>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">
        {formatMoney(plan.price_cents, plan.currency)}
        <span className="text-sm font-normal text-[#637067]"> / mo</span>
      </p>
      {plan.description && <p className="mt-2 text-sm leading-6 text-[#526452]">{plan.description}</p>}
      {(features.length > 0 || limits.length > 0) && (
        <ul className="mt-4 space-y-1.5 text-sm text-[#3B463E]">
          {features.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#326B42]" /> {planFeatureLabel(key)}
            </li>
          ))}
          {limits.map(([key, value]) => (
            <li key={key} className="flex items-start gap-2 text-[#637067]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A9B2AB]" /> {planLimitLabel(key, value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
