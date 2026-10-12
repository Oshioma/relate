"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { commonsSrcSet } from "@/lib/guides/commons-image";

// Responsive, lazy guide photo.
//
// Commons originals get a real srcset (see src/lib/guides/commons-image.ts),
// so a phone never downloads the 4000px original. Other sources (directory
// uploads on Supabase) render as a plain lazy image. The frame has a fixed aspect ratio and a muted background, so
// nothing shifts while a photo loads, and a photo that fails to load leaves a
// calm placeholder rather than a broken-image icon.

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
