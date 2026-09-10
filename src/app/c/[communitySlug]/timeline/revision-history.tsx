"use client";

import { useState } from "react";
import { History, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { TimelineRevision } from "@/types/database";
import { loadEventRevisions } from "./actions";
import { dateUnitLabel } from "@/lib/timeline/time";
import { chronologyLabel, datingMethodLabel, eventTypeLabel, sourceTypeLabel, timelineCategoryLabel } from "@/lib/timeline/taxonomy";

// What has been changed on this event, and by whom.
//
// Contested chronology is the point of this feature, which makes a silent edit
// to a date claim the single change that most needs to be visible. The rows are
// written by database triggers rather than by the application, so an edit
// cannot reach the row without reaching the record of it.
//
// The trigger stores a column-level diff and nothing else — turning that into
// English is this component's job, because SQL is the wrong place to write
// sentences and the wording will change more often than the schema.

type Revision = TimelineRevision & { actor: { username: string | null; full_name: string | null } | null };

// Columns nobody needs to read about. Ids and foreign keys change only when a
// row is created, and a history that leads with "community_id was set" buries
// the edit that matters.
const NOISE = new Set(["id", "event_id", "community_id", "created_by", "slug", "reviewed_by", "reviewed_at"]);

const FIELD_LABELS: Record<string, string> = {
  title: "the title",
  summary: "the one-line summary",
  description: "the description",
  category: "the category",
  subcategory: "the subcategory",
  event_type: "what kind of record this is",
  event_type_note: "the note about what kind of record this is",
  tags: "the tags",
  people: "the people",
  civilisations: "the civilisations",
  location_name: "the location",
  image_url: "the picture",
  status: "the moderation status",
  start_year: "the proposed date",
  start_month: "the proposed month",
  start_day: "the proposed day",
  end_year: "the end of the range",
  date_precision: "the precision",
  precision_decimals: "the decimal places",
  is_approximate: "whether the date is approximate",
  uncertainty_plus: "the ± figure",
  uncertainty_minus: "the ± figure",
  original_date_text: "the source's own wording",
  dating_method: "the dating method",
  chronology: "the chronology",
  evidence: "the evidence",
  notes: "the notes",
  source_id: "the source",
};

function readable(field: string, raw: unknown): string {
  if (raw === null || raw === undefined || raw === "null") return "nothing";
  if (Array.isArray(raw)) return raw.length ? raw.join(", ") : "nothing";
  if (typeof raw === "boolean") return raw ? "yes" : "no";

  const value = String(raw);
  if (!value.trim()) return "nothing";

  switch (field) {
    case "date_precision":
      return dateUnitLabel(value);
    case "dating_method":
      return datingMethodLabel(value);
    case "chronology":
      return chronologyLabel(value);
    case "category":
      return timelineCategoryLabel(value);
    case "event_type":
      return eventTypeLabel(value) ?? value;
    case "source_type":
      return sourceTypeLabel(value);
    case "source_id":
      // The id itself says nothing to a reader; that it changed does.
      return "a different source";
    default:
      return value.length > 90 ? `${value.slice(0, 90)}…` : value;
  }
}

function actorName(revision: Revision): string {
  return revision.actor?.full_name || revision.actor?.username || "Somebody";
}

function describe(revision: Revision): string[] {
  const fields = Object.entries(revision.changes).filter(([field]) => !NOISE.has(field));

  if (revision.action === "created") {
    return [revision.entity === "event" ? "added this event" : "added another proposed date"];
  }
  if (revision.action === "deleted") {
    return ["removed a proposed date"];
  }

  return fields.map(([field, change]) => {
    const label = FIELD_LABELS[field] ?? field.replace(/_/g, " ");
    const from = readable(field, change.from);
    const to = readable(field, change.to);
    if (from === "nothing") return `set ${label} to ${to}`;
    if (to === "nothing") return `cleared ${label}`;
    return `changed ${label} from ${from} to ${to}`;
  });
}

export function RevisionHistory({ communitySlug, eventId }: { communitySlug: string; eventId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revisions, setRevisions] = useState<Revision[] | null>(null);

  async function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (revisions) return;
    setLoading(true);
    try {
      setRevisions(await loadEventRevisions(communitySlug, eventId));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <History className="h-4 w-4" />
        {open ? "Hide history" : "View history"}
      </button>

      {open && (
        <div className="mt-3">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          )}

          {!loading && revisions && revisions.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing has been changed since this event was added.</p>
          )}

          {!loading && revisions && revisions.length > 0 && (
            <ol className="space-y-2.5">
              {revisions.map((revision) => (
                <li key={revision.id} className="border-l-2 border-border pl-3.5 text-sm">
                  <p className="text-xs text-muted-foreground">{formatDateTime(revision.created_at)}</p>
                  {describe(revision).map((line, index) => (
                    <p key={index} className="text-foreground">
                      <span className="font-medium">{actorName(revision)}</span> {line}.
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
