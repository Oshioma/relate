"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2, Plus, X, Pencil, GripVertical, Clock, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { formatDateTime } from "@/lib/utils";
import {
  updateCourseSettings,
  updateCourseCover,
  setCourseStatus,
  deleteCourse,
  createModule,
  renameModule,
  deleteModule,
  moveModule,
  createLesson,
  updateLesson,
  deleteLesson,
  moveLesson,
  setModuleDrip,
  setCertificateEnabled,
  createAnnouncement,
  deleteAnnouncement,
} from "./courses-actions";
import type { CourseDetail, CourseModuleWithLessons } from "@/lib/data/courses";
import type { CourseLesson } from "@/types/database";

// timestamptz ISO -> the local value a datetime-local input expects.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CourseManageView({
  detail,
  communityId,
  communitySlug,
  spaceSlug,
}: {
  detail: CourseDetail;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
}) {
  const { course, modules } = detail;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  function run(action: () => Promise<{ error: string | null }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  async function saveSettings(formData: FormData) {
    setError(null);
    setSettingsSaved(false);
    const result = await updateCourseSettings(undefined, formData);
    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    setSettingsSaved(true);
    router.refresh();
  }

  function handleDeleteCourse() {
    if (!window.confirm(`Delete "${course.title}" and all its content? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCourse(course.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
    });
  }

  const isPublished = course.status === "published";

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Manage course</h1>
          <Badge tone={isPublished ? "accent" : "neutral"}>{isPublished ? "Published" : "Draft"}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPublished ? "Members can see and enrol in this course." : "Only staff can see this course while it's a draft."}
        </p>
      </div>

      {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

      {/* Publish control */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-foreground">{isPublished ? "This course is live" : "Ready to go live?"}</p>
          <p className="text-xs text-muted-foreground">
            {isPublished ? "Unpublish to hide it from members and edit privately." : "Publish when the curriculum is ready for members."}
          </p>
        </div>
        <Button
          type="button"
          variant={isPublished ? "secondary" : "primary"}
          disabled={isPending}
          onClick={() => run(() => setCourseStatus(course.id, isPublished ? "draft" : "published", communitySlug, spaceSlug))}
          className="w-auto"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>

      {/* Settings */}
      <section className="space-y-4 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Details</h2>

        <div className="flex items-center gap-4">
          <ImageUpload
            bucket="community-assets"
            // The community-assets insert policy requires the first path
            // segment to be the community id (and the uploader an admin).
            basePath={`${communityId}/course-covers/${course.id}`}
            currentUrl={course.cover_image_url}
            shape="square"
            size={96}
            label="Cover image"
            onUploaded={async (url) => {
              const result = await updateCourseCover(course.id, url, communitySlug, spaceSlug);
              if (result?.error) setError(result.error);
              else router.refresh();
            }}
          />
          <p className="text-xs text-muted-foreground">A cover image shown on the course card. Optional.</p>
        </div>

        <form action={saveSettings} className="space-y-3">
          <input type="hidden" name="course_id" value={course.id} />
          <input type="hidden" name="community_slug" value={communitySlug} />
          <input type="hidden" name="space_slug" value={spaceSlug} />
          <div>
            <Label htmlFor="course_title">Title</Label>
            <Input id="course_title" name="title" defaultValue={course.title} required />
          </div>
          <div>
            <Label htmlFor="course_summary">Summary</Label>
            <Textarea id="course_summary" name="summary" rows={2} defaultValue={course.summary ?? ""} placeholder="What will learners come away knowing?" />
          </div>
          <div className="flex items-center gap-3">
            <SubmitButton pendingText="Saving…" className="w-auto">
              Save details
            </SubmitButton>
            {settingsSaved && <span className="text-xs text-emerald-600">Saved</span>}
          </div>
        </form>

        <label className="flex items-start justify-between gap-4 border-t border-border pt-4">
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">Completion certificate</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">Learners who finish every lesson can view and print a certificate.</span>
          </span>
          <input
            type="checkbox"
            defaultChecked={course.certificate_enabled}
            disabled={isPending}
            onChange={(e) => run(() => setCertificateEnabled(course.id, e.target.checked, communitySlug, spaceSlug))}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
          />
        </label>
      </section>

      {/* Curriculum */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Curriculum</h2>

        {modules.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No modules yet. Add your first module below to start building the course.
          </p>
        )}

        <div className="space-y-4">
          {modules.map((m, index) => (
            <ModuleEditor
              key={m.module.id}
              data={m}
              index={index}
              total={modules.length}
              communityId={communityId}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              courseId={course.id}
              isPending={isPending}
              run={run}
              setError={setError}
            />
          ))}
        </div>

        <form
          action={() => run(() => createModule(course.id, communityId, newModuleTitle, communitySlug, spaceSlug).then((r) => (r?.error ? r : (setNewModuleTitle(""), r))))}
          className="flex items-end gap-2 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex-1">
            <Label htmlFor="new_module">New module</Label>
            <Input
              id="new_module"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="e.g. Getting started"
            />
          </div>
          <Button type="submit" disabled={isPending || !newModuleTitle.trim()} className="w-auto">
            <Plus className="h-4 w-4" />
            Add module
          </Button>
        </form>
      </section>

      {/* Announcements */}
      <AnnouncementsSection detail={detail} communityId={communityId} communitySlug={communitySlug} spaceSlug={spaceSlug} isPending={isPending} run={run} setError={setError} />

      {/* Danger zone */}
      <section className="rounded-xl border border-danger/30 bg-danger/5 p-4">
        <h2 className="text-sm font-semibold text-foreground">Delete course</h2>
        <p className="mt-1 text-xs text-muted-foreground">Permanently removes the course, its modules, lessons and everyone&apos;s progress.</p>
        <Button type="button" variant="danger" disabled={isPending} onClick={handleDeleteCourse} className="mt-3 w-auto">
          <Trash2 className="h-4 w-4" />
          Delete course
        </Button>
      </section>
    </div>
  );
}

function ModuleEditor({
  data,
  index,
  total,
  communityId,
  communitySlug,
  spaceSlug,
  courseId,
  isPending,
  run,
  setError,
}: {
  data: CourseModuleWithLessons;
  index: number;
  total: number;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  courseId: string;
  isPending: boolean;
  run: (action: () => Promise<{ error: string | null }>) => void;
  setError: (message: string | null) => void;
}) {
  const { module, lessons } = data;
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [addingLesson, setAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [dripEditing, setDripEditing] = useState(false);
  const [dripValue, setDripValue] = useState(toLocalInput(module.available_at));

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        {editingTitle ? (
          <form
            action={() => run(() => renameModule(module.id, title, communitySlug, spaceSlug).then((r) => (r?.error ? r : (setEditingTitle(false), r))))}
            className="flex flex-1 items-center gap-2"
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 py-1" autoFocus />
            <Button type="submit" size="sm" disabled={isPending} className="w-auto">
              Save
            </Button>
            <button type="button" onClick={() => { setTitle(module.title); setEditingTitle(false); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <>
            <p className="flex-1 text-sm font-semibold text-foreground">
              <span className="text-muted-foreground">{index + 1}.</span> {module.title}
            </p>
            <button type="button" title="Rename module" onClick={() => setEditingTitle(true)} className="text-muted-foreground hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Move up"
              disabled={index === 0 || isPending}
              onClick={() => run(() => moveModule(module.id, "up", communitySlug, spaceSlug))}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Move down"
              disabled={index === total - 1 || isPending}
              onClick={() => run(() => moveModule(module.id, "down", communitySlug, spaceSlug))}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Delete module"
              disabled={isPending}
              onClick={() => {
                if (window.confirm(`Delete module "${module.title}" and its lessons?`)) run(() => deleteModule(module.id, communitySlug, spaceSlug));
              }}
              className="text-muted-foreground hover:text-danger disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Drip scheduling */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-4 py-2 text-xs">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        {dripEditing ? (
          <>
            <input
              type="datetime-local"
              value={dripValue}
              onChange={(e) => setDripValue(e.target.value)}
              className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              className="w-auto"
              onClick={() =>
                run(() =>
                  setModuleDrip(module.id, dripValue ? new Date(dripValue).toISOString() : null, communitySlug, spaceSlug).then((r) =>
                    r?.error ? r : (setDripEditing(false), r)
                  )
                )
              }
            >
              Save
            </Button>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => run(() => setModuleDrip(module.id, null, communitySlug, spaceSlug).then((r) => (r?.error ? r : (setDripValue(""), setDripEditing(false), r))))}
            >
              Clear
            </button>
            <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => { setDripValue(toLocalInput(module.available_at)); setDripEditing(false); }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">
              {module.available_at ? `Unlocks ${formatDateTime(module.available_at)}` : "Available immediately"}
            </span>
            <button type="button" className="font-medium text-accent hover:underline" onClick={() => setDripEditing(true)}>
              {module.available_at ? "Change" : "Schedule"}
            </button>
          </>
        )}
      </div>

      <div className="divide-y divide-border">
        {lessons.map((lesson, li) => (
          <div key={lesson.id} className="px-4 py-2.5">
            {editingLessonId === lesson.id ? (
              <LessonForm
                mode="edit"
                lesson={lesson}
                communityId={communityId}
                communitySlug={communitySlug}
                spaceSlug={spaceSlug}
                courseId={courseId}
                moduleId={module.id}
                onDone={() => setEditingLessonId(null)}
                onError={setError}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-muted-foreground">{index + 1}.{li + 1}</span>
                <span className="flex-1 truncate text-sm text-foreground">{lesson.title}</span>
                {lesson.duration_minutes != null && <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>}
                <button type="button" title="Edit lesson" onClick={() => setEditingLessonId(lesson.id)} className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Move up"
                  disabled={li === 0 || isPending}
                  onClick={() => run(() => moveLesson(lesson.id, "up", communitySlug, spaceSlug))}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={li === lessons.length - 1 || isPending}
                  onClick={() => run(() => moveLesson(lesson.id, "down", communitySlug, spaceSlug))}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Delete lesson"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Delete lesson "${lesson.title}"?`)) run(() => deleteLesson(lesson.id, communitySlug, spaceSlug));
                  }}
                  className="text-muted-foreground hover:text-danger disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 py-3">
        {addingLesson ? (
          <LessonForm
            mode="create"
            communityId={communityId}
            communitySlug={communitySlug}
            spaceSlug={spaceSlug}
            courseId={courseId}
            moduleId={module.id}
            onDone={() => setAddingLesson(false)}
            onError={setError}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingLesson(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add lesson
          </button>
        )}
      </div>
    </div>
  );
}

