"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { lessonThumbnail, type LessonRow } from "@/lib/school/lesson-types";

// The top of the library, and the only place on the page that gets to say what
// this community is like.
//
// The pictures are the community's OWN lesson pictures — a solar oven in a
// garden, a rockpool, seedlings — not stock photographs of somebody else's
// children. Two reasons. They are true: every tile is a thing somebody here
// actually wrote a lesson about, and clicking into the library finds it. And
// they cost nothing: these images are already loaded for the cards below, so
// the hero adds no request, no API call and no new content source.
//
// A library with no pictures yet gets the plain panel instead. An empty grey
// grid promising imagery is worse than a confident block of colour.

// Three: one tall picture beside two stacked ones. A 2x2 grid of equal squares
// reads as a contact sheet, and the tall-plus-two shape fills the panel exactly
// with no holes to leave when the library is small.
const MAX_TILES = 3;

// Stable per day, so the hero isn't a slideshow that reshuffles on every
// keystroke in the search box, and isn't the same four pictures forever.
function seededRank(id: string, daySeed: number): number {
  let hash = daySeed;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function dayNumber(now: Date): number {
  return Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86_400_000
  );
}

export function pickHeroImages(lessons: LessonRow[], now: Date, count = MAX_TILES) {
  const seed = dayNumber(now) * 7919; // A different rotation from Ideas for today.
  const ordered = [...lessons].sort((a, b) => seededRank(a.id, seed) - seededRank(b.id, seed));

  const picked: { id: string; url: string }[] = [];
  const usedCategories = new Set<string>();
  const usedUrls = new Set<string>();

  // Prefer three different kinds of afternoon. Three pictures of the same
  // seedlings say the library is about one thing.
  for (const pass of [1, 2]) {
    for (const lesson of ordered) {
      if (picked.length >= count) break;
      const image = lessonThumbnail(lesson.lesson);
      if (!image) continue;
      if (usedUrls.has(image.thumbUrl)) continue;
      const category = lesson.discovery_categories?.[0] ?? null;
      if (pass === 1 && category && usedCategories.has(category)) continue;
      picked.push({ id: lesson.id, url: image.thumbUrl });
      usedUrls.add(image.thumbUrl);
      if (category) usedCategories.add(category);
    }
  }

  return picked;
}

export function LessonsHero({
  lessons,
  title,
  blurb,
  action,
}: {
  lessons: LessonRow[];
  title: string;
  blurb: string;
  // The "Write a lesson" button, when the viewer is staff. Passed in rather
  // than rebuilt here so the composer stays the view's business.
  action?: React.ReactNode;
}) {
  const images = useMemo(() => pickHeroImages(lessons, new Date()), [lessons]);

  // Deliberately compact. The hero's job is to set the tone in the first
  // second, not to hold the top third of the viewport: the next thing down is
  // three real suggestions, and those are what somebody came for.
  //
  // The button sits on the title's line rather than below the sentence, which
  // is where a third of the height went — a stacked title, sentence and button
  // is three rows of a panel that only ever had one thing to say. It wraps
  // under the title on a narrow screen, where there is no room beside it.
  const words = (
    <div className="flex flex-col justify-center bg-accent-soft px-6 py-6 sm:px-7 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
          {title}
        </h1>
        {action}
      </div>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {blurb}
      </p>
    </div>
  );

  // Fewer than three and the mosaic reads as a mistake rather than a montage,
  // so the panel keeps its full width until the library has grown into it.
  if (images.length < 3) {
    return <div className="overflow-hidden rounded-2xl">{words}</div>;
  }

  return (
    <div className="grid overflow-hidden rounded-2xl md:grid-cols-2">
      {words}

      {/* Decorative: every one of these is a lesson card a few inches further
          down the page, with its title attached. Announcing four unlabelled
          pictures to a screen reader adds nothing but noise. */}
      <div
        aria-hidden
        // The floor sits just under what the words need, so the pictures never
        // make the hero taller than its own content does.
        className="grid h-28 grid-cols-2 grid-rows-2 gap-1 sm:h-36 md:h-auto md:min-h-[8.5rem]"
      >
        {images.slice(0, MAX_TILES).map((image, index) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={image.id}
            src={image.url}
            alt=""
            loading="lazy"
            className={cn(
              "h-full w-full bg-muted object-cover",
              // The first picture takes the whole left half; the other two
              // stack beside it.
              index === 0 && "row-span-2"
            )}
          />
        ))}
      </div>
    </div>
  );
}
