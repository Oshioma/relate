"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/input";
import { ACCENT_PRESETS, normalizeAccentColor } from "@/lib/accent-color";
import {
  COVER_POSITIONS,
  coverPositionPreviewClass,
  isMobileCoverPosition,
  type CoverPosition,
  type MobileCoverPosition,
} from "@/lib/cover-position";
import { CoverFocalPicker } from "@/components/ui/cover-focal-picker";
import { CoverCropPreview } from "@/components/ui/cover-crop-preview";
import { cn } from "@/lib/utils";
import type { Community } from "@/types/database";

// The two header shapes each crop stands for: a long band on a wide screen, a
// nearly-square one on a phone.
const WIDE_ASPECT = 1200 / 420;

export function CommunityBrandingForm({ community }: { community: Community }) {
  const router = useRouter();
  // Optimistic: the swatch highlights on click rather than after the round
  // trip, so picking a colour feels like picking a colour.
  const [accent, setAccent] = useState<string | null>(community.accent_color);
  const [accentError, setAccentError] = useState<string | null>(null);
  // The native colour input fires continuously while the picker is dragged, so
  // its value is held locally and only written once the picking settles.
  const [customColor, setCustomColor] = useState(community.accent_color ?? "#4d6a52");
  const customTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [coverPosition, setCoverPosition] = useState<string>(community.cover_position ?? "center");
  const [mobileCoverPosition, setMobileCoverPosition] = useState<MobileCoverPosition | null>(
    isMobileCoverPosition(community.cover_position_mobile) ? community.cover_position_mobile : null
  );
  const [showStats, setShowStats] = useState(community.show_stats);
  const [statsError, setStatsError] = useState<string | null>(null);

  async function persistLogo(url: string) {
    const supabase = createClient();
    await supabase.from("communities").update({ logo_url: url }).eq("id", community.id);
    router.refresh();
  }

  async function persistCover(url: string) {
    const supabase = createClient();
    await supabase.from("communities").update({ cover_image_url: url }).eq("id", community.id);
    router.refresh();
  }

  async function persistAccent(raw: string | null) {
    // Null clears the override; anything else has to survive normalisation,
    // because the column's check constraint will reject it otherwise.
    const value = raw === null ? null : normalizeAccentColor(raw);
    if (raw !== null && !value) {
      setAccentError("That isn't a valid colour.");
      return;
    }

    const previous = accent;
    setAccent(value);
    setAccentError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("communities")
      .update({ accent_color: value })
      .eq("id", community.id);

    if (error) {
      setAccent(previous);
      setAccentError(error.message);
      return;
    }
    router.refresh();
  }

  async function persistCoverPosition(value: CoverPosition) {
    const previous = coverPosition;
    setCoverPosition(value);

    const supabase = createClient();
    const { error } = await supabase
      .from("communities")
      .update({ cover_position: value })
      .eq("id", community.id);

    if (error) {
      setCoverPosition(previous);
      return;
    }
    router.refresh();
  }

  async function persistMobileCoverPosition(value: MobileCoverPosition | null) {
    const previous = mobileCoverPosition;
    setMobileCoverPosition(value);

    const supabase = createClient();
    const { error } = await supabase
      .from("communities")
      .update({ cover_position_mobile: value })
      .eq("id", community.id);

    if (error) {
      setMobileCoverPosition(previous);
      return;
    }
    router.refresh();
  }

  async function persistShowStats(next: boolean) {
    setShowStats(next);
    setStatsError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("communities")
      .update({ show_stats: next })
      .eq("id", community.id);

    if (error) {
      setShowStats(!next);
      setStatsError(error.message);
      return;
    }
    router.refresh();
  }

  function pickPreset(value: string) {
    setCustomColor(value);
    persistAccent(value);
  }

  function pickCustom(value: string) {
    setCustomColor(value);
    if (customTimer.current) clearTimeout(customTimer.current);
    customTimer.current = setTimeout(() => persistAccent(value), 400);
  }

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label>Logo</Label>
          <div className="mt-2">
            <ImageUpload
              bucket="community-assets"
              basePath={`${community.id}/logo`}
              currentUrl={community.logo_url}
              onUploaded={persistLogo}
              label="Logo"
              hint="Your mark or wordmark. Shown in the sidebar and the mobile menu."
            />
          </div>
        </div>

        <div>
          <Label>Cover image</Label>
          <div className="mt-2">
            {/* Previewed at the shape it actually renders at — a wide banner, not
                a square — so it's clear this slot wants a photograph. */}
            <ImageUpload
              bucket="community-assets"
              basePath={`${community.id}/cover`}
              currentUrl={community.cover_image_url}
              onUploaded={persistCover}
              shape="square"
              size={168}
              aspect={3}
              label="Cover image"
              hint="A wide photo of your place — around 2400×800. Fills the page header."
            />
          </div>

          {community.cover_image_url && (
            <div className="mt-4">
              <Label htmlFor="cover_position">Keep this part of the photo</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                On a laptop the header is a wide band, so your photo is cropped top and bottom and
                the community name sits over its lower edge. Choose the part that matters most.
              </p>
              {community.cover_image_url && (
                <CoverCropPreview
                  url={community.cover_image_url}
                  positionClass={coverPositionPreviewClass(coverPosition)}
                  aspect={WIDE_ASPECT}
                  className="mt-2"
                />
              )}
              <select
                id="cover_position"
                value={coverPosition}
                onChange={(event) => persistCoverPosition(event.target.value as CoverPosition)}
                className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {COVER_POSITIONS.map((position) => (
                  <option key={position.key} value={position.key}>
                    {position.label} — {position.hint}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <Label>On a phone</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  The header is nearly square there, so a wide photo is cropped at the sides instead —
                  which is why a cover can look right on a laptop and lose its subject on a phone.
                  Pick the part of the picture to keep. Leave it unset to use the same crop as above.
                </p>
                <CoverFocalPicker
                  className="mt-2"
                  value={mobileCoverPosition}
                  onPick={persistMobileCoverPosition}
                  onClear={() => persistMobileCoverPosition(null)}
                  previewUrl={community.cover_image_url}
                  fallbackPosition={coverPosition}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(event) => persistShowStats(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          <span>
            <span className="block font-medium text-foreground">Show counts in the header</span>
            <span className="block text-muted-foreground">
              Members, events, businesses and posts, alongside the community name. Off by default —
              the counts make the case that a community is busy, so they help once the numbers are
              worth showing and work against you before then. Counts of zero never appear either way.
            </span>
          </span>
        </label>
        {statsError && <p className="mt-2 text-xs text-danger">{statsError}</p>}
      </div>

      <div className="border-t border-border pt-5">
        <Label>Accent colour</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Used for buttons, links and the active nav item across this community. Leave it unset to
          use the platform&apos;s default.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((preset) => {
            const isActive = accent === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => pickPreset(preset.value)}
                aria-label={preset.name}
                aria-pressed={isActive}
                title={preset.name}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-110",
                  isActive ? "border-foreground" : "border-border"
                )}
                style={{ backgroundColor: preset.value }}
              >
                {isActive && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
              </button>
            );
          })}

          <label className="ml-1 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <input
              type="color"
              value={customColor}
              onChange={(event) => pickCustom(event.target.value)}
              className="h-8 w-8 cursor-pointer rounded-full border border-border bg-transparent p-0"
            />
            Custom
          </label>

          {accent && (
            <button
              type="button"
              onClick={() => persistAccent(null)}
              className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Reset to default
            </button>
          )}
        </div>

        {accentError && <p className="mt-2 text-xs text-danger">{accentError}</p>}
      </div>
    </div>
  );
}
