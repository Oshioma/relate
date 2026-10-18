"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

// A small repeatable-row editor for the guide's lists (photos, restaurants,
// stays, notes). Each row is a plain object; the field specs decide which
// inputs it gets. Fully controlled — the parent owns the array and saves it
// (and its draft) as a whole.

export type FieldSpec =
  | { key: string; label: string; type: "text" | "url" | "number"; placeholder?: string; list?: string; wide?: boolean }
  | { key: string; label: string; type: "textarea"; rows?: number; wide?: boolean }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; wide?: boolean }
  | { key: string; label: string; type: "csv"; placeholder?: string; wide?: boolean };

type Row = Record<string, unknown>;

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function ListEditor<T extends Row>({
  title,
  items,
  onChange,
  fields,
  empty,
  itemLabel,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldSpec[];
  empty: T;
  itemLabel: (item: T, index: number) => string;
}) {
  const update = (index: number, key: string, value: unknown) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <fieldset className="rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">{title}</legend>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-foreground">{itemLabel(item, index) || `Item ${index + 1}`}</p>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up" className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down" className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Remove" className="rounded p-1 text-danger hover:bg-muted">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.key];
                return (
                  <label key={field.key} className={field.wide || field.type === "textarea" ? "sm:col-span-2" : undefined}>
                    <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea rows={field.rows ?? 3} value={String(value ?? "")} onChange={(e) => update(index, field.key, e.target.value)} className={inputClass} data-no-draft />
                    ) : field.type === "select" ? (
                      <select value={String(value ?? "")} onChange={(e) => update(index, field.key, e.target.value)} className={inputClass} data-no-draft>
                        {field.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "csv" ? (
                      <input
                        type="text"
                        value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
                        placeholder={field.placeholder}
                        onChange={(e) => update(index, field.key, e.target.value.split(",").map((s) => s.trimStart()))}
                        onBlur={(e) => update(index, field.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                        className={inputClass}
                        data-no-draft
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={value === null || value === undefined ? "" : String(value)}
                        placeholder={field.placeholder}
                        list={field.list}
                        onChange={(e) => update(index, field.key, field.type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value)}
                        className={inputClass}
                        data-no-draft
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { ...empty }])} className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </fieldset>
  );
}
