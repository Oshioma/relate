import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug } from "@/lib/data/community";
import { getTimelinePlaces } from "@/lib/data/timeline";
import { communityHasTimeline, timelinePath } from "@/lib/timeline/availability";
import { TimelineMap } from "./timeline-map";

// A MAP OF THIS TIMELINE IS MOSTLY NOT A MAP, AND THAT IS THE PAGE.
//
// Nine records out of sixty-nine carry coordinates, and they are all from one
// dataset. A page that drew only the pins would say this community's timeline
// is about the western Mediterranean. It is about floods on six continents,
// and almost every one of those records has a named place and no point.
//
// Most of that is deliberate. "Only where the place is genuinely known. A
// coordinate is an assertion" is the rule in seed-types, and it is right:
// there is no latitude for the Great Flood of Gun and Yu, none for Sky Woman,
// and the Sunda Shelf is a region the size of India.
//
// Some of it is not deliberate — nobody has looked up a coordinate for Ur or
// Göbekli Tepe, both of which have one. So the page separates the two rather
// than letting a reader assume either.

export const metadata: Metadata = {
  title: "Where these records are",
};

export default async function MapPage({ params }: { params: Promise<{ communitySlug: string }> }) {
  const { communitySlug } = await params;
  const supabase = await createClient();
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community || !communityHasTimeline(community)) notFound();

  const { pinned, named, placeless } = await getTimelinePlaces(supabase, community.id);
  const total = pinned.length + named.length + placeless.length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={timelinePath(community.slug)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the timeline
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Where these records are, and where they are not
      </h1>

      {/* THE WARNING FIRST, because a map is the most persuasive thing on this
          site and a reader who sees the pins first has already concluded
          something about coverage. */}
      <div className="mt-5 rounded-xl border-l-4 border-l-danger bg-danger/5 p-4">
        <p className="font-semibold text-foreground">
          {pinned.length} of {total} records can be put on a map. This is not a map of the timeline.
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A coordinate is an assertion. There is no latitude for a flood tradition, none for a creation account, and a
          drowned continental shelf is a region rather than a point — so most records here name a place and carry no
          coordinates, on purpose. Reading the pins as &ldquo;where this timeline is about&rdquo; would get it exactly
          backwards: the pinned records are the ones that happen to be battles.
        </p>
      </div>

      {pinned.length > 0 && (
        <div className="mt-6">
          <TimelineMap places={pinned} communitySlug={community.slug} />
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Named a place, no coordinates ({named.length})
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Two different reasons, and this page cannot tell them apart: a point would be an assertion (a tradition, a
            region, an ocean basin), or nobody has looked one up yet. Ur and Göbekli Tepe have coordinates in the
            world; they do not have them here.
          </p>
          <ul className="mt-3 space-y-2">
            {named.map((event) => (
              <li key={event.id} className="text-sm">
                <Link
                  href={`${timelinePath(community.slug)}/${event.slug}`}
                  className="font-medium text-foreground hover:text-accent hover:underline"
                >
                  {event.title}
                </Link>
                <span className="block text-muted-foreground">{event.location_name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            No place at all ({placeless.length})
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            And correctly so. The beginning of the universe is not somewhere, a named stretch of time is not somewhere,
            and a statement about how flood traditions were collected is not somewhere either.
          </p>
          <ul className="mt-3 space-y-1.5">
            {placeless.map((event) => (
              <li key={event.id} className="text-sm">
                <Link
                  href={`${timelinePath(community.slug)}/${event.slug}`}
                  className="text-foreground hover:text-accent hover:underline"
                >
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
