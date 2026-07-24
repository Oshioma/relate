"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { SPACE_TYPES, SPACE_TYPE_LIST } from "@/lib/space-types";
import { builtinsForTemplate, type TemplateDefaultItem } from "@/lib/template-defaults";
import { BUILTIN_NAV_ITEMS } from "@/lib/nav-items";
import { saveTemplateDefaultSpaces } from "./actions";
import type { SpaceType } from "@/types/database";

// Control panel: for a chosen community type, edit the default spaces a new
// community of that type is created with — reorder (which sets nav order),
// rename, retype, toggle "show in nav", remove, and add more from the pool of
// space types (plus Events / Search where offered). Writes replace the whole
// list for that type via a super-admin server action.
export function TemplateSpacesManager({
  templates,
  initialByTemplate,
}: {
  templates: { key: string; label: string }[];
  initialByTemplate: Record<string, TemplateDefaultItem[]>;
}) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState(templates[0]?.key ?? "");
  const [byTemplate, setByTemplate] = useState<Record<string, TemplateDefaultItem[]>>(initialByTemplate);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const items = byTemplate[selectedKey] ?? [];

  async function persist(next: TemplateDefaultItem[]) {
    setByTemplate((prev) => ({ ...prev, [selectedKey]: next }));
    setSaving(true);
    const result = await saveTemplateDefaultSpaces(selectedKey, next);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setError(null);
    router.refresh();
  }

  function patchItem(index: number, fields: Partial<TemplateDefaultItem>) {
    persist(items.map((it, i) => (i === index ? { ...it, ...fields } : it)));
  }

  function removeItem(index: number) {
    persist(items.filter((_, i) => i !== index));
  }

  function addSpace(spaceType: SpaceType) {
    const meta = SPACE_TYPES[spaceType];
    persist([...items, { name: meta.label, description: meta.description, space_type: spaceType, builtin_key: null, show_in_nav: true }]);
  }

  function addBuiltin(key: "events" | "concierge") {
    const label = BUILTIN_NAV_ITEMS.find((b) => b.key === key)?.label ?? key;
    persist([...items, { name: label, description: "", space_type: "discussion", builtin_key: key, show_in_nav: true }]);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    persist(next);
  }

  // Built-in features this type offers that aren't already in the list.
  const availableBuiltins = builtinsForTemplate(selectedKey).filter((key) => !items.some((it) => it.builtin_key === key));

  return (
    <div>
      <label className="mb-3 flex items-center gap-2 text-sm text-foreground">
        <span className="font-medium">Community type</span>
        <select
          value={selectedKey}
          onChange={(e) => {
            setSelectedKey(e.target.value);
            setError(null);
          }}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {templates.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
      </label>

      <p className="mb-2 text-xs text-muted-foreground">
        Default spaces for a new {templates.find((t) => t.key === selectedKey)?.label} community. Drag to set the nav order.
      </p>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isBuiltin = item.builtin_key !== null;
          const Icon = isBuiltin ? null : SPACE_TYPES[item.space_type]?.icon;
          return (
            <div
              key={`${selectedKey}:${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e: DragEvent) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`rounded-lg border ${dragIndex === i ? "border-accent" : "border-border"} ${isBuiltin ? "bg-muted/40" : "bg-card"} p-3`}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                <input
                  defaultValue={item.name}
                  onBlur={(e) => {
                    const name = e.target.value.trim();
                    if (name && name !== item.name) patchItem(i, { name });
                  }}
                  className="min-w-0 flex-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {isBuiltin ? (
                  <span className="whitespace-nowrap rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Built-in</span>
                ) : (
                  <select
                    defaultValue={item.space_type}
                    onChange={(e) => patchItem(i, { space_type: e.target.value as SpaceType })}
                    className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {SPACE_TYPE_LIST.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                )}
                <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={item.show_in_nav}
                    onChange={(e) => patchItem(i, { show_in_nav: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  In nav
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  title="Remove"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No default spaces — add some below.</p>}
      </div>

      <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">Add a space</p>
      <div className="flex flex-wrap gap-2">
        {availableBuiltins.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => addBuiltin(key)}
            className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-sm text-foreground hover:border-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            {BUILTIN_NAV_ITEMS.find((b) => b.key === key)?.label ?? key}
          </button>
        ))}
        {SPACE_TYPE_LIST.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => addSpace(t.type)}
              title={t.description}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:border-accent hover:text-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
