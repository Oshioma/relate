"use client";

import { useState } from "react";
import { GripVertical, Trash2, Plus, Lock, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SpaceType } from "@/types/database";
import { SPACE_TYPES, groupSpaceTypesByCategory } from "@/lib/space-types";
import { reorder, nextId } from "./types";
import type { WizardState } from "./types";

const MODULE_TONES = [
  "bg-[#e7f0e5] text-[#3f6b4b]",
  "bg-[#ece9ff] text-[#4d4298]",
  "bg-[#fde9e1] text-[#9a4427]",
  "bg-[#e2f1fb] text-[#17618a]",
];

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
  const [activeId, setActiveId] = useState<string | null>(state.spaces[0]?.id ?? null);
  const defaultType: SpaceType = allowedTypes.includes("discussion") ? "discussion" : (allowedTypes[0] ?? "discussion");

  function patchSpace(id: string, patch: Partial<WizardState["spaces"][number]>) {
    update({ spaces: state.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function removeSpace(id: string) {
    update({ spaces: state.spaces.filter((s) => s.id !== id) });
    if (activeId === id) setActiveId(null);
  }

  function addSpace() {
    const id = nextId("space");
    update({ spaces: [...state.spaces, { id, name: "New Space", description: "", show_in_nav: true, space_type: defaultType, staff_post_only: false, visibility: "members" }] });
    setActiveId(id);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    update({ spaces: reorder(state.spaces, dragIndex, targetIndex) });
    setDragIndex(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Customize your community</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Choose what your members can do. You can change these anytime.</p>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Modules</h2>
          <span className="text-xs text-muted-foreground">Drag to reorder</span>
        </div>
        <div className="space-y-2.5">
          {state.spaces.map((space, i) => {
            const isActive = activeId === space.id;
            const meta = SPACE_TYPES[space.space_type];
            const SpaceIcon = meta.icon;
            const tone = MODULE_TONES[i % MODULE_TONES.length];

            return (
              <Card
              key={space.id}
              className={cn(
                "group overflow-visible rounded-xl transition-colors",
                isActive && "border-accent/30 bg-accent-soft/45",
                dragIndex === i && "border-accent opacity-70"
              )}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
            >
              <div className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2 p-3 sm:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] sm:gap-3 sm:p-4">
                <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground" aria-label="Drag to reorder" />
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12", tone)}>
                  <SpaceIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className={cn("min-w-0", isActive && "order-2 col-span-4 mt-1 sm:order-none sm:col-span-1 sm:mt-0")}>
                  {isActive ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input value={space.name} onChange={(e) => patchSpace(space.id, { name: e.target.value })} className="h-10 bg-card font-medium" />
                      <Input value={space.description} onChange={(e) => patchSpace(space.id, { description: e.target.value })} placeholder="Short description (optional)" className="h-10 bg-card text-sm" />
                      <select
                        value={space.space_type}
                        onChange={(e) => patchSpace(space.id, { space_type: e.target.value as SpaceType })}
                        className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
                      >
                        {groupSpaceTypesByCategory(
                          (allowedTypes.includes(space.space_type) ? allowedTypes : [space.space_type, ...allowedTypes]).map((t) => SPACE_TYPES[t])
                        ).map((group) => (
                          <optgroup key={group.category.key} label={group.category.label}>
                            {group.types.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <button type="button" className="block w-full text-left" onClick={() => setActiveId(space.id)}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">{space.name}</h3>
                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium sm:hidden", tone)}>{meta.label}</span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-1 sm:text-sm">{space.description || "No description"}</p>
                    </button>
                  )}
                  {space.visibility === "private" && (
                    <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" />Starts private — only invited people can see it.</p>
                  )}
                </div>

                {!isActive && <span className={cn("hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex", tone)}>{meta.label}</span>}
                <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={space.show_in_nav}
                    aria-label={space.show_in_nav ? "Visible in navigation" : "Hidden from navigation"}
                    title={space.show_in_nav ? "Showing in navigation" : "Hidden from navigation"}
                    onClick={() => patchSpace(space.id, { show_in_nav: !space.show_in_nav })}
                    className={cn("relative h-7 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", space.show_in_nav ? "bg-accent" : "bg-border")}
                  >
                    <span aria-hidden="true" className={cn("absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform", space.show_in_nav && "translate-x-5")} />
                  </button>
                  <details className="relative">
                    <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">Module actions</span>
                    </summary>
                    <div className="absolute right-0 top-10 z-20 min-w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
                      <button type="button" onClick={() => removeSpace(space.id)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger/10">
                        <Trash2 className="h-4 w-4" />Remove module
                      </button>
                    </div>
                  </details>
                </div>
              </div>
              </Card>
            );
          })}
        </div>
        <Button variant="ghost" className="mt-3 h-14 w-full rounded-xl border border-dashed border-border text-accent hover:border-accent/40 hover:bg-accent-soft" onClick={addSpace}>
          <Plus className="h-4 w-4" />
          Add module
        </Button>
      </section>
    </div>
  );
}
