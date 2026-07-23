"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SPACE_TYPE_LIST } from "@/lib/space-types";
import type { PlaceDefaultSpace, SpaceType } from "@/types/database";

// Super-admin editor for the default spaces a new Place-Based Community starts
// with. Writes go straight to place_default_spaces via the browser client;
// the table's RLS (is_super_admin) is the real guard, same as the feature
// toggles on this page.
export function PlaceSpacesManager({ spaces }: { spaces: PlaceDefaultSpace[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<SpaceType>("discussion");
  const [error, setError] = useState<string | null>(null);

  async function run(op: PromiseLike<{ error: { message: string } | null }>) {
    const { error } = await op;
    if (error) {
      setError(error.message);
      return false;
    }
    setError(null);
    router.refresh();
    return true;
  }

  async function patch(id: string, fields: Partial<PlaceDefaultSpace>) {
    await run(supabase.from("place_default_spaces").update(fields).eq("id", id));
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from the default places spaces?`)) return;
    await run(supabase.from("place_default_spaces").delete().eq("id", id));
  }

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...spaces];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    const results = await Promise.all(
      reordered.map((s, i) => supabase.from("place_default_spaces").update({ sort_order: i }).eq("id", s.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setError(failed.error.message);
      return;
    }
    setError(null);
    router.refresh();
  }

  async function add() {
    const name = newName.trim();
    if (!name) return;
    const ok = await run(
      supabase.from("place_default_spaces").insert({
        name,
        space_type: newType,
        sort_order: spaces.length,
      })
    );
    if (ok) {
      setNewName("");
      setNewType("discussion");
    }
  }

  return (
    <div className="space-y-2">
      {spaces.map((space, i) => (
        <div
          key={space.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          onDragEnd={() => setDragIndex(null)}
          className={`rounded-lg border ${dragIndex === i ? "border-accent" : "border-border"} bg-card p-3`}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
            <input
              defaultValue={space.name}
              onBlur={(e) => {
                const name = e.target.value.trim();
                if (name && name !== space.name) patch(space.id, { name });
              }}
              className="min-w-0 flex-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              defaultValue={space.space_type}
              onChange={(e) => patch(space.id, { space_type: e.target.value as SpaceType })}
              className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SPACE_TYPE_LIST.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
              <input
                type="checkbox"
                defaultChecked={space.show_in_nav}
                onChange={(e) => patch(space.id, { show_in_nav: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              In nav
            </label>
            <button
              type="button"
              onClick={() => remove(space.id, space.name)}
              title="Remove"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input
            defaultValue={space.description}
            placeholder="Description"
            onBlur={(e) => {
              const description = e.target.value;
              if (description !== space.description) patch(space.id, { description });
            }}
            className="mt-2 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ))}

      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New default space name"
          className="min-w-0 flex-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as SpaceType)}
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SPACE_TYPE_LIST.map((t) => (
            <option key={t.type} value={t.type}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={!newName.trim()}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
