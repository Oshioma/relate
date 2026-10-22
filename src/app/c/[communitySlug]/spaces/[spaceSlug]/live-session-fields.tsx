"use client";

import { useRef } from "react";
import { Input, Textarea, Label } from "@/components/ui/input";
import { UploadButton } from "@/components/ui/upload-button";

// The fields a live session carries, shared by the schedule/go-live composer
// and the edit form: title, optional description and cover image, and — when
// scheduling — a start and optional end. Uncontrolled (defaultValue), so the
// form's useFormDraft can save and restore them across a refresh.
export function LiveSessionFields({
  idPrefix,
  spaceName,
  showTimes,
  defaults,
}: {
  idPrefix: string;
  spaceName: string;
  // Start / end pickers: shown when scheduling or editing, not for "Start now".
  showTimes: boolean;
  defaults?: {
    title?: string;
    description?: string | null;
    imageUrl?: string | null;
    scheduledStart?: string | null;
    scheduledEnd?: string | null;
  };
}) {
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={`${idPrefix}_title`}>Title</Label>
        <Input id={`${idPrefix}_title`} name="title" defaultValue={defaults?.title ?? ""} placeholder={`e.g. ${spaceName} — welcome call`} />
      </div>

      {showTimes && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${idPrefix}_start`}>Starts</Label>
            <Input
              id={`${idPrefix}_start`}
              name="scheduled_start"
              type="datetime-local"
              defaultValue={toLocalInputValue(defaults?.scheduledStart)}
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}_end`}>Ends (optional)</Label>
            <Input
              id={`${idPrefix}_end`}
              name="scheduled_end"
              type="datetime-local"
              defaultValue={toLocalInputValue(defaults?.scheduledEnd)}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor={`${idPrefix}_description`}>Description (optional)</Label>
        <Textarea
          id={`${idPrefix}_description`}
          name="description"
          rows={3}
          maxLength={2000}
          defaultValue={defaults?.description ?? ""}
          placeholder="What's this session about?"
        />
      </div>

      <div>
        <Label htmlFor={`${idPrefix}_image`}>Cover image (optional)</Label>
        <div className="flex items-start gap-2">
          <Input
            ref={imageRef}
            id={`${idPrefix}_image`}
            name="image_url"
            type="url"
            defaultValue={defaults?.imageUrl ?? ""}
            placeholder="https://… or upload an image"
            className="flex-1"
          />
          <UploadButton
            label="Upload"
            className="shrink-0"
            onUploaded={(url) => {
              const input = imageRef.current;
              if (!input) return;
              input.value = url;
              // Setting .value doesn't fire input events; this lets the draft save it.
              input.dispatchEvent(new Event("input", { bubbles: true }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

// A stored timestamp as a datetime-local value in the viewer's own time zone
// ("2026-10-20T11:00"), or "" when there is none.
export function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// A datetime-local value, read in the browser's time zone, as a full ISO
// timestamp for the server ("" stays ""). The server runs in UTC, so sending
// the bare local value would shift the time by the host's UTC offset.
export function localInputToIso(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}
