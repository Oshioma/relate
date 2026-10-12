"use client";

import { useState } from "react";

export type ChartColumn = {
  // Axis / tooltip heading, e.g. "Mon 12 Oct".
  label: string;
  // Rises above the baseline, in the accent.
  value: number;
  // Optional second series that hangs below the baseline (e.g. leaves under
  // joins). Position carries identity, colour only backs it up, so the pair
  // stays readable without relying on telling two hues apart.
  below?: number;
  // Extra tooltip lines, e.g. the breakdown behind a total.
  detail?: string[];
};

const PLOT_HEIGHT = 140;

// A daily column chart for the admin analytics page. Plain HTML/CSS columns
// rather than a chart library: thin bars (capped at 24px) with a rounded data
// end and square baseline, a hairline baseline, max and zero ticks only, first
// and last dates on the axis, a hover/tap tooltip per column, and a table view
// for screen readers and anyone who'd rather read numbers.
export function ColumnChart({
  title,
  valueName,
  belowName,
  columns,
}: {
  title: string;
  valueName: string;
  belowName?: string;
  columns: ChartColumn[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const hasBelow = belowName !== undefined;
  const maxUp = Math.max(0, ...columns.map((c) => c.value));
  const maxDown = hasBelow ? Math.max(0, ...columns.map((c) => c.below ?? 0)) : 0;
  const empty = maxUp === 0 && maxDown === 0;

  // Split the plot between the two directions by their peaks, so a big join
  // day doesn't squash leaves to nothing (and vice versa). Each side keeps at
  // least a quarter when both have data.
  const span = maxUp + maxDown || 1;
  let upHeight = hasBelow ? Math.round((PLOT_HEIGHT * maxUp) / span) : PLOT_HEIGHT;
  if (hasBelow && maxUp > 0 && maxDown > 0) {
    upHeight = Math.min(Math.max(upHeight, PLOT_HEIGHT / 4), (PLOT_HEIGHT * 3) / 4);
  }
  if (hasBelow && maxDown === 0) upHeight = PLOT_HEIGHT * 0.8;
  const downHeight = hasBelow ? PLOT_HEIGHT - upHeight : 0;

  const active = hover !== null ? columns[hover] : null;

  return (
    <figure className="min-w-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <figcaption className="text-sm font-medium text-foreground">{title}</figcaption>
        {hasBelow && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" /> {valueName} (above)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/60" /> {belowName} (below)
            </span>
          </div>
        )}
      </div>

      {empty ? (
        <p className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
          Nothing in this period yet.
        </p>
      ) : (
        <div className="relative" aria-hidden onMouseLeave={() => setHover(null)}>
          {/* Tooltip, pinned above the plot and nudged toward the hovered column. */}
          {active && (
            <div
              className="pointer-events-none absolute -top-2 z-10 whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm"
              style={{
                left: `${((hover! + 0.5) / columns.length) * 100}%`,
                transform: `translate(${hover! / columns.length > 0.6 ? "-100%" : hover! / columns.length < 0.4 ? "0" : "-50%"}, -100%)`,
              }}
            >
              <p className="font-medium text-foreground">{active.label}</p>
              <p className="text-muted-foreground">
                {valueName}: <span className="font-medium text-foreground">{active.value.toLocaleString()}</span>
              </p>
              {hasBelow && (
                <p className="text-muted-foreground">
                  {belowName}: <span className="font-medium text-foreground">{(active.below ?? 0).toLocaleString()}</span>
                </p>
              )}
              {active.detail?.map((line) => (
                <p key={line} className="text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="flex">
            {/* Y ticks: the peak and zero only — the tooltip and table carry the rest. */}
            <div
              className="relative mr-2 w-6 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground"
              style={{ height: PLOT_HEIGHT }}
            >
              <span className="absolute right-0 top-0 -translate-y-1/2">{compact(maxUp)}</span>
              <span className="absolute right-0 -translate-y-1/2" style={{ top: upHeight }}>
                0
              </span>
              {hasBelow && maxDown > 0 && (
                <span className="absolute bottom-0 right-0 translate-y-1/2">{compact(maxDown)}</span>
              )}
            </div>

            <div className="relative min-w-0 flex-1" style={{ height: PLOT_HEIGHT }}>
              {/* Recessive guides: hairline at the peak and a baseline at zero. */}
              <div className="absolute inset-x-0 top-0 border-t border-border/60" />
              <div className="absolute inset-x-0 border-t border-border" style={{ top: upHeight }} />

              <div className="absolute inset-0 flex gap-[2px]">
                {columns.map((c, i) => {
                  const upPx = maxUp > 0 ? (c.value / maxUp) * upHeight : 0;
                  const downPx = maxDown > 0 ? ((c.below ?? 0) / maxDown) * downHeight : 0;
                  const dim = hover !== null && hover !== i;
                  return (
                    // The whole column slot is the hit target, not just the bar.
                    <div
                      key={i}
                      className="relative flex h-full min-w-0 flex-1 cursor-default flex-col items-center"
                      onMouseEnter={() => setHover(i)}
                      onClick={() => setHover(i)}
                    >
                      <div className="flex w-full justify-center" style={{ height: upHeight }}>
                        <div className="flex h-full w-full max-w-6 items-end">
                          {c.value > 0 && (
                            <div
                              className={`w-full rounded-t bg-accent transition-opacity ${dim ? "opacity-40" : ""}`}
                              style={{ height: Math.max(upPx, 2) }}
                            />
                          )}
                        </div>
                      </div>
                      {hasBelow && (
                        <div className="flex w-full justify-center" style={{ height: downHeight }}>
                          <div className="flex h-full w-full max-w-6 items-start">
                            {(c.below ?? 0) > 0 && (
                              <div
                                className={`w-full rounded-b bg-muted-foreground/60 transition-opacity ${dim ? "opacity-40" : ""}`}
                                style={{ height: Math.max(downPx, 2) }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X axis: first and last day only. */}
          <div className="ml-8 mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>{columns[0]?.label}</span>
            <span>{columns[columns.length - 1]?.label}</span>
          </div>
        </div>
      )}

      <details className="mt-3 text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show as table</summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-border">
          <table className="w-full text-left">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-card text-muted-foreground">
              <tr>
                <th className="px-3 py-1.5 font-medium">Day</th>
                <th className="px-3 py-1.5 text-right font-medium">{valueName}</th>
                {hasBelow && <th className="px-3 py-1.5 text-right font-medium">{belowName}</th>}
              </tr>
            </thead>
            <tbody className="tabular-nums text-foreground">
              {columns.map((c, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-1.5">{c.label}</td>
                  <td className="px-3 py-1.5 text-right">{c.value.toLocaleString()}</td>
                  {hasBelow && <td className="px-3 py-1.5 text-right">{(c.below ?? 0).toLocaleString()}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}
