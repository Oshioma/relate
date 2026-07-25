"use client";

import { Clock } from "lucide-react";
import type { BusinessHoursSchedule, BusinessDayHours } from "@/types/database";

// Monday-first rows over Date.getDay() indices (Sun..Sat = 0..6).
const DAYS: { key: string; label: string }[] = [
  { key: "1", label: "Monday" },
  { key: "2", label: "Tuesday" },
  { key: "3", label: "Wednesday" },
  { key: "4", label: "Thursday" },
  { key: "5", label: "Friday" },
  { key: "6", label: "Saturday" },
  { key: "0", label: "Sunday" },
];

function defaultSchedule(): BusinessHoursSchedule {
  const schedule: BusinessHoursSchedule = {};
  for (const { key } of DAYS) {
    const weekend = key === "0" || key === "6";
    schedule[key] = { closed: weekend, open: "09:00", close: "17:00" };
  }
  return schedule;
}

function dayOf(schedule: BusinessHoursSchedule, key: string): BusinessDayHours {
  return schedule[key] ?? { closed: true, open: "09:00", close: "17:00" };
}

// Weekly opening-hours editor. Emits the schedule as a hidden JSON
// `opening_hours_structured` field; the server regenerates the human-readable
// `opening_hours` text from it. Powers a reliable "Open now" badge. Free-text
// hours are still supported for legacy listings that never set a schedule.
export function OpeningHoursInput({
  value,
  onChange,
}: {
  value: BusinessHoursSchedule | null;
  onChange: (schedule: BusinessHoursSchedule | null) => void;
}) {
  function update(key: string, patch: Partial<BusinessDayHours>) {
    if (!value) return;
    onChange({ ...value, [key]: { ...dayOf(value, key), ...patch } });
  }

  function copyFirstOpenToAll() {
    if (!value) return;
    const source = DAYS.map((d) => dayOf(value, d.key)).find((d) => !d.closed);
    if (!source) return;
    const next: BusinessHoursSchedule = {};
    for (const { key } of DAYS) {
      const current = dayOf(value, key);
      next[key] = current.closed ? current : { closed: false, open: source.open, close: source.close };
    }
    onChange(next);
  }

  if (!value) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onChange(defaultSchedule())}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:border-accent hover:text-foreground"
        >
          <Clock className="h-4 w-4" /> Set weekly hours
        </button>
        <input type="hidden" name="opening_hours_structured" value="" />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border p-3">
      <div className="space-y-1.5">
        {DAYS.map(({ key, label }) => {
          const day = dayOf(value, key);
          return (
            <div key={key} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="w-24 shrink-0 text-foreground">{label}</span>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" checked={!day.closed} onChange={(e) => update(key, { closed: !e.target.checked })} className="accent-[var(--accent)]" />
                Open
              </label>
              {day.closed ? (
                <span className="text-xs text-muted-foreground">Closed</span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => update(key, { open: e.target.value })}
                    className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-muted-foreground">–</span>
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => update(key, { close: e.target.value })}
                    className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <button type="button" onClick={copyFirstOpenToAll} className="font-medium text-muted-foreground hover:text-foreground">
          Copy first open day to all
        </button>
        <button type="button" onClick={() => onChange(null)} className="font-medium text-muted-foreground hover:text-danger">
          Clear hours
        </button>
      </div>

      <input type="hidden" name="opening_hours_structured" value={JSON.stringify(value)} />
    </div>
  );
}
