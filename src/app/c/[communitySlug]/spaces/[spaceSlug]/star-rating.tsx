"use client";

import { Star } from "lucide-react";

export function StarRatingDisplay({ value, count }: { value: number | null; count: number }) {
  if (value === null) {
    return <span className="text-xs text-muted-foreground">No ratings yet</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.round(value) ? "fill-accent text-accent" : "text-border"}`} />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)} ({count})
      </span>
    </div>
  );
}

export function StarRatingInput({ value, onChange, disabled }: { value: number | null; onChange: (rating: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          title={`Rate ${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5 disabled:opacity-60"
        >
          <Star className={`h-5 w-5 ${value !== null && n <= value ? "fill-accent text-accent" : "text-border"}`} />
        </button>
      ))}
    </div>
  );
}
