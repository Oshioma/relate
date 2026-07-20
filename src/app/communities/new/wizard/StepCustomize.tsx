"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProfileFieldType, SpaceType } from "@/types/database";
import { SPACE_TYPE_LIST } from "@/lib/space-types";
import { reorder, nextId } from "./types";
import type { WizardState, WizardProfileField } from "./types";

const FIELD_TYPES: ProfileFieldType[] = ["text", "textarea", "number", "date", "dropdown", "multiselect", "checkbox", "url"];

export function StepCustomize({ state, update }: { state: WizardState; update: (patch: Partial<WizardState>) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function patchSpace(id: string, patch: Partial<WizardState["spaces"][number]>) {
    update({ spaces: state.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function removeSpace(id: string) {
    update({ spaces: state.spaces.filter((s) => s.id !== id) });
  }

  function addSpace() {
    update({ spaces: [...state.spaces, { id: nextId("space"), name: "New Space", description: "", show_in_nav: true, space_type: "discussion" as SpaceType }] });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    update({ spaces: reorder(state.spaces, dragIndex, targetIndex) });
    setDragIndex(null);
  }

  function patchField(id: string, patch: Partial<WizardProfileField>) {
    update({ profileFields: state.profileFields.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  }

  function removeField(id: string) {
    update({ profileFields: state.profileFields.filter((f) => f.id !== id) });
  }

  function addField() {
    update({ profileFields: [...state.profileFields, { id: nextId("field"), label: "", field_type: "text", options: [] }] });
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
                    {SPACE_TYPE_LIST.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.label}
                      </option>
                    ))}
                  </select>
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

      <section>
        <Label>Member profile fields</Label>
        <p className="-mt-1 mb-2 text-xs text-muted-foreground">Custom fields members fill in for this community, on top of their regular profile.</p>
        <div className="space-y-2">
          {state.profileFields.map((field) => (
            <Card key={field.id} className="flex flex-wrap items-center gap-2 p-3">
              <Input
                value={field.label}
                onChange={(e) => patchField(field.id, { label: e.target.value })}
                placeholder="Field label"
                className="min-w-0 flex-1"
              />
              <select
                value={field.field_type}
                onChange={(e) => patchField(field.id, { field_type: e.target.value as ProfileFieldType })}
                className="rounded-md border border-border bg-card px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => removeField(field.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
        <Button variant="secondary" size="sm" className="mt-3 w-auto" onClick={addField}>
          <Plus className="h-3.5 w-3.5" />
          Add Field
        </Button>
      </section>
    </div>
  );
}
