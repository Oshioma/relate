"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Responsive, lazy guide photo.
//
// Wikimedia Commons serves ready-made thumbnails at fixed widths, so a
// Commons original gets a real srcset (500 → 1920px) and the browser picks
// the smallest that fills the slot — a phone never downloads the 4000px
// original. Other sources (directory uploads on Supabase) render as a plain
// lazy image. The frame has a fixed aspect ratio and a muted background, so
// nothing shifts while a photo loads, and a photo that fails to load leaves a
// calm placeholder rather than a broken-image icon.

const COMMONS_PREFIX = "https://upload.wikimedia.org/wikipedia/commons/";
const COMMONS_WIDTHS = [500, 960, 1280, 1920];

function commonsThumb(src: string, width: number): string {
  // .../commons/a/ab/File.jpg -> .../commons/thumb/a/ab/File.jpg/960px-File.jpg
  const rest = src.slice(COMMONS_PREFIX.length);
  const file = rest.split("/").pop() ?? "";
  return `${COMMONS_PREFIX}thumb/${rest}/${width}px-${file}`;
}

export function commonsSrcSet(src: string, originalWidth?: number): { src: string; srcSet?: string } {
  if (!src.startsWith(COMMONS_PREFIX) || src.includes("/thumb/") || /\.(svg|tiff?)$/i.test(src)) return { src };
  const widths = COMMONS_WIDTHS.filter((w) => !originalWidth || w < originalWidth);
  if (widths.length === 0) return { src };
  return {
    src: commonsThumb(src, widths[Math.min(1, widths.length - 1)]),
    srcSet: [...widths.map((w) => `${commonsThumb(src, w)} ${w}w`), ...(originalWidth && originalWidth <= 2400 ? [`${src} ${originalWidth}w`] : [])].join(", "),
  };
}

export function GuideImage({
  src,
  alt,
  width,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  width?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const { src: resolved, srcSet } = commonsSrcSet(src, width);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground" aria-hidden>
          <ImageOff className="h-6 w-6" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- Commons thumbnails are already right-sized via srcset; next/image would refetch them through the optimiser
        <img
          src={resolved}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
