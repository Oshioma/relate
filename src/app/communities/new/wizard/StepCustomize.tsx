"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus, Eye, EyeOff, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SpaceType } from "@/types/database";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import { reorder, nextId } from "./types";
import type { WizardState } from "./types";

export function StepCustomize({
  state,
  update,
  allowedTypes,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  // Space types the platform makes available to new communities.
  allowedTypes: SpaceType[];
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const defaultType: SpaceType = allowedTypes.includes("discussion") ? "discussion" : (allowedTypes[0] ?? "discussion");

  function patchSpace(id: string, patch: Partial<WizardState["spaces"][number]>) {
    update({ spaces: state.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function removeSpace(id: string) {
    update({ spaces: state.spaces.filter((s) => s.id !== id) });
  }

  function addSpace() {
    update({ spaces: [...state.spaces, { id: nextId("space"), name: "New Space", description: "", show_in_nav: true, space_type: defaultType, staff_post_only: false, visibility: "members" }] });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    update({ spaces: reorder(state.spaces, dragIndex, targetIndex) });
    setDragIndex(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Customize your setup</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rename, remove or reorder spaces. Drag the handle to reorder.</p>
      </div>

      <section>
        <Label>Spaces</Label>
        <div className="space-y-2">
          {state.spaces.map((space, i) => (
            <Card
              key={space.id}
              className={dragIndex === i ? "border-accent" : undefined}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
            >
              <div className="flex items-start gap-2.5 p-3">
                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Input value={space.name} onChange={(e) => patchSpace(space.id, { name: e.target.value })} className="font-medium" />
                  <Input
                    value={space.description}
                    onChange={(e) => patchSpace(space.id, { description: e.target.value })}
                    placeholder="Short description (optional)"
                    className="text-xs"
                  />
                  <select
                    value={space.space_type}
                    onChange={(e) => patchSpace(space.id, { space_type: e.target.value as SpaceType })}
                    className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {/* Allowed types, plus this space's own type if a template
                        seeded one the platform no longer offers. */}
                    {groupSpaceTypesByCategory(
                      (allowedTypes.includes(space.space_type) ? allowedTypes : [space.space_type, ...allowedTypes]).map((t) => SPACE_TYPES[t])
                    ).map((group) => (
                      <optgroup key={group.category.key} label={group.category.label}>
                        {group.types.map((t) => (
                          <option key={t.type} value={t.type}>
                            {t.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {space.visibility === "private" && (
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Starts private — only people you invite to it can see it. Change this in Admin.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => patchSpace(space.id, { show_in_nav: !space.show_in_nav })}
                  className="mt-2 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                  title={space.show_in_nav ? "Showing in navigation" : "Hidden from navigation"}
                >
                  {space.show_in_nav ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeSpace(space.id)}
                  className="mt-2 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
        <Button variant="secondary" size="sm" className="mt-3 w-auto" onClick={addSpace}>
          <Plus className="h-3.5 w-3.5" />
          Add Space
        </Button>
      </section>
    </div>
  );
}
