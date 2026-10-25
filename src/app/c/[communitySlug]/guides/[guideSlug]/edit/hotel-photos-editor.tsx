"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearFormDraft, readJsonDraft, writeJsonDraft } from "@/lib/use-form-draft";
import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { EMPTY_PHOTO, ListEditor, PHOTO_FIELDS } from "./list-editor";
import { saveHotelPhotos } from "./actions";

type EditableRow = Record<string, unknown>;

// One hotel's photographs on the boutique hotels guide. Same draft behaviour
// as the destination editor: every change is kept as a JSON draft in this
// browser until the save lands, so a refresh never loses an edit.
export function HotelPhotosEditor({
  communitySlug,
  guideSlug,
  hotelKey,
  hotelName,
  photos,
  isOverridden,
}: {
  communitySlug: string;
  guideSlug: string;
  hotelKey: string;
  hotelName: string;
  photos: GuidePhoto[];
  isOverridden: boolean;
}) {
  const draftKey = `editorial-guide:${communitySlug}:${guideSlug}:hotel:${hotelKey}`;
  const [items, setItems] = useState<EditableRow[]>(() => photos as unknown as EditableRow[]);
  const [restored, setRestored] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const loaded = useRef(false);

  useEffect(() => {
    const raw = readJsonDraft(draftKey);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from browser storage after mount
        setItems(JSON.parse(raw) as EditableRow[]);
        setRestored(true);
      } catch {
        clearFormDraft(draftKey);
      }
    }
    loaded.current = true;
  }, [draftKey]);

  function change(next: EditableRow[]) {
    setItems(next);
    if (loaded.current) writeJsonDraft(draftKey, next);
    setMessage(null);
  }

  function persist(payload: EditableRow[], done: string) {
    startTransition(async () => {
      const result = await saveHotelPhotos(communitySlug, guideSlug, hotelKey, payload);
      if ("error" in result) {
        setMessage({ tone: "error", text: result.error });
        return;
      }
      clearFormDraft(draftKey);
      setRestored(false);
      setMessage({ tone: "ok", text: done });
      router.refresh();
    });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    persist(
      items.map((p) => ({ ...p, licenceUrl: p.licenceUrl || null })),
      `${hotelName} photos saved.`
    );
  }

  function reset() {
    if (!window.confirm(`Go back to the built-in photos for ${hotelName}?`)) return;
    setItems([]);
    persist([], `${hotelName} is back to its built-in photos.`);
  }

  return (
    <form onSubmit={save} className="space-y-4">
      {restored && (
        <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
          Restored your unsaved photo edits.{" "}
          <button
            type="button"
            className="font-medium text-accent hover:underline"
            onClick={() => {
              clearFormDraft(draftKey);
              setItems(photos as unknown as EditableRow[]);
              setRestored(false);
            }}
          >
            Discard them
          </button>
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Only add photos you have the right to publish: a free licence (credit it exactly) or the owner&apos;s written permission (say so in the licence field). The first photo is the main image.
      </p>
      <ListEditor
        title={`${hotelName} — photographs`}
        items={items}
        onChange={change}
        fields={PHOTO_FIELDS}
        empty={EMPTY_PHOTO}
        itemLabel={(p) => String(p.caption || p.src || "")}
      />
      {message && (
        <p role="status" className={message.tone === "error" ? "text-sm text-danger" : "text-sm text-accent"}>
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending} className="w-auto">
          <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save photos"}
        </Button>
        {isOverridden && (
          <Button type="button" variant="ghost" onClick={reset} disabled={pending} className="w-auto">
            <RotateCcw className="h-4 w-4" /> Use built-in photos
          </Button>
        )}
      </div>
    </form>
  );
}
