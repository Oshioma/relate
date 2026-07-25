"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "./courses-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewCourseForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  onDone?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createCourse(undefined, formData);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
    onDone?.();
    // A new course starts as a draft — take the author straight to authoring.
    router.push(`/c/${communitySlug}/spaces/${spaceSlug}/courses/${result.courseId}/manage`);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="course_title">Course title</Label>
        <Input id="course_title" name="title" placeholder="Intro to Watercolour" required />
      </div>

      <div>
        <Label htmlFor="course_summary">Summary (optional)</Label>
        <Textarea id="course_summary" name="summary" rows={2} placeholder="What will learners come away knowing?" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Creating…" className="w-auto">
        Create course
      </SubmitButton>
    </form>
  );
}
