import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Lock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getCommunityStats } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityEvents, splitUpcomingPast } from "@/lib/data/events";
import { getCommunityFeatures } from "@/lib/data/features";
import { getSpaceContentPhotos } from "@/lib/data/space-covers";
import { pickSpaceCovers } from "@/lib/space-covers";
import { SPACE_TYPES } from "@/lib/space-types";
import { communityAccentStyle } from "@/lib/accent-color";
import { coverPositionClass } from "@/lib/cover-position";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { getPublicTiers } from "@/lib/data/public-tiers";
import { getPublicCrops } from "@/lib/data/public-crops";
import { getCommunityPosts } from "@/lib/data/posts";
import { NaturesGardenersLanding } from "./natures-gardeners-landing";

// Communities with their own designed front page instead of the generic one.
const BESPOKE_LANDINGS = new Set(["naturesgardeners"]);

// A community's front door for signed-out visitors. On a community's own host
// (its <slug> subdomain or verified custom domain) the proxy rewrites "/" here
// when the visitor has no session, so a first-time visitor meets the community
// — its cover, what's inside, what's coming up — instead of a feed they can't
// take part in yet. It lives outside /c/[communitySlug] so it renders without
// the community shell (sidebar, header, guest banner). Anyone with a session
// gets the normal feed at "/", and "Take a look around" reaches the guest feed
// via ?view=feed (see src/proxy.ts).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}): Promise<Metadata> {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return {};
  if (BESPOKE_LANDINGS.has(community.slug)) {
    const title = "Nature's Gardeners: where organic gardeners learn and grow together";
    const description =
      "Crop guides, live lessons and a friendly community of organic growers, from balcony gardeners to seasoned farmers. Free to join.";
    const images = ["/communities/naturesgardeners/hero.webp"];
    return { title: { absolute: title }, description, openGraph: { title, description, images } };
  }
  const description =
    community.description?.trim() || `${community.name} — its spaces, events, members and local businesses, all in one place.`;
  const cover = community.cover_image_url;
  const ogImage = cover && /^https?:\/\//i.test(cover) ? [cover] : undefined;
  return {
    title: community.name,
    description,
    openGraph: { title: community.name, description, ...(ogImage ? { images: ogImage } : {}) },
  };
}

