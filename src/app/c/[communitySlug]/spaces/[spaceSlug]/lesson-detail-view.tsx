"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, Trash2, ImagePlus, RefreshCw, Pencil, Eye, EyeOff, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgeBadge, LessonDocument } from "./lesson-document";
import { LessonEditor } from "./lesson-editor";
import { LessonClassification } from "./lesson-classification";
import {
  deleteLesson,
  removeLessonImage,
  setLessonVisibility,
  toggleLessonSave,
  updateLesson,
  type LessonActionState,
} from "./lessons-actions";
import { printLesson } from "./print-lesson";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  normaliseSubject,
  providerName,
  SUBJECT_ICONS,
  type LessonRow,
  type StoredLesson,
} from "@/lib/school/lesson-types";

export function LessonDetailView({
  lesson,
  communitySlug,
  spaceSlug,
  canEdit,
  canManageVisibility,
  canSave,
  writerConfigured,
}: {
  lesson: LessonRow;
  communitySlug: string;
  spaceSlug: string;
  canEdit: boolean;
  // Its author, or staff. Publishing a lesson is the author's call, and staff
  // answer for what is in their space.
  canManageVisibility: boolean;
  // Signed-in members only. A save is private to whoever made it, so there is
  // nowhere for a guest to put one.
  canSave: boolean;
  writerConfigured: boolean;
}) {
  const router = useRouter();
  const [deleteState, deleteAction, deleting] = useActionState<LessonActionState, FormData>(deleteLesson, undefined);
  const [imageState, imageAction] = useActionState<LessonActionState, FormData>(removeLessonImage, undefined);
  const [editState, editAction, savingEdit] = useActionState<LessonActionState, FormData>(
    updateLesson,
    undefined
  );
  const [visibilityState, visibilityAction, savingVisibility] = useActionState<
    LessonActionState,
    FormData
  >(setLessonVisibility, undefined);
  const [saveState, saveAction, savingSave] = useActionState<LessonActionState, FormData>(
    toggleLessonSave,
    undefined
  );
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<"images" | "rewrite" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const subject = normaliseSubject(lesson.subject);
  const hasPictures = (lesson.lesson.sections ?? []).some((section) => section.image);

  // Looks for pictures on a lesson whose image phase ran out of time inside
  // the generation budget. Model-free, so it isn't metered.
  async function findPictures() {
    setBusy("images");
    setError(null);
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/images`, { method: "POST" });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "Could not find pictures.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the picture search.");
    } finally {
      setBusy(null);
    }
  }

  // Writes the same source material again for another age band, as a NEW
  // lesson — the point is usually to have one for each year group.
  async function rewriteFor(ageBand: string) {
    setBusy("rewrite");
    setError(null);
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageBand }),
      });

      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Could not rewrite the lesson.");
        return;
      }

      // Same NDJSON stream as the composer. Nothing here needs the progress
      // events — the only outcome that matters is whether it errored.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as { type: string; error?: string };
            if (event.type === "error" && event.error) setError(event.error);
          } catch {
            // A malformed line is not worth failing the run over.
          }
        }
      }

      router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
      router.refresh();
    } catch {
      setError("The connection dropped while rewriting.");
    } finally {
      setBusy(null);
    }
  }

  const actionError =
    deleteState?.error ??
    imageState?.error ??
    editState?.error ??
    visibilityState?.error ??
    saveState?.error ??
    error;

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span aria-hidden>{SUBJECT_ICONS[subject]}</span>
              {subject}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {lesson.title || "Untitled lesson"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">by {providerName(lesson)}</p>
            {/* How long it takes and what kind of thing it is — the two things
                someone deciding whether to do it this afternoon needs. */}
            <LessonClassification
              lesson={lesson}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canEdit={canEdit}
            />
          </div>
          <AgeBadge band={lesson.age_band} />
        </div>

        {lesson.lesson.cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={lesson.lesson.cover.url}
            alt=""
            className="mt-4 max-h-64 w-full rounded-lg bg-muted object-cover"
          />
        ) : (
          // No cover: the subject's icon rather than a gap. Deliberately not the
          // first section's picture — that one appears in its own section a
          // little further down, and showing it twice reads as a mistake.
          <div
            aria-hidden
            className="mt-4 flex h-28 w-full items-center justify-center rounded-lg border border-border/60 bg-muted text-4xl"
          >
            {SUBJECT_ICONS[subject]}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button size="sm" variant="secondary" onClick={() => printLesson(lesson)}>
            <Printer className="h-4 w-4" />
            Print
          </Button>

          {canSave && (
            <form action={saveAction} className="contents">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <input type="hidden" name="community_slug" value={communitySlug} />
              <input type="hidden" name="space_slug" value={spaceSlug} />
              <input type="hidden" name="saved" value={lesson.saved ? "1" : "0"} />
              <Button
                size="sm"
                variant="secondary"
                type="submit"
                disabled={savingSave}
                aria-pressed={Boolean(lesson.saved)}
              >
                <Bookmark className={cn("h-4 w-4", lesson.saved && "fill-accent text-accent")} />
                {lesson.saved ? "Saved" : "Save"}
              </Button>
            </form>
          )}

          {canManageVisibility && (
            <form action={visibilityAction} className="contents">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <input type="hidden" name="community_slug" value={communitySlug} />
              <input type="hidden" name="space_slug" value={spaceSlug} />
              <input type="hidden" name="is_public" value={lesson.is_public ? "0" : "1"} />
              <Button size="sm" variant="secondary" type="submit" disabled={savingVisibility}>
                {lesson.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {lesson.is_public ? "Everyone can see this" : "Only you and staff"}
              </Button>
            </form>
          )}

          {canEdit && !editing && (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}

          {canEdit && !hasPictures && (
            <Button size="sm" variant="secondary" onClick={findPictures} disabled={busy !== null}>
              <ImagePlus className="h-4 w-4" />
              {busy === "images" ? "Looking…" : "Find pictures"}
            </Button>
          )}

          {canEdit && (
            <form action={deleteAction} className="contents">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <input type="hidden" name="community_slug" value={communitySlug} />
              <input type="hidden" name="space_slug" value={spaceSlug} />
              {confirmingDelete ? (
                <>
                  <Button size="sm" variant="danger" type="submit" disabled={deleting}>
                    {deleting ? "Deleting…" : "Delete for good"}
                  </Button>
                  <Button size="sm" variant="ghost" type="button" onClick={() => setConfirmingDelete(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" type="button" onClick={() => setConfirmingDelete(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </form>
          )}
        </div>

        {canEdit && writerConfigured && lesson.source_text && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Write this same material for another age — saved as a separate lesson, so you can keep both.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AGE_BANDS.filter((entry) => entry.key !== lesson.age_band).map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => rewriteFor(entry.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-card px-2.5 py-1.5",
                    "text-xs font-medium text-muted-foreground transition-colors",
                    "hover:border-muted-foreground/40 disabled:opacity-50"
                  )}
                >
                  <RefreshCw className="h-3 w-3" />
                  {entry.label}
                </button>
              ))}
            </div>
            {busy === "rewrite" && (
              <p className="mt-2 text-xs text-muted-foreground">Writing it again — this takes a minute or two…</p>
            )}
          </div>
        )}

        {actionError && (
          <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {actionError}
          </p>
        )}
      </Card>

      <Card className="p-5 sm:p-6">
        {editing ? (
          <LessonEditor
            lesson={lesson.lesson}
            saving={savingEdit}
            onCancel={() => setEditing(false)}
            onSave={(next: StoredLesson) => {
              const formData = new FormData();
              formData.set("lesson_id", lesson.id);
              formData.set("community_slug", communitySlug);
              formData.set("space_slug", spaceSlug);
              formData.set("lesson", JSON.stringify(next));
              editAction(formData);
              // The action revalidates this page; closing here swaps the saved
              // document back in as soon as it re-renders.
              setEditing(false);
            }}
          />
        ) : (
        <LessonDocument
          lesson={lesson.lesson}
          onRemoveImage={
            canEdit
              ? (sectionIndex) => {
                  const formData = new FormData();
                  formData.set("lesson_id", lesson.id);
                  formData.set("community_slug", communitySlug);
                  formData.set("space_slug", spaceSlug);
                  formData.set("section_index", String(sectionIndex));
                  imageAction(formData);
                }
              : undefined
          }
        />
        )}
      </Card>
    </div>
  );
}
