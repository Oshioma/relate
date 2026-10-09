import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Lock, MapPin, MessageSquare, Store, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getCommunityStats } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityEvents, getEventRsvpCounts, splitUpcomingPast } from "@/lib/data/events";
import {
  getCommunityBusinessCategoryLabelOverrides,
  getCommunityBusinessCustomCategories,
  getCommunityFeaturedBusinessCategories,
  getFeaturedCategoryPreviews,
} from "@/lib/data/businesses";
import { businessCategoryPluralLabel } from "@/lib/business-categories";
import { getCommunityFeatures } from "@/lib/data/features";
import { spaceImage } from "@/lib/space-images";
import { communityAccentStyle } from "@/lib/accent-color";
import { coverPositionClass } from "@/lib/cover-position";
import { FeedHero, HeroLink, type HeroStat } from "@/app/c/[communitySlug]/feed-hero";
import { SpaceCards } from "@/app/c/[communitySlug]/space-cards";
import { UpcomingEventsCard } from "@/app/c/[communitySlug]/upcoming-events-card";
import type { CategorySlide } from "@/app/c/[communitySlug]/category-carousel-card";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
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

  const [spaces, events, features, stats] = await Promise.all([
    getCommunitySpaces(supabase, community.id),
    community.events_public ? getCommunityEvents(supabase, community.id) : Promise.resolve([]),
    getCommunityFeatures(supabase, community.id),
    getCommunityStats(supabase, community.id),
  ]);

  const base = `/c/${community.slug}`;
  const signupHref = `/signup?next=${encodeURIComponent(base)}`;
  const loginHref = `/login?next=${encodeURIComponent(base)}`;
  const guestsMayRead = community.is_public || (community.feed_public && community.privacy !== "invite_only");
  const lookAroundHref = guestsMayRead ? `${base}?view=feed` : `${base}/spaces`;
  const joinLabel = community.privacy === "public" ? `Join ${community.name}` : "Request to join";

  const upcoming = features.events ? splitUpcomingPast(events).upcoming.slice(0, 4) : [];
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

  // The rest of this page is built from the same parts as the signed-in feed —
  // the hero with the headline and big name, the photo space cards (with the
  // directory slideshow), the upcoming-events card — so a visitor sees what
  // members see, with Join / Log in in place of the composer.
  const cardSpaces = spaces.filter((space) => space.show_as_card);
  const [customCategories, labelOverrides, featuredCategories, eventGoing] = await Promise.all([
    getCommunityBusinessCustomCategories(supabase, community.id),
    getCommunityBusinessCategoryLabelOverrides(supabase, community.id),
    getCommunityFeaturedBusinessCategories(supabase, community.id),
    getEventRsvpCounts(supabase, upcoming.filter((e) => e.capacity !== null).map((e) => e.id)),
  ]);
  const categoryPreviews = await getFeaturedCategoryPreviews(
    supabase,
    featuredCategories.filter((f) => cardSpaces.some((sp) => sp.id === f.space_id))
  );
  const categoryCarousels: Record<string, CategorySlide[]> = Object.fromEntries(
    cardSpaces.map((space) => {
      const overrides = labelOverrides.filter((o) => o.space_id === space.id);
      const slides = featuredCategories
        .filter((f) => f.space_id === space.id)
        .map((f): CategorySlide => {
          const label = businessCategoryPluralLabel(f.category, customCategories, overrides);
          const preview = categoryPreviews.get(`${space.id}:${f.category}`);
          const count = preview?.count ?? 0;
          return {
            href: `${base}/spaces/${space.slug}?category=${f.category}`,
            title: label,
            subtitle:
              count > 0
                ? `${count} ${count === 1 ? "listing" : "listings"} in ${space.name}`
                : `Browse ${label.toLowerCase()} in ${space.name}`,
            imageUrl: preview?.imageUrl ?? spaceImage(space),
            imagePosition: preview?.imagePosition ?? null,
          };
        });
      return [space.id, slides];
    })
  );

  // Same opt-in as the feed: counts only once the owner has turned stats on.
  const heroStats: HeroStat[] = community.show_stats
    ? [
        { icon: UsersRound, label: "Members", value: stats.members },
        { icon: MessageSquare, label: "Posts", value: stats.posts },
        { icon: CalendarDays, label: "Events", value: stats.events },
        { icon: Store, label: "Businesses", value: stats.businesses },
      ].filter((item) => item.value > 0)
    : [];

  const onPhoto = Boolean(community.cover_image_url);
  const accentStyle = communityAccentStyle(community.accent_color);

  return (
    <div className="min-h-screen bg-background" style={accentStyle} {...(accentStyle ? { "data-community-accent": "" } : {})}>
      {/* The signed-in header's twin: logo and name on the left, the way in on
          the right, in the same white bar above the cover. */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:px-6">
        <Link href={base} className="flex min-w-0 items-center gap-2.5">
          <Avatar
            src={community.logo_url}
            name={community.name}
            initials={community.logo_initials}
            size={36}
            className="ring-1 ring-accent"
          />
          <span className="truncate text-sm font-semibold text-foreground">{community.name}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LinkButton href={loginHref} variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href={signupHref} size="sm">
            Sign up
          </LinkButton>
        </div>
      </header>

      <FeedHero
        headline={community.tagline || community.name}
        name={community.tagline ? community.name : null}
        description={community.description}
        cover={
          community.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote community upload, same as the feed cover
            <img
              src={community.cover_image_url}
              alt=""
              className={`absolute inset-0 -z-20 h-full w-full object-cover ${coverPositionClass(community.cover_position, community.cover_position_mobile)}`}
            />
          ) : null
        }
        backgroundVideo={
          community.landing_background_video_url
            ? { src: community.landing_background_video_url, poster: community.cover_image_url }
            : null
        }
        stats={heroStats}
        actions={
          <>
            <HeroLink href={signupHref} onPhoto={onPhoto}>
              {joinLabel}
            </HeroLink>
            <HeroLink href={lookAroundHref} variant="glass" onPhoto={onPhoto}>
              Take a look around
              <ArrowRight className="h-4 w-4" />
            </HeroLink>
            {community.privacy !== "public" && (
              <p className={`flex w-full items-center gap-1.5 text-sm ${onPhoto ? "text-white/85" : "text-muted-foreground"}`}>
                <Lock className="h-4 w-4" />
                Members-only community — an admin reviews each request.
              </p>
            )}
          </>
        }
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        <SpaceCards spaces={cardSpaces} base={base} carousels={categoryCarousels} showOnMobile />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="flex flex-col justify-center gap-5 bg-accent-soft p-6 sm:p-8">
            <div>
              {community.location_name && (
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-accent">
                  <MapPin className="h-4 w-4" />
                  {community.location_name}
                </p>
              )}
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Be part of {community.name}
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Sign up to post, ask questions, join events and meet the people who make {community.name} what it is.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton href={signupHref} size="lg">
                {joinLabel}
              </LinkButton>
              <LinkButton href={loginHref} size="lg" variant="secondary">
                I already have an account
              </LinkButton>
            </div>
          </Card>

          {features.events && community.events_public && (
            <UpcomingEventsCard events={upcoming} href={`${base}/events`} going={eventGoing} />
          )}
        </div>
      </main>
    </div>
  );
}
