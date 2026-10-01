"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

// "Save it now" for a lesson that was written but couldn't be saved. The server
// parked the whole lesson; this moves it into the library as written, with no
// second model call. Shown under the error that explains what happened.
export function SaveUnsavedLesson({
  unsavedId,
  onSaved,
}: {
  unsavedId: string;
  onSaved: (lessonId: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/lessons/unsaved/${unsavedId}`, { method: "POST" });
      const body = (await response.json().catch(() => null)) as
        | { row?: { id?: string }; error?: string }
        | null;
      if (!response.ok || !body?.row?.id) {
        setError(body?.error ?? "It still couldn't be saved. Try again in a minute.");
        return;
      }
      onSaved(body.row.id);
    } catch {
      setError("Couldn't reach the server. Try again in a minute.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <Button size="sm" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : "Save it now"}
      </Button>
      <span className="text-xs text-muted-foreground">No need to write it again: it&apos;s kept.</span>
      {error && <span className="w-full text-xs text-danger">{error}</span>}
    </div>
  );
}
