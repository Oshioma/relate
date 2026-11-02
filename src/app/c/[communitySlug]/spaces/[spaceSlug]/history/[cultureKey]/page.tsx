import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/ui/link";
import { createClient } from "@/lib/supabase/server";
import { loadTrueCalendarSpace } from "@/lib/data/true-calendar-space";
import { getCultureHistory } from "@/lib/data/true-calendar";
import { TrueCalendarFrame } from "@/components/true-calendar/true-calendar-frame";
import { StatusPill, Claim, SourceList, numberSources } from "@/components/true-calendar/history-bits";
import { formatIsoDate, formatLongDate, formatYear, parseIsoDate, todayIn } from "@/lib/true-calendar/dates";
import { isAnchored, nextDatesForPosition } from "@/lib/true-calendar/research/daily";
import { SYSTEM_KIND_LABELS } from "@/lib/true-calendar/research/model";

// One tradition's History page: "why?". Sections follow the brief: Overview,
// Understanding of time, Cycles, Beliefs and significance, Practical
// knowledge (historical practice and modern adaptation kept apart), Sources.
// Every claim carries its evidence label and numbered citations.

export async function generateMetadata({ params }: { params: Promise<{ cultureKey: string }> }): Promise<Metadata> {
  const { cultureKey } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("calendar_cultures").select("name").eq("key", cultureKey).eq("review_status", "published").maybeSingle();
  return { title: data ? `${data.name} · History · The True Calendar` : "History · The True Calendar" };
}

const ACTIVITY_LABELS: Record<string, string> = {
  planting: "Planting",
  harvesting: "Harvesting",
  fishing: "Fishing",
  travel: "Travel",
  trade: "Trade and markets",
  rest: "Rest",
  ceremony: "Ceremony",
  remembrance: "Remembrance",
  community: "Community",
  other: "Other",
};

