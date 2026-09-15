"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  cmToFeetInches,
  evidenceStatusHint,
  evidenceStatusLabel,
  measurementKindHint,
  measurementKindLabel,
  measurementMethodLabel,
} from "@/lib/timeline/taxonomy";
import {
  personMatchesFilter,
  plottedMeasurement,
  SCALE_FILTERS,
  type ScaleFilterKey,
  type ScalePerson,
} from "@/lib/timeline/tallest-humans-scale-logic";

/** An ordinary adult man, for scale. Stated, not assumed. */
const REFERENCE_CM = 175;
const REFERENCE_LABEL = "Average adult man, 175 cm";
const FILTERS = SCALE_FILTERS;
type FilterKey = ScaleFilterKey;

// TALLEST HUMANS IN THE EVIDENCE RECORD.
//
// A scale, drawn honestly.
//
// THE ONE RULE THIS COMPONENT EXISTS TO KEEP. The silhouettes are rendered at
// true proportion. 272 cm is drawn 1.554 times the height of 175 cm, because
// that is what it is. Every illustration of this subject ever published
// exaggerates, because an accurate drawing of the tallest man who ever lived
// standing next to an average man is less dramatic than people expect — and
// that mild disappointment IS the finding. A reader who leaves thinking "less
// than I imagined" has learned something true.
//
// THE SECOND RULE. A bar is only drawn for a measurement that exists. Where a
// record has no usable figure — John Carroll's measured standing height, which
// this dataset has not obtained — the row says so in words rather than
// guessing a length. A gap in the evidence is drawn as a gap.
//
// WHY THE BAR IS CLICKABLE. Because "8 ft 11 in" is not a fact, it is the end
// of an argument, and a reader should be able to open it: what was measured,
// by what method, on what authority, and what else has been claimed. Every
// figure here answers "why this height?".

