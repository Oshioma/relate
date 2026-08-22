"use client";

import { MOBILE_COVER_POSITIONS, type MobileCoverPosition } from "@/lib/cover-position";
import { cn } from "@/lib/utils";

// The phone crop, as a 3×3 of the picture rather than a list of words. Which
// part of a photo to keep is a spatial question, and a grid answers it in the
// same shape as the thing it's about — "top left" is the top-left cell.
//
// `null` means the community hasn't chosen one, in which case the wide-screen
// crop applies at every width (what every cover did before this existed).
export function CoverFocalPicker({
  value,
  onPick,
  onClear,
  disabled,
  className,
}: {
  value: MobileCoverPosition | null;
  onPick: (value: MobileCoverPosition) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid w-[7.5rem] grid-cols-3 gap-1">
        {MOBILE_COVER_POSITIONS.map((option) => {
          const isActive = value === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onPick(option.key)}
              disabled={disabled}
              aria-label={option.label}
              aria-pressed={isActive}
              title={option.label}
              className={cn(
                "flex h-9 items-center justify-center rounded border transition-colors disabled:opacity-50",
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <span className={cn("rounded-full bg-current", isActive ? "h-2 w-2" : "h-1.5 w-1.5")} />
            </button>
          );
        })}
      </div>
      {value !== null && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="mt-2 text-xs text-accent underline disabled:opacity-50"
        >
          Use the same crop as wide screens
        </button>
      )}
    </div>
  );
}
