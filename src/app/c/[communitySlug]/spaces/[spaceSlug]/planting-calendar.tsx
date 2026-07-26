"use client";

import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import type { CropCalendar, CropCalendarActivity, CropRegion, CommunityCropRegion } from "@/types/database";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Activity order controls the legend and the stacked bars within a month cell.
const ACTIVITIES: { key: CropCalendarActivity; label: string; dot: string }[] = [
  { key: "sow_indoors", label: "Sow indoors", dot: "bg-amber-500" },
  { key: "direct_sow", label: "Direct sow", dot: "bg-emerald-500" },
  { key: "transplant", label: "Transplant", dot: "bg-sky-500" },
  { key: "harvest", label: "Harvest", dot: "bg-orange-500" },
  { key: "avoid", label: "Avoid planting", dot: "bg-rose-400" },
];

const ACTIVITY_DOT: Record<CropCalendarActivity, string> = Object.fromEntries(
  ACTIVITIES.map((a) => [a.key, a.dot]),
) as Record<CropCalendarActivity, string>;

type RegionOption = { value: string; label: string; group: string; regionId: string | null };

export function PlantingCalendar({
  calendar,
  regions,
  communityRegions,
  currentMonth,
}: {
  calendar: CropCalendar[];
  regions: CropRegion[];
  communityRegions: CommunityCropRegion[];
  currentMonth: number;
}) {
  // Build the region picker: the community's own regions first (they resolve to
  // their base reference region's calendar), then climate, then geographic.
  const options = useMemo<RegionOption[]>(() => {
    const community: RegionOption[] = communityRegions.map((r) => ({
      value: `c:${r.id}`,
      label: r.name,
      group: "Your community",
      regionId: r.base_region_id,
    }));
    const climate = regions.filter((r) => r.kind === "climate").map((r) => ({ value: `r:${r.id}`, label: r.name, group: "Climate", regionId: r.id }));
    const geographic = regions.filter((r) => r.kind === "geographic").map((r) => ({ value: `r:${r.id}`, label: r.name, group: "Region", regionId: r.id }));
    return [...community, ...climate, ...geographic];
  }, [regions, communityRegions]);

  // Default to the first region that actually has calendar data for this crop,
  // so the grid isn't empty on first paint.
  const regionIdsWithData = useMemo(() => new Set(calendar.map((c) => c.region_id)), [calendar]);
  const defaultValue = useMemo(() => {
    const withData = options.find((o) => o.regionId && regionIdsWithData.has(o.regionId));
    return (withData ?? options[0])?.value ?? "";
  }, [options, regionIdsWithData]);

  const [value, setValue] = useState(defaultValue);

  const selected = options.find((o) => o.value === value) ?? options.find((o) => o.value === defaultValue);
  const effectiveRegionId = selected?.regionId ?? null;

  // month (1-12) -> ordered list of activities for the selected region.
  const byMonth = useMemo(() => {
    const map = new Map<number, CropCalendarActivity[]>();
    if (!effectiveRegionId) return map;
    for (const row of calendar) {
      if (row.region_id !== effectiveRegionId) continue;
      const list = map.get(row.month) ?? [];
      list.push(row.activity);
      map.set(row.month, list);
    }
    // Keep each month's activities in legend order.
    for (const [m, list] of map) {
      map.set(
        m,
        ACTIVITIES.map((a) => a.key).filter((k) => list.includes(k)),
      );
    }
    return map;
  }, [calendar, effectiveRegionId]);

  const hasData = byMonth.size > 0;

  const groups = useMemo(() => {
    const seen = new Set<string>();
    return options.reduce<{ group: string; items: RegionOption[] }[]>((acc, o) => {
      if (!seen.has(o.group)) {
        seen.add(o.group);
        acc.push({ group: o.group, items: options.filter((x) => x.group === o.group) });
      }
      return acc;
    }, []);
  }, [options]);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <CalendarRange className="h-4 w-4 text-accent" />
          Planting calendar
        </h2>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Region</span>
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      {!hasData ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No planting calendar yet for this region. Try another region — more calendars are added over time.
        </p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <div className="flex min-w-[36rem] gap-1">
              {MONTHS.map((label, i) => {
                const month = i + 1;
                const activities = byMonth.get(month) ?? [];
                const isNow = month === currentMonth;
                return (
                  <div key={label} className={`flex-1 rounded-md border p-1.5 text-center ${isNow ? "border-accent bg-accent-soft" : "border-border"}`}>
                    <div className={`text-xs font-medium ${isNow ? "text-accent" : "text-muted-foreground"}`}>{label}</div>
                    <div className="mt-1.5 flex flex-col gap-1">
                      {activities.length === 0 ? (
                        <div className="h-1.5" />
                      ) : (
                        activities.map((a) => <div key={a} className={`h-1.5 rounded-full ${ACTIVITY_DOT[a]}`} title={a} />)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {ACTIVITIES.map((a) => (
              <span key={a.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
                {a.label}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
