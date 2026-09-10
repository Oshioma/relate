"use client";

import { useEffect, useState } from "react";
import { Link2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import { DateFields } from "./date-fields";
import { SourcePicker } from "./source-picker";
import { importSourceFromLink } from "./actions";
import {
  emptySourceDraft,
  precisionFromDateInput,
  resolveDateInput,
  resolveUncertaintyYears,
  type ClaimDraft,
  type SourceDraft,
} from "@/lib/timeline/draft";
import { DATE_UNITS, dateUnit, formatClaimDate, unitTakesDecimals } from "@/lib/timeline/time";
import { CHRONOLOGIES, DATING_METHODS, TIMELINE_SOURCE_TYPES } from "@/lib/timeline/taxonomy";

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

function SourceFields({
  value,
  onChange,
  onCancel,
  communitySlug,
}: {
  value: SourceDraft;
  onChange: (next: SourceDraft) => void;
  onCancel: () => void;
  communitySlug: string;
}) {
  const [link, setLink] = useState(value.url ?? "");
  const [reading, setReading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [filled, setFilled] = useState<string[] | null>(null);

  function update(patch: Partial<SourceDraft>) {
    onChange({ ...value, ...patch });
  }

  // Paste a link, get a filled-in form. It fills; it never submits — page
  // metadata is often thin or wrong, and the person pasting knows more about
  // what they are citing than the page's <meta> tags do.
  async function readLink() {
    const trimmed = link.trim();
    if (!trimmed) return;
    setReading(true);
    setLinkError(null);
    setFilled(null);

    const result = await importSourceFromLink(communitySlug, trimmed);
    setReading(false);

    if (!result.ok) {
      // The link is still worth keeping even when the page won't be read.
      update({ url: trimmed });
      setLinkError(result.error);
      return;
    }

    const found = result.source;
    const got: string[] = [];
    if (found.title) got.push("title");
    if (found.author) got.push("author");
    if (found.publisher) got.push("publisher");
    if (found.published) got.push("its own date");

    update({
      url: found.url,
      // Never overwrite something already typed — a contributor who has
      // corrected the title should not lose it to a second fetch.
      title: value.title.trim() || found.title,
      author: value.author?.trim() || found.author || "",
      publisher: value.publisher?.trim() || found.publisher || "",
      source_type: found.sourceType,
      published: found.published
        ? {
            mode: "calendar",
            year: found.published.year,
            era: "CE",
            month: found.published.month,
            day: found.published.day,
            unit: "million",
          }
        : value.published ?? null,
    });
    setLink(found.url);
    setFilled(got);
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/60 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">A new source</p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Search existing instead
        </button>
      </div>

      {/* Start from the link. A video or a wiki page has its title, its author
          and its own publication date written into it already — asking somebody
          to retype all three is how a timeline ends up full of unsourced
          dates. */}
      <div className="rounded-lg border border-border bg-card p-3">
        <Label>Paste a link and we&apos;ll fill this in</Label>
        <div className="flex flex-wrap gap-2">
          <Input
            aria-label="Link to the source"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void readLink();
              }
            }}
            placeholder="A YouTube video, a Wikipedia article, a news story, a paper…"
            className="min-w-[16rem] flex-1"
          />
          <Button type="button" variant="secondary" onClick={() => void readLink()} disabled={reading || !link.trim()}>
            {reading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Reading…</>) : (<><Link2 className="h-4 w-4" /> Fill in</>)}
          </Button>
        </div>

        {filled && (
          <p className="mt-1.5 text-xs text-accent">
            {filled.length > 0 ? `Filled in the ${filled.join(", ")}. ` : ""}
            Check it over and correct anything the page got wrong.
          </p>
        )}
        {linkError && <p className="mt-1.5 text-xs text-danger">{linkError}</p>}
        {!filled && !linkError && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Optional — you can type the details yourself instead. Nothing is saved until you finish the form.
          </p>
        )}
      </div>

      <div>
        <Label>Source title</Label>
        <Input
          aria-label="Source title"
          value={value.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder="e.g. The Complete Pyramids"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Author</Label>
          <Input aria-label="Author" value={value.author ?? ""} onChange={(event) => update({ author: event.target.value })} />
        </div>
        <div>
          <Label>Publisher or publication</Label>
          <Input aria-label="Publisher or publication" value={value.publisher ?? ""} onChange={(event) => update({ publisher: event.target.value })} />
        </div>
        <div>
          <Label>Book or document it&apos;s in</Label>
          <Input aria-label="Book or document it's in" value={value.work_title ?? ""} onChange={(event) => update({ work_title: event.target.value })} />
        </div>
        <div>
          <Label>Page or reference</Label>
          <Input
            aria-label="Page or reference"
            value={value.reference ?? ""}
            onChange={(event) => update({ reference: event.target.value })}
            placeholder="p. 108"
          />
        </div>
        <div>
          <Label>Link</Label>
          <Input
            aria-label="Link"
            value={value.url ?? ""}
            onChange={(event) => update({ url: event.target.value })}
            placeholder="https://…"
          />
        </div>
        <div>
          <Label>Kind of source</Label>
          <select
            aria-label="Kind of source"
            value={value.source_type}
            onChange={(event) => update({ source_type: event.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {TIMELINE_SOURCE_TYPES.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kept visibly apart from the date the source is being cited FOR. */}
      <div className="rounded-lg bg-muted/60 p-3">
        <DateFields
          label="When was the source itself made?"
          hint="Optional — and not the same thing as when the event happened."
          value={value.published ?? { mode: "calendar", era: "CE", month: null, day: null, unit: "million" }}
          onChange={(next) => update({ published: next })}
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={value.published_is_approximate}
            onChange={(event) => update({ published_is_approximate: event.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          The source&apos;s own date is approximate
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          A chronicle written 80 years after a battle is still evidence — but knowing the gap is part of reading it.
        </p>
      </div>

      <div>
        <Label>Notes about this source</Label>
        <Textarea aria-label="Notes about this source" rows={2} value={value.notes ?? ""} onChange={(event) => update({ notes: event.target.value })} />
      </div>
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
              <Select
                label="Whose chronology is it?"
                value={value.chronology}
                onChange={(next) => update({ chronology: next })}
                options={CHRONOLOGIES}
                placeholder="Not stated"
                hint="The framework the date is calculated in. Naming it isn't agreeing with it."
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
