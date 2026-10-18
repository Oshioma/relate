import Link from "next/link";
import { Search } from "lucide-react";
import { loadGuidedJourneyPage } from "@/lib/data/guided-journey-page";
import { getPublishedStories } from "@/lib/data/guided-journey";
import { JourneyShell } from "@/components/guided-journey/journey-shell";
import { StoryCard } from "@/components/guided-journey/story-card";
import { Input } from "@/components/ui/input";

const uniq = (values: (string | null)[]) =>
  Array.from(new Map(values.filter((v): v is string => Boolean(v && v.trim())).map((v) => [v.trim().toLowerCase(), v.trim()])).values()).sort((a, b) =>
    a.localeCompare(b)
  );

// The community gallery: real finished journeys their growers chose to share,
// filterable by crop, climate and method and searchable as a knowledge base.
export default async function StoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<{ subject?: string; climate?: string; method?: string; q?: string }>;
}) {
  const ctx = await loadGuidedJourneyPage(params);
  const filters = await searchParams;
  const { config } = ctx;
  const all = await getPublishedStories(ctx.supabase, ctx.space.id, 300);

  const subjects = uniq(all.map((s) => s.subject));
  const climates = uniq(all.map((s) => s.climate));
  const q = (filters.q ?? "").trim().toLowerCase();
  const eq = (a: string | null, b?: string) => !b || (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
  const stories = all.filter(
    (s) =>
      eq(s.subject, filters.subject) &&
      eq(s.climate, filters.climate) &&
      (!filters.method || s.method === filters.method) &&
      (!q ||
        [s.title, s.subject, s.region, s.climate, s.conditions, s.problems, s.solutions, s.lessons, s.results].some((f) => (f ?? "").toLowerCase().includes(q)))
  );
  const anyFilter = Boolean(filters.subject || filters.climate || filters.method || q);
  const select = "w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <JourneyShell ctx={ctx} active="stories" wide title={config.gallery.title} intro={config.gallery.subtitle}>
      <form method="get" className="mb-8 grid gap-3 rounded-3xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Search stories</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={filters.q ?? ""} placeholder="Search problems, tips, places…" className="rounded-full pl-10" />
        </label>
        <select name="subject" defaultValue={filters.subject ?? ""} aria-label={`Filter by ${config.terms.subject}`} className={select}>
          <option value="">Any {config.terms.subject}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="climate" defaultValue={filters.climate ?? ""} aria-label="Filter by climate" className={select}>
          <option value="">Any climate</option>
          {climates.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="method" defaultValue={filters.method ?? ""} aria-label={`Filter by ${config.gallery.methodLabel}`} className={select}>
          <option value="">Any {config.gallery.methodLabel.toLowerCase()}</option>
          {config.gallery.methodOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
          Filter
        </button>
      </form>

      {stories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-semibold text-foreground">{anyFilter ? "No stories match those filters" : "No stories shared yet"}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {anyFilter ? (
              <Link href={`${ctx.basePath}/stories`} className="font-medium text-accent hover:underline">
                Clear filters
              </Link>
            ) : (
              `When ${config.terms.beginners} finish a ${config.terms.journey} and choose to publish it, it appears here for everyone to learn from.`
            )}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} href={`${ctx.basePath}/stories/${s.id}`} config={config} />
            ))}
          </div>
        </>
      )}
    </JourneyShell>
  );
}
