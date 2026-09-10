"use client";

import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AGO_UNITS, resolveDateInput, type DateInput } from "@/lib/timeline/draft";
import { formatDateParts } from "@/lib/timeline/time";

// Typing a date that might be Tuesday or might be four and a half billion years
// ago.
//
// Two modes rather than one clever box. "1066, CE" and "4.5 billion years ago"
// are different gestures, and a single field that tried to accept both would
// either reject "4.5 billion" or invite somebody to type 4,499,998,050 BCE by
// hand and get it wrong. The mode switch is the honest version of that choice —
// and "years ago" deliberately offers no month, because nobody knows which
// Tuesday the dinosaurs went.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DateFields({
  value,
  onChange,
  label,
  hint,
}: {
  value: DateInput;
  onChange: (next: DateInput) => void;
  label: string;
  hint?: string;
}) {
  const resolved = resolveDateInput(value);

  function update(patch: Partial<DateInput>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <Label className="mb-0">{label}</Label>
        <div className="flex rounded-full bg-muted p-0.5">
          {(
            [
              { key: "calendar", label: "A year" },
              { key: "years_ago", label: "Years ago" },
            ] as const
          ).map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => update({ mode: mode.key })}
              aria-pressed={value.mode === mode.key}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                value.mode === mode.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {value.mode === "calendar" ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Year"
            aria-label="Year"
            value={value.year ?? ""}
            onChange={(event) =>
              update({ year: event.target.value === "" ? undefined : Number(event.target.value) })
            }
          />
          <select
            aria-label="Era"
            value={value.era ?? "CE"}
            onChange={(event) => update({ era: event.target.value as "BCE" | "CE" })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="CE">CE (AD)</option>
            <option value="BCE">BCE (BC)</option>
          </select>
          <select
            aria-label="Month (optional)"
            value={value.month ?? ""}
            onChange={(event) =>
              update({ month: event.target.value === "" ? null : Number(event.target.value), day: null })
            }
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Month —</option>
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            placeholder="Day —"
            aria-label="Day (optional)"
            disabled={value.month == null}
            value={value.day ?? ""}
            onChange={(event) => update({ day: event.target.value === "" ? null : Number(event.target.value) })}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="13.8"
            aria-label="How long ago"
            value={value.amount ?? ""}
            onChange={(event) =>
              update({ amount: event.target.value === "" ? undefined : Number(event.target.value) })
            }
          />
          <select
            aria-label="Units"
            value={value.unit ?? "million"}
            onChange={(event) => update({ unit: event.target.value as DateInput["unit"] })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {AGO_UNITS.map((unit) => (
              <option key={unit.key} value={unit.key}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="mt-1.5 text-xs text-muted-foreground">
        {resolved ? (
          <>
            Reads as <span className="font-medium text-foreground">{formatDateParts(resolved.year, resolved.month, resolved.day)}</span>
            {value.mode === "years_ago" && " (counted from 1950, the scientific convention for “years ago”)"}
          </>
        ) : (
          hint ?? "Fill this in to place the event on the timeline."
        )}
      </p>
    </div>
  );
}
