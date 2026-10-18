"use client";

import { useMemo, useState } from "react";
import { Check, Columns3, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideTag } from "@/lib/guides/where-to-stay/types";
import {
  ATMOSPHERE_LABELS,
  COMPARISON_FILTERS,
  NIGHTLIFE_LABELS,
  RESTAURANT_LABELS,
  SWIMMING_LABELS,
  TAG_LABELS,
  TIDE_LABELS,
  ACCOMMODATION_LABELS,
} from "@/lib/guides/where-to-stay/labels";
import { compareDestinations, matchesFilter } from "@/lib/guides/where-to-stay/scoring";
import { TAG_ICONS } from "./guide-icons";
import type { DestinationSummary } from "./types";

const QUICK_PAIRS: [string, string][] = [
  ["kendwa", "nungwi"],
  ["paje", "jambiani"],
  ["matemwe", "michamvi"],
  ["kiwengwa", "pwani-mchangani"],
];

const MAX_COMPARE = 3;

// "Which part of Zanzibar is right for you?" — the filterable table of all 14
// destinations, plus a side-by-side compare of two or three of them. Every
// cell is one of the guide's labels; nothing here is a made-up score.
export function DestinationComparison({ destinations }: { destinations: DestinationSummary[] }) {
  const [filters, setFilters] = useState<GuideTag[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(
    () => destinations.filter((d) => filters.every((f) => matchesFilter(d, f))),
    [destinations, filters]
  );
  const compared = selected.map((key) => destinations.find((d) => d.key === key)).filter((d): d is DestinationSummary => Boolean(d));
  const answers = compareDestinations(compared);

  function toggleFilter(tag: GuideTag) {
    setFilters((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]));
  }

  function toggleSelected(key: string) {
    setSelected((current) => {
      if (current.includes(key)) return current.filter((k) => k !== key);
      if (current.length >= MAX_COMPARE) return [...current.slice(1), key];
      return [...current, key];
    });
  }

  return (
    <div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-foreground">Filter destinations</legend>
        <div className="flex flex-wrap gap-2">
          {COMPARISON_FILTERS.map(({ key, label }) => {
            const Icon = TAG_ICONS[key];
            const active = filters.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => toggleFilter(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </button>
            );
          })}
          {filters.length > 0 && (
            <button type="button" onClick={() => setFilters([])} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" aria-hidden /> Clear
            </button>
          )}
        </div>
      </fieldset>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {rows.length === destinations.length
          ? `All ${destinations.length} destinations. Tick up to three to compare them side by side.`
          : rows.length === 0
            ? "No destination matches every filter. Try removing one."
            : `${rows.length} of ${destinations.length} destinations match.`}
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Comparison of Zanzibar beach destinations</caption>
          <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2.5">Compare</th>
              <th scope="col" className="px-3 py-2.5">Destination</th>
              <th scope="col" className="px-3 py-2.5">Swimming</th>
              <th scope="col" className="px-3 py-2.5">Tides</th>
              <th scope="col" className="px-3 py-2.5">Atmosphere</th>
              <th scope="col" className="px-3 py-2.5">Nightlife</th>
              <th scope="col" className="px-3 py-2.5">Restaurants</th>
              <th scope="col" className="px-3 py-2.5">Budget</th>
              <th scope="col" className="px-3 py-2.5">Best for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const checked = selected.includes(d.key);
              return (
                <tr key={d.key} className={cn("border-t border-border align-top", checked && "bg-accent-soft")}>
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelected(d.key)}
                      aria-label={`Compare ${d.name}`}
                      className="h-4 w-4 rounded border-border accent-[var(--accent)]"
                      data-no-draft
                    />
                  </td>
                  <th scope="row" className="px-3 py-2.5 font-medium text-foreground">
                    <a href={`#${d.key}`} className="hover:text-accent hover:underline">
                      <span className="mr-1 text-muted-foreground">{d.rank}.</span>
                      {d.name}
                    </a>
                  </th>
                  <td className="px-3 py-2.5">{SWIMMING_LABELS[d.panel.swimming]}</td>
                  <td className="px-3 py-2.5">{TIDE_LABELS[d.panel.tides]}</td>
                  <td className="px-3 py-2.5">{ATMOSPHERE_LABELS[d.panel.atmosphere]}</td>
                  <td className="px-3 py-2.5">{NIGHTLIFE_LABELS[d.panel.nightlife]}</td>
                  <td className="px-3 py-2.5">{RESTAURANT_LABELS[d.panel.restaurants]}</td>
                  <td className="px-3 py-2.5 font-medium">{d.panel.budget}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{d.bestFor.slice(0, 4).map((t) => TAG_LABELS[t]).join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div id="compare" className="mt-8 scroll-mt-24">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Columns3 className="h-5 w-5 text-accent" aria-hidden /> Compare side by side
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PAIRS.map(([a, b]) => {
            const da = destinations.find((d) => d.key === a);
            const db = destinations.find((d) => d.key === b);
            if (!da || !db) return null;
            const active = selected.length === 2 && selected.includes(a) && selected.includes(b);
            return (
              <button
                key={`${a}-${b}`}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected([a, b])}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "border-accent bg-accent-soft text-accent" : "border-border bg-card hover:bg-muted"
                )}
              >
                {da.name} vs {db.name}
              </button>
            );
          })}
        </div>

        {compared.length < 2 ? (
          <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Tick two or three destinations in the table, or pick a pairing above.
          </p>
        ) : (
          <div className="mt-4 space-y-4" aria-live="polite">
            <div className={cn("grid gap-3", compared.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
              {compared.map((d) => (
                <div key={d.key} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <a href={`#${d.key}`} className="font-semibold text-foreground hover:text-accent hover:underline">{d.name}</a>
                    <button type="button" onClick={() => toggleSelected(d.key)} aria-label={`Remove ${d.name} from comparison`} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{d.category}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <dt className="text-muted-foreground">Swimming</dt><dd>{SWIMMING_LABELS[d.panel.swimming]}</dd>
                    <dt className="text-muted-foreground">Atmosphere</dt><dd>{ATMOSPHERE_LABELS[d.panel.atmosphere]}</dd>
                    <dt className="text-muted-foreground">Nightlife</dt><dd>{NIGHTLIFE_LABELS[d.panel.nightlife]}</dd>
                    <dt className="text-muted-foreground">Restaurants</dt><dd>{RESTAURANT_LABELS[d.panel.restaurants]}</dd>
                    <dt className="text-muted-foreground">Places to stay</dt><dd>{ACCOMMODATION_LABELS[d.panel.accommodation]}</dd>
                    <dt className="text-muted-foreground">Budget</dt><dd>{d.panel.budget}</dd>
                  </dl>
                  <p className="mt-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">Trade-off:</span> {d.tradeOff}</p>
                </div>
              ))}
            </div>
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {answers.map((a) => (
                <li key={a.question} className="flex gap-3 p-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">{a.question}</p>
                    <p className="text-muted-foreground">{a.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
