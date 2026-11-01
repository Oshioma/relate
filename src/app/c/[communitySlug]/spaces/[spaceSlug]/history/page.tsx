import type { Metadata } from "next";
import Link from "@/components/ui/link";
import { loadTrueCalendarSpace } from "@/lib/data/true-calendar-space";
import { getCultureCatalogue } from "@/lib/data/true-calendar";
import { TrueCalendarFrame } from "@/components/true-calendar/true-calendar-frame";
import { filterCatalogue, PERIOD_FILTERS, type CatalogueFilters } from "@/lib/true-calendar/research/catalogue";
import { CONTINENTS, RESEARCH_STATUSES, RESEARCH_STATUS_LABELS, SYSTEM_KINDS, SYSTEM_KIND_LABELS } from "@/lib/true-calendar/research/model";
import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/true-calendar/history-bits";

export const metadata: Metadata = { title: "History · The True Calendar" };

// History: "why?" — every tradition in the catalogue, searchable and
// filterable. A tradition with no checked research yet is still listed (it is
// a research target), and says so.

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function TrueCalendarHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string; spaceSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { communitySlug, spaceSlug } = await params;
  const sp = await searchParams;
  const { supabase, space, spacePath, researcherRole } = await loadTrueCalendarSpace(communitySlug, spaceSlug);
  const { cultures, systems } = await getCultureCatalogue(supabase);

  const filters: CatalogueFilters = { q: one(sp.q), continent: one(sp.continent), kind: one(sp.kind), status: one(sp.status), period: one(sp.period) };
  const shown = filterCatalogue(cultures, systems, filters);
  const kindsByCulture = new Map<string, Set<string>>();
  for (const s of systems) kindsByCulture.set(s.culture_key, (kindsByCulture.get(s.culture_key) ?? new Set()).add(s.kind));
  const researched = cultures.filter((c) => c.research_status !== "not_started").length;
  const filtered = Object.values(filters).some(Boolean);

  const select = "h-10 rounded-md border border-[var(--tc-line)] bg-[var(--tc-panel)] px-2 text-base text-[var(--tc-ink)]";
  return (
    <TrueCalendarFrame title={space.name} basePath={spacePath} active="history" showResearch={Boolean(researcherRole)}>
      <div className="space-y-5">
        <div>
          <h2 className="font-serif text-3xl">How civilisations kept time</h2>
          <p className="mt-1 max-w-3xl text-base text-[var(--tc-muted)]">
            {cultures.length} traditions, {researched} with research under way. Each one shows only what its sources support, labelled by how we know it. A tradition still marked &ldquo;Research not started&rdquo; is on our list to research, not a gap we have filled in.
          </p>
        </div>

        <form method="get" className="grid gap-2 rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
          <label className="sr-only" htmlFor="tc-q">Search</label>
          <input id="tc-q" name="q" type="search" defaultValue={filters.q} placeholder="Search a culture, place or calendar" className={cn(select, "px-3")} />
          <label className="sr-only" htmlFor="tc-continent">Region</label>
          <select id="tc-continent" name="continent" defaultValue={filters.continent} className={select}>
            <option value="">Every region</option>
            {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="sr-only" htmlFor="tc-kind">Calendar or cycle type</label>
          <select id="tc-kind" name="kind" defaultValue={filters.kind} className={select}>
            <option value="">Every calendar type</option>
            {SYSTEM_KINDS.map((k) => <option key={k} value={k}>{SYSTEM_KIND_LABELS[k]}</option>)}
          </select>
          <label className="sr-only" htmlFor="tc-period">Period</label>
          <select id="tc-period" name="period" defaultValue={filters.period} className={select}>
            <option value="">Any period</option>
            {PERIOD_FILTERS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="tc-status">Research completeness</label>
          <select id="tc-status" name="status" defaultValue={filters.status} className={select}>
            <option value="">Any research stage</option>
            {RESEARCH_STATUSES.map((s) => <option key={s} value={s}>{RESEARCH_STATUS_LABELS[s]}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="h-10 rounded-md bg-[var(--tc-selected)] px-4 text-base font-medium text-[var(--tc-selected-ink)]">Show</button>
            {filtered ? (
              <Link href={`${spacePath}/history`} className="inline-flex h-10 items-center rounded-md border border-[var(--tc-line)] px-3 text-base hover:bg-[var(--tc-hover)]">Clear</Link>
            ) : null}
          </div>
        </form>

        {filtered ? <p className="text-base text-[var(--tc-muted)]">{shown.length} of {cultures.length} traditions</p> : null}

        {shown.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--tc-line)] px-4 py-6 text-base text-[var(--tc-muted)]">
            {cultures.length === 0 ? "The catalogue of traditions hasn't been installed yet." : "No tradition matches those filters."}
          </p>
        ) : (
          CONTINENTS.filter((c) => shown.some((x) => x.continent === c)).map((continent) => (
            <section key={continent} aria-labelledby={`tc-h-${continent}`}>
              <h3 id={`tc-h-${continent}`} className="mb-2 font-serif text-2xl">{continent}</h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {shown.filter((c) => c.continent === continent).map((c) => (
                  <li key={c.key}>
                    <Link
                      href={`${spacePath}/history/${c.key}`}
                      className="flex h-full flex-col gap-1 rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-3 hover:bg-[var(--tc-hover)]"
                    >
                      <span className="font-serif text-xl leading-tight">{c.name}</span>
                      {c.region ? <span className="text-base text-[var(--tc-muted)]">{c.region}</span> : null}
                      <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        <StatusPill status={c.research_status} />
                        {[...(kindsByCulture.get(c.key) ?? [])].map((k) => (
                          <span key={k} className="rounded-full border border-[var(--tc-line)] px-2 py-0.5 text-xs text-[var(--tc-muted)]">
                            {SYSTEM_KIND_LABELS[k as keyof typeof SYSTEM_KIND_LABELS] ?? k}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </TrueCalendarFrame>
  );
}
