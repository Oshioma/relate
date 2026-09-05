"use client";

import { useActionState, useState } from "react";
import { Check, Clock, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateLessonClassification, type LessonActionState } from "./lessons-actions";
import { cn } from "@/lib/utils";
import {
  DISCOVERY_CATEGORIES,
  cleanDiscoveryCategories,
  discoveryMeta,
  formatDuration,
  primaryCategory,
  secondaryCategories,
  type LessonRow,
} from "@/lib/school/lesson-types";

// How a lesson is filed for discovery: what kind of afternoon it is, and how
// long it takes.
//
// The writer suggests both, but the person who has actually taught the lesson
// knows better than the model whether "Grow Your Own Food" is really a cooking
// lesson and whether it fits in half an hour. So staff can override, and the
// override sticks — nothing re-classifies a lesson behind their back.

export function LessonClassification({
  lesson,
  communitySlug,
  spaceSlug,
  canEdit,
}: {
  lesson: LessonRow;
  communitySlug: string;
  spaceSlug: string;
  // Staff only, same as every other edit on a lesson.
  canEdit: boolean;
}) {
  const [state, action, saving] = useActionState<LessonActionState, FormData>(
    updateLessonClassification,
    undefined
  );
  const [editing, setEditing] = useState(false);

  const primary = primaryCategory(lesson);
  const secondary = secondaryCategories(lesson);

  const ordered = cleanDiscoveryCategories(lesson.discovery_categories);
  const categories = ordered
    .map(discoveryMeta)
    .filter((c): c is NonNullable<ReturnType<typeof discoveryMeta>> => Boolean(c));
  const duration = formatDuration(lesson.duration_minutes);

  if (!editing) {
    // Nothing filed and nobody who can file it: no empty row on the page.
    if (categories.length === 0 && !duration && !canEdit) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {duration && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            {duration}
          </span>
        )}
        {/* The first is the primary — what this lesson is mainly doing — so it
            carries the weight and the rest sit behind it. */}
        {categories.map((category, index) => (
          <span
            key={category.key}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              index === 0
                ? "bg-accent text-accent-foreground"
                : "bg-accent-soft text-accent"
            )}
            title={index === 0 ? "Mainly this" : "Also this"}
          >
            <span aria-hidden>{category.icon}</span>
            {category.label}
          </span>
        ))}
        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Tags className="h-3 w-3" />
            {categories.length === 0 && !duration ? "Add tags & time" : "Edit"}
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        action(formData);
        // The action revalidates this page; closing now swaps the saved values
        // back in as soon as it re-renders.
        setEditing(false);
      }}
      className="mt-3 rounded-xl border border-border bg-muted/30 p-4"
    >
      <input type="hidden" name="lesson_id" value={lesson.id} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      {/* Primary first, then secondaries, because that is the order the value
          is stored in — the array's first element IS the primary category.
          Two controls rather than one ranked list: "what is this mainly" is a
          different question from "what else is in it", and a staff member
          answering the first one should not have to think about ordering. */}
      <fieldset>
        <legend className="text-xs font-medium text-muted-foreground">
          What are you mainly doing? Pick one.
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DISCOVERY_CATEGORIES.map((category) => (
            <label key={category.key} className="cursor-pointer" title={category.blurb}>
              <input
                type="radio"
                name="primary"
                value={category.key}
                defaultChecked={primary === category.key}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium",
                  "text-muted-foreground ring-1 ring-border/60 transition-colors",
                  "peer-checked:bg-accent peer-checked:text-accent-foreground peer-checked:ring-accent",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                )}
              >
                <span aria-hidden>{category.icon}</span>
                {category.label}
              </span>
            </label>
          ))}
          {/* Nothing central is a real answer. A maths lesson where you write
              down your working is not a writing lesson, and forcing one of the
              eight onto it is how the library filled up with bad tags. */}
          <label className="cursor-pointer" title="None of these is central to this lesson">
            <input
              type="radio"
              name="primary"
              value=""
              defaultChecked={!primary}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium",
                "text-muted-foreground ring-1 ring-border/60 transition-colors",
                "peer-checked:bg-muted peer-checked:text-foreground peer-checked:ring-muted-foreground/40",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
              )}
            >
              None of these
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-muted-foreground">
          Anything else in it? Up to two more — leave blank if not.
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DISCOVERY_CATEGORIES.map((category) => (
            <label key={category.key} className="cursor-pointer" title={category.blurb}>
              <input
                type="checkbox"
                name="secondary"
                value={category.key}
                defaultChecked={secondary.includes(category.key)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium",
                  "text-muted-foreground ring-1 ring-border/60 transition-colors",
                  "peer-checked:bg-accent-soft peer-checked:text-accent peer-checked:ring-accent/40",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                )}
              >
                <span aria-hidden>{category.icon}</span>
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
        Roughly how long does it take?
        <span className="inline-flex items-center gap-1.5">
          <input
            type="number"
            name="duration_minutes"
            min={5}
            max={480}
            step={5}
            defaultValue={lesson.duration_minutes ?? ""}
            placeholder="—"
            className="w-20 rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          minutes
        </span>
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" type="submit" disabled={saving}>
          <Check className="h-4 w-4" />
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button size="sm" variant="ghost" type="button" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>

      {state?.error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