export default async function CultureHistoryPage({ params }: { params: Promise<{ communitySlug: string; spaceSlug: string; cultureKey: string }> }) {
  const { communitySlug, spaceSlug, cultureKey } = await params;
  const { supabase, space, spacePath, researcherRole } = await loadTrueCalendarSpace(communitySlug, spaceSlug);
  const history = await getCultureHistory(supabase, cultureKey);
  if (!history) notFound();
  const { culture, systems, cycles, positions, months, lunarDays, observances, meanings, recommendations, correspondences, citations, sources } = history;
  const numbers = numberSources(citations, sources, cycles.map((c) => c.anchor_source_key));
  const cite = { citations, numbers };
  const today = todayIn("UTC");
  const calendarHref = (iso: string) => `${spacePath}?date=${iso}`;
  const hasResearch = systems.length + observances.length + meanings.length + recommendations.length + correspondences.length > 0 || Boolean(culture.overview);

  const facts: Array<[string, string]> = [];
  if (culture.alt_names?.length) facts.push(["Also called", culture.alt_names.join(", ")]);
  facts.push(["Region", [culture.region, culture.continent].filter(Boolean).join(", ")]);
  if (culture.countries?.length) facts.push(["Today in", culture.countries.join(", ")]);
  if (culture.period_label || culture.period_start != null)
    facts.push(["Period", culture.period_label ?? `${formatYear(culture.period_start!)}${culture.period_end != null ? ` to ${formatYear(culture.period_end)}` : " onwards"}`]);
  // Research confidence: how the published records for this culture are evidenced.
  const records = [...systems, ...cycles, ...positions, ...months, ...lunarDays, ...observances, ...meanings, ...recommendations, ...correspondences] as Array<{ evidence?: string[] | null }>;
  if (records.length) {
    const tally = (tags: string[]) => records.filter((r) => (r.evidence ?? []).some((e) => tags.includes(e))).length;
    const parts: Array<[number, string]> = [
      [tally(["historically_documented", "ethnographically_documented", "astronomically_calculated"]), "documented in historical or ethnographic sources"],
      [tally(["oral_tradition"]), "oral tradition"],
      [tally(["scholarly_reconstruction", "unverified_lead"]), "reconstruction or unverified lead"],
      [tally(["contested"]), "contested"],
    ];
    facts.push(["Research confidence", `${records.length} published records: ${parts.filter(([n]) => n > 0).map(([n, l]) => `${n} ${l}`).join(", ") || "evidence not yet tagged"}`]);
  }
  if (culture.continues_today && culture.continues_today !== "unknown")
    facts.push(["Kept today", { yes: "Yes", no: "No", partly: "In part" }[culture.continues_today]]);

  const sectionCls = "rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4 sm:px-5";
  const h = "font-serif text-2xl";

  return (
    <TrueCalendarFrame title={space.name} basePath={spacePath} active="history" showResearch={Boolean(researcherRole)}>
      <div className="space-y-5">
        <div>
          <Link href={`${spacePath}/history`} className="text-base text-[var(--tc-muted)] hover:text-[var(--tc-ink)]">← All traditions</Link>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h2 className="font-serif text-4xl">{culture.name}</h2>
            <StatusPill status={culture.research_status} />
            {hasResearch ? (
              <Link href={`${spacePath}?advice=${encodeURIComponent(culture.key)}#tc-next-advice`} className="text-base text-[var(--tc-gold)] underline-offset-2 hover:underline">
                See related advice
              </Link>
            ) : null}
          </div>
        </div>

        <nav aria-label="On this page" className="flex flex-wrap gap-x-4 gap-y-1 text-base text-[var(--tc-muted)]">
          {[
            ["overview", "Overview"],
            ["time", "Understanding of time"],
            ["cycles", "Cycles"],
            ["beliefs", "Beliefs and significance"],
            ["practice", "Practical knowledge"],
            ["sources", "Sources"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="underline-offset-2 hover:text-[var(--tc-ink)] hover:underline">{label}</a>
          ))}
        </nav>

        <section id="overview" className={sectionCls}>
          <h3 className={h}>Overview</h3>
          <dl className="mt-2 grid gap-x-6 gap-y-1 text-base sm:grid-cols-[max-content_1fr]">
            {facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-[var(--tc-muted)]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {culture.overview || culture.people || culture.places ? (
            <Claim table="calendar_cultures" claimKey={culture.key} record={culture} cite={cite} className="mt-3">
              {culture.overview ? <p>{culture.overview}</p> : null}
              {culture.people ? <p><span className="text-[var(--tc-muted)]">The people: </span>{culture.people}</p> : null}
              {culture.places ? <p><span className="text-[var(--tc-muted)]">Where: </span>{culture.places}</p> : null}
            </Claim>
          ) : null}
          {!hasResearch ? (
            <p className="mt-3 text-base text-[var(--tc-muted)]">
              This tradition is on our research list. Nothing about how it keeps time is shown until it has been checked against its sources, so there is nothing more here yet.
            </p>
          ) : null}
        </section>

        <section id="time" className={sectionCls}>
          <h3 className={h}>Understanding of time</h3>
          {systems.length === 0 ? <Empty /> : (
            <div className="mt-2 space-y-4">
              {systems.map((s) => (
                <Claim key={s.key} table="calendar_systems" claimKey={s.key} record={s} cite={cite}>
                  <p className="font-serif text-xl">
                    {s.name}
                    {s.original_name && s.original_name !== s.name ? <span className="text-[var(--tc-muted)]"> ({s.original_name}{s.translation ? `, “${s.translation}”` : ""})</span> : null}
                    <span className="ml-2 align-middle text-sm text-[var(--tc-muted)]">{SYSTEM_KIND_LABELS[s.kind]}</span>
                  </p>
                  {s.description ? <p>{s.description}</p> : null}
                  <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
                    {([
                      ["Days", s.day_rule],
                      ["Months", s.month_rule],
                      ["Years", s.year_rule],
                      ["Keeping in step", s.intercalation],
                      ["Sky and seasons", s.sky_and_seasons],
                      ["Reforms", s.reforms],
                    ] as const).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-[var(--tc-muted)]">{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Claim>
              ))}
            </div>
          )}
        </section>

        <section id="cycles" className={sectionCls}>
          <h3 className={h}>Cycles</h3>
          {cycles.length + months.length + lunarDays.length === 0 ? <Empty /> : null}
          <div className="mt-2 space-y-5">
            {cycles.map((c) => {
              const anchored = isAnchored(c);
              const own = positions.filter((p) => p.cycle_key === c.key);
              return (
                <Claim key={c.key} table="calendar_cycles" claimKey={c.key} record={c} cite={cite}>
                  <p className="font-serif text-xl">{c.name} <span className="text-base text-[var(--tc-muted)]">· {c.length_days} days</span></p>
                  {c.description ? <p>{c.description}</p> : null}
                  {anchored ? (
                    <p className="text-[var(--tc-muted)]">
                      Placed on today&apos;s calendar by counting from a sourced date: {formatLongDate(parseIsoDate(c.anchor_date!)!)} was day {c.anchor_position! + 1}{numbers.get(c.anchor_source_key!) ? ` [${numbers.get(c.anchor_source_key!)}]` : ""}.
                      {c.anchor_note ? ` ${c.anchor_note}` : ""}
                    </p>
                  ) : (
                    <p className="text-[var(--tc-muted)]">Not placed on the calendar: no sourced starting date yet.</p>
                  )}
                  {c.regional_note ? <p><span className="text-[var(--tc-muted)]">Regional variation: </span>{c.regional_note}</p> : null}
                  {own.length > 0 ? (
                    <ul className="space-y-3">
                      {own.map((p) => (
                        <li key={p.key}>
                          <Claim table="calendar_cycle_positions" claimKey={p.key} record={p} cite={cite}>
                            <p>
                              <span className="font-medium">{p.name}</span>
                              <span className="text-[var(--tc-muted)]"> · day {p.position + 1}{p.translation ? ` · “${p.translation}”` : ""}{p.favourability ? ` · ${p.favourability}` : ""}</span>
                            </p>
                            {p.meaning ? <p>{p.meaning}</p> : null}
                            {anchored ? (
                              <p className="flex flex-wrap gap-x-3 text-base">
                                <span className="text-[var(--tc-muted)]">View in Calendar:</span>
                                {nextDatesForPosition(c, p.position, today, 3).map((d) => (
                                  <Link key={formatIsoDate(d)} href={calendarHref(formatIsoDate(d))} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">
                                    {formatLongDate(d)}
                                  </Link>
                                ))}
                              </p>
                            ) : null}
                          </Claim>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Claim>
              );
            })}

            {months.length > 0 ? (
              <div>
                <p className="font-serif text-xl">Months</p>
                <ol className="mt-1 space-y-2">
                  {months.map((m) => (
                    <li key={m.key}>
                      <Claim table="calendar_months" claimKey={m.key} record={m} cite={cite}>
                        <p>
                          <span className="font-medium">{m.ordinal}. {m.name}</span>
                          {m.translation ? <span className="text-[var(--tc-muted)]"> · “{m.translation}”</span> : null}
                          {m.season ? <span className="text-[var(--tc-muted)]"> · {m.season}</span> : null}
                        </p>
                        {m.description ? <p>{m.description}</p> : null}
                      </Claim>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {systems.filter((sys) => lunarDays.some((d) => d.system_key === sys.key)).map((sys) => (
              <div key={sys.key}>
                <p className="font-serif text-xl">{sys.name}: nights and days of the month</p>
                <p className="text-base text-[var(--tc-muted)]">Not placed on modern dates: the month began by local observation or convention, which we don&apos;t guess.</p>
                <ol className="mt-2 grid gap-2 sm:grid-cols-2">
                  {lunarDays.filter((d) => d.system_key === sys.key).map((d) => (
                    <li key={d.key} className="rounded-md bg-[var(--tc-hover)] px-3 py-2">
                      <Claim table="calendar_lunar_days" claimKey={d.key} record={d} cite={cite}>
                        <p>
                          <span className="font-medium">{d.day_number}. {d.name ?? d.original_name ?? "Name not given in the source"}</span>
                          {d.favourability ? <span className="text-[var(--tc-muted)]"> · {d.favourability}</span> : null}
                        </p>
                        {d.meaning ? <p>{d.meaning}</p> : null}
                      </Claim>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section id="beliefs" className={sectionCls}>
          <h3 className={h}>Beliefs and significance</h3>
          {observances.length + meanings.length + correspondences.length === 0 ? <Empty /> : null}
          <div className="mt-2 space-y-4">
            {observances.map((o) => (
              <Claim key={o.key} table="calendar_observances" claimKey={o.key} record={o} cite={cite}>
                <p className="font-serif text-xl">{o.name}{o.translation ? <span className="text-base text-[var(--tc-muted)]"> · “{o.translation}”</span> : null}</p>
                {o.timing ? <p className="text-[var(--tc-muted)]">When: {o.timing}</p> : null}
                {o.description ? <p>{o.description}</p> : null}
                {o.deities ? <p><span className="text-[var(--tc-muted)]">Deities and figures: </span>{o.deities}</p> : null}
              </Claim>
            ))}
            {meanings.map((m) => (
              <Claim key={m.key} table="calendar_meanings" claimKey={m.key} record={m} cite={cite}>
                <p>
                  {m.moon_phase ? <span className="text-[var(--tc-muted)]">Moon, {m.moon_phase.replace(/_/g, " ")}: </span> : null}
                  {m.interpretation === "alternative" ? <span className="text-[var(--tc-muted)]">Another reading: </span> : null}
                  {m.meaning}
                </p>
                {m.deities ? <p><span className="text-[var(--tc-muted)]">Deities and figures: </span>{m.deities}</p> : null}
              </Claim>
            ))}
            {correspondences.length > 0 ? (
              <div>
                <p className="font-serif text-xl">Dates given by sources</p>
                <ul className="mt-1 space-y-2">
                  {correspondences.map((c) => (
                    <li key={c.key}>
                      <Claim table="calendar_date_correspondences" claimKey={c.key} record={c} cite={cite}>
                        <p>
                          <span className="font-medium">{c.label}</span>
                          {c.gregorian_from ? (
                            <>
                              {" · "}
                              <Link href={calendarHref(c.gregorian_from)} className="text-[var(--tc-gold)] underline-offset-2 hover:underline">
                                {formatLongDate(parseIsoDate(c.gregorian_from)!)}
                              </Link>
                              {c.gregorian_to && c.gregorian_to !== c.gregorian_from ? ` to ${formatLongDate(parseIsoDate(c.gregorian_to)!)}` : ""}
                            </>
                          ) : null}
                          <span className="text-[var(--tc-muted)]"> · {c.certainty}</span>
                        </p>
                        {c.notes ? <p className="text-[var(--tc-muted)]">{c.notes}</p> : null}
                      </Claim>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <section id="practice" className={sectionCls}>
          <h3 className={h}>Practical knowledge</h3>
          {recommendations.length === 0 ? <Empty /> : (
            <>
              <p className="mt-1 text-base text-[var(--tc-muted)]">What people did, from the sources, beside a modern way to use it. The modern column is our suggestion, not part of the tradition.</p>
              <ul className="mt-3 space-y-3">
                {recommendations.map((r) => (
                  <li key={r.key}>
                    <Claim table="calendar_recommendations" claimKey={r.key} record={r} cite={cite}>
                      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--tc-muted)]">{ACTIVITY_LABELS[r.activity] ?? r.activity}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-md bg-[var(--tc-hover)] px-3 py-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Historical practice</p>
                          <p>{r.historical_practice}</p>
                        </div>
                        {r.modern_interpretation ? (
                          <div className="rounded-md border border-dashed border-[var(--tc-line)] px-3 py-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tc-muted)]">Modern adaptation</p>
                            <p>{r.modern_interpretation}</p>
                          </div>
                        ) : null}
                      </div>
                    </Claim>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section id="sources" className={sectionCls}>
          <h3 className={h}>Sources</h3>
          <SourceList sources={sources} numbers={numbers} />
        </section>
      </div>
    </TrueCalendarFrame>
  );
}

function Empty() {
  return <p className="mt-1 text-base text-[var(--tc-muted)]">Nothing checked and published here yet.</p>;
}
