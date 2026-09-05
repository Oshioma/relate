"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  lessonThumbnail,
  primaryCategory,
  type LessonImage,
  type LessonRow,
} from "@/lib/school/lesson-types";

// The top of the library, and the only place on the page that gets to say what
// this community is like.
//
// WHERE THE PICTURES COME FROM
// They are the community's OWN lesson pictures — a solar oven in a garden, a
// rockpool, seedlings — already loaded for the cards below. No stock service,
// no new request, no generated asset, nothing invented: every tile is a thing
// somebody here actually wrote a lesson about, and the library a few inches
// down contains it. That is the whole reason the hero is allowed to be
// pictorial at all.
//
// WHICH PICTURES, THOUGH
// Not any three. A hero of three worksheet diagrams says this is a library of
// documents; the point of Squidge Over Skool is that learning happens in a
// kitchen and a rockpool. So the candidates are SCORED — see heroScore — on
// what the lesson actually involves and on what the picture itself is of, and
// the highest-scoring lifestyle image leads.
//
// A library without enough pictures gets the plain panel instead. An empty
// grey grid promising imagery is worse than a confident block of colour.

// The dominant image plus two supporting ones.
const TILES = 3;

// --- Choosing the pictures ---------------------------------------------------

// What a lesson is DOING, ranked by how much it looks like a life being lived.
// Growing, cooking, exploring, making and moving happen somewhere with light in
// it; reading and writing are the ones whose pictures tend to be a desk.
//
// This is not a judgement about which lessons matter. It is a judgement about
// which photographs carry a hero.
const CATEGORY_WEIGHT: Record<string, number> = {
  grow: 5,
  cook: 5,
  explore: 5,
  make: 4,
  move: 4,
  help: 3,
  read: 1,
  write: 0,
};

// Words in a picture's own title — the description that came with it from the
// image source — that mean a person is in it, or that it was taken outdoors.
// A photograph of hands doing something beats a photograph of a diagram, and
// this is the only evidence available about what a picture actually shows.
const LIFESTYLE_WORDS =
  /\b(child|children|kid|kids|boy|girl|family|mother|father|parent|people|person|woman|man|hand|hands|together|playing|cooking|baking|planting|gardening|reading|walking|outdoor|outdoors|forest|woods|beach|garden|kitchen|field|meadow|river|park|sunlight|nature)\b/i;

// Words that mean the picture is a document, a diagram or an abstract texture.
// Fine as a supporting tile; wrong as the thing that introduces the community.
const FLAT_WORDS =
  /\b(diagram|chart|graph|worksheet|text|document|paper|whiteboard|blackboard|screen|abstract|pattern|texture|background|illustration|icon|symbol|equation|formula)\b/i;

export function heroScore(lesson: LessonRow, image: LessonImage): number {
  let score = 0;

  // What the lesson involves. The primary category leads, so a Cook lesson
  // that also mentions writing is scored as cooking.
  const [primary, ...rest] = lesson.discovery_categories ?? [];
  if (primary) score += (CATEGORY_WEIGHT[primary] ?? 0) * 2;
  for (const key of rest) score += CATEGORY_WEIGHT[key] ?? 0;

  // What the picture is of.
  const title = image.title ?? "";
  if (LIFESTYLE_WORDS.test(title)) score += 6;
  if (FLAT_WORDS.test(title)) score -= 6;

  // A lesson with a real cover was given a picture on purpose; a first-section
  // image is the one that happened to be found for a paragraph.
  if (lesson.lesson?.cover) score += 2;

  return score;
}

// Stable per day. Rotating on render would reshuffle the hero on every
// keystroke in the search box; rotating on nothing would make it wallpaper.
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

export type HeroTile = { id: string; url: string; score: number };

