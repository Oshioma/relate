"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { coverPositionClass } from "@/lib/cover-position";
import { cn } from "@/lib/utils";

// The crop the header is *currently* showing, which is not always the crop
// stored in the database.
//
// Picking a crop writes it and calls router.refresh(), and until that round
// trip lands the header still shows the old one — on a phone on mobile data
// that is seconds of a control that looks like it did nothing. Worse, the whole
// point of the phone crop is that it can only be judged on a phone, which is
// exactly where the wait is longest.
//
// So the choice is held here, shared by the picker and the header image, and
// applied the instant it's made. The write still happens; the refresh still
// follows; this is what the eye sees in between, and it's put back if the write
// turns out to have failed.
type CropState = { position: string | null; mobilePosition: string | null };

type CoverCropValue = {
  crop: CropState;
  applyCrop: (next: Partial<CropState>) => void;
};

const CoverCropContext = createContext<CoverCropValue | null>(null);

export function CoverCropProvider({
  position,
  mobilePosition,
  children,
}: {
  position: string | null;
  mobilePosition: string | null;
  children: React.ReactNode;
}) {
  const [crop, setCrop] = useState<CropState>({ position, mobilePosition });

  const value = useMemo<CoverCropValue>(
    () => ({ crop, applyCrop: (next) => setCrop((current) => ({ ...current, ...next })) }),
    [crop]
  );

  return <CoverCropContext.Provider value={value}>{children}</CoverCropContext.Provider>;
}

export function useCoverCrop(): CoverCropValue {
  const value = useContext(CoverCropContext);
  if (!value) throw new Error("useCoverCrop must be used inside a CoverCropProvider");
  return value;
}

// The header photo itself. A client component only so that it can re-crop the
// moment someone picks — it still renders on the server like everything else,
// so the cover is in the HTML and nothing about the first paint changes.
export function CommunityCoverImage({ src }: { src: string }) {
  const { crop } = useCoverCrop();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn(
        "absolute inset-0 -z-20 h-full w-full object-cover",
        coverPositionClass(crop.position, crop.mobilePosition)
      )}
    />
  );
}
