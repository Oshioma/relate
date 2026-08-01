"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ImagePlus, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";
import { COVER_POSITIONS, type CoverPosition } from "@/lib/cover-position";
import { cn } from "@/lib/utils";

// Edit the cover from the page it appears on. Both of these settings are about
// how the photo *looks in this header* — whether the crop hides the thing that
// matters is only answerable while looking at the result — so making the round
// trip through the admin screen to judge it is the wrong shape. Staff only; a
// visitor never sees the control.
export function CoverQuickEdit({
  communityId,
  coverPosition,
  hasCover = true,
}: {
  communityId: string;
  coverPosition: string | null;
  // With no cover there is nothing to crop and no photo to sit a white icon on,
  // so the control becomes a labelled button on the plain header instead.
  hasCover?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<string>(coverPosition ?? "center");
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Dismiss on Escape or a click outside, the two things a small popover has to
  // get right to not feel like a trap.
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const url = await uploadImage(file, "community-assets", `${communityId}/cover`);
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("communities")
        .update({ cover_image_url: url })
        .eq("id", communityId);
      if (updateError) throw updateError;

      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function pickPosition(value: CoverPosition) {
    const previous = position;
    setPosition(value);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("communities")
      .update({ cover_position: value })
      .eq("id", communityId);

    if (updateError) {
      setPosition(previous);
      setError(updateError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div
      ref={rootRef}
      className={cn(hasCover ? "absolute right-3 top-3 z-10 sm:right-4 sm:top-4" : "relative")}
    >
      {hasCover ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Edit cover image"
          title="Edit cover image"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
          Add cover photo
        </button>
      )}

      {open && hasCover && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4 text-muted-foreground" />
            Replace photo
          </button>

          <div className="mt-2 border-t border-border pt-2">
            <p className="px-2 pb-1.5 text-xs text-muted-foreground">Keep this part of the photo</p>
            {COVER_POSITIONS.map((option) => {
              const isActive = position === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => pickPosition(option.key)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.label}
                  {isActive && <Check className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-2 px-2 text-xs text-danger">{error}</p>}
        </div>
      )}

      {/* Errors surface next to the trigger when there's no popover to put them
          in. The input stays mounted either way — the "Add cover photo" button
          clicks it directly, with no popover in between. */}
      {error && !hasCover && (
        <p className="mt-1 max-w-[14rem] text-right text-xs text-danger">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