export function pickHeroImages(lessons: LessonRow[], now: Date, count = TILES): HeroTile[] {
  const seed = dayNumber(now) * 7919; // A different rotation from Ideas for today.

  const candidates = lessons
    .map((lesson) => {
      const image = lessonThumbnail(lesson.lesson);
      if (!image) return null;
      return {
        id: lesson.id,
        url: image.thumbUrl,
        category: primaryCategory(lesson),
        score: heroScore(lesson, image),
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    // Score first, then the day's shuffle as the tie-break — so the hero
    // rotates among the GOOD pictures rather than among all of them.
    .sort((a, b) => b.score - a.score || seededRank(a.id, seed) - seededRank(b.id, seed));

  const picked: HeroTile[] = [];
  const usedCategories = new Set<string>();
  const usedUrls = new Set<string>();

  // Two passes: the first insists on a different kind of activity per tile, so
  // the three pictures between them say the library is about several things.
  // The second fills up when a small library cannot manage that.
  for (const pass of [1, 2]) {
    for (const c of candidates) {
      if (picked.length >= count) break;
      if (usedUrls.has(c.url)) continue;
      if (pass === 1 && c.category && usedCategories.has(c.category)) continue;
      picked.push({ id: c.id, url: c.url, score: c.score });
      usedUrls.add(c.url);
      if (c.category) usedCategories.add(c.category);
    }
  }

  return picked;
}

// --- The hero ----------------------------------------------------------------

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

  const words = (
    <div className="relative z-10 flex flex-col justify-center bg-accent-soft px-6 py-4 sm:px-7 sm:py-5 lg:px-9">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {action}
      </div>
      {/* No max-w cap: the sentence wants 481px and the panel offers more than
          that, so capping it cost a whole line of a very short hero. */}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
      {/* An editorial annotation, not a slogan — the size of a caption, in the
          accent at half strength, and the last thing the eye reaches. Italic
          rather than a script face: the design system has one family, and
          importing a handwriting font for six words would be a costume. */}
      <p className="mt-2 text-[11px] italic tracking-wide text-accent/70">
        Wonder is a subject too.
      </p>
    </div>
  );

  // Three is the composition. With fewer the panel keeps the full width rather
  // than showing a collage with a hole in it.
  if (images.length < TILES) {
    return <div className="overflow-hidden rounded-2xl">{words}</div>;
  }

  const [dominant, ...supporting] = images;

  return (
    <div className="grid overflow-hidden rounded-2xl md:grid-cols-[1.05fr_1fr]">
      {words}

      {/* Decorative: every one of these is a lesson card a few inches further
          down the page, with its title attached. Announcing three unlabelled
          pictures to a screen reader adds nothing but noise. */}
      <div aria-hidden className="relative">
        {/* One dominant picture with two supporting it, not three equal
            rectangles — equal weight is a contact sheet, and a contact sheet is
            what made this read as a gallery bolted to a heading. */}
        <div className="grid h-28 grid-cols-[1.7fr_1fr] gap-1 sm:h-32 md:h-full md:min-h-[7.5rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dominant.url}
            alt=""
            loading="lazy"
            className="h-full w-full bg-muted object-cover"
          />
          {/* On a phone the second supporting tile drops out entirely: three
              pictures across a 358px band is a strip of postage stamps, and
              the brief for a small screen is one strong image with one
              supporting it, not a shrunken desktop collage. */}
          <div className="grid grid-rows-1 gap-1 sm:grid-rows-2">
            {supporting.map((image, index) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={image.id}
                src={image.url}
                alt=""
                loading="lazy"
                className={cn(
                  "h-full w-full bg-muted object-cover",
                  index === 1 && "hidden sm:block"
                )}
              />
            ))}
          </div>
        </div>

        {/* The seam. Without this the sage panel stops dead against a
            photograph and the two halves read as two components; the wash
            carries one into the other so the hero is a single object. Hidden
            on a phone, where the pictures sit under the words rather than
            beside them. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-accent-soft to-transparent md:block" />
      </div>
    </div>
  );
}
