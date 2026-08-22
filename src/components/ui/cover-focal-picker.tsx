"use client";

import { MOBILE_COVER_POSITIONS, mobileCoverPositionClass, type MobileCoverPosition } from "@/lib/cover-position";
import { CoverCropPreview } from "@/components/ui/cover-crop-preview";
import { cn } from "@/lib/utils";

// Roughly the shape of the community header on a phone: a little wider than it
// is tall, which is what turns the crop through ninety degrees.
const PHONE_ASPECT = 390 / 340;

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
  previewUrl,
  fallbackPosition,
}: {
  value: MobileCoverPosition | null;
  onPick: (value: MobileCoverPosition) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
  // The cover itself, shown cropped as a phone would crop it so the choice can
  // be judged from a laptop, where the real header can't show it.
  previewUrl?: string | null;
  // What the phone falls back to while nothing is picked here: the wide crop.
  fallbackPosition?: string | null;
}) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        {previewUrl && (
          <CoverCropPreview
            url={previewUrl}
            positionClass={mobileCoverPositionClass(value, fallbackPosition)}
            aspect={PHONE_ASPECT}
            className="w-24 shrink-0"
          />
        )}
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
      </div>
      {/* Under the whole row rather than beside the grid, where a 120px column
          would break it across two ragged lines. */}
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
