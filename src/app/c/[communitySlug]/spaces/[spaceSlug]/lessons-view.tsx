"use client";

import { useMemo, useState } from "react";
import { Search, NotebookText, Plus, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LessonComposer } from "./lesson-composer";
import { LessonCard } from "./lesson-card";
import { IdeasForToday } from "./ideas-for-today";
import { SavedLessonsPanel } from "./saved-lessons-panel";
import { LessonsHero } from "./lessons-hero";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  DISCOVERY_CATEGORIES,
  DURATION_FILTERS,
  SUBJECT_ICONS,
  lessonSearchText,
  matchesDuration,
  normaliseSubject,
  providerName,
  type DiscoveryCategory,
  type DurationFilterKey,
  type LessonRow,
  type Subject,
} from "@/lib/school/lesson-types";

// The teaching library.
//
// Two ways in, on purpose. A school subject answers "where does this sit on a
// timetable"; a discovery category answers "what would we be doing this
// afternoon", which is the question a family actually asks. The rail across the
// top is the second one, because it is the one used most; subject stays a
// filter alongside age, time and who wrote it.

// The breakpoints hold the CARD width roughly constant (~355px) rather than
// holding the column count constant — that is what stops long titles
// fragmenting. "Spot the Claim: Thinking Like a Detective About What You Watch
// Online" is 68 characters; at 355px it wraps to three comfortable lines, and
// at the 240px a third column would have given inside the old reading-width
// container it came out as six stacked fragments. So: one column on a phone,
// two from 768px, and a third only from 1280px, where the page measure is wide
// enough to add one without narrowing the others.
//
// The 21rem floor is the belt to that braces: whatever the breakpoint says, a
// column is never allowed below 336px, so a half-dragged window or a future
// wider sidebar drops to fewer columns instead of shredding the titles. At
// 1024px that is what stops three 309px columns happening.
// Auto-fill against a floor, and NOTHING overrides it. There used to be an
// `xl:repeat(3, ...)` on the end forcing three columns from 1280px, which
// quietly defeated the floor it sits next to: measured inside the real shell —
// with the 256px sidebar, which an earlier measurement of mine left out — a
// 1280px laptop gave three columns of 309px, under the 336px the floor
// promises and back into the width where long titles fragment.
//
// Now the floor decides. One column on a phone, two on a laptop, three once
// there is genuinely room for three, and never a column narrower than 21rem
// whatever the viewport or the side rail is doing.
const GRID =
  "grid gap-5 sm:gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(21rem,100%),1fr))]";

function DiscoveryPill({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={count === 0 && !active}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground shadow-sm"
          : count === 0
            // Nothing here under the CURRENT filters. Dimmed rather than
            // removed: a rail that reflows as you type in the search box is
            // harder to aim at than one with a greyed-out pill in it. A
            // category with nothing in the whole library never renders at all
            // — see libraryCounts below.
            ? "bg-accent-soft/30 text-muted-foreground/60"
            : "bg-accent-soft/60 text-foreground hover:bg-accent-soft"
      )}
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      {label}
      <span className={cn("text-xs tabular-nums", active ? "opacity-80" : "text-muted-foreground")}>
        {count}
      </span>
    </button>
  );
}

// One age band, as a circle you can hit rather than a line in a select.
//
// There are exactly three of them and they never change, which is what makes
// this worth the room: a dropdown is right for a list that grows (subjects,
// people who have written a lesson) and wrong for a fixed set of three that
// half the visitors to a homeschool library want to set first.
function AgeCircle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition-colors",
        active
          ? "bg-accent text-accent-foreground shadow-sm"
          : "bg-accent-soft/60 text-accent hover:bg-accent-soft"
      )}
    >
      {label}
    </button>
  );
}

// A quiet dropdown. There are several of these, and a row of small controls
// keeps them out of the way of the lessons — the filters this replaces were
// bigger on the page than the things they filtered.
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "cursor-pointer rounded-full border-0 px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        value
          ? "bg-accent-soft font-medium text-accent"
          : "bg-muted/60 text-muted-foreground hover:bg-muted"
      )}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// The standing line, used when a space has no description of its own. Says what
// the library is for rather than what the software does — "paste source
// material, get an age-appropriate lesson" describes the writer, and the writer
// is a button on this page, not the point of it.
const STANDING_BLURB =
  "Real learning for real life. Ideas, activities and inspiration from our community.";

