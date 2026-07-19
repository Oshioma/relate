"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagListEditorProps {
  tags: string[];
  placeholder: string;
  onAdd: (value: string) => Promise<{ error: string | null }>;
  onRemove: (value: string) => Promise<{ error: string | null }>;
}

export function TagListEditor({ tags, placeholder, onAdd, onRemove }: TagListEditorProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await onAdd(trimmed);
      if (result.error) {
        setError(result.error);
      } else {
        setValue("");
        router.refresh();
      }
    });
  }

  function handleRemove(tag: string) {
    setError(null);
    startTransition(async () => {
      const result = await onRemove(tag);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} tone="accent" className="gap-1 pr-1.5">
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              disabled={isPending}
              className="rounded-full p-0.5 hover:bg-accent/20 disabled:opacity-60"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {tags.length === 0 && <p className="text-sm text-muted-foreground">None added yet.</p>}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" size="sm" onClick={handleAdd} disabled={isPending || !value.trim()}>
          Add
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
