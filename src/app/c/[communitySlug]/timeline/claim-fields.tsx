"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import { DateFields } from "./date-fields";
import { SourcePicker } from "./source-picker";
import { SourceFields } from "./source-fields";
import {
  emptySourceDraft,
  precisionFromDateInput,
  resolveDateInput,
  resolveUncertaintyYears,
  type ClaimDraft,
} from "@/lib/timeline/draft";
import { DATE_UNITS, dateUnit, formatClaimDate, unitTakesDecimals } from "@/lib/timeline/time";
import { CLAIM_VIEWPOINTS, DATING_METHODS, viewpointHint } from "@/lib/timeline/taxonomy";

// One proposed date, and the source behind it.
//
// There is no confidence rating on this form, and there will not be one. Asking
// a contributor to grade a historical, scientific or religious claim "high /
// medium / low" makes Relate the authority on whether it is true, and a badge
// saying so ends the enquiry it should have started. What replaces it is the
// two boxes that were always the useful ones — HOW the date was worked out, and
// WHAT it rests on — plus the source's own wording, kept verbatim.
//
// The precision controls are the other half of the same idea. A source that
// says 13.799 ± 0.021 billion years ago has been precise; the form's job is to
// carry that through unharmed, not to decide that anything ancient is vague.

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (next: string | null) => void;
  options: readonly { key: string; label: string }[];
  placeholder: string;
  hint?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {/* aria-label as well as the visible <Label>: the label element carries
          no htmlFor, so without this the control is unnamed to a screen reader
          (and to anything else querying the page by accessible name). */}
      <select
        aria-label={label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ClaimFields({
  value,
  onChange,
  onRemove,
  communitySlug,
  attachedSource,
  index,
  // The wizard asks for the date on one step and the source on the next, so
  // both halves of this panel can be rendered on their own. Everywhere else
  // shows them together.
  show = "all",
  bare = false,
}: {
  value: ClaimDraft;
  onChange: (next: ClaimDraft) => void;
  onRemove?: () => void;
  communitySlug: string;
  /** The source currently attached, when editing an existing claim. */
  attachedSource?: TimelineSource | null;
  index: number;
  show?: "all" | "date" | "source";
  bare?: boolean;
}) {
  const [picked, setPicked] = useState<TimelineSource | null>(attachedSource ?? null);

  function update(patch: Partial<ClaimDraft>) {
    onChange({ ...value, ...patch });
  }

  const unit = dateUnit(value.date_precision);
  const takesDecimals = unitTakesDecimals(value.date_precision);
  const showDate = show !== "source";
  const showSource = show !== "date";

  // Somebody typing "13.799 billion years ago" has already told us the unit and
  // that they have three places of it. Filling both in beats making them say it
  // twice — and it is the difference between preserving the precision a source
  // gave and hoping a child describes it correctly. Both stay editable.
  useEffect(() => {
    const implied = precisionFromDateInput(value.start);
    if (!implied) return;
    if (implied.unit === value.date_precision && implied.decimals === value.precision_decimals) return;
    onChange({ ...value, date_precision: implied.unit, precision_decimals: implied.decimals });
    // Only re-derive when the typed date itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.start.mode, value.start.amount, value.start.unit]);

  // A live reading of what will be stored, so the contributor can see the
  // normalisation before they commit to it.
  const resolvedStart = resolveDateInput(value.start);
  const resolvedEnd = resolveDateInput(value.end);
  const uncertaintyYears = resolveUncertaintyYears(value);
  const preview = resolvedStart
    ? formatClaimDate({
        start_year: resolvedStart.year,
        start_month: resolvedStart.month,
        start_day: resolvedStart.day,
        end_year: resolvedEnd?.year ?? null,
        end_month: resolvedEnd?.month ?? null,
        end_day: resolvedEnd?.day ?? null,
        date_precision: value.date_precision,
        precision_decimals: value.precision_decimals,
        is_approximate: value.is_approximate,
        uncertainty_plus: uncertaintyYears.plus,
        uncertainty_minus: uncertaintyYears.minus,
        original_date_text: "",
      })
    : null;

  return (
    <div className={bare ? "" : "rounded-xl border border-border bg-card p-4 sm:p-5"}>
      <div className={cn("mb-4 flex items-center justify-between gap-3", bare && "hidden")}>
        <p className="text-sm font-semibold text-foreground">Proposed date {index + 1}</p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        {showDate && (
          <>
            <DateFields
              label="When does this source say it happened?"
              value={value.start}
              onChange={(next) => update({ start: next })}
            />

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={value.end != null}
                onChange={(event) =>
                  update({
                    end: event.target.checked
                      ? { mode: value.start.mode, era: value.start.era ?? "CE", month: null, day: null, unit: value.start.unit }
                      : null,
                  })
                }
                className="h-4 w-4 rounded border-border"
              />
              This source gives a span of time, not one date
            </label>

            {value.end != null && (
              <DateFields label="…up to" value={value.end} onChange={(next) => update({ end: next })} />
            )}

            {/* --- Precision, as the source gave it ------------------------- */}
            <div className="rounded-lg border border-border bg-muted/30 p-3.5">
              <p className="mb-2 text-sm font-semibold text-foreground">How precise is the source?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>It counts in</Label>
                  <select
                    aria-label="The unit the source counts in"
                    value={value.date_precision}
                    onChange={(event) => update({ date_precision: event.target.value })}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {DATE_UNITS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">{unit.hint}</p>
                </div>

                {takesDecimals && (
                  <div>
                    <Label>Decimal places it gives</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      aria-label="Decimal places the source gives"
                      min={0}
                      max={9}
                      value={value.precision_decimals}
                      onChange={(event) =>
                        update({ precision_decimals: Math.max(0, Math.min(9, Number(event.target.value) || 0)) })
                      }
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      3 for “13.799 billion years ago”, 0 for “14 billion years ago”. We print exactly this many — no
                      more, no fewer.
                    </p>
                  </div>
                )}
              </div>

              <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={value.is_approximate}
                  onChange={(event) => update({ is_approximate: event.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                The source says this is approximate (shows as “c.” — circa)
              </label>

              {/* --- ± tolerance ------------------------------------------- */}
              <div className="mt-3">
                <Label>Does the source give a ± figure?</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">±</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min={0}
                    placeholder="0.021"
                    aria-label="Uncertainty"
                    className="w-32"
                    value={value.uncertainty_plus_units ?? ""}
                    onChange={(event) =>
                      update({
                        uncertainty_plus_units: event.target.value === "" ? null : Number(event.target.value),
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {takesDecimals ? unit.label.replace(" ago", "").toLowerCase() : "years"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  A measured tolerance — “13.799 ± 0.021 billion years ago”. Not the same as a range: a range says
                  “somewhere between these two”, a ± says “this moment, measured this well”. Leave it blank unless the
                  source actually prints one.
                </p>
              </div>
            </div>

            {/* --- The source's own words ---------------------------------- */}
            <div>
              <Label>How does the source word it?</Label>
              <Input
                aria-label="How the source words the date"
                value={value.original_date_text}
                onChange={(event) => update({ original_date_text: event.target.value })}
                placeholder="c. 2560 BCE · 10 AH · the third year of the reign of Darius · 13.799 ± 0.021 billion years ago"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Copied out exactly, in whatever calendar or notation the source uses. We keep this word for word and
                never rewrite it — the number above is only how we place it on the timeline.
              </p>
            </div>

            {preview && (
              <p className="rounded-lg bg-accent-soft/50 px-3.5 py-2.5 text-sm text-foreground">
                On the timeline this will read <span className="font-semibold">{preview}</span>
                {value.original_date_text.trim() && (
                  <>
                    , under the source&apos;s own wording “{value.original_date_text.trim()}”
                  </>
                )}
                .
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label="How was the date worked out?"
                value={value.dating_method}
                onChange={(next) => update({ dating_method: next })}
                options={DATING_METHODS}
                placeholder="Not stated"
                hint="The method behind the number."
              />
              {/* WHOSE ACCOUNT THIS IS — a different question from the one
                  above it and a different question again from "kind of
                  source" on the source form. A viewpoint describes the CLAIM;
                  a source type describes the DOCUMENT. An academic paper can
                  argue an alternative reading and a religious text can be
                  cited for the mainstream date, so the two are never merged. */}
              <Select
                label="Whose account is this? (viewpoint)"
                value={value.chronology}
                onChange={(next) => update({ chronology: next })}
                options={CLAIM_VIEWPOINTS}
                placeholder="Not stated"
                hint={
                  viewpointHint(value.chronology) ||
                  "The body of thought the date comes out of. Naming it isn't agreeing with it — and it isn't the same as the kind of source, which you'll set below."
                }
              />
            </div>

            <div>
              <Label>What is this date based on?</Label>
              <Textarea
                aria-label="What this date is based on"
                rows={3}
                value={value.evidence ?? ""}
                onChange={(event) => update({ evidence: event.target.value })}
                placeholder="Radiocarbon measurements from organic material in the mortar. · Counted through the sequence of kings the text describes. · An eclipse recorded in the same year, which can be calculated backwards."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The most useful box on this form. This is what “Why this date?” shows a learner — it is how they find
                out that dates are worked out rather than simply known.
              </p>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea aria-label="Notes" rows={2} value={value.notes ?? ""} onChange={(event) => update({ notes: event.target.value })} />
            </div>
          </>
        )}

        {/* Source ---------------------------------------------------------- */}
        {showSource && (
          <div className="rounded-lg border border-border bg-muted/30 p-3.5">
            <p className="mb-2 text-sm font-semibold text-foreground">Where does this date come from?</p>

            {value.new_source ? (
              <SourceFields
                value={value.new_source}
                onChange={(next) => update({ new_source: next })}
                onCancel={() => update({ new_source: null })}
                communitySlug={communitySlug}
              />
            ) : (
              <SourcePicker
                communitySlug={communitySlug}
                selectedId={value.source_id ?? null}
                selectedSource={picked}
                onSelect={(source) => {
                  setPicked(source);
                  update({ source_id: source?.id ?? null, new_source: null });
                }}
                onCreateNew={() => update({ source_id: null, new_source: emptySourceDraft() })}
              />
            )}

            {!value.source_id && !value.new_source && (
              <p className="mt-2 text-xs text-muted-foreground">
                You can save without one — the date will simply show as having nothing behind it, which is worth knowing
                on its own. Add the source later when you find it.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