export function LessonsView({
  lessons,
  spaceId,
  communitySlug,
  spaceSlug,
  spaceName,
  spaceDescription,
  canWrite,
  isMember,
  defaultAgeBand,
  writerConfigured,
}: {
  lessons: LessonRow[];
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  // This hero is the page's only masthead — the space page renders none above
  // it — so a renamed space keeps its name here, and an admin who writes their
  // own description still sees it.
  spaceName: string;
  spaceDescription: string | null;
  // Staff only — see the authoring note in the space_lessons migration.
  canWrite: boolean;
  // Signed-in members can save; a guest reading a public library has nowhere
  // to save to, and a disabled bookmark is worse than none.
  isMember: boolean;
  defaultAgeBand: string;
  // False when ANTHROPIC_API_KEY isn't set: the library still reads, but there
  // is no point offering a composer that cannot work.
  writerConfigured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [discovery, setDiscovery] = useState<DiscoveryCategory | null>(null);
  const [subject, setSubject] = useState("");
  const [band, setBand] = useState("");
  const [duration, setDuration] = useState("");
  const [provider, setProvider] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [composing, setComposing] = useState(false);

  // Precomputed once per lesson: the search box matches on everything in the
  // document, not just the title.
  const searchable = useMemo(
    () => new Map(lessons.map((lesson) => [lesson.id, lessonSearchText(lesson)])),
    [lessons]
  );

  // Everything except the discovery rail, so the rail can count what picking
  // each one would actually give you.
  const beforeDiscovery = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (band && lesson.age_band !== band) return false;
      if (subject && normaliseSubject(lesson.subject) !== subject) return false;
      if (provider && providerName(lesson) !== provider) return false;
      if (savedOnly && !lesson.saved) return false;
      if (!matchesDuration(lesson.duration_minutes, (duration || null) as DurationFilterKey | null))
        return false;
      if (!needle) return true;
      return (searchable.get(lesson.id) ?? "").includes(needle);
    });
  }, [lessons, query, band, subject, provider, savedOnly, duration, searchable]);

  const filtered = useMemo(
    () =>
      discovery
        ? beforeDiscovery.filter((l) => (l.discovery_categories ?? []).includes(discovery))
        : beforeDiscovery,
    [beforeDiscovery, discovery]
  );

  // What each category holds in the whole library, ignoring every filter. A
  // category with nothing here has never been used by this community and is
  // not a choice — a homeschool group that never cooks should not have Cook
  // sitting in its rail forever. Counted off the unfiltered list so the rail's
  // membership is stable while you filter; only the numbers on it move.
  const libraryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lesson of lessons) {
      for (const key of lesson.discovery_categories ?? []) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return counts;
  }, [lessons]);

  const discoveryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lesson of beforeDiscovery) {
      for (const key of lesson.discovery_categories ?? []) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return counts;
  }, [beforeDiscovery]);

  // Only subjects and people that actually have lessons, so a dropdown never
  // offers a filter that returns nothing.
  const subjectOptions = useMemo(() => {
    const counts = new Map<Subject, number>();
    for (const lesson of lessons) {
      const key = normaliseSubject(lesson.subject);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(
        (a, b) =>
          Object.keys(SUBJECT_ICONS).indexOf(a[0]) - Object.keys(SUBJECT_ICONS).indexOf(b[0])
      )
      .map(([name, count]) => ({ value: name, label: `${name} (${count})` }));
  }, [lessons]);

  const providerOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lesson of lessons) {
      const name = providerName(lesson);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ value: name, label: `${name} (${count})` }));
  }, [lessons]);

  const savedCount = useMemo(() => lessons.filter((l) => l.saved).length, [lessons]);

  const activeFilters =
    Boolean(query.trim()) ||
    Boolean(discovery) ||
    Boolean(subject) ||
    Boolean(band) ||
    Boolean(duration) ||
    Boolean(provider) ||
    savedOnly;

  function clearAll() {
    setQuery("");
    setDiscovery(null);
    setSubject("");
    setBand("");
    setDuration("");
    setProvider("");
    setSavedOnly(false);
  }

  return (
    // Tighter than the page's usual rhythm on purpose: hero, three ideas, the
    // rail and the search box all need to be reachable without scrolling on a
    // laptop, and every extra 24px between them pushes the library itself off
    // the screen.
    <div className="space-y-5">
      {/* The library is the front door of a homeschool community, so it says
          what it is for rather than counting rows at someone — and shows it,
          with the community's own lesson pictures. */}
      <LessonsHero
        lessons={lessons}
        title={spaceName}
        blurb={spaceDescription?.trim() || STANDING_BLURB}
        action={
          canWrite && writerConfigured && !composing ? (
            <Button onClick={() => setComposing(true)}>
              <Plus className="h-4 w-4" />
              Write a lesson
            </Button>
          ) : undefined
        }
      />

      {composing && (
        <LessonComposer
          spaceId={spaceId}
          defaultAgeBand={defaultAgeBand}
          onClose={() => setComposing(false)}
        />
      )}

      {/* Below 1700px this is an ordinary stack: ideas, then the controls, then
          the library — exactly the page that was there before. From 1700px the
          shell has 400px+ of empty margin doing nothing, so it becomes two
          columns and the ideas move into a sticky rail beside the library
          rather than above it.

          1700 rather than Tailwind's 1536: a rail of 304px plus its gap has to
          come out of the content width, and three lesson columns need 1056px
          of it. Below 1700 there is not enough for both, and the library keeps
          the room — the third column is worth more than an earlier rail. */}
      <div className="rail:grid rail:grid-cols-[minmax(0,1fr)_19rem] rail:items-start rail:gap-8">
        {lessons.length > 0 && (
          <aside className="space-y-5 rail:sticky rail:top-6 rail:order-2">
            <IdeasForToday
              lessons={lessons}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              preferredAgeBand={defaultAgeBand}
            />
            {/* Only in the rail. Below 1700 the Saved chip in the filter row
                already does this job, and a second Saved thing above the
                filters would be the same list twice. */}
            {isMember && (
              <div className="hidden rail:block">
                <SavedLessonsPanel
                  lessons={lessons}
                  communitySlug={communitySlug}
                  spaceSlug={spaceSlug}
                />
              </div>
            )}
          </aside>
        )}

        <div className="mt-5 space-y-5 rail:order-1 rail:mt-0">
      {lessons.length > 0 && (
        <div className="space-y-2.5">
          {/* The chips and the ages share one line. On a desktop the chips
              never fill the row — five of them leave half the width empty —
              and the ages were taking a whole row of their own underneath to
              say three words. Now they sit at the far end of the same line and
              that space does some work.

              flex-wrap rather than a breakpoint: on a narrow screen the chips
              claim the full width and the ages drop below them on their own,
              which is the same arrangement, just folded. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Scrolls sideways on a phone rather than wrapping into a block
                of buttons taller than the first lesson. */}
            {/* min-w-[15rem] is what makes the wrap happen. With min-w-0 the
                chips would shrink to nothing rather than push the ages onto
                their own line, and a phone got a 130px scroll window next to
                three circles. Below about 750px the ages fold underneath. */}
            <div className="-mx-1 flex min-w-[15rem] flex-1 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <DiscoveryPill
              icon="✨"
              label="All"
              count={beforeDiscovery.length}
              active={discovery === null}
              onClick={() => setDiscovery(null)}
            />
            {DISCOVERY_CATEGORIES.filter(
              (category) => (libraryCounts.get(category.key) ?? 0) > 0
            ).map((category) => (
              <DiscoveryPill
                key={category.key}
                icon={category.icon}
                label={category.label}
                count={discoveryCounts.get(category.key) ?? 0}
                active={discovery === category.key}
                onClick={() => setDiscovery(discovery === category.key ? null : category.key)}
              />
            ))}
            </div>

            {/* The word carries the meaning, so the circles only need the
                numbers. */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Ages
              </span>
              {AGE_BANDS.map((entry) => (
                <AgeCircle
                  key={entry.key}
                  // "Ages 5–7" is the label; the row says the word, the button
                  // says the numbers.
                  label={entry.label.replace(/^Ages\s*/, "")}
                  active={band === entry.key}
                  onClick={() => setBand(band === entry.key ? "" : entry.key)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[12rem] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lessons, topics or keywords…"
                className="w-full rounded-full bg-muted/60 py-2.5 pl-10 pr-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <FilterSelect
              label="Subject"
              value={subject}
              onChange={setSubject}
              options={subjectOptions}
            />
            <FilterSelect
              label="Time"
              value={duration}
              onChange={setDuration}
              options={DURATION_FILTERS.map((d) => ({ value: d.key, label: d.label }))}
            />
            {providerOptions.length > 1 && (
              <FilterSelect
                label="Provider"
                value={provider}
                onChange={setProvider}
                options={providerOptions}
              />
            )}

            {isMember && savedCount > 0 && (
              <button
                type="button"
                onClick={() => setSavedOnly(!savedOnly)}
                aria-pressed={savedOnly}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors",
                  savedOnly
                    ? "bg-accent-soft font-medium text-accent"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                <Bookmark className={cn("h-3.5 w-3.5", savedOnly && "fill-accent")} />
                Saved
                <span className="text-xs">{savedCount}</span>
              </button>
            )}

            {activeFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <EmptyState
          icon={<NotebookText className="h-6 w-6" />}
          title="No lessons yet"
          description={
            canWrite
              ? writerConfigured
                ? "Paste a chapter, an article or your own notes, and get back a lesson written for the right age — ready to teach or print."
                : "The lesson writer isn't configured on this deployment yet."
              : "Lessons will appear here as they're written."
          }
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-muted/40 p-12 text-center">
          <p className="text-sm text-muted-foreground">Nothing matches that just now.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 text-sm font-medium text-accent hover:underline"
          >
            Clear the filters
          </button>
        </div>
      ) : (
        <div id="lessons-library" className="scroll-mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length === lessons.length
              ? `${lessons.length} lesson${lessons.length === 1 ? "" : "s"} in this library.`
              : `${filtered.length} of ${lessons.length} lessons.`}
          </p>
          <div className={GRID}>
            {filtered.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                communitySlug={communitySlug}
                spaceSlug={spaceSlug}
                canSave={isMember}
              />
            ))}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
