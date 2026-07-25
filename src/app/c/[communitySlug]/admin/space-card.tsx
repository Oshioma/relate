"use client";

import { useActionState, useEffect, useRef, useState, type DragEventHandler } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil, Copy, Trash2, NotebookPen, ListTree, ChevronDown, ChevronUp } from "lucide-react";
import { updateSpace, deleteSpace, duplicateSpace, type SpaceFormState } from "./actions";
import { SpaceNavToggle } from "./space-nav-toggle";
import { JournalFieldsSection } from "./journal-fields-section";
import { SpaceSubNavList } from "./space-subnav-list";
import type { NavSubItem } from "./spaces-manager";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import type { Space, SpaceVisibility, SpaceJournalField, SpaceType } from "@/types/database";

export function SpaceCard({
  space,
  communitySlug,
  journalFields,
  subItems,
  allowedTypes,
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
  const [showJournalFields, setShowJournalFields] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
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

          <div>
            <Label htmlFor={`description-${space.id}`}>Description</Label>
            <Textarea id={`description-${space.id}`} name="description" rows={2} defaultValue={space.description ?? ""} />
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
                defaultValue={space.visibility}
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
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
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
          </div>
          <p className="text-xs capitalize text-muted-foreground">{space.visibility}</p>
        </div>
        <SpaceNavToggle spaceId={space.id} defaultChecked={space.show_in_nav} />
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
