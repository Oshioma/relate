"use client";

import { useActionState, useEffect, useRef, useState, type DragEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Copy, Trash2, NotebookPen, ListTree, ArrowRight, MessageSquare } from "lucide-react";
import { updateSpace, deleteSpace, duplicateSpace, type SpaceFormState } from "./actions";
import { SpaceNavToggle, SpaceCardToggle } from "./space-nav-toggle";
import { SpaceNavGroup } from "./space-nav-group";
import type { NavGroupOption } from "@/lib/nav-groups";
import { JournalFieldsSection } from "./journal-fields-section";
import { SpaceSubNavList } from "./space-subnav-list";
import type { NavSubItem } from "./spaces-manager";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { toPlainText } from "@/components/ui/rich-text";
import { spaceImage } from "@/lib/space-images";
import { RowMenu, type RowMenuItem } from "./row-menu";
import { AccessBox, DragHandle, ROW_GRID, TypeChip } from "./space-row-parts";
import { SpaceAccessForm } from "./access/space-access-editor";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import { AccessSelector } from "@/components/community/access-selector";
import { spaceAccessCard, type AccessCommunity, type AccessTier } from "@/lib/access/model";
import type { Space, SpaceJournalField, SpaceType } from "@/types/database";

export function SpaceCard({
  space,
  communitySlug,
  journalFields,
  subItems,
  allowedTypes,
  paymentsEnabled,
  navGroups,
  tiers,
  tierIds,
  accessCommunity,
  dragHandlers,
  isDragging,
  stats = [],
}: {
  // Short counts shown under the description ("124 posts").
  stats?: string[];
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
  // This community's sidebar sections, for the Section dropdown.
  navGroups: NavGroupOption[];
  // The community's memberships, and the ones that unlock this space, for the
  // "Who can open it?" picker.
  tiers: AccessTier[];
  tierIds: string[];
  accessCommunity: AccessCommunity;
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
  // Watched so the "let members comment" sub-option only shows while the space
  // is one-way — it's meaningless otherwise (members can already comment).
  const [staffPostOnly, setStaffPostOnly] = useState(space.staff_post_only);
  const [showJournalFields, setShowJournalFields] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  // Cover image lives in state so the uploader's result is submitted with the
  // form via a hidden input; empty string means "no cover" (the action → null).
  const [imageUrl, setImageUrl] = useState<string | null>(space.image_url);
  const [updateState, updateAction, isUpdating] = useActionState<SpaceFormState, FormData>(updateSpace, undefined);
  const meta = SPACE_TYPES[space.space_type];

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
                // Remounted on Remove so its preview clears with the cover.
                key={imageUrl ?? "none"}
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
              Shown at the top of the space, on the welcome page, the mobile Explore strip and the Spaces grid. Optional — falls back to the space type&apos;s default photo.
            </p>
          </div>

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

          <AccessSelector
            idPrefix={`space-${space.id}`}
            space={{ id: space.id, name: space.name, visibility: space.visibility, price_cents: space.price_cents, currency: space.currency, show_in_nav: space.show_in_nav, tierIds }}
            tiers={tiers}
            community={accessCommunity}
            paymentsEnabled={paymentsEnabled}
          />

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

          {updateState?.error && <p className="text-sm text-danger">{updateState.error}</p>}

          <div className="flex gap-2">
            <SubmitButton className="w-auto" pendingText="Saving…">
              Save
            </SubmitButton>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  const blurb = space.space_type === "custom" || !space.description ? null : toPlainText(space.description);
  const access = spaceAccessCard({ ...space, tierIds }, tiers);
  const menuItems: RowMenuItem[] = [
    { label: "Edit space", icon: <Pencil className="h-4 w-4" />, onSelect: () => setEditing(true), disabled: busy },
    ...(subItems.length > 0
      ? [{ label: showSubNav ? "Hide nav sub-links" : "Nav sub-links", icon: <ListTree className="h-4 w-4" />, onSelect: () => setShowSubNav((v) => !v) }]
      : []),
    ...(space.space_type === "journal"
      ? [{ label: showJournalFields ? "Hide journal fields" : "Journal fields", icon: <NotebookPen className="h-4 w-4" />, onSelect: () => setShowJournalFields((v) => !v) }]
      : []),
    { label: "Duplicate", icon: <Copy className="h-4 w-4" />, onSelect: handleDuplicate, disabled: busy },
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onSelect: handleDelete, danger: true, disabled: busy },
  ];

  return (
    <div
      className={`rounded-2xl border ${isDragging ? "border-accent" : "border-border"} bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
      {...dragHandlers}
    >
      <div className={ROW_GRID}>
        <DragHandle disabled={!dragHandlers.draggable} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spaceImage(space)} alt="" className="h-16 w-16 rounded-xl object-cover lg:h-20 lg:w-20" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="text-base font-semibold leading-snug text-foreground">{space.name}</p>
            <TypeChip tone={meta.category}>{meta.label}</TypeChip>
          </div>
          {blurb && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{blurb}</p>}
          {stats.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {stats.map((stat) => (
                <span key={stat} className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                  {stat}
                </span>
              ))}
            </p>
          )}
        </div>

        <AccessBox
          choice={access.choice}
          title={access.title}
          detail={access.detail}
          action={
            <button
              type="button"
              onClick={() => setShowAccess((v) => !v)}
              aria-expanded={showAccess}
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-2 hover:text-accent"
            >
              Manage access
              <ArrowRight className="h-3 w-3" aria-hidden />
            </button>
          }
        />

        <div className="col-span-3 flex flex-col gap-2 lg:col-span-1">
          <SpaceNavToggle spaceId={space.id} defaultChecked={space.show_in_nav} variant="switch" />
          <SpaceCardToggle spaceId={space.id} defaultChecked={space.show_as_card} variant="switch" />
          <SpaceNavGroup spaceId={space.id} spaceType={space.space_type} value={space.nav_group} groups={navGroups} />
        </div>

        <div className="col-span-3 flex justify-end lg:col-span-1 lg:self-start">
          <RowMenu label={`More for ${space.name}`} items={menuItems} />
        </div>
      </div>

      {showAccess && (
        <div className="border-t border-border p-4">
          <SpaceAccessForm
            space={{ id: space.id, name: space.name, visibility: space.visibility, price_cents: space.price_cents, currency: space.currency, show_in_nav: space.show_in_nav, tierIds }}
            tiers={tiers}
            community={accessCommunity}
            communitySlug={communitySlug}
            paymentsEnabled={paymentsEnabled}
            onDone={() => setShowAccess(false)}
          />
        </div>
      )}

      {showSubNav && subItems.length > 0 && (
        <div className="border-t border-border p-4">
          <SpaceSubNavList spaceId={space.id} items={subItems} communitySlug={communitySlug} />
        </div>
      )}

      {showJournalFields && (
        <div className="border-t border-border p-4">
          <JournalFieldsSection spaceId={space.id} communitySlug={communitySlug} spaceSlug={space.slug} fields={journalFields} />
        </div>
      )}
    </div>
  );
}
