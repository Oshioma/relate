import type { MappingCoverage } from "@/lib/true-calendar/research/coverage";
import { MAPPING_LEVELS } from "@/lib/true-calendar/research/mapping";

// The research desk's view of the date-mapping engine: live counts from the
// published research, and every culture's mapping profile. Server-rendered.

export function MappingCoveragePanel({ coverage }: { coverage: MappingCoverage }) {
  const tiles: [string, number, string][] = [
    ["Research records", coverage.total, "Published, sources excluded"],
    ["With practical guidance", coverage.actionable, "Published practices"],
    ["Verified dates", coverage.verified, MAPPING_LEVELS.A.explain],
    ["Estimated dates", coverage.estimated, MAPPING_LEVELS.B.explain],
    ["Awaiting date alignment", coverage.awaiting, MAPPING_LEVELS.C.explain],
    ["Cultures with working mapping", coverage.culturesMapped, coverage.culturesMappedNames.join(", ")],
    ["Conflicts to review", coverage.conflicts, "Accounts that disagree, and disputed dates"],
  ];
  return (
    <section aria-labelledby="tc-coverage-heading" className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-panel)] px-4 py-4">
      <h2 id="tc-coverage-heading" className="font-serif text-2xl">Date-mapping coverage</h2>
      <p className="mt-1 text-sm text-[var(--tc-muted)]">Counted live from the published research. A date counts as verified only when a published listing or anchor supports it, never because a calculation works.</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map(([label, n, hint]) => (
          <div key={label} title={hint} className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-bg)] px-3 py-2">
            <dt className="text-sm text-[var(--tc-muted)]">{label}</dt>
            <dd className="font-serif text-3xl font-semibold">{n}</dd>
          </div>
        ))}
      </dl>
      <details className="mt-3">
        <summary className="cursor-pointer text-base font-medium">Mapping profiles ({coverage.profiles.length})</summary>
        <ul className="mt-2 space-y-2 text-sm">
          {coverage.profiles.map(({ profile: p, records }) => (
            <li key={p.key} className="rounded-lg border border-[var(--tc-line)] bg-[var(--tc-bg)] px-3 py-2">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-base font-semibold">
                  {p.label}
                  {p.isDefault ? "" : " (alternative)"}
                </span>
                <span className="text-[var(--tc-muted)]">
                  Level {p.level} · {MAPPING_LEVELS[p.level].name}
                  {p.illustrative ? " · illustrative" : ""} · {records} records
                </span>
              </p>
              <p className="mt-1">
                {p.community}. {p.calendarSystem}; {p.cycleType.replace("_", " ")}
                {p.cycleLength ? `, ${p.cycleLength} days` : ""}. {p.monthBoundary}
              </p>
              <p className="mt-1 text-[var(--tc-muted)]">
                {p.anchor.kind === "none" ? `No anchor yet: needs ${p.anchor.needs}.` : p.assumption} {p.adjustment} {p.region} ({p.timezone}). {p.historicalPeriod}.
                {p.validFrom ? ` Valid from ${p.validFrom}.` : ""} Sources: {p.sourceKeys.join(", ")}.
              </p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
