"use client";

import { useActionState, useEffect, useRef, useState, type DragEventHandler } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil, Copy, Trash2, NotebookPen, ListTree, ChevronDown, ChevronUp } from "lucide-react";
import { updateSpace, deleteSpace, duplicateSpace, type SpaceFormState } from "./actions";
import { SpaceNavToggle } from "./space-nav-toggle";
import { SpaceNavGroup } from "./space-nav-group";
import { JournalFieldsSection } from "./journal-fields-section";
import { SpaceSubNavList } from "./space-subnav-list";
import type { NavSubItem } from "./spaces-manager";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import type { Space, SpaceVisibility, SpaceJournalField, SpaceType } from "@/types/database";

function formatMonthlyPrice(cents: number, currency: string): string {
  try {
    return `${new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(cents / 100)}/mo`;
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}/mo`;
  }
}

export function SpaceCard({
  space,
  communitySlug,
  journalFields,
  subItems,
  allowedTypes,
  paymentsEnabled,
  dragHandlers,
  isDragging,
}: {
  space: Space;
  communitySlug: string;
  journalFields: SpaceJournalField[];
  // Nav sub-links shown, expandable and reorderable, under this space's row.
  subItems: NavSubItem[];
  // Space types the super admin permits for this community. The space's own
  // current type is always kept selectable even if no longer in the pool, so
  // an existing space can be edited without being forced to change type.
  allowedTypes: SpaceType[];
  // Whether the community can take charges (Stripe connected). Gates the
  // per-space monthly-price control.
  paymentsEnabled: boolean;
  dragHandlers: {
    draggable: boolean;
    onDragStart: DragEventHandler;
    onDragOver: DragEventHandler;
    onDrop: DragEventHandler;
    onDragEnd: DragEventHandler;
  };
  isDragging: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  // Watched so the price control can hide the moment the space is set public —
  // public spaces are always free (see the spaces_public_is_free constraint).
  const [visibility, setVisibility] = useState<SpaceVisibility>(space.visibility);
  // Watched so the "let members comment" sub-option only shows while the space
  // is one-way — it's meaningless otherwise (members can already comment).
  const [staffPostOnly, setStaffPostOnly] = useState(space.staff_post_only);
  const [showJournalFields, setShowJournalFields] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
  // Cover image lives in state so the uploader's result is submitted with the
  // form via a hidden input; empty string means "no cover" (the action → null).
  const [imageUrl, setImageUrl] = useState<string | null>(space.image_url);
  const [updateState, updateAction, isUpdating] = useActionState<SpaceFormState, FormData>(updateSpace, undefined);
  const meta = SPACE_TYPES[space.space_type];
  const Icon = meta.icon;

  // Type choices: the allowed pool, plus this space's current type if the super
  // admin has since removed it from the pool (so it stays selectable/keepable).
  const typeChoices = allowedTypes.includes(space.space_type) ? allowedTypes : [space.space_type, ...allowedTypes];
  const typeGroups = groupSpaceTypesByCategory(typeChoices.map((t) => SPACE_TYPES[t]));

  const wasUpdating = useRef(false);
  useEffect(() => {
    if (wasUpdating.current && !isUpdating && !updateState?.error) {
      setEditing(false);
    }
    wasUpdating.current = isUpdating;
  }, [isUpdating, updateState]);

  async function handleDuplicate() {
    setBusy(true);
    await duplicateSpace(space.id, communitySlug);
    router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${space.name}"? This removes all its posts.`)) return;
    setBusy(true);
    await deleteSpace(space.id, communitySlug);
    router.refresh();
    setBusy(false);
  }

  if (editing) {
    return (
      <div
        className={`rounded-lg border p-3 ${isDragging ? "border-accent" : "border-border"} bg-card`}
        {...dragHandlers}
      >
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="space_id" value={space.id} />
          <input type="hidden" name="community_slug" value={communitySlug} />

          <div>
            <Label htmlFor={`name-${space.id}`}>Name</Label>
            <Input id={`name-${space.id}`} name="name" defaultValue={space.name} required />
          </div>

          {/* A directory renders no masthead, so a description written here
              would go nowhere but still be asked for. Every other space type
              shows it under the title. */}
          {space.space_type !== "business_directory" && (
            <div>
              <Label htmlFor={`description-${space.id}`}>Description</Label>
              <RichEditor id={`description-${space.id}`} name="description" rows={4} defaultValue={space.description ?? ""} />
            </div>
          )}

          <div>
            <Label>Cover image</Label>
            {/* Submitted with the form via this hidden field; the uploader sets
                state, and Remove clears it back to no cover. */}
            <input type="hidden" name="image_url" value={imageUrl ?? ""} />
            <div className="flex items-center gap-4">
              <ImageUpload
                bucket="community-assets"
                basePath={`${space.community_id}/space-${space.id}-cover`}
                currentUrl={imageUrl}
                onUploaded={(url) => setImageUrl(url)}
                shape="square"
                size={64}
                label="cover"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="text-sm font-medium text-muted-foreground hover:text-danger"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Shown on the mobile Explore strip and the Spaces grid. Optional — falls back to the type icon.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`type-${space.id}`}>Type</Label>
              <select
                id={`type-${space.id}`}
                name="space_type"
                defaultValue={space.space_type}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {typeGroups.map((group) => (
                  <optgroup key={group.category.key} label={group.category.label}>
                    {group.types.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={`visibility-${space.id}`}>Visibility</Label>
              <select
                id={`visibility-${space.id}`}
                name="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as SpaceVisibility)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {(["public", "members", "private"] as SpaceVisibility[]).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(space.space_type === "discussion" || space.staff_post_only) && (
            <div className="space-y-2">
              <label
                htmlFor={`staff-post-only-${space.id}`}
                className="flex items-start gap-2.5 rounded-md border border-border p-3"
              >
                <input
                  type="checkbox"
                  id={`staff-post-only-${space.id}`}
                  name="staff_post_only"
                  checked={staffPostOnly}
                  onChange={(e) => setStaffPostOnly(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm">
                  <span className="font-medium text-foreground">One-way (announcements)</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Only owners, admins and moderators can post here. Members read and react.
                  </span>
                </span>
              </label>

              {staffPostOnly && (
                <label
                  htmlFor={`allow-member-comments-${space.id}`}
                  className="ml-6 flex items-start gap-2.5 rounded-md border border-border p-3"
                >
                  <input
                    type="checkbox"
                    id={`allow-member-comments-${space.id}`}
                    name="allow_member_comments"
                    defaultChecked={space.allow_member_comments}
                    className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Let members comment</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Members can reply to posts even though they can&apos;t start one. Off = fully broadcast (staff-only comments).
                    </span>
                  </span>
                </label>
              )}
            </div>
          )}

          {(space.space_type === "resources" || space.location_name) && (
            <div>
              <Label htmlFor={`location-${space.id}`}>Location override (optional)</Label>
              <Input
                id={`location-${space.id}`}
                name="location_name"
                defaultValue={space.location_name ?? ""}
                placeholder="e.g. Nungwi, Zanzibar"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Live tides &amp; weather in this space use this place instead of the community&apos;s location. Leave
                blank to use the community&apos;s.
              </p>
            </div>
          )}

          {visibility === "public" ? (
            // Public spaces are open to everyone, so they can't charge. Show why
            // rather than a disabled control — and the action forces price to 0
            // if a paid space is switched to public.
            <p className="text-xs text-muted-foreground">
              Public spaces are open to everyone and are always free. Set visibility to Members or Private to charge for
              access.
            </p>
          ) : paymentsEnabled ? (
            <div>
              <Label htmlFor={`price-${space.id}`}>Monthly price</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id={`price-${space.id}`}
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={space.price_cents > 0 ? (space.price_cents / 100).toFixed(2) : ""}
                    placeholder="0.00"
                  />
                </div>
                <div className="w-20 shrink-0">
                  <Input aria-label="Currency" name="currency" defaultValue={space.currency || "usd"} maxLength={3} className="uppercase" />
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Charge members this every month for access. Leave blank or 0 to keep the space free. Members pay you
                directly through Stripe.
              </p>
            </div>
          ) : (
            // Payments not connected: omit the input so the action leaves the
            // existing price untouched, but explain how to start charging.
            space.price_cents > 0 && (
              <p className="text-xs text-muted-foreground">
                This space charges {formatMonthlyPrice(space.price_cents, space.currency)}, but payments aren&apos;t
                connected right now — reconnect Stripe under Payments to collect.
              </p>
            )
          )}

          {updateState?.error && <p className="text-sm text-danger">{updateState.error}</p>}

          <div className="flex gap-2">
            <SubmitButton className="w-auto" pendingText="Saving…">
              Save
            </SubmitButton>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setVisibility(space.visibility);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${isDragging ? "border-accent" : "border-border"} bg-card`} {...dragHandlers}>
      <div className="flex items-center gap-3 p-3">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{space.name}</p>
            <Badge>{meta.label}</Badge>
            {space.price_cents > 0 && <Badge tone="accent">{formatMonthlyPrice(space.price_cents, space.currency)}</Badge>}
          </div>
          <p className="text-xs capitalize text-muted-foreground">{space.visibility}</p>
        </div>
        <SpaceNavToggle spaceId={space.id} defaultChecked={space.show_in_nav} />
        <SpaceNavGroup spaceId={space.id} spaceType={space.space_type} value={space.nav_group} />
        {subItems.length > 0 && (
          <button type="button" onClick={() => setShowSubNav((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Nav sub-links">
            <ListTree className="h-4 w-4" />
            {showSubNav ? <ChevronUp className="ml-0.5 inline h-3 w-3" /> : <ChevronDown className="ml-0.5 inline h-3 w-3" />}
          </button>
        )}
        {space.space_type === "journal" && (
          <button type="button" onClick={() => setShowJournalFields((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Journal fields">
            <NotebookPen className="h-4 w-4" />
            {showJournalFields ? <ChevronUp className="ml-0.5 inline h-3 w-3" /> : <ChevronDown className="ml-0.5 inline h-3 w-3" />}
          </button>
        )}
        <button type="button" onClick={() => setEditing(true)} disabled={busy} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={handleDuplicate} disabled={busy} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <Copy className="h-4 w-4" />
        </button>
        <button type="button" onClick={handleDelete} disabled={busy} className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showSubNav && subItems.length > 0 && (
        <div className="border-t border-border p-3">
          <SpaceSubNavList spaceId={space.id} items={subItems} communitySlug={communitySlug} />
        </div>
      )}

      {showJournalFields && (
        <div className="border-t border-border p-3">
          <JournalFieldsSection spaceId={space.id} communitySlug={communitySlug} spaceSlug={space.slug} fields={journalFields} />
        </div>
      )}
    </div>
  );
}
