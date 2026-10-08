import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, Leaf, Sprout } from "lucide-react";
import type { Community, Event, Space } from "@/types/database";
import type { PublicTier } from "@/lib/data/public-tiers";
import type { PublicCrop } from "@/lib/data/public-crops";
import type { PostWithAuthorAndSpace } from "@/lib/data/posts";
import { formatDateTime } from "@/lib/utils";
import { SPACE_TYPES } from "@/lib/space-types";

// Nature's Gardeners' own front door at naturesgardeners.net: the old
// standalone marketing site, rebuilt here so joining happens on Relate. Shown
// to signed-out visitors in place of the generic welcome page (see page.tsx).
// Everything a visitor can click leads into the real community — its spaces,
// sign-up and membership tiers — so the page stays true as the community grows.

const IMG = "/communities/naturesgardeners";

// Landing copy for the spaces worth showing off, by slug first, then by type.
// Spaces without an entry fall back to their own description.
const SPACE_COPY: Record<string, { title: string; text: string }> = {
  "crop-guide": { title: "Crop by crop guides", text: "Organic, region-aware guides that take you from seed to harvest." },
  "ask-for-help": {
    title: "Ask the community",
    text: "Post a photo of a struggling plant and get answers from growers who've been there.",
  },
  "live-room": { title: "Live lessons & Q&A", text: "Join live sessions with experienced growers and bring your questions." },
  school: { title: "Grower school", text: "Step-by-step courses, whether it's your first seed tray or your fiftieth." },
  "growing-journey": {
    title: "Growing journeys",
    text: "Share your progress, celebrate each other's harvests and find inspiration for the next crop.",
  },
  "plant-id": { title: "Plant ID", text: "Snap a photo to find out what a plant is, whether it's edible and how to grow it." },
  "plant-health-scanner": {
    title: "Plant health scanner",
    text: "Photograph a sick plant to spot pests, diseases and deficiencies, with organic fixes.",
  },
  "my-crops": { title: "My crops", text: "Keep track of what you're growing, synced from the Shamba Online farm app." },
  "shamba-online": { title: "Shamba Online", text: "Plan your plot, tasks and harvests with our sister farm app." },
};

const COPY_ORDER = Object.keys(SPACE_COPY);

// Counts this small read as "empty" to a stranger, so the hero only shows
// them once the community is visibly busy.
const MIN_SHOWN_MEMBERS = 50;
const MIN_SHOWN_POSTS = 100;
// The activity strip only appears when there's something recent to show.
const RECENT_DAYS = 60;
const MIN_RECENT_POSTS = 2;

const FOR_YOU = [
  "Serious about growing organic food",
  "Keen to take responsibility for what you eat",
  "Aiming to be as self-sufficient as you can",
  "Just starting out with organic growing",
  "A seasoned grower happy to share what you know",
];

const STEPS = [
  {
    image: "harvest-basket",
    title: "Join free",
    text: "Create your account in a minute and say hello. Tell us what you grow and where, from a windowsill to a smallholding.",
  },
  {
    image: "spinach",
    title: "Learn and ask",
    text: "Dip into the guides and live sessions, and ask when something goes wrong. We all have difficult days in the garden, and someone here has been there.",
  },
  {
    image: "urban-garden",
    title: "Grow and share",
    text: "Post your harvests and new varieties, swap tips and cheer each other on. From seed to plate, we lift each other up.",
  },
];

const FREE_INCLUDES = [
  "Crop guides and growing resources",
  "Ask the community and get answers",
  "Live lessons and Q&A",
  "Share your growing journey",
];

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function timeAgo(iso: string, now: number): string {
  const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "last week" : `${weeks} weeks ago`;
}

