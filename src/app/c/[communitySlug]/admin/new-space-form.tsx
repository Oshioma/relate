"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, Check, ChevronDown, Globe, LayoutGrid, MapPin, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { createSpace } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { useFormDraftRef } from "@/lib/use-form-draft";
import { SubmitButton } from "@/components/ui/submit-button";
import { SPACE_TYPES, SPACE_TYPE_FEATURES, groupSpaceTypesByCategory, type SpaceTypeCategory } from "@/lib/space-types";
import { GUIDED_JOURNEY_PRESETS } from "@/lib/guided-journey/presets";
import { cn } from "@/lib/utils";
import type { SpaceType } from "@/types/database";

const CATEGORY_ICONS: Record<SpaceTypeCategory, LucideIcon> = {
  general: LayoutGrid,
  programs: Sparkles,
  place: MapPin,
};

const AUDIENCES: { value: "public" | "members" | "private"; title: string; detail: string; icon: LucideIcon }[] = [
  { value: "public", title: "Everyone", detail: "Anyone, even people who haven't joined", icon: Globe },
  { value: "members", title: "Members", detail: "People who have joined the community", icon: Users },
  { value: "private", title: "Team only", detail: "Owners, admins and moderators", icon: ShieldCheck },
];

// Adding a space in three steps: pick a kind of space (General, Learning &
// Programs, Place-based), pick a type from its cards, each saying what the type
// can do, then confirm with a name and who can see it. Paid access is set
// afterwards with the space's Manage access, once it exists.
export function NewSpaceForm({
  communityId,
  communitySlug,
  allowedTypes,
}: {
  communityId: string;
  communitySlug: string;
  // The space types this community may add, as regulated by the super admin.
  allowedTypes: SpaceType[];
}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const groups = groupSpaceTypesByCategory(allowedTypes.map((t) => SPACE_TYPES[t]));
  const [category, setCategory] = useState<SpaceTypeCategory | null>(null);
  const [type, setType] = useState<SpaceType | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const openGroup = groups.find((g) => g.category.key === category) ?? null;
  // The cover is uploaded before the space exists, so it can't be filed under
  // the space's id the way the edit form files it. A random id per form keeps
  // two half-made spaces from overwriting each other's photo. It never reaches
  // the page's HTML (only the upload path), so the server and browser picking
  // different ids can't trip hydration.
  const [coverKey, setCoverKey] = useState(() => crypto.randomUUID());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // The description editor keeps its text in React, so a restored draft is
  // handed back as its starting value and the editor remounted to take it.
  const [descriptionSeed, setDescriptionSeed] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const descriptionMirrorRef = useRef<HTMLInputElement>(null);
  const lastDescriptionRef = useRef("");
  const nameRef = useRef<HTMLInputElement>(null);

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.space_type === "string" && allowedTypes.includes(values.space_type as SpaceType)) {
      const restored = values.space_type as SpaceType;
      setType(restored);
      setCategory(SPACE_TYPES[restored].category);
    }
    if (typeof values.image_url === "string") setImageUrl(values.image_url || null);
    if (typeof values.description_draft === "string" && values.description_draft) {
      lastDescriptionRef.current = values.description_draft;
      if (descriptionMirrorRef.current) descriptionMirrorRef.current.value = values.description_draft;
      setDescriptionSeed(values.description_draft);
      setEditorKey((k) => k + 1);
      setMoreOpen(true);
    }
  }, [allowedTypes, setMoreOpen]);
  const { clear: clearDraft, saveNow } = useFormDraftRef(formRef, `new-space:${communityId}`, { onRestore });

  // The cover is a controlled hidden field: write it to the DOM now so the
  // draft saved straight after carries it.
  function setCover(url: string | null) {
    flushSync(() => setImageUrl(url));
    saveNow();
  }

  function pickCategory(next: SpaceTypeCategory) {
    flushSync(() => {
      setCategory((current) => (current === next ? null : next));
      setType(null);
    });
    saveNow();
  }

  function pickType(next: SpaceType) {
    flushSync(() => setType(next));
    // Start the name off as the type's own name, unless one was typed already.
    if (nameRef.current && !nameRef.current.value.trim()) nameRef.current.value = SPACE_TYPES[next].label;
    saveNow();
    nameRef.current?.focus();
    nameRef.current?.select();
  }

  function backToTypes() {
    flushSync(() => setType(null));
    saveNow();
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createSpace(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      clearDraft();
      formRef.current?.reset();
      setCategory(null);
      setType(null);
      setMoreOpen(false);
      setImageUrl(null);
      setCoverKey(crypto.randomUUID());
      lastDescriptionRef.current = "";
      setDescriptionSeed("");
      setEditorKey((k) => k + 1);
    }
  }

  if (allowedTypes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        No space types are available to this community yet. Ask the platform admin to enable some.
      </div>
    );
  }

  const picked = type ? SPACE_TYPES[type] : null;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_type" value={type ?? ""} data-draft />
      {/* Draft-only mirror of the description, so a refresh restores it; the action ignores it. */}
      <input ref={descriptionMirrorRef} type="hidden" name="description_draft" data-draft />

      {/* Step 1: the kind of space. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {groups.map(({ category: c, types }) => {
          const Icon = CATEGORY_ICONS[c.key];
          const open = category === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => pickCategory(c.key)}
              aria-expanded={open}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left transition-colors hover:border-accent",
                open ? "border-accent ring-2 ring-accent/30" : "border-border"
              )}
            >
              <span className="flex w-full items-center justify-between">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", open ? "bg-accent text-white" : "bg-muted text-foreground")}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
              </span>
              <span className="text-base font-semibold text-foreground">{c.label}</span>
              <span className="text-sm text-muted-foreground">{c.description}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {types.length} {types.length === 1 ? "type" : "types"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step 2: the types in that kind, each saying what it can do. */}
      {openGroup && !picked && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {openGroup.types.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => pickType(t.type)}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-accent hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                </span>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {SPACE_TYPE_FEATURES[t.type].map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-1 text-sm font-medium text-accent">Add this space →</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 3: confirm. Always mounted (hidden until a type is picked) so a
          refresh can put a draft's name and audience back. */}
      <div className={cn("space-y-4 rounded-2xl border border-accent/40 bg-card p-5", !picked && "hidden")}>
        {picked && (
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <picked.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">Add a {picked.label} space?</p>
              <p className="text-sm text-muted-foreground">{picked.description}</p>
            </div>
            <button
              type="button"
              onClick={backToTypes}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Other types
            </button>
          </div>
        )}

        <div>
          <Label htmlFor="space_name">Name</Label>
          <Input ref={nameRef} id="space_name" name="name" placeholder="e.g. Announcements" required={!!picked} />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">Who can see it?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {AUDIENCES.map((a) => (
              <label
                key={a.value}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              >
                <input type="radio" name="visibility" value={a.value} defaultChecked={a.value === "members"} className="sr-only" />
                <a.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="block text-sm font-medium text-foreground">{a.title}</span>
                  <span className="block text-xs text-muted-foreground">{a.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            To charge for it, add the space and then use its Manage access in the list above.
          </p>
        </fieldset>

        {type === "guided_journey" && (
          <div>
            <Label htmlFor="journey_preset">Start from</Label>
            <select
              id="journey_preset"
              name="journey_preset"
              defaultValue="gardening"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {GUIDED_JOURNEY_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Sets the starting wording, stages and milestones. Change any of it later from the space&apos;s Manage page.
            </p>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="show_in_nav" defaultChecked className="h-4 w-4 rounded border-border" />
          Show in left navigation
        </label>

        <div>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} aria-hidden />
            Description and cover (optional)
          </button>
          {/* Kept mounted when closed so the draft keeps what was typed. */}
          <div className={cn("mt-3 space-y-4", !moreOpen && "hidden")}>
            {type !== "business_directory" && (
              <div>
                <Label htmlFor="space_description">Description</Label>
                <RichEditor
                  key={editorKey}
                  id="space_description"
                  name="description"
                  rows={4}
                  defaultValue={descriptionSeed}
                  placeholder="Add an intro or an About section for this space…"
                  onChange={(value) => {
                    // Fires on mount too; only a real change is worth a save, or the
                    // empty mount would overwrite the draft before it's restored.
                    if (value === lastDescriptionRef.current) return;
                    lastDescriptionRef.current = value;
                    if (descriptionMirrorRef.current) descriptionMirrorRef.current.value = value;
                    saveNow();
                  }}
                />
              </div>
            )}

            <div>
              <Label>Cover image</Label>
              <input type="hidden" name="image_url" value={imageUrl ?? ""} data-draft />
              <div className="flex items-center gap-4">
                <ImageUpload
                  // Remounted when the cover changes from outside (Remove, a restored
                  // draft, a reset after Create) so its preview follows.
                  key={imageUrl ?? "none"}
                  bucket="community-assets"
                  basePath={`${communityId}/space-new-${coverKey}-cover`}
                  currentUrl={imageUrl}
                  onUploaded={(url) => setCover(url)}
                  shape="square"
                  size={64}
                  label="cover"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setCover(null)}
                    className="text-sm font-medium text-muted-foreground hover:text-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shown at the top of the space and on its cards. Leave it empty to use the space type&apos;s default photo.
              </p>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton pendingText="Adding…" className="w-auto">
            {picked ? `Add ${picked.label}` : "Add space"}
          </SubmitButton>
          <button type="button" onClick={backToTypes} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
