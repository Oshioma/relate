"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Trash2,
  ImagePlus,
  Pencil,
  Eye,
  EyeOff,
  Bookmark,
  Telescope,
  FileSearch,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgeBadge, LessonDocument } from "./lesson-document";
import { LessonEditor } from "./lesson-editor";
import { LessonClassification } from "./lesson-classification";
import { LessonRulesPanel } from "./lesson-rules-panel";
import { LessonVideo } from "./lesson-video";
import {
  deleteLesson,
  removeLessonImage,
  setLessonSourcePublic,
  setLessonVisibility,
  toggleLessonSave,
  updateLesson,
  type LessonActionState,
} from "./lessons-actions";
import { printLesson } from "./print-lesson";
import { cn } from "@/lib/utils";
import {
  ageBandLabel,
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
  sourceRules,
  rulesAreOriginal,
  level,
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
  // The prompt this lesson was written under, rebuilt from the row. Null for
  // anyone who isn't staff — the page never computes it for them, so it is
  // absent from the payload rather than hidden in it.
  sourceRules: string | null;
  // Whether that prompt was recorded at generation time or rebuilt now.
  rulesAreOriginal: boolean;
  // Where this lesson sits on a page of several levels. Omitted when it is the
  // only one. Only the first level shows the video or cover picture: the rest
  // are the same material further down the same page.
  level?: { index: number; count: number; previousBand: string | null };
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
  const [sourcePublicState, sourcePublicAction, savingSourcePublic] = useActionState<
    LessonActionState,
    FormData
  >(setLessonSourcePublic, undefined);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<"images" | null>(null);
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

  const actionError =
    deleteState?.error ??
    imageState?.error ??
    editState?.error ??
    visibilityState?.error ??
    saveState?.error ??
    sourcePublicState?.error ??
    error;

  const continues = Boolean(level && level.index > 0);

  return (
    <div id={`level-${lesson.id}`} className="scroll-mt-6 space-y-5">
      {level && level.count > 1 && (
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>
            Level {level.index + 1} of {level.count}
          </span>
          <span aria-hidden>&middot;</span>
          <span>{ageBandLabel(lesson.age_band)}</span>
          {level.previousBand && (
            <span className="font-normal normal-case tracking-normal">
              — picks up where {ageBandLabel(level.previousBand)} left off
            </span>
          )}
        </p>
      )}
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
            {/* Where the material came from, when it was read in from a link.
                Shown to staff always, and to everyone once staff open the
                source — attribution is the least secret part of a lesson, but
                it is still part of the source, so it moves with it. */}
            {lesson.source_url && (canEdit || lesson.source_public) && (
              <p className="mt-1 text-xs text-muted-foreground">
                Source:{" "}
                <a
                  href={lesson.source_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  {lesson.source_title || new URL(lesson.source_url).hostname}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            )}
            {/* How long it takes and what kind of thing it is — the two things
                someone deciding whether to do it this afternoon needs. */}
            <LessonClassification
              lesson={lesson}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canEdit={canEdit}
            />
          </div>
          <span className="flex shrink-0 flex-col items-end gap-1.5">
            <AgeBadge band={lesson.age_band} />
            {/* The one badge that is a warning rather than a label. Every other
                lesson can be held against the material it was built from; this
                one cannot, because most of it was not in that material. */}
            {lesson.beyond_source && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent"
                title="Written in go-deeper mode: it contains material the source did not, so it can't be checked against the source."
              >
                <Telescope className="h-3 w-3" />
                Beyond the source
              </span>
            )}
          </span>
        </div>

        {/* A lesson written from a video leads with the video: it is the thing
            to watch before reading, and a better picture than any cover. */}
        {continues ? null : lesson.video_url ? (
          <LessonVideo url={lesson.video_url} className="mt-4" />
        ) : lesson.lesson.cover ? (
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

          {/* Separate from the lesson's own public/private control above: that
              one decides who sees the LESSON, this one decides who sees what
              it was made from. A community that wants to show its working can;
              the default is that it doesn't. */}
          {canEdit && (lesson.source_text?.trim() || lesson.source_url) && (
            <form action={sourcePublicAction} className="contents">
              <input type="hidden" name="lesson_id" value={lesson.id} />
              <input type="hidden" name="community_slug" value={communitySlug} />
              <input type="hidden" name="space_slug" value={spaceSlug} />
              <input
                type="hidden"
                name="source_public"
                value={lesson.source_public ? "0" : "1"}
              />
              <Button size="sm" variant="secondary" type="submit" disabled={savingSourcePublic}>
                <FileSearch className="h-4 w-4" />
                {lesson.source_public ? "Source is public" : "Source is private"}
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

        {/* Staff always (they get the rules too); everyone else only once the
            author has published the material — and for them the server has
            already stripped it from this row if they haven't, so an empty
            source_text here means there is genuinely nothing to show. */}
        {(sourceRules || lesson.source_text?.trim()) && (
          <LessonRulesPanel
            rules={sourceRules}
            rulesAreOriginal={rulesAreOriginal}
            sourceText={lesson.source_text ?? ""}
            ageBand={lesson.age_band}
            beyondSource={lesson.beyond_source}
          />
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
