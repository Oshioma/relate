"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { IMAGE_ACCEPTED_TYPES, uploadImage, validateImageFile } from "@/lib/upload-image";
import { updateCommunityTestimonials, type CommunityTestimonialsState } from "./actions";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { MAX_TESTIMONIALS, MAX_TESTIMONIAL_NAME, MAX_TESTIMONIAL_QUOTE, readTestimonials } from "@/lib/testimonials";
import type { Community, CommunityTestimonial } from "@/types/database";

// The quotes from members on the signed-out landing page. The rows live in
// React state and travel as one JSON hidden input, which is also what the
// draft saves — so added, removed and reordered rows survive a refresh too.
// A member a testimonial can be linked to, for their own profile photo.
export type TestimonialMemberOption = { id: string; name: string; avatarUrl: string | null };

export function CommunityTestimonialsForm({
  community,
  members,
}: {
  community: Community;
  members: TestimonialMemberOption[];
}) {
  const [state, formAction] = useActionState<CommunityTestimonialsState, FormData>(updateCommunityTestimonials, undefined);
  const [rows, setRows] = useState<CommunityTestimonial[]>(() => readTestimonials(community.testimonials));
  const formRef = useRef<HTMLFormElement>(null);
  // Only save a draft once the admin has changed something, so an untouched
  // form never pins an old copy over a newer save.
  const touched = useRef(false);

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    const raw = values.testimonials;
    if (typeof raw !== "string") return;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setRows(
        parsed.map((t) => ({
          quote: typeof t?.quote === "string" ? t.quote : "",
          name: typeof t?.name === "string" ? t.name : "",
          avatarUrl: typeof t?.avatarUrl === "string" ? t.avatarUrl : null,
          memberId: typeof t?.memberId === "string" && t.memberId ? t.memberId : null,
        }))
      );
    } catch {
      // A broken draft: keep what's saved.
    }
  }, []);
  const { clear: clearDraft, saveNow } = useFormDraftRef(formRef, `community-testimonials:${community.id}`, { onRestore });

  useEffect(() => {
    if (touched.current) saveNow();
  }, [rows, saveNow]);

  useEffect(() => {
    if (state && "ok" in state) {
      touched.current = false;
      clearDraft();
    }
  }, [state, clearDraft]);

  function change(next: CommunityTestimonial[]) {
    touched.current = true;
    setRows(next);
  }
  function update(i: number, patch: Partial<CommunityTestimonial>) {
    change(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }
  function move(i: number, by: -1 | 1) {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />
      <input type="hidden" name="testimonials" value={JSON.stringify(rows)} data-draft />

      <p className="text-sm text-muted-foreground">
        Quotes from members, shown on the page visitors see before they sign in. Leave the list empty to hide the
        section.
      </p>

      {rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <div>
            <Label htmlFor={`testimonial_quote_${i}`}>Testimonial {i + 1}</Label>
            <Textarea
              id={`testimonial_quote_${i}`}
              rows={4}
              maxLength={MAX_TESTIMONIAL_QUOTE}
              value={row.quote}
              onChange={(e) => update(i, { quote: e.target.value })}
              placeholder="What they said, in their own words"
            />
          </div>
          <div>
            <Label htmlFor={`testimonial_name_${i}`}>Name</Label>
            <Input
              id={`testimonial_name_${i}`}
              maxLength={MAX_TESTIMONIAL_NAME}
              value={row.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Tanya"
            />
          </div>
          <div>
            <Label htmlFor={`testimonial_member_${i}`}>Member</Label>
            <select
              id={`testimonial_member_${i}`}
              value={row.memberId ?? ""}
              onChange={(e) => {
                const member = members.find((m) => m.id === e.target.value);
                // Picking a member fills an empty name with theirs.
                update(i, { memberId: member?.id ?? null, name: row.name || member?.name || "" });
              }}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Not linked</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Link the person if they’ve joined: their own profile photo shows, and changes when they change it.
            </p>
          </div>
          <TestimonialPhoto
            communityId={community.id}
            name={row.name}
            avatarUrl={row.avatarUrl ?? null}
            memberPhoto={members.find((m) => m.id === row.memberId)?.avatarUrl ?? null}
            onChange={(avatarUrl) => update(i, { avatarUrl })}
          />
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
              Up
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === rows.length - 1}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4" />
              Down
            </button>
            <button
              type="button"
              onClick={() => change(rows.filter((_, j) => j !== i))}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-danger hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ))}

      {rows.length < MAX_TESTIMONIALS && (
        <button
          type="button"
          onClick={() => change([...rows, { quote: "", name: "" }])}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Add a testimonial
        </button>
      )}

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save testimonials
      </SubmitButton>
    </form>
  );
}

// The person's photo beside their quote. Uploading puts it with the community's
// other images (admins only, per the community-assets policy) under a new name
// each time, so two testimonials never share a file; Save stores the link.
// With no photo the page shows their initials instead.
function TestimonialPhoto({
  communityId,
  name,
  avatarUrl,
  memberPhoto,
  onChange,
}: {
  communityId: string;
  name: string;
  avatarUrl: string | null;
  // The linked member's profile photo, which the landing page shows first.
  memberPhoto: string | null;
  onChange: (avatarUrl: string | null) => void;
}) {
  const [status, setStatus] = useState<{ kind: "idle" | "uploading" | "done" | "error"; message?: string }>({ kind: "idle" });

  async function upload(file: File) {
    const problem = validateImageFile(file);
    if (problem) {
      setStatus({ kind: "error", message: problem });
      return;
    }
    setStatus({ kind: "uploading" });
    try {
      onChange(await uploadImage(file, "community-assets", `${communityId}/testimonial-${crypto.randomUUID()}`));
      setStatus({ kind: "done" });
    } catch (e) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Upload failed. Try again." });
    }
  }

  return (
    <div>
      <Label>Photo</Label>
      <div className="flex flex-wrap items-center gap-3">
        <Avatar src={memberPhoto ?? avatarUrl} name={name || "?"} size={48} />
        <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          {status.kind === "uploading" ? "Uploading…" : avatarUrl ? "Change photo" : "Upload photo"}
          <input
            type="file"
            accept={IMAGE_ACCEPTED_TYPES.join(",")}
            className="sr-only"
            disabled={status.kind === "uploading"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
        {avatarUrl && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setStatus({ kind: "idle" });
            }}
            className="px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Remove photo
          </button>
        )}
      </div>
      {status.kind === "done" && <p className="mt-1 text-xs text-accent">Uploaded — press Save testimonials to use it.</p>}
      {status.kind === "error" && <p className="mt-1 text-xs text-danger">{status.message}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        {memberPhoto
          ? "Showing their profile photo. An uploaded one is only used if they remove theirs."
          : "Optional. Without one, their initials show instead."}
      </p>
    </div>
  );
}