export function NaturesGardenersLanding({
  community,
  spaces,
  tiers,
  crops,
  recentPosts,
  upcomingEvents,
  members,
  posts,
  signupHref,
  loginHref,
  lookAroundHref,
}: {
  community: Community;
  spaces: Space[];
  tiers: PublicTier[];
  crops: PublicCrop[];
  recentPosts: PostWithAuthorAndSpace[];
  upcomingEvents: Event[];
  members: number;
  posts: number;
  signupHref: string;
  loginHref: string;
  lookAroundHref: string;
}) {
  const base = `/c/${community.slug}`;
  // Paid tiers are chosen on the membership page once signed up.
  const tierSignupHref = `/signup?next=${encodeURIComponent(`${base}/membership`)}`;
  const features = spaces
    .filter((space) => space.show_in_nav)
    .map((space) => {
      const copy = SPACE_COPY[space.slug];
      const meta = SPACE_TYPES[space.space_type];
      return {
        id: space.id,
        href: `${base}/spaces/${space.slug}`,
        title: copy?.title ?? space.name,
        text: copy?.text ?? space.description ?? meta?.description ?? "",
        Icon: meta?.icon ?? Leaf,
        rank: copy ? COPY_ORDER.indexOf(space.slug) : COPY_ORDER.length,
      };
    })
    // Spaces with landing copy first, in the order above.
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6);

  // Crop guides are for members; a preview card leads through sign-up to it.
  const cropSpace = spaces.find((space) => space.space_type === "crop_guides");
  const cropHref = (slug: string) =>
    cropSpace
      ? `/signup?next=${encodeURIComponent(`${base}/spaces/${cropSpace.slug}/crop-guides/${slug}`)}`
      : signupHref;

  // eslint-disable-next-line react-hooks/purity -- server component, rendered per request
  const now = Date.now();
  const freshPosts = recentPosts
    .filter((post) => now - new Date(post.created_at).getTime() < RECENT_DAYS * 86_400_000)
    .slice(0, 3);
  const showActivity = freshPosts.length >= MIN_RECENT_POSTS || upcomingEvents.length > 0;
  const showMembers = members >= MIN_SHOWN_MEMBERS;
  const showPosts = posts >= MIN_SHOWN_POSTS;

  return (
    <div className="min-h-screen bg-[#f6f3ea] text-[#1c2a17] [color-scheme:light]">
      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-8">
          <Link href={base} aria-label={`${community.name} home`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
            <img src={`${IMG}/logo-white.webp`} alt="Nature's Gardeners" width={112} height={58} className="h-11 w-auto md:h-14" />
          </Link>
          <nav className="flex items-center gap-2" aria-label="Account">
            <Link
              href={loginHref}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href={signupHref}
              className="rounded-full bg-[#9be15d] px-4 py-2 text-sm font-semibold text-[#14240f] hover:bg-[#b2ec7c]"
            >
              Join free
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden bg-[#1f3d17]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static hero photo */}
        <img src={`${IMG}/hero.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#14240f]/90" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-32 text-white md:px-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c5f29b]">
            <Sprout className="h-4 w-4" />
            Organic growing community
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Where organic gardeners learn and grow together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Crop guides, live lessons and a friendly community of growers, from first-time balcony gardeners to seasoned
            organic farmers.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={signupHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9be15d] px-7 py-3.5 text-base font-semibold text-[#14240f] hover:bg-[#b2ec7c]"
            >
              Join free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={lookAroundHref}
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
            >
              Take a look around
            </Link>
          </div>
          {(showMembers || showPosts) && (
            <dl className="mt-12 flex gap-10 text-white">
              {showMembers && (
                <div className="flex flex-col-reverse">
                  <dt className="text-sm text-white/75">{members === 1 ? "grower" : "growers"}</dt>
                  <dd className="text-3xl font-semibold">{members.toLocaleString("en-US")}</dd>
                </div>
              )}
              {showPosts && (
                <div className="flex flex-col-reverse">
                  <dt className="text-sm text-white/75">{posts === 1 ? "post" : "posts"} shared</dt>
                  <dd className="text-3xl font-semibold">{posts.toLocaleString("en-US")}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      {/* PURPOSE */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-8 md:py-28">
        {/* eslint-disable-next-line @next/next/no-img-element -- static photo */}
        <img
          src={`${IMG}/hands-soil.webp`}
          alt="Hands holding soil with a young basil plant"
          loading="lazy"
          className="mx-auto w-56 drop-shadow-xl sm:w-64 md:w-full md:max-w-sm"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">Why we started</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Growing organic food shouldn&apos;t feel overwhelming.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#3d4a37]">
            When we started growing our own food, we went looking for people who were already doing it, and learned more
            from them than from any book. Nature&apos;s Gardeners brings those growers, their lessons and our favourite
            resources together in one easy place.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#3d4a37]">
            Tips come from growers around the world, in every kind of climate, so you&apos;ll find advice that fits your
            soil, your season and your space.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      {features.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">What you get</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Everything you need to grow with confidence.
            </h2>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ id, href, title, text, Icon }) => (
                <li key={id}>
                  <Link
                    href={href}
                    className="group flex h-full flex-col rounded-3xl border border-[#e2e8d8] bg-[#fbfaf5] p-6 transition hover:-translate-y-0.5 hover:border-[#9be15d] hover:shadow-lg"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f5d6] text-[#2f6b16]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="mt-5 text-lg font-semibold group-hover:text-[#2f6b16]">{title}</span>
                    <span className="mt-2 text-[15px] leading-relaxed text-[#56624f]">{text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CROP GUIDES — real guides from the library, photos and all */}
      {crops.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">Crop guides</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Start with these.
              </h2>
              <p className="mt-4 text-lg text-[#56624f]">
                Organic, step-by-step guides from sowing to harvest. Join free to read them in full.
              </p>
            </div>
            <Link
              href={cropSpace ? `/signup?next=${encodeURIComponent(`${base}/spaces/${cropSpace.slug}`)}` : signupHref}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#2f6b16] hover:underline"
            >
              All crop guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {crops.map((crop) => (
              <li key={crop.slug}>
                <Link
                  href={cropHref(crop.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e2e8d8] bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e6f5d6]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- crop library photo */}
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {crop.beginnerFriendly && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#2f6b16] shadow-sm">
                        Beginner friendly
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-lg font-semibold group-hover:text-[#2f6b16]">{crop.name}</span>
                    {crop.overview && (
                      <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#56624f]">{crop.overview}</span>
                    )}
                    {(crop.daysToHarvest || (crop.difficulty && !crop.beginnerFriendly)) && (
                      <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs font-medium text-[#3f8a1f]">
                        {crop.daysToHarvest ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            ~{crop.daysToHarvest} days to harvest
                          </span>
                        ) : null}
                        {crop.difficulty && !crop.beginnerFriendly && <span className="capitalize">{crop.difficulty}</span>}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LATELY IN THE GARDEN — only when there's recent activity to show */}
      {showActivity && (
        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">Lately in the garden</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              What growers are sharing.
            </h2>
            {upcomingEvents.length > 0 && (
              <ul className="mt-10 grid gap-4 md:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`${base}/events`}
                      className="flex h-full items-start gap-4 rounded-2xl bg-[#1f3d17] p-5 text-white hover:bg-[#2c5421]"
                    >
                      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#9be15d]" />
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-[#c5f29b]">
                          {formatDateTime(event.start_time)}
                        </span>
                        <span className="mt-1 block font-semibold">{event.title}</span>
                        {(event.location_label || event.location) && (
                          <span className="mt-0.5 block truncate text-sm text-white/75">
                            {event.location_label || event.location}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {freshPosts.length >= MIN_RECENT_POSTS && (
              <ul className="mt-6 grid gap-5 md:grid-cols-3">
                {freshPosts.map((post) => {
                  const author = post.author?.full_name || post.author?.username || "A grower";
                  return (
                    <li key={post.id}>
                      <Link
                        href={`${base}/spaces/${post.space.slug}/posts/${post.id}`}
                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e2e8d8] bg-[#fbfaf5] transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        {post.media_url && /^https?:\/\//.test(post.media_url) && (
                          // eslint-disable-next-line @next/next/no-img-element -- member upload
                          <img src={post.media_url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                        )}
                        <div className="flex flex-1 flex-col p-5">
                          <span className="text-xs font-semibold text-[#3f8a1f]">{post.space.name}</span>
                          <span className="mt-1 line-clamp-2 font-semibold group-hover:text-[#2f6b16]">{post.title}</span>
                          {post.body && (
                            <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#56624f]">{post.body}</span>
                          )}
                          <span className="mt-auto pt-4 text-xs text-[#56624f]">
                            {author} · {timeAgo(post.created_at, now)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* IS THIS FOR YOU */}
      <section className="relative overflow-hidden bg-[#1f3d17] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- static decorative photo */}
        <img src={`${IMG}/seedling.webp`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Nature&apos;s Gardeners is the place for you if you&apos;re…
          </h2>
          <ul className="space-y-4">
            {FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#9be15d] text-[#14240f]">
                  <Check className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">How it works</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          From seed to plate, together.
        </h2>
        <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="text-center md:text-left">
              {/* Same oval frame for every photo, whatever shape the source was cut to. */}
              <div className="mx-auto h-64 w-44 overflow-hidden rounded-full shadow-lg md:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- static photo */}
                <img src={`${IMG}/${step.image}.webp`} alt="" loading="lazy" className="h-full w-full scale-110 object-cover" />
              </div>
              <p className="mt-6 text-sm font-semibold text-[#3f8a1f]">Step {i + 1}</p>
              <h3 className="mt-1 text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#56624f]">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* MEMBERSHIP — the free tier plus any paid tiers set up in Relate */}
      <section id="membership" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f8a1f]">Membership</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">Join free today.</h2>
            <p className="mt-4 text-lg text-[#56624f]">
              {tiers.length > 0
                ? "Everyone can join for free. Paid memberships unlock extra spaces and support the community."
                : "Membership is free while the community grows. Sign up and start learning straight away."}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col rounded-3xl border-2 border-[#9be15d] bg-[#fbfaf5] p-7">
              <p className="text-lg font-semibold">Free member</p>
              <p className="mt-3 text-4xl font-semibold">
                $0<span className="text-base font-normal text-[#56624f]"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {FREE_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#3d4a37]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3f8a1f]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={signupHref}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1f3d17] px-6 py-3 font-semibold text-white hover:bg-[#2c5421]"
              >
                Join free
              </Link>
            </div>
            {tiers.map((tier) => (
              <div key={tier.id} className="flex flex-col rounded-3xl border border-[#e2e8d8] bg-[#fbfaf5] p-7">
                <p className="text-lg font-semibold">{tier.name}</p>
                <p className="mt-3 text-4xl font-semibold">
                  {formatPrice(tier.priceCents, tier.currency)}
                  <span className="text-base font-normal text-[#56624f]"> / month</span>
                </p>
                {tier.description && <p className="mt-6 flex-1 text-[15px] leading-relaxed text-[#3d4a37]">{tier.description}</p>}
                <Link
                  href={tierSignupHref}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-[#1f3d17] px-6 py-3 font-semibold text-[#1f3d17] hover:bg-[#1f3d17] hover:text-white"
                >
                  Choose {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="rounded-[2rem] bg-[#1f3d17] px-6 py-14 text-center text-white md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Ready to grow with us?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            The more people who know how to grow food, the stronger our communities become.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={signupHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9be15d] px-7 py-3.5 font-semibold text-[#14240f] hover:bg-[#b2ec7c]"
            >
              Join free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e2e8d8]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-[#56624f] sm:flex-row md:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
          <img src={`${IMG}/logo-green.webp`} alt="Nature's Gardeners" width={96} height={54} className="h-10 w-auto" />
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/naturesgardeners/" target="_blank" rel="noopener noreferrer" className="hover:text-[#1f3d17]">
              Instagram
            </a>
            <span>© {new Date().getFullYear()} Nature&apos;s Gardeners</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