export default async function CommunityWelcomePage({
  params,
}: {
  params: Promise<{ communitySlug: string }>;
}) {
  const { communitySlug } = await params;
  const supabase = await createClient();

  // Resolves public and private communities for a guest; invite-only ones
  // don't resolve at all, and notFound is the non-revealing answer.
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const [spaces, events, features, stats, contentPhotos] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    community.events_public ? getCommunityEvents(supabase, community.id) : Promise.resolve([]),
    getCommunityFeatures(supabase, community.id),
    getCommunityStats(supabase, community.id),
    getSpaceContentPhotos(supabase, community.id),
  ]);

  const base = `/c/${community.slug}`;
  const signupHref = `/signup?next=${encodeURIComponent(base)}`;
  const loginHref = `/login?next=${encodeURIComponent(base)}`;
  const guestsMayRead = community.is_public || (community.feed_public && community.privacy !== "invite_only");
  const lookAroundHref = guestsMayRead ? `${base}?view=feed` : `${base}/spaces`;
  const joinLabel = community.privacy === "public" ? `Join ${community.name}` : "Request to join";

  // RLS already narrows spaces to the ones a guest may see.
  const featuredSpaces = spaces.filter((space) => space.show_in_nav).slice(0, 6);
  // A real photo on every card where one exists: the admin's cover, else one
  // from the space's own content, else the community cover (src/lib/space-covers.ts).
  const spaceCovers = pickSpaceCovers(featuredSpaces, contentPhotos, community.cover_image_url);
  const upcoming = features.events ? splitUpcomingPast(events).upcoming.slice(0, 3) : [];
  // Counts a guest can't read (RLS) come back as 0 — show only what's real.
  const statItems = [
    { label: "members", value: stats.members },
    { label: "posts", value: stats.posts },
    { label: "events", value: stats.events },
    { label: "local businesses", value: stats.businesses },
  ].filter((item) => item.value > 0);

  if (BESPOKE_LANDINGS.has(community.slug)) {
    const [tiers, crops, posts] = await Promise.all([
      getPublicTiers(community.id),
      getPublicCrops(),
      // RLS gives a guest only posts from spaces marked public.
      getCommunityPosts(supabase, community.id, 12).catch(() => []),
    ]);
    return (
      <NaturesGardenersLanding
        community={community}
        spaces={spaces}
        tiers={tiers}
        crops={crops}
        recentPosts={posts}
        upcomingEvents={upcoming}
        members={stats.members}
        posts={stats.posts}
        signupHref={signupHref}
        loginHref={loginHref}
        lookAroundHref={lookAroundHref}
      />
    );
  }

  const accentStyle = communityAccentStyle(community.accent_color);

  return (
    <div className="min-h-screen bg-background" style={accentStyle} {...(accentStyle ? { "data-community-accent": "" } : {})}>
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8">
        <Link href={base} className="flex min-w-0 items-center gap-2.5">
          <Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={36} />
          <span
            className={`truncate text-sm font-semibold ${community.cover_image_url ? "text-white drop-shadow" : "text-foreground"}`}
          >
            {community.name}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LinkButton href={loginHref} variant="secondary" size="sm">
            Log in
          </LinkButton>
          <LinkButton href={signupHref} size="sm">
            Sign up
          </LinkButton>
        </div>
      </header>

      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-accent-soft">
        {community.cover_image_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote community upload, same as the feed cover */}
            <img
              src={community.cover_image_url}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover ${coverPositionClass(community.cover_position, community.cover_position_mobile)}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          </>
        )}
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-14 pt-28 md:px-8 md:pb-20">
          <div className={community.cover_image_url ? "text-white" : "text-foreground"}>
            {community.location_name && (
              <p className="mb-3 flex items-center gap-1.5 text-sm font-medium opacity-90">
                <MapPin className="h-4 w-4" />
                {community.location_name}
              </p>
            )}
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{community.name}</h1>
            {community.description && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">{community.description}</p>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={signupHref} size="lg">
              {joinLabel}
            </LinkButton>
            <LinkButton href={lookAroundHref} size="lg" variant="secondary">
              Take a look around
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
          {community.privacy !== "public" && (
            <p
              className={`mt-4 flex items-center gap-1.5 text-sm ${community.cover_image_url ? "text-white/85" : "text-muted-foreground"}`}
            >
              <Lock className="h-4 w-4" />
              Members-only community — an admin reviews each request.
            </p>
          )}
        </div>
      </section>

      {statItems.length > 0 && (
        <section className="border-b border-border bg-card">
          <dl className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-4 px-4 py-6 md:px-8">
            {statItems.map((item) => (
              <div key={item.label} className="text-center">
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-2xl font-semibold text-foreground">{item.value.toLocaleString("en-US")}</dd>
                <dd className="text-sm text-muted-foreground">{item.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-14 md:px-8">
        {featuredSpaces.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What&apos;s inside</h2>
            <p className="mt-1 text-muted-foreground">A few of the places you&apos;ll find in {community.name}.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSpaces.map((space) => {
                const meta = SPACE_TYPES[space.space_type];
                const Icon = meta?.icon;
                const cover = spaceCovers.get(space.id);
                return (
                  <Link
                    key={space.id}
                    href={`${base}/spaces/${space.slug}`}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
                  >
                    {cover ? (
                      <div className="relative h-44 overflow-hidden bg-accent-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element -- remote community upload */}
                        <img
                          src={cover}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        {Icon && (
                          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-accent shadow-sm backdrop-blur">
                            <Icon className="h-5 w-5" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-accent-soft text-accent">
                        {Icon && <Icon className="h-10 w-10" />}
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-semibold text-foreground group-hover:text-accent">{space.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {space.description || meta?.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Coming up</h2>
                <p className="mt-1 text-muted-foreground">What&apos;s happening next.</p>
              </div>
              <Link href={`${base}/events`} className="shrink-0 text-sm font-medium text-accent hover:underline">
                All events
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`${base}/events`}
                    className="block h-full overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
                  >
                    {event.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element -- remote community upload
                      <img src={event.image_url} alt="" className="h-32 w-full object-cover" />
                    )}
                    <div className="p-4">
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDateTime(event.start_time)}
                      </p>
                      <p className="mt-1.5 font-semibold text-foreground">{event.title}</p>
                      {(event.location_label || event.location) && (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {event.location_label || event.location}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl bg-accent-soft px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Be part of {community.name}</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Sign up to post, ask questions, join events and meet the people who make {community.name} what it is.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href={signupHref} size="lg">
              {joinLabel}
            </LinkButton>
            <LinkButton href={loginHref} size="lg" variant="secondary">
              I already have an account
            </LinkButton>
          </div>
        </section>
      </div>
    </div>
  );
}