export function TallestHumansScale({ people }: { people: ScalePerson[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const shown = useMemo(() => {
    return people
      .filter((p) => personMatchesFilter(p, filter))
      .map((p) => ({ person: p, plotted: plottedMeasurement(p) }))
      .sort((a, b) => (b.plotted?.valueCm ?? 0) - (a.plotted?.valueCm ?? 0));
  }, [people, filter]);

  // The tallest thing on the chart sets the ceiling, so the drawing never
  // rescales in a way that flatters anybody.
  const ceilingCm = useMemo(() => {
    const tallest = Math.max(REFERENCE_CM, ...shown.map((r) => r.plotted?.valueCm ?? 0));
    return Math.ceil((tallest + 10) / 10) * 10;
  }, [shown]);

  const pct = (cm: number) => `${(cm / ceilingCm) * 100}%`;

  // Foot gridlines, labelled in both systems because the sources use both.
  const footLines = useMemo(() => {
    const lines: { cm: number; label: string }[] = [];
    for (let ft = 6; ft * 30.48 <= ceilingCm; ft += 1) {
      lines.push({ cm: ft * 30.48, label: `${ft} ft` });
    }
    return lines;
  }, [ceilingCm]);

  const comparing = shown.filter((r) => compare.includes(r.person.slug));

  return (
    <section className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Tallest humans in the evidence record</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Drawn to true scale against an {REFERENCE_LABEL.toLowerCase()}. Tap any figure to see why that height and
          not another.
        </p>
      </header>

      {/* FILTERS. Horizontally scrollable on a phone rather than wrapping into
          four ragged rows. */}
      <div className="-mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => {
          const count = people.filter((p) => personMatchesFilter(p, f.key)).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.key
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
              aria-pressed={filter === f.key}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* THE CHART. */}
      <div className="relative rounded-xl border border-border bg-muted/20 p-4 pb-2">
        <div className="relative flex h-[320px] items-end gap-3 overflow-x-auto sm:h-[420px]">
          {/* Gridlines sit behind everything and do not scroll away. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {footLines.map((line) => (
              <div key={line.label} className="absolute inset-x-0 border-t border-dashed border-border/70" style={{ bottom: pct(line.cm) }}>
                <span className="absolute -top-2 left-0 bg-muted/20 pr-1 text-[10px] tabular-nums text-muted-foreground">
                  {line.label}
                </span>
              </div>
            ))}
          </div>

          {/* The reference body. Always first, always stated. */}
          <figure className="relative z-10 flex h-full shrink-0 flex-col justify-end" style={{ width: 44 }}>
            <div
              className="w-full rounded-t-full bg-muted-foreground/25 ring-1 ring-inset ring-border"
              style={{ height: pct(REFERENCE_CM) }}
              title={REFERENCE_LABEL}
            />
            <figcaption className="mt-1 text-center text-[10px] leading-tight text-muted-foreground">
              175 cm
              <span className="block opacity-70">average</span>
            </figcaption>
          </figure>

          {shown.map(({ person, plotted }) => {
            const isOpen = openSlug === person.slug;
            const inCompare = compare.includes(person.slug);
            return (
              <figure key={person.slug} className="relative z-10 flex h-full shrink-0 flex-col justify-end" style={{ width: 52 }}>
                {plotted ? (
                  <button
                    type="button"
                    onClick={() => setOpenSlug(isOpen ? null : person.slug)}
                    className={cn(
                      "w-full rounded-t-full ring-1 ring-inset transition-colors",
                      person.evidenceStatus === "verified_physical_remains"
                        ? "bg-accent/70 ring-accent"
                        : "bg-accent/35 ring-border",
                      isOpen && "ring-2 ring-accent",
                      inCompare && "outline outline-2 outline-offset-1 outline-accent"
                    )}
                    style={{ height: pct(plotted.valueCm ?? 0) }}
                    aria-expanded={isOpen}
                  >
                    <span className="sr-only">
                      {person.title}, {plotted.valueCm} cm. Show why this height.
                    </span>
                  </button>
                ) : (
                  // No usable figure. Drawn as an explicit absence.
                  <div
                    className="flex w-full items-end justify-center rounded-t-lg border border-dashed border-border bg-transparent"
                    style={{ height: "18%" }}
                    title="No usable measurement in this dataset"
                  >
                    <span className="pb-1 text-[10px] text-muted-foreground">?</span>
                  </div>
                )}
                <figcaption className="mt-1 text-center text-[10px] leading-tight">
                  <span className="block font-medium tabular-nums">{plotted?.valueCm ? `${plotted.valueCm}` : "—"}</span>
                  <span className="block truncate text-muted-foreground" title={person.title}>
                    {person.title.split(",")[0].split(" ").slice(-1)[0]}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* WHY THIS HEIGHT? */}
      {openSlug &&
        (() => {
          const row = shown.find((r) => r.person.slug === openSlug);
          if (!row) return null;
          const { person } = row;
          return (
            <article className="mt-4 rounded-xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{person.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{person.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCompare((c) => (c.includes(person.slug) ? c.filter((s) => s !== person.slug) : [...c, person.slug]))
                  }
                  className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted"
                >
                  {compare.includes(person.slug) ? "Remove from compare" : "Add to compare"}
                </button>
              </div>

              {person.evidenceStatus && (
                <p className="mt-3 text-xs">
                  <span className="font-medium">{evidenceStatusLabel(person.evidenceStatus)}</span>
                  <span className="text-muted-foreground"> — {evidenceStatusHint(person.evidenceStatus)}</span>
                </p>
              )}
              {person.accessionNumber && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Accession <span className="font-mono">{person.accessionNumber}</span>
                  {person.remainsLocation ? ` · ${person.remainsLocation}` : null}
                </p>
              )}

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Why this height?
              </h4>
              <ul className="mt-2 space-y-3">
                {person.measurements.map((m, i) => (
                  <li key={i} className="rounded-lg border border-border/70 p-3">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-semibold tabular-nums">
                        {typeof m.valueCm === "number"
                          ? `${m.valueCm} cm · ${cmToFeetInches(m.valueCm)}`
                          : "No figure"}
                      </span>
                      {m.directlyMeasured ? (
                        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium">
                          body or remains measured
                        </span>
                      ) : (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          not directly measured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-medium">{m.whatIsMeasured}</p>
                    <p className="text-xs text-muted-foreground">
                      {measurementKindLabel(m.measurementKind)} · {measurementMethodLabel(m.measurementMethod)} ·{" "}
                      {evidenceStatusLabel(m.evidenceStatus)}
                      {m.measuredOn ? ` · ${m.measuredOn}` : null}
                    </p>
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      {measurementKindHint(m.measurementKind)}
                    </p>
                    <p className="mt-2 text-xs">
                      <span className="text-muted-foreground">As the source puts it: </span>
                      &ldquo;{m.originalValueText}&rdquo;
                    </p>
                    {m.valueAbsentReason && (
                      <p className="mt-2 rounded bg-muted/60 p-2 text-xs">{m.valueAbsentReason}</p>
                    )}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                        Evidence
                      </summary>
                      <p className="mt-1 whitespace-pre-line text-xs leading-relaxed">{m.evidence}</p>
                      {m.notes && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.notes}</p>}
                    </details>
                  </li>
                ))}
              </ul>
            </article>
          );
        })()}

      {/* COMPARE AT SCALE. */}
      {comparing.length > 0 && (
        <section className="mt-4 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Compare at scale</h3>
            <button
              type="button"
              onClick={() => setCompare([])}
              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
            >
              Clear
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              { slug: "__ref", title: REFERENCE_LABEL, cm: REFERENCE_CM, reference: true },
              ...comparing.map((r) => ({
                slug: r.person.slug,
                title: r.person.title,
                cm: r.plotted?.valueCm ?? 0,
                reference: false,
              })),
            ]
              .sort((a, b) => a.cm - b.cm)
              .map((row) => (
                <li key={row.slug} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-xs" title={row.title}>
                    {row.title}
                  </span>
                  <span className="relative h-4 flex-1 overflow-hidden rounded bg-muted/50">
                    <span
                      className={cn("absolute inset-y-0 left-0 rounded", row.reference ? "bg-muted-foreground/40" : "bg-accent/70")}
                      style={{ width: `${(row.cm / ceilingCm) * 100}%` }}
                    />
                  </span>
                  <span className="w-28 shrink-0 text-right text-xs tabular-nums">
                    {row.cm} cm · {cmToFeetInches(row.cm)}
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Bars are proportional. The difference between an ordinary adult and the tallest documented human is
            large, and smaller than most illustrations of it suggest.
          </p>
        </section>
      )}
    </section>
  );
}
