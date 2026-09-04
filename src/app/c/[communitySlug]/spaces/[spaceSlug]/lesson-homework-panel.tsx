"use client";

import { useActionState, useState } from "react";
import { Backpack, Check, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setHomework, deleteHomework, toggleHomeworkDone, type LessonActionState } from "./lessons-actions";
import { printLesson } from "./print-lesson";
import type { HomeworkWithProgress } from "@/lib/data/lessons";
import { formatDueDate, isOverdue, type LessonRow } from "@/lib/school/lesson-types";

export function LessonHomeworkPanel({
  lesson,
  homework,
  communitySlug,
  spaceSlug,
  canManage,
  isMember,
}: {
  lesson: LessonRow;
  homework: HomeworkWithProgress | null;
  communitySlug: string;
  spaceSlug: string;
  // Staff: can send home, and see how many families have ticked it off.
  canManage: boolean;
  // Members can tick their own. Guests reading a public library cannot.
  isMember: boolean;
}) {
  const [setState, setAction, setting] = useActionState<LessonActionState, FormData>(setHomework, undefined);
  const [deleteState, deleteActionFn] = useActionState<LessonActionState, FormData>(deleteHomework, undefined);
  const [toggleState, toggleAction, toggling] = useActionState<LessonActionState, FormData>(
    toggleHomeworkDone,
    undefined
  );
  const [composing, setComposing] = useState(false);

  const error = setState?.error ?? deleteState?.error ?? toggleState?.error;

  // Nothing set, and nobody here can set it.
  if (!homework && !canManage) return null;

  const hidden = (
    <>
      <input type="hidden" name="lesson_id" value={lesson.id} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
    </>
  );

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
          <Backpack className="h-4 w-4 text-muted-foreground" />
          Homework
        </h2>
        {homework?.due_on && (
          <span
            className={
              isOverdue(homework.due_on)
                ? "text-xs font-semibold text-danger"
                : "text-xs font-semibold text-foreground"
            }
          >
            Due {formatDueDate(homework.due_on)}
          </span>
        )}
      </div>

      {homework ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {homework.note || "Read through this lesson together."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                printLesson(lesson, {
                  audience: "home",
                  homework: { note: homework.note, due_on: homework.due_on },
                })
              }
            >
              <Printer className="h-4 w-4" />
              Print the pack
            </Button>

            {isMember && (
              <form action={toggleAction}>
                {hidden}
                <input type="hidden" name="homework_id" value={homework.id} />
                <input type="hidden" name="done" value={homework.completedByViewer ? "1" : "0"} />
                <Button
                  size="sm"
                  type="submit"
                  variant={homework.completedByViewer ? "secondary" : "primary"}
                  disabled={toggling}
                >
                  <Check className="h-4 w-4" />
                  {homework.completedByViewer ? "Done — undo" : "Mark as done"}
                </Button>
              </form>
            )}

            {canManage && (
              <form action={deleteActionFn}>
                {hidden}
                <input type="hidden" name="homework_id" value={homework.id} />
                <Button size="sm" type="submit" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Un-send
                </Button>
              </form>
            )}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {canManage
              ? `${homework.completedCount} ${homework.completedCount === 1 ? "family has" : "families have"} marked this done.`
              : "The printed pack leaves the answers out."}
          </p>
        </>
      ) : composing ? (
        <form action={setAction} className="mt-3 space-y-3">
          {hidden}
          <div>
            <label htmlFor="homework-note" className="text-sm font-medium text-foreground">
              What should they do?
            </label>
            <textarea
              id="homework-note"
              name="note"
              rows={3}
              placeholder="Read section 2 together and try the activity."
              className="mt-1 w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="homework-due" className="text-sm font-medium text-foreground">
              Due <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="homework-due"
              name="due_on"
              type="date"
              className="mt-1 block rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" type="submit" disabled={setting}>
              {setting ? "Sending…" : "Send home"}
            </Button>
            <Button size="sm" type="button" variant="ghost" onClick={() => setComposing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Send this lesson home as a printable pack. Parents get the material, the activity and the questions —
            without the answers.
          </p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={() => setComposing(true)}>
            <Backpack className="h-4 w-4" />
            Send home
          </Button>
        </>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
