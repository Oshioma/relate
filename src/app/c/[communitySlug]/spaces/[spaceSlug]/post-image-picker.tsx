"use client";

import { useMemo, useState } from "react";
import { X, Search, Sprout, Leaf, UserCircle2 } from "lucide-react";
import { UploadButton } from "@/components/ui/upload-button";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { cn, isImageUrl, isVideoUrl } from "@/lib/utils";

export interface CropPhotoOption {
  id: string;
  slug: string;
  common_name: string;
  image_url: string | null;
}

// A crop from the member's own "My Crops" (their shamba.online farm), offered
// as a post image source. Mirrors the fields of farm-bridge's FarmCrop that the
// picker needs — kept local so this client component doesn't pull in the
// server-only farm-bridge module.
export interface FarmCropPhotoOption {
  id: string;
  crop_name: string;
  variety: string | null;
  image_url: string | null;
}

interface PostImagePickerProps {
  mediaUrl: string | null;
  onChange: (url: string | null) => void;
  /** Community crop-guide photos the author can borrow an image from. */
  crops?: CropPhotoOption[];
  /** The member's own "My Crops" (farm) photos. */
  myCrops?: FarmCropPhotoOption[];
  /** The member's avatar, offered as a one-tap photo source. */
  avatarUrl?: string | null;
}

type OpenPicker = "crop" | "myCrops" | null;

// Photo controls shared by the new-post composer and the edit form: a preview
// of the chosen media plus its sources — upload from device, a photo from one
// of the member's own crops ("My Crops"), a community crop-guide photo, or the
// member's own avatar. Sources with nothing to show are hidden.
export function PostImagePicker({ mediaUrl, onChange, crops = [], myCrops = [], avatarUrl = null }: PostImagePickerProps) {
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);

  // Only crops that actually have a photo are worth offering as an image.
  const cropsWithPhotos = useMemo(() => crops.filter((c) => c.image_url), [crops]);
  const myCropsWithPhotos = useMemo(() => myCrops.filter((c) => c.image_url), [myCrops]);

  function selectMedia(url: string) {
    onChange(url);
    setOpenPicker(null);
  }

  function togglePicker(which: OpenPicker) {
    setOpenPicker((current) => (current === which ? null : which));
  }

  return (
    <div className="space-y-3">
      {mediaUrl && (
        <div className="relative w-full overflow-hidden rounded-md border border-border">
          {/* Show the chosen media the same way the post will — a generous
              banner for photos/videos, a link for documents — so what you pick
              is what you get. */}
          {isImageUrl(mediaUrl) || isVideoUrl(mediaUrl) ? (
            <div className="aspect-[3/2] w-full bg-muted">
              {isVideoUrl(mediaUrl) ? (
                <video preload="metadata" src={mediaUrl} className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          ) : (
            <div className="p-3">
              <MediaAttachment url={mediaUrl} />
            </div>
          )}
          <button
            type="button"
            title="Remove photo"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground shadow-sm backdrop-blur hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {openPicker === "myCrops" && (
        <PhotoGrid
          items={myCropsWithPhotos.map((c) => ({
            id: c.id,
            label: c.variety ? `${c.crop_name} · ${c.variety}` : c.crop_name,
            searchText: `${c.crop_name} ${c.variety ?? ""}`,
            imageUrl: c.image_url as string,
          }))}
          onSelect={selectMedia}
          placeholder="Search your crops…"
          emptyText="None of your crops have a photo yet."
        />
      )}

      {openPicker === "crop" && (
        <PhotoGrid
          items={cropsWithPhotos.map((c) => ({
            id: c.id,
            label: c.common_name,
            searchText: c.common_name,
            imageUrl: c.image_url as string,
          }))}
          onSelect={selectMedia}
          placeholder="Search crop guides…"
          emptyText="No crop guides with photos found."
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <UploadButton kind="any" label={mediaUrl ? "Change photo" : "Upload"} onUploaded={onChange} />

        {myCropsWithPhotos.length > 0 && (
          <SourceButton
            active={openPicker === "myCrops"}
            onClick={() => togglePicker("myCrops")}
            icon={<Leaf className="h-3.5 w-3.5 shrink-0" />}
            label="My Crops"
          />
        )}

        {cropsWithPhotos.length > 0 && (
          <SourceButton
            active={openPicker === "crop"}
            onClick={() => togglePicker("crop")}
            icon={<Sprout className="h-3.5 w-3.5 shrink-0" />}
            label="Choose a crop"
          />
        )}

        {avatarUrl && (
          <button
            type="button"
            onClick={() => selectMedia(avatarUrl)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            <UserCircle2 className="h-3.5 w-3.5 shrink-0" />
            Use my photo
          </button>
        )}
      </div>
    </div>
  );
}

// A source toggle in the composer's button row (the crop / My Crops pickers).
function SourceButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface PhotoGridItem {
  id: string;
  label: string;
  searchText: string;
  imageUrl: string;
}

// A searchable thumbnail grid, shared by the "My Crops" and crop-guide sources.
function PhotoGrid({
  items,
  onSelect,
  placeholder,
  emptyText,
}: {
  items: PhotoGridItem[];
  onSelect: (url: string) => void;
  placeholder: string;
  emptyText: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.searchText.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-card py-1.5 pl-8 pr-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{items.length === 0 ? emptyText : "No matches."}</p>
      ) : (
        <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.imageUrl)}
              className="group overflow-hidden rounded-md border border-border text-left transition-colors hover:border-accent"
            >
              <div className="aspect-[3/2] bg-accent-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.label} className="h-full w-full object-cover" />
              </div>
              <span className="block truncate px-1.5 py-1 text-xs text-foreground group-hover:text-accent">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
