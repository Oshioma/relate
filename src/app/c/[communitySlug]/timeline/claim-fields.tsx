"use client";

import { Trash2 } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TimelineSource } from "@/types/database";
import { DateFields } from "./date-fields";
import { emptySourceDraft, type ClaimDraft, type SourceDraft } from "@/lib/timeline/draft";
import { DATE_PRECISIONS } from "@/lib/timeline/time";
import { CHRONOLOGIES, CONFIDENCE_LEVELS, DATING_METHODS, TIMELINE_SOURCE_TYPES } from "@/lib/timeline/taxonomy";

// One proposed date, and the source behind it.
//
// The source is part of the same panel rather than a later step, because a date
// entered without one is the thing this feature exists to discourage. It is
// still allowed — a child who has found a date but not yet found where it came
// from should be able to save their work — and the wording says plainly what is
// missing rather than blocking them.

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (next: string | null) => void;
  options: readonly { key: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
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
    </div>
  );
}

function SourceFields({ value, onChange }: { value: SourceDraft; onChange: (next: SourceDraft) => void }) {
  function update(patch: Partial<SourceDraft>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/60 p-3.5">
      <div>
        <Label>Source title</Label>
        <Input
          value={value.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder="e.g. The Complete Pyramids"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Author</Label>
          <Input value={value.author ?? ""} onChange={(event) => update({ author: event.target.value })} />
        </div>
        <div>
          <Label>Publisher or publication</Label>
          <Input value={value.publisher ?? ""} onChange={(event) => update({ publisher: event.target.value })} />
        </div>
        <div>
          <Label>Book or document it&apos;s in</Label>
          <Input value={value.work_title ?? ""} onChange={(event) => update({ work_title: event.target.value })} />
        </div>
        <div>
          <Label>Page or reference</Label>
          <Input
            value={value.reference ?? ""}
            onChange={(event) => update({ reference: event.target.value })}
            placeholder="p. 108"
          />
        </div>
        <div>
          <Label>Link</Label>
          <Input
            value={value.url ?? ""}
            onChange={(event) => update({ url: event.target.value })}
            placeholder="https://…"
          />
        </div>
        <div>
          <Label>Kind of source</Label>
          <select
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
        <Textarea rows={2} value={value.notes ?? ""} onChange={(event) => update({ notes: event.target.value })} />
      </div>
    </div>
  );
}

export function ClaimFields({
  value,
  onChange,
  onRemove,
  sources,
  index,
  // The wizard asks for the date on one step and the source on the next, so
  // both halves of this panel can be rendered on their own. Everywhere else
  // ("add another proposed date") shows them together, because by then the
  // reader already knows the two belong to each other.
  show = "all",
  bare = false,
}: {
  value: ClaimDraft;
  onChange: (next: ClaimDraft) => void;
  onRemove?: () => void;
  sources: TimelineSource[];
  index: number;
  show?: "all" | "date" | "source";
  bare?: boolean;
}) {
  function update(patch: Partial<ClaimDraft>) {
    onChange({ ...value, ...patch });
  }

  const sourceMode: "existing" | "new" | "none" = value.source_id ? "existing" : value.new_source ? "new" : "none";
  const showDate = show !== "source";
  const showSource = show !== "date";

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
        <DateFields label="When does this source say it happened?" value={value.start} onChange={(next) => update({ start: next })} />

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={value.end != null}
            onChange={(event) =>
              update({ end: event.target.checked ? { mode: value.start.mode, era: value.start.era ?? "CE", month: null, day: null, unit: value.start.unit } : null })
            }
            className="h-4 w-4 rounded border-border"
          />
          This source gives a span of time, not one date
        </label>

        {value.end != null && (
          <DateFields label="…up to" value={value.end} onChange={(next) => update({ end: next })} />
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>How precise is it?</Label>
            <select
              value={value.date_precision}
              onChange={(event) => update({ date_precision: event.target.value })}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {DATE_PRECISIONS.map((precision) => (
                <option key={precision.key} value={precision.key}>
                  {precision.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              {DATE_PRECISIONS.find((p) => p.key === value.date_precision)?.hint}
            </p>
          </div>
          <div>
            <Label>How it should read</Label>
            <Input
              value={value.display_text}
              onChange={(event) => update({ display_text: event.target.value })}
              placeholder="Leave blank and we'll write it"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use this when the source words it its own way — &ldquo;the third year of Hammurabi&rdquo;.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={value.is_approximate}
            onChange={(event) => update({ is_approximate: event.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          This date is approximate (shows as &ldquo;c.&rdquo; — circa)
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <Select
            label="Dating method"
            value={value.dating_method}
            onChange={(next) => update({ dating_method: next })}
            options={DATING_METHODS}
            placeholder="Not stated"
          />
          <Select
            label="Viewpoint"
            value={value.chronology}
            onChange={(next) => update({ chronology: next })}
            options={CHRONOLOGIES}
            placeholder="Not stated"
          />
          <Select
            label="How well evidenced"
            value={value.confidence}
            onChange={(next) => update({ confidence: next as ClaimDraft["confidence"] })}
            options={CONFIDENCE_LEVELS}
            placeholder="Not stated"
          />
        </div>

        <div>
          <Label>What is this date based on?</Label>
          <Textarea
            rows={2}
            value={value.evidence ?? ""}
            onChange={(event) => update({ evidence: event.target.value })}
            placeholder="Radiocarbon dates from charcoal in the mortar; king lists; an eclipse recorded in the same year…"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            This is what &ldquo;Why this date?&rdquo; shows readers. It is the most useful box on this form.
          </p>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea rows={2} value={value.notes ?? ""} onChange={(event) => update({ notes: event.target.value })} />
        </div>
        </>
        )}

        {/* Source ---------------------------------------------------------- */}
        {showSource && (
        <div className="rounded-lg border border-border bg-muted/30 p-3.5">
          <p className="mb-2 text-sm font-semibold text-foreground">Where does this date come from?</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(
              [
                { key: "existing", label: "A source already here" },
                { key: "new", label: "Add a new source" },
                { key: "none", label: "I don't have one yet" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() =>
                  update({
                    source_id: option.key === "existing" ? sources[0]?.id ?? null : null,
                    new_source: option.key === "new" ? value.new_source ?? emptySourceDraft() : null,
                  })
                }
                aria-pressed={sourceMode === option.key}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  sourceMode === option.key
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {sourceMode === "existing" &&
            (sources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sources in this community yet — add the first one here.
              </p>
            ) : (
              <select
                aria-label="Source"
                value={value.source_id ?? ""}
                onChange={(event) => update({ source_id: event.target.value || null })}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose a source…</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.title}
                    {source.author ? ` — ${source.author}` : ""}
                  </option>
                ))}
              </select>
            ))}

          {sourceMode === "new" && (
            <SourceFields
              value={value.new_source ?? emptySourceDraft()}
              onChange={(next) => update({ new_source: next })}
            />
          )}

          {sourceMode === "none" && (
            <p className="text-sm text-muted-foreground">
              That&apos;s fine — the date will show as having no source behind it, which is worth knowing on its own.
              Add one later when you find it.
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