function LessonForm({
  mode,
  lesson,
  communityId,
  communitySlug,
  spaceSlug,
  courseId,
  moduleId,
  onDone,
  onError,
}: {
  mode: "create" | "edit";
  lesson?: CourseLesson;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  courseId: string;
  moduleId: string;
  onDone: () => void;
  onError: (message: string | null) => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    onError(null);
    const result = mode === "create" ? await createLesson(undefined, formData) : await updateLesson(undefined, formData);
    if (result && "error" in result) {
      onError(result.error);
      return;
    }
    formRef.current?.reset();
    onDone();
    router.refresh();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input type="hidden" name="course_id" value={courseId} />
      <input type="hidden" name="module_id" value={moduleId} />
      {mode === "edit" && lesson && <input type="hidden" name="lesson_id" value={lesson.id} />}

      <div>
        <Label htmlFor={`lesson_title_${moduleId}_${lesson?.id ?? "new"}`}>Lesson title</Label>
        <Input id={`lesson_title_${moduleId}_${lesson?.id ?? "new"}`} name="title" defaultValue={lesson?.title ?? ""} placeholder="e.g. Mixing your first wash" required />
      </div>
      <div>
        <Label htmlFor={`lesson_body_${moduleId}_${lesson?.id ?? "new"}`}>Content</Label>
        <Textarea
          id={`lesson_body_${moduleId}_${lesson?.id ?? "new"}`}
          name="body"
          rows={4}
          defaultValue={lesson?.body ?? ""}
          placeholder="Write the lesson here. Links become clickable."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`lesson_video_${moduleId}_${lesson?.id ?? "new"}`}>Video URL (optional)</Label>
          <Input id={`lesson_video_${moduleId}_${lesson?.id ?? "new"}`} name="video_url" type="url" defaultValue={lesson?.video_url ?? ""} placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor={`lesson_duration_${moduleId}_${lesson?.id ?? "new"}`}>Length (minutes, optional)</Label>
          <Input
            id={`lesson_duration_${moduleId}_${lesson?.id ?? "new"}`}
            name="duration_minutes"
            type="number"
            min={0}
            defaultValue={lesson?.duration_minutes ?? ""}
            placeholder="10"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SubmitButton pendingText="Saving…" className="w-auto">
          {mode === "create" ? "Add lesson" : "Save lesson"}
        </SubmitButton>
        <button type="button" onClick={onDone} className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

function AnnouncementsSection({
  detail,
  communityId,
  communitySlug,
  spaceSlug,
  isPending,
  run,
  setError,
}: {
  detail: CourseDetail;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  isPending: boolean;
  run: (action: () => Promise<{ error: string | null }>) => void;
  setError: (message: string | null) => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createAnnouncement(undefined, formData);
    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Megaphone className="h-4 w-4" />
          Announcements
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Shown at the top of the course for everyone who can see it.</p>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <input type="hidden" name="course_id" value={detail.course.id} />
        <input type="hidden" name="community_id" value={communityId} />
        <input type="hidden" name="community_slug" value={communitySlug} />
        <input type="hidden" name="space_slug" value={spaceSlug} />
        <div>
          <Label htmlFor="announcement_title">Title</Label>
          <Input id="announcement_title" name="title" placeholder="e.g. Live Q&A this Friday" required />
        </div>
        <div>
          <Label htmlFor="announcement_body">Message (optional)</Label>
          <Textarea id="announcement_body" name="body" rows={2} placeholder="Add any details…" />
        </div>
        <SubmitButton pendingText="Posting…" className="w-auto">
          Post announcement
        </SubmitButton>
      </form>

      {detail.announcements.length > 0 && (
        <div className="space-y-2">
          {detail.announcements.map(({ announcement }) => (
            <div key={announcement.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                {announcement.body && <p className="mt-0.5 text-sm text-muted-foreground">{announcement.body}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(announcement.created_at)}</p>
              </div>
              <button
                type="button"
                title="Delete announcement"
                disabled={isPending}
                onClick={() => run(() => deleteAnnouncement(announcement.id, communitySlug, spaceSlug))}
                className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
